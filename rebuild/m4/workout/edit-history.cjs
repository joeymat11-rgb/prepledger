'use strict';
// Private typed interpretation. Call only after the stored-history assembler's
// original-value/signature/complete-prefix checks. This grants no permission.
const V=require('./edit-values.cjs');
const Schema=require('./schema.cjs');
const Context=require('./context-values.cjs');
const {own,object,text,exact,clear,roots,edits,need,quantity}=V;
const copy=structuredClone;
// Closed schema1 interpretation from the actual historical T2 writers. These
// are observations and raw context, never reconstructed prescription identity.
function legacyFields(op){
 need(object(op.payload),'UNSUPPORTED_SESSION_PAYLOAD');
 if(!roots.has(op.kind))return V.originalFields(op);
 need(op.class==='session','UNSUPPORTED_SESSION_CLASS');
 const current={effective:copy(op.effective)},p=op.payload;
 if(op.kind==='session-start')current.recorded_slot=own(p,'slot')?copy(p.slot):null;
 else if(op.kind==='session-set'){
  need(quantity(p.load,'lb')&&quantity(p.reps,'rep'),'UNSUPPORTED_SET_OBSERVATIONS');
  current.load=copy(p.load);current.reps=copy(p.reps);
  current.reserve={tag:'unknown',reason:'NOT_RECORDED_BY_SCHEMA1_WRITER'};
 }else if(op.kind==='session-close')current.closed=own(p,'closed')?copy(p.closed):null;
 else need(false,'LEGACY_SESSION_KIND_UNSUPPORTED');
 return current;
}
function legacyContext(op,read){
 const issues=['LEGACY_CONTEXT_UNQUALIFIED'],p=op.payload;
 if(!object(p))return issues;
 if(op.kind==='session-start')issues.push('MISSING_LEGACY_PLAN_BASIS');
 if(['session-set','session-close'].includes(op.kind)){
  const start=text(p.session_start_id)?read(p.session_start_id):null;
  if(start?.schema_version!==1||start.class!=='session'||start.kind!=='session-start')issues.push('MISSING_OR_UNSUPPORTED_START_REFERENCE');
 }
 const fields={'session-start':['slot'],'session-set':['load','reps','lift','slot','session_start_id'],'session-close':['closed','session_start_id']};
 if(fields[op.kind]&&Object.keys(p).some(k=>!fields[op.kind].includes(k)))issues.push(op.kind==='session-set'?'UNINTERPRETED_SET_FIELDS':'UNINTERPRETED_LEGACY_FIELDS');
 return issues;
}
function normalizeWorkoutHistory(rows,watermark){
 need(Array.isArray(rows)&&Number.isSafeInteger(watermark)&&watermark>=0,'WORKOUT_HISTORY_INPUT');
 const byId=new Map(),positions=new Map();let athlete;
 for(const row of rows){const op=row?.operation;
  need(object(op)&&text(op.op_id)&&text(op.athlete_id)&&Array.isArray(op.causal_parents)&&op.causal_parents.every(text),'WORKOUT_HISTORY_RECORD');
  need(!byId.has(op.op_id)&&new Set(op.causal_parents).size===op.causal_parents.length,'WORKOUT_HISTORY_IDENTITY_CONFLICT');
  if(athlete===undefined)athlete=op.athlete_id;need(op.athlete_id===athlete,'WORKOUT_HISTORY_SCOPE');
  need(['accepted-through-frontier','stored-on-this-device','rejected','stored-status-unresolved'].includes(row.status),'WORKOUT_HISTORY_STATUS');
  if(row.status==='accepted-through-frontier'){
   need(Number.isSafeInteger(row.receipt_sequence)&&row.receipt_sequence>0&&row.receipt_sequence<=watermark&&!positions.has(row.receipt_sequence),'WORKOUT_HISTORY_POSITION');
   positions.set(row.receipt_sequence,op.op_id);
  }else need(!own(row,'receipt_sequence'),'WORKOUT_HISTORY_PENDING_POSITION');
  byId.set(op.op_id,row);
 }
 need(positions.size===watermark,'WORKOUT_HISTORY_PREFIX');
 const accepted=[];for(let n=1;n<=watermark;n++){need(positions.has(n),'WORKOUT_HISTORY_PREFIX');accepted.push(positions.get(n));}
 const dependencies=op=>[...new Set([...op.causal_parents,...(edits.has(op.kind)||op.schema_version===1&&text(op.target_op_id)?[op.target_op_id]:[]),
  ...(op.schema_version===2&&op.kind==='fact'&&op.class==='pain-attestation'&&op.payload?.scope==='session-only'&&text(op.payload.session_start_op_id)?[op.payload.session_start_op_id]:[])])];
 for(const id of accepted){const row=byId.get(id);
  for(const dep of dependencies(row.operation)){const parent=byId.get(dep);need(parent?.status==='accepted-through-frontier'&&parent.receipt_sequence<row.receipt_sequence,'WORKOUT_HISTORY_CAUSAL_PREFIX');}
 }
 // References provide dependency order; a transport predecessor never does.
 // Local order is only a topological traversal, not an athlete-log position.
 const ordered=accepted.slice(),visited=new Set(accepted),visiting=new Set(),unavailable=new Set();
 for(const id of byId.keys())if(!visited.has(id)){
  const stack=[[id,false]];while(stack.length){const [key,exit]=stack.pop();
   if(exit){visiting.delete(key);visited.add(key);ordered.push(key);continue;}
   if(visited.has(key))continue;
   if(visiting.has(key)){unavailable.add(key);continue;}
   const row=byId.get(key);if(!row){unavailable.add(key);continue;}
   visiting.add(key);stack.push([key,true]);
   for(const parent of dependencies(row.operation)){
    if(!byId.has(parent)||byId.get(parent).status==='rejected'){unavailable.add(key);continue;}
    if(visiting.has(parent)){unavailable.add(key);unavailable.add(parent);continue;}
    if(!visited.has(parent))stack.push([parent,false]);
   }
  }
 }
 const rootFor=new Map(),unhandled=new Map(),members=new Map();
 for(const id of ordered){const op=byId.get(id).operation;
  if(roots.has(op.kind)||op.kind==='fact'&&Context.classes.has(op.class))rootFor.set(id,id);
  else if(edits.has(op.kind)&&rootFor.has(op.target_op_id))rootFor.set(id,rootFor.get(op.target_op_id));
  else if(op.schema_version===1&&rootFor.has(op.target_op_id))rootFor.set(id,rootFor.get(op.target_op_id));
  else if(op.class==='session'||typeof op.kind==='string'&&op.kind.startsWith('session-')){rootFor.set(id,id);unhandled.set(id,edits.has(op.kind)?'EDIT_OF_UNHANDLED_TARGET':'UNHANDLED_SESSION_KIND');}
  else if(Context.classes.has(op.class)){rootFor.set(id,id);unhandled.set(id,edits.has(op.kind)?'EDIT_OF_UNHANDLED_TARGET':'UNHANDLED_CONTEXT_KIND');}
  const root=rootFor.get(id);if(root){if(!members.has(root))members.set(root,[]);members.get(root).push(id);}
 }
 const read=id=>byId.get(id)?.operation;
 // Unlike schema2 accepted ties, supported schema1 edits require semantic
 // descent. Neither the target reference nor the transport predecessor supplies it.
 const descends=(from,wanted)=>{const stack=read(from).causal_parents.slice(),seen=new Set();
  while(stack.length){const id=stack.pop();if(id===wanted)return true;if(seen.has(id))continue;seen.add(id);if(read(id))stack.push(...read(id).causal_parents);}return false;};
 function fold(ids){
  const corrections=new Map(),removals=new Map(),result=new Map(),blocked=new Map(),legacyEffects=new Map(),rank=new Map(ids.map((id,i)=>[id,i]));
  const add=(map,id,value)=>{if(!map.has(id))map.set(id,[]);map.get(id).push(value);};
  const block=(root,reason)=>{if(!blocked.has(root))blocked.set(root,new Set());blocked.get(root).add(reason);};
  for(const id of ids){const op=read(id),root=rootFor.get(id);if(!root||unhandled.has(root))continue;
   if(id!==root&&!edits.has(op.kind)){block(root,'UNSUPPORTED_TARGET_EFFECT');continue;}
   if(!edits.has(op.kind))continue;
   const source=read(root),target=read(op.target_op_id);
   const context=Context.classes.has(source.class);
   if(op.schema_version===2&&op.class!==(context?source.class:'session'))block(root,'EDIT_CLASS_INVALID');
   if(op.schema_version!==source.schema_version||op.schema_version!==target?.schema_version)block(root,source.schema_version===1?'LEGACY_BRIDGE_REQUIRED':'MIXED_SCHEMA_EDIT_BRIDGE_REQUIRED');
   if(context&&op.schema_version===1){block(root,'LEGACY_CONTEXT_UNQUALIFIED');continue;}
   if(op.schema_version===1){const patch=op.payload?.replacement_fields;
    const supported=['session','reading'].includes(op.class)&&target?.schema_version===1&&target.kind==='session-set'&&(op.kind==='tombstone'?exact(op.payload,['reason'])&&text(op.payload.reason):
     exact(op.payload,['replacement_fields'])&&object(patch)&&Object.keys(patch).length>0&&Object.entries(patch).every(([k,v])=>k==='load'?quantity(v,'lb'):k==='reps'&&quantity(v,'rep')));
    if(!supported)block(root,'LEGACY_EDIT_INTERPRETATION_REQUIRED');
    if(!op.causal_parents.includes(op.target_op_id))block(root,'MISSING_EXPLICIT_TARGET_CAUSAL_EDGE');
    const prior=legacyEffects.get(root);
    // A valid chain's latest edit already descends from every earlier edit.
    // Once broken, the root stays blocked; no quadratic all-pairs closure.
    if(prior&&!descends(id,prior.last))block(root,'CONCURRENT_TARGET_EDITS');
    if(prior?.removed)block(root,'EDIT_AFTER_REMOVAL_UNSUPPORTED');
    legacyEffects.set(root,{last:id,removed:prior?.removed||op.kind==='tombstone'});
   }
  }
  for(const id of ids.slice().reverse()){
   const op=read(id),root=rootFor.get(id);if(!root||blocked.has(root)||unhandled.has(root))continue;
   const context=Context.classes.has(read(root).class),values=context?Context:V;
   try{
    need([1,2].includes(op.schema_version),'UNSUPPORTED_SCHEMA_VERSION');
    if(op.schema_version===2){
     const shape={...op};if(op.kind==='session-start')delete shape.prescription_capture;
     need((context?Schema.validateContextShape(shape):Schema.validateWorkoutShape(shape)).valid,context?'CONTEXT_ORIGINAL_SHAPE_INVALID':'WORKOUT_ORIGINAL_SHAPE_INVALID');
     if(edits.has(op.kind)){
      const original=values.rootOf(op,read),lift=!context&&['session-set','session-skip'].includes(original.kind);
      need(lift?text(original.lift_lineage_id)&&op.lift_lineage_id===original.lift_lineage_id:!own(op,'lift_lineage_id'),'EDIT_LINEAGE_INVALID');
     }
    }
    const current=context?Context.originalFields(op):op.schema_version===1?legacyFields(op):V.originalFields(op),changes=(corrections.get(id)||[]).slice().sort((a,b)=>rank.get(a.id)-rank.get(b.id));
    if(roots.has(op.kind)&&op.schema_version===2)V.assertOriginal(op,current,read);
    for(const change of changes){values.assertPatch(change.patch,op,read);for(const [field,value]of Object.entries(change.patch)){
     if(clear(value))delete current[field];else current[field]=copy(value);
    }}
    const removed=(removals.get(id)||[]).slice().sort((a,b)=>rank.get(a)-rank.get(b)),active=removed.length===0;
    if(op.kind==='session-skip'&&op.schema_version===2)need(current.skip_scope==='set'?text(current.logical_set_slot):current.skip_scope==='lift'&&!own(current,'logical_set_slot'),'SKIP_RESULT_INVALID');
    if(context&&op.kind==='fact'){
     Context.validateValues(op.class,current);Context.validateReferences(op,current,read);
    }
    if(op.kind==='correction'){
     need(exact(op.payload,['replacement_fields']),'CORRECTION_PAYLOAD');values.assertPatch(current.replacement_fields,read(op.target_op_id),read);
     if(active)add(corrections,op.target_op_id,{id,patch:current.replacement_fields});
    }else if(op.kind==='tombstone'){
     need(exact(op.payload,['reason'])&&text(current.reason),'REMOVAL_REASON');if(active)add(removals,op.target_op_id,id);
    }
    result.set(id,{active,current,correction_ids:changes.map(c=>c.id),removal_ids:removed,issues:[]});
   }catch(error){if(typeof error.code!=='string')throw error;block(root,error.code);}
  }
  for(const id of ids){const root=rootFor.get(id);if(!root)continue;
   const issues=unhandled.has(root)?[id===root?unhandled.get(root):'EDIT_OF_UNHANDLED_TARGET']:[...(blocked.get(root)||[])];
   if(issues.length)result.set(id,{active:null,current:null,correction_ids:[],removal_ids:[],issues});
   if(read(root).schema_version===1&&!Context.classes.has(read(root).class)&&result.has(id))result.get(id).issues.push(...legacyContext(read(root),read));
  }
  return result;
 }
 const acceptedView=fold(accepted),localIds=ordered.filter(id=>['accepted-through-frontier','stored-on-this-device'].includes(byId.get(id).status));
 const localView=localIds.length===accepted.length?new Map(acceptedView):fold(localIds),ancestorCache=new Map();
 function ancestors(id){if(ancestorCache.has(id))return ancestorCache.get(id);
  const found=new Set(),stack=dependencies(read(id)).slice();while(stack.length){const parent=stack.pop();if(found.has(parent))continue;found.add(parent);if(byId.has(parent))stack.push(...dependencies(read(parent)));}
  ancestorCache.set(id,found);return found;
 }
 for(const [root,ids]of members){const active=ids.filter(id=>['accepted-through-frontier','stored-on-this-device'].includes(byId.get(id).status)),issues=[];
  if(ids.some(id=>byId.get(id).status==='stored-status-unresolved'||unavailable.has(id)))issues.push('RECORD_STATUS_UNRESOLVED');
  const effects=active.filter(id=>edits.has(read(id).kind)),pending=effects.filter(id=>byId.get(id).status==='stored-on-this-device');
  for(const a of pending)for(const b of effects){
   if(a===b)continue;
   // An accepted prefix cannot descend from pending work. Avoid building a
   // transitive-ancestor set for every accepted effect just to prove that fact.
   if(!ancestors(a).has(b)&&(byId.get(b).status==='accepted-through-frontier'||!ancestors(b).has(a))&&!issues.includes('CONCURRENT_EDIT_INTERPRETATION_REQUIRED'))issues.push('CONCURRENT_EDIT_INTERPRETATION_REQUIRED');
  }
  if(issues.length)for(const id of ids)localView.set(id,{active:null,current:null,correction_ids:[],removal_ids:[],issues:issues.slice()});
 }
 const records=ordered.filter(id=>rootFor.has(id)).map(id=>{
   const row=byId.get(id),root=rootFor.get(id),effects=id===root?members.get(root).filter(x=>x!==root):[];
   const rejected=row.status==='rejected'?{active:false,current:null,correction_ids:[],removal_ids:[],issues:['REJECTED_SOURCE']}:null;
   return {id,root_id:root,kind:row.operation.kind,accepted:acceptedView.get(id)||null,local:rejected||localView.get(id)||null,
    effect_ids:id===root?effects:[],last_effect_sequence:id===root?effects.reduce((max,x)=>Math.max(max,byId.get(x).receipt_sequence||0),0):0};
  });
 // ONE fold, separate factual families. Context is never silently admitted to
 // native workout source_members or engine history by sharing this interpreter.
 const context_records=records.filter(row=>Context.classes.has(read(row.root_id).class));
 for(const row of context_records)if(row.id===row.root_id&&read(row.id).kind==='fact'){
  for(const layer of ['accepted','local'])if(row[layer]){
   // local can share accepted references when no pending work exists: add the
   // same deterministic factual label, never a physiological guard or default.
   row[layer].observation_state=Context.observationState(read(row.id).class,row[layer]);
  }
 }
 return {profile:'earned/typed-workout-edit-history/v1',frontier:watermark,
  records:records.filter(row=>!Context.classes.has(read(row.root_id).class)),context_records,progression_eligible:false};
}
module.exports={normalizeWorkoutHistory};
