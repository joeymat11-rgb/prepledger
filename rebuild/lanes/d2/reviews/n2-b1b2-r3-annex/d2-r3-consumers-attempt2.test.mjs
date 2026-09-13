import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {DAY,NIGHT,device,projected,collections,consumers} from './d2-r2-support.mjs';
import TodayModel from '../rebuild/m3/w7-preview/today/today-model.cjs';
import TodayApp from '../rebuild/m3/w7-preview/today/today-app.cjs';
import design from '../rebuild/m3/w7-preview/today/design.cjs';
// Invented fixture prerequisites, selected from the unchanged real consumers before
// observing this candidate. No engine/reader factory or operation is substituted.
const targets=[['absent',undefined],['null',null],['string','8'],['NaN',NaN],['Infinity',Infinity],['negativeInfinity',-Infinity]];
const clear=/nothing needs you|nothing to fix|the five are covered|sleep are all covered/i;
const observations=[];
function fullBasis(target,rows=[]) {
  const input=TodayModel.createTodayModel({today:DAY}).basisState();
  input.reads.push({d:DAY,w:180,note:'D2 invented satisfied morning read',sealed:false});
  input.dailyLogs[DAY]={cal:2300,pro:170,steps:8500};
  // nowFocus also requires three recorded nights. These three dated, old 8h
  // synthetic basis rows satisfy that count without inventing a current night.
  // The initial attempt omitted them and stopped at the night-logging prerequisite.
  input.sleep.nights=[...['2030-01-29','2030-01-30','2030-01-31'].map(d=>({d,h:8})),...rows];
  if(target===undefined) delete input.sleep.cleanH; else input.sleep.cleanH=target;
  return input;
}
function prerequisites(E,state) {
  assert.deepEqual(E.nowFocus(state).owed,[],'No logging prerequisite may hide the changed rung');
  assert.notEqual(E.fiveLevers(state).steps.state,'caution','No steps prerequisite may hide the changed rung');
}
async function inspect(model,kind,expectedSleep) {
  const state=model.stateFromOps(),before=structuredClone(state),E=model.engine;
  prerequisites(E,state);
  const recovery=E.recoveryIndex(state),fix=E.theOneFix(state),march=E.marchingOrder(state),now=E.nowModel(state);
  const sleep=recovery.flags.find(f=>f.k==='sleep');
  assert.equal(Boolean(sleep),expectedSleep,'Observed debt remains distinct from absent/healthy observation');
  assert.equal(E.fiveLevers(state).sleep.state,'quiet');
  assert.equal(fix.lever,null); assert.equal(fix.state,'quiet');
  assert.doesNotMatch(JSON.stringify([fix,march,now.move]),clear);
  if(expectedSleep) {
    assert.equal(sleep.cost,null); assert.equal(recovery.score,null); assert.equal(recovery.lever,null);
    for(const value of [fix.body,march.why,now.move.body]) {
      assert.ok(value.includes(sleep.receipt),'Actual observed receipt remains');
      assert.ok(value.includes(sleep.fix),'Actual independently justified action remains');
    }
  } else {
    assert.match(fix.body,/current sleep not recorded|sleep target not recorded/);
    assert.doesNotMatch(fix.body,/observed short night or three-night sleep debt/);
  }
  const dom=new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml()),{url:'http://127.0.0.1/'});
  try {
    const api=TodayApp.mountToday(dom.window.document,model);
    await api.checkInKitReady(); await api.render('today');
    const instruction=dom.window.document.querySelector('[data-slot="instruction"]').textContent;
    const todayText=dom.window.document.getElementById('phone').textContent;
    assert.equal(instruction,now.move.title);
    assert.doesNotMatch(todayText,/NaN|undefined/); assert.doesNotMatch(todayText,clear);
    assert.ok(dom.window.document.querySelector('[data-go="why"]'),'Explanation has an actual visible route');
    await api.render('why');
    const why=dom.window.document.querySelector('[data-slot="why-lead"]').textContent;
    assert.doesNotMatch(why,clear);
    if(expectedSleep) {
      assert.ok(why.includes(sleep.receipt),'Real rendered explanation preserves the receipt');
      assert.ok(why.includes(sleep.fix),'Real rendered explanation preserves the action');
    }
    observations.push({kind,observedHours:E.currentSleepObservation(state)?.h??null,recovery,fix,march,move:now.move,instruction,why});
  } finally {dom.window.close();}
  assert.deepEqual(state,before,'Complete input remains unchanged');
}
for(const form of ['previous-short/current8','three-consecutive6.6']) for(const [label,target] of targets) {
  test('R3 fully logged '+form+' with '+label+' target renders unranked receipt and action',async()=>{
    const kit=await device();
    try {
      const dates=form==='previous-short/current8'?[NIGHT]:['2030-02-01','2030-02-02',NIGHT];
      for(const date of dates) assert.equal((await kit.host.save({date,hours:form==='previous-short/current8'?2:6.6},{supersedes:null})).ok,true);
      const basis=fullBasis(target,form==='previous-short/current8'?[{d:DAY,h:8}]:[]);
      // A same-date 8h row is explicitly pre-existing synthetic basis. N2 cannot
      // save an uncompleted night, so it is never called a genuine N2 write.
      const model=await projected(kit.host,basis),before=await collections(kit.host);
      await inspect(model,form+'/'+label,true);
      assert.deepEqual(await collections(kit.host),before,'Read/render append nothing');
      if(label==='absent') await consumers(model,kit,NIGHT,form==='previous-short/current8'?2:6.6);
    } finally {kit.host.close();}
  });
}
for(const target of [8,9]) test('R3 finite target '+target+' preserves genuine previous2/current8 costs and actual consumer route',async()=>{
  const kit=await device();
  try {
    assert.equal((await kit.host.save({date:NIGHT,hours:2},{supersedes:null})).ok,true);
    const model=await projected(kit.host,fullBasis(target,[{d:DAY,h:8}])),state=model.stateFromOps(),E=model.engine;
    prerequisites(E,state);
    const r=E.recoveryIndex(state),s=r.flags.find(f=>f.k==='sleep');
    assert.equal(E.atSleepTarget(state).run,target===8?1:0);
    assert.equal(s.cost,target===8?20:30);assert.equal(r.score,target===8?80:70);assert.equal(r.band,target===8?'GREEN':'WATCH');
    assert.equal(E.theOneFix(state).rung,'sleep');assert.equal(E.theOneFix(state).recoveryNote,undefined);
    await consumers(model,kit,NIGHT,2);
    observations.push({kind:'finite'+target,recovery:r,fix:E.theOneFix(state),move:E.nowModel(state).move});
  } finally {kit.host.close();}
});
for(const hours of [0,2,8]) test('R3 genuine '+hours+'h remains distinct under fully logged missing-target rendering and Start',async()=>{
  const kit=await device();
  try {
    assert.equal((await kit.host.save({date:NIGHT,hours},{supersedes:null})).ok,true);
    const model=await projected(kit.host,fullBasis(undefined));
    assert.equal(model.engine.currentSleepObservation(model.stateFromOps()).h,hours);
    await inspect(model,'real'+hours,hours<6.5);
    await consumers(model,kit,NIGHT,hours);
  } finally {kit.host.close();}
});
for(const [label,rows] of [['missing',[]],['null',[{d:NIGHT,h:null}]],['string',[{d:NIGHT,h:'2'}]],['NaN',[{d:NIGHT,h:NaN}]],['Infinity',[{d:NIGHT,h:Infinity}]],['stale',[{d:'2030-02-01',h:2}]],['future',[{d:'2030-02-05',h:2}]]]) {
  test('R3 fully logged '+label+' observation stays unavailable in actual consumer',async()=>{
    const kit=await device();
    try {
      const model=await projected(kit.host,fullBasis(8,rows));
      assert.equal(model.engine.currentSleepObservation(model.stateFromOps()),null);
      await inspect(model,label,false);await consumers(model,kit,null,null);
    } finally {kit.host.close();}
  });
}
test.after(()=>fs.writeFileSync('.tmp/d2-r3-consumer-observations.json',JSON.stringify(observations,null,2)+'\n'));
