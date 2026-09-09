'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),os=require('node:os');const {verify,scopedEnvironment}=require('./pins.cjs');const {identity,killVerified,sha}=require('./owned.cjs');const {supervise}=require('./supervisor.cjs');const root=__dirname;
async function main(){if(process.argv.length!==3||process.argv[2]!=='--apm-authorized-linux-capture')throw Error('SEPARATE_APM_AUTHORIZATION_REQUIRED');if(process.platform!=='linux'||process.arch!=='x64'||process.execArgv.length)throw Error('LINUX_DEFAULT_NODE_REQUIRED');
  const pins=verify(),scoped=scopedEnvironment();if(path.resolve(os.tmpdir())!==pins.originalTemp)throw Error('TEMP_PIN_CHANGED');fs.mkdirSync(root+'/raw',{recursive:true});
  const claim={resourceAcceptance:false,parentPid:process.pid,startedUTC:new Date().toISOString(),authorization:'separate-apm-authorization-asserted',plannedManifestSha256:sha(fs.readFileSync(root+'/PLANNED-MANIFEST.json')),environment:scoped.receipt};fs.writeFileSync(root+'/raw/ATTEMPT-CLAIM.json',JSON.stringify(claim,null,2),{flag:'wx'});
  await supervise({parentPid:process.pid,identity,killVerified,
    spawn:()=>cp.spawn(pins.nodeExecutable,[root+'/child.cjs'],{cwd:root,env:scoped.env,windowsHide:true,stdio:['ignore','ignore','ignore','ipc']}),
    writeActual:record=>fs.writeFileSync(root+'/raw/ACTUAL-LAUNCH.json',JSON.stringify({...claim,controller:record,parent:identity(process.pid),nodeSha256:pins.nodeSha256,workerdSha256:pins.workerdSha256,bundleSha256:pins.bundleSha256,command:[pins.nodeExecutable,root+'/launch.cjs','--apm-authorized-linux-capture']},null,2)),
    writeResult:result=>fs.writeFileSync(root+'/raw/SUPERVISOR-RESULT.json',JSON.stringify(result,null,2)),
    notify:()=>console.log('Bounded Linux diagnostic is running; acceptance remains false.')});
  console.log('Linux diagnostic stopped. Local artifacts preserved; resourceAcceptance=false.');
}
if(require.main===module)main().catch(e=>{console.error(/^[A-Z0-9_]+$/.test(e.message)?e.message:'LINUX_DIAGNOSTIC_SETUP_FAILED');process.exitCode=2;});
