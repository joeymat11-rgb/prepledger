'use strict';
const {createRequire}=require('node:module');
const {connect}=require('./session.cjs');const {selectTarget}=require('./controller.cjs');
async function measureWithProcess(controller,processMeter,action){controller.assertIssuance();const before=await processMeter.sample();controller.assertIssuance();const value=await action();const after=await processMeter.sample();return {value,cpuMs:(after.cpuTicks-before.cpuTicks)*processMeter.tickMs,before,after};}
async function createResourceMeter(mf,workerName){const context=global.__retainingCapture;if(!context)throw Error('DIAGNOSTIC_CONTEXT_REQUIRED');const {controller,sourceRoot,dependencyRoot}=context;
  const {ownedProcessMeter}=require(sourceRoot+'/rebuild/m3/w5/test/r1-resource-meter.cjs');const dependencies=createRequire(dependencyRoot+'/package.json');
  let processMeter,session,observing=false,observations=[],observer,observationFailure;
  try{
    processMeter=await ownedProcessMeter();context.processMeter=processMeter;await context.verifyRuntimeOwnership(processMeter.pid);
    const inspector=await mf.getInspectorURL();inspector.protocol='http:';const u=new URL('/json',inspector);if(!['127.0.0.1','localhost','[::1]'].includes(u.hostname))throw Error('INSPECTOR_NOT_LOOPBACK');
    const targets=await(await fetch(u,{signal:AbortSignal.timeout(5000)})).json();const target=selectTarget(targets);context.recordTarget(target);
    session=await connect(require(context.wsModule),target.webSocketDebuggerUrl);context.session=session;
    await session.command('Runtime.enable');const isolate=await session.command('Runtime.getIsolateId');controller.attach(session,isolate.id);
    async function observe(label){if(controller.state!=='armed')return null;const h=await session.command('Runtime.getHeapUsage');const sample=controller.observe(h,label,session.sequence);observations.push(sample);
      if(controller.state==='triggered'){observing=false;controller.launchAfterObservationDrained();}return h;}
    return {
      method:{platform:processMeter.platform,counterTickMs:processMeter.tickMs,cpu:'Original owned workerd process user+kernel delta; overlapping work included',memory:'maximum observed simultaneous totalSize + embedderHeapUsedSize + backingStorageSize; original four-field vector',overlap:'Original per-request windows; never sum overlapping windows'},
      sampleProcess:processMeter.sample,observe,
      async begin(){controller.assertIssuance();observations=[];observationFailure=null;observing=true;await observe('start');observer=(async()=>{while(observing){try{await observe('periodic');}catch{observationFailure='OBSERVATION_FAILED';observing=false;controller.fail(observationFailure);}if(observing)await new Promise(r=>setTimeout(r,5));}})();},
      measure:action=>measureWithProcess(controller,processMeter,action),
      async end(){observing=false;if(observer)await observer;if(controller.state==='armed')await observe('end');if(observationFailure)throw Error(observationFailure);return {observedPeakBytes:observations.reduce((m,x)=>Math.max(m,x.observedAllocation),0),samples:observations};},
      async close(){observing=false;if(observer)await observer;}
    };
  }catch(e){controller.fail('METER_SETUP_FAILED');if(session)session.close();if(processMeter)await processMeter.close();throw e;}
}
module.exports={createResourceMeter,measureWithProcess};
