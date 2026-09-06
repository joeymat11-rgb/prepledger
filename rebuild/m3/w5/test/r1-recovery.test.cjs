"use strict";
// Real local D1 and listening loopback HTTP. Only the explicitly named recovery
// consumer below is a synthetic contract model, not W6/IndexedDB/K1 evidence.
const { test, before } = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const { randomBytes, webcrypto } = require("node:crypto");
const { createLocalD1 } = require("../local-d1.cjs"), { createBridge } = require("../bridge.cjs");
const { createWorker } = require("../worker.cjs"), { buildCore } = require("../build.cjs");
const { hostWorker, testIssuer } = require("../../rigs/rig190.cjs");
const { generateSigningKey, publicKeyOf } = require("../crypto.cjs");
const { build } = require("../../../client/ops.cjs");
const { createR1Verifier } = require("../reconciliation/verify.cjs");
const C = require("../reconciliation/codec.cjs"), P = require("../reconciliation/project.cjs");
const { createDisk, createConsumer, SimulatedKill, NOTICE } = require("./r1-recovery-consumer.cjs");
const NOW = "2026-09-04T16:00:00.000Z";
const nonce = () => randomBytes(32).toString("base64url");
const basisDigest = C.hash("request", C.encode({ synthetic_local_generation: 1 }));
let core;
before(async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "earned-r1-recovery-core-"));
  core = require(await buildCore({ outfile: path.join(directory, "core.cjs") }));
  // Generated source contains no run keys; retain the build for failure diagnosis.
});

async function migrate(db) {
  const sql = fs.readFileSync(path.join(__dirname, "../migrations/0002_reconciliation.sql"), "utf8").replace(/--[^\n]*/g, "");
  const statements = sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm) || [];
  assert.equal(statements.length, 6);
  assert.equal(sql.replace(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm, "").trim(), "", "migration splitter must consume the whole script");
  await db.batch(statements.map(statement => db.prepare(statement)));
}

async function fixture(t) {
  const runtime = await createLocalD1(); t.after(() => runtime.close()); await migrate(runtime.db);
  const signingKey = generateSigningKey("r1-recovery-run"), issuer = testIssuer();
  const identityKeys = { first: randomBytes(32).toString("hex"), second: randomBytes(32).toString("hex") };
  const origin = issuer.config.origins[0];
  const bridge = createBridge({ db: runtime.db, core, authorityKey: signingKey, identityKeys, clock: () => NOW,
    reconciliationProfile: C.PROFILE, r1: { issuer: issuer.config.issuer, origin } });
  assert.deepEqual(await bridge.initializeR1({ first: { plan: { protein_g: 150, steps: 8000 }, devices: {} },
    second: { plan: { protein_g: 155, steps: 9000 }, devices: {} } }, { "subject-first": "first", "subject-second": "second" }), { initialized: true });
  const host = await hostWorker(createWorker({ bridge, authorityKey: signingKey, auth: issuer.config, clock: () => NOW }));
  t.after(() => host.close());
  const verifier = createR1Verifier({ keys: [publicKeyOf(signingKey)], subtle: webcrypto.subtle });
  async function request(route, body, subject = "subject-first") {
    const response = await fetch(host.url + route, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin,
      Authorization: "Bearer " + issuer.token(subject) }, body: JSON.stringify(body) });
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("cdn-cache-control"), "no-store");
    assert.match(response.headers.get("vary"), /Authorization/);
    return { status: response.status, body: await response.json() };
  }
  async function post(route, body, subject) {
    const result = await request(route, body, subject);
    assert.equal(result.status, 200, route + " " + JSON.stringify(result.body));
    return result.body;
  }
  const scope = (device, subject = "subject-first", athlete = "first") => C.scopeDigest({ issuer: issuer.config.issuer,
    subject, origin, athleteId: athlete, actorDeviceId: device });
  return { runtime, bridge, host, verifier, identityKeys, issuer, origin, request, post, scope };
}

async function enroll(f, id, subject = "subject-first", athlete = "first") {
  const request = { intent_id: id, schema_version: 1, nonce: nonce() };
  const response = await f.post("/enrol/create", request, subject);
  const expected = { profile: C.DOMAINS.enrollment, nonce: request.nonce, intentDigest: C.intentDigest("/enrol/create", request),
    basisDigest, sessionEpoch: 1, issuer: f.issuer.config.issuer, subject, origin: f.origin, athleteId: athlete };
  const verified = await f.verifier.verifyResult(C.encode(response), expected);
  assert.equal(verified.verified, true, "enrollment proof: " + verified.code);
  const payload = verified.value.payload;
  return { request, response, proof: verified, device: payload.issuance.lease.device_id, lease: payload.issuance.lease,
    current: payload.current_standing, athlete, subject };
}

function operation(f, enrolled, seq, options = {}) {
  return build({ op_id: "op-" + enrolled.device + "-" + seq, athlete_id: enrolled.athlete, device_id: enrolled.device,
    device_seq: seq, predecessor: null, parents: [], class: "reading", kind: "fact", lease_id: enrolled.lease.lease_id,
    effective: { local_date: "2026-09-04", local_time: "12:00", utc_offset: "-04:00" },
    payload: { lb: { value: 160, unit: "lb" }, note: "caf\u00e9" }, ...options }, f.identityKeys[enrolled.athlete]);
}

async function replay(f, actor, op) {
  const bytes = C.encode(op), digest = C.hash("operation", bytes);
  const request = { device_id: actor.device, envelope_b64: C.encode64(bytes), nonce: nonce() };
  const response = await f.post("/recovery/replay", request, actor.subject);
  const proof = await f.verifier.verifyResult(C.encode(response), { profile: C.DOMAINS.replay, nonce: request.nonce,
    intentDigest: digest, originalEnvelopeDigest: digest, originalEnvelopeB64: request.envelope_b64,
    originalOperation: op, athleteId: actor.athlete,
    actorDeviceId: actor.device, scopeDigest: f.scope(actor.device, actor.subject, actor.athlete), basisDigest, sessionEpoch: 1 });
  assert.equal(proof.verified, true, "replay proof: " + proof.code);
  return { request, response, proof, bytes };
}

async function reconcile(f, actor, operations = [], mode = "ACCOUNT_RECOVERY") {
  const request = { version: "earned/reconcile-request-1m/v1", mode, nonce: nonce(), context_id: nonce(),
    claims: operations.map((op, i) => ({ claim_id: "claim-" + i, envelope_b64: C.encode64(C.encode(op)) })), requested_lease_ids: [] };
  const requestBytes = C.encode(request), first = await f.post("/reconcile", {
    device_id: actor.device, request_b64: C.encode64(requestBytes), continuation: null, page_index: 0 }, actor.subject);
  const manifestBytes = C.decode64(first.manifest_b64, C.LIMITS.request), manifest = C.parse(manifestBytes);
  const pages = [C.encode(first.page)];
  for (let index = 1; index < manifest.page_count; index++) {
    const next = await f.post("/reconcile", { device_id: actor.device, request_b64: C.encode64(requestBytes),
      continuation: first.manifest_b64, page_index: index }, actor.subject);
    assert.equal(next.manifest_b64, first.manifest_b64);
    pages.push(C.encode(next.page));
  }
  const proof = await f.verifier.assemble(manifestBytes, pages, requestBytes, { nonce: request.nonce, contextId: request.context_id,
    requestDigest: C.hash("request", requestBytes), mode, athleteId: actor.athlete, actorDeviceId: actor.device,
    scopeDigest: f.scope(actor.device, actor.subject, actor.athlete), basisDigest, sessionEpoch: 1 });
  assert.equal(proof.verified, true, "complete proof: " + proof.code);
  return { proof, request, requestBytes, manifestBytes, pages };
}
async function rows(f) {
  return (await f.runtime.db.prepare("SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id").all()).results;
}

test("T03 real D1/HTTP: old A work survives renewal; new B enrolls, reconciles, relays exact A bytes, then starts B:1", async t => {
  const f = await fixture(t), a = await enroll(f, "phone-a");
  const accepted = operation(f, a, 1), pending = operation(f, a, 2, { predecessor: accepted.op_id, parents: [accepted.op_id] });
  const first = await f.post("/op", { device_id: a.device, operation: accepted });
  assert.equal(first.disposition.status, "ACCEPTED");
  const waiting = operation(f, a, 3, { predecessor: pending.op_id, parents: [pending.op_id] });
  assert.equal((await f.post("/op", { device_id: a.device, operation: waiting })).disposition.status, "WAITING");
  await f.post("/lease/renew", { device_id: a.device, intent_id: "renew-a", expected_creation_epoch: 1,
    expected_lease_id: a.lease.lease_id, schema_version: 1, nonce: nonce() });
  const historicalRequest = { ...a.request, nonce: nonce() }, historicalResponse = await f.post("/enrol/create", historicalRequest);
  const historical = await f.verifier.verifyResult(C.encode(historicalResponse), { profile: C.DOMAINS.enrollment,
    nonce: historicalRequest.nonce, intentDigest: C.intentDigest("/enrol/create", historicalRequest), basisDigest, sessionEpoch: 1,
    issuer: f.issuer.config.issuer, subject: a.subject, origin: f.origin, athleteId: a.athlete });
  assert.equal(historical.verified, true, historical.code);
  assert.deepEqual(historical.value.payload.issuance, a.proof.value.payload.issuance);
  assert.equal(historical.value.payload.current_standing.creation_epoch, 2);
  assert.notEqual(historical.value.payload.current_standing.current_lease_id, a.lease.lease_id);
  const b = await enroll(f, "phone-b"), withoutLocalCopy = await reconcile(f, b);
  assert.deepEqual(withoutLocalCopy.proof.value.payload.claims, []);
  assert.equal(withoutLocalCopy.proof.value.payload.retained_rows.some(row => row.collection === "operations" && row.row_id === pending.op_id), false,
    "without surviving A bytes, recovery cannot manufacture its unknown operation");
  const before = await reconcile(f, b, [accepted, pending, waiting]);
  assert.equal(before.proof.value.payload.accepted.W, 1);
  assert.deepEqual(before.proof.value.payload.claims.map(x => x.outcome), ["KNOWN_TERMINAL", "UNKNOWN_AT_SNAPSHOT", "KNOWN_WAITING"]);
  assert.equal((await f.request("/op", { device_id: b.device, operation: pending })).status, 403);
  const relayed = await replay(f, b, pending), disposition = C.parse(C.decode64(relayed.proof.value.payload.disposition_bytes_b64));
  assert.equal(disposition.status, "ACCEPTED");
  const stableRows = await rows(f), repeat = await replay(f, b, pending);
  assert.equal(repeat.proof.value.payload.disposition_bytes_b64, relayed.proof.value.payload.disposition_bytes_b64);
  assert.deepEqual(await rows(f), stableRows);
  const bFirst = operation(f, b, 1, { op_id: "first-on-new-phone" });
  assert.equal(bFirst.device_predecessor_op_id, null);
  assert.equal((await f.post("/op", { device_id: b.device, operation: bFirst })).disposition.status, "ACCEPTED");
  const complete = await reconcile(f, b, [accepted, pending, waiting, bFirst]);
  assert.equal(complete.proof.value.payload.accepted.W, 4);
  assert(complete.proof.value.payload.claims.every(claim => claim.outcome === "KNOWN_TERMINAL"));
  const old = complete.proof.value.payload.claims[1];
  assert.equal(P.readRow(old.stored_operation_row).op.device_id, a.device);
  assert.equal(P.readRow(old.stored_operation_row).op.lease_id, a.lease.lease_id);
  assert.deepEqual(P.readRow(old.stored_operation_row).op, pending);
});

test("T03 account/source authorization stays strict for recovery; revoked source barrier still applies", async t => {
  const f = await fixture(t), a = await enroll(f, "a"), b = await enroll(f, "b"), foreign = await enroll(f, "foreign", "subject-second", "second");
  const first = operation(f, a, 1), pending = operation(f, a, 2);
  await f.post("/op", { device_id: a.device, operation: first });
  const revoked = await f.bridge.invokeScoped(a.subject, a.device, "revokeDevice", [a.athlete, a.device]);
  assert.equal(revoked.barrier, 1);
  const result = await replay(f, b, pending);
  assert.equal(C.parse(C.decode64(result.proof.value.payload.disposition_bytes_b64)).rejection_code, "LEASE_REVOKED_BEYOND_BARRIER");
  const stable = await rows(f);
  assert.equal((await f.request("/recovery/replay", { device_id: foreign.device, envelope_b64: C.encode64(C.encode(first)), nonce: nonce() }, foreign.subject)).status, 403);
  assert.deepEqual(await rows(f), stable);
  const original = await replay(f, b, first);
  assert.equal(C.parse(C.decode64(original.proof.value.payload.disposition_bytes_b64)).status, "ACCEPTED");
  await f.bridge.invokeScoped(b.subject, b.device, "revokeDevice", [b.athlete, b.device]);
  assert.equal((await f.request("/recovery/replay", { device_id: b.device, envelope_b64: C.encode64(C.encode(first)), nonce: nonce() })).status, 403);
});

test("T05 real D1/HTTP all four Unicode aliases; explicit atomic R3 synthetic recovery and every observation/restore kill cut", async t => {
  const f = await fixture(t), a = await enroll(f, "a"), b = await enroll(f, "b");
  const stored = [operation(f, a, 1), operation(f, a, 2, { parents: ["unreceived-parent"] }),
    operation(f, a, 3, { payload: { lb: 160, note: "caf\u00e9" } })];
  stored.push(operation(f, a, 4, { parents: [stored[2].op_id] }));
  const statuses = ["ACCEPTED", "WAITING", "REJECTED", "REJECTED_DEPENDENCY"];
  for (let i = 0; i < stored.length; i++) {
    const result = await f.post("/op", { device_id: a.device, operation: stored[i] });
    assert.equal(result.disposition.status, statuses[i]);
  }
  const baseline = await rows(f);
  for (let i = 0; i < stored.length; i++) {
    const variant = structuredClone(stored[i]); variant.payload.note = "cafe\u0301";
    const rebuilt = operation(f, a, variant.device_seq, { op_id: variant.op_id, payload: variant.payload, parents: variant.causal_parents });
    assert.equal(rebuilt.canonical_content_commitment, stored[i].canonical_content_commitment);
    assert.equal(C.fullEqual(variant, stored[i]), false);
    const response = await replay(f, b, variant), evidence = response.proof.value.payload;
    assert.equal(evidence.outcome, "ENVELOPE_MISMATCH");
    assert.equal(P.readRow(evidence.authority_record.operation_row).disposition.status, statuses[i]);
    assert.deepEqual(P.readRow(evidence.authority_record.operation_row).op, stored[i]);
    assert.deepEqual(await rows(f), baseline);
    const complete = await reconcile(f, b, [variant]);
    assert.equal(complete.proof.value.payload.claims[0].outcome, "ENVELOPE_MISMATCH");
    assert.deepEqual(await rows(f), baseline);
    await exerciseR3({ response, complete, variant, stored: stored[i], status: statuses[i] });
  }
});

async function exerciseR3({ response, complete, variant, stored, status }) {
  const localB64 = C.encode64(C.encode(variant)), unrelated = { op_id: "unrelated-pending", envelope_b64: C.encode64(C.encode({ synthetic: "other exact bytes" })) };
  const initial = { basisDigest, sessionEpoch: 1, keysAvailable: true, knownStates: [], obligation: null,
    outbox: [{ op_id: variant.op_id, envelope_b64: localB64 }, unrelated], recoveryLedger: [], authorityRows: [], acceptedFacts: [], notices: [],
    controls: { nextSeq: 19, predecessor: "preserved-predecessor", highWater: 123456, W_last: 321, H: 3600, U: 7,
      leaseId: "preserved-original-lease", checkpoint: "no-new-checkpoint", typedValue: "synthetic entered value" } };
  const input = { replay: response.proof, complete: complete.proof, localB64, basisDigest };
  const assertRestored = (disk, known = []) => {
    const value = disk.read();
    assert.equal(value.obligation, null);
    assert.deepEqual(value.outbox, [unrelated]);
    assert.deepEqual(value.controls, initial.controls);
    assert.equal(value.sessionEpoch, initial.sessionEpoch); assert.equal(value.basisDigest, initial.basisDigest);
    assert.deepEqual(value.knownStates, known);
    assert.equal(value.recoveryLedger.length, 1); assert.equal(value.notices.length, 1);
    assert.equal(value.recoveryLedger[0].envelope_b64, localB64);
    assert.equal(value.recoveryLedger[0].status, "LOCAL_COPY_NEEDS_REVIEW");
    assert.equal(value.recoveryLedger[0].authority_status, status);
    assert.deepEqual(P.readRow(value.recoveryLedger[0].authority_record.operation_row).op, stored);
    assert.equal(value.notices[0].message, NOTICE);
    assert.equal(value.acceptedFacts.some(op => op.op_id === stored.op_id), status === "ACCEPTED");
    assert.equal(value.acceptedFacts.some(op => C.fullEqual(op, variant)), false);
    assert.deepEqual(value.authorityRows, complete.proof.value.payload.retained_rows);
  };
  for (const known of [[], [17], [19], [20], [17, 19, 20]]) {
    const disk = createDisk({ ...initial, knownStates: known }), consumer = createConsumer(disk);
    await consumer.arm(localB64); const observation = await consumer.observe(input);
    assert.equal(observation.recoveryState, 18); assert.equal(observation.synced, false);
    assert.equal(observation.view, null); assert.deepEqual(observation.knownStates, known);
    const before = disk.read(), declined = await consumer.restore();
    assert.equal(declined.restored, false); assert.deepEqual(disk.read(), before);
    const result = await consumer.restore({ explicit: true });
    assert.equal(result.restored, true); assert.equal(result.synced, false);
    assert.equal(result.localCopyStatus, "LOCAL_COPY_NEEDS_REVIEW");
    assertRestored(disk, known);
    if (known.includes(17)) assert.equal(result.view, null, "restoring bytes does not restore standing");
    const final = disk.read();
    assert.equal((await createConsumer(disk).restore({ explicit: true })).already, true);
    assert.deepEqual(disk.read(), final, "repeat resolution neither deletes retained copy nor repeats a write");
  }
  for (const known of [[], [17, 19, 20]]) for (const stage of ["arm", "raw", "observe", "restore"]) for (const cut of ["before", "during", "after"]) {
    const disk = createDisk({ ...initial, knownStates: known }), consumer = createConsumer(disk);
    if (stage !== "arm") await consumer.arm(localB64);
    if (stage === "restore") await consumer.observe(input);
    disk.inject(stage + ":" + cut);
    const action = stage === "arm" ? () => consumer.arm(localB64) : stage === "restore" ? () => consumer.restore({ explicit: true }) : () => consumer.observe(input);
    await assert.rejects(action(), error => error instanceof SimulatedKill, status + " " + stage + ":" + cut);
    const surviving = disk.read();
    assert.deepEqual(surviving.controls, initial.controls);
    assert.equal(surviving.sessionEpoch, initial.sessionEpoch); assert.deepEqual(surviving.knownStates, known);
    const reopened = createConsumer(disk); disk.inject(null);
    if (stage === "restore" && cut === "after") assertRestored(disk, known);
    else {
      assert.equal(surviving.recoveryLedger.length, 0); assert.deepEqual(surviving.outbox, initial.outbox);
      assert.equal(surviving.acceptedFacts.length, 0); assert.equal(surviving.notices.length, 0);
      if (!(stage === "arm" && cut !== "after")) {
        assert.equal(reopened.current().recoveryState, 18); assert.equal(reopened.current().view, null);
      } else assert.equal(surviving.obligation, null, "no observation was permitted before successful arm");
      if (!surviving.obligation) await reopened.arm(localB64);
      if (surviving.obligation?.raw) await reopened.reprove(); else await reopened.observe(input);
      await reopened.restore({ explicit: true }); assertRestored(disk, known);
    }
  }
  for (const patch of [{ keysAvailable: false }, { basisDigest: nonce() }]) {
    const disk = createDisk({ ...initial, ...patch }), consumer = createConsumer(disk);
    await consumer.arm(localB64);
    await assert.rejects(() => consumer.observe(input), /evidence, current basis and local keys/);
    assert.equal(createConsumer(disk).current().recoveryState, 18);
    assert.deepEqual(disk.read().outbox, initial.outbox);
    assert.equal(disk.read().recoveryLedger.length, 0);
  }
  const noEvidence = createDisk(initial), consumer = createConsumer(noEvidence);
  await consumer.arm(localB64);
  await assert.rejects(() => consumer.observe({ ...input, complete: { verified: false } }), /complete verified evidence/);
  assert.equal((await consumer.restore({ explicit: true })).restored, false);
  assert.equal(noEvidence.read().recoveryLedger.length, 0);
  const absentRecord = createDisk(initial), missing = createConsumer(absentRecord);
  await missing.arm(localB64);
  const brokenReplay = structuredClone(response.proof); brokenReplay.value.payload.authority_record = null;
  await assert.rejects(() => missing.observe({ ...input, replay: brokenReplay }), /specific mismatch evidence/);
  assert.equal((await missing.restore({ explicit: true })).restored, false);
  assert.equal(absentRecord.read().obligation.status, "OPEN");
  assert.deepEqual(absentRecord.read().outbox, initial.outbox);
  // The model has only its dedicated atomic-generation sink. No ordinary T2
  // delivery API is imported or offered; this is not a claim about future W6.
  const modelSource = fs.readFileSync(path.join(__dirname, "r1-recovery-consumer.cjs"), "utf8");
  assert.doesNotMatch(modelSource, /require\([^\n]*(?:client|sync\.cjs|t2-public)|\.deliver(?:Disposition|Receipts)\s*\(/);
}

test("T04 actual HTTP/public verifier transport: quiet completion, three page invalidations, finite18, then quiet explicit Retry", async t => {
  const { createRestoreTransport } = require("../reconciliation/transport.cjs");
  const f = await fixture(t), a = await enroll(f, "writer-a"), b = await enroll(f, "recovering-b");
  const large = operation(f, a, 1, { payload: { lb: { value: 160, unit: "lb" }, note: "synthetic-page-padding:" + "x".repeat(24000) } });
  assert.equal((await f.post("/op", { device_id: a.device, operation: large })).disposition.status, "ACCEPTED");
  let busy = false, nextSeq = 2, manifests = 0, pages = 0, persisted = null;
  const negatives = [];
  const persistence = { load: async () => structuredClone(persisted), save: async value => { persisted = structuredClone(value); return true; } };
  const options = {
    verifier: f.verifier, persistence,
    newRequest: async () => { manifests++; return { version: "earned/reconcile-request-1m/v1", mode: "ACCOUNT_RECOVERY",
      nonce: nonce(), context_id: nonce(), claims: [], requested_lease_ids: [] }; },
    expected: async request => ({ nonce: request.nonce, contextId: request.context_id,
      requestDigest: C.hash("request", C.encode(request)), mode: request.mode, athleteId: b.athlete, actorDeviceId: b.device,
      scopeDigest: f.scope(b.device), basisDigest, sessionEpoch: 1 }),
    fetchPage: async ({ request, continuation, page_index }) => {
      pages++;
      if (busy && page_index === 1) {
        const next = operation(f, a, nextSeq++);
        assert.equal((await f.post("/op", { device_id: a.device, operation: next })).disposition.status, "ACCEPTED");
      }
      return f.request("/reconcile", { device_id: b.device, request_b64: C.encode64(C.encode(request)), continuation, page_index });
    },
    // Ingress sees every response, including signed positive pages. This test
    // records transport errors; production W6 supplies authenticated K1 capture.
    observeNegative: async reply => { if (reply.body.error) negatives.push(reply.body.error.code); },
  };
  const controller = createRestoreTransport(options), quiet = await controller.run();
  assert.equal(quiet.complete, true, quiet.reason);
  assert(pages > 1, "fixture must cross a real page boundary");
  assert.equal(quiet.evidence.payload.accepted.W, 1);
  busy = true; manifests = 0; pages = 0;
  const refused = await controller.run({ explicitRetry: true });
  assert.equal(refused.complete, false); assert.equal(refused.recoveryState, 18);
  assert.equal(refused.reason, "RESTARTS_EXHAUSTED");
  assert.equal(manifests, 3); assert.equal(pages, 6);
  assert.deepEqual(negatives, ["SNAPSHOT_CHANGED", "SNAPSHOT_CHANGED", "SNAPSHOT_CHANGED"]);
  assert.equal(persisted.status, "EXHAUSTED");
  const beforePages = pages, reopened = createRestoreTransport(options);
  assert.equal((await reopened.run()).reason, "EXPLICIT_RETRY_REQUIRED");
  assert.equal(pages, beforePages);
  busy = false;
  const retry = await reopened.run({ explicitRetry: true });
  assert.equal(retry.complete, true, retry.reason); assert.equal(retry.evidence.payload.accepted.W, 4);
  assert.equal(persisted.status, "COMPLETE");
  // This controller returns verified evidence only. These deliberately seeded
  // local values remain untouched: no receipt/outbox/lease/permission sink exists.
  assert.equal(Object.hasOwn(retry, "saved"), false); assert.equal(Object.hasOwn(retry, "synced"), false);
});
