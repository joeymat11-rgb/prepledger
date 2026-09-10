'use strict';
// NONSHIPPING C1 contract. No authentication, history fold, admission or policy.
// Production use requires the complete profile and shared edit-history amendment.
const V=require('../workout/edit-values.cjs');
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
module.exports={date,nextDate,validateValues,decode,patch,references,validateReferences,atDate,legacyCorrespondence};
