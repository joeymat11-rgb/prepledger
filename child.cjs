'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');const {CaptureController}=require('./controller.cjs');const {SnapshotSink}=require('./snapshot.cjs');const {trackChildren}=require('./owned.cjs');const {verify,environment}=require('./pins.cjs');
const root=__dirname,raw=root+'/raw';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function main(){if(!process.send)throw Error('LAUNCHER_REQUIRED');await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('START_HANDSHAKE_TIMEOUT')),10000);process.once('message',m=>{clearTimeout(timer);m?.kind==='start'?resolve():reject(Error('START_HANDSHAKE_REQUIRED'));});});const claim=JSON.parse(fs.readFileSync(raw+'/ATTEMPT-CLAIM.json'));if(claim.parentPid!==process.ppid||claim.authorization!=='separate-apm-authorization-asserted')throw Error('LAUNCHER_IDENTITY');
  const pins=verify();environment(pins);let terminalResolve;const terminal=new Promise(resolve=>terminalResolve=resolve);
  const controller=new CaptureController({sinkFactory:()=>new SnapshotSink(raw+'/retained.heapsnapshot'),save:report=>{fs.writeFileSync(raw+'/diagnostic.json',JSON.stringify(report,null,2)+'\n');if(['CAPTURED','CAPTURE_UNAVAILABLE','NO_TRIGGER_NONQUALIFICATION'].includes(report.outcome))terminalResolve();}});controller.persist();
  const owned=trackChildren({pins,save:records=>{fs.writeFileSync(raw+'/OWNED-PROCESSES.json',JSON.stringify(records,null,2)+'\n');process.send({kind:'owned',records});},onFailure:code=>controller.fail(code)});
  const context={controller,sourceRoot:pins.sourceRoot,dependencyRoot:pins.dependencyRoot,wsModule:pins.wsModule,
    readPinnedBundle(){const f=pins.bundlePath;if(require('./pins.cjs').hashFile(f)!==pins.bundleSha256)throw Error('BUNDLE_PIN_CHANGED');return fs.readFileSync(f,'utf8');},
    ownedPersistence(){controller.assertIssuance();const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-r1-meter-'));fs.writeFileSync(dir+'/RETAINING-CAPTURE-OWNER.json',JSON.stringify({pid:process.pid,claim:raw+'/ATTEMPT-CLAIM.json',synthetic:true}));fs.writeFileSync(raw+'/OWNED-STATE.json',JSON.stringify({path:dir,pid:process.pid,createdUTC:new Date().toISOString(),originalTemp:os.tmpdir(),synthetic:true},null,2));return dir;},
    registerRuntime(mf){if(context.mf)throw Error('SECOND_RUNTIME_FORBIDDEN');context.mf=mf;},
    verifyRuntimeOwnership:pid=>owned.verify(pid),recordTarget:t=>{controller.report.target={title:t.title,id:t.id,endpointSha256:require('./owned.cjs').sha(t.webSocketDebuggerUrl)};controller.persist();},
    guardDatabase(db){const wrap=object=>new Proxy(object,{get(target,key){const value=Reflect.get(target,key,target);if(typeof value!=='function')return value;return(...args)=>{controller.assertIssuance();const result=value.apply(target,args);return key==='prepare'||key==='bind'?wrap(result):result;};}});return wrap(db);}
  };
  global.__retainingCapture=context;
  process.on('message',m=>{if(m?.kind==='deadline')controller.fail('OVERALL_TIMEOUT');});
  process.on('unhandledRejection',()=>controller.fail('UNHANDLED_REJECTION'));
  const overall=setTimeout(()=>controller.fail('OVERALL_TIMEOUT'),300000);
  let result,runPromise;
  try{const {run}=require('./loader.cjs').loadInstrumented(pins);
    runPromise=run({onProgress:()=>{},outputFile:raw+'/witness-evidence.json'}).then(r=>{result=r;return r;}).catch(()=>{controller.fail('WORKLOAD_HARNESS_FAILED');return null;});
    await Promise.race([runPromise,terminal]);
    if(controller.state==='armed')await controller.workloadFinished();
    else if(['triggered','pausing'].includes(controller.state)&&result)await controller.workloadFinished();
    if(controller.task)await controller.task;
  }catch{controller.fail('SETUP_OR_HARNESS_FAILURE');}
  finally{clearTimeout(overall);await controller.cleanup({dispose:()=>context.mf?.dispose(),meterClose:()=>context.processMeter?.close(),terminate:()=>owned.terminate()});
    if(runPromise)await Promise.race([runPromise,sleep(250)]);
    controller.report.commands=context.session?.commands??[];controller.report.completedAttempts=result?.attempts?.length??null;controller.report.measuredRequests=result?.summary?.requests??null;
    controller.report.naturalCompletionExpected=controller.report.outcome==='NO_TRIGGER_NONQUALIFICATION'?{attempts:4,measuredRequests:159,matched:result?.attempts?.length===4&&result?.summary?.requests===159}:null;
    controller.report.resourceAcceptance=false;controller.persist();owned.restore();process.send({kind:'finished',outcome:controller.report.outcome,resourceAcceptance:false});}
  process.exitCode=0;
}
if(require.main===module)main().then(()=>process.exit(0)).catch(()=>{try{fs.writeFileSync(raw+'/child-setup-failure.json',JSON.stringify({resourceAcceptance:false,outcome:'SETUP_FAILURE'}));}finally{process.exit(2);}});
