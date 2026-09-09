'use strict';
// BRIEF-W5-R1 v1.2: real pinned local D1; no provider/private data/resource claim.
// Original bridge is source-pinned and runs against the same synthetic database.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), vm = require('node:vm');
const { createRequire } = require('node:module'), { execFileSync } = require('node:child_process');
const { randomBytes, createHash } = require('node:crypto');
const { createBridge } = require('../bridge.cjs'), { buildCore } = require('../build.cjs');
const { createLocalD1 } = require('../local-d1.cjs'), { createWorker } = require('../worker.cjs');
const { generateSigningKey, signatureOver } = require('../crypto.cjs');
const { hostWorker, testIssuer } = require('../../rigs/rig190.cjs');
const { build } = require('../../../client/ops.cjs');
const C = require('../reconciliation/codec.cjs');
const BASE = 'ad5491d89b65ddb6b1828df6c85fc0c03fb42aa2';
const BRIDGE_SHA = '7d6a22c1793a9c71c603208c02ddec24e25f5bf24c2c9e32c465b5c5f191c666';
const original = execFileSync('git',['show',BASE+':rebuild/m3/w5/bridge.cjs'],{cwd:path.resolve(__dirname,'../../../..')});
assert.equal(createHash('sha256').update(original).digest('hex'),BRIDGE_SHA);
const originalModule = {exports:{}};
vm.runInThisContext('(function(require,module,exports){'+original.toString('utf8')+'\n})',
  {filename:'pinned-before-scoped-read.cjs'})(createRequire(path.resolve(__dirname,'../bridge.cjs')),originalModule,originalModule.exports);
const originalBridge = originalModule.exports.createBridge;
const NOW = '2026-09-04T16:00:00.000Z', nonce = () => randomBytes(32).toString('base64url');
const controls = id => ({intent_id:id,schema_version:1,nonce:nonce()});
const req = () => ({version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:nonce(),context_id:nonce(),claims:[],requested_lease_ids:[]});
let core;
test.before(async()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'earned-r1-scoped-core-'));
  core=require(await buildCore({outfile:path.join(directory,'core.cjs')}));
});
async function fixture(t) {
  const runtime=await createLocalD1();t.after(()=>runtime.close());
  const sql=fs.readFileSync(path.resolve(__dirname,'../migrations/0002_reconciliation.sql'),'utf8').replace(/--[^\n]*/g,'');
  const statements=sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm)||[];
  assert.equal(statements.length,6);assert.equal(sql.replace(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm,'').trim(),'');
  await runtime.db.batch(statements.map(s=>runtime.db.prepare(s)));
  const issuer=testIssuer(), key=generateSigningKey('scoped-test-run');
  const config={db:runtime.db,core,authorityKey:key,identityKeys:{first:randomBytes(32).toString('hex'),second:randomBytes(32).toString('hex')},
    clock:()=>NOW,reconciliationProfile:C.PROFILE,r1:{issuer:issuer.config.issuer,origin:issuer.config.origins[0]}};
  const bridge=createBridge(config);
  assert.deepEqual(await bridge.initializeR1({first:{plan:{steps:8000},devices:{}},second:{plan:{steps:9000},devices:{}}},
    {firstSubject:'first',secondSubject:'second'}),{initialized:true});
  const first=await bridge.enrollScoped('firstSubject',controls('first-enrol'));
  const second=await bridge.enrollScoped('secondSubject',controls('second-enrol'));
  return {db:runtime.db,config,issuer,key,bridge,old:originalBridge(config),
    actor:first.payload.issuance.lease.device_id,lease:first.payload.issuance.lease,
    foreignActor:second.payload.issuance.lease.device_id,foreignLease:second.payload.issuance.lease};
}
async function outcome(promise) {try{return {value:await promise};}catch(error){return {error:{code:error.code,status:error.status,retryable:error.retryable}};}}

test('combined missing binding and missing revision preserves pinned original revision-first503',async t=>{
  const f=await fixture(t),request=req();
  await f.db.prepare('DELETE FROM authority_revision WHERE id=1').run();
  const old=await outcome(f.old.reconcileScoped('missing',f.actor,request));
  const candidate=await outcome(f.bridge.reconcileScoped('missing',f.actor,request));
  assert.deepEqual(old,{error:{code:'UNAVAILABLE',status:503,retryable:true}});
  assert.deepEqual(candidate,old);
});

function observe(db,{afterRead,reverseRows=false}={}) {
  const calls=[];
  const statement=(text,args=[])=>({text,args,original:db.prepare(text).bind(...args),bind(...values){return statement(text,values);}});
  return {calls,prepare:text=>statement(text),async batch(input){
    const result=await db.batch(input.map(s=>s.original));
    const read=input.length===3 && input.every(s=>s.text.startsWith('SELECT'));
    calls.push(input.map((s,i)=>({sql:s.text,args:s.args,rows:result[i].results.length,meta:result[i].meta})));
    if(read && afterRead) await afterRead(result,input);
    if(read && reverseRows) for(let i=0;i<input.length;i++) if(input[i].text.startsWith('SELECT athlete, collection')) result[i].results.reverse();
    return result;
  }};
}
const authorityRows=db=>db.prepare('SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id').all().then(r=>r.results);
const bindingRows=db=>db.prepare('SELECT subject,athlete FROM authority_subjects ORDER BY subject').all().then(r=>r.results);
async function updateRows(f,changes){
  const {revision}=(await f.db.prepare('SELECT revision FROM authority_revision WHERE id=1').first());
  await f.db.batch([
    f.db.prepare('UPDATE authority_revision SET revision=CASE WHEN revision=? THEN revision ELSE -1 END WHERE id=1').bind(revision),
    ...changes,f.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1'),
  ]);
}
async function duplicateRow(f,athlete) {
  // SQLite json_valid admits duplicate keys; the R1 parser deliberately does not.
  await updateRows(f,[f.db.prepare('INSERT INTO authority_rows(athlete,collection,row_id,value) VALUES(?,?,?,?)')
    .bind(athlete,'suspensions','malformed-test','{"duplicate":1,"duplicate":2}')]);
}
function operation(f){return build({op_id:'scoped-fact',athlete_id:'first',device_id:f.actor,device_seq:1,
  predecessor:null,parents:[],kind:'fact',class:'reading',lease_id:f.lease.lease_id,
  effective:{local_date:'2026-09-04',local_time:'12:00',utc_offset:'-04:00'},
  payload:{lb:{value:160,unit:'lb'},note:'synthetic caf\u00e9'}},f.config.identityKeys.first);}
async function http(t,f,bridge){
  const host=await hostWorker(createWorker({bridge,authorityKey:f.key,auth:f.issuer.config,clock:()=>NOW}));t.after(()=>host.close());
  return async(body,subject='firstSubject',token=f.issuer.token(subject))=>{
    const response=await fetch(host.url+'/reconcile',{method:'POST',headers:{'Content-Type':'application/json',
      Origin:f.issuer.config.origins[0],Authorization:'Bearer '+token},body:JSON.stringify(body)});
    assert.match(response.headers.get('cache-control'),/no-store/);
    return {status:response.status,body:await response.json()};
  };
}
const wire=(actor,request,continuation=null)=>({device_id:actor,request_b64:C.encode64(C.encode(request)),continuation,page_index:0});

test('actual migration planner changes global SCAN to subject-index SEARCH; missing binding reads zero authority rows',async t=>{
  const f=await fixture(t),db=observe(f.db),bridge=createBridge({...f.config,db}),request=req();
  const proof=await bridge.reconcileScoped('firstSubject',f.actor,request);
  assert.equal(proof.payload.scope.athlete_id,'first');
  const read=db.calls[0];assert.equal(read.length,3);
  assert.equal(read[0].sql,'SELECT revision FROM authority_revision WHERE id = 1');
  assert.equal(read[1].sql,'SELECT subject, athlete FROM authority_subjects WHERE subject = ?');
  assert.deepEqual(read[1].args,['firstSubject']);assert.deepEqual(read[2].args,['firstSubject']);
  const oldPlan=(await f.db.prepare('EXPLAIN QUERY PLAN SELECT athlete, collection, row_id, value FROM authority_rows').all()).results.map(r=>r.detail);
  const nextPlan=(await f.db.prepare('EXPLAIN QUERY PLAN '+read[2].sql).bind(...read[2].args).all()).results.map(r=>r.detail);
  assert(oldPlan.some(x=>/SCAN authority_rows/.test(x)));
  assert(nextPlan.some(x=>/SEARCH authority_rows USING INDEX sqlite_autoindex_authority_rows_1 \(athlete=\?\)/.test(x)));
  assert(nextPlan.some(x=>/SEARCH authority_subjects USING INDEX sqlite_autoindex_authority_subjects_1 \(subject=\?\)/.test(x)));
  assert.equal(nextPlan.some(x=>/SCAN authority_rows/.test(x)),false);
  db.calls.length=0;
  await assert.rejects(bridge.reconcileScoped('absent',f.actor,request),{code:'SCOPE_FORBIDDEN'});
  assert.equal(db.calls.length,1);assert.equal(db.calls[0][1].rows,0);assert.equal(db.calls[0][2].rows,0);
  assert.equal(db.calls[0][2].meta.rows_read,0,'missing subject must not scan authority rows');
  console.log('R1 SCOPED PLANNER PASS — old SCAN; athlete PK SEARCH + subject PK subquery; absent subject zero authority rows/read');
});

test('full old/new proof and unsigned real-HTTP page bytes remain exact despite reversed SQL row order and raw whitespace',async t=>{
  const f=await fixture(t),op=operation(f);assert.equal((await f.bridge.invokeScoped('firstSubject',f.actor,'admit',['first',op])).status,'ACCEPTED');
  await updateRows(f,[f.db.prepare("UPDATE authority_rows SET value='  '||value||char(10) WHERE athlete='first' AND collection='metadata'")]);
  const rows=await authorityRows(f.db),subjects=await bindingRows(f.db),request=req();
  request.claims=[{claim_id:'synthetic-fact',envelope_b64:C.encode64(C.encode(op))}];
  request.requested_lease_ids=[{source_device_id:f.actor,lease_id:f.lease.lease_id}];
  const db=observe(f.db,{reverseRows:true}),candidate=createBridge({...f.config,db});
  const before=await f.old.reconcileScoped('firstSubject',f.actor,request);
  const after=await candidate.reconcileScoped('firstSubject',f.actor,request);
  assert.deepEqual(after,before);assert.deepEqual(after.payload.retained_rows,before.payload.retained_rows);
  assert.equal(C.text(C.decode64(after.payload.retained_rows.find(r=>r.collection==='metadata').value_b64)).startsWith('  '),true);
  const manifest=C.makeManifest({keyEpoch:f.key.kid,scopeDigest:before.scopeDigest,requestBytes:C.encode(request),
    snapshotId:C.hash('request','scoped-equality'),payloadBytes:before.payloadBytes,coverage:before.payload.coverage});
  const signed={...manifest,authority_signature:signatureOver(manifest,f.key,C.DOMAINS.manifest)};
  const body=wire(f.actor,request,C.encode64(C.encode(signed)));
  const originalHttp=await http(t,f,f.old),candidateHttp=await http(t,f,candidate);
  const oldReply=await originalHttp(body),newReply=await candidateHttp(body);
  assert.equal(oldReply.status,200);assert.equal(newReply.status,200);
  assert.equal(newReply.body.manifest_b64,oldReply.body.manifest_b64);
  const unsigned=r=>{const {authority_signature,...value}=r.body.page;assert.equal(typeof authority_signature,'string');return value;};
  assert.deepEqual(unsigned(newReply),unsigned(oldReply));
  assert.deepEqual(C.encode(unsigned(newReply)),C.encode(unsigned(oldReply)));
  assert.deepEqual(await authorityRows(f.db),rows);assert.deepEqual(await bindingRows(f.db),subjects);
  for(const call of db.calls.filter(x=>x.length===2))assert.equal(call[1].sql,'UPDATE authority_revision SET revision = revision + 1 WHERE id = 1');
});

test('HTTP authentication precedes all D1 access; typed and combined errors preserve revision-first behavior',async t=>{
  const f=await fixture(t),db=observe(f.db),bridge=createBridge({...f.config,db}),post=await http(t,f,bridge),request=req();
  const unauthorized=await post(wire(f.actor,request),'firstSubject','invalid');
  assert.equal(unauthorized.status,401);assert.equal(unauthorized.body.error.state,11);assert.equal(db.calls.length,0);
  const missing=await post(wire(f.actor,request),'absent');
  assert.deepEqual(missing,{status:403,body:{error:{code:'SCOPE_FORBIDDEN',state:17}}});
  assert.equal(db.calls.at(-1)[2].rows,0);assert.equal(db.calls.at(-1)[2].meta.rows_read,0);
  await duplicateRow(f,'first');
  assert.deepEqual(await post(wire(f.actor,request)),{status:500,body:{error:{code:'RETAINED_INTEGRITY',retryable:false}}});
  await f.db.prepare('DELETE FROM authority_revision WHERE id=1').run();
  for(const subject of ['firstSubject','absent']) {
    const result=await post(wire(f.actor,request),subject);
    assert.deepEqual(result,{status:503,body:{error:{code:'UNAVAILABLE',retryable:true}}});
  }
  assert.equal(db.calls.at(-1)[2].rows,0);
  const beforeAuth=db.calls.length;
  assert.equal((await post(wire(f.actor,request),'firstSubject','invalid')).status,401);
  assert.equal(db.calls.length,beforeAuth);
  await f.db.prepare("INSERT INTO authority_revision(id,revision) VALUES(1,'malformed')").run();
  assert.equal((await post(wire(f.actor,request))).status,503);
  assert.equal((await post(wire(f.actor,request),'absent')).status,503);
  assert.deepEqual(await outcome(bridge.reconcileScoped('firstSubject',f.actor,request)),
    await outcome(f.old.reconcileScoped('firstSubject',f.actor,request)));
});

test('foreign growth and malformed rows affect neither scoped proof nor selected bytes; all writer paths retain full snapshots',async t=>{
  const f=await fixture(t),request=req(),db=observe(f.db),candidate=createBridge({...f.config,db});
  const originalProof=await f.old.reconcileScoped('firstSubject',f.actor,request);
  // Entirely synthetic JSON-valid rows, each well below the decimal D1 2MB limit.
  const population=Array.from({length:9},(_,i)=>f.db.prepare('INSERT INTO authority_rows(athlete,collection,row_id,value) VALUES(?,?,?,?)')
    .bind('second','suspensions','growth-'+i,JSON.stringify({synthetic:'x'.repeat(1024*1024)})));
  await updateRows(f,population);db.calls.length=0;
  const afterGrowth=await candidate.reconcileScoped('firstSubject',f.actor,request);
  assert.deepEqual(afterGrowth,originalProof);
  assert.equal(db.calls[0][2].rows,originalProof.payload.retained_rows.length);
  await duplicateRow(f,'second');db.calls.length=0;
  assert.deepEqual(await candidate.reconcileScoped('firstSubject',f.actor,request),originalProof);
  await assert.rejects(f.old.reconcileScoped('firstSubject',f.actor,request),{code:'RETAINED_INTEGRITY'});
  const op=operation(f),renew={device_id:f.actor,intent_id:'renew-after-growth',expected_creation_epoch:1,
    expected_lease_id:f.lease.lease_id,schema_version:1,nonce:nonce()};
  const actions=[
    b=>b.enrollScoped('firstSubject',controls('new-device')),
    b=>b.renewScoped('firstSubject',f.actor,renew),
    b=>b.recoveryReplayScoped('firstSubject',f.actor,{envelope:op,envelopeBytes:C.encode(op)}),
    b=>b.invokeScoped('firstSubject',f.actor,'frontier',['first']),
    b=>b.invoke('frontier',['first']),
    b=>b.closeAccount('first'),
  ];
  for(const action of actions){
    db.calls.length=0;
    const after=await outcome(action(candidate));
    assert.deepEqual(after,await outcome(action(f.old)));
    assert.deepEqual(after,{error:{code:'RETAINED_INTEGRITY',status:500,retryable:false}});
    assert.deepEqual(db.calls[0].map(r=>r.sql),[
      'SELECT revision FROM authority_revision WHERE id = 1',
      'SELECT athlete, collection, row_id, value FROM authority_rows',
      'SELECT subject, athlete FROM authority_subjects',
    ]);
    assert.equal(db.calls[0][1].rows>originalProof.payload.retained_rows.length,true);
  }
  // An own malformed row still blocks reconciliation independently of the foreign copy.
  await duplicateRow(f,'first');
  await assert.rejects(candidate.reconcileScoped('firstSubject',f.actor,request),{code:'RETAINED_INTEGRITY',status:500});
});

for(const change of ['subject-remap','actor-revocation','account-closure']) test('revisioned '+change+' between scoped read and guard reloads and refuses',async t=>{
  const f=await fixture(t),request=req();let changed=false;
  const db=observe(f.db,{afterRead:async()=>{
    if(changed)return;changed=true;
    if(change==='subject-remap')await updateRows(f,[
      f.db.prepare("DELETE FROM authority_subjects WHERE subject='secondSubject'"),
      f.db.prepare("UPDATE authority_subjects SET athlete='second' WHERE subject='firstSubject'"),
    ]);
    else if(change==='actor-revocation')await f.bridge.invoke('revokeDevice',['first',f.actor]);
    else await f.bridge.closeAccount('first');
  }});
  const candidate=createBridge({...f.config,db});
  await assert.rejects(candidate.reconcileScoped('firstSubject',f.actor,request),{code:'SCOPE_FORBIDDEN'});
  assert.equal(changed,true);assert.equal(db.calls.filter(c=>c.length===3).length,2,'stale guard must reload');
  assert.equal(db.calls.filter(c=>c.length===2).length,0,'failed actual guard must not record a successful batch');
});

test('non-reconcile source retains pinned bytes except explicit P1 storage seams and two reviewed workout bindings',()=>{
  const old=original.toString('utf8');
  let candidate=fs.readFileSync(path.resolve(__dirname,'../bridge.cjs'),'utf8');
  // PR46 e037, P1 spec v1.1 explicitly changes physical reads/writes and the
  // control guard. Revert ONLY the tracked literal P1 delta before applying the
  // previous complete source comparison; unrelated changes still fail it.
  const delta=require('./p1-bridge-source-delta.json');
  assert.equal(delta.base,'bec056d6b8f86069c500d958e86f212bd6e5f392');
  for(const change of delta.changes){
    assert.equal(candidate.split(change.after).length,2,'unique explicit P1 source seam');
    candidate=candidate.replace(change.after,change.before);
  }
  // PR46 92d48fdd §5 explicitly adds this dependency to BOTH constructors.
  // Keep the historical source/hash and allow exactly that text twice, nothing else.
  const binding='authorityKey, identityKeys, clock, workoutProfile, athletes:';
  assert.equal(candidate.split(binding).length,3);assert.equal(old.split(binding).length,1);
  const source=candidate.replaceAll(binding,'authorityKey, identityKeys, clock, athletes:');
  const originalDefault=old.slice(old.indexOf('  async function execute('),old.indexOf('  // The profile is a deployment setting'));
  assert.equal(source.slice(source.indexOf('  async function execute('),source.indexOf('  // The profile is a deployment setting')),originalDefault);
  const oldWriters=old.slice(old.indexOf('      let snapshot;'));
  assert.equal(source.slice(source.indexOf('      let snapshot;')),oldWriters);
  const guard="const statements = [db.prepare('UPDATE authority_revision SET revision = CASE WHEN revision = ? THEN revision ELSE -1 END WHERE id = 1').bind(revision),\n          db.prepare('UPDATE authority_revision SET revision = revision + 1 WHERE id = 1')];";
  assert.equal(old.split(guard).length,2);assert.equal(source.split(guard).length,2);
});
