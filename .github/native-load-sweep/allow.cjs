'use strict';
// Hosted NATIVE-LOAD sweep: the ONE entry rule plan.cjs and shard.cjs both apply to every mutant list line,
// before anything reads any product file (DECISIONS:854 (2), D-HSW-2). A target must be EXACTLY one of the
// four NATIVE-LOAD product files (byte-exact path, case-sensitive, forward slashes), with that file's overlay
// mode; the tests must be a non-empty, duplicate-free subset of exactly fc12 and fa03. Anything else is refused.
const ALLOWED = Object.freeze({
  'rebuild/engine/native-load.cjs': 'cjs',              // FC01
  'rebuild/m4/workout/native-load-effects.cjs': 'cjs',  // FC03
  'rebuild/m3/w6/local/today-bindings.mjs': 'esm',      // TB
  'rebuild/m3/w6/local/source-admission.mjs': 'fs',     // SA
});
const TESTS = Object.freeze({ fc12: 'rebuild/m4/spec/native-load-options.test.cjs', fa03: 'rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs' });
const TEST_KEYS = Object.freeze(['fc12', 'fa03']);
const own = (o, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);
function refuse(m) {
  if (!m || typeof m !== 'object' || Array.isArray(m)) return 'NOT_OBJECT';
  if (!own(ALLOWED, m.file)) return 'FILE_NOT_ALLOWED';
  if (m.mode !== ALLOWED[m.file]) return 'MODE_NOT_FILE_MODE';
  if (!Array.isArray(m.tests) || !m.tests.length || !m.tests.every((t) => TEST_KEYS.includes(t)) || new Set(m.tests).size !== m.tests.length) return 'TEST_NOT_ALLOWED';
  if (typeof m.id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(m.id)) return 'BAD_ID';
  if (typeof m.before !== 'string' || !m.before || typeof m.after !== 'string' || m.before === m.after) return 'BAD_CLAUSE';
  return null;
}
module.exports = { ALLOWED, TESTS, TEST_KEYS, refuse };
