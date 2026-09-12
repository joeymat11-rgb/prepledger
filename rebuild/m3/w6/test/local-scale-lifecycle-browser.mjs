import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { buildToday, ROOT, DIST } from '../../w7-preview/today/build.mjs';
import { buildBrowser } from '../build-browser.mjs';
const {chromium}=createRequire(new URL('../package.json',import.meta.url))('playwright-core');
await buildToday();
const out=path.join(ROOT,'.tmp/scale-lifecycle');await fs.mkdir(out,{recursive:true});
// A second real installation handle writes the conflicting reading. It does not
// access the DOM/model, forge a projection or replace the page's refresh result.
const probe=path.join(out,'probe.mjs');
await fs.writeFile(probe,`import {openTodayInstallation} from ${JSON.stringify(path.join(ROOT,'rebuild/m3/w6/local/today-bindings.mjs').replaceAll('\\','/'))};
import {createLocalCalendar} from ${JSON.stringify(path.join(ROOT,'rebuild/m3/w6/local/calendar.mjs').replaceAll('\\','/'))};
globalThis.writeScaleConflict=async()=>{const era=await openTodayInstallation({enroll:false,calendar:createLocalCalendar()});const host=await era.createReadingHost({day:'2026-09-11'});try{return await host.weighIn({date:'2026-09-11',lb:180});}finally{host.close();era.close();}};`);
await buildBrowser({entryPoints:[probe],outfile:path.join(out,'probe.js')});
const files={'/':['index.html','text/html'],'/styles.css':['styles.css','text/css'],'/app.js':['app.js','text/javascript']};
const service=http.createServer(async(req,res)=>{const entry=files[req.url];if(!entry&&req.url!=='/probe.js'){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':entry?.[1]||'text/javascript'});res.end(await fs.readFile(entry?path.join(DIST,entry[0]):path.join(out,'probe.js')));});
await new Promise(resolve=>service.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.W7_BROWSER_BIN,headless:true}),context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
  await page.clock.install({time:new Date('2026-09-11T12:00:00Z')});const url='http://127.0.0.1:'+service.address().port;await page.goto(url);
  await page.getByLabel('Your name',{exact:true}).fill('Synthetic lifecycle owner');for(let i=0;i<7;i++)await page.locator(`[name="day-${i}"]`).selectOption('U');
  await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Add an exercise',exact:true}).click();await page.getByLabel('Exercise',{exact:true}).selectOption('press');
  for(const [name,value] of [['Sets per session','1'],['Rep ceiling','10'],['Load increase (lb)','2.5'],['Available loads (lb)','20, 22.5, 25']])await page.getByLabel(name,{exact:true}).fill(value);
  await page.getByLabel('This is my bilateral exercise.',{exact:false}).check();await page.getByRole('button',{name:'Add exercise',exact:true}).click();await page.getByLabel('These entries include my complete current routine',{exact:false}).check();await page.getByRole('button',{name:'Review routine',exact:true}).click();await page.getByRole('button',{name:'Save my routine',exact:true}).click();
  await page.getByRole('button',{name:'Log your weight',exact:false}).click();await page.getByLabel('Weight in pounds',{exact:true}).fill('170');await page.getByRole('button',{name:'Record this weight',exact:false}).click();await page.getByText(/Smoothed scale weight 170(?:\.0)? lb/).waitFor();
  await page.locator('[data-go="why"]').focus();await page.keyboard.press('Enter');await page.getByText('Baseline: 170 lb',{exact:false}).waitFor();await page.screenshot({path:path.join(out,'before-why-390.png'),fullPage:true});
  await page.addScriptTag({url:url+'/probe.js',type:'module'});assert.equal((await page.evaluate(()=>writeScaleConflict())).ok,true);
  // The actual page foreground lifecycle runs its owned refresh callback.
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.waitForFunction(()=>document.getElementById('phone').textContent.includes('0 eligible readings')&&!document.getElementById('phone').textContent.includes('Baseline: 170 lb'));
  assert.match(await page.locator('#phone').textContent(),/Why this plan/);assert.doesNotMatch(await page.locator('#phone').textContent(),/Baseline: 170 lb|1 eligible readings/);
  for(const width of [390,320]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await page.locator('#phone').evaluate(el=>el.scrollWidth<=el.clientWidth));await page.screenshot({path:path.join(out,`after-why-${width}.png`),fullPage:true});}
  await page.locator('[data-go="today"]').first().focus();await page.keyboard.press('Enter');assert.doesNotMatch(await page.locator('#phone').textContent(),/Smoothed scale weight 170/);
  await page.reload();await page.getByText(/Some readings excluded/).waitFor();await page.locator('[data-go="why"]').click();await page.getByText('0 eligible readings',{exact:false}).waitFor();assert.deepEqual(errors,[]);
  console.log('SCALE LIFECYCLE CHROME PASS: actual owner bundle, shared conflicting write while Why open, foreground refresh withdraws170/count1; Back/reload correct;320/390 overflow checks; no page errors.');
}finally{await browser.close();await new Promise(resolve=>service.close(resolve));}
