import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
test('S3-CORE-ORDER: portable preparation retains source-first order and both originals',()=>{
  assert.ok(existsSync(new URL('../replay-core.cjs',import.meta.url)),'S3 portable replay core is implemented');
  const {createReplayCore}=require('../replay-core.cjs');
  const calls=[];
  const engine={SCHEMA_V:60,migrate(s){calls.push(['migrate',s.v]);s.v=60;return s;},mergeState(a,b){calls.push(['merge',a.v,b.v]);return {...b,...a};},dataLossGuard(a,b){calls.push(['guard',a.v,b.v]);return {safe:true,lost:[]};}};
  const platform={bytes:x=>typeof x==='string'?new TextEncoder().encode(x):new Uint8Array(x),text:x=>new TextDecoder('utf-8',{fatal:true}).decode(x),hash:x=>createHash('sha256').update(x).digest('hex'),equal:require('node:util').isDeepStrictEqual,runtime:()=>({platform:'node',node:process.versions.node})};
  const core=createReplayCore(platform),source=platform.bytes('{"v":60,"a":1}'),local=platform.bytes('{"v":59,"b":2}');
  const p=core.createImportPreparation({engine,parseStrictJson:x=>JSON.parse(typeof x==='string'?x:platform.text(x))}).prepare(source,{localBytes:local});
  assert.deepEqual(calls,[['migrate',60],['merge',60,59],['migrate',60],['guard',60,60],['guard',59,60]]);
  assert.equal(platform.text(p.candidateBytes()),'{"v":60,"b":2,"a":1}');
  p.sourceBytes()[0]=0;assert.equal(platform.text(source),'{"v":60,"a":1}');
});
test('S3-CORE-LOSSLESS: portable preparation refuses NaN rather than accepting JSON coercion',()=>{
  assert.ok(existsSync(new URL('../replay-core.cjs',import.meta.url)),'S3 portable replay core is implemented');
  const {createReplayCore}=require('../replay-core.cjs');
  const core=createReplayCore({bytes:x=>Buffer.from(x),text:x=>Buffer.from(x).toString(),hash:x=>createHash('sha256').update(x).digest('hex'),equal:require('node:util').isDeepStrictEqual,runtime:()=>({node:process.versions.node})});
  const prep=core.createImportPreparation({engine:{SCHEMA_V:60,migrate:s=>({...s,x:NaN}),dataLossGuard:()=>({safe:true,lost:[]})},parseStrictJson:x=>JSON.parse(x)});
  assert.throws(()=>prep.prepare(Buffer.from('{"v":60}')),{code:'IMPORT_MIGRATION_NOT_LOSSLESS_JSON'});
});
