'use strict';
// Independent exact-source custody and literal public review commands. Never CLI the package runner.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..');
assert.match(root.replaceAll('\\','/'),/\/work\/pm-caretaker\/review-b1b2-r2$/);
assert.equal(process.version,'v22.23.2');
const C='c4716edad91453e74ba17f70ab076781ff5367de',M='100820aa47a4f8729642033499eaec0f0ee282e1',R='48a3063a23528ed240eb2356226d237d2793a9da';
const base=path.join(root,'.tmp/er-b1b2-r2'),pub=path.join(base,'public'),results=path.join(base,'results');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(...argv)=>cp.execFileSync('git',argv,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
const safe=p=>{assert(!path.isAbsolute(p)&&!p.includes('..')&&!p.includes('\\'));assert(!/(?:^ledger\/|\/private\/|^src\/history|\/seed\.cjs$|soak)/i.test(p));return p;};
const runtime=['dates','constants','entered-load','performed','plan','progression','sleep','energy','policy','today','volume','migrate','earn','merge','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
const engine8=['dates','plan','policy','progression','sleep','today','volume','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
const lawNames=['analyst-writer-contract','cache-identity','clock-and-as-of','counts-only-guards','evidence-comparability','merge-tie-identity','numeric-values-and-units','receipt-identity','receipt-truth','scalar-per-set-load','state-shape-and-failure','target-and-load-domain','undo-half-effects'];
const publicFiles=['rebuild/engine/test/b2-public-source-faults.test.cjs','rebuild/engine/test/b2-era30.test.cjs','rebuild/m4/workout/native-trend-context.cjs',...runtime,'rebuild/engine/index.cjs','rebuild/engine/test/b1b2-public-engine.cjs','rebuild/engine/test/b1-unknown-recovery.test.cjs','rebuild/engine/test/b1b2-sleep-target-cells.cjs','rebuild/engine/test/b1-delta-cells.cjs','rebuild/lanes/b/b2-delta-cells.cjs','rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','rebuild/conform/v4/postfix/legacy-b1-carriers.cjs','rebuild/m4/spec/b2-inherited-carriers.cjs',...['','-2','-3','-4'].map(n=>'rebuild/engine/test/defect-witnesses'+n+'.cjs'),...lawNames.map(n=>'rebuild/conform/v4/laws-'+n+'.cjs'),'rebuild/conform/v4/helpers.cjs','rebuild/engine/test/writers-reference.cjs'];
const modes={
 'b2-public-faults':['--test','--test-reporter=tap','rebuild/engine/test/b2-public-source-faults.test.cjs'],
 'b2-public-mutations':['rebuild/engine/test/b2-public-source-faults.test.cjs','--audit-mutations'],
 'era30':['--test','--test-reporter=tap','rebuild/engine/test/b2-era30.test.cjs'],
 'era30-mutations':['rebuild/engine/test/b2-era30.test.cjs','--audit-mutations'],
 'unknown-and-target-cells':['--test','--test-reporter=tap','rebuild/engine/test/b1-unknown-recovery.test.cjs','rebuild/engine/test/b1b2-sleep-target-cells.cjs'],
 'b1-delta-cells':['rebuild/engine/test/b1-delta-cells.cjs'],
 'b2-delta-cells':['rebuild/lanes/b/b2-delta-cells.cjs'],
 'combined-legacy':['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs'],
 'repaired-witnesses-1':['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','--witness-1'],
 'repaired-witnesses-3':['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','--witness-3'],
 'repaired-witnesses-4':['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','--witness-4'],
 'public-laws':['rebuild/conform/v4/postfix/legacy-b1b2-carriers.cjs','--public-laws'],
 'current-mutation-audit':['rebuild/engine/test/b1-unknown-recovery.test.cjs','--audit-mutations'],
 'historical-mutation-audit':['rebuild/engine/test/b1-unknown-recovery.test.cjs','--audit-historical-mutations'],
};
function write(target,b){assert(target.startsWith(base+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);}
function verify(){const manifest=JSON.parse(fs.readFileSync(path.join(base,'public-manifest.json')));for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(pub,row.file))),row.sha256,row.file+' restored');assert(!fs.existsSync(path.join(pub,'rebuild/engine/seed.cjs')));assert.deepEqual(fs.readdirSync(path.join(pub,'rebuild/engine')).filter(n=>n.endsWith('.cjs')).sort(),[...runtime.map(p=>path.basename(p)),'index.cjs'].sort());return manifest;}
const action=process.argv[2];
if(action==='stage-tooling'){
 const profile=JSON.parse(git('show',C+':rebuild/lanes/b/tooling/packages/B1-B2.json'));
 assert.equal(Object.keys(profile.product).length,112);
 const extra=['rebuild/lanes/b/tooling/packages/B1-B2.json','rebuild/lanes/b/tooling/b-package.cjs','rebuild/conform/v4/postfix/run.cjs','rebuild/conform/v4/postfix/target.cjs','rebuild/conform/v4/postfix/legacy-gates.cjs','rebuild/conform/v4/postfix/strict-json.cjs','rebuild/conform/v4/postfix/trace-v2.cjs','rebuild/m4/spec/native-carriers-errors.cjs','rebuild/m4/spec/load-write-reference.cjs','rebuild/m4/spec/load-write-source.cjs','rebuild/m4/spec/acceptance-h3-clean-init.json','rebuild/m4/spec/review-h3-clean-init.json',...['','-3','-4'].map(n=>'rebuild/engine/test/defect-witnesses'+n+'.cjs'),profile.brief.file];
 const files=[...new Set([...Object.keys(profile.product).filter(p=>p!=='rebuild/engine/seed.cjs'),...extra])].sort();
 files.forEach(safe);assert(!files.some(p=>p.includes('BUILD-B1B2')||p.endsWith('tooling/README.md')));
 cp.execFileSync('git',['sparse-checkout','add','--stdin'],{cwd:root,input:files.map(p=>'/'+p).join('\n')+'\n',windowsHide:true,stdio:['pipe','pipe','pipe']});
 const rows=files.map(file=>{const b=fs.readFileSync(path.join(root,file));assert(b.equals(git('show',C+':'+file)),file);if(profile.product[file])assert.equal(sha(b),profile.product[file].post,file+' product');return{file,bytes:b.length,sha256:sha(b),custody:profile.product[file]?'profile public hash-only unless separately licensed executable':'tooling dependency/metadata'};});
 assert(!fs.existsSync(path.join(root,'rebuild/engine/seed.cjs')));
 write(path.join(base,'tooling-manifest.json'),JSON.stringify({candidate:C,files:rows},null,2)+'\n');console.log(JSON.stringify({toolingFiles:rows.length,manifestSha256:sha(fs.readFileSync(path.join(base,'tooling-manifest.json'))),seedAbsent:true}));
}else if(action==='stage'){
 assert(!fs.existsSync(pub),'fresh public-copy custody only');
 const files=publicFiles.map(file=>{safe(file);const b=git('show',C+':'+file);write(path.join(pub,file),b);return{file,bytes:b.length,sha256:sha(b),gitBlob:git('rev-parse',C+':'+file).toString().trim()};});
 const identity=engine8.map(file=>({file,equalR:git('show',C+':'+file).equals(git('show',R+':'+file))}));assert(identity.every(r=>r.equalR));
 const manifest={candidate:C,sourceBase:M,runtime:R,scope:'public synthetic only; D7a partial 16-file engine source scan; no seed/private/history/native/FULL execution',files,identity};
 write(path.join(base,'public-manifest.json'),JSON.stringify(manifest,null,2)+'\n');verify();console.log(JSON.stringify({staged:files.length,manifestSha256:sha(fs.readFileSync(path.join(base,'public-manifest.json'))),runtime8Equal:true,publicEngineFiles:16}));
}else if(action==='verify'){verify();console.log('Exact public manifest and all source restoration PASS');}
else{
 let argv=modes[action];
 if(action==='recovery-annex')argv=['--test','--test-reporter=tap',path.join(__dirname,'B1B2-R2-RECOVERY-REVIEW-ANNEX.cjs')];
 if(action==='identity-annex')argv=['--test','--test-reporter=tap',path.join(__dirname,'B1B2-R2-IDENTITY-REVIEW-RUN.cjs')];
 if(action==='today-clearance')argv=['--test','--test-reporter=tap',path.join(__dirname,'B1B2-R2-TODAY-CLEARANCE-REVIEW.cjs')];
 let cwd=pub;
 if(action==='tooling-cohort'){
  const p=JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B1-B2.json')));argv=p.children.find(c=>c.name==='tooling-cohort').argv;assert.deepEqual(argv,['--test','--test-reporter=tap',...['astra-issuer-compatibility','product-phase-and-ledger','seal-tip-and-byte-identity','gate-supersession','pinned-unchanged-and-ruled-substitutions','parent-pin-shapes-and-spec-successors','git-blob-pin-classes','b1b2-registration','superseded-parent-continuity'].map(n=>'rebuild/lanes/b/tooling/test/'+n+'.test.cjs')]);cwd=root;
  const manifest=JSON.parse(fs.readFileSync(path.join(base,'tooling-manifest.json')));for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file+' tooling input');assert(!fs.existsSync(path.join(root,'rebuild/engine/seed.cjs')));
 }
 assert(argv,'closed review mode');verify();
 const temp=path.join(base,'temp');fs.mkdirSync(temp,{recursive:true});fs.mkdirSync(results,{recursive:true});
 const env={...process.env,TZ:'America/New_York',TEMP:temp,TMP:temp,EARNED_REVIEW_ROOT:pub};
 for(const name of Object.keys(env))if(/^(NODE_OPTIONS|NODE_PATH|NODE_V8_COVERAGE|V8_COVERAGE|V8_FLAGS|NODE_TEST_CONTEXT|NODE_TEST_WORKER_ID|MEASURED_TEST_NOW|PL_ENGINE|PL_LAWS_LIB)$/i.test(name))delete env[name];
 const start=new Date().toISOString(),t=performance.now();
 const r=cp.spawnSync(process.execPath,argv,{cwd,env,windowsHide:true,encoding:'utf8',maxBuffer:64*1024*1024});
 write(path.join(results,action+'.stdout.log'),r.stdout||'');write(path.join(results,action+'.stderr.log'),r.stderr||'');
 let restore;try{verify();restore=true;}catch(e){restore=e.message;}
 const row={candidate:C,action,argv,node:process.version,start,durationMs:performance.now()-t,status:r.status,signal:r.signal,error:r.error&&r.error.message,stdoutSha256:sha(r.stdout||''),stderrSha256:sha(r.stderr||''),restored:restore,tail:(r.stdout||'').split(/\r?\n/).slice(-14)};
 write(path.join(results,action+'.json'),JSON.stringify(row,null,2)+'\n');console.log(JSON.stringify(row));assert.equal(restore,true);if(r.error)throw r.error;process.exitCode=r.status===null?1:r.status;
}
