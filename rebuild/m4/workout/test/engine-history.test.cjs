'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{webcrypto}=require('node:crypto');
const {createEngineHistoryProjector}=require('../engine-history.cjs'),S=require('../../spec/performed-proposal/source.cjs');
const w6=process.env.PERFORMED_W6_DIR;if(!w6)throw Error('Explicit retained PERFORMED_W6_DIR required');
const load=file=>import(pathToFileURL(path.join(w6,file))),candidate=S.construct(S.baseline());
const clock={today:()=> '2026-09-04',nowMs:()=>Date.parse('2026-09-04T12:00:00Z'),nowISO:()=> '2026-09-04T12:00:00.000Z',hour:()=>12,dow:()=>5};
function engine(){return S.load(candidate.sources)('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});}
const bound={tag:'at_least',value:3,unit:'rep'},exact=value=>({tag:'exact',value,unit:'rep'});
async function fixture(options={}){
 const [{fixture,initial,config,O,createT2Stage},{createDurablePublicClient},{parseStrictJson},{projectWorkoutRecords}]=await Promise.all([
  load('rebuild/m3/w6/test/support.mjs'),load('rebuild/m3/w6/public-client.mjs'),load('rebuild/m3/w6/strict-json.mjs'),load('rebuild/m4/workout/project-history.mjs')]);
 const Sign=require(path.join(w6,'rebuild/m3/w5/crypto.cjs')),Capture=require(path.join(w6,'rebuild/m4/workout/capture.cjs')),Commands=require(path.join(w6,'rebuild/m4/workout/commands.cjs'));
 const key=Sign.generateSigningKey('synthetic-engine-history'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},key),capture=Capture.createPrescriptionCapture({parseStrictJson});
 const f=await fixture(),g=initial();g.metadata.authorityLease=lease;await f.repo.initialize(g,'synthetic-enrollment-only');
 const producer={app_build:'synthetic-history-join',engine_build:S.base,rule_profile:'synthetic-captured-layout/v1',source_schema:'2'},layouts=new Map();
 const ids=options.ids||['original α','not-a-canonical-tuple','terminal/slot'],weights=[40,35,30],targets=[2,1,0];let currentIds=ids;
 const unknown=()=>({state:'unknown',display:'Unknown',source_json:null}),cell=x=>({state:'specified',display:JSON.stringify(x),source_json:JSON.stringify(x)});
 const args={repository:f.repo,stage:createT2Stage(config,{allowInbound:true,workoutCommands:Commands.createWorkoutCommands({prescriptionCapture:capture})}),namespace:f.setup.namespace,
  athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,observationGuard:{run:async(_k,fn)=>fn()},validateCommit:()=>null,
  keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,prescriptionCapture:capture,workoutProducerIdentity:producer,
  resolveWorkoutBasis:()=>({plan_basis:'synthetic-plan',input_basis:'synthetic-input',causal_parents:[]}),
  workoutProducer:(_g,context)=>{
   const ids=currentIds.slice();
   // Same declared synthetic captured plan feeds BOTH the real capture and
   // the trusted historical layout registry. Never decode arbitrary slot IDs.
   const layout={profile:'earned/captured-lift-layout/v1',correspondence_profile:'synthetic/lift-positions/v1',producer:context.producer,basis:context.basis,
    slots:ids.map((id,i)=>({logical_set_slot:id,lift_lineage_id:'demo-press',position:i+1,prescribed_effort:{state:'specified',target:targets[i]}}))};
   layouts.set(JSON.stringify(context.basis),structuredClone(layout));
   return {profile:capture.profile,producer:context.producer,basis:context.basis,session:{instruction:unknown(),reason:unknown(),confidence:unknown()},
    slots:ids.map((id,i)=>({logical_set_slot:id,lift_lineage_id:'demo-press',label:'Synthetic press',load:cell({value:weights[i],unit:'lb'}),reps:cell({value:8,unit:'rep'}),effort:cell({target:targets[i],unit:'rep'}),setup:unknown(),reason:unknown(),confidence:unknown()}))};
  }};
 const client=createDurablePublicClient(args),p=await client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert(p.prepared,p.code);
 const start=await client.startPreparedWorkout({preparedId:p.preparedId});assert(start.acknowledged,start.code);
 const setIds=[];
 for(let i=0;i<3;i++){
  if(i===2&&options.terminal==='unlogged')continue;
  const skip=i===2&&options.terminal==='skipped';
  const rating=options.ratings?options.ratings[i]:i===0?bound:exact(i===1?0:1);
  const r=await client.execute('workout',{action:skip?'skip':'set',input:{session_start_op_id:start.op_id,logical_set_slot:ids[i],lift_lineage_id:'demo-press',
   ...(skip?{skip_scope:'set',reason:'Time'}:{load:{value:weights[i],unit:'lb'},reps:{value:8-i,unit:'rep'},...(rating===undefined?{}:{reserve:rating})})}});assert(r.acknowledged,r.code);setIds.push(r.op_id);
 }
 let closed;if(!options.open){closed=await client.execute('workout',{action:'close',input:{session_start_op_id:start.op_id,completion_kind:options.terminal?'early':'normal',causal_parents:[start.op_id,...setIds]}});assert(closed.acknowledged,closed.code);}
 const resolveCapturedLayout=({start})=>structuredClone(layouts.get(JSON.stringify(start.prescription_capture.basis)));
 const dependencies={athleteId:'ath-1',deviceId:'dev-A',projectWorkoutRecords,parseStrictJson,resolveCapturedLayout};
 const mapper=createEngineHistoryProjector(dependencies);
 async function source(){const fresh=await f.fresh();try{const c=createDurablePublicClient({...args,repository:fresh.repository}),read=await c.readWorkoutHistory();assert(read.read,read.code);
  const snapshot=await fresh.repository.load();assert.equal(snapshot.revision,read.source_revision);return {history:read.history,generation:snapshot.generation,sourceRevision:read.source_revision};
 }finally{fresh.repository.close();}}
 const map=async()=>{const s=await source(),before=JSON.stringify(s),out=mapper.project(s.history,s.generation,{sourceRevision:s.sourceRevision});assert.equal(JSON.stringify(s),before,'Actual source untouched');return out;};
 async function startNext({complete=false}={}){
  assert(closed?.acknowledged);currentIds=['next arbitrary opener','next middle','next last'];
  args.resolveWorkoutBasis=()=>({plan_basis:'synthetic-next-plan',input_basis:'synthetic-next-input',causal_parents:[closed.op_id]});
  const c=createDurablePublicClient(args),p=await c.prepareWorkout({planned_split_slot_id:'synthetic-next-slot'});assert(p.prepared,p.code);
  const next=await c.startPreparedWorkout({preparedId:p.preparedId});assert(next.acknowledged,next.code);
  for(let i=0;i<(complete?3:1);i++){const r=await c.execute('workout',{action:'set',input:{session_start_op_id:next.op_id,logical_set_slot:currentIds[i],lift_lineage_id:'demo-press',load:{value:weights[i],unit:'lb'},reps:{value:9-i,unit:'rep'},reserve:bound}});assert(r.acknowledged,r.code);}
  if(complete){const r=await c.execute('workout',{action:'close',input:{session_start_op_id:next.op_id,completion_kind:'normal'}});assert(r.acknowledged,r.code);}
  return {client:c,start:next,ids:currentIds.slice()};
 }
 return {...f,client,args,ids,setIds,start,source,map,mapper,layouts,startNext,dependencies};
}
test('actual stored arbitrary slot IDs reach the proposed real reader with exact per-set loads and bounds',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const facts=await f.map(),entry=facts.sessions[0].record.entries[0],E=engine();
 assert.deepEqual(entry.slots.map(s=>s.logical_set_slot),f.ids);assert.deepEqual(entry.slots.map(s=>s.position),[1,2,3]);
 assert.equal(E.sessionScore(entry),745);assert.deepEqual(E.rirSetsOf(entry),[bound,exact(0),exact(1)]);
 assert.equal(E.rirReceipt(entry),'RIR at least 3→1');assert.equal(facts.progression_eligible,false);
 assert.deepEqual(entry.slots.map(s=>s.fact.source_op_id),f.setIds);
});
test('actual correction and removal reopen into reader accounting without compacting captured positions',async t=>{
 const f=await fixture({terminal:'skipped'});t.after(()=>f.repo.close());
 const p=await f.client.prepareWorkoutEdit({target_op_id:f.setIds[1]});assert(p.prepared,p.code);
 const changed=await f.client.commitWorkoutEdit({editId:p.editId,action:'correct',change:{load:{value:25,unit:'lb'}}});assert(changed.acknowledged,changed.code);
 let facts=await f.map(),entry=facts.sessions[0].record.entries[0],E=engine();
 assert.equal(E.sessionScore(entry),495);assert.equal(entry.slots[1].fact.original.load.value,35);assert.deepEqual(entry.slots[1].fact.edit_op_ids,[changed.op_id]);
 let edit=await f.client.prepareWorkoutEdit({target_op_id:f.setIds[1]});const removed=await f.client.commitWorkoutEdit({editId:edit.editId,action:'remove',change:'Mistaken'});assert(removed.acknowledged,removed.code);
 facts=await f.map();entry=facts.sessions[0].record.entries[0];assert.deepEqual(entry.slots.map(s=>s.state),['performed','removed','skipped']);
 assert.equal(E.sessionScore(entry),320);assert.deepEqual(E.rirSetsOf(entry),[bound,{tag:'removed'},{tag:'skipped'}]);
 assert.deepEqual(entry.slots[1].removed_facts[0].edit_op_ids,[changed.op_id,removed.op_id]);assert.equal(entry.slots[2].skip_op_id,f.setIds[2]);
 assert.equal(E.progressStep({lastMeta:entry,holdFlag:false},{}).add,2,'Existing conditional opener branch, not a new safety/eligibility claim');
});
test('actual missing terminal stays unlogged and is not replaced by the last performed middle set',async t=>{
 const f=await fixture({terminal:'unlogged'});t.after(()=>f.repo.close());const entry=(await f.map()).sessions[0].record.entries[0],E=engine();
 assert.equal(entry.slots[2].state,'unlogged');assert.equal(entry.slots[2].fact,undefined);assert.deepEqual(E.terminalRir(entry),{tag:'absent'});
 assert.equal(E.progressStep({lastMeta:entry,holdFlag:false},{}).add,2);assert.equal(E.sessionScore(entry),565);
});
test('unclosed workout is not manufactured into a completed engine record',async t=>{
 const f=await fixture({open:true});t.after(()=>f.repo.close());const facts=await f.map();assert.equal(facts.sessions.length,0);
 assert.equal(facts.incomplete_sessions[0].completion_state,'open');assert.equal(facts.incomplete_sessions[0].record.entries[0].slots.length,3);
 assert.equal(facts.incomplete_sessions[0].record.entries[0].completion,null);assert.deepEqual(facts.order.start_ids,[]);assert.deepEqual(facts.source_order.start_ids,[f.start.op_id]);
 assert.throws(()=>engine().sessionScore(facts.incomplete_sessions[0].record.entries[0]),{code:'PERFORMED_COMPLETION_REQUIRED'});
});
test('completed plus open same-day workouts retain completed reader facts and explicit unfinished evidence',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const next=await f.startNext();let facts=await f.map(),E=engine();
 assert.deepEqual(facts.source_order.start_ids,[f.start.op_id,next.start.op_id]);assert.deepEqual(facts.order.start_ids,[f.start.op_id]);
 assert.equal(facts.incomplete_sessions[0].start_op_id,next.start.op_id);assert.equal(facts.incomplete_sessions[0].record.entries[0].slots[0].fact.current.reps.value,9);
 assert.equal(E.performedHistoryRows({sessionLog:{},workoutFacts:facts}).length,1);assert.equal(E.sessionScore(facts.sessions[0].record.entries[0]),745);
 const close=await next.client.execute('workout',{action:'close',input:{session_start_op_id:next.start.op_id,completion_kind:'early'}});assert(close.acknowledged,close.code);
 facts=await f.map();assert.equal(facts.incomplete_sessions.length,0);assert.deepEqual(facts.order.start_ids,[f.start.op_id,next.start.op_id]);
 assert.equal(facts.sessions[0].effective.local_date,facts.sessions[1].effective.local_date);assert.equal(E.performedHistoryRows({sessionLog:{},workoutFacts:facts}).length,2);
 assert.equal(facts.sessions[1].record.entries[0].slots[1].state,'unlogged');assert.equal(facts.progression_eligible,false);
});
test('cross-session positions compare without renaming original IDs and never cross a different correspondence profile',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const next=await f.startNext({complete:true}),facts=await f.map(),[a,b]=facts.sessions.map(s=>s.record.entries[0]),E=engine();
 assert.deepEqual(a.slots.map(s=>s.logical_set_slot),f.ids);assert.deepEqual(b.slots.map(s=>s.logical_set_slot),next.ids);
 assert.deepEqual(E.performedPair(a,b),{a:[8,7,6],b:[9,8,7]});
 const different=structuredClone(b);different.correspondence_profile='synthetic/different-position-meaning';assert.equal(E.performedPair(a,different),null);
 delete different.correspondence_profile;assert.throws(()=>E.performedPair(a,different),{code:'PERFORMED_ENTRY_INVALID'});
});
test('absent, unknown, skipped question and not-asked effort survive actual storage without numeric substitution',async t=>{
 for(const rating of [undefined,{tag:'unknown'},{tag:'skipped'},{tag:'not_asked'}]){
  const f=await fixture({ratings:[bound,rating,rating]});try{const entry=(await f.map()).sessions[0].record.entries[0],E=engine();
   assert.deepEqual(E.rirSetsOf(entry),[bound,rating||{tag:'absent'},rating||{tag:'absent'}]);assert.equal(E.sessionScore(entry),745);
  }finally{f.repo.close();}
 }
});
test('multiple removed originals at one planned position remain distinct and contribute no current measurement',async t=>{
 const f=await fixture({open:true});t.after(()=>f.repo.close());const remove=async id=>{const p=await f.client.prepareWorkoutEdit({target_op_id:id});assert(p.prepared,p.code);
  const r=await f.client.commitWorkoutEdit({editId:p.editId,action:'remove',change:'Mistaken record'});assert(r.acknowledged,r.code);return r;};
 const first=await remove(f.setIds[1]);
 const replacement=await f.client.execute('workout',{action:'set',input:{session_start_op_id:f.start.op_id,logical_set_slot:f.ids[1],lift_lineage_id:'demo-press',load:{value:25,unit:'lb'},reps:{value:7,unit:'rep'},causal_parents:[first.op_id]}});assert(replacement.acknowledged,replacement.code);
 const second=await remove(replacement.op_id),closed=await f.client.execute('workout',{action:'close',input:{session_start_op_id:f.start.op_id,completion_kind:'early',causal_parents:[f.start.op_id,second.op_id]}});assert(closed.acknowledged,closed.code);
 const facts=await f.map(),entry=facts.sessions[0].record.entries[0];assert.equal(entry.slots[1].state,'removed');
 assert.deepEqual(entry.slots[1].removed_facts.map(x=>x.source_op_id),[f.setIds[1],replacement.op_id]);assert.equal(engine().sessionScore(entry),500);
 const before=await f.source();entry.slots[0].fact.current.load.value=999;entry.slots[1].removed_facts[0].original.load.value=999;assert.deepEqual(await f.source(),before);
});
test('competing actual set records stay unresolved for the affected slot rather than selecting or summing them',async t=>{
 const f=await fixture({open:true});t.after(()=>f.repo.close());const another=await f.client.execute('workout',{action:'set',input:{session_start_op_id:f.start.op_id,logical_set_slot:f.ids[1],lift_lineage_id:'demo-press',load:{value:99,unit:'lb'},reps:{value:7,unit:'rep'}}});assert(another.acknowledged,another.code);
 const close=await f.client.execute('workout',{action:'close',input:{session_start_op_id:f.start.op_id,completion_kind:'early'}});assert(close.acknowledged,close.code);
 const facts=await f.map(),entry=facts.sessions[0].record.entries[0];assert.equal(entry.slots[1].state,'unresolved');assert(entry.slots[1].issues.includes('SET_SLOT_RESOLUTION_REQUIRED'));
 assert.deepEqual(entry.slots[1].unresolved_fact_ids,[f.setIds[1],another.op_id]);assert.equal(engine().sessionScore(entry),null);assert(facts.sessions[0].source_record_ids.includes(another.op_id));
});
test('current capture strings cannot stand in for the original registered layout or target binding',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const s=await f.source();
 for(const [mutate,code]of [[l=>{l.producer.app_build='different';},'WORKOUT_CAPTURE_LAYOUT_UNPROVEN'],[l=>{l.basis.source_revision++;},'WORKOUT_CAPTURE_LAYOUT_UNPROVEN'],
  [l=>{l.slots[1].logical_set_slot='renamed';},'WORKOUT_CAPTURE_LAYOUT_UNPROVEN'],[l=>{l.slots[1].position=1;},'WORKOUT_CAPTURE_LAYOUT_UNPROVEN'],
  [l=>{l.slots[2].prescribed_effort.target=2;},'WORKOUT_CAPTURE_TARGET_DISAGREEMENT']]){
  const mapper=createEngineHistoryProjector({...f.dependencies,resolveCapturedLayout:x=>{const l=f.dependencies.resolveCapturedLayout(x);mutate(l);return l;}});
  assert.throws(()=>mapper.project(s.history,s.generation,{sourceRevision:s.sourceRevision}),{code});
 }
});
test('detached source records, altered current values and omitted operations cannot enter the engine view',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const s=await f.source();
 const changed=structuredClone(s);changed.history.sessions[0].projection.facts[0].current.load.value=999;
 assert.throws(()=>f.mapper.project(changed.history,changed.generation,{sourceRevision:s.sourceRevision}),{code:'WORKOUT_ENGINE_PROJECTION_DISAGREEMENT'});
 const detached=structuredClone(s);detached.history.sessions[0].records[0].operation.payload.reps.value=99;
 assert.throws(()=>f.mapper.project(detached.history,detached.generation,{sourceRevision:s.sourceRevision}),{code:'WORKOUT_ENGINE_HISTORY_DISAGREEMENT'});
 const missing=structuredClone(s);missing.history.sessions=[];assert.throws(()=>f.mapper.project(missing.history,missing.generation,{sourceRevision:s.sourceRevision}),{code:'WORKOUT_ENGINE_HISTORY_INCOMPLETE'});
 const status=structuredClone(s);status.history.sessions[0].records[0].status='accepted-through-frontier';status.history.sessions[0].records[0].receipt_sequence=1;
 assert.throws(()=>f.mapper.project(status.history,status.generation,{sourceRevision:s.sourceRevision}),{code:'WORKOUT_ENGINE_STATUS_DISAGREEMENT'});
 const foreign=createEngineHistoryProjector({...f.dependencies,athleteId:'other-athlete'});
 assert.throws(()=>foreign.project(s.history,s.generation,{sourceRevision:s.sourceRevision}),{code:'WORKOUT_ENGINE_SCOPE_DISAGREEMENT'});
});
