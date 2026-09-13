// TEST ONLY. Invented facts, never a C2 file, private reference or production registry.
import F from '../../../../m3/w7-preview/fixtures.cjs';
import Journey from '../../../../m3/w6/host/test/journey-fixture.cjs';

export const SYNTHETIC_PROVENANCE = 'earned/s3-public-invented-fixture/v1';
export const syntheticDay = F.SYNTHETIC_DAY;
export const fixtureSetup = () => structuredClone(Journey.SETUP);
export const fixtureState = (day = syntheticDay) => F.createSyntheticState(day);
export const fixtureBytes = state => new TextEncoder().encode(JSON.stringify(state, null, 2) + '\r\n');
export function fixtureClock(day = syntheticDay, hour = 12) {
  const [year, month, date] = day.split('-').map(Number);
  const now = new Date(year, month - 1, date, hour, 0, 0, 0);
  return Object.freeze({today: () => day, hour: () => hour, dow: () => now.getDay(),
    nowISO: () => now.toISOString(), nowMs: () => now.getTime(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone});
}
export async function prepareFixture({engine, parseStrictJson, prepare, day = syntheticDay, local = null}) {
  const sourceBytes = fixtureBytes(fixtureState(day));
  const localBytes = local === null ? null : fixtureBytes(local);
  const result = prepare({engine, parseStrictJson}).prepare(sourceBytes, localBytes ? {localBytes} : {});
  return {provenance: SYNTHETIC_PROVENANCE, sourceBytes, localBytes, candidateBytes: result.candidateBytes()};
}
