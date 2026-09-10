'use strict';
// Row-inventory transport only. A verified chunk is NOT a complete R1 profile,
// current write permission, recovered key, frontier advance or activation.
const C=require('./codec.cjs');
const {COLLECTIONS:BASE_COLLECTIONS}=require('./project.cjs');
const {createPublicVerifier,decodeSignature}=require('../public-client.cjs');
// Closed version selection. Default v3 bytes, domains and 20-count inventory
// remain exact; source-enabled v4 cannot be consumed as an old proof.
function createPagedCodec(version=3) {
if(version!==3&&version!==4)throw new TypeError('Unsupported row inventory');
const COLLECTIONS=version===3?BASE_COLLECTIONS:Object.freeze([...BASE_COLLECTIONS,'sourceImports']);
const LIMITS=Object.freeze({row:2000000,rows:32,budget:262144,metadata:8192,begin:1048576,request:4000000,response:6000000});
const domain=kind=>'earned/r1/rows-v'+version+'/'+kind;
const DOMAINS=Object.freeze(Object.fromEntries(['begin','continue','manifest','cursor','page','finish'].map(k=>[k,domain(k)])));
const FIELDS=Object.freeze({
 manifest:['profile','key_epoch','scope_digest','nonce','context_id','request_digest','basis_digest','claim_set_digest','mode','revision','storage_control_digest','snapshot_id','collection_counts','chain_seed'],
 cursor:['profile','key_epoch','manifest_digest','index','last_key','cumulative_counts','chain_digest'],
 page:['profile','key_epoch','manifest_digest','index','previous_cursor_digest','rows_digest','chain_digest','cumulative_counts','next_cursor_digest','rows','next_cursor'],
 finish:['profile','key_epoch','manifest_digest','final_cursor_digest','chain_digest','cumulative_counts','revision','storage_control_digest','context_id','scope_digest','nonce','claim_set_digest']
});
for(const fields of Object.values(FIELDS))Object.freeze(fields);
const fail=code=>C.fail(code||'INVALID_ROWS_PROOF',400);
const check=(value,code)=>{if(!value)fail(code);};
const hash=(kind,value)=>C.hash(domain(kind),C.encode(value));
const same=(a,b)=>C.fullEqual(a,b);
function freeze(value){const stack=[value];while(stack.length){const x=stack.pop();if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))if(v&&typeof v==='object')stack.push(v);Object.freeze(x);}}return value;}
function snapshot(input,limit){return C.parse(input,limit);}
// Private freshly decoded bytes: validate with the SAME fatal native UTF-8
// decoder, but discard bounded text chunks instead of allocating a complete
// decoded string (and defensive byte copy) solely for a validity check.
function utf8(bytes){
 if(bytes.length>=3&&bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf)C.fail();
 try{const decoder=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true});
  for(let offset=0;offset<bytes.length;offset+=8192)decoder.decode(bytes.subarray(offset,offset+8192),{stream:true});
  decoder.decode();
 }catch(_){C.fail();}
}
function key(value){
 if(value===null)return null;C.exact(value,['collection','row_id_b64'],{ordered:true});check(COLLECTIONS.includes(value.collection));
 const bytes=C.decode64(value.row_id_b64,LIMITS.row);check(bytes.length>0);utf8(bytes);return bytes;
}
function compareKey(a,b){if(a.collection!==b.collection)return C.compareText(a.collection,b.collection);const x=C.decode64(a.row_id_b64,LIMITS.row),y=C.decode64(b.row_id_b64,LIMITS.row);for(let i=0;i<Math.min(x.length,y.length);i++)if(x[i]!==y[i])return x[i]-y[i];return x.length-y.length;}
function counts(value){check(Array.isArray(value)&&value.length===COLLECTIONS.length&&value.every(n=>C.safe(n)),'ROWS_COUNTS');}
function common(record,kind,signed){
 C.exact(record,[...FIELDS[kind],...(signed?['authority_signature']:[])],{ordered:true});
 check(record.profile===DOMAINS[kind]&&typeof record.key_epoch==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(record.key_epoch),'ROWS_PROFILE');
 if(signed){const decoded=decodeSignature(record.authority_signature);check(decoded&&decoded.kid===record.key_epoch,'ROWS_SIGNATURE');}
 for(const [name,value]of Object.entries(record))if(name.endsWith('_digest')||['nonce','context_id','snapshot_id','chain_seed'].includes(name))check(C.digestValue(value),'ROWS_DIGEST');
 if(Object.hasOwn(record,'revision'))check(C.safe(record.revision)&&record.revision<Number.MAX_SAFE_INTEGER,'ROWS_REVISION');
 if(Object.hasOwn(record,'index'))check(C.safe(record.index,1),'ROWS_INDEX');
 if(Object.hasOwn(record,'cumulative_counts'))counts(record.cumulative_counts);
}
function manifest(record,signed=true){
 common(record,'manifest',signed);check(['CURRENT_DEVICE','ACCOUNT_RECOVERY'].includes(record.mode),'ROWS_MODE');
 check(Array.isArray(record.collection_counts)&&record.collection_counts.length===COLLECTIONS.length,'ROWS_COUNTS');
 record.collection_counts.forEach((pair,i)=>check(Array.isArray(pair)&&pair.length===2&&pair[0]===COLLECTIONS[i]&&C.safe(pair[1]),'ROWS_COLLECTION_ORDER'));
 check(C.encode(record).length<=LIMITS.metadata,'ROWS_METADATA');return record;
}
function cursor(record,signed=true){common(record,'cursor',signed);key(record.last_key);check((record.last_key===null)===record.cumulative_counts.every(n=>n===0),'ROWS_CURSOR_KEY');return record;}
const cursorReference=record=>hash('cursor-reference',Object.fromEntries(FIELDS.cursor.map(k=>[k,record[k]])));
const manifestDigest=record=>hash('manifest-bytes',record);
function rows(value){
 check(Array.isArray(value)&&value.length<=LIMITS.rows,'ROWS_BATCH_SIZE');let bytes=0,prior=null;
 for(const row of value){C.exact(row,['collection','row_id_b64','value_b64'],{ordered:true});const k={collection:row.collection,row_id_b64:row.row_id_b64};
   bytes+=key(k).length;const raw=C.decode64(row.value_b64,LIMITS.row);utf8(raw);bytes+=raw.length;
   check(!prior||compareKey(prior,k)<0,'ROWS_ORDER');prior=k;
 }
 check(bytes<=(value.length>1?LIMITS.budget:LIMITS.row),'ROWS_BATCH_SIZE');return value;
}
function page(record,signed=true){
 common(record,'page',signed);rows(record.rows);cursor(record.next_cursor);
 check(record.rows_digest===hash('batch',record.rows),'ROWS_BATCH_DIGEST');
 check(record.next_cursor_digest===cursorReference(record.next_cursor),'ROWS_CURSOR_REFERENCE');
 const next=record.next_cursor;
 check(next.manifest_digest===record.manifest_digest&&next.index===record.index&&next.chain_digest===record.chain_digest&&same(next.cumulative_counts,record.cumulative_counts),'ROWS_CURSOR_BINDING');
 if(record.rows.length){const last=record.rows.at(-1);check(same(next.last_key,{collection:last.collection,row_id_b64:last.row_id_b64}),'ROWS_CURSOR_KEY');}
 return record;
}
function finish(record,signed=true){common(record,'finish',signed);check(C.encode(record).length<=LIMITS.metadata,'ROWS_METADATA');return record;}
function parseManifest(input){return freeze(manifest(snapshot(input,LIMITS.metadata)));}
function parseCursor(input){return freeze(cursor(snapshot(input,LIMITS.request)));}
function parseResponse(input){
 return response(snapshot(input,LIMITS.response));
}
function response(result){
 const terminal=Object.hasOwn(result||{},'finish');
 C.exact(result,['manifest','page',...(terminal?['finish']:[])],{ordered:true});manifest(result.manifest);page(result.page);
 const m=result.manifest,p=result.page,md=manifestDigest(m);check(p.manifest_digest===md,'ROWS_MANIFEST_BINDING');
 p.cumulative_counts.forEach((n,i)=>check(n<=m.collection_counts[i][1],'ROWS_COUNTS'));
 check(terminal===(p.rows.length===0),'ROWS_FINISH_REQUIRED');
 if(terminal){const f=finish(result.finish);check(f.manifest_digest===md&&f.final_cursor_digest===cursorReference(p.next_cursor)&&f.chain_digest===p.chain_digest&&same(f.cumulative_counts,p.cumulative_counts),'ROWS_FINISH_BINDING');
   check(same(f.cumulative_counts,m.collection_counts.map(([,n])=>n)),'ROWS_INVENTORY_INCOMPLETE');
   for(const k of ['revision','storage_control_digest','context_id','scope_digest','nonce','claim_set_digest'])check(f[k]===m[k],'ROWS_FINISH_BINDING');
 }
 return freeze(result);
}
// The bridge owns this closed, JSON-only result graph. Preserve JSON's distinct
// object/array occurrences without copying its potentially large immutable
// base64 strings through UTF-8 -> JSON text -> parsed strings a second time.
// Network/caller bytes MUST still enter through parseResponse, including its
// duplicate-key and UTF-8 checks. This function is only a server assembly seam.
function finishOwnedResponse(input){
 const out={},todo=[[input,out,false]],ancestors=new WeakSet();
 while(todo.length){const [source,target,exit]=todo.pop();
  if(exit){ancestors.delete(source);continue;}
  check(source&&typeof source==='object'&&!ancestors.has(source),'ROWS_OWNED_VALUE');
  check(Object.getPrototypeOf(source)===(Array.isArray(source)?Array.prototype:Object.prototype),'ROWS_OWNED_VALUE');
  if(Array.isArray(source))check(Object.keys(source).length===source.length&&Array.from({length:source.length},(_,i)=>Object.hasOwn(source,i)).every(Boolean),'ROWS_OWNED_VALUE');
  ancestors.add(source);todo.push([source,target,true]);
  for(const name of Object.keys(source)){
   const descriptor=Object.getOwnPropertyDescriptor(source,name);check(Object.hasOwn(descriptor,'value'),'ROWS_OWNED_VALUE');const value=descriptor.value;
   if(value&&typeof value==='object'){
    const child=Array.isArray(value)?[]:{};Object.defineProperty(target,name,{value:child,enumerable:true,writable:true,configurable:true});todo.push([value,child,false]);
   }else{check(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value),'ROWS_OWNED_VALUE');Object.defineProperty(target,name,{value,enumerable:true,writable:true,configurable:true});}
  }
 }
 if(C.encode(out).length>LIMITS.response)C.fail('RECONCILE_LIMIT',413);
 return response(out);
}
function decodeRequest(input){
 const raw=C.bytes(input);check(raw.length<=LIMITS.request,'ROWS_REQUEST_LIMIT');const value=C.parse(raw,LIMITS.request);
 if(value?.profile===DOMAINS.begin){check(raw.length<=LIMITS.begin,'ROWS_REQUEST_LIMIT');C.exact(value,['profile','device_id','request','basis_digest']);check(C.nonempty(value.device_id)&&C.digestValue(value.basis_digest));C.validateRequest(value.request);}
 else{C.exact(value,['profile','device_id','manifest','cursor']);check(value.profile===DOMAINS.continue,'ROWS_PROFILE');check(C.nonempty(value.device_id)&&C.encode(value.device_id).length<=LIMITS.begin,'ROWS_ACTOR');manifest(value.manifest);cursor(value.cursor);check(value.cursor.manifest_digest===manifestDigest(value.manifest),'ROWS_MANIFEST_BINDING');}
 return freeze(value);
}
function makeManifest({keyEpoch,scopeDigest,request,basisDigest,revision,storageControlDigest,snapshotId,collectionCounts,chainSeed}){
 const req=C.decodeRequest(C.encode(request));
 const m={profile:DOMAINS.manifest,key_epoch:keyEpoch,scope_digest:scopeDigest,nonce:req.nonce,context_id:req.context_id,
  request_digest:C.hash('request',C.encode(req)),basis_digest:basisDigest,claim_set_digest:hash('claims',req.claims),mode:req.mode,revision,
  storage_control_digest:storageControlDigest,snapshot_id:snapshotId,collection_counts:collectionCounts,chain_seed:chainSeed};
 return freeze(manifest(snapshot(C.encode(m),LIMITS.metadata),false));
}
function makePage({manifest:input,previousCursor=null,rawRows,sign}){
 const m=parseManifest(C.encode(input)),previous=previousCursor===null?null:parseCursor(C.encode(previousCursor));
 if(previous)check(previous.manifest_digest===manifestDigest(m),'ROWS_MANIFEST_BINDING');
 const data=rawRows.map(row=>({collection:row.collection,row_id_b64:C.encode64(row.row_id),value_b64:C.encode64(row.value)}));rows(data);
 const cumulative=previous?previous.cumulative_counts.slice():COLLECTIONS.map(()=>0),index=previous?previous.index+1:1;
 check(C.safe(index,1),'ROWS_INDEX');if(previous?.last_key&&data.length)check(compareKey(previous.last_key,data[0])<0,'ROWS_ORDER');
 for(const row of data){const i=COLLECTIONS.indexOf(row.collection);cumulative[i]++;check(C.safe(cumulative[i])&&cumulative[i]<=m.collection_counts[i][1],'ROWS_COUNTS');}
 const md=manifestDigest(m),rd=hash('batch',data),chain=hash('chain',[previous?previous.chain_digest:m.chain_seed,md,index,rd,cumulative]);
 const last=data.at(-1),lastKey=last?{collection:last.collection,row_id_b64:last.row_id_b64}:previous?.last_key??null;
 const next=sign({profile:DOMAINS.cursor,key_epoch:m.key_epoch,manifest_digest:md,index,last_key:lastKey,cumulative_counts:cumulative,chain_digest:chain});cursor(next);
 const p=sign({profile:DOMAINS.page,key_epoch:m.key_epoch,manifest_digest:md,index,previous_cursor_digest:previous?cursorReference(previous):hash('cursor-seed',md),
  rows_digest:rd,chain_digest:chain,cumulative_counts:cumulative,next_cursor_digest:cursorReference(next),rows:data,next_cursor:next});page(p);
 return freeze(p);
}
function makeFinish({manifest:input,page:pageInput,sign}){
 const m=parseManifest(C.encode(input)),p=page(snapshot(C.encode(pageInput),LIMITS.response));check(p.rows.length===0,'ROWS_FINISH_REQUIRED');
 const f=sign({profile:DOMAINS.finish,key_epoch:m.key_epoch,manifest_digest:manifestDigest(m),final_cursor_digest:cursorReference(p.next_cursor),chain_digest:p.chain_digest,
  cumulative_counts:p.cumulative_counts,revision:m.revision,storage_control_digest:m.storage_control_digest,context_id:m.context_id,scope_digest:m.scope_digest,nonce:m.nonce,claim_set_digest:m.claim_set_digest});
 return parseResponse(C.encode({manifest:m,page:p,finish:f})).finish;
}
function createRowsVerifier({keys,subtle}={}){
 const verifier=createPublicVerifier({keys,subtle});
 return Object.freeze({async verify(input,{expected,previousCursor=null}={}){
  try{
   const e=snapshot(C.encode(expected),LIMITS.metadata),result=parseResponse(input),m=result.manifest,p=result.page;
   C.exact(e,['scopeDigest','nonce','contextId','requestDigest','basisDigest','claimSetDigest','mode']);
   for(const [field,wanted]of [['scope_digest',e.scopeDigest],['nonce',e.nonce],['context_id',e.contextId],['request_digest',e.requestDigest],['basis_digest',e.basisDigest],['claim_set_digest',e.claimSetDigest],['mode',e.mode]])check(m[field]===wanted,'ROWS_EXPECTED_CONTEXT');
   const previous=previousCursor===null?null:parseCursor(C.encode(previousCursor));
   for(const record of [m,p,p.next_cursor,...(result.finish?[result.finish]:[]),...(previous?[previous]:[])])check(await verifier.verifyRecord(record,record.profile),'ROWS_SIGNATURE');
   const md=manifestDigest(m);if(previous)check(previous.manifest_digest===md,'ROWS_MANIFEST_BINDING');
   const count=previous?previous.cumulative_counts.slice():COLLECTIONS.map(()=>0),index=previous?previous.index+1:1;
   check(p.index===index&&C.safe(index,1),'ROWS_INDEX');
   check(p.previous_cursor_digest===(previous?cursorReference(previous):hash('cursor-seed',md)),'ROWS_CURSOR_REFERENCE');
   if(previous?.last_key&&p.rows.length)check(compareKey(previous.last_key,p.rows[0])<0,'ROWS_ORDER');
   for(const row of p.rows){const i=COLLECTIONS.indexOf(row.collection);count[i]++;check(C.safe(count[i]),'ROWS_COUNTS');}
   check(same(p.cumulative_counts,count),'ROWS_COUNTS');
   check(p.chain_digest===hash('chain',[previous?previous.chain_digest:m.chain_seed,md,p.index,p.rows_digest,count]),'ROWS_CHAIN');
   if(!p.rows.length)check(same(p.next_cursor.last_key,previous?.last_key??null),'ROWS_CURSOR_KEY');
   return {verified:true,kind:'rows-v'+version+'-inventory-chunk',terminal:Boolean(result.finish),value:result};
  }catch(error){return {verified:false,code:error.code||'INVALID_ROWS_PROOF'};}
 }});
}
return Object.freeze({LIMITS,DOMAINS,FIELDS,COLLECTIONS,hash,cursorReference,manifestDigest,parseManifest,parseCursor,parseResponse,finishOwnedResponse,decodeRequest,
 makeManifest,makePage,makeFinish,createRowsVerifier});
}
module.exports={...createPagedCodec(),createSourceRowsCodec:()=>createPagedCodec(4)};
