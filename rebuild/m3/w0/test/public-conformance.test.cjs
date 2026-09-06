"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const check = require("../public-conformance.cjs");
const json = (name) => JSON.parse(fs.readFileSync(path.join(check.CONFORM, name), "utf8"));
const env = { ...process.env, MEASURED_TEST_NOW: "2026-09-03", TZ: "America/New_York" };
delete env.CONFORM_ADAPTERS_DIR;
delete env.EARNED_CLIENT_DIR;
delete env.CONFORM_MUTATE_LAWS;
const script = path.resolve(__dirname, "../public-conformance.cjs");

test("the real public check passes with exact totals and declares exclusions", () => {
  const run = spawnSync(process.execPath, [script], { env, encoding: "utf8", timeout: 120000 });
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /PUBLIC-CONFORMANCE PASS: 99 reference GREEN; 99 STRONG \(\d+ targeted mutants detected\); 70 adapter GREEN; 29 RED-as-specified/);
  assert.match(run.stdout, /ARCHIVED-GATES VERIFIED: 10\/10/);
  assert.match(run.stdout, /private\/full port oracle, sensitivity, full conformance selftest, release checks/);
  assert.doesNotMatch(run.stdout, /SUITE CONSISTENT|SELFTEST PASS|SOAK-30 PASS/);
});

test("wrong/missing clock, timezone and redirecting product overrides fail closed", () => {
  const manifest = json("oracle/manifest.json");
  for (const change of [{ MEASURED_TEST_NOW: undefined }, { MEASURED_TEST_NOW: "2026-09-04" }, { TZ: "UTC" },
    { EARNED_CLIENT_DIR: os.tmpdir() }, { CONFORM_ADAPTERS_DIR: os.tmpdir() }, { CONFORM_MUTATE_LAWS: "delete:example" }])
    assert.throws(() => check.checkEnvironment({ ...env, ...change }, manifest), /ENVIRONMENT/);
  const run = spawnSync(process.execPath, [script], { env: { ...env, TZ: "UTC" }, encoding: "utf8" });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /PUBLIC-CONFORMANCE FAIL: ENVIRONMENT/);
});

test("adapter deletions and load failures never become permitted RED families", (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "earned-public-adapters-"));
  t.after(() => {
    const resolved = fs.realpathSync(temp), parent = fs.realpathSync(os.tmpdir());
    assert.equal(path.dirname(resolved), parent);
    assert.ok(path.basename(resolved).startsWith("earned-public-adapters-"));
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  const good = (family) => `module.exports = require(${JSON.stringify(path.join(check.CONFORM, "adapters", family + ".cjs"))});`;
  let index = 0;
  const make = (overrides) => {
    const dir = path.join(temp, String(index++));
    fs.mkdirSync(dir);
    for (const [file, body] of Object.entries({ "authority.cjs": good("authority"), "client.cjs": good("client"), ...overrides }))
      if (body !== null) fs.writeFileSync(path.join(dir, file), body);
    return dir;
  };
  assert.deepEqual(check.loadAdapters(make({})).absent, ["policy", "progression"]);
  for (const family of ["authority", "client"])
    assert.throws(() => check.loadAdapters(make({ [family + ".cjs"]: null })), new RegExp(`required ${family} adapter is absent`));
  for (const [file, body, pattern] of [
    ["authority.cjs", "throw new Error('injected load fault');", /injected load fault/],
    ["client.cjs", "module.exports = { create: (", /ADAPTER-LOAD/],
    ["policy.cjs", "require('./definitely-missing-transitive.cjs');", /ADAPTER-LOAD: policy/],
    ["progression.cjs", "module.exports = {};", /exports no create/],
  ]) assert.throws(() => check.loadAdapters(make({ [file]: body })), pattern);
});

test("inventory detects a deleted, renamed, duplicated or relocated law and load failure", () => {
  const manifest = json("laws/manifest.json");
  const file = "laws/sheet-B-client.cjs";
  const load = (name) => require(path.join(check.CONFORM, name));
  assert.equal(check.loadInventory(manifest).length, 5);
  for (const mutate of [
    (laws) => laws.slice(1),
    (laws) => laws.map((law, i) => i ? law : { ...law, id: law.id + "-renamed" }),
    (laws) => [laws[1], ...laws.slice(1)],
    (laws) => laws.map((law, i) => i ? law : { ...law, id: load("laws/sheet-A-authority.cjs").laws[0].id }),
  ]) assert.throws(() => check.loadInventory(manifest, (name) => name === file ? { laws: mutate(load(name).laws) } : load(name)), /INVENTORY/);
  assert.throws(() => check.loadInventory(manifest, () => { throw new SyntaxError("bad law parse"); }), /LAW-LOAD/);
  const bad = structuredClone(manifest);
  bad.laws[file].count--;
  assert.throws(() => check.loadInventory(bad), /INVENTORY/);
  const missing = structuredClone(manifest);
  delete missing.laws[file];
  assert.throws(() => check.loadInventory(missing), /law file set differs/);
});

test("archived evidence rejects altered counts, status, clock, hashes, inventory and paths", () => {
  const original = json("gates/gates.json");
  assert.equal(Object.keys(check.checkArchivedGates(original, env)).length, 10);
  for (const mutate of [
    (g) => { g.gates.pop(); },
    (g) => { g.gates[0].gate = g.gates[1].gate; },
    (g) => { g.gates[0].result.passed--; },
    (g) => { g.gates[0].result.passed++; g.gates[0].result.total++; },
    (g) => { g.gates[0].result.pass = false; },
    (g) => { g.gates[0].tz = "UTC"; },
    (g) => { g.gates[0].clock = "2026-09-04"; },
    (g) => { g.gates[0].inputs = []; },
    (g) => { g.gates[0].inputs[0].sha256 = "0".repeat(64); },
    (g) => { g.gates[0].impl.sha256 = "0".repeat(64); },
    (g) => { g.gates[0].inputs[0].path = "private/live.json"; },
  ]) {
    const altered = structuredClone(original);
    mutate(altered);
    assert.throws(() => check.checkArchivedGates(altered, env), /ARCHIVED-GATES/);
  }
});

test("coverage metadata fails on an unknown law or missing verified gate", () => {
  const manifest = json("laws/manifest.json");
  const gates = check.checkArchivedGates(json("gates/gates.json"), env);
  assert.equal(check.checkCoverage(manifest, gates).ok, true);
  delete gates.rig175;
  assert.throws(() => check.checkCoverage(manifest, gates), /COVERAGE/);
  const altered = structuredClone(manifest);
  altered.laws["laws/sheet-B-client.cjs"].ids[0] += "-unknown";
  assert.throws(() => check.checkCoverage(altered, Object.fromEntries(Object.keys(check.GATE_COUNTS).map((id) => [id, true]))), /COVERAGE/);
});
