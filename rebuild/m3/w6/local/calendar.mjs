// Actual local time, sampled once per serialized operation. Explicit test clocks
// remain separate: the caller must choose this calendar rather than a fixed day.
export const DAY_CHANGED = 'LOCAL_CALENDAR_DAY_CHANGED';
export const DAY_CHANGED_COPY = 'The local date changed. Your draft is still here. Return to Today before recording; an earlier workout must be closed explicitly.';

export function createLocalCalendar({ now = () => new Date(),
  offsetMinutes = at => -at.getTimezoneOffset(),
  monotonicMs = () => globalThis.performance?.now?.() ?? Date.now() } = {}) {
  let active = null, queue = Promise.resolve();
  const sample = () => {
    const at = new Date(now()), offset = offsetMinutes(at);
    if (!Number.isFinite(at.getTime()) || !Number.isInteger(offset) || Math.abs(offset) > 14 * 60)
      throw new TypeError('LOCAL_CALENDAR_INVALID');
    const local = new Date(at.getTime() + offset * 60000).toISOString();
    const pad = n => String(n).padStart(2, '0');
    return Object.freeze({ iso: at.toISOString(), day: local.slice(0, 10),
      hour: Number(local.slice(11, 13)), time: local.slice(11, 19),
      offset: (offset < 0 ? '-' : '+') + pad(Math.floor(Math.abs(offset) / 60)) + ':' + pad(Math.abs(offset) % 60),
      monotonicMs: monotonicMs() });
  };
  const current = () => active || sample();
  function clientClock(day) {
    return Object.freeze({ today: () => day || current().day, now: () => current().iso,
      get tz() { return current().offset; }, monotonicMs: () => current().monotonicMs });
  }
  function engineClock(day) {
    return { today: () => day || current().day, hour: () => current().hour,
      now: () => new Date(current().iso), stamp: () => current().iso };
  }
  function run(day, action, { historical = false } = {}) {
    const pending = queue.then(async () => {
      const context = sample();
      if (!historical && day !== context.day) return Object.freeze({
        acknowledged: false, prepared: false, ok: false, state: 3, code: DAY_CHANGED,
        copy: DAY_CHANGED_COPY, op_id: null });
      active = context;
      try { return await action(context); } finally { active = null; }
    });
    queue = pending.catch(() => {});
    return pending;
  }
  return Object.freeze({ sample, clientClock, engineClock, clock: clientClock(), run });
}
