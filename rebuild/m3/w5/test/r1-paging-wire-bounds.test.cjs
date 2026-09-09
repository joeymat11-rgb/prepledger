'use strict';
// Proposed row-wire format size/signature evidence, NOT an ingress decoder,
// authorization, full recovery verifier, D1 row-limit or memory acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const {createAuthorityRowCodec}=require('../storage/row-codec.cjs');
const {COLLECTIONS}=require('../reconciliation/project.cjs');
const C=require('../reconciliation/codec.cjs'),Sign=require('../crypto.cjs');
const {createPublicVerifier}=require('../public-client.cjs');
const ROW=2000000,BUDGET=262144,COUNT=32,META=8192,REQUEST=3000000,RESPONSE=6000000;
const profile=kind=>'earned/r1/rows-v3/'+kind;
const encoded=value=>C.encode(value),size=value=>encoded(value).length;
const b64=value=>C.encode64(value),digest=(tag,value)=>C.hash(profile(tag),encoded(value));
const physicalSize=row=>['athlete','collection','row_id','value','sealed'].reduce((n,k)=>n+Buffer.byteLength(row[k]),8);
const upper64=bytes=>4*Math.ceil(bytes/3);
const requestBound=upper64(ROW)+META;
// Two variable base64 fields per row; sum of individual ceil operations costs
// at most8*COUNT over ceil(sum/3). Last key is duplicated in its certificate.
const responseBound=2*upper64(ROW)+8*COUNT+META;

test('R1 PAGING WIRE BOUNDS — proposed closed frame, generated P-256 and actual P1 size relations',async t=>{
 const signingKey=Sign.generateSigningKey('k'.repeat(64));
 const sign=record=>({...record,authority_signature:Sign.signatureOver(record,signingKey,record.profile)});
 const cursorReference=cursor=>digest('cursor-reference',Object.fromEntries(Object.entries(cursor).filter(([k])=>k!=='authority_signature')));
 const publicVerifier=createPublicVerifier({keys:[Sign.publicKeyOf(signingKey)],subtle:webcrypto.subtle});
 const wrappingKey=await webcrypto.subtle.generateKey({name:'AES-KW',length:256},false,['wrapKey','unwrapKey']);
 const codec=createAuthorityRowCodec({namespace:'synthetic-wire-bound',crypto:webcrypto,getWrappingKey:async()=>wrappingKey});
 const h=digest('synthetic','synthetic'),counts=COLLECTIONS.map(collection=>[collection,Number.MAX_SAFE_INTEGER]);
 const claims=[{synthetic:'bound exact source claim bytes'}],claimSetDigest=digest('claims',claims);
 const manifest=sign({profile:profile('manifest'),key_epoch:signingKey.kid,scope_digest:h,nonce:h,context_id:h,
  request_digest:h,basis_digest:h,claim_set_digest:claimSetDigest,mode:'CURRENT_DEVICE',revision:Number.MAX_SAFE_INTEGER,
  storage_control_digest:h,snapshot_id:h,collection_counts:counts,chain_seed:h});
 function frames(rows){
   const data=rows.map(row=>({collection:row.collection,row_id_b64:b64(row.row_id),value_b64:b64(row.value)}));
   const rowsDigest=digest('batch',data),manifestDigest=digest('manifest-bytes',manifest);
   const cumulative=counts.map(([,n])=>n),chain=digest('chain',[h,manifestDigest,Number.MAX_SAFE_INTEGER,rowsDigest,cumulative]);
   const cursor=sign({profile:profile('cursor'),key_epoch:signingKey.kid,manifest_digest:manifestDigest,index:Number.MAX_SAFE_INTEGER,
    last_key:{collection:data.at(-1).collection,row_id_b64:data.at(-1).row_id_b64},cumulative_counts:cumulative,chain_digest:chain});
   const page=sign({profile:profile('page'),key_epoch:signingKey.kid,manifest_digest:manifestDigest,index:Number.MAX_SAFE_INTEGER,
    previous_cursor_digest:h,rows_digest:rowsDigest,chain_digest:chain,cumulative_counts:cumulative,
    next_cursor_digest:cursorReference(cursor),rows:data,next_cursor:cursor});
   const request={profile:profile('continue'),manifest,cursor};
   const finish=sign({profile:profile('finish'),key_epoch:signingKey.kid,manifest_digest:manifestDigest,
    final_cursor_digest:cursorReference(cursor),chain_digest:chain,cumulative_counts:cumulative,
    revision:manifest.revision,storage_control_digest:manifest.storage_control_digest,context_id:manifest.context_id,
    scope_digest:manifest.scope_digest,nonce:manifest.nonce,claim_set_digest:manifest.claim_set_digest});
   return {page,request,cursor,finish};
 }
 assert(requestBound<REQUEST);assert(responseBound<RESPONSE);
 const longestCollection=COLLECTIONS.reduce((a,b)=>a.length>b.length?a:b);
 const metadataWorst=frames(Array.from({length:COUNT},()=>({collection:longestCollection,row_id:'',value:''})));
 assert(size(metadataWorst.page)<=META);assert(size(metadataWorst.request)<=META);
 assert(size({manifest,page:metadataWorst.page})<=META,'First response includes its manifest too');
 assert(size(metadataWorst.finish)<=META);
 const cases=[
  ['ordinary32',Array.from({length:32},(_,i)=>({athlete:'synthetic-a',collection:COLLECTIONS[0],row_id:'synthetic-'+i,value:JSON.stringify({seq:0,devices:{},initialPlan:{note:'x'.repeat(3000)}})}))],
  ['near-limit ASCII key',[{athlete:'synthetic-a',collection:'history',row_id:'k'.repeat(1995000),value:' {"synthetic":true} '}]],
  ['near-limit NUL key',[{athlete:'synthetic-a',collection:'history',row_id:'\u0000'.repeat(1995000),value:' {"synthetic":true} '}]],
  ['near-limit UTF-8 key',[{athlete:'synthetic-a',collection:'history',row_id:'\u{10000}'.repeat(498000),value:' {"synthetic":"e\u0301"} '}]],
  ['near-limit value',[{athlete:'synthetic-a',collection:'history',row_id:'value-row',value:JSON.stringify({synthetic:'x'.repeat(1490000)})}]]
 ];
 for(const [name,rows]of cases)await t.test(name,async()=>{
   let total=0;for(const row of rows){const physical=await codec.seal(row,{revision:0,writeEpoch:'synthetic'});
     const bytes=physicalSize(physical);assert(bytes<=ROW);total+=bytes;
     assert(Buffer.byteLength(row.row_id)+Buffer.byteLength(row.value)<=bytes,'Logical key/value bytes fit physical-column budget');
     assert.deepEqual(await codec.open(physical,{revision:1}),row);
   }
   assert(total<=BUDGET||rows.length===1);
   const {page,request,cursor,finish}=frames(rows);
   assert(size(request)<=requestBound);assert(size(page)<=responseBound);
   assert(size({manifest,page})<=responseBound);
   assert(size(request)<REQUEST);assert(size(page)<RESPONSE);
   const pageMetadata=structuredClone(page);for(const row of pageMetadata.rows){row.row_id_b64='';row.value_b64='';}pageMetadata.next_cursor.last_key.row_id_b64='';
   const requestMetadata=structuredClone(request);requestMetadata.cursor.last_key.row_id_b64='';
   assert(size(pageMetadata)<=META);assert(size(requestMetadata)<=META);
   assert(size({manifest,page:pageMetadata})<=META);
   assert(await publicVerifier.verifyRecord(page,page.profile));assert(await publicVerifier.verifyRecord(cursor,cursor.profile));
   assert(await publicVerifier.verifyRecord(manifest,manifest.profile));
   const resign=sign(cursor);assert(await publicVerifier.verifyRecord(resign,resign.profile));
   assert.equal(cursorReference(resign),cursorReference(cursor),'Valid re-signing cannot change the semantic cursor reference or make replay conflict');
   assert(await publicVerifier.verifyRecord(finish,finish.profile));assert(size(finish)<=META);
   assert.equal(await publicVerifier.verifyRecord({...finish,claim_set_digest:digest('claims',[])},finish.profile),false);
   assert.equal(await publicVerifier.verifyRecord(page,profile('finish')),false,'Different domain does not verify');
   rows.forEach((row,i)=>{assert.equal(C.text(C.decode64(page.rows[i].row_id_b64,ROW)),row.row_id);assert.equal(C.text(C.decode64(page.rows[i].value_b64,ROW)),row.value);});
   if(name.includes('key'))assert(size(request)>1048576,'A1MiB continuation cap actually rejects this permitted-size representation');
 });
 await t.test('claim-set digest binds exact bytes and order independently of later claim evaluation',async()=>{
   assert.notEqual(digest('claims',[{synthetic:'substituted claim'}]),claimSetDigest);
   assert.equal(await publicVerifier.verifyRecord({...manifest,claim_set_digest:digest('claims',[])},manifest.profile),false);
   assert.notEqual(digest('claims',[{a:1,b:2}]),digest('claims',[{b:2,a:1}]),'Exact source JSON ordering is covered');
   assert.notEqual(digest('claims',[{n:1},{n:2}]),digest('claims',[{n:2},{n:1}]),'Claim array order is covered');
 });
 console.log('R1 PAGING WIRE BOUNDS PASS — proposed request <= '+requestBound+' bytes; response <= '+responseBound+' bytes; 5 actual P1/generated-signature cases; NOT ingress, D1 limit or resource acceptance');
});
