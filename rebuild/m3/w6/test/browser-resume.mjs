import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {buildBrowser} from '../build-browser.mjs';
import {O,initial,config} from './support.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const Sign=require('../../w5/crypto.cjs'),{chromium}=require('playwright-core');
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('WORKOUT RESUME BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const artifacts=join(here,'.tmp/workout-resume');mkdirSync(artifacts,{recursive:true});
const built=await buildBrowser({outfile:join(artifacts,'app.js'),entryPoints:[join(here,'browser-entry.mjs')]});
const signing=Sign.generateSigningKey('resume-synthetic'),key=Sign.publicKeyOf(signing),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},signing);
// Test-run-only custody survives page disposal. Never a production key bootstrap:
// no key is committed, sent to an external origin or written to an evidence file.
const rawKey=[...randomBytes(32)],cfg=config();delete cfg.clock;
const server=createServer((request,response)=>{
 if(request.url==='/app.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});response.end(readFileSync(built.outfile));}
 else if(request.url==='/'){response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});response.end('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic workout resume</title><main id="root"></main></html>');}
 else{response.writeHead(404);response.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;let browser;
const checks=[],check=(value,name)=>{assert(value,name);checks.push(name);};
try{
 browser=await chromium.launch({executablePath:process.env.W6_BROWSER_BIN,headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844}}),errors=[];
 context.setDefaultTimeout(10000);
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 async function open(first,options={}){
  const page=await context.newPage();page.on('pageerror',()=>errors.push('pageerror'));await page.goto(origin);
  const ready=await page.evaluate(async({first,seed,cfg,key,lease,rawKey,options})=>{
   const W=await import('/app.js'),aes=await crypto.subtle.importKey('raw',new Uint8Array(rawKey),{name:'AES-GCM'},false,['encrypt','decrypt']);
   const setup={databaseName:'resume-synthetic',namespace:'synthetic/A',keyProvider:()=>aes,authorizeEnrollment:e=>e==='synthetic-enrollment'};
   const repo=await W.openRepository(setup);if(first){const g=structuredClone(seed);g.metadata.authorityLease=lease;await repo.initialize(g,'synthetic-enrollment');}
   const capture=W.PrescriptionCapture.createPrescriptionCapture({parseStrictJson:W.parseStrictJson});
   const commands=W.WorkoutCommands.createWorkoutCommands({prescriptionCapture:capture});
   const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true,workoutCommands:commands});
   const unknown=()=>({state:'unknown',display:'Unknown',source_json:null}),cell=(n)=>({state:'specified',display:n+' lb',source_json:JSON.stringify({value:n,unit:'lb'})});
   let produced=0;
   const prescription=c=>({profile:capture.profile,producer:c.producer,basis:c.basis,
    session:{instruction:{state:'specified',display:'Synthetic workout',source_json:'"test only"'},reason:unknown(),confidence:unknown()},
    slots:[40,45,50].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same-lineage',label:'Synthetic lift '+i,load:cell(n),reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}))});
   const client=W.createDurablePublicClient({repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
    observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[key],prescriptionCapture:capture,
    workoutProducerIdentity:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},
    resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',causal_parents:[]}),
    workoutProducer:(_g,c)=>{produced++;return prescription(c);},
    workoutResumePolicy:(_g,c)=>{const now=prescription(c);now.slots[2].load=cell(35);return {allowed_actions:options.refuseSets?['skip','close']:['set','skip','close'],reason:'Synthetic current assessment; not a personal prescription',current_capture:now};}});
   const handle=W.mountPreparedWorkoutPanel(document.querySelector('#root'),{client,plannedSplitSlotId:'synthetic-slot',enableContinuation:true});
   globalThis.__resumeTest={repo,client,produced:()=>produced,handle};return handle.ready;
  },{first,seed:initial(),cfg,key,lease,rawKey,options});
  check(ready.mounted,first?'initial actual host mounted':'fresh page mounted from stored workout');return page;
 }
 const snapshot=page=>page.evaluate(async()=>{const s=await globalThis.__resumeTest.repo.load();return {ops:Object.values(s.generation.collections.ops||{}),revision:s.revision,produced:globalThis.__resumeTest.produced()};});
 const waitStatus=(page,text)=>page.waitForFunction(t=>document.querySelector('.wcp-status')?.textContent.includes(t),text);
 async function log(page,weight,reps){await page.locator('input[name=load]').fill(String(weight));await page.locator('input[name=reps]').fill(String(reps));await page.getByRole('button',{name:'Log set',exact:true}).click();await waitStatus(page,'set logged');}
 let page=await open(true);await page.getByRole('button',{name:'Start',exact:true}).click();await waitStatus(page,'start recorded');
 await log(page,41.5,8);await page.getByRole('button',{name:'Next',exact:true}).click();await log(page,46,9);
 const before=await snapshot(page),start=before.ops.find(o=>o.kind==='session-start');check(before.ops.filter(o=>o.kind==='session-set').length===2,'two actual sets durably recorded before close');
 const original=JSON.stringify(start.prescription_capture);await page.close();
 page=await open(false,{refuseSets:true});check(await page.getByRole('button',{name:'Log set',exact:true}).isDisabled(),'current safety refusal disables Log set on the reopened screen');
 await page.evaluate(()=>document.querySelector('.wcp-entry').requestSubmit());
 check((await snapshot(page)).revision===before.revision,'forced form submission cannot bypass displayed safety refusal');
 await page.getByText('Workout options',{exact:true}).click();check(!await page.getByRole('button',{name:'Finish early',exact:true}).isDisabled(),'current policy can retain explicit early Finish while refusing sets');await page.close();
 page=await open(false);let recovered=await snapshot(page);
 check(recovered.produced===0,'fresh page does not regenerate original instructions or create a Start');
 check(recovered.revision===before.revision,'reopen itself makes no durable write');
 check(JSON.stringify(recovered.ops.find(o=>o.op_id===start.op_id).prescription_capture)===original,'exact original capture survives page close and reopen');
 check(await page.locator('.wcp-start').isHidden(),'Start is hidden after resuming existing identity');
 check((await page.locator('.wcp-progress').innerText()).includes('3 of 3'),'resume selects first remaining set, not a completed entry');
 check((await page.locator('.prepared-history').innerText()).includes('41.5 lb × 8 rep')&&(await page.locator('.prepared-history').innerText()).includes('46 lb × 9 rep'),'earlier performed values visibly recovered');
 check((await page.locator('.prepared-active-slot').innerText()).includes('50 lb')&&(await page.locator('.prepared-active-slot').innerText()).includes('35 lb'),'original and separately labelled current instructions both shown');
 check((await page.locator('input[name=load]').inputValue())==='','resumed performed input is empty, never fabricated from prescription');
 check(await page.locator('.wcp-finish').isHidden(),'normal Finish unavailable while a set remains');
 await log(page,36,10);await page.getByRole('button',{name:'Finish workout',exact:true}).click();await waitStatus(page,'workout finished');
 const finished=await snapshot(page);check(finished.ops.filter(o=>o.kind==='session-start').length===1,'round trip retains exactly one Start');
 check(finished.ops.filter(o=>o.kind==='session-close').length===1&&finished.ops.find(o=>o.kind==='session-close').payload.completion_kind==='normal','one normal Close durably recorded');
 check(finished.ops.filter(o=>o.kind==='session-set').every(o=>o.session_start_op_id===start.op_id),'every set retains the original session identity');
 await page.close();page=await open(false);recovered=await snapshot(page);
 check(recovered.revision===finished.revision&&recovered.ops.length===finished.ops.length,'finished history reopen does not write or duplicate');
 check((await page.locator('.prepared-history').innerText()).includes('36 lb × 10 rep')&&(await page.locator('.prepared-history').innerText()).includes('Workout finished'),'normal Finish and all performed values survive another reopen');
 check(await page.locator('.wcp-entry').count()===0,'closed workout reopens as history, not writable unfinished work');
 check(errors.length===0,'no browser page errors');await context.close();
 console.log(`WORKOUT RESUME PASS — ${checks.length} checks; actual retained host/client/encrypted IndexedDB; page close/reopen; same Start, three Sets, one normal Close, history`);
 for(const name of checks)console.log('PASS '+name);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
