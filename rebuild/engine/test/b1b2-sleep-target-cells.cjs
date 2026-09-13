'use strict';
// F-G committed public synthetic cells; actual consumer outputs, no helper stubs.
process.env.TZ='America/New_York';
const assert=require('node:assert/strict'),test=require('node:test');
const {createEngine,syntheticState,clockAt}=require('./b1b2-public-engine.cjs');
const engine=()=>createEngine({clock:clockAt('2026-09-03'),ids:{fresh:()=> 'synthetic-id'}}).__test;
const state=()=>{const s=syntheticState();s.exercises=[];return s;};
const unknownTargets={absent:undefined,null:null,nan:NaN,infinity:Infinity,negativeInfinity:-Infinity,string:"8"};
const times=s=>{s.sleep.nights=['2026-08-26','2026-08-27','2026-08-28','2026-08-29','2026-08-30','2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:8.3,bed:'22:30',wake:'07:30',sol:15}));return s;};
for(const [name,cleanH]of Object.entries(unknownTargets))for(const recorded of [false,true])test(`FG1 unknown target ${name} recorded ${recorded}`,()=>{
  const T=engine(),s=state();if(recorded)times(s);s.sleep.cleanH=cleanH;
  assert.deepEqual(T.atSleepTarget(s,null),{run:null,at:null,targetKnown:false});
  const sl=T.sleepInfo(s);assert.equal(sl.targetKnown,false);assert.equal(sl.run,null);assert.equal(sl.atTarget,null);
  assert.equal(T.sleepAnchor(s).target,null);assert.equal(T.lightsOutT(s).target,null);
});
for(const target of [0,7.5,8,8.5])test(`FG1 explicit finite target ${target}`,()=>{
  const T=engine(),s=times(state());s.sleep.cleanH=target;
  assert.deepEqual(T.atSleepTarget(s,null),{run:target>8.3?0:8,at:target<=8.3,targetKnown:true});
  assert.equal(T.sleepAnchor(s).target,target);assert.equal(T.lightsOutT(s).target,target);
});
for(const recorded of [false,true])test(`FG2 unknown target clock facts ${recorded}`,()=>{
  const T=engine(),s=state();if(recorded)times(s);delete s.sleep.cleanH;
  const a=T.sleepAnchor(s),lo=T.lightsOutT(s);assert.equal(a.target,null);assert.equal(a.needBed,null);assert.equal(a.shiftMin,null);assert.equal(lo.t,null);assert.equal(lo.mins,null);
  if(recorded){assert.equal(a.bed,'22:30');assert.equal(a.wake,'07:30');assert.equal(a.curH,8.75);assert.equal(a.measured,true);}
  else assert.equal(a.measured,false);
  assert.doesNotMatch(a.why,/clears it|To clear|7\.5|8 h/);
});
test('FG2 explicit target and measured clock retain bedtime',()=>{
  const T=engine(),s=times(state());s.sleep.cleanH=8;
  assert.equal(T.sleepAnchor(s).needBed,'23:15');assert.equal(T.lightsOutT(s).t,'23:15');assert.equal(T.lightsOutT(s).mins,1395);
});
for(const cleanH of [undefined,null,NaN,Infinity])test(`FG3 debt survives target ${String(cleanH)}`,()=>{
  const T=engine(),s=state();s.sleep.cleanH=cleanH;s.sleep.nights=[{d:'2026-09-02',h:2}];
  const r=T.recoveryIndex(s);assert.equal(r.band,'UNKNOWN');assert.equal(r.score,null);assert.equal(r.flags[0].k,'sleep');assert.equal(r.flags[0].cost,null);assert.equal(r.lever,null);
  assert.doesNotMatch(JSON.stringify(r),/undefined|NaN|null h|0 of 3 clean|at 7\.5|at 8 h/);
});
function alarmState(target,override){const s=times(state());s.sleep.cleanH=target;s.sleep.caffMg=200;s.pulse=['2026-08-26','2026-08-27','2026-08-28','2026-08-29','2026-08-30','2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,bpm:60}));s.pulse.push({d:'2026-09-03',bpm:72});if(override)s.dayCtx['2026-09-03']={lightsOut:'23:00'};return s;}
for(const [name,target,override,early]of [['known',8,false,'22:45'],['unknown',undefined,false,null],['null',null,false,null],['nonfinite',Infinity,false,null],['known+override',8,true,'22:30'],['unknown+override',undefined,true,null]])test(`FG4 actual bodyAlarm ${name}`,()=>{
  const T=engine(),s=alarmState(target,override),sig=T.bodyAlarmSignal(s),alarm=T.bodyAlarm(s,T.sleepInfo(s));
  assert.ok(sig);assert.ok(alarm);assert.equal(alarm.tier,'RED');assert.deepEqual(sig,T.bodyAlarmSignal(alarmState(8,override)),'target availability cannot change alarm signal');
  const text=alarm.lines.join(' ');assert.match(text,/skip any afternoon caffeine/);assert.doesNotMatch(text,/NaN|undefined|null|23:30/);
  if(early)assert.match(text,new RegExp('lights out '+early+' \\(30 early'));
  else {assert.doesNotMatch(text,/30 early|up at your usual/);if(override)assert.match(text,/23:00.*(?:override|set by you)/);else assert.doesNotMatch(text,/lights out \d/);}
});
test('FG4 missing target actual Today and writer consumers avoid fabricated bedtime and count',()=>{
  const T=engine(),s=alarmState(undefined,true),sl=T.sleepInfo(s);s.sessionLog['2026-09-03']={entries:[]};s.dailyLogs['2026-09-03']={cal:2200,pro:180,steps:10000};
  assert.equal(T.fiveLevers(s).sleep.state,'quiet');assert.doesNotMatch(T.fiveLevers(s).sleep.detail,/null|0\/3|undefined/);
  const outputs=[T.theOneThing(s,sl,21),T.dayProtocol(s,sl),T.askContext(s)];
  const text=JSON.stringify(outputs);assert.doesNotMatch(text,/null h|null consecutive|undefined|NaN|0\/3 clean|0 consecutive|7\.5 h target|8 h asleep|20 early/);
});
module.exports={alarmState};

// PM246 independent failure fixtures, fixed expectations (ER ff0c3c13).
function clockState(target) {
  const s = state();
  s.exercises = [];
  if (target === undefined) delete s.sleep.cleanH; else s.sleep.cleanH = target;
  s.sleep.nights = ['2026-08-26', '2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01', '2026-09-02']
    .map(d => ({ d, h: 8.3, bed: '22:30', wake: '07:30', sol: 15 }));
  return s;
}
for (const target of [8, 9]) test(`FG4 R1 known target ${target} preserves actual coaching comparison`, () => {
  const T = engine(), s = clockState(target), before = structuredClone(s);
  const anchor = T.sleepAnchor(s), out = T.askContext(s);
  assert.equal(anchor.measured, true);
  assert.equal(anchor.target, target);
  if (target === 8) assert.match(out, /He already clears his target\./);
  else {
    assert.equal(anchor.shiftMin, 15);
    assert.match(out, /To clear his 9 h target at the wake time he already keeps, lights out 22:15 — 15 minutes earlier\./);
  }
  assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
});
for (const [name, target] of [['missing', undefined], ['null', null], ['NaN', NaN], ['positive infinity', Infinity], ['negative infinity', -Infinity], ['numeric string', '8']]) {
  test(`FG4 R1 ${name} target with factual clock cannot claim clearance`, () => {
    const T = engine(), s = clockState(target), before = structuredClone(s);
    const anchor = T.sleepAnchor(s), out = T.askContext(s);
    assert.equal(anchor.measured, true, 'Must reach measured-clock consumer');
    assert.equal(anchor.target, null);
    assert.equal(anchor.shiftMin, null);
    assert.match(out, /sleep target not recorded; comparison unavailable/);
    assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
    assert.doesNotMatch(out, /He already clears his target\.|To clear his .*? h target/, 'Unknown target must not produce a comparison verdict elsewhere in askContext');
  });
}
function todayState(hours) {
  const s = state();
  s.exercises = [];
  const latest = { d: '2026-09-02' };
  if (hours !== undefined) latest.h = hours;
  s.sleep.nights = [{ d: '2026-08-31', h: 8 }, { d: '2026-09-01', h: 8 }, latest];
  s.reads = [{ d: '2026-09-03', w: 180, pt: 180 }];
  s.dailyLogs = { '2026-09-02': { cal: 2200, pro: 180, steps: 10000 }, '2026-09-03': { cal: 2200, pro: 180, steps: 10000 } };
  s.sessionLog = { '2026-09-03': { entries: [] } };
  return s;
}
for (const h of [0, 2, 8]) test(`FG4 R2 actual Today valid ${h}h control`, () => {
  const T = engine(), s = todayState(h), before = structuredClone(s);
  const rec = T.recoveryIndex(s), lever = T.fiveLevers(s).sleep;
  assert.equal(T.nowFocus(s).owed.length, 0, 'Logging must not mask sleep decision');
  assert.equal(rec.band, h < 6.5 ? 'WATCH' : 'GREEN');
  assert.equal(lever.state, h < 6.5 ? 'caution' : 'good');
  const fix = T.theOneFix(s);
  if (h < 6.5) assert.equal(fix.rung, 'sleep', 'Real short/zero observation preserves existing advice');
  else assert.notEqual(fix.rung, 'sleep');
  assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
});
for (const [name, h] of [['missing', undefined], ['null', null], ['numeric string', '8'], ['NaN', NaN], ['positive infinity', Infinity], ['negative infinity', -Infinity]]) {
  test(`FG4 R2 actual Today ${name} current hours cannot become failed sleep`, () => {
    const T = engine(), s = todayState(h), before = structuredClone(s);
    const rec = T.recoveryIndex(s), lever = T.fiveLevers(s).sleep, fix = T.theOneFix(s);
    assert.equal(rec.band, 'UNKNOWN');
    assert.equal(rec.score, null);
    assert.equal(T.nowFocus(s).owed.length, 0, 'Logging must not mask the actual downstream decision');
    assert.deepEqual(s, before, 'Reviewer calls preserve recorded state');
    assert.equal(lever.state, 'quiet', 'Absent finite current evidence cannot become a failed-night verdict');
    assert.notEqual(fix.rung, 'sleep', 'Absent finite current evidence cannot supply a short-sleep restriction');
  });
}
// PM246 R7: same observations, available and unavailable target contributions.
for(const [name,target] of Object.entries({...unknownTargets,eight:8,nine:9})) test(`FG3 R7 paired target ${name}`,()=>{
 const T=engine(),s=state();s.sleep.cleanH=target;s.sleep.nights=[{d:'2026-09-02',h:2},{d:'2026-09-03',h:8}];const before=structuredClone(s),r=T.recoveryIndex(s),known=Number.isFinite(target);
 assert.equal(r.flags.length,1);assert.equal(r.flags[0].k,'sleep');assert.equal(r.flags[0].cost,known?(target===8?20:30):null);assert.equal(r.score,known?(target===8?80:70):null);assert.equal(r.band,known?(target===8?'GREEN':'WATCH'):'UNKNOWN');assert.equal(r.lever,known?r.flags[0]:null);assert.deepEqual(r.factors,r.flags.map(f=>f.receipt));assert.deepEqual(s,before);
});
for(const [name,target] of Object.entries({...unknownTargets,known:8}))for(const [kind,nights,debt] of [
 ['three',[{d:'2026-08-31',h:6.6},{d:'2026-09-01',h:6.6},{d:'2026-09-02',h:6.6}],true],
 ['gapped',[{d:'2026-08-30',h:6.6},{d:'2026-09-01',h:6.6},{d:'2026-09-02',h:6.6}],false],
 ['missing',[],false],['invalid',[{d:'2026-09-02',h:null}],false],['stale',[{d:'2026-08-30',h:2}],false],['future',[{d:'2026-09-04',h:2}],false],
 ['short-final',[{d:'2026-08-30',h:6.6},{d:'2026-09-02',h:2}],true]
])test(`FG3 R7 ${name} ${kind} observed debt`,()=>{
 const T=engine(),s=state();s.sleep.cleanH=target;s.sleep.nights=nights;const before=structuredClone(s),r=T.recoveryIndex(s);assert.equal(r.flags.some(f=>f.k==='sleep'),debt);assert.equal(T.sleepMean3At(s,'2026-09-03'),kind!=='three');assert.equal(T.cleanAtDate(s,'2026-09-03'),!debt);
 if(debt){assert.equal(r.flags[0].cost,Number.isFinite(target)?30:null);assert.ok(r.flags[0].fix);if(!Number.isFinite(target)){assert.equal(r.score,null);assert.equal(r.lever,null);assert.match(r.flags[0].receipt,/observed/);}}
 if(!Number.isFinite(target))assert.doesNotMatch(JSON.stringify([T.fiveLevers(s),T.theOneThing(s,T.sleepInfo(s),21),T.dayProtocol(s,T.sleepInfo(s)),T.askContext(s)]),/null h|undefined h|NaN h|0\/3 clean|already clears his target/);assert.deepEqual(s,before);
});
for(const [label,holds,ng,dips,band] of [['minor',1,0,0,'UNKNOWN'],['watch',2,1,0,'WATCH'],['low',2,3,2,'LOW']])test(`FG3 R7 independent ${label} with unavailable sleep cost`,()=>{
 const T=engine(),s=state();delete s.sleep.cleanH;s.sleep.nights=[{d:'2026-09-02',h:2}];s.exercises=Array.from({length:holds},(_,i)=>({id:'held'+i,n:'Held'+i,holdFlag:true}));s.sessionLog={'2026-09-01':{entries:[],niggles:Array(ng).fill('joint'),dips}};const before=structuredClone(s),r=T.recoveryIndex(s);assert.equal(r.band,band);assert.equal(r.score,null);assert.equal(r.lever,null);assert.equal(r.flags[0].cost,null);assert.equal(r.flags.length,1+!!holds+!!ng+!!dips);assert.ok(r.flags.every(f=>f.receipt&&f.fix));assert.deepEqual(s,before);
});
for(const target of [undefined,null,NaN,Infinity,'8',8])test(`FG4 final instruction actual theOneThing ${String(target)}`,()=>{
 const T=engine(),s=times(state());s.sleep.cleanH=target;s.sessionLog['2026-09-03']={entries:[]};s.dailyLogs['2026-09-03']={cal:2200,pro:180,steps:10000};const out=T.theOneThing(s,T.sleepInfo(s),21);assert.equal(out.t,"Everything's banked ✓");if(Number.isFinite(target))assert.match(out.sub,/lights out/i);else {assert.match(out.sub,/target not recorded/i);assert.doesNotMatch(out.sub,/lights out|up /i);}
});
for(const [name,target]of Object.entries({...unknownTargets,eight:8,nine:9}))test(`FG4 weekReview target ${name} with actual askContext`,()=>{
 const T=engine(),s=times(state());s.sleep.cleanH=target;const before=structuredClone(s),out=T.weekReview(s),text=out.lines[2];assert.equal(out.lines.length,4);assert.equal(Object.keys(out).sort().join(','),'lines,verdict,window,wk');
 if(Number.isFinite(target))assert.equal(text,`sleep ${target===8?6:0}/6 clean`);else {assert.match(text,/6 nights recorded; target not recorded/);assert.doesNotMatch(text,/\d+\/\d+ clean/);assert.ok(T.askContext(s).includes(text));}assert.deepEqual(s,before);
 const known=structuredClone(s);known.sleep.cleanH=8;const control=T.weekReview(known);assert.deepEqual(out.lines.filter((_,i)=>i!==2),control.lines.filter((_,i)=>i!==2));assert.equal(out.verdict,control.verdict);assert.equal(out.wk,control.wk);assert.equal(out.window,control.window);
 s.blackout.until='2026-09-10';assert.match(T.weekReview(s).lines[2],/ · scale sealed — verdict Monday$/);
});
for(const [name,h]of Object.entries({absent:undefined,null:null,string:'6.6',nan:NaN,infinity:Infinity,negativeInfinity:-Infinity}))for(const slot of [1,2])for(const target of [undefined,8])test(`FG3 R7 invalid mean ${name} slot${slot} target${String(target)}`,()=>{
 const T=engine(),s=state();if(target===undefined)delete s.sleep.cleanH;else s.sleep.cleanH=target;s.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:6.6}));if(h===undefined)delete s.sleep.nights[slot].h;else s.sleep.nights[slot].h=h;const before=structuredClone(s);assert.equal(T.cleanAtDate(s,'2026-09-03'),true);assert.equal(T.sleepMean3At(s,'2026-09-03'),true);assert.equal(T.recoveryIndex(s).flags.some(f=>f.k==='sleep'),false);assert.deepEqual(s,before);
});
for(const [name,target]of Object.entries({...unknownTargets,known:8}))test(`FG4 logging theOneThing target ${name}`,()=>{
 const T=engine(),s=state();s.sleep.cleanH=target;s.sleep.needed=1;s.sleep.nights=[{d:'2026-09-03',h:2}];const before=structuredClone(s),out=T.theOneThing(s,T.sleepInfo(s),21);assert.match(out.t,/^Log /);if(Number.isFinite(target))assert.match(out.sub,/8 h target/);else assert.doesNotMatch(out.sub,/target|updates the target count/);assert.deepEqual(s,before);
});
