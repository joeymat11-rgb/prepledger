"use strict";
const C = require("./codec.cjs");

// R1's finite transport controller. Persistence and positive/negative ingress
// belong to W6. A completed assembly is evidence only: this module has no
// receipt sink, outbox, permission budget or account activation callback.
const LIMITS = Object.freeze({ restarts: 2, retries: 2, timeoutMs: 30000, attemptMs: 600000 });
const MESSAGE = "Restore incomplete. Pause changes on your other device, then try again.";
const clone = value => JSON.parse(JSON.stringify(value));

function createRestoreTransport({ fetchPage, verifier, persistence, newRequest, expected,
  observeNegative, context = "RESTORE", monotonicMs = () => performance.now(), timers = { setTimeout, clearTimeout } }) {
  if (!["RESTORE", "REFRESH"].includes(context)) throw new TypeError("explicit restore or ordinary-refresh context required");
  for (const fn of [fetchPage, newRequest, expected, observeNegative, persistence?.load,
    persistence?.save, verifier?.verifyManifest, verifier?.verifyPage, verifier?.assemble])
    if (typeof fn !== "function") throw new TypeError("complete transport and durable ingress seams required");
  let running = false;
  async function run({ explicitRetry = false } = {}) {
    if (running) return { complete: false, code: "ATTEMPT_RUNNING" };
    running = true;
    let record, begun = monotonicMs();
    const elapsed = () => {
      const now = monotonicMs();
      return Number.isFinite(begun) && Number.isFinite(now) && now >= begun ? now - begun : Infinity;
    };
    const bounded = async action => {
      const left = LIMITS.attemptMs - elapsed();
      if (!(left > 0)) throw new Error("WATCHDOG_EXHAUSTED");
      let timer;
      try { const result = await Promise.race([Promise.resolve().then(action), new Promise((_, reject) => {
        timer = timers.setTimeout(() => reject(new Error("WATCHDOG_EXHAUSTED")), left);
      })]);
        // Timers can be delivered late after backgrounding or a busy loop.
        // Check the monotonic boundary again before consuming any completion.
        if(elapsed() >= LIMITS.attemptMs) throw new Error("WATCHDOG_EXHAUSTED");
        return result;
      } finally { if(timer !== undefined) timers.clearTimeout(timer); }
    };
    const save = async () => {
      if (await bounded(() => persistence.save(clone(record))) !== true) throw new Error("ATTEMPT_PERSISTENCE_FAILED");
    };
    const incomplete = async reason => {
      record = { ...(record || {}), status: "EXHAUSTED", reason };
      try { await save(); } catch (_) { /* An unproved fence remains recovery. */ }
      // This is a recovery recommendation, never an assignment over existing
      // standing. An ordinary refresh retains established truth and cannot
      // acquire checkpoint credit or invent a new storage-loss state.
      return { complete: false, code: "RESTORE_INCOMPLETE", ...(context === "RESTORE" ? { recoveryState: 18 } : {}),
        checkpoint: false, preserveKnownStates: true, message: MESSAGE, reason };
    };
    const boundedFetch = async body => {
      if (elapsed() >= LIMITS.attemptMs) throw new Error("WATCHDOG_EXHAUSTED");
      const controller = new AbortController();
      let timer;
      try {
        const reply = await Promise.race([
          Promise.resolve().then(() => fetchPage(body, { signal: controller.signal })).then(async reply => {
            // Late responses still pass the negative-ingress seam after timeout.
            // A signed 200 page can contain terminal negative evidence. The
            // ingress seam authenticates/classifies EVERY raw response,
            // including a response arriving after this request timed out.
            try { await observeNegative(reply); }
            catch (_) { throw new Error("NEGATIVE_INGRESS_UNPROVEN"); }
            return reply;
          }),
          new Promise((_, reject) => { timer = timers.setTimeout(() => {
            controller.abort(); reject(new Error("REQUEST_TIMEOUT"));
          }, Math.min(LIMITS.timeoutMs, LIMITS.attemptMs - elapsed())); }),
        ]);
        // Observe authenticated negative ingress even when the attempt became
        // stale or exhausted while the network response was arriving.
        if (elapsed() >= LIMITS.attemptMs) throw new Error("WATCHDOG_EXHAUSTED");
        return reply;
      } finally { if (timer !== undefined) timers.clearTimeout(timer); }
    };
    try {
      const prior = await bounded(() => persistence.load());
      if (prior && !explicitRetry) {
        // ALL surviving markers (even a late COMPLETE write) require explicit
        // Retry. They are transport bookkeeping, never a proof/activation.
        record = prior;
        return await incomplete("EXPLICIT_RETRY_REQUIRED");
      }
      if (!Number.isFinite(begun)) return await incomplete("MONOTONIC_UNAVAILABLE");
      record = { status: "ACTIVE", restarts: 0, requests: 0, page: 0 };
      await save();
      const seenNonces = new Set();
      for (;;) {
        const request = await bounded(newRequest);
        if (!request || typeof request.nonce !== "string" || seenNonces.has(request.nonce)) return await incomplete("NONCE_REUSED");
        seenNonces.add(request.nonce);
        const requestBytes = C.encode(request), captured = clone(await bounded(() => expected(request)));
        const pages = [];
        let manifest = null, restart = false, count = 1;
        for (let index = 0; index < count; index++) {
          let response;
          for (let retry = 0; retry <= LIMITS.retries; retry++) {
            record.page = index; record.requests++; await save();
            try {
              response = await boundedFetch({ request, continuation: manifest, page_index: index });
              break;
            } catch (cause) {
              if (["WATCHDOG_EXHAUSTED", "NEGATIVE_INGRESS_UNPROVEN"].includes(cause.message) || retry === LIMITS.retries) throw cause;
            }
          }
          if (response?.status === 409 && response.body?.error?.code === "SNAPSHOT_CHANGED") {
            restart = true; break;
          }
          if (response?.status !== 200) return await incomplete("REMOTE_REFUSAL");
          if (!manifest) {
            manifest = response.body.manifest_b64;
            const result = await bounded(() => verifier.verifyManifest(C.decode64(manifest, C.LIMITS.request), captured));
            if (result?.verified !== true || !Number.isSafeInteger(result.value.page_count) ||
              result.value.page_count < 1 || result.value.page_count > C.LIMITS.pages) return await incomplete("INVALID_MANIFEST");
            count = result.value.page_count;
          } else if (response.body.manifest_b64 !== manifest) return await incomplete("MIXED_MANIFEST");
          const pageBytes = C.encode(response.body.page);
          const checked = await bounded(() => verifier.verifyPage(pageBytes, C.decode64(manifest, C.LIMITS.request), captured));
          if (checked?.verified !== true || checked.value.index !== index) return await incomplete("INVALID_PAGE");
          pages.push(pageBytes);
        }
        if (restart) {
          if (record.restarts === LIMITS.restarts) return await incomplete("RESTARTS_EXHAUSTED");
          record.restarts++; await save(); continue;
        }
        const assembled = await bounded(() => verifier.assemble(C.decode64(manifest, C.LIMITS.request), pages, requestBytes, captured));
        if (assembled?.verified !== true || elapsed() >= LIMITS.attemptMs)
          return await incomplete("ASSEMBLY_INCOMPLETE");
        record.status = "COMPLETE"; await save();
        return { complete: true, evidence: assembled.value };
      }
    } catch (cause) { return await incomplete(cause.message === "ATTEMPT_PERSISTENCE_FAILED"
      ? "ATTEMPT_PERSISTENCE_FAILED" : "TRANSPORT_EXHAUSTED"); }
    finally { running = false; }
  }
  return Object.freeze({ run });
}
module.exports = { createRestoreTransport, LIMITS, MESSAGE };
