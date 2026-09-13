import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = process.cwd(), head = 'cc6a1315003adc7f3f96d635980cfdf32b5a7a74';
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const deny = /^(ledger\/|src\/history\.js$|rebuild\/(conform\/private\/|soak\/|engine\/(seed|index|migrate|merge)\.cjs$|m4\/workout\/engine-runtime\.cjs$|lanes\/b\/BUILD-B1B2-TOOLING-154-184\.md$))/;
function read(rel) {
  assert(!deny.test(rel) && !rel.startsWith('../') && !path.isAbsolute(rel), 'UNLICENSED_BEFORE_READ ' + rel);
  return fs.readFileSync(path.join(root, rel));
}
assert.equal(git('rev-parse', 'HEAD'), head);
assert.equal(git('status', '--porcelain=v1'), '');
const closure = JSON.parse(read('.tmp/d2-combined-closure.json'));
const build = JSON.parse(read('.tmp/d2-combined-build.json'));
for (const entry of closure.files) assert.equal(hash(read(entry.path)), entry.sha256, entry.path);
for (const entry of build.inventory) assert.equal(hash(read(entry.path)), entry.sha256, entry.path);
for (const entry of build.assetHashes) assert.equal(hash(read('.tmp/w7-today-dist/' + entry.name)), entry.sha256, entry.name);
const today = 'rebuild/m3/w7-preview/today/';
const extra = [
  'package.json', 'package-lock.json', 'rebuild/m3/w6/package.json', 'rebuild/m3/w6/pnpm-lock.yaml',
  'rebuild/m3/w5/package.json', 'rebuild/m3/w5/pnpm-lock.yaml', 'rebuild/m3/w6/cipher-imports.json',
  'rebuild/m4/workout/fonts/SOURCES.json', 'rebuild/m4/workout/fonts/InstrumentSans-Variable.woff2',
  'rebuild/m4/workout/fonts/InstrumentSerif-Regular.woff2',
  'rebuild/m1/approved-2026-09-08/Earned-refinement-A.html',
  'rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html',
  'rebuild/lanes/b/tooling/packages/B-NTC.json', 'rebuild/m3/w6/test/local-today-journey.test.mjs',
  today + 'index.shell.html', today + 'screens.template.html', today + 'preview.css',
  ...fs.readdirSync(path.join(root, today)).filter(p => /\.(cjs|mjs)$/.test(p)).map(p => today + p),
];
const all = [...new Set([...closure.files.map(f => f.path), ...build.inventory.map(f => f.path), ...extra])].sort();
const tracked = new Set(git('ls-files', '--', ...all).split(/\r?\n/));
const identities = all.map(file => {
  const bytes = read(file), sha256 = hash(bytes);
  if (tracked.has(file)) assert.equal(hash(execFileSync('git', ['show', head + ':' + file], { cwd: root })), sha256, file + ' Git/disk');
  return { path: file, bytes: bytes.length, sha256, gitDiskEqual: tracked.has(file) ? true : null };
});
const cRef = 'bfc293573e1010559e0119bdc7ff666e89f740cc';
const cPaths = [
  'rebuild/coach/local-world.mjs', 'rebuild/lanes/c/N2-R4-REPORT.md',
  ...['build.mjs','design.cjs','preview.css','screens.template.html','sleep-check.mjs',
    'sleep-commands.cjs','sleep-host.mjs','sleep-model.cjs','test/sleep.test.mjs',
    'today-app.cjs','today-model.cjs'].map(file => today + file),
];
const bRef = '6c9248e695a4478abdbaae0f9f48395ac56000fa';
const bPaths = ['dates','plan','policy','progression','sleep','today','volume','writers'].map(f => 'rebuild/engine/' + f + '.cjs');
const equality = (reference, paths) => paths.map(file => {
  const actual = read(file), prior = execFileSync('git', ['show', reference + ':' + file], { cwd: root });
  assert(actual.equals(prior), file + ' reference equality');
  return { path: file, sha256: hash(actual), reference, equal: true };
});
const evidenceFiles = ['d2-combined-closure.mjs','d2-combined-closure.json','d2-combined-closure-failed.json',
  'd2-combined-build.mjs','d2-combined-build.json','d2-combined-build.log','d2-combined-browser.log',
  'd2-combined-scoped.tap','d2-r4-completed-night.test.mjs','d2-r5-effective.test.mjs',
  'd2-r5-boundaries.test.mjs','d2-r6-overrides.test.mjs','d2-combined-consumers.test.mjs',
  'd2-combined-consumers.tap','d2-combined-consumers-initial.test.mjs','d2-combined-consumers-initial.tap',
  'd2-combined-consumers-render-start.test.mjs','d2-combined-consumers-render-start.tap',
  'd2-combined-root-install.log','d2-combined-w6-install.log','d2-combined-w5-install.log'];
const files = evidenceFiles.map(name => { const bytes = read('.tmp/' + name); return { path: '.tmp/' + name, bytes: bytes.length, sha256: hash(bytes) }; });
const count = (name, expected) => {
  const text = read('.tmp/' + name).toString();
  const fields = Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(k => [k, Number(text.match(new RegExp('^# ' + k + ' (\\d+)', 'm'))[1])]));
  assert.deepEqual(fields, expected);
  return { log: name, ...fields, testsByName: [...text.matchAll(/^(ok|not ok) \d+ - (.+)$/gm)].map(m => ({ name: m[2], outcome: m[1] })) };
};
const passing = n => ({ tests:n, pass:n, fail:0, cancelled:0, skipped:0, todo:0 });
const initial = { tests:7, pass:1, fail:6, cancelled:0, skipped:0, todo:0 };
const result = {
  reviewer:'Lane D2', candidate:head, parent:git('rev-parse','HEAD^'), root,
  authority:{ dispatch:'5910104006b8fc282e2b18e681d6360c2702deb2', decisions:236 },
  runtime:{node:process.version,platform:process.platform,tz:process.env.TZ,resolvedTz:Intl.DateTimeFormat().resolvedOptions().timeZone,
    nodeOptionsAbsent:!process.env.NODE_OPTIONS,coverageAbsent:!process.env.NODE_V8_COVERAGE,temp:process.env.TEMP,tmp:process.env.TMP},
  custody:{headClean:true, candidateNotPushed:true, builderFinalReportRead:false, noProtectedExecution:true,
    cPostImages:equality(cRef,cPaths), bRuntime:equality(bRef,bPaths),sourceAndAssetIdentities:identities},
  closure:{moduleInputs:closure.files.length,beforeReadDenied:closure.beforeReadDenied,warnings:closure.warnings,
    lateBoundPackage:'playwright-core from fresh own locked W6 dependency tree via createRequire',
    unusedReader:'design.headlineVocabulary scans engine root if invoked; no invocation in the executed N2 graph',
    nonModuleReadPaths:extra,annotation:'Extra paths include conservative public Today source-scan superset. B-NTC profile and local-today-journey are read as text, not executed. Static esbuild analysis executes no product module.'},
  scoped:count('d2-combined-scoped.tap',passing(98)), consumers:count('d2-combined-consumers.tap',passing(7)),
  retainedFailedAttempts:[
    { ...count('d2-combined-consumers-initial.tap',initial), attribution:'D2 overbroad raw model JSON scan reached unrendered clean-init body-composition NaN strings; scoped rendered N2 consumers are checked in final witness. Not a mutation kill or newly demonstrated N2 regression.' },
    { ...count('d2-combined-consumers-render-start.tap',initial), attribution:'D2 incorrectly expected entering workout to append nothing; actual gym-app.mjs Start deliberately appends one session-start/outbox. Final checks assert read-only equality before entry and exactly one Start afterwards. Not a product defect or mutation kill.' },
  ],
  build:{...build}, browser:{pass:true,kills:7,clockTimeAndHours:true,offline:true,beforeCommit:true,afterCommitBeforeAck:true,correction:true,provenance:true,recoveryDraft:true,gymReturn:true,rollover:true,widths:[390,320,375],minInputPx:48,minTextPx:16,persistentDoubledText:true,focusTabReachability:true,noHorizontalOverflow:true,noOffOrigin:true},
  observations:['Initial static analysis rejected browser-side /app.js as unresolved; analyzer alone classified that exact importer as external. No denied module was read.',
    'D2 initially split dispatch R6c9248e marker incorrectly; actual R commit6c9248e was resolved locally and all eight runtime blobs compared successfully.',
    'No source mutations were run on this combined candidate. Original R4/R5/R6 controls are copied unchanged; prior mutation evidence remains historical.'],
  files, rawLogs:'Retained only in this owned review tree .tmp; hashes and counts published, no raw terminal copied into shared reports.',
};
assert.equal(result.runtime.node,'v22.23.2'); assert.equal(result.runtime.resolvedTz,'America/New_York');
assert(result.runtime.nodeOptionsAbsent && result.runtime.coverageAbsent);
fs.writeFileSync('.tmp/N2-B1B2-EVIDENCE.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({head,scoped:98,consumer:7,sourceIdentities:identities.length,tracked:identities.filter(f=>f.gitDiskEqual).length,cPostImages:cPaths.length,bRuntime:bPaths.length,build:build.buildTag,sha256:hash(fs.readFileSync('.tmp/N2-B1B2-EVIDENCE.json'))}));
