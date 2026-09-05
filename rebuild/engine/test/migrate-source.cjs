"use strict";
// No parser dependency: each generated source marker delimits one entire copied
// top-level declaration. Compare it with the immutable git blob, not a fixture.
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process"), { createHash } = require("node:crypto");
const ROOT = path.resolve(__dirname, "../../.."), FILE = path.resolve(__dirname, "../migrate.cjs");
const git = args => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
const source = git(["show", "fe516c1:src/app.jsx"]);
const blob = createHash("sha1").update("blob " + Buffer.byteLength(source) + "\0").update(source).digest("hex");
assert.equal(blob, "f98671d823f0d8cd83e730cdd930afe5f5e7b628");
assert.equal(fs.readFileSync(path.join(ROOT, "src/app.jsx"), "utf8"), source);
const lines = source.split("\n"), candidate = fs.readFileSync(FILE, "utf8");
const marker = /\/\/ Copied from frozen src\/app\.jsx @ fe516c1:(\d+)-(\d+)\.\n/g;
const matches = [...candidate.matchAll(marker)];
let rewrites = 0, previous = 0, copiedLines = 0;
const names = [];
for (let i = 0; i < matches.length; i++) {
  const match = matches[i], start = +match[1], end = +match[2];
  assert.ok(start > previous, "source file order"); previous = start;
  const sourceLines = lines.slice(start - 1, end);
  // Exact AST end columns on the two one-line declarations with trailing
  // explanatory comments (outside their function bodies) in the pinned source.
  const endColumn = { 13913: 108, 13926: 254 }[start];
  if (endColumn) sourceLines[sourceLines.length - 1] = sourceLines.at(-1).slice(0, endColumn);
  let expected = sourceLines.join("\n");
  const name = /^(?:function|const|let)\s+([\w$]+)/.exec(expected)?.[1];
  assert.ok(name); names.push(name); copiedLines += end - start + 1;
  if (name === "_freshId") {
    expected = 'function _freshId(prefix) { if (!ids || typeof ids.fresh !== "function") throw new TypeError("An injected ids.fresh() is required for new engine identities"); return ids.fresh(prefix || ""); }';
    rewrites++;
  } else if (["migrate", "_stampCorr"].includes(name)) {
    assert.equal(expected.split("new Date().toISOString()").length, 2);
    expected = expected.replace("new Date().toISOString()", "clock.nowISO()"); rewrites++;
  }
  const from = match.index + match[0].length;
  const to = i + 1 < matches.length ? matches[i + 1].index : candidate.lastIndexOf("\nreturn {") + 1;
  assert.equal(candidate.slice(from, to), expected + "\n\n", "exact declaration " + name);
}
assert.equal(rewrites, 3);
const patchNames = names.filter(n => /^patchV\d+$/.test(n));
assert.equal(patchNames.length, 57); assert.equal(new Set(patchNames).size, 57);
assert.ok(candidate.includes("const localStorage = drafts;"));
// Earlier modules retain all original source/injection/cache bytes.
for (const file of ["dates", "constants", "seed", "plan", "progression", "sleep", "energy", "policy", "today", "volume", "oracle-shim"]) {
  const relative = "rebuild/engine/" + file + ".cjs";
  assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]), "prior module bytes " + file);
}
const { createEngine } = require("../index.cjs");
const clock = { today: () => "2026-09-03", hour: () => 12, nowISO: () => "2026-09-03T16:00:00.000Z", nowMs: () => 1788451200000 };
const A = createEngine({ clock }), B = createEngine({ clock });
assert.deepEqual(A.PATCHES.map(row => row[0]), Array.from({ length: 57 }, (_, i) => i + 4));
for (const [n, patch] of A.PATCHES) assert.equal(patch, A["patchV" + n]);
assert.equal(A.migrate, A.__test.migrate); assert.equal(A.__test.records, undefined);
assert.notEqual(A.PATCHES, B.PATCHES); assert.notEqual(A.SEED, B.SEED);
assert.notEqual(A.SEED.insertions, B.SEED.insertions);
assert.notEqual(A.migrate, B.migrate);
console.log("MIGRATE SOURCE PASS: " + names.length + " exact declarations / " + copiedLines + " source lines; three authorized ID/instant rewrites; 57 patches in source order with ascending table");
console.log("PRIOR SOURCE PASS: all modules 1–4 and oracle-shim byte-identical to accepted base; independent seed/patch/function identities; candidate migrate directly exported, records absent");
