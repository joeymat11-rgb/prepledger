/* EW2 SPEC ROUND 5 - WHAT THE IMPORT SCREEN DRAWS FOR A FIELD NAME IT HAS NEVER
   SEEN (R4 N4, E-R24 / Q-J). Throwaway, never pushed, synthetic only.

   It drives the import screen's OWN exported `refusalLines` and its OWN frozen
   `REFUSAL_FIELD_SENTENCE` map. No DOM, no bundle, no seal. */
import { refusalLines, REFUSAL_FIELD_SENTENCE }
  from '../../../m3/w7-preview/import/import-screen.mjs';

const CODE = 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED';
const NEW = ['plan_edit_history', 'plan_edit_basis', 'plan_edit_context'];
const KNOWN = Object.keys(REFUSAL_FIELD_SENTENCE);

const draw = field => ({
  field,
  'the map names it': Object.hasOwn(REFUSAL_FIELD_SENTENCE, field),
  'lines drawn, leadField handed in': refusalLines(CODE, field, field),
  'lines drawn, leadField OMITTED (detail-string path)': refusalLines(CODE, field),
});

console.log(JSON.stringify({
  'the CLOSED sentence map, all keys': KNOWN,
  'a field the map DOES name, as a control': draw('capture_lift'),
  "the three names 4.3 ruling 2a proposes": NEW.map(draw),
  'so the measured answer': 'a field name the map does not carry falls through to '
    + 'REFUSAL_SENTENCE[code], the same sentence every other programme refusal draws, '
    + 'and the field name itself is printed on the detail line',
}, null, 1));
