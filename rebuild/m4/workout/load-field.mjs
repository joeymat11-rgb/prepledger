// UI-only performed-load field helper shared by the command panel entry and the
// prepared-panel history/correction form. It maps a typed entry to the closed
// performed-load union and formats a recorded load for display. It is NOT the
// wire validator: schema/edit-values decide what is accepted through the shared
// entered-load predicate. Nothing here parses, trims for storage, suffixes,
// converts, substitutes body mass or zero, or copies a prescribed target.
export const MODES = Object.freeze({ weight: 'weight', configuration: 'configuration' });
const NUMERIC = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 2;

export function isNumericLoad(load) { return plain(load) && load.unit === 'lb' && Number.isFinite(load.value); }
export function isConfiguredLoad(load) {
  return plain(load) && load.kind === 'configuration' && typeof load.configuration_key === 'string' && load.configuration_key.trim().length > 0;
}
export function loadMode(load) { return isConfiguredLoad(load) ? MODES.configuration : MODES.weight; }

// Display: a numeric load keeps the existing "<value> lb"; a configuration is
// the exact key, byte for byte, with no suffix. Anything else is null.
export function formatLoad(load) {
  if (isNumericLoad(load)) return `${load.value} lb`;
  if (isConfiguredLoad(load)) return load.configuration_key;
  return null;
}

// Entry: {ok:true,load} or {ok:false,field}. Weight text is trimmed for numeric
// parsing exactly as before. Configuration text is used EXACTLY as typed when it
// is not blank; whitespace inside or around a nonblank key is preserved.
export function readLoadEntry({ mode, weightText, configurationText }) {
  if (mode === MODES.configuration) {
    const text = typeof configurationText === 'string' ? configurationText : '';
    if (text.trim().length === 0) return { ok: false, field: 'configuration' };
    return { ok: true, load: { kind: 'configuration', configuration_key: text } };
  }
  const trimmed = typeof weightText === 'string' ? weightText.trim() : '', value = Number(trimmed);
  if (!NUMERIC.test(trimmed) || !Number.isFinite(value) || value <= 0) return { ok: false, field: 'weight' };
  return { ok: true, load: { value, unit: 'lb' } };
}

// Editor prefill from a recorded load; the inactive field stays empty.
export function loadEntryFrom(load) {
  if (isConfiguredLoad(load)) return { mode: MODES.configuration, weightText: '', configurationText: load.configuration_key };
  return { mode: MODES.weight, weightText: isNumericLoad(load) ? String(load.value) : '', configurationText: '' };
}

// Same-form, same-value only. A numeric and a configured load are never equal.
export function sameLoad(a, b) {
  if (isNumericLoad(a) && isNumericLoad(b)) return a.value === b.value;
  if (isConfiguredLoad(a) && isConfiguredLoad(b)) return a.configuration_key === b.configuration_key;
  return false;
}
