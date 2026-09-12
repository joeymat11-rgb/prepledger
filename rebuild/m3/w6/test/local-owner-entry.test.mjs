import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { createLocalCalendar, DAY_CHANGED } from '../local/calendar.mjs';
import { openTodayInstallation, TODAY_DATABASE } from '../local/today-bindings.mjs';
import { boot, DEMO_DATABASE } from '../../w7-preview/today/today-entry.mjs';
import { EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';
import design from '../../w7-preview/today/design.cjs';

const setup = () => ({athlete_label:'Synthetic owner setup', split:{from:'2026-01-01',map:{0:'U',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'}},
  exercises:[{id:'synthetic-press',n:'Synthetic press',mg:'chest',day:'U',sets:2,hi:10,inc:2.5,steps:[20,22.5,25,30,40]}],priority_muscles:[]});
function time(iso='2026-09-11T12:34:56.789Z',offset=-240) {
  const state={iso,offset,mono:153.7};
  const calendar=createLocalCalendar({now:()=>new Date(state.iso),offsetMinutes:()=>state.offset,monotonicMs:()=>state.mono});
  return {state,calendar};
}
function document() {return new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',design.templateHtml()),{url:'http://localhost/'});}
async function enroll(indexedDB,calendar,value=setup()) {
  const era=await openTodayInstallation({indexedDB,crypto:webcrypto,calendar,...(value?{initialSetup:value}:{})});era.close();
}
async function open(t,clock=time(),configured=true) {
  const indexedDB=new IDBFactory(),dom=document();
  if(configured) await enroll(indexedDB,clock.calendar);
  const page=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar:clock.calendar});
  t.after(()=>{page.close();dom.window.close();});
  return {page,indexedDB,dom,...clock};
}
const ops=async page=>Object.values((await page.hosts.generation()).generation.collections.ops);
async function activeGeneration(indexedDB) {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(TODAY_DATABASE);request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result,tx=db.transaction('generations','readonly'),get=tx.objectStore('generations').get('active');
      tx.oncomplete=()=>{db.close();resolve(get.result);};tx.onabort=()=>{db.close();reject(tx.error);};
    };
  });
}

test('actual owner rest day offers weight but no new workout shortcut or Start',async t=>{
  const indexedDB=new IDBFactory(),dom=document(),{calendar}=time(),value=setup();
  value.split.map[5]='REST'; // The explicit synthetic clock is Friday September11.
  await enroll(indexedDB,calendar,value);
  const page=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar});
  t.after(()=>{page.close();dom.window.close();});
  assert.equal(page.model.read().workout.exerciseCount,null);
  assert.equal(page.model.read().workout.unavailableReason,null);
  assert.equal(dom.window.document.querySelector('[data-slot="workout-action"]'),null);
  assert.equal(page.model.read().hasReadToday,false);
  assert.deepEqual(await ops(page),[]);
});

test('actual default boot uses persisted setup and wall date without injected day/basis/clock',async t=>{
  const indexedDB=new IDBFactory(),dom=document(),calendar=createLocalCalendar();await enroll(indexedDB,calendar);
  const page=await boot({document:dom.window.document,indexedDB,crypto:webcrypto});t.after(()=>{page.close();dom.window.close();});
  assert.equal(page.mode,'owner');assert.equal(page.model.today,calendar.sample().day);
  assert.equal(page.model.basisState().athlete_label,setup().athlete_label);
  assert.deepEqual(page.model.storedReads(),[]);assert.equal(page.model.read().calorieTarget.mid,null);
  assert.equal(page.model.read().proteinTarget.g,null);assert.equal(page.model.read().statusFace.word,'Unknown');
  const text=dom.window.document.getElementById('phone').textContent;
  assert.match(text,/Synthetic owner setup/);assert.match(text,/Record a morning weight before noon/);
  assert.doesNotMatch(text,/GREEN|2,300|100%|Synthetic athlete/);
});

test('fresh and legacy no-setup are setup-required; missing key remains restore-required',async t=>{
  const fresh=await open(t,time(),false);assert.equal(fresh.page.setupRequired,true);assert.equal(fresh.page.restoreRequired,null);
  assert.equal(fresh.page.model,null);assert.equal(fresh.page.hosts,null);
  const phone=fresh.dom.window.document.getElementById('phone');
  assert.equal(phone.querySelector('h1').textContent,'Make it yours.');
  assert.equal(phone.querySelectorAll('form').length,1);
  assert.deepEqual([...phone.querySelectorAll('input,select')].map(x=>x.name),
    ['athlete_label','from','day-0','day-1','day-2','day-3','day-4','day-5','day-6']);
  assert.equal(phone.querySelector('[name=athlete_label]').value,'');
  assert.deepEqual([...phone.querySelectorAll('select')].map(x=>x.value),Array(7).fill(''));
  assert.equal(await activeGeneration(fresh.indexedDB),undefined,'viewing setup commits neither setup authority nor workout operations');
  await assert.rejects(openTodayInstallation({indexedDB:fresh.indexedDB,crypto:webcrypto,calendar:fresh.calendar,enroll:false}),
    error=>error.code==='LOCAL_FIRST_RUN');
  assert.equal(await activeGeneration(fresh.indexedDB),undefined);
  const indexedDB=new IDBFactory(),dom=document(),clock=time();await enroll(indexedDB,clock.calendar,null);
  const legacy=await activeGeneration(indexedDB);
  let page=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar:clock.calendar});
  assert.equal(page.setupRequired,true);assert.equal(page.restoreRequired,null);assert.equal(page.model,null);
  assert.equal(dom.window.document.querySelector('#phone h1').textContent,'Setup required');
  assert.equal(dom.window.document.querySelector('#phone form'),null);
  assert.equal(dom.window.document.querySelector('#phone input'),null);
  assert.deepEqual(await activeGeneration(indexedDB),legacy);page.close();
  await new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(TODAY_DATABASE+'-keys');r.onsuccess=resolve;r.onerror=()=>reject(r.error);});
  page=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar:clock.calendar});
  assert.equal(page.setupRequired,false);assert.equal(page.restoreRequired,'KEY_MISSING');assert.equal(page.model,null);
  assert.equal(dom.window.document.querySelector('#phone h1').textContent,'Restore required');
  assert.equal(dom.window.document.querySelector('#phone form'),null);
  assert.equal(dom.window.document.querySelector('#phone input'),null);
  assert.deepEqual(await activeGeneration(indexedDB),legacy,'missing key cannot replace the existing generation');
  page.close();dom.window.close();
});

test('all three write paths use one actual sampled local timestamp and preserve real facts',async t=>{
  const {page,calendar}=await open(t);const at=calendar.sample();
  assert.equal((await page.model.weighIn(170.5)).ok,true);
  assert.deepEqual(page.model.stateFromOps().reads,[{d:at.day,w:170.5}]);
  await page.refresh();{const r=await page.workout.gym.start();assert.equal(r.ok,true,JSON.stringify(r));}const view=await page.workout.gym.read();
  assert.equal((await page.workout.gym.logSet({startId:view.startId,slot:view.set.slot,lift:view.set.lift,
    load:'40',reps:'10',effort:EFFORT_CHOICES.find(x=>x.label==='2').reserve})).ok,true);
  page.checkin.checkin.draft().choose('energy','Moderate');assert.equal((await page.checkin.checkin.save()).ok,true);
  const rows=await ops(page);assert.equal(rows.length,4);
  for(const op of rows) {assert.equal(op.effective.local_date,at.day);assert.equal(op.effective.local_time,at.time.slice(0,5));assert.equal(op.effective.utc_offset,at.offset);}
  assert.equal(page.model.basisState().reads.length,0);assert.equal(page.model.read().morningRead.lb,170.5);
});

test('midnight refuses stale set/check-in/reading, retains typed draft and original Start, explicit close then new day',async t=>{
  const {page,state,dom}=await open(t,time('2026-09-12T03:59:00.000Z'));
  const oldDay=page.model.today,oldWorkout=page.workout,oldReading=page.readings,oldCheckIn=page.checkin;
  assert.equal((await oldWorkout.gym.start()).ok,true);const view=await oldWorkout.gym.read();
  await page.api.render('workout');
  Object.assign(oldWorkout.gymDraft().entry,{load:'40',reps:'8'});
  const input=dom.window.document.querySelector('input');if(input){input.value='40';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));}
  state.iso='2026-09-12T04:01:00.000Z';await page.refresh();
  assert.equal(page.model.today,oldDay);assert.match(dom.window.document.getElementById('today-calendar').textContent,/local date changed/);
  const result=await oldWorkout.gym.logSet({startId:view.startId,slot:view.set.slot,lift:view.set.lift,load:'40',reps:'8',effort:EFFORT_CHOICES.find(x=>x.label==='2').reserve});
  assert.equal(result.code,DAY_CHANGED);assert.equal((await oldReading.weighIn({date:oldDay,lb:170})).code,DAY_CHANGED);
  assert.equal((await oldCheckIn.host.save({energy:'Low'})).code,DAY_CHANGED);assert.equal((await ops(page)).length,1);
  await page.refresh({move:true});assert.equal(page.model.today,'2026-09-12');
  assert.deepEqual(page.retainedDays(),[oldDay]);assert.equal(oldWorkout.gymDraft().entry.load,'40');
  assert.equal(page.workout.summary().phase,'unfinished');assert.equal(page.workout.summary().unfinished.startId,view.startId);
  assert.equal((await page.workout.recover()).ok,true);
  const rows=await ops(page),close=rows.find(x=>x.kind==='session-close');
  assert.equal(close.effective.local_date,oldDay);assert.equal(close.effective.local_time,'00:01');
  assert.equal(close.session_start_op_id,view.startId);
  assert.equal((await oldWorkout.gymHost.host.client.startPreparedWorkout({preparedId:'invalid'})).code,DAY_CHANGED);
});

for(const [name,iso,offset,day,timeText] of [
  ['UTC+13','2026-09-11T12:34:00.000Z',780,'2026-09-12','01:34:00'],
  ['DST fallback','2026-11-01T06:30:00.000Z',-300,'2026-11-01','01:30:00'],
]) test(name+' uses local day/offset in actual boot and writes',async t=>{
  const {page}=await open(t,time(iso,offset));assert.equal(page.model.today,day);
  assert.equal((await page.model.weighIn(171)).ok,true);const [row]=await ops(page);
  assert.equal(row.effective.local_date,day);assert.equal(row.effective.local_time,timeText.slice(0,5));assert.equal(row.effective.utc_offset,offset===780?'+13:00':'-05:00');
});

test('same-day offset change is read afresh by existing check-in host',async t=>{
  const {page,state}=await open(t,time('2026-11-01T05:30:00.000Z',-240));
  assert.equal((await page.model.weighIn(171)).ok,true);
  state.iso='2026-11-01T06:30:00.000Z';state.offset=-300;state.mono+=3600000;
  assert.equal((await page.checkin.host.save({energy:'Low'})).ok,true);
  const rows=await ops(page);assert.equal(rows[0].effective.utc_offset,'-04:00');assert.equal(rows[1].effective.utc_offset,'-05:00');
});

test('reopen next local day projects weights and uses unfinished-session path',async t=>{
  const {page,indexedDB,dom,state,calendar}=await open(t);
  assert.equal((await page.model.weighIn(170)).ok,true);await page.refresh();{const r=await page.workout.gym.start();assert.equal(r.ok,true,JSON.stringify(r));}page.close();
  state.iso='2026-09-12T12:34:56.000Z';state.mono+=86400000;
  const next=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar});t.after(()=>next.close());
  assert.equal(next.model.today,'2026-09-12');assert.equal(next.model.read().latestRead.lb,170);
  assert.equal(next.workout.summary().phase,'unfinished');assert.equal(next.workout.summary().unfinished.day,'2026-09-11');
});

test('explicit demo uses separate storage and mode switch cannot replace owner setup or facts',async t=>{
  const {page,indexedDB,dom,calendar}=await open(t);assert.equal((await page.model.weighIn(170)).ok,true);
  const demo=await boot({mode:'demo',document:dom.window.document,indexedDB,crypto:webcrypto});
  assert.equal(demo.hosts.databaseName,DEMO_DATABASE);assert.equal(demo.model.storedReads().length,0);
  assert.match(dom.window.document.getElementById('phone').textContent,/Demo · fictional athlete/);
  const owner=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar});t.after(()=>owner.close());
  assert.equal(owner.hosts.databaseName,TODAY_DATABASE);assert.equal(owner.model.read().morningRead.lb,170);
  assert.equal(owner.model.basisState().athlete_label,setup().athlete_label);
});

test('calendar serializes contexts and refuses conflicting explicit providers',async()=>{
  const {calendar,state}=time();let release;const hold=new Promise(r=>release=r);
  const a=calendar.run('2026-09-11',async()=>{const first=calendar.clock.now();await hold;assert.equal(calendar.clock.now(),first);return first;});
  await Promise.resolve();state.iso='2026-09-12T12:00:00.000Z';const b=calendar.run('2026-09-11',()=>assert.fail('stale action ran'));release();
  assert.equal(await a,'2026-09-11T12:34:56.789Z');assert.equal((await b).code,DAY_CHANGED);
  await assert.rejects(openTodayInstallation({indexedDB:new IDBFactory(),crypto:webcrypto,calendar,clock:{today:()=>''}}),/LOCAL_ERA_CLOCK_MISMATCH/);
});

test('historical close checks actual permission time, not the old session day',async t=>{
  const {page,state}=await open(t);
  assert.equal((await page.workout.gym.start()).ok,true);const view=await page.workout.gym.read();
  const old=await page.hosts.createGymHost({day:page.model.today,engineState:page.model.stateFromOps(),plannedSplitSlotId:'earned-today-preview/'+page.model.today,historicalClose:true});
  t.after(()=>old.close());
  state.iso='2028-09-11T12:34:56.789Z';state.mono+=731*86400000;
  const prepared=await old.host.client.prepareWorkoutContinuation({session_start_op_id:view.startId});
  assert.equal(prepared.prepared,true,JSON.stringify(prepared));
  const result=await old.host.client.executeResumedWorkout({resumeId:prepared.resumeId,action:'close',input:{session_start_op_id:view.startId,completion_kind:'early'}});
  assert.equal(result.acknowledged,false,JSON.stringify(result));
  assert.notEqual(result.code,DAY_CHANGED);assert.equal(result.state,20,JSON.stringify(result));
  assert.equal(Object.keys((await old.repository.load()).generation.collections.ops).length,1);
});

test('an actual reading handle cannot backdate an entry while its own day is current',async t=>{
  const {page}=await open(t);
  const result=await page.readings.weighIn({date:'2026-09-10',lb:170});
  assert.equal(result.code,'LOCAL_CALENDAR_DATE_MISMATCH');assert.equal((await ops(page)).length,0);
});

test('foreground day change preserves check-in and weight editors until explicit transition',async t=>{
  const {page,state,dom}=await open(t,time('2026-09-12T03:59:00.000Z'));
  await page.api.render('recovery');page.checkin.checkin.draft().choose('energy','Low');
  const original=page.checkin;state.iso='2026-09-12T04:01:00.000Z';
  dom.window.dispatchEvent(new dom.window.Event('focus'));await page.refresh();
  assert.equal(page.checkin,original);assert.equal(original.checkin.draft().state().choices.energy,'Low');
  await page.refresh({move:true});assert.equal(page.model.today,'2026-09-12');
  await page.api.openWeighIn();const input=dom.window.document.querySelector('[role=dialog] input');input.value='173.2';
  state.iso='2026-09-13T04:01:00.000Z';await page.refresh();
  assert.equal(input.isConnected,true);assert.equal(input.value,'173.2');await page.refresh({move:true});
  assert.deepEqual(page.retainedDays(),['2026-09-11','2026-09-12']);
  const oldButton=[...dom.window.document.querySelectorAll('#today-calendar button')].find(x=>x.textContent.includes('2026-09-12'));
  oldButton.click();assert.equal(input.isConnected,true);assert.equal(input.value,'173.2');
});

test('two owner boots serialize one installation without replacing a clock provider',async t=>{
  const indexedDB=new IDBFactory(),dom=document(),calendar=createLocalCalendar();await enroll(indexedDB,calendar);
  const config={document:dom.window.document,indexedDB,crypto:webcrypto};
  const [first,second]=await Promise.all([boot(config),boot(config)]);t.after(()=>{first.close();second.close();dom.window.close();});
  assert.equal(first.setupRequired,false);assert.equal(second.setupRequired,false);assert.equal(second.restoreRequired,null);
  assert.equal(dom.window.document.querySelectorAll('#today-calendar').length,1);
  assert.deepEqual(second.hosts.clockAdoptions(),[]);assert.equal((await second.model.weighIn(170)).ok,true);
});

test('future explicit programme cannot expose the engine fallback week as Today',async t=>{
  const indexedDB=new IDBFactory(),dom=document(),{calendar}=time(),future=setup();future.split.from='2027-01-01';
  await enroll(indexedDB,calendar,future);
  const page=await boot({document:dom.window.document,indexedDB,crypto:webcrypto,calendar});t.after(()=>{page.close();dom.window.close();});
  assert.equal(page.model.read().workout.available,false);
  assert.equal(page.model.read().workout.unavailableReason,'WORKOUT_SPLIT_NOT_IN_FORCE');
  assert.equal(page.workout.summary().phase,'blocked');assert.equal((await ops(page)).length,0);
});
