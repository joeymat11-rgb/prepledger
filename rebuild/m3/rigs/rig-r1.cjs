'use strict';
// Standalone R1 gate. Does not register itself in or alter the frozen suite.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),dir=path.join(root,'rebuild/m3/w5');
const cases=['COMPLETE','FOCUSED','RESOURCE','REGRESSION'];
const environments=['local','synthetic-remote','owner-phone','isolated-restore'];
const tests=['r1-core-crypto.test.cjs','r1-issuer-bridge.test.cjs','r1-effective-bites.test.cjs',
  'r1-recovery.test.cjs','r1-snapshot-race.test.cjs','r1-transport.test.cjs',
  'r1-boundary-audit.test.cjs','r1-limits-inventory.test.cjs','r1-base64-allocation.test.cjs'];
function execute(label,args,env={...process.env}){
  const result=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',windowsHide:true,
    timeout:1200000,maxBuffer:16*1024*1024});
  const logs=path.join(dir,'.generated/r1-gate');fs.mkdirSync(logs,{recursive:true});
  fs.writeFileSync(path.join(logs,label+'.stdout.log'),result.stdout||'');
  fs.writeFileSync(path.join(logs,label+'.stderr.log'),result.stderr||'');
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.status!==0){console.log(label+' '+(result.status===2?'BLOCKED':'FAIL')+' (child exit '+result.status+')');return result.status===2?2:1;}
  return 0;
}
async function main(argv=process.argv.slice(2)){
  let environment='local',selected='COMPLETE';
  for(let i=0;i<argv.length;i++){
    if(argv[i]==='--env'&&argv[i+1])environment=argv[++i];
    else if(argv[i]==='--case'&&argv[i+1])selected=argv[++i];
    else throw Error('Use --case COMPLETE|FOCUSED|RESOURCE|REGRESSION --env local|synthetic-remote|owner-phone|isolated-restore');
  }
  if(!cases.includes(selected)||!environments.includes(environment))throw Error('Unknown case or environment');
  if(environment!=='local'){
    const pending=environment==='owner-phone',reason=pending?'Witnessed phone recovery and durable W6 sink required':
      environment==='synthetic-remote'?'W4 remote database not yet created':'Isolated restore database and recovery evidence not yet provisioned';
    console.log('R1-COMPLETE '+(pending?'PENDING':'BLOCKED')+' ('+reason+')');return 2;
  }
  const steps=selected==='COMPLETE'?['FOCUSED','RESOURCE','REGRESSION']:[selected];
  let failed=0;
  for(const step of steps){
    let code;
    if(step==='FOCUSED')code=execute('R1-FOCUSED',['--test','--test-concurrency=1','--test-reporter=spec',...tests.map(n=>path.join(dir,'test',n))]);
    else if(step==='RESOURCE')code=execute('R1-RESOURCE',[path.join(dir,'test/r1-resource.test.cjs')]);
    else{
      const env={...process.env,ENGINE_MAIN:path.join(root,'rebuild/conform/engines/engine-main.cjs'),
        ENGINE_OLD:path.join(root,'rebuild/conform/engines/engine-old.cjs'),MEASURED_TEST_NOW:'2026-09-03',TZ:'America/New_York'};
      if(!fs.existsSync(env.ENGINE_MAIN)||!fs.existsSync(env.ENGINE_OLD)){
        console.log('R1-REGRESSION BLOCKED (prepare the pinned frozen engine bundles and local fixtures under AGENTS.md)');code=2;
      }else{
        code=execute('R1-ORIGINAL-W5',['rebuild/m3/rigs/run.cjs','--env','local'],env);
        code=code||execute('R1-CONFORMANCE',['rebuild/conform/run.cjs'],env);
        code=code||execute('R1-SELFTEST',['rebuild/conform/run.cjs','--selftest'],env);
        const strictEnv={...env};delete strictEnv.MEASURED_TEST_NOW;
        code=code||execute('R1-STRICT',['scripts/check.mjs','--strict'],strictEnv);
      }
    }
    if(code===1)failed=1;else if(code===2&&failed!==1)failed=2;
    if(!code)console.log('R1-'+step+' PASS');
  }
  if(failed){console.log('R1-COMPLETE '+(failed===1?'FAIL':'BLOCKED')+' (required '+selected+' evidence incomplete)');return failed;}
  if(selected!=='COMPLETE')return 0;
  // A local test cannot approve the versioned cap change. Keep this explicit
  // until independent review publishes the exact successor contract acceptance.
  console.log('R1-COMPLETE BLOCKED (LOWER-CAP versioned successor requires independent acceptance; local implementation checks passed)');
  return 2;
}
module.exports={main};
if(require.main===module)main().then(code=>{process.exitCode=code;}).catch(e=>{console.error('R1-COMPLETE FAIL ('+e.message+')');process.exitCode=1;});
