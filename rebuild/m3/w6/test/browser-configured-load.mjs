// Focused configured-load UI proof. Two actual bundles built by the UNCHANGED
// build-browser.mjs guard: the retained W6 tree (numeric-only wire) and a fresh
// scratch composition that pins the accepted a53ff1a entered-load candidate as
// an explicit UI-test dependency. Nothing here adopts that schema into the
// retained runtime; the retained bundle must still refuse a configured save.
// Synthetic unissued lease, synthetic producer/guard and fixed clock, as in the
// existing panel proofs. Not phone, recovery, science or full-app qualification.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,existsSync,mkdirSync,mkdtempSync,cpSync,copyFileSync,symlinkSync} from 'node:fs';
import {join,resolve,dirname,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {buildBrowser} from '../build-browser.mjs';
import {O,initial,config} from './support.mjs';
import {compareConfiguredGraphs} from './configured-load-graph.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..'),source=resolve(here,'../../..');
const Sign=require('../../w5/crypto.cjs'),{chromium}=require('playwright-core');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),fileSha=path=>sha(readFileSync(path));
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('CONFIGURED LOAD BROWSER BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const candidateDir=process.env.W6_CONFIGURED_LOAD_CANDIDATE;
if(!candidateDir||!existsSync(join(candidateDir,'spec/configured-load-candidate/entered-load.cjs'))){console.log('CONFIGURED LOAD BROWSER BLOCKED — W6_CONFIGURED_LOAD_CANDIDATE must point at the pinned m4-configured-candidate/rebuild/m4 directory');process.exit(2);}
const artifacts=process.env.W6_UI_ARTIFACT_DIR?join(resolve(process.env.W6_UI_ARTIFACT_DIR),'configured-load'):join(here,'.tmp/configured-load');mkdirSync(artifacts,{recursive:true});

// ---- 1. retained bundle (numeric-only wire), unchanged harness -----------
const retained=await buildBrowser({outfile:join(artifacts,'retained.js'),entryPoints:[join(here,'browser-entry.mjs')]});

// ---- 2. exact candidate composition into fresh scratch, as a pinned UI-test dependency
// Mirrors configured-load-candidate/run.cjs: verify five preimage pins, apply the
// two exact unique edits, add entered-load.cjs. Retained sources are untouched.
const PREIMAGE={'schema.cjs':'9d18cce9434118fd33364c2bc6842923707685328fa62d115b90c63460923458',
 'edit-values.cjs':'bc3e760bb1870a3a30f7f7e15d427faea00ef31b9d4256050ac30161b3ec1546',
 'edit-history.cjs':'3e5dd5053ddbcc2491cc604da35e42fde625c6c0b94d409431c3bba65042d3e2',
 'context-values.cjs':'8cd6fe62aaf0ab1f11ecd7a35564f057b3b6c5a5e4facd5404f8f7b63caf4a2b',
 'source-control-values.cjs':'635ba7ec7515a53bb7029b81d223586a9d884b3d60e464ce178bf73a0d4ba560'};
const once=(text,before,after)=>{assert.equal(text.split(before).length,2,'Unique exact candidate edit');return text.replace(before,after);};
const candidateRoot=mkdtempSync(join(artifacts,'candidate-root-'));
// The original builder packet was public-only. A retained checkout also has
// private fixtures and engine bundles: copy only the already-built public graph
// and its two build inputs, never recursively traverse the retained rebuild.
const publicInputs=new Set(retained.inventory.filter(i=>i.path.startsWith('rebuild/')&&!i.path.split('/').includes('node_modules')).map(i=>i.path));
for(const file of ['rebuild/m3/w6/build-browser.mjs','rebuild/m3/w6/cipher-imports.json'])publicInputs.add(file);
for(const file of publicInputs){
 assert(!file.split('/').some(part=>['..','private','ledger','engines','node_modules','seed.cjs'].includes(part)),'public composition input');
 const dest=join(candidateRoot,file);mkdirSync(dirname(dest),{recursive:true});copyFileSync(join(source,file),dest);
}
symlinkSync(join(here,'node_modules'),join(candidateRoot,'rebuild/m3/w6/node_modules'),process.platform==='win32'?'junction':'dir');
const composedDir=join(candidateRoot,'rebuild/m4/workout'),originals={};
for(const [file,pin] of Object.entries(PREIMAGE)){const bytes=readFileSync(join(candidateDir,'workout',file));assert.equal(sha(bytes),pin,'candidate preimage pin '+file);originals[file]=bytes;writeFileSync(join(composedDir,file),bytes);}
writeFileSync(join(composedDir,'schema.cjs'),once(originals['schema.cjs'].toString(),"const load = value => quantity(value, 'lb') && value.value > 0;","const load = require('./entered-load.cjs');"));
writeFileSync(join(composedDir,'edit-values.cjs'),once(once(originals['edit-values.cjs'].toString(),"'use strict';","'use strict';\nconst enteredLoad=require('./entered-load.cjs');"),"if(field==='load')return quantity(value,'lb')&&(version===1||value.value>0);","if(field==='load')return version===1?quantity(value,'lb'):enteredLoad(value);"));
cpSync(join(candidateDir,'spec/configured-load-candidate/entered-load.cjs'),join(composedDir,'entered-load.cjs'));
const composition={preimagePins:PREIMAGE,composed:Object.fromEntries([...Object.keys(PREIMAGE),'entered-load.cjs'].map(f=>[f,fileSha(join(composedDir,f))]))};
const {buildBrowser:buildCandidate}=await import(pathToFileURL(join(candidateRoot,'rebuild/m3/w6/build-browser.mjs')));
const candidate=await buildCandidate({outfile:join(artifacts,'candidate.js'),entryPoints:[join(candidateRoot,'rebuild/m3/w6/browser-entry.mjs')]});
// Only the composed workout files may differ between the two bundle graphs.
compareConfiguredGraphs(retained.inventory,candidate.inventory,{sourceRoot:source,candidateRoot,composed:composition.composed});

// ---- 3. server / browser ------------------------------------------------
const signing=Sign.generateSigningKey('configured-load-synthetic'),key=Sign.publicKeyOf(signing),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},signing);
const server=createServer((req,res)=>{const file={'/retained.js':retained.outfile,'/candidate.js':candidate.outfile}[req.url];
 if(file){res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});res.end(readFileSync(file));}
 else if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});res.end('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic configured load</title><main id="root"></main></html>');}
 else{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const evidence={retainedInputs:retained.inventory,candidateInputs:candidate.inventory,composition,screenshots:[],observedStatuses:{}};
const shot=async(page,name)=>{const file=join(artifacts,name+'.png');await page.screenshot({path:file,fullPage:true});evidence.screenshots.push(name+'.png');};
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.W6_BROWSER_BIN,headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 const errors=[];const track=p=>p.on('pageerror',()=>errors.push('pageerror'));
 const page=await context.newPage();track(page);await page.goto(origin);
 const cfg=config();delete cfg.clock;delete cfg.authorityKey;
 // 'café' is precomposed U+00E9; 'cafe\u0301' is the decomposed raw spelling. Both must survive untouched.
 const KEYS=[' BW ','BW','hold','55·55·50','café','cafe\u0301','band: red + 2 (left)','  two  spaces  ','45'];

 // ---- 4. DOM interaction proof (retained bundle, controlled client outcomes)
 const dom=await page.evaluate(async KEYS=>{
  const {mountWorkoutCommandPanel:mount}=await import('/retained.js');
  const root=document.querySelector('#root'),checks=[];
  const ok=(v,n)=>{if(!v)throw Error('DOM check failed: '+n);checks.push(n);};
  const settle=()=>new Promise(r=>setTimeout(r,0));
  const status=()=>root.querySelector('[role=status]').textContent;
  const forms=()=>root.querySelectorAll('form'),send=i=>forms()[i].dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  const q=n=>root.querySelector(`[name=${n}]`),labelText=x=>x.closest('label').firstChild.nodeValue;
  const setMode=m=>{q('loadMode').value=m;q('loadMode').dispatchEvent(new Event('change',{bubbles:true}));};
  const lastRecord=()=>root.querySelector('.wcp-last-record').textContent,items=()=>[...root.querySelectorAll('.wcp-readback li')].map(x=>x.textContent);
  const selection={planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',lift_lineage_id:'lift-A',logical_set_slot:'slot-0',label:'Synthetic press'};
  const more=Array.from({length:12},(_,i)=>({logical_set_slot:'slot-'+(i+1),lift_lineage_id:'lift-A',label:'Synthetic press '+(i+1)}));
  const calls=[];let resolve;const client={execute(...a){calls.push(a);return new Promise(r=>{resolve=r;});}};
  mount(root,{client,selection,additionalSlots:more});
  ok(q('loadMode').value==='weight'&&labelText(q('load'))==='Weight (lb)'&&q('load').inputMode==='decimal','default Weight mode: one load field labelled Weight (lb) with a decimal keyboard');
  ok(labelText(q('loadMode'))==='Recorded as'&&[...q('loadMode').options].map(o=>o.textContent).join('/')==='Weight/Configuration'&&root.querySelectorAll('.wcp-entry input').length===2,'plain Weight / Configuration choice; the entry keeps exactly two inputs');
  ok([...root.querySelectorAll('input,select')].every(x=>x.closest('label')),'every control has an explicit label');
  ok([...root.querySelectorAll('.wcp-entry input')].every(x=>x.value===''),'no prefilled performed values');
  send(0);resolve({acknowledged:true,op_id:'start-1'});await settle();
  ok(status().startsWith('Saved')&&document.activeElement===q('load'),'start focuses the numeric field in Weight mode');
  q('load').value='40.5';q('reps').value='8';q('reserve').value='3+';send(1);
  ok(calls.length===2&&JSON.stringify(calls[1][1].input.load)===JSON.stringify({value:40.5,unit:'lb'}),'Weight mode sends the unchanged numeric payload');
  resolve({acknowledged:true,op_id:'set-1'});await settle();
  ok(items()[1].includes('40.5 lb × 8')&&lastRecord().includes('40.5 lb × 8'),'numeric readback unchanged');
  root.querySelector('.wcp-next').click();
  ok(q('loadMode').value==='weight'&&q('load').value===''&&document.activeElement===q('load'),'Next resets to Weight with an empty field and numeric focus');
  setMode('configuration');
  ok(labelText(q('load'))==='Configuration'&&q('load').inputMode==='text'&&document.activeElement===q('load'),'Configuration mode relabels the same field, switches to a text keyboard and focuses it');
  ok(parseFloat(getComputedStyle(q('load')).fontSize)>=16,'load field stays at least 16px in Configuration mode');
  for(const text of ['','   ','\t']){q('load').value=text;q('reps').value='6';send(1);
   ok(calls.length===2&&q('load').value===text&&q('load').getAttribute('aria-invalid')==='true'&&status().includes('setup')&&document.activeElement===q('load'),`blank configuration ${JSON.stringify(text)} refused; field retained and focused`);}
  q('load').value=' BW ';setMode('weight');send(1);
  ok(calls.length===2&&q('load').getAttribute('aria-invalid')==='true'&&status().includes('weight')&&q('load').value===' BW ','Weight mode refuses retained non-numeric text without sending it');
  q('load').value='30';send(1);
  ok(JSON.stringify(calls.at(-1)[1].input.load)===JSON.stringify({value:30,unit:'lb'}),'no mixed payload: the one field is read by the chosen mode only');
  resolve({acknowledged:true,op_id:'set-mixed'});await settle();root.querySelector('.wcp-next').click();
  for(const [i,key] of KEYS.entries()){
   setMode('configuration');q('load').value=key;q('reps').value='6';q('reserve').value=i===0?'2':'';send(1);
   const sent=calls.at(-1)[1].input.load;
   ok(JSON.stringify(sent)===JSON.stringify({kind:'configuration',configuration_key:key})&&Object.keys(sent).length===2,`exact key ${JSON.stringify(key)} sent untrimmed with no unit or parsing`);
   resolve({acknowledged:true,op_id:'set-'+calls.length});await settle();
   ok(lastRecord().includes(key+' × 6')&&!lastRecord().includes(key+' lb')&&items().at(-1).includes(key+' × 6'),`readback shows exact key ${JSON.stringify(key)} with no lb suffix`);
   root.querySelector('.wcp-next').click();
  }
  ok(q('loadMode').value==='weight','after configured sets, Next returns to the familiar Weight mode');
  for(const outcome of [3,17,18,20,'unknown','throw']){
   mount(root,{selection,additionalSlots:more,client:{async execute(_c,args){if(args.action==='start')return {acknowledged:true,op_id:'s'};if(outcome==='throw')throw Error('unsafe-detail');if(outcome==='unknown')return undefined;return {acknowledged:false,state:outcome,code:'technical-id'};}}});
   send(0);await settle();setMode('configuration');q('load').value=' BW ';q('reps').value='5';send(1);await settle();
   ok(!status().startsWith('Saved')&&q('loadMode').value==='configuration'&&q('load').value===' BW '&&q('reps').value==='5'&&!root.textContent.includes('technical-id')&&!root.textContent.includes('unsafe-detail'),`refusal ${outcome}: typed configuration, mode and reps retained; no false Saved`);
  }
  return checks;
 },KEYS);
 console.log(`CONFIGURED LOAD DOM PASS — ${dom.length} focused checks (controlled outcomes; not durable evidence)`);

 // ---- 5. retained runtime durable: configured save REFUSED, numeric still saves
 await page.evaluate(async({seed,cfg,key,lease})=>{
  const W=await import('/retained.js');
  const aes=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  const setup={databaseName:'configured-retained',namespace:'synthetic/A',keyProvider:()=>aes,authorizeEnrollment:()=>true};
  const repo=await W.openRepository(setup);seed.metadata.authorityLease=lease;await repo.initialize(seed,'synthetic-only');
  const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true});
  const args={repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,observationGuard:{run:async(_k,fn)=>fn()},validateCommit:()=>null,keys:[key]};
  const client=W.createDurablePublicClient(args);window.cl={W,repo,setup,client};
  W.mountWorkoutCommandPanel(document.querySelector('#root'),{client,selection:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',lift_lineage_id:'lift-A',logical_set_slot:'slot-A',label:'Synthetic press'}});
 },{seed:initial(),cfg,key,lease});
 await page.getByRole('button',{name:'Start',exact:true}).focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — start'));
 await page.getByLabel('Recorded as').selectOption('configuration');
 assert.deepEqual(await page.evaluate(()=>[document.activeElement.name,document.activeElement.closest('label').firstChild.nodeValue]),['load','Configuration']);
 await page.getByLabel('Configuration',{exact:true}).fill('BW');await page.getByLabel('Completed repetitions').fill('5');
 await page.getByRole('button',{name:'Log set'}).click();
 await page.waitForFunction(()=>{const t=document.querySelector('[role=status]').textContent;return t!=='Saving…'&&!t.startsWith('Saved');});
 evidence.observedStatuses.retainedConfiguredRefusal=await page.getByRole('status').textContent();
 assert.equal(await page.getByLabel('Configuration',{exact:true}).inputValue(),'BW');
 assert.equal(await page.evaluate(async()=>Object.keys((await cl.repo.load()).generation.collections.ops).length),1);
 await shot(page,'retained-refuses-configuration-390');
 await page.getByLabel('Recorded as').selectOption('weight');await page.getByLabel('Weight (lb)',{exact:true}).fill('35.5');
 await page.getByLabel('Completed repetitions').focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — set logged'));
 const retainedOps=await page.evaluate(async()=>{const ops=Object.values((await cl.repo.load()).generation.collections.ops);cl.repo.close();return ops.filter(x=>x.kind==='session-set').map(x=>x.payload.load);});
 assert.deepEqual(retainedOps,[{value:35.5,unit:'lb'}]);
 console.log('CONFIGURED LOAD RETAINED PASS — retained numeric-only runtime refuses the configured save with typed key retained and no false Saved; numeric save unchanged');

 // ---- 6. candidate durable: prepared workout, multiple sets, history, both corrections, reopen
 const page2=await context.newPage();track(page2);await page2.goto(origin);
 await page2.exposeFunction('clShot',name=>shot(page2,name));
 const cl2=await page2.evaluate(async({seed,cfg,key,lease})=>{
  const W=await import('/candidate.js'),root=document.querySelector('#root'),checks=[];
  const ok=(v,n)=>{if(!v)throw Error('Candidate check: '+n);checks.push(n);};
  const capture=W.PrescriptionCapture.createPrescriptionCapture({parseStrictJson:W.parseStrictJson}),commands=W.WorkoutCommands.createWorkoutCommands({prescriptionCapture:capture});
  let next=0;
  async function fixture(){
   const aes=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
   const setup={databaseName:'configured-candidate-'+next++,namespace:'synthetic/A',keyProvider:()=>aes,authorizeEnrollment:()=>true};
   const repo=await W.openRepository(setup),generation=structuredClone(seed);generation.metadata.authorityLease=lease;await repo.initialize(generation,'synthetic-only');
   const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true,workoutCommands:commands});
   const unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
   const cells=[{display:'40 lb',source_json:' {"value":40.00,"unit":"lb"} '},{display:'BW',source_json:'{"kind":"configuration","configuration_key":"BW"}'},{display:'45 lb',source_json:' {"value":45.00,"unit":"lb"} '}];
   const args={repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
    observationGuard:{run:async(_k,fn)=>fn()},validateCommit:()=>null,keys:[key],prescriptionCapture:capture,
    workoutProducerIdentity:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},
    resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',causal_parents:[]}),
    workoutProducer:(_g,c)=>({profile:capture.profile,producer:c.producer,basis:c.basis,session:{instruction:{state:'specified',display:'Synthetic instructions',source_json:'"synthetic"'},reason:unknown(),confidence:unknown()},
     slots:cells.map((cell,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same',label:'Café '+i,load:{state:'specified',...cell},reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}))})};
   return {repo,setup,args,client:W.createDurablePublicClient(args)};
  }
  const wait=async p=>{for(let i=0;i<2000;i++){if(p())return;await new Promise(r=>setTimeout(r,5));}throw Error('wait timed out');};
  const q=n=>root.querySelector(`[name=${n}]`),status=()=>root.querySelector('.wcp-status').textContent;
  const setMode=m=>{q('loadMode').value=m;q('loadMode').dispatchEvent(new Event('change',{bubbles:true}));};
  function holdWrite(){const original=IDBDatabase.prototype.transaction;let release=false,arrived;const entered=new Promise(r=>arrived=r);
   IDBDatabase.prototype.transaction=function(...a){const tx=original.apply(this,a);if(a[1]!=='readwrite')return tx;const store=tx.objectStore('generations'),put=store.put.bind(store),objectStore=tx.objectStore.bind(tx);
    store.put=(value,k)=>{if(k==='active')arrived();return put(value,k);};tx.objectStore=n=>n==='generations'?store:objectStore(n);const hold=()=>{if(release)return;try{store.get('active').onsuccess=hold;}catch{}};hold();return tx;};
   return {entered,release(){release=true;IDBDatabase.prototype.transaction=original;}};}
  const f=await fixture();const handle=W.mountPreparedWorkoutPanel(root,{client:f.client,plannedSplitSlotId:'synthetic-slot'});
  ok((await handle.ready).mounted===true,'actual prepared host mounts on the candidate composition');
  const active=()=>root.querySelector('.prepared-active-slot').textContent;
  ok(active().includes('40 lb')&&[...root.querySelectorAll('.wcp-entry input')].every(x=>x.value===''),'prescribed 40 lb shown; nothing prefilled');
  root.querySelector('.wcp-start').requestSubmit();await wait(()=>status().startsWith('Saved'));
  q('load').value='40.5';q('reps').value='8';q('reserve').value='3+';root.querySelector('.wcp-entry').requestSubmit();await wait(()=>status().includes('set logged'));
  root.querySelector('.wcp-next').click();
  ok(active().includes('BW')&&!active().includes('BW lb')&&q('load').value===''&&q('loadMode').value==='weight','configured prescription BW is displayed as its exact key and never copied into the performed entry');
  setMode('configuration');q('load').value=' BW ';q('reps').value='6';q('reserve').value='2';
  await window.clShot('entry-configuration-390');
  const hold=holdWrite();root.querySelector('.wcp-entry').requestSubmit();await hold.entered;
  ok(status()==='Saving…'&&!root.querySelector('.wcp-entry').hidden&&q('load').value===' BW ','held IndexedDB transaction: no early Saved, typed key still visible');
  await window.clShot('saving-configuration-390');hold.release();await wait(()=>status().includes('set logged'));
  ok(root.querySelector('.wcp-last-record').textContent.includes(' BW  × 6')&&!root.textContent.includes(' BW  lb'),'acknowledged configured set reads back the exact key');
  root.querySelector('.wcp-next').click();setMode('configuration');q('load').value='café';q('reps').value='5';root.querySelector('.wcp-entry').requestSubmit();await wait(()=>status().includes('set logged'));
  root.querySelector('.wcp-finish').click();await wait(()=>status().includes('workout finished'));
  const recorded=await f.repo.load(),ops=Object.values(recorded.generation.collections.ops),sets=ops.filter(x=>x.kind==='session-set');
  ok(JSON.stringify(sets.map(x=>x.payload.load))===JSON.stringify([{value:40.5,unit:'lb'},{kind:'configuration',configuration_key:' BW '},{kind:'configuration',configuration_key:'café'}]),'three sets stored with exact numeric and configured loads');
  const startOp=ops.find(x=>x.kind==='session-start'),captureBytes=JSON.stringify(startOp.prescription_capture);
  handle.dispose();f.repo.close();
  const fresh=await W.openRepository(f.setup),client=W.createDurablePublicClient({...f.args,repository:fresh});
  ok(JSON.stringify(await fresh.load())===JSON.stringify(recorded),'encrypted generation reopens byte-identical before corrections');
  const history=W.mountPreparedWorkoutPanel(root,{client,plannedSplitSlotId:'synthetic-slot',enableContinuation:true});
  const opened=await history.ready;ok(opened.mounted===true&&opened.history===true,'recovered history renders for the finished workout');
  const itemText=i=>root.querySelectorAll('.prepared-history-set')[i].textContent;
  ok(itemText(0).includes('40.5 lb × 8 rep')&&itemText(1).includes(' BW  × 6 rep')&&itemText(2).includes('café × 5 rep')&&!root.textContent.includes(' BW  lb'),'history shows exact keys without lb suffix and numeric unchanged');
  ok(itemText(0).includes('Prescribed: 40 lb')&&itemText(1).includes('Prescribed: BW')&&itemText(2).includes('Prescribed: 45 lb'),'prescribed targets shown truthfully beside recorded values');
  await window.clShot('history-390');
  const correct=async(index,drive)=>{
   const item=root.querySelectorAll('.prepared-history-set')[index];item.querySelector('button').click();
   await wait(()=>item.querySelector('form.history-editor'));const form=item.querySelector('form.history-editor');
   const ref=form.querySelector('.history-edit-reference').textContent;const r=await drive(form,ref);
   return r;};
  await correct(0,async(form,ref)=>{
   ok(ref.includes('Prescribed: 40 lb')&&ref.includes('Originally recorded: 40.5 lb × 8 rep')&&ref.includes('Currently recorded: 40.5 lb × 8 rep'),'editor shows prescribed, original and current before a numeric→configured correction');
   ok(form.querySelector('[name=correctedLoadMode]').value==='weight'&&form.querySelector('[name=correctedLoad]').value==='40.5'&&document.activeElement===form.querySelector('[name=correctedLoad]'),'editor prefills the current numeric value and focuses it');
   const m=form.querySelector('[name=correctedLoadMode]');m.value='configuration';m.dispatchEvent(new Event('change',{bubbles:true}));
   ok(document.activeElement===form.querySelector('[name=correctedLoad]')&&form.querySelector('[name=correctedLoad]').closest('label').firstChild.nodeValue==='Recorded configuration','switching to Configuration relabels and focuses the same recorded-load field');
   form.querySelector('[name=correctedLoad]').value='hold';await window.clShot('editor-numeric-to-configured-390');form.requestSubmit();
   await wait(()=>root.querySelector('.prepared-workout-host>p').textContent.includes('correction recorded'));});
  ok(itemText(0).includes('hold × 8 rep')&&itemText(0).includes('Original recorded entry')&&itemText(0).includes('40.5 lb × 8 rep')&&itemText(0).includes('Recorded changes are retained'),'numeric→configured correction: current shows exact key, original stays visible');
  await correct(1,async(form,ref)=>{
   ok(ref.includes('Prescribed: BW')&&ref.includes('Originally recorded:  BW  × 6 rep'),'editor shows prescribed BW and the originally recorded exact key');
   ok(form.querySelector('[name=correctedLoadMode]').value==='configuration'&&form.querySelector('[name=correctedLoad]').value===' BW ','editor prefills the exact configured key untrimmed');
   const m=form.querySelector('[name=correctedLoadMode]');m.value='weight';m.dispatchEvent(new Event('change',{bubbles:true}));form.querySelector('[name=correctedLoad]').value='45';form.requestSubmit();
   await wait(()=>itemText(1).includes('45 lb × 6 rep'));});
  ok(itemText(1).includes('45 lb × 6 rep')&&itemText(1).includes(' BW  × 6 rep'),'configured→numeric correction: current numeric, original exact key retained');
  // Editor refusals: blank key refused with typed values retained; native quota fault retains the typed correction and changes nothing.
  await correct(2,async(form)=>{
   form.querySelector('[name=correctedLoad]').value='   ';form.requestSubmit();await new Promise(r=>setTimeout(r,0));
   const msg=form.parentNode.querySelector('.history-edit-status').textContent;
   ok(msg.includes('recorded setup')&&form.querySelector('[name=correctedLoad]').value==='   '&&!form.querySelector('button[type=submit]').disabled,'blank corrected configuration refused; typed text retained; editor still open');
   form.querySelector('[name=correctedLoad]').value='band';form.querySelector('[name=correctedReps]').value='7';
   const before=JSON.stringify(await fresh.load()),put=IDBObjectStore.prototype.put;
   IDBObjectStore.prototype.put=function(v,k){if(this.name==='generations'&&k==='active')throw new DOMException('Synthetic quota','QuotaExceededError');return put.call(this,v,k);};
   form.requestSubmit();await wait(()=>form.parentNode.querySelector('.history-edit-status').textContent.includes('Could not save'));IDBObjectStore.prototype.put=put;
   ok(form.querySelector('[name=correctedLoad]').value==='band'&&form.querySelector('[name=correctedReps]').value==='7'&&JSON.stringify(await fresh.load())===before,'native quota refusal: typed correction retained, no false Saved, stored generation unchanged');
   await window.clShot('editor-refused-390');});
  const read=await client.readWorkoutHistory();ok(read.read===true,'history reads after corrections');
  const facts=read.history.sessions[0].projection.facts;
  ok(JSON.stringify(facts[0].original.load)===JSON.stringify({value:40.5,unit:'lb'})&&JSON.stringify(facts[0].current.load)===JSON.stringify({kind:'configuration',configuration_key:'hold'})&&facts[0].original.reps.value===8&&facts[0].current.reps.value===8&&JSON.stringify(facts[0].current.reserve)===JSON.stringify({tag:'at_least',value:3,unit:'rep'})&&facts[0].edit_op_ids.length===1,'fact 1: original numeric retained, current configured, reps/reserve unchanged');
  ok(JSON.stringify(facts[1].original.load)===JSON.stringify({kind:'configuration',configuration_key:' BW '})&&JSON.stringify(facts[1].current.load)===JSON.stringify({value:45,unit:'lb'})&&facts[1].current.reps.value===6&&JSON.stringify(facts[1].current.reserve)===JSON.stringify({tag:'exact',value:2,unit:'rep'})&&facts[1].edit_op_ids.length===1,'fact 2: original exact key retained, current numeric, reps/reserve unchanged');
  ok(JSON.stringify(facts[2].current.load)===JSON.stringify({kind:'configuration',configuration_key:'café'})&&facts[2].edit_op_ids.length===0,'fact 3 untouched by the refused edit attempts');
  const finalOps=Object.values((await fresh.load()).generation.collections.ops),corrections=finalOps.filter(x=>x.kind==='correction');
  ok(corrections.length===2&&corrections.every(x=>Object.keys(x.payload.replacement_fields).join()==='load'),'each correction replaces the whole load only');
  ok(JSON.stringify(finalOps.find(x=>x.kind==='session-start').prescription_capture)===captureBytes,'original capture unchanged by corrections');
  const beforeReopen=JSON.stringify(await fresh.load());fresh.close();
  const again=await W.openRepository(f.setup),reread=await W.createDurablePublicClient({...f.args,repository:again}).readWorkoutHistory();
  ok(JSON.stringify(await again.load())===beforeReopen&&JSON.stringify(reread.history.sessions[0].projection.facts.map(x=>[x.original.load,x.current.load]))===JSON.stringify(facts.map(x=>[x.original.load,x.current.load])),'native encrypted close/reopen preserves exact corrected and original loads');
  // After a refused edit the existing editor stays retired until the workout is reopened;
  // reopen on the live reopened repository so later keyboard checks use a fresh render.
  history.dispose();window.cl={W,f,again,client:W.createDurablePublicClient({...f.args,repository:again})};
  const reopened=W.mountPreparedWorkoutPanel(root,{client:window.cl.client,plannedSplitSlotId:'synthetic-slot',enableContinuation:true});
  ok((await reopened.ready).history===true&&itemText(0).includes('hold × 8 rep')&&itemText(1).includes('45 lb × 6 rep'),'reopening the workout renders fresh history that still shows both corrections');
  window.cl.history=reopened;return checks;
 },{seed:initial(),cfg,key,lease});
 console.log(`CONFIGURED LOAD CANDIDATE PASS — ${cl2.length} native checks on the pinned composition`);

 // ---- 7. keyboard/focus and desktop layout on the live history/editor page
 const keyboard=[];
 await page.close();await page2.bringToFront();
 // Item 2's editor was deliberately retired by the refused quota commit (existing behaviour: reopen the workout).
 // Items 0 and 1 were re-rendered fresh after their committed corrections; item 0 is currently configured.
 await page2.locator('.prepared-history-set').nth(0).getByRole('button',{name:'Correct this set'}).click();
 await page2.locator('form.history-editor').waitFor();
 await page2.evaluate(()=>document.querySelector('form.history-editor [name=correctedLoadMode]').focus());
 assert.equal(await page2.evaluate(()=>document.activeElement.name),'correctedLoadMode');keyboard.push('Recorded as select takes keyboard focus');
 await page2.keyboard.press('Tab');
 assert.equal(await page2.evaluate(()=>document.activeElement.name),'correctedLoad');keyboard.push('Tab from Recorded as lands on the recorded-load field');
 assert.equal(await page2.evaluate(()=>document.activeElement.closest('label').firstChild.nodeValue),'Recorded configuration');keyboard.push('focused field is labelled Recorded configuration');
 await page2.locator('form.history-editor [name=correctedLoadMode]').selectOption('weight');
 assert.deepEqual(await page2.evaluate(()=>[document.activeElement.name,document.activeElement.closest('label').firstChild.nodeValue]),['correctedLoad','Recorded weight (lb)']);keyboard.push('keyboard mode change keeps focus on the field, now labelled Recorded weight (lb)');
 for(const width of [390,1024]){await page2.setViewportSize({width,height:900});
  assert(await page2.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'history fits viewport at '+width);
  const controls=await page2.evaluate(()=>[...document.querySelectorAll('.prepared-history input,.prepared-history select,.prepared-history button')].filter(x=>x.getClientRects().length).every(x=>{const r=x.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44;}));
  assert.equal(controls,true,'history controls fit and are >=44px at '+width);
  await shot(page2,`history-editor-${width}`);}
 await page2.setViewportSize({width:390,height:844});await page2.evaluate(()=>{cl.history.dispose();cl.again.close();});
 assert.deepEqual(errors,[]);
 for(const input of retained.inventory)assert.equal(fileSha(join(source,input.path)),input.sha256,'retained source changed during proof');
 for(const input of candidate.inventory)assert.equal(fileSha(join(candidateRoot,input.path)),input.sha256,'candidate composition changed during proof');
 writeFileSync(join(artifacts,'evidence.json'),JSON.stringify({...evidence,domChecks:dom,candidateChecks:cl2,keyboard,browser:await browser.version(),playwrightCore:require('playwright-core/package.json').version,
  candidateRoot:relative(artifacts,candidateRoot),limits:['synthetic unissued schema2 lease, synthetic producer/guard and fixed clock','retained bundle proves refusal only; candidate composition is an explicit pinned UI-test dependency, not retained runtime adoption','desktop Chromium, not iPhone','no hosted/recovery/science/full-app or authority qualification','stale-edit retention is covered by controlled DOM outcomes and native quota, not a concurrent-device race']},null,2)+'\n');
 console.log('CONFIGURED LOAD BROWSER PASS — numeric controls unchanged; exact BW/whitespace/Unicode/punctuation keys; blank/mixed refusal; both correction directions through existing edit APIs; prescribed/original/current visible; typed entries retained on refusal/quota/unknown; native AES-GCM/IndexedDB reopen; keyboard focus labels; 390/1024 screenshots');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
