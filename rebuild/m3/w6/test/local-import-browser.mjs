// local-import-browser.mjs — C2b in a REAL browser, on REAL IndexedDB and REAL
// WebCrypto.
//
// What only a browser can show: that 600 000 PBKDF2-SHA-256 rounds and an
// AES-GCM decrypt with an APPENDED tag behave in crypto.subtle exactly as they
// do in Node's createDecipheriv — the whole seal-compat claim rests on that —
// and that the import survives the whole browser context going away. Node's
// webcrypto is the same spec but not the same implementation, and Joe's phone
// runs the browser one.
//
// NOTHING PRIVATE. The bundle is sealed HERE by the real port.cjs over the
// PUBLIC frozen preimage. Exit 2 = BLOCKED (no browser), never a silent pass.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildLocalBrowser } from "../local/build.mjs";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(root, "../../..");

let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 LOCAL-IMPORT-BROWSER BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 LOCAL-IMPORT-BROWSER BLOCKED — set W6_BROWSER_BIN to an installed Chromium/Edge executable");
  process.exit(2);
}

// One real bundle, sealed by the real CLI. --out must be outside every git
// working tree, so the OS temp folder is the only place it can go.
const FIXTURE = path.join(REPO, "rebuild/conform/fixtures/preimage-2026-08-15.json");
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "w6-c2b-browser-"));
const sealed = spawnSync(process.execPath,
  [path.join(REPO, "rebuild/m3/setup/port/port.cjs"), "--source", FIXTURE, "--out", outDir],
  { cwd: REPO, encoding: "utf8", timeout: 600000 });
if (sealed.status !== 0) {
  console.log(`W6 LOCAL-IMPORT-BROWSER FAIL — port.cjs did not seal (status ${sealed.status})`);
  fs.rmSync(outDir, { recursive: true, force: true });
  process.exit(1);
}
const names = fs.readdirSync(outDir);
const bundleBytes = fs.readFileSync(path.join(outDir, names.find(n => n.endsWith(".json"))));
const passphrase = fs.readFileSync(path.join(outDir, names.find(n => n.endsWith("-PASSPHRASE.txt"))), "utf8").trim();
const sourceBytes = fs.readFileSync(FIXTURE);
const SOURCE_SHA = createHash("sha256").update(sourceBytes).digest("hex");
const NAME = `port:${SOURCE_SHA.slice(0, 16)}`;

const scratch = path.join(root, ".tmp/local-import-browser");
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });
const bundleFile = path.join(scratch, "local.js");
const built = await buildLocalBrowser({ outfile: bundleFile });
const profile = fs.mkdtempSync(path.join(scratch, "profile-"));
const source = fs.readFileSync(bundleFile);

const server = http.createServer((request, response) => {
  if (request.url === "/local.js") {
    response.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
    response.end(source); return;
  }
  // The sealed bundle, served as bytes. On the phone Joe picks the file; here
  // fetch() is the nearest analogue that keeps the bytes out of a JS literal.
  if (request.url === "/bundle") {
    response.writeHead(200, { "Content-Type": "application/octet-stream", "Cache-Control": "no-store" });
    response.end(bundleBytes); return;
  }
  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" });
    response.end("<!doctype html><title>W6 local-era import</title><p>Local import test only</p>"); return;
  }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const SETUP = { namespace: "joe/phone-A", athleteId: "ath-1", deviceId: "dev-phone-A" };
let context = null, cases = 0;
const passed = () => { cases++; };
async function open(databaseName) {
  context = await chromium.launchPersistentContext(profile, { executablePath, headless: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(origin);
  await page.evaluate(async ({ setup, databaseName }) => {
    const module = await import("/local.js");
    window.W6 = module;
    // The passphrase and the bundle never go through a JS literal in the page
    // source: the bytes are fetched, and the words come in as an argument.
    window.bundleBytes = new Uint8Array(await (await fetch("/bundle")).arrayBuffer());
    const at = () => new Date().toISOString();
    window.client = await module.openLocalDurableClient({ ...setup, databaseName,
      clock: { now: at, today: () => at().slice(0, 10), tz: "+00:00", monotonicMs: () => performance.now() } });
  }, { setup: SETUP, databaseName });
  return page;
}
// sha256 computed IN THE PAGE, so byte-identity is asserted about the bytes the
// browser actually holds rather than about a copy that crossed the boundary.
// Installed once per context as window.sha256, because functions cannot cross
// the evaluate boundary and eval() would be at the mercy of a page CSP.
async function installHash(page) {
  await page.evaluate(() => {
    window.sha256 = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
      b => b.toString(16).padStart(2, "0")).join("");
  });
}

try {
  const DB_A = "earned-import-browser-a", DB_B = "earned-import-browser-b";
  let page = await open(DB_A);
  const version = context.browser().version();

  // 1. The seal opens in REAL crypto.subtle: 600k PBKDF2 rounds, AES-GCM with
  //    the tag appended, and the payload's own hashes recomputed in the page.
  await installHash(page);
  const opened = await page.evaluate(async passphrase => {
    const started = performance.now();
    const result = await W6.unsealBundle(window.bundleBytes, passphrase, { crypto });
    return { ms: Math.round(performance.now() - started), profile: result.payload.profile,
      schemaV: result.payload.engine.schemaV, verdict: result.payload.oracle.verdict,
      sourceSha: await window.sha256(result.sourceBytes), sourceLength: result.sourceBytes.length,
      migratedSha: await window.sha256(new TextEncoder().encode(result.migratedJson)),
      declaredMigratedSha: result.payload.migrated.sha256, stateV: result.payload.migrated.state.v };
  }, passphrase);
  assert.equal(opened.profile, "earned/local-import-bundle/v1");
  assert.equal(opened.verdict, "PASS");
  assert.equal(opened.sourceSha, SOURCE_SHA);
  assert.equal(opened.sourceLength, sourceBytes.length);
  assert.equal(opened.migratedSha, opened.declaredMigratedSha);
  assert.equal(opened.stateV, opened.schemaV); passed();

  // 2. Enroll and boot a genuinely first-run profile, then import.
  assert.deepEqual(await page.evaluate(() => client.status()), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  assert.equal((await page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
  assert.equal((await page.evaluate(() => client.boot())).ready, true);
  const imported = await page.evaluate(passphrase =>
    client.importBundle({ bundleBytes: window.bundleBytes, passphrase }), passphrase);
  assert.deepEqual(imported, { imported: true, code: "LOCAL_IMPORT_SEEDED", state: null,
    name: NAME, durableRevision: 2, opsAtImport: 0, rebaseRequired: false }); passed();

  // 3. The derived cache now holds Joe's real history, in real IndexedDB.
  const seeded = await page.evaluate(async () => {
    const booted = await client.boot();
    return { ready: booted.ready, ops: booted.ops, stale: booted.derivedStale, code: booted.derivedCode,
      rebase: booted.importRebaseRequired, v: booted.derived?.v, keys: Object.keys(booted.derived || {}).length,
      imports: booted.imports };
  });
  assert.equal(seeded.ready, true);
  assert.equal(seeded.ops, 0);
  assert.equal(seeded.stale, false);
  assert.equal(seeded.code, null);
  assert.equal(seeded.rebase, false);
  assert.equal(seeded.v, opened.schemaV);
  assert.ok(seeded.keys > 40, "the whole migrated state, not a stub");
  assert.equal(seeded.imports.length, 1);
  assert.equal(seeded.imports[0].sourceSha256, SOURCE_SHA); passed();

  // 4. A wrong passphrase writes nothing, and a repeat is a named no-op.
  const guards = await page.evaluate(async () => ({
    wrong: await client.importBundle({ bundleBytes: window.bundleBytes, passphrase: "these-are-not-the-words" }),
    revisionAfterWrong: (await client.boot()).revision,
  }));
  assert.equal(guards.wrong.code, "BUNDLE_AUTH_FAILED");
  assert.equal(guards.revisionAfterWrong, 2);
  const repeat = await page.evaluate(passphrase =>
    client.importBundle({ bundleBytes: window.bundleBytes, passphrase }), passphrase);
  assert.equal(repeat.code, "LOCAL_IMPORT_ALREADY_PRESENT");
  assert.equal(repeat.durableRevision, 2); passed();

  // 5. THE WHOLE BROWSER CONTEXT GOES AWAY — process, page, every in-memory
  //    handle — and a NEW one opens on the same profile directory. The import,
  //    the seeded cache and the custody original are all still there, and the
  //    original's bytes still hash to the file Joe's PC read.
  await context.close(); context = null;
  page = await open(DB_A);
  await installHash(page);
  const reopened = await page.evaluate(async name => {
    const booted = await client.boot();
    const original = await client.importOriginal(name);
    return { ready: booted.ready, revision: booted.revision, ops: booted.ops, v: booted.derived?.v,
      stale: booted.derivedStale, imports: booted.imports.length,
      sourceSha: await window.sha256(original.sourceBytes), sourceLength: original.sourceBytes.length,
      candidateSha: await window.sha256(original.candidateBytes),
      verdict: original.context.oracle.verdict, schemaV: original.context.engine.schemaV,
      checkpointRevision: original.checkpointRevision };
  }, NAME);
  assert.equal(reopened.ready, true);
  assert.equal(reopened.revision, 2);
  assert.equal(reopened.ops, 0);
  assert.equal(reopened.v, opened.schemaV);
  assert.equal(reopened.stale, false);
  assert.equal(reopened.imports, 1);
  assert.equal(reopened.sourceSha, SOURCE_SHA);
  assert.equal(reopened.sourceLength, sourceBytes.length);
  assert.equal(reopened.candidateSha, opened.declaredMigratedSha);
  assert.equal(reopened.verdict, "PASS");
  assert.equal(reopened.schemaV, opened.schemaV);
  assert.equal(reopened.checkpointRevision, 1); passed();

  // 6. A save after the import, in the reopened context.
  const saved = await page.evaluate(() => client.execute("weighIn", { lb: 170.6 }));
  assert.equal(saved.acknowledged, true);
  assert.equal(saved.durableRevision, 3);
  assert.equal(saved.op_id, "op-dev-phone-A-1"); passed();

  // 7. FRESH START THEN PORT, in a real browser and on a second database: two
  //    weigh-ins logged first, then the import lands underneath them. The cache
  //    keeps what the phone logged and the import is reported as outstanding.
  await context.close(); context = null;
  page = await open(DB_B);
  const under = await page.evaluate(async passphrase => {
    await client.enroll({ profile: "host-clean-init", phone: true });
    await client.boot();
    await client.execute("weighIn", { lb: 171.1 });
    await client.execute("weighIn", { lb: 171.2 });
    const imported = await client.importBundle({ bundleBytes: window.bundleBytes, passphrase });
    const booted = await client.boot();
    return { imported, ops: booted.ops, derived: booted.derived, stale: booted.derivedStale,
      code: booted.derivedCode, rebase: booted.importRebaseRequired,
      basis: booted.imports[0].opsBasisAtImport,
      reads: booted.view.layer1.reads.map(read => read.lb).sort() };
  }, passphrase);
  assert.equal(under.imported.imported, true);
  assert.equal(under.imported.code, "LOCAL_IMPORT_REBASE_REQUIRED");
  assert.equal(under.imported.opsAtImport, 2);
  assert.equal(under.imported.rebaseRequired, true);
  assert.equal(under.ops, 2);
  assert.deepEqual(under.derived, { profile: "host-clean-init", phone: true },
    "the phone's own cache, untouched by the import");
  assert.equal(under.stale, true);
  assert.equal(under.code, "IMPORT_REBASE_REQUIRED");
  assert.equal(under.rebase, true);
  assert.deepEqual(under.basis, { opCount: 2, lastOpId: "op-dev-phone-A-2" });
  assert.deepEqual(under.reads, [171.1, 171.2]); passed();

  console.log(`W6 LOCAL-IMPORT-BROWSER PASS — ${cases}/7 real IndexedDB + real WebCrypto cases; ${version}; ` +
    `port.cjs seal opened by crypto.subtle in ${opened.ms} ms (PBKDF2 600000), enroll + import + seeded cache, ` +
    `wrong passphrase and repeat write nothing, WHOLE-CONTEXT REOPEN with a byte-identical custody original, ` +
    `save after import, fresh-start-then-port leaves derived alone; ${built.inventory.length} pinned bundle inputs`);
  console.log("W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)");
} catch (error) {
  console.log("W6 LOCAL-IMPORT-BROWSER FAIL — " + (error?.message || error?.name || "Error"));
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(outDir, { recursive: true, force: true });
}
