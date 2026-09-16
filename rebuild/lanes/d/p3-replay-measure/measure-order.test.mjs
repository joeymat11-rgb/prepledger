/* P3-REPLAY-MEASURE-FAMILY - THE SCENARIO THE REAL-EDGE RUN FOUND, and its
   reverse. ONE store, ONE installation: the REAL measure host writes its own
   records into the very generation the REAL admission controller replays, over
   real fake-indexeddb, with a real sealed bundle from the real port.cjs.
   Nothing is stubbed.

   This is the executed answer to cell P3-X9 on rebuild/c-p3-import-ui-2, which
   pins the defect: an installation that OPENED MEASURE before importing
   refused LOCAL_SOURCE_CONTEXT_UNRESOLVED. P3-X9's own comment asks whoever
   teaches the import lane the measure family to come back and say so - this
   file is that, and the note is carried in the author report.

   SYNTHETIC ONLY: the bundle is invented in the OS temp folder through the
   ACCEPTED clean-init constructor and sealed by the real port.cjs with --out
   outside every git working tree. No private fixture, no ledger, no owner
   file. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, admit, durable,
  SETUP, IMPORTED_LOADS } from '../../../m3/w7-preview/import/test/support.mjs';
import { createMeasureHost } from '../../../m3/w7-preview/measure/measure-host.mjs';
import { createMeasureCommands } from '../../../m3/w7-preview/measure/measure-commands.cjs';
import { readLocalEra } from '../../../m3/w6/local/local-era.mjs';
import Ops from '../../../client/ops.cjs';
import { baselineWeeksFromState } from '../../../m3/w7-preview/measure/measure-baseline.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const SEALED = sealInventedBundle();
/* A REAL summer day in the zone the production calendar is written for, at a
   real instant: 12:00 EDT. The era, the measure host and every operation take
   the device's own live offset at that instant. */
const WHEN = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const WAIST = { date: '2026-09-16', in: 32.5 };
const MARKERS = SETUP.exercises.map(e => e.id);
const WEEKS = 8;
const scopeFor = tag => ({ databaseName: 'p3-rmf-' + tag, namespace: 'joe/p3-rmf-' + tag,
  athleteId: 'ath-p3-rmf', deviceId: 'dev-p3-rmf' });

/* OPEN THE MEASURE SCREEN, as the athlete does: the route persists day one
   once, he records a waist reading and picks his markers. Every write goes
   through the real host, the real durable client and the real S5 producer. */
async function openMeasure(era) {
  const host = await createMeasureHost({ day: WHEN.day, era });
  const start = await host.ensureTrialStart();
  assert.equal(start, WHEN.day, 'day one is the first enrolled record\'s date');
  const saved = await host.save(WAIST);
  assert.equal(saved.ok, true, saved.code);
  const picked = await host.saveMarkers(MARKERS);
  assert.equal(picked.ok, true, picked.code);
  return host;
}

/* EVERYTHING THE MEASURE SCREEN READS OFF THIS DEVICE - the inputs its TRIAL
   column and its day one are built from. Read through the host's own readers,
   so this is the screen's own view and not a second interpretation. */
async function measureView(host) {
  return { trialStart: await host.trialStart(), firstEnrolled: await host.firstEnrolledDate(),
    waist: await host.all(), markers: await host.markers(), sets: await host.sets(),
    sessionDates: await host.sessionDates(), foodDays: await host.foodDays() };
}

const importedState = async era => admittedLocalSourceBasis(
  (await era.generation()).generation, { namespace: era.namespace ?? null });

/* THE BASELINE COLUMN, through the one join the Measure screen uses. */
const baselineOf = (state, trialStart) =>
  baselineWeeksFromState(state, trialStart, WEEKS, MARKERS);
const filledWeeks = rows => rows.filter(week =>
  week && Object.values(week).some(value => typeof value === 'number' && Number.isFinite(value)));

test('P3-RM1 (bar a) - OPEN MEASURE FIRST, THEN IMPORT: the import ADMITS, Today and the gym '
  + 'card show the history, the baseline column fills, and day one and the trial column '
  + 'are unchanged', async t => {
    const scope = scopeFor('a');
    const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(WHEN.at), ...scope });
    t.after(() => era.close());
    await firstRun(era, WHEN.day);
    const host = await openMeasure(era);
    t.after(() => host.close());
    const before = await measureView(host);
    assert.ok(before.waist.length === 1 && before.markers.length === 3);
    const staged = await durable(era);
    assert.ok(staged.ops > 3, 'the measure lane wrote nothing, so this cell measures nothing');

    const result = await admit(era, SEALED, { day: WHEN.day, ...scope });
    assert.equal(result.admitted, true,
      'THE DEFECT: ' + JSON.stringify(result.codes || result.code || result.stage));
    assert.equal(result.view.families.filter(row => row.family === 'F7').length, 3,
      'the three measure records were not answered by their family');

    /* TODAY AND THE GYM CARD, through the SAME consumer today-app adopts by. */
    const state = await importedState(era);
    assert.ok(state, 'the admitted import is not visible to Today');
    assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS,
      'the gym card is not standing on the imported lifts');
    assert.ok(state.reads.length >= 4 && Object.keys(state.sessionLog).length === 3);

    /* THE MEASURE SCREEN, AFTER. Day one has not moved and every trial-column
       input this device holds is byte-identical to what it was. */
    assert.deepEqual(await measureView(host), before,
      'the import moved something the Measure screen reads off this device');
    assert.equal(before.trialStart, WHEN.day);

    /* AND THE BASELINE COLUMN NOW FILLS, from the import's own window. */
    const baseline = baselineOf(state, before.trialStart);
    assert.equal(baseline.length, WEEKS);
    assert.ok(filledWeeks(baseline).length > 0, 'the baseline column stayed empty');
    assert.equal(baselineOf(null, before.trialStart).length, 0,
      'a baseline with no admitted import must be no baseline at all');
  });

test('P3-RM2 (bar b) - THE REVERSE ORDER, import first then Measure: it still admits and the '
  + 'screen behaves IDENTICALLY - same day one, same trial inputs, same baseline column',
  async t => {
    const scope = scopeFor('b');
    const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(WHEN.at), ...scope });
    t.after(() => era.close());
    await firstRun(era, WHEN.day);
    const result = await admit(era, SEALED, { day: WHEN.day, ...scope });
    assert.equal(result.admitted, true,
      JSON.stringify(result.codes || result.code || result.stage));
    assert.equal(result.view.families.some(row => row.family === 'F7'), false,
      'nothing of the measure class exists yet, so F7 must answer for nothing');

    /* NOW he opens Measure, on an installation that already carries a history.
       Day one is still the first ENROLLED record's date - an import writes no
       operation, so there is nothing for it to move. */
    const host = await openMeasure(era);
    t.after(() => host.close());
    const view = await measureView(host);
    assert.equal(view.trialStart, WHEN.day);
    assert.equal(view.firstEnrolled, WHEN.day);

    const state = await importedState(era);
    assert.ok(state, 'the admitted import stopped being visible once Measure opened');
    assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);

    /* IDENTICALLY: the same device, the same records, either order. */
    const other = scopeFor('a-mirror');
    const mirror = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(WHEN.at), ...other });
    t.after(() => mirror.close());
    await firstRun(mirror, WHEN.day);
    const mirrorHost = await openMeasure(mirror);
    t.after(() => mirrorHost.close());
    const admittedFirst = await admit(mirror, SEALED, { day: WHEN.day, ...other });
    assert.equal(admittedFirst.admitted, true,
      JSON.stringify(admittedFirst.codes || admittedFirst.code || admittedFirst.stage));
    const mirrorView = await measureView(mirrorHost);
    const mirrorState = await importedState(mirror);
    for (const member of ['trialStart', 'firstEnrolled', 'markers', 'sets', 'sessionDates', 'foodDays'])
      assert.deepEqual(view[member], mirrorView[member], member + ' depends on the order');
    assert.deepEqual(view.waist.map(row => [row.date, row.in]),
      mirrorView.waist.map(row => [row.date, row.in]), 'the waist rows depend on the order');
    assert.equal(JSON.stringify(state), JSON.stringify(mirrorState),
      'the imported history depends on the order');
    assert.deepEqual(baselineOf(state, view.trialStart),
      baselineOf(mirrorState, mirrorView.trialStart), 'the baseline column depends on the order');
    assert.ok(filledWeeks(baselineOf(state, view.trialStart)).length > 0);
  });

test('P3-RM3 - a MALFORMED measure record on the real installation refuses by NAME and the '
  + 'import is left exactly as it was staged', async t => {
    const scope = scopeFor('c');
    const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(WHEN.at), ...scope });
    t.after(() => era.close());
    await firstRun(era, WHEN.day);
    const host = await openMeasure(era);
    t.after(() => host.close());
    /* A measure record the S5 producer would never have written, appended to
       the real generation with the era's OWN identity key, so it is an
       authentic operation of this installation in every respect EXCEPT that
       its payload is one replay cannot interpret. Anything less would refuse
       on the envelope (LOCAL_SOURCE_ORIGINAL_INVALID) and prove nothing. */
    const loaded = await era.generation();
    const next = JSON.parse(JSON.stringify(loaded.generation));
    const local = readLocalEra(next.metadata);
    const rows = Object.values(next.collections.ops).sort((a, b) => a.device_seq - b.device_seq);
    const prior = rows.at(-1);
    const op = Ops.build({ class: 'body-composition-source', kind: 'fact',
      payload: { profile: 'earned/waist/v1', entry: { date: WHEN.day, in: 900 } },
      op_id: 'TEST-ONLY-malformed-waist', athlete_id: scope.athleteId, device_id: scope.deviceId,
      device_seq: rows.length + 1, predecessor: prior ? prior.op_id : null,
      parents: prior ? [prior.op_id] : [], lease_id: local.lease.lease_id, schema_version: 2,
      effective: { local_date: WHEN.day, local_time: '12:00', utc_offset: '-04:00' } },
    local.identityKey);
    next.collections.ops[op.op_id] = op;
    next.collections.outbox[op.op_id] = { op_id: op.op_id };
    const repository = (await era.client.hostBindings({
      workoutCommands: createMeasureCommands() })).repository;
    await repository.commit(loaded, next, () => null);
    const before = await durable(era);

    const result = await admit(era, SEALED, { day: WHEN.day, ...scope });
    assert.equal(result.admitted, false);
    assert.ok((result.codes || []).includes('LOCAL_SOURCE_MEASURE_UNRESOLVED'),
      JSON.stringify(result.codes || result.code));
    assert.equal((result.codes || []).includes('LOCAL_SOURCE_CONTEXT_UNRESOLVED'), false,
      'the malformed record still reached the catch-all');
    const after = await durable(era);
    /* Custody took the file (that is what `admit` does first, and custody is
       not admission); the refusal leaves it staged and still asking for the
       rebase, so the retract path P3-IMPORT-RETRACT owns has something to
       retract and nothing was adopted. */
    assert.equal(after.imports.length, 1, 'the refused file is no longer staged');
    assert.deepEqual(after.rebaseRequired, after.imports);
    assert.equal(after.applied, false);
    assert.equal(after.basis, false);
    assert.equal(after.ops, before.ops, 'a refusal minted an operation');
  });
