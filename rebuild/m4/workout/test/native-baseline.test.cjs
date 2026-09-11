'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {projectNativeBaseline}=require('../native-baseline.cjs');
const {createCleanInitState}=require('../athlete-state.cjs');
const DAY='2026-09-18';
const base=()=>structuredClone(createCleanInitState({setup:{athlete_label:'synthetic',split:{from:'2026-09-01',map:{0:'REST',1:'U',2:'REST',3:'REST',4:'REST',5:'U',6:'REST'}},exercises:[{id:'press',n:'Press',mg:'chest',day:'U',sets:2,hi:10,inc:5,steps:[30,35,40,45,50]}],priority_muscles:[]}}));
function session(id,loads=[40,40],{date='2026-09-11',kind='normal',lift='press',states=[],added=[],edits={}}={}){
 const slots=loads.map((load,i)=>{
  const position=i+1, logical_set_slot=JSON.stringify([lift,position]);
  const value={load:typeof load==='number'?{value:load,unit:'lb'}:{kind:'configuration',configuration_key:load},reps:{value:10-i,unit:'rep'},reserve:{tag:'exact',value:2,unit:'rep'}};
  const state=states[i]||'performed';
  const fact={included:state!=='removed',source_op_id:id+'-set-'+position,logical_set_slot,lift_lineage_id:lift,source_status:'stored-on-this-device',current_status:'stored-on-this-device',issues:[],edit_op_ids:edits[i]||[],original:structuredClone(value),current:value};
  return {position,logical_set_slot,state,prescribed_load:{state:'not_prescribed'},prescribed_effort:{state:'not_prescribed'},...(added.includes(i)?{origin:'added'}:{}),
   ...(state==='performed'||state==='removed'?{fact}:state==='skipped'?{skip_op_id:id+'-skip-'+position}:state==='unresolved'?{issues:['CONFLICT']}:{})};
 });
 return {start_op_id:id,effective:{local_date:date},record:{entries:[{profile:'earned/performed-lift/v2',start_op_id:id,lift_lineage_id:lift,correspondence_profile:'earned/engine-workout-capture/v2',completion:{op_id:id+'-close',kind,status:'stored-on-this-device'},slots}]}};
}
const facts=sessions=>({profile:'earned/workout-facts/v1',source_revision:1,order:{profile:'earned/workout-order/v1',frontier:0,start_ids:sessions.map(s=>s.start_op_id)},sessions,incomplete_sessions:[]});
const derive=(rows,state=base())=>projectNativeBaseline({state,workoutFacts:facts(rows),day:DAY});
test('first uniform originals establish factual scalar; no setup or record mutation, provenance retained',()=>{
 const state=base(),f=facts([session('first')]),before=JSON.stringify({state,f});
 const a=projectNativeBaseline({state,workoutFacts:f,day:DAY});
 assert.equal(a.state.exercises[0].w,40);assert.deepEqual(a.state.sessionLog,{});
 assert.equal(JSON.stringify({state,f}),before);assert.equal(a.baseline.decisions[0].close_op_id,'first-close');
 assert.deepEqual(a.baseline.decisions[0].original_slots.map(x=>x.source_op_id),['first-set-1','first-set-2']);
 assert.deepEqual(projectNativeBaseline({state,workoutFacts:f,day:DAY}),a);
});
test('later actual scalar and observed rung follow source order; no automatic next-load recommendation',()=>{
 const result=derive([session('z',[40,40]),session('a',[47,47],{date:'2026-09-14'})]);
 assert.equal(result.state.exercises[0].w,47);assert.deepEqual(result.state.exercises[0].steps,[30,35,40,45,47,50]);
 assert.equal(result.state.exercises[0].topRun,0);assert.equal(result.baseline.decisions.length,2);
 assert.equal(result.state.exercises[0].wAt,undefined);assert.deepEqual(result.state.queue,[]);assert.deepEqual(result.state.feed,[]);
});
test('same-load later session does not invent a new equipment rung or sighting reset',()=>{
 const a=derive([session('a',[42,42]),session('b',[42,42])]);
 assert.equal(a.state.exercises[0].w,42);assert.deepEqual(a.state.exercises[0].steps,[30,35,40,45,50]);assert.equal(a.state.exercises[0].topRun,undefined);
});
test('effective-date skew does not override the provided causal order',()=>{
 const a=derive([session('z',[40,40],{date:'2026-09-14'}),session('a',[45,45],{date:'2026-09-11'})]);
 assert.equal(a.state.exercises[0].w,45);
});
for(const kind of ['normal','early'])test(kind+' close with partial prefix adopts only observed original load',()=>{
 const a=derive([session('a',[40,40],{kind,states:['performed','unlogged']})]);
 assert.equal(a.state.exercises[0].w,40);assert.equal(a.baseline.decisions[0].original_slots[1].state,'unlogged');
});
test('open completion cannot establish baseline',()=>{
 const state=base(),f=facts([]);f.incomplete_sessions=[session('open')];
 assert.equal(projectNativeBaseline({state,workoutFacts:f,day:DAY}).state.exercises[0].w,null);
});
for(const state of ['skipped','unlogged','removed'])test('first original '+state+' supplies no value or compacted baseline',()=>{
 const a=derive([session('a',[40,40],{states:[state,'performed'],edits:{0:['remove']}})]);
 assert.equal(a.state.exercises[0].w,null);assert.equal(a.baseline.decisions[0].state,'no_original_prefix');
});
test('added unequal load cannot establish or change original baseline',()=>{
 assert.equal(derive([session('a',[40,99],{added:[1]})]).state.exercises[0].w,40);
 assert.equal(derive([session('a',[99],{added:[0]})]).state.exercises[0].w,null);
});
test('removing the entire earlier contributor recomputes from remaining facts',()=>{
 const a=derive([session('a',[40,40],{states:['removed','removed'],edits:{0:['rm1'],1:['rm2']}}),session('b',[45,45])]);
 assert.equal(a.state.exercises[0].w,45);
});
test('amended load is current evidence, original and edit provenance remain',()=>{
 const s=session('a',[40,40],{edits:{0:['fix1'],1:['fix2']}});
 for(const slot of s.record.entries[0].slots)slot.fact.current.load={value:35,unit:'lb'};
 const a=derive([s]);assert.equal(a.state.exercises[0].w,35);assert.equal(s.record.entries[0].slots[0].fact.original.load.value,40);
 assert.deepEqual(a.baseline.decisions[0].original_slots[0].edit_op_ids,['fix1']);
});
for(const loads of [[40,35],[40,'BW'],['  BW · band  ','  BW · band  ']])test('unmapped original vector '+JSON.stringify(loads)+' remains exact and actionable',()=>{
 const row=session('a',loads),before=JSON.stringify(row);
 assert.throws(()=>derive([row]),e=>e.code==='NATIVE_BASELINE_MAPPING_REQUIRED'&&typeof e.required_confirmation==='string'&&e.original_slots.every((x,i)=>JSON.stringify(x.load)===JSON.stringify(row.record.entries[0].slots[i].fact.current.load)));
 assert.equal(JSON.stringify(row),before);
});
test('unresolved original fact refuses',()=>assert.throws(()=>derive([session('a',[40,40],{states:['performed','unresolved']})]),{code:'NATIVE_BASELINE_MAPPING_REQUIRED'}));
test('explicit working scalar, per-slot and configured settings stay byte-equivalent',()=>{
 for(const w of [35,'BW']){const s=base();s.exercises[0].w=w;s.exercises[0].wSets=[35,30];assert.deepEqual(derive([session('a',[40,40])],s).state,s);}
 const s=base();s.exercises[0].wSets=[35,30];assert.throws(()=>derive([session('a')],s),{code:'NATIVE_BASELINE_MAPPING_REQUIRED'});
});
test('foreign lineage and prior technique era cannot establish this lift',()=>{
 assert.equal(derive([session('a',[40,40],{lift:'other'})]).state.exercises[0].w,null);
 const s=base();s.exercises[0].forks=[{from:'2026-09-14',kind:'reset'}];
 assert.equal(derive([session('a')],s).state.exercises[0].w,null);
 assert.equal(derive([session('a'),session('b',[35,35],{date:'2026-09-15'})],s).state.exercises[0].w,35);
});
test('missing or duplicate order refuses rather than invent chronology',()=>{
 for(const order of [undefined,{profile:'earned/workout-order/v1',frontier:0,start_ids:['a','a']}]){
 const f=facts([session('a'),session('b')]);f.order=order;assert.throws(()=>projectNativeBaseline({state:base(),workoutFacts:f,day:DAY}),{code:'PERFORMED_HISTORY_ORDER_UNRESOLVED'});}
});
test('future facts do not alter valid past baseline and carry exact downstream D7 dependency',()=>{
 const a=derive([session('past',[40,40]),session('future',[99,99],{date:'2026-09-21'})]);
 assert.equal(a.state.exercises[0].w,40);assert.deepEqual(a.baseline.future_start_ids,['future']);
});
test('legacy-only input is whole-state equivalent, explicit host day required for native fresh work',()=>{
 const s=base();s.sessionLog={'2026-09-11':{entries:[{id:'press',w:40,reps:[10,9]}]}};
 assert.deepEqual(projectNativeBaseline({state:s}).state,s);
 assert.throws(()=>projectNativeBaseline({state:base(),workoutFacts:facts([session('a')])}),{code:'NATIVE_BASELINE_DAY_REQUIRED'});
});
test('actual registrar excludes future baseline input but preserves valid past evidence in named downstream refusal',()=>{
 const Source=require('../../../m3/w5/source/codec.cjs');
 const {createNullSelectionRegistrar}=require('../source-projection.cjs');
 const registrar=createNullSelectionRegistrar({sourceCodec:Source}),state=base(),generation={collections:{}};
 const f=facts([session('past'),session('future',[99,99],{date:'2026-09-21'})]);
 assert.throws(()=>registrar.register({generation,state,workoutFacts:f,day:DAY}),error=>
  error.code==='NATIVE_BASELINE_HISTORY_TIME_REQUIRED'&&error.reason==='downstream_as_of_mapping_required'&&
  error.native_baseline.decisions[0].load.value===40&&error.native_baseline.future_start_ids[0]==='future');
 assert.equal(state.exercises[0].w,null);assert.equal(f.sessions.length,2);
 const projection=registrar.register({generation,state,workoutFacts:facts([session('past')]),day:DAY});
 assert.equal(Object.isFrozen(projection.native_baseline.decisions[0].original_slots[0].load),true);
 assert.equal(registrar.workoutInput(projection,projection.source_basis).state.exercises[0].w,40);
 assert.throws(()=>registrar.workoutInput(structuredClone(projection),projection.source_basis),{code:'SOURCE_WORKOUT_INPUT_DISAGREEMENT'});
});
