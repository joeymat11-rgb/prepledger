'use strict';
/* SEAL-AUTOMATION / measure.cjs - every fact this folder emits is MEASURED here.
   Two rules the earlier reseal rounds paid for and this file keeps:
   (1) a product sha256 is taken over a GIT BLOB, never over a working file: a working
       file on Windows can carry CRLF that Git never stored, and the runner hashes what
       Git stored.
   (2) a child needle is MEASURED by running the child the way children() runs it
       (b-package.cjs:2190-2231): node, cwd = the repo root, THE ENV laws() BUILDS at
       b-package.cjs:2085-2086, and the needle must stand at the head of a line of stdout.
       Nothing is typed from a report.

   R1 finding B1 is why (2) now says "the env laws() builds" and not "the fixed clock env".
   laws() does three things this file used to skip, and a `# pass N` is exactly the number
   that moves when a suite branches on an env var:
     - it ADDS ENGINE_MAIN and ENGINE_OLD from Reference.create(root) - the pinned public
       reference bundles, rebuilt into a scratch dir for the life of that one process;
     - it ADDS EARNED_CLIENT_DIR;
     - it DELETES PL_ENGINE, PL_LAWS_LIB, CONFORM_MUTATE_LAWS and CONFORM_ADAPTERS_DIR, so
       whatever the PM's shell is carrying cannot reach the child.
   childEnv() reproduces all three. When the reference build REFUSES - a worktree whose
   node_modules junction is broken has no esbuild and Reference.create fails at
   BASELINE-ESBUILD-MISSING - childEnv() reports `exact: false` with the reason, and no
   caller records a needle: a needle measured under an env that is not children()'s env is
   a number with no witness, and a named blank is worth more than that. */
const cp = require('child_process');
const crypto = require('crypto');
const path = require('path');

/* The four values laws() SETS, verbatim. */
const CHILD_ENV_FIXED = { NODE_OPTIONS: '', NODE_V8_COVERAGE: '', TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' };
/* The four laws() DELETES, verbatim. */
const CHILD_ENV_DELETED = ['PL_ENGINE', 'PL_LAWS_LIB', 'CONFORM_MUTATE_LAWS', 'CONFORM_ADAPTERS_DIR'];
const REFERENCE_MODULE = 'rebuild/m4/spec/load-write-reference.cjs';

function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function sha256Text(s) { return sha256(Buffer.from(s, 'utf8')); }

function git(root, args, opts) {
  const r = cp.spawnSync('git', args, Object.assign({ cwd: root, maxBuffer: 1 << 28, windowsHide: true }, opts || {}));
  if (r.error) throw new Error('git ' + args.slice(0, 3).join(' ') + ': ' + r.error.message);
  return r;
}
function gitText(root, args) {
  const r = git(root, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('git ' + args.join(' ') + ' exit ' + r.status + ': ' + String(r.stderr).slice(0, 300));
  return r.stdout;
}
/* The blob bytes at <rev>:<file>, or null when the path does not exist there. A missing
   path is a fact (role `new` with pre === null), not an error. */
function blobBytes(root, rev, file) {
  const r = git(root, ['cat-file', 'blob', rev + ':' + file]);
  return r.status === 0 ? r.stdout : null;
}
function blobSha256(root, rev, file) {
  const b = blobBytes(root, rev, file);
  return b === null ? null : sha256(b);
}
function revParse(root, rev) { return gitText(root, ['rev-parse', rev]).trim(); }
function diffNames(root, a, b) {
  return gitText(root, ['diff', '--name-only', a, b]).split('\n').map(s => s.trim()).filter(Boolean);
}
/* THE ENV children() GIVES ITS CHILDREN, rebuilt here (R1 B1).
   Reference.create(root) is called IN THIS PROCESS on purpose: it builds the two bundles
   into a scratch dir and registers a process-exit disposer, so the bundles stay on disk
   for exactly as long as the generator that will run the children. Calling it in a
   subprocess would delete them before the first child started. It is called at most once
   per process and its refusal is a fact, not a crash. */
let bundlesOnce = null;
function referenceBundles(root) {
  if (bundlesOnce) return bundlesOnce;
  try {
    const Reference = require(path.join(root, REFERENCE_MODULE));
    const b = Reference.create(root);
    if (!b || !b.main || !b.old) throw new Error('Reference.create returned no main/old bundle');
    bundlesOnce = { ok: true, main: b.main, old: b.old, why: null };
  } catch (e) {
    bundlesOnce = { ok: false, main: null, old: null, why: String((e && e.message) || e).slice(0, 200) };
  }
  return bundlesOnce;
}
/* { env, exact, why }. `exact` is true only when this env is, key for key, the env
   laws() hands children(). A caller that records a needle under `exact: false` is
   recording a number the runner will not reproduce. */
function childEnv(root) {
  const r = referenceBundles(root);
  const env = Object.assign({}, process.env, CHILD_ENV_FIXED, { EARNED_CLIENT_DIR: path.join(root, 'rebuild/client') });
  if (r.ok) { env.ENGINE_MAIN = r.main; env.ENGINE_OLD = r.old; }
  for (const key of CHILD_ENV_DELETED) delete env[key];
  return {
    env, exact: r.ok,
    why: r.ok ? null : 'the pinned reference bundles could not be built here, so ENGINE_MAIN and ENGINE_OLD are ABSENT where children() always sets them: ' + r.why,
  };
}
/* Run one declared child exactly as children() does and return { status, out }.
   The env is NOT defaulted: a caller must pass childEnv(root).env, so that no code path
   can quietly measure under a reduced env again (R1 B1). */
function runChild(root, argv, env) {
  if (!env || typeof env !== 'object') {
    throw new Error('MEASURE-CHILD-ENV-REQUIRED: runChild needs the env children() builds; get it from childEnv(root)');
  }
  const r = cp.spawnSync(process.execPath, argv, {
    cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 1800000, maxBuffer: 32 * 1024 * 1024,
  });
  return { status: r.status, out: r.stdout || '', err: r.stderr || '' };
}
/* children() asserts new RegExp('^' + escapeRe(needle), 'm').test(out). A needle this
   generator proposes is accepted only if it satisfies that same predicate on the real
   stdout it was read from. */
function needleStandsAtLineStart(out, needle) {
  const esc = String(needle).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + esc, 'm').test(out);
}
/* A node --test tap run ends with `# pass N`. That line, verbatim, is the needle every
   --test child of S6, S7 and S8 declares. */
function tapPassNeedle(out) {
  const m = out.match(/^# pass (\d+)$/m);
  return m ? m[0] : null;
}
/* Is `a` an ancestor of `b`? `git merge-base --is-ancestor` exits 0 for yes, 1 for no and
   anything else for a bad rev, which is why the third case is its own answer (R1 N9). */
function isAncestor(root, a, b) {
  const r = git(root, ['merge-base', '--is-ancestor', a, b]);
  return r.status === 0 ? true : r.status === 1 ? false : null;
}
module.exports = {
  sha256, sha256Text, git, gitText, blobBytes, blobSha256, revParse, diffNames, isAncestor,
  referenceBundles, childEnv, runChild, needleStandsAtLineStart, tapPassNeedle,
  CHILD_ENV_FIXED, CHILD_ENV_DELETED, REFERENCE_MODULE,
};
