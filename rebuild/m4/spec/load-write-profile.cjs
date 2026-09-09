'use strict';
// Closed cumulative evidence profile. The accepted import/D12 artifact and
// runner are immutable parents; a new independent receipt is required for PASS.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),L=require(path.join(P,'legacy-gates.cjs')),S=require('./load-write-source.cjs');
const ID='M2-LOAD-WRITES',ARTIFACT='rebuild/m4/spec/acceptance-load-writes.json',REVIEW='rebuild/m4/spec/review-load-writes.json';
const PARENT={artifact:'rebuild/conform/v4/postfix/acceptance-step-efficacy.json',sha256:'ff164b8620ee0ab7851e7d9283b32d1b330b261fad1f02178d4266131cfcabb1',envelope:'rebuild/conform/v4/postfix/manifest-step-efficacy.json',envelopeSha256:'7c78a3b85cb8001bd9cf3c0076faa410a203e66cfdd9cde6598e3617a9c648ec'};
const REQUIRED=['D12','D33','D34','D35','D41','D43'];
const HELPERS=['source','reference','expectations','traces','legacy','witnesses','source-carriers','cases','direct','parent-cases','inherited-carriers','profile','second','package'].map(n=>'rebuild/m4/spec/load-write-'+n+'.cjs');
const FILES=[...HELPERS,'rebuild/m4/spec/load-write.test.cjs','rebuild/m4/spec/load-write-profile.test.cjs',...['model','view','package'].map(n=>'rebuild/m3/w7-preview/test/'+n+'.test.cjs'),'.github/workflows/rebuild.yml'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),keys=(o,list)=>assert.deepEqual(Object.keys(o).sort(),list.slice().sort(),'Closed profile keys');
function parent(){
 assert.equal(S.sha(fs.readFileSync(path.join(root,PARENT.artifact))),PARENT.sha256);assert.equal(S.sha(fs.readFileSync(path.join(root,PARENT.envelope))),PARENT.envelopeSha256);
 const loaded=A.load(root,path.join(root,PARENT.envelope));assert(A.verifyReceipts(root,loaded.acceptance,loaded.envelope,loaded.bytes),'Real accepted parent');
 for(const [file,hash]of Object.entries(loaded.acceptance.executionPins))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged parent executable '+file);
 for(const [file,hash]of Object.entries(loaded.acceptance.baseline.publicPins))if(!/^rebuild\/engine\/[^/]+\.cjs$/.test(file))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged frozen input '+file);
 const old=S.baseline(root);for(const [file,hash]of Object.entries(loaded.acceptance.candidateEngine))assert.equal(S.sha(old['rebuild/engine/'+file]),hash,'Accepted parent product');
 return loaded;
}
function proposed(){const {acceptance:a}=parent();return {version:1,packageId:ID,sourceBase:S.BASE,parent:PARENT,requiredIds:REQUIRED,matrix:a.matrix,gates:a.gates,product:S.verify(root),executionPins:Object.fromEntries(FILES.map(file=>[file,S.sha(fs.readFileSync(path.join(root,file)))]))};}
function verify(){
 const raw=fs.readFileSync(path.join(root,ARTIFACT)),m=require(path.join(P,'strict-json.cjs')).parseExact(raw);keys(m,['version','packageId','sourceBase','parent','requiredIds','matrix','gates','product','executionPins']);
 assert(same(m,proposed()),'Exact closed cumulative profile and all input hashes');
 const {acceptance:a}=parent();const review=require(path.join(P,'strict-json.cjs')).parseExact(fs.readFileSync(path.join(root,REVIEW)));keys(review,['version','status','receipt']);assert.equal(review.version,1);assert(['PENDING','ACCEPTED'].includes(review.status));
 let accepted=false;
 if(review.status==='PENDING')assert.equal(review.receipt,null);
 else{
  const r=review.receipt;assert(r&&typeof r.commit==='string','Missing independent receipt');L.verifyReceipt(root,r.commit,r,{role:'cowork'});
  const match=/^(?:- [^\r\n]+ · cowork · )?POSTFIX-ACCEPTANCE M2-LOAD-WRITES ([a-f0-9]{40}) (rebuild\/m4\/spec\/acceptance-load-writes\.json) ([a-f0-9]{64}) ACCEPTED$/.exec(r.line);
  assert(match&&match[2]===ARTIFACT&&match[3]===S.sha(raw),'Exact independent verdict');assert(L.object(root,match[1],ARTIFACT).equals(raw),'Reviewed artifact bytes');
  L.git(root,['merge-base','--is-ancestor',match[1],'HEAD']);L.git(root,['merge-base','--is-ancestor',r.commit,'refs/remotes/origin/rebuild/t2-client-core']);
  for(const [file,hash]of Object.entries({...m.product,...m.executionPins}))assert.equal(S.sha(L.object(root,match[1],file)),hash,'Reviewed product/execution bytes');
  accepted=true;
 }
 return {root,manifest:m,parent:a,accepted,artifactSha256:S.sha(raw)};
}
module.exports={ID,ARTIFACT,REVIEW,PARENT,REQUIRED,FILES,parent,proposed,verify};
if(require.main===module){try{assert.deepEqual(process.argv.slice(2),['--seal']);const reviewFile=path.join(root,REVIEW);if(fs.existsSync(reviewFile))assert.equal(JSON.parse(fs.readFileSync(reviewFile)).status,'PENDING','Never reseal an accepted artifact');fs.writeFileSync(path.join(root,ARTIFACT),JSON.stringify(proposed(),null,2)+'\n');if(!fs.existsSync(reviewFile))fs.writeFileSync(reviewFile,JSON.stringify({version:1,status:'PENDING',receipt:null},null,2)+'\n');console.log('LOAD PROFILE SEALED: public source hashes only; independent acceptance PENDING');}catch(_){console.error('LOAD PROFILE SEAL FAIL; details withheld');process.exitCode=1;}}
