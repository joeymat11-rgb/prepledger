'use strict';
const fs=require('node:fs'),path=require('node:path'),{sha}=require('./owned.cjs');
function inside(root,file,p=path){const rel=p.relative(root,file);return rel===''||(!rel.startsWith('..'+p.sep)&&rel!=='..'&&!p.isAbsolute(rel));}
// Real file bytes and every encountered symlink are pinned. pnpm's internal
// links are allowed; external links, unresolved paths, and ancestor cycles fail.
function inventory(directory,{io=fs,p=path,hash=file=>sha(io.readFileSync(file))}={}){const root=io.realpathSync(directory),files={},links={},visited=new Set();
  function visit(logical,ancestors){const real=io.realpathSync(logical);if(!inside(root,real,p))throw Error('DEPENDENCY_LINK_OUTSIDE');const stat=io.lstatSync(logical);if(stat.isSymbolicLink())links[logical]=real;const actual=io.statSync(real);if(actual.isDirectory()){if(ancestors.has(real))throw Error('DEPENDENCY_LINK_CYCLE');if(visited.has(real))return;visited.add(real);const next=new Set(ancestors);next.add(real);for(const entry of io.readdirSync(real))visit(p.join(real,entry),next);}else if(actual.isFile())files[real]=hash(real);else throw Error('DEPENDENCY_SPECIAL_FILE');}
  visit(root,new Set());return {root,files,links};}
function verifyInventory(expected,{io=fs,p=path}={}){const actual=inventory(expected.root,{io,p});if(JSON.stringify(Object.entries(actual.files).sort())!==JSON.stringify(Object.entries(expected.files).sort())||JSON.stringify(Object.entries(actual.links).sort())!==JSON.stringify(Object.entries(expected.links).sort()))throw Error('DEPENDENCY_PIN_MISMATCH');}
module.exports={inside,inventory,verifyInventory};
