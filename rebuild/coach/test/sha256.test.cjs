"use strict";

/* Coach v1: tools.cjs takes its one digest (a proposal's id) through sha256.cjs so that it can ship in the page
   bundle. These rows hold that copy to node:crypto, to the client's own copy (the client recomputes the id and
   refuses one it cannot reproduce) and to tools.cjs's actual use of it, and they hold tools.cjs to having no Node
   import at all, which is what the page bundle needs. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { sha256Hex } = require("../sha256.cjs");

const INPUTS = ["", "abc", "earned/coach/proposal/v1{}", "\u00e9\u4e2d\ud83d\ude00", "x".repeat(1000), "a".repeat(55),
  "a".repeat(56), "a".repeat(63), "a".repeat(64), "a".repeat(65)];

test("SHA-1: the coach's SHA-256 equals node:crypto's on empty, ascii, unicode, long and block-edge inputs", () => {
  for (const input of INPUTS) {
    assert.equal(sha256Hex(input), crypto.createHash("sha256").update(input, "utf8").digest("hex"), JSON.stringify(input.slice(0, 20)));
  }
});

test("SHA-2: the function is rebuild/client/index.cjs's own, byte for byte", () => {
  const client = fs.readFileSync(path.join(__dirname, "..", "..", "client", "index.cjs"), "utf8");
  const mine = fs.readFileSync(path.join(__dirname, "..", "sha256.cjs"), "utf8");
  const a = client.indexOf("const rotr32 = (x, n) =>"), b = client.indexOf("const proposalDigest =");
  assert.ok(a > 0 && b > a, "the client's copy is where it was");
  assert.ok(mine.includes(client.slice(a, b).replace(/\s+$/, "")), "sha256.cjs is not the client's function");
});

test("SHA-3: tools.cjs takes the proposal id through it, and carries no Node import of its own", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "tools.cjs"), "utf8");
  assert.ok(src.includes('require("./sha256.cjs")'), "tools.cjs does not use sha256.cjs");
  assert.ok(src.includes('sha256Hex("earned/coach/proposal/v1" + JSON.stringify(obj))'), "the proposal digest moved");
  assert.equal(/require\(\s*["']node:/.test(src), false, "tools.cjs requires a Node module, which the page bundle refuses");
  for (const file of ["sha256.cjs", "coach-intents.cjs", "wave1-tools.cjs", "checkin-refusals.cjs", "engine-revision.cjs"]) {
    const code = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    assert.equal(/require\(\s*["']node:/.test(code), false, file + " requires a Node module");
  }
});
