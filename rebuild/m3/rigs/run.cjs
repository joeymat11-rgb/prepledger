"use strict";
const CASES = ["AUTH-D1", "HTTP-190"];
const ENVIRONMENTS = ["local", "synthetic-remote", "owner-phone", "isolated-restore"];

async function authD1() {
  const { makeHarness } = require("./test-adapter.cjs");
  const { runMapped } = require("./sheet-a-async.cjs");
  const { runRig191 } = require("./rig191.cjs");
  const harness = await makeHarness();
  let mapped;
  try { mapped = await runMapped(harness.bundle); }
  finally { await harness.close(); }
  if (mapped.green !== 34 || mapped.errors || mapped.total !== 34) {
    for (const row of mapped.rows.filter(row => !row.ok)) console.log(`AUTH-LAW DETAIL ${row.id}: ${row.detail}`);
    throw new Error(`${mapped.green}/34 mapped laws GREEN on local D1; ${mapped.errors} HARNESS_ERROR`);
  }
  const mutations = await runRig191({ makeHarness });
  if (!mutations.ok) {
    for (const row of mutations.rows.filter(row => !row.effective)) console.log(`RIG191 DETAIL ${row.name}: ${row.detail}`);
    throw new Error(`rig191 ${mutations.effective}/10 EFFECTIVE breaks`);
  }
  const race = await require("./race-d1.cjs").run();
  if (!race.ok) throw new Error("D1 100-invocation race or atomic crash cuts failed");
  return "34/34 mapped laws GREEN on local D1 + rig191 10/10 EFFECTIVE breaks";
}
async function http190() {
  const result = await require("./rig190.cjs").run({ quiet: true });
  if (result.passed !== 5 || result.scenarios !== 5 || result.http !== "real-local") throw new Error("Incomplete real local HTTP interop coverage");
  return "5/5 over real local HTTP with the C6 cuts";
}
async function main(argv = process.argv.slice(2)) {
  let environment = "local", selected = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--env" && argv[i + 1]) environment = argv[++i];
    else if (argv[i] === "--case" && argv[i + 1]) selected = argv[++i];
    else throw new Error("Usage: node rebuild/m3/rigs/run.cjs [--case AUTH-D1|HTTP-190] --env local|synthetic-remote|owner-phone|isolated-restore");
  }
  if (!ENVIRONMENTS.includes(environment)) throw new Error("Unknown environment: " + environment);
  if (selected && !CASES.includes(selected)) throw new Error("Unknown case: " + selected);
  const cases = selected ? [selected] : CASES, rows = [];
  let buildFailure = null;
  if (environment === "local") {
    try { await require("../w5/build.cjs").buildCore(); }
    catch (error) { buildFailure = "CORE_BUILD_FAILED: " + String(error.message).replace(/[\r\n]+/g, " "); }
  }
  for (const name of cases) {
    let status, detail;
    if (environment === "synthetic-remote") { status = "BLOCKED"; detail = "W4 remote database not yet created"; }
    else if (environment === "owner-phone") { status = "PENDING"; detail = "Witnessed owner-phone actions and machine-readable exports required"; }
    else if (environment === "isolated-restore") { status = "BLOCKED"; detail = "Isolated restore database and recovery evidence not yet provisioned"; }
    else if (buildFailure) { status = "FAIL"; detail = buildFailure; }
    else {
      try { detail = await (name === "AUTH-D1" ? authD1() : http190()); status = "PASS"; }
      catch (error) { status = "FAIL"; detail = String(error.message).replace(/[\r\n]+/g, " "); }
    }
    rows.push({ name, status, detail });
    console.log(`${name} ${status} (${detail})`);
  }
  const count = status => rows.filter(row => row.status === status).length;
  console.log(`run.cjs SUMMARY ${environment}: ${count("PASS")} PASS / ${count("FAIL")} FAIL / ${count("BLOCKED")} BLOCKED / ${count("PENDING")} PENDING`);
  const exitCode = count("FAIL") ? 1 : count("BLOCKED") || count("PENDING") ? 2 : 0;
  process.exitCode = exitCode;
  return { rows, exitCode };
}
module.exports = { main, authD1, http190 };
if (require.main === module) main().catch(error => { console.error("run.cjs FAIL " + error.message); process.exitCode = 1; });
