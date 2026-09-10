'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../reconciliation/codec.cjs');
for(const length of [0,1,2,3,255,256,257,32768,262144,1048575,1048576,1048577]){
  test('base64 exact independent Buffer bytes length '+length,()=>{
    const input=Buffer.alloc(length);for(let i=0;i<length;i++)input[i]=(i*73+(i>>>8))&255;
    const encoded=input.toString('base64url'),decoded=C.decode64(encoded,1048577);
    assert.deepEqual(Buffer.from(decoded),input);
    assert.equal(C.encode64(decoded),encoded);
    if(length){decoded[0]^=255;assert.notEqual(decoded[0],input[0]);}
  });
}
test('indexed decoder preserves canonical trailing-bit, padding and limit refusal',()=>{
  for(const invalid of ['A','Zh','Zm9','Zg=','Zg==','Zg\n',' Zg','Zm+v','Zm/v','\u00e9'])
    assert.throws(()=>C.decode64(invalid),{code:'INVALID_R1_REQUEST'});
  assert.deepEqual(Buffer.from(C.decode64('Zg')),Buffer.from('f'));
  assert.deepEqual(Buffer.from(C.decode64('Zm8')),Buffer.from('fo'));
  assert.throws(()=>C.decode64(Buffer.alloc(1048577).toString('base64url')),{code:'INVALID_R1_REQUEST'});
  assert.throws(()=>C.decode64('Zg',0),{code:'INVALID_R1_REQUEST'});
});
test('duplicate-key scanner defers value grammar to native JSON without weakening refusal',()=>{
  const valid = [
    '{"nested":["a\\\"b",{"escaped\\u006bey":"\\u0061\\n\\t"}],"tail":"x"}',
    '{"key":"'+'x'.repeat(262144)+'","nested":[null,true,false,1e2,{"a":[[]]}]}',
    '["\\\\",{"a":"comma, brace} and colon:","b":["\\uD800"]}]',
  ];
  for (const raw of valid) assert.deepEqual(C.parse(C.bytes(raw)),JSON.parse(raw));
  const invalid = [
    '{"a":"\\q"}', '{"a":"unterminated}', '{"a":"line\nbreak"}',
    '{"a":["\\u12xz"]}', '{"a":[{"b":"x" "c":"y"}]}',
    '{"a":[{"b":"x",}]}', '{"a":"x","a":"y"}',
    '{"a":[{"b":"x","\\u0062":"y"}]}', '{"a":"x"}garbage',
  ];
  for (const raw of invalid) assert.throws(()=>C.parse(C.bytes(raw)),{code:'INVALID_R1_REQUEST'});
});
