#!/usr/bin/env node
'use strict';
/* SEAL-AUTOMATION / hash-lines.cjs - the sha256 the runner will compute for a ledger line.
   claim() does exactly sha(Buffer.from(line)) over the line's own bytes: the leading "- "
   is part of it, the newline is not, and the line number is never read. Feed it the
   final-lines.txt the generator wrote once the blanks are filled, or one line on argv. */
const fs = require('fs');
const { sha256Text } = require('./lib/measure.cjs');
const arg = process.argv[2];
if (!arg) { console.error('usage: node hash-lines.cjs <final-lines.txt | "- a whole ledger line">'); process.exit(1); }
const text = fs.existsSync(arg) ? fs.readFileSync(arg, 'utf8') : arg;
/* R1 N3. The generator writes this file LF, but the PM fills the blanks in an editor, and
   a Windows editor that saves CRLF would make every hash sha256(line + '\r') - a wrong
   sha on the one path where a wrong sha costs a whole chain round: the line goes into the
   ledger without the CR, the package pins the hash WITH it, and claim() then finds
   nothing. So the CR is stripped, and the fact that it was there is printed: a silent
   repair on this path would be worse than the bug. */
const hadCrlf = /\r\n/.test(text);
if (hadCrlf) console.log('NOTE: this file is CRLF. A ledger line never carries the CR, so every \\r has been stripped before hashing.');
let open = null, bad = 0;
for (const raw of text.split('\n')) {
  const line = raw.replace(/\r+$/, '');
  const m = line.match(/^--- (.+) ---$/);
  if (m) { open = m[1]; continue; }
  if (!line.startsWith('- ')) continue;
  if (line.includes('<<<PM:')) { console.log((open || '?') + '  STILL BLANK, not hashed'); bad += 1; open = null; continue; }
  console.log((open || 'line') + '  sha256 ' + sha256Text(line) + '  (' + Buffer.byteLength(line, 'utf8') + ' bytes)');
  open = null;
}
if (bad) { console.error(bad + ' line(s) still carry a <<<PM: ...>>> blank'); process.exit(2); }
