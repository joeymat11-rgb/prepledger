'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const {createR1Runtime}=require('./r1-workerd.cjs');
const {createDatabaseStorage}=require('../storage/database.cjs');
const {createPagedBridge}=require('../reconciliation/paged-bridge.cjs');
const C=require('../reconciliation/codec.cjs'),P=require('../reconciliation/paged-codec.cjs'),Sign=require('../crypto.cjs');
const h=P.hash('synthetic','paged-http');
const query=()=>({version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]});
function wrapped(db,cut){const wrap=(sql,s)=>({sql,s,bind(...x){return wrap(sql,s.bind(...x));}});return {prepare(sql){return wrap(sql,db.prepare(sql));},async batch(xs){await cut(xs);return db.batch(xs.map(x=>x.s));}};}
test('R1 ROWS HTTP — actual Worker/D1/P1 scoped inventory and fail-closed cut',async t=>{
 const r=await createR1Runtime({p1:true});t.after(()=>r.close());
 await r.bridge.initializeR1({first:{plan:{},devices:{}},second:{plan:{},devices:{}}},{'subject-first':'first','subject-second':'second'});
 const enrol=async(subject,id)=>(await r.bridge.enrollScoped(subject,{intent_id:id,schema_version:1,nonce:h})).payload.issuance.lease.device_id;
 const actor=await enrol('subject-first','one'),otherActor=await enrol('subject-first','two'),foreignActor=await enrol('subject-second','three');
 const lease=await r.bridge.invokeScoped('subject-first',actor,'lease',['first',actor]);
 const Ops=require('../../../client/ops.cjs');
 for(let i=1;i<=8;i++){
  const op=Ops.build({op_id:'rows-fact-'+i,athlete_id:'first',device_id:actor,device_seq:i,predecessor:i===1?null:'rows-fact-'+(i-1),parents:[],
   kind:'fact',class:'reading',lease_id:lease.lease_id,effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:160,unit:'lb'},note:'SYNTHETIC '+ 'x'.repeat(70000)}},r.identityKeys.first);
  const result=await r.bridge.invokeScoped('subject-first',actor,'admit',['first',op]);assert.equal(result.status,'ACCEPTED',result.reason);
 }
 const begin={profile:P.DOMAINS.begin,device_id:actor,request:query(),basis_digest:h};
 const storage=createDatabaseStorage(r.db,r.storage),context={issuer:r.issuer.config.issuer,origin:r.issuer.config.origins[0]};
 const verifier=P.createRowsVerifier({keys:[Sign.publicKeyOf(r.authorityKey)],subtle:webcrypto.subtle});
 async function originals(){const loaded=await r.db.batch([r.db.prepare('SELECT revision FROM authority_revision WHERE id=1'),storage.controlStatement(),r.db.prepare('SELECT '+storage.rowColumns+' FROM authority_rows WHERE athlete=? ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY').bind('first')]);await storage.load(loaded[1],loaded[2].results,loaded[0].results[0].revision);return loaded[2].results;}
 const expected={scopeDigest:C.scopeDigest({...context,subject:'subject-first',athleteId:'first',actorDeviceId:actor}),nonce:h,contextId:h,requestDigest:C.hash('request',C.encode(begin.request)),basisDigest:h,claimSetDigest:P.hash('claims',[]),mode:'CURRENT_DEVICE'};
 let first,last,passed=0;
 const check=(name,fn)=>t.test(name,async()=>{await fn();passed++;});
 await check('valid writer-created account completes over real HTTP with exact bytes and no domain writes',async()=>{
  const before=(await r.db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision,wanted=await originals(),all=[];
  let request=begin,previous=null;
  require('../reconciliation/project.cjs').validateRetained(wanted,'first');
  assert(wanted.reduce((n,row)=>n+Buffer.byteLength(row.value),0)>1048576,'Writer-created complete inventory exceeds old 1MiB transport payload');
  for(let i=0;i<64;i++){
   const response=await r.request('/reconcile/rows',request);assert.equal(response.status,200,JSON.stringify(response.body));assert.equal(response.stats.domainWrites,0);assert.equal(response.stats.statements,6);
   const verified=await verifier.verify(C.encode(response.body),{expected,previousCursor:previous});assert.equal(verified.verified,true,JSON.stringify(verified));assert.equal(verified.kind,'rows-v3-inventory-chunk');assert.equal(verified.complete,undefined);
   first??=response.body;last=response.body;
   all.push(...response.body.page.rows.map(x=>({athlete:'first',collection:x.collection,row_id:C.text(C.decode64(x.row_id_b64)),value:C.text(C.decode64(x.value_b64))})));
   if(response.body.finish)break;
   previous=response.body.page.next_cursor;request={profile:P.DOMAINS.continue,device_id:actor,manifest:response.body.manifest,cursor:previous};
  }
  assert(last.finish);assert.deepEqual(all,wanted);assert.equal((await r.db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision,before);
 });
 const continuation=()=>({profile:P.DOMAINS.continue,device_id:actor,manifest:first.manifest,cursor:first.page.next_cursor});
 await check('identical retry/lost reply repeats inventory exactly without advancing source revision',async()=>{
  const a=await r.request('/reconcile/rows',continuation()),b=await r.request('/reconcile/rows',continuation());assert.equal(a.status,200);assert.equal(b.status,200);
  assert.deepEqual(a.body.page.rows,b.body.page.rows);assert.equal(P.cursorReference(a.body.page.next_cursor),P.cursorReference(b.body.page.next_cursor));assert.equal(a.body.page.chain_digest,b.body.page.chain_digest);
 });
 await check('same-account alternate device and foreign subject cannot reuse a signed actor-bound continuation',async()=>{
  for(const [device,subject]of [[otherActor,'subject-first'],[foreignActor,'subject-second'],[actor,'absent']]){
   const out=await r.request('/reconcile/rows',{...continuation(),device_id:device},subject);assert.equal(out.status,403);assert.equal(out.body.error.state,17);assert.equal(out.body.page,undefined);
  }
 });
 await check('forged cursor, duplicate field and unknown athlete selector never produce a page',async()=>{
  const forged=structuredClone(continuation());forged.cursor.index++;
  assert.equal((await r.request('/reconcile/rows',forged)).status,400);
  assert.equal((await r.request('/reconcile/rows',{...begin,athlete_id:'first'})).status,400);
  const raw=JSON.stringify(begin).replace('"device_id":','"device_id":"extra","device_id":');
  const res=await fetch(new URL('/reconcile/rows',r.url),{method:'POST',headers:{'content-type':'application/json',Origin:context.origin,Authorization:'Bearer '+r.issuer.token('subject-first')},body:raw});assert.equal(res.status,400);
  const bom=await fetch(new URL('/reconcile/rows',r.url),{method:'POST',headers:{'content-type':'application/json',Origin:context.origin,Authorization:'Bearer '+r.issuer.token('subject-first')},body:'\ufeff'+JSON.stringify(begin)});assert.equal(bom.status,400);
 });
 await check('new route keeps old request cap; begin has its own 1MiB limit',async()=>{
  // Use the real application isolate dispatch for rejected oversized bodies:
  // loopback HTTP may reset while the intentionally unread upload is in flight.
  const send=(route,body)=>r.mf.dispatchFetch(new URL(route,r.url),{method:'POST',headers:{'content-type':'application/json',Origin:context.origin,Authorization:'Bearer '+r.issuer.token('subject-first')},body:JSON.stringify(body)});
  const out=await send('/reconcile/rows',{...begin,device_id:'x'.repeat(1048576)});assert.equal(out.status,400);assert.equal((await out.json()).error.code,'ROWS_REQUEST_LIMIT');
  const old=await send('/reconcile',{padding:'x'.repeat(1048576)});assert.equal(old.status,413);
 });
 await check('real HTTP transports a >1MiB row key without dropping or normalizing it',async()=>{
  const before=await r.db.batch([r.db.prepare('SELECT revision FROM authority_revision WHERE id=1'),storage.controlStatement()]);
  const rev=before[0].results[0].revision,control=await storage.load(before[1],[],rev);
  // Deliberately generic inventory fixture, not a profile-valid history event.
  const large={athlete:'first',collection:'history',row_id:'large-'+ 'k'.repeat(1200000),value:' {"synthetic":"e\u0301"} '};
  await r.db.batch([storage.guard(rev,control),await storage.write(large,rev,control),r.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
  let request=begin,previous=null,found=false,finished=false;
  for(let i=0;i<64;i++){
   const out=await r.request('/reconcile/rows',request);assert.equal(out.status,200,JSON.stringify(out.body.error));
   assert.equal((await verifier.verify(C.encode(out.body),{expected,previousCursor:previous})).verified,true);
   for(const row of out.body.page.rows)if(C.text(C.decode64(row.row_id_b64,P.LIMITS.row))===large.row_id){found=true;assert.equal(out.body.page.rows.length,1);assert.equal(C.text(C.decode64(row.value_b64)),large.value);assert(out.responseBytes>1048576);}
   if(out.body.finish){finished=true;break;}previous=out.body.page.next_cursor;
   request={profile:P.DOMAINS.continue,device_id:actor,manifest:out.body.manifest,cursor:previous};
  }
  assert(found&&finished);
 });
 await check('real other-athlete write during final cut refuses; fresh snapshot succeeds',async()=>{
  let hit=false;
  const db=wrapped(r.db,async xs=>{if(!hit&&xs[0].sql.startsWith('UPDATE authority_revision')){hit=true;await r.bridge.enrollScoped('subject-second',{intent_id:'concurrent-four',schema_version:1,nonce:h});}});
  const bridge=createPagedBridge({db,storage:r.storage,authorityKey:r.authorityKey,r1:{issuer:context.issuer,origin:context.origin}});
  await assert.rejects(bridge.read('subject-first',C.encode(begin),context),e=>e.code==='SNAPSHOT_CHANGED'&&e.retryable===true);assert(hit);
  const old=await r.request('/reconcile/rows',continuation());assert.equal(old.status,409);assert.equal(old.body.error.code,'SNAPSHOT_CHANGED');
  const fresh=await r.request('/reconcile/rows',begin);assert.equal(fresh.status,200);
 });
 await check('known device revocation is checked through actual issuer before another page',async()=>{
  const fresh=await r.request('/reconcile/rows',begin);assert.equal(fresh.status,200);
  await r.bridge.invoke('revokeDevice',['first',actor]);
  const denied=await r.request('/reconcile/rows',{profile:P.DOMAINS.continue,device_id:actor,manifest:fresh.body.manifest,cursor:fresh.body.page.next_cursor});assert.equal(denied.status,403);assert.equal(denied.body.error.state,17);
 });
 await check('missing revision after read cannot make a zero-row guard a successful proof',async()=>{
  let hit=false;
  const db=wrapped(r.db,async xs=>{if(!hit&&xs[0].sql.startsWith('UPDATE authority_revision')){hit=true;await r.db.prepare('DELETE FROM authority_revision WHERE id=1').run();}});
  const bridge=createPagedBridge({db,storage:r.storage,authorityKey:r.authorityKey,r1:{issuer:context.issuer,origin:context.origin}});
  await assert.rejects(bridge.read('subject-first',C.encode({...begin,device_id:otherActor}),context),e=>e.code==='RETAINED_INTEGRITY');assert(hit);
 });
 console.log('R1 ROWS HTTP '+(passed===9?'PASS':'FAIL')+' — '+passed+'/9 cases; actual Worker/D1/P1 + generated signatures; complete writer-created inventory; NOT staged-profile, resource or activation acceptance');
});
