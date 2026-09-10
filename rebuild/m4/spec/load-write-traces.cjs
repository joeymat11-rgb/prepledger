'use strict';
// Complete raw trace compatibility, using the unchanged post-fix tracer and
// inherited acceptance. New expected outputs come only from frozen source edits.
// This preparatory runner does not manufacture a new PACKAGE approval receipt.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),T=require(path.join(P,'target.cjs')),Parent=require(path.join(P,'package-runner.cjs'));
const Source=require('./load-write-source.cjs'),Expected=require('./load-write-expectations.cjs');
const {acceptance:a,envelope:e,bytes}=A.load(root,path.join(P,'manifest-step-efficacy.json'));
assert(A.verifyReceipts(root,a,e,bytes),'Existing import/D12 acceptance must be real');
const bundles=require('./load-write-reference.cjs').create(root),bundle=bundles.main,source=Expected.createSource({root});
const trace=r=>({frames:r.frames,detail:r.detail}),equal=(x,y)=>JSON.stringify(x)===JSON.stringify(y),sealed=new Map();
// Seal every newly selected expected trace before inspecting the current product.
// Immutable JSON strings retain exact graph references, input mutations and text.
for(const row of a.inventory.filter(row=>['D41','D43'].includes(row.defect)))for(const cell of a.matrix){
 const input={baseline:root,law:row.law,...cell,traceProfile:2,kind:'raw-frozen',bundle,bundleSha256:T.sha(fs.readFileSync(bundle)),helperRoot:root,helperPins:a.baseline.publicPins};
 Expected.verifySource(source);
 const original=T.runRaw(input),expected=T.runRaw({...input,bundle:source.bundle,bundleSha256:source.bundleSha256});
 assert.equal(original.status,'RED');assert.equal(expected.status,'GREEN');assert(!equal(trace(original),trace(expected)),'Reached repair consequence');
 sealed.set(row.defect+'/'+cell.mode+'/'+cell.day,Object.freeze({original:JSON.stringify(original),expected:JSON.stringify(trace(expected))}));
}
assert.equal(sealed.size,8);console.log('LOAD EXPECTATIONS SEALED: 8 complete frozen-source traces; candidate not inspected or loaded');
// Same protected D45 consequence keeper, no changed custody or new private output.
const custody=require(path.join(P,'helpers/step-efficacy-d45-custody.cjs')).prepareCustody({root,baseline:root,bundles,acceptance:a});
const allPins=Source.verify(root),inventory=Object.fromEntries(Object.entries(allPins).filter(([f])=>f.startsWith('rebuild/engine/')).map(([f,h])=>[path.basename(f),h]));
let currentCase='preparation',checked=0,newComparisons=0;
try{
 for(const row of a.inventory)for(const cell of a.matrix){
  currentCase=row.defect+' '+cell.mode+' '+cell.day;
  const spec=row.rawExpectations.find(x=>x.mode===cell.mode&&x.day===cell.day),shared={baseline:root,law:row.law,...cell,traceProfile:2,...(spec.originalStatus==='THROWS'?{rawFixtureOutcome:'D44-NONDEFAULT-FIXTURE'}:{})};
  const ref={...shared,kind:'raw-frozen',bundle,bundleSha256:T.sha(fs.readFileSync(bundle)),helperRoot:root,helperPins:a.baseline.publicPins};
  const expectedCell=sealed.get(row.defect+'/'+cell.mode+'/'+cell.day);
  const original=expectedCell?JSON.parse(expectedCell.original):T.runRaw(ref);
  assert.equal(original.status,spec.originalStatus,'Inherited original status');assert.equal(T.sha(JSON.stringify(trace(original))),spec.originalTraceSha256,'Inherited original complete trace');
  if(['D41','D43'].includes(row.defect)){
   assert(expectedCell,'Sealed expected cell');
   const actual=T.runRaw({...shared,candidate:path.join(root,'rebuild/engine'),inventory});assert.equal(actual.status,'GREEN');assert.equal(JSON.stringify(trace(actual))===expectedCell.expected,true,'Exact source-derived full output/inputs/aliases/receipts');
   newComparisons++;
  }else{
   const actual=T.runRaw({...shared,candidate:path.join(root,'rebuild/engine'),inventory});assert.equal(actual.status,spec.candidateStatus,'Inherited candidate status');assert(equal(actual.error??null,spec.exception),'Inherited exception');
   if(row.defect==='D45')custody.compareRaw({original,current:actual,cell});else Parent.compare(original,actual,row.outputDeltas.find(x=>x.mode===cell.mode&&x.day===cell.day));
  }
  checked++;
  if(checked%4===0)console.log('LOAD TRACE '+row.defect+': 4/4 complete comparisons PASS');
 }
 assert.equal(checked,180);assert.equal(newComparisons,8);
 console.log('LOAD WRITE TRACES: 180/180 complete raw comparisons PASS; 8 source-derived load comparisons; inherited import/D12/D45 accounting preserved; PACKAGE receipt PENDING');
}catch(error){
 // Only synthetic case identity is public. Error details/returned traces may
 // include protected source context and must never be forwarded to chat or git.
 const dir=path.join(root,'.tmp/load-write-traces');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'failure.json'),JSON.stringify({case:currentCase,code:error.code==='ERR_ASSERTION'?'ASSERTION':'EXECUTION'}));
 console.error('LOAD WRITE TRACES FAIL at '+currentCase+'; protected details withheld');process.exitCode=1;
}finally{custody.dispose();}
