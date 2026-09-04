/* M2 module 3 cumulative gate. No oracle or frozen-source edits, no migrated fixture files.
   Usage: MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node this-file [--public]
   ENGINE_MAIN points to a locally rebuilt fe516c1 frozen bundle. Its packaging
   hash is platform-dependent; committed fixture/golden/stamp pins are mandatory.
   Golden migration runs ONCE per raw blob. Its JSON dump is passed by value to
   isolated candidate processes, with no golden selectors on the candidate table.
   Default requires all three blobs; --public is explicitly a public-only check. */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const { census, required, leafPaths, CENSUS_VERSION } = require("../../conform/oracle/census.cjs");
const { canon, diffPaths } = require("../../conform/lib/harness.cjs");
const ROOT = path.resolve(__dirname, "../../conform");
const FROZEN_COMMIT = "fe516c1 (v7.56.0, frozen main)";
const CANDIDATE = path.resolve(__dirname, "../oracle-shim.cjs");
const WITHHELD = "[private fixture: detail withheld in code]";
const shaBytes = (x) => crypto.createHash("sha256").update(x).digest("hex");
const shaFile = (p) => shaBytes(fs.readFileSync(p));
const groups = (c) => ({ lifts: required(c).lifts, progression: required(c).progression,
  energy: required(c).energy, today: required(c).today });
const hasThrow = (x) => !!(x && typeof x === "object" &&
  (Object.prototype.hasOwnProperty.call(x, "THREW") || Object.values(x).some(hasThrow)));
const SURFACE = ["exActive", "targetsFor", "deriveSighting", "_volDeltas", "progressionTrend",
  "calorieTarget", "cutRateBand", "calorieFloor", "proteinTarget", "observedTDEE", "currentRate",
  "regime", "energyBalanceTarget", "stepTarget", "forecast", "signalState", "cleanAtDate", "atSleepTarget",
  "statusFace", "statusTarget", "nowFocus", "marchingOrder", "nowModel", "oweTarget"];
const assert = (ok) => { if (!ok) throw new Error("gate precondition failed"); };

// This is the ONLY migration seam: census clones the supplied migrated snapshot,
// then the identity function returns that clone. No candidate migration is tested.
function partial(T, dumped) {
  const out = groups(census({ ...T, migrate: (x) => x }, JSON.parse(dumped)));
  assert(!hasThrow(out));
  // Retain module 2's raw Today-input checks as well as the committed Today DTO.
  // The DTO includes exact statusFace cause prose but excludes its UI tone token.
  // The committed census
  // rounds currentRate and projects progressionTrend, so these extra references
  // come from the same pinned frozen engine and migrated snapshot, in memory.
  const state = JSON.parse(dumped);
  out.todayInputs = { currentRate: T.currentRate(state), regime: T.regime(state),
    progressionTrend: T.progressionTrend(state) };
  assert(!hasThrow(out.todayInputs));
  return out;
}

function publicDifference(golden, candidate) {
  const differences = diffPaths(golden, candidate);
  return { count: differences.length, paths: differences.slice(0, 8).map((d) => d.path) };
}

// Workers receive snapshots only in memory and return verdicts, counts, paths and
// digests. The parent never forwards subprocess stdout/stderr or exception text.
// Fresh processes prevent require caches or a module's Date capture from masking
// a missing injected-clock site in the unfrozen run.
async function worker(mode) {
  const NativeDate = globalThis.Date;
  await import(pathToFileURL(path.resolve(__dirname, "../../../tools/_fixed-now.mjs")).href);
  const FrozenDate = globalThis.Date;
  assert(FrozenDate !== NativeDate);
  if (mode === "unfrozen") globalThis.Date = NativeDate;
  else assert(mode === "frozen");
  const expectedDate = mode === "frozen" ? FrozenDate : NativeDate;
  const packet = JSON.parse(fs.readFileSync(0, "utf8"));
  const T = require(CANDIDATE).__test;
  assert(T && SURFACE.every((name) => typeof T[name] === "function") && T.SEED);
  assert(globalThis.Date === expectedDate);
  const seed = canon(T.SEED) === packet.seed;
  const rows = packet.blobs.map((b) => {
    try {
      const actual = partial(T, b.snapshot);
      assert(globalThis.Date === expectedDate);
      const same = canon(actual) === canon(b.expected);
      return {
        name: b.name, ok: same, digest: shaBytes(canon(actual)),
        leaves: leafPaths(actual).length,
        difference: b.private ? null : publicDifference(b.expected, actual)
      };
    } catch (_) {
      return { name: b.name, ok: false, error: true };
    }
  });
  return { mode, seed, dateMode: globalThis.Date === expectedDate, rows };
}

function runWorker(mode, packet) {
  const result = spawnSync(process.execPath, [__filename, "--worker", mode], {
    input: JSON.stringify(packet), encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env }, windowsHide: true
  });
  if (result.error || result.status !== 0) return null;
  try {
    const output = JSON.parse(result.stdout);
    assert(output.mode === mode && typeof output.seed === "boolean" && output.dateMode === true);
    assert(Array.isArray(output.rows) && output.rows.length === packet.blobs.length);
    assert(output.rows.every((r, i) => r.name === packet.blobs[i].name));
    return output;
  } catch (_) { return null; }
}

function main() {
  const argv = process.argv.slice(2);
  assert(argv.length === 0 || (argv.length === 1 && argv[0] === "--public"));
  const publicOnly = argv[0] === "--public";
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, "oracle/manifest.json"), "utf8"));
  assert(man.clock === process.env.MEASURED_TEST_NOW && man.tz === process.env.TZ);
  assert(man.clock === "2026-09-03" && man.tz === "America/New_York" && man.censusVersion === CENSUS_VERSION);
  // The published status sentence retains the old word PROVISIONAL. The concrete
  // engineCommit pin, not that stale prose, is the prerequisite in BRIEF-1 section 0.
  for (const name of ["preimage-2026-08-15", "synthetic-pending-debut", "live"]) {
    const m = man.goldens[name + ".main"];
    assert(m && m.engineCommit === FROZEN_COMMIT && m.clock === man.clock && m.tz === man.tz && m.censusVersion === CENSUS_VERSION);
  }
  console.log("GREEN M2-3 manifest: fe516c1 / v7.56.0; clock, zone and census version pinned");
  const blobs = [
    { name: "preimage-2026-08-15", file: "fixtures/preimage-2026-08-15.json", private: false },
    { name: "synthetic-pending-debut", file: "fixtures/synthetic-pending-debut.json", private: false },
    ...(publicOnly ? [] : [{ name: "live", file: "private/live.json", private: true }])
  ];
  const NativeDate = globalThis.Date;
  const G = require(path.resolve(process.env.ENGINE_MAIN || path.join(ROOT, "engines/engine-main.cjs"))).__test;
  assert(G && typeof G.migrate === "function" && G.SEED && SURFACE.every((n) => typeof G[n] === "function"));
  assert(globalThis.Date !== NativeDate); // frozen bundle must install its Date shim
  const packet = { seed: canon(G.SEED), blobs: [] };
  const preparation = [];
  for (const b of blobs) {
    try {
      const m = man.goldens[b.name + ".main"];
      const fixturePath = path.join(ROOT, b.file);
      const goldenPath = path.resolve(ROOT, m.path);
      assert(goldenPath.startsWith(ROOT + path.sep));
      assert(shaFile(fixturePath) === m.blobSha256 && shaFile(goldenPath) === m.goldenSha256);
      const g = JSON.parse(fs.readFileSync(goldenPath, "utf8"));
      assert(g.blobSha256 === m.blobSha256 && g.stamp.engine === m.engine);
      assert(g.stamp.engineSha256 === m.engineSha256 && g.stamp.engineCommit === m.engineCommit);
      assert(g.stamp.clock === man.clock && g.stamp.tz === man.tz && g.stamp.censusVersion === CENSUS_VERSION);
      assert(g.census.censusVersion === CENSUS_VERSION && g.census.required.censusVersion === CENSUS_VERSION);
      const raw = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
      const snapshot = JSON.stringify(G.migrate(raw)); // exactly ONE migration/dump per raw fixture
      const expected = groups(g.census);
      assert(!hasThrow(expected));
      const rebuilt = partial(G, snapshot);
      const { todayInputs, ...committedGroups } = rebuilt;
      assert(canon(committedGroups) === canon(expected)); // reproduce all four committed groups
      packet.blobs.push({ ...b, snapshot, expected: { ...expected, todayInputs } });
      preparation.push({ ...b, ok: true });
      if (!b.private) console.log("GREEN M2-3 " + b.name + ": fixture/golden/stamp pins; frozen migrated snapshot matches golden");
    } catch (_) {
      preparation.push({ ...b, ok: false });
      console.log("FAIL M2-3 " + b.name + ": " + (b.private ? WITHHELD : "fixture/golden/stamp or frozen snapshot validation"));
    }
  }
  globalThis.Date = NativeDate;
  if (preparation.some((b) => !b.ok)) return 1;
  const frozen = runWorker("frozen", packet);
  const unfrozen = runWorker("unfrozen", packet);
  if (!frozen || !unfrozen) {
    console.log("FAIL M2-3 isolated candidate execution: details withheld");
    if (!publicOnly) console.log("FAIL M2-3 live: " + WITHHELD);
    return 1;
  }
  const seedOK = frozen.seed && unfrozen.seed;
  console.log((seedOK ? "GREEN" : "FAIL") + " M2-3 SEED: canonical byte equality to frozen __test.SEED in both Date modes");
  let all = seedOK;
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i], f = frozen.rows[i], u = unfrozen.rows[i];
    const deterministic = !f.error && !u.error && typeof f.digest === "string" && f.digest === u.digest;
    const ok = f.ok && u.ok && deterministic;
    all = all && ok;
    if (b.private) {
      console.log((ok ? "GREEN" : "FAIL") + " M2-3 live: " + WITHHELD);
      continue;
    }
    for (const [mode, row] of [["frozen", f], ["unfrozen", u]]) {
      const detail = row.error ? "candidate exception (details withheld)" : row.ok ?
        "lifts + progression + energy + today + raw Today inputs byte-identical (" + row.leaves + " leaves)" :
        row.difference.count + " differing paths: " + row.difference.paths.join(" ") + " (values withheld)";
      console.log((row.ok ? "GREEN" : "FAIL") + " M2-3 " + b.name + " Date=" + mode + ": " + detail);
    }
    console.log((deterministic ? "GREEN" : "FAIL") + " M2-3 " + b.name + ": frozen/unfrozen Date outputs identical; clock still injected");
  }
  console.log((all ? "PASS" : "FAIL") + " M2-3 partial census: " +
    (publicOnly ? "PUBLIC ONLY" : "all required blobs") + "; two Date modes; migration once per fixture");
  return all ? 0 : 1;
}

if (process.argv[2] === "--worker") {
  worker(process.argv[3]).then((r) => process.stdout.write(JSON.stringify(r)), () => {
    process.stderr.write("candidate worker failed; details withheld\n");
    process.exitCode = 1;
  });
} else {
  try { process.exitCode = main(); }
  catch (_) {
    console.log("FAIL CLOSED M2-3 partial census: precondition or execution error (details withheld)");
    process.exitCode = 1;
  }
}
