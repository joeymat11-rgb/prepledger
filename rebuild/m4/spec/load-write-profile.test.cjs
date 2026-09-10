'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const P=require('./load-write-profile.cjs'),root=path.resolve(__dirname,'../../..');
const artifact=path.join(root,P.ARTIFACT),review=path.join(root,P.REVIEW);
function reject(file,change,reason='Exact closed cumulative profile'){const original=fs.readFileSync(file);try{fs.writeFileSync(file,change(original));assert.throws(()=>P.verify(),error=>reason==='JSON-DUPLICATE-KEY'?error.code===reason:error.code==='ERR_ASSERTION'&&error.message.startsWith(reason));}finally{fs.writeFileSync(file,original);}assert(fs.readFileSync(file).equals(original),'Exact control restoration');}
const edit=fn=>bytes=>{const value=JSON.parse(bytes);fn(value);return JSON.stringify(value,null,2)+'\n';};
test('complete profile reports only its verified independent status',()=>{const c=P.verify();assert.equal(c.accepted,JSON.parse(fs.readFileSync(review)).status==='ACCEPTED');assert.deepEqual(c.manifest.requiredIds,['D12','D33','D34','D35','D41','D43']);});
test('cannot omit a repair',()=>reject(artifact,edit(m=>m.requiredIds.pop())));
test('cannot omit an original gate',()=>reject(artifact,edit(m=>m.gates.pop())));
test('cannot declare extra scope',()=>reject(artifact,edit(m=>m.extraDecision='unapproved'),'Closed profile keys'));
test('cannot repin an altered helper',()=>reject(artifact,edit(m=>m.executionPins['rebuild/m4/spec/load-write-direct.cjs']='0'.repeat(64))));
test('cannot repin a different product',()=>reject(artifact,edit(m=>m.product['rebuild/engine/writers.cjs']='0'.repeat(64))));
test('cannot accept without an independent exact receipt',()=>reject(review,edit(m=>{m.status='ACCEPTED';m.receipt=null;}),'Missing independent receipt'));
test('duplicate artifact keys refuse',()=>reject(artifact,bytes=>bytes.toString().replace('"version": 1','"version": 1, "version": 1'),'JSON-DUPLICATE-KEY'));
