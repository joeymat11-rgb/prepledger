'use strict';
// D12 protected second-gate custody (BRIEF-STEP-EFFICACY §3: tools/engine-test.jsx:106 and the
// _engine-surface frozen-baseline equality). Integrator-owned support for the M2-STEP-EFFICACY
// stream; the root's legacy-step-efficacy-carriers.cjs calls runSecondGate.
//
// What it does, every invocation, BEFORE any candidate comparison:
//   1. Pins the frozen public inputs (fe516c1 bytes, on disk and in git) and the ORIGINAL
//      second-gate driver bytes. A changed driver is a re-review, not a pass (STEP-CUSTODY-PENDING).
//   2. Builds the one-expression PROJECTION of the frozen app (the stepEfficacy `* 1000` removed,
//      exactly one occurrence) and derives from it, with the frozen harness clock:
//        expected106  = projected stepEfficacy on the SAME protected snapshot the original
//                       assertion reads (kept in memory / a temp file, never in any output);
//        the projected _engine-surface stdout, which must differ from the committed
//        engine-baseline.json in EXACTLY the four enumerated pointer paths (legacy-gates.exactDelta).
//      It also retains the frozen truth: the unprojected frozen engine must still satisfy the
//      ORIGINAL line-106 predicate, and the projection must flip it — otherwise PENDING.
//   3. Runs a NEGATIVE CONTROL: the carried harness over the unprojected frozen engine must fail
//      at exactly tools/engine-test.jsx:106:5 and nowhere else.
//   4. Loads the pinned ORIGINAL rebuild/engine/test/second-gate.mjs into a DISPOSABLE successor
//      driver (exact one-site substitutions listed in DRIVER_EDITS; disk untouched; no fs/require
//      monkeypatch; no product source injection) and runs it in --candidate mode. Candidate side
//      only, the harness bundle receives ONE exact substitution of the line-106 CONDITION (the `ok(`
//      call, its column, its message and every other byte stay), evaluated against expected106 by a
//      child preload; the candidate surface must byte-equal the projected surface. The reference
//      side is byte-original: frozen engine, original predicate, committed-baseline equality.
// Output is verdict-only: booleans, counts, pointer paths, site coordinates, public hashes of
// public files. No protected value, no cell hash, no prose, no dates from the snapshots.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const legacyGates = require('./legacy-gates.cjs');

const FROZEN_COMMIT = 'fe516c1';
const FROZEN_PINS = Object.freeze({
  'src/app.jsx': 'd1ac52b547beb023df2dc31b1b081487e3ed2e19699377252eb115e0d5faee5c',
  'src/history.js': '5856be715c95a51c74b172ccbbfdf7d53a9b3697db05b064cf6cc2d3739799bb',
  'tools/_fixed-now.mjs': 'ab939a356467d095f357d796f87a6567b9bcb9e0171b17fe4fb0f447916cf5a7',
  'tools/engine-test.jsx': 'df3abc40a8d2b538fc09db4468117f1bb13afa451b264e3e39a8026cf0ef1428',
  'tools/_engine-surface.jsx': 'a14cd8ee7f3655f322c25af6d905b46083a95baf3d0680b76ad742539e4835f9',
  'tools/engine-baseline.json': '432a17da30a1f2274ed7eb674e3bdc0c8af744ccf9c7c76d9011ac3c0deb370c',
  'tools/snapshots/2026-08-06-ledger.json': '62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f',
  'tools/snapshots/2026-08-07-ledger.json': 'b86c20a004eb2822a347fe9d0bf579951de547d7131ddcee40a1824ff59180f9'
});
// The inherited second-gate harness as integrated at a777f64. These are public harness files.
const DRIVER_FILE = 'rebuild/engine/test/second-gate.mjs';
const DRIVER_PINS = Object.freeze({
  'rebuild/engine/test/second-gate.mjs': 'a59e274aa255183298b7180574497fdddb00dcf1f3d06d92b6a106afb7679f8e',
  'rebuild/engine/test/second-gate-preload.cjs': '99027052301b01e355502d675f1f9611ee2ad14ececd99abcbbdc98eb3fe7d58',
  'rebuild/engine/test/second-gate-adapter.mjs': '31726485cd897c4f919922610b4b9bfa8eacde5def0374ed32b5171a08c58c13'
});
// The one product expression D12 corrects, as it reads in the FROZEN app (BRIEF §0/§1).
const PROJECTION = Object.freeze({
  before: 'const slopePer1k = den ? +((num / den) * 1000).toFixed(3) : 0;',
  after: 'const slopePer1k = den ? +(num / den).toFixed(3) : 0;'
});
// The protected assertion: tools/engine-test.jsx:106:5, catalogued as 106:5:1. Only the CONDITION moves.
const SITE_106 = Object.freeze({ file: 'tools/engine-test.jsx', line: 106, column: 5 });
const CONDITION_106 = Object.freeze({
  before: 'ok(se7.status === "LIVE" && se7.resolved === false && Math.abs(se7.slopePer1k) > se7.boundPer1k, ',
  after: 'ok(globalThis[Symbol.for("measured.d12.expect106")](se7), '
});
const PROTECTED_SNAPSHOT = 'tools/snapshots/2026-08-07-ledger.json';   // the snapshot line 106 reads (S7)
// The only surface cells the one-expression projection may move (BRIEF §3; proved 2026-09-06).
const SURFACE_PATHS = Object.freeze([
  ['2026-08-06', 'stepEfficacy', 'slopePer1k'], ['2026-08-06', 'stepEfficacy', 'resolved'],
  ['2026-08-07', 'stepEfficacy', 'slopePer1k'], ['2026-08-07', 'stepEfficacy', 'resolved']
]);
const LEGACY_MKPUSHABLE = Object.freeze({ from: 4805, to: 4826, sites: [4818, 4820, 4821, 4822, 4825, 4826] });
const CUSTODY_SYMBOL = 'measured.d12.step-efficacy-custody';
const HARNESS_ENV = Object.freeze({ MEASURED_TEST_NOW: '2026-07-29', TZ: 'America/New_York', NO_COLOR: '1' }); // the second gate's own clock
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
function fail(code, detail) { const e = new Error(detail ? code + ': ' + detail : code); e.code = code; throw e; }
function pending(detail) { fail('STEP-CUSTODY-PENDING', detail); }
const canon = v => JSON.stringify(v, (k, x) => Object.is(x, -0) ? '__NEG_ZERO__' : x);

// ---- exact one-site substitution (same contract as legacy-carriers.exactReplace) -------------------
function exactReplace(source, before, after, site, edits) {
  if (!before || before === after || source.split(before).length !== 2) fail('CARRIER-ONE-SITE', site);
  edits.push({ site, beforeSha256: sha(before), afterSha256: sha(after), occurrences: 1 });
  return source.replace(before, after);
}

// ---- the disposable successor driver ---------------------------------------------------------------
// Every edit names a public harness line of the ORIGINAL driver; the body of every check it runs
// (source pins, 3072-site catalog, random/network accounting, vacuity, sync-laws, reference surface
// equality, candidate-vs-reference deepEqual) is untouched.
const DRIVER_EDITS = Object.freeze([
  ['custody-context-prologue', '',
    'const __custody = globalThis[Symbol.for(' + JSON.stringify(CUSTODY_SYMBOL) + ')];\nif (!__custody) throw Error("STEP-CUSTODY-PENDING: custody context missing");\n'],
  ['here-root-from-custody',
    'const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, "../../..");',
    'const HERE = __custody.HERE, ROOT = __custody.ROOT;'],
  ['adapter-path-declared',
    'const PRELOAD = path.join(HERE, "second-gate-preload.cjs"), ADAPTER = path.join(HERE, "second-gate-adapter.mjs");',
    'const PRELOAD = path.join(HERE, "second-gate-preload.cjs"), ADAPTER = __custody.adapterPath(path.join(HERE, "second-gate-adapter.mjs"));'],
  ['mode-from-custody',
    'const mode = process.argv[2];\nassert.ok(["--reference","--candidate"].includes(mode) && process.argv.length === 3, "Use --reference or --candidate");',
    'const mode = __custody.mode;\nassert.ok(["--reference","--candidate"].includes(mode), "Use --reference or --candidate");'],
  ['child-preload-declared',
    'const argv = ["--enable-source-maps", "--require", PRELOAD, ...args];',
    'const argv = ["--enable-source-maps", "--require", PRELOAD, ...__custody.extraRequires(side, name), ...args];'],
  ['candidate-harness-load-hook',
    'plugins: side === "candidate" ? [{name:"candidate-engine-only",setup(build){',
    'plugins: side === "candidate" ? [{name:"candidate-engine-only",setup(build){ __custody.candidateLoad(build, entry);'],
  ['surface-successor-comparison',
    '  assert.ok(Buffer.from(surface.output).equals(baseline),"surface stdout must equal committed baseline bytes");\n  console.log("SECOND GATE " + side + " surface: byte-identical to committed baseline (" + baseline.length + " bytes)");',
    '  console.log("SECOND GATE " + side + " " + __custody.surface(side, surface.output, baseline));']
]);
function prepareSuccessorDriver(originalBytes) {
  if (sha(originalBytes) !== DRIVER_PINS[DRIVER_FILE]) pending('DRIVER-PIN: ' + DRIVER_FILE + ' differs from the reviewed original; re-review the substitution sites');
  let source = originalBytes.toString('utf8'); const edits = [];
  for (const [site, before, after] of DRIVER_EDITS) {
    if (before === '') { source = after + source; edits.push({ site, beforeSha256: sha(''), afterSha256: sha(after), occurrences: 1 }); }
    else source = exactReplace(source, before, after, site, edits);
  }
  return { source, edits, originalSha256: sha(originalBytes), successorSha256: sha(source) };
}

// ---- pins ------------------------------------------------------------------------------------------
function git(cwd, args) { return execFileSync('git', args, { cwd, windowsHide: true, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); }
function verifyPins({ root, baseline }) {
  for (const [file, hash] of Object.entries(FROZEN_PINS)) {
    const fromGit = git(baseline, ['show', FROZEN_COMMIT + ':' + file]);
    if (sha(fromGit) !== hash) fail('FROZEN-GIT-PIN', file);
    if (sha(fs.readFileSync(path.join(root, file))) !== hash) fail('FROZEN-DISK-PIN', file);
  }
  for (const [file, hash] of Object.entries(DRIVER_PINS)) {
    if (sha(fs.readFileSync(path.join(root, file))) !== hash) pending('HARNESS-PIN: ' + file + ' is not the reviewed original');
  }
}

// ---- frozen / projected reference engines --------------------------------------------------------
function esbuildFrom(root) {
  const dir = path.join(root, 'node_modules/esbuild');
  if (!fs.existsSync(path.join(dir, 'lib/main.js'))) fail('ESBUILD-MISSING');
  if (JSON.parse(fs.readFileSync(path.join(dir, 'package.json'))).version !== '0.28.1') fail('ESBUILD-VERSION');
  return require(path.join(dir, 'lib/main.js'));
}
// Writes the frozen public sources (optionally projected) into `dir` and bundles __test like legacy-gates.publicReferences.
function buildReferenceBundle({ root, baseline, dir, projected }) {
  const build = esbuildFrom(root); fs.mkdirSync(path.join(dir, 'src'), { recursive: true }); fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  let occurrences = 0, bytesDelta = 0;
  for (const file of ['src/app.jsx', 'src/history.js', 'tools/_fixed-now.mjs']) {
    let bytes = git(baseline, ['show', FROZEN_COMMIT + ':' + file]);
    if (sha(bytes) !== FROZEN_PINS[file]) fail('FROZEN-GIT-PIN', file);
    if (projected && file === 'src/app.jsx') {
      const text = bytes.toString('utf8'); occurrences = text.split(PROJECTION.before).length - 1;
      if (occurrences !== 1) fail('PROJECTION-ONE-SITE');
      const out = text.replace(PROJECTION.before, PROJECTION.after); bytesDelta = Buffer.byteLength(out) - bytes.length; bytes = Buffer.from(out);
    }
    fs.writeFileSync(path.join(dir, file), bytes);
  }
  const entry = path.join(dir, 'entry.mjs'), outfile = path.join(dir, 'engine.cjs');
  fs.writeFileSync(entry, 'import "./tools/_fixed-now.mjs"; import {__test} from "./src/app.jsx"; export {__test};\n');
  build.buildSync({ entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', loader: { '.jsx': 'jsx' }, nodePaths: [path.join(root, 'node_modules')], logLevel: 'silent' });
  return { file: outfile, appPath: path.join(dir, 'src/app.jsx'), appSha256: sha(fs.readFileSync(path.join(dir, 'src/app.jsx'))), occurrences, bytesDelta };
}
function harnessEnv(extra) { const env = { ...process.env, ...HARNESS_ENV, NODE_OPTIONS: '', NODE_V8_COVERAGE: '', ...extra }; delete env.PL_ENGINE; delete env.PL_LAWS_LIB; return env; }
// Reads ONE engine bundle in a fresh child and returns stepEfficacy on the protected snapshot plus the
// original predicate's verdict. The value never leaves this module.
function protectedRead(root, bundle) {
  const script = 'const T=require(process.argv[1]).__test,fs=require("node:fs");const S=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));const se=T.stepEfficacy(S);'
    + 'const pred=se.status==="LIVE"&&se.resolved===false&&Math.abs(se.slopePer1k)>se.boundPer1k;'
    + 'process.stdout.write(JSON.stringify({canon:JSON.stringify(se,(k,x)=>Object.is(x,-0)?"__NEG_ZERO__":x),originalPredicate:pred,status:se.status,resolved:se.resolved,n:se.n,need:se.need,excluded:se.excluded,bound:se.boundPer1k,sign:Math.sign(se.slopePer1k)}));';
  const r = spawnSync(process.execPath, ['-e', script, bundle, path.join(root, PROTECTED_SNAPSHOT)], { cwd: root, env: harnessEnv(), encoding: 'utf8', windowsHide: true, timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0) fail('PROTECTED-READ-FAILED');
  return JSON.parse(r.stdout);
}
function jsonPointerDiff(a, b, p = [], acc = []) {
  const isObj = x => x && typeof x === 'object';
  if (isObj(a) !== isObj(b) || typeof a !== typeof b) { acc.push(p); return acc; }
  if (isObj(a)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { if (!Object.hasOwn(a, k) || !Object.hasOwn(b, k)) acc.push(p.concat(k)); else jsonPointerDiff(a[k], b[k], p.concat(k), acc); } return acc; }
  if (!Object.is(a, b)) acc.push(p); return acc;
}
// esbuild's synchronous API refuses plugins, so plugin builds run in a child of this same file
// (--custody-bundle) and runSecondGate stays synchronous like legacy-carriers.runCarrier.
function bundleTool({ root, entryRel, outfile, redirectApp, withHarnessHook }) {
  const child = spawnSync(process.execPath, [__filename, '--custody-bundle'], { cwd: root, input: JSON.stringify({ root, entryRel, outfile, redirectApp: redirectApp || null, withHarnessHook: !!withHarnessHook }), env: harnessEnv(), encoding: 'utf8', windowsHide: true, timeout: 300000, maxBuffer: 8 * 1024 * 1024 });
  let result; try { result = JSON.parse(child.stdout); } catch { fail('CUSTODY-BUNDLE-FAILED', (child.stderr || '').split('\n')[0]); }
  if (child.status !== 0 || result.code) fail(result.code || 'CUSTODY-BUNDLE-FAILED', result.detail);
  return result;
}
async function bundleWorker({ root, entryRel, outfile, redirectApp, withHarnessHook }) {
  const build = esbuildFrom(root); const redirects = [], counter = { substitutions: 0 };
  const plugins = [{ name: 'd12-custody-tool', setup(b) {
    if (redirectApp) b.onResolve({ filter: /app\.jsx$/ }, a => { if (a.path !== '../src/app.jsx') fail('UNEXPECTED-ENGINE-IMPORT', a.path); redirects.push(path.relative(root, a.importer).split(path.sep).join('/')); return { path: redirectApp }; });
    if (withHarnessHook) makeHarnessLoadHook(counter)(b);
  } }];
  const r = await build.build({ entryPoints: [path.join(root, entryRel)], bundle: true, platform: 'node', jsx: 'automatic', loader: { '.jsx': 'jsx' }, outfile, absWorkingDir: root, nodePaths: [path.join(root, 'node_modules')], logLevel: 'silent', sourcemap: 'linked', sourcesContent: false, metafile: true, plugins });
  const inputs = Object.keys(r.metafile.inputs).map(n => n.split('\\').join('/'));
  if (redirectApp && (redirects.length !== 1 || redirects[0] !== entryRel || inputs.includes('src/app.jsx'))) fail('REDIRECT-INVENTORY');
  return { file: outfile, redirects, inputs, substitutions: counter.substitutions };
}
// The candidate-side harness hook: exactly one substitution of the line-106 condition in the bundled
// copy of tools/engine-test.jsx. The disk file is never touched.
function makeHarnessLoadHook(counter) {
  return b => b.onLoad({ filter: /[\\/]tools[\\/]engine-test\.jsx$/ }, a => {
    const src = fs.readFileSync(a.path);
    if (sha(src) !== FROZEN_PINS['tools/engine-test.jsx']) fail('FROZEN-DISK-PIN', 'tools/engine-test.jsx');
    const text = src.toString('utf8'), at = text.indexOf(CONDITION_106.before);
    const lines = text.slice(0, at).split('\n');
    if (text.split(CONDITION_106.before).length !== 2 || lines.length !== SITE_106.line || lines.at(-1).length + 1 !== SITE_106.column) fail('CARRIER-ONE-SITE', 'engine-test.jsx:106 condition');
    const out = text.replace(CONDITION_106.before, CONDITION_106.after);
    if (out.split('\n').length !== text.split('\n').length) fail('CARRIER-LINE-COUNT');
    counter.substitutions++;
    return { contents: out, loader: 'jsx', resolveDir: path.dirname(a.path) };
  });
}
function writeChildPreload(dir, expectFile, callsFile) {
  const file = path.join(dir, 'd12-expect106-preload.cjs');
  fs.writeFileSync(file, '"use strict";\n// D12 custody: evaluates the carried line-106 condition against the projected-frozen expectation. No logging.\n'
    + 'const fs=require("node:fs");const E=fs.readFileSync(' + JSON.stringify(expectFile) + ',"utf8");let calls=0;\n'
    + 'globalThis[Symbol.for("measured.d12.expect106")]=function(actual){calls++;try{return JSON.stringify(actual,(k,x)=>Object.is(x,-0)?"__NEG_ZERO__":x)===E;}catch{return false;}};\n'
    + 'process.on("exit",()=>{try{fs.writeFileSync(' + JSON.stringify(callsFile) + ',JSON.stringify({calls}));}catch{}});\n');
  return file;
}
function readMeta(file) { if (!fs.existsSync(file)) fail('HARNESS-METADATA-MISSING', path.basename(file)); return JSON.parse(fs.readFileSync(file, 'utf8')); }
const siteKey = a => a.file + ':' + a.line + ':' + a.column;
function siteFacts(meta) {
  const counts = new Map(); for (const a of meta.assertions) counts.set(siteKey(a), (counts.get(siteKey(a)) || 0) + 1);
  return {
    observed: meta.assertions.length, failSites: meta.assertions.filter(a => a.outcome === 'FAIL').map(siteKey),
    site106Occurrences: counts.get(siteKey(SITE_106)) || 0,
    legacyMkPushable: meta.assertions.filter(a => a.file === SITE_106.file && a.line >= LEGACY_MKPUSHABLE.from && a.line <= LEGACY_MKPUSHABLE.to).map(a => a.line + ':' + a.outcome),
    violations: meta.violations, missing: meta.missing, networkCalls: meta.networkCalls, randomCalls: meta.randomCalls
  };
}

// ---- public entry -----------------------------------------------------------------------------------
function runSecondGate({ root, baseline, bundles, acceptance, mode = 'frozen', prototypeCandidateAdapter = false } = {}) {
  if (!root || !fs.existsSync(path.join(root, DRIVER_FILE))) fail('CUSTODY-CONFIG', 'root');
  if (!baseline || !fs.existsSync(baseline)) fail('CUSTODY-CONFIG', 'baseline');
  if (mode !== 'frozen') pending('NATIVE-MODE-UNDEFINED: the inherited second gate runs under its own frozen clock (tools/_fixed-now.mjs); the brief defines no native variant');
  if (!bundles || !bundles.main || !path.isAbsolute(bundles.main) || !fs.existsSync(bundles.main)) fail('CARRIER-FROZEN-BUNDLE');
  if (acceptance !== undefined) { if (!acceptance || typeof acceptance !== 'object') fail('CUSTODY-CONFIG', 'acceptance'); if (acceptance.packageId !== 'M2-STEP-EFFICACY') pending('PACKAGE-PROFILE: acceptance.packageId is not M2-STEP-EFFICACY'); }
  verifyPins({ root, baseline });
  const scratchRoot = path.join(root, '.tmp/d12-step-efficacy-custody'); fs.mkdirSync(scratchRoot, { recursive: true });
  const work = fs.mkdtempSync(path.join(scratchRoot, 'run-'));
  const evidence = { id: 'second-gate', mode, candidateKind: prototypeCandidateAdapter ? 'SOURCE-ONLY PROTOTYPE — projected frozen adapter, NOT the product' : 'rebuild/engine via second-gate-adapter.mjs' };
  try {
    // 1. projection and expectations, before any candidate comparison
    const projected = buildReferenceBundle({ root, baseline, dir: path.join(work, 'projected'), projected: true });
    evidence.projection = { preimageOccurrences: projected.occurrences, bytesDelta: projected.bytesDelta, projectedAppSha256: projected.appSha256 };
    const frozenRead = protectedRead(root, bundles.main), projectedRead = protectedRead(root, projected.file);
    if (!frozenRead.originalPredicate) pending('FROZEN-TRUTH-MOVED: the unprojected frozen engine no longer satisfies the original line-106 predicate');
    if (projectedRead.originalPredicate) pending('PROJECTION-DOES-NOT-FLIP-106: the one-expression projection leaves the original predicate true; no carrier is warranted');
    const unchanged = ['status', 'n', 'need', 'excluded', 'bound'].every(k => Object.is(frozenRead[k], projectedRead[k]));
    if (!unchanged || frozenRead.sign !== projectedRead.sign) pending('PROJECTION-MOVED-UNRELATED-FIELDS');
    evidence.expected106 = { derivedFrom: 'frozen ' + FROZEN_COMMIT + ' src/app.jsx + one-expression projection, harness clock', frozenSatisfiesOriginalPredicate: true, projectedSatisfiesOriginalPredicate: false, statusUnchanged: true, nNeedExcludedBoundUnchanged: true, signPreserved: true, resolvedFlips: frozenRead.resolved !== projectedRead.resolved };
    const expectFile = path.join(work, 'expected106.canon'); fs.writeFileSync(expectFile, projectedRead.canon);
    // surface expectation: projected surface vs committed baseline in exactly the four enumerated paths
    const preload = path.join(root, 'rebuild/engine/test/second-gate-preload.cjs');
    const surfaceBundle = bundleTool({ root, entryRel: 'tools/_engine-surface.jsx', outfile: path.join(work, 'projected-surface.cjs'), redirectApp: projected.appPath });
    const surfaceRun = spawnSync(process.execPath, ['--enable-source-maps', '--require', preload, surfaceBundle.file], { cwd: root, env: harnessEnv({ M2_SECOND_GATE_META: path.join(work, 'projected-surface.meta.json') }), encoding: 'utf8', windowsHide: true, timeout: 300000, maxBuffer: 64 * 1024 * 1024 });
    const surfaceMeta = readMeta(path.join(work, 'projected-surface.meta.json'));
    if (surfaceRun.status !== 0 || surfaceMeta.violations.length || surfaceMeta.missing.length) fail('PROJECTED-SURFACE-FAILED');
    const baselineBytes = fs.readFileSync(path.join(root, 'tools/engine-baseline.json')), projectedSurface = Buffer.from(surfaceRun.stdout);
    const baselineJson = JSON.parse(baselineBytes.toString('utf8')), projectedJson = JSON.parse(surfaceRun.stdout);
    const changed = jsonPointerDiff(baselineJson, projectedJson).map(p => p.join('/')).sort(), expectedPaths = SURFACE_PATHS.map(p => p.join('/')).sort();
    if (JSON.stringify(changed) !== JSON.stringify(expectedPaths)) pending('SURFACE-DELTA-UNEXPECTED: ' + JSON.stringify(changed));
    const at = (o, p) => p.reduce((n, k) => n[k], o);
    legacyGates.exactDelta(baselineJson, projectedJson, SURFACE_PATHS.map(p => ({ id: p.join('/'), path: p, before: at(baselineJson, p), after: at(projectedJson, p) })));
    evidence.surface = { committedBaselineSha256: sha(baselineBytes), pointerPathsChangedByProjection: expectedPaths, exactDelta: 'PASS' };
    // 2. negative control: carried harness over the UNPROJECTED frozen engine fails at 106:5 only
    const callsFile = path.join(work, 'calls.json'), childPreload = writeChildPreload(work, expectFile, callsFile);
    const negBundle = bundleTool({ root, entryRel: 'tools/engine-test.jsx', outfile: path.join(work, 'negative-control.cjs'), redirectApp: null, withHarnessHook: true });
    if (negBundle.substitutions !== 1) fail('CARRIER-ONE-SITE', 'negative control');
    const neg = spawnSync(process.execPath, ['--enable-source-maps', '--require', preload, '--require', childPreload, negBundle.file], { cwd: root, env: harnessEnv({ M2_SECOND_GATE_META: path.join(work, 'negative.meta.json') }), encoding: 'utf8', windowsHide: true, timeout: 600000, maxBuffer: 64 * 1024 * 1024 });
    const negFacts = siteFacts(readMeta(path.join(work, 'negative.meta.json'))), negCalls = JSON.parse(fs.readFileSync(callsFile, 'utf8')).calls;
    if (neg.status === 0 || JSON.stringify(negFacts.failSites) !== JSON.stringify([siteKey(SITE_106)]) || negCalls !== 1) fail('NEGATIVE-CONTROL-NOT-SPECIFIC', JSON.stringify(negFacts.failSites));
    evidence.negativeControl = { engine: 'unprojected frozen', exitNonZero: true, failSites: negFacts.failSites, observedBeforeHarnessExit: negFacts.observed, expect106Calls: negCalls, violations: negFacts.violations };
    fs.rmSync(callsFile, { force: true });
    // 3. the disposable successor driver, candidate mode
    const prepared = prepareSuccessorDriver(fs.readFileSync(path.join(root, DRIVER_FILE)));
    const driverFile = path.join(work, 'second-gate-successor.mjs'); fs.writeFileSync(driverFile, prepared.source);
    let adapterPath = null;
    if (prototypeCandidateAdapter) {
      adapterPath = path.join(work, 'projected', 'prototype-candidate-adapter.mjs');
      fs.writeFileSync(adapterPath, '// SOURCE-ONLY PROTOTYPE — the projected FROZEN app standing in for a candidate. NOT the product, NOT acceptance evidence.\nimport "./tools/_fixed-now.mjs";\nexport { __test } from "./engine.cjs";\n');
    }
    const config = { root, HERE: path.join(root, 'rebuild/engine/test'), driverFile, adapterPath, childPreload, expectedSurfaceFile: path.join(work, 'projected-surface.json'), committedBaselineSha256: sha(baselineBytes), callsFile, resultFile: path.join(work, 'driver-result.json') };
    fs.writeFileSync(config.expectedSurfaceFile, projectedSurface);
    const worker = spawnSync(process.execPath, [__filename, '--custody-worker'], { cwd: root, input: JSON.stringify(config), env: harnessEnv(), encoding: 'utf8', windowsHide: true, timeout: 900000, maxBuffer: 64 * 1024 * 1024 });
    if (worker.error || !fs.existsSync(config.resultFile)) fail('CUSTODY-WORKER-FAILED', (worker.stderr || '').split('\n')[0]);
    const result = JSON.parse(fs.readFileSync(config.resultFile, 'utf8'));
    if (result.code) fail(result.code, result.detail);
    const gateLines = result.lines.filter(l => /^SECOND GATE /.test(l));
    if (worker.status !== 0 || result.exitCode !== 0 || !gateLines.some(l => /^SECOND GATE candidate: PASS;/.test(l))) fail('LEGACY-GATE-second-gate', result.lines.filter(l => /FAIL/.test(l)).slice(0, 3).join(' | '));
    if (result.counters.substitutions !== 1 || result.counters.surfaceCalls.reference !== 1 || result.counters.surfaceCalls.candidate !== 1) fail('CUSTODY-COUNTERS', JSON.stringify(result.counters));
    const calls = JSON.parse(fs.readFileSync(callsFile, 'utf8')).calls; if (calls !== 1) fail('CUSTODY-EXPECT106-CALLS', String(calls));
    const out = path.join(root, '.tmp/m2-second-gate');
    const ref = siteFacts(readMeta(path.join(out, 'reference-engine-test.metadata.json'))), cand = siteFacts(readMeta(path.join(out, 'candidate-engine-test.metadata.json')));
    const catalog = JSON.parse(fs.readFileSync(path.join(root, 'rebuild/engine/test/second-gate-assertions.json'), 'utf8'));
    if (cand.observed !== catalog.total || ref.observed !== catalog.total || cand.failSites.length || ref.failSites.length || cand.site106Occurrences !== 1) fail('CUSTODY-SITE-ACCOUNTING');
    if (JSON.stringify(cand.legacyMkPushable) !== JSON.stringify(LEGACY_MKPUSHABLE.sites.map(l => l + ':PASS'))) fail('LEGACY-MKPUSHABLE-MOVED', JSON.stringify(cand.legacyMkPushable));
    evidence.driver = { original: DRIVER_FILE, originalSha256: prepared.originalSha256, successorSha256: prepared.successorSha256, edits: prepared.edits, diskUntouched: sha(fs.readFileSync(path.join(root, DRIVER_FILE))) === DRIVER_PINS[DRIVER_FILE] };
    evidence.custody = { substitutions: result.counters.substitutions, expect106Calls: calls, surfaceCalls: result.counters.surfaceCalls, carriedSite: siteKey(SITE_106), carriedSiteOccurrences: cand.site106Occurrences };
    evidence.gate = { lines: gateLines, catalogTotal: catalog.total, referenceObserved: ref.observed, candidateObserved: cand.observed, failSites: cand.failSites, legacyMkPushable: cand.legacyMkPushable, randomCallsEqual: ref.randomCalls === cand.randomCalls, networkCalls: [ref.networkCalls, cand.networkCalls], violations: [ref.violations, cand.violations] };
    const status = prototypeCandidateAdapter ? 'PROTOTYPE' : 'PASS';
    return { ...evidence, status, tail: 'SECOND-GATE SUCCESSOR ' + status + ' — ' + catalog.total + ' original sites/multiplicities intact; one carried condition at ' + siteKey(SITE_106) + ' (source-derived expectation, ' + calls + ' call); surface: reference byte-identical to committed baseline, candidate byte-identical to the frozen one-expression projection (' + expectedPaths.length + ' enumerated cells); LEGACY-MKPUSHABLE ' + LEGACY_MKPUSHABLE.sites.length + '/' + LEGACY_MKPUSHABLE.sites.length + ' PASS; negative control failed exactly ' + siteKey(SITE_106) + (prototypeCandidateAdapter ? '; CANDIDATE IS A SOURCE-ONLY PROTOTYPE, NOT THE PRODUCT' : '') };
  } finally { fs.rmSync(work, { recursive: true, force: true }); }
}

// ---- worker: runs the disposable successor driver with the custody context ---------------------------
async function custodyWorker(config) {
  const counters = { substitutions: 0, surfaceCalls: { reference: 0, candidate: 0 } };
  const expectedSurface = fs.readFileSync(config.expectedSurfaceFile);
  const custody = {
    HERE: config.HERE, ROOT: config.root, mode: '--candidate',
    adapterPath: original => config.adapterPath || original,
    extraRequires: (side, name) => side === 'candidate' && name === 'engine-test' ? ['--require', config.childPreload] : [],
    candidateLoad(build, entry) { if (entry === 'tools/engine-test.jsx') makeHarnessLoadHook(counters)(build); else if (entry !== 'tools/_engine-surface.jsx') fail('UNEXPECTED-CANDIDATE-ENTRY', entry); },
    surface(side, output, baseline) {
      counters.surfaceCalls[side]++;
      if (sha(baseline) !== config.committedBaselineSha256) fail('FROZEN-DISK-PIN', 'tools/engine-baseline.json');
      if (side === 'reference') { if (!Buffer.from(output).equals(baseline)) fail('REFERENCE-SURFACE-MOVED'); return 'surface: byte-identical to committed baseline (' + baseline.length + ' bytes)'; }
      if (!Buffer.from(output).equals(expectedSurface)) fail('CANDIDATE-SURFACE-NOT-PROJECTION');
      return 'surface: byte-identical to the frozen one-expression projection; ' + SURFACE_PATHS.length + ' enumerated cells differ from the committed baseline (' + baseline.length + ' bytes)';
    }
  };
  globalThis[Symbol.for(CUSTODY_SYMBOL)] = custody;
  const lines = []; const capture = (...a) => lines.push(a.map(String).join(' '));
  console.log = capture; console.error = capture;
  let code = null, detail = null;
  try { await import(pathToFileURL(config.driverFile).href); } catch (e) { code = e.code || 'CUSTODY-DRIVER-THREW'; detail = String(e.message).split('\n')[0]; }
  fs.writeFileSync(config.resultFile, JSON.stringify({ lines, exitCode: process.exitCode || 0, counters, code, detail }));
}

module.exports = { FROZEN_COMMIT, FROZEN_PINS, DRIVER_FILE, DRIVER_PINS, DRIVER_EDITS, PROJECTION, SITE_106, CONDITION_106, SURFACE_PATHS, LEGACY_MKPUSHABLE, exactReplace, prepareSuccessorDriver, verifyPins, buildReferenceBundle, runSecondGate };
if (require.main === module) {
  const arg = process.argv.length === 3 ? process.argv[2] : null;
  if (arg === '--custody-worker') custodyWorker(JSON.parse(fs.readFileSync(0, 'utf8'))).catch(e => { process.stderr.write(String(e && e.message)); process.exitCode = 1; });
  else if (arg === '--custody-bundle') bundleWorker(JSON.parse(fs.readFileSync(0, 'utf8'))).then(r => process.stdout.write(JSON.stringify(r))).catch(e => { process.stdout.write(JSON.stringify({ code: e.code || 'CUSTODY-BUNDLE-FAILED', detail: String(e && e.message).split('\n')[0] })); process.exitCode = 1; });
  else fail('CUSTODY-CLI');
}
