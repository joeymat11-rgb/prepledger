'use strict';
// derive-metrics.test.cjs (rebuild/improve, Phase 1 pass 2: D-DERIVE-1, D-DERIVE-2). Pure node, no dependencies.
// usage: node derive-metrics.test.cjs            (tests ./derive-metrics.cjs)
//        DERIVE_SCRIPT=<path> node derive-metrics.test.cjs   (tests another copy, e.g. the pass-1 script for red-first)
// Runs the script end to end against a fake git: a temp folder holds a copy of the script at
// rebuild/improve/tools/derive-metrics.cjs and one tiny node file per git verb (rev-parse, ls-tree, log, show);
// GIT=<this node> makes the script run "node <verb> ..." in that folder, so no repository is read, written or committed.
// Every review text below is invented; no real review, ticket or measurement is used. Exit 1 on any failed row.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const SCRIPT = path.resolve(process.env.DERIVE_SCRIPT || path.join(__dirname, 'derive-metrics.cjs'));
const D = 'rebuild/lanes/fable/reviews/';
const pre = (n) => Array.from({ length: n }, (_, i) => 'Invented preamble line ' + (i + 1) + ', no verdict word here.');
const FILES = {
  // T1 (D-DERIVE-1): verdict heading at line 14, below the old 12-line window, no other section heading before it.
  [D + 'SYNTH-VERDICT14-l1.md']: ['# SYNTH-VERDICT14-l1: invented review'].concat(pre(12), ['## VERDICT: ACCEPT WITH NAMED DEBTS (D-SYN-1)', '', '## Checks', 'body']),
  // T2: plain verdict at line 2, NOT READY.
  [D + 'SYNTH-NOTREADY-l1.md']: ['# SYNTH-NOTREADY-l1', 'Verdict: NOT READY (fix the invented thing)', '', '## Checks', 'body'],
  // T3: REJECT.
  [D + 'SYNTH-REJECT-l1.md']: ['# SYNTH-REJECT-l1', 'VERDICT: REJECT', '## Checks', 'body'],
  // T4: ACCEPT.
  [D + 'SYNTH-ACCEPT-l2.md']: ['# SYNTH-ACCEPT-l2', 'Verdict: ACCEPT', '## Checks', 'body'],
  // T5: no verdict line at all: class, required_change and debt_ids stay empty (unknown is never zero).
  [D + 'SYNTH-NOVERDICT.md']: ['# SYNTH-NOVERDICT', 'Invented note with no verdict.', '## Notes', 'body'],
  // T6: verdict words outside the vocabulary: class UNKNOWN, required_change empty (never guessed, never 0).
  [D + 'SYNTH-UNKNOWN-l1.md']: ['# SYNTH-UNKNOWN-l1', 'Verdict: ADOPT SMALLER', '## Checks', 'body'],
  // T7: a verdict-shaped line only in the body (after the first non-verdict section heading) is not the header verdict.
  [D + 'SYNTH-BODYONLY-l1.md']: ['# SYNTH-BODYONLY-l1', 'Invented scope line.', '## Checks', 'Quoted from another file:', 'Verdict: REJECT', 'end'],
  // T8: ACCEPT WITH NAMED DEBTS at line 3 -> required_change no.
  [D + 'SYNTH-DEBTS-l1.md']: ['# SYNTH-DEBTS-l1', '', 'VERDICT: ACCEPT WITH NAMED DEBTS (D-SYN-2..3)', '## Checks', 'body'],
};
const EXPECT = [
  ['T1 verdict at line 14 is found (D-DERIVE-1)', 'SYNTH-VERDICT14-l1.md', { verdict_class: 'ACCEPT WITH NAMED DEBTS', debt_ids: '1', required_change: 'no' }],
  ['T2 NOT READY -> required_change yes (D-DERIVE-2)', 'SYNTH-NOTREADY-l1.md', { verdict_class: 'NOT READY', required_change: 'yes' }],
  ['T3 REJECT -> required_change yes (D-DERIVE-2)', 'SYNTH-REJECT-l1.md', { verdict_class: 'REJECT', required_change: 'yes' }],
  ['T4 ACCEPT -> required_change no (D-DERIVE-2)', 'SYNTH-ACCEPT-l2.md', { verdict_class: 'ACCEPT', required_change: 'no', round: '2' }],
  ['T5 no verdict -> all empty, never 0', 'SYNTH-NOVERDICT.md', { verdict_class: '', required_change: '', debt_ids: '', mixed: '' }],
  ['T6 UNKNOWN -> required_change empty, never 0', 'SYNTH-UNKNOWN-l1.md', { verdict_class: 'UNKNOWN', required_change: '' }],
  ['T7 body-only verdict line is not the header verdict', 'SYNTH-BODYONLY-l1.md', { verdict_class: '', required_change: '' }],
  ['T8 ACCEPT WITH NAMED DEBTS -> required_change no', 'SYNTH-DEBTS-l1.md', { verdict_class: 'ACCEPT WITH NAMED DEBTS', required_change: 'no', debt_ids: '2' }],
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'derive-metrics-test-'));
let failed = 0;
const say = (ok, name, detail) => { if (!ok) failed++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : '')); };
try {
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"commonjs"}\n');
  fs.writeFileSync(path.join(tmp, 'fixture.json'), JSON.stringify(Object.fromEntries(Object.entries(FILES).map(([k, v]) => [k, v.join('\n') + '\n']))));
  const load = "const F = require(require('path').join(__dirname, 'fixture.json')); const a = process.argv.slice(2);\n";
  fs.writeFileSync(path.join(tmp, 'rev-parse'), load + "process.stdout.write('0000000\\n');\n");
  fs.writeFileSync(path.join(tmp, 'ls-tree'), load + "process.stdout.write(Object.keys(F).join('\\n') + '\\n');\n");
  fs.writeFileSync(path.join(tmp, 'log'), load + "process.stdout.write('@@2026-01-01T00:00:00-05:00\\n\\n' + Object.keys(F).join('\\n') + '\\n');\n");
  fs.writeFileSync(path.join(tmp, 'show'), load + "const p = a[0].slice(a[0].indexOf(':') + 1); if (!(p in F)) { process.stderr.write('no ' + p); process.exit(128); } process.stdout.write(F[p]);\n");
  const tools = path.join(tmp, 'rebuild', 'improve', 'tools');
  fs.mkdirSync(tools, { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(tools, 'derive-metrics.cjs'));
  const out = path.join(tmp, 'out.csv');
  const r = cp.spawnSync(process.execPath, [path.join(tools, 'derive-metrics.cjs'), 'SYNTHREF', '--out', out],
    { cwd: tmp, env: Object.assign({}, process.env, { GIT: process.execPath }), encoding: 'utf8', windowsHide: true });
  say(r.status === 0, 'T0 script exits 0 on the invented fixture', 'status=' + r.status + (r.status ? ' ' + String(r.stderr).slice(0, 300) : ''));
  const text = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  // minimal CSV reader (quoted fields, doubled quotes; no newlines inside fields, which the script never writes)
  const parse = (l) => { const f = []; let s = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i];
    if (q) { if (c === '"' && l[i + 1] === '"') { s += '"'; i++; } else if (c === '"') q = false; else s += c; }
    else if (c === '"') q = true; else if (c === ',') { f.push(s); s = ''; } else s += c; } f.push(s); return f; };
  const lines = text.split('\n').filter(Boolean);
  const cols = lines.length ? parse(lines[0]) : [];
  say(cols.includes('required_change'), 'T9 CSV has a required_change column (D-DERIVE-2)', 'columns=' + cols.join('|'));
  const rows = new Map(lines.slice(1).map((l) => { const f = parse(l); const o = {}; cols.forEach((c, i) => { o[c] = f[i]; }); return [path.posix.basename(o.file || ''), o]; }));
  say(rows.size === Object.keys(FILES).length, 'T10 one row per invented review file (nothing dropped)', 'rows=' + rows.size + ' files=' + Object.keys(FILES).length);
  for (const [name, fn, want] of EXPECT) {
    const got = rows.get(fn);
    if (!got) { say(false, name, 'row missing'); continue; }
    const bad = Object.entries(want).filter(([k, v]) => got[k] !== v).map(([k, v]) => k + ' want "' + v + '" got "' + got[k] + '"');
    say(bad.length === 0, name, bad.join('; '));
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log('SUMMARY script=' + path.basename(SCRIPT) + ' failed=' + failed);
process.exit(failed ? 1 : 0);
