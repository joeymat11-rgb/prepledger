'use strict';
const {performance}=require('node:perf_hooks');
const LIMIT=100663296,TITLE='workerd: worker core:user:earned-r1-metered-application';
function vector(h){const names=['usedSize','totalSize','embedderHeapUsedSize','backingStorageSize'];if(!names.every(n=>Number.isFinite(h[n])&&h[n]>=0))throw Error('VECTOR_INVALID');return Object.fromEntries([...names.map(n=>[n,h[n]]),['observedAllocation',h.totalSize+h.embedderHeapUsedSize+h.backingStorageSize]]);}
function selectTarget(targets){const matches=targets.filter(t=>typeof t.title==='string'&&t.title.includes('earned-r1-metered-application'));if(matches.length!==1||matches[0].title!==TITLE)throw Error('TARGET_AMBIGUOUS');const u=new URL(matches[0].webSocketDebuggerUrl);if(u.protocol!=='ws:'||!['127.0.0.1','localhost','[::1]'].includes(u.hostname))throw Error('TARGET_NOT_LOOPBACK');return matches[0];}
class CaptureController {
  constructor({save=()=>{},now=()=>performance.now(),sinkFactory,bounds={}}={}){
    this.now=now;this.save=save;this.sinkFactory=sinkFactory;this.bounds={pause:5000,capture:30000,command:5000,cleanup:10000,cleanupStep:1000,...bounds};this.state='armed';this.active=new Map();this.nextRequest=0;this.phase='initialization';this.phaseIndex=-1;this.sampleIndex=0;this.aborters=new Set();this.session=null;this.paused=false;this.cleaning=false;this.task=null;
    this.report={resourceAcceptance:false,diagnosticOnly:true,outcome:'NOT_RUN',snapshotUsable:false,trigger:null,preSnapshot:null,postSnapshot:null,events:[],requests:[],lateChunks:0,lateResponses:0,failures:[],limits:{threshold:LIMIT,pauseMs:5000,captureMs:30000,outputBytes:268435456,overallMs:300000,cleanupMs:10000},interpretation:'Snapshot induces collection and conservative paused roots. This cannot qualify capacity or rule out earlier transients/unmeasured native memory.'};
  }
  persist(){if(this.writeFailed)return;try{this.save(this.report);}catch{this.writeFailed=true;this.fail('DIAGNOSTIC_ARTIFACT_WRITE_FAILED');}}
  event(kind,details={}){this.report.events.push({kind,atMs:this.now(),...details});this.persist();}
  attach(session,isolate){if(this.session||!isolate)throw Error('ISOLATE_SETUP');this.session=session;this.isolate=isolate;this.report.isolateId=isolate;
    session.on('Debugger.paused',p=>{if(this.state!=='pausing'){this.fail('UNEXPECTED_PAUSE');return;}this.paused=true;this.stopIssuance('PAUSED');this.event('paused',{frames:(p.callFrames||[]).slice(0,32).map(f=>({scriptId:f.location?.scriptId??null,lineNumber:f.location?.lineNumber??null,columnNumber:f.location?.columnNumber??null,url:/^(?:file:|https?:)/.test(f.url||'')?'(public location requires offline bundle mapping)':String(f.url||'').slice(0,200),functionName:'(not collected)'}))});this.pauseResolve?.();});
    session.on('Debugger.resumed',()=>{this.paused=false;if(!this.cleaning&&this.state!=='terminal')this.fail('UNEXPECTED_RESUME');});
    session.on('HeapProfiler.addHeapSnapshotChunk',p=>{if(this.state!=='capturing'||this.commandComplete){this.report.lateChunks++;this.report.snapshotUsable=false;if(!this.cleaning)this.fail('LATE_SNAPSHOT_CHUNK');else{this.report.outcome='CAPTURE_UNAVAILABLE';this.report.failures.push({code:'LATE_SNAPSHOT_CHUNK',atMs:this.now()});this.persist();}return;}try{this.sink.chunk(p.chunk);}catch(e){this.fail(e.message);}});
    session.on('HeapProfiler.reportHeapSnapshotProgress',p=>{if(this.state==='capturing'){this.progress={done:p.done,total:p.total,finished:p.finished===true};}});
    session.on('failure',code=>{if(!this.cleaning)this.fail(code);});session.on('lateResponse',()=>{this.report.lateResponses++;this.persist();});
  }
  stopIssuance(reason){this.stopped=true;this.report.issuanceStopped??={reason,atMs:this.now(),activeRequestIds:[...this.active.keys()]};}
  assertIssuance(){if(this.stopped||this.state==='terminal')throw Error('DIAGNOSTIC_REQUEST_ISSUANCE_STOPPED');}
  registerAborter(aborter){this.assertIssuance();this.aborters.add(aborter);return()=>this.aborters.delete(aborter);}
  async request(label,action){this.assertIssuance();const id=++this.nextRequest,entry={id,label,phase:this.phase,startedMs:this.now(),status:'in-flight'};this.active.set(id,entry);this.report.requests.push(entry);
    try{const result=await action();entry.status='completed';return result;}catch(e){entry.status='failed';entry.errorClass=e?.name==='AbortError'?'AbortError':'request-failed';throw e;}finally{entry.finishedMs=this.now();this.active.delete(id);this.persist();}}
  setPhase(phase){this.phase=phase;this.phaseIndex++;this.sampleIndex=0;}
  observe(h,label,commandId=null){const sample={...vector(h),label,phase:this.phase,phaseIndex:this.phaseIndex,sampleIndex:this.sampleIndex++,inspectorCommandId:commandId,atMs:this.now(),activeRequestIds:[...this.active.keys()]};
    if(this.state==='armed'&&sample.observedAllocation>LIMIT){this.state='triggered';this.report.trigger=sample;this.report.outcome='TRIGGERED';this.persist();}
    return sample;
  }
  launchAfterObservationDrained(){if(this.state!=='triggered'||this.task)return;this.task=this.capture().catch(e=>this.fail(e.message));}
  async bound(work,ms,code){let timer;const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{this.fail(code);reject(Error(code));},ms);});try{return await Promise.race([Promise.resolve().then(work),timeout,this.cancelPromise??new Promise(()=>{})]);}finally{clearTimeout(timer);}}
  fail(code){if(this.cleaning)return;if(this.state==='terminal'&&this.report.outcome!=='CAPTURED')return;this.state='terminal';this.report.outcome='CAPTURE_UNAVAILABLE';this.report.snapshotUsable=false;this.report.failures.push({code:/^[A-Z0-9_]+$/.test(code)?code:'DIAGNOSTIC_COMMAND_FAILURE',atMs:this.now()});this.stopIssuance('ABORTED');for(const a of this.aborters)a.abort();if(this.sink)this.report.partialSnapshot={bytes:this.sink.bytes,chunks:this.sink.chunks,usable:false};this.sink?.close();this.cancelReject?.(Error('DIAGNOSTIC_ABORTED'));this.persist();}
  async capture(){this.cancelPromise=new Promise((_,reject)=>{this.cancelReject=reject;});this.cancelPromise.catch(()=>{});
    await this.session.drain();if(this.state!=='triggered')return;this.state='pausing';
    const paused=new Promise(resolve=>{this.pauseResolve=resolve;});
    await this.bound(async()=>{await this.session.command('Debugger.enable',{maxScriptsCacheSize:0},this.bounds.pause);if(this.state==='terminal')throw Error('DIAGNOSTIC_ABORTED');await this.session.command('Debugger.pause',{},this.bounds.pause);await paused;},this.bounds.pause,'PAUSE_TIMEOUT');
    if(!this.paused||this.state==='terminal')throw Error('PAUSE_NOT_ESTABLISHED');this.state='paused';
    const identity=await this.bound(()=>this.session.command('Runtime.getIsolateId'),this.bounds.command,'IDENTITY_TIMEOUT');if(identity.id!==this.isolate)throw Error('ISOLATE_CHANGED');
    this.report.preSnapshot={...vector(await this.bound(()=>this.session.command('Runtime.getHeapUsage'),this.bounds.command,'PRE_VECTOR_TIMEOUT')),atMs:this.now()};
    if(!this.paused||this.state==='terminal')throw Error('PAUSE_LOST');this.report.thresholdDrift=this.report.preSnapshot.observedAllocation<=LIMIT;this.sink=this.sinkFactory();this.state='capturing';this.report.snapshotCommands=1;this.event('snapshot-started');
    await this.bound(async()=>{await this.session.command('HeapProfiler.takeHeapSnapshot',{reportProgress:true,captureNumericValue:false,exposeInternals:true},this.bounds.capture);this.commandComplete=true;},this.bounds.capture,'SNAPSHOT_TIMEOUT');
    if(this.state!=='capturing'||!this.paused)throw Error('SNAPSHOT_INTERRUPTED');
    this.report.snapshot=this.sink.finish();this.report.progress=this.progress??null;
    // A response plus complete JSON is required; final progress is recorded,
    // never substituted for response/chunk completion or JSON validation.
    this.state='post-snapshot';this.report.postSnapshot={...vector(await this.bound(()=>this.session.command('Runtime.getHeapUsage'),this.bounds.command,'POST_VECTOR_TIMEOUT')),atMs:this.now()};
    if(!this.paused||this.state==='terminal')throw Error('PAUSE_LOST');this.report.outcome='CAPTURED';this.report.snapshotUsable=true;this.state='terminal';this.stopIssuance('CAPTURE_COMPLETE');for(const a of this.aborters)a.abort();this.persist();
  }
  async workloadFinished(){if(this.state==='armed'){this.state='terminal';this.report.outcome='NO_TRIGGER_NONQUALIFICATION';this.stopIssuance('WORKLOAD_COMPLETE');this.persist();}else if(['triggered','pausing'].includes(this.state)){this.fail('WORKLOAD_COMPLETED_BEFORE_PAUSE');}if(this.task)await this.task;}
  async cleanup({dispose=async()=>{},meterClose=async()=>{},terminate=async()=>{}}={}){this.cleaning=true;this.stopIssuance('CLEANUP');for(const a of this.aborters)a.abort();this.sink?.close();const deadline=this.now()+this.bounds.cleanup;this.report.cleanup=[];
    const step=async(name,fn,limit=this.bounds.cleanupStep)=>{let timer;try{await Promise.race([Promise.resolve().then(fn),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),Math.max(1,Math.min(limit,deadline-this.now())));})]);this.report.cleanup.push({name,ok:true});}catch{this.report.cleanup.push({name,ok:false});}finally{clearTimeout(timer);}};
    if(this.session){await step('resume',()=>this.session.command('Debugger.resume',{},this.bounds.cleanupStep));await step('disable',()=>this.session.command('Debugger.disable',{},this.bounds.cleanupStep));await step('inspector-close',()=>this.session.close());}
    await step('meter-close',meterClose);await step('runtime-dispose',dispose,Math.max(1,deadline-this.now()-this.bounds.cleanupStep));await step('owned-termination-if-needed',terminate,Math.max(1,deadline-this.now()));this.persist();}
}
module.exports={CaptureController,selectTarget,vector,LIMIT,TITLE};
