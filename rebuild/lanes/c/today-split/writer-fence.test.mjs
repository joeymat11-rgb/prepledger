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
 * gym-app still holds six declared writer seams and three facade.lane acquisitions.
 *
 * WHAT IT REFUSES TO READ, AND THEREFORE FORBIDS except at measured literal sites:
 * quoted/template/concatenated bracket keys, capability-holder destructuring, calls in
 * template interpolation, and declarations/parameters shadowing suppressed builtins.
 * Newline-split members ARE read. PUT names never receive builtin suppression.
 *
 * WHAT IT CANNOT SEE: arbitrary alias/data flow, variable computed keys, reflective
 * calls, generated code, runtime replacement of a reader, and all JavaScript grammar.
 * It neither proves durable behavior nor deep immutability of returned data. The
 * boundary holding a released file is INDEPENDENT REVIEW OF EVERY HUNK of every look
 * ticket, followed by the PM's own final review (DECISIONS:439 and :531 (3)).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

/* ---- codeOf: comments and string literals removed -------------------------------------
 * A comment mentioning host.save is invisible and a sentence containing the word "save" is
 * invisible; a call, an alias and a bare member read are not. Literals are replaced by a
 * marker of the same shape so line numbers survive.                                      */
function codeOf(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "*") {
      const end = src.indexOf("*/", i + 2);
      const chunk = src.slice(i, end < 0 ? n : end + 2);
      out += chunk.replace(/[^\n]/g, " ");
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (c === "/" && d === "/") {
      let end = src.indexOf("\n", i);
      if (end < 0) end = n;
      out += " ".repeat(end - i);
      i = end;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === quote) break;
        j += 1;
      }
      const chunk = src.slice(i, Math.min(j + 1, n));
      out += chunk.replace(/[^\n]/g, " ");
      i = Math.min(j + 1, n);
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

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

/* Comments removed, string literals KEPT: the copy rows need the literals, and a sentence
   quoted inside a comment is not copy the page can show. (R2's lesson, twice: a fence that
   reds on prose in a comment loses its credibility the first time it runs.) */
function withoutComments(src) {
  let out = "", i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "*") {
      const end = src.indexOf("*/", i + 2);
      const chunk = src.slice(i, end < 0 ? n : end + 2);
      out += chunk.replace(/[^\n]/g, " ");
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (c === "/" && d === "/") {
      let end = src.indexOf("\n", i);
      if (end < 0) end = n;
      out += " ".repeat(end - i);
      i = end;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let j = i + 1;
      while (j < n) { if (src[j] === "\\") { j += 2; continue; } if (src[j] === q) break; j += 1; }
      out += src.slice(i, Math.min(j + 1, n));
      i = Math.min(j + 1, n);
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
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
const SEALED = [TODAY + "/today-readings.cjs", TODAY + "/gym-settings-lane.mjs"];
const RELEASED = [TODAY + "/today-model.cjs", TODAY + "/gym-app.mjs"];
const PART_TWO = TODAY + "/today-lanes.cjs";

/* S-R22: today-readings.cjs's four refusal constants, DECLARED BY NAME, with the exact
   prose they carry. A FIFTH literal fails (E.5 row 15). */
const READINGS_CONSTANTS = ["ALREADY_RECORDED", "OUT_OF_RANGE", "FORM_MIN", "FORM_MAX"];
const READINGS_PROSE = [
  "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.",
  "A morning weight is recorded between ",
  " lb, to one decimal place. Nothing was recorded.",
];

/* gym-app.mjs's six DECLARED seams: the durable writers the released card still names, each
   with the region id regions.json gives it. A seventh fails.
 *
 * KEYED BY SITE, NOT BY NAME (R1 BLOCKING-2, second half). The first form of this row
 * compared the SET OF NAMES, so a seventh durable write that happened to reuse one of the six
 * declared names was invisible: R1's planted `entry.save(...)` adds an occurrence of `save`,
 * and `save` was already in the set. The key is now `receiver.name`, and the row asserts the
 * SITE COUNT as well, so neither a new receiver nor a second call through an old one gets in.
 * `(call).save` is `facade.lane().save(machine)`, whose receiver is a call expression and not
 * an identifier. */
const GYM_DECLARED_SEAMS = {
  "(call).save": "GA-M01 / GA-R04, SEAM G1 recordSettings: `facade.lane().save(machine)`. The released half still decides what is stored, and the build report names it as the S-R17 (g) STOP it is. B.9's token protocol is part 2.",
  "model.logSet": "GA-M02, a released control handler",
  "model.finish": "GA-M03, a released control handler",
  "model.forget": "GA-M04, a released control handler",
  "model.undo": "GA-M05, a released control handler",
  "model.start": "GA-M06, model.start() inside paint(): the ONE durable PUT any paint root reaches in these three files. A pre-existing fact of the page, left byte-identical under S-R12, with its own ticket GYM-START-IN-PAINT.",
};
const GYM_DECLARED_SITES = 6;
const siteOf = (h) => (h.receiver || "(call)") + "." + h.name;

function planted(rel, edit) {
  const src = readRepo(rel);
  const out = edit(src);
  assert.notEqual(out, src, "the in-memory plant did not land: " + rel);
  return out;
}

/* S-R27/S-R28. Small lexical inventory, NOT a JavaScript parser. Tokens retain
 * offsets so exceptions compare whole source lines, including multiplicity.
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
    if (c === '}' && stopAtBrace && braces === 0) return { tokens, end: i + 1 };
    if (c === '"' || c === "'" || c === '`') {
      const expressions = [];
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === c) { i++; break; }
        if (c === '`' && src[i] === '$' && src[i + 1] === '{') {
          const expression = tokensOf(src, i + 2, true);
          expressions.push(expression.tokens); i = expression.end; continue;
        }
        i++;
      }
      tokens.push({ value: src.slice(at, i), at, end: i,
        kind: c === '`' ? 'template' : 'string', expressions });
      continue;
    }
    const id = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
    const value = id ? id[0] : ['?.', '=>', '...'].find((p) => src.startsWith(p, i)) || c;
    i += value.length;
    if (value === '{') braces++;
    if (value === '}') braces--;
    tokens.push({ value, at, end: i, kind: id ? 'id' : 'punct' });
  }
  return { tokens, end: i };
}
const lineAt = (src, at) => src.slice(0, at).split('\n').length;
const lineText = (src, at) => src.split('\n')[lineAt(src, at) - 1].replace(/\r$/, '');
const sourceLines = (src, from, to) => src.split('\n').slice(lineAt(src, from) - 1, lineAt(src, to))
  .map((line) => line.replace(/\r$/, '')).join('\n');
function codeTokens(src) {
  const flatten = (ts) => ts.flatMap((t) => t.kind === 'template'
    ? [t, ...t.expressions.flatMap(flatten)] : [t]);
  return flatten(tokensOf(src).tokens);
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
function measuredSyntax(src) {
  const ts = codeTokens(src), decls = declarations(ts);
  const bracket = [], destructure = [], templateCall = [], shadow = new Set();
  const bindings = (from, to) => {
    for (let j = from; j < to; j++) {
      if (ts[j].value === '=') { j = expressionEnd(ts, j + 1) - 1; continue; }
      if (NOT_A_STORE_RECEIVER.includes(ts[j].value) && ts[j + 1]?.value !== ':') shadow.add(ts[j].at);
    }
  };
  for (const d of decls) {
    bindings(d.from, d.end + 1);
    if (d.destructured && ts.slice(d.rhs, d.to).some(holder)) {
      destructure.push(sourceLines(src, ts[d.from].at, ts[d.to - 1].end - 1));
    }
  }
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i], prev = ts[i - 1], next = ts[i + 1];
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
      const functionParams = prev?.value === 'function' || ts[i - 2]?.value === 'function' ||
        ts[i - 3]?.value === 'function';
      const methodParams = after === '{' && prev?.kind === 'id' &&
        !['if', 'for', 'while', 'switch', 'with'].includes(prev.value);
      if (methodParams && NOT_A_STORE_RECEIVER.includes(prev.value)) shadow.add(prev.at);
      if (after === '=>' || functionParams || methodParams) bindings(i + 1, end);
    }
    if (next?.value === '=>' && NOT_A_STORE_RECEIVER.includes(t.value)) shadow.add(t.at);
  }
  const lines = (positions) => [...positions].sort((a, b) => a - b).map((at) => lineText(src, at));
  return { bracket: lines(bracket), destructure,
    templateCall: lines(templateCall), shadow: lines(shadow) };
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

/* Literal measurements at 40c355f9. Part 2 adds today-app.cjs HERE, measures its
 * preconditions and declares its sites; no automatic snapshot update is allowed. */
const RELEASED_FILES = [
  {
    rel: TODAY + '/today-model.cjs', anchor: '  function adoptBasis(state) {',
    capabilities: {
      weighIn: [
        '  const { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX } =',
        '    read, weighIn, reopen, adoptBasis, setPendingAdoption,',
      ],
      reopen: [
        '  const { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX } =',
        '    read, weighIn, reopen, adoptBasis, setPendingAdoption,',
      ],
    },
    lane: [],
    edges: ['require:./today-engine.cjs', 'require:../fixtures.cjs', 'require:./food-model.cjs',
      'require:./sleep-model.cjs', 'require:./today-readings.cjs'],
    syntax: { bracket: [], templateCall: [], shadow: [], destructure: [
      '  const { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX } =\n' +
      '    createReadingsWriter({ day, readings, adoptedRead, stateFromOps,\n' +
      '      read: () => read(), NO_STORE, setMessage: (m) => { lastMessage = m; } });',
    ] },
  },
  {
    rel: TODAY + '/gym-app.mjs', anchor: '    const entry = facade.entryFor(liftId);',
    capabilities: {},
    lane: [
      '    if (!facade.lane()) { block.hidden = true; editor.hidden = true; hooks.open(); return; }',
      '    try { result = await facade.lane().save(machine); }',
      '    lane: () => facade.lane(),',
    ],
    edges: ['import:./today-app.cjs', 'import:./plain-copy.cjs',
      'import:./machine-settings-view.mjs', 'import:./gym-settings-lane.mjs'],
    syntax: { bracket: [], templateCall: [], shadow: [], destructure: [
      '  const { facade, hooks } = createGymSettingsLane(doc, model, settings, painter);',
    ] },
  },
];
function capabilitySites(src, name) {
  return codeTokens(src).filter((t) => t.kind === 'id' && t.value === name).map((t) => lineText(src, t.at));
}
function laneSites(src) {
  const ts = codeTokens(src);
  return ts.filter((t, i) => t.value === 'facade' && ['.', '?.'].includes(ts[i + 1]?.value) &&
    ts[i + 2]?.value === 'lane').map((t) => lineText(src, t.at));
}
const SYNTAX_REFUSALS = { bracket: 'FENCE-BRACKET-KEY', destructure: 'FENCE-CAPABILITY-DESTRUCTURE',
  templateCall: 'FENCE-TEMPLATE-CALL', shadow: 'FENCE-BUILTIN-SHADOW' };
function releasedRefusals(file, src) {
  const refusals = [];
  const differs = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
  for (const [name, sites] of Object.entries(file.capabilities)) {
    if (differs(capabilitySites(src, name), sites)) refusals.push('FENCE-CAPABILITY-SITE:' + name);
  }
  if (differs(laneSites(src), file.lane)) refusals.push('FENCE-LANE-ACQUISITION');
  if (differs(moduleEdges(src), file.edges)) refusals.push('FENCE-RELEASED-MODULE-EDGE');
  const syntax = measuredSyntax(src);
  for (const kind of Object.keys(SYNTAX_REFUSALS)) {
    if (differs(syntax[kind], file.syntax[kind])) refusals.push(SYNTAX_REFUSALS[kind]);
  }
  const hits = memberHits(codeOf(src), PUT);
  if (file.rel.endsWith('/gym-app.mjs')) {
    if (hits.length !== GYM_DECLARED_SITES || differs([...new Set(hits.map(siteOf))].sort(),
      Object.keys(GYM_DECLARED_SEAMS).sort())) refusals.push('FENCE-WRITER-NAME');
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
  assert.equal(scanned.length, 4, "part 1 seals two modules and releases two; part 2 adds " + PART_TWO);
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

test("the gym lane source declares three Object.freeze wrappers (no deep-freeze claim)", () => {
  const code = codeOf(readRepo(TODAY + "/gym-settings-lane.mjs"));
  assert.match(code, /return Object\.freeze\(\{/, "the returned interface is not frozen");
  assert.match(code, /facade:\s*Object\.freeze\(\{/, "the facade table is not frozen");
  assert.match(code, /hooks:\s*Object\.freeze\(\{/, "the callback table is not frozen");
  assert.equal((code.match(/Object\.freeze\(/g) || []).length, 3,
    "three frozen objects and no more: a fourth is an interface nobody declared");
});

test("the paint handle the released card hands in is FROZEN", () => {
  const code = codeOf(readRepo(TODAY + "/gym-app.mjs"));
  assert.match(code, /const painter = Object\.freeze\(\{ repaint: \(\) => paint\(\) \}\);/,
    "the paint handle is not a frozen one-entry object");
});

test("RED: an unfrozen interface object FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("    hooks: Object.freeze({", "    hooks: ({"));
  const code = codeOf(src);
  assert.equal(/hooks:\s*Object\.freeze\(\{/.test(code), false,
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

test("RED: the pre-split gym-app.mjs:279 assignment of settingsSaving FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("      hooks.saving(recordSettings(map, view, paintedDraft));",
      "      settingsSaving = recordSettings(map, view, paintedDraft);"));
  const names = factoryScopeNames(TODAY + "/gym-settings-lane.mjs");
  assert.equal(names.includes("settingsSaving"), true, "settingsSaving is not sealed");
  const code = codeOf(src);
  const re = new RegExp("(^|[^.\\w$])settingsSaving\\s*(=[^=])", "m");
  assert.equal(re.test(code), true,
    "THE FENCE DID NOT SEE THE EXACT ROW THE SPIKE FOUND AND B.9 NEVER HAD");
});

/* ---- ROW 5: the sealed modules' module edges ------------------------------------------ */

test("FENCE-VIEW-IMPORT: today-readings.cjs reaches NOTHING, and the gym lane's only edge is its declared host", () => {
  const readings = codeOf(readRepo(TODAY + "/today-readings.cjs"));
  assert.deepEqual([...readings.matchAll(/\b(?:require|import)\s*\(/g)].map((m) => m[0]), [],
    "the sealed weigh-in writer takes every binding it needs by injection and imports nothing");

  const lane = codeOf(readRepo(TODAY + "/gym-settings-lane.mjs"));
  const edges = [...readRepo(TODAY + "/gym-settings-lane.mjs")
    .matchAll(/\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.deepEqual(edges, ["./machine-settings-host.mjs"],
    "FENCE-SECOND-SEALED-IMPORT: the gym lane opens the fifth lane and reaches nothing else");
  assert.equal(/^\s*import\s/m.test(lane), false, "and it has no static import at all");
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
for (const file of RELEASED_FILES) {
  const name = path.basename(file.rel);
  test('FENCE-PRECONDITIONS: measured released sites in ' + name, () => {
    const src = readRepo(file.rel);
    assert.deepEqual(releasedRefusals(file, src), [], name);
    const syntax = measuredSyntax(src);
    console.log('  S-R28 ' + name + ': ' + Object.entries(syntax).map(([k, v]) => k + '=' + v.length).join(', '));
    console.log('  S-R27 ' + name + ': edges=' + moduleEdges(src).length + ', facade.lane=' + laneSites(src).length);
  });
  test('CONTROL: comments and strings do not acquire capabilities in ' + name, () => {
    const src = plantLine(file, '/* weighIn(); facade.lane(); import("bad"); Object.save(); */\n' +
      'void "reopen facade.lane() settings[\'save\']()";');
    assert.deepEqual(releasedRefusals(file, src), []);
  });
  test('CONTROL: Promise.all remains STORE, not PUT, in ' + name, () => {
    const src = plantLine(file, 'void Promise.all([]);');
    assert.deepEqual(releasedRefusals(file, src), []);
    assert.equal(memberHits(codeOf(src), STORE).some((h) => h.receiver === 'Promise' && h.name === 'all'), true);
    assert.equal(memberHits(codeOf(readRepo(file.rel)), PUT)
      .filter((h) => NOT_A_STORE_RECEIVER.includes(h.receiver)).length, 0, 'measured cost of dropping PUT suppression');
  });
  const syntaxPlants = [
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
    const src = plantLine(file, file.syntax.destructure[0]);
    assert.ok(releasedRefusals(file, src).includes('FENCE-CAPABILITY-DESTRUCTURE'));
  });
  for (const site of file.lane) {
    test('RED S-R27 ' + name + ': repeated acquisition ' + site.trim(), () => {
      assert.ok(releasedRefusals(file, plantLine(file, site)).includes('FENCE-LANE-ACQUISITION'));
    });
  }
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

test('S-R29 recorded laxity: entryFor returns a mutable cache entry visible through stateFor', async () => {
  /* This is a recorded laxity, NOT a desired contract. The later ticket sealing
   * recordSettings must rewrite this row on purpose for detached, deeply frozen copies. */
  const { createGymSettingsLane } = await import('../../../m3/w7-preview/today/gym-settings-lane.mjs');
  const latest = Object.freeze({ machine: { settings: [{ name: 'Seat', value: 'four' }] } });
  const pair = createGymSettingsLane({}, {}, { latest: async () => latest }, { repaint: () => {} });
  for (const object of [pair, pair.facade, pair.hooks]) assert.equal(Object.isFrozen(object), true);
  await pair.hooks.startRead('synthetic-lift');
  const entry = pair.facade.entryFor('synthetic-lift');
  assert.equal(Object.isFrozen(entry), false);
  assert.equal(pair.facade.stateFor('synthetic-lift'), 'known');
  entry.state = 'failed';
  assert.equal(pair.facade.stateFor('synthetic-lift'), 'failed');
  assert.equal(pair.facade.entryFor('synthetic-lift'), entry);
  assert.equal(Object.isFrozen(entry.latest), true);
  assert.equal(Object.isFrozen(entry.latest.machine.settings), false);
  entry.latest.machine.settings[0].value = 'injected';
  assert.equal(pair.facade.entryFor('synthetic-lift').latest.machine.settings[0].value, 'injected');
});

/* Deliberately GREEN residue, measured for the reviewer/PM. No durability claim:
 * these strings are scanned, not executed, and require review of the actual diff. */
const RESIDUE = [
  "const key = 'sa' + 've'; settings[key](auditMachine);",
  "Reflect.apply(Reflect.get(settings, 'save'), settings, [auditMachine]);",
  'const alias = settings; const { save: write } = alias; write(auditMachine);',
];
for (const file of RELEASED_FILES) {
  for (const [i, line] of RESIDUE.entries()) {
    test('RECORDED RESIDUE ' + path.basename(file.rel) + ': spelling ' + (i + 1) + ' still passes', () => {
      assert.deepEqual(releasedRefusals(file, plantLine(file, line)), []);
    });
  }
}
