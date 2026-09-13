import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const owner=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
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
test('real build: Windows-safe spaces hash percent and Unicode paths retain exports clock ordering and options',async()=>{
 const f=fixture(),r=await run(f,[f.root,'main='+f.main.slice(0,12),'old='+f.old.slice(0,12)]);assertSuccess(f,r);
 assert.equal(sha(fs.readFileSync(f.script)),sha(bytes));assert.equal(invocations(f).length,1);assert.equal(worktrees(f).length,3);
 for(const name of ['main','old']){const wt=path.join(invocations(f)[0],name+'-'+f[name]);assert.equal(git(wt,['rev-parse','HEAD']),f[name]);
  assert.equal(fs.readFileSync(path.join(wt,'tools/_engine-entry.mjs'),'utf8'),entry);
  assert.equal(fs.readFileSync(path.join(wt,'src/app.jsx'),'utf8'),git(f.root,['show',f[name]+':src/app.jsx'])+'\n');
  assert.deepEqual(fs.readFileSync(path.join(invocations(f)[0],'outputs','engine-'+name+'.cjs')),output(f,name));
 }
 // Options that would require adding React to execute are checked as preserved
 // contract text; Node/CJS, imports, clock and nodePaths above execute for real.
 assert.match(bytes.toString(),/const commits = \{ main: "fe516c1", old: "a0009c3" \}/);
 assert(bytes.toString().includes('entryPoints: [entry], bundle: true, platform: "node", format: "cjs", jsx: "automatic", loader: { ".jsx": "jsx" }, outfile, absWorkingDir: wt, nodePaths: [path.join(root, "node_modules")], logLevel: "error"'));
});
test('real build: repeated runs preserve mismatched preexisting worktree and sentinel',async()=>{
 const f=fixture('repeat'),sentinel=path.join(f.root,'.tmp','earned-engine-wt','main');fs.mkdirSync(path.dirname(sentinel),{recursive:true});git(f.root,['worktree','add','--detach',sentinel,f.old]);write(sentinel,'sentinel.txt','KEEP THIS INVENTED WORKTREE');
 const before=git(sentinel,['rev-parse','HEAD']);assertSuccess(f,await run(f));const first=invocations(f)[0],firstFiles=fs.readdirSync(first),firstMain=fs.readFileSync(path.join(first,'outputs','engine-main.cjs'));
 assertSuccess(f,await run(f));assert.equal(invocations(f).length,2);assert.equal(worktrees(f).length,6);
 assert.equal(git(sentinel,['rev-parse','HEAD']),before);assert.equal(fs.readFileSync(path.join(sentinel,'sentinel.txt'),'utf8'),'KEEP THIS INVENTED WORKTREE');assert.deepEqual(fs.readdirSync(first),firstFiles);assert.deepEqual(fs.readFileSync(path.join(first,'outputs','engine-main.cjs')),firstMain);
});
test('real build: concurrent runs own distinct worktrees entries and retained bundles',async()=>{
 const f=fixture('concurrent'),results=await Promise.all([run(f),run(f)]);for(const r of results)assertSuccess(f,r);
 const dirs=invocations(f);assert.equal(dirs.length,2);assert.equal(new Set(worktrees(f)).size,5);
 for(const dir of dirs)for(const name of ['main','old']){const wt=path.join(dir,name+'-'+f[name]);assert.equal(git(wt,['rev-parse','HEAD']),f[name]);assert.equal(fs.readFileSync(path.join(wt,'tools/_engine-entry.mjs'),'utf8'),entry);assert.equal(inspect(path.join(dir,'outputs','engine-'+name+'.cjs')).value.label,name);}
 const hashes=new Set(dirs.flatMap(dir=>['main','old'].map(name=>sha(fs.readFileSync(path.join(dir,'outputs','engine-'+name+'.cjs'))))));
 for(const r of results)for(const match of r.stdout.matchAll(/sha256=([a-f0-9]{64})/g))assert(hashes.has(match[1]));
});
test('real build: missing explicit ref cannot claim previous outputs as new success',async()=>{
 const f=fixture('missing-ref');write(f.root,'rebuild/conform/engines/engine-main.cjs','PREVIOUS MAIN');write(f.root,'rebuild/conform/engines/engine-old.cjs','PREVIOUS OLD');
 const r=await run(f,[f.root,'main='+f.main,'old='+'0'.repeat(40)]);assertFailure(r);assert.equal(output(f,'main').toString(),'PREVIOUS MAIN');assert.equal(output(f,'old').toString(),'PREVIOUS OLD');assert.equal(invocations(f).length,0);assert.equal(worktrees(f).length,1);
});
test('real build: failure in second build retains old outputs and the first new bundle as evidence',async()=>{
 const f=fixture('build-fail');write(f.root,'src/app.jsx','export const __test = ;\n');git(f.root,['add','--','src/app.jsx']);git(f.root,['commit','-qm','Invented syntax failure']);const bad=git(f.root,['rev-parse','HEAD']);
 write(f.root,'rebuild/conform/engines/engine-main.cjs','PREVIOUS MAIN');write(f.root,'rebuild/conform/engines/engine-old.cjs','PREVIOUS OLD');
 const r=await run(f,[f.root,'main='+f.main,'old='+bad]);assertFailure(r);assert.match(r.stderr,/Build failed|Unexpected/);assert.equal(output(f,'main').toString(),'PREVIOUS MAIN');assert.equal(output(f,'old').toString(),'PREVIOUS OLD');
 assert.equal(invocations(f).length,1);assert.equal(worktrees(f).length,3);assert.equal(inspect(path.join(invocations(f)[0],'outputs','engine-main.cjs')).value.label,'main');
});
test('real build: refuses a root belonging to a different builder before any scratch write',async()=>{
 const f=fixture('caller'),other=fixture('other-root');const r=await run(f,[other.root,'main='+other.main,'old='+other.old]);assertFailure(r);assert.match(r.stderr,/supplied root must own/);assert.equal(invocations(f).length,0);assert.equal(invocations(other).length,0);
});
for(const link of ['scratch-junction','root-junction','output-hardlink'])test(`real build: refuses ${link} without changing linked evidence`,async()=>{
 const f=fixture(link),outside=fs.mkdtempSync(path.join(owner,'.tmp','fb-link-target-'));write(outside,'sentinel','PRESERVE');let args=[f.root,'main='+f.main,'old='+f.old];
 if(link==='scratch-junction')fs.symlinkSync(outside,path.join(f.root,'.tmp'),process.platform==='win32'?'junction':'dir');
 if(link==='root-junction'){const alias=path.join(outside,'alias');fs.symlinkSync(f.root,alias,process.platform==='win32'?'junction':'dir');args[0]=alias;}
 if(link==='output-hardlink')fs.linkSync(path.join(outside,'sentinel'),path.join(f.out,'engine-main.cjs'));
 const r=await run(f,args);assertFailure(r);assert.match(r.stderr,/Linked path refused|linked path refused/);assert.equal(fs.readFileSync(path.join(outside,'sentinel'),'utf8'),'PRESERVE');assert.equal(worktrees(f).length,1);
});
test('real build: a scratch file is never removed or reused as a directory',async()=>{
 const f=fixture('scratch-file');write(f.root,'.tmp','PRESERVE SCRATCH FILE');const r=await run(f);assertFailure(r);assert.match(r.stderr,/Scratch parent is not a directory/);assert.equal(fs.readFileSync(path.join(f.root,'.tmp'),'utf8'),'PRESERVE SCRATCH FILE');assert.equal(worktrees(f).length,1);
});
test('real build: a committed entry sentinel is never overwritten or cleaned away',async()=>{
 const f=fixture('entry-collision');write(f.root,'tools/_engine-entry.mjs','PRESERVE AUTHORED ENTRY');git(f.root,['add','--','tools/_engine-entry.mjs']);git(f.root,['commit','-qm','Invented entry collision']);const collision=git(f.root,['rev-parse','HEAD']);
 const r=await run(f,[f.root,'main='+collision,'old='+f.old]);assertFailure(r);assert.match(r.stderr,/EEXIST/);const wt=path.join(invocations(f)[0],'main-'+collision);assert.equal(fs.readFileSync(path.join(wt,'tools/_engine-entry.mjs'),'utf8'),'PRESERVE AUTHORED ENTRY');assert.equal(git(wt,['rev-parse','HEAD']),collision);
});
