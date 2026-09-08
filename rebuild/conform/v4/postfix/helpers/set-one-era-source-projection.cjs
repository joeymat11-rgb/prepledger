'use strict';
// Source expectations only: the exact frozen whole bundle plus the accepted D30
// declaration inserts. No extracted candidate module may supply either answer.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const H=require('./step-efficacy-frozen.cjs'),F=require('./import-guards-frozen.cjs'),L=require('../legacy-gates.cjs');
const SOURCE_SHA256='d1ac52b547beb023df2dc31b1b081487e3ed2e19699377252eb115e0d5faee5c';
const DECLARATION_SHA256='3526020bc7895737b4433a20b2ffe747ce2b786534008a00463abf3a162f4c66';
const COMMIT='fe516c1',RANGE=Object.freeze([8883,8911]);
const FORKS='  const forks = forksOf(s, exId);\n  const at = forks.length ? isoOf(todayStart()) : null;\n';
const GUARD='    if (!sameEra(forks, d, at)) continue;\n';
const receipts=new WeakSet(),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function fail(code){const e=Error(code);e.code=code;throw e;}
function noCandidate(){if(Object.keys(require.cache).some(p=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(p)))fail('SO30-CANDIDATE-LOADED');}
function projectSource(source){
  if(typeof source!=='string'||sha(source)!==SOURCE_SHA256)fail('SO30-FROZEN-SOURCE-PIN');
  const lines=source.split('\n'),declaration=lines.slice(RANGE[0]-1,RANGE[1]).join('\n');
  if(sha(declaration)!==DECLARATION_SHA256||!declaration.startsWith('function setOneRead(')||!declaration.endsWith('}'))fail('SO30-DECLARATION-PIN');
  const pts=/^  const pts\s*=\s*\[\];/m,sl=/^    const sl\s*=\s*s\.sessionLog\[d\];/m;
  if(!pts.test(declaration)||!sl.test(declaration))fail('SO30-INSERT-ANCHORS');
  const projected=declaration.replace(pts,x=>FORKS+x).replace(sl,x=>GUARD+x);
  if(projected.split(FORKS).length!==2||projected.split(GUARD).length!==2||projected.replace(FORKS,'').replace(GUARD,'')!==declaration)fail('SO30-EXACT-INSERTS');
  lines.splice(RANGE[0]-1,RANGE[1]-RANGE[0]+1,projected);
  const out=lines.join('\n');
  if(out.replace(FORKS,'').replace(GUARD,'')!==source)fail('SO30-OUTSIDE-DECLARATION');
  return out;
}
function createFrozenSource(options){
  if(!options||Object.keys(options).join('|')!=='root'||typeof options.root!=='string')fail('SO30-EXPECTED-FROZEN-ONLY');
  noCandidate();
  const root=fs.realpathSync(options.root),repo=fs.realpathSync(L.git(root,['rev-parse','--show-toplevel']).toString().trim());
  if(root!==repo)fail('SO30-EXPECTED-REPO');
  const base=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/v4/postfix/manifest.json'),'utf8'));
  const source=H.frozenSource(root),projected=projectSource(source);
  if(base.baseline.buildSources[COMMIT+':src/app.jsx']!==SOURCE_SHA256)fail('SO30-MANIFEST-SOURCE-PIN');
  const scratchBase=path.join(root,'.tmp/postfix/set-one-era-source');fs.mkdirSync(scratchBase,{recursive:true});
  const scratch=fs.mkdtempSync(path.join(scratchBase,'run-')),bundles=L.publicReferences({baseline:root,scratch,sourcePins:base.baseline.buildSources});
  const dir=path.join(scratch,'projection');
  for(const file of ['src/app.jsx','src/history.js','tools/_fixed-now.mjs']){
    const bytes=L.object(root,COMMIT,file);
    if(sha(bytes)!==base.baseline.buildSources[COMMIT+':'+file])fail('SO30-AUX-SOURCE-PIN');
    const dest=path.join(dir,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,file==='src/app.jsx'?projected:bytes);
  }
  const entry=path.join(dir,'entry.mjs'),projection=path.join(dir,'engine.cjs');
  fs.writeFileSync(entry,'import "./tools/_fixed-now.mjs"; import {__test} from "./src/app.jsx"; export {__test};\n');
  require(path.join(root,'node_modules/esbuild')).buildSync({entryPoints:[entry],outfile:projection,bundle:true,platform:'node',format:'cjs',jsx:'automatic',loader:{'.jsx':'jsx'},nodePaths:[path.join(root,'node_modules')],logLevel:'silent'});
  noCandidate();
  const out=Object.freeze({root,bundle:bundles.main,projection,bundleSha256:sha(fs.readFileSync(bundles.main)),projectionSha256:sha(fs.readFileSync(projection)),sourceSha256:SOURCE_SHA256,projectedSourceSha256:sha(projected),declarationSha256:DECLARATION_SHA256,projectedDeclarationSha256:sha(projected.split('\n').slice(RANGE[0]-1,RANGE[1]+3).join('\n'))});
  receipts.add(out);return out;
}
function createFrozenEngine({source,project=false,clock,ids,drafts}={}){
  if(!receipts.has(source)||typeof project!=='boolean')fail('SO30-SOURCE-RECEIPT');
  noCandidate();const bundle=project?source.projection:source.bundle;
  if(sha(fs.readFileSync(bundle))!==(project?source.projectionSha256:source.bundleSha256))fail('SO30-BUNDLE-PIN');
  const out=F.createFrozenEngine({root:source.root,bundle,clock,ids,drafts});noCandidate();return out;
}
module.exports={SOURCE_SHA256,DECLARATION_SHA256,COMMIT,RANGE,FORKS,GUARD,projectSource,createFrozenSource,createFrozenEngine};
