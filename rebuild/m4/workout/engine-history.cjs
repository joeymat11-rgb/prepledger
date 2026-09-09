'use strict';
// Internal factual producer, not a prescription/eligibility or authentication
// boundary. Install only with the actual projector and a trusted resolver of
// the ORIGINAL captured plan inputs. The host owns source token/context checks.
const {orderWorkoutStarts}=require('./engine-order.cjs');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const known=row=>['accepted-through-frontier','stored-on-this-device'].includes(row?.status);
const text=x=>typeof x==='string'&&x.length>0;
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
function createEngineHistoryProjector({athleteId,deviceId,projectWorkoutRecords,resolveCapturedLayout,parseStrictJson}={}){
 if(!text(athleteId)||!text(deviceId)||[projectWorkoutRecords,resolveCapturedLayout,parseStrictJson].some(f=>typeof f!=='function'))throw new TypeError('Scoped trusted history projector, captured-plan resolver and strict parser required');
 function project(history,generation,{sourceRevision,importAnchor}={}){
  if(!Number.isSafeInteger(sourceRevision)||sourceRevision<1)fail('WORKOUT_ENGINE_SOURCE_REVISION_REQUIRED');
  const order=orderWorkoutStarts(history,generation,{importAnchor}),ops=generation.collections.ops||{};
  const accepted=new Map(Object.values(generation.collections.receipts||{}).filter(r=>r.seq<=history.frontier).map(r=>[r.op_id,r.seq]));
  const all=new Set(),byStart=new Map();
  // Reject a detached/edited or incomplete view rather than accepting renderer
  // values. Signature and complete-generation authentication remain upstream.
  for(const session of history.sessions){
   for(const row of [session.start,...session.records]){
    const op=row?.operation;if(!op||all.has(op.op_id)||!same(op,ops[op.op_id]))fail('WORKOUT_ENGINE_HISTORY_DISAGREEMENT');
    if(op.athlete_id!==athleteId)fail('WORKOUT_ENGINE_SCOPE_DISAGREEMENT');
    const seq=accepted.get(op.op_id),rejected=generation.collections.rejected?.[op.op_id];
    if(rejected&&seq!==undefined)fail('WORKOUT_ENGINE_STATUS_DISAGREEMENT');
    const status=rejected?'rejected':seq!==undefined?'accepted-through-frontier':op.device_id===deviceId&&Object.hasOwn(generation.collections.outbox||{},op.op_id)?'stored-on-this-device':'stored-status-unresolved';
    if(row.status!==status||(seq!==undefined?row.receipt_sequence!==seq:Object.hasOwn(row,'receipt_sequence')))fail('WORKOUT_ENGINE_STATUS_DISAGREEMENT');
    if(row!==session.start){const target=['correction','tombstone'].includes(op.kind)?ops[op.target_op_id]:op;
     if(target?.session_start_op_id!==session.start.operation.op_id)fail('WORKOUT_ENGINE_SESSION_DISAGREEMENT');}
    all.add(op.op_id);
   }
   if(!same(session.projection,projectWorkoutRecords(session,ops)))fail('WORKOUT_ENGINE_PROJECTION_DISAGREEMENT');
   byStart.set(session.start.operation.op_id,session);
  }
  for(const [id,op]of Object.entries(ops))if(op.class==='session'&&!all.has(id))fail('WORKOUT_ENGINE_HISTORY_INCOMPLETE');
  const sessions=[],incomplete=[];
  for(const id of order.start_ids){
   const session=byStart.get(id),start=session.start.operation,capture=session.original;
   if(!capture||!same(capture,start.prescription_capture))fail('WORKOUT_ENGINE_CAPTURE_REQUIRED');
   if(session.records.some(row=>row.status!=='rejected'&&!known(row)))fail('WORKOUT_ENGINE_RECORD_STATUS_UNRESOLVED');
   const completion=session.projection.close_records;
   const completed=completion.length===1&&known(completion[0])&&['normal','early'].includes(completion[0].kind);
   const layout=resolveCapturedLayout({start:structuredClone(start),sourceRevision});
   if(!layout||layout.profile!=='earned/captured-lift-layout/v1'||!same(layout.producer,capture.producer)||!same(layout.basis,capture.basis)||
     !text(layout.correspondence_profile)||!Array.isArray(layout.slots)||layout.slots.length!==capture.slots.length)fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
   const positions=new Map(),slots=new Map(),entries=new Map();
   for(const [i,planned]of capture.slots.entries()){
    const mapped=layout.slots[i],lift=planned.lift_lineage_id;
    if(!mapped||mapped.logical_set_slot!==planned.logical_set_slot||mapped.lift_lineage_id!==lift||
       !Number.isSafeInteger(mapped.position)||mapped.position<1||slots.has(planned.logical_set_slot))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
    if(!positions.has(lift))positions.set(lift,new Set());const seen=positions.get(lift);if(seen.has(mapped.position))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');seen.add(mapped.position);
    let target={state:planned.effort.state};
    if(planned.effort.state==='specified'){
     const source=parseStrictJson(planned.effort.source_json);
     if(!source||Object.keys(source).length!==2||source.unit!=='rep'||!Number.isSafeInteger(source.target)||source.target<0||Object.is(source.target,-0))fail('WORKOUT_EFFORT_TARGET_MAPPING_REQUIRED');
     target={state:'specified',target:source.target};
    }
    if(!same(target,mapped.prescribed_effort))fail('WORKOUT_CAPTURE_TARGET_DISAGREEMENT');
    const slot={position:mapped.position,logical_set_slot:planned.logical_set_slot,prescribed_effort:target,state:'unlogged'};
    slots.set(planned.logical_set_slot,{lift,slot});
    if(!entries.has(lift))entries.set(lift,{profile:'earned/performed-lift/v1',start_op_id:id,lift_lineage_id:lift,correspondence_profile:layout.correspondence_profile,completion:completed?structuredClone(completion[0]):null,slots:[]});
    entries.get(lift).slots.push(slot);
   }
   for(const [lift,seen]of positions)for(let n=1;n<=seen.size;n++)if(!seen.has(n))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
   const facts=new Map(),skips=new Map();
   for(const fact of session.projection.facts){
    const slot=slots.get(fact.logical_set_slot);if(!slot||slot.lift!==fact.lift_lineage_id)fail('WORKOUT_EXTRA_SLOT_MAPPING_REQUIRED');
    if(!facts.has(fact.logical_set_slot))facts.set(fact.logical_set_slot,[]);facts.get(fact.logical_set_slot).push(fact);
   }
   for(const row of session.records){
    const op=row.operation;if(op.kind!=='session-skip'||row.status==='rejected')continue;
    const matching=[...slots.values()].filter(s=>s.lift===op.lift_lineage_id&&(op.skip_scope==='lift'||s.slot.logical_set_slot===op.logical_set_slot));
    if(!matching.length)fail('WORKOUT_EXTRA_SLOT_MAPPING_REQUIRED');
    for(const {slot}of matching){if(!skips.has(slot.logical_set_slot))skips.set(slot.logical_set_slot,[]);skips.get(slot.logical_set_slot).push(op.op_id);}
   }
   for(const {slot}of slots.values()){
    const rows=facts.get(slot.logical_set_slot)||[],live=rows.filter(f=>f.included===true),removed=rows.filter(f=>f.included===false&&f.source_status!=='rejected'&&!f.issues.length);
    const omitted=rows.filter(f=>f.source_status==='rejected').map(f=>f.source_op_id),skip=skips.get(slot.logical_set_slot)||[];
    const issues=[...new Set(rows.filter(f=>f.source_status!=='rejected').flatMap(f=>f.issues))];
    if(rows.some(f=>f.included===null)&&!issues.length)issues.push('SET_INTERPRETATION_REQUIRED');
    if(live.length>1||live.length&&skip.length||skip.length>1)issues.push('SET_SLOT_RESOLUTION_REQUIRED');
    if(removed.length)slot.removed_facts=structuredClone(removed);
    if(omitted.length)slot.rejected_source_ids=omitted;
    if(issues.length){slot.state='unresolved';slot.issues=[...new Set(issues)];slot.unresolved_fact_ids=rows.map(f=>f.source_op_id);slot.skip_op_ids=skip.slice();}
    else if(live.length){slot.state='performed';slot.fact=structuredClone(live[0]);}
    else if(skip.length){slot.state='skipped';slot.skip_op_id=skip[0];}
    else if(removed.length)slot.state='removed';
   }
   for(const entry of entries.values())entry.slots.sort((a,b)=>a.position-b.position);
   const record={start_op_id:id,effective:structuredClone(start.effective),plan_basis:start.plan_basis,capture:structuredClone(capture),
    completion_state:completed?'completed':completion.length?'unresolved':'open',completion_records:structuredClone(completion),
    source_record_ids:session.records.map(row=>row.operation.op_id),record:{entries:[...entries.values()]}};
   (completed?sessions:incomplete).push(record);
  }
  // Completed-reader order is a subsequence of the full causal source order.
  // Open/ambiguous completion evidence stays explicit for each caller; it
  // neither becomes a completed workout nor erases earlier completed facts.
  return {profile:'earned/workout-facts/v1',source_revision:sourceRevision,source_order:order,
   order:{...order,start_ids:sessions.map(s=>s.start_op_id)},sessions,incomplete_sessions:incomplete,
   excluded_start_ids:history.sessions.filter(s=>s.start.status==='rejected').map(s=>s.start.operation.op_id),
   interpretation:'captured-positions-and-factual-edits',progression_eligible:false};
 }
 return Object.freeze({project});
}
module.exports={createEngineHistoryProjector};
