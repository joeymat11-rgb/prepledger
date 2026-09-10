'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const Time=require('./source-control-time-proposal.cjs'),V=require('../workout/edit-values.cjs'),Ops=require('../../client/ops.cjs');
const r1=process.env.EARNED_SOURCE_R1_ROOT,helper=process.env.EARNED_SOURCE_CONTROL_HELPER;
assert(r1&&helper,'Explicit retained source roots required');
const originalPath=path.join(r1,'rebuild/m3/w5/source/codec.cjs'),candidatePath=path.join(helper,'candidate/rebuild/m3/w5/source/codec.cjs');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(originalPath),'e6591fcd586b568a6fa8c0aff89336dde75e4c80864f4fe23c399e1dc1c3c0d6');
assert.equal(sha(candidatePath),'fbb9138428a0d24211e414b32c9d2cfb6880057c64c7840a3a8a6dcd55a67d77');
const Original=require(originalPath),Candidate=require(candidatePath);
const effective={local_date:'2026-09-10',local_time:'12:00',utc_offset:'-04:00'},digest='ab'.repeat(32),source='public-source';
function control(version=2,{e=effective,interval=Time.intervalFor(e),rollback=false}={}){
 return Ops.build({op_id:rollback?'rollback':'import',athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,
  parents:[],kind:'fact',class:'event',schema_version:version,lease_id:'synthetic-unissued',effective:e,
  payload:{type:rollback?'source-rollback-intent':'source-import-intent',source_id:source,material_digest:digest,interval,
   ...(rollback?{target_activation_id:'original-activation'}:{})}},'public-synthetic-identity');
}
const sourceCheck=(codec,op)=>codec.intent(op,op.payload.type==='source-import-intent'?'activate':'rollback',source,digest,
 op.payload.type==='source-import-intent'?null:'original-activation');
const proposed=op=>{if(op.schema_version===2)Time.assertV2(op);return sourceCheck(Candidate,op);};
const fails=(run,code)=>assert.throws(run,e=>e.code===code);
test('new point retains the exact supported effective spelling without date or timezone inference',()=>{
 for(const e of [effective,{local_date:'2028-02-29',local_time:'00:00:00',utc_offset:'+00:00'},
  {local_date:'2026-11-01',local_time:'01:30:00.123',utc_offset:'-05:00'},
  {local_date:'2026-03-08',local_time:'03:00:00.1',utc_offset:'-04:00'}]){
  const expected=e.local_date+'T'+e.local_time+e.utc_offset;
  assert.deepEqual(Time.intervalFor(e),{start:expected,end:expected});
  assert.deepEqual(Time.assertV2(control(2,{e})),{start:expected,end:expected});
 }
});
test('common effective grammar is reused, with no new permissive timestamp parser',()=>{
 for(const e of [{...effective,local_date:'2026-02-29'},{...effective,local_time:'24:00'},
  {...effective,local_time:'12:00:00.1234'},{...effective,utc_offset:'Z'},{local_date:'2026-09-10'}]){
  assert.equal(V.effective(e),false);fails(()=>Time.intervalFor(e),'SOURCE_CONTROL_EFFECTIVE');
 }
 // Shared grammar is preserved, not silently replaced with a stricter UTC
 // offset standard. Complete-profile review owns any separate offset change.
 const existing={...effective,utc_offset:'+23:00'};assert.equal(V.effective(existing),true);
 assert.equal(Time.intervalFor(existing).start,'2026-09-10T12:00+23:00');
});
test('new v2 rejects date-only, empty/missing/extra and differently expressed endpoints',()=>{
 const point=Time.intervalFor(effective).start;
 for(const interval of [null,{}, {start:point},{start:point,end:point,extra:true},
  {start:'',end:''},{start:'2026-09-10',end:'2026-09-10'},
  {start:point,end:'2026-09-09T12:00-04:00'},
  {start:'2026-09-10T16:00+00:00',end:'2026-09-10T16:00+00:00'},
  {start:'2026-09-10T12:00:00-04:00',end:'2026-09-10T12:00:00-04:00'}]){
  fails(()=>Time.assertV2(control(2,{interval})),'SOURCE_CONTROL_DECLARED_POINT');
 }
 // Even equal instants expressed in different offsets are different original
 // field spellings; this point contract performs no instant ordering.
 fails(()=>Time.assertV2(control(2,{interval:{start:point,end:'2026-09-10T16:00+00:00'}})),'SOURCE_CONTROL_DECLARED_POINT');
});
test('rollback gets its own declared point, not the old activation interval or acceptance time',()=>{
 const e={...effective,local_date:'2026-09-12'},rollback=control(2,{e,rollback:true});
 assert.equal(Time.assertV2(rollback).start,'2026-09-12T12:00-04:00');assert.doesNotThrow(()=>proposed(rollback));
 fails(()=>Time.assertV2(control(2,{e,rollback:true,interval:Time.intervalFor(effective)})),'SOURCE_CONTROL_DECLARED_POINT');
 const backdated=control(2,{e:{...effective,local_date:'2026-09-08'},rollback:true});
 assert.doesNotThrow(()=>proposed(backdated));
 assert.equal(backdated.payload.target_activation_id,'original-activation');
});
test('actual old and candidate source subsets preserve v1 original bytes in both historical spellings',()=>{
 for(const interval of [{start:'2026-09-04',end:'2026-09-04'},
  {start:'2026-09-04T12:00:00-04:00',end:'2026-09-04T12:00:00-04:00'}])for(const rollback of [false,true]){
  const o=control(1,{interval,rollback}),bytes=JSON.stringify(o),commitment=o.canonical_content_commitment;
  sourceCheck(Original,o);proposed(o);
  assert.equal(JSON.stringify(o),bytes);assert.equal(Ops.commitmentOf(o,'public-synthetic-identity'),commitment);
  fails(()=>Time.assertV2(o),'SOURCE_CONTROL_TIME_VERSION');
 }
});
test('point validation supplies no source coverage, admission, identity reuse or version widening',()=>{
 const o=control();assert.doesNotThrow(()=>proposed(o));fails(()=>sourceCheck(Original,o),'SOURCE_INTENT');
 const wrong={...o,payload:{...o.payload,material_digest:'cd'.repeat(32)}};
 assert.doesNotThrow(()=>Time.assertV2(wrong));fails(()=>proposed(wrong),'SOURCE_INTENT');
 const another=control(2,{e:{...effective,local_time:'12:01'}});
 assert.notEqual(another.canonical_content_commitment,o.canonical_content_commitment);
 const physiological=Ops.build({op_id:'ordinary',athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,parents:[],
  kind:'fact',class:'event',schema_version:2,lease_id:'synthetic-unissued',effective,
  payload:{type:'ordinary',interval:Time.intervalFor(effective)}},'public-synthetic-identity');
 fails(()=>Time.assertV2(physiological),'SOURCE_CONTROL_TIME_KIND');
});
