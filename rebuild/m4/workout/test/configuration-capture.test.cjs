'use strict';
// Actual retained readers and wholly invented W7 facts. No private seed, writer
// execution, issuance, accepted-history authentication or scientific verdict.
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const Adapter=require(process.env.EARNED_CONFIGURATION_ADAPTER||'../engine-capture.cjs');
const F=require('../../../m3/w7-preview/fixtures.cjs'),Browser=require('../../../m3/w7-preview/browser-engine.cjs');
const Writers=require('../../../engine/writers.cjs');
const w6=process.env.PERFORMED_W6_DIR;if(!w6)throw Error('Provide retained PERFORMED_W6_DIR');
async function fixture(profile=Adapter.CONFIGURATION_PROFILE){
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs')));
 const Capture=require(path.join(w6,'rebuild/m4/workout/capture.cjs'));
 const clock={today:()=>F.SYNTHETIC_DAY,nowISO:()=>F.SYNTHETIC_DAY+'T12:00:00.000Z',hour:()=>12};
 const engine=Browser.createBrowserEngine({clock});
 Object.assign(engine,Writers(engine,{clock,ids:{next(){throw Error('Unexpected writer');}},drafts:{length:0,key:()=>null}}));
 const producer={app_build:'synthetic-configuration-capture-test',engine_build:'retained-installed-readers-cd543b7',rule_profile:profile,source_schema:'synthetic-complete-engine-input'};
 const adapter=Adapter.createEngineWorkoutCapture({engine,prescriptionCapture:Capture.createPrescriptionCapture({parseStrictJson}),producerIdentity:producer});
 const input={state:F.createSyntheticState(),day:F.SYNTHETIC_DAY,basis:{plan_basis:'synthetic-original-plan',input_basis:'synthetic-input',source_revision:1}};
 return {engine,adapter,input};
}
test('actual configurations retain exact identity, display, target positions and input bytes',async()=>{
 const {engine,adapter,input}=await fixture();
 for(const key of ['BW','hold','55·55·50','0',' BW ','cable:α🟦']){
  input.state.exercises[0].w=key;const before=JSON.stringify(input),card=engine.genSession(input.state,input.day).ex[0],out=adapter.prepare(input);
  const slots=out.capture.slots.slice(0,2);
  assert.deepEqual(slots.map(s=>JSON.parse(s.load.source_json)),[0,1].map(()=>({kind:'configuration',configuration_key:key})),'EXACT_CONFIG_SOURCE');
  assert(slots.every(s=>s.load.display===key),'EXACT_CONFIG_DISPLAY');
  assert.deepEqual(slots.map(s=>JSON.parse(s.reps.source_json).value),card.tgt);
  assert.deepEqual(out.layout.slots.slice(0,2).map(s=>s.prescribed_load),[0,1].map(()=>({state:'specified',source:{kind:'configuration',configuration_key:key}})),'TYPED_CONFIG_LAYOUT');
  assert.equal(out.layout.profile,'earned/captured-lift-layout/v2','NEW_LAYOUT_PROFILE');
  assert.equal(out.layout.correspondence_profile,Adapter.CONFIGURATION_PROFILE);
  assert.deepEqual(adapter.readLayout(out.capture),out.layout);assert.equal(JSON.stringify(input),before);
 }
});
test('actual legacy progress anchor uses exact wKey, never null numeric load or another configuration',async()=>{
 const {engine,input}=await fixture(),ex=input.state.exercises[0];ex.w='BW';ex.last=[4,3];
 input.state.sessionLog={[F.dayOffset(input.day,-1)]:{entries:[{id:ex.id,w:null,wKey:'BW',reps:[11,9]}]}};
 assert.deepEqual(engine.progressAnchor(ex,input.state),[11,9]);
 const entry=Object.values(input.state.sessionLog)[0].entries[0];entry.wKey=' BW ';
 assert.deepEqual(engine.progressAnchor(ex,input.state),[4,3]);delete entry.wKey;
 assert.deepEqual(engine.progressAnchor(ex,input.state),[4,3]);entry.w='BW';
 assert.deepEqual(engine.progressAnchor(ex,input.state),[4,3]);
});
test('v1 stays numeric-only and retains its exact old layout shape',async()=>{
 const old=await fixture(Adapter.PROFILE),current=await fixture();
 const before=old.adapter.prepare(old.input),numeric=current.adapter.prepare(current.input);
 assert.equal(before.layout.profile,'earned/captured-lift-layout/v1','V1_LAYOUT_PROFILE');
 assert(before.layout.slots.every(s=>!Object.hasOwn(s,'prescribed_load')),'V1_LAYOUT_UNCHANGED');
 assert.deepEqual(old.adapter.readLayout(before.capture),before.layout);
 assert.deepEqual(before.capture.slots,numeric.capture.slots);
 old.input.state.exercises[0].w='BW';
 assert.throws(()=>old.adapter.prepare(old.input),{code:'ENGINE_CAPTURE_LOAD_UNPROVEN'},'V1_CONFIG_REFUSED');
 assert.throws(()=>old.adapter.readLayout(numeric.capture),{code:'WORKOUT_CAPTURE_INVALID'});
 assert.throws(()=>current.adapter.readLayout(before.capture),{code:'WORKOUT_CAPTURE_INVALID'});
});
test('new profile preserves numeric mixed vectors, numeric zero and baseline distinction',async()=>{
 const {adapter,input}=await fixture(),ex=input.state.exercises[0];ex.wSets=[40,0];
 const out=adapter.prepare(input);assert.deepEqual(out.layout.slots.slice(0,2).map(s=>s.prescribed_load),[40,0].map(value=>({state:'specified',source:{value,unit:'lb'}})));
 assert.deepEqual(adapter.readLayout(out.capture),out.layout);
 delete ex.wSets;ex.w=null;ex.last=null;const baseline=adapter.prepare(input);
 assert.deepEqual(baseline.layout.slots.slice(0,2).map(s=>s.prescribed_load),[{state:'not_prescribed'},{state:'not_prescribed'}]);
 assert.deepEqual(adapter.readLayout(baseline.capture),baseline.layout);
});
test('actual selected configured debut uses the selected new key and retains original capture across change',async()=>{
 const {engine,adapter,input}=await fixture(),ex=input.state.exercises[0];ex.w='BW';
 const q={id:'synthetic-config-debut',kind:'debut',state:'DEBUT',done:false,exId:ex.id,newW:'hold',t:'Synthetic configured debut'};input.state.queue.push(q);
 assert.equal(engine.genSession(input.state,input.day).ex[0].w,'hold');const original=structuredClone(input),out=adapter.prepare(input);
 assert.equal(JSON.parse(out.capture.slots[0].load.source_json).configuration_key,'hold','SELECTED_DEBUT_KEY');
 assert.deepEqual(adapter.resolveLayout({start:{prescription_capture:out.capture},originalInput:original}),out.layout);
 q.newW=' BW ';assert.equal(JSON.parse(adapter.prepare(input).capture.slots[0].load.source_json).configuration_key,' BW ');
 assert.deepEqual(adapter.readLayout(out.capture),out.layout);
 assert.throws(()=>adapter.resolveLayout({start:{prescription_capture:out.capture},originalInput:input}),{code:'ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT'});
 q.newW=null;assert.equal(JSON.parse(adapter.prepare(input).capture.slots[0].load.source_json).configuration_key,'BW');
});
test('configuration never flattens an existing or debut load vector and ambiguous selection refuses',async()=>{
 const {adapter,input}=await fixture(),ex=input.state.exercises[0];ex.w='BW';ex.wSets=[40,35];
 assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'},'CONFIG_VECTOR_CONFLICT');delete ex.wSets;
 const q={id:'synthetic-config-debut',kind:'debut',state:'DEBUT',done:false,exId:ex.id,newW:'hold',newWSets:[40,35],t:'Synthetic configured debut'};input.state.queue.push(q);
 assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'},'CONFIG_DEBUT_VECTOR_CONFLICT');delete q.newWSets;
 input.state.queue.unshift({...q,id:'synthetic-proposed',state:'PROPOSED'});
 assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
});
test('invalid source configurations and numeric vectors refuse without changing input',async()=>{
 const {adapter,input}=await fixture(),ex=input.state.exercises[0];
 for(const value of ['', ' \t\n ',true,{},NaN,Infinity,-1,-0]){
  ex.w=value;const before=structuredClone(input);assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_UNPROVEN'});assert.deepEqual(input,before);
 }
 ex.w=40;
 for(const vector of [[40],[40,-0],[40,'BW'],[40,NaN],new Array(2)]){ex.wSets=vector;assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});}
});
test('registered new load interpretation rejects changed display, unknown state and malformed source',async()=>{
 const {adapter,input}=await fixture();input.state.exercises[0].w='BW';const {capture}=adapter.prepare(input);
 for(const mutate of [c=>{c.display='BW lb';},c=>{c.source_json='{"kind":"configuration","configuration_key":"hold"}';},
  c=>{c.source_json='{"kind":"configuration","configuration_key":"BW","extra":1}';},
  c=>{c.source_json='{"kind":"configuration","configuration_key":" "}';},
  c=>{c.source_json='{"value":"BW","unit":"lb"}';},c=>{c.state='unknown';c.source_json=null;},
  c=>{c.state='not_prescribed';c.source_json=null;}]){
  const changed=structuredClone(capture);mutate(changed.slots[0].load);
  assert.throws(()=>adapter.readLayout(changed),{code:'ENGINE_CAPTURE_PROFILE_INVALID'},'CONFIG_CELL_COHERENCE');
 }
 const duplicate=structuredClone(capture);duplicate.slots[0].load.source_json='{"kind":"configuration","configuration_key":"BW","configuration_key":"hold"}';
 assert.throws(()=>adapter.readLayout(duplicate),{code:'WORKOUT_CAPTURE_INVALID'});
});
test('new numeric load interpretation rejects false quantities and retains original JSON spelling',async()=>{
 const {adapter,input}=await fixture(),{capture}=adapter.prepare(input);
 for(const source_json of ['{"value":-0,"unit":"lb"}','{"value":40,"unit":"kg"}','{"value":40,"unit":"lb","extra":0}','{"value":null,"unit":"lb"}']){
  const changed=structuredClone(capture);changed.slots[0].load.source_json=source_json;assert.throws(()=>adapter.readLayout(changed),{code:'ENGINE_CAPTURE_PROFILE_INVALID'});
 }
 const spelling=structuredClone(capture);spelling.slots[0].load.source_json=' { "unit": "lb", "value": 40.00 } ';
 const before=JSON.stringify(spelling);assert.deepEqual(adapter.readLayout(spelling),adapter.readLayout(capture));assert.equal(JSON.stringify(spelling),before);
});
test('configuration capture and reconstructed layout own their output independently',async()=>{
 const {adapter,input}=await fixture();input.state.exercises[0].w='BW';const out=adapter.prepare(input),before=JSON.stringify(out.capture);
 out.layout.slots[0].prescribed_load.source.configuration_key='changed';
 assert.equal(JSON.stringify(out.capture),before);
 assert.equal(adapter.readLayout(out.capture).slots[0].prescribed_load.source.configuration_key,'BW');
 const spelling=structuredClone(out.capture);spelling.slots[0].load.source_json=' { "configuration_key":"BW", "kind":"configuration" } ';
 const retained=JSON.stringify(spelling);assert.deepEqual(adapter.readLayout(spelling),adapter.readLayout(out.capture));assert.equal(JSON.stringify(spelling),retained);
});
