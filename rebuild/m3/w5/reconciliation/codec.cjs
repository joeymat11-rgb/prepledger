'use strict';
// Synchronous SHA-256 is the pinned standard primitive shared with W6. This
// module is browser-safe: no Node crypto, Buffer, filesystem or signing key.
const { sha256 } = require('@noble/hashes/sha2.js');
// LOWER-CAP proposal: version-distinct proof transport, pending independent
// acceptance. Account history and original operation/signature contracts stay v1.
const LIMITS = Object.freeze({ request: 1048576, payload: 1048576, page: 32768, pages: 32 });
const PROFILE = 'earned/r1/v1';
const REQUEST_VERSION = 'earned/reconcile-request-1m/v1';
const DOMAINS = Object.freeze({ enrollment: 'earned/enrollment-result/v1', renewal: 'earned/lease-renewal-result/v1', replay: 'earned/recovery-replay-result/v1', manifest: 'earned/reconcile-manifest-1m/v1', page: 'earned/reconcile-page-1m/v1' });
const TAGS = Object.freeze({ request: 'earned/reconcile-request-bytes/v1', payload: 'earned/reconcile-payload-bytes/v1', page: 'earned/reconcile-page-bytes/v1', manifest: 'earned/reconcile-manifest-bytes/v1', coverage: 'earned/reconcile-coverage/v1', intent: 'earned/r1-intent-bytes/v1', result: 'earned/r1-result-bytes/v1', operation: 'earned/r1-operation-bytes/v1', scope: 'earned/reconcile-scope/v1' });
const FIELDS = Object.freeze({
  request: ['version','mode','nonce','context_id','claims','requested_lease_ids'],
  manifest: ['profile','key_epoch','scope_digest','nonce','context_id','request_digest','snapshot_id','payload_digest','payload_bytes','page_bytes','page_count','coverage_digest'],
  page: ['profile','key_epoch','manifest_digest','index','offset','bytes','page_digest','data_b64'],
  result: ['profile','key_epoch','scope_digest','nonce','intent_digest','payload_digest','payload_bytes','data_b64'],
  standing: ['account_epoch','account_state','actor_device_id','actor_revoked','creation_epoch','current_lease_id'],
  row: ['collection','row_id','value_b64'],
  claim: ['claim_id','requested_envelope_digest','source_device_id','device_seq','op_id','commitment','outcome','envelope_match','stored_operation_row','history_rows','slot_incumbent'],
});
class R1Error extends Error { constructor(code, status = 400, retryable = false) { super(code); this.name='R1Error'; this.code=code; this.status=status; this.retryable=retryable; } }
const fail = (code='INVALID_R1_REQUEST',status) => { throw new R1Error(code,status??({RETAINED_INTEGRITY:500,SCOPE_FORBIDDEN:403,HISTORY_INCOMPLETE:409,PROFILE_UNSUPPORTED:409,RECONCILE_LIMIT:413}[code]||400)); };
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x) && [Object.prototype,null].includes(Object.getPrototypeOf(x));
function bytes(value) { if (typeof value === 'string') return new TextEncoder().encode(value); if (value instanceof Uint8Array) return new Uint8Array(value); if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0)); fail(); }
function text(value) { try { const b=bytes(value); const s=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(b); if(s.charCodeAt(0)===0xfeff)fail(); return s; } catch (_) { fail(); } }
function encode(value) { const s=JSON.stringify(value); if (s===undefined) fail(); return bytes(s); }
function encode64(value) { const b=bytes(value);let out='';for(let i=0;i<b.length;i+=8192)out+=String.fromCharCode(...b.subarray(i,i+8192));return btoa(out).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function decode64(value,max=LIMITS.payload) { if(typeof value!=='string'||!/^[A-Za-z0-9_-]*$/.test(value)||value.length%4===1||Math.floor(value.length*3/4)>max)fail();try{const s=atob(value.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-value.length%4)%4));const b=new Uint8Array(s.length);for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i);if(b.length>max||encode64(b)!==value)fail();return b;}catch(_){fail();} }
const digest = (tag,value) => { const a=bytes(tag+'\0'),b=bytes(value);return encode64(sha256.create().update(a).update(b).digest()); };
const hash = (tag,value) => digest(TAGS[tag]||tag,value);
function sameBytes(a,b){a=bytes(a);b=bytes(b);return a.length===b.length&&a.every((v,i)=>v===b[i]);}
function compareText(a,b){const x=bytes(a),y=bytes(b);for(let i=0;i<Math.min(x.length,y.length);i++)if(x[i]!==y[i])return x[i]-y[i];return x.length-y.length;}
// Parse JSON grammar directly so duplicate DECODED keys cannot be erased by
// JSON.parse. Numeric value conversion remains ordinary JSON/JavaScript; safe
// control integers are checked separately, never imposed on old op payloads.
function parse(value,max=16777216){const b=bytes(value);if(b.length>max)fail('RECONCILE_LIMIT',413);const s=text(b),stack=[];let i=0;
  // Iterative duplicate-key scan, followed by the native JSON grammar/value
  // parser. No new nesting-depth restriction is imposed on old envelopes.
  while(i<s.length){const c=s[i];if(c==='"'){const start=i++;while(i<s.length){if(s[i]==='\\'){i+=2;continue;}if(s[i++]==='"')break;}const top=stack.at(-1);if(top?.object&&top.key){let token;try{token=JSON.parse(s.slice(start,i));}catch(_){fail();}if(top.keys.has(token))fail();top.keys.add(token);top.key=false;}}
    else{if(c==='{')stack.push({object:true,key:true,keys:new Set()});else if(c==='[')stack.push({object:false});else if(c==='}'||c===']')stack.pop();else if(c===','&&stack.at(-1)?.object)stack.at(-1).key=true;i++;}}
  try{return JSON.parse(s);}catch(_){fail();}
}
function exact(value,fields,{ordered=false,code='INVALID_R1_REQUEST'}={}){if(!object(value))fail(code);const keys=Object.keys(value);if(keys.length!==fields.length||fields.some(k=>!Object.hasOwn(value,k))||(ordered&&keys.some((k,i)=>k!==fields[i])))fail(code);return value;}
const safe = (x,min=0) => Number.isSafeInteger(x)&&!Object.is(x,-0)&&x>=min;
const identifier = x => typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(x);
const nonempty = x => typeof x==='string'&&x.length>0;
function digestValue(x){try{return decode64(x,32).length===32;}catch(_){return false;}}
function nonce(x){if(!digestValue(x))fail();return x;}
function operationFromClaim(claim){exact(claim,['claim_id','envelope_b64']);if(!identifier(claim.claim_id))fail();const raw=decode64(claim.envelope_b64,LIMITS.request),op=parse(raw,LIMITS.request);if(!object(op)||!['athlete_id','device_id','op_id','canonical_content_commitment','lease_id'].every(k=>nonempty(op[k]))||!safe(op.device_seq,1))fail();return {raw,op};}
function validateClaims(claims){if(!Array.isArray(claims))fail();const ids=new Set(),envelopes=new Set();return claims.map(c=>{const parsed=operationFromClaim(c);if(ids.has(c.claim_id)||envelopes.has(c.envelope_b64))fail();ids.add(c.claim_id);envelopes.add(c.envelope_b64);return parsed;});}
function validateRequest(r){exact(r,FIELDS.request);if(r.version!==REQUEST_VERSION||!['CURRENT_DEVICE','ACCOUNT_RECOVERY'].includes(r.mode))fail();nonce(r.nonce);nonce(r.context_id);validateClaims(r.claims);if(!Array.isArray(r.requested_lease_ids))fail();const pairs=new Set();for(const p of r.requested_lease_ids){exact(p,['source_device_id','lease_id']);if(!nonempty(p.source_device_id)||!nonempty(p.lease_id))fail();const key=JSON.stringify([p.source_device_id,p.lease_id]);if(pairs.has(key))fail();pairs.add(key);}return r;}
function decodeRequest(raw){return validateRequest(parse(raw,LIMITS.request));}
function validateRouteRequest(route,r){const lists={ '/enrol/create':['intent_id','schema_version','nonce'], '/lease/renew':['device_id','intent_id','expected_creation_epoch','expected_lease_id','schema_version','nonce'], '/reconcile':['device_id','request_b64','continuation','page_index'], '/recovery/replay':['device_id','envelope_b64','nonce']};if(!lists[route])fail();exact(r,lists[route]);for(const k of ['device_id','intent_id','expected_lease_id'])if(Object.hasOwn(r,k)&&!identifier(r[k]))fail();if(Object.hasOwn(r,'nonce'))nonce(r.nonce);if(Object.hasOwn(r,'schema_version')&&r.schema_version!==1)fail();if(Object.hasOwn(r,'expected_creation_epoch')&&!safe(r.expected_creation_epoch,1))fail();if(route==='/reconcile'){decodeRequest(decode64(r.request_b64,LIMITS.request));if(!safe(r.page_index)||r.page_index>=LIMITS.pages||!(r.continuation===null&&r.page_index===0||typeof r.continuation==='string'&&r.page_index>=0))fail();if(r.continuation!==null)parse(decode64(r.continuation,LIMITS.request));}if(route==='/recovery/replay')operationFromClaim({claim_id:'replay',envelope_b64:r.envelope_b64});return r;}
function scopeDigest({issuer,subject,origin,athleteId,actorDeviceId}){const parts=[issuer,subject,origin,athleteId,actorDeviceId];if(!parts.every(nonempty))fail();const bs=parts.map(bytes),total=bs.reduce((n,b)=>n+b.length+4,0);if(bs.some(b=>b.length>0xffffffff))fail();const out=new Uint8Array(total),view=new DataView(out.buffer);let n=0;for(const b of bs){view.setUint32(n,b.length,false);n+=4;out.set(b,n);n+=b.length;}return hash('scope',out);}
function intentDigest(route,r){validateRouteRequest(route,r);if(route==='/recovery/replay')return hash('operation',decode64(r.envelope_b64,LIMITS.request));const f=route==='/enrol/create'?['intent_id','schema_version']:['device_id','intent_id','expected_creation_epoch','expected_lease_id','schema_version'];return hash('intent',encode(Object.fromEntries(f.map(k=>[k,r[k]]))));}
function makeManifest({keyEpoch,scopeDigest:sd,requestBytes,snapshotId,payloadBytes,coverage}){const r=decodeRequest(requestBytes),p=bytes(payloadBytes);if(!(/^[A-Za-z0-9_-]{1,64}$/.test(keyEpoch||''))||!digestValue(sd)||!digestValue(snapshotId)||p.length<1)fail();if(p.length>LIMITS.payload)fail('RECONCILE_LIMIT',413);return {profile:DOMAINS.manifest,key_epoch:keyEpoch,scope_digest:sd,nonce:r.nonce,context_id:r.context_id,request_digest:hash('request',requestBytes),snapshot_id:snapshotId,payload_digest:hash('payload',p),payload_bytes:p.length,page_bytes:LIMITS.page,page_count:Math.ceil(p.length/LIMITS.page),coverage_digest:hash('coverage',encode(coverage))};}
function makePage({keyEpoch,manifestBytes,payloadBytes,index}){const m=parse(manifestBytes,LIMITS.request),p=bytes(payloadBytes);if(!safe(index)||index>=m.page_count||p.length!==m.payload_bytes||hash('payload',p)!==m.payload_digest)fail();const offset=index*LIMITS.page,chunk=p.slice(offset,offset+LIMITS.page);return {profile:DOMAINS.page,key_epoch:keyEpoch,manifest_digest:hash('manifest',manifestBytes),index,offset,bytes:chunk.length,page_digest:hash('page',chunk),data_b64:encode64(chunk)};}
function makeResult({keyEpoch,profile,scopeDigest:sd,nonce:n,intentDigest:id,payload}){if(![DOMAINS.enrollment,DOMAINS.renewal,DOMAINS.replay].includes(profile)||!identifier(keyEpoch)||!digestValue(sd)||!digestValue(id))fail();nonce(n);const p=encode(payload);if(p.length>LIMITS.payload)fail('RECONCILE_LIMIT',413);return {profile,key_epoch:keyEpoch,scope_digest:sd,nonce:n,intent_digest:id,payload_digest:hash('result',p),payload_bytes:p.length,data_b64:encode64(p)};}
function fullEqual(a,b){if(Object.is(a,b))return true;if(typeof a==='number'&&typeof b==='number')return false;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>fullEqual(v,b[i]));if(object(a)&&object(b)){const ka=Object.keys(a),kb=Object.keys(b);return ka.length===kb.length&&ka.every(k=>Object.hasOwn(b,k)&&fullEqual(a[k],b[k]));}return false;}
module.exports={LIMITS,PROFILE,REQUEST_VERSION,DOMAINS,TAGS,FIELDS,R1Error,fail,object,bytes,text,encode,encode64,decode64,hash,sameBytes,compareText,parse,exact,safe,identifier,nonempty,digestValue,nonce,operationFromClaim,validateClaims,validateRequest,decodeRequest,validateRouteRequest,scopeDigest,intentDigest,makeManifest,makePage,makeResult,fullEqual};
