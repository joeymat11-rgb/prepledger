"use strict";
// Exact whole-range fidelity and prior-module immutability, not a replacement law.
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process"), { createHash } = require("node:crypto");
const ROOT = path.resolve(__dirname, "../../.."), BASE = "f2f745847ced09524282e74c5b1d645a6fe30da0";
const git = args => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 8 * 1024 * 1024, windowsHide: true });
const source = git(["show", "fe516c1:src/app.jsx"]);
assert.equal(createHash("sha1").update("blob " + Buffer.byteLength(source) + "\0").update(source).digest("hex"), "f98671d823f0d8cd83e730cdd930afe5f5e7b628");
assert.equal(fs.readFileSync(path.join(ROOT, "src/app.jsx"), "utf8"), source);
const candidate = fs.readFileSync(path.resolve(__dirname, "../merge.cjs"), "utf8");
const start = "// BEGIN frozen src/app.jsx @ fe516c1:13371-14452 (only _stampCorr clock injection).\n";
const end = "// END frozen src/app.jsx @ fe516c1:13371-14452.";
assert.equal(candidate.split(start).length, 2); assert.equal(candidate.split(end).length, 2);
const frozenRange = source.split("\n").slice(13370, 14452).join("\n");
assert.equal(frozenRange.split("new Date().toISOString()").length, 2);
assert.equal(candidate.slice(candidate.indexOf(start) + start.length, candidate.indexOf(end)),
  frozenRange.replace("new Date().toISOString()", "clock.nowISO()") + "\n");
for (const file of ["dates", "constants", "seed", "plan", "progression", "sleep", "energy", "policy", "today", "volume", "migrate", "oracle-shim"]) {
  const relative = "rebuild/engine/" + file + ".cjs";
  assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);
}
const oldIndex = git(["show", BASE + ":rebuild/engine/index.cjs"]);
assert.equal(fs.readFileSync(path.resolve(__dirname, "../index.cjs"), "utf8"),
  oldIndex.replace('  require("./migrate.cjs"),', '  require("./migrate.cjs"),\n  require("./merge.cjs"),'));
const NativeDate = globalThis.Date;
const { createEngine } = require("../index.cjs");
assert.strictEqual(globalThis.Date, NativeDate);
const clock = { today: () => "2026-09-03", hour: () => 12, dow: () => 4,
  nowISO: () => "2026-09-03T16:00:00.000Z", nowMs: () => 1788451200000 };
const A = createEngine({ clock }), B = createEngine({ clock });
assert.equal(A.mergeState, A.__test.mergeState); assert.equal(A.migrate, A.__test.migrate);
assert.equal(A.__test.records, undefined);
for (const name of ["MERGE_KEYED", "MERGE_ARR", "MERGE_MULTI", "MERGE_OBJ", "CACHE_RIDERS", "PLAN_POLICY_SCALARS", "CORR_KINDS"]) {
  assert.notStrictEqual(A[name], B[name], name + " instance ownership");
}
assert.notStrictEqual(A.MERGE_KEYED.exercises, B.MERGE_KEYED.exercises);
assert.notStrictEqual(A.MERGE_KEYED.exercises.keyOf, B.MERGE_KEYED.exercises.keyOf);
assert.notStrictEqual(A.mergeState, B.mergeState);
const original = JSON.stringify(B.MERGE_OBJ);
A.MERGE_OBJ.push("invented-only-A");
assert.equal(JSON.stringify(B.MERGE_OBJ), original);
assert.strictEqual(globalThis.Date, NativeDate);
console.log("MERGE SOURCE PASS: complete 1082-line frozen range / 42 declarations; only _stampCorr clock substitution; pass order and comments exact");
console.log("PRIOR SOURCE PASS: modules 1–5 and oracle-shim byte-identical to accepted base; index adds merge last; per-engine maps and callable candidate exports");
