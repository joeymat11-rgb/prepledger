import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {compareConfiguredGraphs as compare} from './configured-load-graph.mjs';
const root=mkdtempSync(join(tmpdir(),'earned-graph-depth-')),sourceRoot=join(root,'source'),candidateRoot=join(root,'different','depth','candidate');
const sha=x=>createHash('sha256').update(x).digest('hex');
const file=(base,name,bytes)=>{const dest=join(base,name);mkdirSync(join(dest,'..'),{recursive:true});writeFileSync(dest,bytes);return {path:name,sha256:sha(bytes)};};
const vendor=file(root,'node_modules/example/module.js','unchanged dependency');
const retained=[file(sourceRoot,'rebuild/ui.mjs','unchanged UI'),file(sourceRoot,'rebuild/m4/workout/schema.cjs','old schema'),{path:relative(sourceRoot,join(root,vendor.path)),sha256:vendor.sha256}];
const candidate=[file(candidateRoot,'rebuild/ui.mjs','unchanged UI'),file(candidateRoot,'rebuild/m4/workout/schema.cjs','new schema'),{path:relative(candidateRoot,join(root,vendor.path)),sha256:vendor.sha256}];
const args={sourceRoot,candidateRoot,composed:{'schema.cjs':sha('new schema')}};
test('different-depth roots compare the same physical dependencies and named product inputs',()=>{assert.deepEqual(compare(retained,candidate,args),{retained:3,candidate:3});});
test('missing, extra and duplicate named inputs fail rather than matching content multisets',()=>{
 assert.throws(()=>compare(retained,candidate.slice(1),args),/missing bundle input/);
 const extra=file(candidateRoot,'rebuild/unexpected.mjs','unchanged UI');assert.throws(()=>compare(retained,[...candidate,extra],args),/unexpected bundle input/);
 assert.throws(()=>compare(retained,[...candidate,{...candidate[0],path:'rebuild/../rebuild/ui.mjs'}],args),/duplicate input identity/);
});
test('changed dependency and changed supposedly unchanged product hashes fail',()=>{
 for(const index of [0,2]){const changed=structuredClone(candidate);changed[index].sha256=sha('substitution');assert.throws(()=>compare(retained,changed,args),/changed unchanged input/);}
});
test('composed inputs require their exact declared candidate hash; only declared additions pass',()=>{
 const changed=structuredClone(candidate);changed[1].sha256=sha('wrong schema');assert.throws(()=>compare(retained,changed,args),/changed composed input/);
 const added=file(candidateRoot,'rebuild/m4/workout/entered-load.cjs','new helper');
 assert.throws(()=>compare(retained,[...candidate,added],args),/unexpected bundle input/);
 assert.equal(compare(retained,[...candidate,added],{...args,composed:{...args.composed,'entered-load.cjs':added.sha256}}).candidate,4);
});
