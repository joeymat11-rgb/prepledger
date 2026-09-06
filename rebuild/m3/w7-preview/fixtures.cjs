"use strict";

// Invented from scratch. Do not replace with a live blob or the frozen seed.
const SYNTHETIC_DAY = "2030-02-04";
function dayOffset(iso, offset) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + offset)).toISOString().slice(0, 10);
}
function createSyntheticState(today = SYNTHETIC_DAY) {
  const exercises = [
    { id: "demo-press", n: "Chest press", mg: "chest", day: "U" },
    { id: "demo-row", n: "Seated row", mg: "back", day: "U" },
    { id: "demo-leg", n: "Leg press", mg: "quads", day: "L" },
    { id: "demo-curl", n: "Leg curl", mg: "hams", day: "L" },
  ].map((e) => ({ ...e, w: 40, inc: 5, sets: 2, hi: 12, last: [10, 10],
    setup: "SYNTHETIC demonstration exercise", note: "SYNTHETIC demonstration", forks: [] }));
  const reads = [], dailyLogs = {}, nights = [], sessionLog = {};
  for (let i = 28; i >= 1; i--) {
    const d = dayOffset(today, -i);
    reads.push({ d, w: +(180 + i * 0.17 + (i % 3 - 1) * 0.2).toFixed(1), sealed: false, note: "SYNTHETIC" });
    dailyLogs[d] = { cal: 2300, pro: 170, steps: 8500 };
    nights.push({ d, h: 8, bed: "22:00", wake: "06:00", awakeMin: 0 });
    if (i % 3 === 0) sessionLog[d] = { type: "U", entries: exercises.map((e) => ({ id: e.id, w: e.w,
      reps: [12 - Math.floor(i / 7), 12 - Math.floor(i / 7)], rir: 2, sets: 2 })) };
  }
  return {
    v: 60, reads, dailyLogs, sessionLog, exercises, trend: 180.4,
    model: { anchorISO: dayOffset(today, -28), lean: 135, drip: 0, src: "EYE" },
    sleep: { nights, cleanH: 7, needed: 3 },
    blackout: { until: dayOffset(today, -35) },
    targets: {}, plan: { autonomy: "propose", mode: "bodycomp" },
    queue: [], feed: [], weekly: [], events: [], proposals: [], agentProposals: [],
    adjustments: [], forecasts: [], accepted: [], retirements: {},
    split: [{ from: dayOffset(today, -35), map: { 0: "REST", 1: "U", 2: "L", 3: "REST", 4: "U", 5: "L", 6: "REST" } }],
  };
}

module.exports = { SYNTHETIC_DAY, dayOffset, createSyntheticState };
