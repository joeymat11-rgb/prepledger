'use strict';
// NATIVE-NEXT-TARGETS — static binding-only prescription runtime.
// Composes the accepted generated engine factories over one private table and
// returns a frozen object exposing exactly genSession and rirPlan. It imports
// no seed, migrate or merge, uses no dynamic compiler, copies no scoring or
// physiology, supplies no athlete history and grants no permission. The writer
// factory is instantiated privately only to obtain the existing rirPlan reader;
// no completion or adaptive writer escapes or executes through this surface.
const MODULES=Object.freeze(['dates','constants','plan','performed','progression','sleep','energy','policy','today','volume','earn','writers']);
const factories=MODULES.map(name=>require('../../engine/'+name+'.cjs'));
const EXPOSED=Object.freeze(['genSession','rirPlan']);
// Source-owned exact lookup (the same read the seeded engine performs); it
// embeds no athlete data. It is a reached dependency of today.pickStructural.
const exById=(s,id)=>s.exercises.find(e=>e.id===id);
// Seed-owned history providers are NOT supplied. After the shared alarm-signal
// extraction the two exposed readers' closed graph reaches neither HISTORY nor
// ROLLUPS; any reach surfaces as this explicit failure, never an empty history.
function absentProvider(name){
 const fail=()=>{const e=new Error('ENGINE_RUNTIME_'+name+'_PROVIDER_REQUIRED');e.code=e.message;throw e;};
 const trap={};for(const k of ['filter','map','forEach','slice','find','some','every','reduce','flatMap','concat','entries','values','keys','at','includes'])trap[k]=fail;
 Object.defineProperty(trap,Symbol.iterator,{value:fail});Object.defineProperty(trap,'length',{get:fail});
 return Object.freeze(trap);
}
function createEngineRuntime({clock,ids,drafts,nativeTrendContext}={}){
 if(!clock||typeof clock.today!=='function')throw new TypeError('createEngineRuntime requires an injected clock.today()');
 if(nativeTrendContext!==undefined&&typeof nativeTrendContext!=='function')throw new TypeError('nativeTrendContext must be a synchronous function when supplied');
 // IDs are never minted by the two readers; a request to mint is a contained failure.
 const mint=()=>{const e=new Error('ENGINE_RUNTIME_IDS_UNAVAILABLE');e.code=e.message;throw e;};
 const deps={clock,ids:ids===undefined?Object.freeze({next:mint,fresh:mint}):ids,drafts:drafts===undefined?Object.freeze({length:0,key:()=>null}):drafts};
 const E={HISTORY:absentProvider('HISTORY'),ROLLUPS:absentProvider('ROLLUPS'),exById};
 for(const [i,create]of factories.entries()){
  const created=MODULES[i]==='performed'?create(E,{nativeTrendContext}):create(E,deps);
  Object.assign(E,created);
 }
 for(const name of EXPOSED)if(typeof E[name]!=='function')throw new TypeError('Accepted engine did not compose '+name);
 return Object.freeze({genSession:(s,iso,slp)=>E.genSession(s,iso,slp),rirPlan:(s,ex,slp)=>E.rirPlan(s,ex,slp)});
}
// Record of what the two exposed readers are composed from. Private
// initialization (every factory, the writer table) is distinct from the
// exposed calls; nothing else is reachable through the returned object.
const COMPOSITION=Object.freeze({profile:'earned/engine-runtime/v1',modules:MODULES,exposed:EXPOSED,
 seeded:Object.freeze({exById:'source-owned exact lookup, no athlete data'}),
 absent:Object.freeze({HISTORY:'not supplied; reach fails ENGINE_RUNTIME_HISTORY_PROVIDER_REQUIRED',ROLLUPS:'not supplied; reach fails ENGINE_RUNTIME_ROLLUPS_PROVIDER_REQUIRED',SEED:'not supplied; factory destructuring only, sole body use is runAdaptive (outside this surface)'}),
 privateInitialization:'writers.cjs is instantiated on the private table to obtain rirPlan; its completion/adaptive writers never escape',
 forbiddenImports:Object.freeze(['seed.cjs','migrate.cjs','merge.cjs'])});
// absentProvider is exported for test guards only; the runtime binds it itself.
module.exports={createEngineRuntime,COMPOSITION,absentProvider};
