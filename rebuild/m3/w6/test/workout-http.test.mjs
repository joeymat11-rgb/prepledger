import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {randomBytes} from 'node:crypto';
import {createDurablePublicClient} from '../public-client.mjs';
import {fixture,initial,config,createT2Stage,faultDatabase} from './support.mjs';
const require=createRequire(import.meta.url),{createR1Runtime}=require('../../w5/test/r1-workerd.cjs');
const C=require('../../w5/reconciliation/codec.cjs'),Sign=require('../../w5/crypto.cjs'),W5=require('../../w5/public-client.cjs');
const nonce=()=>randomBytes(32).toString('base64url');
const start={action:'start',input:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}};
const set=id=>({action:'set',input:{session_start_op_id:id,logical_set_slot:'slot-A',lift_lineage_id:'lift-A',load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'}}});
const wire=body=>({wireVersion:W5.WIRE_VERSION,body});

test('actual W6 commands → local R1 HTTP/D1 → verified durable disposition and second-device receipt',async()=>{
 const r=await createR1Runtime(),clients=[];
 try{
  await r.bridge.initializeR1({first:{devices:{},plan:{}},second:{devices:{},plan:{}}},{'subject-first':'first','subject-second':'second'});
  async function actor(subject='subject-first',fault){
   const e=await r.request('/enrol/create',{intent_id:'workout-'+nonce(),schema_version:1,nonce:nonce()},subject);assert.equal(e.status,200);
   assert(Sign.verifyRecord(e.body,r.authorityKey,e.body.profile));const payload=C.parse(C.decode64(e.body.data_b64)),original=payload.issuance.lease;
   const {athlete_id:athlete,device_id:device}=original;
   const row=await r.db.prepare('SELECT value FROM authority_rows WHERE athlete=? AND collection=? AND row_id=?').bind(athlete,'issuedLeases',JSON.stringify([device,original.lease_id])).first();
   const lease=Sign.signLease({...original,lease_id:'workout-'+nonce(),schema_version:2},r.authorityKey);
   const artificial={...JSON.parse(row.value),lease,lease_bytes_b64:C.encode64(C.encode(lease)),creation_epoch:2,issue_ordinal:2};
   // Same explicitly unissued capability as accepted R1 workout admission. Not issuer or recovery qualification.
   await r.db.batch([r.db.prepare('INSERT INTO authority_rows (athlete,collection,row_id,value) VALUES (?,?,?,?)').bind(athlete,'issuedLeases',JSON.stringify([device,lease.lease_id]),JSON.stringify(artificial)),r.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
   const f=await fixture(fault?{indexedDB:fault.indexedDB}:{}),g=initial();g.metadata.authorityLease=lease;await f.repo.initialize(g,'synthetic-enrollment-only');
   const cfg=()=>({...config(),athleteId:athlete,deviceId:device,identityKey:r.identityKeys[athlete],lease,clock:{...config().clock,now:()=>r.NOW}});
   const c=createDurablePublicClient({repository:f.repo,stage:createT2Stage(cfg,{allowInbound:true}),namespace:f.setup.namespace,athleteId:athlete,deviceId:device,
    sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys:[Sign.publicKeyOf(r.authorityKey)],schemaVersion:2});
   const a={...f,c,athlete,device,subject,lease};clients.push(a);return a;
  }
  const fault=faultDatabase(),a=await actor('subject-first',fault),b=await actor();
  const saved=async(actor,request)=>{const result=await actor.c.execute('workout',request);assert.equal(result.acknowledged,true);return (await actor.repo.load()).generation.collections.ops[result.op_id];};
  const s=await saved(a,start),v=await saved(a,set(s.op_id)),original=JSON.stringify(v);
  async function post(actor,op){const response=await r.request('/op',{device_id:actor.device,operation:op},actor.subject);assert.equal(response.status,200);assert(Sign.verifyDisposition(response.body.disposition,r.authorityKey));return response.body;}
  // C6 before acceptance: nothing sent; both exact local originals remain.
  assert.equal(Object.keys((await a.repo.load()).generation.collections.outbox).length,2);
  const waiting=await post(a,v);assert.equal(waiting.disposition.status,'WAITING');
  const acceptedStart=await post(a,s);assert.equal(acceptedStart.disposition.status,'ACCEPTED');
  // C6 after durable acceptance: deliberately discard the first terminal reply.
  await post(a,v);assert.equal(Object.keys((await a.repo.load()).generation.collections.outbox).length,2);
  const accepted=await post(a,v);assert.equal(accepted.disposition.status,'ACCEPTED');assert.deepEqual(await post(a,v),accepted);
  const before=await a.repo.load(),forged=structuredClone(accepted);forged.disposition.authority_signature='wrong';
  assert.equal((await a.c.acceptResponse('disposition',wire(forged))).accepted,false);assert.deepEqual(await a.repo.load(),before);
  fault.state.armed=true;fault.state.mode='delay';let complete=false;
  const delivered=a.c.acceptResponse('disposition',wire(accepted)).then(value=>{complete=true;return value;});
  await Promise.race([fault.state.write.promise,delivered.then(()=>{throw Error('early disposition completion');})]);assert.equal(complete,false);
  fault.state.release=true;assert.equal((await delivered).accepted,true);fault.state.armed=false;
  let g=(await a.repo.load()).generation;assert.equal(JSON.stringify(g.collections.ops[v.op_id]),original);
  assert.deepEqual(Object.keys(g.collections.outbox),[s.op_id]);assert.deepEqual(g.metadata.wireProofs.disposition[accepted.disposition.authority_signature],accepted.disposition);
  assert.equal((await a.c.acceptResponse('disposition',wire(accepted))).accepted,true);
  assert.equal((await a.c.acceptResponse('disposition',wire(acceptedStart))).accepted,true);
  assert.equal(Object.keys((await a.repo.load()).generation.collections.outbox).length,0);
  const change={action:'correct',input:{target_op_id:v.op_id,lift_lineage_id:'lift-A',replacement_fields:{reserve:{tag:'exact',value:1,unit:'rep'}}}};
  const bBefore=await b.repo.load();assert.equal((await b.c.execute('workout',change)).acknowledged,false);assert.deepEqual(await b.repo.load(),bBefore);
  const pulled=await r.request('/pull',{device_id:b.device,after:0},b.subject);assert.equal(pulled.status,200);
  assert.equal((await b.c.acceptResponse('pull',wire(pulled.body))).accepted,true);
  assert.deepEqual((await b.repo.load()).generation.collections.ops[v.op_id],v);
  const correction=await saved(b,change);assert.equal((await post(b,correction)).disposition.status,'ACCEPTED');
  const after=await r.request('/pull',{device_id:a.device,after:0},a.subject);assert.equal(after.status,200);assert.equal(after.body.receipts.filter(x=>x.op_id===v.op_id).length,1);
  const oldBytes=JSON.stringify((await a.repo.load()).generation.collections.ops[v.op_id]);assert.equal(oldBytes,original);
  const full=await r.request('/reconcile',{device_id:a.device,request_b64:C.encode64(C.encode({version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:nonce(),context_id:nonce(),claims:[],requested_lease_ids:[]})),continuation:null,page_index:0});
  assert.equal(full.status,500);assert.equal(full.body.error.code,'RETAINED_INTEGRITY');
  const issued=await r.request('/enrol/create',{intent_id:'workout-'+nonce(),schema_version:2,nonce:nonce()});assert.equal(issued.status,400);assert.equal(issued.body.error.code,'INVALID_R1_REQUEST');
  console.log('WORKOUT ACTUAL CLIENT/R1 HTTP PASS — exact local commands, both C6 cuts, one effect, signed disposition/receipt, delayed durable drain, second-device reference; issuer/recovery still REFUSE');
 }finally{for(const f of clients)f.repo.close();await r.close();}
});
