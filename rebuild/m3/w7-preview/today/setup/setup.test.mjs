import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { createEnrollment } from './enrollment.mjs';
import { newSetupDraft, validateSchedule, exerciseFromDraft, setupFromDraft } from './setup-model.mjs';
import { CATALOGUE } from './catalogue.mjs';
import Athlete from '../../../../m4/workout/athlete-state.cjs';
import createConstants from '../../../../engine/constants.cjs';
import createWriters from '../../../../engine/writers.cjs';
import { createLocalCalendar } from '../../../w6/local/calendar.mjs';
import { openTodayInstallation, TODAY_DATABASE } from '../../../w6/local/today-bindings.mjs';
import { boot } from '../today-entry.mjs';
const require = createRequire(new URL('../../../w6/package.json', import.meta.url));
const { IDBFactory } = require('fake-indexeddb');
const { JSDOM } = createRequire(new URL('../../../../../package.json', import.meta.url))('jsdom');
const calendar = () => createLocalCalendar({ now: () => new Date('2026-09-11T16:00:00Z'), offsetMinutes: () => -240 });
const exercise = choice => exerciseFromDraft({choice,sets:'1',hi:'10',inc:'2.5',loads:'20, 22.5, 25, 30, 40'}, CATALOGUE);
function draft() { return { ...newSetupDraft('2026-09-11'), athlete_label:'Synthetic current routine',
  map:{0:'REST',1:'U',2:'REST',3:'L',4:'REST',5:'U',6:'REST'}, exercises:[exercise('press'),exercise('hack')] }; }
const setup = () => setupFromDraft(draft());
const options = indexedDB => ({ indexedDB, crypto:webcrypto, calendar:calendar() });
async function record(indexedDB) {
  return new Promise((resolve,reject)=>{const request=indexedDB.open(TODAY_DATABASE);request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const db=request.result,tx=db.transaction('generations','readonly'),get=tx.objectStore('generations').get('active');tx.oncomplete=()=>{db.close();resolve(get.result);};tx.onabort=()=>reject(tx.error);};});
}
function fault(database, storeName, key, delayed = false) {
  const inner=new IDBFactory(); let release, arrive;
  const ready=new Promise(r=>arrive=r); const state={armed:true,release:false};
  const indexedDB={open(...args){const request=inner.open(...args);request.addEventListener('success',()=>{
    const db=request.result, original=db.transaction.bind(db);
    db.transaction=(...txArgs)=>{const tx=original(...txArgs);
      if(args[0]!==database || txArgs[1]!=='readwrite' || !state.armed)return tx;
      const getStore=tx.objectStore.bind(tx),store=getStore(storeName),put=store.put.bind(store);
      store.put=(value,recordKey)=>{if(recordKey===key&&state.armed){state.armed=false;arrive();
        if(!delayed)throw new DOMException('Synthetic setup write failure','QuotaExceededError');
        const result=put(value,recordKey); const hold=()=>{if(!state.release){const r=store.get(recordKey);r.onsuccess=hold;}};hold();return result;
      }return put(value,recordKey);};
      tx.objectStore=name=>name===storeName?store:getStore(name);return tx;
    };
  });return request;}};
  return {indexedDB,inner,state,ready};
}
test('blank draft supplies no routine, loads or priorities',()=>{
  const d=newSetupDraft('2026-09-11');assert.equal(d.athlete_label,'');assert.deepEqual(Object.values(d.map),Array(7).fill(''));
  assert.deepEqual(d.exercises,[]);assert.deepEqual(d.priority_muscles,[]);assert.throws(()=>validateSchedule(d));
});
test('calendar and complete schedule validation preserves inputs',()=>{
  const d=draft();d.from='2026-02-30';const before=structuredClone(d);assert.throws(()=>validateSchedule(d),/real start date/);assert.deepEqual(d,before);
  d.from='2026-09-11';d.map[2]='';assert.throws(()=>validateSchedule(d),/Tuesday/);d.map[2]='REST';d.exercises.pop();assert.throws(()=>setupFromDraft(d),/lower exercises/);
});
test('equipment ladder uses only explicit finite ascending quantities',()=>{
  const row={choice:'rows',sets:'2',hi:'12',inc:'2.5',loadMode:'range',min:'10',max:'20'};
  assert.deepEqual(exerciseFromDraft(row,CATALOGUE).steps,[10,12.5,15,17.5,20]);
  for(const bad of [{max:'21'},{sets:'1.5'},{hi:''},{inc:'Infinity'},{loadMode:'list',loads:'20,10'},{loadMode:'list',loads:'20,20'},{choice:'rows-2'}])assert.throws(()=>exerciseFromDraft({...row,...bad},CATALOGUE));
});
test('seven explicit mappings preserve actual constructor, secondary lookup and rest semantics',()=>{
  const d=draft();d.exercises=CATALOGUE.map(x=>exercise(x.id));const state=Athlete.createCleanInitState({setup:setupFromDraft(d)});
  assert.deepEqual(state.exercises.map(({id,mg,day,w})=>({id,mg,day,w})),CATALOGUE.map(({id,mg,day})=>({id,mg,day,w:null})));
  const constants=createConstants(),writers=createWriters({},{});
  assert.deepEqual(['press','rows','pulldown','curl','hack','extension','ham'].map(id=>writers.restFor(id)),[150,150,150,90,150,90,90]);
  assert.deepEqual(constants.INDIRECT.rows,{biceps:.5});assert.deepEqual(constants.INDIRECT.pulldown,{biceps:.5});
  assert.deepEqual(constants.INDIRECT.press,{triceps:.5,delts:.5});assert.deepEqual(constants.INDIRECT.curl,{forearms:.5});
});
test('actual enrollment reopens stored authority; caller mutation cannot change it',async()=>{
  const opts=options(new IDBFactory()),value=setup();let saved;
  const controller=createEnrollment({...opts,onSaved:async()=>{const era=await openTodayInstallation({...opts,enroll:false});saved=await era.initialSetup();era.close();}});
  assert.equal((await controller.save(value)).state,'saved');value.athlete_label='changed caller';
  assert.equal(saved.setup.athlete_label,'Synthetic current routine');assert.deepEqual(saved.basisState.sessionLog,{});assert.equal(saved.basisState.exercises[0].w,null);
  assert.equal((await controller.save(value)).state,'saved');
});
test('real generation precommit failure retains retry, then saves once',async()=>{
  const f=fault(TODAY_DATABASE,'generations','active'),opts=options(f.indexedDB);let count=0;
  const controller=createEnrollment({...opts,onSaved:()=>count++});
  assert.equal((await controller.save(setup())).state,'retry');assert.equal(await record(f.inner),undefined);assert.equal(count,0);
  assert.equal((await controller.save(setup())).state,'saved');assert.equal(count,1);assert.equal((await record(f.inner)).revision,1);
});
for(const [database,store,key] of [[TODAY_DATABASE+'-keys','keys','active'],[TODAY_DATABASE+'-local','markers','enrolled']])
test('actual postcommit '+store+' failure prevents second enrollment',async()=>{
  const f=fault(database,store,key),opts=options(f.indexedDB);let called=false;
  const controller=createEnrollment({...opts,onSaved:()=>called=true});const result=await controller.save(setup());
  assert.equal(result.state,'restore');assert.equal(called,false);const before=await record(f.inner);assert.equal(before.revision,1);
  assert.equal((await controller.save({...setup(),athlete_label:'forbidden replacement'})).state,'restore');assert.deepEqual(await record(f.inner),before);
});
test('duplicate submit during actual pending final marker cannot enroll twice',async()=>{
  const f=fault(TODAY_DATABASE+'-local','markers','enrolled',true),opts=options(f.indexedDB);let count=0;
  const controller=createEnrollment({...opts,onSaved:()=>count++});const pending=controller.save(setup());await f.ready;
  assert.equal((await controller.save(setup())).state,'saving');assert.equal(count,0);f.state.release=true;
  assert.equal((await pending).state,'saved');assert.equal(count,1);assert.equal((await record(f.inner)).revision,1);
});
test('post-save reopen error is restore-only with committed authority retained',async()=>{
  const opts=options(new IDBFactory());const controller=createEnrollment({...opts,onSaved:()=>{throw new Error('synthetic reopen');}});
  assert.equal((await controller.save(setup())).state,'restore');assert.equal((await record(opts.indexedDB)).revision,1);
});
test('a configured installation refuses replacement and leaves the committed record intact',async()=>{
  const opts=options(new IDBFactory());const first=createEnrollment({...opts,onSaved(){}});await first.save(setup());const before=await record(opts.indexedDB);
  const duplicate=createEnrollment({...opts,onSaved(){assert.fail('duplicate must not report success');}});
  assert.equal((await duplicate.save({...setup(),athlete_label:'forbidden replacement'})).state,'restore');
  assert.deepEqual(await record(opts.indexedDB),before);
});
function document() { return new JSDOM('<div id="today-identity"></div><div id="today-storage"></div><div id="today-status"></div><div id="phone"></div>',{url:'http://localhost/'}).window.document; }
test('actual owner boot offers setup only on first-run; cancellation writes no generation',async()=>{
  const opts=options(new IDBFactory()),doc=document();const page=await boot({...opts,document:doc});
  assert.equal(page.setupRequired,true);assert.match(doc.body.textContent,/Make it yours/);
  doc.querySelector('[name=athlete_label]').value='Kept';doc.querySelector('[name=athlete_label]').dispatchEvent(new doc.defaultView.Event('input'));
  doc.querySelector('form').dispatchEvent(new doc.defaultView.Event('submit',{cancelable:true}));
  assert.equal(doc.querySelector('[name=athlete_label]').value,'Kept');assert.equal(doc.activeElement.name,'day-0');
  page.close();assert.equal(await record(opts.indexedDB),undefined);
});
test('damaged final marker never opens setup on owner page',async()=>{
  const f=fault(TODAY_DATABASE+'-local','markers','enrolled'),opts=options(f.indexedDB);
  const controller=createEnrollment({...opts,onSaved(){}});await controller.save(setup());const before=await record(f.inner);
  const doc=document(),page=await boot({...opts,document:doc});assert.ok(page.restoreRequired);assert.doesNotMatch(doc.body.textContent,/Make it yours/);assert.equal(doc.querySelector('form'),null);assert.deepEqual(await record(f.inner),before);page.close();
});
