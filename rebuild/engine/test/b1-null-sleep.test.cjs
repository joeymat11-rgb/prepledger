'use strict';
// R1 regression: actual exported factories and source registrar, synthetic data.
// No seed, pricing, trend, recovery or decision replacement.
const test=require('node:test'),assert=require('node:assert/strict');
const Source=require('../../m3/w5/source/codec.cjs');
const {createNullSelectionRegistrar}=require('../../m4/workout/source-projection.cjs');
const DAY='2026-09-03';
function engine(){const E={HISTORY:[],ROLLUPS:[],SEED:{},exById:(s,id)=>s.exercises.find(e=>e.id===id)};
 const deps={clock:{today:()=>DAY,hour:()=>12,now:()=>new Date(DAY+'T16:00:00Z'),nowISO:()=>DAY+'T16:00:00Z'},ids:{fresh:()=> 'synthetic-id'}};
 for(const n of ['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','earn','writers'])Object.assign(E,require('../'+n+'.cjs')(E,deps));return E;}
function state(E){const s={v:60,trend:180,reads:[],weekly:[],dailyLogs:{},sessionLog:{},sleep:{nights:[],needed:3,debts:[],target:8,cleanH:7.5},exercises:[],queue:[],feed:[],forecasts:[],adjustments:[],proposals:[],suggestionLog:[],targets:{},learned:{tdee:[],anchors:[]},plan:{goals:[],ifthen:[],setAt:{},phaseLog:[]},exOrder:{U:[],L:[]},planGen:52,retirements:{},insertions:{},waist:[],photos:[],events:[],trials:[],agentProposals:[],blackout:{until:'2026-07-27'},model:{lean:150,drip:0,src:'DEXA',anchorISO:'2026-08-01'},dayCtx:{}};
 s.exercises=['press','row','squat','curl'].map((id,i)=>({id,n:'Synthetic '+id,mg:['chest','back','quads','biceps'][i],day:'U',w:40,sets:2,hi:10,inc:2.5,steps:[20,22.5,25,30,40],forks:[]}));s.exOrder.U=s.exercises.map(e=>e.id);
 for(const d of ['2026-08-23','2026-08-26','2026-08-29','2026-09-01'])s.sessionLog[d]={entries:s.exercises.map(e=>({id:e.id,w:40,reps:[8,8],rir:2}))};
 for(let i=0;i<25;i++){const d=E.plusDays('2026-08-10',i);s.reads.push({d,w:180});s.dailyLogs[d]={steps:6000};}return s;}
function admitted(s){const r=createNullSelectionRegistrar({sourceCodec:Source}),p=r.register({generation:{collections:{}},state:s});return r.workoutInput(p,p.source_basis).state;}
function modelAndGates(E,s){return {recovery:E.recoveryIndex(s),volume:E.volumePush(s),steps:E.stepPush(s,{accelerate:true})};}

for(const day of ['2026-09-02',DAY])for(const [label,row] of [['null',{h:null}],['undefined',{h:undefined}],['omitted',{}]])test(day+' '+label+' hours admitted without invented sleep cost or veto',()=>{
 const E=engine(),s=state(E);s.sleep.nights=[{d:day,...row}];const a=admitted(s),before=structuredClone(a),r=modelAndGates(E,a);
 assert.equal(E.progressionTrend(a).state,'flat');assert.equal(r.recovery.band,'UNKNOWN');assert.equal(r.recovery.score,null);assert.deepEqual(r.recovery.flags,[]);
 assert.equal(E.sleepInfo(a).clean,true);assert.equal(E.sleepMean3At(a,DAY),true);assert.equal(E.sleepMean3At(a,E.plusDays(DAY,1)),true);
 assert.equal(r.volume.mode,'PUSH');assert.equal(r.steps.mode,'PUSH');assert.deepEqual(a,before);assert.deepEqual(a.sleep.nights,structuredClone(s.sleep.nights));
});

for(const day of ['2026-09-02',DAY])for(const h of [0,2,8])test(day+' finite '+h+' preserves known model and actual gate behavior',()=>{
 const E=engine(),s=state(E);s.sleep.nights=[{d:day,h}];const a=admitted(s),before=structuredClone(a),r=modelAndGates(E,a);
 assert.equal(r.recovery.sleepEvidence,undefined);assert.equal(r.recovery.band,h<6.5?'WATCH':'GREEN');assert.equal(r.recovery.score,h<6.5?70:100);
 assert.equal(r.volume.mode,h<6.5?'WITHHELD':'PUSH');if(h<6.5)assert.equal(r.volume.veto,'recovery');
 assert.equal(r.steps.mode,day!==DAY&&h<6.5?'WITHHELD':'PUSH');assert.deepEqual(a,before);
});

test('missing observations cannot manufacture a current three-night mean or chronic five-night flag',()=>{
 const E=engine();for(const h of [null,undefined])for(const missingIndex of [0,1,2]){
  const s=state(E);s.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:8}));s.sleep.nights[missingIndex].h=h;
  const a=admitted(s);assert.equal(E.cleanAtDate(a,DAY),true);assert.equal(E.sleepMean3At(a,DAY),true);assert.ok(!E.recoveryIndex(a).flags.some(f=>f.k==='sleep'));assert.equal(E.volumePush(a).mode,'PUSH');assert.equal(E.stepPush(a,{accelerate:true}).mode,'PUSH');
 }
 for(const h of [null,undefined]){const s=state(E);s.sleep.nights=['2026-08-29','2026-08-30','2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h}));const a=admitted(s);assert.deepEqual(E.recoveryIndex(a).flags,[]);assert.equal(E.volumePush(a).mode,'PUSH');assert.equal(E.stepPush(a,{accelerate:true}).mode,'PUSH');}
});

test('missing hours preserve actual adverse factors, current short mean and valid other anchor',()=>{
 const E=engine();for(const severity of ['WATCH','LOW']){const s=state(E);s.sleep.nights=[{d:'2026-09-02',h:null}];s.sessionLog['2026-09-02']={entries:[],niggles:['a','b','c']};if(severity==='LOW'){s.exercises[0].holdFlag=true;s.exercises[1].holdFlag=true;s.sessionLog['2026-09-02'].dips=3;}
  const a=admitted(s),r=modelAndGates(E,a);assert.equal(r.recovery.band,severity);assert.equal(r.recovery.score,null);assert.ok(!r.recovery.flags.some(f=>f.k==='sleep'));assert.equal(r.volume.veto,'recovery');assert.equal(r.steps.veto||null,severity==='LOW'?'recovery':null);
 }
 const s=state(E);s.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:6.8}));let a=admitted(s);assert.equal(E.sleepMean3At(a,DAY),false);assert.equal(E.volumePush(a).mode,'WITHHELD');assert.equal(E.stepPush(a,{accelerate:true}).veto,'sleep');
 s.sleep.nights=[{d:'2026-09-02',h:0},{d:DAY,h:null}];a=admitted(s);assert.equal(E.recoveryIndex(a).band,'WATCH');assert.equal(E.recoveryIndex(a).score,70);assert.equal(E.stepPush(a,{accelerate:true}).veto,'sleep');
});

test('only finite numeric hours qualify; complete measured averages and target runs remain live',()=>{
 const E=engine();for(const h of [NaN,Infinity,-Infinity,false,'0','8']){const s=state(E);s.sleep.nights=['2026-08-29','2026-08-30','2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h}));const a=admitted(s),before=structuredClone(a),r=modelAndGates(E,a);
  assert.equal(r.recovery.band,'UNKNOWN');assert.equal(r.recovery.score,null);assert.deepEqual(r.recovery.flags,[]);assert.equal(E.atSleepTarget(a,DAY).run,0);assert.equal(r.volume.mode,'PUSH');assert.equal(r.steps.mode,'PUSH');assert.deepEqual(a,before);
 }
 for(const h of [0,8]){const s=state(E);s.sleep.nights=['2026-08-29','2026-08-30','2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h}));const a=admitted(s),r=E.recoveryIndex(a);assert.equal(r.sleepEvidence,undefined);assert.equal(r.flags.some(f=>f.k==='avg5'),h===0);assert.equal(E.atSleepTarget(a,DAY).run,h===8?5:0);}
});

