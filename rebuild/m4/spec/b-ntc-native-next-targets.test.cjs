'use strict';
// Same original ten tests. Only the exact runtime-handle surface expectation
// follows DECISIONS:109; all construction, import, behavior and refusal cells stay.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),file='rebuild/m4/workout/test/native-next-targets.test.cjs';
const {sha}=require('../../conform/v4/postfix/target.cjs');
const raw=fs.readFileSync(path.join(root,file));
assert.equal(sha(raw),'8ab8ac5b7e1a35a9006e952f07ce170a2bb58ce962e213f18ee2bd385b6b3a41','Immutable original test');
const before="assert.deepEqual(Object.keys(R),['genSession','rirPlan']);";
const src=raw.toString('utf8');assert.equal(src.split(before).length,2,'One exact runtime-handle surface assertion');
const m=new Module(path.join(root,file),module);m.filename=path.join(root,file);m.paths=Module._nodeModulePaths(path.dirname(m.filename));
m._compile(src.replace(before,"assert.deepEqual(Object.keys(R),['genSession','rirPlan','dayWeather','cleanAtDate']);"),m.filename);
