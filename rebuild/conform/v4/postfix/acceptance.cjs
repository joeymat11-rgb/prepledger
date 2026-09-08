'use strict';
const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {parseExact}=require('./strict-json.cjs');
const {sha,fail}=require('./target.cjs');
const L=require('./legacy-gates.cjs');
const FILE='rebuild/conform/v4/postfix/acceptance-import-guards.json';
const BASE=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json')));
const REQUIRED=['D33','D34','D35'];
const STEP_FILE='rebuild/conform/v4/postfix/acceptance-step-efficacy.json';
const STEP_REQUIRED=['D12','D33','D34','D35'];
const ERA_FILE='rebuild/conform/v4/postfix/acceptance-set-one-era.json';
const ERA_REQUIRED=['D30','D12','D33','D34','D35'];
const ERA_ANCHOR='28ff3be3a0c47fa76b642015ac3757da5c76548c';
const ERA_CONTRACT={file:'rebuild/m2/BRIEF-SET-ONE-ERA.md',commit:'75ae6f1f456e4e16682c1fe65e01d17a50fc1205',sha256:'a2e88bed8edf566b4551d9a48b79282b9e367b2fd195bde5f1be41f13baa84b3'};
const ERA_THEME_SHA='2862e7ab8aae34ec2817a9339020ed696959bbaf6cefb32a63d8f1d629d58bf2';
const STEP_PARENT_PIN={artifact:{commit:'904d35ddfb81e1a9b4cfc1d6ccbb50b58651149c',file:STEP_FILE,sha256:'ff164b8620ee0ab7851e7d9283b32d1b330b261fad1f02178d4266131cfcabb1'},candidateCommit:'0a7abebc71b861a10334f70782d2bea2f729cc4b',receiptBase:'348993f71c448f612a6c462a408e56ebea0b6afa',operational:{commit:'0a7abebc71b861a10334f70782d2bea2f729cc4b',file:'rebuild/conform/v4/postfix/manifest-step-efficacy.json',sha256:'7c78a3b85cb8001bd9cf3c0076faa410a203e66cfdd9cde6598e3617a9c648ec'}};
const STEP_CONTRACT={file:'rebuild/m2/BRIEF-STEP-EFFICACY.md',commit:'1e8a074e07ef4cd3cb0c8964ff4211ecf4193c17',sha256:'2a35a0ad0ed124d511a1f8ea9978a05f14fe4f28aab4cd6ce65540d33a694a31'};
const PARENT_PIN={artifact:{commit:'d3fd31d4197083d6c6e1203bb124bb2852f1b50f',file:FILE,sha256:'01b8d0b3e784d0ea65fd565db97c87dd4ebddb045cd91cd94d68c15c92d27329'},candidateCommit:'6703623d123506962bf6be89b21adbb0923920d6',receiptBase:'d3d40713a5910e734e07797c2d39b7ef95cb42b7',operational:{commit:'6703623d123506962bf6be89b21adbb0923920d6',file:'rebuild/conform/v4/postfix/manifest-import-guards.json',sha256:'291b985d7ae14e9597d6963bc58151eea16535eae9e3635da6145a4bccca41ec'}};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x),commit=x=>typeof x==='string'&&/^[a-f0-9]{40}$/.test(x);
function keys(o,n,code){if(!o||typeof o!=='object'||Array.isArray(o)||!eq(Object.keys(o).sort(),n.slice().sort()))fail(code);}
function relative(p){return typeof p==='string'&&p.length>0&&!p.includes('\\')&&!p.includes('*')&&!p.split('/').some(x=>x==='.'||x==='..'||x==='')&&!path.isAbsolute(p);}
function pins(o){if(!o||typeof o!=='object'||Array.isArray(o)||!Object.keys(o).length||Object.entries(o).some(([p,h])=>!relative(p)||!hash(h)))fail('PIN-SCHEMA');}
function receipt(r){keys(r,['commit','path','line','lineSha256'],'RECEIPT-SCHEMA');if(!commit(r.commit)||r.path!=='rebuild/DECISIONS.md'||typeof r.line!=='string'||!r.line||/[\r\n]/.test(r.line)||!hash(r.lineSha256)||sha(r.line)!==r.lineSha256)fail('RECEIPT-SCHEMA');}
function envelope(e){keys(e,['version','acceptanceFile','acceptanceSha256','candidateBase','receipts'],'ENVELOPE-SCHEMA');if(e.version!==2||![FILE,STEP_FILE,ERA_FILE].includes(e.acceptanceFile)||!hash(e.acceptanceSha256)||!commit(e.candidateBase))fail('ENVELOPE-SCHEMA');keys(e.receipts,['owner','contract','theme','review'],'ENVELOPE-RECEIPTS');for(const key of ['owner','contract','theme'])receipt(e.receipts[key]);keys(e.receipts.review,['status','receipt'],'REVIEW-SCHEMA');if(!['PENDING','ACCEPTED'].includes(e.receipts.review.status)||(e.receipts.review.status==='PENDING')!==(e.receipts.review.receipt===null))fail('REVIEW-STATUS-CONTRADICTION');if(e.receipts.review.receipt)receipt(e.receipts.review.receipt);return e;}
function delta(d){keys(d,['aliases','cells'],'DELTA-SCHEMA');if(!Array.isArray(d.aliases)||!Array.isArray(d.cells))fail('DELTA-SCHEMA');for(const c of d.cells){keys(c,Object.hasOwn(c,'afterPath')?['id','op','path','afterPath','before','after']:['id','op','path','before','after'],'DELTA-SCHEMA');if(typeof c.id!=='string'||!c.id||!['replace','add','remove'].includes(c.op)||!Array.isArray(c.path)||!c.path.length||c.path.some(k=>typeof k!=='string'||['*','__proto__','prototype','constructor'].includes(k)))fail('DELTA-SCHEMA');if(Object.hasOwn(c,'afterPath'))require('./structural-delta.cjs').validateAfterPath(c);}}
function expectations(list,matrix){if(!Array.isArray(list))fail('EXPECTATION-SCHEMA');if(list.length&&!eq(list.map(x=>({mode:x.mode,day:x.day})),matrix))fail('EXPECTATION-MATRIX');for(const x of list){keys(x,['mode','day','originalTraceSha256','delta'],'EXPECTATION-SCHEMA');if(!hash(x.originalTraceSha256))fail('EXPECTATION-SCHEMA');delta(x.delta);}}
function assertions(list){if(!Array.isArray(list)||!list.length||new Set(list.map(x=>x.id)).size!==list.length)fail('ASSERTION-INVENTORY');for(const a of list){keys(a,['id','count'],'ASSERTION-SCHEMA');if(typeof a.id!=='string'||!a.id||!Number.isSafeInteger(a.count)||a.count<1)fail('ASSERTION-SCHEMA');}}
function rawExpectations(row,matrix,packageProfile='M2-IMPORT-GUARDS'){
  const selectedIds=profile(packageProfile).required;
  const list=row.rawExpectations;if(!Array.isArray(list)||!eq(list.map(x=>({mode:x.mode,day:x.day})),matrix))fail('RAW-EXPECTATION-MATRIX');
  for(const cell of list){keys(cell,['mode','day','originalStatus','candidateStatus','exception','classification','maskingReason','originalTraceSha256'],'RAW-EXPECTATION-SCHEMA');
    const dated=cell.day==='2026-09-07',d27=dated&&row.defect==='D27',d44=dated&&row.defect==='D44',selected=selectedIds.includes(row.defect);
    const original=d27?'GREEN':d44?'THROWS':'RED',candidate=selected?'GREEN':original,classification=d27?'GREEN-BY-FIXTURE-DATE':d44?'UNDEFINED-BY-FIXTURE-DATE':'ACCEPTANCE';
    const maskingReason=d27?'logging rung pre-empts break because the dated fixture has gone stale':d44?'sweepVolume returns null on the dated fixture; the law reads agentProposals and throws':null;
    const exception=d44?{name:'TypeError',message:"Cannot read properties of null (reading 'agentProposals')"}:null;
    if(cell.originalStatus!==original||cell.candidateStatus!==candidate||cell.classification!==classification||cell.maskingReason!==maskingReason||!eq(cell.exception,exception)||!hash(cell.originalTraceSha256))fail('RAW-EXPECTATION-OUTCOME');
  }
}
function validateImport(a){
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
function verifyReceiptsImport(root,a,e,bytes){
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
function profile(value){const id=typeof value==='string'?value:value?.packageId;if(id==='M2-IMPORT-GUARDS')return {id,file:FILE,required:REQUIRED,newlySelected:REQUIRED,carried:[],sourceCount:5};if(id==='M2-STEP-EFFICACY')return {id,file:STEP_FILE,required:STEP_REQUIRED,newlySelected:['D12'],carried:REQUIRED,sourceCount:6};if(id==='M2-SET-ONE-ERA')return {id,file:ERA_FILE,required:ERA_REQUIRED,newlySelected:['D30'],carried:STEP_REQUIRED,sourceCount:9};fail('PACKAGE-INVENTORY');}
function artifactFile(value){return profile(value).file;}
function envelopeFile(value){return artifactFile(value).replace('/acceptance-','/manifest-');}
function requiredIds(value){return profile(value).required.slice();}
function parentArtifact(root=path.resolve(__dirname,'../../../..')){
  const bytes=fs.readFileSync(path.join(root,PARENT_PIN.artifact.file));if(sha(bytes)!==PARENT_PIN.artifact.sha256)fail('ACCEPTED-PARENT-ARTIFACT-PIN');return validateImport(parseExact(bytes));
}
function parentBinding(root=path.resolve(__dirname,'../../../..')){
  const bytes=fs.readFileSync(path.join(root,PARENT_PIN.operational.file));if(sha(bytes)!==PARENT_PIN.operational.sha256)fail('ACCEPTED-PARENT-ENVELOPE-PIN');const e=envelope(parseExact(bytes));
  if(e.acceptanceFile!==FILE||e.acceptanceSha256!==PARENT_PIN.artifact.sha256||e.candidateBase!==PARENT_PIN.receiptBase||e.receipts.review.status!=='ACCEPTED')fail('ACCEPTED-PARENT-RECEIPT-PIN');
  return {...structuredClone(PARENT_PIN),receipt:structuredClone(e.receipts.review.receipt)};
}
function validateStep(a){
  keys(a,['version','phase','packageId','codeBaseAnchor','requiredIds','selectedApprovedFixIds','newlySelectedIds','carriedAcceptedIds','acceptedParent','baseline','candidateEngine','contracts','inventory','nonD','sourceChanges','executionPins','caseModule','helperFiles','matrix','gates','authorizations'],'ACCEPTANCE-SCHEMA');
  if(a.version!==2||a.phase!=='PACKAGE'||a.packageId!=='M2-STEP-EFFICACY'||a.codeBaseAnchor!=='a777f64318dfb9b4766fa336d623196d07b5fc00'||!eq(a.requiredIds,STEP_REQUIRED)||!eq(a.selectedApprovedFixIds,STEP_REQUIRED)||!eq(a.newlySelectedIds,['D12'])||!eq(a.carriedAcceptedIds,REQUIRED))fail('PACKAGE-INVENTORY');
  const parent=parentArtifact();if(!eq(a.acceptedParent,parentBinding()))fail('ACCEPTED-PARENT-BINDING');
  if(!eq(a.contracts,[...parent.contracts,STEP_CONTRACT]))fail('CONTRACT-PIN');
  if(a.caseModule!=='rebuild/conform/v4/postfix/laws/step-efficacy.cjs')fail('THEME-PATH');
  keys(a.helperFiles,['hosts','frozen'],'HELPER-SCHEMA');if(a.helperFiles.hosts!=='rebuild/conform/v4/postfix/helpers/step-efficacy-frozen.cjs'||a.helperFiles.frozen!=='rebuild/conform/v4/postfix/helpers/step-efficacy-frozen.cjs')fail('HELPER-PATH');
  if(!Array.isArray(a.inventory)||a.inventory.length!==45||!eq(a.inventory.map(r=>r.defect),parent.inventory.map(r=>r.defect)))fail('D-INVENTORY');
  for(let i=0;i<45;i++){const row=a.inventory[i];if(row.defect==='D45'&&Object.hasOwn(row,'consequence')){const original={...row};delete original.consequence;if(!eq(original,parent.inventory[i]))fail('CARRIED-OR-UNSELECTED-INVENTORY');require('./helpers/step-efficacy-d45-custody.cjs').validateDescriptor(row.consequence,a.executionPins['rebuild/conform/v4/postfix/helpers/build-step-efficacy-expectations.cjs']);}else if(row.defect!=='D12'&&!eq(row,parent.inventory[i]))fail('CARRIED-OR-UNSELECTED-INVENTORY');}
  if(!Array.isArray(a.sourceChanges)||![5,6].includes(a.sourceChanges.length)||!eq(a.sourceChanges.slice(0,5),parent.sourceChanges))fail('INHERITED-SOURCE-CHANGES');
  const r=a.inventory.find(r=>r.defect==='D12'),b=BASE.inventory.find(r=>r.defect==='D12');
  keys(r,['defect','law','disposition','authorization','themeAcceptance','desiredClaim','implementation','dependencies','rawExpectations','sourceDeltas','outputDeltas','cases','mutants'],'D-SCHEMA');
  if(!eq(r.law,b.law)||r.desiredClaim!==b.desiredClaim)fail('RAW-LAW-PIN');
  if(r.disposition!=='APPROVED-FIX'||r.authorization!=='owner'||r.themeAcceptance!=='theme'||!['PENDING','PRESENT'].includes(r.implementation))fail('DISPOSITION-IMPLEMENTATION');
  if(!eq(r.dependencies,b.dependencies))fail('DEPENDENCY-INVENTORY');rawExpectations(r,a.matrix,a);
  for(const k of ['sourceDeltas','outputDeltas','cases','mutants'])if(!Array.isArray(r[k]))fail('CASE-DELTA-SCHEMA');
  if(r.sourceDeltas.length&&!eq(r.sourceDeltas,['source-stepEfficacy']))fail('SOURCE-DELTA-ID-INVENTORY');expectations(r.outputDeltas,a.matrix);
  if(new Set(r.cases.map(c=>c.id)).size!==r.cases.length)fail('CASE-INVENTORY');
  for(const c of r.cases){keys(c,['id','assertions','originalFailures','expectations'],'CASE-SCHEMA');if(typeof c.id!=='string'||!c.id||!Array.isArray(c.originalFailures)||new Set(c.originalFailures).size!==c.originalFailures.length)fail('CASE-SCHEMA');assertions(c.assertions);if(c.originalFailures.some(id=>!c.assertions.some(x=>x.id===id)))fail('CASE-FAILURE-INVENTORY');expectations(c.expectations,a.matrix);}
  for(const m of r.mutants){keys(m,['id','file','declaration','preimageHash','preimage','postimage','postimageHash','expectedFailures','caseId','scope'],'MUTANT-SCHEMA');keys(m.scope,['start','end','sha256'],'MUTANT-SCOPE');if(typeof m.id!=='string'||!m.id||m.file!=='energy.cjs'||m.declaration!=='stepEfficacy'||!hash(m.preimageHash)||!hash(m.postimageHash)||!hash(m.scope.sha256)||typeof m.preimage!=='string'||!m.preimage||typeof m.postimage!=='string'||m.preimage===m.postimage||!Array.isArray(m.expectedFailures)||!m.expectedFailures.length||!r.cases.some(c=>c.id===m.caseId))fail('MUTANT-SCHEMA');}
  if(a.sourceChanges.length===6)require('./source-proof.cjs').validateStepChange(a.sourceChanges[5]);
  keys(a.authorizations,['owner','contract','theme','review'],'AUTHORIZATION-SCHEMA');
  if(!eq(a.authorizations.owner,parent.authorizations.owner)||!eq(a.authorizations.contract,parent.authorizations.contract))fail('INHERITED-AUTHORIZATION');
  const claim=a.authorizations.theme;keys(claim,['role','line','lineSha256'],'AUTHORIZATION-CLAIM');if(claim.role!=='cowork'||typeof claim.line!=='string'||/[\r\n]/.test(claim.line)||sha(claim.line)!==claim.lineSha256||claim.lineSha256!=='b8a3246daedd7fa0464b9c67031b0d787aa517cc126515d0d3c9f53837c0e290')fail('THEME-AUTHORIZATION-PIN');
  if(!eq(a.authorizations.review,{role:'cowork',prefix:'POSTFIX-ACCEPTANCE M2-STEP-EFFICACY',terminal:'ACCEPTED'}))fail('REVIEW-CLAIM');
  // Validate unchanged machinery through the original, still-closed schema.
  const inherited={...a,packageId:parent.packageId,requiredIds:parent.requiredIds,selectedApprovedFixIds:parent.selectedApprovedFixIds,contracts:parent.contracts,caseModule:parent.caseModule,helperFiles:parent.helperFiles,inventory:parent.inventory,sourceChanges:parent.sourceChanges,authorizations:parent.authorizations};
  delete inherited.newlySelectedIds;delete inherited.carriedAcceptedIds;delete inherited.acceptedParent;validateImport(inherited);return a;
}
function stepParentArtifact(root=path.resolve(__dirname,'../../../..')){
  const bytes=fs.readFileSync(path.join(root,STEP_PARENT_PIN.artifact.file));if(sha(bytes)!==STEP_PARENT_PIN.artifact.sha256)fail('ACCEPTED-STEP-PARENT-ARTIFACT-PIN');return validateStep(parseExact(bytes));
}
function stepParentBinding(root=path.resolve(__dirname,'../../../..')){
  const bytes=fs.readFileSync(path.join(root,STEP_PARENT_PIN.operational.file));if(sha(bytes)!==STEP_PARENT_PIN.operational.sha256)fail('ACCEPTED-STEP-PARENT-ENVELOPE-PIN');const e=envelope(parseExact(bytes));
  if(e.acceptanceFile!==STEP_FILE||e.acceptanceSha256!==STEP_PARENT_PIN.artifact.sha256||e.candidateBase!==STEP_PARENT_PIN.receiptBase||e.receipts.review.status!=='ACCEPTED')fail('ACCEPTED-STEP-PARENT-RECEIPT-PIN');
  return {...structuredClone(STEP_PARENT_PIN),receipt:structuredClone(e.receipts.review.receipt)};
}
function validateEra(a){
  keys(a,['version','phase','packageId','codeBaseAnchor','requiredIds','selectedApprovedFixIds','newlySelectedIds','carriedAcceptedIds','acceptedParent','baseline','candidateEngine','contracts','inventory','nonD','sourceChanges','executionPins','caseModule','helperFiles','matrix','gates','authorizations'],'ACCEPTANCE-SCHEMA');
  if(a.version!==2||a.phase!=='PACKAGE'||a.packageId!=='M2-SET-ONE-ERA'||a.codeBaseAnchor!==ERA_ANCHOR||!eq(a.requiredIds,ERA_REQUIRED)||!eq(a.selectedApprovedFixIds,ERA_REQUIRED)||!eq(a.newlySelectedIds,['D30'])||!eq(a.carriedAcceptedIds,STEP_REQUIRED))fail('PACKAGE-INVENTORY');
  const parent=stepParentArtifact();if(!eq(a.acceptedParent,stepParentBinding()))fail('ACCEPTED-PARENT-BINDING');
  if(!eq(a.contracts,[...parent.contracts,ERA_CONTRACT]))fail('CONTRACT-PIN');
  if(a.caseModule!=='rebuild/conform/v4/postfix/laws/set-one-era.cjs')fail('THEME-PATH');
  keys(a.helperFiles,['hosts','frozen'],'HELPER-SCHEMA');if(a.helperFiles.hosts!=='rebuild/conform/v4/postfix/helpers/set-one-era-frozen.cjs'||a.helperFiles.frozen!==a.helperFiles.hosts)fail('HELPER-PATH');
  if(!Array.isArray(a.inventory)||a.inventory.length!==45||!eq(a.inventory.map(r=>r.defect),parent.inventory.map(r=>r.defect)))fail('D-INVENTORY');
  for(let i=0;i<45;i++)if(a.inventory[i].defect!=='D30'&&!eq(a.inventory[i],parent.inventory[i]))fail('CARRIED-OR-UNSELECTED-INVENTORY');
  if(!Array.isArray(a.sourceChanges)||![6,9].includes(a.sourceChanges.length)||!eq(a.sourceChanges.slice(0,6),parent.sourceChanges))fail('INHERITED-SOURCE-CHANGES');
  const r=a.inventory.find(r=>r.defect==='D30'),b=BASE.inventory.find(r=>r.defect==='D30');
  keys(r,['defect','law','disposition','authorization','themeAcceptance','desiredClaim','implementation','dependencies','rawExpectations','sourceDeltas','outputDeltas','cases','mutants'],'D-SCHEMA');
  if(!eq(r.law,b.law)||r.desiredClaim!==b.desiredClaim)fail('RAW-LAW-PIN');
  if(r.disposition!=='APPROVED-FIX'||r.authorization!=='owner'||r.themeAcceptance!=='theme'||!['PENDING','PRESENT'].includes(r.implementation))fail('DISPOSITION-IMPLEMENTATION');
  if(!eq(r.dependencies,b.dependencies))fail('DEPENDENCY-INVENTORY');rawExpectations(r,a.matrix,a);
  for(const k of ['sourceDeltas','outputDeltas','cases','mutants'])if(!Array.isArray(r[k]))fail('CASE-DELTA-SCHEMA');
  if(r.sourceDeltas.length&&!eq(r.sourceDeltas,['source-setOneRead','binding-forksOf','binding-sameEra']))fail('SOURCE-DELTA-ID-INVENTORY');expectations(r.outputDeltas,a.matrix);
  if(new Set(r.cases.map(c=>c.id)).size!==r.cases.length)fail('CASE-INVENTORY');
  for(const c of r.cases){keys(c,['id','assertions','originalFailures','expectations'],'CASE-SCHEMA');if(typeof c.id!=='string'||!c.id||!Array.isArray(c.originalFailures)||new Set(c.originalFailures).size!==c.originalFailures.length)fail('CASE-SCHEMA');assertions(c.assertions);if(c.originalFailures.some(id=>!c.assertions.some(x=>x.id===id)))fail('CASE-FAILURE-INVENTORY');expectations(c.expectations,a.matrix);}
  for(const m of r.mutants){keys(m,['id','file','declaration','preimageHash','preimage','postimage','postimageHash','expectedFailures','caseId','scope'],'MUTANT-SCHEMA');keys(m.scope,['start','end','sha256'],'MUTANT-SCOPE');if(typeof m.id!=='string'||!m.id||m.file!=='volume.cjs'||m.declaration!=='setOneRead'||!hash(m.preimageHash)||!hash(m.postimageHash)||!hash(m.scope.sha256)||typeof m.preimage!=='string'||!m.preimage||typeof m.postimage!=='string'||m.preimage===m.postimage||!Array.isArray(m.expectedFailures)||!m.expectedFailures.length||!r.cases.some(c=>c.id===m.caseId))fail('MUTANT-SCHEMA');}
  if(a.sourceChanges.length===9)require('./source-proof.cjs').validateSetOneEraChanges(a.sourceChanges.slice(6));
  keys(a.authorizations,['owner','contract','theme','review'],'AUTHORIZATION-SCHEMA');
  if(!eq(a.authorizations.owner,parent.authorizations.owner)||!eq(a.authorizations.contract,parent.authorizations.contract))fail('INHERITED-AUTHORIZATION');
  const claim=a.authorizations.theme;keys(claim,['role','line','lineSha256'],'AUTHORIZATION-CLAIM');if(claim.role!=='cowork'||typeof claim.line!=='string'||/[\r\n]/.test(claim.line)||sha(claim.line)!==claim.lineSha256||claim.lineSha256!==ERA_THEME_SHA)fail('THEME-AUTHORIZATION-PIN');
  if(!eq(a.authorizations.review,{role:'cowork',prefix:'POSTFIX-ACCEPTANCE M2-SET-ONE-ERA',terminal:'ACCEPTED'}))fail('REVIEW-CLAIM');
  // Check all shared machinery through the unchanged, closed accepted STEP shape.
  validateStep({...a,packageId:parent.packageId,codeBaseAnchor:parent.codeBaseAnchor,requiredIds:parent.requiredIds,selectedApprovedFixIds:parent.selectedApprovedFixIds,newlySelectedIds:parent.newlySelectedIds,carriedAcceptedIds:parent.carriedAcceptedIds,acceptedParent:parent.acceptedParent,contracts:parent.contracts,caseModule:parent.caseModule,helperFiles:parent.helperFiles,inventory:parent.inventory,sourceChanges:parent.sourceChanges,authorizations:parent.authorizations});return a;
}
function validate(a){const id=profile(a).id;return id==='M2-SET-ONE-ERA'?validateEra(a):id==='M2-STEP-EFFICACY'?validateStep(a):validateImport(a);}
function verifyAcceptedParent(root,a,{gitHead=true}={}){
  if(profile(a).id==='M2-SET-ONE-ERA'){
    const p=stepParentBinding(root),parent=stepParentArtifact(root);if(!eq(a.acceptedParent,p))fail('ACCEPTED-PARENT-BINDING');
    for(const pin of [p.artifact,p.operational]){const bytes=fs.readFileSync(path.join(root,pin.file));if(sha(L.object(root,pin.commit,pin.file))!==pin.sha256||gitHead&&!L.object(root,'HEAD',pin.file).equals(bytes))fail('ACCEPTED-PARENT-GIT-PIN');}
    // Recursively verify the accepted import parent and the actual STEP receipt.
    verifyAcceptedParent(root,parent,{gitHead});const bytes=fs.readFileSync(path.join(root,p.artifact.file)),e=envelope(parseExact(fs.readFileSync(path.join(root,p.operational.file))));
    if(!verifyReceipts(root,parent,e,bytes))fail('ACCEPTED-PARENT-RECEIPT-PIN');
    L.verifyReceipt(root,p.receiptBase,p.receipt,{role:'cowork'});L.verifyReceipt(root,a.codeBaseAnchor,{...p.receipt,commit:a.codeBaseAnchor},{role:'cowork'});
    try{L.git(root,['merge-base','--is-ancestor',p.candidateCommit,a.codeBaseAnchor]);}catch{fail('ACCEPTED-PARENT-ANCESTRY');}
    for(const [file,hash]of Object.entries(parent.candidateEngine))if(sha(L.object(root,p.candidateCommit,'rebuild/engine/'+file))!==hash)fail('ACCEPTED-PARENT-PRODUCT-PIN');
    if(!eq(a.sourceChanges.slice(0,6),parent.sourceChanges)||STEP_REQUIRED.some(id=>!eq(a.inventory.find(r=>r.defect===id),parent.inventory.find(r=>r.defect===id))))fail('ACCEPTED-PARENT-INHERITANCE');return parent;
  }
  if(profile(a).id!=='M2-STEP-EFFICACY')return null;
  const p=parentBinding(root);if(!eq(a.acceptedParent,p))fail('ACCEPTED-PARENT-BINDING');const parent=parentArtifact(root);
  for(const pin of [p.artifact,p.operational]){const bytes=fs.readFileSync(path.join(root,pin.file));if(sha(L.object(root,pin.commit,pin.file))!==pin.sha256||gitHead&&!L.object(root,'HEAD',pin.file).equals(bytes))fail('ACCEPTED-PARENT-GIT-PIN');}
  const e=envelope(parseExact(fs.readFileSync(path.join(root,p.operational.file))));
  if(!verifyReceiptsImport(root,parent,e,fs.readFileSync(path.join(root,p.artifact.file))))fail('ACCEPTED-PARENT-RECEIPT-PIN');
  L.verifyReceipt(root,p.receiptBase,p.receipt,{role:'cowork'});
  L.verifyReceipt(root,a.codeBaseAnchor,{...p.receipt,commit:a.codeBaseAnchor},{role:'cowork'});
  try{L.git(root,['merge-base','--is-ancestor',p.candidateCommit,a.codeBaseAnchor]);}catch{fail('ACCEPTED-PARENT-ANCESTRY');}
  for(const [file,hash]of Object.entries(parent.candidateEngine))if(sha(L.object(root,p.candidateCommit,'rebuild/engine/'+file))!==hash)fail('ACCEPTED-PARENT-PRODUCT-PIN');
  if(!eq(a.sourceChanges.slice(0,5),parent.sourceChanges)||REQUIRED.some(id=>!eq(a.inventory.find(r=>r.defect===id),parent.inventory.find(r=>r.defect===id))))fail('ACCEPTED-PARENT-INHERITANCE');
  return parent;
}
function verifyReceipts(root,a,e,bytes){
  if(e.acceptanceFile!==artifactFile(a))fail('ENVELOPE-PROFILE-MISMATCH');
  if(profile(a).id==='M2-IMPORT-GUARDS')return verifyReceiptsImport(root,a,e,bytes);
  if(![STEP_FILE,ERA_FILE].includes(e.acceptanceFile))fail('ENVELOPE-PROFILE-MISMATCH');verifyAcceptedParent(root,a);
  for(const key of ['owner','contract','theme']){const r=e.receipts[key],claim=a.authorizations[key];if(r.line!==claim.line||r.lineSha256!==claim.lineSha256)fail('AUTHORIZATION-CLAIM-MISMATCH');L.verifyReceipt(root,e.candidateBase,r,{role:claim.role});}
  if(e.receipts.review.status==='PENDING')return false;
  const r=e.receipts.review.receipt;L.verifyReceipt(root,e.candidateBase,r,{role:'cowork'});
  const match=(a.packageId==='M2-SET-ONE-ERA'?/^(?:- [^\r\n]+ · cowork · )?POSTFIX-ACCEPTANCE M2-SET-ONE-ERA ([a-f0-9]{40}) (rebuild\/conform\/v4\/postfix\/acceptance-set-one-era\.json) ([a-f0-9]{64}) ACCEPTED$/:/^(?:- [^\r\n]+ · cowork · )?POSTFIX-ACCEPTANCE M2-STEP-EFFICACY ([a-f0-9]{40}) (rebuild\/conform\/v4\/postfix\/acceptance-step-efficacy\.json) ([a-f0-9]{64}) ACCEPTED$/).exec(r.line);
  if(!match||match[2]!==e.acceptanceFile||match[3]!==e.acceptanceSha256)fail('REVIEW-EXACT-VERDICT');if(!L.object(root,match[1],match[2]).equals(bytes))fail('REVIEW-ARTIFACT-GIT-PIN');return true;
}
function load(root,manifestFile){const e=envelope(parseExact(fs.readFileSync(manifestFile))),bytes=fs.readFileSync(path.join(root,e.acceptanceFile));if(sha(bytes)!==e.acceptanceSha256)fail('ACCEPTANCE-BYTE-PIN');const a=validate(e.acceptanceFile===ERA_FILE?require('./helpers/set-one-era-compact-json.cjs').parseCompactExact(bytes):parseExact(bytes));if(artifactFile(a)!==e.acceptanceFile)fail('ENVELOPE-PROFILE-MISMATCH');return {envelope:e,acceptance:a,bytes};}
function missing(a){const p=profile(a),out=[];for(const id of p.required){const r=a.inventory.find(r=>r.defect===id);if(r.implementation!=='PRESENT')out.push(id+' implementation pending');for(const k of ['cases','mutants','sourceDeltas','outputDeltas'])if(!r[k].length)out.push(id+' '+k+' pending');for(const c of r.cases)if(c.expectations.length!==a.matrix.length)out.push(c.id+' expectation matrix pending');}if(a.sourceChanges.length!==p.sourceCount)out.push(p.sourceCount===5?'five reviewed source changes pending':p.sourceCount===9?'one volume declaration/two delegates plus six inherited source changes pending':'one energy expression plus five inherited source changes pending');if(p.id!=='M2-IMPORT-GUARDS'&&!a.inventory.find(r=>r.defect==='D45').consequence)out.push('D45 runtime-only consequence descriptor pending');return out;}
module.exports={FILE,BASE,REQUIRED,STEP_FILE,STEP_REQUIRED,STEP_CONTRACT,PARENT_PIN,ERA_FILE,ERA_REQUIRED,ERA_ANCHOR,ERA_CONTRACT,ERA_THEME_SHA,STEP_PARENT_PIN,profile,artifactFile,envelopeFile,requiredIds,parentArtifact,parentBinding,stepParentArtifact,stepParentBinding,verifyAcceptedParent,keys,relative,validate,envelope,load,fetchIntegration,ancestry,verifyReceipts,missing,rawExpectations};
