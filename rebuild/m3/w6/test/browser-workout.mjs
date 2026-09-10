import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdtempSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {buildBrowser} from '../build-browser.mjs';
import {O,initial,config} from './support.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const Sign=require('../../w5/crypto.cjs'),{chromium}=require('playwright-core');
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('WORKOUT BROWSER BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const built=await buildBrowser({outfile:join(here,'.tmp/browser/workout.js'),entryPoints:[join(here,'browser-entry.mjs')]});
const signing=Sign.generateSigningKey('workout-browser-synthetic'),key=Sign.publicKeyOf(signing),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},signing);
const server=createServer((request,response)=>{if(request.url==='/workout.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});response.end(readFileSync(built.outfile));}
 else if(request.url==='/'){response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});response.end('<!doctype html><title>Synthetic workout browser test</title>');}else{response.writeHead(404);response.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;let context;
try{
 context=await chromium.launchPersistentContext(mkdtempSync(join(here,'.tmp/workout-browser-')),{executablePath:process.env.W6_BROWSER_BIN,headless:true});
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 const page=await context.newPage();await page.goto(origin);const cfg=config();delete cfg.clock;
 const result=await page.evaluate(async({seed,cfg,key,lease})=>{
  window.W=await import('/workout.js');const cryptoKey=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  const setup={databaseName:'workout-browser',namespace:'synthetic/A',keyProvider:()=>cryptoKey,authorizeEnrollment:()=>true};
  const repo=await W.openRepository(setup);seed.metadata.authorityLease=lease;seed.collections.drafts={active:{unknown:'preserve'}};await repo.initialize(seed,'synthetic-only');
  const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true});
  const args={repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
   observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[key]}; // Synthetic observation guard; not K1/CLOCK.
  const c=W.createDurablePublicClient(args),start=await c.execute('workout',{action:'start',input:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN'}});
  if(!start.acknowledged)throw Error('start refused');const request={action:'set',input:{session_start_op_id:start.op_id,logical_set_slot:'slot-A',lift_lineage_id:'lift-A',load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'}}};
  const set=await c.execute('workout',request);if(!set.acknowledged)throw Error('set refused');const before=await repo.load();
  const malformed=await c.execute('workout',{action:'set',input:{...request.input,device_seq:99}});const afterInvalid=await repo.load();
  const close=await c.execute('workout',{action:'close',input:{session_start_op_id:start.op_id,completion_kind:'early'}});const durable=await repo.load();repo.close();
  const reopened=await W.openRepository(setup),reader=W.createDurablePublicClient({...args,repository:reopened});const view=await reader.reopen();const again=await reopened.load();
  // Native transaction fault in this isolated synthetic page. No production repository changes.
  const original=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(value,k){if(this.name==='generations'&&k==='active')throw new DOMException('Synthetic quota','QuotaExceededError');return original.call(this,value,k);};
  let failed,afterFault;try{failed=await reader.execute('workout',{action:'set',input:{...request.input,logical_set_slot:'slot-B'}});afterFault=await reopened.load();}finally{IDBObjectStore.prototype.put=original;}
  reopened.close();return {start,set,malformed,before,afterInvalid,close,durable,again,view,failed,afterFault};
 },{seed:initial(),cfg,key,lease});
 assert.equal(result.start.acknowledged,true);assert.equal(result.set.acknowledged,true);assert.equal(result.close.acknowledged,true);
 assert.equal(result.malformed.acknowledged,false);assert.equal(result.malformed.state,3);assert.deepEqual(result.afterInvalid,result.before);
 assert.deepEqual(result.again,result.durable);assert.equal(result.view.refusal,null);
 assert.deepEqual(result.again.generation.collections.drafts,{active:{unknown:'preserve'}});
 assert.equal(result.failed.acknowledged,false);assert.equal(result.failed.state,3);assert.deepEqual(result.afterFault,result.again);
 assert.equal(Object.keys(result.again.generation.collections.ops).length,3);assert.equal(Object.keys(result.again.generation.collections.outbox).length,3);
 console.log('WORKOUT BROWSER PASS — native IndexedDB/WebCrypto/T2 start/set/early-close, schema2, malformed refusal, preserved draft, reopen, atomic quota refusal; synthetic guard, not Safari/K1');
}finally{if(context)await context.close();await new Promise(resolve=>server.close(resolve));}
