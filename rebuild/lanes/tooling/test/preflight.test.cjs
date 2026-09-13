'use strict';
// BUILDER PREFLIGHT — DECISIONS:135 (3), each of the six checks measured RED and GREEN in a
// Git repository this test builds. The preflight is run as a real child process, because
// what :135 (3) buys is a ONE-LINE terminal a builder pastes, and a terminal is only real
// if it is the process's own stdout and exit code.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const sourceRoot = path.resolve(__dirname, '../../../..');
const toolRel = 'rebuild/lanes/tooling/preflight.cjs';
const source = fs.readFileSync(path.join(sourceRoot, toolRel), 'utf8');
assert(source.split(/\r?\n/).length <= 200, 'the preflight stays under 200 lines');
const scratchRoot = path.join(sourceRoot, '.tmp');
fs.mkdirSync(scratchRoot, { recursive: true });
const scratch = fs.mkdtempSync(path.join(scratchRoot, 'earned-preflight-'));
const helperRel = 'rebuild/lanes/tooling/preflight-dash-scan.cjs';
const helperSource = fs.readFileSync(path.join(sourceRoot, helperRel), 'utf8');
assert(helperSource.split(/\r?\n/).length <= 220, 'the lexical helper stays bounded');
const mutation = process.env.PREFLIGHT_SCANNER_MUTANT;
const mutationCases = Object.fromEntries(['js-line','js-block','regex','html-comment','css-comment'].map(kind =>
  [kind, { from: kind === 'html-comment' ? "omit(i, stop + 3, 'html-comment')" :
    kind === 'regex' ? "omit(at, i, 'regex')" : "omit(at, i, '" + kind + "')", to: 'void 0',
    pattern: '^200 lexical exemption: ' + kind + '$' }]));
mutationCases['strings-are-comments'] = { from: 'string(c); expression = false;',
  to: "string(c); omit(at, i, 'js-block'); expression = false;",
  pattern: '^200 visible dash: js-comment-looking-string$' };
mutationCases['syntax-check-ignored'] = {
  from: "if (checked.error || checked.status !== 0) fail('invalid or unsupported JavaScript syntax', start);",
  to: 'void checked;', pattern: '^200 unknown or unterminated syntax fails explicitly instead of creating an exemption$' };
let fixtureHelper = helperSource;
if (mutation) {
  assert(Object.hasOwn(mutationCases, mutation), 'closed mutation list');
  const { from, to } = mutationCases[mutation];
  assert.equal(fixtureHelper.split(from).length - 1, 1, 'exact mutation anchor');
  fixtureHelper = fixtureHelper.replace(from, to);
}
function write(file, text) {
  const target = path.join(scratch, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return text;
}
const git = (...argv) => cp.execFileSync('git', argv, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const REPORT = 'rebuild/lanes/b/BUILD-REPORT-FIXTURE.md';
const STATUS = 'rebuild/lanes/b/STATUS.md';
const UI = 'rebuild/m3/w7-preview/today/screens.template.html';
const goodReport = ['# BUILD REPORT', 'Suites: 9/9 green.', 'Terminals unchanged.', ''].join('\n');
const goodStatus = ['# STATUS', 'STATUS lane B - r7 tooling - suites green - PR-READY', ''].join('\n');

write(toolRel, source);
write(helperRel, fixtureHelper);
write('.gitignore', '.tmp/\n');
write(REPORT, goodReport);
write(STATUS, goodStatus);
write(UI, '<p>a clean hyphen-only line</p>\n');
write('rebuild/DECISIONS.md', '- 2026-09-12 · cowork · the chain\n');
git('init', '--quiet', '-b', 'chain');
git('config', 'user.email', 'tooling7@earned.local');
git('config', 'user.name', 'lane-b-tooling7');
git('add', '-A'); git('commit', '--quiet', '-m', 'chain base');
// The tool resolves CHAIN_REF as a remote-tracking ref, so the fixture makes one.
fs.mkdirSync(path.join(scratch, '.git/refs/remotes/origin/rebuild'), { recursive: true });
fs.writeFileSync(path.join(scratch, '.git/refs/remotes/origin/rebuild/t2-client-core'), git('rev-parse', 'HEAD').trim() + '\n');
git('checkout', '--quiet', '-b', 'lane');
write(REPORT, goodReport + 'one more disclosed line.\n');
git('add', '-A'); git('commit', '--quiet', '-m', 'lane work inside custody');

test.after(() => {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(scratchRoot));
  assert(path.basename(resolved).startsWith('earned-preflight-'));
  fs.rmSync(resolved, { recursive: true, force: true });
});

function run(extra = [], executable = path.join(scratch, toolRel)) {
  const argv = ['--custody', 'rebuild/lanes/b/,rebuild/m3/w7-preview/today/', '--report', REPORT,
    '--status-line', STATUS, ...extra];
  const r = cp.spawnSync(process.execPath, [executable, ...argv],
    { cwd: scratch, encoding: 'utf8' });
  const lines = r.stdout.split(/\r?\n/).filter(Boolean);
  assert.equal(lines.length, 1, 'exactly one line on stdout, got ' + JSON.stringify(r.stdout));
  return { line: lines[0], code: r.status, stderr: r.stderr };
}
const GREEN = ['--ci-run', '18443120077'];

test(':135 (3) — the whole preflight green is ONE PASS line carrying the head sha', () => {
  const r = run(GREEN);
  assert.equal(r.code, 0);
  assert.equal(r.line, 'PREFLIGHT PASS ' + git('rev-parse', 'HEAD').trim());
});

const SOURCE_REF = '2b9b09a564531d415df847cd668ea357233687b2';
const BASE_REF = '0e652ce213b56cd5d73a670e0a761cca8c94b6c3';
const realPaths = ['build.mjs', 'gym-app.mjs', 'plain-copy.cjs'].map(f => 'rebuild/m3/w7-preview/today/' + f);
function blob(ref, file) {
  assert([SOURCE_REF, BASE_REF].includes(ref));
  assert([...realPaths, toolRel].includes(file), 'public blob read-list is closed');
  return cp.execFileSync('git', ['show', ref + ':' + file], { cwd: sourceRoot, encoding: 'utf8' });
}
const rawHits = text => text.split(/\r?\n/).filter(line => /[\u2013\u2014]/u.test(line));
test('200 real C candidate: frozen 26-hit refusal becomes CI-UNVERIFIED with all three files declared', () => {
  try {
    for (const [i, file] of realPaths.entries()) {
      const text = blob(SOURCE_REF, file), base = blob(BASE_REF, file);
      assert.equal(rawHits(text).length, [8, 7, 11][i]);
      assert.deepEqual(rawHits(text), rawHits(base), 'all offending lines already exist on the pinned integration base');
      write(file, text);
    }
    const frozen = path.join(scratch, '.tmp/preflight-frozen.cjs');
    write('.tmp/preflight-frozen.cjs', blob(BASE_REF, toolRel));
    const ui = ['--ui-custody', realPaths.join(',')];
    const before = run(ui, frozen);
    assert.equal(before.line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
    assert.match(before.stderr, /26 line\(s\)/);
    const after = run(ui);
    assert.equal(after.line, 'PREFLIGHT FAIL CI-UNVERIFIED');
    assert.equal(after.code, 1, 'correcting the scan does not invent verified CI');
    assert.match(after.stderr, /lexical exemptions: comments 20, regex 6/);
  } finally { for (const file of realPaths) fs.rmSync(path.join(scratch, file), { force: true }); }
});

function scanCase(extension, text) {
  const file = 'rebuild/m3/w7-preview/today/lexical-fixture.' + extension;
  try { write(file, text); return run(['--ui-custody', file]); }
  finally { fs.rmSync(path.join(scratch, file), { force: true }); }
}
const positive = {
  'js-line': ['mjs', '// — quoted " and /regex/ are still comment\nconst x = 1;'],
  'js-block': ['cjs', '/* — " \' // / */ const x = 1;'],
  regex: ['mjs', 'const x = /[—/]/g; const y = /a\\/—[\\]–]/; if (x) /—/.test("x");'],
  'html-comment': ['html', '<!-- — <p title="—"> --> <p>Clean</p>'],
  'css-comment': ['css', '/* — " */ p { color: red; /* – */ }']
};
for (const [kind, [extension, text]] of Object.entries(positive)) {
  test('200 lexical exemption: ' + kind, () => {
    const result = scanCase(extension, text);
    assert.equal(result.line, 'PREFLIGHT FAIL CI-UNVERIFIED', kind + ' does not contain visible dash text');
  });
}

const negatives = {
  'js-comment-looking-string': ['mjs', 'const x = "// —";'],
  'js-block-looking-string': ['cjs', 'const x = "/* — */";'],
  'regex-looking-string': ['mjs', 'const x = "/[—]/g";'],
  'escaped-quote': ['mjs', 'const x = "a\\\"/* — */";'],
  division: ['mjs', 'const a=1; const x=a / "—" / 2;'],
  'postfix-division': ['mjs', 'let a=1; const x=a++ / "—" / 2;'],
  'property-keyword-division': ['mjs', 'const x = obj.return / "—" / 2;'],
  'same-line-comment-and-string': ['mjs', '/* allowed — */ const x="—";'],
  'unicode-line-terminator': ['mjs', '// comment\u2028const x="—";'],
  'unicode-paragraph-terminator': ['mjs', '// comment\u2029const x="—";'],
  template: ['mjs', 'const x = `// — /* – */`;'],
  'template-interpolation': ['mjs', 'const x = `${"—"}`;'],
  'nested-template': ['mjs', 'const x = `a ${`—`} b`;'],
  'template-boundary': ['mjs', 'const x = `safe ${/—/.test("x")} —`;'],
  'html-text': ['html', '<p>—</p>'],
  'html-attribute': ['html', '<p title="<!-- — -->">clean</p>'],
  'html-textarea': ['html', '<textarea><!-- — --></textarea>'],
  'html-title': ['html', '<title><!-- — --></title>'],
  'html-script-string': ['html', '<script>const x="/* — */";</script>'],
  'html-style-string': ['html', '<style>p{content:"/* — */"}</style>'],
  'css-content': ['css', 'p { content: "/* — */"; }'],
  'css-regex-looking-string': ['css', 'p { content: "/—/"; }'],
  'css-url': ['css', 'p { background: url(https://example.invalid/—/*data*/); }']
};
for (const [name, [extension, text]] of Object.entries(negatives)) test('200 visible dash: ' + name, () => {
  const r = scanCase(extension, text);
  assert.equal(r.line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH', name + ' remains checked');
  assert.equal(r.code, 1);
});
const unsupported = [
  ['mjs', 'const x = ; /* — */'],
  ['mjs', '/* —'], ['mjs', 'const s="—'], ['mjs', 'const s=`a ${1;'],
  ['mjs', 'const r=/[—/;'], ['mjs', 'const r=/[—]/v;'], ['mjs', 'const n={} / "—" /2;'],
  ['cjs', 'const await=1; await / "—" /2;'],
  ['html', '<!-- —'], ['html', '<!-->—-->'], ['html', '<!-- x --!><p>—</p> -->'],
  ['html', '<p title="—>'], ['html', '<script>/* —'], ['html', '<![CDATA[—]]>'],
  ['css', '/* —'], ['css', 'p{content:"—\n"}'], ['css', 'p{background:u\\72l(/*—*/)}'],
  ['css', 'p{background:url(/*—*/}'], ['css', 'p { /* — */'], ['jsx', '<p>—</p>']
];
test('200 unknown or unterminated syntax fails explicitly instead of creating an exemption', () => {
  for (const [extension, text] of unsupported) assert.equal(scanCase(extension, text).line,
    'PREFLIGHT FAIL UI-CUSTODY-SYNTAX', extension + ' unsupported input');
});
test('200 recursive template and embedded HTML language boundaries preserve allowed syntax', () => {
  for (const [extension, text] of [
    ['mjs', 'const x = `clean ${/* — */ /[–]/.test("x")} text`;'],
    ['html', '<script>/* — */ const x=/—/;</script><style>/* — */ p{color:red}</style>'],
    ['css', 'p{color:red}'], ['mjs', 'const x=1/2; x.toString();']
  ]) assert.equal(scanCase(extension, text).line, 'PREFLIGHT FAIL CI-UNVERIFIED');
});

test('200 HTML text end tags with attributes or solidus refuse before comment exemptions', () => {
  for (const name of ['style', 'script', 'textarea', 'title']) {
    for (const ending of [' data-x>', '/>', ' / >', '\tdata-x="x">', '\n/>']) {
      const text = '<' + name + '>/* comment </' + name + ending + '<p>—</p> */</' + name + '>';
      const result = scanCase('html', text);
      assert.equal(result.line, 'PREFLIGHT FAIL UI-CUSTODY-SYNTAX', name + JSON.stringify(ending));
      assert.equal(result.code, 1);
    }
  }
});

test('200 canonical HTML text boundaries keep comments bounded and visible copy checked', () => {
  for (const name of ['style', 'script']) {
    const start = '<' + name + '>/* allowed —; misleading </' + name + 'x> */';
    const close = '</' + name.toUpperCase() + ' \t\r\n\f>';
    assert.equal(scanCase('html', start + close + '<p>clean</p>').line, 'PREFLIGHT FAIL CI-UNVERIFIED');
    assert.equal(scanCase('html', start + close + '<p>—</p>').line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
  }
});
test('200 JavaScript is syntax checked without evaluating candidate statements', () => {
  assert.equal(scanCase('mjs', '/* — */ throw new Error("candidate source must never run");').line,
    'PREFLIGHT FAIL CI-UNVERIFIED');
});
test('200 tracked JS template HTML attribute and CSS content still refuse', () => {
  for (const [extension, text] of [['mjs','const s="—";'], ['js','const s=`—`;'],
    ['html','<p title="—">clean</p>'], ['css','p{content:"—"}']]) {
    const file = 'rebuild/m3/w7-preview/today/tracked-fixture.' + extension;
    write(file, text); git('add', '--', file); git('commit', '--quiet', '-m', 'synthetic tracked dash');
    try { assert.equal(run(['--ui-custody', file]).line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'); }
    finally { git('reset', '--quiet', '--hard', 'HEAD~1'); }
  }
});
test('200 each exemption mutation fails its actual child-process assertion and restores its control', () => {
  assert.equal(mutation, undefined, 'mutation runner itself is never selected recursively');
  for (const [name, spec] of Object.entries(mutationCases)) {
    const childEnv = { ...process.env, PREFLIGHT_SCANNER_MUTANT: name };
    delete childEnv.NODE_TEST_CONTEXT; // A separate test process, not Node's suppressed nested runner.
    const result = cp.spawnSync(process.execPath, ['--test','--test-reporter=tap','--test-name-pattern='+spec.pattern,__filename],
      { cwd:sourceRoot, encoding:'utf8', timeout:30000, env:childEnv });
    fs.writeFileSync(path.join(scratchRoot,'preflight-mutant-'+name+'.tap'), result.stdout+result.stderr);
    assert.equal(result.status, 1, name+' must fail');
    assert.match(result.stdout, /code: 'ERR_ASSERTION'/);
    assert.match(result.stdout, /^# fail 1$/m);
    assert.match(result.stdout, /^# tests 1$/m);
    assert.doesNotMatch(result.stdout+result.stderr, /SyntaxError|ReferenceError|MODULE_NOT_FOUND/);
    const allowed = positive[name] || (name === 'syntax-check-ignored' && positive['js-line']);
    const [extension, text] = allowed || negatives['js-comment-looking-string'];
    assert.equal(scanCase(extension,text).line, allowed ? 'PREFLIGHT FAIL CI-UNVERIFIED' : 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
  }
  assert.equal(fs.readFileSync(path.join(sourceRoot,helperRel),'utf8'),helperSource);
});

test(':135 (3) — a change outside custody fails, committed or merely sitting there', () => {
  write('rebuild/engine/plan.cjs', 'console.log("outside every custody glob");\n');
  const untracked = run(GREEN);
  assert.equal(untracked.code, 1);
  assert.equal(untracked.line, 'PREFLIGHT FAIL DIFF-OUTSIDE-CUSTODY');
  assert.match(untracked.stderr, /rebuild\/engine\/plan\.cjs/);
  git('add', '-A'); git('commit', '--quiet', '-m', 'a change outside custody');
  assert.equal(run(GREEN).line, 'PREFLIGHT FAIL DIFF-OUTSIDE-CUSTODY');
  git('reset', '--quiet', '--hard', 'HEAD~1');
  fs.rmSync(path.join(scratch, 'rebuild/engine/plan.cjs'), { force: true });
  assert.equal(run(GREEN).code, 0);
});

test(':135 (3) — a report over 60 lines fails, and 60 exactly passes', () => {
  const sixty = ['# BUILD REPORT', 'Suites: 9/9 green.'].concat(Array.from({ length: 58 }, (_, i) => 'line ' + i)).join('\n') + '\n';
  assert.equal(sixty.split('\n').filter(Boolean).length, 60);
  write(REPORT, sixty);
  assert.equal(run(GREEN).code, 0, 'sixty lines is inside the bound');
  write(REPORT, sixty + 'the sixty-first line\n');
  const r = run(GREEN);
  assert.equal(r.line, 'PREFLIGHT FAIL REPORT-TOO-LONG');
  assert.match(r.stderr, /61 lines, max 60/);
  write(REPORT, goodReport);
});

test(':135 (3) — a report with no counts fails; "n/n" or "pass n" satisfies it', () => {
  write(REPORT, '# BUILD REPORT\nthe suites are green and everything is fine.\n');
  assert.equal(run(GREEN).line, 'PREFLIGHT FAIL REPORT-COUNTS-MISSING');
  write(REPORT, '# BUILD REPORT\nthe suites are green: pass 25, fail 0.\n');
  assert.equal(run(GREEN).code, 0);
  write(REPORT, '# BUILD REPORT\nthe suites are green: 25/25.\n');
  assert.equal(run(GREEN).code, 0);
  write(REPORT, goodReport);
});

test(':135 (3) — a STATUS line over 400 characters fails, counted in code points', () => {
  write(STATUS, '# STATUS\n' + 'x'.repeat(400) + '\n');
  assert.equal(run(GREEN).code, 0, '400 is inside the bound');
  write(STATUS, '# STATUS\n' + 'x'.repeat(401) + '\n');
  const r = run(GREEN);
  assert.equal(r.line, 'PREFLIGHT FAIL STATUS-LINE-TOO-LONG');
  assert.match(r.stderr, /401 characters, max 400/);
  // An em dash is ONE character, not three bytes: the bound is about what a reader sees.
  write(STATUS, '# STATUS\n' + '—'.repeat(400) + '\n');
  assert.equal(run(GREEN).code, 0);
  write(STATUS, goodStatus);
});

test(':135 (3) — U+2013 and U+2014 in UI custody fail; outside it they are not asked', () => {
  const ui = ['--ui-custody', 'rebuild/m3/w7-preview/today/*.html'];
  assert.equal(run([...GREEN, ...ui]).code, 0);
  for (const dash of ['–', '—']) {
    write(UI, '<p>a line with an ' + dash + ' in it</p>\n');
    git('add', '-A'); git('commit', '--quiet', '-m', 'a dash in the UI');
    const r = run([...GREEN, ...ui]);
    assert.equal(r.line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
    assert.match(r.stderr, /screens\.template\.html:1/);
    // The SAME bytes with no --ui-custody declared are not a failure, and the summary says
    // the check did not run rather than reading as if it had.
    const quiet = run(GREEN);
    assert.equal(quiet.code, 0);
    assert.match(quiet.stderr, /UI custody not declared/);
  }
  write(UI, '<p>a clean hyphen-only line</p>\n');
  git('add', '-A'); git('commit', '--quiet', '-m', 'the dash removed');
  assert.equal(run([...GREEN, ...ui]).code, 0);
});

test('r8 — the UI dash check scans UNTRACKED files too, as check (1) already did', () => {
  // r8 change 5, measured: an em dash in a screen template not yet committed read as
  // PREFLIGHT PASS, while the custody diff counted the same untracked file. The two checks
  // now scan the same set — `git ls-files` plus `--others --exclude-standard`.
  const ui = ['--ui-custody', 'rebuild/m3/w7-preview/today/*.html'];
  const fresh = 'rebuild/m3/w7-preview/today/screens.fresh.html';
  write(fresh, '<p>an untracked line with an — in it</p>\n');
  const r = run([...GREEN, ...ui]);
  assert.equal(r.line, 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH');
  assert.match(r.stderr, /screens\.fresh\.html:1/);
  // Clean bytes in the same untracked file pass, so this is the dash and not the file.
  write(fresh, '<p>an untracked line with a hyphen - in it</p>\n');
  assert.equal(run([...GREEN, ...ui]).code, 0);
  fs.rmSync(path.join(scratch, fresh));
});

test(':135 (3) — CI is UNVERIFIED without --ci-run, and the exact command is printed', () => {
  const r = run();
  assert.equal(r.code, 1);
  assert.equal(r.line, 'PREFLIGHT FAIL CI-UNVERIFIED');
  // The command and the URL the builder must look at, at the EXACT head sha.
  const head = git('rev-parse', 'HEAD').trim();
  assert.match(r.stderr, new RegExp('gh run list --repo .+ --commit ' + head));
  assert.match(r.stderr, new RegExp('https://github\\.com/.+/commits/' + head));
  // And the id is recorded, never verified — the tool says so in its own words.
  const green = run(GREEN);
  assert.match(green.stderr, /CI run id 18443120077 recorded/);
  assert.match(green.stderr, /did NOT verify it/);
  assert.equal(run(['--ci-run', 'not a valid id']).line, 'PREFLIGHT FAIL CI-RUN-ID-SHAPE');
});

test(':135 (3) — usage is closed: missing, unknown and valueless arguments all refuse', () => {
  const bare = cp.spawnSync(process.execPath, [path.join(scratch, toolRel)], { cwd: scratch, encoding: 'utf8' });
  assert.equal(bare.stdout.trim(), 'PREFLIGHT FAIL USAGE');
  assert.equal(bare.status, 1);
  const unknown = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', 'a/', '--danger', 'x'],
    { cwd: scratch, encoding: 'utf8' });
  assert.equal(unknown.stdout.trim(), 'PREFLIGHT FAIL USAGE');
  const valueless = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', '--report'],
    { cwd: scratch, encoding: 'utf8' });
  assert.equal(valueless.stdout.trim(), 'PREFLIGHT FAIL USAGE');
  // A REPEATED argument refuses rather than quietly taking the first — a second --report is
  // a builder pointing the preflight at a file it is not measuring.
  assert.equal(run([...GREEN, '--report', REPORT]).line, 'PREFLIGHT FAIL USAGE');
  // A named file that does not exist is its own refusal, not a crash.
  const missing = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', 'rebuild/lanes/b/',
    '--report', 'rebuild/lanes/b/NOT-WRITTEN.md', '--status-line', STATUS, ...GREEN], { cwd: scratch, encoding: 'utf8' });
  assert.equal(missing.stdout.trim(), 'PREFLIGHT FAIL REPORT-MISSING');
  const noStatus = cp.spawnSync(process.execPath, [path.join(scratch, toolRel), '--custody', 'rebuild/lanes/b/',
    '--report', REPORT, '--status-line', 'rebuild/lanes/b/NO-STATUS.md', ...GREEN], { cwd: scratch, encoding: 'utf8' });
  assert.equal(noStatus.stdout.trim(), 'PREFLIGHT FAIL STATUS-LINE-MISSING');
});
