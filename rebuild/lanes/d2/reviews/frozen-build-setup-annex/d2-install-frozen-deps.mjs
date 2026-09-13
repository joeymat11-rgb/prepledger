import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const root=process.cwd(),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),lock=JSON.parse(fs.readFileSync('package-lock.json'));
const entries=['esbuild','@esbuild/win32-x64'];fs.mkdirSync('.tmp/esbuild-archives',{recursive:true});const installed=[];
for(const name of entries){const meta=lock.packages['node_modules/'+name];if(meta.version!=='0.28.1'||!meta.resolved.startsWith('https://registry.npmjs.org/'))throw Error('Unexpected locked package');
 const response=await fetch(meta.resolved);if(!response.ok)throw Error('Registry download failed '+response.status);const bytes=Buffer.from(await response.arrayBuffer());
 const integrity='sha512-'+crypto.createHash('sha512').update(bytes).digest('base64');if(integrity!==meta.integrity)throw Error('Locked integrity mismatch');
 const archive=path.resolve('.tmp/esbuild-archives/'+name.replaceAll('/','-').replace('@','')+'.tgz');fs.writeFileSync(archive,bytes);
 const listing=spawnSync('tar',['-tzf',archive],{encoding:'utf8',maxBuffer:1024*1024});if(listing.status)throw Error('Tar listing failed');
 const members=listing.stdout.trim().split(/\r?\n/);if(members.some(p=>!p.startsWith('package/')||p.split('/').includes('..')))throw Error('Unexpected archive paths');
 const destination=path.resolve('node_modules',name);if(!destination.startsWith(root+path.sep)||fs.existsSync(destination))throw Error('Fresh own package destination required');fs.mkdirSync(destination,{recursive:true});
 const extract=spawnSync('tar',['-xzf',archive,'--strip-components','1','-C',destination],{encoding:'utf8'});if(extract.status)throw Error('Tar extraction failed');
 const packageJson=JSON.parse(fs.readFileSync(path.join(destination,'package.json')));if(packageJson.name!==name||packageJson.version!==meta.version)throw Error('Extracted identity mismatch');
 const files=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const file=path.join(p,e.name),s=fs.lstatSync(file);if(s.isSymbolicLink()||s.nlink!==1&&s.isFile())throw Error('Linked package file refused');if(e.isDirectory())walk(file);else if(e.isFile()){const b=fs.readFileSync(file);files.push({path:path.relative(root,file).replaceAll('\\','/'),bytes:b.length,sha256:sha(b)});}else throw Error('Unexpected package entry');}}walk(destination);
 installed.push({name,version:meta.version,url:meta.resolved,integrity,archiveSHA256:sha(bytes),archiveBytes:bytes.length,members,files,scriptsExecuted:false});
}
const result={node:process.version,platform:process.platform,arch:process.arch,nodeSHA256:sha(fs.readFileSync(process.execPath)),installed,sourceOnlyBeforeLoaderExecution:true};
fs.writeFileSync('.tmp/d2-frozen-dependency-inventory.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({packages:installed.map(x=>({name:x.name,version:x.version,files:x.files.length,archiveSHA256:x.archiveSHA256})),node:process.version,scriptsExecuted:false}));
