"use strict";

/* ACCEPTANCE (d) — COST CAP.
 * "Cost cap present and verified on the account before the first live session."
 * The owner's hard spending-cap rule makes this a GATE, not a note: no verified
 * cap record, no live session, and there is no override argument anywhere.
 *
 * There is no live session in this build at all — startLiveSession() refuses
 * even a perfect cap, because no model adapter exists. That is deliberate: the
 * gate is proved before anything can spend. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const T = require("../tools.cjs");

const NOW = "2030-02-04T13:00:00.000Z";
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "cap.schema.json"), "utf8"));
const example = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "cap.example.json"), "utf8"));
const good = () => JSON.parse(JSON.stringify(example));

test("the schema and the verifier agree on what a cap record must carry", () => {
  assert.deepEqual(schema.required.slice().sort(), T.CAP_REQUIRED.concat(["verified"]).sort());
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.verified.const, true);
  for (const key of schema.required) assert.ok(key in schema.properties, key + " is required but undescribed");
});

test("the shape example satisfies its own schema", () => {
  for (const key of schema.required) assert.ok(example[key] !== undefined, "example lacks " + key);
  for (const key of Object.keys(example)) assert.ok(schema.properties[key], "example carries undeclared " + key);
  assert.ok(example._note.includes("SHAPE ONLY"), "the example must say it is not a live record");
});

test("NO CAP = REFUSE. An absent record is the default answer, not an edge case", () => {
  for (const nothing of [undefined, null, "", 0, []]) {
    const v = T.verifyCostCap(nothing, { now: NOW });
    assert.equal(v.ok, false);
    assert.ok(v.code === T.CODES.COST_CAP_ABSENT || v.code === T.CODES.COST_CAP_INVALID);
  }
  const started = T.startLiveSession({ now: NOW });
  assert.equal(started.started, false);
  assert.equal(started.code, T.CODES.COST_CAP_ABSENT);
});

test("a cap record must be verified, complete, fresh, and internally sane", () => {
  const bad = [
    ["unverified", { verified: false }],
    ["missing verifier", { verified_by: "" }],
    ["zero month cap", { cap_usd_month: 0 }],
    ["negative session cap", { cap_usd_session: -1 }],
    ["session cap above the month cap", { cap_usd_session: 999 }],
    ["unparseable timestamp", { verified_at: "last Tuesday" }],
    ["timestamp in the future", { verified_at: "2031-01-01T00:00:00.000Z" }],
    ["stale", { verified_at: "2029-01-01T00:00:00.000Z" }],
    ["price missing", { per_minute_usd: null }],
  ];
  for (const [label, patch] of bad) {
    const v = T.verifyCostCap(Object.assign(good(), patch), { now: NOW });
    assert.equal(v.ok, false, label + " was accepted");
    assert.equal(v.code, T.CODES.COST_CAP_INVALID, label);
    assert.ok(v.reason && v.reason.length > 5, label + " was refused without a reason");
  }
});

test("a cap record is a receipt, never a place to park a key", () => {
  const shapes = [
    "sk-ABCDEFGHIJKLMNOPQRSTUV", "ghp_ABCDEFGHIJKLMNOPQRST", "AKIAABCDEFGHIJKLMNOP",
    "xoxb-ABCDEFGHIJKL", "-----BEGIN RSA PRIVATE KEY-----",
    "eyJhbGciOiJIUzI1.eyJzdWIiOiIxMjM0.abc", "Bearer abcdefghijklmnopqrstuv",
    "AIzaABCDEFGHIJKLMNOPQRSTUVW", "npm_ABCDEFGHIJKLMNOPQRSTUVWXYZ12",
    "a".repeat(40),
  ];
  for (const shape of shapes) {
    const v = T.verifyCostCap(Object.assign(good(), { notes: shape }), { now: NOW });
    assert.equal(v.ok, false, "a record carrying " + shape.slice(0, 12) + "... was accepted");
    assert.match(v.reason, /credential-shaped/);
  }
});

test("a complete, verified, fresh cap passes — and STILL starts nothing in this build", () => {
  const v = T.verifyCostCap(good(), { now: NOW });
  assert.equal(v.ok, true, v.reason || "");
  assert.equal(v.capUsdMonth, example.cap_usd_month);

  const noOptIn = T.startLiveSession({ cap: good(), now: NOW });
  assert.equal(noOptIn.started, false);
  assert.equal(noOptIn.code, "COACH_OPT_IN_REQUIRED");

  const optedIn = T.startLiveSession({ cap: good(), now: NOW, optIn: true });
  assert.equal(optedIn.started, false);
  assert.equal(optedIn.code, "COACH_NO_LIVE_ADAPTER");
});

test("there is no override: the gate takes no flag that skips it", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "tools.cjs"), "utf8");
  for (const escape of ["skipCap", "force", "bypass", "allowUncapped", "ignoreCap"]) {
    assert.ok(!src.includes(escape), "tools.cjs carries an escape hatch: " + escape);
  }
  assert.ok(!/started:\s*true/.test(src), "nothing in this build may report a started live session");
});

test("no live model call and no network exists in this build", () => {
  for (const file of ["tools.cjs", "coach-text.cjs"]) {
    const src = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    for (const forbidden of ["node:http", "node:https", "fetch(", "WebSocket", "api.openai.com", "OPENAI_API_KEY"]) {
      assert.ok(!src.includes(forbidden), file + " reaches the network via " + forbidden);
    }
  }
});
