'use strict';
// Execute existing numeric assertions against the candidate projector. Only the
// projector import is redirected; all original test functions stay byte-identical.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const root=process.env.EARNED_CONFIGURED_HISTORY;assert(root);process.env.PERFORMED_W6_DIR=root;
const file=path.resolve(__dirname,'../../workout/test/engine-history.test.cjs'),source=fs.readFileSync(file,'utf8');
const before="require('../engine-history.cjs')",after='require('+JSON.stringify(path.join(root,'rebuild/m4/workout/engine-history.cjs'))+')';
assert.equal(source.split(before).length,2,'One actual projector import');
const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(source.replace(before,after),file);
