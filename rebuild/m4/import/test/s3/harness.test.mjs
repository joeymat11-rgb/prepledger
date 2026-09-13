import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {contained,safeRelative,readManifest,verifySources,inspectStaticEdges,tapSummary,suiteInventory,mutantSummary,verifiedBrowser,sha256,MANIFEST} from './run.mjs';

const base=process.env.S3_RUN_ROOT;
function fixture(){
 assert.ok(base,'Actual owned dispatcher scratch required');
 const root=fs.mkdtempSync(path.join(base,'harness-control-'));
 const source='export const value = 1;\n',file='rebuild/public.mjs';
 fs.mkdirSync(path.join(root,'rebuild/m4/spec'),{recursive:true});fs.writeFileSync(path.join(root,file),source);
 const manifest={profile:'earned/s3-provisional-public-sources/v1',sources:[{path:file,sha256:sha256(source)}]};
 fs.writeFileSync(path.join(root,MANIFEST),JSON.stringify(manifest));
 return {root,source,file,manifest};
}
test('S3-HARNESS-PINS: exact source succeeds; missing, stale and extra files refuse',()=>{
 const f=fixture();assert.equal(verifySources(f.root,readManifest(f.root),{extra:true}),1);
 fs.writeFileSync(path.join(f.root,f.file),f.source+'// drift');assert.throws(()=>verifySources(f.root,f.manifest),{code:'S3_SOURCE_DRIFT'});
 fs.writeFileSync(path.join(f.root,f.file),f.source);const missing=structuredClone(f.manifest);missing.sources[0].path='rebuild/missing.mjs';assert.throws(()=>verifySources(f.root,missing),{code:'S3_SOURCE_MISSING'});
 fs.writeFileSync(path.join(f.root,'unlisted.txt'),'extra');assert.throws(()=>verifySources(f.root,f.manifest,{extra:true}),{code:'S3_SOURCE_EXTRA'});
});
test('S3-HARNESS-MANIFEST: duplicate, empty and changed schema refuse before load',()=>{
 for(const edit of [m=>m.sources.push(m.sources[0]),m=>m.sources=[],m=>m.profile='fake']){const f=fixture();edit(f.manifest);fs.writeFileSync(path.join(f.root,MANIFEST),JSON.stringify(f.manifest));assert.throws(()=>readManifest(f.root),{code:'S3_MANIFEST_INVALID'});}
});
test('S3-HARNESS-ROOT: traversal and a junction cannot leave the owned copy',()=>{
 const f=fixture();assert.throws(()=>contained(f.root,path.join(f.root,'../escape')),{code:'S3_ROOT_ESCAPE'});
 const outside=fs.mkdtempSync(path.join(base,'harness-outside-')),link=path.join(f.root,'link');
 fs.symlinkSync(outside,link,process.platform==='win32'?'junction':'dir');assert.throws(()=>contained(f.root,path.join(link,'file')),{code:'S3_REPARSE_ESCAPE'});
});
test('S3-HARNESS-EDGES: private, seed and unlisted imports refuse without loading them',()=>{
 for(const name of ['ledger/state.json','rebuild/conform/private/live.json','rebuild/engine/seed.cjs','../outside','C:/outside'])assert.throws(()=>safeRelative(name));
 const f=fixture();fs.writeFileSync(path.join(f.root,f.file),['import value from ',JSON.stringify('./missing.mjs'),';'].join(''));
 assert.throws(()=>inspectStaticEdges(f.root,f.manifest),{code:'S3_UNLISTED_EDGE'});
});
test('S3-HARNESS-FIXTURE: invented-fixture bytes are pinned like runtime sources',()=>{
 const f=fixture();f.manifest.sources[0].path='rebuild/fixture.json';fs.writeFileSync(path.join(f.root,'rebuild/fixture.json'),f.source);
 assert.equal(verifySources(f.root,f.manifest),1);fs.writeFileSync(path.join(f.root,'rebuild/fixture.json'),'{}');assert.throws(()=>verifySources(f.root,f.manifest),{code:'S3_SOURCE_DRIFT'});
});
const tap=(tests=1,pass=1,fail=0,skipped=0,cancelled=0)=>'# tests '+tests+'\n# pass '+pass+'\n# fail '+fail+'\n# skipped '+skipped+'\n# cancelled '+cancelled+'\n';
test('S3-HARNESS-ACCOUNTING: exit zero, empty cells, skips and cancellations are not success',()=>{
 assert.equal(tapSummary(tap(),0).tests,1);
 for(const log of ['',tap(0,0),tap(1,0,0,1),tap(1,0,0,0,1)])assert.throws(()=>tapSummary(log,0),{code:'S3_TEST_ACCOUNTING'});
 assert.throws(()=>tapSummary(tap(1,0,1),0),{code:'S3_TEST_FAILED'});assert.throws(()=>tapSummary(tap(),1),{code:'S3_TEST_FAILED'});
});
test('S3-HARNESS-MUTANT: only a reached named assertion failure earns a kill',()=>{
 assert.equal(mutantSummary('not ok 1 - named guard\ncode: ERR_ASSERTION',1,'named guard').assertion,true);
 for(const [log,status]of [['not ok named guard MODULE_NOT_FOUND ERR_ASSERTION',1],['not ok named guard SyntaxError ERR_ASSERTION',1],['named guard ERR_ASSERTION',1],['not ok other ERR_ASSERTION',1],['not ok named guard ERR_ASSERTION',0]])assert.throws(()=>mutantSummary(log,status,'named guard'),{code:'S3_MUTANT_NOT_ASSERTION'});
});
test('S3-HARNESS-BROWSER: missing browser is explicitly blocked',()=>{
 assert.throws(()=>verifiedBrowser(''),{code:'S3_BROWSER_UNAVAILABLE'});assert.throws(()=>verifiedBrowser(path.join(base,'missing-browser.exe')),{code:'S3_BROWSER_UNAVAILABLE'});
});

test('S3-HARNESS-CHILD: actual exit-zero and skipped children cannot satisfy named file execution',()=>{
 const f=fixture(),file='rebuild/child.cjs',absolute=path.join(f.root,file);
 const execute=source=>{fs.writeFileSync(absolute,source);const env={...process.env,NODE_OPTIONS:''};delete env.NODE_TEST_CONTEXT;
  const r=spawnSync(process.execPath,['--test','--test-reporter=tap',absolute],{cwd:f.root,env,encoding:'utf8',windowsHide:true,timeout:10000});assert.equal(r.error,undefined);return r;};
 let r=execute("const test=require('node:test');\ntest('actual named cell',()=>require('node:assert/strict').equal(2+2,4));");
 assert.equal(suiteInventory(f.root,[file],r.stdout,tapSummary(r.stdout,r.status))[0].executed,1);
 r=execute('process.exit(0);');
 assert.throws(()=>suiteInventory(f.root,[file],r.stdout,{tests:1}),{code:'S3_FILE_ZERO_CELLS'});
 r=execute("require('node:test')('skipped cell',{skip:true},()=>{});");
 assert.throws(()=>tapSummary(r.stdout,r.status),{code:'S3_TEST_ACCOUNTING'});
});
