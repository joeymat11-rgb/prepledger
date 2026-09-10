import EditHistory from './edit-history.cjs';

// Adapter only: all edit semantics live in the shared typed fold. The stored
// reader passes its complete result; engine correspondence reruns the SAME fold.
export function projectWorkoutRecords(session,operations,{normalized,rows,frontier}={}){
 const view=normalized||EditHistory.normalizeWorkoutHistory(rows,frontier),byId=new Map(view.records.map(r=>[r.id,r]));
 const sourceRows=new Map([session.start,...session.records].map(r=>[r.operation.op_id,r]));
 const base=row=>{
  const op=row.operation,n=byId.get(op.op_id),local=n?.local;
  const effects=(n?.effect_ids||[]).filter(id=>sourceRows.get(id)?.status!=='rejected');
  return {source_op_id:op.op_id,source_status:row.status,included:local?.active??null,
   current:local?.current?structuredClone(local.current):null,
   current_status:[row,...effects.map(id=>sourceRows.get(id)).filter(Boolean)].some(r=>r.status==='stored-on-this-device')?'stored-on-this-device':row.status,
   edit_op_ids:effects,issues:local?.issues.slice()||['RECORD_STATUS_UNRESOLVED'],
   accepted:n?.accepted?structuredClone(n.accepted):null,last_effect_sequence:n?.last_effect_sequence||0};
 };
 const start=base(session.start);
 if(session.capture_issues?.length)start.issues.push(...session.capture_issues);
 const facts=session.records.filter(r=>r.operation.kind==='session-set').map(row=>{
  const op=row.operation,legacy=op.schema_version===1,fact={...base(row),original:structuredClone(op.payload)};
  if(legacy){
   fact.legacy_context={lift:structuredClone(op.payload?.lift??null),slot:structuredClone(op.payload?.slot??null),session_start_id:structuredClone(op.payload?.session_start_id??null)};
   fact.association=session.start.operation.schema_version===1&&op.payload?.session_start_id===session.start.operation.op_id?'RECORDED_REFERENCE':'UNRESOLVED';
  }else{fact.logical_set_slot=op.logical_set_slot;fact.lift_lineage_id=op.lift_lineage_id;}
  if(fact.current){fact.effective=fact.current.effective;delete fact.current.effective;}
  if(legacy){
   // Missing prescription/Start context does not erase a supported observation.
   // Context issues still prohibit interpreting it as qualified performed input.
   if(start.included!==true)fact.issues.push('START_STATUS_UNRESOLVED');
   if(fact.included!==true)fact.current=null;
  }else if(start.included!==true||start.issues.length){fact.current=null;fact.included=row.status==='rejected'?false:null;fact.issues.push('START_STATUS_UNRESOLVED');}
  return fact;
 });
 const skips=session.records.filter(r=>r.operation.kind==='session-skip').map(row=>({
  ...base(row),lift_lineage_id:row.operation.lift_lineage_id,original:{...structuredClone(row.operation.payload),skip_scope:row.operation.skip_scope,
   ...(Object.hasOwn(row.operation,'logical_set_slot')?{logical_set_slot:row.operation.logical_set_slot}:{})}}));
 const closes=session.records.filter(r=>r.operation.kind==='session-close').map(row=>{
  const value=base(row);return {...value,op_id:row.operation.op_id,kind:value.current?.completion_kind??null,status:value.current_status};
 }).filter(r=>r.included!==false);
 const slots=new Map();for(const fact of facts)if(!fact.legacy_context&&fact.included!==false){const key=JSON.stringify([fact.lift_lineage_id,fact.logical_set_slot]);if(!slots.has(key))slots.set(key,[]);slots.get(key).push(fact);}
 for(const collision of slots.values())if(collision.length>1)for(const fact of collision)fact.issues.push('SET_SLOT_RESOLUTION_REQUIRED');
 return {start_record:start,facts,skip_records:skips,skipped_record_ids:skips.filter(r=>r.included!==false).map(r=>r.source_op_id),close_records:closes,
  interpretation:'shared-typed-workout-edits',progression_eligible:false,continuation_allowed:false,
  remaining:['SESSION_AND_SLOT_PARTITION','CURRENT_SAFETY_AND_COMPLETE_HISTORY']};
}
