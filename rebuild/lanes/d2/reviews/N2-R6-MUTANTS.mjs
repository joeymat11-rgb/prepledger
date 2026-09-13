import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';import {pathToFileURL,fileURLToPath} from 'node:url';
const root=process.cwd(),file=path.join(root,'rebuild/m3/w7-preview/today/sleep-commands.cjs').replaceAll('\\','/');
const source=fs.readFileSync(file,'utf8'),sha256=createHash('sha256').update(source).digest('hex');
const key='if (key !== "night" && key !== "supersedes") bad();',openKey='if (key !== "night" && key !== "effective" && key !== "supersedes") bad();';
const start=source.indexOf('function prepare(request) {'),end=source.indexOf('\n}\n',start)+2,prepare=source.slice(start,end);
if(start<0||end<start)throw new Error('D2 prepare anchor missing');
const restored=prepare.replace(key,openKey).replace('return action;','if (Object.hasOwn(input, "effective")) action.effective = input.effective;\n  return action;');
const cases=[
 ['override-key-allowed',key,openKey,'R6-OVERRIDE',fileURLToPath(new URL('./N2-R6-OVERRIDES.test.mjs',import.meta.url))],
 ['override-forwarding-restored',prepare,restored,'R5-EFFECTIVE',fileURLToPath(new URL('./N2-R6-R5-RAW.test.mjs',import.meta.url))],
 ['ordinary-save-stamp-forged','return action;','action.effective = {local_date:"2030-02-05",local_time:"08:00",utc_offset:"+00:00"}; return action;','normal previous-night raw producer',fileURLToPath(new URL('./N2-R6-R5-RAW.test.mjs',import.meta.url))],
];
const dir=path.join(root,'.tmp/d2-r6-mutants');fs.mkdirSync(dir,{recursive:true});const summary=[];
for(const[id,from,to,pattern,testFile]of cases){
 if(source.split(from).length!==2)throw new Error('D2 source mutation anchor '+id);
 const config={id,path:file,sha256,from,to},location=path.join(dir,id+'.json');fs.writeFileSync(location,JSON.stringify(config,null,2)+'\n');
 const args=['--test','--test-reporter=tap','--test-name-pattern='+pattern,testFile];
 const run=(mutated)=>spawnSync(process.execPath,mutated?['--import',new URL('./N2-R6-MUTANT-HOOK.mjs',import.meta.url).href,...args]:args,{cwd:root,env:mutated?{...process.env,D2_R4_MUTATION:location}:process.env,encoding:'utf8',timeout:60000});
 const red=run(true),green=run(false),redText=(red.stdout||'')+'\n'+(red.stderr||''),greenText=(green.stdout||'')+'\n'+(green.stderr||'');
 fs.writeFileSync(path.join(dir,id+'-red.tap'),redText);fs.writeFileSync(path.join(dir,id+'-original.tap'),greenText);
 const assertions=(redText.match(/code: 'ERR_ASSERTION'/g)||[]).length,otherCodes=[...redText.matchAll(/code: '([^']+)'/g)].map(m=>m[1]).filter(v=>v!=='ERR_ASSERTION');
 const applied=(redText.match(/D2_MUTATION_APPLIED/g)||[]).length,originalPass=Number(greenText.match(/^# pass (\d+)$/m)?.[1]||0),unchanged=createHash('sha256').update(fs.readFileSync(file,'utf8')).digest('hex')===sha256;
 const row={id,pattern,testFile,redExit:red.status,assertions,otherCodes,applied,originalExit:green.status,originalPass,unchanged,patch:{sourceSHA256:sha256,fromSHA256:createHash('sha256').update(from).digest('hex'),toSHA256:createHash('sha256').update(to).digest('hex')}};
 row.valid=red.status===1&&assertions>0&&otherCodes.length===0&&applied===1&&green.status===0&&originalPass>0&&unchanged;
 summary.push(row);fs.writeFileSync(path.join(root,'.tmp/d2-r6-mutants.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(row));if(!row.valid){process.exitCode=1;break;}
}
