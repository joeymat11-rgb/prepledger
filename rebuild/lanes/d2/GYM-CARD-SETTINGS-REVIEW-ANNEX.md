# Gym-card settings D2 reproduction annex

Run on fffc983 from the repository root in a sparse D2 worktree. All literals are synthetic, and the snippet confirms defects rather than asserting product acceptance. Save the block as .d2-settings-probes.mjs, then `node .d2-settings-probes.mjs`.

```js
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';
import {createGymHost} from './rebuild/m3/w7-preview/today/gym-host.mjs';
import {createGymModel} from './rebuild/m3/w7-preview/today/gym-model.mjs';
import {createMachineSettingsHost} from './rebuild/m3/w7-preview/today/machine-settings-host.mjs';
import {mountGym,SETTINGS_NONE} from './rebuild/m3/w7-preview/today/gym-app.mjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';
import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY, today=T.createTodayModel({});
const fault=faultDatabase(), lane={day,indexedDB:fault.indexedDB,crypto:webcrypto};
const gym=await createGymHost({...lane,engineState:today.stateFromOps(),plannedSplitSlotId:'earned-today-preview/'+day});
const settings=await createMachineSettingsHost(lane);
const model=createGymModel({gymHost:gym,sessionTitle:today.read().workout.title});await model.start();
const view=await model.read();assert.equal((await settings.save({exercise_id:view.lift.id,settings:[{name:'Seat',value:'four'}]})).ok,true);
const shell=()=>new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()));
const a=shell();await mountGym(a.window.document,a.window.document.getElementById('phone'),{model,onBack(){},settings:{latest:async()=>{throw Error('SYNTHETIC_READ_FAILURE')}}});
assert(a.window.document.querySelector('[data-slot="settings-block"]').textContent.includes(SETTINGS_NONE));
const b=shell();let release;const pending=new Promise(r=>release=r);let completed=false;
const mounted=mountGym(b.window.document,b.window.document.getElementById('phone'),{model,onBack(){},settings:{latest:()=>pending}}).then(()=>completed=true);
await new Promise(r=>setTimeout(r,50));
assert.equal(completed,false);assert.equal(b.window.document.querySelector('[data-slot="log"]'),null);
release(null);await mounted;assert(b.window.document.querySelector('[data-slot="log"]'));
settings.close();gym.close();a.window.close();b.window.close();
console.log('D2 settings: failed-read empty claim and primary-card wait confirmed.');
```

Commands: `node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs` (43/43); `node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*` (1253/1253); `node rebuild/m3/w7-preview/today/build.mjs` (PASS); `node rebuild/m3/w7-preview/today/machine-settings-check.mjs` with installed Edge and TEMP/TMP inside this worktree (PASS, 3 verified kills). Local package gate is blocked by the forbidden history input; no attempt was made to bypass custody.

Mutation failed-test counts S-M1 to S-M10: 5,7,3,4,1,0,1,4,31,5. For S-M6, mutate only the log handler's `if (busy) return;` to `if (busy || !settingsLatest) return;`, run the 43-test suite and observe 43/43 despite the new prerequisite. Restore bytes in finally. Other probes respectively mix exercise IDs, print zero, select first capture, bypass imported validation, add a second profile, change a pinned file, normalize four to 4, omit outbox and insert an em dash. Final tracked diff is empty.

Node v24.19.0; root dependencies installed locally, W5/W6 frozen lockfiles honored. Reports contain counts and public code only; no private fixtures or raw test/browser logs.
