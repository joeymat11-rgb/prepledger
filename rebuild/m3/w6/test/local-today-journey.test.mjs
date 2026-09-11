// local-today-journey.test.mjs — C4 ONE STORE.
//
// The PM's REAL Today + gym card code (today-model.cjs, gym-model.mjs,
// gym-app.mjs, today-app.cjs, design.cjs — imported unmodified from
// rebuild/m3/w7-preview/today/) conducted over Lane C's local era through
// rebuild/m3/w6/local/today-bindings.mjs, with the page's two synthetic hosts
// (gym-host.mjs, reading-host.mjs) never constructed.
//
// Everything lands in ONE sealed generation: one collections.ops, one
// checkpoint, one lease_id, one device sequence.
//
// WHAT IS STILL PAGE-OWNED AND COULD NOT BE DRIVEN. today-entry.mjs
// createWorkoutEntry() / boot() import createGymHost and createReadingHost as
// module bindings (today-entry.mjs:16-17) and call them directly
// (today-entry.mjs:26, :30, :83) — there is no injection point, so they cannot be
// pointed at another store without a change inside today/**. That change is the
// "REQUEST TO PM (exact patch)" in rebuild/lanes/c/C4-ONE-STORE-REPORT.md.
// Blocks 1-7 therefore drive the nearest real seams — createGymModel, mountGym,
// createTodayModel, mountToday — which is exactly what createWorkoutEntry itself
// does with them. Block 9 (review D1) goes further: it applies BOTH hunks of that
// patch to a disposable copy of today-entry.mjs under the OS temp directory —
// never the tree — and runs the patched boot() both ways.
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { createDurablePublicClient } from '../public-client.mjs';
import { openTodayOverLocalEra, causalTips, startOrderRefusalOf,
  PLAN_BASIS, INPUT_BASIS, RESUME_REASON, PRODUCER } from '../local/today-bindings.mjs';
import { readLocalEra, localEraLeaseId, LOCAL_ERA_SCHEMA_VERSION } from '../local/local-era.mjs';
import { markerDatabaseName } from '../local/local-client.mjs';
import { keysDatabaseName } from '../local/local-keys.mjs';
// The page's own modules, unmodified.
import * as GymHost from '../../w7-preview/today/gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';
import { mountGym } from '../../w7-preview/today/gym-app.mjs';
import TodayApp from '../../w7-preview/today/today-app.cjs';
import TodayModel from '../../w7-preview/today/today-model.cjs';
import design from '../../w7-preview/today/design.cjs';

const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const DAY = SYNTHETIC_DAY;
const SLOT = 'earned-today-preview/' + DAY;
const ATHLETE = 'joe', DEVICE = 'phone-A', DB = 'c4-one-store', NS = 'earned/one-store';
const CHOSEN = EFFORT_CHOICES.find(c => c.label === '2').reserve;
const UNSURE = EFFORT_CHOICES.find(c => c.label === 'Unsure').reserve;

const clockFor = day => ({ now: () => day + 'T08:00:00.000Z', today: () => day,
  tz: '-05:00', monotonicMs: () => 0 });
const offsetDay = (day, days) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/* A PAGE LOAD: a brand new installation handle over the SAME IndexedDB, exactly
   as reopening the app builds new hosts over the storage that is already there.
   Nothing is carried in memory between these. */
const load = (indexedDB, day, extra = {}) => openTodayOverLocalEra({ indexedDB, crypto: webcrypto,
  databaseName: DB, namespace: NS, athleteId: ATHLETE, deviceId: DEVICE, clock: clockFor(day), ...extra });

const genOf = async era => (await era.generation()).generation;
const opsOf = async era => Object.values((await genOf(era)).collections.ops || {});

async function logCurrent(model, view, effort) {
  return model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
    load: String(view.entry.load), reps: String(view.entry.reps), effort });
}
/* Walk the whole session the way the screen does. Copied in behaviour from A2's
   own gym.test.mjs helper so the journey conducted here is A2's journey. */
async function logEverySet(model, effort = CHOSEN) {
  for (let guard = 0; guard < 30; guard++) {
    const view = await model.read();
    if (view.phase === 'saved') { if (view.complete) return view; model.forget(); continue; }
    if (view.phase !== 'active') return view;
    const result = await logCurrent(model, view, effort);
    assert(result.ok, 'set refused: ' + result.code);
    model.forget();
  }
  throw new Error('the session never completed');
}

/* ===========================================================================
   1. THE CRUX, EXECUTED. Not "the pinned client ties schema to the lease" as a
   claim, but what it actually does to a weigh-in on a schema-2 local era.
   =========================================================================== */
test('C4 — the pinned public client cannot admit a reading under the era lease; C1\'s bridge can', async t => {
  const indexedDB = new IDBFactory();
  const era = await load(indexedDB, DAY);
  const bindings = await era.client.hostBindings();
  const lease = (await bindings.repository.load()).generation.metadata.authorityLease;

  await t.test('the era carries exactly one lease, at schema_version 2', async () => {
    assert.equal(LOCAL_ERA_SCHEMA_VERSION, 2);
    assert.equal(lease.schema_version, 2);
    const sealedEra = readLocalEra((await bindings.repository.load()).generation.metadata);
    assert.equal(lease.lease_id, localEraLeaseId(sealedEra.eraId), 'the host lease mirrors the era lease');
  });

  await t.test('public client at schemaVersion 2 refuses the weigh-in OPERATION_SCHEMA_MISMATCH/20', async () => {
    const client = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
    await client.reopen();
    const refused = await client.execute('weighIn', { date: DAY, lb: 179.4 });
    assert.equal(refused.acknowledged, false);
    assert.equal(refused.state, 20);
    assert.equal(refused.code, 'OPERATION_SCHEMA_MISMATCH', 'public-client.mjs:262-265');
    assert.equal((await opsOf(era)).length, 0, 'the refusal stored nothing');
  });

  await t.test('public client at schemaVersion 1 cannot even open the era LEASE_PROOF_UNPROVEN/18', async () => {
    const client = createDurablePublicClient({ ...bindings, schemaVersion: 1 });
    const opened = await client.reopen();
    assert.equal(opened.refusal.code, 'LEASE_PROOF_UNPROVEN', 'public-client.mjs:238');
    assert.equal(opened.refusal.state, 18);
  });

  await t.test('the reading host writes it through C1\'s bridge, into the same generation', async () => {
    const readings = await era.createReadingHost({ day: DAY });
    const saved = await readings.weighIn({ date: DAY, lb: 179.4 });
    assert.equal(saved.ok, true, saved.code);
    const ops = await opsOf(era);
    assert.equal(ops.length, 1);
    assert.equal(ops[0].class, 'reading');
    assert.equal(ops[0].schema_version, 1, 'rebuild/client/ops.cjs:59 default, under a schema-2 lease');
    assert.equal(ops[0].lease_id, lease.lease_id, 'client/index.cjs:206 gates only a WORKOUT on the lease schema');
    readings.close();
  });
  era.close();
});

/* ===========================================================================
   2. A2's OWN JOURNEY, over one local-era generation, through the page's code.
   =========================================================================== */
test('C4 — weigh-in, Start, sets, undo, finish, Today reflects — one generation', async t => {
  const indexedDB = new IDBFactory();
  let era = await load(indexedDB, DAY);
  let readings = await era.createReadingHost({ day: DAY });
  const today = createTodayModel({ today: DAY, readings });
  const hostForDay = other => era.createGymHost({ day: other, engineState: today.stateFromOps(),
    plannedSplitSlotId: 'earned-today-preview/' + other });
  let gymHost = await era.createGymHost({ day: DAY, engineState: today.stateFromOps(), plannedSplitSlotId: SLOT });
  let model = createGymModel({ gymHost, hostForDay, sessionTitle: today.read().workout.title });
  let startId = null, firstSetOp = null;

  await t.test('nothing synthetic was taken from the page: no minted keys, no static evidence', () => {
    assert.deepEqual(era.ignored(), [], 'the hosts took no deviceKeys, no second IndexedDB, no second namespace');
    assert.equal(readings.device, null);
    assert.equal(gymHost.device, null);
    assert.equal(readings.deviceKeyCustody, 'local-keys.mjs');
  });

  await t.test('the morning weigh-in is durable, and Today moves because the engine moved', async () => {
    const before = today.read();
    assert.equal(before.hasReadToday, false);
    assert.equal(before.durable, true);
    const saved = await today.weighIn(179.4);
    assert.equal(saved.ok, true, saved.copy);
    const after = today.read();
    assert.equal(after.hasReadToday, true);
    assert.equal(after.morningRead.lb, 179.4);
    assert.equal(after.storedReadCount, 1);
    assert.equal(after.unadopted, 0);
    assert.equal(after.paint, 'TRUTHFUL');
    assert.equal(after.latestRead.date, DAY, 'the newest adopted reading is the one just written');
    assert.equal(after.readRecency.days, 0, 'the engine, not the adapter, dates it');
  });

  await t.test('Start writes ONE session-start carrying the v2 capture', async () => {
    const view = await model.read();
    assert.equal(view.phase, 'ready', view.code || '');
    assert.equal(view.lift.count, 2);
    assert.equal(view.prescription.line, '40 lb × 12 reps');
    const started = await model.start();
    assert.equal(started.ok, true, started.code);
    startId = started.opId;
    const ops = await opsOf(era);
    const start = ops.find(op => op.op_id === startId);
    assert.equal(start.kind, 'session-start');
    assert.equal(start.schema_version, 2, 'the workout lane is schema 2 — same lease, same generation');
    assert.equal(start.prescription_capture.profile, 'earned/workout-prescription/v2');
    /* ONE STORE MAKES THE FRONTIER CROSS-LANE, and that is the truthful answer:
       the morning weigh-in is the only op on this disk, so it is the only tip,
       so the Start descends from it. In A2's two stores the workout generation
       could not see the reading at all. Nothing in the accepted order resolver
       reads a reading — startOrderRefusalOf only judges session-starts — and the
       day+1 test below proves a later reading never displaces yesterday's close. */
    const reading = ops.find(op => op.class === 'reading');
    assert.deepEqual(start.causal_parents, [reading.op_id]);
    assert.deepEqual(await gymHost.causalTipsNow(), [startId], 'and the Start is now the only tip');
  });

  await t.test('a set with an explicit UNKNOWN effort stores the tag, never a number', async () => {
    const view = await model.read();
    assert.equal(view.phase, 'active');
    const logged = await logCurrent(model, view, UNSURE);
    assert.equal(logged.ok, true, logged.code);
    firstSetOp = logged.opId;
    const op = (await opsOf(era)).find(o => o.op_id === firstSetOp);
    assert.deepEqual(op.payload.reserve, { tag: 'unknown' });
    assert.equal(op.payload.reserve.value, undefined);
  });

  await t.test('Undo commits the accepted removal edit; the set is retired, not deleted', async () => {
    const saved = await model.read();
    assert.equal(saved.phase, 'saved');
    assert.equal(saved.saved.opId, firstSetOp);
    const undone = await model.undo({ startId, opId: firstSetOp });
    assert.equal(undone.ok, true, undone.code);
    const ops = await opsOf(era);
    assert(ops.find(o => o.op_id === firstSetOp), 'the set operation is still on disk');
    assert(ops.find(o => o.op_id === undone.opId && o.target_op_id === firstSetOp), 'and so is the removal');
    const back = await model.read();
    assert.equal(back.phase, 'active');
    assert.equal(back.set.position, 1, 'the slot is open again');
  });

  await t.test('log every set and finish; the gym screen renders it from the capture alone', async () => {
    const last = await logEverySet(model);
    assert.equal(last.phase, 'saved');
    assert.equal(last.complete, true);
    const finished = await model.finish({ startId: last.startId });
    assert.equal(finished.ok, true, finished.code);
    const settled = await model.read();
    assert.equal(settled.phase, 'finished');
    assert.equal(settled.sets, 4);
    // The page's OWN view, over the page's approved templates, on this store.
    const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
      { url: 'http://127.0.0.1:4178/' });
    await mountGym(dom.window.document, dom.window.document.getElementById('phone'),
      { model, onBack: () => {}, onChanged: () => {} });
    const text = dom.window.document.getElementById('phone').textContent;
    assert.match(text, /4 sets recorded/);
    assert.doesNotMatch(text, /135 lb|9 reps/, 'no prototype figure reached the screen');
  });

  await t.test('Today\'s own screen reflects the durable state of BOTH lanes', () => {
    const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
      { url: 'http://127.0.0.1:4178/' });
    TodayApp.mountToday(dom.window.document, today, {});
    const view = today.read();
    assert.equal(view.hasReadToday, true);
    assert.equal(view.storedReadCount, 1);
    assert.match(dom.window.document.getElementById('phone').textContent, /179\.4/);
  });

  await t.test('ONE SEALED GENERATION: one ops collection, one checkpoint, one lease, one sequence', async () => {
    const generation = await genOf(era);
    const ops = Object.values(generation.collections.ops);
    assert.equal(ops.filter(op => op.class === 'reading').length, 1);
    assert.equal(ops.filter(op => op.class === 'session').length, 8,
      'one start, five sets (the first was undone and its slot re-logged), one removal, one close');
    assert.equal(ops.length, 9);
    // The checkpoint describes the WHOLE generation, not one writer's half.
    assert.deepEqual(generation.collections.meta.checkpoint.counts,
      { ops: ops.length, outbox: Object.keys(generation.collections.outbox).length });
    assert.equal(generation.collections.meta.device.seq, ops.length);
    assert.deepEqual([...new Set(ops.map(op => op.lease_id))],
      [generation.metadata.authorityLease.lease_id], 'one lease_id across both write paths');
    assert.deepEqual([...new Set(ops.map(op => op.device_seq))].sort((a, b) => a - b),
      ops.map((_, index) => index + 1), 'one contiguous device sequence');
    assert.deepEqual([...new Set(ops.map(op => op.schema_version))].sort(), [1, 2],
      'schema 1 readings and schema 2 workouts, in the same generation');
  });

  await t.test('NOTHING SYNTHETIC is in the sealed metadata', async () => {
    const generation = await genOf(era);
    const sealed = JSON.stringify(generation.metadata);
    for (const forbidden of [GymHost.IDENTITY_KEY, GymHost.ENROLMENT_EVIDENCE, GymHost.AUTHORITY_KID,
      'synthetic-preview-lease'])
      assert.equal(sealed.includes(forbidden), false, 'page synthetic reached the store: ' + forbidden);
    assert.equal(generation.metadata.checkpoint, undefined, 'no "synthetic-preview" checkpoint label');
    const era_ = readLocalEra(generation.metadata);
    assert.match(era_.eraId, /^[0-9a-f]{32}$/);
    assert.equal(generation.metadata.authorityLease.lease_id, localEraLeaseId(era_.eraId));
  });

  await t.test('KILL AND REOPEN through a NEW factory — both lanes come back', async () => {
    readings.close(); gymHost.close(); era.close();          // the process is gone
    era = await load(indexedDB, DAY);                        // a new page load
    assert.equal(era.installation.ops, 9, 'C1\'s boot() counts the whole generation');
    readings = await era.createReadingHost({ day: DAY });
    const reopenedToday = createTodayModel({ today: DAY, readings });
    assert.equal(reopenedToday.read().morningRead.lb, 179.4, 'the weigh-in survived');
    gymHost = await era.createGymHost({ day: DAY, engineState: reopenedToday.stateFromOps(), plannedSplitSlotId: SLOT });
    model = createGymModel({ gymHost, sessionTitle: 'T' });
    const view = await model.read();
    assert.equal(view.phase, 'finished', view.code || '');
    assert.equal(view.sets, 4, 'the workout survived');
    assert.equal((await opsOf(era)).length, 9, 'and nothing was rewritten on the way back');
  });
  era.close();
});

/* ===========================================================================
   3. TWO TRAINING DAYS, each on its OWN page load, with a weigh-in written
   between them. This is the test A2 review round 2 demanded, plus the one thing
   ONE STORE adds: a morning reading now sits on the frontier between the two
   sessions, and day 2's Start must still descend from day 1's close.
   =========================================================================== */
test('C4 — day+1 on a new page load descends from day 1\'s close, across a weigh-in', async t => {
  const indexedDB = new IDBFactory();
  const fresh = createTodayModel({}).stateFromOps();
  fresh.sessionLog = {};
  let firstClose = null, dayTwoReading = null;

  async function day(iso) {
    const era = await load(indexedDB, iso);
    const readings = await era.createReadingHost({ day: iso });
    const gymHost = await era.createGymHost({ day: iso, engineState: fresh,
      plannedSplitSlotId: 'earned-today-preview/' + iso });
    return { era, readings, gymHost, model: createGymModel({ gymHost, sessionTitle: 'T' }),
      close() { readings.close(); gymHost.close(); era.close(); } };
  }

  await t.test('day 1 — weigh-in, then a whole session, closed', async () => {
    const one = await day(DAY);
    assert.equal((await one.readings.weighIn({ date: DAY, lb: 179.4 })).ok, true);
    assert.equal((await one.model.start()).ok, true);
    const last = await logEverySet(one.model);
    assert.equal((await one.model.finish({ startId: last.startId })).ok, true);
    const ops = await opsOf(one.era);
    assert.equal(ops.length, 7, 'one reading, one start, four sets, one close');
    firstClose = ops.find(op => op.kind === 'session-close').op_id;
    one.close();
  });

  await t.test('day 2 — a NEW page load: the weigh-in lands first, and Start still descends from day 1', async () => {
    const two = await day(offsetDay(DAY, 1));
    const weighed = await two.readings.weighIn({ date: offsetDay(DAY, 1), lb: 179.0 });
    assert.equal(weighed.ok, true, weighed.code);
    dayTwoReading = weighed.op_id;
    assert.deepEqual(await two.gymHost.causalTipsNow(), [firstClose, dayTwoReading].sort(),
      'both lanes leave a tip; the frontier carries BOTH');
    const probe = await two.model.read();
    assert.equal(probe.phase, 'ready', probe.code || '');
    assert.equal(await two.gymHost.startOrderRefusal(), null,
      'the pre-write order guard, over the parents the accepted resolver actually produced');
    const started = await two.model.start();
    assert.equal(started.ok, true, started.code);
    const start = (await opsOf(two.era)).find(op => op.op_id === started.opId);
    assert(start.causal_parents.includes(firstClose), 'day 2 descends from day 1\'s close');
    assert(start.causal_parents.includes(dayTwoReading), 'and from this morning\'s reading');
    const last = await logEverySet(two.model);
    assert.equal((await two.model.finish({ startId: last.startId })).ok, true);
    assert.equal((await opsOf(two.era)).length, 14, 'two whole sessions and two readings, one generation');
    two.close();
  });
});

/* ===========================================================================
   4. RESUME IN PROGRESS, and the accepted `early` close for a session abandoned
   on an earlier day — both through gym-model.mjs, unmodified.
   =========================================================================== */
test('C4 — resume in progress, and the accepted recovery for an abandoned day', async t => {
  const indexedDB = new IDBFactory();
  const fresh = createTodayModel({}).stateFromOps();
  fresh.sessionLog = {};
  const on = async iso => {
    const era = await load(indexedDB, iso);
    const gymHost = await era.createGymHost({ day: iso, engineState: fresh, plannedSplitSlotId: 'slot' });
    return { era, gymHost, close: () => { gymHost.close(); era.close(); } };
  };
  let startId = null, instructions = null;

  await t.test('day 1 — start, log one set, and walk away', async () => {
    const one = await on(DAY);
    const model = createGymModel({ gymHost: one.gymHost, sessionTitle: 'T' });
    const started = await model.start();
    assert.equal(started.ok, true, started.code);
    startId = started.opId;
    const view = await model.read();
    assert.equal((await logCurrent(model, view, CHOSEN)).ok, true);
    instructions = JSON.stringify((await opsOf(one.era)).find(op => op.op_id === startId));
    assert.equal((await opsOf(one.era)).length, 2, 'a Start and one set, and no close');
    one.close();
  });

  await t.test('a NEW page load on the SAME day resumes at the next set, instructions byte-identical', async () => {
    const again = await on(DAY);
    const model = createGymModel({ gymHost: again.gymHost, sessionTitle: 'T' });
    const view = await model.read();
    assert.equal(view.phase, 'active', view.code || '');
    assert.equal(view.done, 1);
    assert.equal(view.set.position, 2);
    assert.equal(JSON.stringify((await opsOf(again.era)).find(op => op.op_id === startId)), instructions);
    assert.equal((await opsOf(again.era)).filter(op => op.kind === 'session-start').length, 1,
      'resuming creates no second Start');
    again.close();
  });

  await t.test('the next day names WHICH day is unfinished and the accepted close retires it', async () => {
    const two = await on(offsetDay(DAY, 1));
    /* hostForDay over the SAME installation: gym-model closes the handle it is
       given in a finally block, which must not take the page's store with it. */
    const hostForDay = other => two.era.createGymHost({ day: other, engineState: fresh, plannedSplitSlotId: 'slot' });
    const model = createGymModel({ gymHost: two.gymHost, hostForDay, sessionTitle: 'T' });
    const view = await model.read();
    assert.equal(view.phase, 'unfinished', view.code || '');
    assert.equal(view.code, 'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
    assert.equal(view.unfinished.day, DAY);
    assert.equal(view.unfinished.startId, startId);
    assert.equal(view.unfinished.sets, 1);
    assert.equal((await opsOf(two.era)).length, 2, 'naming it writes nothing');

    const closed = await model.closeUnfinished(view.unfinished);
    assert.equal(closed.ok, true, closed.code || '');
    const ops = await opsOf(two.era);
    assert.equal(ops.length, 3, 'exactly one close operation, and no deletion');
    const close = ops.find(op => op.op_id === closed.opId);
    assert.equal(close.kind, 'session-close');
    assert.equal(close.payload.completion_kind, 'early');
    // The installation survived the transient host's own close().
    const after = await two.era.createReadingHost({ day: offsetDay(DAY, 1) });
    assert.equal((await after.weighIn({ date: offsetDay(DAY, 1), lb: 178.8 })).ok, true,
      'the shared store is still open after a transient gym host closed');
    after.close();
    two.close();
  });
});

function eraseRecord(indexedDB, name, store, key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
}

function deleteDatabase(indexedDB, name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('delete blocked: ' + name));
  });
}

/* ===========================================================================
   5. PARTIAL ERASURE. The drop-in refuses; the page's synthetic hosts re-enrol.
   =========================================================================== */
test('C4 — partial erasure is restore-required here, and a silent re-enrolment in the page\'s hosts', async t => {
  await t.test('the drop-in refuses to open, with C1\'s own code, and writes nothing', async () => {
    for (const [label, erase] of [
      ['the enrollment marker', db => eraseRecord(db, DB + '-local', 'markers', 'enrolled')],
      ['the device key', db => eraseRecord(db, DB + '-keys', 'keys', 'active')],
      // The SAME erasure the page's reading-host silently re-enrols over below.
      ['the whole generation database', db => deleteDatabase(db, DB)],
    ]) {
      const indexedDB = new IDBFactory();
      const era = await load(indexedDB, DAY);
      const readings = await era.createReadingHost({ day: DAY });
      assert.equal((await readings.weighIn({ date: DAY, lb: 179.4 })).ok, true, label);
      era.close();
      await erase(indexedDB);
      await assert.rejects(() => load(indexedDB, DAY), error => {
        assert.equal(error.state, 18, label);
        assert(['ENROLLMENT_MARKER_MISSING', 'KEY_MISSING', 'STORE_MISSING'].includes(error.code),
          label + ': ' + error.code);
        return true;
      }, label);
      // And the reading is still there for a real restore path to find.
      const forced = await load(indexedDB, DAY, { enroll: false }).catch(error => error);
      assert.equal(forced.state, 18, label + ': enroll:false changes nothing');
    }
  });

  await t.test('the page\'s reading-host re-enrols over an erased generation without a word', async () => {
    /* The contrast, executed on the PAGE'S OWN module. ENROLMENT_EVIDENCE is a
       string constant, so authorizeEnrollment accepts it from anyone, and the
       STORE_MISSING branch (reading-host.mjs:62-67) mints a new lease and
       initializes a new generation. There is no first-run signal and no
       restore-required state to tell the athlete his history is gone. */
    const { createReadingHost } = await import('../../w7-preview/today/reading-host.mjs');
    const indexedDB = new IDBFactory();
    const keys = await pageDeviceKeys();
    const first = await createReadingHost({ day: DAY, indexedDB, crypto: webcrypto, deviceKeys: keys });
    assert.equal((await first.weighIn({ date: DAY, lb: 179.4 })).ok, true);
    assert.equal(first.reads().length, 1);
    first.close();
    await deleteDatabase(indexedDB, 'earned-today-preview-readings');
    const second = await createReadingHost({ day: DAY, indexedDB, crypto: webcrypto, deviceKeys: keys });
    assert.equal(second.openedRefusal, null, 'no refusal is reported');
    assert.deepEqual(second.reads(), [], 'the history is gone and the store simply starts again');
    second.close();
  });
});

async function pageDeviceKeys() {
  const pair = await webcrypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
  const jwk = await webcrypto.subtle.exportKey('jwk', pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { kid: GymHost.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, key_ops: ['verify'], ext: true } };
}

/* ===========================================================================
   6. NO LOST UPDATE. Two writers, one repository: the reading goes through C1's
   bridge, the set through the public client, and they are fired without waiting
   for one another. The repository's compare-and-swap (repository.mjs:239/:240)
   is what serialises them; neither may overwrite the other's operation.
   =========================================================================== */
test('C4 — a weigh-in and a workout set committed concurrently both survive', async () => {
  const indexedDB = new IDBFactory();
  const era = await load(indexedDB, DAY);
  const readings = await era.createReadingHost({ day: DAY });
  const today = createTodayModel({ today: DAY, readings });
  const gymHost = await era.createGymHost({ day: DAY, engineState: today.stateFromOps(), plannedSplitSlotId: SLOT });
  const model = createGymModel({ gymHost, sessionTitle: 'T' });
  assert.equal((await model.start()).ok, true);
  const view = await model.read();
  const before = (await opsOf(era)).length;

  const [weighed, logged] = await Promise.all([
    readings.weighIn({ date: DAY, lb: 179.4 }),
    logCurrent(model, view, CHOSEN),
  ]);
  /* THE HONEST OUTCOME, and a residual worth naming. The reading commits; the
     set is refused WORKOUT_RESUME_STALE, because gym-model takes a resume handle
     and the reading moved the revision under it. That is a REFUSAL, not a loss:
     nothing was written for the refused write, the reading is intact, and the
     retry — which is what the screen does on its next action — lands. The screen
     cannot reach this state (the athlete either weighs in or logs a set), but a
     one-store page must know it exists. */
  assert.equal(weighed.ok, true, 'the reading: ' + weighed.code);
  const mid = Object.values((await genOf(era)).collections.ops);
  if (!logged.ok) {
    assert.equal(logged.code, 'WORKOUT_RESUME_STALE', 'the set is refused BY NAME, never silently dropped');
    assert.equal(mid.length, before + 1, 'the refused set wrote nothing');
    const retried = await logCurrent(model, await model.read(), CHOSEN);
    assert.equal(retried.ok, true, 'the retry lands: ' + retried.code);
  }
  const generation = await genOf(era);
  const ops = Object.values(generation.collections.ops);
  assert.equal(ops.length, before + 2, 'both writes are on disk — neither replaced the other');
  assert(ops.find(op => op.op_id === weighed.op_id), 'the reading survived the workout write');
  assert.equal(ops.filter(op => op.kind === 'session-set').length, 1, 'exactly one set, never two');
  assert.equal(new Set(ops.map(op => op.device_seq)).size, ops.length, 'no two operations share a sequence');
  assert.deepEqual(generation.collections.meta.checkpoint.counts.ops, ops.length);
  assert.equal(generation.collections.meta.device.seq, ops.length);
  readings.close(); gymHost.close(); era.close();
});

/* ===========================================================================
   7. THE PINS. The drop-in must not drift from the page it replaces.

   REVIEW D2. `String(fn) === String(fn)` was the whole pin, and it is BLIND to
   what the function closes over: causalTips calls the module-local graphOps and
   startOrderRefusalOf calls graphOps and reachedFrom, and no assertion compared
   those. Two functions with identical source text over different helpers satisfy
   String(a) === String(b) and behave differently — which is exactly the drift the
   pin exists to catch. So the pin is now THREE things, coarsest first:
     * the sha256 of each whole today/** file this branch depends on, recorded
       against the bytes the drop-in and the REQUEST TO PM patch were written
       for. Anything moving in those files fails here first, by name;
     * the extracted source of the two module-local helpers, from both files;
     * String(fn) on the two exported functions, as before.
   =========================================================================== */
/* The page files this branch is pinned to, and the bytes they had when the
   drop-in and §5's patch were written (candidate d9891f0, base 43470fe). A
   change to any of them is not necessarily wrong — but it must be re-read
   against today-bindings.mjs and the report's patch before this goes green. */
export const PAGE_PINS = Object.freeze({
  'today-entry.mjs': 'fa313c14ef1a962a63086b6efd34938959eea0548ee1f5aa50708027a92e9c98',
  'gym-host.mjs': '9b018f11ad88903516721f56d5cec54714ceecf15d1a5f288c9c71bdc26c78a2',
  'reading-host.mjs': 'c28273b8c5b410068cd236a943002147f57dbea7a1c59f55543d9b134cd7dcec',
});
const pageFile = name => fileURLToPath(new URL('../../w7-preview/today/' + name, import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
/* A module-local helper, lifted out of a file by its declaration. Used on BOTH
   files, so the comparison is source against source and not source against a
   remembered string. */
function helperSource(text, name) {
  const declared = ['function ' + name + '(', 'const ' + name + ' = ']
    .map(form => [form, text.indexOf(form)]).filter(([, at]) => at !== -1);
  assert.equal(declared.length, 1, 'helper not found exactly once: ' + name);
  const [form, start] = declared[0];
  const block = form.startsWith('function');
  let depth = 0;
  for (let index = start; index < text.length; index++) {
    const ch = text[index];
    if ('({['.includes(ch)) depth++;
    else if (')}]'.includes(ch)) {
      depth--;
      // A `function` declaration ends when its own body closes.
      if (block && depth === 0 && ch === '}' && index > text.indexOf('{', start)) return text.slice(start, index + 1);
    } else if (!block && ch === ';' && depth === 0) return text.slice(start, index + 1);
  }
  throw new Error('unterminated helper: ' + name);
}

test('C4 — the drop-in is pinned to the page\'s own hosts', async t => {
  await t.test('the page files this branch depends on are the bytes it was written against', () => {
    for (const [name, expected] of Object.entries(PAGE_PINS)) {
      const actual = sha256(readFileSync(pageFile(name)));
      assert.equal(actual, expected,
        'rebuild/m3/w7-preview/today/' + name + ' has changed since C4 was written.\n'
        + '  expected sha256 ' + expected + '\n  actual   sha256 ' + actual + '\n'
        + '  Re-read it against rebuild/m3/w6/local/today-bindings.mjs and the REQUEST TO PM\n'
        + '  patch in rebuild/lanes/c/C4-ONE-STORE-REPORT.md, then update PAGE_PINS here.');
    }
  });

  await t.test('the module-local helpers those functions close over are the page\'s too', () => {
    const mine = readFileSync(fileURLToPath(new URL('../local/today-bindings.mjs', import.meta.url)), 'utf8');
    const page = readFileSync(pageFile('gym-host.mjs'), 'utf8');
    for (const helper of ['graphOps', 'reachedFrom'])
      assert.equal(helperSource(mine, helper), helperSource(page, helper),
        'today-bindings.mjs ' + helper + ' has diverged from gym-host.mjs');
  });

  await t.test('causalTips and startOrderRefusalOf are the page\'s functions, character for character', () => {
    assert.equal(String(causalTips), String(GymHost.causalTips));
    assert.equal(String(startOrderRefusalOf), String(GymHost.startOrderRefusalOf));
  });

  await t.test('the product constants are the page\'s values', () => {
    assert.equal(PLAN_BASIS, GymHost.PLAN_BASIS);
    assert.equal(INPUT_BASIS, GymHost.INPUT_BASIS);
    assert.equal(RESUME_REASON, GymHost.RESUME_REASON);
    assert.deepEqual(PRODUCER, GymHost.PRODUCER);
  });

  /* REVIEW D3. This pin was `typeof` only, and `typeof null === 'object'`, so a
     member the drop-in nulled out passed silently. `device` IS null here on
     purpose — key custody is local-keys.mjs, non-extractable and unexported
     (report residual 4) — so it is declared, by name, and EVERY OTHER nulled
     member now fails. The claim in §2 is therefore "every member NAME", which is
     what this asserts. */
  const NULLED = new Set(['device']);

  await t.test('the two returned shapes carry every member NAME the page\'s hosts return', async () => {
    const Reading = await import('../../w7-preview/today/reading-host.mjs');
    const indexedDB = new IDBFactory();
    const keys = await pageDeviceKeys();
    const pageReading = await Reading.createReadingHost({ day: DAY, indexedDB, crypto: webcrypto, deviceKeys: keys });
    const pageGym = await GymHost.createGymHost({ day: DAY, engineState: createTodayModel({}).stateFromOps(),
      indexedDB, crypto: webcrypto, deviceKeys: keys, plannedSplitSlotId: SLOT });

    const era = await load(new IDBFactory(), DAY);
    const mineReading = await era.createReadingHost({ day: DAY });
    const mineGym = await era.createGymHost({ day: DAY, engineState: createTodayModel({}).stateFromOps(),
      plannedSplitSlotId: SLOT });
    for (const [label, page, mine] of [['reading-host', pageReading, mineReading], ['gym-host', pageGym, mineGym]])
      for (const member of Object.keys(page)) {
        assert.equal(typeof mine[member], typeof page[member], label + '.' + member);
        if (page[member] !== null && mine[member] === null)
          assert(NULLED.has(member), label + '.' + member + ' is null where the page returns a value, '
            + 'and is not a declared exception — declare it and say why, or return something honest');
      }
    // The one declared exception, stated rather than implied.
    assert.equal(mineReading.device, null);
    assert.equal(mineGym.device, null);
    assert.equal(mineReading.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(mineGym.deviceKeyCustody, 'local-keys.mjs');
    assert.notEqual(pageReading.device, null, 'the page really does return a key record here');
    pageReading.close(); pageGym.close(); mineReading.close(); mineGym.close(); era.close();
  });
});

/* ===========================================================================
   8. THE PROPOSED PATCH — the createWorkoutEntry hunk, read as product code.

   REVIEW D3. This used to claim it was "copied VERBATIM ... with the three lines
   changed". It is NOT byte-equal to the patch and never was: this file's quote
   style differs, `createGymHost` is qualified `GymHost.createGymHost` because it
   is imported as a namespace here, and the patch's own comments are dropped. And
   the hunk changes FOUR lines, not three, and it is one of the patch's TWO hunks.
   So, stated honestly: below is today-entry.mjs:23-66 with the FIRST hunk of §5
   applied by hand, kept because it reads as product code and drives the whole
   screen. The byte-exact application of BOTH hunks to the real file is block 9.
   =========================================================================== */
async function patchedCreateWorkoutEntry(model, options = {}) {
  const view = model.read();
  const day = model.today;
  const { hosts, ...lane } = options;                                   // + patch
  const openGym = (hosts && hosts.createGymHost) || GymHost.createGymHost;  // + patch
  const gymHost = await openGym({ day, engineState: model.stateFromOps(),   // ~ patch
    plannedSplitSlotId: 'earned-today-preview/' + day, ...lane });
  const hostForDay = other => openGym({ day: other, engineState: model.stateFromOps(),  // ~ patch
    plannedSplitSlotId: 'earned-today-preview/' + other, ...lane });
  const gym = createGymModel({ gymHost, hostForDay,
    sessionTitle: view.workout ? view.workout.title : null });
  let summary = null;
  let onRefresh = null;
  async function refresh() {
    const read = await gym.read();
    summary = { phase: read.phase, sets: read.done || 0, code: read.code || null,
      copy: read.copy || null, unfinished: read.unfinished || null };
    if (onRefresh) onRefresh();
    return summary;
  }
  async function recover() {
    if (!summary || !summary.unfinished) return { ok: false, code: 'WORKOUT_RECOVERY_TARGET_REQUIRED' };
    const result = await gym.closeUnfinished(summary.unfinished);
    await refresh();
    return result;
  }
  await refresh();
  return { summary: () => summary, refresh, recover,
    setOnRefresh(fn) { onRefresh = fn; },
    open({ doc, phone, back }) { return mountGym(doc, phone, { model: gym, onBack: back, onChanged: refresh }); },
    gym, gymHost };
}

test('C4 — the patched createWorkoutEntry drives Today\'s real screen over the one store', async t => {
  const indexedDB = new IDBFactory();
  const era = await load(indexedDB, DAY);
  const readings = await era.createReadingHost({ day: DAY });
  const today = createTodayModel({ today: DAY, readings });
  // The patched call: ONE option, `hosts`. No indexedDB, no crypto, no deviceKeys.
  const workout = await patchedCreateWorkoutEntry(today, { hosts: era });
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const api = TodayApp.mountToday(doc, today, { workout });
  const slot = name => doc.querySelector(`[data-slot="${name}"]`).textContent;

  await t.test('the entry point took nothing synthetic, and Today offers the morning first', () => {
    assert.deepEqual(era.ignored(), []);
    assert.match(slot('primary-label'), /^Log the scale$/i);
    assert.equal(workout.summary().phase, 'ready');
  });

  await t.test('after the weigh-in Today offers Start, then Resume, then the review', async () => {
    const weighed = await today.weighIn(179.4);
    assert.equal(weighed.ok, true, JSON.stringify(weighed));
    api.render('today');
    assert.match(slot('primary-label'), /^Start /);
    /* ONE STORE, ONE FINDING. The preparation this entry took at construction
       was resolved against the generation BEFORE the weigh-in, and in one store
       the weigh-in moves that generation's revision. Holding a stale preparation
       across a reading write is refused BY NAME and writes nothing. The shipped
       screen never does it — gym-app.mjs paint() calls model.read() (which
       re-prepares) immediately before model.start() — but a one-store page must
       know the difference from A2's two stores, where a reading could not move
       the workout generation at all. */
    const stale = await workout.gym.start();
    assert.equal(stale.ok, false, 'a preparation taken before the weigh-in is stale');
    assert.equal(stale.code, 'WORKOUT_PREPARATION_STALE', JSON.stringify(stale));
    assert.equal((await opsOf(era)).length, 1, 'and it wrote nothing');

    // The product path: open the card, which re-prepares and then Starts.
    await workout.open({ doc, phone: doc.getElementById('phone'), back: () => api.render('today') });
    assert.equal((await workout.refresh()).phase, 'active');
    api.render('today');
    assert.match(slot('workout-count'), new RegExp(TodayApp.WORKOUT_IN_PROGRESS + '$'));
    assert.match(slot('primary-label'), /^Resume /);
    const last = await logEverySet(workout.gym);
    assert.equal((await workout.gym.finish({ startId: last.startId })).ok, true);
    await workout.refresh();
    api.render('today');
    assert.match(slot('workout-count'), new RegExp(TodayApp.WORKOUT_RECORDED_TODAY + '$'));
    assert.equal(slot('primary-label'), TodayApp.REVIEW_WORKOUT);
  });

  await t.test('and all of it is in the one generation', async () => {
    const generation = await genOf(era);
    const ops = Object.values(generation.collections.ops);
    assert.equal(ops.length, 7, 'one reading, one start, four sets, one close');
    assert.equal(generation.collections.meta.checkpoint.counts.ops, 7);
    assert.equal([...new Set(ops.map(op => op.lease_id))].length, 1);
  });
  workout.gymHost.close(); readings.close(); era.close();
});

/* ===========================================================================
   9. BOTH HUNKS OF THE REQUEST TO PM PATCH, APPLIED AND EXECUTED (review D1).

   §5 of the report is two hunks. Block 8 reads the first one as product code but
   is not byte-exact, and NOTHING in this branch executed the second — the boot()
   hunk, which is the larger and the riskier one: it suppresses openDeviceKeys
   (`if (!hosts && !device && idb && web)`), rewrites `lane`, and drops `lane`
   from the reading-host call (`...(hosts ? {} : lane)`). Its central promise —
   "a page that passes no hosts gets exactly what it gets today" — was asserted,
   not tested.

   So: the six anchors below ARE the report's diff, character for character. They
   are applied to a DISPOSABLE COPY of today-entry.mjs under the OS temp
   directory; nothing in the tree is written, and the test fails if an anchor
   matches anything other than exactly once. Then the patched module is run BOTH
   ways — over the drop-in, and with no `hosts` at all — and the second run is
   asserted to still open the page's own TWO generations.

   THE ONE CHANGE BEYOND THE PATCH, disclosed: the copy's six relative import
   specifiers are rewritten to absolute file URLs so the module still resolves to
   the REAL today/** files from the temp directory. Nothing else is touched, and
   the rewrite is asserted to be exactly invertible back to the patched text.
   =========================================================================== */
const TODAY_DIR = fileURLToPath(new URL('../../w7-preview/today/', import.meta.url));
export const REQUEST_TO_PM_PATCH = Object.freeze([
  // --- hunk 1: createWorkoutEntry ---
  { old: '  const gymHost = await createGymHost({ day, engineState: model.stateFromOps(),\n'
       + '    plannedSplitSlotId: "earned-today-preview/" + day, ...options });',
    new: '  /* ONE STORE. `hosts` is the only injection point: a page that supplies one\n'
       + '     (rebuild/m3/w6/local/today-bindings.mjs openTodayOverLocalEra) puts the\n'
       + '     weigh-in and the workout in ONE sealed generation; a page that supplies\n'
       + '     none gets exactly the two synthetic hosts this module built before. */\n'
       + '  const { hosts, ...lane } = options;\n'
       + '  const openGym = (hosts && hosts.createGymHost) || createGymHost;\n'
       + '  const gymHost = await openGym({ day, engineState: model.stateFromOps(),\n'
       + '    plannedSplitSlotId: "earned-today-preview/" + day, ...lane });' },
  { old: '  const hostForDay = (other) => createGymHost({ day: other, engineState: model.stateFromOps(),\n'
       + '    plannedSplitSlotId: "earned-today-preview/" + other, ...options });',
    new: '  const hostForDay = (other) => openGym({ day: other, engineState: model.stateFromOps(),\n'
       + '    plannedSplitSlotId: "earned-today-preview/" + other, ...lane });' },
  // --- hunk 2: boot ---
  { old: '  const day = options.today || undefined;',
    new: '  const day = options.today || undefined;\n'
       + '  /* An injected installation owns the device material: no key is minted here and\n'
       + '     none is passed down. `era.ignored()` is empty when that is honoured. */\n'
       + '  const hosts = options.hosts || null;' },
  { old: '  if (!device && idb && web) {',
    new: '  if (!hosts && !device && idb && web) {' },
  { old: '  const lane = { indexedDB: idb, crypto: web, ...(device ? { deviceKeys: device } : {}) };',
    new: '  const lane = hosts ? { hosts }\n'
       + '    : { indexedDB: idb, crypto: web, ...(device ? { deviceKeys: device } : {}) };' },
  { old: '  try { readings = await createReadingHost({ day: day || TodayModel.SYNTHETIC_DAY, ...lane }); }',
    new: '  const openReading = (hosts && hosts.createReadingHost) || createReadingHost;\n'
       + '  try { readings = await openReading({ day: day || TodayModel.SYNTHETIC_DAY,\n'
       + '    ...(hosts ? {} : lane) }); }' },
]);

/* Apply the patch to text, refusing anything but exactly one match per anchor. */
export function applyRequestToPmPatch(text) {
  const matches = [];
  for (const hunk of REQUEST_TO_PM_PATCH) {
    const count = text.split(hunk.old).length - 1;
    matches.push(count);
    assert.equal(count, 1, 'anchor did not match exactly once (' + count + '): '
      + hunk.old.split('\n')[0].trim());
    text = text.replace(hunk.old, hunk.new);
  }
  return { text, matches };
}

test('C4 — both hunks of the REQUEST TO PM patch, applied to a disposable copy and executed', async t => {
  const original = readFileSync(join(TODAY_DIR, 'today-entry.mjs'), 'utf8');
  const scratch = join(tmpdir(), 'c4-patch-trial-' + process.pid);
  let Entry = null, patched = null, matches = null;

  await t.test('the six anchors each match exactly once, and nothing in the tree is written', () => {
    ({ text: patched, matches } = applyRequestToPmPatch(original));
    assert.deepEqual(matches, [1, 1, 1, 1, 1, 1]);
    assert.notEqual(patched, original);
    for (const marker of ['const { hosts, ...lane } = options;', 'const openGym =',
      'const hosts = options.hosts || null;', 'if (!hosts && !device && idb && web) {',
      'const lane = hosts ? { hosts }', 'const openReading ='])
      assert.equal(patched.split(marker).length - 1, 1, 'expected exactly one: ' + marker);
    // The tree itself is untouched — this is the file the branch must not edit.
    assert.equal(readFileSync(join(TODAY_DIR, 'today-entry.mjs'), 'utf8'), original);
  });

  /* The report's unified diff and the six hunks above must be ONE patch. If they
     drift, the PM applies something this test never ran. Every line the patch
     adds has to appear in the report as an added line, and every line it removes
     as a removed one. */
  await t.test('the report\'s unified diff is this same patch, line for line', () => {
    const report = readFileSync(fileURLToPath(
      new URL('../../../lanes/c/C4-ONE-STORE-REPORT.md', import.meta.url)), 'utf8');
    for (const hunk of REQUEST_TO_PM_PATCH) {
      const removed = hunk.old.split('\n');
      const added = hunk.new.split('\n');
      for (const line of removed)
        if (!added.includes(line))
          assert(report.includes('\n-' + line + '\n'), 'report is missing removed line: ' + line.trim());
      for (const line of added)
        if (!removed.includes(line))
          assert(report.includes('\n+' + line + '\n'), 'report is missing added line: ' + line.trim());
    }
  });

  await t.test('the copy differs from the patched text only by its import specifiers', async () => {
    const dirUrl = pathToFileURL(TODAY_DIR).href;
    const rewritten = patched.replaceAll('from "./', 'from "' + dirUrl);
    assert.equal(rewritten.split(dirUrl).length - 1, 6, 'six relative imports rewritten');
    assert.equal(rewritten.replaceAll('from "' + dirUrl, 'from "./'), patched,
      'the rewrite must be exactly invertible — nothing else may have changed');
    mkdirSync(scratch, { recursive: true });
    const file = join(scratch, 'today-entry.patched.mjs');
    writeFileSync(file, rewritten);
    Entry = await import(pathToFileURL(file).href);
    assert.equal(typeof Entry.boot, 'function');
    assert.equal(typeof Entry.createWorkoutEntry, 'function');
  });

  const shell = () => new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' }).window.document;

  await t.test('patched boot({ hosts: era }) drives the whole page over ONE generation', async () => {
    const indexedDB = new IDBFactory();
    const era = await load(indexedDB, DAY);
    const doc = shell();
    const booted = await Entry.boot({ document: doc, today: DAY, hosts: era });
    assert.deepEqual(booted.failures, [], 'nothing failed to open');
    assert.deepEqual(era.ignored(), [], 'the page minted no device keys and passed none down');
    assert(booted.api && booted.model && booted.workout && booted.readings);
    // Which hosts were actually built: the drop-in, not the page's synthetic pair.
    assert.equal(booted.readings.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(booted.workout.gymHost.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(booted.workout.gymHost.repository, (await era.createReadingHost({ day: DAY })).repository,
      'both hosts hold the SAME repository handle');

    // The whole product journey, through the patched entry point.
    const label = () => doc.querySelector('[data-slot="primary-label"]').textContent;
    assert.match(label(), /^Log the scale$/i);
    assert.equal((await booted.model.weighIn(179.4)).ok, true);
    booted.api.render('today');
    assert.match(label(), /^Start /);
    await booted.workout.open({ doc, phone: doc.getElementById('phone'),
      back: () => booted.api.render('today') });
    const last = await logEverySet(booted.workout.gym);
    assert.equal((await booted.workout.gym.finish({ startId: last.startId })).ok, true);
    await booted.workout.refresh();
    booted.api.render('today');
    assert.equal(label(), TodayApp.REVIEW_WORKOUT);

    const generation = await genOf(era);
    const ops = Object.values(generation.collections.ops);
    assert.equal(ops.length, 7, 'one reading, one start, four sets, one close — in ONE generation');
    assert.deepEqual([...new Set(ops.map(op => op.class))].sort(), ['reading', 'session']);
    assert.deepEqual([...new Set(ops.map(op => op.schema_version))].sort(), [1, 2]);
    assert.equal([...new Set(ops.map(op => op.lease_id))].length, 1);
    assert.equal(generation.collections.meta.checkpoint.counts.ops, 7);
    const sealed = JSON.stringify(generation.metadata);
    for (const forbidden of [GymHost.IDENTITY_KEY, GymHost.ENROLMENT_EVIDENCE, GymHost.AUTHORITY_KID])
      assert.equal(sealed.includes(forbidden), false);
    // And the page's own two databases were never created.
    const names = (await indexedDB.databases()).map(entry => entry.name).sort();
    assert.deepEqual(names, [DB, DB + '-keys', DB + '-local'].sort(), JSON.stringify(names));
    era.close();
  });

  await t.test('THE DEFAULT IS PRESERVED: patched boot() with no hosts still opens the page\'s TWO generations', async () => {
    const indexedDB = new IDBFactory();
    const doc = shell();
    const booted = await Entry.boot({ document: doc, today: DAY, indexedDB, crypto: webcrypto });
    assert.deepEqual(booted.failures, [], 'the unpatched path still opens cleanly');
    assert.equal((await booted.model.weighIn(179.4)).ok, true);
    assert.equal((await booted.workout.gym.start()).ok, true);

    // The page minted its own device keys again, and built its own two hosts.
    assert.equal(booted.readings.deviceKeyCustody, undefined, 'this is reading-host.mjs, not the drop-in');
    assert.notEqual(booted.readings.device, null, 'and it holds the page-minted key record');
    const names = (await indexedDB.databases()).map(entry => entry.name).sort();
    for (const expected of ['earned-today-preview-device-keys', 'earned-today-preview-readings',
      'earned-today-preview-workout'])
      assert(names.includes(expected), 'missing ' + expected + ' — got ' + JSON.stringify(names));

    // TWO generations, and they really are separate: the reading is in one and
    // the workout in the other, with two different lease_ids.
    const readingOps = Object.values((await booted.readings.repository.load()).generation.collections.ops || {});
    const workoutOps = Object.values((await booted.workout.gymHost.repository.load()).generation.collections.ops || {});
    assert.equal(readingOps.length, 1);
    assert.equal(readingOps[0].class, 'reading');
    assert.equal(workoutOps.length, 1);
    assert.equal(workoutOps[0].kind, 'session-start');
    assert.equal(booted.readings.lease.schema_version, 1);
    assert.equal((await booted.workout.gymHost.repository.load()).generation.metadata.authorityLease.schema_version, 2);
    booted.workout.gymHost.close();
    booted.readings.close();
  });

  rmSync(scratch, { recursive: true, force: true });
});
