'use strict';
const V = require('../workout/edit-values.cjs');
const PROFILE = 'earned/nutrition-inputs/v1';
const copy = structuredClone;
const fail = code => { const e = new TypeError(code || 'NUTRITION_INPUT_INVALID'); e.code = code || 'NUTRITION_INPUT_INVALID'; throw e; };
function keys(value, names) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail();
  const descriptors = Object.getOwnPropertyDescriptors(value), actual = Reflect.ownKeys(value);
  if (actual.length !== names.length || !names.every(key => Object.hasOwn(descriptors, key) && Object.hasOwn(descriptors[key], 'value') && descriptors[key].enumerable)) fail();
}
const text = value => { if (typeof value !== 'string' || !value.trim()) fail(); return value; };
function date(value) { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) !== value) fail(); return value; }
function quantity(value, unit) {
  keys(value, ['value', 'unit']);
  if (!Number.isFinite(value.value) || value.value < 0 || Object.is(value.value, -0) || value.unit !== unit) fail();
}
function field(value, unit) {
  const kind = Object.getOwnPropertyDescriptor(value || {}, 'kind')?.value;
  if (['target', 'minimum'].includes(kind)) { keys(value, ['kind', 'amount']); quantity(value.amount, unit); }
  else if (kind === 'range') {
    keys(value, ['kind', 'lower', 'upper', 'lower_inclusive', 'upper_inclusive']); quantity(value.lower, unit); quantity(value.upper, unit);
    if (typeof value.lower_inclusive !== 'boolean' || typeof value.upper_inclusive !== 'boolean' || value.lower.value > value.upper.value ||
      value.lower.value === value.upper.value && (!value.lower_inclusive || !value.upper_inclusive)) fail();
  } else if (kind === 'not_prescribed') keys(value, ['kind']);
  else if (kind === 'unavailable') { keys(value, ['kind', 'reason']); text(value.reason); }
  else fail();
}
function inputs(value) {
  keys(value, ['goal', 'existing_plan']);
  const goal = value.goal, goalKind = Object.getOwnPropertyDescriptor(goal || {}, 'kind')?.value;
  if (goalKind === 'declared') { keys(goal, ['kind', 'statement', 'phase']); text(goal.statement); text(goal.phase); }
  else if (goalKind === 'unknown') keys(goal, ['kind']);
  else if (goalKind === 'cleared') { keys(goal, ['kind', 'reason']); text(goal.reason); }
  else fail();
  const plan = value.existing_plan, planKind = Object.getOwnPropertyDescriptor(plan || {}, 'kind')?.value;
  if (['unknown', 'none'].includes(planKind)) keys(plan, ['kind']);
  else if (planKind === 'cleared') { keys(plan, ['kind', 'reason']); text(plan.reason); }
  else if (planKind === 'recorded') {
    keys(plan, ['kind', 'source', 'agreed_date', 'fields']); text(plan.source); date(plan.agreed_date);
    keys(plan.fields, ['calories', 'protein', 'carbohydrate', 'fat']);
    for (const [name, unit] of Object.entries({ calories: 'kcal/day', protein: 'g/day', carbohydrate: 'g/day', fat: 'g/day' })) field(plan.fields[name], unit);
  } else fail();
  return copy(value);
}
function prepare(value) {
  keys(value, ['effective', 'change', 'supersedes', 'inputs']); keys(value.effective, ['local_date', 'local_time', 'utc_offset']);
  if (!V.effective(value.effective)) fail();
  if (!['assert', 'update', 'correction'].includes(value.change)) fail();
  if (value.change === 'assert' ? value.supersedes !== null : typeof value.supersedes !== 'string' || !value.supersedes) fail();
  const assertion = inputs(value.inputs);
  const note = assertion.goal.kind === 'declared' ? assertion.goal.statement : assertion.goal.kind === 'cleared' ? assertion.goal.reason : 'Nutrition goal unknown.';
  return { kind: 'fact', class: 'setup-note', effective: copy(value.effective), parents: value.supersedes === null ? [] : [value.supersedes],
    payload: { profile: PROFILE, text: note, change: value.change, supersedes: value.supersedes, inputs: assertion } };
}
function validate(op, readOperation) {
  try {
    if (!op || op.schema_version !== 1 || op.kind !== 'fact' || op.class !== 'setup-note') return false;
    keys(op.payload, ['profile', 'text', 'change', 'supersedes', 'inputs']);
    if (op.payload.profile !== PROFILE) return false;
    const expected = prepare({ effective: op.effective, change: op.payload.change, supersedes: op.payload.supersedes, inputs: op.payload.inputs });
    if (op.payload.text !== expected.payload.text || JSON.stringify(op.causal_parents) !== JSON.stringify(expected.parents)) return false;
    if (op.payload.supersedes !== null) {
      const prior = readOperation(op.payload.supersedes);
      if (!prior || prior.athlete_id !== op.athlete_id || prior.kind !== 'fact' || prior.class !== 'setup-note' || prior.schema_version !== 1 || prior.payload?.profile !== PROFILE) return false;
    }
    return true;
  } catch { return false; }
}
module.exports = { PROFILE, keys, inputs, prepare, validate };
