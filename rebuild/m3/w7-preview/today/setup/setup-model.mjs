import athlete from '../../../../m4/workout/athlete-state.cjs';

export const WEEK = Object.freeze(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
export const DAY_LABEL = Object.freeze({ U: 'Upper', L: 'Lower', REST: 'Rest' });
export function newSetupDraft(day) {
  return { athlete_label: '', from: day, map: Object.fromEntries(WEEK.map((_, i) => [i, ''])), exercises: [], priority_muscles: [] };
}
function fail(field, message) { const error = new Error(message); error.field = field; throw error; }
export function validateSchedule(draft) {
  if (!draft.athlete_label.trim()) fail('athlete_label', 'Enter the name you want to see here.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.from) || !Number.isFinite(Date.parse(draft.from + 'T12:00:00Z'))
    || new Date(draft.from + 'T12:00:00Z').toISOString().slice(0, 10) !== draft.from) fail('from', 'Choose a real start date.');
  for (const i of WEEK.keys()) if (!DAY_LABEL[draft.map[i]]) fail('day-' + i, 'Choose Upper, Lower or Rest for ' + WEEK[i] + '.');
  if (!Object.values(draft.map).some(x => x === 'U' || x === 'L')) fail('day-0', 'Your current routine needs at least one training day.');
}
function number(value, field, label, integer = false) {
  const n = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isFinite(n) || n <= 0 || (integer && !Number.isSafeInteger(n))) fail(field, 'Enter ' + label + (integer ? ' as a whole number above zero.' : ' above zero.'));
  return n;
}
export function exerciseFromDraft(row, catalogue) {
  const choice = catalogue.find(x => x.id === row.choice);
  if (!choice) fail('choice', 'Choose an exercise supported by this setup.');
  const inc = number(row.inc, 'inc', 'the load increase in pounds');
  let steps;
  if (row.loadMode === 'range') {
    const min = number(row.min, 'min', 'the lightest available load');
    const max = number(row.max, 'max', 'the heaviest available load');
    const count = (max - min) / inc;
    if (count < 0 || Math.abs(count - Math.round(count)) > 1e-8 || count > 1000) fail('max', 'The range must end on your stated increment and contain at most 1,001 loads.');
    steps = Array.from({ length: Math.round(count) + 1 }, (_, i) => Number((min + i * inc).toFixed(10)));
  } else {
    steps = String(row.loads || '').split(',').map(x => number(x, 'loads', 'every available load in pounds'));
    if (steps.some((x, i) => i > 0 && x <= steps[i - 1])) fail('loads', 'List the available loads in increasing order, without duplicates.');
  }
  return { id: choice.id, n: choice.n, mg: choice.mg, day: choice.day,
    sets: number(row.sets, 'sets', 'sets per session', true), hi: number(row.hi, 'hi', 'the rep ceiling', true), inc, steps };
}
export function setupFromDraft(draft) {
  validateSchedule(draft);
  if (!draft.exercises.length) fail('exercises', 'Add the exercises in your current routine.');
  for (const day of ['U', 'L']) {
    if (Object.values(draft.map).includes(day) && !draft.exercises.some(x => x.day === day)) fail('exercises', 'Add your ' + DAY_LABEL[day].toLowerCase() + ' exercises, or correct the schedule.');
    if (!Object.values(draft.map).includes(day) && draft.exercises.some(x => x.day === day)) fail('exercises', 'Your ' + DAY_LABEL[day].toLowerCase() + ' exercises need a matching day in the schedule.');
  }
  const setup = { athlete_label: draft.athlete_label.trim(), split: { from: draft.from, map: { ...draft.map } },
    exercises: structuredClone(draft.exercises), priority_muscles: [...draft.priority_muscles] };
  athlete.createCleanInitState({ setup });
  return setup;
}
