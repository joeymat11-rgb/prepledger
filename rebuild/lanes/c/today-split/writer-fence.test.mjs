/* writer-fence.test.mjs - THE WRITER FENCE, FIRST ROWS (spec E.3 to E.5,
 * DECISIONS:550 S-R5, S-R12, S-R13; :562 S-R22).
 *
 * A TOKEN SCANNER WITH NO PARSER DEPENDENCY. There is no JavaScript parser in this
 * repository's node_modules and this cell does not add one. The acorn instrument the spike
 * and the census use is a DEV instrument in the farm, required by absolute path, never a CI
 * dependency; this cell reads code the way the today cells already do, with a
 * comment-and-string stripper, and it runs anywhere node runs.
 *
 * WHAT IT JUDGES IN THIS PART. Part 1 of the split seals TWO modules: today-readings.cjs
 * (the weigh-in writer) and gym-settings-lane.mjs (the machine settings lane). The third,
 * today-lanes.cjs, arrives with part 2. Its copy row activates when it exists; part 2
 * must measure and add today-app.cjs to the released table before claiming its fence.
 *
 * S-R26 TO S-R29: THIS IS A TRIPWIRE, NOT A PROOF. A token scanner cannot be made
 * sound one spelling at a time; three reviewers in turn found new spellings. It notices
 * ordinary durable-write members, acquisition of declared writer capabilities, module
 * edges, and changes to the measured sites below. today-model re-exports weighIn/reopen;
 * gym-app still holds six declared writer seams and three facade.lane acquisitions, each of
 * which hands back the ACTUAL machine-settings writer host (B.7 / GA-R06), so the facade is
 * a declared pass-through and never a general read-only capability.
 * Capability, settings and lane sites use small token windows with multiplicity,
 * ignoring whitespace and line breaks so unrelated same-line look edits need no reseal.
 * Readings uses a closed read-member/truthiness rule with declared composition and
 * returned-interface windows instead of pinning every read site.
 * The settings pin holds named binding keys and references to two declared windows,
 * including duplicate keys, but does not trace arbitrary aliases or computed keys.
 * Other high-traffic holders remain unpinned; every look hunk still needs review.
 * Regex-aware tokenization checks its balance, literals and keyword offsets against
 * an independent regex stripper plus Node syntax checks; this is still no parser.
 *
 * WHAT IT REFUSES TO READ, AND THEREFORE FORBIDS except at measured literal sites:
 * quoted/template/concatenated bracket keys, capability-holder destructuring, calls in
 * template interpolation, and declarations/parameters shadowing suppressed builtins.
 * The identifier arguments is forbidden in code in both released files (measured zero).
 * Newline-split members ARE read. PUT names never receive builtin suppression.
 *
 * WHAT IT CANNOT SEE: arbitrary alias/data flow, variable computed keys, reflective
 * calls, generated code, runtime replacement of a reader, and all JavaScript grammar.
 * Holder destructuring fires only when the right-hand side names a holder. One
 * intermediate local with any other name and the rule does not apply (review F1, R5).
 * Regex after of is recognized only in a simple for (const/let/var name of head;
 * destructured, assignment and for-await heads remain outside that lexical rule.
 * N4(a), for S10: appending a mount option after settings is a known false RED;
 * inserting it before settings is GREEN because the unchanged pin includes the tail.
 * It neither proves durable behavior nor deep immutability of returned data. The
 * boundary holding a released file is INDEPENDENT REVIEW OF EVERY HUNK of every look
 * ticket, followed by the PM's own final review (DECISIONS:439 and :531 (3)).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const HERE = path.dirname(fileURLToPath(import.meta.url));
function repoRoot() {
  let d = HERE;
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(d, "rebuild/m3/w7-preview/today/today-model.cjs"))) return d;
    d = path.dirname(d);
  }
  throw new Error("cannot find the today directory above " + HERE);
}
const ROOT = repoRoot();
const TODAY = "rebuild/m3/w7-preview/today";
const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

/* ---- THE WORD LISTS, SPLIT THREE WAYS BY MEASUREMENT (E.3, R2 BLOCKING-2, S-R12) -----
 * PUT may put a row of the athlete's on disk. STORE reaches a store and stores nothing.
 * ADOPT replaces an in-memory basis or moves a gate. Only PUT is the gesture guard's
 * subject and only PUT may not appear in an ENTRY body; all three are fenced names.
 * The lists are the ones reach.cjs runs, copied here as data so that this cell and that
 * instrument cannot drift apart silently: a row below asserts the counts.               */
const PUT = ["save", "weighIn", "logSet", "finish", "undo", "start", "forget", "recover",
  "restart", "reopen", "retract", "retractImport", "importBundle", "admitLocalSource", "commit"];
const STORE = ["all", "forDate", "latest", "rows", "refresh", "summary", "recorded", "today",
  "close", "transaction", "objectStore", "admittedLocalSourceState", "listImports",
  "athleteState", "firstRun", "recordedLines", "hostForDay"];
const ADOPT = ["adoptBasis", "setPendingAdoption", "setFoodDays", "setSleepNights", "rebase",
  "holdForAdoption", "adoptEngineState"];

/* ---- SUPPRESSED RECEIVERS: JAVASCRIPT BUILTINS AND NOTHING ELSE (R1 BLOCKING-2) -------
 * S-R28: suppression no longer applies to PUT. Measured in BOTH released files:
 * zero PUT hits have any of these receivers. Promise.all belongs to STORE, so
 * removing PUT suppression costs no legitimate site and catches Object.save.
 * `Promise.all`, `Object.entries` and `Date.now` are not durable writes and a fence that
 * reds on them is a fence nobody runs. That is the whole reason this list exists.
 *
 * WHAT R1 FOUND, AND WHY THE LIST IS NOW MEASURED RATHER THAN TYPED. The list used to carry
 * two APPLICATION identifiers as well, `entry` and `importScreen`, copied across from
 * reach.cjs. `entry` is a live local in gym-app.mjs's paintSettings
 * (`const entry = facade.entryFor(liftId)`). R1 planted a brand new released durable write
 * through it - `if (entry) entry.save({ lift: liftId, note: 'x' });` - and THE FENCE STAYED
 * AT 21 OF 21. One suppressed application name silently exempted every durable write reached
 * through a binding of that name, on a file on the path to the athlete's data.
 *
 * Both are dropped, and the rule that keeps them out is a MEASUREMENT, not this comment: the
 * row below asserts that every suppressed name is an own property of globalThis, so no
 * application identifier can be added to this list again without that row failing. Measured
 * on the four files of this part: neither name occurs as the receiver of a fenced word at
 * all, so dropping them costs nothing here and closes the hole before part 2, where
 * today-app.cjs's much larger local surface makes it proportionally wider.
 *
 * reach.cjs keeps a LONGER list (it also suppresses `settingsRead`, `map`, `cache`, `result`,
 * `importScreen` and more), and the two instruments are deliberately no longer the same list.
 * They answer different questions: reach.cjs CLASSIFIES every call site in today-app.cjs and
 * marks the ones it believes are false positives, with its own `falsePositive` column a
 * reader can disagree with row by row; this cell REFUSES, so a suppression here is a hole and
 * a suppression there is an annotation. The one real case reach.cjs suppresses that this cell
 * will meet in part 2 is `importScreen.reopen()` at today-app.cjs:718, a screen being
 * reopened and not a reading; part 2 declares it by line the way the six gym seams are
 * declared, not by exempting the name everywhere.                                          */
const NOT_A_STORE_RECEIVER = ["Promise", "Object", "Array", "JSON", "Math", "Set", "Number",
  "String", "Date"];

/* ---- ONE REGEX-AWARE STRIPPER (review F1, PM replacement of hunk 1) ------------------
 * Read once from offset zero so every slash retains its left context. Rebuild from
 * token spans: blank gaps/comments and unkept literals, preserving offsets and lines.
 * Starting tokensOf at each slash instead mistakes two divisions for one regex and
 * can blank a writer between them. The rows below hold both division and regex cases. */
function stripped(src, keep = []) {
  const tokens = tokensOf(src).tokens;
  let out = "", i = 0;
  const blank = (from, to) => { out += src.slice(from, to).replace(/[^\r\n\u2028\u2029]/g, " "); };
  for (const token of tokens) {
    blank(i, token.at);
    if (["string", "template", "regex"].includes(token.kind) && !keep.includes(token.kind)) {
      blank(token.at, token.end);
    } else out += src.slice(token.at, token.end);
    i = token.end;
  }
  blank(i, src.length);
  return out;
}
/* Comments and literals removed; token spans keep source offsets and line numbers. */
const codeOf = (src) => stripped(src);
/* Copy checks retain strings and templates, but never comments or regex literals. */
const withoutComments = (src) => stripped(src, ["string", "template"]);

/* Every `.name` member read or call in code, with its line. */
function memberHits(code, words) {
  const want = new Set(words);
  const hits = [];
  const re = /([A-Za-z_$][\w$]*)?\s*(?:\?\.|\.)\s*([A-Za-z_$][\w$]*)/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    if (!want.has(m[2])) continue;
    const receiver = m[1] || null;
    const memberAt = m.index + m[0].lastIndexOf(m[2]);
    hits.push({ name: m[2], line: code.slice(0, memberAt).split("\n").length, receiver });
  }
  return hits;
}

/* Every string literal in the CODE of a source, with its raw text. */
function literalsOf(src) {
  const code = withoutComments(src);
  const out = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(code)) !== null) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}
/* Athlete-facing prose: two runs of letters with a REAL SPACE between them. A key, an id, a
   selector and a module path are one token and are not prose - `./machine-settings-host.mjs`
   is not a sentence, and neither is the `use strict` directive, which is named here rather
   than allowed by accident. */
const DIRECTIVES = new Set(["use strict"]);
const isProse = (s) => !DIRECTIVES.has(s) && /[A-Za-z]{2,} [A-Za-z]{2,}/.test(s);

/* ---- THE FILES OF THIS PART ---------------------------------------------------------- */
/* PART 2 (the big cut) joins both lists: today-lanes.cjs is a SEALED lane module and
   today-app.cjs is the released view it was cut out of. Everything below that was written
   as a table over these arrays now covers all three pairs without a line of scanner
   change (S-R26: this round ADDS rows and table entries and does not rewrite the scanner). */
const SEALED = [TODAY + "/today-readings.cjs", TODAY + "/gym-settings-lane.mjs",
  TODAY + "/today-lanes.cjs"];
const RELEASED = [TODAY + "/today-model.cjs", TODAY + "/gym-app.mjs", TODAY + "/today-app.cjs"];
const PART_TWO = TODAY + "/today-lanes.cjs";

/* S-R22: today-readings.cjs's four refusal constants, DECLARED BY NAME, with the exact
   prose they carry. A FIFTH literal fails (E.5 row 15). */
const READINGS_CONSTANTS = ["ALREADY_RECORDED", "OUT_OF_RANGE", "FORM_MIN", "FORM_MAX"];
const READINGS_PROSE = [
  "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.",
  "A morning weight is recorded between ",
  " lb, to one decimal place. Nothing was recorded.",
];

/* gym-app.mjs's one DECLARED seam: the Start exception the released card still names.
 *
 * KEYED BY SITE, NOT BY NAME (R1 BLOCKING-2, second half). The first form of this row
 * compared the SET OF NAMES, so a seventh durable write that happened to reuse one of the six
 * declared names was invisible: R1's planted `entry.save(...)` adds an occurrence of `save`,
 * and `save` was already in the set. The key is now `receiver.name`, and the row asserts the
 * SITE COUNT as well, so neither a new receiver nor a second call through an old one gets in.
 * `(call).save` is `facade.lane().save(machine)`, whose receiver is a call expression and not
 * an identifier. */
const GYM_DECLARED_SEAMS = {
  "model.start": "GA-M06, model.start() inside paint(): the ONE durable PUT any paint root reaches in these three files. A pre-existing fact of the page, left byte-identical under S-R12, with its own ticket GYM-START-IN-PAINT.",
};
const GYM_DECLARED_SITES = 1;

/* PART 2. today-app.cjs's OWN declared seams, the same shape and the same rule: keyed by
 * SITE, counted, and a fourth fails. THREE, and each is a line the big cut deliberately
 * left released:
 *  - `model.weighIn` is SEAM 1, the weigh-in submit's write half (TA-M05). F.1 already
 *    sealed the writer itself in today-readings.cjs; what stays here is the released view
 *    calling the model's re-export, and S-R27 pins the ACQUISITION site below.
 *  - `(call).recover` is SEAM 4, `facade.workout().recover()` (TA-M04): the workout entry
 *    is a PASS-THROUGH the api hands out, which is B.7's measured class and E.5 row 14.
 *  - `(call).reopen` is `facade.importScreen().reopen()`, which is a SCREEN reopened and
 *    not a reading. S-R28 says what the scanner cannot read is DECLARED BY LINE where
 *    today's count is not zero, and the part 1 report named this line in advance as the
 *    one case part 2 would have to declare. It is declared here, by site and by count.
 */
const TODAY_APP_DECLARED_SEAMS = {
  "model.weighIn": "TA-M05, SEAM 1: the weigh-in submit's write half. The writer is sealed in today-readings.cjs (F.1); this is the released view calling today-model.cjs's re-export, and it is the acquisition S-R27 pins.",
  "(call).recover": "TA-M04, SEAM 4: facade.workout().recover() in the primary handler. The workout entry is one of B.7's measured pass-throughs (E.5 row 14).",
  "(call).reopen": "facade.importScreen().reopen(): a SCREEN reopened, not a reading. Declared BY LINE under S-R28, as the part 1 report said part 2 would have to.",
};
const TODAY_APP_DECLARED_SITES = 3;
const siteOf = (h) => (h.receiver || "(call)") + "." + h.name;

function planted(rel, edit) {
  const src = readRepo(rel);
  const out = edit(src);
  assert.notEqual(out, src, "the in-memory plant did not land: " + rel);
  return out;
}

/* S-R27/S-R28. Small lexical inventory, NOT a JavaScript parser. Tokens retain
 * offsets for diagnostics; site exceptions compare token values and multiplicity.
 * Strings/comments cannot masquerade as code. Templates retain their interpolations
 * for the refusal below; this does not attempt to resolve what any call will do. */
function tokensOf(src, start = 0, stopAtBrace = false) {
  const tokens = [];
  let i = start, braces = 0;
  while (i < src.length) {
    const at = i, c = src[i], d = src[i + 1];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && d === '/') {
      i = src.indexOf('\n', i); if (i < 0) i = src.length; continue;
    }
    if (c === '/' && d === '*') {
      const end = src.indexOf('*/', i + 2); i = end < 0 ? src.length : end + 2; continue;
    }
    if (c === '}' && stopAtBrace && braces === 0) return { tokens, end: i + 1, closed: true };
    if (c === '/' && regexMayStart(tokens.at(-1), tokens)) {
      let inClass = false, closed = false;
      i++;
      while (i < src.length && !/[\r\n\u2028\u2029]/.test(src[i])) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') inClass = true;
        else if (src[i] === ']') inClass = false;
        else if (src[i] === '/' && !inClass) { i++; closed = true; break; }
        i++;
      }
      if (closed) while (/[A-Za-z]/.test(src[i] || ' ')) i++;
      tokens.push({ value: src.slice(at, i), at, end: i, kind: 'regex', closed });
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const expressions = [];
      let closed = false, expressionsClosed = true;
      i++;
      while (i < src.length) {
        if (c !== '`' && /[\r\n\u2028\u2029]/.test(src[i])) break;
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === c) { i++; closed = true; break; }
        if (c === '`' && src[i] === '$' && src[i + 1] === '{') {
          const expression = tokensOf(src, i + 2, true);
          expressionsClosed = expressionsClosed && expression.closed;
          expressions.push(expression.tokens); i = expression.end; continue;
        }
        i++;
      }
      tokens.push({ value: src.slice(at, i), at, end: i,
        kind: c === '`' ? 'template' : 'string', expressions, closed: closed && expressionsClosed });
      continue;
    }
    const id = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
    const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(src.slice(i));
    const value = id ? id[0] : number ? number[0] :
      ['===', '!==', '==', '!=', '<=', '>=', '?.', '=>', '...', '++', '--', '**', '&&', '||',
        '??', '/='].find((p) => src.startsWith(p, i)) || c;
    i += value.length;
    if (value === '{') braces++;
    if (value === '}') braces--;
    tokens.push({ value, at, end: i, kind: id ? 'id' : number ? 'number' : 'punct' });
  }
  return { tokens, end: i, closed: !stopAtBrace };
}
function regexMayStart(previous, tokens = []) {
  if (!previous) return true;
  if (previous.kind === 'id') {
    if (['.', '?.'].includes(tokens.at(-2)?.value)) return false;
    // Only a simple declared for-head binding closes before contextual `of`.
    // Destructured/assignment bindings and for-await heads are not handled here.
    if (previous.value === 'of') return tokens.at(-2)?.kind === 'id' &&
      ['const', 'let', 'var'].includes(tokens.at(-3)?.value) &&
      tokens.at(-4)?.value === '(' && tokens.at(-5)?.value === 'for';
    return /^(return|throw|case|delete|void|typeof|new|in|yield|await|instanceof)$/.test(previous.value);
  }
  if (previous.kind === 'punct' && previous.value === ')') {
    /* THE ONE AMBIGUITY A TOKEN SCANNER CAN RESOLVE. `Math.round(x) / 100` is a
       division; `if (ok) /re/.test(t)` is a regex. Walk back to the `(` this `)`
       closes and look at the token in front of it. Without this both this lexer AND
       the independent stripper read the slash as division, AGREE, and a durable write
       sitting in what they both then take for a string is invisible with every
       self-check green (review F1, finding 2). */
    let depth = 0;
    for (let i = tokens.length - 1; i >= 0; i -= 1) {
      if (tokens[i].kind !== 'punct') continue;
      if (tokens[i].value === ')') depth += 1;
      else if (tokens[i].value === '(' && (depth -= 1) === 0) {
        const head = tokens[i - 1];
        return head?.kind === 'id' && /^(if|for|while|with)$/.test(head.value);
      }
    }
    return false;
  }
  return previous.kind === 'punct' &&
    ['(', '[', '{', ',', ';', ':', '?', '=', '=>', '!', '~', '+', '-', '*', '**', '/', '/=',
      '%', '&', '&&', '|', '||', '^', '??', '<', '>', '===', '!==', '==', '!=', '<=', '>='].includes(previous.value);
}
const lineAt = (src, at) => src.slice(0, at).split('\n').length;
const lineText = (src, at) => src.split('\n')[lineAt(src, at) - 1].replace(/\r$/, '');
function codeTokens(src) {
  const flatten = (ts) => ts.flatMap((t) => t.kind === 'template'
    ? [t, ...t.expressions.flatMap(flatten)] : [t]);
  return flatten(tokensOf(src).tokens);
}
/* Independent, plain-regex stripping: never calls tokensOf/codeTokens or uses
 * their boundaries. Preserve offsets, then count whole identifiers with a regex.
 * The measured files have no templates; this deliberately strips whole templates,
 * so future keyword-bearing interpolations require review (a disagreement fails).
 * Slash context is expressed independently as lookbehind, not regexMayStart. */
function regexStripped(src) {
  // Exclude member keywords and postfix ++/--; recognize simple for-of text
  // independently, without consulting the token reader or its span boundaries.
  return src.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|(?<=(?:^|[=([{,:;!?&|*%~^<>\/]|(?<!\+)\+|(?<!-)-)\s*|(?<!\.\s*)(?<![\w$])(?:return|throw|case|delete|void|typeof|new|in|yield|await|instanceof)\s+|\bfor\s*\(\s*(?:const|let|var)\s+[A-Za-z_$][\w$]*\s+of\s+)\/(?:\\[^\r\n\u2028\u2029]|\[(?:\\[^\r\n\u2028\u2029]|[^\]\\\r\n\u2028\u2029])*\]|[^/\\[\r\n\u2028\u2029])+\/[a-z]*/g,
    (raw) => raw.replace(/[^\r\n]/g, ' '));
}
const CHECK_WORDS = ['function', 'const', 'let', 'return'];
function keywordCrossCheck(src, name, tokens = codeTokens(src)) {
  const independent = [...regexStripped(src).matchAll(/[A-Za-z_$][\w$]*/g)];
  const counts = {};
  const differences = [];
  for (const word of CHECK_WORDS) {
    const actual = tokens.filter((t) => t.kind === 'id' && t.value === word).map((t) => t.at);
    const expected = independent.filter((m) => m[0] === word).map((m) => m.index);
    counts[word] = actual.length;
    const first = Array.from({ length: Math.max(actual.length, expected.length) }, (_, i) => i)
      .find((i) => actual[i] !== expected[i]);
    if (first !== undefined) differences.push({ word, at: Math.min(actual[first] ?? Infinity, expected[first] ?? Infinity),
      counts: actual.length + '/' + expected.length });
  }
  differences.sort((a, b) => a.at - b.at);
  const first = differences[0];
  assert.equal(first, undefined, 'FENCE-LEXER-CROSSCHECK: ' + name + ' first differing offset ' +
    first?.at + ' ' + first?.word + ' token/regex counts=' + first?.counts);
  return counts;
}
function balancedTokens(src, name) {
  const visit = (tokens) => {
    const stack = [], close = { ')': '(', ']': '[', '}': '{' };
    for (const t of tokens) {
      if (t.kind === 'template') for (const expression of t.expressions) visit(expression);
      if (t.kind !== 'punct') continue;
      if (['(', '[', '{'].includes(t.value)) stack.push(t);
      if (Object.hasOwn(close, t.value)) {
        assert.equal(stack.pop()?.value, close[t.value], 'FENCE-LEXER-BALANCE: ' + name + ' offset ' + t.at);
      }
    }
    assert.equal(stack.length, 0, 'FENCE-LEXER-BALANCE: ' + name + ' unclosed offset ' + stack[0]?.at);
  };
  visit(tokensOf(src).tokens);
}
function checkedLiterals(src, name) {
  for (const t of codeTokens(src)) {
    if (!['string', 'template', 'regex'].includes(t.kind)) continue;
    const where = name + ' offset ' + t.at;
    assert.equal(t.closed, true, 'FENCE-LEXER-UNTERMINATED: ' + where);
    if (t.kind !== 'template') assert.equal(/[\r\n\u2028\u2029]/.test(t.value), false,
      'FENCE-LEXER-LINEBREAK: ' + where);
    if (t.kind === 'string') {
      const again = tokensOf(t.value);
      assert.equal(again.end, t.value.length, 'FENCE-LEXER-REREAD: ' + where);
      assert.equal(again.tokens.length, 1, 'FENCE-LEXER-REREAD: ' + where);
      assert.deepEqual(again.tokens[0], { ...t, at: 0, end: t.value.length }, 'FENCE-LEXER-REREAD: ' + where);
    }
  }
}
function matching(tokens, from) {
  const close = { '(': ')', '[': ']', '{': '}' }[tokens[from]?.value];
  let depth = 0;
  for (let i = from; i < tokens.length; i++) {
    if (tokens[i].value === tokens[from].value) depth++;
    if (tokens[i].value === close && --depth === 0) return i;
  }
  return tokens.length - 1;
}
/* Skip one initializer/expression up to a top-level separator. */
function expressionEnd(tokens, from) {
  let i = from;
  while (i < tokens.length && ![',', ';', ')', '}', 'of', 'in'].includes(tokens[i].value)) {
    if (['(', '[', '{'].includes(tokens[i].value)) i = matching(tokens, i);
    i++;
  }
  return i;
}
const holder = (t) => t.kind === 'id' &&
  /^(?:facade|hooks|model|settings|readings|foodDays|sleepNights|lane\w*|\w*Lane\w*)$/.test(t.value);
function declarations(tokens) {
  const found = [];
  for (let i = 0; i < tokens.length; i++) {
    if (!['const', 'let', 'var'].includes(tokens[i].value)) continue;
    let from = i + 1;
    while (from < tokens.length) {
      const destructured = ['{', '['].includes(tokens[from].value);
      const end = destructured ? matching(tokens, from) : from;
      const rhs = ['=', 'of', 'in'].includes(tokens[end + 1]?.value) ? end + 2 : end + 1;
      const to = expressionEnd(tokens, rhs);
      found.push({ from, end, rhs, to, destructured });
      if (tokens[to]?.value !== ',') break;
      from = to + 1;
    }
  }
  return found;
}
function interpolationCalls(tokens) {
  return tokens.some((t, i) =>
    (t.value === '(' && (tokens[i - 1]?.kind === 'id' || [')', ']', '?.'].includes(tokens[i - 1]?.value))) ||
    (t.kind === 'template' && t.expressions.some(interpolationCalls)));
}
/* Share the declaration/parameter pattern walk with the holder-site rule.
 * Initializers are expressions, so their object-literal keys are not bindings. */
function bindingPositions(ts, decls = declarations(ts)) {
  const positions = new Set();
  const walk = (from, to) => {
    for (let j = from; j < to; j++) {
      if (ts[j].value === '=') { j = expressionEnd(ts, j + 1) - 1; continue; }
      if (['{', '['].includes(ts[j].value)) {
        const end = matching(ts, j);
        walk(j + 1, end);
        j = end;
      } else if (ts[j].kind === 'id') positions.add(j);
    }
  };
  for (const d of decls) walk(d.from, d.end + 1);
  for (let i = 0; i < ts.length; i++) {
    if (ts[i].value === '(') {
      const end = matching(ts, i), after = ts[end + 1]?.value, prev = ts[i - 1];
      const functionParams = prev?.value === 'function' || ts[i - 2]?.value === 'function' ||
        ts[i - 3]?.value === 'function';
      const methodParams = after === '{' && prev?.kind === 'id' &&
        !['if', 'for', 'while', 'switch', 'with'].includes(prev.value);
      if (after === '=>' || functionParams || methodParams) walk(i + 1, end);
    }
    // An object/array on the left of '=' is an assignment pattern too.
    if (['{', '['].includes(ts[i].value)) {
      const end = matching(ts, i);
      if (ts[end + 1]?.value === '=') walk(i, end + 1);
    }
  }
  return positions;
}
function measuredSyntax(src) {
  const ts = codeTokens(src), decls = declarations(ts);
  const bracket = [], destructure = [], templateCall = [], shadow = new Set(), argumentsUse = [];
  for (const j of bindingPositions(ts, decls)) {
    if (NOT_A_STORE_RECEIVER.includes(ts[j].value) && ts[j + 1]?.value !== ':') shadow.add(ts[j].at);
  }
  for (const d of decls) {
    if (d.destructured && ts.slice(d.rhs, d.to).some(holder)) {
      // The exception names the destructure's factory, not the view fields
      // passed to that factory or other statements sharing the source line.
      destructure.push(ts.slice(d.end, d.rhs + 2).map((t) => t.value).join(' '));
    }
  }
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i], prev = ts[i - 1], next = ts[i + 1];
    if (t.kind === 'id' && t.value === 'arguments') argumentsUse.push(t.at);
    // A bracket following a receiver, a call, or optional chaining is a member.
    if (t.value === '[' && (['id', 'string', 'template'].includes(prev?.kind) || [')', ']', '?.'].includes(prev?.value)) &&
        !['const', 'let', 'var', 'return', 'yield', 'throw', 'case', 'of', 'in'].includes(prev?.value)) {
      const key = ts.slice(i + 1, matching(ts, i));
      // '+' might concatenate strings; this scanner cannot infer operand types.
      if (['string', 'template'].includes(next?.kind) || key.some((k) => k.value === '+')) bracket.push(t.at);
    }
    if (t.kind === 'template' && t.expressions.some(interpolationCalls)) templateCall.push(t.at);
    if (['function', 'class'].includes(t.value)) {
      const name = next?.value === '*' ? ts[i + 2] : next;
      if (NOT_A_STORE_RECEIVER.includes(name?.value)) shadow.add(name.at);
    }
    if (t.value === 'import' && !['(', '.'].includes(next?.value) && next?.kind !== 'string') {
      for (let j = i + 1; j < ts.length && !['from', ';'].includes(ts[j].value); j++) {
        if (NOT_A_STORE_RECEIVER.includes(ts[j].value) && ts[j + 1]?.value !== 'as') shadow.add(ts[j].at);
      }
    }
    if (t.value === '(') {
      const end = matching(ts, i), after = ts[end + 1]?.value;
      const methodParams = after === '{' && prev?.kind === 'id' &&
        !['if', 'for', 'while', 'switch', 'with'].includes(prev.value);
      if (methodParams && NOT_A_STORE_RECEIVER.includes(prev.value)) shadow.add(prev.at);
    }
    if (next?.value === '=>' && NOT_A_STORE_RECEIVER.includes(t.value)) shadow.add(t.at);
  }
  const lines = (positions) => [...positions].sort((a, b) => a - b).map((at) => lineText(src, at));
  return { bracket: lines(bracket), destructure,
    templateCall: lines(templateCall), shadow: lines(shadow), arguments: lines(argumentsUse) };
}
function moduleEdges(src) {
  const ts = codeTokens(src), edges = [];
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    if (!['import', 'require', 'export'].includes(t.value) || t.kind !== 'id') continue;
    if (ts[i + 1]?.value === '(') {
      const end = matching(ts, i + 1), arg = ts[i + 2];
      // Nonliteral expressions are never normalized into a permitted literal.
      const literal = arg?.kind === 'string' && end === i + 3;
      edges.push(t.value + ':' + (literal ? arg.value.slice(1, -1) : '<nonliteral>'));
    } else if (t.value !== 'require' && ts[i + 1]?.value !== '.') {
      let j = i + 1;
      if (ts[j]?.kind !== 'string') {
        while (j < ts.length && !['from', ';'].includes(ts[j].value)) j++;
        if (ts[j]?.value !== 'from') continue;
        j++;
      }
      edges.push(t.value + ':' + (ts[j]?.kind === 'string' ? ts[j].value.slice(1, -1) : '<nonliteral>'));
    }
  }
  return edges;
}

/* S-R27(e): literal token windows, not source lines. Part 2 must measure and
 * declare today-app.cjs here; no automatic snapshot update is allowed. */
const READINGS_READ = ['reads', 'paint', 'face', 'blockedCopy', 'label', 'outboxRetained'];
const READINGS_PASS = [
  'createReadingsWriter ( { day , readings ,',
  ', readings ,',
];
const RELEASED_FILES = [
  {
    rel: TODAY + '/today-model.cjs', anchor: '  function adoptBasis(state) {',
    capabilities: {
      weighIn: ['const { weighIn ,', 'read , weighIn ,'],
      reopen: ['const { weighIn , reopen ,', 'read , weighIn , reopen ,'],
    },
    holders: {},
    readingsUse: true,
    lane: [],
    edges: ['require:./today-engine.cjs', 'require:../fixtures.cjs', 'require:./food-model.cjs',
      'require:./sleep-model.cjs', 'require:./today-readings.cjs'],
    syntax: { bracket: [], templateCall: [], shadow: [], arguments: [], destructure: [
      '} = createReadingsWriter (',
    ] },
  },
  {
    rel: TODAY + '/gym-app.mjs', anchor: '    const entry = facade.entryFor(liftId);',
    capabilities: {},
    holders: { settings: [
      'settings } = { } )',
      'createGymSettingsLane ( doc , phone , model , settings ,',
    ] },
    lane: [],
    edges: ['import:./today-app.cjs', 'import:./plain-copy.cjs',
      'import:./machine-settings-view.mjs', 'import:./gym-settings-lane.mjs'],
    syntax: { bracket: [], templateCall: [], shadow: [], arguments: [], destructure: [
      '} = createGymSettingsLane (',
    ] },
  },
  /* PART 2, THE BIG CUT. Every window below was MEASURED on the released today-app.cjs
     this build produced and typed out from the measurement, never snapshotted: the two
     capability windows are the only two places the released view still touches a durable
     writer by name, and both of them are declared seams above. */
  {
    rel: TODAY + '/today-app.cjs', anchor: '    const view = model.read();',
    /* NO `capabilities` WINDOWS, AND THE REASON IS THE MEASUREMENT. S-R27 pins a
       capability WHERE IT IS ACQUIRED. In today-model.cjs weighIn and reopen are acquired
       by a DESTRUCTURE of the sealed factory's result, so they are bare identifiers and a
       site window is the right pin. In the released today-app.cjs they are never acquired
       at all: the view reaches them as MEMBERS of the model it was handed
       (`model.weighIn(...)`, `facade.importScreen().reopen()`), and review F1 finding 4
       is precisely that a property position must stay free or every ordinary look edit
       goes red. Those two sites are pinned instead by the DECLARED SEAM table above, by
       site and by count, which is the pin that fits what the fence can actually read. */
    capabilities: {},
    holders: {},
    lane: [],
    edges: ['require:./today-model.cjs', 'require:./plain-copy.cjs', 'require:./problem-report.cjs',
      'require:./food-model.cjs', 'require:./sleep-model.cjs', 'require:./today-lanes.cjs',
      'import:../measure/measure-screen.mjs', 'import:../import/import-screen.mjs'],
    syntax: { bracket: [], templateCall: [], shadow: [], arguments: [], destructure: [
      '} = createTodayLanes (',
    ] },
  },
];
/* The per-file declared-seam lookup. Two entries, and a released file that is not in it
   may hold NO durable member at all, which is the rule today-model.cjs is still held to. */
const DECLARED_SEAMS = {
  [TODAY + '/gym-app.mjs']: { seams: GYM_DECLARED_SEAMS, sites: GYM_DECLARED_SITES },
  [TODAY + '/today-app.cjs']: { seams: TODAY_APP_DECLARED_SEAMS, sites: TODAY_APP_DECLARED_SITES },
};
function capabilitySites(src, name) {
  return codeTokens(src).filter((t) => t.kind === 'id' && t.value === name);
}
function laneSites(src) {
  const ts = codeTokens(src);
  return ts.filter((t, i) => t.value === 'facade' && ['.', '?.'].includes(ts[i + 1]?.value) &&
    ts[i + 2]?.value === 'lane');
}
function windowAt(ts, i, name, window) {
  const values = window.split(' '), offset = values.indexOf(name), start = i - offset;
  return offset >= 0 && start >= 0 && values.every((value, j) => ts[start + j]?.value === value);
}
/* Member names and object-LITERAL keys are property positions (review F1, F4).
 * A key in a binding pattern acquires the field, so it must match a site window. */
const propertyPosition = (ts, i, bindings) => ['.', '?.'].includes(ts[i - 1]?.value) ||
  (!bindings.has(i) && ts[i + 1]?.value === ':' && ['{', ','].includes(ts[i - 1]?.value));
function siteWindows(src, name, windows, lane = false) {
  const ts = codeTokens(src), bindings = bindingPositions(ts);
  return ts.flatMap((t, i) => {
    if (t.kind !== 'id' || t.value !== name) return [];
    if (!lane && propertyPosition(ts, i, bindings)) return [];
    if (lane && (!['.', '?.'].includes(ts[i + 1]?.value) || ts[i + 2]?.value !== 'lane')) return [];
    return [windows.find((window) => windowAt(ts, i, name, window)) ?? '<undeclared>'];
  });
}
function inReturnedObject(ts, at) {
  const stack = [];
  for (let i = 0; i < at; i++) {
    if (['(', '[', '{'].includes(ts[i].value)) stack.push(i);
    else if ([')', ']', '}'].includes(ts[i].value)) stack.pop();
  }
  const open = stack.at(-1);
  return ts[open]?.value === '{' && ts[open - 1]?.value === 'return';
}
const READINGS_DECLARATION = 'const readings = options . readings';
function readingsUseOK(src) {
  const ts = codeTokens(src), passes = [0, 0];
  let ownDeclaration = 0, invalid = false;
  for (let i = 0; i < ts.length; i++) {
    if (ts[i].kind !== 'id' || ts[i].value !== 'readings') continue;
    const before = ts[i - 1]?.value, after = ts[i + 1]?.value;
    if (before === '.' && ts[i - 2]?.value === 'options') {
      /* The PROPERTY NAME is free only INSIDE the one declared declaration. Read as a
         blanket exemption it let `const second = options.readings;` and
         `consume(options.readings);` take a second handle on the raw store with the
         fence green (review F1, finding 3). */
      if (!windowAt(ts, i - 4, 'readings', READINGS_DECLARATION)) invalid = true;
      continue;
    }
    if (['.', '?.'].includes(before)) { invalid = true; continue; }
    if (windowAt(ts, i, 'readings', READINGS_DECLARATION)) {
      ownDeclaration++;
      continue;
    }
    const pass = READINGS_PASS.findIndex((window) => windowAt(ts, i, 'readings', window));
    if (pass >= 0 && (pass === 0 || inReturnedObject(ts, i))) { passes[pass]++; continue; }
    if (['.', '?.'].includes(after) && READINGS_READ.includes(ts[i + 2]?.value)) continue;
    if (['?', '&&', '||', '===', '!==', '==', '!='].includes(after) ||
        (before === '!' && [';', ')', ']', '}', ',', ':'].includes(after))) continue;
    invalid = true;
  }
  // Duplicate declarations/pass-throughs cannot turn old RED rows into exceptions.
  return !invalid && ownDeclaration === 1 && passes.every((count) => count === 1);
}
const SYNTAX_REFUSALS = { bracket: 'FENCE-BRACKET-KEY', destructure: 'FENCE-CAPABILITY-DESTRUCTURE',
  templateCall: 'FENCE-TEMPLATE-CALL', shadow: 'FENCE-BUILTIN-SHADOW', arguments: 'FENCE-ARGUMENTS' };
function releasedRefusals(file, src) {
  const refusals = [];
  const differs = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
  for (const [name, sites] of Object.entries(file.capabilities)) {
    if (differs(siteWindows(src, name, sites), sites)) refusals.push('FENCE-CAPABILITY-SITE:' + name);
  }
  for (const [name, sites] of Object.entries(file.holders)) {
    if (differs(siteWindows(src, name, sites), sites)) refusals.push('FENCE-HOLDER-SITE:' + name);
  }
  // ONE refusal, ONE name (review F1, finding 5). readings is held to a USE RULE and not
  // to sites, so a second FENCE-HOLDER-SITE label in a red log names a pin that S-R27(e)
  // abolished. The S-R27(d) rows below name the refusal they expect per holder instead.
  if (file.readingsUse && !readingsUseOK(src)) refusals.push('FENCE-HOLDER-USE:readings');
  if (differs(siteWindows(src, 'facade', file.lane, true), file.lane)) refusals.push('FENCE-LANE-ACQUISITION');
  if (differs(moduleEdges(src), file.edges)) refusals.push('FENCE-RELEASED-MODULE-EDGE');
  const syntax = measuredSyntax(src);
  for (const kind of Object.keys(SYNTAX_REFUSALS)) {
    if (differs(syntax[kind], file.syntax[kind])) refusals.push(SYNTAX_REFUSALS[kind]);
  }
  const hits = memberHits(codeOf(src), PUT);
  /* PART 2: the declared-seam table is now PER FILE and the branch is a lookup, because a
     second released file has declared seams of its own. The RULE is unchanged - keyed by
     site, counted, and one more fails - and no other line of the scanner moved (S-R26). */
  const declared = DECLARED_SEAMS[file.rel] || null;
  if (declared) {
    if (hits.length !== declared.sites || differs([...new Set(hits.map(siteOf))].sort(),
      Object.keys(declared.seams).sort())) refusals.push('FENCE-WRITER-NAME');
  } else if (hits.length) refusals.push('FENCE-WRITER-NAME');
  return refusals;
}
function plantLine(file, line) {
  return planted(file.rel, (src) => src.replace(file.anchor, line + '\n' + file.anchor));
}

/* ======================================================================================
   THE ROWS
   ====================================================================================== */

test("FENCE-NOTHING-TO-SCAN: the fence names the files it read, and the released files are among them", () => {
  const scanned = [...SEALED, ...RELEASED].filter((f) => fs.existsSync(path.join(ROOT, f)));
  assert.notEqual(scanned.length, 0, "FENCE-NOTHING-TO-SCAN");
  for (const r of RELEASED) {
    assert.ok(scanned.includes(r), "FENCE-RELEASED-FILE-NOT-SCANNED: " + r);
  }
  assert.equal(scanned.length, 6, "part 1 sealed two modules and released two; part 2 adds " +
    PART_TWO + " and the released today-app.cjs it was cut out of");
  console.log("  fence scanned " + scanned.length + " files: " + scanned.map((f) => path.basename(f)).join(", "));
});

/* ---- R1 BLOCKING-2: the suppression list cannot hold an application name -------------- */

test("FENCE-SUPPRESSED-RECEIVER: every suppressed receiver is a JavaScript builtin, measured", () => {
  const notGlobal = NOT_A_STORE_RECEIVER.filter((n) => !Object.prototype.hasOwnProperty.call(globalThis, n));
  assert.deepEqual(notGlobal, [],
    "FENCE-SUPPRESSED-RECEIVER: " + notGlobal.join(", ") + " is not a JavaScript builtin, so it " +
    "is an APPLICATION identifier, and a suppressed application identifier exempts every " +
    "durable write reached through a binding of that name. That is R1 BLOCKING-2: `entry` was " +
    "on this list and a planted entry.save() went through a green fence.");
  assert.equal(NOT_A_STORE_RECEIVER.length, 9,
    "nine builtins and no more; a tenth name is a new suppression and needs a red row of its own");
});

test("RED R1 BLOCKING-2: a durable write through the local `entry` in the released gym card FAILS", () => {
  /* R1's own attack, at the line it used: inside paintSettings, just after the facade hands
     the entry out. Before the fix this planted write left the fence at 21 of 21. */
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("    const entry = facade.entryFor(liftId);",
      "    const entry = facade.entryFor(liftId);\n    if (entry) entry.save({ lift: liftId, note: 'x' });"));
  assert.ok(src.includes("entry.save({ lift: liftId"), "the plant did not land; re-read GA-R02");
  const hits = memberHits(codeOf(src), PUT);
  assert.equal(hits.some((h) => h.name === "save" && h.receiver === "entry"), true,
    "THE FENCE DID NOT SEE A DURABLE WRITE THROUGH `entry`. This is R1 BLOCKING-2 and it is " +
    "the one class of thing this cell is in the tree to catch.");
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.notDeepEqual(sites, Object.keys(GYM_DECLARED_SEAMS).sort(),
    "THE SEAM ROW DID NOT FIRE ON entry.save. Keyed by NAME it could not: `save` was already " +
    "one of the six declared names. That is why it is keyed by SITE.");
});

test("RED R1 BLOCKING-2: a durable write through `importScreen` in the released today-model.cjs FAILS", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,",
      "  importScreen.retractImport(day);\n  const { weighIn, reopen,"));
  const hits = memberHits(codeOf(src), PUT);
  assert.equal(hits.some((h) => h.name === "retractImport" && h.receiver === "importScreen"), true,
    "THE FENCE DID NOT SEE A DURABLE WRITE THROUGH `importScreen`, the second application " +
    "name R1 found on the suppression list.");
});

test("the three word lists are the ones the reachability instrument runs (15 PUT, 17 STORE, 7 ADOPT)", () => {
  assert.equal(PUT.length, 15);
  assert.equal(STORE.length, 17);
  assert.equal(ADOPT.length, 7);
  for (const w of PUT) assert.equal(STORE.includes(w) || ADOPT.includes(w), false, w + " is on two lists");
});

/* ---- ROW 1: PUT members, except gym seams; bare capabilities are pinned separately ----- */

test("FENCE-WRITER-NAME: today-model.cjs has no PUT member; weighIn/reopen are declared re-exports", () => {
  const hits = memberHits(codeOf(readRepo(TODAY + "/today-model.cjs")), PUT);
  assert.deepEqual(hits.map((h) => h.name + ":" + h.line), [],
    "FENCE-WRITER-NAME: implementations moved; the two bare capabilities remain and " +
    "their composition/export sites are checked separately below.");
});

test("FENCE-WRITER-NAME: the released gym-app.mjs holds EXACTLY the six declared seam WRITE SITES, and a seventh fails", () => {
  const hits = memberHits(codeOf(readRepo(TODAY + "/gym-app.mjs")), PUT);
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.deepEqual(sites, Object.keys(GYM_DECLARED_SEAMS).sort(),
    "FENCE-WRITER-NAME: the released gym card reaches a durable writer that is not one of the " +
    "six declared seams. Every one of the six is a line the spec carries with a region id; a " +
    "seventh is a new released decision about what gets stored and it is a STOP.");
  assert.equal(hits.length, GYM_DECLARED_SITES,
    "FENCE-WRITER-SITE-COUNT: " + hits.length + " durable write sites in the released gym card, " +
    GYM_DECLARED_SITES + " declared. A SECOND call through an already-declared receiver is a " +
    "seventh decision about what gets stored even though it adds no new name, and the " +
    "name-set form of this row could not see it (R1 BLOCKING-2).");
  console.log("  released gym-app.mjs write sites: " + hits.map((h) => ":" + h.line + " " + siteOf(h)).join(", "));
});

test("RED: a durable writer planted in the released today-model.cjs FAILS", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,", "  readings.weighIn({ date: day, lb: 1 });\n  const { weighIn, reopen,"));
  const hits = memberHits(codeOf(src), PUT);
  assert.equal(hits.length > 0, true, "THE FENCE DID NOT SEE A PLANTED readings.weighIn(...)");
  assert.equal(hits[0].name, "weighIn");
});

test("RED: the E.5 row 1 alias, const s = host.save, FAILS even though it is not a call", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,", "  const s = readings.save; s(1);\n  const { weighIn, reopen,"));
  const hits = memberHits(codeOf(src), PUT);
  assert.equal(hits.some((h) => h.name === "save"), true,
    "THE FENCE SCANS CALL EXPRESSIONS AND NOT MEMBER NAMES. E.5 row 1 is the reason it must not.");
});

test("RED: a SEVENTH durable writer in the released gym card FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("  const painter = Object.freeze(", "  const late = () => model.recover();\n  const painter = Object.freeze("));
  const hits = memberHits(codeOf(src), PUT);
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.notDeepEqual(sites, Object.keys(GYM_DECLARED_SEAMS).sort(),
    "THE FENCE DID NOT SEE A SEVENTH DURABLE WRITER IN THE RELEASED GYM CARD");
  assert.equal(sites.includes("model.recover"), true);
});

test("a comment naming host.save is invisible, and so is the word save inside a sentence", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,",
      '  /* host.save is named here on purpose. */\n  const note = "Nothing to save yet.";\n  void note;\n  const { weighIn, reopen,'));
  const hits = memberHits(codeOf(src), PUT);
  assert.deepEqual(hits, [], "a fence that reds on prose loses its credibility the first time it runs");
});

/* ---- ROW 2: zero athlete-facing copy in the seal, S-R13 and S-R22 --------------------- */

test("FENCE-COPY-IN-SEAL: gym-settings-lane.mjs holds ZERO athlete-facing string literals", () => {
  const prose = literalsOf(readRepo(TODAY + "/gym-settings-lane.mjs")).filter(isProse);
  assert.deepEqual(prose, [],
    "FENCE-COPY-IN-SEAL. B.6's discipline is that the view owns every word; the seal returns " +
    "an outcome and never a sentence.");
});

test("S-R22: today-readings.cjs carries EXACTLY four refusal constants, named, and exactly their prose", () => {
  const src = readRepo(TODAY + "/today-readings.cjs");
  const declared = [...src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]+)\s*=/g)].map((m) => m[1]);
  const pairs = [...src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]+)\s*=\s*\d+\s*,\s*([A-Z][A-Z0-9_]+)\s*=/g)];
  const all = [...new Set([...declared, ...pairs.flatMap((m) => [m[1], m[2]])])].sort();
  assert.deepEqual(all, [...READINGS_CONSTANTS].sort(),
    "S-R22: the sealed weigh-in writer's refusal constants are declared BY NAME in this cell. " +
    "A fifth is a new sentence in front of the athlete that no cell named.");
  const prose = literalsOf(src).filter(isProse);
  assert.deepEqual(prose, READINGS_PROSE,
    "FENCE-COPY-IN-SEAL: today-readings.cjs is the ONE measured exception to S-R13, and the " +
    "exception is these literals and no others.");
});

test("RED: a FIFTH constant in today-readings.cjs FAILS", () => {
  const src = planted(TODAY + "/today-readings.cjs",
    (s) => s.replace("  const FORM_MIN = 60, FORM_MAX = 400;",
      '  const STILL_SAVING = "Earned is still saving that reading.";\n  const FORM_MIN = 60, FORM_MAX = 400;'));
  const declared = [...src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]+)\s*=/g)].map((m) => m[1]);
  assert.equal(declared.includes("STILL_SAVING"), true,
    "THE FENCE DID NOT SEE A FIFTH DECLARED CONSTANT IN THE SEALED WRITER");
  const prose = literalsOf(src).filter(isProse);
  assert.notDeepEqual(prose, READINGS_PROSE);
});

test("RED: a sentence planted in gym-settings-lane.mjs FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("  let settingsReading = null;",
      "  const SORRY = 'Your settings could not be read.';\n  void SORRY;\n  let settingsReading = null;"));
  assert.equal(literalsOf(src).filter(isProse).length > 0, true,
    "THE FENCE DID NOT SEE A SENTENCE PLANTED IN THE SEALED GYM LANE");
});

/* ---- ROW 3: the interface objects are frozen ------------------------------------------ */

test("the gym lane source freezes the outer, facade, hooks and api interfaces", () => {
  const code = codeOf(readRepo(TODAY + "/gym-settings-lane.mjs"));
  assert.match(code, /return Object\.freeze\(\{/, "the returned interface is not frozen");
  assert.match(code, /const facade = Object\.freeze\(\{/, "the facade table is not frozen");
  assert.match(code, /const hooks = Object\.freeze\(\{/, "the callback table is not frozen");
  assert.match(code, /const api = Object\.freeze\(\{/, "the api table is not frozen");
});

test("the paint handle the released card hands in is FROZEN", () => {
  const code = codeOf(readRepo(TODAY + "/gym-app.mjs"));
  assert.match(code, /const painter = Object\.freeze\(\{ repaint: \(\) => paint\(\) \}\);/,
    "the paint handle is not a frozen one-entry object");
});

test("RED: an unfrozen interface object FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("  const hooks = Object.freeze({", "  const hooks = ({"));
  const code = codeOf(src);
  assert.equal(/const hooks = Object\.freeze\(\{/.test(code), false,
    "THE FENCE DID NOT SEE AN UNFROZEN CALLBACK TABLE");
});

/* ---- ROW 4: FENCE-SEALED-BINDING-ASSIGNED, the rule no word list could catch ---------- */

/* The sealed module's factory-scope declarations, by indentation: every `let`, `const` and
   `function` at exactly two spaces inside the factory. This is the token-scanner form of
   census.cjs's RELEASED ASSIGNS A SEALED BINDING class, and the acceptance number is ZERO. */
function factoryScopeNames(rel) {
  const code = codeOf(readRepo(rel));
  const names = [];
  for (const line of code.split("\n")) {
    const m = /^ {2}(?:let|const|var)\s+([A-Za-z_$][\w$]*)/.exec(line)
      || /^ {2}(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(line);
    if (m) names.push(m[1]);
  }
  return names;
}

test("FENCE-SEALED-BINDING-ASSIGNED: no released file assigns a binding declared at factory scope in its sealed partner", () => {
  const pairs = [
    [TODAY + "/gym-settings-lane.mjs", TODAY + "/gym-app.mjs"],
    [TODAY + "/today-readings.cjs", TODAY + "/today-model.cjs"],
    /* PART 2, and it is the big one: 679 lines and 37 factory-scope bindings. The census
       over this build's own output prints the same class at ZERO (H.2 STOP 11), and this
       row is the token-scanner tripwire that keeps it there between rounds. */
    [TODAY + "/today-lanes.cjs", TODAY + "/today-app.cjs"],
  ];
  for (const [sealed, released] of pairs) {
    const names = factoryScopeNames(sealed);
    assert.notEqual(names.length, 0, "no factory-scope declarations found in " + sealed);
    const code = codeOf(readRepo(released));
    for (const name of names) {
      const re = new RegExp("(^|[^.\\w$])" + name + "\\s*(=[^=]|\\+=|-=|\\+\\+|--)", "m");
      assert.equal(re.test(code), false,
        "FENCE-SEALED-BINDING-ASSIGNED: " + released + " assigns " + name + ", which " +
        sealed + " declares at factory scope. This is the rule no word list could ever have " +
        "caught: settingsSaving is not a writer's name, and gym-app.mjs:279 assigned it.");
    }
  }
});

test("RED: a released assignment to the sealed activeEditor binding FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("  const { facade, hooks, api } = createGymSettingsLane(doc, phone, model, settings, painter);",
      "  const { facade, hooks, api } = createGymSettingsLane(doc, phone, model, settings, painter);\n  activeEditor = null;"));
  const names = factoryScopeNames(TODAY + "/gym-settings-lane.mjs");
  assert.equal(names.includes("activeEditor"), true, "activeEditor is not sealed");
  const code = codeOf(src);
  const re = new RegExp("(^|[^.\\w$])activeEditor\\s*(=[^=])", "m");
  assert.equal(re.test(code), true,
    "THE FENCE DID NOT SEE THE EXACT ROW THE SPIKE FOUND AND B.9 NEVER HAD");
});

/* ---- ROW 5: the sealed modules' module edges ------------------------------------------ */

test("FENCE-VIEW-IMPORT: the gym lane has one producer import and one dynamic host edge", () => {
  const readings = codeOf(readRepo(TODAY + "/today-readings.cjs"));
  assert.deepEqual([...readings.matchAll(/\b(?:require|import)\s*\(/g)].map((m) => m[0]), [],
    "the sealed weigh-in writer takes every binding it needs by injection and imports nothing");

  const lane = codeOf(readRepo(TODAY + "/gym-settings-lane.mjs"));
  const edges = [...readRepo(TODAY + "/gym-settings-lane.mjs")
    .matchAll(/\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.deepEqual(edges, ["./machine-settings-host.mjs"],
    "FENCE-SECOND-SEALED-IMPORT: the gym lane opens the fifth lane and reaches nothing else");
  const statics = [...readRepo(TODAY + "/gym-settings-lane.mjs")
    .matchAll(/^\s*import[^'\"]*['\"]([^'\"]+)['\"]/gm)].map((m) => m[1]);
  assert.deepEqual(statics, ["../../../coach/machine-settings-commands.cjs"]);
});

/* R1 NOTE-3: this row shipped without a red counterpart. R1 planted one by hand and the row
   did fail, so the row was sound and only its proof was missing. Here it is, committed. */
test("RED FENCE-VIEW-IMPORT: a require of a view module added to today-readings.cjs FAILS", () => {
  const src = planted(TODAY + "/today-readings.cjs",
    (s) => s.replace("function createReadingsWriter(",
      'const view = require("./machine-settings-view.mjs");\nfunction createReadingsWriter('));
  const code = codeOf(src);
  const edges = [...code.matchAll(/\b(?:require|import)\s*\(/g)].map((m) => m[0]);
  assert.notDeepEqual(edges, [],
    "THE FENCE DID NOT SEE A MODULE EDGE ADDED TO THE SEALED WEIGH-IN WRITER. The whole shape " +
    "of F.1 is that it takes every binding it needs by injection and reaches nothing.");
});

test("RED FENCE-SECOND-SEALED-IMPORT: a second module edge in the gym lane FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("  let settingsReading = null;",
      "  const extra = () => import('./checkin-model.mjs');\n  void extra;\n  let settingsReading = null;"));
  const edges = [...src.matchAll(/\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.notDeepEqual(edges, ["./machine-settings-host.mjs"],
    "THE FENCE DID NOT SEE A SECOND MODULE EDGE OPENED BY THE SEALED GYM LANE");
});

/* ---- ROW 6: S-R12's standing guard, in the form a token scanner can hold --------------- */

test("E.5 row 16: the gym paint() body reaches EXACTLY ONE durable writer, model.start()", () => {
  const code = codeOf(readRepo(TODAY + "/gym-app.mjs"));
  const lines = code.split("\n");
  const from = lines.findIndex((l) => /^\s{2}async function paint\(\)\s*\{/.test(l));
  assert.notEqual(from, -1, "paint() is not where the spec says it is");
  let to = -1;
  for (let i = from + 1; i < lines.length; i += 1) if (lines[i] === "  }") { to = i; break; }
  assert.notEqual(to, -1, "paint() does not close at factory depth");
  const inPaint = memberHits(lines.slice(from, to + 1).join("\n"), PUT);
  assert.deepEqual([...new Set(inPaint.map((h) => h.name))], ["start"],
    "FENCE-PAINT-REACHES-PUT: a SECOND durable write taken during a paint. The one that " +
    "exists, model.start() in paint(), is a declared pre-existing fact with its own ticket " +
    "(GYM-START-IN-PAINT); a second is a new one and this row is the standing guard around it.");
});

test("RED: a SECOND durable write inside the gym paint() FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("      const started = await model.start();",
      "      await model.recover();\n      const started = await model.start();"));
  const lines = codeOf(src).split("\n");
  const from = lines.findIndex((l) => /^\s{2}async function paint\(\)\s*\{/.test(l));
  let to = -1;
  for (let i = from + 1; i < lines.length; i += 1) if (lines[i] === "  }") { to = i; break; }
  const inPaint = memberHits(lines.slice(from, to + 1).join("\n"), PUT);
  assert.notDeepEqual([...new Set(inPaint.map((h) => h.name))], ["start"],
    "THE FENCE DID NOT SEE A SECOND DURABLE WRITE TAKEN DURING A PAINT");
});

/* ---- ROW 7: the part-2 rows, declared as not yet judged -------------------------------- */

test("part 2's file is not here yet, and this cell says so rather than passing silently", () => {
  const exists = fs.existsSync(path.join(ROOT, PART_TWO));
  if (exists) {
    const prose = literalsOf(readRepo(PART_TWO)).filter(isProse);
    assert.deepEqual(prose, [], "FENCE-COPY-IN-SEAL in today-lanes.cjs");
  } else {
    console.log("  today-lanes.cjs does not exist yet: the copy row, the re-export rows, the " +
      "gesture-guard rows and E.5's on.listen row are part 2's and are NOT asserted here.");
  }
  assert.ok(true);
});

/* S-R27/S-R28: the same checker judges the released bytes and every in-memory
 * mutation below. A RED row passes only when its named refusal is actually returned. */
test('S-R27: the measured table covers every released file', () => {
  assert.deepEqual(RELEASED_FILES.map((f) => f.rel), RELEASED);
});
for (const rel of RELEASED) {   /* today-app.cjs is IN this list from part 2 on */
  const name = path.basename(rel);
  test('LEXER SELF-CHECK: brackets balance in ' + name, () => balancedTokens(readRepo(rel), name));
  test('LEXER SELF-CHECK: terminated literals and single-token string re-read in ' + name,
    () => checkedLiterals(readRepo(rel), name));
  test('LEXER INDEPENDENT CROSS-CHECK: keyword counts and offsets in ' + name, () => {
    const src = readRepo(rel);
    const counts = keywordCrossCheck(src, name);
    const regexes = codeTokens(src).filter((t) => t.kind === 'regex');
    console.log('  LEXER ' + name + ': regex=' + regexes.length + ', ' +
      Object.entries(counts).map(([k, v]) => k + '=' + v).join(', ') +
      ', templates=' + codeTokens(src).filter((t) => t.kind === 'template').length +
      '; regex sites=' + regexes.map((t) => lineAt(src, t.at) + ':' + t.value).join(', '));
  });
  test('LEXER INDEPENDENT CROSS-CHECK: node --check ' + name, (t) => {
    const result = spawnSync(process.execPath, ['--check', path.join(ROOT, rel)], { encoding: 'utf8' });
    if (result.error && ['EPERM', 'EACCES'].includes(result.error.code)) {
      t.skip('node --check spawn refused: ' + result.error.code + ' in ' + name);
      return;
    }
    assert.ifError(result.error);
    assert.equal(result.status, 0, 'FENCE-NODE-SYNTAX: ' + name + '\n' + result.stderr);
  });
}
for (const [name, src, reason] of [
  ['unclosed bracket', 'const x = (1;', 'FENCE-LEXER-BALANCE'],
  ['crossed brackets', '([)]', 'FENCE-LEXER-BALANCE'],
  ['unclosed interpolation bracket', '`value ${[1}`', 'FENCE-LEXER-BALANCE'],
  ['unclosed string', '"missing', 'FENCE-LEXER-UNTERMINATED'],
  ['unclosed template', '`missing', 'FENCE-LEXER-UNTERMINATED'],
  ['unclosed regex', 'const x = /missing', 'FENCE-LEXER-UNTERMINATED'],
  ['string escaped newline', '"a\\\nb"', 'FENCE-LEXER-LINEBREAK'],
  ['regex escaped newline', '/a\\\nb/', 'FENCE-LEXER-LINEBREAK'],
]) {
  test('RED lexer self-check: ' + name, () => {
    assert.throws(() => reason === 'FENCE-LEXER-BALANCE' ? balancedTokens(src, name) : checkedLiterals(src, name),
      (error) => error.message.includes(reason) && error.message.includes(name) && error.message.includes('offset'));
  });
}
test('RED independent cross-check: equal counts at wrong offsets still fail at first difference', () => {
  const src = 'const x = 1; const y = 2;';
  const broken = codeTokens(src).map((t) => t.at === 0 ? { ...t, at: 1 } : t);
  assert.throws(() => keywordCrossCheck(src, 'synthetic-offset.cjs', broken),
    /FENCE-LEXER-CROSSCHECK: synthetic-offset.cjs first differing offset 0/);
});
test('RED independent cross-check: missing keyword fails with file and offset', () => {
  const src = 'function probe() { return 1; }';
  const broken = codeTokens(src).filter((t) => t.value !== 'return');
  assert.throws(() => keywordCrossCheck(src, 'synthetic-missing.cjs', broken),
    /FENCE-LEXER-CROSSCHECK: synthetic-missing.cjs first differing offset 19/);
});
test('CONTROL lexer: division operands, regex contexts, escapes, classes and flags', () => {
  const src = 'const x = total / divisor / count; let y = 12 / 3; value++ / 2;\n' +
    'function probe() { return /[\\/"`]/gi; }\n' +
    'void (/x/); void [/y/]; void [0, /z/]; void typeof /w/;';
  balancedTokens(src, 'synthetic-regex.cjs');
  checkedLiterals(src, 'synthetic-regex.cjs');
  assert.equal(codeTokens(src).filter((t) => t.kind === 'regex').length, 5);
  assert.deepEqual(keywordCrossCheck(src, 'synthetic-regex.cjs'), { function: 1, const: 1, let: 1, return: 1 });
});
test('CONTROL independent stripper: keywords in comments, strings, templates and regexes are invisible', () => {
  const src = '/* function const let return */\n// function const let return\n' +
    'void "function const let return"; void `function const let return`;\n' +
    'const probe = /function const let return "`/;';
  assert.deepEqual(keywordCrossCheck(src, 'synthetic-prose.cjs'), { function: 0, const: 1, let: 0, return: 0 });
});
for (const file of RELEASED_FILES) {
  const name = path.basename(file.rel);
  test('FENCE-PRECONDITIONS: measured released sites in ' + name, () => {
    const src = readRepo(file.rel);
    assert.deepEqual(releasedRefusals(file, src), [], name);
    const syntax = measuredSyntax(src);
    console.log('  S-R28 ' + name + ': ' + Object.entries(syntax).map(([k, v]) => k + '=' + v.length).join(', '));
    console.log('  S-R27 ' + name + ': edges=' + moduleEdges(src).length + ', facade.lane=' + laneSites(src).length);
    for (const holderName of [...Object.keys(file.holders), ...(file.readingsUse ? ['readings'] : [])]) {
      const sites = codeTokens(src).filter((t) => t.kind === 'id' && t.value === holderName);
      console.log('  HOLDER ' + name + ': ' + holderName + '=' + sites.length +
        '; lines=' + sites.map((t) => lineAt(src, t.at)).join(','));
    }
  });
  test('CONTROL: comments and strings do not acquire capabilities in ' + name, () => {
    const src = plantLine(file, '/* weighIn(); facade.lane(); import("bad"); Object.save(); */\n' +
      'void "reopen facade.lane() settings[\'save\']()";');
    assert.deepEqual(releasedRefusals(file, src), []);
  });
  test('S-R28: zero code-position arguments identifiers in ' + name, () => {
    const sites = capabilitySites(readRepo(file.rel), 'arguments');
    assert.equal(sites.length, 0, 'FENCE-ARGUMENTS: measure and report new sites; do not declare them');
    console.log('  ARGUMENTS ' + name + ': ' + sites.length);
  });
  test('CONTROL S-R28 ' + name + ': arguments in a comment or string is not code', () => {
    const src = plantLine(file, '/* void arguments[0].settings; */\nvoid "arguments";');
    assert.deepEqual(releasedRefusals(file, src), []);
  });
  for (const holderName of [...Object.keys(file.holders), ...(file.readingsUse ? ['readings'] : [])]) {
    const holderRefusal = holderName === 'readings'
      ? 'FENCE-HOLDER-USE:readings' : 'FENCE-HOLDER-SITE:' + holderName;
    // Keep the four original mutation plants, including their actual source line.
    const holderTokens = capabilitySites(readRepo(file.rel), holderName);
    const firstLine = lineText(readRepo(file.rel), holderTokens[0].at);
    for (const [shape, line] of [
      ['bare reference', 'void ' + holderName + ';'],
      ['template reference', 'void `${' + holderName + '}`;'],
      ['duplicate declared line', firstLine],
      ['extra occurrence on declared line', null],
    ]) {
      test('RED S-R27(d) ' + name + ': ' + shape + ' -> ' + holderRefusal, () => {
        const src = line === null ? planted(file.rel, (s) => s.replace(firstLine, firstLine + ' void ' + holderName + ';'))
          : plantLine(file, line);
        assert.ok(releasedRefusals(file, src).includes(holderRefusal));
      });
    }
    test('CONTROL S-R27(d) ' + name + ': holder prose is not a code site', () => {
      assert.deepEqual(releasedRefusals(file, plantLine(file, '/* ' + holderName + ' */ void "' + holderName + '";')), []);
      if (holderName === 'readings') assert.equal(readingsUseOK(readRepo(file.rel)), true);
      else assert.equal(holderTokens.length, 3);
    });
  }
  for (const [shape, line, regexCount] of [
    ['regex containing double quote', 'const probe = /"/;', 1],
    ['regex containing backtick', 'const probe = /`/;', 1],
    ['division before regex', 'const probe = (12) / /"/.source.length;', 1],
    ['template containing regex', 'const probe = `value ${/[}"`]/.source}`;', 1],
  ]) {
    test('RED lexer position ' + name + ': ' + shape + ' keeps next-line witness visible', () => {
      const model = file.rel.endsWith('/today-model.cjs');
      const witness = model ? 'void weighIn(180);' : 'void facade.lane();';
      const refusal = model ? 'FENCE-CAPABILITY-SITE:weighIn' : 'FENCE-LANE-ACQUISITION';
      const sample = line + '\n' + witness;
      checkedLiterals(sample, shape);
      balancedTokens(sample, shape);
      assert.equal(codeTokens(line).filter((t) => t.kind === 'regex').length, regexCount);
      assert.ok(releasedRefusals(file, plantLine(file, sample)).includes(refusal), refusal);
    });
  }
  test('CONTROL: Promise.all remains STORE, not PUT, in ' + name, () => {
    const src = plantLine(file, 'void Promise.all([]);');
    assert.deepEqual(releasedRefusals(file, src), []);
    assert.equal(memberHits(codeOf(src), STORE).some((h) => h.receiver === 'Promise' && h.name === 'all'), true);
    assert.equal(memberHits(codeOf(readRepo(file.rel)), PUT)
      .filter((h) => NOT_A_STORE_RECEIVER.includes(h.receiver)).length, 0, 'measured cost of dropping PUT suppression');
  });
  const syntaxPlants = [
    ['arguments access', 'void arguments[0].settings;', 'FENCE-ARGUMENTS'],
    ['quoted key', "void settings['save'](machine);", 'FENCE-BRACKET-KEY'],
    ['backtick key', 'void settings[`save`](machine);', 'FENCE-BRACKET-KEY'],
    ['concatenated key', "void settings[key + 've'](machine);", 'FENCE-BRACKET-KEY'],
    ['variable concatenated key', 'void settings[key + suffix](machine);', 'FENCE-BRACKET-KEY'],
    ['optional bracket', "void settings?.['save']?.(machine);", 'FENCE-BRACKET-KEY'],
    ['holder destructure', 'const { save: write } = settings; write(machine);', 'FENCE-CAPABILITY-DESTRUCTURE'],
    ['lane destructure', 'const [write] = settingsLane; write(machine);', 'FENCE-CAPABILITY-DESTRUCTURE'],
    ['loop destructure', 'for (const { save: write } of settings) write(machine);', 'FENCE-CAPABILITY-DESTRUCTURE'],
    ['template call', 'void `${auditStore.save(machine)}`;', 'FENCE-TEMPLATE-CALL'],
    ['nested template call', 'void `${`${auditStore.save(machine)}`}`;', 'FENCE-TEMPLATE-CALL'],
    ['builtin declaration', 'const Object = auditStore;', 'FENCE-BUILTIN-SHADOW'],
    ['builtin second declaration', 'let x = 0, Set = auditStore;', 'FENCE-BUILTIN-SHADOW'],
    ['builtin destructured declaration', 'const { sink: JSON } = auditStore;', 'FENCE-BUILTIN-SHADOW'],
    ['builtin function name', 'function Array() {}', 'FENCE-BUILTIN-SHADOW'],
    ['builtin method name', 'const obj = { Date() {} };', 'FENCE-BUILTIN-SHADOW'],
    ['builtin parameter', 'function probe(Math) {}', 'FENCE-BUILTIN-SHADOW'],
    ['builtin arrow parameter', 'const probe = Number => Number;', 'FENCE-BUILTIN-SHADOW'],
    ['builtin parenthesized arrow parameter', 'const probe = (String) => String;', 'FENCE-BUILTIN-SHADOW'],
    ['builtin imported binding', "import { item as Object } from './today-app.cjs';", 'FENCE-BUILTIN-SHADOW'],
    ['builtin PUT without declaration', 'Object.save(machine);', 'FENCE-WRITER-NAME'],
    ['newline member', 'auditStore.\nsave(machine);', 'FENCE-WRITER-NAME'],
    ['newline before dot', 'auditStore\n.save(machine);', 'FENCE-WRITER-NAME'],
    ['static import', "import audit from './machine-settings-host.mjs';", 'FENCE-RELEASED-MODULE-EDGE'],
    ['side effect import', "import './machine-settings-host.mjs';", 'FENCE-RELEASED-MODULE-EDGE'],
    ['dynamic import', "void import('./machine-settings-host.mjs');", 'FENCE-RELEASED-MODULE-EDGE'],
    ['require', "void require('./machine-settings-host.mjs');", 'FENCE-RELEASED-MODULE-EDGE'],
    ['nonliteral import', 'void import(moduleName);', 'FENCE-RELEASED-MODULE-EDGE'],
    ['nonliteral require', 'void require(moduleName);', 'FENCE-RELEASED-MODULE-EDGE'],
    ['re-export edge', "export { host } from './machine-settings-host.mjs';", 'FENCE-RELEASED-MODULE-EDGE'],
    ['template lane reference', 'void `${facade.lane}`;', 'FENCE-LANE-ACQUISITION'],
  ];
  for (const [shape, line, reason] of syntaxPlants) {
    test('RED S-R27/S-R28 ' + name + ': ' + shape + ' -> ' + reason, () => {
      assert.ok(releasedRefusals(file, plantLine(file, line)).includes(reason), reason);
    });
  }
  for (const holderName of ['facade', 'hooks', 'model', 'settings', 'readings', 'lane', 'foodDays', 'sleepNights']) {
    test('RED S-R28 ' + name + ': destructure from ' + holderName, () => {
      const src = plantLine(file, 'const { write } = ' + holderName + ';');
      assert.ok(releasedRefusals(file, src).includes('FENCE-CAPABILITY-DESTRUCTURE'));
    });
  }
  for (const capability of Object.keys(file.capabilities)) {
    test('RED S-R27 ' + name + ': bare ' + capability + ' outside declared sites', () => {
      const src = plantLine(file, '  void ' + capability + '(180);');
      assert.ok(releasedRefusals(file, src).includes('FENCE-CAPABILITY-SITE:' + capability));
    });
    test('RED S-R27 ' + name + ': template reference to ' + capability, () => {
      const src = plantLine(file, 'void `${' + capability + '}`;');
      assert.ok(releasedRefusals(file, src).includes('FENCE-CAPABILITY-SITE:' + capability));
    });
  }
  test('RED S-R28 ' + name + ': duplicated composition line is not a new exception', () => {
    const original = readRepo(file.rel), ts = codeTokens(original);
    const d = declarations(ts).find((d) => d.destructured && ts.slice(d.rhs, d.to).some(holder));
    const src = plantLine(file, original.slice(ts[d.from - 1].at, ts[d.to].end));
    assert.ok(releasedRefusals(file, src).includes('FENCE-CAPABILITY-DESTRUCTURE'));
  });
  for (const site of file.lane) {
    test('RED S-R27 ' + name + ': repeated acquisition ' + site.trim(), () => {
      const original = readRepo(file.rel), ts = codeTokens(original);
      const at = ts.findIndex((t, i) => t.value === 'facade' && windowAt(ts, i, 'facade', site));
      assert.ok(at >= 0, 'declared lane window must land');
      assert.ok(releasedRefusals(file, plantLine(file, lineText(original, ts[at].at))).includes('FENCE-LANE-ACQUISITION'));
    });
  }
}

/* S-R27(e): each declared site gets an executable-syntax look edit on its
 * original line AND a whitespace-only reformat of its token window. */
const LOOK_EDITS = {
  'const { weighIn ,': ['FORM_MAX } =', 'FORM_MAX, lookHint } ='],
  'const { weighIn , reopen ,': ['FORM_MAX } =', 'FORM_MAX, lookHint } ='],
  'read , weighIn ,': ['setPendingAdoption,', 'setPendingAdoption, lookHint: null,'],
  'read , weighIn , reopen ,': ['setPendingAdoption,', 'setPendingAdoption, lookHint: null,'],
  'settings } = { } )': ['{ model, onBack,', '{ lookHint, model, onBack,'],
  'createGymSettingsLane ( doc , phone , model , settings ,': ['settings, painter);', 'settings, painter); void painter;'],
  'createReadingsWriter ( { day , readings ,': ['readings, adoptedRead, stateFromOps,', 'readings, adoptedRead, stateFromOps, lookHint: null,'],
  ', readings ,': ['    readings,', '    readings, lookHint: null,'],
  '} = createReadingsWriter (': ['FORM_MAX } =', 'FORM_MAX, lookHint } ='],
  '} = createGymSettingsLane (': ['settings, painter);', 'settings, painter); void painter;'],
  /* PART 2. An ordinary look edit on the composition line: one more injected constant
     handed to the seal, exactly the shape a later ticket would add, and the pin stays
     GREEN because it is a token window and not a source line (S-R27 (e)). */
  '} = createTodayLanes (': ['SLEEP_ROLLOVER, SLEEP_UNCERTAIN });',
    'SLEEP_ROLLOVER, SLEEP_UNCERTAIN, lookHint: null });'],
};
for (const file of RELEASED_FILES) {
  const windows = [...Object.values(file.capabilities).flat(), ...Object.values(file.holders).flat(),
    ...file.lane, ...file.syntax.destructure, ...(file.readingsUse ? READINGS_PASS : [])];
  for (const window of windows) {
    test('GREEN unrelated same-line edit ' + path.basename(file.rel) + ': ' + window, () => {
      const [before, after] = LOOK_EDITS[window];
      assert.equal(before.includes('\n') || after.includes('\n'), false);
      const src = planted(file.rel, (s) => s.replace(before, after));
      assert.deepEqual(releasedRefusals(file, src), []);
      balancedTokens(src, window);
      checkPlantSyntax(file, src);
    });
    test('GREEN reformat ' + path.basename(file.rel) + ': ' + window, () => {
      const src = readRepo(file.rel), ts = codeTokens(src), values = window.split(' ');
      const start = ts.findIndex((t, i) => values.every((v, j) => ts[i + j]?.value === v) &&
        (window !== ', readings ,' || inReturnedObject(ts, i + 1)));
      assert.ok(start >= 0, 'window must exist');
      const end = start + values.length - 1;
      // JavaScript forbids a line terminator immediately before an arrow.
      const formatted = values.join('\n').replace(/\n=>/g, ' =>');
      const out = src.slice(0, ts[start].at) + '\n' + formatted + '\n' + src.slice(ts[end].end);
      assert.notEqual(out, src);
      assert.deepEqual(releasedRefusals(file, out), []);
      balancedTokens(out, window);
      checkPlantSyntax(file, out);
    });
  }
}
/* S10 (S10-WORKING-BRIEF.md c58b892 section 4.2, review l3 D-S10B3-ANCHOR): LOOK_EDITS kept three
   dead keys for the facade.lane() spellings GSS removed from the released gym card (fence
   :1255-:1257 at 66d32530). S10 drops them WITH THIS ROW and never silently: every LOOK_EDITS
   key must be a declared window of some released file, so a key left behind by a later
   removal turns this row red by name instead of lingering as an unused exemption. */
test('S10 LOOK_EDITS: every key is a declared window of a released file (no dead key)', () => {
  const live = new Set(RELEASED_FILES.flatMap((file) => [...Object.values(file.capabilities).flat(),
    ...Object.values(file.holders).flat(), ...file.lane, ...file.syntax.destructure,
    ...(file.readingsUse ? READINGS_PASS : [])]));
  const dead = Object.keys(LOOK_EDITS).filter((key) => !live.has(key));
  assert.deepEqual(dead, [], 'LOOK_EDITS keys with no declared window: ' + JSON.stringify(dead));
});
function checkPlantSyntax(file, src) {
  const mode = file.rel.endsWith('.mjs') ? 'module' : 'commonjs';
  const result = spawnSync(process.execPath, ['--check', '--input-type=' + mode], { input: src, encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
}
const modelFile = RELEASED_FILES.find((f) => f.readingsUse);
test('S-R27(e): measured readings read list is closed and disjoint from PUT', () => {
  const ts = codeTokens(readRepo(modelFile.rel));
  const members = [...new Set(ts.flatMap((t, i) => t.value === 'readings' && ts[i + 1]?.value === '.'
    ? [ts[i + 2].value] : []))];
  // The list is closed, but deleting/repeating a permitted read is a look edit.
  for (const member of members) assert.ok(READINGS_READ.includes(member), member);
  for (const member of READINGS_READ) assert.equal(PUT.includes(member), false, member);
  console.log('  READINGS closed read list: ' + members.join(', '));
});
test('GREEN readings.face view line accepts one more field', () => {
  const src = planted(modelFile.rel, (s) => s.replace('blocked: true,', 'blocked: true, lookHint: null,'));
  assert.deepEqual(releasedRefusals(modelFile, src), []);
  checkPlantSyntax(modelFile, src);
});
test('GREEN readings use has no per-site or total-count pin', () => {
  const src = planted(modelFile.rel, (s) => s.replace('readings.outboxRetained()', 'null'));
  assert.deepEqual(releasedRefusals(modelFile, src), []);
  checkPlantSyntax(modelFile, src);
});
for (const line of [
  'const alias = readings;',
  'void readings[key];',
  'consume(readings);',
  'void options.readings;',
  'const second = options.readings; void second;',
  'consume(options.readings);',
  'void options.readings[key]();',
  'readings.save();',
  'readings.unknownMember();',
  'const copy = { ...readings };',
  'void !readings[key];',
  'void !readings.save();',
  'void other.readings;',
  'consume({ engine: E, readings, lookHint: null });',
]) {
  test('RED readings use -> FENCE-HOLDER-USE:readings: ' + line, () => {
    assert.ok(releasedRefusals(modelFile, plantLine(modelFile, line)).includes('FENCE-HOLDER-USE:readings'));
  });
}
for (const line of [
  'void (readings ? 1 : 0);',
  'void (readings != null ? 1 : 0);',
  'void (readings === null);',
  'void readings?.paint();',
  'void (readings && true);',
  'void (readings || false);',
  'void !readings; void !!readings;',
  'if (readings && true) { void 0; }',
  ...READINGS_READ.map((member) => 'void readings.' + member + '();'),
]) {
  test('GREEN readings use: ' + line, () => {
    assert.deepEqual(releasedRefusals(modelFile, plantLine(modelFile, line)), []);
  });
}

for (const rel of SEALED) {
  test('RED R2 F1: template prose in ' + path.basename(rel), () => {
    const src = planted(rel, (s) => s + '\nconst m = `That weight looks wrong. Nothing was recorded.`; void m;\n');
    assert.notDeepEqual(literalsOf(src).filter(isProse), literalsOf(readRepo(rel)).filter(isProse), 'FENCE-COPY-IN-SEAL');
  });
}

/* The exact blind-review table. Each gym snippet had these two locals FIRST;
 * acquisition must fail even when the later save spelling is opaque. Controls
 * that were RED must still be visible to the PUT row as well as acquisition. */
const BLIND_GYM_TABLE = [
  ['dot call', 'auditStore.save(auditMachine);', 'RED'],
  ['member alias', 'const auditSave = auditStore.save; auditSave(auditMachine);', 'RED'],
  ['destructured alias', 'const { save: auditSave } = auditStore; auditSave(auditMachine);', 'GREEN'],
  ['concatenated bracket', "auditStore['sa' + 've'](auditMachine);", 'GREEN'],
  ['optional call', 'auditStore.save?.(auditMachine);', 'RED'],
  ['optional computed', "auditStore?.['save']?.(auditMachine);", 'GREEN'],
  ['microtask', 'queueMicrotask(() => auditStore.save(auditMachine));', 'RED'],
  ['promise', 'Promise.resolve().then(() => auditStore.save(auditMachine));', 'RED'],
  ['builtin shadow', '{ const Object = auditStore; Object.save(auditMachine); }', 'GREEN'],
  ['template interpolation', 'void `${auditStore.save(auditMachine)}`;', 'GREEN'],
  ['newline', 'auditStore.\nsave(auditMachine);', 'GREEN'],
  ['direct lane save', 'void facade.lane().save(auditMachine);', 'RED'],
  ['direct lane bracket', "void facade.lane()['save'](auditMachine);", 'GREEN'],
  ['hooks bracket', "hooks.saving(facade.lane()['save'](auditMachine));", 'GREEN'],
];
const auditLocals = "const auditMachine = { exercise_id: liftId, settings: [{ name: 'Seat', value: 'four' }], cues: 'Synthetic cue.' };\n" +
  'const auditStore = facade.lane();\n';
for (const file of RELEASED_FILES) {
  for (const [shape, line, before] of BLIND_GYM_TABLE) {
    test('RED blind table ' + path.basename(file.rel) + ': ' + shape + ' (was ' + before + ' in gym)', () => {
      const refusals = releasedRefusals(file, plantLine(file, auditLocals + line));
      assert.ok(refusals.includes('FENCE-LANE-ACQUISITION'), 'FENCE-LANE-ACQUISITION');
      if (before === 'RED') assert.ok(refusals.includes('FENCE-WRITER-NAME'), 'original RED control still sees PUT');
    });
  }
}

test('GSS-CACHE-DETACHED: entryFor returns detached deeply frozen data', async () => {
  const { createGymSettingsLane } = await import('../../../m3/w7-preview/today/gym-settings-lane.mjs');
  const latest = { machine: { settings: [{ name: 'Seat', value: 'four' }] } };
  const phone = { querySelectorAll: () => [], contains: () => false };
  const pair = createGymSettingsLane({}, phone, { day: '2026-09-03', read: async () => ({}) },
    { latest: async () => latest }, { repaint: () => {} });
  for (const object of [pair, pair.facade, pair.hooks, pair.api]) assert.equal(Object.isFrozen(object), true);
  await pair.hooks.startRead('synthetic-lift');
  const entry = pair.facade.entryFor('synthetic-lift');
  assert.equal(Object.isFrozen(entry), true);
  assert.equal(pair.facade.stateFor('synthetic-lift'), 'known');
  assert.throws(() => { entry.state = 'failed'; }, TypeError);
  assert.equal(pair.facade.stateFor('synthetic-lift'), 'known');
  assert.notEqual(pair.facade.entryFor('synthetic-lift'), entry);
  assert.equal(Object.isFrozen(entry.latest), true);
  assert.equal(Object.isFrozen(entry.latest.machine.settings), true);
  assert.equal(Object.isFrozen(entry.latest.machine.settings[0]), true);
  latest.machine.settings[0].value = 'injected';
  assert.equal(pair.facade.entryFor('synthetic-lift').latest.machine.settings[0].value, 'four');
});

/* Retain every old measurement: the gym holder pin turns its three rows RED. */
const PREVIOUS_RESIDUE = [
  "const key = 'sa' + 've'; settings[key](auditMachine);",
  "Reflect.apply(Reflect.get(settings, 'save'), settings, [auditMachine]);",
  'const alias = settings; const { save: write } = alias; write(auditMachine);',
];
for (const file of RELEASED_FILES) {
  for (const [i, line] of PREVIOUS_RESIDUE.entries()) {
    const reason = file.holders.settings ? 'FENCE-HOLDER-SITE:settings' : null;
    test((reason ? 'RED' : 'CONTROL') + ' former residue ' + path.basename(file.rel) + ': spelling ' + (i + 1), () => {
      const refusals = releasedRefusals(file, plantLine(file, line));
      if (reason) assert.ok(refusals.includes(reason), reason);
      // today-model has no settings binding; this old synthetic spelling still
      // scans GREEN there, but is not a path through that file's actual raw store.
      else assert.deepEqual(refusals, []);
    });
  }
}
/* Deliberately GREEN residue, measured for the reviewer/PM. No durability claim:
 * these strings are scanned, not executed, and require review of the actual diff. */
const RESIDUE = [
  { shape: 'computed writer through model',
    line: "const key = 'log' + 'Set'; model[key](auditMachine);" },
  { shape: 'mutable object returned by facade',
    line: "const cached = facade.entryFor(liftId); if (cached) cached.state = 'failed';" },
  { shape: 'released helper parameter mutation',
    anchor: '    const paintedDraft = settingsDraft;',
    line: "    paintedDraft.cues = 'Synthetic changed cue.';" },
  { shape: 'review F1 R4: computed writer through an intermediate local',
    line: "const store = model; const key = 'log' + 'Set'; store[key](m);" },
  { shape: 'review F1 R5: destructure through an intermediate local',
    line: 'const store = model; const { logSet: write } = store; write(m);' },
  { shape: 'review F1 R6: Reflect.get writer',
    line: "const write = Reflect.get(model, 'logSet'); write(m);" },
  { shape: 'review F1 R7: property descriptor writer',
    line: "Object.getOwnPropertyDescriptor(model, 'logSet').value.call(model, m);" },
  { shape: 'review F1 R8: loop variable member key',
    line: "for (const k of ['logSet']) model[k](m);" },
  { shape: 'review F1 R9: optional variable member key',
    line: 'const key = "logSet"; model?.[key](m);' },
  { shape: 'review F1 R10: computed writer through the mutable cache entry',
    line: 'const held = facade.entryFor(liftId); const key = "save"; if (held) held.host[key](m);' },
  { shape: 'review F1 R11: draft mutation through an intermediate local',
    line: "const draftRow = paintedDraft; draftRow.cues = 'changed';" },
];
const gymFile = RELEASED_FILES.find((f) => f.rel.endsWith('/gym-app.mjs'));
for (const residue of RESIDUE) {
  test('RECORDED RESIDUE gym-app.mjs: ' + residue.shape + ' still passes', () => {
    const src = residue.anchor ? planted(gymFile.rel,
      (s) => s.replace(residue.anchor, residue.anchor + '\n' + residue.line)) : plantLine(gymFile, residue.line);
    assert.deepEqual(releasedRefusals(gymFile, src), []);
  });
}

/* Review F1: every plant is judged by releasedRefusals on in-memory released bytes. */
for (const [shape, line] of [
  ['plain writer control', 'model.recover();'],
  ['PM two divisions on one line', 'const a = w / 2; model.recover(); const b = h / 2;'],
  ['PM numeric division operands', 'const ratio = 4 / model.recover() / 2;'],
  ['PM identifier division operands', 'const ratio = width / model.recover() / height;'],
  ['F1-a writer between quote regexes', 'const probe1 = /"/;\nmodel.recover();\nconst probe2 = /"/;'],
  ['F1-a keyword-position regex', 'void typeof /"/;\nmodel.recover();\nconst m = /"/.source;'],
]) {
  test('RED review F1: ' + shape + ' -> FENCE-WRITER-NAME', () => {
    const src = plantLine(gymFile, line);
    assert.ok(releasedRefusals(gymFile, src).includes('FENCE-WRITER-NAME'));
    checkPlantSyntax(gymFile, src);
  });
}
for (const [shape, line] of [
  ['PM two divisions without a writer', 'const a = w / 2; const b = h / 2;'],
  ['F1-b look regex containing both quotes', `const NAME = /^[^'"]+$/;`],
]) {
  test('GREEN review F1: ' + shape, () => {
    const src = plantLine(gymFile, line);
    assert.deepEqual(releasedRefusals(gymFile, src), []);
    checkPlantSyntax(gymFile, src);
  });
}
for (const head of ['if (ok)', 'while (ok)', 'for (;;)']) {
  test('RED review F2: regex after ' + head + ' keeps lane acquisition and writer visible', () => {
    const src = plantLine(gymFile, head +
      ' /"/.test(tag); void facade.lane().save(auditMachine); const mark = /"/.source;');
    const refusals = releasedRefusals(gymFile, src);
    assert.ok(refusals.includes('FENCE-LANE-ACQUISITION'));
    assert.ok(refusals.includes('FENCE-WRITER-NAME'));
    checkedLiterals(src, head);
    balancedTokens(src, head);
    checkPlantSyntax(gymFile, src);
  });
}
test('GREEN review F2: the released gym division after a closing parenthesis stays division', () => {
  const src = readRepo(gymFile.rel), code = codeOf(src);
  assert.ok(src.includes('Math.round(next * 100) / 100'));
  assert.ok(code.includes('Math.round(next * 100) / 100'));
  assert.deepEqual(releasedRefusals(gymFile, src), []);
});
test('Review F1: codeOf preserves length, line count and line-break offsets in all three lexer files', () => {
  for (const rel of RELEASED) {   /* today-app.cjs is IN this list from part 2 on */
    const src = readRepo(rel), code = codeOf(src);
    assert.equal(code.length, src.length, rel);
    assert.equal(code.split('\n').length, src.split('\n').length, rel);
    const breaks = (text) => [...text.matchAll(/[\r\n\u2028\u2029]/g)].map((m) => [m.index, m[0]]);
    assert.deepEqual(breaks(code), breaks(src), rel);
  }
});
for (const line of [
  'const view = { settings: [] };',
  'const rows = map.settings;',
  'void machine.settings.length;',
]) {
  test('GREEN review F4: settings property look edit: ' + line, () => {
    const src = plantLine(gymFile, line);
    assert.deepEqual(releasedRefusals(gymFile, src), []);
  });
}
test('GREEN review F4: rename first to firstPaint', () => {
  const src = planted(gymFile.rel, (s) => s.replace(/\bfirst\b/g, 'firstPaint'));
  assert.deepEqual(releasedRefusals(gymFile, src), []);
  checkPlantSyntax(gymFile, src);
});
for (const [before, after] of [
  ['readings.face()', 'readings?.face()'],
  ['readings ? readings.paint()', 'readings ? readings?.paint()'],
  ['const durable = !!readings;', 'const durable = readings !== null;'],
  ['readings ? readings.paint()', 'readings != null ? readings.paint()'],
]) {
  test('GREEN review F4: readings look edit: ' + after, () => {
    const src = planted(modelFile.rel, (s) => s.replace(before, after));
    assert.deepEqual(releasedRefusals(modelFile, src), []);
    checkPlantSyntax(modelFile, src);
  });
}
test('RED review F5: an extra options.readings has one holder refusal name', () => {
  assert.deepEqual(releasedRefusals(modelFile, plantLine(modelFile, 'void options.readings;')),
    ['FENCE-HOLDER-USE:readings']);
});

/* Check F2: N1/N2 witnesses stay synthetic and go through the released fence. */
const F2_SLASH_ROWS = [
  ['o.of writer', 'const a = o.of / 2; model.recover(); void h / 2;', 'FENCE-WRITER-NAME'],
  ['o.delete writer', 'const a = o.delete / 2; model.recover(); void h / 2;', 'FENCE-WRITER-NAME'],
  ['o.new writer', 'const a = o.new / 2; model.recover(); void h / 2;', 'FENCE-WRITER-NAME'],
  ['variable of writer', 'const of = 4; const a = of / 2; model.recover(); const b = h / 2;', 'FENCE-WRITER-NAME'],
  ['o.of lane', 'const a = o.of / 2; void facade.lane().save(auditMachine); void h / 2;', 'FENCE-LANE-ACQUISITION'],
  ['return regex', 'function probe() { return /re/.test(s); }', null],
  ['typeof regex', 'void typeof /re/;', null],
  ['for-of regex', 'for (const x of /re/.exec(s) ? [] : []) { void x; }', null],
  ['postfix division', 'let n = 0; const pct = n++ / total; const rate = done / total;', null],
];
for (const [shape, line, reason] of F2_SLASH_ROWS) {
  test('Check F2: ' + (reason ? 'RED ' : 'GREEN ') + shape, () => {
    const src = plantLine(gymFile, line);
    const refusals = releasedRefusals(gymFile, src);
    if (reason) assert.ok(refusals.includes(reason), reason + ': ' + JSON.stringify(refusals));
    else assert.deepEqual(refusals, []);
    if (reason) assert.ok(regexStripped(src).includes(shape === 'o.of lane'
      ? 'facade.lane().save(auditMachine)' : 'model.recover()'), 'independent reader keeps the witness');
    if (shape.endsWith('regex')) {
      assert.ok(codeTokens(line).some((t) => t.kind === 'regex' && t.value === '/re/'));
      assert.equal(regexStripped(line).includes('/re/'), false);
    }
    balancedTokens(src, shape);
    checkedLiterals(src, shape);
    keywordCrossCheck(src, shape);
    checkPlantSyntax(gymFile, src);
  });
}
const f2Mount = '{ model, onBack, onChanged, onCheckIn, draft, settings } = {}';
const f2Duplicate = '{ settings: alias, model, onBack, onChanged, onCheckIn, draft, settings } = {}';
const F2_BINDING_ROWS = [
  ['duplicated-key mount', (s) => s.replace(f2Mount, f2Duplicate)],
  ['renamed key before shorthand', (s) => s.replace('draft, settings }', 'draft, settings: alias, settings }')],
  ['renamed key after shorthand', (s) => s.replace('draft, settings }', 'draft, settings, settings: alias }')],
  ['duplicate plus leaked alias', (s) => 'export let leaked;\n' + s.replace(f2Mount, f2Duplicate)
    .replace(gymFile.anchor, '    leaked = alias;\n' + gymFile.anchor)],
  ['duplicate plus raw paint handle', (s) => s.replace(f2Mount, f2Duplicate)
    .replace('    lane: () => facade.lane(),', '    raw: () => alias,\n    lane: () => facade.lane(),')],
  ['const renamed key', (s) => s.replace(gymFile.anchor, '    const { settings: second } = opts;\n' + gymFile.anchor)],
  ['assignment renamed key', (s) => s.replace(gymFile.anchor, '    let second; ({ settings: second } = opts);\n' + gymFile.anchor)],
];
for (const [shape, edit] of F2_BINDING_ROWS) {
  test('Check F2: RED settings ' + shape, () => {
    const src = planted(gymFile.rel, edit);
    const refusals = releasedRefusals(gymFile, src);
    assert.ok(refusals.includes('FENCE-HOLDER-SITE:settings'), JSON.stringify(refusals));
    balancedTokens(src, shape);
    checkedLiterals(src, shape);
    keywordCrossCheck(src, shape);
    checkPlantSyntax(gymFile, src);
  });
}

/* ======================================================================================
   PART 2, THE BIG CUT: the rows for today-app.cjs and today-lanes.cjs
   --------------------------------------------------------------------------------------
   Added by the part 2 author, LAST, after merging the then-current branch, and under
   S-R26: these are ROWS AND TABLE ENTRIES. The scanner is the fence owner's and one
   four-line branch above became a two-entry lookup so that a SECOND released file could
   have declared seams of its own; nothing else in it moved.

   THE NUMBERING E.5 ASKS FOR (R3 NOTE-8: the build round that writes the cell numbers all
   of them and its report prints the numbering). Rows 1 to 5 are v1's five planted tricks,
   rows 6 to 10 v1's five structural rows, and 11 to 19 the spec's own numbered list; the
   build report's section on the fence prints which test carries which.
   ====================================================================================== */

/* ---- E.5 ROWS 1 and 11: today-app.cjs's three declared seams, keyed by SITE ------------ */

test("FENCE-WRITER-NAME: the released today-app.cjs holds EXACTLY the three declared seam WRITE SITES, and a fourth fails", () => {
  const hits = memberHits(codeOf(readRepo(TODAY + "/today-app.cjs")), PUT);
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.deepEqual(sites, Object.keys(TODAY_APP_DECLARED_SEAMS).sort(),
    "FENCE-WRITER-NAME: the released Today view reaches a durable writer that is not one of " +
    "the three declared seams. Each of the three is a line the big cut deliberately left " +
    "released, with a region id or a by-line declaration under S-R28; a fourth is a new " +
    "released decision about what gets stored and it is a STOP.");
  assert.equal(hits.length, TODAY_APP_DECLARED_SITES,
    "FENCE-WRITER-SITE-COUNT: " + hits.length + " durable write sites in the released Today " +
    "view, " + TODAY_APP_DECLARED_SITES + " declared. A SECOND call through an " +
    "already-declared receiver adds no new name and is still a fourth decision.");
});

test("RED E.5 row 11: a FOURTH durable writer in the released today-app.cjs FAILS", () => {
  const src = planted(TODAY + "/today-app.cjs",
    (s) => s.replace("    const view = model.read();",
      "    void facade.sleepLane().save({ date: \"2026-09-03\" });\n    const view = model.read();"));
  const hits = memberHits(codeOf(src), PUT);
  assert.notEqual(hits.length, TODAY_APP_DECLARED_SITES,
    "THE FENCE DID NOT SEE A FOURTH DURABLE WRITE IN THE RELEASED TODAY VIEW");
  assert.ok([...new Set(hits.map(siteOf))].includes("(call).save"),
    "the planted site is not the one the row names");
});

test("RED E.5 row 1: the alias const s = facade.sleepLane().save in today-app.cjs FAILS", () => {
  const src = planted(TODAY + "/today-app.cjs",
    (s) => s.replace("    const view = model.read();",
      "    const s = facade.sleepLane().save;\n    const view = model.read();"));
  const hits = memberHits(codeOf(src), PUT);
  assert.notEqual(hits.length, TODAY_APP_DECLARED_SITES,
    "THE FENCE DID NOT SEE A DURABLE WRITER TAKEN AS AN ALIAS, WHICH IS NOT EVEN A CALL");
});

/* ---- E.5 ROW 15: zero athlete-facing copy in the big sealed module --------------------- */

test("FENCE-COPY-IN-SEAL: today-lanes.cjs holds ZERO athlete-facing string literals", () => {
  const prose = literalsOf(readRepo(PART_TWO)).filter(isProse);
  assert.deepEqual(prose, [],
    "FENCE-COPY-IN-SEAL (S-R13): the sealed lane module composes the athlete's sentences " +
    "from constants it is HANDED and owns none of them. Every one of the twelve arrives by " +
    "name in the factory signature, so a look ticket edits copy in the released view and " +
    "never needs a sealed byte. A literal here is copy that C-UI-7 could not reach.");
});

test("RED E.5 row 15: a sentence planted in today-lanes.cjs FAILS", () => {
  const src = planted(PART_TWO, (s) => s.replace("  let gestures = 0;",
    "  const SORRY = 'That night could not be saved on this device.';\n  void SORRY;\n  let gestures = 0;"));
  assert.ok(literalsOf(src).filter(isProse).length > 0,
    "THE FENCE DID NOT SEE A SENTENCE PLANTED IN THE SEALED LANE MODULE");
});

/* ---- E.5 ROW 12: the interface objects of the big cut are frozen ----------------------- */

test("the big sealed module declares three Object.freeze wrappers, and the paint handle is frozen", () => {
  const code = codeOf(readRepo(PART_TWO));
  assert.match(code, /return Object\.freeze\(\{/, "the returned interface is not frozen");
  assert.match(code, /facade:\s*Object\.freeze\(\{/, "the facade table is not frozen");
  assert.match(code, /hooks:\s*Object\.freeze\(\{/, "the callback table is not frozen");
  assert.equal((code.match(/Object\.freeze\(/g) || []).length, 3,
    "three frozen objects and no more: a fourth is an interface nobody declared");
  const view = codeOf(readRepo(TODAY + "/today-app.cjs"));
  assert.match(view, /const painter = Object\.freeze\(\{/,
    "the paint handle the released view hands in is not frozen");
});

test("RED E.5 row 12: an unfrozen facade in today-lanes.cjs FAILS", () => {
  const src = planted(PART_TWO, (s) => s.replace("    facade: Object.freeze({", "    facade: ({"));
  assert.equal(/facade:\s*Object\.freeze\(\{/.test(codeOf(src)), false,
    "THE FENCE DID NOT SEE AN UNFROZEN READ-ONLY FACADE");
});

/* ---- E.5 ROW 8, AS A COUNTED PIN: the one-handoff rule is NOT BUILT, and this bounds it -
 * B.3's one-handoff rule says the released view never names `model` or `options` after the
 * handoff. THE BIG CUT DOES NOT BUILD IT: the released today-app.cjs still names `model`,
 * and therefore still reaches today-model.cjs's re-exported weigh-in writer, which is why
 * `model.weighIn` is one of the three declared seams above. The build report carries that
 * as an open STOP. What this row does is stop the debt GROWING: the count is measured and
 * declared, so a look ticket that adds a new `model.` read goes red and has to say so.   */

const TODAY_APP_MODEL_SITES = 32;
const TODAY_APP_OPTIONS_SITES = 2;

test("FENCE-MODEL-HELD: the released today-app.cjs names `model` exactly as many times as this round measured", () => {
  const ts = codeTokens(readRepo(TODAY + "/today-app.cjs"));
  const sites = ts.filter((t, i) => t.kind === "id" && t.value === "model"
    && ![".", "?."].includes(ts[i - 1]?.value));
  assert.equal(sites.length, TODAY_APP_MODEL_SITES,
    "FENCE-MODEL-HELD: the released Today view names `model` " + sites.length + " times and " +
    TODAY_APP_MODEL_SITES + " were measured when the big cut landed. B.3's one-handoff rule " +
    "is NOT BUILT (the build report says so at the top), so this row is not zero; it is a " +
    "PINNED COUNT, and a new one is a new released reach for the model's re-exported " +
    "writer. It is an EQUALITY and not a ceiling, and the PM ruled it so after Astra's " +
    "paper on the tickets found the build report calling it a ceiling while this row " +
    "asserted equality: A DROP HAS TO BE DELIBERATE TOO. Removing one of these reads is " +
    "work somebody did, and it lands in the report beside the count it changed.");
  assert.equal(codeTokens(readRepo(TODAY + "/today-app.cjs"))
    .filter((t, i, a) => t.kind === "id" && t.value === "options"
      && ![".", "?."].includes(a[i - 1]?.value)).length, TODAY_APP_OPTIONS_SITES,
    "FENCE-OPTIONS-HELD: `options` occurs in CODE exactly twice in the released view - the " +
    "mount's own parameter and the argument it hands the factory once - and that is B.3's " +
    "one-handoff rule, met for `options` even though it is not met for `model`. A third is " +
    "the released view reading the mount's injections again.");
});

test("RED E.5 row 8: one more `model` read in the released today-app.cjs FAILS", () => {
  const src = planted(TODAY + "/today-app.cjs",
    (s) => s.replace("    const view = model.read();", "    void model;\n    const view = model.read();"));
  const ts = codeTokens(src);
  const sites = ts.filter((t, i) => t.kind === "id" && t.value === "model"
    && ![".", "?."].includes(ts[i - 1]?.value));
  assert.notEqual(sites.length, TODAY_APP_MODEL_SITES,
    "THE FENCE DID NOT SEE A NEW RELEASED REACH FOR THE MODEL");
});

/* ---- E.5 ROW 19 (R3 NOTE-4, and it is part 2's because hooks.listen did not exist) ------
 * E.6's runtime guard depends on the released view installing EVERY listener through the
 * seal's shim. A plain addEventListener added by any of the six look tickets that edit
 * this file leaves the gesture counter at zero, and a guarded writer called from that
 * handler throws WRITER-OUTSIDE-GESTURE IN FRONT OF THE ATHLETE instead of saving. One
 * token-scan row turns that one-time census into a standing law.                        */

/* The shim exists for ONE pair so far. gym-app.mjs's sealed partner has no listen shim
   (E.6's five gym subjects are not this round's), so its own listeners are counted and
   pinned instead of forbidden: the debt cannot grow silently, and the day the gym card
   gets a shim this table entry becomes a zero like today-app.cjs's. */
const LISTENERS_OUTSIDE_SHIM = {
  [TODAY + "/today-app.cjs"]: 0,
  [TODAY + "/today-model.cjs"]: 0,
  [TODAY + "/gym-app.mjs"]: 0,
};

test("E.5 row 19: NO released file calls addEventListener outside hooks.listen, except the gym card, counted", () => {
  for (const rel of RELEASED) {
    const code = codeOf(readRepo(rel));
    const hits = (code.match(/\.\s*(add|remove)EventListener\s*\(/g) || []);
    assert.equal(hits.length, LISTENERS_OUTSIDE_SHIM[rel],
      "FENCE-LISTENER-OUTSIDE-SHIM: " + rel + " installs or removes " + hits.length +
      " listener(s) directly and " + LISTENERS_OUTSIDE_SHIM[rel] + " were measured. " +
      "E.6's guard can only tell a gesture from a paint if every listener goes through the " +
      "seal's shim, and a writer called from a handler the seal never saw throws in front " +
      "of the athlete rather than saving (E.5 row 19, R3 NOTE-4).");
  }
});

test("the sealed lane module is the ONLY place addEventListener is spelled, and exactly twice", () => {
  const code = codeOf(readRepo(PART_TWO));
  assert.equal((code.match(/\.\s*addEventListener\s*\(/g) || []).length, 1, "listen");
  assert.equal((code.match(/\.\s*removeEventListener\s*\(/g) || []).length, 1, "unlisten");
});

test("RED E.5 row 19: a plain addEventListener added to the released today-app.cjs FAILS", () => {
  const src = planted(TODAY + "/today-app.cjs",
    (s) => s.replace("    const view = model.read();",
      "    phone.addEventListener(\"click\", () => {});\n    const view = model.read();"));
  const hits = (codeOf(src).match(/\.\s*(add|remove)EventListener\s*\(/g) || []);
  assert.notDeepEqual(hits, [],
    "THE FENCE DID NOT SEE A LISTENER INSTALLED OUTSIDE THE SHIM");
});

/* ---- E.6 THE RUNTIME GUARD: the rows that RUN, because nothing static can see this ------
 * E.6's whole argument is that a callback the seal hands the view is, to any static reader,
 * just a function, and that a token scan and a parser are both blind to where it is called
 * from. These four rows are therefore the only ones in this cell that EXECUTE the sealed
 * module. They build the real factory over inert stubs - no store, no host, no document
 * beyond an empty jsdom - and drive the guard directly.
 *
 * The subject list is REACH.md's rule, guarded if and only if it reaches a durable PUT and
 * no paint root reaches it, and in THIS file that is exactly two: recordIntake reaches
 * foodLane.save and recordSleep reaches sleepLane.save. E.6's other seven subjects are not
 * this round's - five are the gym card's and two are released seams no sealed guard can
 * reach - and the build report names all seven.                                          */

const laneStubs = (doc) => {
  const copy = {};
  for (const n of ["FOOD_REASON", "FOOD_REFUSAL_COPY", "FOOD_REFUSED", "FOOD_REFUSED_ACTION",
    "SLEEP_CHECKIN_CHANGED", "SLEEP_KEPT", "SLEEP_NIGHT_CHANGED", "SLEEP_NOTHING_RECORDED",
    "SLEEP_NOT_SAVED", "SLEEP_REFUSAL_COPY", "SLEEP_ROLLOVER", "SLEEP_UNCERTAIN"]) copy[n] = "x";
  const noop = () => {};
  return Object.assign({
    doc, options: {}, model: { today: "2026-09-03", read: () => ({}), stateFromOps: () => ({}) },
    painter: Object.freeze({ repaint: noop, screenNow: () => "today", token: () => 0,
      clearDraft: noop, paintTodayEntry: noop }),
    phone: doc.getElementById("phone"), status: null, tell: noop,
    athleteStateFailureCopy: () => "x", reasonOf: () => "x", sleepTyped: () => false,
  }, copy);
};

test("E.6: the two guarded writers THROW WRITER-OUTSIDE-GESTURE when called outside a gesture", async () => {
  const { JSDOM } = await import("jsdom");
  const { createTodayLanes } = await import("../../../m3/w7-preview/today/today-lanes.cjs");
  const dom = new JSDOM("<!doctype html><div id=phone></div>");
  const { hooks } = createTodayLanes(laneStubs(dom.window.document));
  assert.throws(() => hooks.recordIntake(null, null, null, null), /WRITER-OUTSIDE-GESTURE: recordIntake/,
    "E.6: the food writer ran with no gesture on the stack");
  assert.throws(() => hooks.recordSleep(new Map()), /WRITER-OUTSIDE-GESTURE: recordSleep/,
    "E.6: the sleep writer ran with no gesture on the stack");
});

test("E.6: a writer called from a real dispatch through hooks.listen is NOT stopped by the guard", async () => {
  const { JSDOM } = await import("jsdom");
  const { createTodayLanes } = await import("../../../m3/w7-preview/today/today-lanes.cjs");
  const dom = new JSDOM("<!doctype html><div id=phone></div>");
  const doc = dom.window.document;
  const { hooks } = createTodayLanes(laneStubs(doc));
  const button = doc.createElement("button");
  let verdict = "the listener never ran";
  hooks.listen(button, "click", () => {
    try { hooks.recordSleep(new Map()); verdict = "past the guard"; }
    catch (e) { verdict = /WRITER-OUTSIDE-GESTURE/.test(e.message) ? "GUARD THREW" : "past the guard"; }
  });
  dom.window.addEventListener("error", () => {});
  button.dispatchEvent(new dom.window.Event("click"));
  assert.equal(verdict, "past the guard",
    "E.6: the guard stopped a writer called from a REAL DOM dispatch, which is the happy " +
    "path and would be the athlete's save failing in front of him");
});

test("E.6: an ENTRY-class callback is NOT guarded and runs with no gesture at all", async () => {
  const { JSDOM } = await import("jsdom");
  const { createTodayLanes } = await import("../../../m3/w7-preview/today/today-lanes.cjs");
  const dom = new JSDOM("<!doctype html><div id=phone></div>");
  const { hooks } = createTodayLanes(laneStubs(dom.window.document));
  /* openFoodLane reaches host.all() and model.setFoodDays(), which are STORE and ADOPT and
     not a PUT, so E.6 measures it ENTRY and it must open on the first paint exactly as it
     does today. A guard here would be the food block never opening. */
  assert.doesNotThrow(() => hooks.openFoodLane(),
    "E.6: an ENTRY-class callback was guarded, which stops the lane opening on first paint");
});

test("E.6: hooks.unlisten removes the SAME wrapper hooks.listen added", async () => {
  const { JSDOM } = await import("jsdom");
  const { createTodayLanes } = await import("../../../m3/w7-preview/today/today-lanes.cjs");
  const dom = new JSDOM("<!doctype html><div id=phone></div>");
  const doc = dom.window.document;
  const { hooks } = createTodayLanes(laneStubs(doc));
  const button = doc.createElement("button");
  let fired = 0;
  const handler = () => { fired += 1; };
  hooks.listen(button, "click", handler);
  button.dispatchEvent(new dom.window.Event("click"));
  hooks.unlisten(button, "click", handler);
  button.dispatchEvent(new dom.window.Event("click"));
  assert.equal(fired, 1,
    "with a shim in place the handler REGISTERED is the wrapper, so a dispose site that " +
    "removed the bare function would leave the listener attached for the life of the page");
});

test("RED E.6: the guard is what stops it, proved on the guard's OWN SHIPPED SOURCE", () => {
  /* No temp file and no second copy of the module: the guard is lifted out of the shipped
     bytes and run twice, once with the gesture counter at zero and once at one. A red row
     that planted a whole second .cjs beside the real one would leave a file in the today
     directory that every other cell's file scans can see, which is a worse hazard than the
     hole it proves. */
  /* The RAW source, not codeOf's: the stripper blanks string literals, and the refusal
     NAME is a string literal, so a guard lifted out of stripped code would throw an empty
     message and this row would prove nothing. The count assertion below uses the stripped
     form, where a `gesture(` inside a comment cannot be miscounted. */
  const raw = readRepo(PART_TWO), code = codeOf(raw);
  const guard = /const gesture = \(name, fn\)[\s\S]*?\n {2}\};/.exec(raw);
  assert.ok(guard, "the gesture guard is not in the sealed module in the shape this row reads");
  const make = (gestures) => new Function("gestures", guard[0] + "\n  return gesture;")(gestures);
  const writer = () => "the row landed";
  assert.throws(() => make(0)("recordSleep", writer)(), /WRITER-OUTSIDE-GESTURE: recordSleep/,
    "the guard did not stop a writer with the gesture counter at zero");
  assert.equal(make(1)("recordSleep", writer)(), "the row landed",
    "the guard stopped a writer with a gesture open, which is the athlete's save failing");
  /* And the plant E.5 asks for: the two entries WITHOUT the wrapper write with no gesture. */
  assert.equal(writer(), "the row landed",
    "THE UNWRAPPED WRITER DID NOT RUN, so this row proves nothing");
  /* TWO ENTRIES, counted in the STRIPPED code so a `gesture(` in a comment cannot be
     miscounted, and named in the raw source so the two are the two E.6 measured. */
  assert.equal((code.match(/[^.\w$]gesture\(/g) || []).length, 2,
    "exactly two entries are wrapped in the guard; a third or a first is a change to E.6's " +
    "measured subject list and the build report has to say which line forced it");
  for (const name of ["recordIntake", "recordSleep"]) {
    assert.ok(raw.indexOf('gesture("' + name + '", ') >= 0,
      "E.6: " + name + " is no longer the guarded entry it was measured to be");
  }
});

/* ---- LOOP ROUND 1: the blind review's surviving mutations, and F1's boundary ------------
 * The reviewer judged twenty-five single-clause product mutations by the whole runnable bar
 * and TEN CONSEQUENTIAL ONES SURVIVED it, exemplified by `gestures -= 1` becoming
 * `gestures -= 0`, after which all 395 rows here still passed while the counter stuck open
 * permanently and an ungestured food call saved. Each row below is the specific behavioural
 * assertion that kills one of those ten, written as the reviewer specified it. They run the
 * real sealed module over inert stubs, like the four E.6 rows above.
 *
 * ONE HARNESS NOTE THE REVIEWER MADE EXPLICITLY: a row that uses two separate factory
 * instances for the outside-gesture and inside-gesture checks CANNOT catch a leaked
 * counter. Every row below that touches the counter uses ONE instance and checks it again
 * after the dispatch has returned.                                                        */

const laneInstance = async (over) => {
  const { JSDOM, VirtualConsole } = await import("jsdom");
  const { createTodayLanes } = await import("../../../m3/w7-preview/today/today-lanes.cjs");
  /* A silent virtual console, because one row below makes a listener callback THROW on
     purpose and jsdom would otherwise forward that deliberate exception to this process
     and end the run. Nothing else is suppressed: every assertion below is its own. */
  const dom = new JSDOM("<!doctype html><div id=phone></div>", { virtualConsole: new VirtualConsole() });
  const doc = dom.window.document;
  const base = laneStubs(doc);
  /* jsdom re-emits a listener's exception as a window error event; the E.6 row above does
     the same, and without it one deliberately throwing callback ends the whole process. */
  dom.window.addEventListener("error", () => {});
  return { dom, doc, api: createTodayLanes(Object.assign(base, over || {})) };
};
const fireOn = (doc, type, fn) => {
  const el = doc.createElement("button");
  doc.getElementById("phone").appendChild(el);
  return { el, fire: (ev) => el.dispatchEvent(ev || new doc.defaultView.Event(type)) };
};

test("E.6 (blind F3, M02): the gesture counter CLOSES AGAIN when the dispatch returns, on the SAME instance", async () => {
  const { doc, api } = await laneInstance();
  const { el, fire } = fireOn(doc, "keydown");
  let inside = null;
  /* recordSleep(new Map()) is the admitted call, as the E.6 row above uses it: with no
     sleep lane injected it returns without touching the DOM, so this row measures the
     COUNTER and not the writer. */
  api.hooks.listen(el, "keydown", () => {
    try { api.hooks.recordSleep(new Map()); inside = "admitted"; }
    catch (e) { inside = "refused"; }
  });
  fire(new doc.defaultView.Event("keydown"));
  assert.equal(inside, "admitted", "E.6: a writer inside a real dispatch was refused, which is the athlete's save failing");
  /* THE ROW: the same instance, after the dispatch has returned. `gestures -= 0` leaves the
     counter open here for the rest of the page's life and every later ungestured call saves. */
  assert.throws(() => api.hooks.recordIntake(null, null, null, null),
    /WRITER-OUTSIDE-GESTURE: recordIntake/,
    "E.6: THE GESTURE COUNTER STAYED OPEN AFTER THE DISPATCH RETURNED. Every later call " +
    "from anywhere - a timer, a promise, a render - now counts as a gesture.");
});

test("E.6 (blind F3, M02): the counter closes again when the callback THROWS and when it REJECTS", async () => {
  const { doc, api } = await laneInstance();
  const { el, fire } = fireOn(doc, "click");
  api.hooks.listen(el, "click", () => { throw new Error("SYNTHETIC-CALLBACK-FAILURE"); });
  const onErr = () => {};
  process.on("uncaughtException", onErr);
  try { fire(new doc.defaultView.Event("click")); } catch (e) { /* jsdom may rethrow */ }
  process.off("uncaughtException", onErr);
  assert.throws(() => api.hooks.recordSleep(new Map()), /WRITER-OUTSIDE-GESTURE: recordSleep/,
    "E.6: a callback that THREW left the gesture counter open");
  const el2 = doc.createElement("button");
  doc.getElementById("phone").appendChild(el2);
  api.hooks.listen(el2, "click", () => Promise.reject(new Error("SYNTHETIC-REJECTION")).catch(() => {}));
  el2.dispatchEvent(new doc.defaultView.Event("click"));
  assert.throws(() => api.hooks.recordSleep(new Map()), /WRITER-OUTSIDE-GESTURE: recordSleep/,
    "E.6: a callback that returned a rejected promise left the gesture counter open");
});

test("E.6 (blind F3, M05): the ORIGINAL event object reaches the view's callback", async () => {
  const { doc, api } = await laneInstance();
  const { el } = fireOn(doc, "keydown");
  let seen = "nothing";
  api.hooks.listen(el, "keydown", (ev) => { seen = ev; });
  const sent = new doc.defaultView.KeyboardEvent("keydown", { key: "Enter" });
  el.dispatchEvent(sent);
  assert.strictEqual(seen, sent, "THE LISTEN SHIM DROPPED THE EVENT. `return fn()` instead " +
    "of `return fn(ev)` leaves every keyboard handler reading `key` off undefined.");
  assert.equal(seen.key, "Enter", "the event reached the callback without its key");
});

test("the seal (blind F3, M14/M15): each screen constructor runs ONCE and the cached object comes back", async () => {
  const { api } = await laneInstance();
  for (const [hook, name] of [["mintMeasureScreen", "createMeasureScreen"],
    ["mintImportScreen", "createImportScreen"], ]) {
    let built = 0;
    const made = { PLANT: name };
    const Screen = { createMeasureScreen: () => { built += 1; return made; },
      createImportScreen: () => { built += 1; return made; } };
    api.hooks[hook](Screen);
    api.hooks[hook](Screen);
    assert.equal(built, 1, "THE SEAL RE-MINTED " + name + ". `if (true)` in place of the " +
      "cache guard builds a new screen on every paint and the old one's state is dropped.");
  }
  assert.strictEqual(api.facade.measureScreen().PLANT, "createMeasureScreen",
    "the cached measure screen is not the object the constructor returned");
  assert.strictEqual(api.facade.importScreen().PLANT, "createImportScreen",
    "the cached import screen is not the object the constructor returned");
});

test("the seal (blind F3, M16/M17): each retry PUBLISHES a non-null Promise before it settles", async () => {
  for (const [hook, handle] of [["retryFoodRead", "foodSaving"], ["retrySleepRead", "sleepSaving"]]) {
    const { api } = await laneInstance();
    const before = api.facade[handle]();
    api.hooks[hook]();
    const after = api.facade[handle]();
    assert.notStrictEqual(after, before, "THE SEAL DID NOT PUBLISH " + hook + "'S PROMISE. " +
      "Dropping the assignment leaves the released half unable to tell that a read is in " +
      "flight, and the early-return path is exactly where it matters.");
    assert.ok(after && typeof after.then === "function",
      hook + " published " + String(after) + " where a Promise is owed, even on the no-work path");
    await after.catch(() => {});
  }
});

test("the seal (blind F3, M09): sleepCorrect sets the flag the repaint observes, both ways", async () => {
  const seen = [];
  const noop = () => {};
  const { api } = await laneInstance({ painter: Object.freeze({
    repaint: (name) => { seen.push([name, null]); }, screenNow: () => "today",
    token: () => 0, clearDraft: noop, paintTodayEntry: noop }) });
  api.hooks.sleepCorrect(true);
  assert.equal(api.facade.sleepCorrecting(), true,
    "THE CORRECTION FLAG IS INVERTED. `sleepCorrecting = !on` paints the cancel state when " +
    "the athlete asked to correct, and the correction state when he cancelled.");
  api.hooks.sleepCorrect(false);
  assert.equal(api.facade.sleepCorrecting(), false, "the cancel path left the correction flag set");
});

test("the seal (blind F3, M10): forgetCheckInRead clears the day AND the in-flight read", async () => {
  /* readSleepCheckIn only starts a read when a check-in host with forDate is injected,
     so this row injects the smallest one that answers: a never-settling promise, which is
     what an in-flight read IS. */
  let release = null;
  const held = new Promise((r) => { release = r; });
  const { api } = await laneInstance({ options: { checkin: { host: {
    forDate: () => held } } } });
  api.hooks.readSleepCheckIn("2026-09-02", true);
  const pendingBefore = api.facade.sleepCheckInPending();
  assert.ok(pendingBefore && typeof pendingBefore.then === "function",
    "the harness did not start a check-in read, so this row proves nothing");
  api.hooks.forgetCheckInRead();
  assert.equal(api.facade.sleepCheckInDay(), null, "forgetCheckInRead left the check-in day set");
  assert.equal(api.facade.sleepCheckInPending(), null,
    "FORGETCHECKINREAD LEFT THE IN-FLIGHT READ. A read started before the athlete left can " +
    "still settle and repaint a screen he is no longer on.");
  release([]);
  await pendingBefore.catch(() => {});
});

/* ---- BLIND F1: what the guard does NOT cover, pinned rather than argued ----------------
 * The reviewer injected a frozen painter whose repaint calls hooks.recordIntake, put it
 * behind hooks.listen(button, "click", () => painter.repaint()), and a durable food
 * operation was written with no save action in the click callback: the guard admits
 * everything nested under a shimmed listener, including a paint.
 *
 * MEASURED IN THIS ROUND: a seal-side paint-depth counter does NOT close it, because the
 * paint root in the counterexample is one the VIEW holds and invokes itself, which never
 * passes through the seal. Closing it means the released half declaring its paint entries
 * through the seal, which is released-side wiring this round may not invent; it is ticket
 * TODAY-GESTURE-PAINT-ROOTS and the build report carries it as an open STOP.
 *
 * What CAN be pinned today is the shipped page, and this pins it: in the released view the
 * two guarded writers are called at exactly two sites, each one the direct body of a
 * hooks.listen callback, and no render function contains either call. While that holds, the
 * boundary the reviewer crossed is not reachable in this page; the day it stops holding,
 * this row goes red and whoever moved it has to say so.                                   */
test("E.6 (blind F1): the two guarded writers are called at EXACTLY two released sites, both directly inside a hooks.listen callback", () => {
  const raw = readRepo(TODAY + "/today-app.cjs");
  const code = codeOf(raw);
  const lines = raw.split("\n");
  const sites = [];
  lines.forEach((l, i) => {
    if (/hooks\.record(Intake|Sleep)\s*\(/.test(l)) sites.push({ line: i + 1, text: l });
  });
  assert.equal(sites.length, 2, "THE NUMBER OF CALL SITES OF THE TWO GUARDED WRITERS CHANGED. " +
    "Found " + sites.length + ": " + sites.map((s) => ":" + s.line).join(" ") + ". Every one of " +
    "them must be the direct body of a hooks.listen callback, or E.6's boundary is no longer " +
    "the boundary the build measured (blind review F1).");
  for (const s of sites) {
    assert.match(s.text, /hooks\.listen\([^,]+,\s*"click",\s*\(\)\s*=>\s*\{\s*hooks\.record(Intake|Sleep)\(/,
      "E.6: the guarded writer at :" + s.line + " is no longer the direct body of a " +
      "hooks.listen click callback: " + s.text.trim());
  }
  /* And no render function body reaches either of them. The two sites above are inside
     renderNutrition and renderSleep, so the test is that the CALL is not made during a
     paint: every occurrence is inside a listener registration, which the regexp above
     already asserts, and there is no bare call anywhere in the file. */
  assert.equal((code.match(/hooks\.record(Intake|Sleep)\(/g) || []).length, 2,
    "a guarded writer is called somewhere the raw-line scan above did not see");
});

test("RED E.6 (blind F1): a guarded writer moved OUT of its listener body, into a paint, FAILS", () => {
  /* The plant is the shape the reviewer's counterexample needs in the shipped page: the
     food writer called from inside a render instead of from the click callback's body. */
  const src = planted(TODAY + "/today-app.cjs", (s) => s.replace(
    '    hooks.listen(save, "click", () => { hooks.recordIntake(save, cal, pro, error); });',
    '    hooks.listen(save, "click", () => { armSave(); });\n' +
    '    hooks.recordIntake(save, cal, pro, error);'));
  const lines = src.split("\n");
  const sites = [];
  lines.forEach((l, i) => { if (/hooks\.record(Intake|Sleep)\s*\(/.test(l)) sites.push(l); });
  assert.equal(sites.length, 2, "the plant did not land, so this row proves nothing");
  const bare = sites.filter((t) => !/hooks\.listen\([^,]+,\s*"click",\s*\(\)\s*=>\s*\{\s*hooks\.record(Intake|Sleep)\(/.test(t));
  assert.equal(bare.length, 1,
    "THE FENCE DID NOT SEE A GUARDED WRITER CALLED OUTSIDE ITS LISTENER BODY");
});

/* ---- GSS RED CHECKPOINT: desired writer-seal shape ------------------------------- */
const GSS_HELPER_SHA256 = "824e9dba46a288110190b4bac497e53484a955f86ce2fa158655d86f13dd33ff";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const gssHelperSpan = (source) => {
  const lines = source.split("\n");
  const from = lines.findIndex((line) => line.startsWith("/* The draft as the producer's `machine`"));
  const acceptable = lines.findIndex((line, index) => index > from && line === "export function acceptable(machine) {");
  let to = acceptable;
  while (to >= 0 && to < lines.length && lines[to] !== "}") to += 1;
  if (from < 0 || acceptable < 0 || to >= lines.length) return null;
  return lines.slice(from, to + 2).join("\n");
};

test("GSS-CUSTODY RED: the exact 23-line helper/comment span moved into the seal", () => {
  const lane = readRepo(TODAY + "/gym-settings-lane.mjs");
  const view = readRepo(TODAY + "/machine-settings-view.mjs");
  const span = gssHelperSpan(lane);
  assert(span, "the moved helper span is absent from the sealed lane");
  assert.equal(sha256(span), GSS_HELPER_SHA256, "the pure move changed a byte");
  assert.equal(gssHelperSpan(view), null, "writer helpers still live in the view");
  assert.match(view, /import\s*\{[^}]*machineFromDraft[^}]*acceptable[^}]*\}\s*from\s*['"]\.\/gym-settings-lane\.mjs['"]/s);
  assert.match(view, /export\s*\{[^}]*machineFromDraft[^}]*acceptable[^}]*\}/s);
});

test("GSS-NO-HOST-LEAK RED: four frozen interface objects and one api.lane mapping", () => {
  const raw = readRepo(TODAY + "/gym-settings-lane.mjs");
  const lane = codeOf(raw);
  assert.match(lane, /const api = Object\.freeze\(\{/);
  assert.equal((lane.match(/Object\.freeze\(/g) || []).length >= 4, true,
    "outer, facade, hooks and api must all be frozen");
  assert.equal((lane.match(/lane:\s*\(\)\s*=>\s*settingsLane/g) || []).length, 1,
    "api.lane is the one exact public host mapping");
  const facade = lane.slice(lane.indexOf("const facade = Object.freeze({"),
    lane.indexOf("const hooks = Object.freeze({"));
  assert.doesNotMatch(facade, /lane:\s*\(\)/,
    "facade must not expose the host");
  assert.match(raw, /import\s+MachineSettings\s+from\s+['"]\.\.\/\.\.\/\.\.\/coach\/machine-settings-commands\.cjs['"]/);
  const dynamic = [...raw.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map((row) => row[1]);
  assert.deepEqual(dynamic, ["./machine-settings-host.mjs"]);
});

const gssApiShape = (source) => {
  const tokens = codeTokens(source);
  const bareApi = tokens.filter((token, index) => token.kind === "id" && token.value === "api"
    && ![".", "?."].includes(tokens[index - 1]?.value));
  const exact = (window) => tokens.filter((token, index) => token.value === "api"
    && windowAt(tokens, index, "api", window)).length;
  return {
    bareApi: bareApi.length,
    exactPending: exact("pending : ( ) => api . pending ( )"),
    exactReady: exact("ready : ( ) => api . ready ( )"),
    exactLane: exact("lane : ( ) => api . lane ( )"),
    exactRead: exact("read : ( ) => api . read ( )"),
    exactStateFor: exact("stateFor : ( liftId ) => api . stateFor ( liftId )"),
  };
};

test("GSS-API-PARITY: api is acquired once and all five methods map exactly", () => {
  const source = readRepo(TODAY + "/gym-app.mjs");
  const expected = { bareApi: 6, exactPending: 1, exactReady: 1, exactLane: 1,
    exactRead: 1, exactStateFor: 1 };
  assert.deepEqual(gssApiShape(source), expected);
  for (const [name, edit] of [
    ["unrelated", (s) => s.replace("  first.settings = Object.freeze({",
      "  void 0;\n  first.settings = Object.freeze({")],
    ["reformat", (s) => s.replace("    lane: () => api.lane(),", "    lane : ( ) => api . lane ( ),")],
  ]) {
    const control = edit(source);
    assert.notEqual(control, source, name + " control missed");
    assert.deepEqual(gssApiShape(control), expected, name);
  }
  for (const [name, edit] of [
    ["alias", (s) => s.replace("  first.settings = Object.freeze({",
      "  const leakedApi = api;\n  first.settings = Object.freeze({")],
    ["computed", (s) => s.replace("    lane: () => api.lane(),", "    lane: () => api['lane'](),")],
    ["Reflect", (s) => s.replace("  first.settings = Object.freeze({",
      "  const leakedLane = Reflect.get(api, 'lane');\n  first.settings = Object.freeze({")],
    ["ready host", (s) => s.replace("  first.settings = Object.freeze({",
      "  const leakedReady = api.ready();\n  first.settings = Object.freeze({")],
  ]) {
    const mutant = edit(source);
    assert.notEqual(mutant, source, name + " plant missed");
    assert.notDeepEqual(gssApiShape(mutant), expected, name);
  }
});

for (const [name, from, to] of [
  ["pending returns api", "    pending: () => api.pending(),", "    pending: () => api,"],
  ["ready maps lane", "    ready: () => api.ready(),", "    ready: () => api.lane(),"],
]) test("GSS-API-MAPPING RED: " + name, () => {
  const source = readRepo(TODAY + "/gym-app.mjs");
  const mutant = source.replace(from, to);
  assert.notEqual(mutant, source, name + " plant missed");
  assert.notDeepEqual(gssApiShape(mutant), gssApiShape(source), name);
});

test("GSS-GESTURE-CONTROL RED: released gym sources have zero direct dispatch spelling", () => {
  for (const rel of ["gym-app.mjs", "machine-settings-view.mjs", "gym-settings-lane.mjs",
    "today-app.cjs", "today-lanes.cjs"]) {
    const source = codeOf(readRepo(TODAY + "/" + rel));
    const listenerCount = { "gym-app.mjs": 0, "machine-settings-view.mjs": 5,
      "gym-settings-lane.mjs": 4, "today-app.cjs": 0, "today-lanes.cjs": 2 }[rel];
    assert.equal((source.match(/\.\s*(?:add|remove)EventListener\s*\(/g) || []).length,
      listenerCount, rel);
    assert.equal((source.match(/\.\s*click\s*\(/g) || []).length, 0, rel + " .click");
    assert.equal((source.match(/\bdispatchEvent\s*\(/g) || []).length, 0, rel + " dispatchEvent");
  }
});

test("GSS-STATIC-AFTER-READ / AFTER-START plants are independently visible", () => {
  const raw = readRepo(TODAY + "/gym-app.mjs");
  const afterRead = raw.replace("    const view = await hooks.readView();",
    "    const view = await hooks.readView();\n    phone.querySelector('[data-slot=log]').click();");
  const afterStart = raw.replace("      const started = await model.start();",
    "      const started = await model.start();\n      phone.querySelector('[data-slot=log]').click();");
  assert.notEqual(afterRead, raw, "after-read plant missed its exact anchor");
  assert.notEqual(afterStart, raw, "after-start plant missed its exact anchor");
  assert.equal((codeOf(afterRead).match(/\.\s*click\s*\(/g) || []).length, 1);
  assert.equal((codeOf(afterStart).match(/\.\s*click\s*\(/g) || []).length, 1);
});

test("GSS paint RED: exactly six synchronous drawing returns use hooks.paint", () => {
  const source = codeOf(readRepo(TODAY + "/gym-app.mjs"));
  const calls = [
    "hooks.paint(() => refusalScreen(view, view))",
    "hooks.paint(() => stub(view, WORKOUT_RECORDED,",
    "hooks.paint(() => refusalScreen(view, started))",
    "hooks.paint(() => renderSaved(view))",
    "hooks.paint(() => renderComplete(view))",
    "hooks.paint(() => renderActive(view))",
  ];
  for (const call of calls) assert.equal(source.split(call).length - 1, 1,
    "missing or repeated synchronous paint root " + call);
  assert.equal((source.match(/hooks\.paint\s*\(/g) || []).length, 6,
    "the released card has a seventh synchronous paint root");
  assert.match(source, /const started = await model\.start\(\);/, "Start exception moved");
  assert.match(source, /return paint\(\);/, "Start recursive return moved");
});
