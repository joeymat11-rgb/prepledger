'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-reading-replay-'));
if(!process.env.EARNED_READING_W6_ROOT)throw Error('Provide retained W6 root explicitly');
const originalFile=path.join(__dirname,'../reading-replay.cjs'),original=fs.readFileSync(originalFile),target=path.join(dir,'reading-replay.cjs'),sha=x=>createHash('sha256').update(x).digest('hex');
fs.writeFileSync(target,original);fs.copyFileSync(path.join(__dirname,'../prepare.cjs'),path.join(dir,'prepare.cjs'));
const dailyFile=path.join(__dirname,'../daily-history.cjs'),dailyOriginal=fs.readFileSync(dailyFile),dailyTarget=path.join(dir,'daily-history.cjs');fs.writeFileSync(dailyTarget,dailyOriginal);
function run(name){const r=cp.spawnSync(process.execPath,['--test','--test-reporter=tap',path.join(__dirname,'reading-replay.test.cjs')],{cwd:root,
 env:{...process.env,EARNED_REPLAY_CANDIDATE:target},encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:4e6});fs.writeFileSync(path.join(dir,name+'.log'),(r.stdout||'')+(r.stderr||''));return r;}
assert.equal(run('baseline').status,0,'Actual engine baseline');
const faults=[
 ['trust-supplied-candidate',"if(prep.candidateBytes().toString()!==input.candidate_json)",'if(false)'],
 ['pending-effect-enters-engine','effect=row.accepted;','effect=row.local;'],
 ['skip-checkpoint-listed-original',".filter(r=>r?.original.kind==='fact');",".filter(r=>r?.original.kind==='fact'&&!Object.hasOwn(checkpoint.generation.collections.ops||{},r.op_id));"],
 ['removed-original-kept',"if(effect.state==='included'){","if(effect.state==='removed')state=engineFor({day:row.date,hour:8}).applyRead(state,row.date,row.original.payload.lb.value,{hour:8});\n        if(effect.state==='included'){"],
 ['current-clock-reclassifies-history','engineFor({day:row.date,hour}).applyRead','engineFor({day:asOf,hour}).applyRead'],
 ['pending-source-overlap-ignored',"if(row.status==='pending-local'&&seenDates.has(row.date)&&!inheritedDates.has(row.date))issue('PENDING_SOURCE_OVERLAP_UNRESOLVED',row.op_id);",'if(false){}'],
 ['saved-coverage-trusted','if(!isDeepStrictEqual(actual,saved))', 'if(false)'],
 ['merged-native-image-assumed-covered',"if(!internal&&input.local_json!==null&&input.local_json!==input.source_json&&Object.keys(checkpoint?.generation?.collections?.ops||{}).length)",'if(false)'],
 ['prior-native-image-assumed','if(json(baseline.accepted_state)!==m.local_json)', 'if(false)'],
 ['inherited-correction-not-rebuilt','const inheritedView=await calculate(previous,g,cut,context.clock,next);','const inheritedView=baseline;'],
 ['rollback-uses-later-request-cut','activation=await node(entry.selection.target_activation_id);','activation=entry;'],
 ['checkpoint-original-comparison-omitted','if(!isDeepStrictEqual(op,original.collections.ops?.[id]))','if(false)'],
 ['daily-partial-replaces-whole','values={...values,...dailyPatch','values={...dailyPatch','daily-history.cjs'],
 ['daily-pending-enters-accepted',"(layer==='local'||status(op)==='accepted')",'true','daily-history.cjs'],
 ['daily-causal-edge-ignored',"if(!ancestry(op.op_id).has(original.op_id))issues.push('DAILY_TARGET_CAUSAL_EDGE_REQUIRED');",'/* omitted */','daily-history.cjs'],
 ['daily-native-source-overlap-ignored',"if(Object.hasOwn(incoming.dailyLogs?.[date]||{},field))",'if(false)'],
 ['removed-daily-added-field-forgotten',"for(const effect of row.effects)if(effect.status==='accepted'&&effect.original.kind==='correction')","for(const effect of [])if(false)"]
];
const evidence={profile:'earned/reading-replay-faults/v1',directory:dir,source_sha256:sha(original),daily_source_sha256:sha(dailyOriginal),faults:[]};
for(const [name,needle,replacement,file='reading-replay.cjs']of faults){
 const bytes=file==='daily-history.cjs'?dailyOriginal:original,mutantTarget=path.join(dir,file),source=bytes.toString();assert.equal(source.split(needle).length,2,'Unique mutation '+name);const mutant=source.replace(needle,replacement);let r;
 try{fs.writeFileSync(mutantTarget,mutant);r=run(name);}finally{fs.writeFileSync(mutantTarget,bytes);}
 assert.equal(r.status,1,'Reached fault '+name+' '+dir);assert.match(r.stdout,/code: 'ERR_ASSERTION'/);assert.match(r.stdout,/not ok /);
 evidence.faults.push({name,file,mutant_sha256:sha(mutant),effective:true,log:name+'.log'});console.log('READING REPLAY FAULT REACHED '+name);
}
assert.equal(run('restored').status,0);assert.equal(sha(fs.readFileSync(target)),sha(original));assert.equal(sha(fs.readFileSync(originalFile)),sha(original));
assert.equal(sha(fs.readFileSync(dailyTarget)),sha(dailyOriginal));assert.equal(sha(fs.readFileSync(dailyFile)),sha(dailyOriginal));
evidence.restored=true;fs.writeFileSync(path.join(dir,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');console.log('READING REPLAY RESTORED PASS '+dir);
