import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {build} from 'esbuild';
const root=process.cwd(),rel=p=>path.relative(root,p).replaceAll('\\','/');
const allowed=new Set(JSON.parse(fs.readFileSync('../d2-memory-lifecycle-r2/.tmp/d2-lifecycle-closure.json')).files.map(f=>f.path));
const denied=[],entries=['rebuild/m3/w7-preview/today/test/gym.test.mjs','rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs'];
try{
 const result=await build({absWorkingDir:root,entryPoints:entries,outdir:path.join(root,'.tmp/static-closure-only'),bundle:true,platform:'node',format:'esm',target:'node22',packages:'external',write:false,metafile:true,logLevel:'silent',loader:{'.woff2':'dataurl','.txt':'text'},plugins:[{name:'d2-before-read',setup(b){b.onLoad({filter:/.*/},args=>{const file=rel(args.path);if(file.startsWith('../')||!allowed.has(file)){denied.push(file);throw new Error('UNLICENSED_BEFORE_READ '+file);}return undefined;});}}]});
 const files=Object.keys(result.metafile.inputs).map(file=>({path:file.replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex'),imports:result.metafile.inputs[file].imports}));
 const external=[...new Set(files.flatMap(f=>f.imports.filter(i=>i.external).map(i=>i.path)))].sort();
 fs.writeFileSync('.tmp/d2-lifecycle-r3-closure.json',JSON.stringify({entries,files,external,denied,warnings:result.warnings,sourceModulesExecuted:false},null,2)+'\n');
 console.log(JSON.stringify({moduleInputs:files.length,external,denied,warnings:result.warnings}));
}catch(error){fs.writeFileSync('.tmp/d2-lifecycle-r3-closure-failed.json',JSON.stringify({denied,error:String(error)},null,2)+'\n');throw error;}
