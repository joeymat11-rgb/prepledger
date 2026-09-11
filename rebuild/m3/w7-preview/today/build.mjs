// Build the Today page: the owner-approved 2026-09-08 design over the real engine and
// the real durable client. Installs nothing; writes exactly three ignored assets.
//
// The design pins and the class/copy binding live in ./design.cjs, which depends on
// nothing but node:fs, so the tests that check the binding run under the repository's own
// lockfile. This file adds the bundle.
//
// The bundle is produced by the SAME browser build the phone host uses
// (rebuild/m3/w6/build-browser.mjs, exactly as rebuild/m3/w6/host/build-host.mjs does),
// so the node:crypto boundary, the authority exclusions and the pinned input inventory
// are the accepted ones — and this one output can serve the PC preview and a phone host
// unchanged (A5).
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildBrowser } from "../../w6/build-browser.mjs";
import design from "./design.cjs";
/* THE BUILD-TIME REFUSAL for the owner's no-dashes rule (DECISIONS:114 (1), P1 brief
   amendment DECISIONS:117 (1)): this build will not write an asset carrying an em or en
   dash in text the athlete can see. The scan and what it deliberately exempts (comments,
   and the frozen sources' own prose, which reaches the DOM only through plainCopy) are
   documented in ./plain-copy.cjs. */
import PlainCopy from "./plain-copy.cjs";

const { assertNoAiDashesInAssets } = PlainCopy;
const { APPROVED, readApproved, readFonts, assertDesignBinding, composeStyles } = design;

export const SOURCE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(SOURCE, "../../../..");
export const DIST = path.join(ROOT, ".tmp/w7-today-dist");
export const SCRATCH = path.join(ROOT, ".tmp/w7-today-build");
export const ASSETS = Object.freeze(["index.html", "styles.css", "app.js"]);
export { APPROVED, readApproved, readFonts, assertDesignBinding, composeStyles };

const FORBIDDEN = Object.freeze([
  ["rebuild/engine/seed.cjs", (p) => p === "rebuild/engine/seed.cjs"],
  ["rebuild/engine/migrate.cjs", (p) => p === "rebuild/engine/migrate.cjs"],
  ["rebuild/engine/merge.cjs", (p) => p === "rebuild/engine/merge.cjs"],
  ["rebuild/engine/index.cjs", (p) => p === "rebuild/engine/index.cjs"],
  ["rebuild/engine/test/*", (p) => /^rebuild\/engine\/test\//.test(p)],
  ["rebuild/authority/* (except canonical)", (p) => /^rebuild\/authority\//.test(p) && p !== "rebuild/authority/canonical.cjs"],
  ["rebuild/m3/w5/crypto.cjs", (p) => p === "rebuild/m3/w5/crypto.cjs"],
  ["rebuild/m4/import/*", (p) => /^rebuild\/m4\/import\//.test(p)],
  ["ledger/*", (p) => /^ledger\//.test(p)],
  ["src/history.js", (p) => p === "src/history.js"],
  /* A2: the accepted rebuild/m4/workout/engine-runtime.cjs composes its twelve
     modules through ONE non-literal require, which esbuild glob-expands over the
     whole of rebuild/engine — dragging in seed/migrate/merge/index and every
     Node-only engine test harness. The page uses the accepted host-owned mirror
     rebuild/m3/w6/host/engine-runtime-host.cjs instead, exactly as the phone host
     does (A0 §4), so the accepted file must never enter this graph either. */
  ["rebuild/m4/workout/engine-runtime.cjs", (p) => p === "rebuild/m4/workout/engine-runtime.cjs"],
]);

// The page must really contain these: the engine's Today readers, the accepted writer,
// and the real client composition root.
const REQUIRED_INPUTS = Object.freeze([
  "rebuild/engine/today.cjs",
  "rebuild/engine/energy.cjs",
  "rebuild/engine/writers.cjs",
  "rebuild/client/index.cjs",
  "rebuild/client/ops.cjs",
  "rebuild/client/store.cjs",
  "rebuild/m3/w7-preview/today/today-model.cjs",
  "rebuild/m3/w7-preview/today/today-app.cjs",
  /* A2 — the gym card really is the ACCEPTED W6 host composition over the accepted
     capture layer, in the page. A build that lost any of these would be a page
     with a second, invented workout path. */
  "rebuild/m3/w7-preview/today/gym-host.mjs",
  "rebuild/m3/w7-preview/today/gym-model.mjs",
  "rebuild/m3/w7-preview/today/gym-app.mjs",
  /* A2 review B2 — the weigh-in's store of record is the accepted encrypted
     repository, not localStorage. A build that lost this module would be a page
     whose readings can vanish on a hard kill. */
  "rebuild/m3/w7-preview/today/reading-host.mjs",
  /* A3 — the recovery check-in really is the accepted encrypted repository under the
     accepted durable public client over rebuild/client, in the page. A build that
     lost any of these would be a page whose check-in answers go nowhere. */
  "rebuild/m3/w7-preview/today/checkin-host.mjs",
  "rebuild/m3/w7-preview/today/checkin-commands.cjs",
  "rebuild/m3/w7-preview/today/checkin-model.mjs",
  "rebuild/m3/w7-preview/today/checkin-app.mjs",
  /* A4 — Dad's first run really is the accepted encrypted repository under the
     accepted durable public client over rebuild/client, in the page, and the
     document it writes really is built by the ACCEPTED clean-init constructor. A
     build that lost any of these would be a page whose first run goes nowhere, or
     one that invented an athlete state of its own. */
  "rebuild/m3/w7-preview/today/setup-host.mjs",
  "rebuild/m3/w7-preview/today/setup-commands.mjs",
  "rebuild/m3/w7-preview/today/setup-model.mjs",
  "rebuild/m3/w7-preview/today/setup-app.mjs",
  "rebuild/m4/workout/athlete-state.cjs",
  "rebuild/m3/w6/host/workout-host.mjs",
  "rebuild/m3/w6/host/engine-runtime-host.cjs",
  "rebuild/m3/w6/public-client.mjs",
  "rebuild/m3/w6/repository.mjs",
  "rebuild/m3/w6/t2-stage.cjs",
  "rebuild/m4/workout/capture.cjs",
  "rebuild/m4/workout/commands.cjs",
  "rebuild/m4/workout/engine-capture.cjs",
  "rebuild/m4/workout/engine-history.cjs",
  "rebuild/m4/workout/source-projection.cjs",
  "rebuild/m4/workout/edit-values.cjs",
  "rebuild/m3/w5/source/codec.cjs",
]);

/* review D-4: EXECUTE the "no network reference" claim instead of printing it. Every
   shipped byte is scanned for a URL the browser could act on — an absolute http(s) URL or
   a protocol-relative //host one. data: payloads are collapsed first, because a base64
   font legitimately contains "//" thousands of times and is not a reference to anything.
   The only address this page may name is its own origin, which it never writes down: the
   three assets are fetched by relative path. */
export function assertNoNetworkReference(assets) {
  for (const [name, bytes] of assets) {
    const text = (typeof bytes === "string" ? bytes : bytes.toString("utf8")).replace(/data:[^"')\s]+/g, "data:");
    const hits = [
      ...text.matchAll(/https?:\/\/[^\s"'`)<>]+/gi),
      ...text.matchAll(/(?:^|[\s"'(=,;:])\/\/[a-z0-9][a-z0-9.-]*\.[a-z]{2,}[^\s"'`)<>]*/gi),
    ].map((match) => match[0].trim());
    assert.equal(hits.length, 0,
      `NETWORK-REFERENCE FAIL: ${name} names ${[...new Set(hits)].slice(0, 3).join(", ")}`);
  }
  return assets.length;
}

export function assertBundleInputs(inventory) {
  const paths = inventory.map((i) => i.path);
  for (const [label, match] of FORBIDDEN) {
    const hits = paths.filter(match);
    assert.equal(hits.length, 0, `BUNDLE-INPUTS FAIL: ${label} -> ${hits.join(", ")}`);
  }
  for (const required of REQUIRED_INPUTS) {
    assert(paths.includes(required), `BUNDLE-INPUTS FAIL: missing required input ${required}`);
  }
  // The only third-party code allowed in the page is the SHA-256/HMAC primitive the
  // accepted W6 browser boundary already substitutes for node:crypto, and only for
  // rebuild/client's two approved importers. Anything else is a new dependency.
  for (const p of paths) {
    if (!/node_modules/.test(p)) continue;
    assert(/@noble[+/]hashes/.test(p), `BUNDLE-INPUTS FAIL: unapproved dependency ${p}`);
  }
  return paths;
}

async function realDirectory(directory) {
  await fs.mkdir(directory, { recursive: true });
  const stat = await fs.lstat(directory);
  assert(stat.isDirectory() && !stat.isSymbolicLink(), "OUTPUT-DIRECTORY FAIL: a real directory is required");
  const root = await fs.realpath(ROOT);
  assert.equal(await fs.realpath(directory), path.join(root, path.relative(ROOT, directory)),
    "OUTPUT-DIRECTORY FAIL: path escaped workspace");
  return directory;
}

export async function buildToday() {
  const approved = readApproved();
  const fonts = readFonts();
  const shell = design.shellHtml();
  const template = design.templateHtml();
  const chrome = design.chromeCss();
  assert.equal(shell.split("<!-- APPROVED_TEMPLATES -->").length, 2, "TEMPLATE-SLOT FAIL");
  const binding = assertDesignBinding(approved, template, design.appSource());

  await realDirectory(path.join(ROOT, ".tmp"));
  await realDirectory(SCRATCH);
  const built = await buildBrowser({
    outfile: path.join(SCRATCH, "app.js"),
    entryPoints: [path.join(SOURCE, "today-entry.mjs")],
  });
  const inputs = assertBundleInputs(built.inventory);

  const contents = {
    "index.html": shell.replace("<!-- APPROVED_TEMPLATES -->", template),
    "styles.css": composeStyles(approved, chrome, fonts),
    "app.js": await fs.readFile(built.outfile),
  };
  assertNoNetworkReference(Object.entries(contents));
  /* Before a byte is written: no em dash and no en dash in anything the athlete reads. */
  const dashes = assertNoAiDashesInAssets(Object.entries(contents));
  await realDirectory(DIST);
  for (const entry of await fs.readdir(DIST, { withFileTypes: true })) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "OUTPUT-CLEAN FAIL: unexpected directory or link");
    if (!ASSETS.includes(entry.name)) await fs.unlink(path.join(DIST, entry.name));
  }
  for (const name of ASSETS) await fs.writeFile(path.join(DIST, name), contents[name]);
  assert.deepEqual((await fs.readdir(DIST)).sort(), [...ASSETS].sort(), "PACKAGE-ALLOWLIST FAIL");

  return { dist: DIST, assets: [...ASSETS], inputs, inventory: built.inventory, dashes,
    approved: APPROVED.map((a) => a.sha256), fonts: fonts.map((f) => ({ name: f.name, sha256: f.sha256 })), binding };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await buildToday();
    const engine = result.inputs.filter((p) => p.startsWith("rebuild/engine/"));
    const client = result.inputs.filter((p) => p.startsWith("rebuild/client/"));
    console.log(`A1 TODAY BUILD PASS: ${result.assets.length} assets; ${result.inputs.length} pinned inputs `
      + `(${engine.length} engine, ${client.length} client); approved design pinned; `
      + `${result.binding.classes} bound classes; ${result.fonts.length} pinned typefaces inlined; `
      + `no literal figure in the template; ${result.assets.length}/${result.assets.length} assets scanned and free of any network reference; `
      + `no em/en dash in any text the athlete can see (${result.dashes.admitted} frozen-source strings carry one and `
      + `reach the screen only through plainCopy; ${result.binding.recovery.dashNormalised.length} harvested approved term(s) dash-normalised)`);
  } catch (error) {
    console.error(`A1 TODAY BUILD FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
