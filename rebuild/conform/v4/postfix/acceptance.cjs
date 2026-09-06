'use strict';
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {parseExact}=require('./strict-json.cjs');
const {sha,fail}=require('./target.cjs');
const L=require('./legacy-gates.cjs');
const FILE='rebuild/conform/v4/postfix/acceptance-import-guards.json';
const BASE=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json')));
const REQUIRED=['D33','D34','D35'];
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x),commit=x=>typeof x==='string'&&/^[a-f0-9]{40}$/.test(x);
function keys(o,n,code){if(!o||typeof o!=='object'||Array.isArray(o)||!eq(Object.keys(o).sort(),n.slice().sort()))fail(code);}
function relative(p){return typeof p==='string'&&p.length>0&&!p.includes('\\')&&!p.includes('*')&&!p.split('/').some(x=>x==='.'||x==='..'||x==='')&&!path.isAbsolute(p);}
function pins(o){if(!o||typeof o!=='object'||Array.isArray(o)||!Object.keys(o).length||Object.entries(o).some(([p,h])=>!relative(p)||!hash(h)))fail('PIN-SCHEMA');}
function receipt(r){keys(r,['commit','path','line','lineSha256'],'RECEIPT-SCHEMA');if(!commit(r.commit)||r.path!=='rebuild/DECISIONS.md'||typeof r.line!=='string'||!r.line||/[\r\n]/.test(r.line)||!hash(r.lineSha256)||sha(r.line)!==r.lineSha256)fail('RECEIPT-SCHEMA');}
function envelope(e){keys(e,['version','acceptanceFile','acceptanceSha256','candidateBase','receipts'],'ENVELOPE-SCHEMA');if(e.version!==2||e.acceptanceFile!==FILE||!hash(e.acceptanceSha256)||!commit(e.candidateBase))fail('ENVELOPE-SCHEMA');keys(e.receipts,['owner','contract','theme','review'],'ENVELOPE-RECEIPTS');for(const key of ['owner','contract','theme'])receipt(e.receipts[key]);keys(e.receipts.review,['status','receipt'],'REVIEW-SCHEMA');if(!['PENDING','ACCEPTED'].includes(e.receipts.review.status)||(e.receipts.review.status==='PENDING')!==(e.receipts.review.receipt===null))fail('REVIEW-STATUS-CONTRADICTION');if(e.receipts.review.receipt)receipt(e.receipts.review.receipt);return e;}
function delta(d){keys(d,['aliases','cells'],'DELTA-SCHEMA');if(!Array.isArray(d.aliases)||!Array.isArray(d.cells))fail('DELTA-SCHEMA');for(const c of d.cells){keys(c,Object.hasOwn(c,'afterPath')?['id','op','path','afterPath','before','after']:['id','op','path','before','after'],'DELTA-SCHEMA');if(typeof c.id!=='string'||!c.id||!['replace','add','remove'].includes(c.op)||!Array.isArray(c.path)||!c.path.length||c.path.some(k=>typeof k!=='string'||['*','__proto__','prototype','constructor'].includes(k)))fail('DELTA-SCHEMA');if(Object.hasOwn(c,'afterPath')&&(!['replace','remove','add'].includes(c.op)||!Array.isArray(c.afterPath)||c.path.length<3||c.afterPath.length!==c.path.length||c.path[0]!=='frames'||c.afterPath[0]!=='frames'||!/^\d+$/.test(c.path[1])||!/^\d+$/.test(c.afterPath[1])||c.path[1]===c.afterPath[1]||!eq(c.path.slice(2),c.afterPath.slice(2))||(c.op==='replace'&&[c.before,c.after].some(v=>v!==null&&typeof v==='object'))))fail('DELTA-FRAME-CORRESPONDENCE');}}
function expectations(list,matrix){if(!Array.isArray(list))fail('EXPECTATION-SCHEMA');if(list.length&&!eq(list.map(x=>({mode:x.mode,day:x.day})),matrix))fail('EXPECTATION-MATRIX');for(const x of list){keys(x,['mode','day','originalTraceSha256','delta'],'EXPECTATION-SCHEMA');if(!hash(x.originalTraceSha256))fail('EXPECTATION-SCHEMA');delta(x.delta);}}
function assertions(list){if(!Array.isArray(list)||!list.length||new Set(list.map(x=>x.id)).size!==list.length)fail('ASSERTION-INVENTORY');for(const a of list){keys(a,['id','count'],'ASSERTION-SCHEMA');if(typeof a.id!=='string'||!a.id||!Number.isSafeInteger(a.count)||a.count<1)fail('ASSERTION-SCHEMA');}}
function rawExpectations(row,matrix){
  const list=row.rawExpectations;if(!Array.isArray(list)||!eq(list.map(x=>({mode:x.mode,day:x.day})),matrix))fail('RAW-EXPECTATION-MATRIX');
  for(const cell of list){keys(cell,['mode','day','originalStatus','candidateStatus','exception','classification','maskingReason','originalTraceSha256'],'RAW-EXPECTATION-SCHEMA');
    const dated=cell.day==='2026-09-07',d27=dated&&row.defect==='D27',d44=dated&&row.defect==='D44',selected=REQUIRED.includes(row.defect);
    const original=d27?'GREEN':d44?'THROWS':'RED',candidate=selected?'GREEN':original,classification=d27?'GREEN-BY-FIXTURE-DATE':d44?'UNDEFINED-BY-FIXTURE-DATE':'ACCEPTANCE';
    const maskingReason=d27?'logging rung pre-empts break because the dated fixture has gone stale':d44?'sweepVolume returns null on the dated fixture; the law reads agentProposals and throws':null;
    const exception=d44?{name:'TypeError',message:"Cannot read properties of null (reading 'agentProposals')"}:null;
    if(cell.originalStatus!==original||cell.candidateStatus!==candidate||cell.classification!==classification||cell.maskingReason!==maskingReason||!eq(cell.exception,exception)||!hash(cell.originalTraceSha256))fail('RAW-EXPECTATION-OUTCOME');
  }
}
function validate(a){
  keys(a,['version','phase','packageId','codeBaseAnchor','requiredIds','selectedApprovedFixIds','baseline','candidateEngine','contracts','inventory','nonD','sourceChanges','executionPins','caseModule','helperFiles','matrix','gates','authorizations'],'ACCEPTANCE-SCHEMA');
  if(a.version!==2||a.phase!=='PACKAGE'||a.packageId!=='M2-IMPORT-GUARDS'||!commit(a.codeBaseAnchor)||!eq(a.requiredIds,REQUIRED)||!eq(a.selectedApprovedFixIds,REQUIRED))fail('PACKAGE-INVENTORY');
  if(!eq(a.baseline,BASE.baseline))fail('BASELINE-PIN');pins(a.candidateEngine);pins(a.executionPins);
  if(!eq(a.matrix,BASE.matrix)||!eq(a.gates,BASE.gates))fail('GATE-OR-MODE-INVENTORY');
  if(a.caseModule!=='rebuild/conform/v4/postfix/laws/import-guards.cjs')fail('THEME-PATH');
  keys(a.helperFiles,['hosts','frozen'],'HELPER-SCHEMA');for(const k of ['hosts','frozen'])if(!relative(a.helperFiles[k])||!a.helperFiles[k].startsWith('rebuild/conform/v4/postfix/helpers/'))fail('HELPER-PATH');
  if(!Array.isArray(a.contracts)||a.contracts.length!==2)fail('CONTRACT-INVENTORY');for(const c of a.contracts){keys(c,['file','commit','sha256'],'CONTRACT-SCHEMA');if(!relative(c.file)||!commit(c.commit)||!hash(c.sha256))fail('CONTRACT-SCHEMA');}
  if(!eq(a.contracts.map(c=>c.file),['rebuild/m2/BRIEF-POSTFIX-GATE.md','rebuild/m2/BRIEF-IMPORT-GUARDS.md']))fail('CONTRACT-INVENTORY');
  if(a.contracts[0].commit!==BASE.contract.commit||a.contracts[0].sha256!==BASE.contract.sha256||a.contracts[1].commit!=='df5bd1b8682cc5ec2720da67976e8931e19b2cf8'||a.contracts[1].sha256!=='3229d916bcf013c1db9f91e86f174f09c13effdbeb1624f805ecbb9204ef7c6d')fail('CONTRACT-PIN');
  if(!Array.isArray(a.inventory)||a.inventory.length!==45||!eq(a.inventory.map(x=>x.defect),BASE.inventory.map(x=>x.defect)))fail('D-INVENTORY');
  for(let i=0;i<45;i++){
    const r=a.inventory[i],b=BASE.inventory[i];keys(r,['defect','law','disposition','authorization','themeAcceptance','desiredClaim','implementation','dependencies','rawExpectations','sourceDeltas','outputDeltas','cases','mutants'],'D-SCHEMA');
    if(!eq(r.law,b.law)||r.desiredClaim!==b.desiredClaim)fail('RAW-LAW-PIN');
    if(r.disposition!=='APPROVED-FIX'||r.authorization!=='owner'||r.themeAcceptance!==(REQUIRED.includes(r.defect)?'theme':null)||!['PENDING','PRESENT'].includes(r.implementation)||!REQUIRED.includes(r.defect)&&r.implementation!=='PENDING')fail('DISPOSITION-IMPLEMENTATION');
    if(!eq(r.dependencies,b.dependencies))fail('DEPENDENCY-INVENTORY');
    rawExpectations(r,a.matrix);
    for(const k of ['sourceDeltas','outputDeltas','cases','mutants'])if(!Array.isArray(r[k]))fail('CASE-DELTA-SCHEMA');
    if(!REQUIRED.includes(r.defect)&&[r.sourceDeltas,r.outputDeltas,r.cases,r.mutants].some(x=>x.length))fail('UNSELECTED-IMPLEMENTATION');
    const sourceIds={D33:['source-dataLossGuard','binding-_unionCorrLog','binding-_replayCorrections'],D34:['source-isPristineSeed'],D35:['source-migrate']};
    if(r.sourceDeltas.length&&!eq(r.sourceDeltas,sourceIds[r.defect]))fail('SOURCE-DELTA-ID-INVENTORY');
    expectations(r.outputDeltas,a.matrix);
    if(new Set(r.cases.map(c=>c.id)).size!==r.cases.length)fail('CASE-INVENTORY');
    for(const c of r.cases){keys(c,['id','assertions','originalFailures','expectations'],'CASE-SCHEMA');if(typeof c.id!=='string'||!c.id||!Array.isArray(c.originalFailures)||new Set(c.originalFailures).size!==c.originalFailures.length)fail('CASE-SCHEMA');assertions(c.assertions);if(c.originalFailures.some(id=>!c.assertions.some(x=>x.id===id)))fail('CASE-FAILURE-INVENTORY');expectations(c.expectations,a.matrix);}
    for(const m of r.mutants){keys(m,['id','file','declaration','preimageHash','preimage','postimage','postimageHash','expectedFailures','caseId','scope'],'MUTANT-SCHEMA');keys(m.scope,['start','end','sha256'],'MUTANT-SCOPE');if(typeof m.id!=='string'||!m.id||m.file!=='migrate.cjs'||!['dataLossGuard','isPristineSeed','migrate'].includes(m.declaration)||!hash(m.preimageHash)||!hash(m.postimageHash)||!hash(m.scope.sha256)||typeof m.preimage!=='string'||!m.preimage||typeof m.postimage!=='string'||m.preimage===m.postimage||!Array.isArray(m.expectedFailures)||!m.expectedFailures.length||!r.cases.some(c=>c.id===m.caseId))fail('MUTANT-SCHEMA');}
  }
  if(!eq(a.nonD,BASE.nonD))fail('NON-D-INVENTORY');
  if(!Array.isArray(a.sourceChanges))fail('SOURCE-CHANGE-SCHEMA');
  if(a.sourceChanges.length&&!eq(a.sourceChanges.map(s=>s.id),['source-dataLossGuard','source-isPristineSeed','source-migrate','binding-_unionCorrLog','binding-_replayCorrections']))fail('SOURCE-CHANGE-ID-INVENTORY');
  keys(a.authorizations,['owner','contract','theme','review'],'AUTHORIZATION-SCHEMA');
  for(const k of ['owner','contract','theme']){const c=a.authorizations[k];keys(c,['role','line','lineSha256'],'AUTHORIZATION-CLAIM');if(c.role!==(k==='owner'?'owner':'cowork')||typeof c.line!=='string'||!c.line||/[\r\n]/.test(c.line)||!hash(c.lineSha256)||sha(c.line)!==c.lineSha256)fail('AUTHORIZATION-CLAIM');}
  if(a.authorizations.contract.line!==BASE.contract.acceptance.line||a.authorizations.contract.lineSha256!==BASE.contract.acceptance.lineSha256)fail('CONTRACT-AUTHORIZATION-PIN');
  if(!a.authorizations.owner.line.includes(' · owner · M2-RULE —')||a.inventory.some(r=>!new RegExp('\\b'+r.defect+' APPROVED-FIX\\b').test(a.authorizations.owner.line)))fail('OWNER-ID-SCOPE');
  if(!a.authorizations.theme.line.includes(' · cowork · IMPORT-GUARDS BRIEF THEME ACCEPTANCE —')||!a.authorizations.theme.line.includes(a.contracts[1].commit)||!a.authorizations.theme.line.includes(a.contracts[1].sha256)||!a.authorizations.theme.line.endsWith(' · ACCEPTED'))fail('THEME-AUTHORIZATION-PIN');
  keys(a.authorizations.review,['role','prefix','terminal'],'REVIEW-CLAIM');if(!eq(a.authorizations.review,{role:'cowork',prefix:'POSTFIX-ACCEPTANCE M2-IMPORT-GUARDS',terminal:'ACCEPTED'}))fail('REVIEW-CLAIM');
  return a;
}
function ancestry(root,a,e){
  const ancestor=(x,y)=>{try{L.git(root,['merge-base','--is-ancestor',x,y]);return true;}catch{return false;}};
  if(!ancestor(a.codeBaseAnchor,'HEAD')||!ancestor(e.candidateBase,'HEAD')||!ancestor(a.codeBaseAnchor,e.candidateBase)||!ancestor(e.candidateBase,'refs/remotes/origin/rebuild/t2-client-core'))fail('CANDIDATE-BASE-STALE');
  const files=L.git(root,['diff','--name-only',a.codeBaseAnchor,e.candidateBase]).toString().trim().split(/\r?\n/).filter(Boolean);
  const allowed=p=>p==='rebuild/DECISIONS.md'||p==='rebuild/QUEUE.md'||p==='rebuild/ROADMAP.md'||/^rebuild\/m2\/[^/]+\.md$/.test(p);
  if(files.some(p=>!allowed(p)||Object.hasOwn(a.baseline.publicPins,p)))fail('RECEIPT-BASE-EXECUTABLE-CHANGE');
}
function fetchIntegration(root){
  try{execFileSync('git',['fetch','--no-tags','origin','rebuild/t2-client-core:refs/remotes/origin/rebuild/t2-client-core'],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:1024*1024,env:{...process.env,GIT_TERMINAL_PROMPT:'0'}});}
  catch{fail('INTEGRATION-FETCH-BLOCKED');}
  return L.git(root,['rev-parse','refs/remotes/origin/rebuild/t2-client-core']).toString().trim();
}
function verifyReceipts(root,a,e,bytes){
  for(const key of ['owner','contract','theme']){
    const r=e.receipts[key],claim=a.authorizations[key];if(r.line!==claim.line||r.lineSha256!==claim.lineSha256)fail('AUTHORIZATION-CLAIM-MISMATCH');L.verifyReceipt(root,e.candidateBase,r,{role:claim.role});
    // Source-mapped historical receipts are exact bytes, not verdict substring parsing.
  }
  const review=e.receipts.review;if(review.status==='PENDING')return false;
  const r=review.receipt;L.verifyReceipt(root,e.candidateBase,r,{role:'cowork'});
  // A dedicated terminal field, not prose containing the word ACCEPTED.
  const match=/^(?:- [^\r\n]+ · cowork · )?POSTFIX-ACCEPTANCE M2-IMPORT-GUARDS ([a-f0-9]{40}) (rebuild\/conform\/v4\/postfix\/acceptance-import-guards\.json) ([a-f0-9]{64}) ACCEPTED$/.exec(r.line);
  if(!match||match[2]!==e.acceptanceFile||match[3]!==e.acceptanceSha256)fail('REVIEW-EXACT-VERDICT');
  if(!L.object(root,match[1],match[2]).equals(bytes))fail('REVIEW-ARTIFACT-GIT-PIN');
  return true;
}
function load(root,manifestFile){const e=envelope(parseExact(fs.readFileSync(manifestFile))),bytes=fs.readFileSync(path.join(root,e.acceptanceFile));if(sha(bytes)!==e.acceptanceSha256)fail('ACCEPTANCE-BYTE-PIN');const a=validate(parseExact(bytes));return {envelope:e,acceptance:a,bytes};}
function missing(a){const out=[];for(const id of REQUIRED){const r=a.inventory.find(r=>r.defect===id);if(r.implementation!=='PRESENT')out.push(id+' implementation pending');for(const k of ['cases','mutants','sourceDeltas','outputDeltas'])if(!r[k].length)out.push(id+' '+k+' pending');for(const c of r.cases)if(c.expectations.length!==a.matrix.length)out.push(c.id+' expectation matrix pending');}if(a.sourceChanges.length!==5)out.push('five reviewed source changes pending');return out;}
module.exports={FILE,BASE,REQUIRED,keys,relative,validate,envelope,load,fetchIntegration,ancestry,verifyReceipts,missing,rawExpectations};
