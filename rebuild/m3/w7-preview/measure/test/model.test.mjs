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

/* E2a (PM, the E2 scope; no engine change). The producer's two once-only facts,
   the words Measure says them back in, the height boxes, and the import side's
   family, class and register, all pure: no store, no DOM, no clock, no engine.
   Every value is invented. Red first: on 3d13efe none of it exists. */
const Commands = (await import('../measure-commands.cjs')).default;
const MeasureReplay = (await import('../../../../m4/import/measure-replay.cjs')).default;
const BodyComposition = (await import('../../../../m4/import/body-composition-class.cjs')).default;
const Registry = (await import('../../../../m4/import/replay-registry.cjs')).default;

test('E2A.1 - the band producer keeps the ten bands and "I don\'t know", and nothing else', () => {
  const { prepareBand, bandOf, BAND_PROFILE, BAND_ACTION, BANDS, BAND_TABLES } = Commands;
  assert.deepEqual({ ...BAND_TABLES }, { male: 'men', female: 'women' }, 'the table a band came from, as the payload names it');
  assert.equal(BAND_PROFILE, 'earned/body-fat-band/v1');
  assert.deepEqual(BANDS.male.map((b) => [...b]), [[8, 11], [12, 15], [16, 20], [21, 25], [26, null]], 'the PM\'s bands for men');
  assert.deepEqual(BANDS.female.map((b) => [...b]), [[15, 19], [20, 24], [25, 29], [30, 34], [35, null]], 'the PM\'s bands for women');
  for (const [table, [low, high]] of [...BANDS.male.map((b) => ['men', b]), ...BANDS.female.map((b) => ['women', b])]) {
    const op = prepareBand({ action: BAND_ACTION, input: { band: { low, high, source: 'self-estimate', table } } });
    assert.deepEqual(op.payload, { profile: BAND_PROFILE, low, high, source: 'self-estimate', table },
      'the band low/high, where it came from and which table (Fable on E2a, D1)');
    assert.deepEqual([op.class, op.kind], ['body-composition-source', 'fact']);
  }
  assert.deepEqual(bandOf({ low: null, high: null, source: 'unknown', table: null }), { low: null, high: null, source: 'unknown', table: null });
  /* D3: either table is kept whatever sex is recorded; the band need only be a row of the table it names */
  assert.equal(bandOf({ low: 15, high: 19, source: 'self-estimate', table: 'women' }).table, 'women');
  for (const wrong of [{ low: 13, high: 15, source: 'self-estimate', table: 'men' }, { low: 26, high: 30, source: 'self-estimate', table: 'men' },
    { low: 12, high: 15, source: 'self-estimate', table: 'women' }, { low: 15, high: 19, source: 'self-estimate', table: 'men' },
    { low: 12, high: 15, source: 'self-estimate' }, { low: 12, high: 15, source: 'self-estimate', table: 'male' },
    { low: 12, high: 15, source: 'self-estimate', table: null }, { low: null, high: null, source: 'unknown', table: 'men' },
    { low: null, high: null, source: 'unknown' },
    { low: 12, high: 15, source: 'unknown', table: 'men' }, { low: 12, high: 15, source: 'dexa', table: 'men' }, { low: 12, high: 15, table: 'men' },
    { low: null, high: null, source: 'self-estimate', table: 'men' }, { low: 12, high: 15, source: 'self-estimate', table: 'men', point: 13 }])
    assert.throws(() => bandOf(wrong), /BODY_INPUT_INVALID/, JSON.stringify(wrong));
  const commands = Commands.createMeasureCommands();
  const op = { ...commands.prepare({ action: BAND_ACTION, input: { band: { low: 26, high: null, source: 'self-estimate', table: 'men' } } }),
    effective: { local_date: '2026-03-25' }, causal_parents: [], athlete_id: 'TEST-ONLY' };
  assert.equal(commands.validate(op, () => null), true, 'the store accepts the envelope the producer built');
  assert.equal(commands.validate({ ...op, payload: { ...op.payload, high: 30 } }, () => null), false, 'and refuses a band outside the table');
  assert.equal(commands.validate({ ...op, payload: { ...op.payload, note: 'x' } }, () => null), false, 'and a member it does not know');
  assert.equal(commands.validate({ ...op, payload: { ...op.payload, table: 'women' } }, () => null), false, 'and a band from another table than it names');
  const { table: _gone, ...noTable } = op.payload;
  assert.equal(commands.validate({ ...op, payload: noTable }, () => null), false, 'and a band that does not say its table (five members exactly)');
});

test('E2A.2 - the body profile producer keeps sex and height, each optional, and refuses anything else', () => {
  const { prepareBody, bodyOf, BODY_PROFILE, BODY_ACTION } = Commands;
  assert.equal(BODY_PROFILE, 'earned/body-profile/v1');
  assert.deepEqual(prepareBody({ action: BODY_ACTION, input: { body: { sex: 'female', height: { value: 64.5, unit: 'in' } } } }).payload,
    { profile: BODY_PROFILE, sex: 'female', height: { value: 64.5, unit: 'in' } });
  for (const sex of ['male', 'female', 'prefer-not-to-say', null]) assert.equal(bodyOf({ sex, height: null }).sex, sex);
  assert.deepEqual(bodyOf({ sex: null, height: null }), { sex: null, height: null }, '"Not now" is a record');
  assert.deepEqual(bodyOf({ sex: null, height: { value: 178, unit: 'cm' } }).height, { value: 178, unit: 'cm' }, 'a height in centimetres is kept in its own unit');
  for (const wrong of [{ sex: 'other', height: null }, { sex: 'male' }, { height: null },
    { sex: 'male', height: { value: 35, unit: 'in' } }, { sex: 'male', height: { value: 97, unit: 'in' } },
    { sex: 'male', height: { value: 70.25, unit: 'in' } }, { sex: 'male', height: { value: 70, unit: 'ft' } },
    { sex: 'male', height: { value: 250, unit: 'cm' } }, { sex: 'male', height: 70 }, { sex: 'male', height: null, age: 40 }])
    assert.throws(() => bodyOf(wrong), /BODY_INPUT_INVALID/, JSON.stringify(wrong));
});

test('E2A.3 - the height boxes, and the words Measure says back: "Body fat: 12-15% (your estimate)"', () => {
  const { heightFromEntry } = MeasureModel;
  assert.deepEqual(heightFromEntry({ feet: '5', inches: '10' }), { ok: true, height: { value: 70, unit: 'in' } });
  assert.deepEqual(heightFromEntry({ feet: ' 5 ', inches: '' }), { ok: true, height: { value: 60, unit: 'in' } });
  assert.deepEqual(heightFromEntry({ feet: '5', inches: '4.5' }), { ok: true, height: { value: 64.5, unit: 'in' } });
  assert.deepEqual(heightFromEntry({ feet: '8', inches: '0' }), { ok: true, height: { value: 96, unit: 'in' } });
  assert.deepEqual(heightFromEntry({ feet: '', inches: '' }), { ok: true, height: null }, 'no height is an answer');
  for (const [feet, inches] of [['2', '11'], ['9', '0'], ['5', '12'], ['5', '10.25'], ['', '10'], ['five', ''], ['8', '1']])
    assert.equal(heightFromEntry({ feet, inches }).ok, false, feet + ' ft ' + inches + ' in');
  assert.equal(MeasureView.bandSaid({ low: 12, high: 15, source: 'self-estimate' }), 'Body fat: 12-15% (your estimate)');
  assert.equal(MeasureView.bandSaid({ low: 35, high: null, source: 'self-estimate' }), 'Body fat: 35% or more (your estimate)');
  assert.equal(MeasureView.bandSaid({ low: null, high: null, source: 'unknown' }), 'Body fat: not known');
  assert.equal(MeasureView.heightWords({ value: 70, unit: 'in' }), '5 ft 10 in');
  assert.equal(MeasureView.heightWords({ value: 64.5, unit: 'in' }), '5 ft 4.5 in');
  assert.equal(MeasureView.heightWords({ value: 178, unit: 'cm' }), '178 cm');
  assert.deepEqual(MeasureView.bodySaid({ sex: 'prefer-not-to-say', height: { value: 70, unit: 'in' } }),
    ['Height: 5 ft 10 in', 'Sex: Prefer not to say']);
  assert.deepEqual(MeasureView.bodySaid({ sex: null, height: null }), ['Height and sex: not given'],
    '"Not now" is said back, so it can be changed');
  assert.deepEqual(MeasureView.bodySaid({ sex: 'female', height: null }), ['Sex: Female'], 'one line per answer given');
  /* Fable on E2a, D2: a height is said back in the unit it was stored in; centimetres stay centimetres */
  assert.deepEqual(MeasureView.bodySaid({ sex: null, height: { value: 178, unit: 'cm' } }), ['Height: 178 cm']);
  assert.deepEqual(MeasureView.bodySaid({ sex: 'male', height: { value: 182.5, unit: 'cm' } }), ['Height: 182.5 cm', 'Sex: Male']);
  for (const set of ['male', 'female']) {
    assert.equal(MeasureView.BAND_LINES[set].length, Commands.BANDS[set].length, 'one plain line per band: ' + set);
    for (const line of MeasureView.BAND_LINES[set]) assert.match(line, /^[A-Z][^\u2013\u2014]*\.$/, 'one plain sentence: ' + line);
  }
});

test('E2A.4 - import: F7 retains the band and the body profile, the class routes them to F7, and the register names them', () => {
  const commands = Commands.createMeasureCommands();
  const PROFILES = { waist: Commands.PROFILE, markers: Commands.MARKERS_PROFILE, trialStart: Commands.TRIAL_PROFILE,
    bodyFatBand: Commands.BAND_PROFILE, bodyProfile: Commands.BODY_PROFILE };
  const family = MeasureReplay.createMeasureReplayFamily({ commands, profiles: PROFILES });
  const at = { readOperation: () => ({ athlete_id: 'TEST-ONLY' }), asOf: '2026-03-25' };
  const op = (id, payload, seq) => ({ op_id: id, class: 'body-composition-source', kind: 'fact', device_seq: seq,
    athlete_id: 'TEST-ONLY', causal_parents: [], effective: { local_date: '2026-03-24', local_time: '09:00', utc_offset: '-04:00' }, payload });
  const rows = [op('band', { profile: Commands.BAND_PROFILE, low: 12, high: 15, source: 'self-estimate', table: 'men' }, 1),
    op('body', { profile: Commands.BODY_PROFILE, sex: 'male', height: { value: 70, unit: 'in' } }, 2),
    op('bad-band', { profile: Commands.BAND_PROFILE, low: 15, high: 19, source: 'self-estimate', table: 'men' }, 3),
    op('bad-body', { profile: Commands.BODY_PROFILE, sex: 'other', height: null }, 4)];
  const out = family.replay(rows, at);
  assert.deepEqual(out.families.map((r) => [r.op_id, r.state, r.measure, r.dated, r.dated_member]), [
    ['band', 'retained', 'body-fat-band', '2026-03-24', 'effective.local_date'],
    ['body', 'retained', 'body-profile', '2026-03-24', 'effective.local_date']], 'retained, never projected, dated by the day recorded');
  assert.deepEqual(out.issues.map((r) => [r.op_id, r.code]),
    [['bad-band', 'LOCAL_SOURCE_MEASURE_UNRESOLVED'], ['bad-body', 'LOCAL_SOURCE_MEASURE_UNRESOLVED']], 'malformed refuses by the family\'s name');
  /* the class routes both profiles to F7 once they are claimed; unclaimed (3d13efe's three), it refuses them in its own name */
  const member = (profiles) => BodyComposition.createBodyCompositionClass({ members: [{ family: 'F7', profiles,
    replay: MeasureReplay.createMeasureReplayFamily({ commands, profiles: PROFILES }).replay }] });
  const five = Object.values(PROFILES);
  const routed = member(five).replay(rows.slice(0, 2), at);
  assert.deepEqual(routed.issues, [], 'a band or a body profile was refused by the class');
  assert.equal(routed.families.length, 2);
  const three = member(five.slice(0, 3)).replay(rows.slice(0, 2), at);
  assert.deepEqual(three.issues.map((r) => r.code), ['LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED', 'LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED'],
    'the control: unclaimed, the two would refuse the import');
  /* the register and the admission controller name exactly the producer's five profiles */
  const entry = Registry.ENTRIES.find((e) => e.module === 'rebuild/m3/w7-preview/measure/measure-commands.cjs');
  assert.deepEqual([...entry.profiles].sort(), [...five].sort(), 'the register');
  const admission = fs.readFileSync(path.join(HERE, '../../../w6/local/source-admission.mjs'), 'utf8');
  assert.match(admission, /bodyFatBand:Measure\.BAND_PROFILE,bodyProfile:Measure\.BODY_PROFILE\}\}\);/, 'the family admission builds');
  assert.match(admission, /profiles:\[Measure\.PROFILE,Measure\.MARKERS_PROFILE,Measure\.TRIAL_PROFILE,Measure\.BAND_PROFILE,Measure\.BODY_PROFILE\]/, 'the class admission builds');
});
