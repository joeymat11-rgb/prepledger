"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict");
const { createRestoreTransport, LIMITS } = require("../reconciliation/transport.cjs");
const C = require("../reconciliation/codec.cjs");
// Explicit synthetic seams isolate finite-controller obligations. These are not
// K1/IndexedDB/phone acceptance; only the Worker test below uses real JWT auth.
const tick = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
async function until(predicate) { for (let i=0; i<100; i++) { if(predicate()) return; await tick(); } throw Error("synthetic checkpoint not reached"); }
function fixture(overrides = {}) {
  let now=0, timerId=0, nonce=0, saved=null;
  const timers = new Map(), received=[], writes=[], stages=[];
  const f = { timers, received, writes, stages, saved:()=>saved,
    advance:ms=>{now+=ms;}, fire:delay=>{const entry=[...timers].find(([,v])=>v.delay===delay);assert(entry,"timer exists: "+delay);timers.delete(entry[0]);entry[1].fn();} };
  const options={
    monotonicMs:()=>now,
    timers:{setTimeout:(fn,delay)=>{const id=++timerId;timers.set(id,{fn,delay});return id;},clearTimeout:id=>timers.delete(id)},
    persistence:{load:async()=>saved,save:async value=>{saved=structuredClone(value);writes.push(saved);return true;}},
    newRequest:async()=>({nonce:C.encode64(new Uint8Array(32).fill(++nonce))}), expected:async request=>({nonce:request.nonce}),
    observeNegative:async reply=>{received.push(reply);},
    fetchPage:async({page_index})=>({status:200,body:{manifest_b64:C.encode64(C.encode({synthetic:true})),page:{index:page_index}}}),
    verifier:{verifyManifest:async()=>{stages.push("manifest");return {verified:true,value:{page_count:1}};},
      verifyPage:async bytes=>{stages.push("page");return {verified:true,value:C.parse(bytes)};},
      assemble:async()=>{stages.push("assemble");return {verified:true,value:{syntheticEvidence:true}};}},
    ...overrides,
  };
  return {...f,options,create:()=>createRestoreTransport(options)};
}
test("late successful-status raw pages still reach capture after every request timed out", async()=>{
  const pending=[],f=fixture({fetchPage:(_body,{signal})=>{const d=deferred();pending.push({...d,signal});return d.promise;}});
  const result=f.create().run();
  for(let i=0;i<3;i++){await until(()=>pending.length===i+1);f.fire(LIMITS.timeoutMs);}
  const stopped=await result;assert.equal(stopped.complete,false);
  for(const p of pending){assert.equal(p.signal.aborted,true);p.resolve({status:200,body:{opaque:"synthetic retained negative page"}});}
  await until(()=>f.received.length===3);assert.deepEqual(f.stages,[]);assert.equal(stopped.checkpoint,false);
});
test("raw successful and refusal replies use the same capture seam before classification", async()=>{
  for(const status of [200,403]){const f=fixture();const fetch=f.options.fetchPage;f.options.fetchPage=async body=>status===200?fetch(body):{status,body:{error:{state:17}}};
    const r=await f.create().run();assert.equal(f.received.length,1);assert.equal(r.complete,status===200);}
});
test("restart rejects repeated nonce before a second network request", async()=>{
  const nonce=C.encode64(new Uint8Array(32).fill(7));let calls=0;
  const f=fixture({newRequest:async()=>({nonce}),fetchPage:async()=>{calls++;return {status:409,body:{error:{code:"SNAPSHOT_CHANGED"}}};}});
  const result=await f.create().run();assert.equal(result.reason,"NONCE_REUSED");assert.equal(calls,1);assert.equal(result.complete,false);
});
test("fresh restart nonce completes after content becomes quiet", async()=>{
  const seen=[],f=fixture();const fetch=f.options.fetchPage;
  f.options.fetchPage=async body=>{seen.push(body.request.nonce);return seen.length===1?{status:409,body:{error:{code:"SNAPSHOT_CHANGED"}}}:fetch(body);};
  assert.equal((await f.create().run()).complete,true);assert.equal(new Set(seen).size,2);
});
for(const stage of ["load","initial-save","new-request","expected","manifest","page","assemble","complete-save"]){
  test("whole-attempt deadline bounds "+stage+" and late resolution never publishes completion", async()=>{
    const f=fixture(),d=deferred();let entered=false;
    const stall=()=>{entered=true;return d.promise;};
    let resolution=true;
    if(stage==="load"){f.options.persistence.load=stall;resolution=null;}
    else if(stage==="initial-save")f.options.persistence.save=stall;
    else if(stage==="new-request"){f.options.newRequest=stall;resolution={nonce:C.encode64(new Uint8Array(32).fill(1))};}
    else if(stage==="expected"){f.options.expected=stall;resolution={};}
    else if(stage==="complete-save"){const save=f.options.persistence.save;f.options.persistence.save=value=>value.status==="COMPLETE"?stall():save(value);}
    else {const name={manifest:"verifyManifest",page:"verifyPage",assemble:"assemble"}[stage];f.options.verifier[name]=stall;resolution={verified:true,value:{page_count:1,index:0,syntheticEvidence:true}};}
    const running=f.create().run();await until(()=>entered);f.advance(LIMITS.attemptMs+1);f.fire(LIMITS.attemptMs);
    const result=await running;assert.equal(result.complete,false);assert.equal(result.checkpoint,false);const prior=f.stages.slice();
    d.resolve(resolution);await tick();assert.deepEqual(f.stages,prior);assert.equal(result.complete,false);assert.equal(f.timers.size,0);
  });
}
test("ordinary refresh retains established truth, with no storage-loss recommendation or checkpoint", async()=>{
  const local={truth:{synthetic:true},knownStates:[17,19,20],outbox:["unchanged"]};const before=structuredClone(local);
  const f=fixture({context:"REFRESH",fetchPage:async()=>({status:503,body:{error:{code:"UNAVAILABLE",retryable:true}}})});
  const result=await f.create().run();assert.equal(result.complete,false);assert.equal(Object.hasOwn(result,"recoveryState"),false);
  assert.equal(result.checkpoint,false);assert.equal(result.preserveKnownStates,true);assert.deepEqual(local,before);
});
test("final persistence resolving after monotonic deadline cannot outrun queued timer and return completion",async()=>{
  const f=fixture(),save=f.options.persistence.save;
  f.options.persistence.save=async value=>{if(value.status==="COMPLETE")f.advance(LIMITS.attemptMs+1);return save(value);};
  const result=await f.create().run();assert.equal(result.complete,false);assert.equal(result.checkpoint,false);
});
test("late COMPLETE bookkeeping write after timeout cannot authorize success or implicit reopened progress",async()=>{
  const f=fixture(),save=f.options.persistence.save,d=deferred();let entered=false,fetches=0;
  const fetch=f.options.fetchPage;f.options.fetchPage=async body=>{fetches++;return fetch(body);};
  f.options.persistence.save=value=>{if(value.status!=="COMPLETE")return save(value);entered=true;return d.promise.then(()=>save(value));};
  const running=f.create().run();await until(()=>entered);f.advance(LIMITS.attemptMs+1);f.fire(LIMITS.attemptMs);
  const result=await running;assert.equal(result.complete,false);assert.equal(result.checkpoint,false);
  d.resolve();await until(()=>f.saved()?.status==="COMPLETE");
  const callsBefore=fetches,reopened=await f.create().run();assert.equal(reopened.complete,false);
  assert.equal(reopened.reason,"EXPLICIT_RETRY_REQUIRED");assert.equal(fetches,callsBefore);assert.equal(result.evidence,undefined);
  // COMPLETE is bookkeeping, never a recovered checkpoint/verified proof.
  // A real W6 persistence adapter must serialize/CAS transport writes and check
  // the captured session before exposing marker status in UI; K1 and its atomic
  // positive sink remain separate. This deliberately adversarial adapter has
  // no CAS, proving even a surviving late COMPLETE cannot permit implicit work.
});
for(const state of [17,19,20])test("restore recommendation does not replace caller's independently known state "+state,async()=>{
  const local={knownStates:new Set([state]),truth:{synthetic:true}};const f=fixture({fetchPage:async()=>({status:403,body:{error:{state:17}}})});
  const result=await f.create().run();assert.equal(result.recoveryState,18);assert.equal(result.preserveKnownStates,true);
  // Deliberately tiny caller policy model: recommendation applies only absent an
  // independent fence. This does not stand in for W6's durable state reducer.
  const display=local.knownStates.size?[...local.knownStates][0]:result.recoveryState;
  assert.equal(display,state);assert.deepEqual([...local.knownStates],[state]);assert.equal(result.checkpoint,false);
});
test("authenticated new-route provider failure has typed retryable503; old route stays unchanged",async()=>{
  const {createWorker}=require("../worker.cjs"),{testIssuer}=require("../../rigs/rig190.cjs"),{generateSigningKey}=require("../crypto.cjs");
  const issuer=testIssuer(),authorityKey=generateSigningKey("boundary-audit"),failure=async()=>{throw Error("synthetic internal detail");};
  const worker=createWorker({bridge:{enrollScoped:failure,invokeScoped:failure},authorityKey,auth:issuer.config,clock:()=>"2026-09-04T16:00:00.000Z"});
  for(const route of ["/enrol/create","/enrol"]){const body=route==="/enrol/create"?{intent_id:"audit-intent",schema_version:1,nonce:C.encode64(new Uint8Array(32).fill(1))}:{device_id:"device-a"};
    const response=await worker.fetch(new Request("https://worker.invalid"+route,{method:"POST",headers:{Origin:issuer.config.origins[0],Authorization:"Bearer "+issuer.token("synthetic-subject"),"Content-Type":"application/json"},body:JSON.stringify(body)}));
    assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:{code:"UNAVAILABLE",...(route==="/enrol/create"?{retryable:true}:{})}});assert.match(response.headers.get("cache-control"),/no-store/);}
});
