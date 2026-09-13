import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), git=(...args)=>execFileSync('git',args), hash=b=>createHash('sha256').update(b).digest('hex');
const head='f2dea2ec8426d12e95483e180821839fbf1165f7', engine='cbcebb3d26bf8892adbe84fbbe0a7c5e85856013', priorHead='8e65805481091daacda3266ad9113b49553cf3f4';
const prior=JSON.parse(fs.readFileSync('.tmp/d2-r3-prior-identity.json'));
assert.equal(git('rev-parse','HEAD').toString().trim(),head);
assert.equal(git('status','--porcelain=v1').toString().trim(),'');
const tree=part=>git('rev-parse',head+':'+part).toString().trim();
assert.equal(tree('rebuild/m3'),prior.m3Tree);
assert.equal(tree('rebuild/engine'),git('rev-parse',engine+':rebuild/engine').toString().trim());
const c=prior.c.map(row=>{const b=git('show',head+':'+row.path);assert.equal(hash(b),row.sha256);assert(b.equals(git('show',row.reference+':'+row.path)));return {...row,equalToCurrent:true};});
const identities=prior.sourceIdentities.map(old=>{
 const b=fs.readFileSync(old.path);assert(b.equals(git('show',head+':'+old.path)),old.path);
 assert.equal(hash(git('show',priorHead+':'+old.path)),old.sha256,old.path);
 const sha256=hash(b); return {path:old.path,bytes:b.length,sha256,priorSHA256:old.sha256,changed:sha256!==old.sha256,gitDiskEqual:true};
});
assert.deepEqual(identities.filter(f=>f.changed).map(f=>f.path),['rebuild/engine/today.cjs']);
const allowed=new Set(identities.filter(r=>/\.(cjs|mjs|js|json)$/.test(r.path)).map(r=>r.path));
const queue=['rebuild/m3/w7-preview/today/today-entry.mjs'],seen=new Set(),nodes=[],denied=[];
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,m=>m.replace(/[^\r\n]/g,' ')).replace(/^\s*\/\/[^\n]*/gm,m=>m.replace(/[^\r\n]/g,' '));
while(queue.length){
 const file=queue.shift();if(seen.has(file))continue;
 if(!allowed.has(file)){denied.push(file);continue;}seen.add(file);
 const source=fs.readFileSync(file,'utf8'),clean=strip(source),edges=[];
 const patterns=[['require',/\brequire\s*\(\s*(['"])([^'"\n]+)\1\s*\)/g],['dynamic-import',/\bimport\s*\(\s*(['"])([^'"\n]+)\1\s*\)/g],['static-import',/\b(?:import|export)\s+(?!\()(?:(?:\{[\s\S]*?\}|[\w*$,\s]+?)\s+from\s+)?(['"])([^'"\n]+)\1/g]];
 for(const [kind,re] of patterns)for(const m of clean.matchAll(re)){
  const spec=m[2],line=clean.slice(0,m.index).split('\n').length;
  if(spec.startsWith('.')){
   let resolved=path.posix.normalize(path.posix.join(path.posix.dirname(file),spec));
   if(!allowed.has(resolved)){denied.push({importer:file,line,specifier:spec,resolved});continue;}
   edges.push({kind,line,specifier:spec,resolved});queue.push(resolved);
  }else edges.push({kind,line,specifier:spec,external:true});
 }
 const rawLoaderLines=source.split(/\r?\n/).flatMap((text,i)=>/\brequire\b|\bimport\b|\bcreateRequire\b|\beval\s*\(|\bFunction\s*\(/.test(text)?[{line:i+1,text}]:[]);
 nodes.push({path:file,sha256:hash(Buffer.from(source)),edges,rawLoaderLines});
}
const output={head,engine,priorHead,engineTree:tree('rebuild/engine'),m3Tree:tree('rebuild/m3'),c,identities,staticProductionClosure:{entry:'rebuild/m3/w7-preview/today/today-entry.mjs',method:'literal import/dynamic-import/require discovery, with preserved raw loader lines for manual audit; no module evaluated',nodes:nodes.sort((a,b)=>a.path.localeCompare(b.path)),denied},sourceChanges:git('diff','--name-only',priorHead,head).toString().trim().split('\n'),execution:{productModules:0,tests:0,builds:0,browserCases:0},unread:['rebuild/lanes/b/BUILD-B1B2-R4-R9.md','rebuild/lanes/b/tooling/README.md','current ER behavioral reports/evidence','rebuild/conform/lib/ops.cjs','rebuild/conform/lib/canonical.cjs','rebuild/m4/workout/engine-runtime.cjs']};
fs.writeFileSync('.tmp/d2-r4-identity-and-closure.json',JSON.stringify(output,null,2)+'\n');
assert.deepEqual(denied,[],'Stop before unknown dependency read');
console.log(JSON.stringify({head,engineTree:output.engineTree,m3Tree:output.m3Tree,c:c.length,identities:identities.length,changed:identities.filter(r=>r.changed).map(r=>r.path),sourceModules:nodes.length,edges:nodes.reduce((n,r)=>n+r.edges.length,0),external:[...new Set(nodes.flatMap(n=>n.edges.filter(e=>e.external).map(e=>e.specifier)))].sort(),denied:denied.length}));
