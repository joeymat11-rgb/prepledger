import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
test('S3-Q-OWNERSHIP: serialized qualification cannot become a live controller handle',async()=>{
 assert.ok(existsSync(new URL('../local/source-admission.mjs',import.meta.url)),'S3 admission controller is implemented');
 const {assertLocalSourceQualification}=await import('../local/source-admission.mjs');
 for(const handle of [null,{},Object.freeze({profile:'earned/local-source-qualification/v1',ready:true,qualified:true})])
  assert.throws(()=>assertLocalSourceQualification(handle),{code:'LOCAL_SOURCE_QUALIFICATION_UNOWNED'});
});
