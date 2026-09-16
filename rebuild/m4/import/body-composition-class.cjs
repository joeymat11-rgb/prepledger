'use strict';
/* body-composition-class.cjs - THE SHARED CLASS, JUDGED BY PROFILE (RV-G4).
   Lane D, ticket P3-REPLAY-ALL-FAMILIES; the defect is finding RV-G4 of the
   review of P3-REPLAY-MEASURE-FAMILY.

   WHAT WENT WRONG. `body-composition-source` is NOT one lane's class. It is an
   accepted A4 class (rebuild/client/ops.cjs:20) whose payload the authority
   validates in a LEAN-SOURCE shape of its own - kind, quantity, provenance,
   effective_date and a low/high interval with an optional point
   (rebuild/authority/validate.cjs payloadValid) - which carries NO
   `payload.profile` at all. F7 claimed the whole class by class alone, so that
   payload, and any future member of the class, was judged by the MEASURE
   family and refused LOCAL_SOURCE_MEASURE_UNRESOLVED: a refusal in the name of
   a family that never had anything to say about it.

   THE RULE. Membership in this class is by PROFILE, not by class alone. Each
   member family names the profiles it answers for; an operation of the class is
   handed to the family that claims its profile, and an operation of the class
   whose profile no family claims is refused BY NAME as
   LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED, with the profile it carried, so the
   refusal says what is actually missing: a family, not a valid record.

   THE PROFILE OF A NON-FACT. A correction, reclassification or tombstone
   carries no profile of its own; it carries a TARGET. Its profile is its
   target's, read from the generation, so an edit of a measure record is judged
   by the measure family that owns the record it edits, and an edit of a record
   under a profile with no family is refused by this class's own code. An edit
   whose target is not in the generation is not a routing question - admission
   has already refused the envelope (LOCAL_SOURCE_ORIGINAL_INVALID) - and is
   refused here by name rather than guessed at.

   NOTHING IS DROPPED. Every operation of this class leaves here either inside a
   member family's answer or as a named refusal of this class; the count is
   asserted, so a future edit cannot lose one quietly.

   NO ENGINE, NO CLOCK, NO PLATFORM. This module routes operations; the member
   families state the rules, and the caller injects them. */

const OP_CLASS = 'body-composition-source';
const CODE = 'LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED';
const TARGET_KINDS = new Set(['correction', 'reclassification', 'tombstone']);

function createBodyCompositionClass({members} = {}) {
  if (!Array.isArray(members) || !members.length)
    throw new TypeError('At least one member family of this class is required');
  const claims = new Map();
  for (const member of members) {
    if (typeof member?.replay !== 'function' || typeof member.family !== 'string'
      || !member.family || !Array.isArray(member.profiles) || !member.profiles.length)
      throw new TypeError('Each member states its family name, its profiles and its replay');
    for (const profile of member.profiles) {
      if (typeof profile !== 'string' || !profile)
        throw new TypeError('Each claimed profile is a name');
      if (claims.has(profile))
        throw new TypeError('Two families claim ' + profile + '; membership must be unambiguous');
      claims.set(profile, member);
    }
  }

  function owns(op) { return !!op && op.class === OP_CLASS; }

  /* The profile an operation is judged under: its own for a fact, its TARGET's
     for an edit. `null` when there is none to read, which is a refusal. */
  function profileOf(op, readOperation) {
    if (TARGET_KINDS.has(op.kind)) {
      const target = typeof op.target_op_id === 'string' ? readOperation(op.target_op_id) : null;
      const profile = target && target.class === OP_CLASS ? target.payload?.profile : null;
      return typeof profile === 'string' ? profile : null;
    }
    const profile = op.payload?.profile;
    return typeof profile === 'string' ? profile : null;
  }

  /* The whole class, over every operation admission holds. Each member family
     is handed exactly the operations that claim it and states its own rules
     over them; everything else of the class is refused by this class's name. */
  function replay(operations, at = {}) {
    const {readOperation} = at;
    if (typeof readOperation !== 'function')
      throw new TypeError('A generation reader is required');
    const owned = (operations || []).filter(owns);
    const slices = new Map(members.map(member => [member, []]));
    const families = [], issues = [];
    for (const op of owned) {
      const profile = profileOf(op, readOperation);
      const member = profile === null ? undefined : claims.get(profile);
      if (!member) { issues.push({code: CODE, op_id: op.op_id, profile}); continue; }
      slices.get(member).push(op);
    }
    let answered = 0;
    for (const member of members) {
      const slice = slices.get(member);
      if (!slice.length) continue;
      const out = member.replay(slice, at);
      answered += slice.length;
      for (const row of out.families) families.push(row);
      for (const row of out.issues) issues.push(row);
    }
    if (answered + issues.filter(row => row.code === CODE).length !== owned.length)
      throw new Error('BODY_COMPOSITION_REPLAY_ACCOUNTING');
    return {families, issues, owned: owned.length};
  }

  return Object.freeze({owns, profileOf, replay, OP_CLASS, CODE,
    profiles: Object.freeze([...claims.keys()])});
}

module.exports = {createBodyCompositionClass, OP_CLASS, CODE};
