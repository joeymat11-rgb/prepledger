// local-today-journey.test.mjs — C4 ONE STORE.
//
// The PM's REAL Today + gym card code (today-model.cjs, gym-model.mjs,
// gym-app.mjs, today-app.cjs, design.cjs — imported unmodified from
// rebuild/m3/w7-preview/today/) conducted over Lane C's local era through
// rebuild/m3/w6/local/today-bindings.mjs — which, since C4b, is also what
// gym-host.mjs and reading-host.mjs open: they are thin wrappers over it, and
// the synthetic enrolment they used to mint is gone from the page entirely.
//
// Everything lands in ONE sealed generation: one collections.ops, one
// checkpoint, one lease_id, one device sequence.
//
// C4b — THE SWAP IS APPLIED (DECISIONS:106). When this file was written,
// today-entry.mjs was PM-owned and had no injection point, so blocks 1-7 drove
// the nearest real seams (createGymModel, mountGym, createTodayModel,
// mountToday) and blocks 8-9 applied the "REQUEST TO PM" patch to a disposable
// copy under the OS temp directory. The patch is in the file now, so those two
// blocks drive the REAL createWorkoutEntry and the REAL boot() instead: there is
// no unapplied patch left to trial, and the claim they carry is the one that
// matters after the swap — boot() opens this device's local era BY DEFAULT.
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto, createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { createDurablePublicClient } from '../public-client.mjs';
import { openTodayOverLocalEra, openTodayInstallation, causalTips, startOrderRefusalOf,
  PLAN_BASIS, INPUT_BASIS, RESUME_REASON, PRODUCER } from '../local/today-bindings.mjs';
import { readLocalEra, localEraLeaseId, LOCAL_ERA_SCHEMA_VERSION } from '../local/local-era.mjs';
import { markerDatabaseName } from '../local/local-client.mjs';
import { keysDatabaseName } from '../local/local-keys.mjs';
// The page's own modules, unmodified.
import * as GymHost from '../../w7-preview/today/gym-host.mjs';
import * as Entry from '../../w7-preview/today/today-entry.mjs';
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
   5. PARTIAL ERASURE is restore-required, through the drop-in AND through the
   page's own module — which, since C4b, is the same store.

   The contrast this block used to draw (the page's reading-host silently
   re-enrolled over an erased generation, because ENROLMENT_EVIDENCE was a
   string constant anyone could present) no longer has two sides: that module
   is gone. What replaces it is the stronger claim — the SHIPPED PAGE now
   refuses, by name, on the same erasures.
   =========================================================================== */
test('C4b — partial erasure is restore-required, in the drop-in and in the page', async t => {
  await t.test('the drop-in refuses to open, with C1\'s own code, and writes nothing', async () => {
    for (const [label, erase] of [
      ['the enrollment marker', db => eraseRecord(db, DB + '-local', 'markers', 'enrolled')],
      ['the device key', db => eraseRecord(db, DB + '-keys', 'keys', 'active')],
      // The SAME erasure the page's reading-host used to re-enrol over.
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

  await t.test('and so does the PAGE, through its own module and its own defaults', async () => {
    /* The same erasure, driven through rebuild/m3/w7-preview/today/reading-host.mjs
       — the file that used to mint a new lease and initialize a new generation
       on STORE_MISSING, without a word. It is a wrapper now, so the refusal it
       reports is C1's, by name, with the athlete's record still on disk. */
    const { createReadingHost } = await import('../../w7-preview/today/reading-host.mjs');
    const indexedDB = new IDBFactory();
    const first = await createReadingHost({ day: DAY, indexedDB, crypto: webcrypto });
    assert.equal((await first.weighIn({ date: DAY, lb: 179.4 })).ok, true);
    assert.equal(first.reads().length, 1);
    const leaseId = first.lease.lease_id;
    first.close();

    await eraseRecord(indexedDB, GymHost.DATABASE + '-keys', 'keys', 'active');
    const refused = await createReadingHost({ day: DAY, indexedDB, crypto: webcrypto })
      .then(() => null, error => error);
    assert(refused, 'the page must not open a half-erased installation');
    assert.equal(refused.state, 18);
    assert.equal(refused.code, 'KEY_MISSING');

    /* AND THE PAGE SAYS SO. boot() names the client's own RESTORE_REQUIRED copy
       and the code, mounts what it honestly can, and re-enrols nothing. */
    const doc = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
      { url: 'http://127.0.0.1:4178/' }).window.document;
    const booted = await Entry.boot({ document: doc, today: DAY, indexedDB, crypto: webcrypto });
    assert.equal(booted.restoreRequired, 'KEY_MISSING');
    assert.equal(booted.hosts, null, 'no installation opened');
    assert.equal(booted.readings, null, 'and no store');
    assert.equal(doc.getElementById('today-status').textContent,
      GymHost.RESTORE_REQUIRED + ' (KEY_MISSING)');
    assert.equal(booted.model.read().hasReadToday, false, 'nothing on screen claims a reading');

    // The record is untouched: opening again still refuses rather than starting over.
    const survivor = await createReadingHost({ day: DAY, indexedDB, crypto: webcrypto })
      .then(() => null, error => error);
    assert.equal(survivor.state, 18, 'still restore-required, never a second life');
    assert.equal(survivor.code, 'KEY_MISSING');
    assert(leaseId.startsWith('local-era:'));
  });
});

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
   7. THE PINS. The page and the drop-in must not drift apart.

   C4b CHANGED WHAT THERE IS TO PIN. Before the swap, causalTips /
   startOrderRefusalOf existed TWICE — once in gym-host.mjs and once here — and
   the pin compared their source. Review D2 found that blind to the module-local
   helpers they close over (graphOps, reachedFrom), so a third layer compared
   those too. After the swap there is exactly ONE copy of each: gym-host.mjs
   re-exports today-bindings.mjs, so the comparison is an IDENTITY (===) and no
   source comparison can drift from it. The helper-source layer is retired
   because it has nothing left to compare.

   PAGE_PINS stays, re-pinned, with the corrected description review round 2
   asked for: it is NOT "every today/** file this branch depends on" — the
   journey imports seven and pins three. It is THE THREE FILES WHOSE DRIFT THIS
   SUITE COULD NOT OTHERWISE SEE. The other four (design.cjs, gym-app.mjs,
   gym-model.mjs, today-app.cjs, today-model.cjs) are DRIVEN by the blocks above,
   so drift in them turns this suite red on its own. today-entry.mjs, gym-host.mjs
   and reading-host.mjs are the three the swap rests on: if the entry point stops
   defaulting to the local era, or either wrapper starts opening a store of its
   own again, every block here would still pass over an injected `hosts`.
   =========================================================================== */
export const PAGE_PINS = Object.freeze({
  'today-entry.mjs': '4b9a0c218b1c333f9c3c49f418a3a14d9ad31458a00aa19732026fff84571595',
  'gym-host.mjs': '01b3c813eff92c52af6b91a478fbfb0f4ffe1b4360f9ca86e3eaa743624c6232',
  'reading-host.mjs': 'a3e9201587f97446f90856f3235cf99da8d487d1be127416be1e5086d17be6aa',
});
const pageFile = name => fileURLToPath(new URL('../../w7-preview/today/' + name, import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

test('C4b — the page and the drop-in are pinned to each other', async t => {
  await t.test('the three files whose drift this suite could not otherwise see are unchanged', () => {
    for (const [name, expected] of Object.entries(PAGE_PINS)) {
      const actual = sha256(readFileSync(pageFile(name)));
      assert.equal(actual, expected,
        'rebuild/m3/w7-preview/today/' + name + ' has changed since C4b was written.\n'
        + '  expected sha256 ' + expected + '\n  actual   sha256 ' + actual + '\n'
        + '  Re-read it against rebuild/m3/w6/local/today-bindings.mjs — in particular that\n'
        + '  boot() still opens the local era by DEFAULT and that neither wrapper opens a\n'
        + '  store of its own — then update PAGE_PINS here.');
    }
  });

  await t.test('causalTips and startOrderRefusalOf are the SAME functions, not copies of them', () => {
    assert.equal(GymHost.causalTips, causalTips, 'gym-host.mjs re-exports; it does not restate');
    assert.equal(GymHost.startOrderRefusalOf, startOrderRefusalOf);
  });

  await t.test('the product constants are the page\'s values', () => {
    assert.equal(PLAN_BASIS, GymHost.PLAN_BASIS);
    assert.equal(INPUT_BASIS, GymHost.INPUT_BASIS);
    assert.equal(RESUME_REASON, GymHost.RESUME_REASON);
    assert.deepEqual(PRODUCER, GymHost.PRODUCER);
  });

  await t.test('nothing in today/** mints an identity, a lease or an enrolment any more', () => {
    for (const name of ['today-entry.mjs', 'gym-host.mjs', 'reading-host.mjs']) {
      const text = readFileSync(pageFile(name), 'utf8');
      for (const gone of ['IDENTITY_KEY', 'ENROLMENT_EVIDENCE', 'AUTHORITY_KID', 'mintLease',
        'initialGeneration', 'signRecord', 'openDeviceKeys', 'generateKey'])
        assert.equal(text.includes(gone), false, name + ' still carries ' + gone);
    }
  });

  /* REVIEW D3, kept. `typeof null === 'object'`, so a member the drop-in nulled
     out could pass a typeof-only shape check. `device` IS null on purpose — key
     custody is local-keys.mjs, non-extractable and unexported — so it is declared
     by name, and EVERY OTHER nulled member fails. Since C4b the page's hosts ARE
     these hosts, so the comparison runs the other way: the wrapper must carry
     every member the drop-in returns, and may only ADD to it. */
  const NULLED = new Set(['device']);

  await t.test('the page\'s wrappers carry every member the drop-in returns, and add only identity', async () => {
    const indexedDB = new IDBFactory();
    const Reading = await import('../../w7-preview/today/reading-host.mjs');
    const pageReading = await Reading.createReadingHost({ day: DAY, indexedDB, crypto: webcrypto });
    const pageGym = await GymHost.createGymHost({ day: DAY, engineState: createTodayModel({}).stateFromOps(),
      indexedDB, crypto: webcrypto, plannedSplitSlotId: SLOT });

    const era = await load(new IDBFactory(), DAY);
    const mineReading = await era.createReadingHost({ day: DAY });
    const mineGym = await era.createGymHost({ day: DAY, engineState: createTodayModel({}).stateFromOps(),
      plannedSplitSlotId: SLOT });
    for (const [label, page, mine] of [['reading-host', pageReading, mineReading], ['gym-host', pageGym, mineGym]]) {
      for (const member of Object.keys(mine)) {
        assert.equal(typeof page[member], typeof mine[member], label + '.' + member);
        if (mine[member] !== null && page[member] === null)
          assert(NULLED.has(member), label + '.' + member + ' is null where the drop-in returns a value');
      }
      const added = Object.keys(page).filter(member => !(member in mine));
      assert.deepEqual(added.sort(), ['athleteId', 'deviceId'],
        label + ' may only ADD the installation identity: ' + JSON.stringify(added));
    }
    // The one declared exception, stated rather than implied.
    assert.equal(mineReading.device, null);
    assert.equal(pageReading.device, null);
    assert.equal(pageReading.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(pageGym.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(pageReading.athleteId, 'owner');
    assert.match(pageReading.deviceId, /^device-[0-9a-f]{32}$/);
    pageReading.close(); pageGym.close(); mineReading.close(); mineGym.close(); era.close();
  });
});

/* ===========================================================================
   8. THE PAGE'S OWN createWorkoutEntry, over an INJECTED installation.

   This block used to carry a hand-applied copy of §5's first hunk, because
   today/** was PM-owned and the patch could not be applied. DECISIONS:106
   granted it and C4b applied it, so the copy is gone: the function imported and
   driven here is rebuild/m3/w7-preview/today/today-entry.mjs createWorkoutEntry,
   unmodified, with `{ hosts: era }` — the injection point the patch added.
   =========================================================================== */
test('C4b — the page\'s createWorkoutEntry drives Today\'s real screen over the one store', async t => {
  const indexedDB = new IDBFactory();
  const era = await load(indexedDB, DAY);
  const readings = await era.createReadingHost({ day: DAY });
  const today = createTodayModel({ today: DAY, readings });
  // ONE option, `hosts`. No indexedDB, no crypto, no deviceKeys.
  const workout = await Entry.createWorkoutEntry(today, { hosts: era });
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'http://127.0.0.1:4178/' });
  const doc = dom.window.document;
  const api = TodayApp.mountToday(doc, today, { workout });
  const slot = name => doc.querySelector(`[data-slot="${name}"]`).textContent;

  await t.test('the entry point took nothing synthetic, and Today offers the morning first', () => {
    assert.deepEqual(era.ignored(), []);
    assert.match(slot('primary-label'), /^Log the scale$/i);
    assert.equal(workout.summary().phase, 'ready');
    assert.equal(workout.gymHost.repository, readings.repository, 'one repository handle');
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
   9. boot() OVER THE LOCAL ERA BY DEFAULT.

   This block used to apply §5's two hunks to a disposable copy of
   today-entry.mjs under the OS temp directory and run the patched boot() both
   ways, because the branch was not allowed to edit the file. The patch is
   applied now, so the disposable-copy machinery, the six anchors and the
   report-diff comparison are all gone — there is no unapplied patch left for
   them to be about. What they existed to prove is asserted directly instead,
   on the REAL module:

     * boot() with NO hosts opens this device's own local era: ONE generation,
       ONE self-issued lease, one checkpoint, both write paths in it, and none
       of the page's three old databases anywhere;
     * boot() with an INJECTED installation uses that one and mints nothing;
     * both give the same shape, because they are the same store.
   =========================================================================== */
const shellDoc = () => new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
  { url: 'http://127.0.0.1:4178/' }).window.document;

async function wholeJourney(booted, doc) {
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
}

function oneGeneration(generation) {
  const ops = Object.values(generation.collections.ops);
  assert.equal(ops.length, 7, 'one reading, one start, four sets, one close — in ONE generation');
  assert.deepEqual([...new Set(ops.map(op => op.class))].sort(), ['reading', 'session']);
  assert.deepEqual([...new Set(ops.map(op => op.schema_version))].sort(), [1, 2]);
  assert.equal([...new Set(ops.map(op => op.lease_id))].length, 1);
  assert.match(generation.metadata.authorityLease.lease_id, /^local-era:[0-9a-f]{32}$/);
  assert.equal(generation.metadata.authorityLease.schema_version, LOCAL_ERA_SCHEMA_VERSION);
  assert.equal(generation.collections.meta.checkpoint.counts.ops, 7);
  return ops;
}

test('C4b — boot() opens the local era BY DEFAULT, and takes an injected one when given', async t => {
  await t.test('THE DEFAULT: boot() with no hosts puts the whole day in ONE generation', async () => {
    const indexedDB = new IDBFactory();
    const doc = shellDoc();
    const booted = await Entry.boot({ document: doc, today: DAY, indexedDB, crypto: webcrypto });
    assert.deepEqual(booted.failures, [], 'nothing failed to open');
    assert.equal(booted.restoreRequired, null);
    assert(booted.api && booted.model && booted.workout && booted.readings && booted.hosts);
    // Which hosts were actually built: the local era, not a page-minted pair.
    assert.equal(booted.readings.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(booted.workout.gymHost.deviceKeyCustody, 'local-keys.mjs');
    assert.equal(booted.workout.gymHost.repository, booted.readings.repository,
      'both hosts hold the SAME repository handle');
    assert.deepEqual(booted.hosts.ignored(), [], 'the page minted no device material');

    await wholeJourney(booted, doc);
    oneGeneration((await booted.hosts.generation()).generation);

    /* The page's three old databases were never created, and the only ones on
       this device are the local era's own three. */
    const names = (await indexedDB.databases()).map(entry => entry.name).sort();
    assert.deepEqual(names, [GymHost.DATABASE, GymHost.DATABASE + '-keys',
      markerDatabaseName(GymHost.DATABASE)].sort(), JSON.stringify(names));
    for (const gone of ['earned-today-preview-device-keys', 'earned-today-preview-readings',
      'earned-today-preview-workout']) assert.equal(names.includes(gone), false, gone + ' must not exist');
    booted.hosts.close();
  });

  await t.test('AN INJECTED INSTALLATION is used as given, and nothing is minted beside it', async () => {
    const indexedDB = new IDBFactory();
    const era = await load(indexedDB, DAY);
    const doc = shellDoc();
    const booted = await Entry.boot({ document: doc, today: DAY, hosts: era });
    assert.deepEqual(booted.failures, []);
    assert.equal(booted.hosts, era, 'the installation it was handed, not another');
    assert.deepEqual(era.ignored(), [], 'the page passed no device material down');
    assert.equal(booted.workout.gymHost.repository, booted.readings.repository);

    await wholeJourney(booted, doc);
    const generation = await genOf(era);
    oneGeneration(generation);
    // Nothing synthetic reached the sealed metadata.
    const sealed = JSON.stringify(generation.metadata);
    for (const forbidden of ['synthetic-preview-identity-not-a-credential',
      'synthetic-preview-enrolment-only', 'synthetic-preview-authority', 'synthetic-preview-lease'])
      assert.equal(sealed.includes(forbidden), false, forbidden);
    // Only the era's own databases exist: no page-minted key store beside them.
    const names = (await indexedDB.databases()).map(entry => entry.name).sort();
    assert.deepEqual(names, [DB, DB + '-keys', DB + '-local'].sort(), JSON.stringify(names));
    era.close();
  });

  await t.test('the two routes produce the SAME store, because there is only one', async () => {
    const indexedDB = new IDBFactory();
    const first = await Entry.boot({ document: shellDoc(), today: DAY, indexedDB, crypto: webcrypto });
    assert.equal((await first.model.weighIn(179.4)).ok, true);
    const leaseId = (await first.hosts.generation()).generation.metadata.authorityLease.lease_id;
    first.hosts.close();

    /* A second page load over the same device, this time handing boot() an
       installation opened by hand at the page's OWN defaults. Same era, same
       lease, and the reading from the first load is still there. */
    const era = await openTodayInstallation({ indexedDB, crypto: webcrypto,
      databaseName: GymHost.DATABASE, namespace: GymHost.NAMESPACE, clock: clockFor(DAY) });
    const second = await Entry.boot({ document: shellDoc(), today: DAY, hosts: era });
    assert.deepEqual(second.failures, []);
    assert.equal((await era.generation()).generation.metadata.authorityLease.lease_id, leaseId,
      'the same era — a default boot and an injected one are the same installation');
    assert.equal(second.model.read().morningRead.lb, 179.4, 'and the first load\'s reading is still there');
    era.close();
  });
});
