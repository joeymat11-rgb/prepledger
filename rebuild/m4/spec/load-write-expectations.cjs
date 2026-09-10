'use strict';
// Expectation authoring only. Start with independently pinned frozen Git source,
// retain the accepted D12 expression, and apply only the three reviewed load
// literals. Never load a candidate factory or derive an expected value from it.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const L=require('../../conform/v4/postfix/legacy-gates.cjs');
const STEP=require('../../conform/v4/postfix/helpers/step-efficacy-frozen.cjs');
const receipts=new WeakSet(),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const CHANGES=Object.freeze([
 ['D41-debut','if (q.newW != null) { ex.w = q.newW; ex.wAt = new Date().toISOString(); }','if (q.newW != null) { ex.w = q.newW; ex.wAt = new Date().toISOString(); } if (Array.isArray(q.newWSets)) ex.wSets = q.newWSets.slice();'],
 ['D41-reset','const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = new Date().toISOString(); ex3.last = null;','const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = new Date().toISOString(); if (Array.isArray(ex3.wSets) && typeof oldW === "number") ex3.wSets = ex3.wSets.map(w => w + ex3.w - oldW); ex3.last = null;'],
 ['D43-entry','w: ex2 && typeof ex2.w === "number" ? ex2.w : null,','w: typeof e.w === "number" ? e.w : ex2 && typeof ex2.w === "number" ? ex2.w : null,']
].map(row=>Object.freeze(row)));
function need(ok,code){if(!ok)throw Object.assign(Error(code),{code});}
function noCandidate(){need(!Object.keys(require.cache).some(file=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(file)),'LOAD-EXPECTED-CANDIDATE-LOADED');}
function replace(source,a,b,id){need(source.split(a).length===2,'LOAD-EXPECTED-UNIQUE-'+id);return source.replace(a,b);}
function createSource({root}){
 root=fs.realpathSync(root);need(root===fs.realpathSync(L.git(root,['rev-parse','--show-toplevel']).toString().trim()),'LOAD-EXPECTED-ROOT');noCandidate();
 const base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json')));
 need(base.baseline.frozenCommit==='fe516c1'&&base.baseline.frozenBlob==='f98671d823f0d8cd83e730cdd930afe5f5e7b628','LOAD-EXPECTED-FROZEN-PIN');
 const original=STEP.frozenSource(root);let projected=replace(original,STEP.BEFORE,STEP.AFTER,'accepted-D12');
 for(const [id,a,b]of CHANGES)projected=replace(projected,a,b,id);
 fs.mkdirSync(path.join(root,'.tmp'),{recursive:true});
 const dir=fs.mkdtempSync(path.join(root,'.tmp/load-write-source-'));fs.mkdirSync(path.join(dir,'src'));fs.mkdirSync(path.join(dir,'tools'));
 for(const file of ['src/history.js','tools/_fixed-now.mjs']){const bytes=L.object(root,'fe516c1',file);need(sha(bytes)===base.baseline.buildSources['fe516c1:'+file],'LOAD-EXPECTED-AUX-PIN');fs.writeFileSync(path.join(dir,file),bytes);}
 fs.writeFileSync(path.join(dir,'src/app.jsx'),projected);
 fs.writeFileSync(path.join(dir,'entry.mjs'),'import "./tools/_fixed-now.mjs";export {__test} from "./src/app.jsx";\n');
 const bundle=path.join(dir,'engine.cjs');require(path.join(root,'node_modules/esbuild')).buildSync({entryPoints:[path.join(dir,'entry.mjs')],outfile:bundle,bundle:true,platform:'node',format:'cjs',jsx:'automatic',nodePaths:[path.join(root,'node_modules')],logLevel:'silent'});
 noCandidate();const receipt=Object.freeze({root,bundle,bundleSha256:sha(fs.readFileSync(bundle)),sourceSha256:sha(projected),sourceEdits:4});receipts.add(receipt);return receipt;
}
function verifySource(source){need(receipts.has(source),'LOAD-EXPECTED-RECEIPT');need(sha(fs.readFileSync(source.bundle))===source.bundleSha256,'LOAD-EXPECTED-BUNDLE-PIN');noCandidate();return source;}
module.exports={CHANGES,createSource,verifySource};
