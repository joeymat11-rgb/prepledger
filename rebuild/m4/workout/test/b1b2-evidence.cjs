'use strict';
// GO232 construction. Native consumers are deliberately lazy: authoring this
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
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = args => cp.execFileSync('git', args, { cwd: ROOT, maxBuffer: 9e7, windowsHide: true });
const blob = (ref, file) => { assert.ok([M,R,H3_BASE,'HEAD'].includes(ref), 'fixed source ref'); return git(['show', ref + ':' + file]); };
const disk = file => fs.readFileSync(path.join(ROOT, file));
const list = ref => git(['ls-tree','-r','--name-only',ref,'rebuild/engine']).toString().trim().split('\n').filter(Boolean).sort();
function exact(source, before, after, id) {
  assert.ok(before && after && before !== after, 'nonempty, non-noop carrier ' + id);
  assert.equal(source.split(before).length, 2, 'unique source site ' + id);
  return source.replace(before, after);
}
function validateTable(table = changes) {
  assert.equal(table.sourceBase, M); assert.equal(table.runtimeSource, R); assert.equal(table.h3SourceBase,H3_BASE);
  assert.deepEqual(table.runtime.map(r=>r.file).sort(), RUNTIME.slice().sort(), 'exact eight runtime files');
  const ids = table.runtime.flatMap(r=>r.hunks.map(h=>h.id));
  assert.equal(new Set(ids).size, ids.length, 'unique declared hunk identities');
  for (const row of table.runtime) {
    assert.ok(row.hunks.length); assert.match(row.pre,/^[a-f0-9]{64}$/); assert.match(row.post,/^[a-f0-9]{64}$/);
    assert.notEqual(row.pre,row.post);
    for (const h of row.hunks) assert.ok(h.before && h.after && h.before !== h.after, h.id);
  }
}
function reconstructRuntime(table = changes, current = disk) {
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
    assert.deepEqual(current(row.file),after,'current post '+row.file);
    assert.deepEqual(blob('HEAD',row.file),after,'HEAD post '+row.file);
    assert.notEqual(before.toString(),forward,'preimage is behaviorally distinct source '+row.file);
    report.push({file:row.file,pre:row.pre,post:row.post,hunks:row.hunks.length});
  }
  return report;
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
function closedEngineInventory() {
  const base=list(M), expected=[...base,...NEW_ENGINE].sort();
  assert.deepEqual(list(R),expected); assert.deepEqual(list('HEAD'),expected);
  const actual=[];
  function walk(dir){ for(const e of fs.readdirSync(path.join(ROOT,dir),{withFileTypes:true})) {const f=dir+'/'+e.name;if(e.isDirectory())walk(f);else actual.push(f);} }
  walk('rebuild/engine'); assert.deepEqual(actual.sort(),expected,'closed on-disk engine inventory');
  const moved=[],unchanged=[];
  for(const file of expected) {
    const expectedBytes=blob(R,file);
    assert.deepEqual(disk(file),expectedBytes,'disk/R '+file);
    assert.deepEqual(blob('HEAD',file),expectedBytes,'HEAD/R '+file);
    if(!NEW_ENGINE.includes(file)) {
      if(!blob(M,file).equals(expectedBytes)) moved.push(file); else unchanged.push(file);
    }
  }
  assert.deepEqual(moved.sort(),RUNTIME.slice().sort());
  return {total:expected.length,added:NEW_ENGINE.length,changed:moved.length,unchanged:unchanged.length};
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
function loadOriginal(name, repairedS1=false) {
  assert.ok(['h3-clean-init.test.cjs','h3-supersede-defect-witnesses.test.cjs','h3-supersede-writers-differential.test.cjs','h3-supersede-second-gate.test.cjs'].includes(name),'closed original loader');
  assert.equal(repairedS1,name==='h3-clean-init.test.cjs','S1 transform applies only to H3');
  const source=repairedS1?s1Source():original(name),file=path.join(ROOT,W+name),m=new Module(file,module);
  m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
  // This is the pinned original program and its original dependency resolution,
  // not a reference fallback or a new fixture. Invoke only in the later PC gate.
  m._compile(source,file); return m.exports;
}
const MODULES=['dates','constants','seed','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>n+'.cjs');
const BROWSER=['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','earn'].map(n=>n+'.cjs');
function sourceFactory(ref) {
  assert.ok([M,R].includes(ref));const cache=new Map();
  return function load(name) {
    assert.ok(MODULES.includes(name),'closed engine factory BEFORE read '+name);
    if(cache.has(name)) return cache.get(name).exports;
    const file='rebuild/engine/'+name,source=blob(ref,file).toString(),m=new Module(path.join(ROOT,file));
    m.filename=path.join(ROOT,file);cache.set(name,m);
    m.require=request=>{assert.equal(request,'./entered-load.cjs','closed factory dependency BEFORE read');return load('entered-load.cjs');};
    m._compile(source,m.filename);return m.exports;
  };
}
const DAY='2026-09-07';
const clock=()=>({today:()=>DAY,nowISO:()=>DAY+'T08:00:00.000Z'});
const refusingIds=Object.freeze({next:()=>{throw Error('IDS_UNAVAILABLE');},fresh:()=>{throw Error('IDS_UNAVAILABLE');}});
function nativeBrowser(ref) {
  const browserFile='rebuild/m3/w7-preview/browser-engine.cjs',source=blob(M,browserFile).toString();
  assert.deepEqual(disk(browserFile),blob(M,browserFile));
  assert.deepEqual([...source.matchAll(/require\("\.\.\/\.\.\/engine\/([^"\n]+)"\)/g)].map(m=>m[1]),BROWSER);
  const load=sourceFactory(ref),m=new Module(path.join(ROOT,browserFile));m.filename=path.join(ROOT,browserFile);
  m.require=request=>{const prefix='../../engine/';assert.ok(request.startsWith(prefix));const name=request.slice(prefix.length);assert.ok(BROWSER.includes(name));return load(name);};
  m._compile(source,m.filename);const c=clock(),E=m.exports.createBrowserEngine({clock:c});
  Object.assign(E,load('seed.cjs')(E));Object.assign(E,load('writers.cjs')(E,{clock:c,ids:refusingIds}));
  return E;
}
function nativeEngine(ref,options) {
  const file='rebuild/engine/index.cjs',source=blob(M,file).toString();
  assert.deepEqual(blob(ref,file),blob(M,file));assert.deepEqual(disk(file),blob(M,file));
  assert.deepEqual([...source.matchAll(/require\("\.\/([^"\n]+)"\)/g)].map(m=>m[1]),MODULES);
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
  const actual=fieldDiff(before,after),approved=changes.nativeFieldDeltas.filter(d=>d.kind===kind).map(({kind,...d})=>d);
  // Empty at construction: a native delta must be measured and separately
  // admitted. No reader-wide exception, ignored prose, or equality sampling.
  assert.equal(JSON.stringify(actual)===JSON.stringify(approved),true,'exact admitted native field deltas '+kind+'; measured '+actual.length+' (values retained process-locally)');
  if(actual.length===0)assert.equal(JSON.stringify(before)===JSON.stringify(after),true,'whole native output bytes '+kind);
  return {kind,before:sha(JSON.stringify(before)),after:sha(JSON.stringify(after)),deltaCount:actual.length};
}
function migrationWorker(ref,mode) {
  assert.ok([M,R].includes(ref));assert.ok(['frozen','native'].includes(mode));
  const file='rebuild/engine/test/migrate-differential.cjs',bytes=disk(file);
  assert.equal(sha(bytes),changes.originals[file]);assert.deepEqual(bytes,blob(M,file));assert.deepEqual(bytes,blob('HEAD',file));
  assert.deepEqual(blob(M,'rebuild/engine/migrate.cjs'),blob(R,'rebuild/engine/migrate.cjs'));
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
  assert.equal(process.env.B1B2_MIGRATION_STAGE,undefined,'full parent execution required');
  const target=path.join(ROOT,W+'b1b2-supersede-inherited-carriers.test.cjs'),reports=[];
  for(const side of ['M','R'])for(const mode of ['frozen','native']) {
    const result=cp.spawnSync(process.execPath,[target],{cwd:ROOT,windowsHide:true,encoding:'utf8',maxBuffer:9e7,
      env:{...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',B1B2_MIGRATION_STAGE:'worker',B1B2_MIGRATION_SIDE:side,B1B2_MIGRATION_CLOCK:mode}});
    process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.error)throw result.error;
    assert.equal(result.status,0,'complete original migration worker '+side+'/'+mode);assert.equal(result.signal,null);
    const terminal=(result.stdout||'').trim().split('\n').at(-1);assert.match(terminal,new RegExp('^M5 SYNTHETIC '+mode+': PASS'));
    const counts=/([0-9]+) exact differential cases; ([0-9]+) migration exits/.exec(terminal);assert.ok(counts&&+counts[1]>0&&+counts[2]>0);
    reports.push({side,mode,cases:+counts[1],exits:+counts[2],stdout:result.stdout,stderr:result.stderr,sha256:sha(result.stdout),terminal});
  }
  assert.equal(reports.length,4);
  for(const mode of ['frozen','native']) {const rows=reports.filter(r=>r.mode===mode);assert.equal(rows[0].stdout,rows[1].stdout,'whole original M/R migration output');assert.equal(rows[0].stderr,rows[1].stderr);}
  return reports.map(({stdout,stderr,...r})=>r);
}
module.exports={ROOT,M,R,H3_BASE,W,RUNTIME,NEW_ENGINE,changes,sha,blob,disk,exact,validateTable,reconstructRuntime,reconstructH3,closedEngineInventory,original,s1Source,loadOriginal,nativeBrowser,nativeEngine,READERS,DAY,projection,fieldDiff,approvedNativeDifference,migrationContinuity,migrationWorker};
