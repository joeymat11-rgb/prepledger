/* P-MEASURE v1, ROUND 3 - the arithmetic core, moved here from
   today/test/machine-settings-ui.test.mjs so that package S4's seal on that
   file is restored (review R2 finding 4). The independent reviewer checked
   these numbers cell for cell against his own hand table in round 2; the two
   round-3 changes are named where they are asserted (findings 5 and 8).
   Pure: no store, no DOM, no clock. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MeasureModel from '../measure-model.mjs';
import MeasureView from '../measure-view.mjs';

const { computeWeek, ONE_RM_FORMULA_NAME, ONE_RM_FORMULA_TEXT, estimate1RM, weekDates,
  weeklyWeightAverage, weeklyWaistValue, waistTrend4Week, sleepQualifyingCount,
  waistRefusalFor, waistFromEntry, WAIST_REFUSALS } = MeasureModel;
const { buildComparisonView, exportText, NO_BASELINE_YET, ONE_RM_NOTE } = MeasureView;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = JSON.parse(fs.readFileSync(path.join(HERE, '../measure-fixture.json'), 'utf8'));
const START = '2026-02-02';
const day = (n) => new Date(Date.UTC(2026, 1, 2 + n)).toISOString().slice(0, 10);

test('P-MEASURE - the 1RM formula is Epley, named in the module and on the screen', () => {
  assert.equal(ONE_RM_FORMULA_NAME, 'epley');
  assert.equal(ONE_RM_FORMULA_TEXT, '1RM = load x (1 + reps / 30)');
  assert.equal(estimate1RM(200, 5), 233.33);
  assert.equal(estimate1RM(225, 5), 262.5);
  assert.equal(estimate1RM(100, 10), 133.33);
  assert.equal(estimate1RM(0, 5), null);
  assert.equal(estimate1RM(100, 0), null);
  assert(ONE_RM_NOTE.includes(ONE_RM_FORMULA_TEXT), 'the screen names a different formula');
  assert(/Epley/.test(ONE_RM_NOTE), 'the screen does not name the formula');
});

/* ROUND 3, FINDING 8. A real rolling mean: a week with six reads is the mean
   of six, not a blank. Null means the window carries NO read at all. */
test('P-MEASURE - the 7 day weight average is a rolling mean over the reads present', () => {
  const full = weekDates(START, 0).map((date, i) => ({ date, lb: 200 + i }));
  assert.equal(weeklyWeightAverage(full, START, 0), 203, 'seven reads: 200..206');
  const six = full.filter((r) => r.date !== day(3));
  assert.equal(weeklyWeightAverage(six, START, 0), 203, 'the mean of 200,201,202,204,205,206');
  assert.equal(weeklyWeightAverage([full[0]], START, 0), 200, 'one read is still an average of one');
  assert.equal(weeklyWeightAverage([], START, 0), null, 'no read in the window');
  assert.equal(weeklyWeightAverage(full, START, 1), null, 'the next week has none of them');
});

/* ROUND 3, FINDING 5. No night in the window is an ABSENCE, not zero. */
test('P-MEASURE - a window with no night reads absent, and one with nights reads its count', () => {
  assert.equal(sleepQualifyingCount([]), null);
  assert.equal(sleepQualifyingCount(undefined), null);
  assert.equal(sleepQualifyingCount([{ date: day(0), clean: false }]), 0, 'a logged bad night is a real zero');
  assert.equal(sleepQualifyingCount([{ date: day(0), clean: true }, { date: day(1), clean: false },
    { date: day(2), clean: true }]), 2);
});

test('P-MEASURE - the weekly waist is the LATEST date inside the week, and its 4 week trend', () => {
  const rows = [{ date: day(0), in: 34.5 }, { date: day(3), in: 34 }];
  assert.equal(weeklyWaistValue(rows, START, 0), 34, 'the later date wins, not the first row');
  assert.equal(weeklyWaistValue(rows, START, 1), null);
  const spread = [{ date: day(0), in: 36 }, { date: day(28), in: 35.2 }];
  assert.equal(waistTrend4Week(spread, START, 4), -0.8);
  assert.equal(waistTrend4Week(spread, START, 3), null, 'week 4 has no window behind it');
  assert.equal(waistTrend4Week([spread[1]], START, 4), null, 'one end of the window is missing');
});

test('P-MEASURE - the waist entry refuses blank, a future date and an out of range value', () => {
  const today = day(10);
  assert.equal(waistRefusalFor({ date: today, in: '' }, today), WAIST_REFUSALS.NOTHING);
  assert.equal(waistRefusalFor({ date: '', in: '' }, today), WAIST_REFUSALS.NOTHING,
    'a blank value is NOTHING whatever the date box says');
  assert.equal(waistRefusalFor({ date: day(11), in: '34' }, today), WAIST_REFUSALS.WEEK_DATE);
  assert.equal(waistRefusalFor({ date: 'nonsense', in: '34' }, today), WAIST_REFUSALS.WEEK_DATE);
  assert.equal(waistRefusalFor({ date: today, in: '9' }, today), WAIST_REFUSALS.OUT_OF_RANGE);
  assert.equal(waistRefusalFor({ date: today, in: '34.567' }, today), WAIST_REFUSALS.OUT_OF_RANGE);
  assert.equal(waistRefusalFor({ date: today, in: '34.5' }, today), null);
  assert.deepEqual(waistFromEntry({ date: today, in: ' 34.5 ' }, today), { date: today, in: 34.5 });
  assert.equal(waistFromEntry({ date: today, in: '' }, today), null);
});

test('P-MEASURE - run in is the week NUMBER, never the position it renders at', () => {
  const rows = [{ week: 3, marker1RM: {} }, { week: 4, marker1RM: {} }];
  const view = buildComparisonView({ trialWeeks: rows, markers: FIXTURE.markers });
  assert.deepEqual(view.trial.map((w) => w.runIn), [false, false],
    'weeks 3 and 4 rendered first were flagged run in');
  const early = buildComparisonView({ trialWeeks: [{ week: 1, marker1RM: {} }, { week: 2, marker1RM: {} }] });
  assert.deepEqual(early.trial.map((w) => w.runIn), [true, true]);
  assert.equal(view.hasBaseline, false);
  assert.equal(view.baselineNote, NO_BASELINE_YET);
});

/* A gapped window driven straight through computeWeek: every null branch of
   every measure executes, and none of them is reached by an empty argument. */
test('P-MEASURE - a gapped window exercises every null branch', () => {
  const reads = [], waist = [], sets = [];
  for (let n = 0; n < 84; n += 1) {
    if (n === 8 || n === 10 || n === 12) continue;
    if (n >= 56 && n < 63) continue;
    reads.push({ date: day(n), lb: 200 - 0.1 * n });
  }
  for (let w = 0; w < 12; w += 1) {
    if (w === 3) continue;
    waist.push({ date: day(w * 7), in: 36 - 0.1 * w });
  }
  for (let w = 0; w < 12; w += 1) {
    if (w !== 5) sets.push({ date: day(w * 7 + 1), marker: 'Bench', load: 135 + w, reps: 8 });
    sets.push({ date: day(w * 7 + 3), marker: 'Squat', load: 225 + w, reps: 5 });
  }
  const week = (i, extra = {}) => computeWeek({ startDate: START, index: i, reads,
    waistRows: waist, sets, markers: ['Squat', 'Bench'], sessionsCompleted: 3,
    sessionsPlanned: 3, foodDaysLogged: 7, energyDaysLogged: 7,
    nights: weekDates(START, i).map((date) => ({ date, clean: true })), ...extra });
  assert.equal(week(1).weightAvg !== null, true, 'four reads still average');
  assert.equal(week(8).weightAvg, null, 'a week with no read at all');
  assert.equal(week(3).waist, null, 'the week never measured');
  assert.equal(week(7).waistTrend4Week, null, 'the far end of the window is missing');
  assert.equal(week(5).marker1RM.Bench, null, 'the marker with no set that week');
  assert.equal(week(5).marker1RM.Squat, 268.33, 'and the other marker still reads: 230 x (1 + 5/30)');
  assert.equal(week(0, { nights: [] }).sleepQualifyingNights, null);
  assert.equal(week(0, { sessionsPlanned: 0 }).trainingAdherencePct, null);
});
