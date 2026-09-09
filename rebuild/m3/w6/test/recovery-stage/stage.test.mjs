import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fixture,initial,deferred} from '../support.mjs';
import {IDBKeyRange} from 'fake-indexeddb';
import {validateRecoveryProfile} from '../../recovery-profile.mjs';
import {profileVectors} from './profile-vectors.mjs';
if(!process.env.EARNED_ROWS_R1_ROOT)throw Error('Run through run-recovery-stage.cjs with the pinned public R1 dependency');
const require=createRequire(resolve(process.env.EARNED_ROWS_R1_ROOT,'rebuild/m3/w5/package.json'));
const P=require('./reconciliation/paged-codec.cjs'),C=require('./reconciliation/codec.cjs'),Sign=require('./crypto.cjs');
const HEAD=['earned/recovery-rows/v1','head'];
const h=P.hash('synthetic','stage');
function frames(inputRows){
 const authority=Sign.generateSigningKey('stage-test'),sign=record=>({...record,authority_signature:Sign.signatureOver(record,authority,record.profile)});
 const request={version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]};
 const rows=inputRows||[{collection:'history',row_id:'a',value:' {"n":1.00,"text":"e\u0301"} '},{collection:'history',row_id:'b',value:' {"synthetic":true} '},{collection:'metadata',row_id:'state',value:'{}'}];
 const manifest=sign(P.makeManifest({keyEpoch:authority.kid,scopeDigest:h,request,basisDigest:h,revision:1,storageControlDigest:h,snapshotId:h,collectionCounts:P.COLLECTIONS.map(c=>[c,rows.filter(r=>r.collection===c).length]),chainSeed:h}));
 const cut=inputRows?1:2;
 const first=P.makePage({manifest,rawRows:rows.slice(0,cut),sign}),second=P.makePage({manifest,previousCursor:first.next_cursor,rawRows:rows.slice(cut),sign});
 const last=P.makePage({manifest,previousCursor:second.next_cursor,rawRows:[],sign});
 const replies=[{manifest,page:first},{manifest,page:second},{manifest,page:last,finish:P.makeFinish({manifest,page:last,sign})}];
 const expected={scopeDigest:h,nonce:h,contextId:h,requestDigest:C.hash('request',C.encode(request)),basisDigest:h,claimSetDigest:P.hash('claims',[]),mode:'CURRENT_DEVICE'};
 return {authority,sign,rows,replies,expected,options:{protocol:P,codec:C,verificationKeys:[Sign.publicKeyOf(authority)],validateContext:()=>null,keyRange:IDBKeyRange}};
}
async function setup(t){const f=await fixture();await f.seed();t.after(()=>f.repo.close());const wire=frames(),stage=f.repo.recovery(wire.options);return {...f,...wire,stage};}
async function raw(f,action){const db=await new Promise((resolve,reject)=>{const r=f.indexedDB.open(f.setup.databaseName,1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});try{return await new Promise((resolve,reject)=>{const tx=db.transaction('generations','readwrite'),store=tx.objectStore('generations');let value;action(store,x=>{value=x;});tx.oncomplete=()=>resolve(value);tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
async function seedAll(f){await f.stage.start({expected:f.expected});for(const response of f.replies)assert.equal((await f.stage.append(C.encode(response))).complete,false);}

test('durable pages/indexes survive real repository reopen; active generation and outbox stay untouched',async t=>{
 const f=await setup(t),before=await f.repo.load();await f.stage.start({expected:f.expected});
 await f.stage.append(C.encode(f.replies[0]));f.repo.close();const reopened=await f.fresh();t.after(()=>reopened.repository.close());
 const stage=reopened.repository.recovery(f.options);assert.equal((await stage.progress()).pages,1);
 await stage.append(C.encode(f.replies[1]));await stage.append(C.encode(f.replies[2]));
 const view=await stage.inventory(),got=[];const result=await view.visit(row=>got.push(row));assert.deepEqual(got,f.rows);assert.deepEqual(result,{inventoryVerified:true,complete:false,activated:false});
 assert.deepEqual(await view.readRow('history','a'),f.rows[0]);assert.equal(await view.readRow('history','absent'),undefined);
 assert.deepEqual(await reopened.repository.load(),before);
});
test('last-page retry is idempotent and valid signature re-encoding does not duplicate indexed rows',async t=>{
 const f=await setup(t);await f.stage.start({expected:f.expected});await f.stage.append(C.encode(f.replies[0]));
 assert.equal((await f.stage.append(C.encode(f.replies[0]))).duplicate,true);
 const replay=structuredClone(f.replies[0]);replay.page.next_cursor=f.sign(replay.page.next_cursor);replay.page=f.sign(replay.page);
 assert.equal((await f.stage.append(C.encode(replay))).duplicate,true);assert.equal((await f.stage.progress()).pages,1);
});
test('reordered and forged pages cannot advance durable progress; incomplete inventory stays unavailable',async t=>{
 const f=await setup(t);await f.stage.start({expected:f.expected});
 await assert.rejects(f.stage.append(C.encode(f.replies[1])),e=>e.state===18);
 const other=Sign.generateSigningKey(f.authority.kid),bad=structuredClone(f.replies[0]);bad.page.authority_signature=Sign.signatureOver(bad.page,other,bad.page.profile);
 await assert.rejects(f.stage.append(C.encode(bad)),e=>e.code==='RECOVERY_STAGE_PROOF_UNPROVEN');assert.equal((await f.stage.progress()).pages,0);
 await f.stage.append(C.encode(f.replies[0]));await assert.rejects(f.stage.inventory(),e=>e.code==='RECOVERY_STAGE_INCOMPLETE');
});
test('tampered encrypted index fails closed and active data stays unchanged',async t=>{
 const f=await setup(t);await seedAll(f);const p=await f.stage.progress();
 await raw(f,(store)=>{const key=['earned/recovery-rows/v1',p.attempt,'row','history',P.hash('local-stage-row-id',C.encode64('a'))],r=store.get(key);r.onsuccess=()=>{const record=r.result;new Uint8Array(record.ciphertext)[0]^=1;store.put(record,key);};});
 const view=await f.stage.inventory();await assert.rejects(view.readRow('history','a'),e=>e.state===18);await assert.rejects(view.visit(()=>{}),e=>e.state===18);
 assert.deepEqual((await f.repo.load()).generation,initial());
});
test('deleting a page never becomes an empty successful recovery',async t=>{
 const f=await setup(t);await seedAll(f);const p=await f.stage.progress();await raw(f,store=>store.delete(['earned/recovery-rows/v1',p.attempt,'page',2]));
 await assert.rejects((await f.stage.inventory()).visit(()=>{}),e=>e.code==='RECOVERY_STAGE_PAGE_MISSING');
});
test('two concurrent connections cannot both publish against the same staged head',async t=>{
 const f=await setup(t);await f.stage.start({expected:f.expected});const fresh=await f.fresh();t.after(()=>fresh.repository.close());const other=fresh.repository.recovery(f.options);
 const outcomes=await Promise.allSettled([f.stage.append(C.encode(f.replies[0])),other.append(C.encode(f.replies[0]))]);
 assert(outcomes.some(x=>x.status==='fulfilled'));for(const result of outcomes)if(result.status==='rejected')assert.equal(result.reason.code,'RECOVERY_STAGE_CHANGED');
 assert.equal((await f.stage.progress()).pages,1);
});
test('known standing loss refuses at the transaction cut',async t=>{
 const f=await setup(t);let denied=false;const stage=f.repo.recovery({...f.options,validateContext:()=>denied?{state:17,code:'SIGNED_OUT'}:null});
 await stage.start({expected:f.expected});denied=true;await assert.rejects(stage.append(C.encode(f.replies[0])),e=>e.state===17);assert.equal((await stage.progress()).pages,0);
});
test('actual Worker/D1/P1 inventory over real HTTP stages durably and matches the unchanged relational oracle',async t=>{
 const {createR1Runtime}=require('./test/r1-workerd.cjs'),Ops=require('../../client/ops.cjs');
 const r=await createR1Runtime({p1:true});t.after(()=>r.close());const f=await fixture();await f.seed();t.after(()=>f.repo.close());
 await r.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
 const enrolled=await r.bridge.enrollScoped('subject-first',{intent_id:'stage-enrol',schema_version:1,nonce:h}),lease=enrolled.payload.issuance.lease,actor=lease.device_id;
 for(let n=1;n<=8;n++){
  const op=Ops.build({op_id:'staged-fact-'+n,athlete_id:'first',device_id:actor,device_seq:n,predecessor:n===1?null:'staged-fact-'+(n-1),parents:[],kind:'fact',class:'reading',lease_id:lease.lease_id,
   effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:160,unit:'lb'},note:'SYNTHETIC '+ 'x'.repeat(70000)}},r.identityKeys.first);
  assert.equal((await r.bridge.invokeScoped('subject-first',actor,'admit',['first',op])).status,'ACCEPTED');
 }
 const request={version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]};
 const expected={scopeDigest:C.scopeDigest({issuer:r.issuer.config.issuer,origin:r.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:actor}),nonce:h,contextId:h,requestDigest:C.hash('request',C.encode(request)),basisDigest:h,claimSetDigest:P.hash('claims',[]),mode:'CURRENT_DEVICE'};
 const stage=f.repo.recovery({protocol:P,codec:C,verificationKeys:[Sign.publicKeyOf(r.authorityKey)],validateContext:()=>null,keyRange:IDBKeyRange});await stage.start({expected});
 let body={profile:P.DOMAINS.begin,device_id:actor,request,basis_digest:h},terminal=false;
 for(let n=0;n<64;n++){
  const reply=await r.request('/reconcile/rows',body);assert.equal(reply.status,200);assert.equal((await stage.append(C.encode(reply.body))).complete,false);
  if(reply.body.finish){terminal=true;break;}body={profile:P.DOMAINS.continue,device_id:actor,manifest:reply.body.manifest,cursor:reply.body.page.next_cursor};
 }
 assert(terminal);const inventory=await stage.inventory(),rows=[];await inventory.visit(row=>rows.push({athlete:'first',...row}));
 assert(rows.reduce((n,row)=>n+Buffer.byteLength(row.value),0)>1048576);
 // Test oracle only. Product staging never collects all rows or calls this
 // whole-history validator; the bounded complete-profile consumer is still owed.
 const original=require('./reconciliation/project.cjs').validateRetained(rows,'first');assert.equal(original.metadata.seq,8);
 const profile=await validateRecoveryProfile({inventory,codec:C,protocol:P,publicVerifier:require('./public-client.cjs').createPublicVerifier({keys:[Sign.publicKeyOf(r.authorityKey)],subtle:webcrypto.subtle}),requestBytes:C.encode(request),expected:{athleteId:'first',actorDeviceId:actor,scopeDigest:expected.scopeDigest,basisDigest:h}});
 assert.equal(profile.profileVerified,true);assert.equal(profile.complete,false);assert.deepEqual(await profile.summary(),{W:8,account_epoch:original.registry.account_epoch,history_origin:original.registry.history_origin});
 await t.test('cancellation stops actual indexed profile validation at the first observed row',async()=>{const aborter=new AbortController();let rows=0;const wrapped={...inventory,visit:visitor=>inventory.visit(row=>{rows++;aborter.abort();return visitor(row);})};await assert.rejects(validateRecoveryProfile({inventory:wrapped,codec:C,protocol:P,publicVerifier:require('./public-client.cjs').createPublicVerifier({keys:[Sign.publicKeyOf(r.authorityKey)],subtle:webcrypto.subtle}),requestBytes:C.encode(request),expected:{athleteId:'first',actorDeviceId:actor,scopeDigest:expected.scopeDigest,basisDigest:h},signal:aborter.signal}),e=>e.code==='RECOVERY_VALIDATION_ABORTED');assert.equal(rows,1);});
 await profileVectors(t,{allRows:rows,C,P,Sign,require,authority:r.authorityKey,identityKey:r.identityKeys.first,request,expected:{athleteId:'first',actorDeviceId:actor,scopeDigest:expected.scopeDigest,basisDigest:h}});
 for(const row of rows)assert.deepEqual(await inventory.readRow(row.collection,row.row_id),{collection:row.collection,row_id:row.row_id,value:row.value});
 assert.deepEqual((await f.repo.load()).generation,initial());
});
test('a surviving attempt requires explicit retry; new attempt preserves active data and invalidates old view',async t=>{
 const f=await setup(t);await seedAll(f);const view=await f.stage.inventory(),old=await f.stage.progress();
 await assert.rejects(f.stage.start({expected:f.expected}),e=>e.code==='RECOVERY_STAGE_EXPLICIT_RETRY_REQUIRED');
 await f.stage.start({expected:f.expected,explicitRetry:true});assert.notEqual((await f.stage.progress()).attempt,old.attempt);
 await assert.rejects(view.assertCurrent(),e=>e.code==='RECOVERY_STAGE_CHANGED');assert.deepEqual((await f.repo.load()).generation,initial());
});
test('stored page/index payloads remain encrypted and the database schema stays version1',async t=>{
 const f=await setup(t);await seedAll(f);const records=await raw(f,(store,finish)=>{const r=store.getAll();r.onsuccess=()=>finish(r.result);});
 for(const record of records.filter(r=>r.profile==='earned/recovery-rows/v1')){assert(record.ciphertext instanceof ArrayBuffer);assert(!JSON.stringify(record).includes('history'));assert(!JSON.stringify(record).includes('synthetic'));}
 const reopened=await f.fresh();t.after(()=>reopened.repository.close());assert.deepEqual((await reopened.repository.load()).generation,initial());
});
test('near-row-limit control-character ID remains bounded by base64 in the encrypted index',async t=>{
 const f=await fixture();await f.seed();t.after(()=>f.repo.close());
 const row={collection:'history',row_id:'\u0000'.repeat(1990000),value:'{}'},wire=frames([row,{collection:'metadata',row_id:'state',value:'{}'}]);
 const stage=f.repo.recovery(wire.options);await stage.start({expected:wire.expected});for(const response of wire.replies)await stage.append(C.encode(response));
 const view=await stage.inventory();assert.deepEqual(await view.readRow('history',row.row_id),row);
 const seen=[];await view.visit(x=>seen.push(x));assert.deepEqual(seen,wire.rows);assert.deepEqual((await f.repo.load()).generation,initial());
});

test('collection cursor checks marker cardinality and refuses deleted or substituted marker evidence',async t=>{
 const f=await setup(t);await seedAll(f);const view=await f.stage.inventory(),rows=[];assert.equal(await view.scan('history',row=>rows.push(row)),2);assert.deepEqual(rows,f.rows.filter(r=>r.collection==='history'));
 const state=await f.stage.progress();await raw(f,store=>store.delete(['earned/recovery-rows/v1',state.attempt,'scan','history',1]));
 await assert.rejects(view.scan('history',()=>{}),e=>e.state===18);
 await raw(f,store=>{const r=store.get(['earned/recovery-rows/v1',state.attempt,'scan','metadata',2]);r.onsuccess=()=>store.put(r.result,['earned/recovery-rows/v1',state.attempt,'scan','history',1]);});
 await assert.rejects(view.scan('history',()=>{}),e=>e.state===18);assert.deepEqual((await f.repo.load()).generation,initial());
});
