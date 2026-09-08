'use strict';
// Fixed D30 artifact assembly from sealed source-authored evidence. This is not
// an expectation author, a gate runner, or a review-receipt issuer. It always
// emits PENDING/null and preserves the immutable accepted STEP/import parents.
const fs=require('node:fs'),path=require('node:path');
const A=require('../acceptance.cjs'),S=require('../source-proof.cjs'),L=require('../legacy-gates.cjs'),T=require('../target.cjs'),P=require('../package-runner.cjs');
const {parseExact}=require('../strict-json.cjs');
const {parseCompactExact}=require('./set-one-era-compact-json.cjs');
const PREFIX='rebuild/conform/v4/postfix',FIXTURE=PREFIX+'/fixtures/set-one-era-deltas.json',RAW='.tmp/postfix/raw-set-one-era.json',MUTANTS=PREFIX+'/helpers/set-one-era-mutants.cjs';
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),copy=structuredClone;
function fail(code){const e=Error(code);e.code=code;throw e;}
function read(root,file){return fs.readFileSync(path.join(root,file));}
function rawDeltas(raw,row,matrix){
 if(!raw||!Array.isArray(raw.outputDeltas)||!equal(raw.law,row.law))fail('ERA-BUILD-RAW-LAW');
 if(!equal(raw.outputDeltas.map(({mode,day})=>({mode,day})),matrix))fail('ERA-BUILD-RAW-MATRIX');
 return raw.outputDeltas.map((x,i)=>{
  A.keys(x,['mode','day','originalVerdict','candidateVerdict','originalTraceSha256','delta'],'ERA-BUILD-RAW-SCHEMA');
  if(x.originalVerdict!=='RED'||x.candidateVerdict!=='GREEN'||x.originalTraceSha256!==row.rawExpectations[i].originalTraceSha256)fail('ERA-BUILD-RAW-PREIMAGE');
  return {mode:x.mode,day:x.day,originalTraceSha256:x.originalTraceSha256,delta:x.delta};
 });
}
function executionPins(root){
 const excluded=[A.ERA_FILE,A.envelopeFile('M2-SET-ONE-ERA')];
 const files=fs.readdirSync(path.join(root,PREFIX),{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>path.relative(root,path.join(x.parentPath,x.name)).split(path.sep).join('/')).filter(x=>!excluded.includes(x)).sort();
 return Object.fromEntries(files.map(file=>[file,T.sha(read(root,file))]));
}
function build({root,candidateBase=A.ERA_ANCHOR}){
 root=fs.realpathSync(root);if(L.git(root,['rev-parse','--show-toplevel']).toString().trim().replace(/\\/g,'/')!==root.replace(/\\/g,'/'))fail('ERA-BUILD-ROOT');
 const parent=A.stepParentArtifact(root),binding=A.stepParentBinding(root),a=copy(parent),fixtureBytes=read(root,FIXTURE),fixture=parseCompactExact(fixtureBytes),rawBytes=read(root,RAW),raw=parseExact(rawBytes);
 if(!Array.isArray(fixture)||fixture.length!==1||fixture[0].defect!=='D30')fail('ERA-BUILD-FIXTURE');A.keys(fixture[0],['defect','cases'],'ERA-BUILD-FIXTURE');
 Object.assign(a,{packageId:'M2-SET-ONE-ERA',codeBaseAnchor:A.ERA_ANCHOR,requiredIds:A.requiredIds('M2-SET-ONE-ERA'),selectedApprovedFixIds:A.requiredIds('M2-SET-ONE-ERA'),newlySelectedIds:['D30'],carriedAcceptedIds:copy(A.STEP_REQUIRED),acceptedParent:binding,contracts:[...parent.contracts,copy(A.ERA_CONTRACT)],caseModule:PREFIX+'/laws/set-one-era.cjs',helperFiles:{hosts:PREFIX+'/helpers/set-one-era-frozen.cjs',frozen:PREFIX+'/helpers/set-one-era-frozen.cjs'}});
 const original=L.object(root,a.baseline.auditCommit,S.ERA_FILE).toString('utf8'),volume=read(root,S.ERA_FILE).toString('utf8'),changes=S.proposeSetOneEraChanges(original,volume);
 a.sourceChanges=[...copy(parent.sourceChanges),...changes];a.candidateEngine={...parent.candidateEngine,'volume.cjs':T.sha(volume)};
 const row=a.inventory.find(r=>r.defect==='D30');row.themeAcceptance='theme';row.implementation='PRESENT';row.sourceDeltas=changes.map(x=>x.id);row.cases=fixture[0].cases;row.outputDeltas=rawDeltas(raw,row,a.matrix);row.mutants=require(path.join(root,MUTANTS)).definitions(volume);for(const cell of row.rawExpectations)cell.candidateStatus='GREEN';
 const ledger=L.object(root,candidateBase,'rebuild/DECISIONS.md').toString('utf8').split(/\r?\n/),line=ledger[81];if(T.sha(line||'')!==A.ERA_THEME_SHA)fail('ERA-BUILD-THEME-RECEIPT');
 a.authorizations.theme={role:'cowork',line,lineSha256:T.sha(line)};a.authorizations.review={role:'cowork',prefix:'POSTFIX-ACCEPTANCE M2-SET-ONE-ERA',terminal:'ACCEPTED'};
 a.executionPins=executionPins(root);A.validate(a);if(A.missing(a).length)fail('ERA-BUILD-INCOMPLETE');
 // Compact serialization changes no semantic cell and avoids pretty-print
 // expansion of the complete typed traces. Original fixture bytes stay intact.
 const bytes=Buffer.from(JSON.stringify(a)+'\n'),e={version:2,acceptanceFile:A.ERA_FILE,acceptanceSha256:T.sha(bytes),candidateBase,receipts:{}};
 for(const key of ['owner','contract','theme']){const claim=a.authorizations[key];e.receipts[key]={commit:candidateBase,path:'rebuild/DECISIONS.md',line:claim.line,lineSha256:claim.lineSha256};}
 e.receipts.review={status:'PENDING',receipt:null};A.envelope(e);A.ancestry(root,a,e);if(A.verifyReceipts(root,a,e,bytes)!==false)fail('ERA-BUILD-REVIEW-NOT-PENDING');S.verifyProductSources({root,baseline:root,acceptance:a,gitHead:false});P.caseInventory(root,a);
 const envelopeBytes=Buffer.from(JSON.stringify(e,null,2)+'\n');
 const summary={status:'REVIEW-PENDING',artifactFile:A.ERA_FILE,artifactSha256:T.sha(bytes),artifactBytes:bytes.length,envelopeFile:A.envelopeFile(a),envelopeSha256:T.sha(envelopeBytes),serialization:'compact JSON plus LF',candidateBase,fixtureSha256:T.sha(fixtureBytes),fixtureBytes:fixtureBytes.length,rawSha256:T.sha(rawBytes),executionPinCount:Object.keys(a.executionPins).length,sourceChangeCount:a.sourceChanges.length,requiredIds:a.requiredIds,newCaseCount:row.cases.length,totalCaseCount:a.inventory.reduce((n,r)=>n+r.cases.length,0),totalFaultDefinitions:a.inventory.reduce((n,r)=>n+r.mutants.length,0),rawComparisons:a.inventory.length*a.matrix.length,gates:a.gates.length};
 return {acceptance:a,envelope:e,bytes,envelopeBytes,summary};
}
function write({root,candidateBase}){const result=build({root,candidateBase});fs.writeFileSync(path.join(root,A.ERA_FILE),result.bytes);fs.writeFileSync(path.join(root,A.envelopeFile(result.acceptance)),result.envelopeBytes);fs.writeFileSync(path.join(root,'.tmp/postfix/set-one-era-artifact-build.json'),JSON.stringify(result.summary,null,2)+'\n');return result.summary;}
module.exports={FIXTURE,RAW,MUTANTS,rawDeltas,executionPins,build,write};
if(require.main===module){try{const args=process.argv.slice(2);if(args.length!==1||!['--check','--write'].includes(args[0]))fail('ERA-BUILD-ARGS');const root=path.resolve(__dirname,'../../../../..');const result=args[0]==='--write'?write({root}):build({root}).summary;console.log(JSON.stringify(result));}catch(e){console.error('ERA ARTIFACT BUILD FAIL '+(e.code||e.name));process.exitCode=1;}}
