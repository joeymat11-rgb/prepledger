'use strict';
// Reviewer-owned same-input R/S and original clock-witness comparisons.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2-r2'),pub=path.join(base,'public'),out=path.join(base,'results');
const C='c4716edad91453e74ba17f70ab076781ff5367de',R='6c9248e695a4478abdbaae0f9f48395ac56000fa',oldClock='68c1da3';
assert.equal(process.version,'v22.23.2');assert.equal(process.env.TZ,'America/New_York');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),git=(...a)=>cp.execFileSync('git',a,{cwd:root,windowsHide:true,maxBuffer:8e6}),manifest=JSON.parse(fs.readFileSync(path.join(base,'public-manifest.json')));
const engineFiles=manifest.files.filter(r=>/^rebuild\/engine\/[^/]+\.cjs$/.test(r.file));
function copy(ref,label,writerRef=null){const dir=path.join(base,label),rows=[];fs.mkdirSync(dir,{recursive:true});for(const r of manifest.files){const isEngine=engineFiles.includes(r),selected=writerRef&&r.file==='rebuild/engine/writers.cjs'?writerRef:ref,b=isEngine?git('show',selected+':'+r.file):fs.readFileSync(path.join(pub,r.file));if(!isEngine)assert.equal(sha(b),r.sha256);assert(!/seed|private|soak|history/i.test(r.file));const f=path.join(dir,r.file);fs.mkdirSync(path.dirname(f),{recursive:true});if(fs.existsSync(f))assert.deepEqual(fs.readFileSync(f),b);else fs.writeFileSync(f,b);rows.push({file:r.file,sha256:sha(b),source:isEngine?selected:C});}fs.writeFileSync(path.join(out,label+'-manifest.json'),JSON.stringify(rows,null,2)+'\n');return dir;}
const rDir=copy(R,'public-R'),clockDir=copy(oldClock,'public-clock-witness');
const H=require(path.join(pub,'rebuild/engine/test/b1b2-public-engine.cjs')),HR=require(path.join(rDir,'rebuild/engine/test/b1b2-public-engine.cjs')),HC=require(path.join(clockDir,'rebuild/engine/test/b1b2-public-engine.cjs'));
const writerDir=copy(C,'public-writer-witness',oldClock),HW=require(path.join(writerDir,'rebuild/engine/test/b1b2-public-engine.cjs'));
const date=(s,days)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);};
function state(kind='full'){
 const s=H.syntheticState();s.exercises=[];s.sleep.nights=[];if(kind==='empty')return s;
 s.exercises=['press','row','curl','extension'].map((id,i)=>({id,n:'Synthetic '+id,w:100,inc:5,sets:2,hi:10,setup:'synthetic',day:'U',mg:['chest','back','biceps','quads'][i],last:[8,7]}));s.exOrder={U:s.exercises.map(e=>e.id),L:[]};
 for(const d of ['2026-08-24','2026-08-26','2026-08-28','2026-08-31'])s.sessionLog[d]={entries:s.exercises.map(e=>({id:e.id,w:100,reps:[8,7],rir:1,rirSets:[1,1]}))};
 for(let i=0;i<28;i++){const d=date('2026-08-06',i);s.reads.push({d,w:180});s.dailyLogs[d]={cal:2400,protein:180,steps:10000};}return s;
}
function observe(helper,s){const events=[],original=helper.clockAt('2026-09-03'),clock={...original};for(const[k,v]of Object.entries(original))if(typeof v==='function')clock[k]=(...args)=>{const result=v(...args);events.push({kind:'clock',name:k,args,result});return result;};let ids=0;const id={};for(const name of ['fresh','next'])id[name]=(...args)=>{const result='review-id-'+(++ids);events.push({kind:'id',name,args,result});return result;};const E=helper.createEngine({clock,ids:id}).__test,before=structuredClone(s),output=E.runAdaptive(s,'2026-09-03');assert.deepEqual(s,before);return{events,output};}
function diff(a,b,p='$',rows=[]){if(Object.is(a,b))return rows;if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(!Object.hasOwn(a,k)||!Object.hasOwn(b,k))rows.push({path:p+'.'+k,before:a[k],after:b[k]});else diff(a[k],b[k],p+'.'+k,rows);}else rows.push({path:p,before:a,after:b});return rows;}
const traces=[];
for(const [kind,n1,n2]of [['nooffer',5,18],['sealed',28,92],['knownoffer',23,115],['unknownoffer',23,115],['unknownstanddown',23,115],['watchstanddown',22,95]]){
 const s=state(kind==='nooffer'?'empty':'full');if(kind==='sealed')s.blackout.until='2026-09-10';
 if(!['nooffer','sealed'].includes(kind)){s.sleep.cleanH=8;s.sleep.nights=[{d:'2026-09-02',h:2},{d:'2026-09-03',h:8}];if(kind!=='knownoffer')delete s.sleep.cleanH;}
 if(kind.includes('standdown'))s.proposals=[{rid:'recovery_test',resolved:false}];
 if(kind==='watchstanddown'){s.exercises[0].holdFlag=true;s.exercises[1].holdFlag=true;s.sessionLog['2026-09-01']={entries:[],niggles:['joint']};}
 const a=observe(HR,structuredClone(s)),b=observe(HC,structuredClone(s)),c=observe(H,structuredClone(s)),w=observe(HW,structuredClone(s));
 // R7 deliberately changes unknown-target band/eligibility. Isolate the writer
 // using its original source with the SAME current dependency semantics.
 assert.deepEqual(c.events,w.events,kind+' unchanged lazy writer full clock/ID trace on current R7 dependencies');assert.deepEqual(c.events.filter(e=>e.kind==='clock').map(e=>e.name),[...Array(n1).fill('today'),'hour',...Array(n2).fill('today')]);
 if(['nooffer','sealed','knownoffer'].includes(kind)){assert.deepEqual(c.events,b.events,kind+' whole original trace');assert.deepEqual(c.output,b.output,kind+' unchanged full writer output');}
 traces.push({kind,R:a,originalClockWitness:b,S:c,originalWriterOnS:w,RtoS:diff(a.output,c.output),witnessToS:diff(b.output,c.output),clockRtoS:diff(a.events,c.events)});
}
fs.writeFileSync(path.join(out,'clock-independent.json'),JSON.stringify({traces,provenanceCorrection:'Initial same-full-runtime-68c equality check refused on unknownoffer. PM246 R7 intentionally changes that band/branch. All six original-writer-on-current-R7 traces are checked separately; no mixed-runtime equality claim.'},null,2)+'\n');
const targetCases=[['missing',undefined],['null',null],['string','8'],['NaN',NaN],['infinity',Infinity],['negative-infinity',-Infinity],['eight',8],['nine',9]],pairs=[];
for(const [name,target]of targetCases)for(const debt of ['short','three-night'])for(const warning of ['none','watch','low']){
 const s=state();if(target===undefined)delete s.sleep.cleanH;else s.sleep.cleanH=target;
 s.sleep.nights=debt==='short'?[{d:'2026-09-02',h:2},{d:'2026-09-03',h:8}]:['2026-09-01','2026-09-02','2026-09-03'].map(d=>({d,h:6.6}));
 if(warning!=='none'){s.exercises[0].holdFlag=true;s.exercises[1].holdFlag=true;s.sessionLog['2026-09-01']={entries:[],niggles:warning==='low'?['joint','joint','joint']:['joint'],dips:warning==='low'?2:0};}
 const T=H.createEngine({clock:H.clockAt('2026-09-03'),ids:{fresh:()=> 'review-unused'}}).__test,before=structuredClone(s),rec=T.recoveryIndex(s),sleep=rec.flags.find(f=>f.k==='sleep');assert(sleep,'actual recorded sleep/debt flag');assert(T.currentSleepObservation(s));assert(!rec.sleepEvidence,'observed sleep cannot be absence');assert.equal(T.sleepInfo(s).targetKnown,Number.isFinite(target));
 if(!Number.isFinite(target)){assert.equal(sleep.cost,null);assert.equal(rec.score,null);assert.equal(rec.lever,null);assert.equal(rec.band,{none:'UNKNOWN',watch:'WATCH',low:'LOW'}[warning]);}
 else if(debt==='short')assert.equal(sleep.cost,target===8?20:30);
 const adaptive=T.runAdaptive(s,'2026-09-03');if(warning==='low'&&!Number.isFinite(target)){const line=adaptive.feed.find(f=>f.t.startsWith('RECOVERY LOW'));assert(line);for(const f of rec.flags){assert(line.how.includes(f.receipt));assert(line.how.includes(f.fix));}}
 if(!Number.isFinite(target))assert.doesNotMatch(T.askContext(s),/He already clears his target\./);
 assert.deepEqual(s,before);pairs.push({target:name,debt,warning,recovery:rec,adaptive,levers:T.fiveLevers(s),fix:T.theOneFix(s)});
}
// Same literal public-law graph and invented state on R and S; no protected census.
const env={...process.env,TZ:'America/New_York',TEMP:path.join(base,'temp'),TMP:path.join(base,'temp')};for(const k of Object.keys(env))if(/^(NODE_OPTIONS|NODE_PATH|NODE_V8_COVERAGE|V8_COVERAGE|V8_FLAGS|NODE_TEST_CONTEXT|NODE_TEST_WORKER_ID|MEASURED_TEST_NOW|PL_ENGINE|PL_LAWS_LIB)$/i.test(k))delete env[k];
const run=cp.spawnSync(process.execPath,['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','--public-laws'],{cwd:rDir,env,encoding:'utf8',windowsHide:true,maxBuffer:64e6});assert.ifError(run.error);assert.equal(run.status,0,run.stderr);fs.writeFileSync(path.join(out,'public-laws-R.stdout.log'),run.stdout);fs.writeFileSync(path.join(out,'public-laws-R.stderr.log'),run.stderr);
const r=JSON.parse(fs.readFileSync(path.join(rDir,'.tmp/b1b2-public-audit/public-laws-candidate.json'))),s=JSON.parse(fs.readFileSync(path.join(pub,'.tmp/b1b2-public-audit/public-laws-successor.json')));assert.equal(r.rows.length,45);assert.deepEqual(r.totals,s.totals);
const changes=diff(r.rows,s.rows);assert.deepEqual(changes.map(x=>x.path),['$.24.frames.0.result.list.3.detail','$.24.frames.0.result.sleep.detail']);assert.equal(r.rows[24].defect,'D25');for(const change of changes){assert.equal(change.before,"99 nights dark — can't read");assert.equal(change.after,'current sleep not recorded');}
assert.deepEqual(r.rows.find(x=>x.defect==='D22'),s.rows.find(x=>x.defect==='D22'));assert.deepEqual(r.rows.find(x=>x.defect==='D45'),s.rows.find(x=>x.defect==='D45'));
for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(pub,row.file))),row.sha256);
const result={candidate:C,R,clockWitness:git('rev-parse',oldClock).toString().trim(),clockCases:traces,availabilityCases:pairs,publicLaws:{totals:r.totals,changes,Rsha256:sha(JSON.stringify(r)),Ssha256:sha(JSON.stringify(s)),RstdoutSHA256:sha(run.stdout),D22andD45Unchanged:true,allOtherFramesAndInputsEqual:true},publicRestored:true};
fs.writeFileSync(path.join(out,'consumer-independent.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({clockWitnessCases:traces.length,availabilityCases:pairs.length,publicLawChanges:changes,allSourcesRetained:true}));
