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
    const lookup={exercises:[{id:'invented'}]};assert.equal(C.exById(lookup,'invented'),lookup.exercises[0]);assert.equal(C.exById(lookup,'missing'),undefined);assert.throws(()=>C.exById({},'missing'),TypeError);assert.deepEqual(C.ROLLUPS,[]);
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
  const T=engine(),s=state(nights); assert.equal(T.sleepInfo(s).clean,false); assert.equal(T.recoveryIndex(s).band,shortDay==='2026-09-02'&&name==='good'?'GREEN':'WATCH');
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

const lift=()=>({id:'press',n:'Synthetic press',w:100,inc:5,sets:2,hi:10,setup:'synthetic',day:'U',mg:'chest',last:[8,7]});
function stallState(){const s=state();s.exercises=[lift()];s.exOrder={U:['press'],L:[]};for(const d of ['2026-08-24','2026-08-26','2026-08-28','2026-08-31'])s.sessionLog[d]={entries:[{id:'press',w:100,reps:[8,7],rir:1}]};return s;}
test('U8 liftCall absence alone opens review, pain still diagnoses reset',()=>{
  const T=engine(),s=stallState();assert.equal(T.liftCall(s,'press',{alarm:null}).verdict,'REVIEW');
  s.exercises[0].holdFlag=true;assert.equal(T.liftCall(s,'press',{alarm:null}).verdict,'RESET');
});
test('U9 liftCall old date and absent review do not claim GREEN or last night',()=>{
  const T=engine(),s=stallState();s.sleep.nights=[{d:'2026-08-01',h:8}];
  const r=T.liftCall(s,'press',{alarm:null});assert.doesNotMatch(JSON.stringify(r),/recovery GREEN|green body|Last night|usual last night/);assert.match(JSON.stringify(r),/UNKNOWN|not recorded|2026-08-01/);
});
test('U9 post-refeed PUSH+ remains eligible without positive sleep assertion',()=>{
  const T=engine(),s=stallState();s.sessionLog={'2026-08-28':s.sessionLog['2026-08-28'],'2026-08-31':s.sessionLog['2026-08-31']};
  const r=T.liftCall(s,'press',{alarm:null});assert.equal(r.verdict,'PUSH+');assert.doesNotMatch(JSON.stringify(r),/fed and slept|you are rested|well slept/);
});
test('U8 phaseProposal unknown does not supply the second cluster premise',()=>{
 const T=engine(),s=state();s.energy=['2026-08-29','2026-08-30','2026-08-31','2026-09-01'].map(d=>({d,v:1}));s.plan.phase='cut';
 assert.notEqual(T.phaseProposal(s)?.apply?.kind,'break');
 s.exercises=[{id:'h1',n:'Held1',holdFlag:true},{id:'h2',n:'Held2',holdFlag:true}];s.sessionLog={'2026-09-02':{entries:[],niggles:['joint']}};
 assert.equal(T.recoveryIndex(s).band,'WATCH');assert.equal(T.phaseProposal(s)?.apply?.kind,'break');
 s.energy=[];assert.notEqual(T.phaseProposal(s)?.apply?.kind,'break');
});
module.exports = { engine,state,shift,stallState };
function fallingState(){const s=state();s.exercises=[{...lift(),sets:3}];s.exOrder={U:['press'],L:[]};for(const [i,d]of ['2026-08-20','2026-08-24','2026-08-26','2026-08-28','2026-08-31'].entries())s.sessionLog[d]={entries:[{id:'press',w:100,reps:i?[14-i*2,13-i*2,12-i*2]:[10,9],rir:1,rirSets:i?[1,1,1]:[1,1]}]};return s;}
test('U8 volumeConversion UNKNOWN does not independently trigger subtraction',()=>{
 const T=engine(),s=fallingState(),r=T.volumeConversion(s,'press');assert.equal(r.status,'LIVE');assert.equal(r.trend.n,4);assert.ok(r.trend.hi<0);assert.equal(r.subtract,false);assert.doesNotMatch(r.why,/recovery has left GREEN/);
 s.exercises[0].holdFlag=true;assert.equal(T.volumeConversion(s,'press').subtract,true);
 s.exercises[0].holdFlag=false;s.sleep.nights=[{d:'2026-09-02',h:2}];assert.equal(T.recoveryIndex(s).band,'WATCH');assert.equal(T.volumeConversion(s,'press').subtract,true);
});
for(const [d,h,blocked]of [['2026-08-01',2,false],['2026-09-04',2,false],['2026-09-02',null,false],['2026-09-02','2',false],['2026-09-02',0,true],['2026-09-02',2,true],['2026-09-03',2,true],['2026-09-02',8,false]]) test(`U8 pickStructural ${d} ${String(h)} ${typeof h}`,()=>{
 const T=engine(),s=state([{d,h}]);s.exercises=[{...lift(),id:'hack',day:T.dayType('2026-09-03',s)}];s.queue=[{kind:'unlock',exId:'hack'}];const r=T.pickStructural(s,'2026-09-03',T.sleepInfo(s));assert.equal(r.main===null,blocked);assert.equal(r.deferred.length,blocked?1:0);
 assert.throws(()=>T.pickStructural(s,'2026-09-03'),TypeError,'the historical missing-slp interface remains unchanged');
});
function pushState(){const T=engine(),s=state();s.exercises=['press','row','curl','extension'].map((id,i)=>({...lift(),id,n:'Synthetic '+id,mg:['chest','back','biceps','quads'][i]}));s.exOrder={U:s.exercises.map(e=>e.id),L:[]};for(const d of ['2026-08-24','2026-08-26','2026-08-28','2026-08-31'])s.sessionLog[d]={entries:s.exercises.map(e=>({id:e.id,w:100,reps:[8,7],rir:1,rirSets:[1,1]}))};for(let i=0;i<28;i++){const d=shift('2026-08-06',i);s.reads.push({d,w:180});s.dailyLogs[d]={cal:2400,protein:180,steps:10000};}return s;}
test('U8 volumePush UNKNOWN alone does not veto the real stall offer',()=>{
 const T=engine(),s=pushState();assert.equal(T.progressionTrend(s).state,'flat');assert.equal(T.regime(s).rate.scale,0);const r=T.volumePush(s);assert.equal(r.mode,'PUSH');assert.equal(r.basis,'stall');
 s.sleep.nights=[{d:'2026-09-02',h:2}];assert.equal(T.volumePush(s).veto,'recovery');s.sleep.nights=[{d:'2026-09-02',h:8}];assert.equal(T.volumePush(s).mode,'PUSH');
});
test('U9 runAdaptive real standdown does not say UNKNOWN signals cleared',()=>{
 const T=engine(),s=pushState();s.proposals=[{rid:'recovery_test',resolved:false}];const r=T.runAdaptive(s,'2026-09-03');const f=r.feed.find(f=>f.t==='RECOVERY CARD STOOD DOWN');assert.ok(f);assert.doesNotMatch(f.how,/signals.*cleared/);assert.match(f.how,/UNKNOWN|not recorded/);
});
test('U9 runAdaptive actual volume offer does not claim measured GREEN or mean',()=>{
 const T=engine(),s=pushState();const r=T.runAdaptive(s,'2026-09-03');const offer=r.proposals.find(p=>p.rid.startsWith('volpush_'));assert.ok(offer,'must reach actual offer');assert.doesNotMatch(JSON.stringify(offer),/recovery GREEN|sleep mean clean|sleep mean is clean/);assert.match(JSON.stringify(offer),/UNKNOWN|not recorded/);
});
for(const [name,h]of Object.entries(invalid)) test(`U9 askContext invalid duration ${name} remains unknown`,()=>{const s=pushState();s.sleep.nights=[{d:'2026-09-02',h}];const out=engine().askContext(s);assert.match(out,/UNKNOWN/);assert.doesNotMatch(out,/2026-09-02: (?:undefined|null|NaN|Infinity|-Infinity|8)h/);assert.match(out,/2026-09-02: hours not recorded/);});
test('U10 absence and recorded short sleep preserve training target and progression upside',()=>{const T=engine(),s=pushState(),e=s.exercises[0];const baseline={target:T.targetsFor(e,s),step:T.progressStep(e,s)};assert.ok(baseline.step.add>0);assert.ok(baseline.target);for(const nights of [[],[{d:'2026-09-02',h:0}],[{d:'2026-09-02',h:2}],[{d:'2026-09-02',h:8}]]){const q=structuredClone(s);q.sleep.nights=nights;assert.deepEqual(T.targetsFor(q.exercises[0],q),baseline.target);assert.deepEqual(T.progressStep(q.exercises[0],q),baseline.step);}});

/* Construction evidence, 2026-09-13, Node v24.19.0, TZ America/New_York.
Completed helper (PM-supplied exById, invented HISTORY/ROLLUPS) exact M control:
 node b1-delta-cells.cjs: 1/26; node b2-delta-cells.cjs: BASE 32/32.
 node --test b1-unknown-recovery.test.cjs at 111-cell checkpoint:45 pass/66 fail.
 node --test b1b2-sleep-target-cells.cjs:3 pass/25 fail.
Same helper+fixture, all eight runtime bytes restored in finally. No setup errors.
Subsequent six invalid askContext cells:111 pass/6 behavioral failures before repair.
Candidate: U118/118, FG28/28, B1 26/26, B2 CANDIDATE32/32.
Combined carrier:4/4 files,31 cases,35 exact-once substitutions, original bytes retained.
The initial incomplete helper runs are NOT behavioral-kill evidence.
The following exact source substitutions each produced ERR_ASSERTION, exit1;
15/15 behavioral kills. Source bytes restored after every child invocation.
Command per row: node --test --test-name-pattern=<column6> <column5>.
Columns: id, runtime basename, exact before, exact after, evidence path, test filter.
No SyntaxError/ReferenceError/TypeError/denied-read failure counted.
*/
module.exports.CONSTRUCTION_MUTATIONS = [
  [
    "U-absence-GREEN",
    "sleep",
    "currentSleepObservation(s) ? \"GREEN\" : \"UNKNOWN\"",
    "\"GREEN\"",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U1"
  ],
  [
    "U-absence-score",
    "sleep",
    "score: currentSleepObservation(s) ? score : null",
    "score: score",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U1"
  ],
  [
    "U-stale-current",
    "sleep",
    "(n.d === yesterday || n.d === today)",
    "(n.d <= today)",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U2"
  ],
  [
    "U-future-current",
    "sleep",
    "(n.d === yesterday || n.d === today)",
    "(n.d >= yesterday)",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U2"
  ],
  [
    "U-coerce-null",
    "sleep",
    "typeof night.h === \"number\" && Number.isFinite(night.h)",
    "Number.isFinite(Number(night.h))",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U3"
  ],
  [
    "U-last5-coerce",
    "sleep",
    "last5.every(Number.isFinite)",
    "last5.every(x => Number.isFinite(Number(x)))",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U6"
  ],
  [
    "U-warning-suppression",
    "sleep",
    "band: score < 55 ? \"LOW\"",
    "band: !currentSleepObservation(s) ? \"UNKNOWN\" : score < 55 ? \"LOW\"",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U7"
  ],
  [
    "U-lift-negative-GREEN",
    "sleep",
    "[\"WATCH\", \"LOW\"].includes(recoveryIndex(s).band)",
    "recoveryIndex(s).band !== \"GREEN\"",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U8 liftCall"
  ],
  [
    "U-phase-negative-GREEN",
    "policy",
    "[\"WATCH\", \"LOW\"].includes(recoveryIndex(s).band)",
    "recoveryIndex(s).band !== \"GREEN\"",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U8 phaseProposal"
  ],
  [
    "U-volume-negative-GREEN",
    "volume",
    "|| [\"WATCH\", \"LOW\"].includes(band9));",
    "|| band9 !== \"GREEN\");",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U8 volumeConversion"
  ],
  [
    "U-push-negative-GREEN",
    "writers",
    "if ([\"WATCH\", \"LOW\"].includes(rec.band)) return { mode: \"WITHHELD\"",
    "if (rec.band !== \"GREEN\") return { mode: \"WITHHELD\"",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U8 volumePush"
  ],
  [
    "U-stale-lastnight-copy",
    "sleep",
    "const lastN = currentSleepObservation(s);",
    "const lastN = s.sleep.nights.slice(-1)[0];",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U9 liftCall"
  ],
  [
    "FG-anchor-default",
    "sleep",
    "const target = Number.isFinite(((s || {}).sleep || {}).cleanH) ? s.sleep.cleanH : null;",
    "const target = Number.isFinite(((s || {}).sleep || {}).cleanH) ? s.sleep.cleanH : 7.5;",
    "rebuild/engine/test/b1b2-sleep-target-cells.cjs",
    "FG"
  ],
  [
    "FG-lightsOut-default",
    "sleep",
    "const target = Number.isFinite(rawTarget) ? rawTarget : null;",
    "const target = Number.isFinite(rawTarget) ? rawTarget : 8;",
    "rebuild/engine/test/b1b2-sleep-target-cells.cjs",
    "FG"
  ],
  [
    "FG-bodyAlarm-fabricated-2330",
    "sleep",
    "})() : null;\n  const lines",
    "})() : \"23:30\";\n  const lines",
    "rebuild/engine/test/b1b2-sleep-target-cells.cjs",
    "FG4"
  ]
];
module.exports.CONSTRUCTION_MUTATIONS.push(...[
  [
    "U-zero-is-observation",
    "sleep",
    "typeof night.h === \"number\" && Number.isFinite(night.h)",
    "typeof night.h === \"number\" && Number.isFinite(night.h) && night.h > 0",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U3 finite"
  ],
  [
    "U-last5-backfill",
    "sleep",
    "s.sleep.nights.slice(-5).map((n) => n.h)",
    "s.sleep.nights.filter(finiteSleep).slice(-5).map((n) => n.h)",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U6"
  ],
  [
    "FG-unknown-failed-night-counter",
    "sleep",
    "return { run: null, at: null, targetKnown: false }",
    "return { run: 0, at: false, targetKnown: false }",
    "rebuild/engine/test/b1b2-sleep-target-cells.cjs",
    "FG"
  ],
  [
    "FG-null-bed-arithmetic",
    "sleep",
    "const needBedMin = target == null ? null : (wakeMed + 1440) - target * 60 - sol;",
    "const needBedMin = (wakeMed + 1440) - target * 60 - sol;",
    "rebuild/engine/test/b1b2-sleep-target-cells.cjs",
    "FG"
  ],
  [
    "U-pick-stale-hour",
    "today",
    " && (slp.last.d === iso || slp.last.d === plusDays(iso, -1)) && slp.last.h < 4.5",
    " && slp.last.h < 4.5",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U8 pickStructural"
  ]
]);

module.exports.HISTORICAL_SOURCE_MUTATIONS = [
  [
    "D10-1",
    "dates",
    "Math.round((mk(bISO) - mk(aISO)) / DAY) / 7",
    "Math.round((mk(bISO) - mk(aISO)) / DAY / 7)",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D10-2",
    "dates",
    "Math.round((mk(bISO) - mk(aISO)) / DAY) / 7",
    "(Date.UTC(...bISO.split(\"-\").map((v,i)=>+v-(i===1?1:0))) - Date.UTC(...aISO.split(\"-\").map((v,i)=>+v-(i===1?1:0)))) / 604800000",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D10-3",
    "dates",
    "const d = mk(iso); d.setDate(d.getDate() + n); return isoOf(d);",
    "return isoOf(new Date(mk(iso).getTime()+n*DAY));",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D8-1",
    "sleep",
    "if (last.d !== plusDays(iso, -1) || !finiteSleep(last)) return true;   /* D8",
    "if (last.d !== plusDays(iso, -1) || !finiteSleep(last)) return false;   /* D8",
    "rebuild/engine/test/b1-unknown-recovery.test.cjs",
    "U2|U3"
  ],
  [
    "D8-2",
    "sleep",
    "if (last.d !== plusDays(iso, -1) || !finiteSleep(last)) return true;   /* D8",
    "if (Math.round((mk(iso)-mk(last.d))/DAY)>7 || !finiteSleep(last)) return true;   /* D8",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D8-3",
    "sleep",
    "if (last.h < DEBT_LAST_H) return false;",
    "if (last.h < DEBT_LAST_H) return false; return true;",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D21-1",
    "sleep",
    "const tomorrow = plusDays(today9, 1);",
    "const tomorrow = plusDays(today9, 2);",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D21-2",
    "sleep",
    "const tomorrow = plusDays(today9, 1);",
    "const tomorrow = plusDays(today9, 0);",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D21-3",
    "sleep",
    "const tomorrow = plusDays(today9, 1);",
    "const tomorrow = todayStart().getTimezoneOffset() === 300 ? plusDays(today9, 1) : today9;",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D21-3b",
    "sleep",
    "const tomorrow = plusDays(today9, 1);",
    "const tomorrow = today9 === \"2026-11-01\" ? plusDays(today9, 1) : isoOf(new Date(todayStart().getTime()+DAY));",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D21-4",
    "sleep",
    "clean: cleanAtDate(s, today9) && cleanAtDate(s, tomorrow)",
    "clean: cleanAtDate(s, tomorrow)",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D19-1",
    "policy",
    "daysSince: daysBetween(brk.start, today), ...base",
    "daysSince: daysBetween(brk.start, today)+1, ...base",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D19-2",
    "policy",
    "const resumeISO = brkS.end ? plusDays(brkS.end, 1) : null;",
    "const resumeISO = brkS.end ? isoOf(new Date(mk(brkS.end).getTime()+DAY)) : null;",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D19-scoped-output-length",
    "policy",
    "of ${BREAK_LEN_DAYS}, ${brkS.daysLeft}",
    "of ${8}, ${brkS.daysLeft}",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D16-1",
    "policy",
    "graded: false, hit: null, miss: false",
    "graded: false, hit: null, miss: true",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D16-2",
    "policy",
    "actualTrendAt(dueISO, plusDays(dueISO, 1))",
    "actualTrendAt(dueISO, plusDays(dueISO, 2))",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D16-3",
    "policy",
    "r.pt != null && !r.sealed && !r.offWindow",
    "r.pt != null",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D16-4",
    "policy",
    "const dueISO = plusDays(f.d, GRADE_LAG);",
    "const dueISO = isoOf(new Date(mk(f.d).getTime()+GRADE_LAG*DAY));",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D17-1",
    "policy",
    ".slice(-8).map((a) => ({ d: a.d, title: a.title, applied:",
    ".filter(a=>!a.undone).slice(-8).map((a) => ({ d: a.d, title: a.title, applied:",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D17-2",
    "policy",
    "applied: !a.dismissed && !a.undone, auto: !!a.auto",
    "applied: !a.dismissed && !a.undone, auto: !!(a.auto || a.undone)",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D17-3",
    "policy",
    "applied: !a.dismissed && !a.undone, auto: !!a.auto",
    "applied: false, auto: !!a.auto",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D24-1",
    "today",
    "(!yRow || yRow.cal == null)",
    "(!yRow || yRow.cal == null || yRow.pro == null || yRow.steps == null)",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D24-2",
    "today",
    "Object.keys(s.dailyLogs || {}).length > 0 && (!yRow || yRow.cal == null)",
    "(!yRow || yRow.cal == null)",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D24-3",
    "today",
    "const yISO = plusDays(isoOf(todayStart()), -1);",
    "const yISO = isoOf(new Date(todayStart().getTime()-DAY));",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D25-1",
    "today",
    "proHitN >= 1 && proHitN >= proRows.length - 1",
    "proHitN*2 >= proRows.length",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D25-2",
    "today",
    "proHitN >= 1 && proHitN >= proRows.length - 1",
    "proHitN === proRows.length",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D25-3",
    "today",
    "label: \"PROTEIN\", state: \"quiet\", detail: \"counting only\"",
    "label: \"PROTEIN\", state: \"caution\", detail: \"counting only\"",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D27-1",
    "today",
    "const stalled = onCut && !sealed && cr.measured && cr.scale < floor;",
    "const stalled = !sealed && cr.measured && cr.scale < floor;",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D27-2",
    "today",
    "const onCut = arc.key === \"cut\";",
    "const onCut = s.plan.phase === \"cut\";",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D27-3",
    "today",
    "const longCut = arc.weeks >= 10;",
    "const longCut = weekDay().wk >= 10;",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D27-4",
    "today",
    "const arc = (() => { try { return phaseArc(s); } catch (e) { return { key: \"cut\", weeks: weekDay().wk }; } })();",
    "const arc = phaseArc(s);",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D23-1",
    "today",
    "function genSession(s, iso, slp) {",
    "function genSession(s, iso, slp = {}) {",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D23-2",
    "today",
    "} catch (e) { continue; }   /* a failed derivation",
    "} catch (e) { throw e; }   /* a failed derivation",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D23-3",
    "today",
    "} catch (e) { continue; }   /* a failed derivation",
    "} catch (e) { break; }   /* a failed derivation",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ],
  [
    "D23-4",
    "today",
    "d9 = plusDays(isoOf(todayStart()), k9);",
    "d9 = isoOf(new Date(todayStart().getTime()+k9*DAY));",
    "rebuild/engine/test/b1-delta-cells.cjs",
    null
  ]
];

/* Historical source mutation construction audit checkpoint, Node24.19.0:
 --audit-historical-mutations:34 licensed historical mutations detected
 (33 behavioral assertions + D10-2 declaration-alias assertion), plus one separate
 phaseArc-only length probe. D19-3 constants-file mutation is HELD, not run.
 The earlier D23-1 survivor used the wrong declaration (pickStructural), replaced
 by the historical genSession default parameter; a new real missing-slp cell
 kills it. Deliberate malformed phase/accessor escapes are now asserted via
 doesNotThrow; their earlier raw exceptions were NOT counted as kills.
 B1 now27/27; exact M2/27. Earlier26-cell checkpoint remains recorded above.
*/
// Explicit opt-in construction audit; ordinary node --test never mutates sources.
function runConstructionAudit(mode) {
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
 const root=path.resolve(__dirname,'../../..'),scratch=path.join(root,'.tmp','b1b2-public-audit');fs.mkdirSync(scratch,{recursive:true});
 const licensed=['dates','sleep','policy','today','plan','progression','volume','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
 const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),saved=new Map(licensed.map(p=>[p,fs.readFileSync(path.join(root,p))]));
 const before=Object.fromEntries([...saved].map(([p,b])=>[p,sha(b)]));
 const run=(args,label)=>{const r=cp.spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',windowsHide:true,env:{...process.env,TZ:'America/New_York'}});if(r.error)throw r.error;fs.writeFileSync(path.join(scratch,label+'.log'),r.stdout+r.stderr);return {status:r.status,text:r.stdout+r.stderr};};
 const restore=()=>{for(const [p,b]of saved)fs.writeFileSync(path.join(root,p),b);for(const [p,h]of Object.entries(before))assert.equal(sha(fs.readFileSync(path.join(root,p))),h,'source restoration '+p);};
 const result=[];
 try {
  if(mode==='--audit-mutations'||mode==='--audit-historical-mutations') {
   for(const [id,name,a,b,evidence,filter]of (mode==='--audit-mutations'?module.exports.CONSTRUCTION_MUTATIONS:module.exports.HISTORICAL_SOURCE_MUTATIONS)){
    const p='rebuild/engine/'+name+'.cjs';assert.ok(licensed.includes(p),'unlicensed mutation source');assert.ok(['rebuild/engine/test/b1-unknown-recovery.test.cjs','rebuild/engine/test/b1b2-sleep-target-cells.cjs','rebuild/engine/test/b1-delta-cells.cjs'].includes(evidence));
    const source=saved.get(p).toString('utf8');assert.equal(source.split(a).length,2,'exact mutation anchor '+id);
    let r;try{fs.writeFileSync(path.join(root,p),source.replace(a,b));r=run(filter?['--test','--test-reporter=tap','--test-name-pattern='+filter,evidence]:[evidence],id);}finally{restore();}
    const record=(r.text.match(/^PUBLIC_B1_RESULT (.+)$/m)||[])[1];
    const delta=record?JSON.parse(record):null;
    const failures=delta?delta.failures.length:(r.text.match(/^not ok /gm)||[]).length,assertions=delta?delta.failures.filter(f=>f.code==='ERR_ASSERTION').length:(r.text.match(/code: 'ERR_ASSERTION'/g)||[]).length;
    const classification=r.status===1&&failures>0&&failures===assertions?'BEHAVIORAL_KILL':r.status===0?'SURVIVED':'SETUP_OR_BOUNDARY_FAILURE';
    const kind=id==='D10-2'&&classification==='BEHAVIORAL_KILL'?'DECLARATION_ALIAS_KILL':classification;
    result.push({id,classification:kind,failures,assertions});console.log(id+' '+kind);
   }
  } else if(mode==='--audit-preimage') {
   for(const p of licensed)fs.writeFileSync(path.join(root,p),cp.execFileSync('git',['show','100820aa47a4f8729642033499eaec0f0ee282e1:'+p],{cwd:root,windowsHide:true}));
   const rows=[['b1',['rebuild/engine/test/b1-delta-cells.cjs']],['b2',['rebuild/lanes/b/b2-delta-cells.cjs']],['u',['--test','--test-reporter=tap','rebuild/engine/test/b1-unknown-recovery.test.cjs']],['fg',['--test','--test-reporter=tap','rebuild/engine/test/b1b2-sleep-target-cells.cjs']]];
   for(const [id,args]of rows){const r=run(args,'M-'+id);const tests=Number((r.text.match(/^# tests (\d+)/m)||[])[1]||0),pass=Number((r.text.match(/^# pass (\d+)/m)||[])[1]||0),fail=Number((r.text.match(/^# fail (\d+)/m)||[])[1]||0),assertions=(r.text.match(/code: 'ERR_ASSERTION'/g)||[]).length;const deltaLine=(r.text.match(/^PUBLIC_B1_RESULT (.+)$/m)||[])[1],delta=deltaLine?JSON.parse(deltaLine):null;
    if(id==='b1'){assert.equal(r.status,1);assert.equal(delta.total,27);assert.equal(delta.passed,2);assert.ok(delta.failures.every(f=>f.code==='ERR_ASSERTION'));}
    if(id==='b2'){assert.equal(r.status,0);assert.match(r.text,/32\/32 HOLD · side BASE/);}
    result.push({id,status:r.status,tests,pass,fail,assertions,...(delta?{deltaTotal:delta.total,deltaPass:delta.passed,deltaAssertions:delta.failures.length}:{}),classification:tests?(fail===assertions?'BEHAVIOR_ONLY':'SETUP_OR_BOUNDARY_FAILURE'):/TypeError|ReferenceError|SyntaxError/.test(r.text)?'SETUP_OR_BOUNDARY_FAILURE':'DELTA_PROGRAM'});console.log(JSON.stringify(result.at(-1)));}
  } else throw Error('unsupported construction audit mode');
 } finally {restore();}
 fs.writeFileSync(path.join(scratch,mode.slice(2)+'.json'),JSON.stringify({sourceBefore:before,sourceRestored:true,results:result},null,2)+'\n');
 const ok=result.every(r=>!['SURVIVED','SETUP_OR_BOUNDARY_FAILURE'].includes(r.classification));console.log('PUBLIC CONSTRUCTION AUDIT '+mode+': '+(ok?'EXPECTED BEHAVIOR':'FAIL')+'; runtime bytes restored and SHA256-checked');return ok;
}
module.exports.runConstructionAudit=runConstructionAudit;
if(require.main===module&&process.argv.some(a=>['--audit-mutations','--audit-historical-mutations','--audit-preimage'].includes(a)))process.exit(runConstructionAudit(process.argv.find(a=>['--audit-mutations','--audit-historical-mutations','--audit-preimage'].includes(a)))?0:1);

// Expanded amendment audit:20/20 behavioral kills. Historical audit:34/34
// licensed historical probes detected plus1 separately labeled phaseArc output probe.
// Current standard cells: U118/118, FG28/28, B1 27/27, B2 32/32.
