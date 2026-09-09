'use strict';
// Synthetic source-construction proof only. Actual engine factories and actual
// retained factual projector; no authority/producer/science/private acceptance.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),{pathToFileURL}=require('node:url');
const S=require('./source.cjs'),NativeDate=Date,clone=structuredClone;
const {orderWorkoutStarts}=require('../../workout/engine-order.cjs');
const before=S.baseline(),candidate=S.construct(before),F=require('../../../m3/w7-preview/fixtures.cjs');
const clock={today:()=>F.SYNTHETIC_DAY,nowMs:()=>NativeDate.UTC(2030,1,4,12),nowISO:()=> '2030-02-04T12:00:00.000Z',hour:()=>12,dow:()=>1};
function engine(sources){const load=S.load(sources),E=load('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});
 Object.assign(E,load('rebuild/engine/writers.cjs')(E,{clock,ids:{next(){throw Error('Unexpected writer');}},drafts:{length:0,key:()=>null}}));return E;}
function legacy(E,R){
 let n=0;for(const length of [1,2,3,4])for(const opener of [null,0,1,2,3])for(const terminal of [null,0,1,2,3])for(const held of [false,true]){
  const s=F.createSyntheticState(),ex=s.exercises[0];ex.holdFlag=held;ex.lastMeta={w:40,reps:Array(length).fill(8),rirSets:Array(length).fill(null)};
  ex.lastMeta.rirSets[0]=opener;if(length>1)ex.lastMeta.rirSets[length-1]=terminal;
  const observe=X=>({step:X.progressStep(ex,s),rir:X.rirSetsOf(ex.lastMeta),receipt:X.rirReceipt(ex.lastMeta),
   opener:X.openerRir(ex.lastMeta),terminal:X.terminalRir(ex.lastMeta),score:X.sessionScore(ex.lastMeta)});
  assert.deepEqual(observe(E),observe(R),'LEGACY_WHOLE_OUTPUT');n++;
 }
 for(const value of [null,{}, {w:null,reps:[8]}, {w:0,reps:[8]}, {w:'40',reps:[8,7]}, {w:40,reps:['8',7]}, {w:40,reps:[0,0]}]){
  assert.equal(E.sessionScore(value),R.sessionScore(value),'LEGACY_SCORE_INPUTS');n++;
 }
 const state=F.createSyntheticState();assert.deepEqual(E.typicalError(state,'demo-press'),R.typicalError(state,'demo-press'),'LEGACY_NOISE_WHOLE_OUTPUT');n++;
 return n;
}
async function main(){
 const w6=process.env.PERFORMED_W6_DIR;assert(w6,'Explicit PERFORMED_W6_DIR is required');
 const w6Pin='f7e7e42f35a2128e753b0f6cef4d9f6b954a29b1';
 const w6Files=['rebuild/m4/workout/project-history.mjs','rebuild/m4/workout/schema.cjs','rebuild/m4/workout/capture.cjs','rebuild/m3/w6/strict-json.mjs'];
 const w6Hashes={};for(const file of w6Files){const bytes=fs.readFileSync(path.join(w6,file)),p=cp.spawnSync('git',['show',w6Pin+':'+file],{cwd:S.root,windowsHide:true,maxBuffer:8e6});
  assert.equal(p.status,0);assert(bytes.equals(p.stdout),'Pinned retained projector/schema');w6Hashes[file]=S.sha(bytes);}
 const {projectWorkoutRecords}=await import(pathToFileURL(path.join(w6,w6Files[0]))),{validateWorkoutShape}=require(path.join(w6,w6Files[1]));
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,w6Files[3])));
 const capture=require(path.join(w6,w6Files[2])).createPrescriptionCapture({parseStrictJson});
 const exact=value=>({tag:'exact',value,unit:'rep'}),bound={tag:'at_least',value:3,unit:'rep'},absent=undefined;
 const reserves=[exact(0),exact(1),exact(2),bound,absent,{tag:'unknown'},{tag:'skipped'},{tag:'not_asked'}];
 function record({weights=[40,35,30],repetitions=[8,7,6],ratings=[exact(2),exact(0),bound],skipTerminal=false,skipPosition=null,correctMiddle=false,removeMiddle=false,startId='start',day=F.SYNTHETIC_DAY,terminalTarget=0}={}){
  const ops={},keys=[],slot=i=>JSON.stringify(['demo-press',i+1]);
  const producer={app_build:'synthetic-reader-proposal',engine_build:S.base,rule_profile:'earned/lift-position/v1',source_schema:'2'};
  const basis={plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:1};
  const cell=(display,value)=>({state:'specified',display,source_json:JSON.stringify(value)}),unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
  const captured=capture.prepare({profile:capture.profile,producer,basis,session:{instruction:cell('Synthetic workout','synthetic'),reason:unknown(),confidence:unknown()},
   slots:[40,35,30].map((w,i)=>({logical_set_slot:slot(i),lift_lineage_id:'demo-press',label:'Synthetic lift',load:cell(w+' lb',{value:w,unit:'lb'}),
    reps:cell('8 reps',{value:8,unit:'rep'}),effort:i===2&&terminalTarget===null?unknown():cell((i===2?terminalTarget:2-i)+' reps left',{target:i===2?terminalTarget:2-i,unit:'rep'}),setup:unknown(),reason:unknown(),confidence:unknown()}))},{producer,basis});
  const idOf=id=>id===startId?id:startId+'/'+id;
  function op(kind,id,fields,payload,parents){const full={op_id:idOf(id),kind,athlete_id:'synthetic-athlete',device_id:'synthetic-device-'+startId,device_seq:keys.length+1,
   device_predecessor_op_id:keys.at(-1)||null,class:'session',effective:{local_date:day,local_time:'12:00',utc_offset:'-05:00'},
   schema_version:2,lease_id:'synthetic-lease-'+startId,canonical_content_commitment:'synthetic-unverified',causal_parents:parents.map(idOf),...fields,
   ...(fields.target_op_id?{target_op_id:idOf(fields.target_op_id)}:{}),payload};
   assert.equal(validateWorkoutShape(full,Object.hasOwn(full,'prescription_capture')?{prescriptionCapture:capture}:{}).valid,true,'ACTUAL_SCHEMA_VALID');ops[full.op_id]=full;keys.push(full.op_id);return full;}
  op('session-start',startId,{planned_split_slot_id:'synthetic-slot',plan_basis:'synthetic-plan',prescription_capture:captured},{},[]);
  for(let i=0;i<weights.length;i++){
   if(skipTerminal&&i===weights.length-1||i===skipPosition){op('session-skip','skip',{session_start_op_id:startId,logical_set_slot:slot(i),lift_lineage_id:'demo-press',skip_scope:'set'},{reason:'Time'},[startId]);continue;}
   op('session-set','set'+i,{session_start_op_id:startId,logical_set_slot:slot(i),lift_lineage_id:'demo-press'},
    {load:{value:weights[i],unit:'lb'},reps:{value:repetitions[i],unit:'rep'},...(ratings[i]===undefined?{}:{reserve:clone(ratings[i])})},[startId]);
  }
  op('session-close','close',{session_start_op_id:startId},{completion_kind:skipTerminal||skipPosition!==null?'early':'normal'},[startId]);
  if(correctMiddle)op('correction','edit',{target_op_id:'set1',lift_lineage_id:'demo-press'},{replacement_fields:{load:{value:25,unit:'lb'}}},['set1']);
  if(removeMiddle)op('tombstone','remove',{target_op_id:'set1',lift_lineage_id:'demo-press'},{reason:'Mistaken entry'},[correctMiddle?'edit':'set1']);
  const snapshot=JSON.stringify(ops),projection=projectWorkoutRecords({start:{status:'accepted-through-frontier'},records:keys.slice(1).map(id=>({operation:ops[id],status:'accepted-through-frontier'}))},ops);
  assert.equal(JSON.stringify(ops),snapshot,'PROJECTOR_DOES_NOT_REWRITE_SOURCE');
  // Proposed producer-owned mapping, NOT a qualified producer or proof that
  // arbitrary historical strings have this meaning. No chronology is inferred.
  const originalCapture=ops[startId].prescription_capture;
  assert.equal(projection.close_records.length,1,'One explicit synthetic completion');
  const entry={profile:'earned/performed-lift/v1',start_op_id:startId,lift_lineage_id:'demo-press',completion:clone(projection.close_records[0]),capture:clone(originalCapture),slots:originalCapture.slots.map((planned,i)=>{
   const fact=projection.facts.find(f=>f.logical_set_slot===planned.logical_set_slot),prescribed=planned.effort.state==='specified'?parseStrictJson(planned.effort.source_json):null;
   const skip=Object.values(ops).find(op=>op.kind==='session-skip'&&op.logical_set_slot===planned.logical_set_slot);
   return {position:i+1,logical_set_slot:planned.logical_set_slot,prescribed_effort:prescribed?{state:'specified',target:prescribed.target}:{state:'unknown'},
    ...(fact?{state:fact.included?'performed':'removed',fact:clone(fact)}:skip?{state:'skipped',skip_op_id:skip.op_id}:{state:'unlogged'})};
  })};return {entry,ops,projection};
 }
 function rich(E){let count=0;const check=(label,fn)=>{fn();count++;};
  const a=record(),changed=record({correctMiddle:true}),aBytes=JSON.stringify(a);
  check('weighted',()=>{assert.equal(E.sessionScore(a.entry),745,'PERFORMED_WEIGHTED_SCORE');assert.equal(E.sessionScore(changed.entry),675,'PERFORMED_CORRECTION_SCORE');});
  check('typed',()=>{assert.deepEqual(E.rirSetsOf(a.entry),[exact(2),exact(0),bound],'PERFORMED_TYPED_EFFORT');
   assert.equal(E.rirReceipt(a.entry),'RIR 2→at least 3','PERFORMED_BOUND_RECEIPT');const copy=E.rirSetsOf(a.entry);copy[2].value=999;assert.equal(JSON.stringify(a),aBytes,'READERS_PRESERVE_SOURCE');});
  const s=F.createSyntheticState(),ex=s.exercises[0];
  for(const opener of reserves)for(const terminal of reserves){const en=record({ratings:[opener,exact(0),terminal]}).entry;ex.lastMeta=en;
   const numeric=value=>value?.tag==='exact'?value.value:value?.tag==='at_least'?3:null,o=numeric(opener),t=numeric(terminal);
   const expected=t===3?3:t===1||t===2?2:t===0?1:o===3?2:1;
   check('step',()=>{const result=E.progressStep(ex,s);assert.equal(result.add,expected,'PERFORMED_TYPED_STEP');
    assert.equal(E.sessionScore(en),745,'PERFORMED_UNRATED_STILL_PERFORMED');
    assert.doesNotMatch(result.why,/\[object Object\]|undefined|NaN/,'PERFORMED_NO_COERCION_PROSE');
    if(terminal?.tag==='at_least'||t===null&&opener?.tag==='at_least')assert.match(result.why,/at least 3/,'PERFORMED_BOUND_STEP_PROSE');
    ex.holdFlag=true;assert.deepEqual(E.progressStep(ex,s),result,'PERFORMED_LOAD_HOLD_NOT_REP_VETO');ex.holdFlag=false;});
  }
  const partial=record({ratings:[bound,exact(0),undefined],skipTerminal:true}),removed=record({ratings:[bound,exact(0),undefined],skipTerminal:true,removeMiddle:true});
  check('terminal',()=>{ex.lastMeta=partial.entry;assert.deepEqual(E.terminalRir(partial.entry),{tag:'skipped'},'PERFORMED_PLANNED_TERMINAL');
   assert.equal(E.progressStep(ex,s).add,2,'PERFORMED_MISSING_TERMINAL_BRANCH_CONDITIONAL');assert.equal(E.sessionScore(partial.entry),565,'PERFORMED_PARTIAL_WORK');
   assert.equal(E.sessionScore(removed.entry),320,'PERFORMED_REMOVED_WORK');assert.deepEqual(E.rirSetsOf(removed.entry),[bound,{tag:'removed'},{tag:'skipped'}],'PERFORMED_POSITIONS_NOT_COMPRESSED');});
  check('zero',()=>{assert.equal(E.sessionScore(record({repetitions:[0,0,0]}).entry),null,'PERFORMED_ZERO_REPS');});
  check('captured-target-prose',()=>{ex.lastMeta=record({ratings:[exact(2),exact(1),exact(0)],terminalTarget:1}).entry;
   const result=E.progressStep(ex,s);assert.equal(result.add,1);assert.match(result.why,/recorded effort target was 1/,'PERFORMED_ORIGINAL_TARGET_PROSE');
   assert.doesNotMatch(result.why,/exactly as prescribed|set meant to reach failure/,'PERFORMED_NO_FALSE_PRESCRIBED_FAILURE');});
  check('unknown-target-prose',()=>{ex.lastMeta=record({terminalTarget:null}).entry;const result=E.progressStep(ex,s);
   assert.match(result.why,/recorded effort target is unavailable/,'PERFORMED_NO_INVENTED_TARGET');assert.doesNotMatch(result.why,/exactly as prescribed/);});
  const truth={exact0:[false,false,false,true,true,true,false,false],exact1:[false,false,true,true,true,false,true,false],
   exact2:[false,true,true,true,false,false,false,true],atleast3:[true,true,true,false,false,false,false,false]};
  for(const [name,value]of [['exact0',exact(0)],['exact1',exact(1)],['exact2',exact(2)],['atleast3',bound]])check('truth',()=>{
   assert.deepEqual(['gte3','gte2','gte1','lte2','lte1','eq0','eq1','eq2'].map(p=>E.effortIs(value,p)),truth[name],'PERFORMED_FULL_BOUND_TRUTH_TABLE');});
  for(const tag of ['absent','unknown','skipped','not_asked','removed','unresolved'])check('unknown',()=>assert.equal(E.effortIs({tag},'gte3'),null,'PERFORMED_UNKNOWN_NOT_FALSE'));
  check('unsupported',()=>{assert.throws(()=>E.effortIs(bound,'gte4'),/UNREGISTERED/);assert.throws(()=>E.effortIs(exact(3),'gte3'),/INVALID/);
   assert.throws(()=>E.effortIs({tag:'made-up'},'gte3'),/INVALID/);const bad=clone(a.entry);bad.slots[1].position=3;assert.throws(()=>E.sessionScore(bad),/INVALID/);});
  check('rejected-is-not-removed',()=>{const bad=clone(removed.entry);bad.slots[1].fact.source_status='rejected';
   assert.throws(()=>E.sessionScore(bad),/PERFORMED_ENTRY_INVALID/,'PERFORMED_REJECTED_NOT_REMOVED');});
  check('completion-not-inferred-from-sets',()=>{const open=clone(a.entry);delete open.completion;
   assert.throws(()=>E.typicalError({workoutFacts:{profile:'earned/workout-facts/v1',sessions:[{start_op_id:open.start_op_id,
    effective:{local_date:F.SYNTHETIC_DAY},record:{entries:[open]}}]}},'demo-press'),/PERFORMED_COMPLETION_REQUIRED/,'PERFORMED_COMPLETION_NOT_INFERRED');});
  check('block-slope',()=>{const pts=[0,1,2,3].map(i=>({en:record({weights:[40,40,40],repetitions:[8+i,7,6],startId:'start'+i}).entry}));
   const legacyPts=[0,1,2,3].map(i=>({en:{w:40,reps:[8+i,7,6]}}));assert.deepEqual(E._blockSlope(pts),E._blockSlope(legacyPts),'PERFORMED_ACTUAL_SLOPE_UNIFORM_PARITY');});
  const noiseState=(rows)=>{const state=F.createSyntheticState();state.sessionLog={};
   // Synthetic accepted source index. The host must authenticate its generation
   // before calling this same producer step; no signature is simulated here.
   const ops={},receipts={},sessions=[];let W=0;
   for(const row of rows){for(const [id,op]of Object.entries(row.ops)){ops[id]=clone(op);receipts[id]={op_id:id,seq:++W};}
    const start=row.entry.start_op_id;sessions.push({start:{operation:clone(ops[start]),status:'accepted-through-frontier',receipt_sequence:receipts[start].seq}});}
   const order=orderWorkoutStarts({frontier:W,sessions},{collections:{ops,receipts,sync:{frontier:{W}}}});
   state.workoutFacts={profile:'earned/workout-facts/v1',order,sessions:rows.map(r=>({
    start_op_id:r.entry.start_op_id,effective:clone(r.ops[r.entry.start_op_id].effective),record:{entries:[clone(r.entry)]}}))};return state;};
  const reps=[[8,7,6],[9,7,7],[8,9,6],[10,8,8]],series=()=>reps.map((r,i)=>record({repetitions:r,startId:'noise'+i,day:F.dayOffset('2030-01-24',i)}));
  check('noise-positive',()=>{const input=noiseState(series()),original=clone(input);assert.deepEqual(E.typicalError(input,'demo-press'),{reps:0.94,n:9,src:"this lift's own repeats"},'PERFORMED_REAL_NOISE_POSITIVE');assert.deepEqual(input,original,'NOISE_PRESERVES_FACTS');});
  check('noise-correction',()=>{const rows=series();rows[2]=record({repetitions:reps[2],startId:'noise2',day:'2030-01-26',correctMiddle:true});
   const result=E.typicalError(noiseState(rows),'demo-press');assert.equal(result.n,0,'PERFORMED_NO_FALSE_SAME_LOAD_REPEAT');assert.match(result.src,/^published/);});
  check('noise-position',()=>{const rows=reps.map((r,i)=>record({repetitions:r,startId:'position'+i,day:F.dayOffset('2030-01-24',i),
   weights:i%2?[40,99,35]:[40,35,99],skipPosition:i%2?1:2}));
   assert.equal(E.typicalError(noiseState(rows),'demo-press').n,0,'PERFORMED_NO_FALSE_SLOT_REPEAT');});
  check('noise-partial-positive',()=>{const rows=reps.map((r,i)=>record({repetitions:r,startId:'partial'+i,day:F.dayOffset('2030-01-24',i),skipTerminal:true}));
   assert.equal(E.typicalError(noiseState(rows),'demo-press').n,6,'PERFORMED_COMPARABLE_PARTIAL_NOT_VETOED');});
  check('noise-order-unresolved',()=>{const rows=[record({startId:'same-day-A'}),record({startId:'same-day-B'})];
   const state=noiseState(rows);delete state.workoutFacts.order;
   assert.throws(()=>E.typicalError(state,'demo-press'),/PERFORMED_HISTORY_ORDER_UNRESOLVED/,'PRODUCER_ORDER_REQUIRED');});
  check('same-day-ordered-positive',()=>{const rows=reps.map((r,i)=>record({repetitions:r,startId:'same-day-'+i})),state=noiseState(rows);
   state.workoutFacts.sessions.reverse();assert.deepEqual(E.typicalError(state,'demo-press'),{reps:0.94,n:9,src:"this lift's own repeats"},'PERFORMED_SAME_DAY_READER_POSITIVE');
   assert.deepEqual(E.performedHistoryRows(state).map(r=>r.start_op_id),rows.map(r=>r.entry.start_op_id),'PERFORMED_SEMANTIC_ORDER');});
  check('effective-dates-do-not-change-semantic-order',()=>{const rows=series(),state=noiseState(rows);
   state.workoutFacts.sessions[0].effective.local_date='2030-01-30';state.workoutFacts.sessions.reverse();
   assert.deepEqual(E.performedHistoryRows(state).map(r=>r.start_op_id),rows.map(r=>r.entry.start_op_id),'PERFORMED_SEMANTIC_NOT_DATE_ORDER');});
  check('noise-no-unproven-legacy-pair',()=>{const input=noiseState([record({day:'2030-01-25',startId:'native-only'})]);
   input.sessionLog['2030-01-24']={entries:[{id:'demo-press',w:40,reps:[8,8,8]}]};
   assert.throws(()=>E.typicalError(input,'demo-press'),/PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED/,'PERFORMED_NO_INFERRED_LEGACY_CORRESPONDENCE');});
  assert.equal(JSON.stringify(a),aBytes,'ALL_READERS_PRESERVE_SOURCE');return count;
 }
 const restore={...candidate.sources};for(const edit of candidate.changes.slice().reverse())restore[edit.file]=restore[edit.file].replace(edit.after,edit.before);
 for(const file of Object.keys(before))assert.equal(restore[file],before[file],'CLOSED_SOURCE_RECONSTRUCTION');
 const mutants=[
  ['first-load','rebuild/engine/progression.cjs','work += slot.fact.current.load.value * slot.fact.current.reps.value;','work += rich.slots.find(s => s.state === "performed").fact.current.load.value * slot.fact.current.reps.value;','PERFORMED_WEIGHTED_SCORE'],
  ['original-instead-of-correction','rebuild/engine/progression.cjs','work += slot.fact.current.load.value * slot.fact.current.reps.value;','work += slot.fact.original.load.value * slot.fact.current.reps.value;','PERFORMED_CORRECTION_SCORE'],
  ['bound-as-exact','rebuild/engine/performed.cjs',"return 'at least 3';","return '3';",'PERFORMED_BOUND_RECEIPT'],
  ['compressed-slots','rebuild/engine/performed.cjs','return value.slots.map(slot=>','return value.slots.filter(slot=>slot.state === "performed").map(slot=>','PERFORMED_PLANNED_TERMINAL'],
  ['wrong-bound-threshold','rebuild/engine/performed.cjs','gte3:n=>n>=3','gte3:n=>n>3','PERFORMED_TYPED_STEP'],
  ['ignore-paired-load','rebuild/engine/performed.cjs','x.load===bv[i].load&&','true&&','PERFORMED_NO_FALSE_SAME_LOAD_REPEAT'],
  ['ignore-paired-position','rebuild/engine/performed.cjs','x.position===bv[i].position&&','true&&','PERFORMED_NO_FALSE_SLOT_REPEAT'],
  ['invent-failure-target','rebuild/engine/performed.cjs','${last.prescribed_effort.target} reps left','${0} reps left','PERFORMED_ORIGINAL_TARGET_PROSE'],
  ['date-as-semantic-order','rebuild/engine/performed.cjs','rank.get(a.start_op_id)-rank.get(b.start_op_id)','a.d.localeCompare(b.d)','PERFORMED_SEMANTIC_ORDER'],
 ];
 const outcomes=[];
 try{for(const mode of ['native','frozen']){
  globalThis.Date=mode==='native'?NativeDate:class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.UTC(2027,0,1)]));}static now(){return NativeDate.UTC(2027,0,1);}};
  const E=engine(candidate.sources),legacyCount=legacy(E,engine(before)),richCount=rich(E),detected=[];
  for(const [name,file,oldValue,newValue,label]of mutants){assert.equal(candidate.sources[file].split(oldValue).length,2,'UNIQUE_SENSITIVITY_SITE');
   const changed={...candidate.sources,[file]:candidate.sources[file].replace(oldValue,newValue)};let failure;
   try{rich(engine(changed));}catch(error){failure=error;}
   assert(failure?.code==='ERR_ASSERTION'&&failure.message.includes(label),'Named reached behavioral sensitivity: '+name);
   detected.push({name,assertion:label,mutantSha256:S.sha(changed[file]),restoredSha256:S.sha(candidate.sources[file])});
  }
  assert.equal(rich(engine(candidate.sources)),richCount,'RESTORED_PROPOSAL_PASS');outcomes.push({mode,legacyCount,richCount,detected});
  console.log(`PERFORMED READER PROPOSAL ${mode}: ${legacyCount} exact legacy cases; ${richCount} rich checks; ${detected.length}/${mutants.length} named source sensitivities DETECTED; restored PASS`);
 }}finally{globalThis.Date=NativeDate;}
 for(const file of Object.keys(before))assert.equal(fs.readFileSync(path.join(S.root,file),'utf8'),before[file],'RETAINED_PRODUCT_UNCHANGED');
 const output=process.argv[2];assert(output,'Explicit local evidence JSON path required');
 fs.writeFileSync(path.resolve(output),JSON.stringify({status:'PROPOSED; NOT SHIPPING OR QUALIFIED',base:S.base,pins:candidate.pins,w6Pin,w6Hashes,outcomes,
  limits:['declared synthetic statuses; no signature/HTTP qualification','history enumeration/cross-session correspondence/producer not integrated','partial step result conditional on caller qualification','other typed-effort consumers and full assembly/gates remain','in-memory source sensitivities are not a delivered-product bite']},null,2)+'\n');
 console.log('RETAINED PRODUCT UNCHANGED; history/producer/scientific/private/phone qualification NOT COMPLETE');
}
main().catch(error=>{console.error(error.stack);process.exitCode=1;});
