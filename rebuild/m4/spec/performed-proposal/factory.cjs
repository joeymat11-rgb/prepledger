'use strict';
// NONSHIPPING proposed engine/performed.cjs. Validation/enumeration/formatting
// only: no progression, eligibility, authority or authentication is granted.
module.exports=function createPerformed(){
 const PROFILE='earned/performed-lift/v1';
 const owns=(o,k)=>Object.hasOwn(o,k),text=x=>typeof x==='string'&&x.length>0;
 const known=new Set(['performed','unlogged','skipped','removed','unresolved']);
 function invalid(){const e=new TypeError('PERFORMED_ENTRY_INVALID');e.code=e.message;throw e;}
 function removedFact(f,slot,entry){
  if(!f||f.included!==false||!text(f.source_op_id)||f.logical_set_slot!==slot.logical_set_slot||f.lift_lineage_id!==entry.lift_lineage_id||
    !['stored-on-this-device','accepted-through-frontier'].includes(f.source_status)||!['stored-on-this-device','accepted-through-frontier'].includes(f.current_status)||
    !Array.isArray(f.issues)||f.issues.length||!Array.isArray(f.edit_op_ids)||!f.edit_op_ids.length||!f.edit_op_ids.every(text)||
    new Set(f.edit_op_ids).size!==f.edit_op_ids.length)invalid();
 }
 function effort(value){
  if(value===undefined)return {tag:'absent'};
  if(!value||typeof value!=='object')invalid();
  if(['unknown','skipped','not_asked'].includes(value.tag)&&Object.keys(value).length===1)return {...value};
  if(value.unit==='rep'&&!Object.is(value.value,-0)&&Object.keys(value).length===3&&
    (value.tag==='exact'&&[0,1,2].includes(value.value)||value.tag==='at_least'&&value.value===3))return {...value};
  invalid();
 }
 function performedEntry(entry){
  if(!entry||typeof entry.profile!=='string'||!entry.profile.startsWith('earned/performed-lift/'))return null;
  if(entry.profile!==PROFILE||!text(entry.start_op_id)||!text(entry.lift_lineage_id)||!Array.isArray(entry.slots)||!entry.slots.length)invalid();
  if(!entry.completion||!text(entry.completion.op_id)||!['normal','early'].includes(entry.completion.kind)||
    !['stored-on-this-device','accepted-through-frontier'].includes(entry.completion.status)){
   const error=new Error('PERFORMED_COMPLETION_REQUIRED');error.code=error.message;throw error;
  }
  const ids=new Set(),sourceIds=new Set();
  for(const [i,slot]of entry.slots.entries()){
   if(!slot||slot.position!==i+1||slot.logical_set_slot!==JSON.stringify([entry.lift_lineage_id,i+1])||ids.has(slot.logical_set_slot)||!known.has(slot.state))invalid();
   ids.add(slot.logical_set_slot);
   const target=slot.prescribed_effort;
   if(target&&!(target.state==='specified'&&Number.isSafeInteger(target.target)&&target.target>=0&&!Object.is(target.target,-0)||
     ['unknown','not_prescribed'].includes(target.state)&&!owns(target,'target')))invalid();
   if(slot.state==='performed'){
    const f=slot.fact,v=f?.current;
    if(!f||f.included!==true||!text(f.source_op_id)||f.logical_set_slot!==slot.logical_set_slot||f.lift_lineage_id!==entry.lift_lineage_id||
      !['stored-on-this-device','accepted-through-frontier'].includes(f.source_status)||
      !['stored-on-this-device','accepted-through-frontier'].includes(f.current_status)||!Array.isArray(f.edit_op_ids)||!f.edit_op_ids.every(text)||new Set(f.edit_op_ids).size!==f.edit_op_ids.length||
      !Array.isArray(f.issues)||f.issues.length||!v||v.load?.unit!=='lb'||!Number.isFinite(v.load.value)||v.load.value<=0||
      v.reps?.unit!=='rep'||!Number.isSafeInteger(v.reps.value)||v.reps.value<0||Object.is(v.reps.value,-0))invalid();
    effort(v.reserve);
   }else if(slot.state==='removed')removedFact(slot.fact,slot,entry);
   else if(slot.state==='skipped'){
    if(!text(slot.skip_op_id))invalid();if(slot.fact)removedFact(slot.fact,slot,entry);
   }
   else if(slot.state==='unlogged'&&(slot.fact||slot.skip_op_id))invalid();
   else if(slot.state==='unresolved'&&(!Array.isArray(slot.issues)||!slot.issues.length||!slot.issues.every(text)))invalid();
   if(slot.fact){if(sourceIds.has(slot.fact.source_op_id))invalid();sourceIds.add(slot.fact.source_op_id);}
  }
  return entry; // Trusted producer supplies finite JSON; never mutate its facts.
 }
 function performedRirSets(entry){
  const value=performedEntry(entry);if(!value)return null;
  return value.slots.map(slot=>slot.state==='performed'?effort(slot.fact.current.reserve):{tag:slot.state==='unlogged'?'absent':slot.state});
 }
 function effortKnown(value){
  if(value===null||value===undefined)return false;
  if(['absent','removed','unresolved'].includes(value.tag)&&Object.keys(value).length===1)return false;
  const valid=effort(value);return ['exact','at_least'].includes(valid.tag);
 }
 const predicates={gte3:n=>n>=3,gte2:n=>n>=2,gte1:n=>n>=1,lte2:n=>n<=2,lte1:n=>n<=1,eq0:n=>n===0,eq1:n=>n===1,eq2:n=>n===2};
 function effortIs(value,predicate){
  if(!owns(predicates,predicate))throw new TypeError('PERFORMED_PREDICATE_UNREGISTERED');
  if(!effortKnown(value))return null;
  const valid=effort(value);return predicates[predicate](valid.value);
  // For the registered thresholds, every number >=3 has the same result.
  // This does not convert the retained bound into an exact measurement.
 }
 function effortText(value){
  if(value?.tag==='exact')return String(effort(value).value);
  if(value?.tag==='at_least'){effort(value);return 'at least 3';}
  const labels={absent:'not recorded',unknown:'unknown',skipped:'skipped',not_asked:'not asked',removed:'removed',unresolved:'unresolved'};
  if(!owns(labels,value?.tag))invalid();return labels[value.tag];
 }
 function performedRirReceipt(entry){const a=performedRirSets(entry);if(!a)return null;
  return 'RIR '+(a.length===1?effortText(a[0]):effortText(a[0])+'→'+effortText(a[a.length-1]));}
 function performedStepWhy(entry,role){
  const rich=performedEntry(entry);if(!rich)invalid();const values=performedRirSets(rich),last=rich.slots.at(-1);
  const target=last.prescribed_effort?.state==='specified'?`its recorded effort target was ${last.prescribed_effort.target} reps left`:
   last.prescribed_effort?.state==='not_prescribed'?'no effort target was prescribed for it':'its recorded effort target is unavailable';
  const terminalRoles={'terminal-ge3':'a larger','terminal-eq2':'a two-rep','terminal-eq1':'a two-rep','terminal-zero':'a one-rep'};
  if(owns(terminalRoles,role))return `final set reported ${effortText(values.at(-1))} reps left; ${target}. The current rule selects ${terminalRoles[role]} step proposal from this rating.`;
  const openerRoles={'opener-ge3':'a two-rep','opener-eq2':'a one-rep','opener-low':'a one-rep'};
  if(owns(openerRoles,role))return `opener reported ${effortText(values[0])} reps left. ${values.length===1?'For this single-set workout the current rule uses the opener rating.':'The captured final set has no usable effort rating for this rule.'} This produces ${openerRoles[role]} step proposal.`;
  if(role==='no-rating')return 'Neither the opener nor the captured final set supplies the effort rating used by this rep-step rule. Other recorded sets remain on the history; the current rule uses its default step proposal.';
  throw new TypeError('PERFORMED_WHY_BRANCH_UNREGISTERED');
 }
 function performedValues(entry){const rich=performedEntry(entry);if(!rich)return null;
  if(rich.slots.some(slot=>slot.state==='unresolved'))return null;
  return rich.slots.filter(slot=>slot.state==='performed').map(slot=>({position:slot.position,
   load:slot.fact.current.load.value,unit:slot.fact.current.load.unit,reps:slot.fact.current.reps.value}));
 }
 function performedPair(a,b){
  const A=performedEntry(a),B=performedEntry(b);if(!A||!B||A.start_op_id===B.start_op_id||A.lift_lineage_id!==B.lift_lineage_id)return null;
  const av=performedValues(A),bv=performedValues(B);if(!av||!bv||!av.length||av.length!==bv.length)return null;
  if(!av.every((x,i)=>x.position===bv[i].position&&x.load===bv[i].load&&x.unit===bv[i].unit))return null;
  return {a:av.map(x=>x.reps),b:bv.map(x=>x.reps)};
 }
 function performedHistoryRows(s){
  const rows=Object.keys(s?.sessionLog||{}).sort().map(d=>({d,rec:s.sessionLog[d],source:'legacy'}));
  if(!s?.workoutFacts)return rows;
  if(s.workoutFacts.profile!=='earned/workout-facts/v1'||!Array.isArray(s.workoutFacts.sessions))invalid();
  const starts=new Set(),sources=new Set();
  for(const session of s.workoutFacts.sessions){
   const d=session?.effective?.local_date;
   if(!text(session?.start_op_id)||starts.has(session.start_op_id)||!/^\d{4}-\d{2}-\d{2}$/.test(d)||
     !Number.isFinite(Date.parse(d+'T00:00:00Z'))||new Date(d+'T00:00:00Z').toISOString().slice(0,10)!==d||!Array.isArray(session.record?.entries))invalid();
   starts.add(session.start_op_id);const lifts=new Set();
   for(const entry of session.record.entries){const rich=performedEntry(entry);
    if(!rich||rich.start_op_id!==session.start_op_id||lifts.has(rich.lift_lineage_id))invalid();lifts.add(rich.lift_lineage_id);
    for(const slot of rich.slots)if(slot.fact){if(sources.has(slot.fact.source_op_id))invalid();sources.add(slot.fact.source_op_id);}
   }
   rows.push({d,rec:session.record,source:'performed',start_op_id:session.start_op_id});
  }
  if(!starts.size)return rows;
  const unresolved=code=>{const error=new Error(code);error.code=code;throw error;};
  // The internal producer calls engine-order on the same authenticated source.
  // This field transports its result; it is neither a renderer input nor an
  // authentication/partition/eligibility grant. Old imports need their mapping.
  if(rows.some(row=>row.source==='legacy'))unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
  const order=s.workoutFacts.order;
  if(!order||order.profile!=='earned/workout-order/v1'||!Number.isSafeInteger(order.frontier)||order.frontier<0||
    !Array.isArray(order.start_ids)||order.start_ids.length!==starts.size||new Set(order.start_ids).size!==starts.size||
    order.start_ids.some(id=>!starts.has(id)))unresolved('PERFORMED_HISTORY_ORDER_UNRESOLVED');
  const rank=new Map(order.start_ids.map((id,i)=>[id,i]));
  rows.sort((a,b)=>rank.get(a.start_op_id)-rank.get(b.start_op_id));
  return rows;
 }
 return {performedEntry,performedRirSets,effortKnown,effortIs,effortText,performedRirReceipt,performedStepWhy,performedValues,performedPair,performedHistoryRows};
};
