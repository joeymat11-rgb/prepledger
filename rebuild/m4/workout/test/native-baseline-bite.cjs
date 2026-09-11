'use strict';
// Fault only a disposable child process's compilation of the actual registrar.
// No source file or authoritative fact is edited on disk.
const {readFileSync}=require('node:fs'),{resolve}=require('node:path');
const {spawnSync}=require('node:child_process');
const assert=require('node:assert/strict');
const target=resolve(__dirname,'../source-projection.cjs');
if(process.env.EARNED_NATIVE_BASELINE_BITE==='1'){
 const Module=require('node:module'),original=Module._extensions['.cjs']||Module._extensions['.js'];
 const load=(module,file)=>{
  if(file!==target)return original(module,file);
  const source=readFileSync(file,'utf8'),needle='const derived=projectNativeBaseline({state,workoutFacts,day});';
  assert.equal(source.split(needle).length,2);
  module._compile(source.replace(needle,"const derived={state:structuredClone(state),baseline:{profile:'earned/native-baseline/v1',decisions:[],future_start_ids:[]}};"),file);
 };
 Module._extensions['.cjs']=load;
}else{
 const result=spawnSync(process.execPath,['--require',__filename,'--test',resolve(__dirname,'native-baseline-journey.test.mjs')],{
  encoding:'utf8',env:{...process.env,EARNED_NATIVE_BASELINE_BITE:'1'},timeout:60000});
 assert.equal(result.status,1,result.stdout+result.stderr);
 assert.match(result.stdout+result.stderr,/native join must leave debut/);
 console.log('NATIVE BASELINE BITE PASS: removing the actual registrar join makes the C4 fresh journey fail at day+3 debut.');
}
