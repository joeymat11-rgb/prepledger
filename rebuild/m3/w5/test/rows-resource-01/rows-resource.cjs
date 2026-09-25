'use strict';
// ROWS-V3 REPLACEMENT-ROUTE RESOURCE QUALIFICATION WRAPPER — test-only.
//
// Drives the implemented /reconcile/rows route with the UNCHANGED actual
// Worker, D1, P1, signing, runtime and meter modules. Nothing in this file
// edits, wraps or substitutes a product module: it composes the existing
// r1-workerd runtime, the existing r1-resource-meter and the existing
// r1-resource-fixture, and measures the new route with the ORIGINAL formula.
//
// Preserved verbatim from the old profile's acceptance experiment:
//   * simultaneous totalSize + embedderHeapUsedSize + backingStorageSize,
//   * 96 MiB observed-allocation ceiling, 1000 CPU ms, 1000 statements,
//     each batch below 30 s, zero reconciliation domain writes,
//   * default pinned runtime, no V8 flags, no forced collection, no heap
//     limit, no per-page runtime restart, no CPU-to-wall-time substitution,
//     no hidden warmup and no changed sample formula.
//
// A PASS here is a LOCAL SERVER result for the rows-v3 route only. It is not
// client memory, not complete staged-profile validation, not atomic
// activation, not current permission, not phone fit, not private recovery,
// and never an old-profile (/reconcile) PASS.
const fs=require('node:fs'),path=require('node:path'),{randomBytes,createHash,webcrypto}=require('node:crypto');
const {createR1Runtime}=require('../r1-workerd.cjs');
const {createResourceMeter}=require('../r1-resource-meter.cjs');
const {populate}=require('../r1-resource-fixture.cjs');
const {build}=require('../../../../client/ops.cjs');
const {createDatabaseStorage}=require('../../storage/database.cjs');
const {validateRetained}=require('../../reconciliation/project.cjs');
const Sign=require('../../crypto.cjs');
const C=require('../../reconciliation/codec.cjs'),P=require('../../reconciliation/paged-codec.cjs');

// The original agreed ceilings, unchanged. Never lowered to obtain a result
// and never raised to award one.
const CEILINGS=Object.freeze({cpuMs:1000,observedAllocationBytes:96*1024*1024,statements:1000,batchMs:30000,domainWrites:0});
const MAX_CHUNKS=4096;                 // Loop bound only; never a success condition.
const LARGE_FACT_PADDING=65536;        // Same order as the reused old fixture's own padding.
const SMALL_FACT_PADDING=64;           // Drives 32-row-bound pages.
const LARGE_EXTENSION_FACTS=24;        // Pushes complete history far past the old 1 MiB cap.
const SMALL_EXTENSION_FACTS=100;

const check=(condition,code)=>{if(!condition)throw Error(code);};
const errorText=e=>String(e&&e.message||e).slice(0,320);
const pct=(v,p)=>v.length?[...v].sort((a,b)=>a-b)[Math.min(v.length-1,Math.ceil(v.length*p)-1)]:null;
const digestNonce=label=>P.hash('rows-resource-nonce',[label,randomBytes(32).toString('base64url')]);

// ---------------------------------------------------------------------------
// Pure evaluation. Exported so the focused adapter test can calibrate that an
// exceeded limit is DETECTED rather than silently passed.
// ---------------------------------------------------------------------------
function requestViolations(ceilings,entry){
  const out=[],s=entry.stats;
  if(entry.guardedCpuMs>ceilings.cpuMs)out.push({label:entry.label,code:'CPU_CEILING',actual:entry.guardedCpuMs});
  if(s&&s.statements>ceilings.statements)out.push({label:entry.label,code:'STATEMENT_CEILING',actual:s.statements});
  if(s&&s.batchMaxWallMs>=ceilings.batchMs)out.push({label:entry.label,code:'BATCH_CEILING',actual:s.batchMaxWallMs});
  if(s&&s.domainWrites!==ceilings.domainWrites)out.push({label:entry.label,code:'DOMAIN_WRITE',actual:s.domainWrites});
  return out;
}
function phaseViolations(ceilings,phase){
  return phase.observedPeakBytes>ceilings.observedAllocationBytes
    ?[{label:phase.name,code:'OBSERVED_ALLOCATION_CEILING',actual:phase.observedPeakBytes}]:[];
}
const verdictFor=violations=>violations.length?'FAIL':'PASS';

// QUALIFICATION ELIGIBILITY. A verdict of PASS is necessary but NOT sufficient
// for resourceAcceptance. A diagnostic, partial or relaxed configuration —
// skipped valid-account attempts, altered ceilings, non-default workload counts,
// a missing or incomplete required attempt — can produce a green verdict over a
// workload that was never the qualification workload, so it must never be able
// to award the acceptance flag. Pure and exported so the focused adapter tests
// can regress a PASSING near-only configuration.
function qualificationEligibility({ceilings,skipValidAccountAttempts,largeExtensionFacts,smallExtensionFacts,
  observeBoundaries,attempts=[],verdict}={}){
  const reasons=[],keys=Object.keys(CEILINGS);
  if(!ceilings||Object.keys(ceilings).length!==keys.length||!keys.every(k=>ceilings[k]===CEILINGS[k]))
    reasons.push('CEILINGS_NOT_ORIGINAL');
  if(skipValidAccountAttempts)reasons.push('VALID_ACCOUNT_ATTEMPTS_SKIPPED');
  // Extra boundary observations add inspector round-trips and extra samples
  // inside the measured window; they can only raise the observed peak, so an
  // instrumented run is diagnostic and can never carry the acceptance flag.
  if(observeBoundaries)reasons.push('BOUNDARY_OBSERVATION_ENABLED');
  if(largeExtensionFacts!==LARGE_EXTENSION_FACTS||smallExtensionFacts!==SMALL_EXTENSION_FACTS)
    reasons.push('WORKLOAD_COUNTS_NOT_DEFAULT');
  const complete=a=>Boolean(a)&&a.signedTerminalFinish===true&&a.byteIdentityAgainstIndependentD1Read===true;
  const sequential=attempts.filter(a=>a.label==='sequential');
  const overlapping=attempts.filter(a=>a.label==='overlap-a'||a.label==='overlap-b');
  if(sequential.length!==1||!complete(sequential[0]))reasons.push('SEQUENTIAL_ATTEMPT_INCOMPLETE');
  if(overlapping.length!==2||!overlapping.every(complete))reasons.push('OVERLAPPING_ATTEMPTS_INCOMPLETE');
  if(verdict!=='PASS')reasons.push('VERDICT_NOT_PASS');
  return {eligible:reasons.length===0,reasons,
    requires:'the original ceilings, the default workload counts, one complete sequential attempt and two complete '+
      'overlapping attempts each reaching a signed terminal finish with independent byte identity, and no ceiling violation'};
}

// ---------------------------------------------------------------------------
// Bounded streaming consumer. Every returned row is decoded and folded into a
// length-framed running digest; rows are NOT retained. This is a realistic
// consumer, not a no-op: an unread or undecoded body would not reach here.
// ---------------------------------------------------------------------------
function createInventoryFold(){
  const hash=createHash('sha256');let rows=0,bytes=0;
  const field=part=>{const len=Buffer.alloc(8);len.writeBigUInt64BE(BigInt(part.length));hash.update(len);hash.update(part);};
  return {
    fold(collection,rowIdBytes,valueBytes){
      field(Buffer.from(collection,'utf8'));field(Buffer.from(rowIdBytes));field(Buffer.from(valueBytes));
      rows++;bytes+=rowIdBytes.length+valueBytes.length;
    },
    result(){return {digest:hash.copy().digest('base64url'),rows,bytes};},
  };
}
// Refuses incomplete or invalid recovery instead of reporting success.
function assertCompleteInventory({manifest,cumulativeCounts,observed,expected}){
  check(Array.isArray(cumulativeCounts)&&cumulativeCounts.length===manifest.collection_counts.length,'ROWS_COUNT_SHAPE');
  for(let i=0;i<cumulativeCounts.length;i++)
    check(cumulativeCounts[i]===manifest.collection_counts[i][1],'ROWS_INCOMPLETE_'+manifest.collection_counts[i][0]);
  check(observed.rows===expected.rows,'ROWS_COUNT_MISMATCH');
  check(observed.bytes===expected.bytes,'ROWS_BYTE_COUNT_MISMATCH');
  check(observed.digest===expected.digest,'ROWS_BYTE_IDENTITY_MISMATCH');
  return true;
}

// ---------------------------------------------------------------------------
// PEAK LOCALIZATION (diagnostic). The meter's periodic samples carry no
// timestamps, so only ORDER is available -- never interval duration. Labelled
// boundary observations taken at request edges partition the ordered sample
// list, so each periodic sample can be attributed to the interval it fell in.
// A sample can be placed before / within / after a given chunk; it cannot be
// placed in time within that interval.
// ---------------------------------------------------------------------------
const BOUNDARY=/^(?:before|after):/;
function summarizeIntervals(samples){
  const intervals=[];
  let current={from:'phase-start',samples:0,peak:0,peakIndex:-1,peakLabel:null,firstIndex:0};
  const close=()=>{if(current.samples)intervals.push(current);};
  samples.forEach((sample,index)=>{
    if(BOUNDARY.test(sample.label)){close();current={from:sample.label,samples:0,peak:0,peakIndex:-1,peakLabel:null,firstIndex:index};}
    if(sample.observedAllocation>current.peak){current.peak=sample.observedAllocation;current.peakIndex=index;current.peakLabel=sample.label;}
    current.samples++;current.lastIndex=index;
  });
  close();
  return intervals;
}
function locatePeak(samples){
  const intervals=summarizeIntervals(samples);
  let peakIndex=-1,peak=-1;
  samples.forEach((s,i)=>{if(s.observedAllocation>peak){peak=s.observedAllocation;peakIndex=i;}});
  const sample=samples[peakIndex],owner=intervals.find(i=>peakIndex>=i.firstIndex&&peakIndex<=i.lastIndex);
  const before=[...samples.slice(0,peakIndex)].reverse().find(s=>BOUNDARY.test(s.label));
  const after=samples.slice(peakIndex+1).find(s=>BOUNDARY.test(s.label));
  const inRequest=Boolean(before&&before.label.startsWith('before:')&&after&&after.label.startsWith('after:')&&
    before.label.slice(7)===after.label.slice(6));
  return {
    observedPeakBytes:peak,peakSampleIndex:peakIndex,totalSamples:samples.length,
    peakSampleLabel:sample?.label??null,peakSampleIsBoundaryObservation:Boolean(sample&&BOUNDARY.test(sample.label)),
    nearestPrecedingBoundary:before?.label??null,nearestFollowingBoundary:after?.label??null,
    attribution:!before&&!after?'UNATTRIBUTABLE — no boundary observation surrounds the peak'
      :inRequest?'WITHIN the request '+before.label.slice(7)
      :before&&before.label.startsWith('after:')?'BETWEEN requests, after '+before.label.slice(6)+
        (after?' and before '+after.label.slice(7):' and the phase end')
      :'AMBIGUOUS — peak lies between non-paired boundary observations',
    peakVector:sample&&{usedSize:sample.usedSize,totalSize:sample.totalSize,
      embedderHeapUsedSize:sample.embedderHeapUsedSize,backingStorageSize:sample.backingStorageSize,
      observedAllocation:sample.observedAllocation},
    ownerInterval:owner&&{from:owner.from,samples:owner.samples,peak:owner.peak},
    topIntervals:[...intervals].sort((a,b)=>b.peak-a.peak).slice(0,12)
      .map(i=>({from:i.from,samples:i.samples,peakBytes:i.peak,peakSampleIndex:i.peakIndex})),
    orderedIntervalPeaks:intervals.map(i=>({from:i.from,samples:i.samples,peakBytes:i.peak})),
    limitation:'Samples carry order only, never timestamps, so interval DURATION is unknown. Boundary observations '+
      'add inspector round-trips and extra samples inside the measured window and can only RAISE the observed peak; '+
      'this run is not comparable with an uninstrumented qualification run.'};
}

// ---------------------------------------------------------------------------
// Proof that the measured isolate is the real application isolate, not a
// setup, proxy, D1 or control isolate. Read-only; the meter is unmodified.
// ---------------------------------------------------------------------------
async function proveApplicationIsolate(mf,workerName){
  const inspector=await mf.getInspectorURL();inspector.protocol='http:';
  const targets=await (await fetch(new URL('/json',inspector))).json();
  const exact='workerd: worker core:user:'+workerName;
  const titles=targets.map(t=>t.title);
  const selected=titles.filter(t=>t.includes(workerName));   // the meter's own selection rule
  check(selected.length===1&&selected[0]===exact,'APPLICATION_ISOLATE_AMBIGUOUS');
  return {selectedTitle:exact,selectionRule:'title.includes(workerName) — resolves to exactly one target',
    allInspectorTargets:titles,rejectedSetupOrProxyIsolates:titles.filter(t=>t!==exact)};
}

async function run({onProgress=m=>console.log(m),runtimeFactory=createR1Runtime,populateFixture=populate,
  outputFile,ceilings=CEILINGS,largeExtensionFacts=LARGE_EXTENSION_FACTS,smallExtensionFacts=SMALL_EXTENSION_FACTS,
  skipValidAccountAttempts=false,observeBoundaries=false}={}){
  const evidence={profile:'earned/rows-v3/resource-local/v1',route:'/reconcile/rows',
    verdict:'BLOCKED',resourceAcceptance:false,ceilings,
    requestVersion:C.REQUEST_VERSION,rowsLimits:P.LIMITS,platform:process.platform,nodeVersion:process.version,
    phase:'initialization',calibration:[],requests:[],phases:[],violations:[],attempts:[],
    oldProfileControl:null,workloadMapping:null,boundaryCoverage:null,negativeCalibration:null,isolateProof:null,
    limitations:[
      'CPU is the owned workerd process user+kernel delta, inclusive of D1, inspector and overlapping requests.',
      'Memory is the maximum observed simultaneous inspector allocation vector, not a universal native-memory bound.',
      'Sampling can miss a peak; these fields do not cover every native allocation.',
      'Local observations do not establish remote provider performance, spending limits, T1, K1 or P1.',
      'A rows-v3 server result is not client memory, staged-profile validation, atomic activation, current permission, phone fit or private recovery.',
      'The independent byte-identity oracle materializes the inventory in the Node harness, outside the measured isolate; it does not enter the memory metric.',
      'The old-profile extra-byte refusal is recorded as an OLD-PROFILE requirement only; rows-v3 has no corresponding whole-history cap and none is asserted for it.',
    ]};
  let runtime,meter,storage,observing=false,measuredFailure=false;
  const output=outputFile||path.join(__dirname,'../../.generated/rows-resource-01.json');
  const save=()=>{fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');};

  async function request(route,body,subject='subject-first'){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await fetch(new URL(route,runtime.url),{method:'POST',signal:controller.signal,
        headers:{'Content-Type':'application/json',Origin:runtime.issuer.config.origins[0],
          Authorization:'Bearer '+runtime.issuer.token(subject)},body:JSON.stringify(body)});
      const raw=await response.text();
      return {status:response.status,body:JSON.parse(raw),stats:JSON.parse(response.headers.get('x-r1-test-d1')),responseBytes:Buffer.byteLength(raw)};
    }finally{clearTimeout(timer);}
  }
  async function measuredRequest(label,route,body,subject){
    // Boundary observations sit OUTSIDE meter.measure(), so the inspector
    // round-trip is not charged to the request's own CPU delta.
    if(observeBoundaries&&observing)await meter.observe('before:'+label);
    const measured=await meter.measure(async()=>{try{return await request(route,body,subject);}catch(error){return {failure:errorText(error)};}});
    const result=measured.value,entry={label,cpuMs:measured.cpuMs,cpuGuardMs:evidence.cpuGuardMs,
      guardedCpuMs:measured.cpuMs+evidence.cpuGuardMs,status:result.status??null,responseBytes:result.responseBytes??0,
      stats:result.stats??null,failure:result.failure??null};
    evidence.requests.push(entry);
    if(result.failure){measuredFailure=true;throw Error('RUNTIME_REQUEST_FAILED: '+result.failure);}
    check(Number.isFinite(measured.cpuMs)&&measured.cpuMs>=0,'INVALID_PROCESS_CPU');
    check(result.stats&&!result.stats.missingMeta,'D1_METRICS_UNAVAILABLE');
    for(const f of ['statements','batches','rowsRead','rowsWritten','queryMs','batchMaxWallMs','domainWrites'])
      check(Number.isFinite(result.stats[f]),'D1_METRICS_INCOMPLETE');
    evidence.violations.push(...requestViolations(ceilings,entry));
    if(observeBoundaries&&observing)await meter.observe('after:'+label);
    return result;
  }
  async function beginPhase(name){evidence.phase=name;const before=await meter.sampleProcess();await meter.begin();observing=true;
    return {name,before,startedRequest:evidence.requests.length};}
  async function endPhase(phase){const memory=await meter.end();observing=false;const after=await meter.sampleProcess();
    const entry={name:phase.name,requestCount:evidence.requests.length-phase.startedRequest,
      wholePhaseCpuMs:(after.cpuTicks-phase.before.cpuTicks)*meter.method.counterTickMs,
      observedPeakBytes:memory.observedPeakBytes,sampleCount:memory.samples.length,
      peakVector:memory.samples.reduce((best,s)=>!best||s.observedAllocation>best.observedAllocation?s:best,null),
      ...(observeBoundaries?{peakLocation:locatePeak(memory.samples)}:{}),
      processBefore:phase.before,processAfter:after};
    evidence.phases.push(entry);evidence.violations.push(...phaseViolations(ceilings,entry));return entry;}

  // Independent completeness/byte oracle: read straight from D1 through the
  // real storage codec. Never derived from the route's own output.
  async function independentInventory(athleteId,{profileValid}){
    const loaded=await runtime.db.batch([
      runtime.db.prepare('SELECT revision FROM authority_revision WHERE id=1'),
      storage.controlStatement(),
      runtime.db.prepare('SELECT '+storage.rowColumns+' FROM authority_rows WHERE athlete=? ORDER BY collection COLLATE BINARY,row_id COLLATE BINARY').bind(athleteId)]);
    const revision=loaded[0].results[0].revision,rows=loaded[2].results;
    await storage.load(loaded[1],rows,revision);
    if(profileValid)validateRetained(rows,athleteId);
    const fold=createInventoryFold(),perCollection=new Map();let maxRowStoredBytes=0;
    for(const row of rows){
      const id=Buffer.from(row.row_id,'utf8'),value=Buffer.from(row.value,'utf8');
      fold.fold(row.collection,id,value);
      perCollection.set(row.collection,(perCollection.get(row.collection)||0)+1);
      maxRowStoredBytes=Math.max(maxRowStoredBytes,id.length+value.length);
    }
    return {revision,...fold.result(),maxRowStoredBytes,
      collections:[...perCollection.entries()].sort((a,b)=>a[0]<b[0]?-1:1),profileValidated:Boolean(profileValid)};
  }

  // One complete rows-v3 attempt, begin -> pages -> signed terminal finish.
  async function attempt({label,actor,subject,context,athleteId,verifier,expectedInventory}){
    const query={version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:digestNonce(label+'-nonce'),
      context_id:digestNonce(label+'-context'),claims:[],requested_lease_ids:[]};
    const basisDigest=P.hash('rows-resource-basis',label);
    const begin={profile:P.DOMAINS.begin,device_id:actor,request:query,basis_digest:basisDigest};
    const expected={scopeDigest:C.scopeDigest({...context,subject,athleteId,actorDeviceId:actor}),
      nonce:query.nonce,contextId:query.context_id,requestDigest:C.hash('request',C.encode(query)),
      basisDigest,claimSetDigest:P.hash('claims',[]),mode:query.mode};
    const fold=createInventoryFold(),pageShapes=[];
    let request=begin,previous=null,manifest=null,manifestBytes=null,terminal=null,chunks=0;
    for(let i=0;i<MAX_CHUNKS;i++){
      const response=await measuredRequest(label+'-chunk-'+i,'/reconcile/rows',request,subject);
      if(response.status!==200){measuredFailure=true;
        throw Error('ROWS_HTTP_'+response.status+'_'+String(response.body?.error?.code||'UNKNOWN'));}
      const verified=await verifier.verify(C.encode(response.body),{expected,previousCursor:previous});
      check(verified.verified===true,'ROWS_PROOF_REJECTED_'+String(verified.code||''));
      check(verified.kind==='rows-v3-inventory-chunk','ROWS_PROOF_KIND');
      const body=response.body,page=body.page;
      const currentManifestBytes=C.encode(body.manifest);
      if(i===0){manifest=body.manifest;manifestBytes=currentManifestBytes;}
      else check(C.sameBytes(currentManifestBytes,manifestBytes),'ORIGINAL_MANIFEST_CHANGED');
      let pageBytes=0;
      for(const row of page.rows){
        const id=C.decode64(row.row_id_b64,P.LIMITS.row),value=C.decode64(row.value_b64,P.LIMITS.row);
        C.text(id);C.text(value);                       // real decode, never a no-op
        fold.fold(row.collection,id,value);
        pageBytes+=id.length+value.length;
      }
      pageShapes.push({index:page.index,rows:page.rows.length,rowValueBytes:pageBytes,responseBytes:response.responseBytes,
        statements:response.stats.statements,domainWrites:response.stats.domainWrites});
      chunks++;
      if(body.finish){
        check(verified.terminal===true,'ROWS_TERMINAL_FLAG');
        check(Sign.verifyRecord(body.finish,runtime.authorityKey,P.DOMAINS.finish),'FINISH_SIGNATURE');
        check(body.finish.manifest_digest===P.manifestDigest(manifest),'FINISH_MANIFEST_BINDING');
        check(body.finish.revision===manifest.revision,'FINISH_REVISION_BINDING');
        terminal={cumulativeCounts:body.finish.cumulative_counts.slice(),finishRevision:body.finish.revision};
        break;
      }
      previous=page.next_cursor;
      request={profile:P.DOMAINS.continue,device_id:actor,manifest:body.manifest,cursor:previous};
      if((i+1)%16===0)onProgress('rows-v3 '+label+': '+(i+1)+' measured chunks, '+fold.result().rows+' rows');
    }
    check(terminal,'NO_SIGNED_TERMINAL_FINISH');
    const observed=fold.result();
    assertCompleteInventory({manifest,cumulativeCounts:terminal.cumulativeCounts,observed,expected:expectedInventory});
    check(terminal.finishRevision===expectedInventory.revision,'CUT_REVISION_DRIFT');
    const summary={label,chunks,rows:observed.rows,rowValueBytes:observed.bytes,inventoryDigest:observed.digest,
      revision:terminal.finishRevision,signedTerminalFinish:true,byteIdentityAgainstIndependentD1Read:true,
      maxRowsInOnePage:Math.max(...pageShapes.map(p=>p.rows)),
      maxPageRowValueBytes:Math.max(...pageShapes.map(p=>p.rowValueBytes)),
      maxResponseBytes:Math.max(...pageShapes.map(p=>p.responseBytes)),
      rowCountBoundPages:pageShapes.filter(p=>p.rows===P.LIMITS.rows).length,
      singleRowOverBudgetPages:pageShapes.filter(p=>p.rows===1&&p.rowValueBytes>P.LIMITS.budget).length,
      pageShapes};
    evidence.attempts.push(summary);
    return summary;
  }

  try{
    runtime=await runtimeFactory({p1:true});
    evidence.pinnedRuntime={worker:runtime.name,defaultRuntimeFlags:true,v8FlagsChanged:false,forcedCollection:false,
      heapLimitChanged:false,perPageRuntimeRestart:false,hiddenWarmup:false,sampleFormulaChanged:false};
    evidence.isolateProof=await proveApplicationIsolate(runtime.mf,runtime.name);
    meter=await createResourceMeter(runtime.mf,runtime.name);
    evidence.method=meter.method;
    check(evidence.method.memory.includes('totalSize + embedderHeapUsedSize + backingStorageSize'),'ORIGINAL_MEMORY_FORMULA_REQUIRED');
    evidence.cpuGuardMs=process.platform==='win32'?32:2*meter.method.counterTickMs;
    storage=createDatabaseStorage(runtime.db,runtime.storage);

    // ---- calibration (unchanged from the old profile's instrument check) ----
    const calibration=await beginPhase('instrument-calibration');
    for(let i=0;i<3;i++){
      const result=await meter.measure(async()=>{const r=await fetch(new URL('/__r1-meter-calibration',runtime.url));return {status:r.status,value:await r.json()};});
      check(result.value.status===200&&result.value.value.bytes===8*1024*1024&&Number.isFinite(result.cpuMs)&&result.cpuMs>0,'CPU_CALIBRATION_UNAVAILABLE');
      evidence.calibration.push({cpuMs:result.cpuMs,bytes:result.value.value.bytes});
    }
    await endPhase(calibration);

    // ---- fixture setup: SEPARATE from every measured workload ----------------
    evidence.phase='fixture-preparation';
    onProgress('rows-v3: building the reused old synthetic workload, then extending it');
    const subject='subject-first',athleteId='first';
    const context={issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0]};
    // The reused fixture's default raw UPDATE bypasses P1 sealing, which the
    // storage trigger correctly refuses. Its own readLogicalRows/writeLogicalRow
    // hooks exist for exactly this: both go through the real storage codec, so
    // the workload construction is unchanged and no product module is touched.
    const readLogicalRows=async db=>{
      const loaded=await db.batch([db.prepare('SELECT revision FROM authority_revision WHERE id=1'),storage.controlStatement(),
        db.prepare('SELECT '+storage.rowColumns+' FROM authority_rows ORDER BY athlete,collection,row_id')]);
      await storage.load(loaded[1],loaded[2].results,loaded[0].results[0].revision);
      return loaded[2].results;
    };
    const writeLogicalRow=async(row,revision)=>{
      const control=await storage.load(await storage.controlStatement().all(),[],revision);
      await runtime.db.batch([storage.guard(revision,control),await storage.write(row,revision,control),
        runtime.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
    };
    const fixture=await populateFixture({db:runtime.db,bridge:runtime.bridge,identityKey:runtime.identityKeys.first,
      athleteId,subject,trustedContext:context,targetBytes:C.LIMITS.payload,readLogicalRows,writeLogicalRow,
      foreign:{athleteId:'second',subject:'subject-second',identityKey:runtime.identityKeys.second}});
    const actor=fixture.deviceId;

    // OLD-PROFILE CONTROL. Preserved as an old-profile requirement only; it is
    // NOT invented for rows-v3 and is NOT a resource measurement of either route.
    const oversized=await fixture.applyTarget(C.LIMITS.payload+1);
    const refusal=await request('/reconcile',{device_id:oversized.deviceId,
      request_b64:C.encode64(oversized.requestBytes),continuation:null,page_index:0});
    check(refusal.status===413&&refusal.body?.error?.code==='RECONCILE_LIMIT','OLD_PROFILE_EXTRA_BYTE_REFUSAL');
    evidence.oldProfileControl={route:'/reconcile',oldProfilePayloadBytes:C.LIMITS.payload,
      extraBytePayloadBytes:C.LIMITS.payload+1,observed:'413 RECONCILE_LIMIT',
      statement:'Old-profile whole-history cap still enforced. Unmeasured semantic control; not a rows-v3 requirement and not an old-route resource PASS.'};

    // Extend to a LARGE VALID history through the real bridge admit path. The
    // account is only ever grown; nothing is shrunk to obtain a result.
    let seq=fixture.acceptedSyntheticFacts,previousOpId='resource-'+actor+'-'+seq;
    const admit=async padding=>{
      seq++;const opId='rows-ext-'+actor+'-'+seq;
      const operation=build({op_id:opId,athlete_id:athleteId,device_id:actor,device_seq:seq,predecessor:previousOpId,
        parents:[],kind:'fact',class:'reading',lease_id:fixture.lease.lease_id,
        effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},
        payload:{lb:{value:160,unit:'lb'},note:'SYNTHETIC ROWS-V3 EXTENSION '+'x'.repeat(padding)}},runtime.identityKeys.first);
      const decision=await runtime.bridge.invokeScoped(subject,actor,'admit',[athleteId,operation]);
      check(decision.status==='ACCEPTED','EXTENSION_FACT_REJECTED_'+String(decision.reason));
      previousOpId=opId;
    };
    for(let i=0;i<largeExtensionFacts;i++)await admit(LARGE_FACT_PADDING);
    for(let i=0;i<smallExtensionFacts;i++)await admit(SMALL_FACT_PADDING);
    onProgress('rows-v3: extended history to '+seq+' admitted synthetic facts');

    const inventory=await independentInventory(athleteId,{profileValid:true});
    evidence.workloadMapping={
      reusedOldFixture:'test/r1-resource-fixture.cjs populate() at targetBytes = C.LIMITS.payload — the identical construction the old /reconcile experiment measured.',
      oldSemantics:'One request materialized the COMPLETE history as a single '+C.LIMITS.payload+'-byte signed payload, transported as '+C.LIMITS.pages+' fixed pages; one extra byte was a typed 413.',
      newSemantics:'/reconcile/rows selects rows AT a checked cut, bounded per chunk by '+P.LIMITS.rows+' rows and '+P.LIMITS.budget+' stored bytes, cursor-chained to a signed terminal finish. There is no whole-history cap.',
      extension:'The same account was then GROWN through the real bridge admit path by '+largeExtensionFacts+' large and '+smallExtensionFacts+' small valid facts, so the complete inventory exceeds the old transport cap. Nothing was shrunk.',
      admittedSyntheticFacts:seq,
      completeInventoryRows:inventory.rows,
      completeInventoryRowValueBytes:inventory.bytes,
      oldTransportCapBytes:C.LIMITS.payload,
      largerThanOldTransportCap:inventory.bytes>C.LIMITS.payload,
      collections:inventory.collections,
      independentOracle:'Direct D1 read through the real storage codec plus validateRetained(); the digest is computed from stored rows, never from route output.'};
    evidence.fixturePopulation=oversized.population;
    save();

    const verifier=P.createRowsVerifier({keys:[Sign.publicKeyOf(runtime.authorityKey)],subtle:webcrypto.subtle});
    const attemptArgs={actor,subject,context,athleteId,verifier,expectedInventory:inventory};

    // ---- measured: one complete sequential attempt --------------------------
    // skipValidAccountAttempts is an ORDERING control only. It changes no
    // ceiling, no sample formula and no workload construction: it runs the
    // near-row/key-limit probe in a fresh isolate as the FIRST measured phase.
    // It shows only whether a result persists WITHOUT the preceding sequential
    // and overlapping traversals. It still performs calibration, the complete
    // fixture build and the full account traversal, so it isolates no single
    // cause and rules out neither setup nor accumulation effects. It is a
    // DIAGNOSTIC: qualificationEligibility() refuses it the acceptance flag.
    let sequential=null,overlaps=[];
    if(!skipValidAccountAttempts){
      const sequentialPhase=await beginPhase('rows-v3-sequential-complete-attempt');
      sequential=await attempt({label:'sequential',...attemptArgs});
      await endPhase(sequentialPhase);save();

      // ---- measured: two overlapping complete attempts ----------------------
      const overlapPhase=await beginPhase('rows-v3-two-overlapping-complete-attempts');
      overlaps=await Promise.all([attempt({label:'overlap-a',...attemptArgs}),attempt({label:'overlap-b',...attemptArgs})]);
      await endPhase(overlapPhase);save();
      for(const o of overlaps)check(o.inventoryDigest===sequential.inventoryDigest,'OVERLAP_INVENTORY_DIVERGED');
    }

    // ---- measured: supported near-row/key limits ----------------------------
    // DELIBERATELY GENERIC extreme key/row fixture. It is NOT a profile-valid
    // history event and is kept distinct from the valid cross-record account
    // above; its attempt is reported separately and never as the account result.
    evidence.phase='near-limit-fixture-preparation';
    const before=await runtime.db.batch([runtime.db.prepare('SELECT revision FROM authority_revision WHERE id=1'),storage.controlStatement()]);
    const rev=before[0].results[0].revision,control=await storage.load(before[1],[],rev);
    const extremeKey={athlete:athleteId,collection:'history',row_id:'zzz-generic-extreme-key-'+'k'.repeat(1200000),value:' {"synthetic":"é"} '};
    const extremeRow={athlete:athleteId,collection:'history',row_id:'zzz-generic-extreme-row',value:' {"synthetic":"'+'v'.repeat(1400000)+'"} '};
    for(const row of [extremeKey,extremeRow])
      check(Buffer.byteLength(row.row_id,'utf8')+Buffer.byteLength(row.value,'utf8')<P.LIMITS.row,'NEAR_LIMIT_FIXTURE_BOUND');
    await runtime.db.batch([storage.guard(rev,control),await storage.write(extremeKey,rev,control),
      await storage.write(extremeRow,rev,control),runtime.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1')]);
    const nearLimitInventory=await independentInventory(athleteId,{profileValid:false});
    const nearLimitPhase=await beginPhase('rows-v3-near-row-key-limit-attempt');
    const nearLimit=await attempt({label:'near-limit',...attemptArgs,expectedInventory:nearLimitInventory});
    await endPhase(nearLimitPhase);
    evidence.nearRowKeyLimit={fixtureClass:'GENERIC_EXTREME_KEY_AND_ROW — deliberately not a profile-valid history event',
      distinctFromValidAccount:true,profileValidated:false,
      extremeKeyBytes:Buffer.byteLength(extremeKey.row_id,'utf8'),extremeRowValueBytes:Buffer.byteLength(extremeRow.value,'utf8'),
      rowLimit:P.LIMITS.row,maxResponseBytes:nearLimit.maxResponseBytes,
      statement:'Supported near-row/key limits transported intact. This is an inventory-shape probe, not an account-validity result.'};
    save();

    const shape=sequential||nearLimit;
    evidence.boundaryCoverage={
      pageRowLimit:P.LIMITS.rows,pageByteBudget:P.LIMITS.budget,
      fromAttempt:shape.label,
      rowCountBoundPagesObserved:shape.rowCountBoundPages,
      singleRowOverBudgetPagesObserved:shape.singleRowOverBudgetPages,
      maxPageRowValueBytesObserved:shape.maxPageRowValueBytes,
      byteBudgetBoundPagesObserved:shape.pageShapes.filter(p=>p.rows>1&&p.rows<P.LIMITS.rows).length,
      largestSingleRowStoredBytes:inventory.maxRowStoredBytes,
      note:'Coverage is reported as OBSERVED page shapes, not asserted by construction.'};

    // ---- focused negative calibration ---------------------------------------
    // (a) an exceeded limit must be DETECTED on the real measured samples;
    // (b) incomplete/invalid recovery must be REFUSED, not reported successful.
    const sampleRequest=evidence.requests.find(r=>r.status===200&&r.stats);
    const samplePhase=evidence.phases.find(p=>p.observedPeakBytes>0);
    const tiny=Object.freeze({cpuMs:0,observedAllocationBytes:1,statements:0,batchMs:1,domainWrites:-1});
    const detectedRequest=requestViolations(tiny,sampleRequest),detectedPhase=phaseViolations(tiny,samplePhase);
    check(detectedRequest.length>0&&detectedPhase.length>0,'NEGATIVE_CALIBRATION_NO_DETECTION');
    check(verdictFor([...detectedRequest,...detectedPhase])==='FAIL','NEGATIVE_CALIBRATION_NOT_FAIL');
    let refusedIncomplete=false,refusedTampered=false,refusedShortCounts=false;
    try{assertCompleteInventory({manifest:{collection_counts:[['history',inventory.rows+1]]},
      cumulativeCounts:[inventory.rows],observed:{rows:inventory.rows,bytes:inventory.bytes,digest:inventory.digest},
      expected:inventory});}catch(e){refusedShortCounts=/ROWS_INCOMPLETE_/.test(e.message);}
    try{assertCompleteInventory({manifest:{collection_counts:[['history',inventory.rows-1]]},
      cumulativeCounts:[inventory.rows-1],observed:{rows:inventory.rows-1,bytes:inventory.bytes,digest:inventory.digest},
      expected:inventory});}catch(e){refusedIncomplete=e.message==='ROWS_COUNT_MISMATCH';}
    try{assertCompleteInventory({manifest:{collection_counts:[['history',inventory.rows]]},
      cumulativeCounts:[inventory.rows],observed:{rows:inventory.rows,bytes:inventory.bytes,digest:'TAMPERED'},
      expected:inventory});}catch(e){refusedTampered=e.message==='ROWS_BYTE_IDENTITY_MISMATCH';}
    check(refusedShortCounts&&refusedIncomplete&&refusedTampered,'NEGATIVE_CALIBRATION_NOT_REFUSED');
    // A live invalid continuation must not be counted as progress.
    const freshBegin=await request('/reconcile/rows',{profile:P.DOMAINS.begin,device_id:actor,
      request:{version:C.REQUEST_VERSION,mode:'ACCOUNT_RECOVERY',nonce:digestNonce('neg'),context_id:digestNonce('neg2'),claims:[],requested_lease_ids:[]},
      basis_digest:P.hash('rows-resource-basis','negative')});
    check(freshBegin.status===200,'NEGATIVE_CALIBRATION_BEGIN');
    const tamperedCursor=structuredClone(freshBegin.body.page.next_cursor);tamperedCursor.index++;
    const forgedReply=await request('/reconcile/rows',{profile:P.DOMAINS.continue,device_id:actor,
      manifest:freshBegin.body.manifest,cursor:tamperedCursor});
    check(forgedReply.status===400&&forgedReply.body.page===undefined,'FORGED_CURSOR_NOT_REFUSED');
    const foreignReply=await request('/reconcile/rows',{profile:P.DOMAINS.continue,device_id:actor,
      manifest:freshBegin.body.manifest,cursor:freshBegin.body.page.next_cursor},'subject-second');
    check(foreignReply.status===403&&foreignReply.body.error.state===17,'FOREIGN_SUBJECT_NOT_REFUSED');
    evidence.negativeCalibration={
      exceededLimitDetected:{ceilingsUsed:tiny,requestViolations:detectedRequest,phaseViolations:detectedPhase,verdict:'FAIL',
        statement:'Detection was calibrated against the REAL measured samples with deliberately unreachable ceilings. The agreed ceilings were never altered for the verdict.'},
      incompleteRefused:refusedIncomplete,shortCumulativeCountsRefused:refusedShortCounts,
      tamperedByteIdentityRefused:refusedTampered,
      forgedCursorHttpStatus:forgedReply.status,foreignSubjectHttpStatus:foreignReply.status,
      statement:'The wrapper refuses incomplete or invalid recovery instead of reporting success.'};

    evidence.verdict=verdictFor(evidence.violations);
    // PASS alone never awards acceptance; the configuration must also be an
    // eligible qualification run.
    evidence.qualificationEligibility=qualificationEligibility({ceilings,skipValidAccountAttempts,
      largeExtensionFacts,smallExtensionFacts,observeBoundaries,attempts:evidence.attempts,verdict:evidence.verdict});
    evidence.resourceAcceptance=evidence.qualificationEligibility.eligible;
    evidence.boundaryObservation=observeBoundaries
      ?'DIAGNOSTIC peak-localization run: labelled observations at every request edge. Extra samples and inspector '+
       'round-trips inside the measured window can only RAISE the observed peak. Not comparable with, and never a '+
       'replacement for, the original qualification evidence.':null;
    evidence.isolationControl=skipValidAccountAttempts
      ?'NEAR-LIMIT-ONLY isolation control: valid-account attempts deliberately not run; not a qualification verdict.':null;
    evidence.attemptsCompleted={sequential:sequential?1:0,overlapping:overlaps.length,nearRowKeyLimit:1,
      allReachedSignedTerminalFinish:[sequential,...overlaps,nearLimit].filter(Boolean).every(a=>a.signedTerminalFinish)};
    return evidence;
  }catch(error){
    evidence.failure={phase:evidence.phase,message:errorText(error)};
    const instrumentationFailure=['initialization','instrument-calibration'].includes(evidence.phase)||
      /^(?:D1_METRICS_|INVALID_PROCESS_CPU|APPLICATION_ISOLATE_)|inspector metric|allocation vector|process meter/.test(errorText(error));
    evidence.verdict=!measuredFailure&&instrumentationFailure&&!evidence.violations.length?'BLOCKED':'FAIL';
    evidence.resourceAcceptance=false;return evidence;
  }finally{
    if(observing&&meter){try{const m=await meter.end();evidence.incompletePhaseMemory={observedPeakBytes:m.observedPeakBytes,samples:m.samples.length};}catch(e){evidence.memoryFailure=errorText(e);}}
    const measurements=evidence.requests.filter(r=>r.status!==null);
    evidence.summary={requests:measurements.length,
      maxCpuMs:measurements.length?Math.max(...measurements.map(r=>r.guardedCpuMs)):null,
      p95CpuMs:pct(measurements.map(r=>r.guardedCpuMs),.95),
      peakObservedAllocationBytes:evidence.phases.length?Math.max(...evidence.phases.map(p=>p.observedPeakBytes)):null,
      rowsRead:measurements.reduce((n,r)=>n+(r.stats?.rowsRead||0),0),
      rowsWritten:measurements.reduce((n,r)=>n+(r.stats?.rowsWritten||0),0),
      queryMs:measurements.reduce((n,r)=>n+(r.stats?.queryMs||0),0),
      maxStatements:measurements.length?Math.max(...measurements.map(r=>r.stats?.statements||0)):null,
      maxBatchWallMs:measurements.length?Math.max(...measurements.map(r=>r.stats?.batchMaxWallMs||0)):null,
      domainWrites:measurements.reduce((n,r)=>n+(r.stats?.domainWrites||0),0)};
    evidence.finishedUTC=new Date().toISOString();save();
    if(meter)await meter.close().catch(()=>{});
    if(runtime)await runtime.close().catch(()=>{});
  }
}

module.exports={run,CEILINGS,DEFAULT_WORKLOAD:Object.freeze({largeExtensionFacts:LARGE_EXTENSION_FACTS,
  smallExtensionFacts:SMALL_EXTENSION_FACTS}),requestViolations,phaseViolations,verdictFor,qualificationEligibility,
  createInventoryFold,assertCompleteInventory,summarizeIntervals,locatePeak};

const LOCATE=process.argv.includes('--locate-peak'),NEAR_ONLY=LOCATE||process.argv.includes('--only-near-limit');
if(require.main===module)run({skipValidAccountAttempts:NEAR_ONLY,observeBoundaries:LOCATE,
  outputFile:LOCATE?path.join(__dirname,'../../.generated/rows-resource-01-peak-location.json')
    :NEAR_ONLY?path.join(__dirname,'../../.generated/rows-resource-01-near-limit-isolation.json'):undefined}).then(result=>{
  const located=result.phases?.map(p=>p.peakLocation).filter(Boolean).at(-1);
  if(located)console.log('PEAK LOCATION — '+located.attribution+'; peak '+located.observedPeakBytes+
    ' B at sample '+located.peakSampleIndex+'/'+located.totalSamples+' (label '+located.peakSampleLabel+')');
  console.log('ROWS-V3-RESOURCE '+result.verdict+' — '+(result.attempts||[]).length+' complete attempts; '+
    (result.summary?.requests??0)+' measured requests; peak '+(result.summary?.peakObservedAllocationBytes??'n/a')+
    ' bytes vs '+result.ceilings.observedAllocationBytes+'; '+result.violations.length+' resource violations'+
    (result.failure?'; '+result.failure.phase+': '+result.failure.message:''));
  console.log('resourceAcceptance='+result.resourceAcceptance+
    (result.qualificationEligibility&&!result.qualificationEligibility.eligible
      ?' — NOT an eligible qualification run: '+result.qualificationEligibility.reasons.join(', '):''));
  console.log('NOT old-route (/reconcile) acceptance; not client memory, staged-profile validation, activation, permission, phone fit or private recovery.');
  process.exitCode=result.verdict==='PASS'?0:result.verdict==='BLOCKED'?2:1;
}).catch(e=>{console.error('ROWS-V3-RESOURCE FAIL — harness termination:',errorText(e));process.exitCode=1;});
