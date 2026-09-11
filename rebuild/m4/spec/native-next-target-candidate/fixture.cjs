'use strict';
// TEST-ONLY joined fixture for the native-next-targets candidate. Real
// encrypted repository, real T2 stage, real public client, real capture
// validator, real typed projector and the candidate prescription runtime.
// Synthetic athlete inputs only; the trend-context resolver is a declared test
// assumption, never a qualified physiological/source provider. Accepted
// positions built here for the replay path are synthetic receipts (disclosed),
// not issuer-signed inventory.
const path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url'),{webcrypto}=require('node:crypto');
const ROOT=path.resolve(__dirname,'../../../..');
const mod=f=>require(path.join(ROOT,f)),load=f=>import(pathToFileURL(path.join(ROOT,f)));
const F=mod('rebuild/m3/w7-preview/fixtures.cjs'),Adapter=mod('rebuild/m4/workout/engine-capture.cjs'),History=mod('rebuild/m4/workout/engine-history.cjs');
const {createEngineRuntime,COMPOSITION}=mod('rebuild/m4/workout/engine-runtime.cjs'),Delta=require('./source-delta.cjs');
const Capture=mod('rebuild/m4/workout/capture.cjs'),Commands=mod('rebuild/m4/workout/commands.cjs'),Sign=mod('rebuild/m3/w5/crypto.cjs'),Ops=mod('rebuild/client/ops.cjs');
const Source=mod('rebuild/m3/w5/source/codec.cjs'),SourceProjection=mod('rebuild/m4/workout/source-projection.cjs');
// Assignment L — durable() no longer uses the TEST-ONLY reader below on its
// producer path: the product registrar (rebuild/m4/workout/source-projection.cjs)
// registers the null lane and reading-replay registers the string lane, both
// consumed through the product composite reader. createNullSelectionReader is
// retained for isolated contract comparisons only.
// rev173 N1 — TEST-ONLY null-selection source projection reader. reading-replay's
// projectLineage registers a workoutInput only for a string selectionId (an
// activated source), so a client running with no accepted source and
// selection_id:null has no real registered projection to consume. This reader
// mirrors reading-replay's ownership contract exactly (WeakMap identity of the
// frozen projection, three-field own-enumerable basis equality, one owned copy)
// for a projection whose ONLY source frontier is the empty accepted prefix:
// W 0, the prefix hasher's digest of zero rows, selection null. It is not an
// activation, an issuer, a receipt or a currentness proof, and a non-null
// selection is refused here by construction.
function freezeOwned(value){const stack=[value];while(stack.length){const item=stack.pop();if(!item||typeof item!=='object'||Object.isFrozen(item))continue;
 for(const child of Object.values(item))stack.push(child);Object.freeze(item);}return value;}
const emptyPrefixBasis=()=>Source.basis({W:0,log_digest:Source.createPrefixHasher().digest(),selection_id:null});
function createNullSelectionReader(){
 const held=new WeakMap();
 function register({generation,state,workoutFacts}){
  const imports=generation?.collections?.[Source.COLLECTION];
  if(imports&&Object.keys(imports).length)throw Object.assign(new Error('NULL_SELECTION_UNPROVEN'),{code:'NULL_SELECTION_UNPROVEN'});
  const basis=emptyPrefixBasis();
  const projection=freezeOwned({profile:'test-only/null-selection-projection/v1',ready:true,accepted_state:structuredClone(state),
   workout_history:workoutFacts===undefined?null:structuredClone(workoutFacts),workout_baseline:null,source_basis:structuredClone(basis)});
  held.set(projection,{basis:structuredClone(basis),state:projection.accepted_state,baseline:null,facts:projection.workout_history});
  return projection;
 }
 function workoutInput(projection,expectedBasis){
  const h=held.get(projection);
  const descriptors=Object.getOwnPropertyDescriptors(expectedBasis||{}),fields=['W','log_digest','selection_id'];
  if(!h||Reflect.ownKeys(descriptors).length!==3||fields.some(k=>!Object.hasOwn(descriptors[k]||{},'value')||!descriptors[k].enumerable)||
   fields.some(k=>descriptors[k].value!==h.basis[k])){const e=new Error('SOURCE_WORKOUT_INPUT_DISAGREEMENT');e.code=e.message;throw e;}
  return {state:h.state,source_basis:structuredClone(h.basis),workout_baseline:h.baseline,...(h.facts?{workoutFacts:h.facts}:{})};
 }
 return Object.freeze({register,workoutInput});
}
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const DAY='2026-09-04';
const clockFor=day=>({today:()=>day,nowISO:()=>day+'T12:00:00.000Z',nowMs:()=>Date.parse(day+'T12:00:00.000Z'),hour:()=>12,dow:()=>new Date(day+'T00:00:00Z').getUTCDay()});
// Declared synthetic context assumption for formula tests only.
const assumed=request=>({...request,hard:false,rushed:false,debt:false});
const pounds=value=>({value,unit:'lb'}),configuration=key=>({kind:'configuration',configuration_key:key});
const exact=value=>({tag:'exact',value,unit:'rep'}),bound={tag:'at_least',value:3,unit:'rep'};
// A state whose ONLY athlete history is native (no imported rows): the
// registered view is the sole factual source for these lifts.
function nativeOnlyState(day=DAY,mutate){const s=F.createSyntheticState(day);s.sessionLog={};if(mutate)mutate(s);return s;}
// Compose an engine from explicit source texts (closed import graph), used to
// run the ACCEPTED preimage beside the candidate and for in-memory regressions.
function loadSources(sources){const cache=new Map();return function read(file){
 const full=path.resolve(ROOT,file),relative=path.relative(ROOT,full).split(path.sep).join('/');
 assert(Object.hasOwn(sources,relative),'Closed source import '+relative);if(cache.has(full))return cache.get(full).exports;
 const m=new Module(full,module);m.filename=full;cache.set(full,m);m.require=request=>request.startsWith('.')?read(path.resolve(path.dirname(full),request)):require(request);m._compile(sources[relative],full);return m.exports;};}
const ENGINE_FILES=['dates','constants','plan','performed','entered-load','progression','sleep','energy','policy','today','volume','earn','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
function composeFrom(sources,{clock,nativeTrendContext,seed={}}={}){
 const read=loadSources(sources),E={HISTORY:[],ROLLUPS:[],SEED:{},exById:(s,id)=>s.exercises.find(e=>e.id===id),...seed};
 const deps={clock,ids:{next(){throw new Error('no ids');},fresh(){throw new Error('no ids');}},drafts:Object.freeze({length:0,key:()=>null})};
 for(const name of COMPOSITION.modules){const create=read('rebuild/engine/'+name+'.cjs');Object.assign(E,name==='performed'?create(E,{nativeTrendContext}):create(E,deps));}
 return E;
}
function candidateSources(){const fs=require('node:fs');return Object.fromEntries(ENGINE_FILES.map(f=>[f,fs.readFileSync(path.join(ROOT,f),'utf8')]));}
function acceptedSources(packetRoot){const fs=require('node:fs');const out=candidateSources();
 for(const f of Delta.OWNED)out[f]=fs.readFileSync(path.join(packetRoot,'inputs/accepted-generated',f),'utf8');return out;}
async function durable({day=DAY,state=nativeOnlyState(day),resolver=assumed,producerBuild='native-next-targets-candidate',seedOps=[],sourceProfile=false}={}){
 const [{fixture,initial,config,O,createT2Stage},{createDurablePublicClient},{parseStrictJson},{projectWorkoutRecords},{storedWorkoutHistory}]=await Promise.all([
  load('rebuild/m3/w6/test/support.mjs'),load('rebuild/m3/w6/public-client.mjs'),load('rebuild/m3/w6/strict-json.mjs'),load('rebuild/m4/workout/project-history.mjs'),load('rebuild/m4/workout/stored-history.mjs')]);
 const key=Sign.generateSigningKey('synthetic-native-next-targets'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},key);
 // rev173 N1 — sourceProfile:true runs the client's actual source-aware capture
 // profile v2 (source_basis on every capture) with the test-only null-selection
 // reader above; false keeps the candidate-01 v1 path byte for byte.
 const capture=sourceProfile?Capture.createPrescriptionCapture({parseStrictJson,profile:Capture.SOURCE_PROFILE,sourceCodec:Source}):Capture.createPrescriptionCapture({parseStrictJson});
 const registrar=sourceProfile?SourceProjection.createNullSelectionRegistrar({sourceCodec:Source}):null;
 let stringLane=undefined,reader=sourceProfile?SourceProjection.createSourceProjectionReader({nullSelection:registrar}):null,projectionFor=null;
 // Added-slot composition only: the static extension capture validator exists
 // in the accepted added-slot correction's capture.cjs, never in the native root.
 const extensionCapture=typeof Capture.createExtensionCapture==='function'?Capture.createExtensionCapture({parseStrictJson}):undefined;
 const f=await fixture(),g=initial();g.metadata.authorityLease=lease;await f.repo.initialize(g,'synthetic-enrollment-only');
 let today=day;const clock={...clockFor(day),today:()=>today},runtime=createEngineRuntime({clock,nativeTrendContext:resolver});
 const producer={app_build:'synthetic-native-next-targets',engine_build:producerBuild,rule_profile:Adapter.PROFILE,source_schema:'synthetic-complete-engine-input'};
 const makeAdapter=()=>Adapter.createEngineWorkoutCapture({engine:runtime,prescriptionCapture:capture,producerIdentity:producer,...(reader?{sourceProjectionReader:reader}:{})});
 let adapter=makeAdapter();
 // String lane: the test hands over the REAL reading-replay instance (its own
 // projectLineage registrar); the composite reader is rebuilt with both lanes.
 const setStringLane=replay=>{stringLane=replay;reader=SourceProjection.createSourceProjectionReader({nullSelection:registrar,stringSelection:replay});adapter=makeAdapter();};
 const setProjectionFor=fn=>{projectionFor=fn;};
 const mapper=History.createEngineHistoryProjector({athleteId:'ath-1',deviceId:'dev-A',parseStrictJson,projectWorkoutRecords,prescriptionCapture:capture,resolveCapturedLayout:({start})=>adapter.readLayout(start.prescription_capture)});
 const input={state,day,basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:1}};
 let parents=[],lastFacts=null,lastInput=null,lastProjection=null,sourceBasis=sourceProfile?emptyPrefixBasis():null,injectedState=undefined;
 const args={repository:f.repo,stage:createT2Stage(()=>{const c=config();return {...c,clock:{...c.clock,today:()=>today}};},{allowInbound:true,workoutCommands:Commands.createWorkoutCommands({prescriptionCapture:capture,...(extensionCapture?{extensionCapture}:{})})}),namespace:f.setup.namespace,
  athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,observationGuard:{run:async(_k,fn)=>fn()},validateCommit:()=>null,
  keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,prescriptionCapture:capture,workoutProducerIdentity:producer,
  resolveWorkoutBasis:()=>({plan_basis:input.basis.plan_basis,input_basis:input.basis.input_basis,causal_parents:parents.slice(),...(sourceProfile?{source_basis:structuredClone(sourceBasis)}:{})}),
  projectWorkoutHistory:({history,generation,source_revision})=>mapper.project(history,generation,{sourceRevision:source_revision}),
  workoutProducer:(generation,context)=>{lastFacts=structuredClone(context.workoutFacts);
   const engineInput={...structuredClone(input),day:today,state:{...structuredClone(input.state),...(context.workoutFacts?{workoutFacts:context.workoutFacts}:{})},basis:context.basis};
   lastInput=structuredClone(engineInput);
   if(!sourceProfile)return adapter.prepare(engineInput).capture;
   // Source-aware path: the adapter consumes ONLY the registered projection; the
   // producer never hands it a state of its own (unless a regression injects one).
   lastProjection=projectionFor?projectionFor({generation,context}):registrar.register({generation,state:input.state,workoutFacts:context.workoutFacts});
   lastInput.source_basis=structuredClone(context.source_basis);
   return adapter.prepare({day:today,basis:context.basis,sourceProjection:lastProjection,source_basis:context.source_basis,...(injectedState===undefined?{}:{state:injectedState})}).capture;}};
 let repo=f.repo,client=createDurablePublicClient(args);
 // Seed hand-built local rows (identity-committed outbox rows on this device)
 // before any workout. Used only for the schema-1 source-control ancestor the
 // replay path needs; it is stored-on-this-device, never an accepted position.
 for(const build of seedOps){
  const snapshot=await repo.load(),generation=structuredClone(snapshot.generation),c=generation.collections;c.ops=c.ops||{};c.outbox=c.outbox||{};c.meta.checkpoint.counts=c.meta.checkpoint.counts||{ops:0,outbox:0};
  const own=Object.values(c.ops).filter(o=>o.device_id==='dev-A').sort((a,b)=>a.device_seq-b.device_seq),last=own[own.length-1];
  const op=build({seq:(last?.device_seq||0)+1,predecessor:last?.op_id??null,lease:lease.lease_id});
  op.canonical_content_commitment=Ops.commitmentOf(op,O.K_IDENTITY);
  c.ops[op.op_id]=op;c.outbox[op.op_id]={op_id:op.op_id,order:Object.keys(c.outbox).length+1,enqueued:day+'T00:00:00Z'};
  c.meta.checkpoint.counts.ops=Object.keys(c.ops).length;c.meta.checkpoint.counts.outbox=Object.keys(c.outbox).length;
  await repo.commit({revision:snapshot.revision,token:snapshot.token},generation,()=>null);parents=[op.op_id];
 }
 async function reopen(){repo.close();const fresh=await f.fresh();repo=fresh.repository;client=createDurablePublicClient({...args,repository:repo});return client;}
 const setDay=d=>{today=d;};
 async function prepared(){const p=await client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert(p.prepared,p.code);return {...p,facts:lastFacts,engineInput:lastInput,projection:lastProjection};}
 // Seed hand-built schema-2 session rows (identity-committed outbox rows on this
 // device, continuing its own sequence) into the SAME durable generation the
 // client reads — the added-slot candidate's stored-on-this-device seam. The
 // client's single builder refuses the extension kind, so rows are built here;
 // no receipt, disposition or accepted position is manufactured.
 async function seedRows(build){
  const snapshot=await repo.load(),generation=structuredClone(snapshot.generation),c=generation.collections;c.ops=c.ops||{};c.outbox=c.outbox||{};
  const own=Object.values(c.ops).filter(o=>o.device_id==='dev-A').sort((a,b)=>a.device_seq-b.device_seq);let last=own[own.length-1];
  let order=Math.max(0,...Object.values(c.outbox).map(e=>e.order||0));const enqueued=Object.values(c.outbox)[0]?.enqueued??today+'T00:00:00Z';
  const effective=own.find(o=>o.effective)?.effective??{local_date:today,local_time:'10:00',utc_offset:'+00:00'};
  const next=({kind,parents=[],payload,extra={},target})=>{
   const n=(last?.device_seq||0)+1,value={op_id:'op-dev-A-seeded-'+n,athlete_id:'ath-1',device_id:'dev-A',device_seq:n,device_predecessor_op_id:last?.op_id??null,causal_parents:parents.slice(),class:'session',kind,effective:structuredClone(effective),schema_version:2,lease_id:lease.lease_id,payload};
   if(target)value.target_op_id=target;Object.assign(value,extra);value.canonical_content_commitment=Ops.commitmentOf(value,O.K_IDENTITY);last=value;return value;};
  const rows=build({next,ops:c.ops});
  for(const value of rows){c.ops[value.op_id]=value;c.outbox[value.op_id]={op_id:value.op_id,order:++order,enqueued};}
  c.meta.checkpoint.counts=c.meta.checkpoint.counts||{ops:0,outbox:0};c.meta.checkpoint.counts.ops=Object.keys(c.ops).length;c.meta.checkpoint.counts.outbox=Object.keys(c.outbox).length;
  await repo.commit({revision:snapshot.revision,token:snapshot.token},generation,()=>null);return rows;
 }
 // One workout: prepare through the real producer, start, record each slot of
 // one lift (performed/skipped/unlogged), close. Returns the operation ids.
 async function workout({lift,sets,completion='normal',before=null,beforeClose=null}={}){
  const p=await prepared();if(before)before(p);
  const start=await client.startPreparedWorkout({preparedId:p.preparedId});assert(start.acknowledged,start.code);
  const slots=p.view.slots.filter(s=>s.lift_lineage_id===lift),ids=[];
  for(const [i,slot]of slots.entries()){
   const spec=sets[i];if(spec===undefined||spec==='unlogged')continue;
   const r=await client.execute('workout',{action:spec==='skipped'?'skip':'set',input:{session_start_op_id:start.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:lift,
    ...(spec==='skipped'?{skip_scope:'set',reason:'Time'}:{load:spec.load||pounds(40),reps:{value:spec.reps,unit:'rep'},...(spec.reserve===undefined?{}:{reserve:spec.reserve})})}});
   assert(r.acknowledged,r.code);ids.push(r.op_id);
  }
  const seeded=beforeClose?await beforeClose({start:start.op_id,ids,view:p.view}):null;
  const close=await client.execute('workout',{action:'close',input:{session_start_op_id:start.op_id,completion_kind:completion,causal_parents:[start.op_id,...ids]}});assert(close.acknowledged,close.code);
  parents=[close.op_id];return {start:start.op_id,ids,close:close.op_id,view:p.view,facts:p.facts,seeded};
 }
 async function edit(id,action,change){const p=await client.prepareWorkoutEdit({target_op_id:id});assert(p.prepared,p.code);
  const r=await client.commitWorkoutEdit({editId:p.editId,action,change});assert(r.acknowledged,r.code);parents.push(r.op_id);return r;}
 async function source(){const fresh=await f.fresh();try{const c=createDurablePublicClient({...args,repository:fresh.repository}),read=await c.readWorkoutHistory();assert(read.read,read.code);
  const snapshot=await fresh.repository.load();assert.equal(snapshot.revision,read.source_revision);return {history:read.history,generation:snapshot.generation,sourceRevision:read.source_revision};}finally{fresh.repository.close();}}
 async function facts(){const s=await source(),before=JSON.stringify(s);const out=mapper.project(s.history,s.generation,{sourceRevision:s.sourceRevision});assert.equal(JSON.stringify(s),before);return out;}
 const engineState=(facts,mutate)=>{const s=structuredClone(input.state);if(mutate)mutate(s);s.workoutFacts=facts;return s;};
 return {f,args,input,clock,get runtime(){return runtime;},get adapter(){return adapter;},mapper,capture,extensionCapture,get reader(){return reader;},registrar,setStringLane,setProjectionFor,parseStrictJson,producer,lease,key,O,config,initial,createDurablePublicClient,storedWorkoutHistory,projectWorkoutRecords,
  get client(){return client;},get repository(){return repo;},parents:()=>parents.slice(),setParents:p=>{parents=p.slice();},setDay,today:()=>today,reopen,prepared,workout,edit,source,facts,engineState,seedRows,
  sourceBasis:()=>sourceBasis?structuredClone(sourceBasis):null,setSourceBasis:b=>{sourceBasis=b;},setInjectedState:s=>{injectedState=s;},
  close:()=>{try{repo.close();}catch{}}};
}
// Schema-1 source-control operation (import intent / rollback) built for the
// seeded ancestor and for the replay generation. Never a real activation.
function sourceControlOp({seq,predecessor,lease,id,type='source-import-intent',source_id,target,date=DAY}){
 return {op_id:id,athlete_id:'ath-1',device_id:'dev-A',device_seq:seq,device_predecessor_op_id:predecessor,causal_parents:[],class:'event',kind:'fact',
  effective:{local_date:date,local_time:'08:00',utc_offset:'+00:00'},schema_version:1,lease_id:lease,payload:{type,source_id,...(target?{target_activation_id:target}:{}),interval:{start:date,end:date},material_digest:'synthetic-unverified'}};
}
// Synthetic accepted positions over a durable generation: every op in device
// order becomes an ACCEPTED receipt. Disclosed test acceptance, not issuance.
function acceptedClone(generation,extraOps=[]){
 const g=structuredClone(generation),c=g.collections;
 for(const op of extraOps){c.ops[op.op_id]=op;}
 const ops=Object.values(c.ops).sort((a,b)=>a.device_seq-b.device_seq);
 c.receipts=Object.fromEntries(ops.map((op,i)=>[String(i+1),{seq:i+1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,op}]));
 c.dispositions=Object.fromEntries(ops.map((op,i)=>[op.op_id,{op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,status:'ACCEPTED',athlete_log_seq:i+1}]));
 c.outbox={};c.rejected=c.rejected||{};c.sync.frontier={W:ops.length,authorityW:ops.length};
 return g;
}
const emptyGeneration=()=>({collections:{ops:{},receipts:{},dispositions:{},outbox:{},rejected:{},sync:{frontier:{W:0,authorityW:0}}},metadata:{}});
const prefixOf=(g,cut)=>{const p=structuredClone(g),c=p.collections;const keep=new Set(Object.values(c.receipts).filter(r=>r.seq<=cut).map(r=>r.op_id));
 c.ops=Object.fromEntries(Object.entries(c.ops).filter(([id])=>keep.has(id)));c.receipts=Object.fromEntries(Object.entries(c.receipts).filter(([,r])=>r.seq<=cut));
 c.dispositions=Object.fromEntries(Object.entries(c.dispositions).filter(([id])=>keep.has(id)));c.sync.frontier={W:cut,authorityW:cut};return p;};
const selectionFor=(op,seq,before,action='activate',target=null)=>({type:'selection',action,source_id:op.payload.source_id,material_digest:op.payload.material_digest,intent_op_id:op.op_id,commitment:op.canonical_content_commitment,seq,before,target_activation_id:target});
module.exports={Source,emptyPrefixBasis,createNullSelectionReader,freezeOwned,sourceControlOp,acceptedClone,emptyGeneration,prefixOf,selectionFor,ROOT,DAY,F,Adapter,History,Capture,Commands,Sign,Ops,Delta,createEngineRuntime,COMPOSITION,clockFor,assumed,pounds,configuration,exact,bound,nativeOnlyState,loadSources,composeFrom,candidateSources,acceptedSources,ENGINE_FILES,durable,sha,mod,load};
