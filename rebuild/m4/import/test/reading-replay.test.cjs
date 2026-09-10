'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {createReadingReplay}=require(process.env.EARNED_REPLAY_CANDIDATE||'../reading-replay.cjs'),{createImportPreparation}=require('../prepare.cjs');
const {createEngine}=require('../../../engine/index.cjs'),F=require('../../../m3/w7-preview/fixtures.cjs'),Ops=require('../../../client/ops.cjs');
const w6=process.env.EARNED_READING_W6_ROOT;if(!w6)throw Error('Provide retained W6 root explicitly');
const day='2026-09-01',build='synthetic-installed-engine',key='synthetic-reading-identity';
const engineFor=({day,hour})=>createEngine({clock:{today:()=>day,nowISO:()=>day+'T12:00:00.000Z',hour:()=>hour},ids:{fresh:p=>p+'synthetic'}});
let n=0;
function op({date='2026-09-04',time='08:00',value=177,device='remote',kind='fact',target,parents=[]}={}){
  return Ops.build({op_id:'reading-'+(++n),athlete_id:'first',device_id:device,device_seq:n,parents,kind,class:'reading',target,lease_id:'synthetic-lease',
    effective:{local_date:date,local_time:time,utc_offset:'-04:00'},payload:kind==='fact'?{lb:{value,unit:'lb'}}:kind==='correction'?{replacement_fields:{lb:{value,unit:'lb'}}}:{reason:'Synthetic removal'}},key);
}
function generation(accepted=[],pending=[]){return {collections:{ops:Object.fromEntries([...accepted,...pending].map(o=>[o.op_id,o])),
  dispositions:Object.fromEntries(accepted.map((o,i)=>[o.op_id,{op_id:o.op_id,canonical_content_commitment:o.canonical_content_commitment,status:'ACCEPTED',athlete_log_seq:i+1}])),
  receipts:Object.fromEntries(accepted.map((o,i)=>[String(i+1),{seq:i+1,op_id:o.op_id,canonical_content_commitment:o.canonical_content_commitment}])),
  outbox:Object.fromEntries(pending.map(o=>[o.op_id,{op_id:o.op_id}])),rejected:{},sync:{frontier:{W:accepted.length,authorityW:accepted.length}}},metadata:{}};}
async function fixture(){
  const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs'))),{createReadingProjector}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/reading-history.mjs')));
  const original=Buffer.from(JSON.stringify(F.createSyntheticState(day))),prep=createImportPreparation({engine:engineFor({day,hour:12}),parseStrictJson}).prepare(original,{localBytes:original});
  const material={source_json:original.toString(),candidate_json:prep.candidateBytes().toString(),local_json:original.toString(),checkpoint_json:JSON.stringify({revision:1,token:'synthetic',generation:generation()}),engine_context_json:JSON.stringify({build,clock:day})};
  const producer=createReadingReplay({engineFor,projectReadings:createReadingProjector({athleteId:'first',deviceId:'local'}),parseStrictJson,producerIdentity:'synthetic-actual-installed-factories',importBuild:build,deviceId:'local'});
  return {producer,material,parseStrictJson,base:prep.candidateState(),input:{sourceId:'synthetic-source',material,generation:generation(),asOf:'2026-09-07'}};
}
// Synthetic receipt fixtures are not authentication; the actual W6 joined
// source witness separately supplies signed recovered originals/material.
test('actual immutable preparation and accepted reading calculate; pending stays outside engine inputs',async()=>{
  const f=await fixture(),a=op(),pending=op({device:'local',value:200}),input={...f.input,generation:generation([a],[pending])},before=structuredClone(input);
  const result=f.producer.project(input),expected=engineFor({day:'2026-09-04',hour:8}).applyRead(f.base,'2026-09-04',177,{hour:8});
  assert.equal(result.ready,true);assert.deepEqual(result.accepted_state,expected);assert.equal(result.accepted_calculation.trend,expected.trend);assert(result.accepted_calculation.trend<f.base.trend);
  assert.deepEqual(result.coverage.accepted_originals.map(r=>r.op_id),[a.op_id]);assert.equal(result.reading_history.records.length,2);
  assert.deepEqual(input,before);assert.equal(result.qualified,false);assert.equal(result.activated,false);
  assert.deepEqual(f.producer.reproduce(input,result),result);result.accepted_state.reads[0].w=999;assert.notEqual(f.producer.project(input).accepted_state.reads[0].w,999);
});
test('accepted correction reconstructs earlier and later effects; local correction does not enter accepted state',async()=>{
  const f=await fixture(),a=op(),b=op({date:'2026-09-05',value:180}),edit=op({kind:'correction',target:a.op_id,parents:[a.op_id],value:181});
  const pending=op({device:'local',kind:'correction',target:a.op_id,parents:[a.op_id,edit.op_id],value:190});
  const result=f.producer.project({...f.input,generation:generation([a,b,edit],[pending])});assert.equal(result.ready,true);
  let expected=engineFor({day:'2026-09-04',hour:8}).applyRead(f.base,'2026-09-04',181,{hour:8});expected=engineFor({day:'2026-09-05',hour:8}).applyRead(expected,'2026-09-05',180,{hour:8});
  assert.deepEqual(result.accepted_state,expected);assert.deepEqual(result.coverage.steps[0].accepted_effect_ids,[edit.op_id]);
  assert.equal(result.accepted_state.reads.find(r=>r.d==='2026-09-04').w,181);assert.equal(result.reading_history.records.find(r=>r.op_id===a.op_id).local.quantity.value,190);
});
test('removing an earlier reading replays later effects instead of restoring its old trend blindly',async()=>{
  const f=await fixture(),a=op(),b=op({date:'2026-09-05',value:180}),remove=op({kind:'tombstone',target:a.op_id,parents:[a.op_id]});
  const before=f.producer.project({...f.input,generation:generation([a,b])}),after=f.producer.project({...f.input,generation:generation([a,b,remove])});
  assert.equal(after.ready,true);const expected=engineFor({day:'2026-09-05',hour:8}).applyRead(f.base,'2026-09-05',180,{hour:8});assert.deepEqual(after.accepted_state,expected);
  const wrong=engineFor({day:'2026-09-07',hour:12}).undoRead(before.accepted_state,'2026-09-04');assert.notEqual(wrong.trend,after.accepted_state.trend);
  assert.equal(after.coverage.steps[0].state,'removed');assert.equal(after.coverage.steps[0].before_sha256,after.coverage.steps[0].after_sha256);
});
test('source checkpoint membership never silently declares an operation already applied',async()=>{
  const f=await fixture(),a=op(),g=generation([a]);f.material.checkpoint_json=JSON.stringify({revision:4,token:'synthetic',generation:g});
  const result=f.producer.project({...f.input,generation:g});assert.equal(result.ready,true);assert.equal(result.coverage.steps.length,1);assert.equal(result.accepted_state.reads.at(-1).w,177);
});
test('the actual original-day hour controls late-reading classification, not the later calculation clock',async()=>{
  const f=await fixture(),a=op({time:'12:00'}),result=f.producer.project({...f.input,generation:generation([a])});
  assert.equal(result.ready,true);assert.equal(result.accepted_state.reads.at(-1).offWindow,true);assert.equal(result.accepted_calculation.trend,f.base.trend);
});
test('source overlap, same-date collisions and backdated order remain explicit with every original',async()=>{
  const f=await fixture();
  for(const accepted of [[op({date:f.base.reads.at(-1).d})],[op(),op({value:178})],[op({date:'2026-09-05'}),op({date:'2026-09-04'})]]){
    const result=f.producer.project({...f.input,generation:generation(accepted)});assert.equal(result.ready,false);assert.equal(result.accepted_state,null);assert.equal(result.accepted_calculation,null);
    assert.equal(result.reading_history.records.length,accepted.length);assert(result.issues.some(i=>['SOURCE_OR_DAILY_READING_OVERLAP','READING_REPLAY_ORDER_UNRESOLVED'].includes(i.code)));
  }
});
test('unmapped context and unsupported recorded time cannot become clean engine inputs',async()=>{
  const f=await fixture(),a=op();a.class='sleep';
  let result=f.producer.project({...f.input,generation:generation([a])});assert(result.issues.some(i=>i.code==='ACCEPTED_ENGINE_CONTEXT_UNMAPPED'));
  const b=op();b.effective.local_time='unknown';result=f.producer.project({...f.input,generation:generation([b])});assert(result.issues.some(i=>i.code==='READING_EFFECTIVE_CONTEXT_UNPROVEN'));
  f.material.engine_context_json='{}';result=f.producer.project(f.input);assert.equal(result.ready,false);assert(result.issues.some(i=>i.code==='SOURCE_PREPARATION_CONTEXT_UNPROVEN'));
});
test('known pending/source overlap or a different native local engine image cannot become accepted coverage',async()=>{
  const f=await fixture(),pending=op({device:'local',date:f.base.reads.at(-1).d});
  let result=f.producer.project({...f.input,generation:generation([],[pending])});assert.equal(result.ready,false);assert(result.issues.some(i=>i.code==='PENDING_SOURCE_OVERLAP_UNRESOLVED'));
  const local=JSON.parse(f.material.local_json);local.trend=190;f.material.local_json=JSON.stringify(local);
  const native=op({device:'local'});f.material.checkpoint_json=JSON.stringify({revision:2,token:'synthetic',generation:generation([],[native])});
  f.material.candidate_json=createImportPreparation({engine:engineFor({day,hour:12}),parseStrictJson:f.parseStrictJson}).prepare(Buffer.from(f.material.source_json),{localBytes:Buffer.from(f.material.local_json)}).candidateBytes().toString();
  result=f.producer.project({...f.input,generation:generation([],[native])});assert.equal(result.ready,false);assert(result.issues.some(i=>i.code==='SOURCE_LOCAL_ENGINE_COVERAGE_UNPROVEN'));
});
test('changed candidate or supplied checkpoint coverage must reproduce actual source execution',async()=>{
  const f=await fixture(),input={...f.input,generation:generation([op()])},saved=f.producer.project(input);
  const changed=structuredClone(saved);changed.coverage.steps=[];assert.throws(()=>f.producer.reproduce(input,changed),{code:'READING_REPLAY_CHECKPOINT_MISMATCH'});
  const wrong=JSON.parse(f.material.candidate_json);wrong.trend=999;f.material.candidate_json=JSON.stringify(wrong);
  assert.throws(()=>f.producer.project(input),{code:'SOURCE_PREPARATION_REPRODUCTION_MISMATCH'});
});

async function lineageFixture(){
  const f=await fixture(),sourceOp=(source_id,type='source-import-intent',target_activation_id)=>Ops.build({op_id:'source-'+(++n),athlete_id:'first',device_id:'remote',device_seq:n,parents:[],kind:'fact',class:'event',lease_id:'synthetic-lease',
    effective:{local_date:'2026-09-04',local_time:'08:00',utc_offset:'-04:00'},payload:{type,source_id,...(target_activation_id?{target_activation_id}:{}),interval:{start:'2026-09-04',end:'2026-09-04'},material_digest:'synthetic-unverified'}},key);
  const first=sourceOp(f.input.sourceId),a=op(),pending=op({device:'local',value:188}),before=generation([first,a],[pending]);
  const old=f.producer.project({...f.input,generation:before,asOf:'2026-09-04'});assert.equal(old.ready,true);
  const incoming=JSON.parse(f.material.source_json);incoming.dailyLogs['2026-08-30'].cal=2400;
  const imported=Buffer.from(JSON.stringify(incoming)),local=Buffer.from(JSON.stringify(old.accepted_state)),nextDay='2026-09-04';
  const prep=createImportPreparation({engine:engineFor({day:nextDay,hour:12}),parseStrictJson:f.parseStrictJson}).prepare(imported,{localBytes:local});
  const material={source_json:imported.toString(),local_json:local.toString(),candidate_json:prep.candidateBytes().toString(),checkpoint_json:JSON.stringify({revision:2,token:'synthetic',generation:before}),engine_context_json:JSON.stringify({build,clock:nextDay})};
  const second=sourceOp('second-source'),b=op({date:'2026-09-05',value:180}),edit=op({date:'2026-09-06',kind:'correction',target:a.op_id,parents:[a.op_id],value:181});
  const selection=(operation,seq,before,action='activate',target_activation_id=null)=>({type:'selection',action,source_id:operation.payload.source_id,intent_op_id:operation.op_id,commitment:operation.canonical_content_commitment,seq,before,target_activation_id});
  const nodes=new Map([[first.op_id,{selection:selection(first,1,{W:0,selection_id:null}),material:f.material}],
    [second.op_id,{selection:selection(second,3,{W:2,selection_id:first.op_id}),material}]]);
  const g=generation([first,a,second,b,edit],[pending]);
  return {...f,first,second,a,b,edit,pending,nodes,material,incoming,g,sourceOp,selection,
    input:{selectionId:second.op_id,generation:g,asOf:'2026-09-07',readSelectedSource:async id=>structuredClone(nodes.get(id)),assertCurrent:async()=>{}}};
}
test('native local image is reproduced and inherited corrections rebuild before a subsequent merge',async()=>{
  const f=await lineageFixture(),value=await f.producer.projectLineage(f.input);assert.equal(value.ready,true,JSON.stringify(value.issues));
  let expected=engineFor({day:'2026-09-04',hour:8}).applyRead(f.base,'2026-09-04',181,{hour:8});
  expected=createImportPreparation({engine:engineFor({day:'2026-09-04',hour:12}),parseStrictJson:f.parseStrictJson}).prepare(Buffer.from(JSON.stringify(f.incoming)),{localBytes:Buffer.from(JSON.stringify(expected))}).candidateState();
  expected=engineFor({day:'2026-09-05',hour:8}).applyRead(expected,'2026-09-05',180,{hour:8});
  assert.deepEqual(value.accepted_state,expected);assert.deepEqual(value.coverage.steps.map(x=>x.op_id),[f.a.op_id,f.b.op_id]);
  assert.equal(value.workout_baseline?.source_generation_id,f.second.payload.source_id);
  assert.equal(value.workout_baseline.activation_op_id,f.second.op_id);
  assert.strictEqual(value.workout_baseline.session_log,value.accepted_state.sessionLog);
  const cloned=structuredClone(value);assert.strictEqual(cloned.workout_baseline.session_log,cloned.accepted_state.sessionLog);
  assert.equal(value.coverage.workout_source.original_checkpoint_W,2);
  assert.equal(value.coverage.source_lineage.length,1);assert.equal(value.reading_history.records.length,3);
  assert.deepEqual(await f.producer.projectLineage(f.input),value);assert.equal(value.activated,false);assert.equal(value.qualified,false);
});
test('rollback selects the target activation source and preserves all later accepted and pending originals',async()=>{
  const f=await lineageFixture(),rollback=f.sourceOp(f.first.payload.source_id,'source-rollback-intent',f.first.op_id),g=generation([f.first,f.a,f.second,f.b,f.edit,rollback],[f.pending]);
  f.nodes.set(rollback.op_id,{selection:f.selection(rollback,6,{W:5,selection_id:f.second.op_id},'rollback',f.first.op_id),material:f.nodes.get(f.first.op_id).material});
  let value;await assert.doesNotReject(async()=>{value=await f.producer.projectLineage({...f.input,selectionId:rollback.op_id,generation:g});},'Actual rollback must resolve its original activation');assert.equal(value.ready,true,JSON.stringify(value.issues));
  let expected=engineFor({day:'2026-09-04',hour:8}).applyRead(f.base,'2026-09-04',181,{hour:8});expected=engineFor({day:'2026-09-05',hour:8}).applyRead(expected,'2026-09-05',180,{hour:8});
  assert.deepEqual(value.accepted_state,expected);assert.equal(value.coverage.selected_intent_id,rollback.op_id);assert.equal(value.coverage.accepted_originals.length,6);
  assert.equal(value.workout_baseline?.activation_op_id,f.first.op_id,'Rollback binds original activation, not later intent');
  assert.equal(value.workout_baseline.source_generation_id,f.first.payload.source_id);
  assert.strictEqual(value.workout_baseline.session_log,value.accepted_state.sessionLog);
  assert.deepEqual(value.coverage.workout_source,{source_id:f.first.payload.source_id,activation_op_id:f.first.op_id,selected_intent_id:rollback.op_id,
    selected_action:'rollback',original_checkpoint_W:0,material_sha256:value.coverage.material_sha256});
  assert.equal(value.reading_history.records.length,3);assert.deepEqual(g.collections.ops[f.pending.op_id],f.pending);
});
test('different local bytes and checkpoint originals refuse native lineage even with a supplied selection',async()=>{
  const f=await lineageFixture(),entry=f.nodes.get(f.second.op_id),before=entry.material.local_json,oldCandidate=entry.material.candidate_json,changed=JSON.parse(before);changed.trend=999;entry.material.local_json=JSON.stringify(changed);
  entry.material.candidate_json=createImportPreparation({engine:engineFor({day:'2026-09-04',hour:12}),parseStrictJson:f.parseStrictJson}).prepare(Buffer.from(entry.material.source_json),{localBytes:Buffer.from(entry.material.local_json)}).candidateBytes().toString();
  await assert.rejects(f.producer.projectLineage(f.input),{code:'SOURCE_LINEAGE_LOCAL_IMAGE_MISMATCH'});entry.material.local_json=before;entry.material.candidate_json=oldCandidate;
  const cp=JSON.parse(entry.material.checkpoint_json);cp.generation.collections.ops[f.a.op_id].payload.lb.value=999;entry.material.checkpoint_json=JSON.stringify(cp);
  await assert.rejects(f.producer.projectLineage(f.input),{code:'SOURCE_LINEAGE_CHECKPOINT_ORIGINAL'});
});
test('workout source binding cannot arise from bare material or an unmapped accepted context; returned aliases stay owned',async()=>{
  const plain=await fixture(),bare=plain.producer.project(plain.input);assert.equal(bare.ready,true);assert.equal(bare.workout_baseline,undefined);
  const f=await lineageFixture(),before=structuredClone(f.nodes),result=await f.producer.projectLineage(f.input),day=Object.keys(result.accepted_state.sessionLog)[0];
  const originalWeight=result.accepted_state.sessionLog[day].entries[0].w;
  result.workout_baseline.session_log[day].entries[0].w=999;assert.equal(result.accepted_state.sessionLog[day].entries[0].w,999,'One owned returned snapshot');
  const fresh=await f.producer.projectLineage(f.input);assert.equal(fresh.workout_baseline.session_log[day].entries[0].w,originalWeight);assert.deepEqual(f.nodes,before);
  const unsupported=op();unsupported.class='sleep';const g=generation([f.first,f.a,f.second,f.b,f.edit,unsupported],[f.pending]);
  const refused=await f.producer.projectLineage({...f.input,generation:g});assert.equal(refused.ready,false);assert.equal(refused.accepted_state,null);assert.equal(refused.workout_baseline,null);
  assert(refused.issues.some(i=>i.code==='ACCEPTED_ENGINE_CONTEXT_UNMAPPED'));
});
test('lineage requires exact checkpoint receipt prefix and an unchanged final context',async()=>{
  const f=await lineageFixture(),entry=f.nodes.get(f.second.op_id),before=entry.material.checkpoint_json,cp=JSON.parse(before);
  delete cp.generation.collections.receipts['1'];entry.material.checkpoint_json=JSON.stringify(cp);
  await assert.rejects(f.producer.projectLineage(f.input),{code:'SOURCE_LINEAGE_CHECKPOINT_PREFIX'});entry.material.checkpoint_json=before;
  let retired=false;const readSelectedSource=async id=>{const value=structuredClone(f.nodes.get(id));retired=true;return value;};
  await assert.rejects(f.producer.projectLineage({...f.input,readSelectedSource,assertCurrent:async()=>{if(retired){const e=new Error('retired');e.code='LOCAL_RECOVERY_CHANGED';throw e;}}}),{code:'LOCAL_RECOVERY_CHANGED'});
});
test('a third selected source reproduces both ancestors before applying a later inherited correction',async()=>{
  const f=await lineageFixture(),previous=await f.producer.projectLineage(f.input),incoming=JSON.parse(f.nodes.get(f.first.op_id).material.source_json);
  incoming.dailyLogs['2026-08-29'].cal=2500;const source=Buffer.from(JSON.stringify(incoming)),local=Buffer.from(JSON.stringify(previous.accepted_state));
  const prepared=createImportPreparation({engine:engineFor({day:'2026-09-06',hour:12}),parseStrictJson:f.parseStrictJson}).prepare(source,{localBytes:local});
  const third=f.sourceOp('third-source'),later=op({date:'2026-09-07',kind:'correction',target:f.a.op_id,parents:[f.a.op_id,f.edit.op_id],value:180});
  f.nodes.set(third.op_id,{selection:f.selection(third,6,{W:5,selection_id:f.second.op_id}),material:{source_json:source.toString(),candidate_json:prepared.candidateBytes().toString(),local_json:local.toString(),
    checkpoint_json:JSON.stringify({revision:3,token:'synthetic',generation:f.g}),engine_context_json:JSON.stringify({build,clock:'2026-09-06'})}});
  const value=await f.producer.projectLineage({...f.input,selectionId:third.op_id,generation:generation([f.first,f.a,f.second,f.b,f.edit,third,later],[f.pending])});
  assert.equal(value.ready,true,JSON.stringify(value.issues));assert.equal(value.coverage.source_lineage.length,2);
  assert.deepEqual(value.coverage.steps.map(x=>x.op_id),[f.a.op_id,f.b.op_id]);assert.equal(value.accepted_state.reads.find(r=>r.d==='2026-09-04').w,180);
  let expected=engineFor({day:'2026-09-04',hour:8}).applyRead(f.base,'2026-09-04',180,{hour:8});
  const merge=(source,local,day)=>createImportPreparation({engine:engineFor({day,hour:12}),parseStrictJson:f.parseStrictJson}).prepare(Buffer.from(JSON.stringify(source)),{localBytes:Buffer.from(JSON.stringify(local))}).candidateState();
  expected=merge(f.incoming,expected,'2026-09-04');expected=engineFor({day:'2026-09-05',hour:8}).applyRead(expected,'2026-09-05',180,{hour:8});expected=merge(incoming,expected,'2026-09-06');
  assert.deepEqual(value.accepted_state,expected);
});
function dailyOp({cls='food-day',payload={kcal:{value:2200,unit:'kcal'},protein_g:{value:150,unit:'g'}},date='2026-09-04',kind='fact',target,parents=[],device='remote'}={}){
 return Ops.build({op_id:'daily-'+(++n),athlete_id:'first',device_id:device,device_seq:n,parents,kind,class:cls,target,lease_id:'synthetic-lease',
  effective:{local_date:date,local_time:'08:00',utc_offset:'-04:00'},payload},key);
}
test('accepted food and steps use the actual partial daily writer alongside readings; pending never enters it',async()=>{
 const f=await fixture(),food=dailyOp(),steps=dailyOp({cls:'steps',payload:{count:{value:8000,unit:'step'}}}),read=op({date:'2026-09-05'}),
  pending=dailyOp({device:'local',kind:'correction',target:food.op_id,parents:[food.op_id],payload:{replacement_fields:{kcal:{value:999,unit:'kcal'}}}});
 const input={...f.input,generation:generation([food,steps,read],[pending])},before=structuredClone(input),v=f.producer.project(input);
 assert.equal(v.ready,true,JSON.stringify(v.issues));let expected=engineFor({day:'2026-09-04',hour:8}).writeDaily(f.base,'2026-09-04',{cal:2200,pro:150});
 expected=engineFor({day:'2026-09-04',hour:8}).writeDaily(expected,'2026-09-04',{steps:8000});
 expected=engineFor({day:'2026-09-05',hour:8}).applyRead(expected,'2026-09-05',177,{hour:8});
 assert.deepEqual(v.accepted_state,expected);assert.deepEqual(v.coverage.steps.map(x=>x.op_id),[food.op_id,steps.op_id,read.op_id]);
 assert.equal(v.daily_history.records[0].local.values.cal,999);assert.equal(v.daily_history.records[0].accepted.values.cal,2200);
 assert.deepEqual(input,before);assert.deepEqual(f.producer.reproduce(input,v),v);assert.equal(v.qualified,false);
});
test('daily partial correction preserves missing members and explicit zero/null values',async()=>{
 const f=await fixture(),food=dailyOp(),correction=dailyOp({kind:'correction',target:food.op_id,parents:[food.op_id],payload:{replacement_fields:{protein_g:{value:0,unit:'g'}}}});
 let v=f.producer.project({...f.input,generation:generation([food,correction])});assert.equal(v.ready,true);
 assert.deepEqual(v.accepted_state.dailyLogs['2026-09-04'],{cal:2200,pro:0});
 assert.deepEqual(v.accepted_state,engineFor({day:'2026-09-04',hour:8}).writeDaily(f.base,'2026-09-04',{cal:2200,pro:0}));
 const cleared=dailyOp({kind:'correction',target:food.op_id,parents:[food.op_id,correction.op_id],payload:{replacement_fields:{protein_g:null}}});
 v=f.producer.project({...f.input,generation:generation([food,correction,cleared])});assert.equal(v.ready,true);assert.deepEqual(v.accepted_state.dailyLogs['2026-09-04'],{cal:2200,pro:null});
 const onlyCal=dailyOp({payload:{kcal:{value:0,unit:'kcal'}}});v=f.producer.project({...f.input,generation:generation([onlyCal])});
 assert.equal(v.ready,true);assert.deepEqual(v.accepted_state.dailyLogs['2026-09-04'],{cal:0});assert(!Object.hasOwn(v.accepted_state.dailyLogs['2026-09-04'],'pro'));
});
test('removing an earlier daily fact rebuilds later writer side effects and keeps unrelated same-day fields',async()=>{
 const f=await fixture(),food=dailyOp({payload:{protein_g:{value:0,unit:'g'}}}),later=dailyOp({date:'2026-09-05',payload:{protein_g:{value:300,unit:'g'}}}),
 steps=dailyOp({cls:'steps',payload:{count:{value:0,unit:'step'}}}),remove=dailyOp({kind:'tombstone',target:food.op_id,parents:[food.op_id],payload:{reason:'Synthetic correction'}});
 const v=f.producer.project({...f.input,generation:generation([food,steps,later,remove])});assert.equal(v.ready,true);
 let expected=engineFor({day:'2026-09-04',hour:8}).writeDaily(f.base,'2026-09-04',{steps:0});expected=engineFor({day:'2026-09-05',hour:8}).writeDaily(expected,'2026-09-05',{pro:300});
 assert.deepEqual(v.accepted_state,expected);assert.equal(v.coverage.steps[0].state,'removed');assert.equal(v.daily_history.records[0].original.op_id,food.op_id);
 assert.deepEqual(v.accepted_state.dailyLogs['2026-09-04'],{steps:0});
});
test('daily concurrent edits, missing causal target, unsupported units/status and duplicate fields remain unresolved',async()=>{
 const f=await fixture(),food=dailyOp(),edit=dailyOp({kind:'correction',target:food.op_id,parents:[food.op_id],payload:{replacement_fields:{kcal:{value:2000,unit:'kcal'}}}}),
 other=dailyOp({kind:'correction',target:food.op_id,parents:[food.op_id],payload:{replacement_fields:{kcal:{value:2100,unit:'kcal'}}}});
 for(const ops of [[food,edit,other],[food,dailyOp({kind:'correction',target:food.op_id,payload:{replacement_fields:{kcal:{value:2100,unit:'kcal'}}}})],
  [dailyOp({payload:{kcal:{value:2200,unit:'kJ'}}})],[dailyOp({payload:{missing_total_status:'not-observed'}})],[food,dailyOp()],
  [dailyOp({cls:'steps',payload:{count:{value:1.5,unit:'step'}}})]]){
  const v=f.producer.project({...f.input,generation:generation(ops)});assert.equal(v.ready,false);assert.equal(v.accepted_state,null);assert(v.daily_history.records.length);
 }
});
test('daily source overlap and foreign pending records cannot be guessed into the engine',async()=>{
 const f=await fixture(),date=Object.keys(f.base.dailyLogs)[0],food=dailyOp({date,payload:{kcal:{value:2200,unit:'kcal'}}});
 let v=f.producer.project({...f.input,generation:generation([food])});assert.equal(v.ready,false);assert(v.issues.some(x=>x.code==='SOURCE_OR_DAILY_FIELD_OVERLAP'));
 const local=dailyOp({date,device:'local',payload:{kcal:{value:2200,unit:'kcal'}}});
 v=f.producer.project({...f.input,generation:generation([],[local])});assert.equal(v.ready,false);assert(v.issues.some(x=>x.code==='PENDING_DAILY_SOURCE_OVERLAP_UNRESOLVED'));
 const foreign=dailyOp({device:'another-device'});v=f.producer.project({...f.input,generation:generation([],[foreign])});
 assert.equal(v.daily_history.records[0].status,'unresolved');assert.deepEqual(v.accepted_state,f.base);
});

test('removed daily originals retain fields introduced by an accepted correction in their lineage coverage',async()=>{
 const f=await fixture(),food=dailyOp({payload:{kcal:{value:2200,unit:'kcal'}}}),
 edit=dailyOp({kind:'correction',target:food.op_id,parents:[food.op_id],payload:{replacement_fields:{protein_g:{value:150,unit:'g'}}}}),
 remove=dailyOp({kind:'tombstone',target:food.op_id,parents:[food.op_id,edit.op_id],payload:{reason:'Synthetic removal'}});
 const v=f.producer.project({...f.input,generation:generation([food,edit,remove])});assert.equal(v.ready,true);
 assert.deepEqual(v.coverage.steps[0].daily_fields,['cal','pro'],'REMOVED_DAILY_LINEAGE_KEEPS_ACCEPTED_ADDED_FIELDS');
 assert.deepEqual(v.accepted_state,f.base);
});
test('native daily lineage reproduces original local image then rebuilds a later correction/removal before the next merge',async()=>{
 const f=await lineageFixture(),accepted=Object.values(f.g.collections.receipts).map(r=>f.g.collections.ops[r.op_id]),
 food=dailyOp({date:'2026-09-06'}),steps=dailyOp({cls:'steps',date:'2026-09-06',payload:{count:{value:8000,unit:'step'}}}),before=generation([...accepted,food,steps],[f.pending]);
 const prior=await f.producer.projectLineage({...f.input,generation:before});assert.equal(prior.ready,true,JSON.stringify(prior.issues));
 const incoming=JSON.parse(f.nodes.get(f.first.op_id).material.source_json);incoming.dailyLogs['2026-08-29'].cal=2400;
 const source=Buffer.from(JSON.stringify(incoming)),local=Buffer.from(JSON.stringify(prior.accepted_state)),prep=createImportPreparation({engine:engineFor({day:'2026-09-06',hour:12}),parseStrictJson:f.parseStrictJson}).prepare(source,{localBytes:local});
 const third=f.sourceOp('third-daily-source'),cut=accepted.length+2;
 f.nodes.set(third.op_id,{selection:f.selection(third,cut+1,{W:cut,selection_id:f.second.op_id}),material:{source_json:source.toString(),candidate_json:prep.candidateBytes().toString(),local_json:local.toString(),
  checkpoint_json:JSON.stringify({revision:3,token:'synthetic',generation:before}),engine_context_json:JSON.stringify({build,clock:'2026-09-06'})}});
 const edit=dailyOp({date:'2026-09-07',kind:'correction',target:food.op_id,parents:[food.op_id],payload:{replacement_fields:{kcal:{value:2300,unit:'kcal'}}}}),
 remove=dailyOp({cls:'steps',date:'2026-09-07',kind:'tombstone',target:steps.op_id,parents:[steps.op_id],payload:{reason:'Synthetic removal'}});
 const g=generation([...accepted,food,steps,third,edit,remove],[f.pending]);
 const v=await f.producer.projectLineage({...f.input,selectionId:third.op_id,generation:g});assert.equal(v.ready,true,JSON.stringify(v.issues));
 let expected=(await f.producer.projectLineage(f.input)).accepted_state;
 expected=engineFor({day:'2026-09-06',hour:8}).writeDaily(expected,'2026-09-06',{cal:2300,pro:150});
 expected=createImportPreparation({engine:engineFor({day:'2026-09-06',hour:12}),parseStrictJson:f.parseStrictJson}).prepare(source,{localBytes:Buffer.from(JSON.stringify(expected))}).candidateState();
 assert.deepEqual(v.accepted_state,expected);assert.deepEqual(v.coverage.steps.map(s=>s.op_id),[f.a.op_id,f.b.op_id,food.op_id,steps.op_id]);
 assert.equal(v.coverage.source_lineage.length,2);assert(!Object.hasOwn(v.accepted_state.dailyLogs['2026-09-06'],'steps'));
 assert.deepEqual(await f.producer.projectLineage({...f.input,selectionId:third.op_id,generation:g}),v);
 const collided=f.nodes.get(third.op_id).material,incomingCollision=JSON.parse(collided.source_json);
 incomingCollision.dailyLogs['2026-09-06']={cal:2000};collided.source_json=JSON.stringify(incomingCollision);
 collided.candidate_json=createImportPreparation({engine:engineFor({day:'2026-09-06',hour:12}),parseStrictJson:f.parseStrictJson}).prepare(Buffer.from(collided.source_json),{localBytes:local}).candidateBytes().toString();
 await assert.rejects(f.producer.projectLineage({...f.input,selectionId:third.op_id,generation:g}),{code:'SOURCE_NATIVE_DAILY_IMPORT_OVERLAP_UNRESOLVED'});
});
