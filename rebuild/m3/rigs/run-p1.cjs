'use strict';
// Reuse original assertions; explicitly select encrypted storage on every D1
// authority and capability fixture. No environment-only simulation of P1.
const assert=require('node:assert/strict');
const {provision,createTestStorage}=require('./p1-test-profile.cjs');
async function main(){
  await require('../w5/build.cjs').buildCore();
  const storage=await createTestStorage();
  const createBridge=config=>require('../w5/bridge.cjs').createBridge({...config,storage});
  const createLocalD1=async()=>{
    const r=await require('../w5/local-d1.cjs').createLocalD1();
    try{await provision(r.db);return r;}catch(e){await r.close();throw e;}
  };
  const makeHarness=options=>require('./test-adapter.cjs').makeHarness({...options,createLocalD1,createBridge});
  const harness=await makeHarness();let mapped;
  try{mapped=await require('./sheet-a-async.cjs').runMapped(harness.bundle);}finally{await harness.close();}
  assert.equal(mapped.total,34);assert.equal(mapped.green,34);assert.equal(mapped.errors,0);
  console.log('P1 AUTH-MAPPED PASS 34/34 through encrypted local D1');
  const mutations=await require('./rig191.cjs').runRig191({makeHarness});
  assert.equal(mutations.effective,10);assert.equal(mutations.ok,true);
  console.log('P1 RIG191 PASS 10/10 EFFECTIVE breaks through encrypted local D1');
  const runtime=await createLocalD1();
  try{const result=await require('./rig190.cjs').run({runtime,createBridge,quiet:true});
    assert.equal(result.passed,5);assert.equal(result.scenarios,5);assert.equal(result.http,'real-local');
  }finally{await runtime.close();}
  console.log('P1 HTTP-190 PASS 5/5 over real local HTTP with C6 cuts');
  const smoke=await require('./worker-smoke.cjs').run({p1:true});
  assert.equal(smoke.ok,true);assert.equal(smoke.runtime,'workerd');
  console.log('P1 WORKER-CRYPTO PASS native workerd AES-KW/AES-GCM + authenticated HTTP');
  const race=await require('./race-d1.cjs').run({p1:true});
  assert.equal(race.ok,true);assert.equal(race.invocations,100);assert.equal(race.lostReply,true);
  console.log('P1 WORKER-RACE PASS 100 independent invocations + ownership + waiting drain + every crash cut + disk reopen');
}
module.exports={main};
if(require.main===module)main().catch(e=>{console.error('P1 RIGS FAIL',e);process.exitCode=1;});
