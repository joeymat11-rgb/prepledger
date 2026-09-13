import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const own=path.dirname(fileURLToPath(import.meta.url));
if(!process.argv[2]) throw new Error('Pass the fresh reviewer-owned candidate worktree path');
const target=path.resolve(process.argv[2]);
assert(fs.statSync(path.join(target,'.git')).isFile(),'A linked owned worktree is required');
const git=(...args)=>execFileSync('git',args,{cwd:target}).toString().trim();
const head='f2dea2ec8426d12e95483e180821839fbf1165f7';
assert.equal(git('rev-parse','HEAD'),head);
assert.equal(git('status','--porcelain=v1'),'');
assert.equal(git('ls-files'),git('ls-tree','-r','--name-only','HEAD'));
const prior=JSON.parse(fs.readFileSync(path.join(own,'prior-identity.json')));
const materialized=git('ls-files','-t').split('\n').filter(s=>!s.startsWith('S ')).map(s=>s.slice(2));
assert.deepEqual(materialized,[...prior.sourceIdentities.map(r=>r.path),'.gitignore','.gitattributes'].sort());
const scratch=path.join(target,'.tmp');fs.mkdirSync(scratch,{recursive:true});
for(const [source,destination] of [['identity.mjs','d2-r4-identity.mjs'],['reachability.mjs','d2-r4-reachability.mjs'],['prior-identity.json','d2-r3-prior-identity.json']])
  fs.copyFileSync(path.join(own,source),path.join(scratch,destination));
fs.writeFileSync(path.join(scratch,'d2-r4-setup.json'),JSON.stringify({head,branch:git('branch','--show-current'),fullIndex:git('ls-files').split('\n').length,materialized,clean:true,method:'Reviewer supplied exact public sparse linked worktree; verified before source replay',setupErrors:[]},null,2)+'\n');
for(const script of ['d2-r4-identity.mjs','d2-r4-reachability.mjs'])
  execFileSync(process.execPath,[path.join(scratch,script)],{cwd:target,stdio:'inherit'});
assert.equal(git('status','--porcelain=v1'),'');
