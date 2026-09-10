'use strict';
// Each bite alters a disposable copy of one production module. Its assertion
// observes the contract independently, then executes the exact restored bytes.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm');
const {createRequire}=require('node:module'),{createHash,webcrypto}=require('node:crypto');
const C=require('../reconciliation/codec.cjs'),K=require('../crypto.cjs');
const {fixture,packet}=require('./r1-codec.test.cjs');
const hash=b=>createHash('sha256').update(b).digest('hex');
function load(source,original,filename){const mod={exports:{}};
  vm.runInThisContext('(function(require,module,exports){'+source+'\n})',{filename})(createRequire(original),mod,mod.exports);
  return mod.exports;
}
async function bite(name,file,change,assertion){
  const original=path.resolve(__dirname,'../reconciliation',file),bytes=fs.readFileSync(original),source=bytes.toString('utf8');
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-r1-bite-')),copy=path.join(dir,file);
  fs.writeFileSync(copy,bytes);
  await assertion(load(source,original,copy));
  const altered=change(source);assert.notEqual(altered,source,'bite must change actual production source');
  let detected=false;
  try{fs.writeFileSync(copy,altered);try{await assertion(load(altered,original,copy));}
    catch(e){if(e.code!=='ERR_ASSERTION')throw e;detected=true;}
    assert.equal(detected,true,'inert mutation earns nothing: '+name);
    console.log('R1 BITE RED '+name+' — contract assertion failed in disposable module');
  }finally{fs.writeFileSync(copy,bytes);}
  assert.equal(hash(fs.readFileSync(copy)),hash(bytes));assert.equal(hash(fs.readFileSync(original)),hash(bytes));
  await assertion(load(fs.readFileSync(copy,'utf8'),original,copy));
  console.log('R1 BITE RESTORED PASS '+name+' sha256='+hash(bytes));
}
function once(source,old,next){assert.equal(source.split(old).length,2,'unique source mutation anchor');return source.replace(old,next);}
test('effective intent bite: a new challenge cannot change one durable intent',async()=>{
  const a={intent_id:'enroll-one',schema_version:1,nonce:C.encode64(new Uint8Array(32).fill(1))},b={...a,nonce:C.encode64(new Uint8Array(32).fill(2))};
  await bite('INTENT-NONCE','codec.cjs',s=>once(s,"return hash('intent',encode(Object.fromEntries(f.map(k=>[k,r[k]]))));","return hash('intent',encode(Object.fromEntries([...f,'nonce'].map(k=>[k,r[k]]))));"),
    codec=>assert.equal(codec.intentDigest('/enrol/create',a),codec.intentDigest('/enrol/create',b)));
});
function contender(){const f=fixture(),op={...f.op,op_id:'rejected-contender'};op.canonical_content_commitment=K.commitmentOf(op,'synthetic-identity');
  const d=K.signDisposition({op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,device_id:op.device_id,device_seq:op.device_seq,status:'REJECTED',rejection_code:'DEVICE_SEQ_REUSE',decided_at:'2026-09-06T16:00:00.000Z'},f.key);
  f.push('operations',op.op_id,{op,commitment:op.canonical_content_commitment,disposition:d,historyCount:1});
  f.push('history',JSON.stringify([op.op_id,1]),d);f.push('ownership',op.op_id,{present:true});return f;
}
for(const [name,predicate] of [
  ['REJECTED-CONTENDER',"r.collection==='operations'&&r.row_id==='rejected-contender'"],
  ['ISSUED-LEASE',"r.collection==='issuedLeases'"],
  ['INITIAL-PLAN',"r.collection==='metadata'&&r.row_id==='state'"],
])test('effective complete-inventory bite: '+name,async()=>{
  const f=contender();
  await bite(name,'project.cjs',s=>once(s,'retained_rows:s.retainedRows};','retained_rows:s.retainedRows.filter(r=>!('+predicate+'))};'),project=>{
    const p=project.project({rawRows:f.rows,...f.scope,request:f.request,scopeDigest:f.scopeDigest});
    const actual=p.payload.retained_rows.map(r=>[r.collection,r.row_id,C.text(C.decode64(r.value_b64))]).sort();
    const expected=f.rows.filter(r=>r.athlete===f.athleteId).map(r=>[r.collection,r.row_id,r.value]).sort();
    assert.deepEqual(actual,expected,'every exact retained input row must survive independent producer coverage comparison');
  });
});
test('effective source-account bite: familiar device does not authorize foreign athlete bytes',async()=>{
  const f=fixture(),op={...f.op,athlete_id:'foreign-athlete'};f.request.claims[0].envelope_b64=C.encode64(C.encode(op));
  await bite('SOURCE-ACCOUNT','project.cjs',s=>once(s,"if(op.athlete_id!==athleteId||!state.devices.includes(op.device_id)","if(false||!state.devices.includes(op.device_id)"),project=>
    assert.throws(()=>project.project({rawRows:f.rows,...f.scope,request:f.request,scopeDigest:f.scopeDigest}),e=>e.code==='SCOPE_FORBIDDEN'));
});
test('effective completeness bite: partial authenticated pages never grant verified assembly',async()=>{
  const f=fixture({padding:40000}),p=packet(f);assert(p.pages.length>1);
  await bite('PAGE-COMPLETENESS','verify.cjs',s=>once(s,"check(seen.size===m.page_count,'MISSING_PAGE');","if(seen.size!==m.page_count)return {payloadBytes:new Uint8Array(0)};"),async mod=>{
    const result=await mod.createR1Verifier({keys:[K.publicKeyOf(f.key)],subtle:webcrypto.subtle}).assemble(p.mr,p.pages.slice(1),f.requestBytes,f.expected);
    assert.equal(result.verified,false,'a partial proof must not reach the verified result wrapper');
  });
});
