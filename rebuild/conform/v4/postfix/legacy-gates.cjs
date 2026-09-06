'use strict';
// Baseline fidelity is exact. No declaration/source exemption exists in v1.
const fs=require('node:fs'),path=require('node:path');
const {execFileSync,spawnSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const {sha,fail,runRaw}=require('./target.cjs');
function git(root,args) { return execFileSync('git',args,{cwd:root,windowsHide:true,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']}); }
function object(root,commit,file) { return git(root,['show',commit+':'+file]); }
function verifyBase(root,expected) {
  if(git(root,['merge-base','HEAD','refs/remotes/origin/rebuild/t2-client-core']).toString().trim()!==expected)fail('CANDIDATE-BASE-STALE');
}
function checkSources(root,commit,pins,{disk=true}={}) {
  for(const [file,hash] of Object.entries(pins)) {
    if(file.includes('*')||file.includes('..')||path.isAbsolute(file)||!/^[a-f0-9]{64}$/.test(hash))fail('SOURCE-PIN-SCHEMA');
    if(sha(object(root,commit,file))!==hash)fail('GIT-SOURCE-PIN');
    if(disk&&sha(fs.readFileSync(path.join(root,file)))!==hash)fail('WORKTREE-SOURCE-PIN');
  }
}
function verifyReceipt(root,candidateBase,receipt,{role,mentions=[]}={}) {
    if(!receipt||receipt.commit!==candidateBase||receipt.path!=='rebuild/DECISIONS.md'||!/^[a-f0-9]{64}$/.test(receipt.lineSha256)||typeof receipt.line!=='string'||receipt.line.includes('\n')||receipt.line.includes('\r'))fail('RECEIPT-SCHEMA');
  const lines=object(root,candidateBase,'rebuild/DECISIONS.md').toString('utf8').split(/\r?\n/);
  const found=lines.filter(line=>sha(Buffer.from(line))===receipt.lineSha256);
  if(found.length!==1||found[0]!==receipt.line)fail('RECEIPT-EXACT-LINE-MISSING');
  if(role&&!new RegExp(' · '+role+' · ').test(found[0]))fail('RECEIPT-ROLE');
  if(mentions.some(s=>!found[0].includes(s)))fail('RECEIPT-CONTENT');
  return true;
}
function assertions(result,expected) {
  if(!Array.isArray(expected)||!expected.length||new Set(expected.map(x=>x.id)).size!==expected.length)fail('ASSERTION-INVENTORY');
  if(!Array.isArray(result.assertions))fail('ASSERTION-MISSING');
  const allowed=new Map(expected.map(x=>[x.id,x])); const seen=new Map();
  for(const a of result.assertions) {
    if(!a||typeof a.id!=='string'||typeof a.ok!=='boolean'||!allowed.has(a.id))fail('ASSERTION-UNKNOWN');
    seen.set(a.id,(seen.get(a.id)||0)+1);
  }
  for(const e of expected)if(!Number.isInteger(e.count)||e.count<1||seen.get(e.id)!==e.count)fail('ASSERTION-OCCURRENCE');
  const all=result.assertions.every(a=>a.ok);
  if(result.status!==(all?'GREEN':'RED'))fail('ASSERTION-VERDICT-INCONSISTENT');
  return result.assertions.filter(a=>!a.ok).map(a=>a.id).sort();
}
function exactDelta(before,after,deltas) {
  // Exact JSON/typed-graph pointer replacements, with both old/new values pinned.
  // Prefix overlap, wildcards, unexecuted deltas and any other drift fail closed.
  const b=structuredClone(before),used=new Set(),paths=[];
  function at(root,pointer,replace,value) {
    if(!Array.isArray(pointer)||!pointer.length||pointer.some(k=>typeof k!=='string'||['*','__proto__','prototype','constructor'].includes(k)))fail('DELTA-PATH');
    let node=root;for(const k of pointer.slice(0,-1)){if(!node||!Object.hasOwn(node,k))fail('DELTA-UNUSED');node=node[k];}
    const key=pointer.at(-1);if(!node||!Object.hasOwn(node,key))fail('DELTA-UNUSED');
    const out=node[key];if(replace)node[key]=value;return out;
  }
  for(const d of deltas) {
    if(!d.id||used.has(d.id))fail('DELTA-ID');used.add(d.id);
    const p=d.path;if(paths.some(q=>JSON.stringify(q.slice(0,p.length))===JSON.stringify(p)||JSON.stringify(p.slice(0,q.length))===JSON.stringify(q)))fail('DELTA-OVERLAP');paths.push(p);
    if(JSON.stringify(at(b,p,false))!==JSON.stringify(d.before)||JSON.stringify(at(after,p,false))!==JSON.stringify(d.after)||JSON.stringify(d.before)===JSON.stringify(d.after))fail('DELTA-UNUSED-OR-PREDICATE');
    at(b,p,true,structuredClone(d.after));
  }
  if(JSON.stringify(b)!==JSON.stringify(after))fail('UNAPPROVED-DELTA');return true;
}
function requirePath(root,relative) {
  const destination=path.resolve(root,relative), prefix=path.resolve(root)+path.sep;
  if(!destination.startsWith(prefix))fail('SCRATCH-ESCAPE');return destination;
}
function faultRun({candidate,inventory,scratch,mutant,caseInput,expected}) {
  if(!mutant||!mutant.id||!mutant.declaration||!mutant.expectedFailures?.length||!Object.hasOwn(inventory,mutant.file))fail('MUTANT-SCHEMA');
  const before=fs.readFileSync(path.join(candidate,mutant.file),'utf8');
  if(sha(before)!==mutant.preimageHash||typeof mutant.preimage!=='string'||!mutant.preimage||before.split(mutant.preimage).length!==2||typeof mutant.postimage!=='string'||mutant.preimage===mutant.postimage)fail('MUTANT-PREIMAGE');
  const after=before.replace(mutant.preimage,mutant.postimage);
  if(sha(after)!==mutant.postimageHash)fail('MUTANT-POSTIMAGE');
  const edit=before.indexOf(mutant.preimage);
  if(mutant.scope){const s=mutant.scope;if(!Number.isSafeInteger(s.start)||!Number.isSafeInteger(s.end)||s.start<0||s.end>before.length||s.end<=s.start||edit<s.start||edit+mutant.preimage.length>s.end||sha(before.slice(s.start,s.end))!==s.sha256)fail('MUTANT-DECLARATION-SCOPE');}
  fs.mkdirSync(scratch,{recursive:true}); const copy=fs.mkdtempSync(path.join(scratch,'mutant-'));
  const coverage=path.join(copy,'coverage'), product=path.join(copy,'engine');fs.mkdirSync(product);fs.mkdirSync(coverage);
  const preflight=runRaw({...caseInput,candidate,inventory});
  if(assertions(preflight,expected).length)fail('MUTANT-UNMUTATED-NOT-GREEN');
  try {
    for(const file of Object.keys(inventory)){const out=requirePath(product,file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(candidate,file),out);}
    fs.writeFileSync(requirePath(product,mutant.file),after);
    const changed={...inventory,[mutant.file]:sha(after)};
    const result=runRaw({...caseInput,candidate:product,inventory:changed,coverageDirectory:coverage});
    const failures=assertions(result,expected);
    if(JSON.stringify(failures)!==JSON.stringify([...mutant.expectedFailures].sort()))fail('MUTANT-INEFFECTIVE-OR-WRONG-FAILURE');
    const wanted=pathToFileURL(requirePath(product,mutant.file)).href;
    let executed=false;
    for(const name of fs.readdirSync(coverage))for(const script of JSON.parse(fs.readFileSync(path.join(coverage,name))).result||[]) {
      // vm.Script filenames are OS paths in some Node versions, file URLs in others.
      if(script.url!==wanted&&script.url!==requirePath(product,mutant.file))continue;
      const prefix='(function(exports,require,module,__filename,__dirname){\n'.length;
      if(script.functions.some(f=>{if(f.functionName!==mutant.declaration)return false;if(!mutant.scope)return f.ranges.some(r=>r.count>0);const position=prefix+edit,cover=f.ranges.filter(r=>r.startOffset<=position&&r.endOffset>position).sort((a,b)=>(a.endOffset-a.startOffset)-(b.endOffset-b.startOffset));return cover.length&&cover[0].count>0;}))executed=true;
    }
    if(!executed)fail('MUTANT-DECLARATION-NOT-EXECUTED');
    for(const [file,hash] of Object.entries(inventory))if(sha(fs.readFileSync(path.join(candidate,file)))!==hash)fail('ORIGINAL-NOT-RESTORED');
    const restored=runRaw({...caseInput,candidate,inventory});if(assertions(restored,expected).length)fail('RESTORED-NOT-GREEN');
    return {id:mutant.id,status:'EFFECTIVE',failedAssertions:failures,restoredSha256:sha(fs.readFileSync(path.join(candidate,mutant.file)))};
  } finally { if(!copy.startsWith(path.resolve(scratch)+path.sep))fail('SCRATCH-ESCAPE');fs.rmSync(copy,{recursive:true,force:true}); }
}
function publicReferences({baseline,scratch,sourcePins}) {
  // Rebuild only public frozen source in declared scratch. No fixture/private read.
  const dependency=path.join(baseline,'node_modules/esbuild');
  if(!fs.existsSync(path.join(dependency,'lib/main.js')))fail('BASELINE-ESBUILD-MISSING');
  const pkg=JSON.parse(fs.readFileSync(path.join(dependency,'package.json')));
  if(pkg.version!=='0.28.1')fail('BASELINE-ESBUILD-VERSION');
  const build=require(path.join(dependency,'lib/main.js'));fs.mkdirSync(scratch,{recursive:true});const bundles={};
  for(const [name,commit]of [['main','fe516c1'],['old','a0009c3']]) {
    const dir=requirePath(scratch,name);fs.mkdirSync(dir,{recursive:true});
    const files=Object.keys(sourcePins).filter(k=>k.startsWith(commit+':')).map(k=>k.slice(commit.length+1));
    if(!files.includes('src/app.jsx')||!files.includes('tools/_fixed-now.mjs'))fail('FROZEN-BUILD-INVENTORY');
    for(const file of files){
      const bytes=object(baseline,commit,file);
      if(sha(bytes)!==sourcePins[commit+':'+file])fail('FROZEN-BUILD-SOURCE-PIN');const out=requirePath(dir,file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);
    }
    const entry=path.join(dir,'entry.mjs'),outfile=path.join(dir,'engine.cjs');
    fs.writeFileSync(entry,'import "./tools/_fixed-now.mjs"; import {__test} from "./src/app.jsx"; export {__test};\n');
    build.buildSync({entryPoints:[entry],outfile,bundle:true,platform:'node',format:'cjs',jsx:'automatic',loader:{'.jsx':'jsx'},nodePaths:[path.join(baseline,'node_modules')],logLevel:'silent'});
    bundles[name]=outfile;
  }
  return bundles;
}
function historicalAudit({baseline,bundles}) {
  const child=spawnSync(process.execPath,['rebuild/conform/v4/run-defect-laws.cjs'],{cwd:baseline,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:1024*1024,
    env:{...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',ENGINE_MAIN:bundles.main,ENGINE_OLD:bundles.old}});
  const expected='TOTAL 45 laws · 45 RED-frozen · 45 RED-candidate · 90 GREEN repair controls · 104/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST PASS';
  if(child.error||child.status!==0||!child.stdout.split(/\r?\n/).includes(expected))fail('ORIGINAL-AUDIT-FAILED');
  return expected;
}
module.exports={git,object,verifyBase,checkSources,verifyReceipt,assertions,exactDelta,faultRun,publicReferences,historicalAudit};
