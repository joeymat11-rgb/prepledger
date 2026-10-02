'use strict';
// Hosted NATIVE-LOAD sweep: fix the shard matrix. Shards and per-shard concurrency come from the dispatch
// inputs when given, else from the list's first header line ("# nlsweep-list/1 shards=N per_shard=P ..."),
// else 20 and 2. Shards are capped at the mutant count and at 256 (GitHub's matrix limit); per-shard at 4.
// Writes shards=, par= and matrix= lines for $GITHUB_OUTPUT; prints nothing else. Refuses an empty list and any
// list with an entry allow.cjs refuses.
const fs = require('node:fs');
const argv = process.argv.slice(2), opt = {};
for (let i = 0; i < argv.length; i += 2) opt[String(argv[i]).replace(/^--/, '')] = argv[i + 1];
const die = (c) => { process.stderr.write('NLSWEEP-PLAN-ERROR ' + c + '\n'); process.exit(2); };
let text; try { text = fs.readFileSync(opt.list, 'utf8'); } catch { die('LIST_UNREADABLE'); }
const lines = text.split('\n').map((l) => l.replace(/\r$/, ''));
const entries = lines.filter((l) => l.trim() && !l.startsWith('#'));
const mutants = entries.length;
if (!mutants) die('LIST_EMPTY');
// D-HSW-2: the whole list is refused (the run stops here, no shard starts, no product file is read) when any entry
// targets a file other than the five NATIVE-LOAD files in their own mode or names a test other than fc12/fa03.
// Only list positions and refusal codes are printed, never entry text.
const { refuse } = require('./allow.cjs');
const refused = [];
entries.forEach((l, k) => { let m = null; try { m = JSON.parse(l); } catch { m = null; } const c = refuse(m); if (c) refused.push(k + ':' + c); });
if (refused.length) die('ENTRY_REFUSED ' + refused.length + ' ' + refused.slice(0, 20).join(' '));
const head = lines.find((l) => l.startsWith('# nlsweep-list/')) || '';
const fromHead = (k) => { const m = head.match(new RegExp('\\b' + k + '=(\\d+)\\b')); return m ? Number(m[1]) : null; };
const pick = (input, k, dflt) => { const s = String(input == null ? '' : input).trim(); if (s) { if (!/^\d+$/.test(s)) die('BAD_' + k.toUpperCase()); return Number(s); } return fromHead(k) || dflt; };
const shards = Math.max(1, Math.min(pick(opt.shards, 'shards', 20), mutants, 256));
const par = Math.max(1, Math.min(pick(opt.par, 'per_shard', 2), 4));
process.stdout.write('shards=' + shards + '\npar=' + par + '\nmatrix=' + JSON.stringify(Array.from({ length: shards }, (_, i) => i)) + '\n');
process.stderr.write('NLSWEEP-PLAN mutants ' + mutants + ' shards ' + shards + ' per_shard ' + par + '\n');
