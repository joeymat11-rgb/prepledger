'use strict';
/* INDEPENDENT reviewer challenges for the proposed challenge-bound CURRENT-HEAD mode.
   Drives the REAL public consumer boundary (rebuild/m3/w5/public-client.cjs) with envelopes
   from the REAL signer (rebuild/m3/w5/crypto.cjs). Synthetic keys/state only; public tracked
   code only; no private data, no D1/HTTP/IDB, no source modification.
   Usage: node w5-currenthead-challenges.cjs <checkout> */
const path=require('node:path'),{webcrypto}=require('node:crypto');
const CO=path.resolve(process.argv[2]);
const W5=require(path.join(CO,'rebuild/m3/w5/public-client.cjs'));
const Signer=require(path.join(CO,'rebuild/m3/w5/crypto.cjs'));
const out=[];const rec=(id,c,pass,d)=>out.push({id,c,pass,d});
const ATH='ath-1',DEV='dev-A';
const sk=Signer.generateSigningKey('w5-review'),pk=Signer.publicKeyOf(sk);
const sink=()=>{const s={calls:[]};return {s,client:Object.freeze({
  deliverDisposition:r=>{s.calls.push(['disposition',r]);return{stored:true,durable:true};},
  deliverReceipts:r=>{s.calls.push(['receipts',r]);return{stored:true,durable:true};},
  receiveSnapshot:r=>{s.calls.push(['snapshot',r]);return{stored:true,durable:true};},
  receiveLease:r=>{s.calls.push(['lease',r]);return{stored:true,durable:true};},
  syncedServerTime:r=>{s.calls.push(['time',r]);return{stored:true,durable:true};}})};};
function boundary(){const {s,client}=sink();
  return {s,b:W5.createPublicBoundary({keys:[pk],athleteId:ATH,deviceId:DEV,subtle:webcrypto.subtle,
    crypto:webcrypto,monotonicMs:()=>Date.now(),maxTimeRoundTripMs:30000,schemaVersion:1,client})};}
const COMMIT=seq=>String(seq).padStart(64,'c');
const receipt=seq=>Signer.signReceipt({seq,op_id:'op-'+seq,canonical_content_commitment:COMMIT(seq),
  accepted_at:'2026-09-04T00:00:00Z',
  op:{op_id:'op-'+seq,athlete_id:ATH,device_id:DEV,seq,canonical_content_commitment:COMMIT(seq)}},sk);
const pull=(after,through)=>Signer.signPull({wire_version:W5.WIRE_VERSION,key_epoch:pk.kid,athlete_id:ATH,
  device_id:DEV,after,through,receipts:Array.from({length:through-after},(_,i)=>receipt(after+i+1))},sk);
const snapshot=W=>Signer.signSnapshot({wire_version:W5.WIRE_VERSION,key_epoch:pk.kid,athlete_id:ATH,device_id:DEV,
  W,partial:false,pending:0,records:W,entries:Array.from({length:W},(_,i)=>receipt(i+1)),
  label:`Complete through W${W} for all synced records`,rejectedAppendix:[],otherDeviceNote:null},sk);

(async()=>{
// P1 POSITIVE CONTROL — a correctly signed pull verifies and reaches the sink.
{const {s,b}=boundary();const r=await b.acceptPull(pull(0,3));
 rec('P1','correctly signed pull verifies and forwards to sink',
   s.calls.length===1&&s.calls[0][0]==='receipts',`sink=${JSON.stringify(s.calls.map(c=>c[0]))} r=${JSON.stringify(r).slice(0,70)}`);}

// A1 — DISPROOF (a): a fresh signed TIME does not bind any pull. An OLD pull still verifies
//      identically afterwards; acceptPull has no challenge state at all.
{const {s,b}=boundary();
 const {challenge}=b.beginTimeChallenge();
 const t=Signer.signServerTime({wire_version:W5.WIRE_VERSION,time_profile:'earned/challenge-time/v1',
   key_epoch:pk.kid,athlete_id:ATH,device_id:DEV,challenge,server_time:'2026-09-08T00:00:00Z'},sk);
 const tr=await b.acceptServerTime(t);
 const stale=pull(0,3);                       // signed long "before"; never re-fetched
 const r1=await b.acceptPull(stale), r2=await b.acceptPull(stale);   // replayed twice
 const timeKeys=Object.keys(t).sort().join(',');
 rec('A1','fresh signed time does not bind a pull; the same old pull replays unchanged',
   s.calls.filter(c=>c[0]==='time').length===1&&s.calls.filter(c=>c[0]==='receipts').length===2&&
   !/through|after|receipt|digest|frontier/.test(timeKeys),
   `timeAccepted=${!!tr} pullAcceptedTimes=${s.calls.filter(c=>c[0]==='receipts').length} timeSignedKeys=[${timeKeys}]`);}

// A2 — the pull envelope itself carries no challenge/purpose field to match against.
{const p=pull(0,3);const keys=Object.keys(p).sort();
 rec('A2','pull envelope has no challenge/purpose/profile field',
   !keys.some(k=>/challenge|purpose|profile|nonce/.test(k)),`pullSignedKeys=[${keys.join(',')}]`);}

// B1 — DISPROOF (b): snapshot W is the REQUESTED watermark, not the head. A snapshot at W=3 is
//      accepted while the true head is 7; nothing in it can express "this is the head".
{const {s,b}=boundary();const trueHead=7,requested=3;
 const r=await b.acceptSnapshot(snapshot(requested),requested);
 const snapKeys=Object.keys(snapshot(requested)).sort();
 rec('B1','requested-W snapshot verifies while the true head is higher; no head field exists',
   s.calls.some(c=>c[0]==='snapshot')&&!snapKeys.some(k=>/head/.test(k)),
   `sinkAccepted=${s.calls.some(c=>c[0]==='snapshot')} requestedW=${requested} trueHead=${trueHead} snapshotSignedKeys=[${snapKeys.join(',')}]`);}

// C1 — DISPROOF (c) part 1: bolting an UNSIGNED nonce onto a pull breaks nothing and binds
//      nothing — the verifier has no field to check, so the replay still succeeds.
{const {s,b}=boundary();const p=pull(0,3);p.client_nonce='unpredictable-22-chars-abc';
 const r=await b.acceptPull(p);
 // Reviewer note: the initial hypothesis was that acceptPull would IGNORE the extra field.
 // Observed behaviour is stricter and is the correct claim: canonicalization covers every
 // field, so a client-added nonce invalidates the signature outright.
 rec('C1','client-added nonce is NOT ignored: it changes canonical bytes and the pull fails verification',
   !s.calls.some(c=>c[0]==='receipts'),`sinkAccepted=${s.calls.some(c=>c[0]==='receipts')} (extra field breaks canonicalization, not ignored)`);}

// C2 — DISPROOF (c) part 2: if instead the nonce is added to the SIGNED object without the
//      producer signing it, the signature fails — proving only a producer-signed echo can bind.
{const {s,b}=boundary();const p=pull(0,3);const forged={...p,challenge:'client-chosen-nonce'};
 const r=await b.acceptPull(forged);
 rec('C2','nonce inserted into the signed object without producer signing fails verification',
   !s.calls.some(c=>c[0]==='receipts'),`sinkAccepted=${s.calls.some(c=>c[0]==='receipts')} sinkCalls=${s.calls.length}`);}

// D1 — DOMAIN REUSE HAZARD: a current-head-shaped envelope signed under the EXISTING pull domain
//      is consumed by the legacy acceptPull, losing the currentness binding silently.
{const {s,b}=boundary();
 const ch=Signer.signPull({wire_version:W5.WIRE_VERSION,key_epoch:pk.kid,athlete_id:ATH,device_id:DEV,
   after:0,through:3,receipts:[receipt(1),receipt(2),receipt(3)],
   challenge:'server-echoed-nonce-2222222',head:3,purpose:'current-head'},sk);
 const r=await b.acceptPull(ch);
 rec('D1','current-head-shaped envelope signed under DOMAINS.pull is accepted by legacy acceptPull',
   s.calls.some(c=>c[0]==='receipts'),`sinkAccepted=${s.calls.some(c=>c[0]==='receipts')} → argues for a DISTINCT signature domain + in-payload profile`);}

// MUT — the challenge echo is load-bearing: a mutant verifier that skips it accepts a replay.
{const fs=require('node:fs'),os=require('node:os');
 const src=fs.readFileSync(path.join(CO,'rebuild/m3/w5/public-client.cjs'),'utf8');
 const anchor='record.challenge !== challenge.challenge ||';
 const applied=src.includes(anchor);
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'w5mut-'));const f=path.join(tmp,'mut.cjs');
 const abs=path.join(CO,'rebuild/authority/canonical.cjs').replace(/\\/g,'/');
 fs.writeFileSync(f,src.replace(anchor,'false ||').replace('require("../../authority/canonical.cjs")','require("'+abs+'")'));
 const M=require(f);const {s,client}=sink();
 const mb=M.createPublicBoundary({keys:[pk],athleteId:ATH,deviceId:DEV,subtle:webcrypto.subtle,crypto:webcrypto,
   monotonicMs:()=>Date.now(),maxTimeRoundTripMs:30000,schemaVersion:1,client});
 mb.beginTimeChallenge();
 const foreign=Signer.signServerTime({wire_version:M.WIRE_VERSION,time_profile:'earned/challenge-time/v1',
   key_epoch:pk.kid,athlete_id:ATH,device_id:DEV,challenge:'A-DIFFERENT-CHALLENGE-2222',server_time:'2026-09-08T00:00:00Z'},sk);
 const mres=await mb.acceptServerTime(foreign);
 const {s:s2,b:rb}=boundary();rb.beginTimeChallenge();
 const rres=await rb.acceptServerTime(foreign);
 rec('MUT','challenge echo is load-bearing: mutant accepts a foreign-challenge time proof, real code refuses',
   applied&&s.calls.some(c=>c[0]==='time')&&!s2.calls.some(c=>c[0]==='time'),
   `anchorApplied=${applied} mutantAccepted=${!!mres&&s.calls.some(c=>c[0]==='time')} realAccepted=${s2.calls.some(c=>c[0]==='time')}`);
 fs.rmSync(tmp,{recursive:true,force:true});}

for(const r of out)console.log((r.pass?'CONFIRMED     ':'NOT-CONFIRMED ')+r.id.padEnd(4)+' '+r.c+'\n              :: '+r.d);
const bad=out.filter(r=>!r.pass).length;
console.log('\nW5 CURRENT-HEAD CHALLENGE SUMMARY: '+out.length+' claims; '+(out.length-bad)+' confirmed; '+bad+' not confirmed');
process.exitCode=bad?1:0;
})();
