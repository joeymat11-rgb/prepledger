/* R15 — THE ENGINE-FREEZE SURFACE. Prints a canonical JSON snapshot of every load-bearing
   engine output on the two frozen real ledgers. tools/engine-diff.mjs compares this
   against the committed baseline (tools/engine-baseline.json): a UI slice that moves ANY
   byte here is an engine change wearing a redesign costume, and the gate blocks it.

   Runs under the frozen clock (import order is load-bearing), so every output is
   deterministic. Functions are wrapped: a throw becomes {err} — also canonical, so a
   slice that makes an engine function START throwing is caught too. */
import "./_fixed-now.mjs";
import { readFileSync } from "node:fs";
import { __test } from "../src/app.jsx";

const T = __test;
const clone = (o) => JSON.parse(JSON.stringify(o));
const grab = (fn) => { try { return fn(); } catch (e) { return { err: String((e && e.message) || e).slice(0, 200) }; } };

const SNAPS = [
  ["tools/snapshots/2026-08-06-ledger.json", "2026-08-06"],
  ["tools/snapshots/2026-08-07-ledger.json", "2026-08-07"],
];

const out = {};
for (const [path, asOf] of SNAPS) {
  const S = JSON.parse(readFileSync(path, "utf8"));
  const o = {};
  o.energyBalanceTarget = grab(() => T.energyBalanceTarget(S, { asOf }));
  o.calorieTarget = grab(() => T.calorieTarget(S));
  o.currentRate = grab(() => T.currentRate(S));
  o.progressionTrend = grab(() => T.progressionTrend(S));
  o.regime = grab(() => T.regime(S, { asOf }));
  o.recoveryIndex = grab(() => T.recoveryIndex(S));
  o.stepPush = grab(() => T.stepPush(S));
  o.stepTarget = grab(() => T.stepTarget(S));
  o.stepEfficacy = grab(() => T.stepEfficacy(S));
  o.observedTDEE = grab(() => T.observedTDEE(S));
  o.bfEst = grab(() => T.bfEst(S));
  o.energyAvailability = grab(() => T.energyAvailability(S));
  o.volumePush = grab(() => T.volumePush(S));
  o.volumeImbalance = grab(() => T.volumeImbalance(S));
  o.programmeVolume = grab(() => T.programmeVolume(S));
  o.muscleVolume = grab(() => T.muscleVolume(S));
  o.typicalError = grab(() => T.typicalError(S, null));
  o.perLift = {};
  for (const ex of (S.exercises || [])) {
    o.perLift[ex.id] = {
      liftTrend: grab(() => T.liftTrend(S, ex.id)),
      volumeConversion: grab(() => T.volumeConversion(S, ex.id)),
      targetsFor: grab(() => T.targetsFor(ex, S)),
      progressStep: grab(() => T.progressStep(ex)),
      rirPlan: grab(() => T.rirPlan(S, ex).plan),
    };
  }
  o.runAdaptive = grab(() => {
    const ra = T.runAdaptive(clone(S), asOf);
    return {
      proposals: (ra.proposals || []).map((p) => ({ rid: p.rid, resolved: !!p.resolved, title: p.title })),
      feedHead: (ra.feed || []).slice(0, 12).map((f) => f && f.t),
    };
  });
  out[asOf] = o;
}
process.stdout.write(JSON.stringify(out, null, 1));
