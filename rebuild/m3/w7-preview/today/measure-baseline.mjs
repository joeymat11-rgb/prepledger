// measure-baseline.mjs - round 2, closing reviewer finding 3 ("the baseline
// never touches local-source-basis"). The ONE join from the admitted import
// (local-source-basis.mjs) to measure-model.mjs's weekly rows.
//
// Reads exactly two fields the admitted import's replayed engine state
// already carries - state.reads ({d, w}) and state.waist ({d, in}) - the SAME
// two arrays rebuild/engine/seed.cjs seeds (SEED.reads:208, SEED.waist:201).
// Nothing else is read and nothing is invented: a replayed state with no
// admitted import (admittedLocalSourceState returning null, P2/P3's own
// "no import yet" answer) yields an empty baseline, which is exactly
// measure-view.mjs's own NO_BASELINE_YET path, unchanged.
import { admittedLocalSourceState } from './local-source-basis.mjs';
import { computeWeek } from './measure-model.mjs';

function readsRows(state) {
  return (Array.isArray(state && state.reads) ? state.reads : [])
    .filter((r) => r && typeof r.d === 'string' && typeof r.w === 'number' && Number.isFinite(r.w))
    .map((r) => ({ date: r.d, lb: r.w }));
}
function waistRows(state) {
  return (Array.isArray(state && state.waist) ? state.waist : [])
    .filter((r) => r && typeof r.d === 'string' && typeof r.in === 'number' && Number.isFinite(r.in))
    .map((r) => ({ date: r.d, in: r.in }));
}

function daysBefore(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d - n)).toISOString().slice(0, 10);
}

/* The baseline window is the last `weeks` complete 7-day blocks ending the day
   BEFORE `trialStart` (MEASUREMENT-PLAN-v1 section 3: "the last 8 to 12
   complete weeks on the frozen app"). Pure: takes a replayed state, computes
   nothing that isn't in measure-model.mjs already. */
export function baselineWeeksFromState(state, trialStart, weeks, markers) {
  if (!state || typeof trialStart !== 'string') return [];
  const reads = readsRows(state), waist = waistRows(state);
  const first = daysBefore(trialStart, weeks * 7);
  const out = [];
  for (let i = 0; i < weeks; i += 1) {
    out.push(computeWeek({ startDate: first, index: i, reads, waistRows: waist, sets: [],
      markers, sessionsCompleted: null, sessionsPlanned: null,
      foodDaysLogged: null, energyDaysLogged: null, nights: [] }));
  }
  return out;
}

/* The read half, for a caller holding the setup entry today-entry.mjs returns -
   the SAME argument local-source-basis.mjs's own admittedLocalSourceState
   takes, so no second wiring point is invented. */
export async function baselineWeeks(setup, trialStart, weeks, markers) {
  const state = await admittedLocalSourceState(setup);
  return baselineWeeksFromState(state, trialStart, weeks, markers);
}

export default { baselineWeeksFromState, baselineWeeks };
