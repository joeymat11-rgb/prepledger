# N1 D2 round-3 execution annex

Exact head a61c851dfa1300a54be2be1ac3debcb6489c11c0. All input is synthetic. Save the block at repository root as .d2-n1-r3-probes.mjs and run node .d2-n1-r3-probes.mjs. This executes the actual foodEntryFor function body from the candidate, with a real food host and only the post-commit all() read faulted. It verifies failed/successful read retries never resubmit the intake.

```js
import assert from 'node:assert/strict';import fs from 'node:fs';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createFoodHost} from './rebuild/m3/w7-preview/today/food-host.mjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';import A from './rebuild/m3/w7-preview/today/today-app.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY,fault=faultDatabase(),host=await createFoodHost({day,indexedDB:fault.indexedDB,crypto:webcrypto});
const source=fs.readFileSync('rebuild/m3/w7-preview/today/today-app.cjs','utf8');
const body=source.slice(source.indexOf('function foodEntryFor('),source.indexOf('function openFoodLane(')).trim();
const actualFactory=Function('return ('+body+')')();let fail=true,saveCalls=0;
const wrapped={...host,async save(v){saveCalls++;return host.save(v)},async all(){if(fail)throw Error('SYNTHETIC_READBACK_FAILURE');return host.all()}};
const lane=actualFactory(wrapped,[]),dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=nutrition'});
const doc=dom.window.document,api=A.mountToday(doc,T.createTodayModel({today:day}),{food:lane});
doc.querySelector('#food-cal').value='1800';doc.querySelector('[data-slot="food-save"]').click();await assert.doesNotReject(api.foodPending());
assert.equal(saveCalls,1);assert.equal((await host.all()).length,1);assert(doc.querySelector('[data-slot="food-recorded"]').textContent.includes('Recorded today'));assert(doc.querySelector('[data-slot="food-error"]').textContent.includes('SYNTHETIC_READBACK_FAILURE'));assert.equal(doc.querySelector('#food-cal').value,'1800');
doc.querySelector('[data-slot="food-retry"]').click();await assert.doesNotReject(api.foodPending());assert.equal(saveCalls,1);assert.equal(doc.querySelector('#food-cal').value,'1800');assert.equal(doc.querySelector('[data-slot="food-retry"]').hidden,false);
fail=false;doc.querySelector('[data-slot="food-retry"]').click();await assert.doesNotReject(api.foodPending());assert.equal(saveCalls,1);assert.equal((await host.all()).length,1);assert.equal(doc.querySelector('[data-slot="food-retry"]').hidden,true);assert.equal(doc.querySelector('[data-slot="food-error"]').textContent,'');
console.log('D2 N1 R3: actual factory acknowledgment, failed/successful read retries and no resubmission PASS.');host.close();dom.window.close();
```

Commands independently executed on the head:
- node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/food.test.mjs: 56/56, including the final restoration check.
- node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*: 1280/1280.
- node rebuild/m3/w7-preview/today/build.mjs: PASS, 3 assets/107 inputs, earned-ddb6ff98e742.
- node rebuild/m3/w7-preview/today/food-check.mjs: PASS, Edge, three verified process kills; TEMP/TMP inside own worktree.
- Original P1-P12 mutation variants: all killed, failed-test counts 4,1,7,7,3,3,3,1,1,16,4,15; P2 admits over-cap input. Changed-path R3-M1 replaces the actual factory's readBack:false return with throw error; R3-M2 adds foodLane.save(foodReadBack.day) before retry refresh. Both fail this independent probe with AssertionError.

Original source bytes restored in finally after each mutation batch; tracked diff empty. Both-OS CI 34716744946 and suite/preview 34716744942 verified through GitHub API at the full head. Local B-NTC custody limit and CI registration residual are in the main review. Previous reproductions remain in Git history.
