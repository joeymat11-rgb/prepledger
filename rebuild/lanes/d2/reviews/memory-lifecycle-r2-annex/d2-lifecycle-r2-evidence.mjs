import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=(...args)=>execFileSync('git',args).toString().trim();
const local=name=>fs.readFileSync('.tmp/'+name);
const before=JSON.parse(local('d2-lifecycle-r2-identity-before.json'));
const after=JSON.parse(local('d2-lifecycle-r2-identity-after.json'));
assert.deepEqual(before,after);assert.equal(git('rev-parse','HEAD'),before.head);assert.equal(git('status','--porcelain=v1'),'');
const licensed=new Map(before.identities.map(f=>[f.path,f]));
const priorBuild=JSON.parse(fs.readFileSync('../d2-memory-lifecycle-foundation/.tmp/w7-today-build/app.js.meta.json'));
const vendorLicensed=new Map(priorBuild.inputs.filter(f=>f.path.startsWith('rebuild/m3/w6/node_modules/')||f.path.startsWith('rebuild/m3/w5/node_modules/')).map(f=>[f.path,f]));
function source(file){
 const row=licensed.get(file)||vendorLicensed.get(file);assert(row,'UNLICENSED_BEFORE_READ '+file);
 if(!licensed.has(file)){const real=fs.realpathSync(file);assert(real.startsWith(process.cwd()+path.sep),'DEPENDENCY_OUTSIDE_OWN_TREE '+file);}
 const bytes=fs.readFileSync(file);assert.equal(hash(bytes),row.sha256,file);return bytes;
}
for(const f of before.identities)source(f.path);
const closure=JSON.parse(local('d2-lifecycle-closure.json'));
const meta=JSON.parse(local('w7-today-build/app.js.meta.json'));
for(const f of meta.inputs)assert.equal(hash(source(f.path)),f.sha256,f.path+' actual S14 input');
const buildId=hash(meta.inputs.map(f=>f.path+' '+f.sha256).sort().join('\n'));
const buildTag='earned-'+buildId.slice(0,12);
const assetNames=['app.js','index.html','styles.css'];assert.deepEqual(fs.readdirSync('.tmp/w7-today-dist').sort(),assetNames);
const assets=assetNames.map(name=>{const bytes=local('w7-today-dist/'+name);return{name,bytes:bytes.length,sha256:hash(bytes)};});
assert(local('w7-today-dist/app.js').toString().includes(buildTag));
function tap(name,tests,pass,fail){
 const text=local(name).toString();const fields=Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(k=>[k,+text.match(new RegExp('^# '+k+' (\\d+)','m'))[1]]));
 assert.deepEqual(fields,{tests,pass,fail,cancelled:0,skipped:0,todo:0});
 const asyncAfter=/generated asynchronous activity after the test ended/.test(text);assert.equal(asyncAfter,false);
 return{log:name,...fields,asynchronousAfterTest:asyncAfter,topLevelNames:[...text.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)].map(m=>({name:m[2],outcome:m[1]}))};
}
const original=tap('d2-lifecycle-r2-original.tap',141,141,0),replay=tap('d2-lifecycle-r2-replay.tap',37,37,0),edges=tap('d2-lifecycle-r2-edges.tap',4,3,1);
const edgeName='D2 R2 actual pending set outcome reaches the current owning card after an independent editor repaint';
assert.deepEqual(edges.topLevelNames.filter(t=>t.outcome==='not ok').map(t=>t.name),[edgeName]);
assert(local('d2-lifecycle-r2-edges.tap').toString().includes('the actual refusal must be visible on the current owning card, not only its detached predecessor'));
const observations=Object.fromEntries(['race-log','race-settings','r2-submitted-set','r2-refused-set'].map(n=>[n,JSON.parse(local('d2-lifecycle-'+n+'.json'))]));
const logged=observations['race-log'],settings=observations['race-settings'],refused=observations['r2-refused-set'];
assert.deepEqual([logged.modelPhase,logged.visibleUndo,logged.visibleLog,logged.changedCalls],['saved',true,false,1]);assert.equal(logged.opsAfter,logged.opsBefore+1);
assert.equal(settings.editor.draft,null);assert.deepEqual(settings.entry,{load:'',reps:''});assert.equal(settings.opsAfter,settings.opsBefore+1);
assert.deepEqual([refused.result.acknowledged,refused.result.code,refused.currentError,refused.currentOwns,refused.changed],[false,'TRANSACTION_WRITE_FAILED','',true,0]);
assert(refused.detachedError.includes(refused.result.code));assert.equal(refused.opsBefore,refused.opsAfter);assert.equal(refused.outboxBefore,refused.outboxAfter);assert(Object.values(refused.counts).every(n=>n===0));
const attempts=[
 {...tap('d2-lifecycle-r2-edges-attempt1.tap',4,2,2),attribution:'Initial positive case paused BEFORE the real client enqueue, allowing a later preparation to retire its handle; the notification timeout is not valid missing-confirmation evidence. Initial failed-set case armed quota but was refused WORKOUT_RESUME_REQUIRED before any quota write. No quota or product credit for that case.'},
 {...tap('d2-lifecycle-r2-edges-attempt2.tap',4,3,1),attribution:'Positive confirmed-write seam corrected to AFTER real commit. Refusal exploration still paused before real enqueue and had conflicting acknowledged-false/true assertions. Retained only as diagnostic evidence; no final failure credit.'},
 {...tap('d2-lifecycle-r2-edges-attempt3.tap',4,3,1),attribution:'Removed conflicting success/failure assertions and added pass-through handle observations, but still asserted that a deliberately pre-enqueue-retired handle must commit. This exceeds the demonstrated UI requirement; retained without product credit.'},
 {...tap('d2-lifecycle-r2-edges-attempt4.tap',4,3,1),attribution:'Narrowed oracle to displaying actual refusal, with success handled separately, but retained the artificial before-enqueue ordering. Superseded by final witness: real quota refusal first, then delay its acknowledgement; no command/preparation reorder.'}
];
const names=['d2-lifecycle-r2-closure.mjs','d2-lifecycle-closure.json','d2-lifecycle-r2-identity.mjs','d2-lifecycle-r2-identity-before.json','d2-lifecycle-r2-identity-after.json','d2-lifecycle-r2-evidence.mjs','d2-lifecycle-extra.test.mjs','d2-lifecycle-r2-support.mjs','d2-lifecycle-r2-edges.test.mjs','d2-lifecycle-r2-original.tap','d2-lifecycle-r2-replay.tap','d2-lifecycle-r2-edges.tap','d2-lifecycle-race-log.json','d2-lifecycle-race-settings.json','d2-lifecycle-r2-submitted-set.json','d2-lifecycle-r2-refused-set.json','d2-lifecycle-r2-root-install.log','d2-lifecycle-r2-w6-install.log','d2-lifecycle-r2-w5-install.log','w7-today-build/app.js.meta.json',...Array.from({length:4},(_,i)=>i+1).flatMap(i=>['d2-lifecycle-r2-edges-attempt'+i+'.test.mjs','d2-lifecycle-r2-edges-attempt'+i+'.tap','d2-lifecycle-r2-refused-set-attempt'+i+'.json'])];
const files=names.map(name=>{const bytes=local(name);return{path:'.tmp/'+name,bytes:bytes.length,sha256:hash(bytes)};});
const result={reviewer:'Lane D2 / Astra MAX',verdict:'REJECT',head:before.head,source:before.source,base:before.base,root:process.cwd(),authority:{dispatch:'19029c2136af7bd01a675807e32770f832df945c',decisions:[266,268,270,274,276]},builderReportUnread:true,
 sourceIdentity:before,closure,vendorBuildInputs:meta.inputs.filter(f=>vendorLicensed.has(f.path)),
 runtime:{node:process.version,nodeSHA256:hash(fs.readFileSync(process.execPath)),pnpm:'9.15.9',tz:process.env.TZ,resolvedTz:Intl.DateTimeFormat().resolvedOptions().timeZone,temp:process.env.TEMP,tmp:process.env.TMP,nodeOptionsAbsent:!process.env.NODE_OPTIONS,coverageAbsent:!process.env.NODE_V8_COVERAGE,dependencyCustody:'Fresh own locked root/W6/W5 installs with scripts disabled; original install logs retained. Only D2-owned tool runtime reused.'},
 original,replay,edges,observations,
 findings:[{id:'D2-L3',priority:2,file:'rebuild/m3/w7-preview/today/gym-app.mjs',lines:[287,448,450,574],trigger:'Submit35lb/7reps/effort2 with a real IndexedDB quota refusal. Hold delivery AFTER the real client returns TRANSACTION_WRITE_FAILED. Add an independent machine-editor row on the same owning mount; after repaint, deliver the actual result.',cause:'The entry-specific validity check correctly remains current, but the failure branch writes to the root captured by the old Log handler. Editor Add row repaints and detaches that root without replacing mount ownership.',observation:refused,expected:'Display the actual refusal on the current owning workout card and retain both drafts, no write/retry or new completion authority. Preserve same-surface and replacement-mount protections.',witness:'.tmp/d2-lifecycle-r2-edges.test.mjs',test:edgeName,attribution:'Newly uncovered gap at this candidate, not claimed newly introduced by R2. Retired-resume exploratory cases are not credited; final witness does not require a retired handle to commit.'}],
 closedOriginalFindings:{L1:'Exact original37 now passes the real acknowledged set case: Saved/Undo, one onChanged, submitted entry/effort clear; newer editor retained; operations/outbox +1.',L2:'Exact original37 now passes real confirmed settings Save: editor resolves; independent intentional empty entry and effort retained; operations/outbox +1.',priorIndependentCommit:'79ba259fbdd7bcb14d43d76a6a2de44ca26da9b5',priorReconciliation:'ece2f9608de2cc327c25d24adbea8341d2fb49c9',old137And35of37:'Retained original evidence only, not rerun. All134 base identities match prior evidence; source changes only gym-app and UI test; model and other controls unchanged.'},
 controls:{originalReplay:37,addedPassed:3,submittedPayload:observations['r2-submitted-set'].payload,addedCases:['Real confirmed set acknowledgement after editor Add row and later new row text, exact submitted payload and original collections +1.','Real settings Save plus independent load stepper/effort; editor clears while entry remains.','Actual failed settings Save with independent intentional empty inputs; current error retained on same-phone remount.'],activity:'Shared epoch, frozen snapshots, same-draft/mount/Cancel/error/optional-read and30 actual model outcome controls covered by original pair/replay; no source changes.'},
 build:{origin:'Actual unchanged S14 embedded build only',buildId,buildTag,inputs:meta.inputs,assets},attempts,
 commands:{original:['--test','rebuild/m3/w7-preview/today/test/gym.test.mjs','rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs'],replay:['--test','.tmp/d2-lifecycle-extra.test.mjs'],edges:['--test','.tmp/d2-lifecycle-r2-edges.test.mjs'],static:'.tmp/d2-lifecycle-r2-closure.mjs',identity:'.tmp/d2-lifecycle-r2-identity.mjs'},
 sourceFaults:{run:false,credit:0,unmodifiedProduct:true,ioFault:'Final failed-set witness and failed-settings control use actual test IndexedDB quota injection; no synthesized model/client result.'},files,
 limits:'Isolated C completion repair only. No B/D composition, standalone build/browser, private/seed/history/soak/native/H3/FULL/package/currentCI/provider/controller/host-swap/entry/world/deploy/import/phone proof. No product edits/push or PM acceptance/ruling/receipt lines.'};
assert.equal(result.runtime.node,'v22.23.2');assert.equal(result.runtime.nodeSHA256,'0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4');assert.equal(result.runtime.resolvedTz,'America/New_York');assert(result.runtime.nodeOptionsAbsent&&result.runtime.coverageAbsent);
const output=JSON.stringify(result,null,2)+'\n';fs.writeFileSync('.tmp/MEMORY-LIFECYCLE-R2-EVIDENCE.json',output);
console.log(JSON.stringify({verdict:result.verdict,head:before.head,original:141,replay:37,edges:{pass:3,fail:1},inputs:before.identities.length,closure:closure.files.length,buildTag,buildInputs:meta.inputs.length,assets,evidence:{bytes:Buffer.byteLength(output),sha256:hash(output)}}));
