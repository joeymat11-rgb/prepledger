'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-binding'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const pre=JSON.parse(fs.readFileSync(path.join(base,'source-preflight.json'))),manifest=JSON.parse(fs.readFileSync(path.join(base,'initial-public-inputs.json')));
const C='083bd47efc16d02105b3ebe2912bcf5aa4a5f240';assert.equal(pre.candidate,C);assert.equal(process.version,'v22.23.2');assert.equal(sha(fs.readFileSync(process.execPath)),'0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4');
function verify(){for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file+' exact before/after source');for(const file of ['rebuild/engine/seed.cjs','rebuild/lanes/b/BUILD-B1B2-AMENDMENT-BINDING.md','rebuild/lanes/b/tooling/README.md'])assert(!fs.existsSync(path.join(root,file)),file+' unread/unmaterialized');}
verify();const temp=path.join(base,'temp'),results=path.join(base,'results');fs.mkdirSync(temp,{recursive:true});fs.mkdirSync(results,{recursive:true});
const env={...process.env,TZ:'America/New_York',TEMP:temp,TMP:temp};for(const n of Object.keys(env))if(/^(NODE_OPTIONS|NODE_PATH|NODE_V8_COVERAGE|V8_COVERAGE|V8_FLAGS|NODE_TEST_CONTEXT|NODE_TEST_WORKER_ID|MEASURED_TEST_NOW|PL_ENGINE|PL_LAWS_LIB)$/i.test(n))delete env[n];
const mode=process.argv[2]||'cohort';let argv;
if(mode==='cohort')argv=pre.exactCohortArgv;
else if(mode==='independent')argv=['--test','--test-reporter=tap',path.join(__dirname,'B1B2-AMENDMENT-BINDING-ANNEX.cjs')];
else throw Error('Closed reviewer execution mode');
const start=new Date().toISOString(),time=performance.now(),r=cp.spawnSync(process.execPath,argv,{cwd:root,env,windowsHide:true,maxBuffer:16*1024*1024,encoding:'utf8'});
fs.writeFileSync(path.join(results,mode+'.stdout.log'),r.stdout||'');fs.writeFileSync(path.join(results,mode+'.stderr.log'),r.stderr||'');
let restored;try{verify();restored=true;}catch(e){restored=e.message;}
const result={candidate:C,action:mode,node:process.version,nodeSHA256:sha(fs.readFileSync(process.execPath)),timezone:env.TZ,argv,start,durationMs:performance.now()-time,status:r.status,signal:r.signal,error:r.error&&r.error.message,stdoutSHA256:sha(r.stdout||''),stderrSHA256:sha(r.stderr||''),restored,tail:(r.stdout||'').split(/\r?\n/).slice(-12)};
fs.writeFileSync(path.join(results,mode+'.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));assert.equal(restored,true);if(r.error)throw r.error;process.exitCode=r.status===null?1:r.status;
