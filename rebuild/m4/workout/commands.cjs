'use strict';
// Closed workout command mapping; no issuer, activation, capture or training rule.
const {validateWorkoutShape}=require('./schema.cjs');
const {createWorkoutProfile}=require('./authority-profile.cjs');
const profile=createWorkoutProfile(validateWorkoutShape);
const own=(value,key)=>Object.hasOwn(value,key);
const map=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
// Exact descriptor-copy helper from the accepted shared shape module. No getter runs.
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

const ROWS=Object.freeze({
  start:['session-start',['planned_split_slot_id','plan_basis'],[]],
  set:['session-set',['session_start_op_id','logical_set_slot','lift_lineage_id'],['load','reps','reserve']],
  skip:['session-skip',['session_start_op_id','logical_set_slot','lift_lineage_id','skip_scope'],['reason']],
  close:['session-close',['session_start_op_id'],['completion_kind']],
  correct:['correction',['target_op_id','lift_lineage_id'],['replacement_fields']],
  remove:['tombstone',['target_op_id','lift_lineage_id'],['reason']],
});
function prepare(request) {
  const value=jsonData(request);
  if(!map(value)||Object.keys(value).length!==2||!own(value,'action')||!own(value,'input')||
    typeof value.action!=='string'||!own(ROWS,value.action)||!map(value.input))throw new TypeError('WORKOUT_INPUT_INVALID');
  const [kind,envelope,payloadFields]=ROWS[value.action],input=value.input;
  const allowed=[...envelope,...payloadFields,'effective','causal_parents'];
  if(Object.keys(input).some(key=>!allowed.includes(key)))throw new TypeError('WORKOUT_INPUT_INVALID');
  if(own(input,'effective')&&!map(input.effective))throw new TypeError('WORKOUT_INPUT_INVALID');
  if(own(input,'causal_parents')&&!Array.isArray(input.causal_parents))throw new TypeError('WORKOUT_INPUT_INVALID');
  const action={class:'session',kind,payload:Object.create(null),extra:Object.create(null)};
  for(const key of envelope)if(own(input,key)){
    if(key==='target_op_id')action.target=input[key];else action.extra[key]=input[key];
  }
  for(const key of payloadFields)if(own(input,key))action.payload[key]=input[key];
  if(own(input,'effective'))action.effective=input.effective;
  if(own(input,'causal_parents'))action.parents=input.causal_parents;
  return action;
}
function createWorkoutCommands(){return Object.freeze({schemaVersion:2,prepare,
  validate(op,readOperation) {
    if(!profile.validateShape(op))return false;
    for(const id of op.causal_parents){
      const parent=readOperation(id);
      if(!parent||parent.athlete_id!==op.athlete_id)return false;
    }
    return profile.validateRelations(op,readOperation);
  }});}
module.exports={createWorkoutCommands};
