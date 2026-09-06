'use strict';
process.env.TZ='America/New_York';
// EXPECTATION AUTHORING ONLY. Compile the frozen Git source and the one reviewed
// expression projection. No extracted product or protected fixture is loaded.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const H=require('./step-efficacy-frozen.cjs'),L=require('../legacy-gates.cjs'),Target=require('../target.cjs'),S=require('../structural-delta.cjs');
const M=require('../laws/step-efficacy.cjs'),NativeDate=Date,receipts=new WeakSet();
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
function createFrozenSource(options){
 if(!options||Object.keys(options).join('|')!=='root'||typeof options.root!=='string')throw Error('SE12-EXPECTED-FROZEN-ONLY');
 const root=fs.realpathSync(options.root),repo=fs.realpathSync(L.git(root,['rev-parse','--show-toplevel']).toString().trim());if(root!==repo)throw Error('SE12-EXPECTED-REPO');
 const base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'),'utf8'));
 const scratch=path.join(root,'.tmp/postfix/step-efficacy-source');
 const bundles=L.publicReferences({baseline:root,scratch,sourcePins:base.baseline.buildSources});
 const source=H.frozenSource(root);if(source.split(H.BEFORE).length!==2)throw Error('SE12-ONE-EXPRESSION');
 const dir=path.join(scratch,'projection');fs.mkdirSync(path.join(dir,'src'),{recursive:true});fs.mkdirSync(path.join(dir,'tools'),{recursive:true});
 for(const file of ['src/history.js','tools/_fixed-now.mjs']){const bytes=L.object(root,'fe516c1',file);if(sha(bytes)!==base.baseline.buildSources['fe516c1:'+file])throw Error('SE12-AUX-SOURCE-PIN');fs.writeFileSync(path.join(dir,file),bytes);}
 fs.writeFileSync(path.join(dir,'src/app.jsx'),source.replace(H.BEFORE,H.AFTER));
 fs.writeFileSync(path.join(dir,'entry.mjs'),'import "./tools/_fixed-now.mjs";export {__test} from "./src/app.jsx";\n');
 const projection=path.join(dir,'engine.cjs');require(path.join(root,'node_modules/esbuild')).buildSync({entryPoints:[path.join(dir,'entry.mjs')],outfile:projection,bundle:true,platform:'node',format:'cjs',jsx:'automatic',nodePaths:[path.join(root,'node_modules')],logLevel:'silent'});
 const out=Object.freeze({root,bundle:bundles.main,projection,bundleSha256:sha(fs.readFileSync(bundles.main)),projectionSha256:sha(fs.readFileSync(projection))});receipts.add(out);return out;
}
function modeDate(mode,day){globalThis.Date=NativeDate;if(mode==='frozen'){const ms=new NativeDate(...day.split('-').map((x,i)=>+x-(i===1?1:0)),12).getTime();globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[ms]));}static now(){return ms;}};}else if(mode!=='native')throw Error('SE12-DATE-MODE');}
async function produce({source,caseId,mode,day,project=false}){
 if(!receipts.has(source)||Object.keys(arguments[0]).some(k=>!['source','caseId','mode','day','project'].includes(k))||!M.D12.requiredCases.includes(caseId))throw Error('SE12-EXPECTED-RECEIPT');
 if(Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)))throw Error('SE12-CANDIDATE-ALREADY-LOADED');
 const bundle=project?source.projection:source.bundle;if(sha(fs.readFileSync(bundle))!==(project?source.projectionSha256:source.bundleSha256))throw Error('SE12-FROZEN-BUNDLE-CHANGED');
 const before=globalThis.Date;modeDate(mode,day);const frames=[];
 try{const target=Target.wrapFactory(options=>({__test:H.createFrozenEngine({...options,root:source.root,bundle:project?source.projection:source.bundle})}),{day,traceProfile:2,boundaryDateProfile:true},frames);
 const r=await M.D12.run({caseId,day,engine:target.engine,record:target.record,createHosts:engine=>H.createHosts({engine,record:target.record,root:source.root})});
 if(Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)))throw Error('SE12-CANDIDATE-LOADED');
 return{status:r.ok?'GREEN':'RED',frames,detail:Target.graphEncoder()(r.detail),assertions:r.assertions};
 }finally{globalThis.Date=before;}
}
const tagged=v=>Array.isArray(v)&&['node','ref','function','symbol'].includes(v[0])&&Number.isSafeInteger(v[1]);
const property=(v,key)=>v?.[0]==='node'?v[4].find(p=>p[0][0]==='string'&&p[0][1]===key)?.at(-1):undefined;
const semanticId=v=>{const p=property(v,'id');return p?.[0]==='string'?p[1]:null;};
function omission(a,b){if(a?.[0]!=='node'||b?.[0]!=='node'||a[2]!=='Array'||b[2]!=='Array')return false;const p=a[4],q=b[4];return p.length===3&&q.length===2&&p[0][0][1]==='0'&&p[1][0][1]==='1'&&p[2][0][1]==='length'&&q[0][0][1]==='0'&&q[1][0][1]==='length'&&String(semanticId(p[0].at(-1))||'').startsWith('steppush_')&&String(semanticId(p[1].at(-1))||'').startsWith('refeed_review_')&&semanticId(p[1].at(-1))===semanticId(q[0].at(-1));}
function exactAliases(original,expected){const map=new Map(),reverse=new Map(),known=new Set(),final=new Set();
 function all(v,set){if(!v||typeof v!=='object')return;if(tagged(v))set.add(v[1]);for(const x of Object.values(v))all(x,set);}
 function match(a,b){if(!a||!b||typeof a!=='object'||typeof b!=='object')return;if(tagged(a)&&tagged(b)){if(map.has(a[1])&&map.get(a[1])!==b[1]||reverse.has(b[1])&&reverse.get(b[1])!==a[1])throw Error('SE12-ALIAS-AMBIGUITY');map.set(a[1],b[1]);reverse.set(b[1],a[1]);if(a[0]==='node'&&b[0]==='node'){if(a[2]!==b[2]||a[3]!==b[3])throw Error('SE12-ALIAS-TYPE');if(omission(a,b)){match(a[4][1].at(-1),b[4][0].at(-1));match(a[4][2].at(-1),b[4][1].at(-1));}else{const props=new Map(b[4].map(p=>[JSON.stringify(p[0]),p]));for(const p of a[4]){const q=props.get(JSON.stringify(p[0]));if(q)match(p.at(-1),q.at(-1));}}match(a[5],b[5]);}return;}if(Array.isArray(a)&&Array.isArray(b)){for(let i=0;i<Math.min(a.length,b.length);i++)match(a[i],b[i]);}else for(const k of Object.keys(a))if(Object.hasOwn(b,k))match(a[k],b[k]);}
 match(original,expected);all(original,known);all(expected,final);let spare=Math.max(0,...known,...final);for(const id of [...known].sort((a,b)=>a-b))if(!map.has(id))map.set(id,++spare);return[...map].filter(([a,b])=>a!==b).sort((a,b)=>a[0]-b[0]);
}
function exactCells(original,expected,caseId){const raw=original,cells=[];let id=0;const aliases=caseId==='SE12-PUSH-TINY-POSITIVE'||caseId==='SE12-PUSH-NEGATIVE'?exactAliases(original,expected):[];original=S.remapGraph(original,aliases);
 function cell(op,p,b,a,q=p){if(!p.length)throw Error('SE12-WHOLE-TRACE-FORBIDDEN');cells.push({id:caseId+':frozen-units-consequence:'+(++id),op,path:p.map(String),...(JSON.stringify(p)===JSON.stringify(q)?{}:{afterPath:q.map(String)}),before:b,after:a});}
 function walk(a,b,p=[],q=p){if(JSON.stringify(a)===JSON.stringify(b))return;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b)){cell('replace',p,a,b,q);return;}if(omission(a,b)){
  // Exact retained refeed identity and complete bytes; original step descriptor alone is removed.
  for(const i of [0,1,2,3,5])walk(a[i],b[i],[...p,i],[...q,i]);
  walk(a[4][1],b[4][0],[...p,4,1],[...q,4,0]);walk(a[4][2],b[4][1],[...p,4,2],[...q,4,1]);cell('remove',[...p,4,0],a[4][0],null);return;
 }if(Array.isArray(a)){for(let i=0;i<Math.min(a.length,b.length);i++)walk(a[i],b[i],[...p,i],[...q,i]);for(let i=a.length-1;i>=b.length;i--)cell('remove',[...p,i],a[i],null,[...q,i]);for(let i=a.length;i<b.length;i++)cell('add',[...p,i],null,b[i],[...q,i]);}else{for(const k of Object.keys(a))if(!Object.hasOwn(b,k))cell('remove',[...p,k],a[k],null,[...q,k]);else walk(a[k],b[k],[...p,k],[...q,k]);for(const k of Object.keys(b))if(!Object.hasOwn(a,k))cell('add',[...p,k],null,b[k],[...q,k]);}}
 walk(original,expected);const delta={aliases,cells};S.compareStructural(raw,expected,delta);return delta;
}
async function generate({root,selected=[]}){const source=createFrozenSource({root}),base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'),'utf8')),rows=[{defect:'D12',cases:[]}];let n=0;
 const pins={...base.baseline.publicPins};for(const f of ['helpers/step-efficacy-frozen.cjs','helpers/import-guards-frozen.cjs','helpers/import-guards-hosts.cjs','laws/import-guards.cjs']){const rel='rebuild/conform/v4/postfix/'+f;pins[rel]=sha(fs.readFileSync(path.join(root,rel)));}
 const file=path.join(root,'rebuild/conform/v4/postfix/laws/step-efficacy.cjs'),caseSha256=sha(fs.readFileSync(file));
 for(const c of M.CASES.filter(c=>c.defect==='D12'&&(!selected.length||selected.includes(c.id)))){const row={id:c.id,assertions:M.ASSERTION_INVENTORY.filter(a=>a.caseId===c.id).map(a=>({id:a.id,count:1})),originalFailures:null,expectations:[]};
 for(const matrix of base.matrix){const a=await produce({source,caseId:c.id,...matrix}),savedDate=globalThis.Date;let actual;
 try{actual=await Target.worker({kind:'direct-frozen',bundle:source.bundle,bundleSha256:source.bundleSha256,frozenHelper:'rebuild/conform/v4/postfix/helpers/step-efficacy-frozen.cjs',hostsHelper:'rebuild/conform/v4/postfix/helpers/step-efficacy-frozen.cjs',helperRoot:root,helperPins:pins,caseFile:file,caseSha256,lawId:M.D12.id,caseId:c.id,traceProfile:2,...matrix});}finally{globalThis.Date=savedDate;}
 const trace=r=>({frames:r.frames,detail:r.detail});if(JSON.stringify(trace(a))!==JSON.stringify(trace(actual)))throw Error('SE12-UNPROJECTED-TARGET-MISMATCH:'+c.id);
 const b=await produce({source,caseId:c.id,...matrix,project:true});if(b.status!=='GREEN')throw Error('SE12-PROJECTED-CLAIM:'+c.id+':'+b.assertions.filter(a=>!a.ok).map(a=>a.id));const delta=exactCells(trace(a),trace(b),c.id),failures=a.assertions.filter(a=>!a.ok).map(a=>a.id).sort();if(row.originalFailures&&JSON.stringify(row.originalFailures)!==JSON.stringify(failures))throw Error('SE12-MATRIX-FAILURES:'+c.id);row.originalFailures=failures;row.expectations.push({...matrix,originalTraceSha256:sha(JSON.stringify(trace(a))),delta});n++;}
 rows[0].cases.push(row);console.log(c.id+' SOURCE EXPECTATION 4/4');}
 const out=path.join(root,'.tmp/postfix/step-efficacy-deltas.json');fs.writeFileSync(out,JSON.stringify(rows,null,2)+'\n');console.log('SE12 SOURCE EXPECTATIONS '+n+' cells; sha256 '+sha(fs.readFileSync(out))+'; candidate NOT LOADED');return{rows,out,source};}
async function generateRaw({root}){const source=createFrozenSource({root}),base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'),'utf8')),law=base.inventory.find(x=>x.defect==='D12').law,rows=[];
 for(const cell of base.matrix){const input={kind:'raw-frozen',baseline:root,helperRoot:root,helperPins:base.baseline.publicPins,law,traceProfile:2,...cell};const old=globalThis.Date;let original,projected;try{original=await Target.worker({...input,bundle:source.bundle,bundleSha256:source.bundleSha256});projected=await Target.worker({...input,bundle:source.projection,bundleSha256:source.projectionSha256});}finally{globalThis.Date=old;}
 if(original.status!=='RED'||projected.status!=='GREEN')throw Error('SE12-RAW-SOURCE-VERDICT');const trace=r=>({frames:r.frames,detail:r.detail});rows.push({...cell,originalVerdict:original.status,candidateVerdict:projected.status,originalTraceSha256:sha(JSON.stringify(trace(original))),delta:exactCells(trace(original),trace(projected),'D12-RAW')});}
 const out=path.join(root,'.tmp/postfix/raw-step-efficacy.json');fs.writeFileSync(out,JSON.stringify({method:'unchanged actual raw law; actual frozen source and exact one-expression frozen-source projection; candidateVerdict is proposed expectation, not actual candidate evidence',law,outputDeltas:rows},null,2)+'\n');console.log('SE12 RAW SOURCE EXPECTATIONS4/4 RED→GREEN; candidate NOT LOADED; sha256 '+sha(fs.readFileSync(out)));return{out,rows};}
module.exports={createFrozenSource,produce,exactCells,generate,generateRaw,sha};
if(require.main===module)(process.argv[2]==='--raw'?generateRaw({root:process.cwd()}):generate({root:process.cwd(),selected:process.argv.slice(2)})).catch(e=>{console.error(e.stack);process.exitCode=1;});
