'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const C=require('../reconciliation/codec.cjs');
const root=path.resolve(__dirname,'../../../..'),file='rebuild/m3/w5/storage/row-codec.cjs';
const candidate=fs.readFileSync(path.join(root,file),'utf8'),baseline=cp.execFileSync('git',['show','37e14a5ea26e778e8b9f62f0bac01dd13fc7da9e:'+file],{cwd:root,encoding:'utf8',windowsHide:true});
function compile(source,codec=C){const start=source.indexOf('function string(value, nonempty = true) {'),end=source.indexOf('function parse(value)',start);
 assert(start>=0&&end>start);return new Function('C','integrity',source.slice(start,end)+'\nreturn string;')(codec,()=>new C.R1Error('RETAINED_INTEGRITY',500,false));}
const old=compile(baseline),current=compile(candidate);
function result(fn,value,nonempty){try{return {valid:true,value:fn(value,nonempty)};}catch{return {valid:false};}}
test('every individual UTF-16 unit retains the former round-trip acceptance and exact value',()=>{
 for(let unit=0;unit<=0xffff;unit++){const value=String.fromCharCode(unit);assert.deepEqual(result(current,value,true),result(old,value,true),'SINGLE_UNIT_'+unit);}
});
test('surrogate boundaries, BOM/NUL/NFD and deterministic compound strings remain exact',()=>{
 const units=[0,0x61,0x301,0xd7ff,0xd800,0xdbff,0xdc00,0xdfff,0xe000,0xfeff,0xffff];
 for(const a of units)for(const b of units)for(const prefix of ['', 'x']){
  const value=prefix+String.fromCharCode(a,b);assert.deepEqual(result(current,value,true),result(old,value,true),'BOUNDARY_PAIR');}
 let seed=0x53594e54;for(let i=0;i<4096;i++){let value='';for(let j=0;j<i%23;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;value+=String.fromCharCode(seed&0xffff);}
  assert.deepEqual(result(current,value,false),result(old,value,false),'COMPOUND_STRING');}
 for(const value of [undefined,null,0,false,{},new String('text'),''])for(const nonempty of [false,true])
  assert.deepEqual(result(current,value,nonempty),result(old,value,nonempty),'TYPE_OR_EMPTY');
});
test('actual candidate validation does not allocate a UTF-8 copy; reverting the declaration detects the allocation',()=>{
 let copies=0;const observed={...C,bytes(value){copies++;return C.bytes(value);}};
 const next=compile(candidate,observed),prior=compile(baseline,observed),large='x'.repeat(1900000)+'\udbff\udfff';
 assert.equal(next(large),large);assert.equal(copies,0,'ROW_STRING_NO_UTF8_MATERIALIZATION');
 assert.equal(prior(large),large);assert(copies>0,'PREIMAGE_ALLOCATION_WITNESS_REACHED');
 assert.equal(fs.readFileSync(path.join(root,file),'utf8'),candidate,'NO_RETAINED_SOURCE_MUTATION');
});
test('owned JSON text retains the exact existing grammar and decoded duplicate-key scanner',()=>{
 const codecPath='rebuild/m3/w5/reconciliation/codec.cjs',oldSource=cp.execFileSync('git',['show','37e14a5ea26e778e8b9f62f0bac01dd13fc7da9e:'+codecPath],{cwd:root,encoding:'utf8',windowsHide:true}),nextSource=fs.readFileSync(path.join(root,codecPath),'utf8');
 const body=source=>source.slice(source.indexOf('  // Iterative duplicate-key scan'),source.indexOf('function exact(value,fields'));
 assert.equal(body(nextSource),body(oldSource),'UNCHANGED_JSON_SCANNER_AND_NATIVE_PARSER');
 const inputs=['{}',' {"n":1.00,"text":"e\u0301","escaped":"\\ud800"} ','{"unsafeInteger":9007199254740993}',
  '{"a":1,"\\u0061":2}','{"x":1,"x":2}','{"a":[{"a":1},{"a":2}]}','[1,null,true,false,-0,1e2]',
  '{"n":01}','{"x":"\\q"}','{} trailing','{"x":NaN}','{"x":Infinity}','{"x":undefined}','{"x":"\u0000"}',
  '{"x":'+ '['.repeat(2000)+'0'+']'.repeat(2000)+'}','{"large":"'+'x'.repeat(1900000)+'"}'];
 for(const text of inputs){const observe=fn=>{try{return {ok:true,value:fn()};}catch(e){return {ok:false,code:e.code};}};
  const a=observe(()=>C.parseOwnedText(text)),b=observe(()=>C.parse(C.bytes(text),C.bytes(text).length));
  assert.equal(a.ok,b.ok,'OWNED_JSON_BEHAVIOR');assert.equal(a.code,b.code,'OWNED_JSON_ERROR');
  const stack=[[a.value,b.value]];while(stack.length){const [x,y]=stack.pop();
   if(x&&typeof x==='object'){assert(y&&typeof y==='object');assert.equal(Object.getPrototypeOf(x),Object.getPrototypeOf(y));
    assert.deepEqual(Object.keys(x),Object.keys(y));for(const key of Object.keys(x))stack.push([x[key],y[key]]);
   }else assert(Object.is(x,y),'OWNED_JSON_EXACT_PRIMITIVE');
  }
 }
 assert.throws(()=>C.parse(C.bytes('{}'),1),e=>e.code==='RECONCILE_LIMIT'&&e.status===413,'PUBLIC_BYTE_LIMIT_PRESERVED');
 assert.throws(()=>C.parse(new Uint8Array([0xc0,0xaf])),e=>e.code==='INVALID_R1_REQUEST','PUBLIC_INVALID_UTF8_PRESERVED');
});
