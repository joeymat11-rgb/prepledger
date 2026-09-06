'use strict';
// powershell-encoding.test.cjs — regression for BRIEF-W4-ENCODING (rebuild/m3/BRIEF-W4-ENCODING.md).
//
// Windows PowerShell 5.1 decodes a BOM-less script with the system ANSI code page, not UTF-8, so the two setup
// scripts (both contain non-ASCII text) must start with exactly one UTF-8 BOM (EF BB BF) and carry a strictly
// valid UTF-8 body. The body bytes are pinned to the pre-BOM preimages so the six-byte patch is provably the only
// change. Nothing here executes, dot-sources or evaluates a PowerShell script: the only PowerShell invocation is
// the native 5.1 parser's static ParseFile, on Windows only, printing version / count / first error id + line.
//
//   node --test rebuild/m3/setup/test/powershell-encoding.test.cjs
//
// Portable checks run everywhere. The native-parser test SKIPS explicitly off Windows (it is PENDING, not PASS,
// until a Windows run reports it) and FAILS as "unavailable" on Windows without the native 5.1 host.
// Tests never rewrite tracked files; the negative uses an owned temporary copy.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SETUP_DIR = path.join(ROOT, 'rebuild', 'm3', 'setup');
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);

// Pinned by BRIEF-W4-ENCODING: body (pre-BOM preimage at cd984c7) and whole file (post-BOM).
const PINS = {
  'rebuild/m3/setup/store-secret.ps1': {
    bodyBytes: 25815, bodySha256: 'e0807e9d57435dba9589a5467ca9a8824c7e213cda48d2a6eddf0f7b10abbe39',
    fileBytes: 25818, fileSha256: 'cba564105829d581648165df23421f1538c2d1e573a4b6115995517fbdf41af6',
  },
  'rebuild/m3/setup/test/store-secret.tests.ps1': {
    bodyBytes: 21158, bodySha256: '50c432ea03280559c15b840a4850fd9f93436274c2cc7499819b1f884b68cc34',
    fileBytes: 21161, fileSha256: '7b9da21cd27f99eb88813ecafafe58661a59b2d7808bfce947e666ad469ad452',
  },
};

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const rel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');

function listPs1(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'node_modules') out.push(...listPs1(p)); }
    else if (entry.isFile() && /\.ps1$/i.test(entry.name)) out.push(p);
  }
  return out.sort();
}

// The encoding checker used by BOTH the positive and the negative. Verdicts are fixed strings.
function checkEncoding(buf) {
  if (buf.length < 3 || !buf.subarray(0, 3).equals(BOM)) return { verdict: 'MISSING-BOM', body: buf };
  const body = buf.subarray(3);
  if (body.length >= 3 && body.subarray(0, 3).equals(BOM)) return { verdict: 'DOUBLE-BOM', body };
  try { new TextDecoder('utf-8', { fatal: true }).decode(body); }
  catch { return { verdict: 'INVALID-UTF8', body }; }
  return { verdict: 'OK', body };
}

const hasNonAscii = (buf) => buf.some((b) => b >= 0x80);

// Snapshot of tracked bytes at load; the last test proves nothing here rewrote them.
const files = listPs1(SETUP_DIR);
const snapshot = new Map(files.map((f) => [f, fs.readFileSync(f)]));

test('inventory: exactly the two pinned .ps1 scripts exist under rebuild/m3/setup, both with non-ASCII content', () => {
  assert.deepEqual(files.map(rel), Object.keys(PINS).sort());
  for (const f of files) assert.ok(hasNonAscii(snapshot.get(f)), `${rel(f)} contains non-ASCII bytes`);
});

for (const [relPath, pin] of Object.entries(PINS)) {
  const abs = path.join(ROOT, ...relPath.split('/'));
  test(`encoding: ${relPath} starts with exactly one UTF-8 BOM and has a strictly valid UTF-8 body`, () => {
    const buf = snapshot.get(abs);
    assert.ok(buf, 'file present');
    const r = checkEncoding(buf);
    assert.equal(r.verdict, 'OK');
  });
  test(`body identity: ${relPath} body is byte-identical to the pinned pre-BOM preimage; whole file matches the pinned postimage`, () => {
    const buf = snapshot.get(abs);
    const body = buf.subarray(3);
    assert.equal(body.length, pin.bodyBytes, 'body length');
    assert.equal(sha256(body), pin.bodySha256, 'body sha256 (preimage)');
    assert.equal(buf.length, pin.fileBytes, 'file length');
    assert.equal(sha256(buf), pin.fileSha256, 'file sha256 (postimage)');
    assert.ok(Buffer.concat([BOM, body]).equals(buf), 'file === BOM ‖ body');
  });
}

test('six-byte proof: the two patches add exactly 3 + 3 = 6 bytes and change nothing else', () => {
  let added = 0;
  for (const [relPath, pin] of Object.entries(PINS)) {
    const buf = snapshot.get(path.join(ROOT, ...relPath.split('/')));
    added += buf.length - pin.bodyBytes;
    assert.equal(sha256(buf.subarray(3)), pin.bodySha256);
  }
  assert.equal(added, 6);
});

test('committed bytes: the working-tree files equal the bytes committed at HEAD (skips only while the file itself is uncommitted work)', (t) => {
  const git = (args) => spawnSync('git', args, { cwd: ROOT, encoding: 'buffer', maxBuffer: 8 * 1024 * 1024 });
  const probe = git(['rev-parse', '--is-inside-work-tree']);
  if (probe.status !== 0) { t.skip('not a git work tree — committed-bytes comparison unavailable'); return; }
  for (const relPath of Object.keys(PINS)) {
    const dirty = git(['status', '--porcelain', '--', relPath]).stdout.toString().trim();
    if (dirty) { t.diagnostic(`${relPath}: uncommitted work in progress (${dirty.slice(0, 2)}) — HEAD comparison deferred to the committed state`); continue; }
    const committed = git(['show', `HEAD:${relPath}`]);
    assert.equal(committed.status, 0, `git show HEAD:${relPath}`);
    assert.ok(committed.stdout.equals(snapshot.get(path.join(ROOT, ...relPath.split('/')))), `${relPath}: working tree === HEAD bytes`);
  }
});

test('negative: a disposable copy of the repaired helper with ONLY the BOM stripped is refused as MISSING-BOM; its body is the exact original; the tracked file is untouched', () => {
  const helper = path.join(ROOT, 'rebuild', 'm3', 'setup', 'store-secret.ps1');
  const pin = PINS['rebuild/m3/setup/store-secret.ps1'];
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-encoding-'));
  try {
    const repaired = snapshot.get(helper);
    const stripped = repaired.subarray(3);
    const copy = path.join(tmpDir, 'store-secret.stripped.ps1');
    fs.writeFileSync(copy, stripped);
    const r = checkEncoding(fs.readFileSync(copy));
    assert.equal(r.verdict, 'MISSING-BOM');
    assert.equal(r.body.length, pin.bodyBytes);
    assert.equal(sha256(r.body), pin.bodySha256, 'stripped copy body === original preimage');
    assert.equal(sha256(fs.readFileSync(helper)), pin.fileSha256, 'tracked helper still the repaired postimage');
    // control: the same checker accepts the repaired bytes and rejects a double BOM and an invalid body
    assert.equal(checkEncoding(repaired).verdict, 'OK');
    assert.equal(checkEncoding(Buffer.concat([BOM, repaired])).verdict, 'DOUBLE-BOM');
    assert.equal(checkEncoding(Buffer.concat([BOM, Buffer.from([0xc3, 0x28])])).verdict, 'INVALID-UTF8');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// ---- native Windows PowerShell 5.1 parser (Windows only; skipped elsewhere; never PASS by absence) ------------
function nativePowerShell() {
  const sysRoot = process.env.SystemRoot || process.env.SYSTEMROOT || 'C:\\Windows';
  const exe = path.join(sysRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  return fs.existsSync(exe) ? exe : null;
}
// Parse only: the static Parser.ParseFile never executes the script. Output: version, count, first error id + line.
function nativeParse(exe, filePath) {
  const psPath = filePath.replace(/'/g, "''");
  const script = [
    "$v=$PSVersionTable.PSVersion; \"VERSION $($v.Major).$($v.Minor)\";",
    "$t=$null; $e=$null;",
    `[void][System.Management.Automation.Language.Parser]::ParseFile('${psPath}', [ref]$t, [ref]$e);`,
    '"COUNT $($e.Count)";',
    'if ($e.Count -gt 0) { "FIRST $($e[0].ErrorId) $($e[0].Extent.StartLineNumber)" }',
  ].join(' ');
  const r = spawnSync(exe, ['-NoProfile', '-NonInteractive', '-Command', script], { encoding: 'utf8', timeout: 60_000, windowsHide: true });
  const out = `${r.stdout || ''}\n${r.stderr || ''}`;
  const version = /VERSION (\d+)\.(\d+)/.exec(out);
  const count = /COUNT (\d+)/.exec(out);
  const first = /FIRST (\S+) (\d+)/.exec(out);
  return { status: r.status, version: version ? `${version[1]}.${version[2]}` : null, count: count ? Number(count[1]) : null, first: first ? { id: first[1], line: Number(first[2]) } : null };
}

test('native: Windows PowerShell 5.1 Parser.ParseFile returns 0 errors for both scripts (parse only; no execution)', (t) => {
  if (process.platform !== 'win32') { t.skip('native Windows PowerShell 5.1 is not available on this OS — result PENDING until a Windows run reports it'); return; }
  const exe = nativePowerShell();
  assert.ok(exe, 'native System32\\WindowsPowerShell\\v1.0\\powershell.exe unavailable — this is a failure, not a pass');
  for (const relPath of Object.keys(PINS)) {
    const r = nativeParse(exe, path.join(ROOT, ...relPath.split('/')));
    assert.equal(r.version, '5.1', `native host version 5.1 required (saw ${r.version}); PowerShell 7 is not a substitute`);
    assert.equal(r.status, 0, 'native host exited 0');
    t.diagnostic(`${relPath}: native 5.1 ParseFile errors=${r.count}${r.first ? ` first=${r.first.id}@${r.first.line}` : ''}`);
    assert.equal(r.count, 0, `${relPath}: native ParseFile error count`);
  }
});

test('native negative (observational): the BOM-stripped disposable copy is parsed by native 5.1 and its error count is reported, not assumed', (t) => {
  if (process.platform !== 'win32') { t.skip('native Windows PowerShell 5.1 is not available on this OS'); return; }
  const exe = nativePowerShell();
  assert.ok(exe, 'native powershell.exe unavailable — failure, not pass');
  const helper = path.join(ROOT, 'rebuild', 'm3', 'setup', 'store-secret.ps1');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-encoding-native-'));
  try {
    const copy = path.join(tmpDir, 'store-secret.stripped.ps1');
    fs.writeFileSync(copy, snapshot.get(helper).subarray(3));
    const r = nativeParse(exe, copy);
    assert.equal(r.version, '5.1');
    // A UTF-8-configured Windows may parse the BOM-less file cleanly; the owner's ANSI host reported 53 (first at line 102).
    t.diagnostic(`stripped copy: native 5.1 ParseFile errors=${r.count}${r.first ? ` first=${r.first.id}@${r.first.line}` : ''} (observed, not asserted)`);
    assert.ok(Number.isInteger(r.count), 'a count was observed');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('tracked bytes unchanged after all tests', () => {
  for (const [f, before] of snapshot) assert.ok(fs.readFileSync(f).equals(before), `${rel(f)} unchanged`);
});
