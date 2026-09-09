// Complete relational interpretation of an inactive rows-v3 inventory.
// Indexed reads replace retained whole-account maps. No activation is exported.
export async function validateRecoveryProfile({inventory,codec:C,protocol:P,publicVerifier,requestBytes,expected,signal}){
 const abort=()=>{if(signal?.aborted)C.fail('RECOVERY_VALIDATION_ABORTED');};abort();
 const fail=(code='RETAINED_INTEGRITY')=>C.fail(code,code==='SCOPE_FORBIDDEN'?403:code==='HISTORY_INCOMPLETE'?409:500),check=x=>{if(!x)fail();};
 const req=C.decodeRequest(requestBytes),e=C.parse(C.encode(expected)),pair=(a,b)=>JSON.stringify([a,b]);
 check(inventory?.scan&&inventory?.readRow&&publicVerifier?.verifyDisposition&&publicVerifier?.verifyLease);
 check(C.nonempty(e.athleteId)&&C.nonempty(e.actorDeviceId)&&C.digestValue(e.scopeDigest)&&C.digestValue(e.basisDigest));
 await inventory.visit(()=>{abort();});abort();const {manifest:m}=await inventory.bindings();
 check(m.scope_digest===e.scopeDigest&&m.basis_digest===e.basisDigest&&m.nonce===req.nonce&&m.context_id===req.context_id&&m.mode===req.mode&&m.request_digest===C.hash('request',requestBytes)&&m.claim_set_digest===P.hash('claims',req.claims));
 const counts=new Map(m.collection_counts),athlete=e.athleteId;
 const parse=row=>{abort();if(!row)return undefined;const v=C.parse(row.value,P.LIMITS.row);check(C.object(v));return v;};
 const raw=async(c,id)=>{abort();const row=await inventory.readRow(c,String(id));abort();return row;},val=async(c,id)=>parse(await raw(c,id));
 const each=(c,fn)=>{abort();return inventory.scan(c,async row=>{const value=await fn(row.row_id,parse(row),row);abort();return value;});};
 const some=async(c,fn)=>{let found=false;await each(c,async(...args)=>{if(await fn(...args))found=true;});return found;};
 const exact=(v,f)=>C.exact(v,f,{code:'RETAINED_INTEGRITY'});
 // All collection values must be objects, including opaque auxiliary tables.
 for(const c of P.COLLECTIONS)await each(c,()=>{});
 const metadata=await val('metadata','state'),registry=await val('accountRegistry','state');
 check(metadata&&C.safe(metadata.seq)&&C.object(metadata.devices)&&C.object(metadata.initialPlan));exact(metadata,['seq','devices','initialPlan']);check(counts.get('metadata')===1&&counts.get('accountRegistry')===1);
 check(registry);exact(registry,['profile','account_epoch','state','history_origin']);check(registry.profile===C.PROFILE&&C.safe(registry.account_epoch,1)&&['ACTIVE','CLOSED'].includes(registry.state));
 if(!['PROFILE_GENESIS','VERIFIED_IMPORT'].includes(registry.history_origin))fail('HISTORY_INCOMPLETE');
 const devices=Object.keys(metadata.devices).sort(C.compareText),hasDevice=d=>Object.hasOwn(metadata.devices,d);
 const utc=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(Date.parse(s)).toISOString()===(s.includes('.')?s:s.replace('Z','.000Z'));
 await each('issuedLeases',async(id,x)=>{
  exact(x,['lease','lease_bytes_b64','issuer_profile','issue_ordinal','issuance_intent_digest','account_epoch','creation_epoch']);const l=x.lease;
  check(C.object(l)&&C.nonempty(l.device_id)&&C.nonempty(l.lease_id)&&l.athlete_id===athlete&&id===pair(l.device_id,l.lease_id)&&hasDevice(l.device_id));
  check(x.issuer_profile===C.PROFILE&&C.safe(x.issue_ordinal,1)&&C.safe(x.creation_epoch,1)&&C.safe(x.account_epoch,1)&&x.account_epoch<=registry.account_epoch&&C.digestValue(x.issuance_intent_digest));
  check(C.fullEqual(C.parse(C.decode64(x.lease_bytes_b64)),l));check(C.safe(l.schema_version,1)&&Array.isArray(l.range)&&l.range.length===2&&l.range.every(n=>C.safe(n,1))&&l.range[1]>=l.range[0]&&typeof l.signature==='string');
  check(utc(l.not_before)&&utc(l.not_after)&&Date.parse(l.not_after)>=Date.parse(l.not_before));if(!await publicVerifier.verifyLease(l))fail('LEASE_SIGNATURE');
 });
 for(const device of devices){
  const pointer=await val('deviceIssuance',device);check(C.object(metadata.devices[device])&&pointer);exact(metadata.devices[device],['lease']);exact(pointer,['device_id','creation_epoch','current_lease_id','issue_ordinal']);
  check(pointer.device_id===device&&C.safe(pointer.creation_epoch,1)&&C.safe(pointer.issue_ordinal,1));let count=0;
  await each('issuedLeases',(_,x)=>{if(x.lease.device_id===device)count++;});check(count===pointer.issue_ordinal);
  let previous;
  for(let n=1;n<=count;n++){let found,number=0;await each('issuedLeases',(_,x)=>{if(x.lease.device_id===device&&x.issue_ordinal===n){found=x;number++;}});check(number===1&&found.creation_epoch===n);
   if(previous)check(found.lease.range[0]===previous.lease.range[0]&&found.lease.range[1]>previous.lease.range[1]&&Date.parse(found.lease.not_after)>=Date.parse(previous.lease.not_after));previous=found;
  }
  check(pointer.creation_epoch===previous.creation_epoch&&pointer.current_lease_id===previous.lease.lease_id&&C.fullEqual(metadata.devices[device].lease,previous.lease));
 }
 check(counts.get('deviceIssuance')===devices.length);
 await each('issuanceIntents',async(id,x)=>{let k;try{k=JSON.parse(id);}catch{fail();}check(Array.isArray(k)&&k.length===2&&C.nonempty(k[0])&&C.nonempty(k[1]));exact(x,['stable_request_digest','lease_id','result_creation_epoch']);const l=await val('issuedLeases',pair(k[0],x.lease_id));check(l&&l.creation_epoch===x.result_creation_epoch&&l.issuance_intent_digest===x.stable_request_digest);});
 await each('enrollmentIntents',async(_,x)=>{exact(x,['stable_request_digest','device_id','lease_id']);const l=await val('issuedLeases',pair(x.device_id,x.lease_id));check(l&&l.issue_ordinal===1&&l.issuance_intent_digest===x.stable_request_digest);});
 await each('issuedLeases',async(_,x)=>{check(x.issue_ordinal===1?await some('enrollmentIntents',(_,i)=>i.device_id===x.lease.device_id&&i.lease_id===x.lease.lease_id):await some('issuanceIntents',(id,i)=>JSON.parse(id)[0]===x.lease.device_id&&i.lease_id===x.lease.lease_id));});
 let historyCount=0,acceptedCount=0;const maximum=new Map();
 await each('operations',async(id,r)=>{const o=r.op,d=r.disposition;check(C.object(o)&&o.op_id===id&&C.nonempty(o.device_id)&&C.safe(o.device_seq,1)&&C.nonempty(o.canonical_content_commitment)&&r.commitment===o.canonical_content_commitment&&C.object(d)&&['ACCEPTED','WAITING','REJECTED','REJECTED_DEPENDENCY'].includes(d.status)&&C.safe(r.historyCount,1));
  check(d.op_id===id&&d.device_id===o.device_id&&d.device_seq===o.device_seq&&d.canonical_content_commitment===r.commitment&&typeof d.authority_signature==='string');check((await val('ownership',id))?.present===true);
  const slot=await val('slots',pair(o.device_id,o.device_seq));check(slot&&C.nonempty(slot.op_id)&&await val('operations',slot.op_id));
  check(C.safe(historyCount+r.historyCount)&&historyCount+r.historyCount<=counts.get('history'));historyCount+=r.historyCount;
  for(let n=1;n<=r.historyCount;n++){const h=await val('history',pair(id,n));check(h&&h.op_id===id&&h.device_id===o.device_id&&h.device_seq===o.device_seq&&h.canonical_content_commitment===r.commitment&&['ACCEPTED','WAITING','REJECTED','REJECTED_DEPENDENCY'].includes(h.status)&&typeof h.authority_signature==='string');if(n<r.historyCount)check(h.status==='WAITING');else check(C.fullEqual(h,d));if(!await publicVerifier.verifyDisposition(h))fail('DISPOSITION_SIGNATURE');}
  if(d.status==='ACCEPTED'){check(o.athlete_id===athlete&&hasDevice(o.device_id)&&C.safe(d.athlete_log_seq,1));const log=await val('log',d.athlete_log_seq);check(log&&log.seq===d.athlete_log_seq&&C.fullEqual(log.op,o)&&log.accepted_at===d.accepted_at&&slot.op_id===id);acceptedCount++;maximum.set(o.device_id,Math.max(maximum.get(o.device_id)||0,o.device_seq));}
 });
 check(historyCount===counts.get('history')&&counts.get('log')===metadata.seq&&acceptedCount===metadata.seq);
 // Each ordinal resolves back to exactly its accepted operation: no count-only
 // substitute for the old logs Set or contiguous1..W assertion.
 for(let n=1;n<=metadata.seq;n++){const log=await val('log',n),op=log&&await val('operations',log.op?.op_id);check(log&&log.seq===n&&op?.disposition.status==='ACCEPTED'&&op.disposition.athlete_log_seq===n&&C.fullEqual(log.op,op.op)&&log.accepted_at===op.disposition.accepted_at);}
 await each('ownership',async(id,x)=>check(x.present===true&&await val('operations',id)));
 await each('slots',async(id,x)=>{const o=(await val('operations',x.op_id))?.op;check(o&&id===pair(o.device_id,o.device_seq));});
 for(const device of devices){const last=await val('lastAccepted',device);check((last?.seq||0)===(maximum.get(device)||0));if(last)check(C.safe(last.seq,1));const revoked=await val('revocations',device);if(revoked)check(C.safe(revoked.barrier)&&revoked.declared_loss===true);}
 await each('lastAccepted',id=>check(hasDevice(id)));await each('revocations',id=>check(hasDevice(id)));
 await each('transactions',async(id,t)=>{const o=await val('operations',t.op_id);check(o&&o.disposition.status==='ACCEPTED'&&t.txn_id===id&&t.seq===o.disposition.athlete_log_seq);});
 await each('operations',async(_,r)=>{if(r.disposition.status==='ACCEPTED'&&['plan-mutation','conflict-selection'].includes(r.op.kind))check((await val('transactions',r.op.requested_transaction_id))?.op_id===r.op.op_id);});
 await each('standingEvents',async(_,x)=>{exact(x,['kind','athlete_id','device_id','account_epoch','creation_epoch','evidence']);check(['PROFILE_GENESIS','DEVICE_ENROLLED','LEASE_RENEWED','DEVICE_REVOKED','ACCOUNT_CLOSED'].includes(x.kind)&&x.athlete_id===athlete&&C.safe(x.account_epoch,1)&&x.account_epoch<=registry.account_epoch&&C.object(x.evidence));
  if(x.kind==='PROFILE_GENESIS')check(x.device_id===null&&x.creation_epoch===null&&x.evidence.history_origin==='PROFILE_GENESIS');else if(x.kind==='ACCOUNT_CLOSED')check(x.device_id===null&&x.creation_epoch===null&&x.evidence.state==='CLOSED');
  else{check(hasDevice(x.device_id)&&C.safe(x.creation_epoch,1));if(x.kind==='DEVICE_REVOKED')check(C.fullEqual(x.evidence,await val('revocations',x.device_id)));else{const l=await val('issuedLeases',pair(x.device_id,x.evidence.lease_id));check(l&&l.creation_epoch===x.creation_epoch&&(x.kind==='DEVICE_ENROLLED'?l.issue_ordinal===1:l.issue_ordinal>1));}}
 });
 check(await some('standingEvents',(_,x)=>x.kind==='PROFILE_GENESIS')||registry.history_origin==='VERIFIED_IMPORT');
 await each('issuedLeases',async(_,x)=>check(await some('standingEvents',(_,ev)=>ev.kind===(x.issue_ordinal===1?'DEVICE_ENROLLED':'LEASE_RENEWED')&&ev.device_id===x.lease.device_id&&ev.creation_epoch===x.creation_epoch&&ev.evidence.lease_id===x.lease.lease_id)));
 for(const device of devices)if(await val('revocations',device))check(await some('standingEvents',(_,x)=>x.kind==='DEVICE_REVOKED'&&x.device_id===device));
 if(registry.state==='CLOSED')check(await some('standingEvents',(_,x)=>x.kind==='ACCOUNT_CLOSED'&&x.account_epoch===registry.account_epoch));
 if(!hasDevice(e.actorDeviceId)||registry.state!=='ACTIVE'||await val('revocations',e.actorDeviceId))fail('SCOPE_FORBIDDEN');
 const parsedClaims=C.validateClaims(req.claims);
 // The request is bounded by the existing1MiB contract. Histories stay indexed
 // and are streamed to a visitor rather than copied into every claim result.
 async function claimAt(i){const claim=req.claims[i],{op,raw:envelope}=parsedClaims[i];if(op.athlete_id!==athlete||!hasDevice(op.device_id)||req.mode==='CURRENT_DEVICE'&&op.device_id!==e.actorDeviceId)fail('SCOPE_FORBIDDEN');
  const storedRaw=await raw('operations',op.op_id),stored=parse(storedRaw),slotRaw=await raw('slots',pair(op.device_id,op.device_seq)),slot=parse(slotRaw);let outcome='UNKNOWN_AT_SNAPSHOT',match=false;
  if(stored){if(stored.commitment!==op.canonical_content_commitment)outcome='IDENTITY_CONFLICT';else if(!C.fullEqual(stored.op,op))outcome='ENVELOPE_MISMATCH';else{match=true;outcome=stored.disposition.status==='WAITING'?'KNOWN_WAITING':'KNOWN_TERMINAL';}}else if(slot&&slot.op_id!==op.op_id)outcome='IDENTITY_CONFLICT';
  return {claim_id:claim.claim_id,requested_envelope_digest:C.hash('operation',envelope),source_device_id:op.device_id,device_seq:op.device_seq,op_id:op.op_id,commitment:op.canonical_content_commitment,outcome,envelope_match:match,stored_operation_row:storedRaw||null,slot_incumbent:slotRaw||null,history_count:stored?.historyCount||0};
 }
 for(let i=0;i<req.claims.length;i++)await claimAt(i);
 for(const q of req.requested_lease_ids)if(!hasDevice(q.source_device_id)||req.mode==='CURRENT_DEVICE'&&q.source_device_id!==e.actorDeviceId)fail('SCOPE_FORBIDDEN');
 const assertCurrent=async()=>{abort();await inventory.assertCurrent();abort();};await assertCurrent();
 return Object.freeze({profileVerified:true,complete:false,activated:false,
  async summary(){await assertCurrent();return {W:metadata.seq,account_epoch:registry.account_epoch,history_origin:registry.history_origin};},
  async claims(visitor){for(let i=0;i<req.claims.length;i++){const result=await claimAt(i),id=result.op_id,count=result.history_count;await visitor(result,async visitHistory=>{for(let n=1;n<=count;n++)await visitHistory(await raw('history',pair(id,n)));await assertCurrent();});}await assertCurrent();},
  async leases(visitor){for(const q of req.requested_lease_ids)await visitor({...q,issued_row:await raw('issuedLeases',pair(q.source_device_id,q.lease_id))||null});await assertCurrent();},
  assertCurrent,
 });
}
