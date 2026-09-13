'use strict';
// Read-only authority/profile checks using the actual runner prefix; main and seal never execute.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),C='cc6a1315003adc7f3f96d635980cfdf32b5a7a74',M='100820aa47a4f8729642033499eaec0f0ee282e1';
assert.match(root.replaceAll('\\','/'),/\/work\/pm-caretaker\/review-b1b2-complete$/);assert.equal(process.version,'v22.23.2');
const git=(...a)=>cp.execFileSync('git',a,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']}),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const file=path.join(root,'rebuild/lanes/b/tooling/b-package.cjs'),source=fs.readFileSync(file,'utf8'),boundary='// ------------------------------------------------------------------ 8. main sequence';
assert.equal(sha(source),'c8fce2391f2de75cb589d274abc859b698dca915e39c9d94df25b3770548326f');assert.equal(source.split(boundary).length,2);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'.tmp/er-b1b2/tooling-manifest.json')));for(const row of manifest.files)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file);
const s=JSON.parse(fs.readFileSync(path.join(root,'rebuild/lanes/b/tooling/packages/B1-B2.json')));
const moduleInstance=new Module(file,module);moduleInstance.filename=file;moduleInstance.paths=Module._nodeModulePaths(path.dirname(file));const originalArgv=process.argv;process.argv=[process.execPath,file,'--ci','--package','B1-B2'];
try{moduleInstance._compile(source.slice(0,source.indexOf(boundary))+'\nmodule.exports={pmLedger,supersessionRuling,CHAIN_REF,PM_HANDOVER,B1B2_PARENT,B1B2_FAMILIES};',file);}finally{process.argv=originalArgv;}
const A=moduleInstance.exports,tip=git('rev-parse',A.CHAIN_REF).toString().trim(),lines=git('show',tip+':rebuild/DECISIONS.md').toString().split(/\r?\n/),candidateLines=git('show',C+':rebuild/DECISIONS.md').toString().split(/\r?\n/),evidence={candidate:C,chain:tip,checks:[]};
function check(name,body){const details=body();evidence.checks.push({name,status:'PASS',details});}
check('actual current chain resolves brief and theme through193 issuer',()=>{
 for(const c of [s.brief.acceptedLedgerLine,s.authorizations.theme]){assert.equal(A.pmLedger(A.CHAIN_REF,c,[s.packageId]),'Astra PM');assert.equal(lines.filter(l=>sha(l)===c.lineSha256).length,1);assert.equal(candidateLines.filter(l=>sha(l)===c.lineSha256).length,0);}
 return {coordinate:s.brief.acceptedLedgerLine.ledgerLine,sha256:s.brief.acceptedLedgerLine.lineSha256,candidateContainsCitation:false,lookup:'hard-coded actual remote chain, by exact unique Git line/hash'};
});
check('actual232 current five-family grant is distinct from187',()=>{const r=A.supersessionRuling(s);assert.deepEqual([...r.granted].sort(),Object.keys(A.B1B2_FAMILIES).sort());assert.notEqual(s.coverage.superseded.rulingLineSha256,A.B1B2_PARENT.supersessionLineSha256);return{line:r.at,sha256:s.coverage.superseded.rulingLineSha256,families:[...r.granted].sort()};});
check('historical issuer adoption remains byte-identical to reviewed198',()=>{const old=git('show','f195b7fe69c8ede31c322f5da72481e63b8c3b0b:rebuild/lanes/b/tooling/b-package.cjs').toString();const take=t=>t.slice(t.indexOf('function pmRole('),t.indexOf('function claim('));assert.equal(take(source),take(old));return{sha256:sha(take(source)),historicalCandidate:'f195b7fe69c8ede31c322f5da72481e63b8c3b0b'};});
check('actual187 immutable parent artifact and later-authored review metadata',()=>{
 const p=A.B1B2_PARENT;for(const at of [C,M,tip])for(const[f,h]of [[p.artifact,p.sha256],[p.review,p.reviewSha256]])assert.equal(sha(git('show',at+':'+f)),h);
 assert.equal(sha(git('show',p.reviewedCommit+':'+p.artifact)),p.sha256);
 const receipt=git('show',p.receiptBase+':rebuild/DECISIONS.md').toString().split(/\r?\n/);assert.equal(receipt.filter(l=>sha(l)===p.receiptLineSha256).length,1);assert.equal(lines.filter(l=>sha(l)===p.receiptLineSha256).length,1);git('merge-base','--is-ancestor',p.reviewedCommit,C);git('merge-base','--is-ancestor',p.reviewedCommit,tip);
 const parent=JSON.parse(git('show',C+':'+p.artifact));assert.deepEqual(parent.coverage.covered,[]);assert.deepEqual(parent.coverage.byChild,{});assert.equal(parent.coverage.superseded.length,9);assert.equal(parent.coverage.run.length,10);return{reviewedCommit:p.reviewedCommit,receiptBase:p.receiptBase,artifact:p.sha256,review:p.reviewSha256};
});
check('exact236 thirteen N2 post-images retained',()=>{
 const go=git('show','061fe6ba68469989dd29c20009ba36351d19fac3:rebuild/lanes/astra/N2-R6-COMPOSITION-PM-GO.md');assert.equal(sha(go),'7985cc08d6bbf98aa06556641e646cab658fc082d86cb08dc69e18c24a35272b');const matches=[...go.toString().matchAll(/^\| (rebuild\/[^ |]+) \| ([a-f0-9]{64}) \|$/gm)];assert.equal(matches.length,13);for(const[,f,h]of matches){assert.equal(sha(git('show',C+':'+f)),h);assert.equal(sha(git('show','bfc293573e1010559e0119bdc7ff666e89f740cc:'+f)),h);assert.equal(s.product[f].post,h);}return{count:matches.length,source:'bfc293573e1010559e0119bdc7ff666e89f740cc'};
});
check('construction remains unsealed and current tip ancestry is unsatisfied',()=>{
 const relation=cp.spawnSync('git',['merge-base','--is-ancestor',tip,C],{cwd:root,windowsHide:true});assert.equal(relation.status,1);assert.equal(s.authorizations.freeze??null,null);const names=git('ls-tree','-r','--name-only',C,'rebuild/m4/spec/acceptance-b1-b2.json','rebuild/m4/spec/review-b1-b2.json').toString().trim();assert.equal(names,'');return{currentTipAncestorOfCandidate:false,freezeAbsent:true,artifactsAbsent:true,consequence:'Later explicit final composition/freeze and real grant needed; citation validity alone is no seal or package PASS'};
});
fs.writeFileSync(path.join(root,'.tmp/er-b1b2/results/authority-evidence.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
