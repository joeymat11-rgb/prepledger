'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const P=require('../reconciliation/paged-codec.cjs'),C=require('../reconciliation/codec.cjs'),Sign=require('../crypto.cjs');
const copy=value=>JSON.parse(JSON.stringify(value)),bytes=value=>C.encode(value);
const h=P.hash('synthetic','fixture');
test('pinned v3 exact-byte vectors retain NFD, NUL and original JSON number spelling',()=>{
 const v=require('./fixtures/r1-rows-v3.json');assert.equal(JSON.stringify(v.rows),v.batch_json);
 assert.equal(P.hash('batch',v.rows),v.batch_digest);assert.equal(P.hash('batch',[]),v.empty_batch_digest);
 assert.equal(C.text(C.decode64(v.rows[0].row_id_b64)),'e\u0301\u0000');assert.equal(C.text(C.decode64(v.rows[0].value_b64)),' {"n":1.00} ');
});
function fixture(rawRows=[{collection:'history',row_id:'a',value:' {"original":"e\u0301","n":1.00} '},{collection:'history',row_id:'b',value:' {"original":"second"} '},{collection:'metadata',row_id:'state',value:'{}'}]){
 const signingKey=Sign.generateSigningKey('synthetic-rows'),sign=value=>({...value,authority_signature:Sign.signatureOver(value,signingKey,value.profile)});
 const request={version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]};
 const collectionCounts=P.COLLECTIONS.map(k=>[k,rawRows.filter(r=>r.collection===k).length]);
 const manifest=sign(P.makeManifest({keyEpoch:signingKey.kid,scopeDigest:h,request,basisDigest:h,revision:1,storageControlDigest:h,snapshotId:h,collectionCounts,chainSeed:h}));
 const expected={scopeDigest:h,nonce:h,contextId:h,requestDigest:C.hash('request',bytes(request)),basisDigest:h,claimSetDigest:P.hash('claims',request.claims),mode:request.mode};
 const verifier=P.createRowsVerifier({keys:[Sign.publicKeyOf(signingKey)],subtle:webcrypto.subtle});
 const first=P.makePage({manifest,rawRows:rawRows.slice(0,2),sign});
 const next=rawRows.length>2?P.makePage({manifest,previousCursor:first.next_cursor,rawRows:rawRows.slice(2),sign}):first;
 const end=P.makePage({manifest,previousCursor:next.next_cursor,rawRows:[],sign}),finish=P.makeFinish({manifest,page:end,sign});
 return {rawRows,signingKey,sign,request,manifest,expected,verifier,first,next,end,finish};
}
test('real rows codec verifies sequential exact inventory chunks and explicit terminal evidence',async()=>{
 const f=fixture();let previous=null;
 for(const page of [f.first,f.next,f.end]){
  const response={manifest:f.manifest,page,...(page===f.end?{finish:f.finish}:{})};
  const before=bytes(response),r=await f.verifier.verify(before,{expected:f.expected,previousCursor:previous});
  assert.equal(r.verified,true,JSON.stringify(r));assert.equal(r.terminal,page===f.end);assert.equal(r.kind,'rows-v3-inventory-chunk');
  assert.equal(r.complete,undefined);assert.equal(r.activated,undefined);assert(Object.isFrozen(r.value.page.rows));
  assert.deepEqual(before,bytes(response));previous=page.next_cursor;
 }
 assert.equal(C.text(C.decode64(f.first.rows[0].value_b64,P.LIMITS.row)),f.rawRows[0].value);
 assert.equal(f.end.next_cursor.last_key.row_id_b64,C.encode64('state'));
});
test('empty initial inventory has null key, zero vector and required finish, never inferred first use',async()=>{
 const f=fixture([]),finish=P.makeFinish({manifest:f.manifest,page:f.first,sign:f.sign});
 assert.equal(f.first.next_cursor.last_key,null);assert(f.first.cumulative_counts.every(n=>n===0));
 const r=await f.verifier.verify(bytes({manifest:f.manifest,page:f.first,finish}),{expected:f.expected});assert.equal(r.verified,true,JSON.stringify(r));assert.equal(r.terminal,true);assert.equal(r.complete,undefined);
 assert.throws(()=>P.parseResponse(bytes({manifest:f.manifest,page:f.first})),/ROWS_FINISH_REQUIRED/);
});
test('continuation carries an explicit actor selector; signed scope still supplies authority elsewhere',()=>{
 const f=fixture();const begin={profile:P.DOMAINS.begin,device_id:'synthetic-device',request:f.request,basis_digest:h};
 assert.equal(P.decodeRequest(bytes(begin)).device_id,'synthetic-device');
 const continuation={profile:P.DOMAINS.continue,device_id:'synthetic-device',manifest:f.manifest,cursor:f.first.next_cursor};
 assert.equal(P.decodeRequest(bytes(continuation)).device_id,'synthetic-device');
 const missing=copy(continuation);delete missing.device_id;assert.throws(()=>P.decodeRequest(bytes(missing)));
 assert.throws(()=>P.decodeRequest(bytes({...continuation,athlete_id:'request-supplied'})));
});
test('BOM at JSON ingress is refused; row keys keep the existing P1 UTF8 restrictions',()=>{
 const f=fixture();
 assert.throws(()=>P.makePage({manifest:f.manifest,rawRows:[{collection:'history',row_id:'\ufefforiginal-key',value:'{}'}],sign:f.sign}));
 assert.throws(()=>P.parseResponse('\ufeff'+JSON.stringify({manifest:f.manifest,page:f.first})));
});
test('closed parser rejects decoded duplicate keys, unknown fields, invalid UTF8 and body overflow',()=>{
 const f=fixture(),raw=JSON.stringify({manifest:f.manifest,page:f.first});
 assert.throws(()=>P.parseResponse(raw.replace('"scope_digest":','"scope_digest":"'+h+'","scope_digest":')));
 assert.throws(()=>P.parseResponse(raw.replace('"scope_digest":','"scope_digest":"'+h+'","scope_\\u0064igest":')));
 assert.throws(()=>P.parseResponse(bytes({manifest:f.manifest,page:f.first,extra:true})));
 assert.throws(()=>P.parseResponse(new Uint8Array([0xc3,0x28])));
 assert.throws(()=>P.decodeRequest(' '.repeat(P.LIMITS.request+1)),/ROWS_REQUEST_LIMIT/);
 assert.throws(()=>P.parseResponse(' '.repeat(P.LIMITS.response+1)),/RECONCILE_LIMIT/);
});
test('a valid-looking signature from another private key with the same key id is rejected cryptographically',async()=>{
 const f=fixture(),other=Sign.generateSigningKey(f.signingKey.kid),page={...f.first,authority_signature:Sign.signatureOver(f.first,other,f.first.profile)};
 const r=await f.verifier.verify(bytes({manifest:f.manifest,page}),{expected:f.expected});assert.equal(r.verified,false);assert.equal(r.code,'ROWS_SIGNATURE');
});
test('request, basis, claim, nonce, scope and mode are bound to caller-held expected context',async()=>{
 const f=fixture();for(const field of Object.keys(f.expected)){
  const r=await f.verifier.verify(bytes({manifest:f.manifest,page:f.first}),{expected:{...f.expected,[field]:field==='mode'?'ACCOUNT_RECOVERY':P.hash('different',field)}});
  assert.equal(r.verified,false,field);assert.equal(r.code,'ROWS_EXPECTED_CONTEXT');
 }
});
test('signed ordinal, row omission, previous cursor and final inventory inconsistencies are refused',async()=>{
 const f=fixture();const responses=[];
 const skipped=copy(f.first);skipped.index=5;skipped.next_cursor=f.sign({...skipped.next_cursor,index:5});skipped.next_cursor_digest=P.cursorReference(skipped.next_cursor);responses.push(f.sign(skipped));
 const omitted=copy(f.first);omitted.rows.shift();omitted.rows_digest=P.hash('batch',omitted.rows);responses.push(f.sign(omitted));
 for(const page of responses){const r=await f.verifier.verify(bytes({manifest:f.manifest,page}),{expected:f.expected});assert.equal(r.verified,false);assert(['ROWS_INDEX','ROWS_COUNTS'].includes(r.code),r.code);}
 const outOfOrder=await f.verifier.verify(bytes({manifest:f.manifest,page:f.next}),{expected:f.expected});assert.equal(outOfOrder.verified,false);assert.equal(outOfOrder.code,'ROWS_INDEX');
 const badFinish=f.sign({...f.finish,cumulative_counts:P.COLLECTIONS.map(()=>0)});assert.throws(()=>P.parseResponse(bytes({manifest:f.manifest,page:f.end,finish:badFinish})),/ROWS_FINISH_BINDING/);
 assert.throws(()=>P.parseResponse(bytes({manifest:f.manifest,page:f.first,finish:f.finish})),/ROWS_FINISH_REQUIRED/);
 const early=P.makePage({manifest:f.manifest,previousCursor:f.first.next_cursor,rawRows:[],sign:f.sign});assert.throws(()=>P.makeFinish({manifest:f.manifest,page:early,sign:f.sign}),/ROWS_INVENTORY_INCOMPLETE/);
});
test('cursor re-signing retains reference; changed signed contents do not',async()=>{
 const f=fixture(),resigned=f.sign(f.first.next_cursor);assert.equal(P.cursorReference(resigned),P.cursorReference(f.first.next_cursor));
 const r=await f.verifier.verify(bytes({manifest:f.manifest,page:f.next}),{expected:f.expected,previousCursor:resigned});assert.equal(r.verified,true,JSON.stringify(r));
 for(const field of ['index','last_key','chain_digest'])assert.notEqual(P.cursorReference({...resigned,[field]:field==='index'?2:field==='last_key'?null:P.hash('different','chain')}),P.cursorReference(resigned));
});
test('empty terminal page preserves the last delivered key; null is not a substitute after data',async()=>{
 const f=fixture();const wrong=copy(f.end);wrong.next_cursor=f.sign({...wrong.next_cursor,last_key:null});wrong.next_cursor_digest=P.cursorReference(wrong.next_cursor);
 const r=await f.verifier.verify(bytes({manifest:f.manifest,page:f.sign(wrong),finish:f.finish}),{expected:f.expected,previousCursor:f.next.next_cursor});assert.equal(r.verified,false);assert.equal(r.code,'ROWS_CURSOR_KEY');
});
test('binary key ordering, collection vector order, overflow and duplicate rows are enforced',()=>{
 const f=fixture();assert.throws(()=>P.makePage({manifest:f.manifest,rawRows:[f.rawRows[1],f.rawRows[0]],sign:f.sign}),/ROWS_ORDER/);
 assert.throws(()=>P.makePage({manifest:f.manifest,rawRows:[f.rawRows[0],f.rawRows[0]],sign:f.sign}),/ROWS_ORDER/);
 const reversed=copy(f.manifest);reversed.collection_counts.reverse();assert.throws(()=>P.parseManifest(bytes(f.sign(reversed))),/ROWS_COLLECTION_ORDER/);
 const overflowing=f.sign({...f.manifest,revision:Number.MAX_SAFE_INTEGER});assert.throws(()=>P.parseManifest(bytes(overflowing)),/ROWS_REVISION/);
 const unknown=copy(f.first);unknown.rows[0].collection='unknown';assert.throws(()=>P.parseResponse(bytes({manifest:f.manifest,page:f.sign(unknown)})));
});
