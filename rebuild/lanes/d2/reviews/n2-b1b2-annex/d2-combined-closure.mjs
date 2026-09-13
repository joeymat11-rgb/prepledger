import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {build} from 'esbuild';
const root=process.cwd(),rel=p=>path.relative(root,p).replaceAll('\\','/');
const deny=[/^ledger\//,/^rebuild\/conform\/private\//,/^src\/history\.js$/,/^rebuild\/soak\//,/^rebuild\/engine\/(seed|index|migrate|merge)\.cjs$/,/^rebuild\/m4\/workout\/engine-runtime\.cjs$/,/^rebuild\/lanes\/b\/BUILD-B1B2-TOOLING-154-184\.md$/];
const bad=[],seen=new Set();
const guard=absolute=>{const file=rel(absolute);if(file.startsWith('../')||deny.some(re=>re.test(file))){bad.push(file);throw new Error('UNLICENSED_DEPENDENCY_BEFORE_READ '+file);}return file;};
const entries=['rebuild/m3/w7-preview/today/test/sleep.test.mjs','rebuild/m3/w7-preview/today/today-entry.mjs','rebuild/m3/w7-preview/today/sleep-check.mjs'];
try{
 const result=await build({absWorkingDir:root,entryPoints:entries,outdir:path.join(root,'.tmp/closure-only'),bundle:true,platform:'node',format:'esm',target:'node22',packages:'external',write:false,metafile:true,logLevel:'silent',loader:{'.woff2':'dataurl','.txt':'text'},plugins:[{name:'d2-public-before-read',setup(builder){
  builder.onResolve({filter:/^\/app\.js$/},args=>{if(rel(args.importer)!=='rebuild/m3/w7-preview/today/sleep-check.mjs')throw new Error('unexpected browser artifact importer');return{path:args.path,external:true};});
  builder.onLoad({filter:/.*/},args=>{seen.add(guard(args.path));return undefined;});
 }}]});
 const files=Object.keys(result.metafile.inputs).map(file=>({path:file.replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),imports:result.metafile.inputs[file].imports}));
 const external=[...new Set(files.flatMap(f=>f.imports.filter(i=>i.external).map(i=>i.path)))].sort();
 const summary={entries,files,external,browserArtifact:'/app.js is imported only inside sleep-check page.evaluate; requires fresh own served build',warnings:result.warnings.map(w=>({id:w.id,text:w.text,location:w.location})),beforeReadDenied:bad,sourceModulesLoadedOrExecuted:false};
 fs.writeFileSync('.tmp/d2-combined-closure.json',JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify({files:files.length,external,warnings:summary.warnings,beforeReadDenied:bad}));
}catch(error){fs.writeFileSync('.tmp/d2-combined-closure-failed.json',JSON.stringify({beforeReadDenied:bad,error:String(error)},null,2)+'\n');throw error;}
