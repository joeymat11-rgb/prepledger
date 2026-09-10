'use strict';
// Internal companion to reading-replay. Its caller first runs the trusted
// reading projector's COMPLETE generation/identity/prefix validation. This
// interprets daily facts; it does not authenticate a detached caller object.
const copy=structuredClone,own=(o,k)=>Object.hasOwn(o||{},k),object=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const classes=new Set(['food-day','steps']);
const fail=code=>{const e=new Error(code);e.code=code;throw e;};
const fields=cls=>cls==='food-day'?{kcal:['cal','kcal'],protein_g:['pro','g']}:{count:['steps','step']};
function dailyPatch(cls,p,{partial=false}={}){
 const map=fields(cls);if(!object(p)||!Object.keys(p).length||Object.keys(p).some(k=>!own(map,k)))fail('DAILY_FIELDS_UNSUPPORTED');
 const out={};for(const [key,q]of Object.entries(p)){
  const [field,unit]=map[key];
  if(q===null&&cls==='food-day'){out[field]=null;continue;}
  if(!object(q)||Object.keys(q).length!==2||!own(q,'value')||q.unit!==unit||typeof q.value!=='number'||!Number.isFinite(q.value)||q.value<0||Object.is(q.value,-0)||
    cls==='steps'&&!Number.isSafeInteger(q.value))fail('DAILY_QUANTITY_UNSUPPORTED');
  out[field]=q.value;
 }
 if(!partial&&cls==='food-day'&&!Object.values(out).some(v=>v!==null))fail('DAILY_OBSERVATION_REQUIRED');
 return out;
}
function projectDaily(g,deviceId){
 const c=g.collections,W=c.sync.frontier.W,ops=c.ops,positions=new Map(Object.values(c.receipts||{}).filter(r=>r.seq<=W).map(r=>[r.op_id,r.seq]));
 const status=op=>positions.has(op.op_id)?'accepted':['REJECTED','REJECTED_DEPENDENCY'].includes(c.dispositions?.[op.op_id]?.status)?'rejected':
  op.device_id===deviceId&&own(c.outbox,op.op_id)&&!['ACCEPTED','REJECTED','REJECTED_DEPENDENCY'].includes(c.dispositions?.[op.op_id]?.status)?'pending-local':'unresolved';
 const ancestors=new Map();
 function ancestry(id){
  if(ancestors.has(id))return ancestors.get(id);const seen=new Set(),colors=new Map(),stack=[[id,false]];
  while(stack.length){
   const [key,exit]=stack.pop();if(exit){colors.set(key,2);continue;}
   if(colors.get(key)===1)fail('DAILY_CAUSAL_CYCLE');if(colors.get(key)===2)continue;
   const op=ops[key];if(!op||!Array.isArray(op.causal_parents)||new Set(op.causal_parents).size!==op.causal_parents.length)fail('DAILY_CAUSAL_REFERENCE');
   colors.set(key,1);stack.push([key,true]);for(const parent of op.causal_parents){seen.add(parent);stack.push([parent,false]);}
  }
  seen.delete(id);ancestors.set(id,seen);return seen;
 }
 const targets=new Map();for(const op of Object.values(ops))if(typeof op.target_op_id==='string'){
  if(!targets.has(op.target_op_id))targets.set(op.target_op_id,[]);targets.get(op.target_op_id).push(op);
 }
 function fold(original,edits,layer){
  const issues=[],effect_ids=[];let values=null,included=true;
  try{if(original.schema_version!==1)fail('DAILY_SCHEMA_UNSUPPORTED');values=dailyPatch(original.class,original.payload);}catch(e){issues.push(e.code);}
  const relevant=edits.filter(op=>status(op)!=='rejected'&&(layer==='local'||status(op)==='accepted'));
  if(relevant.some(op=>status(op)==='unresolved'))issues.push('DAILY_STATUS_UNRESOLVED');
  try{
   for(const op of relevant){
    if(!ancestry(op.op_id).has(original.op_id))issues.push('DAILY_TARGET_CAUSAL_EDGE_REQUIRED');
    for(const other of relevant)if(op!==other&&!ancestry(op.op_id).has(other.op_id)&&!ancestry(other.op_id).has(op.op_id))issues.push('DAILY_CONCURRENT_EDITS');
   }
   relevant.sort((a,b)=>ancestry(b.op_id).has(a.op_id)?-1:ancestry(a.op_id).has(b.op_id)?1:0);
  }catch(e){issues.push(e.code);}
  for(const op of relevant){
   if(!included)issues.push('DAILY_EDIT_AFTER_REMOVAL');
   try{
    if(op.schema_version!==1||op.class!==original.class)fail('DAILY_EFFECT_UNSUPPORTED');
    if(op.kind==='correction'){
     if(!object(op.payload)||Object.keys(op.payload).length!==1||!own(op.payload,'replacement_fields'))fail('DAILY_REPLACEMENT_UNSUPPORTED');
     values={...values,...dailyPatch(op.class,op.payload.replacement_fields,{partial:true})};
    }else if(op.kind==='tombstone'){
     if(!object(op.payload)||Object.keys(op.payload).length!==1||typeof op.payload.reason!=='string'||!op.payload.reason.trim())fail('DAILY_REMOVAL_UNSUPPORTED');
     included=false;
    }else fail('DAILY_EFFECT_UNSUPPORTED');
   }catch(e){issues.push(e.code);}
   effect_ids.push(op.op_id);
  }
  return {state:issues.length?'unresolved':included?'included':'removed',values:issues.length||!included?null:values,effect_ids,issues:[...new Set(issues)]};
 }
 const records=[];for(const op of Object.values(ops))if(classes.has(op.class)&&op.kind==='fact'){
  const s=status(op),edits=targets.get(op.op_id)||[];
  records.push({op_id:op.op_id,date:op.effective?.local_date??null,status:s,original:copy(op),
   effects:edits.map(e=>({status:status(e),original:copy(e)})),accepted:s==='accepted'?fold(op,edits,'accepted'):null,
   local:['accepted','pending-local'].includes(s)?fold(op,edits,'local'):{state:s,values:null,effect_ids:[],issues:['DAILY_STATUS_UNRESOLVED']}});
 }
 for(const op of Object.values(ops))if(classes.has(op.class)&&op.kind!=='fact'&&!(ops[op.target_op_id]?.kind==='fact'&&classes.has(ops[op.target_op_id]?.class))){
  const s=status(op),v={state:s==='rejected'?'rejected':'unresolved',values:null,effect_ids:[],issues:['DAILY_TARGET_UNAVAILABLE']};
  records.push({op_id:op.op_id,date:op.effective?.local_date??null,status:s,original:copy(op),effects:[],accepted:s==='accepted'?copy(v):null,local:copy(v)});
 }
 return {profile:'earned/daily-fact-projection/v1',frontier:W,records,machineProjection:false};
}
module.exports={projectDaily,dailyPatch};
