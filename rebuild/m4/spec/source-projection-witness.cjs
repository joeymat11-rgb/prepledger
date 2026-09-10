'use strict';
// Local synthetic boundary witness. The original 76b714d reached-RED receipt is
// retained in the report; current composition must now display remote facts.
// No installed engine, T2 source, law, private fixture or authority is changed.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const m4=path.resolve(__dirname,'../../..'),r1=path.resolve(process.argv[2]||''),w6=path.resolve(process.argv[3]||'');
if(!process.argv[2]||!process.argv[3])throw Error('Provide retained R1 and W6 worktrees');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-projection-boundary-')),sha=x=>createHash('sha256').update(x).digest('hex');
const run=cp.spawnSync(process.execPath,[path.join(w6,'rebuild/m3/w6/test/run-source-import.cjs'),r1,m4],{cwd:w6,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:8e6});
fs.writeFileSync(path.join(dir,'joined-baseline.log'),(run.stdout||'')+(run.stderr||''));assert.equal(run.status,0,'Actual joined baseline required');
const composition=run.stdout.match(/SOURCE RECOVERY COMPOSITION (.+)/)?.[1].trim();assert(composition,'Explicit composition required');
const file=path.join(composition,'rebuild/m3/w6/test/recovery-stage/source-import.test.mjs'),original=fs.readFileSync(file),needle="  const final=await recover(),finalCandidate=await final.assemble();";
assert.equal(original.toString().split(needle).length,2,'Exact current integration witness cut');
const injection=`
  const witnessDisplay=await client.reopen();assert(witnessDisplay.view,witnessDisplay.refusal?.code);
  assert.equal(Object.keys((await repo.load()).generation.collections.outbox).length,5,'Five pending originals remain');
  assert.equal(witnessDisplay.view.layer1.reads.some(row=>row.op_id===remote.op_id),true,
    'SOURCE_CURRENT_PROJECTION_REMOTE_READING: accepted phone-B original must reach factual view');
`;
let green;try{
  fs.writeFileSync(file,original.toString().replace(needle,injection+needle));
  green=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',file],{cwd:composition,env:{...process.env,EARNED_ROWS_R1_ROOT:composition,EARNED_IMPORT_M4_ROOT:m4},encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:8e6});
}finally{fs.writeFileSync(file,original);}
fs.writeFileSync(path.join(dir,'remote-reading-green.log'),(green.stdout||'')+(green.stderr||''));
assert.equal(green.status,0,'Current actual remote-reading witness must pass');
assert.equal(sha(fs.readFileSync(file)),sha(original),'Restore copied test exactly');
const F=require(path.join(m4,'rebuild/m3/w7-preview/fixtures.cjs'));
const E=require(path.join(m4,'rebuild/engine/index.cjs')).createEngine({clock:{today:()=>F.SYNTHETIC_DAY,hour:()=>12,nowISO:()=>F.SYNTHETIC_DAY+'T12:00:00.000Z'}});
const state=F.createSyntheticState(),saved=structuredClone(state),existing=state.reads[0];assert(existing&&Number.isFinite(existing.w));
const unchanged=E.applyRead(state,existing.d,existing.w+1,{hour:8});
assert.deepEqual(unchanged,saved,'Existing writer silently keeps the first same-date reading');assert.deepEqual(state,saved,'Input source untouched');
const C=require(path.join(r1,'rebuild/m3/w5/reconciliation/codec.cjs')),S=require(path.join(r1,'rebuild/m3/w5/source/codec.cjs'));
const before=S.frontier(()=>undefined,0),checkpoint={revision:1,token:'synthetic-only',generation:{collections:{sync:{frontier:{W:0,authorityW:0}},ops:{},outbox:{}},metadata:{}}};
const material={source_json:JSON.stringify(saved),candidate_json:JSON.stringify(saved),local_json:JSON.stringify(saved),checkpoint_json:JSON.stringify(checkpoint),engine_context_json:'{}'};
const prepared=S.prepareMaterial('synthetic-no-engine-coverage',material,before);
assert.deepEqual(S.material(C.encode(material),prepared.manifest),material,'Source custody alone accepts an empty engine context');
const evidence={profile:'earned/source-projection-boundary/v2',composition,
  joinedBaseline:'PASS',remoteReadingCurrentProjection:'PASS',sameDateLegacyWriter:'FIRST_READING_RETAINED_WITHOUT_NEW_READING',
  engineContextCoverage:'NOT_REQUIRED_BY_SOURCE_CUSTODY',copiedTestRestored:true,
  testSourceSha256:sha(original),engineWriterSha256:sha(fs.readFileSync(path.join(m4,'rebuild/engine/writers.cjs'))),
  next:'Separate accepted machine projection from pending local factual overlays; establish source coverage and explicit reading conflict semantics before active publication.'};
fs.writeFileSync(path.join(dir,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
console.log('PROJECTION FACTUAL BOUNDARY PASS — remote original reaches actual reopened face; same-date writer/context limits remain open; '+dir);
