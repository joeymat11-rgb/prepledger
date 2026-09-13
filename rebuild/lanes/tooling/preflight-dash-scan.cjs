'use strict';
// Bounded lexical exclusions, not a rendered-text/data-flow proof. Source is
// syntax-checked but NEVER evaluated. Uncertain slash goals and unsupported
// languages refuse; P1's actual rendered-output guard remains mandatory.
const cp = require('node:child_process');
const path = require('node:path');
const DASH = /[\u2013\u2014]/gu;
function scanDashes(source, filename) {
  const omitted = new Map();
  const lineAt = n => source.slice(0, n).split(/\r\n|[\r\n\u2028\u2029]/u).length;
  const fail = (message, at) => { const error = new Error(message); error.line = lineAt(at); throw error; };
  function omit(a, b, kind) {
    for (const hit of source.slice(a, b).matchAll(DASH)) omitted.set(a + hit.index, kind);
  }
  function javascript(start, end, commonjs = false) {
    const text = source.slice(start, end);
    const checked = cp.spawnSync(process.execPath, ['--input-type=' + (commonjs ? 'commonjs' : 'module'), '--check'],
      { input: text, encoding: 'utf8', timeout: 10000, windowsHide: true, maxBuffer: 1024 * 1024 });
    if (checked.error || checked.status !== 0) fail('invalid or unsupported JavaScript syntax', start);
    let i = start;
    function string(quote) {
      const at = i++;
      while (i < end) {
        if (source[i] === '\\') { i += 2; continue; }
        if (source[i] === quote) { i++; return; }
        if (quote === '`' && source.startsWith('${', i)) { i += 2; code('}'); }
        else i++;
      }
      fail('unterminated JavaScript string/template', at);
    }
    function regex() {
      const at = i++; let inClass = false;
      while (i < end) {
        const c = source[i++];
        if (c === '\\') { i++; continue; }
        if (c === '[') { if (inClass) fail('nested regex character class unsupported', i - 1); inClass = true; }
        else if (c === ']') inClass = false;
        else if (c === '/' && !inClass) {
          const flags = /^[A-Za-z]*/u.exec(source.slice(i, end))[0]; i += flags.length;
          if (flags.includes('v')) fail('regex v sets unsupported', at);
          omit(at, i, 'regex'); return;
        } else if (/\r|\n/u.test(c)) fail('unterminated regex', at);
      }
      fail('unterminated regex', at);
    }
    function code(closing = null) {
      let expression = true, previous = '';
      while (i < end) {
        const c = source[i], at = i;
        if (/\s/u.test(c)) { i++; continue; }
        if (source.startsWith('//', i)) {
          i += 2; while (i < end && !/[\r\n\u2028\u2029]/u.test(source[i])) i++;
          omit(at, i, 'js-line'); continue;
        }
        if (source.startsWith('/*', i)) {
          const stop = source.indexOf('*/', i + 2);
          if (stop < 0 || stop + 2 > end) fail('unterminated JavaScript comment', at);
          i = stop + 2; omit(at, i, 'js-block'); continue;
        }
        if (c === closing) { i++; return; }
        if (')]}' .includes(c)) fail('unexpected JavaScript delimiter', i);
        if (c === '"' || c === "'" || c === '`') { string(c); expression = false; previous = 'value'; continue; }
        if (c === '/') {
          if (expression === 'ambiguous') fail('ambiguous JavaScript slash context', i);
          if (expression) regex(); else { i += source[i + 1] === '=' ? 2 : 1; }
          expression = !expression; previous = 'slash'; continue;
        }
        if (c === '(' || c === '[' || c === '{') {
          i++; const control = /^(if|while|for|with|switch|catch)$/u.test(previous);
          code(c === '(' ? ')' : c === '[' ? ']' : '}');
          expression = c === '{' ? 'ambiguous' : c === '(' && control;
          previous = c === '{' ? '}' : 'value'; continue;
        }
        const word = /^[A-Za-z_$][A-Za-z0-9_$]*/u.exec(source.slice(i, end));
        if (word) {
          i += word[0].length; const property = previous === '.' || previous === '?.';
          expression = !property && /^(return|throw|case|else|do|new|typeof|void|delete|in|instanceof|break|continue)$/u.test(word[0]);
          if (!property && /^(await|yield|of)$/u.test(word[0])) expression = 'ambiguous';
          previous = property ? 'value' : word[0]; continue;
        }
        if (/\d/u.test(c)) {
          i++; while (i < end && /[A-Za-z0-9_.]/u.test(source[i])) i++;
          expression = false; previous = 'value'; continue;
        }
        const pair = source.slice(i, i + 2);
        if (pair === '++' || pair === '--') { i += 2; previous = 'update'; continue; }
        if (source.startsWith('...', i)) { i += 3; expression = true; previous = 'spread'; continue; }
        if (pair === '?.') { i += 2; expression = false; previous = pair; continue; }
        if (c === '.') { i++; expression = false; previous = c; continue; }
        if (';,:?=!*%&|^~+-><' .includes(c)) { i++; expression = true; previous = c; continue; }
        fail('unsupported JavaScript token', i);
      }
      if (closing) fail('unterminated JavaScript group', end);
    }
    code();
  }
  function css(start, end) {
    let i = start; const groups = [];
    function quoted() {
      const quote = source[i++], at = i - 1;
      while (i < end) {
        if (source[i] === '\\') { i += 2; continue; }
        if (/[\r\n\f]/u.test(source[i])) fail('unterminated CSS string', at);
        if (source[i++] === quote) return;
      }
      fail('unterminated CSS string', at);
    }
    while (i < end) {
      const at = i, c = source[i];
      if (c === '"' || c === "'") { quoted(); continue; }
      if (source.startsWith('/*', i)) {
        const stop = source.indexOf('*/', i + 2);
        if (stop < 0 || stop + 2 > end) fail('unterminated CSS comment', at);
        i = stop + 2; omit(at, i, 'css-comment'); continue;
      }
      const url = /^url\(/iu.exec(source.slice(i, end));
      if (url) {
        i += url[0].length; let closed = false;
        while (i < end) {
          if (source[i] === '"' || source[i] === "'") quoted();
          else if (source[i] === '\\') i += 2;
          else if (source[i++] === ')') { closed = true; break; }
        }
        if (!closed) fail('unterminated CSS url', at);
        continue; // URL content is never interpreted as a comment exemption.
      }
      if (c === '\\' || source.startsWith('//', i)) fail('unsupported CSS syntax', at);
      if ('({['.includes(c)) groups.push(c);
      if (')}]'.includes(c) && groups.pop() !== ({ ')':'(', '}':'{', ']':'[' })[c]) fail('unbalanced CSS delimiter', at);
      i++;
    }
    if (groups.length) fail('unterminated CSS group', end);
  }
  function html() {
    let i = 0;
    while (i < source.length) {
      if (source.startsWith('<!--', i)) {
        const stop = source.indexOf('-->', i + 4);
        const body = source.slice(i + 4, stop);
        if (stop < 0 || body.startsWith('>') || body.startsWith('->') || body.includes('--')) fail('unsupported HTML comment', i);
        omit(i, stop + 3, 'html-comment'); i = stop + 3; continue;
      }
      if (source[i] !== '<') { i++; continue; }
      const at = i, tag = /^<(\/)?([A-Za-z][A-Za-z0-9:-]*)(?=[\s/>])/u.exec(source.slice(i));
      const doctype = /^<!doctype\s+html\s*>/iu.exec(source.slice(i));
      if (doctype) { i += doctype[0].length; continue; }
      if (!tag) fail('unsupported HTML markup', i);
      i += tag[0].length; let ended = false;
      while (i < source.length) {
        if (source[i] === '"' || source[i] === "'") {
          const quote = source[i++], stop = source.indexOf(quote, i);
          if (stop < 0) fail('unterminated HTML attribute', at); i = stop + 1;
        } else if (source[i++] === '>') { ended = true; break; }
      }
      if (!ended) fail('unterminated HTML tag', at);
      const name = tag[2].toLowerCase();
      if (tag[1]) continue;
      if (/^(xmp|iframe|noembed|noframes|plaintext)$/u.test(name)) fail('unsupported HTML raw-text element', at);
      if (!['script','style','textarea','title'].includes(name)) continue;
      const close = new RegExp('</' + name + '(?=[\\t\\n\\f\\r />])', 'i').exec(source.slice(i));
      if (!close) fail('unterminated HTML text element', at);
      const end = i + close.index;
      const closing = new RegExp('^</' + name + '[\\t\\n\\f\\r ]*>', 'i').exec(source.slice(end));
      // HTML ends raw text before JS/CSS classification, even for end-tag parse errors.
      if (!closing) fail('unsupported HTML text closing tag', end);
      if (name === 'script') javascript(i, end);
      if (name === 'style') css(i, end);
      i = end + closing[0].length; // RCDATA remains visible, including comment-looking text.
    }
  }
  const extension = path.extname(filename).toLowerCase();
  if (['.js','.mjs','.cjs'].includes(extension)) javascript(0, source.length, extension === '.cjs');
  else if (extension === '.html' || extension === '.htm') html();
  else if (extension === '.css') css(0, source.length);
  else fail('unsupported UI source extension', 0);
  const hits = new Set(), comments = new Set(), regex = new Set();
  for (const hit of source.matchAll(DASH)) {
    const kind = omitted.get(hit.index), line = lineAt(hit.index);
    (kind === undefined ? hits : kind === 'regex' ? regex : comments).add(line);
  }
  return { hits: [...hits], comments: comments.size, regex: regex.size };
}
module.exports = { scanDashes };
