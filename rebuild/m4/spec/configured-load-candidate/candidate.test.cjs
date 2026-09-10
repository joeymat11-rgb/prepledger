'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const candidate=process.env.EARNED_CONFIGURED_LOAD_CANDIDATE;assert(candidate,'Explicit prepared candidate required');
const Shape=require(path.join(candidate,'schema.cjs')),V=require(path.join(candidate,'edit-values.cjs'));
const {normalizeWorkoutHistory:normalize}=require(path.join(candidate,'edit-history.cjs'));
const load=require(path.join(candidate,'entered-load.cjs')),Ops=require('../../../client/ops.cjs');
const retained=require('../../workout/schema.cjs'),effective={local_date:'2026-09-10',local_time:'09:00',utc_offset:'-04:00'};
const config=key=>({kind:'configuration',configuration_key:key}),numeric={value:55,unit:'lb'};
function op(id,kind,payload,{target,parents=[],version=2,extra={}}={}){return Ops.build({op_id:id,athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,
 parents,class:'session',kind,payload,effective,schema_version:version,lease_id:'synthetic-unissued',target,extra},'public-synthetic-key');}
const start=()=>op('start','session-start',{}, {extra:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}});
const set=(value,id='set')=>op(id,'session-set',{load:value,reps:{value:8,unit:'rep'}},{parents:['start'],extra:{session_start_op_id:'start',logical_set_slot:'slot',lift_lineage_id:'lift'}});
const correction=(id,target,fields,parents=[target])=>op(id,'correction',{replacement_fields:fields},{target,parents,extra:{lift_lineage_id:'lift'}});
const remove=(id,target,parents=[target])=>op(id,'tombstone',{reason:'synthetic removal'},{target,parents,extra:{lift_lineage_id:'lift'}});
const rows=ops=>ops.map((operation,i)=>({operation,status:'accepted-through-frontier',receipt_sequence:i+1}));
const fold=ops=>normalize(rows(ops),ops.length),record=(view,id='set')=>view.records.find(r=>r.id===id);
test('actual candidate schema and edit predicate share the closed load union; retained runtime still refuses',()=>{
 for(const value of [numeric,config('BW'),config('hold'),config('55·55·50'),config(' BW '),config('cafe\u0301')]){
  const original=set(value);assert.equal(Shape.validateWorkoutShape(original).valid,true);assert.equal(V.validValue('load',value),true);
  assert.equal(Shape.validateWorkoutShape(correction('c','set',{load:value})).valid,true);
 }
 assert.equal(retained.validateWorkoutShape(set(config('BW'))).valid,false);
 for(const value of [null,{},'BW',{clear:true},config(''),config(' '),{...config('BW'),unit:'lb'},
  {...numeric,configuration_key:'BW'},{value:0,unit:'lb'},{value:1,unit:'kg'}]){
  assert.equal(load(value),false);assert.equal(Shape.validateWorkoutShape(set(value)).valid,false);assert.equal(V.unionPatch({load:value}),false);
 }
});
test('candidate load predicate refuses getters and malformed data without executing an accessor',()=>{
 let reads=0;const value={kind:'configuration'};Object.defineProperty(value,'configuration_key',{enumerable:true,get(){reads++;return 'BW';}});
 assert.equal(load(value),false);assert.equal(reads,0);
 assert.equal(load(undefined),false);assert.equal(load([]),false);assert.equal(load(NaN),false);
});
test('actual history fold preserves exact configured original while whole corrections change current load',()=>{
 const source=set(config('BW')),instructions=start();
 const change=correction('c','set',{load:numeric}),again=correction('c2','set',{load:config('BW+band')},['c']);
 const ops=[instructions,source,change,again],before=JSON.stringify(ops),view=fold(ops);
 assert.deepEqual(record(view).accepted.current.load,config('BW+band'));assert.deepEqual(record(view).accepted.current.reps,{value:8,unit:'rep'});
 assert.deepEqual(source.payload.load,config('BW'));assert.equal(JSON.stringify(ops),before);
 assert.equal(record(view).accepted.active,true);
});
test('nested correction retains logical position and removal restores original complete union value',()=>{
 const ops=[start(),set(config('BW')),correction('c1','set',{load:numeric}),correction('c2','set',{load:config('hold')},['c1']),
  correction('nested','c1',{replacement_fields:{load:config('BW+band')}},['c2'])];
 assert.deepEqual(record(fold(ops)).accepted.current.load,config('hold'));
 ops.push(remove('undo-c2','c2',['nested']));assert.deepEqual(record(fold(ops)).accepted.current.load,config('BW+band'));
 ops.push(remove('undo-c1','c1',['undo-c2']));assert.deepEqual(record(fold(ops)).accepted.current.load,config('BW'));
 ops.push(remove('restore-c1','undo-c1'));assert.deepEqual(record(fold(ops)).accepted.current.load,config('BW+band'));
});
test('invalid clear and mixed correction are contained without corrupting another recorded set',()=>{
 for(const value of [{clear:true},{...numeric,...config('BW')}]){
  const view=fold([start(),set(config('BW')),set(numeric,'other'),correction('bad','set',{load:value})]);
  assert.equal(record(view).accepted.active,null);assert.equal(record(view).accepted.current,null);
  assert.deepEqual(record(view,'other').accepted.current.load,numeric);
 }
});
test('pending concurrent load changes preserve accepted load and remain unresolved locally',()=>{
 const ops=[start(),set(config('BW'))],pending=[correction('a','set',{load:numeric}),correction('b','set',{load:config('hold')})];
 const view=normalize([...rows(ops),...pending.map(operation=>({operation,status:'stored-on-this-device'}))],ops.length);
 assert.deepEqual(record(view).accepted.current.load,config('BW'));
 assert.equal(record(view).local.current,null);assert(record(view).local.issues.includes('CONCURRENT_EDIT_INTERPRETATION_REQUIRED'));
});
test('legacy numeric observations retain their original domain and never acquire configured meaning',()=>{
 assert.equal(V.validValue('load',{value:0,unit:'lb'},1),true);assert.equal(V.validValue('load',{value:-1,unit:'lb'},1),true);
 assert.equal(V.validValue('load',config('BW'),1),false);
 const old=op('old','session-set',{load:{value:0,unit:'lb'},reps:{value:8,unit:'rep'},lift:'legacy-lift',slot:1},{version:1});
 const view=fold([old]);assert.deepEqual(record(view,'old').accepted.current.load,{value:0,unit:'lb'});
 assert.equal(view.progression_eligible,false);
});
