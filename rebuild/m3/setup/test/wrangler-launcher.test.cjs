'use strict';
// Tests for rebuild/m3/setup/wrangler.cjs — the launcher's own core (resolveWrangler / checkArgs / planSpawn)
// is exercised against DUMMY package facades on disk, and the end-to-end cases run the REAL pinned install
// under a network tripwire (every proxy variable points at a closed local port; no credential in the env).
//
//   node --test rebuild/m3/setup/test/wrangler-launcher.test.cjs
//
// The end-to-end cases are skipped with an explicit message when the pinned package is not installed;
// they never install it (the launcher never installs anything either).

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const L = require('../wrangler.cjs');
const LAUNCHER = path.resolve(__dirname, '..', 'wrangler.cjs');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

// ---- dummy facades: a fake tooling dir with a fake "wrangler" package ----------------------------------
function fakeTooling({ name = 'wrangler', version = L.REQUIRED_VERSION, bin = { wrangler: './bin/wrangler.js' }, writeBin = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-launcher-'));
  const pkgDir = path.join(dir, 'node_modules', 'wrangler');
  fs.mkdirSync(path.join(pkgDir, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name, version, bin }));
  if (writeBin) fs.writeFileSync(path.join(pkgDir, 'bin', 'wrangler.js'), '// dummy\n');
  return dir;
}

test('resolveWrangler: accepts a package with the exact pinned version and an in-package bin', () => {
  const dir = fakeTooling();
  const r = L.resolveWrangler(dir);
  assert.equal(r.version, L.REQUIRED_VERSION);
  assert.equal(r.bin, path.join(dir, 'node_modules', 'wrangler', 'bin', 'wrangler.js'));
});

test('resolveWrangler: missing install → exit 3, message names the install command, never installs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-launcher-empty-'));
  assert.throws(() => L.resolveWrangler(dir), (e) => e instanceof L.LauncherError && e.code === L.EXIT.NOT_INSTALLED && /npm install --prefix rebuild\/m3\/tooling/.test(e.message));
  assert.equal(fs.existsSync(path.join(dir, 'node_modules')), false, 'launcher must not create node_modules');
});

test('resolveWrangler: wrong version → exit 4 (a newer wrangler is still a miss)', () => {
  for (const version of ['4.128.0', '4.130.0', '5.0.0', '4.129.0-beta.1']) {
    const dir = fakeTooling({ version });
    assert.throws(() => L.resolveWrangler(dir), (e) => e.code === L.EXIT.WRONG_VERSION && e.message.includes(version));
  }
});

test('resolveWrangler: a different package squatting the directory → exit 3', () => {
  const dir = fakeTooling({ name: 'not-wrangler' });
  assert.throws(() => L.resolveWrangler(dir), (e) => e.code === L.EXIT.NOT_INSTALLED && /not wrangler/.test(e.message));
});

test('resolveWrangler: bin entry escaping the package directory → exit 3', () => {
  const dir = fakeTooling({ bin: { wrangler: '../../evil.js' } });
  assert.throws(() => L.resolveWrangler(dir), (e) => e.code === L.EXIT.NOT_INSTALLED && /escapes/.test(e.message));
});

test('resolveWrangler: bin entry declared but file missing → exit 3', () => {
  const dir = fakeTooling({ writeBin: false });
  assert.throws(() => L.resolveWrangler(dir), (e) => e.code === L.EXIT.NOT_INSTALLED && /missing/.test(e.message));
});

test('resolveWrangler: string-form bin is accepted', () => {
  const dir = fakeTooling({ bin: './bin/wrangler.js' });
  assert.equal(path.basename(L.resolveWrangler(dir).bin), 'wrangler.js');
});

test('checkArgs: empty → usage (2); login/logout → refused (5); flags before the subcommand still refused', () => {
  assert.throws(() => L.checkArgs([]), (e) => e.code === L.EXIT.USAGE);
  assert.throws(() => L.checkArgs(['login']), (e) => e.code === L.EXIT.REFUSED);
  assert.throws(() => L.checkArgs(['--verbose', 'logout']), (e) => e.code === L.EXIT.REFUSED);
  assert.doesNotThrow(() => L.checkArgs(['whoami']));
  assert.doesNotThrow(() => L.checkArgs(['d1', 'list', '--json']));
  assert.doesNotThrow(() => L.checkArgs(['--version']));
});

test('planSpawn: uses process.execPath, an argument ARRAY, shell:false, and disables wrangler telemetry', () => {
  const dir = fakeTooling();
  const r = L.resolveWrangler(dir);
  const plan = L.planSpawn(['d1', 'list', '--json', 'weird arg with spaces; rm -rf /'], r, { PATH: '/nowhere' });
  assert.equal(plan.file, process.execPath);
  assert.deepEqual(plan.args, [r.bin, 'd1', 'list', '--json', 'weird arg with spaces; rm -rf /']);
  assert.equal(plan.options.shell, false);
  assert.equal(plan.options.stdio, 'inherit');
  assert.equal(plan.options.env.WRANGLER_SEND_METRICS, 'false');
  assert.equal(plan.options.env.PATH, '/nowhere', 'caller env is forwarded, not replaced');
});

// ---- end-to-end against the REAL pinned install, under a network tripwire -------------------------------
const TRIPWIRE_ENV = (() => {
  const env = { ...process.env };
  for (const k of Object.keys(env)) {
    if (/^(CLOUDFLARE_|CF_|WRANGLER_)/i.test(k)) delete env[k];   // no credential, account or wrangler config reaches the child
  }
  // any network attempt goes to a closed local port and fails fast
  env.HTTPS_PROXY = env.HTTP_PROXY = env.https_proxy = env.http_proxy = 'http://127.0.0.1:9';
  env.NO_PROXY = env.no_proxy = '';
  env.WRANGLER_SEND_METRICS = 'false';
  return env;
})();

function realInstalled() {
  try { L.resolveWrangler(); return true; } catch { return false; }
}
const SKIP = realInstalled() ? false : 'pinned wrangler not installed under rebuild/m3/tooling (run the documented npm install first; the test never installs)';

function run(args, opts = {}) {
  return spawnSync(process.execPath, [LAUNCHER, ...args], { cwd: REPO_ROOT, env: TRIPWIRE_ENV, encoding: 'utf8', timeout: 120_000, ...opts });
}

test('e2e: --launcher-check resolves the real pinned package and spawns nothing', { skip: SKIP }, () => {
  const r = run(['--launcher-check']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^wrangler-launcher OK 4\.129\.0 rebuild\/m3\/tooling\/node_modules\/wrangler\/bin\/wrangler\.js\n$/);
});

test('e2e: --version through the launcher prints exactly 4.129.0 with no network and no credential', { skip: SKIP }, () => {
  const r = run(['--version']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout.trim(), /(^|\s)4\.129\.0(\s|$)/);
});

test('e2e: --help through the launcher lists the d1 command group (argument forwarding works)', { skip: SKIP }, () => {
  const r = run(['--help']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /\bd1\b/);
});

test('e2e: an unknown subcommand is forwarded verbatim and wrangler\'s own non-zero exit is forwarded', { skip: SKIP }, () => {
  const r = run(['definitely-not-a-wrangler-command-xyz']);
  assert.notEqual(r.status, 0);
  assert.match(r.stdout + r.stderr, /definitely-not-a-wrangler-command-xyz/);
});

test('e2e: login is refused before anything is spawned (exit 5)', { skip: SKIP }, () => {
  const r = run(['login']);
  assert.equal(r.status, L.EXIT.REFUSED);
  assert.match(r.stderr, /refused/);
});

test('e2e: no arguments → usage, exit 2', () => {
  const r = run([]);
  assert.equal(r.status, L.EXIT.USAGE);
  assert.match(r.stderr, /usage/);
});

test('e2e: the launcher output never contains a token-shaped string or an environment dump', { skip: SKIP }, () => {
  const r = run(['--version']);
  const out = r.stdout + r.stderr;
  assert.doesNotMatch(out, /CLOUDFLARE_API_TOKEN|CLERK_SECRET_KEY|Bearer /);
  assert.doesNotMatch(out, /[A-Za-z0-9_-]{40,}/, 'no long opaque token-like strings in launcher output');
});
