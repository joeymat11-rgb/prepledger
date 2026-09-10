'use strict';
// Actual public composition, reached boundary mutations, exact restoration.
// No private inputs or accepted engine/law changes; not a qualification gate.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),r1=path.resolve(process.argv[2]||''),m4=path.resolve(process.argv[3]||'');
if(!process.argv[2]||!process.argv[3])throw Error('Provide retained R1 and M4 worktrees');
const sha=x=>createHash('sha256').update(x).digest('hex');
const baseline=cp.spawnSync(process.execPath,[path.join(__dirname,'run-source-import.cjs'),r1,m4],{cwd:root,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:8e6});
process.stdout.write(baseline.stdout||'');if(baseline.stderr)process.stderr.write(baseline.stderr);
assert.equal(baseline.status,0,'Actual signed joined baseline must pass');
const dir=baseline.stdout.match(/SOURCE RECOVERY COMPOSITION (.+)/)?.[1].trim();assert(dir);
const focused='rebuild/m3/w6/test/reading-history.test.mjs',joined='rebuild/m3/w6/test/recovery-stage/source-import.test.mjs';
function run(name,file){
  const result=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',path.join(dir,file)],{cwd:dir,
    env:{...process.env,EARNED_ROWS_R1_ROOT:dir,EARNED_IMPORT_M4_ROOT:m4},encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:8e6});
  fs.writeFileSync(path.join(dir,name+'.log'),(result.stdout||'')+(result.stderr||''));return result;
}
assert.equal(run('reading-baseline',focused).status,0,'Focused actual T2/face baseline');
const face='rebuild/client/face.cjs',projector='rebuild/m3/w6/reading-history.mjs';
const faults=[
  ['own-device-only','rebuild/client/index.cjs','if (cfg.readingProjector === undefined) return null;','return null;',joined,/SOURCE_CURRENT_PROJECTION_REMOTE_READING/],
  ['ignore-local-identity','rebuild/m3/w6/t2-stage.cjs','if (integration?.historyAuthentication) {','if (false) {',joined,/Expected values to be strictly equal/],
  ['pending-in-accepted',projector,"(layer==='local'||status.get(op.op_id)==='accepted')",'true',focused,/remote correction followed by local/],
  ['empty-dates-become-fresh',face,'if (projected && missing === null) return {','if (false) return {',focused,/pending withdrawal/],
  ['earlier-effect-keeps-old-estimate',face,'if (readingChanged) {','if (false) {',focused,/earlier-date effects/],
  ['accepted-fact-freshens-old-snapshot',face,'concat(projected ? [] : ctx.reads().map((r) => r.date))','concat(projected ? projected.acceptedReads.map(r => r.date) : ctx.reads().map((r) => r.date))',focused,/new accepted dates/]
];
const evidence={profile:'earned/reading-projection-faults/v1',directory:dir,faults:[]};
for(const [name,file,needle,replacement,test,witness]of faults){
  const target=path.join(dir,file),original=fs.readFileSync(target),source=original.toString();assert.equal(source.split(needle).length,2,'Unique product mutation '+name);
  const mutant=source.replace(needle,replacement);let red;
  try{fs.writeFileSync(target,mutant);red=run(name,test);}finally{fs.writeFileSync(target,original);}
  assert.equal(red.status,1,'Reached fault '+name+' '+dir);assert.match(red.stdout,/code: 'ERR_ASSERTION'/);assert.match(red.stdout,witness);
  evidence.faults.push({name,file,original_sha256:sha(original),mutant_sha256:sha(mutant),effective:true,log:name+'.log'});
  console.log('READING FAULT REACHED '+name);
}
assert.equal(run('reading-restored',focused).status,0);assert.equal(run('joined-restored',joined).status,0);
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'source-manifest.json')));
for(const [file,pin]of Object.entries(manifest.pins)){
  assert.equal(sha(fs.readFileSync(path.join(dir,file))),pin.sha256,'Restored copied source '+file);
  assert.equal(sha(fs.readFileSync(path.join(pin.root,file))),pin.sha256,'Unchanged product source '+file);
}
evidence.restored=true;fs.writeFileSync(path.join(dir,'reading-fault-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
console.log('READING FAULTS RESTORED PASS '+dir);
