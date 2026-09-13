'use strict';
// PM246 public construction evidence. All states below are invented. No seed,
// historical fixture, frozen engine, native host, or protected test is loaded.
const assert = require('node:assert/strict');
const nodeTest = require('node:test');
const test = process.argv.includes('--audit-mutations') ? ()=>{} : nodeTest;
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
// Pin executable assembly and real context BEFORE importing either. Runtime
// source hashes are deliberately not child guards: faults must fail behavior.
for(const [file,digest]of [
  ['./b1b2-public-engine.cjs','0c6b82db2c05159e0ba29b677960eb1f9414ba0e14a794806d88d5984fbaa268'],
  ['../../m4/workout/native-trend-context.cjs','f300f3f2855f98781eadfbabf526d64ed32706f7e52f597b65d0fa6fcb50904a']]){
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,file))).digest('hex'),digest,'SETUP public executable pin '+file);
}
const H = require('./b1b2-public-engine.cjs');
const {createNativeTrendContextBinding,createDayFactsReader} = require('../../m4/workout/native-trend-context.cjs');
const lift = (o={}) => ({id:'public-lift',n:'Press',w:100,inc:5,sets:2,hi:10,last:[8,7],setup:'invented',day:'U',mg:'chest',...o});
const state = (ex=lift()) => ({...H.syntheticState(),exercises:[ex]});
const engine = (day='2026-09-03') => H.createEngine({clock:H.clockAt(day)});
test('D9 effective split order, ties, bounds and legacy controls',()=>{
  const E=engine(),map=x=>({0:x,1:x,2:x,3:x,4:x,5:x,6:x});
  const a={from:'2026-08-01',map:map('L')},b={from:'2026-09-01',map:map('U')},future={from:'2026-09-10',map:map('L')};
  for(const split of [[a,b],[b,a],[a,b,future],[future,b,a]])assert.equal(E.dayType('2026-09-03',{split}),'U');
  assert.equal(E.dayType('2026-09-03',{split:[b,{...b,map:map('L')}]}),'L');
  assert.equal(E.dayType('2026-09-03',{split:[b,{map:map('L')}]}),'U');
  assert.equal(E.dayType('2026-07-29'),'REFEED');
});
test('D2 finite positive integral validity and original valid control',()=>{
  const E=engine();for(const sets of [-1,0,3.5,NaN,Infinity])assert.equal(E._bornValid(lift({sets})),false);
  for(const hi of [0,-1,NaN,Infinity])assert.equal(E._bornValid(lift({hi})),false);
  assert.equal(E._bornValid(lift({sets:3,hi:10})),true);
});
test('D5 distinct rung minimum, sort and unchanged fallbacks',()=>{
  const E=engine(),ex=lift({steps:[100,100]});
  assert.equal(E.loadRungs(ex),null);assert.equal(E.parseRungs('100,100'),null);
  assert.equal(E.maxedOut(ex),false);assert.equal(E.nextLoad(ex),105);
  assert.deepEqual(E.loadRungs(lift({steps:[105,100,105]})),[100,105]);
  assert.deepEqual(E.parseRungs('105,100,105'),[100,105]);
  assert.equal(E.parseRungs(''),null);
});
test('D6 missing load stays absent while numeric zero keeps existing five',()=>{
  const E=engine();for(const w of [null,undefined,''])assert.equal(E.deloadLoad(lift({w})),null);
  assert.equal(E.deloadLoad(lift({w:0})),5);assert.equal(E.deloadLoad(lift({w:'100'})),95);
});
test('D3 exact volume owner, last suffix, former name and terminal identity',()=>{
  const E=engine(),ex=lift(),row=t=>({feed:[{d:'2026-09-01',t}]});
  for(const t of ['VOLUME +1 — CHEST via Press incline (now 3 sets)','VOLUME PASSED'])assert.deepEqual(E._volDeltas(ex,row(t)),[]);
  const named=lift({n:'Press (now heavy)'}),own='VOLUME +1 — CHEST via Press (now heavy)';
  for(const t of [own,own+' (now 3 sets)'])assert.deepEqual(E._volDeltas(named,row(t)),[['2026-09-01',1]]);
  // Accepted C6 bounded ambiguity: suffix-less inner delimiter admits both
  // exact names. The complete producer suffix below excludes the shorter name.
  assert.deepEqual(E._volDeltas(ex,row(own)),[['2026-09-01',1]]);
  assert.deepEqual(E._volDeltas(ex,row(own+' (now 3 sets)')),[]);
  assert.deepEqual(E._volDeltas(ex,{feed:[{d:'2026-09-01',t:'VOLUME +1 — CHEST via Other (now 3 sets)',exId:ex.id}]}),[['2026-09-01',1]]);
  assert.deepEqual(E._volDeltas(ex,{feed:[{d:'2026-09-01',t:'VOLUME +1 — CHEST via Press (now 3 sets)',exId:'unknown'}]}),[]);
  assert.deepEqual(E._volDeltas(lift({n:'New',renames:[{prevN:'Press'}]}),row('VOLUME +1 — CHEST via Press (now 3 sets)')),[['2026-09-01',1]]);
});
function structural(exercises,receipt,extra={}){return {...state(),exercises,feed:[{d:'2026-09-01',t:receipt}],...extra};}
test('Q2 fixed full owner matrix and D18 complete weekly feed',()=>{
  const E=engine(),receipt='VOLUME +1 — CHEST via Press incline (now 3 sets)';
  const short=lift({id:'short',n:'Press',mg:'back'}),inc=lift({id:'inc',n:'Press incline'});
  const owners=s=>E.structuralMovesThisWeek(s).sets.map(m=>m.exId);
  for(const n of [0,95]){const s=structural([short,inc],receipt);s.feed.unshift(...Array.from({length:n},(_,i)=>({d:'2026-09-01',t:'NOTE '+i})));const before=structuredClone(s);
    assert.deepEqual(owners(s),['inc']);assert.deepEqual(E.structuralMovesThisWeek(s).mgsTouched,['chest']);assert.deepEqual(s,before);}
  const now=lift({id:'now',n:'Press (now heavy)'});
  assert.deepEqual(owners(structural([short,now],'VOLUME +1 — CHEST via Press (now heavy) (now 3 sets)')),['now']);
  assert.deepEqual(owners(structural([now],'VOLUME +1 — CHEST via Press (now heavy)')),['now']);
  assert.deepEqual(owners(structural([inc], 'VOLUME +1 — CHEST via Press incline')),['inc']);
  const former=lift({id:'former',n:'Row',mg:'back',renames:[{prevN:'Bench'}]}),live=lift({id:'live',n:'Bench'});
  for(const xs of [[former,live],[live,former]]){
    const s=structural(xs,'VOLUME +1 — CHEST via Bench (now 3 sets)');assert.deepEqual(owners(s),['live']);
    s.feed[0].exId='former';assert.deepEqual(owners(s),['former']);s.feed[0].exId='unknown';assert.deepEqual(owners(s),[]);
  }
  assert.deepEqual(owners(structural([former],'VOLUME +1 — BACK via Bench (now 3 sets)')),['former']);
  const former2=lift({id:'former2',n:'Row two',renames:[{prevN:'Bench'}]});
  for(const xs of [[former,former2],[former2,former]])assert.deepEqual(owners(structural(xs,'VOLUME +1 — BACK via Bench (now 3 sets)')),[xs[0].id]);
  const numeric=structural([lift({id:7})],'VOLUME +1 — CHEST via unrelated (now 3 sets)');numeric.feed[0].exId='7';assert.deepEqual(owners(numeric),[7]);
  const empty=lift({id:'empty',n:'Press (now )'});
  // C6 retained legacy ambiguity: two exact LIVE names admit an empty suffix;
  // only the existing first matching live lift receives the structural move.
  for(const xs of [[short,empty],[empty,short]])assert.deepEqual(owners(structural(xs,'VOLUME +1 — CHEST via Press (now )')),[xs[0].id]);
  const stale=structural([inc],receipt);stale.feed[0].d='2026-08-30';assert.deepEqual(owners(stale),[]);
  const dup=structural([inc],receipt);dup.feed.push({...dup.feed[0]});assert.deepEqual(owners(dup),['inc']);
  assert.deepEqual(owners(structural([inc],'VOLUME PASSED')),[]);
});
test('D29 fractional indirect credit uses correct independent buckets',()=>{
  const s=state();s.exercises=[lift({id:'press',mg:'chest'}),lift({id:'front',mg:'delts',head:'delts_front'}),lift({id:'tri',mg:'triceps'}),lift({id:'coarse-control',mg:'delts'})];
  s.sessionLog={'2026-09-01':{entries:[{id:'press',w:100,reps:[10]}]}};
  const rows=engine().muscleVolume(s),front=rows.find(x=>x.mg==='delts_front'),tri=rows.find(x=>x.mg==='triceps');
  assert.ok(front,'front bucket must exist');assert.ok(tri,'triceps bucket must exist');assert.equal(front.n7,0.5);assert.equal(tri.n7,0.5);
  assert.equal(rows.some(x=>x.mg==='delts'),false,'no duplicated coarse bucket credit');
});
test('D28 actual Monday week and passed schedule including boundary change',()=>{
  const E=engine(),s=state();s.split=[{from:'2026-08-31',map:{0:'L',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'}},{from:'2026-09-06',map:{0:'U',1:'L',2:'L',3:'L',4:'L',5:'L',6:'L'}}];
  assert.equal(E.programmeVolume(s).find(x=>x.mg==='chest').sets,14);
  assert.equal(E.structuralMovesThisWeek(s).monday,'2026-08-31');
});
// Named source faults from accepted B2 v1.4 §1 and Q2. Each replacement is
// restricted to one declaration; source matching is setup, never a kill.
const FAULTS=[];
test('D4 exact earned receipt boundary, decimal loads and terminal identity',()=>{
  const E=engine(),ex=lift({hi:10,last:[10,9]}),s=state(ex);
  for(const d of ['2026-08-28','2026-08-30','2026-09-01'])s.sessionLog[d]={entries:[{id:ex.id,w:100,reps:[10,9]}]};
  const top=()=>E._deriveSightingFull(s,ex).topRun;
  assert.equal(top(),3);
  for(const text of ['PRESS INCLINE 100 EARNED','PRESS banana EARNED']){s.feed=[{d:'2026-09-01',t:text}];assert.equal(top(),3);}
  for(const text of ['PRESS 100 EARNED','PRESS 100.5 EARNED','PRESS .5 EARNED']){s.feed=[{d:'2026-09-01',t:text}];assert.equal(top(),0);}
  s.feed=[{d:'2026-09-01',t:'OTHER 100 EARNED',exId:ex.id}];assert.equal(top(),0);
  s.feed=[{d:'2026-09-01',t:'PRESS 100 EARNED',exId:'unknown'}];assert.equal(top(),3);
});
test('D7 explicit-asOf trend includes query day; absent-asOf keeps historical future behavior',()=>{
  const E=engine(),ex=lift(),s=state(ex);
  for(const [i,d]of ['2026-08-28','2026-08-30','2026-09-01','2026-09-03','2026-09-10'].entries())s.sessionLog[d]={entries:[{id:ex.id,w:100,reps:[8+i,7+i]}]};
  const explicit=E.liftTrend(s,ex.id,{asOf:'2026-09-03'});assert.ok(explicit,'query-inclusive four-session trend must exist');
  assert.deepEqual(explicit.pts.map(p=>p.d),['2026-08-28','2026-08-30','2026-09-01','2026-09-03']);
  assert.equal(E.liftTrend(s,ex.id).to,'2026-09-10');
  assert.deepEqual(E.progressAnchor(ex,s),[11,10]);
  // This public assertion does not execute or replace tools/engine-test.jsx:70.
});
function addLog(s,d,k,reps=10){s.sessionLog[d]={entries:[{id:s.exercises[0].id,w:100,reps:Array(k).fill(reps),rirSets:Array(k).fill(1)}]};}
test('D31 actual hard post-change block cannot reuse earlier tolerance',()=>{
  const E=engine(),ex=lift({sets:3}),s=state(ex);
  for(const [i,d]of ['2026-08-01','2026-08-05','2026-08-09','2026-08-13'].entries())addLog(s,d,2,8+i);
  addLog(s,'2026-09-01',3,12);s.events=[{d:'2026-09-01',t:'invented event'}];
  const got=E.volumeConversion(s,ex.id);assert.equal(got.status,'READING');assert.equal(got.changedAt,'2026-09-01');assert.equal(got.have,1);assert.equal('tier' in got,false);
  // Same trend count but all contributing dates precede a hard intervening
  // change: the independent date arm is required even when count matches.
  const t=state(ex);for(const [i,d]of ['2026-08-01','2026-08-05','2026-08-09','2026-08-13'].entries())addLog(t,d,3,8+i);
  addLog(t,'2026-08-30',2,12);addLog(t,'2026-09-01',3,12);t.events=[{d:'2026-08-30',t:'invented event'}];
  assert.equal(E.volumeConversion(t,ex.id).status,'READING');
  const good=state(ex);addLog(good,'2026-08-01',2,8);
  for(const [i,d]of ['2026-08-05','2026-08-12','2026-08-19','2026-08-26'].entries())addLog(good,d,3,9+i);
  assert.equal(E.volumeConversion(good,ex.id).status,'LIVE');
});
function replication(forks=[],priorDays=['2026-05-01','2026-05-15','2026-05-29','2026-06-26']){
  const ex=lift({sets:3,forks}),s=state(ex);
  priorDays.forEach((d,i)=>addLog(s,d,2,8+2*i));
  ['2026-07-01','2026-07-15','2026-07-29','2026-08-26'].forEach((d,i)=>addLog(s,d,3,8+2*i));
  return s;
}
test('D32 actual replication retains thresholds, inclusive era and query-side forks',()=>{
  const E=engine(),read=s=>E.volumeConversion(s,s.exercises[0].id);
  assert.equal(read(replication()).tier,'REPLICATED');
  assert.equal(read(replication([{from:'2026-07-01'}])).tier,'OUTCOME-COMPATIBLE');
  assert.equal(read(replication([{from:'2026-05-01'}])).tier,'REPLICATED');
  assert.equal(read(replication([{from:'2026-05-01'},{from:'2026-09-10'}])).tier,'REPLICATED');
  assert.equal(read(replication([],['2026-05-01','2026-05-29','2026-06-26'])).tier,'OUTCOME-COMPATIBLE');
  assert.equal(read(replication([],['2026-05-01','2026-05-08','2026-05-15','2026-05-22'])).tier,'OUTCOME-COMPATIBLE');
});
function fault(id,file,fn,from,to,pattern){FAULTS.push({id,file,fn,from,to,pattern});}
const P='plan.cjs',G='progression.cjs',V='volume.cjs';
fault('split-selection-returns-to-last-array-row',P,'dayType',' && (!ent || String(x.from) >= String(ent.from))','','D9');
fault('split-tie-prefers-first-array-row',P,'dayType','String(x.from) >= String(ent.from)','String(x.from) > String(ent.from)','D9');
fault('split-selection-drops-the-effective-date-bound',P,'dayType','x.from <= iso && ','','D9');
fault('numeric-type-admits-negative-count',P,'_bornValid','Number.isInteger(e.sets) && e.sets > 0','typeof e.sets === "number"','D2');
fault('integral-check-omits-positivity',P,'_bornValid',' && e.sets > 0','','D2');
fault('hi-ceiling-unchecked',P,'_bornValid','Number.isFinite(e.hi) && e.hi > 0','typeof e.hi === "number"','D2');
fault('first-array-bypasses-existing-authored-fit',G,'targetsFor','ex.first ? fitN(ex.first)','ex.first ? ex.first.slice()','D1');
fault('first-array-pads-but-never-truncates',G,'targetsFor','arr.slice(0, ex.sets)','arr.slice()','D1');
fault('first-array-padded-with-hi-minus-two',G,'targetsFor','_padFrom9(t9, ex.hi) - 1','ex.hi - 2','D1');
fault('first-fit-bypasses-the-native-governing-test',G,'targetsFor','!governingLast(ex, s)','!ex.last','D1');
fault('raw-rung-count-checked-before-deduplication',G,'loadRungs','u9.length < 2','r.length < 2','D5');
fault('dedupe-in-loadrungs-only',G,'parseRungs','u9.length >= 2','r.length >= 2','D5');
fault('dedupe-drops-the-sort',G,'loadRungs','[...new Set(r)].sort((a, b) => a - b)','[...new Set(r)]','D5');
fault('numeric-coercion-turns-absence-into-deload-five',G,'deloadLoad','if (ex.w == null || ex.w === "") return null;','if (false) return null;','D6');
fault('guard-omits-empty-string',G,'deloadLoad','ex.w == null || ex.w === ""','ex.w == null','D6');
fault('guard-also-rejects-zero',G,'deloadLoad','ex.w == null || ex.w === ""','!ex.w','D6');
fault('anchor-future-cut-omits-the-native-loop',G,'progressAnchor','if (row.d > atA) continue;','','D7');
fault('future-cut-is-inclusive-of-the-next-day',G,'liftTrend','d > atT','d >= atT','D7');
fault('as-of-restricts-era-but-not-session-dates',G,'liftTrend','if (opts && opts.asOf && d > atT) continue;','','D7');
fault('future-cut-applied-to-the-trend-only',G,'progressAnchor','if (days9[i] > atA) continue;','','D7');
fault('trend-future-cut-applied-without-a-supplied-asof',G,'liftTrend','opts && opts.asOf && d > atT','d > atT','D7');
fault('volume-owner-is-name-substring',G,'_volDeltas','own9 === n9 || tail9 === n9','tail9 !== null && tail9.includes(n9)','D3');
fault('volume-owner-is-name-prefix-of-the-via-tail',G,'_volDeltas','own9 === n9 || tail9 === n9','tail9 !== null && tail9.startsWith(n9)','D3');
fault('volume-owner-boundary-ignores-the-now-suffix',G,'_volDeltas','own9 === n9 || tail9 === n9','tail9 === n9','D3');
fault('volume-owner-trusts-exid-only',G,'_volDeltas','else {','else if (false) {','D3');
fault('earn-owner-is-unbounded-name-prefix',G,'_deriveSightingFull',' && /^ [-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+) EARNED$/.test(f9.t.slice(n9.length))','','D4');
fault('earn-boundary-accepts-any-tail',G,'_deriveSightingFull','/^ [-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+) EARNED$/','/^ .* EARNED$/','D4');
fault('earn-boundary-rejects-decimal-loads',G,'_deriveSightingFull','/^ [-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+) EARNED$/','/^ [-+]?\\d+ EARNED$/','D4');
fault('earn-owner-trusts-exid-only',G,'_deriveSightingFull','else for (const n9 of names9)','else for (const n9 of [])','D4');
fault('press-credit-goes-to-unreturned-coarse-delt-bucket',V,'muscleVolume','mg2 === "delts" ? "delts_front" : mg2','mg2','D29');
fault('indirect-credit-remaps-every-key-to-delts-front',V,'muscleVolume','mg2 === "delts" ? "delts_front" : mg2','"delts_front"','D29');
fault('indirect-credit-doubled-into-both-keys',V,'muscleVolume','by[k6] = (by[k6] || 0) + n6 * f2;','by[k6] = (by[k6] || 0) + n6 * f2; if (mg2 === "delts") by[mg2] = (by[mg2] || 0) + n6 * f2;','D29');
fault('indirect-credit-rounded-before-summing',V,'muscleVolume','+ n6 * f2','+ Math.round(n6 * f2)','D29');
fault('eighty-feed-lines-only',V,'structuralMovesThisWeek','(s.feed || []).forEach','(s.feed || []).slice(0,80).forEach','Q2');
fault('weekly-bound-dropped-with-the-prefix',V,'structuralMovesThisWeek',' || f.d < monday','','Q2');
fault('duplicate-moves-no-longer-deduped',V,'structuralMovesThisWeek','!moves.some((m) => m.kind === "sets" && m.exId === ex.id)','true','Q2');
fault('programme-volume-uses-authored-july-week',V,'programmeVolume','mk(isoOf(todayStart()))','mk("2026-07-27")','D28');
fault('programme-week-starts-on-sunday',V,'programmeVolume','((d9.getDay() + 6) % 7)','d9.getDay()','D28');
fault('programme-week-reads-the-next-week',V,'programmeVolume','mon9.getTime() + i * DAY','mon9.getTime() + (i+7) * DAY','D28');
fault('programme-week-ignores-the-split-argument',V,'programmeVolume','isoOf(new Date(mon9.getTime() + i * DAY)), s','isoOf(new Date(mon9.getTime() + i * DAY))','D28');
fault('reuse-pre-change-tolerance',V,'volumeConversion',' || t.k !== lastK || t.pts.some((p8) => p8.d < changedAt)','','D31');
fault('post-change-check-on-the-count-only',V,'volumeConversion',' || t.pts.some((p8) => p8.d < changedAt)','','D31');
fault('post-change-check-on-the-dates-only',V,'volumeConversion',' || t.k !== lastK','','D31');
fault('post-change-check-is-inclusive-of-the-prior-day',V,'volumeConversion','p8.d < changedAt','p8.d < isoOf(new Date(mk(changedAt).getTime() - DAY))','D31');
fault('compare-earlier-technique-block',V,'volumeConversion',' && g9.every((p8) => sameEra(fk2, p8.d, at2))','','D32');
fault('replication-era-checked-on-the-block-start-only',V,'volumeConversion','g9.every((p8) => sameEra(fk2, p8.d, at2))','sameEra(fk2, g9[0].d, at2)','D32');
fault('replication-era-uses-the-latest-stored-fork',V,'volumeConversion','at2 = isoOf(todayStart())','at2 = fk2.length ? fk2[fk2.length - 1].from : isoOf(todayStart())','D32');
fault('replication-era-excludes-the-inclusive-boundary',V,'volumeConversion','sameEra(fk2, p8.d, at2)','sameEra(fk2, p8.d, at2) && !fk2.some(f => f.from === p8.d)','D32');
fault('replication-threshold-relaxed-with-the-era-cut',V,'volumeConversion','/ DAY >= REVIEW_OUTCOME_D','/ DAY >= 0','D32');
fault('volume-owner-returns-to-substring',V,'structuralMovesThisWeek','own9 === n9 || tail9 === n9','tail9 !== null && tail9.includes(n9)','Q2');
fault('volume-owner-splits-at-the-FIRST-now',V,'structuralMovesThisWeek','tail9.lastIndexOf(" (now ")','tail9.indexOf(" (now ")','Q2');
fault('volume-owner-trusts-exid-only-Q2',V,'structuralMovesThisWeek',': (xs9.find((x) => owns9(String((x && x.n) || ""))) || xs9.find((x) => _formerNames(x).some(owns9)))',': null','Q2');
fault('volume-owner-drops-the-no-suffix-tail',V,'structuralMovesThisWeek','own9 === n9 || tail9 === n9','own9 === n9','Q2');
fault('volume-owner-drops-the-former-name-term',V,'structuralMovesThisWeek',' || xs9.find((x) => _formerNames(x).some(owns9))','','Q2');
fault('volume-owner-drops-the-live-name-tier',V,'structuralMovesThisWeek','xs9.find((x) => owns9(String((x && x.n) || ""))) || ','','Q2');
// §1.6 names multi-site faults: apply their complete original guard removals.
FAULTS.find(f=>f.id==='as-of-restricts-era-but-not-session-dates').additional=[
  {fn:'progressAnchor',from:'if (row.d > atA) continue;',to:''},
  {fn:'progressAnchor',from:'if (days9[i] > atA) continue;',to:''}];
FAULTS.find(f=>f.id==='future-cut-applied-to-the-trend-only').additional=[
  {fn:'progressAnchor',from:'if (row.d > atA) continue;',to:''}];
FAULTS.find(f=>f.id==='dedupe-drops-the-sort').additional=[
  {fn:'parseRungs',from:'[...new Set(r)].sort((a, b) => a - b)',to:'[...new Set(r)]'}];
function replaceFault(source,f){
  const begin=source.indexOf('function '+f.fn+'(');assert.ok(begin>=0,'SETUP declaration '+f.fn);
  let end=source.indexOf('\n// Copied',begin);if(end<0)end=source.length;
  const body=source.slice(begin,end);assert.equal(body.split(f.from).length-1,1,'SETUP exact source site '+f.id);
  let out=source.slice(0,begin)+body.replace(f.from,f.to)+source.slice(end);
  for(const part of f.additional||[])out=replaceFault(out,{...part,id:f.id});
  return out;
}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function audit(){
  const repo=path.resolve(__dirname,'../../..');
  const files=H.PUBLIC_MODULES.map(n=>'rebuild/engine/'+n).concat(['rebuild/engine/index.cjs','rebuild/engine/test/b1b2-public-engine.cjs','rebuild/m4/workout/native-trend-context.cjs','rebuild/engine/test/b2-public-source-faults.test.cjs']);
  assert.equal(files.length,19);assert.equal(new Set(files).size,19);
  H.inspectClosure(); // Text-only index and closed public factory requires.
  const context=fs.readFileSync(path.join(repo,files[17]),'utf8');
  assert.doesNotMatch(context,/\brequire\s*\(|\bimport\s*\(|readFile|fetch\s*\(/,'SETUP context closure');
  assert.equal(sha(context),'f300f3f2855f98781eadfbabf526d64ed32706f7e52f597b65d0fa6fcb50904a','SETUP public context pin');
  const manifest=Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(repo,f)))]));
  fs.mkdirSync(path.join(repo,'.tmp'),{recursive:true});
  const dir=fs.mkdtempSync(path.join(repo,'.tmp/b2-fault-'));
  for(const f of files){const to=path.join(dir,f);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(repo,f),to);}
  const restored=()=>{for(const f of files)assert.equal(sha(fs.readFileSync(path.join(dir,f))),manifest[f],'RESTORATION '+f);};
  restored();
  const child=path.join(dir,'rebuild/engine/test/b2-public-source-faults.test.cjs');
  const env={...process.env};for(const k of ['NODE_OPTIONS','NODE_PATH','NODE_V8_COVERAGE'])delete env[k];
  const run=pattern=>spawnSync(process.execPath,['--test','--test-reporter=tap',...(pattern?['--test-name-pattern','^'+pattern]:[]),child],{cwd:dir,encoding:'utf8',env,windowsHide:true,timeout:30000,maxBuffer:8*1024*1024});
  const initial=run();assert.equal(initial.status,0,'SETUP full positive\n'+initial.stdout);
  fs.writeFileSync(path.join(dir,'positive-initial.tap'),initial.stdout+initial.stderr);
  const results=[];
  for(const f of FAULTS){const target=path.join(dir,'rebuild/engine',f.file),before=fs.readFileSync(target);let outcome='SETUP';
    if(['post-change-check-on-the-dates-only','post-change-check-is-inclusive-of-the-prior-day','replication-era-checked-on-the-block-start-only'].includes(f.id)){
      results.push({id:f.id,outcome:'HELD'});console.log('B2 SOURCE FAULT '+f.id+' HELD pending dependency-fixture scope');continue;
    }
    try{const positive=run(f.pattern);assert.equal(positive.status,0,'SETUP positive '+f.id+'\n'+positive.stdout);
      fs.writeFileSync(target,replaceFault(before.toString('utf8'),f));const r=run(f.pattern);
      outcome=r.status!==0&&/code: 'ERR_ASSERTION'/.test(r.stdout)&&!/(?:SyntaxError|ReferenceError|TypeError|SETUP|PUBLIC_ENGINE_DENIED)/.test(r.stdout)?'BEHAVIORAL_KILL':r.status===0?'SURVIVED':'SETUP';
      fs.writeFileSync(path.join(dir,f.id+'.tap'),r.stdout+r.stderr);
    }catch(e){console.log('FAULT SETUP '+f.id+' '+e.message);}
    finally{fs.writeFileSync(target,before);restored();const p=run(f.pattern);assert.equal(p.status,0,'RESTORED POSITIVE '+f.id);}
    const logfile=path.join(dir,f.id+'.tap');results.push({id:f.id,outcome,logSHA256:fs.existsSync(logfile)?sha(fs.readFileSync(logfile)):null});console.log('B2 SOURCE FAULT '+f.id+' '+outcome);
  }
  const final=run();assert.equal(final.status,0,'RESTORED FULL POSITIVE\n'+final.stdout);restored();
  fs.writeFileSync(path.join(dir,'positive-final.tap'),final.stdout+final.stderr);
  const evidence={manifest,results,initialLogSHA256:sha(initial.stdout+initial.stderr),finalLogSHA256:sha(final.stdout+final.stderr),restored:true};
  fs.writeFileSync(path.join(dir,'audit.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log('PUBLIC CLOSURE '+sha(JSON.stringify(manifest))+'; EVIDENCE '+sha(fs.readFileSync(path.join(dir,'audit.json')))+'; '+dir);
  console.log('B2 PUBLIC SOURCE FAULTS: '+results.length+' catalogued; '+results.filter(x=>x.outcome==='BEHAVIORAL_KILL').length+' behavioral kills; '+results.filter(x=>x.outcome==='SURVIVED').length+' survived; '+results.filter(x=>x.outcome==='SETUP').length+' setup; '+results.filter(x=>x.outcome==='HELD').length+' held; exact restoration and fresh positives.');
  if(results.some(x=>x.outcome!=='BEHAVIORAL_KILL'))process.exitCode=1;
}
if(process.argv.includes('--audit-mutations'))audit();
function facts(rows) {
  const sessions=rows.map(([d,reps],n)=>{
    const start='public-start-'+n,lineage='public-lift';
    const entry={profile:'earned/performed-lift/v1',start_op_id:start,lift_lineage_id:lineage,
      completion:{op_id:start+'-complete',kind:'normal',status:'stored-on-this-device'},
      slots:reps.map((value,i)=>{const slot=JSON.stringify([lineage,i+1]);return {position:i+1,logical_set_slot:slot,state:value===null?'unlogged':'performed',
        ...(value===null?{}:{fact:{included:true,source_op_id:start+'-set-'+i,logical_set_slot:slot,lift_lineage_id:lineage,
          source_status:'stored-on-this-device',current_status:'stored-on-this-device',edit_op_ids:[],issues:[],current:{load:{unit:'lb',value:100},reps:{unit:'rep',value}}}})};})};
    return {start_op_id:start,effective:{local_date:d},record:{entries:[entry]}};
  });
  return {profile:'earned/workout-facts/v1',source_revision:1,sessions,order:{profile:'earned/workout-order/v1',frontier:sessions.length,start_ids:sessions.map(x=>x.start_op_id)}};
}
function native(s,day='2026-09-03',fault) {
  let dayReader;
  const binding=createNativeTrendContextBinding({dayFacts:iso=>dayReader.dayFacts(iso)});
  const resolver=fault=== 'missing'?undefined:fault?request=>fault(binding.resolve(request),request):binding.resolve;
  const engine=H.createEngine({clock:H.clockAt(day),ids:{fresh:()=> 'public-unused-id'},nativeTrendContext:resolver});
  dayReader=createDayFactsReader({state:s,engine});
  return {engine,run:fn=>binding.withFacts(s.workoutFacts,()=>fn(engine)),binding};
}
test('D1 fixed first-line fit and native no-surviving-line semantics',()=>{
  const T=H.createEngine({clock:H.clockAt('2026-09-03')});
  assert.deepEqual(T.targetsFor(lift({std:[6,5],sets:3}),state()),[6,5,4]);
  assert.deepEqual(T.targetsFor(lift({reclaim:[5,4],sets:3}),state()),[5,4,3]);
  const fit=lift({first:[8,7],last:null});const output=T.targetsFor(fit,state(fit));assert.deepEqual(output,[8,7]);assert.notEqual(output,fit.first);
  assert.deepEqual(T.targetsFor(lift({last:null}),state()),[8,8]);
  assert.deepEqual(T.targetsFor(lift({last:[14,13,13],hi:15,sets:3}),state()),[14,14,13]);
  for(const [sets,expected] of [[3,[8,7,6]],[1,[8]]]){
    const ex=lift({last:null,first:[8,7],sets});assert.deepEqual(T.targetsFor(ex,state(ex)),expected);
    const cached=lift({last:[12,11],first:[8,7],sets}),s=state(cached);s.workoutFacts=facts([['2026-09-01',[null,null]]]);
    native(s).run(E=>assert.deepEqual(E.targetsFor(cached,s),expected));
  }
});
test('D7 native earlier/current/future date bounds and query advance',()=>{
  const ex=lift(),s=state(ex);s.workoutFacts=facts([['2026-08-31',[8,7]],['2026-09-03',[9,8]],['2026-09-10',[13,12]]]);
  native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[9,8]));
  native(s,'2026-08-31').run(E=>assert.deepEqual(E.progressAnchor(ex,s),[8,7]));
  native(s,'2026-09-10').run(E=>assert.deepEqual(E.progressAnchor(ex,s),[13,12]));
});
test('R3 native future-only anchor is empty, never cached or future evidence',()=>{
  const ex=lift({last:[7,6]}),s=state(ex);s.workoutFacts=facts([['2026-09-10',[13,12]]]);
  native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[]));
  native(s,'2026-09-03','missing').run(E=>assert.deepEqual(E.progressAnchor(ex,s),[]));
});
test('D7 actual native trend query bounds preserve no-asOf and causal same-day order',()=>{
  const ex=lift(),s=state(ex),days=['2026-08-28','2026-08-30','2026-09-01','2026-09-03','2026-09-10'];
  s.workoutFacts=facts(days.map((d,i)=>[d,[8+i,7+i]]));
  native(s).run(E=>{const result=E.liftTrend(s,ex.id,{asOf:'2026-09-03'});assert.ok(result);assert.deepEqual(result.pts.map(p=>p.d),days.slice(0,4));assert.equal(E.liftTrend(s,ex.id).to,'2026-09-10');});
  s.workoutFacts=facts([['2026-09-03',[9,8]],['2026-09-03',[10,9]]]);
  native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[10,9]));
  s.workoutFacts.order.start_ids.reverse();native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[9,8]));
});
test('native same-day reset refuses both consumers; before/after retain positives',()=>{
  for(const method of ['targetsFor','progressAnchor']){
    const ex=lift({last:null,first:[8,7]}),s=state(ex);s.workoutFacts=facts([['2026-09-01',[9,8]]]);
    s.feed=[{d:'2026-09-01',t:'RESET APPLIED — Press'}];
    native(s).run(E=>assert.throws(()=>E[method](ex,s),{code:'PROGRESSION_RESET_MAPPING_REQUIRED'}));
  }
  const ex=lift({last:null,first:[8,7]}),s=state(ex);s.workoutFacts=facts([['2026-08-31',[9,8]]]);s.feed=[{d:'2026-09-01',t:'RESET APPLIED — Press'}];
  native(s).run(E=>assert.deepEqual(E.targetsFor(ex,s),[8,7]));
  s.workoutFacts=facts([['2026-09-02',[9,8]]]);native(s).run(E=>assert.deepEqual(E.progressAnchor(ex,s),[9,8]));
});
test('actual native resolver fails closed on missing, mismatched, throwing, nonboolean and pace',()=>{
  const faults=['missing',a=>({...a,source_revision:2}),a=>({...a,start_op_id:'different-start'}),a=>({...a,effective:{...a.effective,local_date:'2026-01-01'}}),()=>{throw Error('invented refusal');},...['hard','rushed','debt'].map(k=>a=>({...a,[k]:null}))];
  for(const fault of faults){const ex=lift(),s=state(ex);s.workoutFacts=facts([['2026-09-01',[9,8]]]);
    native(s,'2026-09-03',fault).run(E=>assert.throws(()=>E.progressAnchor(ex,s),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'}));}
  const ex=lift(),s=state(ex);s.workoutFacts=facts([['2026-09-01',[9,8]]]);s.workoutFacts.sessions[0].pace='unknown-invented-value';
  native(s).run(E=>assert.throws(()=>E.progressAnchor(ex,s),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'}));
  s.workoutFacts.sessions[0].pace='normal';s.workoutFacts.sessions[0].record.pace='rushed';
  native(s).run(E=>assert.throws(()=>E.progressAnchor(ex,s),{code:'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'}));
});
