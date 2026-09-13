'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),{createHash,randomUUID}=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..'),sha=x=>createHash('sha256').update(x).digest('hex');
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function assertionDiagnostic(log,status,name){
 if(status!==1||typeof name!=='string'||!name)return null;
 const lines=log.split(/\r?\n/),matches=[];
 for(let index=0;index<lines.length;index++){
  const hit=/^not ok [0-9]+ - (.+)$/.exec(lines[index]);
  if(!hit||!hit[1].includes(name))continue;
  let end=index+1;while(end<lines.length&&!/^(?:# Subtest:|(?:not )?ok [0-9]+ - |1\.\.|# tests )/.test(lines[end]))end++;
  const block=lines.slice(index+1,end).join('\n');
  // Only this test's own TAP diagnostic can attribute its failure. Nested
  // expected/actual error objects and later tests cannot lend their code.
  const codes=[...block.matchAll(/^  code: ['"]?(ERR_[A-Z_]+)['"]?$/gm)];
  matches.push(codes.length===1&&codes[0][1]==='ERR_ASSERTION'?{name:hit[1],code:'ERR_ASSERTION',diagnostic:block}:null);
 }
 return matches.length===1?matches[0]:null;
}
function runCases({label,cases,testFile,defaultTarget='rebuild/m4/import/replay-core.cjs'}){
 assert.equal(path.resolve(process.env.S3_SCRATCH||''),root,'Mutation requires owned copied tree');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'rebuild/m4/spec/s3-portable-sources.json')));
 const pins=new Map(manifest.sources.map(e=>[e.path,e.sha256]));
 const run=path.resolve(process.env.S3_RUN_ROOT),dir=path.join(run,'mutation-'+label+'-'+randomUUID());fs.mkdirSync(dir);
 const evidence={profile:'earned/s3-assertion-mutations/v1',label,source_manifest_sha256:sha(JSON.stringify(manifest)),cases:[],restored:false};
 function execute(name,mutation=null){
  const env={...process.env};delete env.S3_MUTATION;if(mutation)env.S3_MUTATION=JSON.stringify(mutation);
  const result=cp.spawnSync(process.execPath,['--require','./rebuild/m4/import/test/s3/current-head.cjs','--test','--test-reporter=tap',testFile],{cwd:root,env,windowsHide:true,encoding:'utf8',timeout:60000,maxBuffer:12e6});
  const log=(result.stdout||'')+(result.stderr||'');fs.writeFileSync(path.join(dir,name+'.log'),log);
  assert(!result.error,'Actual child launches: '+name);
  assert.match(log,/^# tests [1-9][0-9]*$/m,'Nonzero actual cells: '+name);
  assert.match(log,/^# skipped 0$/m,'No skipped cells: '+name);assert.match(log,/^# cancelled 0$/m,'No cancelled cells: '+name);
  return {...result,log};
 }
 const baseline=execute('baseline');assert.equal(baseline.status,0,'Actual original suite passes');
 for(const item of cases){
  const {id,needle,replacement,test,target=defaultTarget}=item;
  assert(manifest.mutationTargets.includes(target),'Registered mutation target: '+target);
  const file=path.join(root,target),original=fs.readFileSync(file),text=original.toString();
  assert.equal(sha(original),pins.get(target),'Original exact source pin: '+id);
  assert.equal(text.split(needle).length,2,'One actual semantic site: '+id);
  const candidate=text.replace(needle,replacement),mutation={path:target,original_sha256:sha(original),sha256:sha(candidate)};
  let result;
  try{fs.writeFileSync(file,candidate);result=execute(id,mutation);}finally{fs.writeFileSync(file,original);}
  assert.equal(sha(fs.readFileSync(file)),pins.get(target),'Exact restore: '+id);
  assert.equal(result.status,1,'Mutant reaches failure: '+id);
  const diagnostic=assertionDiagnostic(result.log,result.status,test);
  assert(diagnostic,'Selected test owns ERR_ASSERTION: '+id+'; see contained log');
  assert(!/SyntaxError|MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND|IMPORT_PREPARATION_DEPENDENCIES|S3_SOURCE_DRIFT|S3_UNLISTED_MODULE/.test(result.log),'Not setup/pin failure: '+id);
  assert(new RegExp('not ok [0-9]+ - .*'+escape(test)).test(result.log),'Named behavioral test fails: '+id+'; see contained log');
  const control=execute(id+'-restored');assert.equal(control.status,0,'Identical restored control: '+id);
  evidence.cases.push({id,test,target,original_sha256:sha(original),mutant_sha256:sha(candidate),assertion:true,diagnostic:diagnostic.name,diagnostic_sha256:sha(diagnostic.diagnostic),restored:true});
 }
 evidence.restored=true;fs.writeFileSync(path.join(dir,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
 console.log('S3 '+label+' '+cases.length+'/'+cases.length+' ASSERTION MUTANTS; RESTORED PASS '+dir);
 return evidence;
}
const CORE_MUTATIONS=[
{"id":"r1-enrollment-namespace-unbound","target":"rebuild/m3/w6/local/source-admission.mjs","needle":"g.metadata.namespace!==namespace||","replacement":"","test":"S3-Q-ENROLLMENT","testFile":"rebuild/m3/w6/test/local-source-admission.test.mjs"},
{"id":"r2-uninterpreted-plan-admitted","target":"rebuild/m3/w6/local/source-admission.mjs","needle":"['plan','planTxns','planTransactions','planHistory','suspensions','issuances']","replacement":"['planTxns','planTransactions','planHistory','suspensions','issuances']","test":"S3-Q-PLAN-COLLECTION","testFile":"rebuild/m3/w6/test/local-source-admission.test.mjs"},
{"id":"r3-missing-lift-admitted","target":"rebuild/m3/w6/local/source-admission.mjs","needle":"if(!expected||encode([...counts.keys()])!==encode(expected.ex.map(card=>card.id)))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');","replacement":"","test":"S3-Q-LAYOUT-COMPLETE","testFile":"rebuild/m3/w6/test/local-source-admission.test.mjs"},
{"id":"r4-target-kind-unchecked","target":"rebuild/m3/w6/local/source-admission.mjs","needle":"if(Ops.TARGET_REQUIRED.has(op.kind)?typeof op.target_op_id!=='string'||!op.target_op_id:Object.hasOwn(op,'target_op_id'))fail('LOCAL_SOURCE_ORIGINAL_INVALID');","replacement":"","test":"S3-Q-TARGET-KIND","testFile":"rebuild/m3/w6/test/local-source-admission.test.mjs"},
{"id":"r5-reached-calendar-unchecked","target":"rebuild/m4/import/engine-provider.cjs","needle":"function reached(day){try{context.clockAt(day,0);}catch{unproven();}}","replacement":"function reached(day){}","test":"S3-PROVIDER-CALENDAR-REACHED","testFile":"rebuild/m4/import/test/engine-provider.test.cjs"},
{"id":"r8-invented-empty-drafts","target":"rebuild/m4/import/engine-provider.cjs","needle":":unavailable('drafts'),nativeTrendContext","replacement":":Object.freeze({length:0,key:()=>null}),nativeTrendContext","test":"S3-PROVIDER-CAUGHT51","testFile":"rebuild/m4/import/test/engine-provider.test.cjs"},
{"id":"r6-runtime-esm-hook-omitted","target":"rebuild/m4/import/test/s3/current-head.cjs","needle":"Module.registerHooks({","replacement":"void ({","test":"S3-HARNESS-ESM-RUNTIME","testFile":"rebuild/m4/import/test/s3/harness.test.mjs"},
{"id":"r6-static-computed-import-unchecked","target":"rebuild/m4/import/test/s3/run.mjs","needle":"if(!mapped)refusal('S3_UNLISTED_EDGE',entry.path+' computed '+token.value);","replacement":"if(!mapped)continue;","test":"S3-HARNESS-ESM-STATIC","testFile":"rebuild/m4/import/test/s3/harness.test.mjs"},
{"id":"r6-static-side-effect-unchecked","target":"rebuild/m4/import/test/s3/run.mjs","needle":"else if(token.value==='import'&&next?.type==='string')edge(next.value);","replacement":"else if(token.value==='import'&&next?.type==='string')continue;","test":"S3-HARNESS-ESM-STATIC","testFile":"rebuild/m4/import/test/s3/harness.test.mjs"},
{"id":"r7-unrelated-assertion-borrowed","target":"rebuild/m4/import/test/s3/mutations.cjs","needle":"\n  matches.push(codes.length===1&&codes[0][1]==='ERR_ASSERTION'?","replacement":"\n  matches.push(log.includes('ERR_ASSERTION')?","test":"S3-HARNESS-MUTANT-OWN-DIAGNOSTIC","testFile":"rebuild/m4/import/test/s3/harness.test.mjs"},
{"id":"publish-uses-fresh-cas-basis","target":"rebuild/m3/w6/local/source-admission.mjs","needle":"publish:()=>repository.commit(held.expected,next,()=>syncGuard(held.stamp))","replacement":"publish:async()=>repository.commit(await repository.load(),next,()=>syncGuard(held.stamp))","test":"S3-COMMIT-PUBLISH-CAS","testFile":"rebuild/m3/w6/test/local-source-commit.test.mjs"},
{"id":"captured-set-count-unchecked","target":"rebuild/m3/w6/local/source-admission.mjs","needle":"for(const [id,count]of counts)if(state.exercises.find(e=>e.id===id).sets!==count)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');","replacement":"","test":"S3-Q-F3-LAYOUT","testFile":"rebuild/m3/w6/test/local-source-admission.test.mjs"},
 {
  "id": "provider-caught-fault-escapes",
  "target": "rebuild/m4/import/engine-provider.cjs",
  "needle": "if(fault)missing(fault);if(calendarFault)unproven();if(error)throw error;return value;",
  "replacement": "if(calendarFault)unproven();if(error)throw error;return value;",
  "test": "S3-PROVIDER-CAUGHT60",
  "testFile": "rebuild/m4/import/test/engine-provider.test.cjs"
 },
 {
  "id": "provider-context-record-mutable",
  "target": "rebuild/m4/import/local-source-profile.cjs",
  "needle": "contexts.set(handle,freeze(",
  "replacement": "contexts.set(handle,(",
  "test": "S3-PROVIDER-CONTEXT-CUSTODY",
  "testFile": "rebuild/m4/import/test/engine-provider.test.cjs"
 },
 {
  "id": "provider-default-entry-unchecked",
  "target": "rebuild/m4/import/local-source-profile.cjs",
  "needle": "||mapping.engine.path!=='rebuild/engine/oracle-shim.cjs'",
  "replacement": "",
  "test": "S3-PROVIDER-MAPPING",
  "testFile": "rebuild/m4/import/test/engine-provider.test.cjs"
 },
 {
  "id": "source-original-rewrite-allowed",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "||encode(currentOps[id])!==encode(original)",
  "replacement": "",
  "test": "S3-Q-CHECKPOINT-ORIGINAL",
  "testFile": "rebuild/m3/w6/test/local-source-admission.test.mjs"
 },
 {
  "id": "ambiguous-import-picked",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "if(entries.length!==1)fail(entries.length?'LOCAL_SOURCE_IMPORT_AMBIGUOUS':'LOCAL_SOURCE_IMPORT_REQUIRED');",
  "replacement": "if(!entries.length)fail('LOCAL_SOURCE_IMPORT_REQUIRED');",
  "test": "S3-Q-IMPORT-NAME",
  "testFile": "rebuild/m3/w6/test/local-source-admission.test.mjs"
 },
 {
  "id": "identity-confirmation-bypassed",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "if(identityConfirmed!==true&&!existingSelection)fail('LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED');",
  "replacement": "",
  "test": "S3-Q-REVIEW",
  "testFile": "rebuild/m3/w6/test/local-source-admission.test.mjs"
 },
 {
  "id": "semantic-currentness-ignored",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "||stamp()!==expected",
  "replacement": "",
  "test": "S3-Q-CURRENT",
  "testFile": "rebuild/m3/w6/test/local-source-admission.test.mjs"
 },
 {
  "id": "original-hour-replaced",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "const eff=row.original.effective,hour=Number(eff?.local_time?.slice(0,2));",
  "replacement": "const eff=row.original.effective,hour=8;",
  "test": "S3-Q-LATE-HOUR",
  "testFile": "rebuild/m3/w6/test/local-source-admission.test.mjs"
 },
 {
  "id": "prefix-answer-assumed",
  "target": "rebuild/m4/import/local-source-order.cjs",
  "needle": "if(answer!==true)fail('ORDER_EVIDENCE_REQUIRED');",
  "replacement": "",
  "test": "S3-ORDER-ATTESTATION",
  "testFile": "rebuild/m4/import/test/local-source-order.test.cjs"
 },
 {
  "id": "source-scope-unbound",
  "target": "rebuild/m4/import/local-source-order.cjs",
  "needle": "'athlete_id','source_digest','checkpoint_digest'",
  "replacement": "'athlete_id','checkpoint_digest'",
  "test": "S3-ORDER-MEMBERS",
  "testFile": "rebuild/m4/import/test/local-source-order.test.cjs"
 },
 {
  "id": "publish-cancel-ignored",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "publish:()=>repository.commit(held.expected,next,()=>syncGuard(held.stamp))",
  "replacement": "publish:()=>repository.commit(held.expected,next,()=>null)",
  "test": "S3-COMMIT-SEAL-CANCEL",
  "testFile": "rebuild/m3/w6/test/local-source-commit.test.mjs"
 },
 {
  "id": "completion-disagrees",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "{...e,rebaseRequired:false,localSourceSelectionId:selectionId}",
  "replacement": "{...e,rebaseRequired:true,localSourceSelectionId:selectionId}",
  "test": "S3-COMMIT-ATOMIC",
  "testFile": "rebuild/m3/w6/test/local-source-commit.test.mjs"
 },
 {
  "id": "rollback-replaces-history",
  "target": "rebuild/m3/w6/local/source-admission.mjs",
  "needle": "next.metadata.localSources.selections[selectionId]=copy(selection);",
  "replacement": "next.metadata.localSources.selections={[selectionId]:copy(selection)};",
  "test": "S3-COMMIT-ROLLBACK",
  "testFile": "rebuild/m3/w6/test/local-source-commit.test.mjs"
 },
 {
  "id": "lost-ack-not-reconciled",
  "target": "rebuild/m3/w6/local/source-commit.mjs",
  "needle": "try{return await capability.reconcile();}catch{throw error;}",
  "replacement": "throw error;",
  "test": "S3-COMMIT-ACK",
  "testFile": "rebuild/m3/w6/test/local-source-commit.test.mjs"
 }
];
module.exports={runCases,CORE_MUTATIONS,assertionDiagnostic};
// Reserved Start/resume/capture/consumer cells are named in the provisional manifest.
if(require.main===module){
 if(!process.argv.includes('--core')){console.error('S3 BLOCKED final capture/consumer mutation custody pending');process.exitCode=2;}
 else{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'rebuild/m4/spec/s3-portable-sources.json')));
  assert.equal(JSON.stringify(manifest.coreMutations),JSON.stringify(CORE_MUTATIONS),'Exact reviewed-in-manifest core subset');
  for(const [index,testFile]of [...new Set(CORE_MUTATIONS.map(c=>c.testFile))].entries())runCases({label:'core-'+index,testFile,cases:CORE_MUTATIONS.filter(c=>c.testFile===testFile)});
 }
}
