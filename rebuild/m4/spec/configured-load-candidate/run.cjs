'use strict';
// Prepare actual-source copies only. Every retained source remains untouched.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),workout=path.join(root,'rebuild/m4/workout');
const pins={
 'schema.cjs':'9d18cce9434118fd33364c2bc6842923707685328fa62d115b90c63460923458',
 'edit-values.cjs':'bc3e760bb1870a3a30f7f7e15d427faea00ef31b9d4256050ac30161b3ec1546',
 'edit-history.cjs':'3e5dd5053ddbcc2491cc604da35e42fde625c6c0b94d409431c3bba65042d3e2',
 'context-values.cjs':'8cd6fe62aaf0ab1f11ecd7a35564f057b3b6c5a5e4facd5404f8f7b63caf4a2b',
 'source-control-values.cjs':'635ba7ec7515a53bb7029b81d223586a9d884b3d60e464ce178bf73a0d4ba560'};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),originals={};
for(const [file,pin]of Object.entries(pins)){const bytes=fs.readFileSync(path.join(workout,file));assert.equal(sha(bytes),pin,file);originals[file]=bytes;}
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'earned-configured-load-candidate-'));
const once=(source,before,after)=>{assert.equal(source.split(before).length,2,'Unique exact candidate edit');return source.replace(before,after);};
for(const [file,bytes]of Object.entries(originals))fs.writeFileSync(path.join(scratch,file),bytes);
const schema=once(originals['schema.cjs'].toString(),"const load = value => quantity(value, 'lb') && value.value > 0;","const load = require('./entered-load.cjs');");
let edits=once(originals['edit-values.cjs'].toString(),"'use strict';","'use strict';\nconst enteredLoad=require('./entered-load.cjs');");
edits=once(edits,"if(field==='load')return quantity(value,'lb')&&(version===1||value.value>0);","if(field==='load')return version===1?quantity(value,'lb'):enteredLoad(value);");
fs.writeFileSync(path.join(scratch,'schema.cjs'),schema);fs.writeFileSync(path.join(scratch,'edit-values.cjs'),edits);
fs.copyFileSync(path.join(__dirname,'entered-load.cjs'),path.join(scratch,'entered-load.cjs'));
const candidateFiles=Object.fromEntries([...Object.keys(pins),'entered-load.cjs'].map(file=>[file,sha(fs.readFileSync(path.join(scratch,file)))]));
const results=[];
function run(label,args,env={}){const r=cp.spawnSync(process.execPath,args,{cwd:root,env:{...process.env,...env},encoding:'utf8',windowsHide:true,maxBuffer:3e6});
 fs.writeFileSync(path.join(scratch,label+'.log'),(r.stdout||'')+(r.stderr||''));results.push({label,status:r.status});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');assert.equal(r.status,0,label);}
try{
 run('candidate-history',['--test',path.join(__dirname,'candidate.test.cjs')],{EARNED_CONFIGURED_LOAD_CANDIDATE:scratch});
 run('numeric-v1-controls',[path.join(workout,'test/schema.test.cjs'),'--candidate',path.join(scratch,'schema.cjs')]);
}finally{
 for(const [file,pin]of Object.entries(pins))assert.equal(sha(fs.readFileSync(path.join(workout,file))),pin,'Retained source unchanged: '+file);
 for(const [file,pin]of Object.entries(candidateFiles))assert.equal(sha(fs.readFileSync(path.join(scratch,file))),pin,'Candidate unchanged: '+file);
 fs.writeFileSync(path.join(scratch,'EVIDENCE.json'),JSON.stringify({runtime:process.version,scratch,originalPins:pins,candidatePins:candidateFiles,results},null,2)+'\n');
 console.log('CONFIGURED LOAD CANDIDATE EVIDENCE '+scratch);
}
