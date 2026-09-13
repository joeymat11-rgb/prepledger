import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import childProcesses from 'node:child_process';
import {spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {buildBrowser} from '../build-browser.mjs';
import {contained,readManifest,verifySources,inspectStaticEdges,verifiedBrowser,sha256} from '../../../m4/import/test/s3/run.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const fail=code=>{throw Error(code);};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
if(!process.argv.includes('--core')||process.argv.includes('--real-c2')){console.error('S3 BLOCKED final browser and real-C2 actor/output/evidence pending');process.exit(2);}
if(path.resolve(process.env.S3_SCRATCH||'')!==ROOT||process.versions.node.split('.')[0]!=='22')fail('S3_BROWSER_COPIED_TREE_REQUIRED');
const run=contained(path.dirname(ROOT),process.env.S3_RUN_ROOT),manifest=readManifest(ROOT),pins=new Map(manifest.sources.map(e=>[e.path,e.sha256]));
verifySources(ROOT,manifest);inspectStaticEdges(ROOT,manifest);
const executable=verifiedBrowser(process.env.W6_BROWSER_BIN),out=contained(ROOT,path.join(ROOT,'.tmp','s3-browser'));
fs.mkdirSync(out,{recursive:true});
const graph=[];
for(const [name,entry]of [['product','rebuild/m3/w6/local/source-admission.mjs'],['test','rebuild/m4/import/test/s3/browser-entry.mjs']]){
  const result=await buildBrowser({outfile:path.join(out,name+'.mjs'),entryPoints:[path.join(ROOT,entry)]});
  for(const input of result.inventory){
    const file=contained(ROOT,path.join(ROOT,input.path));
    if(input.path.includes('/node_modules/'))continue;
    if(pins.get(input.path)!==input.sha256||sha256(fs.readFileSync(file))!==input.sha256)fail('S3_BROWSER_UNPINNED_GRAPH');
    if(name==='product'&&(/\/test\/|\/fixtures\.cjs$|\/engine\/(seed|index|oracle-shim)\.cjs$/.test(input.path)||/\/import\/(prepare|reading-replay)\.cjs$/.test(input.path)))fail('S3_BROWSER_PRODUCT_TEST_OR_NODE_FACADE');
  }
  graph.push({name,entry,sha256:sha256(fs.readFileSync(result.outfile)),inputs:result.inventory});
}
const profile=contained(run,path.join(run,'browser-profile','core-'+Date.now()));fs.mkdirSync(profile);
const html='<!doctype html><meta charset="utf-8"><title>S3 portable core test</title><script type="module" src="/test.mjs"></script>';
const server=http.createServer((req,res)=>{if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'});res.end(html);}else if(req.url==='/test.mjs'){res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});res.end(fs.readFileSync(path.join(out,'test.mjs')));}else{res.writeHead(404);res.end();}});
server.listen(0,'127.0.0.1');await once(server,'listening');const url='http://127.0.0.1:'+server.address().port+'/';
let browser,processHandle;const errors=[];let killed=false;
// Instrument only the exact owned launch to retain its public ChildProcess PID.
// Playwright supplies its supported Chromium startup switches and persistent API.
const originalSpawn=childProcesses.spawn;
childProcesses.spawn=function(command,args,options){const child=originalSpawn.call(this,command,args,options);
  if(path.resolve(command)===path.resolve(executable.path)&&args.includes('--user-data-dir='+profile))processHandle=child;
  return child;};
const {chromium}=await import('playwright-core');
async function launch(){
  const context=await chromium.launchPersistentContext(profile,{executablePath:executable.path,headless:true,timezoneId:'America/New_York',timeout:30000,env:{...process.env,TEMP:path.join(run,'temp'),TMP:path.join(run,'temp')}});
  browser=context.browser();
  if(!processHandle.pid)fail('S3_BROWSER_PROCESS_NOT_STARTED');
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>!!globalThis.S3,{timeout:15000});return page;
}
async function killOwned(){
  if(!processHandle?.pid||processHandle.exitCode!==null)return;
  const exited=once(processHandle,'exit');
  if(process.platform==='win32'){const result=spawnSync('taskkill',['/PID',String(processHandle.pid),'/T','/F'],{windowsHide:true,encoding:'utf8'});if(result.status!==0&&processHandle.exitCode===null)fail('S3_BROWSER_OWNED_KILL_FAILED');}
  else processHandle.kill('SIGKILL');
  await Promise.race([exited,sleep(10000).then(()=>fail('S3_BROWSER_KILL_TIMEOUT'))]);processHandle=null;browser=null;
}
try{
  let page=await launch();const userAgent=await page.evaluate(()=>navigator.userAgent),first=await page.evaluate(()=>S3.first());
  await killOwned();killed=true;
  page=await launch();const second=await page.evaluate(expected=>S3.reopen(expected),first.evidence),negative=await page.evaluate(()=>S3.wrongContext());
  if(errors.length)fail('S3_BROWSER_PAGE_ERRORS '+errors.join('|'));
  await page.evaluate(()=>S3.close());
  const evidence={profile:'earned/s3-browser-core/v1',scope:'PORTABLE ONLY',synthetic:true,realC2:false,calendar:'browser realm explicitly America/New_York; invented compatibility registry',executable,userAgent,killed,profile,source_manifest_sha256:sha256(fs.readFileSync(path.join(ROOT,'rebuild/m4/spec/s3-portable-sources.json'))),cells:first.cells+second.cells+negative.cells,first,second,graph,pending:['final capture Start/resume','Today and gym consumers','real-C2/P1','B cumulative final gates']};
  fs.writeFileSync(path.join(run,'browser-core-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log('S3 BROWSER PORTABLE ONLY '+evidence.cells+' cells; real WebCrypto/IndexedDB; owned force-kill/reopen; final/P1 pending');
}finally{await killOwned();childProcesses.spawn=originalSpawn;server.close();verifySources(ROOT,manifest);}
