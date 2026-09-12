import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { openTodayInstallation } from '../local/today-bindings.mjs';
import { createLocalCalendar } from '../local/calendar.mjs';
import { boot } from '../../w7-preview/today/today-entry.mjs';
import design from '../../w7-preview/today/design.cjs';
import { localEraConfig } from '../local/local-era.mjs';
import Client from '../../../client/index.cjs';
const setup={athlete_label:'Synthetic lifecycle',split:{from:'2026-01-01',map:{0:'U',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'}},exercises:[{id:'press',n:'Press',mg:'chest',day:'U',sets:1,hi:10,inc:2.5,steps:[20,22.5,25]}],priority_muscles:[]};
async function fixture(t,crypto=webcrypto) {
  const indexedDB=new IDBFactory(),state={iso:'2026-09-01T12:00:00Z'},calendar=createLocalCalendar({now:()=>new Date(state.iso),offsetMinutes:()=>-240});
  const era=await openTodayInstallation({indexedDB,crypto,calendar,initialSetup:setup});era.close();
  const dom=new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml()),{url:'http://localhost/'});
  const page=await boot({document:dom.window.document,indexedDB,crypto,calendar});
  const other=await page.hosts.createReadingHost({day:'2026-09-01'}),phone=dom.window.document.getElementById('phone');
  t.after(()=>{other.close();page.close();dom.window.close();});
  return {page,other,phone,dom,state,calendar};
}
test('real shared conflicting weight withdraws the open Why baseline after explicit page refresh',async t=>{
  const {page,other,phone}=await fixture(t);assert.equal((await page.model.weighIn(170)).ok,true);await page.refresh();page.api.render('why');assert.match(phone.textContent,/Baseline: 170 lb/);
  assert.equal((await other.weighIn({date:'2026-09-01',lb:180})).ok,true);await page.refresh();
  assert.equal(page.model.read().scaleFeedback.baseline,null);assert.equal(page.model.read().scaleFeedback.count,0);
  assert.equal(page.api.screen(),'why');assert.doesNotMatch(phone.textContent,/Baseline: 170 lb|1 eligible readings/);assert.match(phone.textContent,/0 eligible readings/);
  page.api.render('today');assert.doesNotMatch(phone.textContent,/Smoothed scale weight 170/);
});
async function editReading(f,kind,target,value) {
  const snapshot=await f.other.repository.load(),next=structuredClone(snapshot.generation),backend=Client.memoryBackend(next.collections),identity=next.metadata.localEra.lease;
  const client=Client.createClient({...localEraConfig(next.metadata,{athleteId:identity.athlete_id,deviceId:identity.device_id,clock:f.calendar.clock}),backend});
  client.boot();const result=client[kind](target,value);assert.equal(result.acknowledged,true);
  next.collections=Object.fromEntries(backend.collections().map(name=>[name,Object.fromEntries(backend.keys(name).map(key=>[key,backend.get(name,key)]))]));
  await f.other.repository.commit(snapshot,next,()=>null);return result;
}
test('open Why follows normal real write, correction and removal; preserves focused navigation and Back',async t=>{
  const f=await fixture(t),{page,other,phone,dom}=f;page.api.render('why');assert.doesNotMatch(phone.textContent,/Baseline:/);
  const saved=await other.weighIn({date:'2026-09-01',lb:170});assert.equal(saved.ok,true);
  phone.querySelector('[data-go="today"]').focus();await page.refresh();assert.match(phone.textContent,/Baseline: 170 lb/);assert.equal(dom.window.document.activeElement.dataset.go,'today');
  const target=Object.values((await other.repository.load()).generation.collections.ops).find(op=>op.class==='reading').op_id;
  await editReading(f,'correction',target,{lb:{value:172,unit:'lb'}});await page.refresh();assert.match(phone.textContent,/Baseline: 172 lb/);assert.doesNotMatch(phone.textContent,/Baseline: 170 lb/);
  await editReading(f,'tombstone',target,'Synthetic removal');await page.refresh();assert.equal(page.model.read().scaleFeedback.baseline,null);assert.doesNotMatch(phone.textContent,/Baseline: 172 lb/);
  phone.querySelector('[data-go="today"]').click();assert.equal(page.api.screen(),'today');assert.doesNotMatch(phone.textContent,/Smoothed scale weight 172/);
});
test('calendar loss withdraws open Why quantities and explicit Back opens the current day',async t=>{
  const {page,state,phone}=await fixture(t);await page.model.weighIn(170);await page.refresh();page.api.render('why');
  state.iso='2026-09-02T12:00:00Z';await page.refresh();assert.equal(page.api.screen(),'why');assert.equal(page.model.read().scaleFeedback,null);assert.doesNotMatch(phone.textContent,/Baseline: 170 lb/);assert.match(phone.textContent,/could not be verified/);
  page.api.render('today');await page.refresh();assert.equal(page.model.today,'2026-09-02');assert.equal(page.api.screen(),'today');
});
test('actual damaged-store refusal withdraws Why numbers but leaves an active weight editor intact',async t=>{
  for(const editor of [false,true]){
    const {page,other,phone,dom}=await fixture(t);await page.model.weighIn(170);await page.refresh();
    if(editor){page.api.openWeighIn();const input=phone.querySelector('input');input.value='173.2';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));}
    else page.api.render('why');
    const input=phone.querySelector('input'),snapshot=await other.repository.load(),next=structuredClone(snapshot.generation);next.collections.meta.checkpoint.counts.ops++;
    await other.repository.commit(snapshot,next,()=>null);await assert.rejects(page.refresh());
    if(editor){assert.equal(input.isConnected,true);assert.equal(input.value,'173.2');assert(phone.querySelector('[role="dialog"]'));}
    else {assert.doesNotMatch(phone.textContent,/Baseline: 170 lb/);assert.equal(page.api.screen(),'why');assert(phone.querySelector('[data-go="today"]'));}
  }
});
test('pending actual decryption withdraws old Why and page close prevents late DOM paint',async t=>{
  let armed=false,release,entered;const hold=new Promise(r=>release=r),started=new Promise(r=>entered=r);t.after(()=>release());
  const crypto={getRandomValues:webcrypto.getRandomValues.bind(webcrypto),subtle:new Proxy(webcrypto.subtle,{get(target,key){
    if(key==='decrypt')return async(...args)=>{if(armed){armed=false;entered();await hold;}return target.decrypt(...args);};
    const value=target[key];return typeof value==='function'?value.bind(target):value;
  }})};
  const {page,phone}=await fixture(t,crypto);await page.model.weighIn(170);await page.refresh();page.api.render('why');
  armed=true;const pending=page.refresh();await started;assert.doesNotMatch(phone.textContent,/Baseline: 170 lb/);
  page.close();phone.textContent='Closed-page sentinel';release();await pending;assert.equal(phone.textContent,'Closed-page sentinel');
});
test('same-day source refresh preserves active workout, check-in and weight DOM/drafts',async t=>{
  for(const screen of ['workout','recovery','weight']){
    const {page,other,phone,dom}=await fixture(t);
    if(screen==='weight')page.api.openWeighIn();else await page.api.render(screen);
    const root=phone.firstElementChild;
    if(screen==='workout')Object.assign(page.workout.gymDraft().entry,{load:'22.5',reps:'9'});
    if(screen==='recovery')page.checkin.checkin.draft().choose('energy','Low');
    const input=screen==='weight'?phone.querySelector('input'):null;
    if(input){input.value='173.2';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));}
    assert.equal((await other.weighIn({date:'2026-09-01',lb:170})).ok,true);await page.refresh();assert.equal(phone.firstElementChild,root);
    if(screen==='workout'){assert.equal(page.workout.gymDraft().entry.load,'22.5');assert.equal(page.workout.gymDraft().entry.reps,'9');}
    if(screen==='recovery')assert.equal(page.checkin.checkin.draft().answers().answers.energy,'Low');
    if(input){assert.equal(input.isConnected,true);assert.equal(input.value,'173.2');}
  }
});
