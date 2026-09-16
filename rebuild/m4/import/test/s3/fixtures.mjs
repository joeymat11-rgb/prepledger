// TEST ONLY. Invented facts, never a C2 file, private reference or production registry.
// SYNTHETIC reviewed native-Date evidence for every invented execution calendar
// in this harness. Each raw input is retained exactly as recorded and bound to
// the exact epoch the native implementation produces, malformed input to NaN,
// and each epoch to its exact native ISO string or to the invalid outcome.
export function nativeDateEvidence(){
 return {profile:'earned/native-date-capability/v1',
  parse_vectors:[{input:'2026-03-15T12:00:00.000Z',epoch:1773576000000},{input:'2026-03-08T07:00:00.000Z',epoch:1772953200000},
   {input:'2026-09-03T12:00:00.000Z',epoch:1788436800000},{input:'TEST-ONLY not a timestamp',epoch:null}],
  constructor_vectors:[{epoch:1772953200001,iso:'2026-03-08T07:00:00.001Z'},{epoch:1788436800001,iso:'2026-09-03T12:00:00.001Z'},
   {epoch:8640000000000001,iso:null}]};
}
import F from '../../../../m3/w7-preview/fixtures.cjs';
import Journey from '../../../../m3/w6/host/test/journey-fixture.cjs';
import SyntheticEngine from './engine.cjs';
import {openRepository} from '../../../../m3/w6/repository.mjs';
import {openLocalKeys} from '../../../../m3/w6/local/local-keys.mjs';
import {createLocalEra,readLocalEra} from '../../../../m3/w6/local/local-era.mjs';
import {createLocalSourceController} from '../../../../m3/w6/local/source-admission.mjs';
import {createSourcePlatform} from '../../../../m3/w6/local/source-platform.mjs';
import {createBrowserReplay} from '../../browser-replay.mjs';
import Profile from '../../local-source-profile.cjs';
import Ops from '../../../../client/ops.cjs';
import Setup from '../../../../m3/w7-preview/today/setup-commands.mjs';
import {createCleanInitState} from '../../../../m3/w7-preview/today/setup-model.mjs';
import Food from '../../../../m3/w7-preview/today/food-commands.cjs';
import CheckIn from '../../../../m3/w7-preview/today/checkin-commands.cjs';
import Settings from '../../../../coach/machine-settings-commands.cjs';
import {parseStrictJson} from '../../../../m3/w6/strict-json.mjs';
import Capture from '../../../workout/capture.cjs';
import EngineCapture from '../../../workout/engine-capture.cjs';
import Commands from '../../../workout/commands.cjs';
import Runtime from '../../../workout/engine-runtime.cjs';
import Provider from '../../engine-provider.cjs';
import {createReadingProjector} from '../../../../m3/w6/reading-history.mjs';

export const SYNTHETIC_PROVENANCE = 'earned/s3-public-invented-fixture/v1';
export const syntheticDay = F.SYNTHETIC_DAY;
export const fixtureSetup = () => structuredClone(Journey.SETUP);
export const fixtureState = (day = syntheticDay) => F.createSyntheticState(day);
export const fixtureBytes = state => new TextEncoder().encode(JSON.stringify(state, null, 2) + '\r\n');
export function fixtureClock(day = syntheticDay, hour = 12) {
  const [year, month, date] = day.split('-').map(Number);
  const now = new Date(year, month - 1, date, hour, 0, 0, 0);
  return Object.freeze({today: () => day, hour: () => hour, dow: () => now.getDay(),
    nowISO: () => now.toISOString(), nowMs: () => now.getTime(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone});
}

// One serialized public input vector is handed unchanged to Node and the real
// browser. The registry is explicitly synthetic; all seven engine members are
// the production provider's real composed factories, never a fixture facade.
export function createPortableVector(){
 const source=fixtureState('2026-09-03');source.parity={composed:'é',decomposed:'e\u0301',nested:{kept:['source',0,false,null]}};
 const local=structuredClone(source);local.v=59;local.parity.local='retained original';
 const ops={},dispositions={},receipts={},add=(action)=>{
  const seq=Object.keys(ops).length+1,op=Ops.build({...action,op_id:'S3-parity-'+seq,athlete_id:'TEST-ONLY-athlete',device_id:'TEST-ONLY-remote',device_seq:seq,parents:seq>1?['S3-parity-'+(seq-1)]:[],lease_id:'TEST-ONLY-lease',schema_version:1},'TEST-ONLY-parity-key');
  ops[op.op_id]=op;dispositions[op.op_id]={op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,status:'ACCEPTED',athlete_log_seq:seq};receipts[seq]={seq,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment};return op;
 };
 add({class:'reading',kind:'fact',payload:{lb:{value:173.25,unit:'lb'}},effective:fixtureEffective('2026-09-04',12)});
 add({class:'reading',kind:'fact',payload:{lb:{value:173,unit:'lb'}},effective:fixtureEffective('2026-09-05',8)});
 // This existing portable hosted reader takes its own v1 quantity schema.
 // The separate custody/browser cells still exercise real native N1 commands.
 add({class:'food-day',kind:'fact',payload:{kcal:{value:2300,unit:'kcal'},protein_g:{value:175,unit:'g'}},effective:fixtureEffective('2026-09-05',10)});
 return {profile:'earned/s3-real-provider-parity-input/v1',source_json:new TextDecoder().decode(fixtureBytes(source)),local_json:new TextDecoder().decode(fixtureBytes(local)),
  generation:{collections:{ops,dispositions,receipts,outbox:{},rejected:{},sync:{frontier:{W:3,authorityW:3}}},metadata:{}},asOf:'2026-09-06'};
}
export function portableReplayEvidence(vector,constructors=createBrowserReplay()){
 const input=structuredClone(vector),before=JSON.stringify(input),platform=createSourcePlatform(),day='2026-09-03',build='S3-real-production-provider-TEST-ONLY';
 const engine={sha256:Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],treeSha256:'b'.repeat(64),schemaV:60,path:'rebuild/engine/oracle-shim.cjs'};
 const gate={clock:day,tz:'America/New_York'},materialDigest=platform.hash(JSON.stringify(input));
 const dates=['2026-03-07','2026-03-09',day,'2026-09-06'].map(date=>{const d=new Date(fixtureClock(date).nowMs());return {day:date,noonISO:d.toISOString(),offsetMinutes:d.getTimezoneOffset()};});
 const mapping={profile:'earned/source-producer-mapping/v1',id:'TEST-ONLY-portable-identical-input',construction:'oracle-shim-default/v1',engine,gate,public_factory_digest:Profile.PUBLIC_FACTORY_DIGEST,source_pins:Profile.SOURCE_PINS,
  executions:[{id:'TEST-ONLY-vector-not-C2',material_digest:materialDigest,calendar:{profile:'earned/native-date-compatibility/v1',compatibility_id:'TEST-ONLY-2026',zone:gate.tz,range:{from:'2026-01-01',to:'2026-12-31'},dates,native_date:nativeDateEvidence()}}],dependencies:{drafts:'default-empty'}};
 const context=Profile.createProducerRegistry([mapping],{hash:platform.hash}).qualify({materialDigest,context:{engine,oracle:{gate}}});
 const engineFor=({day,hour})=>Provider.createSourceReplayEngine({engineContext:Profile.engineContextAt(context,day,hour)});
 const real=engineFor({day,hour:12}),prep=constructors.createImportPreparation({engine:real,parseStrictJson});
 const source=platform.bytes(input.source_json),local=platform.bytes(input.local_json),prepared=prep.prepare(source,{localBytes:local});
 const preparation={summary:structuredClone(prepared.summary),source_bytes:Array.from(prepared.sourceBytes()),local_bytes:Array.from(prepared.localBytes()),candidate_bytes:Array.from(prepared.candidateBytes()),source_state:prepared.sourceState(),local_state:prepared.localState(),candidate_state:prepared.candidateState()};
 const same=(a,b)=>platform.equal(a,b),aliases={};
 for(const key of ['source','local','candidate']){
  const state=prepared[key+'State'](),bytes=prepared[key+'Bytes']();state.parity.nested.kept[0]='caller mutation';bytes[0]=0;
  aliases[key]=same(prepared[key+'State'](),preparation[key+'_state'])&&same(Array.from(prepared[key+'Bytes']()),preparation[key+'_bytes']);
 }
 source[0]=0;local[0]=0;aliases.input_bytes=same(Array.from(prepared.sourceBytes()),preparation.source_bytes)&&same(Array.from(prepared.localBytes()),preparation.local_bytes);
 const candidate=prepared.candidateState(),lost=structuredClone(candidate);lost.reads.pop();
 const guards={source:real.dataLossGuard(prepared.sourceState(),candidate),local:real.dataLossGuard(prepared.localState(),candidate),removed_read:real.dataLossGuard(candidate,lost)};
 const empty={collections:{ops:{},dispositions:{},receipts:{},outbox:{},rejected:{},sync:{frontier:{W:0,authorityW:0}}},metadata:{}};
 const material={source_json:input.source_json,local_json:input.local_json,candidate_json:platform.text(prepared.candidateBytes()),checkpoint_json:JSON.stringify({revision:1,token:'TEST-ONLY-parity',generation:empty}),engine_context_json:JSON.stringify({build,clock:day})};
 const replay=constructors.createReadingReplay({engineFor,projectReadings:createReadingProjector({athleteId:'TEST-ONLY-athlete',deviceId:'TEST-ONLY-local'}),parseStrictJson,producerIdentity:build,importBuild:build,deviceId:'TEST-ONLY-local'});
 const replayInput={sourceId:'TEST-ONLY-portable-source',material,generation:input.generation,asOf:input.asOf};
 const result=replay.project(replayInput),reproduced=replay.reproduce(replayInput,result);
 if(!result.ready)throw Error('S3_PUBLIC_PARITY_REPLAY '+JSON.stringify(result.issues));
 const detached=structuredClone(result);detached.accepted_state.reads[0].w=999;detached.coverage.steps.length=0;
 result.accepted_state.parity.nested.kept[0]='caller mutation';result.accepted_state.reads[0].w=999;
 aliases.replay=same(replay.project(replayInput),reproduced);
 const refusals={},refuse=(name,fn)=>{try{fn();refusals[name]=null;}catch(e){refusals[name]=e.code||e.name;}};
 refuse('future',()=>prep.prepare(platform.bytes(JSON.stringify({...prepared.sourceState(),v:61}))));
 refuse('seed',()=>prep.prepare(platform.bytes('{"v":2}')));
 refuse('duplicate',()=>prep.prepare(platform.bytes('{"v":60,"v":60}')));
 refuse('changed_replay',()=>replay.reproduce(replayInput,detached));
 const wrong=structuredClone(replayInput);wrong.material.candidate_json=JSON.stringify({...candidate,trend:999});
 refuse('changed_candidate',()=>replay.project(wrong));
 aliases.vector=before===JSON.stringify(input)&&before===JSON.stringify(vector);
 // The entire semantic replay is compared. Only the documented host runtime
 // metadata field differs between adapters; it is retained separately, checked
 // and recorded, never mistaken for semantic output or silently discarded.
 const runtime=structuredClone(reproduced.coverage.runtime);delete reproduced.coverage.runtime;
 return {profile:'earned/s3-real-provider-parity/v1',input_sha256:materialDigest,provider_members:Object.keys(real).sort(),preparation,guards,aliases,refusals,replay:reproduced,runtime};
}
export async function prepareFixture({engine, parseStrictJson, prepare, day = syntheticDay, local = null}) {
  const sourceBytes = fixtureBytes(fixtureState(day));
  const localBytes = local === null ? null : fixtureBytes(local);
  const result = prepare({engine, parseStrictJson}).prepare(sourceBytes, localBytes ? {localBytes} : {});
  return {provenance: SYNTHETIC_PROVENANCE, sourceBytes, localBytes, candidateBytes: result.candidateBytes()};
}

export function fixtureEffective(day='2026-09-04',hour=8){
  const date=new Date(fixtureClock(day,hour).nowMs()),minutes=date.getTimezoneOffset(),abs=Math.abs(minutes);
  return {local_date:day,local_time:String(hour).padStart(2,'0')+':00',utc_offset:(minutes<=0?'+':'-')+String(Math.floor(abs/60)).padStart(2,'0')+':'+String(abs%60).padStart(2,'0')};
}
export async function appendCompletedWorkout(f,{day='2026-09-04',complete=true,skipSlot=null}={}){
  const loaded=await f.repository.load(),g=structuredClone(loaded.generation),era=readLocalEra(g.metadata),platform=f.platform;
  const pc=Capture.createPrescriptionCapture({parseStrictJson}),runtime=Runtime.createEngineRuntime({clock:fixtureClock(day)});
  const producer={app_build:'S3-TEST-ONLY',engine_build:'S3-public-runtime-synthetic',rule_profile:EngineCapture.PROFILE,source_schema:'S3-invented-state/v1'};
  const basis={plan_basis:'S3-synthetic-plan',input_basis:platform.hash(JSON.stringify({state:f.state,ops:g.collections.ops})),source_revision:loaded.revision};
  const prepared=EngineCapture.createEngineWorkoutCapture({engine:runtime,prescriptionCapture:pc,producerIdentity:producer}).prepare({state:f.state,day,basis});
  const capture=prepared.capture,commands=Commands.createWorkoutCommands({prescriptionCapture:pc}),operationIds=[];
  const add=(action,input)=>{const rows=Object.values(g.collections.ops).sort((a,b)=>a.device_seq-b.device_seq),previous=rows.at(-1)?.op_id??null,nextSeq=rows.length+1;
    const prepared=commands.prepare({action,input:{...input,effective:fixtureEffective(day,10),causal_parents:previous?[previous]:[]}});
    const op=Ops.build({...prepared,op_id:'S3-w-'+nextSeq,athlete_id:f.athleteId,device_id:f.deviceId,device_seq:nextSeq,predecessor:previous,lease_id:era.lease.lease_id,schema_version:2},era.identityKey);
    if(!commands.validate(op,id=>g.collections.ops[id]))throw Error('S3_SYNTHETIC_WORKOUT_INVALID');
    g.collections.ops[op.op_id]=op;g.collections.outbox[op.op_id]={op_id:op.op_id};operationIds.push(op.op_id);return op;
  };
  const start=add('start',{planned_split_slot_id:'S3-synthetic-Friday',plan_basis:basis.plan_basis,prescription_capture:capture});
  for(const slot of prepared.layout.slots){
    if(slot.logical_set_slot===skipSlot)add('skip',{session_start_op_id:start.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,skip_scope:'set'});
    else add('set',{session_start_op_id:start.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,load:{value:f.state.exercises.find(e=>e.id===slot.lift_lineage_id).steps[0],unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'exact',value:2,unit:'rep'}});
  }
  if(complete)add('close',{session_start_op_id:start.op_id,completion_kind:'normal'});
  await f.repository.commit(loaded,g,()=>null);return {startId:start.op_id,capture,operationIds};
}
// Real custody and real producers with invented inputs. The mapping is TEST ONLY:
// it proves algorithm composition, never provenance of an owner's C2 execution.
export async function createLocalSourceFixture({indexedDB,crypto,databaseName='s3-synthetic',reopen=false,source:sourceInput,withFacts=true,repositoryWrap=x=>x}={}){
  const namespace='TEST-ONLY-s3/athlete/device',athleteId='TEST-ONLY-athlete',deviceId='TEST-ONLY-device',name='TEST-ONLY-source',day='2026-09-04';
  const setup=fixtureSetup(),base=fixtureState('2026-09-03'),state=structuredClone(createCleanInitState({setup}));
  for(const field of ['model','trend','reads','dailyLogs','sleep'])state[field]=structuredClone(base[field]);
  state.sessionLog={};state.decisions=[{id:'TEST-ONLY-historical-note',text:'Invented historical decision, no new consent'}];
  const source=sourceInput?structuredClone(sourceInput):state;
  const platform=createSourcePlatform(),engine=SyntheticEngine.createEngine({clock:fixtureClock('2026-09-03')}),core=createBrowserReplay({platform});
  const sourceBytes=fixtureBytes(source),prepared=core.createImportPreparation({engine,parseStrictJson}).prepare(sourceBytes),candidateBytes=prepared.candidateBytes();
  const producerEngine={sha256:Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],treeSha256:'b'.repeat(64),schemaV:60,path:'rebuild/engine/oracle-shim.cjs'};
  const gate={clock:'2026-09-03',tz:'America/New_York',command:'TEST-ONLY public synthetic composition',cwd:'TEST-ONLY',scope:'synthetic',laws:0,modes:[],manifestPin:null,foundIn:'TEST-ONLY no C2 execution'};
  const engineContextJson=JSON.stringify({profile:'earned/local-import/v1',engine:producerEngine,oracle:{gate}});
  const raw={source_json:platform.text(sourceBytes),candidate_json:platform.text(candidateBytes),local_json:null,engine_context_json:engineContextJson};
  const materialDigest=Profile.digest(platform.hash,'earned/local-source-material/v1',raw);
  const dates=['2026-01-15','2026-03-07','2026-03-09','2026-09-03','2026-09-04','2026-09-05','2026-11-02'].map(day=>{const d=new Date(fixtureClock(day).nowMs());return {day,noonISO:d.toISOString(),offsetMinutes:d.getTimezoneOffset()};});
  const mapping={profile:'earned/source-producer-mapping/v1',construction:'oracle-shim-default/v1',id:'TEST-ONLY-synthetic-mapping',engine:producerEngine,gate:{clock:gate.clock,tz:gate.tz},public_factory_digest:Profile.PUBLIC_FACTORY_DIGEST,source_pins:Profile.SOURCE_PINS,executions:[{id:'TEST-ONLY-invented-public-run',material_digest:materialDigest,calendar:{profile:'earned/native-date-compatibility/v1',compatibility_id:'TEST-ONLY-host-calendar',zone:gate.tz,range:{from:'2026-01-01',to:'2026-12-31'},dates,native_date:nativeDateEvidence()}}],dependencies:{drafts:'default-empty'}};
  const registry=Profile.createProducerRegistry([mapping],{hash:platform.hash});
  const keys=await openLocalKeys({indexedDB,crypto,databaseName});
  if(!reopen)await keys.generate();
  const repository=await openRepository({indexedDB,crypto,databaseName,namespace,keyProvider:keys.keyProvider,authorizeEnrollment:e=>e===SYNTHETIC_PROVENANCE});
  const effective=fixtureEffective(day),tags=Object.fromEntries(setup.exercises.map(e=>[e.id,{head:null,secondary:[]}])) ;
  if(!reopen){
    const era=createLocalEra({crypto,athleteId,deviceId,enrolledAt:'2026-09-03T00:00:00.000Z'}),ops={};
    const add=(id,action,schema_version=2)=>{const prior=Object.values(ops).at(-1);const op=Ops.build({...action,op_id:id,athlete_id:athleteId,device_id:deviceId,device_seq:Object.keys(ops).length+1,predecessor:prior?.op_id??null,parents:[...new Set([...(action.parents||[]),...(prior?[prior.op_id]:[])])],lease_id:era.lease.lease_id,schema_version,effective:action.effective||effective},era.identityKey);ops[id]=op;return op;};
    add('TEST-ONLY-setup',Setup.prepare({action:Setup.ACTION,input:{setup,tags,effective:fixtureEffective('2026-09-03')}}));
    if(withFacts){
      add('TEST-ONLY-reading',{class:'reading',kind:'fact',payload:{lb:{value:173.25,unit:'lb'}},effective},1);
      add('TEST-ONLY-food',Food.prepare({action:Food.ACTION,input:{day:{cal:2300,pro:175},effective}}));
      add('TEST-ONLY-machine',Settings.prepare({action:Settings.ACTION,input:{machine:{exercise_id:setup.exercises[0].id,settings:[{name:'Seat',value:'four'}]},effective}}));
      add('TEST-ONLY-checkin',CheckIn.prepare({action:'checkin',input:{answers:{energy:'Moderate',note:'Invented retained answer'},effective}}));
    }
    await repository.initialize({collections:{ops,outbox:Object.fromEntries(Object.keys(ops).map(id=>[id,{op_id:id}])),dispositions:{},rejected:{},receipts:{},sync:{frontier:{W:0,authorityW:0}},derived:{}},metadata:{namespace,localEra:era,imports:[]}},SYNTHETIC_PROVENANCE);
    await keys.persist(await keys.keyProvider());
    const loaded=await repository.load(),custody=repository.importCustody({parseStrictJson,validateContext:()=>null});
    await custody.stage(name,loaded,{sourceBytes,candidateBytes,localBytes:null,engineContextJson});
    const next=structuredClone(loaded.generation);next.metadata.imports.push({name,sourceSha256:platform.hash(sourceBytes),migratedSha256:platform.hash(candidateBytes),localSha256:null,engineSha256:producerEngine.sha256,schemaV:60,rebaseRequired:true,createdAt:'2026-09-04T12:00:00.000Z'});
    await repository.commit(loaded,next,()=>null);
  }
  let semanticEpoch=0,alive=true,asOf=day;
  const controller=createLocalSourceController({repository:repositoryWrap(repository),namespace,athleteId,deviceId,producerRegistry:registry,asOf:()=>asOf,getSemanticEpoch:()=>semanticEpoch,isAlive:()=>alive,platform});
  const ops=(await repository.load()).generation.collections.ops;
  return {provenance:SYNTHETIC_PROVENANCE,repository,controller,name,setup,state:source,sourceBytes,candidateBytes,engineContextJson,registry,mapping,platform,ops,keys,keyProvider:keys.keyProvider,indexedDB,crypto,databaseName,namespace,athleteId,deviceId,
    review:()=>controller.reviewSource(name),setEpoch(){semanticEpoch++;},setAlive(value){alive=value;},setAsOf(value){asOf=value;},
    async append(id,action,schema_version=2){const loaded=await repository.load(),next=structuredClone(loaded.generation),era=readLocalEra(next.metadata),rows=Object.values(next.collections.ops).sort((a,b)=>a.device_seq-b.device_seq),prior=rows.at(-1);const op=Ops.build({...action,op_id:id,athlete_id:athleteId,device_id:deviceId,device_seq:rows.length+1,predecessor:prior?.op_id??null,parents:[...new Set([...(action.parents||[]),...(prior?[prior.op_id]:[])])],lease_id:era.lease.lease_id,schema_version,effective:action.effective||effective},era.identityKey);next.collections.ops[id]=op;next.collections.outbox[id]={op_id:id};await repository.commit(loaded,next,()=>null);return op;},
    async mutate(change){const loaded=await repository.load(),next=structuredClone(loaded.generation);await change(next);return repository.commit(loaded,next,()=>null);},
    close(){controller.close();repository.close();keys.close();}};
}
