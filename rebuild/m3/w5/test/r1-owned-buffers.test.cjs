'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process'),{createRequire}=require('node:module');
const file=path.resolve(__dirname,'../reconciliation/codec.cjs');
const baseline=execFileSync('git',['show','575cd8cce561c597d3317541b7d459eba7468127:rebuild/m3/w5/reconciliation/codec.cjs'],{cwd:path.resolve(__dirname,'../../../..'),encoding:'utf8'});
function load(source,mutate){
  let copiedBytes=0;const Native=Uint8Array;
  const Metered=new Proxy(Native,{construct(target,args){
    const b=Reflect.construct(target,args);if(args[0] instanceof Native)copiedBytes+=b.byteLength;return b;
  }});
  class Decoder extends TextDecoder {decode(value,options){if(mutate)mutate(value);return super.decode(value,options);}}
  const m={exports:{}};
  vm.runInNewContext(source,{module:m,exports:m.exports,require:createRequire(file),Uint8Array:Metered,
    ArrayBuffer,TextEncoder,TextDecoder:Decoder,btoa,atob,Object,Set,Map,Number,Reflect},{filename:file});
  return {api:m.exports,copies:()=>copiedBytes};
}
test('owned-buffer optimization preserves strict parser/base64 outcomes against published575',()=>{
  const a=load(baseline),b=load(fs.readFileSync(file,'utf8'));
  const outcome=(c,method,value,...rest)=>{try{return {ok:true,value:JSON.stringify(c.api[method](value,...rest))};}catch(e){return {ok:false,code:e.code,status:e.status};}};
  for(const value of ['{"a":"café","z":[null,true,-0,1e-22]}','{"a":1,"\\u0061":2}',
    '\ufeff{}','{"x":"'+'x'.repeat(262144)+'"}',new Uint8Array([0xff]),new TextEncoder().encode('[1,2]')])
    assert.deepEqual(outcome(a,'parse',value),outcome(b,'parse',value));
  for(const value of ['', 'Zg','Zm8','Zh','Zg==','A','Zm9','é'])assert.deepEqual(outcome(a,'decode64',value),outcome(b,'decode64',value));
  assert(Object.is(b.api.parse('-0'),-0));
});
test('large parse and canonical decode remove one provably redundant typed-array copy each',()=>{
  const raw=new TextEncoder().encode('{"x":"'+'x'.repeat(262144)+'"}');
  for(const method of ['parse','decode64']){
    const value=method==='parse'?raw:Buffer.from(raw).toString('base64url');
    const a=load(baseline),b=load(fs.readFileSync(file,'utf8'));
    a.api[method](value);b.api[method](value);
    assert.equal(a.copies()-b.copies(),raw.length,method+' eliminates exactly one owned-buffer duplicate');
  }
});
test('public parse still snapshots mutable caller bytes before decoder ingress',()=>{
  const raw=new TextEncoder().encode('{"a":1}'),original=raw.slice();let reached=false;
  const c=load(fs.readFileSync(file,'utf8'),b=>{
    reached=true;assert.notEqual(b.buffer,raw.buffer);assert.deepEqual(b,original);raw.fill(32);
  });
  assert.equal(JSON.stringify(c.api.parse(raw)),'{"a":1}');assert(reached);assert(raw.every(x=>x===32));
});

test('canonical unused-bit check matches every short alphabet combination and the published decoder',()=>{
  const old=load(baseline).api,current=load(fs.readFileSync(file,'utf8')).api;
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const check=value=>{
    const independent=Buffer.from(value,'base64url'),canonical=independent.toString('base64url')===value;
    if(canonical)assert.deepEqual(Buffer.from(current.decode64(value)),independent);
    else assert.throws(()=>current.decode64(value),{code:'INVALID_R1_REQUEST'});
  };
  for(const a of alphabet)for(const b of alphabet){check(a+b);for(const c of alphabet)check(a+b+c);}
  for(const prefix of ['', 'AAAA','____AAAA'])for(const tail of alphabet){
    const value=prefix+'A'+tail;let prior,next;
    try{prior=Buffer.from(old.decode64(value)).toString('hex');}catch(e){prior=e.code;}
    try{next=Buffer.from(current.decode64(value)).toString('hex');}catch(e){next=e.code;}
    assert.equal(next,prior);
  }
});
