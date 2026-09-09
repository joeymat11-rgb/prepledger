'use strict';
// Dependency-injected lifecycle used by launch.cjs and synthetic process tests.
// A fresh ChildProcess object from our spawn is positive ownership even when
// CIM is unavailable. PID-only fallback and name-based kills are forbidden.
async function supervise({spawn,identity,killVerified,writeActual,writeResult,parentPid,notify=()=>{},runtimeMs=300000,cleanupMs=10000}){
  let child,record,doneResolve,cleanupTimer,finished=false,diagnosticOutcome=null,timedOut=false,exit=false,errorCode=null;const owned=[],cleanupFailures=[];
  const done=new Promise(resolve=>doneResolve=resolve);
  const directStop=()=>{if(child&&!exit&&child.exitCode===null&&child.signalCode===null){try{child.kill('SIGKILL');}catch{cleanupFailures.push({role:'controller',code:'DIRECT_HANDLE_KILL_FAILED'});}}};
  const stopOwned=()=>{for(const r of owned)try{killVerified(r);}catch{cleanupFailures.push({pid:r.pid,code:'OWNED_CLEANUP_FAILED'});}};
  // Deadline exists before the first spawn. Setup cannot leave an unbounded child.
  const deadline=setTimeout(()=>{timedOut=true;try{child?.send({kind:'deadline'},()=>{});}catch{}cleanupTimer=setTimeout(()=>{stopOwned();directStop();doneResolve();},cleanupMs);},runtimeMs);
  const progress=setInterval(notify,30000);
  try{
    child=spawn();
    child.once('exit',()=>{exit=true;doneResolve();});child.once('error',()=>{errorCode='CONTROLLER_SPAWN_FAILURE';doneResolve();});
    child.on('message',m=>{if(m?.kind==='owned')for(const r of m.records||[]){if(r.parent===child.pid&&['workerd','counter-helper'].includes(r.role)&&!owned.some(x=>x.pid===r.pid&&x.created===r.created))owned.push(r);}if(m?.kind==='finished'){finished=true;diagnosticOutcome=m.outcome;}});
    record=identity(child.pid);if(!record||record.parent!==parentPid)throw Error('CONTROLLER_OWNERSHIP_SETUP');
    writeActual(record);
    // Child waits for this handshake; ownership/write failures start no workload.
    child.send({kind:'start'},e=>{if(e){errorCode='CONTROLLER_START_FAILURE';directStop();doneResolve();}});
    await done;
  }catch(e){errorCode=/^[A-Z0-9_]+$/.test(e.message)?e.message:'CONTROLLER_SETUP_FAILURE';}
  finally{clearTimeout(deadline);clearTimeout(cleanupTimer);clearInterval(progress);stopOwned();directStop();}
  const result={resourceAcceptance:false,finished,diagnosticOutcome,timedOut,errorCode,cleanupFailures};writeResult(result);return result;
}
module.exports={supervise};
