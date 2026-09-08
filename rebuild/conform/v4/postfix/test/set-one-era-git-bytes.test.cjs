'use strict';
// Wholly synthetic disposable Git repository. This proves byte transport and
// refusals only; it supplies no product fixture or acceptance receipt.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const H=require('../helpers/set-one-era-git-bytes.cjs'),L=require('../legacy-gates.cjs'),T=require('../target.cjs');
const root=path.resolve(__dirname,'../../../../..'),parent=path.join(root,'.tmp/postfix/era-git-byte-tests');fs.mkdirSync(parent,{recursive:true});const dir=fs.mkdtempSync(path.join(parent,'synthetic-'));
const git=args=>cp.execFileSync('git',args,{cwd:dir,windowsHide:true,encoding:'utf8',maxBuffer:1024*1024,timeout:60000});
test.after(()=>{assert(path.resolve(dir).startsWith(path.resolve(parent)+path.sep));fs.rmSync(dir,{recursive:true,force:true});});
git(['init','--quiet']);git(['config','user.name','Synthetic Git byte test']);git(['config','user.email','synthetic@example.invalid']);git(['config','core.autocrlf','false']);
const artifact=path.join(dir,H.FILES[0]),fixture=path.join(dir,H.FILES[1]);fs.mkdirSync(path.dirname(fixture),{recursive:true});
const bytes=Buffer.alloc(20*1024*1024,97);Buffer.from('SYNTHETIC FINAL BYTES').copy(bytes,bytes.length-21);fs.writeFileSync(fixture,bytes);fs.writeFileSync(artifact,'{"synthetic":true}\n');
function commit(){git(['add','--all']);git(['commit','--quiet','-m','Synthetic bytes']);return git(['rev-parse','HEAD']).trim();}
const first=commit();
test('original16MiB reader exhibits ENOBUFS; exact ERA reader returns all20MiB including terminal bytes',()=>{assert.throws(()=>L.object(dir,first,H.FILES[1]),e=>e.code==='ENOBUFS');const actual=H.object(dir,first,H.FILES[1]);assert(actual.equals(bytes));assert.equal(T.sha(actual),T.sha(bytes));assert.equal(H.object(dir,'HEAD',H.FILES[0]).toString(),'{"synthetic":true}\n');});
test('same-length committed drift remains observable by exact byte/hash comparison',()=>{const changed=Buffer.from(bytes);changed[changed.length-1]^=1;fs.writeFileSync(fixture,changed);const ref=commit(),actual=H.object(dir,ref,H.FILES[1]);assert.equal(actual.length,bytes.length);assert(!actual.equals(bytes));assert.notEqual(T.sha(actual),T.sha(bytes));assert(H.object(dir,first,H.FILES[1]).equals(bytes));});
for(const [name,ref,file]of [
 ['parent STEP artifact','HEAD','rebuild/conform/v4/postfix/acceptance-step-efficacy.json'],['parent import fixture','HEAD','rebuild/conform/v4/postfix/fixtures/import-guards-deltas.json'],['arbitrary file','HEAD','somewhere.json'],['traversal','HEAD','../acceptance-set-one-era.json'],['branch name','main',H.FILES[0]],['abbreviated ref',first.slice(0,7),H.FILES[0]],['option-shaped ref','--help',H.FILES[0]],['revision expression','HEAD~1',H.FILES[0]]
])test('fixed reader refuses '+name,()=>assert.throws(()=>H.object(dir,ref,file),{code:'ERA-GIT-SELECTOR'}));
test('missing object fails with a fixed error rather than partial bytes',()=>assert.throws(()=>H.object(dir,'0'.repeat(40),H.FILES[0]),{code:'ERA-GIT-READ'}));
test('empty or above64MiB blobs refuse before content acceptance',()=>{for(const size of [0,H.MAX_BYTES+1]){const fd=fs.openSync(artifact,'w');fs.ftruncateSync(fd,size);fs.closeSync(fd);const ref=commit();assert.throws(()=>H.object(dir,ref,H.FILES[0]),{code:'ERA-GIT-SIZE'});}});
test('a tree at an allowed filename is not a blob',()=>{fs.unlinkSync(artifact);fs.mkdirSync(artifact);fs.writeFileSync(path.join(artifact,'synthetic-member'),'x');const ref=commit();assert.throws(()=>H.object(dir,ref,H.FILES[0]),{code:'ERA-GIT-TYPE'});});
