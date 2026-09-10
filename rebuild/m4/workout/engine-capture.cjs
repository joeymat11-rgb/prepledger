'use strict';
// Internal mechanical adapter. The host owns authenticated original/current
// inputs, source custody and policy qualification. No engine defaults or writes.
const PROFILE='earned/engine-workout-capture/v1';
// Explicit opt-in candidate; an old consumer must not discard typed load meaning.
const CONFIGURATION_PROFILE='earned/engine-workout-capture/v2';
const copy=structuredClone,same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=code=>{const error=new Error(code);error.code=code;throw error;};
const unknown=()=>({state:'unknown',display:'Unavailable',source_json:null});
const textCell=value=>typeof value==='string'&&value.length?{state:'specified',display:value,source_json:JSON.stringify(value)}:unknown();
const valueCell=(display,value)=>({state:'specified',display,source_json:JSON.stringify(value)});
function createEngineWorkoutCapture({engine,prescriptionCapture,producerIdentity,sourceProjectionReader}={}){
 if(typeof engine?.genSession!=='function'||typeof engine?.rirPlan!=='function'||typeof prescriptionCapture?.prepare!=='function'||![PROFILE,CONFIGURATION_PROFILE].includes(producerIdentity?.rule_profile))
  throw new TypeError('Explicit engine readers, capture validator and registered producer profile required');
 const sourceAware=prescriptionCapture.profile==='earned/workout-prescription/v2';
 if(sourceAware&&typeof sourceProjectionReader?.workoutInput!=='function')throw new TypeError('Actual source projection consumer required');
 const producer=copy(producerIdentity);
 const configured=producer.rule_profile===CONFIGURATION_PROFILE,layoutProfile=configured?'earned/captured-lift-layout/v2':'earned/captured-lift-layout/v1';
 const number=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&!Object.is(x,-0);
 const configuration=x=>typeof x==='string'&&x.trim().length>0;
 const exact=(x,names)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===names.length&&names.every(k=>Object.hasOwn(x,k));
 function loadCell(value){
  if(value===null)return {state:'not_prescribed',display:'Find a working load',source_json:null};
  if(configured&&configuration(value))return valueCell(value,{kind:'configuration',configuration_key:value});
  return valueCell(value+' lb',{value,unit:'lb'});
 }
 function readLoad(cell){
  if(cell.state==='not_prescribed'&&cell.display==='Find a working load'&&cell.source_json===null)return {state:'not_prescribed'};
  if(cell.state!=='specified')fail('ENGINE_CAPTURE_PROFILE_INVALID');
  const source=JSON.parse(cell.source_json);
  if(exact(source,['value','unit'])&&number(source.value)&&source.unit==='lb'&&cell.display===source.value+' lb')return {state:'specified',source};
  if(exact(source,['kind','configuration_key'])&&source.kind==='configuration'&&configuration(source.configuration_key)&&cell.display===source.configuration_key)return {state:'specified',source};
  fail('ENGINE_CAPTURE_PROFILE_INVALID');
 }
 function prepare({state,day,sleep,basis,sourceProjection,source_basis}={}){
  if(sourceAware){
   const consumed=sourceProjectionReader.workoutInput(sourceProjection,source_basis);
   if(state!==undefined&&state!==consumed.state)fail('ENGINE_CAPTURE_SOURCE_INPUT_DISAGREEMENT');
   state=consumed.state;source_basis=consumed.source_basis;
  }
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
    if(!number(card.w)&&!(configured&&configuration(card.w)))fail('ENGINE_CAPTURE_LOAD_UNPROVEN');
    // genSession looks up the first unfinished matching move after choosing an
    // active lift. Multiple matching moves do not prove which load vector won.
    const selected=card.isDebutNow?input.queue.filter(q=>q.exId===card.id&&!q.done&&['debut','unlock'].includes(q.kind)):[];
    if(selected.length>1)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
    const q=selected[0];
    if(configured&&configuration(card.w)){
     // genSession selects q.newW when non-null, otherwise the original scalar.
     // An opaque configuration never supplies magnitudes for a numeric vector.
     const selectedLoad=q?.newW!=null?q.newW:original.w;
     if(card.w!==selectedLoad||q?.newWSets!==undefined||original.wSets!==undefined)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
     loads=card.tgt.map(()=>card.w);
    }else{
    if(q?.newWSets!==undefined){if(q.newW!==card.w)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');loads=copy(q.newWSets);}
    else if(original.wSets!==undefined){if(card.w!==original.w)fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');loads=copy(original.wSets);}
    else loads=card.tgt.map(()=>card.w);
    if(!Array.isArray(loads)||loads.length!==card.tgt.length||!Array.from(loads).every(x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&!Object.is(x,-0)))fail('ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
    }
   }
   for(let i=0;i<card.tgt.length;i++){
    const target=card.tgt[i],reserve=effort.plan[i];
    if(!Number.isSafeInteger(target)||target<0||Object.is(target,-0)||!Number.isSafeInteger(reserve)||reserve<0||Object.is(reserve,-0))fail('ENGINE_CAPTURE_TARGET_UNPROVEN');
    const id=JSON.stringify([card.id,i+1]),load=loadCell(loads[i]);
    slots.push({logical_set_slot:id,lift_lineage_id:card.id,label:card.n,
     load,
     reps:card.baselineAsk?{state:'not_prescribed',display:'Record the reps performed',source_json:null}:valueCell(String(target),{value:target,unit:'rep'}),
     effort:valueCell(reserve+' reps in reserve',{target:reserve,unit:'rep'}),setup:textCell(card.setup),
     reason:textCell([card.note,card.live,...effort.why].filter(x=>typeof x==='string'&&x.length).join('\n')),confidence:unknown()});
    layout.push({logical_set_slot:id,lift_lineage_id:card.id,position:i+1,prescribed_effort:{state:'specified',target:reserve},...(configured?{prescribed_load:readLoad(load)}:{})});
   }
  }
  if(JSON.stringify(input)!==before)fail('ENGINE_CAPTURE_READER_MUTATED_INPUT');
  const capture=prescriptionCapture.prepare({profile:prescriptionCapture.profile,producer,basis:copy(basis),
   ...(sourceAware?{source_basis:copy(source_basis)}:{}),
   session:{instruction:textCell(session.name),reason:textCell(session.structural),confidence:unknown()},slots},{producer,basis,...(sourceAware?{source_basis}:{})});
  return {capture,layout:{profile:layoutProfile,producer:copy(producer),basis:copy(basis),correspondence_profile:producer.rule_profile,slots:layout}};
 }
 function resolveLayout({start,originalInput}={}){
  if(!start?.prescription_capture||!originalInput||!same(start.prescription_capture.producer,producer)||!same(start.prescription_capture.basis,originalInput.basis))fail('ENGINE_CAPTURE_ORIGINAL_INPUT_REQUIRED');
  // Read-only reconstruction uses the held ORIGINAL engine/clock/input, never
  // current state. Whole capture equality detects a mismatched historical basis.
  const result=prepare(originalInput);
  if(!same(result.capture,start.prescription_capture))fail('ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT');
  return result.layout;
 }
 function readLayout(originalCapture){
  // Interpret only this exact registered producer's already authenticated
  // original capture. This is format meaning, not engine execution attestation.
  // Do not read a getter while obtaining the context for the shared validator.
  const basis=Object.getOwnPropertyDescriptor(originalCapture||{},'basis');
  if(!basis||!Object.hasOwn(basis,'value'))fail('ENGINE_CAPTURE_PROFILE_INVALID');
  const capture=typeof prescriptionCapture.read==='function'?prescriptionCapture.read(originalCapture):prescriptionCapture.prepare(originalCapture,{producer,basis:basis.value});
  if(!same(capture.producer,producer))fail('ENGINE_CAPTURE_PROFILE_INVALID');
  const slots=[],closed=new Set();let lift=null,position=0;
  for(const slot of capture.slots){
   if(slot.lift_lineage_id!==lift){if(lift!==null)closed.add(lift);lift=slot.lift_lineage_id;position=0;if(closed.has(lift))fail('ENGINE_CAPTURE_PROFILE_INVALID');}
   position++;
   if(slot.logical_set_slot!==JSON.stringify([lift,position])||slot.effort.state!=='specified')fail('ENGINE_CAPTURE_PROFILE_INVALID');
   // Shared capture preparation already applied the configured strict parser.
   const effort=JSON.parse(slot.effort.source_json);
   if(!effort||Object.keys(effort).length!==2||effort.unit!=='rep'||!Number.isSafeInteger(effort.target)||effort.target<0||Object.is(effort.target,-0))fail('ENGINE_CAPTURE_PROFILE_INVALID');
   slots.push({logical_set_slot:slot.logical_set_slot,lift_lineage_id:lift,position,prescribed_effort:{state:'specified',target:effort.target},...(configured?{prescribed_load:readLoad(slot.load)}:{})});
  }
  return {profile:layoutProfile,producer:copy(capture.producer),basis:copy(capture.basis),correspondence_profile:producer.rule_profile,slots};
 }
 return Object.freeze({prepare,resolveLayout,readLayout});
}
module.exports={createEngineWorkoutCapture,PROFILE,CONFIGURATION_PROFILE};
