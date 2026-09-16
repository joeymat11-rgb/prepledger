/* P-MEASURE v1, ROUND 3 - BAR ITEM (b), EXECUTED.
   The four adherence percentages against the committed fixture, including the
   partial week the athlete is standing in (an elapsed-day denominator, review
   R1 finding 6) and the clamp (review R1 finding 7). Pure: this file opens no
   store, and the rows it reads are the SAME committed entries the journey cell
   drove through the real commands. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { weeksFromState, plannedSessionsIn, loggedDaysFromRows } from '../measure-sources.mjs';
import { trainingAdherencePct, loggingAdherencePct, elapsedDaysInWeek, weekDates } from '../measure-model.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURE = JSON.parse(fs.readFileSync(path.join(HERE, '../measure-fixture.json'), 'utf8'));
const SPLIT = [{ from: FIXTURE.trialStart, map: FIXTURE.splitMap }];
const EXERCISES = FIXTURE.markers.map((name) => ({ id: FIXTURE.liftIds[name], n: name }));

/* The state the trial window is read from, in the engine's own member names.
   Nothing here is derived: every row is the fixture's own entry. */
function fixtureState() {
  return {
    reads: FIXTURE.entries.reads.map((r) => ({ d: r.date, w: r.lb })),
    sleep: { nights: FIXTURE.entries.nights.map((n) => ({ d: n.date, h: n.hours })) },
    sessionLog: {}, dailyLogs: {}, split: SPLIT, exercises: EXERCISES,
  };
}
const foodRows = () => FIXTURE.entries.food
  .map((r) => ({ date: r.date, day: { cal: r.cal, pro: r.pro } }));
const sessionDates = () => [...new Set(FIXTURE.entries.sessions.map((s) => s.date))];
const sets = () => FIXTURE.entries.sessions
  .map((s) => ({ date: s.date, marker: s.id, load: s.load, reps: s.reps }));

const cellsOf = (week) => [week.trainingAdherencePct, week.foodAdherencePct, week.energyAdherencePct];
const expectedOf = (row) => row.cells.slice(3, 6)
  .map((text) => (text === 'Not enough data yet' ? null : Number(text.replace(' %', ''))));

test('P-MEASURE (b) - every weekly adherence percentage matches the committed table', async () => {
  const weeks = weeksFromState({ state: fixtureState(), startDate: FIXTURE.trialStart,
    weeks: FIXTURE.weeks, markers: FIXTURE.markers, today: FIXTURE.today,
    waistRows: FIXTURE.entries.waist, sets: sets(), sessionDates: sessionDates(),
    foodRows: foodRows() });
  assert.equal(weeks.length, FIXTURE.weeks);
  for (const row of FIXTURE.expected) {
    assert.deepEqual(cellsOf(weeks[row.week - 1]), expectedOf(row), 'week ' + row.week);
  }
  /* The weeks the fixture exists to exercise, named so a silent change to any
     one of them cannot pass as "the table still matches itself". */
  assert.deepEqual(cellsOf(weeks[2]), [100, 100, 57.1], 'week 3: energy logged on 4 of 7 days');
  assert.deepEqual(cellsOf(weeks[4]), [100, 71.4, 71.4], 'week 5: 5 of 7 days logged');
  assert.deepEqual(cellsOf(weeks[6]), [33.3, 100, 100], 'week 7: one session of three planned');
});

test('P-MEASURE (b) - the last week divides by the days that have ELAPSED, not by seven', async () => {
  const state = fixtureState();
  const dates = weekDates(FIXTURE.trialStart, 11);
  assert.equal(elapsedDaysInWeek(dates, FIXTURE.today), 3, 'the partial week is three days old');
  assert.equal(plannedSessionsIn(state, dates.filter((d) => d <= FIXTURE.today)), 2,
    'two of the three planned days have come round');
  const logged = loggedDaysFromRows(foodRows(), dates.filter((d) => d <= FIXTURE.today));
  assert.deepEqual(logged, { food: 3, energy: 3 });
  /* 3 of 3 elapsed days is 100 percent, never 42.9. */
  assert.equal(loggingAdherencePct(logged.food, 3), 100);
  assert.equal(loggingAdherencePct(logged.food, 7), 42.9, 'the hardcoded seven would read this');
});

test('P-MEASURE (b) - more sessions or more logged days than were possible read 100, never past it', async () => {
  assert.equal(trainingAdherencePct(4, 3), 100, 'a fourth session in a three-day week');
  assert.equal(loggingAdherencePct(8, 7), 100, 'an eighth logged day in a seven-day week');
  /* And through the window reader, over a week whose log carries a session on
     every one of its seven days against a three-session plan. */
  const state = fixtureState();
  const everyDay = weekDates(FIXTURE.trialStart, 0);
  const weeks = weeksFromState({ state, startDate: FIXTURE.trialStart, weeks: 1,
    markers: FIXTURE.markers, sets: sets(), sessionDates: everyDay,
    foodRows: everyDay.map((date) => ({ date, day: { cal: 2300, pro: 170 } })) });
  assert.equal(weeks[0].trainingAdherencePct, 100, 'seven sessions against three planned');
  assert.equal(weeks[0].foodAdherencePct, 100);
});

test('P-MEASURE (b) - a week the athlete planned nothing in reads absent, not zero', async () => {
  const state = { ...fixtureState(), split: [] };
  const weeks = weeksFromState({ state, startDate: FIXTURE.trialStart, weeks: 1,
    markers: FIXTURE.markers, sets: sets(), sessionDates: sessionDates(), foodRows: foodRows() });
  assert.equal(weeks[0].trainingAdherencePct, null,
    'an unknown plan is not a zero-session week');
});
