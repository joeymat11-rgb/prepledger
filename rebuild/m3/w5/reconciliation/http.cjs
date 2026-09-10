"use strict";
const { randomBytes } = require("node:crypto");
const { signatureOver, verifyRecord, activeKeyId } = require("../crypto.cjs");
const C = require("./codec.cjs");
const ROUTES = new Set(["/enrol/create", "/lease/renew", "/reconcile", "/recovery/replay"]);
const signed = (value, key) => ({ ...value, authority_signature: signatureOver(value, key, value.profile) });
function requireAvailable(value) {
  if (!value || value.status === "UNAVAILABLE") throw new C.R1Error("UNAVAILABLE", 503, true);
  return value;
}
async function handleR1({ route, raw, principal, auth, bridge, authorityKey }) {
  const body = C.validateRouteRequest(route, C.parse(raw, C.LIMITS.request));
  const context = { issuer: auth.issuer, origin: principal.origin };
  if (route !== "/reconcile") {
    let result, profile;
    if (route === "/enrol/create") {
      result = await bridge.enrollScoped(principal.subject, body, context); profile = C.DOMAINS.enrollment;
    } else if (route === "/lease/renew") {
      result = await bridge.renewScoped(principal.subject, body.device_id, body, context); profile = C.DOMAINS.renewal;
    } else {
      const envelopeBytes = C.decode64(body.envelope_b64, C.LIMITS.request);
      result = await bridge.recoveryReplayScoped(principal.subject, body.device_id,
        { envelope: C.parse(envelopeBytes, C.LIMITS.request), envelopeBytes }, context);
      profile = C.DOMAINS.replay;
    }
    requireAvailable(result);
    return { status: 200, body: signed(C.makeResult({ keyEpoch: activeKeyId(authorityKey), profile,
      scopeDigest: result.scopeDigest, nonce: body.nonce, intentDigest: result.intentDigest,
      payload: result.payload }), authorityKey) };
  }
  const requestBytes = C.decode64(body.request_b64, C.LIMITS.request), request = C.decodeRequest(requestBytes);
  let manifest, manifestBytes;
  if (body.continuation !== null) {
    manifestBytes = C.decode64(body.continuation, C.LIMITS.request);
    manifest = C.parse(manifestBytes, C.LIMITS.request);
    C.exact(manifest, [...C.FIELDS.manifest, "authority_signature"], { ordered: true });
    if (manifest.profile !== C.DOMAINS.manifest ||
      !verifyRecord(manifest, authorityKey, C.DOMAINS.manifest) ||
      manifest.authority_signature.split(".")[1] !== manifest.key_epoch ||
      manifest.nonce !== request.nonce || manifest.context_id !== request.context_id ||
      manifest.request_digest !== C.hash("request", requestBytes) ||
      manifest.page_bytes !== C.LIMITS.page || !C.safe(manifest.page_count, 1) ||
      manifest.page_count > C.LIMITS.pages || !C.safe(manifest.payload_bytes, 1) ||
      manifest.payload_bytes > C.LIMITS.payload || manifest.page_count !== Math.ceil(manifest.payload_bytes / C.LIMITS.page) ||
      !C.digestValue(manifest.snapshot_id) || !C.digestValue(manifest.payload_digest) ||
      !C.digestValue(manifest.coverage_digest) || body.page_index >= manifest.page_count)
      throw new C.R1Error("INVALID_R1_REQUEST");
  }
  // Scope/standing/projection and revision guard are one bridge invocation.
  // No first-page cache authorizes later pages after revocation or closure.
  const projection = requireAvailable(await bridge.reconcileScoped(principal.subject, body.device_id,
    request, manifest?.payload_digest, context));
  if (manifest) {
    if (manifest.scope_digest !== projection.scopeDigest) throw new C.R1Error("INVALID_R1_REQUEST");
    if (C.hash("payload", projection.payloadBytes) !== manifest.payload_digest ||
      C.hash("coverage", C.encode(projection.payload.coverage)) !== manifest.coverage_digest)
      throw new C.R1Error("SNAPSHOT_CHANGED", 409, true);
  } else {
    manifest = signed(C.makeManifest({ keyEpoch: activeKeyId(authorityKey), scopeDigest: projection.scopeDigest,
      requestBytes, snapshotId: randomBytes(32).toString("base64url"), payloadBytes: projection.payloadBytes,
      coverage: projection.payload.coverage }), authorityKey);
    manifestBytes = C.encode(manifest);
  }
  const page = signed(C.makePage({ keyEpoch: activeKeyId(authorityKey), manifestBytes,
    payloadBytes: projection.payloadBytes, index: body.page_index }), authorityKey);
  return { status: 200, body: { manifest_b64: C.encode64(manifestBytes), page } };
}
module.exports = { handleR1, ROUTES };
