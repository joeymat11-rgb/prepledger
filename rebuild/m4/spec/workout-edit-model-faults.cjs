'use strict';
// Mutates disposable copies of the review model only; never product source.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {spawnSync,execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const model=path.join(__dirname,'workout-edit-model.cjs'),test=path.join(__dirname,'workout-edit-model.test.cjs');
const w6=path.resolve(process.argv[2]||'../m3-w6-browser-bridge');
const source=fs.readFileSync(model,'utf8'),sha=x=>createHash('sha256').update(x).digest('hex');
const externalFiles=fs.readdirSync(path.join(w6,'rebuild/client')).filter(n=>n.endsWith('.cjs')).map(n=>'rebuild/client/'+n)
 .concat(['rebuild/conform/lib/ops.cjs','rebuild/conform/lib/canonical.cjs','rebuild/m3/w6/strict-json.mjs']);
const externalPins=Object.fromEntries(externalFiles.map(p=>[p,sha(fs.readFileSync(path.join(w6,p)))]));
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-workout-edit-faults-')),copy=path.join(output,'model.cjs');
const execute=name=>{
 const r=spawnSync(process.execPath,[test,w6],{encoding:'utf8',windowsHide:true,timeout:30000,
  env:{...process.env,EARNED_EDIT_MODEL:copy}});
 fs.writeFileSync(path.join(output,name+'.log'),(r.stdout||'')+(r.stderr||''));
 return r;
};
const faults=[
 ['clear-becomes-unknown','if(clear(value))delete current[field];','if(clear(value))current[field]={tag:"unknown"};','CLEAR_IS_ABSENCE'],
 ['reverse-accepted-tie','changes=(corrections.get(op.op_id)||[]).slice().sort((a,b)=>a.sequence-b.sequence)',
  'changes=(corrections.get(op.op_id)||[]).slice().sort((a,b)=>b.sequence-a.sequence)','ACCEPTED_TIE_ORDER'],
 ['revised-edit-moves-position','sequence:node.sequence,patch:current.replacement_fields',
  'sequence:Math.max(node.sequence,...changes.map(c=>c.sequence)),patch:current.replacement_fields','REVISED_EDIT_KEEPS_ORIGINAL_POSITION'],
 ['disabled-removal-still-applies','if(active)add(removals,op.target_op_id','if(true)add(removals,op.target_op_id','ALL_ACTIVE_REMOVALS_DISABLED'],
 ['erase-original-json-spelling','operationBytes:n.operationBytes','operationBytes:JSON.stringify(n.op)','LITERAL_ORIGINAL_BYTES'],
 ['reinterpret-legacy-clear','if(!supported)block(rootId,\'LEGACY_EDIT_INTERPRETATION_REQUIRED\')',
  'if(false)block(rootId,\'LEGACY_EDIT_INTERPRETATION_REQUIRED\')','LEGACY_CLEAR_NOT_REINTERPRETED'],
];
const evidence={node:process.version,modelSha256:sha(source),testSha256:sha(fs.readFileSync(test)),w6,
 w6Head:execFileSync('git',['rev-parse','HEAD'],{cwd:w6,encoding:'utf8',windowsHide:true}).trim(),externalPins,results:[],
 limits:'Behavioral sensitivity of proposed review model only; no product mutation, schema acceptance or recovery gate.'};
try{
 fs.writeFileSync(copy,source);const baseline=execute('baseline');assert.equal(baseline.status,0,baseline.stdout+baseline.stderr);
 assert.match(baseline.stdout,/WORKOUT EDIT MODEL 19 PASS/);evidence.baseline='19 PASS';
 for(const [name,from,to,assertion]of faults){
  assert.equal(source.split(from).length,2,'exact one mutation anchor '+name);fs.writeFileSync(copy,source.replace(from,to));
  const r=execute(name),log=(r.stdout||'')+(r.stderr||'');
  assert.equal(r.status,1,name+' did not fail by completed assertion');assert.match(log,/ERR_ASSERTION/);assert(log.includes(assertion),name+' did not reach '+assertion);
  evidence.results.push({name,assertion,status:'EFFECTIVE_ASSERTION'});console.log('PASS effective '+name);
 }
}finally{fs.writeFileSync(copy,source);assert.equal(fs.readFileSync(model,'utf8'),source);}
const restored=execute('restored');assert.equal(restored.status,0,restored.stdout+restored.stderr);assert.match(restored.stdout,/WORKOUT EDIT MODEL 19 PASS/);
evidence.restored='19 PASS';evidence.disposableRestoredSha256=sha(fs.readFileSync(copy));assert.equal(evidence.disposableRestoredSha256,evidence.modelSha256);
for(const [p,hash]of Object.entries(externalPins))assert.equal(sha(fs.readFileSync(path.join(w6,p))),hash,p+' changed');
const artifact=path.join(output,'evidence.json');fs.writeFileSync(artifact,JSON.stringify(evidence,null,2)+'\n');
console.log('WORKOUT EDIT MODEL 19 baseline / '+faults.length+' effective faults / 19 restored PASS\n'+artifact+'\nSHA256 '+sha(fs.readFileSync(artifact)));
