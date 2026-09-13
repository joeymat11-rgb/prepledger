'use strict';
// PM construction-only public harness. This is not the production seed or census.
// The list is current index.cjs order with exactly seed.cjs replaced by the
// explicit synthetic factory. No historical/installed fixture or fallback exists.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const MODULES = Object.freeze(['dates.cjs','constants.cjs','seed.cjs','entered-load.cjs','performed.cjs','plan.cjs','progression.cjs','sleep.cjs','energy.cjs','policy.cjs','today.cjs','volume.cjs','migrate.cjs','earn.cjs','merge.cjs','writers.cjs']);
const PUBLIC_MODULES = Object.freeze(MODULES.filter(p=>p!=='seed.cjs'));
const ROOT = path.resolve(__dirname,'..');
const clockAt = (day) => ({today:()=>day,hour:()=>12,dow:()=>{const [y,m,d]=day.split('-').map(Number);return new Date(y,m-1,d).getDay();},nowISO:()=>day+'T16:00:00.000Z',nowMs:()=>Date.parse(day+'T16:00:00.000Z'),tz:'America/New_York'});
function syntheticState() {
  return {v:60,trend:180,reads:[],weekly:[],dailyLogs:{},sessionLog:{},sleep:{nights:[],cleanH:7.5,needed:3,debts:[]},
    exercises:['fly','hipthrust'].map((id)=>({id,n:id==='fly'?'Synthetic fly':'Synthetic hip thrust',day:id==='fly'?'U':'L',mg:id==='fly'?'chest':'glutes',setup:'synthetic setup',sets:2,hi:10,w:null,inc:5,last:null,setsAt:'2026-08-12T00:00:00.000Z'})),
    queue:[],feed:[],forecasts:[],adjustments:[],proposals:[],suggestionLog:[],targets:{},
    learned:{tdee:[],anchors:[]},plan:{goals:[],ifthen:[],setAt:{},phaseLog:[]},
    exOrder:{U:['fly'],L:['hipthrust']},planGen:52,retirements:{},insertions:{},waist:[],photos:[],events:[],trials:[],agentProposals:[],
    blackout:{until:'2026-07-27'},model:{lean:150,drip:0,src:'synthetic',anchorISO:'2026-08-01'},dayCtx:{},pulse:[],energy:[]};
}
function publicSource(file) {
  assert.ok(PUBLIC_MODULES.includes(file),'PUBLIC_ENGINE_DENIED_BEFORE_READ: '+file);
  return fs.readFileSync(path.join(ROOT,file),'utf8');
}
function inspectClosure() {
  const index = fs.readFileSync(path.join(ROOT,'index.cjs'),'utf8');
  assert.deepEqual([...index.matchAll(/require\("\.\/([^"\n]+)"\)/g)].map(m=>m[1]),MODULES,'public index module order drifted');
  assert.ok(index.includes('const E = {};'));
  assert.ok(index.includes('const deps = { clock, ids, drafts: drafts === undefined ? Object.freeze({ length: 0, key: () => null }) : drafts };'));
  assert.ok(index.includes('for (const createModule of modules) Object.assign(E, createModule(E, deps));'));
  assert.ok(index.includes('return { ...E, __test: { ...E } };'));
  const manifest = {};
  for(const file of PUBLIC_MODULES) {
    const source=publicSource(file), calls=[...source.matchAll(/\brequire\s*\(([^)]*)\)/g)].map(m=>m[1]);
    assert.deepEqual(calls,file==='performed.cjs'?["'./entered-load.cjs'"]:[],'unresolved dependency in '+file);
    // Product modules have no filesystem/network execution API. The performed
    // dependency above is the sole require edge, resolved by the closed loader.
    manifest[file]=crypto.createHash('sha256').update(source).digest('hex');
  }
  return Object.freeze(manifest);
}
function createEngine({clock,ids,drafts}={}) {
  if(!clock || typeof clock.today!=='function') throw new TypeError('createEngine requires an injected clock.today()');
  inspectClosure();
  const cache=new Map();
  function load(file) {
    assert.ok(PUBLIC_MODULES.includes(file),'PUBLIC_ENGINE_DENIED_BEFORE_READ: '+file);
    if(cache.has(file))return cache.get(file).exports;
    const m=new Module(path.join(ROOT,file));cache.set(file,m);m.filename=path.join(ROOT,file);
    m.require=(request)=>{assert.equal(request,'./entered-load.cjs','PUBLIC_ENGINE_DENIED_BEFORE_READ: '+request);return load('entered-load.cjs');};
    m._compile(publicSource(file),m.filename);return m.exports;
  }
  const modules=MODULES.map(file=>file==='seed.cjs'?()=>({SEED:syntheticState(),HISTORY:[]}):load(file));
  const E = {};
  const deps = { clock, ids, drafts: drafts === undefined ? Object.freeze({ length: 0, key: () => null }) : drafts };
  for (const createModule of modules) Object.assign(E, createModule(E, deps));
  return { ...E, __test: { ...E } };
}
module.exports={createEngine,syntheticState,clockAt,inspectClosure,publicSource,MODULES,PUBLIC_MODULES};
