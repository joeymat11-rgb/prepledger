import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import childProcess from 'node:child_process';import {createRequire} from 'node:module';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),root=process.cwd(),require=createRequire(import.meta.url);
for(const k of Object.keys(process.env))if(['NODE_OPTIONS','NODE_PATH','ESBUILD_BINARY_PATH','NODE_V8_COVERAGE','NODE_TEST_CONTEXT'].includes(k.toUpperCase()))delete process.env[k];
process.env.ESBUILD_WORKER_THREADS='0';process.env.TEMP=path.join(root,'.tmp');process.env.TMP=path.join(root,'.tmp');
const loader=require.resolve('esbuild'),service=require.resolve('@esbuild/win32-x64/esbuild.exe');
const all=JSON.parse(fs.readFileSync('.tmp/d2-frozen-dependency-inventory.json')).installed.flatMap(x=>x.files);
const paths=[loader,service].map(file=>{const relative=path.relative(root,file).replaceAll('\\','/'),known=all.find(x=>x.path===relative),bytes=fs.readFileSync(file);if(!known||known.sha256!==sha(bytes)||fs.lstatSync(file).nlink!==1||fs.realpathSync(file)!==file)throw Error('Actual loader/service identity failed');return {path:relative,bytes:bytes.length,sha256:sha(bytes)};});
const original=childProcess.spawn,spawns=[];
childProcess.spawn=function(command,args,options){if(path.resolve(command)!==service)throw Error('Unowned service executable');spawns.push({path:path.relative(root,command).replaceAll('\\','/'),args});return original.call(this,command,args,options);};
try{const esbuild=require(loader);if(esbuild.version!=='0.28.1')throw Error('Loader version mismatch');const result=await esbuild.transform('export const __test = 334;',{loader:'js',format:'cjs'});if(!result.code.includes('__test'))throw Error('Synthetic service output absent');esbuild.stop();if(spawns.length!==1||!spawns[0].args.includes('--service=0.28.1'))throw Error('Service identity not observed');
 fs.writeFileSync('.tmp/d2-frozen-loader-service.json',JSON.stringify({node:process.version,actualFiles:paths,actualSpawns:spawns,esbuild:esbuild.version,syntheticTransformBytes:Buffer.byteLength(result.code),fixtureOnly:true,productSourceExecuted:false},null,2)+'\n');console.log(JSON.stringify({verified:paths,serviceSpawns:spawns.length,version:esbuild.version}));
}finally{childProcess.spawn=original;}
