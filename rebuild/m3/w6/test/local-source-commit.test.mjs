import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
test('S3-COMMIT-OWNERSHIP: fake completion or Q cannot write a generation',async()=>{
 assert.ok(existsSync(new URL('../local/source-commit.mjs',import.meta.url)),'S3 atomic source commit is implemented');
 const {commitLocalSource}=await import('../local/source-commit.mjs');
 for(const handle of [null,{},Object.freeze({ready:true,qualified:true,basis:{profile:'earned/local-source-basis/v1'}})])
  await assert.rejects(()=>commitLocalSource(handle),{code:'LOCAL_SOURCE_QUALIFICATION_UNOWNED'});
});
