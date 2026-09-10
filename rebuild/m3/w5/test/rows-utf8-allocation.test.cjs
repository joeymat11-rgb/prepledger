'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../reconciliation/codec.cjs'),NativeDecoder=TextDecoder;
const source=fs.readFileSync(require.resolve('../reconciliation/paged-codec.cjs'),'utf8');
function compile(text=source,Decoder=NativeDecoder){const start=text.indexOf('function utf8(bytes){'),end=text.indexOf('function key(value)',start);
 assert(start>=0&&end>start);return new Function('C','TextDecoder',text.slice(start,end)+'\nreturn utf8;')(C,Decoder);}
const candidate=compile(),ok=(fn,bytes)=>{try{fn(bytes);return true;}catch{return false;}};
test('every single byte and deterministic malformed sequences retain fatal decoder behavior',()=>{
 for(let i=0;i<256;i++){const bytes=Uint8Array.of(i);assert.equal(ok(candidate,bytes),ok(C.text,bytes),'SINGLE_UTF8_BYTE_'+i);}
 let seed=0x53594e54;for(let i=0;i<4096;i++){const bytes=new Uint8Array(i%19);for(let j=0;j<bytes.length;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;bytes[j]=seed>>>24;}
  assert.equal(ok(candidate,bytes),ok(C.text,bytes),'COMPOUND_UTF8');}
});
test('multibyte characters and truncated/overlong sequences crossing chunk boundaries stay exact',()=>{
 const tails=[[0],[0xc2,0xa2],[0xe2,0x82,0xac],[0xf0,0x9f,0x98,0x80],[0xf4,0x8f,0xbf,0xbf],
  [0xef,0xbb,0xbf],[0xed,0xa0,0x80],[0xf4,0x90,0x80,0x80],[0xc0,0xaf],[0xe0,0x80,0x80],[0xe2],[0xe2,0x82],[0xf0,0x9f,0x98]];
 for(const prefix of [0,8190,8191,8192,8193,16383])for(const tail of tails){const bytes=new Uint8Array(prefix+tail.length);bytes.fill(97,0,prefix);bytes.set(tail,prefix);
  assert.equal(ok(candidate,bytes),ok(C.text,bytes),'CHUNK_BOUNDARY_UTF8');}
});
test('large validation consumes bounded native decoder inputs and retains original owned bytes',()=>{
 const sizes=[];class ObservedDecoder extends NativeDecoder{decode(value,options){if(value)sizes.push(value.byteLength);return super.decode(value,options);}}
 const run=compile(source,ObservedDecoder),bytes=C.bytes('e\u0301😀'.repeat(240000)),copy=bytes.slice();run(bytes);
 assert(sizes.length>1);assert(Math.max(...sizes)<=8192,'BOUNDED_UNUSED_DECODED_TEXT');assert.deepEqual(bytes,copy,'OWNED_BYTES_UNCHANGED');
});
test('missing final decoder flush and giant temporary decode are effective source faults',()=>{
 const truncated=Uint8Array.of(0xe2,0x82);assert.equal(ok(candidate,truncated),false);
 const noFlush=compile(source.replace('  decoder.decode();','  /* missing final flush */'));assert.equal(ok(noFlush,truncated),true,'TRUNCATED_SEQUENCE_FAULT_REACHED');
 const sizes=[];class ObservedDecoder extends NativeDecoder{decode(value,options){if(value)sizes.push(value.byteLength);return super.decode(value,options);}}
 const whole=compile(source.replace('offset+=8192','offset+=bytes.length').replace('offset+8192','offset+bytes.length'),ObservedDecoder);
 whole(new Uint8Array(20000));assert(Math.max(...sizes)>8192,'UNBOUNDED_DECODE_FAULT_REACHED');
});
test('snapshot delegates its one defensive copy and byte bound to the existing parser',()=>{
 const start=source.indexOf('function snapshot(input,limit){'),end=source.indexOf('\n',start);assert(start>=0&&end>start);
 let calls=0;const observed={...C,bytes(){throw Error('redundant outer copy');},parse(value,limit){calls++;return C.parse(value,limit);}};
 const snapshot=new Function('C',source.slice(start,end)+'\nreturn snapshot;')(observed),bytes=C.bytes('{"x":1}');
 assert.deepEqual(snapshot(bytes,100),{x:1});assert.equal(calls,1);bytes.fill(0);assert.throws(()=>snapshot(bytes,100));
 assert.throws(()=>snapshot(C.bytes('{}'),1),e=>e.code==='RECONCILE_LIMIT'&&e.status===413);
});
test('actual page parser refuses a truncated UTF-8 row with otherwise matching digests and signature bytes',()=>{
 const P=require('../reconciliation/paged-codec.cjs'),Sign=require('../crypto.cjs'),key=Sign.generateSigningKey('synthetic-utf8');
 const sign=record=>{const {authority_signature,...body}=record;return {...body,authority_signature:Sign.signatureOver(body,key,body.profile)};},h=P.hash('synthetic','utf8');
 const request={version:C.REQUEST_VERSION,nonce:h,context_id:h,mode:'CURRENT_DEVICE',claims:[],requested_lease_ids:[]};
 const manifest=sign(P.makeManifest({keyEpoch:key.kid,scopeDigest:h,request,basisDigest:h,revision:1,storageControlDigest:h,snapshotId:h,
  collectionCounts:P.COLLECTIONS.map(c=>[c,c==='history'?1:0]),chainSeed:h}));
 const page=JSON.parse(JSON.stringify(P.makePage({manifest,rawRows:[{collection:'history',row_id:'a',value:'{}'}],sign})));
 page.rows[0].value_b64=C.encode64(Uint8Array.of(0xc2));page.rows_digest=P.hash('batch',page.rows);
 page.chain_digest=P.hash('chain',[manifest.chain_seed,P.manifestDigest(manifest),page.index,page.rows_digest,page.cumulative_counts]);
 page.next_cursor.chain_digest=page.chain_digest;page.next_cursor=sign(page.next_cursor);page.next_cursor_digest=P.cursorReference(page.next_cursor);
 assert.throws(()=>P.parseResponse(C.encode({manifest,page:sign(page)})),undefined,'PAGE_TRUNCATED_UTF8_REFUSAL');
});
