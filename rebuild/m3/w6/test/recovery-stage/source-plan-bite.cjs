'use strict';
// Disposable public source only. Never mutates the retained worktree or a fixture.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..');
if(!process.argv[2])throw Error('Provide the accepted R1 source root used by run-recovery-stage');
const r1=path.resolve(process.argv[2]),out=fs.mkdtempSync(path.join(os.tmpdir(),'earned-source-plan-bite-'));
const listing=cp.spawnSync('git',['ls-files','-z','--','rebuild/m3/w6','rebuild/m3/w5/public-client.cjs','rebuild/client','rebuild/authority','rebuild/m4/workout','rebuild/conform/lib'],{cwd:root,windowsHide:true});
assert.equal(listing.status,0);
for(const name of listing.stdout.toString().split('\0').filter(Boolean)){
 assert(name.startsWith('rebuild/')&&!name.split('/').includes('..'));
 const dest=path.join(out,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,name),dest);
}
fs.symlinkSync(path.join(root,'rebuild/m3/w6/node_modules'),path.join(out,'rebuild/m3/w6/node_modules'),process.platform==='win32'?'junction':'dir');
const relative='rebuild/m3/w6/recovery-plan.cjs',file=path.join(out,relative),original=fs.readFileSync(file),needle='plan: Plan.plan(tx),';
assert.equal(original.toString().split(needle).length,2);
const args=[path.join(out,'rebuild/m3/w6/test/run-recovery-stage.cjs'),r1,'--plan'];
fs.writeFileSync(file,original.toString().replace(needle,'plan: structuredClone(initialPlan),'));
const red=cp.spawnSync(process.execPath,args,{encoding:'utf8',windowsHide:true});fs.writeFileSync(path.join(out,'red.log'),red.stdout+red.stderr);
assert.equal(red.status,1);assert.match(red.stdout+red.stderr,/RECOVERY_SOURCE_PLAN_EXACT/);
console.log('RECOVERY SOURCE PLAN BITE RED — ignoring admitted transactions fails RECOVERY_SOURCE_PLAN_EXACT');
fs.writeFileSync(file,original);
const green=cp.spawnSync(process.execPath,args,{encoding:'utf8',windowsHide:true});fs.writeFileSync(path.join(out,'restored.log'),green.stdout+green.stderr);
assert.equal(green.status,0);assert(fs.readFileSync(file).equals(original));assert(fs.readFileSync(path.join(root,relative)).equals(original));
console.log('RECOVERY SOURCE PLAN RESTORED PASS — source-closure pin and actual Worker/D1/P1; SHA256 '+crypto.createHash('sha256').update(original).digest('hex'));
console.log('Evidence '+out);
