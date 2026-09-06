'use strict';
const fs=require('node:fs'),path=require('node:path');
const A=require('./acceptance.cjs'),L=require('./legacy-gates.cjs'),T=require('./target.cjs');
const {verifyProductSources}=require('./source-proof.cjs');
const {compareStructural}=require('./structural-delta.cjs');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const trace=r=>({frames:r.frames,detail:r.detail});
function compare(before,after,expectation){
  const b=trace(before),c=trace(after);
  if(expectation){if(T.sha(JSON.stringify(b))!==expectation.originalTraceSha256)T.fail('ORIGINAL-TRACE-PIN');compareStructural(b,c,expectation.delta);}
  else compareStructural(b,c);
}
function checkPins(root,a){
  for(const [file,hash]of Object.entries(a.baseline.publicPins)){
    if(file==='rebuild/engine/migrate.cjs')continue;
    if(T.sha(L.object(root,a.baseline.auditCommit,file))!==hash||T.sha(L.object(root,'HEAD',file))!==hash||T.sha(fs.readFileSync(path.join(root,file)))!==hash)T.fail('ORIGINAL-INPUT-PIN');
  }
  for(const [file,hash]of Object.entries(a.executionPins)){
    if(file===A.FILE||file==='rebuild/conform/v4/postfix/manifest-import-guards.json')T.fail('CIRCULAR-EXECUTION-PIN');
    if(T.sha(fs.readFileSync(path.join(root,file)))!==hash||T.sha(L.object(root,'HEAD',file))!==hash)T.fail('EXECUTION-PIN');
  }
  const files=fs.readdirSync(path.join(root,'rebuild/conform/v4/postfix'),{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>path.relative(root,path.join(x.parentPath,x.name)).split(path.sep).join('/')).filter(x=>x!==A.FILE&&x!=='rebuild/conform/v4/postfix/manifest-import-guards.json').sort();
  if(files.some(f=>!Object.hasOwn(a.executionPins,f)))T.fail('EXECUTION-INVENTORY');
  if(!Object.hasOwn(a.executionPins,a.caseModule)||Object.values(a.helperFiles).some(f=>!Object.hasOwn(a.executionPins,f)))T.fail('CASE-HELPER-INVENTORY');
  for(const c of a.contracts)L.checkSources(root,c.commit,{[c.file]:c.sha256});
  for(const item of a.nonD)L.checkSources(root,item.source.commit,{[item.source.file]:item.source.sha256},{disk:false});
}
function directInput({root,baseline,a,bundles,row,caseId,cell,frozen}){
  return {kind:frozen?'direct-frozen':'direct',baseline,candidate:path.join(root,'rebuild/engine'),inventory:a.candidateEngine,caseFile:path.join(root,a.caseModule),caseSha256:a.executionPins[a.caseModule],lawId:row.law.id,caseId,mode:cell.mode,day:cell.day,traceProfile:2,helperRoot:root,helperPins:{...a.baseline.publicPins,...a.executionPins},hostsHelper:a.helperFiles.hosts,...(frozen?{frozenHelper:a.helperFiles.frozen,bundle:bundles.main,bundleSha256:T.sha(fs.readFileSync(bundles.main))}:{})};
}
function caseInventory(root,a){
  const mod=require(path.join(root,a.caseModule));
  if(!Array.isArray(mod.laws)||!Array.isArray(mod.CASES)||!Array.isArray(mod.ASSERTION_INVENTORY)||!equal(mod.INVENTORY,mod.laws.map(l=>l.id))||!equal(mod.laws.map(l=>l.defect),a.requiredIds))T.fail('THEME-INVENTORY');
  const requiredMutants={D33:['counts-only','missing-entry-slot','accept-any-correction','ignore-strike-receipt-payload','deny-all'],D34:['coarse-fingerprint','never-pristine','raw-key-order','whole-state-comparison'],D35:['heal-before-return','return-all-unchanged']};
  for(const row of a.inventory.filter(r=>a.requiredIds.includes(r.defect))){
    const law=mod.laws.find(l=>l.defect===row.defect),actual=mod.CASES.filter(c=>c.defect===row.defect);
    if(law.id!==row.law.id||law.implementation!=='PRESENT'||!equal(law.requiredCases,actual.map(c=>c.id))||!equal(row.cases.map(c=>c.id),law.requiredCases)||!equal(law.requiredMutants,requiredMutants[row.defect])||!equal(row.mutants.map(m=>m.id),law.requiredMutants))T.fail('CASE-OR-MUTANT-INVENTORY');
    for(const c of row.cases){const list=mod.ASSERTION_INVENTORY.filter(x=>x.caseId===c.id&&x.defect===row.defect).map(x=>({id:x.id,count:1}));if(!equal(c.assertions,list))T.fail('CASE-ASSERTION-INVENTORY');}
  }
  const flattened=a.inventory.flatMap(r=>r.cases.flatMap(c=>c.assertions.map(x=>({caseId:c.id,defect:r.defect,id:x.id}))));
  const sortInventory=list=>list.map(x=>JSON.stringify(x)).sort();
  if(new Set(sortInventory(flattened)).size!==flattened.length||!equal(sortInventory(flattened),sortInventory(mod.ASSERTION_INVENTORY)))T.fail('ASSERTION-INVENTORY');
}
function main({manifestFile,baseline,candidate}){
  candidate=fs.realpathSync(candidate);baseline=fs.realpathSync(baseline);
  const root=L.git(candidate,['rev-parse','--show-toplevel']).toString().trim();
  if(fs.realpathSync(path.join(root,'rebuild/engine'))!==candidate)T.fail('CANDIDATE-WRONG-PATH');
  const {envelope:e,acceptance:a,bytes}=A.load(root,manifestFile);
  A.fetchIntegration(root);
  A.ancestry(root,a,e);const accepted=A.verifyReceipts(root,a,e,bytes);
  if(accepted&&!L.object(root,'HEAD',A.FILE).equals(bytes))T.fail('UNCOMMITTED-ACCEPTANCE-ARTIFACT');
  // Pending evidence must never look like final acceptance, including inherited
  // gate tails. Exact original gate output remains in local-only gate logs.
  const emit=line=>console.log(accepted?line:line.replace(/\bPASS\b/g,'OBSERVED'));
  emit('POSTFIX PACKAGE '+(accepted?'AUTHORIZED':'REVIEW-PENDING')+' acceptanceSha256='+e.acceptanceSha256+' candidateBase='+e.candidateBase);
  for(const r of a.inventory)emit(r.defect+' '+r.disposition+' / '+r.implementation);
  for(const n of a.nonD)emit('NON-D '+n.id+' OPEN');
  const pending=A.missing(a);if(pending.length){for(const reason of pending)emit('PACKAGE BLOCKED '+reason);return 2;}
  if(L.git(baseline,['rev-parse','HEAD']).toString().trim()!==a.baseline.auditCommit)T.fail('BASELINE-CHECKOUT');
  L.checkSources(baseline,a.baseline.auditCommit,a.baseline.publicPins);
  checkPins(root,a);verifyProductSources({root,baseline,acceptance:a,gitHead:true});caseInventory(root,a);
  const R=require('./run.cjs'),carrier=require('./legacy-carriers.cjs');
  const bundles=L.publicReferences({baseline,scratch:path.join(root,'.tmp/postfix/package-reference'),sourcePins:a.baseline.buildSources});
  emit(L.historicalAudit({baseline,bundles}));
  let raw=0,cases=0,mutants=0;
  for(const row of a.inventory){
    for(const cell of a.matrix){
      const expectation=row.rawExpectations.find(x=>x.mode===cell.mode&&x.day===cell.day);
      const shared={baseline,law:row.law,...cell,traceProfile:2,...(expectation.originalStatus==='THROWS'?{rawFixtureOutcome:'D44-NONDEFAULT-FIXTURE'}:{})};
      const original=T.runRaw({...shared,kind:'raw-frozen',bundle:bundles.main,bundleSha256:T.sha(fs.readFileSync(bundles.main)),helperRoot:root,helperPins:a.baseline.publicPins}),current=T.runRaw({...shared,candidate,inventory:a.candidateEngine});
      if(original.status!==expectation.originalStatus||current.status!==expectation.candidateStatus||!equal(original.error??null,expectation.exception)||!equal(current.error??null,expectation.exception))T.fail('RAW-VERDICT-'+row.defect);
      if(T.sha(JSON.stringify(trace(original)))!==expectation.originalTraceSha256)T.fail('ORIGINAL-RAW-TRACE-PIN-'+row.defect);
      compare(original,current,row.outputDeltas.find(d=>d.mode===cell.mode&&d.day===cell.day));raw++;
      if(expectation.classification!=='ACCEPTANCE')emit(row.defect+' '+cell.mode+'/'+cell.day+' '+expectation.classification+' / exact original outcome+trace / PENDING; no repair credit');
    }
    if(row.implementation!=='PRESENT'){emit(row.defect+' gate-date RED-original / RED-candidate / preservation PASS');continue;}
    let frozenRed=false;
    for(const c of row.cases)for(const cell of a.matrix){
      const original=T.runRaw(directInput({root,baseline,a,bundles,row,caseId:c.id,cell,frozen:true}));
      const actual=T.runRaw(directInput({root,baseline,a,bundles,row,caseId:c.id,cell,frozen:false}));
      const oldFailures=L.assertions(original,c.assertions);if(!equal(oldFailures,[...c.originalFailures].sort()))T.fail('FROZEN-ASSERTION-VERDICT-'+c.id);if(oldFailures.length)frozenRed=true;
      if(L.assertions(actual,c.assertions).length)T.fail('DIRECT-CASE-RED-'+c.id);
      compare(original,actual,c.expectations.find(d=>d.mode===cell.mode&&d.day===cell.day));cases++;
    }
    if(!frozenRed)T.fail('STRENGTHENED-LAW-NOT-RED-'+row.defect);
    for(const mutant of row.mutants)for(const cell of a.matrix){
      const c=row.cases.find(c=>c.id===mutant.caseId);
      if(!mutant.scope)T.fail('MUTANT-SCOPE');
      const result=L.faultRun({candidate,inventory:a.candidateEngine,scratch:path.join(root,'.tmp/postfix/package-mutants'),mutant,caseInput:directInput({root,baseline,a,bundles,row,caseId:c.id,cell,frozen:false}),expected:c.assertions});
      emit(row.defect+' mutant '+result.id+' '+cell.mode+'/'+cell.day+' EFFECTIVE restoredSha256='+result.restoredSha256);mutants++;
    }
    emit(row.defect+' RED-frozen / GREEN-candidate-direct / preserved PASS');
  }
  const ids=carrier.CARRIER_IDS||carrier.INVENTORY;
  if(!Array.isArray(ids))T.fail('CARRIER-INVENTORY');
  for(const gate of R.GATES){const carrierId=gate[0]==='witnesses-5'?'defect-witnesses-5':gate[0];if(ids.includes(carrierId)){for(const mode of ['frozen','native']){const r=carrier.runCarrier({id:carrierId,root,baseline,bundles,acceptance:a,mode});emit('LEGACY '+gate[0]+' '+mode+' PASS | '+r.tail);}}else R.gateRun(root,bundles,gate,{emit});}
  emit('POSTFIX TOTAL 45 APPROVED-FIX / 3 PRESENT / 42 PENDING / 15 non-D OPEN; '+raw+' raw comparisons / '+cases+' direct case-mode executions / '+mutants+' effective mutation executions');
  if(!accepted){emit('REVIEW-PENDING: complete evidence collected; independent artifact acceptance required');return 2;}
  emit('POSTFIX PACKAGE PASS');return 0;
}
module.exports={main,checkPins,compare,directInput,caseInventory};
