# N2 review round 3: executable evidence annex

Exact head 744c63c974626fe7c00a6e5807c6a6bfb1dbee7b. Prior round-2 review/witnesses remain at c25bfcb. These three modules assert the current WRONG outcomes, so their defect assertions should turn RED on a fixed head. Save them at the root of YOUR OWN WORKTREE and run `node <filename>` using the checked-in root/W6/W5 development dependencies. Do not run alongside source mutations. No private file, credential, network service or live model is used; all data is synthetic. Source factories are extracted from the exact candidate rather than replaced by a hand-written adapter.

## .d2-n2-r3-coach.mjs
Three actual-tool observations: 1 h read followed by an 8 h confirmation; withSleep:false still returns 8 h; a separate same-database writer commits 2 h but the already-open reader returns 8 h.
```javascript
import a from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';
import {openCoachWorld} from './rebuild/coach/local-world.mjs';
import Tools from './rebuild/coach/tools.cjs';
const day='2030-02-04',night='2030-02-03';
const inputs=()=>({indexedDB:faultDatabase().indexedDB,crypto:webcrypto,day});
{
 const opts=inputs(),world=await openCoachWorld(opts);a.equal((await world.sleepHost.save({date:night,hours:1})).ok,true);
 const turn=Tools.createCoachTools(world).openTurn('synthetic-d2-confirm');const read=await turn.call.today_checkin({});a.equal(read.values.sleepRecordHours.value,1);
 const saved=await turn.call.answer_checkin({confirmed:true,confirm_sleep_record:true});a.equal(saved.ok,true);
 const stored=world.checkin.recorded();a.equal(stored.answers.sleep_hours.value,8);a.equal(stored.answers.sleep_hours_source,'existing-record');
 console.log(JSON.stringify({id:'R3-C1 confirms different hours',reported:read.values.sleepRecordHours.value,confirmed:stored.answers.sleep_hours.value,source:stored.answers.sleep_hours_source}));world.close();
}
{
 const world=await openCoachWorld({...inputs(),withSleep:false}),read=await Tools.createCoachTools(world).openTurn('synthetic-d2-unqualified').call.today_checkin({});
 a.equal(world.sleepOnLocalEra,false);a.equal(read.ok,true);a.equal(read.values.sleepRecordHours.value,8);
 console.log(JSON.stringify({id:'R3-C2 disabled lane still asserts basis',qualified:world.sleepOnLocalEra,reported:read.values.sleepRecordHours.value,ok:read.ok}));world.close();
}
{
 const opts=inputs(),reader=await openCoachWorld(opts),writer=await openCoachWorld(opts);
 a.equal((await writer.sleepHost.save({date:night,hours:2})).ok,true);
 const sameGeneration=await reader.bindings.repository.load();a.equal(Object.values(sameGeneration.generation.collections.ops).find(o=>o.class==='sleep').payload.night.hours,2);
 const read=await Tools.createCoachTools(reader).openTurn('synthetic-d2-second-client').call.today_checkin({});a.equal(read.ok,true);a.equal(read.values.sleepRecordHours.value,8);
 console.log(JSON.stringify({id:'R3-C3 other same-store client stale',durable:2,reported:read.values.sleepRecordHours.value,ok:read.ok}));writer.close();reader.close();
}

```

## .d2-n2-r3-reconcile.mjs
Real history 5 h -> 8 h; a new 5 h correction throws before commit; the old 5 h op is mistaken for success. No op is added, the draft/error vanish, and the current displayed record stays 8 h.
```javascript
import a from 'node:assert/strict';import fs from 'node:fs';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createSleepHost} from './rebuild/m3/w7-preview/today/sleep-host.mjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';import A from './rebuild/m3/w7-preview/today/today-app.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day='2030-02-04',night='2030-02-03',host=await createSleepHost({day,indexedDB:faultDatabase().indexedDB,crypto:webcrypto});
await host.save({date:night,hours:5});await host.save({date:night,hours:8});
const source=fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs','utf8'),body=source.slice(source.indexOf('function sleepEntryFor(')).match(/^function sleepEntryFor[\s\S]*?^  \}/m)[0],factory=Function('return ('+body+')')();
const lane=factory({...host,async save(){throw Error('SYNTHETIC_BEFORE_COMMIT');}},await host.all());
const dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=sleep'}),doc=dom.window.document,api=A.mountToday(doc,T.createTodayModel({today:day}),{sleep:lane});
const pick=s=>doc.querySelector('#phone [data-slot="'+s+'"]');pick('sleep-change').click();pick('sleep-mode-hours').click();const box=pick('sleep-hours');box.value='5';box.dispatchEvent(new dom.window.Event('input',{bubbles:true}));pick('sleep-save').click();await api.sleepPending();
a.equal((await host.all()).length,2);a.equal((await host.all()).at(-1).night.hours,8);a.equal(pick('sleep-hours').value,'');a.equal(pick('sleep-error').textContent,'');a.match(pick('sleep-recorded').textContent,/8 h/);
console.log(JSON.stringify({id:'R3-U1 historical equal value mistaken for new commit',attempted:5,current:8,ops:2,draftCleared:true,error:pick('sleep-error').textContent}));dom.window.close();host.close();

```

## .d2-n2-r3-dates.mjs
A real historical check-in's Good quality is hidden, then saving the selected historical night switches the displayed date and hides the committed night.
```javascript
import a from 'node:assert/strict';import fs from 'node:fs';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createSleepHost} from './rebuild/m3/w7-preview/today/sleep-host.mjs';import {createCheckInEntry} from './rebuild/m3/w7-preview/today/today-entry.mjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';import A from './rebuild/m3/w7-preview/today/today-app.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day='2030-02-04',chosen='2030-02-02',inputs={indexedDB:faultDatabase().indexedDB,crypto:webcrypto};
const prior=await createCheckInEntry(T.createTodayModel({today:'2030-02-03'}),inputs);prior.checkin.draft().choose('sleep_quality','Good');a.equal((await prior.checkin.save()).ok,true);
const basis=T.createTodayModel({today:day}).basisState();basis.sleep.nights=[];const model=T.createTodayModel({today:day,basisState:basis}),entry=await createCheckInEntry(model,inputs),host=await createSleepHost({day,...inputs});
const source=fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs','utf8'),body=source.slice(source.indexOf('function sleepEntryFor(')).match(/^function sleepEntryFor[\s\S]*?^  \}/m)[0],lane=Function('return ('+body+')')()(host,[]);
const dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=sleep'}),doc=dom.window.document,api=A.mountToday(doc,model,{sleep:lane,checkin:entry});await api.checkInKitReady();
const pick=s=>doc.querySelector('#phone [data-slot="'+s+'"]'),dateBox=pick('sleep-date');dateBox.value=chosen;dateBox.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
a.equal((await entry.host.forDate('2030-02-03')).at(-1).answers.sleep_quality,'Good');a.match(pick('sleep-quality').textContent,/Quality not recorded/);
console.log(JSON.stringify({id:'R3-D1 historical quality hidden',night:chosen,storedQuality:'Good',display:pick('sleep-quality').textContent}));
pick('sleep-mode-hours').click();const box=pick('sleep-hours');box.value='5';box.dispatchEvent(new dom.window.Event('input',{bubbles:true}));pick('sleep-save').click();await api.sleepPending();
a.equal((await host.forDate(chosen)).at(-1).night.hours,5);a.equal(pick('sleep-date').value,'2030-02-03');a.equal(pick('sleep-recorded').hidden,true);
console.log(JSON.stringify({id:'R3-D2 historical save changes selected night',savedNight:chosen,selectedAfter:pick('sleep-date').value,recordedHidden:true}));dom.window.close();host.close();entry.host.close();prior.host.close();

```

## Closure and gate evidence
R2's seven probes were rerun with corrected-outcome assertions. Adaptations only: extract sleepEntryFor up to its two-space closing brace (a new sibling declaration follows it); await the new workoutRebound promise for late-save/boot; inspect api.workoutEntry's new real host. Outcomes: [true,false], ops2/winner8; useHidden false; updated draft retained; acknowledged5 displayed; UNKNOWN fenced; late save and boot have the night. The prior actual coach after-save/reopen probes both now read1 from stored1. A separate two-host concurrent race also yields [true,false]/SLEEP_STALE_NIGHT, ops2. IDB active-put abort preserves both op and outbox collections.

`node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*` -> 1382 pass, no fail/skip. Final standalone sleep50. Each `--test-name-pattern=N2-XX` against sleep.test.mjs executed for 01..18; selected passes 5,3,3,3,7,5,3,3,3,1,1,2,2,5,1,4,1,1 (overlap, not extra coverage).

M01..17: blank accepted / hours cap25 / equal clocks / missing awake cap / fabricated123 duration / lowest sequence wins / basis discarded / obsolete clock fields retained / wrong class / rejected included / missing stamp / escaped em dash / multi-device winner / draft carry removed / commit revision validation removed / coach read reverted / unknown Save fence removed. Failed tests 1,2,1,1,9,9,3,3,1,1,2,5,1,2,1,1,1; all killed, no parse errors. Original buffers restored in finally, final tracked diff empty.

Fresh `node rebuild/m3/w7-preview/today/build.mjs` immediately before `node rebuild/m3/w7-preview/today/sleep-check.mjs`: PASS113inputs/build earned-eb2a833cf6dc, then four genuine profile-scoped taskkill /F /T events verified dead. TEMP/TMP inside own worktree/.tmp, installed Edge via W7_BROWSER_BIN. Both modes/correction, same-page A3, gym return, stored-night boot,390/320app-frame checks green. Browser explicitly did NOT find a free-text box for repeated-visit typing; DOM witness closes that narrower path. No boundary-kill claim.

Independent375x844 and2x computed fonts: app-frame overflow0, inputs16px/44px then32px/66.39px, Save58px then78.39px, Tab reaches bed/wake/Save. Outer document398px is the retained preview frame, so no whole-page fit/iPhone-zoom claim. Exact-head CI34731424731 bothOS22 passed steps each;34731424751 suite8/preview7 passed, production skipped. Sleep not enumerated. Local pre-H3 B-NTC cannot be run inside this lane's private exclusions; not run/bypassed. C must rebase for H3/hotfix combined-head proof per latest routing.

C's report read only after execution. Its old-probe closures reproduce, but read-only coach wrapping leaves stale confirmation closures, an identity-keyed cache is not a durable reread, and historical equality does not identify a newly committed operation. Six defect observations above are independent of builder labels/counts.
