/* P-MEASURE v1, ROUND 3 - the durable lane, over the REAL encrypted repository
   (fake-indexeddb) under the accepted durable public client. Moved here from
   today/test/machine-settings-ui.test.mjs to restore package S4's seal on that
   file, and extended with the trial-start fact round 3 adds. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createMeasureHost, waistRowsIn, measureMarkersIn, trialStartIn,
  firstEnrolledDateIn, PROFILE, MARKERS_PROFILE, TRIAL_PROFILE } from '../measure-host.mjs';
import MeasureCommands from '../measure-commands.cjs';

const DAY = '2026-03-25';
const { markersOf, trialStartOf, prepareTrialStart, TRIAL_ACTION } = MeasureCommands;
const open = (fault, day = DAY) =>
  createMeasureHost({ day, indexedDB: fault.indexedDB, crypto: webcrypto });

test('P-MEASURE - a waist entry is ONE real op, with an op id and a device sequence', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  const saved = await host.save({ date: '2026-01-05', in: 34.5 });
  assert.equal(saved.ok, true, saved.code || '');
  assert(typeof saved.op_id === 'string' && saved.op_id.length > 0);
  const rows = await host.all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].date, '2026-01-05');
  assert.equal(rows[0].in, 34.5);
  assert(rows[0].device_seq > 0, 'the row carries no device sequence');
  /* A correction is a NEW op; the projector decides which wins for the date. */
  const again = await host.save({ date: '2026-01-05', in: 35 });
  assert.equal(again.ok, true);
  const after = await host.all();
  assert.equal(after.length, 2, 'a correction replaced the record instead of appending');
  assert.equal(after[after.length - 1].in, 35);
  host.close();
});

test('P-MEASURE - the store refuses a future waist date on its own account', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  const result = await host.save({ date: '2099-01-01', in: 34 });
  assert.equal(result.ok, false);
  assert.deepEqual(await host.all(), []);
  host.close();
});

test('P-MEASURE - the markers pick is recorded ONCE and refused a second time', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  assert.equal(await host.markers(), null, 'a fresh device already carries a pick');
  const first = await host.saveMarkers(['Back Squat', 'Bench Press', 'Deadlift']);
  assert.equal(first.ok, true, first.code || '');
  assert.deepEqual(await host.markers(), ['Back Squat', 'Bench Press', 'Deadlift']);
  const second = await host.saveMarkers(['Overhead Press', 'Row', 'Chin-up']);
  assert.equal(second.ok, false);
  assert.equal(second.code, 'MEASURE_MARKERS_ALREADY_RECORDED');
  assert.deepEqual(await host.markers(), ['Back Squat', 'Bench Press', 'Deadlift'],
    'the second pick changed the stored one');
  host.close();
});

test('P-MEASURE - the producer refuses fewer than three markers, more than four, and a repeat', () => {
  assert.throws(() => markersOf(['One', 'Two']), /WAIST_INPUT_INVALID/);
  assert.throws(() => markersOf(['One', 'Two', 'Three', 'Four', 'Five']), /WAIST_INPUT_INVALID/);
  assert.throws(() => markersOf(['One', 'One', 'Two']), /WAIST_INPUT_INVALID/);
  assert.deepEqual(markersOf([' One ', 'Two', 'Three']), ['One', 'Two', 'Three']);
});

test('P-MEASURE - trial day one is written once, and a later day never re-bases it', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  /* Nothing recorded yet: there is no first record, so there is no day one and
     nothing at all is written. */
  assert.equal(await host.firstEnrolledDate(), null);
  assert.equal(await host.ensureTrialStart(), null);
  assert.equal(await host.trialStart(), null, 'a day one was invented from the clock');

  await host.save({ date: '2026-01-05', in: 34.5 });
  const first = await host.firstEnrolledDate();
  assert.equal(first, DAY, 'the first record on this device is the waist op written today');
  assert.equal(await host.ensureTrialStart(), DAY);
  const persisted = await host.trialStart();
  assert.equal(persisted, DAY);
  host.close();

  /* A WHOLE NEW LANE, days later, over the same store: unchanged. */
  const later = await open(fault, '2026-06-01');
  assert.equal(await later.trialStart(), DAY, 'a new lane read a different day one');
  assert.equal(await later.ensureTrialStart(), DAY, 'ensure re-based the window');
  assert.equal(await later.trialStart(), DAY);
  later.close();
});

test('P-MEASURE - the trial start producer refuses a start after the day it is recorded on', () => {
  assert.throws(() => trialStartOf('not-a-date'), /WAIST_INPUT_INVALID/);
  assert.throws(() => trialStartOf('2026-02-30'), /WAIST_INPUT_INVALID/);
  const action = prepareTrialStart({ action: TRIAL_ACTION, input: { start: '2026-01-05' } });
  assert.equal(action.payload.profile, TRIAL_PROFILE);
  assert.equal(action.payload.start, '2026-01-05');
});

test('P-MEASURE - the three profiles are read apart in ONE generation', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  await host.save({ date: '2026-01-05', in: 34.5 });
  await host.saveMarkers(['Back Squat', 'Bench Press', 'Deadlift']);
  await host.ensureTrialStart();
  const generation = (await host.repository.load()).generation;
  assert.equal(waistRowsIn(generation, PROFILE).length, 1, 'the waist reader took another profile\'s op');
  assert.equal(measureMarkersIn(generation, MARKERS_PROFILE).length, 1);
  assert.equal(trialStartIn(generation, TRIAL_PROFILE), DAY);
  assert.equal(firstEnrolledDateIn(generation), DAY);
  /* All three are in the same sealed generation under the same lease. */
  const ops = Object.values(generation.collections.ops || {});
  assert.equal(ops.length, 3);
  assert.equal(new Set(ops.map((op) => op.lease_id)).size, 1, 'a second lease was minted');
  host.close();
});

test('P-MEASURE - a device with no session set reads no set and no session date', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  assert.deepEqual(await host.sets(), []);
  assert.deepEqual(await host.sessionDates(), []);
  assert.deepEqual(await host.foodDays(), []);
  host.close();
});

/* E2a (PM, the E2 scope; no engine change). The body-fat band and the body
   profile are ONE real op per save, in the same generation under the same lease,
   read back from the durable record. An answer can be changed (the PM's ruling
   on E2a, as steps): a second save is a NEW op, the first stays on record, and
   the latest wins; "I don't know" and "Not now" are answers like any other.
   Every value is invented. Red first: on 3d13efe the host has no such methods. */
test('E2A-L1 - the body-fat band is ONE op per save and the latest wins; "I don\'t know" is an answer that can be changed', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  assert.equal(await host.bodyFatBand(), null, 'a fresh device already carries a band');
  const first = await host.saveBodyFatBand({ low: 12, high: 15, source: 'self-estimate', table: 'men' });
  assert.equal(first.ok, true, first.code || '');
  assert(typeof first.op_id === 'string' && first.op_id.length > 0);
  const kept = await host.bodyFatBand();
  assert.deepEqual([kept.low, kept.high, kept.source, kept.table, kept.op_id], [12, 15, 'self-estimate', 'men', first.op_id]);
  const unsure = await host.saveBodyFatBand({ low: null, high: null, source: 'unknown', table: null });
  assert.equal(unsure.ok, true, unsure.code || '');
  assert.deepEqual({ ...(await host.bodyFatBand()) }, { op_id: unsure.op_id, low: null, high: null, source: 'unknown', table: null }, 'the latest save wins');
  const again = await host.saveBodyFatBand({ low: 20, high: 24, source: 'self-estimate', table: 'women' });
  assert.equal(again.ok, true, again.code || '');
  assert.deepEqual([(await host.bodyFatBand()).low, (await host.bodyFatBand()).table, (await host.bodyFatBand()).op_id], [20, 'women', again.op_id],
    'I don\'t know was changed, and the table it came from is kept');
  const ops = Object.values((await host.repository.load()).generation.collections.ops || {});
  assert.equal(ops.length, 3, 'each save is a new op and none is edited away');
  /* a band the table does not hold is refused by the store on its own account, and nothing is written */
  const refused = await host.saveBodyFatBand({ low: 13, high: 17, source: 'self-estimate', table: 'men' });
  assert.equal(refused.ok, false);
  assert.equal((await host.bodyFatBand()).op_id, again.op_id, 'a refused save moved the answer');
  host.close();
});

test('E2A-L2 - height and sex are ONE op per save and the latest wins; "Not now" is kept and changeable; every profile is read apart', async () => {
  const fault = faultDatabase();
  const host = await open(fault);
  assert.equal(await host.bodyProfile(), null);
  const skipped = await host.saveBodyProfile({ sex: null, height: null });
  assert.equal(skipped.ok, true, 'Not now is an answer the store keeps: ' + (skipped.code || ''));
  assert.deepEqual([(await host.bodyProfile()).sex, (await host.bodyProfile()).height], [null, null]);
  const saved = await host.saveBodyProfile({ sex: 'male', height: { value: 70, unit: 'in' } });
  assert.equal(saved.ok, true, saved.code || '');
  const kept = await host.bodyProfile();
  assert.deepEqual([kept.sex, kept.height, kept.op_id], ['male', { value: 70, unit: 'in' }, saved.op_id], 'Not now was changed');
  await host.saveBodyFatBand({ low: 12, high: 15, source: 'self-estimate', table: 'men' });
  await host.save({ date: '2026-01-05', in: 34.5 });
  const generation = (await host.repository.load()).generation;
  assert.equal(waistRowsIn(generation, PROFILE).length, 1, 'the waist reader took a body op');
  assert.equal(measureMarkersIn(generation, MARKERS_PROFILE).length, 0);
  const ops = Object.values(generation.collections.ops || {});
  assert.equal(ops.length, 4);
  assert.equal(new Set(ops.map((op) => op.lease_id)).size, 1, 'a second lease was minted');
  for (const op of ops) assert.deepEqual([op.class, op.kind], ['body-composition-source', 'fact']);
  host.close();
  /* a later lane over the same store reads the same latest answer */
  const later = await open(fault, '2026-06-01');
  assert.equal((await later.bodyProfile()).op_id, saved.op_id);
  later.close();
});
