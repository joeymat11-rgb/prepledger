'use strict';
// Closed cumulative evidence profile for M2-NATIVE-CARRIERS. The accepted
// M2-LOAD-WRITES artifact is an immutable parent; a new independent receipt is
// required for PASS. Nothing here relaxes a parent law: every parent pin is
// preserved, and every byte this package changes is expressed as an exact
// carrier over the pinned sourceBase.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),P=path.join(root,'rebuild/conform/v4/postfix');
const L=require(path.join(P,'legacy-gates.cjs')),J=require(path.join(P,'strict-json.cjs')),S=require('./native-carriers-source.cjs');
const ID='M2-NATIVE-CARRIERS',ARTIFACT='rebuild/m4/spec/acceptance-native-carriers.json',REVIEW='rebuild/m4/spec/review-native-carriers.json';
// Parent: the accepted M2-LOAD-WRITES artifact and its own PENDING/ACCEPTED
// review, with the integrated receipt now standing at rebuild/DECISIONS.md.
const PARENT={
 artifact:'rebuild/m4/spec/acceptance-load-writes.json',
 sha256:'5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82',
 review:'rebuild/m4/spec/review-load-writes.json',
 packageId:'M2-LOAD-WRITES',
 receiptLine:'- 2026-09-10 · cowork · POSTFIX-ACCEPTANCE M2-LOAD-WRITES f34332ef6f5033a11574cc027264750ba52a2f3b rebuild/m4/spec/acceptance-load-writes.json 5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82 ACCEPTED',
};
// No register defect is repaired by this package: the carriers are the reviewed
// native next-target behaviour, not an AUDIT-REGISTER fix. requiredIds is empty
// and the authorization check below therefore binds owner/contract/theme/review
// explicitly instead of leaning on an APPROVED-FIX id.
const REQUIRED=[];
const AUTHORIZATIONS='rebuild/m4/spec/native-carriers-authorizations.json';
const AUTHORIZATIONS_SHA='6d50f842d3c8821259331453e9919f7f11980bc9c796b8fe008bbfd9dde4f32f';
// THEME_PENDING. The PM has not yet written the theme ledger line this profile
// must bind (precedent: the load-write profile before its M3 citation binding).
// verify() REFUSES while this sentinel stands; replacing it with the actual
// {role:'cowork', line, lineSha256} is the PM's act, not the builder's.
const THEME_PENDING=Object.freeze({pending:'THEME_PENDING',note:'Replace with the accepted NATIVE-CARRIERS THEME ledger line (role cowork, single line, ending " · ACCEPTED") after the PM accepts rebuild/m4/spec/NATIVE-CARRIERS-THEME.md.'});
const THEME=THEME_PENDING;
const REVIEW_CLAIM={role:'cowork',prefix:'POSTFIX-ACCEPTANCE M2-NATIVE-CARRIERS',terminal:'ACCEPTED'};
const HELPERS=['source','reference','errors','traces','direct','legacy','witnesses','cases','profile','package'].map(n=>'rebuild/m4/spec/native-carriers-'+n+'.cjs');
const FILES=[
 ...HELPERS,
 'rebuild/m4/spec/native-carriers-changes.json',
 AUTHORIZATIONS,
 ...Object.keys(S.SUPPORT),
 'rebuild/m4/spec/native-carriers-profile.test.cjs',
 '.github/workflows/rebuild.yml',
];
// Files this package changes relative to the parent's own pins. The parent's
// verify() is left byte-for-byte intact; the change is expressed HERE, as the
// successor's CHANGES over sourceBase — exactly how M2-LOAD-WRITES expressed its
// engine changes against M2-STEP-EFFICACY's candidateEngine and publicPins.
const SUPERSEDED=new Set([...Object.keys(S.CARRIED),...Object.keys(S.WHOLE),'.github/workflows/rebuild.yml']);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),keys=(o,list)=>assert.deepEqual(Object.keys(o).sort(),list.slice().sort(),'Closed profile keys');
const baseBytes=file=>L.object(root,S.BASE,file);
function parent(){
 const raw=fs.readFileSync(path.join(root,PARENT.artifact));
 assert.equal(S.sha(raw),PARENT.sha256,'Accepted parent artifact bytes');
 const a=J.parseExact(raw);
 assert.equal(a.packageId,PARENT.packageId,'Parent package identity');
 const review=J.parseExact(fs.readFileSync(path.join(root,PARENT.review)));
 assert.equal(review.status,'ACCEPTED','Parent independently accepted');
 const r=review.receipt;assert(r&&typeof r.commit==='string','Parent receipt');
 L.verifyReceipt(root,r.commit,r,{role:'cowork'});
 assert.equal(r.line,PARENT.receiptLine,'Exact parent receipt line');
 assert(r.line.includes(PARENT.sha256)&&r.line.includes(PARENT.artifact)&&r.line.endsWith(' ACCEPTED'),'Parent receipt content');
 // Every parent pin still holds: unchanged files byte-for-byte in the tree,
 // superseded files byte-for-byte at the sourceBase this successor builds on.
 for(const [file,hash]of Object.entries({...a.product,...a.executionPins})){
  if(SUPERSEDED.has(file))assert.equal(S.sha(baseBytes(file)),hash,'Parent product preserved at sourceBase: '+file);
  else assert.equal(S.sha(fs.readFileSync(path.join(root,file))),hash,'Unchanged parent pin: '+file);
 }
 return a;
}
function authorizations(){
 const raw=fs.readFileSync(path.join(root,AUTHORIZATIONS));
 assert.equal(S.sha(raw),AUTHORIZATIONS_SHA,'Pinned authorization citations');
 const value=J.parseExact(raw);
 keys(value,['profile','owner']);
 assert.equal(value.profile,'earned/native-carriers-authorizations/v1','Authorization profile');
 keys(value.owner,['delegation','speed']);
 for(const [name,claim]of Object.entries(value.owner)){
  keys(claim,['ledgerLine','role','line','lineSha256']);
  assert(typeof claim.line==='string'&&!/[\r\n]/.test(claim.line)&&S.sha(claim.line)===claim.lineSha256,'Owner citation shape: '+name);
 }
 // The delegation is an owner-role ruling; the speed ruling is the cowork line
 // that records the owner's 2026-09-10 "Do it" plan and its engine-full-gate
 // tier. Neither names "native next targets": that gap is disclosed in
 // NATIVE-CARRIERS-THEME.md and is the PM's to close, not the builder's.
 assert.equal(value.owner.delegation.role,'owner','Owner delegation role');
 assert(value.owner.delegation.line.includes('ROLE RULING'),'Owner delegation content');
 assert.equal(value.owner.speed.role,'cowork','Speed ruling role');
 assert(value.owner.speed.line.includes('engine full gate'),'Speed ruling content');
 return value.owner;
}
function checkAuthorizations(auth,a){
 keys(auth,['owner','contract','theme','review']);
 assert(same(auth.contract,a.authorizations.contract),'INHERITED-CONTRACT-AUTHORIZATION');
 assert(same(auth.owner,authorizations()),'OWNER-AUTHORIZATION-PIN');
 assert(!auth.theme||auth.theme.pending!=='THEME_PENDING','THEME-AUTHORIZATION-UNAVAILABLE');
 const theme=auth.theme;keys(theme,['role','line','lineSha256']);
 assert(theme.role==='cowork'&&typeof theme.line==='string'&&!/[\r\n]/.test(theme.line)&&S.sha(theme.line)===theme.lineSha256&&
  theme.line.includes('M2-NATIVE-CARRIERS')&&theme.line.endsWith(' · ACCEPTED'),'THEME-AUTHORIZATION-PIN');
 assert(same(auth.review,REVIEW_CLAIM),'REVIEW-AUTHORIZATION');
}
function proposed(){
 const a=parent();
 const auth={owner:authorizations(),contract:a.authorizations.contract,theme:THEME,review:REVIEW_CLAIM};
 return {version:1,packageId:ID,sourceBase:S.BASE,parent:PARENT,requiredIds:REQUIRED,matrix:a.matrix,gates:a.gates,
  authorizations:auth,product:S.verify(root),
  executionPins:Object.fromEntries(FILES.map(file=>[file,S.sha(fs.readFileSync(path.join(root,file)))]))};
}
function verify(){
 const raw=fs.readFileSync(path.join(root,ARTIFACT)),m=J.parseExact(raw);
 keys(m,['version','packageId','sourceBase','parent','requiredIds','matrix','gates','authorizations','product','executionPins']);
 assert(same(m,proposed()),'Exact closed cumulative profile and all input hashes');
 const a=parent();
 const review=J.parseExact(fs.readFileSync(path.join(root,REVIEW)));
 keys(review,['version','status','receipt']);assert.equal(review.version,1);assert(['PENDING','ACCEPTED'].includes(review.status));
 // A sealed THEME_PENDING profile can be executed and CI-evidenced, but it can
 // never be ACCEPTED: the theme binding must be real before any receipt counts.
 const themePending=!!(m.authorizations.theme&&m.authorizations.theme.pending==='THEME_PENDING');
 let accepted=false;
 if(review.status==='PENDING')assert.equal(review.receipt,null);
 else{
  checkAuthorizations(m.authorizations,a);
  const r=review.receipt;assert(r&&typeof r.commit==='string','Missing independent receipt');L.verifyReceipt(root,r.commit,r,{role:'cowork'});
  for(const claim of [m.authorizations.owner.delegation,m.authorizations.owner.speed,m.authorizations.theme])
   L.verifyReceipt(root,r.commit,{commit:r.commit,path:'rebuild/DECISIONS.md',line:claim.line,lineSha256:claim.lineSha256},{role:claim.role});
  const match=/^(?:- [^\r\n]+ · cowork · )?POSTFIX-ACCEPTANCE M2-NATIVE-CARRIERS ([a-f0-9]{40}) (rebuild\/m4\/spec\/acceptance-native-carriers\.json) ([a-f0-9]{64}) ACCEPTED$/.exec(r.line);
  assert(match&&match[2]===ARTIFACT&&match[3]===S.sha(raw),'Exact independent verdict');
  assert(L.object(root,match[1],ARTIFACT).equals(raw),'Reviewed artifact bytes');
  L.git(root,['merge-base','--is-ancestor',match[1],'HEAD']);
  L.git(root,['merge-base','--is-ancestor',r.commit,'refs/remotes/origin/rebuild/t2-client-core']);
  L.git(root,['merge-base','--is-ancestor',m.sourceBase,'HEAD']);
  for(const [file,hash]of Object.entries({...m.product,...m.executionPins}))assert.equal(S.sha(L.object(root,match[1],file)),hash,'Reviewed product/execution bytes');
  accepted=true;
 }
 return {root,manifest:m,parent:a,accepted,themePending,artifactSha256:S.sha(raw)};
}
module.exports={ID,ARTIFACT,REVIEW,PARENT,REQUIRED,FILES,SUPERSEDED,THEME_PENDING,REVIEW_CLAIM,parent,authorizations,checkAuthorizations,proposed,verify};
if(require.main===module){try{
 assert.deepEqual(process.argv.slice(2),['--seal']);
 const reviewFile=path.join(root,REVIEW);
 if(fs.existsSync(reviewFile))assert.equal(JSON.parse(fs.readFileSync(reviewFile)).status,'PENDING','Never reseal an accepted artifact');
 fs.writeFileSync(path.join(root,ARTIFACT),JSON.stringify(proposed(),null,2)+'\n');
 if(!fs.existsSync(reviewFile))fs.writeFileSync(reviewFile,JSON.stringify({version:1,status:'PENDING',receipt:null},null,2)+'\n');
 console.log('NATIVE CARRIERS PROFILE SEALED: public source hashes only; THEME_PENDING stands; independent acceptance PENDING');
}catch(_){console.error('NATIVE CARRIERS PROFILE SEAL FAIL; details withheld');process.exitCode=1;}}
