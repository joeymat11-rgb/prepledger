'use strict';
// PM246 finite ERA30 construction. Literal-reference execution requires its later grant.
// Only named code declarations from the fixed source blob; no app, seed or history load.
const LITERALS = {
  "blob": "f98671d823f0d8cd83e730cdd930afe5f5e7b628",
  "extracts": [
    {
      "name": "tCrit",
      "start": 3159,
      "end": 3160,
      "bytes": 210,
      "sha256": "25e06764f7ad38ac202a126c120b824b584f5e33083468c9838100eaa1269a99",
      "text": "const T_CRIT_95 = { 1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228 };\nfunction _tCrit(df) { return T_CRIT_95[df] || (df > 10 ? 1.96 + 2.7 / df : 12.706); }\n"
    },
    {
      "name": "TREND_MIN_SESSIONS",
      "start": 3169,
      "end": 3169,
      "bytes": 111,
      "sha256": "92cdc727f39dfe4f4702789b83298c91653f89be736e552e42cab69965f792d4",
      "text": "const TREND_MIN_SESSIONS = 4;        /* sessions for ONE lift before liftTrend will estimate a slope (df=2) */\n"
    },
    {
      "name": "TREND_SE_FLOOR",
      "start": 3171,
      "end": 3171,
      "bytes": 257,
      "sha256": "2a2efb9b8e5397bc930b12de7e1482cb7c74556d0b6668cab7d9d480dd99fdbe",
      "text": "const TREND_SE_FLOOR = 0.001;        /* ONE owner for the standard-error floor. It exists because .toFixed(3) rounds anything smaller to exactly 0, and severity DIVIDES by se. Applied in liftTrend and again to the pooled se, which is rounded separately. */\n"
    },
    {
      "name": "PACE",
      "start": 1736,
      "end": 1736,
      "bytes": 53,
      "sha256": "9fed1066dc06e5cef7c1cd19477bb7910c01cbdb3bd11f8f821b4ff3837111c5",
      "text": "const PACE = { rushed: \"rushed\", normal: \"normal\" };\n"
    },
    {
      "name": "paceRushed",
      "start": 1738,
      "end": 1738,
      "bytes": 68,
      "sha256": "36c3ee7b3b9904683c422fbb185045a227c2a9129ffe32f5d8173c37110b99a7",
      "text": "function paceRushed(sl) { return !!sl && sl.pace === PACE.rushed; }\n"
    },
    {
      "name": "date",
      "start": 305,
      "end": 308,
      "bytes": 364,
      "sha256": "e23a2bb7da46fd905df6d9af02e748834b608d4d0fb510274d70875924987fdd",
      "text": "const DAY = 86400000;\nconst mk = (s) => { const [y, m, d] = s.split(\"-\").map(Number); return new Date(y, m - 1, d); };\nconst isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, \"0\")}-${String(dt.getDate()).padStart(2, \"0\")}`;\nconst todayStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };\n"
    },
    {
      "name": "dayType",
      "start": 656,
      "end": 667,
      "bytes": 470,
      "sha256": "cd1cc5912ad375493770043cc6aee63e7f8e88c4424e7551f8f8c1a5f2193f88",
      "text": "function dayType(iso, s) {\n  const d = mk(iso).getDay();\n  const list = (s && s.split) || [];\n  let ent = null;\n  for (const x of list) if (x && x.from && x.from <= iso) ent = x;\n  if (ent && ent.map) { const v = ent.map[d]; return v === \"U\" || v === \"L\" ? v : \"REST\"; }\n  if (d === 3) {\n    const off = s && s.targets && s.targets.refeedOff;\n    return off && iso >= off ? \"REST\" : \"REFEED\";\n  }\n  return d === 1 || d === 4 ? \"U\" : d === 2 || d === 5 ? \"L\" : \"REST\";\n}\n"
    },
    {
      "name": "dayWeather",
      "start": 12419,
      "end": 12437,
      "bytes": 2056,
      "sha256": "9d658da81a0eabdfc78ef646431a64bc217fb616368d195f3f71517d16d9b22b",
      "text": "function dayWeather(s, iso) {\n  const flags = [];\n  const manual = (s.dayCtx || {})[iso];\n  if (manual && manual.est) flags.push({ k: \"estimate\", why: manual.note || \"declared estimate day\" });\n  if (manual && manual.travel) flags.push({ k: \"travel\", why: \"travel day — interpretation context only, never a trigger\" });\n  if (manual && manual.illness) flags.push({ k: \"illness\", why: \"illness noted — interpretation context only, never a trigger\" });\n  (s.events || []).forEach((e) => { const gap = (mk(iso) - mk(e.d)) / DAY; if (gap >= -1 && gap <= 2) flags.push({ k: \"event\", why: e.t || \"event window\", pre: gap < 0 }); });\n  if (s.blackout && iso <= s.blackout.until && (mk(s.blackout.until) - mk(iso)) / DAY <= 9) flags.push({ k: \"sealwater\", why: \"scale carries event water — sealed window\" });\n  { const mm2 = (s.medsLog || []).find((x) => x.d === iso); if (mm2 && !mm2.taken) flags.push({ k: \"nomeds\", why: \"no meds this day — appetite, energy, and effort read differently\" }); }\n  if (dayType(isoOf(new Date(mk(iso).getTime() - DAY)), s) === \"REFEED\") flags.push({ k: \"postrefeed\", why: \"morning after refeed — storage bump expected\" });\n  /* R17 — TWO QUESTIONS, TWO ANSWERS. `hard` answers \"are this day's FOOD and SCALE\n     numbers trustworthy\" — a declared estimate day and an event day both fail it, and\n     every food/scale consumer keeps reading it unchanged. `hardSession` answers a\n     different question: \"was the TRAINING itself compromised\". A guessed dinner does\n     not make 11 reps at 320 less true — the reps were counted at a known load — so the\n     estimate flag has no business excluding a session. An EVENT day stays excluded:\n     a wedding plausibly does degrade the session, and Joe's ruling left that alone. */\n  return { flags, noisy: flags.some((f) => f.k === \"estimate\" || f.k === \"event\" || f.k === \"sealwater\"), hard: flags.some((f) => f.k === \"estimate\" || (f.k === \"event\" && !f.pre)), hardSession: flags.some((f) => f.k === \"event\" && !f.pre), est: flags.some((f) => f.k === \"estimate\") };\n}\n"
    },
    {
      "name": "setOneRead",
      "start": 8883,
      "end": 8911,
      "bytes": 1608,
      "sha256": "d332ddc7864e61abb177bbd6c47629119282f30bb6fc8843a90013e996bf54e2",
      "text": "function setOneRead(s, exId) {\n  const ex9 = (s.exercises || []).find((x) => x && x.id === exId);\n  if (!ex9 || typeof ex9.w !== \"number\") return { status: \"IDLE\", exId };\n  const pts = [];\n  for (const d of Object.keys(s.sessionLog || {}).sort()) {\n    const sl = s.sessionLog[d];\n    const en = (sl.entries || []).find((x) => x && x.id === exId);\n    if (!en || !en.reps || !en.reps.length || String(en.w) !== String(ex9.w)) continue;\n    let evt = false; try { evt = !!dayWeather(s, d).hardSession; } catch (e) { evt = false; }\n    if (evt || paceRushed(sl)) continue;\n    pts.push({ d, y: Number(en.reps[0]) || 0 });\n  }\n  const n = pts.length;\n  if (n < TREND_MIN_SESSIONS) return { status: \"COUNTING\", exId, n, need: TREND_MIN_SESSIONS };\n  const ys = pts.map((p) => p.y);\n  const my = ys.reduce((a, b) => a + b, 0) / n;\n  if (!(my > 0)) return { status: \"COUNTING\", exId, n: 0, need: TREND_MIN_SESSIONS };\n  const mx = (n - 1) / 2;\n  let sxx = 0, sxy = 0;\n  for (let i = 0; i < n; i++) { sxx += (i - mx) * (i - mx); sxy += (i - mx) * (ys[i] - my); }\n  if (!(sxx > 0)) return { status: \"COUNTING\", exId, n: 0, need: TREND_MIN_SESSIONS };\n  const b = sxy / sxx;\n  let sse = 0;\n  for (let i = 0; i < n; i++) { const yh = my + b * (i - mx); sse += (ys[i] - yh) * (ys[i] - yh); }\n  const sePct = Math.max((Math.sqrt(Math.max(sse / (n - 2), 0) / sxx) / my) * 100, TREND_SE_FLOOR);\n  const pct = (b / my) * 100;\n  const t9 = _tCrit(n - 2);\n  return { status: \"LIVE\", exId, n, pct: +pct.toFixed(3), lo: +(pct - t9 * sePct).toFixed(3), hi: +(pct + t9 * sePct).toFixed(3), from: pts[0].d, to: pts[n - 1].d };\n}\n"
    },
    {
      "name": "forksOf",
      "start": 1798,
      "end": 1805,
      "bytes": 308,
      "sha256": "929f9494e6c60a61a5b3bb207bc5ead5b7eeccefa56b8a24d40dc073f4b45ed9",
      "text": "function forksOf(s, exId) {\n  try {\n    const e9 = ((s && s.exercises) || []).find((x) => x && x.id === exId);\n    if (!e9) return [];\n    if (Array.isArray(e9.forks)) return e9.forks;\n    return e9.fork && e9.fork.from ? [e9.fork] : [];   /* pre-V50 shape, read-compatible */\n  } catch (e) { return []; }\n}\n"
    },
    {
      "name": "eraIdx",
      "start": 1806,
      "end": 1810,
      "bytes": 119,
      "sha256": "19aacc3762dc777151abf8b8cc171a53f1aa015923af048385dd6585fe8848d6",
      "text": "function eraIdx(forks, d) {\n  let i = 0;\n  for (const f of (forks || [])) { if (f && f.from <= d) i++; }\n  return i;\n}\n"
    },
    {
      "name": "sameEra",
      "start": 1811,
      "end": 1814,
      "bytes": 128,
      "sha256": "c8b99edaec01a701427388fe5a9a2f7459a0e24bdefd2a9b6654a84f71a23126",
      "text": "function sameEra(forks, d, at) {\n  if (!forks || !forks.length) return true;\n  return eraIdx(forks, d) === eraIdx(forks, at);\n}\n"
    }
  ]
};

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const cp = require('node:child_process');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const ROOT = path.resolve(__dirname, '../../..');
const HELPER = path.join(__dirname, 'b1b2-public-engine.cjs');
const DAYS = Object.freeze(['2026-09-03', '2026-09-07']);
const MODES = Object.freeze(['frozen', 'native']);
const FAMILIES = Object.freeze(['ORIGINAL','NONE','EMPTY','LEGACY','BOUNDARY','MULTIPLE','FUTURE','COUNT','FIT','FILTERS','READ-CUT','SET-COUNT','CLOCK','LAB']);
const REF_NAMES = Object.freeze(['tCrit','TREND_MIN_SESSIONS','TREND_SE_FLOOR','PACE','paceRushed','date','dayType','dayWeather','setOneRead','forksOf','eraIdx','sameEra']);
assert.deepEqual(LITERALS.extracts.map(row => row.name), REF_NAMES);
for (const row of LITERALS.extracts) {
  assert.equal(Buffer.byteLength(row.text), row.bytes, 'literal declaration length ' + row.name);
  assert.equal(sha(row.text), row.sha256, 'literal declaration pin ' + row.name);
}
const literal = name => LITERALS.extracts.find(row => row.name === name).text;
function replaceOnce(source, before, after, label) {
  assert.equal(source.split(before).length, 2, 'one exact source site ' + label);
  return source.replace(before, after);
}
// Source-only projection is formed before loading a candidate or inspecting a
// candidate result. Function bodies and numerical constants otherwise stay literal.
const ORIGINAL_SOURCE = literal('setOneRead');
const PROJECTED_SOURCE = replaceOnce(replaceOnce(ORIGINAL_SOURCE,
  '  const pts = [];',
  '  const fk9 = forksOf(s, exId);\n  const at9 = fk9.length ? isoOf(todayStart()) : null;\n  const pts = [];', 'query binding'),
  '    const sl = s.sessionLog[d];',
  '    if (!sameEra(fk9, d, at9)) continue;\n    const sl = s.sessionLog[d];', 'era cut');
const PROJECTION_SHA256 = sha(PROJECTED_SOURCE);

// An isolated Date constructor changes only empty construction and now().
// The injected query day is deliberately independent of this ambient anchor.
const NativeDate = Date;
function ambientDate(mode) {
  if (mode === 'native') return NativeDate;
  assert.equal(mode, 'frozen');
  const fixed = new NativeDate(2026, 6, 29, 12, 0, 0, 0).getTime();
  return class FrozenDate extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [fixed])); }
    static now() { return fixed; }
  };
}
function evaluate(source, bindings, mode, suffix) {
  const context = vm.createContext({ ...bindings, Date: ambientDate(mode) });
  return new vm.Script(source, { filename: 'ERA30-' + suffix }).runInContext(context, { timeout: 3000 });
}
function factory(file, E, clock, mode) {
  assert.ok(['dates.cjs', 'volume.cjs', 'sleep.cjs'].includes(file), 'closed ERA factory');
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  assert.doesNotMatch(source, /\brequire\s*\(|\bimport\s*\(|\beval\s*\(|new Function|process\.|readFile|fetch\s*\(/, 'closed factory source ' + file);
  const module = { exports: {} };
  evaluate(source, { module, exports: module.exports }, mode, file);
  return module.exports(E, { clock, ids: { next() { throw Error('ERA30_IDS_FORBIDDEN'); }, fresh() { throw Error('ERA30_IDS_FORBIDDEN'); } } });
}
function shift(day, count) {
  const [y,m,d] = day.split('-').map(Number), date = new NativeDate(y,m-1,d);
  date.setDate(date.getDate() + count);
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
}
// Descriptor graph never invokes a getter. It preserves property order, holes,
// alias identities, undefined/nonfinite primitives and accessor identity names.
function graph(value) {
  const ids = new Map(), nodes = [];
  function encode(v) {
    if (v === undefined) return { primitive: 'undefined' };
    if (typeof v === 'number' && (!Number.isFinite(v) || Object.is(v,-0))) return { number: String(v), negativeZero: Object.is(v,-0) };
    if (v === null || typeof v !== 'object') return v;
    if (ids.has(v)) return { ref: ids.get(v) };
    const id = nodes.length; ids.set(v,id); const node = { id, type: Array.isArray(v) ? 'array' : 'object', properties: [] }; nodes.push(node);
    for (const key of Reflect.ownKeys(v)) {
      assert.equal(typeof key,'string','invented inputs have no symbol fields');
      const d = Object.getOwnPropertyDescriptor(v,key), entry = { key, enumerable:d.enumerable, configurable:d.configurable };
      if ('value' in d) { entry.writable=d.writable;entry.value=encode(d.value); }
      else { entry.get=d.get ? d.get.name : null;entry.set=d.set ? d.set.name : null; }
      node.properties.push(entry);
    }
    return { ref:id };
  }
  return { root:encode(value), nodes };
}
function observed(fn, state) {
  const before=graph(state);
  let value, error=null;
  try { value=fn(); } catch(e) { error={ name:e.name, message:e.message }; }
  assert.deepEqual(graph(state),before,'input descriptors and aliases unchanged');
  return error ? { error } : { value:graph(value) };
}
function invented(day) {
  return {
    v:60, trend:180, reads:[], weekly:[], dailyLogs:{}, sessionLog:{},
    sleep:{nights:[],cleanH:8,needed:3,debts:[]},
    exercises:[{id:'era',n:'Invented first-set lift',day:'U',mg:'chest',setup:'invented setup',sets:2,hi:12,w:40,inc:5,last:null,setsAt:shift(day,-30)}],
    queue:[],feed:[],forecasts:[],adjustments:[],proposals:[],suggestionLog:[],targets:{},
    learned:{tdee:[],anchors:[]},plan:{goals:[],ifthen:[],setAt:{},phaseLog:[]},
    exOrder:{U:['era'],L:[]},planGen:52,retirements:{},insertions:{},waist:[],photos:[],events:[],trials:[],agentProposals:[],
    blackout:{until:'2000-01-01'},model:{lean:140,drip:0,src:'invented',anchorISO:shift(day,-30)},dayCtx:{},pulse:[],energy:[],split:[],medsLog:[],soreness:[],weight:[]
  };
}
function rows(s, day, offsets, reps, extra={}) {
  offsets.forEach((offset,i) => {
    const first=Array.isArray(reps) ? reps[i] : reps;
    s.sessionLog[shift(day,offset)]={pace:'normal',entries:[{id:'era',w:40,reps:[first,6],...extra}]};
  });
  return s;
}
function fork(s,day,offset=-4) { s.exercises[0].forks=[{from:shift(day,offset),kind:'technique'}];return s; }
function manualFit(day, offsets, values) {
  assert.equal(values.length,4,'manually checked four-point fit');
  const cases = {
    '10,10,10,10':{pct:0,lo:-0.004,hi:0.004},
    '8,10,12,14':{pct:18.182,lo:18.178,hi:18.186},
    '14,12,10,8':{pct:-18.182,lo:-18.186,hi:-18.178},
  };
  const fit=cases[values.join(',')];assert.ok(fit,'closed independent fit values');
  return {status:'LIVE',exId:'era',n:4,...fit,from:shift(day,offsets[0]),to:shift(day,offsets[3])};
}
const counting = n => ({status:'COUNTING',exId:'era',n,need:4});

function specimens(day) {
  const cases=[];
  const add=(family,id,s,expected,options={})=>cases.push({family,id:family+'/'+id,s,expected,exId:'era',...options});
  const old=s=>rows(s,day,[-12,-10,-8],[99,88,77]);
  const four=s=>rows(s,day,[-3,-2,-1,0],[8,10,12,14]);
  {
    const s=invented(day);s.exercises=[{id:'synthetic-press',n:'Invented press',day:'U',mg:'chest',sets:3,hi:12,w:100,forks:[{from:'2026-09-01',kind:'technique',prevN:'Other technique'}]}];
    for(const [i,d] of ['2026-08-10','2026-08-17','2026-08-24','2026-09-03'].entries())s.sessionLog[d]={entries:[{id:'synthetic-press',w:100,reps:[10+i,10+i],rirSets:[0,0]}]};
    add('ORIGINAL','raw-D30',s,{status:'COUNTING',exId:'synthetic-press',n:1,need:4},{exId:'synthetic-press',originalLive:true});
  }
  add('NONE','four',four(invented(day)),manualFit(day,[-3,-2,-1,0],[8,10,12,14]),{noQuery:true});
  {const s=four(invented(day));s.exercises[0].forks=[];s.exercises[0].fork={from:day};add('EMPTY','array-over-legacy',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]),{noQuery:true});}
  {const s=old(four(invented(day)));s.exercises[0].fork={from:shift(day,-3)};add('LEGACY','single',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]));}
  for(const offset of [-4,-3,-2]) {const s=rows(fork(invented(day),day,-3),day,[offset],[10]);add('BOUNDARY',String(offset),s,counting(offset < -3 ? 0 : 1));}
  for(const offsets of [[-6,-2],[-2,-6],[-2,-6,-2],[-6,-6,-2]]) {
    const s=rows(invented(day),day,[-7,-6,-5,-3,-2,-1],[10,11,12,13,14,15]);s.exercises[0].forks=offsets.map(d=>({from:shift(day,d),kind:'technique'}));
    s.exercises.push({id:'other',w:40,forks:[{from:day}]});add('MULTIPLE',offsets.join(','),s,counting(2));
  }
  {const s=rows(invented(day),day,[-2,-1,1,2,3,4],[8,10,12,14,16,18]);s.exercises[0].forks=[{from:shift(day,-3)},{from:shift(day,3)}];add('FUTURE','inside-query-era',s,manualFit(day,[-2,-1,1,2],[8,10,12,14]));add('CLOCK','advance',s,counting(2),{query:shift(day,3),firstExpected:manualFit(day,[-2,-1,1,2],[8,10,12,14])});}
  for(const n of [0,1,3,4]){const s=old(fork(invented(day),day));rows(s,day,[-3,-2,-1,0].slice(0,n),[8,10,12,14].slice(0,n));add('COUNT',String(n),s,n===4?manualFit(day,[-3,-2,-1,0],[8,10,12,14]):counting(n));}
  for(const ys of [[10,10,10,10],[8,10,12,14],[14,12,10,8]])for(const oldPoints of [false,true]){
    const s=rows(fork(invented(day),day),day,[-3,-2,-1,0],ys);if(oldPoints)old(s);add('FIT',ys.join(',')+'/'+oldPoints,s,manualFit(day,[-3,-2,-1,0],ys));
  }
  for(const [id,edit,n] of [
    ['wrong-load',e=>e.w=41,3],['string-load',e=>e.w='40',4],['empty-reps',e=>e.reps=[],3],['missing-reps',e=>delete e.reps,3],
    ['numeric-strings',e=>e.reps=['8','6'],4],['first-zero',e=>e.reps=[0,6],4],['first-negative',e=>e.reps=[-2,6],4],['null-entry',(_e,sl)=>sl.entries.unshift(null),4]
  ]){const s=four(fork(invented(day),day));edit(s.sessionLog[shift(day,-3)].entries[0],s.sessionLog[shift(day,-3)]);add('FILTERS',id,s,n<4?counting(n):null,{expectedN:n});}
  {const s=rows(fork(invented(day),day),day,[-3,-2,-1,0],[0,-1,0,-2]);add('FILTERS','nonpositive-mean',s,counting(0));}
  {const s=four(fork(invented(day),day));s.events=[{d:shift(day,-2),t:'Invented event'}];add('FILTERS','hard-session',s,counting(1));}
  {const s=four(fork(invented(day),day));s.sessionLog[shift(day,-1)].pace='rushed';add('FILTERS','rushed',s,counting(3));}
  for(const w of ['40',null,undefined]){const s=four(fork(invented(day),day));s.exercises[0].w=w;add('FILTERS','idle-'+String(w),s,{status:'IDLE',exId:'era'},{idle:true,noQuery:true});}
  {const s=invented(day);s.exercises=[];add('FILTERS','idle-absent',s,{status:'IDLE',exId:'era'},{idle:true,noQuery:true});}
  {const s=rows(fork(invented(day),day),day,[-3,-2,-1,0],[8,10,12,14],{w:NaN});s.exercises[0].w=NaN;add('FILTERS','numeric-NaN-not-idle',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]));}
  {const s=four(fork(invented(day),day));s.exercises[0].forks=[null,{from:null},{from:shift(day,-4)}];add('FILTERS','invalid-fork-items',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]));}
  for(const [id,offset] of [['old',-8],['current',-1]]){
    const s=four(fork(invented(day),day));Object.defineProperty(s.sessionLog,shift(day,offset),{enumerable:true,configurable:true,get:function sessionAccessor(){throw new Error('ERA30_SESSION_ACCESSOR');}});
    add('READ-CUT',id,s,id==='old'?manualFit(day,[-3,-2,-1,0],[8,10,12,14]):null,{expectedError:id==='current'?'ERA30_SESSION_ACCESSOR':null,originalError:'ERA30_SESSION_ACCESSOR'});
  }
  {const s=four(fork(invented(day),day));s.dayCtx={};Object.defineProperty(s,'dayCtx',{enumerable:true,configurable:true,get:function weatherAccessor(){throw Error('ERA30_WEATHER_ACCESSOR');}});add('READ-CUT','weather-catch',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]));}
  {const s=four(fork(invented(day),day));const shared=s.sessionLog[shift(day,-3)].entries[0].reps;s.sessionLog[shift(day,-3)].alias=shared;add('READ-CUT','aliases',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]));}
  {const s=four(invented(day));s.sessionLog[shift(day,-3)].entries[0].reps=[8];s.sessionLog[shift(day,-2)].entries[0].reps=[10,8,7];s.exercises[0].sets=3;s.exercises[0].setsAt=shift(day,-1);add('SET-COUNT','survives',s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]),{noQuery:true});}
  for(const kind of ['technique','sets','other']) {const s=old(four(fork(invented(day),day)));s.exercises[0].forks[0].kind=kind;add('SET-COUNT','fork-kind-'+kind,s,manualFit(day,[-3,-2,-1,0],[8,10,12,14]));}
  add('CLOCK','counting',rows(fork(invented(day),day),day,[-1],[10]),counting(1));
  add('CLOCK','live',four(fork(invented(day),day)),manualFit(day,[-3,-2,-1,0],[8,10,12,14]));
  add('CLOCK','ambient-trap',four(fork(invented(day),day)),manualFit(day,[-3,-2,-1,0],[8,10,12,14]),{trap:true});
  for(const live of [false,true]) {const s=old(fork(invented(day),day));rows(s,day,live?[-3,-2,-1,0]:[-1],live?[8,10,12,14]:[10]);add('LAB',live?'live':'armed',s,live?manualFit(day,[-3,-2,-1,0],[8,10,12,14]):counting(1),{lab:true});}
  assert.deepEqual([...new Set(cases.map(c=>c.family))].sort(),FAMILIES.slice().sort());
  return cases;
}

const PUBLIC_FILES=Object.freeze(['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>n+'.cjs'));
const MODULE_ORDER=Object.freeze(['dates.cjs','constants.cjs','seed.cjs',...PUBLIC_FILES.slice(2)]);
function engine(mode,day) {
  const trace=[],cache=new Map(),E={},clockEvents=[];let query=day;
  const clock={today(){clockEvents.push('today');return query;},hour:()=>12,dow:()=>new NativeDate(query+'T12:00:00').getDay(),nowISO:()=>query+'T16:00:00.000Z',nowMs:()=>NativeDate.parse(query+'T16:00:00.000Z'),tz:'America/New_York'};
  const context=vm.createContext({Date:ambientDate(mode)});
  function load(file) {
    assert.ok(PUBLIC_FILES.includes(file),'closed public factory BEFORE read');if(cache.has(file))return cache.get(file).exports;
    const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
    const calls=[...source.matchAll(/\brequire\s*\(([^)]*)\)/g)].map(m=>m[1]);assert.deepEqual(calls,file==='performed.cjs'?["'./entered-load.cjs'"]:[]);
    assert.doesNotMatch(source,/\bimport\s*\(|\beval\s*\(|new Function|process\.|readFile|fetch\s*\(/);
    const m={exports:{}};cache.set(file,m);context.module=m;context.exports=m.exports;context.require=request=>{assert.equal(file,'performed.cjs');assert.equal(request,'./entered-load.cjs');return load('entered-load.cjs');};
    new vm.Script('(function(module,exports,require){\n'+source+'\n})',{filename:'ERA30-public/'+file}).runInContext(context,{timeout:3000})(m,m.exports,context.require);return m.exports;
  }
  const deps={clock,ids:{next(){throw Error('ERA30_IDS_FORBIDDEN');},fresh(){throw Error('ERA30_IDS_FORBIDDEN');}},drafts:Object.freeze({length:0,key:()=>null})};
  for(const file of MODULE_ORDER)Object.assign(E,file==='seed.cjs'?{SEED:invented(day),HISTORY:[],ROLLUPS:[],exById:(s,id)=>s.exercises.find(e=>e.id===id)}:load(file)(E,deps));
  return {E,clock,trace,clockEvents,context,query(value){query=value;},load};
}
function reference(which,rig,mode,trace) {
  const names=['DAY','mk','isoOf','todayStart','T_CRIT_95','_tCrit','TREND_MIN_SESSIONS','TREND_SE_FLOOR','PACE','paceRushed','dayType','dayWeather','forksOf','eraIdx','sameEra'];
  const source=['date','tCrit','TREND_MIN_SESSIONS','TREND_SE_FLOOR','PACE','paceRushed','dayType','dayWeather','forksOf','eraIdx','sameEra'].map(literal).join('\n');
  const raw=evaluate(source+'\n({'+names.join(',')+'});',{},mode,'literal-dependencies');
  const deps={...raw};
  for(const name of ['forksOf','sameEra','dayWeather','paceRushed','isoOf','todayStart']) {
    const fn=name==='todayStart'&&which==='projected'?rig.E.todayStart:raw[name];
    deps[name]=traced(name,fn,trace);
  }
  return evaluate((which==='original'?ORIGINAL_SOURCE:PROJECTED_SOURCE)+'\nsetOneRead;',deps,mode,which);
}
function traced(name,fn,trace) {
  return (...args)=>{
    const input=(name==='forksOf'||name==='dayWeather')?{state:'input',value:args[1]}:name==='paceRushed'?{session:graph(args[0])}:graph(args);
    const entry={name,args:input};trace.push(entry);
    try{const result=fn(...args);entry.result=graph(result);return result;}catch(e){entry.error={name:e.name,message:e.message};throw e;}
  };
}
function identities(value) {
  const seen=new Set(),snapshot=[];
  function walk(v){if(v===null||typeof v!=='object'||seen.has(v))return;seen.add(v);const keys=Reflect.ownKeys(v);snapshot.push({v,keys,descriptors:keys.map(k=>Object.getOwnPropertyDescriptor(v,k))});for(const k of keys){const d=Object.getOwnPropertyDescriptor(v,k);if('value'in d)walk(d.value);}}
  walk(value);return()=>{for(const item of snapshot){assert.deepEqual(Reflect.ownKeys(item.v),item.keys);item.keys.forEach((k,i)=>assert.deepEqual(Object.getOwnPropertyDescriptor(item.v,k),item.descriptors[i],'exact input descriptor identity'));}};
}
function runCase(which,c,mode,day) {
  const rig=engine(mode,day),trace=[],restoreIdentity=identities(c.s),input=graph(c.s);
  if(c.trap){const Parent=ambientDate(mode);rig.context.Date=class TrapDate extends Parent{constructor(...args){if(!args.length)throw Error('ERA30_AMBIENT_DATE');super(...args);}static now(){throw Error('ERA30_AMBIENT_DATE');}};}
  let read;
  if(which==='candidate') {
    const deps={...rig.E};
    for(const name of ['forksOf','sameEra','dayWeather','paceRushed','isoOf','todayStart'])deps[name]=traced(name,rig.E[name],trace);
    read=rig.load('volume.cjs')(deps,{clock:rig.clock,ids:{next(){throw Error('ERA30_IDS_FORBIDDEN');}}}).setOneRead;
  } else read=reference(which,rig,mode,trace);
  const invoke=()=>read(c.s,c.exId);
  const start=observed(invoke,c.s);
  let frame=start,first=null;
  if(c.query){first={frame:start,trace:structuredClone(trace),clock:rig.clockEvents.slice()};rig.query(c.query);trace.length=0;rig.clockEvents.length=0;frame=observed(invoke,c.s);}
  const directTrace=structuredClone(trace),directClock=rig.clockEvents.slice();let lab=null;
  if(c.lab){rig.E.setOneRead=read;trace.length=0;rig.clockEvents.length=0;lab=observed(()=>rig.E.labAnalytics2(c.s),c.s);}
  restoreIdentity();assert.deepEqual(graph(c.s),input);
  return {input,frame,first,trace:directTrace,clock:directClock,lab};
}
function subgraph(g,root) {
  const mapped=new Map(),nodes=[];
  const walk=x=>{
    if(x===null||typeof x!=='object')return x;
    if(Object.keys(x).length===1&&Object.hasOwn(x,'ref')){
      if(mapped.has(x.ref))return{ref:mapped.get(x.ref)};
      const id=nodes.length;mapped.set(x.ref,id);const node={id,type:g.nodes[x.ref].type,properties:[]};nodes.push(node);
      node.properties=g.nodes[x.ref].properties.map(p=>walk(p));return{ref:id};
    }
    if(Array.isArray(x))return x.map(walk);
    return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,walk(v)]));
  };
  return{root:walk({ref:root}),nodes};
}
function assertIndependent(c,got) {
  if(c.expected)assert.deepEqual(got.frame,{value:graph(c.expected)},c.id+' independent result');
  if(c.firstExpected){assert.deepEqual(got.first.frame,{value:graph(c.firstExpected)},c.id+' independent first query');assert.equal(got.first.trace.filter(x=>x.name==='todayStart').length,1);assert.equal(got.first.clock.length,1);}
  if(c.expectedError)assert.deepEqual(got.frame,{error:{name:'Error',message:c.expectedError}},c.id+' exact exception');
  const nQueries=got.trace.filter(x=>x.name==='todayStart').length;
  assert.equal(nQueries,c.noQuery?0:1,c.id+' conditional query calls');
  assert.equal(got.clock.length,nQueries,c.id+' injected clock only');
  if(c.idle)assert.deepEqual(got.trace,[],c.id+' IDLE no helpers');
  if(c.expectedN!=null){const nodes=got.frame.value.nodes,root=nodes[0];assert.equal(root.properties.find(p=>p.key==='n').value,c.expectedN,c.id+' independent count');}
}
function buildReference() {
  const results=[];
  for(const mode of MODES)for(const day of DAYS)for(const c of specimens(day)){
    const original=runCase('original',c,mode,day),projected=runCase('projected',c,mode,day);
    assertIndependent(c,projected);
    if(c.originalLive)assert.equal(original.frame.value.nodes[0].properties.find(p=>p.key==='status').value,'LIVE');
    if(c.originalError)assert.deepEqual(original.frame,{error:{name:'Error',message:c.originalError}});
    if(c.noQuery&&!c.idle){assert.deepEqual(projected.frame,original.frame);assert.deepEqual(projected.trace.filter(t=>!['forksOf','sameEra'].includes(t.name)),original.trace);}
    assert.equal(original.clock.length,0,'original direct read adds no query');
    if(c.lab){
      assert.ok(projected.lab.value,'actual LAB returns aggregate');
      const a=original.lab.value,b=projected.lab.value;assert.equal(a.nodes[0].properties.length,b.nodes[0].properties.length,'complete aggregate shape');
      // Complete aggregate is retained below, including every card and string.
      const ids=g=>g.nodes[0].properties.filter(p=>/^\d+$/.test(p.key)).map(p=>g.nodes[p.value.ref].properties.find(q=>q.key==='id').value);
      assert.deepEqual(ids(a),ids(b),'all card identities/order');assert.ok(ids(b).includes('set1'),'real set-one card present');
      for(const id of ids(b).filter(id=>id!=='set1')){
        const card=(g,id)=>subgraph(g,g.nodes.find(n=>n.properties.some(p=>p.key==='id'&&p.value===id)).id);assert.deepEqual(card(a,id),card(b,id),'other card unchanged '+id);
      }
      const card=b.nodes.find(n=>n.properties.some(p=>p.key==='id'&&p.value==='set1'));
      const prop=k=>card.properties.find(p=>p.key===k).value;
      assert.equal(prop('status'),c.expected.status==='LIVE'?'LIVE':'ARMED');
      assert.equal(prop('forYou'),c.expected.status==='LIVE'?'Invented first-set lift: +18.182%/session on set 1 over 4 comparable reads (CI 18.178 to 18.186)':'Counting only — no lift carries 4 comparable set-1 reads at its current load yet. No verdict until it does.');
    }
    results.push({mode,day,id:c.id,family:c.family,original,projected});
  }
  return {sourceBlob:LITERALS.blob,projection:PROJECTION_SHA256,families:FAMILIES,results};
}

// Filled exclusively from phase1 literal-reference evaluation before any phase2
// candidate observation. Complete typed frames stay in this one committed file.
const EXPECTED = null;
const command=process.argv.slice(2);
if(command.length===1&&command[0]==='--construct-reference') {
  assert.equal(EXPECTED,null,'reference construction is closed after expectations are pinned');
  const data=buildReference(),dir=path.join(ROOT,'.tmp');fs.mkdirSync(dir,{recursive:true});
  const bytes=JSON.stringify(data,null,2)+'\n';fs.writeFileSync(path.join(dir,'era30-reference-construction.json'),bytes);
  console.log('ERA30 REFERENCE CONSTRUCTION: '+data.results.length+' frames; SHA256 '+sha(bytes));
} else if(command.length===0) {
  assert.ok(EXPECTED,'ERA30 expectations must be committed before candidate observation');
  for(const mode of MODES)for(const day of DAYS)for(const family of FAMILIES)test('ERA30/'+family+'/'+mode+'/'+day,()=>{
    const cases=specimens(day).filter(c=>c.family===family);
    for(const c of cases){const expected=EXPECTED.results.find(r=>r.mode===mode&&r.day===day&&r.id===c.id);assert.ok(expected,'closed expected case '+c.id);const actual=runCase('candidate',c,mode,day);assertIndependent(c,actual);assert.deepEqual(actual,expected.projected,c.id+' complete candidate frame');}
  });
} else throw Error('ERA30 command is not constructed: '+command.join(' '));
