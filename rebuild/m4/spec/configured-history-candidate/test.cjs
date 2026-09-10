'use strict';
// Actual retained storage/client/capture/history composition; synthetic local
// enrollment only, no real issuer/server recovery or next-prescription claim.
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{webcrypto}=require('node:crypto');
const root=process.env.EARNED_CONFIGURED_HISTORY;assert(root,'Explicit candidate composition required');
const mod=f=>require(path.join(root,f)),load=f=>import(pathToFileURL(path.join(root,f)));
const Adapter=mod('rebuild/m4/workout/engine-capture.cjs'),History=mod('rebuild/m4/workout/engine-history.cjs'),Old=mod('rebuild/m4/workout/engine-history-original.cjs');
const legacyReader=require('../performed-proposal/factory.cjs')();
const configuration=key=>({kind:'configuration',configuration_key:key}),pounds=value=>({value,unit:'lb'});
async function fixture({profile=Adapter.CONFIGURATION_PROFILE,targets=[configuration(' BW '),pounds(0),null],values=[configuration('BW+band'),pounds(20),configuration('hold')]}={}){
 const [{fixture,initial,config,O,createT2Stage},{createDurablePublicClient},{parseStrictJson},{projectWorkoutRecords}]=await Promise.all([
  load('rebuild/m3/w6/test/support.mjs'),load('rebuild/m3/w6/public-client.mjs'),load('rebuild/m3/w6/strict-json.mjs'),load('rebuild/m4/workout/project-history.mjs')]);
 const Sign=mod('rebuild/m3/w5/crypto.cjs'),Capture=mod('rebuild/m4/workout/capture.cjs'),Commands=mod('rebuild/m4/workout/commands.cjs');
 const key=Sign.generateSigningKey('synthetic-configured-history'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},key),capture=Capture.createPrescriptionCapture({parseStrictJson});
 const f=await fixture(),generation=initial();generation.metadata.authorityLease=lease;await f.repo.initialize(generation,'synthetic-enrollment-only');
 const producer={app_build:'synthetic-configured-history',engine_build:'unchanged-capture-reader',rule_profile:profile,source_schema:'2'};
 const unexpected=()=>{throw Error('No generation or live plan is used to reconstruct original layout');};
 const adapter=Adapter.createEngineWorkoutCapture({engine:{genSession:unexpected,rirPlan:unexpected},prescriptionCapture:capture,producerIdentity:producer});
 const unknown=()=>({state:'unknown',display:'Unknown',source_json:null}),cell=value=>value===null?{state:'not_prescribed',display:'Find a working load',source_json:null}:
  {state:'specified',display:value.kind==='configuration'?value.configuration_key:value.value+' lb',source_json:JSON.stringify(value)};
 const slots=targets.map((target,i)=>({logical_set_slot:JSON.stringify(['synthetic-lift',i+1]),lift_lineage_id:'synthetic-lift',label:'Synthetic exercise',load:cell(target),
  reps:{state:'specified',display:'8 reps',source_json:JSON.stringify({value:8,unit:'rep'})},effort:{state:'specified',display:'2 reps left',source_json:JSON.stringify({target:2,unit:'rep'})},setup:unknown(),reason:unknown(),confidence:unknown()}));
 const args={repository:f.repo,stage:createT2Stage(config,{allowInbound:true,workoutCommands:Commands.createWorkoutCommands({prescriptionCapture:capture})}),namespace:f.setup.namespace,
  athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,observationGuard:{run:async(_k,fn)=>fn()},validateCommit:()=>null,
  keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,prescriptionCapture:capture,workoutProducerIdentity:producer,
  resolveWorkoutBasis:()=>({plan_basis:'synthetic-original-plan',input_basis:'synthetic-original-input',causal_parents:[]}),
  workoutProducer:(_g,context)=>({profile:capture.profile,producer:context.producer,basis:context.basis,session:{instruction:unknown(),reason:unknown(),confidence:unknown()},slots:structuredClone(slots)})};
 let client=createDurablePublicClient(args);const prepared=await client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert(prepared.prepared,prepared.code);
 const start=await client.startPreparedWorkout({preparedId:prepared.preparedId});assert(start.acknowledged,start.code);const ids=[];
 const record=async i=>{const r=await client.execute('workout',{action:'set',input:{session_start_op_id:start.op_id,logical_set_slot:slots[i].logical_set_slot,lift_lineage_id:'synthetic-lift',load:values[i],reps:{value:8-i,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}}});assert(r.acknowledged,r.code);ids.push(r.op_id);};
 await record(0);
 // Close actual repository connection and reconstruct a new client over its
 // same encrypted generation before recording the remaining sets.
 f.repo.close();const reopened=await f.fresh();client=createDurablePublicClient({...args,repository:reopened.repository});
 const resumed=await client.readWorkoutHistory();assert(resumed.read,resumed.code);assert.deepEqual(resumed.history.sessions[0].projection.facts[0].current.load,values[0]);
 await record(1);await record(2);
 const close=await client.execute('workout',{action:'close',input:{session_start_op_id:start.op_id,completion_kind:'normal',causal_parents:[start.op_id,...ids]}});assert(close.acknowledged,close.code);
 const dependencies={athleteId:'ath-1',deviceId:'dev-A',projectWorkoutRecords,parseStrictJson,resolveCapturedLayout:({start})=>adapter.readLayout(start.prescription_capture)};
 async function source(){const fresh=await f.fresh();try{const c=createDurablePublicClient({...args,repository:fresh.repository}),read=await c.readWorkoutHistory();assert(read.read,read.code);const snapshot=await fresh.repository.load();assert.equal(snapshot.revision,read.source_revision);return {history:read.history,generation:snapshot.generation,sourceRevision:read.source_revision};}finally{fresh.repository.close();}}
 async function map(factory=History,override={}){const s=await source(),before=JSON.stringify(s);const out=factory.createEngineHistoryProjector({...dependencies,...override}).project(s.history,s.generation,{sourceRevision:s.sourceRevision});assert.equal(JSON.stringify(s),before,'Owned projection does not change storage/capture');return out;}
 return {client,args,ids,start,source,map,dependencies,close:()=>reopened.repository.close()};
}
test('actual encrypted reopen preserves three typed targets and independently entered performed loads',async t=>{
 const f=await fixture();t.after(f.close);const view=await f.map(),session=view.sessions[0],entry=session.record.entries[0];
 assert.equal(entry.profile,'earned/performed-lift/v2');assert.equal(view.progression_eligible,false);assert.equal(session.completion_state,'completed');
 assert.deepEqual(entry.slots.map(s=>s.prescribed_load),[{state:'specified',source:configuration(' BW ')},{state:'specified',source:pounds(0)},{state:'not_prescribed'}]);
 assert.deepEqual(entry.slots.map(s=>s.fact.current.load),[configuration('BW+band'),pounds(20),configuration('hold')]);
 assert.deepEqual(entry.slots.map(s=>s.fact.source_op_id),f.ids);assert(entry.slots.every(s=>s.fact.current_status==='stored-on-this-device'));
 assert.throws(()=>legacyReader.performedEntry(entry),{code:'PERFORMED_ENTRY_INVALID'},'Old numeric reader explicitly refuses v2');
});
test('actual prepared corrections change the whole performed union without rewriting original load or capture',async t=>{
 const f=await fixture();t.after(f.close);const original=await f.map(),originalCapture=original.sessions[0].capture;
 for(const value of [pounds(35),configuration('cafe\u0301:α🟦 ')] ){
  const p=await f.client.prepareWorkoutEdit({target_op_id:f.ids[0]});assert(p.prepared,p.code);
  const r=await f.client.commitWorkoutEdit({editId:p.editId,action:'correct',change:{load:value}});assert(r.acknowledged,r.code);
  const view=await f.map(),slot=view.sessions[0].record.entries[0].slots[0];
  assert.deepEqual(slot.fact.current.load,value);assert.deepEqual(slot.fact.original.load,configuration('BW+band'));
  assert.deepEqual(slot.prescribed_load,{state:'specified',source:configuration(' BW ')});assert.deepEqual(view.sessions[0].capture,originalCapture);
  assert.deepEqual(slot.fact.current.reps,{value:8,unit:'rep'});assert.deepEqual(slot.fact.current.reserve,{tag:'at_least',value:3,unit:'rep'});assert(slot.fact.edit_op_ids.includes(r.op_id));
 }
});
test('missing, wrong and cross-slot targets refuse at actual projector correspondence boundary',async t=>{
 const f=await fixture();t.after(f.close);
 for(const mutate of [x=>delete x.slots[0].prescribed_load,x=>x.slots[0].prescribed_load={state:'specified',source:pounds(10)},x=>x.slots[0].prescribed_load=structuredClone(x.slots[1].prescribed_load)]){
  await assert.rejects(f.map(History,{resolveCapturedLayout:args=>{const layout=f.dependencies.resolveCapturedLayout(args);mutate(layout);return layout;}}),{code:'WORKOUT_CAPTURE_LOAD_DISAGREEMENT'});
 }
 await assert.rejects(f.map(Old),{code:'WORKOUT_CAPTURE_LAYOUT_UNPROVEN'},'Original implementation refuses the new layout');
});
test('existing v1 numeric output stays byte-identical and configured values cannot masquerade as v1',async t=>{
 const f=await fixture({profile:Adapter.PROFILE,targets:[pounds(30),pounds(25),pounds(20)],values:[pounds(30),pounds(25),pounds(20)]});t.after(f.close);
 assert.equal(JSON.stringify(await f.map()),JSON.stringify(await f.map(Old)));
 const p=await f.client.prepareWorkoutEdit({target_op_id:f.ids[0]});assert(p.prepared,p.code);const r=await f.client.commitWorkoutEdit({editId:p.editId,action:'correct',change:{load:configuration('BW')}});assert(r.acknowledged,r.code);
 await assert.rejects(f.map(),{code:'WORKOUT_CONFIGURED_LOAD_LAYOUT_REQUIRED'});
});
test('unchanged status and capture-source guards still reject detached history and false layout identities',async t=>{
 const f=await fixture();t.after(f.close);const s=await f.source();s.history.sessions[0].records[0].status='accepted-through-frontier';
 assert.throws(()=>History.createEngineHistoryProjector(f.dependencies).project(s.history,s.generation,{sourceRevision:s.sourceRevision}),{code:'WORKOUT_ENGINE_STATUS_DISAGREEMENT'});
 await assert.rejects(f.map(History,{resolveCapturedLayout:args=>{const layout=f.dependencies.resolveCapturedLayout(args);layout.slots[0].logical_set_slot='foreign-slot';return layout;}}),{code:'WORKOUT_CAPTURE_LAYOUT_UNPROVEN'});
});
