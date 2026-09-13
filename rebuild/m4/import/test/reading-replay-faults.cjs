'use strict';
// Original twenty behavioral bites and hosted controls; only current scratch wiring changes.
const {runCases}=require('./s3/mutations.cjs');
const faults=[
 ['trust-supplied-candidate',"if(text(prep.candidateBytes())!==input.candidate_json)",'if(false)'],
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
 ['removed-daily-added-field-forgotten',"for(const effect of row.effects)if(effect.status==='accepted'&&effect.original.kind==='correction')","for(const effect of [])if(false)"],
 ['workout-binding-uses-rollback-intent','activation_op_id:source.intent_op_id,session_log:log','activation_op_id:selectionId,session_log:log'],
 ['workout-binding-copies-another-log','activation_op_id:source.intent_op_id,session_log:log','activation_op_id:source.intent_op_id,session_log:copy(log)'],
 ['workout-binding-loses-material','material_sha256:result.coverage.material_sha256',"material_sha256:'unbound'"]
];
const names=["changed candidate or supplied checkpoint coverage","accepted correction reconstructs earlier and later effects","source checkpoint membership","removing an earlier reading","the actual original-day hour","known pending/source overlap","changed candidate or supplied checkpoint coverage","known pending/source overlap","different local bytes and checkpoint originals","native local image is reproduced","rollback selects the target activation","different local bytes and checkpoint originals","daily partial correction preserves","accepted food and steps","daily concurrent edits","native daily lineage reproduces original local image","removed daily originals retain","rollback selects the target activation","workout source binding cannot arise","rollback selects the target activation"];
const cases=faults.map(([id,needle,replacement,file],i)=>({id,needle,replacement,test:names[i],...(file?{target:"rebuild/m4/import/"+file}:{})}));
runCases({label:"reading-replay",testFile:"rebuild/m4/import/test/reading-replay.test.cjs",cases:process.argv.includes("--workout-source-only")?cases.filter(c=>c.id.startsWith("workout-binding-")):cases});
