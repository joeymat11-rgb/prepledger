'use strict';
// Closed cumulative evidence profile. The accepted import/D12 artifact and
// runner are immutable parents; a new independent receipt is required for PASS.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const A=require(path.join(P,'acceptance.cjs')),L=require(path.join(P,'legacy-gates.cjs')),S=require('./load-write-source.cjs');
const ID='M2-LOAD-WRITES',ARTIFACT='rebuild/m4/spec/acceptance-load-writes.json',REVIEW='rebuild/m4/spec/review-load-writes.json';
const PARENT={artifact:'rebuild/conform/v4/postfix/acceptance-step-efficacy.json',sha256:'ff164b8620ee0ab7851e7d9283b32d1b330b261fad1f02178d4266131cfcabb1',envelope:'rebuild/conform/v4/postfix/manifest-step-efficacy.json',envelopeSha256:'7c78a3b85cb8001bd9cf3c0076faa410a203e66cfdd9cde6598e3617a9c648ec'};
const REQUIRED=['D12','D33','D34','D35','D41','D43'];
// Actual CC37 integrator-local theme line (report a76a4b26); not publication or package acceptance.
const THEME={"role":"cowork","line":"- 2026-09-10 · cowork · LOAD-WRITES THEME (D41/D43) ACCEPTED as the behaviour/delta contract for the M2-LOAD-WRITES package — reviewed bytes rebuild/m4/spec/PERFORMED-ENGINE-v1.md at 3e908d2eed586288cebfaa12e3b0625671949079 (28,085 bytes, sha256 9d5cc0f367462d41af85bb75954b11614a197dced69398337514f875a624de1c), sections 0 and 6 only; sections 1–5 (rich-input guidance) remain PROPOSED and are neither accepted nor authorized by this line. Checked by execution against rebuild/m2/AUDIT-REGISTER.md D41 (443–452) and D43 (453–462) at 28ff3be and the owner's ruling (line 60: D41 APPROVED-FIX, D43 APPROVED-FIX) under the accepted gate contract (49) and mechanism (62): the product diff 28ff3be→3e908d2 under rebuild/engine is exactly writers.cjs 8b4cc4048d00e36845e2652ee939583d55ee06132e166701945cc64fde136d36 → 008d92961d210ed07850ea881bd3a9f01ee873c1958f8b7d3a47506342c96bf5 in three hunks (completeSession:262 copies q.newWSets only when it is an array; completeSession:400 prefers the entry's numeric e.w over the configured fallback; applyAgentProposal:2295 translates an existing per-set vector by new−old when the old scalar is numeric) plus the verbatim move of the earnWalk declaration (sha256 888af1dc693a4a0929b6883a7ce5393f908890cb633059e193fe92fd1bb212c3 at 28ff3be) into rebuild/engine/earn.cjs (4b8838807ee973e6cc31a75a74c5d5b389efc8b640433c09df0dd12dfd0584da) with migrate.cjs delegating and still exporting earnWalk and index.cjs registering earn.cjs after migrate.cjs; the expected deltas (queued 105/100 retained from 100/95; consented reset 100→90 moves 100/95→90/85; owned-standard entry 110 stored, repeated 110/90 kept) are the register laws' own cases and the stated controls are the right negative controls for their mutants. The rebuild/m4/spec wrapper (load-write-package.cjs wrapping the immutable rebuild/conform/v4/postfix runner; PACKAGE PASS receipt-gated by the D12 semantics) is ACCEPTABLE as a closed cumulative profile variant ONLY with the citation binding required by line 49 addition (1): the profile must carry authorizations {owner = line 60, contract = line 49 (both inherited byte-equal from the D12 artifact), theme = this line by sha256, review claim POSTFIX-ACCEPTANCE M2-LOAD-WRITES … ACCEPTED} and the runner must confirm the owner and theme lines at the receipt base and the sourceBase as an ancestor of HEAD; conditions: (C1) the debut producers writers.cjs:284/288/304 push no newWSets and are outside D41's register scope — a scalar-only debut from them is not a D41 regression; (C2) the D41 reset expectations must include one non-dyadic-load control whose per-set translation w + new − old is inexact in IEEE double arithmetic, e.g. reset 100.1→90.1 on 100.1/95.2 yields 90.1/85.20000000000002 (the 100.1/95.1 case is exact: 90.1/85.1 — the M1 report 3120d98e0585b621b69a3c702fd88c1c97b6ffae6dd0f2655fbbd59fe5758be3 §4 C2 misstated it and is corrected by this line), with the expected output stated as the actual writer's result, no product rounding or load-domain change; (C3) ancestry at receipt time. No package receipt, no execution, no product acceptance and no PR #46 merge follow from this line; M2 (cowork execution) and M3 (citation binding) precede any receipt · rebuild/m4/spec/PERFORMED-ENGINE-v1.md · ACCEPTED","lineSha256":"9117a07f17d945ec3e0c1c971681886214eede3b025e0fe74ee4755e8c960f70"};
const REVIEW_CLAIM={role:'cowork',prefix:'POSTFIX-ACCEPTANCE M2-LOAD-WRITES',terminal:'ACCEPTED'};
const HELPERS=['source','reference','expectations','traces','legacy','witnesses','source-carriers','cases','direct','parent-cases','inherited-carriers','profile','second','package','errors'].map(n=>'rebuild/m4/spec/load-write-'+n+'.cjs');
const FILES=[...HELPERS,'rebuild/m4/spec/load-write.test.cjs',...['profile','assembly','errors'].map(n=>'rebuild/m4/spec/load-write-'+n+'.test.cjs'),...['model','view','package'].map(n=>'rebuild/m3/w7-preview/test/'+n+'.test.cjs'),'.github/workflows/rebuild.yml'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),keys=(o,list)=>assert.deepEqual(Object.keys(o).sort(),list.slice().sort(),'Closed profile keys');
function parent(){
 assert.equal(S.sha(fs.readFileSync(path.join(root,PARENT.artifact))),PARENT.sha256);assert.equal(S.sha(fs.readFileSync(path.join(root,PARENT.envelope))),PARENT.envelopeSha256);
 const loaded=A.load(root,path.join(root,PARENT.envelope));assert(A.verifyReceipts(root,loaded.acceptance,loaded.envelope,loaded.bytes),'Real accepted parent');
 for(const [file,hash]of Object.entries(loaded.acceptance.executionPins))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged parent executable '+file);
 for(const [file,hash]of Object.entries(loaded.acceptance.baseline.publicPins))if(!/^rebuild\/engine\/[^/]+\.cjs$/.test(file))assert.equal(S.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged frozen input '+file);
 const old=S.baseline(root);for(const [file,hash]of Object.entries(loaded.acceptance.candidateEngine))assert.equal(S.sha(old['rebuild/engine/'+file]),hash,'Accepted parent product');
 return loaded;
}
function checkAuthorizations(auth,a){
 assert(THEME&&typeof THEME.line==='string'&&typeof THEME.lineSha256==='string','THEME-AUTHORIZATION-UNAVAILABLE');
 keys(auth,['owner','contract','theme','review']);
 assert(same(auth.owner,a.authorizations.owner)&&same(auth.contract,a.authorizations.contract),'INHERITED-AUTHORIZATION');
 for(const id of ['D41','D43'])assert(auth.owner.line.includes(id+' APPROVED-FIX'),'OWNER-ID-SCOPE');
 const theme=auth.theme;keys(theme,['role','line','lineSha256']);
 assert(theme.role==='cowork'&&typeof theme.line==='string'&&!/[\r\n]/.test(theme.line)&&S.sha(theme.line)===theme.lineSha256&&
   theme.lineSha256===THEME.lineSha256&&theme.line===THEME.line&&
   theme.line.includes('3e908d2eed586288cebfaa12e3b0625671949079')&&
   theme.line.includes('9d5cc0f367462d41af85bb75954b11614a197dced69398337514f875a624de1c')&&theme.line.endsWith(' · ACCEPTED'),'THEME-AUTHORIZATION-PIN');
 assert(same(auth.review,REVIEW_CLAIM),'REVIEW-AUTHORIZATION');
}
function proposed(){const {acceptance:a}=parent(),authorizations={owner:a.authorizations.owner,contract:a.authorizations.contract,theme:THEME,review:REVIEW_CLAIM};
 checkAuthorizations(authorizations,a);return {version:1,packageId:ID,sourceBase:S.BASE,parent:PARENT,requiredIds:REQUIRED,matrix:a.matrix,gates:a.gates,authorizations,product:S.verify(root),executionPins:Object.fromEntries(FILES.map(file=>[file,S.sha(fs.readFileSync(path.join(root,file)))]))};}
function verify(){
 assert(THEME,'THEME-AUTHORIZATION-UNAVAILABLE');
 const raw=fs.readFileSync(path.join(root,ARTIFACT)),m=require(path.join(P,'strict-json.cjs')).parseExact(raw);keys(m,['version','packageId','sourceBase','parent','requiredIds','matrix','gates','authorizations','product','executionPins']);
 assert(same(m,proposed()),'Exact closed cumulative profile and all input hashes');
 const {acceptance:a}=parent();const review=require(path.join(P,'strict-json.cjs')).parseExact(fs.readFileSync(path.join(root,REVIEW)));keys(review,['version','status','receipt']);assert.equal(review.version,1);assert(['PENDING','ACCEPTED'].includes(review.status));
 checkAuthorizations(m.authorizations,a);
 let accepted=false;
 if(review.status==='PENDING')assert.equal(review.receipt,null);
 else{
  const r=review.receipt;assert(r&&typeof r.commit==='string','Missing independent receipt');L.verifyReceipt(root,r.commit,r,{role:'cowork'});
  for(const role of ['owner','theme']){const claim=m.authorizations[role];L.verifyReceipt(root,r.commit,{commit:r.commit,path:'rebuild/DECISIONS.md',line:claim.line,lineSha256:claim.lineSha256},{role:role==='owner'?'owner':'cowork'});}
  const match=/^(?:- [^\r\n]+ · cowork · )?POSTFIX-ACCEPTANCE M2-LOAD-WRITES ([a-f0-9]{40}) (rebuild\/m4\/spec\/acceptance-load-writes\.json) ([a-f0-9]{64}) ACCEPTED$/.exec(r.line);
  assert(match&&match[2]===ARTIFACT&&match[3]===S.sha(raw),'Exact independent verdict');assert(L.object(root,match[1],ARTIFACT).equals(raw),'Reviewed artifact bytes');
  L.git(root,['merge-base','--is-ancestor',match[1],'HEAD']);L.git(root,['merge-base','--is-ancestor',r.commit,'refs/remotes/origin/rebuild/t2-client-core']);
  L.git(root,['merge-base','--is-ancestor',m.sourceBase,'HEAD']);
  for(const [file,hash]of Object.entries({...m.product,...m.executionPins}))assert.equal(S.sha(L.object(root,match[1],file)),hash,'Reviewed product/execution bytes');
  accepted=true;
 }
 return {root,manifest:m,parent:a,accepted,artifactSha256:S.sha(raw)};
}
module.exports={ID,ARTIFACT,REVIEW,PARENT,REQUIRED,FILES,parent,proposed,verify};
if(require.main===module){try{assert.deepEqual(process.argv.slice(2),['--seal']);const reviewFile=path.join(root,REVIEW);if(fs.existsSync(reviewFile))assert.equal(JSON.parse(fs.readFileSync(reviewFile)).status,'PENDING','Never reseal an accepted artifact');fs.writeFileSync(path.join(root,ARTIFACT),JSON.stringify(proposed(),null,2)+'\n');if(!fs.existsSync(reviewFile))fs.writeFileSync(reviewFile,JSON.stringify({version:1,status:'PENDING',receipt:null},null,2)+'\n');console.log('LOAD PROFILE SEALED: public source hashes only; independent acceptance PENDING');}catch(_){console.error('LOAD PROFILE SEAL FAIL; details withheld');process.exitCode=1;}}
