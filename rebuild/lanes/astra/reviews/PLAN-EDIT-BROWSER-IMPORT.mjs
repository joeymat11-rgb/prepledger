import { buildBrowser } from '../../../m3/w6/build-browser.mjs';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const require = createRequire(new URL('../../../m3/w6/package.json',import.meta.url));
const { chromium } = require('playwright-core');
const out = await mkdtemp(fileURLToPath(new URL('../../../../.tmp/review-browser-import-',import.meta.url)));
const built = await buildBrowser({entryPoints:[fileURLToPath(new URL('../../../m3/w6/host/plan-edit-host.mjs',import.meta.url))],outfile:out+'/host.js'});
const bytes = await readFile(built.outfile), failures = [];
const server = createServer((req,res)=>{
  if(req.url==='/host.js'){res.writeHead(200,{'content-type':'application/javascript'});res.end(bytes);}
  else if(req.url==='/'){res.writeHead(200,{'content-type':'text/html'});res.end('<!doctype html><title>Synthetic companion import</title>');}
  else {res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
  browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage();page.on('pageerror',error=>failures.push(error.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  const observed=await page.evaluate(async()=>({host:typeof(await import('./host.js')).createPlanEditHost,
    dirname:typeof globalThis.__dirname,require:typeof globalThis.require,process:typeof globalThis.process}));
  if(observed.host!=='function' || failures.length)throw new Error('Browser companion import failed');
  const result={candidate:execFileSync('git',['rev-parse','HEAD'],{cwd:fileURLToPath(new URL('../../../../',import.meta.url)),encoding:'utf8'}).trim(),inputs:built.inventory.length,
    bundleSha256:createHash('sha256').update(bytes).digest('hex'),observed,pageErrors:failures.length,
    scope:'actual fresh Edge module import only; no editor, save, phone or PE12 proof'};
  await writeFile(out+'/verdict.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
