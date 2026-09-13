import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const head='1316639e71cc8b23b24570bb6aa0e7508da90032',source='aec118c4c23eb55e32e29ffdf8be60cfb30f28d0',base='0c744cbd2d53c3be738320f726004a4e1871cce5';
const git=(...args)=>execFileSync('git',args), hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(git('rev-parse','HEAD').toString().trim(),head);assert.equal(git('status','--porcelain=v1').toString().trim(),'');
const root='rebuild/m3/w7-preview/today/';
const owned=['gym-model.mjs','gym-app.mjs','test/gym.test.mjs','test/machine-settings-ui.test.mjs'].map(f=>root+f);
const expectedBlobs=['02e2c55b5801e07387d2d626fab3277e2dd46961','fd855931864b15c18697d281af5fd7a418a7481a','5cb0ff9b2f3382b3b84907dd17d2a1354531671c','20c93f76210a02fc7e0f6c250dd60c95a53ad002'];
owned.forEach((file,i)=>{assert.equal(git('rev-parse',base+':'+file).toString().trim(),expectedBlobs[i]);assert(git('show',head+':'+file).equals(git('show',source+':'+file)));});
const closure=JSON.parse(fs.readFileSync('.tmp/d2-lifecycle-closure.json'));
const extra=['package.json','package-lock.json','rebuild/m3/w6/package.json','rebuild/m3/w6/pnpm-lock.yaml','rebuild/m3/w5/package.json','rebuild/m3/w5/pnpm-lock.yaml','rebuild/m3/w6/cipher-imports.json','rebuild/m3/w6/test/local-today-journey.test.mjs','rebuild/lanes/b/tooling/packages/B-NTC.json','rebuild/m4/workout/fonts/SOURCES.json','rebuild/m4/workout/fonts/InstrumentSans-Variable.woff2','rebuild/m4/workout/fonts/InstrumentSerif-Regular.woff2','rebuild/m1/approved-2026-09-08/Earned-refinement-A.html','rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html',root+'index.shell.html',root+'screens.template.html',root+'preview.css',...fs.readdirSync(root).filter(f=>/\.(cjs|mjs)$/.test(f)).map(f=>root+f)];
const paths=[...new Set([...closure.files.map(f=>f.path),...extra])].sort();
const deny=/^(ledger\/|src\/history\.js$|rebuild\/(conform\/private\/|soak\/|engine\/(seed|index|migrate|merge)\.cjs$|m4\/workout\/engine-runtime\.cjs$|lanes\/c\/MEMORY-LIFECYCLE-FOUNDATION-REPORT\.md$))/;
const tracked=new Set(git('ls-files','--',...paths).toString().trim().split(/\r?\n/));
const identities=paths.map(file=>{
 assert(!deny.test(file)&&!file.startsWith('../'),'UNLICENSED_BEFORE_READ '+file);
 const bytes=fs.readFileSync(file),sha256=hash(bytes);let baseEqual=null;
 if(tracked.has(file)){assert(bytes.equals(git('show',head+':'+file)),file+' Git/disk');assert(bytes.equals(git('show',source+':'+file)),file+' source');baseEqual=bytes.equals(git('show',base+':'+file));if(!owned.includes(file))assert(baseEqual,file+' outside licensed changes');}
 return{path:file,bytes:bytes.length,sha256,gitDiskEqual:tracked.has(file),baseEqual};
});
for(const f of closure.files)assert.equal(identities.find(x=>x.path===f.path).sha256,f.sha256);
const result={head,source,base,reviewer:'Lane D2',builderReportUnread:true,node:process.version,tz:Intl.DateTimeFormat().resolvedOptions().timeZone,owned,expectedBlobs,moduleInputs:closure.files.length,nonModuleReads:extra,identities,clean:true,productCodeExecuted:false};
const phase=process.argv[2]||'before';
fs.writeFileSync('.tmp/d2-lifecycle-identity-'+phase+'.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({head,source,phase,identities:identities.length,tracked:identities.filter(x=>x.gitDiskEqual).length,modules:closure.files.length,baseChanged:identities.filter(x=>x.baseEqual===false).map(x=>x.path),clean:true}));
