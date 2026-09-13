'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./b1b2-evidence.cjs');
// Original SUP-11/12/13 execute without assertion or fixture substitutions.
H.loadOriginal('h3-supersede-defect-witnesses.test.cjs');
test('B1B2/DEFECTS-1 combined complete original witnesses retain all substitutions',()=>{
  const C=require('../../../conform/v4/postfix/legacy-b1b2-carriers.cjs');
  const rows=C.runPublic();assert.equal(rows.length,4);assert.equal(rows.reduce((n,r)=>n+r.cases,0),31);assert.equal(rows.reduce((n,r)=>n+r.edits.length,0),35);
});
test('B1B2/DEFECTS-2 original H3 first-read hunks remain exact',()=>assert.equal(H.reconstructH3(),4));
