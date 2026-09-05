'use strict';
// Test-only frozen writer oracle. No candidate implementation supplies expected results.
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const SOURCE_BLOB = 'f98671d823f0d8cd83e730cdd930afe5f5e7b628';
const RANGES = [[305,308],[10040,10057],[10061,10069],[10070,10078]];
let source;
function sourceCode() {
  if (source) return source;
  const bytes = execFileSync('git',['show','fe516c1:src/app.jsx'],{cwd:path.resolve(__dirname,'../../..'),maxBuffer:8*1024*1024,windowsHide:true});
  const hash = crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  if (hash !== SOURCE_BLOB) throw Error('Frozen writer source pin mismatch');
  const lines = bytes.toString('utf8').split('\n');
  return source = RANGES.map(([a,b])=>lines.slice(a-1,b).join('\n')).join('\n');
}
function deterministicRandom() {
  let n=0;
  const random=()=>((++n*104729)%1048576)/1048576;
  random.count=()=>n;
  return random;
}
function deterministicIds(clock,random=deterministicRandom()) {
  let sequence=0;
  return {fresh(prefix){return(prefix||'')+clock.nowMs().toString(36)+(sequence++).toString(36)+random().toString(36).slice(2,6);},count:()=>sequence};
}
function createWriterReference({clock,random=deterministicRandom(),drafts={length:0,key(){return null;}},Date:RealDate=globalThis.Date,enginePath}={}) {
  if (!clock || typeof clock.nowMs !== 'function') throw Error('An explicit clock is required');
  const resolved=path.resolve(enginePath||process.env.ENGINE_MAIN||path.join(__dirname,'../../conform/engines/engine-main.cjs'));
  const before=globalThis.Date;
  let G;
  try { delete require.cache[require.resolve(resolved)]; G=require(resolved).__test; }
  finally { globalThis.Date=before; } // The supplied pinned bundle installs its own FixedDate at load.
  if(typeof G._freshId!=='function')throw Error('Frozen _freshId missing');
  // Three writers are not exported by the frozen bundle. Compile their EXACT
  // source and four original date primitives. Their ID helper is the same frozen
  // instance's _freshId, retaining its counter across every writer family.
  const extra=new Function('_freshId',sourceCode()+'\nreturn {applySuggestion,noteSuggestion,dismissSuggestion};')(G._freshId);
  const table={...G,...extra};
  class ReferenceDate extends RealDate {
    constructor(...args){super(...(args.length?args:[clock.nowMs()]));}
    static now(){return clock.nowMs();}
  }
  for(const [name,value]of Object.entries(table))if(typeof value==='function') {
    table[name]=(...args)=>{
      const date=globalThis.Date,rand=Math.random,storage=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
      globalThis.Date=ReferenceDate;Math.random=random;
      Object.defineProperty(globalThis,'localStorage',{configurable:true,value:drafts});
      try{return value(...args);}
      finally{globalThis.Date=date;Math.random=rand;if(storage)Object.defineProperty(globalThis,'localStorage',storage);else delete globalThis.localStorage;}
    };
  }
  return table;
}
module.exports={createWriterReference,deterministicRandom,deterministicIds,SOURCE_BLOB,RANGES};
