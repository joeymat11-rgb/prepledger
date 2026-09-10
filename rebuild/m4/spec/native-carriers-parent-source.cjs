'use strict';
// SUCCESSOR SOURCE BRIDGE for the nine originals the parent package covered.
//
// The parent's own carrier children load rebuild/m4/spec/load-write-source.cjs and
// call its verify(), which asserts a CLOSED rebuild/engine inventory of sixteen
// files. B0 adds performed.cjs and entered-load.cjs, so those children can never
// run here — exactly as M2-LOAD-WRITES had to carry successors of the
// IMPORT-GUARDS children. This module is the successor seam: it exposes the
// parent's source API unchanged and replaces ONLY the verifier, with one that is
// strictly stronger, never weaker:
//
//   1. the parent's exact construction still runs, at the parent's own BASE;
//   2. every file of that accepted parent product must still be byte-identical —
//      in the working tree if B0 does not carry it, or at B0's sourceBase if it
//      does (the successor then owns the delta, declared in
//      native-carriers-changes.json with its before/after hashes);
//   3. the working tree must be B0's own exact construction over the B0 inventory.
//
// Nothing under rebuild/engine/test, rebuild/conform or any original gate is
// touched, and no assertion of the parent's is dropped.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const P=require('./load-write-source.cjs'),B=require('./native-carriers-source.cjs');
const L=require('../../conform/v4/postfix/legacy-gates.cjs');
// The parent's literal repairs, then this package's declared carriers. Order is
// preimage order: a B0 carrier's `before` is text the parent's repair produced.
const WRITER_CARRIERS=B.changes().filter(c=>c.file==='rebuild/engine/writers.cjs').map(c=>[c.id,c.before,c.after]);
const CHANGES=[...P.CHANGES,...WRITER_CARRIERS];
function parentProduct(root_){
 const expected=P.construct(P.baseline(root_));
 for(const [file,bytes]of Object.entries(expected)){
  if(Object.hasOwn(B.CARRIED,file)||Object.hasOwn(B.WHOLE,file)){
   assert.equal(B.sha(bytes),B.sha(L.object(root_,B.BASE,file).toString('utf8')),'Accepted parent product preserved at sourceBase: '+file);
  }else{
   assert.equal(fs.readFileSync(path.join(root_,file),'utf8'),bytes,'Accepted parent product unchanged in the tree: '+file);
  }
 }
 return expected;
}
function verify(root_){
 assert.equal(arguments.length,1,'Source verifier accepts no caller-supplied postimage');
 parentProduct(root_);
 return B.verify(root_);
}
module.exports={...P,CHANGES,PARENT_CHANGES:P.CHANGES,WRITER_CARRIERS,B,parentProduct,verify,root};
