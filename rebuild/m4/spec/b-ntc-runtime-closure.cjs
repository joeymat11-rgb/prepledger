'use strict';
// Public build-time source inventory: esbuild resolves actual relative imports,
// plus the runtime's exact source-declared factory imports.
// No generated bundle executes; dependency package code is external and its
// package/lock inputs are separately pinned. Final policy still needs review.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const {sha}=require('../../conform/v4/postfix/target.cjs');
const ROOTS=Object.freeze(['rebuild/m3/w7-preview/today/today-entry.mjs',
  'rebuild/m3/w6/local/today-bindings.mjs','rebuild/m3/w6/local/local-client.mjs',
  'rebuild/m4/workout/engine-runtime.cjs']);
const TEST_ROOTS=Object.freeze(['rebuild/m3/w6/test/local-initial-setup.test.mjs',
  'rebuild/m4/workout/test/native-baseline.test.cjs','rebuild/m4/workout/test/native-baseline-journey.test.mjs',
  'rebuild/m3/w6/test/local-owner-entry.test.mjs','rebuild/m3/w6/test/local-today-journey.test.mjs',
  'rebuild/m3/w6/test/local-owner-browser.mjs']);
const DEPENDENCIES=Object.freeze(['package.json','package-lock.json','rebuild/m3/w6/package.json',
  'rebuild/m3/w6/pnpm-lock.yaml','rebuild/m3/w5/package.json','rebuild/m3/w5/pnpm-lock.yaml']);
const FILE='rebuild/m4/spec/b-ntc-runtime-closure.json';
function inventory(){
  const esbuild=require('../../m3/w6/node_modules/esbuild');
  const runtime='rebuild/m4/workout/engine-runtime.cjs',source=fs.readFileSync(path.join(root,runtime),'utf8');
  const declaration=/^const MODULES=Object.freeze\((\[[^\n]+\])\);$/m.exec(source);
  assert(declaration,'One exact source-declared runtime factory inventory');
  const names=JSON.parse(declaration[1].replaceAll("'",'"'));
  assert(names.length&&new Set(names).size===names.length&&names.every(n=>/^[a-z-]+$/.test(n)),'Runtime factory import names');
  assert(source.includes("const factories=MODULES.map(name=>require('../../engine/'+name+'.cjs'));")&&[...source.matchAll(/\brequire\s*\(/g)].length===1&&!/\bimport\s*\(/.test(source),'Exact sole dynamic runtime factory importer');
  const runtimeFactoryImports=names.map(n=>'rebuild/engine/'+n+'.cjs');
  const built=esbuild.buildSync({absWorkingDir:root,entryPoints:[...ROOTS.filter(f=>f!==runtime),...runtimeFactoryImports],bundle:true,
    platform:'node',packages:'external',write:false,outdir:'.tmp/owner-closure-output',metafile:true,logLevel:'silent'});
  assert.equal(built.warnings.length,0,'Source closure has no unresolved build warnings');
  const testBuilt=esbuild.buildSync({absWorkingDir:root,entryPoints:TEST_ROOTS.slice(),external:['/app.js','/enroll.js'],bundle:true,format:'esm',platform:'node',packages:'external',write:false,outdir:'.tmp/owner-test-closure-output',metafile:true,logLevel:'silent'});
  // The unchanged journey deliberately asserts three authority exports absent.
  // Bind those exact warnings; do not suppress unresolved imports generally.
  assert.deepEqual(testBuilt.warnings.map(w=>({id:w.id,file:w.location?.file,text:w.text})),
    ['IDENTITY_KEY','ENROLMENT_EVIDENCE','AUTHORITY_KID'].map(name=>({id:'import-is-undefined',
      file:'rebuild/m3/w6/test/local-today-journey.test.mjs',
      text:'Import "'+name+'" will always be undefined because there is no matching export in "rebuild/m3/w7-preview/today/gym-host.mjs"'})),
    'Only the three original authority-nonexport assertions warn');
  // These are browser-page URLs inside the separately pinned synthetic probe,
  // not filesystem imports. Its build code and real runtime roots remain closed.
  const browserGeneratedImports=Object.entries(testBuilt.metafile.inputs).flatMap(([file,input])=>input.imports.filter(i=>i.external&&i.path.startsWith('/')).map(i=>({file,path:i.path}))).sort((a,b)=>a.path.localeCompare(b.path));
  assert.deepEqual(browserGeneratedImports,['/app.js','/app.js','/app.js','/enroll.js'].map(path=>({file:'rebuild/m3/w6/test/local-owner-browser.mjs',path})),'Only the exact browser probe generated URLs');
  // Literal require calls made by createRequire in ESM support files are not
  // followed by the bundler. Resolve their real relative paths and close them.
  const extra=new Set(),scan=[...Object.keys(testBuilt.metafile.inputs)];
  for(const file of scan){const body=fs.readFileSync(path.join(root,file),'utf8');
    for(const m of body.matchAll(/\brequire\s*\(\s*['"]([.][^'"]+)['"]\s*\)/g)){
      const resolved=path.relative(root,require('node:module').createRequire(path.join(root,file)).resolve(m[1])).split(path.sep).join('/');
      if(!scan.includes(resolved)){extra.add(resolved);scan.push(resolved);}
    }
  }
  const extraBuilt=extra.size?esbuild.buildSync({absWorkingDir:root,entryPoints:[...extra],bundle:true,format:'esm',platform:'node',packages:'external',write:false,outdir:'.tmp/owner-support-closure-output',metafile:true,logLevel:'silent'}):{warnings:[],metafile:{inputs:{}}};
  assert.equal(extraBuilt.warnings.length,0,'Support closure has no unresolved build warnings');
  const inputs=[...new Set([...Object.keys(built.metafile.inputs),...Object.keys(testBuilt.metafile.inputs),...Object.keys(extraBuilt.metafile.inputs),runtime])].sort();
  assert(inputs.every(f=>f.startsWith('rebuild/')&&!f.includes('..')&&!f.includes('/private/')),'Public repository import closure only');
  const externals=[...new Set(Object.values(built.metafile.inputs).flatMap(x=>x.imports.filter(i=>i.external).map(i=>i.path)))].sort();
  assert.deepEqual(externals,['@noble/hashes/hmac.js','@noble/hashes/sha2.js','@noble/hashes/utils.js','node:crypto'],'Exact external runtime dependencies');
  const files=Object.fromEntries([...new Set([...inputs,...DEPENDENCIES])].sort().map(f=>[f,sha(fs.readFileSync(path.join(root,f)))]));
  return {version:1,roots:ROOTS.slice(),testRoots:TEST_ROOTS.slice(),runtimeFactoryImports,externals,browserGeneratedImports,files};
}
function verify(spec){
  const bytes=fs.readFileSync(path.join(root,FILE));
  assert.equal(sha(bytes),spec.product[FILE]?.post,'Pinned runtime closure manifest');
  const expected=JSON.parse(bytes),actual=inventory();
  assert.deepEqual(actual,expected,'Actual imported runtime closure differs from declaration');
  for(const [file,hash]of Object.entries(actual.files))assert.equal(spec.product[file]?.post,hash,'Missing or wrong runtime closure pin '+file);
  return actual;
}
module.exports={inventory,verify,ROOTS,TEST_ROOTS,DEPENDENCIES,FILE};
