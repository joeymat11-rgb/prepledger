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
/* REPORT A PROBLEM (DECISIONS:140 (3)). The diagnostic block names the build it was
   taken on, and the only honest name for a build is what went into it, so this file
   computes that name and injects it into the one literal that carries it. */
import ProblemReport from "./problem-report.cjs";

const { assertNoAiDashesInAssets } = PlainCopy;
const { BUILD_PLACEHOLDER } = ProblemReport;
const { APPROVED, readApproved, readFonts, assertDesignBinding, composeStyles } = design;

export const SOURCE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(SOURCE, "../../../..");
export const DIST = path.join(ROOT, ".tmp/w7-today-dist");
export const SCRATCH = path.join(ROOT, ".tmp/w7-today-build");
/* This directory, as the bundle's own inventory spells it: forward slashes, relative to
   ROOT. On the real tree it is exactly "rebuild/m3/w7-preview/today". */
export const SOURCE_REL = path.relative(ROOT, SOURCE).split(path.sep).join("/");
const OWN_PREFIX = "rebuild/m3/w7-preview/today/";
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
  /* A4b — the three modules the second round added. A build that lost split-kinds
     would be a page that asks a beginner which kind each day is; one that lost the
     catalogue or the starter week would be a page with only the "I'll name it
     myself" door, which is the door DECISIONS:127 exists to stop being the only
     one. All three are pure: no DOM, no store, nothing from rebuild/engine. */
  "rebuild/m3/w7-preview/today/split-kinds.mjs",
  "rebuild/m3/w7-preview/today/exercise-catalogue.mjs",
  "rebuild/m3/w7-preview/today/starter-week.mjs",
  /* REPORT A PROBLEM (DECISIONS:140 (3)) - the pure diagnostic builder. A build that
     lost it would be a page whose "Report a problem" control has nothing to copy. It
     is also the module carrying the build-id literal this file injects below, so its
     absence is caught twice. */
  "rebuild/m3/w7-preview/today/problem-report.cjs",
  /* N1 NUTRITION (DECISIONS:143) - the producer, the projector and the durable lane.
     A build that lost food-model.cjs would be a page whose stored intake never
     reaches the engine's dailyLogs; one that lost food-commands.cjs or food-host.mjs
     would be a page whose nutrition entry writes nowhere. All three are required, and
     food-host.mjs is reached through a dynamic import (the page opens that lane
     itself, because today-entry.mjs is pinned on disk by B-NTC), so naming it here is
     also what proves the bundler really followed it. */
  "rebuild/m3/w7-preview/today/food-commands.cjs",
  "rebuild/m3/w7-preview/today/food-model.cjs",
  "rebuild/m3/w7-preview/today/food-host.mjs",
  /* MACHINE SETTINGS ON THE ACTIVE SET (DECISIONS:154 (2), :140 wave one). The gym
     card's half of wave one writes THE COACH'S OWN OP: the producer, the caps, the
     profile, the read-back filter and the latest-wins rule are all in
     rebuild/coach/machine-settings-commands.cjs, which is a pinned input of this page
     from here on. A build that lost it would be a page that had to invent a second
     shape for the same fact, which is the one thing this brief exists to prevent; a
     build that lost either of the two modules below would be a card whose recalled
     settings, or whose capture, silently went nowhere. */
  "rebuild/coach/machine-settings-commands.cjs",
  "rebuild/m3/w7-preview/today/machine-settings-host.mjs",
  "rebuild/m3/w7-preview/today/machine-settings-view.mjs",
  /* N2 SLEEP (DECISIONS:167) - the producer, the projector seam S2 needs and the
     durable lane. A build that lost sleep-model.cjs would be a page whose recorded
     night never reaches `state.sleep.nights`, and therefore never reaches the workout
     preparation or the recovery check-in; one that lost sleep-commands.cjs or
     sleep-host.mjs would be a page whose sleep entry writes nowhere. sleep-host.mjs is
     reached through a dynamic import (the page opens that lane itself, because
     today-entry.mjs is pinned on disk by B-NTC), so naming it here is also what proves
     the bundler really followed it. */
  "rebuild/m3/w7-preview/today/sleep-commands.cjs",
  "rebuild/m3/w7-preview/today/sleep-model.cjs",
  "rebuild/m3/w7-preview/today/sleep-host.mjs",
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

/* THE BUILD ID (REPORT-A-PROBLEM-BRIEF section 2, DECISIONS:140 (3)).

   sha256 over the PINNED INPUT INVENTORY - every module esbuild actually put in the
   page, each as `<path> <its own sha256>`, sorted so the digest does not depend on the
   order the bundler happened to walk the graph. It is therefore a name for exactly what
   shipped: change a byte of any input and the name changes; change nothing and two
   builds on two machines agree. The precedent is A5's cache name over its precache
   manifest (DECISIONS:101). The 12-hex truncation of the printed tag is this brief's
   own invention, and it is a display truncation only: the full digest is returned here
   and recomputed independently by test/problem.test.mjs. */
export function buildIdOf(inventory) {
  const lines = inventory.map((input) => input.path + " " + input.sha256).sort();
  return design.sha256(lines.join("\n"));
}
export const buildTagOf = (inventory) => "earned-" + buildIdOf(inventory).slice(0, 12);

/* The injection. The page cannot compute its own build id - it would have to hash the
   sources it was built from, which are not in it - so the one literal that carries the
   name is replaced in the bundle on the way out. It must be there EXACTLY ONCE: zero
   means problem-report.cjs left the graph or was renamed, and the page would name a
   build that does not exist; more than one means something else in the graph spells the
   placeholder, and the replacement would be ambiguous. Both refuse the build. */
export function injectBuildId(bundle, tag) {
  const found = bundle.split(BUILD_PLACEHOLDER).length - 1;
  assert.equal(found, 1, `BUILD-ID-INJECTION FAIL: the build-id literal appears ${found} times, not once`);
  return bundle.replace(BUILD_PLACEHOLDER, tag);
}

export function assertBundleInputs(inventory) {
  const paths = inventory.map((i) => i.path);
  for (const [label, match] of FORBIDDEN) {
    const hits = paths.filter(match);
    assert.equal(hits.length, 0, `BUNDLE-INPUTS FAIL: ${label} -> ${hits.join(", ")}`);
  }
  /* The page's OWN modules are required from wherever THIS build.mjs lives, not from a
     directory spelled out in a constant. It is the same list and the same assertion for
     the real tree - `SOURCE_REL` is "rebuild/m3/w7-preview/today" there, so every entry
     below resolves to the byte-identical string it always did. Deriving it is what lets
     the dash guard be proved RED against a COPY of this directory instead of against the
     worktree: see test/copy.test.mjs `planted()`, which used to write the plant into the
     real today-app.cjs and was read mid-flight by whatever else was running. */
  for (const required of REQUIRED_INPUTS) {
    const wanted = required.startsWith(OWN_PREFIX)
      ? SOURCE_REL + required.slice(OWN_PREFIX.length - 1)
      : required;
    assert(paths.includes(wanted), `BUNDLE-INPUTS FAIL: missing required input ${wanted}`);
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

/* The two output directories are arguments with the accepted defaults, so that two
   builds running AT THE SAME TIME (node --test gives each test file its own process, and
   five of this directory's suites build) can be told apart instead of overwriting each
   other's scratch bundle and dist. Called with no argument this is the accepted build,
   byte for byte, into the accepted paths. Both must still resolve inside the workspace:
   realDirectory() is what enforces that, and it is unchanged. */
export async function buildToday({ dist = DIST, scratch = SCRATCH } = {}) {
  const approved = readApproved();
  const fonts = readFonts();
  const shell = design.shellHtml();
  const template = design.templateHtml();
  const chrome = design.chromeCss();
  assert.equal(shell.split("<!-- APPROVED_TEMPLATES -->").length, 2, "TEMPLATE-SLOT FAIL");
  const binding = assertDesignBinding(approved, template, design.appSource());

  await realDirectory(path.join(ROOT, ".tmp"));
  await realDirectory(scratch);
  const built = await buildBrowser({
    outfile: path.join(scratch, "app.js"),
    entryPoints: [path.join(SOURCE, "today-entry.mjs")],
  });
  const inputs = assertBundleInputs(built.inventory);
  /* The build names itself, from what went into it, before a byte is written. */
  const buildId = buildIdOf(built.inventory);
  const buildTag = buildTagOf(built.inventory);

  const contents = {
    "index.html": shell.replace("<!-- APPROVED_TEMPLATES -->", template),
    "styles.css": composeStyles(approved, chrome, fonts),
    "app.js": injectBuildId((await fs.readFile(built.outfile)).toString("utf8"), buildTag),
  };
  assertNoNetworkReference(Object.entries(contents));
  /* Before a byte is written: no em dash and no en dash in anything the athlete reads. */
  const dashes = assertNoAiDashesInAssets(Object.entries(contents));
  await realDirectory(dist);
  for (const entry of await fs.readdir(dist, { withFileTypes: true })) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "OUTPUT-CLEAN FAIL: unexpected directory or link");
    if (!ASSETS.includes(entry.name)) await fs.unlink(path.join(dist, entry.name));
  }
  for (const name of ASSETS) await fs.writeFile(path.join(dist, name), contents[name]);
  assert.deepEqual((await fs.readdir(dist)).sort(), [...ASSETS].sort(), "PACKAGE-ALLOWLIST FAIL");

  return { dist, assets: [...ASSETS], inputs, inventory: built.inventory, dashes,
    buildId, buildTag,
    approved: APPROVED.map((a) => a.sha256), fonts: fonts.map((f) => ({ name: f.name, sha256: f.sha256 })), binding };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await buildToday();
    const engine = result.inputs.filter((p) => p.startsWith("rebuild/engine/"));
    const client = result.inputs.filter((p) => p.startsWith("rebuild/client/"));
    console.log(`A1 TODAY BUILD PASS: ${result.assets.length} assets; ${result.inputs.length} pinned inputs `
      + `(${engine.length} engine, ${client.length} client); build ${result.buildTag}; approved design pinned; `
      + `${result.binding.classes} bound classes; ${result.fonts.length} pinned typefaces inlined; `
      + `no literal figure in the template; ${result.assets.length}/${result.assets.length} assets scanned and free of any network reference; `
      + `no em/en dash in any text the athlete can see (${result.dashes.admitted} frozen-source strings carry one and `
      + `reach the screen only through plainCopy; ${result.binding.recovery.dashNormalised.length} harvested approved term(s) dash-normalised)`);
  } catch (error) {
    console.error(`A1 TODAY BUILD FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
