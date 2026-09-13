'use strict';
// Independent DECISIONS201 checks. Only named public blobs and synthetic Git fixtures.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const Module=require('node:module');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const CANDIDATE='b09d55a83a95bc1dba2e633990b2d24690510b56';
const WORKFLOW='.github/workflows/shared-preflight.yml';
const REGISTRATION='rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs';
const REGRESSION='rebuild/lanes/tooling/test/preflight.test.cjs';
const scratch=path.join(root,'.tmp');fs.mkdirSync(scratch,{recursive:true});
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
for(const [file,expected] of [[WORKFLOW,'ea2b42cf978ae030604e0fd9de69c0b0981b24264c67d02742fb44def12198c2'],
  [REGISTRATION,'14bf8033b31d8886414238745d19c1a1360fabf49447356f1a4acbd496a646b5']]) {
  const bytes=fs.readFileSync(path.join(root,file));
  assert.equal(hash(bytes),expected);assert(bytes.equals(git('show',CANDIDATE+':'+file)));
}
const registrationSource=fs.readFileSync(path.join(root,REGISTRATION),'utf8');
const cleanup=[];
// Compile the exact registration file, suppressing only its test registrations.
// Reuse its real YAML contract and Git fixture constructor; our assertions are below.
function loadRegistration(filename) {
  const deferred=[];
  const noRegistration=()=>{};noRegistration.after=callback=>deferred.push(callback);
  const m=new Module(filename,module);m.filename=filename;
  m.paths=Module._nodeModulePaths(path.dirname(path.join(root,REGISTRATION)));
  const originalRequire=m.require.bind(m);
  m.require=id=>id==='node:test'?noRegistration:originalRequire(id);
  m._compile(registrationSource+'\nmodule.exports={contract,actual,checkoutFixture,success,replaceOnce,current,optional,history};',filename);
  cleanup.push(()=>{for(const callback of deferred)callback();});return m.exports;
}
const api=loadRegistration(path.join(root,REGISTRATION));
const ownScratch=[];
function area(label) {
  const dir=fs.mkdtempSync(path.join(scratch,'independent-ci-'+label+'-'));ownScratch.push(dir);return dir;
}
test.after(()=>{
  for(const callback of cleanup)callback();
  for(const dir of ownScratch) {
    const resolved=fs.realpathSync(dir);assert.equal(path.dirname(resolved),fs.realpathSync(scratch));
    assert(path.basename(resolved).startsWith('independent-ci-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  }
});
function childEnv(workspace,extra={}) {
  const env={...process.env,PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH,
    TEMP:path.join(workspace,'.tmp'),TMP:path.join(workspace,'.tmp'),...extra};
  delete env.NODE_TEST_CONTEXT; // Independent subprocess, as in the actual workflow.
  return env;
}
function direct(source,workspace,sha,extra={}) {
  return cp.spawnSync(process.execPath,['-e',source],{cwd:workspace,windowsHide:true,encoding:'utf8',
    env:childEnv(workspace,{CANDIDATE_SHA:sha,GITHUB_REPOSITORY:'joeymat11-rgb/prepledger',...extra}),
    maxBuffer:2*1024*1024,timeout:180000});
}

test('I01 absent actual workflow fails before its restored YAML positive control',()=>{
  const isolated=area('missing'),filename=path.join(isolated,REGISTRATION);
  const local=loadRegistration(filename);
  assert.throws(()=>local.actual(),error=>error.code==='ERR_ASSERTION'&&/WORKFLOW-MISSING/.test(error.message));
  const target=path.join(isolated,WORKFLOW);fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,fs.readFileSync(path.join(root,WORKFLOW)));
  local.contract(local.actual());
});

test('I02 a repository attribute blob remains unfetched and cannot run a checkout filter',()=>{
  const f=api.checkoutFixture();
  const origin=f.git('rev-parse','--show-toplevel');
  fs.writeFileSync(path.join(origin,'.gitattributes'),'* filter=independent-canary\n');
  f.git('add','--','.gitattributes');f.git('commit','--quiet','-m','synthetic attribute canary');
  const head=f.git('rev-parse','HEAD'),attribute=f.git('rev-parse','HEAD:.gitattributes');
  const result=f.run(f.source,head);api.success(result);
  const inventory=cp.execFileSync('git',['cat-file','--batch-all-objects','--batch-check=%(objectname) %(objecttype)'],
    {cwd:result.workspace,windowsHide:true,encoding:'utf8',stdio:['ignore','pipe','pipe']});
  assert(!inventory.includes(attribute+' blob'));assert(!fs.existsSync(path.join(result.workspace,'.gitattributes')));
});

test('I03 a symlink at an allowed input refuses before its blob is materialized',()=>{
  const f=api.checkoutFixture();
  const oid=f.git('rev-parse','HEAD:ledger/state.json'); // Synthetic canary only.
  f.git('update-index','--add','--cacheinfo','120000,'+oid+','+REGRESSION);
  f.git('commit','--quiet','-m','synthetic allowed-path symlink');
  const result=f.run(f.source,f.git('rev-parse','HEAD'));
  assert.equal(result.status,1);assert.match(result.stderr,/FAIL PUBLIC-INPUT-MISSING-OR-NONREGULAR/);
  assert(!fs.existsSync(path.join(result.workspace,REGRESSION)));
});

test('I04 an undeclared synthetic blob cannot be fetched after the remote is removed',()=>{
  const f=api.checkoutFixture(),result=f.run();api.success(result);
  const before=cp.execFileSync('git',['cat-file','--batch-all-objects','--batch-check=%(objectname) %(objecttype)'],
    {cwd:result.workspace,windowsHide:true,stdio:['ignore','pipe','pipe']});
  const read=cp.spawnSync('git',['show',f.head+':ledger/state.json'],{cwd:result.workspace,windowsHide:true,
    env:{...process.env,GIT_TERMINAL_PROMPT:'0'},encoding:'utf8',stdio:['ignore','pipe','pipe']});
  assert.notEqual(read.status,0);assert(!read.stdout.includes('SYNTHETIC EXCLUDED'));
  const after=cp.execFileSync('git',['cat-file','--batch-all-objects','--batch-check=%(objectname) %(objecttype)'],
    {cwd:result.workspace,windowsHide:true,stdio:['ignore','pipe','pipe']});
  assert(after.equals(before));
});

test('I05 wrong repository and occupied workspace refuse before Git source acquisition',()=>{
  const f=api.checkoutFixture();
  const wrong=area('wrong-repository');
  const refused=direct(f.source,wrong,f.head,{GITHUB_REPOSITORY:'unrelated/repository',GIT_ALLOW_PROTOCOL:'file'});
  assert.equal(refused.status,1);assert.match(refused.stderr,/FAIL EVENT-REPOSITORY/);
  assert.deepEqual(fs.readdirSync(wrong),[]);
  const occupied=area('occupied');fs.writeFileSync(path.join(occupied,'canary.txt'),'existing synthetic file\n');
  const dirty=direct(f.source,occupied,f.head,{GIT_ALLOW_PROTOCOL:'file'});
  assert.equal(dirty.status,1);assert.match(dirty.stderr,/FAIL FRESH-PUBLIC-WORKSPACE/);
  assert.deepEqual(fs.readdirSync(occupied),['canary.txt']);
});

test('I06 a missing disclosed historical input refuses without fetching undeclared substitutes',()=>{
  const f=api.checkoutFixture();f.git('rm','--','rebuild/m3/w7-preview/today/gym-app.mjs');
  f.git('commit','--quiet','-m','synthetic missing historical input');
  const head=f.git('rev-parse','HEAD');
  const source=api.replaceOnce(f.source,f.old1,head);
  const result=f.run(source,head);
  assert.equal(result.status,1);assert.match(result.stderr,/FAIL PUBLIC-INPUT-MISSING-OR-NONREGULAR/);
  assert(!fs.existsSync(path.join(result.workspace,'ledger')));
});

test('I07 materialized-file boundary has an executed source-mutant control and restoration',()=>{
  const f=api.checkoutFixture();api.success(f.run());
  const extra=api.replaceOnce(f.source,'walk();',"fs.writeFileSync(path.join(root,'unexpected.txt'),'synthetic extra');walk();");
  const refused=f.run(extra);assert.equal(refused.status,1);assert.match(refused.stderr,/FAIL MATERIALIZED-ALLOWLIST/);
  const mutant=api.replaceOnce(extra,"check(files.length===materialized.length&&files.every(file=>materialized.includes(file)),'MATERIALIZED-ALLOWLIST');",'');
  const admitted=f.run(mutant);assert.equal(admitted.status,0);
  assert.throws(()=>assert.notEqual(admitted.status,0,'extra materialized file must refuse'),error=>error.code==='ERR_ASSERTION');
  api.success(f.run());
});

test('I08 unchanged production checkout and actual composed 67-test command succeed in the partial repository',()=>{
  assert.match(process.version,/^v22\./,'Use the workflow Node22 family for this independent run');
  const workspace=area('real-public');
  const source=api.contract(api.actual()).source; // No URL, SHA, Git or source substitutions.
  const checkout=direct(source,workspace,CANDIDATE);
  assert.equal(checkout.status,0,checkout.stderr);
  assert.match(checkout.stdout,new RegExp('SHARED-PREFLIGHT CHECKOUT '+CANDIDATE+'; 7 current / 7 historical inputs;'));
  fs.writeFileSync(path.join(scratch,'ci-review-public-checkout.log'),checkout.stdout+checkout.stderr);
  const npm=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');
  const installLog=path.join(scratch,'ci-review-partial-install.log'),installFd=fs.openSync(installLog,'w');
  const installed=cp.spawnSync(process.execPath,[npm,'ci','--no-audit','--no-fund','--include=dev','--ignore-scripts'],
    {cwd:workspace,env:childEnv(workspace,{npm_config_cache:path.join(scratch,'npm-cache')}),windowsHide:true,
      stdio:['ignore',installFd,installFd],timeout:300000});
  fs.closeSync(installFd);assert.equal(installed.status,0,'Exact locked install in the partial repository');
  const log=path.join(scratch,'ci-review-composed-suite.log'),fd=fs.openSync(log,'w');
  const result=cp.spawnSync(process.execPath,['--test',REGRESSION,REGISTRATION],{cwd:workspace,
    env:childEnv(workspace),windowsHide:true,stdio:['ignore',fd,fd],timeout:600000});
  fs.closeSync(fd);assert.equal(result.status,0,'Exact actual two-file command in the partial repository');
  const lines=fs.readFileSync(log,'utf8').replace(/\x1b\[[0-9;]*m/g,'').split(/\r?\n/);
  const metrics={};for(const line of lines){const m=/^(?:#|\u2139) (tests|pass|fail|skipped|cancelled|duration_ms) (\S+)/.exec(line);if(m)metrics[m[1]]=Number(m[2]);}
  assert.equal(metrics.tests,67);assert.equal(metrics.pass,67);
  for(const name of ['fail','skipped','cancelled'])assert.equal(metrics[name],0);
  for(const file of api.current.concat(api.optional)) {
    const actual=fs.readFileSync(path.join(workspace,file));assert(actual.equals(git('show',CANDIDATE+':'+file)),file+' remains exact');
  }
  assert.equal(cp.execFileSync('git',['remote'],{cwd:workspace,encoding:'utf8'}).trim(),'');
  fs.writeFileSync(path.join(scratch,'ci-review-composed-evidence.json'),JSON.stringify({candidate:CANDIDATE,node:process.version,
    checkout:checkout.stdout.trim(),metrics,workflowSha256:hash(fs.readFileSync(path.join(root,WORKFLOW))),
    registrationSha256:hash(fs.readFileSync(path.join(root,REGISTRATION)))},null,2)+'\n');
});
