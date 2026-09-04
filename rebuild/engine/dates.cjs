"use strict";

module.exports = function createDates(E, { clock }) {
// Copied from frozen src/app.jsx @ fe516c1:305-305.
const DAY = 86400000;

// Copied from frozen src/app.jsx @ fe516c1:306-306.
const mk = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

// Copied from frozen src/app.jsx @ fe516c1:307-307.
const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

// Copied from frozen src/app.jsx @ fe516c1:308-308.
const todayStart = () => mk(clock.today());

// Copied from frozen src/app.jsx @ fe516c1:309-309.
const daysUntil = (s) => Math.round((mk(s) - todayStart()) / DAY);

// Copied from frozen src/app.jsx @ fe516c1:310-310.
const fmtShort = (s) => { const d = mk(s); return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`; };

// Copied from frozen src/app.jsx @ fe516c1:311-311.
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;

return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween };
};
