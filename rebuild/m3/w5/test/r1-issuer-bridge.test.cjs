'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { randomBytes } = require('node:crypto');
const { createLocalD1 } = require('../local-d1.cjs');
const { createBridge } = require('../bridge.cjs'), { buildCore } = require('../build.cjs');
const { generateSigningKey, publicKeyOf, verifyLease } = require('../crypto.cjs');
const { build } = require('../../../client/ops.cjs');
const C = require('../reconciliation/codec.cjs');
const NOW = '2026-09-06T12:00:00.000Z';
const issuer = 'https://issuer.r1-test.invalid', origin = 'https://today.r1-test.invalid';
const nonce = () => randomBytes(32).toString('base64url');
const controls = id => ({intent_id:id,schema_version:1,nonce:nonce()});
async function migrate(db) {
  const sql = fs.readFileSync(path.join(__dirname,'../migrations/0002_reconciliation.sql'),'utf8').replace(/--[^\n]*/g,'');
  const statements = sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm);
  assert.equal(statements.length,6);
  await db.batch(statements.map(s => db.prepare(s)));
}
async function fixture(t, options = {}) {
  const runtime = await createLocalD1(); t.after(() => runtime.close()); await migrate(runtime.db);
  const key = generateSigningKey('r1-issuer-test'), identities = {first:'synthetic-first-key',second:'synthetic-second-key'};
  const config = {db:runtime.db,authorityKey:key,identityKeys:identities,clock:() => NOW,
    reconciliationProfile:'earned/r1/v1',r1:{issuer,origin},...options};
  const bridge = createBridge(config);
  assert.deepEqual(await bridge.initializeR1({first:{plan:{steps:8000},devices:{}},second:{plan:{steps:9000},devices:{}}},
    {subject1:'first',subject2:'second'}),{initialized:true});
  return {runtime,key,identities,config,bridge};
}
async function enroll(f,id='enroll-a',subject='subject1') {
  const request = controls(id), result = await f.bridge.enrollScoped(subject,request);
  assert.ok(result.payload?.issuance); return {request,result,device:result.payload.issuance.lease.device_id,lease:result.payload.issuance.lease};
}
function renewal(enrolled,id='renew-a') {return {device_id:enrolled.device,intent_id:id,expected_creation_epoch:1,
  expected_lease_id:enrolled.lease.lease_id,schema_version:1,nonce:nonce()};}
function operation(f,e,seq=1,extra={}) {return build({op_id:'op-'+e.device+'-'+seq,athlete_id:'first',device_id:e.device,
  device_seq:seq,predecessor:seq>1?'op-'+e.device+'-'+(seq-1):null,parents:[],kind:'fact',class:'reading',
  lease_id:e.lease.lease_id,effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},
  payload:{lb:{value:160,unit:'lb'},note:'caf\u00e9'},...extra},f.identities.first);}
function request(claims=[],mode='ACCOUNT_RECOVERY'){return {version:'earned/reconcile-request-1m/v1',mode,nonce:nonce(),context_id:nonce(),
  claims:claims.map((op,i)=>({claim_id:'claim-'+i,envelope_b64:C.encode64(C.encode(op))})),requested_lease_ids:[]};}
async function rows(db){return (await db.prepare('SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id').all()).results;}
test.before(async () => {await buildCore();});

test('R1 issuance is durable, immutable and exact-intent idempotent across fresh nonce',async t=>{
  const f=await fixture(t),a=await enroll(f);
  assert.deepEqual(a.lease.range,[1,1048576]); assert.equal(Date.parse(a.lease.not_after)-Date.parse(a.lease.not_before),30*86400000);
  assert.equal(verifyLease(a.lease,publicKeyOf(f.key)),true);
  const repeat=await f.bridge.enrollScoped('subject1',{...a.request,nonce:nonce()});
  assert.deepEqual(repeat.payload,a.result.payload); assert.equal(repeat.intentDigest,a.result.intentDigest);
  const r=renewal(a),newer=await f.bridge.renewScoped('subject1',a.device,r);
  assert.deepEqual(newer.payload.issuance.lease.range,[1,2097152]); assert.equal(newer.payload.current_standing.creation_epoch,2);
  assert.deepEqual((await f.bridge.renewScoped('subject1',a.device,{...r,nonce:nonce()})).payload,newer.payload);
  await assert.rejects(f.bridge.renewScoped('subject1',a.device,{...r,expected_creation_epoch:2,nonce:nonce()}),{code:'INTENT_CONFLICT'});
  const old=await f.bridge.enrollScoped('subject1',{...a.request,nonce:nonce()});
  assert.deepEqual(old.payload.issuance,a.result.payload.issuance); assert.equal(old.payload.current_standing.creation_epoch,2);
  await assert.rejects(f.runtime.db.prepare("UPDATE authority_rows SET value=value WHERE collection='issuedLeases'").run(),/r1_immutable_row/);
  await assert.rejects(f.runtime.db.prepare("DELETE FROM authority_rows WHERE collection='enrollmentIntents'").run(),/r1_immutable_row/);
});
test('two independent renewal intents at one epoch have one durable winner',async t=>{
  const f=await fixture(t),a=await enroll(f),b=createBridge(f.config);
  const results=await Promise.allSettled([f.bridge.renewScoped('subject1',a.device,renewal(a,'one')),b.renewScoped('subject1',a.device,renewal(a,'two'))]);
  assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
  assert.equal(results.find(x=>x.status==='rejected').reason.code,'STALE_CREATION');
  assert.equal((await rows(f.runtime.db)).filter(r=>r.collection==='issuedLeases'&&r.athlete==='first').length,2);
});
test('old source lease still admits after renewal and dedicated B recovery; /op actor binding remains exact',async t=>{
  const f=await fixture(t),a=await enroll(f),b=await enroll(f,'enroll-b'),op=operation(f,a);
  await f.bridge.renewScoped('subject1',a.device,renewal(a));
  await assert.rejects(f.bridge.invokeScoped('subject1',b.device,'admit',['first',op]),{code:'SCOPE_FORBIDDEN'});
  const result=await f.bridge.recoveryReplayScoped('subject1',b.device,{envelope:op,envelopeBytes:C.encode(op)});
  assert.equal(C.parse(C.decode64(result.payload.disposition_bytes_b64)).status,'ACCEPTED');
  assert.deepEqual((await f.bridge.recoveryReplayScoped('subject1',b.device,{envelope:op,envelopeBytes:C.encode(op)})).payload,result.payload);
  assert.equal((await f.bridge.invokeScoped('subject1',b.device,'receipts',['first',0])).length,1);
});
test('WAITING old lease drains through the historical resolver after later renewal',async t=>{
  const f=await fixture(t),a=await enroll(f),b=await enroll(f,'enroll-b');
  const parent=operation(f,a,1),child=operation(f,b,1,{op_id:'waiting-child',parents:[parent.op_id]});
  assert.equal((await f.bridge.invokeScoped('subject1',b.device,'admit',['first',child])).status,'WAITING');
  await f.bridge.renewScoped('subject1',b.device,renewal(b));
  await f.bridge.renewScoped('subject1',a.device,renewal(a));
  assert.equal((await f.bridge.invokeScoped('subject1',a.device,'admit',['first',parent])).status,'ACCEPTED');
  const proof=await f.bridge.reconcileScoped('subject1',b.device,request([child]));
  assert.equal(proof.payload.claims[0].outcome,'KNOWN_TERMINAL'); assert.equal(proof.payload.accepted.W,2);
});
test('canonical alias recovery returns stored evidence without accepting the divergent bytes',async t=>{
  const f=await fixture(t),a=await enroll(f),b=await enroll(f,'enroll-b'),op=operation(f,a);
  await f.bridge.invokeScoped('subject1',a.device,'admit',['first',op]);
  const alias=structuredClone(op); alias.payload.note='cafe\u0301';
  assert.equal(alias.canonical_content_commitment,op.canonical_content_commitment);
  const before=await rows(f.runtime.db),result=await f.bridge.recoveryReplayScoped('subject1',b.device,{envelope:alias,envelopeBytes:C.encode(alias)});
  assert.equal(result.payload.outcome,'ENVELOPE_MISMATCH');
  assert.equal(C.parse(C.decode64(result.payload.authority_record.operation_row.value_b64)).op.payload.note,'caf\u00e9');
  assert.equal(C.parse(C.decode64(result.payload.disposition_bytes_b64)).status,'ACCEPTED');
  assert.deepEqual(await rows(f.runtime.db),before);
  const alteredSource={...op,device_id:b.device,lease_id:b.lease.lease_id};
  const sourceMismatch=await f.bridge.recoveryReplayScoped('subject1',b.device,{envelope:alteredSource,envelopeBytes:C.encode(alteredSource)});
  assert.equal(sourceMismatch.payload.outcome,'ENVELOPE_MISMATCH');
  assert.equal(C.parse(C.decode64(sourceMismatch.payload.authority_record.operation_row.value_b64)).op.device_id,a.device);
  const alteredSequence={...op,device_seq:2};
  assert.equal((await f.bridge.recoveryReplayScoped('subject1',b.device,{envelope:alteredSequence,envelopeBytes:C.encode(alteredSequence)})).payload.outcome,'ENVELOPE_MISMATCH');
  assert.deepEqual(await rows(f.runtime.db),before);
});
test('complete guarded projection preserves persisted JSON bytes and contains only own account',async t=>{
  const f=await fixture(t),a=await enroll(f),other=await enroll(f,'other','subject2'); void other;
  const metadata=(await rows(f.runtime.db)).find(r=>r.athlete==='first'&&r.collection==='metadata');
  const whitespace='  '+metadata.value+' \n';
  await f.runtime.db.prepare("UPDATE authority_rows SET value=? WHERE athlete='first' AND collection='metadata'").bind(whitespace).run();
  const before=await rows(f.runtime.db),proof=await f.bridge.reconcileScoped('subject1',a.device,request());
  assert.equal(C.text(C.decode64(proof.payload.retained_rows.find(r=>r.collection==='metadata').value_b64)),whitespace);
  assert.equal(JSON.stringify(proof.payload).includes('second'),false); assert.deepEqual(await rows(f.runtime.db),before);
  await assert.rejects(f.bridge.reconcileScoped('subject1',a.device,request(),nonce()),{code:'SNAPSHOT_CHANGED'});
});

test('guarded read projection never constructs the writer core and still checks foreign JSON integrity',async t=>{
  const f=await fixture(t),a=await enroll(f),before=await rows(f.runtime.db);
  const reader=createBridge({...f.config,core:{createAuthority(){throw Error('writer core must not run for a proof');}}});
  assert.equal((await reader.reconcileScoped('subject1',a.device,request())).payload.scope.actor_device_id,a.device);
  assert.deepEqual(await rows(f.runtime.db),before);
  await f.runtime.db.prepare("UPDATE authority_rows SET value=? WHERE athlete='second' AND collection='metadata' AND row_id='state'")
    .bind('{"devices":{},"devices":{},"initialPlan":{"steps":9000}}').run();
  await assert.rejects(reader.reconcileScoped('subject1',a.device,request()),{code:'RETAINED_INTEGRITY'});
});
test('missing registry, unknown subject, mixed scope and closure cannot fall through legacy routes',async t=>{
  const f=await fixture(t),a=await enroll(f);
  await assert.rejects(f.bridge.enrollScoped('unknown',controls('x')),{code:'SCOPE_FORBIDDEN'});
  await assert.rejects(f.bridge.enrollScoped('subject1',controls('x'),{issuer,origin:'https://foreign.invalid'}),{code:'SCOPE_FORBIDDEN'});
  const foreign=operation(f,a); foreign.athlete_id='second';
  await assert.rejects(f.bridge.recoveryReplayScoped('subject1',a.device,{envelope:foreign,envelopeBytes:C.encode(foreign)}),{code:'SCOPE_FORBIDDEN'});
  await f.bridge.closeAccount('first');
  await assert.rejects(f.bridge.enrollScoped('subject1',{...a.request,nonce:nonce()}),{code:'SCOPE_FORBIDDEN'});
  await assert.rejects(f.bridge.invokeScoped('subject1',a.device,'scope'),{code:'SCOPE_FORBIDDEN'});
  await f.runtime.db.prepare("DELETE FROM authority_rows WHERE athlete='second' AND collection='accountRegistry'").run();
  await assert.rejects(f.bridge.enrollScoped('subject2',controls('later')),{code:'UNAVAILABLE'});
});
test('revoked old source keeps original barrier and immutable warning; actor cannot regain standing by intent replay',async t=>{
  const f=await fixture(t),a=await enroll(f),b=await enroll(f,'enroll-b');
  const revocation=await f.bridge.invoke('revokeDevice',['first',a.device]);
  assert.equal(revocation.barrier,0); assert.equal(revocation.declared_loss,true);
  const op=operation(f,a),result=await f.bridge.recoveryReplayScoped('subject1',b.device,{envelope:op,envelopeBytes:C.encode(op)});
  assert.equal(C.parse(C.decode64(result.payload.disposition_bytes_b64)).rejection_code,'LEASE_REVOKED_BEYOND_BARRIER');
  await assert.rejects(f.bridge.enrollScoped('subject1',{...a.request,nonce:nonce()}),{code:'SCOPE_FORBIDDEN'});
  assert.deepEqual((await rows(f.runtime.db)).filter(r=>r.collection==='standingEvents').map(r=>JSON.parse(r.value)).find(r=>r.kind==='DEVICE_REVOKED').evidence,revocation);
});
test('nonfinite and unrepresentable issuance clocks refuse without domain effects; exact durable replay needs no clock',async t=>{
  const f=await fixture(t),a=await enroll(f),before=await rows(f.runtime.db);
  for(const value of [NaN,Infinity,-Infinity,8640000000000000,'not-a-date']){
    let calls=0; const bridge=createBridge({...f.config,clock:()=>{calls++;return value;}});
    await assert.rejects(bridge.renewScoped('subject1',a.device,renewal(a,'bad-clock')),{code:'CLOCK_UNAVAILABLE',status:500,retryable:true});
    assert.equal(calls,1); assert.deepEqual(await rows(f.runtime.db),before);
    assert.deepEqual((await bridge.enrollScoped('subject1',{...a.request,nonce:nonce()})).payload.issuance,a.result.payload.issuance);
    assert.equal(calls,1);
  }
});
test('failure at every guarded issuance batch cut leaves no partial domain rows',async t=>{
  const f=await fixture(t),before=await rows(f.runtime.db);
  for(let cut=1;cut<=6;cut++){
    const wrap=(text,s)=>({text,s,bind(...args){return wrap(text,s.bind(...args));}});
    const wrapped={prepare(text){return wrap(text,f.runtime.db.prepare(text));},
      batch(statements){if(statements[0].text.startsWith('UPDATE authority_revision')){
        const altered=statements.map(x=>x.s);altered.splice(Math.min(cut,altered.length),0,f.runtime.db.prepare('SELECT missing_r1_failure_cut_column'));
        return f.runtime.db.batch(altered);
      }return f.runtime.db.batch(statements.map(x=>x.s));}};
    const result=await createBridge({...f.config,db:wrapped}).enrollScoped('subject1',controls('cut-'+cut));
    assert.equal(result.status,'UNAVAILABLE');assert.deepEqual(await rows(f.runtime.db),before);
  }
});
test('lost durable issuance acknowledgement retries original intent instead of minting twice',async t=>{
  const f=await fixture(t),request=controls('lost-reply');let lost=false;
  const wrap=(text,s)=>({text,s,bind(...args){return wrap(text,s.bind(...args));}});
  const wrapped={prepare(text){return wrap(text,f.runtime.db.prepare(text));},async batch(statements){
    const result=await f.runtime.db.batch(statements.map(x=>x.s));
    if(!lost&&statements[0].text.startsWith('UPDATE authority_revision')){lost=true;throw new Error('fetch failed after durable commit');}
    return result;
  }};
  const issued=await createBridge({...f.config,db:wrapped}).enrollScoped('subject1',request);
  assert.equal(lost,true);assert.ok(issued.payload.issuance);
  assert.equal((await rows(f.runtime.db)).filter(r=>r.athlete==='first'&&r.collection==='issuedLeases').length,1);
  assert.deepEqual((await f.bridge.enrollScoped('subject1',{...request,nonce:nonce()})).payload,issued.payload);
});
test('issuer arithmetic boundary unit: last representable range/counter and exact replay at exhaustion',()=>{
  // A finite synthetic staged boundary tests arithmetic, not a claim that a
  // one-row fixture proves the omitted 2^53 issuance lineage is complete.
  const I=require('../reconciliation/issuer.cjs'),{memoryBackend,rowKey}=require('../../../authority/store.cjs');
  const {signLease}=require('../crypto.cjs'),key=generateSigningKey('r1-boundary'),MAX=Number.MAX_SAFE_INTEGER;
  function staged(hi,ordinal){
    const lease=signLease({lease_id:'old',athlete_id:'first',device_id:'a',schema_version:1,range:[1,hi],
      not_before:NOW,not_after:'2026-10-06T12:00:00.000Z',issued_server_time:NOW},key);
    const issued={lease,lease_bytes_b64:C.encode64(C.encode(lease)),issuer_profile:I.PROFILE,issue_ordinal:ordinal,
      issuance_intent_digest:nonce(),account_epoch:1,creation_epoch:ordinal};
    const data=[['metadata','state',{seq:0,initialPlan:{},devices:{a:{lease}}}],['accountRegistry','state',{profile:I.PROFILE,account_epoch:1,state:'ACTIVE',history_origin:'PROFILE_GENESIS'}],
      ['deviceIssuance','a',{device_id:'a',current_lease_id:'old',creation_epoch:ordinal,issue_ordinal:ordinal}],['issuedLeases',JSON.stringify(['a','old']),issued]];
    return {backend:memoryBackend(data.map(([table,id,value])=>[rowKey('first',table,id),value])),athlete:'first',authorityKey:key,clock:()=>NOW,config:{}};
  }
  const r={device_id:'a',intent_id:'last',expected_creation_epoch:1,expected_lease_id:'old',schema_version:1,nonce:nonce()};
  const finalRange=staged(MAX-1,1),result=I.renew(finalRange,'a',r);
  assert.equal(result.issuance.lease.range[1],MAX);assert.ok(Number.isSafeInteger(result.issuance.lease.range[1]));
  assert.deepEqual(I.renew({...finalRange,clock:()=>{throw Error('must not sample');}},'a',{...r,nonce:nonce()}),result);
  const before=finalRange.backend.snapshot();
  assert.throws(()=>I.renew(finalRange,'a',{...r,intent_id:'exhausted',expected_creation_epoch:2,expected_lease_id:result.issuance.lease.lease_id}),{code:'ISSUANCE_EXHAUSTED',status:409,retryable:false});
  assert.deepEqual(finalRange.backend.snapshot(),before);
  const finalCounter=staged(1048576,MAX-1),counterResult=I.renew(finalCounter,'a',{...r,expected_creation_epoch:MAX-1});
  assert.equal(counterResult.issuance.creation_epoch,MAX);assert.equal(counterResult.issuance.issue_ordinal,MAX);
  assert.throws(()=>I.renew(finalCounter,'a',{...r,intent_id:'counter-exhausted',expected_creation_epoch:MAX,expected_lease_id:counterResult.issuance.lease.lease_id}),{code:'ISSUANCE_EXHAUSTED'});
});
test('SQL rejects null/unsafe counter fields and prevents immutable collection relabeling',async t=>{
  const f=await fixture(t),a=await enroll(f);
  const malformed={device_id:'bad',creation_epoch:null,current_lease_id:'lease-bad',issue_ordinal:1};
  await assert.rejects(f.runtime.db.prepare('INSERT INTO authority_rows VALUES (?,?,?,?)').bind('first','deviceIssuance','bad',JSON.stringify(malformed)).run(),/r1_invalid_device/);
  malformed.creation_epoch=9007199254740992;malformed.issue_ordinal=9007199254740992;
  await assert.rejects(f.runtime.db.prepare('INSERT INTO authority_rows VALUES (?,?,?,?)').bind('first','deviceIssuance','bad',JSON.stringify(malformed)).run(),/r1_invalid_device/);
  await assert.rejects(f.runtime.db.prepare("UPDATE authority_rows SET collection='anything' WHERE collection='issuedLeases'").run(),/r1_immutable_row/);
  await assert.rejects(f.runtime.db.prepare("UPDATE authority_rows SET value=json_set(value,'$.state',NULL) WHERE athlete='first' AND collection='accountRegistry'").run(),/r1_invalid_registry/);
  assert.ok(a.device);
});
test('mixed-profile foreign WAITING keeps its original bytes when R1 drains a different account',async t=>{
  const f=await fixture(t),a=await enroll(f);f.identities.legacy='synthetic-legacy-key';
  const {signLease}=require('../crypto.cjs');
  const lease=signLease({lease_id:'legacy-lease',athlete_id:'legacy',device_id:'legacy-phone',schema_version:1,range:[1,1000],
    not_before:NOW,not_after:'2026-10-06T12:00:00.000Z',issued_server_time:NOW},f.key);
  const legacy=createBridge({...f.config,reconciliationProfile:undefined});
  await legacy.initialize({legacy:{plan:{steps:7000},devices:{'legacy-phone':{lease}}}},{'legacy-subject':'legacy'});
  const waiting=build({op_id:'legacy-waiting',athlete_id:'legacy',device_id:'legacy-phone',device_seq:1,predecessor:null,
    parents:['legacy-parent-not-arrived'],kind:'fact',class:'reading',lease_id:lease.lease_id,
    effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:170,unit:'lb'}}},f.identities.legacy);
  assert.equal((await legacy.invoke('admit',['legacy',waiting])).status,'WAITING');
  const before=(await rows(f.runtime.db)).filter(r=>r.athlete==='legacy');
  assert.equal((await f.bridge.invokeScoped('subject1',a.device,'admit',['first',operation(f,a)])).status,'ACCEPTED');
  const after=(await rows(f.runtime.db)).filter(r=>r.athlete==='legacy');
  const status=JSON.parse(after.find(r=>r.collection==='operations').value).disposition.status;
  assert.equal(status,'WAITING','R1 must not invent LEASE_UNKNOWN for an unconverted foreign account');
  assert.deepEqual(after,before);
});
