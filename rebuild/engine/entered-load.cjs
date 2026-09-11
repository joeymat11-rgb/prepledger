'use strict';
// NONSHIPPING candidate shared predicate. No load conversion or capture inference.
module.exports=function enteredLoad(value){
 try{
  if(value===null||typeof value!=='object'||Array.isArray(value))return false;
  const descriptors=Object.getOwnPropertyDescriptors(value),keys=Reflect.ownKeys(descriptors);
  if(keys.some(k=>typeof k!=='string'||!Object.hasOwn(descriptors[k],'value')||descriptors[k].enumerable!==true))return false;
  const exact=names=>keys.length===names.length&&names.every(k=>Object.hasOwn(descriptors,k));
  if(exact(['value','unit']))return descriptors.unit.value==='lb'&&Number.isFinite(descriptors.value.value)&&descriptors.value.value>0;
  return exact(['kind','configuration_key'])&&descriptors.kind.value==='configuration'&&
   typeof descriptors.configuration_key.value==='string'&&descriptors.configuration_key.value.trim().length>0;
 }catch{return false;}
};
