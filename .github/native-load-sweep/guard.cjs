'use strict';
// Scratch preload guard (never in the worktree): refuses the protected five before
// load, refuses any file READ of them, and reports at exit whether any reached the
// module cache or was asked for. A test that needs them fails loudly = CI-only.
const Module=require('node:module'),path=require('node:path'),fs=require('node:fs');
const PROTECTED=/[\\/]rebuild[\\/]engine[\\/](seed|migrate|merge|index|oracle-shim)\.cjs$/;
const asked=new Set();
const refuse=(file)=>{asked.add(path.basename(String(file)));const e=new Error('PROTECTED_ENGINE_MODULE_REFUSED '+path.basename(String(file)));e.code='PROTECTED_ENGINE_MODULE_REFUSED';throw e;};
const original=Module._load;
Module._load=function(request,parent,isMain){
 let file=null;try{file=Module._resolveFilename(request,parent,isMain);}catch{file=null;}
 if(typeof file==='string'&&PROTECTED.test(file))refuse(file);
 return original.apply(this,arguments);
};
const hit=p=>{try{return PROTECTED.test(path.resolve(String(p instanceof URL?p.pathname.replace(/^\/([A-Za-z]:)/,'$1'):p)));}catch{return false;}};
for(const name of ['readFileSync','openSync','createReadStream','readFile','open']){
 const fn=fs[name];if(typeof fn!=='function')continue;
 fs[name]=function(p,...rest){if(hit(p))refuse(p);return fn.call(this,p,...rest);};
}
const pr=fs.promises;for(const name of ['readFile','open']){const fn=pr[name];pr[name]=function(p,...rest){if(hit(p))return Promise.reject((()=>{try{refuse(p);}catch(e){return e;}})());return fn.call(this,p,...rest);};}
process.on('exit',()=>{const cached=Object.keys(require.cache).filter(f=>PROTECTED.test(f));
 process.stderr.write('GUARD protected-in-cache: '+(cached.length?cached.map(f=>path.basename(f)).join(','):'none')+'; refused: '+(asked.size?[...asked].join(','):'none')+'\n');});
