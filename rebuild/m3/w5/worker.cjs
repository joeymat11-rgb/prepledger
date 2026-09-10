"use strict";

const { createAuthenticator, AuthenticationError } = require("./auth.cjs");
const { signReceipt, signPull, signCurrentHead, signSnapshot, signServerTime, verifyLease, activeKeyId } = require("./crypto.cjs");
const { WIRE_VERSION, TIME_PROFILE, HISTORY_PROFILE } = require("./public-client.cjs");
const { handleR1, ROUTES: R1_ROUTES } = require("./reconciliation/http.cjs");

const ROUTES = new Set(["/op", "/pull", "/time", "/lease", "/enrol", "/snapshot", "/import", "/restore"]);
const identifier = value => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(value);
const watermark = value => Number.isSafeInteger(value) && value >= 0;
const MAX_REQUEST_BYTES = 262144;

async function boundedBody(request, limit = MAX_REQUEST_BYTES, preserveBOM = false) {
  const tooLarge = () => { const error = new Error("Request too large"); error.code = "REQUEST_TOO_LARGE"; throw error; };
  const declared = request.headers.get("content-length");
  if (declared !== null && /^\d+$/.test(declared) && Number(declared) > limit) tooLarge();
  if (!request.body) return "";
  const reader = request.body.getReader(), decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: preserveBOM });
  let bytes = 0, text = "";
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > limit) { await reader.cancel(); tooLarge(); }
      text += decoder.decode(chunk.value, { stream: true });
    }
    return text + decoder.decode();
  } finally { reader.releaseLock(); }
}

function createWorker({ bridge, authorityKey, auth, clock = () => new Date().toISOString() }) {
  const authenticate = createAuthenticator(auth);
  const now = () => typeof clock === "function" ? clock() : clock.now();
  const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, no-store, max-age=0",
    "CDN-Cache-Control": "no-store", "Cloudflare-CDN-Cache-Control": "no-store",
    "Pragma": "no-cache", "Vary": "Authorization, Origin", "X-Content-Type-Options": "nosniff",
    "Earned-Wire-Version": WIRE_VERSION,
  } });
  const error = (status, code, state) => reply(status, { error: { code, ...(state === undefined ? {} : { state }) } });
  return {
    async fetch(request) {
      let r1 = false;
      try {
        // Authenticate every route before parsing a body or looking up its scope.
        const principal = authenticate(request, new Date(now()).getTime());
        const url = new URL(request.url);
        const rowsRoute = url.pathname === '/reconcile/rows';
        const sourceRoute = url.pathname === '/import' && bridge.sourceProfile === 'earned/source-import/v1';
        r1 = rowsRoute || sourceRoute || R1_ROUTES.has(url.pathname);
        if (!ROUTES.has(url.pathname) && !r1) return error(404, "NOT_FOUND");
        if (request.method !== "POST") return error(405, "METHOD_NOT_ALLOWED");
        if (url.search || !(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json"))
          return error(400, "MALFORMED_REQUEST");
        let raw;
        try { raw = await boundedBody(request, rowsRoute ? require('./reconciliation/paged-codec.cjs').LIMITS.request : sourceRoute ? MAX_REQUEST_BYTES : r1 ? 1048576 : MAX_REQUEST_BYTES, rowsRoute || sourceRoute); }
        catch (cause) {
          if (r1) return reply(cause.code === "REQUEST_TOO_LARGE" ? 413 : 400, { error: {
            code: cause.code === "REQUEST_TOO_LARGE" ? "RECONCILE_LIMIT" : "INVALID_R1_REQUEST", retryable: false } });
          return error(cause.code === "REQUEST_TOO_LARGE" ? 413 : 400,
          cause.code === "REQUEST_TOO_LARGE" ? "REQUEST_TOO_LARGE" : "MALFORMED_REQUEST"); }
        if (r1) {
          if(sourceRoute){
            if(typeof bridge.sourceScoped!=='function')return error(501,'NOT_IMPLEMENTED');
            const result=await bridge.sourceScoped(principal.subject,raw,{issuer:auth.issuer,origin:principal.origin});
            if(result?.status==='UNAVAILABLE')return error(503,'UNAVAILABLE');
            // The source result is an acknowledgement only. Activation evidence
            // is its immutable binding in a COMPLETE signed rows-v4 inventory.
            return reply(200,result);
          }
          if(rowsRoute){
            if(typeof bridge.rowsScoped!=='function')return reply(409,{error:{code:'PROFILE_UNSUPPORTED',retryable:false}});
            return reply(200,await bridge.rowsScoped(principal.subject,raw,{issuer:auth.issuer,origin:principal.origin}));
          }
          const result = await handleR1({ route: url.pathname, raw, principal, auth, bridge, authorityKey });
          return reply(result.status, result.body);
        }
        let body;
        try { body = JSON.parse(raw); } catch (_) { return error(400, "MALFORMED_REQUEST"); }
        if (!body || typeof body !== "object" || Array.isArray(body) || !identifier(body.device_id))
          return error(400, "MALFORMED_REQUEST");
        // An athlete selector is never accepted even when it happens to match.
        if (Object.hasOwn(body, "athlete_id") || Object.hasOwn(body, "subject")) return error(403, "SCOPE_FORBIDDEN", 17);
        const scoped = (method, args = []) => bridge.invokeScoped(principal.subject, body.device_id, method, args);
        const scope = url.pathname === "/enrol"
          ? await scoped("enrol")
          : await scoped("scope");
        if (scope && scope.status === "UNAVAILABLE") return error(503, "UNAVAILABLE");
        if (!scope || !scope.athlete_id || scope.device_id !== body.device_id) return error(403, "SCOPE_FORBIDDEN", 17);
        const athlete = scope.athlete_id, device = scope.device_id;
        if (url.pathname === "/enrol") {
          if (!verifyLease(scope.lease, authorityKey) || scope.lease.athlete_id !== athlete || scope.lease.device_id !== device)
            return error(503, "UNAVAILABLE");
          return reply(200, { lease: scope.lease });
        }
        if (url.pathname === "/import" || url.pathname === "/restore") return error(501, "NOT_IMPLEMENTED");
        if (url.pathname === "/op") {
          const operation = body.operation;
          if (!operation || typeof operation !== "object" || Array.isArray(operation)) return error(400, "MALFORMED_REQUEST");
          if (operation.athlete_id !== athlete || operation.device_id !== device) return error(403, "SCOPE_FORBIDDEN", 17);
          // The bridge checks subject/device/athlete again in this operation's
          // staged snapshot; its revision assertion also guards that binding.
          const disposition = await scoped("admit", [athlete, operation]);
          if (!disposition || disposition.status === "UNAVAILABLE") return error(503, "UNAVAILABLE");
          return reply(200, { disposition });
        }
        if (url.pathname === "/pull") {
          if (!watermark(body.after)) return error(400, "MALFORMED_REQUEST");
          const challenged = Object.hasOwn(body, "history_profile");
          if (challenged && (body.history_profile !== HISTORY_PROFILE || typeof body.challenge !== "string" ||
              !/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/.test(body.challenge)))
            return error(400, "MALFORMED_REQUEST");
          const rows = await scoped("receipts", [athlete, 0]);
          if (!Array.isArray(rows)) return error(503, "UNAVAILABLE");
          const through = rows.length ? rows[rows.length - 1].seq : 0;
          if (body.after > through) return error(409, "FRONTIER_AHEAD", 18);
          const receipts = rows.filter(row => row.seq > body.after).map(row => signReceipt({
            seq: row.seq, op_id: row.op.op_id, canonical_content_commitment: row.op.canonical_content_commitment,
            accepted_at: row.accepted_at, op: row.op,
          }, authorityKey));
          if (challenged) return reply(200, signCurrentHead({ wire_version: WIRE_VERSION,
            key_epoch: activeKeyId(authorityKey), history_profile: HISTORY_PROFILE, challenge: body.challenge,
            athlete_id: athlete, device_id: device, after: body.after, through, head: through, receipts }, authorityKey));
          return reply(200, signPull({ wire_version: WIRE_VERSION, key_epoch: activeKeyId(authorityKey),
            athlete_id: athlete, device_id: device, after: body.after, through, receipts }, authorityKey));
        }
        if (url.pathname === "/snapshot") {
          if (!watermark(body.watermark)) return error(400, "MALFORMED_REQUEST");
          const snapshot = await scoped("exportSnapshot", [athlete, {}]);
          if (!snapshot || snapshot.status === "UNAVAILABLE" || !Array.isArray(snapshot.entries))
            return error(503, "UNAVAILABLE");
          if (body.watermark > snapshot.W) return error(409, "FRONTIER_AHEAD", 18);
          const entries = snapshot.entries.filter(row => row.seq <= body.watermark).map(row => signReceipt({
            seq: row.seq, op_id: row.op.op_id, canonical_content_commitment: row.op.canonical_content_commitment,
            accepted_at: row.accepted_at, op: row.op,
          }, authorityKey));
          return reply(200, signSnapshot({ wire_version: WIRE_VERSION, key_epoch: activeKeyId(authorityKey),
            athlete_id: athlete, device_id: device, W: body.watermark,
            partial: false, pending: 0, records: entries.length, entries,
            label: `Complete through W${body.watermark} for all synced records`,
            rejectedAppendix: [], otherDeviceNote: snapshot.otherDeviceNote,
          }, authorityKey));
        }
        if (url.pathname === "/time") {
          if (typeof body.challenge !== "string" || !/^[A-Za-z0-9_-]{22,128}$/.test(body.challenge))
            return error(400, "MALFORMED_REQUEST");
          return reply(200, signServerTime({ wire_version: WIRE_VERSION, time_profile: TIME_PROFILE,
            key_epoch: activeKeyId(authorityKey), athlete_id: athlete, device_id: device,
            challenge: body.challenge, server_time: now() }, authorityKey));
        }
        if (url.pathname === "/lease") {
          const lease = await scoped("lease", [athlete, device]);
          if (!verifyLease(lease, authorityKey) || lease.athlete_id !== athlete || lease.device_id !== device)
            return error(503, "UNAVAILABLE");
          return reply(200, { lease });
        }
        return error(404, "NOT_FOUND");
      } catch (cause) {
        // Missing/expired transport credentials require sign-in to SYNC. They
        // are not proof that a valid offline-write lease has been revoked.
        if (cause instanceof AuthenticationError) return error(401, "UNAUTHENTICATED", 11);
        if (cause && cause.code === "SCOPE_FORBIDDEN") return error(403, "SCOPE_FORBIDDEN", 17);
        if (r1 && cause?.name === "R1Error") return reply(cause.status, { error: {
          code: cause.code, ...(cause.state === undefined ? {} : { state: cause.state }), retryable: cause.retryable === true } });
        // Never expose provider errors, token material, operation bodies or stacks.
        return r1 ? reply(503, { error: { code: "UNAVAILABLE", retryable: true } }) : error(503, "UNAVAILABLE");
      }
    },
  };
}

module.exports = { createWorker, ROUTES };
