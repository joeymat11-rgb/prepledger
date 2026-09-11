'use strict';
// NATIVE-NEXT-TARGETS candidate (correction-01, rev173 N2) — exact literal source delta over the accepted
// generated engine preimage (ENGINE-COMPOSITION-v089, NATIVE-TREND-ACCEPTED).
// construct(accepted) returns the candidate texts for the six owned engine
// sources plus their before/after pins. Every edit is a unique literal
// replacement; a missing or duplicated anchor fails loudly. The candidate
// files in rebuild/engine are exactly construct()'s output (asserted by the
// joined test). No installed engine, seed, migrate or merge is touched.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const ACCEPTED={
 'rebuild/engine/performed.cjs':'0cf083e1b89e6af086cc78d5f6014adb97acf48cce5c0ae7656fe6f5ca7af596',
 'rebuild/engine/progression.cjs':'7bb7d75a64a603f5c327b336d00c35f7f5dbc70eeaaecd4eadc651a6d94a70c1',
 'rebuild/engine/today.cjs':'af4c65d2998c2fd588d6251a220262db5395e7ca5410ad36fe314826a04cbe0d',
 'rebuild/engine/plan.cjs':'2b834933ce0b93164064a7be36462f68683eb48a31d57c17a41cd81ed32c45b7',
 'rebuild/engine/sleep.cjs':'2dde4a082ba72d61f0c1cfa3c98fa8c9038d639ce5349078023874ae29cc0407',
 'rebuild/engine/writers.cjs':'fdb4baa2f1a2e5149e0204f0d5607d0e05eb25bd1abd6d0b5da59ecb6ed1672d',
};
const OWNED=Object.keys(ACCEPTED);
// Expected behavior changes, published before the candidate ran (report §2).
const EXPECTED=Object.freeze([
 'performed: performedStepWhy names the actual state of an original hole (a skipped, an unlogged, a removed or an unresolved original position) before the final original set in its why text; performedLine/performedLoadMatches enumerate the contiguous performed prefix of the ORIGINAL positions of a typed entry and compare each performed load with the applicable current prescribed vector position in its own domain; positions never compact; an original hole ends the prefix; added positions never enter it and never end it.',
 'progression: with a registered native view (s.workoutFacts) the governing last line, last metadata and eligible anchor derive from performedHistoryRows (causal order) instead of the exercise.last/lastMeta cache; a contradictory cache never wins; removing the latest contributor recomputes from remaining evidence; legacy-only inputs are unchanged.',
 'progression: native rows require the nativeTrendContext resolver for rushed/debt; missing/mismatched context stays an explicit PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED refusal, never a default flag.',
 'progression: native rows dated on a RESET APPLIED day are an unproved cross-reset mapping and refuse with PROGRESSION_RESET_MAPPING_REQUIRED; rows before the reset never undo the consented null last; rows after it set the line.',
 'progression: targetsFor/progressStep/progressionSetCount/_loadTenure read the same source-owned helpers; std/reclaim precedence and the fit-to-set-count rule are unchanged; the progression-bearing count uses the performed prefix length.',
 'today: genSession reads the governing last line/metadata through the shared helpers for the debut, reallocation, ladder, runway and prev outputs; legacy-only cards are byte-identical.',
 'plan: eraFresh also sees native sessions of the same era through performedHistoryRows, so a first native session under a new era is no longer "fresh"; an added-only session of the lift (no original position) does not end freshness; legacy-only inputs are unchanged.',
 'sleep: bodyAlarmSignal is the shared detection/tier extraction; bodyAlarm calls it and keeps its full presentation (canary/lab details); liftCall\'s default alarm path reads the signal only; explicit opts.alarm is unchanged.',
 'writers: rirPlan floors the terminal set from bodyAlarmSignal; no presentation, lab or HISTORY reach on the alarm branch; every completion/adaptive writer body is unchanged.',
 'performed/progression/writers (rev173 N2): an added position (added-slot candidate, origin "added", appended after every original position) is a fact of the session and never determines the original progression-bearing count, the opener/terminal effort, the step or its why; performedOriginalRirSets carries the original-position efforts to progressStep and to the hot-opener count; performedRirSets, rirSetsOf and every receipt keep mapping every slot (added included) for history display; a session holding only added positions for a lift has no original line and stays non-eligible; the why names added sets as recorded after the original positions and never calls an added slot removed or unresolved.',
]);
function once(text,before,after){assert.equal(text.split(before).length,2,'Exact unique source edit: '+before.slice(0,80));return text.replace(before,after);}
function construct(accepted){
 for(const file of OWNED){assert.equal(typeof accepted[file],'string','Accepted source '+file);assert.equal(sha(accepted[file]),ACCEPTED[file],'Accepted preimage pin '+file);}
 const out={...accepted},changes=[];
 const edit=(file,before,after)=>{out[file]=once(out[file],before,after);changes.push({file,before,after});};
 // ---------------------------------------------------------------- performed
 const P='rebuild/engine/performed.cjs';
 // rev173 N2 — an added position (added-slot candidate: origin 'added', appended
 // after every original position of the lift) is a fact of the session, never an
 // original prescribed position. The original line, the progression-bearing
 // count and the step effort read the original positions only; added facts stay
 // on the history through performedRirSets/receipts, which map every slot.
 edit(P,` function performedRirSets(entry){
  const value=performedEntry(entry);if(!value)return null;
  return value.slots.map(slot=>slot.state==='performed'?effort(slot.fact.current.reserve):{tag:slot.state==='unlogged'?'absent':slot.state});
 }`,` const original=slot=>slot.origin!=='added';
 const originalSlots=rich=>rich.slots.filter(original);
 const slotEffort=slot=>slot.state==='performed'?effort(slot.fact.current.reserve):{tag:slot.state==='unlogged'?'absent':slot.state};
 function performedRirSets(entry){
  const value=performedEntry(entry);if(!value)return null;
  return value.slots.map(slotEffort);
 }
 // Effort ratings of the ORIGINAL positions only, in position order: the vector
 // progressStep's opener/terminal rule and the hot-opener count read. An added
 // position's effort never enters it, whatever its value.
 function performedOriginalRirSets(entry){
  const value=performedEntry(entry);if(!value)return null;
  return originalSlots(value).map(slotEffort);
 }`);
 edit(P,` const performedHistoryRows=s=>performedHistory(s,true);`,` // Contiguous performed prefix of the ORIGINAL positions of a typed entry: the
 // line the anchor and the progression-bearing count may read. A skipped,
 // unlogged, removed or unresolved original position ends the prefix; positions
 // are never compacted and no hole is filled with zero. 'beyond' says whether
 // original performed evidence exists past the prefix; 'originals' counts the
 // original positions and 'added' the added positions, which never enter the
 // line and never end it, whatever their state.
 function performedLine(entry){
  const rich=performedEntry(entry);if(!rich)return null;
  const reps=[];let beyond=false,stop=null,added=0,originals=0;
  for(const slot of rich.slots){
   if(!original(slot)){added++;continue;}
   originals++;
   if(stop===null){
    if(slot.state==='performed'){reps.push(slot.fact.current.reps.value);continue;}
    stop=slot.state;
   }
   if(slot.state==='performed')beyond=true;
  }
  return {reps,positions:reps.length,originals,stop,beyond,added};
 }
 // Compare each performed prefix load with the applicable current prescribed
 // vector position in its own domain: numeric pounds against a finite number,
 // configuration text against the same configuration key. Mixed domains, a
 // missing position or any other prescribed value never match; a vector is
 // never scalarised or averaged and equal text is never a magnitude.
 function performedLoadMatches(entry,prescribed){
  const line=performedLine(entry);if(!line||!Array.isArray(prescribed))return false;
  const originals=originalSlots(performedEntry(entry));
  for(let i=0;i<line.positions;i++){
   const actual=originals[i].fact.current.load,want=prescribed[i];
   if(typeof want==='number'&&Number.isFinite(want)){if(!(actual.unit==='lb'&&typeof actual.value==='number'&&actual.value===want))return false;}
   else if(typeof want==='string'&&want.length){if(!(actual.kind==='configuration'&&actual.configuration_key===want))return false;}
   else return false;
  }
  return line.positions>0;
 }
 const performedHistoryRows=s=>performedHistory(s,true);`);
 // Explicit mapping for a non-prefix ORIGINAL hole: the step rule may still
 // read the final original set's own rating, but the why names the actual
 // state of the unavailable position instead of pretending the line was
 // complete. No value is invented for the hole. Added positions are named as
 // recorded after the original positions and never as removed or unresolved.
 edit(P,` function performedStepWhy(entry,role){
  const rich=performedEntry(entry);if(!rich)invalid();const values=performedRirSets(rich),last=rich.slots.at(-1);`,` function performedStepWhy(entry,role){
  const rich=performedEntry(entry);if(!rich)invalid();const originals=originalSlots(rich),values=originals.map(slotEffort),last=originals.at(-1);
  const line=performedLine(rich),holeState={skipped:'A skipped',unlogged:'An unlogged',removed:'A removed',unresolved:'An unresolved'};
  const hole=line.beyond?\` \${holeState[line.stop]} original position sits before the final set; only the performed positions before it anchor the line, and the hole supplies no value.\`:'';
  const added=line.added?\` \${line.added} added \${line.added===1?'set was':'sets were'} recorded after the original positions; \${line.added===1?'it does':'they do'} not size this step.\`:'';
  if(!originals.length)return \`No original prescribed position was captured for this lift in that session, so no opener or final-set rating sizes this step; the current rule uses its default step proposal.\${added}\`;`);
 edit(P,`  if(owns(terminalRoles,role))return \`final set reported \${effortText(values.at(-1))} reps left; \${target}. The current rule selects \${terminalRoles[role]} step proposal from this rating.\`;`,`  if(owns(terminalRoles,role))return \`final set reported \${effortText(values.at(-1))} reps left; \${target}. The current rule selects \${terminalRoles[role]} step proposal from this rating.\${hole}\${added}\`;`);
 edit(P,`  if(owns(openerRoles,role))return \`opener reported \${effortText(values[0])} reps left. \${values.length===1?'For this single-set workout the current rule uses the opener rating.':'The captured final set has no usable effort rating for this rule.'} This produces \${openerRoles[role]} step proposal.\`;`,`  if(owns(openerRoles,role))return \`opener reported \${effortText(values[0])} reps left. \${values.length===1?'For this single-set workout the current rule uses the opener rating.':'The captured final set has no usable effort rating for this rule.'} This produces \${openerRoles[role]} step proposal.\${hole}\${added}\`;`);
 edit(P,`  if(role==='no-rating')return 'Neither the opener nor the captured final set supplies the effort rating used by this rep-step rule. Other recorded sets remain on the history; the current rule uses its default step proposal.';`,`  if(role==='no-rating')return \`Neither the opener nor the captured final set supplies the effort rating used by this rep-step rule. Other recorded sets remain on the history; the current rule uses its default step proposal.\${hole}\${added}\`;`);
 edit(P,`return {performedTrendContext,performedTrendObservation,performedEntry,`,`return {performedLine,performedLoadMatches,performedOriginalRirSets,performedTrendContext,performedTrendObservation,performedEntry,`);
 // -------------------------------------------------------------- progression
 const G='rebuild/engine/progression.cjs';
 edit(G,`// Copied from frozen src/app.jsx @ fe516c1:970-995.
function progressAnchor(ex, s) {`,`/* NATIVE-NEXT-TARGETS — ONE source-owned governing read. With a registered
   native view (s.workoutFacts) the values the prescription reads come from the
   factual history in its established causal order (E.performedHistoryRows),
   never from the exercise.last/lastMeta cache. Three consumer rules stay
   separate: latest factual metadata (governingMeta), the eligible anchor line
   (progressAnchor: same era, not rushed, same load at every performed
   position) and the progression-bearing count (_loadTenure). Legacy-only
   inputs (no workoutFacts) keep every original read byte for byte. */
function _nativeView(s) { return !!(s && s.workoutFacts); }
function _rowsFor(s, exId) {
  const rows = [];
  for (const row of E.performedHistoryRows(s)) {
    const native = row.source === "performed";
    const en = ((row.rec || {}).entries || []).find((e) => e && (native ? e.lift_lineage_id : e.id) === exId);
    if (!en) continue;
    rows.push({ d: row.d, source: row.source, start_op_id: row.start_op_id, rec: row.rec, en, native });
  }
  return rows;
}
function _lineOf(row) {
  if (row.native) { const line = E.performedLine(row.en); return line ? line.reps.slice() : []; }
  return Array.isArray(row.en.reps) ? row.en.reps.slice() : [];
}
function _prescribedLoads(ex) {
  return Array.from({ length: Math.max(1, ex.sets || 1) }, (_, i) => (Array.isArray(ex.wSets) && ex.wSets[i] != null ? ex.wSets[i] : ex.w));
}
function _rowAtCurrentLoad(row, ex) {
  if (row.native) return E.performedLoadMatches(row.en, _prescribedLoads(ex));
  if (typeof ex.w === "number") return String(row.en.w) === String(ex.w);
  return row.en.wKey === String(ex.w);
}
function _rowRushed(s, row) { return row.native ? E.performedTrendContext(s, row).rushed : paceRushed(row.rec); }
function _rowDebt(s, row) {
  if (row.native) return E.performedTrendContext(s, row).debt;
  try { return !cleanAtDate(s, row.d); } catch (e) { return false; }
}
/* A consented reset writes ex.last = null and a dated RESET APPLIED feed line.
   Rows after that day set the line again; rows before it never undo the reset;
   a row ON that day is an unproved cross-reset mapping and refuses. */
function _resetAfter(ex, s) {
  const names9 = _formerNames(ex).map((n9) => "RESET APPLIED — " + n9);
  let at = null;
  for (const f9 of ((s && s.feed) || [])) {
    if (!f9 || typeof f9.t !== "string" || !names9.some((n9) => f9.t.indexOf(n9) === 0) || !f9.d) continue;
    if (at == null || String(f9.d) > at) at = String(f9.d);
  }
  return at;
}
/* Rows for this lift under the registered view. When the history carries no
   row of any source for the lift, the imported cache is the undisputed
   baseline and stands. Once any row exists (a removed native session still
   counts as a row), the rows alone decide: a stale or contradictory cache is
   never revived, and a removed contributor is recomputed from what remains. */
function _governingRows(ex, s) {
  const all = _rowsFor(s, ex.id);
  if (!all.length) return null;
  const rows = all.filter((row) => _lineOf(row).length);
  if (ex.last !== null) return rows;
  const at = _resetAfter(ex, s);
  if (at == null) return rows;
  if (rows.some((row) => String(row.d) === at)) { const e = new Error("PROGRESSION_RESET_MAPPING_REQUIRED"); e.code = e.message; e.reset_at = at; throw e; }
  return rows.filter((row) => String(row.d) > at);
}
function governingLast(ex, s) {
  if (!_nativeView(s)) return ex.last;
  const rows = _governingRows(ex, s);
  if (rows === null) return ex.last;
  return rows.length ? _lineOf(rows[rows.length - 1]) : null;
}
function governingMeta(ex, s) {
  if (!_nativeView(s)) return ex.lastMeta;
  const rows = _governingRows(ex, s);
  if (rows === null) return ex.lastMeta;
  if (!rows.length) return null;
  const row = rows[rows.length - 1];
  if (row.native) return row.en;
  const en = row.en;
  return { d: row.d, w: en.w, reps: en.reps.slice(), rir: en.rir ?? null, rirSets: rirSetsOf(en), debt: _rowDebt(s, row) };
}

// Copied from frozen src/app.jsx @ fe516c1:970-995.
function progressAnchor(ex, s) {`);
 edit(G,`  const base = (ex.last || []).slice();
  if (!s || !base.length) return base;
  const numericCfg = typeof ex.w === "number";
  const days9 = Object.keys(s.sessionLog || {}).sort();
  const fkA = forksOf(s, ex.id);
  const atA = isoOf(todayStart());
  for (let i = days9.length - 1; i >= 0; i--) {`,`  const base = (governingLast(ex, s) || []).slice();
  if (!s || !base.length) return base;
  const numericCfg = typeof ex.w === "number";
  const fkA = forksOf(s, ex.id);
  const atA = isoOf(todayStart());
  if (_nativeView(s)) {
    const rows = _governingRows(ex, s) || [];
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      if (!sameEra(fkA, row.d, atA)) continue;
      if (_rowRushed(s, row)) continue;
      if (!_rowAtCurrentLoad(row, ex)) continue;
      return _lineOf(row);
    }
    return base;
  }
  const days9 = Object.keys(s.sessionLog || {}).sort();
  for (let i = days9.length - 1; i >= 0; i--) {`);
 edit(G,`function _loadTenure(ex, s, ref, fks) {
  const all9 = [];
  for (const d9 of Object.keys((s && s.sessionLog) || {}).sort()) {`,`function _loadTenure(ex, s, ref, fks) {
  const all9 = [];
  if (_nativeView(s)) {
    /* native view: the same rows, in causal order, each carrying its performed
       prefix as the line; the tenure is the suffix at the current load vector */
    for (const row of _rowsFor(s, ex.id)) {
      const d9 = row.d, line9 = _lineOf(row);
      if (ref != null && d9 > String(ref)) continue;
      if (fks && fks.length && !sameEra(fks, d9, ref)) continue;
      if (line9.length) all9.push([d9, row.en, line9, row]);
    }
    let i0 = all9.length;
    while (i0 > 0 && _rowAtCurrentLoad(all9[i0 - 1][3], ex)) i0--;
    return { all: all9, tenure: all9.slice(i0) };
  }
  for (const d9 of Object.keys((s && s.sessionLog) || {}).sort()) {`);
 edit(G,`    if (en9) all9.push([d9, en9]);
  }
  const key9 = String(ex.w);`,`    if (en9) all9.push([d9, en9, en9.reps.slice()]);
  }
  const key9 = String(ex.w);`);
 edit(G,`  if (!ex.last) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
  const t = progressAnchor(ex, s).slice(0, ex.sets);`,`  if (!governingLast(ex, s)) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
  const t = progressAnchor(ex, s).slice(0, ex.sets);`);
 edit(G,`    for (const [d9, en9] of tenure9) {
      if (en9.reps.length >= setsAtTime9(d9)) return Math.min(ex.sets, en9.reps.length);
    }`,`    for (const [d9, , line9] of tenure9) {
      if (line9.length >= setsAtTime9(d9)) return Math.min(ex.sets, line9.length);
    }`);
 edit(G,`      const d9 = p9[0], en9 = p9[1];`,`      const d9 = p9[0], en9 = { reps: p9[2] };`);
 edit(G,`  const rich = E.performedEntry(ex.lastMeta);
  const rs = ex.lastMeta ? rirSetsOf(ex.lastMeta) : [];`,`  const meta9 = governingMeta(ex, s);
  const rich = E.performedEntry(meta9);
  const rs = meta9 ? (rich ? E.performedOriginalRirSets(rich) : rirSetsOf(meta9)) : [];`);
 edit(G,`  progressStep, progressAnchor, maxedOut,`,`  progressStep, progressAnchor, governingLast, governingMeta, maxedOut,`);
 // -------------------------------------------------------------------- today
 const T='rebuild/engine/today.cjs';
 edit(T,`const targetsFor = (...args) => E.targetsFor(...args);`,`const targetsFor = (...args) => E.targetsFor(...args);
const governingLast = (...args) => E.governingLast(...args);
const governingMeta = (...args) => E.governingMeta(...args);`);
 edit(T,`    const w = q && q.newW != null ? q.newW : e.w;
    let tgt, note, baselineAsk = false;`,`    const w = q && q.newW != null ? q.newW : e.w;
    /* NATIVE-NEXT-TARGETS — the card reads the governing last line and metadata
       through the shared source-owned helpers (legacy-only: the same cache). */
    const last9 = governingLast(e, s), meta9 = governingMeta(e, s);
    let tgt, note, baselineAsk = false;`);
 edit(T,`    else if (q && q.kind === "debut" && e.last) {`,`    else if (q && q.kind === "debut" && last9) {`);
 edit(T,`      const base9 = e.last.slice(0, e.sets);
      while (base9.length < e.sets) base9.push(Math.max(1, _padFrom9(base9, e.hi) - 1));`,`      const base9 = last9.slice(0, e.sets);
      while (base9.length < e.sets) base9.push(Math.max(1, _padFrom9(base9, e.hi) - 1));`);
 edit(T,`    else if (q && !e.last) { tgt = targetsFor(e, s);`,`    else if (q && !last9) { tgt = targetsFor(e, s);`);
 edit(T,`    if (realloc9 && e.sets < ((e.last || []).length || 0)) note = realloc9.line;`,`    if (realloc9 && e.sets < ((last9 || []).length || 0)) note = realloc9.line;`);
 edit(T,"      if (e.ladder) return `set ${e.ladder.set + 1} is the money set — ${e.last ? e.last[e.ladder.set] : \"?\"} → ${e.ladder.top} finishes the rung`;","      if (e.ladder) return `set ${e.ladder.set + 1} is the money set — ${last9 ? last9[e.ladder.set] : \"?\"} → ${e.ladder.top} finishes the rung`;");
 edit(T,`      const base9 = e.last && e.last.length ? e.last : tgt;
      if (e.last && e.last.length && e.sets && e.last.length < e.sets) return "arming: " + e.last.length + " of " + e.sets + " sets on file`,`      const base9 = last9 && last9.length ? last9 : tgt;
      if (last9 && last9.length && e.sets && last9.length < e.sets) return "arming: " + last9.length + " of " + e.sets + " sets on file`);
 edit(T,`prev: eraFresh(s, e.id) ? null : e.lastMeta };`,`prev: eraFresh(s, e.id) ? null : meta9 };`);
 // --------------------------------------------------------------------- plan
 const L='rebuild/engine/plan.cjs';
 edit(L,`  if (eraIdx(fks, ref) === 0) return false;
  for (const d of Object.keys((s && s.sessionLog) || {})) {
    if (d < ref && sameEra(fks, d, ref) && (((s.sessionLog[d] || {}).entries) || []).some((e) => e && e.id === exId)) return false;
  }
  return true;`,`  if (eraIdx(fks, ref) === 0) return false;
  /* NATIVE-NEXT-TARGETS — a registered native session of the same era before
     the reference day also ends freshness; the rows come from the one factual
     history in causal order. Legacy-only inputs read the log exactly as before. */
  if (s && s.workoutFacts) {
    for (const row of E.performedHistoryRows(s)) {
      const native = row.source === "performed";
      if (row.d < ref && sameEra(fks, row.d, ref) && (((row.rec || {}).entries) || []).some((e) => e && (native ? e.lift_lineage_id === exId && !!(E.performedLine(e) || {}).originals : e.id === exId))) return false;
    }
    return true;
  }
  for (const d of Object.keys((s && s.sessionLog) || {})) {
    if (d < ref && sameEra(fks, d, ref) && (((s.sessionLog[d] || {}).entries) || []).some((e) => e && e.id === exId)) return false;
  }
  return true;`);
 // -------------------------------------------------------------------- sleep
 const S='rebuild/engine/sleep.cjs';
 edit(S,`  const alarm = opts.alarm !== undefined ? opts.alarm : (typeof bodyAlarm === "function" ? bodyAlarm(s, slp2) : null);`,`  /* NATIVE-NEXT-TARGETS — the default alarm read is the shared signal/tier; no
     presentation (lab/canary/history) is built just to test truthiness or tier.
     An explicit opts.alarm keeps its original meaning. */
  const alarm = opts.alarm !== undefined ? opts.alarm : (typeof bodyAlarmSignal === "function" ? bodyAlarmSignal(s) : null);`);
 edit(S,`function bodyAlarm(s, slp) {
  const tI = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const pr5 = pulseRead(s);
  const lastNight = s.sleep.nights.find((n) => n.d === yISO);
  const todaySpike = pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 7 ? pr5.spike : null;
  const prevRead = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1)).slice(-2)[0];
  const prevSpike = pr5.base && prevRead && prevRead.d === yISO ? prevRead.bpm - pr5.base : null;
  const partial = todaySpike == null && pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 4 && prevSpike != null && prevSpike >= 7;
`,`/* NATIVE-NEXT-TARGETS — ONE shared body-alarm signal. Detection and tier are
   extracted verbatim from bodyAlarm: same thresholds, pulse/pattern logic and
   null/RED/AMBER semantics. It returns exactly the intermediate fields the
   full presentation needs; it builds no lines, reads no lab, canary or
   HISTORY, and is what rirPlan and liftCall's default path consume. */
function bodyAlarmSignal(s) {
  const tI = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const pr5 = pulseRead(s);
  const lastNight = s.sleep.nights.find((n) => n.d === yISO);
  const todaySpike = pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 7 ? pr5.spike : null;
  const prevRead = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1)).slice(-2)[0];
  const prevSpike = pr5.base && prevRead && prevRead.d === yISO ? prevRead.bpm - pr5.base : null;
  const partial = todaySpike == null && pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 4 && prevSpike != null && prevSpike >= 7;
`);
 edit(S,`  const patternHot = patParts.length >= 2;
  if (!todaySpike && !partial && !patternHot) return null;

  const pulseTrig = todaySpike != null || partial;
  const red = todaySpike != null && (todaySpike >= 10 || (prevSpike != null && prevSpike >= 7 && todaySpike >= 7) || (lastNight && lastNight.h < 6));
  const t = dayType(tI, s);`,`  const patternHot = patParts.length >= 2;
  if (!todaySpike && !partial && !patternHot) return null;

  const pulseTrig = todaySpike != null || partial;
  const red = todaySpike != null && (todaySpike >= 10 || (prevSpike != null && prevSpike >= 7 && todaySpike >= 7) || (lastNight && lastNight.h < 6));
  return { tier: red ? "RED" : "AMBER", red: !!red, tI, yISO, pr5, lastNight, todaySpike, prevSpike, partial, patParts, patternHot, pulseTrig };
}

// Copied from frozen src/app.jsx @ fe516c1:7817-7875 (presentation over bodyAlarmSignal).
function bodyAlarm(s, slp) {
  const sig = bodyAlarmSignal(s);
  if (!sig) return null;
  const { tI, yISO, pr5, lastNight, todaySpike, prevSpike, partial, patParts, pulseTrig, red } = sig;
  const t = dayType(tI, s);`);
 edit(S,`return { cleanAtDate, nightsBefore, atSleepTarget, sleepMean3At, sleepInfo, owedNights, owedLedger, sleepAnchor, recoveryIndex, bodyAlarm,`,`return { cleanAtDate, nightsBefore, atSleepTarget, sleepMean3At, sleepInfo, owedNights, owedLedger, sleepAnchor, recoveryIndex, bodyAlarmSignal, bodyAlarm,`);
 // ------------------------------------------------------------------ writers
 // rev173 N2 — a native entry holding no original position for the lift (an
 // added-only session) is not a row of the lift: it neither governs, anchors,
 // counts tenure nor revokes the imported cache. Its facts stay on the history.
 edit(G,`    const en = ((row.rec || {}).entries || []).find((e) => e && (native ? e.lift_lineage_id : e.id) === exId);
    if (!en) continue;
    rows.push({ d: row.d, source: row.source, start_op_id: row.start_op_id, rec: row.rec, en, native });`,`    const en = ((row.rec || {}).entries || []).find((e) => e && (native ? e.lift_lineage_id : e.id) === exId);
    if (!en) continue;
    if (native) { const line9 = E.performedLine(en); if (line9 && !line9.originals) continue; }
    rows.push({ d: row.d, source: row.source, start_op_id: row.start_op_id, rec: row.rec, en, native });`);
 const W='rebuild/engine/writers.cjs';
 edit(W,`const bodyAlarm = (...args) => E.bodyAlarm(...args);
const buildRirSets`,`const bodyAlarm = (...args) => E.bodyAlarm(...args);
const bodyAlarmSignal = (...args) => E.bodyAlarmSignal(...args);
const buildRirSets`);
 edit(W,`  try { const al9p = bodyAlarm(s); if (al9p) { plan = plan.map((r) => Math.max(r, 1)); why.push("alarm day — every 0 becomes a 1; delivered reps still count and bank"); } } catch (e) {}`,`  /* NATIVE-NEXT-TARGETS — the floor reads the shared detection signal only. The
     old call built the full presentation (lab groups, canary, HISTORY) merely to
     test truthiness, and a presentation failure after a real signal silently
     became an all-clear. Detection failure on an invalid state still yields no
     floor, exactly as before; presentation can no longer drop the effect. */
  try { const al9p = bodyAlarmSignal(s); if (al9p) { plan = plan.map((r) => Math.max(r, 1)); why.push("alarm day — every 0 becomes a 1; delivered reps still count and bank"); } } catch (e) {}`);
 // rev173 N2 — the hot-opener count reads the original opener only; an added
 // position's effort never counts as the opener of the lift.
 edit(W,`        const opener = E.performedRirSets(rich)[0];`,`        const opener = E.performedOriginalRirSets(rich)[0];`);
 const pins=Object.fromEntries(OWNED.map(file=>[file,{before:sha(accepted[file]),after:sha(out[file])}]));
 return {sources:Object.fromEntries(OWNED.map(f=>[f,out[f]])),changes,pins};
}
module.exports={ACCEPTED,OWNED,EXPECTED,construct,sha,once};
