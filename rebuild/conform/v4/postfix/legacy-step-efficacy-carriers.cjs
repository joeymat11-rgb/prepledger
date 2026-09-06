'use strict';
// Closed successor of the accepted import carriers. Parent files stay exact.
// The protected second gate is authored independently by the integrator.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const {spawnSync}=require('node:child_process');
const parent=require('./legacy-carriers.cjs'),L=require('./legacy-gates.cjs'),S=require('./source-proof.cjs'),{sha,fail}=require('./target.cjs');
const CARRIER_IDS=Object.freeze([...parent.CARRIER_IDS,'defect-witnesses-2','second-gate','defect-witnesses-7','writers-differential']);
const SOURCE_IDS=['migrate-source','merge-source','writers-source'];
const WITNESS_PIN='833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2';
let activeContext;
const context=()=>{if(!activeContext)fail('STEP-CARRIER-NO-CONTEXT');return activeContext;};
function prepareCarrier(id,bytes){
  if(![...SOURCE_IDS,'defect-witnesses-2'].includes(id))fail('STEP-CARRIER-TARGET');
  let source,edits;
  if(id==='defect-witnesses-2'){
    if(sha(bytes)!==WITNESS_PIN)fail('STEP-WITNESS-ORIGINAL-PIN');source=bytes.toString('utf8');edits=[];
    source=parent.exactReplace(source,'assert.equal(step.slopePer1k, 100);','assert.equal(step.slopePer1k, 0.1);','D12-slope',edits);
    source=parent.exactReplace(source,'assert.equal(step.resolved, false);','assert.equal(step.resolved, true);','D12-resolved',edits);
  }else{
    const prepared=parent.prepareCarrier(id,bytes);source=prepared.source;edits=[...prepared.edits];
    const replace=(before,after)=>{source=parent.exactReplace(source,before,after,'D12-energy-source',edits);};
    if(id==='migrate-source')replace(
      'assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]), "prior module bytes " + file);',
      'if(file === "energy") __carrier.priorEnergy(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative])); else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", "7347ca976b1131cc44adc6a562c2a795c9e78d0b:" + relative]), "prior module bytes " + file);');
    else if(id==='merge-source')replace(
      'else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);',
      'else if(file === "energy") __carrier.priorEnergy(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative])); else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);');
    else replace(
      "else assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);",
      "else if(name==='energy') __carrier.priorEnergy(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p])); else assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);");
  }
  return {source,edits,sourceHash:sha(bytes),carrierHash:sha(source)};
}
function pinned(root,baseline,id){
  const relative='rebuild/engine/test/'+id+'.cjs',bytes=L.object(baseline,parent.ORIGINAL_COMMIT,relative);
  const expected=id==='defect-witnesses-2'?WITNESS_PIN:parent.ORIGINAL_PINS[id];
  if(sha(bytes)!==expected||!fs.readFileSync(path.join(root,relative)).equals(bytes))fail('STEP-CARRIER-ORIGINAL-PIN');return bytes;
}
async function runWorker(input){
  const {id,root,baseline,bundles,acceptance,mode}=input;
  if(!CARRIER_IDS.includes(id)||!(id==='writers-differential'?['frozen','native','trap']:['frozen','native']).includes(mode)||acceptance?.packageId!=='M2-STEP-EFFICACY')fail('STEP-CARRIER-CONFIG');
  if(id==='defect-witnesses-7'||id==='writers-differential'){
    S.verifyProductSources({root,baseline,acceptance,gitHead:true});
    const custody=require('./helpers/step-efficacy-d45-custody.cjs').prepareCustody(input);
    try{const result=custody.runLegacy(id,mode);custody.assertSafePublicText(JSON.stringify(result));return result;}finally{custody.dispose();}
  }
  if(id==='second-gate'){
    const file=path.join(__dirname,'step-efficacy-second-gate.cjs');
    if(!fs.existsSync(file))fail('STEP-CUSTODY-PENDING');
    return await require(file).runSecondGate(input);
  }
  if(!SOURCE_IDS.includes(id)&&id!=='defect-witnesses-2')return parent.runCarrier(input);
  S.verifyProductSources({root,baseline,acceptance,gitHead:true});
  const prepared=prepareCarrier(id,pinned(root,baseline,id)),visited=[],output=[];
  activeContext={capture:(...args)=>output.push(args.map(String).join(' ')),
    sourceDeclaration(name,actual,original){
      if(['migrate','isPristineSeed','dataLossGuard'].includes(name)){assert.notEqual(actual,original);visited.push(name);}
      else assert.equal(actual,original,'unchanged declaration '+name);
    },
    priorMigrate(actual,original){assert.notEqual(actual,original);visited.push('migrate.cjs');},
    priorEnergy(actual,original){assert.equal(actual,S.applyStepEfficacyChange(original,acceptance.sourceChanges[5]));visited.push('energy.cjs');}
  };
  const file=path.join(root,'rebuild/engine/test',id+'.cjs'),compiled=new Module(file,module);
  compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));
  process.env.ENGINE_MAIN=bundles.main;process.env.ENGINE_OLD=bundles.old||bundles.main;
  process.env.TZ='America/New_York';process.env.MEASURED_TEST_NOW='2026-09-03';
  process.argv=[process.execPath,file,'--worker',mode];
  const Native=globalThis.Date;
  try{
    if(mode==='frozen')globalThis.Date=class extends Native{constructor(...args){super(...(args.length?args:[1788451200000]));}static now(){return 1788451200000;}};
    compiled._compile('const __carrier=require('+JSON.stringify(__filename)+').context();\nconst console={log:(...a)=>__carrier.capture(...a)};\n'+prepared.source,file);
    if(id==='migrate-source')assert.deepEqual(visited,['migrate','isPristineSeed','dataLossGuard','energy.cjs']);
    else if(SOURCE_IDS.includes(id))assert.deepEqual(visited,['energy.cjs','migrate.cjs']);
    else{
      assert.deepEqual(output.filter(s=>s.startsWith('REPRODUCED ')).map(s=>/^REPRODUCED (D\d+) /.exec(s)?.[1]),Array.from({length:11},(_,i)=>'D'+(11+i)));
      assert(output.at(-1).startsWith('DEFECT WITNESSES 2: 11/11'));
    }
  }finally{globalThis.Date=Native;activeContext=null;}
  return {id,mode,status:'PASS',tail:id.toUpperCase()+' STEP SUCCESSOR PASS — '+(id==='defect-witnesses-2'?'11 original witnesses; only D12 slope/resolution expectations changed':'all original assertions; five accepted import changes plus exact D12 expression'),edits:prepared.edits,visited};
}
function runCarrier(input){
  const child=spawnSync(process.execPath,[__filename,'--carrier-worker'],{cwd:input.root,input:JSON.stringify(input),encoding:'utf8',windowsHide:true,
    timeout:1200000,maxBuffer:4*1024*1024,env:{...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03'}});
  if(child.error)fail('STEP-CARRIER-PROCESS');let result;try{result=JSON.parse(child.stdout);}catch{fail('STEP-CARRIER-OUTPUT');}
  if(child.status!==0||result.status!=='PASS')fail(result.code||'STEP-CARRIER-FAILED');return result;
}
module.exports={CARRIER_IDS,WITNESS_PIN,prepareCarrier,runCarrier,context};
if(require.main===module){
  if(process.argv.length!==3||process.argv[2]!=='--carrier-worker')fail('STEP-CARRIER-CLI');
  Promise.resolve().then(()=>runWorker(JSON.parse(fs.readFileSync(0,'utf8')))).then(r=>process.stdout.write(JSON.stringify(r))).catch(e=>{
    process.stdout.write(JSON.stringify({status:'FAIL',code:e.code||'STEP-CARRIER-ASSERTION'}));process.exitCode=e.code==='STEP-CUSTODY-PENDING'?2:1;
  });
}
