'use strict';
// B-LOM cells for rebuild/m4/workout/legacy-order-mapping.cjs.
// The positive cells run the REAL rule they exist for: rebuild/engine/performed.cjs
// performedHistoryRows over a state this provider composed. Nothing here is a
// stub of that rule, and no cell asserts the provider against itself.
const test=require('node:test'),assert=require('node:assert/strict');
const {createLegacyOrderMapping,activeLocalSelection,REFUSAL}=require('../legacy-order-mapping.cjs');
const createPerformed=require('../../../engine/performed.cjs');
const engine=()=>createPerformed({},{});
const REF={code:REFUSAL};
const SHARED={installation_id:'earned-today/device-A',era_id:'era-1',athlete_id:'ath-1',
 source_digest:'sha-source-1',checkpoint_digest:'sha-checkpoint-1'};
const BASIS_DIGESTS={material_digest:'sha-material-1',operation_digest:'sha-ops-1',
 interpretation_digest:'sha-interp-1',programme_digest:'sha-programme-1',
 order_map_digest:'sha-ordermap-1',engine_digest:'sha-engine-1'};
const MAP_DIGESTS={legacy_members_digest:'sha-legacy-1',native_members_digest:'sha-native-1',
 root_interpretation_digest:'sha-root-1'};
const SELECTION_ID='local-source:selection-1';
const ROOT='start-op-1';
const basis=()=>({profile:'earned/local-source-basis/v1',...SHARED,device_id:'dev-A',
 local_selection_id:SELECTION_ID,...BASIS_DIGESTS,replay_profile:'earned/local-source-replay/v1',
 as_of:'2026-10-30'});
const orderMap=()=>({profile:'earned/local-source-order-map/v1',...SHARED,...MAP_DIGESTS,
 native_root_id:ROOT,assertion:{kind:'athlete-confirmed-legacy-prefix',answer:true,
  prompt_version:'earned/legacy-prefix-prompt/v1',review_digest:'sha-review-1'}});
const selection=(over={})=>({id:SELECTION_ID,name:'earned-port.json',basis:basis(),
 order_map:orderMap(),order_input:{legacyLog:{'2026-09-01':{}}},identity_review:{},
 previous:null,action:'select',...over});
// The smallest state performed.cjs:176 actually reaches: one imported day, one
// native session with no entries, and a well-formed order over that one Start.
const sessionLog=()=>({'2026-09-01':{d:'2026-09-01',w:135,reps:[5,5,5]}});
const facts=(over={})=>({profile:'earned/workout-facts/v1',source_revision:1,
 sessions:[{start_op_id:ROOT,effective:{local_date:'2026-10-30'},record:{entries:[]}}],
 order:{profile:'earned/workout-order/v1',frontier:0,start_ids:[ROOT]},...over});

test('LOM/0 RED FIRST: the engine refuses the very state this provider exists to compose',()=>{
 const s={sessionLog:sessionLog(),workoutFacts:facts()};
 assert.throws(()=>engine().performedHistoryRows(s),{code:'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED'},
  'without a legacy_baseline the imported prefix and the native session cannot be ordered');
});

test('LOM/1 the two ids come from the recorded selection, and only from it',()=>{
 const m=createLegacyOrderMapping({selection:selection()});
 assert.deepEqual({...m.anchor},{source_generation_id:SHARED.source_digest,activation_op_id:SELECTION_ID},
  'source_generation_id is the source content digest; activation_op_id is the recorded selection id');
 assert.equal(m.binding.order_map.native_root_id,ROOT);
 assert.equal(m.binding.order_map.review_digest,'sha-review-1');
 assert.equal(typeof m.digest,'string');
 assert(m.digest.includes(SHARED.source_digest)&&m.digest.includes(SELECTION_ID));
});

test('LOM/2 attach composes the state the engine accepts, sharing ONE session log',()=>{
 const m=createLegacyOrderMapping({selection:selection()});
 const state={sessionLog:sessionLog(),workoutFacts:facts()};
 const composed={...state,workoutFacts:m.attach(state.workoutFacts,state)};
 assert.strictEqual(composed.workoutFacts.legacy_baseline.session_log,composed.sessionLog,
  'performed.cjs:176 compares this by REFERENCE, never by value');
 assert.equal(composed.workoutFacts.legacy_baseline.profile,'earned/imported-engine-history/v1');
 assert.deepEqual(composed.workoutFacts.order.import_anchor,{...m.anchor});
 const rows=engine().performedHistoryRows(composed);
 assert.deepEqual(rows.map(r=>r.source),['legacy','performed'],
  'the imported prefix keeps the old engine order, then the native order');
 assert.equal(rows[1].start_op_id,ROOT);
 assert.equal(state.workoutFacts.legacy_baseline,undefined,'neither argument is mutated');
 assert.equal(state.workoutFacts.order.import_anchor,undefined);
});

test('LOM/3 a second COPY of the imported log is refused by the engine, not smoothed over',()=>{
 const m=createLegacyOrderMapping({selection:selection()});
 const state={sessionLog:sessionLog(),workoutFacts:facts()};
 const attached=m.attach(state.workoutFacts,state);
 const copied={...state,sessionLog:structuredClone(state.sessionLog),workoutFacts:attached};
 assert.deepEqual(copied.workoutFacts.legacy_baseline.session_log,copied.sessionLog);
 assert.throws(()=>engine().performedHistoryRows(copied),{code:'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED'},
  'equal by value is not the same object, and the engine says so');
});

test('LOM/4 ONE MUTANT PER BOUND DIGEST: every binding field is load-bearing',()=>{
 const fields=['installation_id','era_id','athlete_id','source_digest','checkpoint_digest'];
 for(const k of fields){
  const s=selection();s.order_map[k]='mutant-'+k;
  assert.throws(()=>createLegacyOrderMapping({selection:s}),REF,'order map disagrees on '+k);
 }
 for(const k of ['material_digest','operation_digest','interpretation_digest','programme_digest',
   'order_map_digest','engine_digest']){
  const s=selection();delete s.basis[k];
  assert.throws(()=>createLegacyOrderMapping({selection:s}),REF,'basis is missing '+k);
 }
 for(const k of ['legacy_members_digest','native_members_digest','root_interpretation_digest']){
  const s=selection();delete s.order_map[k];
  assert.throws(()=>createLegacyOrderMapping({selection:s}),REF,'order map is missing '+k);
 }
 for(const k of ['native_root_id']){
  const s=selection();s.order_map[k]='';
  assert.throws(()=>createLegacyOrderMapping({selection:s}),REF,'order map carries no '+k);
 }
 const noReview=selection();delete noReview.order_map.assertion.review_digest;
 assert.throws(()=>createLegacyOrderMapping({selection:noReview}),REF,'the confirmed review digest');
});

test('LOM/5 the athlete answer is a STRICT true; nothing else opens the door',()=>{
 for(const answer of [false,'yes',1,'true',null,undefined]){
  const s=selection();s.order_map.assertion.answer=answer;
  assert.throws(()=>createLegacyOrderMapping({selection:s}),REF,'answer '+String(answer));
 }
 const kind=selection();kind.order_map.assertion.kind='athlete-confirmed-something-else';
 assert.throws(()=>createLegacyOrderMapping({selection:kind}),REF);
 const prompt=selection();prompt.order_map.assertion.prompt_version='earned/legacy-prefix-prompt/v2';
 assert.throws(()=>createLegacyOrderMapping({selection:prompt}),REF);
 const profile=selection();profile.order_map.profile='earned/local-source-order-map/v2';
 assert.throws(()=>createLegacyOrderMapping({selection:profile}),REF);
});

test('LOM/6 NO order map is its own true answer: nothing native existed at admission',()=>{
 const m=createLegacyOrderMapping({selection:selection({order_map:null})});
 assert.equal(m.binding.order_map,null);
 assert.deepEqual({...m.anchor},{source_generation_id:SHARED.source_digest,activation_op_id:SELECTION_ID});
 const state={sessionLog:sessionLog(),workoutFacts:facts()};
 const composed={...state,workoutFacts:m.attach(state.workoutFacts,state)};
 assert.equal(engine().performedHistoryRows(composed).length,2);
 // A map handed in beside a selection that recorded a DIFFERENT one refuses.
 assert.throws(()=>createLegacyOrderMapping({selection:selection(),
  orderMap:{...orderMap(),native_root_id:'start-op-2'}}),REF,'the map must be the recorded map');
 assert.throws(()=>createLegacyOrderMapping({selection:selection(),orderMap:null}),REF,
  'a selection that recorded a map is not read as one that recorded none');
});

test('LOM/7 the selection must be the one the basis names',()=>{
 assert.throws(()=>createLegacyOrderMapping({selection:selection({id:'local-source:other'})}),REF);
 const b=selection();b.basis.local_selection_id='local-source:other';
 assert.throws(()=>createLegacyOrderMapping({selection:b}),REF);
 const p=selection();p.basis.profile='earned/local-source-basis/v2';
 assert.throws(()=>createLegacyOrderMapping({selection:p}),REF);
 assert.throws(()=>createLegacyOrderMapping({}),REF);
 assert.throws(()=>createLegacyOrderMapping(),REF);
});

test('LOM/8 attach refuses a disagreeing anchor and never overwrites a proven one',()=>{
 const m=createLegacyOrderMapping({selection:selection()});
 const state={sessionLog:sessionLog(),workoutFacts:facts()};
 const proven=facts({order:{profile:'earned/workout-order/v1',frontier:0,start_ids:[ROOT],
  import_anchor:{...m.anchor}}});
 assert.deepEqual(m.attach(proven,state).order.import_anchor,{...m.anchor},'an equal anchor stands');
 const wrong=facts({order:{profile:'earned/workout-order/v1',frontier:0,start_ids:[ROOT],
  import_anchor:{source_generation_id:'sha-source-2',activation_op_id:SELECTION_ID}}});
 assert.throws(()=>m.attach(wrong,state),REF,'a disagreeing order is refused, not silently replaced');
 assert.throws(()=>m.attach(facts({profile:'earned/workout-facts/v2'}),state),REF);
 assert.throws(()=>m.attach(facts({order:{profile:'earned/workout-order/v2',frontier:0,start_ids:[]}}),state),REF);
 assert.throws(()=>m.attach(facts(),{sessionLog:{}}),REF,'an empty imported log is no baseline');
 assert.throws(()=>m.attach(facts(),{}),REF);
});

test('LOM/9 activeLocalSelection: absence is not a refusal, a corrupt record is',()=>{
 assert.equal(activeLocalSelection(undefined),null);
 assert.equal(activeLocalSelection({metadata:{}}),null);
 assert.equal(activeLocalSelection({metadata:{localSources:{selections:{},active:null}}}),null,
  'an installation that has admitted no import behaves exactly as before');
 const sel=selection();
 assert.equal(activeLocalSelection({metadata:{localSources:{selections:{[SELECTION_ID]:sel},
  active:SELECTION_ID}}}),sel);
 assert.throws(()=>activeLocalSelection({metadata:{localSources:{selections:{},active:SELECTION_ID}}}),
  REF,'active names a selection this generation does not hold');
 assert.throws(()=>activeLocalSelection({metadata:{localSources:{selections:
  {[SELECTION_ID]:{...sel,id:'local-source:other'}},active:SELECTION_ID}}}),REF);
 assert.throws(()=>activeLocalSelection({metadata:{localSources:{selections:{},active:''}}}),REF);
});
