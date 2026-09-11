'use strict';
// Source projection consumers for the source-aware capture profile
// (earned/workout-prescription/v2). The engine adapter consumes ONLY a
// registered projection through sourceProjectionReader.workoutInput(projection,
// expectedBasis); nothing here is a state supplier, an activation, an issuer, a
// receipt or a currentness proof.
//
// Two lanes, one ownership contract (the contract reading-replay.workoutInput
// already enforces for STRING selections): WeakMap identity of the frozen
// projection object (a clone is refused), exactly three own-enumerable basis
// fields W / log_digest / selection_id compared by value, and one owned copy
// returned. The STRING lane is reading-replay.projectLineage itself — it is
// the only registrar for an activated source, and it is not duplicated here.
//
// The NULL lane registers the one projection an activated source cannot
// describe: a profile with NO source import at all. It is valid only for a
// zero-import generation — no row under the source codec's collection and no
// accepted log prefix (frontier W 0), so the frontier it claims is the codec's
// own empty accepted prefix, computed here, never asserted by a caller. A
// generation that holds source rows, or an accepted log prefix whose digest
// this module cannot compute from real log rows, is refused rather than given
// an invented frontier.
const FIELDS=Object.freeze(['W','log_digest','selection_id']);
const PROFILE='earned/null-selection-projection/v1';
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
function freezeOwned(value){const stack=[value];while(stack.length){const item=stack.pop();if(!item||typeof item!=='object'||Object.isFrozen(item))continue;
 for(const child of Object.values(item))stack.push(child);Object.freeze(item);}return value;}
// The claimed basis must be a plain three-field record: own, enumerable, data
// properties only (no getters, no extras, no missing field).
function claimedBasis(expected){
 const d=Object.getOwnPropertyDescriptors(expected||{});
 if(Reflect.ownKeys(d).length!==FIELDS.length||FIELDS.some(k=>!Object.hasOwn(d[k]||{},'value')||!d[k].enumerable))return null;
 return Object.fromEntries(FIELDS.map(k=>[k,d[k].value]));
}
function createNullSelectionRegistrar({sourceCodec}={}){
 if(sourceCodec?.PROFILE!=='earned/source-import/v1'||typeof sourceCodec.basis!=='function'||typeof sourceCodec.createPrefixHasher!=='function'||typeof sourceCodec.COLLECTION!=='string')
  throw new TypeError('Existing source frontier codec required');
 const held=new WeakMap();
 const emptyAcceptedPrefix=()=>sourceCodec.basis({W:0,log_digest:sourceCodec.createPrefixHasher().digest(),selection_id:null});
 function register({generation,state,workoutFacts}={}){
  const c=generation?.collections;
  if(!c||typeof c!=='object'||Array.isArray(c))fail('SOURCE_PROJECTION_GENERATION_REQUIRED');
  const rows=c[sourceCodec.COLLECTION];
  if(rows&&typeof rows==='object'&&Object.keys(rows).length)fail('SOURCE_PROJECTION_IMPORT_PRESENT');
  const W=c.sync?.frontier?.W;
  if(!(W===undefined||W===0))fail('SOURCE_PROJECTION_FRONTIER_REQUIRED');
  if(!state||typeof state!=='object'||Array.isArray(state)||!Array.isArray(state.exercises))fail('SOURCE_PROJECTION_STATE_REQUIRED');
  if(workoutFacts!==undefined&&workoutFacts!==null&&workoutFacts.profile!=='earned/workout-facts/v1')fail('SOURCE_PROJECTION_FACTS_REQUIRED');
  const basis=emptyAcceptedPrefix();
  const projection=freezeOwned({profile:PROFILE,ready:true,accepted_state:structuredClone(state),
   workout_history:workoutFacts===undefined||workoutFacts===null?null:structuredClone(workoutFacts),workout_baseline:null,source_basis:structuredClone(basis)});
  held.set(projection,{basis:structuredClone(basis),state:projection.accepted_state,baseline:null,facts:projection.workout_history});
  return projection;
 }
 function workoutInput(projection,expectedBasis){
  const h=held.get(projection),b=claimedBasis(expectedBasis);
  if(!h||!b||FIELDS.some(k=>b[k]!==h.basis[k]))fail('SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  return {state:h.state,source_basis:structuredClone(h.basis),workout_baseline:h.baseline,...(h.facts?{workoutFacts:h.facts}:{})};
 }
 return Object.freeze({profile:PROFILE,register,workoutInput});
}
// One reader for the adapter: routes a claim to the lane its selection_id
// names and lets THAT lane enforce identity and basis equality. A claim for a
// lane that is not composed is refused; nothing is registered here.
function createSourceProjectionReader({nullSelection,stringSelection}={}){
 for(const [name,lane]of [['nullSelection',nullSelection],['stringSelection',stringSelection]])
  if(lane!==undefined&&typeof lane?.workoutInput!=='function')throw new TypeError('Registered projection lane required: '+name);
 if(nullSelection===undefined&&stringSelection===undefined)throw new TypeError('At least one registered projection lane required');
 function workoutInput(projection,expectedBasis){
  const b=claimedBasis(expectedBasis);if(!b)fail('SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  const lane=b.selection_id===null?nullSelection:typeof b.selection_id==='string'&&b.selection_id?stringSelection:undefined;
  if(!lane)fail('SOURCE_PROJECTION_LANE_UNAVAILABLE');
  return lane.workoutInput(projection,expectedBasis);
 }
 return Object.freeze({workoutInput});
}
module.exports={createNullSelectionRegistrar,createSourceProjectionReader,PROFILE,FIELDS};
