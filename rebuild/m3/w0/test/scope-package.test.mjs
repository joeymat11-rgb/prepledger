import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {zipBytes,inspectZip,validateOldEntries,frozenPaths} from '../scope-package.mjs';

test('actual ZIP round trip preserves names and bytes; changed data is rejected',()=>{
  const input=[{name:'index.html',bytes:Buffer.from('<h1>synthetic</h1>')}];
  const bytes=zipBytes(input);assert.deepEqual(inspectZip(bytes),input);
  bytes[30+Buffer.byteLength('index.html')]^=1;assert.throws(()=>inspectZip(bytes));
});
test('missing, duplicate, extra/private and traversal entries cannot pass the archive gate',()=>{
  const expected=['index.html'];validateOldEntries([{name:'index.html'}],expected);
  for(const names of [[],['index.html','index.html'],['index.html','ledger/live.json'],['../index.html']])
    assert.throws(()=>validateOldEntries(names.map(name=>({name})),expected));
});
test('frozen gate detects committed, working-copy and untracked changes in a disposable repo',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'earned-w0-freeze-'));
  const git=args=>execFileSync('git',args,{cwd:root,windowsHide:true,stdio:'pipe',encoding:'utf8'});
  git(['init','-q']);git(['config','user.name','Synthetic']);git(['config','user.email','test@example.invalid']);
  fs.writeFileSync(path.join(root,'index.html'),'synthetic\n');git(['add','.']);git(['commit','-qm','seed']);
  const base=git(['rev-parse','HEAD']).trim();frozenPaths(root,base);
  fs.writeFileSync(path.join(root,'index.html'),'changed\n');assert.throws(()=>frozenPaths(root,base));
  git(['add','.']);git(['commit','-qm','changed']);assert.throws(()=>frozenPaths(root,base));
  const next=git(['rev-parse','HEAD']).trim();frozenPaths(root,next);
  fs.mkdirSync(path.join(root,'src'));fs.writeFileSync(path.join(root,'src','extra.js'),'synthetic');assert.throws(()=>frozenPaths(root,next));
});
