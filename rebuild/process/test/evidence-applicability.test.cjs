'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const E=require('../evidence-applicability.cjs');
const root=path.resolve(__dirname,'../../..'),scratch=path.join(root,'.tmp/evidence-applicability');fs.mkdirSync(scratch,{recursive:true});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),bytes=x=>Buffer.from(JSON.stringify(x,null,2)+'\n');
const REPORT='rebuild/m2/REPORT-M2-STEP-EFFICACY-ASTRA.md';
// These repositories and receipts are expressly synthetic. Their positive result
// tests the protocol; it cannot authorize a real EARNED receipt or gate change.
function fixture(options={}){
  const dir=fs.mkdtempSync(path.join(scratch,'synthetic-'));let n=0;
  const git=args=>cp.execFileSync('git',args,{cwd:dir,encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();
  const write=(f,b)=>{const p=path.join(dir,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b);};
  const commit=()=>{git(['add','.']);git(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-qm','synthetic '+n++]);return git(['rev-parse','HEAD']);};
  git(['init','-q']);const inputs={};for(const k of E.INPUTS){const file='synthetic-inputs/'+k+'.txt',text='synthetic '+k+'\n';write(file,text);inputs[k]={[file]:hash(text)};}write(REPORT,'original synthetic report\n');write('rebuild/DECISIONS.md','synthetic pre-existing ledger\n');const original=commit();
  let successor;
  if(options.merge){git(['checkout','-qb','other']);write(REPORT,'other synthetic report\n');commit();git(['checkout','-qb','main-side',original]);write('rebuild/DECISIONS.md','synthetic combined ledger\n');commit();git(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','merge','--no-ff','-qm','synthetic merge','other']);successor=git(['rev-parse','HEAD']);}
  else{write(REPORT,'successor synthetic report\n');if(options.receiptUpdate)write('rebuild/DECISIONS.md','synthetic receipt-only ledger\n');if(options.changed){const f=Object.keys(inputs[options.changed])[0];write(f,'changed synthetic input\n');}successor=commit();}
  const observations=Object.fromEntries(E.FACTS.map(k=>[k,hash('observed synthetic '+k)]));
  const evidence={version:1,profile:E.PROFILE,candidate:original,role:'cowork',command:'POSTFIX-M2-STEP-EFFICACY',status:'PASS',exitCode:0,completed:true,
    invocations:E.INVOCATIONS.map(id=>({id,status:'PASS',exitCode:0})),totals:{gateIdentities:19,invocations:28,raw:180,direct:1180,mutants:68},inputs:structuredClone(inputs),observations:structuredClone(observations)};
  options.evidence?.(evidence);write('synthetic-evidence/original.json',bytes(evidence));const evidenceCommit=commit();
  const record={version:1,profile:E.PROFILE,originalEvidence:{commit:evidenceCommit,file:'synthetic-evidence/original.json',sha256:hash(bytes(evidence))},successor,inputs:structuredClone(inputs),currentObservations:structuredClone(observations),
    changedPaths:git(['diff','--name-only',original,successor]).split(/\r?\n/),scope:'RECEIPT-REPORT-ONLY',combined:null};
  if(options.changed){const f=Object.keys(record.inputs[options.changed])[0];record.inputs[options.changed][f]=hash('changed synthetic input\n');}
  if(options.combined){
    const result={candidate:successor,role:'integrator',status:'PASS',exitCode:0,checks:['receipt','scope','affected-combined-build'],environment:observations.environment};options.combinedResult?.(result);
    const file='synthetic-evidence/combined.json';write(file,bytes(result));const resultCommit=commit(),reference={commit:resultCommit,file,sha256:hash(bytes(result))};
    const line='- synthetic · integrator · COMBINED-EVIDENCE '+E.PROFILE+' '+resultCommit+' '+file+' '+reference.sha256+' PASS';
    write('rebuild/DECISIONS.md','synthetic combined execution\n'+line+'\n');const receiptBase=commit();record.combined={reference,receiptBase,receipt:{commit:receiptBase,path:'rebuild/DECISIONS.md',line,lineSha256:hash(line)}};
  }
  options.record?.(record);write('synthetic-evidence/applicability.json',bytes(record));const recordCommit=commit();
  const recordRef={commit:recordCommit,file:'synthetic-evidence/applicability.json',sha256:hash(bytes(record))};
  const line='- synthetic · cowork · EVIDENCE-APPLICABILITY '+E.PROFILE+' '+recordCommit+' '+recordRef.file+' '+recordRef.sha256+' ACCEPTED';
  write('rebuild/DECISIONS.md','synthetic pre-existing ledger\n'+line+'\n');const reviewBase=commit();
  const receipt={commit:reviewBase,path:'rebuild/DECISIONS.md',line,lineSha256:hash(line)};git(['update-ref','refs/remotes/origin/rebuild/t2-client-core',reviewBase]);git(['checkout','-q','--detach',successor]);
  const args={root:dir,reviewBase,receipt,recordRef,successor};options.args?.(args);
  return {args,git,write,run:()=>E.verifyReviewedEvidence(args),close(){const resolved=fs.realpathSync(dir),boundary=fs.realpathSync(scratch)+path.sep;assert(resolved.startsWith(boundary));fs.rmSync(resolved,{recursive:true,force:true});}};
}
function withFixture(options,fn){const f=fixture(options);try{return fn(f);}finally{f.close();}}
function refused(options,status,code){withFixture(options,f=>{const r=f.run();assert.equal(r.status,status);if(code)assert.equal(r.code,code);});}
test('fixed D12 invocation inventory is 19 identities and 28 executions',()=>{assert.equal(E.INVOCATIONS.length,28);assert.equal(new Set(E.INVOCATIONS.map(x=>x.split('/')[0])).size,19);assert.deepEqual([...new Set(E.INVOCATIONS.map(x=>x.split('/')[0]))],require('../../conform/v4/postfix/run.cjs').GATES.map(x=>x[0]));});
test('unchanged independently pinned synthetic evidence is eligible, never a new execution PASS',()=>withFixture({},f=>{assert.deepEqual(f.run(),{profile:E.PROFILE,status:'REUSE-ELIGIBLE',code:'VERIFIED-APPLICABILITY'});assert(!E.publicLine(f.run()).includes('PASS'));}));
for(const k of E.INPUTS)test('changed '+k+' refuses reuse',()=>refused({changed:k},'REEXECUTE-REQUIRED','CHANGED-'+k.toUpperCase()));
for(const k of E.FACTS){test('changed observed '+k+' refuses reuse',()=>refused({record:r=>{r.currentObservations[k]=hash('different');}},'REEXECUTE-REQUIRED','CHANGED-'+k.toUpperCase()));test('missing observed '+k+' is UNKNOWN',()=>refused({evidence:e=>{e.observations[k]=null;}},'UNKNOWN','MISSING-'+k.toUpperCase()));}
test('caller complete/accepted assertion is not part of record schema',()=>refused({record:r=>{r.accepted=true;}},'REEXECUTE-REQUIRED','RECORD-SCHEMA'));
test('omitted input class refuses',()=>refused({record:r=>{delete r.inputs.dependencies;}},'REEXECUTE-REQUIRED','RECORD-SCHEMA'));
test('empty inventory is unknown despite reviewed declaration',()=>refused({record:r=>{r.inputs.fixtureSetup={};}},'UNKNOWN','INPUT-INVENTORY'));
test('wrong checkout is rejected even with identical synthetic files',()=>withFixture({},f=>{f.args.successor='0'.repeat(40);assert.equal(f.run().code,'WRONG-CHECKOUT');}));
test('changed disk input refuses despite unchanged committed pins',()=>withFixture({},f=>{f.write('synthetic-inputs/transitive.txt','different disk only\n');assert.notEqual(f.run().status,'REUSE-ELIGIBLE');}));
test('missing verifier receipt is UNKNOWN',()=>refused({args:a=>{a.receipt=null;}},'UNKNOWN','VERIFIER-PROVENANCE-MISSING'));
test('forged local review outside trusted integration is UNKNOWN',()=>withFixture({},f=>{f.git(['update-ref','refs/remotes/origin/rebuild/t2-client-core',f.args.successor]);assert.equal(f.run().status,'UNKNOWN');assert.equal(f.run().code,'EVIDENCE-OUTSIDE-TRUSTED-INTEGRATION');}));
test('absent trusted integration ref is UNKNOWN',()=>withFixture({},f=>{f.git(['update-ref','-d','refs/remotes/origin/rebuild/t2-client-core']);assert.equal(f.run().code,'TRUSTED-INTEGRATION-MISSING');}));
function localRemote(f,target){
  const remote=path.join(f.args.root,'synthetic-remote.git');f.git(['update-ref','refs/heads/rebuild/t2-client-core',target]);
  cp.execFileSync('git',['clone','--bare',f.args.root,remote],{windowsHide:true,stdio:['ignore','pipe','pipe']});f.git(['remote','add','origin',remote]);
}
test('existing bounded fetch refreshes actual local-remote evidence anchor',()=>withFixture({},f=>{localRemote(f,f.args.reviewBase);f.git(['update-ref','refs/remotes/origin/rebuild/t2-client-core',f.args.successor]);assert.equal(f.run().status,'UNKNOWN');assert.equal(E.refreshReviewedEvidence(f.args).status,'REUSE-ELIGIBLE');}));
test('failed integration fetch is UNKNOWN, never cached eligibility',()=>withFixture({},f=>{f.git(['remote','add','origin',path.join(f.args.root,'missing-remote.git')]);assert.equal(E.refreshReviewedEvidence(f.args).code,'INTEGRATION-FETCH-FAILED');}));
test('fresh fetch cannot endorse an unanchored local receipt',()=>withFixture({},f=>{localRemote(f,f.args.successor);f.git(['update-ref','refs/remotes/origin/rebuild/t2-client-core',f.args.successor]);assert.equal(E.refreshReviewedEvidence(f.args).code,'EVIDENCE-OUTSIDE-TRUSTED-INTEGRATION');}));
test('mapping without provenance never attempts a fetch',()=>{assert.deepEqual(E.refreshReviewedEvidence({root:'missing',recordRef:null,receipt:null}),{profile:E.PROFILE,status:'UNKNOWN',code:'VERIFIER-PROVENANCE-MISSING'});});
test('wrong receipt hash cannot authorize reuse',()=>refused({args:a=>{a.receipt.lineSha256='0'.repeat(64);}},'UNKNOWN','PROVENANCE-VALIDATION-FAILED'));
test('caller-thrown fake success status cannot authorize reuse',()=>refused({args:a=>{Object.defineProperty(a.recordRef,'file',{get(){throw {applicabilityStatus:'REUSE-ELIGIBLE',applicabilityCode:'invented'};}});}},'UNKNOWN','PROVENANCE-VALIDATION-FAILED'));
test('wrong role receipt cannot authorize reuse',()=>refused({args:a=>{a.receipt.line=a.receipt.line.replace('cowork','astra');a.receipt.lineSha256=hash(a.receipt.line);}},'UNKNOWN','PROVENANCE-VALIDATION-FAILED'));
test('missing original evidence refuses',()=>refused({record:r=>{r.originalEvidence.file='missing.json';}},'UNKNOWN','PROVENANCE-VALIDATION-FAILED'));
test('changed original result digest refuses',()=>refused({record:r=>{r.originalEvidence.sha256='0'.repeat(64);}},'REEXECUTE-REQUIRED','PROVENANCE-BYTE-PIN'));
for(const status of ['FAIL','SKIPPED','PENDING','REVIEW-PENDING'])test('original '+status+' never becomes PASS',()=>refused({evidence:e=>{e.status=status;}},'REEXECUTE-REQUIRED','EXECUTION-NOT-SUCCESSFUL'));
test('nonzero original exit refuses',()=>refused({evidence:e=>{e.exitCode=2;}},'REEXECUTE-REQUIRED','EXECUTION-NOT-SUCCESSFUL'));
test('incomplete original refuses',()=>refused({evidence:e=>{e.completed=false;}},'REEXECUTE-REQUIRED','EXECUTION-NOT-SUCCESSFUL'));
test('missing invocation refuses',()=>refused({evidence:e=>{e.invocations.pop();}},'REEXECUTE-REQUIRED','EXECUTION-INVENTORY'));
test('duplicate invocation refuses',()=>refused({evidence:e=>{e.invocations[1]=e.invocations[0];}},'REEXECUTE-REQUIRED','EXECUTION-INVENTORY'));
test('failed required invocation refuses',()=>refused({evidence:e=>{e.invocations[0].status='FAIL';}},'REEXECUTE-REQUIRED','EXECUTION-INCOMPLETE'));
test('invented result count refuses',()=>refused({evidence:e=>{e.totals.mutants=0;}},'REEXECUTE-REQUIRED','EXECUTION-TOTALS'));
test('source-selection identity is not inferred from matching file text',()=>refused({evidence:e=>{e.command='OTHER-CANDIDATE';}},'REEXECUTE-REQUIRED','EXECUTION-IDENTITY'));
test('changed report semantics cannot claim editorial eligibility',()=>refused({record:r=>{r.scope='GATE-APPLICABILITY-CHANGE';}},'REEXECUTE-REQUIRED','SUCCESSOR-SEMANTICS'));
test('unlisted change cannot be hidden by source pin selection',()=>refused({record:r=>{r.changedPaths=[];}},'REEXECUTE-REQUIRED','SUCCESSOR-SCOPE'));
test('every actual merge requires reexecution',()=>refused({merge:true},'REEXECUTE-REQUIRED','MERGED-COMPOSITION-REQUIRES-REEXECUTION'));
test('even reviewed combined checks do not exempt an actual merge',()=>refused({merge:true,combined:true},'REEXECUTE-REQUIRED','MERGED-COMPOSITION-REQUIRES-REEXECUTION'));
test('nonmerge receipt successor requires fresh combined evidence',()=>refused({receiptUpdate:true},'REEXECUTE-REQUIRED','COMBINED-CHECKS-REQUIRED'));
test('nonmerge receipt successor accepts separately anchored integrator execution',()=>withFixture({receiptUpdate:true,combined:true},f=>assert.equal(f.run().status,'REUSE-ELIGIBLE')));
test('nested self-declared combined PASS is not execution provenance',()=>refused({receiptUpdate:true,record:r=>{r.combined={status:'PASS'};}},'REEXECUTE-REQUIRED','RECORD-SCHEMA'));
test('wrong combined receipt cannot authorize reuse',()=>refused({receiptUpdate:true,combined:true,record:r=>{r.combined.receipt.lineSha256='0'.repeat(64);}},'UNKNOWN','PROVENANCE-VALIDATION-FAILED'));
for(const [key,value]of [['candidate','0'.repeat(40)],['status','PENDING'],['exitCode',1],['environment',hash('different')]])test('combined check '+key+' mismatch refuses',()=>refused({receiptUpdate:true,combined:true,combinedResult:r=>{r[key]=value;}},'REEXECUTE-REQUIRED','COMBINED-CHECKS-INVALID'));
test('arbitrary error/result text and synthetic canary are never emitted',()=>{const canary='synthetic-private-custody-canary';assert.equal(E.publicLine({status:canary,code:canary,detail:canary}),'D12 EVIDENCE APPLICABILITY UNKNOWN');withFixture({args:a=>{a.recordRef.file=canary;}},f=>{assert(!JSON.stringify(f.run()).includes(canary));assert(!E.publicLine(f.run()).includes(canary));});});
test('actual D12 entry does not treat a synthetic schema fixture as real acceptance',()=>withFixture({},f=>{assert.equal(E.assessD12(f.args).status,'UNKNOWN');}));
test('altered helper-side validator refuses while mapped target remains clean',()=>{
  const dir=fs.mkdtempSync(path.join(scratch,'helper-origin-')),relative='rebuild/conform/v4/postfix/acceptance.cjs',actual=fs.readFileSync(path.join(root,relative));
  try{
    fs.cpSync(path.join(root,'rebuild/conform/v4/postfix'),path.join(dir,'rebuild/conform/v4/postfix'),{recursive:true});
    fs.mkdirSync(path.join(dir,'rebuild/process'),{recursive:true});fs.copyFileSync(path.join(root,'rebuild/process/evidence-applicability.cjs'),path.join(dir,'rebuild/process/evidence-applicability.cjs'));
    const entry=path.join(dir,'rebuild/process/evidence-applicability.cjs');
    const child=script=>cp.execFileSync(process.execPath,['-e',script,entry,root],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();
    assert.equal(child('const h=require(process.argv[1]);console.log(h.verifyHelperOrigin(process.argv[2]));'),'true');
    fs.appendFileSync(path.join(dir,relative),'\nmodule.exports.verifyReceipts = () => true;\n');
    const result=JSON.parse(child('const h=require(process.argv[1]);console.log(JSON.stringify(h.assessD12({root:process.argv[2]})));'));
    assert.equal(result.status,'REEXECUTE-REQUIRED');assert.equal(result.code,'HELPER-SOURCE-ORIGIN');assert.deepEqual(fs.readFileSync(path.join(root,relative)),actual);
    fs.writeFileSync(path.join(dir,relative),actual);assert.equal(child('const h=require(process.argv[1]);console.log(h.verifyHelperOrigin(process.argv[2]));'),'true');
  }finally{assert(fs.realpathSync(dir).startsWith(fs.realpathSync(scratch)+path.sep));fs.rmSync(dir,{recursive:true,force:true});}
});
