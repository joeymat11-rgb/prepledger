import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {faultDatabase} from '../rebuild/m3/w6/test/support.mjs';
import {createGymHost} from '../rebuild/m3/w7-preview/today/gym-host.mjs';
import {createGymModel,EFFORT_CHOICES} from '../rebuild/m3/w7-preview/today/gym-model.mjs';
import GymApp,{mountGym,newGymDraft} from '../rebuild/m3/w7-preview/today/gym-app.mjs';
import {createMachineSettingsHost} from '../rebuild/m3/w7-preview/today/machine-settings-host.mjs';
import TodayModel from '../rebuild/m3/w7-preview/today/today-model.cjs';
import design from '../rebuild/m3/w7-preview/today/design.cjs';
const DAY='2030-02-04', SLOT='earned-today-preview/'+DAY;
const EFFORT=EFFORT_CHOICES.find(x=>x.label==='2').reserve;
function gate(){let release,enter;return{wait:new Promise(r=>release=r),reached:new Promise(r=>enter=r),release:()=>release(),enter:()=>enter()};}
async function device(){
 const fault=faultDatabase(),today=TodayModel.createTodayModel({today:DAY}),state=today.stateFromOps();
 const open=()=>createGymHost({day:DAY,engineState:state,indexedDB:fault.indexedDB,crypto:webcrypto,plannedSplitSlotId:SLOT});
 const gymHost=await open(),model=createGymModel({gymHost});
 const settings=await createMachineSettingsHost({day:DAY,indexedDB:fault.indexedDB,crypto:webcrypto});
 return{fault,today,state,open,gymHost,model,settings,close(){settings.close();gymHost.close();}};
}
async function collections(kit){const {ops,outbox}=(await kit.gymHost.repository.load()).generation.collections;return{ops,outbox};}
function preserved(before,after,added){for(const kind of ['ops','outbox']){assert.equal(Object.keys(after[kind]).length,Object.keys(before[kind]).length+added);for(const [id,row]of Object.entries(before[kind]))assert.deepEqual(after[kind][id],row);}}
function wrap(host,method,handle){const original=host.host.client[method];return{...host,host:{...host.host,client:{...host.host.client,[method]:input=>handle(input,()=>original(input))}}};}
async function log(model,view){const result=await model.logSet({startId:view.startId,slot:view.set.slot,lift:view.set.lift,load:String(view.entry.load),reps:String(view.entry.reps),effort:EFFORT});assert.equal(result.ok,true,result.code);return result;}
async function allSets(model){for(let i=0;i<30;i++){const v=await model.read();if(v.complete)return v;if(v.phase==='saved'){model.forget();continue;}assert.equal(v.phase,'active');await log(model,v);model.forget();}throw Error('SYNTHETIC_SESSION_DID_NOT_COMPLETE');}
async function until(check,label){for(let i=0;i<1500;i++){if(check())return;await new Promise(r=>setTimeout(r,1));}throw Error('Timed out: '+label);}
const shell=()=>design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml());
async function page(kit,{model=kit.model,draft=newGymDraft(),settings=kit.settings,dom=new JSDOM(shell()),onBack=()=>{},onChanged=()=>{}}={}){
 const doc=dom.window.document,phone=doc.getElementById('phone');
 const mounted=mountGym(doc,phone,{model,draft,settings,onBack,onChanged});await mounted;
 return{dom,doc,phone,mounted,draft,
  click(selector){const el=phone.querySelector(selector);assert.ok(el,selector);el.dispatchEvent(new dom.window.Event('click'));},
  input(selector,value){const el=phone.querySelector(selector);assert.ok(el,selector);el.value=value;el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));},
  async ready(){if(mounted.settings.read())await mounted.settings.read();},
  async editor(){this.click('[data-action="settings-open"]');await until(()=>phone.querySelector('[data-settings-value="0"]')&&!phone.querySelector('[data-slot="settings-editor"]').hidden,'editor open');},
  choose(){const buttons=[...phone.querySelectorAll('[data-slot="choices"] button')];const el=buttons.find(b=>b.textContent.trim()==='2')||buttons[0];assert.ok(el);el.dispatchEvent(new dom.window.Event('click'));},
 };
}


export { DAY, EFFORT, gate, device, collections, preserved, wrap, until, page, shell };
