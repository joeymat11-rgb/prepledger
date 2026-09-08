'use strict';
// Executable synthetic worker-boundary controls, not product case evidence.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const T=require('../target.cjs'),root=path.resolve(__dirname,'../../../../..'),parent=path.join(root,'.tmp/postfix/era-target-tests');fs.mkdirSync(parent,{recursive:true});
const scratch=fs.mkdtempSync(path.join(parent,'worker-')),helperPath='rebuild/conform/v4/postfix/helpers/set-one-era-frozen.cjs',lawPath='rebuild/conform/v4/postfix/laws/set-one-era.cjs',stepPath='rebuild/conform/v4/postfix/laws/step-efficacy.cjs',inventory={};
const write=(rel,text)=>{const p=path.join(scratch,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,text);return T.sha(text);};
inventory['index.cjs']=write('candidate/index.cjs',"exports.createEngine=()=>({__test:{HISTORY:[],ping:()=> 'candidate'}});\n");
const bundle=path.join(scratch,'synthetic-frozen-bundle.cjs');fs.writeFileSync(bundle,'module.exports={};\n');
const pins={};pins[stepPath]=write(stepPath,"exports.marker='exact-step-import';\n");
const casesPath='rebuild/conform/v4/postfix/helpers/set-one-era-cases.cjs';pins[casesPath]=write(casesPath,"exports.marker='exact-cases-import';\n");
pins[helperPath]=write(helperPath,`const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),registered=new WeakSet();
exports.createFrozenEngine=()=>{const HISTORY=[];registered.add(HISTORY);return {HISTORY,ping:()=> 'frozen'};};
exports.createHosts=({engine,candidate,inventory,dependencyTable})=>{
 if(!dependencyTable||dependencyTable===engine||dependencyTable.HISTORY!==engine.HISTORY||dependencyTable.ping===engine.ping)throw Error('table identity');
 if(registered.has(engine.HISTORY)){if(candidate!==null||inventory!==null)throw Error('frozen received candidate');return {kind:'frozen'};}
 if(!candidate||!inventory)throw Error('missing frozen registry');
 const bytes=fs.readFileSync(path.join(candidate,'index.cjs'));if(crypto.createHash('sha256').update(bytes).digest('hex')!==inventory['index.cjs'])throw Error('wrong candidate inventory');return {kind:'candidate'};
};\n`);
const law=`const inherited=require('./step-efficacy.cjs');exports.laws=[{id:'synthetic-era-worker',implementation:'PRESENT',async run(t){const E=t.engine(),host=t.createHosts(E),value=E.ping();t.record('synthetic-host',{kind:host.kind});return {ok:host.kind===value&&inherited.marker==='exact-step-import',detail:null,assertions:[{id:'synthetic-host-match',ok:host.kind===value}]};}}];\n`;
function input(kind='direct',caseSource=law){const sha=write(lawPath,caseSource);return {kind,baseline:scratch,candidate:path.join(scratch,'candidate'),inventory,helperRoot:scratch,helperPins:pins,caseFile:path.join(scratch,lawPath),caseSha256:sha,lawId:'synthetic-era-worker',caseId:'synthetic',mode:'frozen',day:'2026-09-03',traceProfile:2,hostsHelper:helperPath,frozenHelper:helperPath,bundle,bundleSha256:T.sha(fs.readFileSync(bundle))};}
test.after(()=>{assert(path.resolve(scratch).startsWith(path.resolve(parent)+path.sep));fs.rmSync(scratch,{recursive:true,force:true});});
test('real worker passes disposable candidate path/pins and exact raw dependency table',()=>{const r=T.runRaw(input());assert.equal(r.status,'GREEN');assert.equal(r.frames.filter(f=>f.name==='ping').length,1);});
test('real frozen worker reuses its registered helper instance with no candidate access',()=>{const r=T.runRaw(input('direct-frozen'));assert.equal(r.status,'GREEN');assert.equal(r.frames.filter(f=>f.name==='ping').length,1);});
test('exact ERA synthetic cases import must be pinned and uses its actual bytes',()=>{const code=law.replace("require('./step-efficacy.cjs')","require('../helpers/set-one-era-cases.cjs')").replace('exact-step-import','exact-cases-import');assert.equal(T.runRaw(input('direct',code)).status,'GREEN');const i=input('direct',code);i.helperPins={...pins};delete i.helperPins[casesPath];assert.throws(()=>T.runRaw(i),e=>e.code==='RAW-CHILD-HARNESS-ERROR');});
test('unknown facade cannot obtain a real underlying table',()=>{const t=T.wrapFactory(()=>({__test:{ping(){return true;}}}),{},[]),a=t.engine();assert.equal(typeof t.tableFor(a).ping,'function');assert.throws(()=>t.tableFor({...a}),e=>e.code==='TARGET-ENGINE-IDENTITY');});
test('ERA top-level law still rejects an arbitrary import even when the file is pinned',()=>{pins['rebuild/conform/v4/postfix/laws/other.cjs']=write('rebuild/conform/v4/postfix/laws/other.cjs',"exports.marker='exact-step-import';\n");assert.throws(()=>T.runRaw(input('direct',law.replace('./step-efficacy.cjs','./other.cjs'))),e=>e.code==='RAW-CHILD-HARNESS-ERROR');});
test('wrong candidate bytes remain a harness refusal, never a failed product assertion',()=>{const i=input();i.inventory={...inventory,'index.cjs':'0'.repeat(64)};assert.throws(()=>T.runRaw(i),e=>e.code==='RAW-CHILD-HARNESS-ERROR');});
test('missing frozen helper pin refuses before any synthetic observation is accepted',()=>{const i=input('direct-frozen');i.helperPins={...pins};delete i.helperPins[helperPath];assert.throws(()=>T.runRaw(i),e=>e.code==='RAW-CHILD-HARNESS-ERROR');});
