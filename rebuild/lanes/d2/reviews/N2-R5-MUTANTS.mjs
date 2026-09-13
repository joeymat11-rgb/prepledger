import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';import {pathToFileURL,fileURLToPath} from 'node:url';
const root=process.cwd(),file=path.join(root,'rebuild/m3/w7-preview/today/sleep-commands.cjs').replaceAll('\\','/');
const source=fs.readFileSync(file,'utf8'),sha256=createHash('sha256').update(source).digest('hex');
const cases=[
 ['complete-check-removed','if (op.payload.night.date >= op.effective.local_date) return false;','/* mutation: no completed-date check */','R5-DATE refuses'],
 ['same-day-accepted','if (op.payload.night.date >= op.effective.local_date) return false;','if (op.payload.night.date > op.effective.local_date) return false;','R5-DATE refuses'],
 ['save-calendar-syntax-only','|| !isRealDate(op.effective.local_date)) return false;','|| !DAY_RE.test(op.effective.local_date)) return false;','R5-ENVELOPE'],
 ['construction-day-frozen','if (op.payload.night.date >= op.effective.local_date) return false;','if (op.payload.night.date >= "2030-02-04") return false;','R5-CLOCK'],
];
const dir=path.join(root,'.tmp/d2-r5-mutants');fs.mkdirSync(dir,{recursive:true});const summary=[];
for(const [id,from,to,pattern]of cases){
 if(source.split(from).length!==2)throw new Error('D2 anchor mismatch '+id);
 const config={id,path:file,sha256,from,to};const location=path.join(dir,id+'.json');fs.writeFileSync(location,JSON.stringify(config,null,2)+'\n');
 const args=['--test','--test-reporter=tap','--test-name-pattern='+pattern,fileURLToPath(new URL('./N2-R5-BOUNDARIES.test.mjs',import.meta.url))];
 const red=spawnSync(process.execPath,['--import',new URL('./N2-R5-MUTANT-HOOK.mjs',import.meta.url).href,...args],{cwd:root,env:{...process.env,D2_R4_MUTATION:location},encoding:'utf8',timeout:60000});
 const redText=(red.stdout||'')+'\n'+(red.stderr||'');fs.writeFileSync(path.join(dir,id+'-red.tap'),redText);
 const green=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:60000});const greenText=(green.stdout||'')+'\n'+(green.stderr||'');fs.writeFileSync(path.join(dir,id+'-original.tap'),greenText);
 const assertions=(redText.match(/code: 'ERR_ASSERTION'/g)||[]).length,otherCodes=[...redText.matchAll(/code: '([^']+)'/g)].map(m=>m[1]).filter(v=>v!=='ERR_ASSERTION');
 const applied=(redText.match(/D2_MUTATION_APPLIED/g)||[]).length,originalPass=Number(greenText.match(/^# pass (\d+)$/m)?.[1]||0);
 const unchanged=createHash('sha256').update(fs.readFileSync(file,'utf8')).digest('hex')===sha256;
 const row={id,pattern,redExit:red.status,assertions,otherCodes,applied,originalExit:green.status,originalPass,unchanged,patch:{path:'rebuild/m3/w7-preview/today/sleep-commands.cjs',sha256,from,to}};
 row.valid=red.status===1&&assertions>0&&otherCodes.length===0&&applied===1&&green.status===0&&originalPass>0&&unchanged;
 summary.push(row);fs.writeFileSync(path.join(root,'.tmp/d2-r5-mutants.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(row));if(!row.valid){process.exitCode=1;break;}
}
