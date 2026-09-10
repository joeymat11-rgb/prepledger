'use strict';
// Same independent protected expectation builder and exact validator as the
// accepted CI gate. Only source applicability uses the cumulative LOAD profile.
const fs=require('node:fs'),path=require('node:path');
const Profile=require('./load-write-profile.cjs'),context=Profile.verify(),{root,parent:a}=context;
const C=require('../../conform/v4/postfix/ci-second-gate.cjs');
function run(){return C.quiet(captured=>{
 let custody,work,result,error;
 try{
  const I=C.requirePinnedHelper(root,a),D=require(path.join(root,C.CUSTODY));
  const base=path.join(root,'.tmp/load-write-second');fs.mkdirSync(base,{recursive:true});work=fs.mkdtempSync(path.join(base,'run-'));
  const frozen=I.buildReferenceBundle({root,baseline:root,dir:path.join(work,'frozen'),projected:false}),bundles={main:frozen.file};
  custody=D.prepareCustody({root,baseline:root,bundles,acceptance:a});
  result=I.runSecondGate({root,baseline:root,bundles,acceptance:a,mode:'frozen',prototypeCandidateAdapter:false});
 }catch(e){error=e;}
 try{if(!custody)throw Error('Protected keeper unavailable');return C.finish({result,error,captured},text=>custody.assertSafePublicText(text));}
 finally{try{custody?.dispose();}finally{if(work){const base=path.join(root,'.tmp/load-write-second')+path.sep;if(!path.resolve(work).startsWith(base))throw Error('Scratch escape');fs.rmSync(work,{recursive:true,force:true});}}}
});}
module.exports={run};
if(require.main===module){try{console.log(C.publicLine(run()));console.log('LOAD SECOND GATE: actual candidate; cumulative source/parent preflight; independent LOAD acceptance '+(context.accepted?'RECORDED':'PENDING'));}catch(_){console.error('LOAD SECOND GATE FAIL; protected context withheld');process.exitCode=1;}}
