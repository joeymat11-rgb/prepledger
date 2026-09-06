import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { buildBrowser } from "../build-browser.mjs";
import { initial, config, O } from "./support.mjs";
const require = createRequire(import.meta.url), here = resolve(dirname(fileURLToPath(import.meta.url)), ".."), { chromium } = require("playwright-core");
if (!process.env.W6_BROWSER_BIN || !existsSync(process.env.W6_BROWSER_BIN)) { console.log("W6 FRAME-BROWSER BLOCKED — installed browser required"); process.exit(2); }
const built = await buildBrowser({ outfile: join(here, ".tmp/browser/frame.js"), entryPoints: [join(here, "test/frame-browser-entry.mjs")] });
const vectors = JSON.parse(readFileSync(new URL("fixtures/rfc8452-aes256.json", import.meta.url))).vectors;
const server = createServer((request, response) => { response.setHeader("Cache-Control", "no-store"); if (request.url === "/frame.js") { response.setHeader("Content-Type", "text/javascript"); response.end(readFileSync(built.outfile)); } else { response.setHeader("Content-Type", "text/html"); response.end("<!doctype html><title>W6 synthetic frame test</title>"); } });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve)); const origin = `http://127.0.0.1:${server.address().port}`; let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.W6_BROWSER_BIN, headless: true }); const context = await browser.newContext();
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort()); const page = await context.newPage(); await page.goto(origin);
  const result = await page.evaluate(async ({ vectors, generation, lease, auth }) => {
    const F = await import("/frame.js"), hex = x => Uint8Array.from(x.match(/../g) || [], n => parseInt(n, 16)), toHex = x => [...x].map(n => n.toString(16).padStart(2, "0")).join("");
    for (const v of vectors) {
      if (toHex(F.gcmsiv(hex(v.key), hex(v.nonce), hex(v.aad)).encrypt(hex(v.plaintext))) !== v.ciphertext) throw new Error("RFC encrypt mismatch");
      if (toHex(F.gcmsiv(hex(v.key), hex(v.nonce), hex(v.aad)).decrypt(hex(v.ciphertext))) !== v.plaintext) throw new Error("RFC decrypt mismatch");
    }
    const f = F.frame(), aad = F.frameAad(F.record({ namespace: "x".repeat(768) })), key = crypto.getRandomValues(new Uint8Array(32)), attempt = F.createFrameAttempt(key), nonce = attempt.nonce(), sealed = attempt.encrypt(aad, F.encodeFrame(f));
    if (JSON.stringify(F.decodeFrame(F.decryptFrame(key, nonce, aad, sealed))) !== JSON.stringify(f) || aad.length !== 922) throw new Error("frame roundtrip mismatch");
    let rejected = 0; try { F.parseStrictJson('{"x":1,"\\u0078":2}'); } catch { rejected++; }
    for (const size of [16, 24]) try { F.createFrameAttempt(new Uint8Array(size)); } catch { rejected++; }
    for (const size of [11, 13, 16]) try { F.decryptFrame(key, new Uint8Array(size), aad, sealed); } catch { rejected++; }
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
    reopened.close(); return { vectors: vectors.length, rejected, batch: batch.count, unproven: after.unproven };
  }, { vectors, generation: initial(), lease: O.lease("dev-A"), auth: O.AUTH_KEY });
  assert.equal(result.vectors, 26); assert.equal(result.rejected, 6); assert(result.batch > 1); assert.equal(result.unproven, true);
  console.log(`W6 FRAME-BROWSER PASS — 26 RFC8452 vectors, fixed frame/AAD and six refusal controls; actual T2 multi-op final sample, IndexedDB reopen and body-preserving control; Chromium ${browser.version()}`);
  console.log("W6 FRAME semantics / CLOCK / custody / phone BLOCKED — mechanical synthetic evidence only");
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
