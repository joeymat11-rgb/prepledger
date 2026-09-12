import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { boot } from '../../w7-preview/today/today-entry.mjs';
import { openTodayInstallation } from '../local/today-bindings.mjs';
import { createLocalCalendar } from '../local/calendar.mjs';
import { createNutritionInputModel } from '../../w7-preview/today/nutrition-input-model.mjs';
import { fillRecorded } from '../../w7-preview/test/nutrition-input-fixture.mjs';
import { faultDatabase } from './support.mjs';
import design from '../../w7-preview/today/design.cjs';
const setup={athlete_label:'Synthetic nutrition owner',split:{from:'2026-01-01',map:{0:'U',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'}},exercises:[{id:'press',n:'Press',mg:'chest',day:'U',sets:1,hi:10,inc:2.5,steps:[20,22.5,25]}],priority_muscles:[]};
async function fixture(t,indexedDB=new IDBFactory()) {
  const state={iso:'2026-09-12T12:00:00Z'},calendar=createLocalCalendar({now:()=>new Date(state.iso),offsetMinutes:()=>-240});
  const era=await openTodayInstallation({indexedDB,crypto:webcrypto,calendar,initialSetup:setup});era.close();
  const dom=new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml()),{url:'http://localhost/'}),doc=dom.window.document;
  let page=await boot({document:doc,indexedDB,crypto:webcrypto,calendar});
  t.after(()=>{page.close();dom.window.close();});
  return {get page(){return page;},state,calendar,dom,doc,phone:doc.getElementById('phone'),
    async reopen(){page=await boot({document:doc,indexedDB,crypto:webcrypto,calendar});return page;}};
}
const records=async f=>(await f.page.hosts.readNutritionInputs()).view;
const operationCount=async f=>Object.keys((await f.page.hosts.generation()).generation.collections.ops).length;
function enter(f,origin='nutrition') { f.page.api.render(origin); f.phone.querySelector('[data-go="nutrition-input"]').click();assert.equal(f.page.api.screen(),'nutrition-input'); }
function field(f,name,value) {const el=f.phone.querySelector(`[name="${name}"]`);assert(el,name);el.value=value;el.dispatchEvent(new f.dom.window.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}
async function action(f,selector,phase) {const done=new Promise(resolve=>{const stop=f.page.nutrition.subscribe(s=>{if(s.phase===phase&&!s.busy){stop();resolve();}});});f.phone.querySelector(selector).click();await done;}
const back=f=>f.phone.querySelector('[data-action="back"]').click();
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
async function until(check) {for(let i=0;i<100;i++){if(check())return;await tick();}assert(check());}

test('actual owner route records no-plan facts, four unavailable guidance fields, Back focus and reload in one generation',async t=>{
  const f=await fixture(t),before=await f.page.hosts.generation();enter(f);
  assert.equal(f.phone.querySelectorAll('select').length,2);field(f,'goal.kind','unknown');field(f,'existing_plan.kind','none');
  await action(f,'button[type="submit"]','review');assert.equal(await operationCount(f),0);
  await action(f,'[data-action="confirm"]','saved');back(f);await f.page.refresh();
  assert.equal(f.page.api.screen(),'nutrition');assert.equal(f.doc.activeElement.dataset.go,'nutrition-input');
  assert.equal(f.phone.querySelectorAll('.macro-row').length,4);assert.match(f.phone.textContent,/I have no existing plan/);assert.match(f.phone.textContent,/do not change a recommended plan/);
  assert.doesNotMatch(f.phone.textContent,/not wired yet|initial.setup projection/i);const saved=await records(f);assert.equal(saved.records.length,1);assert.equal(saved.effectivePlan,null);
  await f.reopen();enter(f);assert.equal(f.phone.querySelector('[name="existing_plan.kind"]').value,'none');assert.equal(await operationCount(f),1);
  assert.deepEqual((await f.page.hosts.generation()).generation.metadata.localEra,before.generation.metadata.localEra);
});

test('recorded-plan goal-only edit preserves exact source/range and history; summary is separate from guidance',async t=>{
  const f=await fixture(t);enter(f);fillRecorded(f.page.nutrition);f.page.nutrition.edit();await action(f,'button[type="submit"]','review');await action(f,'[data-action="confirm"]','saved');
  const original=(await records(f)).local.current.inputs;back(f);await f.page.refresh();assert.match(f.phone.textContent,/less than 245 g\/day/);
  assert.doesNotMatch([...f.phone.querySelectorAll('.macro-row')].map(x=>x.textContent).join(''),/2175|135|245/);
  enter(f);f.phone.querySelector('[data-action="edit"]').click();field(f,'goal.statement','Keep showing up.');await action(f,'button[type="submit"]','review');await action(f,'[data-action="confirm"]','saved');
  const read=await records(f);assert.equal(read.records.length,2);assert.deepEqual(read.local.current.inputs.existing_plan,original.existing_plan);assert.deepEqual(read.records[0].original.payload.inputs,original);
});

test('Back and Escape retain draft, return actual invoker and foreground leaves editor listeners live',async t=>{
  const f=await fixture(t);for(const origin of ['today','nutrition']){
    enter(f,origin);field(f,'goal.kind','declared');field(f,'goal.statement','Unfinished goal');const input=f.phone.querySelector('[name="goal.statement"]');await f.page.refresh();assert(input.isConnected);assert.equal(input.value,'Unfinished goal');
    f.phone.dispatchEvent(new f.dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(f.page.api.screen(),origin);assert.equal(f.doc.activeElement.dataset.go,'nutrition-input');
    f.phone.querySelector('[data-go="nutrition-input"]').click();assert.equal(f.phone.querySelector('[name="goal.statement"]').value,'Unfinished goal');back(f);
  }assert.equal(await operationCount(f),0);
});

test('nutrition rollover retains fields, remounts parked listeners and Back opens current-day invoker',async t=>{
  const f=await fixture(t);enter(f);field(f,'goal.kind','declared');field(f,'goal.statement','Before midnight');const original=f.phone.querySelector('[name="goal.statement"]');
  f.state.iso='2026-09-13T12:00:00Z';await f.page.refresh();assert(original.isConnected);await f.page.refresh({move:true});assert.equal(f.page.model.today,'2026-09-13');
  [...f.doc.querySelectorAll('#today-calendar button')].find(x=>/View retained draft/.test(x.textContent)).click();assert.equal(f.page.api.screen(),'nutrition-input');field(f,'goal.statement','After remount');assert.equal(f.page.nutrition.snapshot().draft.goal.statement,'After remount');
  back(f);await until(()=>f.page.model.today==='2026-09-13'&&f.page.api.screen()==='nutrition');assert.equal(f.doc.activeElement.dataset.go,'nutrition-input');
  enter(f);assert.equal(f.phone.querySelector('[name="goal.statement"]').value,'After remount');assert.equal(await operationCount(f),0);
});

test('actual stale weight and retired review stay explicit in owner editor and require review then confirm',async t=>{
  const f=await fixture(t);enter(f);field(f,'goal.kind','unknown');field(f,'existing_plan.kind','none');await action(f,'button[type="submit"]','review');
  assert.equal((await f.page.model.weighIn(170)).ok,true);await action(f,'[data-action="confirm"]','error');assert.match(f.phone.textContent,/Another entry/);assert.equal((await records(f)).records.length,0);
  f.phone.querySelector('[data-action="edit"]').click();await action(f,'button[type="submit"]','review');
  const second=createNutritionInputModel({installation:f.page.hosts,calendar:f.calendar});t.after(()=>second.close());await second.load();second.update('goal.kind','unknown');second.update('existing_plan.kind','none');await second.review();
  await action(f,'[data-action="confirm"]','error');assert.equal(f.phone.querySelector('[data-action="confirm"]'),null);assert.match(f.phone.textContent,/review.*again/i);
  await action(f,'[data-action="review"]','review');assert.equal((await records(f)).records.length,0);await action(f,'[data-action="confirm"]','saved');assert.equal((await records(f)).records.length,1);
});

test('quota remains retryable across Back; actual delayed save updates summary after view disposal exactly once',async t=>{
  for(const mode of ['quota','delay']){
    const fault=faultDatabase(),f=await fixture(t,fault.indexedDB);t.after(()=>{fault.state.armed=false;fault.state.release=true;});enter(f);field(f,'goal.kind','unknown');field(f,'existing_plan.kind','none');await action(f,'button[type="submit"]','review');
    fault.state.mode=mode;fault.state.armed=true;const pending=f.page.nutrition.confirm();
    if(mode==='quota'){await pending;assert.equal(f.page.nutrition.snapshot().canRetry,true);back(f);enter(f);assert.match(f.phone.textContent,/Try saving again/);fault.state.armed=false;await action(f,'[data-action="confirm"]','saved');back(f);}
    else {await fault.state.write.promise;back(f);assert.equal(f.page.api.screen(),'nutrition');assert.doesNotMatch(f.phone.textContent,/I have no existing plan/);fault.state.release=true;await pending;}
    fault.state.armed=false;await until(()=>f.phone.textContent.includes('I have no existing plan'));assert.equal((await records(f)).records.length,1);assert.equal(await operationCount(f),1);
  }
});

test('closing during actual delayed save detaches acknowledgement and cannot paint replacement owner page',async t=>{
  const fault=faultDatabase(),f=await fixture(t,fault.indexedDB);t.after(()=>{fault.state.release=true;fault.state.armed=false;});enter(f);field(f,'goal.kind','unknown');field(f,'existing_plan.kind','none');await action(f,'button[type="submit"]','review');
  fault.state.mode='delay';fault.state.armed=true;const old=f.page,pending=old.nutrition.confirm();await fault.state.write.promise;old.close();f.phone.textContent='Replacement sentinel';fault.state.release=true;await pending;await tick();assert.equal(f.phone.textContent,'Replacement sentinel');
  fault.state.armed=false;await f.reopen();f.page.api.render('nutrition');assert.match(f.phone.textContent,/I have no existing plan/);assert.equal((await records(f)).records.length,1);
});

test('same generation workout and scale Why still operate after nutrition, while editor draft stays retained',async t=>{
  const f=await fixture(t);enter(f,'today');field(f,'goal.kind','declared');field(f,'goal.statement','Retained');back(f);
  assert.equal((await f.page.model.weighIn(170)).ok,true);await f.page.refresh();f.page.api.render('why');assert.match(f.phone.textContent,/Baseline: 170 lb/);
  f.page.api.render('today');await f.page.api.render('workout');assert(f.phone.querySelector('button'));assert.equal((await f.page.workout.gym.read()).phase,'active');f.page.api.render('today');enter(f,'today');assert.equal(f.phone.querySelector('[name="goal.statement"]').value,'Retained');assert.equal(await operationCount(f),2);
});

test('authenticated competing saved answers refresh summary without replacing draft; broken storage withdraws the summary',async t=>{
  const f=await fixture(t);enter(f);field(f,'goal.kind','declared');field(f,'goal.statement','My unsaved draft');
  const other=createNutritionInputModel({installation:f.page.hosts,calendar:f.calendar});t.after(()=>other.close());await other.load();fillRecorded(other);other.update('goal.statement','Another real saved goal');await other.review();await other.confirm();
  const fieldNode=f.phone.querySelector('[name="goal.statement"]');await f.page.refresh();assert(fieldNode.isConnected);assert.equal(fieldNode.value,'My unsaved draft');back(f);assert.match(f.phone.textContent,/Another real saved goal/);
  const reader=await f.page.hosts.createReadingHost({day:'2026-09-12'});t.after(()=>reader.close());const snapshot=await reader.repository.load(),next=structuredClone(snapshot.generation);next.collections.meta.checkpoint.counts.ops++;
  await reader.repository.commit(snapshot,next,()=>null);await assert.rejects(f.page.refresh());assert.doesNotMatch(f.phone.textContent,/Another real saved goal|2175/);assert.match(f.phone.textContent,/could not be trusted/);
});
