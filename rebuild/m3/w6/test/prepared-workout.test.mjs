import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createDurablePublicClient} from '../public-client.mjs';
import {parseStrictJson} from '../strict-json.mjs';
import {fixture,initial,config,O,createT2Stage,faultDatabase,mutateActive,deferred} from './support.mjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import Schema from '../../../m4/workout/schema.cjs';
import Sign from '../../w5/crypto.cjs';
const capture=Capture.createPrescriptionCapture({parseStrictJson});
const identity={app_build:'synthetic-app',engine_build:'synthetic-engine',rule_profile:'synthetic-rule',source_schema:'synthetic-source'};
const unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
const cell=(display,source_json)=>({state:'specified',display,source_json});
function prescription(context){return {profile:capture.profile,producer:context.producer,basis:context.basis,
 session:{instruction:cell('Synthetic workout','"instruction"'),reason:unknown(),confidence:unknown()},
 slots:[40,45,40].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same-lineage',label:'Synthetic lift',
 load:cell(n+' lb',` {"value":${n}.00,"unit":"lb"} `),reps:cell('8–10','{"min":8,"max":10}'),
 effort:cell('At least 3','{"tag":"at_least","value":3,"unit":"rep"}'),setup:unknown(),reason:unknown(),confidence:unknown()}))};}
async function setup(options={}){
 const signingKey=Sign.generateSigningKey('synthetic-capture'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2,signature:undefined},signingKey);
 const f=await fixture(options.repository||{}),generation=initial();generation.metadata.authorityLease=lease;
 await f.repo.initialize(generation,'synthetic-enrollment-only');
 const commands=Commands.createWorkoutCommands({prescriptionCapture:capture});
 const stage=createT2Stage(()=>({...config(),...options.config}),{allowInbound:true,workoutCommands:commands});
 let produced=0,lastCapture;const scope={session:1,observation:1};
 const args={repository:options.wrapRepository?options.wrapRepository(f.repo):f.repo,stage:options.wrapStage?options.wrapStage(stage):stage,
 namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===scope.session,
 observationEpoch:()=>scope.observation,observationGuard:{run:async(_kind,fn)=>fn()}, // Synthetic, not K1/CLOCK qualification.
 validateCommit:options.validateCommit||(()=>null),keys:[Sign.publicKeyOf(signingKey)],schemaVersion:2,crypto:webcrypto,
 prescriptionCapture:capture,workoutProducerIdentity:identity,
 resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',causal_parents:[]}),
 workoutProducer:(_generation,context)=>{produced++;lastCapture=prescription(context);return lastCapture;},...options.client};
 const c=createDurablePublicClient(args);return {...f,c,args,scope,commands,produced:()=>produced,lastCapture:()=>lastCapture};
}
const prepare=f=>f.c.prepareWorkout({planned_split_slot_id:'synthetic-slot'});
const start=(f,p,extra={})=>f.c.startPreparedWorkout({preparedId:p.preparedId,...extra});
const operations=async f=>(await f.repo.load()).generation.collections.ops||{};
test('prepared actual Start stores the displayed original in one T2 batch and encrypted generation',async()=>{
 const f=await setup();try{
  const before=await f.repo.load(),p=await prepare(f);assert.equal(p.prepared,true);assert.deepEqual(await f.repo.load(),before);
  const original=structuredClone(p.view);p.view.slots[0].load.display='caller mutation';f.lastCapture().slots[0].load.display='producer later mutation';
  const r=await start(f,p);assert.equal(r.acknowledged,true,JSON.stringify(r));
  const saved=await f.repo.load(),op=saved.generation.collections.ops[r.op_id];
  assert.deepEqual(op.prescription_capture,original);assert.deepEqual(op.payload,{});assert.equal(op.schema_version,2);
  assert.equal(Object.keys(saved.generation.collections.ops).length,1);assert.equal(Object.keys(saved.generation.collections.outbox).length,1);
  assert.equal(saved.revision,before.revision+1);assert.equal(f.produced(),1);
  assert.equal(Schema.validateWorkoutShape(op).valid,false);assert.equal(Schema.validateWorkoutShape(op,{prescriptionCapture:capture}).valid,true);
  const fresh=await f.fresh();try{assert.deepEqual(await fresh.repository.load(),saved);}finally{fresh.repository.close();}
 }finally{f.repo.close();}
});
test('concurrent and repeated handle Start produce one effect and never re-run the producer',async()=>{
 const f=await setup();try{const p=await prepare(f),[a,b]=await Promise.all([start(f,p),start(f,p)]);
 assert.equal(a.acknowledged,true,JSON.stringify(a));assert.equal(b.acknowledged,true);assert.equal(a.op_id,b.op_id);
 assert.equal(Object.keys(await operations(f)).length,1);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('raw caller capture cannot bypass the private handle',async()=>{
 const f=await setup();try{const p=await prepare(f),before=await f.repo.load();
 const r=await f.c.execute('workout',{action:'start',input:{planned_split_slot_id:'synthetic-slot',plan_basis:p.view.basis.plan_basis,prescription_capture:p.view,causal_parents:[]}});
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('a selected captured writer without the preparation configuration still fails closed',async()=>{
 const f=await setup({client:{workoutProducer:undefined,workoutProducerIdentity:undefined,resolveWorkoutBasis:undefined,prescriptionCapture:undefined}});
 try{const before=await f.repo.load(),value=prescription({producer:identity,basis:{plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',source_revision:before.revision}});
 const r=await f.c.execute('workout',{action:'start',input:{planned_split_slot_id:'synthetic-slot',plan_basis:'NO_ACCEPTED_PLAN',prescription_capture:value,causal_parents:[]}});
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('another durable generation invalidates prepared Start without recapturing',async()=>{
 const f=await setup();try{const p=await prepare(f),s=await f.repo.load();await f.repo.commit(s,s.generation,()=>null);const before=await f.repo.load();
 const r=await start(f,p);assert.equal(r.acknowledged,false);assert.equal(r.state,3);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('same revision with a different authenticated token invalidates the earlier preparation',async()=>{
 const f=await setup();try{const p=await prepare(f),s=await f.repo.load(),iv=webcrypto.getRandomValues(new Uint8Array(12));
 const aad=new TextEncoder().encode(JSON.stringify(['earned/local-generation/v1',1,f.setup.namespace,s.revision]));
 const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},f.key,new TextEncoder().encode(JSON.stringify(s.generation)));
 await mutateActive(f.indexedDB,record=>({...record,iv,ciphertext}));const changed=await f.repo.load();assert.equal(changed.revision,s.revision);assert.notEqual(changed.token,s.token);
 const r=await start(f,p);assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');assert.deepEqual(await f.repo.load(),changed);
 }finally{f.repo.close();}
});
for(const [name,change,state]of[['session',f=>f.scope.session=2,17],['observation',f=>f.scope.observation=2,18]])test(`changed ${name} refuses before Start`,async()=>{
 const f=await setup();try{const p=await prepare(f),before=await f.repo.load();change(f);const r=await start(f,p);assert.equal(r.acknowledged,false);assert.equal(r.state,state);assert.deepEqual(await f.repo.load(),before);}finally{f.repo.close();}
});
test('late downstream validator retirement cannot pass the final transaction',async()=>{
 let f;f=await setup({validateCommit(){f.c.retireWorkoutPreparations();return null;}});try{const p=await prepare(f),before=await f.repo.load(),r=await start(f,p);
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('quota abort permits exact retry without recapture',async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB}});try{const p=await prepare(f),before=await f.repo.load();faults.state.armed=true;faults.state.mode='quota';
 const no=await start(f,p);assert.equal(no.acknowledged,false);assert.deepEqual(await f.repo.load(),before);faults.state.armed=false;
 const yes=await start(f,p);assert.equal(yes.acknowledged,true,JSON.stringify(yes));assert.equal(f.produced(),1);assert.equal(Object.keys(await operations(f)).length,1);
 }finally{f.repo.close();}
});
test('lost commit reply reconciles the actual stored Start, never another operation',async()=>{
 let lose=true;const f=await setup({wrapRepository:repo=>({...repo,async commit(...args){const result=await repo.commit(...args);if(lose){lose=false;throw new Error('synthetic lost reply');}return result;}})});
 try{const p=await prepare(f),lost=await start(f,p);assert.equal(lost.acknowledged,false);assert.equal(Object.keys(await operations(f)).length,1);
 assert.equal((await prepare(f)).code,'WORKOUT_START_OUTCOME_UNRESOLVED');const recovered=await start(f,p);
 assert.equal(recovered.acknowledged,true);assert.equal(recovered.recovered,true);assert.equal(Object.keys(await operations(f)).length,1);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('retirement after the final validator does not claim cancellation or Saved',async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB}});try{const p=await prepare(f);faults.state.armed=true;faults.state.mode='delay';
 const pending=start(f,p);await faults.state.write.promise;f.c.retireWorkoutPreparations();faults.state.release=true;const r=await pending;
 assert.equal(r.acknowledged,false);assert.equal(r.committed,true);assert.equal(r.code,'WORKOUT_PREPARATION_RETIRED');assert.equal(Object.keys(await operations(f)).length,1);
 }finally{faults.state.release=true;f.repo.close();}
});
test('hostile getters never run and caller request changes cannot change queued preparation',async()=>{
 const f=await setup();try{let hits=0;const bad=Object.defineProperty({},'planned_split_slot_id',{enumerable:true,get(){hits++;return 'bad';}});
 assert.equal((await f.c.prepareWorkout(bad)).state,3);assert.equal(hits,0);
 const request={planned_split_slot_id:'original'},pending=f.c.prepareWorkout(request);request.planned_split_slot_id='changed';const p=await pending;
 const r=await start(f,p);assert.equal(r.acknowledged,true);assert.equal((await operations(f))[r.op_id].planned_split_slot_id,'original');
 }finally{f.repo.close();}
});
test('another client instance cannot use an old local handle',async()=>{
 const f=await setup();try{const p=await prepare(f),other=createDurablePublicClient(f.args);const r=await other.startPreparedWorkout({preparedId:p.preparedId});
 assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.equal(Object.keys(await operations(f)).length,0);
 }finally{f.repo.close();}
});
test('retirement during asynchronous preparation cannot create a surviving handle',async()=>{
 const entered=deferred(),release=deferred();let hold=false;
 const f=await setup({wrapRepository:repo=>({...repo,async load(){const s=await repo.load();if(hold){entered.resolve();await release.promise;}return s;}})});
 try{hold=true;const pending=prepare(f);await entered.promise;f.c.retireWorkoutPreparations();release.resolve();const r=await pending;
 assert.equal(r.prepared,undefined);assert.equal(r.code,'WORKOUT_PREPARATION_RETIRED');assert.equal(Object.keys(await operations(f)).length,0);
 }finally{release.resolve();f.repo.close();}
});
test('definitely refused retirement does not leave a fabricated uncertain write',async()=>{
 let retire=true,f;f=await setup({validateCommit(){if(retire)f.c.retireWorkoutPreparations();return null;}});
 try{const p=await prepare(f),no=await start(f,p);assert.equal(no.acknowledged,false);retire=false;
 const next=await prepare(f);assert.equal(next.prepared,true,JSON.stringify(next));assert.equal((await start(f,next)).acknowledged,true);
 }finally{f.repo.close();}
});
test('competing write before commit cannot silently recapture on a CAS retry',async()=>{
 // Inject the competing write at the actual repository commit boundary.
 let raced=false;const g=await setup({wrapRepository:repo=>({...repo,async commit(...args){if(!raced){raced=true;const current=await repo.load();await repo.commit(current,current.generation,()=>null);}return repo.commit(...args);}})});
 try{const p=await prepare(g),r=await start(g,p);assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');assert.equal(g.produced(),1);assert.equal(Object.keys(await operations(g)).length,0);}finally{g.repo.close();}
});
