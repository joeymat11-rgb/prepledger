'use strict';
/* SEAL-AUTOMATION / measure.cjs - every fact this folder emits is MEASURED here.
   Two rules the earlier reseal rounds paid for and this file keeps:
   (1) a product sha256 is taken over a GIT BLOB, never over a working file: a working
       file on Windows can carry CRLF that Git never stored, and the runner hashes what
       Git stored.
   (2) a child needle is MEASURED by running the child the way children() runs it
       (b-package.cjs:2190-2231): node, cwd = the repo root, the fixed clock env, and the
       needle must stand at the head of a line of stdout. Nothing is typed from a report. */
const cp = require('child_process');
const crypto = require('crypto');

const CHILD_ENV_FIXED = { NODE_OPTIONS: '', NODE_V8_COVERAGE: '', TZ: 'America/New_York', MEASURED_TEST_NOW: '2026-09-03' };

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
/* Run one declared child exactly as children() does and return { status, out }. */
function runChild(root, argv) {
  const env = Object.assign({}, process.env, CHILD_ENV_FIXED);
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
module.exports = { sha256, sha256Text, git, gitText, blobBytes, blobSha256, revParse, diffNames, runChild, needleStandsAtLineStart, tapPassNeedle, CHILD_ENV_FIXED };
