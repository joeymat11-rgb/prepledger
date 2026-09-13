import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {startServer} from '../rebuild/m3/w7-preview/today/serve.mjs';
const root=process.cwd(),require=createRequire(path.join(root,'rebuild/m3/w6/package.json'));
const {chromium}=require('playwright-core');
const executablePath=process.env.W7_BROWSER_BIN;
assert(executablePath,'An actual Edge binary is required, never a skipped PASS');
const scratch=fs.mkdtempSync(path.join(root,'.tmp/d2-r3-browser-'));
const server=await startServer({port:0});
const url=`http://127.0.0.1:${server.address().port}/`;
const build=JSON.parse(fs.readFileSync('.tmp/d2-combined-build.json'));
const served=[];
for(const asset of build.assetHashes){const r=await fetch(url+asset.name);assert.equal(r.status,200);const bytes=Buffer.from(await r.arrayBuffer());const sha256=createHash('sha256').update(bytes).digest('hex');assert.equal(sha256,asset.sha256);served.push({name:asset.name,bytes:bytes.length,sha256});}
const problems=[],cases=[],killProof=[];let context=null;
const configurations=[
  {name:'unknown previous2/current8',target:'absent',form:'short',hours:2,warning:true,journey:true},
  {name:'unknown three6.6',target:'absent',form:'triple',hours:6.6,warning:true},
  {name:'null target previous2/current8',target:null,form:'short',hours:2,warning:true},
  {name:'string target three6.6',target:'8',form:'triple',hours:6.6,warning:true},
  {name:'finite target8',target:8,form:'short',hours:2,cost:20,score:80},
  {name:'finite target9',target:9,form:'short',hours:2,cost:30,score:70},
  {name:'genuine zero',target:'absent',form:'current',hours:0,warning:true},
  {name:'healthy8 unknown target',target:'absent',form:'current',hours:8,warning:false},
  {name:'missing hours in dated basis',target:8,form:'missing',warning:false},
  {name:'invalid null hours in dated basis',target:8,form:'null',warning:false},
];
async function open(profile,configuration,width=390) {
  context=await chromium.launchPersistentContext(profile,{executablePath,headless:true,viewport:{width,height:844}});
  const page=context.pages()[0]||await context.newPage();
  page.on('pageerror',e=>problems.push('pageerror '+e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))problems.push('console '+m.text());});
  page.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('data:'))problems.push('offsite '+r.url());});
  await page.goto(url,{waitUntil:'load'});
  await page.waitForSelector('#phone [data-slot="instruction"]');
  await bind(page,configuration);
  return page;
}
async function bind(page,configuration) {
  await page.evaluate(async config=>{
    const entry=await import('/app.js'),day='2030-02-04';
    const basis=entry.createTodayModel({today:day}).basisState();
    basis.reads.push({d:day,w:180,note:'D2 invented satisfied morning read',sealed:false});
    basis.dailyLogs[day]={cal:2300,pro:170,steps:8500};
    basis.sleep.nights=[{d:'2030-02-01',h:8},{d:'2030-02-02',h:8},{d:'2030-02-03'}];
    if(config.form==='short')basis.sleep.nights.push({d:day,h:8});
    if(config.form==='null')basis.sleep.nights[2].h=null;
    if(config.target==='absent')delete basis.sleep.cleanH;else basis.sleep.cleanH=config.target;
    // The built entry's existing keyed synthetic input: exact caller day, fresh
    // owned installation, no setup/import, no factory/clock replacement.
    const opened=await entry.boot({document,today:day,basisState:basis});
    await opened.api.sleepReady();await opened.api.foodReady();await opened.api.checkInKitReady();await opened.api.workoutRebound();
    if(opened.failures.length)throw new Error('BOOT_FAILURE '+opened.failures.join(';'));
    window.__d2=opened;
  },configuration);
}
async function collection(page) {
  return page.evaluate(async()=>{
    const {ops,outbox}=(await window.__d2.api.sleepLane().host.repository.load()).generation.collections;
    return {ops,outbox};
  });
}
function preserved(before,after,delta) {
  for(const name of ['ops','outbox']) {
    assert.equal(Object.keys(after[name]).length,Object.keys(before[name]).length+delta,name+' exact addition');
    for(const [id,row] of Object.entries(before[name]))assert.deepEqual(after[name][id],row,'preserve original '+name);
  }
}
async function inspect(page,config) {
  await page.evaluate(async()=>{await window.__d2.api.render('today');await window.__d2.api.workoutRebound();});
  const data=await page.evaluate(()=>{
    const {model,api}=window.__d2,state=model.stateFromOps(),E=model.engine;
    return {owed:E.nowFocus(state).owed,steps:E.fiveLevers(state).steps.state,recovery:E.recoveryIndex(state),fix:E.theOneFix(state),move:E.nowModel(state).move,record:model.recordedSleep('2030-02-03'),
      instruction:document.querySelector('#phone [data-slot="instruction"]').textContent,phone:document.getElementById('phone').textContent,
      phase:api.workoutEntry().summary().phase,sleep:state.sleep};
  });
  assert.deepEqual(data.owed,[]);assert.notEqual(data.steps,'caution');assert.equal(data.phase,'ready');
  assert.equal(data.instruction,data.move.title);assert.doesNotMatch(data.phone,/NaN|undefined/);
  const sleep=data.recovery.flags.find(f=>f.k==='sleep');
  if(config.cost!==undefined){assert.equal(sleep.cost,config.cost);assert.equal(data.recovery.score,config.score);assert.equal(data.fix.rung,'sleep');}
  else {
    assert.equal(Boolean(sleep),config.warning);assert.equal(data.fix.lever,null);
    assert.doesNotMatch(data.phone,/nothing needs you|nothing to fix|the five are covered|sleep are all covered/i);
    if(config.warning){assert.equal(sleep.cost,null);assert.equal(data.recovery.score,null);assert.equal(data.recovery.lever,null);}
  }
  await page.click('#phone [data-go="why"]');
  await page.waitForSelector('#phone [data-slot="why-lead"]');
  data.why=await page.textContent('#phone [data-slot="why-lead"]');
  if(config.warning){assert.ok(data.why.includes(sleep.receipt));assert.ok(data.why.includes(sleep.fix));}
  const box=await page.evaluate(()=>{const p=document.getElementById('phone');return{client:p.clientWidth,scroll:p.scrollWidth};});
  assert(box.scroll<=box.client+1,'Changed explanation has horizontal overflow');
  data.viewport=page.viewportSize();data.width=box;
  return data;
}
async function returnToday(page){await page.click('#phone [data-go="today"]');await page.waitForSelector('#phone [data-slot="instruction"]');}
function processes(profile) {
  const script="Get-CimInstance Win32_Process -Filter \"Name='msedge.exe'\" | Where-Object { $_.CommandLine -like '*"+profile.replaceAll("'","''")+"*' } | Select-Object -ExpandProperty ProcessId";
  return execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{cwd:root,encoding:'utf8',timeout:30000}).split(/\r?\n/).map(v=>Number(v.trim())).filter(n=>Number.isSafeInteger(n)&&n>0);
}
async function kill(profile) {
  assert(path.resolve(profile).startsWith(scratch+path.sep),'Only this review profile');
  const pids=processes(profile);assert(pids.length>0,'Actual owned Edge process required');
  for(const pid of pids)execFileSync('taskkill.exe',['/F','/T','/PID',String(pid)],{cwd:root,stdio:'ignore',timeout:30000});
  assert.deepEqual(processes(profile),[],'Profile process must be gone');
  try{await context.close();}catch{}context=null;killProof.push({profile:path.relative(root,profile),pids,remaining:0});
}
try {
  for(const [index,config] of configurations.entries()) {
    const profile=path.join(scratch,'case-'+index);let page=await open(profile,config,index%2?320:390);
    const empty=await collection(page);
    const saved=await page.evaluate(async config=>{
      const host=window.__d2.api.sleepLane().host,results=[];
      const dates=config.hours===undefined?[]:config.form==='triple'?['2030-02-01','2030-02-02','2030-02-03']:['2030-02-03'];
      for(const date of dates)results.push(await host.save({date,hours:config.hours},{supersedes:null}));
      return results;
    },config);
    assert(saved.every(r=>r.ok));const seeded=await collection(page);preserved(empty,seeded,saved.length);
    await page.reload({waitUntil:'load'});await page.waitForSelector('#phone [data-slot="instruction"]');await bind(page,config);
    const observed=await inspect(page,config);assert.deepEqual(await collection(page),seeded,'Preparing and reading never starts or writes');
    if(config.hours!==undefined){assert.equal(observed.record.night.hours,config.hours);assert.equal(observed.record.savedDate,'2030-02-04');}
    await returnToday(page);await page.click('#phone [data-go="sleep"]');
    await page.waitForSelector('#phone [data-slot="sleep-entry-form"]:not([hidden])');
    observed.sleepText=await page.textContent('#phone [data-slot="sleep-recorded"]');
    if(config.hours!==undefined){assert.ok(observed.sleepText.includes(config.hours+' h'));assert.match(observed.sleepText,/Entered as an approximate duration/);}
    else assert.doesNotMatch(observed.sleepText,/\b0 h\b/);
    assert.deepEqual(await collection(page),seeded,'Sleep opening is read-only');
    if(config.journey) {
      await page.click('#phone [data-slot="sleep-change"]');
      await page.fill('#sleep-bed','22:00');await page.fill('#sleep-wake','02:00');
      const metrics=await page.evaluate(()=>[...document.querySelectorAll('#phone [data-slot="sleep-entry-form"] input')].filter(e=>e.getBoundingClientRect().height>0).map(e=>({id:e.id,height:e.getBoundingClientRect().height,font:parseFloat(getComputedStyle(e).fontSize)})));
      assert(metrics.length>0);for(const m of metrics){assert(m.height>=48);assert(m.font>=16);}observed.inputMetrics=metrics;
      await page.click('#phone [data-slot="sleep-save"]');
      await page.waitForFunction(()=>document.querySelector('#phone [data-slot="sleep-recorded"]')?.textContent.includes('4 h'));
      await page.evaluate(async()=>{await window.__d2.api.sleepPending();await window.__d2.api.workoutRebound();});
      const clockSaved=await collection(page);preserved(seeded,clockSaved,1);
      assert.match(await page.textContent('#phone [data-slot="sleep-recorded"]'),/From bed and wake times/);
      await page.click('#phone [data-slot="sleep-change"]');await page.click('#phone [data-action="sleep-mode-hours"]');await page.fill('#sleep-hours','0');await page.click('#phone [data-slot="sleep-save"]');
      await page.waitForFunction(()=>document.querySelector('#phone [data-slot="sleep-recorded"]')?.textContent.includes('0 h'));
      await page.evaluate(async()=>{await window.__d2.api.sleepPending();await window.__d2.api.workoutRebound();});
      const zeroSaved=await collection(page);preserved(clockSaved,zeroSaved,1);
      await returnToday(page);await page.click('#phone [data-go="recovery"]');await page.waitForSelector('#phone [data-slot="sleep-known"]');
      observed.recoveryText=await page.textContent('#phone [data-slot="sleep-known"]');assert.match(observed.recoveryText,/0/);assert.match(observed.recoveryText,/2030-02-03/);
      assert.deepEqual(await collection(page),zeroSaved,'Opening recovery does not confirm or write');
      await returnToday(page);await page.click('#phone [data-slot="primary"]');
      await page.waitForSelector('#phone #gym-weight',{state:'attached',timeout:20000});
      const actual=await page.evaluate(async()=>{
        const w=window.__d2.api.workoutEntry(),r=await w.gym.read();
        return{phase:r.phase,gymSleep:w.gymHost.host.lastProjection().accepted_state.sleep,modelSleep:window.__d2.model.stateFromOps().sleep};
      });
      assert.equal(actual.phase,'active');assert.deepEqual(actual.gymSleep,actual.modelSleep);
      const started=await collection(page);preserved(zeroSaved,started,1);
      assert.equal(Object.entries(started.ops).find(([id])=>!Object.hasOwn(zeroSaved.ops,id))[1].kind,'session-start');
      await kill(profile);page=await open(profile,config);
      assert.deepEqual(await collection(page),started,'A real process-kill reopen preserves every operation/outbox');
      const reopened=await page.evaluate(()=>({phase:window.__d2.api.workoutEntry().summary().phase,record:window.__d2.model.recordedSleep('2030-02-03')}));
      assert.equal(reopened.phase,'active');assert.equal(reopened.record.night.hours,0);assert.equal(Object.hasOwn(reopened.record.night,'bed'),false);
      observed.journey={realClockCorrection:true,realZeroCorrection:true,actualStart:true,exactKillReopen:true,opCounts:[empty,seeded,clockSaved,zeroSaved,started].map(c=>Object.keys(c.ops).length),reopened};
      await page.screenshot({path:path.join(scratch,'reopened.png'),fullPage:true});
    }
    cases.push({name:config.name,...observed});
    console.log('PASS '+config.name);
    await context.close();context=null;
  }
  assert.deepEqual(problems,[]);
  console.log('D2 R3 BROWSER PASS '+cases.length+' cases; '+killProof.length+' verified process kill');
} finally {
  if(context)await context.close();await new Promise(resolve=>server.close(resolve));
  const hashes=build.assetHashes.map(a=>({...a,actualSHA256:createHash('sha256').update(fs.readFileSync(path.join(root,'.tmp/w7-today-dist',a.name))).digest('hex')}));
  for(const a of hashes)assert.equal(a.sha256,a.actualSHA256,'Served asset exact');
  fs.writeFileSync('.tmp/d2-r3-browser-evidence.json',JSON.stringify({buildTag:build.buildTag,assets:hashes,served,profileRoot:path.relative(root,scratch),edge:executablePath,playwright:require('playwright-core/package.json').version,cases,killProof,problems,limits:'Ten affected browser cases; one post-save/post-Start process kill. Prior seven boundary kills remain historical at c4716ed; no new precommit/preack kills, physical phone or full CI.'},null,2)+'\n');
}
