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
  const producer=createReadingReplay({engineFor,projectReadings:createReadingProjector({athleteId:'first',deviceId:'local'}),parseStrictJson,producerIdentity:'synthetic-actual-installed-factories',importBuild:build});
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
