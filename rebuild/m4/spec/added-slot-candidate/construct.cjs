'use strict';
// Actual capture-module addition only. No operation registration or host grant.
const assert=require('node:assert/strict');
module.exports=function construct(source){
 const anchor='module.exports={createPrescriptionCapture,PROFILE,SOURCE_PROFILE};';
 assert.equal(source.split(anchor).length,2,'Unique actual capture export boundary');
 return source.replace(anchor,`const EXTENSION_PROFILE='earned/workout-extension/v1';
function createExtensionCapture({parseStrictJson}={}){
 const shared=createPrescriptionCapture({parseStrictJson});
 const extensionFields=['extension_slot',...SLOT.slice(1)];
 const invalid=()=>{const error=new TypeError('WORKOUT_EXTENSION_CAPTURE_INVALID');error.code=error.message;throw error;};
 function prepare(input,expected){
  try{
   const copied=copyData(input),value=copied.value;
   if(!keys(value,['profile','producer','basis','session','slots'])||value.profile!==EXTENSION_PROFILE||!Array.isArray(value.slots)||!value.slots.length)invalid();
   const slots=value.slots.map((slot,i)=>{
    if(!keys(slot,extensionFields)||!Number.isSafeInteger(slot.extension_slot)||slot.extension_slot!==i+1)invalid();
    const {extension_slot,...fields}=slot;
    // This index placeholder exists only in the validation call. It is never
    // emitted as durable identity or used to prove operation correspondence.
    return {logical_set_slot:JSON.stringify(['extension-local-index',extension_slot]),...fields};
   });
   shared.prepare({profile:PROFILE,producer:value.producer,basis:value.basis,session:value.session,slots},expected);
   // Common v1 validation does NOT prove the source frontier. The actual host
   // must bind this extension to its current source/snapshot and original Start.
   return copied.freeze();
  }catch{invalid();}
 }
 function read(input){
  try{const value=copyData(input).value;return prepare(value,{producer:value.producer,basis:value.basis});}
  catch{invalid();}
 }
 return Object.freeze({profile:EXTENSION_PROFILE,prepare,read});
}
module.exports={createPrescriptionCapture,createExtensionCapture,PROFILE,SOURCE_PROFILE,EXTENSION_PROFILE};`);
};
