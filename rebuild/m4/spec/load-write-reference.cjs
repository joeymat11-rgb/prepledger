'use strict';
// Rebuild portable references from pinned public Git inputs through the existing
// builder. A bundle hash alone is not portable across esbuild paths/platforms.
// No caller-provided bundle/hash or candidate output can supply the reference.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const L=require('../../conform/v4/postfix/legacy-gates.cjs'),S=require('./load-write-source.cjs');
function create(root){
 root=fs.realpathSync(root);assert(!Object.keys(require.cache).some(f=>/[/\\]rebuild[/\\]engine[/\\](?!test[/\\])/.test(f)),'Reference before candidate factory');
 const file='rebuild/conform/v4/postfix/manifest.json',bytes=fs.readFileSync(path.join(root,file));assert(bytes.equals(L.object(root,S.BASE,file)),'Pinned reference-build input inventory');
 const manifest=JSON.parse(bytes),base=path.join(root,'.tmp');fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(path.join(base,'load-write-reference-'));
 function dispose(){assert(path.resolve(dir).startsWith(base+path.sep),'Reference scratch boundary');fs.rmSync(dir,{recursive:true,force:true});}
 try{const bundles=L.publicReferences({baseline:root,scratch:dir,sourcePins:manifest.baseline.buildSources});process.once('exit',dispose);return Object.freeze(bundles);}
 catch(e){dispose();throw e;}
}
module.exports={create};
