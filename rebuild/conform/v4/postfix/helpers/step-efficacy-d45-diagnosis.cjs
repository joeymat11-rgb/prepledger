'use strict';
// DIAGNOSIS ONLY: no expectation acceptance, carrier, law or output exemption.
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
function diagnose({root}){
 root=fs.realpathSync(root);const P=path.join(root,'rebuild/conform/v4/postfix');
 need(!Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)),'D45-DIAG-CANDIDATE-EARLY');
 const base=JSON.parse(fs.readFileSync(path.join(P,'manifest.json'),'utf8')),law=base.inventory.find(x=>x.defect==='D45').law;
 const source=B.createFrozenSource({root}),raw=[];
 // All source expectations, including the original witness cases in both
 // Date modes, are constructed before reading/loading the product candidate.
 for(const matrix of base.matrix){
  const common={kind:'raw-frozen',baseline:root,helperRoot:root,helperPins:base.baseline.publicPins,law,traceProfile:2,...matrix};
  raw.push({matrix,original:T.runRaw({...common,bundle:source.bundle,bundleSha256:source.bundleSha256}),projected:T.runRaw({...common,bundle:source.projection,bundleSha256:source.projectionSha256})});
 }
 const witnesses=['frozen','native'].map(mode=>({mode,rows:witnessRun({root,source,mode,project:true})}));
 const differentials=['frozen','native','trap'].map(mode=>({mode,rows:differentialRun({root,source,mode,project:true})}));
 need(!Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)),'D45-DIAG-SOURCE-LOADED-CANDIDATE');
 const candidate=path.join(root,'rebuild/engine'),inventory=Object.fromEntries(Object.keys(base.baseline.engine).map(f=>[f,T.sha(fs.readFileSync(path.join(candidate,f)))]));
 const result={status:'DIAGNOSIS ONLY — not acceptance',method:'Literal frozen source and exactly one reviewed units expression; all source results constructed before candidate reads; full traces remain memory-only.',raw:[],witnesses:[],differentials:[]};
 for(const {matrix,original,projected} of raw){
  const actual=T.runRaw({kind:'raw',baseline:root,candidate,inventory,law,traceProfile:2,...matrix});
  need(original.status==='RED'&&projected.status==='RED'&&actual.status==='RED','D45-DIAG-VERDICT-CHANGED');
  need(same(trace(projected),trace(actual)),'D45-DIAG-UNEXPLAINED-RAW');
  need(same(paths(trace(original),trace(projected)),[RAW_PATH]),'D45-DIAG-RAW-PATHS');
  need(original.frames[0].name==='askContext'&&projected.frames[0].name==='askContext'&&actual.frames[0].name==='askContext','D45-DIAG-RAW-FRAME');
  result.raw.push({...matrix,originalVerdict:'RED',projectedVerdict:'RED',candidateVerdict:'RED',sourceProjectionEqualsCandidate:true,changedFunction:'askContext',changedPath:RAW_PATH,unexplainedPaths:[]});
 }
 for(const pre of witnesses){
  const actual=witnessRun({root,source,mode:pre.mode,project:false});
  for(let i=0;i<pre.rows.length;i++){
   const a=pre.rows[i],b=actual[i],expectedPaths=a.label==='D45'?[WITNESS_PATH]:[];
   need(a.label===b.label&&same(a.original,b.original),'D45-DIAG-WITNESS-ORIGINAL');
   need(same(a.actual,b.actual),'D45-DIAG-UNEXPLAINED-WITNESS');
   need(same(paths(a.original,a.actual),expectedPaths),'D45-DIAG-WITNESS-PATHS');
   result.witnesses.push({mode:pre.mode,witness:a.label,originalEquality:a.label==='D45'?'FAIL':'PASS',originalBehaviorAssertions:'PASS',sourceProjectionEqualsCandidate:true,changedFunction:a.label==='D45'?'askContext':null,changedPaths:expectedPaths,unexplainedPaths:[]});
  }
 }
 for(const pre of differentials){
  const actual=differentialRun({root,source,mode:pre.mode,project:false}),changed=[];
  need(pre.rows.length===actual.length,'D45-DIAG-DIFFERENTIAL-OCCURRENCES');
  for(let i=0;i<pre.rows.length;i++){
   const a=pre.rows[i],b=actual[i];
   need(a.scenario===b.scenario&&a.method===b.method&&a.clockIndex===b.clockIndex&&a.frame===b.frame&&same(a.expected,b.expected),'D45-DIAG-DIFFERENTIAL-ORIGINAL');
   need(same(a.actual,b.actual),'D45-DIAG-UNEXPLAINED-DIFFERENTIAL');
   if(same(a.expected,a.actual))continue;
   const changedPaths=paths(JSON.parse(a.expected.json),JSON.parse(a.actual.json));
   need(a.scenario==='plain-state day writer capture and supplied-doc ask'&&a.method==='askContext'&&a.frame===4&&same(changedPaths,['/result'])&&same(a.actual.aliases,a.expected.aliases),'D45-DIAG-DIFFERENTIAL-PATHS');
   changed.push({scenario:a.scenario,clockIndex:a.clockIndex,frame:a.frame,method:a.method,changedPaths,aliasesUnchanged:true,sourceProjectionEqualsCandidate:true,originalEquality:'FAIL'});
  }
  need(same(changed.map(x=>x.clockIndex),[0,1]),'D45-DIAG-DIFFERENTIAL-CHANGED-OCCURRENCES');
  result.differentials.push({mode:pre.mode,originalBehaviorAndIsolationAssertions:'PASS',allOtherFramesAndAliasesUnchanged:true,changed,unexplainedPaths:[]});
 }
 return result;
}
module.exports={diagnose,WITNESS,WITNESS_SHA,RAW_PATH,WITNESS_PATH};
if(require.main===module)try{
 const result=diagnose({root:process.cwd()}),file=path.resolve('.tmp/postfix/d45-units-diagnosis.json');
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n');
 console.log('D45 DIAGNOSIS: raw4/4 RED preserved; original witness2/2 D45 equality still FAIL; writers differential3 modes/two clocks only askContext return differs; all behavior/isolation/alias assertions intact; exact one-expression source projection explains every changed frame; NOT acceptance.');
}catch(e){console.error('D45 DIAGNOSIS FAIL '+(e.code||e.name));process.exitCode=1;}
