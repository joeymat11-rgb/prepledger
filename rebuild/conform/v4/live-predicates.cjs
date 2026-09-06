'use strict';
// Pure verdict predicates; this file never loads or prints ledger data.
const predicates={};
Object.assign(predicates,(()=>{
'use strict';
// Predicates read only the supplied snapshot. They return verdict booleans, never data.
const names = (T, ex) => T._formerNames(ex);
// Remove a receipt only after its full, longest known current/former name proves
// a distinct owner. Unrecognized historical prose is not proof of a collision.
function distinctOwner(s, T, ex, text, kind) {
  const candidates = (s.exercises || []).filter(Boolean).flatMap((x) => names(T, x).map((n) => ({ id: x.id, name: kind === 'earn' ? n.toUpperCase() : n })));
  const body = kind === 'volume' ? text.slice(text.indexOf('via ') + 4) : text.slice(0, -' EARNED'.length);
  const matches = candidates.filter(({ name }) => {
    if (kind === 'volume') return body === name || (body.startsWith(name) && /^ \(now [-+]?\d+ sets\)$/.test(body.slice(name.length)));
    if (!body.startsWith(name + ' ')) return false;
    const load = body.slice(name.length + 1); return load.trim() !== '' && Number.isFinite(Number(load));
  });
  if (!matches.length) return false;
  const longest = Math.max(...matches.map((m) => m.name.length));
  const owners = matches.filter((m) => m.name.length === longest);
  return !owners.some((m) => m.id === ex.id) && owners.some((m) => m.id !== ex.id);
}
const wholeVolumeFeed = (s, T, ex) => (s.feed || []).filter((f) => !f || typeof f.t !== 'string' || !f.t.startsWith('VOLUME ') || !f.t.includes('via ') || !distinctOwner(s, T, ex, f.t, 'volume'));
const wholeEarnFeed = (s, T, ex) => (s.feed || []).filter((f) => !f || typeof f.t !== 'string' || !/ EARNED$/.test(f.t) || !distinctOwner(s, T, ex, f.t, 'earn'));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const active = (s, T) => (s.exercises || []).filter((ex) => ex && T.exActive(s, ex.id));
const calendarWeeks = (a, b) => { const stamp = (d) => { const p = d.split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]); }; return (stamp(b) - stamp(a)) / 604800000; };
return  {
  D1(s, T) { return active(s, T).some((ex) => !ex.last && !ex.std && !ex.reclaim && Array.isArray(ex.first) && Number.isInteger(ex.sets) && ex.sets > 0 && ex.first.length !== ex.sets); },
  D2(s, T) { return (s.exercises || []).some((ex) => ex && T._bornValid(ex) && (!Number.isInteger(ex.sets) || ex.sets <= 0 || !Number.isFinite(ex.hi) || ex.hi <= 0)); },
  D3(s, T) { return active(s, T).some((ex) => !equal(T._volDeltas(ex, s), T._volDeltas(ex, { ...s, feed: wholeVolumeFeed(s, T, ex) }))); },
  D4(s, T) { return active(s, T).some((ex) => !equal(T.deriveSighting(s, ex), T.deriveSighting({ ...s, feed: wholeEarnFeed(s, T, ex) }, ex))); },
  D5(s, T) { return active(s, T).some((ex) => { const rungs = T.loadRungs(ex); return rungs !== null && rungs.length < 2; }); },
  D6(s, T) { return active(s, T).some((ex) => (ex.w == null || ex.w === '') && T.deloadLoad(ex) !== null); },
  D7(s, T, today) { const earlier = { ...s, sessionLog: Object.fromEntries(Object.entries(s.sessionLog || {}).filter(([day]) => day <= today)) }; return active(s, T).some((ex) => !equal(T.progressAnchor(ex, s), T.progressAnchor(ex, earlier)) || !equal(T.liftTrend(s, ex.id, { asOf: today }), T.liftTrend(earlier, ex.id, { asOf: today }))); },
  D8(s, T, today) { if (!Array.isArray((s.sleep || {}).nights)) return 'NOT APPLICABLE (sleep record shape is invalid; see D22)'; const nights = T.nightsBefore(s, today); if (!nights.length) return false; const yesterday = T.mk(today); yesterday.setDate(yesterday.getDate() - 1); return nights[nights.length - 1].d < T.isoOf(yesterday) && T.cleanAtDate(s, today) === false; },
  D9(s, T, today) { const qualifying = (s.split || []).filter((x) => x && x.from && x.from <= today); if (!qualifying.length) return false; const newest = qualifying.slice().sort((a, b) => a.from.localeCompare(b.from)).pop(), dow = T.mk(today).getDay(); if (!newest.map) return false; const expected = ['U', 'L'].includes(newest.map[dow]) ? newest.map[dow] : 'REST'; return T.dayType(today, s) !== expected; },
  D10(s, T, today) { const pairs = []; const weekly = s.weekly || []; for (let i = 1; i < weekly.length; i++) if (weekly[i - 1].wk && weekly[i].wk) pairs.push([weekly[i - 1].wk, weekly[i].wk]); if (s.model && s.model.anchorISO) pairs.push([s.model.anchorISO, today]); return pairs.some(([a, b]) => Math.abs(T.weeksBetween(a, b) - calendarWeeks(a, b)) > 1e-10); },
  D11(s, T) { const out = T.observedTDEE(s); return !!out && ((out.lo != null && out.hi != null && out.lo > out.hi) || (out.stepDelta === 0 && out.stepPromoted === true)); },
  D12(s, T) { const out = T.stepEfficacy(s); return out.slopePer1k != null && Number.isFinite(out.slopePer1k) && out.slopePer1k !== 0; },
  D13() { return 'NOT APPLICABLE (needs a write between two cached reads of the same object)'; },
  D14(s, T) { if (s.model && s.model.drip != null) return false; const out = T.currentRate(s); return out.measured && !Number.isFinite(out.fat); }
};

})());
Object.assign(predicates,(()=>{
'use strict';
// This module receives the locally regenerated ledger; it never loads, serializes,
// prints, edits or stores the ledger. Each predicate returns only a verdict input.
const calendarAdd=(T,d,n)=>{const x=T.mk(d);x.setDate(x.getDate()+n);return T.isoOf(x);};
return {
 D15(s,T,today){
   const out=T.energyAvailability(s);if(out.gated)return false;
   const cutoff=calendarAdd(T,today,-21);
   const dates=[...Object.keys(s.dailyLogs||{}),...Object.keys(s.sessionLog||{})].filter(d=>d>=cutoff&&d<=today).sort();
   if(!dates.length)return false;
   const days=Math.max(7,Math.round((T.mk(today)-T.mk(dates[0]))/T.DAY)+1);
   const logged=Object.keys(s.sessionLog||{}).filter(d=>d>=cutoff&&d<=today).length/(days/7);
   let scheduled=0;for(let i=0;i<7;i++)if(['U','L'].includes(T.dayType(calendarAdd(T,today,-i),s)))scheduled++;
   return out.sessPerWk!==+Math.max(logged,scheduled).toFixed(1);
 },
 D16(s,T){
   const reads=(s.reads||[]).filter(r=>r&&r.d).slice().sort((a,b)=>a.d<b.d?-1:1);
   return (s.forecasts||[]).filter(f=>f&&f.d&&!f.sealed&&typeof f.pred7==='number').some(f=>{
     const due=calendarAdd(T,f.d,7),latest=calendarAdd(T,due,1),r=reads.find(r=>r.d>=due&&r.pt!=null);
     return !!r&&(r.d>latest||r.sealed||r.offWindow);
   });
 },
 D17(s,T){const rows=(s.adjustments||[]).filter(a=>a&&a.rid&&/^(ap_|apauto_)/.test(String(a.rid))).slice(-8);const out=T.trackRecord(s).decisions;return rows.some((a,i)=>a.undone&&out[i]&&out[i].applied);},
 D18(s,T){const out=T.structuralMovesThisWeek(s);return(s.feed||[]).slice(80).some(f=>{if(!f||!f.t||!f.d||f.d<out.monday||!f.t.startsWith('VOLUME '))return false;const ex=(s.exercises||[]).find(x=>f.t.includes('via '+x.n));return!!ex&&!out.sets.some(m=>m.exId===ex.id);});},
 D19(s,T,today){const b=T.dietBreakState(s,{today});if(b.status!=='active')return false;const p=T.phaseArc(s,{today,brk:b});return p.line.includes('day '+b.daysSince+' of')||p.next.when==='resumes '+T.fmtShort(b.end);},
 D20(){return'NOT APPLICABLE (needs an earlier cached read followed by a write to the same in-memory state)';},
 D21(s,T,today){const tomorrow=calendarAdd(T,today,1),fixed=T.isoOf(new Date(T.mk(today).getTime()+T.DAY));return tomorrow!==fixed&&T.sleepInfo(s).clean!==T.cleanAtDate(s,tomorrow);},
 D22(s,T){if(Array.isArray(s.sleep&&s.sleep.nights))return false;try{T.recoveryIndex(s);return false;}catch(e){if(e.name!=='TypeError'||e.message!=='(((s || {}).sleep || {}).nights || []).filter is not a function')throw e;return true;}},
 D23(s,T,today){let first=null;for(let i=0;i<7;i++){const d=calendarAdd(T,today,i);if(['U','L'].includes(T.dayType(d,s))){first=d;break;}}if(!first)return false;const session=T.genSession(s,first,T.sleepInfo(s)),out=T.nowModel(s,{});return!!session&&out.workout.title==='REST DAY';},
 D24(s,T,today){const y=calendarAdd(T,today,-1),row=(s.dailyLogs||{})[y];return!!row&&row.cal==null&&T.owedLedger(s,12).some(x=>x.k==='day'&&x.d===y)&&!T.nowFocus(s,12).owed.some(x=>x.k==='yesterday');},
 D25(s,T){const p=T.fiveLevers(s).protein;return p.state==='good'&&/^0\/[1-9]/.test(p.detail);},
 D26(){return'NOT APPLICABLE (needs a cached Today read before a calendar rollover)';},
 D27(s,T){return T.phaseArc(s).key!=='cut'&&T.theOneFix(s).rung==='break';},
 D28(s,T,today){const start=T.mk(today);start.setDate(start.getDate()-(start.getDay()+6)%7);const per={};for(let i=0;i<7;i++){const d=new Date(start);d.setDate(d.getDate()+i);const dt=T.dayType(T.isoOf(d),s);per[dt]=(per[dt]||0)+1;}const by={};const add=(k,n)=>{if(k)by[k]=(by[k]||0)+n;};for(const ex of s.exercises||[]){if(!T.exActive(s,ex.id)||!ex.sets)continue;const n=ex.sets*(per[ex.day]||0);add(ex.head||ex.mg,n);for(const[k,f]of Object.entries(T.INDIRECT[ex.id]||{}))add(k==='delts'?'delts_front':k,n*f);}const observed=Object.fromEntries(T.programmeVolume(s).map(m=>[m.mg,m.sets]));return[...new Set([...Object.keys(by),...Object.keys(observed)])].some(k=>(observed[k]||0)!==+(by[k]||0).toFixed(1));},
 D29(s,T,today){if(!(s.exercises||[]).some(ex=>T.exActive(s,ex.id)&&(ex.head||ex.mg)==='delts_front'))return false;const front=T.muscleVolume(s).find(m=>m.mg==='delts_front');const expected=(lo,hi)=>Object.entries(s.sessionLog||{}).reduce((sum,[d,sl])=>{const age=(T.mk(today)-T.mk(d))/T.DAY;if(age<lo||age>=hi)return sum;return sum+(sl.entries||[]).reduce((n,en)=>{const ex=(s.exercises||[]).find(ex=>ex.id===en.id);if(!ex||!(ex.head||ex.mg))return n;return n+(en.reps||[]).length*((ex.head||ex.mg)==='delts_front'?1:0)+(en.reps||[]).length*((T.INDIRECT[en.id]||{}).delts||0);},0);},0);return(front?.n7||0)!==+expected(0,7).toFixed(1)||(front?.p7||0)!==+expected(7,14).toFixed(1);},
 D30(s,T,today){return(s.exercises||[]).some(ex=>{const forks=T.forksOf(s,ex.id),out=T.setOneRead(s,ex.id);if(out.status!=='LIVE')return false;return Object.entries(s.sessionLog||{}).some(([d,sl])=>{if(T.sameEra(forks,d,today)||T.paceRushed(sl))return false;const en=(sl.entries||[]).find(en=>en.id===ex.id);if(!en||!en.reps||!en.reps.length||String(en.w)!==String(ex.w))return false;return !T.dayWeather(s,d).hardSession;});});}
};

})());
Object.assign(predicates,(()=>{
'use strict';
// Called privately with a locally regenerated snapshot and a today-clock engine.
// Never prints or returns a private value; booleans become verdict labels upstream.
const canonical=value=>JSON.stringify((function sort(v){if(Array.isArray(v))return v.map(sort);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])]));return v;})(value));
return {
 D31(s,T){return (s.exercises||[]).some(ex=>{const r=T.volumeConversion(s,ex.id);return r.status==='LIVE'&&r.trend&&Array.isArray(r.trend.pts)&&r.trend.pts.length>0&&r.trend.pts.every(p=>p.d<r.changedAt);});},
 D32(s,T,today){return (s.exercises||[]).some(ex=>{const r=T.volumeConversion(s,ex.id);if(r.tier!=='REPLICATED')return false;const seq=[];for(const d of Object.keys(s.sessionLog||{}).sort()){const en=(s.sessionLog[d].entries||[]).find(e=>e.id===ex.id);if(en)seq.push({d,k:(en.reps||[]).length,en});}const blocks=[];for(const p of seq){if(!blocks.length||blocks.at(-1).at(-1).k!==p.k)blocks.push([]);blocks.at(-1).push(p);}blocks.pop();const qualifying=blocks.filter(g=>g.length>=T.TREND_MIN_SESSIONS&&(T.mk(g.at(-1).d)-T.mk(g[0].d))/T.DAY>=T.REVIEW_OUTCOME_D&&(T._blockSlope(g)||{}).lo>0);const forks=T.forksOf(s,ex.id);return qualifying.length>0&&qualifying.every(g=>g.some(p=>!T.sameEra(forks,p.d,today)));});},
 D33(){return 'NOT APPLICABLE (needs a proposed write that removes a set or replaces a read day)';},
 D34(s,T){return T.isPristineSeed(s)&&canonical([s.reads,s.sleep?.nights,s.dailyLogs,s.sessionLog])!==canonical([T.SEED.reads,T.SEED.sleep?.nights,T.SEED.dailyLogs,T.SEED.sessionLog]);},
 D35(s,T){if(s.v<=T.SCHEMA_V)return 'NOT APPLICABLE (needs a newer-schema import)';return !s.sleep||!s.sleep.nights||!s.reads||!s.dailyLogs||!s.sessionLog;},
 D36(s){if(s.v>=60)return 'NOT APPLICABLE (needs the pre-v60 migration input)';const e=(s.exercises||[]).find(e=>e.id==='curl'),q=(s.queue||[]).find(q=>q.id==='q_curl_grad'&&!q.done);return Boolean(e&&q&&typeof e.w==='string'&&e.w.includes('·')&&e.w!=='55·55·50');},
 D37(){return 'NOT APPLICABLE (needs two replicas merged at different clocks)';},
 D38(){return 'NOT APPLICABLE (needs a merge of a written trial decision with another replica)';},
 D39(){return 'NOT APPLICABLE (needs a dismissed offer and its stale replica)';},
 D40(){return 'NOT APPLICABLE (needs two replicas with conflicting same-day entries)';},
 D41(s){return (s.exercises||[]).some(e=>typeof e.w==='number'&&Array.isArray(e.wSets)&&e.wSets.length>0&&e.wSets[0]!==e.w);},
 D42(){return 'NOT APPLICABLE (needs a break approval and undo sequence to attribute the remaining seal)';},
 D43(s,T){let attributionMissing=false;for(const e of s.exercises||[]){const meta=e.lastMeta,rec=s.sessionLog?.[meta?.d],row=(rec?.entries||[]).find(r=>r.id===e.id);if(!meta||!row||typeof meta.w!=='number'||row.w===meta.w)continue;const corr=rec.corrLog||[],loadCorrection=!!row.wCorrAt||corr.some(c=>{const to=Array.isArray(c.to)?c.to:[c.to];return to.some(t=>t&&t.id===e.id&&Object.hasOwn(t,'w'));}),unattributedCorrection=!!rec.corr&&!corr.length;const ownReceipt=(s.feed||[]).some(f=>f.d===meta.d&&T._formerNames(e).some(n=>String(f.t||'').startsWith(n.toUpperCase()))&&/OWNED/.test(f.t));if(loadCorrection||unattributedCorrection||!ownReceipt){attributionMissing=true;continue;}return true;}return attributionMissing?'NOT APPLICABLE (needs the original completion input to distinguish a later correction or another writer)':false;},
 D44(){return 'NOT APPLICABLE (needs accepting a one-set removal offer)';},
 D45(s,T){return /terminal RIR gates every earn \(0 blocks it\)/.test(T.askContext(s));}
};

})());
module.exports=predicates;
