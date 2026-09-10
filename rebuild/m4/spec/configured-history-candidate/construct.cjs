'use strict';
// Exact prospective delta over the actual retained projector, never installation.
const assert=require('node:assert/strict');
module.exports=function construct(original){
 const once=(before,after)=>{assert.equal(original.split(before).length,2,'Unique projector edit: '+before);original=original.replace(before,after);};
 once("if(!layout||layout.profile!=='earned/captured-lift-layout/v1'||", "const typedLoad=layout?.profile==='earned/captured-lift-layout/v2';\n   if(!layout||!['earned/captured-lift-layout/v1','earned/captured-lift-layout/v2'].includes(layout.profile)||");
 once("const positions=new Map(),slots=new Map(),entries=new Map();",`if(typedLoad&&(layout.correspondence_profile!=='earned/engine-workout-capture/v2'||capture.producer.rule_profile!==layout.correspondence_profile))fail('WORKOUT_CAPTURE_LAYOUT_UNPROVEN');
   const positions=new Map(),slots=new Map(),entries=new Map();`);
 once("const slot={position:mapped.position,logical_set_slot:planned.logical_set_slot,prescribed_effort:target,state:'unlogged'};",`const slot={position:mapped.position,logical_set_slot:planned.logical_set_slot,prescribed_effort:target,state:'unlogged'};
    if(typedLoad){
     // The trusted resolver executes the original producer's readLayout. Check
     // its mapped target against the same original cell, never a performed fact.
     const cell=planned.load,exact=(value,keys)=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
     let prescribed;
     if(cell?.state==='not_prescribed'&&cell.source_json===null&&cell.display==='Find a working load')prescribed={state:'not_prescribed'};
     else if(cell?.state==='specified'){
      const source=parseStrictJson(cell.source_json);
      const numeric=exact(source,['value','unit'])&&typeof source.value==='number'&&Number.isFinite(source.value)&&source.value>=0&&!Object.is(source.value,-0)&&source.unit==='lb'&&cell.display===source.value+' lb';
      const configuration=exact(source,['kind','configuration_key'])&&source.kind==='configuration'&&typeof source.configuration_key==='string'&&source.configuration_key.trim().length>0&&cell.display===source.configuration_key;
      if(!numeric&&!configuration)fail('WORKOUT_LOAD_TARGET_MAPPING_REQUIRED');
      prescribed={state:'specified',source};
     }else fail('WORKOUT_LOAD_TARGET_MAPPING_REQUIRED');
     if(!same(prescribed,mapped.prescribed_load))fail('WORKOUT_CAPTURE_LOAD_DISAGREEMENT');
     slot.prescribed_load=structuredClone(prescribed);
    }`);
 once("profile:'earned/performed-lift/v1',start_op_id:id", "profile:typedLoad?'earned/performed-lift/v2':'earned/performed-lift/v1',start_op_id:id");
 once("for(const fact of session.projection.facts){",`for(const fact of session.projection.facts){
    if(!typedLoad&&(fact.original?.load?.kind==='configuration'||fact.current?.load?.kind==='configuration'))fail('WORKOUT_CONFIGURED_LOAD_LAYOUT_REQUIRED');`);
 return original;
};
