import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";
import { createHash as nodeHash, createHmac as nodeHmac } from "node:crypto";
import { createHash, createHmac } from "../node-sha256-browser.mjs";
import { Client, O, config } from "./support.mjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const here = resolve(root, "rebuild/m3/w6");
const BASE = "cb5580a3c3b778e614127026a3769d383f07611b";
const state = backend => JSON.stringify(Object.fromEntries(backend.collections().map(name => [name, Object.fromEntries(backend.keys(name).map(key => [key, backend.get(name, key)]))])));
function client(extra = {}) {
  const backend = Client.memoryBackend(); const cfg = { ...config(), backend, ...extra };
  const c = Client.createClient(cfg); c.boot(); return { c, backend, cfg };
}
test("unchanged defaults: exact35 law traces and56 full action/clock/state vectors against accepted T2", () => {
  mkdirSync(join(here, ".tmp"), { recursive: true });
  const dir = mkdtempSync(join(here, ".tmp/default-baseline-"));
  try {
    const files = execFileSync("git", ["ls-tree", "-r", "--name-only", BASE, "rebuild/client"], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/).filter(name => name.endsWith(".cjs"));
    for (const name of files) writeFileSync(join(dir, name.split("/").at(-1)), execFileSync("git", ["show", `${BASE}:${name}`], { cwd: root }));
    const run = path => JSON.parse(execFileSync(process.execPath, [join(here, "test/default-worker.cjs")], { cwd: root, env: { ...process.env, EARNED_CLIENT_DIR: path }, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }));
    const baseline = run(dir), candidate = run(join(root, "rebuild/client"));
    assert.equal(baseline.verdicts.length, 35); assert(baseline.verdicts.every(law => law.ok));
    assert.deepEqual(candidate, baseline); assert.equal(candidate.actions.length, 56);
    const exhausted = candidate.actions.find(item => item.name === "range-last-and-next" && item.tz === "+00:00");
    assert.equal(exhausted.results[1].result.state, 20);
    assert.equal(exhausted.face.state, 1); // Preserved default T2 face gap, not a W6 permission verdict.
    console.log("W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors; accepted T2 baseline " + BASE);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test("optional public verifier pair requires both functions; no authority HMAC dummy", () => {
  for (const value of [null, {}, { verifyLease() { return true; } }]) assert.throws(() => client({ authorityVerification: value, authorityKey: undefined }));
  assert.doesNotThrow(() => client({ authorityKey: undefined, authorityVerification: { verifyLease: () => true, verifyDisposition: () => true } }));
});
test("invalid optional permission time refuses20 before lease verifier with retained value and no write", () => {
  for (const value of [undefined, null, 42, NaN, Infinity, "not-a-time", "275761-01-01T00:00:00Z", {}, Promise.resolve("2026-09-04T00:00:00Z")]) {
    let calls = 0; const { c, backend } = client({ permissionNowIso: () => value, authorityVerification: { verifyLease() { calls++; return true; }, verifyDisposition: () => true } });
    const before = state(backend), result = c.weighIn({ lb: 170 });
    assert.equal(result.acknowledged, false); assert.equal(result.state, 20); assert.equal(c.fieldValue("weighIn"), 170); assert.equal(calls, 0); assert.equal(state(backend), before);
  }
  const { c, backend } = client({ permissionNowIso() { throw new Error("unavailable"); } });
  const before = state(backend); assert.equal(c.weighIn({ lb: 170 }).state, 20); assert.equal(state(backend), before);
  const revoked = client({ standing: "revoked", permissionNowIso() { throw new Error(); } }).c;
  assert.equal(revoked.weighIn({ lb: 170 }).state, 17);
});
test("predicates only accept true; throw/object/Promise never authorize a write or drain", () => {
  for (const verify of [() => false, () => ({}), () => Promise.resolve(true), () => Promise.reject(new Error("async refusal")), () => { throw new Error(); }]) {
    const { c, backend } = client({ authorityKey: undefined, authorityVerification: { verifyLease: verify, verifyDisposition: () => true } });
    const before = state(backend); assert.equal(c.weighIn({ lb: 170 }).state, 20); assert.equal(state(backend), before);
    const second = client({ authorityKey: undefined, authorityVerification: { verifyLease: () => true, verifyDisposition: verify } });
    const result = second.c.weighIn({ lb: 170 }), op = second.c.envelope(result.op_id), saved = state(second.backend);
    const d = { op_id: op.op_id, device_id: op.device_id, device_seq: op.device_seq, canonical_content_commitment: op.canonical_content_commitment, status: "ACCEPTED", athlete_log_seq: 1, authority_signature: "synthetic-not-a-proof" };
    assert.equal(second.c.deliverDisposition(d).stored, false); assert.equal(state(second.backend), saved);
  }
});
test("actual batch descriptors freeze complete operations, inclusive whole ranges and zero callbacks for refusals", () => {
  const batches = []; const { c } = client({ lease: O.lease("dev-A", { range: [1, 3] }), onPreparedBatch: batch => { batches.push(batch); } });
  const result = c.logSession({ sets: [{ load: 100, reps: 8 }, { load: 90, reps: 7 }] });
  assert.equal(result.acknowledged, true); assert.equal(batches.length, 1);
  assert.equal(batches[0].count, 3); assert.equal(batches[0].operations.length, 3); assert.equal(batches[0].firstSequence, 1); assert.equal(batches[0].lastSequence, 3);
  assert.deepEqual(batches[0].operations, result.op_ids.map(id => c.envelope(id)));
  assert(Object.isFrozen(batches[0])); assert(Object.isFrozen(batches[0].operations[1].payload));
  assert.throws(() => { batches[0].operations[0].device_seq = 9; });
  assert.equal(c.finishSession().state, 20); assert.equal(batches.length, 1);
  const crossing = client({ lease: O.lease("dev-A", { range: [1, 2] }), onPreparedBatch: () => { throw new Error("must not run"); } });
  assert.equal(crossing.c.logSession({ sets: [{ load: 1, reps: 1 }, { load: 2, reps: 2 }] }).state, 20); assert.equal(crossing.c.outbox().length, 0);
});
test("batch callback failure aborts before backend transaction and consumes no sequence", () => {
  for (const callback of [() => true, () => Promise.resolve(), () => Promise.reject(new Error("async observer")), () => { throw new Error(); }]) {
    const { c, backend } = client({ onPreparedBatch: callback }); let starts = 0; const begin = backend.begin; backend.begin = () => { starts++; return begin(); };
    const before = state(backend); assert.equal(c.weighIn({ lb: 170 }).state, 3); assert.equal(starts, 0); assert.equal(state(backend), before); assert.equal(c.model.ownSeq, 0);
  }
});
test("qualified permission sample does not replace athlete effective timestamps or HMAC identity", () => {
  const baseline = client(), candidate = client({ permissionNowIso: () => "2026-09-20T01:02:03Z" });
  const a = baseline.c.logSession({ sets: [{ load: 100, reps: 8 }] }), b = candidate.c.logSession({ sets: [{ load: 100, reps: 8 }] });
  assert.deepEqual(a, b); assert.equal(state(baseline.backend), state(candidate.backend));
});
test("browser hash subset equals Node for Unicode, lone surrogates and standard RFC4231 vector", () => {
  for (const text of ["", "abc", "Cafe\u0301", "Café", "\ud800", "\udc00", "😀", "\0\n", "-0:1e+21"]) for (const key of ["synthetic", "\ud800", "Café😀"]) {
    assert.equal(createHash("sha256").update(text, "utf8").digest("hex"), nodeHash("sha256").update(text, "utf8").digest("hex"));
    assert.equal(createHmac("sha256", key).update(text, "utf8").digest("hex"), nodeHmac("sha256", key).update(text, "utf8").digest("hex"));
  }
  assert.equal(createHmac("sha256", "Jefe").update("what do ya want for nothing?", "utf8").digest("hex"), "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843");
  assert.throws(() => createHash("sha1")); assert.throws(() => createHmac("sha256", new Uint8Array(3)));
  assert.throws(() => createHash("sha256").update("a", "hex"));
});
