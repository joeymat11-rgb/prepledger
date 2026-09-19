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
       closing the call AND THE CALL'S ARITY SAYS THAT ARGUMENT IS THE MESSAGE - is
       removed. That argument is the message `node --test` prints;
     - everything else is a code difference and fails the cell.

   R2 M2 is the arity clause. The rule above used to decide "the last string literal that
   closes the call is the MESSAGE" without ever asking how many arguments the call has. In
   a two-argument `assert.equal(expr, 'VALUE')` the last string is the EXPECTED VALUE, and
   a wrong value there was classified `narrative` and never failed the cell: measured over
   the committed blobs at 82c98f8, 29 of 144 assert lines ending in a string were in that
   shape. An expected VALUE is never narrative. So the decision is now made by COUNTING THE
   TOP-LEVEL ARGUMENTS in the head `withoutMessage()` returns: `assert(` and `assert.ok(`
   need ONE preceding argument for the last string to be a message, `assert.equal` and its
   family need TWO, and anything this file has not been taught is assumed to need two,
   because that is the answer that keeps a string byte-identical rather than forgiving it. */

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

/* HOW MANY ARGUMENTS MUST STAND IN FRONT of the last string for it to be the MESSAGE.
   Read off node:assert's own signatures. Anything absent from this table answers 2. */
const MESSAGE_ARITY = {
  assert: 1, ok: 1, ifError: 1, fail: 0,
  equal: 2, notEqual: 2, strictEqual: 2, notStrictEqual: 2,
  deepEqual: 2, notDeepEqual: 2, deepStrictEqual: 2, notDeepStrictEqual: 2,
  match: 2, doesNotMatch: 2, throws: 2, doesNotThrow: 2, rejects: 2, doesNotReject: 2,
};
/* The top-level arguments of the head `withoutMessage()` returns, e.g.
   `assert.equal(api.product(s, noParent, unsealed)` -> 1. Depth is counted over (), [] and
   {}; string and template literals and regex literals are skipped whole, because a comma
   inside one of them is not an argument separator and counting it would call an expected
   value a message - the one direction this rule must never err in. */
function topLevelArgs(head) {
  const s = String(head);
  const open = s.indexOf('(');
  if (open < 0) return 0;
  let depth = 0, commas = 0, i = open + 1, body = false;
  const before = j => { for (let k = j - 1; k >= 0; k -= 1) { if (!/\s/.test(s[k])) return s[k]; } return ''; };
  for (; i < s.length; i += 1) {
    const c = s[i];
    if (c === "'" || c === '"' || c === '`') { i += 1; while (i < s.length && s[i] !== c) { if (s[i] === '\\') i += 1; i += 1; } body = true; continue; }
    if (c === '/' && '(,=:[!&|?+;'.includes(before(i))) { i += 1; let cls = false; while (i < s.length && (cls || s[i] !== '/')) { if (s[i] === '\\') i += 1; else if (s[i] === '[') cls = true; else if (s[i] === ']') cls = false; i += 1; } body = true; continue; }
    if ('([{'.includes(c)) { depth += 1; body = true; continue; }
    if (')]}'.includes(c)) { depth -= 1; continue; }
    if (c === ',' && depth === 0) { commas += 1; continue; }
    if (!/\s/.test(c)) body = true;
  }
  return body ? commas + 1 : 0;
}
/* Is the last string literal of this line the node:test MESSAGE, or an expected VALUE? */
function isMessageArg(line) {
  const head = withoutMessage(line);
  if (head === null) return false;
  const m = /^assert(?:\.([A-Za-z0-9_]+))?\(/.exec(String(head));
  if (!m) return false;
  const name = m[1] || 'assert';
  const need = Object.prototype.hasOwnProperty.call(MESSAGE_ARITY, name) ? MESSAGE_ARITY[name] : 2;
  return topLevelArgs(head) >= need;
}

/* 'same' | 'narrative' | 'different'. `a` is generated, `b` is committed. */
function classifyLine(a, b) {
  if (a === b) return 'same';
  if (isTitleCall(a) && isTitleCall(b) && stripStrings(a) === stripStrings(b)) return 'narrative';
  if (isAssertCall(a) && isAssertCall(b)) {
    const ha = withoutMessage(a), hb = withoutMessage(b);
    /* R2 M2: both sides must be a call whose ARITY makes that last string the message. */
    if (ha !== null && hb !== null && ha === hb && isMessageArg(a) && isMessageArg(b)) return 'narrative';
  }
  return 'different';
}
module.exports = { codeLines, stripStrings, withoutMessage, classifyLine, isTitleCall, isAssertCall, isMessageArg, topLevelArgs, MESSAGE_ARITY };
