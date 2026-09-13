'use strict';
// Seven bounded runnable refusal controls. A selected source reversal must fail
// the SAME assertion; an independent fresh restored fixture must pass it again.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto'),assert=require('node:assert/strict'),test=require('node:test');
const root=path.resolve(__dirname,'../../../..'),base=path.join(root,'.tmp/er-binding'),runner='rebuild/lanes/b/tooling/b-package.cjs',source=fs.readFileSync(path.join(root,runner),'utf8');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');assert.equal(hash(source),'f21ce8ee43647915953b359d493cfb05272b35c3615d4c57b3e7db0d39f6f022');
const fixtureFile=path.join(root,'rebuild/lanes/b/tooling/test/superseded-parent-continuity.test.cjs'),fixtureSource=fs.readFileSync(fixtureFile,'utf8');
assert.equal(fixtureSource.split('test.after(').length,2);const originalPrefix=fixtureSource.slice(0,fixtureSource.indexOf('test.after(')),exportsStart='module.exports={parentCoverage,';assert.equal(originalPrefix.split(exportsStart).length,2);
const prefix=originalPrefix.replace(exportsStart,'module.exports={b1b2Amendments,pmReceipt,pmLedger,parentCoverage,');
const fixtureModule=new Module(fixtureFile,module);fixtureModule.filename=fixtureFile;fixtureModule.paths=Module._nodeModulePaths(path.dirname(fixtureFile));fixtureModule._compile(prefix+'\nmodule.exports={fixture,scratches};',fixtureFile);
const L=require('../../../conform/v4/postfix/legacy-gates.cjs');
const cases=[
 {id:'fixed-admission',guard:"    assert.equal(row.claim.lineSha256, expected.lineSha256, 'B1B2-AMENDMENT-REQUIRED-LINE '+id);",expected:'B1B2-AMENDMENT-REQUIRED-LINE'},
 {id:'shared-chain',guard:'    pmLedger(at, row.claim, []);',expected:'RECEIPT-EXACT-LINE-MISSING'},
 {id:'document-bytes',guard:"      assert.equal(sha(L.object(root, at, document.file)), document.sha256,\n        'B1B2-AMENDMENT-DOCUMENT-BYTES '+id+' '+document.file+' at '+at);",expected:'B1B2-AMENDMENT-DOCUMENT-BYTES'},
 {id:'receipt-context',guard:'  b1b2Amendments(s, r.commit); // exact six documents must also stand at the actual acceptance receipt context',expected:'B1B2-AMENDMENT-DOCUMENT-BYTES'},
 {id:'reviewed-pin-override',guard:'  Object.assign(reviewed, amendmentPins); // fixed authority pins cannot be overridden by product/execution declarations',expected:'GIT-SOURCE-PIN'},
 {id:'authorized-ci-head',guard:"  if (ID === 'B1-B2') L.checkSources(root, 'HEAD', amendmentPins); // authorized CI also binds current HEAD/worktree documents",expected:'GIT-SOURCE-PIN'},
 {id:'full-entry-head',guard:"  if (ID === 'B1-B2' && pinVerificationPhase !== 'ci')\n    L.checkSources(root, 'HEAD', amendmentPins); // actual FULL entry AND terminal, including an unsealed candidate",expected:'GIT-SOURCE-PIN'},
];
for(const c of cases)assert.equal(source.split(c.guard).length,2,c.id+' exact source anchor');
const selected=process.env.ER_BINDING_CASE||null,fault=process.env.ER_BINDING_FAULT||null;assert(!selected||cases.some(c=>c.id===selected));assert(!fault||fault===selected);
const variant=fault?'fault':selected?'restored':'baseline',records=[];
function positive(f){const pins=f.api.b1b2Amendments(f.s);assert.deepEqual(pins,Object.fromEntries(Object.entries(f.amendmentDocuments).map(([p,b])=>[p,hash(b)])));return pins;}
function segment(text,a,b){assert.equal(text.split(a).length,2);assert.equal(text.split(b).length,2);return text.slice(text.indexOf(a),text.indexOf(b));}
function receiptLeg(f,r,artifact,digest,text){const code=segment(text,'  pmReceipt(r.commit, r, [s.packageId, ARTIFACT, hash], s.authorizations.review.role);','  const cited = { owner:');return Function('s','r','ARTIFACT','hash','pmReceipt','b1b2Amendments',code)(f.s,r,artifact,digest,f.api.pmReceipt,f.api.b1b2Amendments);}
function reviewedLeg(f,at,text,{product={},executionPins={},gitUnchanged=new Map()}={}){const code=segment(text,'  const reviewed = { ...m.executionPins };',"  ancestor(v[1], 'HEAD', 'REVIEWED-COMMIT-NOT-BEHIND-HEAD');");const observed=[];const actualL={...L,checkSources:(r,c,p)=>{observed.push({at:c,pins:{...p}});return L.checkSources(r,c,p);}};try{return Function('s','m','amendmentPins','gitUnchanged','L','root','v','ID',code)({product:{}},{product,executionPins},positive(f),gitUnchanged,actualL,f.dir,[null,at],'B1-B2');}finally{f.reviewedCalls=observed;}}
for(const item of cases.filter(c=>!selected||c.id===selected))test('ER amendment refusal '+item.id,()=>{
 const text=fault===item.id?source.replace(item.guard,''):source;let originalFixtureCode;
 const f=fixtureModule.exports.fixture({parentEdit:p=>{p.parent=null;},runnerEdit:code=>{originalFixtureCode=code;return fault===item.id?code.replace(item.guard,''):code;}});
 const fixtureRunner=path.join(f.dir,runner),originalDiskSHA256=hash(originalFixtureCode),executedDiskSHA256=hash(fs.readFileSync(fixtureRunner));
 const record={id:item.id,variant,expected:item.expected,rootSourceSHA256:hash(source),executedSourceSHA256:hash(text),guardRemoval:fault===item.id?item.guard:null,fixtureRoot:path.relative(root,f.dir).replaceAll('\\','/'),originalFixtureSHA256:originalDiskSHA256,executedFixtureSHA256:executedDiskSHA256,assertion:'same assert.throws expected refusal for original, reversed and restored source',classification:'bounded synthetic authority/tooling; never full package acceptance'};records.push(record);
 try{
  positive(f);const files=Object.keys(f.amendmentDocuments),file=files[0],body=f.amendmentDocuments[file];let operation;
  if(item.id==='fixed-admission'){
   const claim=f.s.authorizations.amendments['source-graph'].claim;claim.line+=' forged';claim.lineSha256=hash(claim.line);f.write('rebuild/DECISIONS.md',f.amendmentLedger+claim.line+'\n');f.commit();operation=()=>f.api.b1b2Amendments(f.s);
  }else if(item.id==='shared-chain'){
   const line=f.amendmentClaims['source-graph'].claim.line;f.write('rebuild/DECISIONS.md',f.amendmentLedger.replace(line+'\n',''));f.commit();f.git('checkout','--quiet','-b','candidate-local-exact-claim');f.write('rebuild/DECISIONS.md',f.amendmentLedger);f.commit();operation=()=>f.api.b1b2Amendments(f.s);
  }else if(item.id==='document-bytes'){
   f.write(file,body+'corruption\n');f.commit();operation=()=>f.api.b1b2Amendments(f.s);
  }else if(item.id==='receipt-context'){
   f.s.authorizations.review={role:'Astra PM'};const artifact='rebuild/m4/spec/synthetic-amendment-artifact.json',digest='a'.repeat(64),line='- 2026-09-13 · Astra PM · POSTFIX-ACCEPTANCE M2-B1-B2 '+f.amendmentsAdmitted+' '+artifact+' '+digest+' ACCEPTED';
   f.write('rebuild/DECISIONS.md',f.amendmentLedger+line+'\n');f.write(file,body+'wrong receipt document\n');const bad=f.commit();f.write(file,body);const good=f.commit();positive(f);
   const receipt={commit:good,path:'rebuild/DECISIONS.md',line,lineSha256:hash(line)};receiptLeg(f,receipt,artifact,digest,text);operation=()=>receiptLeg(f,{...receipt,commit:bad},artifact,digest,text);record.isolatedActualLeg='receipt';
  }else if(item.id==='reviewed-pin-override'){
   reviewedLeg(f,f.amendmentsAdmitted,text);const badBody=body+'bad reviewed\n';f.write(file,badBody);const bad=f.commit();f.write(file,body);f.commit();positive(f);
   const forged=hash(badBody);record.adversarialDeclarations={file,executionPin:forged,productPost:forged,alsoClassifiedUnchanged:true};operation=()=>reviewedLeg(f,bad,text,{executionPins:{[file]:forged},product:{[file]:{post:forged,pre:forged}},gitUnchanged:new Map([[file,{}]])});record.isolatedActualLeg='reviewed-source with real checkSources; final fixed pins must override product/execution and survive unchanged-class deletion';
  }else{
   if(item.id==='full-entry-head')assert.equal(f.api.envelope(f.s,f.bound,undefined,'full-entry').key,'ABSENT');else reviewedLeg(f,f.amendmentsAdmitted,text);
   f.git('checkout','--quiet','-b','candidate-head-document-drift');f.write(file,body+'candidate-only\n');f.commit();f.write(file,body);positive(f);
   operation=item.id==='full-entry-head'?()=>f.api.envelope(f.s,f.bound,undefined,'full-entry'):()=>reviewedLeg(f,f.amendmentsAdmitted,text);
   record.isolatedActualLeg=item.id==='full-entry-head'?'complete actual unsealed envelope before ABSENT':'actual reviewed-source plus authorized-CI HEAD leg; no complete ACCEPTED envelope';
  }
  const acceptedError=e=>e&&((e.code==='ERR_ASSERTION'&&e.message.includes(item.expected))||e.code===item.expected);
  assert.throws(operation,acceptedError,'ER-BINDING-'+item.id+' must refuse the same invalid authority/document');
  record.result='required refusal observed';
 }catch(e){record.result='assertion failed';record.error={name:e.name,code:e.code,message:e.message};throw e;}
 finally{record.reviewedCalls=f.reviewedCalls;fs.writeFileSync(fixtureRunner,originalFixtureCode);assert.equal(hash(fs.readFileSync(fixtureRunner)),originalDiskSHA256);record.fixtureSourceRestored=true;assert.equal(hash(fs.readFileSync(path.join(root,runner))),hash(source));}
});
test.after(()=>{
 const out=path.join(base,'independent');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,variant+(selected?'-'+selected:'')+'.json'),JSON.stringify({candidate:'083bd47efc16d02105b3ebe2912bcf5aa4a5f240',records,assertionsUnchangedAcrossVariants:true,sourceAndFixtureRestoration:true,builderEvidenceRead:false},null,2)+'\n');
 for(const dir of fixtureModule.exports.scratches){const resolved=fs.realpathSync(dir),parent=fs.realpathSync(path.join(root,'.tmp'));assert.equal(path.dirname(resolved),parent);assert(path.basename(resolved).startsWith('b1b2-continuity-'));fs.rmSync(resolved,{recursive:true,force:true});}
});
