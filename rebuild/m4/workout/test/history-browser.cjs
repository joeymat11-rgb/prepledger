'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createRequire}=require('node:module');
if(!process.argv[2]||!process.argv[3]||!process.argv[4])throw Error('Pass synthetic output directory, installed W6 package directory, and Chromium executable');
const outputDirectory=path.resolve(process.argv[2]);
const req=createRequire(path.join(path.resolve(process.argv[3]),'package.json'));
const {chromium}=req('playwright-core');
(async()=>{
  const executablePath=path.resolve(process.argv[4]);
  const browser=await chromium.launch({executablePath,headless:true});
  const checks=[];
  try{
    const page=await browser.newPage();await page.route('**/*',route=>route.abort());
    const html=fs.readFileSync(path.join(outputDirectory,'preview.html'),'utf8');
    for(const width of [390,320]){
      await page.setViewportSize({width,height:844});await page.setContent(html);
      const count=await page.locator('summary').count();assert(count>0);
      // Native summary controls must work by keyboard, without custom scripts.
      const first=page.locator('summary').first();await first.focus();await page.keyboard.press('Enter');
      assert.equal(await first.evaluate(el=>el.parentElement.open),true);
      const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
        summaryMin:Math.min(...[...document.querySelectorAll('summary')].map(e=>e.getBoundingClientRect().height)),
        images:document.images.length,scripts:document.scripts.length}));
      assert(metrics.scroll<=width);assert(metrics.summaryMin>=44);assert.equal(metrics.images,0);assert.equal(metrics.scripts,0);
      checks.push({name:`${width}px layout and keyboard detail`,status:'PASS',metrics});
      await page.evaluate(()=>{document.documentElement.style.fontSize='200%';document.querySelectorAll('details').forEach(e=>e.open=true);});
      const zoom=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      if(zoom.scroll>width)console.log(JSON.stringify({zoom,overflow:await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>({tag:e.tagName,text:e.textContent.slice(0,60),right:e.getBoundingClientRect().right,scroll:e.scrollWidth,width:e.clientWidth})))},null,2));
      assert(zoom.scroll<=width);checks.push({name:`${width}px text200 with all details open`,status:'PASS',metrics:zoom});
      if(width===390){await page.setContent(html);await page.screenshot({path:path.join(outputDirectory,'history-390.png'),fullPage:true});}
    }
    fs.writeFileSync(path.join(outputDirectory,'browser-result.json'),JSON.stringify({browser:browser.version(),scope:'Desktop Chromium at narrow viewports, static synthetic rendered cases; not iOS/VoiceOver/phone/storage qualification',checks},null,2)+'\n');
    console.log(`HISTORY BROWSER: ${checks.length}/${checks.length} PASS; Chromium only, physical iPhone pending`);
  }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
