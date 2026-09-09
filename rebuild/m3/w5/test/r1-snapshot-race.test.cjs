"use strict";
// Actual pinned local workerd + D1/HTTP, and a deterministic same-D1 read cut.
// The only altered bridge is a disposable copy in the final strength test.
const { test } = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), os = require("node:os"), vm = require("node:vm");
const { createRequire } = require("node:module");
const { randomBytes, createHash, webcrypto } = require("node:crypto");
const { createR1Runtime } = require("./r1-workerd.cjs");
const { createBridge } = require("../bridge.cjs"), { publicKeyOf, verifyRecord } = require("../crypto.cjs");
const { createR1Verifier } = require("../reconciliation/verify.cjs");
const { build } = require("../../../client/ops.cjs");
const C = require("../reconciliation/codec.cjs"), P = require("../reconciliation/project.cjs");
const nonce = () => randomBytes(32).toString("base64url");
const basis = C.hash("request", C.encode({ synthetic_basis: 1 }));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

async function fixture(t) {
  const r = await createR1Runtime(); t.after(() => r.close());
  assert.deepEqual(await r.bridge.initializeR1({ first: { plan: { protein_g: 150, steps: 8000 }, devices: {} },
    second: { plan: { protein_g: 155, steps: 9000 }, devices: {} } }, { "subject-first": "first", "subject-second": "second" }), { initialized: true });
  r.verifier = createR1Verifier({ keys: [publicKeyOf(r.authorityKey)], subtle: webcrypto.subtle });
  r.scope = (actor, athlete = "first", subject = "subject-first") => C.scopeDigest({ issuer: r.issuer.config.issuer,
    subject, origin: r.issuer.config.origins[0], athleteId: athlete, actorDeviceId: actor });
  return r;
}
async function enroll(r, id, subject = "subject-first") {
  const result = await r.request("/enrol/create", { intent_id: id, schema_version: 1, nonce: nonce() }, subject);
  assert.equal(result.status, 200, result.body?.error?.code);
  assert.equal(verifyRecord(result.body, r.authorityKey, C.DOMAINS.enrollment), true);
  const p = C.parse(C.decode64(result.body.data_b64));
  return { device: p.issuance.lease.device_id, lease: p.issuance.lease, subject, athlete: p.issuance.lease.athlete_id };
}
function operation(r, device, sequence, extra = {}) {
  return build({ op_id: "race-" + device.device + "-" + sequence, athlete_id: device.athlete, device_id: device.device,
    device_seq: sequence, predecessor: null, parents: [], class: "reading", kind: "fact", lease_id: device.lease.lease_id,
    effective: { local_date: "2026-09-04", local_time: "12:00", utc_offset: "-04:00" },
    payload: { lb: { value: 160, unit: "lb" }, source: "athlete" }, ...extra }, r.identityKeys[device.athlete]);
}
function request(ops = []) {
  return { version: "earned/reconcile-request-1m/v1", mode: "ACCOUNT_RECOVERY", nonce: nonce(), context_id: nonce(),
    claims: ops.map((op, i) => ({ claim_id: "claim-" + i, envelope_b64: C.encode64(C.encode(op)) })), requested_lease_ids: [] };
}
const wire = (device, req, continuation = null, page_index = 0) => ({ device_id: device.device,
  request_b64: C.encode64(C.encode(req)), continuation, page_index });
function expected(r, device, req) {
  return { nonce: req.nonce, contextId: req.context_id, requestDigest: C.hash("request", C.encode(req)),
    mode: req.mode, athleteId: device.athlete, actorDeviceId: device.device,
    scopeDigest: r.scope(device.device, device.athlete, device.subject), basisDigest: basis, sessionEpoch: 1 };
}
async function domainRows(r) {
  return (await r.db.prepare("SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id").all()).results;
}
async function redirectSubject(r) {
  // Synthetic administrative race, not a new application transfer API. Advance
  // the same global revision as the application writes being challenged.
  await r.db.batch([
    r.db.prepare("DELETE FROM authority_subjects WHERE subject = 'subject-second'"),
    r.db.prepare("UPDATE authority_subjects SET athlete = 'second' WHERE subject = 'subject-first'"),
    r.db.prepare("UPDATE authority_revision SET revision = revision + 1 WHERE id = 1"),
  ]);
}
async function restoreSubject(r) {
  await r.db.batch([
    r.db.prepare("UPDATE authority_subjects SET athlete = 'first' WHERE subject = 'subject-first'"),
    r.db.prepare("INSERT INTO authority_subjects(subject,athlete) VALUES ('subject-second','second')"),
    r.db.prepare("UPDATE authority_revision SET revision = revision + 1 WHERE id = 1"),
  ]);
}

test("T04 100 independent real-workerd HTTP reads race an owner mapping change and atomic WAITING drain", async t => {
  const r = await fixture(t), a = await enroll(r, "a"), b = await enroll(r, "b");
  const parent = operation(r, a, 1), child = operation(r, b, 1, { parents: [parent.op_id] });
  const waiting = await r.request("/op", { device_id: b.device, operation: child });
  assert.equal(waiting.status, 200); assert.equal(waiting.body.disposition.status, "WAITING");
  const first = deferred(); let signaled = false;
  const runs = Array.from({ length: 100 }, async (_, i) => {
    const req = request([parent, child]), result = await r.request("/reconcile", wire(a, req));
    if (!signaled && result.status === 200) { signaled = true; first.resolve(); }
    return { i, req, result };
  });
  // Every request above is dispatched independently before the concurrent
  // writers. A separate deterministic read cut below forces the stale case.
  await Promise.race([first.promise, Promise.all(runs).then(() => { if (!signaled) throw Error("no successful starting snapshot"); })]);
  const changes = Promise.all([redirectSubject(r), r.bridge.invoke("admit", ["first", parent])]);
  const outcomes = await Promise.all(runs), [, admitted] = await changes;
  assert.equal(admitted.status, "ACCEPTED"); assert.equal(outcomes.length, 100);
  let complete = 0, refused = 0;
  for (const { req, result } of outcomes) {
    assert.equal(result.stats.domainWrites, 0, "reconciliation cannot publish domain rows");
    assert.equal(result.stats.missingMeta, false);
    if (result.status === 403) { assert.equal(result.body.error.state, 17); refused++; continue; }
    assert.equal(result.status, 200, result.body?.error?.code);
    const manifest = C.decode64(result.body.manifest_b64), parsed = C.parse(manifest);
    assert.equal(parsed.page_count, 1, "race fixture must be one complete small proof");
    const proof = await r.verifier.assemble(manifest, [C.encode(result.body.page)], C.encode(req), expected(r, a, req));
    assert.equal(proof.verified, true, proof.code); complete++;
    const p = proof.value.payload;
    assert.equal(p.scope.athlete_id, "first"); assert.equal(p.scope.actor_device_id, a.device);
    assert([0, 2].includes(p.accepted.W), "parent acceptance and child drain share one guarded commit");
    assert.deepEqual(p.claims.map(c => c.outcome), p.accepted.W === 0 ? ["UNKNOWN_AT_SNAPSHOT", "KNOWN_WAITING"] : ["KNOWN_TERMINAL", "KNOWN_TERMINAL"]);
    for (const row of p.accepted.rows) assert.equal(P.readRow(row).op.athlete_id, "first");
  }
  assert.equal(complete + refused, 100); assert(complete > 0);
  assert.equal((await r.request("/reconcile", wire(a, request()))).status, 403);
  await restoreSubject(r);
  const before = await domainRows(r), final = await r.bridge.reconcileScoped(a.subject, a.device, request([parent, child]));
  assert.equal(final.payload.accepted.W, 2);
  assert.deepEqual(final.payload.claims.map(c => P.readRow(c.stored_operation_row).disposition.status), ["ACCEPTED", "ACCEPTED"]);
  assert.deepEqual(await domainRows(r), before);
  console.log("R1 SNAPSHOT RACE PASS — 100 real-workerd HTTP invocations; complete guarded proofs or state17; zero read domain writes");
});

test("retained pages survive foreign writes, reject own changes, and refuse revoked B at the next page", async t => {
  const r = await fixture(t), a = await enroll(r, "a"), b = await enroll(r, "b"), c = await enroll(r, "c", "subject-second");
  const large = operation(r, a, 1, { payload: { lb: { value: 160, unit: "lb" }, note: "synthetic-padding:" + "x".repeat(24000) } });
  assert.equal((await r.request("/op", { device_id: a.device, operation: large })).body.disposition.status, "ACCEPTED");
  const req = request(), before = await r.bridge.reconcileScoped(b.subject, b.device, req);
  const first = await r.request("/reconcile", wire(b, req));
  assert.equal(first.status, 200);
  const manifest = C.decode64(first.body.manifest_b64), m = C.parse(manifest);
  assert(m.page_count > 1);
  const other = operation(r, c, 1);
  assert.equal((await r.request("/op", { device_id: c.device, operation: other }, c.subject)).body.disposition.status, "ACCEPTED");
  const afterForeign = await r.bridge.reconcileScoped(b.subject, b.device, req);
  assert.equal(afterForeign.payloadDigest, before.payloadDigest);
  assert.equal(C.sameBytes(afterForeign.payloadBytes, before.payloadBytes), true);
  const second = await r.request("/reconcile", wire(b, req, first.body.manifest_b64, 1));
  assert.equal(second.status, 200); assert.equal(second.body.manifest_b64, first.body.manifest_b64);
  assert.equal(second.stats.domainWrites, 0);
  const pageProof = await r.verifier.verifyPage(C.encode(second.body.page), manifest, expected(r, b, req));
  assert.equal(pageProof.verified, true, pageProof.code);
  assert.equal((await r.request("/op", { device_id: a.device, operation: operation(r, a, 2) })).body.disposition.status, "ACCEPTED");
  const changed = await r.request("/reconcile", wire(b, req, first.body.manifest_b64, 1));
  assert.equal(changed.status, 409); assert.equal(changed.body.error.code, "SNAPSHOT_CHANGED");
  const freshRequest = request(), fresh = await r.request("/reconcile", wire(b, freshRequest));
  assert.equal(fresh.status, 200);
  await r.bridge.invoke("revokeDevice", ["first", b.device]);
  const revoked = await r.request("/reconcile", wire(b, freshRequest, fresh.body.manifest_b64, 1));
  assert.equal(revoked.status, 403); assert.equal(revoked.body.error.state, 17);
  const prefix = await r.verifier.assemble(C.decode64(fresh.body.manifest_b64), [C.encode(fresh.body.page)], C.encode(freshRequest), expected(r, b, freshRequest));
  assert.equal(prefix.verified, false); assert.equal(prefix.code, "MISSING_PAGE");
});

function loadBridge(source, filename) {
  const module = { exports: {} }, requireFrom = createRequire(path.resolve(__dirname, "../bridge.cjs"));
  vm.runInThisContext("(function(require,module,exports){" + source + "\n})", { filename })(requireFrom, module, module.exports);
  return module.exports.createBridge;
}
async function guardedOwnerRead(r, actor, factory) {
  const loaded = deferred(), release = deferred(); let armed = true;
  const db = { prepare: text => r.db.prepare(text), async batch(statements) {
    const result = await r.db.batch(statements);
    if (armed && statements.length === 3) { armed = false; loaded.resolve(); await release.promise; }
    return result;
  } };
  const bridge = factory({ db, authorityKey: r.authorityKey, identityKeys: r.identityKeys, clock: () => r.NOW,
    reconciliationProfile: C.PROFILE, r1: { issuer: r.issuer.config.issuer, origin: r.issuer.config.origins[0] } });
  const pending = bridge.reconcileScoped(actor.subject, actor.device, request()).then(value => ({ value }), error => ({ error }));
  await loaded.promise;
  let changed = false;
  try {
    await redirectSubject(r); changed = true; release.resolve();
    return await pending;
  } finally { release.resolve(); if (changed) await restoreSubject(r); }
}

test("effective disposable revision bite: a paused real-D1 snapshot cannot outlive an owner mapping change", async t => {
  const r = await fixture(t), actor = await enroll(r, "guarded-actor");
  const product = path.resolve(__dirname, "../bridge.cjs"), bytes = fs.readFileSync(product), source = bytes.toString("utf8");
  const anchor = "const statements = [(storage ? storage.guard(revision,storageControl) : db.prepare('UPDATE authority_revision SET revision = CASE WHEN revision = ? THEN revision ELSE -1 END WHERE id = 1').bind(revision)),\n          db.prepare('UPDATE authority_revision SET revision = revision + 1 WHERE id = 1')];";
  const r1Start = source.indexOf("async function executeR1(");
  assert(r1Start > 0);
  assert.equal(source.slice(r1Start).split(anchor).length, 2, "exactly one guard in the R1 implementation");
  const guardStart = source.indexOf(anchor, r1Start);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "earned-r1-revision-bite-")), copy = path.join(directory, "bridge.cjs");
  fs.writeFileSync(copy, bytes);
  const control = await guardedOwnerRead(r, actor, loadBridge(source, copy));
  assert.equal(control.error?.code, "SCOPE_FORBIDDEN");
  let detected = false;
  try {
    const altered = source.slice(0, guardStart) + "const statements = [db.prepare('SELECT revision FROM authority_revision WHERE id = 1'), db.prepare('UPDATE authority_revision SET revision = revision + 1 WHERE id = 1')];" + source.slice(guardStart + anchor.length);
    fs.writeFileSync(copy, altered);
    const mutant = await guardedOwnerRead(r, actor, loadBridge(altered, copy));
    try { assert.equal(mutant.error?.code, "SCOPE_FORBIDDEN"); }
    catch (error) { if (error.code !== "ERR_ASSERTION") throw error; detected = true; }
    assert.equal(detected, true, "inert mutation earns nothing");
    assert.equal(mutant.value.payload.scope.athlete_id, "first", "witness returned the stale old account proof");
    console.log("R1 REVISION BITE RED — removed R1 revision assertion returned stale owner-bound proof");
  } finally { fs.writeFileSync(copy, bytes); }
  assert.equal(hash(fs.readFileSync(copy)), hash(bytes));
  assert.equal(hash(fs.readFileSync(product)), hash(bytes), "live bridge never mutated");
  const restored = await guardedOwnerRead(r, actor, loadBridge(fs.readFileSync(copy, "utf8"), copy));
  assert.equal(restored.error?.code, "SCOPE_FORBIDDEN");
  console.log("R1 REVISION BITE RESTORED PASS sha256=" + hash(bytes));
});
