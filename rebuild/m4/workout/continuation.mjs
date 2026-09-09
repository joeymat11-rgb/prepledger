import Session from '../../client/session.cjs';

// Interprets the supported singleton component of already authenticated history.
// It grants no safety/write permission. Multi-start partition generations and
// unsupported legacy/edit forms must be interpreted before they can continue.
export function workoutContinuation(history,generation,startId){
 const fail=(code,state=3)=>{const error=new Error(code);error.code=code;error.state=state;throw error;};
 const known=row=>['accepted-through-frontier','stored-on-this-device'].includes(row.status);
 const target=history.sessions.find(s=>s.start.operation.op_id===startId);
 if(!target)fail('WORKOUT_RESUME_START_MISSING',18);
 if(!known(target.start))fail('WORKOUT_RESUME_START_UNRESOLVED',target.start.status==='rejected'?19:18);
 if(!target.original)fail('WORKOUT_ORIGINAL_INSTRUCTIONS_UNKNOWN');
 const frontier=generation.collections.sync?.frontier;
 if(!frontier||frontier.authorityW!==history.frontier)fail('WORKOUT_RESUME_PREFIX_INCOMPLETE',18);
 const starts=history.sessions.filter(s=>s.start.status!=='rejected').map(s=>{
  if(!known(s.start))fail('WORKOUT_RESUME_HISTORY_UNRESOLVED',18);
  const op=s.start.operation,date=op.effective.local_date,time=op.effective.local_time;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||
     new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))fail('WORKOUT_SESSION_TIME_MAPPING_REQUIRED');
  return {start:op.op_id,slot:op.planned_split_slot_id,date,time,device:op.device_id};
 });
 const component=Session.candidateComponents(starts).find(c=>c.members.includes(startId));
 // No external generation defaults authorize a decision. Only a singleton has
 // no relationship question; closed starts still participate in the real rule.
 if(!component||component.members.length!==1)fail('WORKOUT_SESSION_PARTITION_REQUIRED',14);
 if(target.records.some(r=>r.status!=='rejected'&&!known(r)))fail('WORKOUT_RESUME_HISTORY_UNRESOLVED',18);
 if(target.projection.close_records.length)fail('WORKOUT_ALREADY_CLOSED');
 const key=slot=>JSON.stringify([slot.lift_lineage_id,slot.logical_set_slot]);
 const slots=new Map(target.original.slots.map(slot=>[key(slot),{...structuredClone(slot),completion:null}]));
 for(const fact of target.projection.facts){
  if(fact.included===false)continue;
  if(fact.included!==true||fact.issues.length)fail('WORKOUT_SET_INTERPRETATION_REQUIRED');
  const slot=slots.get(key(fact));if(!slot)fail('WORKOUT_ADDED_SLOT_MAPPING_REQUIRED');
  if(slot.completion)fail('WORKOUT_SET_INTERPRETATION_REQUIRED');
  slot.completion={kind:'performed',op_id:fact.source_op_id,values:structuredClone(fact.current)};
 }
 for(const row of target.records){
  const op=row.operation;if(op.kind!=='session-skip'||row.status==='rejected')continue;
  const matching=[...slots.values()].filter(slot=>slot.lift_lineage_id===op.lift_lineage_id&&(op.skip_scope==='lift'||slot.logical_set_slot===op.logical_set_slot));
  if(!matching.length)fail('WORKOUT_ADDED_SLOT_MAPPING_REQUIRED');
  for(const slot of matching){
   if(slot.completion?.kind==='performed')fail('WORKOUT_SET_INTERPRETATION_REQUIRED');
   slot.completion={kind:'skipped',op_id:op.op_id,reason:op.payload.reason};
  }
 }
 return {session_start_op_id:startId,planned_split_slot_id:target.start.operation.planned_split_slot_id,
  original:structuredClone(target.original),slots:[...slots.values()],records:structuredClone(target.records),
  component_members:component.members.slice(),interpretation:'known-singleton-captured-session',progression_eligible:false};
}
