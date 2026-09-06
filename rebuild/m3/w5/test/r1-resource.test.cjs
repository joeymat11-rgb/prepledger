'use strict';
// Real local-workerd acceptance experiment. A partial run is never a complete
// resource PASS. Test keys remain only in memory; evidence contains no key DTOs.
const fs=require('node:fs'),path=require('node:path'),{randomBytes}=require('node:crypto');
const {createR1Runtime}=require('./r1-workerd.cjs');
const {createResourceMeter}=require('./r1-resource-meter.cjs');
const {populate}=require('./r1-resource-fixture.cjs');
const {publicKeyOf,verifyRecord}=require('../crypto.cjs');
const C=require('../reconciliation/codec.cjs');
const CEILINGS=Object.freeze({cpuMs:1000,observedAllocationBytes:96*1024*1024,statements:1000,batchMs:30000,domainWrites:0});
const check=(condition,code)=>{if(!condition)throw Error(code);};
const errorText=e=>String(e&&e.message||e).slice(0,320);
const pct=(values,p)=>values.length?[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.ceil(values.length*p)-1)]:null;
async function run({preflightOnly=false,onProgress=message=>console.log(message)}={}){
  const evidence={profile:'earned/r1/resource-local/v1',verdict:'BLOCKED',resourceAcceptance:false,ceilings:CEILINGS,
    requestVersion:C.REQUEST_VERSION,manifestProfile:C.DOMAINS.manifest,payloadCap:C.LIMITS.payload,
    platform:process.platform,phase:'initialization',calibration:[],requests:[],phases:[],violations:[],completedPages:0,
    requiredBoundaryPages:C.LIMITS.pages,requiredOverlapPages:2*C.LIMITS.pages,limitations:[
      'CPU is the owned workerd process user+kernel delta, inclusive of D1, inspector and overlapping requests.',
      'Memory is maximum observed inspector allocation vector, not a universal native-memory bound.',
      'Local observations do not establish remote provider performance, spending limits, T1, K1 or P1.',
    ]};
  let runtime,meter,observing=false,measuredFailure=false;
  const output=path.join(__dirname,'../.generated/r1-resource.json');
  const save=()=>{fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');};
  async function request(route,body,subject='subject-first'){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await fetch(new URL(route,runtime.url),{method:'POST',signal:controller.signal,
        headers:{'Content-Type':'application/json',Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token(subject)},body:JSON.stringify(body)});
      const raw=await response.text();
      return {status:response.status,body:JSON.parse(raw),stats:JSON.parse(response.headers.get('x-r1-test-d1')),responseBytes:Buffer.byteLength(raw)};
    }finally{clearTimeout(timer);}
  }
  async function measuredRequest(label,route,body){
    const measured=await meter.measure(async()=>{try{return await request(route,body);}catch(error){return {failure:errorText(error)};}});
    const result=measured.value,entry={label,cpuMs:measured.cpuMs,cpuGuardMs:evidence.cpuGuardMs,
      guardedCpuMs:measured.cpuMs+evidence.cpuGuardMs,status:result.status??null,responseBytes:result.responseBytes??0,
      stats:result.stats??null,failure:result.failure??null};
    evidence.requests.push(entry);
    if(result.failure){measuredFailure=true;throw Error('RUNTIME_REQUEST_FAILED: '+result.failure);}
    check(Number.isFinite(measured.cpuMs)&&measured.cpuMs>=0,'INVALID_PROCESS_CPU');
    check(result.stats&&!result.stats.missingMeta,'D1_METRICS_UNAVAILABLE');
    const s=result.stats;
    for(const field of ['statements','batches','rowsRead','rowsWritten','queryMs','batchMaxWallMs','domainWrites'])check(Number.isFinite(s[field]),'D1_METRICS_INCOMPLETE');
    if(entry.guardedCpuMs>CEILINGS.cpuMs)evidence.violations.push({label,code:'CPU_CEILING',actual:entry.guardedCpuMs});
    if(s.statements>CEILINGS.statements)evidence.violations.push({label,code:'STATEMENT_CEILING',actual:s.statements});
    if(s.batchMaxWallMs>=CEILINGS.batchMs)evidence.violations.push({label,code:'BATCH_CEILING',actual:s.batchMaxWallMs});
    if(s.domainWrites!==0)evidence.violations.push({label,code:'DOMAIN_WRITE',actual:s.domainWrites});
    return result;
  }
  async function beginPhase(name){evidence.phase=name;const before=await meter.sampleProcess();await meter.begin();observing=true;
    return {name,before,startedRequest:evidence.requests.length};}
  async function endPhase(phase){const memory=await meter.end();observing=false;const after=await meter.sampleProcess();
    const entry={name:phase.name,requestCount:evidence.requests.length-phase.startedRequest,
      wholePhaseCpuMs:(after.cpuTicks-phase.before.cpuTicks)*meter.method.counterTickMs,
      observedPeakBytes:memory.observedPeakBytes,samples:memory.samples,
      processBefore:phase.before,processAfter:after};evidence.phases.push(entry);
    if(memory.observedPeakBytes>CEILINGS.observedAllocationBytes)evidence.violations.push({label:phase.name,code:'OBSERVED_ALLOCATION_CEILING',actual:memory.observedPeakBytes});
    return entry;}
  async function pages(fixture,label){
    const requestDTO={...fixture.request,nonce:randomBytes(32).toString('base64url'),context_id:randomBytes(32).toString('base64url')};
    const requestBytes=C.encode(requestDTO),request_b64=C.encode64(requestBytes),key=publicKeyOf(runtime.authorityKey);
    let continuation=null,manifest,manifestBytes,expectedCount;
    for(let i=0;;i++){
      const response=await measuredRequest(label+'-page-'+i,'/reconcile',{device_id:fixture.deviceId,request_b64,continuation,page_index:i});
      if(response.status!==200){measuredFailure=true;throw Error('R1_BOUNDARY_HTTP_'+response.status+'_'+String(response.body?.error?.code||'UNKNOWN'));}
      const currentBytes=C.decode64(response.body.manifest_b64,C.LIMITS.request),current=C.parse(currentBytes);
      if(i===0){manifest=current;manifestBytes=currentBytes;continuation=response.body.manifest_b64;expectedCount=Math.ceil(fixture.payloadBytes.length/C.LIMITS.page);
        check(verifyRecord(manifest,key,C.DOMAINS.manifest),'MANIFEST_SIGNATURE');
        check(manifest.nonce===requestDTO.nonce&&manifest.context_id===requestDTO.context_id,'MANIFEST_CORRESPONDENCE');
        check(manifest.request_digest===C.hash('request',requestBytes)&&manifest.payload_digest===fixture.payloadDigest,'MANIFEST_BYTE_DIGEST');
        check(manifest.payload_bytes===fixture.payloadBytes.length&&manifest.page_count===expectedCount,'MANIFEST_BOUNDARY_LENGTH');
      }else check(C.sameBytes(currentBytes,manifestBytes),'ORIGINAL_MANIFEST_CHANGED');
      const page=response.body.page;
      check(verifyRecord(page,key,C.DOMAINS.page),'PAGE_SIGNATURE');
      check(page.manifest_digest===C.hash('manifest',manifestBytes)&&page.index===i&&page.offset===i*C.LIMITS.page,'PAGE_BINDING');
      const bytes=C.decode64(page.data_b64,C.LIMITS.page),expected=fixture.payloadBytes.slice(page.offset,page.offset+C.LIMITS.page);
      check(page.bytes===bytes.length&&C.sameBytes(bytes,expected)&&page.page_digest===C.hash('page',bytes),'PAGE_EXACT_BYTES');
      evidence.completedPages++;
      if((i+1)%32===0)onProgress('R1 resource '+label+': '+(i+1)+'/'+expectedCount+' actual pages measured');
      if(i+1===expectedCount)return expectedCount;
    }
  }
  try{
    runtime=await createR1Runtime();meter=await createResourceMeter(runtime.mf,runtime.name);evidence.method=meter.method;
    evidence.cpuGuardMs=process.platform==='win32'?32:2*meter.method.counterTickMs;
    const calibration=await beginPhase('instrument-calibration');
    for(let i=0;i<3;i++){
      const result=await meter.measure(async()=>{const r=await fetch(new URL('/__r1-meter-calibration',runtime.url));return {status:r.status,value:await r.json()};});
      check(result.value.status===200&&result.value.value.bytes===8*1024*1024&&Number.isFinite(result.cpuMs)&&result.cpuMs>0,'CPU_CALIBRATION_UNAVAILABLE');
      evidence.calibration.push({cpuMs:result.cpuMs,bytes:result.value.value.bytes});
    }
    await endPhase(calibration);
    onProgress('R1 resource instrumentation calibrated; preparing exact synthetic D1 boundary');
    evidence.phase='fixture-preparation';
    const fixture=await populate({db:runtime.db,bridge:runtime.bridge,identityKey:runtime.identityKeys.first,
      athleteId:'first',subject:'subject-first',trustedContext:{issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0]},
      targetBytes:preflightOnly?262144:C.LIMITS.payload,foreign:{athleteId:'second',subject:'subject-second',identityKey:runtime.identityKeys.second}});
    evidence.population=fixture.population;evidence.fixtureBytes=fixture.payloadBytes.length;evidence.acceptedSyntheticFacts=fixture.acceptedSyntheticFacts;
    save();
    const sequential=await beginPhase(preflightOnly?'preflight':'boundary-sequential');
    const completed=await pages(fixture,'sequential');await endPhase(sequential);evidence.sequentialPages=completed;save();
    if(preflightOnly){evidence.verdict=evidence.violations.length?'FAIL':'PREFLIGHT';return evidence;}
    check(completed===C.LIMITS.pages,'BOUNDARY_PAGE_COUNT');
    const overlapping=await beginPhase('two-overlapping-complete-attempts');
    const counts=await Promise.all([pages(fixture,'overlap-a'),pages(fixture,'overlap-b')]);
    await endPhase(overlapping);evidence.overlapPages=counts;save();
    const oversized=await fixture.applyTarget(C.LIMITS.payload+1);evidence.oversizePopulation=oversized.population;
    const overPhase=await beginPhase('oversize-typed-refusal');
    const refusal=await measuredRequest('oversize-plus-one','/reconcile',{device_id:oversized.deviceId,
      request_b64:C.encode64(oversized.requestBytes),continuation:null,page_index:0});
    check(refusal.status===413&&refusal.body?.error?.code==='RECONCILE_LIMIT','OVERSIZE_NOT_TYPED_REFUSAL');
    await endPhase(overPhase);evidence.oversizeRefusal='413 RECONCILE_LIMIT';
    check(counts.every(n=>n===C.LIMITS.pages),'OVERLAP_PAGE_COUNT');
    evidence.verdict=evidence.violations.length?'FAIL':'PASS';evidence.resourceAcceptance=evidence.verdict==='PASS';return evidence;
  }catch(error){
    evidence.failure={phase:evidence.phase,message:errorText(error)};
    const instrumentationFailure=['initialization','instrument-calibration'].includes(evidence.phase)||
      /^(?:D1_METRICS_|INVALID_PROCESS_CPU)|inspector metric|allocation vector|process meter/.test(errorText(error));
    evidence.verdict=!measuredFailure&&instrumentationFailure&&!evidence.violations.length?'BLOCKED':'FAIL';
    evidence.resourceAcceptance=false;return evidence;
  }finally{
    if(observing&&meter){try{const m=await meter.end();evidence.incompletePhaseMemory={observedPeakBytes:m.observedPeakBytes,samples:m.samples};}catch(e){evidence.memoryFailure=errorText(e);}}
    const measurements=evidence.requests.filter(r=>r.status!==null);
    evidence.summary={requests:measurements.length,maxCpuMs:measurements.length?Math.max(...measurements.map(r=>r.guardedCpuMs)):null,
      p95CpuMs:pct(measurements.map(r=>r.guardedCpuMs),.95),rowsRead:measurements.reduce((n,r)=>n+(r.stats?.rowsRead||0),0),
      rowsWritten:measurements.reduce((n,r)=>n+(r.stats?.rowsWritten||0),0),queryMs:measurements.reduce((n,r)=>n+(r.stats?.queryMs||0),0),
      maxStatements:measurements.length?Math.max(...measurements.map(r=>r.stats?.statements||0)):null,
      domainWrites:measurements.reduce((n,r)=>n+(r.stats?.domainWrites||0),0)};
    evidence.finishedUTC=new Date().toISOString();save();
    if(meter)await meter.close().catch(()=>{});if(runtime)await runtime.close().catch(()=>{});
  }
}
module.exports={run,CEILINGS};
if(require.main===module)run({preflightOnly:process.argv.includes('--preflight')}).then(result=>{
  console.log('R1-RESOURCE '+result.verdict+' — '+result.completedPages+' actual pages; '+result.violations.length+' resource violations'+
    (result.failure?'; '+result.failure.phase+': '+result.failure.message:''));
  process.exitCode=result.verdict==='PASS'||result.verdict==='PREFLIGHT'?0:result.verdict==='BLOCKED'?2:1;
}).catch(()=>{console.error('R1-RESOURCE FAIL — harness termination');process.exitCode=1;});
