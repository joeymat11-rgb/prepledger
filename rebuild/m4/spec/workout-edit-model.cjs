'use strict';
// NONSHIPPING review model. Authentication/complete accepted inventory is an
// explicit assumption, not inferred from any operation or caller boolean.
const ASSUMPTION = 'ASSUMED_AUTHENTICATED_COMPLETE_ACCEPTED_PREFIX';
const roots = new Set(['session-start','session-set','session-skip','session-close']);
const edits = new Set(['correction','tombstone']);
const own = (o,k) => Object.hasOwn(o,k);
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && x.trim().length > 0;
const copy = structuredClone;
const fields = {
  'session-start':['effective','planned_split_slot_id'],
  'session-set':['effective','load','reps','reserve'],
  'session-skip':['effective','reason','skip_scope','logical_set_slot'],
  'session-close':['effective','completion_kind'],
  correction:['replacement_fields'], tombstone:['reason'],
};
const optional = {'session-set':['reserve'],'session-skip':['reason','logical_set_slot']};
const exact = (x,keys) => object(x) && Object.keys(x).length===keys.length && keys.every(k=>own(x,k));
const clear = x => exact(x,['clear']) && x.clear === true;
const q = (x,u) => exact(x,['value','unit']) && typeof x.value==='number' && Number.isFinite(x.value) && x.unit===u;
function need(ok,code){if(!ok){const e=new Error(code);e.code=code;throw e;}}
function effective(x){
  if(!exact(x,['local_date','local_time','utc_offset'])||!/^\d{4}-\d\d-\d\d$/.test(x.local_date)||
    !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/.test(x.local_time)||
    !/^[+-](?:[01]\d|2[0-3]):[0-5]\d$/.test(x.utc_offset))return false;
  const day=Date.parse(x.local_date+'T00:00:00Z');
  return Number.isFinite(day)&&new Date(day).toISOString().slice(0,10)===x.local_date;
}
function reserve(x){
  return ['unknown','skipped','not_asked'].includes(x?.tag)?exact(x,['tag']):
    exact(x,['tag','value','unit'])&&x.unit==='rep'&&!Object.is(x.value,-0)&&
    (x.tag==='exact'?[0,1,2].includes(x.value):x.tag==='at_least'&&x.value===3);
}
function createWorkoutEditModel({parseStrictJson}){
  need(typeof parseStrictJson==='function','STRICT_PARSER_REQUIRED');
  function project({assumption,athleteId,watermark,records,pending=[]}){
    need(assumption===ASSUMPTION,'ASSUMPTION_REQUIRED');
    need(text(athleteId)&&Number.isSafeInteger(watermark)&&watermark>=0&&Array.isArray(records)&&Array.isArray(pending),'INPUT');
    need(pending.every(raw=>typeof raw==='string'),'PENDING_BYTES_REQUIRED');
    const byId=new Map(),bySeq=new Map();
    for(const row of records){
      need(exact(row,['sequence','operationBytes'])&&Number.isSafeInteger(row.sequence)&&row.sequence>0&&typeof row.operationBytes==='string','RECORD');
      const op=parseStrictJson(row.operationBytes);
      need(object(op)&&text(op.op_id)&&op.athlete_id===athleteId&&[1,2].includes(op.schema_version)&&Array.isArray(op.causal_parents)&&op.causal_parents.every(text)&&new Set(op.causal_parents).size===op.causal_parents.length,'OPERATION');
      const prior=byId.get(op.op_id);
      if(prior){need(prior.sequence===row.sequence&&prior.operationBytes===row.operationBytes,'IDENTITY_CONFLICT');continue;}
      need(!bySeq.has(row.sequence),'POSITION_CONFLICT');
      const node={...row,op};byId.set(op.op_id,node);bySeq.set(row.sequence,node);
    }
    need(bySeq.size===watermark&&[...bySeq.keys()].every(n=>n<=watermark),'PREFIX_INCOMPLETE');
    const ordered=[...bySeq.values()].sort((a,b)=>a.sequence-b.sequence);
    const rootFor=new Map(),unhandled=new Map();
    for(const node of ordered){
      const op=node.op;
      for(const id of op.causal_parents)need(byId.has(id)&&byId.get(id).sequence<node.sequence,'CAUSAL_PREFIX');
      if(roots.has(op.kind))rootFor.set(op.op_id,op.op_id);
      else if(edits.has(op.kind)){
        const target=byId.get(op.target_op_id);
        need(target&&target.sequence<node.sequence,'TARGET_PREFIX');
        if(rootFor.has(op.target_op_id))rootFor.set(op.op_id,rootFor.get(op.target_op_id));
        else if(op.class==='session'){rootFor.set(op.op_id,op.op_id);unhandled.set(op.op_id,'EDIT_OF_UNHANDLED_TARGET');}
      }
      else if(op.class==='session'){rootFor.set(op.op_id,op.op_id);unhandled.set(op.op_id,'UNHANDLED_SESSION_KIND');}
    }
    const blocked=new Map();
    const block=(id,reason)=>{if(!blocked.has(id))blocked.set(id,new Set());blocked.get(id).add(reason);};
    for(const node of ordered){
      const op=node.op,rootId=rootFor.get(op.op_id);if(!rootId||unhandled.has(rootId)||!edits.has(op.kind))continue;
      const original=byId.get(rootId).op,target=byId.get(op.target_op_id).op;
      if(op.schema_version!==original.schema_version||op.schema_version!==target.schema_version)
        block(rootId,original.schema_version===1?'LEGACY_BRIDGE_REQUIRED':'MIXED_SCHEMA_EDIT_BRIDGE_REQUIRED');
      if(op.schema_version===1){
        const patch=op.payload?.replacement_fields;
        const supported=target.schema_version===1&&target.kind==='session-set'&&
          (op.kind==='tombstone'?exact(op.payload,['reason'])&&text(op.payload.reason):
          exact(op.payload,['replacement_fields'])&&object(patch)&&Object.keys(patch).length>0&&
          Object.entries(patch).every(([k,v])=>k==='load'?q(v,'lb'):k==='reps'&&q(v,'rep')));
        if(!supported)block(rootId,'LEGACY_EDIT_INTERPRETATION_REQUIRED');
      }
    }
    const corrections=new Map(),removals=new Map(),result=new Map();
    const add=(map,id,value)=>{if(!map.has(id))map.set(id,[]);map.get(id).push(value);};
    function originalFields(op){
      const p=copy(op.payload),v={};
      need(object(p),'PAYLOAD');
      if(roots.has(op.kind))v.effective=copy(op.effective);
      if(op.kind==='session-start'){
        const source=op.schema_version===1?p:op,key=op.schema_version===1?'slot':'planned_split_slot_id';
        if(own(source,key))v.planned_split_slot_id=copy(source[key]);
      }else for(const key of fields[op.kind]||[])if(key!=='effective'){
        const source=op.kind==='session-skip'&&['skip_scope','logical_set_slot'].includes(key)?op:p;
        if(own(source,key))v[key]=copy(source[key]);
      }
      return v;
    }
    function validatePatch(patch,target,trail=new Set(),allowClear=true){
      need(object(patch)&&Object.keys(patch).length>0&&fields[target.kind],'REPLACEMENT_FIELDS');
      need(!trail.has(target.op_id),'EDIT_CYCLE');trail.add(target.op_id);
      for(const [field,value]of Object.entries(patch)){
        need(fields[target.kind].includes(field),'REPLACEMENT_FIELD_FORBIDDEN');
        if(clear(value)){need(allowClear,'RECORDED_CLEAR_FORBIDDEN');need((optional[target.kind]||[]).includes(field),'CLEAR_REQUIRED_FIELD');continue;}
        if(field==='effective')need(effective(value),'EFFECTIVE_INVALID');
        else if(field==='load')need(q(value,'lb')&&(target.schema_version===1||value.value>0),'LOAD_INVALID');
        else if(field==='reps')need(q(value,'rep')&&(target.schema_version===1||Number.isSafeInteger(value.value)&&value.value>=0&&!Object.is(value.value,-0)),'REPS_INVALID');
        else if(field==='reserve')need(reserve(value),'RESERVE_INVALID');
        else if(field==='completion_kind')need(['normal','early'].includes(value),'COMPLETION_INVALID');
        else if(field==='skip_scope')need(['set','lift'].includes(value),'SKIP_INVALID');
        else if(field==='replacement_fields')validatePatch(value,byId.get(target.target_op_id).op,trail);
        else need(text(value),'TEXT_REQUIRED');
      }
      trail.delete(target.op_id);
    }
    function validateOriginal(op,current){
      need(op.class==='session','ROOT_CLASS');
      if(op.schema_version===1)return; // Never assign new recording domains to old bytes.
      const allowed={'session-start':[],'session-set':['load','reps','reserve'],'session-skip':['reason'],'session-close':['completion_kind']};
      const required={'session-start':['effective','planned_split_slot_id'],'session-set':['effective','load','reps'],
        'session-skip':['effective','skip_scope'],'session-close':['effective','completion_kind']};
      need(Object.keys(op.payload).every(k=>allowed[op.kind].includes(k))&&required[op.kind].every(k=>own(current,k)),'ROOT_FIELDS_INVALID');
      // Same value domains as patches, without allowing an edit instruction to
      // become a recorded observation. Cross-field Skip validity is FINAL only.
      validatePatch(current,op,new Set(),false);
    }
    // Every target is earlier in the accepted prefix. Reverse traversal therefore
    // resolves removals and revised edit contents before that edit contributes.
    for(const node of ordered.slice().reverse()){
      const op=node.op,rootId=rootFor.get(op.op_id);if(!rootId||unhandled.has(rootId)||blocked.has(rootId))continue;
      try{
      const current=originalFields(op),changes=(corrections.get(op.op_id)||[]).slice().sort((a,b)=>a.sequence-b.sequence);
      if(roots.has(op.kind))validateOriginal(op,current);
      for(const change of changes){
        validatePatch(change.patch,op);
        for(const [field,value]of Object.entries(change.patch)){
          if(clear(value))delete current[field];else current[field]=copy(value);
        }
      }
      const removedBy=(removals.get(op.op_id)||[]).slice().sort((a,b)=>a.sequence-b.sequence);
      const active=removedBy.length===0;
      if(op.kind==='session-skip'&&op.schema_version===2)need(current.skip_scope==='set'?text(current.logical_set_slot):current.skip_scope==='lift'&&!own(current,'logical_set_slot'),'SKIP_RESULT_INVALID');
      if(op.kind==='correction'){
        need(exact(op.payload,['replacement_fields']),'CORRECTION_PAYLOAD');
        validatePatch(current.replacement_fields,byId.get(op.target_op_id).op);
        if(active)add(corrections,op.target_op_id,{id:op.op_id,sequence:node.sequence,patch:current.replacement_fields});
      }else if(op.kind==='tombstone'){
        need(exact(op.payload,['reason'])&&text(current.reason),'REMOVAL_REASON');
        if(active)add(removals,op.target_op_id,{id:op.op_id,sequence:node.sequence});
      }
      result.set(op.op_id,{id:op.op_id,sequence:node.sequence,kind:op.kind,active,current,
        correction_ids:changes.map(c=>c.id),removal_ids:removedBy.map(r=>r.id)});
      }catch(error){
        // Post-admission interpretation contradictions affect this original
        // root and its edits, not every unrelated record in the accepted log.
        if(typeof error.code!=='string')throw error;
        block(rootId,error.code);
      }
    }
    // A contradiction discovered while visiting an older target also contains
    // any newer edits already visited. Never leak their tentative current state.
    for(const node of ordered){const rootId=rootFor.get(node.op.op_id);if(!rootId||!blocked.has(rootId))continue;
      result.set(node.op.op_id,{id:node.op.op_id,sequence:node.sequence,kind:node.op.kind,active:null,current:null,
        correction_ids:[],removal_ids:[],issues:[...blocked.get(rootId)]});
    }
    const unhandledRecords=[];
    for(const node of ordered){const rootId=rootFor.get(node.op.op_id);if(!rootId||!unhandled.has(rootId))continue;
      const issue=node.op.op_id===rootId?unhandled.get(rootId):'EDIT_OF_UNHANDLED_TARGET';
      unhandledRecords.push({id:node.op.op_id,sequence:node.sequence,kind:node.op.kind,root_id:rootId,
        operationBytes:node.operationBytes,active:null,current:null,issues:[issue]});
    }
    const workouts=[];
    for(const node of ordered)if(roots.has(node.op.kind)){
      const op=node.op,value=result.get(op.op_id),effects=ordered.filter(n=>n.op.op_id!==op.op_id&&rootFor.get(n.op.op_id)===op.op_id);
      const issues=[...(blocked.get(op.op_id)||[])];
      if(op.schema_version===1){
        issues.push('LEGACY_CONTEXT_UNQUALIFIED');
      }
      const p=object(op.payload)?op.payload:{};
      workouts.push({...copy(value),source_schema:op.schema_version,issues,
        source_context:op.schema_version===1?{session_start_id:p.session_start_id??null,lift:p.lift??null,slot:p.slot??null,plan_basis:null,capture:null}:
          {session_start_id:op.session_start_op_id??null,lift_lineage_id:op.lift_lineage_id??null,logical_set_slot:op.logical_set_slot??null,plan_basis:op.plan_basis??null,capture:copy(op.prescription_capture??null)},
        last_effect_sequence:effects.length?effects.at(-1).sequence:0,
        effects:effects.map(e=>copy(result.get(e.op.op_id)))});
    }
    return {model:'PROPOSED_WORKOUT_EDIT_NORMALIZATION',watermark,workouts,unhandled_records:unhandledRecords,
      originals:ordered.map(n=>({sequence:n.sequence,operationBytes:n.operationBytes})),pending:pending.slice(),
      interpretationOnly:true,authenticated:false,progressionEligible:false,activated:false};
  }
  return Object.freeze({project});
}
module.exports={ASSUMPTION,createWorkoutEditModel};
