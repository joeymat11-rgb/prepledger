'use strict';
// Deliberately separate from frozen v3: failure of a desired law is expected
// here, but a missing law, unexpected exception or weak mutant fails this runner.
process.env.TZ = 'America/New_York';
const fs = require('node:fs');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { bundle } = require('./helpers.cjs');
function inventory() {
  const files = fs.readdirSync(__dirname).filter(f => f.startsWith('laws-') && f.endsWith('.cjs')).sort();
  const laws = files.flatMap(f => {
    const mod = require('./'+f);
    if (!isDeepStrictEqual(mod.INVENTORY,mod.laws.map(l=>l.id))) throw Error('Law inventory mismatch: '+f);
    return mod.laws;
  }).sort((a,b)=>Number(a.defect.slice(1))-Number(b.defect.slice(1)));
  if (laws.length !== 45 || new Set(laws.map(l=>l.id)).size !== 45 || laws.some((l,i)=>l.defect!=='D'+(i+1))) throw Error('Expected every defect D1–D45 exactly once');
  for (const law of laws) if (law.expect !== 'GREEN' || !law.cite || !['policy','progression','authority','client','engine'].includes(law.family) || typeof law.control !== 'function' || !law.mutants?.length) throw Error('Incomplete law: '+law.defect);
  return laws;
}
function execute(law,B) {
  try {
    const result=law.run(B);
    if (!result || typeof result.ok!=='boolean') throw Error('Law must return a boolean assertion');
    return { status: result.ok?'GREEN':'RED', detail: result.detail };
  } catch (e) { return { status:'HARNESS_ERROR', error:e.name+': '+e.message }; }
}
function snapshot(value) {
  if (value===undefined) return { $undefined:true };
  if (typeof value==='number'&&!Number.isFinite(value))return { $number:String(value) };
  if (value instanceof Date)return { $date:value.toISOString() };
  if (Array.isArray(value))return value.map(snapshot);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,snapshot(value[k])]));
  return value;
}
function traced(B,frames) {
  return {...B,engine(...args){
    const T=B.engine(...args);
    for(const [name,fn]of Object.entries(T))if(typeof fn==='function')T[name]=(...inputs)=>{
      const before=snapshot(inputs);
      try{const result=fn(...inputs);frames.push({name,before,result:snapshot(result),after:snapshot(inputs)});return result;}
      catch(e){frames.push({name,before,error:e.name+': '+e.message,after:snapshot(inputs)});throw e;}
    };
    return T;
  }};
}
function inspect(law,kind) {
  const B=bundle(kind),frames=[],raw=execute(law,traced(B,frames));
  let control,mutants=[];
  try {
    control=execute(law,law.control(B));
    mutants=law.mutants.map(m=>({name:m.name,...execute(law,m.make(law.control(B)))}));
  } catch(e) { control={status:'HARNESS_ERROR',error:e.name+': '+e.message}; }
  return {raw,control,mutants,frames,ok:raw.status==='RED'&&control.status==='GREEN'&&mutants.length===law.mutants.length&&mutants.every(m=>m.status==='RED')};
}
function main() {
  const laws=inventory();let pass=0,redFrozen=0,redCandidate=0,controls=0,detected=0,mutantRuns=0,errors=0;
  for(const law of laws){
    const f=inspect(law,'frozen'),c=inspect(law,'candidate');
    redFrozen+=f.raw.status==='RED';redCandidate+=c.raw.status==='RED';
    controls+=(f.control?.status==='GREEN')+(c.control?.status==='GREEN');
    for(const r of [f,c]) {detected+=r.mutants.filter(m=>m.status==='RED').length;mutantRuns+=r.mutants.length;errors+=[r.raw,r.control,...r.mutants].filter(x=>x?.status==='HARNESS_ERROR').length;}
    const parity=isDeepStrictEqual(f.raw.detail,c.raw.detail)&&isDeepStrictEqual(f.frames,c.frames);
    const ok=f.ok&&c.ok&&parity;pass+=ok;
    console.log(`${law.defect} ${law.id} · ${f.raw.status}-frozen / ${c.raw.status}-candidate / ${ok?'mutant-DETECTED':'AUDIT-FAIL'}`);
    if(!ok)console.error(JSON.stringify({defect:law.defect,parity,frozen:{...f,frames:undefined},candidate:{...c,frames:undefined}})); // Synthetic only; full state traces stay in memory.
  }
  console.log(`TOTAL ${laws.length} laws · ${redFrozen} RED-frozen · ${redCandidate} RED-candidate · ${controls} GREEN repair controls · ${detected}/${mutantRuns} mutant executions DETECTED · ${errors} HARNESS_ERROR · ${pass===45?'AUDIT RED-FIRST PASS':'AUDIT RED-FIRST FAIL'}`);
  process.exitCode=pass===45?0:1;
}
if(require.main===module) {try{main();}catch(e){console.error('AUDIT HARNESS_ERROR: '+e.message);process.exitCode=1;}}
module.exports={inventory,execute,inspect};
