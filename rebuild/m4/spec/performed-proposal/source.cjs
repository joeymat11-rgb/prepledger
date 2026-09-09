'use strict';
// Exact nonshipping source construction. No retained engine or shipping import
// changes; later history/caller/producer closure remains a prerequisite to use.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),Module=require('node:module'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),base='3e908d2eed586288cebfaa12e3b0625671949079';
const modules=['dates','constants','plan','progression','sleep','energy','policy','today','volume','earn','writers'];
const files=modules.map(n=>'rebuild/engine/'+n+'.cjs').concat(['rebuild/m3/w7-preview/browser-engine.cjs','rebuild/m3/w7-preview/fixtures.cjs']);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function once(source,before,after){assert.equal(source.split(before).length,2,'Exact unique source construction: '+before);return source.replace(before,after);}
function baseline(){return Object.fromEntries(files.map(file=>{
 const r=cp.spawnSync('git',['show',base+':'+file],{cwd:root,windowsHide:true,maxBuffer:8e6});assert.equal(r.status,0,'Pinned source '+file);
 assert(fs.readFileSync(path.join(root,file)).equals(r.stdout),'Retained source unchanged '+file);return [file,r.stdout.toString('utf8')];
}));}
function construct(input){
 const sources={...input},changes=[];
 function edit(file,before,after){sources[file]=once(sources[file],before,after);changes.push({file,before,after});}
 const P='rebuild/engine/progression.cjs',B='rebuild/m3/w7-preview/browser-engine.cjs';
 // Bound substitutions to the exact declaration, not another identical test.
 const start=sources[P].indexOf('function progressStep(ex, s) {'),end=sources[P].indexOf('// Copied from frozen src/app.jsx @ fe516c1:970-995.');
 assert(start>=0&&end>start);const original=sources[P].slice(start,end);let step=original;
 step=once(step,'  const rs = ex.lastMeta ? rirSetsOf(ex.lastMeta) : [];','  const rich = E.performedEntry(ex.lastMeta);\n  const rs = ex.lastMeta ? rirSetsOf(ex.lastMeta) : [];');
 for(const [before,after]of [
  ['if (term != null)','if (rich ? E.effortKnown(term) : term != null)'],
  ['if (term >= 3)','if (rich ? E.effortIs(term, "gte3") : term >= 3)'],
  ['if (term === 2)','if (rich ? E.effortIs(term, "eq2") : term === 2)'],
  ['if (term === 1)','if (rich ? E.effortIs(term, "eq1") : term === 1)'],
  ['if (open != null)','if (rich ? E.effortKnown(open) : open != null)'],
  ['if (open >= 3)','if (rich ? E.effortIs(open, "gte3") : open >= 3)'],
  ['if (open === 2)','if (rich ? E.effortIs(open, "eq2") : open === 2)'],
 ])step=once(step,before,after);
 const roles=['terminal-ge3','terminal-eq2','terminal-eq1','terminal-zero','opener-ge3','opener-eq2','opener-low','no-rating'];
 const adds=[3,2,2,1,2,1,1,1],bodyAt=step.indexOf('  const rich = E.performedEntry');let branch=0;
 const body=step.slice(bodyAt).replace(/return \{ add: (\d+), why: (.*) \};/g,(whole,add,why)=>{
  assert.equal(Number(add),adds[branch],'Exact unchanged rep-step branch');
  return `return { add: ${add}, why: rich ? E.performedStepWhy(rich, "${roles[branch++]}") : ${why} };`;
 });assert.equal(branch,roles.length,'All and only rich rep-step prose branches');step=step.slice(0,bodyAt)+body;
 edit(P,original,step);
 edit(P,'function rirSetsOf(en) {\n','function rirSetsOf(en) {\n  const rich = E.performedRirSets(en); if (rich) return rich;\n');
 edit(P,'function rirReceipt(en) {\n','function rirReceipt(en) {\n  if (E.performedEntry(en)) return E.performedRirReceipt(en);\n');
  edit(P,'function sessionScore(entry) {\n',`function sessionScore(entry) {
  const rich = E.performedEntry(entry);
  if (rich) {
    if (rich.slots.some(slot => slot.state === "unresolved")) return null;
    let work = 0;
    for (const slot of rich.slots) if (slot.state === "performed") {
      work += slot.fact.current.load.value * slot.fact.current.reps.value;
      if (!Number.isFinite(work)) return null;
    }
    return work > 0 ? work : null;
  }
`);
 const noiseStart=sources[P].indexOf('function typicalError(s, exId, asOf) {');
 const enumerationStart=sources[P].indexOf('  Object.keys((s && s.sessionLog) || {}).sort().forEach((d) =>',noiseStart);
 const enumerationEnd=sources[P].indexOf('  const pooled = [], mine = [];',enumerationStart);
 assert(noiseStart>=0&&enumerationStart>noiseStart&&enumerationEnd>enumerationStart);
 edit(P,sources[P].slice(enumerationStart,enumerationEnd),`  for (const { d, rec } of E.performedHistoryRows(s)) {
    for (const e of (rec || {}).entries || []) {
      const rich = E.performedEntry(e);
      if (!rich && !(e && e.reps && e.reps.length)) continue;
      const id = rich ? rich.lift_lineage_id : e.id;
      if (!sameEra(fkOf(id), d, at9)) continue;
      (byId[id] = byId[id] || []).push(e);
    }
  }
`);
 edit(P,`      if (a.w == null || b.w == null || String(a.w) !== String(b.w) || a.reps.length !== b.reps.length) continue;
      b.reps.forEach((x, j) => { const dlt = (Number(x) || 0) - (Number(a.reps[j]) || 0); pooled.push(dlt); if (id === exId) mine.push(dlt); });`,
`      let ar = a.reps, br = b.reps;
      if (E.performedEntry(a) || E.performedEntry(b)) {
        const pair = E.performedPair(a, b); if (!pair) continue;
        ar = pair.a; br = pair.b;
      } else if (a.w == null || b.w == null || String(a.w) !== String(b.w) || a.reps.length !== b.reps.length) continue;
      br.forEach((x, j) => { const dlt = (Number(x) || 0) - (Number(ar[j]) || 0); pooled.push(dlt); if (id === exId) mine.push(dlt); });`);
 edit('rebuild/engine/writers.cjs',`  const opens = Object.values(s.sessionLog).flatMap((sl) => (sl.entries || []).filter((e) => e.id === ex.id && e.rir != null).map((e) => e.rir)).sort((a, b) => a - b);
  if (opens.length >= 3 && opens[Math.floor(opens.length / 2)] <= 0)`,
`  let hotOpenerHistory;
  if (!s.workoutFacts) {
    const opens = Object.values(s.sessionLog).flatMap((sl) => (sl.entries || []).filter((e) => e.id === ex.id && e.rir != null).map((e) => e.rir)).sort((a, b) => a - b);
    hotOpenerHistory = opens.length >= 3 && opens[Math.floor(opens.length / 2)] <= 0;
  } else {
    let known = 0, hot = 0;
    for (const {rec} of E.performedHistoryRows(s)) for (const entry of rec.entries || []) {
      const rich = E.performedEntry(entry);
      if (rich) {
        if (rich.lift_lineage_id !== ex.id) continue;
        const opener = E.performedRirSets(rich)[0];
        if (!E.effortKnown(opener)) continue;
        known++; if (E.effortIs(opener, 'eq0')) hot++;
      } else if (entry.id === ex.id && entry.rir != null) {
        known++; if (entry.rir <= 0) hot++;
      }
    }
    // The original upper-median <=0 rule is exactly a strict majority of
    // known hot openers, with the same minimum three. A 3+ bound is known
    // nonzero, never an exact rating; missing/removed openers stay missing.
    hotOpenerHistory = known >= 3 && hot > Math.floor(known / 2);
  }
  if (hotOpenerHistory)`);
 edit(B,'  require("../../engine/progression.cjs"),','  require("../../engine/performed.cjs"),\n  require("../../engine/progression.cjs"),');
 sources['rebuild/engine/performed.cjs']=fs.readFileSync(path.join(__dirname,'factory.cjs'),'utf8');
 return {sources,changes,pins:Object.fromEntries(Object.entries(sources).map(([file,source])=>[file,{before:input[file]===undefined?null:sha(input[file]),after:sha(source)}]))};
}
function load(sources){const cache=new Map();return function read(file){
 const full=path.resolve(root,file),relative=path.relative(root,full).split(path.sep).join('/');
 assert(Object.hasOwn(sources,relative),'Closed proposal import '+relative);if(cache.has(full))return cache.get(full).exports;
 const m=new Module(full,module);m.filename=full;cache.set(full,m);m.require=request=>read(path.resolve(path.dirname(full),request));m._compile(sources[relative],full);return m.exports;
};}
module.exports={root,base,sha,baseline,construct,load};
