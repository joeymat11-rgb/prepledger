import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const head='8e65805481091daacda3266ad9113b49553cf3f4', source='797e4cf39fac39148ccae784116999669b82caf3', prior='c4716edad91453e74ba17f70ab076781ff5367de';
const git=(...args)=>execFileSync('git',args), hash=b=>createHash('sha256').update(b).digest('hex');
const previous=JSON.parse(fs.readFileSync('../review-n2-b1b2-r2/.tmp/N2-B1B2-R2-EVIDENCE.json'));
const oldClosure=JSON.parse(fs.readFileSync('../review-n2-b1b2-r2/.tmp/d2-combined-closure.json'));
const closure=JSON.parse(fs.readFileSync('.tmp/d2-combined-closure.json'));
assert.equal(git('rev-parse','HEAD').toString().trim(),head);
assert.equal(git('status','--porcelain=v1').toString().trim(),'');
assert.equal(git('rev-parse',head+':rebuild/engine').toString(),git('rev-parse',source+':rebuild/engine').toString());
assert.equal(git('rev-parse',head+':rebuild/m3').toString(),git('rev-parse',prior+':rebuild/m3').toString());
assert.deepEqual(closure.files.map(f=>f.path).sort(),oldClosure.files.map(f=>f.path).sort());
assert.deepEqual(closure.beforeReadDenied,[]); assert.deepEqual(closure.warnings,[]);
const c=previous.custody.identity.c.map(row=>{
  const bytes=git('show',head+':'+row.path);
  assert.equal(hash(bytes),row.sha256,row.path);
  assert(bytes.equals(git('show',prior+':'+row.path)),row.path);
  assert(bytes.equals(git('show',row.reference+':'+row.path)),row.path);
  return {...row,alsoEqualsR2:true};
});
const sourceIdentities=previous.custody.sourceIdentities.filter(f=>f.gitDiskEqual).map(row=>{
  const disk=fs.readFileSync(row.path), object=git('show',head+':'+row.path), priorObject=git('show',prior+':'+row.path);
  assert(disk.equals(object),row.path+' Git=disk');
  assert.equal(hash(priorObject),row.sha256,row.path+' retained evidence belongs to prior');
  const sha256=hash(disk), changed=sha256!==row.sha256;
  assert(!changed||row.path==='rebuild/engine/today.cjs','Unexpected source dependency change '+row.path);
  return {path:row.path,bytes:disk.length,sha256,priorSHA256:row.sha256,gitDiskEqual:true,changed};
});
for(const row of closure.files) assert.equal(sourceIdentities.find(r=>r.path===row.path)?.sha256,row.sha256,row.path);
for(const name of ['d2-r2-support.mjs','d2-r2-availability.test.mjs','d2-r2-consumers.test.mjs'])
  assert(fs.readFileSync('.tmp/'+name).equals(fs.readFileSync('../review-n2-b1b2-r2/.tmp/'+name)),name);
const output={head,source,prior,engineTree:git('rev-parse',head+':rebuild/engine').toString().trim(),m3Tree:git('rev-parse',head+':rebuild/m3').toString().trim(),c,sourceIdentities,closureInputs:closure.files.length,noNewSourcePaths:true,builderReportUnread:true,unaffectedEvidence:{commit:'6872c41a09e5dc595d49f34300da3875d589f330',evidenceSHA256:hash(fs.readFileSync('../review-n2-b1b2-r2/.tmp/N2-B1B2-R2-EVIDENCE.json')),note:'Unchanged C/other source identity is reuse evidence; old build, tests and seven profile kills retain their c4716ed head. New affected behavior/build is recorded separately.'}};
const destination=process.argv[2]||'.tmp/d2-r3-identity-before.json';
fs.writeFileSync(destination,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({c:c.length,closure:closure.files.length,tracked:sourceIdentities.length,changed:sourceIdentities.filter(f=>f.changed).map(f=>f.path),clean:true}));
