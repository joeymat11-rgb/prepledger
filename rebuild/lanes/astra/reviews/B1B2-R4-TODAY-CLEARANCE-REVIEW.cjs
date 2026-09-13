'use strict';
// A named unresolved R7 consumer join, identified during final synthesis.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),test=require('node:test');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2-r4'),pub=path.join(base,'public');
assert.equal(process.version,'v22.23.2');assert.equal(process.env.TZ,'America/New_York');
for(const r of JSON.parse(fs.readFileSync(path.join(base,'public-manifest.json'))).files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(pub,r.file))).digest('hex'),r.sha256);
const H=require(path.join(pub,'rebuild/engine/test/b1b2-public-engine.cjs'));
function fixture(target,debt){
 const s=H.syntheticState();s.exercises=[];
 if(target===undefined)delete s.sleep.cleanH;else s.sleep.cleanH=target;
 // owedNights checks all three previous calendar nights. Include those actual
 // invented records so no logging reminder masks the real Today decision.
 s.sleep.nights=debt==='short'?
  [{d:'2026-08-31',h:8},{d:'2026-09-01',h:8},{d:'2026-09-02',h:2},{d:'2026-09-03',h:8}]:
  ['2026-08-31','2026-09-01','2026-09-02','2026-09-03'].map(d=>({d,h:6.6}));
 s.reads=[{d:'2026-09-03',w:180,pt:180}];
 s.dailyLogs=Object.fromEntries(['2026-08-31','2026-09-01','2026-09-02','2026-09-03'].map(d=>[d,{cal:2200,pro:180,steps:10000}]));
 s.sessionLog={'2026-09-03':{entries:[]}};return s;
}
const targets=[['missing',undefined],['null',null],['string','8'],['NaN',NaN],['infinity',Infinity],['negative-infinity',-Infinity],['eight',8],['nine',9]];
for(const [name,target]of targets)for(const debt of ['short','three-night'])test('REVIEW R7 Today clearance '+name+' '+debt,()=>{
 const s=fixture(target,debt),before=structuredClone(s),T=H.createEngine({clock:H.clockAt('2026-09-03')}).__test;
 const rec=T.recoveryIndex(s),owed=T.nowFocus(s).owed,levers=T.fiveLevers(s),fix=T.theOneFix(s),order=T.marchingOrder(s),now=T.nowModel(s),sleep=rec.flags.find(f=>f.k==='sleep');
 assert.equal(owed.length,0,'all logging prerequisites satisfied; real decision is reached');assert(sleep,'a real observed sleep/debt warning must exist');assert(T.currentSleepObservation(s));assert.deepEqual(s,before);
 const result={target:name,debt,input:s,recovery:rec,owed,sleepLever:levers.sleep,fix,order,now,inputPreserved:true};console.log('REVIEW_TODAY_CLEARANCE '+JSON.stringify(result));
 if(Number.isFinite(target)){
  assert.equal(sleep.cost,target===8&&debt==='short'?20:30,'R7 finite target control');
  assert.equal(fix.rung,'sleep','known target retains its actual protective instruction');
  assert.equal(now.move.kind,'fix');assert.equal(now.move.lever,'SLEEP');
  assert.equal(order.why,fix.title);return;
 }
 assert.equal(sleep.cost,null);assert.equal(rec.score,null);assert.equal(rec.lever,null);assert.equal(rec.band,'UNKNOWN');assert.equal(levers.sleep.state,'quiet');
 // PM246 R7 clauses4-6: missing total/leader cannot mean nothing to fix or
 // positive clearance. This assertion does not require a fabricated target,
 // new restriction, different rung, or a new policy for what to do instead.
 assert.doesNotMatch(JSON.stringify({fix,order,move:now.move}),/Nothing to fix|five are covered|no lever worth pulling|sleep are all covered|NOTHING NEEDS YOU/,'R7-TODAY-FALSE-CLEARANCE: observed debt and unavailable contribution cannot become an all-clear');
});
