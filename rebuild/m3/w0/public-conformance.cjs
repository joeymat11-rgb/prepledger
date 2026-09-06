"use strict";
/* Early PUBLIC CI only. Reuse frozen laws/harness; never invoke the private oracle or full runner. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const CONFORM = path.resolve(__dirname, "../../conform");
const { runLaws, runMutants, checkInventory } = require(path.join(CONFORM, "lib/harness.cjs"));
const FILES = Object.freeze({
  "laws/sheet-A-authority.cjs": ["authority", 34],
  "laws/sheet-B-client.cjs": ["client", 35],
  "laws/d13-d14.cjs": ["policy", 20],
  "laws/progression.cjs": ["progression", 9],
  "laws/soak.cjs": ["authority", 1],
});
const GATE_COUNTS = Object.freeze({ rig175: 10, rig176: 7, rig177: 13, rig178: 10, rig179: 8, rig180: 9, rig181: 13, rig182: 15, rig183: 13, rig184: 10 });
const REQUIRED = ["authority", "client"];
const OPTIONAL = ["policy", "progression"];
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const sameSet = (a, b) => a.length === b.length && new Set(a).size === a.length && a.every((v) => b.includes(v));

function checkEnvironment(env, manifest) {
  assert(manifest.clock === "2026-09-03" && manifest.tz === "America/New_York", "ENVIRONMENT: unexpected frozen oracle clock/zone");
  assert(env.MEASURED_TEST_NOW === manifest.clock && env.TZ === manifest.tz,
    "ENVIRONMENT: set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York explicitly");
  const overrides = { CONFORM_ADAPTERS_DIR: path.join(CONFORM, "adapters"), EARNED_CLIENT_DIR: path.resolve(CONFORM, "../client") };
  for (const [key, expected] of Object.entries(overrides))
    assert(!env[key] || path.resolve(env[key]) === expected, `ENVIRONMENT: ${key} must not redirect this public check`);
  assert(!env.CONFORM_MUTATE_LAWS, "ENVIRONMENT: frozen law mutation is not permitted here");
}

function loadInventory(manifest, loader = (file) => require(path.join(CONFORM, file))) {
  assert(manifest.totalLaws === 99 && manifest.manifestVersion === 3, "INVENTORY: expected frozen v3 / 99 laws");
  assert(manifest.laws && sameSet(Object.keys(manifest.laws), Object.keys(FILES)), "INVENTORY: law file set differs");
  const modules = [];
  for (const [file, [family, count]] of Object.entries(FILES)) {
    const spec = manifest.laws[file];
    assert(spec.family === family && spec.count === count && Array.isArray(spec.ids) && spec.ids.length === count,
      `INVENTORY: invalid frozen specification for ${file}`);
    let loaded;
    try { loaded = loader(file); } catch (e) { throw new Error(`LAW-LOAD: ${file}: ${e.message}`); }
    assert(loaded && Array.isArray(loaded.laws), `INVENTORY: ${file} exports no laws`);
    const inventory = checkInventory(loaded.laws, spec.ids);
    assert(inventory.ok && loaded.laws.length === count, `INVENTORY: missing, duplicate or unexpected id in ${file}`);
    assert(loaded.laws.every((law) => law.expect === "GREEN" && typeof law.run === "function"), `INVENTORY: bad law shape/expectation in ${file}`);
    modules.push({ file, family, laws: loaded.laws });
  }
  const ids = modules.flatMap((m) => m.laws.map((law) => law.id));
  assert(ids.length === 99 && new Set(ids).size === 99, "INVENTORY: global ids are not unique / total differs");
  return modules;
}

function loadAdapters(adapterDir = path.join(CONFORM, "adapters")) {
  const bundle = {}, absent = [];
  for (const family of [...REQUIRED, ...OPTIONAL]) {
    const filename = path.resolve(adapterDir, family + ".cjs");
    let adapter;
    try {
      adapter = require(filename);
    } catch (e) {
      // A missing dependency inside an existing adapter is an error, never an absent family.
      const exactMissing = e.code === "MODULE_NOT_FOUND" && !fs.existsSync(filename) &&
        String(e.message).split("\n")[0] === `Cannot find module '${filename}'`;
      if (!exactMissing) throw new Error(`ADAPTER-LOAD: ${family}: ${e.message}`);
      assert(OPTIONAL.includes(family), `ADAPTER-LOAD: required ${family} adapter is absent`);
      absent.push(family);
      continue;
    }
    assert(adapter && typeof adapter.create === "function", `ADAPTER-LOAD: ${family} exports no create()`);
    bundle[family] = (cfg, hooks) => adapter.create(cfg, hooks);
  }
  return { bundle, absent };
}

function checkArchivedGates(manifest, env, root = CONFORM) {
  assert(manifest.gatesVersion === 1 && Array.isArray(manifest.gates) &&
    sameSet(manifest.gates.map((g) => g.gate), Object.keys(GATE_COUNTS)), "ARCHIVED-GATES: expected exactly rig175 through rig184");
  const checked = {};
  const pin = (entry) => {
    assert(entry && typeof entry.path === "string" && /^gates\/inputs\/[^/\\]+$/.test(entry.path), "ARCHIVED-GATES: non-public artifact path");
    assert(/^[a-f0-9]{64}$/.test(entry.sha256), "ARCHIVED-GATES: malformed hash pin");
    const file = path.join(root, entry.path);
    assert(fs.existsSync(file) && fs.statSync(file).isFile(), `ARCHIVED-GATES: missing artifact ${entry.path}`);
    const actual = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    assert(actual === entry.sha256, `ARCHIVED-GATES: hash mismatch ${entry.path}`);
  };
  for (const gate of manifest.gates) {
    const result = gate.result;
    assert(result && result.pass === true && result.passed === GATE_COUNTS[gate.gate] && result.total === GATE_COUNTS[gate.gate],
      `ARCHIVED-GATES: declared count/pass mismatch ${gate.gate}`);
    assert(gate.clock === env.MEASURED_TEST_NOW && gate.tz === env.TZ, `ARCHIVED-GATES: clock/zone mismatch ${gate.gate}`);
    assert(Array.isArray(gate.inputs) && gate.inputs.length === (gate.gate === "rig184" ? 3 : 1), `ARCHIVED-GATES: input count differs ${gate.gate}`);
    gate.inputs.forEach(pin);
    pin(gate.impl);
    checked[gate.gate] = true;
  }
  return checked;
}

function checkCoverage(manifest, gates, coverage = require(path.join(CONFORM, "coverage/manifest.cjs"))) {
  const result = coverage.report(manifest, gates);
  assert(result.ok && result.uncovered.length === 0 && result.bad.length === 0, "COVERAGE: law ids or archived gate references differ");
  // The frozen coverage report calls the port section TESTED. Here it is metadata only; no port executes.
  assert(result.rows.filter((r) => r.port).length === 1, "COVERAGE: expected one port metadata declaration");
  return result;
}

function runPublicConformance(options = {}) {
  const env = options.env || process.env;
  const note = options.note || console.log;
  checkEnvironment(env, readJson(path.join(CONFORM, "oracle/manifest.json")));
  const manifest = readJson(path.join(CONFORM, "laws/manifest.json"));
  const modules = loadInventory(manifest);
  const { bundle, absent } = loadAdapters(options.adapterDir);
  // This milestone's expected adapter inventory is explicit, so a new family needs a reviewed update.
  assert(sameSet(absent, OPTIONAL), "ADAPTER-LOAD: expected only policy/progression absent at W0");
  const gates = checkArchivedGates(readJson(path.join(CONFORM, "gates/gates.json")), env);
  const coverage = checkCoverage(manifest, gates);
  const reference = Object.fromEntries([...REQUIRED, ...OPTIONAL].map((family) => [family,
    (cfg, hooks) => require(path.join(CONFORM, "reference", family + ".cjs")).create(cfg, hooks)]));
  const totals = { reference: 0, strong: 0, green: 0, red: 0, mutants: 0 };
  for (const item of modules) {
    const ref = runLaws(item.file, item.laws, { bundle: reference, quiet: true });
    assert(ref.green === item.laws.length && !ref.fail && !ref.errors && !ref.defects, `REFERENCE: ${item.file} is not all GREEN`);
    const mutants = runMutants(item.file, item.laws, reference, { quiet: true });
    assert(mutants.strong === item.laws.length && !mutants.weak && !mutants.errors && !mutants.none && !mutants.refFail &&
      mutants.rows.every((row) => row.mutants && row.mutants.length && row.mutants.every((m) => m.caught === true)),
    `MUTANTS: ${item.file} has a weak, missing or exceptional mutant`);
    const present = !!bundle[item.family];
    const laws = present ? item.laws : item.laws.map((law) => ({ ...law, expect: "RED" }));
    const product = runLaws(item.file, laws, { bundle, quiet: true });
    assert(!product.fail && !product.errors && !product.defects && (present ? product.green : product.red) === item.laws.length,
      `ADAPTERS: ${item.file} violates its ${present ? "GREEN" : "RED-as-specified"} expectation`);
    totals.reference += ref.green;
    totals.strong += mutants.strong;
    totals.green += product.green;
    totals.red += product.red;
    totals.mutants += mutants.rows.reduce((n, row) => n + row.mutants.length, 0);
    note(`PUBLIC-LAWS ${item.file}: ${ref.green} reference GREEN; ${mutants.strong} STRONG; ${product.green} adapter GREEN; ${product.red} RED-as-specified`);
  }
  assert(totals.reference === 99 && totals.strong === 99 && totals.green === 70 && totals.red === 29, "TOTALS: unexpected law/family totals");
  note("ARCHIVED-GATES VERIFIED: 10/10 identities, hashes, declared counts and clock; archived evidence only, rigs not re-executed");
  note(`COVERAGE-METADATA VERIFIED: ${coverage.rows.length} declarations; every law id covered; port declaration is NOT RUN here`);
  note(`PUBLIC-CONFORMANCE PASS: ${totals.reference} reference GREEN; ${totals.strong} STRONG (${totals.mutants} targeted mutants detected); ${totals.green} adapter GREEN; ${totals.red} RED-as-specified (policy/progression absent)`);
  note("NOT RUN HERE: private/full port oracle, sensitivity, full conformance selftest, release checks, real D1/HTTP/IndexedDB, physical phone/clock/30-day soak. This is not full-suite or milestone acceptance.");
  return { totals, gates: Object.keys(gates).length, coverage };
}

if (require.main === module) {
  try { runPublicConformance(); }
  catch (e) { console.error("PUBLIC-CONFORMANCE FAIL: " + e.message); process.exitCode = 1; }
}
module.exports = { CONFORM, FILES, GATE_COUNTS, checkEnvironment, loadInventory, loadAdapters, checkArchivedGates, checkCoverage, runPublicConformance };
