'use strict';
// Single cumulative entry point. CI is explicitly public evidence only; FULL
// keeps every original gate and cannot report PACKAGE PASS without a receipt.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const Profile=require('./load-write-profile.cjs'),R=require('../../conform/v4/postfix/run.cjs'),L=require('../../conform/v4/postfix/legacy-gates.cjs');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const args=process.argv.slice(2);assert(args.length===1&&['--full','--ci'].includes(args[0]),'Explicit --full or --ci');const ci=args[0]==='--ci';
let context,root,a,m,logDir;
const names=['source-carriers','traces','direct','parent-cases','inherited-carriers','witnesses','legacy','second'];
const verdicts={'source-carriers':'LOAD SOURCE CARRIERS: 6/6 PASS','traces':'LOAD WRITE TRACES: 180/180','direct':'LOAD WRITE DIRECT: 48/48','parent-cases':'LOAD PARENT CASES: 1180 complete inherited comparisons PASS; 68 effective inherited mutants;','inherited-carriers':'LOAD INHERITED CARRIERS: 6/6 PASS','witnesses':'LOAD WRITE WITNESSES: 10/10','legacy':'LOAD WRITE LEGACY DIFFERENTIAL: 3/3 Date/trap modes PASS;','second':'CI SECOND GATE PASS; 3072 reference / 3072 candidate assertions;'};
const covered=['migrate-source','merge-source','writers-source','witnesses-2','witnesses-5','migrate-differential','witnesses-7','writers-differential','second-gate'];
function child(name,argv,env,needle){
 const r=cp.spawnSync(process.execPath,argv,{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:1200000,maxBuffer:8*1024*1024});
 fs.writeFileSync(path.join(logDir,name+'.log'),(r.stdout||'')+(r.stderr||''));
 assert(!r.error&&r.status===0&&r.stdout.includes(needle),'Required child '+name);
 console.log('LOAD PACKAGE '+name+' OBSERVED; exit 0 and exact declared verdict');
}
function historical(bundles){
 // An exact public-code snapshot, not a replacement baseline engine. Fixed Git
 // reads still resolve to this repository; every executed snapshot byte is pinned.
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
 logDir=path.join(root,'.tmp/load-write-package');fs.mkdirSync(logDir,{recursive:true});
 console.log('POSTFIX '+Profile.ID+' '+(context.accepted?'AUTHORIZED':'REVIEW-PENDING')+' artifact='+context.artifactSha256);
 const bundles=require('./load-write-reference.cjs').create(root);
 const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',ENGINE_MAIN:bundles.main,ENGINE_OLD:bundles.old,EARNED_CLIENT_DIR:path.join(root,'rebuild/client')};
 for(const key of ['PL_ENGINE','PL_LAWS_LIB','CONFORM_MUTATE_LAWS','CONFORM_ADAPTERS_DIR'])delete env[key];
 child('focused',['--test','--test-reporter=tap','rebuild/m4/spec/load-write.test.cjs'],env,'# pass 3');
 child('review-controls',['--test','--test-reporter=tap','rebuild/m4/spec/load-write-assembly.test.cjs','rebuild/m4/spec/load-write-errors.test.cjs'],env,'# pass 5');
 child('browser-package',['--test','--test-reporter=tap',...['model','view','package'].map(n=>'rebuild/m3/w7-preview/test/'+n+'.test.cjs')],env,'# pass 19');
 child('profile-refusals',['--test','--test-reporter=tap','rebuild/m4/spec/load-write-profile.test.cjs'],env,'# pass 8');
 // Every affected source/witness check is also public CI evidence. The full
 // inherited cases/mutants run in FULL; their omission here remains explicit.
 for(const name of names.filter(name=>!ci||name!=='parent-cases'))child(name,['rebuild/m4/spec/load-write-'+name+'.cjs'],env,verdicts[name]);
 if(ci){console.log('LOAD PUBLIC CI EVIDENCE PASS; inherited full case/mutant package, private oracle, all FULL gates and independent acceptance remain separate');process.exitCode=0;}
 else{
  historical(bundles);
  const done=new Set(covered);for(const gate of R.GATES){if(done.has(gate[0]))continue;R.gateRun(root,bundles,gate,{emit:line=>console.log(line.replace(/\bPASS\b/g,context.accepted?'PASS':'OBSERVED'))});done.add(gate[0]);}
  assert.deepEqual([...done].sort(),m.gates.slice().sort(),'No missing or extra original gate');
  Profile.verify();console.log('LOAD FULL EVIDENCE: all45 raw IDs; all inherited/new cases and effective mutants; every original gate OBSERVED');
  console.log(context.accepted?'POSTFIX PACKAGE PASS M2-LOAD-WRITES':'POSTFIX PACKAGE REVIEW-PENDING: complete evidence; independent exact-artifact acceptance required');process.exitCode=context.accepted?0:2;
 }
}catch(error){const failed=require('./load-write-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}
