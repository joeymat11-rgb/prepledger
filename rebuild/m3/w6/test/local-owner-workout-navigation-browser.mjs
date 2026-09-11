// Optional real Chromium journey. Synthetic setup only; no private data or services.
// Uses existing W7_BROWSER_BIN and dependencies; creates only ignored probe assets.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { completeVisibleOwnerSetup } from './visible-owner-setup.mjs';
import { buildToday, DIST } from '../../w7-preview/today/build.mjs';
const require=createRequire(import.meta.url),{chromium}=require('playwright-core');
// Playwright's waitForFunction must not be given an async predicate here.
// Await the repository observation itself, with a deadline on every poll and
// on the complete wait. Existing operations never satisfy a new-save fence.
async function waitForNewOperation(page, expected, timeoutMs = 5000) {
 const deadline=performance.now()+timeoutMs;let polls=0;
 const timeout=()=>Object.assign(new Error('Expected new '+expected.kind+' operation was not observed before the deadline'),
   {code:'OWNER_OPERATION_TIMEOUT',polls});
 while(performance.now()<deadline) {
  const remaining=deadline-performance.now();let timer;polls++;
  let row;
  try {
   row=await Promise.race([
    page.evaluate(async expected=>{
     const rows=Object.values((await owner.hosts.generation()).generation.collections.ops);
     return rows.find(op=>!expected.beforeIds.includes(op.op_id)&&op.kind===expected.kind
      && (expected.kind==='session-set'
       ? op.payload?.load?.value===40&&op.payload?.reps?.value===10
       : op.class==='event'&&op.payload?.profile==='earned/recovery-checkin/v1'&&op.payload?.answers?.energy==='Moderate'))||null;
    },expected),
    new Promise((_,reject)=>{timer=setTimeout(()=>reject(timeout()),remaining);}),
   ]);
  } finally {clearTimeout(timer);}
  if(row)return row;
  const left=deadline-performance.now();if(left<=0)break;
  await new Promise(resolve=>setTimeout(resolve,Math.min(25,left)));
 }
 throw timeout();
}
const operationIds=page=>page.evaluate(async()=>Object.keys((await owner.hosts.generation()).generation.collections.ops));
const root=fileURLToPath(new URL('../../../../',import.meta.url));
if(!process.env.W7_BROWSER_BIN) {console.log('OWNER ENTRY BROWSER NOT RUN: W7_BROWSER_BIN required');process.exit(0);}
const scratch=path.join(root,'.tmp/owner-browser');await fs.mkdir(scratch,{recursive:true});
await buildToday();
const assets=new Map();for(const name of ['index.html','app.js','styles.css'])assets.set('/'+name,await fs.readFile(path.join(DIST,name)));
assets.set('/',assets.get('/index.html'));
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0],body=assets.get(name);res.writeHead(body?200:404,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html','Cache-Control':'no-store'});res.end(body||'');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.W7_BROWSER_BIN,headless:true});
try {
 const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url);await completeVisibleOwnerSetup(page);
 await page.reload();await page.locator('[data-slot="date"]').filter({hasText:'Synthetic browser owner'}).waitFor();
 await page.evaluate(async()=>{window.owner=await(await import('/app.js')).boot();});
 assert.deepEqual(await operationIds(page),[]);
 // The existing primary still offers weight; canceling it must leave training reachable.
 await page.locator('[data-slot="primary"]').click();await page.getByRole('dialog').waitFor();
 await page.getByRole('button',{name:'Not now',exact:true}).click();
 assert.equal(await page.locator('.training button').filter({hasText:'Start UPPER'}).count(),1,
  'a visible training action must exist without submitting a weight');
 const action=page.getByRole('button',{name:'Start UPPER',exact:true});await action.waitFor();
 assert.equal(await page.locator('#phone button.primary').count(),1);
 const layout=await action.evaluate(el=>{const a=el.getBoundingClientRect(),p=document.getElementById('phone').getBoundingClientRect();return {inside:a.left>=p.left&&a.right<=p.right&&a.top>=p.top&&a.bottom<=p.bottom,visible:a.bottom<=innerHeight};});
 assert.deepEqual(layout,{inside:true,visible:true});
 await page.screenshot({path:path.join(scratch,'navigation-ready.png'),fullPage:true});
 await action.focus();await page.keyboard.press('Enter');
 await page.locator('#gym-weight').fill('40');await page.locator('#gym-reps').fill('10');
 await page.getByRole('button',{name:'2',exact:true}).click();
 const firstIds=await operationIds(page);await page.locator('[data-slot="log"]').click();
 const first=await waitForNewOperation(page,{kind:'session-set',beforeIds:firstIds});
 assert.equal(first.lift_lineage_id,'press');
 let rows=await page.evaluate(async()=>Object.values((await owner.hosts.generation()).generation.collections.ops));
 assert.equal(rows.length,2);assert.equal(rows.some(op=>op.class==='reading'),false);
 await page.locator('[data-slot="saved-facts"]').waitFor();
 await page.getByRole('button',{name:'Back to Today',exact:true}).click();
 assert.equal(await page.locator('[data-slot="workout-action"]').count(),0);
 assert.match(await page.locator('[data-slot="primary"]').innerText(),/^Resume UPPER/); await page.locator('[data-slot="primary"]').click();
 await page.getByRole('button',{name:/^Ready for set 2/}).click();
 await page.locator('#gym-weight').fill('40');await page.locator('#gym-reps').fill('10');
 await page.getByRole('button',{name:'2',exact:true}).click();
 const secondIds=await operationIds(page);await page.locator('[data-slot="log"]').click();
 const second=await waitForNewOperation(page,{kind:'session-set',beforeIds:secondIds});
 assert.equal(second.lift_lineage_id,'press');
 const unclosed=await page.evaluate(async()=> (await owner.hosts.generation()).generation.collections.ops);
 assert.equal(Object.keys(unclosed).length,3);
 assert.equal(Object.values(unclosed).some(op=>op.kind==='session-close'),false);
 await page.locator('[data-slot="saved-facts"]').waitFor();
 await page.getByRole('button',{name:'Back to Today',exact:true}).click();
 assert.match(await page.locator('[data-slot="primary"]').innerText(),/^Resume UPPER/);
 assert.equal(await page.getByRole('button',{name:/^Review today/}).count(),0);
 await page.reload();await page.evaluate(async()=>{window.owner=await(await import('/app.js')).boot();});
 assert.deepEqual(await page.evaluate(async()=> (await owner.hosts.generation()).generation.collections.ops),unclosed);
 assert.equal(await page.evaluate(()=>owner.workout.summary().phase),'saved');
 assert.match(await page.locator('[data-slot="primary"]').innerText(),/^Resume UPPER/);
 await page.locator('[data-slot="primary"]').click();
 await page.getByRole('button',{name:/^Finish this workout/}).click();
 await page.getByRole('button',{name:/^Review today/ }).waitFor();
 assert.equal(await page.locator('#phone button.primary').count(),1);
 assert.equal(await page.evaluate(()=>owner.model.read().hasReadToday),false);
 await page.getByRole('button',{name:/^Review today/ }).click();
 await page.getByRole('button',{name:'Today',exact:true}).click();
 await page.locator('[data-slot="primary"]').click();await page.getByRole('dialog').locator('input').fill('170.5');
 await page.getByRole('dialog').locator('button[type="submit"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-slot="morning"]')?.textContent.includes('170.5'));
 await page.reload();await page.evaluate(async()=>{window.owner=await(await import('/app.js')).boot();});
 const saved=await page.evaluate(async()=> (await owner.hosts.generation()).generation.collections.ops);
 assert.equal(Object.keys(saved).length,5);assert.deepEqual(saved[first.op_id],first);assert.deepEqual(saved[second.op_id],second);
 assert.equal(Object.values(saved).filter(op=>op.kind==='session-start').length,1);
 assert.equal(Object.values(saved).filter(op=>op.kind==='session-set').length,2);
 assert.equal(Object.values(saved).filter(op=>op.kind==='session-close').length,1);
 assert.equal(Object.values(saved).filter(op=>op.class==='reading').length,1);assert.equal(await page.evaluate(()=>owner.workout.summary().phase),'finished');
 assert.deepEqual(errors,[]);await context.close();
 console.log('OWNER WORKOUT NAVIGATION BROWSER PASS: visible setup; keyboard training without weight; exact sets before any reading; all-sets-unclosed reload/Resume; explicit Finish/review; later real weight; reload.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
