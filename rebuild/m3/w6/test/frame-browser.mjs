import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync, cpSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { buildBrowser } from "../build-browser.mjs";
import { initial, config, O } from "./support.mjs";
import { runFrameMigrationContract } from "./frame-browser-migration.mjs";
import { runFrameNonceBrowser } from "./frame-nonce-browser.mjs";
const require = createRequire(import.meta.url), here = resolve(dirname(fileURLToPath(import.meta.url)), ".."), { chromium } = require("playwright-core");
if (!process.env.W6_BROWSER_BIN || !existsSync(process.env.W6_BROWSER_BIN)) { console.log("W6 FRAME-BROWSER BLOCKED — installed browser required"); process.exit(2); }
const built = await buildBrowser({ outfile: join(here, ".tmp/browser/frame.js"), entryPoints: [join(here, "test/frame-browser-entry.mjs")] });
const vectors = JSON.parse(readFileSync(new URL("fixtures/rfc8452-aes256.json", import.meta.url))).vectors;
const servedBundles = new Map([["/frame.js", built.outfile]]);
const server = createServer((request, response) => { response.setHeader("Cache-Control", "no-store"); if (servedBundles.has(request.url)) { response.setHeader("Content-Type", "text/javascript"); response.end(readFileSync(servedBundles.get(request.url))); } else { response.setHeader("Content-Type", "text/html"); response.end("<!doctype html><title>W6 synthetic frame test</title>"); } });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve)); const origin = `http://127.0.0.1:${server.address().port}`; let browser;
const runFrameContract = async ({ vectors, generation, lease, auth, bundle = "/frame.js" }) => {
    const F = await import(bundle), hex = x => Uint8Array.from(x.match(/../g) || [], n => parseInt(n, 16)), toHex = x => [...x].map(n => n.toString(16).padStart(2, "0")).join("");
    for (const v of vectors) {
      if (toHex(F.gcmsiv(hex(v.key), hex(v.nonce), hex(v.aad)).encrypt(hex(v.plaintext))) !== v.ciphertext) throw new Error("RFC encrypt mismatch");
      if (toHex(F.gcmsiv(hex(v.key), hex(v.nonce), hex(v.aad)).decrypt(hex(v.ciphertext))) !== v.plaintext) throw new Error("RFC decrypt mismatch");
    }
    const f = F.frame(), aad = F.frameAad(F.record({ namespace: "x".repeat(768) })), key = crypto.getRandomValues(new Uint8Array(32)), attempt = F.createFrameAttempt(key), nonce = attempt.nonce(), sealed = attempt.encrypt(aad, F.encodeFrame(f));
    if (JSON.stringify(F.decodeFrame(F.decryptFrame(key, nonce, aad, sealed))) !== JSON.stringify(f) || aad.length !== 922) throw new Error("frame roundtrip mismatch");
    let rejected = 0; try { F.parseStrictJson('{"x":1,"\\u0078":2}'); } catch { rejected++; }
    for (const size of [16, 24]) try { F.createFrameAttempt(new Uint8Array(size)); } catch { rejected++; }
    for (const size of [11, 13, 16]) try { F.decryptFrame(key, new Uint8Array(size), aad, sealed); } catch { rejected++; }
    const disguised = new Uint8Array(16); Object.defineProperty(disguised, "length", { value: 32 }); try { F.createFrameAttempt(disguised); } catch { rejected++; }
    const alias = new Uint8Array(32); Object.defineProperty(alias, "slice", { value: () => alias }); try { F.createFrameAttempt(alias); } catch { rejected++; }
    const fakeNonce = new Uint8Array(8); Object.defineProperty(fakeNonce, "length", { value: 12 }); try { F.createFrameAttempt(key, { getRandomValues: () => fakeNonce }); } catch { rejected++; }
    const decorated = new ArrayBuffer(8); Object.defineProperty(decorated, "byteLength", { value: 16 }); const decoratedRecord = F.record(); decoratedRecord.body.ciphertext = decorated; try { F.frameAad(decoratedRecord); } catch { rejected++; }
    const bodyKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]), frameKey = crypto.getRandomValues(new Uint8Array(32));
    const args = { databaseName: "synthetic-frame-browser", namespace: "synthetic-frame-browser", bodyKeyProvider: () => bodyKey,
      frameKeyProvider: () => ({ keyEpoch: 1, keyBytes: frameKey, revisionStart: 1 }), authorizeEnrollment: () => true, proofValidators: { "batch/1": () => true } };
    const repo = await F.openFrameRepository(args), body = { format: 2, collections: generation.collections, retainedMetadata: generation.metadata, proofs: [] };
    await repo.commitPrepared(null, await repo.prepare(null, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), () => ({ kind: "publish", frameFields: f }), { enrollmentEvidence: "synthetic" });
    const basis = await repo.load(), stage = F.Stage.createT2Stage(() => ({ deviceId: "dev-A", athleteId: "ath-1", identityKey: "synthetic-identity", authorityKey: auth, lease,
      clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", monotonicMs: () => 0 } }));
    const candidate = stage({ collections: basis.body.collections, metadata: basis.body.retainedMetadata }, "logSession", { sets: [{ exercise: "squat", reps: 5, load: 100 }, { exercise: "squat", reps: 5, load: 100 }] });
    if (!candidate.result.acknowledged) throw new Error("actual T2 failed"); const batch = candidate.commit.batch;
    const proof = F.makeProof("batch", 1, new TextEncoder().encode(JSON.stringify(batch))), nextBody = { format: 2, collections: candidate.generation.collections, retainedMetadata: candidate.generation.metadata, proofs: [proof] };
    const cap = await repo.prepare(basis, nextBody, { bodyKeyEpoch: 1, frameKeyEpoch: 1, batch }); let finalObservedW = 12345;
    await repo.commitPrepared(basis, cap, () => ({ kind: "publish", frameFields: F.frame({ kind: 0, H: finalObservedW, W_last: finalObservedW, U: batch.count, batchCount: batch.count, firstSequence: batch.firstSequence, lastSequence: batch.lastSequence, batchRef: proof.digest }) }));
    repo.close(); const reopened = await F.openFrameRepository(args), after = await reopened.load();
    if (after.frame.H !== finalObservedW || after.frame.U !== batch.count || JSON.stringify(after.body) !== JSON.stringify(nextBody)) throw new Error("frame/store mismatch");
    const control = await reopened.prepare(after, after.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
    await reopened.commitPrepared(after, control, () => ({ kind: "control", state: 20, code: "SYNTHETIC", frameFields: F.frame({ state: 20, U: after.frame.U, H: after.frame.H, W_last: after.frame.W_last }) }));
    const refused = await reopened.load(); if (toHex(new Uint8Array(refused.active.body.ciphertext)) !== toHex(new Uint8Array(after.active.body.ciphertext)) || refused.frame.U !== after.frame.U) throw new Error("control changed body/slots");
    const changePrevious = value => new Promise((resolve, reject) => {
      const request = indexedDB.open(args.databaseName, 2); request.onerror = () => reject(request.error);
      request.onsuccess = () => { const db = request.result, tx = db.transaction("generations", "readwrite"); tx.objectStore("generations").put(value, "previous");
        tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = () => { db.close(); reject(tx.error); }; };
    });
    const bytes = value => JSON.stringify(value, (_name, v) => v instanceof ArrayBuffer ? [...new Uint8Array(v)] : v instanceof Uint8Array ? [...v] : v);
    let previousRefusals = 0;
    try {
      const alteredPrevious = structuredClone(refused.previous); alteredPrevious.body.iv[0] ^= 1;
      for (const [name, previous] of [["altered-retained", alteredPrevious], ["coherent-older", basis.active]]) {
        await changePrevious(previous); let state;
        try { await reopened.load(); } catch (error) { state = error.state; }
        if (state !== 18) throw new Error(`FRAME-PREVIOUS ASSERT ${name}: expected18, received${state ?? "successful-read"}`);
        previousRefusals++;
        await changePrevious(refused.previous); const restored = await reopened.load();
        if (bytes({ active: restored.active, previous: restored.previous }) !== bytes({ active: refused.active, previous: refused.previous })) throw new Error("FRAME-PREVIOUS restore changed complete pair");
      }
    } finally { await changePrevious(refused.previous); reopened.close(); }
    return { vectors: vectors.length, rejected, batch: batch.count, unproven: after.unproven, previousRefusals };
};
// Real IndexedDB mechanics with synthetic providers only; no production key custody or checkpoint.
const runFrameKeyContract = async ({ generation, lease, auth, bundle = "/frame.js" }) => {
  const F = await import(bundle), bodies = new Map(), frames = new Map(), requests = [];
  const check = (condition, label) => { if (!condition) throw new Error(`FRAME-KEY ASSERT ${label}`); };
  const bytes = value => JSON.stringify(value, (_name, v) => v instanceof ArrayBuffer ? { ArrayBuffer: [...new Uint8Array(v)] } : v instanceof Uint8Array ? { Uint8Array: [...v] } : v);
  const same = (left, right) => bytes(left) === bytes(right);
  for (const epoch of [1, 2]) bodies.set(epoch, await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]));
  for (const epoch of [1, 2, 3]) frames.set(epoch, crypto.getRandomValues(new Uint8Array(32)));
  const cut = { armed: false, requestSucceeded: false, published: false, earlyPublication: false, aborts: 0, completes: 0, puts: [] };
  const wrapped = { open(...args) { const request = indexedDB.open(...args); request.addEventListener("success", () => {
    const db = request.result, transaction = db.transaction.bind(db);
    db.transaction = (...args) => {
      const tx = transaction(...args); if (!cut.armed || args[1] !== "readwrite") return tx;
      tx.addEventListener("abort", () => { cut.aborts++; }); tx.addEventListener("complete", () => { cut.completes++; });
      const store = tx.objectStore("generations"), put = store.put.bind(store), objectStore = tx.objectStore.bind(tx);
      store.put = (value, key) => {
        cut.puts.push(key); const written = put(value, key);
        if (key === "active") written.addEventListener("success", () => {
          cut.requestSucceeded = true; cut.earlyPublication = cut.published; tx.abort();
        });
        return written;
      };
      tx.objectStore = name => name === "generations" ? store : objectStore(name); return tx;
    };
  }); return request; } };
  const args = { indexedDB: wrapped, databaseName: "synthetic-frame-key-browser", namespace: "synthetic-frame-key-browser",
    bodyKeyProvider: ({ keyEpoch }) => { requests.push(["body", keyEpoch]); return bodies.get(keyEpoch); },
    frameKeyProvider: ({ keyEpoch }) => { requests.push(["frame", keyEpoch]); return { keyEpoch, keyBytes: frames.get(keyEpoch), revisionStart: 1 }; },
    authorizeEnrollment: () => true, proofValidators: { "batch/1": () => true } };
  const storedPair = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(args.databaseName, 2); request.onerror = () => reject(new Error("FRAME-KEY raw open failed"));
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction("generations", "readonly"), store = tx.objectStore("generations"); let active, previous;
      store.get("active").onsuccess = event => { active = event.target.result; };
      store.get("previous").onsuccess = event => { previous = event.target.result; };
      tx.oncomplete = () => { db.close(); resolve({ active, previous }); }; tx.onabort = () => { db.close(); reject(new Error("FRAME-KEY raw read aborted")); };
    };
  });
  let repo = await F.openFrameRepository(args);
  try {
    const body = { format: 2, collections: generation.collections, retainedMetadata: generation.metadata, proofs: [] };
    await repo.commitPrepared(null, await repo.prepare(null, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), () => ({ kind: "publish", frameFields: F.frame() }), { enrollmentEvidence: "synthetic-only" });
    const seed = await repo.load(), stage = F.Stage.createT2Stage(() => ({ deviceId: "dev-A", athleteId: "ath-1", identityKey: "synthetic-identity", authorityKey: auth, lease,
      clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", monotonicMs: () => 0 } }));
    const candidate = stage({ collections: seed.body.collections, metadata: seed.body.retainedMetadata }, "logSession", { sets: [{ exercise: "squat", reps: 5, load: 100 }, { exercise: "squat", reps: 5, load: 100 }] });
    check(candidate.result.acknowledged, "actual T2 staging failed"); const batch = candidate.commit.batch;
    const proof = F.makeProof("batch", 1, new TextEncoder().encode(JSON.stringify(batch))), nextBody = { format: 2, collections: candidate.generation.collections, retainedMetadata: candidate.generation.metadata, proofs: [proof] };
    const batchFields = F.frame({ kind: 0, U: batch.count, batchCount: batch.count, firstSequence: batch.firstSequence, lastSequence: batch.lastSequence, batchRef: proof.digest });
    await repo.commitPrepared(seed, await repo.prepare(seed, nextBody, { bodyKeyEpoch: 1, frameKeyEpoch: 1, batch }), () => ({ kind: "publish", frameFields: batchFields }));
    let basis = await repo.load(); const beforePair = await storedPair(), expectedBody = bytes(basis.body);
    check(batch.count > 1 && Object.keys(basis.body.collections.ops).length === batch.count && Object.keys(basis.body.collections.outbox).length === batch.count, "nonempty actual T2 batch/outbox required");
    const unchangedTruth = loaded => {
      check(bytes(loaded.body) === expectedBody, "actual T2 collections/metadata/proofs changed");
      check(loaded.frame.U === batch.count && loaded.unproven === true && loaded.frame.checkpointRef === null && loaded.frame.guard === 0 && loaded.frame.state === 18, "rotation claimed checkpoint/permission or changed U");
    };
    unchangedTruth(basis);
    const rotationFields = () => F.frame({ kind: 1, U: batch.count });
    const abortedCapability = await repo.prepare(basis, basis.body, { bodyKeyEpoch: 2, frameKeyEpoch: 2 });
    cut.armed = true; let refusal;
    try { await repo.commitPrepared(basis, abortedCapability, () => ({ kind: "publish", frameFields: rotationFields() })); cut.published = true; }
    catch (error) { refusal = error.state; }
    cut.armed = false;
    check(refusal === 3 && !cut.published && !cut.earlyPublication && cut.requestSucceeded && cut.aborts === 1 && cut.completes === 0 && same(cut.puts, ["previous", "active"]), "rotation abort/ack cut not exercised");
    check(same(await storedPair(), beforePair), "aborted rotation changed stored pair");
    repo.close(); repo = await F.openFrameRepository(args); basis = await repo.load(); unchangedTruth(basis);
    check(same({ active: basis.active, previous: basis.previous }, beforePair), "aborted rotation reopen changed pair");
    const rotated = await repo.commitPrepared(basis, await repo.prepare(basis, basis.body, { bodyKeyEpoch: 2, frameKeyEpoch: 2 }), () => ({ kind: "publish", frameFields: rotationFields() }));
    check(rotated.durable === true && rotated.stored === true, "rotation success not durable");
    const rotationPair = await storedPair();
    check(rotationPair.active.body.keyEpoch === 2 && rotationPair.active.frameKeyEpoch === 2 && rotationPair.previous.body.keyEpoch === 1 && rotationPair.previous.frameKeyEpoch === 1 && same(rotationPair.previous, beforePair.active), "rotation epoch/predecessor mismatch");
    repo.close(); repo = await F.openFrameRepository(args); basis = await repo.load(); unchangedTruth(basis);
    check(same({ active: basis.active, previous: basis.previous }, rotationPair), "rotation reopen changed pair");
    let keyRefusals = 0, keyRestorations = 0;
    for (const [name, map] of [["body", bodies], ["frame", frames]]) {
      const saved = map.get(1); map.delete(1); requests.length = 0; repo.close(); repo = await F.openFrameRepository(args);
      let state, returned = false;
      try { await repo.load(); returned = true; } catch (error) { state = error.state; }
      try {
        check(!returned && state === 18, `missing-historical-${name}: expected18, received${state ?? "successful-read"}`);
        check(requests.some(([kind, epoch]) => kind === name && epoch === 1), `missing-historical-${name} was not consulted`);
        check(same(await storedPair(), rotationPair), `missing-historical-${name} changed stored pair`); keyRefusals++;
      } finally { map.set(1, saved); }
      repo.close(); repo = await F.openFrameRepository(args); basis = await repo.load(); unchangedTruth(basis);
      check(map.get(1) === saved && same({ active: basis.active, previous: basis.previous }, rotationPair), `same-key ${name} recovery changed pair`); keyRestorations++;
    }
    // The prepared body's epoch is not the reused body's epoch on a control-only update.
    const controlCapability = await repo.prepare(basis, basis.body, { bodyKeyEpoch: 1, frameKeyEpoch: 3 }); let preparedEpoch;
    const control = await repo.commitPrepared(basis, controlCapability, context => {
      preparedEpoch = context.preparedBody.keyEpoch;
      return { kind: "control", state: 18, code: "SYNTHETIC_KEY_CONTROL", frameFields: F.frame({ kind: 2, U: batch.count }) };
    });
    check(control.kind === "control" && control.durable === true && preparedEpoch === 1, "control did not stage distinct body epoch");
    const controlPair = await storedPair();
    check(controlPair.active.frameKeyEpoch === 3 && controlPair.active.body.keyEpoch === 2 && same(controlPair.active.body, rotationPair.active.body) && same(controlPair.previous, rotationPair.active), "control did not retain exact body with independent frame epoch");
    requests.length = 0; repo.close(); repo = await F.openFrameRepository(args); basis = await repo.load(); unchangedTruth(basis);
    check(same({ active: basis.active, previous: basis.previous }, controlPair) && requests.some(([kind, epoch]) => kind === "body" && epoch === 2) && requests.some(([kind, epoch]) => kind === "frame" && epoch === 3) && requests.some(([kind, epoch]) => kind === "frame" && epoch === 2), "control reopen did not use actual retained epochs");
    check(!requests.some(([_kind, epoch]) => epoch === 1), "control reopen consulted discarded/staged epoch");
    return { aborts: cut.aborts, requestSuccessBeforeAbort: cut.requestSucceeded, keyRefusals, keyRestorations, independentEpochControl: true, t2Ops: batch.count, unproven: basis.unproven };
  } finally { cut.armed = false; repo.close(); }
};
try {
  browser = await chromium.launch({ executablePath: process.env.W6_BROWSER_BIN, headless: true }); const context = await browser.newContext();
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort()); const page = await context.newPage(); await page.goto(origin);
  const inputs = { vectors, generation: initial(), lease: O.lease("dev-A"), auth: O.AUTH_KEY };
  const result = await page.evaluate(runFrameContract, inputs);
  assert.equal(result.vectors, 26); assert.equal(result.rejected, 10); assert(result.batch > 1); assert.equal(result.unproven, true);
  assert.equal(result.previousRefusals, 2);
  console.log(`W6 FRAME-BROWSER PASS — 26 RFC8452 vectors, fixed frame/AAD and ten refusal controls; actual T2 multi-op final sample, IndexedDB reopen and body-preserving control; Chromium ${browser.version()}`);
  console.log("W6 FRAME-PREVIOUS PASS — altered retained predecessor and coherent older substitution refuse18 on actual IndexedDB; complete pair restored");
  const original = readFileSync(join(here, "frame-repository.mjs")), source = original.toString("utf8"), needle = "!sameBytes(active.previousRecordDigest, expected) || ";
  assert.equal(source.split(needle).length, 2);
  const scratch = mkdtempSync(join(here, ".tmp/frame-browser-mutant-"));
  assert(resolve(scratch).startsWith(resolve(here, ".tmp") + sep));
  let mutantContext;
  try {
    for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(scratch, file));
    writeFileSync(join(scratch, "frame-repository.mjs"), source.replace(needle, ""));
    writeFileSync(join(scratch, "entry.mjs"), `export * from ${JSON.stringify(join(here, "test/frame-browser-entry.mjs").replaceAll("\\", "/"))};\nexport { openFrameRepository } from "./frame-repository.mjs";\n`);
    const mutant = await buildBrowser({ outfile: join(scratch, "mutant.js"), entryPoints: [join(scratch, "entry.mjs")] }); servedBundles.set("/mutant-frame.js", mutant.outfile);
    mutantContext = await browser.newContext(); await mutantContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const mutantPage = await mutantContext.newPage(); await mutantPage.goto(origin);
    await assert.rejects(mutantPage.evaluate(runFrameContract, { ...inputs, bundle: "/mutant-frame.js" }), /FRAME-PREVIOUS ASSERT coherent-older: expected18, receivedsuccessful-read/);
    console.log("W6 FRAME-PREVIOUS FAIL — omitted reader predecessor recompute accepts coherent older substitution in actual browser (disposable mutant)");
  } finally {
    await mutantContext?.close(); servedBundles.delete("/mutant-frame.js");
    writeFileSync(join(scratch, "frame-repository.mjs"), original); assert.deepEqual(readFileSync(join(scratch, "frame-repository.mjs")), original); assert.deepEqual(readFileSync(join(here, "frame-repository.mjs")), original);
    console.log(`W6 FRAME-PREVIOUS RESTORED — frame-repository.mjs sha256 ${createHash("sha256").update(original).digest("hex")}`);
    rmSync(scratch, { recursive: true, force: true });
  }
  const keyContext = await browser.newContext();
  let keyResult;
  try {
    await keyContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const keyPage = await keyContext.newPage(); await keyPage.goto(origin); keyResult = await keyPage.evaluate(runFrameKeyContract, inputs);
    assert.deepEqual(keyResult, { aborts: 1, requestSuccessBeforeAbort: true, keyRefusals: 2, keyRestorations: 2, independentEpochControl: true, t2Ops: result.batch, unproven: true });
    console.log("W6 FRAME-KEY-BROWSER PASS — actual IndexedDB rotation abort after request success; epoch2 complete/reopen; two historical-key refusals and same-key recoveries; exact T2 ops/outbox and retained pairs; independent body/frame epochs; unproven remains true");
  } finally { await keyContext.close(); }
  const keyNeedle = "else await unseal(previous); // Own stored parent digest is authenticated; no third generation is required.";
  assert.equal(source.split(keyNeedle).length, 2);
  const keyScratch = mkdtempSync(join(here, ".tmp/frame-key-browser-mutant-"));
  assert(resolve(keyScratch).startsWith(resolve(here, ".tmp") + sep));
  let keyMutantContext, keyRestoredContext;
  try {
    for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(keyScratch, file));
    writeFileSync(join(keyScratch, "frame-repository.mjs"), source.replace(keyNeedle, "else { /* disposable missing predecessor authentication */ }"));
    writeFileSync(join(keyScratch, "entry.mjs"), `export * from ${JSON.stringify(join(here, "test/frame-browser-entry.mjs").replaceAll("\\", "/"))};\nexport { openFrameRepository } from "./frame-repository.mjs";\n`);
    const altered = await buildBrowser({ outfile: join(keyScratch, "mutant.js"), entryPoints: [join(keyScratch, "entry.mjs")] }); servedBundles.set("/mutant-key-frame.js", altered.outfile);
    keyMutantContext = await browser.newContext(); await keyMutantContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const keyMutantPage = await keyMutantContext.newPage(); await keyMutantPage.goto(origin);
    await assert.rejects(keyMutantPage.evaluate(runFrameKeyContract, { ...inputs, bundle: "/mutant-key-frame.js" }), /FRAME-KEY ASSERT missing-historical-body: expected18, receivedsuccessful-read/);
    console.log("W6 FRAME-KEY-BROWSER FAIL — omitted previous-record unsealing returns a decoded snapshot with missing historical body key in actual browser (disposable mutant)");
    writeFileSync(join(keyScratch, "frame-repository.mjs"), original); assert.deepEqual(readFileSync(join(keyScratch, "frame-repository.mjs")), original); assert.deepEqual(readFileSync(join(here, "frame-repository.mjs")), original);
    const restored = await buildBrowser({ outfile: join(keyScratch, "restored.js"), entryPoints: [join(keyScratch, "entry.mjs")] }); servedBundles.set("/restored-key-frame.js", restored.outfile);
    keyRestoredContext = await browser.newContext(); await keyRestoredContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const keyRestoredPage = await keyRestoredContext.newPage(); await keyRestoredPage.goto(origin);
    assert.deepEqual(await keyRestoredPage.evaluate(runFrameKeyContract, { ...inputs, bundle: "/restored-key-frame.js" }), keyResult);
    console.log(`W6 FRAME-KEY-BROWSER RESTORED PASS — full key contract rerun; frame-repository.mjs sha256 ${createHash("sha256").update(original).digest("hex")}`);
  } finally {
    await keyMutantContext?.close(); await keyRestoredContext?.close(); servedBundles.delete("/mutant-key-frame.js"); servedBundles.delete("/restored-key-frame.js");
    writeFileSync(join(keyScratch, "frame-repository.mjs"), original); assert.deepEqual(readFileSync(join(keyScratch, "frame-repository.mjs")), original); assert.deepEqual(readFileSync(join(here, "frame-repository.mjs")), original);
    assert(resolve(keyScratch).startsWith(resolve(here, ".tmp") + sep)); rmSync(keyScratch, { recursive: true, force: true });
  }
  const migrationContext = await browser.newContext(); let migrationResult;
  try {
    await migrationContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const migrationPage = await migrationContext.newPage(); await migrationPage.goto(origin);
    migrationResult = await migrationPage.evaluate(runFrameMigrationContract, inputs);
    assert.deepEqual(migrationResult, { upgradeAborts: 1, conversionAborts: 1, requestSuccessBeforeAbort: true, consumedCapability: true,
      versionBefore: 1, versionAfter: 2, missingActiveRefusals: 2, exactPrevious: true, t2Ops: result.batch, unproven: true });
    console.log("W6 FRAME-MIGRATION-BROWSER PASS — real versionchange abort preserves version1/whole pair; database2 before conversion refuses18; conversion abort after request success preserves both legacy records and consumes capability; fresh retry/reopen preserves exact T2 ops/outbox, unknown/history and legacy predecessor; missing active refuses without fallback/reseed; unproven remains true");
  } finally { await migrationContext.close(); }
  const migrationNeedle = 'if (active !== undefined) store.put(active, "previous"); store.put(record, "active");';
  assert.equal(source.split(migrationNeedle).length, 2);
  const migrationScratch = mkdtempSync(join(here, ".tmp/frame-migration-browser-mutant-"));
  assert(resolve(migrationScratch).startsWith(resolve(here, ".tmp") + sep));
  let migrationMutantContext, migrationRestoredContext;
  try {
    for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(migrationScratch, file));
    writeFileSync(join(migrationScratch, "frame-repository.mjs"), source.replace(migrationNeedle, 'if (active !== undefined && !p.compatibility) store.put(active, "previous"); store.put(record, "active");'));
    writeFileSync(join(migrationScratch, "entry.mjs"), `export * from ${JSON.stringify(join(here, "test/frame-browser-entry.mjs").replaceAll("\\", "/"))};\nexport { openFrameRepository } from "./frame-repository.mjs";\n`);
    const altered = await buildBrowser({ outfile: join(migrationScratch, "mutant.js"), entryPoints: [join(migrationScratch, "entry.mjs")] }); servedBundles.set("/mutant-migration-frame.js", altered.outfile);
    migrationMutantContext = await browser.newContext(); await migrationMutantContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const mutantPage = await migrationMutantContext.newPage(); await mutantPage.goto(origin);
    await assert.rejects(mutantPage.evaluate(runFrameMigrationContract, { ...inputs, bundle: "/mutant-migration-frame.js" }), /FRAME-MIGRATION ASSERT conversion did not publish exact legacy active as previous/);
    console.log("W6 FRAME-MIGRATION-BROWSER FAIL — omitted legacy predecessor publish fails exact stored-pair assertion before unseal in actual browser (disposable mutant)");
    writeFileSync(join(migrationScratch, "frame-repository.mjs"), original); assert.deepEqual(readFileSync(join(migrationScratch, "frame-repository.mjs")), original); assert.deepEqual(readFileSync(join(here, "frame-repository.mjs")), original);
    const restored = await buildBrowser({ outfile: join(migrationScratch, "restored.js"), entryPoints: [join(migrationScratch, "entry.mjs")] }); servedBundles.set("/restored-migration-frame.js", restored.outfile);
    migrationRestoredContext = await browser.newContext(); await migrationRestoredContext.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const restoredPage = await migrationRestoredContext.newPage(); await restoredPage.goto(origin);
    assert.deepEqual(await restoredPage.evaluate(runFrameMigrationContract, { ...inputs, bundle: "/restored-migration-frame.js" }), migrationResult);
    console.log(`W6 FRAME-MIGRATION-BROWSER RESTORED PASS — full migration matrix rerun; frame-repository.mjs sha256 ${createHash("sha256").update(original).digest("hex")}`);
  } finally {
    await migrationMutantContext?.close(); await migrationRestoredContext?.close(); servedBundles.delete("/mutant-migration-frame.js"); servedBundles.delete("/restored-migration-frame.js");
    writeFileSync(join(migrationScratch, "frame-repository.mjs"), original); assert.deepEqual(readFileSync(join(migrationScratch, "frame-repository.mjs")), original); assert.deepEqual(readFileSync(join(here, "frame-repository.mjs")), original);
    assert(resolve(migrationScratch).startsWith(resolve(here, ".tmp") + sep)); rmSync(migrationScratch, { recursive: true, force: true });
  }
  const nonceResult = await runFrameNonceBrowser({ browser, origin, inputs });
  assert.deepEqual(nonceResult, { pages: 2, realms: 3, frameAttempts: 6, frameNonceDraws: 6, bodyIvDraws: 6, staleCasRefusals: 1,
    consumedCapabilityRefusals: 2, requestSuccessAborts: 1, freshRealmRetries: 1, repositoryReopens: 1, missingRngRefusals: 1,
    finalRevision: 4, finalU: 9, unproven: true });
  console.log("W6 FRAME-NONCE-BROWSER PASS — two real pages and three realms; six observed frame/body draw pairs across CAS loss, fresh-realm retry, request-success abort and reopen; consumed capabilities cannot write; absent RNG refuses3 without effect; exact T2 history/outbox/U; synthetic draws are not a uniqueness or security-budget proof");
  const upgradeKeys = await page.evaluate(async generation => {
    const F = await import("/frame.js"), key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    let reached, changed; const state = { reached: new Promise(r => { reached = r; }), changed: new Promise(r => { changed = r; }), hold: true, armed: false };
    const wrapped = { open(...args) { const req = indexedDB.open(...args); req.addEventListener("success", () => {
      const db = req.result, transaction = db.transaction.bind(db); db.addEventListener("versionchange", () => changed());
      db.transaction = (...values) => { const tx = transaction(...values); if (!state.armed || values[1] !== "readwrite") return tx;
        const store = tx.objectStore("generations"), put = store.put.bind(store), originalObjectStore = tx.objectStore.bind(tx);
        store.put = (value, name) => { const written = put(value, name); if (name === "active") reached(); return written; };
        tx.objectStore = name => name === "generations" ? store : originalObjectStore(name);
        const keepAlive = () => { if (state.hold) { const read = store.get("active"); read.onsuccess = keepAlive; } }; keepAlive(); return tx;
      };
    }); return req; } };
    const args = { indexedDB: wrapped, databaseName: "synthetic-old-tab", namespace: "synthetic-old-tab", keyProvider: () => key, authorizeEnrollment: () => true };
    const repo = await F.openRepository(args); await repo.initialize(generation, "synthetic"); const basis = await repo.load(), next = structuredClone(basis.generation); next.metadata.queuedLegacyAcknowledgment = "synthetic-preserved";
    state.armed = true; state.pending = repo.commit(basis, next, () => null); await state.reached;
    window.oldTabTest = { F, repo, basis, next, state }; return [...new Uint8Array(await crypto.subtle.exportKey("raw", key))];
  }, initial());
  const newTab = await context.newPage(); await newTab.goto(origin);
  await newTab.evaluate(async raw => {
    const F = await import("/frame.js"), key = await crypto.subtle.importKey("raw", new Uint8Array(raw), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]), frameKey = crypto.getRandomValues(new Uint8Array(32));
    const args = { databaseName: "synthetic-old-tab", namespace: "synthetic-old-tab", bodyKeyProvider: () => key, legacyKeyProvider: () => key, frameKeyProvider: () => ({ keyEpoch: 1, keyBytes: frameKey, revisionStart: 1 }) };
    window.newTabTest = { F, args, opening: F.openFrameRepository(args).then(repo => ({ repo }), error => ({ error: error.state })) };
  }, upgradeKeys);
  await page.evaluate(async () => { await oldTabTest.state.changed; oldTabTest.state.hold = false; await oldTabTest.state.pending; });
  const upgraded = await newTab.evaluate(async () => {
    const { F, args } = newTabTest, opened = await newTabTest.opening;
    if (opened.error !== undefined && opened.error !== 18) throw new Error("upgrade refusal was untyped");
    const repo = opened.repo || await F.openFrameRepository(args), before = await repo.load({ compatibility: true });
    if (before.legacy.metadata.queuedLegacyAcknowledgment !== "synthetic-preserved") throw new Error("pre-upgrade committed writer was lost");
    const body = { format: 2, collections: before.legacy.collections, retainedMetadata: before.legacy.metadata, proofs: [] };
    await repo.commitPrepared(before, await repo.prepare(before, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, compatibility: true }), () => ({ kind: "publish", frameFields: F.frame({ kind: 3 }) }));
    const after = await repo.load(); newTabTest.repo = repo; newTabTest.after = after; return after.revision;
  });
  const oldWrite = await page.evaluate(async () => { try { await oldTabTest.repo.commit(oldTabTest.basis, oldTabTest.next, () => null); return "unexpected-success"; } catch (error) { return error.state; } });
  assert.equal(oldWrite, 3); assert.equal(await newTab.evaluate(async () => { const next = await newTabTest.repo.load(); newTabTest.repo.close(); return next.revision; }), upgraded);
  await newTab.close();
  console.log("W6 FRAME-OLD-TAB PASS — queued v1 write commits before version2 upgrade; complete conversion retains it; old tab cannot write after conversion");
  console.log("W6 FRAME semantics / CLOCK / custody / phone BLOCKED — mechanical synthetic evidence only");
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
