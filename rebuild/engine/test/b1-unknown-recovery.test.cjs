'use strict';
// Public synthetic successor cells for B1 v1.3, U1–U10. No athlete fixture.
process.env.TZ = 'America/New_York';
const assert = require('node:assert/strict');
const test = require('node:test');
const { createEngine, syntheticState, clockAt } = require('./b1b2-public-engine.cjs');
test('U10 public harness closure, exact assembly and denied reads',()=>{
  const H=require('./b1b2-public-engine.cjs'),fs=require('node:fs'),read=fs.readFileSync,seen=[];
  fs.readFileSync=function(p,...a){seen.push(String(p));return read.call(this,p,...a);};
  try {
    for(const p of ['seed.cjs','../seed.cjs','../../conform/private/live.json','../../../../ledger/state.json','../../../../src/history.js','unknown.cjs']) assert.throws(()=>H.publicSource(p),/PUBLIC_ENGINE_DENIED_BEFORE_READ/);
    assert.equal(seen.length,0,'denied probes must refuse before any read');
    assert.equal(Object.keys(H.inspectClosure()).length,15);
    assert.throws(()=>H.createEngine(),/clock.today/);
    const C=H.createEngine({clock:H.clockAt('2026-09-03'),ids:{fresh:()=> 'synthetic-id'},drafts:{length:0,key:()=>null}});
    assert.equal(C.isoOf(C.todayStart()),'2026-09-03');assert.deepEqual(C.SEED,H.syntheticState());
    assert.ok(!seen.some(p=>/[/\\](seed\.cjs|history\.js|ledger|private)[/\\]?/.test(p)));
  } finally {fs.readFileSync=read;}
});
const engine = (day = '2026-09-03') => createEngine({ clock: clockAt(day), ids: { fresh: () => 'synthetic-id' } }).__test;
const shift = (day, n) => { const [y,m,d] = day.split('-').map(Number); const v = new Date(y,m-1,d+n); return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`; };
const state = (nights = []) => { const s = syntheticState(); s.exercises = []; s.sleep.nights = nights; return s; };
const unknown = (T,s,expectedDate,lastDate) => {
  const before = structuredClone(s), r = T.recoveryIndex(s);
  assert.equal(r.score,null); assert.equal(r.band,'UNKNOWN'); assert.deepEqual(r.flags,[]);
  assert.deepEqual(r.sleepEvidence,{state:'UNKNOWN',expectedDate,lastDate});
  assert.deepEqual(s,before); return r;
};
test('U1 absent current observation preserves the complete synthetic state', () => unknown(engine(),state(),'2026-09-02',null));
for (const day of ['2026-09-03','2025-11-02','2026-11-01','2027-11-07']) {
  for (const age of [-3,-2,1]) for (const h of [2,8]) test(`U2 ${day} age ${age} hours ${h}`, () => {
    const d = shift(day,age); unknown(engine(day),state([{d,h}]),shift(day,-1),age > 0 ? null : d);
  });
  for (const age of [-1,0]) for (const h of [2,8]) test(`U2 current anchor ${day} ${age} ${h}`, () => {
    const r=engine(day).recoveryIndex(state([{d:shift(day,age),h}]));
    assert.equal(r.band,h===2?'WATCH':'GREEN'); assert.equal(r.score,h===2?70:100); assert.ok(!('sleepEvidence' in r));
  });
}
const invalid = { absent:undefined, null:null, string:'8', nan:NaN, positiveInfinity:Infinity, negativeInfinity:-Infinity };
for (const [name,h] of Object.entries(invalid)) test(`U3 invalid current hours ${name}`, () => {
  const s=state([{d:'2026-09-02',h}]),T=engine(); unknown(T,s,'2026-09-02','2026-09-02');
  assert.equal(T.cleanAtDate(s,'2026-09-03'),true); assert.equal(T.sleepMean3At(s,'2026-09-03'),true);
});
for (const h of [0,6.4,6.5,8]) test(`U3 finite threshold ${h}`, () => {
  const s=state([{d:'2026-09-02',h}]),T=engine(); assert.equal(T.cleanAtDate(s,'2026-09-03'),h>=6.5);
  assert.equal(T.recoveryIndex(s).score,h<6.5?70:100);
});
for (const shortDay of ['2026-09-02','2026-09-03']) for (const [name,h] of [['absent',undefined],...Object.entries(invalid),['good',8],['short',2]]) test(`U4 anchors ${shortDay} other ${name}`, () => {
  const other = shortDay==='2026-09-02'?'2026-09-03':'2026-09-02';
  const nights=[{d:shortDay,h:2},...(name==='absent'?[]:[{d:other,h}])].sort((a,b)=>a.d.localeCompare(b.d));
  const T=engine(),s=state(nights); assert.equal(T.sleepInfo(s).clean,false); assert.equal(T.recoveryIndex(s).band,'WATCH');
  assert.equal(T.recoveryIndex(s).flags[0].k,'sleep');
});
test('U5 consecutive measured mean3 remains restrictive', () => {
  const T=engine(),s=state(['2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:6.6})));
  assert.equal(T.cleanAtDate(s,'2026-09-03'),false); assert.equal(T.sleepMean3At(s,'2026-09-03'),false);
});
for (const slot of [1,2]) for (const [name,h] of Object.entries(invalid)) test(`U5 invalid slot ${slot} ${name} breaks mean`, () => {
  const T=engine(),s=state(['2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:6.6}))); s.sleep.nights[slot].h=h;
  assert.equal(T.cleanAtDate(s,'2026-09-03'),true); assert.equal(T.sleepMean3At(s,'2026-09-03'),true);
});
for(const dates of [['2026-08-30','2026-09-01','2026-09-02'],['2026-08-30','2026-08-31','2026-09-01']]) test(`U5 gap/stale ${dates.join(',')}`,()=>{
  const T=engine(),s=state(dates.map(d=>({d,h:6.6}))); assert.equal(T.cleanAtDate(s,'2026-09-03'),true);assert.equal(T.sleepMean3At(s,'2026-09-03'),true);
  s.sleep.nights.push({d:'2026-09-02',h:2});assert.equal(T.cleanAtDate(s,'2026-09-03'),false);
});
test('U6 stale finite last-five chronic evidence survives UNKNOWN',()=>{
  const s=state(['2026-08-25','2026-08-26','2026-08-27','2026-08-28','2026-08-29'].map(d=>({d,h:6.6}))),r=engine().recoveryIndex(s);
  assert.equal(r.band,'UNKNOWN');assert.equal(r.score,null);assert.deepEqual(r.flags.map(f=>[f.k,f.cost]),[['avg5',10]]);
});
for(const [name,h] of Object.entries(invalid)) test(`U6 invalid last-five ${name} cannot be replaced by older row`,()=>{
  const s=state(['2026-08-24','2026-08-25','2026-08-26','2026-08-27','2026-08-28','2026-08-29'].map(d=>({d,h:6.6}))); s.sleep.nights[3].h=h;
  assert.deepEqual(engine().recoveryIndex(s).flags,[]);
});
for(const [name,held,ng,dips,expected] of [['minor',1,0,0,'UNKNOWN'],['watch',2,1,0,'WATCH'],['low',2,3,2,'LOW']]) test(`U7 ${name} independent recorded flags survive`,()=>{
  const s=state();s.exercises=Array.from({length:held},(_,i)=>({id:`held${i}`,n:`Held ${i}`,holdFlag:true}));s.sessionLog={'2026-09-02':{entries:[],niggles:Array(ng).fill('joint'),dips}};
  const T=engine(),r=T.recoveryIndex(s),valid=structuredClone(s);valid.sleep.nights=[{d:'2026-09-02',h:8}];const c=T.recoveryIndex(valid);
  assert.equal(r.band,expected);assert.equal(r.score,null);assert.deepEqual(r.flags,c.flags);assert.deepEqual(r.lever,c.lever);assert.deepEqual(r.factors,c.factors);assert.equal(r.excludedDips,c.excludedDips);
  assert.equal(c.score,100-r.flags.reduce((n,f)=>n+f.cost,0));
});

module.exports = { engine,state,shift };
