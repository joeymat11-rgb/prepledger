'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');const {sha}=require('./owned.cjs');const {verifyInventory}=require('./paths.cjs');const root=__dirname;
const hashFile=file=>sha(fs.readFileSync(file));
function scopedEnvironment(env=process.env){const child={...env},value=env.NODE_OPTIONS;let omitted=false;
  if(value!==undefined){if(!/^--max-old-space-size=\d+$/.test(value)||sha(value)!=='560d91cc597a59774228b503f751332375555956411b827dcea4defa95e0878c')throw Error('NODE_OPTIONS_NOT_APPROVED_SINGLE_OPTION');delete child.NODE_OPTIONS;omitted=true;}
  for(const k of Object.keys(child))if(/^(?:V8_FLAGS|WORKERD_.*FLAGS|MINIFLARE_.*FLAGS|ESBUILD_BINARY_PATH|WORKERD_BINARY_PATH|MINIFLARE_WORKERD_PATH|WORKERD_BINARY|NODE_V8_COVERAGE)$/i.test(k)&&child[k])throw Error('INHERITED_RUNTIME_OVERRIDE');
  return {env:child,receipt:{parentNodeOptionsPresent:value!==undefined,parentNodeOptionsSha256:value===undefined?null:sha(value),omittedOnlyApprovedNodeOptions:omitted,childNodeOptionsPresent:false}};
}
function environment(p){if(process.platform!=='linux'||process.arch!=='x64')throw Error('LINUX_X64_REQUIRED');if(process.execArgv.length)throw Error('INHERITED_NODE_FLAGS');if(process.env.NODE_OPTIONS!==undefined)throw Error('CHILD_NODE_OPTIONS_MUST_BE_ABSENT');scopedEnvironment();if(path.resolve(os.tmpdir())!==p.originalTemp)throw Error('TEMP_PIN_CHANGED');}
function verifyTransport(){const t=JSON.parse(fs.readFileSync(root+'/TRANSPORT-PINS.json'));for(const [f,h]of Object.entries(t.files)){if(path.isAbsolute(f)||f.split('/').includes('..')||hashFile(path.join(root,f))!==h)throw Error('TRANSPORT_PIN_MISMATCH');}return t;}
function verify(){verifyTransport();const p=JSON.parse(fs.readFileSync(root+'/PLANNED-MANIFEST.json'));if(p.platform!=='linux'||p.prepared!==true)throw Error('PREPARED_LINUX_MANIFEST_REQUIRED');for(const [f,h]of Object.entries(p.expected))if(hashFile(f)!==h)throw Error('PRELAUNCH_PIN_MISMATCH');verifyInventory(p.dependencies);if(fs.realpathSync(process.execPath)!==p.nodeExecutable||hashFile(process.execPath)!==p.nodeSha256)throw Error('NODE_EXECUTABLE_PIN');return p;}
if(require.main===module){try{verify();console.log('LINUX PRELAUNCH PINS VERIFIED; no runtime launch.');}catch(e){console.error(e.message);process.exitCode=2;}}
module.exports={verify,verifyTransport,environment,scopedEnvironment,hashFile};
