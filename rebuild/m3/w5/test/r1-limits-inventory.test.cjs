"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {randomBytes,webcrypto}=require("node:crypto");
const {createR1Runtime}=require("./r1-workerd.cjs");
const {build}=require("../../../client/ops.cjs");
const {publicKeyOf,signatureOver}=require("../crypto.cjs");
const {createR1Verifier}=require("../reconciliation/verify.cjs");
const C=require("../reconciliation/codec.cjs"),P=require("../reconciliation/project.cjs");
const nonce=()=>randomBytes(32).toString("base64url");
async function fixture(t){
  const r=await createR1Runtime();t.after(()=>r.close());
  await r.bridge.initializeR1({first:{plan:{steps:8000},devices:{}}},{"subject-first":"first"});
  const enrolled=await r.request("/enrol/create",{intent_id:"limits-device",schema_version:1,nonce:nonce()});
  assert.equal(enrolled.status,200);const issuance=C.parse(C.decode64(enrolled.body.data_b64)).issuance;
  r.device=issuance.lease.device_id;r.lease=issuance.lease;
  r.scope=C.scopeDigest({issuer:r.issuer.config.issuer,subject:"subject-first",origin:r.issuer.config.origins[0],athleteId:"first",actorDeviceId:r.device});
  r.op=(seq,padding=0,extra={})=>build({op_id:"limit-op-"+seq,athlete_id:"first",device_id:r.device,device_seq:seq,
    predecessor:null,parents:[],class:"reading",kind:"fact",lease_id:r.lease.lease_id,
    effective:{local_date:"2026-09-04",local_time:"12:00",utc_offset:"-04:00"},payload:{lb:{value:160,unit:"lb"},note:"caf\u00e9",padding:"x".repeat(padding)},...extra},r.identityKeys.first);
  r.verifier=createR1Verifier({keys:[publicKeyOf(r.authorityKey)],subtle:webcrypto.subtle});return r;
}
function request(claims=[]){return {version:C.REQUEST_VERSION,mode:"ACCOUNT_RECOVERY",nonce:nonce(),context_id:nonce(),claims,requested_lease_ids:[]};}
async function proof(r,claims=[]){
  const q=request(claims),qb=C.encode(q),wire={device_id:r.device,request_b64:C.encode64(qb),continuation:null,page_index:0};
  const first=await r.request("/reconcile",wire);assert.equal(first.status,200,first.body.error?.code);
  const mb=C.decode64(first.body.manifest_b64),m=C.parse(mb),pages=[C.encode(first.body.page)];
  for(let i=1;i<m.page_count;i++){const next=await r.request("/reconcile",{...wire,continuation:first.body.manifest_b64,page_index:i});assert.equal(next.status,200);pages.push(C.encode(next.body.page));}
  const expected={nonce:q.nonce,contextId:q.context_id,requestDigest:C.hash("request",qb),scopeDigest:r.scope,
    athleteId:"first",actorDeviceId:r.device,mode:q.mode,basisDigest:C.hash("request","synthetic-local-inventory"),sessionEpoch:1};
  const verified=await r.verifier.assemble(mb,pages,qb,expected);assert.equal(verified.verified,true,verified.code);return {q,qb,mb,pages,expected,...verified.value};
}

test("T07 maximum original W5 operation fits the encoded recovery wrapper and exact replay",async t=>{
  const r=await fixture(t);let op=r.op(1),body={device_id:r.device,operation:op};
  op=r.op(1,262144-Buffer.byteLength(JSON.stringify(body)));body={device_id:r.device,operation:op};
  assert.equal(Buffer.byteLength(JSON.stringify(body)),262144);
  const envelope=C.encode(op),wrapped={device_id:r.device,envelope_b64:C.encode64(envelope),nonce:nonce()};
  assert(Buffer.byteLength(JSON.stringify(wrapped))<C.LIMITS.request);
  // First delivery uses the new path; the immutable original envelope remains
  // unchanged. A second delivery must retain its one terminal effect.
  const first=await r.request("/recovery/replay",wrapped);assert.equal(first.status,200,first.body.error?.code);
  const again=await r.request("/recovery/replay",{...wrapped,nonce:nonce()});assert.equal(again.status,200,again.body.error?.code);
  const payload=x=>C.parse(C.decode64(x.body.data_b64));
  assert.equal(payload(first).disposition_bytes_b64,payload(again).disposition_bytes_b64);
  const ordinary=await r.request("/op",body);assert.equal(ordinary.status,200);assert.equal(ordinary.body.disposition.status,"ACCEPTED");
  assert.equal(await r.bridge.invoke("frontier",["first"]),1);
});

test("T07 streamed old/new request maxima refuse the first extra byte with unchanged scope and no domain writes",async t=>{
  const r=await fixture(t);
  async function raw(route,size){const core=JSON.stringify({device_id:r.device,intent_id:"padded",schema_version:1,nonce:nonce()});
    const all=Buffer.from(core+" ".repeat(size-Buffer.byteLength(core)));let offset=0;
    const stream=new ReadableStream({pull(c){if(offset===all.length)return c.close();const end=Math.min(all.length,offset+8191);c.enqueue(all.subarray(offset,end));offset=end;}});
    const response=await fetch(new URL(route,r.url),{method:"POST",duplex:"half",headers:{"Content-Type":"application/json",Origin:r.issuer.config.origins[0],Authorization:"Bearer "+r.issuer.token("subject-first")},body:stream});
    return {status:response.status,body:await response.json(),stats:JSON.parse(response.headers.get("x-r1-test-d1"))};}
  const old=await raw("/enrol",262145);assert.equal(old.status,413);assert.equal(old.body.error.code,"REQUEST_TOO_LARGE");
  const modern=await raw("/enrol/create",1048577);assert.equal(modern.status,413);assert.deepEqual(modern.body.error,{code:"RECONCILE_LIMIT",retryable:false});
  assert.equal(old.stats.domainWrites,0);assert.equal(modern.stats.domainWrites,0);
});

test("T07 batched claims cannot replace one final complete snapshot and whole captured inventory match",async t=>{
  const r=await fixture(t),accepted=r.op(1);
  assert.equal((await r.request("/op",{device_id:r.device,operation:accepted})).status,200);
  const contender=r.op(1,0,{op_id:"rejected-contender"});
  assert.equal((await r.request("/op",{device_id:r.device,operation:contender})).body.disposition.status,"REJECTED");
  const alias=structuredClone(accepted);alias.payload.note="cafe\u0301";
  const eventual=r.op(2,0,{predecessor:accepted.op_id,parents:[accepted.op_id]});
  const inventory=[accepted,contender,alias,eventual,...Array.from({length:24},(_,i)=>r.op(i+3,48000))]
    .map((op,i)=>({claim_id:"inventory-"+i,envelope_b64:C.encode64(C.encode(op))}));
  assert(C.encode(request(inventory)).length>C.LIMITS.request);
  const early=await proof(r,inventory.slice(0,8));assert.equal(early.payload.claims[3].outcome,"UNKNOWN_AT_SNAPSHOT");
  assert.equal((await r.request("/op",{device_id:r.device,operation:eventual})).body.disposition.status,"ACCEPTED");
  for(let i=8;i<inventory.length;i+=8)await proof(r,inventory.slice(i,i+8));
  const final=await proof(r),matched=P.matchRetainedClaims(final.payloadBytes,inventory,final.payload.scope);
  assert.equal(matched.ok,true);assert.equal(matched.verified,undefined);assert.equal(matched.claims.length,inventory.length);
  assert.equal(matched.claims[3].outcome,"KNOWN_TERMINAL");assert.equal(matched.claims[1].outcome,"KNOWN_TERMINAL");
  assert.equal(P.readRow(matched.claims[1].stored_operation_row).disposition.status,"REJECTED");
  assert.equal(matched.claims[2].outcome,"ENVELOPE_MISMATCH");assert.equal(matched.claims.at(-1).outcome,"UNKNOWN_AT_SNAPSHOT");
});

test("LOWER-CAP proposal has distinct proof versions; a valid old-domain signature is not an active proof",async t=>{
  const r=await fixture(t),p=await proof(r),old=C.parse(p.mb);
  old.profile="earned/reconcile-manifest/v1";delete old.authority_signature;
  old.authority_signature=signatureOver(old,r.authorityKey,old.profile);
  assert.equal((await r.verifier.verifyManifest(C.encode(old),p.expected)).verified,false);
  assert.throws(()=>C.validateRequest({...p.q,version:"earned/reconcile-request/v1"}));
  assert.equal(C.LIMITS.payload,1048576);assert.equal(C.LIMITS.pages,32);
});
