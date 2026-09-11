'use strict';
// Same independent protected expectation builder and exact validator as the
// accepted CI gate, over the B0 candidate. The cumulative profile decides source
// applicability; the custody/helper pins the gate itself requires live in the
// IMMUTABLE M2-STEP-EFFICACY acceptance envelope (the grandparent), exactly as
// the parent package's own second-gate child used them — B0's own artifact pins
// its own execution and does not, and must not, restate those.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const Profile=require('./native-carriers-profile.cjs'),context=Profile.verify(),{root}=context;
const A=require('../../conform/v4/postfix/acceptance.cjs');
const loaded=A.load(root,path.join(root,'rebuild/conform/v4/postfix/manifest-step-efficacy.json'));
assert(A.verifyReceipts(root,loaded.acceptance,loaded.envelope,loaded.bytes),'Real accepted grandparent');
const a=loaded.acceptance;
const C=require('../../conform/v4/postfix/ci-second-gate.cjs');
function run(){return C.quiet(captured=>{
 let custody,work,result,error;
 try{
  const I=C.requirePinnedHelper(root,a),D=require(path.join(root,C.CUSTODY));
  const base=path.join(root,'.tmp/native-carriers-second');fs.mkdirSync(base,{recursive:true});work=fs.mkdtempSync(path.join(base,'run-'));
  const frozen=I.buildReferenceBundle({root,baseline:root,dir:path.join(work,'frozen'),projected:false}),bundles={main:frozen.file};
  custody=D.prepareCustody({root,baseline:root,bundles,acceptance:a});
  result=I.runSecondGate({root,baseline:root,bundles,acceptance:a,mode:'frozen',prototypeCandidateAdapter:false});
 }catch(e){error=e;}
 try{if(!custody)throw Error('Protected keeper unavailable');return C.finish({result,error,captured},text=>custody.assertSafePublicText(text));}
 finally{try{custody?.dispose();}finally{if(work){const base=path.join(root,'.tmp/native-carriers-second')+path.sep;if(!path.resolve(work).startsWith(base))throw Error('Scratch escape');fs.rmSync(work,{recursive:true,force:true});}}}
});}
module.exports={run};
if(require.main===module){try{console.log(C.publicLine(run()));console.log('NATIVE SECOND GATE: actual candidate; cumulative source/parent preflight; independent LOAD acceptance '+(context.accepted?'RECORDED':'PENDING'));}catch(_){console.error('NATIVE SECOND GATE FAIL; protected context withheld');process.exitCode=1;}}
