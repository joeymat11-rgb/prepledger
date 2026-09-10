'use strict';
// Single cumulative entry point for M2-NATIVE-CARRIERS. CI is explicitly public
// evidence only; FULL keeps every original gate and cannot report PACKAGE PASS
// without an independent receipt AND a bound theme line.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const Profile=require('./native-carriers-profile.cjs'),Reference=require('./native-carriers-reference.cjs');
const R=require('../../conform/v4/postfix/run.cjs'),L=require('../../conform/v4/postfix/legacy-gates.cjs');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const args=process.argv.slice(2);assert(args.length===1&&['--full','--ci'].includes(args[0]),'Explicit --full or --ci');const ci=args[0]==='--ci';
let context,root,a,m,logDir,made=null;
const names=['traces','direct','legacy','witnesses','cases'];
const verdicts={
 traces:'NATIVE CARRIER TRACES: 7/7 public census laws GREEN on both clocks; 2/2 frozen goldens byte-identical;',
 direct:'NATIVE CARRIERS DIRECT: 713/713 PASS;',
 legacy:'NATIVE CARRIERS LEGACY DIFFERENTIAL: 9/9 legacy-only comparisons identical',
 witnesses:'NATIVE CARRIERS WITNESSES: 6/6 input/alarm branches;',
 cases:'NATIVE CARRIERS CASES: 7/7 effective mutants, one per carrier file, all restored',
};
function child(name,argv,env,needle){
 const r=cp.spawnSync(process.execPath,argv,{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:1800000,maxBuffer:32*1024*1024});
 fs.writeFileSync(path.join(logDir,name+'.log'),(r.stdout||'')+(r.stderr||''));
 assert(!r.error&&r.status===0&&r.stdout.includes(needle),'Required child '+name);
 console.log('NATIVE CARRIERS PACKAGE '+name+' OBSERVED; exit 0 and exact declared verdict');
}
function historical(bundles){
 // An exact public-code snapshot, not a replacement baseline engine.
 const dir=fs.mkdtempSync(path.join(logDir,'original-audit-'));
 try{
  const files=Object.entries(a.baseline.publicPins).filter(([file])=>file.startsWith('rebuild/engine/')||/^rebuild\/conform\/v4\/[^/]+\.cjs$/.test(file));
  assert(files.some(([file])=>file==='rebuild/conform/v4/run-defect-laws.cjs'));
  for(const [file,hash]of files){const bytes=L.object(root,a.baseline.auditCommit,file);assert.equal(sha(bytes),hash);const out=path.join(dir,file);assert(out.startsWith(dir+path.sep));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);}
  console.log(L.historicalAudit({baseline:dir,bundles}).replace(/\bPASS\b/g,'OBSERVED'));
 }finally{assert(path.resolve(dir).startsWith(logDir+path.sep));fs.rmSync(dir,{recursive:true,force:true});}
}
try{
 context=Profile.verify();({root,parent:a,manifest:m}=context);
 logDir=path.join(root,'.tmp/native-carriers-package');fs.mkdirSync(logDir,{recursive:true});
 console.log('POSTFIX '+Profile.ID+' '+(context.accepted?'AUTHORIZED':'REVIEW-PENDING')+' artifact='+context.artifactSha256+(context.themePending?' THEME_PENDING':''));
 const bundles=require('./load-write-reference.cjs').create(root);
 // Materialise the two immutable prerequisites the adopted L tests name (the
 // recovered ACCEPTED preimage packet and the retained import-engine snapshot).
 // test-support/ is transient by construction: the W0 frozen-path gate forbids
 // a new top-level directory, so it is removed again before this process exits.
 made=Reference.create(root);
 const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',
  ENGINE_MAIN:bundles.main,ENGINE_OLD:bundles.old,EARNED_CLIENT_DIR:path.join(root,'rebuild/client'),EARNED_NATIVE_PACKET_ROOT:made.packet};
 for(const key of ['PL_ENGINE','PL_LAWS_LIB','CONFORM_MUTATE_LAWS','CONFORM_ADAPTERS_DIR'])delete env[key];
 child('focused',['--test','--test-reporter=tap',
  'rebuild/m4/workout/test/native-next-targets.test.cjs',
  'rebuild/m4/workout/test/native-next-targets-assembly.test.cjs',
  'rebuild/m4/workout/test/native-next-targets-correction.test.cjs'],env,'# pass 15');
 child('browser-package',['--test','--test-reporter=tap',...['model','view','package'].map(n=>'rebuild/m3/w7-preview/test/'+n+'.test.cjs')],env,'# pass 19');
 child('profile-refusals',['--test','--test-reporter=tap','rebuild/m4/spec/native-carriers-profile.test.cjs'],env,'# pass 7');
 for(const name of names)child(name,['rebuild/m4/spec/native-carriers-'+name+'.cjs'],env,verdicts[name]);
 if(ci){console.log('NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and independent acceptance remain separate');process.exitCode=0;}
 else{
  historical(bundles);
  const done=new Set();
  for(const gate of R.GATES){if(done.has(gate[0]))continue;R.gateRun(root,bundles,gate,{emit:line=>console.log(line.replace(/\bPASS\b/g,context.accepted?'PASS':'OBSERVED'))});done.add(gate[0]);}
  assert.deepEqual([...done].sort(),m.gates.slice().sort(),'No missing or extra original gate');
  Profile.verify();
  console.log('NATIVE CARRIERS FULL EVIDENCE: every original gate OBSERVED; all adopted-carrier cases and effective mutants; legacy census byte-identical');
  const ready=context.accepted&&!context.themePending;
  console.log(ready?'POSTFIX PACKAGE PASS M2-NATIVE-CARRIERS':'POSTFIX PACKAGE REVIEW-PENDING: complete evidence; independent exact-artifact acceptance and the bound THEME ledger line are required');
  process.exitCode=ready?0:2;
 }
}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}
finally{try{Reference.removeImportEngine();}catch{}}
