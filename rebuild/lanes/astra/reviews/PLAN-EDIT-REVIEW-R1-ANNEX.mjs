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
  let serial = 0, lose = false, beforeCommit = null, readGate = null;
  const hosts = [];
  async function host() {
    const instance = await createPlanEditHost({ client: { async hostBindings(opts) {
      const bindings = await client.hostBindings(opts);
      return { ...bindings, repository: { ...bindings.repository, async load() { if (readGate && --readGate.remaining === 0) { const held = readGate; held.entered.resolve(); await held.release.promise; readGate = null; } return bindings.repository.load(); }, async commit(...args) {
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
    loseOnce(){lose=true;}, holdRead(n=1){readGate={remaining:n,entered:latch(),release:latch()};return readGate;}, releaseRead(){readGate?.release.resolve();},
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
    finish(){readGate?.release.resolve();cryptHold?.release.resolve();hosts.forEach(h=>h.close());client.close();}
  };
}
async function prepare(h, edit) { const result=await h.review(edit);assert.equal(result.reviewed,true,result.code);return result; }
const plans=s=>Object.values(s.generation.collections.ops).filter(op=>op.kind==='plan-mutation');
const exercise=(s,id='review-upper-a')=>s.state.exercises.find(ex=>ex.id===id);

// Reviewer-only timing controls. Product sources and the original annex stay unchanged.
for(const boundary of ['cancel','host-close','installation-close']) test('R1-A cached retry refuses '+boundary+' during authenticated reread',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3));assert.equal((await h.save(p.review_id)).ok,true);
    const before=await r.snapshot(),held=r.holdRead(),saving=h.save(p.review_id);
    await Promise.race([held.entered.promise,saving.then(()=>{throw new Error('Did not reach real repository reread');})]);
    if(boundary==='cancel')h.cancel(p.review_id);else if(boundary==='host-close')h.close();else r.closeClient();
    r.releaseRead();assert.equal((await saving).acknowledged,false);
    if(boundary!=='installation-close')assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('R1-B cancellation while reconciling a lost reply suppresses ack but preserves the actual commit',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3));r.loseOnce();const held=r.holdRead(3),saving=h.save(p.review_id);
    await Promise.race([held.entered.promise,saving.then(()=>{throw new Error('Did not reach outcome-reconciliation reread');})]);
    h.cancel(p.review_id);r.releaseRead();assert.equal((await saving).acknowledged,false);
    const saved=await r.snapshot();assert.equal(plans(saved).length,1);const other=await r.host();assert.equal(exercise(await other.read(later)).sets,3);
  }finally{r.finish();}
});
test('R1-C cached retry rereads and refuses an operation integrity fault',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),saved=await h.save(p.review_id);assert.equal(saved.ok,true);
    await r.editSyntheticGeneration(g=>{g.collections.ops[saved.op_id].members[0].value.edit.changes.sets=6;});
    const before=await r.snapshot();assert.equal((await h.save(p.review_id)).acknowledged,false);assert.deepEqual(await r.snapshot(),before);
  }finally{r.finish();}
});
test('R1-D concurrent cached retries after retraction all refuse without restoring the edit',async()=>{
  const r=await rig();try{const h=await r.host(),p=await prepare(h,change(3)),saved=await h.save(p.review_id);assert.equal(saved.ok,true);
    await r.tombstone(saved.op_id);const before=await r.snapshot();const replies=await Promise.all(Array.from({length:8},()=>h.save(p.review_id)));
    assert(replies.every(x=>!x.acknowledged));assert.deepEqual(await r.snapshot(),before);assert.equal(exercise(await h.read(later)).sets,2);
  }finally{r.finish();}
});
