# Settings D2 round-3 execution annex

Exact head ea78c24b8c1efd987c62ebfaad923026dac5d262. All input is synthetic. Save the block at repository root as .d2-settings-r3-probes.mjs and run node .d2-settings-r3-probes.mjs. A real workout card exits through its actual controls while a settings read is deferred; both success and failure must preserve the destination and its half-entered draft. Four combinations pass.

```js
import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createGymHost} from './rebuild/m3/w7-preview/today/gym-host.mjs';import {createGymModel} from './rebuild/m3/w7-preview/today/gym-model.mjs';
import {mountGym} from './rebuild/m3/w7-preview/today/gym-app.mjs';import T from './rebuild/m3/w7-preview/today/today-model.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY,today=T.createTodayModel({}),fault=faultDatabase();const gym=await createGymHost({day,indexedDB:fault.indexedDB,crypto:webcrypto,engineState:today.stateFromOps(),plannedSplitSlotId:'earned-today-preview/'+day});const model=createGymModel({gymHost:gym,sessionTitle:today.read().workout.title});await model.start();
for(const exit of ['back','checkin'])for(const outcome of ['success','failure']){
 const dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml())),doc=dom.window.document,phone=doc.getElementById('phone');let resolve,reject;const delayed=new Promise((a,b)=>{resolve=a;reject=b});
 const leave=()=>{phone.innerHTML='<input id="destination-draft" value="Synthetic half entry">'};
 const mounted=mountGym(doc,phone,{model,onBack:leave,onCheckIn:leave,settings:{latest:()=>delayed}});await mounted;
 const button=doc.querySelector(exit==='back'?'[data-action="back"]':'[data-action="checkin"]');assert(button,'exit control');button.click();assert.equal(mounted.settings.owns(),false);
 if(outcome==='success')resolve(null);else reject(Error('SYNTHETIC_LATE_READ_FAILURE'));await mounted.settings.read();assert.equal(doc.querySelector('#destination-draft').value,'Synthetic half entry');assert.equal(doc.querySelector('[data-slot="log"]'),null);dom.window.close();
}
console.log('D2 settings R3: Back/check-in x late success/failure preserves destination and draft: 4/4 PASS.');gym.close();
```

Commands independently executed on the head:
- node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs: 51/51, including the final restoration check.
- node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*: 1275/1275.
- node rebuild/m3/w7-preview/today/build.mjs: PASS, 3 assets/107 inputs, earned-93f352addb77.
- node rebuild/m3/w7-preview/today/machine-settings-check.mjs: PASS, Edge, three verified process kills, including Back-to-Today and log-with-editor; TEMP/TMP inside own worktree.
- S-M1 through S-M10: all killed, failed-test counts 5,7,3,4,1,4,1,4,38,5. S-M6 requires a cached saved record in the actual log handler; four failures. Changed-path R3-M1 replaces the sole owns = false in leaveCard with owns = true; this independent probe fails with AssertionError.

Original source bytes restored in finally after each mutation batch; tracked diff empty. Both-OS CI 34715966705 and suite/preview 34715966766 verified through GitHub API at the full head. Local B-NTC custody limit and CI registration residual are in the main review. Previous reproductions remain in Git history.
