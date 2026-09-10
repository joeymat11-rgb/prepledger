'use strict';
// One disposable mutation of the NEW module; exact bytes restored in finally.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),target=path.join(root,'rebuild/m4/workout/capture.cjs');
const bytes=fs.readFileSync(target),sha=b=>createHash('sha256').update(b).digest('hex');
const needle='for(const o of objects)Object.freeze(o);',source=bytes.toString('utf8');assert.equal(source.split(needle).length,2);
const output=fs.mkdtempSync(path.join(os.tmpdir(),'earned-capture-bite-'));
let red;
try{fs.writeFileSync(target,source.replace(needle,'for(const o of objects)void o;'));
 red=spawnSync(process.execPath,['--test','--test-reporter=tap','--test-name-pattern=private frozen copy','rebuild/m3/w6/test/prescription-capture.test.mjs'],{cwd:root,encoding:'utf8',windowsHide:true});
 fs.writeFileSync(path.join(output,'RED.log'),(red.stdout||'')+(red.stderr||''));
}finally{fs.writeFileSync(target,bytes);}
assert.equal(sha(fs.readFileSync(target)),sha(bytes));assert.equal(red.status,1);assert.match(red.stdout,/not ok.*private frozen copy/);
console.log('CAPTURE FREEZE BITE RED — private frozen copy regression failed; native1');
const green=spawnSync(process.execPath,['--test','--test-reporter=tap','rebuild/m3/w6/test/prescription-capture.test.mjs'],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(output,'RESTORED.log'),(green.stdout||'')+(green.stderr||''));assert.equal(green.status,0);assert.match(green.stdout,/# pass 61\b/);
const result={red:red.status,restored:green.status,restoredSha256:sha(fs.readFileSync(target)),output};fs.writeFileSync(path.join(output,'result.json'),JSON.stringify(result,null,2));
console.log('CAPTURE FREEZE RESTORED PASS — 61 checks; sha256 '+result.restoredSha256);console.log('Capture bite evidence '+output);
