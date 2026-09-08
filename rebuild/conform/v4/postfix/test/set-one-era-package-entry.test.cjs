'use strict';
// Actual cold run/package modules with explicit synthetic dependency fixtures.
// This validates dispatch and gate identity/order only, never product coverage,
// private custody, real artifact authority or the acceptance of an empty suite.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const R=require('../run.cjs'),P=require('../package-runner.cjs'),A=require('../acceptance.cjs');
const base=path.resolve(__dirname,'../../../../..'),pfx='rebuild/conform/v4/postfix',parent=path.join(base,'.tmp/postfix/era-cli-tests');fs.mkdirSync(parent,{recursive:true});
const root=fs.mkdtempSync(path.join(parent,'synthetic-')),visits=path.join(root,'synthetic-visits.jsonl');
test.after(()=>{assert(root.startsWith(parent+path.sep));fs.rmSync(root,{recursive:true,force:true});});
const json=v=>JSON.stringify(v,null,2)+'\n',sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const write=(p,b)=>{const file=path.join(root,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,b);};
for(const file of ['run.cjs','package-runner.cjs'])write(pfx+'/'+file,fs.readFileSync(path.join(base,pfx,file)));
write(pfx+'/target.cjs',`const c=require('node:crypto');exports.sha=b=>c.createHash('sha256').update(b).digest('hex');exports.fail=code=>{const e=Error(code);e.code=code;throw e;};`);
write(pfx+'/strict-json.cjs',`exports.parseExact=b=>JSON.parse(b);`);
write(pfx+'/helpers/set-one-era-compact-json.cjs',`exports.parseCompactExact=b=>JSON.parse(b);`);
write(pfx+'/helpers/set-one-era-git-bytes.cjs',`const fs=require('node:fs'),path=require('node:path');exports.object=(root,ref,file)=>fs.readFileSync(path.join(root,file));`);
write(pfx+'/structural-delta.cjs',`exports.compareStructural=()=>{throw Error('SYNTHETIC-UNEXPECTED-COMPARE');};`);
write(pfx+'/source-proof.cjs',`exports.verifyProductSources=()=>({synthetic:true});`);
// Synthetic dispatch substitute only; real protected custody is tested separately.
write(pfx+'/helpers/step-efficacy-d45-custody.cjs',`exports.prepareCustody=({acceptance})=>{if(acceptance.syntheticParent!=='STEP-DESCRIPTOR-ONLY')throw Error('SYNTHETIC-PARENT-DESCRIPTOR');return {assertSafePublicText:s=>s,dispose(){},compareRaw(){throw Error('SYNTHETIC-UNEXPECTED-RAW');}};};`);
write(pfx+'/acceptance.cjs',`const fs=require('node:fs'),path=require('node:path');exports.FILE='unused-parent-artifact';exports.profile=a=>{if(a.packageId!=='M2-SET-ONE-ERA')throw Error('SYNTHETIC-PROFILE');return{id:a.packageId};};exports.artifactFile=()=> 'synthetic-acceptance.json';exports.envelopeFile=()=> 'synthetic-envelope.json';exports.envelope=x=>x;exports.load=root=>({envelope:JSON.parse(fs.readFileSync(path.join(root,'synthetic-envelope.json'))),acceptance:JSON.parse(fs.readFileSync(path.join(root,'synthetic-acceptance.json'))),bytes:Buffer.from('synthetic dispatch only')});exports.stepParentArtifact=()=>({syntheticParent:'STEP-DESCRIPTOR-ONLY'});exports.fetchIntegration=()=>{};exports.ancestry=()=>{};exports.verifyReceipts=()=>false;exports.missing=()=>[];exports.keys=(o,n,c)=>{if(JSON.stringify(Object.keys(o).sort())!==JSON.stringify(n.sort()))throw Error(c);};`);
write(pfx+'/legacy-gates.cjs',`const fs=require('node:fs'),path=require('node:path');exports.git=(root,args)=>Buffer.from(args.includes('--show-toplevel')?path.resolve(root,'../..'):'synthetic-audit');exports.object=(root,commit,file)=>fs.readFileSync(path.join(root,file));exports.checkSources=()=>{};exports.publicReferences=()=>({main:'synthetic-main',old:'synthetic-old'});exports.historicalAudit=()=> 'SYNTHETIC dispatch only; no product/private evidence';`);
const ids=P.carrierProfile({packageId:'M2-SET-ONE-ERA'}).ids;
const carrierText=`const fs=require('node:fs'),path=require('node:path');exports.CARRIER_IDS=${JSON.stringify(ids)};exports.runCarrier=({id,mode,root})=>{fs.appendFileSync(path.join(root,'synthetic-visits.jsonl'),JSON.stringify({id,mode})+'\\n');if(id==='second-gate'&&fs.existsSync(path.join(root,'synthetic-custody-pending'))){const e=Error('synthetic missing custody');e.code='STEP-CUSTODY-PENDING';throw e;}return {id,mode,status:'PASS',tail:'SYNTHETIC CARRIER ONLY'};};`;
write(pfx+'/legacy-set-one-era-carriers.cjs',carrierText);
write(pfx+'/laws/set-one-era.cjs',`exports.laws=[];exports.CASES=[];exports.ASSERTION_INVENTORY=[];exports.INVENTORY=[];`);
write(pfx+'/fixtures/set-one-era-deltas.json',json([]));write(pfx+'/fixtures/step-efficacy-deltas.json',json([]));write(pfx+'/fixtures/import-guards-deltas.json',json([]));
const scripts=new Map();for(const [id,file,needle,arg]of R.GATES){if(ids.includes(P.carrierId(id,true,true)))continue;const rows=scripts.get(file)||[];rows.push({id,needle,arg:arg||null});scripts.set(file,rows);}
for(const [file,rows]of scripts)write(file,`${file.endsWith('.mjs')?"import fs from 'node:fs';":"const fs=require('node:fs');"}const rows=${JSON.stringify(rows)};const r=rows.find(x=>x.arg&&process.argv.includes(x.arg))||rows.find(x=>!x.arg);if(!r)throw Error('SYNTHETIC-GATE-ARG');fs.appendFileSync('synthetic-visits.jsonl',JSON.stringify({id:r.id,mode:'gate'})+'\\n');console.log(r.needle);`);
// Owned SYNTHETIC placeholders satisfy only gateRun's file-presence check. No
// protected repository fixture is copied, read, logged or represented by these.
write('rebuild/conform/private/live.json',json({synthetic:true}));write('rebuild/conform/private/live.main.json',json({synthetic:true}));
write('rebuild/conform/oracle/manifest.json',json({goldens:{'live.main':{path:'private/live.main.json'}}}));
fs.mkdirSync(path.join(root,'rebuild/engine'),{recursive:true});
const a={packageId:'M2-SET-ONE-ERA',baseline:{auditCommit:'synthetic-audit',publicPins:{},buildSources:{}},executionPins:{},caseModule:pfx+'/laws/set-one-era.cjs',helperFiles:{},contracts:[],nonD:[],inventory:[],requiredIds:[],candidateEngine:{},matrix:[]};
function repin(){const files=fs.readdirSync(path.join(root,pfx),{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>path.relative(root,path.join(x.parentPath,x.name)).split(path.sep).join('/')).sort();a.executionPins=Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(root,f)))]));write('synthetic-acceptance.json',json(a));}
repin();write('synthetic-envelope.json',json({version:2,acceptanceSha256:'synthetic-only',candidateBase:'synthetic-only'}));
function launch(){fs.writeFileSync(visits,'');return cp.spawnSync(process.execPath,[path.join(root,pfx,'run.cjs'),'--manifest',path.join(root,'synthetic-envelope.json'),'--baseline',root,'--candidate',path.join(root,'rebuild/engine')],{cwd:root,env:{...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:''},encoding:'utf8',windowsHide:true,timeout:15000,maxBuffer:1024*1024});}
// Independent, literal invocation inventory from the accepted 19 obligations.
const expected=[
 ['migrate-source','frozen'],['migrate-source','native'],['merge-source','frozen'],['merge-source','native'],['writers-source','frozen'],['writers-source','native'],
 ['witnesses-1','gate'],['defect-witnesses-2','frozen'],['defect-witnesses-2','native'],['witnesses-3','gate'],['defect-witnesses-4','frozen'],['defect-witnesses-5','frozen'],['defect-witnesses-5','native'],['witnesses-6','gate'],['defect-witnesses-7','frozen'],['defect-witnesses-7','native'],
 ['migrate-differential','frozen'],['migrate-differential','native'],['merge-differential','gate'],['writers-differential','frozen'],['writers-differential','native'],['writers-differential','trap'],['merge-laws','gate'],['migrate-full','gate'],['second-gate','frozen'],['conformance','gate'],['selftest','gate'],['strict','gate']
].map(([id,mode])=>({id,mode}));
test('cold ERA CLI preserves19 obligations/28 exact invocations, immutable parent descriptor, and pending output',()=>{const r=launch();assert.equal(r.status,2,r.stderr);assert.match(r.stdout,/REVIEW-PENDING: complete evidence collected/);assert.doesNotMatch(r.stdout,/\bPASS\b/);assert.doesNotMatch(r.stderr,/circular dependency/);const observed=fs.readFileSync(visits,'utf8').trim().split('\n').map(JSON.parse);assert.deepEqual(observed,expected);assert.equal(observed.length,28);assert.equal(R.GATES.length,19);});
test('ERA missing protected successor blocks without an inherited fallback',()=>{write('synthetic-custody-pending','synthetic only');try{const r=launch();assert.equal(r.status,2,r.stderr);assert.match(r.stderr,/POSTFIX BLOCKED STEP-CUSTODY-PENDING/);assert.doesNotMatch(r.stdout,/\bPASS\b|complete evidence collected/);const observed=fs.readFileSync(visits,'utf8').trim().split('\n').map(JSON.parse);assert.deepEqual(observed,expected.slice(0,25));}finally{fs.unlinkSync(path.join(root,'synthetic-custody-pending'));}});
test('ERA unlisted carrier refuses before any obligation executes',()=>{write(pfx+'/legacy-set-one-era-carriers.cjs',carrierText+"\nexports.CARRIER_IDS.push('arbitrary-gate');\n");repin();try{const r=launch();assert.equal(r.status,1);assert.match(r.stderr,/POSTFIX FAIL CARRIER-INVENTORY/);assert.equal(fs.readFileSync(visits,'utf8'),'');}finally{write(pfx+'/legacy-set-one-era-carriers.cjs',carrierText);repin();}});
