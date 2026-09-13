'use strict';
// F-G committed public synthetic cells; actual consumer outputs, no helper stubs.
process.env.TZ='America/New_York';
const assert=require('node:assert/strict'),test=require('node:test');
const {createEngine,syntheticState,clockAt}=require('./b1b2-public-engine.cjs');
const engine=()=>createEngine({clock:clockAt('2026-09-03'),ids:{fresh:()=> 'synthetic-id'}}).__test;
const state=()=>{const s=syntheticState();s.exercises=[];return s;};
const unknownTargets={absent:undefined,null:null,nan:NaN,infinity:Infinity,negativeInfinity:-Infinity};
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
  const r=T.recoveryIndex(s);assert.equal(r.band,'WATCH');assert.equal(r.score,70);assert.equal(r.flags[0].k,'sleep');assert.equal(r.flags[0].cost,30);
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
  const text=JSON.stringify(outputs);assert.doesNotMatch(text,/null h|undefined|NaN|0\/3 clean|0 consecutive|7\.5 h target|8 h asleep|20 early/);
});
module.exports={alarmState};
