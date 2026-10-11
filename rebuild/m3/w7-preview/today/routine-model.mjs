// routine-model.mjs - S15 "Change my routine": the pure half of the editor.
// No DOM, no store, no clock. It turns what the athlete chose into ONE
// plan-edit (rebuild/m4/workout/plan-edit-commands.cjs) and reads the routine
// the companion projects back into rows the screen paints. Vocabulary (muscle
// labels, weekdays, workout words, the standard start, field labels and
// validation words) is setup's own, imported, never restated.
//
// THE OWNER RULE (S15 brief item 4). A NEW exercise - added, or replacing one -
// always starts at setup's STANDARD_SETS with setup's STANDARD_HI rep aim and
// no known load: the projector mints it with w null and no forks, so the first
// logged workout sets the load and the native-load "make this your working
// weight" offer takes it from there. An EXISTING exercise is only ever changed
// in the fields the athlete changed; every other field, its id and its history
// stay as they are (the projector's update edit carries only those fields).
import { STANDARD_SETS, STANDARD_HI, STANDARD_INC, SETS_OPTIONS, HI_OPTIONS, WEEKDAYS,
  WEEKDAY_NAMES, DAY_KINDS, DAY_KIND_WORDS, REST, MG_LABELS, MISSING, VALIDATION,
  slugOf, hasName, exerciseSubject } from './setup-model.mjs';

export { STANDARD_SETS, STANDARD_HI, SETS_OPTIONS, HI_OPTIONS, WEEKDAYS, WEEKDAY_NAMES,
  DAY_KINDS, DAY_KIND_WORDS, REST, MG_LABELS };

/* Every NEW word this editor shows. S15 R1: listed in the build report for the
   PM's copy approval. No dashes, no exclamation marks. */
export const COPY = Object.freeze({
  entry: 'Change my routine',
  opening: 'Opening your routine.',
  startsOn: 'Changes start on DATE. Today\u2019s workout stays as it is.',
  savedFor: 'Saved. It starts on DATE.',
  moveUp: 'Move up',
  moveDown: 'Move down',
  saveOrder: 'Save this order',
  change: 'Change',
  week: 'Change my days',
  weekHead: 'Your week',
  saveWeek: 'Save my days',
  setsLabel: 'Sets',
  workoutLabel: 'Which workout?',
  saveChanges: 'Save changes',
  replace: 'Replace it',
  remove: 'Remove it',
  removeAsk: 'Remove NAME from your routine? Its history stays.',
  removeYes: 'Yes, remove it',
  keep: 'Keep it',
  newHead: 'New exercise',
  replaceHead: 'Replace NAME',
  newRule: 'A new exercise starts at SETS sets with no weight. Your first workout sets it.',
  nameRequired: 'Give it a name.',
  saveNew: 'Add it',
  nothingChanged: 'Nothing has changed yet.',
  unavailable: 'Your routine cannot be changed on this device right now. Nothing was changed. (CODE)',
  refused: 'That change was not saved. Nothing was changed. (CODE)',
  stale: 'Your routine changed while this was open. Look it over and save again.',
  dayTurned: 'The day has changed. Look it over and save again.',
  uncovered: 'Each workout that has exercises needs at least one day.',
  weekEmpty: 'Your routine needs at least one exercise.',
  workoutEmpty: 'Each workout with days needs at least one exercise.',
});

/* "Monday, October 12" for a YYYY-MM-DD local date. Read as a calendar date at
   UTC noon, never through the device's own time zone, in the platform's own
   English month and weekday names. */
const DATE_WORDS = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
export function dateWords(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  if (!m) return String(iso);
  return DATE_WORDS.format(new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12)));
}
export const withDate = (line, iso) => line.replace('DATE', dateWords(iso));
export const withName = (line, name) => line.replace('NAME', exerciseSubject(name));

const retiredIn = state => (state && state.retirements) || {};
/* The routine, as the engine serves it: each workout's lifts that are still in
   the week, in exOrder with unknown ids last and ties kept in array order
   (rebuild/engine/today.cjs _sessionPool). Retired lifts are not rows. */
export function rowsOf(state) {
  const out = { U: [], L: [] }, retired = retiredIn(state);
  for (const kind of DAY_KINDS) {
    const order = (state && state.exOrder && state.exOrder[kind]) || [];
    const rank = id => { const i = order.indexOf(id); return i === -1 ? 99 : i; };
    out[kind] = (state.exercises || []).filter(e => e && e.day === kind && !retired[e.id])
      .sort((a, b) => rank(a.id) - rank(b.id))
      .map(e => ({ id: e.id, n: e.n, mg: e.mg, day: e.day, sets: e.sets, hi: e.hi }));
  }
  return out;
}
/* The week in force on `date`: weekday key to 'U', 'L' or REST. */
export function weekOf(state, date) {
  let inForce = null;
  for (const row of (state && state.split) || []) if (row && row.from && row.from <= date) inForce = row;
  return Object.fromEntries(WEEKDAYS.map(d => {
    const v = inForce && inForce.map ? inForce.map[d] : null;
    return [d, v === 'U' || v === 'L' ? v : REST];
  }));
}

/* ONE MOVE of the reorder draft. Returns a new array, or the same one when
   the move would leave the list. */
export function moved(order, index, delta) {
  const to = index + delta;
  if (!Array.isArray(order) || index < 0 || index >= order.length || to < 0 || to >= order.length) return order;
  const next = order.slice();
  [next[index], next[to]] = [next[to], next[index]];
  return next;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const reorderEdit = (kind, order) => ({ kind: 'reorder', day: kind, order: order.slice() });
export const splitEdit = map => ({ kind: 'split', map: Object.fromEntries(WEEKDAYS.map(d => [d, map[d]])) });
export const removeEdit = id => ({ kind: 'remove', exercise_id: id });

/* A positive number typed into a box; empty is unanswered (null), never zero. */
function numberOf(text) {
  const raw = typeof text === 'string' ? text.trim() : (typeof text === 'number' ? String(text) : '');
  if (raw === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : NaN;
}

/* CHANGE ONE EXISTING EXERCISE. Only the members the athlete actually changed
   go into the edit; a member he left alone is not restated, so nothing he did
   not touch can move. */
export function updateEdit(row, draft) {
  const changes = {};
  const n = typeof draft.n === 'string' ? draft.n.trim() : row.n;
  if (!hasName(n)) return { ok: false, field: 'n', copy: COPY.nameRequired };
  if (n !== row.n) changes.n = n;
  for (const k of ['sets', 'hi']) if (Number.isSafeInteger(draft[k]) && draft[k] > 0 && draft[k] !== row[k]) changes[k] = draft[k];
  if (DAY_KINDS.includes(draft.day) && draft.day !== row.day) changes.day = draft.day;
  if (!Object.keys(changes).length) return { ok: false, field: null, copy: COPY.nothingChanged };
  return { ok: true, edit: { kind: 'update', exercise_id: row.id, changes } };
}

/* A NEW EXERCISE, added or replacing one. Sets and rep aim are setup's
   standard start, always; there is no load field at all. The muscle is one of
   setup's labels, or a catalogue entry's own, whose tag snapshot rides along
   only while the athlete keeps that entry's muscle. */
export function newExerciseEdit(form, taken, { replaces = null } = {}) {
  const errors = [];
  const n = typeof form.n === 'string' ? form.n.trim() : '';
  const subject = hasName(n) ? n : null;
  if (!subject) errors.push({ field: 'n', copy: COPY.nameRequired });
  const entry = form.entry && typeof form.entry === 'object' ? form.entry : null;
  const mg = typeof form.mg === 'string' ? form.mg : '';
  if (!MG_LABELS.includes(mg) && !(entry && entry.mg === mg)) errors.push({ field: 'mg', copy: withName(MISSING.exerciseMg, n) });
  if (!DAY_KINDS.includes(form.day)) errors.push({ field: 'day', copy: COPY.workoutLabel });
  const first = numberOf(form.first);
  if (first === null) errors.push({ field: 'first', copy: withName(MISSING.exerciseFirst, n) });
  else if (Number.isNaN(first)) errors.push({ field: 'first', copy: VALIDATION.load });
  const inc = numberOf(form.inc);
  if (Number.isNaN(inc)) errors.push({ field: 'inc', copy: VALIDATION.inc });
  if (errors.length) return { ok: false, errors };
  const exercise = { id: slugOf(n, new Set(taken || [])), n, mg, day: form.day,
    sets: STANDARD_SETS, hi: STANDARD_HI, inc: inc === null ? STANDARD_INC : inc, steps: [first] };
  const tags = entry && entry.mg === mg
    ? { head: typeof entry.head === 'string' && entry.head ? entry.head : null,
      secondary: (Array.isArray(entry.secondary) ? entry.secondary : []).map(s => ({ ...s })) }
    : { head: null, secondary: [] };
  const edit = replaces ? { kind: 'replace', exercise_id: replaces, exercise, tags } : { kind: 'add', exercise, tags };
  return { ok: true, edit };
}

/* THE WORDS FOR A REFUSAL. A known code gets its own plain sentence; anything
   else says nothing was changed and carries its code, as every lane here does. */
export function refusalWords(code) {
  if (code === 'PLAN_EDIT_DAY_UNCOVERED') return COPY.uncovered;
  if (code === 'PLAN_EDIT_WEEK_EMPTY') return COPY.weekEmpty;
  if (code === 'PLAN_EDIT_WORKOUT_EMPTY') return COPY.workoutEmpty;
  if (code === 'PLAN_EDIT_NO_CHANGE') return COPY.nothingChanged;
  if (code === 'PLAN_EDIT_DAY_TURNED') return COPY.dayTurned;
  if (['PLAN_EDIT_REVIEW_STALE', 'PLAN_EDIT_STALE_BASIS', 'PLAN_EDIT_ORDER_MISMATCH',
    'PLAN_EDIT_TARGET_UNAVAILABLE'].includes(code)) return COPY.stale;
  return COPY.refused.replace('CODE', String(code || 'UNKNOWN'));
}
/* Fable l1 N1: the refusals after which the editor reads the routine again, keeping the draft. */
export const RELOAD_CODES = Object.freeze(['PLAN_EDIT_DAY_TURNED', 'PLAN_EDIT_REVIEW_STALE', 'PLAN_EDIT_STALE_BASIS',
  'PLAN_EDIT_ORDER_MISMATCH', 'PLAN_EDIT_TARGET_UNAVAILABLE']);
export const unavailableWords = code => COPY.unavailable.replace('CODE', String(code || 'UNKNOWN'));
export const newRuleLine = () => COPY.newRule.replace('SETS', String(STANDARD_SETS));
export const sameOrder = same;

export default { COPY, dateWords, withDate, withName, rowsOf, weekOf, moved, reorderEdit, splitEdit,
  removeEdit, updateEdit, newExerciseEdit, refusalWords, RELOAD_CODES, unavailableWords, newRuleLine, sameOrder };
