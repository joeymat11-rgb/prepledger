'use strict';

// Shared basic shape only. No capability registration, signature verification,
// relationship/admission check, prescription qualification or durable command.
const COMMON = ['op_id', 'athlete_id', 'device_id', 'device_seq',
  'device_predecessor_op_id', 'causal_parents', 'class', 'kind', 'effective',
  'schema_version', 'lease_id', 'payload', 'canonical_content_commitment'];
const FIELDS = Object.freeze({
  'session-start': ['planned_split_slot_id', 'plan_basis'],
  'session-set': ['session_start_op_id', 'logical_set_slot', 'lift_lineage_id'],
  'session-skip': ['session_start_op_id', 'lift_lineage_id', 'skip_scope'],
  'session-close': ['session_start_op_id'],
  correction: ['target_op_id', 'lift_lineage_id'],
  tombstone: ['target_op_id', 'lift_lineage_id'],
});
const own = (value, key) => Object.hasOwn(value, key);
const map = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const invalid = error => ({valid: false, errors: [error], references: []});

// Inspect data descriptors, never property getters. The private copy also makes
// later validation independent of inherited properties and caller-owned aliases.
// Actual wire ingress must enforce transport bounds and parse JSON first.
function jsonData(input) {
  if (!map(input)) throw new TypeError('JSON map required');
  const holder = Object.create(null), copies = new WeakMap(), active = new WeakSet();
  const stack = [{value: input, parent: holder, key: 'root'}];
  while (stack.length) {
    const item = stack.pop(), value = item.value;
    if (item.exit) { active.delete(value); continue; }
    if (value === null || typeof value === 'string' || typeof value === 'boolean' ||
        typeof value === 'number' && Number.isFinite(value)) { item.parent[item.key] = value; continue; }
    if (typeof value !== 'object') throw new TypeError('Non-JSON value');
    if (active.has(value)) throw new TypeError('Cyclic value');
    if (copies.has(value)) { item.parent[item.key] = copies.get(value); continue; }
    const array = Array.isArray(value), proto = Object.getPrototypeOf(value);
    if (array ? proto !== Array.prototype : proto !== Object.prototype && proto !== null)
      throw new TypeError('Custom prototype');
    const keys = Reflect.ownKeys(value), descriptors = Object.getOwnPropertyDescriptors(value);
    if (keys.some(key => typeof key !== 'string')) throw new TypeError('Symbol field');
    const length = array ? descriptors.length?.value : 0;
    if (array && (!Number.isSafeInteger(length) || length < 0 || keys.length !== length + 1))
      throw new TypeError('Sparse or extended array');
    const names = array ? Array.from({length}, (_, i) => String(i)) : keys;
    for (const name of names) {
      const d = descriptors[name];
      if (!d || !own(d, 'value') || d.enumerable !== true) throw new TypeError('Non-data field');
    }
    const copy = array ? [] : Object.create(null);
    copies.set(value, copy); active.add(value); item.parent[item.key] = copy;
    stack.push({value, exit: true});
    for (let i = names.length - 1; i >= 0; i--)
      stack.push({value: descriptors[names[i]].value, parent: copy, key: names[i]});
  }
  return holder.root;
}
function keys(value, required, optional = []) {
  return map(value) && required.every(key => own(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key));
}
const quantity = (value, unit) => keys(value, ['value', 'unit']) &&
  Number.isFinite(value.value) && value.unit === unit;
const load = value => quantity(value, 'lb') && value.value > 0;
const reps = value => quantity(value, 'rep') && Number.isSafeInteger(value.value) && value.value >= 0 &&
  !Object.is(value.value, -0);
function reserve(value) {
  if (!map(value)) return false;
  if (['unknown', 'skipped', 'not_asked'].includes(value.tag)) return keys(value, ['tag']);
  return keys(value, ['tag', 'value', 'unit']) && value.unit === 'rep' && !Object.is(value.value, -0) &&
    (value.tag === 'exact' ? [0, 1, 2].includes(value.value) : value.tag === 'at_least' && value.value === 3);
}
function validSet(payload) {
  if (!map(payload)) return false;
  return keys(payload, ['load', 'reps'], ['reserve']) && load(payload.load) && reps(payload.reps) &&
    (!own(payload, 'reserve') || reserve(payload.reserve));
}
function replacement(payload) {
  if (!keys(payload, ['replacement_fields'])) return false;
  const fields = payload.replacement_fields;
  if (!map(fields) || Object.keys(fields).length === 0 || !keys(fields, [], ['load', 'reps', 'reserve'])) return false;
  return (!own(fields, 'load') || load(fields.load)) && (!own(fields, 'reps') || reps(fields.reps)) &&
    (!own(fields, 'reserve') || reserve(fields.reserve));
}

function validateWorkoutShape(input) {
  let op;
  try { op = jsonData(input); } catch { return invalid('INVALID_JSON_SHAPE'); }
  if (op.schema_version !== 2 || op.class !== 'session' || typeof op.kind !== 'string' || !own(FIELDS, op.kind)) return invalid('UNSUPPORTED_PROFILE');
  if (!COMMON.every(key => own(op, key)) ||
      !['op_id', 'athlete_id', 'device_id', 'lease_id', 'canonical_content_commitment'].every(key => text(op[key])) ||
      !Number.isSafeInteger(op.device_seq) || op.device_seq < 1 ||
      !(op.device_predecessor_op_id === null || text(op.device_predecessor_op_id)) ||
      !Array.isArray(op.causal_parents) || !op.causal_parents.every(text) || new Set(op.causal_parents).size !== op.causal_parents.length ||
      !keys(op.effective, ['local_date', 'local_time', 'utc_offset']) || !Object.values(op.effective).every(text) ||
      !/^[+-]\d{2}:\d{2}$/.test(op.effective.utc_offset)) return invalid('INVALID_COMMON');
  const fields = FIELDS[op.kind].slice();
  if (op.kind === 'session-skip') {
    if (!['set', 'lift'].includes(op.skip_scope)) return invalid('INVALID_FIELDS');
    if (op.skip_scope === 'set') fields.push('logical_set_slot');
  }
  if (!keys(op, [...COMMON, ...fields]) || !fields.every(key => text(op[key]))) return invalid('INVALID_FIELDS');
  let valid = false;
  if (op.kind === 'session-start') valid = keys(op.payload, []);
  if (op.kind === 'session-set') valid = validSet(op.payload);
  if (op.kind === 'session-skip') valid = keys(op.payload, [], ['reason']) && (!own(op.payload, 'reason') || text(op.payload.reason));
  if (op.kind === 'session-close') valid = keys(op.payload, ['completion_kind']) && ['normal', 'early'].includes(op.payload.completion_kind);
  if (op.kind === 'correction') valid = replacement(op.payload);
  if (op.kind === 'tombstone') valid = keys(op.payload, ['reason']) && text(op.payload.reason);
  if (!valid) return invalid('INVALID_PAYLOAD');
  const references = op.kind === 'session-start' ? [] : [op.target_op_id ?? op.session_start_op_id];
  return {valid: true, errors: [], references};
}

module.exports = {validateWorkoutShape};
