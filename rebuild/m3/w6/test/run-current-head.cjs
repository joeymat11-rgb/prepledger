'use strict';
// Compose exact public R1 dependency with this W6 candidate in a disposable tree.
// No branch merge, dependency install, original suite edit or private input.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),r1=path.resolve(process.argv[2]||'');
const base='bec056d6b8f86069c500d958e86f212bd6e5f392';
if(!process.argv[2])throw Error('Usage: node test/run-current-head.cjs <retained-R1-repo> [--all] [--browser] [--bite]');
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-w6-current-head-'));
function git(args,cwd=root){const p=cp.spawnSync('git',args,{cwd,windowsHide:true,maxBuffer:64e6});if(p.status!==0)throw Error('Public source preparation failed: '+args[0]);return p.stdout;}
const archive=path.join(output,'public-dependency.tar');
fs.writeFileSync(archive,git(['archive',base,'rebuild/authority','rebuild/m4/workout','rebuild/client','rebuild/m3/w5','rebuild/m3/rigs','rebuild/conform/lib','rebuild/conform/adapters/client.cjs','rebuild/conform/laws/sheet-B-client.cjs'],r1));
const unpack=cp.spawnSync('tar',['-xf',archive,'-C',output],{windowsHide:true});if(unpack.status!==0)throw Error('Public dependency extraction failed');
// W6 already owns three reviewed T2 browser-boundary additions. Replacing its
// client with R1's older T2 would silently remove those hooks, not compose them.
const names=new Set(git(['ls-files','rebuild/m3/w6','rebuild/client','rebuild/m4/workout']).toString().trim().split(/\r?\n/));
for(const name of ['history-proof.mjs','CURRENT-HEAD-CONSUMER.md','test/current-head.test.mjs','test/run-current-head.cjs','test/workout-commands.test.mjs','test/workout-http.test.mjs','test/browser-workout.mjs','test/browser-panel.mjs','test/panel-extension.mjs','test/workout-bite.cjs'])names.add('rebuild/m3/w6/'+name);
for(const name of ['schema.cjs','authority-profile.cjs','commands.cjs','command-panel.mjs','stored-history.mjs','project-history.mjs'])names.add('rebuild/m4/workout/'+name);
const pins={};
for(const name of names){
  if(!(name.startsWith('rebuild/m3/w6/')||name.startsWith('rebuild/client/')||name.startsWith('rebuild/m4/workout/'))||name.includes('..'))throw Error('Unexpected candidate path');
  const raw=fs.readFileSync(path.join(root,name)),dest=path.join(output,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,raw);
  pins[name]=crypto.createHash('sha256').update(raw).digest('hex');
}
// Accepted profile remains byte-identical. The selected capture shape has exactly
// two disclosed literal edits; all other bytes still match the accepted source.
for(const name of ['schema.cjs','authority-profile.cjs']){
 const source='rebuild/m4/workout/'+name;
 const candidate=fs.readFileSync(path.join(root,source)),baseline=git(['show',base+':'+source],r1);
 if(!candidate.equals(baseline)&&!(name==='schema.cjs'&&require('./prepared-shape-delta.cjs')(baseline,candidate)))throw Error('Accepted shared source differs: '+source);
}
// Disposable runner only: use the already installed locked dependency trees.
// The retained worktrees themselves still have real node_modules directories.
for(const [dir,source]of [['w6',root],['w5',r1]]){
  const modules=path.join(source,'rebuild/m3',dir,'node_modules');
  if(!fs.statSync(modules).isDirectory())throw Error('Existing dependencies required');
  fs.symlinkSync(modules,path.join(output,'rebuild/m3',dir,'node_modules'),process.platform==='win32'?'junction':'dir');
}
fs.writeFileSync(path.join(output,'source-manifest.json'),JSON.stringify({r1:base,w6SourceRoot:root,pins},null,2));
let mutation=null,preparedRestore=null;
if(process.argv.includes('--resume-bite')){
 if(process.argv.slice(2).filter(s=>s.endsWith('-bite')||s==='--bite').length!==1)throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='context.snapshotRevision!==entry.revision||context.snapshotToken!==entry.token||';
 if(raw.split(target).length!==2)throw Error('Exact resume snapshot bite target missing');
 fs.writeFileSync(file,raw.replace(target,''));preparedRestore={file,raw};
 mutation={name:'omit-resume-snapshot-binding',originalSha256:pins['rebuild/m3/w6/public-client.mjs']};
}
if(process.argv.includes('--head-history-bite')){
 if(['--bite','--prepared-bite','--host-bite','--history-bite','--receipt-bite','--stored-history-bite','--projection-bite','--local-history-bite'].some(flag=>process.argv.includes(flag)))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='if (signedOperationIds) for (const receipt of record.receipts) {\n            const retained = generation.collections.ops?.[receipt.op_id];\n            if (!retained || !sameRecordedValue(retained, receipt.op)) return false;';
 if(raw.split(target).length!==2)throw Error('Exact currentHead history bite target missing');
 fs.writeFileSync(file,raw.replace(target,'if (signedOperationIds) for (const receipt of record.receipts) {'));preparedRestore={file,raw};
 mutation={name:'exempt-current-head-without-matching-retained-record',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--local-history-bite')){
 if(['--bite','--prepared-bite','--host-bite','--history-bite','--receipt-bite','--stored-history-bite','--projection-bite'].some(flag=>process.argv.includes(flag)))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/t2-stage.cjs'),raw=fs.readFileSync(file,'utf8');
 const target='if (integration?.historyAuthentication) {';
 if(raw.split(target).length!==2)throw Error('Exact local identity bite target missing');
 fs.writeFileSync(file,raw.replace(target,'if (false) {'));preparedRestore={file,raw};
 mutation={name:'ignore-local-history-identity',originalSha256:pins['rebuild/m3/w6/t2-stage.cjs'],mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--projection-bite')){
 if(['--bite','--prepared-bite','--host-bite','--history-bite','--receipt-bite','--stored-history-bite'].some(flag=>process.argv.includes(flag)))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m4/workout/project-history.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='Object.assign(current,structuredClone(edit.payload.replacement_fields));';
 if(raw.split(target).length!==2)throw Error('Exact correction projection bite target missing');
 fs.writeFileSync(file,raw.replace(target,'void current;'));preparedRestore={file,raw};
 mutation={name:'ignore-actual-stored-correction',originalSha256:pins['rebuild/m4/workout/project-history.mjs'],mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--stored-history-bite')){
 if(['--bite','--prepared-bite','--host-bite','--history-bite','--receipt-bite'].some(flag=>process.argv.includes(flag)))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m4/workout/stored-history.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='const signed=proofs.get(index+1),op=ops[r.op_id];';
 if(raw.split(target).length!==2)throw Error('Exact stored-history proof bite target missing');
 fs.writeFileSync(file,raw.replace(target,'const signed=proofs.get(index+1)||{...r,op:ops[r.op_id]},op=ops[r.op_id];'));preparedRestore={file,raw};
 mutation={name:'trust-unsigned-stored-receipt-index',originalSha256:pins['rebuild/m4/workout/stored-history.mjs'],mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--receipt-bite')){
 if(['--bite','--prepared-bite','--host-bite','--history-bite'].some(flag=>process.argv.includes(flag)))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='if (!retained || !sameRecordedValue(retained, receipt.op)) return false;';
 if(raw.split(target).length!==2)throw Error('Exact retained-receipt bite target missing');
 fs.writeFileSync(file,raw.replace(target,'/* MUTANT: ignore retained operation versus signed proof */'));preparedRestore={file,raw};
 mutation={name:'omit-signed-proof-retained-operation-comparison',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],
  mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--history-bite')){
 if(['--bite','--prepared-bite','--host-bite'].some(flag=>process.argv.includes(flag)))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='const historyFailure = workoutHistoryFailure(snapshot.generation);';
 if(raw.split(target).length!==2)throw Error('Exact retained-history bite target missing');
 fs.writeFileSync(file,raw.replace(target,'const historyFailure = null;'));preparedRestore={file,raw};
 mutation={name:'omit-retained-workout-history-guard',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],
  mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--host-bite')){
 if(process.argv.includes('--bite')||process.argv.includes('--prepared-bite'))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='enqueue(() => prepareWorkout(input, lifetime))';
 if(raw.split(target).length!==2)throw Error('Exact queued-lifetime bite target missing');
 fs.writeFileSync(file,raw.replace(target,'enqueue(() => prepareWorkout(input, preparationEpoch))'));preparedRestore={file,raw};
 mutation={name:'rebind-queued-preparation-after-retirement',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],
  mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--prepared-bite')){
 if(process.argv.includes('--bite'))throw Error('Select one mutation only');
 const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
 const target='context.snapshotToken !== entry.token ||';
 if(raw.split(target).length!==2)throw Error('Exact prepared-token bite target missing');
 fs.writeFileSync(file,raw.replace(target,''));preparedRestore={file,raw};
 mutation={name:'omit-prepared-snapshot-token',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],
  mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
if(process.argv.includes('--bite')){
  const file=path.join(output,'rebuild/m3/w6/public-client.mjs'),raw=fs.readFileSync(file,'utf8');
  const target='context.snapshotRevision !== original.clientRevision ||';
  if(raw.split(target).length!==2)throw Error('Exact revision assertion bite target missing');
  fs.writeFileSync(file,raw.replace(target,''));
  mutation={name:'omit-original-client-revision',originalSha256:pins['rebuild/m3/w6/public-client.mjs'],
    mutantSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')};
}
const testDir=path.join(output,'rebuild/m3/w6/test');
const namesToRun=['--workout-history','--resume-bite','--head-history-bite','--history-bite','--receipt-bite','--stored-history-bite','--projection-bite','--local-history-bite'].some(flag=>process.argv.includes(flag))?['prepared-workout.test.mjs']:
 process.argv.includes('--all')?fs.readdirSync(testDir).filter(n=>n.endsWith('.test.mjs')).sort():['current-head.test.mjs'];
// Bound test-file workers; races inside each test still run unchanged.
const args=['--test','--test-concurrency=2','--test-timeout=30000',...namesToRun.map(n=>path.join(testDir,n))];
// The unchanged baseline test reads an accepted historical client via ls-tree/show.
// Supply the retained object database for those read-only commands; do not copy or
// create an index, merge a branch, or substitute today's client for that baseline.
const gitDir=git(['rev-parse','--absolute-git-dir']).toString().trim();
const started=performance.now(),run=cp.spawnSync(process.execPath,args,{cwd:output,env:{...process.env,GIT_DIR:gitDir,GIT_WORK_TREE:output},windowsHide:true,encoding:'utf8',maxBuffer:32e6});
fs.writeFileSync(path.join(output,'test.stdout.log'),run.stdout||'');fs.writeFileSync(path.join(output,'test.stderr.log'),run.stderr||'');
let browser=null;
if(process.argv.includes('--browser')||process.argv.includes('--resume-browser')){
  browser=cp.spawnSync(process.execPath,[path.join(testDir,process.argv.includes('--resume-browser')?'browser-resume.mjs':'browser-contract.mjs')],{cwd:output,env:process.env,windowsHide:true,encoding:'utf8',maxBuffer:32e6});
  fs.writeFileSync(path.join(output,'browser.stdout.log'),browser.stdout||'');fs.writeFileSync(path.join(output,'browser.stderr.log'),browser.stderr||'');
}
if(preparedRestore){fs.writeFileSync(preparedRestore.file,preparedRestore.raw);
 mutation.restoredSha256=crypto.createHash('sha256').update(fs.readFileSync(preparedRestore.file)).digest('hex');
 if(mutation.restoredSha256!==mutation.originalSha256)throw Error('Prepared-token bite restoration failed');}
for(const [name,hash]of Object.entries(pins))if(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')!==hash)throw Error('Candidate changed during run');
fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({node:process.version,exit:run.status,browserExit:browser?.status??null,elapsedMs:performance.now()-started,tests:namesToRun,mutation},null,2));
console.log('COMPOSED W6 OUTPUT '+output);process.stdout.write(run.stdout||'');process.stderr.write(run.stderr||'');
if(browser){process.stdout.write(browser.stdout||'');process.stderr.write(browser.stderr||'');}
process.exitCode=run.status===0&&(!browser||browser.status===0)?0:1;
