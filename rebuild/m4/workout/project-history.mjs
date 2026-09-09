// Factual nonconcurrent edit projection on the actual stored-history read. Named
// Start/target references identify records; they do NOT fabricate causal parents.
// Concurrent edit interpretation, session/slot partitions, current safety and
// progression eligibility remain separate requirements, never inferred here.
export function projectWorkoutRecords(session,operations) {
  const unavailable=code=>{const e=new Error(code);e.projectionCode=code;throw e;};
  const cache=new Map();
  function ancestors(id){
    if(cache.has(id))return cache.get(id);
    const colors=new Map(),result=new Set(),stack=[[id,false]];
    while(stack.length){
      const [key,exit]=stack.pop();
      if(exit){colors.set(key,2);continue;}
      if(colors.get(key)===1)unavailable('CAUSAL_GRAPH_INVALID');
      if(colors.get(key)===2)continue;
      const op=operations[key];
      if(!op||!Array.isArray(op.causal_parents))unavailable('CAUSAL_REFERENCE_UNAVAILABLE');
      colors.set(key,1);stack.push([key,true]);
      for(const parent of op.causal_parents){
        if(typeof parent!=='string')unavailable('CAUSAL_GRAPH_INVALID');
        result.add(parent);stack.push([parent,false]);
      }
    }
    result.delete(id);cache.set(id,result);return result;
  }
  const sets=session.records.filter(r=>r.operation.kind==='session-set');
  const edits=session.records.filter(r=>['correction','tombstone'].includes(r.operation.kind)&&r.status!=='rejected');
  const facts=sets.map(row=>{
    const op=row.operation,change=edits.filter(r=>r.operation.target_op_id===op.op_id);
    const fact={source_op_id:op.op_id,logical_set_slot:op.logical_set_slot,lift_lineage_id:op.lift_lineage_id,
      source_status:row.status,original:structuredClone(op.payload),current:null,current_status:null,included:null,edit_op_ids:[],issues:[]};
    if(['rejected','stored-status-unresolved'].includes(session.start.status)){fact.issues.push('START_STATUS_UNRESOLVED');return fact;}
    if(row.status==='rejected'){fact.included=false;fact.issues.push('REJECTED_SOURCE');return fact;}
    if(row.status==='stored-status-unresolved'||change.some(r=>r.status==='stored-status-unresolved')){fact.issues.push('RECORD_STATUS_UNRESOLVED');return fact;}
    try{
      for(const edit of change)ancestors(edit.operation.op_id);
      for(let i=0;i<change.length;i++)for(let j=i+1;j<change.length;j++){
        const a=change[i].operation.op_id,b=change[j].operation.op_id;
        if(!ancestors(a).has(b)&&!ancestors(b).has(a))unavailable('CONCURRENT_EDIT_INTERPRETATION_REQUIRED');
      }
      change.sort((a,b)=>a===b?0:ancestors(a.operation.op_id).has(b.operation.op_id)?1:-1);
      let current=structuredClone(op.payload),included=true;
      for(const row of change){
        const edit=row.operation;
        if(!included)unavailable('EDIT_AFTER_REMOVAL_REQUIRES_INTERPRETATION');
        if(edit.kind==='tombstone')included=false;
        else Object.assign(current,structuredClone(edit.payload.replacement_fields));
      }
      fact.current=current;fact.included=included;fact.edit_op_ids=change.map(r=>r.operation.op_id);
      fact.current_status=[row,...change].some(r=>r.status==='stored-on-this-device')?'stored-on-this-device':'accepted-through-frontier';
    }catch(error){fact.issues.push(error.projectionCode||'EDIT_PROJECTION_UNAVAILABLE');}
    return fact;
  });
  // A stored skip or Close is an attested fact, not evidence that every planned
  // set happened or that any workout is progression-bearing.
  const skips=session.records.filter(r=>r.operation.kind==='session-skip'&&r.status!=='rejected').map(r=>r.operation.op_id);
  const closes=session.records.filter(r=>r.operation.kind==='session-close'&&r.status!=='rejected').map(r=>({op_id:r.operation.op_id,kind:r.operation.payload.completion_kind,status:r.status}));
  const slots=new Map();
  for(const fact of facts)if(fact.included!==false){
    const key=JSON.stringify([fact.lift_lineage_id,fact.logical_set_slot]);
    if(!slots.has(key))slots.set(key,[]);slots.get(key).push(fact);
  }
  for(const collision of slots.values())if(collision.length>1)for(const fact of collision)fact.issues.push('SET_SLOT_RESOLUTION_REQUIRED');
  return {facts,skipped_record_ids:skips,close_records:closes,
    interpretation:'nonconcurrent-set-edits-only',progression_eligible:false,
    continuation_allowed:false,remaining:['SESSION_AND_SLOT_PARTITION','CURRENT_SAFETY_AND_COMPLETE_HISTORY']};
}
