'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('../source-proof.cjs'),L=require('../legacy-gates.cjs'),T=require('../target.cjs');
const root=path.resolve(__dirname,'../../../../..'),a=JSON.parse(fs.readFileSync(path.join(__dirname,'../acceptance-import-guards.json')));
const before=L.object(root,a.baseline.auditCommit,S.FILE).toString('utf8'),after=fs.readFileSync(path.join(root,S.FILE),'utf8'),changes=S.proposeSourceChanges(before,after);
const throws=(fn,code)=>assert.throws(fn,e=>e.code===code);
test('five proposed source changes reconstruct exact current file; no blanket file waiver',()=>{assert.equal(changes.length,5);assert.equal(S.applySourceChanges(before,changes),after);});
test('outside declaration or binding change is refused',()=>throws(()=>S.proposeSourceChanges(before,after.replace('const localStorage = drafts;','const localStorage = null;')),'UNAPPROVED-SOURCE-DELTA'));
test('unlisted recordCounts change is refused',()=>throws(()=>S.proposeSourceChanges(before,after.replace('function recordCounts(st) {','function recordCounts(st) { /* unlisted */')),'UNAPPROVED-SOURCE-DELTA'));
test('missing changed declaration is refused',()=>throws(()=>S.applySourceChanges(before,changes.slice(1)),'SOURCE-CHANGE-INVENTORY'));
test('duplicate source IDs are refused',()=>{const d=structuredClone(changes);d[1].id=d[0].id;throws(()=>S.applySourceChanges(before,d),'SOURCE-CHANGE-INVENTORY');});
test('forged preimage hash is refused',()=>{const d=structuredClone(changes);d[0].beforeSha256='0'.repeat(64);throws(()=>S.applySourceChanges(before,d),'SOURCE-CHANGE-PREDICATE');});
test('named function cannot smuggle a following top-level effect',()=>{const d=structuredClone(changes);d[0].after+='globalThis.syntheticSideEffect=true;\n';d[0].afterSha256=T.sha(d[0].after);throws(()=>S.applySourceChanges(before,d),'SOURCE-DECLARATION-SCOPE');assert.equal(globalThis.syntheticSideEffect,undefined);});
test('different late-bound binding implementation is refused',()=>{const d=structuredClone(changes);d[3].after='const _unionCorrLog = () => [];\n';d[3].afterSha256=T.sha(d[3].after);throws(()=>S.applySourceChanges(before,d),'SOURCE-BINDING-SCOPE');});
test('full source postimage mismatch cannot pass one matching declaration',()=>{const d=structuredClone(changes);d[0].after+='\n';d[0].afterSha256=T.sha(d[0].after);assert.notEqual(S.applySourceChanges(before,d),after);});

test('correct binding bytes at an unapproved header location are refused',()=>{const d=structuredClone(changes);d[3].start=d[3].end=0;throws(()=>S.applySourceChanges(before,d),'SOURCE-BINDING-SCOPE');});
