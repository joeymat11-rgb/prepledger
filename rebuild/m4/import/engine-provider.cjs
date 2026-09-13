'use strict';
const {sourceEngineContext}=require('./local-source-profile.cjs');
const factories=[require('../../engine/dates.cjs'),require('../../engine/constants.cjs'),require('../../engine/performed.cjs'),require('../../engine/plan.cjs'),require('../../engine/progression.cjs'),require('../../engine/sleep.cjs'),require('../../engine/energy.cjs'),require('../../engine/policy.cjs'),require('../../engine/today.cjs'),require('../../engine/volume.cjs'),require('../../engine/migrate.cjs'),require('../../engine/earn.cjs'),require('../../engine/merge.cjs'),require('../../engine/writers.cjs')];
function createSourceReplayEngine({engineContext,nativeTrendContext}={}){
 const context=sourceEngineContext(engineContext);let fault=null,calendarFault=false;
 // Only a fixed provider-root enum escapes. Never return accessed property
 // names or caller text; the first missing dependency survives inner catches.
 function unavailable(root){return new Proxy(function(){},{get(){return missing(root);},apply(){return missing(root);},ownKeys(){return missing(root);},has(){return missing(root);},getOwnPropertyDescriptor(){return missing(root);}});}
 function missing(root){if(calendarFault)unproven();fault=fault||root;const e=new Error('SOURCE_ENGINE_DEPENDENCY_REQUIRED');e.code=e.message;e.dependency=fault;throw e;}
 function unproven(){if(fault)missing(fault);calendarFault=true;const e=new Error('SOURCE_ENGINE_CONTEXT_UNPROVEN');e.code=e.message;throw e;}
 function reached(day){try{context.clockAt(day,0);}catch{unproven();}}
 const E={SEED:unavailable('SEED'),HISTORY:unavailable('HISTORY'),ROLLUPS:unavailable('ROLLUPS'),exById:(s,id)=>s.exercises.find(e=>e.id===id)};
 const deps={clock:context.clock,ids:unavailable('ids'),drafts:context.mapping.dependencies?.drafts==='default-empty'?Object.freeze({length:0,key:()=>null}):unavailable('drafts'),nativeTrendContext};
 for(const [index,factory]of factories.entries()){
  const created=factory(E,deps);
  if(index===0){
   // Guard the frozen date helpers' actual inputs/results before any later
   // factory captures them. Keep their native Date algorithms and values.
   // No source-field scan or interpretation of unrelated timestamp strings.
   for(const name of ['mk','daysUntil','fmtShort'])E[name]=(...args)=>{reached(args[0]);return created[name](...args);};
   E.weeksBetween=(a,b)=>{reached(a);reached(b);return created.weeksBetween(a,b);};
   E.todayStart=()=>{reached(context.clock.today());return created.todayStart();};
   E.isoOf=(...args)=>{const day=created.isoOf(...args);reached(day);return day;};
   E.DAY=created.DAY;
  }else Object.assign(E,created);
 }
 const facade={SCHEMA_V:E.SCHEMA_V};
 for(const name of ['migrate','mergeState','dataLossGuard','applyRead','writeDaily','currentRate'])facade[name]=(...args)=>{
  if(fault)missing(fault);if(calendarFault)unproven();let value,error;try{value=E[name](...args);}catch(e){error=e;}
  // Sticky outside the engine: patch60 and patch51 both catch internally.
  if(fault)missing(fault);if(calendarFault)unproven();if(error)throw error;return value;
 };
 return Object.freeze(facade);
}
module.exports={createSourceReplayEngine};
