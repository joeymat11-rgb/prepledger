'use strict';
/* SEAL-AUTOMATION / family.cjs - the four hand edits every reseal child has made since
   S5, read out of the files rather than described:
     (1) b-package.cjs   IDS, NO_REGISTER_IDS, CHILD_ROOTS
     (2) tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs   F6 and F7
     (3) the CHILD_SPECS arrays in the product cells that police sealed bytes
     (4) .github/workflows/rebuild.yml   the standing --ci --package step
   Each one is: find the statement, find the block of `//` comment the PARENT round wrote
   directly above it, mirror that block for the child, insert the mirrored block between
   the parent's and the statement, and move the statement. That is literally what the
   S6 -> S7 and S7 -> S8 diffs did, and it is why the child's diff has the same shape. */
const { mirrorText } = require('./mirror.cjs');

/* The contiguous run of comment lines ending at `stmt - 1`, and where inside it the
   PARENT's own addition starts. The parent always opens its block by naming itself. */
function parentBlockAbove(lines, stmt, parentName, prefix) {
  let top = stmt;
  while (top > 0 && new RegExp('^\\s*' + prefix).test(lines[top - 1])) top -= 1;
  const open = new RegExp('^\\s*' + prefix + '\\s*' + parentName.replace(/[-]/g, '\\-') + '\\b');
  for (let i = top; i < stmt; i += 1) if (open.test(lines[i])) return { start: i, end: stmt };
  return null;
}

function listOf(line, open, close) {
  const a = line.indexOf(open), b = line.lastIndexOf(close);
  return line.slice(a + open.length, b).split(',').map(s => s.trim()).filter(Boolean);
}
/* Everything the runner edit needs, measured out of the PARENT's runner. */
function parseRunner(src) {
  const L = src.split('\n');
  const ids = L.findIndex(l => /^const SPEC_DIR = .*\bIDS = \[/.test(l));
  const nri = L.findIndex(l => /^const NO_REGISTER_IDS = new Set\(\[/.test(l));
  const usage = L.findIndex(l => /B PACKAGE USAGE REFUSED/.test(l));
  let gate = -1;
  for (let i = usage; i >= 0 && i > usage - 12; i -= 1) if (/IDS\.includes\(/.test(L[i])) { gate = i; break; }
  const crAt = L.findIndex(l => /^const CHILD_ROOTS = \[/.test(l));
  let crEnd = -1;
  for (let i = crAt; i >= 0 && i < L.length; i += 1) if (/^\s*'[^']+\/'\];\s*$/.test(L[i])) { crEnd = i; break; }
  if (ids < 0 || nri < 0 || crAt < 0 || crEnd < 0 || gate < 0) throw new Error('GEN-RUNNER-SHAPE-UNRECOGNISED');
  return {
    L, idsAt: ids, idsList: listOf(L[ids], '[', ']').map(s => s.replace(/'/g, '')),
    nriAt: nri, nriList: listOf(L[nri], '[', ']').map(s => s.replace(/'/g, '')),
    childRootsEndAt: crEnd, childRootsLast: L[crEnd].trim().replace(/^'|'\];$/g, ''),
    argvGateAt: gate + 1, usageAt: usage + 1,
  };
}
/* The `:NNN` the parent's own IDS block cites for the argv gate, so the child's block can
   cite the gate where it actually stands now instead of repeating a stale number. */
function parentArgvCitation(block) {
  const m = block.join('\n').match(/:(\d+) refuses `--package/);
  return m ? Number(m[1]) : null;
}
module.exports = { parentBlockAbove, parseRunner, parentArgvCitation, listOf, mirrorText };
