src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.35.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
edits = []
def rep(old, new):
    n = src.count(old); assert n == 1, f"found {n}: {old[:100]!r}"
    edits.append((old, new))

# ---- title ----
rep("EARNED — RUNTIME SHEET v1.7.35 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.34 (Sol pass 33 applied, rig182: ",
    "EARNED — RUNTIME SHEET v1.7.36 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.35 (Sol pass 34 applied, rig183: producer_key = {kind, producer_id} scopes instance ids and the one-PRESENT rule; ONE terminal response state per request — PENDING → EXACT_RELEASED | ENVELOPE_RELEASED, the envelope at the fixed deadline for anything still pending, an exact result only when ready and authorized before it; registry validation in THREE STAGES with PRESENT_INCARNATION_CARDINALITY in the closed enum; the EMISSION candidate identity carries the quadruple; earlier in v1.34, pass 33, rig182: ")

# ---- header ----
rep("APPENDIX v1.34 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 33: rig181 T1–T4 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four findings (2 High, 2 Medium) applied in v1.34 — no stub before new_submission_authorized, registration incarnations with a total current-route selector, the presence defect in the closed enum, linearized exact-response release; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.35 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 34: rig182 T1 and T2 CLOSED, T3 / T4 closed on their implementation witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four findings (2 High, 2 Medium) applied in v1.35 — producer_key, the one-terminal-response protocol, three-stage registry validation, the quadruple in the emission identity; no frozen row is CHANGED · bounded audit continues on the appendix only")

# ---- CHANGES entry ----
NEW = """CHANGES v1.34 → v1.35 (Sol's appendix pass 34 — rig182 T1 and T2 CLOSED, T3 and T4 closed on their
implementation witnesses with the normative text still admitting another path; the row and precedence still
RATIFIED, no runtime-sheet reopening; four findings, every one executed in rig183; the sheet stays closed):
(1) [High] incarnation cardinality was keyed by an UNTYPED producer_id — instance-id allocation and the
one-PRESENT rule read "per producer_id", while source_id and D14.1 method_id share no declared namespace: a
source with source_id = p supplying a 2,001 floor and a D14.1 method with method_id = p registered afterwards —
read literally, adding the method REMOVED the source incarnation (record stale, D14.1 supplies another bound);
read as {kind, producer_id}, both coexist and the RECORD phase still governs (rig183 T1) → producer_key = {kind,
producer_id}; registration_instance_id is allocated monotonically and without reuse PER producer_key; at most
ONE PRESENT incarnation per producer_key, and adding one removes only the prior incarnation of the SAME
producer_key; current_submission_route_id[source_id] selects the unique PRESENT {AUTHORITATIVE_SOURCE,
source_id} incarnation; every incarnation / cardinality defect parameter names the producer_key (§D14-C registry,
§D14-F P0a, §E; v1.7.36 sheet lines 3044–3046, 3065–3068, 3151 and 3820–3824); (2) [High] the fixed-schedule envelope and the
late serialized exact selection did not compose — the envelope waits for nothing, but exact-versus-envelope was
selected only after the prerequisite: a request authorized at arrival whose group had not committed by the
deadline released nothing (authorized) and had no exact result; a revocation then won the serialized race, the
CAS restarted and the request became a refused miss — a late envelope breaks the schedule and exposes the race,
an envelope at the original deadline needs foresight, both is two responses, and blocking the revocation is a
fourth unstated behaviour (rig183 T2) → ONE CLOSED PROTOCOL: every request has ONE terminal response state,
PENDING → EXACT_RELEASED | ENVELOPE_RELEASED; an exact response may win BEFORE the fixed deadline only when its
completion prerequisite is complete AND direct_replay_response_authorized is TRUE at its serialized release
point; AT THE DEADLINE every still-PENDING request atomically becomes ENVELOPE_RELEASED, whatever the reason an
exact response is unavailable — recovery, an uncommitted group, a pending refusal decision, a lost race, or an
unauthorized principal; once ENVELOPE_RELEASED no exact response is ever sent for that request, and an
authorized source retrieves the completed result by REPLAY under the ordinary rule; so an unauthorized request
always receives exactly one envelope at the fixed time, and an authorized-but-slow request receives the SAME
envelope at the same time without making recovery, the commit or the race observable; "an authorized principal
receives the exact result" is now CONDITIONAL on readiness before the deadline (the alternative — an
authorization reservation that makes revocation wait for an eventual exact hand-off — was NOT adopted; a
revocation never waits on an unfinished response) (§D14-C, §E; v1.7.36 sheet lines 2662–2681, 3809 and 3829–3832); (3) [Medium]
REGISTRATION_PRESENCE_MISSING_OR_INVALID was unreachable under the literal validation domain — "every test …
ranges ONLY over PRESENT incarnations" filtered an entry with no presence out BEFORE any test could see it, so a
filter-first reducer returned an EMPTY, non-defective registry while a structure-first one emitted the defect
(rig183 T3: rig182 T3 still had two textual results) → REGISTRY VALIDATION IN THREE STAGES: stage 1, over EVERY
raw entry of the current registry, validates the route identity, the registration_instance_id and
registration_presence and emits the structural defects (ROUTE_IDENTITY_MALFORMED, ROUTE_IDENTITY_COLLISION,
REGISTRATION_PRESENCE_MISSING_OR_INVALID); stage 2 forms the WORKING producer registry from the validated
entries whose presence is PRESENT; stage 3 runs the active, phase, dependency and cardinality tests over that
PRESENT set only; REMOVED history participates only in identity / non-reuse validation, never in P0a membership
or an active cardinality; PRESENT_INCARNATION_CARDINALITY {producer_key, count} joins the closed enum (§D14-F
P0a; v1.7.36 sheet lines 3125–3137 and 3826–3828); (4) [Medium] the current METHOD_DERIVATION EMISSION identity still spelled
the superseded three-field route identity — r1 removed and r2 re-registered under the same producer, feed
version, phase and class differ by registration_instance_id under the general rule yet the explicit emission
identity aliased them, so a candidate identity, diagnostics, membership or an identity-keyed cache could reuse one
identifier across exactly the reincarnation v1.34 separated (rig183 T4) → {kind: EMISSION, route_identity:
{kind, producer_id, registration_version, registration_instance_id}, emitting_phase, class_id}; every explicit
route tuple, sorting key, active-route record and identity-keyed cache carries the quadruple, abstract
"route identity" references inherit it, and the v1.23 entry's "the only key anywhere" triple is marked
SUPERSEDED; the route stamp stays OUT of the source-authored content commitment — that exclusion is intentional
and unchanged (§D14-C; v1.7.36 sheet lines 2532–2534 and 1471). The v1.34 entry's "per producer_id" cardinality and the
v1.33 entry's "an authorized principal receives an exact response" are marked SUPERSEDED in place (v1.7.36 sheet
lines 859 and 950). A pre-delivery adversarial read (rig183 X1–X3) shaped the wording: the deadline is measured from
ARRIVAL by the declared release interval and is the same clock for every request of the source; an
EXACT_RELEASED request whose group later proves incomplete is impossible (its prerequisite was completion); the
athlete client's sync is unaffected by the response state — it carries stored results whenever they exist.

"""
rep("CHANGES v1.33 → v1.34 (Sol's appendix pass 33 — rig181 T1 / T2 / T3 / T4 CLOSED on their witnesses, the row and", NEW + "CHANGES v1.33 → v1.34 (Sol's appendix pass 33 — rig181 T1 / T2 / T3 / T4 CLOSED on their witnesses, the row and")

# ---- (1) producer_key in the route identity + incarnations ----
rep("""  registration_instance_id — an IMMUTABLE, authority-issued, monotone, NEVER-REUSED number per producer_id,
  issued at every registration of any kind (rig182 T2:""",
"""  registration_instance_id — an IMMUTABLE, authority-issued, monotone, NEVER-REUSED number per producer_key =
  {kind, producer_id} (rig183 T1: a bare producer_id let a D14.1 method whose id equalled a source's id remove
  that source's incarnation), issued at every registration of any kind (rig182 T2:""")
rep("""  false → true is the ONLY same-incarnation reactivation; the registry keeps AT MOST ONE PRESENT incarnation
  per producer_id (a registration mutation that adds one removes the prior one in the same atomic mutation),
  and current_submission_route_id[source_id] — that PRESENT incarnation, or none — is the TOTAL selector the
  credential, new_submission_authorized and the expected registry tuple bind to; a content replay retains its""",
"""  false → true is the ONLY same-incarnation reactivation; the registry keeps AT MOST ONE PRESENT incarnation
  per producer_key = {kind, producer_id} (a registration mutation that adds one removes only the prior
  incarnation of the SAME producer_key in the same atomic mutation; a source and a D14.1 method that happen to
  share an id are two producer_keys and coexist), and current_submission_route_id[source_id] — the unique
  PRESENT {AUTHORITATIVE_SOURCE, source_id} incarnation, or none — is the TOTAL selector the
  credential, new_submission_authorized and the expected registry tuple bind to; a content replay retains its""")

# ---- (2) the one-terminal-response protocol ----
rep("""  retry instruction — RELEASED ON A FIXED SCHEDULE from arrival that does not wait for the lookups or
  recovery (those proceed internally), so a transport hit, a content hit, a recovery-then-hit, a verified miss
  and an unverifiable miss are ONE observable class; what remains observable is the DECLARED LEAKAGE
  INVENTORY of §E and nothing about hit, miss, disposition or recovery; the authenticated athlete client
  receives any EXISTING or RECOVERED stored result through sync, and a refused miss creates no receipt or
  stored result and adds nothing to sync.""",
"""  retry instruction — RELEASED AT A FIXED DEADLINE, the declared release interval measured from arrival on
  one clock for every request of the source, that does not wait for the lookups or recovery (those proceed
  internally), so a transport hit, a content hit, a recovery-then-hit, a verified miss and an unverifiable
  miss are ONE observable class; what remains observable is the DECLARED LEAKAGE INVENTORY of §E and nothing
  about hit, miss, disposition or recovery. THE RESPONSE PROTOCOL, one closed rule for authorized and
  unauthorized alike (rig183 T2: an envelope that waits for nothing and an exact selection that waits for its
  prerequisite did not compose — a request authorized at arrival whose group had not committed by the
  deadline, then displaced by a revocation, had four candidate behaviours): every request has ONE terminal
  response state, PENDING → EXACT_RELEASED | ENVELOPE_RELEASED; an exact response may win BEFORE the deadline
  only when its completion prerequisite (above) is complete AND direct_replay_response_authorized is TRUE at
  its serialized release step; AT THE DEADLINE every still-PENDING request atomically becomes
  ENVELOPE_RELEASED, whatever the reason an exact response is unavailable — recovery in progress, a group not
  yet committed, a refusal decision not yet serialized, a lost race with a registry mutation, or an
  unauthorized principal; once ENVELOPE_RELEASED no exact response is ever sent for that request, and an
  authorized source retrieves the completed result by REPLAY under the ordinary rule; so an unauthorized
  request always receives exactly one envelope at the fixed time, an authorized-but-slow request receives the
  SAME envelope at the same time, and a revocation never waits on an unfinished response; "an authorized
  principal receives the exact result" holds only for a result ready before the deadline; the authenticated
  athlete client receives any EXISTING or RECOVERED stored result through sync whatever the response state,
  and a refused miss creates no receipt or stored result and adds nothing to sync.""")
rep("""  revocation completes only after that hand-off; if the mutation wins, the reply is the envelope; queued exact
  replies are drained before the mutation completes or cancelled and replaced by the envelope — so a completed
  removal or revocation is never followed by an exact response under the displaced epoch; WHEN FALSE the""",
"""  revocation completes only after that hand-off; if the mutation wins, the reply is the envelope; queued exact
  replies are drained before the mutation completes or cancelled and replaced by the envelope, and a still
  PENDING request at its deadline becomes ENVELOPE_RELEASED (the RESPONSE PROTOCOL, below) — so a completed
  removal or revocation is never followed by an exact response under the displaced epoch; WHEN FALSE the""")

# ---- (3) three-stage validation + PRESENT_INCARNATION_CARDINALITY ----
rep("""  registry_state alike) — EVERY test below, P0a membership, each phase / cardinality defect and "any
  registration exists" alike, ranges ONLY over PRESENT incarnations (rig182 T3: a retained REMOVED D14.1
  incarnation counted toward D14_1_ACTIVE_CARDINALITY): ROUTE_IDENTITY_MALFORMED {position} ·
  ROUTE_IDENTITY_COLLISION {identity} · REGISTRATION_PRESENCE_MISSING_OR_INVALID {identity | position} (a
  registration whose registration_presence is absent or not PRESENT | REMOVED — rig182 T3: one reducer
  included it, another excluded it, a third had no code to reject it) · ACTIVE_FLAG_MISSING {identity} (on a
  PRESENT incarnation only — active is inapplicable when REMOVED) · PHASES_EMPTY {identity} ·""",
"""  registry_state alike) — VALIDATED IN THREE STAGES (rig182 T3: a retained REMOVED D14.1 incarnation counted
  toward D14_1_ACTIVE_CARDINALITY; rig183 T3: "every test ranges only over PRESENT incarnations" let a
  filter-first reducer drop an entry with no presence before any test saw it and return an EMPTY, defect-free
  registry): STAGE 1, over EVERY raw entry of the current registry, validates the route identity, the
  registration_instance_id (well-formed, never reused within its producer_key, REMOVED history included) and
  registration_presence, emitting the STRUCTURAL defects — ROUTE_IDENTITY_MALFORMED {position} ·
  ROUTE_IDENTITY_COLLISION {identity} · REGISTRATION_PRESENCE_MISSING_OR_INVALID {identity | position} (a
  registration whose registration_presence is absent or not PRESENT | REMOVED — rig182 T3: one reducer
  included it, another excluded it, a third had no code to reject it); STAGE 2 forms the WORKING producer
  registry from the validated entries whose presence is PRESENT; STAGE 3 runs every test below — active, phase,
  dependency and cardinality, P0a membership and "any registration exists" — over that PRESENT set only,
  REMOVED history taking part in no P0a membership and no active cardinality: PRESENT_INCARNATION_CARDINALITY
  {producer_key, count} (> 1 PRESENT incarnation of one producer_key) · ACTIVE_FLAG_MISSING {identity} (on a
  PRESENT incarnation only — active is inapplicable when REMOVED) · PHASES_EMPTY {identity} ·""")
rep("""  operation to correct either, rig171 U3) · DUPLICATE_ACTIVE_PRODUCER_PHASE {producer_id, phase}; the REGISTRY""",
"""  operation to correct either, rig171 U3) · DUPLICATE_ACTIVE_PRODUCER_PHASE {producer_key, phase}; the REGISTRY""")

# ---- (4) the emission identity ----
rep("""| {kind: EMISSION, route identity (kind, producer_id, registration version), emitting phase,
  class_id} for a standing emission,""",
"""| {kind: EMISSION, route_identity: the QUADRUPLE {kind, producer_id, registration_version,
  registration_instance_id} (rig183 T4: the three-field spelling aliased a removed incarnation and its
  same-version successor), emitting_phase,
  class_id} for a standing emission,""")

# ---- §E ----
rep("""  carries an authority-issued never-reused registration_instance_id, PRESENT → REMOVED is terminal,
  re-registration is a fresh incarnation, at most one PRESENT incarnation per producer,
  current_submission_route_id[source_id] the total selector, active false → true the only same-incarnation
  reactivation; the closed defect enum gains REGISTRATION_PRESENCE_MISSING_OR_INVALID and every registry test
  ranges over PRESENT incarnations; missing or malformed credential_state, epoch, cutoff or current-route
  state fails every authorization predicate closed; the AXES""",
"""  carries an authority-issued never-reused registration_instance_id allocated per producer_key = {kind,
  producer_id}, PRESENT → REMOVED is terminal, re-registration is a fresh incarnation, at most one PRESENT
  incarnation per producer_key (adding one removes only the prior of the same producer_key),
  current_submission_route_id[source_id] = the unique PRESENT {AUTHORITATIVE_SOURCE, source_id} incarnation,
  active false → true the only same-incarnation reactivation; the EMISSION candidate identity and every
  explicit route tuple, sorting key, active-route record and identity-keyed cache carry the quadruple; the
  registry is validated in THREE STAGES (structural defects over every raw entry, then the PRESENT working
  set, then the active / phase / dependency / cardinality tests over it) and the closed defect enum gains
  REGISTRATION_PRESENCE_MISSING_OR_INVALID and PRESENT_INCARNATION_CARDINALITY {producer_key, count}; the
  RESPONSE PROTOCOL: one terminal state per request, PENDING → EXACT_RELEASED | ENVELOPE_RELEASED, an exact
  response only when ready and authorized at its serialized step before the fixed deadline, every request
  still PENDING at the deadline atomically ENVELOPE_RELEASED, no exact response ever after an envelope, the
  completed result retrievable by replay; missing or malformed credential_state, epoch, cutoff or
  current-route state fails every authorization predicate closed; the AXES""")
rep("""  fixed schedule from arrival independent of the lookups and recovery; the DECLARED LEAKAGE INVENTORY: the
  endpoint's existence and TLS acceptance, the fact of being unauthorized, network jitter below the release
  interval — never hit, miss, disposition or recovery; LINEARIZATION:""",
"""  fixed deadline from arrival independent of the lookups and recovery; the DECLARED LEAKAGE INVENTORY: the
  endpoint's existence and TLS acceptance, the fact that no exact result was released before the deadline
  (an unauthorized principal, or an authorized one whose result was not ready), network jitter below the
  release interval — never hit, miss, disposition or recovery; LINEARIZATION:""")

# ---- SUPERSEDED marks ----
rep("""a REGISTRATION has a ROUTE IDENTITY (kind, producer_id, registration version) — the only key anywhere — and""",
"""a REGISTRATION has a ROUTE IDENTITY (kind, producer_id, registration version) — the only key anywhere (SUPERSEDED
in v1.34 / v1.35: the key is the QUADRUPLE with registration_instance_id, allocated per producer_key) — and""")
rep("""acceptance, the fact of being unauthorized (an authorized principal receives an exact response), network jitter""",
"""acceptance, the fact of being unauthorized (an authorized principal receives an exact response — SUPERSEDED in
v1.35: only when its result is ready before the fixed deadline), network jitter""")
rep("""current_submission_route_id[source_id] — the PRESENT incarnation of that source with the greatest instance id,
of which the registry keeps AT MOST ONE — is the TOTAL selector the credential, new_submission_authorized and""",
"""current_submission_route_id[source_id] — the PRESENT incarnation of that source with the greatest instance id,
of which the registry keeps AT MOST ONE (SUPERSEDED in v1.35: per producer_key = {kind, producer_id}, the
selector being the unique PRESENT {AUTHORITATIVE_SOURCE, source_id} incarnation) — is the TOTAL selector the credential, new_submission_authorized and""")

out = src
for o, n in edits: out = out.replace(o, n, 1)
open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.36.txt', 'w', encoding='utf-8').write(out)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"
print("edits", len(edits), "lines", len(L), "bytes", len(out.encode()))
