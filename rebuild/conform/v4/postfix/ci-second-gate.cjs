'use strict';
// This CI gate is evidence, not PACKAGE acceptance. It uses the integrator's
// unchanged custody implementation and the actual candidate in its one existing
// fixed-clock domain. No protected helper text is forwarded to public output.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const PROFILE='M2-STEP-EFFICACY';
const ERA_PROFILE='M2-SET-ONE-ERA';
const HELPER='rebuild/conform/v4/postfix/step-efficacy-second-gate.cjs';
const HELPER_SHA='f608d2eac7047632bce4c97e920c59e09669ecf86179e39a7169ff11721aecb4';
const CUSTODY='rebuild/conform/v4/postfix/helpers/step-efficacy-d45-custody.cjs';
const SITE='tools/engine-test.jsx:106:5';
const SURFACE=['2026-08-06/stepEfficacy/resolved','2026-08-06/stepEfficacy/slopePer1k','2026-08-07/stepEfficacy/resolved','2026-08-07/stepEfficacy/slopePer1k'];
const LEGACY=['4818:PASS','4820:PASS','4821:PASS','4822:PASS','4825:PASS','4826:PASS'];
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function fail(code){const e=Error(code);e.code=code;throw e;}
function args(argv){if(argv.length!==2||argv[0]!=='--profile'||![PROFILE,ERA_PROFILE].includes(argv[1]))fail('CI-PROFILE');return argv[1];}
function requirePinnedHelper(root,a){const file=path.join(root,HELPER);if(a.executionPins[HELPER]!==HELPER_SHA||crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==HELPER_SHA)fail('CI-CUSTODY-PIN');if(!Object.hasOwn(a.executionPins,CUSTODY)||!fs.existsSync(path.join(root,CUSTODY)))fail('CI-CUSTODY-PENDING');return require(file);}
function validateEvidence(r){
  if(!r||r.id!=='second-gate'||r.mode!=='frozen'||r.status!=='PASS'||r.candidateKind!=='rebuild/engine via second-gate-adapter.mjs')fail('CI-ACTUAL-CANDIDATE');
  if(r.projection?.preimageOccurrences!==1||r.projection.bytesDelta!==-9)fail('CI-PROJECTION');
  const e=r.expected106;
  if(!e||e.derivedFrom!=='frozen fe516c1 src/app.jsx + one-expression projection, harness clock'||e.frozenSatisfiesOriginalPredicate!==true||e.projectedSatisfiesOriginalPredicate!==false||['statusUnchanged','nNeedExcludedBoundUnchanged','signPreserved','resolvedFlips'].some(k=>e[k]!==true))fail('CI-106-EXPECTATION');
  if(r.surface?.exactDelta!=='PASS'||!equal(r.surface.pointerPathsChangedByProjection,SURFACE))fail('CI-SURFACE-INVENTORY');
  const n=r.negativeControl;
  if(!n||n.engine!=='unprojected frozen'||n.exitNonZero!==true||!equal(n.failSites,[SITE])||n.expect106Calls!==1||!Number.isSafeInteger(n.observedBeforeHarnessExit)||n.observedBeforeHarnessExit<1||n.observedBeforeHarnessExit>=3072||!equal(n.violations,[]))fail('CI-NEGATIVE-CONTROL');
  if(r.driver?.diskUntouched!==true||!Array.isArray(r.driver.edits)||r.driver.edits.length!==7||r.driver.edits.some(x=>x.occurrences!==1))fail('CI-ORIGINAL-DRIVER');
  const c=r.custody;
  if(!c||c.substitutions!==1||c.expect106Calls!==1||!equal(c.surfaceCalls,{reference:1,candidate:1})||c.carriedSite!==SITE||c.carriedSiteOccurrences!==1)fail('CI-CUSTODY-ACCOUNTING');
  const g=r.gate;
  if(!g||g.catalogTotal!==3072||g.referenceObserved!==3072||g.candidateObserved!==3072||!equal(g.failSites,[])||!equal(g.legacyMkPushable,LEGACY)||g.randomCallsEqual!==true||!equal(g.networkCalls,[6,6])||!equal(g.violations,[[],[]])||!Array.isArray(g.lines)||!g.lines.some(s=>/^SECOND GATE candidate: PASS;/.test(s))||!g.lines.some(s=>/^SECOND GATE reference surface: byte-identical to committed baseline /.test(s)))fail('CI-SITE-ACCOUNTING');
  return {reference:3072,candidate:3072,surface:4,legacy:6,fixedClockRuns:1};
}
function quiet(fn){
  const captured=[],saved={out:process.stdout.write,err:process.stderr.write};let size=0,overflow=false;
  const capture=(chunk,encoding,callback)=>{const text=Buffer.isBuffer(chunk)?chunk.toString(typeof encoding==='string'?encoding:'utf8'):String(chunk);size+=Buffer.byteLength(text);if(size>4*1024*1024){overflow=true;fail('CI-OUTPUT-LIMIT');}captured.push(text);const cb=typeof encoding==='function'?encoding:callback;if(typeof cb==='function')cb();return true;};
  process.stdout.write=capture;process.stderr.write=capture;
  try{const value=fn(captured);if(overflow)fail('CI-OUTPUT-LIMIT');return value;}finally{process.stdout.write=saved.out;process.stderr.write=saved.err;}
}
function inspectStrings(value,guard,seen=new Set()){
  if(typeof value==='string'){guard(value);return;}
  if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);
  for(const [key,d]of Object.entries(Object.getOwnPropertyDescriptors(value))){guard(key);if(!Object.hasOwn(d,'value')){if(value instanceof Error&&key==='stack')continue;fail('CI-EVIDENCE-ACCESSOR');}inspectStrings(d.value,guard,seen);}
}
function finish({result,error,captured},guard){
  if(typeof guard!=='function')fail('CI-CUSTODY-PENDING');
  // Canary covers complete old/new D45 context strings. Scalar privacy instead
  // comes from the closed formatter: no returned text or JSON is ever emitted.
  guard(captured.join(''));inspectStrings(result,guard);inspectStrings(error,guard);
  if(error)fail('CI-SECOND-GATE-FAILED');return validateEvidence(result);
}
function run({root,profile}){
  if(![PROFILE,ERA_PROFILE].includes(profile))fail('CI-PROFILE');root=fs.realpathSync(root);
  return quiet(captured=>{
    let custody,work,result,error;
    try{
      const A=require('./acceptance.cjs'),P=require('./package-runner.cjs'),S=require('./source-proof.cjs');
      const {acceptance:a,envelope:e,bytes}=A.load(root,A.envelopeFile(profile));A.validate(a);
      if(a.packageId!==profile)fail('CI-PROFILE');
      P.checkPins(root,a);S.verifyProductSources({root,baseline:root,acceptance:a,gitHead:true});
      // PENDING review is allowed for CI evidence; actual recorded owner/theme
      // and inherited acceptance receipts are still checked before execution.
      A.verifyReceipts(root,a,e,bytes);
      // Reuse only the exact immutable STEP expectation/custody descriptor;
      // source verification above still checks the entire actual ERA candidate.
      const descriptor=profile===ERA_PROFILE?A.stepParentArtifact(root):a;
      const I=requirePinnedHelper(root,a),D=require(path.join(root,CUSTODY));
      if(typeof D.prepareCustody!=='function')fail('CI-CUSTODY-PENDING');
      const parent=path.join(root,'.tmp/postfix/ci-second-gate');fs.mkdirSync(parent,{recursive:true});work=fs.mkdtempSync(path.join(parent,'run-'));
      const frozen=I.buildReferenceBundle({root,baseline:root,dir:path.join(work,'frozen'),projected:false}),bundles={main:frozen.file};
      custody=D.prepareCustody({root,baseline:root,bundles,acceptance:descriptor});
      if(!custody||typeof custody.assertSafePublicText!=='function'||typeof custody.dispose!=='function')fail('CI-CUSTODY-PENDING');
      result=I.runSecondGate({root,baseline:root,bundles,acceptance:descriptor,mode:'frozen',prototypeCandidateAdapter:false});
    }catch(e){error=e;}
    try{if(!custody)fail('CI-PREFLIGHT-FAILED');return finish({result,error,captured},text=>custody.assertSafePublicText(text));}
    finally{try{custody?.dispose();}finally{if(work){const parent=path.join(root,'.tmp/postfix/ci-second-gate');if(!path.resolve(work).startsWith(parent+path.sep))fail('CI-SCRATCH-PATH');fs.rmSync(work,{recursive:true,force:true});}}}
  });
}
function publicLine(counts){if(!equal(counts,{reference:3072,candidate:3072,surface:4,legacy:6,fixedClockRuns:1}))fail('CI-PUBLIC-COUNTS');return 'CI SECOND GATE PASS; 3072 reference / 3072 candidate assertions; 4 surface cells; 6 legacy sites; 1 fixed-clock run';}
module.exports={PROFILE,ERA_PROFILE,HELPER,HELPER_SHA,CUSTODY,args,requirePinnedHelper,validateEvidence,quiet,finish,run,publicLine};
if(require.main===module){try{const profile=args(process.argv.slice(2));const counts=run({root:path.resolve(__dirname,'../../../..'),profile});console.log(publicLine(counts));}catch(_){console.error('CI SECOND GATE FAIL');process.exitCode=1;}}
