'use strict';
const {sourceEngineContext}=require('./local-source-profile.cjs');
const factories=[require('../../engine/dates.cjs'),require('../../engine/constants.cjs'),require('../../engine/performed.cjs'),require('../../engine/plan.cjs'),require('../../engine/progression.cjs'),require('../../engine/sleep.cjs'),require('../../engine/energy.cjs'),require('../../engine/policy.cjs'),require('../../engine/today.cjs'),require('../../engine/volume.cjs'),require('../../engine/migrate.cjs'),require('../../engine/earn.cjs'),require('../../engine/merge.cjs'),require('../../engine/writers.cjs')];
function createSourceReplayEngine({engineContext,nativeTrendContext}={}){
 const context=sourceEngineContext(engineContext);let fault=null;
 function unavailable(path){return new Proxy(function(){},{get(_target,key){return missing(path+'.'+String(key));},apply(){return missing(path+'()');},ownKeys(){return missing(path+'.keys');},has(){return missing(path+'.has');},getOwnPropertyDescriptor(){return missing(path+'.descriptor');}});}
 function missing(path){fault=fault||path;const e=new Error('SOURCE_ENGINE_DEPENDENCY_REQUIRED');e.code=e.message;throw e;}
 const E={SEED:unavailable('SEED'),HISTORY:unavailable('HISTORY'),ROLLUPS:unavailable('ROLLUPS'),exById:(s,id)=>s.exercises.find(e=>e.id===id)};
 const deps={clock:context.clock,ids:unavailable('ids'),drafts:context.mapping.dependencies?.drafts==='default-empty'?Object.freeze({length:0,key:()=>null}):unavailable('drafts'),nativeTrendContext};
 for(const factory of factories)Object.assign(E,factory(E,deps));
 const facade={SCHEMA_V:E.SCHEMA_V};
 for(const name of ['migrate','mergeState','dataLossGuard','applyRead','writeDaily','currentRate'])facade[name]=(...args)=>{
  if(fault)missing(fault);let value,error;try{value=E[name](...args);}catch(e){error=e;}
  // Sticky outside the engine: patch60 and patch51 both catch internally.
  if(fault)missing(fault);if(error)throw error;return value;
 };
 return Object.freeze(facade);
}
module.exports={createSourceReplayEngine};
