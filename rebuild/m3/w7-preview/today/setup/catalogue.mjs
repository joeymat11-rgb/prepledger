// Explicit limited mapping authorized by ASTRA-FIRST-USE-CATALOGUE-DISPOSITION.md
// (PM c55c1d3). No routine, equipment ladder or numerical prescription is supplied.
// Exact ids preserve INDIRECT lookup and restFor prefix classification in the engine.
export const CATALOGUE = Object.freeze([
  { id: 'press', n: 'Chest press', mg: 'chest', muscleLabel: 'Chest', day: 'U' },
  { id: 'rows', n: 'Seated row', mg: 'back', muscleLabel: 'Back', day: 'U' },
  { id: 'pulldown', n: 'Lat pulldown', mg: 'back', muscleLabel: 'Back', day: 'U' },
  { id: 'curl', n: 'Biceps curl', mg: 'biceps', muscleLabel: 'Biceps', day: 'U' },
  { id: 'hack', n: 'Hack squat', mg: 'quads', muscleLabel: 'Quadriceps', day: 'L' },
  { id: 'extension', n: 'Leg extension', mg: 'quads', muscleLabel: 'Quadriceps', day: 'L' },
  { id: 'ham', n: 'Leg curl', mg: 'hams', muscleLabel: 'Hamstrings', day: 'L' },
].map(Object.freeze));
