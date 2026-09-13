import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const head='c4716edad91453e74ba17f70ab076781ff5367de', source='48a3063a23528ed240eb2356226d237d2793a9da';
const git=(...args)=>execFileSync('git',args);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const deny=/^(ledger\/|src\/history\.js$|rebuild\/(conform\/private\/|soak\/|engine\/(seed|index|migrate|merge)\.cjs$|m4\/workout\/engine-runtime\.cjs$|lanes\/b\/BUILD-B1B2-TOOLING-154-184\.md$))/;
function read(file){assert(!deny.test(file)&&!file.startsWith('../')&&!path.isAbsolute(file),'UNLICENSED_BEFORE_READ '+file);return fs.readFileSync(file);}
assert.equal(git('rev-parse','HEAD').toString().trim(),head);
assert.equal(git('status','--porcelain=v1').toString().trim(),'');
const identity=JSON.parse(read('.tmp/d2-r2-identity.json'));
const closure=JSON.parse(read('.tmp/d2-combined-closure.json'));
const build=JSON.parse(read('.tmp/d2-combined-build.json'));
for(const f of closure.files)assert.equal(hash(read(f.path)),f.sha256,f.path);
for(const f of build.inventory)assert.equal(hash(read(f.path)),f.sha256,f.path);
for(const f of build.assetHashes)assert.equal(hash(read('.tmp/w7-today-dist/'+f.name)),f.sha256,f.name);
const today='rebuild/m3/w7-preview/today/';
const extra=[
 'package.json','package-lock.json','rebuild/m3/w6/package.json','rebuild/m3/w6/pnpm-lock.yaml',
 'rebuild/m3/w5/package.json','rebuild/m3/w5/pnpm-lock.yaml','rebuild/m3/w6/cipher-imports.json',
 'rebuild/m4/workout/fonts/SOURCES.json','rebuild/m4/workout/fonts/InstrumentSans-Variable.woff2',
 'rebuild/m4/workout/fonts/InstrumentSerif-Regular.woff2',
 'rebuild/m1/approved-2026-09-08/Earned-refinement-A.html','rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html',
 'rebuild/lanes/b/tooling/packages/B-NTC.json','rebuild/m3/w6/test/local-today-journey.test.mjs',
 today+'index.shell.html',today+'screens.template.html',today+'preview.css',
 ...fs.readdirSync(today).filter(p=>/\.(cjs|mjs)$/.test(p)).map(p=>today+p),
];
const all=[...new Set([...closure.files.map(f=>f.path),...build.inventory.map(f=>f.path),...extra])].sort();
const tracked=new Set(git('ls-files','--',...all).toString().trim().split(/\r?\n/));
const sourceIdentities=all.map(file=>{
 const bytes=read(file),sha256=hash(bytes),isTracked=tracked.has(file);
 if(isTracked)assert.equal(hash(git('show',head+':'+file)),sha256,file+' Git/disk');
 return{path:file,bytes:bytes.length,sha256,gitDiskEqual:isTracked?true:null};
});
const evidenceNames=[
 'd2-combined-closure.mjs','d2-combined-closure.json','d2-combined-build.mjs','d2-combined-build.json',
 'd2-r2-identity.mjs','d2-r2-identity.json','d2-r2-evidence.mjs','d2-r2-evidence-initial.mjs','d2-r2-build.log','d2-r2-browser.log',
 'd2-r2-retained.tap','d2-r2-availability-attempt1.tap',
 'd2-r4-completed-night.test.mjs','d2-r5-effective.test.mjs','d2-r5-boundaries.test.mjs','d2-r6-overrides.test.mjs',
 'd2-r2-consumers-original.test.mjs','d2-r2-consumers.test.mjs','d2-r2-availability.test.mjs','d2-r2-support.mjs',
 'd2-r2-root-install.log','d2-r2-w6-install-unsupported-option.log','d2-r2-w6-install.log','d2-r2-w5-install.log',
];
const files=evidenceNames.map(name=>{const bytes=read('.tmp/'+name);return{path:'.tmp/'+name,bytes:bytes.length,sha256:hash(bytes)};});
const count=(name,n)=>{
 const text=read('.tmp/'+name).toString();
 const fields=Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(k=>[k,Number(text.match(new RegExp('^# '+k+' (\\d+)','m'))[1])]));
 assert.deepEqual(fields,{tests:n,pass:n,fail:0,cancelled:0,skipped:0,todo:0});
 return{log:name,...fields,testsByName:[...text.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)].map(m=>({name:m[2],outcome:m[1]}))};
};
const original=read('.tmp/d2-r2-consumers-original.test.mjs').toString();
const adapted=read('.tmp/d2-r2-consumers.test.mjs').toString();
const replacements=[
 {old:"  ['current zero', { date: NIGHT, hours: 0 }, false, 'WATCH', 70],",new:"  // PM246/R7 changes only this unavailable-target contribution expectation.\n  ['current zero', { date: NIGHT, hours: 0 }, false, 'UNKNOWN', null],"},
 {old:"{ label: 'SLEEP', state: 'quiet', detail: 'sleep target not recorded' });",new:"{ label: 'SLEEP', state: 'quiet', detail: night?.date === NIGHT ? 'sleep target not recorded' : 'current sleep not recorded' });"},
];
let reproduced=original;
for(const r of replacements){assert.equal(reproduced.split(r.old).length-1,1,'exact unique expectation adaptation');reproduced=reproduced.replace(r.old,r.new);}
assert.equal(reproduced,adapted,'only PM246 availability expectations adapted');
const browser=read('.tmp/d2-r2-browser.log').toString();
assert.match(browser,/^N2 SLEEP BROWSER CHECK PASS/);
assert.match(browser,/across 7 REAL PROCESS KILLS/);
for(const line of ['offline','before commit','before acknowledgment','doubled text','Tab reaches','actual page rollover'])assert.ok(browser.includes(line),line);
const result={
 reviewer:'Lane D2 / Astra MAX',candidate:head,engineSource:source,parent:git('rev-parse','HEAD^').toString().trim(),
 root:process.cwd(),independentCompletedAt:'2026-09-13T16:16:31Z',
 authority:{dispatch:'2529e0abf183fe6cbf99f0c3f0f179930b236898',decisions:[246,248,250,252,254],bar:'N2 brief v1.0 and source erratum; B1B2-R2-COMPLETE-REVIEW-DISPATCH.md; B1B2-R7-TARGET-AVAILABILITY-PM-RULING.md'},
 runtime:{node:process.version,pnpm:'9.15.9',edge:'153.0.4234.32',platform:process.platform,tz:process.env.TZ,resolvedTz:Intl.DateTimeFormat().resolvedOptions().timeZone,temp:process.env.TEMP,tmp:process.env.TMP,nodeOptionsAbsent:!process.env.NODE_OPTIONS,coverageAbsent:!process.env.NODE_V8_COVERAGE},
 custody:{headClean:true,candidateNotPushed:true,builderFinalReportRead:false,noProtectedExecution:true,identity,sourceIdentities},
 closure:{moduleInputs:closure.files.length,beforeReadDenied:closure.beforeReadDenied,warnings:closure.warnings,exactPriorPathSet:true,newPaths:[],changedPublicFiles:identity.sourceFiles.filter(f=>f.changedSinceR).map(f=>f.path),nonModuleReadPaths:extra,lateBoundPackage:'playwright-core via fresh own locked W6 createRequire; packages external to static scan',unusedReader:'design.headlineVocabulary engine-root scan is not invoked',annotation:'Public Today source/copy-scan superset; B-NTC and local-today-journey are text reads only. Static esbuild traversal executes no product module. New witness imports are a subset of this same approved public graph.'},
 retained:count('d2-r2-retained.tap',105),availability:count('d2-r2-availability-attempt1.tap',16),expectationAdaptation:replacements,
 observations:[
  'Actual77 sleep + four byte-exact prior witness files (3 raw,7 date/clock,3 completed-night,8 overrides) + seven retained consumers =105. Only the two explicitly ruled availability assertion sites in the seven were adapted; original source retained.',
  'Sixteen new test names; inner target/hour/invalid-input pairs are not counted as additional named tests. They passed on the first attempt.',
  'Actual Today JSON-clones basis; NaN/Infinity become null. Tests also supply the exact nonfinite values directly to the same actual bound readers. No product factory/reader substitution.',
  'The target8/9 two-anchor case records previous2h through the real host; current8h is explicitly pre-existing synthetic basis because N2 correctly refuses an uncompleted same-date save.',
  'Today/recovery/gym render/preparation and actual Start use production entry bindings. Reads retain exact ops/outbox; Start adds exactly one session-start/outbox. Render assertions inspect the real surface, not unrelated raw body-composition strings.',
  'weekReview and sleepAnchor are checked through the actual Today engine binding. Full askContext/runAdaptive writer execution and complete engine/tooling proofs remain ER scope; D2 does not claim them.',
  'No source mutations on this candidate. Prior R4/R5/R6 mutation evidence and old failed harness attempts remain historical at b33530ba / earlier heads. Official browser undersized-input negative control ran.',
  'Initial evidence manifest generation expected CRLF for one inserted comment in an LF witness; exact byte assertion refused. Corrected manifest expectation to the actual LF, without altering any witness or product source. Original failed generator retained; no test failure or mutation credit.',
  'First W6 install command was refused for unsupported CLI options before dependency installation. Exact failed log retained and uncredited; corrected locked own W6/W5/root installs succeeded.',
 ],
 commands:{
  retained:['--test','--test-reporter=tap','--test-concurrency=1',today+'test/sleep.test.mjs','.tmp/d2-r5-effective.test.mjs','.tmp/d2-r5-boundaries.test.mjs','.tmp/d2-r4-completed-night.test.mjs','.tmp/d2-r6-overrides.test.mjs','.tmp/d2-r2-consumers.test.mjs'],
  availability:['--test','--test-reporter=tap','--test-concurrency=1','.tmp/d2-r2-availability.test.mjs'],
  build:'.tmp/d2-combined-build.mjs',browser:today+'sleep-check.mjs',identity:'.tmp/d2-r2-identity.mjs',
 },
 build,browser:{pass:true,kills:7,clockTimeAndHours:true,offline:true,beforeCommit:true,afterCommitBeforeAck:true,correction:true,provenance:true,recoveryDraft:true,gymReturn:true,rollover:true,widths:[390,320,375],minInputPx:48,minTextPx:16,persistentDoubledText:true,focusTabReachability:true,noHorizontalOverflow:true,noOffOrigin:true},
 files,rawLogs:'Retained only in this owned review tree .tmp; hashes/counts published, no raw terminal in shared reports.',
 limitations:'Affected N2 only. No full14/native/private/H3/retained history/seed/final package/REAL-C2/currentCI/artifact/receipt/merge/deploy/import/physical phone validation or acceptance line.',
};
assert.equal(result.runtime.node,'v22.23.2');assert.equal(result.runtime.resolvedTz,'America/New_York');assert(result.runtime.nodeOptionsAbsent&&result.runtime.coverageAbsent);
fs.writeFileSync('.tmp/N2-B1B2-R2-EVIDENCE.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({head,retained:105,newAvailability:16,sourceIdentities:sourceIdentities.length,tracked:sourceIdentities.filter(f=>f.gitDiskEqual).length,publicInputs:closure.files.length,build:build.buildTag,kills:7,sha256:hash(read('.tmp/N2-B1B2-R2-EVIDENCE.json'))}));
