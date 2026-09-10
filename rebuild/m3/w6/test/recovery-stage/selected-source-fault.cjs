'use strict';
// Reuse a completed public source composition. Trim only its test continuation
// to exercise the new final visitor guard with actual signed recovery and IDB.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const dir=path.resolve(process.argv[2]||''),m4=path.resolve(process.argv[3]||'');
if(!process.argv[2]||!process.argv[3])throw Error('Provide completed public source composition and retained M4 root');
const sha=x=>createHash('sha256').update(x).digest('hex'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'source-manifest.json')));
assert.match(fs.readFileSync(path.join(dir,'test.log'),'utf8'),/# pass 1[\r\n]/,'Completed full joined baseline required');
const test=path.join(dir,'rebuild/m3/w6/test/recovery-stage/source-import.test.mjs'),file=path.join(dir,'rebuild/m3/w6/recovery-local.mjs');
const originalTest=fs.readFileSync(test),originalSource=fs.readFileSync(file),marker='  const rollback=remoteOp(';
assert.equal(originalTest.toString().split(marker).length,2);const cut=originalTest.toString().indexOf(marker);
const focused=originalTest.toString().slice(0,cut)+`  let called=0;
  await assert.rejects(candidate.inspectSelectedSource(activation.op_id,async()=>{
    called++;const current=await repo.load();await repo.commit(current,current.generation);
  }),{code:'LOCAL_RECOVERY_CHANGED'},'Final selected-source visitor must recheck the actual local revision');
  assert.equal(called,1);
});
`;
function run(name){const r=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',test],{cwd:dir,env:{...process.env,EARNED_ROWS_R1_ROOT:dir,EARNED_IMPORT_M4_ROOT:m4},windowsHide:true,encoding:'utf8',timeout:90000,maxBuffer:4e6});fs.writeFileSync(path.join(dir,name+'.log'),(r.stdout||'')+(r.stderr||''));return r;}
const needle='await check();await visitor({selection,material});await check();';assert.equal(originalSource.toString().split(needle).length,2);
const mutant=originalSource.toString().replace(needle,'await check();await visitor({selection,material});');
try{
  fs.writeFileSync(test,focused);assert.equal(run('selected-source-baseline').status,0);
  fs.writeFileSync(file,mutant);const red=run('selected-source-final-guard-red');assert.equal(red.status,1);assert.match(red.stdout,/code: 'ERR_ASSERTION'/);assert.match(red.stdout,/Final selected-source visitor/);
  fs.writeFileSync(file,originalSource);assert.equal(run('selected-source-restored').status,0);
}finally{fs.writeFileSync(file,originalSource);fs.writeFileSync(test,originalTest);}
for(const [name,pin]of Object.entries(manifest.pins)){
  assert.equal(sha(fs.readFileSync(path.join(dir,name))),pin.sha256,'Restored composition '+name);
  assert.equal(sha(fs.readFileSync(path.join(pin.root,name))),pin.sha256,'Original product '+name);
}
for(const [name,pin]of Object.entries(manifest.externalPins))assert.equal(sha(fs.readFileSync(path.join(m4,name))),pin,'External M4 source '+name);
fs.writeFileSync(path.join(dir,'selected-source-fault-evidence.json'),JSON.stringify({profile:'earned/selected-source-guard-fault/v1',directory:dir,
  full_joined_baseline:true,focused_actual_signed_recovery:true,original_source_sha256:sha(originalSource),mutant_sha256:sha(mutant),
  original_test_sha256:sha(originalTest),focused_test_sha256:sha(focused),effective:true,restored:true},null,2)+'\n');
console.log('SELECTED SOURCE FINAL GUARD REACHED / RESTORED PASS '+dir);
