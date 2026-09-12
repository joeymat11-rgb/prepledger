"use strict";

/* COACH WAVE ONE, check W13 to W15: the fact class `earned/machine-settings/v1`.
 *
 * The shape is BRIEF-COACH-WAVE1-TEXT.md section 3, rule by rule, accepted and
 * refused. NOTHING IS INTERPRETED is the rule that matters most here: "four" is
 * stored as "four", and a test that let it become 4 would be letting the coach
 * author a number (mutant D10). */

const test = require("node:test");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const MS = require("../machine-settings-commands.cjs");

const DAY = "2030-02-04";
const EFFECTIVE = { local_date: DAY, local_time: "13:00", utc_offset: "-05:00" };
const req = (machine, effective) => ({ action: MS.ACTION,
  input: effective === undefined ? { machine } : { machine, effective } });
const SEAT = [{ name: "seat", value: "four" }, { name: "pin", value: "three" }];

/* A real installation on the local era, the same way the C5 and C6 suites reach
   fake-indexeddb: through rebuild/m3/w6's own support.mjs. Nothing is stubbed. */
async function world(label) {
  const support = await import("../../m3/w6/test/support.mjs");
  const gymHost = await import("../../m3/w7-preview/today/gym-host.mjs");
  const { openCoachWorld } = await import("../local-world.mjs");
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const keys = { kid: gymHost.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
  const fault = support.faultDatabase();
  const opened = await openCoachWorld({ indexedDB: fault.indexedDB, crypto: webcrypto, day: DAY,
    checkInDeviceKeys: keys, withCheckIn: false,
    databaseName: "earned-w1-" + label, namespace: "earned-w1/" + label });
  return { ...opened, fault, keys, reopen: async () => openCoachWorld({ indexedDB: fault.indexedDB,
    crypto: webcrypto, day: DAY, checkInDeviceKeys: keys, withCheckIn: false,
    databaseName: "earned-w1-" + label, namespace: "earned-w1/" + label }) };
}

/* ------------------------------------------------ W13: the shape, rule by rule */

test("W13 the profile, the action and the schema version are the check-in's own posture", () => {
  assert.equal(MS.PROFILE, "earned/machine-settings/v1");
  assert.equal(MS.ACTION, "machine-settings");
  assert.equal(MS.MACHINE_SETTINGS_SCHEMA_VERSION, 2);
  const producer = MS.createMachineSettingsCommands();
  assert.equal(producer.schemaVersion, 2);
  assert.equal(typeof producer.prepare, "function");
  assert.equal(typeof producer.validate, "function");
});

test("W13 the payload is EXACTLY two keys, profile and machine", () => {
  const action = MS.prepare(req({ exercise_id: "chest-press", settings: SEAT }, EFFECTIVE));
  assert.deepEqual(Object.keys(action.payload), ["profile", "machine"]);
  assert.equal(action.payload.profile, MS.PROFILE);
  assert.equal(action.class, "event");
  assert.equal(action.kind, "fact");
  assert.deepEqual(action.parents, []);
  assert.deepEqual(action.effective, EFFECTIVE);
});

test("W13 settings are stored in the ORDER given, verbatim, and nothing is interpreted", () => {
  const action = MS.prepare(req({ exercise_id: "chest-press", settings: SEAT }));
  assert.deepEqual(action.payload.machine.settings, [
    { name: "seat", value: "four" }, { name: "pin", value: "three" },
  ]);
  /* D10: "four" is a string and stays one. A number here would be the coach
     authoring a value the athlete did not say. */
  assert.equal(typeof action.payload.machine.settings[0].value, "string");
  assert.equal(action.payload.machine.settings[0].value, "four");
  /* and the order is his, not sorted */
  const reversed = MS.prepare(req({ exercise_id: "x", settings: [SEAT[1], SEAT[0]] }));
  assert.deepEqual(reversed.payload.machine.settings.map((s) => s.name), ["pin", "seat"]);
});

test("W13 a cue is free text, and both members may travel together", () => {
  const both = MS.prepare(req({ exercise_id: "chest-press", settings: SEAT, cues: "elbows under the bar" }));
  assert.equal(both.payload.machine.cues, "elbows under the bar");
  assert.deepEqual(Object.keys(both.payload.machine), ["exercise_id", "settings", "cues"]);
  const cueOnly = MS.prepare(req({ exercise_id: "chest-press", cues: "elbows under the bar" }));
  assert.deepEqual(Object.keys(cueOnly.payload.machine), ["exercise_id", "cues"]);
});

test("W13 AT LEAST ONE of settings or cues, or nothing is written (D9)", () => {
  assert.throws(() => MS.prepare(req({ exercise_id: "chest-press" })), /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare(req({ exercise_id: "chest-press", settings: [] })), /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare(req({ exercise_id: "chest-press", cues: "   " })), /MACHINE_SETTINGS_INPUT_INVALID/);
});

test("W13 the exercise id is required, trimmed and bounded", () => {
  for (const id of [undefined, null, "", "   ", 4, {}, [], "x".repeat(MS.EXERCISE_ID_MAX + 1)]) {
    assert.throws(() => MS.prepare(req({ exercise_id: id, settings: SEAT })), /MACHINE_SETTINGS_INPUT_INVALID/,
      JSON.stringify(id) + " was accepted as an exercise id");
  }
  const ok = MS.prepare(req({ exercise_id: "  chest-press  ", settings: SEAT }));
  assert.equal(ok.payload.machine.exercise_id, "chest-press");
});

test("W13 the settings list is bounded to twelve and each pair to forty characters", () => {
  const many = Array.from({ length: MS.SETTINGS_MAX }, (_, i) => ({ name: "n" + i, value: "v" + i }));
  assert.equal(MS.prepare(req({ exercise_id: "x", settings: many })).payload.machine.settings.length, MS.SETTINGS_MAX);
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: many.concat([{ name: "n", value: "v" }]) })),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  const long = "a".repeat(MS.SETTING_TEXT_MAX + 1);
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: [{ name: long, value: "v" }] })),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: [{ name: "n", value: long }] })),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare(req({ exercise_id: "x", cues: "c".repeat(MS.TEXT_MAX + 1) })),
    /MACHINE_SETTINGS_INPUT_INVALID/);
});

test("W13 a setting name twice is two answers to one question, and it refuses", () => {
  assert.throws(() => MS.prepare(req({ exercise_id: "x",
    settings: [{ name: "seat", value: "four" }, { name: "seat", value: "five" }] })),
  /MACHINE_SETTINGS_INPUT_INVALID/);
});

test("W13 a pair is exactly name and value, and a setting must be a map", () => {
  for (const pair of [{ name: "seat" }, { value: "four" }, { name: "seat", value: "four", note: "x" },
    "seat four", 4, null, [], { name: "", value: "four" }, { name: "seat", value: "" }]) {
    assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: [pair] })),
      /MACHINE_SETTINGS_INPUT_INVALID/, JSON.stringify(pair) + " was accepted as a setting");
  }
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: "seat four" })), /MACHINE_SETTINGS_INPUT_INVALID/);
});

test("W13 a third member on the machine, or on the input, refuses", () => {
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: SEAT, notes: "hello" })),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare({ action: MS.ACTION, input: { machine: { exercise_id: "x", settings: SEAT }, extra: 1 } }),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare({ action: "checkin", input: { machine: { exercise_id: "x", settings: SEAT } } }),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare({ action: MS.ACTION }), /MACHINE_SETTINGS_INPUT_INVALID/);
});

test("W13 the effective stamp is exactly the three members or it refuses", () => {
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: SEAT }, { local_date: DAY })),
    /MACHINE_SETTINGS_INPUT_INVALID/);
  assert.throws(() => MS.prepare(req({ exercise_id: "x", settings: SEAT },
    { local_date: DAY, local_time: "13:00", utc_offset: "-05:00", zone: "x" })), /MACHINE_SETTINGS_INPUT_INVALID/);
});

test("W13 validate ACCEPTS its own envelope and refuses everything else", () => {
  const action = MS.prepare(req({ exercise_id: "chest-press", settings: SEAT }, EFFECTIVE));
  const op = { ...action, athlete_id: "ath-1", causal_parents: [] };
  assert.equal(MS.validate(op, () => null), true);
  assert.equal(MS.validate({ ...op, kind: "reading" }, () => null), false);
  assert.equal(MS.validate({ ...op, class: "session" }, () => null), false);
  assert.equal(MS.validate({ ...op, payload: { profile: "earned/recovery-checkin/v1", machine: action.payload.machine } }, () => null), false);
  assert.equal(MS.validate({ ...op, payload: { ...action.payload, extra: 1 } }, () => null), false);
  assert.equal(MS.validate({ ...op, payload: { profile: MS.PROFILE, machine: { exercise_id: "x" } } }, () => null), false);
  assert.equal(MS.validate({ ...op, effective: { local_date: "nope", local_time: "13:00", utc_offset: "-05:00" } }, () => null), false);
  /* a causal parent the log does not hold */
  assert.equal(MS.validate({ ...op, causal_parents: ["op-nobody"] }, () => null), false);
});

/* --------------------------------- W14 and W15: one op per change, durable --- */

test("W14 ONE op per change, and the reader takes the LATEST for that exercise (D8)", async () => {
  const w = await world("latest");
  try {
    const lane = w.machineSettings;
    assert.equal(await lane.latest("chest-press"), null, "a lane with nothing in it returned something");

    const first = await lane.save({ exercise_id: "chest-press", settings: [{ name: "seat", value: "four" }] });
    const second = await lane.save({ exercise_id: "chest-press", settings: [{ name: "seat", value: "five" }] });
    const third = await lane.save({ exercise_id: "chest-press",
      settings: [{ name: "seat", value: "six" }, { name: "pin", value: "three" }] });
    for (const saved of [first, second, third]) assert.equal(saved.ok, true, JSON.stringify(saved));

    /* THREE ops, because the log is append-only and a correction is a new fact */
    const rows = await lane.all();
    assert.equal(rows.length, 3);
    assert.deepEqual(rows.map((r) => r.op_id), [first.op_id, second.op_id, third.op_id]);

    /* and the reader takes the THIRD, not the first (D8) */
    const latest = await lane.latest("chest-press");
    assert.equal(latest.op_id, third.op_id);
    assert.deepEqual(latest.machine.settings, [{ name: "seat", value: "six" }, { name: "pin", value: "three" }]);
  } finally { w.close(); }
});

test("W14 a capture for another exercise does not move this one", async () => {
  const w = await world("keyed");
  try {
    const lane = w.machineSettings;
    const press = await lane.save({ exercise_id: "chest-press", settings: [{ name: "seat", value: "four" }] });
    await lane.save({ exercise_id: "leg-press", settings: [{ name: "seat", value: "nine" }] });
    await lane.save({ exercise_id: "lat-pulldown", cues: "pull to the collarbone" });

    assert.equal((await lane.latest("chest-press")).op_id, press.op_id);
    assert.deepEqual((await lane.latest("chest-press")).machine.settings, [{ name: "seat", value: "four" }]);
    assert.deepEqual((await lane.latest("leg-press")).machine.settings, [{ name: "seat", value: "nine" }]);
    assert.equal((await lane.latest("lat-pulldown")).machine.cues, "pull to the collarbone");
    assert.equal(await lane.latest("shoulder-press"), null);
    assert.equal((await lane.all()).length, 3);
  } finally { w.close(); }
});

test("W14 the lane refuses a machine the producer will not take, and writes nothing", async () => {
  const w = await world("refuse");
  try {
    const lane = w.machineSettings;
    for (const machine of [{ exercise_id: "chest-press" }, { exercise_id: "", settings: SEAT },
      { exercise_id: "x", settings: [{ name: "seat" }] }, { exercise_id: "x", settings: [] },
      { exercise_id: "x", settings: SEAT, notes: "extra" }]) {
      /* The producer throws inside the accepted client, which turns it into its
         own refusal rather than a stack. Either way the test is the same: not
         acknowledged, and nothing on disk. */
      let refused = null;
      try { refused = await lane.save(machine); } catch (error) { refused = { ok: false, code: error.message }; }
      assert.equal(refused.ok, false, JSON.stringify(machine) + " was accepted");
      const rows = await lane.all();
      assert.equal(rows.length, 0, JSON.stringify(machine) + " reached the store");
    }
    /* and a machine the producer DOES take still lands, so the lane is refusing
       the shape and not simply broken */
    const good = await lane.save({ exercise_id: "chest-press", settings: SEAT });
    assert.equal(good.ok, true, JSON.stringify(good));
    assert.equal((await lane.all()).length, 1);
  } finally { w.close(); }
});

test("W15 a capture survives a reload and a new host over the same store", async () => {
  const w = await world("durable");
  let again = null;
  try {
    const saved = await w.machineSettings.save({ exercise_id: "chest-press", settings: SEAT,
      cues: "elbows under the bar" });
    assert.equal(saved.ok, true);
    w.close();

    /* A WHOLE NEW WORLD over the same IndexedDB: new client, new host, new
       bindings. The fact is on disk or it is not. */
    again = await w.reopen();
    const rows = await again.machineSettings.all();
    assert.equal(rows.length, 1, "the capture did not survive the reload");
    assert.equal(rows[0].op_id, saved.op_id);
    assert.deepEqual(rows[0].machine.settings, SEAT);
    assert.equal(rows[0].machine.cues, "elbows under the bar");
    assert.equal(rows[0].date, DAY);
    const latest = await again.machineSettings.latest("chest-press");
    assert.equal(latest.op_id, saved.op_id);
  } finally { if (again) again.close(); }
});

test("W15 the fact rides THIS installation's one generation, beside the workout", async () => {
  const w = await world("one-era");
  try {
    assert.equal(w.machineSettingsOnLocalEra, true);
    const started = await w.gym.start();
    assert.equal(started.ok, true, JSON.stringify(started));
    const saved = await w.machineSettings.save({ exercise_id: "chest-press", settings: SEAT });
    assert.equal(saved.ok, true);

    /* ONE generation: the Start and the machine fact are both in it */
    const generation = (await w.machineSettings.repository.load()).generation;
    const ops = Object.values(generation.collections.ops);
    assert.equal(ops.length, 2, "the two lanes are not in one generation");
    const mine = ops.filter((op) => op.payload && op.payload.profile === MS.PROFILE);
    assert.equal(mine.length, 1);
    /* one lease, one device sequence, the installation's own */
    assert.equal(mine[0].lease_id, ops[0].lease_id);
    assert.equal(MS.validate(mine[0], () => null), true);
  } finally { w.close(); }
});

test("W15 the read-back is narrowed by PROFILE, so no other lane's fact can reach it", async () => {
  const w = await world("narrow");
  try {
    await w.gym.start();
    await w.machineSettings.save({ exercise_id: "chest-press", settings: SEAT });
    const generation = (await w.machineSettings.repository.load()).generation;
    /* the pure reader, over the same generation the host just authenticated */
    const rows = MS.machineSettingsIn(generation);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].machine.exercise_id, "chest-press");
    /* and a generation with no machine fact in it reads empty rather than guessing */
    assert.deepEqual(MS.machineSettingsIn({ collections: { ops: {} } }), []);
    assert.deepEqual(MS.machineSettingsIn(null), []);
    assert.deepEqual(MS.machineSettingsIn(undefined), []);
  } finally { w.close(); }
});

test("W15 latestFor is a pure function and refuses a blank exercise id", () => {
  const rows = [
    { op_id: "a", date: "2030-02-01", machine: { exercise_id: "x", settings: [{ name: "s", value: "1" }] } },
    { op_id: "b", date: "2030-02-04", machine: { exercise_id: "x", settings: [{ name: "s", value: "2" }] } },
    { op_id: "c", date: "2030-02-04", machine: { exercise_id: "y", settings: [{ name: "s", value: "3" }] } },
  ];
  assert.equal(MS.latestFor(rows, "x").op_id, "b");
  assert.equal(MS.latestFor(rows, "y").op_id, "c");
  assert.equal(MS.latestFor(rows, "z"), null);
  for (const id of ["", "   ", null, undefined, 4]) assert.equal(MS.latestFor(rows, id), null);
  assert.equal(MS.latestFor([], "x"), null);
});

test("W17 the producer opens no socket and reads no environment", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const src = fs.readFileSync(path.join(__dirname, "..", "machine-settings-commands.cjs"), "utf8");
  for (const forbidden of ["node:http", "node:https", "node:net", "node:tls", "fetch(", "WebSocket",
    "XMLHttpRequest", "process.env", "child_process", "require(", "import("]) {
    assert.ok(!src.includes(forbidden), "machine-settings-commands.cjs reaches outside via " + forbidden);
  }
});

test("W13 machineOf is the ONE gate, used on the request and again on the envelope", () => {
  /* The same function validates the request and re-checks the stored payload, so
     the two can never drift: a shape prepare accepts is a shape validate accepts. */
  const machine = MS.machineOf({ exercise_id: "chest-press", settings: SEAT, cues: "elbows in" });
  assert.deepEqual(Object.keys(machine), ["exercise_id", "settings", "cues"]);
  const action = MS.prepare(req({ exercise_id: "chest-press", settings: SEAT, cues: "elbows in" }, EFFECTIVE));
  assert.equal(JSON.stringify(action.payload.machine), JSON.stringify(machine));
  assert.equal(MS.validate({ ...action, athlete_id: "a", causal_parents: [] }, () => null), true);
  /* and the gate is a copy, not the caller's object */
  const input = { exercise_id: "x", settings: [{ name: "seat", value: "four" }] };
  const built = MS.machineOf(input);
  built.settings[0].value = "five";
  assert.equal(input.settings[0].value, "four", "the gate mutated the caller's object");
});

test("W13 the fact class claims no engine member and names no athlete", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const src = fs.readFileSync(path.join(__dirname, "..", "machine-settings-commands.cjs"), "utf8");
  /* DECISIONS:117 (2): the phone-side half only. Nothing here reaches for the
     engine's own setup member, and nothing here names a person. */
  for (const forbidden of ["rebuild/engine", "athlete-state", "createCleanInitState", "seed.cjs"]) {
    assert.ok(!src.includes(forbidden), "the producer reaches for " + forbidden);
  }
  const action = MS.prepare(req({ exercise_id: "chest-press", settings: SEAT }));
  assert.equal(JSON.stringify(action.payload).includes("athlete_label"), false);
});

test("W15 two worlds over DIFFERENT stores do not see each other's machine facts", async () => {
  const a = await world("split-a");
  const b = await world("split-b");
  try {
    await a.machineSettings.save({ exercise_id: "chest-press", settings: [{ name: "seat", value: "four" }] });
    assert.equal((await a.machineSettings.all()).length, 1);
    assert.equal((await b.machineSettings.all()).length, 0, "a fact crossed installations");
    assert.equal(await b.machineSettings.latest("chest-press"), null);
  } finally { a.close(); b.close(); }
});
