'use strict';
// Hosted NATIVE-LOAD sweep: concatenate the shard results files into ONE results file, in list order.
// It checks that every shard 0..N-1 reported exactly once, against the same list (sha256), and that every
// (mutant, listed test) pair of the list has exactly one record; a pair with no record gets status MISSING.
// The output carries only what the shard files carry (ids, files, tests, statuses, counts, first failing
// title); it prints only counts. Exit 0 once the file is written; `complete` in its header says whether the
// sweep was whole, and the workflow's last step fails the run on complete=false after the upload.
// usage: node merge.cjs --in DIR --list F --shards N --out F
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const argv = process.argv.slice(2), opt = {};
for (let i = 0; i < argv.length; i += 2) opt[String(argv[i]).replace(/^--/, '')] = argv[i + 1];
const die = (c) => { console.log('NLSWEEP-MERGE-ERROR ' + c); process.exit(2); };
if (!opt.in || !opt.list || !opt.out) die('ARGS');
const SHARDS = Number(opt.shards); if (!Number.isInteger(SHARDS) || SHARDS < 1) die('BAD_SHARDS');
let listBytes; try { listBytes = fs.readFileSync(opt.list); } catch { die('LIST_UNREADABLE'); }
const listSha = crypto.createHash('sha256').update(listBytes).digest('hex');
const expected = []; const pos = new Map();
listBytes.toString('utf8').split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim() && !l.startsWith('#')).forEach((line, k) => {
  let m = null; try { m = JSON.parse(line); } catch { m = null; }
  // The same test-key rule shard.cjs uses for a refused line.
  const tests = m && Array.isArray(m.tests) && m.tests.length ? m.tests.map((t) => (typeof t === 'string' && /^[a-z0-9]{1,8}$/.test(t) ? t : '?')) : [''];
  const id = m && typeof m.id === 'string' && /^[A-Za-z0-9_.-]{1,64}$/.test(m.id) ? m.id : 'line-' + k;
  for (const t of tests) { const key = id + '|' + t; expected.push({ k, id, file: m && typeof m.file === 'string' ? m.file : '', test: t, key }); pos.set(key, expected.length - 1); }
});
const files = []; (function walk(d) { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/^results-shard-\d+\.jsonl$/.test(e.name)) files.push(p); } })(opt.in);
const seenShard = new Map(), got = new Map(), problems = [], nodes = new Set();
for (const f of files.sort()) {
  const rows = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const h = rows[0];
  if (!h || h.kind !== 'shard') { problems.push('NO_HEADER ' + path.basename(f)); continue; }
  if (h.list !== listSha) problems.push('LIST_SHA_MISMATCH shard ' + h.shard);
  if (h.shards !== SHARDS) problems.push('SHARD_COUNT_MISMATCH shard ' + h.shard);
  if (seenShard.has(h.shard)) problems.push('DUPLICATE_SHARD ' + h.shard);
  seenShard.set(h.shard, h); nodes.add(h.node + ' ' + h.platform);
  for (const r of rows.slice(1)) {
    const key = r.id + '|' + (r.test || '');
    if (got.has(key)) problems.push('DUPLICATE_RECORD ' + r.id + ' ' + r.test);
    else got.set(key, r);
  }
}
for (let i = 0; i < SHARDS; i++) if (!seenShard.has(i)) problems.push('SHARD_ABSENT ' + i);
const out = []; const counts = {};
for (const e of expected) {
  const r = got.get(e.key) || { kind: 'run', shard: null, id: e.id, file: e.file, test: e.test, status: 'MISSING', pass: null, fail: null, total: null,
    exit: null, applied: null, appliedParent: null, guard: null, red: 0, firstFail: '', secs: 0 };
  r.k = e.k; out.push(r); counts[r.status] = (counts[r.status] || 0) + 1;
}
for (const key of got.keys()) if (!pos.has(key)) problems.push('UNLISTED_RECORD ' + key.replace('|', ' '));
const complete = problems.length === 0 && !counts.MISSING;
// clean: every pair ended KILLED or LIVE (no ERROR-*, TIMEOUT, KILLED-NOROW, UNKNOWN or MISSING). Data, not a gate.
const clean = complete && Object.keys(counts).every((s) => s === 'KILLED' || s === 'LIVE');
const header = { kind: 'header', format: 'nlsweep-results/1', list: listSha, shards: SHARDS, shardsSeen: seenShard.size, runs: out.length,
  complete, clean, problems, counts, node: [...nodes].sort(), commit: process.env.GITHUB_SHA || null, run: process.env.GITHUB_RUN_ID || null };
fs.mkdirSync(path.dirname(path.resolve(opt.out)), { recursive: true });
fs.writeFileSync(opt.out, [header, ...out].map((o) => JSON.stringify(o).replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))).join('\n') + '\n');
const sha = crypto.createHash('sha256').update(fs.readFileSync(opt.out)).digest('hex');
console.log('NLSWEEP-MERGE shards ' + seenShard.size + '/' + SHARDS + ' runs ' + out.length + ' complete ' + complete + ' clean ' + clean + ' ' +
  Object.keys(counts).sort().map((s) => s + '=' + counts[s]).join(' ') + ' sha256 ' + sha);
for (const p of problems.slice(0, 50)) console.log('NLSWEEP-MERGE-PROBLEM ' + p);
