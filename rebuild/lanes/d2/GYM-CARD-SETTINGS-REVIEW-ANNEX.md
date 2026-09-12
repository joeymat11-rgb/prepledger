# Settings D2 round-2 reproduction annex

Exact head 3c5d4c1. All literals synthetic. Save this at repository root as .d2-settings-r2-probes.mjs and run node .d2-settings-r2-probes.mjs. The Back callback replaces the shared phone surface just as the parent navigation does; the deferred read then incorrectly reclaims it. Three failed-read closure assertions pass; the subsequent four observations confirm the navigation defect.

```js
import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createGymHost} from './rebuild/m3/w7-preview/today/gym-host.mjs';import {createGymModel} from './rebuild/m3/w7-preview/today/gym-model.mjs';
import {mountGym,SETTINGS_NONE} from './rebuild/m3/w7-preview/today/gym-app.mjs';import T from './rebuild/m3/w7-preview/today/today-model.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY,today=T.createTodayModel({}),fault=faultDatabase();
const gym=await createGymHost({day,indexedDB:fault.indexedDB,crypto:webcrypto,engineState:today.stateFromOps(),plannedSplitSlotId:'earned-today-preview/'+day});
const model=createGymModel({gymHost:gym,sessionTitle:today.read().workout.title});await model.start();
const shell=()=>new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()));
const a=shell(),adoc=a.window.document;const failed=mountGym(adoc,adoc.getElementById('phone'),{model,onBack(){},settings:{latest:async()=>{throw Error('SYNTHETIC_READ_FAILURE')}}});await failed;await failed.settings.read();
assert(adoc.querySelector('[data-slot="log"]'));assert(!adoc.querySelector('[data-slot="settings-block"]').textContent.includes(SETTINGS_NONE));assert(adoc.querySelector('[data-action="settings-open"]').disabled);
console.log('D2 settings R2: failed read preserves card, no empty claim, no editor; 3 observations pass.');
const b=shell(),doc=b.window.document,phone=doc.getElementById('phone');let release;const delayed=new Promise(r=>release=r);
const mounted=mountGym(doc,phone,{model,onBack(){phone.textContent='SYNTHETIC_OTHER_SCREEN'},settings:{latest:()=>delayed}});await mounted;assert(doc.querySelector('[data-slot="log"]'));
doc.querySelector('[data-action="back"]').click();assert.equal(phone.textContent,'SYNTHETIC_OTHER_SCREEN');release(null);await mounted.settings.read();
assert.notEqual(phone.textContent,'SYNTHETIC_OTHER_SCREEN');assert(doc.querySelector('[data-slot="log"]'));
console.log('D2 settings R2: slow read permits log, then late result resurrects card after Back; 4 observations confirmed.');gym.close();a.window.close();b.window.close();

```

Commands: node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs (48/48); node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.* (1272/1272); node rebuild/m3/w7-preview/today/build.mjs (PASS); node rebuild/m3/w7-preview/today/machine-settings-check.mjs (Edge, 3 verified kills, TEMP/TMP inside this worktree).

S-M1 to S-M10 mutation failed-test counts: 5,7,3,4,1,4,1,4,35,5. S-M6 now uses !settingsRead.get(view.lift.id)?.latest in the log guard; four tests detect it. All temporary mutations restored in finally, tracked diff empty, settings 48/48. Prior-round reports/repro remain in Git history. No forbidden input was read.
