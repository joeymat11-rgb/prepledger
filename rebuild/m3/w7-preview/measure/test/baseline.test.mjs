/* P-MEASURE v1, ROUND 3 - BAR ITEM (c), EXECUTED.
   The baseline window: "No baseline yet" with no import, and after a synthetic
   C2b import admitted through local-source-basis.mjs, ALL SEVEN section-2
   measures rendered from the imported per-day and per-lift history. Review R2
   finding 5: round 2 read two of the seven and printed a fabricated "0/7" for
   sleep over a history it had never read. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM, FIXTURE, createTodayModel } from './support.mjs';
import { admittedLocalSourceBasis } from '../../today/local-source-basis.mjs';
import { baselineWeeks, baselineWeeksFromState } from '../measure-baseline.mjs';
import MeasureView from '../measure-view.mjs';

const TRIAL_START = FIXTURE.trialStart;          /* 2026-01-05 */
const WEEKS = 8;
const MARKERS = FIXTURE.markers;
const engine = createTodayModel({}).engine;
const iso = (n) => new Date(Date.UTC(2025, 10, 10 + n)).toISOString().slice(0, 10);
/* 2025-11-10 is a Monday, and 56 days before the trial starts, so these eight
   weeks are exactly the baseline window measure-baseline.mjs computes. */
assert.equal(iso(0), '2025-11-10');
assert.equal(iso(56), TRIAL_START);

/* A SYNTHETIC frozen-app history in the members the import replays: per-day
   weight, waist, sleep hours, calories and protein, and per-lift loads and
   reps. Every figure is invented. */
function importedState() {
  const reads = [], waist = [], nights = [], dailyLogs = {}, sessionLog = {};
  for (let n = 0; n < 56; n += 1) {
    const date = iso(n), weekday = new Date(Date.parse(date)).getUTCDay();
    if (n % 9 !== 3) reads.push({ d: date, w: Math.round((210 - 0.12 * n) * 10) / 10 });
    if (weekday === 1) waist.push({ d: date, in: Math.round((38 - 0.15 * (n / 7)) * 10) / 10 });
    nights.push({ d: date, h: n % 11 === 5 ? 6 : 7.5 });
    dailyLogs[date] = { cal: n % 8 === 2 ? null : 2600, pro: 165, steps: 9000 };
    if (weekday === 1 || weekday === 5) {
      sessionLog[date] = { entries: [{ id: 'bench-press', w: 120 + n, reps: [6, 6, 5] }] };
    }
    if (weekday === 3) {
      sessionLog[date] = { entries: [
        { id: 'back-squat', w: 200 + n, reps: [5, 5] },
        { id: 'deadlift', w: 250 + n, reps: [3, 3] }] };
    }
  }
  return { athlete_label: null, exercises: MARKERS.map((n2) => ({ id: FIXTURE.liftIds[n2], n: n2 })),
    reads, waist, sleep: { nights, cleanH: 7.5, needed: 3 }, dailyLogs, sessionLog,
    split: [{ from: iso(0), map: FIXTURE.splitMap }] };
}

/* The C2b commit shape admittedLocalSourceBasis itself requires: a commit
   marker naming the active selection, a ready derived view with no issue, and
   three byte-identical copies of the same basis record. */
function admittedGeneration(state) {
  const basis = { installation_id: 'ns-1', imported_at: '2025-12-30' };
  const view = { ready: true, pending: false, issues: [], state, basis };
  return { metadata: {
    localSourceApplication: { core_complete: true, selection_id: 'sel-1', basis },
    localSources: { active: 'sel-1' } },
    collections: { derived: { localSource: { view, basis } } } };
}
const setupFor = (generation) => ({ athleteLabel: () => null,
  host: { repository: { load: async () => ({ generation }) }, namespace: null } });

test('P-MEASURE (c) - with no import the baseline is empty and the screen says so', async () => {
  const none = await baselineWeeks(setupFor({}), TRIAL_START, WEEKS, MARKERS, engine);
  assert.deepEqual(none, [], 'a baseline was invented with no admitted import');
  const dom = new JSDOM('<main></main>');
  const view = MeasureView.buildComparisonView({ baselineWeeks: none, trialWeeks: [], markers: MARKERS });
  const root = MeasureView.mountMeasureComparison(dom.window.document,
    dom.window.document.querySelector('main'), view);
  const note = root.querySelector('[data-slot="measure-baseline-note"]');
  assert.equal(note.hidden, false);
  assert.equal(note.textContent, MeasureView.NO_BASELINE_YET);
  assert.match(note.textContent, /Baseline window: the last 8 to 12 complete weeks/);
  assert.equal(root.querySelector('[data-slot="measure-baseline-table"]'), null,
    'a baseline table was rendered with no baseline');
});

test('P-MEASURE (c) - after a synthetic C2b import the baseline renders all seven measures', async () => {
  const state = importedState();
  const generation = admittedGeneration(state);
  assert(admittedLocalSourceBasis(generation, { athleteLabel: null, namespace: null }),
    'the synthetic import was not admitted, so this cell would prove nothing');
  const weeks = await baselineWeeks(setupFor(generation), TRIAL_START, WEEKS, MARKERS, engine);
  assert.equal(weeks.length, WEEKS);

  const dom = new JSDOM('<main></main>');
  const doc = dom.window.document;
  const view = MeasureView.buildComparisonView({ baselineWeeks: weeks, trialWeeks: [], markers: MARKERS });
  const root = MeasureView.mountMeasureComparison(doc, doc.querySelector('main'), view);
  const table = root.querySelector('[data-slot="measure-baseline-table"]');
  assert(table, 'no baseline table rendered');
  const rows = [...table.querySelectorAll('tbody tr')]
    .map((tr) => [...tr.querySelectorAll('th,td')].map((cell) => cell.textContent));
  assert.equal(rows.length, WEEKS);

  /* EVERY ONE of the ten measure columns carries a figure in every baseline
     week: not one of them reads "Not enough data yet", and NONE of them is a
     fabricated zero. Round 2 rendered eight absences and a false "0/7". */
  const TREND = 3;   /* the waist 4 week trend, which has no window behind it until week 5 */
  rows.forEach((row, index) => {
    assert.equal(row.length, 11, 'a baseline row is not the full table width');
    for (let column = 1; column < row.length; column += 1) {
      if (column === TREND && index < 4) continue;
      assert.notEqual(row[column], 'Not enough data yet',
        row[0] + ' column ' + column + ' is absent in the imported window');
    }
  });
  assert.notEqual(rows[4][TREND], 'Not enough data yet',
    'the imported waist trend never reads once its window is full');
  assert.equal(rows[0][7].endsWith('/7'), true, 'the sleep column is not a count');
  assert.notEqual(rows[0][7], '0/7', 'the imported sleep column is a fabricated zero');
});

test('P-MEASURE (c) - a measure the frozen app never carried reads ABSENT, never zero', async () => {
  const state = importedState();
  /* A frozen app with no sleep and no food at all: the two measures plan
     section 3 says may start at zero are still not INVENTED here. */
  const bare = { ...state, sleep: { nights: [] }, dailyLogs: {} };
  const weeks = baselineWeeksFromState(bare, TRIAL_START, WEEKS, MARKERS, engine);
  assert.equal(weeks[0].sleepQualifyingNights, null, 'no nights read as zero qualifying nights');
  assert.equal(weeks[0].foodAdherencePct, 0, 'a day log that exists and is empty is a real zero');
  const noLogs = baselineWeeksFromState({ ...state, dailyLogs: undefined },
    TRIAL_START, WEEKS, MARKERS, engine);
  assert.equal(noLogs[0].foodAdherencePct, null, 'a history with no day log at all reads absent');
  assert.equal(weeks[0].weightAvg !== null, true, 'the weight column still reads');
});

test('P-MEASURE (c) - the baseline window is the eight complete weeks BEFORE day one', async () => {
  const weeks = baselineWeeksFromState(importedState(), TRIAL_START, WEEKS, MARKERS, engine);
  assert.equal(weeks[0].dates[0], iso(0), 'the window does not start 56 days before day one');
  assert.equal(weeks[WEEKS - 1].dates[6], iso(55), 'the window runs past the day before day one');
  assert(weeks.every((w) => w.dates.every((d) => d < TRIAL_START)),
    'a baseline week reaches into the trial');
});
