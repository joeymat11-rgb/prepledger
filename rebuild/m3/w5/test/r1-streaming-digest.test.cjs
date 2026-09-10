'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto'),fs=require('node:fs'),Module=require('node:module');
const C=require('../reconciliation/codec.cjs'),{sha256}=require('@noble/hashes/sha2.js');
const independent=(domain,value)=>createHash('sha256').update(Buffer.from(domain+'\0','utf8'))
  .update(typeof value==='string'?Buffer.from(value,'utf8'):Buffer.from(value instanceof ArrayBuffer?new Uint8Array(value):value)).digest('base64url');
const domains=[['operation','earned/r1-operation-bytes/v1'],['payload','earned/reconcile-payload-bytes/v1'],
  ['page','earned/reconcile-page-bytes/v1'],['scope','earned/reconcile-scope/v1'],['synthetic-raw-domain','synthetic-raw-domain']];
const pattern=length=>Uint8Array.from({length},(_,i)=>(i*73+(i>>>8))&255);
for(const length of [0,1,31,32,33,55,56,63,64,65,127,128,129,8191,8192,8193,1048575,1048576,1048577]){
  test('streamed digest matches independent Node SHA at byte length '+length,()=>{
    const value=pattern(length),before=new Uint8Array(value);
    for(const [tag,domain] of domains)assert.equal(C.hash(tag,value),independent(domain,value));
    assert.deepEqual(value,before,'hashing does not mutate the supplied bytes');
  });
}
test('offset Uint8Array excludes unrelated prefix and suffix; ArrayBuffer retains its full range',()=>{
  const buffer=pattern(8193+22),view=new Uint8Array(buffer.buffer,11,8193),saved=new Uint8Array(buffer);
  assert.equal(C.hash('payload',view),independent('earned/reconcile-payload-bytes/v1',view));
  assert.equal(C.hash('payload',buffer.buffer),independent('earned/reconcile-payload-bytes/v1',buffer.buffer));
  assert.notEqual(C.hash('payload',view),C.hash('payload',buffer.buffer));
  assert.deepEqual(buffer,saved);
});
for(const value of ['', 'Caf\u00e9','Cafe\u0301','\u{1f6b6}\u{1f3fd}', '\ud800','\udc00','a\ud800b','\ud800\udc00','nul\0tail']){
  test('string and Unicode domain bytes match Node UTF-8 '+JSON.stringify(value),()=>{
    for(const tag of ['operation','synthetic-\ud800-\u00e9\0domain']){
      const domain=tag==='operation'?'earned/r1-operation-bytes/v1':tag;
      assert.equal(C.hash(tag,value),independent(domain,value));
    }
  });
}
// Instrument only the primitive ingress, using the real pinned hash state. A
// caller mutation at that boundary must not change the already-owned snapshot.
for(const type of ['offset-Uint8Array','ArrayBuffer'])test('stream input owns a defensive copy: '+type,()=>{
  const backing=pattern(67),original=type==='ArrayBuffer'?backing.buffer:new Uint8Array(backing.buffer,1,64);
  const saved=new Uint8Array(original instanceof ArrayBuffer?new Uint8Array(original):original);
  const expected=independent('earned/reconcile-payload-bytes/v1',saved);
  const filename=require.resolve('../reconciliation/codec.cjs'),source=fs.readFileSync(filename,'utf8');
  let updates=0;
  const instrumented={create(){const actual=sha256.create();const instance={
    update(value){updates++;if(updates===2){assert.notEqual(value,original);assert.notEqual(value.buffer,backing.buffer);
      assert.deepEqual(value,saved);backing.fill(255);}actual.update(value);return instance;},
    digest(){return actual.digest();}};return instance;}};
  const isolated=new Module(filename,module);isolated.filename=filename;isolated.paths=module.paths;
  isolated.require=name=>{assert.equal(name,'@noble/hashes/sha2.js');return {sha256:instrumented};};isolated._compile(source,filename);
  assert.equal(isolated.exports.hash('payload',original),expected);
  assert.equal(updates,2);assert(backing.every(n=>n===255),'mutation occurred before the primitive consumed value bytes');
});
test('domain NUL separator is exact; unsupported input types still refuse',()=>{
  assert.notEqual(C.hash('a','bc'),C.hash('ab','c'));
  assert.equal(C.hash('a','\0bc'),independent('a','\0bc'));
  for(const value of [null,undefined,1,{},[],new DataView(new ArrayBuffer(8))])assert.throws(()=>C.hash('payload',value),{code:'INVALID_R1_REQUEST'});
});
