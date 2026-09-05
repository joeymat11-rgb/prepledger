"use strict";
/* M2-5 supplement. Run from the repository root with MEASURED_TEST_NOW=2026-09-03,
   TZ=America/New_York and ENGINE_MAIN pointing to the locally verified frozen
   fe516c1 bundle. There is no public-only or partial-success mode.

   Runs the ACTUAL, unchanged port-oracle CLI twice. A read-only Node preload
   observes Date around the oracle's own candidate require and at process exit;
   it does not replace any engine function, oracle law, expected DTO or input.
   Separate processes compare exact JSON.stringify bytes after actual migration
   of every RAW fixture, preserving object-key order, array order and all strings.
   The frozen reference alone creates expectations. Candidate workers receive no
   callable reference helpers. Raw states/expectations remain in process memory.

   The unchanged oracle appends its ordinary ignored conform/run.log. This runner
   never forwards subprocess stderr or private law/error details to its report. */
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const { spawnSync, execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const { census, required, CENSUS_VERSION } = require("../../conform/oracle/census.cjs");
const { canon, diffPaths } = require("../../conform/lib/harness.cjs");

const REPO = path.resolve(__dirname, "../../.."), CONFORM = path.join(REPO, "rebuild/conform");
const CANDIDATE = path.join(REPO, "rebuild/engine/oracle-shim.cjs");
const ORACLE = path.join(CONFORM, "oracle/port-oracle.cjs"), FIXED = path.join(REPO, "tools/_fixed-now.mjs");
const WITHHELD = "[private fixture: detail withheld in code]";
const COMMIT = "fe516c1 (v7.56.0, frozen main)", SOURCE_BLOB = "f98671d823f0d8cd83e730cdd930afe5f5e7b628";
const BLOBS = [
  { name: "preimage-2026-08-15", file: "fixtures/preimage-2026-08-15.json", private: false },
  { name: "synthetic-pending-debut", file: "fixtures/synthetic-pending-debut.json", private: false },
  { name: "live", file: "private/live.json", private: true },
];
const LAWS = ["PORT-manifest-clock-zone-and-census-version-match-the-run", ...BLOBS.flatMap(b => [
  "PORT-" + b.name + "-manifest-pins-fixture-golden-engine-and-stamp",
  "PORT-" + b.name + "-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction",
  "PORT-" + b.name + "-census-v2-required-identical-to-golden",
])];
const assert = ok => { if (!ok) throw Error("M2-5 gate precondition failed"); };
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = file => fs.readFileSync(file, "utf8");
const modeOK = mode => mode === "frozen" || mode === "unfrozen";
const nativeDate = Date => /\[native code\]/.test(Function.prototype.toString.call(Date));
const dateSnapshot = () => ({ Date: globalThis.Date, now: Date.now, parse: Date.parse, UTC: Date.UTC });
const sameDate = s => globalThis.Date === s.Date && Date.now === s.now && Date.parse === s.parse && Date.UTC === s.UTC;
const validTable = T => !!T && typeof T.migrate === "function" && !!T.SEED && !("records" in T);

// Loaded with --require BEFORE the optional frozen-Date --import. The original
// loader executes every require unchanged. Restore it immediately after observing
// the candidate, and check again after the full oracle has executed its laws.
function observeOracleDate(mode) {
  const NativeDate = globalThis.Date, nativeStartup = nativeDate(NativeDate);
  const Module = require("node:module"), original = Module._load;
  let selected = null, loaded = false, loadUnchanged = false, callable = false;
  Module._load = function (request, parent, isMain) {
    if (request !== CANDIDATE) return Reflect.apply(original, this, arguments);
    selected = dateSnapshot();
    try {
      const result = Reflect.apply(original, this, arguments);
      loaded = true; callable = validTable(result && result.__test); loadUnchanged = sameDate(selected);
      return result;
    } finally { Module._load = original; }
  };
  process.once("exit", () => {
    const selectedMode = !!selected && (mode === "frozen" ? selected.Date !== NativeDate : selected.Date === NativeDate);
    const result = { mode, nativeStartup, selectedMode, loaded, callable, loadUnchanged,
      executionUnchanged: !!selected && sameDate(selected) };
    const ok = modeOK(mode) && Object.entries(result).every(([k, v]) => k === "mode" || v === true);
    try { fs.writeSync(1, "M2_DATE_PROOF " + JSON.stringify(result) + "\n"); } catch (_) { process.exitCode = 1; }
    if (!ok) process.exitCode = 1;
  });
}

async function loadCandidate(mode) {
  assert(modeOK(mode));
  const NativeDate = globalThis.Date;
  assert(nativeDate(NativeDate));
  if (mode === "frozen") await import(pathToFileURL(FIXED).href);
  const selected = dateSnapshot();
  assert(mode === "frozen" ? selected.Date !== NativeDate : selected.Date === NativeDate);
  const T = require(CANDIDATE).__test;
  assert(validTable(T) && sameDate(selected));
  return { T, selected };
}

// Both sides use the same call order, independent raw clones, and no identity
// migrate. Full-state bytes are captured BEFORE a second raw input is given to
// the unchanged census. That census verifies the entire pinned required DTO.
function evaluate(T, blob, selected) {
  const input = JSON.parse(blob.raw);
  const output = T.migrate(input);
  assert(sameDate(selected));
  const returnedJSON = JSON.stringify(output), inputJSON = JSON.stringify(input);
  assert(typeof returnedJSON === "string" && typeof inputJSON === "string");
  const sameInputIdentity = output === input;
  const requiredCensus = required(census(T, JSON.parse(blob.raw)));
  assert(sameDate(selected));
  return { returnedJSON, inputJSON, sameInputIdentity,
    censusMatches: canon(requiredCensus) === canon(blob.golden) };
}

async function worker(kind, mode) {
  if (kind === "probe") {
    const { selected } = await loadCandidate(mode);
    return { ok: true, mode, dateUnchanged: sameDate(selected) };
  }
  const packet = JSON.parse(fs.readFileSync(0, "utf8"));
  assert(packet.blobs.length === BLOBS.length && packet.blobs.every((b, i) => b.name === BLOBS[i].name && b.private === BLOBS[i].private));
  let T, selected;
  if (kind === "reference") {
    const NativeDate = globalThis.Date;
    assert(nativeDate(NativeDate));
    T = require(path.resolve(process.env.ENGINE_MAIN)).__test;
    selected = dateSnapshot();
    assert(selected.Date !== NativeDate && validTable(T));
  } else {
    assert(kind === "candidate");
    ({ T, selected } = await loadCandidate(mode));
  }
  const seedJSON = JSON.stringify(T.SEED);
  const rows = packet.blobs.map(blob => {
    try {
      const actual = evaluate(T, blob, selected);
      if (kind === "reference") return { name: blob.name, ok: actual.censusMatches, ...actual };
      const expected = blob.expected;
      const returned = actual.returnedJSON === expected.returnedJSON;
      const input = actual.inputJSON === expected.inputJSON;
      const identity = actual.sameInputIdentity === expected.sameInputIdentity;
      const ok = actual.censusMatches && returned && input && identity;
      const result = { name: blob.name, ok, returned, input, identity, censusMatches: actual.censusMatches,
        digest: sha(JSON.stringify([actual.returnedJSON, actual.inputJSON, actual.sameInputIdentity])) };
      if (!blob.private && !ok) {
        // Paths only, never values. Structural diagnostics do not decide parity:
        // key-order-only changes still fail the exact JSON byte comparison above.
        result.paths = [...new Set([
          ...diffPaths(JSON.parse(expected.returnedJSON), JSON.parse(actual.returnedJSON)).map(d => "return" + d.path),
          ...diffPaths(JSON.parse(expected.inputJSON), JSON.parse(actual.inputJSON)).map(d => "input" + d.path),
        ])].slice(0, 8);
      }
      return result;
    } catch (_) { return { name: blob.name, ok: false, error: true }; }
  });
  return { kind, mode, dateUnchanged: sameDate(selected), rows,
    ...(kind === "reference" ? { seedJSON } : { seedMatches: seedJSON === packet.seedJSON }) };
}

function child(args, packet, env = process.env) {
  return spawnSync(process.execPath, args, { cwd: REPO, env, encoding: "utf8", windowsHide: true,
    input: packet === undefined ? undefined : JSON.stringify(packet), maxBuffer: 128 * 1024 * 1024,
    timeout: 300000 });
}
function runWorker(kind, mode, packet) {
  const result = child([__filename, "--worker", kind, mode || "reference"], packet);
  if (result.error || result.status !== 0) return null;
  try { return JSON.parse(result.stdout); } catch (_) { return null; }
}

function preflight() {
  assert(process.env.MEASURED_TEST_NOW === "2026-09-03" && process.env.TZ === "America/New_York");
  assert(process.env.ENGINE_MAIN && fs.existsSync(path.resolve(process.env.ENGINE_MAIN)));
  const source = fs.readFileSync(path.join(REPO, "src/app.jsx"));
  const sourceHash = crypto.createHash("sha1").update("blob " + source.length + "\0").update(source).digest("hex");
  const frozenHash = execFileSync("git", ["rev-parse", "fe516c1:src/app.jsx"],
    { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], windowsHide: true }).trim();
  assert(sourceHash === SOURCE_BLOB && frozenHash === SOURCE_BLOB);
  const manifest = JSON.parse(read(path.join(CONFORM, "oracle/manifest.json")));
  assert(manifest.clock === process.env.MEASURED_TEST_NOW && manifest.tz === process.env.TZ && manifest.censusVersion === CENSUS_VERSION);
  const packet = { blobs: [] };
  let ok = true;
  for (const b of BLOBS) {
    try {
      const pin = manifest.goldens[b.name + ".main"];
      assert(pin && pin.engineCommit === COMMIT && pin.engine === "main" && pin.clock === manifest.clock && pin.tz === manifest.tz && pin.censusVersion === CENSUS_VERSION);
      const fixture = path.join(CONFORM, b.file), golden = path.resolve(CONFORM, pin.path);
      assert(golden.startsWith(CONFORM + path.sep));
      const rawBytes = fs.readFileSync(fixture), goldenBytes = fs.readFileSync(golden);
      assert(sha(rawBytes) === pin.blobSha256 && sha(goldenBytes) === pin.goldenSha256);
      const g = JSON.parse(goldenBytes.toString("utf8"));
      assert(g.blobSha256 === pin.blobSha256 && g.census.censusVersion === CENSUS_VERSION && g.census.required.censusVersion === CENSUS_VERSION);
      for (const key of ["engine", "engineSha256", "engineCommit", "clock", "tz", "censusVersion"]) assert(g.stamp[key] === pin[key]);
      packet.blobs.push({ ...b, raw: rawBytes.toString("utf8"), golden: g.census.required });
      console.log("GREEN M2-5 " + b.name + " input pins: " + (b.private ? WITHHELD : "fixture, golden and complete frozen stamp verified"));
    } catch (_) {
      ok = false;
      console.log("FAIL M2-5 " + b.name + " input pins: " + (b.private ? WITHHELD : "required fixture/golden/stamp missing or mismatched"));
    }
  }
  assert(ok && packet.blobs.length === 3);
  return packet;
}

function fullOracle(mode) {
  // This is the real CLI, including its own exit code and whole law inventory.
  // The extra --require is an observer, not an alternate oracle entry point.
  const args = ["--require", __filename, ...(mode === "frozen" ? ["--import", "./tools/_fixed-now.mjs"] : []),
    ORACLE, "check", CANDIDATE, "m2-5-" + mode];
  const result = child(args, undefined, { ...process.env, M2_MIGRATE_DATE_MODE: mode });
  const lines = String(result.stdout || "").split(/\r?\n/);
  const rows = lines.flatMap(line => {
    const match = /^(GREEN|FAIL|HARNESS_ERROR)\s+(PORT-\S+)\s+\[/.exec(line);
    return match ? [{ verdict: match[1], id: match[2], line }] : [];
  });
  const inventory = rows.length === LAWS.length && rows.every((r, i) => r.id === LAWS[i]);
  const proofLines = lines.filter(line => line.startsWith("M2_DATE_PROOF "));
  let proof = null;
  try { if (proofLines.length === 1) proof = JSON.parse(proofLines[0].slice("M2_DATE_PROOF ".length)); } catch (_) {}
  const date = !!proof && proof.mode === mode && ["nativeStartup", "selectedMode", "loaded", "callable", "loadUnchanged", "executionUnchanged"].every(k => proof[k] === true);
  console.log("M2-5 ACTUAL FULL ORACLE Date=" + mode);
  for (const id of LAWS) {
    const matches = rows.filter(r => r.id === id), row = matches.length === 1 ? matches[0] : null;
    if (!row) console.log("FAIL " + id + " — required verdict absent or duplicated");
    else if (id.startsWith("PORT-live-")) console.log(row.verdict.padEnd(22) + " " + id + " — " + WITHHELD);
    else if (row.verdict === "HARNESS_ERROR") console.log("HARNESS_ERROR " + id + " — exception details withheld");
    else console.log(row.line); // Public oracle verdicts remain verbatim.
  }
  console.log((date ? "GREEN" : "FAIL") + " M2-5 oracle Date=" + mode + ": native startup, selected mode, candidate loading and full execution identity; migrate callable; records absent");
  const ok = !result.error && result.status === 0 && inventory && date && rows.every(r => r.verdict === "GREEN");
  console.log((ok ? "PASS" : "FAIL") + " M2-5 actual full oracle Date=" + mode + ": all ten required law IDs; all three blobs");
  return ok;
}

function main() {
  assert(process.argv.length === 2);
  const packet = preflight();
  for (const mode of ["frozen", "unfrozen"]) {
    const probe = runWorker("probe", mode);
    assert(probe && probe.ok === true && probe.mode === mode && probe.dateUnchanged === true);
  }
  console.log("GREEN M2-5 candidate preflight: migrate callable, records absent and Date unchanged in both modes");
  // Deliberately run both even if the first fails. A failure never suppresses the
  // second required mode or gets relabelled as expected partial/HARNESS_ERROR.
  const oracleFrozen = fullOracle("frozen"), oracleUnfrozen = fullOracle("unfrozen");
  const reference = runWorker("reference", null, packet);
  assert(reference && reference.kind === "reference" && reference.dateUnchanged === true && typeof reference.seedJSON === "string");
  assert(reference.rows.length === BLOBS.length && reference.rows.every((r, i) => r.name === BLOBS[i].name));
  let referenceOK = true;
  for (const [i, b] of BLOBS.entries()) {
    const row = reference.rows[i], ok = row.ok === true && row.censusMatches === true && typeof row.returnedJSON === "string" && typeof row.inputJSON === "string";
    referenceOK = referenceOK && ok;
    console.log((ok ? "GREEN" : "FAIL") + " M2-5 frozen full-state reference " + b.name + ": " + (b.private ? WITHHELD : "actual raw migration and whole required census match the committed golden"));
    packet.blobs[i].expected = row;
  }
  assert(referenceOK);
  packet.seedJSON = reference.seedJSON;
  const frozen = runWorker("candidate", "frozen", packet), unfrozen = runWorker("candidate", "unfrozen", packet);
  for (const [mode, run] of [["frozen", frozen], ["unfrozen", unfrozen]]) {
    assert(run && run.kind === "candidate" && run.mode === mode && run.dateUnchanged === true);
    assert(run.rows.length === BLOBS.length && run.rows.every((r, i) => r.name === BLOBS[i].name));
  }
  let all = oracleFrozen && oracleUnfrozen && frozen.seedMatches === true && unfrozen.seedMatches === true;
  console.log((frozen.seedMatches && unfrozen.seedMatches ? "GREEN" : "FAIL") + " M2-5 SEED: exact JSON bytes before migration in both modes");
  for (const [i, b] of BLOBS.entries()) {
    const f = frozen.rows[i], u = unfrozen.rows[i];
    const deterministic = !f.error && !u.error && typeof f.digest === "string" && f.digest === u.digest;
    for (const [mode, row] of [["frozen", f], ["unfrozen", u]]) {
      const ok = row.ok === true && deterministic;
      all = all && ok;
      let detail = WITHHELD;
      if (!b.private) detail = ok ? "exact JSON.stringify return and post-call input bytes; identity behavior and whole required census; cross-mode identical" :
        row.error ? "execution failed; exception details withheld" :
        "return=" + row.returned + "; input=" + row.input + "; identity=" + row.identity + "; required=" + row.censusMatches + "; cross-mode=" + deterministic +
        (row.paths && row.paths.length ? "; differing paths: " + row.paths.join(" ") : "; byte/order difference or required-census failure (values withheld)");
      console.log((ok ? "GREEN" : "FAIL") + " M2-5 full-post-state " + b.name + " Date=" + mode + ": " + detail);
    }
  }
  console.log((all ? "PASS" : "FAIL") + " M2-5 full migration gate: actual full oracle and exact post-state supplement; all three raw blobs; both Date modes");
  return all ? 0 : 1;
}

if (require.main !== module && process.env.M2_MIGRATE_DATE_MODE) {
  observeOracleDate(process.env.M2_MIGRATE_DATE_MODE);
} else if (require.main === module && process.argv[2] === "--worker") {
  worker(process.argv[3], process.argv[4]).then(result => {
    process.stdout.write(JSON.stringify(result));
  }, () => { process.stderr.write("M2-5 isolated worker failed; details withheld\n"); process.exitCode = 1; });
} else if (require.main === module) {
  try { process.exitCode = main(); }
  catch (_) { console.log("FAIL CLOSED M2-5 full migration gate: precondition or execution failure; details withheld"); process.exitCode = 1; }
}
