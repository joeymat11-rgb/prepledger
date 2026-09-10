'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const {createR1Runtime}=require('./r1-workerd.cjs'),{createBridge}=require('../bridge.cjs');
const {createDatabaseStorage}=require('../storage/database.cjs');
const C=require('../reconciliation/codec.cjs'),S=require('../source/codec.cjs'),Ops=require('../../../client/ops.cjs');
const BaseP=require('../reconciliation/paged-codec.cjs'),P=BaseP.createSourceRowsCodec(),Sign=require('../crypto.cjs');
const {validateRetained}=require('../reconciliation/project.cjs');
const h=S.hash('synthetic','source-import-join'),subject='subject-first';
async function fixture(t){
  const r=await createR1Runtime({p1:true,sourceProfile:S.PROFILE});t.after(()=>r.close());
  await r.bridge.initializeR1({first:{plan:{},devices:{}},second:{plan:{},devices:{}}},{[subject]:'first','subject-second':'second'});
  const enroll=async(name,who=subject)=>(await r.bridge.enrollScoped(who,{intent_id:name,schema_version:1,nonce:h})).payload.issuance.lease;
  const a=await enroll('a'),b=await enroll('b'),other=await enroll('other','subject-second');
  const counters=new Map(),latest=new Map();
  const op=(lease,extra={})=>{
    const seq=(counters.get(lease.device_id)||0)+1,predecessor=latest.get(lease.device_id)||null;
    counters.set(lease.device_id,seq);const op_id='op-'+lease.device_id+'-'+seq;latest.set(lease.device_id,op_id);
    return Ops.build({op_id,athlete_id:lease.athlete_id,device_id:lease.device_id,device_seq:seq,predecessor,parents:[],
      kind:'fact',class:'reading',lease_id:lease.lease_id,effective:{local_date:'2026-09-04',local_time:'12:00',utc_offset:'-04:00'},
      payload:{lb:{value:170+seq,unit:'lb'},note:'SYNTHETIC later fact'},...extra},r.identityKeys[lease.athlete_id]);
  };
  const storage=createDatabaseStorage(r.db,r.storage);
  async function rows(){
    const out=await r.db.batch([r.db.prepare('SELECT revision FROM authority_revision WHERE id=1'),storage.controlStatement(),
      r.db.prepare('SELECT '+storage.rowColumns+' FROM authority_rows WHERE athlete=? ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY').bind('first')]);
    await storage.load(out[1],out[2].results,out[0].results[0].revision);return out[2].results;
  }
  function state(raw){
    const base=validateRetained(raw.filter(r=>r.collection!==S.COLLECTION),'first'),get=(table,id)=>base.val(table,id);
    return S.validateSourceRows(raw.filter(r=>r.collection===S.COLLECTION).map(r=>[r.row_id,C.parse(r.value)]),get,base.metadata.seq);
  }
  const current=async()=>state(await rows()),context={issuer:r.issuer.config.issuer,origin:r.issuer.config.origins[0]};
  const config={db:r.db,authorityKey:r.authorityKey,identityKeys:r.identityKeys,clock:()=>r.NOW,reconciliationProfile:C.PROFILE,
    r1:context,storage:r.storage,sourceProfile:S.PROFILE};
  const send=(body,who=subject)=>r.request('/import',body,who);
  const request=(action,fields={},lease=a)=>({profile:S.PROFILE,device_id:lease.device_id,action,...fields});
  async function stage(sourceId='source-a',upload=true){
    const expected=(await current()).frontier;
    const checkpoint={revision:7,token:'synthetic-checkpoint',generation:{collections:{sync:{frontier:{W:expected.W,authorityW:expected.W}},
      ops:{},outbox:{},meta:{checkpoint:{counts:{ops:0,outbox:0}}}},metadata:{synthetic:true}}};
    const material={source_json:' { "v":60, "note":"SYNTHETIC café e\u0301 '+ 'x'.repeat(70000)+'" }\r\n',
      candidate_json:'{"v":60,"note":"SYNTHETIC candidate"}',local_json:'{"v":60,"note":"SYNTHETIC original local"}',
      checkpoint_json:JSON.stringify(checkpoint),engine_context_json:'{"build":"synthetic-engine","clock":"2026-09-04"}'};
    const prepared=S.prepareMaterial(sourceId,material,expected);
    const manifest=request('manifest',{manifest:prepared.manifest});
    assert.equal((await send(manifest)).status,200);
    const chunks=prepared.chunks.map((data_b64,index)=>request('chunk',{source_id:sourceId,index,data_b64}));
    if(upload)for(const chunk of chunks)assert.equal((await send(chunk)).status,200);
    return {sourceId,expected,material,prepared,manifest,chunks};
  }
  function intent(staged,action='activate',lease=a,target=null){
    const payload={type:action==='activate'?'source-import-intent':'source-rollback-intent',
      interval:{start:'2026-09-04',end:'2026-09-04'},source_id:staged.sourceId,material_digest:staged.prepared.manifest.material_digest};
    if(action==='rollback')payload.target_activation_id=target;
    return op(lease,{class:'event',payload});
  }
  async function proof(){
    const q={version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:h,context_id:h,claims:[],requested_lease_ids:[]};
    let req={profile:P.DOMAINS.begin,device_id:b.device_id,request:q,basis_digest:h},previous=null;
    const expected={scopeDigest:C.scopeDigest({...context,subject,athleteId:'first',actorDeviceId:b.device_id}),nonce:h,contextId:h,
      requestDigest:C.hash('request',C.encode(q)),basisDigest:h,claimSetDigest:P.hash('claims',[]),mode:q.mode};
    const verifier=P.createRowsVerifier({keys:[Sign.publicKeyOf(r.authorityKey)],subtle:webcrypto.subtle}),all=[],pages=[];
    for(let n=0;n<100;n++){
      const out=await r.request('/reconcile/rows',req);assert.equal(out.status,200,JSON.stringify(out.body));
      assert.equal((await verifier.verify(C.encode(out.body),{expected,previousCursor:previous})).verified,true);
      pages.push(out.body);
      all.push(...out.body.page.rows.map(row=>({athlete:'first',collection:row.collection,row_id:C.text(C.decode64(row.row_id_b64)),value:C.text(C.decode64(row.value_b64))})));
      if(out.body.finish)return {rows:all,pages,expected,verifier};
      previous=out.body.page.next_cursor;req={profile:P.DOMAINS.continue,device_id:b.device_id,manifest:out.body.manifest,cursor:previous};
    }
    assert.fail('Complete inventory did not terminate');
  }
  return {...r,a,b,other,op,rows,current,state,config,send,request,stage,intent,proof};
}
test('real HTTP/P1 source activation, later device facts, signed complete recovery and repeated rollback retain originals',async t=>{
  const f=await fixture(t),s=await f.stage(),op=f.intent(s),request=f.request('activate',{source_id:s.sourceId,expected:s.expected,operation:op});
  const result=await f.send(request);assert.equal(result.status,200,JSON.stringify(result.body));assert.equal(result.body.status,'BOUND');
  assert.equal(result.body.binding.seq,1);assert.equal(result.body.binding.after.W,1);
  for(const lease of [f.b,f.b]){const fact=f.op(lease);const saved=await f.bridge.invokeScoped(subject,lease.device_id,'admit',['first',fact]);assert.equal(saved.status,'ACCEPTED');}
  assert.deepEqual((await f.send(request)).body,result.body,'Lost reply returns original binding after later facts');
  const recovered=await f.proof(),state=f.state(recovered.rows);
  assert.deepEqual(state.readMaterial(s.sourceId),s.material,'Cross-device signed inventory retains exact source text and checkpoint');
  assert.equal(state.frontier.W,3);assert.equal(state.current.intent_op_id,op.op_id);
  const rollbackOp=f.intent(s,'rollback',f.a,op.op_id);
  const rollback=f.request('rollback',{target_activation_id:op.op_id,expected:state.frontier,operation:rollbackOp});
  const undone=await f.send(rollback);assert.equal(undone.status,200,JSON.stringify(undone.body));
  assert.equal(undone.body.binding.action,'rollback');assert.equal(undone.body.binding.seq,4);
  assert.deepEqual((await f.send(rollback)).body,undone.body);
  const final=f.state((await f.proof()).rows);assert.equal(final.frontier.W,4);
  assert.deepEqual(final.readMaterial(s.sourceId),s.material);assert.equal(final.selections.length,2);
  const missing=recovered.rows.filter(row=>row.collection!==S.COLLECTION||!row.row_id.startsWith('["chunk",'));
  assert.throws(()=>f.state(missing),{code:'SOURCE_INCOMPLETE'},'Semantic recovery refuses even a purported inventory missing source chunks');
  const missingBinding=recovered.rows.filter(row=>row.collection!==S.COLLECTION||!row.row_id.startsWith('["selection",'));
  assert.equal(f.state(missingBinding).current,null,'An intent does not fabricate a binding when none is supplied');
  const logs=(await f.rows()).filter(r=>r.collection==='log');assert.equal(logs.length,4);
  assert.equal(logs.filter(r=>C.parse(r.value).op.class==='reading').length,2);
  const physical=await f.db.prepare("SELECT value,sealed FROM authority_rows WHERE collection='sourceImports'").all();
  assert(physical.results.every(r=>!r.value.includes('SYNTHETIC')&&!r.sealed.includes('SYNTHETIC')),'Originals stay inside P1 ciphertext');
  await assert.rejects(f.db.prepare("UPDATE authority_rows SET value=value WHERE collection='sourceImports'").run(),/source_imports_immutable/);
  await assert.rejects(f.db.prepare("DELETE FROM authority_rows WHERE collection='sourceImports'").run(),/source_imports_immutable/);
  const old=await BaseP.createRowsVerifier({keys:[Sign.publicKeyOf(f.authorityKey)],subtle:webcrypto.subtle}).verify(C.encode(recovered.pages[0]),{expected:recovered.expected});
  assert.equal(old.verified,false,'Old profile cannot consume source inventory');
  await assert.rejects(f.bridge.reconcileScoped(subject,f.b.device_id,{version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:h,context_id:h,claims:[],requested_lease_ids:[]}),{code:'PROFILE_UNSUPPORTED'});
  const tampered=structuredClone(recovered.pages[0]);tampered.page.rows[0].value_b64=C.encode64('{"forged":true}');
  assert.equal((await recovered.verifier.verify(C.encode(tampered),{expected:recovered.expected})).verified,false);
});
test('missing/changed source, ordinary accepted intent, stale preparation and wrong scope never acquire a binding',async t=>{
  const f=await fixture(t),s=await f.stage('source-missing',false),op=f.intent(s),req=f.request('activate',{source_id:s.sourceId,expected:s.expected,operation:op});
  assert.equal((await f.send(req)).body.error?.code,'SOURCE_INCOMPLETE');
  assert.equal((await f.current()).frontier.W,0);
  for(const chunk of s.chunks)assert.equal((await f.send(chunk)).status,200);
  const changed=structuredClone(s.chunks[0]);changed.data_b64=C.encode64('different');
  assert.equal((await f.send(changed)).body.error?.code,'SOURCE_CHUNK_DIGEST');
  assert.equal((await f.send({...req,device_id:f.other.device_id},'subject-second')).status,403);
  assert.equal((await f.bridge.invokeScoped(subject,f.a.device_id,'admit',['first',op])).status,'ACCEPTED');
  assert.equal((await f.send(req)).body.error?.code,'SOURCE_INTENT_ALREADY_RECORDED');
  assert.equal((await f.current()).current,null,'Generic accepted event remains intent only');
  const staged=await f.stage('stale'),candidate=f.intent(staged),remote=f.op(f.b);
  assert.equal((await f.bridge.invokeScoped(subject,f.b.device_id,'admit',['first',remote])).status,'ACCEPTED');
  assert.equal((await f.send(f.request('activate',{source_id:staged.sourceId,expected:staged.expected,operation:candidate}))).body.error?.code,'SOURCE_STALE_BASIS');
  assert.equal((await f.current()).current,null);
});
test('actual admission WAITING drain is included in the bound post-frontier and survives recovery',async t=>{
  const f=await fixture(t),s=await f.stage(),op=f.intent(s),child=f.op(f.b,{parents:[op.op_id]});
  assert.equal((await f.bridge.invokeScoped(subject,f.b.device_id,'admit',['first',child])).status,'WAITING');
  const result=await f.send(f.request('activate',{source_id:s.sourceId,expected:s.expected,operation:op}));
  assert.equal(result.status,200,JSON.stringify(result.body));assert.equal(result.body.binding.before.W,0);
  assert.equal(result.body.binding.seq,1);assert.equal(result.body.binding.after.W,2,'The released child advances the actual frontier');
  const state=f.state((await f.proof()).rows);assert.equal(state.frontier.W,2);
  assert.equal((await f.bridge.invokeScoped(subject,f.b.device_id,'disposition',['first',child.device_id,child.device_seq])).status,'ACCEPTED');
});

test('indexed source recovery checks actual bound records, drained prefix, rollback and immutable handles',async t=>{
  const f=await fixture(t),s=await f.stage(),activation=f.intent(s),child=f.op(f.b,{parents:[activation.op_id]});
  assert.equal((await f.bridge.invokeScoped(subject,f.b.device_id,'admit',['first',child])).status,'WAITING');
  assert.equal((await f.send(f.request('activate',{source_id:s.sourceId,expected:s.expected,operation:activation}))).status,200);
  const active=await f.current(),rollback=f.intent(s,'rollback',f.a,activation.op_id);
  assert.equal((await f.send(f.request('rollback',{target_activation_id:activation.op_id,expected:active.frontier,operation:rollback}))).status,200);
  const raw=(await f.proof()).rows,expected=f.state(raw),W=expected.frontier.W;
  // Only this small synthetic test adapter collects rows. Product recovery
  // uses its authenticated encrypted index and checks that same cut throughout.
  const records=()=>raw.map(r=>({...r,value:C.parse(r.value)}));
  function adapter(rows,assertStable=async()=>{},onGet=()=>{}){
    return {W,assertStable,each:async(collection,visit)=>{for(const r of rows)if(r.collection===collection)await visit(r.row_id,structuredClone(r.value));},
      get:async(collection,id)=>{await onGet(collection,id);return structuredClone(rows.find(r=>r.collection===collection&&r.row_id===id)?.value);}};
  }
  const reader=await S.validateIndexedSource(adapter(records()));
  assert.deepEqual(await reader.selection(),{current:expected.current,frontier:expected.frontier});
  assert.deepEqual(await reader.readMaterial(s.sourceId),s.material);
  const copy=await reader.selection();copy.current.source_id='caller-changed';copy.frontier.W=900;
  const content=await reader.readMaterial(s.sourceId);content.source_json='{"caller":"changed"}';
  assert.deepEqual(await reader.selection(),{current:expected.current,frontier:expected.frontier});
  assert.deepEqual(await reader.readMaterial(s.sourceId),s.material,'Caller changes cannot alter indexed originals');
  const sourceRow=(rows,id)=>rows.find(r=>r.collection===S.COLLECTION&&r.row_id===id).value;
  const cases=[
    ['missing selected chunk','SOURCE_INCOMPLETE',rows=>rows.filter(r=>r.collection!==S.COLLECTION||r.row_id!==S.id('chunk',s.sourceId,0))],
    ['changed source chunk','SOURCE_CHUNK_DIGEST',rows=>{const c=sourceRow(rows,S.id('chunk',s.sourceId,0)),bytes=C.decode64(c.data_b64);bytes[5]^=1;c.data_b64=C.encode64(bytes);return rows;}],
    ['changed component commitment','SOURCE_COMPONENT_DIGEST',rows=>{sourceRow(rows,S.id('manifest',s.sourceId)).manifest.component_digests.source_json=h;return rows;}],
    ['changed original prefix','SOURCE_FRONTIER',rows=>{sourceRow(rows,S.id('manifest',s.sourceId)).manifest.basis.log_digest=h;sourceRow(rows,S.id('selection',activation.op_id)).before.log_digest=h;return rows;}],
    ['changed drained prefix','SOURCE_FRONTIER',rows=>{sourceRow(rows,S.id('selection',activation.op_id)).after.log_digest=h;return rows;}],
    ['changed rollback target','SOURCE_INTENT',rows=>{sourceRow(rows,S.id('selection',rollback.op_id)).target_activation_id=rollback.op_id;return rows;}],
    ['missing issuing device','SOURCE_INTEGRITY',rows=>rows.filter(r=>r.collection!=='deviceIssuance')],
    ['different accepted original','SOURCE_INTEGRITY',rows=>{rows.find(r=>r.collection==='log'&&r.row_id==='1').value.op.payload.interval.end='2026-09-05';return rows;}],
  ];
  for(const [name,code,alter]of cases)await t.test(name,async()=>{
    await assert.rejects(S.validateIndexedSource(adapter(alter(records()))),{code},name);
  });
  let current=true,changeOnRead=false;
  const stable=async()=>{if(!current)C.fail('RECOVERY_STAGE_CHANGED');};
  const guarded=await S.validateIndexedSource(adapter(records(),stable,async(collection,id)=>{
    if(changeOnRead&&collection===S.COLLECTION&&id===S.id('chunk',s.sourceId,0))current=false;
  }));
  changeOnRead=true;
  await assert.rejects(guarded.readMaterial(s.sourceId),{code:'RECOVERY_STAGE_CHANGED'},'Changed cut during indexed material read refuses');
  await assert.rejects(guarded.selection(),{code:'RECOVERY_STAGE_CHANGED'},'Stale handle cannot expose selection');
  await assert.rejects(S.validateIndexedSource(adapter(records(),stable)),{code:'RECOVERY_STAGE_CHANGED'},'Retired input refuses before reading');
});
test('prepublication failure discards binding, and ambiguous committed reply retries exactly once',async t=>{
  const f=await fixture(t),s=await f.stage(),op=f.intent(s),request=f.request('activate',{source_id:s.sourceId,expected:s.expected,operation:op});
  const wrap=(callback)=>{const stmt=(sql,inner)=>({sql,inner,bind(...args){return stmt(sql,inner.bind(...args));}});
    return {prepare(sql){return stmt(sql,f.db.prepare(sql));},async batch(xs){return callback(xs,()=>f.db.batch(xs.map(s=>s.inner)));}};};
  let failed=false;
  const fault=createBridge({...f.config,maxAttempts:1,db:wrap(async(xs,run)=>{
    if(!failed&&xs.some(s=>s.sql.startsWith('INSERT INTO authority_rows'))){failed=true;throw Error('synthetic storage cut');}return run();
  })});
  assert.equal((await fault.sourceScoped(subject,C.encode(request))).status,'UNAVAILABLE');
  assert.equal((await f.current()).frontier.W,0);assert.equal((await f.current()).current,null);
  let lost=false;
  const ambiguous=createBridge({...f.config,db:wrap(async(xs,run)=>{
    const result=await run();if(!lost&&xs.some(s=>s.sql.startsWith('INSERT INTO authority_rows'))){lost=true;throw Error('fetch failed');}return result;
  })});
  const result=await ambiguous.sourceScoped(subject,C.encode(request));assert.equal(result.status,'BOUND');
  assert.equal((await f.current()).frontier.W,1);assert.equal((await f.current()).selections.length,1);
  const altered=structuredClone(request);altered.operation.payload.interval.end='2026-09-05';
  assert.equal((await f.send(altered)).body.error?.code,'SOURCE_INTENT_CONFLICT');
});
test('a real intervening D1 fact makes the prepared activation stale at the final CAS',async t=>{
  const f=await fixture(t),s=await f.stage(),op=f.intent(s),remote=f.op(f.b);
  const request=f.request('activate',{source_id:s.sourceId,expected:s.expected,operation:op});
  let raced=false;
  const statement=(sql,inner)=>({sql,inner,bind(...x){return statement(sql,inner.bind(...x));}});
  const db={prepare(sql){return statement(sql,f.db.prepare(sql));},async batch(xs){
    if(!raced&&xs.some(s=>s.sql.startsWith('INSERT INTO authority_rows'))){
      raced=true;assert.equal((await f.bridge.invokeScoped(subject,f.b.device_id,'admit',['first',remote])).status,'ACCEPTED');
    }
    return f.db.batch(xs.map(s=>s.inner));
  }};
  await assert.rejects(createBridge({...f.config,db}).sourceScoped(subject,C.encode(request)),{code:'SOURCE_STALE_BASIS'});
  assert(raced);const state=await f.current();assert.equal(state.frontier.W,1);assert.equal(state.current,null);
  assert.equal((await f.rows()).filter(r=>r.collection==='operations'&&C.parse(r.value).op.op_id===op.op_id).length,0);
});
