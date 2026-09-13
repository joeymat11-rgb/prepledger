'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = process.cwd();
const scratchRoot = path.join(root, '.tmp');
fs.mkdirSync(scratchRoot, { recursive: true });
const scratch = fs.mkdtempSync(path.join(scratchRoot, 'd2-preflight-boundaries-'));
const tool = 'rebuild/lanes/tooling/preflight.cjs';
const helper = 'rebuild/lanes/tooling/preflight-dash-scan.cjs';
const write = (name, value) => { const file = path.join(scratch, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
const git = (...args) => cp.execFileSync('git', args, { cwd: scratch, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const cases = [
  ['clean', 'mjs', 'const x = 1;', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['allowed-js-comments', 'cjs', '/* — */\nconst x=1; // –', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['allowed-regex-class', 'mjs', 'const x = /[—/]/; const y = /a\\/–/;', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['comment-looking-string', 'mjs', 'const x = "/* — */";', 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'],
  ['nested-template', 'mjs', 'const x = `safe ${/—/.test("x")} ${`—`} end`;', 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'],
  ['unsupported-js', 'mjs', 'const x = ; /* — */', 'PREFLIGHT FAIL UI-CUSTODY-SYNTAX'],
  ['html-attribute', 'html', '<p title="<!-- — -->">clean</p>', 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'],
  ['css-string', 'css', 'p { content: "/* — */"; }', 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'],
  ['allowed-html-comment', 'html', '<!-- — --><p>clean</p>', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['allowed-css-comment', 'css', '/* — */ p { color: red; }', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['script-closing-attribute', 'html', '<script>/* comment </script data-x><p>—</p> */</script>', 'PREFLIGHT FAIL UI-CUSTODY-SYNTAX'],
  ['style-closing-attribute', 'html', '<style>/* comment </style data-x><p>—</p> */</style>', 'PREFLIGHT FAIL UI-CUSTODY-SYNTAX'],
  ['style-closing-solidus', 'html', '<style>/* comment </style/><p>—</p> */</style>', 'PREFLIGHT FAIL UI-CUSTODY-SYNTAX'],
  ['style-canonical-clean', 'html', '<style>/* — </stylex> */</STYLE \t\r\n\f><p>clean</p>', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['style-canonical-visible', 'html', '<style>/* — </stylex> */</STYLE \t\r\n\f><p>—</p>', 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'],
  ['script-canonical-clean', 'html', '<script>/* — </scriptx> */</SCRIPT \t\r\n\f><p>clean</p>', 'PREFLIGHT FAIL CI-UNVERIFIED'],
  ['script-canonical-visible', 'html', '<script>/* — </scriptx> */</SCRIPT \t\r\n\f><p>—</p>', 'PREFLIGHT FAIL UI-CUSTODY-EN-OR-EM-DASH'],
];
const outcomes = [];
try {
  write(tool, fs.readFileSync(path.join(root, tool)));
  write(helper, fs.readFileSync(path.join(root, helper)));
  write('report.md', 'Public fixture checks: 1/1.\n');
  write('status.txt', 'D2 synthetic fixture only\n');
  write('ui/fixture.html', '<p>clean</p>');
  git('init', '--quiet', '-b', 'base');
  git('config', 'user.name', 'D2 synthetic reviewer'); git('config', 'user.email', 'd2@earned.local');
  git('add', '--', '.'); git('commit', '--quiet', '-m', 'public fixture');
  git('update-ref', 'refs/remotes/origin/rebuild/t2-client-core', git('rev-parse', 'HEAD').trim());
  for (const [name, extension, source, expected] of cases) {
    const file = 'ui/case.' + extension; write(file, source);
    const r = cp.spawnSync(process.execPath, [tool, '--custody', 'ui/,report.md,status.txt,rebuild/lanes/tooling/',
      '--report', 'report.md', '--status-line', 'status.txt', '--ui-custody', file],
    { cwd: scratch, encoding: 'utf8', timeout: 15000, windowsHide: true });
    const line = r.stdout.trim(); assert.equal(r.status, 1); assert.equal(line.split(/\r?\n/).length, 1);
    assert.equal(line, expected, name);
    outcomes.push({ name, expected, actual: line });
    fs.unlinkSync(path.join(scratch, file));
  }
  assert.equal(outcomes.length, 17);
  console.log(JSON.stringify({ case: 'D2-PREFLIGHT-R2-BOUNDARIES', controls: outcomes.length, passed: outcomes.length, outcomes }));
} finally {
  const resolved = fs.realpathSync(scratch);
  assert.equal(path.dirname(resolved), fs.realpathSync(scratchRoot));
  assert(path.basename(resolved).startsWith('d2-preflight-boundaries-'));
  fs.rmSync(resolved, { recursive: true, force: true });
}
