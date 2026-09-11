'use strict';
// Synthetic, exported factory/consumer tests. No seed or private record is used.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const DAY='2026-09-03',deps={clock:{today:()=>DAY,hour:()=>12,now:()=>new Date(DAY+'T16:00:00Z')},ids:{fresh:()=> 'synthetic-id'}};
const names=['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','writers'];
function factory(name,mutate) {
 const filename=path.resolve(__dirname,'../'+name+'.cjs');if(!mutate)return require(filename);
 const m=new Module(filename,module);m.filename=filename;m.paths=module.paths;m._compile(mutate(fs.readFileSync(filename,'utf8')),filename);return m.exports;
}
function engine(changes={}) {const E={};for(const n of names)Object.assign(E,factory(n,changes[n])(E,deps));return E;}
const state=()=>({v:60,trend:180,reads:[],weekly:[],dailyLogs:{},sessionLog:{},sleep:{nights:[],needed:3,debts:[],target:8,cleanH:7.5},exercises:[],queue:[],feed:[],forecasts:[],adjustments:[],proposals:[],suggestionLog:[],targets:{},learned:{tdee:[],anchors:[]},plan:{goals:[],ifthen:[],setAt:{},phaseLog:[]},exOrder:{U:[],L:[]},planGen:52,retirements:{},insertions:{},waist:[],photos:[],events:[],trials:[],agentProposals:[],blackout:{until:'2026-07-27'},model:{lean:150,drip:0,src:'DEXA',anchorISO:'2026-08-01'},dayCtx:{}});
const night=(d,h)=>({d,h});const clone=x=>JSON.parse(JSON.stringify(x));
function exercise(){return{id:'press',n:'Synthetic press',mg:'chest',day:'U',w:40,sets:2,hi:10,inc:2.5,steps:[20,22.5,25,30,40],forks:[]};}
function withHistory() {const s=state();s.exercises=[exercise()];s.exOrder.U=['press'];for(const d of ['2026-08-23','2026-08-26','2026-08-29','2026-09-01'])s.sessionLog[d]={entries:[{id:'press',w:40,reps:[8,8],rir:2}]};return s;}
function watch(s) {s.sessionLog['2026-09-02']={entries:[],niggles:['a','b','c']};return s;}
function low(s) {watch(s);s.exercises.push({...exercise(),id:'other',holdFlag:true});s.exercises[0].holdFlag=true;s.sessionLog['2026-09-01']={entries:[],dips:3};return s;}
function decisions(E) {
 // Keep recovery/sleep and exported decision functions real; isolate unrelated
 // energy pricing and progression qualification so every recovery gate is reached.
 E.energyAvailability=()=>({gated:true});
 E.energyBalanceTarget=()=>({regime:'free',regimeConfirmed:true,lo:2100,hi:2200});
 E.progressionTrend=()=>({state:'stable'});E.phaseArc=()=>({key:'cut'});
 E.regime=()=>({rate:{lo:0,hi:0,scale:0}});
 E.programmeVolume=()=>[{mg:'chest',sets:4,zone:'low',lifts:[{id:'press'}]}];
 E.structuralMovesThisWeek=()=>({sets:[],mgsTouched:[]});E.exActive=()=>true;
 E.liftTrend=()=>({n:4,lo:-3,hi:-1,pct:-2});
 E.stepTarget=()=>({base:6000,mid:6000});E.bodyCompBand=()=>({dir:'cut',corrPct:[0.5,1]});
 E.currentRate=()=>({measured:true,scale:0});E.stepEfficacy=()=>({status:'COUNTING'});
 return E;
}
const phaseDeps={today:DAY,brk:{status:'none',honest:{metabolic:'Synthetic',scale:'Synthetic'},maintenance:2200},sup:{kind:'none'},arc:{key:'cut'}};

for(const [label,nights] of [['missing',[]],['stale',[night('2026-08-31',2)]],['future only',[night('2026-09-04',8)]]])test(label+' is UNKNOWN/null, no sleep restriction, no invented factor',()=>{
 const E=engine(),s=state();s.sleep.nights=nights;const before=clone(s),r=E.recoveryIndex(s);
 assert.equal(r.band,'UNKNOWN');assert.equal(r.score,null);assert.equal(r.sleepEvidence.state,'UNKNOWN');assert.deepEqual(r.flags,[]);
 assert.equal(E.sleepInfo(s).clean,true);assert.deepEqual(s,before);
});

test('known adequate and current short outputs preserve their original whole objects',()=>{
 const E=engine();for(const h of [8,2]) {const s=state();s.sleep.nights=[night('2026-09-02',h)];const r=E.recoveryIndex(s);
 const flags=h===8?[]:[{k:'sleep',receipt:'sleep reset — 0 of 3 clean nights',fix:'3 more nights at 7.5 h or better, back to back',cost:30}];
 assert.deepEqual(r,{score:h===8?100:70,band:h===8?'GREEN':'WATCH',flags,lever:flags[0]||null,watched:7,excludedDips:0,factors:flags.map(f=>f.receipt)});
 }
});

test('missing sleep with independently observed WATCH and LOW retains flags/severity, never a complete score',()=>{
 const E=engine();for(const [make,band] of [[watch,'WATCH'],[low,'LOW']]) {const s=make(withHistory()),before=clone(s),r=E.recoveryIndex(s);
 assert.equal(r.band,band);assert.equal(r.score,null);assert.equal(r.sleepEvidence.state,'UNKNOWN');assert.ok(r.flags.some(f=>f.k==='joints'));assert.deepEqual(s,before);
 const known=clone(s);known.sleep.nights=[night('2026-09-02',8)];const k=E.recoveryIndex(known);assert.equal(k.band,band);assert.deepEqual(r.flags,k.flags);assert.deepEqual(r.factors,k.factors);
 }
});

test('stalled lift with missing/stale sleep is REVIEW; adverse recovery or actual pain still RESET',()=>{
 const E=engine();for(const nights of [[],[night('2026-08-21',2)]]) {const s=withHistory();s.sleep.nights=nights;const r=E.liftCall(s,'press',{alarm:null});assert.equal(r.verdict,'REVIEW');assert.doesNotMatch(r.why,/recovery GREEN|green body/);}
 assert.equal(E.liftCall(watch(withHistory()),'press',{alarm:null}).verdict,'RESET');
 const pain=withHistory();pain.exercises[0].holdFlag=true;assert.equal(E.liftCall(pain,'press',{alarm:null}).verdict,'RESET');
 assert.equal(E.liftCall(withHistory(),'press',{alarm:{tier:'RED'}}).verdict,'STAND-DOWN');
});

test('phase break needs observed recovery or two other real cluster signals; UNKNOWN is not one',()=>{
 const E=decisions(engine()),s=withHistory();s.energy=['2026-08-29','2026-08-30','2026-08-31','2026-09-01'].map(d=>({d,v:1}));
 assert.equal(E.phaseProposal(s,phaseDeps),null);assert.equal(E.phaseProposal(watch(clone(s)),phaseDeps).apply.kind,'break');
 for(const d of ['2026-08-29','2026-08-30','2026-08-31'])s.dailyLogs[d]={cal:2600};assert.equal(E.phaseProposal(s,phaseDeps).apply.kind,'break');
});

function conversionState(){const s=withHistory();s.sessionLog['2026-08-20']={entries:[{id:'press',w:40,reps:[8],rir:2}]};return s;}
test('volume conversion does not subtract because UNKNOWN left GREEN; repeats/pain/adverse evidence still work',()=>{
 const E=decisions(engine()),s=conversionState();let r=E.volumeConversion(s,'press');assert.equal(r.status,'LIVE');assert.equal(r.subtract,false);assert.equal(r.tolerated,false);
 assert.equal(E.volumeConversion(watch(clone(s)),'press').subtract,true);
 const pain=clone(s);pain.exercises[0].holdFlag=true;assert.equal(E.volumeConversion(pain,'press').subtract,true);
 E.liftTrend=()=>({n:6,lo:-3,hi:-1,pct:-2});assert.equal(E.volumeConversion(s,'press').subtract,true);
});

test('volume push admits earned candidate under UNKNOWN, vetoes real WATCH/LOW and current sustained debt',()=>{
 const E=decisions(engine());E.volumeConversion=()=>({status:'IDLE'});
 const s=withHistory();assert.equal(E.volumePush(s).mode,'PUSH');assert.equal(E.volumePush(watch(clone(s))).veto,'recovery');assert.equal(E.volumePush(low(clone(s))).veto,'recovery');
 for(const h of [6]) {const current=clone(s);current.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>night(d,h));assert.equal(E.sleepMean3At(current,DAY),false);assert.equal(E.volumePush(current).mode,'WITHHELD');}
 const stale=clone(s);stale.sleep.nights=['2026-08-28','2026-08-29','2026-08-30'].map(d=>night(d,2));assert.equal(E.sleepMean3At(stale,DAY),true);assert.equal(E.volumePush(stale).mode,'PUSH');
});

test('unchanged stepPush preserves LOW/current-debt veto and admits UNKNOWN/stale debt',()=>{
 const E=decisions(engine()),s=withHistory();for(let d=20;d<=28;d++)s.dailyLogs['2026-08-'+d]={steps:6000};const options={accelerate:true,stepeff:{status:'COUNTING'}};assert.equal(E.stepPush(s,options).mode,'PUSH');assert.equal(E.stepPush(low(clone(s)),options).veto,'recovery');assert.equal(E.stepPush(watch(clone(s)),options).mode,'PUSH');
 const stale=clone(s);stale.sleep.nights=['2026-08-28','2026-08-29','2026-08-30'].map(d=>night(d,2));assert.equal(E.stepPush(stale,options).mode,'PUSH');
 const current=clone(s);current.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>night(d,6.8));assert.equal(E.stepPush(current,options).veto,'sleep');
});

test('sleep-mean freshness keeps valid current run and same-data day shift, never rewrites nights',()=>{
 const E=engine(),s=state();s.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>night(d,6));const before=clone(s);
 assert.equal(E.sleepMean3At(s,'2026-09-03'),false);assert.equal(E.sleepMean3At(s,'2026-09-04'),true);assert.deepEqual(s,before);
 s.sleep.nights=s.sleep.nights.map(n=>({...n,h:8}));assert.equal(E.sleepMean3At(s,DAY),true);
});

test('counterexample: old non-GREEN volume veto rejects an actual UNKNOWN candidate',()=>{
 const mutate=source=>source.replace('if (rec.band === "WATCH" || rec.band === "LOW") return { mode: "WITHHELD", veto: "recovery"','if (rec.band !== "GREEN") return { mode: "WITHHELD", veto: "recovery"');
 const bad=decisions(engine({writers:mutate}));bad.volumeConversion=()=>({status:'IDLE'});
 assert.equal(bad.recoveryIndex(withHistory()).band,'UNKNOWN');assert.equal(bad.volumePush(withHistory()).veto,'recovery');
 assert.throws(()=>assert.equal(bad.volumePush(withHistory()).mode,'PUSH'),assert.AssertionError);
});

test('historical short night still exempts its session; current unknown never claims last-night rest',()=>{
 const E=engine(),s=withHistory();s.sleep.nights=[night('2026-08-31',2)];const before=clone(s),r=E.liftCall(s,'press',{alarm:null});
 assert.equal(r.verdict,'PUSH+');assert.ok(r.receipts.some(t=>t.startsWith('1 of your last 4 ran on short sleep')));
 assert.ok(r.receipts.some(t=>t.startsWith('Sleep record 2026-08-31: 2 hours')));
 assert.doesNotMatch(r.why,/fed and slept|recovery GREEN/);assert.ok(!r.receipts.some(t=>t.startsWith('Last night:')));assert.deepEqual(s,before);
});

test('actual adaptive sweep preserves UNKNOWN/WATCH/LOW semantics and incomplete-evidence wording',()=>{
 for(const [make,band] of [[s=>s,'UNKNOWN'],[watch,'WATCH'],[low,'LOW']]) {
  const E=decisions(engine()),s=make(withHistory());E.currentRate=()=>({measured:false});
  s.proposals=[{rid:'recovery_2026-08-31',resolved:false}];const before=clone(s),r=E.runAdaptive(s,DAY);
  assert.equal(E.recoveryIndex(s).band,band);assert.deepEqual(s,before);
  assert.deepEqual(r.sessionLog,s.sessionLog);assert.deepEqual(r.sleep,s.sleep);
  const prior=r.proposals.find(p=>p.rid==='recovery_2026-08-31');
  if(band==='LOW') {assert.equal(prior.resolved,false);assert.match(r.feed.find(f=>f.t.startsWith('RECOVERY LOW')).how,/sleep evidence is incomplete/);}
  else {assert.equal(prior.stoodDown,true);assert.match(r.feed.find(f=>f.t==='RECOVERY CARD STOOD DOWN').how,/sleep evidence is incomplete/);}
  const earned=r.proposals.find(p=>p.title?.includes('EARNED VOLUME'));
  if(band==='UNKNOWN') {assert.ok(earned);assert.match(earned.why,/Current sleep has no reading/);assert.doesNotMatch(earned.why,/recovery GREEN|sleep mean clean/);}
  else assert.equal(earned,undefined);
 }
});

test('missing and stale sleep reach every semantic consumer with absence-only, WATCH and LOW',()=>{
 for(const nights of [[],[night('2026-08-21',2)]])for(const [make,band] of [[s=>s,'UNKNOWN'],[watch,'WATCH'],[low,'LOW']]) {
  const E=decisions(engine()),s=make(conversionState());s.sleep.nights=clone(nights);
  s.sessionLog['2026-08-18']={entries:[{id:'press',w:40,reps:[8,8],rir:2}]};
  const expectedAdverse=band!=='UNKNOWN';
  assert.equal(E.recoveryIndex(s).band,band);
  const lift=make(withHistory());lift.sleep.nights=clone(nights);lift.sessionLog['2026-08-18']={entries:[{id:'press',w:40,reps:[8,8],rir:2}]};
  assert.equal(E.liftCall(lift,'press',{alarm:null}).verdict,expectedAdverse?'RESET':'REVIEW');
  assert.equal(E.volumeConversion(s,'press').subtract,expectedAdverse);
  const phase=clone(s);phase.energy=['2026-08-29','2026-08-30','2026-08-31','2026-09-01'].map(d=>({d,v:1}));
  assert.equal(E.phaseProposal(phase,phaseDeps)?.apply.kind||null,expectedAdverse?'break':null);
  E.volumeConversion=()=>({status:'IDLE'});
  assert.equal(E.volumePush(s).veto||null,expectedAdverse?'recovery':null);
  for(let d=20;d<=28;d++)s.dailyLogs['2026-08-'+d]={steps:6000};
  assert.equal(E.stepPush(s,{accelerate:true,stepeff:{status:'COUNTING'}}).veto||null,band==='LOW'?'recovery':null);
  E.currentRate=()=>({measured:false});
  const swept=E.runAdaptive(s,DAY);
  assert.equal(swept.feed.some(f=>f.t.startsWith('RECOVERY LOW')),band==='LOW');
 }
});

test('counterexamples: each old non-GREEN semantic mapping invents an UNKNOWN restriction',()=>{
 const replace=(from,to)=>source=>{assert.ok(source.includes(from));return source.replace(from,to);};
 const lift=engine({sleep:replace("return recoveryBand9 === 'WATCH' || recoveryBand9 === 'LOW';","return recoveryBand9 !== 'GREEN';")});
 assert.equal(lift.liftCall(withHistory(),'press',{alarm:null}).verdict,'RESET');
 const vol=decisions(engine({volume:replace("const adverseRecovery9 = band9 === 'WATCH' || band9 === 'LOW';","const adverseRecovery9 = band9 !== 'GREEN';")}));
 assert.equal(vol.volumeConversion(conversionState(),'press').subtract,true);
 const phase=decisions(engine({policy:replace("const recOff = recoveryBand9 === 'WATCH' || recoveryBand9 === 'LOW';","const recOff = recoveryBand9 !== 'GREEN';")}));
 const s=withHistory();s.energy=['2026-08-29','2026-08-30','2026-08-31','2026-09-01'].map(d=>({d,v:1}));
 assert.equal(phase.phaseProposal(s,phaseDeps).apply.kind,'break');
});

test('counterexample: removing only the new freshness guard restores the actual stale volume sleep veto',()=>{
 const mutate=source=>{const line='  if (nights[nights.length - 1].d !== plusDays(iso, -1)) return true; // D8: old debt is history, not a current sleep veto.';assert.ok(source.includes(line));return source.replace(line,'');};
 const E=decisions(engine({sleep:mutate})),s=withHistory();s.sleep.nights=['2026-08-28','2026-08-29','2026-08-30'].map(d=>night(d,2));
 assert.equal(E.recoveryIndex(s).band,'UNKNOWN');assert.equal(E.volumePush(s).veto,'sleep');
});
