'use strict';
// Real loopback Worker, auth, P-256, R1 bridge, SQL migrations and D1. The test
// installs a deliberately unissued historical schema2 capability; full R1
// recovery MUST still refuse that unsupported history. This is admission only.
const assert = require('node:assert/strict'), path = require('node:path');
const {randomBytes} = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const {createR1Runtime} = require(path.join(root, 'rebuild/m3/w5/test/r1-workerd.cjs'));
const C = require(path.join(root, 'rebuild/m3/w5/reconciliation/codec.cjs'));
const crypto = require(path.join(root, 'rebuild/m3/w5/crypto.cjs'));
const Ops = require(path.join(root, 'rebuild/client/ops.cjs'));
const nonce = () => randomBytes(32).toString('base64url');
let passed = 0, failed = 0;
async function check(name, body) {
  try {await body(); passed++; console.log('PASS ' + name);}
  catch (error) {failed++; console.log('FAIL ' + name + ': ' + (error.code || error.name));}
}
async function main() {
  const option=process.argv.indexOf('--authority-root');
  const r = await createR1Runtime(option<0?{}:{authorityRoot:path.resolve(process.argv[option+1])});
  try {
    assert.deepEqual(await r.bridge.initializeR1({first:{devices:{},plan:{}},second:{devices:{},plan:{}}},
      {'subject-first':'first','subject-second':'second'}), {initialized:true});
    async function enroll(subject) {
      const request={intent_id:'workout-'+nonce(),schema_version:1,nonce:nonce()};
      C.validateRouteRequest('/enrol/create',request);
      const response = await r.request('/enrol/create', request, subject);
      assert.equal(response.status, 200);
      assert(crypto.verifyRecord(response.body, r.authorityKey, response.body.profile));
      const payload = C.parse(C.decode64(response.body.data_b64));
      const lease = payload.issuance.lease, athlete = lease.athlete_id, device = lease.device_id;
      const account=await r.db.prepare('SELECT value FROM authority_rows WHERE athlete=? AND collection=? AND row_id=?')
        .bind(athlete,'accountRegistry','state').first();
      assert.deepEqual(Object.keys(JSON.parse(account.value)).sort(),['account_epoch','history_origin','profile','state']);
      assert.equal(JSON.parse(account.value).profile,'earned/r1/v1');
      assert.equal(JSON.parse(account.value).state,'ACTIVE');
      const row = await r.db.prepare('SELECT value FROM authority_rows WHERE athlete=? AND collection=? AND row_id=?')
        .bind(athlete,'issuedLeases',JSON.stringify([device,lease.lease_id])).first();
      const issued = JSON.parse(row.value);
      const artificial = crypto.signLease({...lease, lease_id:'workout-'+nonce(), schema_version:2}, r.authorityKey);
      const historical = {...issued, lease:artificial, lease_bytes_b64:C.encode64(C.encode(artificial)),
        creation_epoch:2, issue_ordinal:2};
      await r.db.batch([
        r.db.prepare('INSERT INTO authority_rows (athlete,collection,row_id,value) VALUES (?,?,?,?)')
          .bind(athlete,'issuedLeases',JSON.stringify([device,artificial.lease_id]),JSON.stringify(historical)),
        r.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1'),
      ]);
      let seq = 0;
      return {subject, athlete, device, lease, artificial, next:()=>++seq};
    }
    const a = await enroll('subject-first'), b = await enroll('subject-first'), foreign = await enroll('subject-second');
    function op(actor, kind, {id=nonce(), start='missing-start', target='missing-target', version=2, payload, extra={}}={}) {
      const fields = kind==='session-start' ? {planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}
        : kind==='correction'||kind==='tombstone' ? {lift_lineage_id:'lift-A'}
        : {session_start_op_id:start,logical_set_slot:nonce(),lift_lineage_id:'lift-A'};
      return Ops.build({op_id:id,athlete_id:actor.athlete,device_id:actor.device,device_seq:actor.next(),
        predecessor:null,parents:[],class:'session',kind,schema_version:version,
        lease_id:version===2?actor.artificial.lease_id:actor.lease.lease_id,
        effective:{local_date:'2026-09-03',local_time:'12:00',utc_offset:'-04:00'},
        target:['correction','tombstone'].includes(kind)?target:undefined,
        payload:payload||(kind==='session-start'?{}:kind==='correction'?{replacement_fields:{reps:{value:7,unit:'rep'}}}
          :{load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'}}),extra:{...fields,...extra}},r.identityKeys[actor.athlete]);
    }
    async function admit(actor, operation) {
      const response = await r.request('/op',{device_id:actor.device,operation},actor.subject);
      assert.equal(response.status,200); assert(crypto.verifyDisposition(response.body.disposition,r.authorityKey));
      assert.equal(response.body.disposition.op_id,operation.op_id);
      assert.equal(response.body.disposition.canonical_content_commitment,operation.canonical_content_commitment);
      return response.body.disposition;
    }
    await check('http-declared-start-waits-drains-and-exact-reply-loss-retry',async()=>{
      const start=op(a,'session-start'), set=op(a,'session-set',{start:start.op_id}), bytes=JSON.stringify(set);
      assert.equal((await admit(a,set)).status,'WAITING');
      assert.equal((await admit(a,start)).status,'ACCEPTED');
      const terminal=await admit(a,set); assert.equal(terminal.status,'ACCEPTED');
      assert.deepEqual(await admit(a,set),terminal); assert.equal(JSON.stringify(set),bytes);
      const history=await r.bridge.invoke('dispositionHistory',[a.athlete,a.device,set.device_seq]);
      assert.deepEqual(history.map(x=>x.status),['WAITING','ACCEPTED']);
    });
    await check('http-foreign-start-refused',async()=>{
      const start=op(foreign,'session-start'); assert.equal((await admit(foreign,start)).status,'ACCEPTED');
      assert.equal((await admit(a,op(a,'session-set',{start:start.op_id}))).rejection_code,'CROSS_ATHLETE_REFERENCE');
    });
    await check('http-wrong-kind-start-refused',async()=>{
      const target=op(a,'session-set',{version:1}); assert.equal((await admit(a,target)).status,'ACCEPTED');
      assert.equal((await admit(a,op(a,'session-set',{start:target.op_id}))).rejection_code,'MALFORMED');
    });
    await check('http-rejected-start-child-terminal',async()=>{
      const start=op(a,'session-start'); start.canonical_content_commitment='bad';
      assert.equal((await admit(a,start)).status,'REJECTED');
      assert.equal((await admit(a,op(a,'session-set',{start:start.op_id}))).status,'REJECTED_DEPENDENCY');
    });
    await check('http-second-device-target-and-lineage-check',async()=>{
      const start=op(b,'session-start'); assert.equal((await admit(b,start)).status,'ACCEPTED');
      const set=op(a,'session-set',{start:start.op_id}); assert.equal((await admit(a,set)).status,'ACCEPTED');
      assert.equal((await admit(b,op(b,'correction',{target:set.op_id}))).status,'ACCEPTED');
      assert.equal((await admit(b,op(b,'correction',{target:set.op_id,extra:{lift_lineage_id:'wrong'}}))).rejection_code,'MALFORMED');
    });
    await check('http-required-reps-refused-before-acceptance',async()=>{
      const bad=op(a,'session-set',{payload:{load:{value:40,unit:'lb'}}});
      assert.equal((await admit(a,bad)).rejection_code,'MALFORMED');
    });
    await check('http-schema1-replay-retains-original-bytes',async()=>{
      const old=op(a,'session-set',{version:1,payload:{}}), bytes=JSON.stringify(old);
      const accepted=await admit(a,old); assert.equal(accepted.status,'ACCEPTED');
      assert.deepEqual(await admit(a,old),accepted); assert.equal(JSON.stringify(old),bytes);
    });
    await check('http-real-issuer-still-refuses-schema2',async()=>{
      const response=await r.request('/enrol/create',{intent_id:'workout-'+nonce(),schema_version:2,nonce:nonce()});
      assert.equal(response.status,400); assert.equal(response.body.error.code,'INVALID_R1_REQUEST');
    });
    await check('http-full-recovery-refuses-artificial-schema2-registry',async()=>{
      const request={version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:nonce(),context_id:nonce(),claims:[],requested_lease_ids:[]};
      const response=await r.request('/reconcile',{device_id:a.device,request_b64:C.encode64(C.encode(request)),continuation:null,page_index:0});
      assert.equal(response.status,500); assert.equal(response.body.error.code,'RETAINED_INTEGRITY');
    });
    console.log(`WORKOUT R1 HTTP ${failed?'FAIL':'PASS'} — ${passed}/${passed+failed}; artificial unissued capability, full recovery NOT QUALIFIED`);
    process.exitCode=failed?1:0;
  } finally {await r.close();}
}
main().catch(error=>{console.error('HARNESS ERROR '+(error.code||error.name)); console.error(String(error.stack).split('\n').filter(line=>line.trim().startsWith('at ')).slice(0,3).join('\n')); process.exitCode=2;});
