'use strict';
// Six real declaration mutations. Expected assertions are fixed, never harvested
// from a failing candidate. Disposable copies only; no product or parent edit.
const fs=require('node:fs'),path=require('node:path');
const T=require('../target.cjs'),L=require('../legacy-gates.cjs'),B=require('./build-step-efficacy-expectations.cjs');
const ENERGY_SHA='4dd7195e51d207bd4b8f4e09db066fd6b4fcb954a85efa4e097d4f06a587fffc';
const SLOPE='const slopePer1k = den ? +(num / den).toFixed(3) : 0;';
const RESOLVED='const resolved = den > 0 && Math.abs(slopePer1k) <= boundPer1k * 5;';
function definitions(energy){if(T.sha(energy)!==ENERGY_SHA)throw Error('SE12-MUTANT-ENERGY-PIN');const start=energy.indexOf('function stepEfficacy(s) {'),end=energy.indexOf('\n}\n',start)+2;if(start<0||end<start)throw Error('SE12-MUTANT-SCOPE');const scope={start,end,sha256:T.sha(energy.slice(start,end))};
 return[
 ['SE12-SCALED',SLOPE,'const slopePer1k = den ? +((num / den) * 1000).toFixed(3) : 0;','SE12-POSITIVE'],
 ['SE12-DIVIDED',SLOPE,'const slopePer1k = den ? +((num / den) / 1000).toFixed(3) : 0;','SE12-POSITIVE'],
 ['SE12-LATE-ROUND',SLOPE,'const slopePer1k = den ? (+((num / den) * 1000).toFixed(3)) / 1000 : 0;','SE12-ROUND-ORDER-POSITIVE-LIVE'],
 ['SE12-ZERO-VARIANCE',RESOLVED,'const resolved = Math.abs(slopePer1k) <= boundPer1k * 5;','SE12-ZERO-VARIANCE-LIVE'],
 ['SE12-BOUND',RESOLVED,'const resolved = den > 0;','SE12-BOUND-OUTSIDE-POSITIVE-LIVE'],
 ['SE12-REVERSE',SLOPE,'const slopePer1k = den ? +(-num / den).toFixed(3) : 0;','SE12-POSITIVE']
 ].map(([id,preimage,postimage,caseId])=>{if(energy.split(preimage).length!==2)throw Error('SE12-MUTANT-ONE-ANCHOR');return{id,file:'energy.cjs',declaration:'stepEfficacy',preimageHash:ENERGY_SHA,preimage,postimage,postimageHash:T.sha(energy.replace(preimage,postimage)),expectedFailures:[caseId+'/result'],caseId,scope};});
}
function coordinates(root){const base=require('../manifest.json'),candidate=path.join(root,'rebuild/engine'),inventory=Object.fromEntries(Object.keys(base.baseline.engine).map(f=>[f,T.sha(fs.readFileSync(path.join(candidate,f)))])),helperPins={...base.baseline.publicPins};for(const f of ['helpers/step-efficacy-frozen.cjs','helpers/import-guards-frozen.cjs','helpers/import-guards-hosts.cjs','laws/import-guards.cjs']){const rel='rebuild/conform/v4/postfix/'+f;helperPins[rel]=T.sha(fs.readFileSync(path.join(root,rel)));}const caseFile=path.join(root,'rebuild/conform/v4/postfix/laws/step-efficacy.cjs');return{base,candidate,inventory,caseInput:{kind:'direct',candidate,inventory,caseFile,caseSha256:T.sha(fs.readFileSync(caseFile)),helperRoot:root,helperPins,hostsHelper:'rebuild/conform/v4/postfix/helpers/step-efficacy-frozen.cjs',traceProfile:2}};}
function runMutants({root}){const {base,candidate,inventory,caseInput}=coordinates(root),M=require('../laws/step-efficacy.cjs'),mutants=definitions(fs.readFileSync(path.join(candidate,'energy.cjs'),'utf8'));let effective=0;for(const mutant of mutants){const expected=M.ASSERTION_INVENTORY.filter(a=>a.caseId===mutant.caseId).map(a=>({id:a.id,count:1}));for(const cell of base.matrix){L.faultRun({candidate,inventory,scratch:path.join(root,'.tmp/postfix/step-faults'),mutant,caseInput:{...caseInput,lawId:M.D12.id,caseId:mutant.caseId,...cell},expected});effective++;}console.log(mutant.id+' 4/4 EFFECTIVE: '+mutant.expectedFailures[0]);}if(T.sha(fs.readFileSync(path.join(candidate,'energy.cjs')))!==ENERGY_SHA)throw Error('SE12-PRODUCT-CHANGED');fs.writeFileSync(path.join(root,'.tmp/postfix/step-efficacy-mutants.json'),JSON.stringify(mutants,null,2)+'\n');console.log('SE12 REAL SOURCE FAULTS '+effective+'/24 EFFECTIVE; product byte-identical '+ENERGY_SHA);return mutants;}
module.exports={ENERGY_SHA,definitions,coordinates,runMutants};
if(require.main===module)try{runMutants({root:process.cwd()});}catch(e){console.error(e.stack);process.exitCode=1;}
