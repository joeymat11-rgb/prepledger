'use strict';
// Shared synthetic inputs for the host tests. One definition, so the journey
// test and the engine-equivalence test are talking about the same athlete and
// the same day. Nothing here is product code and nothing here is real athlete
// data: every value is invented for the tests and labelled synthetic.

// 2026-09-04 is a Friday. The Joe-shaped fallback week in
// rebuild/engine/plan.cjs dayType would call a Friday an L day; this athlete's
// OWN split calls it U. Every assertion about which lifts appear is therefore
// also an assertion that the fallback week was never consulted.
const DAY = '2026-09-04';

const SETUP = Object.freeze({
  athlete_label: 'synthetic-test-identity',
  split: { from: '2026-08-31', map: { 0: 'REST', 1: 'REST', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'U', 6: 'L' } },
  exercises: [
    { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40, 45, 50] },
    { id: 'lat-pulldown', n: 'Lat pulldown', mg: 'back', day: 'U', sets: 2, hi: 12, inc: 10, steps: [50, 60, 70, 80, 90] },
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] },
  ],
  priority_muscles: ['chest', 'back'],
});

const clockFor = day => ({ today: () => day, nowISO: () => day + 'T12:00:00.000Z',
  nowMs: () => Date.parse(day + 'T12:00:00.000Z'), hour: () => 12,
  dow: () => new Date(day + 'T00:00:00Z').getUTCDay() });

// The same shape of honest refusal the host installs
// (createUnavailableNativeTrendContext in rebuild/m3/w6/host/workout-host.mjs).
// Restated here because that module is ESM and these callers are CommonJS; it
// is never a resolver that answers — every call throws.
const refusingTrendContext = () => () => {
  const error = new Error('NATIVE_TREND_CONTEXT_UNAVAILABLE');
  error.code = 'NATIVE_TREND_CONTEXT_UNAVAILABLE';
  throw error;
};

module.exports = { DAY, SETUP, clockFor, refusingTrendContext };
