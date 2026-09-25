import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const owner=process.cwd();
const builder=path.join(owner,'rebuild/conform/engines/build-engines.mjs'),bytes=fs.readFileSync(builder);
const sha=b=>createHash('sha256').update(b).digest('hex');
const entry='import "./_fixed-now.mjs";\nimport { __test } from "../src/app.jsx";\nexport { __test };\n';
const cleanEnv={...process.env};for(const key of Object.keys(cleanEnv))if(['NODE_OPTIONS','NODE_PATH','ESBUILD_BINARY_PATH'].includes(key.toUpperCase()))delete cleanEnv[key];
const git=(root,args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',env:cleanEnv,stdio:['ignore','pipe','pipe']}).trim();
function write(root,file,value){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,value);}
function copyPackage(source,destination){fs.mkdirSync(destination,{recursive:true});for(const item of fs.readdirSync(source,{withFileTypes:true})){
 const from=path.join(source,item.name),to=path.join(destination,item.name);if(item.isDirectory())copyPackage(from,to);else{assert(item.isFile());fs.copyFileSync(from,to,fs.constants.COPYFILE_EXCL);}
}}
function fixture(label='space # % café'){
 fs.mkdirSync(path.join(owner,'.tmp'),{recursive:true});const root=fs.mkdtempSync(path.join(owner,'.tmp','fb-'+label+'-'));
 git(root,['init','-q']);git(root,['config','user.name','Invented build fixture']);git(root,['config','user.email','synthetic@example.invalid']);git(root,['config','core.autocrlf','false']);git(root,['config','core.longpaths','true']);git(root,['config','core.quotepath','false']);git(root,['config','core.hooksPath',path.join(root,'.no-hooks')]);
 write(root,'.gitignore','node_modules/\n.tmp/\nrebuild/\nFIXTURE.json\n');
 write(root,'tools/_fixed-now.mjs','globalThis.__syntheticFixedNow="INVENTED-CLOCK";\n');
 const app=label=>`import path from 'node:path';import rootOnly from 'synthetic-root-only';export const __test={label:${JSON.stringify(label)},clock:globalThis.__syntheticFixedNow,rootOnly,node:path.basename('/a/b')};\n`;
 write(root,'src/app.jsx',app('old'));git(root,['add','--','.gitignore','tools/_fixed-now.mjs','src/app.jsx']);git(root,['commit','-qm','Invented old source']);const old=git(root,['rev-parse','HEAD']);
 write(root,'src/app.jsx',app('main'));git(root,['add','--','src/app.jsx']);git(root,['commit','-qm','Invented main source']);const main=git(root,['rev-parse','HEAD']);
 write(root,'rebuild/conform/engines/build-engines.mjs',bytes);
 for(const name of ['esbuild',process.platform==='win32'?'@esbuild/win32-x64':'@esbuild/linux-x64'])copyPackage(path.join(owner,'node_modules',name),path.join(root,'node_modules',name));
 write(root,'node_modules/synthetic-root-only/index.js','module.exports="INVENTED-ROOT-NODE-PATH";\n');
 const f={root,main,old,script:path.join(root,'rebuild/conform/engines/build-engines.mjs'),out:path.join(root,'rebuild/conform/engines')};
 fs.writeFileSync(path.join(root,'FIXTURE.json'),JSON.stringify({main,old,builderSha256:sha(bytes),onlyInventedHistory:true},null,2)+'\n');return f;
}
function run(f,args=[f.root,'main='+f.main,'old='+f.old]){return new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,[f.script,...args],{cwd:f.root,env:cleanEnv,windowsHide:true});let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);child.on('error',reject);child.on('close',code=>resolve({code,stdout,stderr}));
});}
function invocations(f){const dir=path.join(f.root,'.tmp');return fs.existsSync(dir)?fs.readdirSync(dir).filter(n=>n.startsWith('earned-engine-build-')).map(n=>path.join(dir,n)):[];}
function worktrees(f){return git(f.root,['worktree','list','--porcelain']).split('\n').filter(x=>x.startsWith('worktree ')).map(x=>x.slice(9));}
function output(f,name){const file=path.join(f.out,'engine-'+name+'.cjs');return fs.readFileSync(file);}
function inspect(file){return JSON.parse(execFileSync(process.execPath,['-e','const m=require(process.argv[1]);console.log(JSON.stringify({keys:Object.keys(m),value:m.__test}));',file],{encoding:'utf8',env:cleanEnv}));}
function assertSuccess(f,r){assert.equal(r.code,0,r.stderr);assert.match(r.stdout,/export ENGINE_MAIN=/);for(const name of ['main','old']){
 assert.match(r.stdout,new RegExp('built '+name+' @ '+f[name]+' '));const result=inspect(path.join(f.out,'engine-'+name+'.cjs'));
 assert.deepEqual(result,{keys:['__test'],value:{label:name,clock:'INVENTED-CLOCK',rootOnly:'INVENTED-ROOT-NODE-PATH',node:'b'}});
}}
function assertFailure(r){assert.notEqual(r.code,0);assert.doesNotMatch(r.stdout,/built (?:main|old) @|export ENGINE_MAIN=/);}

// D2's own cases use the public fixture helpers without importing/rerunning the author tests.
const evidence=[];test.after(()=>fs.writeFileSync(path.join(owner,'.tmp','d2-frozen-controls-observations.json'),JSON.stringify(evidence,null,2)));

test('D2 F1 actual CLI usage and last recognized override preserve the original contract',async()=>{
 const f=fixture('D2-cli');const usage=await run(f,[]);assert.equal(usage.code,2);assert.match(usage.stdout,/usage:/);assert.equal(invocations(f).length,0);
 const r=await run(f,[f.root,'main='+f.old,'ignored=value','main='+f.main.slice(0,12),'old='+f.old.slice(0,12)]);assertSuccess(f,r);
 evidence.push({id:'F1',root:f.root,main:f.main,old:f.old,usageExit:usage.code,buildExit:r.code,stdout:r.stdout,stderr:r.stderr});
});

test('D2 F2 a hard-linked builder cannot claim exclusive commissioned module ownership',async()=>{
 const f=fixture('D2-module-link'),alias=path.join(owner,'.tmp','D2-builder-alias-'+path.basename(f.root)+'.mjs');fs.linkSync(f.script,alias);
 assert.equal(fs.lstatSync(f.script).nlink,2);const original=sha(fs.readFileSync(f.script)),r=await run(f);
 evidence.push({id:'F2',root:f.root,alias,links:fs.lstatSync(f.script).nlink,originalBuilderSHA256:original,exit:r.code,stdout:r.stdout,stderr:r.stderr,invocations:invocations(f),worktrees:worktrees(f),builderBytesUnchanged:sha(fs.readFileSync(alias))===original});
 assert.notEqual(r.code,0,'PM334 module ownership must refuse a hard-linked builder before scratch/output writes');assertFailure(r);assert.equal(invocations(f).length,0);
 assert.equal(sha(fs.readFileSync(alias)),original);
});

test('D2 F3 a hard-linked esbuild loader is refused before service or worktree creation',async()=>{
 const f=fixture('D2-loader-link'),loader=path.join(f.root,'node_modules/esbuild/lib/main.js'),alias=path.join(owner,'.tmp','D2-loader-alias-'+path.basename(f.root)+'.js');fs.linkSync(loader,alias);
 const before=sha(fs.readFileSync(alias)),r=await run(f);evidence.push({id:'F3',root:f.root,exit:r.code,stdout:r.stdout,stderr:r.stderr,invocations:invocations(f)});
 assert.notEqual(r.code,0,'linked loader must refuse before actual service/worktree creation');assertFailure(r);assert.match(r.stderr,/linked path refused/);assert.equal(invocations(f).length,0);assert.equal(worktrees(f).length,1);assert.equal(sha(fs.readFileSync(alias)),before);
});

test('D2 F4 actual second publication failure cannot claim success and retains invocation results',async()=>{
 const f=fixture('D2-publish-fail');write(f.root,'rebuild/conform/engines/engine-main.cjs','PREVIOUS MAIN');
 write(f.root,'rebuild/conform/engines/engine-old.cjs/sentinel','PRESERVE OUTPUT DIRECTORY');
 const r=await run(f),dirs=invocations(f);evidence.push({id:'F4',root:f.root,exit:r.code,stdout:r.stdout,stderr:r.stderr,invocations:dirs,mainAfterHash:sha(output(f,'main')),oldDirectoryRetained:fs.existsSync(path.join(f.out,'engine-old.cjs/sentinel'))});
 assert.notEqual(r.code,0);assert.doesNotMatch(r.stdout,/built (?:main|old) @|export ENGINE_MAIN=/,'a real publication failure must never print successful build/export claims');
 assert.equal(dirs.length,1);for(const name of ['main','old'])assert.equal(inspect(path.join(dirs[0],'outputs','engine-'+name+'.cjs')).value.label,name);
 assert.equal(fs.readFileSync(path.join(f.out,'engine-old.cjs/sentinel'),'utf8'),'PRESERVE OUTPUT DIRECTORY');
 // A pair-wide transaction is not promised: first slot can already be updated on failure.
 assert.equal(inspect(path.join(f.out,'engine-main.cjs')).value.label,'main');assert.equal(worktrees(f).length,3);
});

test('D2 F5 overlapping different refs retain individually identified bundles while standard slots may change',async()=>{
 const f=fixture('D2-different-overlap');const results=await Promise.all([run(f),run(f,[f.root,'main='+f.old,'old='+f.main])]);
 const dirs=invocations(f);assert.equal(dirs.length,2);assert.equal(new Set(worktrees(f)).size,5);const produced=[];
 for(const dir of dirs)for(const name of ['main','old']){const wt=fs.readdirSync(dir).find(n=>n.startsWith(name+'-'));const head=git(path.join(dir,wt),['rev-parse','HEAD']),file=path.join(dir,'outputs','engine-'+name+'.cjs'),value=inspect(file).value;
  assert.equal(value.label,head===f.main?'main':'old');assert.equal(value.clock,'INVENTED-CLOCK');produced.push({invocation:dir,name,head,sha256:sha(fs.readFileSync(file))});}
 for(const r of results){assert.equal(r.code,0,r.stderr);assert.match(r.stdout,/export ENGINE_MAIN=/);const lines=[...r.stdout.matchAll(/built (main|old) @ ([a-f0-9]{40}) .*sha256=([a-f0-9]{64})/g)];assert.equal(lines.length,2);
  const matched=lines.map(([,name,head,hash])=>produced.find(p=>p.name===name&&p.head===head&&p.sha256===hash));assert(matched.every(Boolean));assert.equal(matched[0].invocation,matched[1].invocation);}
 const standard=['main','old'].map(name=>({name,sha256:sha(output(f,name)),value:inspect(path.join(f.out,'engine-'+name+'.cjs')).value}));
 for(const slot of standard)assert(produced.some(p=>p.name===slot.name&&p.sha256===slot.sha256));
 evidence.push({id:'F5',root:f.root,invocations:dirs,produced,standard,results,contract:'No persistent standard-slot lease or pair-wide transaction asserted; logs identify retained invocation bytes.'});
});
