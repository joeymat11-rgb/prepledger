'use strict';
// COMPOSITION WITNESSES. The adopted candidate's own reached-delegate inventory
// (rebuild/m4/spec/native-next-target-candidate/reach.cjs) is executed over the
// adopted bytes and its result is checked against the runtime's declared
// composition: the two exposed readers must reach neither the seed-owned HISTORY
// nor ROLLUPS provider on any alarm branch, in either the legacy-only or the
// registered-native input, and the runtime must forbid seed/migrate/merge.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const S=require('./native-carriers-source.cjs');
function main(){
 S.verify(root);
 const {COMPOSITION}=require(path.join(root,'rebuild/m4/workout/engine-runtime.cjs'));
 assert.deepEqual(COMPOSITION.forbiddenImports.slice().sort(),['merge.cjs','migrate.cjs','seed.cjs'],'Forbidden runtime imports');
 assert(COMPOSITION.modules.includes('performed'),'The native carrier is composed by the runtime');
 assert.deepEqual(COMPOSITION.exposed.slice().sort(),['genSession','rirPlan'],'Exposed reader surface');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-native-carriers-reach-'));
 const dest=path.join(dir,'reach.json');
 try{
  const env={...process.env,TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',NODE_OPTIONS:'',NODE_V8_COVERAGE:''};
  for(const key of ['PL_ENGINE','PL_LAWS_LIB','CONFORM_MUTATE_LAWS','CONFORM_ADAPTERS_DIR'])delete env[key];
  const r=cp.spawnSync(process.execPath,[path.join(root,'rebuild/m4/spec/native-next-target-candidate/reach.cjs'),dest],{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:900000,maxBuffer:32e6});
  assert(!r.error&&r.status===0,'Reach inventory exit 0');
  const out=JSON.parse(fs.readFileSync(dest,'utf8'));
  assert.equal(out.profile,'earned/engine-runtime-reach/v1','Reach profile');
  assert.deepEqual(out.modules,COMPOSITION.modules,'Reach modules equal the declared composition');
  assert.equal(out.labOrHistoryReached.length,0,'No lab/history delegate reached by the two readers');
  const branches=Object.keys(out.reached);
  assert.equal(branches.length,6,'Three alarm branches on both legacy and native inputs');
  for(const branch of branches){
   assert(out.reached[branch].genSession.length>0,'genSession reached delegates on '+branch);
   assert(out.reached[branch].rirPlan.length>0,'rirPlan reached delegates on '+branch);
  }
  console.log('NATIVE CARRIERS WITNESSES: '+branches.length+'/'+branches.length+' input/alarm branches; '+out.reachedUnion.length+' delegates reached, '+out.writerFunctionsReached.length+' writer functions reached and '+out.writerFunctionsComposedButUnreached+' composed-but-unreached; 0 lab/history reach');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
if(require.main===module){try{main();}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}}
module.exports={main};
