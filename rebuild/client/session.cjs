"use strict";
/* session.cjs — TWO OR MORE DEVICES, POSSIBLY ONE WORKOUT (sheet state 14, lines 552–585).
   · CANDIDATE EDGE: two live session starts are candidates only when plausibly the same physical workout — same
     planned split slot (or both AD_HOC), local dates equal, or adjacent ONLY across the clock-skew envelope
     (the earlier date at ≥ 23:00 and the later date at ≤ 01:00). Never chained across a week by the rule itself.
   · The AMBIGUITY COMPONENT is a connected component of that relation with ≥ 2 members. While unresolved, every
     session in it is progression-bearing NOWHERE.
   · The DECISION is keyed by {sorted start ids, generation}; the generation advances on every live-component change
     and a new generation supersedes the pending question. Its outcome is a COMPLETE PARTITION of the component into
     physical workouts, every block carrying its governing plan basis (or NO_ACCEPTED_PLAN).
   · SAME WORKOUT with disagreeing bases needs the athlete to select the governing basis — it interprets the session,
     it never mutates the accepted plan.
   · SET COLLISIONS: per collision component → duplicate classes (ONE canonical operation each) + distinct attempts
     (unique slots); nothing deleted or rewritten; the gates that follow still run; only then "combined". */
const sortIds = (a) => a.slice().sort();
const sameSet = (a, b) => { const x = sortIds(a), y = sortIds(b); return x.length === y.length && x.every((v, i) => v === y[i]); };
const dayNumber = (date) => Math.round(Date.parse(date + "T00:00:00Z") / 86400000);

function candidateEdge(x, y) {
  const slotOk = (x.slot && y.slot && x.slot === y.slot) || (x.slot === "AD_HOC" && y.slot === "AD_HOC");
  if (!slotOk) return false;
  if (!x.date || !y.date) return false;
  const dx = dayNumber(x.date), dy = dayNumber(y.date);
  if (dx === dy) return true;
  if (Math.abs(dx - dy) !== 1) return false;
  const earlier = dx < dy ? x : y, later = dx < dy ? y : x;
  return typeof earlier.time === "string" && typeof later.time === "string" && earlier.time >= "23:00" && later.time <= "01:00";
}

/* candidateComponents(starts) → [{ members: sorted start ids, generation, key }] over live starts
   start: { start, slot ("AD_HOC" | planned_split_slot_id), date (local), time (HH:MM), device } */
function candidateComponents(starts, generations = {}) {
  const live = starts.filter((s) => !s.tombstoned);
  const groups = [];
  for (const s of live) {
    const touching = groups.filter((g) => g.some((m) => candidateEdge(m, s)));
    if (!touching.length) { groups.push([s]); continue; }
    const merged = [].concat(...touching, [s]);   /* transitive closure: an edge to any member joins the component */
    for (const g of touching) groups.splice(groups.indexOf(g), 1);
    groups.push(merged);
  }
  return groups.map((g) => { const members = sortIds(g.map((m) => m.start)); const key = members.join("|"); return { members, generation: generations[key] || 1, key }; });
}

/* generation ADVANCES on a late start, a tombstone, a reclassification, a candidate-rule change */
function advanceGeneration(component, change) {
  return { members: component.members.slice(), generation: component.generation + 1, supersedesPending: true, change, key: component.key || component.members.join("|") };
}

/* validate a COMPLETE PARTITION decision against a component: every member exactly once, non-empty blocks, a basis
   for every block, the current generation */
function validatePartition(component, decision) {
  if (!decision || !Array.isArray(decision.blocks) || !decision.blocks.length) return "a decision is a list of blocks";
  const flat = [].concat(...decision.blocks);
  if (decision.blocks.some((b) => !Array.isArray(b) || !b.length)) return "every block is non-empty";
  if (new Set(flat).size !== flat.length) return "a start appears in more than one block";
  if (!sameSet(flat, component.members)) return "not a complete partition of the component";
  const bases = decision.bases || decision.blocks.map(() => decision.basis);
  if (bases.length !== decision.blocks.length || bases.some((b) => b == null || b === "")) return "every workout block carries its governing plan basis or NO_ACCEPTED_PLAN";
  if (decision.generation !== component.generation) return "decision generation " + decision.generation + " is not the component's current generation " + component.generation;
  return null;
}
function canonicalPartition(component, decision) {
  const bases = decision.bases || decision.blocks.map(() => decision.basis);
  const paired = decision.blocks.map((b, i) => ({ block: sortIds(b), basis: bases[i] })).sort((a, b) => (a.block.join("|") < b.block.join("|") ? -1 : 1));
  return { kind: "PARTITION", component: component.members.slice(), blocks: paired.map((p) => p.block), bases: paired.map((p) => p.basis), basis: decision.basis == null ? paired[0].basis : decision.basis, generation: decision.generation };
}

/* SAME WORKOUT: the governing workout-plan basis for a combined block */
function resolveSameWorkout({ starts, selectedBasis }) {
  const distinct = []; const seen = new Set();
  for (const s of starts) { const k = JSON.stringify(s.basis); if (!seen.has(k)) { seen.add(k); distinct.push(s.basis); } }
  if (distinct.length > 1 && selectedBasis == null) return { needsBasis: true, choices: distinct, planMutated: false, interpretsSession: true };
  const governing = distinct.length === 1 ? distinct[0] : selectedBasis;
  return { governingBasis: governing, attested: distinct.length > 1 && !distinct.some((b) => JSON.stringify(b) === JSON.stringify(selectedBasis)), planMutated: false, interpretsSession: true };
}

/* SET COLLISIONS inside a combined workout */
function resolveCollisions({ duplicateClasses = [], distinctAttempts = [], pending = 0, gates = {}, slotBase = 100 }) {
  const canonical = duplicateClasses.map((cls) => sortIds(cls)[0]);
  const slots = distinctAttempts.map((set, i) => ({ set, slot: slotBase + i }));
  const unresolved = pending > 0;
  const gateNames = ["completion", "safety", "lineage", "planBasis", "evidence"];
  const gateResults = gateNames.map((g) => ({ gate: g, pass: gates[g] === true }));
  const gatesPass = gateResults.every((g) => g.pass);
  const bearing = !unresolved && gatesPass;
  return { canonical, slots, progressionBearing: bearing, pendingCollisions: pending, gates: gateResults, deleted: 0, rewritten: 0, history: bearing ? require("./copy.cjs").SETS_COMBINED : null };
}

module.exports = { candidateEdge, candidateComponents, advanceGeneration, validatePartition, canonicalPartition, resolveSameWorkout, resolveCollisions, sortIds, sameSet };
