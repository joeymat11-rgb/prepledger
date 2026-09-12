# N2 D2 synthetic reproduction annex

Exact head 3925e90e79699f19d7dc166b7941eb122eed18bf. Run from a dependency-ready repository root. The first script confirms eight defect observations; its assertions intentionally describe the observed wrong behavior. Save as .d2-n2-probes.mjs and run node .d2-n2-probes.mjs. No private records or product edits.

```js
import a from 'node:assert/strict';import fs from 'node:fs';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createSleepHost,sleepNightsIn,PROFILE} from './rebuild/m3/w7-preview/today/sleep-host.mjs';
import S from './rebuild/m3/w7-preview/today/sleep-model.cjs';import T from './rebuild/m3/w7-preview/today/today-model.cjs';import A from './rebuild/m3/w7-preview/today/today-app.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
import {createWorkoutEntry,createCheckInEntry} from './rebuild/m3/w7-preview/today/today-entry.mjs';
const day=T.SYNTHETIC_DAY,night=S.nightDateFor(day),fault=faultDatabase(),inputs={indexedDB:fault.indexedDB,crypto:webcrypto};
const host=await createSleepHost({day,...inputs}),model=T.createTodayModel({today:day});
const source=fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs','utf8'),body=source.slice(source.indexOf('function sleepEntryFor('),source.indexOf('function openSleepLane(')).trim(),factory=Function('return ('+body+')')();
function page(lane,m=model,more={}){const dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=sleep'}),doc=dom.window.document,api=A.mountToday(doc,m,{sleep:lane,...more});return {dom,doc,api,pick:s=>doc.querySelector('[data-slot="'+s+'"]'),type(s,v){const el=this.pick(s);el.value=v;el.dispatchEvent(new dom.window.Event('input',{bubbles:true}))},async save(h){this.pick('sleep-mode-hours').click();this.type('sleep-hours',String(h));this.pick('sleep-save').click();await api.sleepPending();}}}
let observations=0;const found=name=>{observations++;console.log('CONFIRMED '+name)};
// A nonempty but nonexistent source id is admitted by the real producer/store.
const forged=await host.save({date:night,hours:7,from_checkin_op_id:'synthetic-nonexistent-source'});a.equal(forged.ok,true);a.equal((await host.all()).length,1);found('N2-01 forged source accepted');
// The unchanged captured gym host never receives the newly projected sleep row.
const workout=await createWorkoutEntry(model,inputs),before=workout.gymHost.host.lastProjection().accepted_state.sleep.nights.find(n=>n.d===night)?.h;
const lane=factory(host,await host.all()),p=page(lane);await p.save(1);await workout.refresh();a.equal(model.loggedSleep(night).h,1);a.equal(workout.gymHost.host.lastProjection().accepted_state.sleep.nights.find(n=>n.d===night)?.h,before);a.notEqual(before,1);found('N2-10 Today changes but actual gym captured state stays old');
// A stale screen can replace a newer complete night without a precondition.
const stale=page(factory(host,await host.all()),T.createTodayModel({today:day}));await host.save({date:night,hours:9});await stale.save(6);a.equal(S.recordedNight(await host.all(),night).night.hours,6);found('N2-05 stale editor overwrites newer night');
// A clock/source-origin field is lost rather than preserved on same-date overlay.
const basis={sleep:{nights:[{d:night,h:8,bed:'23:00',wake:'07:00',awakeMin:0,sourceNote:'synthetic original'}]}},projected=S.projectSleepNights(basis,[{night:{date:night,hours:6}}],model.engine);a.equal(projected.sleep.nights[0].sourceNote,undefined);a.equal(basis.sleep.nights[0].sourceNote,'synthetic original');found('N2-13 unrelated row field removed');
// Device identity is discarded; unordered devices receive an invented winner.
const op=(id,device,h)=>({op_id:id,device_id:device,device_seq:1,kind:'fact',class:'sleep',causal_parents:[],effective:{local_date:day},payload:{profile:PROFILE,night:{date:night,hours:h}}});const rows=sleepNightsIn({collections:{ops:{a:op('a','device-a',3),b:op('b','device-b',9)}}});a.equal(rows.length,2);a.equal(S.winningNights(rows).length,1);found('N2-06 unordered-device winner invented');
// Actual factory reports committed/read-failed, but screen discards the known value/draft.
const failHost=await createSleepHost({day,indexedDB:faultDatabase().indexedDB,crypto:webcrypto}),failedLane=factory({...failHost,async all(){throw Error('SYNTHETIC_READ_FAILURE')}},[]),failurePage=page(failedLane,T.createTodayModel({today:day,basisState:{...model.basisState(),sleep:{...model.basisState().sleep,nights:[]}}}));await failurePage.save(5);a.equal((await failHost.all()).length,1);a.equal(failurePage.pick('sleep-recorded').hidden,true);a.equal(failurePage.pick('sleep-hours').value,'');found('N2-14 acknowledged read failure loses visible night and draft');
// An in-flight save renders Sleep even after explicit navigation away.
let release;const deferred=new Promise(r=>release=r),navPage=page({rows:()=>[],save:()=>deferred},T.createTodayModel({today:day}));navPage.pick('sleep-mode-hours').click();navPage.type('sleep-hours','4');navPage.pick('sleep-save').click();navPage.api.render('today');release({ok:true,readBack:false});await navPage.api.sleepPending();a.equal(navPage.api.screen(),'sleep');found('N2-15 late save steals navigation');
// There is no night selector or quality display in the rendered contract.
a.equal(p.doc.querySelector('input[type="date"]'),null);a.equal(/Quality:|Quality not recorded\./.test(p.doc.getElementById('phone').textContent),false);found('N2-04/08 selected-date and quality states absent');
console.log('D2 N2 independent baseline defects: '+observations+'/8 confirmed.');for(const q of [p,stale,failurePage,navPage])q.dom.window.close();host.close();failHost.close();workout.gymHost.close();

```

Save the following as .d2-n2-checkin-probe.mjs and run node .d2-n2-checkin-probe.mjs. It confirms the ninth observation through the real check-in entry and DOM.
```js
import a from 'node:assert/strict';import fs from 'node:fs';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createSleepHost} from './rebuild/m3/w7-preview/today/sleep-host.mjs';import {createCheckInEntry} from './rebuild/m3/w7-preview/today/today-entry.mjs';import S from './rebuild/m3/w7-preview/today/sleep-model.cjs';import T from './rebuild/m3/w7-preview/today/today-model.cjs';import A from './rebuild/m3/w7-preview/today/today-app.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY,base=T.createTodayModel({today:day}).basisState();base.sleep.nights=[];const model=T.createTodayModel({today:day,basisState:base}),input={indexedDB:faultDatabase().indexedDB,crypto:webcrypto},host=await createSleepHost({day,...input}),entry=await createCheckInEntry(model,input);
entry.checkin.draft().choose('soreness','Mild');entry.checkin.draft().set('soreness_location','Synthetic half entry');
const source=fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs','utf8'),body=source.slice(source.indexOf('function sleepEntryFor('),source.indexOf('function openSleepLane(')).trim(),lane=Function('return ('+body+')')()(host,[]),dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=sleep'}),doc=dom.window.document,api=A.mountToday(doc,model,{sleep:lane,checkin:entry});await api.checkInKitReady();
const pick=s=>doc.querySelector('[data-slot="'+s+'"]');pick('sleep-mode-hours').click();const box=pick('sleep-hours');box.value='6';box.dispatchEvent(new dom.window.Event('input'));pick('sleep-save').click();await api.sleepPending();await api.render('recovery');a.equal([...doc.querySelectorAll('input,textarea')].some(x=>x.value==='Synthetic half entry'),false);a.equal(entry.checkin.draft().state().fields.soreness_location,'Synthetic half entry');console.log('CONFIRMED N2-07 new check-in mount loses unrelated held draft on sleep rebind');dom.window.close();host.close();entry.host.close();

```

Commands: node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/sleep.test.mjs (34/34); node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.* (1314/1314); node rebuild/m3/w7-preview/today/build.mjs (PASS); node rebuild/m3/w7-preview/today/sleep-check.mjs (PASS, three verified Edge process kills, TEMP/TMP inside own worktree).
For each N2-01..N2-18, node --test --test-reporter=tap --test-name-pattern=N2-XX rebuild/m3/w7-preview/today/test/sleep.test.mjs ran. Selected pass counts in order: 2,3,3,2,3,4,1,2,1,1,1,1,1,5,1,4,1,1. Overlapping labels mean these are not additive test counts or complete row coverage.
M01-M12 source mutations and failed-test counts are named in the main review. Every original Buffer was restored in finally; tracked diff empty and final 34/34. Local logs/scripts remain under work/lane-d2/review-n2 only. No forbidden history input was read.
