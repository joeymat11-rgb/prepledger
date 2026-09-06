'use strict';
// DIAGNOSTIC ONLY. Execute the unchanged sequential boundary workload, preserve
// its measurements, then collect once. Never used by a resource acceptance gate.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
async function collectOnce(meter){
  assert.equal(typeof meter.collectOnceAfterMeasurement,'function','existing measured inspector session required');
  return meter.collectOnceAfterMeasurement();
}
async function run(){
  assert(!process.env.MINIFLARE_WORKERD_V8_FLAGS,'diagnostic requires unchanged default runtime flags');
  const original=path.join(__dirname,'r1-resource.test.cjs'),bytes=fs.readFileSync(original);
  let source=bytes.toString('utf8');
  const replace=(from,to)=>{assert.equal(source.split(from).length-1,1,'one diagnostic harness seam');source=source.replace(from,to);};
  replace("../.generated/r1-resource.json","../.generated/r1-resource-gc-diagnostic.json");
  replace("    check(completed===C.LIMITS.pages,'BOUNDARY_PAGE_COUNT');",
    "    check(completed===C.LIMITS.pages,'BOUNDARY_PAGE_COUNT');\n"+
    "    evidence.verdict='DIAGNOSTIC'; evidence.resourceAcceptance=false; save();\n"+
    "    evidence.postWorkloadCollection=await require("+JSON.stringify(__filename)+").collectOnce(meter); return evidence;");
  const compiled=new Module(original,module);compiled.filename=original;compiled.paths=Module._nodeModulePaths(__dirname);compiled._compile(source,original);
  const result=await compiled.exports.run();
  assert(fs.readFileSync(original).equals(bytes),'original gate unchanged');
  if(result.verdict!=='DIAGNOSTIC')throw Error(result.failure?.message||('diagnostic stopped with '+result.verdict));
  assert.equal(result.resourceAcceptance,false);
  const d=result.postWorkloadCollection;assert.equal(d.collections,1);assert.equal(d.applicationRequestsAfterCollection,0);
  console.log('R1-GC DIAGNOSTIC — NOT ACCEPTANCE; '+result.completedPages+' complete sequential pages; one post-workload collection; '+result.violations.length+' recorded pre-collection violations');
  console.log(JSON.stringify({before:d.before,after:d.after,resourceAcceptance:false}));
  return result;
}
module.exports={collectOnce,run};
if(require.main===module)run().catch(e=>{console.error('R1-GC DIAGNOSTIC FAILED: '+e.message);process.exitCode=1;});
