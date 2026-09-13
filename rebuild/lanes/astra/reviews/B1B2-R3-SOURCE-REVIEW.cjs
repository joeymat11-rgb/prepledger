'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-b1b2-r3'),C='8e65805481091daacda3266ad9113b49553cf3f4',old='c4716edad91453e74ba17f70ab076781ff5367de';
const git=(...a)=>cp.execFileSync('git',a,{cwd:root,windowsHide:true,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']}),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(path.join(root,f));
const mapFile='rebuild/m4/workout/test/b1b2-source-changes.json',a=JSON.parse(read(mapFile)),previous=JSON.parse(git('show',old+':'+mapFile)),profileFile='rebuild/lanes/b/tooling/packages/B1-B2.json',profile=JSON.parse(read(profileFile)),oldProfile=JSON.parse(git('show',old+':'+profileFile));
const M=a.sourceBase,R=a.runtimeSource,S=a.successor.runtimeSource,T=a.repair.runtimeSource;
assert.equal(S,'48a3063a23528ed240eb2356226d237d2793a9da');assert.equal(T,'797e4cf39fac39148ccae784116999669b82caf3');
const {repair,...historical}=a;assert.deepEqual(historical,previous,'every original map field and R/S record unchanged');
assert.equal(a.runtime.flatMap(r=>r.hunks).length,65);assert.equal(a.successor.runtime.flatMap(r=>r.hunks).length,10);assert.equal(repair.runtime.flatMap(r=>r.hunks).length,3);
assert.deepEqual(repair.runtime.map(r=>r.file),['rebuild/engine/today.cjs']);assert.equal(repair.engineEvidence.length,4);
assert.deepEqual(a.nativeFieldDeltas,[]);assert.deepEqual(a.successor.nativeComparison,{from:M,to:S,fieldDeltas:[]});assert.deepEqual(repair.nativeComparison,{from:M,to:T,fieldDeltas:[]});
function replace(s,from,to,id){assert.equal(s.split(from).length,2,id+' unique site');return s.replace(from,to);}
function reconstruct(from,to,rows){return rows.map(row=>{const b=git('show',from+':'+row.file),p=git('show',to+':'+row.file);if(row.pre)assert.equal(sha(b),row.pre);if(row.post)assert.equal(sha(p),row.post);let f=b.toString(),r=p.toString();for(const h of row.hunks)f=replace(f,h.before,h.after,h.id);for(const h of [...row.hunks].reverse())r=replace(r,h.after,h.before,h.id+' inverse');assert.equal(f,p.toString());assert.equal(r,b.toString());return{file:row.file,from:sha(b),to:sha(p),hunks:row.hunks.map(h=>h.id)};});}
const original=reconstruct(M,R,a.runtime),successor=reconstruct(R,S,a.successor.runtime),current=reconstruct(S,T,repair.runtime),h3rows=[];
for(const h of a.originalH3.hunks){let row=h3rows.find(x=>x.file===h.file);if(!row){row={file:h.file,hunks:[]};h3rows.push(row);}row.hunks.push(h);}
const h3=reconstruct(a.h3SourceBase,M,h3rows);assert.equal(h3.flatMap(r=>r.hunks).length,4);
for(const [from,to,table]of [[R,S,a.successor],[S,T,repair]]){
 const declared=[...table.runtime.map(r=>'M\t'+r.file),...table.engineEvidence.map(r=>(r.pre===null?'A':'M')+'\t'+r.file)].sort();assert.deepEqual(git('diff','--no-renames','--name-status',from,to,'--','rebuild/engine').toString().trim().split('\n').sort(),declared);
 for(const row of table.engineEvidence){if(row.pre!==null)assert.equal(sha(git('show',from+':'+row.file)),row.pre);assert.equal(sha(git('show',to+':'+row.file)),row.post);}
}
assert.equal(git('rev-parse',C+':rebuild/engine').toString(),git('rev-parse',T+':rebuild/engine').toString());
const changed=git('diff','--name-only',old,C).toString().trim().split('\n');assert.equal(changed.length,17);
const engineInventory=git('ls-tree','-r',T,'rebuild/engine').toString().trim().split('\n').map(line=>{const [metadata,file]=line.split('\t');const oldBlob=git('rev-parse',S+':'+file).toString().trim(),blob=metadata.split(' ')[2];return{file,blob,oldBlob,changed:blob!==oldBlob,custody:'Git object metadata'};});
assert.deepEqual(engineInventory.filter(x=>x.changed).map(x=>x.file).sort(),[...repair.runtime,...repair.engineEvidence].map(x=>x.file).sort());
assert.deepEqual(Object.keys(profile.product),Object.keys(oldProfile.product));assert.equal(Object.keys(profile.product).length,112);
const parent=JSON.parse(read('rebuild/m4/spec/acceptance-h3-clean-init.json')),pins=[];
for(const [file,pin]of Object.entries(profile.product)){
 if(file==='rebuild/engine/seed.cjs'){assert.deepEqual(pin,{pre:parent.product[file].post,post:parent.product[file].post,role:'carried'});assert(!fs.existsSync(path.join(root,file)));pins.push({file,...pin,custody:'parent metadata only, content unread'});continue;}
 assert(!/\/private\/|^ledger\/|^src\/history|soak/i.test(file));assert.equal(sha(read(file)),pin.post);assert.equal(sha(git('show',C+':'+file)),pin.post);
 const existed=cp.spawnSync('git',['cat-file','-e',M+':'+file],{cwd:root,windowsHide:true,stdio:'ignore'}).status===0;assert.equal(existed?sha(git('show',M+':'+file)):null,pin.pre);pins.push({file,...pin});
}
assert.deepEqual(profile.children.map(c=>[c.name,c.argv]),oldProfile.children.map(c=>[c.name,c.argv]));assert.equal(profile.children.length,26);assert.deepEqual(profile.dIds,oldProfile.dIds);assert.equal(profile.dIds.length,24);
assert.deepEqual(profile.parent,oldProfile.parent);assert.deepEqual(profile.coverage,oldProfile.coverage);assert.deepEqual(profile.authorizations,oldProfile.authorizations);assert.deepEqual(profile.brief,oldProfile.brief);assert.deepEqual(profile.moves,oldProfile.moves);
const workflow=read('.github/workflows/rebuild.yml');assert.deepEqual(workflow,git('show',old+':.github/workflows/rebuild.yml'));const line=workflow.toString().split(/\r?\n/).find(l=>l.trim().startsWith('run: node --test rebuild/m3/w7-preview/today/test/'));const todayFiles=line.trim().slice('run: node --test '.length).split(' ');assert.deepEqual(todayFiles,profile.children.find(c=>c.name==='today-suites').argv.slice(2));assert.equal(todayFiles.length,14);assert.match(workflow.toString(),/os: \[ubuntu-latest, windows-latest\]/);
const runner=read('rebuild/lanes/b/tooling/b-package.cjs');assert.equal(sha(runner),profile.tooling.runnerSha256);assert.deepEqual(runner,git('show',old+':rebuild/lanes/b/tooling/b-package.cjs'));
assert.deepEqual(git('diff-tree','--no-commit-id','--name-only','-r',C).toString().trim().split('\n'),['rebuild/lanes/b/BUILD-B1B2-TOOLING-154-184.md']);
const profileNotes={mechanicalCitations:[profile.authorizations.owner.ledgerLine,profile.authorizations.contract.ledgerLine,profile.authorizations.theme.ledgerLine,profile.brief.acceptedLedgerLine.ledgerLine,232],amended246_248_R7_262MechanicalBinding:false,constructionCommission:'272 explicitly permits current review; final binding/composition remains held'};
const result={candidate:C,source:T,changed,original,successor,current,h3,entireHistoricalMapEqual:true,engineInventory,engineEvidence:repair.engineEvidence,pins,registration:{dIds:profile.dIds,parent:profile.parent,coverage:profile.coverage,children:profile.children,runnerSHA256:sha(runner),workflowSHA256:sha(workflow),todayFiles},profileNotes,nativeComparisons:[a.nativeFieldDeltas,a.successor.nativeComparison,repair.nativeComparison],builderReportRead:false};
fs.writeFileSync(path.join(base,'results/source-independent.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({paths:changed.length,originalHunks:65,successorHunks:10,repairHunks:3,engineEvidence:4,h3Hunks:4,pins:pins.length,children:26,original9_3_7CoverageUnchanged:true,profileNotes}));
