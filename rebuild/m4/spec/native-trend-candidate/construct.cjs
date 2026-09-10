'use strict';
// Prospective source edits only. The installed engine and browser API stay unchanged.
const assert=require('node:assert/strict');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Unique native-trend edit: '+a);return s.replace(a,b);};
module.exports=function construct(factory,progression){
 factory=once(factory,'module.exports=function createPerformed(){','module.exports=function createPerformed(E,{nativeTrendContext}={}){');
 factory=once(factory,' const performedHistoryRows=s=>performedHistory(s,true);',` function trendUnavailable(code,reason,start){
  const error=new Error(code);error.code=code;error.reason=reason;error.start_op_id=start;throw error;
 }
 function performedTrendContext(s,row){
  const unavailable=reason=>trendUnavailable('PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED',reason,row.start_op_id);
  const session=s.workoutFacts.sessions.find(x=>x.start_op_id===row.start_op_id);
  const revision=s.workoutFacts.source_revision;
  if(!session||!Number.isSafeInteger(revision)||revision<1)unavailable('source_binding_missing');
  const request={start_op_id:row.start_op_id,source_revision:revision,effective:structuredClone(session.effective)};
  if(typeof nativeTrendContext!=='function')unavailable('resolver_missing');
  let answer;try{answer=structuredClone(nativeTrendContext(structuredClone(request)));}catch(_){unavailable('resolver_failed');}
  const effective=answer?.effective,expected=request.effective;
  if(answer?.start_op_id!==request.start_op_id||answer?.source_revision!==revision||
    !effective||Object.keys(effective).length!==Object.keys(expected).length||
    !Object.keys(expected).every(k=>Object.hasOwn(effective,k)&&effective[k]===expected[k])||
    !['hard','rushed','debt'].every(k=>typeof answer[k]==='boolean'))unavailable('context_binding_or_flags_invalid');
  return {hard:answer.hard,rushed:answer.rushed,debt:answer.debt};
 }
 function performedTrendObservation(s,row,entry){
  const rich=performedEntry(entry);if(!rich||rich.start_op_id!==row.start_op_id)invalid();
  const unavailable=reason=>trendUnavailable('PERFORMED_NATIVE_TREND_UNAVAILABLE',reason,row.start_op_id);
  if(rich.slots.some(slot=>slot.state==='unresolved'))unavailable('unresolved_slots');
  performedNumericEntry(rich); // Configured magnitude retains its own explicit code.
  const k=rich.slots.filter(slot=>slot.state==='performed').length;
  if(!k)unavailable('no_performed_observations');
  const sc=E.sessionScore(rich);
  if(sc===null)unavailable(rich.slots.some(slot=>slot.state==='performed'&&slot.fact.current.reps.value>0)?'numeric_work_out_of_range':'zero_work_rule_unqualified');
  return {sc,k,...performedTrendContext(s,row)};
 }
 const performedHistoryRows=s=>performedHistory(s,true);`);
 factory=once(factory,'return {performedEntry,','return {performedTrendContext,performedTrendObservation,performedEntry,');
 // Isolate edits to the named functions. The statistical suffixes remain literal.
 const start=progression.indexOf('function liftTrend(s, exId, opts) {');
 const middle=progression.indexOf('function progressionTrend(s) {',start);
 const end=progression.indexOf('\nreturn {\n  progressStep,',middle);
 assert(start>=0&&middle>start&&end>middle);
 let lift=progression.slice(start,middle),pool=progression.slice(middle,end);
 lift=once(lift,'  const days = Object.keys(log).sort();',`  const rows = s?.workoutFacts ? E.performedHistoryRows(s) : Object.keys(log).sort().map(d=>({d,rec:log[d],source:'legacy'}));`);
 lift=once(lift,'  for (const d of days) {', '  for (const row of rows) {\n    const {d}=row;');
 lift=once(lift,'    const rec = log[d] || {};\n    const en = (rec.entries || []).find((e) => e && e.id === exId);',`    const rec = row.rec || {};
    const native = row.source === 'performed';
    const en = (rec.entries || []).find((e) => e && (native ? e.lift_lineage_id : e.id) === exId);`);
 lift=once(lift,'    const sc = sessionScore(en);','    const observation = native ? E.performedTrendObservation(s,row,en) : null;\n    const sc = native ? observation.sc : sessionScore(en);');
 lift=once(lift,'    try { hard = !!dayWeather(s, d).hardSession;', '    if(native){({hard,rushed,debt}=observation);}else{\n    try { hard = !!dayWeather(s, d).hardSession;');
 lift=once(lift,'    try { debt = !cleanAtDate(s, d); } catch (e) { debt = false; }','    try { debt = !cleanAtDate(s, d); } catch (e) { debt = false; }\n    }');
 lift=once(lift,'    pts.push({ d, y: sc, soft: rushed || debt, k: ((en.reps || []).length) });',`    pts.push({ d, y: sc, soft: rushed || debt, k: native ? observation.k : ((en.reps || []).length), ...(native?{start_op_id:row.start_op_id}:{}) });`);
 lift=once(lift,'resetAt: cutAt > 0 ? series[0].d : null };',`resetAt: cutAt > 0 ? series[0].d : null, ...(cutAt>0&&series[0].start_op_id?{reset_start_op_id:series[0].start_op_id}:{}) };`);
 pool=once(pool,'  const days = Object.keys(log).sort();',`  const rows = s?.workoutFacts ? E.performedHistoryRows(s) : Object.keys(log).sort().map(d=>({d,rec:log[d],source:'legacy'}));`);
 pool=once(pool,'  for (const d of days) for (const e of (log[d].entries || [])) if (e && e.id && seen.indexOf(e.id) < 0) seen.push(e.id);',`  for(const row of rows)for(const e of (row.rec.entries||[])){
    const id=row.source==='performed'?e.lift_lineage_id:e?.id;
    if(id&&seen.indexOf(id)<0)seen.push(id);
  }`);
 pool=once(pool,'  const trends = [];',`  const setAsideWorkouts=[];
  for(const row of rows)if(row.source==='performed'&&E.performedTrendContext(s,row).hard){
    setAsideWorkouts.push({d:row.d,start_op_id:row.start_op_id});
    if(!setAsideDays.includes(row.d))setAsideDays.push(row.d);
  }
  const trends = [];`);
 pool=once(pool,'    for (const d of days) {\n      const en = (log[d].entries || []).find((e) => e && e.id === id);',`    for (const row of rows) {
      const native=row.source==='performed';
      const en = (row.rec.entries || []).find((e) => e && (native?e.lift_lineage_id:e.id) === id);`);
 pool=once(pool,'      if (sessionScore(en) != null) { scored = true; break; }',`      if ((native?E.performedTrendObservation(s,row,en).sc:sessionScore(en)) != null) { scored = true; break; }`);
 pool=once(pool,'lifts: trends };','lifts: trends, ...(s?.workoutFacts?{setAsideWorkouts}:{}) };');
 return {factory,progression:progression.slice(0,start)+lift+pool+progression.slice(end)};
};
