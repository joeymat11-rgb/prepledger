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
/* The raw ARGUMENTS are kept, not just what they decode to: since A4b merged
   (:149) the screens call save() with one envelope and envelopeOf() accepts the
   older two-argument spelling too, so only the argument list itself can show
   which of the two the coach took. `setup`/`tags` are then taken apart by the
   PRODUCER's own envelopeOf, never by a second copy of that rule living here. */
const recordingHost = (envelopeOf) => {
  const ops = [];
  return { ops, async save(...args) {
    if (ops.length) return { ok: false, state: 0, code: "SETUP_ALREADY_RECORDED", copy: null, op_id: null };
    const carried = envelopeOf ? envelopeOf(args[0], args[1]) : { setup: args[0], tags: args[1] };
    ops.push({ args, setup: carried.setup, tags: carried.tags });
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

/* C6A review round 1, C1. A COUNTING SPY on `prepare`. Byte equality alone does
   not prove the producer was USED: a hand-built payload with the same key order
   passes it, which is the brief's own mutant C1 in faithful form and it survived.
   The spy makes producer identity observable, so `submit` building its own
   envelope now fails on the count even when the bytes match. */
function spyOn(commands) {
  const calls = [];
  const wrapped = Object.assign(Object.create(null), commands, {
    prepare(request) {
      const action = commands.prepare(request);
      calls.push({ request, action });
      return action;
    },
  });
  return { commands: wrapped, calls };
}

/* STEP 2: the seven tools from the SAME fixture; submit calls the same prepare(). */
async function byVoice(fixture, m, host) {
  const setup = m.model.createSetupModel({ today: DAY });
  const spy = spyOn(m.commands);
  const recorder = host || recordingHost(m.commands.envelopeOf);
  const tools = O.createOnboardingTools({ setup, catalogue: m.catalogue, model: m.model,
    commands: spy.commands, effective: EFFECTIVE, host: recorder });
  const run = await X.driveByVoice(tools, fixture);
  return { run, tools, setup, prepareCalls: spy.calls, recorder,
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

    /* C6A C1: PRODUCER IDENTITY, not just byte equality. `submit` called the
       accepted producer exactly once, and the envelope it returned is the
       envelope the coach handed on. A hand-built payload passes the bytes and
       fails here, which is the point. */
    assert.equal(voice.prepareCalls.length, 1, "submit did not call prepare exactly once");
    assert.equal(voice.prepareCalls[0].action, voice.action, "submit returned an envelope prepare did not build");
    assert.equal(voice.prepareCalls[0].request.action, m.commands.ACTION);
    assert.deepEqual(Object.keys(voice.prepareCalls[0].request), ["action", "input"]);
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
    const host = recordingHost(m.commands.envelopeOf);
    const voice = await byVoice(fixture, m, host);
    if (fixture.complete) { assert.equal(host.ops.length, 1, fixture.id); written += 1; }
    else { assert.equal(host.ops.length, 0, fixture.id); refused += 1; }
  }
  assert.equal(written, COMPLETE.length);
  assert.equal(refused, BLOCKED.length);
  assert.ok(written >= 6, "the brief's floor is six completing fixtures");
});

/* RE-PIN onto :149. A4b merged with the tags handling moved off
   today-bindings.mjs into the producer (setup-commands.mjs envelopeOf) and
   setup-host.mjs, and setup-app.mjs:524 now hands today-entry.mjs:141 ONE
   envelope. envelopeOf() still accepts the older two-argument spelling, so a
   coach left on the old call keeps passing every byte check while no longer
   making the call the screen makes. Only the argument list shows that, so this
   pins it: one argument, exactly the two keys, in the screen's order. */
test("A1 submit makes the SCREEN's call: save({setup, tags}), one argument", async () => {
  const m = await modules();
  const voice = await byVoice(COMPLETE[0], m);
  assert.equal(voice.run.submit.ok, true, JSON.stringify(voice.run.submit.unavailable || {}));
  const call = voice.recorder.ops[0];
  assert.equal(call.args.length, 1, "submit still passes save(setup, tags) as two arguments");
  assert.deepEqual(Object.keys(call.args[0]), ["setup", "tags"]);
  /* and the envelope the screen would have built from the same answers */
  const tap = await byTap(COMPLETE[0], m);
  assert.equal(JSON.stringify(call.args[0]),
    JSON.stringify({ setup: tap.built.setup, tags: tap.built.tags }));
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
/* C6A review round 1, C3. The stored op as ONE stringify, so a key reordered
   between `setup` and `tags` on the durable side is caught here exactly as it is
   on the byte side. Two separate stringifies let the shape drift. */
const storedPayload = (row) => JSON.stringify({ setup: row.setup, tags: row.tags });

/* C6A review round 1, C2. ALL SIX completing fixtures, not a slice: brief 2.3
   step 4 says "each of at least six", and the reviewer ran all six. */
for (const fixture of COMPLETE) {
  test("A2 " + fixture.id + ": tapped and spoken write IDENTICAL bytes through createSetupHost", async () => {
    const m = await modules();
    const tapInstall = await installation("tap-" + fixture.id);
    const voiceInstall = await installation("voice-" + fixture.id);
    try {
      /* nothing is set up on either installation yet */
      assert.equal(await tapInstall.host.enrolled(), false);
      assert.equal(await voiceInstall.host.enrolled(), false);

      /* path one: the screens' own setters, saved the way the Start button saves.
         RE-PIN onto :149. A4b's merged form moved the tags handling into the
         producer's envelopeOf, and setup-app.mjs:524 now calls
         `onDone({ setup: built.setup, tags: built.tags })` - ONE argument, an
         envelope - which today-entry.mjs:141 forwards verbatim to host.save().
         This line is that call, spelled the way the screen spells it. The old
         two-argument save(setup, tags) still works (envelopeOf accepts both),
         which is exactly why it had to be changed deliberately: the parity claim
         is only worth something if the tap side is the path the screens take. */
      const tap = await byTap(fixture, m);
      assert.ok(tap.built.ok, fixture.id + " did not complete by tap");
      const tapSaved = await tapInstall.host.save({ setup: tap.built.setup, tags: tap.built.tags });
      assert.equal(tapSaved.ok, true, JSON.stringify(tapSaved));

      /* path two: the seven tools, submit writing through the same host kind */
      const voice = await byVoice(fixture, m, voiceInstall.host);
      assert.equal(voice.run.submit.ok, true, JSON.stringify(voice.run.submit.unavailable || {}));

      const tapRows = await tapInstall.host.all();
      const voiceRows = await voiceInstall.host.all();
      assert.equal(tapRows.length, 1, "the tapped installation holds more than one setup");
      assert.equal(voiceRows.length, 1, "the spoken installation holds more than one setup");

      /* THE CLAIM: the same stored bytes, key order included, as ONE stringify
         over the whole payload (C6A C3). */
      assert.equal(storedPayload(voiceRows[0]), storedPayload(tapRows[0]));
      assert.equal(voiceRows[0].date, tapRows[0].date);
      /* and each really is the document the athlete answered */
      assert.equal(tapRows[0].setup.athlete_label, fixture.name);
      assert.equal(voiceRows[0].setup.athlete_label, fixture.name);
      assert.equal(voiceRows[0].setup.split.from, DAY);

      /* A13 on the real path: first run happens once, on both */
      assert.equal(await voiceInstall.host.enrolled(), true);
      const again = await voiceInstall.host.save({ setup: voice.built.setup, tags: voice.built.tags });
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

