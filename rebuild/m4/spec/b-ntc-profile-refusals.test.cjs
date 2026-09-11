'use strict';
// Dedicated archived-parent successor. All thirteen original tests execute
// unchanged, including their real temporary edits and byte-restoration checks.
// This is archived-parent evidence, never acceptance of the actual child.
const {after}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const S=require('./b-ntc-successors.cjs');
const read=fs.readFileSync,load=Module._load;
after(()=>{
  // Recheck both contexts after every original mutation has restored its input.
  const {a,spec}=S.preflight(),file='rebuild/m4/workout/engine-runtime.cjs';
  const {sha}=require('../../conform/v4/postfix/target.cjs');
  const disk=sha(fs.readFileSync(path.resolve(__dirname,'../../..',file)));
  assert.equal(disk,spec.product[file].post);
  assert.notEqual(disk,a.executionPins[file]);
  const runtime=require('../workout/engine-runtime.cjs');
  assert.deepEqual(runtime.COMPOSITION.exposed,['genSession','rirPlan','dayWeather','cleanAtDate']);
  assert.equal(fs.readFileSync,read,'No global filesystem overlay');
  assert.equal(Module._load,load,'No global loader hook');
});
S.profileRefusals();
