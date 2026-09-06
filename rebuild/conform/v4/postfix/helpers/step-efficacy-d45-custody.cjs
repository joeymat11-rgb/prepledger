'use strict';
// Closed runtime-only D12 consequence custody. No protected answer-key bytes are persisted.
// askContext can incorporate protected authored history. Full values stay in
// memory; the only output contains source names, paths and Boolean verdicts.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const T=require('../target.cjs'),B=require('./build-step-efficacy-expectations.cjs');
const NativeDate=globalThis.Date;
const WITNESS='rebuild/engine/test/defect-witnesses-7.cjs';
const WITNESS_SHA='990e814209aac63537288d80127e6a088b375c19562820cfec7bfd1a19a08d8a';
const DIFFERENTIAL='rebuild/engine/test/writers-differential.cjs';
const DIFFERENTIAL_SHA='2fec66f65c55f751c749f827e5c0fca6a6747a9e8440ba66cd13d166f2951217';
const DIFFERENTIAL_COMPARE="assert.equal(a.json===b.json,true,fixture.name+' / '+expected.ctx.steps[n].name+' '+c.nowISO()+' byte '+p+' expected '+b.json.slice(p,p+140)+' actual '+a.json.slice(p,p+140));";
const RAW_PATH='/frames/0/after/4/1/5/1',WITNESS_PATH='/0/result';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const trace=r=>({frames:r.frames,detail:r.detail});
function fail(code){const e=new Error(code);e.code=code;throw e;}
function need(ok,code){if(!ok)fail(code);}
function paths(a,b,p=[],out=[]){
 if(same(a,b))return out;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b)){out.push('/'+p.join('/'));return out;}
 for(const k of new Set([...Object.keys(a),...Object.keys(b)])){
  if(!Object.hasOwn(a,k)||!Object.hasOwn(b,k))out.push('/'+[...p,k].join('/'));
  else paths(a[k],b[k],[...p,k],out);
 }
 return out;
}
function witnessRun({root,source,mode,project}){
 const file=path.join(root,WITNESS),bytes=fs.readFileSync(file);
 need(T.sha(bytes)===WITNESS_SHA,'D45-DIAG-WITNESS-PIN');
 const R=require(path.join(root,'rebuild/engine/test/writers-reference.cjs')),records=[];
 const observedAssert={...assert,equal(actual,expected,message){
  // Observe precisely the original full-frame equality site. Its mismatch
  // remains a reported mismatch; all other original assertions execute intact.
  if(typeof message==='string'&&/^D4[1-5] /.test(message)&&message.endsWith(': exact complete outputs and pre/post-call inputs')){
   records.push({label:message.split(' ')[0],original:JSON.parse(expected),actual:JSON.parse(actual)});return;
  }
  return assert.equal(actual,expected,message);
 }};
 const req=name=>{
  if(name==='node:assert/strict')return observedAssert;
  if(name==='node:child_process')return require(name);
  if(name==='../index.cjs')return project?{createEngine:options=>R.createWriterReference({clock:options.clock,Date:NativeDate,random:R.deterministicRandom(),enginePath:source.projection})}:require(path.join(root,'rebuild/engine/index.cjs'));
  if(name==='./writers-reference.cjs')return {...R,createWriterReference:options=>R.createWriterReference({...options,enginePath:source.bundle})};
  fail('D45-DIAG-WITNESS-IMPORT');
 };
 const run=vm.runInThisContext('(function(require,process,console,__filename){'+bytes.toString('utf8')+'\n})',{filename:file});
 try{
  globalThis.Date=NativeDate;
  run(req,{...process,argv:[process.execPath,file,'--worker',mode]},Object.freeze({log(){}}),file);
  need(same(records.map(r=>r.label),['D41','D42','D43','D44','D45']),'D45-DIAG-WITNESS-OCCURRENCES');
  return records;
 }finally{globalThis.Date=NativeDate;}
}
function differentialRun({root,source,mode,project}){
 const file=path.join(root,DIFFERENTIAL),bytes=fs.readFileSync(file),R=require(path.join(root,'rebuild/engine/test/writers-reference.cjs')),records=[];
 need(T.sha(bytes)===DIFFERENTIAL_SHA,'D45-DIAG-DIFFERENTIAL-PIN');
 const original=bytes.toString('utf8');need(original.split(DIFFERENTIAL_COMPARE).length===2,'D45-DIAG-DIFFERENTIAL-ONE-SITE');
 // Observe precisely the original equality call before its error message can
 // disclose state. The original source file and every other assertion stay intact.
 const observed=original.replace(DIFFERENTIAL_COMPARE,'__observe(fixture.name,expected.ctx.steps[n].name,clocks.indexOf(c),n,a,b);');
 const req=name=>{
  if(name==='node:assert/strict'||name==='node:child_process')return require(name);
  if(name==='../index.cjs')return project?{createEngine:options=>R.createWriterReference({clock:options.clock,Date:NativeDate,random:R.deterministicRandom(),enginePath:source.projection})}:require(path.join(root,'rebuild/engine/index.cjs'));
  if(name==='./writers-reference.cjs')return {...R,createWriterReference:options=>R.createWriterReference({...options,enginePath:source.bundle})};
  fail('D45-DIAG-DIFFERENTIAL-IMPORT');
 };
 const run=vm.runInThisContext('(function(require,process,console,__filename,__observe){'+observed+'\n})',{filename:file});
 try{
  globalThis.Date=NativeDate;
  run(req,{...process,argv:[process.execPath,file,'--worker',mode]},Object.freeze({log(){}}),file,(scenario,method,clockIndex,frame,actual,expected)=>records.push({scenario,method,clockIndex,frame,actual,expected}));
  return records;
 }finally{globalThis.Date=NativeDate;}
}
const S=require('../structural-delta.cjs'),SP=require('../source-proof.cjs');
const BASE=require('../manifest.json');
const PROJECTOR='rebuild/conform/v4/postfix/helpers/build-step-efficacy-expectations.cjs';
const REASON='D12 units correction changes the derived lab summary embedded in askContext; D45 effort-rule contradiction remains RED.';
function descriptor(projectorExecutionPin){
 need(typeof projectorExecutionPin==='string'&&/^[a-f0-9]{64}$/.test(projectorExecutionPin),'D45-CUSTODY-PROJECTOR-PIN');
 return {classification:'CONSEQUENTIAL-RED',cause:'D12',preservedDefect:'D45',reason:REASON,
  energyPreimageSha256:BASE.baseline.engine['energy.cjs'],oldExpression:SP.STEP_BEFORE,newExpression:SP.STEP_AFTER,
  projector:{file:PROJECTOR,executionPin:projectorExecutionPin},
  raw:{lawId:'V4-analyst-effort-rule-matches-writer',matrix:structuredClone(BASE.matrix),frame:0,name:'askContext',path:RAW_PATH},
  witness:{file:WITNESS,sourceSha256:WITNESS_SHA,defect:'D45',modes:['frozen','native'],frame:0,name:'askContext',path:WITNESS_PATH},
  differential:{file:DIFFERENTIAL,sourceSha256:DIFFERENTIAL_SHA,scenario:'plain-state day writer capture and supplied-doc ask',modes:['frozen','native','trap'],clockIndexes:[0,1],frame:4,name:'askContext',path:'/result'}};
}
function validateDescriptor(value,pin){need(same(value,descriptor(pin)),'D45-CUSTODY-DESCRIPTOR');return value;}
function prepareCustody({root,baseline,bundles,acceptance}){
 root=fs.realpathSync(root);need(acceptance?.packageId==='M2-STEP-EFFICACY','D45-CUSTODY-PROFILE');
 const row=acceptance.inventory.find(x=>x.defect==='D45'),pin=acceptance.executionPins[PROJECTOR];
 validateDescriptor(row?.consequence,pin);need(T.sha(fs.readFileSync(path.join(root,PROJECTOR)))===pin,'D45-CUSTODY-PROJECTOR-PIN');
 need(row.implementation==='PENDING'&&row.cases.length===0&&row.mutants.length===0&&row.outputDeltas.length===0,'D45-CUSTODY-NOT-A-REPAIR');
 need(!Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)),'D45-CUSTODY-CANDIDATE-EARLY');
 const source=B.createFrozenSource({root});
 need(bundles?.main&&path.isAbsolute(bundles.main)&&fs.statSync(bundles.main).isFile(),'D45-CUSTODY-FROZEN-BUNDLE');
 const suppliedBundleSha=T.sha(fs.readFileSync(bundles.main));
 const raws=new Map(),witnesses=new Map(),differentials=new Map(),secrets=new Set();let disposed=false;
 const key=c=>c.mode+'/'+c.day,active=()=>need(!disposed,'D45-CUSTODY-DISPOSED');
 const remember=s=>{need(typeof s==='string'&&s.length>0,'D45-CUSTODY-STRING');secrets.add(s);secrets.add(JSON.stringify(s).slice(1,-1));};
 const rawString=r=>r.frames[0].after[4][1][5][1];
 const safe=text=>{active();need(typeof text==='string','D45-CUSTODY-PUBLIC-TEXT');for(const secret of secrets)need(!text.includes(secret),'D45-CUSTODY-LEAK');return text;};
 for(const cell of BASE.matrix){
  const spec=row.rawExpectations.find(x=>x.mode===cell.mode&&x.day===cell.day);
  need(spec?.originalStatus==='RED'&&spec.candidateStatus==='RED','D45-CUSTODY-RAW-VERDICT');
  const common={kind:'raw-frozen',baseline,helperRoot:root,helperPins:acceptance.baseline.publicPins,law:row.law,traceProfile:2,...cell};
  const original=T.runRaw({...common,bundle:source.bundle,bundleSha256:source.bundleSha256});
  need(T.sha(JSON.stringify(trace(original)))===spec.originalTraceSha256,'D45-CUSTODY-ORIGINAL-TRACE-PIN');
  const suppliedOriginal=T.runRaw({...common,bundle:bundles.main,bundleSha256:suppliedBundleSha});
  need(suppliedOriginal.status==='RED'&&same(trace(original),trace(suppliedOriginal)),'D45-CUSTODY-SUPPLIED-FROZEN-TRACE');
  const projected=T.runRaw({...common,bundle:source.projection,bundleSha256:source.projectionSha256});
  need(original.status==='RED'&&projected.status==='RED'&&same(paths(trace(original),trace(projected)),[RAW_PATH]),'D45-CUSTODY-SOURCE-RAW');
  remember(rawString(original));remember(rawString(projected));
  const delta={aliases:[],cells:[{id:'D12-ASKCONTEXT-D45-RUNTIME',op:'replace',path:RAW_PATH.slice(1).split('/'),before:rawString(original),after:rawString(projected)}]};
  S.compareStructural(trace(original),trace(projected),delta);raws.set(key(cell),{original,projected,delta});
 }
 for(const mode of ['frozen','native']){
  const rows=witnessRun({root,source,mode,project:true});
  for(const r of rows){need(same(paths(r.original,r.actual),r.label==='D45'?[WITNESS_PATH]:[]),'D45-CUSTODY-SOURCE-WITNESS');if(r.label==='D45'){remember(r.original[0].result);remember(r.actual[0].result);}}
  witnesses.set(mode,rows);
 }
 for(const mode of ['frozen','native','trap']){
  const rows=differentialRun({root,source,mode,project:true}),changed=[];
  for(const r of rows)if(!same(r.expected,r.actual)){
   need(r.scenario==='plain-state day writer capture and supplied-doc ask'&&r.method==='askContext'&&r.frame===4&&same(paths(JSON.parse(r.expected.json),JSON.parse(r.actual.json)),['/result'])&&same(r.expected.aliases,r.actual.aliases),'D45-CUSTODY-SOURCE-DIFFERENTIAL');
   changed.push(r.clockIndex);remember(JSON.parse(r.expected.json).result);remember(JSON.parse(r.actual.json).result);
  }
  need(same(changed,[0,1]),'D45-CUSTODY-SOURCE-DIFFERENTIAL-OCCURRENCES');differentials.set(mode,rows);
 }
 need(!Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)),'D45-CUSTODY-SOURCE-LOADED-CANDIDATE');
 function compareRaw({original,current,cell}){
  active();const e=raws.get(key(cell));need(!!e,'D45-CUSTODY-CELL');
  need(original.status==='RED'&&current.status==='RED'&&same(trace(original),trace(e.original)),'D45-CUSTODY-RAW-PREIMAGE');
  try{S.compareStructural(trace(original),trace(current),e.delta);need(same(trace(current),trace(e.projected)),'D45-CUSTODY-RAW-MISMATCH');}catch{fail('D45-CUSTODY-RAW-MISMATCH');}
  return safe('D45 CONSEQUENTIAL-RED / exact source-derived runtime context / all other frames unchanged');
 }
 function runLegacy(id,mode){
  active();let expected,actual;
  if(id==='defect-witnesses-7'){
   expected=witnesses.get(mode);need(!!expected,'D45-CUSTODY-MODE');actual=witnessRun({root,source,mode,project:false});
   need(expected.length===actual.length,'D45-CUSTODY-WITNESS-OCCURRENCES');
   for(let i=0;i<expected.length;i++)need(expected[i].label===actual[i].label&&same(expected[i].original,actual[i].original)&&same(expected[i].actual,actual[i].actual),'D45-CUSTODY-WITNESS-MISMATCH');
  }else if(id==='writers-differential'){
   expected=differentials.get(mode);need(!!expected,'D45-CUSTODY-MODE');actual=differentialRun({root,source,mode,project:false});
   need(same(actual,expected),'D45-CUSTODY-DIFFERENTIAL-MISMATCH');
  }else fail('D45-CUSTODY-LEGACY-ID');
  const result={id,mode,status:'PASS',tail:id==='defect-witnesses-7'?'D45 WITNESS SUCCESSOR PASS — all original behavior assertions; exact D12 context consequence; D45 remains preserved':'WRITERS DIFFERENTIAL SUCCESSOR PASS — original roster, clocks, aliases, isolation and trap assertions; exact D12 context consequence only'};
  safe(JSON.stringify(result));return result;
 }
 return Object.freeze({compareRaw,runLegacy,assertSafePublicText:safe,dispose(){raws.clear();witnesses.clear();differentials.clear();secrets.clear();disposed=true;}});
}
module.exports={PROJECTOR,descriptor,validateDescriptor,prepareCustody};
