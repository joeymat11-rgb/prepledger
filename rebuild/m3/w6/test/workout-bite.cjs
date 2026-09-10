"use strict";
// Only mutate a pinned disposable composition; never the retained working tree.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root=fs.realpathSync(path.resolve(process.argv[2]||'')),temp=fs.realpathSync(os.tmpdir());
const relative=path.relative(temp,root);
if(!relative||relative.startsWith('..')||path.isAbsolute(relative)||!path.basename(root).startsWith('earned-w6-current-head-'))throw Error('Disposable temporary composition required');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'source-manifest.json'),'utf8'));
const target=path.join(root,'rebuild/client/index.cjs'),original=fs.readFileSync(target),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
if(sha(original)!==manifest.pins['rebuild/client/index.cjs'])throw Error('Candidate source pin differs');
const text=original.toString('utf8'),needle='schema_version: workout ? 2 : undefined,';
if(text.split(needle).length!==2)throw Error('Unique schema bite target absent');
let broken,restored;
function run(name,args){const r=spawnSync(process.execPath,args,{cwd:root,windowsHide:true,encoding:'utf8',maxBuffer:8e6});fs.writeFileSync(path.join(root,name+'.log'),(r.stdout||'')+(r.stderr||''));return r;}
try{
 fs.writeFileSync(target,text.replace(needle,'schema_version: undefined,'));
 broken=run('workout-bite-red',['--test','--test-timeout=30000','--test-name-pattern=actual workout start and two','rebuild/m3/w6/test/workout-commands.test.mjs']);
 if(broken.status!==1||!broken.stdout.includes('false !== true'))throw Error('Bite did not expose the required false refusal');
 console.log('WORKOUT SCHEMA BITE DETECTED — actual encrypted workout save fails when selected schema is omitted; native1');
}finally{fs.writeFileSync(target,original);if(!fs.readFileSync(target).equals(original))throw Error('Byte restoration failed');}
restored=run('workout-bite-restored',['--test','--test-timeout=30000','rebuild/m3/w6/test/workout-commands.test.mjs']);
fs.writeFileSync(path.join(root,'workout-bite.json'),JSON.stringify({broken:broken?.status,restored:restored.status,restoredSha256:sha(fs.readFileSync(target))},null,2));
if(restored.status!==0)throw Error('Restored focused cases failed');
console.log('WORKOUT SCHEMA RESTORED PASS — '+sha(original)+'; full focused client cases native0');
