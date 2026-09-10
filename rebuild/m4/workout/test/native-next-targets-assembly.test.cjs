'use strict';
// Assignment L — source-aware (v2) capture through REAL registrars for both
// lanes, consumed by the product composite reader (source-projection.cjs):
//   null lane   → product createNullSelectionRegistrar (zero-import generation)
//   string lane → reading-replay.projectLineage, the existing and only registrar
//                 for an activated source; its currentness / frontier-cut /
//                 selection checks execute unchanged (see rejections below).
// No product HOST assembles the workout producer in this packet (rev174
// N174-1); the fixture's producer is the assembly under test here, wired
// exactly as a host would wire it: adapter = createEngineWorkoutCapture(runtime,
// v2 capture, identity, composite reader). Disclosed test authority: accepted
// positions for the string lane are the fixture's synthetic accepted clone and
// readSourceCuts echoes the requested cut (the product provider is the W6
// source-import candidate's inspectSourceCuts, not composed here); the null
// lane's state is the synthetic athlete profile. Nothing here is issuance,
// admission, activation or currentness. Author tests are not acceptance.
const test=require('node:test'),assert=require('node:assert/strict');
const X=require('../../spec/native-next-target-candidate/fixture.cjs');
const {createImportEngine}=require('../../spec/native-next-target-candidate/import-engine-assembly.cjs');
const {createReadingReplay}=X.mod('rebuild/m4/import/reading-replay.cjs'),{createImportPreparation}=X.mod('rebuild/m4/import/prepare.cjs');
const SourceProjection=X.mod('rebuild/m4/workout/source-projection.cjs'),Source=X.Source;
const PACKET=process.env.EARNED_NATIVE_PACKET_ROOT;if(!PACKET)throw new Error('Provide the immutable packet root explicitly (EARNED_NATIVE_PACKET_ROOT)');
const ACCEPTED=X.acceptedSources(PACKET),F=X.F,DAY=X.DAY,{exact,bound,assumed}=X;
const throwsCode=(fn,code)=>assert.throws(fn,e=>e?.code===code||(()=>{throw new Error('expected '+code+' got '+(e?.code||e?.message));})());
const rejectsCode=(p,code)=>assert.rejects(p,e=>e?.code===code||(()=>{throw new Error('expected '+code+' got '+(e?.code||e?.message));})());
const oldEngine=(clock,resolver=assumed)=>X.composeFrom(ACCEPTED,{clock,nativeTrendContext:resolver});
const target=(view,lift)=>view.slots.filter(s=>s.lift_lineage_id===lift).map(s=>JSON.parse(s.reps.source_json).value);
const opsOf=async f=>(await f.repository.load()).generation.collections.ops;
function legacyEquivalent(base,lift,rows,{w=40}={}){
 const s=structuredClone(base);s.sessionLog={};
 for(const [i,row]of rows.entries()){const d=F.dayOffset(DAY,-(rows.length-i)*2);
  const rirSets=row.rir.map(r=>r===undefined?null:r);
  s.sessionLog[d]={type:'L',entries:[{id:lift,w,reps:row.reps.slice(),rir:rirSets[0],rirEnd:rirSets.length>1?rirSets[rirSets.length-1]:undefined,rirSets,sets:row.reps.length}]};}
 const ex=s.exercises.find(e=>e.id===lift);const last=rows.length?s.sessionLog[Object.keys(s.sessionLog).sort().at(-1)].entries[0]:null;
 ex.last=last?last.reps.slice():null;ex.lastMeta=last?{d:Object.keys(s.sessionLog).sort().at(-1),w,reps:last.reps.slice(),rir:last.rir??null,rirSets:last.rirSets.slice(),debt:false}:null;return s;
}
const importedBaseline=()=>{const s=F.createSyntheticState(DAY);s.sessionLog={};
 for(const [i,d]of [-9,-6,-3].entries())s.sessionLog[F.dayOffset(DAY,d)]={type:'L',entries:[{id:'demo-leg',w:40,reps:[9+i,8+i],rir:2,sets:2}]};
 return s;};
// Same replay composition as the retained item-3 test, with one difference the
// string lane now needs: v2 Starts recorded BEFORE activation carry a null
// basis, and the (echoing, disclosed) cut reader answers them with `current:null`.
async function replayFixture(f,{imported}){
 const src=await f.source(),g=X.acceptedClone(src.generation);
 const {parseStrictJson}=f,{createReadingProjector}=await X.load('rebuild/m3/w6/reading-history.mjs');
 const build='synthetic-test-only-importer',engineFor=({day,hour})=>createImportEngine({day,hour});
 const sourceBytes=Buffer.from(JSON.stringify(imported)),prep=createImportPreparation({engine:engineFor({day:DAY,hour:12}),parseStrictJson}).prepare(sourceBytes,{localBytes:sourceBytes});
 const materialFor=(checkpoint,clock=DAY)=>({source_json:sourceBytes.toString(),candidate_json:prep.candidateBytes().toString(),local_json:sourceBytes.toString(),checkpoint_json:JSON.stringify({revision:1,token:'synthetic',generation:checkpoint}),engine_context_json:JSON.stringify({build,clock})});
 const A=g.collections.ops['source-A'],nodes=new Map([[A.op_id,{selection:X.selectionFor(A,1,{W:0,selection_id:null}),material:materialFor(X.emptyGeneration())}]]);
 const reader=g2=>f.storedWorkoutHistory(g2,{athleteId:'ath-1',deviceId:'dev-A',prescriptionCapture:f.capture,recoveryReceipts:Object.values(g2.collections.receipts)});
 const replay=createReadingReplay({engineFor,projectReadings:createReadingProjector({athleteId:'ath-1',deviceId:'dev-A'}),parseStrictJson,producerIdentity:'synthetic-test-only-factories',importBuild:build,deviceId:'dev-A',workoutHistoryReader:reader,workoutProjector:f.mapper});
 const basisFor=(gen,selectionId)=>({W:gen.collections.sync.frontier.W,log_digest:Buffer.alloc(32,7).toString('base64url'),selection_id:selectionId});
 const readSourceCuts=async bases=>bases.map(frontier=>({frontier,current:frontier.selection_id===null?null:structuredClone(nodes.get(frontier.selection_id).selection)}));
 async function project(gen=g,selectionId=A.op_id,overrides={}){const basis=basisFor(gen,selectionId);
  const projection=await replay.projectLineage({selectionId,generation:gen,asOf:DAY,assertCurrent:async()=>{},readSourceSelection:async id=>structuredClone(nodes.get(id)?.selection),readSelectedSource:async id=>structuredClone(nodes.get(id)),
   sourceBasis:basis,readSourceCuts,sourceRevision:src.sourceRevision,...overrides});
  assert.equal(projection.ready,true,JSON.stringify(projection.issues));return {projection,basis};}
 const adapterOnly=(projection,basis)=>X.Adapter.createEngineWorkoutCapture({engine:f.runtime,prescriptionCapture:f.capture,producerIdentity:f.producer,sourceProjectionReader:replay})
  .prepare({sourceProjection:projection,source_basis:basis,day:DAY,basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:src.sourceRevision}});
 return {src,g,A,nodes,replay,project,adapterOnly};
}

test('product registrar and composite reader: identity, three-field basis by value, zero-import only, lane routing',()=>{
 const R=SourceProjection.createNullSelectionRegistrar({sourceCodec:Source});
 assert.throws(()=>SourceProjection.createNullSelectionRegistrar({}),TypeError);
 const state=X.nativeOnlyState(DAY),facts={profile:'earned/workout-facts/v1',source_revision:1,sessions:[],incomplete_sessions:[]},g=X.emptyGeneration();
 const p=R.register({generation:g,state,workoutFacts:facts});
 assert.equal(p.profile,'earned/null-selection-projection/v1');assert.equal(Object.isFrozen(p),true);assert.equal(Object.isFrozen(p.accepted_state),true);assert.equal(Object.isFrozen(p.workout_history),true);
 const basis={W:0,log_digest:Source.createPrefixHasher().digest(),selection_id:null};
 assert.deepEqual(p.source_basis,basis);assert.deepEqual(basis,X.emptyPrefixBasis(),'the empty accepted prefix is computed by the codec, not asserted');
 const c=R.workoutInput(p,basis);
 assert.strictEqual(c.state,p.accepted_state,'one owned copy: the frozen registered state itself');assert.deepEqual(c.source_basis,basis);assert.notStrictEqual(c.source_basis,p.source_basis);assert.strictEqual(c.workoutFacts,p.workout_history);assert.equal(c.workout_baseline,null);
 throwsCode(()=>R.workoutInput(structuredClone(p),basis),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
 throwsCode(()=>R.workoutInput({...p},basis),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
 for(const bad of [{...basis,W:1},{...basis,log_digest:'AAAA'},{...basis,selection_id:'source-A'},{...basis,extra:1},{W:0,log_digest:basis.log_digest},{},null,undefined,'basis'])
  throwsCode(()=>R.workoutInput(p,bad),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
 const getter={W:0,selection_id:null};Object.defineProperty(getter,'log_digest',{get:()=>basis.log_digest,enumerable:true});throwsCode(()=>R.workoutInput(p,getter),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
 const hidden={W:0,log_digest:basis.log_digest};Object.defineProperty(hidden,'selection_id',{value:null,enumerable:false});throwsCode(()=>R.workoutInput(p,hidden),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
 const withImport=X.emptyGeneration();withImport.collections[Source.COLLECTION]={['["manifest","x"]']:{manifest:{}}};throwsCode(()=>R.register({generation:withImport,state}),'SOURCE_PROJECTION_IMPORT_PRESENT');
 const withPrefix=X.emptyGeneration();withPrefix.collections.sync.frontier.W=1;throwsCode(()=>R.register({generation:withPrefix,state}),'SOURCE_PROJECTION_FRONTIER_REQUIRED');
 throwsCode(()=>R.register({generation:g}),'SOURCE_PROJECTION_STATE_REQUIRED');
 throwsCode(()=>R.register({generation:g,state,workoutFacts:{profile:'other'}}),'SOURCE_PROJECTION_FACTS_REQUIRED');
 throwsCode(()=>R.register({}),'SOURCE_PROJECTION_GENERATION_REQUIRED');
 const nullOnly=SourceProjection.createSourceProjectionReader({nullSelection:R});
 assert.deepEqual(nullOnly.workoutInput(p,basis).source_basis,basis);
 throwsCode(()=>nullOnly.workoutInput(p,{...basis,selection_id:'source-A'}),'SOURCE_PROJECTION_LANE_UNAVAILABLE');
 throwsCode(()=>nullOnly.workoutInput(p,{...basis,selection_id:''}),'SOURCE_PROJECTION_LANE_UNAVAILABLE');
 throwsCode(()=>nullOnly.workoutInput(p,{...basis,extra:1}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
 let reached=0;const stringOnly=SourceProjection.createSourceProjectionReader({stringSelection:{workoutInput(){reached++;throw new Error('lane reached');}}});
 throwsCode(()=>stringOnly.workoutInput(p,basis),'SOURCE_PROJECTION_LANE_UNAVAILABLE');assert.equal(reached,0);
 assert.throws(()=>SourceProjection.createSourceProjectionReader({}),TypeError);assert.throws(()=>SourceProjection.createSourceProjectionReader({nullSelection:{}}),TypeError);
});

test('null lane through the real durable client: the product registrar registers, the composite reader consumes, the test-only reader is not on the path',async()=>{
 const state=X.nativeOnlyState(DAY,s=>{const leg=s.exercises.find(e=>e.id==='demo-leg');leg.last=[10,10];leg.lastMeta={d:F.dayOffset(DAY,-3),w:40,reps:[10,10],rir:2,rirSets:[2,null],debt:false};});
 const f=await X.durable({state,sourceProfile:true});try{
  assert.equal(f.registrar.profile,'earned/null-selection-projection/v1');
  assert.throws(()=>X.Adapter.createEngineWorkoutCapture({engine:f.runtime,prescriptionCapture:f.capture,producerIdentity:f.producer}),/Actual source projection consumer required/,'unchanged product guard: v2 needs a consumer');
  const first=await f.prepared();
  assert.equal(first.projection.profile,'earned/null-selection-projection/v1');assert.deepEqual(first.view.source_basis,X.emptyPrefixBasis());
  const w=await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:bound},{reps:7,reserve:exact(1)}]});
  const startOp=(await opsOf(f))[w.start];assert.equal(startOp.prescription_capture.profile,'earned/workout-prescription/v2');assert.deepEqual(startOp.prescription_capture.source_basis,X.emptyPrefixBasis());
  const p=await f.prepared();assert.deepEqual(target(p.view,'demo-leg'),[9,8]);
  await f.reopen();const src=await f.source();assert.deepEqual(src.history.sessions.find(s=>s.start.operation.op_id===w.start).original,w.view);
  // A zero-import generation is the registrar's whole domain: an import row or an accepted prefix refuses.
  const g=(await f.repository.load()).generation;assert.equal(g.collections.sync?.frontier?.W??0,0);
  const gI=structuredClone(g);gI.collections[Source.COLLECTION]={['["manifest","x"]']:{manifest:{}}};throwsCode(()=>f.registrar.register({generation:gI,state:f.input.state,workoutFacts:p.facts}),'SOURCE_PROJECTION_IMPORT_PRESENT');
 }finally{f.close();}
});

test('string lane through the real durable client: reading-replay.projectLineage registers (its checks intact), the composite reader routes to it, the stored Start carries the selection basis; cross-lane and unheld claims refuse',async()=>{
 const f=await X.durable({sourceProfile:true,seedOps:[spec=>X.sourceControlOp({...spec,id:'source-A',source_id:'synthetic-source-A'})]});try{
  const lines=[[8,7],[9,8],[10,9]],workouts=[];
  for(const line of lines)workouts.push(await f.workout({lift:'demo-leg',sets:[{reps:line[0],reserve:bound},{reps:line[1],reserve:exact(0)}]}));
  for(const w of workouts)assert.equal((await opsOf(f))[w.start].prescription_capture.source_basis.selection_id,null,'sessions recorded before activation carry the null basis');
  const R=await replayFixture(f,{imported:importedBaseline()});
  const {projection,basis}=await R.project();
  assert.equal(Object.isFrozen(projection),true);assert.equal(basis.selection_id,'source-A');assert.deepEqual(projection.source_basis,basis);
  assert.equal(projection.workout_history.sessions.length,3);assert.equal(projection.workout_history.sessions.every(s=>s.record.entries[0].profile==='earned/performed-lift/v1'),true);
  assert.deepEqual(projection.workout_history.sessions.map(s=>s.original_source?.basis?.selection_id),[null,null,null],'the projector proved each null-basis Start against a cut with no selection');
  // The real registrar's consumer contract on the string lane.
  throwsCode(()=>R.replay.workoutInput(structuredClone(projection),basis),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  throwsCode(()=>R.replay.workoutInput(projection,{...basis,W:basis.W+1}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  // Existing projectLineage checks stay intact and execute: an unheld frontier, a changed context, and a null selection all refuse inside the registrar.
  await rejectsCode(R.project(R.g,'source-A',{sourceBasis:{...basis,W:basis.W+1}}),'SOURCE_WORKOUT_BASIS_UNPROVEN');
  await rejectsCode(R.project(R.g,'source-A',{readSourceCuts:async bases=>bases.map(frontier=>({frontier,current:null}))}),'SOURCE_WORKOUT_BASIS_UNPROVEN');
  await rejectsCode(R.project(R.g,'source-A',{assertCurrent:async()=>{const e=new Error('SESSION_CHANGED');e.code='SESSION_CHANGED';throw e;}}),'SESSION_CHANGED');
  await rejectsCode(R.project(R.g,null),'SOURCE_LINEAGE_INPUT');
  // Compose the string lane into the product reader; the client's resolver claims the projection's own basis with the selection as a causal parent.
  f.setStringLane(R.replay);f.setProjectionFor(()=>projection);f.setSourceBasis(structuredClone(basis));f.setParents([...f.parents(),'source-A']);
  const p=await f.prepared();
  assert.equal(p.view.profile,'earned/workout-prescription/v2');assert.deepEqual(p.view.source_basis,basis);assert.strictEqual(p.projection,projection);
  assert.deepEqual(target(p.view,'demo-leg'),[10,10],'imported baseline plus the three native lines govern (item 3 result)');
  assert.deepEqual(target(p.view,'demo-leg'),target(R.adapterOnly(projection,basis).capture,'demo-leg'),'the client path and the adapter-only path agree');
  const Old=oldEngine(f.clock),leg=structuredClone(projection.accepted_state);delete leg.workoutFacts;
  const oracle=legacyEquivalent(leg,'demo-leg',[{reps:[9,8],rir:[2,undefined]},{reps:[10,9],rir:[2,undefined]},{reps:[11,10],rir:[2,undefined]},{reps:[8,7],rir:[3,0]},{reps:[9,8],rir:[3,0]},{reps:[10,9],rir:[3,0]}]);
  assert.deepEqual(target(p.view,'demo-leg'),Old.targetsFor(oracle.exercises.find(e=>e.id==='demo-leg'),oracle));
  // Start/save through the client, reopen: the stored Start carries the string selection basis byte for byte.
  const started=await f.client.startPreparedWorkout({preparedId:p.preparedId});assert(started.acknowledged,started.code);
  const startOp=(await opsOf(f))[started.op_id];assert.deepEqual(startOp.prescription_capture.source_basis,basis);assert.equal(startOp.prescription_capture.source_basis.selection_id,'source-A');
  await f.reopen();const src=await f.source(),saved=src.history.sessions.find(s=>s.start.operation.op_id===started.op_id);assert.deepEqual(saved.original,p.view);
  const closed=await f.client.execute('workout',{action:'close',input:{session_start_op_id:started.op_id,completion_kind:'early',causal_parents:[started.op_id]}});assert(closed.acknowledged,closed.code);f.setParents([closed.op_id,'source-A']);
  // Refusals: each stores nothing, each is refused by the lane that owns the projection.
  const before=Object.keys(await opsOf(f)).length,claim=async()=>{const r=await f.client.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.notEqual(r.prepared,true);return r;};
  f.setSourceBasis({...basis,W:basis.W+1});await claim();throwsCode(()=>f.reader.workoutInput(projection,{...basis,W:basis.W+1}),'SOURCE_WORKOUT_INPUT_DISAGREEMENT');
  f.setSourceBasis({...basis,log_digest:Buffer.alloc(32,9).toString('base64url')});await claim();
  f.setSourceBasis(X.emptyPrefixBasis());await claim();throwsCode(()=>f.reader.workoutInput(projection,X.emptyPrefixBasis()),'SOURCE_WORKOUT_INPUT_DISAGREEMENT','a null claim against a string-registered projection is refused by the null lane');
  const nullProjection=f.registrar.register({generation:X.emptyGeneration(),state:f.input.state,workoutFacts:p.facts});
  throwsCode(()=>f.reader.workoutInput(nullProjection,basis),'SOURCE_WORKOUT_INPUT_DISAGREEMENT','a string claim against a null-registered projection is refused by reading-replay');
  f.setSourceBasis(structuredClone(basis));f.setParents([closed.op_id]);const notParent=await claim();assert.equal(notParent.code,'WORKOUT_BASIS_INVALID','a selection that is not a causal parent is refused by the client before any producer runs');
  f.setProjectionFor(()=>structuredClone(projection));f.setParents([closed.op_id,'source-A']);await claim();
  assert.equal(Object.keys(await opsOf(f)).length,before,'refusals stored nothing');
  f.setProjectionFor(()=>projection);const again=await f.prepared();assert.deepEqual(again.view.source_basis,basis);assert.deepEqual(target(again.view,'demo-leg'),[10,10]);
 }finally{f.close();}
});
