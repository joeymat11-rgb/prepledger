import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const head='1316639e71cc8b23b24570bb6aa0e7508da90032',source='aec118c4c23eb55e32e29ffdf8be60cfb30f28d0',base='0c744cbd2d53c3be738320f726004a4e1871cce5';
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=(...a)=>execFileSync('git',a).toString().trim();
const read=f=>{assert(!/^(ledger\/|src\/history\.js$|rebuild\/(conform\/private\/|soak\/|engine\/(seed|index|migrate|merge)\.cjs$|m4\/workout\/engine-runtime\.cjs$|lanes\/c\/MEMORY-LIFECYCLE-FOUNDATION-REPORT\.md$))/.test(f)&&!f.startsWith('../')&&!path.isAbsolute(f),'UNLICENSED_BEFORE_READ '+f);return fs.readFileSync(f);};
assert.equal(git('rev-parse','HEAD'),head);assert.equal(git('status','--porcelain=v1'),'');
const before=JSON.parse(read('.tmp/d2-lifecycle-identity-before.json')),after=JSON.parse(read('.tmp/d2-lifecycle-identity-after.json'));
assert.deepEqual(before,after);
for(const f of before.identities)assert.equal(hash(read(f.path)),f.sha256,f.path);
const closure=JSON.parse(read('.tmp/d2-lifecycle-closure.json'));
const meta=JSON.parse(read('.tmp/w7-today-build/app.js.meta.json'));
for(const f of meta.inputs)assert.equal(hash(read(f.path)),f.sha256,f.path+' S14 build input');
const buildId=hash(meta.inputs.map(f=>f.path+' '+f.sha256).sort().join('\n')),buildTag='earned-'+buildId.slice(0,12);
const assetNames=['app.js','index.html','styles.css'];
assert.deepEqual(fs.readdirSync('.tmp/w7-today-dist').sort(),assetNames);
const assets=assetNames.map(name=>{const b=read('.tmp/w7-today-dist/'+name);return{name,bytes:b.length,sha256:hash(b)};});
assert(read('.tmp/w7-today-dist/app.js').toString().includes(buildTag));
function tap(name,expected){
 const text=read('.tmp/'+name).toString();
 const fields=Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(k=>[k,+text.match(new RegExp('^# '+k+' (\\d+)','m'))[1]]));
 assert.deepEqual(fields,expected);
 return{log:name,...fields,topLevelNames:[...text.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)].map(m=>({name:m[2],outcome:m[1]})),asynchronousAfterTest:/generated asynchronous activity after the test ended/.test(text)};
}
const totals=(tests,pass,fail)=>({tests,pass,fail,cancelled:0,skipped:0,todo:0});
const original=tap('d2-lifecycle-original.tap',totals(137,137,0));
const extra=tap('d2-lifecycle-extra.tap',totals(37,35,2));
assert.equal(extra.asynchronousAfterTest,false);
assert.deepEqual(extra.topLevelNames.filter(x=>x.outcome==='not ok').map(x=>x.name),[
 'D2 independent entry edits do not prevent confirmed settings Save clearing its unchanged editor',
 'D2 independent editor edits do not hide an acknowledged set log or suppress successful-log clearing',
]);
const attempted=tap('d2-lifecycle-extra-attempt1.tap',totals(37,34,3));
assert.equal(attempted.asynchronousAfterTest,true);
const intermediate=tap('d2-lifecycle-extra-before-observations.tap',totals(37,35,2));
const evidenceNames=['d2-lifecycle-closure.mjs','d2-lifecycle-closure.json','d2-lifecycle-identity.mjs','d2-lifecycle-identity-before.json','d2-lifecycle-identity-after.json','d2-lifecycle-evidence.mjs','d2-lifecycle-original.tap','d2-lifecycle-extra.test.mjs','d2-lifecycle-extra.tap','d2-lifecycle-extra-attempt1.test.mjs','d2-lifecycle-extra-attempt1.tap','d2-lifecycle-extra-before-observations.test.mjs','d2-lifecycle-extra-before-observations.tap','d2-lifecycle-race-settings.json','d2-lifecycle-race-log.json','d2-lifecycle-root-install.log','d2-lifecycle-w6-install.log','d2-lifecycle-w5-install.log','w7-today-build/app.js.meta.json'];
const files=evidenceNames.map(name=>{const bytes=read('.tmp/'+name);return{path:'.tmp/'+name,bytes:bytes.length,sha256:hash(bytes)};});
const logRace=JSON.parse(read('.tmp/d2-lifecycle-race-log.json')),settingsRace=JSON.parse(read('.tmp/d2-lifecycle-race-settings.json'));
assert.deepEqual([logRace.modelPhase,logRace.visibleUndo,logRace.visibleLog,logRace.changedCalls,logRace.effort],['saved',false,true,0,'2']);
assert.equal(logRace.opsAfter,logRace.opsBefore+1);assert.equal(settingsRace.opsAfter,settingsRace.opsBefore+1);
const result={reviewer:'Lane D2 / Astra MAX',verdict:'REJECT',head,source,base,root:process.cwd(),authority:{dispatch:'efdbab9777cc2fba44278ac6495ccc44b92b0fd6',decisions:[266,268,270],eLifecycle:'0f57c99c83be7e13628c2f4623aace6ff8ea5a16'},builderReportUnread:true,sourceIdentity:before,
 runtime:{node:process.version,pnpm:'9.15.9',tz:process.env.TZ,resolvedTz:Intl.DateTimeFormat().resolvedOptions().timeZone,temp:process.env.TEMP,tmp:process.env.TMP,nodeOptionsAbsent:!process.env.NODE_OPTIONS,coverageAbsent:!process.env.NODE_V8_COVERAGE},
 closure,original,extra,build:{origin:'Unchanged S14 embedded call only; no separate build/browser',buildId,buildTag,inputs:meta.inputs,assets},
 findings:[
  {id:'D2-L1',priority:1,file:'rebuild/m3/w7-preview/today/gym-app.mjs',lines:[437,442,452],cause:'Set-log completion compares the shared revision that machine-editor input also increments at282/121.',trigger:'On the active set, hold the actual client write, edit only the machine-setting value, then let the actual write acknowledge.',observation:logRace,expected:'Keep the newer machine editor and show the acknowledged Saved/Undo state, clear only the submitted set inputs/effort and notify the caller exactly as the original successful log.',witness:'.tmp/d2-lifecycle-extra.test.mjs',test:'D2 independent editor edits do not hide an acknowledged set log or suppress successful-log clearing'},
  {id:'D2-L2',priority:2,file:'rebuild/m3/w7-preview/today/gym-app.mjs',lines:[301,302,326,380,381,408],cause:'Settings Save uses the same global revision, so independent performed-input or effort edits invalidate an unchanged editor submission.',trigger:'Save Seat=four; pause actual settings handler; change only performed load/reps to empty strings and choose effort; allow confirmed Save.',observation:settingsRace,expected:'Preserve the new performed draft but clear the unchanged, durably saved editor on confirmation. Guard each submission against changes to its own draft, while retaining mount ownership protection.',witness:'.tmp/d2-lifecycle-extra.test.mjs',test:'D2 independent entry edits do not prevent confirmed settings Save clearing its unchanged editor'},
 ],
 ownProof:{actionCases:30,kinds:['start','logSet','undo','finish','closeUnfinished'],modes:['confirmed','outcomeUnknown','stored','durable','committed','abort'],mechanism:'Actual production gym model/client calls. Unknown/stored/durable/committed envelopes injected only after a genuine confirmed commit. Quota refusal occurs at real IndexedDB API. Exact prior operations/outbox preserved, additions counted; original prepared/resume/edit handles retained. Full finish has all actual sets logged first.',readCase:'Real read handler/client gate, both success and failure; immutable snapshots and synchronous counters; no operation change.',uiCases:6,unmodifiedProduct:true},
 attempts:[{...attempted,attribution:'One extra harness failure assumed an old resumed write would commit after a newer mount had prepared another continuation. Final witness delays acknowledgement AFTER the genuine commit. The first run also closed the DOM before Cancel repaint settled; teardown now awaits actual lifecycle counts. Both are retained and uncredited. Two genuine cross-draft failures were already present.'},{...intermediate,attribution:'Corrected client seam and teardown; both product failures remain. The final replay adds synthetic observation JSON immediately before the same intended assertions, without changing their outcomes.'}],
 commands:{original:['--test','rebuild/m3/w7-preview/today/test/gym.test.mjs','rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs'],extra:['--test','.tmp/d2-lifecycle-extra.test.mjs'],static:'.tmp/d2-lifecycle-closure.mjs',identity:'.tmp/d2-lifecycle-identity.mjs'},
 sourceFaults:{run:false,credit:0,why:'The unmodified candidate already fails two intended independent production-path assertions; no source mutations or product repairs were introduced. All134 read inputs and actual embedded-build input bytes remain exact.'},
 files,limits:'Isolated C foundation only. No provider/controller/host-swap/entry/world/full-memory/browser/private/seed/history/native/H3/FULL/package/currentCI/deploy/import/phone use proof. No shared or candidate ancestry push; immutable artifacts are handed only to PM for publication.',
};
assert.equal(result.runtime.node,'v22.23.2');assert.equal(result.runtime.resolvedTz,'America/New_York');assert(result.runtime.nodeOptionsAbsent&&result.runtime.coverageAbsent);
fs.writeFileSync('.tmp/MEMORY-LIFECYCLE-FOUNDATION-EVIDENCE.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({head,verdict:'REJECT',original137:true,extra:{tests:37,pass:35,fail:2},sourceInputs:134,moduleInputs:109,build:buildTag,buildInputs:meta.inputs.length,assets,sha256:hash(read('.tmp/MEMORY-LIFECYCLE-FOUNDATION-EVIDENCE.json'))}));
