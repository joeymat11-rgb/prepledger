'use strict';
// One A/B DIAGNOSTIC, never resource acceptance. Original production, runtime,
// resource workload, metrics and ceilings stay unchanged. Only population differs.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const assert=require('node:assert/strict'),{createHash}=require('node:crypto'),{spawn,execFileSync}=require('node:child_process');
// Candidate inputs load only after the explicit source receipt is checked.
let C,P,originalFixture;
function loadInputs(){C=require('../reconciliation/codec.cjs');P=require('../reconciliation/project.cjs');originalFixture=require('./r1-resource-fixture.cjs');}
const LABEL='DIAGNOSTIC — NOT ACCEPTANCE',FOREIGN_BYTES=9*1024*1024;
// https://developers.cloudflare.com/d1/platform/limits/ (checked 2026-09-06).
// This checks each string only; it does not prove the complete encoded row size.
const D1_STRING_BYTES=2000000;
const dir=path.join(__dirname,'../.generated'),repo=path.resolve(__dirname,'../../../..');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
let activeRunId=null;
const stem=runId=>'r1-population-diagnostic'+(runId?'-'+runId:'');
const output=arm=>path.join(dir,stem(activeRunId)+'-'+arm+'.json');
const write=(file,value)=>{fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};
const rows=async db=>(await db.prepare('SELECT athlete,collection,row_id,value FROM authority_rows ORDER BY athlete,collection,row_id').all()).results;
function assertStringSize(value){assert.equal(typeof value,'string');assert(Buffer.byteLength(value,'utf8')<=D1_STRING_BYTES,'individual string exceeds documented D1 2,000,000-byte limit');}
function prepareEvidenceDirectory(directory,runId=null){
  assert(runId===null||/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(runId),'safe diagnostic run id');
  fs.mkdirSync(directory,{recursive:true});
  for(const suffix of ['A','B','pair'])assert(!fs.existsSync(path.join(directory,stem(runId)+'-'+suffix+'.json')),'preserve prior A/B evidence; one pair per run id');
  return fs.readdirSync(directory).filter(name=>/^r1-(?:resource|population).*\.json$/.test(name)).sort().map(name=>({name,sha256:sha(fs.readFileSync(path.join(directory,name)))}));
}
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
      assertStringSize(value);
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
const SOURCE_FILES=Object.freeze(['test/r1-resource.test.cjs','test/r1-resource-meter.cjs','test/r1-workerd.cjs','test/r1-resource-fixture.cjs',
     'bridge.cjs','worker.cjs','crypto.cjs','build.cjs','reconciliation/codec.cjs','reconciliation/issuer.cjs',
     'reconciliation/project.cjs','reconciliation/verify.cjs','reconciliation/transport.cjs','migrations/0001_authority.sql','migrations/0002_reconciliation.sql']);
function sourcePins(productDir=path.join(__dirname,'..')){
  return SOURCE_FILES.map(file=>({file,sha256:sha(fs.readFileSync(path.join(productDir,file)))}));
}
function validateSources({receiptPath=null,repository=repo,productDir=path.join(__dirname,'..'),helperFile=__filename}={}){
  const git=args=>execFileSync('git',args,{cwd:repository,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const base=git(['rev-parse','HEAD']),pins=sourcePins(productDir);
  if(receiptPath){
    assert(path.isAbsolute(receiptPath),'source receipt path must be absolute');
    const receiptBytes=fs.readFileSync(receiptPath),r=JSON.parse(receiptBytes);
    assert.deepEqual(Object.keys(r).sort(),['format','head','helperSha256','sourcePins']);
    assert.equal(r.format,'earned/r1-population-source-pins/v1');assert(/^[a-f0-9]{40}$/.test(r.head));assert.equal(r.head,base,'source HEAD mismatch');
    assert(/^[a-f0-9]{64}$/.test(r.helperSha256));assert.equal(r.helperSha256,sha(fs.readFileSync(helperFile)),'diagnostic helper mismatch');
    assert.deepEqual(r.sourcePins,pins,'source byte pins mismatch');
    git(['diff','--quiet','HEAD','--','rebuild/authority','rebuild/m3/w5']);
    assert.equal(git(['ls-files','--others','--exclude-standard','--','rebuild/authority','rebuild/m3/w5']),'','untracked authority/W5 source is not pinned by HEAD');
    return {base,productBase:base,sourcePins:pins,receiptSha256:sha(receiptBytes),sourceMode:'explicit-candidate-receipt'};
  }
  const productBase='777caa543a7bd34264580a65b4ff7d7266b81920';
  git(['merge-base','--is-ancestor',productBase,base]);
  const publicationOnly=new Set(['rebuild/m3/REPORT-R1-ASTRA.md','rebuild/m3/w5/reconciliation/RESOURCE-LIMITS.md',
    'rebuild/m3/w5/reconciliation/SCOPED-READ.md','rebuild/m3/w5/test/r1-population-diagnostic.cjs','rebuild/m3/w5/test/r1-population-diagnostic.test.cjs']);
  const delta=git(['diff','--name-only',productBase,'--']).split(/\r?\n/).filter(Boolean);
  assert(delta.every(file=>publicationOnly.has(file)),'only the named docs/helper publication may follow pinned product');
  return {base,productBase,sourcePins:pins,receiptSha256:null,sourceMode:'original-pinned-baseline'};
}
function validateOptions(options){
  assert(options&&typeof options==='object');assert(Object.keys(options).every(k=>['receiptPath','runId'].includes(k)));
  const {receiptPath=null,runId=null}=options;
  assert(runId===null||/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(runId),'safe diagnostic run id');
  assert((receiptPath===null&&runId===null)||(typeof receiptPath==='string'&&path.isAbsolute(receiptPath)&&runId!==null),'candidate runs require explicit source receipt and distinct run id');
  return {receiptPath,runId};
}
async function child(arm,options={}){
  assert(['A','B'].includes(arm));assert.equal(Object.hasOwn(process.env,'MINIFLARE_WORKERD_V8_FLAGS'),false);
  options=validateOptions(options);activeRunId=options.runId;
  const sourceReceipt=validateSources(options.receiptPath?{receiptPath:options.receiptPath}:{}),pins=sourceReceipt.sourcePins;
  assert(!fs.existsSync(output(arm)),'preserve prior arm evidence');
  loadInputs();const start=performance.now(),startedUTC=new Date().toISOString();
  let source=fs.readFileSync(path.join(__dirname,'r1-resource.test.cjs'),'utf8');
  const replace=(before,after)=>{assert.equal(source.split(before).length-1,1,'one exact diagnostic harness seam');source=source.replace(before,after);};
  replace("const {populate}=require('./r1-resource-fixture.cjs');",'const {populate}=require('+JSON.stringify(__filename)+');');
  replace('../.generated/r1-resource.json','../.generated/'+stem(activeRunId)+'-'+arm+'.json');
  replace('JSON.stringify(evidence,null,2)',"JSON.stringify({...evidence,diagnosticLabel:'DIAGNOSTIC — NOT ACCEPTANCE',resourceAcceptance:false},null,2)");
  const filename=path.join(__dirname,'r1-resource.test.cjs'),compiled=new Module(filename,module);
  compiled.filename=filename;compiled.paths=Module._nodeModulePaths(__dirname);compiled._compile(source,filename);
  const result=await compiled.exports.run({onProgress:message=>console.log('ARM '+arm+' '+message)});
  assert.deepEqual(validateSources(options.receiptPath?{receiptPath:options.receiptPath}:{}),sourceReceipt,'all source receipt bytes and HEAD unchanged');
  const evidence={...result,verdict:'DIAGNOSTIC',observationVerdict:result.verdict,diagnosticLabel:LABEL,resourceAcceptance:false,
    arm,runId:activeRunId,sourceReceipt,startedUTC,elapsedMs:performance.now()-start,sourcePins:pins,runtimeFlagsPresent:false,fixture:fixtureEvidence,
    vectorSummary:vectors(result),limitations:[...result.limitations,
      'Single A/B pair does not prove universal causality or a peak distribution; no production equivalence.',
      'Additional used+embedder+backing vector is diagnostic only; original total-based 96MiB metric is unchanged.']};
  write(output(arm),evidence);
  console.log('R1-POPULATION '+arm+' '+LABEL+'; original observations '+result.verdict+'; '+result.completedPages+' pages; '+result.summary.requests+' requests; '+(result.oversizeRefusal||'oversize incomplete'));
  console.log(JSON.stringify({arm,summary:result.summary,vectors:evidence.vectorSummary,failure:result.failure||null}));
  const complete=result.completedPages===96&&result.summary.requests===97&&result.oversizeRefusal==='413 RECONCILE_LIMIT';
  process.exitCode=complete?0:1;
}
async function run(options={}){
  assert.equal(Object.hasOwn(process.env,'MINIFLARE_WORKERD_V8_FLAGS'),false);
  options=validateOptions(options);activeRunId=options.runId;
  const sourceReceipt=validateSources(options.receiptPath?{receiptPath:options.receiptPath}:{}),{base,productBase,sourcePins:pins}=sourceReceipt;
  const pairPath=path.join(dir,stem(activeRunId)+'-pair.json'),prior=prepareEvidenceDirectory(dir,activeRunId);
  const outcomes=[];
  for(const arm of ['A','B']){
    assert.deepEqual(validateSources(options.receiptPath?{receiptPath:options.receiptPath}:{}),sourceReceipt,'same caller source receipt before each child');
    const args=[__filename,'--child',arm,...(options.receiptPath?['--source-pins',options.receiptPath,'--run-id',options.runId]:[])];
    const outcome=await new Promise((resolve,reject)=>{const proc=spawn(process.execPath,args,
      {cwd:repo,windowsHide:true,stdio:'inherit',env:{...process.env}});proc.once('error',reject);proc.once('exit',(code,signal)=>resolve({arm,code,signal}));});
    outcomes.push(outcome);
    if(!fs.existsSync(output(arm))){write(output(arm),{diagnosticLabel:LABEL,resourceAcceptance:false,arm,childFailure:outcome});}
  }
  assert.deepEqual(validateSources(options.receiptPath?{receiptPath:options.receiptPath}:{}),sourceReceipt);for(const p of prior)assert.equal(sha(fs.readFileSync(path.join(dir,p.name))),p.sha256,'preserved '+p.name);
  const arms=['A','B'].map(arm=>JSON.parse(fs.readFileSync(output(arm),'utf8')));
  for(const evidence of arms)if(evidence.sourceReceipt)assert.deepEqual(evidence.sourceReceipt,sourceReceipt,'each child executed the same caller source receipt');
  const complete=arms.every(x=>x.completedPages===96&&x.summary?.requests===97&&x.oversizeRefusal==='413 RECONCILE_LIMIT');
  let sameOwnSemantics=false;if(arms.every(x=>x.fixture)){assert.deepEqual(arms[0].fixture.semantics,arms[1].fixture.semantics,'same own scope/request/target semantics');sameOwnSemantics=true;}
  write(pairPath,{diagnosticLabel:LABEL,resourceAcceptance:false,base,productBase,runId:activeRunId,sourceReceipt,sourcePins:pins,preservedEvidence:prior,childOutcomes:outcomes,
    complete,sameOwnSemantics,completedPages:arms.reduce((n,x)=>n+(x.completedPages||0),0),requests:arms.reduce((n,x)=>n+(x.summary?.requests||0),0),
    arms:arms.map((x,i)=>({arm:['A','B'][i],evidenceSha256:sha(fs.readFileSync(output(['A','B'][i]))),observationVerdict:x.observationVerdict,
      fixture:x.fixture,summary:x.summary,elapsedMs:x.elapsedMs,vectorSummary:x.vectorSummary,failure:x.failure||x.childFailure||null})),
    limitation:'One A/B pair, not resource acceptance or universal causality; no product/metric/cap/runtime changes.'});
  console.log('R1-POPULATION PAIR '+LABEL+'; complete='+complete+'; same-own-semantics='+sameOwnSemantics+'; '+arms.reduce((n,x)=>n+(x.completedPages||0),0)+' pages');
  process.exitCode=complete&&sameOwnSemantics?0:1;
}
function parseArgs(args){
  const options={},seen=new Set();let arm=null;
  for(let i=0;i<args.length;i+=2){const key=args[i],value=args[i+1];assert(['--child','--source-pins','--run-id'].includes(key)&&value&&!seen.has(key),'closed diagnostic arguments');seen.add(key);if(key==='--child')arm=value;else options[key==='--source-pins'?'receiptPath':'runId']=value;}
  return {arm,options:validateOptions(options)};
}
module.exports={populate,run,vectors,sourcePins,validateSources,prepareEvidenceDirectory,assertStringSize,D1_STRING_BYTES,SOURCE_FILES,parseArgs};
if(require.main===module)Promise.resolve().then(()=>{const {arm,options}=parseArgs(process.argv.slice(2));return arm?child(arm,options):run(options);}).catch(()=>{
  console.error('R1-POPULATION '+LABEL+'; diagnostic setup or execution failed; no acceptance claim');process.exitCode=1;
});
