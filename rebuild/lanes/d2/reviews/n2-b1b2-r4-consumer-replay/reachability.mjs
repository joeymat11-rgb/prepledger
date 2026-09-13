import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex'),git=(...a)=>execFileSync('git',a);
const proof=JSON.parse(fs.readFileSync('.tmp/d2-r4-identity-and-closure.json'));
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,m=>m.replace(/[^\r\n]/g,' ')).replace(/^\s*\/\/[^\n]*/gm,m=>m.replace(/[^\r\n]/g,' '));
const counts={require:0,'dynamic-import':0,'static-import':0},unresolved=[];
for(const node of proof.staticProductionClosure.nodes){
 const clean=strip(fs.readFileSync(node.path,'utf8'));
 for(const [kind,re] of [['require',/\brequire\s*\(/g],['dynamic-import',/\bimport\s*\(/g]]){
  const calls=[...clean.matchAll(re)],edges=node.edges.filter(e=>e.kind===kind);assert.equal(calls.length,edges.length,node.path+' '+kind+' coverage');
 }
 if(/\bcreateRequire\b|\brequire\.resolve\b|\beval\s*\(|\bnew\s+Function\s*\(/.test(clean))unresolved.push(node.path);
 for(const edge of node.edges) counts[edge.kind]++;
}
assert.deepEqual(unresolved,[]);
const old=git('show',proof.priorHead+':rebuild/engine/today.cjs').toString(),now=fs.readFileSync('rebuild/engine/today.cjs','utf8');
const before='d9 = plusDays(isoOf(todayStart()), k9);',after='d9 = plusDays(tISO, k9);';
assert.equal(old.split(before).length-1,1);assert.equal(now.split(after).length-1,1);assert.equal(old.replace(before,after),now);
const snippets=(file,ranges)=>({path:file,sha256:hash(fs.readFileSync(file)),ranges:ranges.map(([from,to])=>({from,to,text:fs.readFileSync(file,'utf8').split('\n').slice(from-1,to).join('\n')}))});
const witnesses=[
 snippets('rebuild/engine/today.cjs',[[531,535],[585,612]]),snippets('rebuild/engine/dates.cjs',[[8,23]]),
 snippets('rebuild/m3/w7-preview/today/today-model.cjs',[[61,81],[92,100],[112,115],[137,144],[166,196],[212,232],[248,269]]),
 snippets('rebuild/m3/w7-preview/today/today-engine.cjs',[[22,35]]),snippets('rebuild/m3/w7-preview/browser-engine.cjs',[[6,32]]),
 snippets('rebuild/m3/w7-preview/today/today-entry.mjs',[[150,180],[230,256],[304,321],[349,350]]),
 snippets('rebuild/m3/w7-preview/today/today-app.cjs',[[621,628],[637,658],[682,705],[780,800],[1743,1755],[1789,1798]]),
 snippets('rebuild/m3/w7-preview/today/gym-model.mjs',[[87,94],[314,346],[391,403]]),
 snippets('rebuild/m3/w7-preview/today/gym-app.mjs',[[209,218],[304,312],[521,535]]),
 snippets('rebuild/m3/w6/local/today-bindings.mjs',[[162,169],[305,340],[354,369]]),
 snippets('rebuild/m3/w6/host/workout-host.mjs',[[190,216]]),snippets('rebuild/m4/workout/engine-capture.cjs',[[35,54]]),
 snippets('rebuild/coach/local-world.mjs',[[24,24],[51,65],[222,236],[268,270]])
];
const materialized=git('ls-files','-t').toString().trim().split('\n').filter(l=>!l.startsWith('S ')).map(l=>l.slice(2));
assert.equal(materialized.length,139);
const absent=['ledger','rebuild/conform/private','src/history.js','rebuild/soak','rebuild/engine/seed.cjs','rebuild/m4/workout/engine-runtime.cjs','rebuild/conform/lib/ops.cjs','rebuild/conform/lib/canonical.cjs','rebuild/lanes/b/BUILD-B1B2-R4-R9.md','rebuild/lanes/b/tooling/README.md','node_modules','rebuild/m3/w6/node_modules'].map(path=>({path,absent:!fs.existsSync(path)}));
assert(absent.every(r=>r.absent));
const result={scope:'PM302 actual Today page composition; source-only applicability, no product execution',head:proof.head,exactRuntimeHunk:{before,after,onlyOneReplacement:true},loaderAudit:{counts,allLiteralRequireAndDynamicImportCallsAccounted:true,unresolved,staticImportEdges:'Manually checked across all104 production modules; raw loader lines retained in identity evidence.',externalsNotLoaded:true},witnesses,fieldUse:{title:'Copied to view.workout, displayed by Today/Start/Resume/stub; gym sessionTitle is display-only',today:'Copied to view.workout.today; no downstream production read found',iso:'Remains in nowModel DTO; no downstream production read found',why:'Reads nowModel.move and whySections; no workout field read',start:'model.today -> host day -> constant-day engine/runtime and producer -> genSession(state,day) -> preparedId -> startPreparedWorkout'},reasoning:['boot() supplies no replacement model/engineFactory; default createTodayModel closes over a string day and supplies engineClockFor(day).','previewClock.today returns that same immutable day; dates.todayStart is mk(clock.today()). Both old scan and new scan therefore start from the same captured day for every k9.','The correction removes a pure fixed-day query. It changes no branch result, selected calendar date/title or following fixed-clock reader for this composition, including a multi-day/weekend scan.','Rebinding the N2 workout reuses the same model and its day; gym producer receives day directly, never nowModel.workout.iso/title/today.','An artificial engineFactory returning a moving clock would replace the actual binding. Per PM302 and PM follow-up it is not an affected consumer replay.','The separate coach companion uses the same Today model factory at236. Its full createRequire closure is not the page closure and is not qualified or executed here.'],boundaries:[{importer:'rebuild/m3/w6/test/support.mjs',line:8,target:'rebuild/conform/lib/ops.cjs',transitiveKnown:'rebuild/conform/lib/canonical.cjs',disposition:'Test helper request held by PM as unnecessary; not hydrated/read/executed.'},{importer:'rebuild/coach/local-world.mjs',line:59,target:'rebuild/m4/workout/engine-runtime.cjs',disposition:'Known excluded coach runtime, outside104-module page closure; no expansion/read/execution or whole-coach verdict.'}],materialized,absent,setup:JSON.parse(fs.readFileSync('.tmp/d2-r4-setup.json')),nonProductReadFailures:['First PowerShell range reader stopped on a nested-array type mismatch before emitting source; corrected scalar range parsing.','Two missing optional named files and prior report paths were requested in source trees that did not contain them; read only the correct already-licensed paths afterward.'],execution:{productModules:0,syntheticFixtures:0,tests:0,builds:0,browserCases:0,storesOpened:0,sourceFaults:0},builderAndCurrentERUnread:true};
fs.writeFileSync('.tmp/d2-r4-reachability.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({loaderAudit:result.loaderAudit.counts,unresolved:unresolved.length,witnesses:witnesses.length,materialized:materialized.length,allNamedExclusionsAbsent:true,execution:result.execution}));
