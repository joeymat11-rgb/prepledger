'use strict';
// Exact successors of immutable original gate programs. Actual candidate calls
// remain at root/rebuild/engine; the accepted STEP artifact is custody metadata.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const {spawnSync}=require('node:child_process');
const P=require('./legacy-carriers.cjs'),STEP=require('./legacy-step-efficacy-carriers.cjs');
const L=require('./legacy-gates.cjs'),S=require('./source-proof.cjs'),A=require('./acceptance.cjs');
const {sha,fail}=require('./target.cjs');
const CARRIER_IDS=Object.freeze([...STEP.CARRIER_IDS,'defect-witnesses-4']);
const SOURCE_IDS=Object.freeze(['migrate-source','merge-source','writers-source']);
const WITNESS_PIN='c90ffeaa953a9b04146432f39702f87fc8c51ce7f0be77876f075fc4142b87f7';
const WITNESS_BEFORE='  assert.equal(result.status, "LIVE");\n  assert.equal(result.n, 4);\n  assert.equal(result.from, "2026-08-10");\n  assert.ok(result.lo > 0);';
const WITNESS_AFTER='  assert.deepEqual(result, { status: "COUNTING", exId: "synthetic-press", n: 1, need: 4 });';
function prepareCarrier(id,bytes){
  if(!CARRIER_IDS.includes(id))fail('ERA-CARRIER-ID');
  if(id==='defect-witnesses-4'){
    if(sha(bytes)!==WITNESS_PIN)fail('ERA-WITNESS-PIN');const edits=[];
    const source=P.exactReplace(bytes.toString('utf8'),WITNESS_BEFORE,WITNESS_AFTER,'D30-one-current-era-observation',edits);
    return{source,edits,sourceHash:sha(bytes),carrierHash:sha(source)};
  }
  const prior=STEP.prepareCarrier(id,bytes);
  if(!SOURCE_IDS.includes(id))return prior;
  let source=prior.source;const edits=[...prior.edits];
  const substitutions={
    'migrate-source':[
      'else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]), "prior module bytes " + file);',
      'else if (file === "volume") __carrier.priorVolume(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative])); else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]), "prior module bytes " + file);'],
    'merge-source':[
      'else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);',
      'else if (file === "volume") __carrier.priorVolume(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative])); else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);'],
    'writers-source':[
      "else assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);",
      "else if(name==='volume') __carrier.priorVolume(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p])); else assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);"]
  };
  source=P.exactReplace(source,...substitutions[id],'D30-exact-prior-volume-module',edits);
  return{...prior,source,edits,carrierHash:sha(source)};
}
function pinned({root,baseline,id}){
  const rel='rebuild/engine/test/'+id+'.cjs',bytes=L.object(baseline,P.ORIGINAL_COMMIT,rel);
  if(!bytes.equals(fs.readFileSync(path.join(root,rel))))fail('ERA-CARRIER-ORIGINAL-DISK');
  return bytes;
}
let activeContext;
function context(){if(!activeContext)fail('ERA-CARRIER-NO-CONTEXT');return activeContext;}
function compile(root,id,source){
  const file=path.join(root,'rebuild/engine/test',id+'.cjs'),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
  m._compile('const __carrier = require('+JSON.stringify(__filename)+').context();\nconst console = {log: (...a) => __carrier.capture(a)};\n'+source,file);
}
function runWorker(input){
  const {id,root,baseline,bundles,acceptance,mode}=input;
  if(acceptance?.packageId!=='M2-SET-ONE-ERA'||!CARRIER_IDS.includes(id)||!['frozen','native','trap'].includes(mode))fail('ERA-CARRIER-CONFIG');
  if(id==='defect-witnesses-4'&&mode!=='frozen')fail('ERA-WITNESS-ORIGINAL-MODE');
  S.verifyProductSources({root,baseline,acceptance,gitHead:true});
  // This is the immutable, independently verified parent's expectation object,
  // never a rewritten package ID or a substitute source check for this candidate.
  const parent=A.verifyAcceptedParent(root,acceptance,{gitHead:true});
  if(['defect-witnesses-7','writers-differential'].includes(id)){
    const custody=require('./helpers/step-efficacy-d45-custody.cjs').prepareCustody({...input,acceptance:parent});
    try{const out=custody.runLegacy(id,mode);custody.assertSafePublicText(JSON.stringify(out));return out;}finally{custody.dispose();}
  }
  if(id==='second-gate'){
    const custody=require('./helpers/set-one-era-protected.cjs').prepareSeededSetOneCard({root});
    try{
      if(custody.sourceVerdict.status!=='PASS')fail('ERA-SEEDED-SET-ONE-MOVED');
      // Both the new source expectations and the unchanged STEP helper's own
      // expectations are ready before the first actual candidate comparison.
      const prior=require('./step-efficacy-second-gate.cjs').runSecondGate({...input,acceptance:parent});
      const seededSetOne={source:custody.sourceVerdict,candidate:custody.compareCandidate({candidate:path.join(root,'rebuild/engine'),inventory:acceptance.candidateEngine})};
      if(seededSetOne.candidate.status!=='PASS')fail('ERA-SEEDED-SET-ONE-MOVED');
      return{...prior,seededSetOne};
    }finally{custody.dispose();}
  }
  if(!SOURCE_IDS.includes(id)&&!['defect-witnesses-2','defect-witnesses-4'].includes(id))return P.runCarrier(input);
  const prepared=prepareCarrier(id,pinned(input)),visited=[],outputs=[];
  activeContext={capture:args=>outputs.push(args.map(String).join(' ')),
    sourceDeclaration(name,actual,original){if(['migrate','isPristineSeed','dataLossGuard'].includes(name)){assert.notEqual(actual,original);visited.push(name);}else assert.equal(actual,original);},
    priorMigrate(actual,original){assert.notEqual(actual,original);visited.push('migrate.cjs');},
    priorEnergy(actual,original){assert.equal(actual,S.applyStepEfficacyChange(original,acceptance.sourceChanges[5]));visited.push('energy.cjs');},
    priorVolume(actual,original){assert.equal(actual,S.applySetOneEraChanges(original,acceptance.sourceChanges.slice(6)));visited.push('volume.cjs');}
  };
  const native=globalThis.Date;process.env.ENGINE_MAIN=bundles.main;process.env.ENGINE_OLD=bundles.old||bundles.main;process.env.TZ='America/New_York';process.env.MEASURED_TEST_NOW='2026-09-03';process.argv=[process.execPath,path.join(root,'rebuild/engine/test',id+'.cjs'),'--worker',mode];
  try{
    if(mode==='frozen')globalThis.Date=class extends native{constructor(...a){super(...(a.length?a:[1788451200000]));}static now(){return 1788451200000;}};
    compile(root,id,prepared.source);
    if(id==='migrate-source')assert.deepEqual(visited,['migrate','isPristineSeed','dataLossGuard','energy.cjs','volume.cjs']);
    else if(SOURCE_IDS.includes(id))assert.deepEqual(visited,['energy.cjs','volume.cjs','migrate.cjs']);
    else {const codes=outputs.filter(x=>x.startsWith('REPRODUCED ')).map(x=>x.slice(11,14));assert.deepEqual(codes,id==='defect-witnesses-4'?['D28','D29','D30','D31','D32']:Array.from({length:11},(_,i)=>'D'+(i+11)));}
  }finally{globalThis.Date=native;activeContext=null;}
  return{id,mode,status:'PASS',tail:id.toUpperCase()+' ERA SUCCESSOR PASS — '+(SOURCE_IDS.includes(id)?'complete prior modules checked against exactly nine reviewed source changes':id==='defect-witnesses-4'?'all five original witnesses; exact D30 current-era COUNTING result; D28/29/31/32 unchanged':'all eleven original witnesses; inherited exact D12 result'),edits:prepared.edits,sourceVisited:visited};
}
function runCarrier(input){
  const child=spawnSync(process.execPath,[__filename,'--carrier-worker'],{cwd:input.root,encoding:'utf8',input:JSON.stringify(input),windowsHide:true,timeout:1200000,maxBuffer:4*1024*1024,env:{...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03'}});
  if(child.error)fail('ERA-CARRIER-PROCESS');let result;try{result=JSON.parse(child.stdout);}catch{fail('ERA-CARRIER-OUTPUT');}
  if(child.status!==0||result.status!=='PASS')fail(result.code||'ERA-CARRIER-FAILED');return result;
}
module.exports={CARRIER_IDS,SOURCE_IDS,WITNESS_PIN,WITNESS_BEFORE,WITNESS_AFTER,prepareCarrier,runCarrier,context};
if(require.main===module){try{if(process.argv.length!==3||process.argv[2]!=='--carrier-worker')fail('ERA-CARRIER-CLI');process.stdout.write(JSON.stringify(runWorker(JSON.parse(fs.readFileSync(0,'utf8')))));}catch(e){process.stdout.write(JSON.stringify({status:'FAIL',code:e.code||'ERA-CARRIER-ASSERTION'}));process.exitCode=1;}}
