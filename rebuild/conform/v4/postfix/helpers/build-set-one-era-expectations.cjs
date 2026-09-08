'use strict';
// Author source expectations BEFORE any edited candidate is loaded.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const Source=require('./set-one-era-source-projection.cjs'),H=require('./set-one-era-frozen.cjs');
const M=require('../laws/set-one-era.cjs'),Target=require('../target.cjs'),S=require('../structural-delta.cjs');
const NativeDate=Date,sha=v=>crypto.createHash('sha256').update(v).digest('hex');
function noCandidate(){if(Object.keys(require.cache).some(p=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(p)))throw Error('ERA30-CANDIDATE-LOADED');}
function modeDate(mode,day){globalThis.Date=NativeDate;if(mode==='frozen'){const ms=NativeDate.parse(day+'T12:00:00Z');globalThis.Date=class FrozenDate extends NativeDate{constructor(...args){super(...(args.length?args:[ms]));}static now(){return ms;}};}else if(mode!=='native')throw Error('ERA30-DATE-MODE');}
async function produce({source,caseId,mode,day,project=false}){
 noCandidate();if(!M.D30.requiredCases.includes(caseId))throw Error('ERA30-CASE-ID');
 const bundle=project?source.projection:source.bundle;if(sha(fs.readFileSync(bundle))!==(project?source.projectionSha256:source.bundleSha256))throw Error('ERA30-BUNDLE-PIN');
 const saved=globalThis.Date,frames=[];modeDate(mode,day);
 try{const target=Target.wrapFactory(options=>({__test:H.createFrozenEngine({...options,root:source.root,bundle,sourceProjection:project})}),{day,traceProfile:2,boundaryDateProfile:true},frames);
 const r=await M.D30.run({caseId,day,engine:target.engine,record:target.record,createHosts:engine=>H.createHosts({engine,dependencyTable:target.tableFor(engine),root:source.root,record:target.record})});
 noCandidate();return{status:r.ok?'GREEN':'RED',frames,detail:Target.graphEncoder()(r.detail),assertions:r.assertions};
 }finally{globalThis.Date=saved;}
}
function property(node,name){if(node?.[0]!=='node'||!Array.isArray(node[4]))throw Error('ERA30-GRAPH-SHAPE');return node[4].find(p=>p[0]?.[0]==='string'&&p[0][1]===name);}
// Accepted dates.cjs injects clock.today() where frozen todayStart samples
// ReferenceDate->nowMs(). This translates ONLY the enumerated new query calls;
// original no-fork/IDLE raw frames stay unchanged. Both raw versions are pinned.
function queryAdapter(trace,caseId,day){
 const out=structuredClone(trace),observation=out.frames.find(f=>f.observation===caseId+'.complete');
 if(!observation)throw Error('ERA30-CLOCK-OBSERVATION');
 const c=M.FIXTURE.cases.find(c=>c.id===caseId).make(day),expectedDays=c.sequence||[c.queryDay||day];let changed=0;
 for(const key of ['canonicalCalls','probeCalls']){
  const a=property(observation.value,key)?.at(-1);if(a?.[2]!=='Array')throw Error('ERA30-CLOCK-ARRAY');
  const rows=a[4].filter(p=>/^\d+$/.test(p[0]?.[1]||''));if(rows.length!==c.queryCalls)throw Error('ERA30-CLOCK-COUNT');
  rows.forEach((p,i)=>{const row=p.at(-1),method=property(row,'method'),at=property(row,'day'),value=property(row,'value');
   if(row[4].length!==3||method?.at(-1)?.[1]!=='nowMs'||at?.at(-1)?.[1]!==expectedDays[i]||value?.at(-1)?.[1]!==String(NativeDate.parse(expectedDays[i]+'T12:00:00Z')))throw Error('ERA30-CLOCK-ADAPTER-SOURCE');
   method.at(-1)[1]='today';row[4].splice(row[4].indexOf(value),1);changed++;
  });
 }
 return{trace:out,changed};
}
function exactCells(before,after,id){const cells=[];let n=0;
 const cell=(op,p,a,b)=>{if(!p.length)throw Error('ERA30-WHOLE-TRACE');cells.push({id:id+':source-only:'+(++n),op,path:p.map(String),before:a,after:b});};
 function walk(a,b,p=[]){if(JSON.stringify(a)===JSON.stringify(b))return;
  if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b)){cell('replace',p,a,b);return;}
  if(Array.isArray(a)){for(let i=0;i<Math.min(a.length,b.length);i++)walk(a[i],b[i],[...p,i]);for(let i=a.length-1;i>=b.length;i--)cell('remove',[...p,i],a[i],null);for(let i=a.length;i<b.length;i++)cell('add',[...p,i],null,b[i]);}
  else{for(const k of Object.keys(a))if(!Object.hasOwn(b,k))cell('remove',[...p,k],a[k],null);else walk(a[k],b[k],[...p,k]);for(const k of Object.keys(b))if(!Object.hasOwn(a,k))cell('add',[...p,k],null,b[k]);}
 }
 walk(before,after);const delta={aliases:[],cells};S.compareStructural(before,after,delta);return delta;
}
function datesPin(root){const rel='rebuild/engine/dates.cjs',bytes=fs.readFileSync(path.join(root,rel)),committed=require('node:child_process').execFileSync('git',['show','28ff3be3a0c47fa76b642015ac3757da5c76548c:'+rel],{cwd:root,windowsHide:true});if(!bytes.equals(committed))throw Error('ERA30-ACCEPTED-DATE-ADAPTER');if(!bytes.includes(Buffer.from('const todayStart = () => mk(clock.today());')))throw Error('ERA30-DATE-ADAPTER-SITE');return{file:rel,sha256:sha(bytes),source:'const todayStart = () => mk(clock.today());',line:12};}
async function generate({root,selected=[]}){
 root=path.resolve(root);const dateAdapter=datesPin(root),source=Source.createFrozenSource({root}),rows=[{defect:'D30',cases:[]}],matrix=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'))).matrix;let count=0;
 for(const c of M.CASES.filter(c=>c.defect==='D30'&&(!selected.length||selected.includes(c.id)))){
  const row={id:c.id,assertions:M.ASSERTION_INVENTORY.filter(a=>a.caseId===c.id).map(a=>({id:a.id,count:1})),originalFailures:null,expectations:[]};
  for(const cell of matrix){const a=await produce({source,caseId:c.id,...cell}),b=await produce({source,caseId:c.id,...cell,project:true});
   if(b.status!=='GREEN')throw Error('ERA30-PROJECTED-CLAIM:'+c.id+':'+b.assertions.filter(x=>!x.ok).map(x=>x.id).join(','));
   const trace=x=>({frames:x.frames,detail:x.detail}),adapted=queryAdapter(trace(b),c.id,cell.day),failures=a.assertions.filter(x=>!x.ok).map(x=>x.id).sort();
   if(row.originalFailures&&JSON.stringify(row.originalFailures)!==JSON.stringify(failures))throw Error('ERA30-MATRIX-FAILURE-SET');row.originalFailures=failures;
   row.expectations.push({...cell,originalTraceSha256:sha(JSON.stringify(trace(a))),delta:exactCells(trace(a),adapted.trace,c.id)});count++;
  }
  rows[0].cases.push(row);console.log(c.id+' SOURCE EXPECTATION 4/4');
 }
 const out=path.join(root,'.tmp/postfix/set-one-era-deltas.json');fs.writeFileSync(out,JSON.stringify(rows)+'\n');
 const receipt={status:'SOURCE-ONLY',candidateLoaded:false,dateAdapter,source,caseFileSha256:sha(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/laws/set-one-era.cjs'))),cases:rows[0].cases.length,cells:count,fixtureSha256:sha(fs.readFileSync(out))};
 fs.writeFileSync(path.join(root,'.tmp/postfix/set-one-era-source-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log('ERA30 SOURCE EXPECTATIONS '+count+' cells; candidate NOT LOADED; sha256 '+receipt.fixtureSha256);return{rows,out,source,receipt};
}
async function generateRaw({root}){
 root=path.resolve(root);const source=Source.createFrozenSource({root}),base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'))),law=base.inventory.find(x=>x.defect==='D30').law,rows=[];
 for(const cell of base.matrix){const saved=globalThis.Date,input={kind:'raw-frozen',baseline:root,helperRoot:root,helperPins:base.baseline.publicPins,law,traceProfile:2,...cell};let original,projected;
  try{original=await Target.worker({...input,bundle:source.bundle,bundleSha256:source.bundleSha256});projected=await Target.worker({...input,bundle:source.projection,bundleSha256:source.projectionSha256});}finally{globalThis.Date=saved;}
  if(original.status!=='RED'||projected.status!=='GREEN')throw Error('ERA30-RAW-SOURCE-VERDICT');const trace=r=>({frames:r.frames,detail:r.detail});
  rows.push({...cell,originalVerdict:original.status,candidateVerdict:projected.status,originalTraceSha256:sha(JSON.stringify(trace(original))),delta:exactCells(trace(original),trace(projected),'D30-RAW')});
 }
 noCandidate();const out=path.join(root,'.tmp/postfix/raw-set-one-era.json');fs.writeFileSync(out,JSON.stringify({method:'Unchanged actual raw D30 law, actual frozen source versus exact D30 frozen-source projection. candidateVerdict is a proposed expectation, not observed candidate evidence.',law,outputDeltas:rows},null,2)+'\n');
 console.log('ERA30 RAW SOURCE EXPECTATIONS4/4 RED→GREEN; candidate NOT LOADED; sha256 '+sha(fs.readFileSync(out)));return{out,rows};
}
module.exports={produce,queryAdapter,exactCells,generate,generateRaw,datesPin,sha};
if(require.main===module)(process.argv[2]==='--raw'?generateRaw({root:process.cwd()}):generate({root:process.cwd(),selected:process.argv.slice(2)})).catch(e=>{console.error('ERA30 EXPECTATION ERROR: '+e.message);process.exitCode=1;});
