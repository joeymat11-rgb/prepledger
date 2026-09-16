'use strict';
// DECISIONS201: inspect actual YAML. No package gate or private fixture is run.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const YAML=require('yaml');
const root=path.resolve(__dirname,'../../../..');
const file='.github/workflows/shared-preflight.yml';
const own='rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs';
const regression='rebuild/lanes/tooling/test/preflight.test.cjs';
const clientDir='rebuild/client/';
const clientSuite=clientDir+'test/reason-on-disk.test.cjs';
const command='node --test '+regression+' '+own+' '+clientSuite;
const identity="${{ github.event_name == 'pull_request' && github.event.pull_request.head.sha || github.sha }}";
const clientFiles=['README.md','bodycomp.cjs','canonical.cjs','copy.cjs','face.cjs','index.cjs','lease.cjs',
  'ops.cjs','outbox.cjs','package.json','plan.cjs','session.cjs','store.cjs','sync.cjs',
  'test/reason-on-disk.test.cjs','test/fixtures/base-index.cjs','test/fixtures/base-copy.cjs'].map(p=>clientDir+p);
const current=[file,'package.json','package-lock.json','rebuild/lanes/tooling/preflight.cjs',regression,own,...clientFiles];
const optional=['rebuild/lanes/tooling/preflight-dash-scan.cjs'];
const ui=['build.mjs','gym-app.mjs','plain-copy.cjs'].map(p=>'rebuild/m3/w7-preview/today/'+p);
const history={
  '2b9b09a564531d415df847cd668ea357233687b2':ui,
  '0e652ce213b56cd5d73a670e0a761cca8c94b6c3':[...ui,'rebuild/lanes/tooling/preflight.cjs']
};
const exactKeys=(object,keys,label)=>assert.deepEqual(Object.keys(object).sort(),[...keys].sort(),label);
function nodeSource(step) {
  assert.equal(step.shell,'bash','CHECKOUT-SHELL');
  const match=/^node <<'NODE'\n([\s\S]+)\nNODE\n?$/.exec(step.run);
  assert(match,'CHECKOUT-SINGLE-NODE-PROCESS');return match[1];
}
function literal(source,name) {
  const match=new RegExp('^const '+name+' = (.+);$','m').exec(source);
  assert(match,'CHECKOUT-CLOSED-'+name);return JSON.parse(match[1]);
}
function contract(text) {
  const document=YAML.parseDocument(text,{uniqueKeys:true});
  assert.equal(document.errors.length,0,'WORKFLOW-YAML');const w=document.toJS();
  exactKeys(w,['name','on','permissions','concurrency','jobs'],'WORKFLOW-KEYS');
  assert.equal(w.name,'shared-preflight','WORKFLOW-NAME');
  assert.deepEqual(w.on,{push:{branches:['rebuild/**']},pull_request:{branches:['rebuild/**']},workflow_dispatch:null},'WORKFLOW-TRIGGERS');
  assert.deepEqual(w.permissions,{contents:'read'},'WORKFLOW-READ-ONLY');
  assert.deepEqual(w.concurrency,{group:'shared-preflight-${{ github.ref }}','cancel-in-progress':false},'WORKFLOW-CONCURRENCY');
  exactKeys(w.jobs,['public-preflight'],'WORKFLOW-JOBS');const job=w.jobs['public-preflight'];
  exactKeys(job,['name','strategy','runs-on','timeout-minutes','steps'],'JOB-NO-SKIP');
  assert.equal(job['runs-on'],'${{ matrix.os }}','JOB-OS-BINDING');
  assert.deepEqual(job.strategy,{'fail-fast':false,matrix:{os:['ubuntu-latest','windows-latest']}},'JOB-BOTH-OS');
  assert(Number.isInteger(job['timeout-minutes'])&&job['timeout-minutes']>=1&&job['timeout-minutes']<=20,'JOB-TIMEOUT');
  assert.deepEqual(job.steps.map(s=>s.id),['node','public-source','install','regressions'],'JOB-EXACT-STEPS');
  const [node,checkout,install,run]=job.steps;
  exactKeys(node,['id','uses','with'],'NODE-NO-SKIP');
  assert.equal(node.uses,'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020','NODE-ACTION-PIN');
  assert.deepEqual(node.with,{'node-version':'22'},'NODE22');
  exactKeys(checkout,['id','name','shell','env','run'],'CHECKOUT-NO-SKIP');
  assert.deepEqual(checkout.env,{CANDIDATE_SHA:identity},'CHECKOUT-EVENT-IDENTITY');
  const source=nodeSource(checkout);
  assert.deepEqual(literal(source,'CURRENT'),current,'CHECKOUT-CURRENT-ALLOWLIST');
  assert.deepEqual(literal(source,'OPTIONAL'),optional,'CHECKOUT-OPTIONAL-ALLOWLIST');
  assert.deepEqual(literal(source,'HISTORY'),history,'CHECKOUT-HISTORY-ALLOWLIST');
  for(const token of ["['init','--quiet','--template=']","['sparse-checkout','set','--no-cone','--stdin']",
    "'--filter=blob:none'","'--depth=1'","'credential.helper='","['read-tree',expected]",
    "['cat-file','blob',oid]","['remote','remove','origin']",'FILTER-CAPABILITY','EVENT-SHA',
    'UNEXPECTED-FETCHED-BLOB','MATERIALIZED-ALLOWLIST','CHECKED-OUT-EVENT-SHA']) {
    assert(source.includes(token),'CHECKOUT-BOUNDARY '+token);
  }
  assert(source.indexOf("['sparse-checkout','set','--no-cone','--stdin']")<source.indexOf("'--filter=blob:none'"),'CHECKOUT-SPARSE-FIRST');
  assert(!/git (?:clone|checkout)|archive|downloadRepository|actions\/checkout|secrets\.|github\.token/.test(source),'CHECKOUT-NO-BROAD-FALLBACK');
  exactKeys(install,['id','name','run'],'INSTALL-NO-SKIP');
  assert.equal(install.run,'npm ci --no-audit --no-fund --include=dev --ignore-scripts','LOCKED-INSTALL-NO-HOOKS');
  exactKeys(run,['id','name','env','run'],'REGRESSION-NO-SKIP');
  assert.deepEqual(run.env,{TEMP:'${{ github.workspace }}/.tmp',TMP:'${{ github.workspace }}/.tmp'},'CONTAINED-TEST-SCRATCH');
  assert.equal(run.run,command,'EXACT-REGRESSION-COMMAND');
  return {w,source};
}
function actual() {
  assert(fs.existsSync(path.join(root,file)),'WORKFLOW-MISSING');
  return fs.readFileSync(path.join(root,file),'utf8');
}
test('actual workflow registers both public suites on both OS without weakening checkout',()=>{
  contract(actual());
});
const changes=[
  ['missing command',w=>{delete w.jobs['public-preflight'].steps[3].run;},/REGRESSION-NO-SKIP/],
  ['renamed suite',w=>{w.jobs['public-preflight'].steps[3].run=command.replace('preflight.test','other.test');},/EXACT-REGRESSION-COMMAND/],
  ['missing Ubuntu',w=>{w.jobs['public-preflight'].strategy.matrix.os.shift();},/JOB-BOTH-OS/],
  ['missing Windows',w=>{w.jobs['public-preflight'].strategy.matrix.os.pop();},/JOB-BOTH-OS/],
  ['one-OS override',w=>{w.jobs['public-preflight']['runs-on']='ubuntu-latest';},/JOB-OS-BINDING/],
  ['job skip',w=>{w.jobs['public-preflight'].if='false';},/JOB-NO-SKIP/],
  ['step skip',w=>{w.jobs['public-preflight'].steps[3].if='false';},/REGRESSION-NO-SKIP/],
  ['continue on error',w=>{w.jobs['public-preflight'].steps[3]['continue-on-error']=true;},/REGRESSION-NO-SKIP/],
  ['swallowed exit',w=>{w.jobs['public-preflight'].steps[3].run+=' || true';},/EXACT-REGRESSION-COMMAND/],
  ['narrow trigger',w=>{w.on.push.paths=['rebuild/lanes/tooling/**'];},/WORKFLOW-TRIGGERS/],
  ['lost PR trigger',w=>{delete w.on.pull_request;},/WORKFLOW-TRIGGERS/],
  ['glob',w=>{w.jobs['public-preflight'].steps[3].run='node --test rebuild/lanes/tooling/test/*.test.cjs';},/EXACT-REGRESSION-COMMAND/],
  ['wrong PR identity',w=>{w.jobs['public-preflight'].steps[1].env.CANDIDATE_SHA='${{ github.sha }}';},/CHECKOUT-EVENT-IDENTITY/],
  ['unfiltered fetch',w=>{w.jobs['public-preflight'].steps[1].run=w.jobs['public-preflight'].steps[1].run.replace("'--filter=blob:none',",'');},/CHECKOUT-BOUNDARY/],
  ['extra current source',w=>{w.jobs['public-preflight'].steps[1].run=w.jobs['public-preflight'].steps[1].run.replace('const CURRENT = [','const CURRENT = ["ledger/state.json",');},/CHECKOUT-CURRENT-ALLOWLIST/],
  ['remote remains',w=>{w.jobs['public-preflight'].steps[1].run=w.jobs['public-preflight'].steps[1].run.replace("git(['remote','remove','origin']);",'');},/CHECKOUT-BOUNDARY/]
];
for(const [name,change,code] of changes) test('workflow mutation: '+name+' fails its intended assertion and restores',()=>{
  const text=actual(),parsed=contract(text);change(parsed.w);
  assert.throws(()=>contract(YAML.stringify(parsed.w)),error=>error.code==='ERR_ASSERTION'&&code.test(error.message));
  contract(text);
});

// Execute the actual YAML's Node body against a real filtered Git transport.
// Only the public remote URL and two historical commit coordinates become
// synthetic. Git, filesystem, blob inventory and every boundary check execute.
const tempRoot=path.join(root,'.tmp');
fs.mkdirSync(tempRoot,{recursive:true});
const scratches=[];
test.after(()=>{
  for(const dir of scratches){const actual=fs.realpathSync(dir);
    assert.equal(path.dirname(actual),fs.realpathSync(tempRoot));
    assert(path.basename(actual).startsWith('preflight-registration-'));
    fs.rmSync(actual,{recursive:true,force:true});
  }
});
function replaceOnce(text,before,after) {
  assert.equal(text.split(before).length,2,'One exact source substitution');
  return text.replace(before,after);
}
function checkoutFixture({missing=false,filter=true}={}) {
  const dir=fs.mkdtempSync(path.join(tempRoot,'preflight-registration-'));scratches.push(dir);
  const origin=path.join(dir,'origin');fs.mkdirSync(origin);
  const git=(...args)=>cp.execFileSync('git',args,{cwd:origin,windowsHide:true,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const write=(file,bytes)=>{const p=path.join(origin,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes);};
  const commit=label=>{git('add','-A');git('commit','--quiet','-m',label);return git('rev-parse','HEAD');};
  git('init','--quiet','--template=','-b','fixture');git('config','user.name','Public checkout fixture');
  git('config','user.email','checkout-fixture@earned.local');git('config','core.autocrlf','false');
  git('config','uploadpack.allowFilter',String(filter));git('config','uploadpack.allowAnySHA1InWant','true');
  for(const file of [...current,...optional,...ui])write(file,'synthetic public input '+file+'\n');
  // These contain synthetic canaries only. The workflow must never fetch their blobs.
  for(const file of ['ledger/state.json','src/history.js','rebuild/conform/private/live.json','rebuild/soak/canary.txt'])write(file,'SYNTHETIC EXCLUDED '+file+'\n');
  const old1=commit('synthetic public history one');
  for(const file of ui)write(file,'synthetic public history two '+file+'\n');
  const old2=commit('synthetic public history two');
  write(current[0],actual());
  if(missing)fs.unlinkSync(path.join(origin,regression));
  const head=commit('synthetic event candidate');
  let source=contract(actual()).source;
  source=replaceOnce(source,"'https://github.com/joeymat11-rgb/prepledger.git'",JSON.stringify(require('node:url').pathToFileURL(origin).href));
  source=replaceOnce(source,Object.keys(history)[0],old1);
  source=replaceOnce(source,Object.keys(history)[1],old2);
  let runs=0;
  const run=(code=source,identity=head)=>{
    const workspace=path.join(dir,'workspace-'+(++runs));fs.mkdirSync(workspace);
    const result=cp.spawnSync(process.execPath,['-e',code],{cwd:workspace,windowsHide:true,encoding:'utf8',
      env:{...process.env,CANDIDATE_SHA:identity,GITHUB_REPOSITORY:'joeymat11-rgb/prepledger',GIT_ALLOW_PROTOCOL:'file'},maxBuffer:1024*1024});
    return {...result,workspace};
  };
  return {source,run,git,head,old1,old2};
}
function success(result) {
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/SHARED-PREFLIGHT CHECKOUT [a-f0-9]{40}; 24 current \/ 7 historical inputs; \d+ unique public blobs; no fetch remote/);
}
test('actual workflow materializes only the closed current inputs and exact public historical blobs',()=>{
  const f=checkoutFixture(),result=f.run();success(result);
  const git=(...args)=>cp.execFileSync('git',args,{cwd:result.workspace,windowsHide:true,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  assert.equal(git('rev-parse','HEAD'),f.head);assert.equal(git('remote'),'');
  assert.equal(git('config','core.sparseCheckout'),'true');assert.equal(git('config','core.sparseCheckoutCone'),'false');
  for(const denied of ['ledger','src','rebuild/conform','rebuild/soak'])assert(!fs.existsSync(path.join(result.workspace,denied)),denied+' remains absent');
  for(const [sha,files] of [[f.old1,ui],[f.old2,[...ui,'rebuild/lanes/tooling/preflight.cjs']]])
    for(const file of files)assert.match(git('show',sha+':'+file),/synthetic public/);
});
test('actual checkout refuses invalid event identity before fetching or materializing source',()=>{
  const f=checkoutFixture(),result=f.run(f.source,'bad; branch text');
  assert.equal(result.status,1);assert.match(result.stderr,/FAIL EVENT-SHA/);
  assert.deepEqual(fs.readdirSync(result.workspace),[]);success(f.run());
});
test('actual checkout refuses a server without filtering before source materialization',()=>{
  const f=checkoutFixture({filter:false}),result=f.run();
  assert.equal(result.status,1);assert.match(result.stderr,/FAIL FILTER-CAPABILITY/);
  assert(!fs.existsSync(path.join(result.workspace,'package.json')));
  f.git('config','uploadpack.allowFilter','true');success(f.run());
});
test('actual checkout refuses a missing public input without a broad fallback',()=>{
  const f=checkoutFixture({missing:true}),result=f.run();
  assert.equal(result.status,1);assert.match(result.stderr,/FAIL PUBLIC-INPUT-MISSING-OR-NONREGULAR/);
  assert(!fs.existsSync(path.join(result.workspace,'ledger')));
});
test('source mutant: fetched-blob inventory detects unfiltered transport and its removal loses the refusal',()=>{
  const f=checkoutFixture();success(f.run());
  let unsafe=replaceOnce(f.source,"'--filter=blob:none',",'');
  unsafe=replaceOnce(unsafe,"git(['config','remote.origin.partialclonefilter','blob:none']);",'');
  const refused=f.run(unsafe);assert.equal(refused.status,1);assert.match(refused.stderr,/FAIL UNEXPECTED-FETCHED-BLOB/);
  const mutant=replaceOnce(unsafe,"check(presentBlobs.length===blobIds.size&&presentBlobs.every(oid=>blobIds.has(oid)),'UNEXPECTED-FETCHED-BLOB');",'');
  const admitted=f.run(mutant);
  assert.equal(admitted.status,0,admitted.stderr);
  assert.throws(()=>assert.notEqual(admitted.status,0,'unfiltered source must refuse'),error=>error.code==='ERR_ASSERTION');
  success(f.run());
});
