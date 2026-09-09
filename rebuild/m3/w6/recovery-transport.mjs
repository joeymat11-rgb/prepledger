// Rows-v3 adaptation of accepted W5 reconciliation/transport.cjs. Persistence
// and inventory validation use the real repository; negative ingress remains
// an explicit mandatory seam, never a fabricated production observation policy.
export const RECOVERY_LIMITS=Object.freeze({restarts:2,retries:2,timeoutMs:30000,attemptMs:600000});
const MESSAGE='Restore incomplete. Pause changes on your other device, then try again.';
export function createRowsFetcher({baseURL,headers,codec:C,protocol:P,fetchImpl=globalThis.fetch}){
 const url=new URL('/reconcile/rows',baseURL);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname)))throw new TypeError('HTTPS authority or explicit local loopback required');
 if(typeof headers!=='function'||typeof fetchImpl!=='function')throw new TypeError('Explicit authenticated headers and fetch required');
 return async(body,{signal}={})=>{
  const bytes=C.encode(body),limit=body.profile===P.DOMAINS.begin?C.LIMITS.request:P.LIMITS.request;if(bytes.length>limit)throw Error('REQUEST_LIMIT');
  const response=await fetchImpl(url,{method:'POST',headers:{...await headers(),'Content-Type':'application/json'},body:bytes,signal,cache:'no-store',credentials:'omit',redirect:'error',referrerPolicy:'no-referrer'});
  if(!response.body?.getReader||!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')||''))throw Error('RESPONSE_FORMAT');
  const reader=response.body.getReader(),blocks=[],blockSize=65536;let length=0,used=blockSize;
  // Do not retain one object per network chunk: an adversarial stream can send
  // millions of tiny chunks while remaining below the byte ceiling.
  try{for(;;){const {done,value}=await reader.read();if(done)break;if(!(value instanceof Uint8Array)||length+value.length>P.LIMITS.response){await reader.cancel();throw Error('RESPONSE_LIMIT');}
   let offset=0;while(offset<value.length){if(used===blockSize){blocks.push(new Uint8Array(Math.min(blockSize,P.LIMITS.response-length)));used=0;}const block=blocks.at(-1),take=Math.min(block.length-used,value.length-offset);block.set(value.subarray(offset,offset+take),used);used+=take;offset+=take;length+=take;}
  }}finally{reader.releaseLock();}
  const bodyBytes=new Uint8Array(length);let offset=0;for(const block of blocks){const take=Math.min(block.length,length-offset);bodyBytes.set(block.subarray(0,take),offset);offset+=take;}
  return {status:response.status,bodyBytes};
 };
}
export function createRowsRecovery({stage,codec:C,protocol:P,fetchPage,newRequest,expected,observeNegative,validateProfile,context='RESTORE',monotonicMs=()=>performance.now(),timers={setTimeout:(fn,ms)=>globalThis.setTimeout(fn,ms),clearTimeout:id=>globalThis.clearTimeout(id)}}){
 if(!['RESTORE','REFRESH'].includes(context))throw new TypeError('Explicit restore or refresh context required');
 for(const fn of [stage?.attemptPersistence,stage?.start,stage?.append,stage?.progress,stage?.inventory,fetchPage,newRequest,expected,observeNegative,validateProfile])if(typeof fn!=='function')throw new TypeError('Complete durable recovery and negative ingress seams required');
 const persistence=stage.attemptPersistence(),L=RECOVERY_LIMITS;let running=false;
 async function run({explicitRetry=false}={}){
  if(running)return {complete:false,evidenceReady:false,code:'ATTEMPT_RUNNING'};running=true;
  let record,begun=monotonicMs();const attemptAbort=new AbortController();
  const elapsed=()=>{const now=monotonicMs();return Number.isFinite(begun)&&Number.isFinite(now)&&now>=begun?now-begun:Infinity;};
  const bounded=async action=>{const left=L.attemptMs-elapsed();if(!(left>0))throw Error('WATCHDOG_EXHAUSTED');let timer;
   try{const value=await Promise.race([Promise.resolve().then(action),new Promise((_,reject)=>{timer=timers.setTimeout(()=>{attemptAbort.abort();reject(Error('WATCHDOG_EXHAUSTED'));},left);})]);if(elapsed()>=L.attemptMs){attemptAbort.abort();throw Error('WATCHDOG_EXHAUSTED');}return value;}finally{if(timer!==undefined)timers.clearTimeout(timer);}
  };
  const save=async()=>{if(await bounded(()=>persistence.save(record))!==true)throw Error('ATTEMPT_PERSISTENCE_FAILED');};
  const incomplete=async reason=>{
   attemptAbort.abort();
   record={status:'EXHAUSTED',restarts:record?.restarts||0,requests:record?.requests||0,page:record?.page||0,reason};
   try{await save();}catch{/* Existing durable marker remains a recovery fence. */}
   return {complete:false,evidenceReady:false,code:'RESTORE_INCOMPLETE',...(context==='RESTORE'?{recoveryState:18}:{}),checkpoint:false,preserveKnownStates:true,message:MESSAGE,reason};
  };
  const fetchBounded=async(body,captured,previousCursor)=>{
   if(elapsed()>=L.attemptMs)throw Error('WATCHDOG_EXHAUSTED');const controller=new AbortController();let timer;
   try{const reply=await Promise.race([
    Promise.resolve().then(()=>fetchPage(body,{signal:controller.signal})).then(async response=>{
     // This runs even when Promise.race already timed out. Do not discard a
     // signed200 rejection/standing record merely because its positive use died.
     const wireExpected=Object.fromEntries(['scopeDigest','nonce','contextId','requestDigest','basisDigest','claimSetDigest','mode'].map(k=>[k,captured[k]]));
     try{await observeNegative(response,{expected:wireExpected,scope:{athleteId:captured.athleteId,actorDeviceId:captured.actorDeviceId},previousCursor:structuredClone(previousCursor),context});}catch{throw Error('NEGATIVE_INGRESS_UNPROVEN');}
     // Require original response bytes. Parsing JSON before this boundary could
     // hide duplicate keys or a BOM from the accepted closed decoder.
     if(!(response?.bodyBytes instanceof Uint8Array)||response.bodyBytes.length>P.LIMITS.response)throw Error('RESPONSE_BYTES_REQUIRED');
     return {...response,body:C.parse(response.bodyBytes,P.LIMITS.response)};
    }),
    new Promise((_,reject)=>{timer=timers.setTimeout(()=>{controller.abort();reject(Error('REQUEST_TIMEOUT'));},Math.min(L.timeoutMs,L.attemptMs-elapsed()));}),
   ]);if(elapsed()>=L.attemptMs)throw Error('WATCHDOG_EXHAUSTED');return reply;}finally{if(timer!==undefined)timers.clearTimeout(timer);}
  };
  try{
   const prior=await bounded(()=>persistence.load());
   if(prior&&!explicitRetry){record=prior;return await incomplete('EXPLICIT_RETRY_REQUIRED');}
   if(!Number.isFinite(begun))return await incomplete('MONOTONIC_UNAVAILABLE');
   record={status:'ACTIVE',restarts:0,requests:0,page:0,reason:null};await save();const seenNonces=new Set();
   for(;;){
    const request=C.decodeRequest(C.encode(await bounded(newRequest)));if(seenNonces.has(request.nonce))return await incomplete('NONCE_REUSED');seenNonces.add(request.nonce);
    const requestBytes=C.encode(request),captured=structuredClone(await bounded(()=>expected(request)));
    if(!C.nonempty(captured.actorDeviceId)||!C.nonempty(captured.athleteId))return await incomplete('EXPECTED_SCOPE_REQUIRED');
    const stageExpected=Object.fromEntries(['scopeDigest','nonce','contextId','requestDigest','basisDigest','claimSetDigest','mode'].map(k=>[k,captured[k]]));
    if(stageExpected.requestDigest!==C.hash('request',requestBytes)||stageExpected.claimSetDigest!==P.hash('claims',request.claims)||stageExpected.nonce!==request.nonce||stageExpected.contextId!==request.context_id||stageExpected.mode!==request.mode)return await incomplete('EXPECTED_REQUEST_MISMATCH');
    // An internal source restart is explicit within this already durable attempt;
    // a surviving prior attempt still required owner/app explicit Retry above.
    await bounded(()=>stage.start({expected:stageExpected,explicitRetry:explicitRetry||record.restarts>0}));
    let manifest=null,cursor=null,restart=false;
    for(;;){
     let response;
     const body=manifest?{profile:P.DOMAINS.continue,device_id:captured.actorDeviceId,manifest,cursor}:{profile:P.DOMAINS.begin,device_id:captured.actorDeviceId,request,basis_digest:captured.basisDigest};
     for(let retry=0;retry<=L.retries;retry++){
      if(!Number.isSafeInteger(record.requests+1))return await incomplete('COUNTER_EXHAUSTED');record.requests++;await save();
      try{response=await fetchBounded(body,captured,cursor);break;}catch(cause){if(['WATCHDOG_EXHAUSTED','NEGATIVE_INGRESS_UNPROVEN'].includes(cause.message)||retry===L.retries)throw cause;}
     }
     if(response?.status===409&&response.body?.error?.code==='SNAPSHOT_CHANGED'){restart=true;break;}
     if(response?.status!==200)return await incomplete('REMOTE_REFUSAL');
     const staged=await bounded(()=>stage.append(response.bodyBytes));if(staged?.staged!==true)return await incomplete('INVALID_PAGE');
     // Only verified durable repository output, never the caller's response
     // object, determines the next request and terminal condition.
     const progress=await bounded(()=>stage.progress());manifest=progress.manifest;cursor=progress.cursor;record.page=progress.pages;await save();
     if(progress.terminal)break;
    }
    if(restart){if(record.restarts===L.restarts)return await incomplete('RESTARTS_EXHAUSTED');record.restarts++;record.page=0;await save();continue;}
    const inventory=await bounded(()=>stage.inventory()),evidence=await bounded(()=>validateProfile({inventory,requestBytes,expected:captured,signal:attemptAbort.signal}));
    if(evidence?.profileVerified!==true||evidence.complete!==false||evidence.activated!==false||elapsed()>=L.attemptMs)return await incomplete('PROFILE_INCOMPLETE');
    await bounded(()=>inventory.assertCurrent());record.status='VALIDATED';await save();
    return {complete:false,evidenceReady:true,activated:false,checkpoint:false,evidence};
   }
  }catch(cause){return await incomplete(cause?.message==='ATTEMPT_PERSISTENCE_FAILED'?'ATTEMPT_PERSISTENCE_FAILED':cause?.message==='NEGATIVE_INGRESS_UNPROVEN'?'NEGATIVE_INGRESS_UNPROVEN':'TRANSPORT_EXHAUSTED');}
  finally{running=false;}
 }
 return Object.freeze({run});
}
