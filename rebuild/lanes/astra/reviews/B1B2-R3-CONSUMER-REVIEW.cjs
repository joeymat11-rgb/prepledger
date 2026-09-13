'use strict';
// Independent actual S/T consumers. Only the separately admitted synthetic graph.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2-r3'),pub=path.join(base,'public'),prior=path.join(base,'prior-public'),results=path.join(base,'results');
const C='8e65805481091daacda3266ad9113b49553cf3f4',OLD='c4716edad91453e74ba17f70ab076781ff5367de';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),json=p=>JSON.parse(fs.readFileSync(p));
assert.equal(process.version,'v22.23.2');assert.equal(process.env.TZ,'America/New_York');
const previous=json(path.join(root,'.tmp/r3-review/prior-evidence.json')),manifest=json(path.join(base,'public-manifest.json'));
for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(pub,row.file))),row.sha256,row.file);
for(const row of previous.publicManifest.files){
 assert(!/(^ledger\/|\/seed\.cjs$|\/private\/|soak)/.test(row.file));
 const target=path.join(prior,row.file);if(!fs.existsSync(target)){const b=cp.execFileSync('git',['show',OLD+':'+row.file],{cwd:root,windowsHide:true,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']});assert.equal(sha(b),row.sha256);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);}
 assert.equal(sha(fs.readFileSync(target)),row.sha256,row.file+' original S custody');
}
const H={S:require(path.join(prior,'rebuild/engine/test/b1b2-public-engine.cjs')),T:require(path.join(pub,'rebuild/engine/test/b1b2-public-engine.cjs'))};
function dateOffset(day,n){const [y,m,d]=day.split('-').map(Number);return new Date(Date.UTC(y,m-1,d+n)).toISOString().slice(0,10);}
function fixture(target,debt='short',day='2026-09-03'){
 const s=H.T.syntheticState();s.exercises=[];if(target===undefined)delete s.sleep.cleanH;else s.sleep.cleanH=target;
 s.sleep.nights=[-3,-2,-1,0].map(n=>({d:dateOffset(day,n),h:debt==='short'?(n===-1?2:8):debt==='three-night'?6.6:debt==='ten'?10:8}));
 s.reads=[{d:day,w:180,pt:180}];s.dailyLogs=Object.fromEntries([-3,-2,-1,0].map(n=>[dateOffset(day,n),{cal:2200,pro:180,steps:10000}]));s.sessionLog={[day]:{entries:[]}};return s;
}
function control(kind){
 const spec={calories:['2026-08-01',0,'cut'],break:['2026-11-12',0,'cut'],rate:['2026-09-03',3,'maintenance'],steps:['2026-09-03',1,'cut'],logging:['2026-09-03',null,null],decisions:['2026-09-03',null,null]}[kind];
 const [day,loss,phase]=spec,s=fixture(undefined,'short',day);
 if(loss!==null){s.reads=Array.from({length:28},(_,i)=>({d:dateOffset(day,i-27),w:180+(27-i)*loss/7,pt:180+(27-i)*loss/7}));s.dailyLogs=Object.fromEntries(s.reads.map(r=>[r.d,{cal:2200,pro:180,steps:10000}]));s.plan.phase=phase;}
 if(kind==='steps')s.dailyLogs[day].steps=1000;if(kind==='logging')s.sleep.nights.shift();if(kind==='decisions')s.proposals=[{rid:'r8-decision',title:'Review recorded change',why:'An existing decision needs your answer.',resolved:false}];return{s,day};
}
function fixed(day){const trace=[],basic=H.T.clockAt(day),clock={...basic};for(const k of Object.keys(basic))if(typeof basic[k]==='function')clock[k]=(...args)=>{const value=basic[k](...args);trace.push({key:k,value});return value;};return{clock,trace};}
function advancing(startMs,stepMs){
 const trace=[],clock={tz:'America/New_York'};let index=0;
 const day=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const getters={today:day,hour:d=>d.getHours(),dow:d=>d.getDay(),nowISO:d=>d.toISOString(),nowMs:d=>d.getTime()};
 for(const [key,fn]of Object.entries(getters))clock[key]=()=>{const ms=startMs+stepMs*index++,value=fn(new Date(ms));trace.push({key,value,ms});return value;};return{clock,trace};
}
function read(side,input,day='2026-09-03',mode='standard',time){
 const s=structuredClone(input),before=structuredClone(s),ctx=time||fixed(day),E=H[side].createEngine({clock:ctx.clock,ids:{fresh:()=>assert.fail('Today must not allocate ID')}}).__test;
 let out;if(mode==='single-fix')out=E.theOneFix(s);else if(mode==='single-order')out=E.marchingOrder(s);else if(mode==='single-now')out=E.nowModel(s);else{
  let rate,energy;if(mode==='control'){rate=E.currentRate(s);energy=E.energyBalanceTarget(s);}
  let rec,focus,levers;if(mode==='control'){focus=E.nowFocus(s);levers=E.fiveLevers(s);rec=E.recoveryIndex(s);}else{rec=E.recoveryIndex(s);focus=E.nowFocus(s);levers=E.fiveLevers(s);}
  out={rec,focus,levers,fix:E.theOneFix(s),order:E.marchingOrder(s),now:E.nowModel(s),...(mode==='control'?{rate,energy}:{})};
 }
 assert.deepEqual(s,before,'complete state preserved');return{out,trace:ctx.trace,inputPreserved:true};
}
const plain=t=>String(t).replace(/the deficit/g,'the calorie cut').replace(/\bdeficit\b/gi,'calorie cut').replace(/^(\w+)\s+\1\b/i,'$1');
function warnings(out){assert(out.rec.flags.length);for(const f of out.rec.flags)for(const [text,transform]of [[out.fix.body,x=>x],[out.order.why,x=>x],[out.now.move.body,plain]])for(const v of [f.receipt,f.fix])assert(text.includes(transform(v)),'actual unranked receipt/action retained: '+f.k);}
function noClearance(out){assert.doesNotMatch(JSON.stringify({fix:out.fix,order:out.order,move:out.now.move}),/Nothing to fix|five are covered|no lever worth pulling|sleep are all covered|NOTHING NEEDS YOU/);}
const targets=[['missing',undefined],['null',null],['string','8'],['NaN',NaN],['positiveInfinity',Infinity],['negativeInfinity',-Infinity],['eight',8],['nine',9]];
if(require.main===module){
const observations=[];function pair(name,s,day='2026-09-03',mode='standard'){const S=read('S',s,day,mode),T=read('T',s,day,mode);assert.deepEqual(T.out.rec,S.out.rec,'recovery itself unchanged');assert.deepEqual(T.out.focus,S.out.focus);assert.deepEqual(T.out.levers,S.out.levers);observations.push({name,input:s,day,S,T});return{S,T};}
for(const [name,target]of targets)for(const debt of ['short','three-night']){
 const {S,T}=pair('target-'+name+'-'+debt,fixture(target,debt));assert.equal(T.out.focus.owed.length,0);
 if(Number.isFinite(target)){assert.deepEqual(T,S,'complete finite outputs and clock values');continue;}
 warnings(T.out);noClearance(T.out);assert.equal(T.out.rec.lever,null);assert.equal(T.out.fix.lever,null);assert.equal(T.out.fix.state,'quiet');
 for(const text of [T.out.fix.body,T.out.order.why,T.out.now.move.body])assert(text.includes('Recovery rating unavailable.'));
}
for(const [name,target]of targets.slice(0,6)){
 const {T}=pair('healthy-'+name,fixture(target,'healthy'));assert.equal(T.out.rec.flags.length,0);assert.equal(T.out.rec.score,100);noClearance(T.out);assert.doesNotMatch(T.out.fix.body,/Recovery rating unavailable|Recorded recovery warnings/);
 const s=fixture(8,'healthy');s.sleep.nights.pop();if(target===undefined)delete s.sleep.nights.at(-1).h;else s.sleep.nights.at(-1).h=target;
 const missing=pair('invalid-observation-'+name,s).T;assert.equal(missing.out.rec.score,null);assert.equal(missing.out.rec.flags.length,0);noClearance(missing.out);for(const text of [missing.out.fix.body,missing.out.order.why,missing.out.now.move.body])assert.match(text,/current sleep not recorded/);
}
for(const target of [8,9]){const {S,T}=pair('known-healthy-'+target,fixture(target,'ten'));assert.deepEqual(T,S);}
for(const [name,held,joints,dips,band]of [['minor',1,0,0,'UNKNOWN'],['watch',2,1,0,'WATCH'],['low',2,3,2,'LOW']]){
 const s=fixture(undefined);s.exercises=Array.from({length:held},(_,i)=>({id:'held'+i,n:'Held'+i,holdFlag:true}));s.sessionLog['2026-09-01']={entries:[],niggles:Array(joints).fill('joint'),dips};
 const {T}=pair('independent-'+name,s);assert.equal(T.out.rec.band,band);assert.equal(T.out.rec.lever,null);warnings(T.out);noClearance(T.out);
}
for(const kind of ['calories','break','rate','steps','logging','decisions']){
 const {s,day}=control(kind),{S,T}=pair('precedence-'+kind,s,day,'control');
 if(['logging','steps'].includes(kind)){assert.deepEqual(T,S,'complete precedence outputs and clock values');continue;}
 assert.equal(T.out.now.move.kind,S.out.now.move.kind);assert.deepEqual(T.out.now.workout,S.out.now.workout);assert.deepEqual(T.out.now.eat,S.out.now.eat);assert.deepEqual(T.out.now.status,S.out.now.status);assert.deepEqual(T.out.now.headed,S.out.now.headed);
 if(kind==='decisions'){assert.deepEqual(T.out.now,S.out.now);continue;}
 warnings(T.out);noClearance(T.out);assert.equal(T.out.fix.rung,S.out.fix.rung);assert.equal(T.out.fix.lever,S.out.fix.lever);assert.equal(T.out.order.thenText,S.out.order.thenText);
}
{
 const s=fixture(undefined),day='2026-09-03';s.reads=Array.from({length:28},(_,i)=>({d:dateOffset(day,i-27),w:180+(27-i)*1.72/7+[0,0.1,-0.1][i%3],pt:180+(27-i)*1.72/7}));s.dailyLogs=Object.fromEntries(s.reads.map(r=>[r.d,{cal:2200,pro:180,steps:10000}]));const {S,T}=pair('actual-foresight',s);assert(T.out.order.foresight);assert.deepEqual(T.out.order.foresight,S.out.order.foresight);warnings(T.out);noClearance(T.out);assert.match(T.out.order.why,/Approaching the lean-loss rate/);
}
assert.equal(observations.length,40);
// Verify the author's committed S full-output/trace constants against actual S,
// after independently deriving the fixtures and assertions above.
const testSource=fs.readFileSync(path.join(pub,'rebuild/engine/test/b1b2-sleep-target-cells.cjs'),'utf8'),referenceChecks=[];
for(const name of ['FINITE','CONTROLS','KNOWN_HEALTHY']){
 const match=testSource.match(new RegExp('^const R8_'+name+'_S = (.+);$','m'));assert(match);const refs=JSON.parse(match[1]);
 for(const ref of refs){const key=name==='FINITE'?'target-'+(ref.target===8?'eight':'nine')+'-'+ref.debt:name==='CONTROLS'?'precedence-'+ref.kind:'known-healthy-'+ref.target;const row=observations.find(x=>x.name===key);assert(row);const {fix,order,now}=row.S.out;assert.deepEqual(JSON.parse(JSON.stringify({fix,order,now})),ref.outputs,key+' reference outputs from actual S');assert.deepEqual(row.S.trace.map(x=>x.key),ref.trace,key+' reference full clock sequence from actual S');referenceChecks.push(key);}
}
// Boundary clock is one coherent local timeline: every actual getter costs1ms.
// Set midnight just beyond the complete old call, so S cannot cross it. This
// tests a value/decision effect of added queries, rather than rejecting a count.
const clocks=[];
for(const [name,s]of [['unknown-short',fixture(undefined)],['unknown-healthy',fixture(undefined,'healthy')],['finite-sleep',fixture(8)],['finite-healthy',fixture(8,'ten')],['logging',control('logging').s],['steps',control('steps').s],['decisions',control('decisions').s]])for(const mode of ['single-fix','single-order','single-now']){
 const midnight=Date.parse('2026-09-04T00:00:00.000-04:00'),fixedS=read('S',s,'2026-09-03',mode,advancing(midnight-1000,0)),fixedT=read('T',s,'2026-09-03',mode,advancing(midnight-1000,0));
 const start=midnight-fixedS.trace.length-1,S=read('S',s,'2026-09-03',mode,advancing(start,1)),T=read('T',s,'2026-09-03',mode,advancing(start,1));assert(S.trace.every(x=>x.ms<midnight));
 const project=x=>mode==='single-now'?{tISO:x.tISO,status:x.status,eat:x.eat,decisionsN:x.decisionsN,workout:x.workout,headed:x.headed,moveKind:x.move.kind,moveLever:x.move.lever}:mode==='single-order'?{owed:x.owed,kind:x.kind,ifText:x.ifText,thenText:x.thenText,targetLine:x.targetLine,link:x.link,more:x.more,foresight:x.foresight}:{rung:x.rung,lever:x.lever};
 const valueEffects=JSON.stringify(project(S.out))!==JSON.stringify(project(T.out));
 if(['finite-sleep','finite-healthy','logging','steps'].includes(name)){assert.deepEqual(T,S,'unchanged actual advancing-clock control '+name+'/'+mode);}
 clocks.push({name,mode,startISO:new Date(start).toISOString(),stepMs:1,fixedCounts:{S:fixedS.trace.length,T:fixedT.trace.length},S,T,unchangedBusinessProjection:!valueEffects,Sprojection:project(S.out),Tprojection:project(T.out)});
}
const evidence={candidate:C,priorCandidate:OLD,builderReportRead:false,observations,referenceChecks,clocks,scope:'40 fixed-clock actual paired controls plus21 coherent advancing-clock boundary comparisons; no source replacement, private/native/browser/CI run'};
fs.writeFileSync(path.join(results,'consumer-independent.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({fixedPairs:observations.length,originalSReferenceChecks:referenceChecks.length,boundaryPairs:clocks.length,valueEffects:clocks.filter(x=>!x.unchangedBusinessProjection).map(x=>({name:x.name,mode:x.mode,counts:x.fixedCounts,S:x.Sprojection,T:x.Tprojection})),unchangedControls:12}));
}
module.exports={fixture,control,read,advancing,root,base,pub,prior,results,C,OLD};
