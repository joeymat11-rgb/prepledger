# Split: appendix v1.35 (sheet v1.7.36) → appendix v1.36 (sheet v1.7.37) + SOURCE INGESTION PROTOCOL v1.0
import re
src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.36.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
L36 = src.split('\n')
def lines(a, b): return '\n'.join(L36[a-1:b])          # inclusive 1-based
edits = []; moved = []                                     # moved: (label, text) verbatim blocks that must appear in the protocol
def rep(old, new, move=None):
    n = src.count(old); assert n == 1, f"found {n}: {old[:90]!r}"
    edits.append((old, new))
    if move: moved.append((move, old))

# ---------------- title / header ----------------
rep("EARNED — RUNTIME SHEET v1.7.36 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.35 (Sol pass 34 applied, rig183: ",
    "EARNED — RUNTIME SHEET v1.7.37 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.36 (OWNER RULING 2026-09-03, the SPLIT: the source-ingestion SECURITY PROTOCOL — principals and their three predicates, credential state / epoch / cutoff, the credential door, disclosure, the response protocol and envelope, the leakage inventory, the linearization of release — moves VERBATIM out of this appendix into EARNED-SOURCE-INGESTION-PROTOCOL v1.0 (blueprint-side, its own audit); the appendix keeps everything the reducer reads and ONE obligation: the admitted set is the Protocol's, every rule here holds for whatever set it admits; no rule changed; earlier in v1.35, pass 34, rig183: ")
rep("APPENDIX v1.35 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 34: rig182 T1 and T2 CLOSED, T3 / T4 closed on their implementation witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four findings (2 High, 2 Medium) applied in v1.35 — producer_key, the one-terminal-response protocol, three-stage registry validation, the quadruple in the emission identity; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.36 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol passes 26–34 applied through v1.35; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED · v1.36 = the OWNER-RULED SPLIT: the source-ingestion security protocol extracted verbatim into EARNED-SOURCE-INGESTION-PROTOCOL v1.0, the appendix keeping what the reducer reads plus one obligation; NO RULE CHANGED, no frozen row CHANGED · the appendix is submitted for CONFIRMATION; the Protocol opens its own bounded audit")

# ---------------- CHANGES entry ----------------
NEW = """CHANGES v1.35 → v1.36 (OWNER RULING, Joe, 2026-09-03 — "Go" on the SPLIT; no Sol pass between v1.35 and
v1.36; NO RULE IS CHANGED): everything Sol raised from pass 31 onward is a SOURCE-INGESTION SECURITY PROTOCOL —
who may write, what a connector is told, how a revocation races a write — and belongs beside the
server-authoritative sync design in the BLUEPRINT, with its own audit, not inside a protein-and-floor policy
appendix that no design decision depends on. The layering is the one already ratified: the frozen sheet does not
depend on this appendix, and this appendix does not depend on the Protocol. WHAT MOVED, VERBATIM, into
EARNED-SOURCE-INGESTION-PROTOCOL v1.0 (delivered with this file as Part 2): the THREE PREDICATES of a
submission's principal (historical_principal_verified, new_submission_authorized,
direct_replay_response_authorized) with the credential axis (credential_state, current_credential_epoch,
signed cutoffs, the credential's binding to current_submission_route_id); the disclosure rule, the UNAUTHORIZED
RESPONSE ENVELOPE and the RESPONSE PROTOCOL (PENDING → EXACT_RELEASED | ENVELOPE_RELEASED); the DECLARED LEAKAGE
INVENTORY; the LINEARIZATION of exact-response release and no-commit refusal decisions with registry mutations
and group commits, the expected-registry-tuple compare-and-append and the cutoff INVARIANT; the ruled effect of
revocation on submissions and disclosure; the §E obligations stating those (v1.7.36 sheet lines 2624–2696,
2712–2713, 2809–2811, 3072–3075, 3079–3087, 3531–3538, 3776–3781, 3798–3835 and 3873–3880 — every moved
sentence appears byte-for-byte in the Protocol, checked by the split script). WHAT STAYS, because the reducer
reads it: the ingestion ORDER and every rule about what is stored — transport and content identities, the
replay split, verification that only reports, shape validation, the route stamp, the identity / collision test,
components, retirement_effective and component_scope_current, the reference-effect matrix, the LINEAGE RULE,
atomic ingestion groups and authority-owned recovery, the receipt sequence and the §D14-G frontier and
registry epoch; the REGISTRY MODEL — incarnations, the quadruple route identity, producer_key, registration
presence, the active boolean, current_submission_route_id, the three validation stages, the closed defect enum,
the ONE definition of registration-current — and the ruled effect of revocation on EVIDENCE (a credential
revocation alone never reinterprets evidence already accepted; stopping the evidence is the ordinary
active = false / removal path). THE ONE OBLIGATION each way: the appendix states that the ADMITTED SET is
produced by the Protocol's door and that every rule here holds for whatever set it admits (its determinism —
"ingestion is a FUNCTION of the admitted submission set" — is proven here, independent of who may submit); the
Protocol states that it admits into THIS appendix's ingestion order and registry model and changes no
disposition, identity, currentness or reduction rule. Where a moved sentence left a hole, the appendix now says
"the Protocol's" and names the item (v1.7.37 sheet lines 2647, 2653, 2659–2676, 2692, 2789, 3053, 3059, 3513, 3758, 3777–3797 and 3835–3842). The CHANGES entries v1.31 → v1.35 stay here as
history, with their SUPERSEDED marks, and are copied verbatim into the Protocol's PROVENANCE so nothing Sol
ratified is lost in either document. Sol is asked for TWO verdicts in one reply: the appendix
(CONFIRM / OBJECT — its rules are unchanged since v1.35) and the Protocol (bounded pass 1).

"""
rep("CHANGES v1.34 → v1.35 (Sol's appendix pass 34 — rig182 T1 and T2 CLOSED, T3 and T4 closed on their", NEW + "CHANGES v1.34 → v1.35 (Sol's appendix pass 34 — rig182 T1 and T2 CLOSED, T3 and T4 closed on their")

# ---------------- §D14-C: the door passage keeps the ORDER, references the Protocol ----------------
rep("""  transport and registry state): the authority first AUTHENTICATES the submission's SOURCE PRINCIPAL against
  that source's registration HISTORY — historical_principal_verified (a removed or revoked registration's
  principal stays authenticatable — the sequence is never dropped, below — and this predicate permits the
  INTERNAL lookups and recovery, nothing more); then authority-owned GROUP RECOVERY (below); then the""",
"""  transport and registry state): the authority first AUTHENTICATES the submission's SOURCE PRINCIPAL against
  that source's registration HISTORY — the SOURCE INGESTION PROTOCOL's historical_principal_verified (a
  removed or revoked registration's principal stays authenticatable — the sequence is never dropped, below —
  and this predicate permits the INTERNAL lookups and recovery, nothing more); then authority-owned GROUP
  RECOVERY (below); then the""")
rep("""  CURRENT-REGISTRATION DOOR as NEW content — the door IS new_submission_authorized (below), evaluated over
  the presented credential and current_submission_route_id[source_id]; a miss it refuses is REFUSED AT THE""",
"""  CURRENT-REGISTRATION DOOR as NEW content — the door IS the Protocol's new_submission_authorized, evaluated
  over the presented credential and current_submission_route_id[source_id]; a miss it refuses is REFUSED AT THE""")

# ---------------- §D14-C: the moved block (predicates, disclosure, envelope, response protocol, linearization) ----------------
BLOCK_B = lines(2624, 2696)
assert BLOCK_B.startswith("  the same way. THREE PREDICATES") and BLOCK_B.endswith("so an old credential stays historical;")
rep(BLOCK_B,
"""  the same way. THE OBLIGATION (owner ruling 2026-09-03, the split): the ADMITTED SET — which submissions pass
  the door, what a source is told, and how a response races a registry mutation — is produced by the SOURCE
  INGESTION PROTOCOL, a separate blueprint-side document with its own audit; it defines the three predicates
  of a submission's principal (historical_principal_verified, new_submission_authorized,
  direct_replay_response_authorized), the credential axis (credential_state, current_credential_epoch, signed
  cutoffs), the unauthorized response envelope, the response protocol, the leakage inventory and the
  linearization of response release; EVERY rule in this appendix holds for whatever set the Protocol admits —
  ingestion here is a FUNCTION of the admitted submission set (rig173 A2, A4; rig175 C1–C3), independent of
  who may submit; the Protocol changes no disposition, identity, currentness or reduction rule. What this
  appendix still requires of the door, because the reducer's determinism depends on it: registry mutations
  and ingestion-group commits SERIALIZE per (athlete, source); the door captures the Protocol's EXPECTED
  SOURCE-REGISTRY TUPLE (which names registration_presence, the registration_instance_id of
  current_submission_route_id and declared_phases beside the credential fields, and deliberately excludes
  the active boolean — a pause during an in-flight commit lands the item non-current, never refuses it); the
  atomic ingestion group commits ONLY by compare-and-append while that tuple still matches the registry; a
  mismatch restarts recovery and both lookups under the new state, and a remaining miss re-evaluates the door;
  a refused miss creates no receipt or stored result and adds nothing to sync; the authenticated athlete
  client receives any EXISTING or RECOVERED stored result through sync whatever the source was told;""",
    move="P1–P3 predicates, disclosure, envelope, response protocol, linearization")

# ---------------- the gloss ----------------
rep("""  ORIGINAL receipt and the identity's current disposition — to the source only when
  direct_replay_response_authorized, to the athlete's client always through sync — and stores nothing new (rig173 A4: dedup""",
"""  ORIGINAL receipt and the identity's current disposition — disclosure to the source being the Protocol's,
  the athlete's client learning it always through sync — and stores nothing new (rig173 A4: dedup""",
    move="gloss disclosure")

# ---------------- recovery passage ----------------
rep("""  group); where direct_replay_response_authorized (above) is false, recovery still completes internally, the
  source receives the unauthorized response envelope, and the authenticated athlete client obtains any
  existing or recovered stored result through sync (a refused miss adds nothing);""",
"""  group); whatever the source is told (the Protocol's), recovery still completes internally and the
  authenticated athlete client obtains any existing or recovered stored result through sync (a refused miss
  adds nothing);""",
    move="recovery disclosure")

# ---------------- registry axes: the credential axis and the submission/disclosure effect move ----------------
rep("""  only while PRESENT; credential_state = CURRENT | REVOKED, a property of each SOURCE PRINCIPAL's credential,
  never of the route identity; current_credential_epoch[source_id], advanced by every removal, revocation,
  rotation or re-registration; and global_registry_epoch, §D14-G's counter — the two epochs are distinct
  fields and are NEVER compared to each other. ONE DEFINITION OF REGISTRATION-CURRENT, read by every reader —""",
"""  only while PRESENT; the CREDENTIAL AXIS — credential_state = CURRENT | REVOKED per source principal and
  current_credential_epoch[source_id] — is DEFINED BY THE PROTOCOL and is a property of a principal's
  credential, never of the route identity; global_registry_epoch is §D14-G's counter, a distinct field NEVER
  compared to any credential epoch. ONE DEFINITION OF REGISTRATION-CURRENT, read by every reader —""",
    move="credential axis")
rep("""  active = true; the credential axis plays NO part in currentness. THE RULED EFFECT of each axis: new
  submission and direct response (§D14-C) require PRESENT + a CURRENT credential at the current epoch, active
  either value; reducer currentness requires PRESENT + active = true; a credential REVOCATION alone (a
  compromise response, or the old credential of a rotation) prevents new submissions and disclosure and never
  silently reinterprets evidence already accepted — when the athlete or design also means to stop USING that""",
"""  active = true; the credential axis plays NO part in currentness. THE RULED EFFECT on evidence (the effect on
  submissions and disclosure is the Protocol's): reducer currentness requires PRESENT + active = true; a
  credential REVOCATION alone (a
  compromise response, or the old credential of a rotation) never
  silently reinterprets evidence already accepted — when the athlete or design also means to stop USING that""",
    move="ruled effect on submissions/disclosure")

# ---------------- §D14-G epoch ----------------
rep("""  the global_registry_epoch of §D14-C's axes, an authority counter incremented by every change to the
  registry's canonical encoding: a registration ADDED or REMOVED, a credential_state change, a
  current_credential_epoch advance or signed cutoff, an active flag, declared_phases,
  input_domain_set or dependency-function edit — distinct from every source's current_credential_epoch and
  never compared to it; registry mutations, ingestion-group commits, no-commit refusal decisions and
  exact-response releases serialize per (athlete, source), the group committing only by compare-and-append on
  the door's expected registry tuple and a release selecting exact versus envelope at its own serialized step
  (§D14-C) (a removal flips""",
"""  the global_registry_epoch of §D14-C's axes, an authority counter incremented by every change to the
  registry's canonical encoding: a registration ADDED or REMOVED, an active flag, declared_phases,
  input_domain_set or dependency-function edit, and every credential-axis change the Protocol defines
  (credential_state, credential epoch, cutoff) — distinct from every source's credential epoch and never
  compared to it; registry mutations and ingestion-group commits serialize per (athlete, source), the group
  committing only by compare-and-append on the Protocol's expected registry tuple (§D14-C; the Protocol's
  response-release steps join the same serialized order) (a removal flips""",
    move="§D14-G serialization")

# ---------------- §E ----------------
rep("""  replay — a hit on either returns the holder's prior result internally, disclosed to the source only when
  direct_replay_response_authorized; a NEW submission, a miss on both, from an unregistered source or a
  registration lacking RECORD is refused at the door and consumes nothing; every ADMITTED submission has a""",
"""  replay — a hit on either returns the holder's prior result internally, disclosed to the source as the
  SOURCE INGESTION PROTOCOL rules; a NEW submission, a miss on both, that the Protocol's door refuses consumes
  nothing; every ADMITTED submission has a""",
    move="§E replay rule")
BLOCK_H = lines(3798, 3835)
assert BLOCK_H.startswith("  the current-registration door (THREE PREDICATES") and BLOCK_H.endswith("global_registry_epoch as distinct fields with the one ruled effect of §D14-C), a content replay never")
rep(BLOCK_H,
"""  the current-registration door (the SOURCE INGESTION PROTOCOL — a separate blueprint-side document with its
  own bounded audit — defines the door predicate new_submission_authorized, historical_principal_verified,
  direct_replay_response_authorized, the credential axis with its epochs and signed cutoffs, the unauthorized
  response envelope, the response protocol, the declared leakage inventory and the linearization of response
  release; this appendix's obligation is that every rule here holds for whatever set the Protocol admits, and
  the Protocol's is that it admits into this order and this registry model and changes no disposition,
  identity, currentness or reduction rule; REGISTRATION INCARNATIONS: the route identity
  carries an authority-issued never-reused registration_instance_id allocated per producer_key = {kind,
  producer_id}, PRESENT → REMOVED is terminal, re-registration is a fresh incarnation, at most one PRESENT
  incarnation per producer_key (adding one removes only the prior of the same producer_key),
  current_submission_route_id[source_id] = the unique PRESENT {AUTHORITATIVE_SOURCE, source_id} incarnation,
  active false → true the only same-incarnation reactivation; the EMISSION candidate identity and every
  explicit route tuple, sorting key, active-route record and identity-keyed cache carry the quadruple; the
  registry is validated in THREE STAGES (structural defects over every raw entry, then the PRESENT working
  set, then the active / phase / dependency / cardinality tests over it) and the closed defect enum gains
  REGISTRATION_PRESENCE_MISSING_OR_INVALID and PRESENT_INCARNATION_CARDINALITY {producer_key, count};
  LINEARIZATION as this appendix needs it: registry mutations and ingestion-group commits serialize per
  (athlete, source), the group committing only by compare-and-append on the Protocol's expected tuple, a
  mismatch restarting recovery and both lookups; the AXES registration_presence, active and
  global_registry_epoch as distinct fields, the credential axis the Protocol's, with the one ruled effect on
  evidence of §D14-C), a content replay never""",
    move="§E predicates / envelope / protocol / linearization")
rep("""  staging rule needs; INGESTION ORDER — principal authentication against the registration history, then
  authority-owned pending-group recovery, then transport-exact replay where the submission digest is already
  admitted, then verification that only REPORTS (VERIFIED | UNVERIFIABLE, committing nothing), then the
  verified content replay (NOT_APPLICABLE for UNVERIFIABLE — a miss), then — for every miss —
  new_submission_authorized as the door (false: REFUSED with no durable state; true: the transport-keyed
  rejection-stub group for UNVERIFIABLE, else on), then ingestion-shape validation (which alone decides
  whether a submission consumes its source_item_id), then the route stamp, then the identity test, then the
  serialized exact-response release; the closed""",
"""  staging rule needs; INGESTION ORDER — the Protocol's principal authentication against the registration
  history, then authority-owned pending-group recovery, then transport-exact replay where the submission
  digest is already admitted, then verification that only REPORTS (VERIFIED | UNVERIFIABLE, committing
  nothing), then the verified content replay (NOT_APPLICABLE for UNVERIFIABLE — a miss), then — for every
  miss — the Protocol's door (false: REFUSED with no durable state; true: the transport-keyed rejection-stub
  group for UNVERIFIABLE, else on), then ingestion-shape validation (which alone decides whether a submission
  consumes its source_item_id), then the route stamp, then the identity test, then the Protocol's serialized
  response release; the closed""",
    move="§E ingestion order")

# ---------------- two remaining bare references → pointers ----------------
rep("""  MISS to the door, where new_submission_authorized TRUE yields the transport-keyed REJECTION STUB group and""",
"""  MISS to the door, where the Protocol's new_submission_authorized TRUE yields the transport-keyed REJECTION STUB group and""")
rep("""  credential, new_submission_authorized and the expected registry tuple bind to; a content replay retains its""",
"""  Protocol's credential, door predicate and expected registry tuple bind to; a content replay retains its""")

out = src
for o, n in edits: out = out.replace(o, n, 1)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"

# ---------------- the Protocol document ----------------
def hist_entries(text):
    i = text.index("CHANGES v1.34 → v1.35 (Sol's appendix pass 34"); j = text.index("CHANGES v1.29 → v1.30 (Sol's appendix pass 29")
    return text[i:j].rstrip('\n')
provenance = hist_entries(src)     # v1.31…v1.35 entries verbatim from the appendix as it stood (v1.7.36)
assert provenance.count("CHANGES v1.3") == 5

P = []
P.append("EARNED — SOURCE INGESTION PROTOCOL v1.0 · EXTRACTED 2026-09-03 by owner ruling from RUNTIME SHEET v1.7.36 / appendix v1.35 · blueprint-side · its own bounded audit (Sol: bounded pass 1) · every normative sentence below is VERBATIM the appendix text Sol audited in passes 31–34 (rigs 180–183); nothing is rewritten, only relocated and headed")
P.append("=" * 110)
P.append("""SCOPE. This document governs the ADMITTED SET of source submissions for the D14 floor policy's source ingestion:
which submissions pass the door, what a source is told, and how a response races a registry mutation. It sits
beside the server-authoritative sync design of the blueprint (Sol's strategy audit P1–P19). It changes NO
disposition, identity, currentness or reduction rule: those live in the RUNTIME SHEET's appendix §D14-C / §D14-F /
§D14-G, whose ingestion order (principal authentication → recovery → transport-exact replay → verification that
only reports → verified content replay → the door → shape validation → route stamp → identity test), registry
model (incarnations, the quadruple route identity, producer_key, registration presence, the active boolean,
current_submission_route_id, three-stage validation, the closed defect enum, the one definition of
registration-current) and evidence rules are the model this Protocol admits into. THE OBLIGATION each way: the
appendix holds for whatever set this Protocol admits (its determinism — ingestion is a FUNCTION of the admitted
submission set — is proven there, independent of who may submit); this Protocol admits into that order and that
registry model and nothing else. References to "below", "above", "§D14-C", "§D14-G" and "§E" inside the verbatim
blocks keep their original meaning: "below / above" refer to the appendix passage each block was cut from, cited
by v1.7.36 line numbers in each heading. Terms used here and defined in the appendix: transport identity, content
identity, replay lookups, verification (VERIFIED | UNVERIFIABLE), ingestion group, receipt sequence, signed
cutoff's "sequence length", registration incarnation, registration_instance_id, producer_key,
current_submission_route_id, registration_presence, active, global_registry_epoch.
""")
P.append("§P1 · THE THREE PREDICATES OF A SUBMISSION'S PRINCIPAL, DISCLOSURE, THE UNAUTHORIZED RESPONSE ENVELOPE, THE RESPONSE PROTOCOL AND THE LINEARIZATION OF RELEASE — verbatim from appendix §D14-C (v1.7.36 sheet lines 2624–2696; the first two words \"the same way.\" close the appendix's preceding sentence \"a submission whose principal authenticates against no registration, present or past, is refused the same way\")")
P.append(BLOCK_B)
P.append("")
P.append("§P2 · THE CREDENTIAL AXIS AND THE RULED EFFECT OF REVOCATION ON SUBMISSIONS AND DISCLOSURE — verbatim from the appendix's registry passage (v1.7.36 sheet lines 3072–3075 and 3079–3087)")
P.append(lines(3072, 3075))
P.append(lines(3079, 3087))
P.append("")
P.append("§P3 · WHAT THE APPENDIX'S REPLAY GLOSS, RECOVERY RULE AND §D14-G EPOCH SAID ABOUT DISCLOSURE AND THE SERIALIZED ORDER — verbatim (v1.7.36 sheet lines 2712–2713, 2809–2811, 3531–3538)")
P.append(lines(2712, 2713)); P.append(lines(2809, 2811)); P.append(lines(3531, 3538))
P.append("")
P.append("§P4 · THE §E BLUEPRINT OBLIGATIONS THAT STATE THIS PROTOCOL — verbatim (v1.7.36 sheet lines 3776–3781, 3798–3835, 3873–3880)")
P.append(lines(3776, 3781)); P.append(lines(3798, 3835)); P.append(lines(3873, 3880))
P.append("")
P.append("""§P5 · THE DECLARED LEAKAGE INVENTORY, stated once (from §P1 and §P4): the endpoint's existence and TLS acceptance;
the fact that no exact result was released before the fixed deadline (an unauthorized principal, or an
authorized one whose result was not ready); network jitter below the release interval — never hit, miss,
disposition or recovery.

§P6 · OWNER-VISIBLE RULES INSIDE THIS PROTOCOL (Joe may rule either differently; each is stated so an
implementation has one behaviour): (a) a credential REVOCATION alone stops new submissions and disclosure and
never reinterprets evidence already accepted — stopping the evidence is the appendix's ordinary active = false /
removal path (cowork's adoption of the clean separation, v1.33); (b) an authorized-but-slow request receives the
same envelope as an unauthorized one at the fixed deadline and learns its result by replay — a revocation never
waits on an unfinished response (Sol's recommended protocol adopted, the authorization-reservation alternative
rejected, v1.35).

§P7 · EXECUTED WITNESSES carried with this text: rig180 (T1 replay partition, T2 oracle, T3 contract alias),
rig181 (T1 historical credential admits new content, T2 door / commit / cutoff interleavings, T3 revocation vs
currentness, T4 one observable response class), rig182 (T1 stub before the door, T2 incarnation revival, T3
presence defect, T4 release vs revocation), rig183 (T1 producer_key, T2 fixed deadline vs late selection, T3
filter-first validation, T4 emission identity) — files rig180.cjs … rig183.cjs with logs, /tmp/rig174.

CHANGES v1.0 (2026-09-03, owner ruling — the split): created by extracting the blocks above VERBATIM from appendix
v1.35 (sheet v1.7.36); the appendix became v1.36 (sheet v1.7.37) with the holes filled by pointer sentences and
ONE obligation; the split script asserts every moved sentence appears byte-for-byte here. Open questions for
bounded pass 1 are Sol's; cowork's own read of the cut: (X1) §P1's "below" for registration_instance_id and
"(above)" for the completion prerequisite refer to appendix text and to §P1 itself respectively — both cited;
(X2) the appendix's door passage now names the Protocol's predicates by name so an implementer of either
document finds the other; (X3) the §D14-G epoch still counts credential-axis changes so the appendix's coverage
predicate pauses application across a revocation exactly as before.

PROVENANCE — the appendix CHANGES entries from v1.30 → v1.31 through v1.34 → v1.35 (Sol passes 30–34), copied verbatim from sheet v1.7.36; items
that concern the appendix's own evidence rules remain the appendix's, the SUPERSEDED marks are as they stand there:
""")
P.append(provenance)
P.append("")
P.append("SOURCES: the RUNTIME SHEET v1.7.37 (appendix v1.36) and its SOURCES section; Sol's bounded appendix passes 30–34; rigs 179–183.")
protocol = '\n'.join(P) + '\n'

# every moved block must appear verbatim in the Protocol
for label, text in moved:
    core = text if label.startswith("P1") or label.startswith("§E predicates") else None
for label, text in moved:
    if label in ("P1–P3 predicates, disclosure, envelope, response protocol, linearization", "§E predicates / envelope / protocol / linearization"):
        assert text in protocol, "moved block missing: " + label
for a, b in [(2712, 2713), (2809, 2811), (3072, 3075), (3079, 3087), (3531, 3538), (3776, 3781), (3873, 3880)]:
    assert lines(a, b) in protocol, f"lines {a}-{b} missing from the Protocol"

open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.37.txt', 'w', encoding='utf-8').write(out)
open('/home/claude/sheet/EARNED-SOURCE-INGESTION-PROTOCOL-v1.0.txt', 'w', encoding='utf-8').write(protocol)
print("appendix edits", len(edits), "lines", len(L), "bytes", len(out.encode()), "| protocol lines", protocol.count('\n'), "bytes", len(protocol.encode()))
