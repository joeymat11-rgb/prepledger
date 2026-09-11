'use strict';
// Preserve the original package's closed BLOCKED classification without printing
// arbitrary errors, payloads or paths. The original runner is an immutable pin.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../../conform/v4/postfix/run.cjs'),'utf8');
const matches=[...source.matchAll(/const blocked=(\[[^\]]+\])\.includes\(e\.code\)/g)];
assert.equal(matches.length,1,'Original closed blocked-code list');
const codes=JSON.parse(matches[0][1].replaceAll("'",'"'));
assert(codes.length&&codes.every(c=>/^[A-Z]+(?:-[A-Z]+)+$/.test(c))&&new Set(codes).size===codes.length);
function failure(error){const blocked=codes.includes(error?.code);return {exit:blocked?2:1,line:blocked?'NATIVE CARRIERS PACKAGE BLOCKED '+error.code:'NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld'};}
module.exports={failure,codes};
