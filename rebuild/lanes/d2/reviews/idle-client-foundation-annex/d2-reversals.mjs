import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root=process.cwd(),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const client='rebuild/m3/w6/public-client.mjs',repository='rebuild/m3/w6/repository.mjs';
const hashes={[client]:'9cb0ba3d2da5e9bb85620ed3f103c344926def627533b2ce3e321dd24a828c31',[repository]:'c300f00d1bb6d7473bddc310559695876a4a76b53f4b35e3dfff7edeb1383ddc'};
const original=new Map(Object.keys(hashes).map(p=>[p,fs.readFileSync(p)]));
for(const [p,bytes] of original)if(sha(bytes)!==hashes[p])throw Error('Exact candidate required: '+p);
const mutations=[
 {id:'R1-token',file:repository,pattern:'^D2 I2',from:'active.revision !== basis.revision || token(active) !== basis.token',to:'active.revision !== basis.revision',assertion:'ciphertext-only competitor must refuse publication'},
 {id:'R2-reentrancy',file:client,pattern:'^D2 I5',from:'assertIdle(); // The currentness capability can synchronously reenter.',to:'// D2 reversal: omit the post-currentness reentrancy check.',assertion:'reentrant queue change must be caught before publication'},
 {id:'R3-unknown-write',file:client,pattern:'^D2 I7',from:'!["TRANSACTION_ABORTED", "TRANSACTION_WRITE_FAILED"].includes(result.code)) replacementWriteUnknown = true;',to:'!["TRANSACTION_ABORTED", "TRANSACTION_WRITE_FAILED"].includes(result.code)) void 0;',assertion:'later successful workout must not erase uncertainty'},
 {id:'R4-old-handle',file:client,pattern:'^D2 I8',from:'publicationUnknown = true;\n        return {...refusal',to:'publicationUnknown = true; replaced = false;\n        return {...refusal',assertion:'failure after publication must never revive the retired client'},
 {id:'R5-completion',file:repository,pattern:'^D2 I1',from:'invoked = true; result = callback();',to:'invoked = true; result = callback(); resolve(result);',assertion:'replacement must wait for complete'},
];
const env={...process.env,TZ:'America/New_York',TEMP:path.join(root,'.tmp'),TMP:path.join(root,'.tmp')};
for(const k of ['NODE_OPTIONS','NODE_PATH','NODE_V8_COVERAGE','NODE_TEST_CONTEXT'])delete env[k];
const entries=[];
try{
 for(const m of mutations){
  const src=original.get(m.file).toString('utf8');if(src.split(m.from).length!==2)throw Error('Expected exactly one reversal anchor '+m.id);
  const changed=Buffer.from(src.replace(m.from,m.to));fs.writeFileSync(m.file,changed);
  const args=['--test','--test-name-pattern='+m.pattern,'.tmp/d2-controls.mjs'],started=new Date().toISOString();
  let r;try{r=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',timeout:30000,maxBuffer:8*1024*1024});}finally{fs.writeFileSync(m.file,original.get(m.file));}
  const output=r.stdout+(r.stderr?'\n[stderr]\n'+r.stderr:''),log='.tmp/d2-'+m.id+'.tap';fs.writeFileSync(log,output);
  const behavioralKill=r.status===1&&output.includes('ERR_ASSERTION')&&output.includes(m.assertion)&&!output.includes('MODULE_NOT_FOUND')&&!r.error&&!r.signal;
  const e={...m,command:[process.execPath,...args],started,finished:new Date().toISOString(),sourceSHA256:hashes[m.file],mutantSHA256:sha(changed),restoredSHA256:sha(fs.readFileSync(m.file)),controlSHA256:sha(fs.readFileSync('.tmp/d2-controls.mjs')),exit:r.status,signal:r.signal,error:r.error?.message||null,behavioralKill,log,logSHA256:sha(Buffer.from(output))};
  entries.push(e);fs.writeFileSync('.tmp/d2-reversals.json',JSON.stringify({candidate:'e85ad803ae8af600726c1491f35c90c7b3cd2c03',node:process.version,authorOutcomesRead:false,entries},null,2)+'\n');
  console.log(JSON.stringify({id:m.id,exit:r.status,behavioralKill,restored:e.restoredSHA256===hashes[m.file],summary:output.split('\n').filter(x=>/^# (tests|pass|fail|cancelled|skipped|todo)/.test(x))}));
  if(!behavioralKill||e.restoredSHA256!==hashes[m.file])throw Error('Invalid kill/restoration '+m.id);
 }
}finally{for(const [p,bytes] of original)fs.writeFileSync(p,bytes);}
for(const [label,args] of [
 ['controls-restored',['--test','.tmp/d2-controls.mjs']],
 ['pair-restored',['--test','rebuild/m3/w6/test/public-client.test.mjs','rebuild/m3/w6/test/prepared-workout.test.mjs']]
]){
 const started=new Date().toISOString(),r=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',timeout:90000,maxBuffer:8*1024*1024});
 const output=r.stdout+(r.stderr?'\n[stderr]\n'+r.stderr:'');fs.writeFileSync('.tmp/d2-'+label+'.tap',output);
 const meta={candidate:'e85ad803ae8af600726c1491f35c90c7b3cd2c03',node:process.version,command:[process.execPath,...args],started,finished:new Date().toISOString(),exit:r.status,signal:r.signal,error:r.error?.message||null,controlSHA256:sha(fs.readFileSync('.tmp/d2-controls.mjs')),sourceSHA256:Object.fromEntries([...original].map(([p])=>[p,sha(fs.readFileSync(p))])),logSHA256:sha(Buffer.from(output)),authorOutcomesRead:false};
 fs.writeFileSync('.tmp/d2-'+label+'.json',JSON.stringify(meta,null,2)+'\n');
 console.log(JSON.stringify({label,exit:r.status,summary:output.split('\n').filter(x=>/^# (tests|pass|fail|cancelled|skipped|todo)/.test(x))}));
 if(r.status!==0||r.error||r.signal)throw Error('Restoration execution failed '+label);
}
