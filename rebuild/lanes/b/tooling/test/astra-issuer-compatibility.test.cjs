'use strict';
// DECISIONS:198. Execute the real checker against synthetic Git histories. Only
// CHAIN_REF and the immutable handover coordinates are substituted; no authority,
// Git, receipt, profile or pin function is stubbed. The full gate is never entered.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');
const crypto = require('node:crypto');
const sourceRoot = path.resolve(__dirname, '../../../../..');
const RUNNER = 'rebuild/lanes/b/tooling/b-package.cjs';
const SPEC = 'rebuild/lanes/b/tooling/packages/B1.json';
const BRIEF = 'rebuild/lanes/b/BRIEF-ISSUER-FIXTURE.md';
const LEDGER = 'rebuild/DECISIONS.md';
const DOC = 'rebuild/lanes/astra/OWNER-APPROVED-HANDOVER.md';
const PRODUCT = 'rebuild/m4/spec/issuer-fixture-product.cjs';
const PACKAGE = 'M2-B1-ISSUER-FIXTURE';
const ARTIFACT = 'rebuild/m4/spec/acceptance-b1-issuer-fixture.json';
const REVIEW = 'rebuild/m4/spec/review-b1-issuer-fixture.json';
const source = fs.readFileSync(path.join(sourceRoot, RUNNER), 'utf8');
const boundary = '// ------------------------------------------------------------------ 8. main sequence';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const docBytes = 'Synthetic owner handover. No athlete data, engine or full gate.\n';
const OWNER = '- 2026-09-06 · owner · M2-RULE synthetic owner · M2-RULE DONE';
const CONTRACT = '- 2026-09-07 · cowork · POSTFIX-GATE BRIEF synthetic contract · ACCEPTED';
const HANDOVER = '- 2026-09-12 · owner · synthetic sole Astra PM handover · OWNER-RULED';
const theme = role => '- 2026-09-13 · ' + role + ' · THEME ' + PACKAGE + ' · ACCEPTED';
const brief = role => '- 2026-09-13 · ' + role + ' · BRIEF ' + PACKAGE + ' ' + BRIEF + ' · ACCEPTED';
// Shaped like an acceptance, but written by an unauthorized Astra before handover.
const VOID = theme('Astra PM').replace('THEME ', 'historically void THEME ');
const originalPaths = ['rebuild/conform/v4/postfix/run.cjs', 'rebuild/conform/v4/postfix/target.cjs',
  'rebuild/conform/v4/postfix/legacy-gates.cjs', 'rebuild/conform/v4/postfix/strict-json.cjs',
  'rebuild/m4/spec/native-carriers-errors.cjs', 'rebuild/m4/spec/load-write-reference.cjs'];
const tempRoot = path.join(sourceRoot, '.tmp');
fs.mkdirSync(tempRoot, {recursive:true});
const scratches = [];
function makeFixture({code = source, legacyClaims = false, astraParent = false} = {}) {
  const root = fs.mkdtempSync(path.join(tempRoot, 'astra-issuer-'));
  scratches.push(root);
  const git = (...args) => cp.execFileSync('git', args, {cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const write = (file, bytes) => { const target=path.join(root,file); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,bytes); };
  const read = file => fs.readFileSync(path.join(root,file));
  const commit = note => {git('add','-A');git('commit','--quiet','--allow-empty','-m',note);return git('rev-parse','HEAD');};
  const lines = [OWNER,CONTRACT,theme('cowork'),brief('cowork'),VOID];
  const ledger = () => write(LEDGER,lines.join('\n')+'\n');
  const append = (...more) => {lines.push(...more);ledger();return commit('fixture ledger');};
  const claim = (line, role) => ({ledgerLine:Math.max(1,lines.indexOf(line)+1),role:role || /^- [^·]+ · ([^·]+) · /.exec(line)[1],line,lineSha256:hash(Buffer.from(line))});
  git('init','--quiet','-b','fixture-chain');
  git('config','user.name','Earned synthetic issuer test');
  git('config','user.email','issuer-fixture@earned.local');
  git('config','core.autocrlf','false');
  for(const file of originalPaths) write(file,fs.readFileSync(path.join(sourceRoot,file)));
  ledger();const base=commit('fixture owner and contract');
  function parentPackage(id, role, parent) {
    const artifact='rebuild/m4/spec/acceptance-'+id.toLowerCase()+'.json';
    const review='rebuild/m4/spec/review-'+id.toLowerCase()+'.json';
    const product='rebuild/m4/spec/'+id.toLowerCase()+'-leaf.cjs';
    write(product,'module.exports = '+JSON.stringify(id)+';\n');
    const acceptance={packageId:'M2-'+id,product:{[product]:hash(read(product))},executionPins:{},
      parent:parent ? {artifact:parent.option.artifact,sha256:parent.option.sha256,review:parent.option.review}:null,
      authorizations:{contract:claim(CONTRACT)}};
    write(artifact,json(acceptance));const reviewed=commit('fixture artifact');
    const sha256=hash(read(artifact));
    const line='- 2026-09-13 · '+role+' · POSTFIX-ACCEPTANCE '+acceptance.packageId+' '+reviewed+' '+artifact+' '+sha256+' ACCEPTED';
    const receiptBase=append(line);
    const receipt={commit:receiptBase,path:LEDGER,line,lineSha256:hash(Buffer.from(line))};
    write(review,json({version:1,status:'ACCEPTED',receipt}));commit('fixture review');
    return {option:{id,artifact,sha256,review,reviewSha256:hash(read(review)),receiptLedgerLine:lines.indexOf(line)+1,note:'Synthetic fixture only.'},
      acceptance,reviewedCommit:reviewed,receiptBase,receipt,product,decided:true};
  }
  const grand=parentPackage('FIXTURE-GRAND','cowork',null);
  let parent=parentPackage('FIXTURE-PARENT','cowork',grand);
  lines.push(HANDOVER);ledger();write(DOC,docBytes);const anchor=commit('fixture real handover');
  const handover={commit:anchor,lineNumber:lines.indexOf(HANDOVER)+1,lineSha256:hash(Buffer.from(HANDOVER)),document:DOC,documentSha256:hash(Buffer.from(docBytes))};
  if(astraParent) parent=parentPackage('FIXTURE-ASTRA-PARENT','Astra PM',parent);
  append(theme('Astra PM'),brief('Astra PM'));
  const fixtureCode=code.replace(/^const CHAIN_REF = .*;$/m,"const CHAIN_REF = 'refs/heads/fixture-chain';")
    .replace(/^const PM_HANDOVER = Object.freeze\(.*\);$/m,'const PM_HANDOVER = Object.freeze('+JSON.stringify(handover)+');');
  const before=code.split('\n'),after=fixtureCode.split('\n');
  assert.equal(before.length,after.length);
  const changed=before.filter((line,i)=>line!==after[i]);
  assert.equal(changed.length,2,'only the real chain ref and synthetic immutable authority coordinates change');
  assert(changed.every(line=>/^const (CHAIN_REF|PM_HANDOVER) = /.test(line)));
  write(RUNNER,fixtureCode);write(BRIEF,'Synthetic issuer scope.\n');write(PRODUCT,'module.exports = "synthetic";\n');
  const file=path.join(root,RUNNER), m=new Module(file,module);
  m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(path.join(sourceRoot,RUNNER)));
  const requireOriginal=m.require.bind(m);
  m.require=id=>requireOriginal(path.isAbsolute(id)&&id.startsWith(root+path.sep)?path.join(sourceRoot,path.relative(root,id)):id);
  const argv=process.argv;process.argv=[process.execPath,file,'--ci','--package','B1'];
  try {m._compile(fixtureCode.slice(0,fixtureCode.indexOf(boundary))+
    '\nmodule.exports={spec,authority,option,pins,envelope,proposed,pmReceipt,pmLedger,sealOnTheTip,open,CARRIED,PM_HANDOVER,init(){logDir=root;}};',file);
  } finally {process.argv=argv;}
  const api=m.exports;api.init();
  const role=legacyClaims?'cowork':'Astra PM';
  const s={version:1,lanePackage:'B1',packageId:PACKAGE,status:'BRIEF-ACCEPTED',
    brief:{file:BRIEF,sha256:hash(read(BRIEF)),acceptedLedgerLine:claim(brief(role))},sourceBase:anchor,
    dIds:['D1'],laws:{D1:'SYNTHETIC-ISSUER-NO-ENGINE-CLAIM'},carriedAcceptedIds:api.CARRIED,privateLiveTriggered:[],
    parent:{decided:true,chosen:parent.option.id,options:[parent.option]},
    tooling:{runner:RUNNER,runnerSha256:hash(read(RUNNER))},product:{[PRODUCT]:{pre:null,post:hash(read(PRODUCT)),role:'new'}},
    coverage:{inherited:{},moves:{},successors:null,superseded:null},carrierSuccessor:null,witnessFlips:[],protectedSurfaces:{},
    authorizations:{owner:claim(OWNER),contract:claim(CONTRACT),theme:claim(theme(role)),review:{role:'Astra PM',prefix:'POSTFIX-ACCEPTANCE '+PACKAGE,terminal:'ACCEPTED'}},
    artifact:{file:ARTIFACT,review:REVIEW},children:[],notes:['Synthetic authority probe; no gate or engine proof.']};
  const saveSpec=()=>{write(SPEC,json(s));commit('fixture candidate spec');return api.spec();};
  saveSpec();
  function sealOwn(issuer='Astra PM') {
    saveSpec();const artifact=api.proposed(s,parent);write(ARTIFACT,json(artifact));const reviewed=commit('fixture proposed artifact');
    const line='- 2026-09-13 · '+issuer+' · POSTFIX-ACCEPTANCE '+PACKAGE+' '+reviewed+' '+ARTIFACT+' '+hash(read(ARTIFACT))+' ACCEPTED';
    const at=append(line);const receipt={commit:at,path:LEDGER,line,lineSha256:hash(Buffer.from(line))};
    write(REVIEW,json({version:1,status:'ACCEPTED',receipt}));commit('fixture own review');
    return receipt;
  }
  return {root,git,write,read,commit,lines,ledger,append,claim,base,anchor,handover,grand,parent,parentPackage,api,s,saveSpec,sealOwn,fixtureCode};
}
test.after(()=>{for(const root of scratches){const resolved=fs.realpathSync(root);assert.equal(path.dirname(resolved),fs.realpathSync(tempRoot));assert(path.basename(resolved).startsWith('astra-issuer-'));fs.rmSync(resolved,{recursive:true,force:true});}});

test('production pins match the real public owner handover and exact original helper bytes',()=>{
  const literal=/^const PM_HANDOVER = Object.freeze\((.*)\);$/m.exec(source);
  assert(literal);const pins=Function('return ('+literal[1]+')')();
  assert.equal(pins.commit,'3ef096d671af924caefa346c530f06784f382af0');
  const git=(...args)=>cp.execFileSync('git',args,{cwd:sourceRoot,stdio:['ignore','pipe','pipe']});
  const lines=git('show',pins.commit+':'+LEDGER).toString('utf8').split(/\r?\n/);
  assert.equal(hash(Buffer.from(lines[pins.lineNumber-1])),pins.lineSha256);
  assert.equal(hash(git('show',pins.commit+':'+pins.document)),pins.documentSha256);
  for(const file of originalPaths) assert(fs.readFileSync(path.join(sourceRoot,file)).equals(git('show',pins.commit+':'+file)),file+' remains frozen');
});
for(const legacyClaims of [false,true]) for(const astraParent of [false,true]) {
  test('actual spec/authority/option/pins/envelope: '+(legacyClaims?'historical':'Astra')+' claims, '+(astraParent?'Astra parent and historical grandparent':'historical inheritance'),()=>{
    const f=makeFixture({legacyClaims,astraParent});
    const s=f.api.spec();const bound=f.api.option(f.parent.option);bound.decided=true;
    f.api.open.length=0;f.api.authority(s,bound);assert.deepEqual(f.api.open,[]);
    f.api.pins(s,bound);f.sealOwn();assert.equal(f.api.envelope(s,bound).authorized,true);
  });
}
test('Astra receipt is also accepted as a grandparent through actual pins',()=>{
  const f=makeFixture({astraParent:true});
  const newer=f.parentPackage('FIXTURE-NEXT','Astra PM',f.parent);
  const bound=f.api.option(newer.option);bound.decided=true;
  f.api.pins(f.s,bound);
});
// R1: preserve issuer, exact-line authority and the accepted parent while
// changing only the grandparent payload. Every probe reaches option() + pins().
function grandparentFixture(code=source) {
  const f=makeFixture({code,astraParent:true}),grand=f.parent;
  const parent=f.parentPackage('FIXTURE-R1-NEXT','Astra PM',grand);
  const bound=f.api.option(parent.option);bound.decided=true;f.api.pins(f.s,bound);
  return {f,grand,parent,bound};
}
function replaceGrandparentReceipt(setup,line) {
  const {f,grand,parent}=setup,at=f.append(line);
  const receipt={...grand.receipt,commit:at,line,lineSha256:hash(Buffer.from(line))};
  f.write(grand.option.review,json({version:1,status:'ACCEPTED',receipt}));f.commit('R1 replacement review');
  assert.equal(f.read(grand.option.review).toString('utf8').trimEnd(),f.git('show','HEAD:'+grand.option.review));
  const bound=f.api.option(parent.option);bound.decided=true;return bound;
}
function restoreGrandparentReceipt(setup) {
  const {f,grand,parent}=setup;
  f.write(grand.option.review,json({version:1,status:'ACCEPTED',receipt:grand.receipt}));f.commit('R1 restore genuine review');
  const bound=f.api.option(parent.option);bound.decided=true;f.api.pins(f.s,bound);
}
const grandparentPayloadCases=[
  ...['REJECTED','PENDING','ACCEPTED-BY-NAME'].map(terminal=>({name:'terminal '+terminal,
    line:({grand})=>grand.receipt.line.replace(/ACCEPTED$/,terminal)})),
  {name:'different package',line:({grand})=>grand.receipt.line.replace(grand.acceptance.packageId,'M2-DIFFERENT-PACKAGE')},
  {name:'nonexistent reviewed commit',line:({grand})=>grand.receipt.line.replace(grand.reviewedCommit,'0'.repeat(40))},
  ...['artifact','sha256'].map(field=>({name:'wrong '+field+' despite a correct mention',line:({grand})=>{
    const actual=grand.option[field],wrong=field==='artifact'?'rebuild/m4/spec/wrong-artifact.json':'0'.repeat(64);
    return grand.receipt.line.replace(actual,wrong).replace(' · POSTFIX-ACCEPTANCE ',' · expected '+actual+' · POSTFIX-ACCEPTANCE ');
  }}))
];
for(const entry of grandparentPayloadCases) test('R1 grandparent refuses '+entry.name,()=>{
  const setup=grandparentFixture(),bound=replaceGrandparentReceipt(setup,entry.line(setup));
  assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/Grandparent|GRANDPARENT|git/);
  restoreGrandparentReceipt(setup);
});
function wrongGrandparentArtifact(setup) {
  const {f,grand}=setup,bytes=f.read(grand.option.artifact);
  f.write(grand.option.artifact,json({...grand.acceptance,unreviewed:true}));const wrong=f.commit('R1 different artifact bytes');
  f.write(grand.option.artifact,bytes);f.commit('R1 restore current artifact');
  return grand.receipt.line.replace(grand.reviewedCommit,wrong);
}
test('R1 grandparent refuses different artifact bytes at an existing reviewed commit',()=>{
  const setup=grandparentFixture(),bound=replaceGrandparentReceipt(setup,wrongGrandparentArtifact(setup));
  assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/GRANDPARENT-REVIEWED-ARTIFACT-BYTES/);
  restoreGrandparentReceipt(setup);
});
function offChainGrandparentCommit(setup) {
  const {f,grand}=setup;
  f.git('checkout','--quiet','-b','fixture-r1-side');const outside=f.commit('R1 same artifact on an unmerged branch');
  f.git('checkout','--quiet','fixture-chain');
  return grand.receipt.line.replace(grand.reviewedCommit,outside);
}
test('R1 grandparent refuses a reviewed commit outside HEAD and the actual chain',()=>{
  const setup=grandparentFixture(),bound=replaceGrandparentReceipt(setup,offChainGrandparentCommit(setup));
  assert.throws(()=>setup.f.api.pins(setup.f.s,bound),/GRANDPARENT-REVIEWED-COMMIT-NOT-/);
  restoreGrandparentReceipt(setup);
});

test('a historical receipt still verifies from a later descendant context',()=>{
  const f=makeFixture();const r={...f.parent.receipt,commit:f.git('rev-parse','HEAD')};
  assert.equal(f.api.pmReceipt(r.commit,r,[f.parent.option.sha256,f.parent.option.artifact]),'cowork');
});
for(const slot of ['brief','theme','freeze']) test('new cowork '+slot+' is refused even on the real later chain',()=>{
  const f=makeFixture();
  const line='- 2026-09-13 · cowork · '+(slot==='freeze'?'FREEZE ':'NEW '+slot+' ')+PACKAGE+' '+BRIEF+' '+f.anchor+' · ACCEPTED';
  f.append(line);const c=f.claim(line);
  if(slot==='brief')f.s.brief.acceptedLedgerLine=c;else f.s.authorizations[slot]=c;
  assert.throws(()=>f.saveSpec(),/PM-COWORK-NOT-HISTORICAL/);
});
test('new cowork own acceptance cannot authorize the actual envelope',()=>{
  const f=makeFixture();f.s.authorizations.review.role='cowork';f.sealOwn('cowork');
  assert.throws(()=>f.api.envelope(f.s,f.parent),/PM-COWORK-NOT-HISTORICAL/);
});
for(const target of ['parent','grandparent']) test('new cowork '+target+' is refused by actual inheritance path',()=>{
  const f=makeFixture();const forged=f.parentPackage('FIXTURE-NEW-COWORK','cowork',f.grand);
  if(target==='parent')assert.throws(()=>f.api.option(forged.option),/PM-COWORK-NOT-HISTORICAL/);
  else {const newer=f.parentPackage('FIXTURE-ON-FORGED','Astra PM',forged);assert.throws(()=>f.api.pins(f.s,newer),/PM-COWORK-NOT-HISTORICAL/);}
});
for(const role of ['astra pm','Astra','reviewer','cowork (Astra)','cowork / Astra PM']) test('spec refuses noncanonical role '+role,()=>{
  const f=makeFixture();const line=brief(role);f.append(line);f.s.brief.acceptedLedgerLine=f.claim(line,role);
  assert.throws(()=>f.saveSpec(),/PM-ISSUER-(CLAIM-ROLE|ROLE)/);
});
test('role words in payload do not make its author the PM',()=>{
  const f=makeFixture();const line='- 2026-09-13 · builder · copied · Astra PM · '+PACKAGE+' '+BRIEF+' · ACCEPTED';
  f.append(line);f.s.brief.acceptedLedgerLine=f.claim(line,'Astra PM');assert.throws(()=>f.saveSpec(),/PM-ISSUER-ROLE/);
});
test('accepted-by-name terminal is not machine accepted',()=>{
  const f=makeFixture();const line=brief('Astra PM').replace(/ACCEPTED$/,'ACCEPTED-BY-NAME');
  f.append(line);f.s.brief.acceptedLedgerLine=f.claim(line);assert.throws(()=>f.saveSpec(),/ends in the ACCEPT terminal/);
});
test('reviewer identity cannot stand in for PM acceptance role',()=>{
  const f=makeFixture();f.s.authorizations.review.role='Astra reviewer';assert.throws(()=>f.saveSpec(),/Review claim binds/);
});
test('own envelope checks its declared PM role against the actual issuer',()=>{
  const f=makeFixture();f.s.authorizations.review.role='cowork';f.sealOwn();assert.throws(()=>f.api.envelope(f.s,f.parent),/PM-ISSUER-CLAIM-ROLE/);
});
test('owner and inherited contract cannot be replaced by the new PM role',()=>{
  const f=makeFixture();f.s.authorizations.owner.role='Astra PM';assert.throws(()=>f.saveSpec(),/Claim coordinates owner/);
  f.s.authorizations.owner=f.claim(OWNER);f.s.authorizations.contract.role='Astra PM';assert.throws(()=>f.saveSpec(),/Claim coordinates contract/);
  f.s.authorizations.contract=f.claim(CONTRACT);const changed=structuredClone(f.parent);changed.acceptance.authorizations.contract.lineSha256='0'.repeat(64);
  assert.throws(()=>f.api.authority(f.s,changed),/INHERITED-CONTRACT-AUTHORIZATION/);
});
for(const part of ['line','document','duplicate','moved']) test('current chain cannot change the pinned handover '+part,()=>{
  const f=makeFixture();
  if(part==='line')f.lines[f.handover.lineNumber-1]+=' edited';
  if(part==='duplicate')f.lines.push(HANDOVER);
  if(part==='moved')f.lines.splice(f.handover.lineNumber-1,0,'inserted before handover');
  f.ledger();if(part==='document')f.write(DOC,docBytes+'edited\n');f.commit('tampered handover');
  assert.throws(()=>f.api.authority(f.s,f.parent),/PM-HANDOVER-(LINE-BYTES|DOCUMENT-BYTES|LINE-UNIQUE)/);
});
test('spec cannot provide replacement handover coordinates',()=>{
  const f=makeFixture();f.s.authorizations.handover={commit:f.anchor};assert.throws(()=>f.saveSpec(),/AUTHORIZATION-KEY-NOT-IN-THE-CLOSED-SET/);
});
test('void pre-handover Astra claim stays refused in a later context',()=>{
  const f=makeFixture();f.s.authorizations.theme=f.claim(VOID);assert.throws(()=>f.saveSpec(),/PM-ASTRA-CLAIM-PREDATES-HANDOVER/);
});
test('candidate-only Astra acceptance cannot satisfy actual authority',()=>{
  const f=makeFixture();f.git('checkout','--quiet','-b','fixture-candidate');const line=theme('Astra PM')+' candidate';f.append(line);
  f.s.authorizations.theme=f.claim(line);assert.throws(()=>f.api.authority(f.s,f.parent),/RECEIPT-EXACT-LINE-MISSING/);
});
test('off-chain grandparent receipt context is rejected by actual pins',()=>{
  const f=makeFixture();f.git('checkout','--quiet','-b','fixture-candidate');const outside=f.parentPackage('FIXTURE-OFFCHAIN','Astra PM',f.grand);
  const newer={...f.parent,acceptance:{...f.parent.acceptance,parent:{artifact:outside.option.artifact,sha256:outside.option.sha256,review:outside.option.review}}};
  assert.throws(()=>f.api.pins(f.s,newer),/PM-RECEIPT-CONTEXT-NOT-ON-CHAIN/);
});
test('wrong exact line hash, path, package and artifact still refuse',()=>{
  const f=makeFixture();const original=f.claim(brief('Astra PM'));
  f.s.brief.acceptedLedgerLine={...original,lineSha256:'0'.repeat(64)};assert.throws(()=>f.saveSpec(),/LEDGER-LINE-SHA256/);
  f.s.brief.acceptedLedgerLine=original;const line=brief('Astra PM').replace(PACKAGE,'M2-B1-OTHER');f.append(line);
  f.s.brief.acceptedLedgerLine=f.claim(line);assert.throws(()=>f.saveSpec(),/RECEIPT-CONTENT/);
  const r={...f.parent.receipt,path:'other.md'};assert.throws(()=>f.api.pmReceipt(r.commit,r,[]),/RECEIPT-SCHEMA/);
  assert.throws(()=>f.api.option({...f.parent.option,sha256:'0'.repeat(64)}),/PARENT-ARTIFACT-BYTES/);
});
test('re-reading authority detects a handover change after the first successful check',()=>{
  const f=makeFixture();f.api.authority(f.s,f.parent);f.write(DOC,docBytes+'changed after admission\n');f.commit('mid-run change');
  assert.throws(()=>f.api.authority(f.s,f.parent),/PM-HANDOVER-DOCUMENT-BYTES/);
});

test('a missing role does not inherit PM authority',()=>{
  const f=makeFixture();delete f.s.brief.acceptedLedgerLine.role;assert.throws(()=>f.saveSpec(),/PM-ISSUER-CLAIM-ROLE/);
});
test('an explicit null or missing acceptance still leaves an obligation open',()=>{
  const f=makeFixture();f.s.brief.acceptedLedgerLine=null;f.s.authorizations.theme=null;
  f.api.open.length=0;f.api.authority(f.s,f.parent);assert.equal(f.api.open.length,2);
  assert.throws(()=>f.saveSpec(),/BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE/);
});
test('handover material copied onto a chain without the actual anchor is not authority',()=>{
  const f=makeFixture({legacyClaims:true});
  f.git('checkout','--quiet','-b','fixture-without-anchor',f.parent.receiptBase);
  f.ledger();f.write(DOC,docBytes);const forged=f.commit('copied authority without its anchor');
  f.git('update-ref','refs/heads/fixture-chain',forged);
  assert.throws(()=>f.api.authority(f.s,f.parent),/PM-HANDOVER-NOT-ON-CHAIN/);
});
test('an Astra receipt context before the handover is refused, even if inherited later',()=>{
  const f=makeFixture();const at=f.base;
  const receipt={commit:at,path:LEDGER,line:VOID,lineSha256:hash(Buffer.from(VOID))};
  assert.throws(()=>f.api.pmReceipt(at,receipt,[PACKAGE]),/PM-ASTRA-CONTEXT-PREDATES-HANDOVER/);
});
test('actual freeze escape accepts an Astra PM claim and preserves stale-tip checks',()=>{
  const f=makeFixture();const lane=f.git('rev-parse','HEAD');
  const line='- 2026-09-13 · Astra PM · FREEZE '+PACKAGE+' '+lane+' · RULED';
  f.append(line);f.git('checkout','--quiet','--detach',lane);
  const s={...f.s,authorizations:{...f.s.authorizations,freeze:f.claim(line)}};
  const said=[];f.api.sealOnTheTip(s,text=>said.push(text));assert.match(said.join('\n'),/SEAL BASE FROZEN/);
});
test('own acceptance terminal cannot be replaced by ACCEPTED-BY-NAME',()=>{
  const f=makeFixture();const receipt=f.sealOwn();const line=receipt.line.replace(/ACCEPTED$/,'ACCEPTED-BY-NAME');
  const at=f.append(line);f.write(REVIEW,json({version:1,status:'ACCEPTED',receipt:{...receipt,commit:at,line,lineSha256:hash(Buffer.from(line))}}));
  f.commit('wrong acceptance terminal');assert.throws(()=>f.api.envelope(f.s,f.parent),/Exact independent verdict/);
});
test('own acceptance never becomes a reviewer-model field',()=>{
  const f=makeFixture();f.sealOwn('Astra reviewer');assert.throws(()=>f.api.envelope(f.s,f.parent),/PM-ISSUER-ROLE/);
});
test('actual envelope still rejects changed pinned product bytes',()=>{
  const f=makeFixture();f.sealOwn();f.write(PRODUCT,'module.exports = "changed after seal";\n');
  assert.throws(()=>f.api.envelope(f.s,f.parent),/WORKTREE-SOURCE-PIN/);
});
test('actual spec still rejects runner and spec drift without a reviewed commit',()=>{
  const f=makeFixture();f.write(RUNNER,f.fixtureCode+'\n// unreviewed\n');
  assert.throws(()=>f.api.spec(),/RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER/);
  f.write(RUNNER,f.fixtureCode);f.s.notes.push('uncommitted change');f.write(SPEC,json(f.s));
  assert.throws(()=>f.api.spec(),/SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT/);
});

function mutated(from,to) {
  assert.equal(source.split(from).length,2,'one exact source mutant anchor');
  return source.replace(from,to);
}
function losesAssertion(probe) {
  // The negative control's assertion must fail because the mutation let the bad
  // claim through. An unrelated parser/Git/fixture error is not a mutant kill.
  assert.throws(probe,error=>error.code==='ERR_ASSERTION'&&/^Missing expected exception/.test(error.message));
}
test('RED control: restoring the legacy role check rejects the new Astra spec',()=>{
  const old=mutated('pmLedger(CHAIN_REF, s.brief.acceptedLedgerLine, [s.packageId, s.brief.file]);',
    "claim(s.brief.acceptedLedgerLine, 'cowork', 'brief acceptance');");
  assert.throws(()=>makeFixture({code:old}),/Claim coordinates brief acceptance/);
});
test('source mutant: removing the historical cowork fence loses the actual spec refusal',()=>{
  const f=makeFixture({code:mutated('handover.historical.filter(line => line === receipt.line).length, 1,','1, 1,')});
  const line=brief('cowork').replace('BRIEF ','NEW BRIEF ');f.append(line);f.s.brief.acceptedLedgerLine=f.claim(line);
  losesAssertion(()=>assert.throws(()=>f.saveSpec(),/PM-COWORK-NOT-HISTORICAL/));
  f.s.brief.acceptedLedgerLine=f.claim(brief('Astra PM'));f.saveSpec();
});
test('source mutant: searching payload role words loses the actual spec refusal',()=>{
  const f=makeFixture({code:mutated('/^- \\d{4}-\\d{2}-\\d{2} · (cowork|Astra PM) · /','/ · (cowork|Astra PM) · /')});
  const line='- 2026-09-13 · builder · quoted · Astra PM · '+PACKAGE+' '+BRIEF+' · ACCEPTED';f.append(line);
  f.s.brief.acceptedLedgerLine=f.claim(line,'Astra PM');losesAssertion(()=>assert.throws(()=>f.saveSpec(),/PM-ISSUER-ROLE/));
});
test('source mutant: dropping owner-line byte pin loses actual authority refusal',()=>{
  const f=makeFixture({code:mutated("sha(Buffer.from(lines[PM_HANDOVER.lineNumber - 1] || '')), PM_HANDOVER.lineSha256,",'PM_HANDOVER.lineSha256, PM_HANDOVER.lineSha256,')});
  // Keep a second copy of the true line so uniqueness alone cannot replace position.
  f.lines[f.handover.lineNumber-1]+=' moved';f.lines.push(HANDOVER);f.ledger();f.commit('move owner authority');
  losesAssertion(()=>assert.throws(()=>f.api.authority(f.s,f.parent),/PM-HANDOVER-LINE-BYTES/));
});
test('source mutant: dropping handover document pin loses actual authority refusal',()=>{
  const f=makeFixture({code:mutated('sha(L.object(root, at, PM_HANDOVER.document)), PM_HANDOVER.documentSha256,','PM_HANDOVER.documentSha256, PM_HANDOVER.documentSha256,')});
  f.write(DOC,docBytes+'forged');f.commit('forged document');
  losesAssertion(()=>assert.throws(()=>f.api.authority(f.s,f.parent),/PM-HANDOVER-DOCUMENT-BYTES/));
});
test('source mutant: dropping unique handover line check loses actual spec refusal',()=>{
  const f=makeFixture({code:mutated('lines.filter(line => sha(Buffer.from(line)) === PM_HANDOVER.lineSha256).length, 1,','1, 1,')});
  f.append(HANDOVER);losesAssertion(()=>assert.throws(()=>f.api.spec(),/PM-HANDOVER-LINE-UNIQUE/));
});
test('source mutant: dropping actual anchor ancestry loses the historical-claim refusal',()=>{
  const f=makeFixture({legacyClaims:true,code:mutated("ancestor(PM_HANDOVER.commit, CHAIN_REF, 'PM-HANDOVER-NOT-ON-CHAIN');",'/* mutant: no actual anchor ancestry */')});
  f.git('checkout','--quiet','-b','fixture-without-anchor',f.parent.receiptBase);f.ledger();f.write(DOC,docBytes);
  const forged=f.commit('copied handover material');f.git('update-ref','refs/heads/fixture-chain',forged);
  losesAssertion(()=>assert.throws(()=>f.api.authority(f.s,f.parent),/PM-HANDOVER-NOT-ON-CHAIN/));
});
test('source mutant: dropping receipt ancestry loses the actual grandparent pins refusal',()=>{
  const f=makeFixture({code:mutated("ancestor(at, CHAIN_REF, 'PM-RECEIPT-CONTEXT-NOT-ON-CHAIN');",'/* mutant: off-chain receipt context */')});
  // Keep the accepted artifact/reviewed commit on the chain; only its receipt
  // context is outside it, so the new reviewed-commit guard cannot mask this one.
  f.git('checkout','--quiet','-b','fixture-candidate');const outside=f.commit('off-chain context with the genuine historical line');
  f.git('checkout','--quiet','fixture-chain');
  const receipt={...f.grand.receipt,commit:outside};
  f.write(f.grand.option.review,json({version:1,status:'ACCEPTED',receipt}));f.commit('fixture off-chain grandparent receipt context');
  const bound=f.api.option(f.parent.option);bound.decided=true;
  losesAssertion(()=>assert.throws(()=>f.api.pins(f.s,bound),/PM-RECEIPT-CONTEXT-NOT-ON-CHAIN/));
  f.write(f.grand.option.review,json({version:1,status:'ACCEPTED',receipt:f.grand.receipt}));f.commit('fixture restore historical receipt context');
  f.api.pins(f.s,bound);
});

for (const entry of [
  {name:'exact terminal',from:'const gm = RECEIPT.exec(gr.receipt.line);',
    to:"const gm = RECEIPT.exec(gr.receipt.line.replace(/(?:REJECTED|PENDING|ACCEPTED-BY-NAME)$/, 'ACCEPTED'));",
    line:grandparentPayloadCases[0].line,pattern:/Grandparent receipt content/},
  {name:'package binding',from:"assert.equal(gm[1], ga.packageId, 'GRANDPARENT-RECEIPT-PACKAGE');",
    line:grandparentPayloadCases.find(x=>x.name==='different package').line,pattern:/GRANDPARENT-RECEIPT-PACKAGE/},
  {name:'artifact path binding',from:"assert.equal(gm[3], g.artifact, 'GRANDPARENT-RECEIPT-ARTIFACT');",
    line:grandparentPayloadCases.find(x=>x.name==='wrong artifact despite a correct mention').line,pattern:/GRANDPARENT-RECEIPT-ARTIFACT/},
  {name:'artifact hash binding',from:"assert.equal(gm[4], g.sha256, 'GRANDPARENT-RECEIPT-HASH');",
    line:grandparentPayloadCases.find(x=>x.name==='wrong sha256 despite a correct mention').line,pattern:/GRANDPARENT-RECEIPT-HASH/},
  {name:'reviewed artifact bytes',from:"assert.equal(sha(L.object(root, gm[2], g.artifact)), g.sha256, 'GRANDPARENT-REVIEWED-ARTIFACT-BYTES');",
    line:wrongGrandparentArtifact,pattern:/GRANDPARENT-REVIEWED-ARTIFACT-BYTES/},
  {name:'reviewed commit ancestry',from:"ancestor(gm[2], 'HEAD', 'GRANDPARENT-REVIEWED-COMMIT-NOT-BEHIND-HEAD');\n    ancestor(gm[2], CHAIN_REF, 'GRANDPARENT-REVIEWED-COMMIT-NOT-ON-THE-CHAIN-BRANCH');",
    line:offChainGrandparentCommit,pattern:/GRANDPARENT-REVIEWED-COMMIT-NOT-/}
]) test('R1 source mutant: removing '+entry.name+' loses the actual grandparent pins refusal',()=>{
  const setup=grandparentFixture(mutated(entry.from,entry.to||'/* R1 mutant: removed grandparent guard */'));
  const bound=replaceGrandparentReceipt(setup,entry.line(setup));
  losesAssertion(()=>assert.throws(()=>setup.f.api.pins(setup.f.s,bound),entry.pattern));
  restoreGrandparentReceipt(setup);
});
test('source mutant: reviving a pre-handover Astra line loses actual spec refusal',()=>{
  const f=makeFixture({code:mutated("assert(!handover.historical.includes(receipt.line), 'PM-ASTRA-CLAIM-PREDATES-HANDOVER');",'/* mutant: revive void historical Astra */')
    .replace("assert(context.indexOf(receipt.line) >= PM_HANDOVER.lineNumber, 'PM-ASTRA-LINE-BEFORE-HANDOVER');",'/* same epoch mutant: accept old line position */')});
  f.s.authorizations.theme=f.claim(VOID);losesAssertion(()=>assert.throws(()=>f.saveSpec(),/PM-ASTRA-CLAIM-PREDATES-HANDOVER/));
});
test('source mutant: ignoring declared PM review role loses actual envelope refusal',()=>{
  const f=makeFixture({code:mutated("if (expectedRole !== undefined) assert.equal(role, expectedRole, 'PM-ISSUER-CLAIM-ROLE');",'/* mutant: no declared issuer binding */')});
  f.s.authorizations.review.role='cowork';f.sealOwn();losesAssertion(()=>assert.throws(()=>f.api.envelope(f.s,f.parent),/PM-ISSUER-CLAIM-ROLE/));
});
