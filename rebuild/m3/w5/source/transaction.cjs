'use strict';
// Called only inside bridge's private staged snapshot. The bridge publishes ALL
// resulting rows, including admission's WAITING drain, behind its existing CAS.
const C=require('../reconciliation/codec.cjs'),S=require('./codec.cjs'),I=require('../reconciliation/issuer.cjs');
const {rowKey}=require('../../../authority/store.cjs');
const {validateRetained}=require('../reconciliation/project.cjs');
const fail=(code,status=409)=>C.fail(code,status);
function transact({backend,authority,athlete,actor,request,rawRows}) {
  const get=(table,key)=>backend.get(rowKey(athlete,table,key));
  const all=rawRows().filter(r=>r.athlete===athlete);
  validateRetained(all.filter(r=>r.collection!==S.COLLECTION),athlete);
  const state=S.validateSourceRows(all.filter(r=>r.collection===S.COLLECTION).map(r=>[r.row_id,C.parse(r.value)]),
    get,get('metadata','state').seq);
  const put=(key,row)=>I.transaction(backend,()=>I.put(backend,athlete,S.COLLECTION,key,row));
  const r=request;
  if(r.action==='manifest'){
    const key=S.id('manifest',r.manifest.source_id),prior=get(S.COLLECTION,key);
    const row={profile:S.PROFILE,type:'manifest',device_id:actor,manifest:r.manifest};
    if(prior){if(!C.fullEqual(prior,row))fail('SOURCE_ID_CONFLICT');}
    else {if(!C.fullEqual(r.manifest.basis,state.frontier))fail('SOURCE_STALE_BASIS');put(key,row);}
    return {status:'STAGED',source_id:r.manifest.source_id,activation:'pending'};
  }
  if(r.action==='chunk'){
    const held=state.manifests.get(r.source_id);if(!held)fail('SOURCE_UNKNOWN');
    if(held.device_id!==actor)fail('SCOPE_FORBIDDEN',403);
    const m=held.manifest,data=C.decode64(r.data_b64,S.LIMITS.chunk);
    if(r.index>=m.chunk_digests.length||data.length!==Math.min(S.LIMITS.chunk,m.material_bytes-r.index*S.LIMITS.chunk)||
      S.hash('chunk',data)!==m.chunk_digests[r.index])fail('SOURCE_CHUNK_DIGEST',400);
    const key=S.id('chunk',r.source_id,r.index),row={profile:S.PROFILE,type:'chunk',source_id:r.source_id,index:r.index,data_b64:r.data_b64};
    const prior=get(S.COLLECTION,key);if(prior){if(!C.fullEqual(prior,row))fail('SOURCE_ID_CONFLICT');}else put(key,row);
    return {status:'STAGED',source_id:r.source_id,index:r.index,activation:'pending'};
  }
  const op=r.operation;
  if(op.athlete_id!==athlete||op.device_id!==actor)fail('SCOPE_FORBIDDEN',403);
  const digest=S.hash('request',C.encode(r)),key=S.id('selection',op.op_id),prior=get(S.COLLECTION,key);
  if(prior){if(prior.request_digest!==digest)fail('SOURCE_INTENT_CONFLICT');return {status:'BOUND',binding:prior};}
  // A prior generic /op acceptance or WAITING record is never retroactively
  // promoted. The durable binding must have accompanied the ORIGINAL admission.
  if(get('operations',op.op_id))fail('SOURCE_INTENT_ALREADY_RECORDED');
  if(!C.fullEqual(r.expected,state.frontier))fail('SOURCE_STALE_BASIS');
  const target=r.action==='rollback'?get(S.COLLECTION,S.id('selection',r.target_activation_id)):null;
  if(r.action==='rollback'&&target?.action!=='activate')fail('SOURCE_ROLLBACK_TARGET');
  const sourceId=r.action==='activate'?r.source_id:target.source_id,held=state.manifests.get(sourceId);
  if(!held)fail('SOURCE_UNKNOWN');
  if(r.action==='activate'&&(held.device_id!==actor||!C.fullEqual(held.manifest.basis,r.expected)))fail('SOURCE_STALE_BASIS');
  const m=held.manifest;state.readMaterial(sourceId);
  S.intent(op,r.action,sourceId,m.material_digest,r.action==='rollback'?r.target_activation_id:null);
  const dependencies=[...op.causal_parents,...(op.device_predecessor_op_id===null?[]:[op.device_predecessor_op_id])];
  if(dependencies.some(id=>get('operations',id)?.disposition.status!=='ACCEPTED'))fail('SOURCE_DEPENDENCIES_PENDING');
  const disposition=authority.admit(athlete,op);
  if(disposition?.status==='UNAVAILABLE')return disposition;
  if(disposition?.status!=='ACCEPTED')fail('SOURCE_ADMISSION_REFUSED');
  const retained=get('operations',op.op_id);
  if(!retained||!C.fullEqual(retained.op,op)||retained.disposition.status!=='ACCEPTED'||
    retained.disposition.athlete_log_seq!==r.expected.W+1)fail('SOURCE_ADMISSION_INTEGRITY',500);
  const binding={profile:S.PROFILE,type:'selection',action:r.action,source_id:sourceId,
    target_activation_id:r.action==='rollback'?r.target_activation_id:null,intent_op_id:op.op_id,
    commitment:op.canonical_content_commitment,seq:retained.disposition.athlete_log_seq,before:r.expected,
    after:S.frontier(get,get('metadata','state').seq,op.op_id),request_digest:digest,material_digest:m.material_digest};
  put(key,binding);
  return {status:'BOUND',binding};
}
module.exports={transact};
