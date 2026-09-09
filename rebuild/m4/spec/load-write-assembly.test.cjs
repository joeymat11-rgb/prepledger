'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),base=path.join(root,'.tmp'),label='LW-ASSEMBLY-CANONICAL-EARN';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(process.argv[2]==='--probe'){
 const dir=path.resolve(process.argv[3]);
 assert(dir===path.join(root,'rebuild/engine')||dir.startsWith(base+path.sep+'load-assembly-'),'Declared disposable or actual engine');
 if(process.argv[4]==='frozen'){const D=Date;globalThis.Date=class extends D{constructor(...a){super(...(a.length?a:[1788451200000]));}static now(){return 1788451200000;}};}
 const E=require(path.join(dir,'index.cjs')).createEngine({clock:{today:()=> '2026-09-03',nowISO:()=> '2026-09-03T12:00:00.000Z'},ids:{next:()=> 'synthetic',fresh:()=> 'synthetic'},drafts:{length:0,key:()=>null}});
 const canonical=require(path.join(dir,'earn.cjs'))(E).earnWalk;
 try{assert.equal(Function.prototype.toString.call(E.earnWalk),Function.prototype.toString.call(canonical),label);console.log(label+' PASS');}
 catch(error){if(!(error instanceof assert.AssertionError))throw error;console.error(label+' FAIL');process.exitCode=1;}
}else{
 const test=require('node:test');
 for(const mode of ['frozen','native'])test(label+' actual assembly and reached order-reversal bite '+mode,()=>{
  fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(path.join(base,'load-assembly-')),index=path.join(dir,'index.cjs');
  function probe(engine,coverage){const r=cp.spawnSync(process.execPath,[__filename,'--probe',engine,mode],{cwd:root,env:{...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:coverage||''},encoding:'utf8',windowsHide:true,timeout:30000});assert(!r.error);return r;}
  try{
   for(const file of fs.readdirSync(path.join(root,'rebuild/engine')).filter(n=>n.endsWith('.cjs')))fs.copyFileSync(path.join(root,'rebuild/engine',file),path.join(dir,file));
   const original=fs.readFileSync(index,'utf8'),from='  require("./migrate.cjs"),\n  require("./earn.cjs"),\n',to='  require("./earn.cjs"),\n  require("./migrate.cjs"),\n';
   assert.equal(original.split(from).length,2);const green=probe(path.join(root,'rebuild/engine'));assert.equal(green.status,0);assert.equal(green.stdout.trim(),label+' PASS');
   const mutant=original.replace(from,to);fs.writeFileSync(index,mutant);const coverage=path.join(dir,'coverage');fs.mkdirSync(coverage);
   const red=probe(dir,coverage);assert.equal(red.status,1);assert.equal(red.stderr.trim(),label+' FAIL');assert(!/RangeError|call stack/.test(red.stdout+red.stderr));
   const indexUrl=require('node:url').pathToFileURL(index).href;
   const reached=fs.readdirSync(coverage).flatMap(n=>JSON.parse(fs.readFileSync(path.join(coverage,n))).result).filter(s=>s.url===indexUrl).flatMap(s=>s.functions.flatMap(f=>f.ranges));
   const site=mutant.indexOf(to);assert(reached.some(r=>r.startOffset<=site&&r.endOffset>site&&r.count>0),'Changed assembly executed');
   console.log(label+' '+mode+' BEHAVIORAL-RED; named assertion; order site executed; mutant '+sha(mutant));
   fs.writeFileSync(index,original);assert.equal(sha(fs.readFileSync(index)),sha(original));const restored=probe(dir);assert.equal(restored.status,0);assert.equal(restored.stdout.trim(),label+' PASS');
   console.log(label+' '+mode+' RESTORED PASS '+sha(original));
  }finally{assert(path.resolve(dir).startsWith(base+path.sep+'load-assembly-'));fs.rmSync(dir,{recursive:true,force:true});}
 });
}
