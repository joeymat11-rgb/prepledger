import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const root = process.cwd(), base = 'rebuild/m3/w7-preview/today/';
const configs = [
  ['01','sleep-commands.cjs','for (const key of Object.keys(input)) if (!MEMBERS.includes(key)) bad();','/* mutation: accept unknown night members */'],
  ['02','sleep-model.cjs','if (raw === "") return REFUSALS.NOTHING;','if (raw === "") return null;'],
  ['03','sleep-model.cjs','h: engine.sleepSpanH(night.bed, night.wake, awake),','h: engine.sleepSpanH(night.bed, night.wake, awake) + 1,'],
  ['04','sleep-model.cjs','Date.UTC(y, m - 1, d - 1)','Date.UTC(y, m - 1, d - 2)'],
  ['05','sleep-commands.cjs','if (!revisionIsCurrent(op, readOperation)) return false;','/* mutation: ignore the commit revision */'],
  ['06','sleep-model.cjs','if (one !== two) return one > two ? a : b;','if (one !== two) return one < two ? a : b;'],
  ['07','today-app.cjs','function reboundCheckIn(origin) {','function reboundCheckIn(origin) { return null;'],
  ['08','today-app.cjs','function sleepQualityFor(date) {','function sleepQualityFor(date) { return null;'],
  ['09','today-model.cjs','setSleepNights(lane) { sleepNights = lane || null; return sleepNights; },','setSleepNights(lane) { sleepNights = null; return sleepNights; },'],
  ['10','sleep-model.cjs','if (Object.hasOwn(night, "hours")) return { d: night.date, h: night.hours };','if (Object.hasOwn(night, "hours")) return { d: night.date, h: night.hours + 1 };'],
  ['11','sleep-model.cjs','h: engine.sleepSpanH(night.bed, night.wake, awake),','h: Number.NaN,'],
  ['12','rebuild/coach/local-world.mjs','if (current !== identity) {','if (false) {'],
  ['13','sleep-model.cjs','const merged = { ...previousRow, ...fresh };','const merged = { ...fresh };'],
  ['14','today-app.cjs','recorded.hidden = !known;','recorded.hidden = true;'],
  ['15','today-app.cjs','map.get("sleep-entry-form").hidden = true;','map.get("sleep-entry-form").hidden = false;'],
  ['16','design.cjs','  "Save sleep",','  "Sleep save wording changed",'],
  ['17','sleep-host.mjs','return sleepNightsIn((await bindings.repository.load()).generation, PROFILE);','return [];'],
  ['18','design.cjs','const templateHtml = () => fs.readFileSync(path.join(SOURCE, "screens.template.html"), "utf8");','const templateHtml = () => fs.readFileSync(path.join(SOURCE, "screens.template.html"), "utf8").replace(\'<template id="t-sleep">\', \'<template id="t-sleep"><div class="d2-mutant-unknown"></div>\');'],
];
const dir = path.join(root, '.tmp/d2-r4-mutants-v2'); fs.mkdirSync(dir, {recursive:true});
const summary = [];
for (const [cell, file, from, to] of configs) {
  if (process.argv[2] && !process.argv[2].split(',').includes(cell)) continue;
  const target = path.join(root, file.startsWith('rebuild/') ? file : base + file).replaceAll('\\','/');
  const source = fs.readFileSync(target, 'utf8');
  if (source.split(from).length !== 2) throw new Error('D2 anchor count for ' + cell);
  const sha256 = createHash('sha256').update(source).digest('hex');
  const config = {id:'N2-'+cell,path:target,from,to,sha256};
  const configPath=path.join(dir, config.id+'.json'); fs.writeFileSync(configPath, JSON.stringify(config,null,2)+'\n');
  const pattern = cell === '09' ? 'N2-09 - D2 finding 2:' : config.id;
  const args=['--test','--test-reporter=tap','--test-name-pattern='+pattern,base+'test/sleep.test.mjs'];
  const red=spawnSync(process.execPath,['--import',new URL('./N2-R4-MUTANT-HOOK.mjs', import.meta.url).href,...args],
    {cwd:root,env:{...process.env,D2_R4_MUTATION:configPath},encoding:'utf8',timeout:60000,maxBuffer:16*1024*1024});
  const redLog=(red.stdout||'')+'\n'+(red.stderr||'');
  fs.writeFileSync(path.join(dir,config.id+'-red.tap'),redLog);
  const assertionFailures=(redLog.match(/code: 'ERR_ASSERTION'/g)||[]).length;
  const otherCodes=[...redLog.matchAll(/code: '([^']+)'/g)].map(m=>m[1]).filter(c=>c!=='ERR_ASSERTION');
  const applied=(redLog.match(/D2_MUTATION_APPLIED/g)||[]).length;
  const green=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:16*1024*1024});
  const greenLog=(green.stdout||'')+'\n'+(green.stderr||'');
  fs.writeFileSync(path.join(dir,config.id+'-restored.tap'),greenLog);
  const unchanged = createHash('sha256').update(fs.readFileSync(target,'utf8')).digest('hex')===sha256;
  const pass=Number(greenLog.match(/^# pass (\d+)$/m)?.[1]||0);
  const row={id:config.id,redExit:red.status,applied,assertionFailures,otherCodes,restoreExit:green.status,restorePass:pass,sourceUnchanged:unchanged,
    valid:red.status===1&&applied===1&&assertionFailures>0&&otherCodes.length===0&&green.status===0&&pass>0&&unchanged};
  summary.push(row);fs.writeFileSync(path.join(dir,'summary-'+(process.argv[2] || 'all')+'.json'),JSON.stringify(summary,null,2)+'\n');
  console.log(JSON.stringify(row));
  if (!row.valid) break;
}
if(summary.some(r=>!r.valid)) process.exitCode=1;
