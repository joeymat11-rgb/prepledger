'use strict';
// Browser-safe source representation. Neither a digest nor this semantic reader
// authenticates inventory; callers must first verify its COMPLETE signed cut.
const C = require('../reconciliation/codec.cjs');
const PROFILE = 'earned/source-import/v1', COLLECTION = 'sourceImports';
const LIMITS = Object.freeze({chunk:32768, material:16777216, request:262144});
const MATERIAL = ['source_json','candidate_json','local_json','checkpoint_json','engine_context_json'];
const MF = ['profile','source_id','material_bytes','material_digest','chunk_digests','component_digests','basis'];
const fail = (code='SOURCE_INVALID',status=400) => C.fail(code,status);
const check = (x,code,status) => {if(!x)fail(code,status);};
const hash = (kind,bytes) => C.hash(PROFILE+'/'+kind,bytes);
const id = (...parts) => JSON.stringify(parts);
const same = C.fullEqual;
function basis(value) {
  C.exact(value,['W','log_digest','selection_id']);
  check(C.safe(value.W)&&C.digestValue(value.log_digest)&&(value.selection_id===null||C.identifier(value.selection_id)));
  return value;
}
function frontier(get,W,selection=null) {
  check(C.safe(W),'SOURCE_INTEGRITY',500);
  const log=[];
  for(let seq=1;seq<=W;seq++){const row=get('log',String(seq));check(row&&row.seq===seq,'SOURCE_INTEGRITY',500);log.push(row);}
  return {W,log_digest:hash('accepted-prefix',C.encode(log)),selection_id:selection};
}
function manifest(value) {
  C.exact(value,MF);check(value.profile===PROFILE&&C.identifier(value.source_id));
  check(C.safe(value.material_bytes,1)&&value.material_bytes<=LIMITS.material&&C.digestValue(value.material_digest));
  check(Array.isArray(value.chunk_digests)&&value.chunk_digests.length===Math.ceil(value.material_bytes/LIMITS.chunk)&&
    value.chunk_digests.every(C.digestValue));C.exact(value.component_digests,MATERIAL);
  for(const k of MATERIAL)check(k==='local_json'&&value.component_digests[k]===null||C.digestValue(value.component_digests[k]));
  basis(value.basis);return value;
}
function material(bytes,m) {
  check(bytes.length===m.material_bytes&&hash('material',bytes)===m.material_digest,'SOURCE_MATERIAL_DIGEST');
  const value=C.parse(bytes,LIMITS.material);C.exact(value,MATERIAL);
  for(const k of MATERIAL){
    if(k==='local_json'&&value[k]===null){check(m.component_digests[k]===null);continue;}
    check(typeof value[k]==='string'&&C.object(C.parse(value[k],LIMITS.material)));
    check(hash(k,C.bytes(value[k]))===m.component_digests[k],'SOURCE_COMPONENT_DIGEST');
  }
  const checkpoint=C.parse(value.checkpoint_json,LIMITS.material);
  C.exact(checkpoint,['revision','token','generation']);
  check(C.safe(checkpoint.revision,1)&&typeof checkpoint.token==='string'&&checkpoint.token.length>0&&
    C.object(checkpoint.generation)&&C.object(checkpoint.generation.collections)&&C.object(checkpoint.generation.metadata));
  const f=checkpoint.generation.collections.sync?.frontier;
  check(f&&f.W===m.basis.W&&f.authorityW===m.basis.W,'SOURCE_CHECKPOINT_FRONTIER');
  return value;
}
function prepareMaterial(sourceId,value,expected) {
  const bytes=C.encode(value);check(bytes.length<=LIMITS.material,'SOURCE_LIMIT',413);
  const chunks=[];for(let offset=0;offset<bytes.length;offset+=LIMITS.chunk)chunks.push(bytes.slice(offset,offset+LIMITS.chunk));
  const m=manifest({profile:PROFILE,source_id:sourceId,material_bytes:bytes.length,material_digest:hash('material',bytes),
    chunk_digests:chunks.map(b=>hash('chunk',b)),component_digests:Object.fromEntries(MATERIAL.map(k=>
      [k,value[k]===null?null:hash(k,C.bytes(value[k]))])),basis:C.parse(C.encode(expected))});
  material(bytes,m);
  return {manifest:m,chunks:chunks.map(C.encode64)};
}
function assemble(m,getChunk) {
  const bytes=new Uint8Array(m.material_bytes);
  for(let i=0;i<m.chunk_digests.length;i++){
    const chunk=getChunk(i);check(chunk,'SOURCE_INCOMPLETE',409);
    C.exact(chunk,['profile','type','source_id','index','data_b64']);
    check(chunk.profile===PROFILE&&chunk.type==='chunk'&&chunk.source_id===m.source_id&&chunk.index===i);
    const data=C.decode64(chunk.data_b64,LIMITS.chunk);
    check(data.length===Math.min(LIMITS.chunk,m.material_bytes-i*LIMITS.chunk)&&hash('chunk',data)===m.chunk_digests[i],'SOURCE_CHUNK_DIGEST');
    bytes.set(data,i*LIMITS.chunk);
  }
  return material(bytes,m);
}
function intent(op,action,sourceId,digest,target=null) {
  check(C.object(op)&&op.schema_version===1&&op.kind==='fact'&&op.class==='event','SOURCE_INTENT');
  check(C.identifier(op.op_id)&&Array.isArray(op.causal_parents)&&op.causal_parents.every(C.identifier)&&
    (op.device_predecessor_op_id===null||C.identifier(op.device_predecessor_op_id)),'SOURCE_INTENT');
  const p=op.payload;C.exact(p,['type','interval','source_id','material_digest',...(action==='rollback'?['target_activation_id']:[])]);
  C.exact(p.interval,['start','end']);
  check(p.type===(action==='activate'?'source-import-intent':'source-rollback-intent')&&p.source_id===sourceId&&
    p.material_digest===digest&&typeof p.interval.start==='string'&&typeof p.interval.end==='string'&&
    (action!=='rollback'||p.target_activation_id===target),'SOURCE_INTENT');
}
function decodeRequest(raw) {
  const r=C.parse(raw,LIMITS.request);check(C.object(r)&&r.profile===PROFILE&&C.identifier(r.device_id));
  const fields={manifest:['manifest'],chunk:['source_id','index','data_b64'],activate:['source_id','expected','operation'],
    rollback:['target_activation_id','expected','operation']};
  check(Object.hasOwn(fields,r.action));C.exact(r,['profile','device_id','action',...fields[r.action]]);
  if(r.action==='manifest')manifest(r.manifest);
  if(['chunk','activate'].includes(r.action))check(C.identifier(r.source_id));
  if(r.action==='chunk'){check(C.safe(r.index)&&r.index<512);C.decode64(r.data_b64,LIMITS.chunk);}
  if(['activate','rollback'].includes(r.action)){basis(r.expected);check(C.object(r.operation));}
  if(r.action==='rollback')check(C.identifier(r.target_activation_id));
  return r;
}
// All source records are immutable. Selection order is the actual accepted
// sequence; a local row order or timestamp can never select the current source.
function validateSourceRows(sourceRows,get,W) {
  const rows=new Map(),manifests=new Map(),selections=[];
  for(const [key,v]of sourceRows){
    check(!rows.has(key)&&C.object(v)&&v.profile===PROFILE,'SOURCE_INTEGRITY',500);rows.set(key,v);
    if(v.type==='manifest'){
      C.exact(v,['profile','type','device_id','manifest']);manifest(v.manifest);
      check(key===id('manifest',v.manifest.source_id)&&C.identifier(v.device_id)&&get('deviceIssuance',v.device_id),'SOURCE_INTEGRITY',500);
      check(!manifests.has(v.manifest.source_id),'SOURCE_INTEGRITY',500);manifests.set(v.manifest.source_id,v);
    }else if(v.type==='selection')selections.push(v);
    else check(v.type==='chunk','SOURCE_INTEGRITY',500);
  }
  for(const [key,v]of rows)if(v.type==='chunk'){
    C.exact(v,['profile','type','source_id','index','data_b64']);
    const m=manifests.get(v.source_id)?.manifest;
    check(m&&C.safe(v.index)&&v.index<m.chunk_digests.length&&key===id('chunk',v.source_id,v.index),'SOURCE_INTEGRITY',500);
    const b=C.decode64(v.data_b64,LIMITS.chunk);
    check(b.length===Math.min(LIMITS.chunk,m.material_bytes-v.index*LIMITS.chunk)&&hash('chunk',b)===m.chunk_digests[v.index],'SOURCE_CHUNK_DIGEST');
  }
  selections.sort((a,b)=>a.seq-b.seq);
  let previous=null,lastSeq=0;
  for(const s of selections){
    C.exact(s,['profile','type','action','source_id','target_activation_id','intent_op_id','commitment','seq','before','after',
      'request_digest','material_digest']);
    check(['activate','rollback'].includes(s.action)&&C.identifier(s.intent_op_id)&&C.safe(s.seq,1)&&s.seq>lastSeq&&
      rows.get(id('selection',s.intent_op_id))===s&&C.digestValue(s.request_digest),'SOURCE_INTEGRITY',500);
    const m=manifests.get(s.source_id)?.manifest,op=get('operations',s.intent_op_id),log=get('log',String(s.seq));
    check(m&&s.material_digest===m.material_digest&&op?.disposition.status==='ACCEPTED'&&op.disposition.athlete_log_seq===s.seq&&
      op.commitment===s.commitment&&log&&same(log.op,op.op),'SOURCE_INTEGRITY',500);
    intent(op.op,s.action,s.source_id,s.material_digest,s.target_activation_id);
    basis(s.before);basis(s.after);
    check(s.before.selection_id===previous&&s.before.W===s.seq-1&&s.after.W>=s.seq&&s.after.W<=W&&
      same(s.before,frontier(get,s.before.W,previous))&&same(s.after,frontier(get,s.after.W,s.intent_op_id)),'SOURCE_FRONTIER',500);
    if(s.action==='activate'){
      check(s.target_activation_id===null&&same(m.basis,s.before)&&op.op.device_id===manifests.get(s.source_id).device_id,'SOURCE_INTEGRITY',500);
    }else{
      const target=rows.get(id('selection',s.target_activation_id));
      check(target?.action==='activate'&&target.seq<s.seq&&target.source_id===s.source_id,'SOURCE_INTEGRITY',500);
    }
    assemble(m,i=>rows.get(id('chunk',s.source_id,i)));
    previous=s.intent_op_id;lastSeq=s.seq;
  }
  return {rows,manifests,selections,current:selections.at(-1)||null,frontier:frontier(get,W,previous),
    readMaterial(sourceId){const m=manifests.get(sourceId)?.manifest;check(m,'SOURCE_UNKNOWN',409);
      return assemble(m,i=>rows.get(id('chunk',sourceId,i)));}};
}
module.exports={PROFILE,COLLECTION,LIMITS,MATERIAL,hash,id,basis,frontier,manifest,material,prepareMaterial,assemble,intent,decodeRequest,validateSourceRows};
