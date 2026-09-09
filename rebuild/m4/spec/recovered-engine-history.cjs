'use strict';
// Execute the existing actual Worker/D1/P1 archive fixture with one explicit
// source-to-reader assertion added in a disposable test module. Product files,
// original tests, accepted R1 runtime and installed engine remain unchanged.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../../..'),w6=path.resolve(process.argv[2]||''),r1=path.resolve(process.argv[3]||'');
if(!process.argv[2]||!process.argv[3])throw Error('Provide retained W6 root and prepared734 public R1 root');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),url=p=>pathToFileURL(p).href;
const sourcePath=path.join(w6,'rebuild/m3/w6/test/recovery-stage/archive-history.test.mjs'),raw=fs.readFileSync(sourcePath);
if(sha(raw)!=='472595699dbb88a122f5fc57522ebae80ba5b1d9a64ef8de8cce56c3b4bc72f0')throw Error('Archive fixture source changed');
const pin='734986a688366293349145e6feb80fd4130d3702';
for(const rel of ['reconciliation/codec.cjs','reconciliation/paged-codec.cjs','reconciliation/project.cjs','reconciliation/transport.cjs','public-client.cjs']){
 const name='rebuild/m3/w5/'+rel,git=cp.spawnSync('git',['show',pin+':'+name],{cwd:w6,windowsHide:true});
 if(git.status!==0||!fs.readFileSync(path.join(r1,name)).equals(git.stdout))throw Error('Prepared R1 dependency changed '+name);
}
const out=fs.mkdtempSync(path.join(root,'.tmp/recovered-engine-history-')),file=path.join(out,'archive-plus-engine.test.mjs');
const idbRoot=path.join(w6,'rebuild/m3/w6/node_modules/fake-indexeddb'),idbPackage=JSON.parse(fs.readFileSync(path.join(idbRoot,'package.json'),'utf8'));
let source=raw.toString().replace(/from '([^']+)'/g,(full,name)=>{
 if(name.startsWith('.'))return "from '"+url(path.resolve(path.dirname(sourcePath),name))+"'";
 if(name==='fake-indexeddb')return "from '"+url(path.join(idbRoot,idbPackage.exports['.'].import))+"'";
 return full;
});
source=`import Mapper from '${url(path.join(root,'rebuild/m4/workout/engine-history.cjs'))}';
import Source from '${url(path.join(root,'rebuild/m4/spec/performed-proposal/source.cjs'))}';
import {projectWorkoutRecords} from '${url(path.join(w6,'rebuild/m4/workout/project-history.mjs'))}';
const engineCandidate=Source.construct(Source.baseline());
const E=Source.load(engineCandidate.sources)('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock:{today:()=> '2026-09-04'}});
`+source;
const replace=(a,b)=>{if(source.split(a).length!==2)throw Error('Exact unique test insertion missing');source=source.replace(a,b);};
replace('  const reopened=await f.fresh();try{',`  // Close is an actual factual command. The historical projection remains
  // inactive; this never clears its current-prescription guard.
  const closed=await c.execute('workout',{action:'close',input:{session_start_op_id:started.op_id,completion_kind:'early',causal_parents:[started.op_id,saved.op_id]}});
  assert(closed.acknowledged,closed.code);
  const reopened=await f.fresh();try{`);
replace('   const fact=again.history.sessions[0].projection.facts[0];',`   await t.test('existing authenticated recovered index feeds actual M4 order and corrected reader',async()=>{
    const snapshot=await reopened.repository.load(),before=JSON.stringify(snapshot);
    assert.equal(snapshot.generation.collections.receipts['1'].op_id,remote.op_id);
    // The fixture's declared producer emits exactly these two positions from
    // this original plan. No arbitrary ID decoding or current plan lookup.
    const mapper=Mapper.createEngineHistoryProjector({athleteId:'first',deviceId:device,parseStrictJson,projectWorkoutRecords,
     resolveCapturedLayout:({start})=>{
      assert.deepEqual(start.prescription_capture,originalStart.prescription_capture);
      assert.deepEqual(start.prescription_capture.producer,identity);
      return {profile:'earned/captured-lift-layout/v1',producer:identity,basis:originalStart.prescription_capture.basis,
       correspondence_profile:'synthetic/archive-fixture-two-positions/v1',slots:[0,1].map(i=>({logical_set_slot:'synthetic-slot-'+i,lift_lineage_id:'synthetic-lift',position:i+1,prescribed_effort:{state:'unknown'}}))};
     }});
    const mapped=mapper.project(again.history,snapshot.generation,{sourceRevision:snapshot.revision}),entry=mapped.sessions[0].record.entries[0];
    assert.equal(mapped.source_order.frontier,1);assert.deepEqual(mapped.order.start_ids,[started.op_id]);
    assert.equal(entry.slots[0].fact.original.reps.value,8);assert.equal(entry.slots[0].fact.current.reps.value,9);
    assert.deepEqual(entry.slots[0].fact.edit_op_ids,[saved.op_id]);assert.deepEqual(entry.slots[0].fact.current.reserve,{tag:'at_least',value:3,unit:'rep'});
    assert.equal(entry.slots[1].state,'unlogged');assert.equal(E.sessionScore(entry),360);assert.deepEqual(E.terminalRir(entry),{tag:'absent'});
    assert.equal(JSON.stringify(snapshot),before);assert.equal(mapped.progression_eligible,false);
    assert.equal(snapshot.generation.collections.sync.snapshot.recoveryPlan.profile,'earned/recovered-plan-snapshot/v1');
    console.log('RECOVERED ENGINE JOIN PASS — existing authenticated receipt index; original/current/edit/bound/unlogged preserved; accounting360; historical projection inactive');
   });
   const fact=again.history.sessions[0].projection.facts[0];`);
fs.writeFileSync(file,source);
const pins={};for(const [label,p]of Object.entries({archiveFixture:sourcePath,publicClient:path.join(w6,'rebuild/m3/w6/public-client.mjs'),storedHistory:path.join(w6,'rebuild/m4/workout/stored-history.mjs'),mapper:path.join(root,'rebuild/m4/workout/engine-history.cjs'),order:path.join(root,'rebuild/m4/workout/engine-order.cjs'),reader:path.join(root,'rebuild/m4/spec/performed-proposal/factory.cjs')}))pins[label]=sha(fs.readFileSync(p));
const run=cp.spawnSync(process.execPath,['--test',file],{cwd:w6,env:{...process.env,EARNED_ROWS_R1_ROOT:r1},windowsHide:true,encoding:'utf8',maxBuffer:8e6});
fs.writeFileSync(path.join(out,'run.log'),run.stdout+run.stderr);
const pass=run.status===0&&run.stdout.includes('RECOVERED ENGINE JOIN PASS');
fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({profile:'earned/recovered-engine-history-test/v1',pins,generatedTestSha:sha(source),r1:pin,exit:run.status,pass,runtimeEdited:false,currentProjectionActivated:false,prescriptionQualified:false},null,2));
process.stdout.write(run.stdout+run.stderr);console.log('Evidence '+out);if(!fs.readFileSync(sourcePath).equals(raw))throw Error('Original test source changed');process.exitCode=pass?0:1;
