import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync, cpSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { buildBrowser } from "../build-browser.mjs";
import { initial, config, O } from "./support.mjs";
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
