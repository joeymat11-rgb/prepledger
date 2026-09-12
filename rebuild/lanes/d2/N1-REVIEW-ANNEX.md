# N1 D2 round-2 reproduction annex

Exact head ae26fee. All literals synthetic. Save the block at repository root as .d2-n1-r2-probes.mjs and run node .d2-n1-r2-probes.mjs. It confirms eight fixed-path observations and three post-commit failure observations, not product acceptance. The injected food lane uses the same host.save then refresh order as today-app.cjs foodEntryFor; its refresh failure simulates the durable read failing after an acknowledged write.

```js
import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';import {JSDOM} from 'jsdom';
import {faultDatabase} from './rebuild/m3/w6/test/support.mjs';import {createFoodHost} from './rebuild/m3/w7-preview/today/food-host.mjs';
import {createCleanInitState} from './rebuild/m3/w7-preview/today/setup-model.mjs';
import T from './rebuild/m3/w7-preview/today/today-model.cjs';import A from './rebuild/m3/w7-preview/today/today-app.cjs';import D from './rebuild/m3/w7-preview/today/design.cjs';
const day=T.SYNTHETIC_DAY;
const basis=createCleanInitState({setup:{athlete_label:'Synthetic',split:{from:day,map:{0:'REST',1:'U',2:'REST',3:'REST',4:'REST',5:'REST',6:'REST'}},exercises:[{id:'press',n:'Press',mg:'chest',day:'U',sets:2,hi:8,inc:5,steps:[5,10]}],priority_muscles:[]}});
function page(model,food){const dom=new JSDOM(D.shellHtml().replace('<!-- APPROVED_TEMPLATES -->',D.templateHtml()),{url:'http://localhost/?screen=nutrition'});return {dom,api:A.mountToday(dom.window.document,model,{food})};}
for(const values of [{pro:150},{cal:1800,pro:150}]){
 const model=T.createTodayModel({today:day,basisState:basis,foodDays:{rows:()=>[{date:day,time:'12:00:00',offset:'-04:00',day:values}]}});
 assert.equal(model.foodUnavailable(day),true);assert.equal(model.loggedFood(day),null);assert.deepEqual(model.recordedFood(day).day,values);
 const p=page(model,{rows:()=>[{date:day,time:'12:00:00',offset:'-04:00',day:values}]});assert(p.dom.window.document.querySelector('[data-slot="food-recorded"]').textContent.includes('150 g protein'));p.dom.window.close();
}
console.log('D2 N1 R2: 8 clean-init/read-back observations pass.');
const fault=faultDatabase(),host=await createFoodHost({day,indexedDB:fault.indexedDB,crypto:webcrypto});
const food={rows:()=>[],async refresh(){throw Error('SYNTHETIC_READBACK_FAILURE')},async save(values){const result=await host.save(values);if(result.ok)await this.refresh();return result;}};
const p=page(T.createTodayModel({today:day}),food);const doc=p.dom.window.document;doc.querySelector('#food-cal').value='1800';doc.querySelector('[data-slot="food-save"]').dispatchEvent(new p.dom.window.Event('click'));
await assert.rejects(p.api.foodPending(),/SYNTHETIC_READBACK_FAILURE/);assert.equal((await host.all()).length,1);assert.equal(doc.querySelector('[data-slot="food-error"]').textContent,'');
console.log('D2 N1 R2: committed op + read-back failure rejects event promise and leaves no result; 3 observations confirmed.');host.close();p.dom.window.close();

```

Commands: node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/food.test.mjs (52/52); node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.* (1276/1276); node rebuild/m3/w7-preview/today/build.mjs (PASS); node rebuild/m3/w7-preview/today/food-check.mjs (Edge, 3 verified kills; TEMP/TMP inside own worktree).

P1-P12 mutation failed-test counts: 3,1,7,7,3,3,3,1,1,15,4,14. All originals restored in finally, tracked diff empty, food 52/52. Prior-round notes/repro remain in Git history. No forbidden history input was read.
