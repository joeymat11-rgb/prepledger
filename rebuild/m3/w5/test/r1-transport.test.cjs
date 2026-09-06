"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict");
const { createRestoreTransport, LIMITS } = require("../reconciliation/transport.cjs");
const C = require("../reconciliation/codec.cjs");
// Synthetic controller tests. These stand-ins prove finite transport behavior,
// not real signatures, K1 durability or the physical phone's recovery sink.
function fixture(overrides = {}) {
  let saved = null, calls = 0, nonces = 0, negatives = 0, now = 0;
  const state = { saved: () => saved, calls: () => calls, nonces: () => nonces,
    negatives: () => negatives, advance: ms => { now += ms; } };
  const options = {
    fetchPage: async ({ page_index }) => { calls++; return { status: 200, body: {
      manifest_b64: C.encode64(C.encode({synthetic:true})), page: { index: page_index } } }; },
    verifier: { verifyManifest: async () => ({ verified: true, value: { page_count: 2 } }),
      verifyPage: async page => ({ verified: true, value: C.parse(page) }),
      assemble: async () => ({ verified: true, value: { syntheticOnly: true } }) },
    persistence: { load: async () => saved, save: async value => { saved = structuredClone(value); return true; } },
    newRequest: async () => ({ nonce: String(++nonces) }), expected: async request => ({ nonce: request.nonce }),
    observeNegative: async () => { negatives++; }, monotonicMs: () => now,
    ...overrides,
  };
  return { ...state, options, controller: createRestoreTransport(options) };
}
test("quiet interval assembles once; rerun needs explicit Retry", async () => {
  const f = fixture(); assert.equal((await f.controller.run()).complete, true);
  assert.equal(f.calls(), 2); assert.equal(f.saved().status, "COMPLETE");
  assert.equal((await f.controller.run()).reason, "EXPLICIT_RETRY_REQUIRED");
  assert.equal(f.calls(), 2);
  assert.equal((await f.controller.run({ explicitRetry: true })).complete, true);
});
test("faster writer terminates at three manifests; quiet explicit retry succeeds", async () => {
  let busy = true, calls = 0;
  const f = fixture({ fetchPage: async ({ page_index }) => { calls++; return busy
    ? { status: 409, body: { error: { code: "SNAPSHOT_CHANGED" } } }
    : { status: 200, body: { manifest_b64: C.encode64(C.encode({synthetic:true})), page: { index: page_index } } }; } });
  assert.equal((await f.controller.run()).reason, "RESTARTS_EXHAUSTED");
  assert.equal(calls, 3); assert.equal(f.nonces(), 3); assert.equal(f.negatives(), 3);
  busy = false; assert.equal((await f.controller.run({ explicitRetry: true })).complete, true);
});
test("network outage tries one page at most three times", async () => {
  let calls = 0; const f = fixture({ fetchPage: async () => { calls++; throw Error("offline"); } });
  const result = await f.controller.run(); assert.equal(result.complete, false);
  assert.equal(calls, 3); assert.equal(result.recoveryState, 18);
});
test("persisted interrupted attempt cannot silently reset on a new controller", async () => {
  const f = fixture(); await f.options.persistence.save({ status: "ACTIVE", restarts: 2, requests: 4, page: 1 });
  const reopened = createRestoreTransport(f.options);
  assert.equal((await reopened.run()).reason, "EXPLICIT_RETRY_REQUIRED"); assert.equal(f.calls(), 0);
});
test("invalid page cannot reach assembly", async () => {
  let assembled = 0; const f = fixture();
  f.options.verifier.verifyPage = async () => ({ verified: false });
  f.options.verifier.assemble = async () => { assembled++; return { verified: true }; };
  assert.equal((await f.controller.run()).reason, "INVALID_PAGE"); assert.equal(assembled, 0);
});
test("monotonic watchdog expires without treating it as lease expiry", async () => {
  const f = fixture(); const original = f.options.fetchPage;
  f.options.fetchPage = async body => { f.advance(LIMITS.attemptMs); return original(body); };
  const result = await createRestoreTransport(f.options).run();
  assert.equal(result.complete, false); assert.equal(result.recoveryState, 18); assert.notEqual(result.state, 20);
});
test("negative ingress failure stops immediately; token reply is not activation", async () => {
  let calls = 0; const f = fixture({ fetchPage: async () => { calls++; return { status: 403, body: { error: { state: 17 } } }; },
    observeNegative: async () => { throw Error("fence persistence failed"); } });
  assert.equal((await f.controller.run()).complete, false); assert.equal(calls, 1);
});
test("failed attempt persistence prevents transport", async () => {
  const f = fixture({ persistence: { load: async () => null, save: async () => false } });
  assert.equal((await f.controller.run()).reason, "ATTEMPT_PERSISTENCE_FAILED"); assert.equal(f.calls(), 0);
});
test("timeout aborts; late authenticated negatives still reach ingress", async () => {
  const callbacks = [], pending = [], seen = [];
  const f = fixture({ fetchPage: (body, { signal }) => new Promise(resolve => { pending.push({ resolve, signal }); }),
    timers: { setTimeout: (fn,ms) => { if(ms===LIMITS.timeoutMs) callbacks.push(fn); return fn; }, clearTimeout() {} },
    observeNegative: async reply => { seen.push(reply.body.error.state); } });
  const running = f.controller.run();
  for (let i = 0; i < 3; i++) { while (!callbacks[i]) await new Promise(r => setImmediate(r)); callbacks[i](); }
  assert.equal((await running).complete, false);
  for (const p of pending) { assert.equal(p.signal.aborted, true); p.resolve({ status: 403, body: { error: { state: 17 } } }); }
  await new Promise(r => setImmediate(r)); assert.deepEqual(seen, [17,17,17]);
});
