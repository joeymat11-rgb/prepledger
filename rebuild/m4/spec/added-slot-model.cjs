'use strict';
// NONSHIPPING representation proposal. Inputs are raw JSON; the caller's
// authentication, accepted inventory, standing and currentness are NOT proved.
const PROFILE='earned/workout-extension/v1';
const SLOT_DOMAIN='earned/added-set/v1';
const own=(x,k)=>Object.hasOwn(x,k),map=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const exact=(x,keys)=>map(x)&&Object.keys(x).length===keys.length&&keys.every(k=>own(x,k));
const text=x=>typeof x==='string'&&x.trim().length>0;
const SLOT=['extension_slot','lift_lineage_id','label','load','reps','effort','setup','reason','confidence'];
function need(ok,code){if(!ok){const e=new Error(code);e.code=code;throw e;}}
function freeze(x){if(x&&typeof x==='object'){for(const v of Object.values(x))freeze(v);Object.freeze(x);}return x;}
function createAddedSlotModel({parseStrictJson,prescriptionCapture}={}){
 need(typeof parseStrictJson==='function'&&typeof prescriptionCapture?.prepare==='function','TRUSTED_CAPTURE_DEPENDENCIES_REQUIRED');
 const parse=raw=>{need(typeof raw==='string','ORIGINAL_BYTES_REQUIRED');return parseStrictJson(raw);};
 function prepareCapture(captureBytes,expected){
  const input=parse(captureBytes);
  need(exact(input,['profile','producer','basis','session','slots'])&&input.profile===PROFILE&&Array.isArray(input.slots)&&input.slots.length>0,'EXTENSION_CAPTURE_INVALID');
  const slots=input.slots.map((slot,i)=>{
   need(exact(slot,SLOT)&&slot.extension_slot===i+1,'EXTENSION_SLOT_INDEX_INVALID');
   const {extension_slot,...rest}=slot;
   // Internal validation adapter only. This placeholder is NEVER stored as a
   // durable logical slot or exposed as an operation identity.
   return {logical_set_slot:JSON.stringify(['extension-local-index',extension_slot]),...rest};
  });
  prescriptionCapture.prepare({profile:prescriptionCapture.profile,producer:input.producer,basis:input.basis,session:input.session,slots},expected);
  return freeze(input); // Strict parser created an owned copy; raw spelling stays separate.
 }
 function readDefinition(operationBytes,{athleteId,sessionStartId,producer,basis}={}){
  const op=parse(operationBytes);
  need(map(op)&&op.schema_version===2&&op.class==='session'&&op.kind==='session-extension'&&text(op.op_id)&&
   op.athlete_id===athleteId&&text(athleteId)&&op.session_start_op_id===sessionStartId&&text(sessionStartId)&&
   exact(op.payload,['extension_capture']),'EXTENSION_OPERATION_INVALID');
  const capture=prepareCapture(JSON.stringify(op.payload.extension_capture),{producer,basis});
  return freeze({model:'PROPOSED_ADDED_SLOT_DEFINITION',operationBytes,op_id:op.op_id,session_start_op_id:sessionStartId,
   capture,slots:capture.slots.map(slot=>({logical_set_slot:JSON.stringify([SLOT_DOMAIN,op.op_id,slot.extension_slot]),
    slot_definition_op_id:op.op_id,extension_slot:slot.extension_slot,lift_lineage_id:slot.lift_lineage_id,instruction:slot})),
   authenticated:false,activated:false,progressionEligible:false});
 }
 function reference(ref,definition){
  need(exact(ref,['logical_set_slot','slot_definition_op_id'])&&ref.slot_definition_op_id===definition.op_id,'EXTENSION_REFERENCE_INVALID');
  const found=definition.slots.find(s=>s.logical_set_slot===ref.logical_set_slot);need(found,'EXTENSION_SLOT_MISSING');return found;
 }
 function resolveAddedReference(referenceBytes,definition,{sessionStartId,liftLineageId}={}){
  const ref=parse(referenceBytes),slot=reference(ref,definition);
  need(definition.session_start_op_id===sessionStartId&&slot.lift_lineage_id===liftLineageId,'EXTENSION_SCOPE_INVALID');
  return structuredClone(slot);
 }
 // Proposed lift-skip input is a CLOSED explicit coverage list of known original
 // or added slots; later extension definitions cannot enlarge that old action.
 function resolveSkipCoverage(coverageBytes,{sessionStartId,liftLineageId,originalCapture,definitions=[]}={}){
  const coverage=parse(coverageBytes);need(Array.isArray(coverage)&&coverage.length>0,'SKIP_COVERAGE_REQUIRED');
  const seen=new Set();return coverage.map(ref=>{
   need(map(ref)&&text(ref.logical_set_slot)&&!seen.has(ref.logical_set_slot),'SKIP_COVERAGE_INVALID');seen.add(ref.logical_set_slot);
   if(own(ref,'slot_definition_op_id')){
    const found=definitions.filter(d=>d.op_id===ref.slot_definition_op_id);need(found.length===1,'SKIP_DEFINITION_REQUIRED');
    return resolveAddedReference(JSON.stringify(ref),found[0],{sessionStartId,liftLineageId});
   }
   need(exact(ref,['logical_set_slot']),'SKIP_COVERAGE_INVALID');
   const slot=originalCapture.slots.find(s=>s.logical_set_slot===ref.logical_set_slot);
   need(slot&&slot.lift_lineage_id===liftLineageId,'SKIP_ORIGINAL_SLOT_REQUIRED');
   return {logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,instruction:structuredClone(slot)};
  });
 }
 return Object.freeze({prepareCapture,readDefinition,resolveAddedReference,resolveSkipCoverage});
}
module.exports={PROFILE,SLOT_DOMAIN,createAddedSlotModel};
