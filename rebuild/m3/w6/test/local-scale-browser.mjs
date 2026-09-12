import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildToday, ROOT } from '../../w7-preview/today/build.mjs';
import { startServer } from '../../w7-preview/today/serve.mjs';
const { chromium }=createRequire(new URL('../package.json',import.meta.url))('playwright-core');
await buildToday();
const service=await startServer({port:0});
const browser=await chromium.launch({executablePath:process.env.W7_BROWSER_BIN,headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const shots=path.join(ROOT,'.tmp/scale-today-screens');await fs.mkdir(shots,{recursive:true});
try {
  await page.clock.install({time:new Date('2026-09-11T12:00:00Z')});
  await page.goto('http://127.0.0.1:'+service.address().port);
  await page.getByLabel('Your name',{exact:true}).fill('Synthetic scale owner');
  for(let i=0;i<7;i++)await page.locator('[name="day-'+i+'"]').selectOption('U');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.getByRole('button',{name:'Add an exercise',exact:true}).click();
  await page.getByLabel('Exercise',{exact:true}).selectOption('press');
  await page.getByLabel('Sets per session',{exact:true}).fill('1');
  await page.getByLabel('Rep ceiling',{exact:true}).fill('10');
  await page.getByLabel('Load increase (lb)',{exact:true}).fill('2.5');
  await page.getByLabel('Available loads (lb)',{exact:true}).fill('20, 22.5, 25');
  await page.getByLabel('This is my bilateral exercise.',{exact:false}).check();
  await page.getByRole('button',{name:'Add exercise',exact:true}).click();
  await page.getByLabel('These entries include my complete current routine',{exact:false}).check();
  await page.getByRole('button',{name:'Review routine',exact:true}).click();
  await page.getByRole('button',{name:'Save my routine',exact:true}).click();
  await page.getByRole('button',{name:'Log your weight',exact:false}).click();
  await page.getByLabel('Weight in pounds',{exact:true}).fill('170');
  await page.getByRole('button',{name:'Record this weight',exact:false}).click();
  await page.getByText(/Smoothed scale weight 170(?:\.0)? lb/).waitFor();
  for(const width of [390,320]) {
    await page.setViewportSize({width,height:844});
    console.log('Layout',width,await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,phone:document.getElementById('phone').getBoundingClientRect().width})));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert(await page.locator('#phone').evaluate(root=>root.scrollWidth<=root.clientWidth));
    await page.screenshot({path:path.join(shots,'today-'+width+'.png'),fullPage:true});
    // Reach the optional evidence by keyboard and activate it without pointer input.
    await page.locator('[data-go="why"]').focus();
    assert.equal(await page.locator(':focus').getAttribute('data-go'),'why');
    await page.keyboard.press('Enter');
    await page.getByText('Baseline: 170 lb',{exact:false}).waitFor();
    assert.match(await page.locator('#phone').textContent(),/not server-accepted/);
    assert(await page.locator('#phone').evaluate(root=>root.scrollWidth<=root.clientWidth));
    await page.screenshot({path:path.join(shots,'why-'+width+'.png'),fullPage:true});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('[data-go="today"]').first().click();
  }
  await page.reload();await page.getByText(/Smoothed scale weight 170(?:\.0)? lb/).waitFor();
  assert.deepEqual(errors,[]);
  console.log('SCALE TODAY CHROME PASS: actual setup/save/Today/Why/reload; 390 and 320 widths; keyboard evidence access; no page errors.');
} catch(error) {console.log(await page.locator('#phone').textContent());throw error;}
finally {await browser.close();await new Promise(resolve=>service.close(resolve));}
