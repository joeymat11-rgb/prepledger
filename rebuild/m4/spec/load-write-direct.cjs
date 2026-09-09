'use strict';
// Uses the unchanged strict target, assertion inventory, full graph tracer and
// coverage-proven disposable-module mutation runner. No product interception.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),T=require(path.join(P,'target.cjs')),L=require(path.join(P,'legacy-gates.cjs'));
const S=require('./load-write-source.cjs'),E=require('./load-write-expectations.cjs'),Cases=require('./load-write-cases.cjs');
const {acceptance:a,envelope:e,bytes}=A.load(root,path.join(P,'manifest-step-efficacy.json'));assert(A.verifyReceipts(root,a,e,bytes));
const bundle=require('./load-write-reference.cjs').create(root).main;
const projected=E.createSource({root}),caseFile=path.join(__dirname,'load-write-cases.cjs'),sealed=new Map(),failures=new Map();
const trace=r=>JSON.stringify({frames:r.frames,detail:r.detail});
const expectations=id=>Cases.ASSERTION_INVENTORY.filter(x=>x.caseId===id).map(x=>({id:x.id,count:1}));
function input(test,cell){return {kind:'direct',baseline:root,candidate:path.join(root,'rebuild/engine'),caseFile,caseSha256:T.sha(fs.readFileSync(caseFile)),lawId:'V4-'+test.defect+'-LOAD-WRITES',caseId:test.id,...cell,traceProfile:2,helperRoot:root,helperPins:{...a.baseline.publicPins,...a.executionPins},frozenHelper:a.helperFiles.frozen};}
const expectedFailures={
 'LW41-DEBUT':['vector'],'LW41-RESET-VECTOR':['vector'],'LW43-OWNED':['loads'],'LW43-REPEATED':['loads']
};
let phase='source expectations',n=0,m=0,stage='start',failureIds=[];
try{
 for(const test of Cases.CASES)for(const cell of a.matrix){
  phase=test.id+'/'+cell.mode+'/'+cell.day;const base=input(test,cell);E.verifySource(projected);
  stage='original execution';const original=T.runRaw({...base,kind:'direct-frozen',bundle,bundleSha256:T.sha(fs.readFileSync(bundle))});
  stage='projected execution';const expected=T.runRaw({...base,kind:'direct-frozen',bundle:projected.bundle,bundleSha256:projected.bundleSha256});
  stage='original assertion inventory';failureIds=L.assertions(original,expectations(test.id));assert.deepEqual(failureIds,(expectedFailures[test.id]||[]).map(id=>test.id+'/'+id).sort(),'Explicit frozen failure inventory');
  stage='projected assertion inventory';failureIds=L.assertions(expected,expectations(test.id));assert.deepEqual(failureIds,[],'Source-derived repaired expectations GREEN');
  sealed.set(phase,trace(expected));failures.set(phase,trace(original)!==trace(expected));
 }
 console.log('LOAD DIRECT EXPECTATIONS SEALED: '+sealed.size+' complete traces; explicit frozen failures; no candidate inspected or loaded');
 const pins=S.verify(root),inventory=Object.fromEntries(Object.entries(pins).filter(([file])=>file.startsWith('rebuild/engine/')).map(([file,hash])=>[path.basename(file),hash]));
 for(const test of Cases.CASES)for(const cell of a.matrix){phase=test.id+'/'+cell.mode+'/'+cell.day;const actual=T.runRaw({...input(test,cell),inventory});assert.deepEqual(L.assertions(actual,expectations(test.id)),[]);assert.equal(trace(actual)===sealed.get(phase),true,'Complete source-derived output/inputs/aliases/receipts');n++;}
 console.log('LOAD DIRECT: '+n+'/'+sealed.size+' complete case-mode comparisons PASS; no changed assertion or omitted original case');
 const writer=fs.readFileSync(path.join(root,'rebuild/engine/writers.cjs'),'utf8'),earn=fs.readFileSync(path.join(root,S.EARN),'utf8');
 function mutation(id,file,declaration,from,to,caseId,failed){
  const before=file==='writers.cjs'?writer:earn,after=S.replace(before,from,to,id),start=before.indexOf('function '+declaration+'(');assert(start>=0);const next=before.indexOf('// Copied from frozen',start),end=next<0?before.lastIndexOf('\nreturn {'):next;assert(end>start);
  return {id,file,declaration,preimageHash:T.sha(before),preimage:from,postimage:to,postimageHash:T.sha(after),expectedFailures:failed.map(name=>caseId+'/'+name),caseId,scope:{start,end,sha256:T.sha(before.slice(start,end))}};
 }
 const mutants=[
  ...S.CHANGES.map(([id,before,after],i)=>mutation(id,'writers.cjs',i===2?'completeSession':i===1?'applyAgentProposal':'completeSession',after,before,['LW41-DEBUT','LW41-RESET-VECTOR','LW43-OWNED'][i],[i===2?'loads':'vector'])),
  mutation('D41-vector-alias','writers.cjs','completeSession','ex.wSets = q.newWSets.slice();','ex.wSets = q.newWSets;','LW41-DEBUT',['nonalias']),
  mutation('earn-no-mint','earn.cjs','earnWalk','function earnWalk(s, ex, en, r, prevMeta, push, dEarn) {','function earnWalk(s, ex, en, r, prevMeta, push, dEarn) { return;','LW41-MERGE-MINT',['mint'])
 ];
 for(const mutant of mutants)for(const cell of a.matrix){phase=mutant.id+'/'+cell.mode+'/'+cell.day;const test=Cases.CASES.find(t=>t.id===mutant.caseId);const result=L.faultRun({candidate:path.join(root,'rebuild/engine'),inventory,scratch:path.join(root,'.tmp/load-write-mutants'),mutant,caseInput:{...input(test,cell),inventory},expected:expectations(test.id)});assert.equal(result.status,'EFFECTIVE');m++;console.log('LOAD MUTANT '+phase+': EFFECTIVE; exact named failure and executed site; restored '+result.restoredSha256);}
 assert.equal(n,44);assert.equal(m,20);console.log('LOAD WRITE DIRECT: 44/44 complete comparisons; 20/20 disposable module mutants EFFECTIVE/restored; PACKAGE receipt PENDING');
}catch(_){console.error('LOAD WRITE DIRECT FAIL at '+phase+' / '+stage+'; failed authored assertions '+JSON.stringify(failureIds.filter(id=>Cases.ASSERTION_INVENTORY.some(row=>row.id===id)))+'; protected context withheld');process.exitCode=1;}
finally{sealed.clear();failures.clear();}
