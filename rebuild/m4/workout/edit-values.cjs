'use strict';
// Closed factual domains shared by shape, target relations and history. No
// authentication, time conversion, currentness, issuance or training policy.
const own=(x,k)=>Object.hasOwn(x,k),object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const exact=(x,keys)=>object(x)&&Object.keys(x).length===keys.length&&keys.every(k=>own(x,k));
const clear=x=>exact(x,['clear'])&&x.clear===true;
const roots=new Set(['session-start','session-set','session-skip','session-close']);
const edits=new Set(['correction','tombstone']);
const fields={
 'session-start':['effective','planned_split_slot_id'],'session-set':['effective','load','reps','reserve'],
 'session-skip':['effective','reason','skip_scope','logical_set_slot'],'session-close':['effective','completion_kind'],
 correction:['replacement_fields'],tombstone:['reason']};
const optional={'session-set':['reserve'],'session-skip':['reason','logical_set_slot']};
const quantity=(x,u)=>exact(x,['value','unit'])&&typeof x.value==='number'&&Number.isFinite(x.value)&&x.unit===u;
const need=(ok,code)=>{if(!ok){const e=new Error(code);e.code=code;throw e;}};
function effective(x){
 if(!exact(x,['local_date','local_time','utc_offset'])||typeof x.local_date!=='string'||typeof x.local_time!=='string'||typeof x.utc_offset!=='string'||
  !/^\d{4}-\d\d-\d\d$/.test(x.local_date)||! /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/.test(x.local_time)||
  !/^[+-](?:[01]\d|2[0-3]):[0-5]\d$/.test(x.utc_offset))return false;
 const day=Date.parse(x.local_date+'T00:00:00Z');return Number.isFinite(day)&&new Date(day).toISOString().slice(0,10)===x.local_date;
}
function reserve(x){
 return ['unknown','skipped','not_asked'].includes(x?.tag)?exact(x,['tag']):exact(x,['tag','value','unit'])&&x.unit==='rep'&&!Object.is(x.value,-0)&&
  (x.tag==='exact'?[0,1,2].includes(x.value):x.tag==='at_least'&&x.value===3);
}
function validValue(field,value,version=2){
 if(field==='effective')return effective(value);
 if(field==='load')return quantity(value,'lb')&&(version===1||value.value>0);
 if(field==='reps')return quantity(value,'rep')&&(version===1||Number.isSafeInteger(value.value)&&value.value>=0&&!Object.is(value.value,-0));
 if(field==='reserve')return reserve(value);
 if(field==='completion_kind')return ['normal','early'].includes(value);
 if(field==='skip_scope')return ['set','lift'].includes(value);
 return ['reason','logical_set_slot','planned_split_slot_id'].includes(field)&&text(value);
}
function assertPatch(patch,target,readOperation,{allowClear=true}={}){
 const stack=[{patch,target,allowClear}],seen=new Set();
 while(stack.length){const item=stack.pop(),p=item.patch,t=item.target;
  need(t&&fields[t.kind]&&object(p)&&Object.keys(p).length>0,'REPLACEMENT_FIELDS');
  need(!seen.has(t.op_id),'EDIT_CYCLE');seen.add(t.op_id);
  for(const [field,value]of Object.entries(p)){
   need(fields[t.kind].includes(field),'REPLACEMENT_FIELD_FORBIDDEN');
   if(clear(value)){need(item.allowClear,'RECORDED_CLEAR_FORBIDDEN');need((optional[t.kind]||[]).includes(field),'CLEAR_REQUIRED_FIELD');continue;}
   if(field==='replacement_fields')stack.push({patch:value,target:readOperation(t.target_op_id),allowClear:true});
   else need(validValue(field,value,t.schema_version),'INVALID_'+field.toUpperCase());
  }
 }
}
// Shape cannot know target kind; it admits only the closed field union. The
// same-transaction relation check subsequently validates the actual target.
function unionPatch(patch){
 const stack=[patch];while(stack.length){const p=stack.pop();if(!object(p)||!Object.keys(p).length)return false;
  for(const [field,value]of Object.entries(p)){
   if(field==='replacement_fields'){stack.push(value);continue;}
   if(clear(value)){if(!['reserve','reason','logical_set_slot'].includes(field))return false;}
   else if(!validValue(field,value))return false;
  }
 }return true;
}
function rootOf(op,readOperation){
 const seen=new Set(),athlete=op.athlete_id,version=op.schema_version;let node=op;
 while(node){
  need(!seen.has(node.op_id),'EDIT_CYCLE');seen.add(node.op_id);
  need(node.athlete_id===athlete&&node.schema_version===version&&node.class==='session','EDIT_SCOPE');
  if(!edits.has(node.kind)){need(roots.has(node.kind),'EDIT_TARGET_KIND');return node;}
  node=readOperation(node.target_op_id);need(node,'EDIT_TARGET_MISSING');
 }
}
function originalFields(op){
 need(object(op.payload),'PAYLOAD');const result={};
 if(roots.has(op.kind))result.effective=structuredClone(op.effective);
 if(op.kind==='session-start'){
  const src=op.schema_version===1?op.payload:op,key=op.schema_version===1?'slot':'planned_split_slot_id';
  if(own(src,key))result.planned_split_slot_id=structuredClone(src[key]);
 }else for(const key of fields[op.kind]||[])if(key!=='effective'){
  const src=op.kind==='session-skip'&&['skip_scope','logical_set_slot'].includes(key)?op:op.payload;
  if(own(src,key))result[key]=structuredClone(src[key]);
 }return result;
}
function assertOriginal(op,current,readOperation){
 need(op.class==='session','ROOT_CLASS');if(op.schema_version===1)return;
 const allowed={'session-start':[],'session-set':['load','reps','reserve'],'session-skip':['reason'],'session-close':['completion_kind']};
 const required={'session-start':['effective','planned_split_slot_id'],'session-set':['effective','load','reps'],
  'session-skip':['effective','skip_scope'],'session-close':['effective','completion_kind']};
 need(allowed[op.kind]&&Object.keys(op.payload).every(k=>allowed[op.kind].includes(k))&&required[op.kind].every(k=>own(current,k)),'ROOT_FIELDS_INVALID');
 assertPatch(current,op,readOperation,{allowClear:false});
}
module.exports={own,object,text,exact,clear,roots,edits,quantity,need,effective,reserve,validValue,assertPatch,unionPatch,rootOf,originalFields,assertOriginal};
