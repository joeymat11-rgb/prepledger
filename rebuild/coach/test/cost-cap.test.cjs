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

/* THE HAPPY PATH IS NOT THE SHAPE EXAMPLE (C5 review round 1, C1). `good()` is a
   synthetic LIVE-shaped record: the example minus every annotation key. The
   example itself must never pass this gate, and the tests below prove it. */
const good = () => {
  const record = JSON.parse(JSON.stringify(example));
  for (const key of Object.keys(record)) if (key.charAt(0) === "_") delete record[key];
  return record;
};

/* An opt-in is a RECORD belonging to one named user (C4), never a boolean. */
const optInFor = (user) => ({
  user, accepted: true, accepted_at: "2030-02-01T09:00:00.000Z", screen_version: "coach-opt-in-v1",
  wording: "Your voice audio and the text of this conversation leave this phone and are sent to OpenAI's API "
    + "so it can answer you. Nothing is sent until you say yes here.",
});

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

/* C5 review round 1, C1 — RED at e576905: the verifier returned ok:true for the
   file that declares in its own first field that it is not a cap, and
   startLiveSession with it reached COACH_NO_LIVE_ADAPTER, i.e. straight past the
   one gate in front of spending. */
test("THE SHAPE EXAMPLE IS NOT A CAP: the file that says so is refused, and starts nothing", () => {
  assert.ok(example._note.includes("SHAPE ONLY"), "the example must say it is not a live record");

  const v = T.verifyCostCap(example, { now: NOW });
  assert.equal(v.ok, false, "cap.example.json passed the gate that stands in front of real money");
  assert.equal(v.code, T.CODES.COST_CAP_INVALID);
  assert.match(v.reason, /shape example/);

  /* and the session gate never gets far enough to discover that no adapter exists */
  const started = T.startLiveSession({ cap: example, now: NOW, optIn: optInFor("joe"), user: "joe" });
  assert.equal(started.started, false);
  assert.equal(started.code, T.CODES.COST_CAP_INVALID);
  assert.notEqual(started.code, "COACH_NO_LIVE_ADAPTER");

  /* it is the ANNOTATION that refuses it, not a hard-coded filename: any record
     carrying any underscore key is a document about a cap, not a cap */
  for (const key of ["_note", "_todo", "_"]) {
    const annotated = Object.assign(good(), { [key]: "anything at all" });
    const r = T.verifyCostCap(annotated, { now: NOW });
    assert.equal(r.ok, false, key + " passed");
    assert.equal(r.code, T.CODES.COST_CAP_INVALID);
  }
});

test("a complete, verified, fresh cap passes — and STILL starts nothing in this build", () => {
  const v = T.verifyCostCap(good(), { now: NOW });
  assert.equal(v.ok, true, v.reason || "");
  assert.equal(v.capUsdMonth, example.cap_usd_month);
  assert.equal(good()._note, undefined, "the happy path must not be the placeholder file");

  const noOptIn = T.startLiveSession({ cap: good(), now: NOW, user: "joe" });
  assert.equal(noOptIn.started, false);
  assert.equal(noOptIn.code, "COACH_OPT_IN_REQUIRED");

  const optedIn = T.startLiveSession({ cap: good(), now: NOW, optIn: optInFor("joe"), user: "joe" });
  assert.equal(optedIn.started, false);
  assert.equal(optedIn.code, "COACH_NO_LIVE_ADAPTER");
});

/* C5 review round 1, C4 — RED at e576905: `optIn: true` opened the gate for
   anybody and `user` was silently ignored. The ruling says "explicit opt-in for
   EACH user", "two named users only — Joe and Dad". */
test("the opt-in is PER USER: one person's yes never speaks for another", () => {
  const cap = good();

  /* a bare boolean is not an opt-in at all */
  const bare = T.startLiveSession({ cap, now: NOW, optIn: true });
  assert.equal(bare.code, "COACH_OPT_IN_REQUIRED");
  const bareWithUser = T.startLiveSession({ cap, now: NOW, optIn: true, user: "joe" });
  assert.equal(bareWithUser.code, "COACH_OPT_IN_REQUIRED");

  /* someone else's opt-in is not this user's */
  const borrowed = T.startLiveSession({ cap, now: NOW, optIn: optInFor("joe"), user: "dad" });
  assert.equal(borrowed.code, "COACH_OPT_IN_REQUIRED");
  assert.match(borrowed.reason, /never speaks for another/);

  /* no user at all, and a user nobody ruled on */
  for (const user of [undefined, null, "", "stranger", 1, { user: "joe" }]) {
    const r = T.startLiveSession({ cap, now: NOW, optIn: optInFor("joe"), user });
    assert.equal(r.code, "COACH_OPT_IN_REQUIRED", JSON.stringify(user) + " opened the gate");
  }

  /* each named user's own record works, and only their own */
  for (const user of T.NAMED_USERS) {
    assert.equal(T.startLiveSession({ cap, now: NOW, optIn: optInFor(user), user }).code, "COACH_NO_LIVE_ADAPTER");
  }
});

/* C5 review round 2, C9 / surviving mutant S2. DECISIONS:89 and the brief:
   "two named users only — Joe and Dad"; a third user needs a separate owner
   ruling. That was implemented and unproved — deleting the NAMED_USERS check
   killed no test, and a third person with a perfectly-formed opt-in of her own
   would have started a session. */
test("TWO NAMED USERS ONLY: a third user's own valid opt-in still refuses", () => {
  const cap = good();
  assert.deepEqual(T.NAMED_USERS.slice().sort(), ["dad", "joe"]);

  for (const stranger of ["mum", "sam", "Joe", "joe ", "guest"]) {
    /* her own record, matching in every respect — user, accepted, timestamp,
       screen version, and wording that names the transfer plainly */
    const hers = optInFor(stranger);
    assert.equal(hers.user, stranger);
    assert.equal(hers.accepted, true);
    const r = T.startLiveSession({ cap, now: NOW, optIn: hers, user: stranger });
    assert.equal(r.started, false);
    assert.equal(r.code, "COACH_OPT_IN_REQUIRED", stranger + " started a session without an owner ruling");
    assert.match(r.reason, /joe or dad/i);
  }

  /* and the two who are ruled on still work, so the test measures the roster and
     not a blanket refusal */
  assert.equal(T.startLiveSession({ cap, now: NOW, optIn: optInFor("joe"), user: "joe" }).code, "COACH_NO_LIVE_ADAPTER");
  assert.equal(T.startLiveSession({ cap, now: NOW, optIn: optInFor("dad"), user: "dad" }).code, "COACH_NO_LIVE_ADAPTER");
});

test("the opt-in record must carry the wording the user actually saw", () => {
  const cap = good();
  for (const [label, patch] of [
    ["not accepted", { accepted: false }],
    ["accepted is truthy, not true", { accepted: "yes" }],
    ["no timestamp", { accepted_at: "" }],
    ["unparseable timestamp", { accepted_at: "last Tuesday" }],
    ["no screen version", { screen_version: "" }],
    ["no wording at all", { wording: "" }],
    ["wording hides the transfer", { wording: "Turn on the voice coach for a better experience." }],
    ["wording names the audio but not that it leaves", { wording: "Your audio and text on this phone." }],
    ["wording names sending but not the phone", { wording: "Your audio and text are sent to OpenAI." }],
  ]) {
    const r = T.startLiveSession({ cap, now: NOW, optIn: Object.assign(optInFor("joe"), patch), user: "joe" });
    assert.equal(r.code, "COACH_OPT_IN_REQUIRED", label + " opened the gate");
    assert.ok(r.reason && r.reason.length > 5, label + " refused without a reason");
  }
  /* and the wording that does name it plainly is accepted */
  const words = optInFor("joe").wording;
  assert.match(words, /phone/i);
  assert.match(words, /audio/i);
  assert.match(words, /\btext\b/i);
  assert.match(words, /leave|sent/i);
});

test("there is no override: the gate takes no flag that skips it", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "tools.cjs"), "utf8");
  /* identifier-boundary, not substring: "enforces the date law" contains "force"
     and a grep that fires on that gets deleted rather than kept */
  for (const escape of ["skipCap", "force", "bypass", "allowUncapped", "ignoreCap", "uncapped"]) {
    const re = new RegExp("(^|[^A-Za-z0-9_])" + escape + "([^A-Za-z0-9_]|$)");
    assert.ok(!re.test(src), "tools.cjs carries an escape hatch: " + escape);
  }
  assert.ok(!/started:\s*true/.test(src), "nothing in this build may report a started live session");
});

test("no live model call and no network exists in this build", () => {
  for (const file of ["tools.cjs", "coach-text.cjs", "local-world.mjs"]) {
    const src = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    for (const forbidden of ["node:http", "node:https", "fetch(", "WebSocket", "api.openai.com", "OPENAI_API_KEY"]) {
      assert.ok(!src.includes(forbidden), file + " reaches the network via " + forbidden);
    }
  }
});
