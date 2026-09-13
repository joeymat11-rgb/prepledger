import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash, randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const ownFile=fileURLToPath(import.meta.url);
export const ROOT=path.resolve(path.dirname(ownFile),'../../../../..');
export const MANIFEST='rebuild/m4/spec/s3-portable-sources.json';
const NODE_TEST=['--require','./rebuild/m4/import/test/s3/current-head.cjs','--test','--test-reporter=tap'];
export const CORE_TESTS=['rebuild/m3/w6/test/local-source-admission.test.mjs','rebuild/m3/w6/test/local-source-commit.test.mjs','rebuild/m4/import/test/local-source-order.test.cjs','rebuild/m4/import/test/browser-parity.test.mjs','rebuild/m4/import/test/s3/harness.test.mjs','rebuild/m4/import/test/engine-provider.test.cjs'];
export const IMPORT_TESTS=['rebuild/m4/import/test/prepare.test.cjs','rebuild/m4/import/test/reading-replay.test.cjs'];
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifiedBrowser(file){
 if(typeof file!=='string'||!file||!path.isAbsolute(file)||!fs.existsSync(file)||!fs.statSync(file).isFile())refusal('S3_BROWSER_UNAVAILABLE');
 return Object.freeze({path:fs.realpathSync.native(file),sha256:sha256(fs.readFileSync(file))});
}
export function refusal(code,detail=''){const e=new Error(code+(detail?' '+detail:''));e.code=code;throw e;}
function equalPath(a,b){return process.platform==='win32'?a.toLowerCase()===b.toLowerCase():a===b;}
export function contained(base,target){
 const b=path.resolve(base),t=path.resolve(target),r=path.relative(b,t);
 if(r==='..'||r.startsWith('..'+path.sep)||path.isAbsolute(r))refusal('S3_ROOT_ESCAPE');
 let probe=t;while(!fs.existsSync(probe)){const next=path.dirname(probe);if(next===probe)refusal('S3_ROOT_MISSING');probe=next;}
 const real=fs.realpathSync.native(probe);if(!equalPath(real,probe))refusal('S3_REPARSE_ESCAPE');
 return t;
}
export function safeRelative(name){
 if(typeof name!=='string'||!name||name.includes('\\')||/^[A-Za-z]:/.test(name)||path.posix.isAbsolute(name)||name.split('/').some(x=>!x||x==='.'||x==='..'))refusal('S3_SOURCE_PATH');
 if(/(^|\/)(node_modules|ledger|private|engines)(\/|$)/.test(name)||/^src\//.test(name)||/^tools\//.test(name)||/rebuild\/engine\/(seed|index|oracle-shim)\.cjs$/.test(name))refusal('S3_FORBIDDEN_SOURCE');
 return name;
}
export function readManifest(root=ROOT){
 const value=JSON.parse(fs.readFileSync(contained(root,path.join(root,MANIFEST)),'utf8'));
 if(value.profile!=='earned/s3-provisional-public-sources/v1'||!Array.isArray(value.sources)||!value.sources.length)refusal('S3_MANIFEST_INVALID');
 const names=new Set();for(const entry of value.sources){safeRelative(entry.path);if(names.has(entry.path)||!/^[0-9a-f]{64}$/.test(entry.sha256))refusal('S3_MANIFEST_INVALID');names.add(entry.path);}
 return value;
}
export function verifySources(root,manifest,{extra=false}={}){
 const expected=new Set([MANIFEST,...manifest.sources.map(e=>e.path)]);
 for(const entry of manifest.sources){const file=contained(root,path.join(root,entry.path));if(!fs.existsSync(file))refusal('S3_SOURCE_MISSING',entry.path);if(sha256(fs.readFileSync(file))!==entry.sha256)refusal('S3_SOURCE_DRIFT',entry.path);}
 if(extra){const visit=dir=>{for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.tmp'].includes(ent.name))continue;const file=contained(root,path.join(dir,ent.name));if(ent.isDirectory())visit(file);else{const rel=path.relative(root,file).split(path.sep).join('/');if(!expected.has(rel))refusal('S3_SOURCE_EXTRA',rel);}}};visit(root);}
 return manifest.sources.length;
}
export function inspectStaticEdges(root,manifest){
 const names=new Set(manifest.sources.map(e=>e.path)),deferred=new Set(manifest.deferredRedSources||[]),edges=[];
 for(const entry of manifest.sources){if(!/\.(cjs|mjs|js)$/.test(entry.path))continue;const text=fs.readFileSync(path.join(root,entry.path),'utf8');
  const patterns=[/\brequire\s*\(\s*(['"])([^'"\n]+)\1\s*\)/g,/\bfrom\s+(['"])([^'"\n]+)\1/g,/\bimport\s*\(\s*(['"])([^'"\n]+)\1\s*\)/g];
  for(const re of patterns)for(const hit of text.matchAll(re)){const spec=hit[2];if(!spec.startsWith('.'))continue;
   const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(entry.path),spec));safeRelative(resolved);
   if(!names.has(resolved)&&!deferred.has(resolved))refusal('S3_UNLISTED_EDGE',entry.path+' -> '+resolved);
   edges.push([entry.path,resolved]);
  }
 }
 return edges;
}
export function tapSummary(log,status){
 const number=key=>{const m=[...log.matchAll(new RegExp('^# '+key+' ([0-9]+)$','gm'))];return m.length?Number(m.at(-1)[1]):null;};
 const value={tests:number('tests'),pass:number('pass'),fail:number('fail'),skipped:number('skipped'),cancelled:number('cancelled'),status};
 if(value.tests===null||value.tests<=0||value.pass===null||value.fail===null||value.skipped!==0||value.cancelled!==0)refusal('S3_TEST_ACCOUNTING');
 if(status!==0||value.fail!==0||value.pass!==value.tests)refusal('S3_TEST_FAILED');
 return value;
}
export function suiteInventory(root,files,log,total){
 const seen=new Set(),inventory=[];
 for(const file of files){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  const names=[...text.matchAll(/^\s*test\(\s*(['"])((?:\\.|(?!\1)[^\\\n])*)\1\s*,/gm)].map(m=>m[2].replace(/\\(['"\\])/g,'$1'));
  if(!names.length)refusal('S3_FILE_ZERO_CELLS',file);
  for(const name of names){if(seen.has(name))refusal('S3_DUPLICATE_CELL',name);seen.add(name);
   const hits=log.split(/\r?\n/).filter(line=>/^ok [0-9]+ - /.test(line)&&line.replace(/^ok [0-9]+ - /,'')===name);
   if(hits.length!==1)refusal('S3_CELL_NOT_EXECUTED',file+' '+name);
  }
  inventory.push({file,sha256:sha256(text),discovered:names.length,executed:names.length,names});
 }
 if(inventory.reduce((n,f)=>n+f.executed,0)!==total.tests)refusal('S3_CELL_TOTAL_MISMATCH');
 return inventory;
}
export function mutantSummary(log,status,name){
 if(status!==1||!log.includes('ERR_ASSERTION')||!log.includes(name)||!/not ok /.test(log)||/SyntaxError|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND|ERR_UNKNOWN_FILE_EXTENSION/.test(log))refusal('S3_MUTANT_NOT_ASSERTION',name);
 return {name,assertion:true,status};
}
function toolVersions(toolchain){
 for(const k of ['node','npm','pnpm'])if(!toolchain[k]||!fs.existsSync(toolchain[k]))refusal('S3_TOOL_MISSING',k);
 const call=args=>{const p=spawnSync(toolchain.node,args,{encoding:'utf8',windowsHide:true});if(p.error||p.status!==0)refusal('S3_TOOL_UNAVAILABLE');return p.stdout.trim();};
 const versions={node:call(['--version']),npm:call([toolchain.npm,'--version']),pnpm:call([toolchain.pnpm,'--version'])};
 if(!/^v22\./.test(versions.node)||!/^9\./.test(versions.pnpm))refusal('S3_TOOL_VERSION');
 return versions;
}
function scratchEnvironment(run,toolchain){
 const env={...process.env,NODE_ENV:'development',TEMP:path.join(run,'temp'),TMP:path.join(run,'temp'),npm_config_cache:path.join(run,'cache'),npm_config_userconfig:path.join(run,'npmrc'),PNPM_HOME:path.join(run,'pnpm-home'),S3_SCRATCH:path.join(run,'tree'),S3_RUN_ROOT:run};
 for(const k of ['NODE_OPTIONS','W6_PLAYWRIGHT_DIR','PERFORMED_W6_DIR','EARNED_READING_W6_ROOT','EARNED_SOURCE_R1_ROOT','IMPORT_PREPARATION_MODULE','EARNED_REPLAY_CANDIDATE','S3_MUTATION'])delete env[k];
 const key=Object.keys(env).find(k=>k.toLowerCase()==='path')||'PATH';env[key]=path.dirname(toolchain.node)+path.delimiter+(env[key]||'');
 env.TZ='America/New_York';return env;
}
export function prepareScratch(root,manifest,{id=randomUUID(),toolchain}={}){
 if(!/^[a-zA-Z0-9-]+$/.test(id))refusal('S3_RUN_ID');
 verifySources(root,manifest);inspectStaticEdges(root,manifest);
 const base=contained(root,path.join(root,'.tmp','s3'));fs.mkdirSync(base,{recursive:true});
 const run=contained(base,path.join(base,id));fs.mkdirSync(run,{recursive:false});
 for(const name of ['tree','temp','cache','store','logs','browser-profile','pnpm-home'])fs.mkdirSync(path.join(run,name));
 fs.writeFileSync(path.join(run,'npmrc'),'');
 const tree=path.join(run,'tree');
 for(const entry of manifest.sources){const target=contained(tree,path.join(tree,entry.path));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,entry.path),target);}
 const manifestTarget=path.join(tree,MANIFEST);fs.mkdirSync(path.dirname(manifestTarget),{recursive:true});fs.writeFileSync(manifestTarget,JSON.stringify(manifest,null,2)+'\n');
 verifySources(tree,manifest,{extra:true});
 const record={profile:'earned/s3-scratch-run/v1',run,tree,sourceRoot:root,sourceManifest:sha256(JSON.stringify(manifest)),toolchain,versions:toolVersions(toolchain),installed:false};
 fs.writeFileSync(path.join(run,'run.json'),JSON.stringify(record,null,2)+'\n');return record;
}
function child(record,args,label,{cwd=record.tree,env={}}={}){
 contained(record.run,cwd);const logFile=path.join(record.run,'logs',label+'.log');
 const result=spawnSync(record.toolchain.node,args,{cwd,env:{...scratchEnvironment(record.run,record.toolchain),...env},windowsHide:true,encoding:'utf8',timeout:600000,maxBuffer:24*1024*1024});
 fs.writeFileSync(logFile,(result.stdout||'')+(result.stderr||''));if(result.error)refusal('S3_CHILD_UNAVAILABLE',label);
 return {status:result.status,log:(result.stdout||'')+(result.stderr||''),logFile};
}
export function setup(root,manifest,toolchain){
 const record=prepareScratch(root,manifest,{toolchain});
 const jobs=[
  [record.tree,[toolchain.npm,'ci','--no-audit','--no-fund','--include=dev'],'install-root'],
  [path.join(record.tree,'rebuild/m3/w6'),[toolchain.pnpm,'install','--frozen-lockfile','--prod=false','--store-dir',path.join(record.run,'store')],'install-w6'],
  [path.join(record.tree,'rebuild/m3/w5'),[toolchain.pnpm,'install','--frozen-lockfile','--prod=false','--ignore-scripts','--ignore-workspace','--store-dir',path.join(record.run,'store')],'install-w5']
 ];
 for(const [cwd,args,name]of jobs){const result=child(record,args,name,{cwd});if(result.status!==0)refusal('S3_SETUP_FAILED',result.logFile);verifySources(record.tree,manifest);}
 record.installed=true;fs.writeFileSync(path.join(record.run,'run.json'),JSON.stringify(record,null,2)+'\n');
 console.log('S3 SETUP '+record.run+' '+JSON.stringify(record.versions));return record;
}
export function loadRun(run){
 const base=contained(ROOT,path.join(ROOT,'.tmp','s3'));contained(base,run);
 const record=JSON.parse(fs.readFileSync(path.join(run,'run.json'),'utf8'));if(record.run!==run||!record.installed||!equalPath(record.sourceRoot,ROOT))refusal('S3_RUN_INVALID');
 contained(run,record.tree);verifySources(record.tree,readManifest(record.tree));return record;
}
export function dispatch(record,mode){
 const manifest=readManifest(record.tree);verifySources(record.tree,manifest);
 if(['suite-new','suite-workout','mutations','browser-real-c2'].includes(mode))refusal('S3_PHASE_DEPENDENCY_BLOCKED',mode);
 const suites={'suite-core':CORE_TESTS,'suite-import':IMPORT_TESTS,'suite-provider':CORE_TESTS.filter(f=>!f.startsWith('rebuild/m3/w6/test/')),'red-core':CORE_TESTS.filter(f=>!f.endsWith('/harness.test.mjs'))};
 if(suites[mode]){
  for(const file of suites[mode])if(!manifest.sources.some(e=>e.path===file))refusal('S3_SOURCE_MISSING',file);
  const r=child(record,[...NODE_TEST,...suites[mode]],mode);
  if(mode==='red-core'){if(r.status!==1||!r.log.includes('ERR_ASSERTION')||/MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND|SyntaxError/.test(r.log))refusal('S3_RED_NOT_ASSERTION');console.log('S3 RED ASSERTIONS '+r.logFile);}
  else {const total=tapSummary(r.log,r.status),inventory=suiteInventory(record.tree,suites[mode],r.log,total);
   fs.writeFileSync(path.join(record.run,mode+'-inventory.json'),JSON.stringify({total,files:inventory},null,2)+'\n');
   console.log('S3 '+mode+' '+JSON.stringify(total)+' '+r.logFile);}
  verifySources(record.tree,manifest);return;
 }
 if(mode==='mutations-core'){
  for(const [i,file]of ['rebuild/m4/import/test/mutations.cjs','rebuild/m4/import/test/reading-replay-faults.cjs','rebuild/m4/import/test/s3/mutations.cjs'].entries()){
   const r=child(record,['--require','./rebuild/m4/import/test/s3/current-head.cjs',file,...(i===2?['--core']:[])],'mutations-core-'+i);
   if(r.status!==0||!r.log.includes('RESTORED PASS'))refusal('S3_MUTATION_PROGRAM_FAILED',r.logFile);
   verifySources(record.tree,manifest);console.log('S3 MUTATIONS RESTORED '+r.logFile);
  }return;
 }
 if(mode==='browser-core'){
  const r=child(record,['rebuild/m3/w6/test/local-source-browser.mjs','--core'],'browser-core',{env:{W6_BROWSER_BIN:process.env.W6_BROWSER_BIN||''}});
  if(r.status!==0||!r.log.includes('PORTABLE ONLY'))refusal('S3_BROWSER_FAILED',r.logFile);
  console.log('S3 BROWSER PORTABLE ONLY '+r.logFile);verifySources(record.tree,manifest);return;
 }
 refusal('S3_MODE_UNSUPPORTED',mode);
}
if(process.argv[1]&&equalPath(path.resolve(process.argv[1]),ownFile)){
 try{const mode=process.argv[2];if(mode==='setup')setup(ROOT,readManifest(ROOT),{node:process.execPath,npm:process.env.S3_NPM_CLI,pnpm:process.env.S3_PNPM_CLI});
  else dispatch(loadRun(path.resolve(process.argv[3]||'')),mode);
 }catch(error){console.error('S3 BLOCKED '+(error.code||'S3_FAILURE')+' '+error.message);process.exitCode=2;}
}
