'use strict';
// Shared representation boundary. This does not qualify the producer, register a
// schema, authorize Start, or replace the actual repository token/commit fence.
const PROFILE='earned/workout-prescription/v1';
const own=(value,key)=>Object.hasOwn(value,key);
const map=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const keys=(value,names)=>map(value)&&Reflect.ownKeys(value).length===names.length&&names.every(k=>own(value,k));
const text=value=>typeof value==='string'&&value.length>0;
const PRODUCER=['app_build','engine_build','rule_profile','source_schema'];
const BASIS=['plan_basis','input_basis','source_revision'];
const CELL=['state','display','source_json'];
const SESSION=['instruction','reason','confidence'];
const SLOT=['logical_set_slot','lift_lineage_id','label','load','reps','effort','setup','reason','confidence'];
function fail(){const e=new TypeError('WORKOUT_CAPTURE_INVALID');e.code='WORKOUT_CAPTURE_INVALID';throw e;}
function wellFormed(value){
  for(let i=0;i<value.length;i++){const c=value.charCodeAt(i);
    if(c>=0xd800&&c<=0xdbff){const d=value.charCodeAt(++i);if(!(d>=0xdc00&&d<=0xdfff))return false;}
    else if(c>=0xdc00&&c<=0xdfff)return false;
  }return true;
}
// Iterative descriptor-only copying follows the accepted schema.cjs discipline.
// It retains JSON member order and aliases internally but no caller references.
function copyData(input){
  if(!map(input))fail();
  const holder=Object.create(null),copies=new WeakMap(),active=new WeakSet(),objects=[];
  const stack=[{value:input,parent:holder,key:'root'}];
  while(stack.length){const item=stack.pop(),value=item.value;
    if(item.exit){active.delete(value);continue;}
    if(value===null||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)) {item.parent[item.key]=value;continue;}
    if(typeof value==='string'){if(!wellFormed(value))fail();item.parent[item.key]=value;continue;}
    if(typeof value!=='object'||active.has(value))fail();
    if(copies.has(value)){item.parent[item.key]=copies.get(value);continue;}
    const array=Array.isArray(value),proto=Object.getPrototypeOf(value);
    if(array?proto!==Array.prototype:proto!==Object.prototype&&proto!==null)fail();
    const names=Reflect.ownKeys(value),descriptors=Object.getOwnPropertyDescriptors(value);
    if(names.some(k=>typeof k!=='string'||!wellFormed(k)))fail();
    const length=array?descriptors.length?.value:0;
    if(array&&(!Number.isSafeInteger(length)||length<0||names.length!==length+1))fail();
    const fields=array?Array.from({length},(_,i)=>String(i)):names;
    for(const k of fields){const d=descriptors[k];if(!d||!own(d,'value')||d.enumerable!==true)fail();}
    const copy=array?[]:Object.create(null);objects.push(copy);copies.set(value,copy);active.add(value);item.parent[item.key]=copy;
    stack.push({value,exit:true});for(let i=fields.length-1;i>=0;i--)stack.push({value:descriptors[fields[i]].value,parent:copy,key:fields[i]});
  }
  return {value:holder.root,freeze(){for(const o of objects)Object.freeze(o);return holder.root;}};
}
// parseStrictJson is a trusted synchronous installation dependency (W6's existing
// parser, or the qualified server counterpart), never supplied by a UI call.
function createPrescriptionCapture({parseStrictJson}={}){
  if(typeof parseStrictJson!=='function')throw new TypeError('Trusted strict JSON parser required');
  function cell(value){
    if(!keys(value,CELL)||!['specified','unknown','not_prescribed'].includes(value.state)||!text(value.display))fail();
    if(value.state==='specified'){
      if(typeof value.source_json!=='string')fail();
      // Check decoded escaped strings too; keep the original source_json unchanged.
      copyData({source:parseStrictJson(value.source_json)});
    }else if(value.source_json!==null)fail();
  }
  function producer(value){if(!keys(value,PRODUCER)||!PRODUCER.every(k=>text(value[k])))fail();}
  function basis(value){if(!keys(value,BASIS)||!text(value.plan_basis)||!text(value.input_basis)||!Number.isSafeInteger(value.source_revision)||value.source_revision<1||Object.is(value.source_revision,-0))fail();}
  function prepare(input,expected){
    try{
      const copied=copyData(input),capture=copied.value;
      if(!keys(capture,['profile','producer','basis','session','slots'])||capture.profile!==PROFILE)fail();
      producer(capture.producer);basis(capture.basis);
      if(!keys(capture.session,SESSION))fail();for(const k of SESSION)cell(capture.session[k]);
      if(!Array.isArray(capture.slots)||capture.slots.length===0)fail();
      const slots=new Set();for(const slot of capture.slots){
        if(!keys(slot,SLOT)||!['logical_set_slot','lift_lineage_id','label'].every(k=>text(slot[k]))||slots.has(slot.logical_set_slot))fail();
        slots.add(slot.logical_set_slot);for(const k of SLOT.slice(3))cell(slot[k]);
      }
      // Trusted producer/basis equality is necessary, not proof of qualification.
      // The caller integrating this component must bind these to its real snapshot.
      const context=copyData(expected).value;
      if(!keys(context,['producer','basis']))fail();producer(context.producer);basis(context.basis);
      if(!PRODUCER.every(k=>capture.producer[k]===context.producer[k])||!BASIS.every(k=>capture.basis[k]===context.basis[k]))fail();
      return copied.freeze();
    }catch{fail();}
  }
  return Object.freeze({profile:PROFILE,prepare});
}
module.exports={createPrescriptionCapture};
