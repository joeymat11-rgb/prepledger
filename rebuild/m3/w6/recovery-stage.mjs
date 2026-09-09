// Inactive encrypted recovery inventory in the existing generations store.
// No enrollment, active-generation write, receipt sink or permission is provided.
const PROFILE='earned/recovery-rows/v1',STORE='generations',HEAD=[PROFILE,'head'],CONTROL=[PROFILE,'transport'];
const clone=x=>structuredClone(x),utf8=new TextEncoder();
export function createRecoveryStage({db,namespace,crypto,key,protocol,codec,verificationKeys,validateContext,keyRange,StorageFailure}){
 const fail=(code,state=18,retryable=false)=>{throw new StorageFailure(code,state,retryable);};
 if(!db||!namespace||!crypto?.subtle||typeof key!=='function'||!protocol?.createRowsVerifier||!codec?.parse||typeof validateContext!=='function')fail('RECOVERY_STAGE_CONFIGURATION');
 const P=protocol,C=codec,verifier=P.createRowsVerifier({keys:verificationKeys,subtle:crypto.subtle});
 const bytes=x=>utf8.encode(JSON.stringify(x));
 const digest=x=>P.hash('local-stage',x);
 const rowDigest=id=>P.hash('local-stage-row-id',C.encode64(id));
 const pageKey=(id,n)=>[PROFILE,id,'page',n],indexKey=(id,c,k)=>[PROFILE,id,'row',c,rowDigest(k)];
 const archiveKey=id=>[PROFILE,id,'archive'];
 const aad=(role,id,n)=>bytes([PROFILE,namespace,role,id,n]);
 const exact=(v,fields)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===fields.length&&fields.every(k=>Object.hasOwn(v,k));
 const safe=n=>Number.isSafeInteger(n)&&n>=0;
 function shape(record){
  if(!exact(record,['profile','attempt','revision','iv','ciphertext'])||record.profile!==PROFILE||typeof record.attempt!=='string'||!/^[a-f0-9]{32}$/.test(record.attempt)||!safe(record.revision)||record.revision<1||!(record.iv instanceof Uint8Array)||record.iv.length!==12||!(record.ciphertext instanceof ArrayBuffer)||record.ciphertext.byteLength>P.LIMITS.response+32768)fail('RECOVERY_STAGE_INTEGRITY');
 }
 const token=record=>{if(record===undefined)return null;shape(record);return digest([record.profile,record.attempt,record.revision,Array.from(record.iv),C.encode64(new Uint8Array(record.ciphertext))]);};
 async function seal(value,role,attempt,revision){
  const plain=bytes(value);if(plain.byteLength>P.LIMITS.response+16384)fail('RECOVERY_STAGE_RECORD_LIMIT',3);
  try{const iv=crypto.getRandomValues(new Uint8Array(12)),ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad(role,attempt,revision)},await key(),plain);return {profile:PROFILE,attempt,revision,iv,ciphertext};}
  catch(error){if(error instanceof StorageFailure)throw error;fail('RECOVERY_STAGE_SEAL_FAILED',3);}
 }
 async function open(record,role){
  shape(record);
  try{return C.parse(new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:record.iv,additionalData:aad(role,record.attempt,record.revision)},await key(),record.ciphertext)),P.LIMITS.response+16384);}
  catch(error){if(error instanceof StorageFailure&&error.code==='DECRYPTION_UNAVAILABLE')throw error;fail('RECOVERY_STAGE_INTEGRITY');}
 }
 function read(keys){return new Promise((resolve,reject)=>{
  let tx;const values=[];try{tx=db.transaction(STORE,'readonly');const store=tx.objectStore(STORE);keys.forEach((k,i)=>{const request=store.get(k);request.onsuccess=()=>{values[i]=request.result;};});}catch{reject(new StorageFailure('RECOVERY_STAGE_READ_FAILED',18));return;}
  tx.oncomplete=()=>resolve(values);tx.onabort=()=>reject(new StorageFailure('RECOVERY_STAGE_READ_FAILED',18));tx.onerror=()=>{};
 });}
 function publish(expected,head,entries,headKey=HEAD){return new Promise((resolve,reject)=>{
  let tx,refusal;const abort=error=>{refusal=error;try{tx.abort();}catch{}};
  try{tx=db.transaction(STORE,'readwrite',{durability:'strict'});}catch{reject(new StorageFailure('RECOVERY_STAGE_BEGIN_FAILED',3));return;}
  const store=tx.objectStore(STORE),request=store.get(headKey);
  request.onsuccess=()=>{try{
   if(token(request.result)!==expected)fail('RECOVERY_STAGE_CHANGED',3,true);
   let remaining=entries.length;
   const write=()=>{const decision=validateContext();if(decision?.then)fail('RECOVERY_STAGE_ASYNC_GUARD',3);if(decision)fail(decision.code||'RECOVERY_STAGE_REFUSED',decision.state||18);for(const [k,v]of entries)store.put(v,k);store.put(head,headKey);};
   // Page/index slots are immutable within an attempt. A preexisting slot at a
   // new head is corruption, not permission to overwrite a previous original.
   if(!remaining){write();return;}
   for(const [k]of entries){const prior=store.get(k);prior.onsuccess=()=>{try{if(prior.result!==undefined)fail('RECOVERY_STAGE_SLOT_EXISTS');if(--remaining===0)write();}catch(error){abort(error instanceof StorageFailure?error:new StorageFailure('RECOVERY_STAGE_WRITE_FAILED',3));}};}
  }catch(error){abort(error instanceof StorageFailure?error:new StorageFailure('RECOVERY_STAGE_WRITE_FAILED',3));}};
  tx.oncomplete=()=>resolve({staged:true,complete:false,durability:tx.durability||'unreported'});
  tx.onabort=()=>reject(refusal||new StorageFailure('RECOVERY_STAGE_ABORTED',3));tx.onerror=()=>{};
 });}
 function validHead(h,record){
  if(!exact(h,['attempt','expected','manifest','cursor','pages','terminal'])||h.attempt!==record.attempt||!safe(h.pages)||typeof h.terminal!=='boolean'||h.pages!==record.revision-1)fail('RECOVERY_STAGE_INTEGRITY');
  if(h.pages===0){if(h.manifest!==null||h.cursor!==null||h.terminal)fail('RECOVERY_STAGE_INTEGRITY');}
  else{P.parseManifest(bytes(h.manifest));P.parseCursor(bytes(h.cursor));if(h.cursor.index!==h.pages||h.cursor.manifest_digest!==P.manifestDigest(h.manifest))fail('RECOVERY_STAGE_INTEGRITY');}
  return h;
 }
 async function loaded(){const [record]=await read([HEAD]);if(record===undefined)return null;const h=validHead(await open(record,'head'),record);return {record,h,token:token(record)};}
 async function archived(reference){
  if(!exact(reference,['profile','attempt','manifestDigest'])||reference.profile!==PROFILE||typeof reference.attempt!=='string'||!/^[a-f0-9]{32}$/.test(reference.attempt)||!C.digestValue(reference.manifestDigest))fail('RECOVERY_ARCHIVE_REFERENCE');
  const ref=clone(reference),[record]=await read([archiveKey(ref.attempt)]);if(!record)fail('RECOVERY_ARCHIVE_MISSING');
  const h=validHead(await open(record,'archive'),record);
  if(!h.terminal||h.attempt!==ref.attempt||P.manifestDigest(h.manifest)!==ref.manifestDigest)fail('RECOVERY_ARCHIVE_BINDING');
  const previous=h.pages===1?null:(await open((await read([pageKey(h.attempt,h.pages-1)]))[0],'page')).page.next_cursor;
  const terminal=await signedPage(h,h.pages,previous);
  if(!terminal.finish||P.cursorReference(terminal.page.next_cursor)!==P.cursorReference(h.cursor))fail('RECOVERY_ARCHIVE_INCOMPLETE');
  return {record,h,token:token(record),reference:ref};
 }
 async function signedPage(h,index,previous){
  const [record]=await read([pageKey(h.attempt,index)]);if(!record||record.attempt!==h.attempt||record.revision!==index)fail('RECOVERY_STAGE_PAGE_MISSING');
  const response=await open(record,'page'),result=await verifier.verify(bytes(response),{expected:h.expected,previousCursor:previous});
  if(!result?.verified||response.page.index!==index||P.manifestDigest(response.manifest)!==P.manifestDigest(h.manifest))fail('RECOVERY_STAGE_PROOF_UNPROVEN');
  return response;
 }
 async function indexFor(h,collection,id){
  const [record]=await read([indexKey(h.attempt,collection,id)]);if(record===undefined)return undefined;
  if(record.attempt!==h.attempt)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
  const value=await open(record,'index:'+collection+':'+rowDigest(id));
  if(!exact(value,['collection','id_b64','page','position'])||value.collection!==collection||C.text(C.decode64(value.id_b64,P.LIMITS.row))!==id||!safe(value.page)||value.page<1||value.page>h.pages||!safe(value.position)||value.position>=P.LIMITS.rows||record.revision!==value.page)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
  return value;
 }
 async function unchanged(basis){const [now]=await read([HEAD]);if(token(now)!==basis.token)fail('RECOVERY_STAGE_CHANGED',18,true);}
 function indexKeys(attempt,collection,after){return new Promise((resolve,reject)=>{
  if(!keyRange?.bound){reject(new StorageFailure('RECOVERY_STAGE_CURSOR_UNAVAILABLE',18));return;}
  let tx;const found=[],prefix=[PROFILE,attempt,'scan',collection];
  try{tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).openKeyCursor(keyRange.bound(after||prefix,[...prefix,[]],Boolean(after),false));
   r.onsuccess=()=>{const cursor=r.result;if(!cursor)return;found.push(cursor.key);if(found.length<32)cursor.continue();};
  }catch{reject(new StorageFailure('RECOVERY_STAGE_READ_FAILED',18));return;}
  tx.oncomplete=()=>resolve(found);tx.onabort=()=>reject(new StorageFailure('RECOVERY_STAGE_READ_FAILED',18));tx.onerror=()=>{};
 });}
 return Object.freeze({
  attemptPersistence(){
   let prior,loaded=false,busy=false;
   const valid=value=>{if(!exact(value,['status','restarts','requests','page','reason'])||!['ACTIVE','EXHAUSTED','VALIDATED'].includes(value.status)||!safe(value.restarts)||value.restarts>2||!safe(value.requests)||!safe(value.page)||!(value.reason===null||typeof value.reason==='string'&&value.reason.length<=128))fail('RECOVERY_ATTEMPT_INTEGRITY');return value;};
   return Object.freeze({
    async load(){if(busy)fail('RECOVERY_ATTEMPT_RUNNING',3,true);busy=true;try{const [record]=await read([CONTROL]);prior=record;const value=record===undefined?null:valid(await open(record,'transport'));loaded=true;return clone(value);}finally{busy=false;}},
    async save(value){if(!loaded||busy)fail('RECOVERY_ATTEMPT_UNPROVEN',18);busy=true;try{
     const copied=valid(clone(value)),revision=prior?prior.revision+1:1;if(!safe(revision))fail('RECOVERY_ATTEMPT_INTEGRITY');
     const attempt=prior?.attempt||Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
     const record=await seal(copied,'transport',attempt,revision);await publish(token(prior),record,[],CONTROL);prior=record;return true;
    }finally{busy=false;}},
   });
  },
  async start({expected,explicitRetry=false}={}){
   const prior=await loaded();if(prior&&!explicitRetry)fail('RECOVERY_STAGE_EXPLICIT_RETRY_REQUIRED');
   // A private copy is frozen by its encrypted head; caller mutation cannot
   // substitute expected context during asynchronous sealing.
   const copied=C.parse(bytes(expected),P.LIMITS.metadata);
   C.exact(copied,['scopeDigest','nonce','contextId','requestDigest','basisDigest','claimSetDigest','mode']);
   if(!['CURRENT_DEVICE','ACCOUNT_RECOVERY'].includes(copied.mode)||Object.entries(copied).some(([k,v])=>k!=='mode'&&!C.digestValue(v)))fail('RECOVERY_STAGE_EXPECTED_CONTEXT');
   const attempt=Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
   const h={attempt,expected:copied,manifest:null,cursor:null,pages:0,terminal:false};
   await publish(prior?.token??null,await seal(h,'head',attempt,1),[]);return {attempt,staged:true,complete:false};
  },
  async progress(){const basis=await loaded();if(!basis)return null;return {...clone(basis.h),staged:true,complete:false};},
  async append(input){
   const raw=C.bytes(input),basis=await loaded();if(!basis)fail('RECOVERY_STAGE_MISSING');const h=basis.h;
   const parsed=P.parseResponse(raw);
   // Replaying the last durable page is idempotent. Verify both full frames;
   // only the cursor signature may be re-encoded without changing its identity.
   if(h.pages&&parsed.page.index===h.pages){
    const [kept]=await read([pageKey(h.attempt,h.pages)]);if(!kept)fail('RECOVERY_STAGE_PAGE_MISSING');const original=await open(kept,'page');
    const previous=h.pages===1?null:(await open((await read([pageKey(h.attempt,h.pages-1)]))[0],'page')).page.next_cursor;
    const result=await verifier.verify(raw,{expected:h.expected,previousCursor:previous});
    const semantic=x=>{const c=clone(x);for(const part of [c.manifest,c.page,c.page.next_cursor,c.finish].filter(Boolean))delete part.authority_signature;return c;};
    if(!result?.verified||JSON.stringify(semantic(original))!==JSON.stringify(semantic(parsed)))fail('RECOVERY_STAGE_REPLAY_CONFLICT');
    await unchanged(basis);return {staged:true,duplicate:true,complete:false};
   }
   if(h.terminal)fail('RECOVERY_STAGE_ALREADY_TERMINAL');
   const verified=await verifier.verify(raw,{expected:h.expected,previousCursor:h.cursor});if(!verified?.verified)fail('RECOVERY_STAGE_PROOF_UNPROVEN');
   const response=verified.value;
   if(h.manifest&&P.manifestDigest(h.manifest)!==P.manifestDigest(response.manifest))fail('RECOVERY_STAGE_SNAPSHOT_CHANGED');
   const index=response.page.index;if(index!==h.pages+1||index>=Number.MAX_SAFE_INTEGER)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
   const entries=[[pageKey(h.attempt,index),await seal(response,'page',h.attempt,index)]];
   for(let i=0;i<response.page.rows.length;i++){
    const row=response.page.rows[i],id=C.text(C.decode64(row.row_id_b64,P.LIMITS.row));
    const k=indexKey(h.attempt,row.collection,id),value={collection:row.collection,id_b64:row.row_id_b64,page:index,position:i};
    entries.push([k,await seal(value,'index:'+row.collection+':'+rowDigest(id),h.attempt,index)]);
   }
   for(const collection of new Set(response.page.rows.map(row=>row.collection)))entries.push([[PROFILE,h.attempt,'scan',collection,index],await seal({collection,page:index},'scan:'+collection,h.attempt,index)]);
   const next={...h,manifest:response.manifest,cursor:response.page.next_cursor,pages:index,terminal:Boolean(response.finish)};
   // The original signed snapshot stays addressable after another attempt starts.
   // Archive and terminal page/head are one transaction; neither is an activation.
   if(next.terminal)entries.push([archiveKey(h.attempt),await seal(next,'archive',h.attempt,index+1)]);
   return publish(basis.token,await seal(next,'head',h.attempt,index+1),entries);
  },
  async inventory(){return readInventory(await loaded(),false);},
  async openArchive(reference){return readInventory(await archived(reference),true);},
 });
 async function readInventory(basis,historical){
   if(!basis?.h.terminal)fail('RECOVERY_STAGE_INCOMPLETE');const h=basis.h;
   const stable=async()=>{
    if(!historical){await unchanged(basis);return;}
    const [now]=await read([archiveKey(h.attempt)]);if(token(now)!==basis.token)fail('RECOVERY_ARCHIVE_CHANGED');
   };
   const view={
    historicalOnly:historical,
    async archiveReference(){
     await stable();const ref={profile:PROFILE,attempt:h.attempt,manifestDigest:P.manifestDigest(h.manifest)};
     await archived(ref);await stable();return ref;
    },
    async bindings(){await stable();return {manifest:clone(h.manifest),expected:clone(h.expected),...(historical?{historicalOnly:true}:{})};},
    async scan(collection,visitor){
     await stable();
     if(!P.COLLECTIONS.includes(collection)||typeof visitor!=='function')fail('RECOVERY_STAGE_ROW_QUERY');
     let after=null,count=0;const expected=h.manifest.collection_counts.find(([c])=>c===collection)[1];
     for(;;){const keys=await indexKeys(h.attempt,collection,after);if(!keys.length)break;
      for(const k of keys){if(!Array.isArray(k)||k.length!==5||!safe(k[4])||k[4]<1||k[4]>h.pages)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
       const [record]=await read([k]);if(!record||record.attempt!==h.attempt)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
       const ref=await open(record,'scan:'+collection);if(!exact(ref,['collection','page'])||ref.collection!==collection||ref.page!==k[4]||record.revision!==k[4])fail('RECOVERY_STAGE_INDEX_UNPROVEN');
       const previous=ref.page===1?null:(await open((await read([pageKey(h.attempt,ref.page-1)]))[0],'page')).page.next_cursor;
       const response=await signedPage(h,ref.page,previous);let members=0;
       for(let position=0;position<response.page.rows.length;position++){const row=response.page.rows[position];if(row.collection!==collection)continue;members++;
        const id=C.text(C.decode64(row.row_id_b64,P.LIMITS.row)),index=await indexFor(h,collection,id);
        if(!index||index.page!==ref.page||index.position!==position||++count>expected)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
        await visitor({collection,row_id:id,value:C.text(C.decode64(row.value_b64,P.LIMITS.row))});
       }if(!members)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
      }after=keys.at(-1);
     }
     if(count!==expected)fail('RECOVERY_STAGE_INDEX_UNPROVEN');await stable();return count;
    },
    async readRow(collection,id){
     await stable();
     if(!P.COLLECTIONS.includes(collection)||typeof id!=='string')fail('RECOVERY_STAGE_ROW_QUERY');
     const item=await indexFor(h,collection,id);if(!item){await stable();return undefined;}
     const previous=item.page===1?null:(await open((await read([pageKey(h.attempt,item.page-1)]))[0],'page')).page.next_cursor;
     const response=await signedPage(h,item.page,previous),row=response.page.rows[item.position];
     if(P.manifestDigest(response.manifest)!==P.manifestDigest(h.manifest)||row?.collection!==collection||C.text(C.decode64(row.row_id_b64,P.LIMITS.row))!==id)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
     await stable();return {collection,row_id:id,value:C.text(C.decode64(row.value_b64,P.LIMITS.row))};
    },
    async visit(visitor){
     await stable();
     if(typeof visitor!=='function')fail('RECOVERY_STAGE_VISITOR');let previous=null;
     for(let index=1;index<=h.pages;index++){
      const response=await signedPage(h,index,previous);
      if(Boolean(response.finish)!==(index===h.pages))fail('RECOVERY_STAGE_INVENTORY_UNPROVEN');
      for(let i=0;i<response.page.rows.length;i++){
       const row=response.page.rows[i],id=C.text(C.decode64(row.row_id_b64,P.LIMITS.row)),ref=await indexFor(h,row.collection,id);
       if(!ref||ref.page!==index||ref.position!==i)fail('RECOVERY_STAGE_INDEX_UNPROVEN');
       await visitor({collection:row.collection,row_id:id,value:C.text(C.decode64(row.value_b64,P.LIMITS.row))});
      }
      previous=response.page.next_cursor;
     }
     if(P.cursorReference(previous)!==P.cursorReference(h.cursor))fail('RECOVERY_STAGE_INVENTORY_UNPROVEN');
     await stable();return {inventoryVerified:true,complete:false,activated:false,...(historical?{historicalOnly:true}:{})};
    },
    assertCurrent:()=>historical?Promise.reject(new StorageFailure('RECOVERY_HISTORICAL_ONLY',18)):unchanged(basis),
    assertIntact:stable,
   };return Object.freeze(view);
 }
}
