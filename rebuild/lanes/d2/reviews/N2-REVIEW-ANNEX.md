# N2 review round 2: executable evidence annex

Exact head 7d2fdab6fd0a41ead7c9edc4534d002ca2905504. This replaces the round-1 annex; the prior witness remains at 8cfe796. Review before builder report, local synthetic storage only, no private reads. These are defect-observation scripts: they assert the current wrong outcome, so their assertions should turn RED when the defect is fixed.

## Reproduction
Save each fenced module at the ROOT OF YOUR OWN WORKTREE as `.d2-n2-r2-probes.mjs` and `.d2-n2-r2-boundaries.mjs`, then run `node <filename>`. Use the checked-in root/W6/W5 development dependencies, including jsdom and fake-indexeddb; no credential or live service is needed. Do not run alongside tests that mutate product files. All imports are public source; every value is synthetic.

The first module uses the exact source `sleepEntryFor` factory rather than a hand-written save adapter. It confirms seven defects: two concurrent corrections acknowledge, real check-in reuse hidden, second check-in re-entry reverts new draft text, saved-unread correction displays old hours, failed reconciliation claims nothing saved, late save leaves gym stale, actual boot leaves gym stale. The second injects a real IDB commit abort (PASS, neither op nor outbox survives) and invokes the actual coach tool twice (both report 8 h despite a stored 1 h night, including after reopen). No network/model call is made.

### Main probes
```javascript
import a from 'node:assert/strict';
import fs from 'node:fs';
import {webcrypto} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';
import {createSleepHost} from './rebuild/m3/w7-preview/today/sleep-host.mjs';
import {createWorkoutEntry,createCheckInEntry,boot} from './rebuild/m3/w7-preview/today/today-entry.mjs';
import S from './rebuild/m3/w7-preview/today/sleep-model.cjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';
import A from './rebuild/m3/w7-preview/today/today-app.cjs';
import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY, night=S.nightDateFor(day);
const source=fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs','utf8');
const body=source.slice(source.indexOf('function sleepEntryFor('),source.indexOf('function openSleepLane(')).trim();
const factory=Function('return ('+body+')')();
const shell=()=>D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml());
const found=[];const log=(id,detail)=>{found.push(id);console.log(JSON.stringify({id,...detail}));};
async function fixture(){const fault=faultDatabase(),inputs={indexedDB:fault.indexedDB,crypto:webcrypto};const basis=T.createTodayModel({today:day}).basisState();basis.sleep.nights=[];const model=T.createTodayModel({today:day,basisState:basis});const host=await createSleepHost({day,...inputs});return {fault,inputs,model,host};}
function page(f,lane,extra={}){const dom=new JSDOM(shell(),{url:'http://localhost/?screen=sleep'});Object.defineProperty(dom.window,'indexedDB',{value:f.inputs.indexedDB});Object.defineProperty(dom.window,'crypto',{value:webcrypto});const doc=dom.window.document,api=A.mountToday(doc,f.model,{sleep:lane,...extra});const pick=s=>doc.querySelector('#phone [data-slot="'+s+'"]');return {dom,doc,api,pick,type(s,v){const x=pick(s);x.value=v;x.dispatchEvent(new dom.window.Event('input',{bubbles:true}));},async save(h){if(pick('sleep-change')&&!pick('sleep-change').hidden)pick('sleep-change').click();pick('sleep-mode-hours').click();this.type('sleep-hours',String(h));pick('sleep-save').click();await api.sleepPending();},chooseDate(d){const x=pick('sleep-date');x.value=d;x.dispatchEvent(new dom.window.Event('change',{bubbles:true}));}};}
// The two precondition reads happen before the public client's serialized commands.
{
 const f=await fixture(); const one=await f.host.save({date:night,hours:7});a.equal(one.ok,true);
 const results=await Promise.all([f.host.save({date:night,hours:8},{supersedes:one.op_id}),f.host.save({date:night,hours:5},{supersedes:one.op_id})]);
 a.deepEqual(results.map(r=>r.ok),[true,true]);a.equal((await f.host.all()).length,3);
 log('R2-1 concurrent stale correction admitted',{acknowledged:results.map(r=>r.ok),ops:3,winner:S.recordedNight(await f.host.all(),night).night.hours});f.host.close();
}
// The actual check-in stores unit/value, not the number used in the new UI fixture.
{
 const f=await fixture(),entry=await createCheckInEntry(f.model,f.inputs);entry.checkin.draft().set('sleep_hours','7');entry.checkin.draft().choose('sleep_quality','Good');a.equal((await entry.checkin.save()).ok,true);
 const p=page(f,factory(f.host,[]),{checkin:entry});await p.api.checkInKitReady();a.equal(entry.checkin.recorded().answers.sleep_hours.value,7);a.equal(p.pick('sleep-use-checkin').hidden,true);a.match(p.pick('sleep-quality').textContent,/Good/);
 log('R2-2 real entered check-in hours cannot be reused',{stored:entry.checkin.recorded().answers.sleep_hours,useHidden:p.pick('sleep-use-checkin').hidden});p.dom.window.close();f.host.close();entry.host.close();
}
// A draft made in the replacement model disappears on the next route re-entry.
{
 const f=await fixture(),entry=await createCheckInEntry(f.model,f.inputs);entry.checkin.draft().choose('soreness','Mild');entry.checkin.draft().set('soreness_location','Original synthetic detail');
 const p=page(f,factory(f.host,[]),{checkin:entry});await p.api.checkInKitReady();await p.save(6);await p.api.render('recovery');
 let box=[...p.doc.querySelectorAll('#phone input,#phone textarea')].find(x=>x.value==='Original synthetic detail');a.ok(box);box.value='Updated synthetic detail';box.dispatchEvent(new p.dom.window.Event('input',{bubbles:true}));
 p.api.render('today');await p.api.render('recovery');const values=[...p.doc.querySelectorAll('#phone input,#phone textarea')].map(x=>x.value);a.ok(values.includes('Original synthetic detail'));a.equal(values.includes('Updated synthetic detail'),false);
 log('R2-3 second check-in re-entry loses current draft',{revertedToOriginal:true});p.dom.window.close();f.host.close();entry.host.close();
}
// A committed correction with failed read must show the acknowledged new hours.
{
 const f=await fixture();await f.host.save({date:night,hours:8});const rows=await f.host.all();
 const lane=factory({...f.host,async all(){throw Error('SYNTHETIC_READ_FAILURE');}},rows),p=page(f,lane);await p.save(5);
 a.equal(S.recordedNight(await f.host.all(),night).night.hours,5);a.equal(p.api.sleepAck().hours,5);a.match(p.pick('sleep-recorded').textContent,/8 h/);a.doesNotMatch(p.pick('sleep-recorded').textContent,/5 h/);
 log('R2-4 saved-unread correction shows old hours',{durable:5,ack:5,display:p.pick('sleep-recorded').textContent});p.dom.window.close();f.host.close();
}
// A failed reconciliation read does not prove that the preceding command failed.
{
 const f=await fixture(),lane=factory({...f.host,async save(n,p){a.equal((await f.host.save(n,p)).ok,true);throw Error('SYNTHETIC_ACK_LOST');},async all(){throw Error('SYNTHETIC_READ_FAILURE');}},[]),p=page(f,lane);await p.save(4);
 a.equal((await f.host.all()).length,1);a.match(p.pick('sleep-error').textContent,/Nothing was recorded/);a.equal(p.pick('sleep-save').disabled,false);
 log('R2-5 unknown acknowledged outcome mislabeled as no write',{ops:1,display:p.pick('sleep-error').textContent,retryEnabled:true});p.dom.window.close();f.host.close();
}
// A save finished after Back updates Today but skips the actual gym rebind.
{
 const f=await fixture(),workout=await createWorkoutEntry(f.model,f.inputs),real=factory(f.host,[]);let release;const wait=new Promise(r=>release=r);
 const lane={...real,async save(n,p){await wait;return real.save(n,p);}},p=page(f,lane,{workout});p.pick('sleep-mode-hours').click();p.type('sleep-hours','1');p.pick('sleep-save').click();p.api.render('today');release();await p.api.sleepPending();
 a.equal(p.api.screen(),'today');a.equal(f.model.loggedSleep(night).h,1);a.equal(p.api.workoutEntry(),workout);await workout.refresh();a.equal(workout.gymHost.host.lastProjection().accepted_state.sleep.nights.some(n=>n.d===night),false);
 log('R2-6 late save leaves actual gym stale',{todayHours:1,gymHasNight:false,route:'today'});p.dom.window.close();f.host.close();workout.gymHost.close();
}
// Real boot captures gym before opening/replaying the existing sleep lane.
{
 const f=await fixture();await f.host.save({date:night,hours:3});const dom=new JSDOM(shell(),{url:'http://localhost/?screen=sleep'});Object.defineProperty(dom.window,'indexedDB',{value:f.inputs.indexedDB});Object.defineProperty(dom.window,'crypto',{value:webcrypto});
 const b=await boot({document:dom.window.document,today:day,model:f.model,...f.inputs});await b.api.sleepReady();a.equal(b.model.loggedSleep(night).h,3);a.equal(b.api.workoutEntry().gymHost.host.lastProjection().accepted_state.sleep.nights.some(n=>n.d===night),false);
 log('R2-7 real boot does not rebind gym after replay',{todayHours:3,gymHasNight:false});dom.window.close();f.host.close();b.workout.gymHost.close();b.checkin?.host?.close();
}
console.log('D2 round-2 independent defects confirmed: '+found.length);

```

### Commit and actual coach boundary
```javascript
import a from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';
import {createSleepHost} from './rebuild/m3/w7-preview/today/sleep-host.mjs';
import {openCoachWorld} from './rebuild/coach/local-world.mjs';
import Tools from './rebuild/coach/tools.cjs';
const day='2030-02-04',night='2030-02-03';
// Abort the actual pending IDB commit after the active generation put, before completion.
{
 const f=faultDatabase(),host=await createSleepHost({day,indexedDB:f.indexedDB,crypto:webcrypto});
 const before=await host.repository.load();f.state.mode='delay';f.state.armed=true;
 const pending=host.save({date:night,hours:6});await f.state.write.promise;f.state.tx.abort();f.state.release=true;f.state.armed=false;
 const result=await pending,after=await host.repository.load();a.equal(result.ok,false);a.deepEqual(after.generation.collections.ops,before.generation.collections.ops);a.deepEqual(after.generation.collections.outbox,before.generation.collections.outbox);
 console.log(JSON.stringify({id:'commit-abort',refused:!result.ok,opsUnchanged:true,outboxUnchanged:true}));host.close();
}
// The real public coach reader, over a real saved sleep op in its own local generation.
{
 const f=faultDatabase(),inputs={indexedDB:f.indexedDB,crypto:webcrypto,day};let world=await openCoachWorld(inputs);
 const host=await createSleepHost({day,era:{client:world.client,athleteId:world.bindings.athleteId,deviceId:world.bindings.deviceId}});
 a.equal((await host.save({date:night,hours:1})).ok,true);a.equal((await host.all()).at(-1).night.hours,1);
 const one=await Tools.createCoachTools(world).openTurn('synthetic-d2-after-save').call.today_checkin({});
 a.equal(one.ok,true);a.equal(one.values.sleepRecordHours.value,8);a.notEqual(one.values.sleepRecordHours.value,1);
 console.log(JSON.stringify({id:'actual-coach-after-save',durable:1,reported:one.values.sleepRecordHours.value,ok:one.ok}));host.close();world.close();world=await openCoachWorld(inputs);
 const two=await Tools.createCoachTools(world).openTurn('synthetic-d2-after-reopen').call.today_checkin({});
 a.equal(two.ok,true);a.equal(two.values.sleepRecordHours.value,8);const ops=Object.values((await world.bindings.repository.load()).generation.collections.ops);a.equal(ops.find(o=>o.class==='sleep').payload.night.hours,1);
 console.log(JSON.stringify({id:'actual-coach-after-reopen',durable:1,reported:two.values.sleepRecordHours.value,ok:two.ok}));world.close();
}

```

## Commands and coverage
`node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*` -> 1374 pass, 0 fail/skipped. Final standalone sleep -> 43/43. Every separate `--test-name-pattern=N2-XX` ran against sleep.test.mjs: XX 01..18 selected 4,3,3,3,5,5,2,2,2,1,1,1,2,5,1,4,1,1 passes. Overlap is intentional, not extra coverage.

Independent mutations M01..M14: blank accepted / hours cap 25 / equal clocks allowed / awake cap removed / fabricated duration 123 / lowest device sequence wins / basis discarded / obsolete clock fields retained / wrong op class / rejected ops included / stamp removed / escaped em dash / multi-device winner / initial draft carry removed. Failed-test counts: 1,2,1,1,9,6,3,3,1,1,1,3,1,1. All killed by assertions, no syntax failures. Original file buffers restored in finally; final tracked diff empty. M07's first anchor matched twice, runner stopped BEFORE editing it, then resumed with unique `for (const row of previous) if`.

`node rebuild/m3/w7-preview/today/build.mjs` -> PASS 113 inputs, earned-d409fd478846. `node rebuild/m3/w7-preview/today/sleep-check.mjs` -> PASS with W7_BROWSER_BIN at installed Edge and TEMP/TMP inside own worktree/.tmp: three actual profile-scoped taskkill /F /T events, each verified dead. Both modes, correction, same-page A3, gym return and 390/320px app-frame checks passed. All kills occur after observed save; neither commit-boundary kill was executed.

Independent Edge 375x844: app-frame horizontal overflow 0, three inputs 16px/44px, Save 58px high, Tab reaches bed/wake/Save. At synthetic 2x computed fonts: overflow 0, inputs 32px/66.39px, Save 78.39px. Outer document remains 398px (preview frame), so neither result proves outer-page fit. No physical iPhone/keyboard/zoom claim. Enlarged-font stress is not browser zoom.

CI API at exact SHA: rebuild34727122011 Windows/Ubuntu success, 22 passed steps each; pipeline34727122066 suite8/preview7 passed steps, production skipped. New sleep suite absent from enumeration; :178/:184 place it in B1+B2. Local B-NTC command would require forbidden src/history.js and was not executed or bypassed. No workflow review was performed.

C's report read after these executions. N2-12 still invokes the projector twice, N2-11 still asserts an inherited clean-init throw, and named cells do not execute rollover or process-kill boundaries. Normal-path wins are credited in the review; these omissions and the reproduced defects remain explicit.
