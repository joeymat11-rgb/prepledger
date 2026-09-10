'use strict';
const C=require('./codec.cjs');
const COLLECTIONS=Object.freeze(['metadata','operations','slots','history','ownership','log','lastAccepted','revocations','transactions','undo','suspensions','issuances','instances','applies','accountRegistry','deviceIssuance','issuedLeases','issuanceIntents','enrollmentIntents','standingEvents']);
const STATUSES=new Set(['ACCEPTED','WAITING','REJECTED','REJECTED_DEPENDENCY']);
const EVENTS=Object.freeze(['PROFILE_GENESIS','DEVICE_ENROLLED','LEASE_RENEWED','DEVICE_REVOKED','ACCOUNT_CLOSED']);
const integrity=()=>C.fail('RETAINED_INTEGRITY',500);
const check=x=>{if(!x)integrity();};
const pair=(a,b)=>JSON.stringify([a,b]);
function rowDto(raw){return {collection:raw.collection,row_id:raw.row_id,value_b64:C.encode64(raw.value)};}
function readRow(dto){C.exact(dto,C.FIELDS.row,{ordered:true});if(!COLLECTIONS.includes(dto.collection)||!C.nonempty(dto.row_id))integrity();const raw=C.decode64(dto.value_b64);return C.parse(raw);}
function validateRetained(rawRows,athleteId){
  if(!Array.isArray(rawRows)||!C.nonempty(athleteId))integrity();
  const maps=new Map(COLLECTIONS.map(k=>[k,new Map()])),kept=[];
  for(const r of rawRows){if(r.athlete!==athleteId)continue;if(!COLLECTIONS.includes(r.collection))C.fail('PROFILE_UNSUPPORTED',409);check(C.nonempty(r.row_id)&&typeof r.value==='string');const m=maps.get(r.collection);check(!m.has(r.row_id));let v;try{v=C.parse(r.value);}catch(_){integrity();}check(C.object(v));const entry={raw:{athlete:r.athlete,collection:r.collection,row_id:r.row_id,value:r.value},value:v,dto:rowDto(r)};m.set(r.row_id,entry);kept.push(entry);}
  const table=k=>maps.get(k),get=(k,id)=>table(k).get(String(id)),val=(k,id)=>get(k,id)?.value;
  const metadata=val('metadata','state'),registry=val('accountRegistry','state');
  check(metadata&&C.safe(metadata.seq)&&C.object(metadata.devices)&&C.object(metadata.initialPlan));C.exact(metadata,['seq','devices','initialPlan'],{code:'RETAINED_INTEGRITY'});check(table('metadata').size===1&&table('accountRegistry').size===1);
  check(registry);C.exact(registry,['profile','account_epoch','state','history_origin'],{code:'RETAINED_INTEGRITY'});
  check(registry.profile===C.PROFILE&&C.safe(registry.account_epoch,1)&&['ACTIVE','CLOSED'].includes(registry.state));
  if(!['PROFILE_GENESIS','VERIFIED_IMPORT'].includes(registry.history_origin))C.fail('HISTORY_INCOMPLETE',409);
  const devices=Object.keys(metadata.devices).sort(C.compareText),issuedByDevice=new Map(devices.map(d=>[d,[]]));
  for(const [id,e] of table('issuedLeases')){
    const x=e.value;C.exact(x,['lease','lease_bytes_b64','issuer_profile','issue_ordinal','issuance_intent_digest','account_epoch','creation_epoch'],{code:'RETAINED_INTEGRITY'});
    const l=x.lease;check(C.object(l)&&C.nonempty(l.device_id)&&C.nonempty(l.lease_id)&&l.athlete_id===athleteId&&id===pair(l.device_id,l.lease_id)&&issuedByDevice.has(l.device_id));
    check(x.issuer_profile===C.PROFILE&&C.safe(x.issue_ordinal,1)&&C.safe(x.creation_epoch,1)&&C.safe(x.account_epoch,1)&&x.account_epoch<=registry.account_epoch&&C.digestValue(x.issuance_intent_digest));
    check(C.fullEqual(C.parse(C.decode64(x.lease_bytes_b64)),l));
    check(C.safe(l.schema_version,1)&&Array.isArray(l.range)&&l.range.length===2&&l.range.every(n=>C.safe(n,1))&&l.range[1]>=l.range[0]&&typeof l.signature==='string');
    check(typeof l.not_before==='string'&&typeof l.not_after==='string'&&Number.isFinite(Date.parse(l.not_before))&&Number.isFinite(Date.parse(l.not_after))&&Date.parse(l.not_after)>=Date.parse(l.not_before));
    issuedByDevice.get(l.device_id).push(e);
  }
  for(const device of devices){const list=issuedByDevice.get(device).sort((a,b)=>a.value.issue_ordinal-b.value.issue_ordinal),pointer=val('deviceIssuance',device);check(C.object(metadata.devices[device])&&pointer&&list.length>0);C.exact(metadata.devices[device],['lease'],{code:'RETAINED_INTEGRITY'});C.exact(pointer,['device_id','creation_epoch','current_lease_id','issue_ordinal'],{code:'RETAINED_INTEGRITY'});check(pointer.device_id===device&&C.safe(pointer.creation_epoch,1)&&pointer.issue_ordinal===list.length);
    for(let i=0;i<list.length;i++){const x=list[i].value;check(x.issue_ordinal===i+1&&x.creation_epoch===i+1);if(i){const p=list[i-1].value.lease;check(x.lease.range[0]===p.range[0]&&x.lease.range[1]>p.range[1]&&Date.parse(x.lease.not_after)>=Date.parse(p.not_after));}}
    const latest=list.at(-1).value;check(pointer.creation_epoch===latest.creation_epoch&&pointer.current_lease_id===latest.lease.lease_id&&C.fullEqual(metadata.devices[device].lease,latest.lease));
  }
  check(table('deviceIssuance').size===devices.length);
  for(const [id,e] of table('issuanceIntents')){let k;try{k=JSON.parse(id);}catch(_){integrity();}check(Array.isArray(k)&&k.length===2&&C.nonempty(k[0])&&C.nonempty(k[1]));const x=e.value;C.exact(x,['stable_request_digest','lease_id','result_creation_epoch'],{code:'RETAINED_INTEGRITY'});const l=val('issuedLeases',pair(k[0],x.lease_id));check(l&&l.creation_epoch===x.result_creation_epoch&&l.issuance_intent_digest===x.stable_request_digest);}
  for(const e of table('enrollmentIntents').values()){const x=e.value;C.exact(x,['stable_request_digest','device_id','lease_id'],{code:'RETAINED_INTEGRITY'});const l=val('issuedLeases',pair(x.device_id,x.lease_id));check(l&&l.issue_ordinal===1&&l.issuance_intent_digest===x.stable_request_digest);}
  for(const list of issuedByDevice.values())for(const e of list){const x=e.value;const found=x.issue_ordinal===1?[...table('enrollmentIntents').values()].some(i=>i.value.device_id===x.lease.device_id&&i.value.lease_id===x.lease.lease_id):[...table('issuanceIntents').entries()].some(([id,i])=>JSON.parse(id)[0]===x.lease.device_id&&i.value.lease_id===x.lease.lease_id);check(found);}
  const hist=new Set(),logs=new Set(),maximum=new Map();
  for(const [id,e] of table('operations')){const r=e.value,o=r.op,d=r.disposition;check(C.object(o)&&o.op_id===id&&C.nonempty(o.device_id)&&C.safe(o.device_seq,1)&&C.nonempty(o.canonical_content_commitment)&&r.commitment===o.canonical_content_commitment&&C.object(d)&&STATUSES.has(d.status)&&C.safe(r.historyCount,1));
    check(d.op_id===id&&d.device_id===o.device_id&&d.device_seq===o.device_seq&&d.canonical_content_commitment===r.commitment&&typeof d.authority_signature==='string');
    check(val('ownership',id)?.present===true);const slot=val('slots',pair(o.device_id,o.device_seq));check(slot&&C.nonempty(slot.op_id)&&table('operations').has(slot.op_id));
    for(let n=1;n<=r.historyCount;n++){const key=pair(id,n),h=val('history',key);check(h&&h.op_id===id&&h.device_id===o.device_id&&h.device_seq===o.device_seq&&h.canonical_content_commitment===r.commitment&&STATUSES.has(h.status)&&typeof h.authority_signature==='string');if(n<r.historyCount)check(h.status==='WAITING');else check(C.fullEqual(h,d));hist.add(key);}
    if(d.status==='ACCEPTED'){check(o.athlete_id===athleteId&&devices.includes(o.device_id)&&C.safe(d.athlete_log_seq,1));const log=val('log',d.athlete_log_seq);check(log&&log.seq===d.athlete_log_seq&&C.fullEqual(log.op,o)&&log.accepted_at===d.accepted_at&&!logs.has(log.seq)&&slot.op_id===id);logs.add(log.seq);maximum.set(o.device_id,Math.max(maximum.get(o.device_id)||0,o.device_seq));}
  }
  check(table('history').size===hist.size&&table('log').size===metadata.seq&&logs.size===metadata.seq);
  for(let n=1;n<=metadata.seq;n++)check(logs.has(n));
  for(const [id,e] of table('ownership'))check(e.value.present===true&&table('operations').has(id));
  for(const [id,e] of table('slots')){const o=val('operations',e.value.op_id)?.op;check(o&&id===pair(o.device_id,o.device_seq));}
  for(const device of devices){const last=val('lastAccepted',device);check((last?.seq||0)===(maximum.get(device)||0));if(last)check(C.safe(last.seq,1));const revoked=val('revocations',device);if(revoked)check(C.safe(revoked.barrier)&&revoked.declared_loss===true);}
  for(const [device] of table('lastAccepted'))check(devices.includes(device));for(const [device]of table('revocations'))check(devices.includes(device));
  for(const [id,e]of table('transactions')){const t=e.value,o=val('operations',t.op_id);check(o&&o.disposition.status==='ACCEPTED'&&t.txn_id===id&&t.seq===o.disposition.athlete_log_seq);}
  for(const e of table('operations').values()){const o=e.value.op;if(e.value.disposition.status==='ACCEPTED'&&['plan-mutation','conflict-selection'].includes(o.kind))check(val('transactions',o.requested_transaction_id)?.op_id===o.op_id);}
  for(const e of table('standingEvents').values()){const x=e.value;C.exact(x,['kind','athlete_id','device_id','account_epoch','creation_epoch','evidence'],{code:'RETAINED_INTEGRITY'});check(EVENTS.includes(x.kind)&&x.athlete_id===athleteId&&C.safe(x.account_epoch,1)&&x.account_epoch<=registry.account_epoch&&C.object(x.evidence));
    if(x.kind==='PROFILE_GENESIS')check(x.device_id===null&&x.creation_epoch===null&&x.evidence.history_origin==='PROFILE_GENESIS');
    else if(x.kind==='ACCOUNT_CLOSED')check(x.device_id===null&&x.creation_epoch===null&&x.evidence.state==='CLOSED');
    else{check(devices.includes(x.device_id)&&C.safe(x.creation_epoch,1));if(x.kind==='DEVICE_REVOKED')check(C.fullEqual(x.evidence,val('revocations',x.device_id)));else{const l=val('issuedLeases',pair(x.device_id,x.evidence.lease_id));check(l&&l.creation_epoch===x.creation_epoch&&(x.kind==='DEVICE_ENROLLED'?l.issue_ordinal===1:l.issue_ordinal>1));}}
  }
  check([...table('standingEvents').values()].some(e=>e.value.kind==='PROFILE_GENESIS')||registry.history_origin==='VERIFIED_IMPORT');
  for(const list of issuedByDevice.values())for(const e of list){const x=e.value;check([...table('standingEvents').values()].some(ev=>ev.value.kind===(x.issue_ordinal===1?'DEVICE_ENROLLED':'LEASE_RENEWED')&&ev.value.device_id===x.lease.device_id&&ev.value.creation_epoch===x.creation_epoch&&ev.value.evidence.lease_id===x.lease.lease_id));}
  for(const device of devices){if(val('revocations',device))check([...table('standingEvents').values()].some(e=>e.value.kind==='DEVICE_REVOKED'&&e.value.device_id===device));}
  if(registry.state==='CLOSED')check([...table('standingEvents').values()].some(e=>e.value.kind==='ACCOUNT_CLOSED'&&e.value.account_epoch===registry.account_epoch));
  kept.sort((a,b)=>C.compareText(a.raw.collection,b.raw.collection)||C.compareText(a.raw.row_id,b.raw.row_id));
  return {maps,get,val,metadata,registry,devices,issuedByDevice,retainedRows:kept.map(e=>e.dto)};
}
function scopeCheck(state,athleteId,actorDeviceId,mode){if(!state.devices.includes(actorDeviceId)||!['CURRENT_DEVICE','ACCOUNT_RECOVERY'].includes(mode))C.fail('SCOPE_FORBIDDEN',403);if(state.registry.state!=='ACTIVE'||state.val('revocations',actorDeviceId))C.fail('SCOPE_FORBIDDEN',403);}
function claimsAgainst(state,claims,athleteId,actorDeviceId,mode){const parsed=C.validateClaims(claims);return claims.map((claim,i)=>{const {op,raw}=parsed[i];if(op.athlete_id!==athleteId||!state.devices.includes(op.device_id)||mode==='CURRENT_DEVICE'&&op.device_id!==actorDeviceId)C.fail('SCOPE_FORBIDDEN',403);
    const stored=state.get('operations',op.op_id),slot=state.get('slots',pair(op.device_id,op.device_seq));let outcome='UNKNOWN_AT_SNAPSHOT',match=false,history=[];
    if(stored){const r=stored.value;history=Array.from({length:r.historyCount},(_,i)=>state.get('history',pair(op.op_id,i+1)).dto);if(r.commitment!==op.canonical_content_commitment)outcome='IDENTITY_CONFLICT';else if(!C.fullEqual(r.op,op))outcome='ENVELOPE_MISMATCH';else{match=true;outcome=r.disposition.status==='WAITING'?'KNOWN_WAITING':'KNOWN_TERMINAL';}}
    else if(slot&&slot.value.op_id!==op.op_id)outcome='IDENTITY_CONFLICT';
    return {claim_id:claim.claim_id,requested_envelope_digest:C.hash('operation',raw),source_device_id:op.device_id,device_seq:op.device_seq,op_id:op.op_id,commitment:op.canonical_content_commitment,outcome,envelope_match:match,stored_operation_row:stored?.dto||null,history_rows:history,slot_incumbent:slot?.dto||null};
  });}
function project({rawRows,athleteId,actorDeviceId,request,scopeDigest}){C.validateRequest(request);if(!C.digestValue(scopeDigest))C.fail();const s=validateRetained(rawRows,athleteId);scopeCheck(s,athleteId,actorDeviceId,request.mode);
  const lookup=request.requested_lease_ids.map(p=>{if(!s.devices.includes(p.source_device_id)||request.mode==='CURRENT_DEVICE'&&p.source_device_id!==actorDeviceId)C.fail('SCOPE_FORBIDDEN',403);return {source_device_id:p.source_device_id,lease_id:p.lease_id,issued_row:s.get('issuedLeases',pair(p.source_device_id,p.lease_id))?.dto||null};});
  const coverage={authority_facts:'retained-at-one-snapshot',accepted:'complete-1-through-W',retained_rows:'complete-profile-collections',issued_leases:s.registry.history_origin==='PROFILE_GENESIS'?'complete-from-profile-genesis':'verified-import',history_origin:s.registry.history_origin};
  const payload={profile:C.PROFILE,scope:{athlete_id:athleteId,actor_device_id:actorDeviceId,mode:request.mode,scope_digest:scopeDigest},coverage,claims:claimsAgainst(s,request.claims,athleteId,actorDeviceId,request.mode),accepted:{W:s.metadata.seq,rows:Array.from({length:s.metadata.seq},(_,i)=>s.get('log',String(i+1)).dto)},devices:s.devices.map(d=>({device_id:d,creation:s.get('deviceIssuance',d).dto,last_accepted:s.get('lastAccepted',d)?.dto||null,revocation:s.get('revocations',d)?.dto||null})),leases:{issued:s.retainedRows.filter(r=>r.collection==='issuedLeases'),lookups:lookup},standing:{account_epoch:s.registry.account_epoch,account_state:s.registry.state,events:s.retainedRows.filter(r=>r.collection==='standingEvents')},retained_rows:s.retainedRows};
  const payloadBytes=C.encode(payload);if(payloadBytes.length>C.LIMITS.payload)C.fail('RECONCILE_LIMIT',413);return {payload,payloadBytes,payloadDigest:C.hash('payload',payloadBytes),coverageDigest:C.hash('coverage',C.encode(coverage))};
}
function payloadState(payloadBytes,expectedScope){const p=C.parse(payloadBytes);C.exact(p,['profile','scope','coverage','claims','accepted','devices','leases','standing','retained_rows'],{ordered:true});C.exact(p.scope,['athlete_id','actor_device_id','mode','scope_digest'],{ordered:true});if(p.profile!==C.PROFILE||!C.object(expectedScope))C.fail();for(const k of ['athlete_id','actor_device_id','mode','scope_digest'])if(p.scope[k]!==expectedScope[k])C.fail('SCOPE_FORBIDDEN',403);if(!Array.isArray(p.retained_rows))integrity();const raw=p.retained_rows.map(r=>{readRow(r);return {athlete:p.scope.athlete_id,collection:r.collection,row_id:r.row_id,value:C.text(C.decode64(r.value_b64))};});const s=validateRetained(raw,p.scope.athlete_id);scopeCheck(s,p.scope.athlete_id,p.scope.actor_device_id,p.scope.mode);check(C.fullEqual(s.retainedRows,p.retained_rows));return {payload:p,state:s,rawRows:raw};}
function matchRetainedClaims(payloadBytes,localClaims,expectedScope){try{const {state:s}=payloadState(payloadBytes,expectedScope);return {ok:true,claims:claimsAgainst(s,localClaims,expectedScope.athlete_id,expectedScope.actor_device_id,expectedScope.mode)};}catch(e){return {ok:false,code:e.code||'RETAINED_INTEGRITY'};}}
module.exports={COLLECTIONS,EVENTS,STATUSES,rowDto,readRow,validateRetained,claimsAgainst,project,payloadState,matchRetainedClaims};
