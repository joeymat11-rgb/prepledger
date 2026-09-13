import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from 'fake-indexeddb';
import {createLocalSourceFixture,fixtureEffective,appendCompletedWorkout} from '../../../m4/import/test/s3/fixtures.mjs';
import Food from '../../w7-preview/today/food-commands.cjs';
import Ops from '../../../client/ops.cjs';
import {readLocalEra} from '../local/local-era.mjs';
const fixture=async(t,options={})=>{const f=await createLocalSourceFixture({indexedDB:new IDBFactory(),crypto:webcrypto,databaseName:'s3-admission',...options});t.after(()=>f.close());return f;};
const prepare=async f=>f.controller.prepareSource(await f.review(),{identityConfirmed:true,prefixAnswer:true});
test('S3-Q-OWNERSHIP: serialized qualification cannot become a live controller handle',async()=>{
 assert.ok(existsSync(new URL('../local/source-admission.mjs',import.meta.url)),'S3 admission controller is implemented');
 const {assertLocalSourceQualification}=await import('../local/source-admission.mjs');
 for(const handle of [null,{},Object.freeze({profile:'earned/local-source-qualification/v1',ready:true,qualified:true})])
  assert.throws(()=>assertLocalSourceQualification(handle),{code:'LOCAL_SOURCE_QUALIFICATION_UNOWNED'});
});
test('S3-Q-FAMILIES: actual readings, whole food answers and retained setup/cue/checkin/history share the reproduced source',async t=>{
 const f=await fixture(t),before=await f.repository.load(),h=await prepare(f),v=await f.controller.view(h);
 assert.equal(v.state.reads.find(r=>r.d==='2026-09-04').w,173.25);
 assert.equal(v.state.dailyLogs['2026-09-04'].cal,2300);assert.equal(v.state.dailyLogs['2026-09-04'].pro,175);
 assert.equal(v.state.sleep.nights.length,f.state.sleep.nights.length);
 assert.deepEqual(v.state.decisions,f.state.decisions);
 assert.equal(v.workout_baseline.session_log,v.state.sessionLog,'One shared imported sessionLog');
 assert.equal(v.order_map,null,'Empty-side control must not manufacture an athlete prefix attestation');
 for(const family of ['F1','F2','F4','F5','F6'])assert.ok(v.families.some(row=>row.family===family));
 assert.equal(v.retained.find(op=>op.op_id==='TEST-ONLY-machine').payload.machine.settings[0].value,'four');
 assert.deepEqual((await f.repository.load()).generation,before.generation,'Preparation is inactive');
});
test('S3-Q-ORIGINAL-HOUR: causal correction and removal replay from immutable source and preserve all effect IDs',async t=>{
 const f=await fixture(t);
 await f.append('reading-edit',{class:'reading',kind:'correction',target:'TEST-ONLY-reading',payload:{replacement_fields:{lb:{value:174,unit:'lb'}}},parents:['TEST-ONLY-reading'],effective:fixtureEffective('2026-09-04',18)},1);
 let view=await f.controller.view(await prepare(f));assert.equal(view.state.reads.find(r=>r.d==='2026-09-04').w,174);
 assert.notEqual(view.state.reads.find(r=>r.d==='2026-09-04').offWindow,true,'Evening correction must retain the original morning context');
 assert.deepEqual(view.families.find(r=>r.op_id==='TEST-ONLY-reading').effect_ids,['reading-edit']);
 await f.append('reading-remove',{class:'reading',kind:'tombstone',target:'TEST-ONLY-reading',payload:{reason:'Synthetic wrong reading'},parents:['reading-edit'],effective:fixtureEffective('2026-09-04',19)},1);
 view=await f.controller.view(await prepare(f));assert.equal(view.state.reads.some(r=>r.d==='2026-09-04'),false);
 assert.deepEqual(view.families.find(r=>r.op_id==='TEST-ONLY-reading').effect_ids,['reading-edit','reading-remove']);
 assert.equal(Object.keys((await f.repository.load()).generation.collections.ops).length,7);
});
test('S3-Q-LATE-HOUR: a real evening fact stays outside the trend rather than borrowing hour8',async t=>{
 const f=await fixture(t);f.setAsOf('2026-09-05');
 await f.append('evening-reading',{class:'reading',kind:'fact',payload:{lb:{value:175,unit:'lb'}},effective:fixtureEffective('2026-09-05',18)},1);
 const view=await f.controller.view(await prepare(f));assert.equal(view.state.reads.find(r=>r.d==='2026-09-05').offWindow,true);
});
test('S3-Q-N1-REPLACE: the real whole-answer winner never resurrects omitted protein',async t=>{
 const f=await fixture(t);await f.append('replacement',Food.prepare({action:Food.ACTION,input:{day:{cal:2400},effective:fixtureEffective()}}));
 const view=await f.controller.view(await prepare(f));assert.deepEqual(view.state.dailyLogs['2026-09-04'],{cal:2400});
 assert.ok(view.families.some(r=>r.op_id==='TEST-ONLY-food'&&r.state==='retained'));
});
test('S3-Q-REVIEW: cloned reviews and caller-supplied selection evidence cannot replace identity confirmation',async t=>{
 const f=await fixture(t),review=await f.review();
 await assert.rejects(()=>f.controller.prepareSource({...review},{identityConfirmed:true}),{code:'LOCAL_SOURCE_REVIEW_UNOWNED'});
 await assert.rejects(()=>f.controller.prepareSource(review,{existingSelection:{id:'fake'},prefixAnswer:true}),{code:'LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED'});
});
test('S3-Q-CURRENT: same-count semantic change and a new durable operation both invalidate guidance',async t=>{
 const f=await fixture(t),h=await prepare(f),before=await f.repository.load();f.setEpoch();
 await assert.rejects(()=>f.controller.view(h),{code:'LOCAL_SOURCE_STALE'});
 assert.equal((await f.repository.load()).revision,before.revision);
 const fresh=await prepare(f);await f.append('food-later',Food.prepare({action:Food.ACTION,input:{day:{cal:2200},effective:fixtureEffective('2026-09-05')}}));
 await assert.rejects(()=>f.controller.view(fresh),{code:'LOCAL_SOURCE_STALE'});
});
test('S3-Q-UNMAPPED: a retained current plan request withholds qualification instead of inventing consent',async t=>{
 const f=await fixture(t);await f.append('plan-request',{class:'plan',kind:'fact',payload:{request:'Synthetic current programme change'},effective:fixtureEffective()},1);
 const result=await prepare(f);assert.equal(result.ready,false);assert.ok(result.issues.some(x=>x.code==='LOCAL_SOURCE_EFFECT_UNMAPPED'));
 assert.ok((await f.repository.load()).generation.collections.ops['plan-request']);
});
test('S3-Q-AUTHORITY: receipt-like evidence cannot turn local observations into a hosted source',async t=>{
 const f=await fixture(t);await f.mutate(g=>{g.collections.receipts['1']={seq:1,op_id:'TEST-ONLY-reading'};});
 await assert.rejects(()=>f.review(),{code:'LOCAL_SOURCE_AUTHORITY_CONTEXT'});
});
test('S3-Q-CHECKPOINT-ORIGINAL: rewriting and recommitting an original under the same ID still refuses',async t=>{
 const f=await fixture(t);await f.mutate(g=>{const op=g.collections.ops['TEST-ONLY-reading'];op.payload.lb.value=174.5;op.canonical_content_commitment=Ops.commitmentOf(op,readLocalEra(g.metadata).identityKey);});
 await assert.rejects(()=>f.review(),{code:'LOCAL_SOURCE_ORIGINAL_CHANGED'});
});
test('S3-Q-IMPORT-NAME: duplicate matching import metadata does not pick the first source silently',async t=>{
 const f=await fixture(t);await f.mutate(g=>{g.metadata.imports.push(structuredClone(g.metadata.imports[0]));});
 await assert.rejects(()=>f.review(),{code:'LOCAL_SOURCE_IMPORT_AMBIGUOUS'});
});
test('S3-Q-F3: real captured sets are locally projected once and incomplete workouts stay incomplete',async t=>{
 const f=await fixture(t),first=await appendCompletedWorkout(f),second=await appendCompletedWorkout(f,{complete:false});
 const h=await prepare(f),v=await f.controller.view(h);
 assert.deepEqual(v.workout_facts.sessions.map(s=>s.start_op_id),[first.startId]);
 assert.deepEqual(v.workout_facts.incomplete_sessions.map(s=>s.start_op_id),[second.startId]);
 assert.ok(v.families.some(r=>r.family==='F3'&&r.state==='projected'));
 assert.ok(v.integration_pending.includes('local-capture-start-resume'));
 assert.equal(JSON.stringify((await f.repository.load()).generation.collections.ops[first.startId].prescription_capture),JSON.stringify(first.capture));
});
test('S3-Q-F3-LAYOUT: a valid capture with different configured set counts stays unresolved',async t=>{
 const f=await fixture(t);f.state.exercises[0].sets-=1;await appendCompletedWorkout(f);
 const result=await prepare(f);assert.equal(result.ready,false);assert.ok(result.issues.some(x=>x.code==='LOCAL_SOURCE_WORKOUT_UNRESOLVED'));
});
test('S3-Q-MIXED-PREFIX: nonempty legacy plus real native capture needs its separate factual answer',async t=>{
 const template=await fixture(t,{withFacts:false}),source=structuredClone(template.state),ex=source.exercises[0];
 source.sessionLog['2026-09-01']={type:'U',entries:[{id:ex.id,w:ex.steps[0],reps:[8,8,8],rir:2,sets:3}]};
 const f=await fixture(t,{source}),workout=await appendCompletedWorkout(f),review=await f.review();
 await assert.rejects(()=>f.controller.prepareSource(review,{identityConfirmed:true,prefixAnswer:false}),{code:'ORDER_EVIDENCE_REQUIRED'});
 const h=await f.controller.prepareSource(review,{identityConfirmed:true,prefixAnswer:true}),view=await f.controller.view(h);
 assert.equal(view.order_map.native_root_id,workout.startId);assert.equal(view.order_map.assertion.answer,true);
 assert.deepEqual(view.state.sessionLog,source.sessionLog);assert.deepEqual(view.workout_facts.sessions.map(s=>s.start_op_id),[workout.startId]);
});
