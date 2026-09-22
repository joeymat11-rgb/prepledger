// Independent bounded synthetic controls retained as regressions.
// The mounted annex proof owns the separate real host and durable-write claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createGymSettingsLane} from '../gym-settings-lane.mjs';
const defer=()=>{let resolve;const promise=new Promise(done=>{resolve=done;});return{promise,resolve};};
const tick=async()=>{for(let i=0;i<5;i++)await new Promise(r=>setTimeout(r,0));};
async function bounded(promise){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('SYNTHETIC_TIMEOUT')),1500);})]);}finally{clearTimeout(timer);}}
async function make(){
  const dom=new JSDOM('<main id="phone"><button data-slot="settings-save">Save</button><button data-slot="log">Log</button></main>');
  const doc=dom.window.document,phone=doc.getElementById('phone'),save=phone.querySelector('[data-slot="settings-save"]'),log=phone.querySelector('[data-slot="log"]');
  const held=defer(),entered=defer(),calls=[],outcomes=[];
  const view={phase:'active',startId:'synthetic-start',lift:{id:'synthetic-lift'},set:{slot:0,lift:'synthetic-lift'}};
  const model={read:async()=>view,logSet:async()=>{calls.push('log');return{ok:true};}};
  const settings={latest:async()=>null,save:async machine=>{calls.push({machine:structuredClone(machine)});if(calls.filter(x=>typeof x==='object').length===1){entered.resolve();await held.promise;}return{ok:true};}};
  const lane=createGymSettingsLane(doc,phone,model,settings,Object.freeze({repaint:()=>{}}));
  await lane.hooks.readView();await lane.hooks.startRead('synthetic-lift');
  const token=lane.hooks.settingsEditOpened().editorToken;
  const raw=revision=>({rows:[{name:'Seat',value:'four'}],cues:'',revision});
  const click=control=>control.dispatchEvent(new dom.window.Event('click',{bubbles:true}));
  return{dom,phone,save,log,held,entered,calls,outcomes,lane,token,raw,click,
    async complete(){held.resolve();await bounded(lane.api.pending());await tick();},
    async close(){held.resolve();await bounded(lane.api.pending()||Promise.resolve()).catch(()=>{});lane.hooks.leave();dom.window.close();}};
}

for(const revised of [false,true])test('GSS review: '+(revised?'revised':'unchanged')+' saved outcome preserves exact editor token', {timeout:5000},async()=>{
  const u=await make();let revision=0;
  try{
    u.lane.hooks.bindSettingsSave(u.token,()=>u.raw(revision),outcome=>u.outcomes.push(outcome));
    u.click(u.save);await bounded(u.entered.promise);const pending=u.lane.api.pending();
    if(revised)revision=1;
    u.save.disabled=false;u.click(u.save);assert.equal(u.lane.api.pending(),pending);assert.equal(u.calls.length,1);
    await u.complete();assert.equal(u.lane.facade.settingsBusy(),false);assert.equal(u.outcomes.length,1);
    assert.equal(u.outcomes[0].kind,'saved');assert(Object.isFrozen(u.outcomes[0]));
    assert.equal(u.outcomes[0].editorToken,u.token,'GSS-REVISED-TOKEN-IDENTITY');
    assert.equal(u.outcomes[0].editorRevised,revised?true:undefined);
    if(revised){assert.equal(u.save.disabled,false);u.click(u.save);await u.complete();assert.equal(u.calls.length,2,'newer editor remains usable exactly once');}
  }finally{await u.close();}
});

for(const invalidation of ['replace','leave','dispose'])test('GSS review: second raw callback '+invalidation+' cannot deliver or retire a new editor', {timeout:5000},async()=>{
  const u=await make();let reads=0,replacement=null,dispose=()=>{},replacementOutcomes=[];
  try{
    dispose=u.lane.hooks.bindSettingsSave(u.token,()=>{
      if(++reads===2){
        if(invalidation==='replace'){
          replacement=u.lane.hooks.settingsEditOpened().editorToken;
          u.lane.hooks.bindSettingsSave(replacement,()=>u.raw(0),o=>replacementOutcomes.push(o));
        }else if(invalidation==='leave')u.lane.hooks.leave();else dispose();
      }
      return u.raw(0);
    },outcome=>u.outcomes.push(outcome));
    u.click(u.save);await bounded(u.entered.promise);await u.complete();
    assert.equal(reads,2,'post-save callback reached');assert.equal(u.calls.length,1,'original admitted save only');
    assert.equal(u.lane.facade.settingsBusy(),false);
    assert.equal(u.outcomes.length,0,'GSS-POSTREAD-'+invalidation.toUpperCase()+'-STALE-DELIVERY');
    if(replacement){assert.equal(u.save.disabled,false);u.click(u.save);await u.complete();assert.equal(u.calls.length,2);assert.equal(replacementOutcomes.length,1,'replacement binding survives older completion');}
  }finally{await u.close();}
});

test('GSS review: second raw callback stays under synchronous refusal and pending reservation',{timeout:5000},async()=>{
  const u=await make();let reads=0,originalPending;
  try{
    u.lane.hooks.bindGymAction('logSet',()=>({load:'1',reps:'1',effort:{reserve:{tag:'unknown'}}}),()=>{});
    u.lane.hooks.bindSettingsSave(u.token,()=>{
      if(++reads===2){u.save.disabled=false;u.click(u.save);u.click(u.log);assert.equal(u.lane.api.pending(),originalPending);assert.equal(u.lane.facade.settingsBusy(),true);}
      return u.raw(0);
    },outcome=>u.outcomes.push(outcome));
    u.click(u.save);originalPending=u.lane.api.pending();await bounded(u.entered.promise);await u.complete();
    assert.equal(reads,2);assert.equal(u.calls.length,1,'nested callbacks cannot admit a writer');
    assert.equal(u.outcomes.length,1);assert.equal(u.lane.facade.settingsBusy(),false);
  }finally{await u.close();}
});

test('GSS review: post-save raw rejection releases reservation without retrying committed command',{timeout:5000},async()=>{
  const u=await make();let reads=0;
  try{
    u.lane.hooks.bindSettingsSave(u.token,()=>{if(++reads===2)throw Error('SYNTHETIC_POSTSAVE_RAW');return u.raw(0);},o=>u.outcomes.push(o));
    u.click(u.save);await bounded(u.entered.promise);u.held.resolve();
    await assert.rejects(bounded(u.lane.api.pending()),/SYNTHETIC_POSTSAVE_RAW/);await tick();
    assert.equal(u.calls.length,1);assert.equal(u.outcomes.length,0);assert.equal(u.lane.facade.settingsBusy(),false);assert.equal(u.save.disabled,false);
  }finally{await u.close();}
});
