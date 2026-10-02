'use strict';
// Hosted NATIVE-LOAD sweep: run ONE shard of a mutant list. Each list line is a JSON mutant
// {id,file,mode,tests,before,after,...}; shard i of N takes the mutants at list positions k with k % N === i.
// Per mutant: allow.cjs refuses (ERROR-LIST, nothing read) any target other than the five NATIVE-LOAD files in
// their own mode and any test other than fc12/fa03; then the anchor is counted (exactly one, else ERROR-ANCHOR and
// nothing runs); then, for each listed test (fc12 = whole FC12, fa03 = whole FA03, never a name pattern), one
//   node --require guard.cjs --require overlay.cjs --import deps-loader.mjs --test --test-reporter=tap <test>
// with TZ=America/New_York and MEASURED_TEST_NOW=2026-09-03, cwd = the checkout root, and a 300 s wall clock.
// The child's overlay count must be exactly 1 (else ERROR-APPLIED) and every GUARD line must read
// "none; refused: none" (else ERROR-GUARD). Otherwise a red top-level row = KILLED, all green = LIVE.
// PUBLIC-LOG BOUNDARY: the repository is public, so this script never prints or records raw test output or
// any product text. It prints and records only: mutant id, file, test, status, applied count, pass/fail/total
// counts, exit code, seconds, guard ok, and the FIRST failing top-level test title (truncated to 200 chars).
// usage: node shard.cjs --list F --shard i --shards N --out F [--root D] [--par P] [--timeout S]
//                       [--node EXE] [--deps-dirs "a<delim>b"]
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), cp = require('node:child_process');
const crypto = require('node:crypto'), { pathToFileURL } = require('node:url');
const HERE = __dirname;
const { TESTS, refuse } = require('./allow.cjs');
const PROTECTED = /[\\/]rebuild[\\/]engine[\\/](seed|migrate|merge|index|oracle-shim)\.cjs$/i;
const CLEAR = ['NATIVE_LOAD_PROPERTY_RUNS', 'NATIVE_LOAD_PROPERTY_SEED', 'NATIVE_LOAD_PROPERTY_REPORT', 'NATIVE_LOAD_PROPERTY_ALL',
  'NATIVE_LOAD_PROPERTY8_RUNS', 'NATIVE_LOAD_PROPERTY8_SEED', 'NATIVE_LOAD_PROPERTY8_REPORT', 'NATIVE_LOAD_PROPERTY8_ALL',
  'PERFORMED_W6_DIR', 'NLR_OVERLAY', 'NLR_SWAP', 'NLR_OUT', 'NLR_KNOWN_RED_STRICT', 'NLR_FSOVERLAY', 'NLR_ESMOVERLAY', 'NLR_APPEND',
  'NLR_SKIPWALK', 'NODE_OPTIONS'];
const MAX_OUT = 64 * 1024 * 1024;
function die(code) { console.log('NLSWEEP-SHARD-ERROR ' + code); process.exit(2); }
process.on('uncaughtException', (e) => die('UNCAUGHT ' + String((e && (e.code || e.name)) || 'error').replace(/[^A-Za-z0-9_-]/g, '')));
const argv = process.argv.slice(2), opt = {};
for (let i = 0; i < argv.length; i += 2) { if (!/^--[a-z-]+$/.test(argv[i]) || argv[i + 1] === undefined) die('BAD_ARGS'); opt[argv[i].slice(2)] = argv[i + 1]; }
const ROOT = path.resolve(opt.root || process.cwd());
const SHARD = Number(opt.shard), SHARDS = Number(opt.shards), PAR = Number(opt.par || 1), TIMEOUT = Number(opt.timeout || 300);
if (!opt.list || !opt.out) die('LIST_AND_OUT_REQUIRED');
if (!Number.isInteger(SHARDS) || SHARDS < 1 || !Number.isInteger(SHARD) || SHARD < 0 || SHARD >= SHARDS) die('BAD_SHARD');
if (!Number.isInteger(PAR) || PAR < 1 || PAR > 8 || !(TIMEOUT > 0)) die('BAD_PAR_OR_TIMEOUT');
const NODE = opt.node || process.execPath;
const DEPS = (opt['deps-dirs'] || process.env.NLR_DEPS_DIRS || [path.join(ROOT, 'rebuild/m3/w6/node_modules'), path.join(ROOT, 'node_modules')].join(path.delimiter));
for (const t of Object.values(TESTS)) if (!fs.existsSync(path.join(ROOT, t))) die('TEST_FILE_ABSENT ' + t);
let listBytes; try { listBytes = fs.readFileSync(opt.list); } catch { die('LIST_UNREADABLE'); }
const listSha = crypto.createHash('sha256').update(listBytes).digest('hex');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'nlsweep-'));

// ---- the list: '#' lines are comments; every other non-blank line is one mutant, in order.
const lines = listBytes.toString('utf8').split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim() && !l.startsWith('#'));
const mine = [];
lines.forEach((line, k) => { if (k % SHARDS === SHARD) mine.push({ k, line }); });
// allow.cjs first (the five NATIVE-LOAD files with their modes, tests fc12/fa03 only): nothing is read before it.
// The protected-five test stays as a second, redundant fence (case-insensitive).
function validate(m) {
  const bad = refuse(m); if (bad) return bad;
  if (PROTECTED.test('/' + m.file) || PROTECTED.test(path.resolve(ROOT, m.file))) return 'PROTECTED_FILE';
  return null;
}
// The same test-key rule merge.cjs uses, so a refused line still lines up with the merge's expectation.
const safeTests = (m) => (m && Array.isArray(m.tests) && m.tests.length ? m.tests.map((t) => (typeof t === 'string' && /^[a-z0-9]{1,8}$/.test(t) ? t : '?')) : ['']);
function anchors(m) {
  let text; try { text = fs.readFileSync(path.join(ROOT, m.file), 'utf8'); } catch { return -1; }
  return text.split(m.before).length - 1;
}
const records = [], runs = [];
const rec = (o) => Object.assign({ kind: 'run', shard: SHARD, status: null, pass: null, fail: null, total: null, exit: null,
  applied: null, appliedParent: null, guard: null, red: 0, firstFail: '', secs: 0 }, o);
for (const { k, line } of mine) {
  let m = null; try { m = JSON.parse(line); } catch { m = null; }
  const bad = validate(m);
  if (bad) {
    const id = (m && typeof m.id === 'string' && /^[A-Za-z0-9_.-]{1,64}$/.test(m.id)) ? m.id : 'line-' + k;
    for (const t of safeTests(m)) records.push(rec({ k, id, file: '', test: t, status: 'ERROR-LIST', note: bad }));
    continue;
  }
  const n = anchors(m);
  if (n !== 1) { for (const t of m.tests) records.push(rec({ k, id: m.id, file: m.file, test: t, status: 'ERROR-ANCHOR', applied: 0, note: 'anchors ' + n })); continue; }
  for (const t of m.tests) runs.push({ k, m, t });
}

// ---- one run: spawn, capture stdout (TAP, with the child's stderr as '# ' comments) and stderr (the runner
// parent's own exit lines) separately, parse counts only, discard the text.
function parse(out, err, id) {
  const r = { tests: null, pass: null, fail: null, applied: null, appliedParent: null, guardLines: 0, guardDirty: 0, red: [] };
  const num = (re) => { const m = out.match(re); return m ? Number(m[1]) : null; };
  r.tests = num(/^# tests (\d+)\s*$/m); r.pass = num(/^# pass (\d+)\s*$/m); r.fail = num(/^# fail (\d+)\s*$/m);
  const ov = (text, prefix) => { let s = null; const re = new RegExp('^' + prefix + '(?:FS|ESM)?OVERLAY (\\S+) applied (\\d+)', 'gm'); let m;
    while ((m = re.exec(text))) if (m[1] === id) s = (s || 0) + Number(m[2]); return s; };
  r.applied = ov(out, '# '); r.appliedParent = ov(err, '');
  const g = /^(?:# )?GUARD protected-in-cache: (.*); refused: (.*?)\s*$/gm; let m;
  for (const text of [out, err]) { g.lastIndex = 0; while ((m = g.exec(text))) { r.guardLines++; if (m[1] !== 'none' || m[2] !== 'none') r.guardDirty++; } }
  r.childGuard = /^# GUARD protected-in-cache: /m.test(out);
  const seen = new Set(); const nk = /^not ok \d+ - (.*)$/gm;
  while ((m = nk.exec(out))) { const title = m[1].replace(/\s+#\s+(SKIP|TODO)\b.*$/, ''); const key = title.split(' ')[0]; if (!seen.has(key)) { seen.add(key); r.red.push(title); } }
  return r;
}
function killTree(child) {
  try { if (process.platform === 'win32') cp.spawnSync('taskkill', ['/T', '/F', '/PID', String(child.pid)], { windowsHide: true, stdio: 'ignore' }); else process.kill(-child.pid, 'SIGKILL'); } catch {}
}
function runOne({ k, m, t }) {
  return new Promise((resolve) => {
    const specFile = path.join(TMP, m.id + '-' + t + '.json');
    fs.writeFileSync(specFile, JSON.stringify({ id: m.id, file: m.file, mode: m.mode, before: m.before, after: m.after }));
    const env = { ...process.env }; for (const v of CLEAR) delete env[v];
    Object.assign(env, { TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03', NODE_PATH: DEPS, NLR_DEPS_DIRS: DEPS, NLR_ROOT: ROOT, NLR_SWEEP_SPEC: specFile });
    const args = ['--require', path.join(HERE, 'guard.cjs'), '--require', path.join(HERE, 'overlay.cjs'),
      '--import', pathToFileURL(path.join(HERE, 'deps-loader.mjs')).href, '--test', '--test-reporter=tap', TESTS[t]];
    const t0 = Date.now(); let out = '', err = '', size = 0, timedOut = false, capped = false;
    const child = cp.spawn(NODE, args, { cwd: ROOT, env, windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
    const take = (which) => (b) => { size += b.length; if (size > MAX_OUT) { if (!capped) { capped = true; killTree(child); } return; } if (which === 1) out += b.toString('utf8'); else err += b.toString('utf8'); };
    child.stdout.on('data', take(1)); child.stderr.on('data', take(2));
    const timer = setTimeout(() => { timedOut = true; killTree(child); }, TIMEOUT * 1000);
    child.on('error', () => {});
    child.on('close', (code, signal) => {
      clearTimeout(timer); try { fs.unlinkSync(specFile); } catch {}
      const p = parse(out, err, m.id); out = ''; err = '';
      const exit = timedOut ? 'TIMEOUT' : (code == null ? 'SIGNAL' : code);
      const guardOk = p.childGuard && p.guardDirty === 0;
      let status;
      if (timedOut) status = 'TIMEOUT';
      else if (capped) status = 'ERROR-OUTPUT';
      else if (p.applied !== 1) status = 'ERROR-APPLIED';
      else if (!guardOk) status = 'ERROR-GUARD';
      else if (p.red.length) status = 'KILLED';
      else if (code === 0 && p.tests > 0 && p.pass === p.tests) status = 'LIVE';
      else if (code === 1) status = 'KILLED-NOROW';
      else status = 'UNKNOWN';
      resolve(rec({ k, id: m.id, file: m.file, test: t, status, pass: p.pass, fail: p.fail, total: p.tests, exit,
        applied: p.applied == null ? 0 : p.applied, appliedParent: p.appliedParent == null ? 0 : p.appliedParent, guard: guardOk,
        red: p.red.length, firstFail: (p.red[0] || '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 200), secs: Math.round((Date.now() - t0) / 1000) }));
    });
  });
}

// ---- the pool, the allowed log line per run, and the shard's results file (header line first).
const say = (r) => console.log('NLSWEEP ' + SHARD + '/' + SHARDS + ' ' + r.id + ' ' + (r.file || '-') + ' ' + (r.test || '-') + ' ' + r.status +
  ' applied=' + (r.applied == null ? '-' : r.applied) + ' pass=' + (r.pass == null ? '-' : r.pass) + '/' + (r.total == null ? '-' : r.total) +
  ' fail=' + (r.fail == null ? '-' : r.fail) + (r.firstFail ? ' first=' + JSON.stringify(r.firstFail) : ''));
(async () => {
  records.forEach(say);
  let next = 0;
  const worker = async () => { while (next < runs.length) { const r = await runOne(runs[next++]); records.push(r); say(r); } };
  await Promise.all(Array.from({ length: Math.min(PAR, Math.max(1, runs.length)) }, worker));
  const order = (r) => r.k * 10 + (r.test === 'fa03' ? 1 : 0);
  records.sort((a, b) => order(a) - order(b));
  const counts = {}; for (const r of records) counts[r.status] = (counts[r.status] || 0) + 1;
  const header = { kind: 'shard', format: 'nlsweep-shard/1', shard: SHARD, shards: SHARDS, list: listSha, listMutants: lines.length,
    mutants: mine.length, runs: records.length, par: PAR, timeout: TIMEOUT, node: process.version, platform: process.platform, counts };
  fs.mkdirSync(path.dirname(path.resolve(opt.out)), { recursive: true });
  fs.writeFileSync(opt.out, [header, ...records].map((o) => JSON.stringify(o).replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))).join('\n') + '\n');
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
  console.log('NLSWEEP-SHARD ' + SHARD + '/' + SHARDS + ' list ' + listSha.slice(0, 16) + ' mutants ' + mine.length + ' runs ' + records.length + ' ' +
    Object.keys(counts).sort().map((s) => s + '=' + counts[s]).join(' '));
})().catch((e) => die('RUN ' + String((e && (e.code || e.name)) || 'error').replace(/[^A-Za-z0-9_-]/g, '')));
