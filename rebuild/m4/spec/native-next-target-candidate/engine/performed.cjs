'use strict';
// NONSHIPPING proposed engine/performed.cjs. Validation/enumeration/formatting
// only: no progression, eligibility, authority or authentication is granted.
module.exports=function createPerformed(E,{nativeTrendContext}={}){
 const PROFILE='earned/performed-lift/v1',TYPED='earned/performed-lift/v2';
 const enteredLoad=require('./entered-load.cjs');
 const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
 function prescribed(value){
  if(exact(value,['state'])&&value.state==='not_prescribed')return true;
  if(!exact(value,['state','source'])||value.state!=='specified')return false;
  const q=value.source;
  return enteredLoad(q)||(exact(q,['value','unit'])&&q.unit==='lb'&&q.value===0&&!Object.is(q.value,-0));
 }
 function recorded(value){
  return value&&enteredLoad(value.load)&&value.reps?.unit==='rep'&&Number.isSafeInteger(value.reps.value)&&value.reps.value>=0&&!Object.is(value.reps.value,-0);
 }
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
  if(![PROFILE,TYPED].includes(entry.profile)||!text(entry.start_op_id)||!text(entry.lift_lineage_id)||!Array.isArray(entry.slots)||!entry.slots.length)invalid();
  if(!entry.completion||!text(entry.completion.op_id)||!['normal','early'].includes(entry.completion.kind)||
    !['stored-on-this-device','accepted-through-frontier'].includes(entry.completion.status)){
   const error=new Error('PERFORMED_COMPLETION_REQUIRED');error.code=error.message;throw error;
  }
  const ids=new Set(),sourceIds=new Set();
  if(entry.correspondence_profile!==undefined&&!text(entry.correspondence_profile))invalid();
  for(const [i,slot]of entry.slots.entries()){
   if(!slot||slot.position!==i+1||!text(slot.logical_set_slot)||
    (entry.correspondence_profile===undefined&&slot.logical_set_slot!==JSON.stringify([entry.lift_lineage_id,i+1]))||ids.has(slot.logical_set_slot)||!known.has(slot.state))invalid();
   ids.add(slot.logical_set_slot);
   if(entry.profile===TYPED&&!prescribed(slot.prescribed_load))invalid();
   const target=slot.prescribed_effort;
   if(target&&!(target.state==='specified'&&Number.isSafeInteger(target.target)&&target.target>=0&&!Object.is(target.target,-0)||
     ['unknown','not_prescribed'].includes(target.state)&&!owns(target,'target')))invalid();
   if(slot.state==='performed'){
    const f=slot.fact,v=f?.current;
    if(!f||f.included!==true||!text(f.source_op_id)||f.logical_set_slot!==slot.logical_set_slot||f.lift_lineage_id!==entry.lift_lineage_id||
      !['stored-on-this-device','accepted-through-frontier'].includes(f.source_status)||
      !['stored-on-this-device','accepted-through-frontier'].includes(f.current_status)||!Array.isArray(f.edit_op_ids)||!f.edit_op_ids.every(text)||new Set(f.edit_op_ids).size!==f.edit_op_ids.length||
      !Array.isArray(f.issues)||f.issues.length||!v||(entry.profile===TYPED?!recorded(v):v.load?.unit!=='lb'||!Number.isFinite(v.load.value)||v.load.value<=0)||
      v.reps?.unit!=='rep'||!Number.isSafeInteger(v.reps.value)||v.reps.value<0||Object.is(v.reps.value,-0))invalid();
    effort(v.reserve);
    if(entry.profile===TYPED){if(!recorded(f.original))invalid();effort(f.original.reserve);}
   }else if(slot.state==='removed'){if(slot.fact)removedFact(slot.fact,slot,entry);else if(!slot.removed_facts?.length)invalid();}
   else if(slot.state==='skipped'){
    if(!text(slot.skip_op_id))invalid();if(slot.fact)removedFact(slot.fact,slot,entry);
   }
   else if(slot.state==='unlogged'&&(slot.fact||slot.skip_op_id))invalid();
   else if(slot.state==='unresolved'&&(!Array.isArray(slot.issues)||!slot.issues.length||!slot.issues.every(text)))invalid();
   if(slot.fact){if(sourceIds.has(slot.fact.source_op_id))invalid();sourceIds.add(slot.fact.source_op_id);}
   if(slot.removed_facts!==undefined){
    if(!Array.isArray(slot.removed_facts))invalid();
    for(const fact of slot.removed_facts){removedFact(fact,slot,entry);if(sourceIds.has(fact.source_op_id))invalid();sourceIds.add(fact.source_op_id);}
   }
  }
  return entry; // Trusted producer supplies finite JSON; never mutate its facts.
 }
 const original=slot=>slot.origin!=='added';
 const originalSlots=rich=>rich.slots.filter(original);
 const slotEffort=slot=>slot.state==='performed'?effort(slot.fact.current.reserve):{tag:slot.state==='unlogged'?'absent':slot.state};
 function performedRirSets(entry){
  const value=performedEntry(entry);if(!value)return null;
  return value.slots.map(slotEffort);
 }
 // Effort ratings of the ORIGINAL positions only, in position order: the vector
 // progressStep's opener/terminal rule and the hot-opener count read. An added
 // position's effort never enters it, whatever its value.
 function performedOriginalRirSets(entry){
  const value=performedEntry(entry);if(!value)return null;
  return originalSlots(value).map(slotEffort);
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
  const rich=performedEntry(entry);if(!rich)invalid();const originals=originalSlots(rich),values=originals.map(slotEffort),last=originals.at(-1);
  const line=performedLine(rich),holeState={skipped:'A skipped',unlogged:'An unlogged',removed:'A removed',unresolved:'An unresolved'};
  const hole=line.beyond?` ${holeState[line.stop]} original position sits before the final set; only the performed positions before it anchor the line, and the hole supplies no value.`:'';
  const added=line.added?` ${line.added} added ${line.added===1?'set was':'sets were'} recorded after the original positions; ${line.added===1?'it does':'they do'} not size this step.`:'';
  if(!originals.length)return `No original prescribed position was captured for this lift in that session, so no opener or final-set rating sizes this step; the current rule uses its default step proposal.${added}`;
  const target=last.prescribed_effort?.state==='specified'?`its recorded effort target was ${last.prescribed_effort.target} reps left`:
   last.prescribed_effort?.state==='not_prescribed'?'no effort target was prescribed for it':'its recorded effort target is unavailable';
  const terminalRoles={'terminal-ge3':'a larger','terminal-eq2':'a two-rep','terminal-eq1':'a two-rep','terminal-zero':'a one-rep'};
  if(owns(terminalRoles,role))return `final set reported ${effortText(values.at(-1))} reps left; ${target}. The current rule selects ${terminalRoles[role]} step proposal from this rating.${hole}${added}`;
  const openerRoles={'opener-ge3':'a two-rep','opener-eq2':'a one-rep','opener-low':'a one-rep'};
  if(owns(openerRoles,role))return `opener reported ${effortText(values[0])} reps left. ${values.length===1?'For this single-set workout the current rule uses the opener rating.':'The captured final set has no usable effort rating for this rule.'} This produces ${openerRoles[role]} step proposal.${hole}${added}`;
  if(role==='no-rating')return `Neither the opener nor the captured final set supplies the effort rating used by this rep-step rule. Other recorded sets remain on the history; the current rule uses its default step proposal.${hole}${added}`;
  throw new TypeError('PERFORMED_WHY_BRANCH_UNREGISTERED');
 }
 function performedNumericEntry(entry){
  const rich=performedEntry(entry);if(!rich)return null;
  const configured=rich.slots.filter(slot=>slot.state==='performed'&&slot.fact.current.load.kind==='configuration');
  if(configured.length){const error=new Error('PERFORMED_NUMERIC_LOAD_UNAVAILABLE');error.code=error.message;
   error.reason='configuration_has_no_numeric_magnitude';error.source_op_ids=configured.map(slot=>slot.fact.source_op_id);throw error;}
  return rich;
 }
 function performedTypedSlots(entry){const rich=performedEntry(entry);return rich?structuredClone(rich.slots):null;}
 function performedLoadText(value){if(!enteredLoad(value))invalid();return value.kind==='configuration'?value.configuration_key:value.value+' lb';}
 function performedValues(entry){const rich=performedNumericEntry(entry);if(!rich)return null;
  if(rich.slots.some(slot=>slot.state==='unresolved'))return null;
  return rich.slots.filter(slot=>slot.state==='performed').map(slot=>({position:slot.position,
   load:slot.fact.current.load.value,unit:slot.fact.current.load.unit,reps:slot.fact.current.reps.value}));
 }
 function performedPair(a,b){
  const A=performedEntry(a),B=performedEntry(b);if(!A||!B||A.start_op_id===B.start_op_id||A.lift_lineage_id!==B.lift_lineage_id)return null;
  if(A.correspondence_profile!==B.correspondence_profile)return null;
  const av=performedValues(A),bv=performedValues(B);if(!av||!bv||!av.length||av.length!==bv.length)return null;
  if(!av.every((x,i)=>x.position===bv[i].position&&x.load===bv[i].load&&x.unit===bv[i].unit))return null;
  return {a:av.map(x=>x.reps),b:bv.map(x=>x.reps)};
 }
 function performedHistory(s,chronology){
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
    for(const slot of rich.slots)for(const fact of [...(slot.fact?[slot.fact]:[]),...(slot.removed_facts||[])]){if(sources.has(fact.source_op_id))invalid();sources.add(fact.source_op_id);}
   }
   rows.push({d,rec:session.record,source:'performed',start_op_id:session.start_op_id});
  }
  if(!starts.size)return rows;
  const unresolved=code=>{const error=new Error(code);error.code=code;throw error;};
  // The internal producer calls engine-order on the same authenticated source.
  // This field transports its result; it is neither a renderer input nor an
  // authentication/partition/eligibility grant. Old imports need their mapping.
  const legacy=rows.filter(row=>row.source==='legacy'),native=rows.filter(row=>row.source==='performed');
  const order=s.workoutFacts.order;
  if(!order||order.profile!=='earned/workout-order/v1'||!Number.isSafeInteger(order.frontier)||order.frontier<0||
    !Array.isArray(order.start_ids)||order.start_ids.length!==starts.size||new Set(order.start_ids).size!==starts.size||
    order.start_ids.some(id=>!starts.has(id)))unresolved('PERFORMED_HISTORY_ORDER_UNRESOLVED');
  if(legacy.length){
   const baseline=s.workoutFacts.legacy_baseline,anchor=order.import_anchor;
   // Internal shared immutable snapshot reference: do not duplicate/rewrite the
   // imported log or manufacture per-set weights. The authenticated import
   // controller owns the generation/activation binding; this is not a caller
   // proof. B15 applies to new operations; preserve the old engine's own order
   // within its imported baseline, then the proven post-activation native order.
   if(!baseline||baseline.profile!=='earned/imported-engine-history/v1'||baseline.session_log!==s.sessionLog||
     !text(baseline.source_generation_id)||!text(baseline.activation_op_id))
    unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
   if(chronology&&(!anchor||!text(anchor.source_generation_id)||!text(anchor.activation_op_id)||
     baseline.source_generation_id!==anchor.source_generation_id||baseline.activation_op_id!==anchor.activation_op_id))
    unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
  }
  const rank=new Map(order.start_ids.map((id,i)=>[id,i]));
  native.sort((a,b)=>rank.get(a.start_op_id)-rank.get(b.start_op_id));
  return legacy.concat(native);
 }
 function trendUnavailable(code,reason,start){
  const error=new Error(code);error.code=code;error.reason=reason;error.start_op_id=start;throw error;
 }
 function performedTrendContext(s,row){
  const unavailable=reason=>trendUnavailable('PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED',reason,row.start_op_id);
  const session=s.workoutFacts.sessions.find(x=>x.start_op_id===row.start_op_id);
  const revision=s.workoutFacts.source_revision;
  if(!session||!Number.isSafeInteger(revision)||revision<1)unavailable('source_binding_missing');
  const request={start_op_id:row.start_op_id,source_revision:revision,effective:structuredClone(session.effective)};
  if(typeof nativeTrendContext!=='function')unavailable('resolver_missing');
  let answer;try{answer=structuredClone(nativeTrendContext(structuredClone(request)));}catch(_){unavailable('resolver_failed');}
  const effective=answer?.effective,expected=request.effective;
  if(answer?.start_op_id!==request.start_op_id||answer?.source_revision!==revision||
    !effective||Object.keys(effective).length!==Object.keys(expected).length||
    !Object.keys(expected).every(k=>Object.hasOwn(effective,k)&&effective[k]===expected[k])||
    !['hard','rushed','debt'].every(k=>typeof answer[k]==='boolean'))unavailable('context_binding_or_flags_invalid');
  return {hard:answer.hard,rushed:answer.rushed,debt:answer.debt};
 }
 function performedTrendObservation(s,row,entry){
  const rich=performedEntry(entry);if(!rich||rich.start_op_id!==row.start_op_id)invalid();
  const unavailable=reason=>trendUnavailable('PERFORMED_NATIVE_TREND_UNAVAILABLE',reason,row.start_op_id);
  if(rich.slots.some(slot=>slot.state==='unresolved'))unavailable('unresolved_slots');
  performedNumericEntry(rich); // Configured magnitude retains its own explicit code.
  const k=rich.slots.filter(slot=>slot.state==='performed').length;
  if(!k)unavailable('no_performed_observations');
  const sc=E.sessionScore(rich);
  if(sc===null)unavailable(rich.slots.some(slot=>slot.state==='performed'&&slot.fact.current.reps.value>0)?'numeric_work_out_of_range':'zero_work_rule_unqualified');
  return {sc,k,...performedTrendContext(s,row)};
 }
 // Contiguous performed prefix of the ORIGINAL positions of a typed entry: the
 // line the anchor and the progression-bearing count may read. A skipped,
 // unlogged, removed or unresolved original position ends the prefix; positions
 // are never compacted and no hole is filled with zero. 'beyond' says whether
 // original performed evidence exists past the prefix; 'originals' counts the
 // original positions and 'added' the added positions, which never enter the
 // line and never end it, whatever their state.
 function performedLine(entry){
  const rich=performedEntry(entry);if(!rich)return null;
  const reps=[];let beyond=false,stop=null,added=0,originals=0;
  for(const slot of rich.slots){
   if(!original(slot)){added++;continue;}
   originals++;
   if(stop===null){
    if(slot.state==='performed'){reps.push(slot.fact.current.reps.value);continue;}
    stop=slot.state;
   }
   if(slot.state==='performed')beyond=true;
  }
  return {reps,positions:reps.length,originals,stop,beyond,added};
 }
 // Compare each performed prefix load with the applicable current prescribed
 // vector position in its own domain: numeric pounds against a finite number,
 // configuration text against the same configuration key. Mixed domains, a
 // missing position or any other prescribed value never match; a vector is
 // never scalarised or averaged and equal text is never a magnitude.
 function performedLoadMatches(entry,prescribed){
  const line=performedLine(entry);if(!line||!Array.isArray(prescribed))return false;
  const originals=originalSlots(performedEntry(entry));
  for(let i=0;i<line.positions;i++){
   const actual=originals[i].fact.current.load,want=prescribed[i];
   if(typeof want==='number'&&Number.isFinite(want)){if(!(actual.unit==='lb'&&typeof actual.value==='number'&&actual.value===want))return false;}
   else if(typeof want==='string'&&want.length){if(!(actual.kind==='configuration'&&actual.configuration_key===want))return false;}
   else return false;
  }
  return line.positions>0;
 }
 const performedHistoryRows=s=>performedHistory(s,true);
 // Fixed internal consumer: the existing hot-opener count needs membership,
 // not cross-format placement. The returned list grants no chronology.
 const performedHistoryMembers=s=>performedHistory(s,false);
 return {performedLine,performedLoadMatches,performedOriginalRirSets,performedTrendContext,performedTrendObservation,performedEntry,performedNumericEntry,performedTypedSlots,performedLoadText,performedRirSets,effortKnown,effortIs,effortText,performedRirReceipt,performedStepWhy,performedValues,performedPair,performedHistoryRows,performedHistoryMembers};
};
