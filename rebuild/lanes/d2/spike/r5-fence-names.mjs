/* EW2 SPEC ROUND 5 - THE MEMBER-NAME CENSUS, under E-R22 (R4 B3).
   Throwaway, never pushed. It reads ONE file: TODAY-SPLIT-SPEC.md's E.3 word
   list, at the head the spec cites, and asks it about each member of the
   released callback table. Nothing is run and nothing is written. */
import { readFileSync } from 'node:fs';

const SPEC = process.argv[2];
const text = readFileSync(SPEC, 'utf8');
const start = text.indexOf('**Durable writers, as MEMBER NAMES in code position:**');
const end = text.indexOf('**Lane, host and entry constructors:**', start);
if (start < 0 || end < 0) throw new Error('E.3 word list not found');
const block = text.slice(start, end);
/* Every `.name` backticked inside the durable-writer paragraph. */
const words = [...block.matchAll(/`\.([A-Za-z][A-Za-z0-9]*)`/g)].map(m => m[1]);
const list = new Set(words);

const v4 = ['open', 'review', 'save', 'cancel', 'close', 'machineLatest', 'machineSave'];
const v5 = ['openWeek', 'review', 'saveChange', 'cancel', 'closeEditor', 'machineLatest', 'machineSave'];
const objects = ['weekFacade', 'onWeek'];

const row = name => ({ member: name, 'on E.3 durable-writer word list': list.has(name),
  'qualified on the list': list.has(name)
    ? (new RegExp('`\\.' + name + '` on an? [a-z]+ identifier').test(block) ? 'yes' : 'NO, unqualified')
    : '-' });

console.log(JSON.stringify({
  'E.3 head read': SPEC,
  'durable-writer member names counted': words.length,
  'the list, verbatim': words,
  'v4 onWeek members, all seven': v4.map(row),
  'v5 onWeek members, all seven': v5.map(row),
  'the two object names': objects.map(n => ({ object: n, 'on the word list': list.has(n) })),
  'v4 REDS': v4.filter(n => list.has(n)),
  'v5 REDS': v5.filter(n => list.has(n)),
}, null, 1));
