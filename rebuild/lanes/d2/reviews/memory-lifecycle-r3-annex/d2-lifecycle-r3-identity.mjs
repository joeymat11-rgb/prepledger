import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const head='7e64848dcd1395f26ed3bbbc9e19b9c3e7dce7db',source='4d00498567c5045950c8beb2eebcc4f5c4767984',base='18ff0dcf015193a9b76b83fbbc80fbe888f15d24';
const git=(...a)=>execFileSync('git',a),hash=b=>createHash('sha256').update(b).digest('hex');
const old=JSON.parse(fs.readFileSync('../d2-memory-lifecycle-r2/.tmp/d2-lifecycle-r2-identity-before.json'));
const previous=JSON.parse(fs.readFileSync('../d2-memory-lifecycle-r2/.tmp/MEMORY-LIFECYCLE-R2-EVIDENCE.json'));
const helpers=[
 {path:'rebuild/conform/lib/ops.cjs',bytes:6337,sha256:'cbf7e73cd899492981a03bc4b4153f12a77cc664c4c90c29774ef30bf981d1c1',blob:'6cf0d2f2e51abb37b022010a423647a8f5983ef7',addedByPM290:true},
 {path:'rebuild/conform/lib/canonical.cjs',bytes:2656,sha256:'ca9d5daa7df046be3849ca21e9a21cdf43cbff4fd204246b673ec5621e84f4fa',blob:'de71c53a0df29a31b43d72cb28ebc652ad79eb86',addedByPM290:true}
];
const priorInputs=[...old.identities,...helpers];
assert.equal(hash(fs.readFileSync('../d2-memory-lifecycle-r2/.tmp/MEMORY-LIFECYCLE-R2-EVIDENCE.json')),'794da652052935ccd8b7191ef131c75eb00923be36b8fff2c0f1025b728db9a6');
assert.equal(git('rev-parse','HEAD').toString().trim(),head);assert.equal(git('status','--porcelain=v1').toString().trim(),'');
assert.equal(git('rev-parse',head+':rebuild/m3').toString(),git('rev-parse',source+':rebuild/m3').toString());
assert.equal(git('rev-parse',head+':rebuild/engine').toString(),git('rev-parse',base+':rebuild/engine').toString());
const root='rebuild/m3/w7-preview/today/',changed=[root+'gym-app.mjs',root+'test/machine-settings-ui.test.mjs'],report='rebuild/lanes/c/MEMORY-LIFECYCLE-FOUNDATION-R3-REPORT.md';
assert.deepEqual(git('diff','--name-only',base,head).toString().trim().split(/\r?\n/).sort(),[...changed,report].sort());
assert.deepEqual(git('diff','--name-only',source,head).toString().trim().split(/\r?\n/),[report]);
const expectedBlobs=['0722c9acf18d38c3e42598b11508de7448f136b5','2af570fe09b69f66897a10b9af9dd48df4648885'];
for(const [i,file]of changed.entries())assert.equal(git('rev-parse',head+':'+file).toString().trim(),expectedBlobs[i]);
const actualPaths=git('ls-files','-t').toString().trim().split(/\r?\n/).filter(l=>!l.startsWith('S ')).map(l=>l.slice(2)).sort();
assert.deepEqual(actualPaths,[...priorInputs.map(f=>f.path),'.gitattributes','.gitignore'].sort());
for(const denied of ['ledger/state.json','src/history.js','rebuild/conform/private',report])assert.equal(fs.existsSync(denied),false);
const identities=priorInputs.map(row=>{const bytes=fs.readFileSync(row.path),sha256=hash(bytes);assert.equal(hash(git('show',base+':'+row.path)),row.sha256,row.path+' prior identity');assert(bytes.equals(git('show',head+':'+row.path)));assert(bytes.equals(git('show',source+':'+row.path)));if(!changed.includes(row.path))assert.equal(sha256,row.sha256,row.path+' unauthorized delta');return{path:row.path,bytes:bytes.length,sha256,priorSHA256:row.sha256,gitDiskEqual:true,baseEqual:sha256===row.sha256,priorInventory:row.addedByPM290?'PM290 helper grant, absent from prior134 inventory':'R2 verified input inventory'};});
for(const helper of helpers)for(const revision of [head,source,base,'1316639e71cc8b23b24570bb6aa0e7508da90032'])assert.equal(git('rev-parse',revision+':'+helper.path).toString().trim(),helper.blob);
const replays=['d2-lifecycle-extra.test.mjs','d2-lifecycle-r2-edges.test.mjs','d2-lifecycle-r2-support.mjs'].map(name=>{const row=previous.files.find(f=>f.path==='.tmp/'+name);assert(row);assert.equal(hash(fs.readFileSync('.tmp/'+name)),row.sha256,name);return{name,sha256:row.sha256,bytes:row.bytes};});
const out={head,source,base,changed,changedBlobs:expectedBlobs,identities,nonModuleReads:old.nonModuleReads,replays,helpers,helperGrant:'ee6bdec136e880898063640c8b7b50e49b7b7d95 / PM290',materializedTracked:actualPaths.length,protectedAndAuthorAbsent:true,builderReportUnread:true,clean:true,m3Tree:git('rev-parse',head+':rebuild/m3').toString().trim(),engineTree:git('rev-parse',head+':rebuild/engine').toString().trim(),setupDisclosureSHA256:hash(fs.readFileSync('.tmp/d2-lifecycle-r3-setup-disclosure.json')),priorClosureQualification:'The old109 parsed/134 tracked inventories omit the two literal createRequire helpers. They are incomplete runtime inventories; earlier functional outcomes remain at their original heads without retroactive complete-custody claims.'};
fs.writeFileSync('.tmp/d2-lifecycle-r3-identity-'+(process.argv[2]||'before')+'.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({head,source,trackedInputs:identities.length,materializedTracked:actualPaths.length,changed:identities.filter(f=>!f.baseEqual).map(f=>({path:f.path,sha256:f.sha256})),replays,clean:true,protectedAndAuthorAbsent:true}));
