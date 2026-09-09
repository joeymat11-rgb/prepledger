'use strict';
// Internal mechanical adapter. The host owns authenticated original/current
// inputs, source custody and policy qualification. No engine defaults or writes.
const PROFILE='earned/engine-workout-capture/v1';
const copy=structuredClone,same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=code=>{const error=new Error(code);error.code=code;throw error;};
const unknown=()=>({state:'unknown',display:'Unavailable',source_json:null});
const textCell=value=>typeof value==='string'&&value.length?{state:'specified',display:value,source_json:JSON.stringify(value)}:unknown();
const valueCell=(display,value)=>({state:'specified',display,source_json:JSON.stringify(value)});
function createEngineWorkoutCapture({engine,prescriptionCapture,producerIdentity}={}){
 if(typeof engine?.genSession!=='function'||typeof engine?.rirPlan!=='function'||typeof prescriptionCapture?.prepare!=='function'||producerIdentity?.rule_profile!==PROFILE)
  throw new TypeError('Explicit engine readers, capture validator and registered producer profile required');
 const producer=copy(producerIdentity);
 function prepare({state,day,sleep,basis}={}){
  if(!state||!Array.isArray(state.exercises)||!Array.isArray(state.queue)||typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))fail('ENGINE_CAPTURE_INPUT_REQUIRED');
  // All reads share one owned clone, preserving any shared imported-log member.
  // This clone is not evidence that the caller supplied an authentic snapshot.
  const input=copy(state),before=JSON.stringify(input),session=engine.genSession(input,day,sleep);
  if(!session)fail('ENGINE_CAPTURE_NO_WORKOUT');
  if(!Array.isArray(session.ex)||!session.ex.length)fail('ENGINE_CAPTURE_SESSION_INVALID');
  const slots=[],layout=[],lifts=new Set();
  for(const card of session.ex){
   if(typeof card.id!=='string'||!card.id||lifts.has(card.id)||!Array.isArray(card.tgt)||!card.tgt.length)fail('ENGINE_CAPTURE_SESSION_INVALID');lifts.add(card.id);
   const originals=input.exercises.filter(ex=>ex.id===card.id);if(originals.length!==1)fail('ENGINE_CAPTURE_EXERCISE_UNPROVEN');
   // genSession's card omits holdFlag. Carry the actual governing exercise's
   // flag into the existing reader; otherwise a one-set held opener becomes0.
   const original=originals[0],effort=engine.rirPlan(input,{...card,holdFlag:original.holdFlag},sleep);
   if(!Array.isArray(effort?.plan)||effort.plan.length!==card.tgt.length||!Array.isArray(effort.why)||!effort.why.every(x=>typeof x==='string'))fail('ENGINE_CAPTURE_EFFORT_UNPROVEN');
   let loads;
   if(card.baselineAsk===true){if(card.w!==null&&card.w!==undefined)fail('ENGINE_CAPTURE_BASELINE_UNPROVEN');loads=card.tgt.map(()=>null);}
   else{
    if(typeof card.w!=='number'||!Number.isFinite(card.w)||card.w<=0)fail('ENGINE_CAPTURE_LOAD_UNPROVEN');
    // genSession looks up the first unfinished matching move after choosing an
    // active lift. Multiple matching moves do not prove which load vector won.
    const selected=card.isDebutNow?input.queue.filter(q=>q.exId===card.id&&!q.done&&['debut','unlock'].includes(q.kind)):[];
    if(selected.length>1)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
    const q=selected[0];
    if(q?.newWSets!==undefined){if(q.newW!==card.w)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');loads=copy(q.newWSets);}
    else if(original.wSets!==undefined){if(card.w!==original.w)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');loads=copy(original.wSets);}
    else loads=card.tgt.map(()=>card.w);
    if(!Array.isArray(loads)||loads.length!==card.tgt.length||!loads.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>0))fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
   }
   for(let i=0;i<card.tgt.length;i++){
    const target=card.tgt[i],reserve=effort.plan[i];
    if(!Number.isSafeInteger(target)||target<0||Object.is(target,-0)||!Number.isSafeInteger(reserve)||reserve<0||Object.is(reserve,-0))fail('ENGINE_CAPTURE_TARGET_UNPROVEN');
    const id=JSON.stringify([card.id,i+1]);
    slots.push({logical_set_slot:id,lift_lineage_id:card.id,label:card.n,
     load:loads[i]===null?{state:'not_prescribed',display:'Find a working load',source_json:null}:valueCell(loads[i]+' lb',{value:loads[i],unit:'lb'}),
     reps:card.baselineAsk?{state:'not_prescribed',display:'Record the reps performed',source_json:null}:valueCell(String(target),{value:target,unit:'rep'}),
     effort:valueCell(reserve+' reps in reserve',{target:reserve,unit:'rep'}),setup:textCell(card.setup),
     reason:textCell([card.note,card.live,...effort.why].filter(x=>typeof x==='string'&&x.length).join('\n')),confidence:unknown()});
    layout.push({logical_set_slot:id,lift_lineage_id:card.id,position:i+1,prescribed_effort:{state:'specified',target:reserve}});
   }
  }
  if(JSON.stringify(input)!==before)fail('ENGINE_CAPTURE_READER_MUTATED_INPUT');
  const capture=prescriptionCapture.prepare({profile:prescriptionCapture.profile,producer,basis:copy(basis),
   session:{instruction:textCell(session.name),reason:textCell(session.structural),confidence:unknown()},slots},{producer,basis});
  return {capture,layout:{profile:'earned/captured-lift-layout/v1',producer:copy(producer),basis:copy(basis),correspondence_profile:PROFILE,slots:layout}};
 }
 function resolveLayout({start,originalInput}={}){
  if(!start?.prescription_capture||!originalInput||!same(start.prescription_capture.producer,producer)||!same(start.prescription_capture.basis,originalInput.basis))fail('ENGINE_CAPTURE_ORIGINAL_INPUT_REQUIRED');
  // Read-only reconstruction uses the held ORIGINAL engine/clock/input, never
  // current state. Whole capture equality detects a mismatched historical basis.
  const result=prepare(originalInput);
  if(!same(result.capture,start.prescription_capture))fail('ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT');
  return result.layout;
 }
 return Object.freeze({prepare,resolveLayout});
}
module.exports={createEngineWorkoutCapture,PROFILE};
