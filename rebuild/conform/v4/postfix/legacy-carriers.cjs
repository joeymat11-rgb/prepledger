'use strict';
// Versioned successor of exact, immutable M2 test sources. This never substitutes
// product bytes or intercepts fs/require: every candidate call uses root/engine.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const crypto = require('node:crypto'), Module = require('node:module');
const { execFileSync, spawnSync } = require('node:child_process');
const ORIGINAL_COMMIT = '614e20315b01543d3b7bbc4fa1fe8a5c20bcb690';
const ORIGINAL_PINS = Object.freeze({
  'migrate-source': 'b9fe1f7073e97e7af240bc31aed145b7ebafb293f4ce2afd95dbff187eeb3f4c',
  'merge-source': '5793fef1233904559120c0fff5d71e1b8d8c6599d3db9e7403a1f2c6a3f24450',
  'writers-source': 'a99c93e8cbb3939af8a83132e7f73065946c28c0a7b30aba8e59f831d25ad1bb',
  'defect-witnesses-5': '024be3cd3e76d2f6854defda9e5c989f750a5ea9efde25a30b625f1233fbc27b',
  'migrate-differential': 'fcc8cf83824d80c29eeb500275c3ed3ec3b14184ec4b8911d23129b18972ed8d',
  'migrate-reference': '1a8a2a85de01dd91cea3d282a94745f8fe731f9cd0db6c31b594c196ca664a50'
});
const CARRIER_IDS = Object.freeze(Object.keys(ORIGINAL_PINS).filter(n => n !== 'migrate-reference'));
const SOURCE_IDS = CARRIER_IDS.filter(n => n.endsWith('-source'));
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
function fail(code) { const e = new Error(code); e.code = code; throw e; }
function exactReplace(source, before, after, site, edits) {
  if (!before || before === after || source.split(before).length !== 2) fail('CARRIER-ONE-SITE:' + site);
  edits.push({ site, beforeSha256: sha(before), afterSha256: sha(after), occurrences: 1 });
  return source.replace(before, after);
}
function differentialLabels() {
  return [
    ...[null, undefined, 0, 1, 2, ...Array.from({ length: 57 }, (_, i) => i + 3), 60, 61].map(v => 'migrate exit ' + (v === null ? 'null' : v === undefined ? 'undefined' : 'v' + v)),
    'v1 hack3 nondefault clock',
    ...['empty', 'both prefixes', 'mixed suffixes', 'invalid calendar throws after progress', 'partial throwing key', 'future key', 'UTC DST bump'].map(x => 'V51 drafts ' + x),
    'V51 throwing length', 'V51 default facade', 'V51 null facade caught boundary', 'V51 current-day session false', 'V51 current-day session true',
    'V60 instance seed marker true', 'V60 instance seed marker false',
    ...['string', 'tied numeric', 'advanced numeric', 'wrong sets'].map(x => 'V60 vector ' + x),
    'V60 seam receipt and order', 'anchorDexa deterministic IDs and clone identity', 'correction stamp injected clock and repeat', 'correction filing live monotonic and duplicate identity',
    ...['none', 'read value', 'last date', 'read count', 'night count', 'food count', 'session count', 'null'].map(x => 'isPristineSeed ' + x),
    ...['reads', 'nights', 'food', 'session', 'adjustments', 'tdee', 'anchors', 'correction', 'waist', 'photos', 'permanentReceipt'].map(x => 'guard loss ' + x),
    'guard empty/invalid states',
    ...['duplicate permanent op', 'opless', 'derived', 'missed unresolved', 'missed clean', 'missed sealed', 'missed offWindow'].map(x => 'guard receipts ' + x),
    'guard same-day read deduplication', 'guard filed strike correction plus receipt', 'read receipt full prose/order and repeat', 'rename .from full-state DTO gap',
    'mint qualifying full writer closure', ...['one sighting', 'hot opener', 'missing receipt', 'active debut', 'nonnumeric load'].map(x => 'mint nonqualifying ' + x),
    'boot does not mint qualifying sightings', 'explicit reconcile mint invokes writer'
  ];
}
const DIFFERENTIAL_DELTAS = Object.freeze({
  'migrate exit v61': 'D35: only sleep null and absent reads/dailyLogs restored on shared result and two snapshots',
  'isPristineSeed read value': 'D34: result true -> false; input unchanged',
  'guard loss reads': 'D33: append readidentity "2026-08-30" after the original reasons',
  'guard loss session': 'D33: append entryidentity ["2026-08-30","rows"] after the original reasons',
  'guard filed strike correction plus receipt': 'D33: scalar to:1 is invalid; safe false, setidentity ["2026-08-30","rows",1]'
});
const WITNESS_IDS = Object.freeze(['D33', 'D34', 'D35', 'D36']);
const STRIKE_POSITIVE_LABEL = 'successor genuine filed strike payload plus exact receipt';
const STRIKE_POSITIVE = `\n// New positive complements, never replaces, the original scalar to:1 negative.
const realFiledStrike = compare('${STRIKE_POSITIVE_LABEL}', T => {
  const prev = guardBase(T), next = clone(prev);
  const row = next.sessionLog['2026-08-30'], entry = row.entries[0];
  entry.reps.pop();
  const op = 'corr:successor-genuine-strike';
  T._fileCorr(row, op, 'strike', 'rows', '2026-08-30T17:00:00.000Z', [{ id: 'rows', reps: [8] }]);
  next.feed.unshift({ d: '2026-08-30', t: 'SET CORRECTED', how: 'Synthetic genuine filed payload.', op });
  return { prev, next, result: T.dataLossGuard(prev, next) };
});
assert.deepEqual(realFiledStrike.result, { safe: true, lost: [] });
`;
function caseInventory(id) {
  if (!CARRIER_IDS.includes(id)) fail('CARRIER-WRONG-TARGET');
  if (id === 'migrate-differential') return [...differentialLabels().map(label => ({ label, disposition: Object.hasOwn(DIFFERENTIAL_DELTAS, label) ? 'replaced-expectation' : 'unchanged', delta: DIFFERENTIAL_DELTAS[label] || null })), { label: STRIKE_POSITIVE_LABEL, disposition: 'additional-positive', delta: null }];
  if (id === 'defect-witnesses-5') return WITNESS_IDS.map(label => ({ label, disposition: label === 'D36' ? 'unchanged' : 'replaced-expectation', delta: label === 'D36' ? null : label }));
  return [{ label: 'entire-pinned-original-program', disposition: 'exact-scoped-source-comparison', delta: id === 'migrate-source' ? 'three declarations' : 'migrate.cjs prior-module assertion' }];
}

function prepareCarrier(id, bytes) {
  if (!CARRIER_IDS.includes(id)) fail('CARRIER-WRONG-TARGET');
  if (sha(bytes) !== ORIGINAL_PINS[id]) fail('CARRIER-ORIGINAL-PIN');
  let source = Buffer.isBuffer(bytes) ? bytes.toString('utf8') : bytes;
  const edits = [];
  const replace = (before, after, site) => { source = exactReplace(source, before, after, site, edits); };
  if (id === 'migrate-source') {
    replace('assert.equal(candidate.slice(from, to), expected + "\\n\\n", "exact declaration " + name);',
      '__carrier.sourceDeclaration(name, candidate.slice(from, to), expected + "\\n\\n");', 'three-reviewed-declarations');
  } else if (id === 'merge-source') {
    replace('assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);',
      'if (file === "migrate") __carrier.priorMigrate(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]));\n  else assert.equal(fs.readFileSync(path.join(ROOT, relative), "utf8"), git(["show", BASE + ":" + relative]), "prior bytes " + file);', 'migrate-prior-module');
  } else if (id === 'writers-source') {
    replace("const p='rebuild/engine/'+name+'.cjs';assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);",
      "const p='rebuild/engine/'+name+'.cjs';if(name==='migrate') __carrier.priorMigrate(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p])); else assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),git(['show',BASE+':'+p]),'prior module '+name);", 'migrate-prior-module');
  } else if (id === 'migrate-differential') {
    replace('const actual = capture(p.C, execute);', 'const actual = capture(p.C, execute);\n  __carrier.differential(label, expected, actual);', 'five-expectations-before-full-comparison');
    replace("if (v === 61) assert.deepEqual(result.oldAfterFirst.sleep, { nights: [], needed: 3 });",
      "if (v === 61) assert.equal(result.oldAfterFirst.sleep, null);", 'future-postcondition');
    source += STRIKE_POSITIVE;
    edits.push({ site: 'additional-genuine-strike-positive-after-all-original-cases', beforeSha256: sha(''), afterSha256: sha(STRIKE_POSITIVE), occurrences: 1 });
  } else {
    replace('const frozen = run(reference()), candidate = run(engine());', 'const frozen = run(reference(), false), candidate = run(engine(), true);\n  __carrier.witness(label, frozen, candidate);', 'exact-old-new-witness-results');
    for (const code of WITNESS_IDS.slice(0, 3)) {
      const label = new RegExp("witness\\('" + code + "[^\\n]+, T => \\{").exec(source)?.[0];
      if (!label) fail('CARRIER-WITNESS-LABEL');
      replace(label, label.replace('T => {', '(T, repaired) => {'), code + '-expected-side');
    }
    replace('assert.deepEqual(T.dataLossGuard(before, fewerSets), { safe: true, lost: [] });',
      'assert.deepEqual(T.dataLossGuard(before, fewerSets), repaired ? { safe: false, lost: [\'setidentity ["2026-09-01","synthetic-lift",2]\'] } : { safe: true, lost: [] });', 'D33-set-result');
    replace('assert.deepEqual(T.dataLossGuard(before, replacedDay), { safe: true, lost: [] });',
      'assert.deepEqual(T.dataLossGuard(before, replacedDay), repaired ? { safe: false, lost: [\'readidentity "2026-09-01"\'] } : { safe: true, lost: [] });', 'D33-read-result');
    replace('assert.notDeepEqual(changed.reads, T.SEED.reads);\n  assert.equal(T.isPristineSeed(changed), true);',
      'assert.notDeepEqual(changed.reads, T.SEED.reads);\n  assert.equal(T.isPristineSeed(changed), !repaired);', 'D34-edited-result');
    replace('assert.notDeepEqual(out, before);\n  assert.deepEqual(out.sleep, { nights: [], needed: 3 });\n  assert.deepEqual(out.reads, []);\n  assert.deepEqual(out.dailyLogs, {});\n  assert.deepEqual(out.sessionLog, {});',
      'if (repaired) assert.deepEqual(out, before); else assert.notDeepEqual(out, before);\n  assert.deepEqual(out.sleep, repaired ? null : { nights: [], needed: 3 });\n  assert.deepEqual(out.reads, repaired ? null : []);\n  assert.deepEqual(out.dailyLogs, repaired ? null : {});\n  assert.deepEqual(out.sessionLog, repaired ? null : {});', 'D35-future-fields');
  }
  return { source, edits, inventory: caseInventory(id), sourceHash: sha(bytes), carrierHash: sha(source) };
}

// Only independently specified output cells change. The unchanged original
// program immediately performs all of its full values/JSON/order/alias checks.
function adjustDifferential(label, expected) {
  assert.equal(expected.error, null, 'frozen case must execute successfully');
  const v = expected.value;
  if (label === 'migrate exit v61') {
    assert.equal(v.old, v.first); assert.equal(v.first, v.second);
    for (const obj of [v.old, v.firstSnapshot, v.oldAfterFirst]) {
      assert.deepEqual(obj.sleep, { nights: [], needed: 3 });
      assert.deepEqual(obj.reads, []); assert.deepEqual(obj.dailyLogs, {});
      obj.sleep = null; delete obj.reads; delete obj.dailyLogs;
    }
  } else if (label === 'isPristineSeed read value') {
    assert.equal(v.result, true); v.result = false;
  } else if (label === 'guard loss reads') {
    assert.deepEqual(v.result, { safe: false, lost: ['reads 1→0'] });
    v.result.lost.push('readidentity "2026-08-30"');
  } else if (label === 'guard loss session') {
    assert.deepEqual(v.result, { safe: false, lost: ['sessionLog 1→0', 'corrections 1→0'] });
    v.result.lost.push('entryidentity ["2026-08-30","rows"]');
  } else if (label === 'guard filed strike correction plus receipt') {
    assert.deepEqual(v.result, { safe: true, lost: [] });
    v.result.safe = false; v.result.lost.push('setidentity ["2026-08-30","rows",1]');
  }
  return expected;
}
function adjustWitness(code, frozen) {
  if (code === 'D33') {
    assert.deepEqual(frozen.setVerdict, { safe: true, lost: [] });
    assert.deepEqual(frozen.readVerdict, { safe: true, lost: [] });
    frozen.setVerdict = { safe: false, lost: ['setidentity ["2026-09-01","synthetic-lift",2]'] };
    frozen.readVerdict = { safe: false, lost: ['readidentity "2026-09-01"'] };
  } else if (code === 'D34') {
    assert.deepEqual(frozen, { changedWeightBy: 1, incorrectlyPristine: true }); frozen.incorrectlyPristine = false;
  } else if (code === 'D35') {
    assert.deepEqual(frozen, { v: 61, sleep: { nights: [], needed: 3 }, reads: [], dailyLogs: {}, sessionLog: {}, futurePayload: { marker: 'invented-future-schema' } });
    frozen.sleep = null; frozen.reads = null; frozen.dailyLogs = null; frozen.sessionLog = null;
  } else if (code !== 'D36') fail('CARRIER-UNKNOWN-WITNESS');
  return frozen;
}

let activeContext;
function context() { if (!activeContext) fail('CARRIER-NO-CONTEXT'); return activeContext; }
function originalFile(root, id) { return path.join(root, 'rebuild/engine/test', id + '.cjs'); }
function pinnedSource({ id, root, baseline }) {
  const rel = 'rebuild/engine/test/' + id + '.cjs';
  const git = execFileSync('git', ['show', ORIGINAL_COMMIT + ':' + rel], { cwd: baseline, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const disk = fs.readFileSync(originalFile(root, id));
  if (sha(git) !== ORIGINAL_PINS[id] || !disk.equals(git)) fail('CARRIER-ORIGINAL-PIN');
  return disk;
}
function runWorker(input) {
  const { id, root, baseline, bundles, acceptance, mode } = input;
  if (!CARRIER_IDS.includes(id) || !['frozen', 'native'].includes(mode)) fail('CARRIER-CONFIG');
  if (!bundles?.main || !path.isAbsolute(bundles.main) || !fs.existsSync(bundles.main)) fail('CARRIER-FROZEN-BUNDLE');
  pinnedSource({ id: 'migrate-reference', root, baseline });
  const prepared = prepareCarrier(id, pinnedSource({ id, root, baseline }));
  // This verifies exact before/after declaration/header bytes. No broad file pin
  // exemption is granted by the three source-test assertion substitutions below.
  require('./source-proof.cjs').verifyProductSources({ root, baseline, acceptance, gitHead: true });
  const selected = new Set(['dataLossGuard', 'isPristineSeed', 'migrate']);
  const sourceVisited = [], cases = [], output = [], traces = [];
  activeContext = {
    capture: args => output.push(args.map(String).join(' ')),
    sourceDeclaration(name, actual, oldExpected) {
      if (!selected.has(name)) assert.equal(actual, oldExpected, 'exact declaration ' + name);
      else { assert.notEqual(actual, oldExpected, 'approved declaration must change'); sourceVisited.push(name); }
    },
    priorMigrate(actual, oldExpected) {
      assert.notEqual(actual, oldExpected, 'approved migration product differs'); sourceVisited.push('migrate.cjs');
    },
    differential(label, expected, actual) {
      cases.push(label); const original = sha(JSON.stringify(expected));
      if (Object.hasOwn(DIFFERENTIAL_DELTAS, label)) adjustDifferential(label, expected);
      traces.push({ label, originalFrozenBytesSha256: original, approvedExpectedBytesSha256: sha(JSON.stringify(expected)), actualBytesSha256: sha(JSON.stringify(actual)) });
    },
    witness(label, frozen, actual) {
      const code = label.slice(0, 3); cases.push(code); const original = sha(JSON.stringify(frozen)); adjustWitness(code, frozen);
      traces.push({ label: code, originalFrozenBytesSha256: original, approvedExpectedBytesSha256: sha(JSON.stringify(frozen)), actualBytesSha256: sha(JSON.stringify(actual)) });
    }
  };
  const file = originalFile(root, id), compiled = new Module(file, module);
  compiled.filename = file; compiled.paths = Module._nodeModulePaths(path.dirname(file));
  process.env.ENGINE_MAIN = bundles.main; process.env.ENGINE_OLD = bundles.old || bundles.main;
  process.env.TZ = 'America/New_York'; process.env.MEASURED_TEST_NOW = '2026-09-03';
  process.argv = [process.execPath, file, '--worker', mode];
  const native = globalThis.Date;
  try {
    // The original migration differential selects its own two Date modes. The
    // other original programs receive the declared mode before taking their
    // existing Date identity snapshots; their bodies stay unchanged.
    if (id !== 'migrate-differential' && mode === 'frozen') {
      globalThis.Date = class CarrierFrozenDate extends native {
        constructor(...args) { super(...(args.length ? args : [1788451200000])); }
        static now() { return 1788451200000; }
      };
    }
    compiled._compile('const __carrier = require(' + JSON.stringify(__filename) + ').context();\nconst console = {log: (...a) => __carrier.capture(a)};\n' + prepared.source, file);
    if (id === 'migrate-source') assert.deepEqual(sourceVisited, ['migrate', 'isPristineSeed', 'dataLossGuard']);
    else if (SOURCE_IDS.includes(id)) assert.deepEqual(sourceVisited, ['migrate.cjs']);
    else assert.deepEqual(cases, caseInventory(id).map(x => x.label), 'every original case exactly once and in original order');
  } finally { globalThis.Date = native; activeContext = null; }
  return { id, mode, status: 'PASS', tail: id.toUpperCase() + ' SUCCESSOR PASS — ' + (SOURCE_IDS.includes(id) ? 'all original assertions; five scoped product changes independently pinned' : id === 'migrate-differential' ? '126 original cases accounted + 1 genuine filed-strike positive; five exact deltas' : '4 original witnesses accounted; D33–35 replaced, D36 unchanged'), edits: prepared.edits, cases: caseInventory(id), traces, outputHashes: output.map(sha) };
}
function runCarrier({ id, root, baseline, bundles, acceptance, mode = 'frozen' }) {
  const child = spawnSync(process.execPath, [__filename, '--carrier-worker'], {
    cwd: root, encoding: 'utf8', input: JSON.stringify({ id, root, baseline, bundles, acceptance, mode }), windowsHide: true,
    timeout: 180000, maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, NODE_OPTIONS: '', NODE_V8_COVERAGE: '', TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03', ENGINE_MAIN: bundles.main, ENGINE_OLD: bundles.old || bundles.main }
  });
  if (child.error) fail('CARRIER-PROCESS-ERROR');
  let result; try { result = JSON.parse(child.stdout); } catch { fail('CARRIER-OUTPUT-INVALID'); }
  if (child.status !== 0 || result.status !== 'PASS') fail(result.code || 'CARRIER-FAILED');
  return result;
}
module.exports = { ORIGINAL_COMMIT, ORIGINAL_PINS, CARRIER_IDS, DIFFERENTIAL_DELTAS, caseInventory, prepareCarrier, exactReplace, adjustDifferential, adjustWitness, runCarrier, context };
if (require.main === module) {
  if (process.argv.length !== 3 || process.argv[2] !== '--carrier-worker') fail('CARRIER-CLI');
  try { process.stdout.write(JSON.stringify(runWorker(JSON.parse(fs.readFileSync(0, 'utf8'))))); }
  catch (e) { process.stdout.write(JSON.stringify({ status: 'FAIL', code: e.code || 'CARRIER-ASSERTION', message: e.code === 'ERR_ASSERTION' ? String(e.message).split('\n')[0] : undefined })); process.exitCode = 1; }
}
