'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const H=require('../helpers/step-candidate-test-context.cjs'),A=require('../acceptance.cjs'),L=require('../legacy-gates.cjs'),T=require('../target.cjs');
const root=path.resolve(__dirname,'../../../../..');
test('Historical STEP descriptor remains unchanged while real ERA candidate and carrier are verified',()=>{
  const step=A.stepParentArtifact(root),before=JSON.stringify(step),context=H.stepCandidateContext({root,stepAcceptance:step});
  assert.equal(context.profile,'M2-SET-ONE-ERA');assert.equal(context.acceptance.packageId,'M2-SET-ONE-ERA');
  assert.equal(context.candidateInventory['volume.cjs'],T.sha(fs.readFileSync(path.join(root,'rebuild/engine/volume.cjs'))));
  assert.notEqual(context.candidateInventory['volume.cjs'],step.candidateEngine['volume.cjs']);
  assert.equal(context.carrier,require('../legacy-set-one-era-carriers.cjs'));assert.equal(JSON.stringify(step),before);
});
test('Absent ERA files retain actual pinned STEP product; partial pair and wrong product refuse',()=>{
  const parent=path.join(root,'.tmp/postfix/step-context-tests');fs.mkdirSync(parent,{recursive:true});const copy=fs.mkdtempSync(path.join(parent,'parent-'));
  const step=A.stepParentArtifact(root),binding=A.parentBinding(root),write=(f,b)=>{const out=path.join(copy,f);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,b);};
  try{
    cp.execFileSync('git',['clone','--shared','--no-checkout','--quiet',root,copy],{windowsHide:true,stdio:['ignore','pipe','pipe']});
    cp.execFileSync('git',['-C',copy,'update-ref','--no-deref','HEAD',A.STEP_PARENT_PIN.candidateCommit],{windowsHide:true,stdio:['ignore','pipe','pipe']});
    for(const pin of [binding.artifact,binding.operational])write(pin.file,L.object(root,pin.commit,pin.file));
    for(const file of Object.keys(step.candidateEngine))write('rebuild/engine/'+file,L.object(root,A.STEP_PARENT_PIN.candidateCommit,'rebuild/engine/'+file));
    const context=H.stepCandidateContext({root:copy,stepAcceptance:step});assert.equal(context.profile,'M2-STEP-EFFICACY');assert.equal(context.acceptance,step);assert.deepEqual(context.candidateInventory,step.candidateEngine);assert.equal(context.carrier,require('../legacy-step-efficacy-carriers.cjs'));
    const volume=path.join(copy,'rebuild/engine/volume.cjs'),bytes=fs.readFileSync(volume);fs.appendFileSync(volume,'\n');assert.throws(()=>H.stepCandidateContext({root:copy,stepAcceptance:step}),{code:'UNAPPROVED-SOURCE-DELTA'});fs.writeFileSync(volume,bytes);
    write(A.ERA_FILE,'{}\n');assert.throws(()=>H.stepCandidateContext({root:copy,stepAcceptance:step}),{code:'STEP-TEST-ERA-PAIR'});
  }finally{assert(path.resolve(copy).startsWith(path.resolve(parent)+path.sep));fs.rmSync(copy,{recursive:true,force:true});}
});
