'use strict';
// S9 hosted20 proof runner. PROPOSAL_NOT_AUTHORIZED: inert until the workflow pins this runner's,
// the inventory's and the authorization's sha256, and a SEPARATE AUTHORIZATION.json names that exact inventory sha256,
// carries a well-formed authorizedBy block (DECISIONS line + verbatim owner quote; the PM checks it against the ledger),
// says REVIEWED_AND_AUTHORIZED, carries every grant the authorized groups need, and marks every
// group AUTHORIZED or (only if the inventory says SPLIT_REQUIRED) HELD. Authorizing never changes
// the inventory bytes. Subcommands, in workflow order (A = AUTHORIZATION.json):
//   island <inventory> <A> <island> <remoteUrl>   empty repo, blobless depth-1 named commits, exact hydration
//   materialize <inventory> <A> <island>          write exactly the inventoried current blobs
//   seal <inventory> <A> <island>                 remove remotes/alternates/replace/promisor/FETCH_HEAD
//   probe <inventory> <A> <island>                config clean, object inventory exact, allowed pass, forbidden fail
//   run <inventory> <A> <island> <rawDir> <receipt>  probe again, then the groups serially; HELD groups
//       are never spawned, are reported with code HELD_SPLIT_REQUIRED, and make the verdict HELD_INCOMPLETE
//       (exit 2) at best; any red makes RED (exit 1). Only PASS exits 0.
// Any refusal prints only "STOP <CODE>" and exits 3. Child streams go to exclusive raw files only.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

class Stop extends Error { constructor(code) { super(code); this.code = code; } }
const stop = (code) => { throw new Stop(code); };
const need = (cond, code) => { if (!cond) stop(code); };
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');
const gitBlobId = (b) => crypto.createHash('sha1').update('blob ' + b.length + '\0').update(b).digest('hex');
const HEX40 = /^[0-9a-f]{40}$/;
const SAFE = /^(?=.{1,512}$)(?:[A-Za-z0-9._+@()-]+\/)*[A-Za-z0-9._+@()-]+$/;
const APP_GRANT = 'READ_CURRENT_AND_FE516C1_SRC_APP_JSX';

function gitEnv(extra = {}) {
  const env = { PATH: process.env.PATH, HOME: process.env.HOSTED20_EMPTY_HOME || process.env.HOME,
    GIT_NO_LAZY_FETCH: '1', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
    GIT_TERMINAL_PROMPT: '0', GIT_NO_REPLACE_OBJECTS: '1', GIT_OPTIONAL_LOCKS: '0', LC_ALL: 'C' };
  if (process.env.SystemRoot) env.SystemRoot = process.env.SystemRoot;
  return { ...env, ...extra };
}
function git(dir, args, { input, allowFail = false, extraEnv } = {}) {
  const r = spawnSync('git', ['-C', dir, ...args], { input, encoding: null, maxBuffer: 1 << 30, windowsHide: true,
    env: gitEnv(extraEnv), stdio: ['pipe', 'pipe', 'pipe'] });
  if (r.error) stop('GIT_SPAWN_ERROR');
  const verb = args.find((a, i) => !a.startsWith('-') && args[i - 1] !== '-c') || 'git';
  if (!allowFail && r.status !== 0) stop('GIT_FAILED_' + verb.toUpperCase().replace(/[^A-Z-]/g, ''));
  return r;
}
const out = (r) => r.stdout.toString('utf8').trim();

const EXEC_GRANT = 'EXECUTE_PROTECTED_ENGINE_COMPOSITION';
const HELD_CODE = 'HELD_SPLIT_REQUIRED';
function loadInventory(file, authFile) {
  const raw = fs.readFileSync(file);
  const inv = JSON.parse(raw.toString('utf8'));
  need(inv && inv.version === 1, 'INVENTORY_VERSION');
  need(!Object.hasOwn(inv, 'status') && !Object.hasOwn(inv, 'authorization'), 'AUTHORIZATION_INSIDE_INVENTORY');
  if (inv.kind === 'synthetic-selftest') {
    need(process.env.HOSTED20_SELFTEST === '1' && process.env.GITHUB_ACTIONS !== 'true', 'SYNTHETIC_OUTSIDE_SELFTEST');
  } else {
    need(inv.kind === 'hosted20-frozen-inventory', 'INVENTORY_KIND');
    need(process.env.HOSTED20_INVENTORY_SHA256 === sha256(raw), 'INVENTORY_SHA256_NOT_PINNED');
    need(process.env.HOSTED20_RUNNER_SHA256 === sha256(fs.readFileSync(__filename)), 'RUNNER_SHA256_NOT_PINNED');
    need(inv.groupCount === 20 && inv.groups.length === 20, 'GROUP_COUNT');
  }
  need(inv.refs && inv.refs.current && inv.sourceHead === inv.refs.current.commit, 'SOURCE_HEAD_NOT_CURRENT');
  const authRaw = fs.readFileSync(authFile);
  const authPin = process.env.HOSTED20_AUTHORIZATION_SHA256;
  if (inv.kind !== 'synthetic-selftest' || authPin !== undefined) need(authPin === sha256(authRaw), 'AUTHORIZATION_SHA256_NOT_PINNED');
  const auth = JSON.parse(authRaw.toString('utf8'));
  need(auth && auth.version === 1 && auth.kind === (inv.kind === 'synthetic-selftest' ? 'synthetic-selftest-authorization' : 'hosted20-authorization'), 'AUTHORIZATION_KIND');
  need(auth.inventorySha256 === sha256(raw), 'AUTHORIZATION_NAMES_OTHER_INVENTORY');
  need(auth.status === 'REVIEWED_AND_AUTHORIZED', 'NOT_AUTHORIZED');
  const by = auth.authorizedBy;
  need(by !== undefined && by !== null, 'AUTHORIZED_BY_MISSING');
  need(typeof by === 'object' && !Array.isArray(by) && JSON.stringify(Object.keys(by).sort()) === JSON.stringify(['decisionsLine', 'ledger', 'ownerQuote'])
    && by.ledger === 'rebuild/DECISIONS.md' && Number.isInteger(by.decisionsLine) && by.decisionsLine > 0
    && typeof by.ownerQuote === 'string' && by.ownerQuote.trim().length > 0 && by.ownerQuote.length <= 4000
    && !/[\u0000-\u0008\u000b-\u001f\u007f]/.test(by.ownerQuote), 'AUTHORIZED_BY_MALFORMED');
  need(Array.isArray(auth.grants) && auth.grants.every((x) => typeof x === 'string'), 'GRANTS_SHAPE');
  const grants = new Set(auth.grants);
  const names = inv.groups.map((g) => g.name);
  need(new Set(names).size === names.length, 'GROUP_NAMES_NOT_UNIQUE');
  need(auth.groups && JSON.stringify(Object.keys(auth.groups).sort()) === JSON.stringify([...names].sort()), 'AUTHORIZATION_GROUP_SET');
  const held = new Set();
  for (const g of inv.groups) {
    need(Array.isArray(g.argv) && g.argv.every((a) => typeof a === 'string'), 'ARGV_SHAPE');
    const decision = auth.groups[g.name];
    if (g.status === 'SPLIT_REQUIRED') { need(decision === 'HELD', 'SPLIT_GROUP_NOT_HELD'); held.add(g.name); continue; }
    need(decision === 'AUTHORIZED', decision === 'HELD' ? 'HELD_ONLY_FOR_SPLIT_REQUIRED' : 'GROUP_DECISION');
    for (const p of g.ownerPermissions) need(grants.has(p), 'OWNER_PERMISSION_MISSING');
  }
  need(held.size < inv.groups.length, 'NOTHING_AUTHORIZED');
  Object.defineProperty(inv, '__grants', { value: grants });
  Object.defineProperty(inv, '__held', { value: held });
  const commits = Object.values(inv.refs).map((r) => r.commit);
  need(commits.length > 0 && commits.every((c) => HEX40.test(c)), 'REF_SHAPE');
  // Hydrating or writing any protected-five blob (current or historical) is covered only by EXECUTE.
  const protectedBytes = inv.hydratedBlobPairs.some((p) => p.permission === 'PROTECTED_FIVE') || inv.currentMaterialization.files.some((f) => f.protected);
  need(!protectedBytes || grants.has(EXEC_GRANT), 'PROTECTED_FIVE_HYDRATION_NOT_GRANTED');
  need(Array.isArray(inv.tags) && inv.tags.length === 0, 'TAGS_NOT_EMPTY');
  for (const p of inv.hydratedBlobPairs) need(HEX40.test(p.commit) && HEX40.test(p.blob) && SAFE.test(p.path), 'PAIR_SHAPE');
  for (const f of inv.currentMaterialization.files.concat(inv.permissionGatedMaterialization || []))
    need(SAFE.test(f.path) && !f.path.split('/').includes('..') && HEX40.test(f.blob) && ['100644', '100755'].includes(f.mode), 'MATERIALIZE_SHAPE');
  return { inv, raw, auth, authRaw };
}
function granted(inv) { return inv.__grants; }
// Permission-gated entries join the hydration/materialization sets only when granted.
const gateOk = (inv, perm) => perm !== 'OWNER_PERMISSION_SRC_APP_JSX' || granted(inv).has(APP_GRANT);
const activePairs = (inv) => inv.hydratedBlobPairs.filter((p) => gateOk(inv, p.permission));
const activeFiles = (inv) => inv.currentMaterialization.files.concat((inv.permissionGatedMaterialization || []).filter((e) => gateOk(inv, e.permission)));
const expectedBlobs = (inv) => [...new Set([...activeFiles(inv).map((f) => f.blob), ...activePairs(inv).map((p) => p.blob)])].sort();
const commitsOf = (inv) => [...new Set(Object.values(inv.refs).map((r) => r.commit))].sort();

function objectInventory(island) {
  const r = git(island, ['cat-file', '--batch-all-objects', '--batch-check=%(objectname) %(objecttype)']);
  const by = { commit: [], tree: [], blob: [], tag: [] };
  for (const line of out(r).split('\n').filter(Boolean)) {
    const [oid, type] = line.split(' ');
    need(HEX40.test(oid) && Object.hasOwn(by, type), 'OBJECT_SHAPE');
    by[type].push(oid);
  }
  for (const k of Object.keys(by)) by[k] = [...new Set(by[k])].sort();
  return by;
}
function assertInventoryExact(inv, island, { blobsExpected }) {
  const by = objectInventory(island);
  need(JSON.stringify(by.commit) === JSON.stringify(commitsOf(inv)), 'INVENTORY_MISMATCH_COMMITS');
  need(by.tag.length === 0, 'INVENTORY_MISMATCH_TAGS');
  need(by.tree.length === inv.trees.count && sha256(by.tree.join('\n') + '\n') === inv.trees.sortedOidsSha256, 'INVENTORY_MISMATCH_TREES');
  need(JSON.stringify(by.blob) === JSON.stringify(blobsExpected), 'INVENTORY_MISMATCH_BLOBS');
  return by;
}

// Credentials come only from HOSTED20_FETCH_TOKEN, as a one-shot -c header; never printed, never written to config.
function fetchPre() {
  const token = process.env.HOSTED20_FETCH_TOKEN;
  if (!token) return [];
  const basic = Buffer.from('x-access-token:' + token, 'utf8').toString('base64');
  return ['-c', 'http.extraHeader=AUTHORIZATION: basic ' + basic];
}
function island(invFile, authFile, dir, remoteUrl) {
  const { inv } = loadInventory(invFile, authFile);
  need(!fs.existsSync(dir), 'ISLAND_EXISTS');
  fs.mkdirSync(dir, { recursive: true });
  git(dir, ['init', '--quiet', '--initial-branch=hosted20-proof']);
  for (const [k, v] of [['gc.auto', '0'], ['maintenance.auto', 'false'], ['core.autocrlf', 'false'], ['fetch.writeCommitGraph', 'false'],
    ['extensions.partialClone', 'origin'], ['remote.origin.url', remoteUrl], ['remote.origin.promisor', 'true'], ['remote.origin.partialCloneFilter', 'blob:none']])
    git(dir, ['config', k, v]);
  // 1. Named commits only: blobless, no tags, depth one, no refspec beyond the exact commit.
  for (const [name, r] of Object.entries(inv.refs)) {
    need(/^[A-Za-z0-9]+$/.test(name), 'REF_NAME');
    git(dir, [...fetchPre(), 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', '--recurse-submodules=no', '--filter=blob:none', '--depth=1',
      'origin', r.commit + ':refs/proof/' + name]);
    need(out(git(dir, ['rev-parse', '--verify', 'refs/proof/' + name + '^{commit}'])) === r.commit, 'COMMIT_IDENTITY');
    need(out(git(dir, ['rev-parse', '--verify', r.commit + '^{tree}'])) === r.tree, 'TREE_IDENTITY');
  }
  // 2. The server honoured the filter: no blob exists yet, only reviewed commits and trees.
  assertInventoryExact(inv, dir, { blobsExpected: [] });
  // 3. Hydrate exactly the inventoried blob IDs, and nothing that is not in the inventory.
  const blobs = expectedBlobs(inv);
  git(dir, [...fetchPre(), '-c', 'fetch.negotiationAlgorithm=noop', 'fetch', '--quiet', '--no-tags', '--no-write-fetch-head', '--recurse-submodules=no',
    '--filter=blob:none', '--stdin', 'origin'], { input: blobs.join('\n') + '\n' });
  // 4. Each ref:path names the reviewed blob, and the bytes hash to it.
  for (const p of activePairs(inv)) {
    need(out(git(dir, ['rev-parse', '--verify', p.commit + ':' + p.path])) === p.blob, 'PAIR_OBJECT_ID');
    need(gitBlobId(git(dir, ['cat-file', 'blob', p.blob]).stdout) === p.blob, 'PAIR_BYTES');
  }
  for (const f of activeFiles(inv)) need(out(git(dir, ['rev-parse', '--verify', inv.refs.current.commit + ':' + f.path])) === f.blob, 'CURRENT_OBJECT_ID');
  assertInventoryExact(inv, dir, { blobsExpected: blobs });
  // 5. Index and detached HEAD at current, from trees only (no checkout).
  git(dir, ['read-tree', inv.refs.current.commit]);
  git(dir, ['update-ref', '--no-deref', 'HEAD', inv.refs.current.commit]);
  return { commits: Object.keys(inv.refs).length, blobs: blobs.length };
}
function materialize(invFile, authFile, dir) {
  const { inv } = loadInventory(invFile, authFile);
  let n = 0;
  for (const f of activeFiles(inv)) {
    const target = path.join(dir, ...f.path.split('/'));
    need(path.resolve(target).startsWith(path.resolve(dir) + path.sep), 'MATERIALIZE_ESCAPE');
    need(!fs.existsSync(target), 'MATERIALIZE_EXISTS');
    const bytes = git(dir, ['cat-file', 'blob', f.blob]).stdout;
    need(gitBlobId(bytes) === f.blob, 'MATERIALIZE_BYTES');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes, { flag: 'wx', mode: f.mode === '100755' ? 0o755 : 0o644 });
    n += 1;
  }
  return { files: n };
}

function gitDir(dir) { return path.join(dir, '.git'); }
function seal(invFile, authFile, dir) {
  loadInventory(invFile, authFile);
  for (const name of out(git(dir, ['remote'])).split('\n').filter(Boolean)) git(dir, ['remote', 'remove', name]);
  for (const key of ['extensions.partialClone', 'remote.origin.promisor', 'remote.origin.partialCloneFilter'])
    git(dir, ['config', '--unset-all', key], { allowFail: true });
  const g = gitDir(dir);
  const packDir = path.join(g, 'objects', 'pack');
  for (const n of fs.existsSync(packDir) ? fs.readdirSync(packDir) : []) if (n.endsWith('.promisor')) fs.rmSync(path.join(packDir, n));
  for (const f of ['objects/info/alternates', 'objects/info/http-alternates', 'FETCH_HEAD', 'ORIG_HEAD'].map((x) => path.join(g, ...x.split('/'))))
    fs.rmSync(f, { force: true });
  for (const ref of out(git(dir, ['for-each-ref', '--format=%(refname)', 'refs/replace/'])).split('\n').filter(Boolean)) git(dir, ['update-ref', '-d', ref]);
  fs.rmSync(path.join(g, 'refs', 'replace'), { recursive: true, force: true });
  return { sealed: true };
}
function assertSealed(dir) {
  need(out(git(dir, ['remote'])) === '', 'REMOTE_PRESENT');
  const cfg = out(git(dir, ['config', '--local', '--list'])).toLowerCase();
  need(!/(^|\n)(remote\.|extensions\.partialclone|.*promisor|.*partialclonefilter|url\.|http\.|credential\.|include)/.test(cfg), 'CONFIG_NOT_CLEAN');
  const g = gitDir(dir);
  need(!fs.existsSync(path.join(g, 'objects', 'info', 'alternates')), 'ALTERNATES_PRESENT');
  need(!fs.existsSync(path.join(g, 'objects', 'info', 'http-alternates')), 'HTTP_ALTERNATES_PRESENT');
  const packDir = path.join(g, 'objects', 'pack');
  need(!(fs.existsSync(packDir) ? fs.readdirSync(packDir) : []).some((n) => n.endsWith('.promisor')), 'PROMISOR_FILE_PRESENT');
  need(out(git(dir, ['for-each-ref', 'refs/replace/'])) === '', 'REPLACE_REF_PRESENT');
  need(!fs.existsSync(path.join(g, 'FETCH_HEAD')), 'FETCH_HEAD_PRESENT');
}
function probe(invFile, authFile, dir) {
  const { inv } = loadInventory(invFile, authFile);
  const v = /git version (\d+)\.(\d+)/.exec(out(git(dir, ['--version'])));
  need(v && (Number(v[1]) > 2 || (Number(v[1]) === 2 && Number(v[2]) >= 44)), 'GIT_TOO_OLD_FOR_NO_LAZY_FETCH');
  assertSealed(dir);
  need(out(git(dir, ['rev-parse', '--verify', 'HEAD'])) === inv.refs.current.commit, 'HEAD_NOT_CURRENT');
  const refs = out(git(dir, ['for-each-ref', '--format=%(objectname) %(refname)'])).split('\n').filter(Boolean).sort();
  need(JSON.stringify(refs) === JSON.stringify(Object.entries(inv.refs).map(([k, r]) => r.commit + ' refs/proof/' + k).sort()), 'REFS_NOT_EXACT');
  const blobs = expectedBlobs(inv);
  assertInventoryExact(inv, dir, { blobsExpected: blobs });
  // Allowed reads pass, through the same command form the tests use.
  for (const p of activePairs(inv)) need(gitBlobId(git(dir, ['show', p.commit + ':' + p.path]).stdout) === p.blob, 'ALLOWED_PROBE_FAILED');
  if (activeFiles(inv).some((f) => f.path === 'src/app.jsx'))
    need(out(git(dir, ['rev-parse', '--verify', 'fe516c1^{commit}'])) === inv.refs.frozenApp.commit, 'ABBREVIATION_NOT_UNIQUE');
  for (const f of activeFiles(inv)) {
    const bytes = fs.readFileSync(path.join(dir, ...f.path.split('/')));
    need(gitBlobId(bytes) === f.blob, 'WORKTREE_BYTES');
  }
  // Forbidden reads fail: the object is absent and no lazy fetch can supply it.
  for (const rp of inv.forbiddenProbes.refPaths) {
    const [refKey, ...rest] = rp.split(':');
    const commit = inv.refs[refKey] && inv.refs[refKey].commit;
    need(HEX40.test(commit || ''), 'PROBE_REF');
    const r = git(dir, ['cat-file', '-e', commit + ':' + rest.join(':')], { allowFail: true });
    need(r.status !== 0, 'FORBIDDEN_PROBE_READABLE');
    const s = git(dir, ['show', commit + ':' + rest.join(':')], { allowFail: true });
    need(s.status !== 0 && s.stdout.length === 0, 'FORBIDDEN_PROBE_READABLE');
  }
  for (const p of inv.forbiddenProbes.worktreePaths) need(!fs.existsSync(path.join(dir, ...p.split('/'))), 'FORBIDDEN_WORKTREE_PATH');
  assertInventoryExact(inv, dir, { blobsExpected: blobs });
  return { probes: activePairs(inv).length + inv.forbiddenProbes.refPaths.length };
}

const COUNTERS = ['tests', 'suites', 'pass', 'fail', 'cancelled', 'skipped', 'todo'];
// Exactly one summary line per counter, integers, and they must add up; anything else is malformed.
function tapCounters(text) {
  const c = {};
  for (const k of COUNTERS) {
    const hits = [...text.matchAll(new RegExp('^# ' + k + ' (\\d+)\\r?$', 'gm'))];
    if (hits.length !== 1) return null;
    c[k] = Number(hits[0][1]);
  }
  if (c.tests < 1 || c.pass + c.fail + c.cancelled + c.skipped + c.todo !== c.tests) return null;
  return c;
}
function hashFile(f) { return sha256(fs.readFileSync(f)); }
function run(invFile, authFile, dir, rawDir, receiptFile) {
  const { inv, raw, auth, authRaw } = loadInventory(invFile, authFile);
  probe(invFile, authFile, dir);
  if (inv.kind === 'hosted20-frozen-inventory') {
    const specBytes = fs.readFileSync(path.join(dir, ...inv.specPath.split('/')));
    need(sha256(specBytes) === inv.specSha256, 'SPEC_SHA256');
    const nulls = JSON.parse(specBytes.toString('utf8')).children.filter((c) => c.needle === null);
    need(nulls.length === 20 && nulls.every((c, i) => c.name === inv.groups[i].name && JSON.stringify(c.argv) === JSON.stringify(inv.groups[i].argv)), 'ARGV_NOT_CANONICAL');
  }
  need(!fs.existsSync(rawDir), 'RAW_DIR_EXISTS');
  fs.mkdirSync(rawDir, { recursive: false, mode: 0o700 });
  const childTmp = path.join(rawDir, 'tmp');
  const home = path.join(rawDir, 'home');
  fs.mkdirSync(childTmp, { mode: 0o700 }); fs.mkdirSync(home, { mode: 0o700 });
  const env = gitEnv({ HOME: home, TMPDIR: childTmp, TMP: childTmp, TEMP: childTmp, TZ: 'America/New_York',
    MEASURED_TEST_NOW: '2026-09-03', GIT_CEILING_DIRECTORIES: path.dirname(path.resolve(dir)), LANG: 'C.UTF-8' });
  delete env.LC_ALL;
  const rows = []; let red = false; let held = 0;
  const started = Date.now();
  const budget = runBudgetMs(inv);
  for (let i = 0; i < inv.groups.length; i += 1) {
    const g = inv.groups[i];
    if (inv.__held.has(g.name)) {
      held += 1;
      rows.push({ name: g.name, held: true, code: HELD_CODE, exit: null, signal: null, spawnError: null,
        counters: null, countersWellFormed: false, stdoutSha256: null, stderrSha256: null });
      continue;
    }
    const left = budget - (Date.now() - started);
    if (left <= 0) {
      red = true;
      rows.push({ name: g.name, held: false, code: 'NOT_RUN_BUDGET_EXHAUSTED', exit: null, signal: null, spawnError: null,
        counters: null, countersWellFormed: false, stdoutSha256: null, stderrSha256: null });
      continue;
    }
    const base = path.join(rawDir, String(i).padStart(2, '0'));
    const outFd = fs.openSync(base + '.stdout', 'wx', 0o600);
    const errFd = fs.openSync(base + '.stderr', 'wx', 0o600);
    const r = spawnSync(process.execPath, g.argv, { cwd: dir, env, stdio: ['ignore', outFd, errFd], windowsHide: true,
      timeout: Math.min(PER_GROUP_MS, left), killSignal: 'SIGKILL' });
    fs.closeSync(outFd); fs.closeSync(errFd);
    const stdout = fs.readFileSync(base + '.stdout');
    const counters = tapCounters(stdout.toString('utf8'));
    const exit = Number.isInteger(r.status) ? r.status : null;
    const timedOut = !!(r.error && r.error.code === 'ETIMEDOUT');
    const bad = r.error || exit !== 0 || r.signal || !counters || counters.fail || counters.cancelled || counters.skipped || counters.todo;
    if (bad) red = true;
    rows.push({ name: g.name, held: false, code: timedOut ? 'TIMEOUT' : (bad ? 'RED' : 'PASS'), exit, signal: r.signal || null,
      spawnError: r.error ? String(r.error.code || 'SPAWN_ERROR') : null,
      counters, countersWellFormed: !!counters, stdoutSha256: sha256(stdout), stderrSha256: hashFile(base + '.stderr') });
  }
  // Never all-green while anything is held: RED beats HELD_INCOMPLETE beats PASS.
  const verdict = red ? 'RED' : (held ? 'HELD_INCOMPLETE' : 'PASS');
  const receipt = { version: 1, kind: inv.kind, sourceHead: inv.sourceHead, specSha256: inv.specSha256 || null,
    inventorySha256: sha256(raw), authorizationSha256: sha256(authRaw), runnerSha256: hashFile(__filename), node: process.version,
    pins: { inventorySha256: sha256(raw), runnerSha256: hashFile(__filename), authorizationSha256: sha256(authRaw) },
    authorizedBy: { ledger: auth.authorizedBy.ledger, decisionsLine: auth.authorizedBy.decisionsLine, ownerQuoteSha256: sha256(auth.authorizedBy.ownerQuote) },
    runnerEnvironment: runnerEnvironment(),
    git: out(git(dir, ['--version'])).replace(/^git version /, ''), tools: toolHashes(dir, inv),
    runBudgetMs: budget, perGroupTimeoutMs: PER_GROUP_MS, heldCount: held, groups: rows, verdict };
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx', mode: 0o644 });
  for (const row of rows) {
    const c = row.counters;
    if (row.held || row.code === 'NOT_RUN_BUDGET_EXHAUSTED') { process.stdout.write(`GROUP ${row.name} ${row.code}\n`); continue; }
    process.stdout.write(`GROUP ${row.name} ${row.code} EXIT ${row.exit} ` + (c ? `TESTS ${c.tests} PASS ${c.pass} FAIL ${c.fail} SKIP ${c.skipped} TODO ${c.todo} CANCELLED ${c.cancelled}` : 'COUNTERS MALFORMED')
      + ` STDOUT ${row.stdoutSha256} STDERR ${row.stderrSha256}\n`);
  }
  process.stdout.write(`VERDICT ${verdict} HELD ${held} INVENTORY ${receipt.inventorySha256} AUTHORIZATION ${receipt.authorizationSha256} RUNNER ${receipt.runnerSha256}\n`);
  return red ? 1 : (held ? 2 : 0);
}
// The hosted image cannot be pinned; its identity is recorded instead (accepted limitation).
function runnerEnvironment() {
  const u = spawnSync('uname', ['-a'], { encoding: 'utf8', windowsHide: true });
  const osm = require('node:os');
  return { imageOS: process.env.ImageOS || null, imageVersion: process.env.ImageVersion || null,
    uname: !u.error && u.status === 0 ? u.stdout.trim() : null, osType: osm.type(), osRelease: osm.release(), arch: process.arch };
}
// 45 minutes per group; 300 minutes for all groups (the job allows 355). Exhaustion is an explicit RED.
const PER_GROUP_MS = 45 * 60 * 1000;
function runBudgetMs(inv) {
  const o = Number(process.env.HOSTED20_SELFTEST_BUDGET_MS);
  if (inv.kind === 'synthetic-selftest' && Number.isInteger(o) && o > 0) return o;
  return 300 * 60 * 1000;
}
// Lockfile and dependency-tree identities (hashes only).
function toolHashes(dir, inv) {
  const out_ = {};
  for (const f of (inv.dependencyInputs || [])) { const p = path.join(dir, ...f.split('/')); out_[f] = fs.existsSync(p) ? hashFile(p) : null; }
  for (const d of (inv.dependencyTrees || [])) out_[d] = treeHash(path.join(dir, ...d.split('/')));
  return out_;
}
function treeHash(root) {
  if (!fs.existsSync(root)) return null;
  const lines = [];
  const walk = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const p = path.join(d, e.name), r = rel ? rel + '/' + e.name : e.name;
      if (e.isSymbolicLink()) lines.push('L ' + r + ' ' + fs.readlinkSync(p));
      else if (e.isDirectory()) walk(p, r);
      else if (e.isFile()) lines.push('F ' + r + ' ' + hashFile(p));
    }
  };
  walk(root, '');
  return sha256(lines.join('\n') + '\n');
}

const COMMANDS = { island: [4, island], materialize: [3, materialize], seal: [3, seal], probe: [3, probe], run: [5, run] };
function main(argv) {
  const [cmd, ...args] = argv;
  const spec = COMMANDS[cmd];
  need(spec && args.length === spec[0], 'USAGE');
  const result = spec[1](...args.map((a, i) => (i === 3 && cmd === 'island' ? a : path.resolve(a))));
  if (cmd === 'run') return result;
  process.stdout.write(cmd.toUpperCase() + ' OK ' + JSON.stringify(result) + '\n');
  return 0;
}
if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (error) {
    process.stdout.write('STOP ' + (error instanceof Stop ? error.code : 'INTERNAL') + '\n');
    process.exitCode = 3;
  }
}
module.exports = { tapCounters, loadInventory, expectedBlobs };
