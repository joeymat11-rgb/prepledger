'use strict';
// One A/B DIAGNOSTIC, never resource acceptance. Original production, runtime,
// resource workload, metrics and ceilings stay unchanged. Only population differs.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const assert=require('node:assert/strict'),{createHash}=require('node:crypto'),{spawn,execFileSync}=require('node:child_process');
const C=require('../reconciliation/codec.cjs'),P=require('../reconciliation/project.cjs');
const originalFixture=require('./r1-resource-fixture.cjs');
const LABEL='DIAGNOSTIC — NOT ACCEPTANCE',FOREIGN_BYTES=9*1024*1024;
const dir=path.join(__dirname,'../.generated'),repo=path.resolve(__dirname,'../../../..');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const output=arm=>path.join(dir,'r1-population-diagnostic-'+arm+'.json');
const write=(file,value)=>{fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};
const rows=async db=>(await db.prepare('SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id').all()).results;
let fixtureEvidence=null;
function semantics(f,actualRows){
  const payload=C.parse(f.payloadBytes),claims=f.request.claims.map(claim=>{
    const op=C.parse(C.decode64(claim.envelope_b64));assert.equal(op.athlete_id,f.athleteId);assert.equal(op.device_id,f.deviceId);
    return {claim_id:claim.claim_id,device_seq:op.device_seq,kind:op.kind,class:op.class,effective:op.effective,payload:op.payload,
      source:'fresh-own-enrolled-device',lease:'fresh-own-issued-lease',op_id:op.op_id,parents:op.causal_parents};
  });
  const own=actualRows.filter(r=>r.athlete===f.athleteId),metadata=JSON.parse(own.find(r=>r.collection==='metadata').value);
  return {athleteId:f.athleteId,payloadBytes:f.payloadBytes.length,acceptedSyntheticFacts:f.acceptedSyntheticFacts,
    acceptedFrontier:payload.accepted.W,mode:f.request.mode,claims,requestedLeaseIds:f.request.requested_lease_ids,
    initialPlan:metadata.initialPlan,ownRowCount:own.length,
    collections:Object.fromEntries(P.COLLECTIONS.map(k=>[k,own.filter(r=>r.collection===k).length]))};
}
async function populate(options){
  const arm=process.argv[process.argv.indexOf('--child')+1];assert(['A','B'].includes(arm));
  const fixture=await originalFixture.populate({...options,foreign:arm==='A'?undefined:options.foreign});
  const before=await rows(options.db),ownBefore=before.filter(r=>r.athlete===fixture.athleteId);
  let method={kind:'original-populate-without-foreign',paddedRows:0,addedWhitespaceBytes:0,foreignTargetBytes:0};
  if(arm==='B'){
    const foreignId=options.foreign.athleteId,foreign=before.filter(r=>r.athlete===foreignId);
    const beforeBytes=foreign.reduce((n,r)=>n+Buffer.byteLength(r.value,'utf8'),0);
    const eligible=foreign.filter(r=>['metadata','operations','log'].includes(r.collection));
    assert(eligible.length>0&&beforeBytes<FOREIGN_BYTES);
    let remaining=FOREIGN_BYTES-beforeBytes;
    const revision=(await options.db.prepare('SELECT revision FROM authority_revision WHERE id=1').first()).revision;
    const statements=[options.db.prepare('UPDATE authority_revision SET revision=CASE WHEN revision=? THEN revision ELSE -1 END WHERE id=1').bind(revision)];
    const padded=[];
    for(let i=0;i<eligible.length;i++){
      const row=eligible[i],add=Math.ceil(remaining/(eligible.length-i)),value=row.value+' '.repeat(add);
      assert(Buffer.byteLength(value,'utf8')<2097152,'individual JSON value remains below 2MiB');
      assert.deepEqual(JSON.parse(value),JSON.parse(row.value),'padding changes no parsed fact');remaining-=add;
      statements.push(options.db.prepare('UPDATE authority_rows SET value=? WHERE athlete=? AND collection=? AND row_id=?').bind(value,foreignId,row.collection,row.row_id));
      padded.push({collection:row.collection,originalBytes:Buffer.byteLength(row.value,'utf8'),finalBytes:Buffer.byteLength(value,'utf8'),addedWhitespaceBytes:add});
    }
    assert.equal(remaining,0);statements.push(options.db.prepare('UPDATE authority_revision SET revision=revision+1 WHERE id=1'));
    await options.db.batch(statements);
    const after=await rows(options.db);assert.deepEqual(after.filter(r=>r.athlete===fixture.athleteId),ownBefore,'own stored bytes unchanged');
    assert.deepEqual(after.map(r=>({...r,value:JSON.parse(r.value)})),before.map(r=>({...r,value:JSON.parse(r.value)})),'all existing parsed rows unchanged');
    const foreignAfter=after.filter(r=>r.athlete===foreignId);
    assert.equal(foreignAfter.reduce((n,r)=>n+Buffer.byteLength(r.value,'utf8'),0),FOREIGN_BYTES);
    P.validateRetained(after,foreignId);P.validateRetained(after,fixture.athleteId);
    const actual=await options.bridge.reconcileScoped(fixture.subject,fixture.deviceId,fixture.request,undefined,options.trustedContext);
    assert.deepEqual(Buffer.from(actual.payloadBytes),Buffer.from(fixture.payloadBytes),'actual guarded own proof remains byte-identical after foreign padding');
    method={kind:'real-synthetic-foreign-admissions-then-guarded-JSON-whitespace',paddedRows:padded.length,
      addedWhitespaceBytes:FOREIGN_BYTES-beforeBytes,foreignTargetBytes:FOREIGN_BYTES,beforeForeignBytes:beforeBytes,padded,
      invariant:'all parsed rows and every own raw row unchanged; immutable issuance/standing rows untouched'};
  }
  const actualRows=await rows(options.db),population=originalFixture.declaredPopulation(actualRows);
  assert.equal(population.accounts.length,arm==='A'?1:2);
  fixtureEvidence={arm,method,population,semantics:semantics(fixture,actualRows),
    ownRawRowsSha256:sha(Buffer.from(JSON.stringify(actualRows.filter(r=>r.athlete===fixture.athleteId)))),
    ownExpectedPayloadSha256:sha(fixture.payloadBytes),ownRequestSha256:sha(C.encode(fixture.request)),
    actualOwnProjectionVerified:true,randomIdentifiersAndSignatures:'fresh per arm; exact expected bytes checked independently within each arm'};
  return {...fixture,population};
}
function vectors(result){
  const samples=result.phases.flatMap(p=>p.samples.map((s,index)=>({phase:p.name,index,...s})));
  if(result.incompletePhaseMemory)samples.push(...result.incompletePhaseMemory.samples.map((s,index)=>({phase:'INCOMPLETE',index,...s})));
  const select=s=>s&&({phase:s.phase,index:s.index,usedSize:s.usedSize,totalSize:s.totalSize,
    embedderHeapUsedSize:s.embedderHeapUsedSize,backingStorageSize:s.backingStorageSize,
    totalPlusEmbedderPlusBacking:s.totalSize+s.embedderHeapUsedSize+s.backingStorageSize,
    usedPlusEmbedderPlusBacking:s.usedSize+s.embedderHeapUsedSize+s.backingStorageSize});
  const max=fn=>select(samples.reduce((best,s)=>!best||fn(s)>fn(best)?s:best,null));
  return {sampleCount:samples.length,totalMetricPeak:max(s=>s.totalSize+s.embedderHeapUsedSize+s.backingStorageSize),
    usedMetricDiagnosticPeak:max(s=>s.usedSize+s.embedderHeapUsedSize+s.backingStorageSize)};
}
function sourcePins(){
  const files=['test/r1-resource.test.cjs','test/r1-resource-meter.cjs','test/r1-workerd.cjs','test/r1-resource-fixture.cjs',
    'bridge.cjs','worker.cjs','crypto.cjs','build.cjs','reconciliation/codec.cjs','reconciliation/issuer.cjs',
    'reconciliation/project.cjs','reconciliation/verify.cjs','reconciliation/transport.cjs','migrations/0001_authority.sql','migrations/0002_reconciliation.sql'];
  return files.map(file=>({file,sha256:sha(fs.readFileSync(path.join(__dirname,'..',file)))}));
}
async function child(arm){
  assert(['A','B'].includes(arm));assert.equal(Object.hasOwn(process.env,'MINIFLARE_WORKERD_V8_FLAGS'),false);
  const pins=sourcePins(),start=performance.now(),startedUTC=new Date().toISOString();
  let source=fs.readFileSync(path.join(__dirname,'r1-resource.test.cjs'),'utf8');
  const replace=(before,after)=>{assert.equal(source.split(before).length-1,1,'one exact diagnostic harness seam');source=source.replace(before,after);};
  replace("const {populate}=require('./r1-resource-fixture.cjs');",'const {populate}=require('+JSON.stringify(__filename)+');');
  replace('../.generated/r1-resource.json','../.generated/r1-population-diagnostic-'+arm+'.json');
  replace('JSON.stringify(evidence,null,2)',"JSON.stringify({...evidence,diagnosticLabel:'DIAGNOSTIC — NOT ACCEPTANCE',resourceAcceptance:false},null,2)");
  const filename=path.join(__dirname,'r1-resource.test.cjs'),compiled=new Module(filename,module);
  compiled.filename=filename;compiled.paths=Module._nodeModulePaths(__dirname);compiled._compile(source,filename);
  const result=await compiled.exports.run({onProgress:message=>console.log('ARM '+arm+' '+message)});
  assert.deepEqual(sourcePins(),pins,'all original harness and product source pins unchanged');
  const evidence={...result,verdict:'DIAGNOSTIC',observationVerdict:result.verdict,diagnosticLabel:LABEL,resourceAcceptance:false,
    arm,startedUTC,elapsedMs:performance.now()-start,sourcePins:pins,runtimeFlagsPresent:false,fixture:fixtureEvidence,
    vectorSummary:vectors(result),limitations:[...result.limitations,
      'Single A/B pair does not prove universal causality or a peak distribution; no production equivalence.',
      'Additional used+embedder+backing vector is diagnostic only; original total-based 96MiB metric is unchanged.']};
  write(output(arm),evidence);
  console.log('R1-POPULATION '+arm+' '+LABEL+'; original observations '+result.verdict+'; '+result.completedPages+' pages; '+result.summary.requests+' requests; '+(result.oversizeRefusal||'oversize incomplete'));
  console.log(JSON.stringify({arm,summary:result.summary,vectors:evidence.vectorSummary,failure:result.failure||null}));
  const complete=result.completedPages===96&&result.summary.requests===97&&result.oversizeRefusal==='413 RECONCILE_LIMIT';
  process.exitCode=complete?0:1;
}
async function run(){
  assert.equal(Object.hasOwn(process.env,'MINIFLARE_WORKERD_V8_FLAGS'),false);
  const pairPath=path.join(dir,'r1-population-diagnostic-pair.json');
  for(const file of [output('A'),output('B'),pairPath])assert(!fs.existsSync(file),'preserve prior A/B evidence; one pair only');
  const base=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),productBase='777caa543a7bd34264580a65b4ff7d7266b81920';
  execFileSync('git',['merge-base','--is-ancestor',productBase,base],{cwd:repo});
  const publicationOnly=new Set(['rebuild/m3/REPORT-R1-ASTRA.md','rebuild/m3/w5/reconciliation/RESOURCE-LIMITS.md',
    'rebuild/m3/w5/reconciliation/SCOPED-READ.md','rebuild/m3/w5/test/r1-population-diagnostic.cjs']);
  const delta=execFileSync('git',['diff','--name-only',productBase,base],{cwd:repo,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  assert(delta.every(file=>publicationOnly.has(file)),'only the named docs/helper publication may follow pinned product');
  const pins=sourcePins(),prior=fs.readdirSync(dir).filter(name=>/^r1-resource.*\.json$/.test(name)).map(name=>({name,sha256:sha(fs.readFileSync(path.join(dir,name)))}));
  const outcomes=[];
  for(const arm of ['A','B']){
    const outcome=await new Promise((resolve,reject)=>{const proc=spawn(process.execPath,[__filename,'--child',arm],
      {cwd:repo,windowsHide:true,stdio:'inherit',env:{...process.env}});proc.once('error',reject);proc.once('exit',(code,signal)=>resolve({arm,code,signal}));});
    outcomes.push(outcome);
    if(!fs.existsSync(output(arm))){write(output(arm),{diagnosticLabel:LABEL,resourceAcceptance:false,arm,childFailure:outcome});}
  }
  assert.deepEqual(sourcePins(),pins);for(const p of prior)assert.equal(sha(fs.readFileSync(path.join(dir,p.name))),p.sha256,'preserved '+p.name);
  const arms=['A','B'].map(arm=>JSON.parse(fs.readFileSync(output(arm),'utf8')));
  const complete=arms.every(x=>x.completedPages===96&&x.summary?.requests===97&&x.oversizeRefusal==='413 RECONCILE_LIMIT');
  let sameOwnSemantics=false;if(arms.every(x=>x.fixture)){assert.deepEqual(arms[0].fixture.semantics,arms[1].fixture.semantics,'same own scope/request/target semantics');sameOwnSemantics=true;}
  write(pairPath,{diagnosticLabel:LABEL,resourceAcceptance:false,base,productBase,sourcePins:pins,preservedEvidence:prior,childOutcomes:outcomes,
    complete,sameOwnSemantics,completedPages:arms.reduce((n,x)=>n+(x.completedPages||0),0),requests:arms.reduce((n,x)=>n+(x.summary?.requests||0),0),
    arms:arms.map((x,i)=>({arm:['A','B'][i],evidenceSha256:sha(fs.readFileSync(output(['A','B'][i]))),observationVerdict:x.observationVerdict,
      fixture:x.fixture,summary:x.summary,elapsedMs:x.elapsedMs,vectorSummary:x.vectorSummary,failure:x.failure||x.childFailure||null})),
    limitation:'One A/B pair, not resource acceptance or universal causality; no product/metric/cap/runtime changes.'});
  console.log('R1-POPULATION PAIR '+LABEL+'; complete='+complete+'; same-own-semantics='+sameOwnSemantics+'; '+arms.reduce((n,x)=>n+(x.completedPages||0),0)+' pages');
  process.exitCode=complete&&sameOwnSemantics?0:1;
}
module.exports={populate,run,vectors};
if(require.main===module)(process.argv.includes('--child')?child(process.argv[process.argv.indexOf('--child')+1]):run()).catch(error=>{
  console.error('R1-POPULATION '+LABEL+'; '+error.message);process.exitCode=1;
});
