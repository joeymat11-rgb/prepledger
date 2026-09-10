'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const S=require('../source/codec.cjs');
test('indexed prefix digest preserves exact prior JSON-array bytes at every accepted cut',()=>{
  const values=[{seq:1,op:{op_id:'one',note:'Café e\u0301',value:1.25,extra:null}},
    {seq:2,op:{op_id:'two',note:'nul\0tail',value:0,extra:[false,'👣']}},
    {seq:3,op:{note:'different key order',op_id:'three',value:1e-7}}];
  const prefix=S.createPrefixHasher();
  for(let n=0;n<=values.length;n++){
    const expected=createHash('sha256').update(S.PROFILE+'/accepted-prefix\0').update(JSON.stringify(values.slice(0,n))).digest('base64url');
    assert.equal(prefix.digest(),expected);assert.equal(prefix.digest(),expected,'Reading a prefix never consumes hash state');
    assert.equal(S.frontier((_table,id)=>values[Number(id)-1],n).log_digest,expected);
    if(n<values.length)prefix.append(values[n]);
  }
  assert.throws(()=>S.createPrefixHasher().append(values[1]),{code:'SOURCE_INTEGRITY'});
});
