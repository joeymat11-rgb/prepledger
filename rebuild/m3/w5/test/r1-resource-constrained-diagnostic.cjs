'use strict';
// E1 DIAGNOSTIC ONLY. One unchanged complete resource workload in a child with
// constrained V8 old space. This is neither the total isolate limit nor a claim
// of production equivalence. No explicit collection or acceptance substitution.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const assert=require('node:assert/strict'),{createHash}=require('node:crypto'),{spawn}=require('node:child_process');
const FLAG='--max-old-space-size=128',LABEL='DIAGNOSTIC — NOT ACCEPTANCE';
const output=path.join(__dirname,'../.generated/r1-resource-constrained-diagnostic.json');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const write=value=>{fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(value,null,2)+'\n');};
function vectorSummary(result){
  const samples=result.phases.flatMap(p=>p.samples.map((s,index)=>({phase:p.name,index,...s})));
  if(result.incompletePhaseMemory)samples.push(...result.incompletePhaseMemory.samples.map((s,index)=>({phase:'INCOMPLETE',index,...s})));
  const vector=s=>s&&({phase:s.phase,index:s.index,label:s.label,usedSize:s.usedSize,totalSize:s.totalSize,
    embedderHeapUsedSize:s.embedderHeapUsedSize,backingStorageSize:s.backingStorageSize,
    observedAllocation:s.totalSize+s.embedderHeapUsedSize+s.backingStorageSize,
    usedPlusEmbedderPlusBacking:s.usedSize+s.embedderHeapUsedSize+s.backingStorageSize});
  const maximum=field=>vector(samples.reduce((best,s)=>!best||s[field]>best[field]?s:best,null));
  return {sampleCount:samples.length,simultaneousAllocationPeak:maximum('observedAllocation'),
    componentPeaks:Object.fromEntries(['usedSize','totalSize','embedderHeapUsedSize','backingStorageSize'].map(k=>[k,maximum(k)]))};
}
async function child(){
  assert.equal(process.env.MINIFLARE_WORKERD_V8_FLAGS,FLAG,'one exact child-only runtime flag');
  const original=path.join(__dirname,'r1-resource.test.cjs'),bytes=fs.readFileSync(original);
  const pins=['r1-resource.test.cjs','r1-resource-meter.cjs','r1-workerd.cjs','r1-resource-fixture.cjs',
    '../bridge.cjs','../reconciliation/codec.cjs'].map(file=>({file,sha256:sha(fs.readFileSync(path.join(__dirname,file)))}));
  const mfPath=require.resolve('miniflare'),mfBytes=fs.readFileSync(mfPath),mfText=mfBytes.toString('utf8');
  const passthrough='v8Flags: process.env.MINIFLARE_WORKERD_V8_FLAGS ? process.env.MINIFLARE_WORKERD_V8_FLAGS.split(" ") : []';
  assert.equal(mfText.split(passthrough).length-1,1,'actual installed environment-to-workerd config passthrough');
  const runtime={wrangler:require('wrangler/package.json').version,miniflare:require('miniflare/package.json').version,
    workerd:require('workerd/package.json').version,passthroughFile:mfPath,
    passthroughLine:mfText.slice(0,mfText.indexOf(passthrough)).split('\n').length,passthroughSha256:sha(mfBytes)};
  assert.equal(runtime.wrangler,'4.129.0');assert.equal(runtime.miniflare,'5.20260903.0-alpha');assert.equal(runtime.workerd,'1.20260903.1');
  let source=bytes.toString('utf8');
  const replace=(before,after)=>{assert.equal(source.split(before).length-1,1,'one exact diagnostic reporting seam');source=source.replace(before,after);};
  replace('../.generated/r1-resource.json','../.generated/r1-resource-constrained-diagnostic.json');
  // Only output labeling changes. Workload, clocks, fixtures, measurements,
  // ceilings and original verdict computation remain exact original source.
  replace('JSON.stringify(evidence,null,2)',"JSON.stringify({...evidence,diagnosticLabel:'DIAGNOSTIC — NOT ACCEPTANCE',resourceAcceptance:false},null,2)");
  write({diagnosticLabel:LABEL,resourceAcceptance:false,phase:'child-start',runtimeFlag:FLAG,runtime,sourcePins:pins});
  const compiled=new Module(original,module);compiled.filename=original;compiled.paths=Module._nodeModulePaths(__dirname);compiled._compile(source,original);
  const result=await compiled.exports.run();
  assert(fs.readFileSync(original).equals(bytes),'original resource harness unchanged');
  for(const pin of pins)assert.equal(sha(fs.readFileSync(path.join(__dirname,pin.file))),pin.sha256,'held source: '+pin.file);
  const observationVerdict=result.verdict;
  const diagnostic={...result,verdict:'DIAGNOSTIC',diagnosticLabel:LABEL,observationVerdict,resourceAcceptance:false,
    runtimeFlag:FLAG,runtime,sourcePins:pins,vectorSummary:vectorSummary(result),
    restrictions:['V8 old-space 128 MiB is not a total-isolate 128 MiB limit and does not mirror production.',
      'Original 96 MiB simultaneous totalSize + embedderHeapUsedSize + backingStorageSize metric remains unchanged.',
      'usedSize alone excludes buffers and cannot replace the original metric.',
      'No explicit collection, expose-gc, runtime upgrade, product change or acceptance contract revision.']};
  write(diagnostic);
  console.log('R1-E1 '+LABEL+'; original observations '+observationVerdict+'; '+result.completedPages+' pages; '+result.summary.requests+' requests; '+result.violations.length+' original-limit violations; '+(result.oversizeRefusal||'oversize incomplete'));
  console.log(JSON.stringify({vectorSummary:diagnostic.vectorSummary,summary:result.summary,failure:result.failure||null,resourceAcceptance:false}));
  process.exitCode=observationVerdict==='PASS'?0:observationVerdict==='BLOCKED'?2:1;
}
async function run(){
  const hadFlag=Object.hasOwn(process.env,'MINIFLARE_WORKERD_V8_FLAGS'),priorFlag=process.env.MINIFLARE_WORKERD_V8_FLAGS;
  assert(!fs.existsSync(output),'one E1 attempt only: preserve existing diagnostic evidence');
  const launched=new Date().toISOString();
  const outcome=await new Promise((resolve,reject)=>{
    const proc=spawn(process.execPath,[__filename,'--child'],{cwd:process.cwd(),windowsHide:true,stdio:'inherit',
      env:{...process.env,MINIFLARE_WORKERD_V8_FLAGS:FLAG}});
    proc.once('error',reject);proc.once('exit',(code,signal)=>resolve({code,signal}));
  });
  assert.equal(Object.hasOwn(process.env,'MINIFLARE_WORKERD_V8_FLAGS'),hadFlag);assert.equal(process.env.MINIFLARE_WORKERD_V8_FLAGS,priorFlag);
  const evidence=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):{};
  write({...evidence,diagnosticLabel:LABEL,resourceAcceptance:false,childOutcome:{...outcome,launched,finished:new Date().toISOString()},
    runtimeFlag:FLAG,parentEnvironmentUnchanged:true});
  console.log('R1-E1 child exit '+outcome.code+' signal '+(outcome.signal||'none')+'; '+LABEL);
  process.exitCode=outcome.code===null?1:outcome.code;
}
module.exports={run,vectorSummary};
if(require.main===module)(process.argv.includes('--child')?child():run()).catch(error=>{
  console.error('R1-E1 '+LABEL+'; diagnostic failure: '+error.message);process.exitCode=1;
});
