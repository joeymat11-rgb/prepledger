"use strict";

const { createBrowserEngine } = require("./browser-engine.cjs");
const { SYNTHETIC_DAY, dayOffset, createSyntheticState } = require("./fixtures.cjs");
const clone = (v) => JSON.parse(JSON.stringify(v));
function previewClock(day) {
  const [y, m, d] = day.split("-").map(Number);
  return { today: () => day, hour: () => 8, now: () => new Date(y, m - 1, d, 8),
    stamp: () => day + "T08:00:00.000Z" };
}

function projectState(E, state) {
  return {
    nowModel: E.nowModel(state), statusFace: E.statusFace(state), statusTarget: E.statusTarget(state),
    regime: E.regime(state), currentRate: E.currentRate(state), calorieTarget: E.calorieTarget(state),
    energyBalanceTarget: E.energyBalanceTarget(state), proteinTarget: E.proteinTarget(state),
    marchingOrder: E.marchingOrder(state), readRecency: E.readRecency(state),
  };
}

function createPreviewModel({ scenario = "morning", today = SYNTHETIC_DAY, engineFactory = createBrowserEngine } = {}) {
  const clock = previewClock(today);
  let E, state, currentScenario;
  const original = createSyntheticState(today);
  const previousDay = dayOffset(today, -1);
  const previousState = clone(original);
  previousState.trend = 180.5; // Separate invented previous-day snapshot, never today's recalculation.
  const previousEngine = engineFactory({ clock: previewClock(previousDay) });
  const yesterdayPlan = projectState(previousEngine, previousState);

  function read() {
    const projection = projectState(E, state);
    const latestRead = state.reads.at(-1) || null;
    return clone({ synthetic: true, scenario: currentScenario, today, hour: 8,
      persistence: "memory-only", acknowledgement: "Preview updated — resets on reload",
      hasReadToday: state.reads.some((r) => r.d === today), latestRead,
      ...projection, yesterdayPlan, yesterday: previousDay });
  }
  function previewWeighIn(value) {
    // Mirror the ratified mock's weigh-in input: min=60, max=400, step=0.1.
    // This bounds a demonstration form; it is not a new engine admission rule.
    if (typeof value !== "number" || !Number.isFinite(value) || value < 60 || value > 400 || Number(value.toFixed(1)) !== value) {
      return { ok: false, message: "Enter 60–400 lb using at most one decimal place." };
    }
    if (state.reads.some((r) => r.d === today)) return { ok: false, message: "This preview already has today's weigh-in. Reset to try again." };
    // A UI preview edit, not an operation/receipt. This narrow morning-only calculation
    // follows applyRead's unchanged branch (writers.cjs:423-454). Tests compare the
    // complete next snapshot with that writer; sealed/late/correction paths are unbuilt.
    const previousTrend = state.trend;
    const raw = value - previousTrend;
    const clean = state.reads.filter((r) => !r.sealed && !r.offWindow), deltas = [];
    for (let i = 1; i < clean.length; i++) {
      if (dayOffset(clean[i - 1].d, 1) === clean[i].d) {
        const delta = clean[i].w - clean[i - 1].w;
        if (Math.abs(delta) < 1.5) deltas.push(delta);
      }
    }
    const noise = deltas.length >= 8 ? Math.sqrt(deltas.reduce((sum, delta) => sum + delta * delta, 0) / deltas.length) : null;
    const next = clone(state);
    next.reads.push({ d: today, w: value, sealed: false, pt: previousTrend,
      note: Math.abs(raw) > 1.5 ? "spike — damped in trend" : noise && Math.abs(raw) <= noise ? "inside your noise — not information" : "" });
    next.trend = +(previousTrend + 0.3 * Math.max(-1.5, Math.min(1.5, raw))).toFixed(1);
    state = next;
    currentScenario = "logged";
    return { ok: true, message: "Preview updated — resets on reload", view: read() };
  }
  function reset(nextScenario = "morning") {
    if (!["morning", "logged"].includes(nextScenario)) throw new RangeError("Unknown synthetic scenario");
    E = engineFactory({ clock });
    state = clone(original);
    currentScenario = "morning";
    if (nextScenario === "logged") previewWeighIn(180);
    return read();
  }
  reset(scenario);
  return { read, previewWeighIn, reset, getSnapshot: () => clone(state) };
}

module.exports = { createPreviewModel, projectState, previewClock };
