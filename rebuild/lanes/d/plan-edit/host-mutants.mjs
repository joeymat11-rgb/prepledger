// Exact public-host fault injections in scratch modules. No product file changes.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=resolve(fileURLToPath(new URL('../../../..',import.meta.url)));
const host=new URL('../../../m3/w6/host/plan-edit-host.mjs',import.meta.url);
const testFile=fileURLToPath(new URL('./durable-host.test.mjs',import.meta.url));
const original=readFileSync(host,'utf8').replaceAll('\r\n','\n');
const auth='const candidate = bindings.stage(generation,command,args,{ ...integration,\n        historyAuthentication:integration?.historyAuthentication || { signedOperationIds:[] } });';
const cases=[
 ['cached-retry-bypasses-read', '^PE10-retry closed ', [[
  "      if (!entry) return refusal('PLAN_EDIT_REVIEW_REQUIRED');\n      const current = await readVerified();",
  "      if (!entry) return refusal('PLAN_EDIT_REVIEW_REQUIRED');\n      if (entry.result) return copy(entry.result);\n      const current = await readVerified();"]]],
 ['local-auth', '^PE09-auth ', [[auth,'const candidate = bindings.stage(generation,command,args,integration);']]],
 ['cancelled-review', '^PE09 cancel ', [
  ['reviews.get(entry.args.input.intent_id) === entry &&','true &&'],
  ['reviews.get(active.args.input.intent_id) !== active ||','false ||'],
  ['!alive || reviews.get(active.args.input.intent_id) !== active','!alive']]],
 ['final-clock', '^PE14 ', [[
  'return localDay() !== active.authoredDay ? stale() : null;',
  'return null;']]],
 ['unprojectable-commit','^PE09-projection ', [[
  "        if (candidate.result?.acknowledged === true) {\n          try { read(candidate.generation,localDay()); }\n          catch (error) { return { generation,result:refusal(error.code || 'PLAN_EDIT_PROJECTION_REFUSED'),view:null }; }\n        }",
  '        // fault: no validation of the actual pending projection']]],
 // S4 LIVE DAY. A host that dates tomorrow off its own frozen host clock instead
 // of the installation's live athlete-local day is the :437 defect with a day
 // added to it, and the new PE15 cells must kill exactly that.
 ['frozen-host-day','^PE15 tomorrow ', [
  ['const localDay = () => { const day = liveDayOf(); Commands.dateOf(day); return day; };',
   'const localDay = () => { const day = clock.today(); Commands.dateOf(day); return day; };']]],
 // P2/P0-B. A host that lets the caller's declared basis stand without proving
 // it against the generation adopts an unadmitted import as the athlete's plan.
 ['unchecked-basis-source','^PE16 the clean-init state ', [
  ["    const source = Model.importPresentIn(generation) ? 'local-source' : 'first-run';",
   "    const source = 'first-run';"]]]];
mkdirSync(join(root,'.tmp'),{recursive:true});
const out=mkdtempSync(join(root,'.tmp','plan-edit-host-mutants-'));
let killed=0;
for(const [name,pattern,changes] of cases) {
 let source=original;
 for(const [from,to] of changes) {
  assert.equal(source.split(from).length-1,1,name+': anchor');
  source=source.replace(from,to);
 }
 source=source.replace(/from '([^']+)'/g,(match,spec)=>spec.startsWith('.')?"from '"+new URL(spec,host).href+"'":match);
 const mutant=join(out,name+'.mjs');writeFileSync(mutant,source);
 const env={...process.env,PLAN_EDIT_HOST_MODULE:pathToFileURL(mutant).href};
 delete env.PE_HOST_MUTANT;
 const run=spawnSync(process.execPath,['--test','--test-reporter=tap','--test-name-pattern='+pattern,testFile],
  {cwd:root,env,encoding:'utf8',timeout:30000,maxBuffer:1024*1024});
 const log=run.stdout+run.stderr;writeFileSync(join(out,name+'.tap'),log);
 assert.equal(run.error,undefined,name+': execution');
 assert.equal(run.status,1,name+': fail');
 assert(log.includes("code: 'ERR_ASSERTION'"),name+': assertion');
 assert(!/SyntaxError|ReferenceError|ERR_MODULE_NOT_FOUND|PE_MUTANT_ANCHOR_COUNT/.test(log),name+': invalid kill');
 assert.match(log,/^# fail 1$/m,name+': one selected failure');
 killed++;
}
assert.equal(readFileSync(host,'utf8').replaceAll('\r\n','\n'),original);
console.log(killed+'/'+cases.length+' host mutants killed by selected assertions; logs '+out);
