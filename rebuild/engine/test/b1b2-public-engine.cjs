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
  assert.doesNotMatch(index,/\bimport\s*\(|\beval\s*\(|new Function/,'unresolved index execution edge');
  for(const file of PUBLIC_MODULES) {
    const source=publicSource(file), calls=[...source.matchAll(/\brequire\s*\(([^)]*)\)/g)].map(m=>m[1]);
    assert.deepEqual(calls,file==='performed.cjs'?["'./entered-load.cjs'"]:[],'unresolved dependency in '+file);
    // Product modules have no filesystem/network execution API. The performed
    // dependency above is the sole require edge, resolved by the closed loader.
    assert.doesNotMatch(source,/\bimport\s*\(|\beval\s*\(|new Function|process\.|readFile|fetch\s*\(/,'unresolved public execution edge in '+file);
    manifest[file]=crypto.createHash('sha256').update(source).digest('hex');
  }
  return Object.freeze(manifest);
}
function createEngine({clock,ids,drafts,nativeTrendContext}={}) {
  if(!clock || typeof clock.today!=='function') throw new TypeError('createEngine requires an injected clock.today()');
  if(nativeTrendContext!==undefined && typeof nativeTrendContext!=='function') throw new TypeError('nativeTrendContext must be an owned resolver function');
  inspectClosure();
  const cache=new Map();
  function load(file) {
    assert.ok(PUBLIC_MODULES.includes(file),'PUBLIC_ENGINE_DENIED_BEFORE_READ: '+file);
    if(cache.has(file))return cache.get(file).exports;
    const m=new Module(path.join(ROOT,file));cache.set(file,m);m.filename=path.join(ROOT,file);
    m.require=(request)=>{assert.equal(request,'./entered-load.cjs','PUBLIC_ENGINE_DENIED_BEFORE_READ: '+request);return load('entered-load.cjs');};
    m._compile(publicSource(file),m.filename);return m.exports;
  }
  // PM supplied this exact code-only declaration from M's seed factory. Its
  // name-only interface inventory is HISTORY, EXERCISES, SEED, weekRollups,
  // ROLLUPS, exById. No other executable seed export is simulated here.
  const exById = (s, id) => s.exercises.find((e) => e.id === id);
  const modules=MODULES.map(file=>file==='seed.cjs'?()=>({SEED:syntheticState(),HISTORY:[],ROLLUPS:[],exById}):load(file));
  const E = {};
  // PM246: test-only forwarding into the actual performed factory. The caller
  // supplies the real native-trend-context binding; no flags are synthesized.
  const deps = { clock, ids, drafts: drafts === undefined ? Object.freeze({ length: 0, key: () => null }) : drafts, nativeTrendContext };
  for (const createModule of modules) Object.assign(E, createModule(E, deps));
  return { ...E, __test: { ...E } };
}
module.exports={createEngine,syntheticState,clockAt,inspectClosure,publicSource,MODULES,PUBLIC_MODULES};

// Immutable original M-to-R construction manifest; candidate fields name R.
// Successor metadata follows separately; neither manifest is a mutant-kill guard.
const CONSTRUCTION_SOURCE_MANIFEST = {
  "base": "100820aa47a4f8729642033499eaec0f0ee282e1",
  "syntheticFixtureSHA256": "25f241d23765796328ea6ff6aea7621799582045cf9ee316068fcef499189046",
  "indexSHA256": "40ccc489a44dfdb4581e157a06f8bcf70fe77e25f33051ffca90b5910cd6b893",
  "modules": {
    "dates.cjs": {
      "base": "19e9ce7e0a4b2dc770a41b2a8a722f57ad767c36b2edfe967cf866b88be3dff6",
      "candidate": "b51f3f1e0e94c6d7c1ae08d9049db6338e51c70e451674e3a87d94bf190fe067"
    },
    "constants.cjs": {
      "base": "106113baf0bca78d2f113b965b0902ee33acd35a96e453eed25cd79cc3bc5380",
      "candidate": "106113baf0bca78d2f113b965b0902ee33acd35a96e453eed25cd79cc3bc5380"
    },
    "entered-load.cjs": {
      "base": "2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3",
      "candidate": "2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3"
    },
    "performed.cjs": {
      "base": "2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a",
      "candidate": "2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a"
    },
    "plan.cjs": {
      "base": "1b26c87f6fa037259a4ce480585e07714f5b38d4995a56bc94965f49386af2a3",
      "candidate": "4c6f981706694771501d3d050440eb4f9a62e64b6eac7c59ff9c4742dfaa7e93"
    },
    "progression.cjs": {
      "base": "7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5",
      "candidate": "9adaeecb715e42533fcd51483e67f52a9d8d530a0de80865e28ae572152599a8"
    },
    "sleep.cjs": {
      "base": "3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0",
      "candidate": "b55cb352aed6be0032391e7b695223928154cd89c43023838c69baaa33a22e2d"
    },
    "energy.cjs": {
      "base": "4dd7195e51d207bd4b8f4e09db066fd6b4fcb954a85efa4e097d4f06a587fffc",
      "candidate": "4dd7195e51d207bd4b8f4e09db066fd6b4fcb954a85efa4e097d4f06a587fffc"
    },
    "policy.cjs": {
      "base": "a1d21404ec52de9f7726071d60e05c0911590a417d11bf8f9076241762a3768d",
      "candidate": "a92706d3187e621102f90e83c91e14b8b7fbda7006a9793c3c9413ceff98a870"
    },
    "today.cjs": {
      "base": "397532ecf20a4f5a9e1bd4a7d8d312cf5fd52058427603a7726ba512107bdbb3",
      "candidate": "36ce41f37c6d50d79588540470f6f87d050e9ef944b9ce76eb44ad380b952135"
    },
    "volume.cjs": {
      "base": "c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4",
      "candidate": "d58159bc0c098983fa1db6a1f8542d93611537934fca2b2a17bae236bcacd321"
    },
    "migrate.cjs": {
      "base": "60959d58f63ca79e210d6ace763e93507bf5f30e5f744fe068a58eb653414f41",
      "candidate": "60959d58f63ca79e210d6ace763e93507bf5f30e5f744fe068a58eb653414f41"
    },
    "earn.cjs": {
      "base": "4b8838807ee973e6cc31a75a74c5d5b389efc8b640433c09df0dd12dfd0584da",
      "candidate": "4b8838807ee973e6cc31a75a74c5d5b389efc8b640433c09df0dd12dfd0584da"
    },
    "merge.cjs": {
      "base": "b69dd11f6a44b41001741bd88b0e6cffbd8e0140837216775360b33b2d7e3d98",
      "candidate": "b69dd11f6a44b41001741bd88b0e6cffbd8e0140837216775360b33b2d7e3d98"
    },
    "writers.cjs": {
      "base": "0522797dcf832dcdc63fa99e3218ce302f577893b87251bafe3553cd96ad448e",
      "candidate": "694e220db85eac38a1068e7e7ed9404edb786140df165dd621f0eee2f4531959"
    }
  }
};
module.exports.CONSTRUCTION_SOURCE_MANIFEST=Object.freeze(CONSTRUCTION_SOURCE_MANIFEST);

// PM246: exact four repair images; public native context is a read-only dependency.
module.exports.SUCCESSOR_SOURCE_MANIFEST = Object.freeze({
  "sourceBase": "6c9248e695a4478abdbaae0f9f48395ac56000fa",
  "runtime": {
    "rebuild/engine/progression.cjs": {
      "pre": "9adaeecb715e42533fcd51483e67f52a9d8d530a0de80865e28ae572152599a8",
      "post": "2384d12e5788fb01324a62d7bbc7fa7303a3e748f97ecd4a6f9a5c82975dbc7a"
    },
    "rebuild/engine/sleep.cjs": {
      "pre": "b55cb352aed6be0032391e7b695223928154cd89c43023838c69baaa33a22e2d",
      "post": "57475760a52e7e76adddc4c34cf4b4f0f6f33b034cfc248b23abb441c03cfde8"
    },
    "rebuild/engine/today.cjs": {
      "pre": "36ce41f37c6d50d79588540470f6f87d050e9ef944b9ce76eb44ad380b952135",
      "post": "fff395dfb1d5e1890eacabf39a76a9c65e413b4f89a2c14d74d00c1343260392"
    },
    "rebuild/engine/writers.cjs": {
      "pre": "694e220db85eac38a1068e7e7ed9404edb786140df165dd621f0eee2f4531959",
      "post": "7e8ba66e82a24983e98d063fe948838f77ec168b52515cdfe2e6483291027494"
    }
  },
  "nativeTrendContext": {
    "file": "rebuild/m4/workout/native-trend-context.cjs",
    "sha256": "f300f3f2855f98781eadfbabf526d64ed32706f7e52f597b65d0fa6fcb50904a"
  }
});
