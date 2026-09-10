import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { buildBrowser } from "../build-browser.mjs";
import { Client, O, initial, config } from "./support.mjs";
const require = createRequire(import.meta.url), here = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { runActionVectors } = require("./contract-probe.cjs");
const Signer = require("../../w5/crypto.cjs");
const vectors = require("../../w5/fixtures/contract-v1.json");
const { chromium } = require("playwright-core");
if (!process.env.W6_BROWSER_BIN || !existsSync(process.env.W6_BROWSER_BIN)) {
  console.log("W6 BROWSER-T2 BLOCKED — W6_BROWSER_BIN must name an installed Chromium browser"); process.exit(2);
}
const built = await buildBrowser({ outfile: join(here, ".tmp/browser/contract.js"), entryPoints: [join(here, "test/browser-contract-entry.mjs")] });
const key = Signer.generateSigningKey("w6-run"), publicKey = Signer.publicKeyOf(key);
// Keep all six historical assertions fixed when a later dependency adds a domain.
// The new current-head domain/consumer gets an explicit additional path below.
for (const [kind, domain] of Object.entries(vectors.domains)) assert.equal(Signer.DOMAINS[kind], domain);
const records = Object.keys(vectors.domains).map(kind => {
  const suffix = kind[0].toUpperCase() + kind.slice(1);
  const record = Signer[`sign${suffix}`]({ text: "Cafe\u0301", n: 3, causal_parents: ["b", "a", "b"] }, key);
  return { kind, record };
});
const leases = Object.fromEntries([undefined, [1, 2], [1, 3]].map(range => [JSON.stringify(range || null), O.lease("dev-A", range ? { range } : {})]));
const expected = runActionVectors(Client, O);
const profile = mkdtempSync(join(here, ".tmp/browser-t2-"));
const server = createServer((request, response) => {
  if (request.url === "/contract.js") { response.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" }); response.end(readFileSync(built.outfile)); return; }
  if (request.url === "/") { response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" }); response.end("<!doctype html><title>W6 synthetic client test</title>"); return; }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let context;
try {
  context = await chromium.launchPersistentContext(profile, { executablePath: process.env.W6_BROWSER_BIN, headless: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage(); await page.goto(origin);
  const actual = await page.evaluate(async ({ leases, auth }) => {
    window.W6 = await import("/contract.js");
    const fake = { AUTH_KEY: auth, lease: (_dev, opts = {}) => structuredClone(leases[JSON.stringify(opts.range || null)]) };
    return W6.runActionVectors(W6.Client, fake);
  }, { leases, auth: O.AUTH_KEY });
  assert.deepEqual(actual, expected);
  const verification = await page.evaluate(async ({ publicKey, records, vectors }) => {
    const verifier = W6.W5.createPublicVerifier({ keys: [publicKey] });
    let verified = 0, refused = 0;
    for (const { kind, record } of records) {
      const name = `verify${kind[0].toUpperCase()}${kind.slice(1)}`;
      if (await verifier[name](record)) verified++;
      if (!await verifier[name]({ ...record, n: 4 })) refused++;
      for (const domain of Object.values(W6.W5.DOMAINS).filter(value => value !== W6.W5.DOMAINS[kind])) {
        if (Object.values(vectors.domains).includes(domain) && !await verifier.verifyRecord(record, domain, kind === "lease" ? "signature" : "authority_signature")) refused++;
      }
    }
    for (const vector of vectors.canonicalVectors) {
      const text = new TextDecoder().decode(W6.W5.canonicalBytes(vector.record, vector.domain, vector.field));
      if (text !== vector.canonicalText) throw new Error("canonical mismatch");
    }
    for (const vector of vectors.encodingVectors) {
      const raw = W6.W5.decodeSignature(vector.signature)?.raw;
      if (!raw || [...raw].map(b => b.toString(16).padStart(2, "0")).join("") !== vector.rawHex) throw new Error("signature encoding mismatch");
    }
    return { verified, refused };
  }, { publicKey, records, vectors });
  assert.deepEqual(verification, { verified: 6, refused: 36 });
  const cfg = config(); delete cfg.clock;
  const result = await page.evaluate(async ({ seed, cfg }) => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const repo = await W6.openRepository({ databaseName: "w6-actual-browser-t2", namespace: "synthetic/A", keyProvider: () => key, authorizeEnrollment: () => true });
    await repo.initialize(seed, "synthetic-only");
    const stage = W6.Stage.createT2Stage(() => ({ ...cfg, clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", tz: "+00:00", monotonicMs: () => 0 } }));
    const bridge = W6.createBridge({ repository: repo, stage, validateCommit: () => null });
    const first = await bridge.execute("logSession", { sets: [{ load: 100, reps: 8 }, { load: 90, reps: 7 }] });
    const next = await bridge.execute("finishSession");
    const stored = await repo.load(); const reopened = await bridge.reopen(); repo.close();
    return { first, next, stored: stored.generation, reopened };
  }, { seed: initial(), cfg });
  assert.equal(result.first.acknowledged, true); assert.equal(result.first.op_ids.length, 3); assert.equal(result.next.acknowledged, true);
  assert.equal(Object.keys(result.stored.collections.ops).length, 4); assert.equal(Object.keys(result.stored.collections.outbox).length, 4);
  assert.equal(result.reopened.refusal, null);
  const publicLease = Signer.signLease({ ...O.lease("dev-A"), schema_version: 1 }, key);
  const queued = await page.evaluate(async ({ seed, cfg, lease, publicKey }) => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    window.publicRepo = await W6.openRepository({ databaseName: "w6-browser-public", namespace: "synthetic/public-A", keyProvider: () => key, authorizeEnrollment: () => true });
    seed.metadata.authorityLease = lease; await publicRepo.initialize(seed, "synthetic-only");
    window.refusePublic = null;
    const stage = W6.Stage.createT2Stage(() => ({ ...cfg, clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", tz: "+00:00", monotonicMs: () => 0 } }), { allowInbound: true });
    window.publicArgs = { repository: publicRepo, stage, namespace: "synthetic/public-A", athleteId: "ath-1", deviceId: "dev-A", sessionEpoch: 1,
      isCurrentSession: () => true, observationEpoch: () => 1, observationGuard: { run: async (_kind, action) => action() }, // Synthetic only, not the durable knowledge fence.
      keys: [publicKey], validateCommit: () => refusePublic ? { state: refusePublic, code: "SYNTHETIC_FINAL_REFUSAL" } : null };
    window.publicClient = W6.createDurablePublicClient(publicArgs);
    const write = await publicClient.execute("weighIn", { lb: 170.6 });
    return (await publicRepo.load()).generation.collections.ops[write.op_id];
  }, { seed: initial(), cfg, lease: publicLease, publicKey });
  const disposition = Signer.signDisposition({ op_id: queued.op_id, device_id: queued.device_id, device_seq: queued.device_seq, canonical_content_commitment: queued.canonical_content_commitment,
    status: "ACCEPTED", athlete_log_seq: 1, decided_at: "2026-09-04T00:00:00Z" }, key);
  const delivered = await page.evaluate(async ({ disposition, version }) => {
    const forged = await publicClient.acceptResponse("disposition", { wireVersion: version, body: { disposition: { ...disposition, authority_signature: "bad" } } });
    const pending = Object.keys((await publicRepo.load()).generation.collections.outbox).length;
    const accepted = await publicClient.acceptResponse("disposition", { wireVersion: version, body: { disposition } });
    const stored = await publicRepo.load();
    return { forged, pending, accepted, stored: stored.generation };
  }, { disposition, version: "earned/w5-http/v1" });
  assert.equal(delivered.forged.accepted, false); assert.equal(delivered.pending, 1); assert.equal(delivered.accepted.result.durable, true);
  assert.equal(Object.keys(delivered.stored.collections.outbox).length, 0);
  assert.deepEqual(delivered.stored.metadata.wireProofs.disposition[disposition.authority_signature], disposition);
  const emptyPull = Signer.signPull({ athlete_id: "ath-1", device_id: "dev-A", after: 0, through: 0, receipts: [], wire_version: "earned/w5-http/v1", key_epoch: publicKey.kid }, key);
  const refused = await page.evaluate(async body => {
    window.refusePublic = 20; const before = await publicRepo.load();
    const result = await publicClient.acceptResponse("pull", { wireVersion: "earned/w5-http/v1", body });
    return { result, same: JSON.stringify(await publicRepo.load()) === JSON.stringify(before) };
  }, emptyPull);
  assert.equal(refused.result.state, 20); assert.equal(refused.result.result.durable, false); assert.equal(refused.same, true);
  if (Signer.DOMAINS.currentHead !== undefined) {
    assert.equal(Signer.DOMAINS.currentHead, "earned/current-head/v1");
    let mode = "empty", lastHead;
    const Ops = require("../../../client/ops.cjs");
    await page.exposeFunction("syntheticHeadReply", request => {
      const receipts = [];
      if (mode !== "empty") {
        const op = Ops.build({ op_id: "browser-remote-head", athlete_id: "ath-1", device_id: "dev-B", device_seq: 1,
          parents: [], kind: "fact", class: "reading", effective: { local_date: "2026-09-04", local_time: "00:00", utc_offset: "+00:00" },
          lease_id: "synthetic-remote", payload: { lb: { value: 160, unit: "lb" } } }, "synthetic-only");
        const receipt = Signer.signReceipt({ seq: request.after + 1, op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment,
          op, accepted_at: "2026-09-04T00:00:00Z" }, key);
        if (mode === "bad-inner") receipt.op.payload.lb.value++;
        receipts.push(receipt);
      }
      lastHead = Signer.signCurrentHead({ ...request, athlete_id: "ath-1", head: request.after + receipts.length,
        through: request.after + receipts.length, receipts, wire_version: "earned/w5-http/v1", key_epoch: publicKey.kid }, key);
      return { wireVersion: "earned/w5-http/v1", body: lastHead };
    });
    await page.evaluate(async () => { refusePublic = null; const r = await publicClient.execute("weighIn", { lb: 170.8 }); if (!r.acknowledged) throw Error("Local positive control failed"); });
    for (const selected of ["empty", "nonempty"]) {
      mode = selected;
      const actual = await page.evaluate(async () => {
        const before = await publicRepo.load();
        const result = await publicClient.exchangeCurrentHead(q => syntheticHeadReply(q), { issuanceAttempt: "browser-head" });
        return { before, result, after: await publicRepo.load() };
      });
      assert.equal(actual.result.accepted, true); assert.equal(actual.result.result.confirmed, true);
      assert.equal(actual.after.revision, actual.before.revision + 1);
      assert.deepEqual(actual.after.generation.metadata.wireProofs.currentHead[lastHead.authority_signature], lastHead);
      assert.deepEqual(actual.after.generation.collections.outbox, actual.before.generation.collections.outbox);
    }
    const history = await page.evaluate(async () => {
      const before = await publicRepo.load(), reopened = W6.createDurablePublicClient(publicArgs);
      return { view: await reopened.reopen(), before, after: await publicRepo.load(), hasObservation: Object.hasOwn(reopened.current(), "observation") };
    });
    assert.equal(history.view.refusal, null); assert.equal(history.hasObservation, false); assert.deepEqual(history.after, history.before);
    mode = "bad-inner";
    const bad = await page.evaluate(async () => {
      const before = await publicRepo.load(), result = await publicClient.exchangeCurrentHead(q => syntheticHeadReply(q), { issuanceAttempt: "bad-inner" });
      return { before, result, after: await publicRepo.load() };
    });
    assert.equal(bad.result.accepted, false); assert.equal(bad.result.state, 12); assert.deepEqual(bad.after, bad.before);
    mode = "empty";
    const race = await page.evaluate(async () => {
      let request, enter, release; const entered = new Promise(resolve => { enter = resolve; });
      const pending = publicClient.exchangeCurrentHead(q => { request = q; enter(); return new Promise(resolve => { release = resolve; }); }, { issuanceAttempt: "browser-race" });
      await entered; const write = await publicClient.execute("weighIn", { lb: 170.9 });
      const afterWrite = await publicRepo.load(); release(await syntheticHeadReply(request));
      return { write, afterWrite, result: await pending, after: await publicRepo.load() };
    });
    assert.equal(race.write.acknowledged, true); assert.equal(race.result.accepted, false); assert.equal(race.result.state, 18);
    assert.deepEqual(race.after, race.afterWrite);
    console.log("W6 BROWSER-CURRENT-HEAD PASS — 5/5 actual WebCrypto/T2/IndexedDB cases: empty/nonempty exact envelope+outbox, historical reopen, inner-signature refusal, real competing local write; synthetic signer/transport/observation guard; not phone/CLOCK");
  } else console.log("W6 BROWSER-CURRENT-HEAD BLOCKED — retained old W5 dependency; use the explicitly pinned composition for this new capability");
  console.log(`W6 BROWSER-T2 PASS — 56 exact Node/browser action/state/clock vectors; 6 signed surfaces +36 tamper/domain refusals; actual T2 session/finish persisted in IndexedDB; Chromium ${context.browser().version()}`);
  console.log("W6 BROWSER-PUBLIC-SINK PASS — verified P-256 disposition through actual T2 and IndexedDB, forged response no drain, original proof retained, final20 abort preserves generation");
  console.log("W6 CLOCK / full STANDING / iPhone acceptance BLOCKED — time bounds, knowledge fence and phone evidence remain unproved");
} finally {
  if (context) await context.close(); await new Promise(resolve => server.close(resolve)); rmSync(profile, { recursive: true, force: true });
}
