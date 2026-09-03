src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.34.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
edits = []
def rep(old, new):
    n = src.count(old); assert n == 1, f"found {n}: {old[:100]!r}"
    edits.append((old, new))

# ---- title ----
rep("EARNED — RUNTIME SHEET v1.7.34 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.33 (Sol pass 32 applied, rig181: ",
    "EARNED — RUNTIME SHEET v1.7.35 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.34 (Sol pass 33 applied, rig182: verification only REPORTS — VERIFIED | UNVERIFIABLE — and every miss, unverifiable included, meets new_submission_authorized before any stub exists; registrations are INCARNATIONS with an authority-issued never-reused registration_instance_id, PRESENT → REMOVED terminal, current_submission_route_id[source_id] the total selector; REGISTRATION_PRESENCE_MISSING_OR_INVALID joins the closed defect enum and every registry test ranges over PRESENT incarnations; exact-response release is a serialized step with its own linearization point; earlier in v1.33, pass 32, rig181: ")

# ---- header ----
rep("APPENDIX v1.33 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 32: rig180 T1–T3 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four findings (3 High, 1 Medium) applied in v1.33 — new_submission_authorized, per-source linearization of the door, group commit and signed cutoff, orthogonal registry axes with one ruled revocation effect, the normalized unauthorized response envelope; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.34 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 33: rig181 T1–T4 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four findings (2 High, 2 Medium) applied in v1.34 — no stub before new_submission_authorized, registration incarnations with a total current-route selector, the presence defect in the closed enum, linearized exact-response release; no frozen row is CHANGED · bounded audit continues on the appendix only")

# ---- CHANGES entry ----
NEW = """CHANGES v1.33 → v1.34 (Sol's appendix pass 33 — rig181 T1 / T2 / T3 / T4 CLOSED on their witnesses, the row and
precedence still RATIFIED, no runtime-sheet reopening; four alternative normative paths, every one executed in
rig182; the sheet stays closed): (1) [High] an UNVERIFIABLE miss could still create a stub BEFORE
new_submission_authorized — the high-level order put the door after both lookups, but the detailed test order
said "THEN VERIFICATION … → for a currently admitted source a REJECTION STUB", and "currently admitted" was
glossed as a PRESENT registration declaring RECORD, never the presented credential: C1 of removed r1 / epoch e1,
the source re-registered as r2 with RECORD, C1 sends new unverifiable bytes under a transport miss → the
predicate says REFUSED, the verification branch saw PRESENT + RECORD and minted a transport-keyed stub, and with
a parseable claimed scope SOURCE_ITEM_UNREADABLE entered the ledger from unauthorized input (rig182 T1) →
VERIFICATION ONLY REPORTS: VERIFIED {content_identity} or UNVERIFIABLE {reason}, committing nothing; for
UNVERIFIABLE the content lookup is NOT_APPLICABLE and counts as a miss; EVERY miss then passes through
new_submission_authorized; only when it is TRUE may the authority create the transport-keyed rejection-stub
group, under the same expected-registry-tuple compare-and-append; when FALSE, REFUSED with no durable state;
every "currently admitted source" shortcut and every ingestion-order summary now states this rule (§D14-C,
§E; v1.7.35 sheet lines 2649–2655, 2557–2579, 3715–3718 and 3780–3785); (2) [High] re-registration had no total REGISTRATION-INCARNATION
rule — the credential had to be "bound to the CURRENT registration / route version", but nothing defined a
unique current submission route or said whether a REMOVED identity may become PRESENT again: record A stamped
under r1 (feed version 7), r1 REMOVED, the source re-registers at epoch e2 with the SAME version 7 — one
implementation flips r1 back to PRESENT and A is silently current again, another mints a fresh route and A stays
stale (rig182 T2: 2,001 vs ABSTAIN, and different component / withdrawal currentness) → a registration is an
INCARNATION: the ROUTE IDENTITY gains an immutable, authority-issued, monotone, NEVER-REUSED
registration_instance_id (the source's feed version alone cannot guarantee freshness); an incarnation's
PRESENT → REMOVED transition is TERMINAL; re-registration always creates a fresh incarnation;
current_submission_route_id[source_id] — the PRESENT incarnation of that source with the greatest instance id,
of which the registry keeps AT MOST ONE — is the TOTAL selector the credential, new_submission_authorized and
the expected registry tuple bind to; active false → true is the ONLY same-incarnation reactivation; a content
replay retains its historical stamp, and only a NEW source_item_id submitted under the fresh incarnation can
become current (§D14-C registry; v1.7.35 sheet lines 2965–2971, 2984–2991 and 2608–2612); (3) [Medium] the closed
PRODUCER_REGISTRY_INVALID enum had no presence defect although registration_presence now decides P0a
membership and every currentness test — a route with a valid identity, active = true, RECORD and valid domains
but an absent or malformed presence was included as PRESENT by one reducer, excluded as REMOVED by another,
and a third had no legal code to reject it; and D14_1_ACTIVE_CARDINALITY "≠ 1 while any D14.1 registration
exists" could count a retained REMOVED incarnation (rig182 T3) → REGISTRATION_PRESENCE_MISSING_OR_INVALID
{identity | position} joins the closed enum; P0a membership, every phase / cardinality defect and "any
registration exists" range ONLY over PRESENT incarnations; ACTIVE_FLAG_MISSING applies only to a PRESENT
incarnation (active is inapplicable when REMOVED); a missing or malformed credential_state, credential epoch,
signed cutoff or current-submission-route field fails EVERY authorization predicate closed and forbids an exact
response (§D14-F P0a, §D14-C; v1.7.35 sheet lines 3046–3052 and 2578); (4) [Medium] exact-response release was not
linearized and a refusal had no group to wait for — "re-check immediately before release" still allowed check
passes under e1 → revocation commits e2 → exact bytes released, and "released only after the group commits"
named a group an authorized refusal never creates (rig182 T4) → EXACT-RESPONSE RELEASE is an entry in the
per-(athlete, source) serialized order with its own LINEARIZATION POINT: the serialized step that selects exact
versus envelope by the registry state AT THAT STEP and, for exact, hands the reply IRREVOCABLY to transport
within it; if release wins, a removal or revocation completes only after that hand-off; if the mutation wins,
the reply is the envelope; completion prerequisites are distinguished — a replay hit: its group complete or
recovered; an admitted miss: its new group committed; a refused miss: the serialized no-commit refusal decision
completed, there is no group; queued exact replies are drained before the mutation completes or cancelled and
replaced by the envelope (§D14-C, §D14-G, §E; v1.7.35 sheet lines 2586–2595, 3449–3452 and 3730–3738). The v1.32 entry's
"transport-keyed rejection stub for a currently admitted source", the v1.30 entry's stub-on-verification-failure
note and the v1.33 entry's "bound to the current registration / route version" and "re-checked immediately
before release" are marked SUPERSEDED in place (v1.7.35 sheet lines 916, 1007, 845 and 863). A pre-delivery adversarial read
(rig182 X1–X3) shaped the wording: the transport-exact replay of an unauthorized principal's OWN earlier stub
still returns that stub internally (a replay hit is not a miss) and is disclosed only by (iii); a D14.1
METHOD registration is an incarnation too, its instance id issued by the same counter, so "the one active
D14.1" ranges over PRESENT incarnations; the expected tuple names the instance id instead of the feed version,
so a same-version re-registration is a tuple mismatch and restarts the in-flight commit.

"""
rep("CHANGES v1.32 → v1.33 (Sol's appendix pass 32 — rig180 T1 / T2 / T3 CLOSED on their witnesses, the row and", NEW + "CHANGES v1.32 → v1.33 (Sol's appendix pass 32 — rig180 T1 / T2 / T3 CLOSED on their witnesses, the row and")

# ---- (1) the door's unverifiable clause ----
rep("""  CURRENT-REGISTRATION DOOR as NEW content — tested against the current registration and its declared phases;
  a miss from a source with no current registration, or under a registration whose declared_phases lacks
  RECORD, is REFUSED AT THE DOOR — not ingested, no receipt, no stub, no identity consumed — and may be
  submitted again once registered (an UNVERIFIABLE transport miss is refused the same way, without a stub,
  when no current registration exists, and is a transport-keyed rejection stub only for a currently admitted
  source — one with a current registration whose declared_phases includes RECORD); a submission whose
  principal authenticates against no registration, present or past, is refused
  the same way.""",
"""  CURRENT-REGISTRATION DOOR as NEW content — the door IS new_submission_authorized (below), evaluated over
  the presented credential and current_submission_route_id[source_id]; a miss it refuses is REFUSED AT THE
  DOOR — not ingested, no receipt, no stub, no identity consumed, no durable state — and may be submitted
  again once the source is registered and the credential current (rig182 T1: an UNVERIFIABLE miss is a miss
  like any other — verification REPORTS, it never commits; a stub exists only when the door said TRUE);
  a submission whose principal authenticates against no registration, present or past, is refused
  the same way.""")

# ---- (2) new_submission_authorized binds to the incarnation ----
rep("""  credential_state = CURRENT AND its credential epoch = current_credential_epoch[source_id] AND it is bound to
  the CURRENT registration / route version AND registration_presence = PRESENT AND declared_phases contains
  RECORD, active being EITHER value (a paused-but-connected source may submit evidence that stays non-current
  until reactivated, rig172 Y3); after both lookups miss, FALSE means REFUSED — no receipt, no stub, no route
  stamp, no identity consumed, no ingestion group; (iii)""",
"""  credential_state = CURRENT AND its credential epoch = current_credential_epoch[source_id] AND it is bound to
  current_submission_route_id[source_id] — the EXACT incarnation, by registration_instance_id (below) — AND
  that incarnation is PRESENT AND its declared_phases contains RECORD, active being EITHER value (a
  paused-but-connected source may submit evidence that stays non-current until reactivated, rig172 Y3); after
  both lookups miss — an UNVERIFIABLE submission's content lookup being NOT_APPLICABLE, a miss — FALSE means
  REFUSED — no receipt, no stub, no route stamp, no identity consumed, no ingestion group, no durable state;
  TRUE admits: for VERIFIED content the shape, stamp and identity steps below, for UNVERIFIABLE content the
  transport-keyed rejection-stub group, both under the same expected-registry-tuple compare-and-append; a
  missing or malformed credential_state, credential epoch, signed cutoff or current-submission-route field
  makes (ii) and (iii) FALSE and forbids an exact response; (iii)""")

# ---- (4) exact-response release linearized ----
rep("""  IS TRUE the source receives the exact receipt and disposition (a hit's original, a miss's new one, or the
  refusal), released only AFTER the group commits and RE-CHECKED against the current credential epoch
  immediately before release (or serialized in the same transaction) — a completed removal or revocation is
  never followed by an exact response under the displaced epoch; WHEN FALSE the lookups and recovery still run""",
"""  IS TRUE the source receives the exact receipt and disposition (a hit's original, a miss's new one, or the
  refusal) — and EXACT-RESPONSE RELEASE is itself an entry in the per-(athlete, source) SERIALIZED ORDER
  (rig182 T4: "re-checked immediately before release" still let a revocation commit between the check and the
  hand-off, and "after the group commits" named a group a refusal never creates): its LINEARIZATION POINT is
  the serialized step that selects exact versus envelope by the registry state AT THAT STEP and, for exact,
  hands the reply IRREVOCABLY to transport within the same step; a reply's completion prerequisite is — for a
  replay hit, its group complete or recovered; for an admitted miss, its new group committed; for a refused
  miss, the serialized no-commit refusal decision completed (there is no group); if release wins, a removal or
  revocation completes only after that hand-off; if the mutation wins, the reply is the envelope; queued exact
  replies are drained before the mutation completes or cancelled and replaced by the envelope — so a completed
  removal or revocation is never followed by an exact response under the displaced epoch; WHEN FALSE the
  lookups and recovery still run""")

# ---- (2)(4) the linearization passage: tuple by instance id; release in the order ----
rep("""  mutations and ingestion-group commits SERIALIZE per (athlete, source); the door captures an EXPECTED
  SOURCE-REGISTRY TUPLE {registration_presence, registration version, credential_state,
  current_credential_epoch, declared_phases} (the active boolean deliberately excluded — a pause during an""",
"""  mutations, ingestion-group commits, no-commit refusal decisions and exact-response releases SERIALIZE per
  (athlete, source); the door captures an EXPECTED
  SOURCE-REGISTRY TUPLE {registration_presence, registration_instance_id of current_submission_route_id,
  credential_state, current_credential_epoch, declared_phases} (a same-version re-registration is a fresh
  instance id and therefore a mismatch; the active boolean deliberately excluded — a pause during an""")

# ---- (1) the split passage: verification reports ----
rep("""  replays its stub); THEN VERIFICATION of the submitted canonical content — an item with no id, no commitment,
  or a commitment that does not equal the recomputed digest → for a currently admitted source a REJECTION
  STUB under its transport identity, never a collision member and never a content replay (a claimed
  commitment is never trusted before the bytes behind it verify), and for a source with no current
  registration a REFUSAL without a stub; THEN the VERIFIED CONTENT replay""",
"""  replays its stub); THEN VERIFICATION of the submitted canonical content, which only REPORTS — VERIFIED
  {content identity} or UNVERIFIABLE {reason} (an item with no id, no commitment, or a commitment that does not
  equal the recomputed digest) — and commits nothing (rig182 T1: a stub minted here bypassed the door): an
  UNVERIFIABLE submission is never a collision member and never a content replay (a claimed commitment is
  never trusted before the bytes behind it verify), its content lookup is NOT_APPLICABLE and it proceeds as a
  MISS to the door, where new_submission_authorized TRUE yields the transport-keyed REJECTION STUB group and
  FALSE yields a REFUSAL with no durable state; THEN the VERIFIED CONTENT replay""")

# ---- (2) the route identity + incarnations ----
rep("""  registration and the ruled D14.1 registration. A REGISTRATION has a ROUTE IDENTITY — the triple (kind:
  AUTHORITATIVE_SOURCE | D14_1_METHOD, producer_id (the source_id, or the method id), registration version
  (the source's feed / registration version, or the D14.1 method version)) — which is the ONLY key anywhere
  (uniqueness, sorting by canonical_encode, candidate identity, active_producer_map), and CONTENT that is part""",
"""  registration and the ruled D14.1 registration. A REGISTRATION is an INCARNATION with a ROUTE IDENTITY — the
  quadruple (kind: AUTHORITATIVE_SOURCE | D14_1_METHOD, producer_id (the source_id, or the method id),
  registration version (the source's feed / registration version, or the D14.1 method version),
  registration_instance_id — an IMMUTABLE, authority-issued, monotone, NEVER-REUSED number per producer_id,
  issued at every registration of any kind (rig182 T2: a source re-registered at the same feed version could
  either revive its removed route, making its old records current again, or start a fresh one; the version
  alone guarantees no freshness)) — which is the ONLY key anywhere
  (uniqueness, sorting by canonical_encode, candidate identity, active_producer_map), and CONTENT that is part""")
rep("""  registration_presence = PRESENT | REMOVED (a REMOVED registration leaves the P0a list but keeps its route
  identity, its history, its sequence and its frontier, §D14-C); registration.active = true | false, defined
  only while PRESENT;""",
"""  registration_presence = PRESENT | REMOVED per incarnation (a REMOVED incarnation leaves the P0a list but
  keeps its route identity, its history, its sequence and its frontier, §D14-C) — PRESENT → REMOVED is
  TERMINAL: an incarnation never becomes PRESENT again, re-registration creates a fresh incarnation, and active
  false → true is the ONLY same-incarnation reactivation; the registry keeps AT MOST ONE PRESENT incarnation
  per producer_id (a registration mutation that adds one removes the prior one in the same atomic mutation),
  and current_submission_route_id[source_id] — that PRESENT incarnation, or none — is the TOTAL selector the
  credential, new_submission_authorized and the expected registry tuple bind to; a content replay retains its
  historical stamp, and only a NEW source_item_id submitted under the fresh incarnation can become current;
  registration.active = true | false, defined
  only while PRESENT;""")

# ---- (3) the closed defect enum + PRESENT scope ----
rep("""  registry_state alike): ROUTE_IDENTITY_MALFORMED {position} · ROUTE_IDENTITY_COLLISION {identity} ·
  ACTIVE_FLAG_MISSING {identity} · PHASES_EMPTY {identity} · PHASES_KIND_INVALID {identity, phase} (a""",
"""  registry_state alike) — EVERY test below, P0a membership, each phase / cardinality defect and "any
  registration exists" alike, ranges ONLY over PRESENT incarnations (rig182 T3: a retained REMOVED D14.1
  incarnation counted toward D14_1_ACTIVE_CARDINALITY): ROUTE_IDENTITY_MALFORMED {position} ·
  ROUTE_IDENTITY_COLLISION {identity} · REGISTRATION_PRESENCE_MISSING_OR_INVALID {identity | position} (a
  registration whose registration_presence is absent or not PRESENT | REMOVED — rig182 T3: one reducer
  included it, another excluded it, a third had no code to reject it) · ACTIVE_FLAG_MISSING {identity} (on a
  PRESENT incarnation only — active is inapplicable when REMOVED) · PHASES_EMPTY {identity} ·
  PHASES_KIND_INVALID {identity, phase} (a""")

# ---- (4) §D14-G serialization sentence ----
rep("""  never compared to it; registry mutations and ingestion-group commits serialize per (athlete, source), the
  group committing only by compare-and-append on the door's expected registry tuple (§D14-C) (a removal flips""",
"""  never compared to it; registry mutations, ingestion-group commits, no-commit refusal decisions and
  exact-response releases serialize per (athlete, source), the group committing only by compare-and-append on
  the door's expected registry tuple and a release selecting exact versus envelope at its own serialized step
  (§D14-C) (a removal flips""")

# ---- §E ----
rep("""  the current-registration door (THREE PREDICATES over the registry's orthogonal axes —
  historical_principal_verified: internal lookups and recovery only; new_submission_authorized: a credential
  bound to this athlete and source, CURRENT, at current_credential_epoch[source_id], bound to the current
  registration version, registration PRESENT with RECORD declared, active either value — false after both
  lookups miss means REFUSED with nothing created; direct_replay_response_authorized: bound, CURRENT, current""",
"""  the current-registration door (THREE PREDICATES over the registry's orthogonal axes —
  historical_principal_verified: internal lookups and recovery only; new_submission_authorized: a credential
  bound to this athlete and source, CURRENT, at current_credential_epoch[source_id], bound to
  current_submission_route_id[source_id] by registration_instance_id, that incarnation PRESENT with RECORD
  declared, active either value — the door for EVERY miss, an unverifiable submission's included (verification
  only reports VERIFIED | UNVERIFIABLE and commits nothing): false means REFUSED with nothing created, true
  admits the content or the transport-keyed stub group; direct_replay_response_authorized: bound, CURRENT, current""")
rep("""  interval — never hit, miss, disposition or recovery; exact-result disclosure re-checked against the current
  credential epoch immediately before release; LINEARIZATION: registry mutations and ingestion-group commits
  serialize per (athlete, source), the group committing only by compare-and-append on the door's expected
  tuple {presence, registration version, credential_state, current_credential_epoch, declared_phases}, a
  mismatch restarting recovery and both lookups, an ingestion that wins included in the later cutoff, a
  mutation that wins storing nothing — no receipt ever above the cutoff that terminates its epoch; the AXES
  registration_presence, active, credential_state, current_credential_epoch[source_id] and
  global_registry_epoch as distinct fields with the one ruled effect of §D14-C), a content replay never""",
"""  interval — never hit, miss, disposition or recovery; LINEARIZATION: registry mutations, ingestion-group
  commits, no-commit refusal decisions and exact-response releases serialize per (athlete, source), the group
  committing only by compare-and-append on the door's expected tuple {presence, registration_instance_id of
  the current submission route, credential_state, current_credential_epoch, declared_phases}, a mismatch
  restarting recovery and both lookups, an ingestion that wins included in the later cutoff, a mutation that
  wins storing nothing — no receipt ever above the cutoff that terminates its epoch; an exact-response release
  selecting exact versus envelope by the registry state at its own serialized step and handing an exact reply
  irrevocably to transport within it (prerequisite: a hit's group complete, an admitted miss's group
  committed, a refusal's serialized decision completed — no group), queued exact replies drained before a
  removal or revocation completes or replaced by the envelope; REGISTRATION INCARNATIONS: the route identity
  carries an authority-issued never-reused registration_instance_id, PRESENT → REMOVED is terminal,
  re-registration is a fresh incarnation, at most one PRESENT incarnation per producer,
  current_submission_route_id[source_id] the total selector, active false → true the only same-incarnation
  reactivation; the closed defect enum gains REGISTRATION_PRESENCE_MISSING_OR_INVALID and every registry test
  ranges over PRESENT incarnations; missing or malformed credential_state, epoch, cutoff or current-route
  state fails every authorization predicate closed; the AXES
  registration_presence, active, credential_state, current_credential_epoch[source_id] and
  global_registry_epoch as distinct fields with the one ruled effect of §D14-C), a content replay never""")
rep("""  admitted, then verification sufficient to derive a content identity, then the verified content replay, then
  — only when both lookups miss — the current-registration / phase door for NEW content, then ingestion-shape
  validation (which alone decides whether a submission consumes its source_item_id), then the route stamp,
  then the identity test; the closed""",
"""  admitted, then verification that only REPORTS (VERIFIED | UNVERIFIABLE, committing nothing), then the
  verified content replay (NOT_APPLICABLE for UNVERIFIABLE — a miss), then — for every miss —
  new_submission_authorized as the door (false: REFUSED with no durable state; true: the transport-keyed
  rejection-stub group for UNVERIFIABLE, else on), then ingestion-shape validation (which alone decides
  whether a submission consumes its source_item_id), then the route stamp, then the identity test, then the
  serialized exact-response release; the closed""")

# ---- SUPERSEDED marks ----
rep("""registration and is a transport-keyed rejection stub for a currently admitted source; a content replay NEVER""",
"""registration and is a transport-keyed rejection stub for a currently admitted source (SUPERSEDED in v1.34: a stub
exists only when new_submission_authorized is TRUE for the presented credential; verification never commits); a content replay NEVER""")
rep("""verification failure creates or replays the transport-identity rejection stub (v1.32: for a currently admitted
source; an unregistered source's unverifiable miss is refused without a stub); then verified content replay →""",
"""verification failure creates or replays the transport-identity rejection stub (v1.32: for a currently admitted
source; an unregistered source's unverifiable miss is refused without a stub; SUPERSEDED in v1.34: the stub is
created at the door only when new_submission_authorized is TRUE); then verified content replay →""")
rep("""CURRENT AND its credential epoch = current_credential_epoch[source_id] AND it is bound to the current
registration / route version AND registration_presence = PRESENT AND declared_phases contains RECORD (active may""",
"""CURRENT AND its credential epoch = current_credential_epoch[source_id] AND it is bound to the current
registration / route version (SUPERSEDED in v1.34: to current_submission_route_id[source_id] by
registration_instance_id) AND registration_presence = PRESENT AND declared_phases contains RECORD (active may""")
rep("""credential's miss stores nothing; exact-result disclosure is re-checked against the current credential epoch
immediately before release (or serialized in the same transaction) — a completed removal / revocation is never
followed by an exact response under the displaced epoch; INVARIANT:""",
"""credential's miss stores nothing; exact-result disclosure is re-checked against the current credential epoch
immediately before release (or serialized in the same transaction) — a completed removal / revocation is never
followed by an exact response under the displaced epoch (SUPERSEDED in v1.34: the release is itself a serialized
step with a linearization point; a refusal has no group to wait for); INVARIANT:""")

# ---- adversarial read: the three remaining triple spellings ----
rep("""  ingestion with the ROUTE IDENTITY (kind, producer_id, registration version) of the registration it arrived""",
"""  ingestion with the ROUTE IDENTITY (kind, producer_id, registration version, registration_instance_id) of the registration it arrived""")
rep("""  disposition becomes COLLISION_MEMBER included — with the IMMUTABLE ROUTE IDENTITY (kind, producer_id,
  registration version) of the registration it arrived under, assigned BEFORE the identity test (rig179 T2:""",
"""  disposition becomes COLLISION_MEMBER included — with the IMMUTABLE ROUTE IDENTITY (kind, producer_id,
  registration version, registration_instance_id) of the incarnation it arrived under, assigned BEFORE the identity test (rig179 T2:""")
rep("""  D14.1 method registered with a unique (kind, producer_id, registration version), declared phases and a declared""",
"""  D14.1 method registered with a unique (kind, producer_id, registration version, registration_instance_id), declared phases and a declared""")

out = src
for o, n in edits: out = out.replace(o, n, 1)
open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.35.txt', 'w', encoding='utf-8').write(out)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"
print("edits", len(edits), "lines", len(L), "bytes", len(out.encode()))
