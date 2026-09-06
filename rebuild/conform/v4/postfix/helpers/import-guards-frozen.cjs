'use strict';
// Diagnostic-only loader: candidate cases never receive this factory.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const SOURCE_BLOB = 'f98671d823f0d8cd83e730cdd930afe5f5e7b628';
function createFrozenEngine({clock,ids,drafts,bundle,root}={}) {
  if (!root || !bundle || !clock) throw Error('FROZEN-EXPLICIT-INPUTS');
  const source=execFileSync('git',['show','fe516c1:src/app.jsx'],{cwd:root,windowsHide:true,maxBuffer:8*1024*1024});
  if(crypto.createHash('sha1').update('blob '+source.length+'\0').update(source).digest('hex')!==SOURCE_BLOB)throw Error('FROZEN-SOURCE-PIN');
  if(!fs.existsSync(bundle))throw Error('FROZEN-BUNDLE-MISSING');
  const {createWriterReference}=require(path.join(root,'rebuild/engine/test/writers-reference.cjs'));
  const {createMigrationReference}=require(path.join(root,'rebuild/engine/test/migrate-reference.cjs'));
  const NativeDate=globalThis.Date;
  const G=createWriterReference({clock,drafts,enginePath:bundle,Date:NativeDate});
  // Actual bundle exports (including migrate, predicate, guard and their SEED)
  // always win. Exact pinned declarations supply ONLY absent exports.
  for(const name of ['migrate','isPristineSeed','dataLossGuard','SEED'])if(!(name in G))throw Error('FROZEN-BUNDLE-EXPORT:'+name);
  const supplement=createMigrationReference(G,{clock,ids,drafts,Date:NativeDate});
  const table={...supplement,...G};
  // Exact frozen line310 is absent from the bundle export, but used by UI hosts.
  table.fmtShort=new Function('mk',source.toString('utf8').split('\n')[309]+'\nreturn fmtShort;')(table.mk);
  return table;
}
module.exports={SOURCE_BLOB,createFrozenEngine};
