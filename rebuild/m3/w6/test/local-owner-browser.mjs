// Optional real Chromium journey. Synthetic setup only; no private data or services.
// Uses existing W7_BROWSER_BIN and dependencies; creates only ignored probe assets.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildBrowser } from '../build-browser.mjs';
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
const source=path.join(scratch,'enroll.mjs'),bundle=path.join(scratch,'enroll.js');
await fs.writeFile(source,`import {openTodayInstallation} from '../../rebuild/m3/w6/local/today-bindings.mjs';
import {createLocalCalendar} from '../../rebuild/m3/w6/local/calendar.mjs';
export async function enroll(){const calendar=createLocalCalendar();const era=await openTodayInstallation({calendar,
 initialSetup:{athlete_label:'Synthetic browser owner',split:{from:'2026-01-01',map:{0:'U',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'}},
 exercises:[{id:'synthetic-press',n:'Synthetic press',mg:'chest',day:'U',sets:2,hi:10,inc:2.5,steps:[20,22.5,25,30,40]}],priority_muscles:[]}});era.close();}`);
await buildToday();await buildBrowser({entryPoints:[source],outfile:bundle});
const assets=new Map();for(const name of ['index.html','app.js','styles.css'])assets.set('/'+name,await fs.readFile(path.join(DIST,name)));
assets.set('/',assets.get('/index.html'));assets.set('/enroll.js',await fs.readFile(bundle));
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0],body=assets.get(name);res.writeHead(body?200:404,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html','Cache-Control':'no-store'});res.end(body||'');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:process.env.W7_BROWSER_BIN,headless:true});
try {
 const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.getByRole('heading',{name:'Setup required',exact:true}).waitFor();
 assert.equal(await page.locator('#phone input').count(),0);
 await page.evaluate(async()=>{await (await import('/enroll.js')).enroll();});
 await page.reload();await page.locator('[data-slot="date"]').filter({hasText:'Synthetic browser owner'}).waitFor();
 await page.evaluate(async()=>{window.owner=await (await import('/app.js')).boot();});
 await page.locator('[data-slot="primary"]').click();
 await page.getByRole('dialog').locator('input').fill('170.5');
 await page.getByRole('dialog').locator('button[type="submit"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-slot="morning"]')?.textContent.includes('170.5'));
 await page.reload();await page.waitForFunction(()=>document.querySelector('[data-slot="morning"]')?.textContent.includes('170.5'));
 await page.evaluate(async()=>{window.owner=await (await import('/app.js')).boot();});
 await page.locator('[data-slot="primary"]').click();
 await page.locator('#gym-weight').fill('40');await page.locator('#gym-reps').fill('10');
 await page.getByRole('button',{name:'2',exact:true}).click();
 const beforeSetIds=await operationIds(page);
 await page.locator('[data-slot="log"]').click();
 const savedSet=await waitForNewOperation(page,{kind:'session-set',beforeIds:beforeSetIds});
 assert.ok(!beforeSetIds.includes(savedSet.op_id));
 await page.locator('[data-slot="saved-facts"]').waitFor();
 await page.getByRole('button',{name:'Back to Today',exact:true}).click();
 const beforeRecoveryIds=await operationIds(page);
 // The weight fact already exists. With no recovery action yet, the actual
 // expected Moderate recovery operation must time out rather than advance.
 await assert.rejects(waitForNewOperation(page,{kind:'fact',beforeIds:beforeRecoveryIds},150),
  error=>error.code==='OWNER_OPERATION_TIMEOUT'&&error.polls>=2);
 console.log('OWNER OPERATION TIMEOUT CONTROL PASS: absent new Moderate recovery cannot be satisfied by the existing weight/set.');
 await page.locator('[data-go="recovery"]').click();
 await page.locator('[data-group=energy]').filter({hasText:'Moderate'}).click();
 await page.locator('[data-slot="primary"]').click();
 const savedRecovery=await waitForNewOperation(page,{kind:'fact',beforeIds:beforeRecoveryIds});
 assert.ok(!beforeRecoveryIds.includes(savedRecovery.op_id));assert.notEqual(savedRecovery.op_id,savedSet.op_id);
 const evidence=await page.evaluate(async()=>{const rows=Object.values((await owner.hosts.generation()).generation.collections.ops);return {day:owner.model.today,kinds:rows.map(op=>op.kind),effective:rows.map(op=>op.effective),errors:owner.failures};});
 assert.equal(evidence.kinds.length,4);assert.equal(new Set(evidence.effective.map(e=>e.local_date)).size,1);assert.equal(evidence.errors.length,0);
 await page.reload();await page.evaluate(async()=>{window.owner=await (await import('/app.js')).boot();});
 assert.equal(await page.evaluate(()=>owner.workout.summary().phase),'active');
 assert.equal(await page.evaluate(()=>owner.checkin.summary().recorded),true);
 const reopened=await page.evaluate(async()=> (await owner.hosts.generation()).generation.collections.ops);
 assert.equal(Object.keys(reopened).length,4);
 assert.deepEqual(reopened[savedSet.op_id],savedSet);assert.deepEqual(reopened[savedRecovery.op_id],savedRecovery);
 await page.goto(url+'/?mode=demo');await page.waitForFunction(()=>document.querySelector('#phone')?.textContent.includes('Demo · fictional athlete'));
 await page.goto(url);await page.waitForFunction(()=>document.querySelector('[data-slot="morning"]')?.textContent.includes('170.5'));
 const fits=await page.evaluate(()=>{const view=document.getElementById('phone').getBoundingClientRect(),primary=document.querySelector('[data-slot="primary"]').getBoundingClientRect();return primary.top>=view.top&&primary.bottom<=view.bottom;});
 assert.equal(fits,true,'primary action remains inside the approved phone viewport');
 await page.screenshot({path:path.join(scratch,'owner-reopened.png'),fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('OWNER ENTRY BROWSER PASS: real default boot; setup-required; public synthetic enrollment; UI weight/set/check-in saves; reload; original active session; demo isolation; no page errors.');
 await context.close();
} finally {await browser.close();await new Promise(r=>server.close(r));}
