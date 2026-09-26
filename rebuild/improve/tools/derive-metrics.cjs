'use strict';
// derive-metrics.cjs (rebuild/improve, DECISIONS:824 (d)). Pure node, no dependencies, loads nothing under rebuild/engine.
// usage: node derive-metrics.cjs [ref] [extra ref ...] [--out path]
//   ref default: refs/remotes/origin/rebuild/t2-client-core. Extra refs add review files not already seen (first ref wins).
// Lists review files ONLY under the three DIRS below via git ls-tree with explicit paths, reads each .md file via
// git show REF:path, takes the verdict ONLY from its header block (pass 2, D-DERIVE-1: from line 1 up to the first
// section heading (## or deeper) that is not itself a verdict line, at most HEADER_MAX lines; the first verdict line
// there wins), and writes METRICS.csv (one row per review file, never hand-edited; no row is ever dropped).
// Body lines are only COUNTED (verdict-shaped lines after the header block, a self-check), never parsed or written.
// Unknown stays empty, never zero. Verdicts map through TABLE only; anything else is UNKNOWN. required_change
// (pass 2, D-DERIVE-2, DECISIONS:824 (a)): yes for NOT READY and REJECT, no for ACCEPT and ACCEPT WITH NAMED DEBTS,
// empty for UNKNOWN or no verdict line.
const cp = require('child_process'), fs = require('fs'), path = require('path');
const PCGIT = 'C:\\Users\\joeym\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\native\\git\\cmd\\git.exe';
const GIT = process.env.GIT || (fs.existsSync(PCGIT) ? PCGIT : 'git');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const DIRS = ['rebuild/lanes/fable/reviews', 'rebuild/lanes/astra/reviews', 'rebuild/improve/reviews'];
const REFUSE = /private|soak|earnedport|src\/|ledger/i; // checked on every listed path BEFORE any read
const HEADER_MAX = 40; // pass 1 used a fixed 12-line window, which missed a verdict heading at line 14 (D-DERIVE-1)
const SECTION = /^\s*#{2,}\s/; // a section heading ends the header block unless it is itself the verdict line
const REQUIRED = { ACCEPT: 'no', 'ACCEPT WITH NAMED DEBTS': 'no', 'NOT READY': 'yes', REJECT: 'yes' }; // UNKNOWN -> empty
// Explicit verdict table: prefix of the verdict text (case-insensitive, then a word boundary), longest first.
// Classes are the DECISIONS:824 (a) vocabulary. No entry matches => UNKNOWN (never guessed).
const TABLE = [
  ['ACCEPT WITH NAMED DEBTS', 'ACCEPT WITH NAMED DEBTS'],
  ['ACCEPT-WITH-DEBTS', 'ACCEPT WITH NAMED DEBTS'],
  ['ACCEPT WITH DEBTS', 'ACCEPT WITH NAMED DEBTS'],
  ['PASS WITH FINDINGS', 'ACCEPT WITH NAMED DEBTS'],
  ['USABLE WITH FIXES', 'NOT READY'],
  ['NEEDS CORRECTION', 'NOT READY'],
  ['NOT READY', 'NOT READY'],
  ['BLOCKED', 'NOT READY'],
  ['REJECT', 'REJECT'],
  ['READY TO PUSH', 'ACCEPT'],
  ['INDEPENDENT STATIC ACCEPT', 'ACCEPT'],
  ['STATIC ACCEPT', 'ACCEPT'],
  ['PASS', 'ACCEPT'],
  ['ACCEPT', 'ACCEPT'],
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const TABLE_RE = TABLE.map(([k, c]) => [new RegExp('^' + esc(k) + '\\b', 'i'), c]);
// mixed flag: more than one keyword family on the verdict line, ignoring a keyword right after "no ".
const KEYWORDS = /\b(ACCEPT|PASS|REJECT|NOT READY|NEEDS CORRECTION|BLOCKED)\b/gi;
const FAMILY = { ACCEPT: 'A', PASS: 'A', REJECT: 'R', 'NOT READY': 'N', 'NEEDS CORRECTION': 'N', BLOCKED: 'N' };
const VERDICT_LINE = /^[\s#>*_-]*verdict\b[\s*_]*:/i;
const DEBT = /\bD-[A-Z0-9]+(?:-[A-Z0-9]+)*(?:\.\.(\d+))?/g;

const argv = process.argv.slice(2);
let out = path.join(ROOT, 'rebuild', 'improve', 'METRICS.csv');
const refs = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === '--out') out = path.resolve(argv[++i]); else refs.push(argv[i]); }
if (!refs.length) refs.push('refs/remotes/origin/rebuild/t2-client-core');
const git = (a) => cp.execFileSync(GIT, a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
const shortRef = (r) => r.replace(/^refs\/(remotes|heads)\//, '');
const ascii = (s) => s.replace(/[^\x20-\x7e]/g, '?');

const owner = new Map(); // path -> ref, or null when refused
const counts = { listed: 0, refused: 0, annex: 0, reviewed: 0, bodyVerdict: 0, past12: [] };
const firstDate = new Map(); // path -> oldest add commit date (ISO) across refs
const heads = [];
for (const ref of refs) {
  heads.push(shortRef(ref) + '@' + git(['rev-parse', '--short', ref]).trim());
  for (const p of git(['ls-tree', '-r', '--name-only', ref, '--', ...DIRS]).split('\n').filter(Boolean)) {
    if (owner.has(p)) continue;
    counts.listed++;
    if (REFUSE.test(p)) { counts.refused++; owner.set(p, null); continue; }
    owner.set(p, ref);
  }
  let d = '';
  for (const l of git(['log', ref, '--no-renames', '--diff-filter=A', '--format=@@%cI', '--name-only', '--', ...DIRS]).split('\n')) {
    if (l.startsWith('@@')) { d = l.slice(2).trim(); continue; }
    const p = l.trim(); if (!p || !d) continue;
    const old = firstDate.get(p);
    if (!old || Date.parse(d) < Date.parse(old)) firstDate.set(p, d);
  }
}

const rows = [];
for (const [p, ref] of owner) {
  if (!ref) continue;
  if (!/\.md$/i.test(p)) { counts.annex++; continue; }
  counts.reviewed++;
  const all = git(['show', ref + ':' + p]).split('\n').map((s) => s.replace(/\r$/, ''));
  let end = Math.min(all.length, HEADER_MAX);
  for (let i = 1; i < end; i++) if (SECTION.test(all[i]) && !VERDICT_LINE.test(all[i])) { end = i; break; }
  const head = all.slice(0, end);
  counts.bodyVerdict += all.slice(end).filter((l) => VERDICT_LINE.test(l)).length; // count only, never parsed
  const fn = path.posix.basename(p);
  const rm = fn.match(/^(.*)[-_]L(\d+)\.md$/i);
  const reviewer = /\/fable\//i.test(p) || /fable/i.test(fn) ? 'Fable' : /\/astra\//i.test(p) || /astra/i.test(fn) ? 'Astra' : '';
  const row = { file: p, reviewer, round: rm ? rm[2] : '', stem: rm ? rm[1] : fn.replace(/\.md$/i, ''),
    verdict_class: '', required_change: '', mixed: '', debt_ids: '', first_commit_date: firstDate.get(p) || '', ref: shortRef(ref), verdict_text: '' };
  const at = head.findIndex((l) => VERDICT_LINE.test(l));
  const line = at >= 0 ? head[at] : undefined;
  if (at >= 12) counts.past12.push(fn + ':' + (at + 1)); // verdicts the pass-1 window would have missed
  if (line !== undefined) {
    const v = line.replace(VERDICT_LINE, '').replace(/[*_`]/g, '').trim();
    row.verdict_text = ascii(v).slice(0, 160);
    row.verdict_class = 'UNKNOWN';
    for (const [re, c] of TABLE_RE) if (re.test(v)) { row.verdict_class = c; break; }
    row.required_change = REQUIRED[row.verdict_class] || ''; // UNKNOWN stays empty, never 0
    const fam = new Set(); let m; KEYWORDS.lastIndex = 0;
    while ((m = KEYWORDS.exec(v))) if (!/\bno\s+$/i.test(v.slice(0, m.index))) fam.add(FAMILY[m[1].toUpperCase().replace(/\s+/g, ' ')]);
    row.mixed = fam.size > 1 ? '1' : '0';
    const ids = new Set(); DEBT.lastIndex = 0;
    while ((m = DEBT.exec(v))) {
      const base = m[0].replace(/\.\.\d+$/, ''); ids.add(base);
      const n = base.match(/^(.*-)(\d+)$/);
      if (m[1] && n && Number(m[1]) > Number(n[2]) && Number(m[1]) - Number(n[2]) < 50)
        for (let k = Number(n[2]) + 1; k <= Number(m[1]); k++) ids.add(n[1] + k);
    }
    row.debt_ids = String(ids.size); // measured on a found verdict line; no verdict line => empty
  }
  rows.push(row);
}
rows.sort((a, b) => (a.stem + '|' + a.round.padStart(3, '0') + '|' + a.file).localeCompare(b.stem + '|' + b.round.padStart(3, '0') + '|' + b.file));

const COLS = ['file', 'reviewer', 'round', 'stem', 'verdict_class', 'required_change', 'mixed', 'debt_ids', 'first_commit_date', 'ref', 'verdict_text'];
const q = (s) => (/[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
fs.writeFileSync(out, [COLS.join(',')].concat(rows.map((r) => COLS.map((c) => q(ascii(String(r[c])))).join(','))).join('\n') + '\n');

const stems = new Map();
for (const r of rows) { if (!stems.has(r.stem)) stems.set(r.stem, []); stems.get(r.stem).push(r); }
const tally = (arr) => { const t = {}; for (const x of arr) t[x || '(empty)'] = (t[x || '(empty)'] || 0) + 1; return Object.entries(t).map(([k, v]) => k + '=' + v).join('; '); };
console.log('PER-STEM (stem | files | rounds | first-round class | final class)');
const firsts = [], finals = [];
for (const [s, rs] of [...stems].sort((a, b) => a[0].localeCompare(b[0]))) {
  const numbered = rs.filter((r) => r.round !== '').sort((a, b) => Number(a.round) - Number(b.round));
  const l1 = numbered.find((r) => r.round === '1');
  const first = l1 ? l1.verdict_class : '';
  const final = numbered.length ? numbered[numbered.length - 1].verdict_class : rs.length === 1 ? rs[0].verdict_class : '';
  firsts.push(first); finals.push(final);
  console.log(s + ' | ' + rs.length + ' | ' + (numbered.map((r) => 'L' + r.round).join(',') || '') + ' | ' + first + ' | ' + final);
}
console.log('SUMMARY refs=' + heads.join(' ') + ' out=' + path.relative(ROOT, out).replace(/\\/g, '/'));
console.log('SUMMARY listed=' + counts.listed + ' refused=' + counts.refused + ' annex_skipped=' + counts.annex + ' md_rows=' + counts.reviewed + ' stems=' + stems.size);
console.log('SUMMARY verdict_line_missing=' + rows.filter((r) => r.verdict_class === '').length + ' mixed=' + rows.filter((r) => r.mixed === '1').length + ' first_commit_date_missing=' + rows.filter((r) => !r.first_commit_date).length);
console.log('SUMMARY row classes: ' + tally(rows.map((r) => r.verdict_class)));
console.log('SUMMARY stem first-round classes: ' + tally(firsts));
console.log('SUMMARY stem final classes: ' + tally(finals));
console.log('SUMMARY rows with debt ids>0: ' + rows.filter((r) => Number(r.debt_ids) > 0).length);
console.log('SUMMARY row required_change: ' + tally(rows.map((r) => r.required_change)));
console.log('SUMMARY header verdicts below line 12 (pass-1 window missed): ' + counts.past12.length + (counts.past12.length ? ' (' + counts.past12.join(', ') + ')' : ''));
console.log('SUMMARY verdict-shaped lines after the header block (counted, not parsed): ' + counts.bodyVerdict);
