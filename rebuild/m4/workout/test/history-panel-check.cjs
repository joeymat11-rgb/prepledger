'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const {createRequire} = require('node:module');
const repo = path.resolve(__dirname, '../../../..');
const {JSDOM} = createRequire(path.join(repo, 'package.json'))('jsdom');
const {createHistoryPanel} = require('../history-panel.cjs');
module.exports = async function checkUI({outputDirectory,createProjection, reader, input, fixture, trial, chain, removed, rival, unsupported,consumerCases}) {
  const checks = [], html = [];
  const check = async (name, fn) => { await fn(); checks.push({name, status:'PASS'}); console.log('UI PASS '+name); };
  const dom = new JSDOM('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Earned — synthetic history preview</title></head><body><header><p>EARNED · development preview</p><h1>Workout history</h1><p>Invented examples. Read-only; this is not your data and cannot log a workout.</p></header><main></main></body></html>');
  const doc = dom.window.document, root = doc.querySelector('main');
  const panel = createHistoryPanel({document:doc,root,projection:createProjection(reader(fixture))});
  const raw = input(fixture); const before = structuredClone(raw);
  await check('ACTUAL-SIGNED-HISTORY-TO-DOM', async () => {
    assert.deepEqual(await panel.open(raw), {painted:true,verified:true});
    assert.equal(root.querySelectorAll('article').length, 3);
    assert.deepEqual([...root.querySelectorAll('.history-values')].map(e=>e.textContent), ['45 lb · 8 rep','35 lb · 10 rep','25 lb · 9 rep']);
    assert.deepEqual(raw,before); assert(root.textContent.includes('may not include newer entries'));
    assert(!root.textContent.includes('Synced')); assert(!root.textContent.includes('Saved'));
    html.push({name:'Corrected set',body:root.innerHTML});
  });
  await check('ORIGINAL-CORRECTION-UNKNOWN-AND-CONTEXT-VISIBLE', () => {
    const card=root.querySelectorAll('article')[1];
    assert(card.textContent.includes('Original entry40 lb · 10 rep'));
    assert(card.textContent.includes('Load: 35 lb'));
    assert(card.textContent.includes('Effort: not recorded. Plan basis: not recorded.'));
    assert(root.textContent.includes('Some recorded context is missing or unsupported'));
    assert(!root.querySelector('input,button,form,script,iframe,a,img'));
  });
  for (const [name,ops,label,noActive] of [
    ['causal chain',[chain],'35 lb · 11 rep',false],
    ['removed set',[removed,chain],'Removed entry',true],
    ['concurrent edits',[rival],'Needs review',true],
    ['unsupported change',[unsupported],'Additional change needs review.',true]
  ]) await check('ACTUAL-SIGNED-'+name.toUpperCase().replaceAll(' ','-'),async()=>{
    // trial itself executes actual authority admission, signing and reader.
    const observed=await trial(ops), copy=structuredClone(observed);
    const display=createHistoryPanel({document:doc,root,projection:{read:async()=>observed}});
    await display.open({}); const card=root.querySelectorAll('article')[1];
    assert(card.textContent.includes(label)); assert.equal(card.querySelector('.history-values')===null,noActive);
    assert(card.textContent.includes('Original entry40 lb · 10 rep')); assert.deepEqual(observed,copy);
    html.push({name,body:root.innerHTML}); display.dispose();
  });
  await check('FORGED-INPUT-CLEARS-PREVIOUS-TRUTH',async()=>{
    await panel.open(raw); const bad=structuredClone(raw);bad.pages[0].fill(0);
    const pending=panel.open(bad);
    assert.equal(root.querySelectorAll('article').length,0); assert.equal(root.getAttribute('aria-busy'),'true');
    assert.deepEqual(await pending,{painted:true,verified:false});
    assert(root.textContent.includes('could not be verified')); assert.equal(root.querySelectorAll('article').length,0);
    assert(!root.hasAttribute('aria-busy'));
  });
  const observed=await trial([]);
  await check('TEXT-INJECTION-IS-INERT-DOM',async()=>{
    // UI-only adversarial input; not falsely represented as a signed fixture.
    const x=structuredClone(observed);x.projection.sets[0].lift='<img src=x onerror="window.bad=1">';
    const display=createHistoryPanel({document:doc,root,projection:{read:async()=>x}});
    await display.open({});assert.equal(root.querySelector('img'),null);assert(root.textContent.includes('<img src=x'));
    assert.equal(dom.window.bad,undefined);display.dispose();
  });
  await check('LATE-PRIOR-SNAPSHOT-CANNOT-REPLACE-NEWER-REQUEST',async()=>{
    // Deferred read stub tests only render lifecycle; signature boundary tested above.
    const pending=[];const display=createHistoryPanel({document:doc,root,projection:{read:()=>new Promise(resolve=>pending.push(resolve))}});
    const old=display.open({});const newer=display.open({});
    pending[1]({verified:false,code:'SCOPE_FORBIDDEN'});await newer;
    pending[0](observed);assert.deepEqual(await old,{painted:false,reason:'SUPERSEDED'});
    assert.equal(root.querySelectorAll('article').length,0);assert(root.textContent.includes('could not be verified'));display.dispose();
  });
  await check('CLEAR-AND-DISPOSE-FENCE-INFLIGHT-READS',async()=>{
    let resolve;const display=createHistoryPanel({document:doc,root,projection:{read:()=>new Promise(r=>resolve=r)}});
    let pending=display.open({});display.clear();resolve(observed);assert.equal((await pending).painted,false);assert.equal(root.textContent,'');
    pending=display.open({});display.dispose();resolve(observed);assert.equal((await pending).painted,false);assert.equal(root.textContent,'');
    assert.equal((await display.open({})).reason,'DISPOSED');
  });
  await check('READER-ERROR-DOES-NOT-LEAK-OR-RETAIN-DATA',async()=>{
    await panel.open(raw);const display=createHistoryPanel({document:doc,root,projection:{read:async()=>{throw Error('synthetic-secret-error');}}});
    assert.equal((await display.open({})).verified,false);assert(!root.textContent.includes('synthetic-secret-error'));
    assert.equal(root.querySelectorAll('article').length,0);display.dispose();
  });
  await check('NO-INTERPRETABLE-PROJECTION-IS-NOT-FIRST-USE',async()=>{
    const display=createHistoryPanel({document:doc,root,projection:{read:async()=>({verified:true,projection:null,decisionReady:false})}});
    await display.open({});assert(root.textContent.includes('could not be interpreted'));assert(!root.textContent.includes('No set entries'));display.dispose();
  });
  for(const [name,op,warning]of [
    ['class-mixed entry',consumerCases.mixed,'unsupported record format'],
    ['unconfirmed workout reference',consumerCases.badref,'workout linked to this entry could not be confirmed'],
    ['additional recorded field',consumerCases.extra,'details that are not interpreted']
  ])await check('PER-ENTRY-CONTEXT-'+name.toUpperCase().replaceAll(' ','-'),async()=>{
    const observed=await trial([op]);const display=createHistoryPanel({document:doc,root,projection:{read:async()=>observed}});
    await display.open({});assert.equal(root.querySelectorAll('article').length,4);
    const card=root.querySelectorAll('article')[3];assert(card.textContent.includes(warning));
    assert.equal(card.querySelector('.history-values')===null,name==='class-mixed entry');
    html.push({name,body:root.innerHTML});display.dispose();
  });
  const style=doc.createElement('style');style.textContent=fs.readFileSync(path.join(__dirname,'../history.css'),'utf8');doc.head.append(style);
  root.replaceChildren();
  for(const scenario of html){const section=doc.createElement('section'),heading=doc.createElement('h2');heading.textContent='Example: '+scenario.name;section.append(heading);
    // Serialized DOM built above with textContent only, no untrusted interpolation.
    const template=doc.createElement('template');template.innerHTML=scenario.body;section.append(template.content);root.append(section);}
  assert.equal(doc.querySelectorAll('script,img,iframe,form,input,link,[src]').length,0);
  fs.writeFileSync(path.join(outputDirectory,'preview.html'),dom.serialize());
  fs.writeFileSync(path.join(outputDirectory,'ui-result.json'),JSON.stringify({scope:'Actual signed memory-history to DOM; deferred lifecycle and hostile-display stubs explicitly separate; no storage/HTTP/phone or prescription proof',checks},null,2)+'\n');
  console.log(`WORKOUT HISTORY UI: ${checks.length}/${checks.length} PASS`);
};
