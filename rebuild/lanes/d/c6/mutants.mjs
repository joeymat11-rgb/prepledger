import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const source = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(source, '../../../..');
const temp = path.join(root, '.tmp'); fs.mkdirSync(temp, { recursive: true });
const run = fs.mkdtempSync(path.join(temp, 'c6-mutants-'));
const files = ['admission.mjs','protocol.mjs','provider.mjs','worker.mjs','wire/examples.json','test/support.mjs','test/admission.test.mjs','test/protocol.test.mjs','test/provider.test.mjs'];
const changes = [
  ['trust-claimed-user','admission.mjs','const user = await principal(request, this.env);','const user = input.user;'],
  ['skip-cap','admission.mjs','if (!capReady(this.env, now))','if (false)'],
  ['skip-companion','admission.mjs',"if (!exact(review, ['artifact_sha','policy_sha','reviewed'])", "if (false && !exact(review, ['artifact_sha','policy_sha','reviewed'])"],
  ['skip-replay','admission.mjs','if (await tx.get(key))', 'if (false)'],
  ['raise-session-cap','admission.mjs','export const SESSION_MINUTES = 10;','export const SESSION_MINUTES = 11;'],
  ['persist-raw-nonce','admission.mjs',"await digest(user + ':' + nonce)",'nonce'],
  ['extend-retention','admission.mjs',"if (key.startsWith('session:')) return row.deadline + DAY;", "if (key.startsWith('session:')) return row.deadline + 10 * DAY;"],
  ['provider-storage-on','provider.mjs',"model: 'gpt-live-1', store: false,", "model: 'gpt-live-1', store: true,"],
  ['provider-model-switch','provider.mjs',"model: 'gpt-live-1', store: false,", "model: 'synthetic-wrong-model', store: false,"],
];
const outcomes = [];
for (const [name, file, from, to] of [['noop'], ...changes]) {
  const dir = path.join(run, name); fs.mkdirSync(path.join(dir,'test'), { recursive:true });
  fs.mkdirSync(path.join(dir,'wire'), { recursive:true });
  for (const f of files) {
    let text = fs.readFileSync(path.join(source,f),'utf8');
    if (f === 'test/provider.test.mjs') for (const n of ['tools','wave1-tools'])
      text = text.replace("'../../../../coach/" + n + ".cjs'", JSON.stringify(path.join(root,'rebuild/coach', n + '.cjs')));
    if (f === file) {
      if (text.split(from).length !== 2) throw Error('Mutation anchor drift: ' + name);
      text = text.replace(from,to);
    }
    fs.writeFileSync(path.join(dir,f),text);
  }
  if (file && spawnSync(process.execPath,['--check',path.join(dir,file)],{encoding:'utf8'}).status !== 0) throw Error('Invalid mutant syntax: ' + name);
  const result = spawnSync(process.execPath, ['--test','--test-reporter=tap', ...['admission','protocol','provider'].map(n=>path.join(dir,'test',n+'.test.mjs'))], { cwd:root, encoding:'utf8' });
  const output = result.stdout + result.stderr; fs.writeFileSync(path.join(dir,'result.tap'),output);
  const assertions = (output.match(/code: 'ERR_ASSERTION'/g) || []).length;
  const ok = name === 'noop' ? result.status === 0 : result.status !== 0 && assertions > 0;
  outcomes.push({ name, ok, assertions });
}
fs.writeFileSync(path.join(run,'summary.json'),JSON.stringify(outcomes,null,2));
console.log(JSON.stringify({ killed:outcomes.slice(1).filter(x=>x.ok).length, total:changes.length, control:outcomes[0].ok, report:path.relative(root,path.join(run,'summary.json')) }));
if (outcomes.some(x=>!x.ok)) process.exitCode = 1;
