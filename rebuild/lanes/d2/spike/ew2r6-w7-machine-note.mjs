/* EW2 ROUND 6 WITNESS 7 - throwaway. Astra F9 (E-R38 F9) and the catalogue head
   encoding of E-R37 duty 3. No durable client is needed for either. */
import { draftFrom, machineFromDraft, acceptable } from '../../../m3/w7-preview/today/machine-settings-view.mjs';
import { ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';

const line = (k, v) => console.log(k.padEnd(56) + ' ' + v);

/* A STORED RECORD, the shape machine-settings-host latest() returns. */
const record = { machine: { exercise_id: 'press-old', settings: [{ name: 'Seat', value: '4' }], cues: 'Pause' } };
const first = draftFrom(record);
line('draftFrom(record)', JSON.stringify(first));
const second = draftFrom(first);
line('draftFrom(draftFrom(record))', JSON.stringify(second));
line('the second conversion blanks the row and the cue',
  String(second.rows.length === 1 && second.rows[0].name === '' && second.cues === ''));
line('draftFrom(draftFrom(record)) -> machine', JSON.stringify(machineFromDraft(second, 'press-old')));
line('acceptable(null)', String(acceptable(null)));

/* THE HEAD ENCODING, duty 3, measured rather than assumed. REGION_MG maps a
   REGION name to its muscle; the muscles that are also a region of themselves
   are the identity muscles. A muscle with NO region has only one legal head. */
const byMuscle = {};
for (const [region, muscle] of Object.entries(REGION_MG)) (byMuscle[muscle] = byMuscle[muscle] || []).push(region);
for (const m of ENGINE_MG) {
  const regions = byMuscle[m] || [];
  const identity = regions.includes(m);
  line('  ' + m, 'regions=' + JSON.stringify(regions) +
    (identity ? '  IDENTITY: head null and head "' + m + '" both validate'
              : regions.length ? '  head must be null or one of its regions'
                               : '  NO REGION AT ALL: head can only be null'));
}
