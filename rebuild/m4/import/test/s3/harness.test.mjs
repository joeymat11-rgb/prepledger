import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import Mutations from './mutations.cjs';
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
 assert.equal(mutantSummary("not ok 1 - named guard\n  ---\n  code: 'ERR_ASSERTION'\n  ...",1,'named guard').assertion,true);
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

test('S3-HARNESS-ESM-STATIC: side effects and computed imports refuse before copying',()=>{
 const f=fixture();
 for(const source of [['import ',"'./missing.mjs';"].join(''), "const target='./missing.mjs'; await import(target);"]){
  fs.writeFileSync(path.join(f.root,f.file),source);
  assert.throws(()=>inspectStaticEdges(f.root,f.manifest),{code:'S3_UNLISTED_EDGE'});
 }
 fs.writeFileSync(path.join(f.root,f.file),["import 'node:fs'; // import './missing.mjs'\nconst s=\"import(","'./missing.mjs')\";"].join(''));
 assert.deepEqual(inspectStaticEdges(f.root,f.manifest),[]);
});
test('S3-HARNESS-ESM-RUNTIME: actual CJS and ESM children cannot execute an unlisted sentinel',()=>{
 const directory=fs.mkdtempSync(path.join(base,'harmless-sentinel-')),sentinel=path.join(directory,'sentinel.cjs'),esm=path.join(directory,'sentinel.mjs');
 for(const file of [sentinel,esm])fs.writeFileSync(file,"console.log('S3_UNLISTED_SENTINEL_EXECUTED');\n");
 const env={...process.env};delete env.NODE_OPTIONS;delete env.NODE_PATH;delete env.NODE_TEST_CONTEXT;
 const preload=fileURLToPath(new URL('./current-head.cjs',import.meta.url));
 for(const tail of [['--eval','require('+JSON.stringify(sentinel)+')'],['--input-type=module','--eval','await import('+JSON.stringify(pathToFileURL(esm).href)+')']]){
  const result=spawnSync(process.execPath,['--require',preload,...tail],{cwd:process.env.S3_SCRATCH,env,encoding:'utf8',windowsHide:true,timeout:10000});
  assert.equal(result.error,undefined);assert.equal(result.status,1,'Unlisted module child refuses');
  assert.match(result.stderr,/S3_UNLISTED_MODULE/);assert.doesNotMatch(result.stdout,/S3_UNLISTED_SENTINEL_EXECUTED/);
 }
});
test('S3-HARNESS-LEXICAL: postfix division cannot hide a following template module load',()=>{
 const f=fixture();
 for(const operator of ['++','--']){
  const source='let n=1; n'+operator+' / 2; '+['import(', '`./missing.mjs`',');'].join('');
  fs.writeFileSync(path.join(f.root,f.file),source);
  assert.throws(()=>inspectStaticEdges(f.root,f.manifest),{code:'S3_UNLISTED_EDGE'});
 }
});
test('S3-HARNESS-MUTANT-OWN-DIAGNOSTIC: selected TypeError cannot borrow an unrelated assertion',()=>{
 const f=fixture(),file=path.join(f.root,'rebuild','diagnostic.cjs');
 const env={...process.env};delete env.NODE_TEST_CONTEXT;delete env.NODE_OPTIONS;delete env.NODE_PATH;
 const execute=selected=>{
  fs.writeFileSync(file,"const test=require('node:test'),assert=require('node:assert/strict');\ntest('selected boundary',()=>{"+selected+"});\ntest('unrelated boundary',()=>assert.equal(3,4));\n");
  const r=spawnSync(process.execPath,['--test','--test-reporter=tap',file],{cwd:f.root,env,encoding:'utf8',windowsHide:true,timeout:10000});
  assert.equal(r.error,undefined);return r;
 };
 const wrong=execute("throw new TypeError('selected setup failure')");
 assert.throws(()=>mutantSummary(wrong.stdout,wrong.status,'selected boundary'),{code:'S3_MUTANT_NOT_ASSERTION'});
 const right=execute('assert.equal(1,2)');assert.equal(mutantSummary(right.stdout,right.status,'selected boundary').assertion,true);
});
test('S3-HARNESS-MUTATION-PROGRAM: actual mutation program requires its selected assertion diagnostic',()=>{
 assert.equal(typeof Mutations.assertionDiagnostic,'function','Mutation runner exposes its actual named classifier');
 const log="not ok 1 - selected boundary\n  ---\n  error: 'setup'\n  name: 'TypeError'\n  ...\nnot ok 2 - unrelated boundary\n  ---\n  code: 'ERR_ASSERTION'\n  ...\n";
 assert.equal(Mutations.assertionDiagnostic(log,1,'selected boundary'),null);
 assert.equal(Mutations.assertionDiagnostic(log,1,'unrelated boundary').name,'unrelated boundary');
});

function isolatedChild(args,cwd){
 const env={...process.env};
 for(const key of Object.keys(env))if(['NODE_OPTIONS','NODE_PATH','NODE_TEST_CONTEXT','NODE_V8_COVERAGE','S3_MUTATION'].includes(key.toUpperCase()))delete env[key];
 const result=spawnSync(process.execPath,args,{cwd,env,encoding:'utf8',windowsHide:true,timeout:15000});
 assert.equal(result.error,undefined);assert.equal(result.signal,null);return result;
}
test('S3-HARNESS-EXACT-IDENTITY: a passing selected test cannot borrow a suffix-named assertion',()=>{
 const f=fixture(),file=path.join(f.root,'rebuild','identity.cjs'),selected='selected boundary';
 const execute=(fails,other)=>{
  fs.writeFileSync(file,"const test=require('node:test'),assert=require('node:assert/strict');\n"+
   'test('+JSON.stringify(selected)+',()=>assert.equal(1,'+(fails?2:1)+'));\n'+
   'test('+JSON.stringify(other)+',()=>assert.equal(3,4));\n');
  const actual=isolatedChild(['--test','--test-reporter=tap',file],f.root);
  assert.equal(actual.status,1);assert.match(actual.stdout,/^# tests 2$/m);assert.match(actual.stdout,/^# skipped 0$/m);assert.match(actual.stdout,/^# cancelled 0$/m);
  fs.writeFileSync(path.join(f.root,'rebuild','identity-'+(fails?'fail':'pass')+'.tap'),actual.stdout);
  return actual;
 };
 const right=execute(true,'unrelated boundary');
 assert.equal(mutantSummary(right.stdout,right.status,selected).name,selected);
 const wrong=execute(false,'unrelated selected boundary suffix');
 assert.throws(()=>mutantSummary(wrong.stdout,wrong.status,selected),{code:'S3_MUTANT_NOT_ASSERTION'});
 const duplicate=execute(false,selected);
 assert.throws(()=>mutantSummary(duplicate.stdout,duplicate.status,selected),{code:'S3_MUTANT_NOT_ASSERTION'});
 assert.throws(()=>mutantSummary(right.stdout,right.status,'selected'),{code:'S3_MUTANT_NOT_ASSERTION'});
});
function lexicalControl(source,refuse){
 const f=fixture(),file=path.join(f.root,f.file);fs.writeFileSync(file,source);
 const syntax=isolatedChild(['--check',file],f.root);assert.equal(syntax.status,0,'Actual Node syntax: '+syntax.stderr);
 if(refuse)assert.throws(()=>inspectStaticEdges(f.root,f.manifest),{code:'S3_UNLISTED_EDGE'});
 else assert.deepEqual(inspectStaticEdges(f.root,f.manifest),[]);
}
test('S3-HARNESS-PROPERTY-DIVISION: property keywords cannot hide escaped-slash imports',()=>{
 lexicalControl("const obj={x:1}; obj.x / import('.\\x2fsentinel.mjs') / 2;",true);
 lexicalControl("const obj={of:1}; obj.of / import('.\\x2fsentinel.mjs') / 2;",true);
 for(const key of ['in','return','throw','case','yield','typeof','void','delete'])
  lexicalControl('const obj={'+key+":1}; obj."+key+" / import('.\\x2fsentinel.mjs') / 2;",true);
 lexicalControl("const of=1; of / import('.\\x2fsentinel.mjs') / 2;",true);
});
test('S3-HARNESS-CONTROL-REGEX: a statement regex after a control condition is data',()=>{
 lexicalControl("const value=/import(x)/; value.test('ok');",false);
 for(const source of ["if (true) /import(x)/.test('ok');", "if ((true)) /import(x)/.test('ok');", "while (false) /import(x)/.test('ok');", "for (;false;) /import(x)/.test('ok');"])
  lexicalControl(source,false);
 lexicalControl("const f=()=>1; f() / import('.\\x2fsentinel.mjs') / 2;",true);
 lexicalControl("const obj={if:()=>1}; obj.if(true) / import('.\\x2fsentinel.mjs') / 2;",true);
});
