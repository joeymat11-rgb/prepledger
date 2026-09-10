'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url'),{createHash}=require('node:crypto');
const w6=path.resolve(process.argv[2]||'../m3-w6-browser-bridge');
const modelPath=process.env.EARNED_EDIT_MODEL||path.join(__dirname,'workout-edit-model.cjs');
const {ASSUMPTION,createWorkoutEditModel}=require(modelPath);
const Ops=require(path.join(w6,'rebuild/client/ops.cjs'));
const K='synthetic-workout-edit-model-only';
const sha=x=>createHash('sha256').update(x).digest('hex');
const date={local_date:'2026-09-09',local_time:'12:00',utc_offset:'-04:00'};
const quantity=(value,unit='lb')=>({value,unit});
function op(id,kind,{payload={},target,parents=[],schema_version=2,...extra}={}){
 return Ops.build({op_id:id,athlete_id:'ath-1',device_id:'device-'+id,device_seq:1,
  class:'session',kind,effective:date,lease_id:'synthetic-unissued',schema_version,
  payload,target,parents,extra},K);
}
const set=(id='s',extra={})=>op(id,'session-set',{session_start_op_id:'start',logical_set_slot:'slot-1',lift_lineage_id:'lift-1',
 payload:{load:quantity(40),reps:quantity(8,'rep'),reserve:{tag:'exact',value:0,unit:'rep'}},...extra});
const correction=(id,target,replacement_fields,extra={})=>op(id,'correction',{target,payload:{replacement_fields},...extra});
const tombstone=(id,target)=>op(id,'tombstone',{target,payload:{reason:'Synthetic mistake'}});
const capture=()=>{const cell=()=>({state:'unknown',display:'Unknown synthetic instruction',source_json:null});return {
 profile:'earned/workout-prescription/v1',producer:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},
 basis:{plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',source_revision:1},session:{instruction:cell(),reason:cell(),confidence:cell()},
 slots:[{logical_set_slot:'slot-1',lift_lineage_id:'lift-1',label:'Synthetic lift',load:cell(),reps:cell(),effort:cell(),setup:cell(),reason:cell(),confidence:cell()}]};};
const start=()=>op('start','session-start',{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',prescription_capture:capture()});
async function main(){
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs')).href);
 const model=createWorkoutEditModel({parseStrictJson}),results=[];
 const check=(name,fn)=>{fn();results.push(name);console.log('PASS '+name);};
 const input=ops=>({assumption:ASSUMPTION,athleteId:'ath-1',watermark:ops.length,records:ops.map((o,i)=>({sequence:i+1,operationBytes:JSON.stringify(o)}))});
 const run=ops=>model.project(input(ops)),fact=(out,id='s')=>out.workouts.find(r=>r.id===id);
 check('clear removes optional reserve without manufacturing unknown',()=>{
  const out=run([start(),set(),correction('c','s',{reserve:{clear:true}})]);
  assert.equal(Object.hasOwn(fact(out).current,'reserve'),false,'CLEAR_IS_ABSENCE');
  assert.deepEqual(fact(out).current.load,quantity(40));assert.deepEqual(fact(out).current.reps,quantity(8,'rep'));
 });
 check('unknown and zero remain distinct observations; missing patch is unchanged',()=>{
  assert.deepEqual(fact(run([start(),set(),correction('c','s',{reserve:{tag:'unknown'}})])).current.reserve,{tag:'unknown'});
  const out=run([start(),set(),correction('c','s',{load:quantity(45)})]);
  assert.deepEqual(fact(out).current.reserve,{tag:'exact',value:0,unit:'rep'});
 });
 check('invalid clears and forbidden identity/capture replacements refuse',()=>{
  for(const fields of [{load:{clear:true}},{reserve:{clear:false}},{reserve:{clear:true,extra:1}},{reserve:null},{session_start_op_id:'other'},{prescription_capture:{}}])
   assert.throws(()=>run([start(),set(),correction('c','s',fields)]));
  assert.throws(()=>run([start(),correction('c','start',{plan_basis:'new-basis'})]));
 });
 check('concurrent named patches preserve unrelated fields and accepted tie order',()=>{
  const a=correction('a','s',{load:quantity(45)}),b=correction('b','s',{reps:quantity(10,'rep')}),c=correction('c','s',{load:quantity(47.5)});
  const out=run([start(),set(),a,b,c]);assert.equal(fact(out).current.load.value,47.5,'ACCEPTED_TIE_ORDER');assert.equal(fact(out).current.reps.value,10);
 });
 check('all delivery permutations retain exact accepted result',()=>{
  const data=input([start(),set(),correction('a','s',{load:quantity(45)}),correction('b','s',{load:quantity(47.5)},{parents:['a']})]);
  const expected=JSON.stringify(model.project(data));let count=0;
  function permutations(items,prefix=[]){if(!items.length){assert.equal(JSON.stringify(model.project({...data,records:prefix})),expected);count++;return;}
   for(let i=0;i<items.length;i++)permutations([...items.slice(0,i),...items.slice(i+1)],[...prefix,items[i]]);}
  permutations(data.records);assert.equal(count,24);
 });
 check('complete prefix, original identity and causal target order are required',()=>{
  const data=input([start(),set(),correction('c','s',{load:quantity(45)},{parents:['s']})]);
  assert.throws(()=>model.project({...data,records:data.records.slice(1)}),{code:'PREFIX_INCOMPLETE'});
  assert.throws(()=>run([start(),correction('c','s',{load:quantity(45)}),set()]),{code:'TARGET_PREFIX'});
  assert.throws(()=>run([start(),set('s',{parents:['later']}),correction('later','s',{load:quantity(45)})]),{code:'CAUSAL_PREFIX'});
  const altered={...data.records[1],operationBytes:data.records[1].operationBytes.replace('"40"','"41"')+' '};
  assert.throws(()=>model.project({...data,records:[...data.records,altered]}),{code:'IDENTITY_CONFLICT'});
 });
 check('revising an earlier edit retains its original position',()=>{
  const out=run([start(),set(),correction('a','s',{load:quantity(10)}),correction('b','s',{load:quantity(20)}),
   correction('c','a',{replacement_fields:{load:quantity(30)}})]);
  assert.equal(fact(out).current.load.value,20,'REVISED_EDIT_KEEPS_ORIGINAL_POSITION');
  assert.equal(fact(out).effects.find(e=>e.id==='a').current.replacement_fields.load.value,30);
 });
 check('removing a correction restores earlier value and keeps originals',()=>{
  const ops=[start(),set(),correction('a','s',{load:quantity(45)}),correction('b','s',{load:quantity(50)}),tombstone('t','b')];
  const out=run(ops);assert.equal(fact(out).current.load.value,45,'REMOVED_CORRECTION_HAS_NO_EFFECT');
  assert.deepEqual(out.originals.map(r=>r.operationBytes),ops.map(JSON.stringify));assert.equal(fact(out).effects.find(e=>e.id==='b').active,false);
 });
 check('nested removal restores only its own removal and preserves other removals',()=>{
  const base=[start(),set(),tombstone('t1','s'),tombstone('t2','s'),tombstone('u1','t1')];
  assert.equal(fact(run(base)).active,false);
  const out=run([...base,tombstone('u2','t2')]);assert.equal(fact(out).active,true,'ALL_ACTIVE_REMOVALS_DISABLED');
  assert.equal(fact(out).current.load.value,40);
 });
 check('correcting a removed fact does not resurrect it',()=>{
  const base=[start(),set(),tombstone('t','s'),correction('c','s',{load:quantity(45)})];
  assert.equal(fact(run(base)).active,false);
  assert.equal(fact(run([...base,tombstone('u','t')])).current.load.value,45);
 });
 check('Start removal preserves all child records and original capture',()=>{
  const ops=[start(),set(),tombstone('t','start')],out=run(ops);
  assert.equal(fact(out,'start').active,false);assert.equal(fact(out).active,true);
  assert.deepEqual(fact(out,'start').source_context.capture,ops[0].prescription_capture);
  assert.equal(out.originals.length,3);assert.equal(out.progressionEligible,false);
 });
 check('corrected dates retain original identity and full explicit offset',()=>{
  const replacement={local_date:'2026-11-01',local_time:'01:30',utc_offset:'-05:00'};
  const ops=[start(),set(),correction('c','start',{effective:replacement,planned_split_slot_id:'slot-other'})];
  const out=run(ops);assert.equal(fact(out,'start').id,'start');assert.deepEqual(fact(out,'start').current.effective,replacement);
  assert.deepEqual(JSON.parse(out.originals[0].operationBytes).effective,date);
  assert.throws(()=>run([start(),correction('c','start',{effective:{...replacement,local_date:'2026-02-30'}})]),{code:'EFFECTIVE_INVALID'});
  assert.throws(()=>run([start(),correction('c','start',{effective:{local_date:'2026-09-10'}})]),{code:'EFFECTIVE_INVALID'});
 });
 check('Skip and Close corrections/removals have distinct factual effects',()=>{
  const skip=op('skip','session-skip',{session_start_op_id:'start',lift_lineage_id:'lift-1',skip_scope:'set',logical_set_slot:'slot-1',payload:{reason:'Mistake'}});
  const close=op('close','session-close',{session_start_op_id:'start',payload:{completion_kind:'early'}});
  const out=run([start(),skip,close,correction('cs','skip',{skip_scope:'lift',logical_set_slot:{clear:true},reason:{clear:true}}),
   correction('cc','close',{completion_kind:'normal'}),tombstone('tc','close')]);
  assert.equal(fact(out,'skip').current.skip_scope,'lift');assert.equal(Object.hasOwn(fact(out,'skip').current,'reason'),false);
  assert.equal(fact(out,'close').current.completion_kind,'normal');assert.equal(fact(out,'close').active,false);
  assert.throws(()=>run([start(),skip,correction('bad','skip',{logical_set_slot:{clear:true}})]),{code:'SKIP_RESULT_INVALID'});
 });
 check('actual candidate relation consumes corrected dates without losing change provenance',()=>{
  const {candidateEdge}=require(path.join(w6,'rebuild/client/session.cjs'));
  const a=op('a','session-start',{planned_split_slot_id:'planned-slot',plan_basis:'NO_ACCEPTED_PLAN',prescription_capture:capture()});
  const b=op('b','session-start',{planned_split_slot_id:'planned-slot',plan_basis:'NO_ACCEPTED_PLAN',prescription_capture:capture()});
  const view=row=>({slot:row.current.planned_split_slot_id,date:row.current.effective.local_date,time:row.current.effective.local_time});
  const edge=out=>candidateEdge(view(fact(out,'a')),view(fact(out,'b')));
  const first=run([a,b]);assert.equal(edge(first),true);
  const c=correction('c','a',{effective:{...date,local_date:'2026-09-10'}}),changed=run([a,b,c]);assert.equal(edge(changed),false);
  const restored=run([a,b,c,correction('d','a',{effective:date},{parents:['c']})]);assert.equal(edge(restored),true);
  assert.deepEqual(fact(restored,'a').effects.map(e=>e.id),['c','d']);
  assert.notDeepEqual(fact(restored,'a'),fact(first,'a'));assert.equal(fact(restored,'a').id,'a');
 });
 check('actual legacy command bytes preserve their missing context and typed values',()=>{
  const Client=require(path.join(w6,'rebuild/client/index.cjs')),O=require(path.join(w6,'rebuild/conform/lib/ops.cjs'));
  const client=Client.createClient({deviceId:'dev-A',athleteId:'ath-1',identityKey:O.K_IDENTITY,authorityKey:O.AUTH_KEY,
   clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0},lease:O.lease('dev-A'),online:false,standing:'enrolled'});
  client.boot();const saved=client.logSession({sets:[{load:42.5,reps:8,lift:'Legacy display label',slot:'legacy-slot'}]});assert.equal(saved.acknowledged,true);
  const originals=client.outbox().map(x=>client.envelope(x.op_id));assert.equal(originals.length,2);
  const change=client.correction(originals[1].op_id,{load:quantity(45)});assert.equal(change.acknowledged,true);originals.push(client.envelope(change.op_id));
  const out=run(originals),s=fact(out,originals[1].op_id);assert.equal(s.current.load.value,45);assert.equal(s.source_context.plan_basis,null);
  assert.equal(s.source_context.lift,'Legacy display label');assert.equal(Object.hasOwn(s.current,'reserve'),false);
  assert.deepEqual(out.originals.map(r=>r.operationBytes),originals.map(JSON.stringify));
  const foreignVersion=correction('new-edit',originals[1].op_id,{load:quantity(50)});
  const mixed=fact(run([...originals,foreignVersion]),originals[1].op_id);assert.equal(mixed.current,null);assert(mixed.issues.includes('LEGACY_BRIDGE_REQUIRED'));
 });
 check('pending operations remain separate and cannot acquire accepted effect',()=>{
  const data=input([start(),set()]),raw=JSON.stringify(correction('pending','s',{load:quantity(99)}));
  const out=model.project({...data,pending:[raw]});assert.equal(fact(out).current.load.value,40);assert.deepEqual(out.pending,[raw]);
  assert.equal(out.watermark,2);assert.equal(out.authenticated,false);assert.equal(out.activated,false);
 });
 check('new clear semantics never reinterpret a legacy operation or grant',()=>{
  const oldStart=op('start','session-start',{schema_version:1,payload:{slot:'AD_HOC'}});
  const oldSet=op('s','session-set',{schema_version:1,payload:{load:quantity(40),reps:quantity(8,'rep'),session_start_id:'start'}});
  const oldClear=correction('old-clear','s',{reserve:{clear:true}},{schema_version:1});
  const old=run([oldStart,oldSet,oldClear]);assert.equal(fact(old).current,null,'LEGACY_CLEAR_NOT_REINTERPRETED');assert.equal(fact(old).active,null);
  assert(fact(old).issues.includes('LEGACY_EDIT_INTERPRETATION_REQUIRED'));assert.equal(old.originals.length,3);
  const mixed=run([start(),set(),correction('old-capability','s',{load:quantity(45)},{schema_version:1})]);
  assert.equal(fact(mixed).current,null);assert(fact(mixed).issues.includes('MIXED_SCHEMA_EDIT_BRIDGE_REQUIRED'));
 });
 check('replayed originals and repeated projection never mutate retained input',()=>{
  const data=input([start(),set(),correction('c','s',{reserve:{clear:true}})]),raw=JSON.stringify(data);
  const first=model.project(data);first.workouts[1].current.load.value=999;
  assert.equal(fact(model.project(data)).current.load.value,40);assert.equal(JSON.stringify(data),raw);
  assert.deepEqual(model.project({...data,records:[...data.records,data.records[1]]}),model.project(data));
 });
 check('canonical distinctions and literal original JSON survive interpretation',()=>{
  const Canonical=require(path.join(w6,'rebuild/client/canonical.cjs'));
  const encoded=[{}, {reserve:null}, {reserve:{clear:true}}, {reserve:{tag:'unknown'}}, {reserve:{tag:'exact',value:0,unit:'rep'}}].map(x=>Canonical.encode(x));
  assert.equal(new Set(encoded).size,5);
  const data=input([start(),set()]);data.records[0].operationBytes=' \n'+data.records[0].operationBytes+'\n';
  const out=model.project(data);assert.equal(out.originals[0].operationBytes,data.records[0].operationBytes,'LITERAL_ORIGINAL_BYTES');
 });
 const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-workout-edit-model-'));
 const evidence={modelPath,modelSha256:sha(fs.readFileSync(modelPath)),testSha256:sha(fs.readFileSync(__filename)),w6,results,
  limits:'Nonshipping proposed semantics. Actual legacy client bytes, assumed accepted sequence, no authority/signature/IDB/science/activation verdict.'};
 fs.writeFileSync(path.join(output,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
 console.log('WORKOUT EDIT MODEL '+results.length+' PASS\n'+path.join(output,'evidence.json'));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
