'use strict';
// Disposable PUBLIC composition: no private engines, fixture or installed
// product is modified. Actual Worker/D1/P1 join tests execute each source fault.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),sha=b=>createHash('sha256').update(b).digest('hex');
const dir=fs.mkdtempSync(path.join(root,'.tmp/source-import-faults-')),copy=path.join(dir,'public');
fs.mkdirSync(copy);
const allow=file=>!path.relative(root,file).split(path.sep).some(p=>['node_modules','.tmp','.generated','private','engines'].includes(p));
for(const name of ['rebuild/authority','rebuild/client','rebuild/m4/workout','rebuild/m3/w5','rebuild/m3/rigs']){
  fs.cpSync(path.join(root,name),path.join(copy,name),{recursive:true,filter:allow});
}
for(const name of ['node_modules','rebuild/m3/w5/node_modules']){
  fs.symlinkSync(path.join(root,name),path.join(copy,name),'junction');
}
const product='rebuild/m3/w5/source/transaction.cjs',source=fs.readFileSync(path.join(copy,product),'utf8');
const tests=[
  ['incomplete-source','state.readMaterial(sourceId);','/* faulty completeness omission */',
    'missing/changed source'],
  ['missing-binding','  put(key,binding);','  /* faulty binding omission */',
    'real HTTP/P1 source activation'],
  ['truncated-drain',"after:S.frontier(get,get('metadata','state').seq,op.op_id)","after:S.frontier(get,r.expected.W+1,op.op_id)",
    'actual admission WAITING drain'],
  ['stale-source-basis',"if(!C.fullEqual(r.expected,state.frontier))fail('SOURCE_STALE_BASIS');",
    "/* faulty initial basis omission */",'missing/changed source'],
];
const execute=(name,pattern)=>{
  const args=['--test','--test-reporter=tap',...(pattern?['--test-name-pattern',pattern]:[]),'rebuild/m3/w5/test/source-import.test.cjs'];
  const result=spawnSync(process.execPath,args,{cwd:copy,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:5*1024*1024});
  fs.writeFileSync(path.join(dir,name+'.log'),(result.stdout||'')+(result.stderr||''));
  return result;
};
const baseline=execute('baseline');assert.equal(baseline.status,0,baseline.stdout+baseline.stderr);
const evidence={profile:'earned/source-import-faults/v1',source_sha256:sha(source),directory:dir,faults:[]};
for(const [name,old,next,pattern]of tests){
  assert.equal(source.split(old).length,2,'unique product fault '+name);
  const mutated=source.replace(old,next);fs.writeFileSync(path.join(copy,product),mutated);
  let result;try{result=execute(name,pattern);}finally{fs.writeFileSync(path.join(copy,product),source);}
  assert.equal(result.status,1,name+' must fail its reached contract assertion');
  assert.match(result.stdout,/code: 'ERR_ASSERTION'/,name+' cannot count loader or setup failure');
  assert.match(result.stdout,/not ok /);
  evidence.faults.push({name,effective:true,mutant_sha256:sha(mutated),log:name+'.log'});
  console.log('SOURCE FAULT RED '+name);
}
const restored=execute('restored');assert.equal(restored.status,0,restored.stdout+restored.stderr);
assert.equal(sha(fs.readFileSync(path.join(root,product))),sha(source));
assert.equal(sha(fs.readFileSync(path.join(copy,product))),sha(source));
evidence.restored_pass=true;fs.writeFileSync(path.join(dir,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
console.log('SOURCE FAULT RESTORED PASS '+dir);
