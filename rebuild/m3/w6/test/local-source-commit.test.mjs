import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from 'fake-indexeddb';
import {createLocalSourceFixture,fixtureEffective} from '../../../m4/import/test/s3/fixtures.mjs';
import {commitLocalSource} from '../local/source-commit.mjs';
import Food from '../../w7-preview/today/food-commands.cjs';
import Ops from '../../../client/ops.cjs';
import {readLocalEra} from '../local/local-era.mjs';
const fixture=async(t,options={})=>{const f=await createLocalSourceFixture({indexedDB:new IDBFactory(),crypto:webcrypto,databaseName:'s3-commit',...options});t.after(()=>f.close());return f;};
const prepare=async f=>f.controller.prepareSource(await f.review(),{identityConfirmed:true,prefixAnswer:true});
test('S3-COMMIT-OWNERSHIP: fake completion or Q cannot write a generation',async()=>{
 assert.ok(existsSync(new URL('../local/source-commit.mjs',import.meta.url)),'S3 atomic source commit is implemented');
 const {commitLocalSource}=await import('../local/source-commit.mjs');
 for(const handle of [null,{},Object.freeze({ready:true,qualified:true,basis:{profile:'earned/local-source-basis/v1'}})])
  await assert.rejects(()=>commitLocalSource(handle),{code:'LOCAL_SOURCE_QUALIFICATION_UNOWNED'});
});
test('S3-COMMIT-ATOMIC: one real CAS publishes projection, evidence, selection and matching completion',async t=>{
 const f=await fixture(t),before=await f.repository.load(),h=await prepare(f),committed=await commitLocalSource(h),after=await f.repository.load(),v=await f.controller.view(committed);
 assert.equal(after.revision,before.revision+1);assert.equal(after.generation.metadata.localSourceApplication.committed_revision,after.revision);
 assert.equal(after.generation.metadata.localSourceApplication.selection_id,v.basis.local_selection_id);
 assert.equal(after.generation.metadata.imports[0].rebaseRequired,false);
 assert.equal(after.generation.metadata.localSourceApplication.s3_complete,false,'Reserved consumer/capture work stays pending');
 assert.deepEqual(after.generation.collections.ops,before.generation.collections.ops);assert.deepEqual(after.generation.collections.outbox,before.generation.collections.outbox);
 assert.equal(Object.keys(after.generation.metadata.localSources.selections).length,1);
});
test('S3-COMMIT-CAS: a later factual save wins and stale preparation cannot erase it',async t=>{
 const f=await fixture(t),h=await prepare(f);await f.append('new-food',Food.prepare({action:Food.ACTION,input:{day:{cal:2100},effective:fixtureEffective('2026-09-05')}}));
 const before=await f.repository.load();await assert.rejects(()=>commitLocalSource(h),{code:'LOCAL_SOURCE_STALE'});
 assert.deepEqual((await f.repository.load()).generation,before.generation);
});
test('S3-COMMIT-SEAL-CANCEL: semantic cancellation after publish begins is rejected inside the real transaction',async t=>{
 let release,entered;const pause=new Promise(r=>{release=r;}),started=new Promise(r=>{entered=r;});
 const f=await fixture(t,{repositoryWrap:r=>({...r,async commit(...args){entered();await pause;return r.commit(...args);}})}),h=await prepare(f),before=await f.repository.load();
 const attempt=commitLocalSource(h);await started;f.setEpoch();release();
 await assert.rejects(()=>attempt,{code:'LOCAL_SOURCE_STALE'});assert.deepEqual((await f.repository.load()).generation,before.generation);
});
test('S3-COMMIT-PUBLISH-CAS: a concurrent factual save after preflight cannot be overwritten by publication',async t=>{
 let armed=false,contender;
 const f=await fixture(t,{repositoryWrap:r=>({...r,async load(){const loaded=await r.load();if(armed){armed=false;await contender();}return loaded;}})}),h=await prepare(f);
 let saved;
 contender=async()=>{await f.append('during-publication',Food.prepare({action:Food.ACTION,input:{day:{cal:2175},effective:fixtureEffective('2026-09-05')}}));saved=await f.repository.load();};
 armed=true;
 await assert.rejects(()=>commitLocalSource(h),{code:'STALE_REVISION'});
 assert.ok(saved.generation.collections.ops['during-publication']);
 assert.deepEqual((await f.repository.load()).generation,saved.generation,'The competing real generation survives unchanged');
});
test('S3-COMMIT-ACK: lost acknowledgment reconciles the exact durable selection without a second write',async t=>{
 const f=await fixture(t,{repositoryWrap:r=>({...r,async commit(...args){await r.commit(...args);const e=new Error('TEST-ONLY-ACK-LOSS');e.code=e.message;throw e;}})});
 const before=await f.repository.load(),prepared=await prepare(f);let h,error;
 try{h=await commitLocalSource(prepared);}catch(caught){error=caught;}
 assert.equal(error,undefined,'An exact durable selection must reconcile a lost acknowledgment');
 const after=await f.repository.load();
 assert.equal(after.revision,before.revision+1);assert.equal(Object.keys(after.generation.metadata.localSources.selections).length,1);
 assert.equal((await f.controller.view(h)).basis.local_selection_id,after.generation.metadata.localSources.active);
});
test('S3-COMMIT-REOPEN: an invented cached projection is ignored and original facts are reproduced',async t=>{
 const f=await fixture(t);await commitLocalSource(await prepare(f));
 await f.mutate(g=>{g.collections.derived.localSource.view.state.trend=1;});
 const h=await f.controller.reopen(f.name),v=await f.controller.view(h);assert.notEqual(v.state.trend,1);
 assert.equal(v.state.reads.find(r=>r.d==='2026-09-04').w,173.25);
});
test('S3-COMMIT-ROLLBACK: rollback appends evidence and retains later local facts and old selections',async t=>{
 const f=await fixture(t),first=await commitLocalSource(await prepare(f)),id=(await f.controller.view(first)).basis.local_selection_id;
 await f.append('after-import',Food.prepare({action:Food.ACTION,input:{day:{cal:2150},effective:fixtureEffective('2026-09-05')}}));f.setAsOf('2026-09-05');
 const before=await f.repository.load(),next=await commitLocalSource(await f.controller.rollback(id)),after=await f.repository.load();
 assert.equal(Object.keys(after.generation.metadata.localSources.selections).length,2);
 assert.deepEqual(after.generation.metadata.localSources.selections[id],before.generation.metadata.localSources.selections[id]);
 assert.deepEqual(after.generation.collections.ops,before.generation.collections.ops);assert.deepEqual(after.generation.collections.outbox,before.generation.collections.outbox);
 assert.equal((await f.controller.view(next)).state.dailyLogs['2026-09-05'].cal,2150);
});
test('S3-COMMIT-SELECTION-ORIGINAL: retained selection evidence also pins originals added after the import checkpoint',async t=>{
 const f=await fixture(t);await f.append('post-checkpoint-food',Food.prepare({action:Food.ACTION,input:{day:{cal:2400},effective:fixtureEffective()}}));
 await commitLocalSource(await prepare(f));
 await f.mutate(g=>{const op=g.collections.ops['post-checkpoint-food'];op.payload.day.cal=2410;op.canonical_content_commitment=Ops.commitmentOf(op,readLocalEra(g.metadata).identityKey);});
 await assert.rejects(()=>f.review(),{code:'LOCAL_SOURCE_ORIGINAL_CHANGED'});
});
