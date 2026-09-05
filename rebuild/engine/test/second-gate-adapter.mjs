// Only this test bridge follows the harness's temporary Date overrides lazily.
import "../../../tools/_fixed-now.mjs";
import { createEngine } from "../index.cjs";
import createCarrier from "./second-gate-carrier.cjs";
import inventory from "./second-gate-inventory.json" with { type: "json" };
const context = globalThis[Symbol.for("measured.m2.second-gate")];
if (!context) throw Error("Second gate adapter requires its closed-I/O preload");
const clock = {
  today() { const d = new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-"); },
  nowMs: () => Date.now(), nowISO: () => new Date().toISOString(),
  hour: () => new Date().getHours(), dow: () => new Date().getDay(), tz: "America/New_York",
};
let sequence = 0;
const ids = { fresh(prefix) { return (prefix || "") + clock.nowMs().toString(36) + (sequence++).toString(36) + context.random().toString(36).slice(2,6); } };
const E = createEngine({ clock, ids }).__test;
const carrier = createCarrier(E), table = { ...E, ...carrier };
for (const name of inventory.all) if (!(name in table) || typeof table[name] !== inventory.types[name]) context.missing.add(name);
if (context.missing.size) throw Error("Candidate export preflight missing: " + [...context.missing].join(", "));
if ("records" in table) throw Error("Candidate must not supply records DTO");
export const __test = new Proxy(table, { get(target, name, receiver) {
  if (typeof name === "string") {
    context.exportReads.add(name);
    if (!(name in target)) context.missing.add(name);
    if (name in carrier) context.carrierReads.add(name);
  }
  return Reflect.get(target, name, receiver);
} });
