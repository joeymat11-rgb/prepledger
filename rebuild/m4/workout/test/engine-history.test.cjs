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

test('shared nested edits and corrected completion reach the same actual reopened engine reader',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const E=engine(),original=await f.map(),capture=structuredClone(original.sessions[0].capture);
 const correct=(target,fields,parents)=>f.client.execute('workout',{action:'correct',input:{target_op_id:target,lift_lineage_id:'demo-press',replacement_fields:fields,causal_parents:parents||[]}});
 const one=await correct(f.setIds[0],{load:{value:10,unit:'lb'}});assert(one.acknowledged,one.code);
 const two=await correct(f.setIds[0],{load:{value:20,unit:'lb'}},[one.op_id]);assert(two.acknowledged,two.code);
 const nested=await correct(one.op_id,{replacement_fields:{load:{value:30,unit:'lb'}}},[two.op_id]);assert(nested.acknowledged,nested.code);
 let facts=await f.map(),entry=facts.sessions[0].record.entries[0];assert.equal(E.sessionScore(entry),585);assert.equal(entry.slots[0].fact.original.load.value,40);assert(entry.slots[0].fact.edit_op_ids.includes(nested.op_id));
 const removed=await f.client.execute('workout',{action:'remove',input:{target_op_id:two.op_id,lift_lineage_id:'demo-press',reason:'Mistaken edit',causal_parents:[nested.op_id]}});assert(removed.acknowledged,removed.code);
 facts=await f.map();assert.equal(E.sessionScore(facts.sessions[0].record.entries[0]),665);assert.deepEqual(facts.sessions[0].capture,capture);
 const date=await f.client.execute('workout',{action:'correct',input:{target_op_id:f.start.op_id,replacement_fields:{effective:{local_date:'2026-09-02',local_time:'12:00',utc_offset:'-04:00'}}}});assert(date.acknowledged,date.code);
 facts=await f.map();assert.equal(facts.sessions[0].effective.local_date,'2026-09-02');assert.deepEqual(facts.sessions[0].capture,capture);
 const source=await f.source(),close=source.history.sessions[0].records.find(r=>r.operation.kind==='session-close').operation;
 const unfinish=await f.client.execute('workout',{action:'remove',input:{target_op_id:close.op_id,reason:'Not finished'}});assert(unfinish.acknowledged,unfinish.code);
 facts=await f.map();assert.equal(facts.sessions.length,0);assert.equal(facts.incomplete_sessions.length,1);assert.deepEqual(facts.incomplete_sessions[0].capture,capture);
 assert.equal(facts.progression_eligible,false);
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

test('actual preparation passes reopened corrected facts through the host into the proposed real reader',async t=>{
 const f=await fixture({terminal:'skipped'});t.after(()=>f.repo.close());
 const p=await f.client.prepareWorkoutEdit({target_op_id:f.setIds[1]});assert(p.prepared,p.code);
 const changed=await f.client.commitWorkoutEdit({editId:p.editId,action:'correct',change:{load:{value:25,unit:'lb'}}});assert(changed.acknowledged,changed.code);
 const {createDurablePublicClient}=await load('rebuild/m3/w6/public-client.mjs'),fresh=await f.fresh();t.after(()=>fresh.repository.close());
 let projected=0,basisFacts,producerFacts;
 const c=createDurablePublicClient({...f.args,repository:fresh.repository,
  projectWorkoutHistory:({history,generation,source_revision})=>{projected++;return f.mapper.project(history,generation,{sourceRevision:source_revision});},
  resolveWorkoutBasis:(g,input,context)=>{basisFacts=structuredClone(context.workoutFacts);const close=Object.values(g.collections.ops).find(op=>op.kind==='session-close');
   return {...f.args.resolveWorkoutBasis(g,input),causal_parents:[close.op_id,changed.op_id]};},
  workoutProducer:(g,context)=>{producerFacts=structuredClone(context.workoutFacts);const out=f.args.workoutProducer(g,context);
   const entry=context.workoutFacts.sessions[0].record.entries[0],E=engine();
   // Exercise the real affected reader inside the actual configured callback;
   // this is a synthetic factual explanation, not a qualified prescription.
   out.session.reason={state:'specified',display:'Synthetic recorded accounting: '+E.sessionScore(entry),source_json:JSON.stringify({accounting:E.sessionScore(entry),effort:E.rirReceipt(entry)})};return out;}});
 const before=await fresh.repository.load(),prepared=await c.prepareWorkout({planned_split_slot_id:'synthetic-next-slot'});
 assert(prepared.prepared,prepared.code);assert.equal(projected,1);assert.deepEqual(basisFacts,producerFacts);
 assert.equal(producerFacts.source_revision,before.revision);assert.equal(producerFacts.sessions[0].record.entries[0].slots[1].fact.original.load.value,35);
 assert.deepEqual(producerFacts.sessions[0].record.entries[0].slots[1].fact.edit_op_ids,[changed.op_id]);
 assert.deepEqual(JSON.parse(prepared.view.session.reason.source_json),{accounting:495,effort:'RIR at least 3→skipped'});
 assert.deepEqual(await fresh.repository.load(),before,'Preparation projects without a write');
 const started=await c.startPreparedWorkout({preparedId:prepared.preparedId});assert(started.acknowledged,started.code);
 const reopened=await f.fresh();t.after(()=>reopened.repository.close());const reread=await createDurablePublicClient({...f.args,repository:reopened.repository}).readWorkoutHistory();assert(reread.read,reread.code);
 assert.equal(reread.history.sessions.length,2);const next=reread.history.sessions.find(s=>s.start.operation.op_id===started.op_id);
 assert.deepEqual(next.original,prepared.view,'Next Start keeps the exact history-based prepared capture after reopen');
 const old=reread.history.sessions.find(s=>s.start.operation.op_id===f.start.op_id);
 assert.equal(old.projection.facts.find(x=>x.source_op_id===f.setIds[1]).current.load.value,25);
});

test('actual resume policy receives full open facts without inserting them into the completed reader',async t=>{
 const f=await fixture({open:true});t.after(()=>f.repo.close());const {createDurablePublicClient}=await load('rebuild/m3/w6/public-client.mjs');let policyFacts;
 const c=createDurablePublicClient({...f.args,
  projectWorkoutHistory:({history,generation,source_revision})=>f.mapper.project(history,generation,{sourceRevision:source_revision}),
  workoutResumePolicy:(_g,context)=>{policyFacts=context.workoutFacts;return {allowed_actions:['set','skip','close'],reason:'Synthetic current policy',
   current_capture:{...structuredClone(context.original),producer:context.producer,basis:context.basis}};}});
 const prepared=await c.prepareWorkoutContinuation({session_start_op_id:f.start.op_id});assert(prepared.prepared,prepared.code);
 assert.equal(policyFacts.sessions.length,0);assert.equal(policyFacts.incomplete_sessions[0].start_op_id,f.start.op_id);
 assert.deepEqual(policyFacts.incomplete_sessions[0].record.entries[0].slots[0].fact.current.reserve,bound);
 assert.equal(engine().performedHistoryRows({sessionLog:{},workoutFacts:policyFacts}).length,0);
});

// Conditional internal-source tests: real retained factual/layout/capture code,
// explicitly synthetic accepted inventories/cuts. No signature or issuance proof.
async function capturedSourcesFixture(t){
 const f=await fixture();t.after(()=>f.repo.close());await f.startNext();
 const source=await f.source(),{storedWorkoutHistory}=await load('rebuild/m4/workout/stored-history.mjs');
 const C=require(path.join(w6,'rebuild/m4/workout/capture.cjs'));
 const Source=require(path.join(process.env.EARNED_SOURCE_R1_ROOT||path.resolve(w6,'../m3-w5-r1'),'rebuild/m3/w5/source/codec.cjs'));
 const validator=C.createPrescriptionCapture({parseStrictJson:f.dependencies.parseStrictJson,profile:C.SOURCE_PROFILE,sourceCodec:Source});
 const basis=n=>({W:n,log_digest:Buffer.alloc(32,n).toString('base64url'),selection_id:n?'source-'+n:null});
 const a=basis(1),b=basis(2),g=structuredClone(source.generation),native=Object.values(g.collections.ops);
 const selections=[a,b].map((cut,i)=>({intent_op_id:cut.selection_id,source_id:'synthetic-material-'+i,seq:cut.W,action:'activate',commitment:'synthetic-source-commitment-'+i}));
 const sourceOps=selections.map(s=>({op_id:s.intent_op_id,athlete_id:'ath-1',device_id:'dev-A',schema_version:1,class:'event',kind:'fact',
  causal_parents:[],canonical_content_commitment:s.commitment,payload:{type:'source-import-intent',source_id:s.source_id}}));
 let n=0;for(const op of native)if(op.kind==='session-start'){
  op.prescription_capture={...op.prescription_capture,profile:C.SOURCE_PROFILE,source_basis:structuredClone(n++?b:a)};
 }
 g.collections.ops=Object.fromEntries([...sourceOps,...native].map(op=>[op.op_id,op]));
 g.collections.receipts=Object.fromEntries([...sourceOps,...native].map((op,i)=>[String(i+1),{seq:i+1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment}]));
 g.collections.sync.frontier.W=sourceOps.length+native.length;
 const rebuild=(generation=g)=>storedWorkoutHistory(generation,{athleteId:'ath-1',deviceId:'dev-A',prescriptionCapture:validator,recoveryReceipts:Object.values(generation.collections.receipts)});
 const mapper=createEngineHistoryProjector({...f.dependencies,prescriptionCapture:validator});
 const read=async bases=>bases.map(cut=>({frontier:structuredClone(cut),current:cut.selection_id===null?null:structuredClone(selections.find(s=>s.intent_op_id===cut.selection_id))}));
 const options={sourceRevision:source.sourceRevision,readSourceCuts:read,assertCurrent:async()=>{}};
 const run=(generation=g,overrides={})=>mapper.projectWithSources(rebuild(generation),generation,{...options,...overrides});
 return {f,g,a,b,empty:basis(0),selections,rebuild,mapper,validator,options,run};
}

test('source-aware factual mapping preserves delayed A capture after B and batches completed/open sources',async t=>{
 const x=await capturedSourcesFixture(t),before=JSON.stringify(x.g),original=x.rebuild(),expected=x.mapper.project(original,x.g,{sourceRevision:x.options.sourceRevision});let calls=0;
 const facts=await x.run(x.g,{readSourceCuts:async bases=>{calls++;assert.deepEqual(bases,[x.a,x.b]);return x.options.readSourceCuts(bases);}});
 assert.equal(calls,1);assert.equal(JSON.stringify(x.g),before);
 assert.deepEqual(facts.source_order,expected.source_order,'Native B15 order does not depend on selected import');
 assert.deepEqual(facts.sessions[0].capture,expected.sessions[0].capture);assert.deepEqual(facts.incomplete_sessions[0].capture,expected.incomplete_sessions[0].capture);
 assert.deepEqual(facts.sessions[0].original_source.basis,x.a);assert.deepEqual(facts.incomplete_sessions[0].original_source.basis,x.b);
 assert.equal(facts.sessions[0].original_source.selection.source_id,x.selections[0].source_id,'Delayed A Start is not relabeled B');
 assert(x.g.collections.receipts['3'].op_id===facts.sessions[0].start_op_id,'A Start accepted after both source operations');
 assert.equal(facts.progression_eligible,false);assert.equal(facts.order.import_anchor,undefined);
 assert.throws(()=>engine().performedHistoryRows({sessionLog:{'2026-09-01':{entries:[]}},workoutFacts:facts}),{code:'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED'},'Source association is not global legacy/native chronology');
 facts.sessions[0].original_source.selection.source_id='changed';assert.equal(x.selections[0].source_id,'synthetic-material-0');
});

test('unknown v1 original remains distinct from a proved empty source and pending v2 may use current cut',async t=>{
 const x=await capturedSourcesFixture(t),starts=Object.values(x.g.collections.ops).filter(op=>op.kind==='session-start');
 starts[0].prescription_capture.profile='earned/workout-prescription/v1';delete starts[0].prescription_capture.source_basis;
 let facts=await x.run();assert.equal(facts.sessions[0].original_source,null);assert.deepEqual(facts.incomplete_sessions[0].original_source.basis,x.b);
 starts[0].prescription_capture.profile='earned/workout-prescription/v2';starts[0].prescription_capture.source_basis=structuredClone(x.empty);
 facts=await x.run();assert.deepEqual(facts.sessions[0].original_source,{basis:x.empty,selection:null});
 x.g.collections.receipts=Object.fromEntries(Object.entries(x.g.collections.receipts).filter(([key])=>Number(key)<=2));x.g.collections.sync.frontier.W=2;
 facts=await x.run();assert.deepEqual(facts.incomplete_sessions[0].original_source.basis,x.b,'Pending Start may be prepared at the current authenticated cut');
});

test('captured source cuts reject future/equal accepted positions and mismatched or foreign returned selections',async t=>{
 const x=await capturedSourcesFixture(t),start=Object.values(x.g.collections.ops).find(op=>op.kind==='session-start');
 for(const W of [3,x.g.collections.sync.frontier.W+1]){
  const altered=structuredClone(x.g);altered.collections.ops[start.op_id].prescription_capture.source_basis.W=W;
  await assert.rejects(x.run(altered),{code:'WORKOUT_CAPTURE_SOURCE_POSITION_UNPROVEN'});
 }
 for(const change of [cuts=>{cuts.pop();},cuts=>{cuts[0].frontier.log_digest=x.b.log_digest;},cuts=>{cuts[0].frontier.selection_id=x.b.selection_id;}]){
  await assert.rejects(x.run(x.g,{readSourceCuts:async bases=>{const cuts=await x.options.readSourceCuts(bases);change(cuts);return cuts;}}),{code:'WORKOUT_CAPTURE_SOURCE_UNPROVEN'});
 }
 for(const change of [s=>{s.intent_op_id='source-2';},s=>{s.seq=2;},s=>{s.source_id='wrong-material';},s=>{s.commitment='wrong-original';}]){
  await assert.rejects(x.run(x.g,{readSourceCuts:async bases=>{const cuts=await x.options.readSourceCuts(bases);change(cuts[0].current);return cuts;}}),{code:'WORKOUT_CAPTURE_SOURCE_SCOPE_UNPROVEN'});
 }
 const foreign=structuredClone(x.g);foreign.collections.ops['source-1'].athlete_id='other-athlete';
 // The actual factual reader itself rejects the foreign inventory before source mapping.
 assert.throws(()=>x.rebuild(foreign),{code:'WORKOUT_RECOVERY_RECEIPT_INVALID'});
 await assert.rejects(x.mapper.projectWithSources(x.rebuild(),foreign,x.options),{code:'WORKOUT_HISTORY_SCOPE'});
});

test('source-aware projection has no partial result after guarded reader retirement',async t=>{
 const x=await capturedSourcesFixture(t);let current=true;
 await assert.rejects(x.run(x.g,{assertCurrent:async()=>{if(!current){const e=new Error('retired');e.code='RECOVERY_STAGE_CHANGED';throw e;}},
  readSourceCuts:async bases=>{const result=await x.options.readSourceCuts(bases);current=false;return result;}}),{code:'RECOVERY_STAGE_CHANGED'});
 await assert.rejects(x.run(x.g,{readSourceCuts:null}),{code:'WORKOUT_CAPTURE_SOURCE_READER_REQUIRED'});
 assert.equal(JSON.stringify((await x.run()).sessions[0].capture),JSON.stringify(x.rebuild().sessions[0].original),'Retry reads the exact original');
});

test('accepted native view excludes pending nested edits and completion changes while retaining local originals',async t=>{
 const x=await capturedSourcesFixture(t),beforeCut=x.g.collections.sync.frontier.W;
 const correct=(id,fields,parents=[])=>x.f.client.execute('workout',{action:'correct',input:{target_op_id:id,lift_lineage_id:'demo-press',replacement_fields:fields,causal_parents:parents}});
 const first=await correct(x.f.setIds[0],{load:{value:25,unit:'lb'}});assert(first.acknowledged,first.code);
 const nested=await correct(first.op_id,{replacement_fields:{load:{value:20,unit:'lb'}}},[first.op_id]);assert(nested.acknowledged,nested.code);
 const close=Object.values(x.g.collections.ops).find(op=>op.kind==='session-close');
 const removed=await x.f.client.execute('workout',{action:'remove',input:{target_op_id:close.op_id,reason:'Not complete'}});assert(removed.acknowledged,removed.code);
 const secondStart=Object.values(x.g.collections.ops).find(op=>op.kind==='session-start'&&op.op_id!==x.f.start.op_id);
 const newSet=await x.f.client.execute('workout',{action:'set',input:{session_start_op_id:secondStart.op_id,
  logical_set_slot:secondStart.prescription_capture.slots[1].logical_set_slot,lift_lineage_id:'demo-press',load:{value:30,unit:'lb'},reps:{value:6,unit:'rep'}}});assert(newSet.acknowledged,newSet.code);
 const newClose=await x.f.client.execute('workout',{action:'close',input:{session_start_op_id:secondStart.op_id,completion_kind:'early'}});assert(newClose.acknowledged,newClose.code);
 // Carry actual newly emitted local operations into the explicitly synthetic
 // accepted inventory fixture without altering any of its retained originals.
 const current=await x.f.source();for(const [id,op]of Object.entries(current.generation.collections.ops))if(!Object.hasOwn(x.g.collections.ops,id)){
  x.g.collections.ops[id]=structuredClone(op);x.g.collections.outbox[id]=structuredClone(current.generation.collections.outbox[id]);
 }
 const history=x.rebuild(),before=JSON.stringify({g:x.g,history}),local=await x.mapper.projectWithSources(history,x.g,x.options);
 let accepted=await x.mapper.projectAcceptedWithSources(history,x.g,x.options);
 const localFirst=local.incomplete_sessions.find(s=>s.start_op_id===x.f.start.op_id);
 assert.equal(localFirst.record.entries[0].slots[0].fact.current.load.value,20);
 assert.equal(local.sessions[0].start_op_id,secondStart.op_id,'Pending Close is visible only in the local layer');
 assert.equal(accepted.sessions[0].start_op_id,x.f.start.op_id,'Pending removal cannot undo accepted completion');
 assert.equal(accepted.sessions[0].record.entries[0].slots[0].fact.current.load.value,40);
 assert.equal(accepted.incomplete_sessions[0].start_op_id,secondStart.op_id);
 assert.deepEqual(accepted.sessions[0].capture,localFirst.capture);assert.deepEqual(accepted.sessions[0].original_source,localFirst.original_source);
 assert.equal(JSON.stringify({g:x.g,history}),before,'Both projections leave all local originals and source fields untouched');
 // Accept the original correction, leaving its nested edit pending. Earlier
 // checkpoint reproduction still excludes this later accepted effect.
 const op=x.g.collections.ops[first.op_id],seq=beforeCut+1;
 x.g.collections.receipts[String(seq)]={seq,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment};x.g.collections.sync.frontier.W=seq;
 const later=x.rebuild();accepted=await x.mapper.projectAcceptedWithSources(later,x.g,x.options);
 assert.equal(accepted.sessions[0].record.entries[0].slots[0].fact.current.load.value,25);
 assert.deepEqual(accepted.sessions[0].record.entries[0].slots[0].fact.edit_op_ids,[first.op_id]);
 const original=await x.mapper.projectAcceptedWithSources(later,x.g,{...x.options,through:beforeCut});
 assert.equal(original.sessions[0].record.entries[0].slots[0].fact.current.load.value,40);
 assert.equal(original.source_order.frontier,beforeCut);assert.deepEqual(original.sessions[0].capture,accepted.sessions[0].capture);
 assert.equal((await x.mapper.projectWithSources(later,x.g,x.options)).incomplete_sessions[0].record.entries[0].slots[0].fact.current.load.value,20);
 for(const [i,id]of [newSet.op_id,newClose.op_id].entries()){
  const added=x.g.collections.ops[id],position=seq+i+1;x.g.collections.receipts[String(position)]={seq:position,op_id:id,canonical_content_commitment:added.canonical_content_commitment};
  x.g.collections.sync.frontier.W=position;
 }
 const newest=x.rebuild(),all=await x.mapper.projectAcceptedWithSources(newest,x.g,x.options);
 assert.equal(all.sessions.length,2);assert.equal(all.sessions[1].record.entries[0].slots[1].state,'performed');
 const inherited=await x.mapper.projectAcceptedWithSources(newest,x.g,{...x.options,originalThrough:beforeCut});
 assert.equal(inherited.original_through,beforeCut);assert.equal(inherited.source_order.frontier,x.g.collections.sync.frontier.W);
 assert.equal(inherited.sessions[0].record.entries[0].slots[0].fact.current.load.value,25,'Current accepted correction applies to the inherited original');
 assert.equal(inherited.incomplete_sessions[0].record.entries[0].slots[1].state,'unlogged','Later original Set is not falsely inherited');
 assert.equal(inherited.incomplete_sessions[0].completion_state,'open','Later original Close is not falsely inherited');
 assert(!inherited.incomplete_sessions[0].source_record_ids.includes(newSet.op_id));assert(!inherited.incomplete_sessions[0].source_record_ids.includes(newClose.op_id));
 const historical=await x.mapper.projectAcceptedWithSources(newest,x.g,{...x.options,through:beforeCut,originalThrough:beforeCut});
 assert.equal(historical.sessions[0].record.entries[0].slots[0].fact.current.load.value,40,'Original image excludes the later correction as well');
});

test('accepted-only projection keeps an all-local workout outside the prefix and rejects malformed historical cuts',async t=>{
 const f=await fixture();t.after(()=>f.repo.close());const source=await f.source(),before=JSON.stringify(source);
 const accepted=f.mapper.projectAccepted(source.history,source.generation,{sourceRevision:source.sourceRevision});
 assert.equal(accepted.sessions.length,0);assert.equal(accepted.incomplete_sessions.length,0);assert.equal(accepted.source_order.frontier,0);
 assert.equal(JSON.stringify(source),before);assert.equal((await f.map()).sessions.length,1);
 for(const through of [-1,0.5,1])assert.throws(()=>f.mapper.projectAccepted(source.history,source.generation,{sourceRevision:source.sourceRevision,through}),{code:'WORKOUT_ACCEPTED_CUT_INVALID'});
 const x=await capturedSourcesFixture(t),broken=structuredClone(x.g);delete broken.collections.receipts['1'];
 assert.throws(()=>x.mapper.projectAccepted(x.rebuild(),broken,{sourceRevision:x.options.sourceRevision,through:0}),{code:'WORKOUT_ORDER_PREFIX_INCOMPLETE'},'Selecting zero cannot hide a broken authenticated input prefix');
});

test('actual source reconstruction carries accepted native membership across later import, correction and rollback without plan writes',async t=>{
 const x=await capturedSourcesFixture(t),{createReadingReplay}=require('../../import/reading-replay.cjs'),{createImportPreparation}=require('../../import/prepare.cjs');
 const {createEngine}=require('../../../engine/index.cjs'),F=require('../../../m3/w7-preview/fixtures.cjs');
 const {createReadingProjector}=await load('rebuild/m3/w6/reading-history.mjs'),{storedWorkoutHistory}=await load('rebuild/m4/workout/stored-history.mjs');
 const day='2026-09-01',build='synthetic-native-source',engineFor=({day,hour})=>createEngine({clock:{today:()=>day,nowISO:()=>day+'T12:00:00.000Z',hour:()=>hour},ids:{fresh:name=>name+'synthetic'}});
 const native=Object.values(x.g.collections.ops).filter(op=>op.class==='session'),secondStart=native.findIndex(op=>op.kind==='session-start'&&op.op_id!==x.f.start.op_id);
 let accepted=[x.g.collections.ops['source-1'],...native.slice(0,secondStart),x.g.collections.ops['source-2'],...native.slice(secondStart)];
 const secondSeq=secondStart+2,cut=secondSeq-1;
 x.b.W=secondSeq;x.selections[1].seq=secondSeq;
 for(const op of native)if(op.kind==='session-start'&&op.op_id!==x.f.start.op_id)op.prescription_capture.source_basis=structuredClone(x.b);
 function inventory(){
  x.g.collections.ops={...x.g.collections.ops,...Object.fromEntries(accepted.map(op=>[op.op_id,op]))};
  x.g.collections.receipts=Object.fromEntries(accepted.map((op,i)=>[String(i+1),{seq:i+1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment}]));
  x.g.collections.dispositions=Object.fromEntries(accepted.map((op,i)=>[op.op_id,{op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,status:'ACCEPTED',athlete_log_seq:i+1}]));
  x.g.collections.sync.frontier={W:accepted.length,authorityW:accepted.length};return structuredClone(x.g);
 }
 function prefix(g,W){const result=structuredClone(g),keep=new Set(Object.values(result.collections.receipts).filter(r=>r.seq<=W).map(r=>r.op_id));
  for(const name of ['ops','dispositions'])result.collections[name]=Object.fromEntries(Object.entries(result.collections[name]).filter(([id])=>keep.has(id)));
  result.collections.receipts=Object.fromEntries(Object.entries(result.collections.receipts).filter(([,r])=>r.seq<=W));result.collections.outbox={};result.collections.rejected={};result.collections.sync.frontier={W,authorityW:W};return result;
 }
 const g=inventory(),root=prefix(g,0),parseStrictJson=x.f.dependencies.parseStrictJson;
 const synthetic=F.createSyntheticState(day),legacyDay=Object.keys(synthetic.sessionLog).sort()[0];
 synthetic.sessionLog={[legacyDay]:synthetic.sessionLog[legacyDay]};for(const entry of synthetic.sessionLog[legacyDay].entries)entry.rir=0;
 const bytes=Buffer.from(JSON.stringify(synthetic)),prep=createImportPreparation({engine:engineFor({day,hour:12}),parseStrictJson}).prepare(bytes,{localBytes:bytes});
 const material={source_json:bytes.toString(),candidate_json:prep.candidateBytes().toString(),local_json:bytes.toString(),checkpoint_json:JSON.stringify({revision:1,token:'synthetic',generation:root}),engine_context_json:JSON.stringify({build,clock:day})};
 const nodes=new Map([['source-1',{selection:{...x.selections[0],before:{W:0,selection_id:null},target_activation_id:null},material}]]);
 const reader=g=>storedWorkoutHistory(g,{athleteId:'ath-1',deviceId:'dev-A',prescriptionCapture:x.validator,recoveryReceipts:Object.values(g.collections.receipts).filter(r=>r.seq<=g.collections.sync.frontier.W)});
 const dependencies={engineFor,parseStrictJson,producerIdentity:'synthetic-source-reconstruction',importBuild:build,deviceId:'dev-A',projectReadings:createReadingProjector({athleteId:'ath-1',deviceId:'dev-A'})};
 const replay=createReadingReplay({...dependencies,workoutHistoryReader:reader,workoutProjector:x.mapper});
 const sourceBasis=(W,selection_id)=>({W,selection_id,log_digest:Buffer.alloc(32,W).toString('base64url')});
 const readSourceCuts=async bases=>bases.map(basis=>({frontier:structuredClone(basis),current:structuredClone(nodes.get(basis.selection_id)?.selection||null)}));
 const readSelectedSource=async id=>structuredClone(nodes.get(id));
 const options={asOf:'2026-09-07',sourceRevision:20,assertCurrent:async()=>{},readSourceCuts,readSelectedSource};
 const beforeB=prefix(g,cut),first=await replay.projectLineage({...options,selectionId:'source-1',generation:beforeB,sourceBasis:sourceBasis(cut,'source-1')});
 assert.equal(first.ready,true,JSON.stringify(first.issues));assert.equal(first.workout_history.sessions.length,1);
 assert.equal(Object.hasOwn(first.accepted_state,'workoutFacts'),false,'Native read state is never written into the immutable legacy/local image');
 const localBytes=Buffer.from(JSON.stringify(first.accepted_state)),incoming=structuredClone(synthetic),extraDay='2026-07-01';
 incoming.sessionLog[extraDay]=structuredClone(Object.values(incoming.sessionLog)[0]);incoming.sessionLog[extraDay].entries[0].reps[0]=4;
 const incomingBytes=Buffer.from(JSON.stringify(incoming)),merged=createImportPreparation({engine:engineFor({day,hour:12}),parseStrictJson}).prepare(incomingBytes,{localBytes});
 nodes.set('source-2',{selection:{...x.selections[1],before:{W:cut,selection_id:'source-1'},target_activation_id:null},material:{source_json:incomingBytes.toString(),candidate_json:merged.candidateBytes().toString(),local_json:localBytes.toString(),checkpoint_json:JSON.stringify({revision:20,token:'synthetic',generation:beforeB}),engine_context_json:JSON.stringify({build,clock:day})}});
 const pending=await x.f.client.execute('workout',{action:'correct',input:{target_op_id:x.f.setIds[0],lift_lineage_id:'demo-press',replacement_fields:{load:{value:25,unit:'lb'}}}});assert(pending.acknowledged,pending.code);
 const live=await x.f.source(),edit=live.generation.collections.ops[pending.op_id];x.g.collections.ops[edit.op_id]=structuredClone(edit);x.g.collections.outbox[edit.op_id]=structuredClone(live.generation.collections.outbox[edit.op_id]);
 const currentBefore=inventory(),withPending=await replay.projectLineage({...options,selectionId:'source-2',generation:currentBefore,sourceBasis:sourceBasis(accepted.length,'source-2')});
 assert.equal(withPending.ready,true,JSON.stringify(withPending.issues));assert.equal(withPending.workout_history.sessions[0].record.entries[0].slots[0].fact.current.load.value,40);
 accepted.push(edit);const current=inventory(),immutable=JSON.stringify({current,nodes:[...nodes]});
 const value=await replay.projectLineage({...options,selectionId:'source-2',generation:current,sourceBasis:sourceBasis(accepted.length,'source-2')});
 assert.equal(value.ready,true,JSON.stringify(value.issues));assert.equal(value.workout_history.sessions[0].record.entries[0].slots[0].fact.current.load.value,25);
 assert.equal(value.workout_history.incomplete_sessions.length,1);assert.equal(value.workout_history.source_members.filter(row=>row.op_id===edit.op_id).length,1);
 assert.equal(JSON.stringify({current,nodes:[...nodes]}),immutable);
 const nativeStep=value.coverage.source_lineage[0].native_membership;
 assert.equal(nativeStep.original_through,cut);assert.notEqual(nativeStep.original_facts_sha256,nativeStep.reconstructed_facts_sha256);
 assert(!nativeStep.original.source_members.some(row=>row.op_id===edit.op_id));assert(nativeStep.reconstructed.source_members.some(row=>row.op_id===edit.op_id));
 assert(!nativeStep.reconstructed.source_members.some(row=>row.op_id===native[secondStart].op_id),'New original after import is not inherited through its earlier checkpoint');
 assert.deepEqual(value.accepted_state,merged.candidateState(),'No completed-workout plan writer/receipt is replayed');
 const consumed=replay.workoutInput(value,value.source_basis);assert.strictEqual(consumed.workoutFacts,value.workout_history);assert.strictEqual(consumed.workoutFacts.legacy_baseline.session_log,consumed.state.sessionLog);
 assert(Object.isFrozen(consumed.workoutFacts));assert.equal(Object.hasOwn(consumed.state,'workoutFacts'),false);
 const CaptureEngine=require('../engine-capture.cjs'),actualEngine=engineFor({day:'2026-09-07',hour:12});let reached;
 const adapter=CaptureEngine.createEngineWorkoutCapture({engine:{genSession(...args){reached=args[0];return actualEngine.genSession(...args);},rirPlan:(...args)=>actualEngine.rirPlan(...args)},
  prescriptionCapture:x.validator,producerIdentity:{app_build:'synthetic-source-input-reach',engine_build:S.base,rule_profile:CaptureEngine.PROFILE,source_schema:'synthetic'},sourceProjectionReader:replay});
 const captureInput={sourceProjection:value,source_basis:value.source_basis,day:'2026-09-07',basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:20}};
 const captured=adapter.prepare(captureInput).capture;
 assert.deepEqual(reached.workoutFacts,consumed.workoutFacts);assert.notStrictEqual(reached.workoutFacts,consumed.workoutFacts);
 assert.strictEqual(reached.workoutFacts.legacy_baseline.session_log,reached.sessionLog,'Existing single input clone preserves the source/native alias');
 assert.deepEqual(JSON.parse(JSON.stringify(captured.source_basis)),value.source_basis);assert.equal(Object.hasOwn(value.accepted_state,'workoutFacts'),false);
 // Input reach is mechanical only: this installed legacy producer is not a
 // qualified rich-reader/guard implementation, and mixed chronology stays open.
 assert.throws(()=>engine().performedHistoryRows({...consumed.state,workoutFacts:consumed.workoutFacts}),{code:'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED'});
 // The nonshipping opener count needs this exact membership, not a global
 // source/native order. Other rule inputs and the clock stay fixed here.
 const loader=S.load(candidate.sources),fixedClock={...clock,today:()=> '2026-09-07',nowISO:()=> '2026-09-07T12:00:00.000Z',dow:()=>1};
 const proposed=loader('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock:fixedClock});
 Object.assign(proposed,loader('rebuild/engine/writers.cjs')(proposed,{clock:fixedClock,ids:{next(){throw Error('Unexpected writer');}},drafts:{length:0,key:()=>null}}));
 const memberAdapter=CaptureEngine.createEngineWorkoutCapture({engine:proposed,prescriptionCapture:x.validator,sourceProjectionReader:replay,
  producerIdentity:{app_build:'synthetic-source-membership-capture',engine_build:S.base,rule_profile:CaptureEngine.PROFILE,source_schema:'synthetic'}});
 const joinedCapture=memberAdapter.prepare(captureInput).capture;
 assert.equal(JSON.parse(captured.slots[0].effort.source_json).target,2,'Two legacy ratings alone do not meet the existing minimum three');
 assert.equal(JSON.parse(joinedCapture.slots[0].effort.source_json).target,3,'Actual registered native rating joins two imported hot openers under the existing rule');
 const members=proposed.performedHistoryMembers(reached);assert.equal(members.length,3);assert.equal(members.filter(row=>row.source==='performed').length,1);
 assert.throws(()=>proposed.typicalError(reached,'demo-press'),{code:'PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED'},'Count support grants no mixed noise adjacency');
 const rollback={...structuredClone(accepted[0]),op_id:'source-rollback',canonical_content_commitment:'synthetic-rollback',payload:{type:'source-rollback-intent',source_id:x.selections[0].source_id,target_activation_id:'source-1'}};
 accepted.push(rollback);const rolled=inventory();nodes.set(rollback.op_id,{selection:{intent_op_id:rollback.op_id,source_id:rollback.payload.source_id,seq:accepted.length,action:'rollback',commitment:rollback.canonical_content_commitment,target_activation_id:'source-1'},material});
 const after=await replay.projectLineage({...options,selectionId:rollback.op_id,generation:rolled,sourceBasis:sourceBasis(accepted.length,rollback.op_id)});
 assert.equal(after.ready,true,JSON.stringify(after.issues));assert.equal(Object.hasOwn(after.accepted_state.sessionLog,extraDay),false);
 assert.equal(after.workout_history.sessions[0].record.entries[0].slots[0].fact.current.load.value,25);assert.equal(after.workout_history.incomplete_sessions.length,1);
 assert.deepEqual(after.workout_history.sessions[0].capture,value.workout_history.sessions[0].capture);assert.equal(after.workout_history.source_members.filter(row=>row.op_id===edit.op_id).length,1);
 const afterCapture=memberAdapter.prepare({...captureInput,sourceProjection:after,source_basis:after.source_basis}).capture;
 assert.equal(JSON.parse(afterCapture.slots[0].effort.source_json).target,2,'Rollback removes only the later imported rating; original native capture remains unchanged');
 const missing=createReadingReplay(dependencies),unmapped=await missing.projectLineage({...options,selectionId:rollback.op_id,generation:rolled,sourceBasis:sourceBasis(accepted.length,rollback.op_id)});
 assert.equal(unmapped.ready,false);assert(unmapped.issues.some(issue=>issue.code==='ACCEPTED_ENGINE_CONTEXT_UNMAPPED'));
});
