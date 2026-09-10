'use strict';
// Shared factual values under the accepted rev164 contract. No authentication,
// schema issuance, source coverage, currentness or physiological permission.
const V=require('./edit-values.cjs');
const {own,object,text,exact,clear,need,effective}=V,copy=structuredClone;
const classes=new Set(['sleep','event','illness','pain-attestation']);
const reserved=new Set(['source-import-intent','source-rollback-intent']);
function date(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const stamp=Date.parse(value+'T00:00:00Z');
 return Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,10)===value;
}
function nextDate(value){
 need(date(value),'CONTEXT_DATE');const stamp=Date.parse(value+'T00:00:00Z')+86400000;
 const result=new Date(stamp).toISOString().slice(0,10);need(date(result),'CONTEXT_DATE_RANGE');return result;
}
function keys(value,required,optional=[]){
 need(object(value)&&required.every(k=>own(value,k))&&Object.keys(value).every(k=>required.includes(k)||optional.includes(k)),'CONTEXT_FIELDS');
}
function interval(value,{closed=false,originalPain=false}={}){
 keys(value,['start'],['end']);need(date(value.start),'CONTEXT_INTERVAL_START');
 if(own(value,'end'))need(date(value.end)&&value.start<=value.end,'CONTEXT_INTERVAL_END');
 need(!closed||own(value,'end'),'CONTEXT_INTERVAL_END_REQUIRED');
 need(!originalPain||!own(value,'end'),'PAIN_CLOSE_REQUIRES_TARGETED_EDIT');
}
function validateValues(cls,value,{original=false}={}){
 need(classes.has(cls),'CONTEXT_CLASS');need(object(value)&&effective(value.effective),'CONTEXT_EFFECTIVE');
 if(cls==='sleep'){
  keys(value,['effective','night_start_date'],['hours','quality']);
  need(date(value.night_start_date),'CONTEXT_NIGHT_DATE');
  need(!original||own(value,'hours')||own(value,'quality'),'CONTEXT_SLEEP_OBSERVATION_REQUIRED');
  if(own(value,'hours'))need(exact(value.hours,['value','unit'])&&value.hours.unit==='h'&&typeof value.hours.value==='number'&&
   Number.isFinite(value.hours.value)&&!Object.is(value.hours.value,-0)&&value.hours.value>=0&&value.hours.value<=24,'CONTEXT_HOURS');
  if(own(value,'quality'))need(['poor','okay','good'].includes(value.quality),'CONTEXT_QUALITY');
 }else if(cls==='event'){
  keys(value,['effective','type','interval'],['label']);need(text(value.type),'CONTEXT_EVENT_TYPE');
  // Only the separate validated source binding may recognize control IDs.
  need(!reserved.has(value.type),'SOURCE_CONTROL_REQUIRES_BOUND_PROFILE');
  interval(value.interval,{closed:true});
  if(own(value,'label'))need(text(value.label),'CONTEXT_LABEL');
 }else if(cls==='illness'){
  keys(value,['effective','interval'],['note']);interval(value.interval);
  if(own(value,'note'))need(text(value.note),'CONTEXT_NOTE');
 }else{
  need(['session-only','open-interval'].includes(value.scope),'CONTEXT_PAIN_SCOPE');
  keys(value,['effective','scope',value.scope==='session-only'?'session_start_op_id':'interval'],['note']);
  if(value.scope==='session-only')need(text(value.session_start_op_id),'CONTEXT_START_REFERENCE');
  else interval(value.interval,{originalPain:original});
  if(own(value,'note'))need(text(value.note),'CONTEXT_NOTE');
 }
 return copy(value);
}
function decode(op){
 need(object(op)&&classes.has(op.class)&&op.kind==='fact','CONTEXT_ORIGINAL');
 // Never reinterpret historical units, missing fields, null or clear-shaped data.
 if(op.schema_version===1)return {state:'uninterpreted',original:copy(op),current:null,issues:['LEGACY_CONTEXT_UNQUALIFIED']};
 need(op.schema_version===2,'CONTEXT_VERSION');
 need(object(op.payload)&&!own(op.payload,'effective'),'CONTEXT_PAYLOAD');
 const current=validateValues(op.class,{...copy(op.payload),effective:copy(op.effective)},{original:true});
 return {state:'interpreted',original:copy(op),current,issues:[]};
}
function patch(cls,current,replacements){
 validateValues(cls,current);need(object(replacements)&&Object.keys(replacements).length,'CONTEXT_PATCH_EMPTY');
 const allowed={sleep:['effective','night_start_date','hours','quality'],event:['effective','type','interval','label'],
  illness:['effective','interval','note'],'pain-attestation':['effective','interval','note']}[cls];
 const optional={sleep:['hours','quality'],event:['label'],illness:['note'],'pain-attestation':['note']}[cls];
 const result=copy(current);
 for(const [key,value]of Object.entries(replacements)){
  need(allowed.includes(key),'CONTEXT_PATCH_FIELD');
  if(clear(value)){need(optional.includes(key),'CONTEXT_CLEAR_REQUIRED');delete result[key];}
  else if(key==='interval'){
   // The interval replacement is complete: omitted end explicitly reopens the
   // reported interval; it does not silently retain a superseded end.
   result.interval=copy(value);
  }else result[key]=copy(value);
 }
 return validateValues(cls,result);
}
function references(cls,value){
 validateValues(cls,value);
 return cls==='pain-attestation'&&value.scope==='session-only'?[value.session_start_op_id]:[];
}
function validateReferences(op,value,readOperation){
 need(typeof readOperation==='function','CONTEXT_REFERENCE_READER');
 for(const id of references(op.class,value)){
  const start=readOperation(id);
  need(start?.op_id===id&&start.athlete_id===op.athlete_id&&start.class==='session'&&start.kind==='session-start','CONTEXT_START_RELATION');
 }
 // Signature, prefix, original schema/capture and source proof remain upstream.
 return true;
}
function atDate(cls,value,onDate,{sessionStartId}={}){
 validateValues(cls,value);need(date(onDate),'CONTEXT_QUERY_DATE');
 if(cls==='sleep')return {relation:!own(value,'hours')&&!own(value,'quality')?'no-current-observation':
  onDate===nextDate(value.night_start_date)?'reported-night':'outside',policy:'unqualified'};
 if(cls==='pain-attestation'&&value.scope==='session-only')return {
  relation:sessionStartId===undefined?'session-unresolved':sessionStartId===value.session_start_op_id?'reported-session':'outside',policy:'unqualified'};
 const i=value.interval;
 return {relation:onDate<i.start?'outside':!own(i,'end')?'end-unresolved':onDate<=i.end?'within-reported-dates':'outside',policy:'unqualified'};
}
function legacyCorrespondence(cls,value){
 validateValues(cls,value);
 if(cls==='sleep')return {candidate:own(value,'hours')?{d:value.night_start_date,h:value.hours.value}:null,
  unmapped:own(value,'quality')?['quality']:[],policy:'unqualified',installed:false};
 return {candidate:null,unmapped:[cls],policy:'unqualified',installed:false};
}
const editable={sleep:['effective','night_start_date','hours','quality'],event:['effective','type','interval','label'],
 illness:['effective','interval','note'],'pain-attestation':['effective','interval','note']};
const optional={sleep:['hours','quality'],event:['label'],illness:['note'],'pain-attestation':['note']};
function assertField(cls,field,value){
 need(editable[cls]?.includes(field),'CONTEXT_PATCH_FIELD');
 if(clear(value)){need(optional[cls].includes(field),'CONTEXT_CLEAR_REQUIRED');return;}
 if(field==='effective')need(effective(value),'CONTEXT_EFFECTIVE');
 else if(field==='night_start_date')need(date(value),'CONTEXT_NIGHT_DATE');
 else if(field==='hours')need(exact(value,['value','unit'])&&value.unit==='h'&&typeof value.value==='number'&&
  Number.isFinite(value.value)&&!Object.is(value.value,-0)&&value.value>=0&&value.value<=24,'CONTEXT_HOURS');
 else if(field==='quality')need(['poor','okay','good'].includes(value),'CONTEXT_QUALITY');
 else if(field==='interval')interval(value,{closed:cls==='event'});
 else if(field==='type'){need(text(value),'CONTEXT_EVENT_TYPE');need(!reserved.has(value),'SOURCE_CONTROL_REQUIRES_BOUND_PROFILE');}
 else need(text(value),'CONTEXT_TEXT');
}
function unionPatch(cls,value){
 try{
  need(classes.has(cls),'CONTEXT_CLASS');const stack=[value];
  while(stack.length){const patch=stack.pop();need(object(patch)&&Object.keys(patch).length,'CONTEXT_PATCH_EMPTY');
   if(own(patch,'replacement_fields')){need(exact(patch,['replacement_fields']),'CONTEXT_EDIT_FIELDS');stack.push(patch.replacement_fields);}
   else for(const [field,item]of Object.entries(patch)){
    // A correction of a tombstone may only revise its reason. The actual
    // target check below distinguishes that variant from a factual patch.
    if(field==='reason')need(Object.keys(patch).length===1&&text(item),'CONTEXT_REMOVAL_REASON');
    else assertField(cls,field,item);
   }
  }return true;
 }catch(error){if(typeof error.code!=='string')throw error;return false;}
}
function rootOf(op,readOperation){
 const seen=new Set();let node=op;
 while(node){
  need(!seen.has(node.op_id),'CONTEXT_EDIT_CYCLE');seen.add(node.op_id);
  need(node.athlete_id===op.athlete_id&&node.schema_version===op.schema_version&&node.class===op.class&&classes.has(node.class),'CONTEXT_EDIT_SCOPE');
  if(node.kind==='fact'){
   // class:event also contains separately bound source controls. A context
   // edit must reach a real context original, not merely a same-class fact.
   need(node.schema_version===2,'LEGACY_CONTEXT_UNQUALIFIED');decode(node);return node;
  }
  need(V.edits.has(node.kind),'CONTEXT_EDIT_TARGET_KIND');const target=node.target_op_id;
  node=readOperation(target);need(node?.op_id===target,'CONTEXT_EDIT_TARGET_MISSING');
 }
}
function assertPatch(value,target,readOperation){
 const root=rootOf(target,readOperation);need(root.schema_version===2,'LEGACY_CONTEXT_UNQUALIFIED');
 const stack=[{patch:value,target}],seen=new Set();
 while(stack.length){const {patch,target:op}=stack.pop();
  need(op&&!seen.has(op.op_id),'CONTEXT_EDIT_TARGET_MISSING');seen.add(op.op_id);
  need(object(patch)&&Object.keys(patch).length,'CONTEXT_PATCH_EMPTY');
  need(op.athlete_id===root.athlete_id&&op.schema_version===2&&op.class===root.class,'CONTEXT_EDIT_SCOPE');
  if(op.kind==='correction'){
   need(exact(patch,['replacement_fields']),'CONTEXT_EDIT_FIELDS');
   stack.push({patch:patch.replacement_fields,target:readOperation(op.target_op_id)});
  }else if(op.kind==='tombstone')need(exact(patch,['reason'])&&text(patch.reason),'CONTEXT_REMOVAL_REASON');
  else{
   need(op.kind==='fact','CONTEXT_EDIT_TARGET_KIND');
   for(const [field,item]of Object.entries(patch)){
    assertField(root.class,field,item);
    if(root.class==='pain-attestation'&&root.payload.scope==='session-only')need(field!=='interval','CONTEXT_PATCH_FIELD');
   }
  }
 }
}
function originalFields(op){
 if(op.kind==='fact'){const result=decode(op);need(result.current,'LEGACY_CONTEXT_UNQUALIFIED');return result.current;}
 if(op.kind==='correction'){need(exact(op.payload,['replacement_fields']),'CONTEXT_EDIT_FIELDS');return copy(op.payload);}
 need(op.kind==='tombstone'&&exact(op.payload,['reason'])&&text(op.payload.reason),'CONTEXT_REMOVAL_REASON');return copy(op.payload);
}
function observationState(cls,view){
 if(view.active===null)return 'unresolved';if(!view.active)return 'removed';
 return cls==='sleep'&&!own(view.current,'hours')&&!own(view.current,'quality')?'no-current-observation':'observed';
}
module.exports={date,nextDate,validateValues,decode,patch,references,validateReferences,atDate,legacyCorrespondence,
 classes,unionPatch,rootOf,assertPatch,originalFields,observationState};
