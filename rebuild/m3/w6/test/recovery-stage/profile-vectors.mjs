import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {validateRecoveryProfile} from '../../recovery-profile.mjs';

// Test-only whole-row materialization and old-profile assembly oracle. Neither
// helper is imported by the product validator or repository.
export async function profileVectors(t,{allRows,C,P,Sign,require,authority,identityKey,expected,request}){
 const Old=require('./reconciliation/project.cjs'),Verify=require('./reconciliation/verify.cjs'),Public=require('./public-client.cjs');
 const parse=row=>C.parse(row.value,P.LIMITS.row),pair=(a,b)=>JSON.stringify([a,b]);
 const originals=allRows.filter(r=>r.collection==='log').map(parse).sort((a,b)=>a.seq-b.seq),keep=new Set(originals.slice(0,2).map(x=>x.op.op_id));
 const base=allRows.filter(r=>!['operations','ownership'].includes(r.collection)||keep.has(r.row_id)).filter(r=>r.collection!=='log'||Number(r.row_id)<=2).filter(r=>r.collection!=='history'||keep.has(JSON.parse(r.row_id)[0])).filter(r=>r.collection!=='slots'||keep.has(parse(r).op_id)).map(r=>({...r}));
 const change=(rows,c,id,fn)=>{const row=rows.find(r=>r.collection===c&&r.row_id===String(id));assert(row,`vector target ${c}`);const value=parse(row);fn(value);row.value=JSON.stringify(value);};
 change(base,'metadata','state',x=>x.seq=2);change(base,'lastAccepted',expected.actorDeviceId,x=>x.seq=2);
 const opId=originals[0].op.op_id,leaseRow=base.find(r=>r.collection==='issuedLeases'),lease=parse(leaseRow).lease;
 const keys=[Sign.publicKeyOf(authority)],publicVerifier=Public.createPublicVerifier({keys,subtle:webcrypto.subtle});
 const sign=record=>({...record,authority_signature:Sign.signatureOver(record,authority,record.profile)});
 const fullExpected={...expected,nonce:request.nonce,contextId:request.context_id,mode:request.mode,sessionEpoch:1};
 async function reference(rows,req){
  try{const bytes=C.encode(req),projected=Old.project({rawRows:rows,athleteId:expected.athleteId,actorDeviceId:expected.actorDeviceId,request:req,scopeDigest:expected.scopeDigest});
   const m=sign(C.makeManifest({keyEpoch:authority.kid,scopeDigest:expected.scopeDigest,requestBytes:bytes,snapshotId:P.hash('test-snapshot','prefix'),payloadBytes:projected.payloadBytes,coverage:projected.payload.coverage})),mr=C.encode(m),pages=[];
   for(let index=0;index<m.page_count;index++)pages.push(C.encode(sign(C.makePage({keyEpoch:authority.kid,manifestBytes:mr,payloadBytes:projected.payloadBytes,index}))));
   const result=await Verify.createR1Verifier({keys,subtle:webcrypto.subtle}).assemble(mr,pages,bytes,{...fullExpected,mode:req.mode,requestDigest:C.hash('request',bytes)});
   return {ok:result.verified,payload:projected.payload,code:result.code};
  }catch(error){return {ok:false,code:error.code};}
 }
 function memoryView(rows,req){
  const manifest={scope_digest:expected.scopeDigest,basis_digest:expected.basisDigest,nonce:req.nonce,context_id:req.context_id,mode:req.mode,request_digest:C.hash('request',C.encode(req)),claim_set_digest:P.hash('claims',req.claims),collection_counts:P.COLLECTIONS.map(c=>[c,rows.filter(r=>r.collection===c).length])};
  const copy=r=>r&&({collection:r.collection,row_id:r.row_id,value:r.value});
  return {async visit(fn){for(const row of rows)await fn(copy(row));},async scan(c,fn){for(const row of rows.filter(r=>r.collection===c))await fn(copy(row));},async readRow(c,id){return copy(rows.find(r=>r.collection===c&&r.row_id===id));},async bindings(){return {manifest};},async assertCurrent(){}};
 }
 const candidate=(rows,req)=>validateRecoveryProfile({inventory:memoryView(rows,req),codec:C,protocol:P,publicVerifier,requestBytes:C.encode(req),expected});
 await t.test('under-cap two-operation prefix agrees with unchanged assemble oracle',async()=>{assert((await reference(base,request)).ok);const result=await candidate(base,request);assert.equal((await result.summary()).W,2);assert.equal(result.complete,false);assert.equal(result.activated,false);});
 const vectors=[];
 const edit=(name,c,id,fn)=>vectors.push([name,rows=>change(rows,c,id,fn)]),remove=(name,c,id)=>vectors.push([name,rows=>rows.splice(rows.findIndex(r=>r.collection===c&&r.row_id===String(id)),1)]);
 edit('metadata extra field','metadata','state',x=>x.extra=true);
 edit('metadata log frontier gap','metadata','state',x=>x.seq=3);
 edit('registry unknown profile','accountRegistry','state',x=>x.profile='unknown');
 edit('registry nonpositive epoch','accountRegistry','state',x=>x.account_epoch=0);
 edit('unproved history origin','accountRegistry','state',x=>x.history_origin='TRUST_ME');
 edit('lease issuer mismatch','issuedLeases',leaseRow.row_id,x=>x.issuer_profile='unknown');
 edit('lease byte/object mismatch','issuedLeases',leaseRow.row_id,x=>x.lease.range[1]++);
 edit('lease original signature forged','issuedLeases',leaseRow.row_id,x=>{x.lease.signature='forged';x.lease_bytes_b64=C.encode64(C.encode(x.lease));});
 vectors.at(-1)[1]=rows=>{change(rows,'issuedLeases',leaseRow.row_id,x=>{x.lease.signature='forged';x.lease_bytes_b64=C.encode64(C.encode(x.lease));});change(rows,'metadata','state',x=>x.devices[expected.actorDeviceId].lease.signature='forged');};
 edit('lease ordinal gap','issuedLeases',leaseRow.row_id,x=>x.issue_ordinal=2);
 edit('lease creation gap','issuedLeases',leaseRow.row_id,x=>x.creation_epoch=2);
 edit('device pointer changed','deviceIssuance',expected.actorDeviceId,x=>x.current_lease_id='missing');
 edit('device pointer extra field','deviceIssuance',expected.actorDeviceId,x=>x.extra=true);
 remove('device pointer absent','deviceIssuance',expected.actorDeviceId);
 const enrollment=base.find(r=>r.collection==='enrollmentIntents');
 remove('lease lacks enrollment origin','enrollmentIntents',enrollment.row_id);
 edit('enrollment intent digest mismatch','enrollmentIntents',enrollment.row_id,x=>x.stable_request_digest=P.hash('bad','intent'));
 edit('operation identity mismatch','operations',opId,x=>x.op.op_id='different');
 edit('operation commitment mismatch','operations',opId,x=>x.commitment='different');
 edit('disposition identity mismatch','operations',opId,x=>x.disposition.op_id='different');
 edit('operation history count gap','operations',opId,x=>x.historyCount=2);
 remove('original history missing','history',pair(opId,1));
 edit('original history terminal mismatch','history',pair(opId,1),x=>x.status='WAITING');
 vectors.push(['original disposition signature forged',rows=>{change(rows,'history',pair(opId,1),x=>x.authority_signature='forged');change(rows,'operations',opId,x=>x.disposition.authority_signature='forged');}]);
 remove('ownership missing','ownership',opId);
 edit('ownership false','ownership',opId,x=>x.present=false);
 vectors.push(['orphan ownership',rows=>rows.push({athlete:expected.athleteId,collection:'ownership',row_id:'orphan',value:'{"present":true}'})]);
 remove('slot missing','slots',pair(expected.actorDeviceId,1));
 edit('slot incumbent missing','slots',pair(expected.actorDeviceId,1),x=>x.op_id='absent');
 edit('log operation changed','log','1',x=>x.op.payload={changed:true});
 edit('log acceptance time changed','log','1',x=>x.accepted_at='different');
 vectors.push(['log ordinal key gap',rows=>{rows.find(r=>r.collection==='log'&&r.row_id==='1').row_id='3';}]);
 vectors.push(['coherent signed log gap defeats counts alone',rows=>{
  const row=rows.find(r=>r.collection==='log'&&r.row_id==='1'),value=parse(row);row.row_id='3';value.seq=3;row.value=JSON.stringify(value);
  let disposition;change(rows,'operations',opId,x=>{x.disposition=Sign.signDisposition({...x.disposition,athlete_log_seq:3},authority);disposition=x.disposition;});change(rows,'history',pair(opId,1),x=>Object.assign(x,disposition));
 }]);
 edit('last accepted stale','lastAccepted',expected.actorDeviceId,x=>x.seq=1);
 vectors.push(['foreign last accepted device',rows=>rows.push({athlete:expected.athleteId,collection:'lastAccepted',row_id:'foreign',value:'{"seq":1}'})]);
 vectors.push(['revocation without declared loss',rows=>rows.push({athlete:expected.athleteId,collection:'revocations',row_id:expected.actorDeviceId,value:'{"barrier":2,"declared_loss":false}'})]);
 vectors.push(['orphan transaction',rows=>rows.push({athlete:expected.athleteId,collection:'transactions',row_id:'t',value:'{"txn_id":"t","op_id":"absent","seq":1}'})]);
 const genesis=base.find(r=>r.collection==='standingEvents'&&parse(r).kind==='PROFILE_GENESIS');
 remove('genesis evidence absent','standingEvents',genesis.row_id);
 edit('unknown standing event','standingEvents',genesis.row_id,x=>x.kind='UNKNOWN');
 edit('standing event foreign athlete','standingEvents',genesis.row_id,x=>x.athlete_id='foreign');
 const enrolled=base.find(r=>r.collection==='standingEvents'&&parse(r).kind==='DEVICE_ENROLLED');
 remove('device enrollment evidence absent','standingEvents',enrolled.row_id);
 edit('standing creation mismatch','standingEvents',enrolled.row_id,x=>x.creation_epoch=3);
 edit('closed account missing evidence','accountRegistry','state',x=>x.state='CLOSED');
 for(const [name,mutate]of vectors)await t.test(name,async()=>{const rows=structuredClone(base);mutate(rows);const old=await reference(rows,request);assert.equal(old.ok,false,'vector must fail unchanged original relational/signature oracle');await assert.rejects(candidate(rows,request));});
 await t.test('five claim cases and requested lease bytes agree with unchanged oracle',async()=>{
  const first=originals[0].op,ops=[first,{...first,payload:{different:true}},{...first,canonical_content_commitment:'different'},{...first,op_id:'unknown-slot',device_seq:99},{...first,op_id:'colliding-slot'}];
  const req={...request,claims:ops.map((op,i)=>({claim_id:'claim-'+i,envelope_b64:C.encode64(C.encode(op))})),requested_lease_ids:[{source_device_id:expected.actorDeviceId,lease_id:lease.lease_id},{source_device_id:expected.actorDeviceId,lease_id:'unknown'}]};
  const old=await reference(base,req);assert(old.ok);const result=await candidate(base,req),got=[];
  const dto=r=>r?Old.rowDto({...r,athlete:expected.athleteId}):null;
  await result.claims(async(c,history)=>{const history_rows=[];await history(r=>history_rows.push(dto(r)));const {history_count,...rest}=c;got.push({...rest,stored_operation_row:dto(c.stored_operation_row),history_rows,slot_incumbent:dto(c.slot_incumbent)});});
  assert.deepEqual(got,old.payload.claims);const leases=[];await result.leases(x=>leases.push({...x,issued_row:dto(x.issued_row)}));assert.deepEqual(leases,old.payload.leases.lookups);
 });
 await t.test('signed synthetic WAITING history preserves its separate claim outcome',async()=>{
  const op=require('../../client/ops.cjs').build({...originals[0].op,op_id:'synthetic-waiting',device_seq:99,predecessor:null,parents:['not-yet-known']},identityKey);
  const d=structuredClone(parse(base.find(r=>r.collection==='operations'&&r.row_id===opId)).disposition);delete d.accepted_at;delete d.athlete_log_seq;
  Object.assign(d,{op_id:op.op_id,device_seq:op.device_seq,canonical_content_commitment:op.canonical_content_commitment,status:'WAITING'});const disposition=Sign.signDisposition(d,authority);
  const rows=structuredClone(base),add=(collection,row_id,value)=>rows.push({athlete:expected.athleteId,collection,row_id,value:JSON.stringify(value)});
  add('operations',op.op_id,{op,commitment:op.canonical_content_commitment,disposition,historyCount:1});add('history',pair(op.op_id,1),disposition);add('ownership',op.op_id,{present:true});add('slots',pair(op.device_id,op.device_seq),{op_id:op.op_id});
  const req={...request,claims:[{claim_id:'waiting',envelope_b64:C.encode64(C.encode(op))}]};assert((await reference(rows,req)).ok);const result=await candidate(rows,req);let outcome;await result.claims(x=>outcome=x.outcome);assert.equal(outcome,'KNOWN_WAITING');
 });
 await t.test('signed synthetic renewal retains ordinal, range, intent and event relations',async()=>{
  const rows=structuredClone(base),x=parse(leaseRow),intent=P.hash('synthetic','renewal');x.issue_ordinal=2;x.creation_epoch=2;x.issuance_intent_digest=intent;x.lease=Sign.signLease({...x.lease,lease_id:'synthetic-renewal',range:[x.lease.range[0],x.lease.range[1]+1]},authority);x.lease_bytes_b64=C.encode64(C.encode(x.lease));
  rows.push({athlete:expected.athleteId,collection:'issuedLeases',row_id:pair(x.lease.device_id,x.lease.lease_id),value:JSON.stringify(x)},{athlete:expected.athleteId,collection:'issuanceIntents',row_id:pair(x.lease.device_id,'renewal-intent'),value:JSON.stringify({stable_request_digest:intent,lease_id:x.lease.lease_id,result_creation_epoch:2})},{athlete:expected.athleteId,collection:'standingEvents',row_id:'synthetic-renewed',value:JSON.stringify({kind:'LEASE_RENEWED',athlete_id:expected.athleteId,device_id:x.lease.device_id,account_epoch:x.account_epoch,creation_epoch:2,evidence:{lease_id:x.lease.lease_id}})});
  change(rows,'metadata','state',v=>v.devices[x.lease.device_id].lease=x.lease);change(rows,'deviceIssuance',x.lease.device_id,v=>Object.assign(v,{creation_epoch:2,issue_ordinal:2,current_lease_id:x.lease.lease_id}));
  assert((await reference(rows,request)).ok);assert.equal((await candidate(rows,request)).profileVerified,true);
  const duplicate=structuredClone(rows);change(duplicate,'issuedLeases',pair(x.lease.device_id,x.lease.lease_id),v=>v.issue_ordinal=1);assert.equal((await reference(duplicate,request)).ok,false);await assert.rejects(candidate(duplicate,request));
 });
 await t.test('signed synthetic second-device inventory permits account recovery and refuses foreign current-device claims',async()=>{
  const rows=structuredClone(base),x=parse(leaseRow),device='synthetic-second',intent=P.hash('synthetic','second');x.issuance_intent_digest=intent;x.lease=Sign.signLease({...x.lease,device_id:device,lease_id:'second-first-lease'},authority);x.lease_bytes_b64=C.encode64(C.encode(x.lease));
  change(rows,'metadata','state',v=>v.devices[device]={lease:x.lease});
  const add=(collection,row_id,value)=>rows.push({athlete:expected.athleteId,collection,row_id,value:JSON.stringify(value)});
  add('issuedLeases',pair(device,x.lease.lease_id),x);add('deviceIssuance',device,{device_id:device,creation_epoch:1,current_lease_id:x.lease.lease_id,issue_ordinal:1});add('enrollmentIntents','synthetic-second',{stable_request_digest:intent,device_id:device,lease_id:x.lease.lease_id});add('standingEvents','synthetic-second',{kind:'DEVICE_ENROLLED',athlete_id:expected.athleteId,device_id:device,account_epoch:x.account_epoch,creation_epoch:1,evidence:{lease_id:x.lease.lease_id}});
  const req={...request,mode:'ACCOUNT_RECOVERY',requested_lease_ids:[{source_device_id:device,lease_id:x.lease.lease_id}],claims:[{claim_id:'other-device',envelope_b64:C.encode64(C.encode({...originals[0].op,device_id:device,op_id:'unknown-second'}))}]};
  assert((await reference(rows,req)).ok);assert.equal((await candidate(rows,req)).profileVerified,true);req.mode='CURRENT_DEVICE';assert.equal((await reference(rows,req)).ok,false);await assert.rejects(candidate(rows,req));
 });
 await t.test('foreign-device lease and claim retain CURRENT_DEVICE refusal',async()=>{for(const req of [{...request,requested_lease_ids:[{source_device_id:'foreign',lease_id:'x'}]},{...request,claims:[{claim_id:'foreign',envelope_b64:C.encode64(C.encode({...originals[0].op,device_id:'foreign'}))}]}]){assert.equal((await reference(base,req)).ok,false);await assert.rejects(candidate(base,req));}});
}
