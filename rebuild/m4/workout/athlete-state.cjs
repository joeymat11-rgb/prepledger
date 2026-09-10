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
// The split is REQUIRED. rebuild/engine/plan.cjs `dayType(iso, s)` falls back
// to a fixed Mon/Thu=U, Tue/Fri=L, Wed=REFEED week when the state carries no
// `split` entry covering the day; that fallback is one athlete's week, not a
// property of a new athlete. Refusing here means the fallback is never
// consulted for a clean-init state.
//
// Every exercise starts with `w:null`. rebuild/engine/today.cjs genSession
// takes the DEBUT path for `e.w == null`: `baselineAsk:true`, all targets 0
// and the "DEBUT — find the working weight" note, which the engine adapter
// renders as "Find a working load" / "Record the reps performed" with no
// numeric prescription. That is the accepted behaviour for a lift that has
// never been performed; nothing here invents a starting load.
const REQUIRED_SETUP = ['athlete_label', 'split', 'exercises', 'priority_muscles'];
const REQUIRED_EXERCISE = ['id', 'n', 'mg', 'day', 'sets', 'hi', 'inc', 'steps'];
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
  const seen = new Set();
  const exercises = setup.exercises.map(e => checkExercise(e, seen));
  const covered = new Set(Object.values(split.map).filter(v => DAY_KINDS.includes(v)));
  for (const kind of new Set(exercises.map(e => e.day)))
    if (!covered.has(kind)) fail('CLEAN_INIT_SPLIT_REQUIRED', 'no ' + kind + ' day in the split for a ' + kind + ' exercise');
  const exOrder = Object.fromEntries(DAY_KINDS.map(kind =>
    [kind, exercises.filter(e => e.day === kind).map(e => e.id)]));
  const state = {
    v: 60,
    athlete_label: setup.athlete_label,
    // Carried verbatim from setup. No engine reader on the genSession/rirPlan
    // path consumes this member; it is the athlete's stated emphasis, kept
    // with the state rather than dropped, and acted on by nothing yet.
    priority_muscles: setup.priority_muscles.slice(),
    // Every history member starts empty. Nothing is seeded, imported or merged.
    reads: [], dailyLogs: {}, sessionLog: {},
    exercises, exOrder,
    sleep: { nights: [] },
    targets: {}, plan: { autonomy: 'propose', mode: 'bodycomp' },
    queue: [], feed: [], weekly: [], events: [], proposals: [], agentProposals: [],
    adjustments: [], forecasts: [], accepted: [], retirements: {},
    split: [split],
  };
  return freezeDeep(state);
}

const PROFILE = 'earned/clean-init-state/v1';
module.exports = { createCleanInitState, PROFILE, REQUIRED_SETUP, REQUIRED_EXERCISE };
