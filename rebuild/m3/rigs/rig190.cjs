"use strict";

// The five preregistered scenarios cross a listening HTTP socket and the Worker
// fetch implementation. The only fault cuts live in this disposable host, never
// in the product: drop before Worker acceptance, or after its durable response.
const assert = require("node:assert/strict");
const http = require("node:http");
const { generateKeyPairSync, randomBytes, sign } = require("node:crypto");
const { once } = require("node:events");
const { createWorker, ROUTES } = require("../w5/worker.cjs");
const { generateSigningKey, publicKeyOf, signLease, signPull, signSnapshot, signServerTime } = require("../w5/crypto.cjs");
const { createPublicBoundary, WIRE_VERSION, TIME_PROFILE } = require("../w5/public-client.cjs");
const { build } = require("../../client/ops.cjs");
const { loadPublicT2 } = require("./t2-public-adapter.cjs");

const NOW = "2026-09-04T16:00:00.000Z";
const ISSUER = "https://clerk.w5-test.invalid";
const ORIGIN = "https://today.w5-test.invalid";
const AUDIENCE = "earned-w5-test";

function testIssuer() {
  const pair = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...pair.publicKey.export({ format: "jwk" }), kid: "clerk-local-run", alg: "RS256", use: "sig" };
  const epoch = Date.parse(NOW) / 1000;
  return {
    config: { issuer: ISSUER, audience: AUDIENCE, origins: [ORIGIN], jwks: [jwk] },
    token(subject, overrides = {}, headerOverrides = {}) {
      const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: jwk.kid, ...headerOverrides })).toString("base64url");
      const claims = Buffer.from(JSON.stringify({ iss: ISSUER, aud: AUDIENCE, azp: ORIGIN, sub: subject,
        iat: epoch - 60, nbf: epoch - 60, exp: epoch + 3600, ...overrides })).toString("base64url");
      const input = header + "." + claims;
      return input + "." + sign("RSA-SHA256", Buffer.from(input), pair.privateKey).toString("base64url");
    },
  };
}

async function hostWorker(worker) {
  let nextCut = null;
  const server = http.createServer(async (incoming, outgoing) => {
    try {
      const chunks = [];
      for await (const part of incoming) chunks.push(part);
      const cut = nextCut; nextCut = null;
      if (cut === "before-acceptance") { incoming.socket.destroy(); return; }
      const request = new Request("http://127.0.0.1" + incoming.url, { method: incoming.method,
        headers: incoming.headers, body: Buffer.concat(chunks) });
      const response = await worker.fetch(request);
      if (cut === "after-durable-before-reply") { incoming.socket.destroy(); return; }
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch (_) { outgoing.writeHead(500); outgoing.end(); }
  });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  return {
    url: "http://127.0.0.1:" + server.address().port,
    cut(stage) { assert.equal(nextCut, null); nextCut = stage; },
    async close() { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); },
  };
}

async function run(options = {}) {
  const authorityKey = generateSigningKey("http190-run"), wrongKey = generateSigningKey("http190-forged");
  const identityKeys = { first: randomBytes(32).toString("hex"), second: randomBytes(32).toString("hex") };
  const makeLease = (athlete, device, signingKey = authorityKey) => signLease({ lease_id: "lease-" + device, athlete_id: athlete, device_id: device,
    schema_version: 1, range: [1, 1000], not_before: "2026-09-01T00:00:00.000Z", not_after: "2026-10-01T00:00:00.000Z",
    issued_server_time: "2026-09-01T00:00:00.000Z" }, signingKey);
  const leases = { a: makeLease("first", "a"), b: makeLease("first", "b"), c: makeLease("second", "c"),
    forged: makeLease("first", "forged"), badlease: makeLease("first", "badlease", wrongKey) };
  const athletes = {
    first: { plan: { protein_g: 150, steps: 8000 }, devices: { a: { lease: leases.a }, b: { lease: leases.b },
      forged: { lease: leases.forged }, badlease: { lease: leases.badlease } } },
    second: { plan: { protein_g: 150, steps: 8000 }, devices: { c: { lease: leases.c } } },
  };
  const subjects = { "clerk-first": "first", "clerk-second": "second" };
  const ownedRuntime = !options.runtime;
  const createBridge = options.createBridge || require("../w5/bridge.cjs").createBridge;
  const runtime = options.runtime || await require("../w5/local-d1.cjs").createLocalD1();
  let host;
  try {
    const bridge = createBridge({ db: runtime.db, authorityKey, identityKeys, clock: () => NOW });
    await bridge.initialize(athletes, subjects);
    const issuer = testIssuer();
    const worker = createWorker({ bridge, authorityKey, auth: issuer.config, clock: () => NOW });
    host = await hostWorker(worker);
    const request = async (route, body, subject = "clerk-first", extra = {}) => {
      const response = await fetch(host.url + route, { method: "POST", headers: {
        "Content-Type": "application/json", Origin: ORIGIN,
        Authorization: "Bearer " + issuer.token(subject), ...extra.headers,
      }, body: JSON.stringify(body) });
      const json = await response.json();
      assert.match(response.headers.get("cache-control"), /no-store/);
      assert.equal(response.headers.get("cdn-cache-control"), "no-store");
      assert.match(response.headers.get("vary"), /Authorization/);
      assert.equal(response.headers.get("earned-wire-version"), WIRE_VERSION);
      return { status: response.status, body: json };
    };
    const post = async (route, body, subject) => {
      const result = await request(route, body, subject);
      assert.equal(result.status, 200, route + " " + JSON.stringify(result.body));
      return result.body;
    };
    function operation(athlete, device, seq, extra = {}) {
      return build({ op_id: "op-" + device + "-" + seq, athlete_id: athlete, device_id: device, device_seq: seq,
        predecessor: seq > 1 ? "op-" + device + "-" + (seq - 1) : null, parents: [], kind: "fact", class: "reading",
        lease_id: "lease-" + device, effective: { local_date: "2026-09-04", local_time: "12:00", utc_offset: "-04:00" },
        payload: { lb: { value: 160 + seq, unit: "lb" }, source: "athlete" }, ...extra,
      }, identityKeys[athlete]);
    }
    async function phone(athlete, device, trust = authorityKey) {
      const { createClient, memoryBackend } = loadPublicT2();
      const subject = athlete === "first" ? "clerk-first" : "clerk-second";
      let boundary, pending = [];
      const client = createClient({ athleteId: athlete, deviceId: device, identityKey: identityKeys[athlete],
        authorityKey: publicKeyOf(trust), backend: memoryBackend(), backoff: [0],
        lease: trust === authorityKey ? leases[device] : signLease(leases[device], trust),
        clock: { now: () => NOW, today: () => "2026-09-04", tz: "-04:00", monotonicMs: () => 1000 },
        transport: { send(op) {
          pending.push(post("/op", { device_id: device, operation: op }, subject).then(async result => {
            await boundary.acceptDisposition(result.disposition, op); return result;
          }));
          return undefined;
        } },
      });
      client.boot();
      const storeProof = (collection, key, value) => ({ durable: client.store.transaction(tx => tx.put(collection, key, value)).ok });
      const publicBoundary = createPublicBoundary({ keys: [publicKeyOf(trust)], athleteId: athlete, deviceId: device, client: {
        deliverDisposition: client.deliverDisposition,
        deliverReceipts(receipts) { client.deliverReceipts(receipts); client.reduceThroughW(); return { stored: true }; },
        receiveSnapshot: client.receiveSnapshot,
        syncedServerTime: record => storeProof("timeProofs", record.challenge, record),
        receiveLease: lease => storeProof("leaseProofs", lease.lease_id, lease),
        envelope: client.envelope,
      } });
      boundary = Object.fromEntries(Object.entries(publicBoundary).map(([name, value]) => [name,
        name.startsWith("accept") ? async (...args) => (await value(...args)).accepted === true : value]));
      const state = {
        outbox: { get size() { return client.outboxRetained(); } },
        get frontier() { return client.frontier(); },
        get receipts() { return client.store.list("receipts").sort((a, b) => a.seq - b.seq).map(row => ({ ...row, op: client.envelope(row.op_id) })); },
        get snapshots() { const snapshot = client.store.get("sync", "snapshot"); return snapshot ? [snapshot] : []; },
        get times() { return client.store.list("timeProofs"); }, get leases() { return client.store.list("leaseProofs"); },
      };
      return { state, boundary, subject, device, client,
        queue(op) { const saved = client.weighIn({ lb: op.payload.lb.value }); assert.equal(saved.acknowledged, true);
          assert.deepEqual(client.envelope(saved.op_id), op); },
        async send(op) { assert.deepEqual(client.envelope(op.op_id), op); pending = []; client.syncOnce();
          assert.equal(pending.length, 1); return (await Promise.all(pending))[0]; },
        async pull() { const envelope = await post("/pull", { device_id: device, after: state.frontier }, subject); await boundary.acceptPull(envelope); return envelope; },
      };
    }
    const a = await phone("first", "a"), b = await phone("first", "b"), c = await phone("second", "c");
    for (const p of [a, b, c]) {
      const enrol = await post("/enrol", { device_id: p.device }, p.subject);
      assert.equal(await p.boundary.acceptLease(enrol.lease), true);
    }
    const a1 = operation("first", "a", 1), b1 = operation("first", "b", 1), c1 = operation("second", "c", 1);
    a.queue(a1); b.queue(b1);
    // A failed durable revision assertion is transport unavailability, never
    // learned revocation (17) or a claimed frontier mismatch (18).
    for (const [route, fields, failAt] of [["/op", { operation: a1 }, 2],
      ["/pull", { after: 1 }, 4], ["/snapshot", { watermark: 1 }, 4], ["/lease", {}, 4]]) {
      let batches = 0;
      const refusingDB = { prepare: sql => runtime.db.prepare(sql), batch(statements) {
        if (++batches === failAt) return Promise.reject(new Error("injected durable batch refusal"));
        return runtime.db.batch(statements);
      } };
      const refusingWorker = createWorker({ bridge: createBridge({ db: refusingDB, authorityKey, identityKeys, clock: () => NOW }),
        authorityKey, auth: issuer.config, clock: () => NOW });
      const response = await refusingWorker.fetch(new Request("http://127.0.0.1" + route, { method: "POST", headers: {
        "Content-Type": "application/json", Origin: ORIGIN, Authorization: "Bearer " + issuer.token("clerk-first"),
      }, body: JSON.stringify({ device_id: "a", ...fields }) }));
      assert.equal(response.status, 503, route + " durable refusal");
      assert.deepEqual(await response.json(), { error: { code: "UNAVAILABLE" } });
      assert.equal(a.state.outbox.size, 1); assert.equal(a.state.frontier, 0);
      assert.equal(await bridge.invoke("frontier", ["first"]), 0);
    }
    const oversized = await request("/op", { device_id: "a", operation: a1, padding: "x".repeat(262144) });
    assert.equal(oversized.status, 413);
    let produced = 0, cancelled = false;
    const stream = new ReadableStream({ pull(controller) {
      if (++produced > 64) controller.close(); else controller.enqueue(new Uint8Array(16384).fill(120));
    }, cancel() { cancelled = true; } });
    const streamedResponse = await worker.fetch(new Request("http://127.0.0.1/op", { method: "POST", duplex: "half", headers: {
      "Content-Type": "application/json", Origin: ORIGIN, Authorization: "Bearer " + issuer.token("clerk-first"),
    }, body: stream }));
    assert.equal(streamedResponse.status, 413); assert.equal(cancelled, true); assert(produced < 64);
    assert.equal(await bridge.invoke("frontier", ["first"]), 0);
    await Promise.all([a.send(a1), b.send(b1)]);
    await a.pull(); await b.pull();
    a.client.restart(); b.client.restart();
    assert.equal(a.state.outbox.size, 0); assert.equal(b.state.outbox.size, 0);
    assert.equal(a.state.frontier, 2); assert.equal(b.state.frontier, 2);
    assert.deepEqual(a.state.receipts.map(r => r.seq), [1, 2]);

    c.queue(c1); await c.send(c1); await c.pull();
    c.client.restart();
    assert.equal(c.state.frontier, 1); assert.equal(c.state.outbox.size, 0);
    assert(c.state.receipts.every(row => row.op.athlete_id === "second"));
    assert(a.state.receipts.every(row => row.op.athlete_id === "first"));

    const forged = await phone("first", "forged", wrongKey), f1 = operation("first", "forged", 1);
    forged.queue(f1); const forgedReply = await forged.send(f1); await forged.pull();
    assert.equal(forgedReply.disposition.status, "ACCEPTED");
    assert.equal(forged.state.outbox.size, 1); assert.equal(forged.state.frontier, 0);

    // This persisted capability was signed by an unpinned key. An authenticated
    // caller and a correct operation HMAC cannot make that capability valid.
    const invalidLeaseReply = await post("/op", { device_id: "badlease", operation: operation("first", "badlease", 1) });
    assert.equal(invalidLeaseReply.disposition.status, "REJECTED");
    assert.equal(invalidLeaseReply.disposition.rejection_code, "LEASE_FORGED");

    const initialDisposition = (await post("/op", { device_id: "a", operation: a1 })).disposition;
    const replayDisposition = (await post("/op", { device_id: "a", operation: a1 })).disposition;
    assert.deepEqual(replayDisposition, initialDisposition);
    assert.equal(await bridge.invoke("frontier", ["first"]), 3);

    for (const [seq, stage, acceptedBeforeReply] of [[2, "before-acceptance", false], [3, "after-durable-before-reply", true]]) {
      const op = operation("first", "a", seq); a.queue(op);
      const before = await bridge.invoke("frontier", ["first"]);
      host.cut(stage);
      await assert.rejects(() => a.send(op));
      assert.equal(a.state.outbox.size, 1);
      assert.equal(await bridge.invoke("frontier", ["first"]), before + (acceptedBeforeReply ? 1 : 0));
      const durableBeforeRetry = await bridge.invoke("disposition", ["first", "a", seq]);
      const retry = await a.send(op);
      assert.equal(retry.disposition.status, "ACCEPTED");
      if (acceptedBeforeReply) assert.deepEqual(retry.disposition, durableBeforeRetry);
      assert.equal(await bridge.invoke("frontier", ["first"]), before + 1);
      assert.equal(a.state.outbox.size, 0);
    }

    // Every endpoint is attacked with the same issuer/audience/origin policy,
    // including endpoints whose success implementation is explicitly pending.
    const imposter = testIssuer();
    const invalid = subject => [
      { token: issuer.token(subject, { iss: "https://wrong.invalid" }) },
      { token: issuer.token(subject, { aud: "wrong-audience" }) },
      { token: issuer.token(subject, { exp: Date.parse(NOW) / 1000 }) },
      { token: issuer.token(subject, { nbf: Date.parse(NOW) / 1000 + 1 }) },
      { token: issuer.token(subject, { azp: "https://wrong.invalid" }) },
      { token: issuer.token(subject), origin: "https://wrong.invalid" },
      { token: issuer.token(subject), origin: "" },
      { token: imposter.token(subject) },
      { token: issuer.token(subject, {}, { alg: "none" }) },
      { token: issuer.token(subject, {}, { kid: "not-pinned" }) },
    ];
    for (const route of ROUTES) {
      const body = { device_id: "a", operation: a1, after: 0, watermark: 0, challenge: randomBytes(24).toString("base64url") };
      for (const [subject, ownDevice, foreignDeviceId, foreignAthlete] of [
        ["clerk-first", "a", "c", "second"], ["clerk-second", "c", "a", "first"],
      ]) {
        for (const attack of invalid(subject)) {
          const response = await request(route, { ...body, device_id: ownDevice }, subject,
            { headers: { Authorization: "Bearer " + attack.token, Origin: attack.origin ?? ORIGIN } });
          assert.equal(response.status, 401, route + " auth rejection");
          assert.deepEqual(response.body, { error: { code: "UNAUTHENTICATED", state: 11 } });
        }
        const foreignDevice = await request(route, { ...body, device_id: foreignDeviceId }, subject);
        assert.equal(foreignDevice.status, 403, route + " foreign enrolled device");
        const suppliedAthlete = await request(route, { ...body, device_id: ownDevice, athlete_id: foreignAthlete }, subject);
        assert.equal(suppliedAthlete.status, 403, route + " supplied athlete id");
      }
    }
    const foreignOp = await request("/op", { device_id: "a", operation: c1 });
    assert.equal(foreignOp.status, 403);
    const foreignReference = operation("first", "a", 4, { parents: [c1.op_id] });
    const rejectedReference = await post("/op", { device_id: "a", operation: foreignReference });
    assert.equal(rejectedReference.disposition.rejection_code, "CROSS_ATHLETE_REFERENCE");
    for (const route of ["/import", "/restore"]) {
      const pending = await request(route, { device_id: "a" });
      assert.equal(pending.status, 501); assert.equal(pending.body.error.code, "NOT_IMPLEMENTED");
    }

    // Forged public envelopes must leave every callback and frontier untouched.
    const unsignedOp = operation("first", "b", 2); b.queue(unsignedOp);
    const genuine = (await post("/op", { device_id: "b", operation: unsignedOp })).disposition;
    const unsigned = { ...genuine }; delete unsigned.authority_signature;
    assert.equal(await b.boundary.acceptDisposition(unsigned, unsignedOp), false);
    assert.equal(await b.boundary.acceptDisposition({ ...genuine, athlete_log_seq: 900 }, unsignedOp), false);
    assert.equal(b.state.outbox.size, 1);
    assert.equal(await b.boundary.acceptDisposition(genuine, unsignedOp), true);
    assert.equal(b.state.outbox.size, 0);
    const pull = await post("/pull", { device_id: "a", after: a.state.frontier });
    const previousFrontier = a.state.frontier;
    assert.equal(await a.boundary.acceptPull(signPull({ ...pull, wire_version: "unsupported" }, authorityKey)), false);
    assert.equal(await a.boundary.acceptPull(signPull({ ...pull, key_epoch: "not-pinned" }, authorityKey)), false);
    assert.equal(await a.boundary.acceptPull({ ...pull, through: 999 }), false);
    const unsignedPull = { ...pull }; delete unsignedPull.authority_signature;
    assert.equal(await a.boundary.acceptPull(unsignedPull), false);
    const alteredReceipt = structuredClone(pull); alteredReceipt.receipts[0].op.payload.lb.value = 999;
    assert.equal(await a.boundary.acceptPull(alteredReceipt), false);
    // A correctly signed outer envelope does not excuse an unsigned or altered
    // inner receipt. This independently exercises the receipt verification.
    assert.equal(await a.boundary.acceptPull(signPull(alteredReceipt, authorityKey)), false);
    const unsignedReceipt = structuredClone(pull); delete unsignedReceipt.receipts[0].authority_signature;
    assert.equal(await a.boundary.acceptPull(signPull(unsignedReceipt, authorityKey)), false);
    assert.equal(a.state.frontier, previousFrontier);
    assert.equal(await a.boundary.acceptPull(pull), true);
    const snapshot = await post("/snapshot", { device_id: "a", watermark: 2 });
    assert.equal(snapshot.W, 2); assert.equal(snapshot.entries.length, 2);
    assert.equal(await a.boundary.acceptSnapshot(signSnapshot({ ...snapshot, wire_version: "unsupported" }, authorityKey)), false);
    assert.equal(await a.boundary.acceptSnapshot({ ...snapshot, W: 999 }), false);
    const unsignedSnapshot = { ...snapshot }; delete unsignedSnapshot.authority_signature;
    assert.equal(await a.boundary.acceptSnapshot(unsignedSnapshot), false);
    const unsignedSnapshotReceipt = structuredClone(snapshot); delete unsignedSnapshotReceipt.entries[0].authority_signature;
    assert.equal(await a.boundary.acceptSnapshot(signSnapshot(unsignedSnapshotReceipt, authorityKey)), false);
    assert.equal(a.state.snapshots.length, 0);
    assert.equal(await a.boundary.acceptSnapshot(snapshot), true);
    const lease = (await post("/lease", { device_id: "a" })).lease;
    assert.equal(await a.boundary.acceptLease({ ...lease, not_after: "2099-01-01T00:00:00Z" }), false);
    const unsignedLease = { ...lease }; delete unsignedLease.signature;
    assert.equal(await a.boundary.acceptLease(unsignedLease), false);
    assert.equal(await a.boundary.acceptLease(signLease({ ...lease, schema_version: 2 }, authorityKey)), false);
    assert.equal(await a.boundary.acceptLease(lease), true);
    const challenge = a.boundary.beginTimeChallenge();
    const time = await post("/time", { device_id: "a", ...challenge });
    assert.equal(time.wire_version, WIRE_VERSION); assert.equal(time.time_profile, TIME_PROFILE);
    assert.equal(await a.boundary.acceptServerTime(signServerTime({ ...time, wire_version: "unsupported" }, authorityKey)), false);
    assert.equal(await a.boundary.acceptServerTime(signServerTime({ ...time, time_profile: "unsupported" }, authorityKey)), false);
    assert.equal(await a.boundary.acceptServerTime({ ...time, server_time: "2099-01-01T00:00:00Z" }), false);
    assert.equal(a.state.times.length, 0);
    // A rejected attempt consumes no valid challenge. A newly requested proof
    // must match its unpredictable outstanding challenge exactly, once only.
    const nextChallenge = a.boundary.beginTimeChallenge();
    const nextTime = await post("/time", { device_id: "a", ...nextChallenge });
    assert.equal(await a.boundary.acceptServerTime(time), false);
    assert.equal(await a.boundary.acceptServerTime(nextTime), true);
    assert.equal(await a.boundary.acceptServerTime(nextTime), false);
    assert.equal(a.state.times.length, 1);
    const summary = { scenarios: 5, passed: 5, http: "real-local", cuts: ["before-acceptance", "after-durable-before-reply"],
      authRoutes: ROUTES.size, subjects: 2, attacksPerRoutePerSubject: 12, authorityPublicKeysOnly: true,
      client: "frozen T2 through public-verification seam", streamedByteCap: true, durableRefusalStaysRetryable: true };
    if (!options.quiet) console.log("HTTP-190 PASS (5/5 over real local HTTP with the C6 cuts)");
    return summary;
  } finally {
    if (host) await host.close();
    if (ownedRuntime) await runtime.close();
  }
}

if (require.main === module) run().catch(() => { console.log("HTTP-190 FAIL"); process.exitCode = 1; });
module.exports = { run, hostWorker, testIssuer };
