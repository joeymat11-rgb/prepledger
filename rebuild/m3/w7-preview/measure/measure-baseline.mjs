// measure-baseline.mjs - the ONE join from the admitted import
// (local-source-basis.mjs) to the weekly rows the comparison view renders.
//
// ROUND 3, CLOSING REVIEW-R2 FINDING 5. Round 2 read two fields of the
// admitted state (reads, waist) and handed computeWeek a hardcoded
// `sets: []`, null session and logging counts and `nights: []`, so the
// baseline column rendered two of seven measures and printed a FABRICATED
// "0/7" for sleep. It now reads the imported state through the same
// measure-sources.mjs reader the trial column uses, so every measure either
// comes out of the imported history or reads absent. Nothing is invented and
// no zero is manufactured: a measure the frozen app never carried is null,
// which the view renders as "Not enough data yet".
import { admittedLocalSourceState } from '../today/local-source-basis.mjs';
import { weeksFromState } from './measure-sources.mjs';

function daysBefore(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d - n)).toISOString().slice(0, 10);
}

/* The baseline window is the last `weeks` complete 7-day blocks ending the day
   BEFORE `trialStart` (MEASUREMENT-PLAN-v1 section 3: "the last 8 to 12
   complete weeks on the frozen app"). Pure: takes a replayed state and reads
   it; computes nothing measure-model.mjs does not already compute.

   `engine` is the caller's own engine (today-model.cjs's `model.engine`), used
   for exactly one thing: cleanAtDate, the app's OWN sleep qualifying rule
   (ticket BUILD (2)). With no engine the sleep row reads absent rather than
   inventing a rule of its own. */
export function baselineWeeksFromState(state, trialStart, weeks, markers, engine = null) {
  if (!state || typeof trialStart !== 'string') return [];
  const first = daysBefore(trialStart, weeks * 7);
  /* No `today`: every baseline week is a COMPLETE week in the past, so its
     logging denominators are the week's own seven days. */
  return weeksFromState({ state, startDate: first, weeks, markers, engine });
}

/* The read half, for a caller holding the setup entry today-entry.mjs returns -
   the SAME argument local-source-basis.mjs's own admittedLocalSourceState
   takes, so no second wiring point is invented. */
export async function baselineWeeks(setup, trialStart, weeks, markers, engine = null) {
  const state = await admittedLocalSourceState(setup);
  return baselineWeeksFromState(state, trialStart, weeks, markers, engine);
}

export default { baselineWeeksFromState, baselineWeeks };
