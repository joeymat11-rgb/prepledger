import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {JSDOM} from 'jsdom';
import {DAY,NIGHT,device,projected,collections} from './d2-r2-support.mjs';
import TodayModel from '../rebuild/m3/w7-preview/today/today-model.cjs';
import TodayApp from '../rebuild/m3/w7-preview/today/today-app.cjs';
import design from '../rebuild/m3/w7-preview/today/design.cjs';
for(const hot of [false,true])test('R3 fully logged independent held/joint'+(hot?'/hot':'')+' warnings retain every actual receipt and action',async()=>{
  const kit=await device();try{
    assert.equal((await kit.host.save({date:NIGHT,hours:2},{supersedes:null})).ok,true);
    const input=TodayModel.createTodayModel({today:DAY}).basisState();
    input.reads.push({d:DAY,w:180,note:'D2 invented full logging prerequisite',sealed:false});input.dailyLogs[DAY]={cal:2300,pro:170,steps:8500};
    delete input.sleep.cleanH;input.sleep.nights=[{d:'2030-02-01',h:8},{d:'2030-02-02',h:8}];
    input.exercises.forEach(e=>e.holdFlag=true);
    // This invented history has only the one designated session, as in the
    // retained clean-init control. An unrelated later synthetic session in the
    // initial attempt masked its hot-effort predicate; that failure is retained.
    input.sessionLog={'2030-02-02':{type:'U',entries:hot?Array.from({length:4},()=>({id:input.exercises[0].id,w:20,reps:[8,7],sets:2,rir:0})):[],niggles:['left knee','right knee','left elbow']}};
    const model=await projected(kit.host,input),state=model.stateFromOps(),original=structuredClone(state),E=model.engine,before=await collections(kit.host);
    assert.deepEqual(E.nowFocus(state).owed,[]);assert.notEqual(E.fiveLevers(state).steps.state,'caution');
    const rec=E.recoveryIndex(state),fix=E.theOneFix(state),march=E.marchingOrder(state),now=E.nowModel(state);
    assert.equal(rec.score,null);assert.equal(rec.lever,null);assert.equal(rec.flags.find(f=>f.k==='sleep').cost,null);
    for(const name of hot?['sleep','held','joints','hot']:['sleep','held','joints'])assert.ok(rec.flags.some(f=>f.k===name),name+' is actually present');
    const dom=new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml()),{url:'http://127.0.0.1/'});
    try{const api=TodayApp.mountToday(dom.window.document,model);await api.checkInKitReady();await api.render('why');
      const why=dom.window.document.querySelector('[data-slot="why-lead"]').textContent;
      fs.writeFileSync('.tmp/d2-r3-warnings-'+hot+'.json',JSON.stringify({rec,fix,march,now:now.move,why},null,2)+'\n');
      for(const [label,text,plain] of [['fix',fix.body,false],['march',march.why,false],['move',now.move.body,true],['rendered explanation',why,true]])for(const flag of rec.flags){assert.ok(text.includes(plain?E._plain9(flag.receipt):flag.receipt),label+' '+flag.k+' receipt');assert.ok(text.includes(plain?E._plain9(flag.fix):flag.fix),label+' '+flag.k+' action');}
    }finally{dom.window.close();}
    assert.deepEqual(state,original);assert.deepEqual(await collections(kit.host),before);
  }finally{kit.host.close();}
});
