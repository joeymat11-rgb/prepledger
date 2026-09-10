'use strict';
// LEGACY CENSUS TRACES. The one claim this child proves is the one that matters
// most for adoption: for LEGACY rows the adopted engine's census over the frozen
// public preimage blob is BYTE-IDENTICAL to the accepted golden, and the frozen
// engine-track witnesses are unchanged. Nothing private runs here; the private
// oracle stays in the PM's FULL.
//
// The census is computed by the unchanged rebuild/conform/oracle/port-oracle.cjs
// against rebuild/engine/oracle-shim.cjs (the live composed engine), on the two
// PUBLIC goldens the oracle manifest pins: the repository preimage blob
// 2026-08-15 and the synthetic pending-debut fixture.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const S=require('./native-carriers-source.cjs');
const C=path.join(root,'rebuild/conform');
const ENV={...process.env,MEASURED_TEST_NOW:'2026-09-03',TZ:'America/New_York'};
for(const key of ['PL_ENGINE','PL_LAWS_LIB','CONFORM_MUTATE_LAWS','CONFORM_ADAPTERS_DIR'])delete ENV[key];
const GOLDENS=['preimage-2026-08-15','synthetic-pending-debut'];
function run(args,env=ENV){
 const r=cp.spawnSync(process.execPath,args,{cwd:root,env,windowsHide:true,encoding:'utf8',maxBuffer:32e6,timeout:600000});
 assert(!r.error&&r.status===0,'Trace command exit 0');
 return r.stdout;
}
function censusLaws(){
 // The manifest's own pins must hold before any census claim is made.
 const manifest=JSON.parse(fs.readFileSync(path.join(C,'oracle/manifest.json')));
 for(const name of GOLDENS){
  const pin=manifest.goldens[name+'.main'];
  assert.equal(S.sha(fs.readFileSync(path.join(C,'fixtures',name+'.json'))),pin.blobSha256,'Frozen public blob '+name);
  assert.equal(S.sha(fs.readFileSync(path.join(C,pin.path))),pin.goldenSha256,'Frozen public golden '+name);
 }
 return manifest;
}
function census(mode){
 const args=mode==='frozen'?['--import',require('node:url').pathToFileURL(path.join(root,'tools/_fixed-now.mjs')).href]:[];
 const text=run([...args,path.join(C,'oracle/port-oracle.cjs'),'check',path.join(root,'rebuild/engine/oracle-shim.cjs'),'candidate','main']);
 const green=[...text.matchAll(/^GREEN\s+(\S+)/gm)].map(m=>m[1]).sort();
 assert.match(text,/7 GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR/,'Candidate census clean ('+mode+')');
 for(const name of GOLDENS)assert(text.includes('PORT-'+name+'-census-v2-required-identical-to-golden'),'Census law present '+name);
 assert(/byte-identical required census/.test(text),'Byte-identical census claimed');
 return green;
}
// The unchanged W0 public-oracle runner rebuilds the frozen main/old engines from
// pinned Git blobs and runs the census, the sensitivity laws and the frozen
// engine-track witnesses (rig185 W1/W2) end to end. Its own PASS lines are the
// evidence; this child does not re-implement them.
function engineTrack(){
 const r=run([path.join(root,'rebuild/m3/w0/public-oracle.mjs')]);
 for(const needle of ['PUBLIC-ORACLE check PASS','PUBLIC-ORACLE sensitivity PASS','PUBLIC-CANDIDATE frozen PASS','PUBLIC-CANDIDATE native PASS','ENGINE-TRACK PASS'])
  assert(r.includes(needle),'Unchanged W0 public oracle line: '+needle);
 assert(!/FAIL/.test(r),'No W0 public oracle failure');
 return r;
}
function main(){
 // The census is only meaningful over the exact adopted bytes.
 S.verify(root);
 censusLaws();
 const frozen=census('frozen'),native=census('native');
 assert.deepEqual(frozen,native,'Same census inventory under both clocks');
 engineTrack();
 // The legacy composition must not depend on any native provider: the two
 // goldens above carry no workoutFacts, so every native branch stayed unread.
 const {createEngine}=require(path.join(root,'rebuild/engine/index.cjs'));
 const E=createEngine({clock:{today:()=>'2026-09-03',nowISO:()=>'2026-09-03T12:00:00.000Z',nowMs:()=>Date.parse('2026-09-03T12:00:00.000Z'),hour:()=>12,dow:()=>4}});
 for(const name of ['performedLine','performedLoadMatches','performedOriginalRirSets','governingLast','governingMeta','bodyAlarmSignal'])
  assert.equal(typeof E[name],'function','Adopted helper composed in the legacy engine: '+name);
 console.log('NATIVE CARRIER TRACES: '+frozen.length+'/'+frozen.length+' public census laws GREEN on both clocks; '+GOLDENS.length+'/'+GOLDENS.length+' frozen goldens byte-identical; W0 public oracle 5/5 PASS lines including engine-track W1/W2; 6/6 adopted helpers composed');
}
if(require.main===module){try{main();}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}}
module.exports={census,censusLaws,engineTrack,GOLDENS};
