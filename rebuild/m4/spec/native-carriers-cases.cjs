'use strict';
// EFFECTIVE MUTANTS. One authored mutant per carrier file, each a single literal
// edit inside a carrier this package adopts. A mutant is EFFECTIVE only when a
// shipped check goes RED on it; the candidate bytes are restored and re-pinned
// after every mutant, and the run refuses if any file does not come back to its
// exact adopted sha256.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const S=require('./native-carriers-source.cjs'),R=require('./native-carriers-reference.cjs');
// Detectors, cheapest first. Each returns true when it REFUSES the tree.
const DETECTORS=[
 // BEHAVIOURAL detectors only. The byte-level carrier check in the full direct
 // child would notice any literal mutation by construction, so it is excluded:
 // an "effective" mutant here is one a behaviour check actually refuses.
 ['direct-behaviour',()=>[process.execPath,[path.join(root,'rebuild/m4/spec/native-carriers-direct.cjs'),'--behaviour']]],
 ['legacy-behaviour',()=>[process.execPath,[path.join(root,'rebuild/m4/spec/native-carriers-legacy.cjs'),'--behaviour']]],
 ['census',()=>[process.execPath,[path.join(root,'rebuild/conform/oracle/port-oracle.cjs'),'check',path.join(root,'rebuild/engine/oracle-shim.cjs'),'candidate','main']]],
 ['focused',()=>[process.execPath,['--test',path.join(root,'rebuild/m4/workout/test/native-next-targets.test.cjs')]]],
];
const MUTANTS=[
 ['performed-hole-state','rebuild/engine/performed.cjs','if(slot.state===\'performed\')beyond=true;','if(slot.state===\'performed\')beyond=false;'],
 ['progression-governing-last','rebuild/engine/progression.cjs','  return rows.length ? _lineOf(rows[rows.length - 1]) : null;\n}','  return ex.last;\n}'],
 ['plan-era-fresh-native','rebuild/engine/plan.cjs','  if (s && s.workoutFacts) {\n    for (const row of E.performedHistoryRows(s)) {','  if (false && s && s.workoutFacts) {\n    for (const row of E.performedHistoryRows(s)) {'],
 ['today-governing-prev','rebuild/engine/today.cjs','prev: eraFresh(s, e.id) ? null : meta9 }','prev: eraFresh(s, e.id) ? null : e.lastMeta }'],
 ['writers-alarm-floor','rebuild/engine/writers.cjs','try { const al9p = bodyAlarmSignal(s); if (al9p) { plan = plan.map((r) => Math.max(r, 1));','try { const al9p = bodyAlarmSignal(s); if (al9p) { plan = plan.map((r) => Math.max(r, 0));'],
 // Review F3: a THRESHOLD-flipping value mutant, not a shape mutant — the extracted
 // detection must be the presentation's own, so moving its firing threshold has to
 // be caught by behaviour, not by a changed object shape.
 ['sleep-alarm-signal','rebuild/engine/sleep.cjs','pr5.spike != null && pr5.spike >= 7 ? pr5.spike : null;','pr5.spike != null && pr5.spike >= 70 ? pr5.spike : null;'],
 ['index-performed-composition','rebuild/engine/index.cjs','  require("./performed.cjs"),\n','  '],
];
function run(spec,env){
 const [bin,args]=spec();
 const r=cp.spawnSync(bin,args,{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:900000,maxBuffer:32e6});
 // Redness is the detector's own exit status; no output is parsed, so a mutant
 // cannot be counted detected by an incidental word in a passing report.
 return {red:!!r.error||r.status!==0,status:r.status};
}
function main(){
 const product=S.verify(root);
 // Materialise the packet from the UNMUTATED bytes; a mutant must never be able
 // to move the accepted preimage the native tests compare against.
 const made=R.create(root);
 const env={...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',EARNED_NATIVE_PACKET_ROOT:made.packet,NODE_OPTIONS:'',NODE_V8_COVERAGE:''};
 for(const key of ['PL_ENGINE','PL_LAWS_LIB','CONFORM_MUTATE_LAWS','CONFORM_ADAPTERS_DIR'])delete env[key];
 // Every detector must be GREEN on the unmutated tree before any mutant runs.
 for(const [name,spec]of DETECTORS)assert(!run(spec,env).red,'Detector green on the adopted tree: '+name);
 let effective=0;const report=[];
 try{
  for(const [id,file,before,after]of MUTANTS){
   const full=path.join(root,file),original=fs.readFileSync(full,'utf8');
   assert.equal(original.split(before).length,2,'Unique mutant site: '+id);
   fs.writeFileSync(full,original.replace(before,after));
   let caught=null;
   try{
    for(const [name,spec]of DETECTORS){if(run(spec,env).red){caught=name;break;}}
   }finally{fs.writeFileSync(full,original);}
   assert.equal(S.sha(fs.readFileSync(full)),product[file],'Candidate bytes restored: '+file);
   assert(caught,'MUTANT NOT DETECTED: '+id);
   effective++;report.push(id+'→'+caught);
  }
 }finally{R.removeImportEngine();}
 // Whole-tree restoration is re-proved from the profile's own construction.
 S.verify(root);
 console.log('NATIVE CARRIERS CASES: '+effective+'/'+MUTANTS.length+' effective mutants, one per carrier file, all restored ('+report.join(', ')+')');
}
if(require.main===module){try{main();}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}}
module.exports={MUTANTS,DETECTORS,main};
