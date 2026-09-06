'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { lift, patch } = require('./helpers.cjs');
const through = (s, day) => ({ ...s, sessionLog: Object.fromEntries(Object.entries(s.sessionLog || {}).filter(([d]) => d <= day)) });
return  {
  defect: 'D7', theme: 'clock-and-as-of', family: 'progression',
  id: 'P-D7-anchor-and-trend-exclude-future-sessions', cite: 'REPORT-M2-1 D7; app.jsx @ fe516c1:983-985,3188-3191; progression.cjs:68-70,562-565', expect: 'GREEN',
  run(B) { const T = B.engine('2026-09-03'), ex = lift(), s = { exercises: [ex], sessionLog: {}, sleep: { nights: [] } }; for (const [i, d] of ['2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13'].entries()) s.sessionLog[d] = { entries: [{ id: ex.id, w: 100, reps: [8 + i, 7 + i] }] }; const anchor = T.progressAnchor(ex, s), trend = T.liftTrend(s, ex.id, { asOf: '2026-09-03' }), later = T.liftTrend(s, ex.id, { asOf: '2026-09-14' }); return { ok: JSON.stringify(anchor) === JSON.stringify(ex.last) && trend === null && later && later.n === 4, detail: { anchor, trend, laterCount: later && later.n } }; },
  control(B) { let C = patch(B, 'progressAnchor', (old, T) => (ex, s) => old(ex, through(s, T.isoOf(T.todayStart())))); return patch(C, 'liftTrend', (old, T) => (s, exId, opts) => old(through(s, opts && opts.asOf || T.isoOf(T.todayStart())), exId, opts)); },
  mutants: [{ name: 'as-of-restricts-era-but-not-session-dates', make(B) { let M = patch(B, 'progressAnchor', (old, T) => T.__auditOriginal.progressAnchor); return patch(M, 'liftTrend', (old, T) => T.__auditOriginal.liftTrend); } }]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return  {
  defect: 'D8', theme: 'clock-and-as-of', family: 'policy',
  id: 'D-D8-stale-sleep-does-not-claim-current-debt', cite: 'REPORT-M2-1 D8; app.jsx @ fe516c1:6994-7001; sleep.cjs:1009-1018', expect: 'GREEN',
  run(B) { const T = B.engine(), day = '2026-09-03'; const missing = T.cleanAtDate({ sleep: { nights: [] } }, day), stale = T.cleanAtDate({ sleep: { nights: [{ d: '2026-01-01', h: 5 }] } }, day), recentShort = T.cleanAtDate({ sleep: { nights: [{ d: '2026-09-02', h: 5 }] } }, day); return { ok: missing === true && stale === missing && recentShort === false, detail: { missing, stale, recentShort } }; },
  control(B) { return patch(B, 'cleanAtDate', (old, T) => (s, day) => { const yesterday = T.mk(day); yesterday.setDate(yesterday.getDate() - 1); const end = T.isoOf(yesterday), nights = ((s.sleep || {}).nights || []); return old({ ...s, sleep: { ...s.sleep, nights: nights.some((n) => n.d === end) ? nights : [] } }, day); }); },
  mutants: [{ name: 'last-logged-night-stands-in-for-last-calendar-night', make(B) { return patch(B, 'cleanAtDate', (old, T) => T.__auditOriginal.cleanAtDate); } }]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return  {
  defect: 'D9', theme: 'clock-and-as-of', family: 'engine',
  id: 'E-D9-split-selects-latest-effective-date', cite: 'REPORT-M2-1 D9; app.jsx @ fe516c1:660; plan.cjs:15', expect: 'GREEN',
  run(B) { const T = B.engine(), old = { from: '2026-08-01', map: { 4: 'L' } }, current = { from: '2026-09-01', map: { 4: 'U' } }, future = { from: '2026-09-10', map: { 4: 'L' } }; const ordered = T.dayType('2026-09-03', { split: [old, current, future] }), reversed = T.dayType('2026-09-03', { split: [future, current, old] }); return { ok: ordered === 'U' && reversed === ordered, detail: { ordered, reversed } }; },
  control(B) { return patch(B, 'dayType', (old) => (day, s) => old(day, { ...s, split: (s && s.split || []).slice().sort((a, b) => String(a && a.from || '').localeCompare(String(b && b.from || ''))) })); },
  mutants: [{ name: 'last-array-row-wins-effective-split', make(B) { return patch(B, 'dayType', (old, T) => T.__auditOriginal.dayType); } }]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return  {
  defect: 'D10', theme: 'clock-and-as-of', family: 'engine',
  id: 'E-D10-calendar-week-is-seven-calendar-dates', cite: 'REPORT-M2-1 D10; app.jsx @ fe516c1:306,311; dates.cjs:8,23', expect: 'GREEN',
  run(B) { const T = B.engine(), spring = T.weeksBetween('2026-03-08', '2026-03-15'), fall = T.weeksBetween('2026-11-01', '2026-11-08'), reverse = T.weeksBetween('2026-03-15', '2026-03-08'); return { ok: spring === 1 && fall === 1 && reverse === -1, detail: { spring, fall, reverse } }; },
  control(B) { return patch(B, 'weeksBetween', () => (a, b) => { const stamp = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return (stamp(b) - stamp(a)) / 604800000; }); },
  mutants: [{ name: 'calendar-week-count-divides-local-elapsed-hours', make(B) { return patch(B, 'weeksBetween', (old, T) => T.__auditOriginal.weeksBetween); } }]
};

})());

laws.push((()=>{
'use strict';
const { state, clone, patch } = require('./helpers.cjs');
return  {
  id: 'E-D15-session-frequency-does-not-change-with-food-row-density', defect: 'D15', theme: 'clock-and-as-of', family: 'engine',
  cite: 'src/app.jsx@fe516c1:4435-4437; rebuild/engine/energy.cjs:805-807; defect-witnesses-2.cjs D15', expect: 'GREEN',
  run(B) {
    const T = B.engine(), s = state();
    s.dailyLogs = {}; s.sessionLog = {};
    const dates = ['2026-08-14','2026-08-17','2026-08-20','2026-08-23','2026-08-26','2026-08-29','2026-09-01','2026-09-03'];
    for (const d of dates) { s.dailyLogs[d] = { cal: 2200, steps: 10000 }; s.sessionLog[d] = { entries: [{ id: 'example', reps: [8], w: 50 }] }; }
    const dense = clone(s);
    for (let i = 0; i < 21; i++) dense.dailyLogs[T.isoOf(new Date(T.mk('2026-08-14').getTime()+i*T.DAY))] = {cal:2200,steps:10000};
    const a = T.energyAvailability(s), b = T.energyAvailability(dense);
    return {ok: !a.gated && !b.gated && a.sessPerWk === b.sessPerWk, detail: 'Same sessions and observation interval must give the same weekly frequency despite additional identical food rows.'};
  },
  control: B => patch(B, 'energyAvailability', (old,T) => s => {
    const out = old(s); if (out.gated) return out;
    const today = T.isoOf(T.todayStart()), cutoff = T.isoOf(new Date(T.todayStart().getTime()-21*T.DAY));
    const dates = [...Object.keys(s.dailyLogs||{}),...Object.keys(s.sessionLog||{})].filter(d=>d>=cutoff&&d<=today).sort();
    const days = Math.max(7, Math.round((T.mk(today)-T.mk(dates[0]))/T.DAY)+1);
    const logged = Object.keys(s.sessionLog||{}).filter(d=>d>=cutoff&&d<=today).length/(days/7);
    let scheduled=0; for(let i=0;i<7;i++) if(['U','L'].includes(T.dayType(T.isoOf(new Date(T.todayStart().getTime()-i*T.DAY)),s))) scheduled++;
    return {...out,sessPerWk:+Math.max(logged,scheduled).toFixed(1)};
  }),
  mutants: [{name:'food-row-count-is-elapsed-weeks',make:B=>patch(B,'energyAvailability',(_old,T)=>T.__auditOriginal.energyAvailability)}]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return {
  id:'P-D19-inclusive-break-end-prose-agrees-with-active-day',defect:'D19',theme: 'clock-and-as-of',family:'policy',
  cite:'src/app.jsx@fe516c1:5559,5594,5605; rebuild/engine/policy.cjs:531,563,573; defect-witnesses-2.cjs D19',expect:'GREEN',
  run(B){const T=B.engine('2026-09-07'),s={plan:{brk:{start:'2026-09-01',end:'2026-09-07'}}},b=T.dietBreakState(s,{today:'2026-09-07'}),p=T.phaseArc(s,{today:'2026-09-07',brk:b,sup:{}});
    return{ok:b.status==='active'&&p.line.includes('day 7 of 7')&&p.line.includes('resumes '+T.fmtShort('2026-09-08'))&&p.next.when==='resumes '+T.fmtShort('2026-09-08'),detail:'An inclusive seven-day break calls its last active date day seven and resumes the following calendar date.'};},
  control:B=>patch(B,'phaseArc',(old,T)=>(s,deps)=>{const out=old(s,deps),b=deps&&deps.brk||T.dietBreakState(s,deps);if(out.key!=='break')return out;const next=T.mk(b.end);next.setDate(next.getDate()+1);const resume='resumes '+T.fmtShort(T.isoOf(next));return{...out,line:out.line.replace('day '+b.daysSince+' of','day '+(b.daysSince+1)+' of').replace('resumes '+T.fmtShort(b.end),resume),next:{...out.next,when:resume}};}),
  mutants:[{name:'zero-based-break-day-and-same-date-resumption',make:B=>patch(B,'phaseArc',(_old,T)=>T.__auditOriginal.phaseArc)}]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return {
  id:'E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date',defect:'D21',theme: 'clock-and-as-of',family:'engine',
  cite:'src/app.jsx@fe516c1:14455; rebuild/engine/sleep.cjs:1885; defect-witnesses-2.cjs D21',expect:'GREEN',
  run(B){const T=B.engine('2026-11-01'),s={sleep:{nights:[{d:'2026-11-01',h:1}],cleanH:7.5,needed:3}},r=T.sleepInfo(s);return{ok:r.clean===false&&r.clean===T.cleanAtDate(s,'2026-11-02'),detail:'Calendar tomorrow on a fall-back date must include the logged same-date night in the clean-sleep decision.'};},
  control:B=>patch(B,'sleepInfo',(old,T)=>s=>{const out=old(s),tomorrow=T.todayStart();tomorrow.setDate(tomorrow.getDate()+1);return{...out,clean:T.cleanAtDate(s,T.isoOf(tomorrow))};}),
  mutants:[{name:'tomorrow-is-exactly-twenty-four-hours-later',make:B=>patch(B,'sleepInfo',(_old,T)=>T.__auditOriginal.sleepInfo)}]
};

})());

laws.push((()=>{
'use strict';
const { state, lift, patch } = require('./helpers.cjs');
return {
  id:'E-D28-programme-volume-follows-the-current-effective-split',defect:'D28',theme: 'clock-and-as-of',family:'engine',
  cite:'src/app.jsx@fe516c1:8676,656-666; rebuild/engine/volume.cjs:64; defect-witnesses-4.cjs D28',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.exercises=[lift({id:'synthetic-press',sets:3})];s.split=[{from:'2026-08-01',map:{1:'U'}}];const dates=['2026-08-31','2026-09-01','2026-09-02','2026-09-03','2026-09-04','2026-09-05','2026-09-06'];const days=dates.filter(d=>T.dayType(d,s)==='U').length,out=T.programmeVolume(s).find(m=>m.mg==='chest');return{ok:days===1&&out.sets===days*s.exercises[0].sets,detail:'Designed weekly sets use the current effective training split.'};},
  control:B=>patch(B,'programmeVolume',(old,T)=>s=>{const map={};const monday=T.todayStart();monday.setDate(monday.getDate()-(monday.getDay()+6)%7);for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(d.getDate()+i);map[d.getDay()]=T.dayType(T.isoOf(d),s);}return old({...s,split:[{from:'1900-01-01',map}]});}),
  mutants:[{name:'programme-volume-uses-authored-july-week',make:B=>patch(B,'programmeVolume',(_old,T)=>T.__auditOriginal.programmeVolume)}]
};

})());

laws.push((()=>{
'use strict';
const {state,lift,clone,patch}=require('./helpers.cjs');
return {id:'V4-merge-earned-receipt-historical-asof',defect:'D37',theme: 'clock-and-as-of',family:'engine',cite:'D37; app.jsx @ fe516c1:14441,2493,2533,2163,2132',expect:'GREEN',
 run(B){const pair=['2026-08-28','2026-08-30'].map(d=>{const s=state();s.exercises=[lift({id:'synthetic_press',n:'Synthetic press',sets:2,hi:10,topAt:100,topRun:1})];s.sessionLog[d]={entries:[{id:'synthetic_press',w:100,reps:[10,10],rir:2,rirSets:[2,0]}]};s.feed=[{d,t:'SYNTHETIC PRESS — TOP OF WINDOW, PROVISIONAL',how:'Synthetic first sighting',op:'synthetic:'+d}];return s;});pair[0].exercises.push(lift({id:'synthetic_noise',n:'Synthetic noise',w:50,sets:2,hi:10,forks:[{from:'2026-09-01',kind:'technique',why:'Synthetic technique change'}]}));for(const[d,reps]of [['2026-08-20',[1,1]],['2026-08-21',[9,9]],['2026-08-22',[1,1]],['2026-08-23',[9,9]]])pair[0].sessionLog[d]={entries:[{id:'synthetic_noise',w:50,reps}]};const a=B.engine('2026-08-30').mergeState(...clone(pair)),b=B.engine('2026-09-03').mergeState(...clone(pair)),pick=s=>s.feed.find(f=>f.t==='SYNTHETIC PRESS 105 EARNED');if(!pick(a)||!pick(b))throw Error('D37 joint earn missing');return {ok:pick(a).d===pick(b).d&&pick(a).how===pick(b).how,detail:'The same historical joint earn must carry the same measured receipt at either wall date.'};},
 control(B){return patch(B,'mergeState',(old)=>function(a,b){const ds=[...Object.keys(a.sessionLog||{}),...Object.keys(b.sessionLog||{})].sort(),asOf=ds.at(-1);return B.engine(asOf).mergeState(a,b);});},
 mutants:[{name:'wall-day-noise-in-historical-earn',make:B=>patch(B,'mergeState',(_,T)=>T.__auditOriginal.mergeState)}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
