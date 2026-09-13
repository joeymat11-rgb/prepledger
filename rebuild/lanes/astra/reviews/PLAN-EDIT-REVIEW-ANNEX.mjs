import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { openLocalDurableClient } from '../../../m3/w6/local/local-client.mjs';
import { createDurablePublicClient } from '../../../m3/w6/public-client.mjs';
import { StorageFailure } from '../../../m3/w6/repository.mjs';
import { createPlanEditHost } from '../../../m3/w6/host/plan-edit-host.mjs';
import { createSetupCommands } from '../../../m3/w7-preview/today/setup-commands.mjs';
import { ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
const require = createRequire(import.meta.url);
const w6require = createRequire(new URL('../../../m3/w6/package.json', import.meta.url));
const { IDBFactory } = w6require('fake-indexeddb');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createSetupTagProjector } = require('../../../m4/workout/setup-tags.cjs');
const { nameAt, orderedExercisesForDay } = require('../../../engine/plan.cjs')({},{});
const tags = createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
const change = (sets, id = 'review-upper-a') => ({ kind: 'update', exercise_id: id, changes: { sets } });
const later = '2026-10-01';
function latch() { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; }
async function rig() {
  const indexedDB = new IDBFactory(), time = { now: '2026-09-30T23:55:00.000Z' };
  const clock = { now: () => time.now, today: () => time.now.slice(0,10), tz: '+00:00', monotonicMs: () => 0 };
  let cryptHold = null;
  const crypto = { getRandomValues: webcrypto.getRandomValues.bind(webcrypto), subtle: new Proxy(webcrypto.subtle, {
    get(object, property) {
      if (property === 'encrypt') return async (...args) => {
        if (cryptHold) { const wait = cryptHold; wait.entered.resolve(); await wait.release.promise; }
        return object.encrypt(...args);
      };
      const value = Reflect.get(object, property);
      return typeof value === 'function' ? value.bind(object) : value;
    }
  }) };
  const options = { indexedDB, crypto, clock, databaseName: 'astra-review-synthetic',
    namespace: 'astra-review-synthetic/local', athleteId: 'astra-review-synthetic', deviceId: 'astra-review-phone' };
  let client = await openLocalDurableClient(options);
  assert.equal((await client.enroll()).enrolled, true);
  assert.equal((await client.boot()).ready, true);
  let repository = (await client.hostBindings({ clock })).repository;
  const row = (id, day, mg) => ({ id, n: id, day, mg, sets: 2, hi: 11, inc: 2.5, steps: [5,7.5,10,12.5] });
  const setup = { athlete_label: 'Synthetic independent reviewer', split: { from: '2026-09-30',
    map: { 0:'REST',1:'F',2:'REST',3:'REST',4:'F',5:'REST',6:'REST' } },
    exercises: [row('review-upper-a','U','chest'),row('review-upper-b','U','back'),row('review-lower-a','L','quads')], priority_muscles: [] };
  const selected = Object.fromEntries(setup.exercises.map(ex => [ex.id,{ head:null, secondary:[] }]));
  const setupBindings = await client.hostBindings({ workoutCommands: createSetupCommands(), clock });
  const setupHost = createDurablePublicClient({ ...setupBindings, schemaVersion:2 });
  assert.equal((await setupHost.reopen()).refusal,null);
  const initial = await setupHost.execute('workout',{ action:'first-run-setup', input:{ setup,tags:selected } });
  assert.equal(initial.acknowledged,true);
  const origin = (await repository.load()).generation.collections.ops[initial.op_id];
  const basis = tags.projectSetupTags(createCleanInitState({setup}),{setup,tags:selected,op_id:origin.op_id,date:clock.today()});
  let serial = 0, lose = false, beforeCommit = null;
  const hosts = [];
  async function host() {
    const instance = await createPlanEditHost({ client: { async hostBindings(opts) {
      const bindings = await client.hostBindings(opts);
      return { ...bindings, repository: { ...bindings.repository, async commit(...args) {
        if (beforeCommit) await beforeCommit();
        const committed = await bindings.repository.commit(...args);
        if (lose) { lose = false; throw new StorageFailure('REVIEW_LOST_CONFIRMATION',3); }
        return committed;
      } } };
    } }, clock, basisState:basis, setupOperation:origin, validateTags:tags.validateExerciseTags,
      projectNewExerciseTags:tags.projectNewExerciseTags, newIntentId:()=>'astra-review-intent-'+(++serial) });
    hosts.push(instance); return instance;
  }
  return { host, clock, time, snapshot:()=>repository.load(),
    async editSyntheticGeneration(edit){const before=await repository.load(),next=structuredClone(before.generation);edit(next);await repository.commit(before,next,()=>null);},
    recordWeight(value){return client.execute('weighIn',{date:clock.today(),lb:value});},
    loseOnce(){lose=true;},
    beforeCommit(fn){beforeCommit=fn;},
    hold(){cryptHold={entered:latch(),release:latch()};return cryptHold;},
    release(){cryptHold?.release.resolve();cryptHold=null;},
    closeClient(){client.close();},
    async reopen(){hosts.forEach(h=>h.close());client.close();client=await openLocalDurableClient(options);
      assert.equal((await client.boot()).ready,true);repository=(await client.hostBindings({clock})).repository;return host();},
    async tombstone(target){
      const commands={schemaVersion:2,prepare(){return {kind:'tombstone',class:'plan',target,parents:[target],payload:{reason:'Synthetic reviewer undo'}};},
        validate(op){return op.kind==='tombstone' && op.class==='plan' && op.target_op_id===target && op.causal_parents.length===1 && op.causal_parents[0]===target;}};
      const bindings=await client.hostBindings({workoutCommands:commands,clock});
      const lane=createDurablePublicClient({...bindings,schemaVersion:2,stage(g,c,a,i){return bindings.stage(g,c,a,{...i,historyAuthentication:{signedOperationIds:[]}});}});
      assert.equal((await lane.reopen()).refusal,null);
      const result=await lane.execute('workout',{});assert.equal(result.acknowledged,true,result.code);return result;
    },
    finish(){cryptHold?.release.resolve();hosts.forEach(h=>h.close());client.close();}
  };
}
async function prepare(h, edit) { const result=await h.review(edit);assert.equal(result.reviewed,true,result.code);return result; }
const plans=s=>Object.values(s.generation.collections.ops).filter(op=>op.kind==='plan-mutation');
const exercise=(s,id='review-upper-a')=>s.state.exercises.find(ex=>ex.id===id);

test('I01 same handle is idempotent across twenty concurrent Save calls',async()=>{
  const r=await rig();try{const h=await r.host(), p=await prepare(h,change(3));
    const replies=await Promise.all(Array.from({length:20},()=>h.save(p.review_id)));
    assert(replies.every(x=>x.ok));assert.equal(new Set(replies.map(x=>x.op_id)).size,1);assert.equal(plans(await r.snapshot()).length,1);
  }finally{r.finish();}
});
test('I02 cancelled in-flight review writes no operation after encryption resumes',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),before=await r.snapshot(),hold=r.hold();
    const saving=h.save(p.review_id);await hold.entered.promise;h.cancel(p.review_id);r.release();
    assert.equal((await saving).acknowledged,false);assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('I03 midnight during encryption refuses without committing',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),before=await r.snapshot(),hold=r.hold();
    const saving=h.save(p.review_id);await hold.entered.promise;r.time.now=later+'T00:00:00.000Z';r.release();
    assert.equal((await saving).acknowledged,false);assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('I04 close during encryption and queued duplicate saves all refuse',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),before=await r.snapshot(),hold=r.hold();
    const first=h.save(p.review_id),duplicates=Array.from({length:5},()=>h.save(p.review_id));await hold.entered.promise;h.close();r.release();
    assert((await Promise.all([first,...duplicates])).every(x=>!x.acknowledged));assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('I05 lost confirmation is resolved from the exact stored intent',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3));r.loseOnce();
    const saved=await h.save(p.review_id);assert.equal(saved.acknowledged,true);assert.equal(saved.recovered,true);
    assert.equal(plans(await r.snapshot()).length,1);const reopened=await r.reopen();assert.equal(exercise(await reopened.read(later)).sets,3);
  }finally{r.finish();}
});
test('I06 old equal value plus failed new write never becomes new acknowledgement',async()=>{
  const r=await rig();try{const h=await r.host();for(const sets of [3,4]){const p=await prepare(h,change(sets));assert.equal((await h.save(p.review_id)).ok,true);}
    const p=await prepare(h,change(3)),before=await r.snapshot();r.beforeCommit(()=>{throw new StorageFailure('REVIEW_BEFORE_COMMIT',3);});
    const saved=await h.save(p.review_id);assert.equal(saved.acknowledged,false);assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('I07 another host plan write invalidates review of an unrelated exercise',async()=>{
  const r=await rig();try{const a=await r.host(),b=await r.host(),one=await prepare(a,change(3)),two=await prepare(b,change(4,'review-upper-b'));
    assert.equal((await b.save(two.review_id)).ok,true);const before=await r.snapshot();assert.equal((await a.save(one.review_id)).code,'PLAN_EDIT_REVIEW_STALE');assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('I08 a completed review cannot return cached Saved after installation closes',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3));assert.equal((await h.save(p.review_id)).ok,true);
    r.closeClient();const read=await h.read();assert.equal(read.read,false);
    assert.equal((await h.save(p.review_id)).acknowledged,false,'closed installation must propagate its refusal through save');
  }finally{r.finish();}
});
test('I09 a tombstoned saved intent cannot be reported active by cached Save',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),saved=await h.save(p.review_id);assert.equal(saved.ok,true);
    await r.tombstone(saved.op_id);const view=await h.read(later);assert.equal(view.read,true,view.code);assert.equal(view.intents[0].status,'tombstoned');assert.equal(exercise(view).sets,2);
    assert.equal((await h.save(p.review_id)).acknowledged,false,'retracted intent must not yield cached active acknowledgement');
  }finally{r.finish();}
});
test('I10 an encrypted unproved rejection cannot silently retract an authenticated intent',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),saved=await h.save(p.review_id);assert.equal(saved.ok,true);
    const before=await r.snapshot();
    await r.editSyntheticGeneration(g=>{g.collections.rejected[saved.op_id]={op_id:saved.op_id};});
    const after=await r.snapshot();assert.deepEqual(after.generation.collections.ops,before.generation.collections.ops);
    assert.equal(Object.keys(after.generation.metadata.wireProofs?.disposition || {}).length,0);
    const view=await h.read(later);
    if(view.read){assert.equal(view.intents[0].status,'rejected');assert.equal(exercise(view).sets,2);}
    assert.equal(view.read,false,'no authentic disposition or local rejection authority proves this inactive status');
  }finally{r.finish();}
});
test('I11 corrupting authenticated plan operation bytes refuses instead of showing a plan',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),saved=await h.save(p.review_id);assert.equal(saved.ok,true);
    await r.editSyntheticGeneration(g=>{g.collections.ops[saved.op_id].members[0].value.edit.changes.sets=5;});
    assert.equal((await h.read(later)).read,false);
  }finally{r.finish();}
});
test('I12 real factual writes between review and save survive unchanged',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3));
    const fact=await r.recordWeight(150);assert.equal(fact.acknowledged,true,fact.code);const before=await r.snapshot();
    assert.equal((await h.save(p.review_id)).acknowledged,true);const after=await r.snapshot();
    assert.deepEqual(after.generation.collections.ops[fact.op_id],before.generation.collections.ops[fact.op_id]);
    assert.deepEqual(after.generation.collections.outbox[fact.op_id],before.generation.collections.outbox[fact.op_id]);
  }finally{r.finish();}
});
test('I13 invalidated ancestor refuses while preserving every descendant operation',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),first=await h.save(p.review_id);assert.equal(first.ok,true);
    const q=await prepare(h,change(4,'review-upper-b'));assert.equal((await h.save(q.review_id)).ok,true);
    await r.tombstone(first.op_id);const before=await r.snapshot();const refused=await h.read(later);
    assert.equal(refused.read,false);assert.equal(refused.code,'PLAN_EDIT_BASIS_INVALIDATED');assert.equal(plans(before).length,2);assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('I14 same-date renames preserve the prior name and retain exact exercise identity',async()=>{
  const r=await rig();try{const h=await r.host();for(const n of ['Review first rename','Review final rename']){
    const p=await prepare(h,{kind:'update',exercise_id:'review-upper-a',changes:{n}});assert.equal((await h.save(p.review_id)).ok,true);
  }
  const before=await h.read('2026-09-30'),after=await h.read(later);assert.equal(exercise(before).n,'review-upper-a');
  assert.equal(nameAt(after.state,'review-upper-a','2026-09-30'),'review-upper-a');assert.equal(nameAt(after.state,'review-upper-a',later),'Review final rename');
  assert.equal(exercise(before).id,exercise(after).id);assert.deepEqual(exercise(before).forks,exercise(after).forks);
  }finally{r.finish();}
});
test('I15 replacing the middle upper lift retains its dated order and old identity',async()=>{
  const r=await rig();try{const h=await r.host(),initial=await h.read(),old=exercise(initial,'review-upper-b');
    const p=await prepare(h,{kind:'replace',exercise_id:old.id,exercise:{id:'review-new-upper',n:'Replacement',day:'U',mg:'back',sets:3,hi:13,inc:1.25,steps:[5,6.25,7.5]},tags:{head:null,secondary:[]}});
    assert.equal((await h.save(p.review_id)).ok,true);assert.deepEqual((await h.read()).state,initial.state);
    const after=await h.read(later);assert.deepEqual(exercise(after,old.id),old);
    assert.deepEqual(orderedExercisesForDay(after.state,'U').map(e=>e.id),['review-upper-a','review-new-upper']);
    assert.equal(exercise(after,'review-new-upper').w,null);assert.deepEqual(exercise(after,'review-new-upper').forks,[]);
  }finally{r.finish();}
});
test('I16 plan basis follows actual plan operations and is stable across projection dates and factual writes',async()=>{
  const r=await rig();try{const h=await r.host(),initial=await h.read();assert.equal((await h.read(later)).plan_basis,initial.plan_basis);
    assert.equal((await r.recordWeight(149)).acknowledged,true);assert.equal((await h.read()).plan_basis,initial.plan_basis);
    const p=await prepare(h,change(3)),saved=await h.save(p.review_id);assert.equal(saved.ok,true);
    const final=await h.read();assert.notEqual(final.plan_basis,initial.plan_basis);assert.equal(final.plan_basis,(await h.read(later)).plan_basis);
    assert(final.causal_parents.includes(saved.op_id));
  }finally{r.finish();}
});
