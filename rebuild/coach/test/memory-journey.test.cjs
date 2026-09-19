"use strict";

/* P4b-1 REMEMBER AND RECALL: M01, the journey.
 *
 * "Confirm -> actual producer/bridge -> committed encrypted repository -> close
 * all hosts/process -> reopen same installation -> new coach/tool instance
 * recalls exact text/source/date; a second user recalls none"
 * (COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md section 5, M01).
 *
 * Every restart here is REAL: the world is closed, every reference is dropped,
 * and a WHOLE NEW WORLD is opened over the same IndexedDB, the same database
 * name, the same namespace, the same athlete and the same device. The second
 * user is a REAL SECOND INSTALLATION with its own database, namespace, era,
 * lease, athlete id and device id, because local-world.mjs:195 and :265 say in
 * their own words that opening openCoachWorld is not proof of a real phone join
 * and that the module's synthetic identity defaults are not a second user.
 *
 * WHAT THIS FILE DOES NOT PROVE, said rather than hidden: the store is
 * fake-indexeddb over a memory backend reached through rebuild/m3/w6/test/
 * support.mjs. The restart closes every host and client and opens a whole new
 * world over the same store; it is not a second operating-system process,
 * because the store lives in this process's memory. This is a synthetic browser
 * check, never installed-phone evidence. */

const test = require("node:test");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const fs = require("node:fs");
const T = require("../tools.cjs");
const W1 = require("../wave1-tools.cjs");
const MEM = require("../memory-commands.cjs");
const MT = require("../memory-tools.cjs");

const DAY = "2030-02-04";
const NEXT_DAY = "2030-02-05";

async function keys() {
  const gymHost = await import("../../m3/w7-preview/today/gym-host.mjs");
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  return { kid: gymHost.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
}

/* The installation, opened the way test/machine-settings.test.cjs opens one and
   no other way: support.mjs for the IndexedDB, webcrypto for the crypto,
   openCoachWorld for the world. */
async function installation(label, options = {}) {
  const support = await import("../../m3/w6/test/support.mjs");
  const LW = await import("../local-world.mjs");
  const ctx = {
    LW, support,
    fault: options.fault || support.faultDatabase(),
    deviceKeys: options.deviceKeys || await keys(),
    day: options.day || DAY,
    databaseName: options.databaseName || ("earned-p4b-" + label),
    namespace: options.namespace || ("earned-p4b/" + label),
    athleteId: options.athleteId || ("earned-p4b-athlete-" + label),
    deviceId: options.deviceId || ("earned-p4b-device-" + label),
    extra: options.extra || {},
  };
  ctx.open = (day) => LW.openCoachWorld({ indexedDB: ctx.fault.indexedDB, crypto: webcrypto,
    day: day || ctx.day, checkInDeviceKeys: ctx.deviceKeys, withCheckIn: false,
    databaseName: ctx.databaseName, namespace: ctx.namespace,
    athleteId: ctx.athleteId, deviceId: ctx.deviceId, ...ctx.extra });
  return dress(await ctx.open(), ctx);
}

function dress(opened, ctx) {
  const c5 = T.createCoachTools(opened);
  const wave1 = W1.createWave1Tools({ world: opened, coach: c5 });
  return { ...opened, ...ctx, c5, wave1,
    coach: MT.createMemoryTools({ world: opened, coach: wave1 }),
    reopen: async (day) => dress(await ctx.open(day), ctx) };
}

let seq = 0;
async function remember(w, memory) {
  const turn = w.coach.openTurn("turn-save-" + (seq += 1));
  const asked = await turn.call.remember({ memory });
  assert.equal(asked.ok, false);
  assert.equal(asked.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
  return turn.call.remember({ memory, confirmed: true, confirmation_id: asked.confirmation.confirmation_id });
}

const TEXT = "I like the bar low on my back and my shoes off.";
const MEMORY = () => ({ memory_id: "mem-journey", kind: "preference", topic: "coaching", text: TEXT });

test("M01 P01-01 the ORDERLY RESTART: close every host, drop every reference, open a WHOLE NEW WORLD", async () => {
  let w = await installation("p01-01");
  let again = null;
  try {
    /* 1. the bound yes, through the actual producer and bridge */
    const saved = await remember(w, MEMORY());
    assert.equal(saved.ok, true, JSON.stringify(saved.unavailable || {}));
    const opId = saved.values.opId.value;          // the only two primitives that
    const text = TEXT;                             // cross the close
    const metadataBefore = JSON.stringify((await w.memory.repository.load()).generation.metadata);
    const firstTools = w.coach;

    /* 2. close, and assert every handle is really dead */
    w.close();
    const dead = await w.memory.save(MEMORY());
    assert.equal(dead.ok, false, "a closed lane still wrote");
    assert.equal(dead.code, "LOCAL_CLIENT_CLOSED");

    /* 3. drop every reference and assert no module-level cache survives */
    again = await w.reopen();
    w = null;
    assert.notEqual(again.coach, firstTools, "the same tools object came back");
    assert.deepEqual(again.c5.consentLedger(), [], "a consent ledger survived the restart");
    assert.deepEqual(again.c5.issuedProposals(), [], "an issued proposal survived the restart");

    /* 4 and 5. the second open is NOT a first run, and it did not re-enrol */
    assert.deepEqual(again.client.status(), { state: "ready", code: "LOCAL_READY" });
    assert.ok(again.era.revision >= 1);
    const metadataAfter = (await again.memory.repository.load()).generation.metadata;
    assert.equal(metadataAfter.enrolledAt, JSON.parse(metadataBefore).enrolledAt,
      "the second open re-enrolled this installation");
    assert.deepEqual(metadataAfter.localEra, JSON.parse(metadataBefore).localEra);

    /* 6. a NEW turn on the NEW tools instance recalls the exact text, op and date */
    const turn = again.coach.openTurn("turn-after-restart");
    const r = await turn.call.recall({ topic: "coaching" });
    assert.equal(r.ok, true, JSON.stringify(r.unavailable || {}));
    assert.equal(r.values.items.length, 1);
    const item = r.values.items[0];
    assert.equal(item.text.display, text);
    assert.equal(item.text.source, "coach-memory.op " + opId);
    assert.equal(item.recordedOn.display, DAY);
    assert.equal(item.kind.value, "preference");
    assert.equal(item.topic.value, "coaching");
    assert.equal(item.memoryId.value, "mem-journey");
  } finally { if (again) again.close(); else if (w) w.close(); }
});

test("M01 P01-02 the path is STUB-FREE: one era, one lease, one generation, and no substitute anywhere", async () => {
  const w = await installation("p01-02");
  try {
    assert.equal(w.memoryOnLocalEra, true, "the memory lane is not on this installation's era");
    const started = await w.gym.start();
    assert.equal(started.ok, true, JSON.stringify(started));
    const saved = await remember(w, MEMORY());
    assert.equal(saved.ok, true, JSON.stringify(saved.unavailable || {}));

    /* the memory op and the workout Start are in ONE generation, under ONE lease */
    const generation = (await w.memory.repository.load()).generation;
    const ops = Object.values(generation.collections.ops);
    assert.equal(ops.length, 2, "the two lanes are not in one generation");
    const mine = ops.filter((op) => op.payload && op.payload.profile === MEM.PROFILE);
    assert.equal(mine.length, 1);
    assert.equal(mine[0].lease_id, ops[0].lease_id, "the memory rides a second lease");
    assert.equal(mine[0].op_id, saved.values.opId.value);
    assert.equal(MEM.validate(mine[0], () => null), true, "the stored op does not pass its own producer");

    /* and this FILE claims no path it did not really take. The forbidden words
       are assembled here rather than typed, so the cell cannot fail on its own
       explanation. */
    const source = fs.readFileSync(__filename, "utf8");
    for (const parts of [["mo", "ck"], ["st", "ub"], ["fa", "ke("], ["openRepo", "sitory("],
      ["createT2", "Stage("], ["createDurablePublic", "Client("], ["memoryBack", "end("]]) {
      const forbidden = parts.join("");
      assert.equal(source.includes(forbidden), false, "this cell's file carries " + forbidden);
    }
    assert.equal(typeof w.client.hostBindings, "function", "the client is not the accepted durable client");
  } finally { w.close(); }
});

test("M01/P39-04 P01-03 a FORCE KILL with no close, and a save abandoned mid-flight", async () => {
  let a = await installation("p01-03");
  let b = null, c = null;
  try {
    const saved = await remember(a, MEMORY());
    assert.equal(saved.ok, true, JSON.stringify(saved.unavailable || {}));
    const opId = saved.values.opId.value;

    /* NO close(): the world is abandoned exactly as a killed app abandons it */
    b = await a.reopen();
    a = null;
    if (b.memory.openedRefusal) {
      /* if the accepted layer reports a lease or recovery condition it is carried
         here verbatim rather than hidden */
      assert.ok(b.memory.openedRefusal.code, JSON.stringify(b.memory.openedRefusal));
    }
    const r = await b.coach.openTurn("turn-after-kill").call.recall({ topic: "coaching" });
    assert.equal(r.ok, true, JSON.stringify(r.unavailable || {}));
    assert.equal(r.values.items[0].text.display, TEXT);
    assert.equal(r.values.items[0].text.source, "coach-memory.op " + opId);

    /* SECOND HALF: a save abandoned mid-flight is fully present or fully absent */
    const half = "I want to be able to carry all the shopping in one trip.";
    const turn = b.coach.openTurn("turn-midflight");
    const asked = await turn.call.remember({ memory: { memory_id: "mem-half", kind: "goal", topic: "goals", text: half } });
    b.fault.state.write = b.support.deferred();
    b.fault.state.armed = true;
    b.fault.state.mode = "delay";
    const pending = turn.call.remember({ memory: { memory_id: "mem-half", kind: "goal", topic: "goals", text: half },
      confirmed: true, confirmation_id: asked.confirmation.confirmation_id });
    pending.catch(() => {});
    await b.fault.state.write.promise;
    /* the world is ABANDONED here: no close(), no orderly lease release. The
       fault is then let go the way a killed process lets its transaction go. */
    const held = b;
    b = null;
    held.fault.state.release = true;
    held.fault.state.armed = false;
    held.fault.state.mode = null;
    await pending.catch(() => null);
    c = await held.reopen();
    const rows = await c.memory.all();
    const halves = rows.filter((row) => row.memory.memory_id === "mem-half");
    assert.ok(halves.length <= 1, "the abandoned save wrote more than once");
    for (const row of halves) {
      /* fully present or fully absent, never partial */
      assert.equal(row.memory.text, half, "a PARTIAL text reached the store");
      assert.equal(row.memory.text.length, half.length);
    }
    assert.equal(rows.filter((row) => row.memory.memory_id === "mem-journey").length, 1,
      "the memory written before the kill did not survive it");
  } finally { if (c) c.close(); if (b) b.close(); if (a) a.close(); }
});

test("M01 P01-04 a REAL SECOND INSTALLATION recalls none, and both halves are controlled", async () => {
  const support = await import("../../m3/w6/test/support.mjs");
  const LW = await import("../local-world.mjs");
  const fault = support.faultDatabase();
  let A = await installation("A", { fault, databaseName: "earned-p4b-A", namespace: "earned-p4b/A",
    athleteId: "earned-p4b-athlete-A", deviceId: "earned-p4b-device-A" });
  const B = await installation("B", { fault, databaseName: "earned-p4b-B", namespace: "earned-p4b/B",
    athleteId: "earned-p4b-athlete-B", deviceId: "earned-p4b-device-B" });
  let againA = null;
  try {
    /* 1. B really enrolled and booted */
    assert.deepEqual(B.client.status(), { state: "ready", code: "LOCAL_READY" });
    assert.ok(B.era.revision >= 1);
    assert.equal(B.memoryOnLocalEra, true);
    /* 2. it is a DIFFERENT installation, in every identifier that names one */
    assert.notEqual(B.era.eraId, A.era.eraId);
    assert.notEqual(B.era.leaseId, A.era.leaseId);
    assert.notEqual(B.databaseName, A.databaseName);
    assert.notEqual(B.namespace, A.namespace);
    assert.notEqual(B.athleteId, A.athleteId);
    /* 3. NO SYNTHETIC IDENTITY DEFAULT on either side */
    for (const w of [A, B]) {
      assert.notEqual(w.athleteId, LW.COACH_ATHLETE, "a world was left on the module's default athlete");
      assert.notEqual(w.deviceId, LW.COACH_DEVICE, "a world was left on the module's default device");
      assert.notEqual(w.databaseName, LW.COACH_DATABASE);
      assert.notEqual(w.namespace, LW.COACH_NAMESPACE);
    }

    /* 4. A writes, B recalls NONE, and the absence is a named refusal */
    const mine = await remember(A, { memory_id: "mem-A", kind: "goal", topic: "goals",
      text: "I want to press my own bodyweight by the summer." });
    assert.equal(mine.ok, true, JSON.stringify(mine.unavailable || {}));
    assert.equal((await B.memory.all()).length, 0, "a memory crossed installations");
    const bRead = await B.coach.openTurn("turn-B-none").call.recall({ topic: "goals" });
    assert.equal(bRead.ok, false, "B answered with an empty success instead of an absence");
    assert.equal(bRead.unavailable.code, MT.MEMORY_CODES.MEMORY_ABSENT);

    /* 5. POSITIVE CONTROL: A, reopened for real, DOES recall it */
    A.close();
    againA = await A.reopen();
    A = null;
    const aRead = await againA.coach.openTurn("turn-A-again").call.recall({ topic: "goals" });
    assert.equal(aRead.ok, true, JSON.stringify(aRead.unavailable || {}));
    assert.equal(aRead.values.items.length, 1);
    assert.equal(aRead.values.items[0].text.display, "I want to press my own bodyweight by the summer.");
    assert.equal(aRead.values.items[0].text.source, "coach-memory.op " + mine.values.opId.value);

    /* 6. SECOND POSITIVE CONTROL: B is alive and keeps its OWN memory on the SAME topic */
    const theirs = await remember(B, { memory_id: "mem-B", kind: "goal", topic: "goals",
      text: "I want to walk up the hill without stopping." });
    assert.equal(theirs.ok, true, JSON.stringify(theirs.unavailable || {}));
    const bAgain = await B.coach.openTurn("turn-B-own").call.recall({ topic: "goals" });
    assert.equal(bAgain.values.items.length, 1);
    assert.equal(bAgain.values.items[0].text.display, "I want to walk up the hill without stopping.");
    const aStill = await againA.coach.openTurn("turn-A-still").call.recall({ topic: "goals" });
    assert.equal(aStill.values.items.length, 1);
    assert.equal(aStill.values.items[0].text.display, "I want to press my own bodyweight by the summer.");

    const genA = JSON.stringify((await againA.memory.repository.load()).generation);
    const genB = JSON.stringify((await B.memory.repository.load()).generation);
    assert.equal(genA.includes("walk up the hill"), false, "B's text is in A's generation");
    assert.equal(genB.includes("press my own bodyweight"), false, "A's text is in B's generation");

    /* 7. the two generations never join */
    const opsA = Object.keys(JSON.parse(genA).collections.ops);
    const opsB = Object.keys(JSON.parse(genB).collections.ops);
    assert.equal(opsA.some((id) => opsB.includes(id)), false, "the two installations share an op id");
  } finally { if (againA) againA.close(); else if (A) A.close(); B.close(); }
});

/* ------------------------------ the standing real-world rows of DECISIONS:439 */

test("P39-01/P39-02 a MOVING clock moves no stamp, and the offset is the era's own", async () => {
  let tick = 0;
  const moving = { now: () => DAY + "T13:00:" + String(10 + (tick += 1)).slice(0, 2) + ".000Z",
    today: () => DAY, tz: "-05:00", monotonicMs: () => tick };
  let back = 30;
  const backwards = { now: () => DAY + "T13:00:" + String(back -= 1).slice(0, 2) + ".000Z",
    today: () => DAY, tz: "-05:00", monotonicMs: () => 0 };
  for (const [label, clock] of [["forward", moving], ["backwards", backwards]]) {
    const w = await installation("p39-01-" + label, { extra: { clock } });
    try {
      const one = await remember(w, { memory_id: "mem-1", kind: "goal", topic: "goals", text: "first" });
      const two = await remember(w, { memory_id: "mem-2", kind: "goal", topic: "goals", text: "second" });
      const generation = (await w.memory.repository.load()).generation;
      const ops = Object.values(generation.collections.ops)
        .filter((op) => op.payload && op.payload.profile === MEM.PROFILE);
      if (label === "forward") {
        assert.equal(one.ok, true, JSON.stringify(one.unavailable || {}));
        assert.equal(two.ok, true, JSON.stringify(two.unavailable || {}));
        assert.equal(ops.length, 2);
      } else {
        /* MEASURED, and reported rather than worked around: a device clock that
           jumps BACKWARDS past the instant its own offline-write lease became
           valid makes that lease not yet valid, and the accepted client refuses
           the write in its own words (lease.cjs:31, index.cjs:282, state 20).
           The memory lane carries that refusal verbatim and writes nothing; it
           never invents a stamp to get around it. */
        for (const r of [one, two]) {
          if (r.ok) continue;
          assert.equal(r.unavailable.code, "COACH_MEMORY_NOT_RECORDED");
          assert.match(r.unavailable.reason, /Connect once to keep saving/);
        }
        assert.equal(ops.length, [one, two].filter((r) => r.ok).length,
          "a refused save left an operation behind");
        if (!ops.length) continue;
      }
      for (const op of ops) {
        assert.equal(op.effective.local_date, w.day, label + ": the stamp is not the host's day");
        /* P39-02: the era clock's own offset, never "Z" and never the process's */
        assert.equal(op.effective.utc_offset, "-05:00", label + ": the stamp took another offset");
        assert.notEqual(op.effective.utc_offset, "Z");
      }
      if (ops.length === 2) {
        assert.equal(JSON.stringify(ops[0].effective), JSON.stringify(ops[1].effective),
          label + ": two saves in one day produced two different stamps");
      }
    } finally { w.close(); }
  }
});

test("P39-03 LOCAL MIDNIGHT: a stored date never rolls forward, and yesterday's constraint needs review", async () => {
  let w = await installation("p39-03");
  let next = null;
  try {
    const yesterday = await remember(w, { memory_id: "mem-y", kind: "goal", topic: "goals", text: "kept yesterday" });
    const ending = await remember(w, { memory_id: "mem-c", kind: "constraint", topic: "goals",
      text: "no overhead pressing until tonight", interval: { from: "2030-02-01", to: DAY } });
    assert.equal(yesterday.ok, true, JSON.stringify(yesterday.unavailable || {}));
    assert.equal(ending.ok, true, JSON.stringify(ending.unavailable || {}));
    const beforeMidnight = await w.coach.openTurn("turn-before-midnight").call.recall({ topic: "goals" });
    assert.equal(beforeMidnight.values.items.find((i) => i.memoryId.value === "mem-c").label.value, "constraint");

    w.close();
    next = await w.reopen(NEXT_DAY);
    w = null;
    const today = await remember(next, { memory_id: "mem-t", kind: "goal", topic: "goals", text: "kept today" });
    assert.equal(today.ok, true, JSON.stringify(today.unavailable || {}));
    const r = await next.coach.openTurn("turn-after-midnight").call.recall({ topic: "goals" });
    assert.equal(r.ok, true, JSON.stringify(r.unavailable || {}));
    const byId = Object.fromEntries(r.values.items.map((i) => [i.memoryId.value, i]));
    /* the stored date did not roll forward */
    assert.equal(byId["mem-y"].recordedOn.display, DAY);
    assert.equal(byId["mem-t"].recordedOn.display, NEXT_DAY);
    /* and the newer one sorts FIRST under the stated ordering rule */
    assert.equal(r.values.items[0].memoryId.value, "mem-t");
    /* the constraint that ended yesterday is NEEDS REVIEW today, never active */
    assert.equal(byId["mem-c"].label.value, "needs-review");
  } finally { if (next) next.close(); else if (w) w.close(); }
});

test("P39-05 an OFFLINE RELOAD changes nothing: the recall is byte-identical, op ids included", async () => {
  let w = await installation("p39-05");
  let again = null;
  try {
    /* the local client is offline by construction, which is what makes this a
       reload and not a sync */
    const saved = await remember(w, MEMORY());
    assert.equal(saved.ok, true, JSON.stringify(saved.unavailable || {}));
    const before = await w.coach.openTurn("turn-same").call.recall({ topic: "coaching" });
    w.close();
    again = await w.reopen();
    w = null;
    const after = await again.coach.openTurn("turn-same").call.recall({ topic: "coaching" });
    assert.equal(JSON.stringify(after), JSON.stringify(before),
      "the recall changed across an offline reload");
  } finally { if (again) again.close(); else if (w) w.close(); }
});
