"use strict";

/* C6 Part A, checks A1 and A2: THE PARITY ACCEPTANCE, which is the whole point.
 *
 *   "A scripted transcript and the equivalent taps produce the same op bytes."
 *
 * Byte equality, not deep equality: key order is part of the claim, because the
 * op is the athlete's record and two readers must see the same bytes.
 *
 * A2 goes further and writes both through the REAL durable path: createSetupHost
 * over the accepted local era, two separate installations, the same lease rules
 * and the same one-op rule. That is what makes this a rehearsal rather than a
 * unit test. */

const test = require("node:test");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const O = require("../onboarding-tools.cjs");
const X = require("../onboarding-text.cjs");

const DAY = "2030-02-04";
const EFFECTIVE = { local_date: DAY, local_time: "13:00", utc_offset: "-05:00" };
const SCRIPT = X.loadScript();
const FIXTURES = SCRIPT.fixtures;
const COMPLETE = FIXTURES.filter((f) => f.complete);
const BLOCKED = FIXTURES.filter((f) => !f.complete);

async function modules() {
  const model = (await import("../../m3/w7-preview/today/setup-model.mjs")).default;
  const catalogue = await import("../../m3/w7-preview/today/exercise-catalogue.mjs");
  const commands = await import("../../m3/w7-preview/today/setup-commands.mjs");
  return { model, catalogue, commands };
}
const recordingHost = () => {
  const ops = [];
  return { ops, async save(setup, tags) {
    if (ops.length) return { ok: false, state: 0, code: "SETUP_ALREADY_RECORDED", copy: null, op_id: null };
    ops.push({ setup, tags });
    return { ok: true, state: 0, code: null, copy: null, op_id: "op-dev-A-" + ops.length };
  } };
};

/* STEP 1: the screens' own setters, then document(), then prepare(). */
async function byTap(fixture, m) {
  const setup = m.model.createSetupModel({ today: DAY });
  const built = X.driveByTap(setup, fixture, { catalogue: m.catalogue });
  if (!built.ok) return { built, action: null };
  const action = m.commands.prepare({ action: m.commands.ACTION,
    input: { setup: built.setup, tags: built.tags, effective: EFFECTIVE } });
  return { built, action };
}

/* STEP 2: the seven tools from the SAME fixture; submit calls the same prepare(). */
async function byVoice(fixture, m, host) {
  const setup = m.model.createSetupModel({ today: DAY });
  const tools = O.createOnboardingTools({ setup, catalogue: m.catalogue, model: m.model,
    commands: m.commands, effective: EFFECTIVE, host: host || recordingHost() });
  const run = await X.driveByVoice(tools, fixture);
  return { run, tools, setup,
    built: run.review.document ? { ok: true, setup: run.review.document.setup, tags: run.review.document.tags } : null,
    action: run.submit.ok ? run.submit.action : null };
}

/* ------------------------------------------------- A1, step 1 to 3, x6 ---- */

for (const fixture of COMPLETE) {
  test("A1 " + fixture.id + ": the spoken op and the tapped op are the SAME BYTES", async () => {
    const m = await modules();
    const tap = await byTap(fixture, m);
    const voice = await byVoice(fixture, m);
    assert.ok(tap.action, fixture.id + " did not complete by tap");
    assert.ok(voice.action, fixture.id + " did not complete by voice: "
      + JSON.stringify(voice.run.submit.unavailable || {}));

    /* THE CLAIM, byte for byte, key order included */
    assert.equal(JSON.stringify(voice.action.payload), JSON.stringify(tap.action.payload));
    /* and the whole envelope, so a reordered `effective` is caught too */
    assert.equal(JSON.stringify(voice.action), JSON.stringify(tap.action));
    /* the payload really is the three-member A4b shape, not an empty object */
    assert.deepEqual(Object.keys(tap.action.payload), ["profile", "setup", "tags"]);
    assert.equal(tap.action.payload.profile, m.commands.PROFILE);
  });

  test("A1 " + fixture.id + ": validate() is true for BOTH, on the envelope each one built", async () => {
    const m = await modules();
    const tap = await byTap(fixture, m);
    const voice = await byVoice(fixture, m);
    const envelope = (action) => Object.assign({}, action, {
      athlete_id: "ath-1", causal_parents: [], effective: action.effective });
    assert.equal(m.commands.validate(envelope(tap.action), () => null), true, "the tapped op does not validate");
    assert.equal(m.commands.validate(envelope(voice.action), () => null), true, "the spoken op does not validate");
  });

  test("A1 " + fixture.id + ": the coach's DOCUMENT is the screens' document, byte for byte", async () => {
    const m = await modules();
    const tap = await byTap(fixture, m);
    const voice = await byVoice(fixture, m);
    /* THE WHOLE SNAPSHOT, key order included. Comparing the two members one at a
       time would let the coach reorder its own document and still pass, which is
       mutant C2: the athlete hears this read back, and two readers of it must
       see the same bytes. */
    assert.equal(JSON.stringify(voice.run.review.document),
      JSON.stringify({ setup: tap.built.setup, tags: tap.built.tags }));
    assert.equal(JSON.stringify(voice.built.setup), JSON.stringify(tap.built.setup));
    assert.equal(JSON.stringify(voice.built.tags), JSON.stringify(tap.built.tags));
    /* and the two numbers no tool can set are Earned's, on both paths */
    assert.equal(tap.built.setup.exercises[0].sets, m.model.STANDARD_SETS);
    assert.equal(voice.built.setup.exercises[0].sets, m.model.STANDARD_SETS);
    assert.equal(voice.built.setup.exercises[0].hi, m.model.STANDARD_HI);
  });
}

/* ------------------------------------------------------- the blocked two -- */

for (const fixture of BLOCKED) {
  test("A7 " + fixture.id + ": both paths refuse, and they name the SAME gaps", async () => {
    const m = await modules();
    const tap = await byTap(fixture, m);
    const voice = await byVoice(fixture, m);
    assert.equal(tap.built.ok, false, fixture.id + " completed by tap");
    assert.equal(voice.run.submit.ok, false, fixture.id + " completed by voice");
    assert.equal(voice.run.submit.unavailable.code, O.C6_CODES.SETUP_INCOMPLETE);
    /* the same sentences, from setup-model's own missing() */
    const tapCopy = tap.built.missing.map((x) => x.copy);
    const voiceCopy = voice.run.review.values.missing.map((x) => x.display);
    assert.deepEqual(voiceCopy, tapCopy, fixture.id + " named different gaps");
    for (const code of fixture.expectMissing || []) {
      assert.ok(voice.run.review.missingCodes.includes(code), fixture.id + " lost " + code);
    }
    /* and nothing was written on either path */
    assert.equal(voice.tools.ops(), 0);
  });
}

test("A12 across every fixture: one op for a complete transcript, zero for a blocked one", async () => {
  const m = await modules();
  let written = 0, refused = 0;
  for (const fixture of FIXTURES) {
    const host = recordingHost();
    const voice = await byVoice(fixture, m, host);
    if (fixture.complete) { assert.equal(host.ops.length, 1, fixture.id); written += 1; }
    else { assert.equal(host.ops.length, 0, fixture.id); refused += 1; }
  }
  assert.equal(written, COMPLETE.length);
  assert.equal(refused, BLOCKED.length);
  assert.ok(written >= 6, "the brief's floor is six completing fixtures");
});

test("the fixtures cover what the brief asks them to cover", () => {
  const ids = FIXTURES.map((f) => f.id);
  for (const wanted of ["two_day", "four_day", "free_text_muscle", "uneven_rungs",
    "skipped_priority", "inc_override", "unnamed_exercise", "unknown_first"]) {
    assert.ok(ids.includes(wanted), "no fixture for " + wanted);
  }
  assert.ok(FIXTURES.find((f) => f.days.length === 2), "no two-day week");
  assert.ok(FIXTURES.find((f) => f.days.length === 4), "no four-day week");
  assert.ok(FIXTURES.find((f) => (f.exercises || []).some((e) => e.rungs)), "no uneven rung list");
  assert.ok(FIXTURES.find((f) => (f.exercises || []).some((e) => e.mg_other)), "no free-text muscle");
  assert.ok(FIXTURES.find((f) => (f.priorities || []).length === 0), "no skipped priority");
  assert.ok(FIXTURES.find((f) => (f.exercises || []).some((e) => e.inc && e.inc !== "")), "no step override");
});

/* --------------------------- A2: the SAME durable path, two installations -- */

/* Nothing is stubbed here. createSetupHost opens a real sealed IndexedDB
   installation through the accepted local era, mints its own lease and writes
   through the accepted client's producer-injected command. Two separate
   installations, one fed by taps and one by the transcript, and the STORED bytes
   are compared. fake-indexeddb resolves from rebuild/m3/w6's own node_modules
   through support.mjs, exactly as the A2, C4 and C5 suites reach it. */
async function installation(label) {
  const support = await import("../../m3/w6/test/support.mjs");
  const gymHost = await import("../../m3/w7-preview/today/gym-host.mjs");
  const setupHost = await import("../../m3/w7-preview/today/setup-host.mjs");
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const deviceKeys = { kid: gymHost.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
  const fault = support.faultDatabase();
  const host = await setupHost.createSetupHost({ day: DAY, indexedDB: fault.indexedDB,
    crypto: webcrypto, deviceKeys,
    databaseName: "earned-c6-" + label, namespace: "earned-c6/" + label });
  return { host, close: () => { try { host.close(); } catch {} } };
}
/* The stored op, read back out of the generation the host just authenticated. */
const storedPayload = (rows) => JSON.stringify({ profile: rows[0].profileSeen, setup: rows[0].setup, tags: rows[0].tags });

for (const fixture of COMPLETE.slice(0, 2)) {
  test("A2 " + fixture.id + ": tapped and spoken write IDENTICAL bytes through createSetupHost", async () => {
    const m = await modules();
    const tapInstall = await installation("tap-" + fixture.id);
    const voiceInstall = await installation("voice-" + fixture.id);
    try {
      /* nothing is set up on either installation yet */
      assert.equal(await tapInstall.host.enrolled(), false);
      assert.equal(await voiceInstall.host.enrolled(), false);

      /* path one: the screens' own setters, saved the way the Start button saves */
      const tap = await byTap(fixture, m);
      assert.ok(tap.built.ok, fixture.id + " did not complete by tap");
      const tapSaved = await tapInstall.host.save(tap.built.setup, tap.built.tags);
      assert.equal(tapSaved.ok, true, JSON.stringify(tapSaved));

      /* path two: the seven tools, submit writing through the same host kind */
      const voice = await byVoice(fixture, m, voiceInstall.host);
      assert.equal(voice.run.submit.ok, true, JSON.stringify(voice.run.submit.unavailable || {}));

      const tapRows = await tapInstall.host.all();
      const voiceRows = await voiceInstall.host.all();
      assert.equal(tapRows.length, 1, "the tapped installation holds more than one setup");
      assert.equal(voiceRows.length, 1, "the spoken installation holds more than one setup");

      /* THE CLAIM: the same stored bytes, key order included */
      assert.equal(JSON.stringify(voiceRows[0].setup), JSON.stringify(tapRows[0].setup));
      assert.equal(JSON.stringify(voiceRows[0].tags), JSON.stringify(tapRows[0].tags));
      assert.equal(voiceRows[0].date, tapRows[0].date);
      /* and each really is the document the athlete answered */
      assert.equal(tapRows[0].setup.athlete_label, fixture.name);
      assert.equal(voiceRows[0].setup.athlete_label, fixture.name);
      assert.equal(voiceRows[0].setup.split.from, DAY);

      /* A13 on the real path: first run happens once, on both */
      assert.equal(await voiceInstall.host.enrolled(), true);
      const again = await voiceInstall.host.save(voice.built.setup, voice.built.tags);
      assert.equal(again.ok, false);
      assert.equal(again.code, "SETUP_ALREADY_RECORDED");
      assert.equal((await voiceInstall.host.all()).length, 1);
    } finally { tapInstall.close(); voiceInstall.close(); }
  });
}

test("A2 a spoken transcript ABANDONED before submit leaves the installation empty", async () => {
  const m = await modules();
  const install = await installation("abandoned");
  try {
    const setup = m.model.createSetupModel({ today: DAY });
    const tools = O.createOnboardingTools({ setup, catalogue: m.catalogue, model: m.model,
      commands: m.commands, effective: EFFECTIVE, host: install.host });
    const fixture = COMPLETE[0];
    await tools.dispatch("set_name", { name: fixture.name, confirmed: true }, "turn-1");
    await tools.dispatch("set_days", { days: fixture.days, confirmed: true }, "turn-2");
    await tools.dispatch("review", {}, "turn-3");
    assert.equal(await install.host.enrolled(), false, "a half-finished conversation enrolled an athlete");
    assert.equal((await install.host.all()).length, 0);
    assert.equal(tools.ops(), 0);
  } finally { install.close(); }
});

test("A2 the durable op is the producer's own envelope, not something the coach shaped", async () => {
  const m = await modules();
  const install = await installation("envelope");
  try {
    const fixture = COMPLETE[0];
    const voice = await byVoice(fixture, m, install.host);
    assert.equal(voice.run.submit.ok, true);
    const raw = (await install.host.repository.load()).generation.collections.ops;
    const ops = Object.values(raw).filter((op) => op && op.payload && op.payload.profile === m.commands.PROFILE);
    assert.equal(ops.length, 1, "the transcript wrote more than one operation");
    const op = ops[0];
    assert.equal(op.kind, "fact");
    assert.equal(op.class, "event");
    assert.deepEqual(Object.keys(op.payload), ["profile", "setup", "tags"]);
    assert.equal(op.effective.local_date, DAY);
    /* the producer re-checks its own envelope, and it passes */
    assert.equal(m.commands.validate(op, () => null), true);
    /* the bytes the coach prepared are the bytes on disk */
    assert.equal(JSON.stringify(op.payload.setup), JSON.stringify(voice.action.payload.setup));
    assert.equal(JSON.stringify(op.payload.tags), JSON.stringify(voice.action.payload.tags));
  } finally { install.close(); }
});

void storedPayload;
