'use strict';
// Private typed interpretation. Call only after the stored-history assembler's
// original-value/signature/complete-prefix checks. This grants no permission.
const V=require('./edit-values.cjs');
const Schema=require('./schema.cjs');
const {own,object,text,exact,clear,roots,edits,need,quantity}=V;
const copy=structuredClone;
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
 const dependencies=op=>[...new Set([...op.causal_parents,...(edits.has(op.kind)?[op.target_op_id]:[])])];
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
  if(roots.has(op.kind))rootFor.set(id,id);
  else if(edits.has(op.kind)&&rootFor.has(op.target_op_id))rootFor.set(id,rootFor.get(op.target_op_id));
  else if(op.class==='session'){rootFor.set(id,id);unhandled.set(id,edits.has(op.kind)?'EDIT_OF_UNHANDLED_TARGET':'UNHANDLED_SESSION_KIND');}
  const root=rootFor.get(id);if(root){if(!members.has(root))members.set(root,[]);members.get(root).push(id);}
 }
 const read=id=>byId.get(id)?.operation;
 function fold(ids){
  const corrections=new Map(),removals=new Map(),result=new Map(),blocked=new Map(),rank=new Map(ids.map((id,i)=>[id,i]));
  const add=(map,id,value)=>{if(!map.has(id))map.set(id,[]);map.get(id).push(value);};
  const block=(root,reason)=>{if(!blocked.has(root))blocked.set(root,new Set());blocked.get(root).add(reason);};
  for(const id of ids){const op=read(id),root=rootFor.get(id);if(!root||unhandled.has(root)||!edits.has(op.kind))continue;
   const source=read(root),target=read(op.target_op_id);
   if(op.schema_version===2&&op.class!=='session')block(root,'EDIT_CLASS_INVALID');
   if(op.schema_version!==source.schema_version||op.schema_version!==target?.schema_version)block(root,source.schema_version===1?'LEGACY_BRIDGE_REQUIRED':'MIXED_SCHEMA_EDIT_BRIDGE_REQUIRED');
   if(op.schema_version===1){const patch=op.payload?.replacement_fields;
    const supported=target?.schema_version===1&&target.kind==='session-set'&&(op.kind==='tombstone'?exact(op.payload,['reason'])&&text(op.payload.reason):
     exact(op.payload,['replacement_fields'])&&object(patch)&&Object.keys(patch).length>0&&Object.entries(patch).every(([k,v])=>k==='load'?quantity(v,'lb'):k==='reps'&&quantity(v,'rep')));
    if(!supported)block(root,'LEGACY_EDIT_INTERPRETATION_REQUIRED');
   }
  }
  for(const id of ids.slice().reverse()){
   const op=read(id),root=rootFor.get(id);if(!root||blocked.has(root)||unhandled.has(root))continue;
   try{
    if(op.schema_version===2){
     const shape={...op};if(op.kind==='session-start')delete shape.prescription_capture;
     need(Schema.validateWorkoutShape(shape).valid,'WORKOUT_ORIGINAL_SHAPE_INVALID');
     if(edits.has(op.kind)){
      const original=V.rootOf(op,read),lift=['session-set','session-skip'].includes(original.kind);
      need(lift?text(original.lift_lineage_id)&&op.lift_lineage_id===original.lift_lineage_id:!own(op,'lift_lineage_id'),'EDIT_LINEAGE_INVALID');
     }
    }
    const current=V.originalFields(op),changes=(corrections.get(id)||[]).slice().sort((a,b)=>rank.get(a.id)-rank.get(b.id));
    if(roots.has(op.kind))V.assertOriginal(op,current,read);
    for(const change of changes){V.assertPatch(change.patch,op,read);for(const [field,value]of Object.entries(change.patch)){
     if(clear(value))delete current[field];else current[field]=copy(value);
    }}
    const removed=(removals.get(id)||[]).slice().sort((a,b)=>rank.get(a)-rank.get(b)),active=removed.length===0;
    if(op.kind==='session-skip'&&op.schema_version===2)need(current.skip_scope==='set'?text(current.logical_set_slot):current.skip_scope==='lift'&&!own(current,'logical_set_slot'),'SKIP_RESULT_INVALID');
    if(op.kind==='correction'){
     need(exact(op.payload,['replacement_fields']),'CORRECTION_PAYLOAD');V.assertPatch(current.replacement_fields,read(op.target_op_id),read);
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
   if(read(root).schema_version===1&&result.has(id))result.get(id).issues.push('LEGACY_CONTEXT_UNQUALIFIED');
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
 return {profile:'earned/typed-workout-edit-history/v1',frontier:watermark,
  records:ordered.filter(id=>rootFor.has(id)).map(id=>{
   const row=byId.get(id),root=rootFor.get(id),effects=id===root?members.get(root).filter(x=>x!==root):[];
   const rejected=row.status==='rejected'?{active:false,current:null,correction_ids:[],removal_ids:[],issues:['REJECTED_SOURCE']}:null;
   return {id,root_id:root,kind:row.operation.kind,accepted:acceptedView.get(id)||null,local:rejected||localView.get(id)||null,
    effect_ids:id===root?effects:[],last_effect_sequence:id===root?effects.reduce((max,x)=>Math.max(max,byId.get(x).receipt_sequence||0),0):0};
  }),progression_eligible:false};
}
module.exports={normalizeWorkoutHistory};
