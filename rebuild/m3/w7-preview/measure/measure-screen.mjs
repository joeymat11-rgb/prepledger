// measure-screen.mjs - P-MEASURE v1, ROUND 3. THE WHOLE MEASURE SCREEN.
//
// today-app.cjs contributes a route, a tile and the accessors that read THIS
// page's own model and setup handle (DECISIONS:455: sealed-byte drift is
// today-app.cjs and nothing else). Everything the athlete actually sees is
// here, in a directory package S4 does not pin.
//
// What it does, in order:
//   1. opens the measure lane lazily, failing CLOSED exactly as the food and
//      sleep lanes do - no encrypted store, no lane, nothing recorded;
//   2. persists TRIAL DAY ONE once, from the first enrolled record's own local
//      date (review R2 finding 2: `model.today` re-based the window daily);
//   3. offers the MARKERS PICK screen while no pick stands (finding 7), from
//      the lifts this device's own enrolled week carries;
//   4. offers the waist entry, the one measure with no existing entry path;
//   5. renders BOTH windows, fed by measure-sources.mjs from the replayed
//      state this page already stands on and this device's own operations
//      (findings 1 and 5), and
//   6. puts the export on the screen as a copyable text block (finding 3).
"use strict";

import MeasureModel from './measure-model.mjs';
import MeasureView from './measure-view.mjs';
import { weeksFromState } from './measure-sources.mjs';
import { baselineWeeks } from './measure-baseline.mjs';

export const TITLE = "Measure";
export const BACK = "Back";
export const NO_STORE = "This browser did not give the page an encrypted local store to keep measurements in.";
export const OPENING = "Opening this device's encrypted store.";
export const NO_TRIAL_YET = "The trial has no day one yet. It begins on the day this device records your first entry.";
export const TRIAL_START_PREFIX = "Trial day one: ";
export const MARKERS_COUNT_REFUSAL = "Choose 3 or 4 lifts.";
export const BASELINE_WEEKS = 8;
export const TRIAL_WEEKS = 12;

/* How many trial weeks to render: every week from day one up to and including
   the week the athlete is standing in, capped at the plan's own twelve. Never
   fewer than one, so day one itself renders a week. */
export function trialWeekCount(startDate, today, cap = TRIAL_WEEKS) {
  if (typeof startDate !== "string" || typeof today !== "string") return 1;
  const days = MeasureModel.weekDates(startDate, 0);
  if (today < days[0]) return 1;
  const [y1, m1, d1] = startDate.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  const span = Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
  return Math.max(1, Math.min(cap, Math.floor(span / 7) + 1));
}

/* The lifts this device can offer as markers: the athlete's OWN enrolled week,
   read off the replayed state. No catalogue, no suggestion, no default. */
export function markerCandidates(state) {
  return (Array.isArray(state && state.exercises) ? state.exercises : [])
    .filter((e) => e && typeof e.id === "string" && typeof e.n === "string" && e.n.trim())
    .map((e) => ({ id: e.id, name: e.n }));
}

export function createMeasureScreen(deps = {}) {
  const { doc, state, repaint = () => {}, back = () => {} } = deps;
  let lane = deps.injected || null;
  let opening = null;
  let failure = null;

  function openLane() {
    if (lane || opening) return opening;
    const idb = deps.indexedDB, web = deps.crypto;
    if (!idb || !web || !web.subtle) { failure = "NO_LOCAL_STORE"; return null; }
    opening = Promise.resolve()
      .then(() => import('./measure-host.mjs'))
      .then((module) => module.createMeasureHost({ day: deps.today(), indexedDB: idb, crypto: web }))
      .then((host) => { lane = host; repaint(); return host; })
      .catch((error) => {
        lane = null;
        failure = (error && (error.code || error.message)) || "MEASURE_LANE_UNAVAILABLE";
        repaint();
        return null;
      });
    return opening;
  }

  /* The waist entry's write path. The refusal is decided in measure-model.mjs's
     own words BEFORE anything is written, and the store refuses again on its
     own account (measure-commands.cjs); a blank box is not an error. */
  async function saveWaist(entry) {
    const today = deps.today();
    const refusal = MeasureModel.waistRefusalFor(entry, today);
    if (refusal === MeasureModel.WAIST_REFUSALS.NOTHING) return;
    if (refusal) { state.error = refusal; return repaint(); }
    const result = await lane.save(MeasureModel.waistFromEntry(entry, today));
    state.error = result.ok ? "" : (result.code || "WAIST_WRITE_REFUSED");
    return repaint();
  }

  /* The markers pick's write path. Three or four, counted here so the athlete
     is told before the producer refuses him in a code. */
  async function pickMarkers(chosen) {
    if (!Array.isArray(chosen) || chosen.length < 3 || chosen.length > 4) {
      state.markersError = MARKERS_COUNT_REFUSAL;
      return repaint();
    }
    const result = await lane.saveMarkers(chosen);
    state.markersError = result.ok ? "" : (result.code || "MEASURE_MARKERS_WRITE_REFUSED");
    return repaint();
  }

  function chrome(root) {
    const heading = doc.createElement("h1");
    heading.textContent = TITLE;
    const backButton = doc.createElement("button");
    backButton.type = "button";
    backButton.dataset.slot = "measure-back";
    backButton.textContent = BACK;
    backButton.addEventListener("click", () => back());
    root.append(heading, backButton);
  }

  function say(root, text, slot) {
    const p = doc.createElement("p");
    p.dataset.slot = slot;
    p.textContent = text;
    root.append(p);
    return p;
  }

  /* `alive()` is the caller's own mount token check: a paint that resolves
     after the athlete has navigated writes nothing to the screen he is on,
     exactly as every other deferred paint on this page behaves. */
  async function paint(root, alive = () => true) {
    root.replaceChildren();
    chrome(root);
    if (!lane && !failure) openLane();
    if (!lane) {
      say(root, failure ? NO_STORE : OPENING, "measure-state");
      return root;
    }

    const today = deps.today();
    const trialStart = await lane.ensureTrialStart();
    if (!alive()) return root;
    const trialState = typeof deps.trialState === "function" ? deps.trialState() : null;
    const markers = (await lane.markers()) || null;
    if (!alive()) return root;

    /* THE PICK COMES FIRST (plan section 5: chosen once, before the trial
       starts). While no pick stands, this screen IS the pick screen. */
    if (!markers) {
      const host = doc.createElement("div");
      root.append(host);
      MeasureView.mountMarkerPick(doc, host, {
        candidates: markerCandidates(trialState),
        error: state.markersError || null,
        onPick: (chosen) => pickMarkers(chosen),
      });
      return root;
    }

    say(root, trialStart ? TRIAL_START_PREFIX + trialStart : NO_TRIAL_YET, "measure-trial-start");

    const entryHost = doc.createElement("div");
    root.append(entryHost);
    MeasureView.mountWaistEntry(doc, entryHost, {
      today, error: state.error || null, onSave: (entry) => saveWaist(entry),
    });

    const comparisonHost = doc.createElement("div");
    root.append(comparisonHost);
    if (!trialStart || !trialState) {
      say(comparisonHost, NO_TRIAL_YET, "measure-no-trial");
      return root;
    }

    /* THE TRIAL WINDOW, from day one, fed from the entry paths that already
       exist: the replayed state carries the weight reads and the nights, and
       this device's own operations carry the waist values, the recorded sets,
       the session dates and the logged food and energy days. */
    const [waistRows, sets, sessionDates, foodRows] = await Promise.all([
      lane.all(), lane.sets(), lane.sessionDates(), lane.foodDays()]);
    if (!alive()) return root;
    const trial = weeksFromState({ state: trialState, startDate: trialStart,
      weeks: trialWeekCount(trialStart, today), markers, engine: deps.engine,
      waistRows, sets, sessionDates, foodRows, today });

    const baseline = deps.setup
      ? await baselineWeeks(deps.setup, trialStart, BASELINE_WEEKS, markers, deps.engine)
      : [];
    if (!alive()) return root;

    const view = MeasureView.buildComparisonView({ baselineWeeks: baseline, trialWeeks: trial, markers });
    MeasureView.mountMeasureComparison(doc, comparisonHost, view, {
      exportOpen: !!state.exportOpen,
      onExport: () => { state.exportOpen = !state.exportOpen; repaint(); },
    });
    return root;
  }

  return Object.freeze({ paint, lane: () => lane, failure: () => failure });
}

export default { createMeasureScreen, trialWeekCount, markerCandidates,
  TITLE, BACK, NO_STORE, OPENING, NO_TRIAL_YET, TRIAL_START_PREFIX,
  MARKERS_COUNT_REFUSAL, BASELINE_WEEKS, TRIAL_WEEKS };
