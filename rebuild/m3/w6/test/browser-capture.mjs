import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync,mkdtempSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {buildBrowser} from '../build-browser.mjs';
const require=createRequire(import.meta.url),here=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const {chromium}=require('playwright-core');
if(!process.env.W6_BROWSER_BIN||!existsSync(process.env.W6_BROWSER_BIN)){console.log('CAPTURE BROWSER BLOCKED — W6_BROWSER_BIN required');process.exit(2);}
const built=await buildBrowser({outfile:join(here,'.tmp/browser/capture.js'),entryPoints:[join(here,'browser-entry.mjs')]});
const server=createServer((request,response)=>{if(request.url==='/capture.js'){response.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});response.end(readFileSync(built.outfile));}
 else if(request.url==='/'){response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});response.end('<!doctype html><title>Synthetic capture component test</title>');}else{response.writeHead(404);response.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;let context;
try{
 context=await chromium.launchPersistentContext(mkdtempSync(join(here,'.tmp/capture-browser-')),{executablePath:process.env.W6_BROWSER_BIN,headless:true});
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 const page=await context.newPage();await page.goto(origin);
 const result=await page.evaluate(async()=>{
  const W=await import('/capture.js'),boundary=W.PrescriptionCapture.createPrescriptionCapture({parseStrictJson:W.parseStrictJson});
  const unknown=()=>({state:'unknown',display:'Synthetic unknown',source_json:null});
  const f={profile:'earned/workout-prescription/v1',producer:{app_build:'synthetic',engine_build:'synthetic',rule_profile:'synthetic',source_schema:'synthetic'},basis:{plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic',source_revision:7},session:{instruction:unknown(),reason:unknown(),confidence:unknown()},slots:[{logical_set_slot:'s1',lift_lineage_id:'l1',label:'Cafe\u0301',load:{state:'specified',display:'Synthetic 40 lb',source_json:' {"value":40.00,"unit":"lb"} '},reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}]};
  const expected={producer:structuredClone(f.producer),basis:structuredClone(f.basis)},raw=JSON.stringify(f),out=boundary.prepare(f,expected);
  f.slots[0].label='caller change';let frozen=false,getters=0,refused=false,duplicate=false,unicode=false;
  try{out.slots[0].label='mutation';}catch{}
  frozen=Object.isFrozen(out.slots[0])&&out.slots[0].label==='Cafe\u0301';
  const bad=JSON.parse(raw);Object.defineProperty(bad.slots[0],'label',{enumerable:true,get(){getters++;return 'bad';}});
  try{boundary.prepare(bad,expected);}catch(e){refused=e.code==='WORKOUT_CAPTURE_INVALID';}
  const dupe=JSON.parse(raw);dupe.slots[0].load.source_json='{"a":1,"\\u0061":2}';try{boundary.prepare(dupe,expected);}catch(e){duplicate=e.code==='WORKOUT_CAPTURE_INVALID';}
  const malformed=JSON.parse(raw);malformed.slots[0].load.source_json='"\\ud800"';try{boundary.prepare(malformed,expected);}catch(e){unicode=e.code==='WORKOUT_CAPTURE_INVALID';}
  return {sameBytes:JSON.stringify(out)===raw,frozen,deepFrozen:Object.isFrozen(out.slots[0].load),getters,refused,duplicate,unicode};
 });
 assert.deepEqual(result,{sameBytes:true,frozen:true,deepFrozen:true,getters:0,refused:true,duplicate:true,unicode:true});
 console.log('CAPTURE BROWSER PASS — 7 native browser assertions; actual exported capture + existing strict parser; no Start/IDB/issuer/phone qualification');
}finally{if(context)await context.close();await new Promise(resolve=>server.close(resolve));}
