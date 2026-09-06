import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import esbuild from 'esbuild';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const C=path.join(ROOT,'rebuild/conform');
const COMMITS={main:'fe516c1f2b1d7d756a24e46d000d23ac1c747aa8',old:'a0009c3644263a2a7227f9b5dec16f7f7edaf51b'};
const SOURCES=['src/app.jsx','src/history.js','tools/_fixed-now.mjs'];
const ENV={...process.env,MEASURED_TEST_NOW:'2026-09-03',TZ:'America/New_York'};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const gitBlob=(commit,name)=>execFileSync('git',['show',`${commit}:${name}`],{cwd:ROOT,windowsHide:true,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']}).toString('utf8');

// Read only these public source files from Git. No worktree checkout, ledger,
// private fixture, golden regeneration, source substitution or global temp reuse.
export async function buildPublicEngines() {
  const out=path.join(ROOT,'.tmp/m3-w0-engines');fs.mkdirSync(out,{recursive:true});const engines={};
  for(const [name,commit] of Object.entries(COMMITS)) {
    const sources=Object.fromEntries(SOURCES.map(p=>[p,gitBlob(commit,p)]));
    const outfile=path.join(out,`engine-${name}.cjs`);
    await esbuild.build({stdin:{contents:'import "./tools/_fixed-now.mjs"; export {__test} from "./src/app.jsx";',resolveDir:ROOT,sourcefile:'w0-entry.mjs'},
      bundle:true,platform:'node',format:'cjs',jsx:'automatic',outfile,absWorkingDir:ROOT,logLevel:'silent',
      plugins:[{name:'pinned-public-source',setup(build){
        build.onResolve({filter:/^\.\/(src\/app\.jsx|tools\/_fixed-now\.mjs)$/},args=>({path:args.path.slice(2),namespace:'frozen'}));
        build.onResolve({filter:/^\.\/history\.js$/,namespace:'frozen'},()=>({path:'src/history.js',namespace:'frozen'}));
        build.onLoad({filter:/.*/,namespace:'frozen'},args=>{assert.ok(Object.hasOwn(sources,args.path));return {contents:sources[args.path],loader:args.path.endsWith('.jsx')?'jsx':'js',resolveDir:ROOT};});
      }}]});engines[name]=outfile;
  }
  return engines;
}

function run(args,env=ENV) {
  const r=spawnSync(process.execPath,args,{cwd:ROOT,env,windowsHide:true,encoding:'utf8',maxBuffer:16*1024*1024,timeout:300000});
  assert.equal(r.status,0,'public command failed');return r.stdout;
}

export function checkPublicOracle(engines) {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'earned-w0-public-oracle-'));
  // The unchanged CLI selects existing fixtures. Copy a positive list of PUBLIC
  // directories only; never copy private/ even during a local private-gate run.
  for(const name of ['oracle','lib','fixtures','golden'])fs.cpSync(path.join(C,name),path.join(temp,name),{recursive:true,filter:p=>!p.endsWith('run.log')});
  assert.ok(!fs.existsSync(path.join(temp,'private')));
  const manifest=JSON.parse(fs.readFileSync(path.join(temp,'oracle/manifest.json')));
  for(const name of ['preimage-2026-08-15','synthetic-pending-debut']) {
    const pin=manifest.goldens[name+'.main'];
    assert.equal(sha(fs.readFileSync(path.join(temp,'fixtures',name+'.json'))),pin.blobSha256);
    assert.equal(sha(fs.readFileSync(path.join(temp,pin.path))),pin.goldenSha256);
  }
  const inventory=JSON.parse(fs.readFileSync(path.join(C,'laws/manifest.json'))).port;
  for(const mode of ['check','sensitivity']) {
    const expected=inventory[mode].filter(id=>!id.startsWith('PORT-live-')).sort();
    const text=run([path.join(temp,'oracle/port-oracle.cjs'),mode,engines[mode==='check'?'main':'old'],mode==='check'?'main':'old']);
    const seen=[...text.matchAll(/^GREEN\s+(\S+)/gm)].map(m=>m[1]).sort();assert.deepEqual(seen,expected,'public oracle inventory differs');
    assert.match(text,new RegExp(`${expected.length} GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR`));
    console.log(`PUBLIC-ORACLE ${mode} PASS — ${expected.length}/${expected.length} unchanged public oracle laws; private NOT RUN`);
  }
  const expected=inventory.check.filter(id=>!id.startsWith('PORT-live-')).sort();
  for(const mode of ['frozen','native']) {
    const args=mode==='frozen'?['--import',pathToFileURL(path.join(ROOT,'tools/_fixed-now.mjs')).href]:[];
    const text=run([...args,path.join(temp,'oracle/port-oracle.cjs'),'check',path.join(ROOT,'rebuild/engine/oracle-shim.cjs'),'candidate','main']);
    assert.deepEqual([...text.matchAll(/^GREEN\s+(\S+)/gm)].map(m=>m[1]).sort(),expected,'candidate public census differs');
    assert.match(text,/7 GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR/);
    console.log(`PUBLIC-CANDIDATE ${mode} PASS — 7/7 unchanged public oracle laws; private NOT RUN`);
  }
  const r=run([path.join(C,'rig185.cjs')],{...ENV,ENGINE_MAIN:engines.main,ENGINE_OLD:engines.old});
  assert.match(r,/^W1 .*⇒ PASS$/m);assert.match(r,/^W2 .*⇒ PASS$/m);assert.doesNotMatch(r,/SKIPPED/);
  console.log('ENGINE-TRACK PASS — rig185 W1 PASS, W2 PASS on frozen engine; unchanged assertions');
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {checkPublicOracle(await buildPublicEngines());}
  catch {console.error('PUBLIC-ORACLE FAIL — pinned public source/fixture/gate invariant');process.exitCode=1;}
}
