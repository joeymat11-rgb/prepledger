'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {failure}=require('./load-write-errors.cjs'),L=require('../../conform/v4/postfix/legacy-gates.cjs');
test('original prerequisite codes remain BLOCKED; unknown diagnostics remain private',()=>{
 for(const code of ['REQUIRED-PRIVATE-PREPARATION-MISSING','REQUIRED-DISPOSITION-RECEIPT-MISSING','BASELINE-ESBUILD-MISSING','INTEGRATION-FETCH-BLOCKED','STEP-CUSTODY-PENDING'])assert.deepEqual(failure({code,message:'synthetic sensitive detail'}),{exit:2,line:'LOAD PACKAGE BLOCKED '+code});
 for(const e of [undefined,new Error('synthetic sensitive detail'),{code:'synthetic sensitive detail'},{code:'BASELINE-ESBUILD-VERSION'}])assert.deepEqual(failure(e),{exit:1,line:'LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld'});
});
test('actual package CLI preserves missing-dependency exit2 and the closed code',()=>{
 const root=path.resolve(__dirname,'../../..'),base=path.join(root,'.tmp');fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(path.join(base,'load-errors-'));
 try{
  const hook=path.join(dir,'missing-dependency.cjs'),missing=path.join(root,'node_modules/esbuild/lib/main.js');
  // Fault injection in this disposable child only; no dependency or product file changes.
  fs.writeFileSync(hook,'const fs=require("node:fs"),path=require("node:path"),exists=fs.existsSync;fs.existsSync=p=>path.resolve(String(p))==='+JSON.stringify(missing)+'?false:exists(p);');
  const r=require('node:child_process').spawnSync(process.execPath,['--require',hook,path.join(__dirname,'load-write-package.cjs'),'--ci'],{cwd:root,env:{...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:''},encoding:'utf8',windowsHide:true,timeout:30000});
  assert(!r.error);assert.equal(r.status,2);assert.equal(r.stderr.trim(),'LOAD PACKAGE BLOCKED BASELINE-ESBUILD-MISSING');assert(!r.stdout.includes('LOAD PACKAGE focused'));
 }finally{assert(path.resolve(dir).startsWith(base+path.sep+'load-errors-'));fs.rmSync(dir,{recursive:true,force:true});}
});
test('actual unchanged reference builder missing dependency is classified BLOCKED',()=>{
 const base=path.resolve(__dirname,'../../../.tmp');fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(path.join(base,'load-errors-'));
 try{let caught;try{L.publicReferences({baseline:dir,scratch:path.join(dir,'refs'),sourcePins:{}});}catch(e){caught=e;}assert.equal(caught?.code,'BASELINE-ESBUILD-MISSING');assert.deepEqual(failure(caught),{exit:2,line:'LOAD PACKAGE BLOCKED BASELINE-ESBUILD-MISSING'});}
 finally{assert(path.resolve(dir).startsWith(base+path.sep+'load-errors-'));fs.rmSync(dir,{recursive:true,force:true});}
});
