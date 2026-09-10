'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const P=require('../reconciliation/paged-codec.cjs'),C=require('../reconciliation/codec.cjs'),Sign=require('../crypto.cjs');
function fixture(value=' {"number":1.00,"text":"e\u0301"} '){
 const key=Sign.generateSigningKey('synthetic-owned-response'),sign=r=>({...r,authority_signature:Sign.signatureOver(r,key,r.profile)}),h=P.hash('synthetic','owned-response');
 const request={version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]};
 const manifest=sign(P.makeManifest({keyEpoch:key.kid,scopeDigest:h,request,basisDigest:h,revision:1,storageControlDigest:h,snapshotId:h,
  collectionCounts:P.COLLECTIONS.map(c=>[c,c==='history'?1:0]),chainSeed:h}));
 const page=P.makePage({manifest,rawRows:[{collection:'history',row_id:'e\u0301\u0000',value}],sign});
 const end=P.makePage({manifest,previousCursor:page.next_cursor,rawRows:[],sign});
 return {first:{manifest,page},last:{manifest,page:end,finish:P.makeFinish({manifest,page:end,sign})},
  verifier:P.createRowsVerifier({keys:[Sign.publicKeyOf(key)],subtle:webcrypto.subtle}),expected:{scopeDigest:h,nonce:h,contextId:h,
   requestDigest:C.hash('request',C.encode(request)),basisDigest:h,claimSetDigest:P.hash('claims',[]),mode:'CURRENT_DEVICE'}};
}
function equalGraph(a,b){
 const seenA=new Map(),seenB=new Map();let id=0;
 const walk=(x,y)=>{assert.equal(typeof x,typeof y);if(!x||typeof x!=='object'){assert.equal(x,y);return;}
  assert.equal(Object.getPrototypeOf(x),Object.getPrototypeOf(y));assert.equal(Object.isFrozen(x),Object.isFrozen(y));
  assert.equal(seenA.get(x),seenB.get(y),'OBJECT_OCCURRENCE_PARITY');if(seenA.has(x))return;
  seenA.set(x,++id);seenB.set(y,id);assert.deepEqual(Object.keys(x),Object.keys(y));for(const key of Object.keys(x))walk(x[key],y[key]);};walk(a,b);
}
test('owned server assembly retains exact wire bytes, graph, freezing and real signature verification',async()=>{
 const f=fixture();let previous=null;
 for(const input of [f.first,f.last]){
  const before=C.encode(input),old=P.parseResponse(before),next=P.finishOwnedResponse(input);
  assert.deepEqual(next,old);equalGraph(next,old);assert.deepEqual(C.encode(next),before,'EXACT_RESPONSE_BYTES');
  assert.notEqual(next,input);assert.notEqual(next.page,input.page);assert.notEqual(next.page.cumulative_counts,next.page.next_cursor.cumulative_counts);
  assert.deepEqual(C.encode(input),before,'SOURCE_UNCHANGED');assert.equal((await f.verifier.verify(C.encode(next),{expected:f.expected,previousCursor:previous})).verified,true);
  previous=next.page.next_cursor;
 }
});
test('large supported row remains byte-identical without a new row or response limit',()=>{
 const f=fixture(JSON.stringify({synthetic:'x'.repeat(1900000)}));const encoded=C.encode(f.first);
 assert.deepEqual(C.encode(P.finishOwnedResponse(f.first)),encoded);equalGraph(P.finishOwnedResponse(f.first),P.parseResponse(encoded));
});
test('response bindings and terminal completeness still reject corrupt assemblies',()=>{
 const f=fixture(),copy=x=>JSON.parse(JSON.stringify(x));
 for(const damage of [x=>{x.page.manifest_digest=P.hash('synthetic','wrong');},x=>{x.finish=f.last.finish;},x=>{x.page.rows[0].value_b64=C.encode64('{}');}]){
  const bad=copy(f.first);damage(bad);let oldError,newError;try{P.parseResponse(C.encode(bad));}catch(e){oldError=e;}try{P.finishOwnedResponse(bad);}catch(e){newError=e;}
  assert(oldError);assert.equal(newError?.code,oldError.code,'VALIDATION_NOT_SKIPPED');
 }
});
test('server-only seam rejects getters, cycles and prototype keys; wire duplicate-key checks remain unchanged',()=>{
 let calls=0;const getter={};Object.defineProperty(getter,'manifest',{enumerable:true,get(){calls++;throw Error('must not execute');}});
 assert.throws(()=>P.finishOwnedResponse(getter));assert.equal(calls,0);
 const cycle={};cycle.manifest=cycle;assert.throws(()=>P.finishOwnedResponse(cycle));
 const f=fixture(),bad=JSON.parse(JSON.stringify(f.first));Object.defineProperty(bad,'__proto__',{enumerable:true,value:{polluted:true}});
 assert.throws(()=>P.finishOwnedResponse(bad));assert.equal({}.polluted,undefined);
 const raw=C.text(C.encode(f.first)).replace('{','{"manifest":null,');assert.throws(()=>P.parseResponse(C.bytes(raw)));
});
