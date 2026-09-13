'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..'),base=path.join(root,'.tmp/er-native-capture-repair'),dir=path.join(base,'committed-entry'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const audit=JSON.parse(fs.readFileSync(path.join(base,'source-audit.json'))),closure=JSON.parse(fs.readFileSync(path.join(base,'builtin-closure.json')));
assert.equal(process.cwd(),root);assert.equal(sha(fs.readFileSync(process.execPath)),audit.node.sha256);assert.equal(closure.modules.length,11);assert.equal(closure.newAuthorCompletionOutcomesRead,false);assert(!fs.existsSync(dir),'No repeated committed cohort without a new recorded reason');fs.mkdirSync(dir);
const inputs=audit.manifest.inputs.filter(x=>x.role==='candidate');for(const r of inputs)assert.equal(sha(fs.readFileSync(path.join(root,r.path))),r.sha256);
const argv=['--test','--test-reporter=tap','rebuild/lanes/b/tooling/test/b1b2-native-capture.test.cjs'],env={...process.env};
const removed=Object.keys(env).filter(k=>/^(NODE_OPTIONS|NODE_PATH|NODE_TEST_CONTEXT|EARNED_B1B2_CAPTURE_|SYNTHETIC_)/i.test(k));for(const k of removed)delete env[k];
const manifest={candidate:audit.candidate,node:audit.node,root,argv,inputs,environmentKeysRemoved:removed,originalNativeInvoked:false,started:new Date().toISOString()};fs.writeFileSync(path.join(dir,'inputs.json'),JSON.stringify(manifest,null,2)+'\n');
const out=fs.openSync(path.join(dir,'stdout.tap'),'wx'),err=fs.openSync(path.join(dir,'stderr.log'),'wx');let result;
try{result=cp.spawnSync(process.execPath,argv,{cwd:root,env,windowsHide:true,stdio:['ignore',out,err]});}finally{fs.closeSync(out);fs.closeSync(err);}
const restored=inputs.map(r=>({path:r.path,sha256:sha(fs.readFileSync(path.join(root,r.path))),expected:r.sha256}));
const evidence=fs.readFileSync(path.join(root,'.tmp/native-capture-tests/public-evidence.json'));fs.writeFileSync(path.join(dir,'public-evidence.json'),evidence);
const record={status:result.status,signal:result.signal,error:result.error?{code:result.error.code,message:result.error.message}:null,finished:new Date().toISOString(),restored,files:['inputs.json','stdout.tap','stderr.log','public-evidence.json'].map(name=>{const b=fs.readFileSync(path.join(dir,name));return{name,bytes:b.length,sha256:sha(b)};})};fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(record,null,2)+'\n');
for(const r of restored)assert.equal(r.sha256,r.expected);console.log(JSON.stringify(record));process.exitCode=result.status===0?0:1;
