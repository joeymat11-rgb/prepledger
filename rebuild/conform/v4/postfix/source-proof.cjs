'use strict';
const fs=require('node:fs'),path=require('node:path');
const vm=require('node:vm');
const {sha,fail}=require('./target.cjs');
const {object}=require('./legacy-gates.cjs');
const REQUIRED=['dataLossGuard','isPristineSeed','migrate','_unionCorrLog','_replayCorrections'];
const FILE='rebuild/engine/migrate.cjs';
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
  const pins=acceptance.baseline.engine,inventory=acceptance.candidateEngine;
  if(JSON.stringify(Object.keys(pins).sort())!==JSON.stringify(Object.keys(inventory).sort()))fail('CANDIDATE-MODULE-INVENTORY');
  const files=fs.readdirSync(path.join(root,'rebuild/engine'),{withFileTypes:true}).filter(x=>x.isFile()&&x.name.endsWith('.cjs')).map(x=>x.name).sort();
  if(JSON.stringify(files)!==JSON.stringify(Object.keys(pins).sort()))fail('CANDIDATE-MODULE-INVENTORY');
  for(const [file,hash]of Object.entries(pins)){
    const relative='rebuild/engine/'+file,old=object(baseline,acceptance.baseline.auditCommit,relative);if(sha(old)!==hash)fail('ORIGINAL-PRODUCT-PIN');
    const expected=file==='migrate.cjs'?Buffer.from(applySourceChanges(old.toString('utf8'),acceptance.sourceChanges)):old;
    if(sha(expected)!==inventory[file])fail('CANDIDATE-POSTIMAGE-PIN');
    if(!fs.readFileSync(path.join(root,relative)).equals(expected))fail('UNAPPROVED-SOURCE-DELTA');
    if(gitHead&&!object(root,'HEAD',relative).equals(expected))fail('UNCOMMITTED-PRODUCT-PIN');
  }
  return {inventory,changes:acceptance.sourceChanges};
}
module.exports={REQUIRED,FILE,declarationRanges,applySourceChanges,proposeSourceChanges,verifyProductSources};
