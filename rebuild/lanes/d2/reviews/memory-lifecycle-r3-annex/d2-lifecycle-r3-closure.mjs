import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {build} from 'esbuild';
const root=process.cwd(),rel=p=>path.relative(root,p).replaceAll('\\','/');
const oldModules=new Set(JSON.parse(fs.readFileSync('../d2-memory-lifecycle-r2/.tmp/d2-lifecycle-closure.json')).files.map(f=>f.path));
const identity=JSON.parse(fs.readFileSync('.tmp/d2-lifecycle-r3-identity-before.json'));
const sourceMap=new Map(identity.identities.map(f=>[f.path,f]));
const allowed=new Set([...oldModules,...identity.helpers.map(f=>f.path)]),createRequireCalls=[];
for(const row of identity.identities){
 if(!/\.(mjs|cjs)$/.test(row.path))continue;
 const bytes=fs.readFileSync(row.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256,row.path);
 const text=bytes.toString();
 for(const binding of text.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*createRequire\((.+)\);/g)){
  const name=binding[1],factory=binding[2];let base;
  if(factory==='import.meta.url')base=row.path;
  else if(/^path\.join\(here,\s*['"]\.\.\/\.\.\/w6\/package\.json['"]\)$/.test(factory))base=path.posix.normalize(path.posix.join(path.posix.dirname(row.path),'../../w6/package.json'));
  else throw new Error('UNRESOLVED_CREATE_REQUIRE_BASE '+row.path+' '+factory);
  for(const call of text.matchAll(new RegExp('\\b'+name+'\\(\\s*([\'"])([^\'"]+)\\1\\s*\\)','g'))){
   const specifier=call[2],resolved=specifier.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(base),specifier)):null;
   if(resolved)assert(sourceMap.has(resolved),'UNLICENSED_LITERAL_CREATE_REQUIRE '+resolved);
   createRequireCalls.push({from:row.path,line:text.slice(0,call.index).split('\n').length,binding:name,factory,base,specifier,resolved,executedSource:oldModules.has(row.path),external:!resolved});
  }
 }
}
const supplementalEntries=[...new Set(createRequireCalls.filter(c=>c.executedSource&&c.resolved).map(c=>c.resolved))];
const denied=[],entries=['rebuild/m3/w7-preview/today/test/gym.test.mjs','rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs'];
try{
 const result=await build({absWorkingDir:root,entryPoints:[...entries,...supplementalEntries],outdir:path.join(root,'.tmp/static-closure-only'),bundle:true,platform:'node',format:'esm',target:'node22',packages:'external',write:false,metafile:true,logLevel:'silent',loader:{'.woff2':'dataurl','.txt':'text'},plugins:[{name:'d2-before-read',setup(b){b.onLoad({filter:/.*/},args=>{const file=rel(args.path);if(file.startsWith('../')||!allowed.has(file)){denied.push(file);throw new Error('UNLICENSED_BEFORE_READ '+file);}return undefined;});}}]});
 const files=Object.keys(result.metafile.inputs).map(file=>({path:file.replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex'),imports:result.metafile.inputs[file].imports}));
 const external=[...new Set(files.flatMap(f=>f.imports.filter(i=>i.external).map(i=>i.path)))].sort();
 const addedModules=files.map(f=>f.path).filter(f=>!oldModules.has(f)).sort();assert.deepEqual(addedModules,identity.helpers.map(f=>f.path).sort());
 fs.writeFileSync('.tmp/d2-lifecycle-r3-closure.json',JSON.stringify({entries,supplementalEntries,createRequireCalls,files,addedModules,external,denied,warnings:result.warnings,sourceModulesExecuted:false,metadataOnlyPackageCalls:'playwright-core calls are recorded from already licensed browser-script metadata, not executed or added to the test invocation'},null,2)+'\n');
 console.log(JSON.stringify({moduleInputs:files.length,createRequireCalls:createRequireCalls.length,executedCreateRequireCalls:createRequireCalls.filter(c=>c.executedSource).length,addedModules,external,denied,warnings:result.warnings}));
}catch(error){fs.writeFileSync('.tmp/d2-lifecycle-r3-closure-failed.json',JSON.stringify({denied,error:String(error)},null,2)+'\n');throw error;}
