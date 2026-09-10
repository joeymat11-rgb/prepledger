'use strict';
// Candidate over actual performed reader. Never modify retained factory/engine.
const assert=require('node:assert/strict');
module.exports=function construct(factory,assembly){
 const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Unique typed-reader edit: '+a);return s.replace(a,b);};
 factory=once(factory,"const PROFILE='earned/performed-lift/v1';",`const PROFILE='earned/performed-lift/v1',TYPED='earned/performed-lift/v2';
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
 }`);
 factory=once(factory,"if(entry.profile!==PROFILE||", "if(![PROFILE,TYPED].includes(entry.profile)||");
 factory=once(factory,"ids.add(slot.logical_set_slot);",`ids.add(slot.logical_set_slot);
   if(entry.profile===TYPED&&!prescribed(slot.prescribed_load))invalid();`);
 factory=once(factory,"!v||v.load?.unit!=='lb'||!Number.isFinite(v.load.value)||v.load.value<=0||", "!v||(entry.profile===TYPED?!recorded(v):v.load?.unit!=='lb'||!Number.isFinite(v.load.value)||v.load.value<=0)||");
 factory=once(factory,"effort(v.reserve);",`effort(v.reserve);
    if(entry.profile===TYPED){if(!recorded(f.original))invalid();effort(f.original.reserve);}`);
 factory=once(factory,"function performedValues(entry){const rich=performedEntry(entry);if(!rich)return null;",`function performedNumericEntry(entry){
  const rich=performedEntry(entry);if(!rich)return null;
  const configured=rich.slots.filter(slot=>slot.state==='performed'&&slot.fact.current.load.kind==='configuration');
  if(configured.length){const error=new Error('PERFORMED_NUMERIC_LOAD_UNAVAILABLE');error.code=error.message;
   error.reason='configuration_has_no_numeric_magnitude';error.source_op_ids=configured.map(slot=>slot.fact.source_op_id);throw error;}
  return rich;
 }
 function performedTypedSlots(entry){const rich=performedEntry(entry);return rich?structuredClone(rich.slots):null;}
 function performedLoadText(value){if(!enteredLoad(value))invalid();return value.kind==='configuration'?value.configuration_key:value.value+' lb';}
 function performedValues(entry){const rich=performedNumericEntry(entry);if(!rich)return null;`);
 factory=once(factory,"return {performedEntry,performedRirSets", "return {performedEntry,performedNumericEntry,performedTypedSlots,performedLoadText,performedRirSets");
 // Only sessionScore's reached numeric loop changes. Effort/history APIs keep
 // accepting validated v2; unknown magnitude is not a missing workout.
 assembly=once(assembly,'function sessionScore(entry) {\n  const rich = E.performedEntry(entry);','function sessionScore(entry) {\n  const rich = E.performedNumericEntry(entry);');
 return {factory,progression:assembly};
};
