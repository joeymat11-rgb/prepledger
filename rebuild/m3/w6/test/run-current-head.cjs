'use strict';
// Compose exact public R1 dependency with this W6 candidate in a disposable tree.
// No branch merge, dependency install, original suite edit or private input.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),r1=path.resolve(process.argv[2]||'');
const base='d26795a47d638ec1e67840455273cc05eeca9926';
if(!process.argv[2])throw Error('Usage: node test/run-current-head.cjs <retained-R1-repo> [--all] [--browser] [--bite]');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-w6-current-head-'));
function git(args,cwd=root){const p=cp.spawnSync('git',args,{cwd,windowsHide:true,maxBuffer:64e6});if(p.status!==0)throw Error('Public source preparation failed: '+args[0]);return p.stdout;}
const archive=path.join(output,'public-dependency.tar');
fs.writeFileSync(archive,git(['archive',base,'rebuild/authority','rebuild/client','rebuild/m3/w5','rebuild/m3/rigs','rebuild/conform/lib','rebuild/conform/adapters/client.cjs','rebuild/conform/laws/sheet-B-client.cjs'],r1));
const unpack=cp.spawnSync('tar',['-xf',archive,'-C',output],{windowsHide:true});if(unpack.status!==0)throw Error('Public dependency extraction failed');
// W6 already owns three reviewed T2 browser-boundary additions. Replacing its
// client with R1's older T2 would silently remove those hooks, not compose them.
const names=new Set(git(['ls-files','rebuild/m3/w6','rebuild/client']).toString().trim().split(/\r?\n/));
for(const name of ['history-proof.mjs','CURRENT-HEAD-CONSUMER.md','test/current-head.test.mjs','test/run-current-head.cjs'])names.add('rebuild/m3/w6/'+name);
const pins={};
for(const name of names){
  if(!(name.startsWith('rebuild/m3/w6/')||name.startsWith('rebuild/client/'))||name.includes('..'))throw Error('Unexpected candidate path');
  const raw=fs.readFileSync(path.join(root,name)),dest=path.join(output,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,raw);
  pins[name]=crypto.createHash('sha256').update(raw).digest('hex');
}
// Disposable runner only: use the already installed locked dependency trees.
// The retained worktrees themselves still have real node_modules directories.
for(const [dir,source]of [['w6',root],['w5',r1]]){
  const modules=path.join(source,'rebuild/m3',dir,'node_modules');
  if(!fs.statSync(modules).isDirectory())throw Error('Existing dependencies required');
  fs.symlinkSync(modules,path.join(output,'rebuild/m3',dir,'node_modules'),process.platform==='win32'?'junction':'dir');
}
fs.writeFileSync(path.join(output,'source-manifest.json'),JSON.stringify({r1:base,w6SourceRoot:root,pins},null,2));
let mutation=null;
if(process.argv.includes('--bite')){
  const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
  const target='context.snapshotRevision !== original.clientRevision ||';
  if(raw.split(target).length!==2)throw Error('Exact revision assertion bite target missing');
  fs.writeFileSync(file,raw.replace(target,''));
  mutation={name:'omit-original-client-revision',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],
    mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
const testDir=path.join(output,'rebuild/m3/w6/test');
const namesToRun=process.argv.includes('--all')?fs.readdirSync(testDir).filter(n=>n.endsWith('.test.mjs')).sort():['current-head.test.mjs'];
const args=['--test','--test-timeout=30000',...namesToRun.map(n=>path.join(testDir,n))];
// The unchanged baseline test reads an accepted historical client via ls-tree/show.
// Supply the retained object database for those read-only commands; do not copy or
// create an index, merge a branch, or substitute today's client for that baseline.
const gitDir=git(['rev-parse','--absolute-git-dir']).toString().trim();
const started=performance.now(),run=cp.spawnSync(process.execPath,args,{cwd:output,env:{...process.env,GIT_DIR:gitDir,GIT_WORK_TREE:output},windowsHide:true,encoding:'utf8',maxBuffer:32e6});
fs.writeFileSync(path.join(output,'test.stdout.log'),run.stdout||'');fs.writeFileSync(path.join(output,'test.stderr.log'),run.stderr||'');
let browser=null;
if(process.argv.includes('--browser')){
  browser=cp.spawnSync(process.execPath,[path.join(testDir,'browser-contract.mjs')],{cwd:output,env:process.env,windowsHide:true,encoding:'utf8',maxBuffer:32e6});
  fs.writeFileSync(path.join(output,'browser.stdout.log'),browser.stdout||'');fs.writeFileSync(path.join(output,'browser.stderr.log'),browser.stderr||'');
}
for(const [name,hash]of Object.entries(pins))if(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')!==hash)throw Error('Candidate changed during run');
fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({node:process.version,exit:run.status,browserExit:browser?.status??null,elapsedMs:performance.now()-started,tests:namesToRun,mutation},null,2));
console.log('COMPOSED W6 OUTPUT '+output);process.stdout.write(run.stdout||'');process.stderr.write(run.stderr||'');
if(browser){process.stdout.write(browser.stdout||'');process.stderr.write(browser.stderr||'');}
process.exitCode=run.status===0&&(!browser||browser.status===0)?0:1;
