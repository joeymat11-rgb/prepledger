import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {siteFiles} from '../../../scripts/site-manifest.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const BASE = '8fa4912093be7d7fdf9164343be0473d2127e042';
export const OLD_FILES = Object.freeze(['404.html','_headers','_redirects','app.js','apple-touch-icon.png','dad.html',
  'debrief-mockup.html','favicon-32.png','fonts.css','icon-192.png','icon-512-maskable.png','icon-512.png',
  'icon-mono-512.png','index.html','manifest.webmanifest','measured-redesign-mockups.html','netlify.toml','sw.js']);
const FROZEN = ['src','index.html','ledger','scripts','tools','app.js',...OLD_FILES,
  'rebuild/conform/laws','rebuild/conform/reference','rebuild/conform/oracle','rebuild/conform/lib',
  'rebuild/conform/coverage','rebuild/conform/gates','rebuild/conform/fixtures','rebuild/conform/golden',
  'rebuild/conform/run.cjs','rebuild/m1/earned-mock.public.html','rebuild/m3/soak-stub'];
const git = (args,root=ROOT) => execFileSync('git',args,{cwd:root,windowsHide:true,encoding:'utf8',stdio:['ignore','pipe','pipe']});

export function frozenPaths(root=ROOT, base=BASE) {
  // Compare committed AND working-copy changes; new ignored files do not deploy.
  git(['rev-parse','--verify',base+'^{commit}'],root);
  assert.equal(git(['diff','--name-only',base,'--',...FROZEN],root).trim(),'', 'FROZEN-PATHS changed');
  assert.equal(git(['ls-files','--others','--exclude-standard','--',...FROZEN],root).trim(),'', 'FROZEN-PATHS new file');
}

const crcTable = Array.from({length:256},(_,v)=>{for(let j=0;j<8;j++)v=(v&1)?0xedb88320^(v>>>1):v>>>1;return v>>>0;});
const crc = b => {let c=0xffffffff;for(const v of b)c=crcTable[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;};

// A standard uncompressed ZIP: no dependency, executable hook or private content.
export function zipBytes(entries) {
  const locals=[],centrals=[];let offset=0;
  for(const {name,bytes} of entries) {
    const n=Buffer.from(name,'utf8'),b=Buffer.from(bytes),check=crc(b);
    assert.ok(n.length<65536 && b.length<0xffffffff);
    const l=Buffer.alloc(30);l.writeUInt32LE(0x04034b50);l.writeUInt16LE(20,4);l.writeUInt16LE(0x800,6);
    l.writeUInt32LE(check,14);l.writeUInt32LE(b.length,18);l.writeUInt32LE(b.length,22);l.writeUInt16LE(n.length,26);
    locals.push(l,n,b);
    const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);
    c.writeUInt16LE(0x800,8);c.writeUInt32LE(check,16);c.writeUInt32LE(b.length,20);c.writeUInt32LE(b.length,24);
    c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);centrals.push(c,n);offset+=l.length+n.length+b.length;
  }
  const central=Buffer.concat(centrals),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...locals,central,end]);
}

export function inspectZip(bytes) {
  const b=Buffer.from(bytes),end=b.length-22;assert.ok(end>=0);assert.equal(b.readUInt32LE(end),0x06054b50);
  const count=b.readUInt16LE(end+10),centralOffset=b.readUInt32LE(end+16),centralSize=b.readUInt32LE(end+12);
  assert.equal(b.readUInt16LE(end+8),count);assert.equal(centralOffset+centralSize,end);
  let p=centralOffset,localEnd=0;const entries=[];
  for(let i=0;i<count;i++) {
    assert.equal(b.readUInt32LE(p),0x02014b50);assert.equal(b.readUInt16LE(p+10),0);
    const size=b.readUInt32LE(p+20),n=b.readUInt16LE(p+28),x=b.readUInt16LE(p+30),c=b.readUInt16LE(p+32),l=b.readUInt32LE(p+42);
    assert.equal(l,localEnd);assert.equal(b.readUInt32LE(l),0x04034b50);assert.equal(b.readUInt16LE(l+8),0);
    const name=b.subarray(p+46,p+46+n).toString('utf8'),ln=b.readUInt16LE(l+26),lx=b.readUInt16LE(l+28);
    assert.equal(b.subarray(l+30,l+30+ln).toString('utf8'),name);assert.equal(size,b.readUInt32LE(l+18));
    const start=l+30+ln+lx,data=b.subarray(start,start+size);assert.equal(data.length,size);
    assert.equal(crc(data),b.readUInt32LE(p+16));assert.equal(crc(data),b.readUInt32LE(l+14));
    entries.push({name,bytes:data});localEnd=start+size;p+=46+n+x+c;
  }
  assert.equal(localEnd,centralOffset);assert.equal(p,end);return entries;
}

export function validateOldEntries(entries,expected=OLD_FILES) {
  const names=entries.map(e=>e.name);assert.equal(new Set(names).size,names.length,'OLD-PACKAGE duplicate');
  assert.deepEqual([...names].sort(),[...expected].sort(),'OLD-PACKAGE allowlist mismatch');
  for(const name of names) assert.ok(!name.includes('/') && !name.includes('\\') && !name.includes('..'),'OLD-PACKAGE unsafe entry');
}

export function oldPackage(root=ROOT) {
  assert.equal(root,ROOT,'site-manifest is rooted in this checkout');
  const names=siteFiles({includeUntracked:true});
  validateOldEntries(names.map(name=>({name})));
  const entries=names.map(name=>{const file=path.join(root,name);assert.ok(fs.lstatSync(file).isFile(),'OLD-PACKAGE non-file');return {name,bytes:fs.readFileSync(file)};});
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-w0-zip-')),file=path.join(dir,'old-app.zip');
  fs.writeFileSync(file,zipBytes(entries));const actual=inspectZip(fs.readFileSync(file));validateOldEntries(actual);
  for(let i=0;i<entries.length;i++)assert.deepEqual(actual[i].bytes,entries[i].bytes,'OLD-PACKAGE bytes changed');
  return {file,count:entries.length};
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {frozenPaths();console.log('FROZEN-PATHS PASS — pinned authorized base; committed and working copy');
    const archive=oldPackage();console.log(`OLD-PACKAGE PASS — ${archive.count} allowlisted files; actual ZIP entries and bytes verified`);
    console.log('SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates');
  } catch {console.error('W0 SCOPE/PACKAGE FAIL — frozen paths or package invariant');process.exitCode=1;}
}
