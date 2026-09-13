'use strict';
// Reviewer metadata-only audit. No candidate require/import, evaluation, or child process.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const ROOT = path.resolve(__dirname, '../..');
const RUN = path.join(ROOT, '.tmp/s3/3220e4da-ec25-4962-b335-653fcdad5cd1');
const TREE = path.join(RUN, 'tree');
const MANIFEST = 'rebuild/m4/spec/s3-portable-sources.json';
const PIN = '5e5266c253a36304543757a360b74bd0567134dd64da03aae09bf4fe38e6fbee';
const SOURCE = '946c36059a7ce6b949933da3904db3db8e6b8bd3';
const CANDIDATE = '0df6ad3f3ec8d69a6e10ba68c279b7b77d061596';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
function contained(base, file) {
  const absolute = path.resolve(file), relative = path.relative(base, absolute);
  assert.ok(relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative), 'AUDIT_PATH_CONTAINED');
  assert.ok(same(fs.realpathSync.native(absolute), absolute), 'AUDIT_NO_LINK_OR_JUNCTION');
  return absolute;
}
const read = file => fs.readFileSync(contained(ROOT, file));
const report = {profile: 'earned/reviewer-s3-r2-mutation-audit/v1', candidate: CANDIDATE, source: SOURCE,
  scope: 'Read-only parsing of the named completed run; no product imports, execution, or source mutation',
  run: RUN, tree: TREE, manifest_sha256: PIN, source_restoration: [], groups: [], discrepancies: []};
function discrepancy(context, error) {
  report.discrepancies.push({context, name: error.name, code: error.code || null, message: error.message});
}

// Parse only authored array/string literals. This cannot evaluate JavaScript.
function literalReader(source, start) {
  let at = start;
  function white() { while (/\s/.test(source[at] || '') && at < source.length) at++; }
  function string() {
    const quote = source[at++];
    assert.ok(quote === '"' || quote === "'", 'AUDIT_LITERAL_STRING');
    let value = '';
    while (at < source.length) {
      let c = source[at++];
      if (c === quote) return value;
      if (c === '\\') {
        c = source[at++];
        if (c === '\n') continue;
        if (c === '\r') { if (source[at] === '\n') at++; continue; }
        const simple = {n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0'};
        if (c === 'x' || c === 'u') {
          const n = c === 'x' ? 2 : 4, digits = source.slice(at, at + n);
          assert.match(digits, new RegExp('^[a-fA-F0-9]{' + n + '}$'), 'AUDIT_LITERAL_ESCAPE');
          value += String.fromCharCode(parseInt(digits, 16)); at += n; continue;
        }
        c = Object.hasOwn(simple, c) ? simple[c] : c;
      }
      value += c;
    }
    assert.fail('AUDIT_UNTERMINATED_LITERAL');
  }
  function value() {
    white();
    if (source[at] === '"' || source[at] === "'") return string();
    assert.equal(source[at++], '[', 'AUDIT_ARRAY_LITERAL_ONLY');
    const result = []; white();
    while (source[at] !== ']') {
      result.push(value()); white();
      if (source[at] === ']') break;
      assert.equal(source[at++], ',', 'AUDIT_LITERAL_SEPARATOR'); white();
    }
    assert.equal(source[at++], ']'); return result;
  }
  return {value: value(), end: at};
}
function array(source, anchor) {
  assert.equal(source.split(anchor).length, 2, 'AUDIT_UNIQUE_ARRAY_ANCHOR ' + anchor);
  return literalReader(source, source.indexOf(anchor) + anchor.length).value;
}
function declaredNames(file) {
  const raw = read(path.join(TREE, file)), source = raw.toString('utf8'), names = [];
  for (const hit of source.matchAll(/^\s*test\(\s*/gm)) {
    const item = literalReader(source, hit.index + hit[0].length);
    assert.equal(typeof item.value, 'string', 'AUDIT_LITERAL_TEST_NAME');
    assert.equal(source.slice(item.end).trimStart()[0], ',', 'AUDIT_COMPLETE_TEST_DECLARATION');
    names.push(item.value);
  }
  assert.ok(names.length > 0, 'AUDIT_NONZERO_DECLARED_CELLS ' + file);
  assert.equal(new Set(names).size, names.length, 'AUDIT_UNIQUE_DECLARED_CELLS');
  return {file, sha256: hash(raw), names, count: names.length};
}
function scalar(block, key) {
  const hits = [...block.matchAll(new RegExp('^  ' + key + ': (.+)$', 'gm'))];
  assert.ok(hits.length <= 1, 'AUDIT_UNIQUE_OWN_DIAGNOSTIC ' + key);
  if (!hits.length) return null;
  return hits[0][1].replace(/^(['"])(.*)\1$/, '$2');
}
function tap(file, inventory, positive) {
  const raw = read(file), log = raw.toString('utf8'), lines = log.split(/\r?\n/), records = [];
  const totals = {};
  for (const key of ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo']) {
    const matches = [...log.matchAll(new RegExp('^# ' + key + ' ([0-9]+)\\r?$', 'gm'))];
    assert.equal(matches.length, 1, 'AUDIT_ONE_TOTAL ' + key + ' ' + file);
    totals[key] = Number(matches[0][1]);
  }
  for (const key of ['cancelled', 'skipped', 'todo']) assert.equal(totals[key], 0, 'AUDIT_ZERO_' + key);
  assert.equal(totals.tests, inventory.count, 'AUDIT_EXACT_TEST_TOTAL');
  assert.ok(totals.tests > 0);
  assert.equal(totals.pass + totals.fail, totals.tests, 'AUDIT_FULL_ACCOUNTING');
  const plan = [...log.matchAll(/^1\.\.([0-9]+)\r?$/gm)];
  assert.equal(plan.length, 1, 'AUDIT_ONE_TOP_LEVEL_PLAN');
  assert.equal(Number(plan[0][1]), inventory.count);
  for (let i = 0; i < lines.length; i++) {
    const hit = /^(not ok|ok) ([0-9]+) - (.+)$/.exec(lines[i]);
    if (!hit) continue;
    let end = i + 1;
    while (end < lines.length && !/^(?:# Subtest:|(?:not )?ok [0-9]+ - |1\.\.|# tests )/.test(lines[end])) end++;
    const diagnostic = lines.slice(i + 1, end).join('\n');
    records.push({number: Number(hit[2]), name: hit[3], pass: hit[1] === 'ok',
      own_code: scalar(diagnostic, 'code'), own_error_name: scalar(diagnostic, 'name'),
      failure_type: scalar(diagnostic, 'failureType'), diagnostic, diagnostic_sha256: hash(diagnostic)});
  }
  assert.deepEqual(records.map(r => r.name), inventory.names, 'AUDIT_EVERY_DECLARED_CELL_EXECUTED_IN_ORDER');
  assert.deepEqual(records.map(r => r.number), inventory.names.map((_, i) => i + 1), 'AUDIT_NO_MISSING_OR_DUPLICATE_TAP_RECORD');
  assert.equal(records.filter(r => r.pass).length, totals.pass);
  assert.equal(records.filter(r => !r.pass).length, totals.fail);
  if (positive) {
    assert.equal(totals.fail, 0, 'AUDIT_POSITIVE_NO_FAILURE');
    assert.equal(totals.pass, totals.tests, 'AUDIT_POSITIVE_ALL_PASS');
  } else assert.ok(totals.fail > 0, 'AUDIT_MUTANT_ACTUALLY_FAILS');
  return {file, raw_sha256: hash(raw), bytes: raw.length, totals, records};
}
function compact(parsed) {
  return {file: path.relative(RUN, parsed.file).split(path.sep).join('/'), raw_sha256: parsed.raw_sha256, bytes: parsed.bytes, totals: parsed.totals,
    cells: parsed.records.map(({diagnostic, ...record}) => record)};
}

try {
  contained(ROOT, RUN); contained(RUN, TREE);
  const runRecord = JSON.parse(read(path.join(RUN, 'run.json')));
  assert.equal(runRecord.profile, 'earned/s3-scratch-run/v1');
  assert.equal(runRecord.installed, true);
  assert.ok(same(path.resolve(runRecord.sourceRoot), ROOT) && same(path.resolve(runRecord.run), RUN) && same(path.resolve(runRecord.tree), TREE));
  const manifestRaw = read(path.join(TREE, MANIFEST));
  assert.equal(hash(manifestRaw), PIN, 'AUDIT_FIXED_MANIFEST');
  const manifest = JSON.parse(manifestRaw), pins = new Map(manifest.sources.map(e => [e.path, e.sha256]));
  assert.equal(manifest.sources.length, 111); assert.equal(pins.size, 111);
  assert.equal(manifest.mutationTargets.length, 14); assert.equal(new Set(manifest.mutationTargets).size, 14);
  for (const target of manifest.mutationTargets) assert.ok(pins.has(target), 'AUDIT_REGISTERED_TARGET_IS_PINNED');
  report.registered_targets = manifest.mutationTargets;
  for (const entry of manifest.sources) {
    const actual = hash(read(path.join(TREE, entry.path)));
    assert.equal(actual, entry.sha256, 'AUDIT_EXACT_SOURCE_RESTORATION ' + entry.path);
    report.source_restoration.push({path: entry.path, expected_sha256: entry.sha256, actual_sha256: actual, restored: true});
  }
  const prepareSource = read(path.join(TREE, 'rebuild/m4/import/test/mutations.cjs')).toString('utf8');
  const readingSource = read(path.join(TREE, 'rebuild/m4/import/test/reading-replay-faults.cjs')).toString('utf8');
  const preparation = array(prepareSource, 'const cases = ').map(([id, needle, replacement, test]) => ({id, needle, replacement, test, target: 'rebuild/m4/import/replay-core.cjs'}));
  const faults = array(readingSource, 'const faults='), selectors = array(readingSource, 'const names=');
  const reading = faults.map(([id, needle, replacement, file], i) => ({id, needle, replacement, test: selectors[i], target: file ? 'rebuild/m4/import/' + file : 'rebuild/m4/import/replay-core.cjs'}));
  assert.equal(preparation.length, 10); assert.equal(reading.length, 20); assert.equal(selectors.length, 20);
  assert.equal(manifest.coreMutations.length, 26);
  const groups = [
    {label: 'prepare', testFile: 'rebuild/m4/import/test/prepare.test.cjs', specs: preparation},
    {label: 'reading-replay', testFile: 'rebuild/m4/import/test/reading-replay.test.cjs', specs: reading}
  ];
  const coreFiles = [...new Set(manifest.coreMutations.map(c => c.testFile))];
  assert.equal(coreFiles.length, 5);
  coreFiles.forEach((testFile, index) => groups.push({label: 'core-' + index, testFile, specs: manifest.coreMutations.filter(c => c.testFile === testFile)}));
  const directories = fs.readdirSync(RUN, {withFileTypes: true}).filter(e => e.isDirectory() && e.name.startsWith('mutation-'));
  assert.equal(directories.length, 7, 'AUDIT_EXACT_SEVEN_MUTATION_DIRECTORIES');
  const evidenceByLabel = new Map();
  for (const directory of directories) {
    const folder = contained(RUN, path.join(RUN, directory.name)), raw = read(path.join(folder, 'evidence.json')), value = JSON.parse(raw);
    assert.equal(value.profile, 'earned/s3-assertion-mutations/v1');
    assert.equal(value.source_manifest_sha256, hash(JSON.stringify(manifest)), 'AUDIT_NORMALIZED_MANIFEST_IDENTITY');
    assert.equal(value.restored, true);
    assert.ok(!evidenceByLabel.has(value.label), 'AUDIT_NO_DUPLICATE_GROUP');
    evidenceByLabel.set(value.label, {folder, value, raw_sha256: hash(raw)});
  }
  for (const group of groups) {
    try {
      const data = evidenceByLabel.get(group.label); assert.ok(data, 'AUDIT_NAMED_GROUP_PRESENT');
      assert.deepEqual(data.value.cases.map(c => c.id), group.specs.map(c => c.id), 'AUDIT_COMPLETE_LITERAL_MUTANT_INVENTORY');
      const inventory = declaredNames(group.testFile);
      assert.equal(inventory.sha256, pins.get(group.testFile), 'AUDIT_TEST_FILE_PIN');
      const baseline = tap(path.join(data.folder, 'baseline.log'), inventory, true);
      const output = {label: group.label, test_inventory: inventory, candidate_evidence_sha256: data.raw_sha256, baseline: compact(baseline), cases: []};
      report.groups.push(output);
      for (let index = 0; index < group.specs.length; index++) {
        const spec = group.specs[index], candidateRecord = data.value.cases[index];
        try {
          assert.equal(candidateRecord.test, spec.test); assert.equal(candidateRecord.target, spec.target);
          assert.ok(manifest.mutationTargets.includes(spec.target), 'AUDIT_MUTATION_REGISTERED');
          assert.equal(candidateRecord.original_sha256, pins.get(spec.target), 'AUDIT_ORIGINAL_PIN');
          assert.equal(candidateRecord.assertion, true); assert.equal(candidateRecord.restored, true);
          const original = read(path.join(TREE, spec.target)).toString('utf8');
          assert.equal(original.split(spec.needle).length, 2, 'AUDIT_ONE_DECLARED_SUBSTITUTION');
          const reconstructed = original.replace(spec.needle, spec.replacement);
          assert.equal(hash(reconstructed), candidateRecord.mutant_sha256, 'AUDIT_EXACT_DECLARED_MUTANT_BYTES');
          assert.notEqual(candidateRecord.original_sha256, candidateRecord.mutant_sha256);
          const selectedNames = inventory.names.filter(name => name.startsWith(spec.test));
          assert.equal(selectedNames.length, 1, 'AUDIT_UNIQUE_SELECTOR_PREFIX');
          assert.equal(candidateRecord.diagnostic, selectedNames[0], 'AUDIT_EXACT_DECLARED_DIAGNOSTIC_NAME');
          const mutant = tap(path.join(data.folder, spec.id + '.log'), inventory, false);
          const selected = mutant.records.filter(r => r.name === candidateRecord.diagnostic);
          assert.equal(selected.length, 1); assert.equal(selected[0].pass, false, 'AUDIT_SELECTED_CELL_ITSELF_FAILS');
          assert.equal(selected[0].own_code, 'ERR_ASSERTION', 'AUDIT_SELECTED_OWN_ASSERTION_CODE');
          assert.equal(selected[0].own_error_name, 'AssertionError', 'AUDIT_SELECTED_OWN_ASSERTION_TYPE');
          assert.equal(selected[0].failure_type, 'testCodeFailure', 'AUDIT_SELECTED_NOT_SETUP_FAILURE');
          assert.equal(selected[0].diagnostic_sha256, candidateRecord.diagnostic_sha256, 'AUDIT_EXACT_DIAGNOSTIC_HASH');
          const restored = tap(path.join(data.folder, spec.id + '-restored.log'), inventory, true);
          assert.deepEqual(restored.totals, baseline.totals, 'AUDIT_IDENTICAL_RESTORED_TOTALS');
          assert.deepEqual(restored.records.map(r => r.name), baseline.records.map(r => r.name), 'AUDIT_IDENTICAL_RESTORED_CELL_INVENTORY');
          output.cases.push({id: spec.id, test_selector: spec.test, exact_selected_name: selected[0].name, target: spec.target,
            original_sha256: candidateRecord.original_sha256, reconstructed_mutant_sha256: hash(reconstructed), restored_sha256: hash(read(path.join(TREE, spec.target))),
            own_error_code: selected[0].own_code, own_error_name: selected[0].own_error_name, selected_diagnostic_sha256: selected[0].diagnostic_sha256,
            candidate_diagnostic_hash_matches: true, mutant: compact(mutant), restored: compact(restored), audited: true});
        } catch (error) { discrepancy(group.label + '/' + spec.id, error); }
      }
    } catch (error) { discrepancy(group.label, error); }
  }
  report.audited_mutants = report.groups.reduce((n, g) => n + g.cases.length, 0);
  report.baseline_logs = report.groups.length;
  report.restored_logs = report.audited_mutants;
  report.positive_cell_inventories = report.groups.map(g => ({file: g.test_inventory.file, declared: g.test_inventory.count, baseline_executed: g.baseline.totals.tests, restored_runs: g.cases.length, every_restored_executed: g.cases.every(c => c.restored.totals.tests === g.test_inventory.count)}));
  assert.equal(report.audited_mutants, 56, 'AUDIT_ALL_56_MUTANTS');
  assert.equal(report.baseline_logs, 7, 'AUDIT_ALL_7_BASELINES');
  report.process_status_limit = 'No children were executed by this audit. Individual process exit statuses are not encoded in the per-case evidence; raw TAP accounting and the original runner assertions remain distinct evidence.';
} catch (error) { discrepancy('audit', error); }
report.pass = report.discrepancies.length === 0;
report.reviewer_script_sha256 = hash(fs.readFileSync(__filename));
const outputFile = path.join(__dirname, 'S3-R2-MUTATION-AUDIT.json');
fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({pass: report.pass, audited_mutants: report.audited_mutants || 0, baseline_logs: report.baseline_logs || 0, restored_logs: report.restored_logs || 0, discrepancies: report.discrepancies.length, output: outputFile, output_sha256: hash(fs.readFileSync(outputFile))}));
process.exitCode = report.pass ? 0 : 1;
