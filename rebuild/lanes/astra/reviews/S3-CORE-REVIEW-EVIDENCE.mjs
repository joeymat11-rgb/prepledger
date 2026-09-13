// Reviewer evidence collector. Reads only named public pins and this reviewer's
// own two scratch runs. Does not execute a product, mutate it, or read rationale.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../../..');
const candidate='ebc4c4e870497199c113c5e5c85bdced679589cf';
const runNames=['4b3d74ae-2800-46e5-b29e-28308fe27f68','39c85ddf-ac41-4663-a90a-c31375db7143'];
const runs=runNames.map(id=>path.join(root,'.tmp/s3',id));
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p),json=p=>JSON.parse(read(p));
const relative=p=>path.relative(root,p).split(path.sep).join('/');
const identity=p=>({path:relative(p),bytes:read(p).length,sha256:sha(read(p))});
const manifestPath='rebuild/m4/spec/s3-portable-sources.json';
const manifest=json(path.join(root,manifestPath));
const manifestHash='c7623bcaa982182ab2cccd5ca542c450a758a4b8a2be99b0d4c063d55926a15d';
assert.equal(sha(read(path.join(root,manifestPath))),manifestHash);
assert.equal(manifest.sources.length,111);
for(const base of [root,...runs.map(r=>path.join(r,'tree'))]){
 assert.equal(sha(read(path.join(base,manifestPath))),manifestHash);
 for(const entry of manifest.sources){
  const file=path.resolve(base,entry.path);
  assert.equal(fs.realpathSync.native(file).toLowerCase(),file.toLowerCase());
  assert.equal(sha(read(file)),entry.sha256,relative(file));
 }
}
for(const entry of manifest.sources){
 const blob=execFileSync('git',['show',candidate+':'+entry.path],{cwd:root,windowsHide:true,maxBuffer:4e6});
 assert.equal(sha(blob),entry.sha256,entry.path+' exact Git blob');
}
const bindingInputs=json(path.join(root,'.tmp/review-inputs/IDENTITIES.json'));
const inventories=['suite-core','suite-import'].map(mode=>{
 const file=path.join(runs[0],mode+'-inventory.json'),value=json(file);
 assert.equal(value.total.fail,0);assert.equal(value.total.skipped,0);assert.equal(value.total.cancelled,0);
 return {mode,...identity(file),total:value.total,files:value.files.map(f=>({file:f.file,sha256:f.sha256,discovered:f.discovered,executed:f.executed}))};
});
const totals=log=>Object.fromEntries(['tests','pass','fail','cancelled','skipped'].map(k=>{
 const matches=[...log.matchAll(new RegExp('^# '+k+' ([0-9]+)$','gm'))];
 assert.equal(matches.length,1,'one actual '+k+' total');return [k,Number(matches[0][1])];
}));
const mutations=[];
for(const name of fs.readdirSync(runs[0]).filter(n=>n.startsWith('mutation-'))){
 const dir=path.join(runs[0],name),e=json(path.join(dir,'evidence.json'));assert.equal(e.restored,true);
 for(const c of e.cases){
  const file=path.join(dir,c.id+'.log'),log=read(file).toString(),lines=log.split(/\r?\n/);
  const starts=lines.flatMap((line,i)=>/^not ok [0-9]+ - /.test(line)&&line.includes(c.test)?[i]:[]);
  assert.equal(starts.length,1,c.id+': unique named failure');
  const from=starts[0];let end=from+1;
  while(end<lines.length&&!/^(# Subtest:|(?:not ok|ok) [0-9]+ - |1\.\.)/.test(lines[end]))end++;
  assert.ok(lines.slice(from,end).some(line=>/^  code: 'ERR_ASSERTION'$/.test(line)),c.id+': selected diagnostic itself is assertion');
  const restoredFile=path.join(dir,c.id+'-restored.log'),restored=totals(read(restoredFile).toString());
  assert.equal(restored.fail,0);assert.equal(restored.skipped,0);assert.equal(restored.cancelled,0);
  assert.equal(restored.tests,restored.pass);
  mutations.push({...c,selectedOwnAssertion:true,log:identity(file),restoredLog:identity(restoredFile),restoredTotals:restored});
 }
}
assert.equal(mutations.length,46);
const browserFile=path.join(runs[0],'browser-core-evidence.json'),browser=json(browserFile);
assert.equal(browser.source_manifest_sha256,manifestHash);assert.equal(browser.cells,19);assert.equal(browser.killed,true);
assert.equal(browser.scope,'PORTABLE ONLY');
const logs=[
 [runs[1],'reviewer-admission.log'],[runs[1],'reviewer-provider.log'],
 [runs[1],'reviewer-provider-final.log'],[runs[1],'reviewer-draft51.log'],[runs[0],'reviewer-harness.log']
].map(([run,name])=>{const file=path.join(run,'logs',name);return {...identity(file),...(name==='reviewer-harness.log'?{}:{totals:totals(read(file).toString())})};});
const harnessDir=fs.readdirSync(runs[0]).filter(n=>n.startsWith('reviewer-s3-harness-'));
const draftDir=fs.readdirSync(runs[1]).filter(n=>n.startsWith('review-draft51-'));
assert.equal(harnessDir.length,1);assert.equal(draftDir.length,1);
const harnessFile=path.join(runs[0],harnessDir[0],'annex-evidence.json');
const draftFile=path.join(runs[1],draftDir[0],'evidence.json');
const annexNames=['S3-ADMISSION-REVIEW-ANNEX.mjs','S3-PROVIDER-REVIEW-ANNEX.mjs','S3-HARNESS-REVIEW-ANNEX.mjs','S3-PROVIDER-DRAFT51-ANNEX.mjs','S3-CORE-REVIEW-EVIDENCE.mjs'];
const evidence={profile:'earned/independent-s3-core-review/v1',candidate,
 code:'0d50571fad8643f684685670807f2370df3b22f1',parent:manifest.implementationParent,sourceM:manifest.sourceM,
 manifest:identity(path.join(root,manifestPath)),verifiedPublicSources:111,originalAndBothScratchCopiesMatch:true,allMatchExactCandidateGitBlobs:true,
 toolVersions:json(path.join(runs[0],'run.json')).versions,bindingInputs,runs:runNames,
 inventories,mutations,
 browser:{...identity(browserFile),cells:browser.cells,scope:browser.scope,killed:browser.killed,realC2:browser.realC2,
  profileIsSchema:browser.profile==='earned/s3-browser-core/v1',first:browser.first,second:browser.second,
  graphs:browser.graph.map(g=>({name:g.name,sha256:g.sha256,inputs:g.inputs.length}))},
 independentLogs:logs,independentHarness:{...identity(harnessFile),result:json(harnessFile)},
 independentDraft51:{...identity(draftFile),result:json(draftFile)},
 annexes:annexNames.map(n=>identity(path.join(here,n))),
 limits:'Public synthetic core review only. Builder report unread at verdict. No owner data, real C2, protected final consumer/capture tests, private gate, PM acceptance, integration or deployment.'};
fs.writeFileSync(path.join(here,'S3-CORE-REVIEW-EVIDENCE.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({candidate,sources:111,suites:inventories.map(i=>i.total.tests),namedAssertionMutants:mutations.length,browserCells:browser.cells,annexes:annexNames.length}));
