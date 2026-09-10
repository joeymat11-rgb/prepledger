'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {spawnSync,execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const model=path.join(__dirname,'added-slot-model.cjs'),test=path.join(__dirname,'added-slot-model.test.cjs'),w6=path.resolve(process.argv[2]||'../m3-w6-browser-bridge');
const source=fs.readFileSync(model,'utf8'),sha=x=>createHash('sha256').update(x).digest('hex');
const files=['rebuild/client/ops.cjs','rebuild/client/canonical.cjs','rebuild/m3/w6/strict-json.mjs','rebuild/m4/workout/capture.cjs','rebuild/m4/workout/commands.cjs','rebuild/m4/workout/schema.cjs','rebuild/m4/workout/authority-profile.cjs'];
const pins=Object.fromEntries(files.map(p=>[p,sha(fs.readFileSync(path.join(w6,p)))]));
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-added-slot-model-')),copy=path.join(output,'model.cjs');
function execute(name){const r=spawnSync(process.execPath,[test,w6],{encoding:'utf8',windowsHide:true,timeout:30000,env:{...process.env,EARNED_ADDED_SLOT_MODEL:copy}});
 fs.writeFileSync(path.join(output,name+'.log'),(r.stdout||'')+(r.stderr||''));return r;}
const faults=[
 ['erase-original-bytes','operationBytes,op_id:op.op_id','operationBytes:JSON.stringify(op),op_id:op.op_id','LITERAL_EXTENSION_BYTES'],
 ['drop-added-slot-domain','JSON.stringify([SLOT_DOMAIN,op.op_id,slot.extension_slot])','JSON.stringify([op.op_id,slot.extension_slot])','DERIVED_EXTENSION_IDS'],
 ['coerce-index','slot.extension_slot===i+1','Number(slot.extension_slot)===i+1','INDEX_IDENTITY_REQUIRED'],
 ['ignore-definition-reference','ref.slot_definition_op_id===definition.op_id','true','EXACT_DEFINITION_REFERENCE'],
 ['ignore-start-scope','definition.session_start_op_id===sessionStartId','true','EXACT_START_SCOPE'],
 ['duplicate-skip-coverage','!seen.has(ref.logical_set_slot)','true','DUPLICATE_COVERAGE_REFUSED'],
 ['future-slots-inherit-skip','return coverage.map(ref=>',
  'return [...coverage,...definitions.filter(d=>!coverage.some(r=>r.slot_definition_op_id===d.op_id)).flatMap(d=>d.slots.map(s=>({logical_set_slot:s.logical_set_slot,slot_definition_op_id:d.op_id})))].map(ref=>','LATER_EXTENSION_NOT_SKIPPED']
];
const evidence={node:process.version,modelSha256:sha(source),testSha256:sha(fs.readFileSync(test)),w6,w6Head:execFileSync('git',['rev-parse','HEAD'],{cwd:w6,encoding:'utf8',windowsHide:true}).trim(),pins,results:[],
 limits:'Nonshipping representation proposal only. Uses actual parser/capture/canonical primitive and observes actual builder refusal. No complete operation validation, accepted authentication/order/edit reduction, IDB, admission, recovery, scientific or activation verdict.'};
try{
 fs.writeFileSync(copy,source);const baseline=execute('baseline');assert.equal(baseline.status,0,baseline.stdout+baseline.stderr);assert.match(baseline.stdout,/ADDED SLOT MODEL 14 PASS/);evidence.baseline='14 PASS';
 for(const [name,from,to,label]of faults){assert.equal(source.split(from).length,2,'Exact one mutation anchor '+name);fs.writeFileSync(copy,source.replace(from,to));
  const r=execute(name),log=(r.stdout||'')+(r.stderr||'');assert.equal(r.status,1,name+' did not fail');assert(log.includes('ERR_ASSERTION'),name+' did not reach assertion');assert(log.includes(label),name+' did not reach '+label);
  evidence.results.push({name,assertion:label,status:'EFFECTIVE_ASSERTION'});console.log('PASS effective '+name);
 }
}finally{fs.writeFileSync(copy,source);assert.equal(fs.readFileSync(model,'utf8'),source);}
const restored=execute('restored');assert.equal(restored.status,0,restored.stdout+restored.stderr);assert.match(restored.stdout,/ADDED SLOT MODEL 14 PASS/);evidence.restored='14 PASS';
evidence.disposableRestoredSha256=sha(fs.readFileSync(copy));assert.equal(evidence.disposableRestoredSha256,evidence.modelSha256);
for(const [p,hash]of Object.entries(pins))assert.equal(sha(fs.readFileSync(path.join(w6,p))),hash,'Consumed source changed: '+p);
const artifact=path.join(output,'evidence.json');fs.writeFileSync(artifact,JSON.stringify(evidence,null,2)+'\n');
console.log('ADDED SLOT MODEL 14 baseline / '+faults.length+' effective faults / 14 restored PASS\n'+artifact+'\nSHA256 '+sha(fs.readFileSync(artifact)));
