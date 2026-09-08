'use strict';
// Actual public R1/D1 negotiation diagnostic. No private state or product edits.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const crypto=require('node:crypto'),cp=require('node:child_process');
if(!process.argv[2]||!process.argv[3]) throw new Error('Usage: node schema-transition-diagnostic.cjs <R1-at-d26795a> <synthetic-output-directory>');
const root=path.resolve(process.argv[2]),base='d26795a47d638ec1e67840455273cc05eeca9926';
const out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const pins={},prefix='rebuild/m3/w5/';
for(const p of [prefix+'bridge.cjs',prefix+'reconciliation/codec.cjs',prefix+'reconciliation/issuer.cjs',prefix+'crypto.cjs',prefix+'local-d1.cjs','rebuild/client/index.cjs','rebuild/client/ops.cjs']){
 const raw=fs.readFileSync(path.join(root,p)),old=cp.spawnSync('git',['show',base+':'+p],{cwd:root,windowsHide:true,maxBuffer:8e6});
 assert.equal(old.status,0);assert(raw.equals(old.stdout),p+' differs from pin');pins[p]=crypto.createHash('sha256').update(raw).digest('hex');
}
const C=require(path.join(root,prefix+'reconciliation/codec.cjs'));
const Sign=require(path.join(root,prefix+'crypto.cjs'));
const {createLocalD1}=require(path.join(root,prefix+'local-d1.cjs'));
const {createBridge}=require(path.join(root,prefix+'bridge.cjs'));
const Ops=require(path.join(root,'rebuild/client/ops.cjs'));
const nonce=()=>crypto.randomBytes(32).toString('base64url');
const results=[];
const pass=(name,scope)=>{results.push({name,status:'CONFIRMED',scope});console.log('SCHEMA TRANSITION '+name+' CONFIRMED');};
(async()=>{
 const runtime=await createLocalD1();
 try{
  const sql=fs.readFileSync(path.join(root,prefix+'migrations/0002_reconciliation.sql'),'utf8').replace(/--[^\n]*/g,'');
  const stmts=sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm);assert.equal(stmts.length,6);
  await runtime.db.batch(stmts.map(s=>runtime.db.prepare(s)));
  const key=Sign.generateSigningKey('schema-transition-synthetic'),identity='schema-transition-synthetic-only';
  const bridge=createBridge({db:runtime.db,authorityKey:key,identityKeys:{synthetic:identity},clock:()=> '2026-09-08T00:00:00.000Z',
   reconciliationProfile:'earned/r1/v1',r1:{issuer:'https://issuer.synthetic.invalid',origin:'https://app.synthetic.invalid'}});
  await bridge.initializeR1({synthetic:{plan:{},devices:{}}},{'synthetic-subject':'synthetic'});
  const rows=async()=>JSON.stringify((await runtime.db.prepare('SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id').all()).results);
  let before=await rows();
  await assert.rejects(bridge.enrollScoped('synthetic-subject',{intent_id:'new2',schema_version:2,nonce:nonce()}),{code:'INVALID_R1_REQUEST'});
  assert.equal(await rows(),before);pass('new-v2-enrollment-refuses-without-domain-writes','actual D1/issuer, existing behavior; not a regression');
  const enrolled=await bridge.enrollScoped('synthetic-subject',{intent_id:'old1',schema_version:1,nonce:nonce()});
  const old=enrolled.payload.issuance,device=old.lease.device_id;assert.equal(old.lease.schema_version,1);
  pass('v1-enrollment-control','actual P256 issued capability');
  before=await rows();
  await assert.rejects(bridge.renewScoped('synthetic-subject',device,{device_id:device,intent_id:'upgrade2',
   expected_creation_epoch:old.creation_epoch,expected_lease_id:old.lease.lease_id,schema_version:2,nonce:nonce()}),{code:'INVALID_R1_REQUEST'});
  assert.equal(await rows(),before);pass('v2-renewal-refuses-without-domain-writes','actual D1/issuer, missing transition capability');
  const spec={op_id:'schema-test-op',athlete_id:'synthetic',device_id:device,device_seq:1,parents:[],class:'reading',kind:'fact',
   effective:{local_date:'2026-09-08',local_time:'00:00',utc_offset:'+00:00'},lease_id:old.lease.lease_id,payload:{lb:{value:160,unit:'lb'}}};
  const candidate=Ops.build({...spec,schema_version:2},identity);assert.equal(candidate.schema_version,2);
  pass('low-level-builder-retains-explicit-version','actual Ops.build alone; not a lease or client activation');
  const op=Ops.build(spec,identity),stored=await bridge.invokeScoped('synthetic-subject',device,'admit',['synthetic',op]);
  assert.equal(stored.status,'ACCEPTED');assert.equal(op.schema_version,1);
  assert.deepEqual(await bridge.invokeScoped('synthetic-subject',device,'admit',['synthetic',op]),stored);
  pass('old-v1-operation-and-exact-replay-survive-refused-upgrade','actual core/P256/D1; no synthetic lease promotion');
  const renewed=await bridge.renewScoped('synthetic-subject',device,{device_id:device,intent_id:'renew1',expected_creation_epoch:old.creation_epoch,
   expected_lease_id:old.lease.lease_id,schema_version:1,nonce:nonce()});assert.equal(renewed.payload.issuance.lease.schema_version,1);
  assert.deepEqual(await bridge.invokeScoped('synthetic-subject',device,'admit',['synthetic',op]),stored);
  pass('ordinary-v1-renewal-preserves-old-replay','actual existing history resolver; no v2 implementation');
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({base,node:process.version,pins,results,limits:'No proposed schema adopted, no W6 sink, private or phone evidence.'},null,2)+'\n');
  console.log('SCHEMA TRANSITION DIAGNOSTIC: 6/6 CONFIRMED; v2 activation NOT IMPLEMENTED');
 }finally{await runtime.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
