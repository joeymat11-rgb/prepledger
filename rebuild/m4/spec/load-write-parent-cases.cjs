'use strict';
// Re-run every accepted import/D12 direct case and effective product mutant on
// the actual load-write engine. Parent law/fixture/delta/assertion bytes stay exact.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),T=require(path.join(P,'target.cjs')),L=require(path.join(P,'legacy-gates.cjs')),Parent=require(path.join(P,'package-runner.cjs')),S=require('./load-write-source.cjs');
const {acceptance:a,envelope:e,bytes}=A.load(root,path.join(P,'manifest-step-efficacy.json'));assert(A.verifyReceipts(root,a,e,bytes));
for(const [file,hash]of Object.entries(a.executionPins))assert.equal(T.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged accepted execution input: '+file);
Parent.caseInventory(root,a);
const pins=S.verify(root),candidate=path.join(root,'rebuild/engine'),inventory=Object.fromEntries(Object.entries(pins).filter(([file])=>file.startsWith('rebuild/engine/')).map(([file,hash])=>[path.basename(file),hash]));
const bundles=require('./load-write-reference.cjs').create(root),targetAcceptance={...a,candidateEngine:inventory};
let phase='preparation',cases=0,mutants=0;
try{
 for(const row of a.inventory.filter(row=>a.requiredIds.includes(row.defect))){
  const count={cases:0,mutants:0};let red=false;
  for(const test of row.cases)for(const cell of a.matrix){
   phase=test.id+'/'+cell.mode+'/'+cell.day;
   const input={root,baseline:root,a:targetAcceptance,bundles,row,caseId:test.id,cell};
   const original=T.runRaw(Parent.directInput({...input,frozen:true})),actual=T.runRaw(Parent.directInput({...input,frozen:false}));
   const oldFailures=L.assertions(original,test.assertions);assert.deepEqual(oldFailures,[...test.originalFailures].sort());if(oldFailures.length)red=true;
   assert.deepEqual(L.assertions(actual,test.assertions),[]);
   Parent.compare(original,actual,test.expectations.find(x=>x.mode===cell.mode&&x.day===cell.day));cases++;count.cases++;
  }
  assert(red,'Inherited law remains red-first');
  for(const mutant of row.mutants)for(const cell of a.matrix){
   phase=mutant.id+'/'+cell.mode+'/'+cell.day;const test=row.cases.find(c=>c.id===mutant.caseId);
   // Import/D12 mutant sites are unchanged. Their original whole-file preimages
   // remain mandatory; the unrelated canonical earn move changed migrate.cjs,
   // so rebind only that hash after proving the exact current construction.
   const file=path.join(candidate,mutant.file),before=fs.readFileSync(file,'utf8');
   let current=mutant;
   if(mutant.file==='migrate.cjs'){
    const parent=S.baseline(root)['rebuild/engine/migrate.cjs'];assert.equal(T.sha(parent),mutant.preimageHash);assert.equal(parent.split(mutant.preimage).length,2);
    const oldStart=mutant.scope.start,body=parent.slice(oldStart,mutant.scope.end),start=before.indexOf(body);assert(start>=0&&before.split(body).length===2,'Exact unchanged inherited declaration');
    const after=S.replace(before,mutant.preimage,mutant.postimage,mutant.id);current={...mutant,preimageHash:T.sha(before),postimageHash:T.sha(after),scope:{start,end:start+body.length,sha256:T.sha(body)}};
   }
   const result=L.faultRun({candidate,inventory,scratch:path.join(root,'.tmp/load-write-parent-mutants'),mutant:current,caseInput:Parent.directInput({root,baseline:root,a:targetAcceptance,bundles,row,caseId:test.id,cell,frozen:false}),expected:test.assertions});assert.equal(result.status,'EFFECTIVE');mutants++;count.mutants++;
  }
  console.log('LOAD PARENT '+row.defect+': '+count.cases+' exact inherited case-mode comparisons PASS; '+count.mutants+' inherited mutants EFFECTIVE/restored');
 }
 assert.equal(cases,a.inventory.reduce((n,r)=>n+r.cases.length*a.matrix.length,0));assert.equal(mutants,a.inventory.reduce((n,r)=>n+r.mutants.length*a.matrix.length,0));
 console.log('LOAD PARENT CASES: '+cases+' complete inherited comparisons PASS; '+mutants+' effective inherited mutants; original assertions/deltas preserved; PACKAGE receipt PENDING');
}catch(_){console.error('LOAD PARENT CASES FAIL at '+phase+'; protected context withheld');process.exitCode=1;}
