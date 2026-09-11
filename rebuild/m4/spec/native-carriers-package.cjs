'use strict';
// Single cumulative entry point for M2-NATIVE-CARRIERS. CI is explicitly public
// evidence only; FULL keeps every original gate and cannot report PACKAGE PASS
// without an independent receipt AND a bound theme line.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const Profile=require('./native-carriers-profile.cjs'),Reference=require('./native-carriers-reference.cjs');
const R=require('../../conform/v4/postfix/run.cjs'),L=require('../../conform/v4/postfix/legacy-gates.cjs');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const args=process.argv.slice(2);assert(args.length===1&&['--full','--ci'].includes(args[0]),'Explicit --full or --ci');const ci=args[0]==='--ci';
let context,root,g,m,logDir,made=null;
// The five B0-authored children, then the five successors of the parent's own
// substitute children — the ones that carry the nine covered originals.
const names=['traces','direct','legacy','witnesses','cases',
 'source-carriers','inherited-carriers','defect-witnesses','writers-differential','second-gate'];
const verdicts={
 traces:'NATIVE CARRIER TRACES: 7/7 public census laws GREEN on both clocks; 2/2 frozen goldens byte-identical;',
 direct:'NATIVE CARRIERS DIRECT: 713/713 PASS;',
 legacy:'NATIVE CARRIERS LEGACY DIFFERENTIAL: 9/9 legacy-only comparisons identical',
 witnesses:'NATIVE CARRIERS WITNESSES: 6/6 input/alarm branches;',
 cases:'NATIVE CARRIERS CASES: 7/7 effective mutants, one per carrier file, all restored',
 'source-carriers':'NATIVE SOURCE CARRIERS: 6/6 PASS;',
 'inherited-carriers':'NATIVE INHERITED CARRIERS: 6/6 PASS;',
 'defect-witnesses':'NATIVE DEFECT WITNESSES: 10/10 complete comparisons PASS;',
 'writers-differential':'NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;',
 'second-gate':'NATIVE SECOND GATE:',
};
function child(name,argv,env,needle){
 const r=cp.spawnSync(process.execPath,argv,{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:1800000,maxBuffer:32*1024*1024});
 fs.writeFileSync(path.join(logDir,name+'.log'),(r.stdout||'')+(r.stderr||''));
 assert(!r.error&&r.status===0&&r.stdout.includes(needle),'Required child '+name);
 console.log('NATIVE CARRIERS PACKAGE '+name+' OBSERVED; exit 0 and exact declared verdict');
}
function historical(bundles){
 // An exact public-code snapshot, not a replacement baseline engine. The baseline
 // lives on the GRANDPARENT acceptance (M2-STEP-EFFICACY): the immediate parent
 // M2-LOAD-WRITES artifact is a closed cumulative profile with no `baseline` key.
 // Profile.verify() resolved and pinned that chain once; nothing is re-read here.
 const baseline=g.baseline;
 const dir=fs.mkdtempSync(path.join(logDir,'original-audit-'));
 try{
  const files=Object.entries(baseline.publicPins).filter(([file])=>file.startsWith('rebuild/engine/')||/^rebuild\/conform\/v4\/[^/]+\.cjs$/.test(file));
  assert(files.some(([file])=>file==='rebuild/conform/v4/run-defect-laws.cjs'));
  for(const [file,hash]of files){const bytes=L.object(root,baseline.auditCommit,file);assert.equal(sha(bytes),hash);const out=path.join(dir,file);assert(out.startsWith(dir+path.sep));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);}
  console.log(L.historicalAudit({baseline:dir,bundles}).replace(/\bPASS\b/g,'OBSERVED'));
 }finally{assert(path.resolve(dir).startsWith(logDir+path.sep));fs.rmSync(dir,{recursive:true,force:true});}
}
try{
 context=Profile.verify();({root,grandparent:g,manifest:m}=context);
 assert(g&&g.baseline&&g.baseline.publicPins&&typeof g.baseline.auditCommit==='string','Resolved grandparent baseline');
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
 child('profile-refusals',['--test','--test-reporter=tap','rebuild/m4/spec/native-carriers-profile.test.cjs'],env,'# pass 13');
 for(const name of names)child(name,['rebuild/m4/spec/native-carriers-'+name+'.cjs'],env,verdicts[name]);
 if(ci){console.log('NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and independent acceptance remain separate');process.exitCode=0;}
 else{
  historical(bundles);
  // The nine originals that compare against the FROZEN fe516c1 source were RED by
  // design in the accepted parents and are COVERED by the successor children above
  // — every one of them ran, with its exact verdict, before this loop. They are
  // seeded into `done` from the artifact's own coverage record, so the closed
  // "no missing or extra original gate" assertion still holds over all 19.
  const covered=m.coverage.covered;
  for(const gate of covered)console.log('NATIVE CARRIERS ORIGINAL '+gate+' COVERED by child '+m.coverage.byChild[gate]+'; frozen-source comparison carried at the B0 inventory');
  const done=new Set(covered);
  for(const gate of R.GATES){if(done.has(gate[0]))continue;R.gateRun(root,bundles,gate,{emit:line=>console.log(line.replace(/\bPASS\b/g,context.accepted?'PASS':'OBSERVED'))});done.add(gate[0]);}
  assert.deepEqual([...done].sort(),m.gates.slice().sort(),'No missing or extra original gate');
  assert.deepEqual(m.coverage.run.filter(gate=>covered.includes(gate)),[],'A gate is either covered or run, never both');
  Profile.verify();
  console.log('NATIVE CARRIERS FULL EVIDENCE: '+m.coverage.run.length+' original gates re-executed and '+covered.length+' carried by named successor children; all adopted-carrier cases and effective mutants; legacy census byte-identical');
  const ready=context.accepted&&!context.themePending;
  console.log(ready?'POSTFIX PACKAGE PASS M2-NATIVE-CARRIERS':'POSTFIX PACKAGE REVIEW-PENDING: complete evidence; independent exact-artifact acceptance and the bound THEME ledger line are required');
  process.exitCode=ready?0:2;
 }
}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}
finally{try{Reference.removeImportEngine();}catch{}}
