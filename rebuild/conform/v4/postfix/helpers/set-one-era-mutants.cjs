'use strict';
const fs=require('node:fs'),path=require('node:path');
const T=require('../target.cjs'),L=require('../legacy-gates.cjs');
const VOLUME_SHA='23e9528bff84cf83086c77c7c26f990f13589dde748382f5e98d35b6206a9719';
const GUARD='    if (!sameEra(forks, d, at)) continue;';
const QUERY='  const at = forks.length ? isoOf(todayStart()) : null;';
function definitions(volume){if(T.sha(volume)!==VOLUME_SHA)throw Error('ERA30-MUTANT-PRODUCT-PIN');const start=volume.indexOf('function setOneRead(s, exId) {'),end=volume.indexOf('\n}',start)+2;if(start<0||end<=start)throw Error('ERA30-MUTANT-SCOPE');const scope={start,end,sha256:T.sha(volume.slice(start,end))};
 const definitions=[
  ['ERA30-NO-GUARD',GUARD,'','ERA30-ORIGINAL',false],
  ['ERA30-INVERTED',GUARD,'    if (sameEra(forks, d, at)) continue;','ERA30-ORIGINAL',false],
  ['ERA30-LATEST-FORK',QUERY,'  const at = forks.length ? forks.reduce((latest, f) => f && f.from && f.from > latest ? f.from : latest, "") : null;','ERA30-FUTURE-WITHIN-QUERY-ERA',true],
  ['ERA30-EXCLUSIVE-BOUNDARY',GUARD,'    if (!sameEra(forks, d, at) || forks.some(f => f && f.from === d)) continue;','ERA30-BOUNDARY',false],
  ['ERA30-BORROW-OLD',GUARD,'    if (!sameEra(forks, d, at) && pts.length >= TREND_MIN_SESSIONS) continue;','ERA30-ORIGINAL',false],
  ['ERA30-NO-LEGACY','  const forks = forksOf(s, exId);','  const forks = (s.exercises || []).find(x => x && x.id === exId).forks || [];','ERA30-LEGACY',true],
  ['ERA30-FUTURE-CUTOFF',GUARD,'    if (!sameEra(forks, d, at) || d > at) continue;','ERA30-FUTURE-WITHIN-QUERY-ERA',false],
  ['ERA30-AMBIENT-CLOCK',QUERY,'  const at = forks.length ? isoOf(new Date()) : null;','ERA30-CLOCK-AMBIENT-TRAP',true]
 ];
 return definitions.map(([id,preimage,postimage,caseId,clock])=>{if(volume.split(preimage).length!==2)throw Error('ERA30-MUTANT-UNIQUE-SITE');return{id,file:'volume.cjs',declaration:'setOneRead',preimageHash:VOLUME_SHA,preimage,postimage,postimageHash:T.sha(volume.replace(preimage,postimage)),caseId,scope,
   expectedFailures:[caseId+'/result',caseId+'/weather',caseId+'/pace',...(clock?[caseId+'/query-clock']:[])].sort()};});
}
function coordinates(root){root=path.resolve(root);const base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'))),candidate=path.join(root,'rebuild/engine'),inventory=Object.fromEntries(Object.keys(base.baseline.engine).map(f=>[f,T.sha(fs.readFileSync(path.join(candidate,f)))]));
 const helperPins={...base.baseline.publicPins};
 for(const f of ['helpers/set-one-era-frozen.cjs','helpers/set-one-era-cases.cjs','helpers/step-efficacy-frozen.cjs','helpers/import-guards-frozen.cjs','helpers/import-guards-hosts.cjs','laws/step-efficacy.cjs','laws/import-guards.cjs','trace-v2.cjs']){const rel='rebuild/conform/v4/postfix/'+f;helperPins[rel]=T.sha(fs.readFileSync(path.join(root,rel)));}
 const caseFile=path.join(root,'rebuild/conform/v4/postfix/laws/set-one-era.cjs');
 return{base,candidate,inventory,caseInput:{kind:'direct',candidate,inventory,caseFile,caseSha256:T.sha(fs.readFileSync(caseFile)),helperRoot:root,helperPins,hostsHelper:'rebuild/conform/v4/postfix/helpers/set-one-era-frozen.cjs',frozenHelper:'rebuild/conform/v4/postfix/helpers/set-one-era-frozen.cjs',traceProfile:2}};
}
function runMutants({root}){const {base,candidate,inventory,caseInput}=coordinates(root),M=require('../laws/set-one-era.cjs'),mutants=definitions(fs.readFileSync(path.join(candidate,'volume.cjs'),'utf8'));let effective=0;
 for(const mutant of mutants){const expected=M.ASSERTION_INVENTORY.filter(a=>a.caseId===mutant.caseId).map(a=>({id:a.id,count:1}));for(const cell of base.matrix){L.faultRun({candidate,inventory,scratch:path.join(root,'.tmp/postfix/era30-faults'),mutant,caseInput:{...caseInput,lawId:M.D30.id,caseId:mutant.caseId,...cell},expected});effective++;}
 console.log(mutant.id+' 4/4 EFFECTIVE: '+mutant.expectedFailures.join(', '));}
 if(T.sha(fs.readFileSync(path.join(candidate,'volume.cjs')))!==VOLUME_SHA)throw Error('ERA30-PRODUCT-NOT-RESTORED');
 fs.writeFileSync(path.join(root,'.tmp/postfix/set-one-era-mutants.json'),JSON.stringify(mutants,null,2)+'\n');
 console.log('ERA30 REAL SOURCE FAULTS '+effective+'/32 EFFECTIVE; restored '+VOLUME_SHA);return mutants;
}
function runBite({root}){
 const {candidate,inventory,caseInput}=coordinates(root),M=require('../laws/set-one-era.cjs'),original=fs.readFileSync(path.join(candidate,'volume.cjs')),
  mutant=definitions(original.toString('utf8'))[0],parent=path.resolve(root,'.tmp/postfix/era30-bite');fs.mkdirSync(parent,{recursive:true});const copy=fs.mkdtempSync(path.join(parent,'owned-'));
 const expected=M.ASSERTION_INVENTORY.filter(a=>a.caseId===mutant.caseId).map(a=>({id:a.id,count:1})),input={...caseInput,candidate:copy,lawId:M.D30.id,caseId:mutant.caseId,mode:'frozen',day:'2026-09-03'};
 try{
  for(const f of Object.keys(inventory)){const out=path.resolve(copy,f);if(path.dirname(out)!==copy)throw Error('ERA30-BITE-FILE-SCOPE');fs.copyFileSync(path.join(candidate,f),out);}
  const changed=original.toString('utf8').replace(mutant.preimage,mutant.postimage),file=path.join(copy,'volume.cjs');fs.writeFileSync(file,changed);
  const red=T.runRaw({...input,inventory:{...inventory,'volume.cjs':T.sha(changed)}}),failures=L.assertions(red,expected);if(JSON.stringify(failures)!==JSON.stringify(mutant.expectedFailures))throw Error('ERA30-BITE-WRONG-FAILURE');
  const redLine='ERA30 BITE RED: '+failures.join(', ');console.log(redLine);
  fs.writeFileSync(file,original);if(!fs.readFileSync(file).equals(original)||T.sha(fs.readFileSync(file))!==VOLUME_SHA)throw Error('ERA30-BITE-LITERAL-RESTORATION');
  if(L.assertions(T.runRaw({...input,inventory}),expected).length)throw Error('ERA30-BITE-RESTORED-NOT-GREEN');
  const restoredLine='ERA30 BITE RESTORED GREEN: '+VOLUME_SHA;console.log(restoredLine);
  for(const [f,hash]of Object.entries(inventory))if(T.sha(fs.readFileSync(path.join(candidate,f)))!==hash)throw Error('ERA30-BITE-ROOT-CHANGED');
  const receipt={redLine,restoredLine,mutatedSha256:T.sha(changed),restoredSha256:VOLUME_SHA,actualMutatedCopyOverwritten:true,rootProductUnchanged:true};fs.writeFileSync(path.join(root,'.tmp/postfix/set-one-era-bite.json'),JSON.stringify(receipt,null,2)+'\n');return receipt;
 }finally{const real=fs.realpathSync(copy),relative=path.relative(parent,real);if(real!==copy||path.dirname(real)!==parent||relative.startsWith('..')||path.isAbsolute(relative))throw Error('ERA30-BITE-CLEANUP-SCOPE');fs.rmSync(real,{recursive:true,force:true});}
}
module.exports={VOLUME_SHA,definitions,coordinates,runMutants,runBite};
if(require.main===module)try{(process.argv[2]==='--bite'?runBite:runMutants)({root:process.cwd()});}catch(e){console.error('ERA30 FAULT ERROR: '+e.message);process.exitCode=1;}
