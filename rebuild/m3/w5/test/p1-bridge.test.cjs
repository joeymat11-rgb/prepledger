'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {randomBytes,webcrypto}=require('node:crypto');
const {createLocalD1}=require('../local-d1.cjs'),{createBridge}=require('../bridge.cjs'),{buildCore}=require('../build.cjs');
const K=require('../crypto.cjs'),C=require('../reconciliation/codec.cjs'),Ops=require('../../../client/ops.cjs');
const {createAuthorityRowCodec}=require('../storage/row-codec.cjs');
const PROFILE='earned/authority-row/v1',NS='synthetic-p1-storage',NOW='2026-09-06T12:00:00.000Z';
const nonce=()=>randomBytes(32).toString('base64url');
async function migration(db,name,count){
  const sql=fs.readFileSync(path.join(__dirname,'../migrations',name),'utf8').replace(/--[^\n]*/g,'');
  const parts=sql.match(/CREATE TRIGGER[\s\S]*?^END;|(?:CREATE TABLE|CREATE UNIQUE INDEX|INSERT INTO|DROP TABLE|ALTER TABLE)[\s\S]*?;/gm);
  assert.equal(parts.length,count);await db.batch(parts.map(x=>db.prepare(x)));
}
async function runtime(t,sealed=false){
  const r=await createLocalD1();t.after(()=>r.close());await migration(r.db,'0002_reconciliation.sql',6);
  if(sealed){await migration(r.db,'0003_payload_storage.sql',8);await r.db.prepare('INSERT INTO authority_storage VALUES(1,?,?,?)').bind(PROFILE,NS,'old').run();}
  return r;
}
async function makeProvider(){
  const epochs=new Map(),calls=[];
  for(const epoch of ['old','new','wrong']){
    const bytes=randomBytes(32);epochs.set(epoch,{
      write:await webcrypto.subtle.importKey('raw',bytes,'AES-KW',false,['wrapKey']),
      read:await webcrypto.subtle.importKey('raw',bytes,'AES-KW',false,['unwrapKey'])});
  }
  const getWrappingKey=async({namespace,epoch,purpose})=>{
    assert.equal(namespace,NS);calls.push({epoch,purpose});
    if(!epochs.has(epoch))throw new Error('synthetic provider failure must not escape');
    return epochs.get(epoch)[purpose];
  };
  return {epochs,calls,getWrappingKey};
}
async function rows(db,sealed=false){return (await db.prepare('SELECT athlete,collection,row_id,value'+(sealed?',sealed,storage_revision':'')+' FROM authority_rows ORDER BY athlete,collection,row_id').all()).results;}
async function revision(db){return (await db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision;}
function query(op){return {version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:nonce(),context_id:nonce(),claims:op?[{claim_id:'claim-a',envelope_b64:C.encode64(C.encode(op))}]:[],requested_lease_ids:[]};}
function operation(f,seq=1){return Ops.build({op_id:'op-'+seq,athlete_id:'first',device_id:f.device,device_seq:seq,
  predecessor:seq>1?'op-'+(seq-1):null,parents:[],kind:'fact',class:'reading',lease_id:f.lease.lease_id,
  effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},
  payload:{lb:{value:160+seq,unit:'lb'},note:'synthetic-payload-canary-café'}},f.identities.first);}
async function fixture(t){
  const source=await runtime(t),target=await runtime(t,true),provider=await makeProvider();
  const key=K.generateSigningKey('p1-synthetic'),identities={first:randomBytes(32).toString('hex'),second:randomBytes(32).toString('hex')};
  const base={authorityKey:key,identityKeys:identities,clock:()=>NOW,reconciliationProfile:'earned/r1/v1',r1:{issuer:'https://issuer.p1.invalid',origin:'https://app.p1.invalid'}};
  const plain=createBridge({...base,db:source.db});
  await plain.initializeR1({first:{plan:{steps:8000,note:'synthetic-plan-canary'},devices:{}},second:{plan:{steps:9000},devices:{}}},{subject1:'first',subject2:'second'});
  const enrolled=await plain.enrollScoped('subject1',{intent_id:'enroll-a',schema_version:1,nonce:nonce()});
  const f={source,target,provider,key,identities,base,plain,device:enrolled.payload.issuance.lease.device_id,lease:enrolled.payload.issuance.lease};
  f.op=operation(f);f.disposition=await plain.invokeScoped('subject1',f.device,'admit',['first',f.op]);assert.equal(f.disposition.status,'ACCEPTED');
  // An explicit synthetic noncanonical raw-row fixture; facts/signatures do not change.
  const original=(await rows(source.db)).find(r=>r.collection==='operations'&&r.row_id===f.op.op_id);
  const pretty=JSON.stringify(JSON.parse(original.value),null,1)+'\n';
  await source.db.batch([source.db.prepare('UPDATE authority_rows SET value=? WHERE athlete=? AND collection=? AND row_id=?').bind(pretty,original.athlete,original.collection,original.row_id),source.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
  f.originalRows=await rows(source.db);const r=await revision(source.db);
  f.storage={profile:PROFILE,namespace:NS,getWrappingKey:provider.getWrappingKey,crypto:webcrypto};
  f.codec=createAuthorityRowCodec({namespace:NS,getWrappingKey:provider.getWrappingKey,crypto:webcrypto});
  const copied=[];for(const row of f.originalRows)copied.push(await f.codec.seal(row,{revision:r,writeEpoch:'old'}));
  const subjects=(await source.db.prepare('SELECT subject,athlete FROM authority_subjects').all()).results;
  await target.db.batch([
    target.db.prepare('UPDATE authority_revision SET revision=? WHERE id=1').bind(r),
    ...copied.map(x=>target.db.prepare('INSERT INTO authority_rows VALUES(?,?,?,?,?,?)').bind(x.athlete,x.collection,x.row_id,x.value,x.sealed,x.storage_revision)),
    ...subjects.map(x=>target.db.prepare('INSERT INTO authority_subjects VALUES(?,?)').bind(x.subject,x.athlete)),
    target.db.prepare('UPDATE authority_revision SET revision=? WHERE id=1').bind(r+1)]);
  f.config={...base,db:target.db,storage:f.storage};f.bridge=createBridge(f.config);return f;
}
function wrapped(db,around){
  const wrap=(text,s)=>({text,s,bind(...xs){return wrap(text,s.bind(...xs));}});
  return {prepare(text){return wrap(text,db.prepare(text));},batch(xs){return around(xs,()=>db.batch(xs.map(x=>x.s)));}};
}
test.before(()=>buildCore());

test('P1 actual empty-target initialization and enrolment create sealed records atomically',async t=>{
  const target=await runtime(t,true),provider=await makeProvider(),key=K.generateSigningKey('p1-first-use');
  const storage={profile:PROFILE,namespace:NS,getWrappingKey:provider.getWrappingKey,crypto:webcrypto};
  const config={db:target.db,authorityKey:key,identityKeys:{first:randomBytes(32).toString('hex')},clock:()=>NOW,
    reconciliationProfile:'earned/r1/v1',r1:{issuer:'https://issuer.p1.invalid',origin:'https://app.p1.invalid'},storage};
  const bridge=createBridge(config);
  assert.deepEqual(await bridge.initializeR1({first:{plan:{note:'synthetic-first-plan'},devices:{}}},{subject1:'first'}),{initialized:true});
  const enrolled=await bridge.enrollScoped('subject1',{intent_id:'first-enrol',schema_version:1,nonce:nonce()});
  assert.ok(enrolled.payload.issuance.lease.signature);
  const kept=await rows(target.db,true);assert(kept.every(x=>x.sealed&&x.storage_revision>0));
  assert(!JSON.stringify(kept).includes('synthetic-first-plan'));
  assert.ok((await bridge.reconcileScoped('subject1',enrolled.payload.issuance.lease.device_id,query())).payloadBytes);
});

test('P1 actual D1 copy and both bridge readers preserve original raw/signature bytes',async t=>{
  const f=await fixture(t),physical=await rows(f.target.db,true),r=await revision(f.target.db),logical=[];
  for(const row of physical)logical.push(await f.codec.open(row,{revision:r}));
  assert.deepEqual(logical,f.originalRows);
  assert(!JSON.stringify(physical).includes('synthetic-payload-canary'));
  assert(!JSON.stringify(physical).includes('synthetic-plan-canary'));
  const request=query(f.op),before=JSON.stringify(physical);
  const expected=await f.plain.reconcileScoped('subject1',f.device,request);
  const actual=await f.bridge.reconcileScoped('subject1',f.device,request);
  assert.deepEqual(actual.payloadBytes,expected.payloadBytes);
  assert.equal(JSON.stringify(await rows(f.target.db,true)),before,'read-only proof must not reseal unchanged records');
  await assert.rejects(f.bridge.reconcileScoped('subject2',f.device,query()),{code:'SCOPE_FORBIDDEN'});
  const record=actual.payload.retained_rows.find(x=>x.collection==='operations'&&x.row_id===f.op.op_id);
  assert.equal(C.text(C.decode64(record.value_b64)),f.originalRows.find(x=>x.collection==='operations'&&x.row_id===f.op.op_id).value);
  assert.deepEqual(await f.bridge.invokeScoped('subject1',f.device,'log',['first',0]),await f.plain.invokeScoped('subject1',f.device,'log',['first',0]));
  const ordinary=createBridge({...f.config,reconciliationProfile:undefined});
  assert.deepEqual(await ordinary.invoke('log',['first',0]),await f.plain.invoke('log',['first',0]));
});

test('P1 missing historical keys and wrong-key authentication never publish a result or domain mutation',async t=>{
  const f=await fixture(t),before=await rows(f.target.db,true),r=await revision(f.target.db),old=f.provider.epochs.get('old');
  f.provider.epochs.delete('old');
  const missing=await f.bridge.reconcileScoped('subject1',f.device,query(f.op));assert.equal(missing.status,'UNAVAILABLE');
  assert.equal(await revision(f.target.db),r);assert.deepEqual(await rows(f.target.db,true),before);
  f.provider.epochs.set('old',f.provider.epochs.get('wrong'));
  await assert.rejects(f.bridge.reconcileScoped('subject1',f.device,query(f.op)),{code:'RETAINED_INTEGRITY'});
  assert.equal(await revision(f.target.db),r);assert.deepEqual(await rows(f.target.db,true),before);
  f.provider.epochs.set('old',old);assert.ok((await f.bridge.reconcileScoped('subject1',f.device,query(f.op))).payloadBytes);
});

test('P1 lost acknowledgement and checked epoch rotation retry from original durable state',async t=>{
  const f=await fixture(t);let lost=false;
  const db=wrapped(f.target.db,async(xs,run)=>{const result=await run();if(!lost&&xs[0].text.startsWith('UPDATE authority_revision')){lost=true;throw new Error('fetch failed after durable commit');}return result;});
  const op=operation(f,2),accepted=await createBridge({...f.config,db}).invokeScoped('subject1',f.device,'admit',['first',op]);
  assert.equal(lost,true);assert.equal(accepted.status,'ACCEPTED');
  assert.deepEqual(await f.bridge.invokeScoped('subject1',f.device,'admit',['first',op]),accepted);
  let rotated=false;
  const racing=wrapped(f.target.db,async(xs,run)=>{
    if(!rotated&&xs[0].text.startsWith('UPDATE authority_revision')){
      rotated=true;const r=await revision(f.target.db);
      await f.target.db.batch([f.target.db.prepare('UPDATE authority_revision SET revision=CASE WHEN revision=? THEN revision ELSE -1 END WHERE id=1').bind(r),
        f.target.db.prepare("UPDATE authority_storage SET write_epoch='new' WHERE id=1"),f.target.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
    }return run();
  });
  const op3=operation(f,3),result=await createBridge({...f.config,db:racing}).invokeScoped('subject1',f.device,'admit',['first',op3]);
  assert.equal(rotated,true);assert.equal(result.status,'ACCEPTED');
  const after=await rows(f.target.db,true),opRow=after.find(x=>x.collection==='operations'&&x.row_id===op3.op_id);
  assert.equal(JSON.parse(opRow.sealed).key_epoch,'new');
  assert(after.some(x=>JSON.parse(x.sealed).key_epoch==='old'),'retained historical seals were not rewritten');
  assert.equal(after.filter(x=>x.collection==='log').length,3);
  assert.ok((await f.bridge.reconcileScoped('subject1',f.device,query(op3))).payloadBytes);
});

test('P1 checked control-row disappearance aborts the staged write instead of matching zero updates',async t=>{
  const f=await fixture(t),before=await rows(f.target.db,true);let removed=false;
  const db=wrapped(f.target.db,async(xs,run)=>{if(!removed&&xs[0].text.startsWith('UPDATE authority_revision')){removed=true;await f.target.db.prepare('DELETE FROM authority_storage WHERE id=1').run();}return run();});
  await assert.rejects(createBridge({...f.config,db}).invokeScoped('subject1',f.device,'admit',['first',operation(f,2)]),{code:'RETAINED_INTEGRITY'});
  assert.equal(removed,true);assert.deepEqual(await rows(f.target.db,true),before);
});

test('P1 isolated sealed restore preserves stamps, ciphertext, signed identities and recovery bytes',async t=>{
  const f=await fixture(t),restored=await runtime(t,true),physical=await rows(f.target.db,true),r=await revision(f.target.db);
  const subjects=(await f.target.db.prepare('SELECT subject,athlete FROM authority_subjects').all()).results;
  await restored.db.batch([
    ...physical.map(x=>restored.db.prepare('INSERT INTO authority_rows VALUES(?,?,?,?,?,?)').bind(x.athlete,x.collection,x.row_id,x.value,x.sealed,x.storage_revision)),
    ...subjects.map(x=>restored.db.prepare('INSERT INTO authority_subjects VALUES(?,?)').bind(x.subject,x.athlete)),
    restored.db.prepare('UPDATE authority_revision SET revision=? WHERE id=1').bind(r)]);
  const bridge=createBridge({...f.config,db:restored.db}),request=query(f.op);
  assert.deepEqual(await rows(restored.db,true),physical);
  assert.deepEqual((await bridge.reconcileScoped('subject1',f.device,request)).payloadBytes,
    (await f.bridge.reconcileScoped('subject1',f.device,request)).payloadBytes);
  assert.deepEqual(await bridge.invokeScoped('subject1',f.device,'admit',['first',f.op]),f.disposition);
  assert.deepEqual(await rows(restored.db,true),physical,'read/replay does not rewrap restored history');
});

test('P1 actual D1 changed projection or sealed-only replay refuses before recovery',async t=>{
  const f=await fixture(t),original=(await rows(f.target.db,true)).find(x=>x.collection==='operations');
  for(const changed of [{value:JSON.stringify({p1:PROFILE,unexpected:true})},{sealed:original.sealed}]){
    const column=Object.keys(changed)[0];
    // Existing mutable guard requires a new stamp. Keeping an old seal with the
    // new physical stamp must fail even though its constant projection is equal.
    await f.target.db.batch([
      f.target.db.prepare('UPDATE authority_rows SET '+column+'=?,storage_revision=storage_revision+1 WHERE athlete=? AND collection=? AND row_id=?')
        .bind(changed[column],original.athlete,original.collection,original.row_id),
      f.target.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
    const before=await rows(f.target.db,true),r=await revision(f.target.db);
    await assert.rejects(f.bridge.reconcileScoped('subject1',f.device,query()),{code:'RETAINED_INTEGRITY'});
    assert.deepEqual(await rows(f.target.db,true),before);assert.equal(await revision(f.target.db),r);
    // The explicitly accepted full-row/stamp rollback residual is used ONLY to
    // restore this synthetic fixture. Authentication alone cannot detect it.
    await f.target.db.batch([
      f.target.db.prepare('DELETE FROM authority_rows WHERE athlete=? AND collection=? AND row_id=?').bind(original.athlete,original.collection,original.row_id),
      f.target.db.prepare('INSERT INTO authority_rows VALUES(?,?,?,?,?,?)').bind(original.athlete,original.collection,original.row_id,original.value,original.sealed,original.storage_revision),
      f.target.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
    assert.ok((await f.bridge.reconcileScoped('subject1',f.device,query())).payloadBytes);
  }
});
