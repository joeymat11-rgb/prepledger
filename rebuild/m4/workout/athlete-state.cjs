'use strict';
// CLEAN-INIT engine state for a brand-new athlete (Dad's first run).
//
// This is the only product constructor of an engine state that carries NO
// history at all. It is built field by field from an explicit per-athlete
// `setup` document supplied by the caller. It imports nothing from
// rebuild/engine (no seed.cjs, no migrate.cjs, no merge.cjs, no index.cjs),
// performs no import/merge/migration, and copies no other athlete's records,
// lifts, loads, split or settings. Every member it writes is either
//   (a) copied verbatim from `setup`, or
//   (b) the empty value of that member (`[]`, `{}`, `null`).
// There is no default lift list, no default load, no default week.
//
// H3 (DECISIONS:124) adds TWO members that are not history and not the
// athlete's own words: `blackout` and `model`, which the accepted engine
// dereferences without a guard. Rule (b) still holds for every value in them —
// each is the athlete's own setup date or an explicit absence, never a number.
// The block above `freezeDeep` carries the trace, the measurements and the
// reason `model.lean` is absent rather than null.
//
// The split is REQUIRED. rebuild/engine/plan.cjs `dayType(iso, s)` falls back
// to a fixed Mon/Thu=U, Tue/Fri=L, Wed=REFEED week when the state carries no
// `split` entry covering the day; that fallback is one athlete's week, not a
// property of a new athlete.
//
// This constructor has NO clock, so requiring a split here is necessary but
// NOT sufficient: a split whose `from` is still in the future is well formed
// and would leave `dayType` on the fallback for today (A0 review R1, probe P1).
// The guard that closes that hole needs both the state and the day and
// therefore lives at the seam that has both — `workoutProducer` in
// rebuild/m3/w6/host/workout-host.mjs, which refuses
// WORKOUT_SPLIT_NOT_IN_FORCE on every preparation whose day no split entry
// covers. This file only guarantees that a split exists and is well formed.
//
// Two literals below are the ENGINE's own values, not this module's choices:
//   * `v: SCHEMA_V` — rebuild/engine/constants.cjs:9 `const SCHEMA_V = 60;`,
//     the engine's schema tag, the same number rebuild/engine/migrate.cjs
//     stamps as it walks a state forward. It is repeated as a literal rather
//     than imported so this file keeps its "no rebuild/engine import" property;
//     rebuild/m3/w6/host/test/journey.test.mjs asserts the two agree, so a
//     drift is a test failure, never a silent divergence.
//   * `plan.autonomy: 'propose'` — the engine's most-supervised level and its
//     own default (rebuild/engine/constants.cjs:270
//     `AUTONOMY_LEVELS = ["propose","autonotice","runit"]`;
//     rebuild/engine/migrate.cjs:944 forces `propose` for any unrecognised
//     value, "default: most supervised (never auto-promote)"). It is written
//     here deliberately, as the floor, so a new athlete starts at the level
//     that proposes and never acts alone. It is NOT taken from `setup`,
//     because nothing yet lets an athlete raise it, and it is NOT an empty
//     value — hence this note.
// Nothing else is written that the athlete did not supply. In particular there
// is no `plan.mode`: no engine reader reads that member (`energy.cjs` reads
// `plan.apMode`), and this module invents no vocabulary.
//
// Every exercise starts with `w:null`. rebuild/engine/today.cjs genSession
// takes the DEBUT path for `e.w == null`: `baselineAsk:true`, all targets 0
// and the "DEBUT — find the working weight" note, which the engine adapter
// renders as "Find a working load" / "Record the reps performed" with no
// numeric prescription. That is the accepted behaviour for a lift that has
// never been performed; nothing here invents a starting load.
// rebuild/engine/constants.cjs:9 — the engine's own schema tag. Cross-checked
// against the engine by rebuild/m3/w6/host/test/journey.test.mjs.
const SCHEMA_V = 60;
// rebuild/engine/constants.cjs:270 AUTONOMY_LEVELS[0]; rebuild/engine/migrate.cjs:944.
const AUTONOMY_FLOOR = 'propose';
const REQUIRED_SETUP = ['athlete_label', 'split', 'exercises', 'priority_muscles'];
const REQUIRED_EXERCISE = ['id', 'n', 'mg', 'day', 'sets', 'hi', 'inc', 'steps'];
// H3 (DECISIONS:124). The EXACT member set of the two objects this constructor
// writes for the accepted engine's unguarded readers. Exported so a cell can
// assert the constructed objects are closed over exactly these names — a member
// added, removed or renamed is a refusal here, never a silent drift.
const BLACKOUT_MEMBERS = ['until'];
const MODEL_MEMBERS = ['anchorISO', 'drip', 'src'];
// H3-CORE (lane C's H3-class finding, REQUESTS 04:11 (1)). The same rule for the
// `sleep` object: its member set is pinned, and `needed` joins `nights` because
// four accepted readers dereference `s.sleep.needed` with no guard of their own
// (rebuild/engine/sleep.cjs:239, :1053, :1903 and rebuild/engine/today.cjs:266).
const SLEEP_MEMBERS = ['nights', 'needed'];
// THE VALUE IS THE ENGINE'S OWN, READ OUT OF THE ENGINE — never typed here and
// never copied from rebuild/engine/seed.cjs. createConstants() is a pure factory
// with no clock, no history and no state, so requiring it does not give this
// module a clock (see the header rule).
const SLEEP_NEEDED = require('../../engine/constants.cjs')().SLEEP_ANCHOR_MIN_N;
const DAY_KINDS = ['U', 'L'];
const fail = (code, detail) => { const e = new Error(code); e.code = code; if (detail !== undefined) e.detail = detail; throw e; };
const isPlain = v => v !== null && typeof v === 'object' && !Array.isArray(v) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(v));
const closed = (value, names, code) => {
  if (!isPlain(value)) fail(code, 'not a plain object');
  const keys = Reflect.ownKeys(value);
  if (keys.length !== names.length || names.some(k => !Object.hasOwn(value, k)) ||
      keys.some(k => typeof k !== 'string' || !names.includes(k))) fail(code, names.join(','));
  return value;
};
const positiveInt = x => Number.isSafeInteger(x) && x > 0;
const isoDay = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x);

function checkSplit(split) {
  closed(split, ['from', 'map'], 'CLEAN_INIT_SPLIT_REQUIRED');
  if (!isoDay(split.from)) fail('CLEAN_INIT_SPLIT_REQUIRED', 'from must be YYYY-MM-DD');
  if (!isPlain(split.map)) fail('CLEAN_INIT_SPLIT_REQUIRED', 'map must be a plain object');
  const weekdays = ['0', '1', '2', '3', '4', '5', '6'];
  const keys = Reflect.ownKeys(split.map);
  if (keys.length !== 7 || weekdays.some(d => !Object.hasOwn(split.map, d)))
    fail('CLEAN_INIT_SPLIT_REQUIRED', 'map needs one entry for each weekday 0-6');
  for (const d of weekdays) {
    const v = split.map[d];
    // dayType returns REST for any value that is not exactly "U" or "L"; the
    // supplier still requires the caller to name each day explicitly rather
    // than leaving one to be read as REST by accident.
    if (![...DAY_KINDS, 'REST'].includes(v)) fail('CLEAN_INIT_SPLIT_REQUIRED', 'weekday ' + d + ' must be U, L or REST');
  }
  if (!weekdays.some(d => DAY_KINDS.includes(split.map[d])))
    fail('CLEAN_INIT_SPLIT_REQUIRED', 'at least one training day is required');
  return { from: split.from, map: Object.fromEntries(weekdays.map(d => [d, split.map[d]])) };
}

function checkExercise(raw, seen) {
  closed(raw, REQUIRED_EXERCISE, 'CLEAN_INIT_EXERCISE_REQUIRED');
  const { id, n, mg, day, sets, hi, inc, steps } = raw;
  for (const [name, value] of [['id', id], ['n', n], ['mg', mg]])
    if (typeof value !== 'string' || !value.trim()) fail('CLEAN_INIT_EXERCISE_REQUIRED', name);
  if (seen.has(id)) fail('CLEAN_INIT_EXERCISE_REQUIRED', 'duplicate id ' + id);
  seen.add(id);
  if (!DAY_KINDS.includes(day)) fail('CLEAN_INIT_EXERCISE_REQUIRED', 'day must be U or L');
  if (!positiveInt(sets)) fail('CLEAN_INIT_EXERCISE_REQUIRED', 'sets');
  if (!positiveInt(hi)) fail('CLEAN_INIT_EXERCISE_REQUIRED', 'hi');
  // The real increment and the real rung list of the athlete's own machine or
  // rack. Both are supplied facts about equipment; neither is derived here.
  if (!(typeof inc === 'number' && Number.isFinite(inc) && inc > 0)) fail('CLEAN_INIT_EXERCISE_REQUIRED', 'inc');
  if (!Array.isArray(steps) || !steps.length ||
      !steps.every(x => typeof x === 'number' && Number.isFinite(x) && x > 0) ||
      steps.some((x, i) => i > 0 && x <= steps[i - 1])) fail('CLEAN_INIT_EXERCISE_REQUIRED', 'steps must be ascending positive loads');
  // w:null is the whole point: no working load is known for a lift that has
  // never been performed, so the engine asks for one instead of prescribing.
  return { id, n, mg, day, sets, hi, inc, steps: steps.slice(), w: null, forks: [] };
}

/* ===== H3 — THE TWO MEMBERS THE ACCEPTED ENGINE DEREFERENCES (DECISIONS:124) =====
   A clean-init state carried neither `blackout` nor `model`, and the accepted
   engine reads both without a guard, so Today THREW for a brand-new athlete:
   rebuild/engine/energy.cjs:370 `daysUntil(s.blackout.until)`, then — once
   blackout exists — rebuild/engine/energy.cjs:84 `s.model.anchorISO` in bfEst.
   They are not the only two sites: sleep.cjs:358, sleep.cjs:1913 and
   writers.cjs:427/:938/:1715 read `s.blackout.until` equally unguarded (only
   today.cjs:228/:282/:409 and sleep.cjs:1879 test for the object first), which
   is why the honest fix is the CONSTRUCTOR's and not a guard at one reader.
   `blackout: {}` is not a fix shape either: daysUntil(undefined) reaches
   `mk()` at rebuild/engine/dates.cjs:8 and throws on `undefined.split`.

   EVERY VALUE BELOW IS THE ATHLETE'S OWN SETUP DATE OR AN EXPLICIT ABSENCE.
   Nothing is copied from rebuild/engine/seed.cjs — that file's
   `model: { lean: 139.7, anchorISO: "2026-07-21", drip: 0, src: "coach's eye" }`
   and `blackout.until = SEAL_UNTIL` are ONE athlete's numbers (the H1 rule).

   `blackout.until` — THE DAY BEFORE `split.from`, not `split.from` itself.
   Nine of the ten readers ask `daysUntil(until) > 0`, so either choice leaves
   no blackout in force from day one. The tenth does not: rebuild/engine/
   sleep.cjs:1879 asks `iso <= s.blackout.until`, INCLUSIVE, and with
   `until = split.from` the athlete's very first weigh-in comes back
   `dayWeather(split.from).flags = [{k:"sealwater", why:"scale carries event
   water — sealed window"}], noisy: true` — measured, not argued. One day
   earlier and the window is empty for every day this athlete can ever have,
   because he cannot have a reading before the day he set the app up.

   `model.anchorISO` — `split.from`, the athlete's own setup date, so
   `weeksBetween(anchorISO, today)` is 0 on day one rather than a distance from
   a stranger's anchor.

   `model.drip` — `null`, which is THIS member's own documented absence:
   rebuild/engine/energy.cjs:21 `dripOf` tests `d == null` and substitutes the
   engine's own `DRIP_DEFAULT` (constants.cjs:68, `0.0`). No number is invented
   here; the engine's stated default is used because the engine states it.

   `model.src` — `null`. Every reader compares `=== "DEXA"`, so null never
   throws and never claims a scan.

   `model.lean` IS DELIBERATELY NOT WRITTEN, and this is the one place where
   the shape DECISIONS:124 sketches would have invented a figure. The athlete's
   setup document (REQUIRED_SETUP) carries no bodyweight and no body-fat
   reading — he has declared no body composition at all — so there is no honest
   value. Both candidates were driven through the real screen and MEASURED:
     * `lean: null` — `s.model.lean + drip * wks` coerces null to 0, so bfEst
       reports `lean: 0`, proteinTarget reports `g: 0, ffmKg: 0`, and
       rebuild/m3/w7-preview/today/today-app.cjs:259/:260 (`Number.isFinite(g)`)
       PRINTS "0 g protein" on Today. Once a bodyweight exists it is worse:
       `pct = ((trend - 0) / trend) * 100` = 100.0% body fat.
     * member absent — every derived figure is non-finite, the same
       `Number.isFinite` gate reads it as no reading, and the slot shows
       "Not available yet". That is the truth: he has no anchor.
   NaN is not an option: rebuild/engine/writers.cjs:425 `applyRead` round-trips
   the state through `JSON.parse(JSON.stringify(...))`, which turns NaN into
   null, so a NaN anchor would silently become the 0 above at the first
   weigh-in. An absent member survives that round trip absent.
   The residue is recorded and routed in rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md
   (finding F-A): rebuild/engine/energy.cjs:117 proteinTarget has no gated
   branch of its own, unlike calorieTarget and stepTarget, so it always returns
   a figure. Today's own view layer is what keeps that off the screen. Closing
   it needs an engine edit, which this package does not make.

   The day before `iso`, by pure UTC arithmetic on a date-only string. This
   module has NO CLOCK and must not gain one; nothing here reads the time. */
const dayBefore = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const at = new Date(Date.UTC(2000, 0, 1));
  at.setUTCFullYear(y, m - 1, d - 1);   // setUTCFullYear, so years < 100 are not shifted into 1900
  let out;
  try { out = at.toISOString().slice(0, 10); } catch (e) { out = null; }
  // The round trip is the guard: a `from` that is not a real calendar day
  // (2026-02-30 passes the shape test at checkSplit) would otherwise hand the
  // engine a silently normalised window.
  if (out === null || !isoDay(out) || dayAfter(out) !== iso)
    fail('CLEAN_INIT_SPLIT_REQUIRED', 'from must be a real calendar day');
  return out;
};
const dayAfter = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const at = new Date(Date.UTC(2000, 0, 1));
  at.setUTCFullYear(y, m - 1, d + 1);
  try { return at.toISOString().slice(0, 10); } catch (e) { return null; }
};

function freezeDeep(value) {
  const stack = [value];
  while (stack.length) {
    const item = stack.pop();
    if (!item || typeof item !== 'object' || Object.isFrozen(item)) continue;
    for (const child of Object.values(item)) stack.push(child);
    Object.freeze(item);
  }
  return value;
}

// setup: {athlete_label, split:{from,map}, exercises:[{id,n,mg,day,sets,hi,inc,steps}], priority_muscles:[string]}
// Returns a frozen engine state with no history of any kind.
function createCleanInitState({ setup } = {}) {
  if (setup === undefined || setup === null) fail('CLEAN_INIT_SETUP_REQUIRED', 'setup');
  closed(setup, REQUIRED_SETUP, 'CLEAN_INIT_SETUP_REQUIRED');
  if (typeof setup.athlete_label !== 'string' || !setup.athlete_label.trim())
    fail('CLEAN_INIT_SETUP_REQUIRED', 'athlete_label');
  if (!Array.isArray(setup.exercises) || !setup.exercises.length)
    fail('CLEAN_INIT_EXERCISES_REQUIRED', 'at least one exercise is required');
  if (!Array.isArray(setup.priority_muscles) ||
      !setup.priority_muscles.every(x => typeof x === 'string' && x.trim()))
    fail('CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED', 'priority_muscles');
  const split = checkSplit(setup.split);
  /* H3 (DECISIONS:124) — see the block above freezeDeep for every value's
     derivation and for why `model.lean` is absent. `closed()` pins both member
     sets: a member added, removed or renamed refuses here rather than reaching
     the engine.
     These two codes are DELIBERATELY NOT `CLEAN_INIT_*`. That prefix is the
     ATHLETE-FACING refusal vocabulary: lane C's setup screens map every
     `CLEAN_INIT_*` code this file can throw to a sentence a person reads
     (rebuild/m3/w7-preview/today/setup-model.mjs REFUSAL_SENTENCES, asserted
     exhaustively by setup.test.mjs S3). These two are builder-side invariants
     over this module's own literals — no setup document any screen can produce
     reaches them — so they stay out of that vocabulary rather than forcing a
     screen sentence for something no athlete can cause. */
  const blackout = closed({ until: dayBefore(split.from) }, BLACKOUT_MEMBERS, 'STATE_BLACKOUT_MEMBER_SET');
  const model = closed({ anchorISO: split.from, drip: null, src: null }, MODEL_MEMBERS, 'STATE_MODEL_MEMBER_SET');
  /* H3-CORE — `sleep.needed`, lane C's H3-class finding (REQUESTS 04:11 (1)).
     `sleep: { nights: [] }` left `needed` ABSENT, and four accepted readers
     dereference it with no guard: rebuild/engine/sleep.cjs:1053 `run >=
     s.sleep.needed` (so `atTarget` is `0 >= undefined` — FALSE for ever, not
     just on day one), sleep.cjs:1903 `need: s.sleep.needed` (JSON.stringify
     DROPS the member, so `sleepInfo(s)` comes back without `need` at all),
     sleep.cjs:239 `${slp.run} of ${s.sleep.needed} clean nights` and
     rebuild/engine/today.cjs:266 `${sl.run}/${s.sleep.needed} clean` — the
     second of which puts the literal text "0/undefined clean" on the SLEEP
     lever the moment the athlete has a night on the record. All four measured.
     THE VALUE IS 3, AND IT IS NOT TYPED HERE. It is read at load time out of
     the engine's own `rebuild/engine/constants.cjs` — `SLEEP_ANCHOR_MIN_N`
     (constants.cjs:315), the ONE named sleep-night-count constant the engine
     exports — so it cannot drift from the engine and it is not a copy of
     rebuild/engine/seed.cjs's `sleep.needed: 3` (that file is one athlete's
     record; the H1 rule forbids reading it, and a cell asserts this module
     never names it). The engine states the same 3 twice more in its own logic:
     sleep.cjs:1041 `if (run.length < 3) return true` — its own debt run — and
     sleep.cjs:239 `Math.min(3, s.sleep.needed - slp.run) * 10`, which caps the
     sleep restriction's weight at three nights, so any larger `needed` would
     change no weight and only make the sentence unreachable.
     WHAT THE READERS EXPECT FOR ZERO NIGHTS IS UNCHANGED: with no nights
     `run` is 0 and `at` is `0 >= 3` = FALSE, exactly as it reads today. The
     athlete is not at a sleep target he has no nights for; the difference is
     that he can now REACH one, and that the screen says "0/3" instead of
     "0/undefined".
     THE SETUP DOCUMENT CONTRIBUTES NOTHING HERE, AND THAT IS SAID OUT LOUD:
     REQUIRED_SETUP carries no sleep entry, so there is no athlete-declared
     value to derive from — which is why the engine's own exported constant is
     the only honest source, and why `cleanH` is NOT written (below, F-G). */
  const sleep = closed({ nights: [], needed: SLEEP_NEEDED }, SLEEP_MEMBERS, 'STATE_SLEEP_MEMBER_SET');
  /* F-G, OPEN AND NOT CLOSED HERE. `s.sleep.cleanH` is the other half of the
     same pair and is deliberately left absent: the engine states TWO different
     defaults for it in its own code — `|| 7.5` at sleep.cjs:1071 (sleepAnchor)
     and `|| 8` at sleep.cjs:925 (lightsOutT) — so there is no single
     engine-stated value and picking one would be inventing a preference. The
     measured consequence, asserted by a cell so it cannot be forgotten:
     sleep.cjs:1051 `nights[i].h >= s.sleep.cleanH` is false for every night,
     so `atSleepTarget(s).run` stays 0 and `at` stays false however well the
     athlete sleeps. That is a live defect, it is recorded in
     rebuild/lanes/b/BRIEF-H3-CORE.md, and closing it needs a ruling on which
     of the engine's own two defaults is the clean-night bar. */
  const seen = new Set();
  const exercises = setup.exercises.map(e => checkExercise(e, seen));
  const covered = new Set(Object.values(split.map).filter(v => DAY_KINDS.includes(v)));
  for (const kind of new Set(exercises.map(e => e.day)))
    if (!covered.has(kind)) fail('CLEAN_INIT_SPLIT_REQUIRED', 'no ' + kind + ' day in the split for a ' + kind + ' exercise');
  const exOrder = Object.fromEntries(DAY_KINDS.map(kind =>
    [kind, exercises.filter(e => e.day === kind).map(e => e.id)]));
  const state = {
    v: SCHEMA_V,
    athlete_label: setup.athlete_label,
    // Carried verbatim from setup. No engine reader on the genSession/rirPlan
    // path consumes this member; it is the athlete's stated emphasis, kept
    // with the state rather than dropped, and acted on by nothing yet.
    priority_muscles: setup.priority_muscles.slice(),
    // Every history member starts empty. Nothing is seeded, imported or merged.
    reads: [], dailyLogs: {}, sessionLog: {},
    exercises, exOrder,
    sleep,
    targets: {},
    // The engine's own most-supervised floor, written deliberately and cited
    // in the header. No `mode` member: that vocabulary does not exist.
    plan: { autonomy: AUTONOMY_FLOOR },
    // H3 (DECISIONS:124). Not history: the two members the accepted engine
    // dereferences without a guard, each value the athlete's own setup date or
    // an explicit absence. Built and pinned above.
    blackout, model,
    queue: [], feed: [], weekly: [], events: [], proposals: [], agentProposals: [],
    adjustments: [], forecasts: [], accepted: [], retirements: {},
    split: [split],
  };
  return freezeDeep(state);
}

const PROFILE = 'earned/clean-init-state/v1';
module.exports = { createCleanInitState, PROFILE, REQUIRED_SETUP, REQUIRED_EXERCISE,
  SCHEMA_V, AUTONOMY_FLOOR, BLACKOUT_MEMBERS, MODEL_MEMBERS, SLEEP_MEMBERS, SLEEP_NEEDED };
