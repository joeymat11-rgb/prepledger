'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
// Compile only pinned generated Node instrumentation at the original virtual
// module location so its unchanged relative public imports resolve in rev155/src.
// Nothing is written into that source/dependency tree.
function compile(bytes,virtualFile){const m=new Module(virtualFile,module);m.filename=virtualFile;m.paths=Module._nodeModulePaths(path.dirname(virtualFile));m._compile(bytes,virtualFile);return m.exports;}
function loadInstrumented(pins){const test=pins.sourceRoot+'/rebuild/m3/w5/test';global.__retainingCapture.instrumentedRuntime=compile(fs.readFileSync(pins.instrumentedRuntime,'utf8'),test+'/r1-workerd.retaining.cjs');return compile(fs.readFileSync(pins.instrumentedWitness,'utf8'),test+'/rows-resource-01/rows-resource.retaining.cjs');}
module.exports={compile,loadInstrumented};
