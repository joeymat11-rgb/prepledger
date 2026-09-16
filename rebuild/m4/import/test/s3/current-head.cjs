'use strict';
// Test-process boundary: one verified current scratch tree; never a retained checkout.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),{createHash}=require('node:crypto');
const {fileURLToPath}=require('node:url');
const root=path.resolve(__dirname,'../../../../..'),run=path.dirname(root);
const hash=b=>createHash('sha256').update(b).digest('hex');
const same=(a,b)=>process.platform==='win32'?a.toLowerCase()===b.toLowerCase():a===b;
const inside=(a,b)=>{const r=path.relative(a,b);return r===''||(!path.isAbsolute(r)&&r!=='..'&&!r.startsWith('..'+path.sep));};
function fail(code){const e=new Error(code);e.code=code;throw e;}
if(!/^22\./.test(process.versions.node))fail('S3_NODE22_REQUIRED');
if(!process.env.S3_SCRATCH||!same(path.resolve(process.env.S3_SCRATCH),root)||!same(fs.realpathSync.native(root),root)||path.basename(root)!=='tree')fail('S3_CURRENT_SCRATCH_REQUIRED');
for(const name of ['PERFORMED_W6_DIR','EARNED_READING_W6_ROOT','EARNED_SOURCE_R1_ROOT','W6_PLAYWRIGHT_DIR'])if(process.env[name])fail('S3_RETAINED_ENV_REFUSED');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'rebuild/m4/import/test/s3/s3-portable-sources.json'),'utf8'));
if(manifest.profile!=='earned/s3-provisional-public-sources/v1'||!Array.isArray(manifest.sources)||!manifest.sources.length)fail('S3_MANIFEST_INVALID');
const entries=new Map(manifest.sources.map(e=>[e.path,e]));if(entries.size!==manifest.sources.length)fail('S3_MANIFEST_INVALID');
let mutation=null;if(process.env.S3_MUTATION){mutation=JSON.parse(process.env.S3_MUTATION);const e=entries.get(mutation.path);if(!e||mutation.original_sha256!==e.sha256||!/^[a-f0-9]{64}$/.test(mutation.sha256)||!manifest.mutationTargets?.includes(mutation.path))fail('S3_MUTATION_UNREGISTERED');}
for(const [name,e]of entries){const file=path.resolve(root,name);if(!inside(root,file)||!same(fs.realpathSync.native(file),file))fail('S3_SOURCE_ESCAPE');const expected=mutation?.path===name?mutation.sha256:e.sha256;if(hash(fs.readFileSync(file))!==expected)fail('S3_SOURCE_DRIFT');}
const original=Module._resolveFilename;
function checkedFile(file){
 const absolute=path.resolve(file),real=fs.realpathSync.native(absolute),relative=path.relative(root,absolute).split(path.sep).join('/');
 if(entries.has(relative)&&same(absolute,real)){
  const expected=mutation?.path===relative?mutation.sha256:entries.get(relative).sha256;
  if(hash(fs.readFileSync(real))!==expected)fail('S3_SOURCE_DRIFT');
  return;
 }
 if(inside(run,real)&&real.split(path.sep).includes('node_modules'))return;
 fail('S3_UNLISTED_MODULE');
}
Module._resolveFilename=function(request,parent,isMain,options){
 const result=original.call(this,request,parent,isMain,options);
 if(typeof result!=='string'||Module.builtinModules.includes(result)||result.startsWith('node:'))return result;
 checkedFile(result);return result;
};
// Node22 synchronous hooks cover ESM entry points, side effects and computed
// imports in this same realm. No async loader, extra path or foreign tree.
if(typeof Module.registerHooks!=='function')fail('S3_NODE_MODULE_HOOKS_REQUIRED');
function checkedURL(url){
 if(url.startsWith('node:'))return;
 if(!url.startsWith('file:'))fail('S3_UNLISTED_MODULE');
 checkedFile(fileURLToPath(url));
}
Module.registerHooks({
 resolve(specifier,context,nextResolve){const result=nextResolve(specifier,context);checkedURL(result.url);return result;},
 load(url,context,nextLoad){checkedURL(url);return nextLoad(url,context);}
});
module.exports=Object.freeze({root,run,manifestProfile:manifest.profile});
