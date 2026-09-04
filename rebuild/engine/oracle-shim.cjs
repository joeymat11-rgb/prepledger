"use strict";

const { createEngine } = require("./index.cjs");
const anchor = process.env.MEASURED_TEST_NOW;
const tz = process.env.TZ;
if (!anchor || !tz || !/^\d{4}-\d{2}-\d{2}$/.test(anchor)) {
  throw new Error("Oracle clock requires MEASURED_TEST_NOW=YYYY-MM-DD and TZ");
}
const [year, month, day] = anchor.split("-").map(Number);
const noon = new Date(year, month - 1, day, 12, 0, 0, 0);
const clock = {
  today: () => anchor,
  hour: () => noon.getHours(),
  dow: () => noon.getDay(),
  nowISO: () => noon.toISOString(),
  nowMs: () => noon.getTime(),
  tz,
};
let seed = 1, sequence = 0;
const ids = { fresh(prefix = "") {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return prefix + (sequence++).toString(36) + seed.toString(36);
} };

module.exports = { __test: createEngine({ clock, ids }).__test };
