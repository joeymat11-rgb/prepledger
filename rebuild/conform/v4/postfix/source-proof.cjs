'use strict';
const fs=require('node:fs'),path=require('node:path');
const vm=require('node:vm');
const {sha,fail}=require('./target.cjs');
const {object}=require('./legacy-gates.cjs');
const REQUIRED=['dataLossGuard','isPristineSeed','migrate','_unionCorrLog','_replayCorrections'];
const FILE='rebuild/engine/migrate.cjs';
const STEP_FILE='rebuild/engine/energy.cjs';
const ERA_FILE='rebuild/engine/volume.cjs';
const ERA_GUARD='  if (!ex9 || typeof ex9.w !== "number") return { status: "IDLE", exId };\n';
const ERA_QUERY='  const forks = forksOf(s, exId);\n  const at = forks.length ? isoOf(todayStart()) : null;\n';
const ERA_LOOP='  for (const d of Object.keys(s.sessionLog || {}).sort()) {\n';
const ERA_SKIP='    if (!sameEra(forks, d, at)) continue;\n';
const ERA_BINDING='const todayStart = (...args) => E.todayStart(...args);\n';
const STEP_BEFORE='const slopePer1k = den ? +((num / den) * 1000).toFixed(3) : 0;';
const STEP_AFTER='const slopePer1k = den ? +(num / den).toFixed(3) : 0;';
function declarationRanges(source){
  const marks=[...source.matchAll(/\/\/ Copied from frozen src\/app\.jsx @ fe516c1:\d+-\d+\.\n/g)],out={};
  for(let i=0;i<marks.length;i++){const start=marks[i].index+marks[i][0].length,end=i+1<marks.length?marks[i+1].index:source.lastIndexOf('\nreturn {')+1;
    const bytes=source.slice(start,end),name=/^(?:function|const|let)\s+([\w$]+)/.exec(bytes)?.[1];if(!name||Object.hasOwn(out,name)||end<start)fail('SOURCE-DECLARATION-INVENTORY');out[name]={start,end,bytes};}
  if(!marks.length)fail('SOURCE-DECLARATION-INVENTORY');return out;
}
function applySourceChanges(before,changes){
  if(!Array.isArray(changes)||changes.length!==5||new Set(changes.map(d=>d.declaration)).size!==5||new Set(changes.map(d=>d.id)).size!==5||REQUIRED.some(n=>!changes.some(d=>d.declaration===n)))fail('SOURCE-CHANGE-INVENTORY');
  const ranges=declarationRanges(before),firstDeclaration=Math.min(...Object.values(ranges).map(r=>r.start));
  const marker='const localStorage = drafts;\n',bindingStart=before.indexOf(marker)+marker.length;
  if(bindingStart<marker.length||before.split(marker).length!==2)fail('SOURCE-BINDING-SCOPE');
  const ordered=changes.map((d,index)=>({...d,index})).sort((a,b)=>a.start-b.start||a.index-b.index);let cursor=0,out='';
  for(const d of ordered){
    const keys=['id','file','declaration','start','end','before','after','beforeSha256','afterSha256'];
    if(Object.keys(d).filter(k=>k!=='index').sort().join('|')!==keys.sort().join('|')||d.file!==FILE||typeof d.id!=='string'||!d.id||!Number.isSafeInteger(d.start)||!Number.isSafeInteger(d.end)||d.start<cursor||d.end<d.start||d.end>before.length||typeof d.before!=='string'||typeof d.after!=='string'||d.before===d.after||sha(d.before)!==d.beforeSha256||sha(d.after)!==d.afterSha256||before.slice(d.start,d.end)!==d.before)fail('SOURCE-CHANGE-PREDICATE');
    if(['dataLossGuard','isPristineSeed','migrate'].includes(d.declaration)){
      const r=ranges[d.declaration];if(!r||r.start!==d.start||r.end!==d.end||!new RegExp('^function '+d.declaration+'\\s*\\(').test(d.after))fail('SOURCE-DECLARATION-SCOPE');
      try{new vm.Script('('+d.after.trim()+'\n)');}catch{fail('SOURCE-DECLARATION-SCOPE');}
    }else{
      if(d.start!==d.end||d.start!==bindingStart||d.start>=firstDeclaration||d.before!==''||d.after!==`const ${d.declaration} = (...a) => E.${d.declaration}(...a);\n`)fail('SOURCE-BINDING-SCOPE');
    }
    out+=before.slice(cursor,d.start)+d.after;cursor=d.end;
  }
  return out+before.slice(cursor);
}
// Preparation only: these observed source postimages still require the exact
// acceptance-artifact review. This cannot create an authorization receipt.
function proposeSourceChanges(before,after){
  const old=declarationRanges(before),current=declarationRanges(after),changes=[];
  for(const declaration of ['dataLossGuard','isPristineSeed','migrate']){const r=old[declaration],n=current[declaration];if(!r||!n)fail('SOURCE-DECLARATION-INVENTORY');changes.push({id:'source-'+declaration,file:FILE,declaration,start:r.start,end:r.end,before:r.bytes,after:n.bytes,beforeSha256:sha(r.bytes),afterSha256:sha(n.bytes)});}
  const marker='const localStorage = drafts;\n',start=before.indexOf(marker)+marker.length;
  if(start<marker.length||before.split(marker).length!==2)fail('SOURCE-BINDING-SCOPE');
  for(const declaration of ['_unionCorrLog','_replayCorrections']){const bytes=`const ${declaration} = (...a) => E.${declaration}(...a);\n`;changes.push({id:'binding-'+declaration,file:FILE,declaration,start,end:start,before:'',after:bytes,beforeSha256:sha(''),afterSha256:sha(bytes)});}
  if(applySourceChanges(before,changes)!==after)fail('UNAPPROVED-SOURCE-DELTA');return changes;
}
function verifyProductSources({root,baseline,acceptance,gitHead=true}){
  const era=acceptance.packageId==='M2-SET-ONE-ERA',step=era||acceptance.packageId==='M2-STEP-EFFICACY';
  if(!step&&acceptance.packageId!=='M2-IMPORT-GUARDS')fail('PACKAGE-INVENTORY');
  const parent=step?require('./acceptance.cjs').verifyAcceptedParent(root,acceptance,{gitHead}):null;
  const pins=acceptance.baseline.engine,inventory=acceptance.candidateEngine;
  if(JSON.stringify(Object.keys(pins).sort())!==JSON.stringify(Object.keys(inventory).sort()))fail('CANDIDATE-MODULE-INVENTORY');
  const files=fs.readdirSync(path.join(root,'rebuild/engine'),{withFileTypes:true}).filter(x=>x.isFile()&&x.name.endsWith('.cjs')).map(x=>x.name).sort();
  if(JSON.stringify(files)!==JSON.stringify(Object.keys(pins).sort()))fail('CANDIDATE-MODULE-INVENTORY');
  for(const [file,hash]of Object.entries(pins)){
    const relative='rebuild/engine/'+file,old=object(baseline,acceptance.baseline.auditCommit,relative);if(sha(old)!==hash)fail('ORIGINAL-PRODUCT-PIN');
    const expected=file==='migrate.cjs'?Buffer.from(applySourceChanges(old.toString('utf8'),step?acceptance.sourceChanges.slice(0,5):acceptance.sourceChanges)):
      step&&file==='energy.cjs'?Buffer.from(applyStepEfficacyChange(old.toString('utf8'),acceptance.sourceChanges[5])):
      era&&file==='volume.cjs'?Buffer.from(applySetOneEraChanges(old.toString('utf8'),acceptance.sourceChanges.slice(6))):old;
    if(step){const accepted=object(root,acceptance.acceptedParent.candidateCommit,relative);if(sha(accepted)!==parent.candidateEngine[file])fail('ACCEPTED-PARENT-PRODUCT-PIN');const newlyChanged=era?file==='volume.cjs':file==='energy.cjs';if(!accepted.equals(newlyChanged?old:expected))fail('UNAPPROVED-PARENT-SOURCE-DELTA');}
    if(sha(expected)!==inventory[file])fail('CANDIDATE-POSTIMAGE-PIN');
    if(!fs.readFileSync(path.join(root,relative)).equals(expected))fail('UNAPPROVED-SOURCE-DELTA');
    if(gitHead&&!object(root,'HEAD',relative).equals(expected))fail('UNCOMMITTED-PRODUCT-PIN');
  }
  return {inventory,changes:acceptance.sourceChanges};
}
function validateStepChange(d){
  const keys=['id','file','declaration','start','end','before','after','beforeSha256','afterSha256'];
  if(!d||Object.keys(d).sort().join('|')!==keys.sort().join('|')||d.id!=='source-stepEfficacy'||d.file!==STEP_FILE||d.declaration!=='stepEfficacy'||!Number.isSafeInteger(d.start)||!Number.isSafeInteger(d.end)||d.start<0||d.end<=d.start||typeof d.before!=='string'||typeof d.after!=='string'||sha(d.before)!==d.beforeSha256||sha(d.after)!==d.afterSha256||d.before.split(STEP_BEFORE).length!==2||d.after!==d.before.replace(STEP_BEFORE,STEP_AFTER))fail('STEP-EXPRESSION-SCOPE');
  return d;
}
function applyStepEfficacyChange(before,d){
  validateStepChange(d);const r=declarationRanges(before).stepEfficacy;
  if(!r||r.start!==d.start||r.end!==d.end||r.bytes!==d.before)fail('STEP-DECLARATION-SCOPE');
  return before.slice(0,d.start)+d.after+before.slice(d.end);
}
// Source-only proposal: the ONLY allowed postimage follows the accepted literal
// expression. No observed candidate output supplies an expectation or authority.
function proposeStepEfficacyChange(before,after){
  const r=declarationRanges(before).stepEfficacy;if(!r)fail('STEP-DECLARATION-SCOPE');
  const changed=r.bytes.replace(STEP_BEFORE,STEP_AFTER),d={id:'source-stepEfficacy',file:STEP_FILE,declaration:'stepEfficacy',start:r.start,end:r.end,before:r.bytes,after:changed,beforeSha256:sha(r.bytes),afterSha256:sha(changed)};
  const expected=applyStepEfficacyChange(before,d);if(after!==undefined&&after!==expected)fail('UNAPPROVED-SOURCE-DELTA');return d;
}
function eraDeclaration(before){
  if(typeof before!=='string'||before.split(ERA_GUARD).length!==2||before.split(ERA_LOOP).length!==2)fail('ERA-DECLARATION-SCOPE');
  return before.replace(ERA_GUARD,ERA_GUARD+ERA_QUERY).replace(ERA_LOOP,ERA_LOOP+ERA_SKIP);
}
function validateSetOneEraChanges(changes){
  if(!Array.isArray(changes)||changes.length!==3)fail('ERA-SOURCE-INVENTORY');
  const names=['setOneRead','forksOf','sameEra'],keys=['id','file','declaration','start','end','before','after','beforeSha256','afterSha256'];
  changes.forEach((d,i)=>{
    if(!d||Object.keys(d).sort().join('|')!==keys.slice().sort().join('|')||d.file!==ERA_FILE||d.declaration!==names[i]||d.id!==(i?'binding-':'source-')+names[i]||!Number.isSafeInteger(d.start)||!Number.isSafeInteger(d.end)||d.start<0||d.end<d.start||typeof d.before!=='string'||typeof d.after!=='string'||sha(d.before)!==d.beforeSha256||sha(d.after)!==d.afterSha256)fail('ERA-SOURCE-SCHEMA');
    if(i===0){if(d.start===d.end||!d.before.startsWith('function setOneRead(')||d.after!==eraDeclaration(d.before))fail('ERA-DECLARATION-SCOPE');}
    else if(d.start!==d.end||d.before!==''||d.after!==`const ${names[i]} = (...args) => E.${names[i]}(...args);\n`)fail('ERA-BINDING-SCOPE');
  });return changes;
}
// A closed source-only construction, not an observed-candidate answer key.
function proposeSetOneEraChanges(before,after){
  const r=declarationRanges(before).setOneRead;
  if(!r||before.split(ERA_BINDING).length!==2)fail('ERA-DECLARATION-SCOPE');
  const start=before.indexOf(ERA_BINDING)+ERA_BINDING.length;
  if(start>=r.start)fail('ERA-BINDING-SCOPE');
  const change=(id,declaration,start,end,before,after)=>({id,file:ERA_FILE,declaration,start,end,before,after,beforeSha256:sha(before),afterSha256:sha(after)});
  const result=[change('source-setOneRead','setOneRead',r.start,r.end,r.bytes,eraDeclaration(r.bytes)),...['forksOf','sameEra'].map(n=>change('binding-'+n,n,start,start,'',`const ${n} = (...args) => E.${n}(...args);\n`))];
  validateSetOneEraChanges(result);
  if(after!==undefined&&applySetOneEraChanges(before,result)!==after)fail('UNAPPROVED-SOURCE-DELTA');return result;
}
function applySetOneEraChanges(before,changes){
  validateSetOneEraChanges(changes);
  if(JSON.stringify(changes)!==JSON.stringify(proposeSetOneEraChanges(before)))fail('ERA-SOURCE-PREIMAGE-SCOPE');
  let cursor=0,out='';for(const d of changes.map((x,i)=>({...x,i})).sort((a,b)=>a.start-b.start||a.i-b.i)){if(d.start<cursor)fail('ERA-SOURCE-OVERLAP');out+=before.slice(cursor,d.start)+d.after;cursor=d.end;}return out+before.slice(cursor);
}
module.exports={REQUIRED,FILE,STEP_FILE,STEP_BEFORE,STEP_AFTER,ERA_FILE,ERA_GUARD,ERA_QUERY,ERA_LOOP,ERA_SKIP,ERA_BINDING,declarationRanges,applySourceChanges,proposeSourceChanges,validateStepChange,applyStepEfficacyChange,proposeStepEfficacyChange,validateSetOneEraChanges,applySetOneEraChanges,proposeSetOneEraChanges,verifyProductSources};
