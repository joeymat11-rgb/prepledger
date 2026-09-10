'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const Ops=require('../../../client/ops.cjs'),Schema=require('../schema.cjs'),Context=require('../context-values.cjs');
const {normalizeWorkoutHistory:normalize}=require('../edit-history.cjs');
const effective={local_date:'2026-09-10',local_time:'09:00',utc_offset:'-04:00'},hours={value:7,unit:'h'};
function op(id,cls,kind,payload,{target,parents=[],version=2,extra={}}={}){
 return Ops.build({op_id:id,athlete_id:'synthetic-athlete',device_id:'synthetic-device',device_seq:1,
  parents,class:cls,kind,payload,effective,schema_version:version,lease_id:'synthetic-unissued',target,extra},'public-synthetic-identity');
}
const sleep=(id='sleep',payload={hours,quality:'good'})=>op(id,'sleep','fact',{night_start_date:'2026-09-09',...payload});
const change=(id,target,replacement_fields,cls='sleep',parents=[])=>op(id,cls,'correction',{replacement_fields},{target,parents});
const remove=(id,target,cls='sleep')=>op(id,cls,'tombstone',{reason:'synthetic removal'},{target});
const rows=operations=>operations.map((operation,i)=>({operation,status:'accepted-through-frontier',receipt_sequence:i+1}));
const fold=operations=>normalize(rows(operations),operations.length);
const record=(view,id)=>view.context_records.find(r=>r.id===id);
const fails=(run,code)=>assert.throws(run,e=>e.code===code);
function generation(operations,pending=[]){
 const all=[...operations,...pending],receipts=operations.map((o,i)=>({seq:i+1,op_id:o.op_id,canonical_content_commitment:o.canonical_content_commitment,op:o}));
 return {collections:{ops:Object.fromEntries(all.map(o=>[o.op_id,o])),receipts:Object.fromEntries(receipts.map(r=>[r.seq,{seq:r.seq,op_id:r.op_id,canonical_content_commitment:r.canonical_content_commitment}])),
  outbox:Object.fromEntries(pending.map(o=>[o.op_id,{}])),rejected:{},dispositions:{},sync:{frontier:{W:operations.length,authorityW:operations.length}}},
  metadata:{wireProofs:{pull:{synthetic:{receipts}}}}};
}
test('context descriptor-safe shape preserves independent sleep and the unchanged workout-only profile',()=>{
 for(const payload of [{hours},{quality:'good'},{hours:{value:0,unit:'h'}}]){
  const o=sleep('shape',payload);assert.equal(Schema.validateContextShape(o).valid,true);
  assert.equal(Schema.validateWorkoutShape(o).valid,false);
 }
 let reads=0;const getter=sleep();Object.defineProperty(getter.payload,'quality',{get(){reads++;return 'good';},enumerable:true});
 assert.deepEqual(Schema.validateContextShape(getter),{valid:false,errors:['INVALID_JSON_SHAPE'],references:[]});assert.equal(reads,0);
 const original=sleep();original.lift_lineage_id='fabricated';assert.equal(Schema.validateContextShape(original).valid,false);
 assert.equal(Schema.validateContextShape(sleep('empty',{})).valid,false);
});
test('actual target determines correction variant; no fact scope or cross-class alias',()=>{
 const source=sleep(),edit=change('edit','sleep',{hours}),objects={sleep:source,edit};
 assert.equal(Schema.validateContextRelations(edit,id=>objects[id]),true);
 assert.equal(Schema.validateContextRelations(change('bad','sleep',{reason:'not a tombstone'}),id=>objects[id]),false);
 const nested=change('nested','edit',{replacement_fields:{quality:{clear:true}}});
 assert.equal(Schema.validateContextRelations(nested,id=>objects[id]),true);
 assert.equal(Schema.validateContextRelations(change('bad2','edit',{quality:'poor'}),id=>objects[id]),false);
 assert.equal(Schema.validateContextRelations(change('bad3','sleep',{note:'not a sleep field'},'illness'),id=>objects[id]),false);
 assert.equal(Schema.validateContextRelations(edit,id=>({...objects[id],athlete_id:'foreign'})),false);
});
test('all-cleared sleep remains active identity and can be corrected without inventing an observation',()=>{
 const source=sleep(),clearH=change('clear-h','sleep',{hours:{clear:true}}),clearQ=change('clear-q','sleep',{quality:{clear:true}});
 const operations=[source,clearH,clearQ],bytes=JSON.stringify(operations),view=fold(operations),empty=record(view,'sleep').accepted;
 assert.equal(empty.active,true);assert.equal(empty.observation_state,'no-current-observation');
 assert.deepEqual(empty.current,{night_start_date:'2026-09-09',effective});
 assert.equal(Context.legacyCorrespondence('sleep',empty.current).candidate,null);
 assert.deepEqual(view.records,[]);assert.equal(JSON.stringify(operations),bytes);
 const restored=record(fold([...operations,change('restore','sleep',{hours:{value:0,unit:'h'}})]),'sleep').accepted;
 assert.equal(restored.observation_state,'observed');assert.deepEqual(restored.current.hours,{value:0,unit:'h'});
});
test('same-class source controls cannot acquire physiological edit permission through a nested target',()=>{
 const source=op('source','event','fact',{type:'source-import-intent',source_id:'source-A',material_digest:'ab'.repeat(32),
  interval:{start:'2026-09-10T09:00-04:00',end:'2026-09-10T09:00-04:00'}});
 const edit=change('edit-source','source',{label:'looks like an event'},'event');
 const nested=change('nested-source','edit-source',{replacement_fields:{label:'still a control'}},'event');
 const objects={source,'edit-source':edit};
 assert.equal(Schema.validateContextShape(edit).valid,true,'shape alone cannot know the target family');
 assert.equal(Schema.validateContextRelations(edit,id=>objects[id]),false);
 assert.equal(Schema.validateContextRelations(nested,id=>objects[id]),false);
 const ordinary=op('ordinary','event','fact',{type:'reported-event',interval:{start:'2026-09-09',end:'2026-09-09'}});
 assert.equal(Schema.validateContextRelations(edit,()=>ordinary),false,'lookup must preserve target identity');
});
test('nested edit keeps original logical position while later current edit wins',()=>{
 const source=sleep(),c1=change('c1','sleep',{night_start_date:'2026-09-08'}),c2=change('c2','sleep',{night_start_date:'2026-09-07'});
 const c3=change('c3','c1',{replacement_fields:{night_start_date:'2026-09-06'}});
 let operations=[source,c1,c2,c3],current=record(fold(operations),'sleep');
 assert.equal(current.accepted.current.night_start_date,'2026-09-07');assert.equal(current.last_effect_sequence,4);
 operations.push(remove('remove-c2','c2'));assert.equal(record(fold(operations),'sleep').accepted.current.night_start_date,'2026-09-06');
 operations.push(remove('restore-c2','remove-c2'));assert.equal(record(fold(operations),'sleep').accepted.current.night_start_date,'2026-09-07');
 assert.equal(current.accepted.current.effective.local_date,'2026-09-10');
});
test('multiple live removals, removal revision and restoration follow the same fold',()=>{
 const source=sleep(),r1=remove('r1','sleep'),r2=remove('r2','sleep');
 const operations=[source,r1,r2,change('why','r1',{reason:'revised text'})];
 assert.equal(record(fold(operations),'sleep').accepted.observation_state,'removed');
 operations.push(remove('undo1','r1'));assert.equal(record(fold(operations),'sleep').accepted.active,false);
 operations.push(remove('undo2','r2'));assert.equal(record(fold(operations),'sleep').accepted.active,true);
 assert.equal(record(fold(operations),'sleep').accepted.current.hours.value,7);
});
test('invalid rooted edit is contained; unrelated context and workout records remain intact',()=>{
 const start=op('start','session','session-start',{}, {extra:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}});
 const baseline=fold([start]),source=sleep(),invalid=change('invalid','sleep',{night_start_date:{clear:true}});
 const separate=sleep('separate',{quality:'okay'}),view=fold([start,source,invalid,separate]);
 assert.deepEqual(view.records,baseline.records);
 for(const id of ['sleep','invalid']){assert.equal(record(view,id).accepted.active,null);assert.equal(record(view,id).accepted.current,null);}
 assert.equal(record(view,'separate').accepted.observation_state,'observed');
});
test('pending concurrent effects cannot rewrite accepted context or acquire receipt order',()=>{
 const source=sleep(),a=change('local-a','sleep',{hours:{clear:true}},'sleep',['sleep']);
 const b=change('local-b','sleep',{quality:{clear:true}},'sleep',['sleep']);
 const input=[...rows([source]),...[a,b].map(operation=>({operation,status:'stored-on-this-device'}))],view=normalize(input,1);
 assert.equal(record(view,'sleep').accepted.current.hours.value,7);
 assert.equal(record(view,'sleep').local.active,null);
 assert(record(view,'sleep').local.issues.includes('CONCURRENT_EDIT_INTERPRETATION_REQUIRED'));
 assert.equal(record(view,'sleep').local.observation_state,'unresolved');
 assert.equal(record(view,'local-a').accepted,null);assert.equal(record(view,'sleep').last_effect_sequence,0);
 input[2].operation=change('local-b','sleep',{quality:{clear:true}},'sleep',['sleep','local-a']);
 const ordered=normalize(input,1);assert.equal(record(ordered,'sleep').local.observation_state,'no-current-observation');
 assert.equal(record(ordered,'sleep').accepted.observation_state,'observed');
});
test('full prefix, hidden pain reference and athlete violations stay hard caller failures',()=>{
 const source=sleep(),edit=change('edit','sleep',{quality:'poor'});
 fails(()=>normalize(rows([source,edit]).slice(1),2),'WORKOUT_HISTORY_PREFIX');
 const wrong=rows([source,edit]);wrong[1].receipt_sequence=1;fails(()=>normalize(wrong,2),'WORKOUT_HISTORY_POSITION');
 const foreign=sleep('foreign');foreign.athlete_id='another';fails(()=>fold([source,foreign]),'WORKOUT_HISTORY_SCOPE');
 const pain=op('pain','pain-attestation','fact',{scope:'session-only',session_start_op_id:'missing'});
 assert.deepEqual(Schema.validateContextShape(pain).references,['missing']);
 fails(()=>fold([pain]),'WORKOUT_HISTORY_CAUSAL_PREFIX');
});
test('pain relation, original closed illness and free text have the accepted distinct meanings',()=>{
 const start=op('start','session','session-start',{}, {extra:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}});
 const pain=op('pain','pain-attestation','fact',{scope:'session-only',session_start_op_id:'start',note:'source-import-intent'});
 const illness=op('ill','illness','fact',{interval:{start:'2026-09-08',end:'2026-09-09'},note:'source-rollback-intent'});
 const view=fold([start,pain,illness]);
 assert.equal(record(view,'pain').accepted.active,true);assert.equal(record(view,'ill').accepted.active,true);
 assert.deepEqual(view.records.map(x=>x.id),['start']);
 const bad=change('reassign','pain',{session_start_op_id:'other'},'pain-attestation');
 assert.equal(Schema.validateContextShape(bad).valid,false);
});
test('open pain close and reopen are current factual values; effective correction does not move interval',()=>{
 const source=op('pain','pain-attestation','fact',{scope:'open-interval',interval:{start:'2026-09-08'}});
 const close=change('close','pain',{interval:{start:'2026-09-08',end:'2026-09-09'}},'pain-attestation');
 const moved=change('moved','pain',{effective:{local_date:'2026-09-11',local_time:'20:00',utc_offset:'+09:00'}},'pain-attestation');
 const closed=record(fold([source,close,moved]),'pain').accepted.current;
 assert.equal(closed.interval.end,'2026-09-09');assert.equal(closed.effective.local_date,'2026-09-11');
 const reopen=change('reopen','pain',{interval:{start:'2026-09-08'}},'pain-attestation');
 assert.equal(Context.atDate('pain-attestation',record(fold([source,close,moved,reopen]),'pain').accepted.current,'2026-09-12').relation,'end-unresolved');
});
test('legacy unknowns and source-control rows stay visible without native workout coverage',()=>{
 const legacy=op('legacy','sleep','fact',{hours:{value:7,unit:'historical'},quality:{clear:true}},{version:1});
 const control=op('control','event','fact',{type:'source-import-intent',source_id:'unbound',material_digest:'unverified',interval:{start:'2026-09-10',end:'2026-09-10'}});
 const operations=[legacy,control],bytes=JSON.stringify(operations),view=fold(operations);
 assert.deepEqual(view.records,[]);assert.deepEqual(view.context_records.map(r=>r.id),['legacy','control']);
 assert(record(view,'legacy').accepted.issues.includes('LEGACY_CONTEXT_UNQUALIFIED'));
 assert.equal(record(view,'control').accepted.active,null);
 assert.equal(JSON.stringify(operations),bytes);
});
test('stored reader exposes SAME contextual fold and actual native projector excludes its membership',async()=>{
 const w6=process.env.EARNED_READING_W6_ROOT;assert(w6,'Explicit retained W6 root required');
 const {storedWorkoutHistory}=await import(pathToFileURL(path.join(w6,'rebuild/m4/workout/stored-history.mjs')));
 const {projectWorkoutRecords}=await import(pathToFileURL(path.join(w6,'rebuild/m4/workout/project-history.mjs')));
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs')));
 const source=sleep(),pending=change('pending','sleep',{hours:{clear:true}},'sleep',['sleep']);
 const g=generation([source],[pending]),bytes=JSON.stringify(g),history=storedWorkoutHistory(g,{athleteId:'synthetic-athlete',deviceId:'synthetic-device'});
 assert.deepEqual(history.sessions,[]);assert.deepEqual(history.other_records,[]);
 assert(Array.isArray(history.context_records),'Actual stored reader exposes common context records');
 assert.equal(history.context_records[0].interpretation.accepted.current.hours.value,7);
 assert(!Object.hasOwn(history.context_records[0].interpretation.local.current,'hours'));
 assert.equal(history.context_records[1].status,'stored-on-this-device');
 assert.deepEqual(history.context_records.map(r=>r.interpretation),normalize([...rows([source]),{operation:pending,status:'stored-on-this-device'}],1).context_records);
 const reader=require('../engine-history.cjs').createEngineHistoryProjector({athleteId:'synthetic-athlete',deviceId:'synthetic-device',
  projectWorkoutRecords,parseStrictJson,resolveCapturedLayout:()=>{throw Error('No workout capture exists');}});
 const output=reader.projectAccepted(history,g,{sourceRevision:1});assert.deepEqual(output.source_members,[]);
 assert.equal(JSON.stringify(g),bytes);
});
