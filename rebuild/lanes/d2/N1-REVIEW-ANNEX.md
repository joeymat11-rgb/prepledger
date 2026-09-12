# N1 D2 reproduction annex

All literals below are synthetic. Run from the exact candidate's repository root in a sparse D2 worktree. No product files need changing for these witnesses. The snippet confirms defects; passing assertions are not product acceptance.

Independent commands: `node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/food.test.mjs` (46/46); `node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*` (1256/1256); `node rebuild/m3/w7-preview/today/build.mjs` (PASS); `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` (local FAIL); `node rebuild/m3/w7-preview/today/food-check.mjs` with W7_BROWSER_BIN pointing at installed Edge and TEMP/TMP inside the review worktree (launch failure, no kill proof).

Dependencies installed locally using pnpm, including root, W6 and W5; Node v24.19.0. The W5 frozen lockfile was honored; W6 dependency versions match its package manifest. Remote CI used its committed workflow. No environment-only failure is classified as a product defect here.

Save this block as .d2-n1-probes.mjs at the repository root; run `node .d2-n1-probes.mjs`.
```js
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';
import {createFoodHost} from './rebuild/m3/w7-preview/today/food-host.mjs';
import {createCleanInitState} from './rebuild/m3/w7-preview/today/setup-model.mjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';
import A from './rebuild/m3/w7-preview/today/today-app.cjs';
import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY;
const basis=createCleanInitState({setup:{athlete_label:'Synthetic',split:{from:day,map:{0:'REST',1:'U',2:'REST',3:'REST',4:'REST',5:'REST',6:'REST'}},exercises:[{id:'press',n:'Press',mg:'chest',day:'U',sets:2,hi:8,inc:5,steps:[5,10]}],priority_muscles:[]}});
const fault=faultDatabase();const host=await createFoodHost({day,indexedDB:fault.indexedDB,crypto:webcrypto});
let rows=[];const food={rows:()=>rows,save:async values=>{const r=await host.save(values);rows=await host.all();return r;}};
assert.equal((await food.save({pro:150})).ok,true);
assert.equal(rows.length,1);
assert.throws(()=>T.createTodayModel({today:day,basisState:basis,foodDays:food}).loggedFood(day),TypeError);
const dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=nutrition'});
const model=T.createTodayModel({today:day});
const api=A.mountToday(dom.window.document,model,{food,setup:{firstRun:()=>true}});
assert.equal(api.screen(),'nutrition');
assert.equal(dom.window.document.querySelector('[data-slot="food-entry"]').hidden,false);
const recorded=dom.window.document.querySelector('[data-slot="food-recorded"]').textContent;
assert.equal(recorded.includes(rows[0].time),false);
host.close();dom.window.close();
console.log('D2 N1: 6 defect observations confirmed; synthetic only.');
```

Mutation failed-test counts P1-P12 respectively: 3,1,4,5,3,1,2,1,1,13,4,12. Each mutation ran independently against food.test.mjs with original bytes restored in finally; final 46/46 and tracked diff empty. No mutation was committed.
