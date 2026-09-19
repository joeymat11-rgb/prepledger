"use strict";

/* A1 — the shipped package: three assets, a pinned approved design, a bundle that
   carries the real engine and the real client and nothing forbidden, and a local server
   that cannot reach the repository.

   This file needs rebuild/m3/w6's own dependencies (the browser build and the SHA-256
   boundary the phone host already uses). It is NOT part of the root-lockfile CI job for
   the same reason the W6 browser build is not; it runs in the A1/A2/A3/A4 today step of
   .github/workflows/rebuild.yml, which names it by exact path, and on the PC. (R1 N4:
   this header used to end "it is run on the PC and reported there", which stopped being
   true when the today step took this file, and S9 re-pins this file with a real post, so
   the seal would have carried the sentence.) */

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const fss = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test, before, after } = require("node:test");

let build, result, serve, server, port;

before(async () => {
  build = await import(pathToFileURL(path.resolve(__dirname, "../build.mjs")).href);
  result = await build.buildToday();
  serve = await import(pathToFileURL(path.resolve(__dirname, "../serve.mjs")).href);
  server = await serve.startServer({ port: 0 });
  port = server.address().port;
});
after(async () => { if (server) await new Promise((res, rej) => server.close((e) => (e ? rej(e) : res()))); });

function request(target, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: target, method }, (response) => {
      const chunks = [];
      response.on("data", (c) => chunks.push(c));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("the built package is exactly the three reviewed assets", async () => {
  assert.deepEqual((await fs.readdir(build.DIST)).sort(), ["app.js", "index.html", "styles.css"]);
  assert.deepEqual(result.assets, ["index.html", "styles.css", "app.js"]);
});

test("the approved design is pinned by sha256 and a changed byte fails the build", async () => {
  const approved = await build.readApproved();
  assert.equal(approved.length, 2);
  assert.deepEqual(result.approved, build.APPROVED.map((a) => a.sha256));
  const html = await fs.readFile(path.join(build.DIST, "index.html"), "utf8");
  for (const id of ["t-today", "t-weigh", "t-why", "t-nutrition", "t-recovery", "t-coach", "t-workout"]) {
    assert(html.includes(`<template id="${id}">`), id);
  }
});

test("the bundle carries the real engine and the real client and nothing forbidden", () => {
  const inputs = result.inputs;
  for (const required of ["rebuild/engine/today.cjs", "rebuild/engine/energy.cjs", "rebuild/engine/writers.cjs",
    "rebuild/client/index.cjs", "rebuild/client/ops.cjs", "rebuild/client/store.cjs"]) {
    assert(inputs.includes(required), required);
  }
  /* P3-IMPORT-UI-2 (DECISIONS:475 (1) and (4)) - THIRTEEN BECAME FIFTEEN, AND
     THE RULE THAT ADMITTED THE TWO IS STATED HERE RATHER THAN THE COUNT BEING
     QUIETLY RAISED. The page is still a reader of an already migrated state on
     every screen but ONE: the Import route, where it must reproduce the PC's
     walk to prove the bundle it is about to adopt, and that walk
     (rebuild/m4/import/engine-provider.cjs) requires migrate.cjs and merge.cjs
     by literal path. They are in the bundle and are reachable ONLY through
     build.mjs IMPORT_ENTRY; the cell below runs the law that says so. seed.cjs
     and index.cjs keep their outright ban, and so does everything after them. */
  assert.equal(inputs.filter((p) => p.startsWith("rebuild/engine/")).length, 15);
  assert.equal(inputs.filter((p) => p.startsWith("rebuild/client/")).length, 12);
  for (const admitted of ["rebuild/engine/migrate.cjs", "rebuild/engine/merge.cjs"])
    assert(inputs.includes(admitted), admitted + " left the page: the Import route cannot reproduce the walk");
  for (const forbidden of ["rebuild/engine/seed.cjs", "rebuild/engine/index.cjs"])
    assert(!inputs.includes(forbidden), forbidden);
  assert(!inputs.some((p) => /^rebuild\/engine\/test\//.test(p)));
  assert(!inputs.some((p) => /^rebuild\/authority\//.test(p) && p !== "rebuild/authority/canonical.cjs"));
  assert(!inputs.some((p) => /^ledger\//.test(p) || p === "src/history.js"));
  // Third-party code is limited to the SHA-256 primitive the accepted W6 boundary
  // already substitutes for node:crypto.
  for (const p of inputs.filter((p) => /node_modules/.test(p))) assert.match(p, /@noble[+/]hashes/);
  assert.throws(() => build.assertBundleInputs([{ path: "rebuild/engine/seed.cjs" }]), /BUNDLE-INPUTS FAIL/);
  assert.throws(() => build.assertBundleInputs(result.inputs.map((p) => ({ path: p })).concat([{ path: "node_modules/left-pad/index.js" }])), /unapproved dependency/);
});

/* H18 (M2-S9-UI-PINS). rebuild/lanes/b/S9-RELEASE-SPEC.md A.4 law 2, B.8 row 2,
   E fact 16, and the CONDITION on the second path of the closed list A.6.

   THE HOLE, MEASURED BEFORE THIS CELL WAS WRITTEN. build.mjs's REQUIRED_INPUTS
   (build.mjs:98-:201) holds 48 path literals: 26 under rebuild/m3/w7-preview/today/,
   3 rebuild/engine/, 3 rebuild/client/, 1 rebuild/coach/, 8 rebuild/m4/ and 7 other
   rebuild/m3/. Six of the 22 that are not under today/ are named by literal at :59-:60
   above, and :72-:73 count the engine at 15 and the client at 12. NOTHING in this file,
   and nothing anywhere under rebuild/m3/w7-preview/{today,import,measure}/test/,
   asserted a single one of the 26. The cells IMPORT those modules directly
   (view.test.mjs:17, copy.test.mjs:36, gym.test.mjs:32, checkin.test.mjs:18), which
   proves the module exists and behaves; it does not prove the BUILD still refuses a
   bundle that lost it. MEASURED ON THE PC: with
   rebuild/m3/w7-preview/today/reading-host.mjs deleted from REQUIRED_INPUTS, all 24
   cells in the three test directories under rebuild/m3/w7-preview/ report 728 tests,
   726 pass, 2 fail - the SAME two pre-existing failures as on the untouched tree, byte
   for byte (they are the two the carried lanes leave until packages/S9.json declares
   their posts, and neither reads REQUIRED_INPUTS). That is the
   failure build.mjs:112-:115 was written against ("a page whose readings can vanish on a
   hard kill"), and after S9 releases build.mjs a lane C branch can make it in the same
   pull request as a stylesheet swap.

   HOW IT ASKS, AND THE ONE PLACE IT DIFFERS FROM B.8's WORDING, said out loud rather
   than quietly substituted. B.8 asks for the assertion to be made "against
   build.REQUIRED_INPUTS". THAT CONSTANT IS NOT EXPORTED: build.mjs:98 is a module-local
   const, and :44 exports APPROVED, readApproved, readFonts, assertDesignBinding and
   composeStyles and nothing else. This ticket does not edit build.mjs, so the cell asks
   the LAW instead of the list: for each of the 26 it hands assertBundleInputs the real
   built bundle MINUS that one path and requires the refusal build.mjs:438 gives, naming
   that path. An entry deleted from REQUIRED_INPUTS stops being refused and this cell
   goes red naming it, which is what the hunk exists for. It is strictly stronger than
   reading the constant, because it asserts the BUILD'S REFUSAL rather than the list's
   contents - the same shape that keeps law 7 alive over an unsealed implementation
   (copy.test.mjs:395 and :405).

   AND THE COMPLETENESS HALF IS HAD HERE TOO, WITH NO build.mjs EDIT AT ALL (R1
   BLOCKING-D, which retracts an earlier author's finding F1). The loop below asks the
   LAW, so it goes red when an entry LEAVES REQUIRED_INPUTS; it cannot see a 27th entry
   ADDED. That second half does not need the constant exported: this file already reads
   repository files, so H18b below reads build.mjs AS SOURCE TEXT and takes the frozen
   array literal's own path lines - the same extraction that MEASURED 26 of 48, moved
   inside the sealed cell. The two halves are complementary and neither replaces the
   other: one asserts the build's refusal, the other asserts that this seal's literal is
   still the whole today/ half. No product file is touched by either. */
const TODAY_REQUIRED_INPUTS = [
  "rebuild/m3/w7-preview/today/today-model.cjs",
  "rebuild/m3/w7-preview/today/today-app.cjs",
  "rebuild/m3/w7-preview/today/gym-host.mjs",
  "rebuild/m3/w7-preview/today/gym-model.mjs",
  "rebuild/m3/w7-preview/today/gym-app.mjs",
  "rebuild/m3/w7-preview/today/reading-host.mjs",
  "rebuild/m3/w7-preview/today/checkin-host.mjs",
  "rebuild/m3/w7-preview/today/checkin-commands.cjs",
  "rebuild/m3/w7-preview/today/checkin-model.mjs",
  "rebuild/m3/w7-preview/today/checkin-app.mjs",
  "rebuild/m3/w7-preview/today/setup-host.mjs",
  "rebuild/m3/w7-preview/today/setup-commands.mjs",
  "rebuild/m3/w7-preview/today/setup-model.mjs",
  "rebuild/m3/w7-preview/today/setup-app.mjs",
  "rebuild/m3/w7-preview/today/split-kinds.mjs",
  "rebuild/m3/w7-preview/today/exercise-catalogue.mjs",
  "rebuild/m3/w7-preview/today/starter-week.mjs",
  "rebuild/m3/w7-preview/today/problem-report.cjs",
  "rebuild/m3/w7-preview/today/food-commands.cjs",
  "rebuild/m3/w7-preview/today/food-model.cjs",
  "rebuild/m3/w7-preview/today/food-host.mjs",
  "rebuild/m3/w7-preview/today/machine-settings-host.mjs",
  "rebuild/m3/w7-preview/today/machine-settings-view.mjs",
  "rebuild/m3/w7-preview/today/sleep-commands.cjs",
  "rebuild/m3/w7-preview/today/sleep-model.cjs",
  "rebuild/m3/w7-preview/today/sleep-host.mjs",
];

test("H18 - the build still refuses a bundle that lost any of the 26 today/ required inputs", () => {
  assert.equal(TODAY_REQUIRED_INPUTS.length, 26,
    "the literal list is not the 26 today/ entries of REQUIRED_INPUTS that A.4 measured");
  assert.equal(new Set(TODAY_REQUIRED_INPUTS).size, 26, "the literal list repeats a path");
  /* the green control first, so the 26 rows below fail for the reason they name rather
     than because assertBundleInputs refuses everything it is handed. */
  assert.doesNotThrow(() => build.assertBundleInputs(result.inputs.map((p) => ({ path: p }))));
  for (const required of TODAY_REQUIRED_INPUTS) {
    assert(result.inputs.includes(required),
      required + " is not in the built bundle at all: result.inputs lost it");
    const without = result.inputs.filter((p) => p !== required).map((p) => ({ path: p }));
    assert.throws(() => build.assertBundleInputs(without),
      new RegExp("BUNDLE-INPUTS FAIL: missing required input " + required.replace(/\./g, "\\.")),
      required + " is no longer refused by build.mjs's REQUIRED_INPUTS. Either the entry "
      + "left that constant, or it was RENAMED there and this seal's literal list below "
      + "is the stale one. H18b says which (R1 N6)");
  }
});

/* H18b, THE COMPLETENESS HALF (R1 BLOCKING-D). H18 above asks the LAW and therefore
   cannot see a 27th today/ entry ADDED to build.mjs's REQUIRED_INPUTS: the added entry
   would simply be refused like the other 26 and every assertion would still pass. This
   cell reads build.mjs as SOURCE TEXT - no import of the constant, no export added to
   build.mjs, no product byte touched - and holds three counts: the block still exists,
   it still holds 48 distinct path literals, and its today/ half is still EXACTLY the 26
   this seal pins. MEASURED: with a real 27th today/ input added to REQUIRED_INPUTS the
   loop above stays green and this cell is the only red; with an entry deleted both go
   red. The line rule is the file's own shape - a path literal sits alone on its line -
   and the three prose strings inside the block span lines or carry no trailing comma,
   which is why the count is 48 and not the 51 quoted strings the block contains. */
const requiredInputsOfBuildSource = () => {
  const src = fss.readFileSync(path.resolve(__dirname, "../build.mjs"), "utf8");
  const block = /\nconst REQUIRED_INPUTS = Object\.freeze\(\[\n([\s\S]*?)\n\]\);\n/.exec(src);
  assert(block !== null,
    "build.mjs no longer carries a frozen REQUIRED_INPUTS array literal: H18b cannot read the list");
  const out = [];
  for (const line of block[1].split(/\r?\n/)) {
    const q = /^\s*"([^"]+)",?\s*$/.exec(line);
    if (q !== null) out.push(q[1]);
  }
  return out;
};

test("H18b - the 26 are still the WHOLE today/ half of build.mjs's REQUIRED_INPUTS", () => {
  const all = requiredInputsOfBuildSource();
  /* the today/ half FIRST, because its failure NAMES the paths that moved and the
     counts below only name a number: R1 N6's lesson, applied to this cell's own reds. */
  const today = all.filter((p) => p.startsWith("rebuild/m3/w7-preview/today/"));
  assert.deepEqual(today.slice().sort(), TODAY_REQUIRED_INPUTS.slice().sort(),
    "the today/ half of build.mjs's REQUIRED_INPUTS is no longer the " + TODAY_REQUIRED_INPUTS.length
    + " paths this seal pins: it now holds " + today.length
    + ". An ADDED entry is invisible to H18 and this is the cell that sees it");
  assert.equal(all.length, 48,
    "build.mjs's REQUIRED_INPUTS no longer holds 48 path literals but " + all.length
    + ": A.4's seven laws are stated over that list and this seal pins 26 of it");
  assert.equal(new Set(all).size, 48, "build.mjs's REQUIRED_INPUTS repeats a path literal");
});

/* THE OTHER HALF OF THE SAME LAW, run here so this package's own test file
   carries it: the two names admitted above are reachable ONLY through the
   Import route's entry module, and the graph the page walks to paint Today
   carries neither. A boot graph that reached them would mean some other screen
   had found a second way to arrive at the athlete's numbers, which is the thing
   the outright ban was buying and which this replaces. */
test("the Import route is the ONLY way migrate.cjs and merge.cjs are reached", () => {
  const isolation = build.assertImportRouteIsolation(result.graph);
  assert.equal(isolation.route, "rebuild/m3/w7-preview/import/import-screen.mjs");
  assert.equal(isolation.route, build.IMPORT_ENTRY);
  assert.ok(isolation.boot > 100, "the boot graph is " + isolation.boot + " modules: this guard would pass on anything");
  assert.ok(isolation.boot < result.inventory.length,
    "the boot graph is the whole bundle, so the route is not behind a dynamic import at all");
  /* RED SIDE: a graph in which today-app.cjs reaches the route by an import
     statement instead of a dynamic one is refused, by name. */
  const planted = JSON.parse(JSON.stringify(result.graph));
  for (const edge of planted.inputs["rebuild/m3/w7-preview/today/today-app.cjs"].imports) {
    if (edge.path === build.IMPORT_ENTRY) edge.kind = "import-statement";
  }
  assert.throws(() => build.assertImportRouteIsolation(planted), /IMPORT-ROUTE FAIL/);
});

test("the page fetches nothing: no remote origin in any shipped asset (review F9)", async () => {
  const html = await fs.readFile(path.join(build.DIST, "index.html"), "utf8");
  const css = await fs.readFile(path.join(build.DIST, "styles.css"), "utf8");
  const app = await fs.readFile(path.join(build.DIST, "app.js"), "utf8");
  for (const [name, text] of [["index.html", html], ["styles.css", css]]) {
    assert.doesNotMatch(text, /https?:\/\//, name + " references a remote origin");
    assert.doesNotMatch(text, /@import/, name + " imports another stylesheet");
  }
  assert.doesNotMatch(app, /fonts\.(?:googleapis|gstatic)\.com/);
  assert.equal((css.match(/@font-face/g) || []).length, 2, "both typefaces are inlined");
  assert.match(css, /src:url\(data:font\/woff2;base64,/);
  assert.equal(result.fonts.length, 2);
  for (const font of result.fonts) assert.match(font.sha256, /^[0-9a-f]{64}$/);
});

/* review D-4: the "no network reference" claim is EXECUTED by the build, and the check
   itself is shown to be able to fail. */
test("the build refuses any network reference in a shipped asset", () => {
  assert.equal(typeof build.assertNoNetworkReference, "function");
  assert.doesNotThrow(() => build.assertNoNetworkReference([["ok.css", ".a{color:#fff}"]]));
  // A data: payload is not a reference, however many slashes it contains.
  assert.doesNotThrow(() => build.assertNoNetworkReference(
    [["fonts.css", "@font-face{src:url(data:font/woff2;base64,AA//BB//CC)}"]]));
  for (const bad of [
    '<link href="https://fonts.googleapis.com/css2?family=X">',
    '<script src="http://example.com/a.js">',
    '@import url(//cdn.example.com/x.css);',
    ".a{background:url(https://example.org/b.png)}",
  ]) assert.throws(() => build.assertNoNetworkReference([["probe", bad]]), /NETWORK-REFERENCE FAIL/, bad);
});

test("no athlete data and no credential is shipped in the bundle", async () => {
  const app = await fs.readFile(path.join(build.DIST, "app.js"), "utf8");
  assert(!/ledger\/state\.json/.test(app));
  assert(!/src\/history\.js/.test(app));
  /* C4b — the last synthetic enrolment label is GONE. A2 shipped a constant
     identity key in the page and this assertion used to require it to be there
     and to say so in its own name; the local era's identity and authority keys
     are generated on the device by getRandomValues and sealed inside the
     generation they authorize, so there is nothing left to name. */
  assert(!app.includes("synthetic-preview-identity-not-a-credential"),
    "the synthetic identity label must not survive the ONE STORE swap");
  assert(!app.includes("synthetic-preview-enrolment-only"), "nor the static enrolment evidence");
  assert(!app.includes("synthetic-preview-authority"), "nor the synthetic authority kid");
  assert(!app.includes("synthetic-preview-lease"), "nor the synthetic lease id");
  /* There is no key LITERAL in the page at all: the store key is generated by
     WebCrypto on the device and is non-extractable, so nothing that could be
     copied off the device is ever written down. */
  assert(!/"d"\s*:/.test(app), "no JWK private component is shipped");
  assert(!/privateKey\s*:\s*["'`]/.test(app), "no private key literal is shipped");
  assert(!/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(app), "no PEM private key is shipped");
  for (const call of [/generateKey\(/, /"AES-GCM"|'AES-GCM'/, /getRandomValues\(/]) {
    assert(call.test(app), "the page generates its own key material: " + call);
  }
  // The generated store key is not extractable — the third argument is false.
  assert(/generateKey\(\s*\{\s*name:\s*["']AES-GCM["'],\s*length:\s*256\s*\},\s*(?:!1|false)/.test(app)
    || /generateKey\([^)]*,\s*(?:!1|false)\s*,/.test(app), "the generated key is non-extractable");
});

test("an extra build asset blocks serving and a rebuild removes only that extra file", async () => {
  const extra = path.join(build.DIST, "unapproved-test-asset.txt");
  await fs.writeFile(extra, "package boundary probe");
  try {
    await assert.rejects(serve.startServer({ port: 0 }), /unapproved assets/);
    await build.buildToday();
    await assert.rejects(fs.access(extra), { code: "ENOENT" });
    assert.deepEqual((await fs.readdir(build.DIST)).sort(), ["app.js", "index.html", "styles.css"]);
  } finally {
    await fs.unlink(extra).catch((e) => { if (e.code !== "ENOENT") throw e; });
  }
});

test("the local server serves the three assets on 127.0.0.1 with no application network", async () => {
  assert.equal(server.address().address, "127.0.0.1");
  for (const name of ["/", "/index.html", "/styles.css", "/app.js"]) {
    const response = await request(name);
    assert.equal(response.status, 200, name);
    assert.match(response.headers["cache-control"], /no-store/);
    const csp = response.headers["content-security-policy"];
    assert.match(csp, /connect-src 'none'/);
    assert.match(csp, /worker-src 'none'/);
    // review F9: the policy names no external origin, which is also the proof that an
    // offline launch has nothing left to fetch.
    assert.doesNotMatch(csp, /https?:/, name + " policy still names a remote origin");
    assert.match(csp, /font-src data:/);
    assert.equal(response.headers["x-content-type-options"], "nosniff");
  }
  const head = await request("/", "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.body, "");
});

test("source, private paths, traversal and writes cannot reach the repository", async () => {
  for (const target of ["/ledger/state.json", "/src/app.jsx", "/src/history.js", "/rebuild/engine/seed.cjs",
    "/package.json", "/app.js.map", "/sw.js", "/.env"]) {
    const response = await request(target);
    assert.equal(response.status, 404, target);
    assert.equal(response.body, "Not found");
  }
  for (const target of ["/../ledger/state.json", "/%2e%2e/ledger/state.json", "/%2E%2E%2Fledger/state.json",
    "/%5c..%5cledger/state.json", "/%00", "/%zz", "//outside/app.js"]) {
    const response = await request(target);
    assert.equal(response.status, 400, target);
    assert.equal(response.body, "Invalid request path");
  }
  const write = await request("/", "POST");
  assert.equal(write.status, 405);
  assert.equal(write.headers.allow, "GET, HEAD");
});

test("the sibling w7-preview package is untouched by this build", async () => {
  const preview = await import(pathToFileURL(path.resolve(__dirname, "../../build.mjs")).href);
  assert.equal(preview.MOCK_SHA256, "e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563");
  assert.notEqual(path.resolve(preview.DIST), path.resolve(build.DIST), "the two builds own different folders");
  assert(fss.existsSync(path.join(path.resolve(__dirname, "../../test"), "package.test.cjs")));
});
