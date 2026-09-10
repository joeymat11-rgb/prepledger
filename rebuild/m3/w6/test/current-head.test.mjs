import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { webcrypto, randomBytes } from "node:crypto";
import { createDurablePublicClient } from "../public-client.mjs";
import { openRepository } from "../repository.mjs";
import { verifyHistoricalHead } from "../history-proof.mjs";
import { config, initial, fixture, faultDatabase, deferred, createT2Stage, O } from "./support.mjs";
const require=createRequire(import.meta.url), Sign=require("../../w5/crypto.cjs"), W5=require("../../w5/public-client.cjs"), Ops=require("../../../client/ops.cjs");
const copy=value=>structuredClone(value), now="2026-09-04T16:00:00.000Z";
const supported=typeof Sign.signCurrentHead==="function";
// Ordinary W6-only regressions retain the old dependency; the tracked composition
// runner supplies exact R1 d26795a. An absent protocol is NOT a passed new test.
if(!supported)throw Error("CURRENT_HEAD_DEPENDENCY_MISSING: run test/run-current-head.cjs with pinned R1");

async function setup(options={}) {
  const f=await fixture(options.repository||{}), key=Sign.generateSigningKey("head-store-run"), publicKey=Sign.publicKeyOf(key);
  const lease=Sign.signLease({...O.lease("dev-A"),signature:undefined},key);
  const generation=initial(); generation.metadata.authorityLease=lease;
  await f.repo.initialize(generation,"synthetic-enrollment-only");
  const state={session:1,observation:1}, args={repository:f.repo,stage:createT2Stage(config,{allowInbound:true}),
    namespace:f.setup.namespace,athleteId:"ath-1",deviceId:"dev-A",sessionEpoch:1,
    isCurrentSession:value=>value===state.session,observationEpoch:()=>state.observation,
    observationGuard:{run:async(_kind,action)=>action()}, // Explicit synthetic control, not a K1 fence.
    validateCommit:()=>null,keys:[publicKey],crypto:webcrypto,...options.client};
  const c=createDurablePublicClient(args);
  const receipt=(id="remote-1",seq=1)=>{
    const op=Ops.build({op_id:id,athlete_id:"ath-1",device_id:"dev-B",device_seq:seq,parents:[],kind:"fact",class:"reading",
      effective:{local_date:"2026-09-04",local_time:"12:00",utc_offset:"-04:00"},lease_id:"synthetic-remote-lease",
      payload:{lb:{value:170,unit:"lb"}}},"synthetic-remote-identity");
    return Sign.signReceipt({seq,op_id:id,canonical_content_commitment:op.canonical_content_commitment,op,accepted_at:now},key);
  };
  const envelope=(request,receipts=[])=>Sign.signCurrentHead({...request,athlete_id:"ath-1",head:request.after+receipts.length,
    through:request.after+receipts.length,receipts,wire_version:W5.WIRE_VERSION,key_epoch:publicKey.kid},key);
  const response=body=>({wireVersion:W5.WIRE_VERSION,body});
  const exchange=(receipts=[],request)=>c.exchangeCurrentHead(request|| (q=>response(envelope(q,receipts))),{issuanceAttempt:"workout-attempt-1"});
  return {...f,key,publicKey,lease,state,args,c,receipt,envelope,response,exchange};
}

for(const nonempty of [false,true])test(`real consumer retains exact signed ${nonempty?"nonempty":"empty"} head with outbox and reopens`,async()=>{
  const f=await setup();let fresh;
  try {
    assert.equal((await f.c.execute("weighIn",{lb:171})).acknowledged,true);
    const before=await f.repo.load(),receipts=nonempty?[f.receipt()]:[];let signed;
    const result=await f.exchange(receipts,q=>f.response(signed=f.envelope(q,receipts)));
    assert.equal(result.accepted,true);assert.equal(result.result.confirmed,true);
    assert.equal(result.result.observation.clientRevision,before.revision);
    assert.equal(result.result.observation.issuanceAttempt,"workout-attempt-1");
    fresh=await openRepository(f.setup);const after=await fresh.load();
    assert.equal(after.revision,before.revision+1);
    assert.deepEqual(after.generation.metadata.wireProofs.currentHead[signed.authority_signature],signed);
    assert.deepEqual(after.generation.collections.outbox,before.generation.collections.outbox);
    assert.deepEqual(after.generation.collections.futureCollection,before.generation.collections.futureCollection);
    assert.equal(after.generation.collections.sync.frontier.W,receipts.length);
    if(nonempty)assert.deepEqual(after.generation.collections.ops[receipts[0].op_id],receipts[0].op);
    const reopened=createDurablePublicClient({...f.args,repository:fresh});
    assert.equal((await reopened.reopen()).refusal,null);
    assert.equal(Object.hasOwn(reopened.current(),"observation"),false,"reopen is history, not reconstructed ask-time permission");
    const replay=await reopened.exchangeCurrentHead(()=>f.response(signed),{issuanceAttempt:"new-attempt"});
    assert.equal(replay.accepted,false);assert.equal(replay.state,12);
    assert.equal((await fresh.load()).revision,after.revision);
  }finally{fresh?.close();f.repo.close();}
});

for(const mode of ["quota","abort"])test(`${mode} retains the exact prior encrypted generation and consumes the request`,async()=>{
  const fault=faultDatabase(),f=await setup({repository:{indexedDB:fault.indexedDB}});
  try {
    const before=await f.repo.load();fault.state.armed=true;fault.state.mode=mode;
    if(mode==="abort"){
      const original=f.repo.commit;f.repo.commit=(...args)=>{const pending=original(...args);fault.state.write.promise.then(()=>fault.state.tx.abort());return pending;};
    }
    const result=await f.exchange([f.receipt()]);fault.state.armed=false;
    assert(fault.state.tx,"the intended real write transaction must be reached; an earlier refusal does not exercise this fault");
    assert.equal(result.accepted,false);assert.equal(result.stored,false);assert.deepEqual(await f.repo.load(),before);
  }finally{f.repo.close();}
});

test("held actual transaction releases no confirmed observation until complete",async()=>{
  const fault=faultDatabase(),f=await setup({repository:{indexedDB:fault.indexedDB}});
  try {
    await f.c.reopen();const prior=f.c.current();fault.state.armed=true;fault.state.mode="delay";
    let finished=false,complete=false;const run=f.exchange([f.receipt()]).then(x=>{finished=true;assert.equal(complete,true);return x;});
    await fault.state.write.promise;fault.state.tx.addEventListener("complete",()=>{complete=true;});
    await new Promise(resolve=>setImmediate(resolve));assert.equal(finished,false);assert.deepEqual(f.c.current().view,prior.view);
    assert.equal(f.c.current().refusal,null,"the pending internal command is not a published success or refusal");
    fault.state.release=true;assert.equal((await run).accepted,true);
  }finally{fault.state.release=true;f.repo.close();}
});

test("local writes proceed while HTTP waits; their revision invalidates the captured request",async()=>{
  const f=await setup(),waiting=deferred(),reply=deferred();
  try {
    const run=f.exchange([],async q=>{waiting.resolve(q);return reply.promise;});const request=await waiting.promise;
    assert.equal((await f.c.execute("weighIn",{lb:171})).acknowledged,true);
    const competing=await f.repo.load();reply.resolve(f.response(f.envelope(request)));
    const result=await run;assert.equal(result.accepted,false);assert.equal(result.state,18);
    assert.deepEqual(await f.repo.load(),competing);
  }finally{f.repo.close();}
});

test("actual CAS retry compares the original capture, never the restaged revision",async()=>{
  const f=await setup();let second;let writes=0,stages=0;
  try {
    second=await openRepository(f.setup);const other=createDurablePublicClient({...f.args,repository:second});
    const stage=f.args.stage;const candidate=createDurablePublicClient({...f.args,stage(...args){stages++;return stage(...args);}});
    const original=f.repo.commit.bind(f.repo);let raced=false,competing;
    f.repo.commit=async(...args)=>{writes++;if(!raced){raced=true;assert.equal((await other.execute("weighIn",{lb:172})).acknowledged,true);competing=await second.load();}return original(...args);};
    const result=await candidate.exchangeCurrentHead(q=>f.response(f.envelope(q)),{issuanceAttempt:"fixed-attempt"});
    assert.equal(result.accepted,false);assert.equal(result.state,18);assert.equal(stages,2);assert.equal(writes,2);
    assert.deepEqual(await f.repo.load(),competing);
  }finally{second?.close();f.repo.close();}
});

for(const late of [false,true])test(`${late?"post-validator":"pre-validator"} cancellation cannot publish current-head permission`,async()=>{
  const fault=faultDatabase();let f;
  f=await setup({repository:{indexedDB:fault.indexedDB},client:late?{}:{validateCommit(){f.c.invalidateCurrentHead();return null;}}});
  try {
    const before=await f.repo.load();
    if(late){fault.state.armed=true;fault.state.mode="delay";}
    const pending=f.exchange([f.receipt()]);
    if(late){await fault.state.write.promise;f.c.invalidateCurrentHead();fault.state.release=true;}
    const result=await pending;assert.equal(result.accepted,false);assert.equal(result.state,18);
    const after=await f.repo.load();
    if(late){assert.equal(result.stored,true);assert.equal(after.revision,before.revision+1);assert.equal(f.c.current().view,null);}
    else {assert.equal(result.stored,false);assert.deepEqual(after,before);}
  }finally{fault.state.release=true;f.repo.close();}
});

test("replaced request cannot consume the newer attempt",async()=>{
  const f=await setup(),first=deferred(),release=deferred();
  try {
    const old=f.c.exchangeCurrentHead(async q=>{first.resolve(q);return release.promise;},{issuanceAttempt:"old"});
    const q=await first.promise;
    const next=await f.c.exchangeCurrentHead(q=>f.response(f.envelope(q)),{issuanceAttempt:"new"});
    assert.equal(next.accepted,true);release.resolve(f.response(f.envelope(q)));
    assert.equal((await old).accepted,false);assert.equal((await f.repo.load()).revision,2);
  }finally{f.repo.close();}
});

test("valid outer signature cannot conceal a damaged inner receipt",async()=>{
  const f=await setup();let commits=0;const original=f.repo.commit.bind(f.repo);f.repo.commit=(...args)=>{commits++;return original(...args);};
  try {
    const before=await f.repo.load(),receipt=f.receipt();receipt.op.payload.lb.value=999;
    const result=await f.exchange([receipt]);assert.equal(result.accepted,false);assert.equal(result.state,12);
    assert.equal(commits,0);assert.deepEqual(await f.repo.load(),before);
  }finally{f.repo.close();}
});

test("conflicting retained operation content is not replaced or treated as the same fact",async()=>{
  const f=await setup();
  try {
    const saved=await f.c.execute("weighIn",{lb:171}),before=await f.repo.load();
    const receipt=f.receipt(saved.op_id); // same ID, different authenticated operation content
    const result=await f.exchange([receipt]);assert.equal(result.accepted,false);assert.equal(result.state,18);
    assert.deepEqual(await f.repo.load(),before);
  }finally{f.repo.close();}
});

test("historical family rejects bad shape even under a valid signature and refuses reopen18",async()=>{
  const f=await setup();
  try {
    assert.equal((await f.exchange([f.receipt()])).accepted,true);
    const before=await f.repo.load(),generation=copy(before.generation),proof=Object.values(generation.metadata.wireProofs.currentHead)[0];
    const malformed=Sign.signCurrentHead({...proof,head:2},f.key);
    generation.metadata.wireProofs.currentHead={[malformed.authority_signature]:malformed};
    await f.repo.commit(before,generation,()=>null); // Deliberate authenticated-store fixture corruption.
    const reopened=createDurablePublicClient(f.args);assert.equal((await reopened.reopen()).refusal.state,18);
    const verifier=W5.createPublicVerifier({keys:[f.publicKey]});
    const malformedChallenge=Sign.signCurrentHead({...proof,challenge:"A".repeat(42)+"B"},f.key);
    assert.equal(await verifyHistoricalHead(verifier,malformedChallenge,"ath-1","dev-A"),false);
  }finally{f.repo.close();}
});

test("real scoped local-D1/HTTP producer reaches the actual encrypted consumer",async()=>{
  const {createLocalD1}=require("../../w5/local-d1.cjs"),{createBridge}=require("../../w5/bridge.cjs"),{createWorker}=require("../../w5/worker.cjs");
  const {hostWorker,testIssuer}=require("../../rigs/rig190.cjs");const runtime=await createLocalD1();let host,f;
  try {
    const sql=readFileSync(new URL("../../w5/migrations/0002_reconciliation.sql",import.meta.url),"utf8").replace(/--[^\n]*/g,"");
    const statements=sql.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm);assert.equal(statements.length,6);
    await runtime.db.batch(statements.map(s=>runtime.db.prepare(s)));
    const issuer=testIssuer(),key=Sign.generateSigningKey("head-idb-http"),identity=randomBytes(32).toString("hex");
    const core=require(await require("../../w5/build.cjs").buildCore());
    const bridge=createBridge({db:runtime.db,core,authorityKey:key,identityKeys:{"ath-1":identity},clock:()=>now,
      reconciliationProfile:"earned/r1/v1",r1:{issuer:issuer.config.issuer,origin:issuer.config.origins[0]}});
    await bridge.initializeR1({"ath-1":{plan:{},devices:{}}},{"synthetic-subject":"ath-1"});
    const enrolled=await bridge.enrollScoped("synthetic-subject",{intent_id:"enroll",schema_version:1,nonce:randomBytes(32).toString("base64url")});
    const lease=enrolled.payload.issuance.lease,deviceId=lease.device_id;
    f=await fixture();const generation=initial();generation.metadata.authorityLease=lease;await f.repo.initialize(generation,"synthetic-enrollment-only");
    const cfg=()=>({...config(),deviceId,athleteId:"ath-1",identityKey:identity,lease,clock:{...config().clock,now:()=>now}});
    const client=createDurablePublicClient({repository:f.repo,stage:createT2Stage(cfg,{allowInbound:true}),namespace:f.setup.namespace,
      athleteId:"ath-1",deviceId,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
      observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys:[Sign.publicKeyOf(key)],crypto:webcrypto});
    const local=await client.execute("weighIn",{lb:170});assert.equal(local.acknowledged,true);
    const op=(await f.repo.load()).generation.collections.ops[local.op_id];
    assert.equal((await bridge.invokeScoped("synthetic-subject",deviceId,"admit",["ath-1",op])).status,"ACCEPTED");
    host=await hostWorker(createWorker({bridge,authorityKey:key,auth:issuer.config,clock:()=>now}));
    let wire;
    const result=await client.exchangeCurrentHead(async request=>{
      const response=await fetch(host.url+"/pull",{method:"POST",headers:{"Content-Type":"application/json",Origin:issuer.config.origins[0],Authorization:"Bearer "+issuer.token("synthetic-subject")},body:JSON.stringify(request)});
      assert.equal(response.status,200);wire=await response.json();return {wireVersion:W5.WIRE_VERSION,body:wire};
    },{issuanceAttempt:"real-http-attempt"});
    assert.equal(result.accepted,true);const stored=await f.repo.load();assert.equal(stored.generation.collections.sync.frontier.W,1);
    assert.deepEqual(stored.generation.metadata.wireProofs.currentHead[wire.authority_signature],wire);
    assert.deepEqual(stored.generation.collections.ops[op.op_id],op);
    assert.equal(Object.keys(stored.generation.collections.outbox).length,1,"a receipt is not substituted for the operation disposition");
    console.log("CURRENT-HEAD REAL D1/HTTP/ENCRYPTED-CONSUMER PASS");
  }finally{if(host)await host.close();f?.repo.close();await runtime.close();}
});
