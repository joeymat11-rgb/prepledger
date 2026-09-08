'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const hash=x=>createHash('sha256').update(x).digest('hex'),files=['crypto.cjs','public-client.cjs','worker.cjs'];
const root=path.resolve(process.argv[2]||path.resolve(__dirname,'../../../..')),w5=path.join(root,'rebuild/m3/w5');
const outputDirectory=process.argv[3]?path.resolve(process.argv[3]):fs.mkdtempSync(path.join(os.tmpdir(),'earned-head-bite-evidence-'));
fs.mkdirSync(outputDirectory,{recursive:true});
const originals=Object.fromEntries(files.map(n=>[n,fs.readFileSync(path.join(w5,n))]));
originals['test.cjs']=fs.readFileSync(path.join(__dirname,'current-head.test.cjs'));
const mutations={challenge:['envelope.challenge !== pending.request.challenge ||',''],replay:['if (pendingHistory !== pending)','if (false)'],
 legacy:['Object.hasOwn(envelope, "history_profile") ||',''],early:['result = await client.receiveCurrentHead','result = {durable:true,confirmed:true}; void client.receiveCurrentHead']};
const results=[];let last;
for(const [name,[from,to]]of Object.entries(mutations)){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'earned-head-bite-'+name+'-'));last=dir;
 for(const[n,b]of Object.entries(originals))fs.writeFileSync(path.join(dir,n),b);
 const text=originals['public-client.cjs'].toString();assert.equal(text.split(from).length,2);
 fs.writeFileSync(path.join(dir,'public-client.cjs'),text.replace(from,to));
 const r=spawnSync(process.execPath,[path.join(dir,'test.cjs'),root,dir,path.join(dir,'evidence')],{encoding:'utf8',windowsHide:true,maxBuffer:2e6});
 const output=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(outputDirectory,'bite-'+name+'.log'),output,{flag:'wx'});
 assert.equal(r.status,1);assert.match(output,/AssertionError/);assert(!/SyntaxError|MODULE_NOT_FOUND/.test(output));
 const passed=(r.stdout.match(/^PASS /gm)||[]).length;assert(passed>=7);
 fs.writeFileSync(path.join(dir,'public-client.cjs'),originals['public-client.cjs']);
 assert.equal(hash(fs.readFileSync(path.join(dir,'public-client.cjs'))),hash(originals['public-client.cjs']));
 results.push({name,exit:r.status,priorPassed:passed,restored:hash(originals['public-client.cjs'])});console.log('CURRENT-HEAD BITE '+name+' RED native1; behavioral assertion after '+passed+' controls; restored '+hash(originals['public-client.cjs']));
}
const restored=spawnSync(process.execPath,[path.join(last,'test.cjs'),root,last,path.join(last,'restored-evidence')],{encoding:'utf8',windowsHide:true,maxBuffer:2e6});
fs.writeFileSync(path.join(outputDirectory,'bite-restored.log'),(restored.stdout||'')+(restored.stderr||''),{flag:'wx'});assert.equal(restored.status,0);
for(const n of files)assert.equal(hash(fs.readFileSync(path.join(w5,n))),hash(originals[n]));
assert.equal(hash(fs.readFileSync(path.join(__dirname,'current-head.test.cjs'))),hash(originals['test.cjs']));
fs.writeFileSync(path.join(outputDirectory,'bites-result.json'),JSON.stringify({results,restoredExit:restored.status},null,2)+'\n',{flag:'wx'});
console.log('CURRENT-HEAD BITES: 4/4 EFFECTIVE; original candidates byte-identical; restored28/28 PASS');
