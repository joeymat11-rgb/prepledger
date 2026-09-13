'use strict';
// Each intentional source reversal must lose the named refusal assertion;
// a separately created restored fixture must then pass that identical assertion.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-binding'),results=path.join(base,'results');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),manifest=JSON.parse(fs.readFileSync(path.join(base,'initial-public-inputs.json')));
const ids=['fixed-admission','shared-chain','document-bytes','receipt-context','reviewed-pin-override','authorized-ci-head','full-entry-head'];
assert.equal(process.version,'v22.23.2');assert.equal(sha(fs.readFileSync(process.execPath)),'0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4');
function verify(){for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file);for(const file of ['rebuild/engine/seed.cjs','rebuild/lanes/b/BUILD-B1B2-AMENDMENT-BINDING.md','rebuild/lanes/b/tooling/README.md'])assert(!fs.existsSync(path.join(root,file)),file+' remains unread/unmaterialized');}
const only=process.argv[2]||null;assert(!only||ids.includes(only));fs.mkdirSync(results,{recursive:true});
for(const id of ids.filter(x=>!only||x===only))for(const variant of ['fault','restored']){
 verify();const action=variant+'-'+id,env={...process.env,TZ:'America/New_York',TEMP:path.join(base,'temp'),TMP:path.join(base,'temp')};
 for(const key of Object.keys(env))if(/^(NODE_OPTIONS|NODE_PATH|NODE_V8_COVERAGE|V8_COVERAGE|V8_FLAGS|NODE_TEST_CONTEXT|NODE_TEST_WORKER_ID|MEASURED_TEST_NOW|PL_ENGINE|PL_LAWS_LIB|ER_BINDING_CASE|ER_BINDING_FAULT)$/i.test(key))delete env[key];
 env.ER_BINDING_CASE=id;if(variant==='fault')env.ER_BINDING_FAULT=id;
 const argv=['--test','--test-reporter=tap','rebuild/lanes/b/reviews/B1B2-AMENDMENT-BINDING-ANNEX.cjs'],expectedStatus=variant==='fault'?1:0,start=new Date().toISOString(),time=performance.now();
 const saved=path.join(results,action+'.json'),previous=fs.existsSync(saved)?JSON.parse(fs.readFileSync(saved)):null;
 if(previous){assert.equal(previous.id,id);assert.equal(previous.variant,variant);assert.equal(previous.annexSHA256,sha(fs.readFileSync(path.join(__dirname,'B1B2-AMENDMENT-BINDING-ANNEX.cjs'))));assert.deepEqual(previous.argv,argv);}
 const r=previous?{...previous,stdout:fs.readFileSync(path.join(results,action+'.stdout.log'),'utf8'),stderr:fs.readFileSync(path.join(results,action+'.stderr.log'),'utf8')}:cp.spawnSync(process.execPath,argv,{cwd:root,env,windowsHide:true,maxBuffer:4*1024*1024,encoding:'utf8'}),stdout=r.stdout||'',stderr=r.stderr||'';
 if(previous){assert.equal(sha(stdout),previous.stdoutSHA256);assert.equal(sha(stderr),previous.stderrSHA256);}
 fs.writeFileSync(path.join(results,action+'.stdout.log'),stdout);fs.writeFileSync(path.join(results,action+'.stderr.log'),stderr);
 let restored;try{verify();restored=true;}catch(e){restored=e.message;}
 const result=previous||{candidate:'083bd47efc16d02105b3ebe2912bcf5aa4a5f240',action,id,variant,node:process.version,nodeSHA256:sha(fs.readFileSync(process.execPath)),timezone:env.TZ,argv,selection:{ER_BINDING_CASE:id,ER_BINDING_FAULT:env.ER_BINDING_FAULT||null},start,durationMs:performance.now()-time,status:r.status,expectedStatus,signal:r.signal,error:r.error&&r.error.message,stdoutSHA256:sha(stdout),stderrSHA256:sha(stderr),restored,annexSHA256:sha(fs.readFileSync(path.join(__dirname,'B1B2-AMENDMENT-BINDING-ANNEX.cjs'))),tail:stdout.split(/\r?\n/).slice(-12)};
 if(!previous)fs.writeFileSync(path.join(results,action+'.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,reusedPreviouslyExecuted:!!previous}));
 assert.equal(restored,true);if(r.error)throw r.error;assert.equal(r.signal,null);assert.equal(r.status,expectedStatus,action+' raw process status');assert.match(stdout,/# tests 1\r?\n/);assert.match(stdout,/# skipped 0\r?\n/);assert.match(stdout,/# cancelled 0\r?\n/);
 if(variant==='fault'){assert.match(stdout,/# pass 0\r?\n/);assert.match(stdout,/# fail 1\r?\n/);assert(stdout.includes('Missing expected exception (acceptedError): ER-BINDING-'+id+' must refuse the same invalid authority/document'),'The actual named refusal assertion must fail; setup/load errors are not kills.');}
 else{assert.match(stdout,/# pass 1\r?\n/);assert.match(stdout,/# fail 0\r?\n/);}
}
