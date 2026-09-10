'use strict';
// Entirely synthetic fixture preparation. Every fact enters the actual staged
// bridge/D1 authority; exact boundary tuning adds only preserved JSON whitespace.
// This helper does not measure CPU/memory and cannot award R1-RESOURCE PASS.
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { build } = require('../../../client/ops.cjs');
const C = require('../reconciliation/codec.cjs');
const { validateRetained } = require('../reconciliation/project.cjs');
const nonce = () => randomBytes(32).toString('base64url');
const readRows = async db => (await db.prepare('SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id').all()).results;
function declaredPopulation(rows) {
  const accounts = new Map(); let totalBytes=0,maximumRowBytes=0;
  for(const row of rows){const n=Buffer.byteLength(row.value,'utf8');totalBytes+=n;maximumRowBytes=Math.max(maximumRowBytes,n);
    const a=accounts.get(row.athlete)||{athlete_id:row.athlete,rows:0,value_utf8_bytes:0};a.rows++;a.value_utf8_bytes+=n;accounts.set(row.athlete,a);}
  return {authority_rows:rows.length,value_utf8_bytes:totalBytes,maximum_value_utf8_bytes:maximumRowBytes,
    accounts:[...accounts.values()],scope:'Synthetic authority_rows JSON values; excludes SQL indexes, subjects, revision and storage-engine overhead'};
}
async function populate({db,bridge,identityKey,athleteId='first',subject='subject-first',trustedContext,
  targetBytes=C.LIMITS.payload,foreign,readLogicalRows=readRows,writeLogicalRow}) {
  assert.ok(Number.isSafeInteger(targetBytes)&&targetBytes>=32768&&targetBytes<=C.LIMITS.payload+1);
  assert.ok(db&&bridge&&identityKey&&trustedContext);
  const setup={[athleteId]:{plan:{steps:8000,protein_g:150},devices:{}}},subjects={[subject]:athleteId};
  if(foreign){assert.notEqual(foreign.athleteId,athleteId);assert.notEqual(foreign.subject,subject);
    setup[foreign.athleteId]={plan:{steps:9000,protein_g:140},devices:{}};subjects[foreign.subject]=foreign.athleteId;}
  assert.deepEqual(await bridge.initializeR1(setup,subjects),{initialized:true});
  const enrollment=await bridge.enrollScoped(subject,{intent_id:'resource-enroll',schema_version:1,nonce:nonce()},trustedContext);
  const lease=enrollment.payload.issuance.lease,deviceId=lease.device_id;
  const issuedOp=(owner,device,capability,key,sequence,padding,extra={}) => build({
    op_id:'resource-'+device+'-'+sequence,athlete_id:owner,device_id:device,device_seq:sequence,
    predecessor:sequence===1?null:'resource-'+device+'-'+(sequence-1),parents:[],kind:'fact',class:'reading',
    lease_id:capability.lease_id,effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},
    payload:{lb:{value:160,unit:'lb'},note:'SYNTHETIC RESOURCE FIXTURE '+ 'x'.repeat(padding)},...extra},key);
  let count=0;
  const padding=Math.min(100000,Math.max(1024,Math.floor(targetBytes/16)));
  async function append(){count++;const operation=issuedOp(athleteId,deviceId,lease,identityKey,count,padding);
    assert.ok(Buffer.byteLength(JSON.stringify({device_id:deviceId,operation}),'utf8')<=262144,'original W5 operation request cap');
    const d=await bridge.invokeScoped(subject,deviceId,'admit',[athleteId,operation]);assert.equal(d.status,'ACCEPTED');}
  if(foreign){const other=await bridge.enrollScoped(foreign.subject,{intent_id:'resource-foreign-enroll',schema_version:1,nonce:nonce()},trustedContext);
    for(let seq=1;seq<=3;seq++){const op=issuedOp(foreign.athleteId,other.payload.issuance.lease.device_id,other.payload.issuance.lease,foreign.identityKey,seq,padding);
      assert.equal((await bridge.invokeScoped(foreign.subject,op.device_id,'admit',[foreign.athleteId,op])).status,'ACCEPTED');}}
  const probeRequest=()=>({version:'earned/reconcile-request-1m/v1',mode:'ACCOUNT_RECOVERY',nonce:nonce(),context_id:nonce(),claims:[],requested_lease_ids:[]});
  let measured=await bridge.reconcileScoped(subject,deviceId,probeRequest(),undefined,trustedContext);
  const emptyLength=measured.payloadBytes.length;
  await append();measured=await bridge.reconcileScoped(subject,deviceId,probeRequest(),undefined,trustedContext);
  const perFact=measured.payloadBytes.length-emptyLength;
  // Leave at most roughly one row of whitespace headroom. Each ordinary fact
  // has identical synthetic padding; the margin covers variable ordinal digits.
  const headroom=Math.min(524288,Math.floor(targetBytes/4));
  const estimated=Math.max(1,Math.floor((targetBytes-emptyLength-headroom)/perFact));
  assert.ok(estimated<=128,'fixture construction bound');
  while(count<estimated)await append();
  const unknown=issuedOp(athleteId,deviceId,lease,identityKey,count+1,0,{op_id:'resource-unknown-not-sent'});
  const request={version:'earned/reconcile-request-1m/v1',mode:'ACCOUNT_RECOVERY',nonce:nonce(),context_id:nonce(),
    claims:[{claim_id:'resource-unknown',envelope_b64:C.encode64(C.encode(unknown))}],requested_lease_ids:[]};
  const baseline=await bridge.reconcileScoped(subject,deviceId,request,undefined,trustedContext);
  assert.ok(baseline.payloadBytes.length<targetBytes,'real accepted facts fit below target');
  const baselineRows=await readLogicalRows(db),metadata=baselineRows.find(r=>r.athlete===athleteId&&r.collection==='metadata'&&r.row_id==='state');
  const originalMetadata=metadata.value;
  const originalRawBytes=Buffer.byteLength(originalMetadata,'utf8');
  const dtoIndex=baseline.payload.retained_rows.findIndex(r=>r.collection==='metadata'&&r.row_id==='state');
  const base64Length=baseline.payload.retained_rows[dtoIndex].value_b64.length;
  assert.ok(dtoIndex>=0);
  async function applyTarget(bytes){
    assert.ok(Number.isSafeInteger(bytes)&&bytes>=baseline.payloadBytes.length&&bytes<=C.LIMITS.payload+1);
    let selected;
    // Unpadded base64 has one unavailable length in each group of four. A
    // one-character synthetic claim label adjusts that residue without changing
    // any authority fact or inventing a record the backend does not possess.
    for(let label=0;label<4&&!selected;label++){
      const desiredB64=base64Length+(bytes-baseline.payloadBytes.length)-label;
      const approximate=Math.floor(desiredB64*3/4);
      for(let raw=approximate-2;raw<=approximate+2;raw++)if(raw>=originalRawBytes&&Math.ceil(raw*4/3)===desiredB64)
        {selected={label,padding:raw-originalRawBytes};break;}
    }
    assert.ok(selected,'exact base64 residue');
    const value=originalMetadata+' '.repeat(selected.padding);
    assert.ok(Buffer.byteLength(value,'utf8')<2097152,'individual D1 JSON row below 2MiB');
    const revision=(await db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision;
    if(writeLogicalRow)await writeLogicalRow({athlete:athleteId,collection:'metadata',row_id:'state',value},revision);
    else await db.batch([
      db.prepare('UPDATE authority_revision SET revision=CASE WHEN revision=? THEN revision ELSE -1 END WHERE id=1').bind(revision),
      db.prepare("UPDATE authority_rows SET value=? WHERE athlete=? AND collection='metadata' AND row_id='state'").bind(value,athleteId),
      db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1'),
    ]);
    const nextRequest={...request,claims:[{...request.claims[0],claim_id:request.claims[0].claim_id+'x'.repeat(selected.label)}]};
    const actualRows=await readLogicalRows(db),validated=validateRetained(actualRows,athleteId);
    assert.equal(validated.metadata.seq,count);
    const expected=structuredClone(baseline.payload);
    expected.claims[0].claim_id=nextRequest.claims[0].claim_id;
    expected.retained_rows[dtoIndex]={...expected.retained_rows[dtoIndex],value_b64:C.encode64(C.bytes(value))};
    const expectedBytes=C.encode(expected);assert.equal(expectedBytes.length,bytes,'independent exact byte count');
    let actual;
    if(bytes<=C.LIMITS.payload){actual=await bridge.reconcileScoped(subject,deviceId,nextRequest,undefined,trustedContext);
      assert.deepEqual(Buffer.from(actual.payloadBytes),Buffer.from(expectedBytes),'real D1 guarded projection bytes');}
    else await assert.rejects(bridge.reconcileScoped(subject,deviceId,nextRequest,undefined,trustedContext),{code:'RECONCILE_LIMIT',status:413});
    assert.deepEqual(await readLogicalRows(db),actualRows,'query never rewrites domain data');
    const population=declaredPopulation(actualRows);
    return {athleteId,subject,deviceId,lease,request:nextRequest,requestBytes:C.encode(nextRequest),
      payloadBytes:expectedBytes,payloadDigest:C.hash('payload',expectedBytes),population,
      expectedOutcome:bytes<=C.LIMITS.payload?'COMPLETE_BYTES':'RECONCILE_LIMIT',acceptedSyntheticFacts:count,
      assertion:'Exact stored synthetic authority state; no resource or remote acceptance implied',applyTarget};
  }
  return applyTarget(targetBytes);
}
module.exports={populate,declaredPopulation};

if(require.main===module){
  (async()=>{
    const fs=require('node:fs'),path=require('node:path');
    const {createLocalD1}=require('../local-d1.cjs'),{createBridge}=require('../bridge.cjs'),{buildCore}=require('../build.cjs');
    const {generateSigningKey}=require('../crypto.cjs');
    await buildCore();const runtime=await createLocalD1();
    try{
      const sql=fs.readFileSync(path.join(__dirname,'../migrations/0002_reconciliation.sql'),'utf8').replace(/--[^\n]*/g,'');
      await runtime.db.batch(sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm).map(s=>runtime.db.prepare(s)));
      const context={issuer:'https://resource-issuer.invalid',origin:'https://resource-origin.invalid'};
      const bridge=createBridge({db:runtime.db,authorityKey:generateSigningKey('resource-selftest'),identityKeys:{first:'synthetic-first',second:'synthetic-second'},
        clock:()=> '2026-09-06T12:00:00.000Z',reconciliationProfile:C.PROFILE,r1:context});
      const fixture=await populate({db:runtime.db,bridge,identityKey:'synthetic-first',trustedContext:context,targetBytes:262144,
        foreign:{athleteId:'second',subject:'subject-second',identityKey:'synthetic-second'}});
      assert.equal(fixture.payloadBytes.length,262144);assert.equal((await fixture.applyTarget(262145)).payloadBytes.length,262145);
      console.log('R1 RESOURCE FIXTURE SELFTEST PASS — actual D1 synthetic 262144/262145-byte projections; measurement not run');
    }finally{await runtime.close();}
  })().catch(error=>{console.error(error);process.exitCode=1;});
}
