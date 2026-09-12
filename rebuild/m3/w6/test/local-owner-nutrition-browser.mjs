import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { buildSite, ROOT } from '../../../slice/pwa/build-pwa.mjs';
import { buildToday } from '../../w7-preview/today/build.mjs';
const {chromium}=createRequire(new URL('../package.json',import.meta.url))('playwright-core');
const today=await buildToday();
for(const name of ['nutrition-input-model.mjs','nutrition-input-view.mjs'])assert(today.inputs.includes('rebuild/m3/w7-preview/today/'+name));
assert.deepEqual(today.styleInputs,['rebuild/m3/w7-preview/today/nutrition-input.css']);
const site=await buildSite(),out=path.join(ROOT,'.tmp/owner-nutrition-browser');await fs.mkdir(out,{recursive:true});
const cssName=[...site.files.keys()].find(x=>x.startsWith('styles.'));assert(site.files.get(cssName).toString().includes(await fs.readFile(path.join(ROOT,today.styleInputs[0]),'utf8')));
assert.equal(site.files.size,13);assert.equal(site.precache.length,11);
const service=http.createServer((req,res)=>{const name=req.url==='/'?'index.html':req.url.slice(1),body=site.files.get(name);if(!body||name==='_headers'){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.html')?'text/html':name.endsWith('.webmanifest')?'application/manifest+json':name.endsWith('.png')?'image/png':'image/svg+xml'});res.end(body);});
await new Promise(resolve=>service.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.W7_BROWSER_BIN,headless:true}),context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York',hasTouch:true}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function screen(name,width,large=false){await page.setViewportSize({width,height:844});await page.evaluate(large=>document.documentElement.style.fontSize=large?'200%':'',large);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document overflow '+name);assert(await page.locator('#phone').evaluate(el=>el.scrollWidth<=el.clientWidth),'phone overflow '+name);await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
const choose=(name,value)=>page.locator(`[name="${name}"]`).selectOption(value);
const fill=(name,value)=>page.locator(`[name="${name}"]`).fill(value);
const enter=async()=>{await page.locator('[data-go="nutrition-input"]').focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Your nutrition.',exact:true}).waitFor();};
try{
  await page.clock.install({time:new Date('2026-09-12T12:00:00Z')});await page.goto('http://127.0.0.1:'+service.address().port);
  await page.getByLabel('Your name',{exact:true}).fill('Synthetic owner nutrition');for(let i=0;i<7;i++)await page.locator(`[name="day-${i}"]`).selectOption('U');
  await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Add an exercise',exact:true}).click();await page.getByLabel('Exercise',{exact:true}).selectOption('press');
  for(const [name,value]of[['Sets per session','1'],['Rep ceiling','10'],['Load increase (lb)','2.5'],['Available loads (lb)','20, 22.5, 25']])await page.getByLabel(name,{exact:true}).fill(value);
  await page.getByLabel('This is my bilateral exercise.',{exact:false}).check();await page.getByRole('button',{name:'Add exercise',exact:true}).click();await page.getByLabel('These entries include my complete current routine',{exact:false}).check();await page.getByRole('button',{name:'Review routine',exact:true}).click();await page.getByRole('button',{name:'Save my routine',exact:true}).click();
  await page.locator('[data-go="nutrition"]').waitFor();await screen('today-390',390);assert((await page.locator('[data-go="nutrition-input"]').boundingBox()).height>=48);
  await page.locator('[data-go="nutrition"]').click();await enter();assert.equal(await page.locator('select').count(),2);
  await choose('goal.kind','declared');await fill('goal.statement','Build strength steadily.');await fill('goal.phase','My maintenance phase');await choose('existing_plan.kind','recorded');await fill('existing_plan.source','My written agreement');await fill('existing_plan.agreed_date','2026-09-12');
  for(const [key,kind,amount]of[['calories','target','2175'],['protein','minimum','135'],['carbohydrate','range'],['fat','not_prescribed']]){
    await page.locator(`[data-detail="${key}"] summary`).click();await choose(`existing_plan.fields.${key}.kind`,kind);
    if(amount)await fill(`existing_plan.fields.${key}.amount`,amount);
    if(kind==='range'){await fill(`existing_plan.fields.${key}.lower`,'190');await choose(`existing_plan.fields.${key}.lower_inclusive`,'true');await fill(`existing_plan.fields.${key}.upper`,'245');await choose(`existing_plan.fields.${key}.upper_inclusive`,'false');}
  }
  await screen('answers-390',390);await screen('answers-320',320);await screen('answers-320-large',320,true);
  assert(await page.locator('.nutrition-input input').evaluateAll(items=>items.every(x=>x.getBoundingClientRect().height>=48)));
  await page.evaluate(()=>document.documentElement.style.fontSize='');await page.getByRole('button',{name:'Review my answers',exact:true}).click();await page.getByRole('heading',{name:'Review your answers.',exact:true}).waitFor();assert.match(await page.locator('#phone').textContent(),/less than 245 g\/day/);await screen('review-320',320);
  await page.getByRole('button',{name:'Save my answers',exact:true}).tap();await page.getByRole('button',{name:'Change my answers',exact:true}).waitFor();await page.getByRole('button',{name:'Back to my plan',exact:true}).click();await page.getByText('Target: 2175 kcal/day',{exact:false}).waitFor();
  assert.equal(await page.locator('.macro-row').count(),4);assert.doesNotMatch(await page.locator('[data-slot="macros"]').textContent(),/2175|135|245/);await screen('recorded-390',390);await screen('recorded-320-large',320,true);
  await page.evaluate(()=>document.documentElement.style.fontSize='');await page.reload();await page.locator('[data-go="nutrition"]').click();await page.getByText('My written agreement',{exact:false}).waitFor();await enter();assert.equal(await page.locator('[name="goal.statement"]').inputValue(),'Build strength steadily.');await fill('goal.statement','Keep showing up.');
  await page.getByRole('button',{name:'Review my answers',exact:true}).click();await page.getByRole('button',{name:'Save my answers',exact:true}).click();await page.getByRole('button',{name:'Change my answers',exact:true}).waitFor();await page.keyboard.press('Escape');await page.getByText('Keep showing up.',{exact:false}).waitFor();assert(await page.locator('[data-go="nutrition-input"]').evaluate(el=>el===document.activeElement));
  await page.locator('[data-go="today"]').click();await page.getByRole('button',{name:'Log your weight',exact:false}).click();await page.getByLabel('Weight in pounds',{exact:true}).fill('170');await page.getByRole('button',{name:'Record this weight',exact:false}).click();await page.getByText(/Smoothed scale weight 170(?:\.0)? lb/).waitFor();await page.locator('[data-go="why"]').click();await page.getByText('Baseline: 170 lb',{exact:false}).waitFor();await page.locator('[data-go="today"]').first().click();
  await page.locator('[data-slot="primary"]').click();await page.locator('#phone input').first().waitFor();assert.match(await page.locator('#phone').textContent(),/Chest press/);
  assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'inventory.json'),JSON.stringify({files:site.sha256,inputs:today.inputs,styleInputs:today.styleInputs,browser:await browser.version()},null,2));
  console.log('OWNER NUTRITION PWA CHROME PASS: actual setup, recorded four-field answers, explicit review/save, Back/reload and goal-only edit, scale/Why/workout; 320/390/200% text overflow and 48px controls; keyboard focus, touch save; 13 files/11 precache; exact form CSS and model/view included; no page errors.');
}finally{await browser.close();await new Promise(resolve=>service.close(resolve));}
