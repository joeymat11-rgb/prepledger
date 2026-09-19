'use strict';
/* SEAL-AUTOMATION / compare.cjs - the line the replay proof draws between a MECHANICAL
   difference (a failure) and PROSE (counted, listed, never asserted away). It lives in a
   module of its own so that the rule can be tested directly, with real committed lines
   and a mutant of one, instead of only through a whole replay run.

   R1 N1 is why the rule is narrower than it was. The old test was

       stripStrings(A) === stripStrings(B) && (/^test\(/ or an assert with a string
       anywhere after a comma)

   which blanked EVERY string on the line and matched ANY assert carrying a message. A
   wrong string inside an assert EXPRESSION - `typeof B[r] !== 'MUTATED-function'` - was
   therefore forgiven as long as the line also ended in a message. Nothing slipped through
   in the S8 replay, but the cell's own header promised byte-identity for anything a build
   reads, and the code did not enforce it.

   The rule now:
     - a `test(` / `it(` TITLE line is prose only when the two lines are identical once
       their strings are blanked: the difference has to live inside the title;
     - an `assert...(` line is prose only when the two lines are identical once the LAST
       ARGUMENT - and only the last argument, and only when it is a plain string literal
       closing the call - is removed. That argument is the message `node --test` prints;
     - everything else is a code difference and fails the cell. */

/* Every line of a file that is not a comment. Nothing clever, because the comparison has
   to be arguable in one reading. */
function codeLines(text, hash) {
  const out = []; let inBlock = false;
  for (const raw of String(text).split('\n')) {
    const l = raw.trim();
    if (inBlock) { if (l.includes('*/')) inBlock = false; continue; }
    if (l.startsWith('/*')) { if (!l.includes('*/')) inBlock = true; continue; }
    if (!l || l.startsWith('//') || (hash && l.startsWith('#'))) continue;
    out.push(l);
  }
  return out;
}
const stripStrings = l => String(l).replace(/'(?:[^'\\]|\\.)*'/g, "''").replace(/"(?:[^"\\]|\\.)*"/g, '""');

/* The LAST argument of a call, when it is a plain string literal that closes the call.
   Returns everything before it, or null when the line does not end that way. */
const MESSAGE_TAIL = /^(.*),\s*(['"])(?:[^'"\\]|\\.)*\2\s*\)\s*;?$/;
function withoutMessage(line) {
  const m = MESSAGE_TAIL.exec(String(line));
  return m ? m[1] : null;
}
const isTitleCall = l => /^(test|it)\(/.test(String(l));
const isAssertCall = l => /^assert[A-Za-z0-9_.]*\(/.test(String(l));

/* 'same' | 'narrative' | 'different'. `a` is generated, `b` is committed. */
function classifyLine(a, b) {
  if (a === b) return 'same';
  if (isTitleCall(a) && isTitleCall(b) && stripStrings(a) === stripStrings(b)) return 'narrative';
  if (isAssertCall(a) && isAssertCall(b)) {
    const ha = withoutMessage(a), hb = withoutMessage(b);
    if (ha !== null && hb !== null && ha === hb) return 'narrative';
  }
  return 'different';
}
module.exports = { codeLines, stripStrings, withoutMessage, classifyLine, isTitleCall, isAssertCall };
