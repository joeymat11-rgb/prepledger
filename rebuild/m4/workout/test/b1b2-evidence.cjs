'use strict';
// GO232/246 construction. Native consumers are deliberately lazy: authoring this
// helper never imports a seed, historical bundle, oracle, or athlete fixture.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const Module = require('node:module');
const changes = require('./b1b2-source-changes.json');
const ROOT = path.resolve(__dirname, '../../../..');
const M = '100820aa47a4f8729642033499eaec0f0ee282e1';
const R = '6c9248e695a4478abdbaae0f9f48395ac56000fa';
const H3_BASE = 'ce38aa3bd174c94526e01fb5056df850ad322b80';
const W = 'rebuild/m4/workout/test/';
const RUNTIME = ['dates','plan','policy','progression','sleep','today','volume','writers'].map(n => 'rebuild/engine/' + n + '.cjs');
const NEW_ENGINE = ['b1-delta-cells.cjs','b1-unknown-recovery.test.cjs','b1b2-public-engine.cjs','b1b2-sleep-target-cells.cjs'].map(n => 'rebuild/engine/test/' + n);
const SUCCESSOR_RUNTIME = ['writers','today','progression','sleep'].map(n => 'rebuild/engine/' + n + '.cjs');
const SUCCESSOR_NEW_ENGINE = ['b2-public-source-faults.test.cjs','b2-era30.test.cjs'].map(n => 'rebuild/engine/test/' + n);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = args => cp.execFileSync('git', args, { cwd: ROOT, maxBuffer: 9e7, windowsHide: true });
function keys(value, expected, label) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), label + ' object');
  assert.deepEqual(Object.keys(value).sort(), expected.slice().sort(), label + ' closed fields');
}
function successorRef(table = changes.successor) {
  keys(table, ['sourceBase','runtimeSource','runtime','engineEvidence','nativeComparison'], 'successor');
  assert.equal(table.sourceBase, R, 'successor fixed R preimage');
  assert.equal(typeof table.runtimeSource, 'string');
  assert.match(table.runtimeSource, /^[a-f0-9]{40}$/, 'successor immutable commit');
  assert.ok(![M,R,H3_BASE,'0'.repeat(40)].includes(table.runtimeSource), 'successor distinct source');
  return table.runtimeSource;
}
const sourceRef = ref => { assert.ok([M,R,H3_BASE,'HEAD'].includes(ref) || ref === successorRef(), 'fixed source ref'); return ref; };
const blob = (ref, file) => git(['show', sourceRef(ref) + ':' + file]);
const disk = file => fs.readFileSync(path.join(ROOT, file));
const list = ref => git(['ls-tree','-r','--name-only',sourceRef(ref),'rebuild/engine']).toString().trim().split('\n').filter(Boolean).sort();
function exact(source, before, after, id) {
  assert.ok(before && after && before !== after, 'nonempty, non-noop carrier ' + id);
  assert.equal(source.split(before).length, 2, 'unique source site ' + id);
  return source.replace(before, after);
}
function validateTable(table = changes) {
  assert.equal(table.sourceBase, M); assert.equal(table.runtimeSource, R); assert.equal(table.h3SourceBase,H3_BASE);
  assert.deepEqual(table.runtime.map(r=>r.file).sort(), RUNTIME.slice().sort(), 'exact eight runtime files');
  const ids = table.runtime.flatMap(r=>r.hunks.map(h=>h.id));
  assert.equal(ids.length,65,'original M/R hunk count');
  assert.equal(new Set(ids).size, ids.length, 'unique declared hunk identities');
  for (const row of table.runtime) {
    assert.ok(row.hunks.length); assert.match(row.pre,/^[a-f0-9]{64}$/); assert.match(row.post,/^[a-f0-9]{64}$/);
    assert.notEqual(row.pre,row.post);
    for (const h of row.hunks) assert.ok(h.before && h.after && h.before !== h.after, h.id);
  }
}
function reconstructRuntime(table = changes, historical = file => blob(R,file)) {
  validateTable(table);
  const report=[];
  for (const row of table.runtime) {
    const before=blob(M,row.file), after=blob(R,row.file);
    assert.equal(sha(before),row.pre); assert.equal(sha(after),row.post);
    let forward=before.toString();
    for(const h of row.hunks) forward=exact(forward,h.before,h.after,h.id);
    assert.equal(forward,after.toString(),'whole forward '+row.file);
    let inverse=after.toString();
    for(const h of [...row.hunks].reverse()) inverse=exact(inverse,h.after,h.before,h.id+' inverse');
    assert.equal(inverse,before.toString(),'whole inverse '+row.file);
    assert.deepEqual(historical(row.file),after,'historical R post '+row.file);
    assert.notEqual(before.toString(),forward,'preimage is behaviorally distinct source '+row.file);
    report.push({file:row.file,pre:row.pre,post:row.post,hunks:row.hunks.length});
  }
  return report;
}
function validateSuccessor(table = changes.successor) {
  const S=successorRef(table);
  assert.equal(S,successorRef(),'single named successor source');
  assert.equal(git(['rev-parse','--verify',S+'^{commit}']).toString().trim(),S,'successor commit identity');
  git(['merge-base','--is-ancestor',R,S]);
  assert.ok(Array.isArray(table.runtime) && table.runtime.length>0,'nonempty successor runtime delta');
  assert.ok(Array.isArray(table.engineEvidence),'successor evidence array');
  const files=[],ids=[];
  for(const row of table.runtime) {
    keys(row,['file','pre','post','hunks'],'successor runtime row');
    assert.ok(SUCCESSOR_RUNTIME.includes(row.file),'closed successor runtime file');
    assert.match(row.pre,/^[a-f0-9]{64}$/);assert.match(row.post,/^[a-f0-9]{64}$/);assert.notEqual(row.pre,row.post);
    assert.ok(Array.isArray(row.hunks) && row.hunks.length>0,'successor literal hunks');
    for(const h of row.hunks) {
      keys(h,['id','before','after'],'successor hunk');
      assert.equal(typeof h.id,'string');assert.ok(h.id.length>0);ids.push(h.id);
      assert.equal(typeof h.before,'string');assert.equal(typeof h.after,'string');
      assert.ok(h.before && h.after && h.before!==h.after,'nonempty non-noop successor hunk');
    }
    files.push(row.file);
  }
  for(const row of table.engineEvidence) {
    keys(row,['file','pre','post'],'successor engine evidence row');
    assert.ok([...NEW_ENGINE,...SUCCESSOR_NEW_ENGINE].includes(row.file),'closed successor engine evidence file');
    if(SUCCESSOR_NEW_ENGINE.includes(row.file))assert.equal(row.pre,null,'new successor evidence preimage');
    else assert.match(row.pre,/^[a-f0-9]{64}$/,'existing successor evidence preimage');
    assert.match(row.post,/^[a-f0-9]{64}$/);assert.notEqual(row.pre,row.post);files.push(row.file);
  }
  assert.equal(new Set(files).size,files.length,'unique successor paths');
  assert.equal(new Set(ids).size,ids.length,'unique successor hunk identities');
  assert.deepEqual(table.engineEvidence.filter(row=>row.pre===null).map(row=>row.file).sort(),SUCCESSOR_NEW_ENGINE.slice().sort(),'exact successor additions');
  keys(table.nativeComparison,['from','to','fieldDeltas'],'successor native comparison');
  assert.equal(table.nativeComparison.from,M,'successor native comparison M base');assert.equal(table.nativeComparison.to,S,'successor native comparison S source');
  assert.deepEqual(table.nativeComparison.fieldDeltas,[],'successor native deltas require separate PM admission');
  const declared=[...table.runtime.map(row=>'M\t'+row.file),...table.engineEvidence.map(row=>(row.pre===null?'A':'M')+'\t'+row.file)].sort();
  const actual=git(['diff','--no-ext-diff','--no-textconv','--no-renames','--name-status',R,S,'--','rebuild/engine']).toString().trim().split('\n').filter(Boolean).sort();
  assert.deepEqual(actual,declared,'exact R/S engine source delta');
  return table;
}
function reconstructSuccessor(table = changes.successor, current = disk, head = file => blob('HEAD',file)) {
  validateSuccessor(table);const S=table.runtimeSource,runtime=[],engineEvidence=[];
  for(const row of table.runtime) {
    const before=blob(R,row.file),after=blob(S,row.file);
    assert.equal(sha(before),row.pre,'successor R preimage '+row.file);assert.equal(sha(after),row.post,'successor S postimage '+row.file);
    let forward=before.toString(),inverse=after.toString();
    for(const h of row.hunks)forward=exact(forward,h.before,h.after,h.id);
    for(const h of [...row.hunks].reverse())inverse=exact(inverse,h.after,h.before,h.id+' inverse');
    assert.equal(forward,after.toString(),'whole successor forward '+row.file);assert.equal(inverse,before.toString(),'whole successor inverse '+row.file);
    assert.deepEqual(current(row.file),after,'candidate S post '+row.file);assert.deepEqual(head(row.file),after,'candidate HEAD/S post '+row.file);
    runtime.push({file:row.file,pre:row.pre,post:row.post,hunks:row.hunks.length});
  }
  const originalFiles=list(R);
  for(const row of table.engineEvidence) {
    if(row.pre===null)assert.equal(originalFiles.includes(row.file),false,'new successor file absent at R');
    else assert.equal(sha(blob(R,row.file)),row.pre,'successor evidence R preimage '+row.file);
    const after=blob(S,row.file);assert.equal(sha(after),row.post,'successor evidence S postimage '+row.file);
    assert.deepEqual(current(row.file),after,'candidate S evidence '+row.file);assert.deepEqual(head(row.file),after,'candidate HEAD/S evidence '+row.file);
    engineEvidence.push({...row});
  }
  return {sourceBase:R,runtimeSource:S,runtime,engineEvidence};
}
function original(name) {
  const file=W+name;
  assert.ok(Object.hasOwn(changes.originals,file),'closed original evidence name');
  const bytes=disk(file);
  assert.equal(sha(bytes),changes.originals[file],'pinned original '+name);
  assert.deepEqual(bytes,blob(M,file)); assert.deepEqual(bytes,blob('HEAD',file));
  return bytes.toString();
}
function reconstructH3() {
  const source=original('h3-supersede-source-carriers.test.cjs');
  assert.equal(sha(source),changes.originalH3.sourceHash);
  const start=source.indexOf('const CARRIERS = [')+'const CARRIERS = '.length;
  assert.deepEqual(JSON.parse(source.slice(start,source.indexOf('\n];',start)+2)),changes.originalH3.hunks);
  assert.equal(changes.originalH3.hunks.length,4);
  for(const file of ['rebuild/engine/writers.cjs','rebuild/engine/constants.cjs']) {
    const before=blob(H3_BASE,file).toString(),after=blob(M,file).toString(),hunks=changes.originalH3.hunks.filter(h=>h.file===file);
    let forward=before, inverse=after;
    for(const h of hunks) { forward=exact(forward,h.before,h.after,h.id); assert.equal(disk(file).toString().split(h.after).length,2,'H3 retained '+h.id); }
    for(const h of [...hunks].reverse()) inverse=exact(inverse,h.after,h.before,h.id+' inverse');
    assert.equal(forward,after); assert.equal(inverse,before);
  }
  return 4;
}
// FULL inventory, including source/HEAD/disk bytes. This function reaches the
// native seed and is held for the later PC grant; metadata is never a PASS.
function historicalEngineInventory() {
  const base=list(M), expected=[...base,...NEW_ENGINE].sort();
  assert.deepEqual(list(R),expected,'original M/R engine inventory');
  const moved=[],unchanged=[];
  for(const file of expected) {
    const expectedBytes=blob(R,file);
    if(!NEW_ENGINE.includes(file)) {
      if(!blob(M,file).equals(expectedBytes)) moved.push(file); else unchanged.push(file);
    }
  }
  assert.deepEqual(moved.sort(),RUNTIME.slice().sort());
  return {total:expected.length,added:NEW_ENGINE.length,changed:moved.length,unchanged:unchanged.length};
}
function closedEngineInventory() {
  const table=validateSuccessor(),S=table.runtimeSource;
  reconstructSuccessor(table);
  const original=historicalEngineInventory(),prior=list(R),added=table.engineEvidence.filter(row=>row.pre===null).map(row=>row.file);
  const expected=[...prior,...added].sort();
  assert.deepEqual(list(S),expected,'closed successor source inventory');assert.deepEqual(list('HEAD'),expected,'closed successor HEAD inventory');
  const actual=[];
  function walk(dir){for(const e of fs.readdirSync(path.join(ROOT,dir),{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())walk(f);else actual.push(f);}}
  walk('rebuild/engine');assert.deepEqual(actual.sort(),expected,'closed candidate on-disk engine inventory');
  const moved=[],unchanged=[];
  for(const file of expected) {
    const after=blob(S,file);
    assert.deepEqual(disk(file),after,'candidate disk/S '+file);assert.deepEqual(blob('HEAD',file),after,'candidate HEAD/S '+file);
    if(!added.includes(file)){if(blob(R,file).equals(after))unchanged.push(file);else moved.push(file);}
  }
  assert.deepEqual(moved.sort(),[...table.runtime.map(row=>row.file),...table.engineEvidence.filter(row=>row.pre!==null).map(row=>row.file)].sort(),'closed changed successor engine inventory');
  return {runtimeSource:S,total:expected.length,original,successor:{sourceBase:R,added:added.length,changed:moved.length,unchanged:unchanged.length}};
}
function candidateSource(file) {
  const S=successorRef(),bytes=blob(S,file);
  assert.deepEqual(disk(file),bytes,'candidate dependency disk/S '+file);
  assert.deepEqual(blob('HEAD',file),bytes,'candidate dependency HEAD/S '+file);
  return bytes;
}
function s1Source() {
  const before=original('h3-clean-init.test.cjs');
  assert.equal(sha(before),changes.s1.pre); assert.equal(changes.s1.hunks.length,8);
  let after=before;
  for(const h of changes.s1.hunks) after=exact(after,h.before,h.after,h.id);
  assert.equal(sha(after),changes.s1.post);
  let inverse=after;
  for(const h of [...changes.s1.hunks].reverse()) inverse=exact(inverse,h.after,h.before,h.id+' inverse');
  assert.equal(inverse,before,'entire unchanged H3/S1 remainder');
  assert.equal((after.match(/^test\(/gm)||[]).length,14,'all original tests');
  return after;
}
const ORIGINAL_DIRECT_DEPENDENCIES = {
  'h3-clean-init.test.cjs':[
    'rebuild/m4/workout/athlete-state.cjs',
    'rebuild/m3/w7-preview/today/today-model.cjs',
    'rebuild/m3/w7-preview/today/today-engine.cjs',
    'rebuild/m3/w7-preview/today/design.cjs',
    'rebuild/m3/w7-preview/today/today-app.cjs',
  ],
  'h3-supersede-defect-witnesses.test.cjs':[
    'rebuild/lanes/b/tooling/packages/H3.json',
    'rebuild/m3/w7-preview/browser-engine.cjs',
    'rebuild/m4/workout/athlete-state.cjs',
  ],
  'h3-supersede-writers-differential.test.cjs':[
    'rebuild/lanes/b/tooling/packages/H3.json',
    'rebuild/m3/w7-preview/browser-engine.cjs',
    'rebuild/m4/workout/athlete-state.cjs',
  ],
  'h3-supersede-second-gate.test.cjs':[
    'rebuild/lanes/b/tooling/packages/H3.json',
    'rebuild/m3/w7-preview/browser-engine.cjs',
    'rebuild/m4/workout/athlete-state.cjs',
  ],
};
const CURRENT_CONSTRUCTORS = [
  'rebuild/m3/w7-preview/browser-engine.cjs',
  'rebuild/m3/w7-preview/today/today-engine.cjs',
  'rebuild/m4/workout/engine-runtime.cjs',
  'rebuild/m3/w6/host/engine-runtime-host.cjs',
];
function pinScopedOriginalDependencies(name) {
  assert.ok(Object.hasOwn(ORIGINAL_DIRECT_DEPENDENCIES,name),'closed original dependency inventory');
  closedEngineInventory();
  for(const file of new Set([...CURRENT_CONSTRUCTORS,...ORIGINAL_DIRECT_DEPENDENCIES[name]]))candidateSource(file);
  // Scoped engine/direct-dependency pins only. Original require resolution is
  // unchanged; remaining transitive product pins and native execution stay in
  // the later full profile/product phase, not this construction proof.
}
function loadOriginal(name, repairedS1=false) {
  assert.ok(['h3-clean-init.test.cjs','h3-supersede-defect-witnesses.test.cjs','h3-supersede-writers-differential.test.cjs','h3-supersede-second-gate.test.cjs'].includes(name),'closed original loader');
  assert.equal(repairedS1,name==='h3-clean-init.test.cjs','S1 transform applies only to H3');
  pinScopedOriginalDependencies(name);
  const source=repairedS1?s1Source():original(name),file=path.join(ROOT,W+name),m=new Module(file,module);
  m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
  // This is the pinned original program and its original dependency resolution,
  // not a reference fallback or a new fixture. Invoke only in the later PC gate.
  m._compile(source,file); return m.exports;
}
const MODULES=['dates','constants','seed','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>n+'.cjs');
const BROWSER=['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','earn'].map(n=>n+'.cjs');
function sourceFactory(ref) {
  const table=validateSuccessor();assert.ok([M,R,table.runtimeSource].includes(ref),'closed native factory source BEFORE read');const cache=new Map();
  return function load(name) {
    assert.ok(MODULES.includes(name),'closed engine factory BEFORE read '+name);
    if(cache.has(name)) return cache.get(name).exports;
    const file='rebuild/engine/'+name;
    // The current source is pinned before any factory compilation, including seed.
    candidateSource(file);
    const source=blob(ref,file).toString(),m=new Module(path.join(ROOT,file));
    m.filename=path.join(ROOT,file);cache.set(name,m);
    m.require=request=>{assert.equal(request,'./entered-load.cjs','closed factory dependency BEFORE read');return load('entered-load.cjs');};
    m._compile(source,m.filename);return m.exports;
  };
}
const DAY='2026-09-07';
const clock=()=>({today:()=>DAY,nowISO:()=>DAY+'T08:00:00.000Z'});
const refusingIds=Object.freeze({next:()=>{throw Error('IDS_UNAVAILABLE');},fresh:()=>{throw Error('IDS_UNAVAILABLE');}});
function nativeBrowser(ref) {
  reconstructSuccessor();
  const browserFile='rebuild/m3/w7-preview/browser-engine.cjs',source=blob(M,browserFile).toString();
  assert.deepEqual(candidateSource(browserFile),blob(M,browserFile),'unchanged browser constructor');
  assert.deepEqual([...source.matchAll(/require\("\.\.\/\.\.\/engine\/([^"\n]+)"\)/g)].map(m=>m[1]),BROWSER);
  for(const name of [...BROWSER,'seed.cjs','writers.cjs'])candidateSource('rebuild/engine/'+name);
  const load=sourceFactory(ref),m=new Module(path.join(ROOT,browserFile));m.filename=path.join(ROOT,browserFile);
  m.require=request=>{const prefix='../../engine/';assert.ok(request.startsWith(prefix));const name=request.slice(prefix.length);assert.ok(BROWSER.includes(name));return load(name);};
  m._compile(source,m.filename);const c=clock(),E=m.exports.createBrowserEngine({clock:c});
  Object.assign(E,load('seed.cjs')(E));Object.assign(E,load('writers.cjs')(E,{clock:c,ids:refusingIds}));
  return E;
}
function nativeEngine(ref,options) {
  reconstructSuccessor();
  const file='rebuild/engine/index.cjs',source=blob(M,file).toString();
  assert.deepEqual(blob(ref,file),blob(M,file));assert.deepEqual(candidateSource(file),blob(M,file),'unchanged engine constructor');
  assert.deepEqual([...source.matchAll(/require\("\.\/([^"\n]+)"\)/g)].map(m=>m[1]),MODULES);
  for(const name of MODULES)candidateSource('rebuild/engine/'+name);
  const load=sourceFactory(ref),m=new Module(path.join(ROOT,file));m.filename=path.join(ROOT,file);
  m.require=request=>{assert.ok(request.startsWith('./'));return load(request.slice(2));};
  m._compile(source,m.filename);return m.exports.createEngine(options);
}
const READERS=['nowModel','statusFace','currentRate','calorieTarget','proteinTarget','marchingOrder','readRecency','fiveLevers','recoveryIndex','sleepInfo','observedTDEE','weekDigest','debtLedger','theOneThing','dossierData'];
function projection(E,state) {const out={};for(const r of READERS){assert.equal(typeof E[r],'function','required reader '+r);const bytes=JSON.stringify(E[r](structuredClone(state)));assert.notEqual(bytes,undefined,'real reader output '+r);out[r]=JSON.parse(bytes);}return out;}
function fieldDiff(a,b,at='$',out=[]) {
  if(Object.is(a,b))return out;
  if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)) {
    for(const k of [...new Set([...Object.keys(a),...Object.keys(b)])].sort()) {
      if(!Object.hasOwn(a,k)||!Object.hasOwn(b,k)) out.push({path:at+'.'+k,before:{present:Object.hasOwn(a,k),value:a[k]},after:{present:Object.hasOwn(b,k),value:b[k]}});
      else fieldDiff(a[k],b[k],at+'.'+k,out);
    }
  } else out.push({path:at,before:{present:true,value:a},after:{present:true,value:b}});
  return out;
}
function approvedNativeDifference(kind,before,after) {
  assert.ok(['second-readers','second-applyRead','native-census-main','native-census-frozen','native-census-unfrozen'].includes(kind),'closed successor native comparison kind');
  const comparison=validateSuccessor().nativeComparison;
  const actual=fieldDiff(before,after),approved=comparison.fieldDeltas;
  // Empty at construction: a native delta must be measured and separately
  // admitted. No reader-wide exception, ignored prose, or equality sampling.
  assert.equal(JSON.stringify(actual)===JSON.stringify(approved),true,'exact admitted native field deltas '+kind+'; measured '+actual.length+' (values retained process-locally)');
  if(actual.length===0)assert.equal(JSON.stringify(before)===JSON.stringify(after),true,'whole native output bytes '+kind);
  return {kind,sourceBase:comparison.from,runtimeSource:comparison.to,before:sha(JSON.stringify(before)),after:sha(JSON.stringify(after)),deltaCount:actual.length};
}
function migrationWorker(ref,mode) {
  const S=validateSuccessor().runtimeSource;
  assert.ok([M,S].includes(ref),'closed candidate migration side');assert.ok(['frozen','native'].includes(mode));
  closedEngineInventory();
  for(const dependency of ['rebuild/engine/test/migrate-reference.cjs','rebuild/conform/oracle/legacy-records.cjs'])candidateSource(dependency);
  const file='rebuild/engine/test/migrate-differential.cjs',bytes=candidateSource(file);
  assert.equal(sha(bytes),changes.originals[file]);assert.deepEqual(bytes,blob(M,file));assert.deepEqual(bytes,blob('HEAD',file));
  assert.deepEqual(blob(M,'rebuild/engine/migrate.cjs'),blob(R,'rebuild/engine/migrate.cjs'));
  assert.deepEqual(candidateSource('rebuild/engine/migrate.cjs'),blob(R,'rebuild/engine/migrate.cjs'),'retained R/S migration source');
  const abs=path.join(ROOT,file),normal=Module.createRequire(abs),output=[],savedDate=globalThis.Date;
  const frozen=path.join(ROOT,'rebuild/conform/engines/engine-main.cjs'),m=new Module(abs,module);m.filename=abs;
  m.__process={argv:[process.execPath,abs,'--worker',mode],env:{...process.env,ENGINE_MAIN:frozen,MEASURED_TEST_NOW:'2026-09-03',TZ:'America/New_York'}};
  m.__console={log:(...args)=>output.push(args.map(String).join(' '))};
  m.require=request=>{
    if(request==='../index.cjs')return {createEngine:options=>nativeEngine(ref,options)};
    assert.ok(['node:assert/strict','node:path','node:child_process','./migrate-reference.cjs','../../conform/oracle/legacy-records.cjs',frozen].includes(request),'closed original migration dependency BEFORE load');return normal(request);
  };
  try {m._compile('"use strict";const process=module.__process,console=module.__console;\n'+bytes.toString(),abs);}
  finally {globalThis.Date=savedDate;assert.strictEqual(globalThis.Date,savedDate);assert.deepEqual(disk(file),bytes);}
  const terminal=output.at(-1);assert.match(terminal,new RegExp('^M5 SYNTHETIC '+mode+': PASS'));
  const counts=/([0-9]+) exact differential cases; ([0-9]+) migration exits/.exec(terminal);assert.ok(counts);assert.ok(+counts[1]>0&&+counts[2]>0);
  for(const line of output)console.log(line);
}
function migrationContinuity() {
  const S=validateSuccessor().runtimeSource;
  assert.equal(process.env.B1B2_MIGRATION_STAGE,undefined,'full parent execution required');
  const target=path.join(ROOT,W+'b1b2-supersede-inherited-carriers.test.cjs'),reports=[];
  for(const side of ['M','S'])for(const mode of ['frozen','native']) {
    const result=cp.spawnSync(process.execPath,[target],{cwd:ROOT,windowsHide:true,encoding:'utf8',maxBuffer:9e7,
      env:{...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',B1B2_MIGRATION_STAGE:'worker',B1B2_MIGRATION_SIDE:side,B1B2_MIGRATION_CLOCK:mode}});
    process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.error)throw result.error;
    assert.equal(result.status,0,'complete original migration worker '+side+'/'+mode);assert.equal(result.signal,null);
    const terminal=(result.stdout||'').trim().split('\n').at(-1);assert.match(terminal,new RegExp('^M5 SYNTHETIC '+mode+': PASS'));
    const counts=/([0-9]+) exact differential cases; ([0-9]+) migration exits/.exec(terminal);assert.ok(counts&&+counts[1]>0&&+counts[2]>0);
    reports.push({side,source:side==='M'?M:S,mode,cases:+counts[1],exits:+counts[2],stdout:result.stdout,stderr:result.stderr,sha256:sha(result.stdout),terminal});
  }
  assert.equal(reports.length,4);
  for(const mode of ['frozen','native']) {const rows=reports.filter(r=>r.mode===mode);assert.equal(rows[0].stdout,rows[1].stdout,'whole original M/S migration output');assert.equal(rows[0].stderr,rows[1].stderr);}
  return reports.map(({stdout,stderr,...r})=>r);
}
module.exports={ROOT,M,R,get S(){return successorRef();},H3_BASE,W,RUNTIME,NEW_ENGINE,SUCCESSOR_NEW_ENGINE,changes,sha,blob,disk,exact,validateTable,reconstructRuntime,validateSuccessor,reconstructSuccessor,reconstructH3,historicalEngineInventory,closedEngineInventory,candidateSource,pinScopedOriginalDependencies,original,s1Source,loadOriginal,nativeBrowser,nativeEngine,READERS,DAY,projection,fieldDiff,approvedNativeDifference,migrationContinuity,migrationWorker};
