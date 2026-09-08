'use strict';
// A narrow applicability check, not a gate dispatcher, receipt issuer or execution recorder.
// Non-file observations remain the independent verifier's responsibility. A matching
// Git tree cannot establish runtime, custody, current-service or defect assumptions.
const fs=require('node:fs'),path=require('node:path');
const {createHash}=require('node:crypto');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
let A,L,parseExact;
const PROFILE='D12-RECEIPT-REPORT-SUCCESSOR';
const REPORT='rebuild/m2/REPORT-M2-STEP-EFFICACY-ASTRA.md';
const ENVELOPE='rebuild/conform/v4/postfix/manifest-step-efficacy.json';
const ARTIFACT='rebuild/conform/v4/postfix/acceptance-step-efficacy.json';
const ORIGINAL='0a7abebc71b861a10334f70782d2bea2f729cc4b';
const ARTIFACT_SHA='ff164b8620ee0ab7851e7d9283b32d1b330b261fad1f02178d4266131cfcabb1';
const INTEGRATION='refs/remotes/origin/rebuild/t2-client-core';
const INPUTS=['product','transitive','tests','expectations','build','dependencies','configuration','sourceSelection','fixtureSetup'];
// These fingerprints identify the verifier's actual observations, not claims
// inferred from lockfiles. Unavailable original/current observations are null.
const FACTS=['runtime','toolchain','dependencyResolution','configuration','custody','environment','assumptions','findings'];
const carriers=new Set(['migrate-source','merge-source','writers-source','witnesses-2','witnesses-5','witnesses-7','migrate-differential','second-gate','writers-differential']);
const GATE_IDS=['migrate-source','merge-source','writers-source',...Array.from({length:7},(_,i)=>'witnesses-'+(i+1)),'migrate-differential','merge-differential','writers-differential','merge-laws','migrate-full','second-gate','conformance','selftest','strict'];
const INVOCATIONS=GATE_IDS.flatMap(id=>(carriers.has(id)?id==='second-gate'?['frozen']:id==='writers-differential'?['frozen','native','trap']:['frozen','native']:['command']).map(mode=>id+'/'+mode));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x),commit=x=>typeof x==='string'&&/^[a-f0-9]{40}$/.test(x);
const refusals=new WeakSet();
function reject(code,status='REEXECUTE-REQUIRED'){const error=Object.assign(new Error(code),{applicabilityCode:code,applicabilityStatus:status});refusals.add(error);throw error;}
function keys(o,list){if(!o||Array.isArray(o)||typeof o!=='object'||!equal(Object.keys(o).sort(),[...list].sort()))reject('RECORD-SCHEMA');}
function outcome(status,code){return Object.freeze({profile:PROFILE,status,code});}
function verifyHelperOrigin(targetRoot){
  // The immutable raw artifact is checked with Node crypto before any imported
  // postfix parser/validator is trusted, including when mapping another checkout.
  const bytes=fs.readFileSync(path.join(targetRoot,ARTIFACT));if(sha(bytes)!==ARTIFACT_SHA)reject('D12-ARTIFACT');
  const accepted=JSON.parse(bytes),helperRoot=path.resolve(__dirname,'../..');
  for(const [file,expected]of Object.entries(accepted.executionPins))if(file.startsWith('rebuild/conform/v4/postfix/')){
    if(sha(fs.readFileSync(path.join(helperRoot,file)))!==expected)reject('HELPER-SOURCE-ORIGIN');
  }
  return true;
}
function machinery(){if(A)return;verifyHelperOrigin(path.resolve(__dirname,'../..'));A=require('../conform/v4/postfix/acceptance.cjs');L=require('../conform/v4/postfix/legacy-gates.cjs');({parseExact}=require('../conform/v4/postfix/strict-json.cjs'));}
function anchored(root,revision,anchor){try{L.git(root,['merge-base','--is-ancestor',revision,anchor]);}catch{reject('EVIDENCE-OUTSIDE-TRUSTED-INTEGRATION','UNKNOWN');}}
function ref(r){keys(r,['commit','file','sha256']);if(!commit(r.commit)||!A.relative(r.file)||!hash(r.sha256))reject('PROVENANCE-REFERENCE');}
function readRef(root,r){ref(r);const bytes=L.object(root,r.commit,r.file);if(sha(bytes)!==r.sha256)reject('PROVENANCE-BYTE-PIN');return parseExact(bytes);}
function pins(p){if(!p||typeof p!=='object'||Array.isArray(p)||!Object.keys(p).length||Object.entries(p).some(([f,h])=>!A.relative(f)||!hash(h)))reject('INPUT-INVENTORY','UNKNOWN');}
function evidence(e){
  keys(e,['version','profile','candidate','role','command','status','exitCode','completed','invocations','totals','inputs','observations']);
  if(e.version!==1||e.profile!==PROFILE||!commit(e.candidate)||e.role!=='cowork'||e.command!=='POSTFIX-M2-STEP-EFFICACY')reject('EXECUTION-IDENTITY');
  if(e.status!=='PASS'||e.exitCode!==0||e.completed!==true)reject('EXECUTION-NOT-SUCCESSFUL');
  if(!Array.isArray(e.invocations)||!equal(e.invocations.map(r=>r.id),INVOCATIONS))reject('EXECUTION-INVENTORY');
  for(const r of e.invocations){keys(r,['id','status','exitCode']);if(r.status!=='PASS'||r.exitCode!==0)reject('EXECUTION-INCOMPLETE');}
  if(!equal(e.totals,{gateIdentities:19,invocations:28,raw:180,direct:1180,mutants:68}))reject('EXECUTION-TOTALS');
  keys(e.inputs,INPUTS);for(const k of INPUTS)pins(e.inputs[k]);
  keys(e.observations,FACTS);for(const k of FACTS)if(e.observations[k]!==null&&!hash(e.observations[k]))reject('OBSERVATION-SCHEMA');
}
function compareFiles(root,e,current){
  keys(current,INPUTS);
  for(const k of INPUTS){pins(current[k]);if(!equal(current[k],e.inputs[k]))reject('CHANGED-'+k.toUpperCase());
    L.checkSources(root,e.candidate,e.inputs[k],{disk:false});L.checkSources(root,'HEAD',current[k]);}
}
function sameObservations(old,current){
  keys(current,FACTS);
  for(const k of FACTS){if(old[k]===null||current[k]===null)reject('MISSING-'+k.toUpperCase(),'UNKNOWN');if(!hash(current[k]))reject('OBSERVATION-SCHEMA');if(old[k]!==current[k])reject('CHANGED-'+k.toUpperCase());}
}
function scope(root,original,successor,record,anchor){
  try{L.git(root,['merge-base','--is-ancestor',original,successor]);}catch{reject('SUCCESSOR-ANCESTRY');}
  const changed=L.git(root,['diff','--name-only',original,successor]).toString('utf8').trim().split(/\r?\n/).filter(Boolean);
  // Even Markdown is disallowed unless its semantic scope is independently reviewed.
  if(!equal(changed,record.changedPaths)||changed.some(f=>![REPORT,ENVELOPE,'rebuild/DECISIONS.md'].includes(f)))reject('SUCCESSOR-SCOPE');
  if(record.scope!=='RECEIPT-REPORT-ONLY')reject('SUCCESSOR-SEMANTICS');
  const merges=L.git(root,['rev-list','--merges',original+'..'+successor]).toString('utf8').trim();
  if(merges)reject('MERGED-COMPOSITION-REQUIRES-REEXECUTION');
  if(changed.includes(ENVELOPE)||changed.includes('rebuild/DECISIONS.md')){
    if(record.combined===null)reject('COMBINED-CHECKS-REQUIRED');
    keys(record.combined,['reference','receiptBase','receipt']);const c=record.combined;ref(c.reference);
    anchored(root,c.receiptBase,anchor);anchored(root,c.reference.commit,c.receiptBase);
    L.verifyReceipt(root,c.receiptBase,c.receipt,{role:'integrator'});
    const line=`COMBINED-EVIDENCE ${PROFILE} ${c.reference.commit} ${c.reference.file} ${c.reference.sha256} PASS`;
    if(!c.receipt.line.endsWith(' · integrator · '+line))reject('COMBINED-RECEIPT-CONTENT');
    const result=readRef(root,c.reference);keys(result,['candidate','role','status','exitCode','checks','environment']);
    if(result.candidate!==successor||result.role!=='integrator'||result.status!=='PASS'||result.exitCode!==0||!equal(result.checks,['receipt','scope','affected-combined-build'])||result.environment!==record.currentObservations.environment)reject('COMBINED-CHECKS-INVALID');
  }else if(record.combined!==null)reject('UNEXPECTED-COMBINED-CLAIM');
}
// Protocol-level verification is also exported for synthetic Git fixtures. It
// is not the production entry point: assessD12 additionally checks real D12
// artifact/source/receipt bindings. Its local remote-ref trust premise is the
// existing independently verified integration process, not a Git author label.
// This offline function cannot establish that the remote ref is currently fresh.
function verifyReviewedEvidence({root,reviewBase,receipt,recordRef,successor}){
  try{
    machinery();
    if(!receipt||!recordRef)reject('VERIFIER-PROVENANCE-MISSING','UNKNOWN');
    if(!commit(reviewBase)||!commit(successor))reject('COORDINATES');
    const actualRoot=fs.realpathSync(L.git(root,['rev-parse','--show-toplevel']).toString().trim());
    if(fs.realpathSync(root)!==actualRoot||L.git(root,['rev-parse','HEAD']).toString().trim()!==successor)reject('WRONG-CHECKOUT');
    let anchor;try{anchor=L.git(root,['rev-parse','--verify',INTEGRATION+'^{commit}']).toString().trim();}catch{reject('TRUSTED-INTEGRATION-MISSING','UNKNOWN');}
    anchored(root,reviewBase,anchor);anchored(root,recordRef.commit,reviewBase);
    ref(recordRef);L.verifyReceipt(root,reviewBase,receipt,{role:'cowork'});
    const line=`EVIDENCE-APPLICABILITY ${PROFILE} ${recordRef.commit} ${recordRef.file} ${recordRef.sha256} ACCEPTED`;
    if(!receipt.line.endsWith(' · cowork · '+line))reject('VERIFIER-RECEIPT-CONTENT');
    const r=readRef(root,recordRef);
    keys(r,['version','profile','originalEvidence','successor','inputs','currentObservations','changedPaths','scope','combined']);
    if(r.version!==1||r.profile!==PROFILE||r.successor!==successor)reject('RECORD-IDENTITY');
    anchored(root,r.originalEvidence.commit,reviewBase);const e=readRef(root,r.originalEvidence);evidence(e);
    anchored(root,e.candidate,r.originalEvidence.commit);
    compareFiles(root,e,r.inputs);sameObservations(e.observations,r.currentObservations);scope(root,e.candidate,successor,r,anchor);
    return outcome('REUSE-ELIGIBLE','VERIFIED-APPLICABILITY');
  }catch(error){return outcome(refusals.has(error)?error.applicabilityStatus:'UNKNOWN',refusals.has(error)?error.applicabilityCode:'PROVENANCE-VALIDATION-FAILED');}
}
function validateD12(root){
  verifyHelperOrigin(root);machinery();
  const loaded=A.load(root,path.join(root,ENVELOPE));
  if(loaded.envelope.acceptanceSha256!==ARTIFACT_SHA||A.profile(loaded.acceptance).id!=='M2-STEP-EFFICACY')reject('D12-ARTIFACT');
  if(!A.verifyReceipts(root,loaded.acceptance,loaded.envelope,loaded.bytes))reject('D12-REVIEW-PENDING');
  require('../conform/v4/postfix/package-runner.cjs').checkPins(root,loaded.acceptance);
  require('../conform/v4/postfix/source-proof.cjs').verifyProductSources({root,baseline:root,acceptance:loaded.acceptance,gitHead:true});
  return loaded;
}
function refreshReviewedEvidence(args){
  if(!args.recordRef||!args.receipt)return outcome('UNKNOWN','VERIFIER-PROVENANCE-MISSING');
  try{machinery();A.fetchIntegration(args.root);}catch{return outcome('UNKNOWN','INTEGRATION-FETCH-FAILED');}
  return verifyReviewedEvidence(args);
}
function assessD12(args){
  try{
    const {acceptance:a}=validateD12(args.root);
    if(!args.recordRef||!args.receipt)return outcome('UNKNOWN','ORIGINAL-RUNTIME-CUSTODY-PROVENANCE-MISSING');
    const r=readRef(args.root,args.recordRef),e=readRef(args.root,r.originalEvidence);evidence(e);
    if(e.candidate!==ORIGINAL)reject('D12-ORIGINAL-EXECUTION');
    const required={...a.baseline.publicPins,...a.executionPins,...Object.fromEntries(Object.entries(a.candidateEngine).map(([p,h])=>['rebuild/engine/'+p,h]))};
    const combined=Object.assign({},...Object.values(e.inputs));
    if(Object.entries(required).some(([p,h])=>combined[p]!==h))reject('D12-INPUT-COVERAGE','UNKNOWN');
    // No caller fresh:true escape: only the existing bounded integration fetch
    // refreshes the fixed origin ref. The no-record mapping above is read-only.
    return refreshReviewedEvidence(args);
  }catch(error){return outcome(refusals.has(error)?error.applicabilityStatus:'UNKNOWN',refusals.has(error)?error.applicabilityCode:'D12-MAPPING-UNPROVEN');}
}
function publicLine(r){return `D12 EVIDENCE APPLICABILITY ${['REUSE-ELIGIBLE','REEXECUTE-REQUIRED','UNKNOWN'].includes(r.status)?r.status:'UNKNOWN'}`;}
if(require.main===module){
  const args=process.argv.slice(2);
  if(args.length!==3||args[0]!=='--map-d12'||args[1]!=='--root'){console.log('D12 EVIDENCE APPLICABILITY UNKNOWN');process.exitCode=2;}
  else{const result=assessD12({root:path.resolve(args[2])});console.log(publicLine(result));process.exitCode=result.status==='REUSE-ELIGIBLE'?0:2;}
}
module.exports={PROFILE,INPUTS,FACTS,INVOCATIONS,verifyHelperOrigin,verifyReviewedEvidence,refreshReviewedEvidence,assessD12,publicLine};
