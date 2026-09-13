'use strict';
// Independent immutable source reconstruction and prospective registration audit.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2-r2'),C='c4716edad91453e74ba17f70ab076781ff5367de',old='cc6a1315003adc7f3f96d635980cfdf32b5a7a74';
const git=(...a)=>cp.execFileSync('git',a,{cwd:root,windowsHide:true,maxBuffer:8e6}),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(path.join(root,f));
const mapFile='rebuild/m4/workout/test/b1b2-source-changes.json',a=JSON.parse(read(mapFile)),previous=JSON.parse(git('show',old+':'+mapFile)),profile=JSON.parse(read('rebuild/lanes/b/tooling/packages/B1-B2.json')),M=a.sourceBase,R=a.runtimeSource,S=a.successor.runtimeSource;
for(const k of ['sourceBase','runtimeSource','h3SourceBase','runtime','originalH3','originals','nativePrograms'])assert.deepEqual(a[k],previous[k],k+' original provenance retained');
assert.equal(a.runtime.flatMap(r=>r.hunks).length,65);assert.equal(a.successor.runtime.flatMap(r=>r.hunks).length,10);assert.equal(a.successor.engineEvidence.length,5);assert.deepEqual(a.nativeFieldDeltas,[]);assert.deepEqual(a.successor.nativeComparison,{from:M,to:S,fieldDeltas:[]});
function replace(text,from,to,id){assert.equal(text.split(from).length,2,id+' one source site');return text.replace(from,to);}
function reconstruct(from,to,rows){return rows.map(row=>{const b=git('show',from+':'+row.file),p=git('show',to+':'+row.file);if(row.pre)assert.equal(sha(b),row.pre);if(row.post)assert.equal(sha(p),row.post);let forward=b.toString(),inverse=p.toString();for(const h of row.hunks)forward=replace(forward,h.before,h.after,h.id);for(const h of [...row.hunks].reverse())inverse=replace(inverse,h.after,h.before,h.id+' inverse');assert.equal(forward,p.toString());assert.equal(inverse,b.toString());return{file:row.file,from:sha(b),to:sha(p),hunks:row.hunks.map(h=>h.id)};});}
const original=reconstruct(M,R,a.runtime),successor=reconstruct(R,S,a.successor.runtime),h3rows=[];
for(const h of a.originalH3.hunks){let row=h3rows.find(x=>x.file===h.file);if(!row){row={file:h.file,hunks:[]};h3rows.push(row);}row.hunks.push(h);}
const h3=reconstruct(a.h3SourceBase,M,h3rows);assert.equal(h3.flatMap(r=>r.hunks).length,4);
const declared=[...a.successor.runtime.map(r=>'M\t'+r.file),...a.successor.engineEvidence.map(r=>(r.pre===null?'A':'M')+'\t'+r.file)].sort();assert.deepEqual(git('diff','--no-renames','--name-status',R,S,'--','rebuild/engine').toString().trim().split('\n').sort(),declared);
assert.equal(git('rev-parse',C+':rebuild/engine').toString(),git('rev-parse',S+':rebuild/engine').toString());
for(const row of a.successor.engineEvidence){if(row.pre!==null)assert.equal(sha(git('show',R+':'+row.file)),row.pre);const b=git('show',S+':'+row.file);assert.equal(sha(b),row.post);assert.deepEqual(read(row.file),b);assert.deepEqual(git('show',C+':'+row.file),b);}
for(const row of a.successor.runtime)assert.deepEqual(read(row.file),git('show',S+':'+row.file));
const pins=[];assert.equal(Object.keys(profile.product).length,112);
const parent=JSON.parse(read('rebuild/m4/spec/acceptance-h3-clean-init.json'));
for(const[file,pin]of Object.entries(profile.product)){
 if(file==='rebuild/engine/seed.cjs'){assert.deepEqual(pin,{pre:parent.product[file].post,post:parent.product[file].post,role:'carried'});pins.push({file,custody:'immutable parent metadata only; content never read',...pin});continue;}
 assert(!/\/private\/|^ledger\/|^src\/history|soak/i.test(file));assert.equal(sha(read(file)),pin.post);assert.equal(sha(git('show',C+':'+file)),pin.post);
 const existed=cp.spawnSync('git',['cat-file','-e',M+':'+file],{cwd:root,windowsHide:true,stdio:'ignore'}).status===0;
 assert.equal(existed?sha(git('show',M+':'+file)):null,pin.pre);pins.push({file,...pin});
}
assert.equal(profile.children.length,26);assert.equal(new Set(profile.children.map(x=>x.name)).size,26);assert.equal(profile.dIds.length,24);assert.equal(new Set(profile.dIds).size,24);
const workflow=read('.github/workflows/rebuild.yml').toString(),line=workflow.split(/\r?\n/).filter(l=>l.trim().startsWith('run: node --test rebuild/m3/w7-preview/today/test/'));assert.equal(line.length,1);const targets=line[0].trim().slice('run: node --test '.length).split(' ');assert.deepEqual(targets,profile.children.find(c=>c.name==='today-suites').argv.slice(2));assert.equal(targets.length,14);
assert.equal(workflow.split('run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1-B2').length,2);assert.match(workflow,/os: \[ubuntu-latest, windows-latest\]/);assert(!targets.some(x=>x.includes('*')));
const runner=read('rebuild/lanes/b/tooling/b-package.cjs').toString();assert.equal(sha(runner),profile.tooling.runnerSha256);
const literals=JSON.stringify({brief:profile.brief,authorizations:profile.authorizations,token:profile.coverage.superseded.rulingLineSha256});
const amendmentChecks={notesMention246and248:profile.notes.some(x=>x.includes('246/248')),mechanicalCitations:[profile.authorizations.owner.ledgerLine,profile.authorizations.contract.ledgerLine,profile.authorizations.theme.ledgerLine,profile.brief.acceptedLedgerLine.ledgerLine,232],mechanical246or248Citation:false,scope:'Current construction is authorized by PM246/248/254 externally. Final theme/composition must bind these changes before any seal; current234 names the earlier232 brief only.'};
assert(!literals.includes('"ledgerLine":246')&&!literals.includes('"ledgerLine":248'));assert(!/B1B2.*(?:246|248).*LINE_SHA|B1B2_R7/.test(runner));
assert.deepEqual(git('diff-tree','--no-commit-id','--name-only','-r',C).toString().trim().split('\n'),['rebuild/lanes/b/BUILD-B1B2-TOOLING-154-184.md']);
const result={candidate:C,original,successor,h3,engineEvidence:a.successor.engineEvidence,wholeEngineCequalsS:true,original65And4Unchanged:true,originalProgramPinsUnchanged:true,pins,registration:{sourceBase:profile.sourceBase,dIds:profile.dIds,children:profile.children,workflowSHA256:sha(workflow),literalTodayTargets:targets,currentCLIExecuted:false},amendmentChecks,nativeDeltaTables:'Both remain empty/unapproved; no field amendment inferred.'};
fs.writeFileSync(path.join(base,'results/source-independent.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({originalHunks:65,h3Hunks:4,successorHunks:10,engineEvidence:5,pins:pins.length,children:26,Today:14,amendmentChecks}));
