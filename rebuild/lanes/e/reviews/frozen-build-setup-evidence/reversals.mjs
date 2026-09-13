import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
const file='rebuild/conform/engines/build-engines.mjs',original=fs.readFileSync(file),source=original.toString('utf8'),sha=b=>createHash('sha256').update(b).digest('hex');
const cases=[
 ['fresh-invocation',"const wtBase = fs.mkdtempSync(path.join(temporary, 'earned-engine-build-')); checked(wtBase);","const wtBase = path.join(temporary, 'earned-engine-build-fixed'); fs.mkdirSync(wtBase); checked(wtBase);",'real build: repeated runs'],
 ['root-link',"if (fs.lstatSync(current).isSymbolicLink())", "if (false && fs.lstatSync(current).isSymbolicLink())",'real build: refuses root-junction'],
 ['publish-after-both','  checked(outfile);\n  const sha =','  checked(outfile); fs.copyFileSync(outfile, path.join(here, `engine-${name}.cjs`));\n  const sha =','real build: failure in second build'],
 ['exclusive-entry',"{flag:'wx'}","{flag:'w'}",'real build: a committed entry sentinel']
];
const records=[];
for(const [name,from,to,pattern] of cases){if(source.split(from).length!==2)throw Error('Nonunique reversal '+name);let broken;
 try{fs.writeFileSync(file,source.replace(from,to));broken=spawnSync(process.execPath,['--test','--test-name-pattern='+pattern,'rebuild/conform/engines/test/build-engines.test.mjs'],{encoding:'utf8'});fs.writeFileSync('.tmp/frozen-build-setup/reversal-'+name+'.tap',broken.stdout+broken.stderr);if(broken.status!==1||!broken.stdout.includes('ERR_ASSERTION')||/^# cancelled [1-9]/m.test(broken.stdout))throw Error('No intended assertion failure '+name);}
 finally{fs.writeFileSync(file,original);}
 if(!fs.readFileSync(file).equals(original))throw Error('Restore mismatch');
 const restored=spawnSync(process.execPath,['--test','--test-name-pattern='+pattern,'rebuild/conform/engines/test/build-engines.test.mjs'],{encoding:'utf8'});fs.writeFileSync('.tmp/frozen-build-setup/restored-'+name+'.tap',restored.stdout+restored.stderr);if(restored.status!==0)throw Error('Restored run failed '+name);
 records.push({name,pattern,failed:Number(broken.stdout.match(/^# fail (\d+)$/m)?.[1]),restoredPass:Number(restored.stdout.match(/^# pass (\d+)$/m)?.[1]),before:sha(original),restored:sha(fs.readFileSync(file))});
}
fs.writeFileSync('.tmp/frozen-build-setup/reversals.json',JSON.stringify(records,null,2)+'\n');console.log(records);
