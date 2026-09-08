'use strict';
// Historical STEP assertions retain their immutable expectation descriptor while
// executing the actual descendant candidate. This selects only the named ERA
// descendant and verifies its complete product/parent proof, never its approval.
const fs=require('node:fs'),path=require('node:path');
const A=require('../acceptance.cjs'),S=require('../source-proof.cjs');
function fail(code){throw Object.assign(Error(code),{code});}
function stepCandidateContext({root,stepAcceptance}){
  if(stepAcceptance?.packageId!=='M2-STEP-EFFICACY')fail('STEP-TEST-DESCRIPTOR');
  const artifact=path.join(root,A.ERA_FILE),manifest=path.join(root,A.envelopeFile('M2-SET-ONE-ERA'));
  if(fs.existsSync(artifact)!==fs.existsSync(manifest))fail('STEP-TEST-ERA-PAIR');
  let acceptance=stepAcceptance,carrier='../legacy-step-efficacy-carriers.cjs';
  if(fs.existsSync(artifact)){
    const loaded=A.load(root,manifest);acceptance=loaded.acceptance;
    if(acceptance.packageId!=='M2-SET-ONE-ERA')fail('STEP-TEST-ERA-PROFILE');
    A.verifyReceipts(root,acceptance,loaded.envelope,loaded.bytes);
    const parent=A.verifyAcceptedParent(root,acceptance,{gitHead:true});
    if(JSON.stringify(parent.candidateEngine)!==JSON.stringify(stepAcceptance.candidateEngine)||JSON.stringify(parent.sourceChanges)!==JSON.stringify(stepAcceptance.sourceChanges))fail('STEP-TEST-PARENT-DESCRIPTOR');
    carrier='../legacy-set-one-era-carriers.cjs';
  }
  S.verifyProductSources({root,baseline:root,acceptance,gitHead:true});
  return Object.freeze({profile:acceptance.packageId,candidateInventory:Object.freeze({...acceptance.candidateEngine}),acceptance,carrier:require(carrier)});
}
module.exports={stepCandidateContext};
