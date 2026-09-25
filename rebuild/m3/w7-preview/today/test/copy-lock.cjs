'use strict';
/* THE COPY LOCK (S10, S10-WORKING-BRIEF section 8; S9-RELEASE-SPEC C.6 and R4 N3).

   What it is: a SEALED cell over UNSEALED and RELEASED copy. The words the athlete reads
   live in files that are free to change (design.cjs, screens.template.html, setup-model.mjs,
   ...) or are released by S10 (today-app.cjs, gym-app.mjs). This module holds no copy of its
   own: it reads the pinned corpus copy-lock.corpus.json (sealed beside it) and compares it
   with what the composed product's files actually carry, in BOTH directions, so a sentence
   deleted from a screen AND from the list that declares it is still refused by name.

   The unit (answer 1) is one PIECE: a complete static string the page source can put on a
   screen, taken exactly as written after JavaScript escapes are decoded:
     - a whole '...' or "..." literal, or one static chunk of a `...${}...` template;
     - in markup (.html, and any JS piece that itself carries markup), one text node
       (design.textOf's rule), one placeholder / aria-label / title / alt value, one shown
       <input value>, and the pieces of an inline <style> body (its quoted strings) or
       <script> body (as JavaScript);
     - in .css, one quoted string.
   A piece is LOCKED when it reads like words (proseLike below). Every locked piece is pinned
   with the exact number of times each scanned file carries it, and with the design.cjs lists
   that declare it. Pieces are compared whole, never as substrings, so " of " in a template is
   one piece and never a hit inside another sentence.

   It depends on node:fs, node:path, node:crypto and ../design.cjs (whose own dependencies
   are node built-ins and ./plain-copy.cjs), and it reads only the scan roots below. */

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const SCHEMA = 'earned/copy-lock/v1';
// The files whose bytes become the page's words (answer 2's observed side). Directory roots,
// walked on every run, so a NEW file under them is scanned without anyone listing it.
const SCAN_ROOTS = Object.freeze([
  'rebuild/m3/w7-preview/today',
  'rebuild/m3/w7-preview/import',
  'rebuild/m3/w7-preview/measure',
  'rebuild/slice/pwa',
]);
const SCAN_EXT = /\.(?:cjs|mjs|js|html|css)$/;
const SKIP_DIRS = new Set(['test', 'node_modules', 'dist', '.tmp']);
// The five design.cjs lists whose membership the lock pins (answer 6).
const LISTS = Object.freeze(['PREVIEW_COPY', 'APPROVED_COPY', 'RUNTIME_COPY', 'CHECKIN_RUNTIME_COPY',
  'PREVIEW_RUNTIME_COPY']);

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const posix = (p) => p.split(path.sep).join('/');

function scanFiles(root) {
  const out = [];
  const walk = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const child = rel + '/' + e.name;
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(child); continue; }
      if (e.isFile() && SCAN_EXT.test(e.name)) out.push(child);
    }
  };
  for (const r of SCAN_ROOTS) walk(r);
  return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/* ---------------- JavaScript: string literals and template chunks, cooked ---------------- */
const REGEX_AFTER_WORD = new Set(['return', 'typeof', 'case', 'do', 'else', 'void', 'in', 'of', 'new',
  'delete', 'throw', 'yield', 'await', 'instanceof']);
function cook(raw) {
  let s = '';
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c !== '\\') { s += c; continue; }
    const d = raw[++i];
    if (d === undefined) break;
    if (d === 'n') s += '\n'; else if (d === 't') s += '\t'; else if (d === 'r') s += '\r';
    else if (d === 'b') s += '\b'; else if (d === 'f') s += '\f'; else if (d === 'v') s += '\v';
    else if (d === '0' && !/[0-9]/.test(raw[i + 1] || '')) s += '\0';
    else if (d === 'x') { s += String.fromCharCode(parseInt(raw.slice(i + 1, i + 3), 16)); i += 2; }
    else if (d === 'u') {
      if (raw[i + 1] === '{') { const e = raw.indexOf('}', i); s += String.fromCodePoint(parseInt(raw.slice(i + 2, e), 16)); i = e; }
      else { s += String.fromCharCode(parseInt(raw.slice(i + 1, i + 5), 16)); i += 4; }
    } else if (d === '\r') { if (raw[i + 1] === '\n') i++; }
    else if (d === '\n' || d === '\u2028' || d === '\u2029') { /* line continuation */ }
    else s += d;
  }
  return s;
}
function jsStrings(src) {
  const out = [];
  const n = src.length;
  let i = 0, depth = 0, prev = '', prevWord = '';
  const templates = []; // brace depth at each open ${
  const readTemplate = () => { // at the char after ` or after the } closing a ${
    let raw = '';
    while (i < n) {
      const c = src[i];
      if (c === '\\') { raw += c + (src[i + 1] || ''); i += 2; continue; }
      if (c === '`') { out.push(cook(raw)); i++; prev = '`'; prevWord = ''; return; }
      if (c === '$' && src[i + 1] === '{') { out.push(cook(raw)); i += 2; depth++; templates.push(depth); prev = '{'; prevWord = ''; return; }
      raw += c; i++;
    }
    throw new Error('COPY-LOCK TOKENIZER unterminated template');
  };
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); i = e < 0 ? n : e; continue; }
    if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); if (e < 0) throw new Error('COPY-LOCK TOKENIZER unterminated comment'); i = e + 2; continue; }
    if (c === '\'' || c === '"') {
      let j = i + 1, raw = '';
      while (j < n && src[j] !== c) { if (src[j] === '\\') { raw += src[j] + src[j + 1]; j += 2; continue; } if (src[j] === '\n') throw new Error('COPY-LOCK TOKENIZER unterminated string at ' + i); raw += src[j]; j++; }
      out.push(cook(raw)); i = j + 1; prev = c; prevWord = ''; continue;
    }
    if (c === '`') { i++; readTemplate(); continue; }
    if (c === '/') {
      const regex = prev === '' || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev) || REGEX_AFTER_WORD.has(prevWord);
      if (regex) {
        let j = i + 1, cls = false;
        while (j < n) { const d = src[j]; if (d === '\\') { j += 2; continue; } if (d === '\n') throw new Error('COPY-LOCK TOKENIZER unterminated regex at ' + i); if (cls) { if (d === ']') cls = false; } else if (d === '[') cls = true; else if (d === '/') break; j++; }
        j++; while (j < n && /[a-z]/i.test(src[j])) j++;
        i = j; prev = ')'; prevWord = ''; continue;
      }
      i++; prev = '/'; prevWord = ''; continue;
    }
    if (c === '{') { depth++; i++; prev = '{'; prevWord = ''; continue; }
    if (c === '}') {
      if (templates.length && templates[templates.length - 1] === depth) { templates.pop(); depth--; i++; readTemplate(); continue; }
      depth--; i++; prev = '}'; prevWord = ''; continue;
    }
    if (/[A-Za-z0-9_$]/.test(c)) { let j = i; while (j < n && /[A-Za-z0-9_$]/.test(src[j])) j++; prevWord = src.slice(i, j); prev = 'a'; i = j; continue; }
    if (/\s/.test(c)) { i++; continue; }
    prev = c; prevWord = ''; i++;
  }
  if (templates.length) throw new Error('COPY-LOCK TOKENIZER unclosed template substitution');
  return out;
}

/* ---------------- markup and css ---------------- */
const MARK = String.fromCharCode(0);
const textNodes = (html) => html.replace(/<!--[\s\S]*?-->/g, MARK).replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, MARK)
  .replace(/<[^>]*>/g, MARK).split(MARK).map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
const ATTRS = /\s(?:placeholder|aria-label|title|alt)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const attrValues = (html) => [...html.matchAll(ATTRS)].map((m) => (m[2] !== undefined ? m[2] : m[3]).replace(/\s+/g, ' ').trim())
  .filter(Boolean);
const looksLikeMarkup = (s) => /<\/?[a-z][\w-]*(?:\s[^<>]*)?\/?>/i.test(s);
function cssStrings(css) {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...bare.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)].map((m) => (m[1] !== undefined ? m[1] : m[2]));
}

/* A piece is WORDS when it has a letter, no code punctuation, is not an identifier-shaped
   token, and is either spaced, capitalised as a word, or ends as a sentence does. The rule
   errs toward locking too much: an over-locked diagnostic costs a re-measure, an unlocked
   sentence costs the lock. A leading . # [ or @ marks a selector only when no whitespace
   follows it: ". Nothing was recorded." (a sentence tail after a concatenated value) is words
   (REVIEW-S10-COPYLOCK-l1 F1). */
function proseLike(s) {
  if (!/[A-Za-z]/.test(s)) return false;
  if (/[{}<>=\\`]|=>|\$\{|^\s*[.#[@](?!\s)|\bdata-[a-z]|^\.{0,2}\/|^[a-z]+:\/\//.test(s)) return false;
  if (/^[A-Za-z0-9_$.:-]+$/.test(s) && !/^[A-Z][a-z]+(?:[.?!:])?$/.test(s)) return false;
  return /\s/.test(s) || /^[A-Z][a-z]/.test(s) || /[.?!:]$/.test(s);
}

/* Inline <style> and <script> bodies are read, not dropped (REVIEW-S10-COPYLOCK-l1 F2): a
   content: rule in a <style> is text on the screen, and a <script> body's string literals
   are pieces as any scanned .js file's are. Only a closed element is read; an unclosed one
   (a template chunk cut at ${) stays out of textNodes too. */
const INLINE = /<(script|style)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
function inlineBodies(html) {
  const out = [];
  for (const m of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(INLINE)) {
    if (m[1].toLowerCase() === 'style') out.push(...cssStrings(m[2]));
    else out.push(...jsPieces(m[2]));
  }
  return out;
}
/* An <input value="..."> is text the athlete reads (a submit label, a pre-filled answer), so
   its value is a piece (REVIEW-S10-COPYLOCK-l1 F3). Types that never show their value as
   text (hidden, checkbox, radio, file, image, range, color, password) are not read. */
const INPUT = /<input\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
const VALUE_NOT_SHOWN = new Set(['hidden', 'checkbox', 'radio', 'file', 'image', 'range', 'color', 'password']);
function inputValues(html) {
  const out = [];
  for (const m of html.matchAll(INPUT)) {
    const attr = (name) => {
      const a = m[1].match(new RegExp('\\s' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s"\'>]+))', 'i'));
      return a ? (a[1] !== undefined ? a[1] : a[2] !== undefined ? a[2] : a[3]) : null;
    };
    const type = (attr('type') || 'text').toLowerCase();
    const value = attr('value');
    if (value === null || VALUE_NOT_SHOWN.has(type)) continue;
    const t = value.replace(/\s+/g, ' ').trim();
    if (t) out.push(t);
  }
  return out;
}
function markupPieces(html) {
  return [...textNodes(html), ...attrValues(html), ...inputValues(html), ...inlineBodies(html)];
}
function jsPieces(src) {
  const raw = [];
  for (const s of jsStrings(src)) {
    if (looksLikeMarkup(s)) raw.push(...markupPieces(s));
    else raw.push(s);
  }
  return raw;
}

function piecesOf(file, text) {
  let raw;
  if (/\.html$/.test(file)) raw = markupPieces(text);
  else if (/\.css$/.test(file)) raw = cssStrings(text);
  else raw = jsPieces(text);
  return raw.filter(proseLike);
}

function declaredLists(root) {
  const design = require(path.join(root, 'rebuild/m3/w7-preview/today/design.cjs'));
  const lists = {};
  for (const name of LISTS) {
    assert(Array.isArray(design[name]), 'COPY-LOCK LIST-UNREADABLE ' + name);
    lists[name] = [...design[name]];
  }
  return lists;
}
function assert(ok, message) { if (!ok) throw new Error(message); }

/* The observed side, measured from the tree at `root`. */
function measure(root, { tools = [] } = {}) {
  const skip = new Set(tools);
  const files = scanFiles(root).filter((f) => !skip.has(f));
  const entries = new Map();
  for (const file of files) {
    // Line ends are LF in the tree (.gitattributes eol=lf); CR is folded anyway, as a JS
    // template literal folds it, so a CRLF checkout cannot change a piece.
    const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n?/g, '\n');
    for (const piece of piecesOf(file, text)) {
      if (!entries.has(piece)) entries.set(piece, { text: piece, files: {}, lists: [] });
      const e = entries.get(piece);
      e.files[file] = (e.files[file] || 0) + 1;
    }
  }
  const lists = declaredLists(root);
  for (const [name, values] of Object.entries(lists)) {
    for (const v of values) {
      if (!entries.has(v)) entries.set(v, { text: v, files: {}, lists: [] });
      const e = entries.get(v);
      if (!e.lists.includes(name)) e.lists.push(name);
    }
  }
  const sorted = [...entries.values()].map((e) => ({ text: e.text,
    files: Object.fromEntries(Object.entries(e.files).sort((a, b) => (a[0] < b[0] ? -1 : 1))), lists: e.lists.sort() }))
    .sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));
  return { files, entries: sorted, tools };
}

/* THE LOCK. Returns the refusals, one line each, naming the sentence; [] means held. */
function check(root, corpus) {
  assert(corpus && corpus.schema === SCHEMA, 'COPY-LOCK CORPUS-SCHEMA');
  assert(Array.isArray(corpus.entries) && corpus.entries.length > 0, 'COPY-LOCK CORPUS-EMPTY');
  const now = measure(root, { tools: corpus.tools || [] });
  const refusals = [];
  const pinned = new Map(corpus.entries.map((e) => [e.text, e]));
  const seen = new Map(now.entries.map((e) => [e.text, e]));
  const q = (s) => JSON.stringify(s);
  for (const [text, pin] of pinned) {
    const got = seen.get(text) || { files: {}, lists: [] };
    for (const [file, count] of Object.entries(pin.files)) {
      const have = got.files[file] || 0;
      if (have < count) refusals.push(`COPY-LOCK MISSING ${file} ${count - have} of ${count} ${q(text)}`);
      else if (have > count) refusals.push(`COPY-LOCK DUPLICATED ${file} ${have} for ${count} ${q(text)}`);
    }
    for (const [file, have] of Object.entries(got.files)) {
      if (!(file in pin.files)) refusals.push(`COPY-LOCK OWNER-CHANGED ${file} now carries ${have} ${q(text)}`);
    }
    for (const list of pin.lists) if (!got.lists.includes(list)) refusals.push(`COPY-LOCK DECLARATION-DROPPED ${list} ${q(text)}`);
    for (const list of got.lists) if (!pin.lists.includes(list)) refusals.push(`COPY-LOCK DECLARATION-ADDED ${list} ${q(text)}`);
  }
  for (const [text, got] of seen) {
    if (pinned.has(text)) continue;
    const pageFiles = Object.keys(got.files);
    const where = pageFiles.length ? pageFiles.join(',') : (got.lists.length ? 'design.cjs:' + got.lists.join(',') : null);
    if (where) refusals.push(`COPY-LOCK UNLOCKED ${where} ${q(text)}`);
  }
  return refusals.sort();
}

function readCorpus(file) {
  const bytes = fs.readFileSync(file);
  return { corpus: JSON.parse(bytes.toString('utf8')), sha256: sha256(bytes) };
}

/* Composed-product check (answer 2, runtime half): every letter in `text` must come from a
   locked piece or a named fixture value (the athlete's own data); digits, spaces and
   punctuation are free. Returns the uncovered remainder, '' when covered. */
function uncovered(text, pieces, fixtures = []) {
  const tokens = [...new Set([...pieces, ...fixtures])].filter((t) => t.length > 0);
  const n = text.length;
  const ok = new Array(n + 1).fill(false); ok[0] = true;
  const from = new Array(n + 1).fill(-1);
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue;
    if (/[^A-Za-z\u00c0-\u024f]/.test(text[i])) { if (!ok[i + 1]) { ok[i + 1] = true; from[i + 1] = i; } }
    for (const t of tokens) if (text.startsWith(t, i) && !ok[i + t.length]) { ok[i + t.length] = true; from[i + t.length] = i; }
  }
  if (ok[n]) return '';
  let best = 0; for (let i = 0; i <= n; i++) if (ok[i]) best = i;
  return text.slice(best);
}

module.exports = { SCHEMA, SCAN_ROOTS, LISTS, scanFiles, jsStrings, piecesOf, proseLike, textNodes, measure, check,
  readCorpus, uncovered, sha256, posix };
