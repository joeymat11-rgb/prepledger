'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2'),pub=path.join(base,'public');
assert.equal(process.version,'v22.23.2');assert.equal(process.env.TZ,'America/New_York');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),m=JSON.parse(fs.readFileSync(path.join(base,'public-manifest.json')));for(const row of m.files)assert.equal(sha(fs.readFileSync(path.join(pub,row.file))),row.sha256);
const H=require(path.join(pub,'rebuild/engine/test/b1b2-public-engine.cjs')),T=H.createEngine({clock:H.clockAt('2026-09-03')}).__test,rows=[];
for(const[name,h]of [['missing',undefined],['null',null],['string','8'],['NaN',NaN],['Infinity',Infinity],['negative Infinity',-Infinity]]){
 const s=H.syntheticState();s.exercises=[];const latest={d:'2026-09-02'};if(h!==undefined)latest.h=h;s.sleep.nights=[{d:'2026-08-31',h:8},{d:'2026-09-01',h:8},latest];s.reads=[{d:'2026-09-03',w:180,pt:180}];s.dailyLogs={'2026-09-02':{cal:2200,pro:180,steps:10000},'2026-09-03':{cal:2200,pro:180,steps:10000}};s.sessionLog={'2026-09-03':{entries:[]}};
 const before=structuredClone(s),recovery=T.recoveryIndex(s),owed=T.nowFocus(s).owed,lever=T.fiveLevers(s).sleep,fix=T.theOneFix(s);assert.equal(recovery.band,'UNKNOWN');assert.equal(recovery.score,null);assert.equal(owed.length,0);assert.deepEqual(s,before);
 rows.push({name,recovery:{band:recovery.band,score:recovery.score},owed:owed.length,lever,fix:{rung:fix.rung,title:fix.title}});
}
const evidence={candidate:m.candidate,kind:'six direct observations; not six additional passing acceptance tests',rows};fs.writeFileSync(path.join(base,'results/consumer-observations.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
