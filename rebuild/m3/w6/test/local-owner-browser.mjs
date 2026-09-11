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
 await page.locator('[data-slot="log"]').click();
 await page.waitForFunction(async()=>Object.values((await owner.hosts.generation()).generation.collections.ops).some(op=>op.kind==='session-set'));
 await page.locator('[data-slot="saved-facts"]').waitFor();
 await page.getByRole('button',{name:'Back to Today',exact:true}).click();
 await page.locator('[data-go="recovery"]').click();
 await page.locator('[data-group=energy]').filter({hasText:'Moderate'}).click();
 await page.locator('[data-slot="primary"]').click();
 await page.waitForFunction(async()=>Object.values((await owner.hosts.generation()).generation.collections.ops).some(op=>op.kind==='fact'));
 const evidence=await page.evaluate(async()=>{const rows=Object.values((await owner.hosts.generation()).generation.collections.ops);return {day:owner.model.today,kinds:rows.map(op=>op.kind),effective:rows.map(op=>op.effective),errors:owner.failures};});
 assert.equal(evidence.kinds.length,4);assert.equal(new Set(evidence.effective.map(e=>e.local_date)).size,1);assert.equal(evidence.errors.length,0);
 await page.reload();await page.evaluate(async()=>{window.owner=await (await import('/app.js')).boot();});
 assert.equal(await page.evaluate(()=>owner.workout.summary().phase),'active');
 assert.equal(await page.evaluate(()=>owner.checkin.summary().recorded),true);
 await page.goto(url+'/?mode=demo');await page.waitForFunction(()=>document.querySelector('#phone')?.textContent.includes('Demo · fictional athlete'));
 await page.goto(url);await page.waitForFunction(()=>document.querySelector('[data-slot="morning"]')?.textContent.includes('170.5'));
 const fits=await page.evaluate(()=>{const view=document.getElementById('phone').getBoundingClientRect(),primary=document.querySelector('[data-slot="primary"]').getBoundingClientRect();return primary.top>=view.top&&primary.bottom<=view.bottom;});
 assert.equal(fits,true,'primary action remains inside the approved phone viewport');
 await page.screenshot({path:path.join(scratch,'owner-reopened.png'),fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('OWNER ENTRY BROWSER PASS: real default boot; setup-required; public synthetic enrollment; UI weight/set/check-in saves; reload; original active session; demo isolation; no page errors.');
 await context.close();
} finally {await browser.close();await new Promise(r=>server.close(r));}
