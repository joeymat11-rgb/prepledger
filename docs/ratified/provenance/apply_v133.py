src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.33.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
edits = []
def rep(old, new):
    n = src.count(old); assert n == 1, f"found {n}: {old[:100]!r}"
    edits.append((old, new))

# ---- title ----
rep("EARNED — RUNTIME SHEET v1.7.33 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.32 (Sol pass 31 applied, rig180: ",
    "EARNED — RUNTIME SHEET v1.7.34 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.33 (Sol pass 32 applied, rig181: a third predicate new_submission_authorized — a historical credential can never admit NEW content, even after re-registration; registry mutations and ingestion-group commits SERIALIZE per (athlete, source) with compare-and-append on the door's expected registry tuple, so no receipt ever exceeds the signed cutoff that terminates its credential epoch; the registry is ORTHOGONAL AXES — registration_presence, active, credential_state, current_credential_epoch, global_registry_epoch — with ONE ruled effect: revocation alone stops submissions and disclosure and never reinterprets accepted evidence; ONE normalized unauthorized response envelope on a fixed release schedule + a declared leakage inventory; earlier in v1.32, pass 31, rig180: ")

# ---- header ----
rep("APPENDIX v1.32 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 31: rig179 T1–T3 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; three findings (1 High, 2 Medium) applied in v1.32 — the content-replay lookup ahead of the door, replay-result authorization, the RESULT CONTRACT's replay-identity wording and one more historical clause; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.33 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 32: rig180 T1–T3 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four findings (3 High, 1 Medium) applied in v1.33 — new_submission_authorized, per-source linearization of the door, group commit and signed cutoff, orthogonal registry axes with one ruled revocation effect, the normalized unauthorized response envelope; no frozen row is CHANGED · bounded audit continues on the appendix only")

# ---- CHANGES entry ----
NEW = """CHANGES v1.32 → v1.33 (Sol's appendix pass 32 — rig180 T1 / T2 / T3 CLOSED on their witnesses, the row and
precedence still RATIFIED, no runtime-sheet reopening; four findings, every one executed in rig181; the sheet
stays closed): (1) [High] a HISTORICAL credential could still admit NEW content — the door tested a replay miss
only against the CURRENT registration's presence and phases, never against whether the presented credential
belonged to that registration or its epoch: S registered at epoch e1 with credential C1, removed or revoked,
re-registered at e2 as r2; C1 submits new verified content missing both lookups → the door saw r2 with RECORD
and ADMITTED it, stamped r2 (current at once) while C1 was told nothing (rig181 T1) → a THIRD predicate,
new_submission_authorized: the presented credential is bound to this athlete and source AND credential_state =
CURRENT AND its credential epoch = current_credential_epoch[source_id] AND it is bound to the current
registration / route version AND registration_presence = PRESENT AND declared_phases contains RECORD (active may
be either value, preserving the ruled ability of a paused-but-connected source to submit evidence that stays
non-current until reactivated); after both lookups miss, FALSE means REFUSED — no receipt, stub, route stamp,
identity consumption or ingestion group — and a historically verified but unauthorized principal receives only
the generic envelope (§D14-C, §E; v1.7.34 sheet lines 2503–2514 and 3616–3618); (2) [High] the door, the group commit and
the signed cutoff were NOT LINEARIZED — atomicity gave all-or-nothing receipts but not that the registry state
read at the door still held when the group committed, and recovery covered only already-durable groups, not an
in-flight submission past the door: sequence length 10 under e1, R passes the door, removal wins concurrently,
finds no pending group, records cutoff 10 and advances to e2, then R commits receipt 11 on its stale decision
(rig181 T2: a receipt beyond the cutoff that terminates e1, fitting neither serialization) → registry mutations
and ingestion-group commits SERIALIZE per (athlete, source); the door captures an EXPECTED SOURCE-REGISTRY TUPLE
{registration_presence, registration version, credential_state, current_credential_epoch, declared_phases}; the
atomic group commits ONLY by compare-and-append while that tuple still matches; a mismatch restarts recovery
and both lookups under the new state and a remaining miss re-evaluates new_submission_authorized; if ingestion
wins, the later removal / revocation cutoff INCLUDES the group's last_receipt; if the mutation wins, the old
credential's miss stores nothing; exact-result disclosure is re-checked against the current credential epoch
immediately before release (or serialized in the same transaction) — a completed removal / revocation is never
followed by an exact response under the displaced epoch; INVARIANT: no submission authorized only by credential
epoch e ever receives a receipt greater than the signed cutoff that terminates e (§D14-C, §D14-G, §E; v1.7.34
sheet lines 2532–2545, 3351–3356 and 3629); (3) [High] REVOKED was not mapped to the registration-currency model — every
currentness reader tests whether the stamped registration is ACTIVE (a required mutable boolean), and v1.32
introduced ACTIVE / INACTIVE / REMOVED / REVOKED as "registry states" without relating them to that boolean or
to registry membership, so one active=true registration whose credential is revoked read three ways: evidence
keeps governing, or REGISTRATION_NOT_CURRENT, or the route removed (rig181 T3: 2,001 vs ABSTAIN vs route gone)
→ ORTHOGONAL AXES, each a named field: registration_presence = PRESENT | REMOVED; registration.active = true |
false, defined only while PRESENT; credential_state = CURRENT | REVOKED, per source principal;
current_credential_epoch[source_id]; global_registry_epoch (§D14-G's counter) — the two epochs are distinct
fields never compared to each other; ONE DEFINITION of REGISTRATION-CURRENT, read by every reader ("ACTIVE"
wherever this appendix tests a stamped registration): registration_presence = PRESENT AND active = true, the
credential axis playing no part; THE RULED EFFECT: new submission and direct response require PRESENT + CURRENT
credential + current epoch, active either value; reducer currentness requires PRESENT + active = true;
credential revocation ALONE prevents new submissions and disclosure and never silently reinterprets accepted
evidence; when revocation is also meant to stop using that evidence, the SAME atomic registry mutation sets
active = false or removes the registration, which is the ordinary registry-epoch, re-issue and
REGISTRATION_NOT_CURRENT path; removal means PRESENT = false; a credential rotation (old REVOKED, new CURRENT at
the next epoch) changes no evidence (cowork's adoption of the clean separation; the owner may rule a different
revocation effect — one is now stated) (§D14-C registry, §D14-G, §E; v1.7.34 sheet lines 2900–2920, 3351–3356 and 3632); (4)
[Medium] "same bytes" did not complete the non-oracular contract — an unauthorized principal's five branches
(transport hit, content hit, recovery-then-hit, verified miss, unverifiable miss) could still differ in status,
headers, length, connection, retry instruction and above all timing, recovery making timing branch-dependent
(rig181 T4: three observable classes) → option A adopted: ONE normalized UNAUTHORIZED RESPONSE ENVELOPE — fixed
status, fixed header set, fixed body padded to a fixed length, the same connection close, no retry
instruction — released on a FIXED SCHEDULE from arrival that does not wait for the lookups or recovery (they
proceed internally, serialized per (athlete, source)), so no branch changes any observable of the envelope or
its release time; a DECLARED LEAKAGE INVENTORY in §E names what remains — the endpoint's existence and TLS
acceptance, the fact of being unauthorized (an authorized principal receives an exact response), network jitter
below the release interval — and nothing about hit, miss, disposition or recovery; and the sync consequence is
corrected: the athlete client receives any EXISTING or RECOVERED stored result through sync; a refused replay
miss creates no receipt or stored result and adds nothing to sync (§D14-C, §E; v1.7.34 sheet lines 2520–2532, 2657, 3622 and 3634).
The v1.32 entry's "two registry states with one authorization effect" and "the same bytes" are marked SUPERSEDED
in place (v1.7.34 sheet lines 872). A pre-delivery adversarial read (rig181 X1–X3) shaped the wording: an
INACTIVE source's exact responses continue (PRESENT + CURRENT credential); the expected tuple excludes the
active boolean deliberately, so a pause during an in-flight commit does not refuse it (the item lands
non-current); the authorized path's exact response is released only after its group commits, so an authorized
principal never learns a receipt the cutoff could later exclude.

"""
rep("CHANGES v1.31 → v1.32 (Sol's appendix pass 31 — rig179 T1 / T2 / T3 CLOSED on their witnesses, the row and", NEW + "CHANGES v1.31 → v1.32 (Sol's appendix pass 31 — rig179 T1 / T2 / T3 CLOSED on their witnesses, the row and")

# ---- (1)(2)(4) the door: new_submission_authorized, linearization, envelope ----
rep("""  the same way. WHAT THE SOURCE IS TOLD is a second, closed predicate — direct_replay_response_authorized
  (rig180 T2: "a hit returns the prior result whatever the registry now says" let a removed or compromised
  connector holding its old credential read receipts and dispositions and probe hit / miss for ever): TRUE iff
  the presented credential's CREDENTIAL EPOCH is the registry's current epoch for that source AND the
  registration is ACTIVE or INACTIVE (a pause is the athlete's, not a revocation); FALSE for a REMOVED or
  REVOKED registration and for any credential below the source's SIGNED CUTOFF; when TRUE the source receives
  the exact receipt and disposition (a hit's original, a miss's new one, or the refusal); when FALSE the
  lookups and recovery still run internally and the source receives ONE GENERIC RESPONSE — the same bytes for
  a hit, a miss and a refused miss — while the authenticated athlete client obtains the stored result through
  sync; routine REMOVAL and security REVOCATION are two registry states with one authorization effect, each
  advancing the source's credential epoch and recording a signed cutoff {source_id, credential_epoch, the
  sequence length at that moment}; re-registration issues a new epoch, so an old credential stays historical;
  every ADMITTED submission has a TRANSPORT""",
"""  the same way. THREE PREDICATES govern a submission's principal, over the registry's ORTHOGONAL AXES (below:
  registration_presence, active, credential_state, current_credential_epoch[source_id]): (i)
  historical_principal_verified — the credential authenticates against the source's registration history;
  it permits the INTERNAL lookups and recovery, nothing more; (ii) new_submission_authorized (rig181 T1: a
  door that tested only the CURRENT registration's presence and phases admitted a removed-then-re-registered
  source's OLD credential's new content, stamped it under the new route — current at once — and told the
  attacker nothing) — TRUE iff the presented credential is bound to this athlete and this source AND
  credential_state = CURRENT AND its credential epoch = current_credential_epoch[source_id] AND it is bound to
  the CURRENT registration / route version AND registration_presence = PRESENT AND declared_phases contains
  RECORD, active being EITHER value (a paused-but-connected source may submit evidence that stays non-current
  until reactivated, rig172 Y3); after both lookups miss, FALSE means REFUSED — no receipt, no stub, no route
  stamp, no identity consumed, no ingestion group; (iii) direct_replay_response_authorized (rig180 T2: "a hit
  returns the prior result whatever the registry now says" let a removed or compromised connector holding its
  old credential read receipts and dispositions and probe hit / miss for ever) — TRUE iff the credential is
  bound to this athlete and source AND credential_state = CURRENT AND its epoch = current_credential_epoch AND
  registration_presence = PRESENT, active either value (a pause is the athlete's, not a revocation); FALSE for
  a REMOVED registration, a REVOKED credential and any credential below the source's SIGNED CUTOFF. WHEN (iii)
  IS TRUE the source receives the exact receipt and disposition (a hit's original, a miss's new one, or the
  refusal), released only AFTER the group commits and RE-CHECKED against the current credential epoch
  immediately before release (or serialized in the same transaction) — a completed removal or revocation is
  never followed by an exact response under the displaced epoch; WHEN FALSE the lookups and recovery still run
  internally and the source receives the UNAUTHORIZED RESPONSE ENVELOPE (rig181 T4: "the same bytes" still
  left status, length and recovery-dependent timing to tell the branches apart): ONE normalized response —
  a fixed status, a fixed header set, a fixed body padded to a fixed length, the same connection close, no
  retry instruction — RELEASED ON A FIXED SCHEDULE from arrival that does not wait for the lookups or
  recovery (those proceed internally), so a transport hit, a content hit, a recovery-then-hit, a verified miss
  and an unverifiable miss are ONE observable class; what remains observable is the DECLARED LEAKAGE
  INVENTORY of §E and nothing about hit, miss, disposition or recovery; the authenticated athlete client
  receives any EXISTING or RECOVERED stored result through sync, and a refused miss creates no receipt or
  stored result and adds nothing to sync. LINEARIZATION (rig181 T2: sequence length 10 under epoch e1, R past
  the door, a concurrent removal found no pending group, recorded cutoff 10 and advanced to e2, then R
  committed receipt 11 on its stale door decision — a receipt beyond the cutoff that terminates e1): registry
  mutations and ingestion-group commits SERIALIZE per (athlete, source); the door captures an EXPECTED
  SOURCE-REGISTRY TUPLE {registration_presence, registration version, credential_state,
  current_credential_epoch, declared_phases} (the active boolean deliberately excluded — a pause during an
  in-flight commit lands the item non-current, never refuses it); the atomic ingestion group commits ONLY by
  compare-and-append while that tuple still matches the registry; a mismatch restarts recovery and both
  lookups under the new state, and a remaining miss re-evaluates new_submission_authorized; if ingestion wins,
  the later removal or revocation's signed cutoff INCLUDES the group's last_receipt; if the mutation wins, the
  old credential's miss stores nothing; INVARIANT: no submission authorized only by credential epoch e ever
  receives a receipt greater than the signed cutoff that terminates e; every removal, revocation, rotation or
  re-registration advances current_credential_epoch[source_id] and records a signed cutoff {source_id,
  credential_epoch, the sequence length at that moment}, so an old credential stays historical;
  every ADMITTED submission has a TRANSPORT""")

# ---- (2) recovery passage: sync consequence ----
rep("""  group); where direct_replay_response_authorized (above) is false, recovery still completes internally, the
  source receives the generic response, and the authenticated athlete client obtains the result through sync;
  a receipt is""",
"""  group); where direct_replay_response_authorized (above) is false, recovery still completes internally, the
  source receives the unauthorized response envelope, and the authenticated athlete client obtains any
  existing or recovered stored result through sync (a refused miss adds nothing);
  a receipt is""")

# ---- (3) the registry axes + one currentness definition ----
rep("""  of no key: active (a boolean, required on EVERY kind — the one mutable field, and flipping it changes no
  identity), declared_phases ⊆ {RECORD, SOURCE_EMISSION, METHOD_EMISSION} (a source supplies records, or""",
"""  of no key: active (a boolean, required on EVERY kind — the one mutable field of the registration's content,
  and flipping it changes no
  identity), declared_phases ⊆ {RECORD, SOURCE_EMISSION, METHOD_EMISSION} (a source supplies records, or""")
rep("""  feed version, so it is part of no key and changes only with the version); an ACTIVE ROUTE — what active_producer_map binds — is a route identity plus the ONE phase of""",
"""  feed version, so it is part of no key and changes only with the version). THE REGISTRY'S AXES ARE
  ORTHOGONAL, each a named field (rig181 T3: "REVOKED" as a registry state with no relation to the active
  boolean read three ways — evidence still governing, REGISTRATION_NOT_CURRENT, or the route gone):
  registration_presence = PRESENT | REMOVED (a REMOVED registration leaves the P0a list but keeps its route
  identity, its history, its sequence and its frontier, §D14-C); registration.active = true | false, defined
  only while PRESENT; credential_state = CURRENT | REVOKED, a property of each SOURCE PRINCIPAL's credential,
  never of the route identity; current_credential_epoch[source_id], advanced by every removal, revocation,
  rotation or re-registration; and global_registry_epoch, §D14-G's counter — the two epochs are distinct
  fields and are NEVER compared to each other. ONE DEFINITION OF REGISTRATION-CURRENT, read by every reader —
  step (2)'s currency test, the zero-proof rule's REGISTRATION_NOT_CURRENT, the LINEAGE RULE's stamped
  registration, a withdrawal's currentness, component_scope_current's member stamps and P1's PHASE RULE —
  "ACTIVE", wherever this appendix tests a stamped registration, means registration_presence = PRESENT AND
  active = true; the credential axis plays NO part in currentness. THE RULED EFFECT of each axis: new
  submission and direct response (§D14-C) require PRESENT + a CURRENT credential at the current epoch, active
  either value; reducer currentness requires PRESENT + active = true; a credential REVOCATION alone (a
  compromise response, or the old credential of a rotation) prevents new submissions and disclosure and never
  silently reinterprets evidence already accepted — when the athlete or design also means to stop USING that
  evidence, the SAME atomic registry mutation sets active = false or removes the registration, which is the
  ordinary registry-epoch, re-issue and REGISTRATION_NOT_CURRENT path; removal means registration_presence =
  REMOVED; a rotation (old credential REVOKED, new CURRENT at the next epoch) changes no evidence (cowork's
  adoption of the clean separation; the owner may rule a different revocation effect — one is now stated);
  an ACTIVE ROUTE — what active_producer_map binds — is a route identity plus the ONE phase of""")

# ---- (2)(3) §D14-G epoch ----
rep("""  an authority counter incremented by every change to the registry's canonical encoding: a registration ADDED,
  REMOVED or REVOKED, a credential-epoch change or signed cutoff, an active flag, declared_phases,
  input_domain_set or dependency-function edit (a removal flips""",
"""  the global_registry_epoch of §D14-C's axes, an authority counter incremented by every change to the
  registry's canonical encoding: a registration ADDED or REMOVED, a credential_state change, a
  current_credential_epoch advance or signed cutoff, an active flag, declared_phases,
  input_domain_set or dependency-function edit — distinct from every source's current_credential_epoch and
  never compared to it; registry mutations and ingestion-group commits serialize per (athlete, source), the
  group committing only by compare-and-append on the door's expected registry tuple (§D14-C) (a removal flips""")

# ---- §E ----
rep("""  stamped with the immutable route identity it arrived under before the identity test, an authenticated
  principal's transport-exact AND verified-content replay lookups and authority-owned group recovery precede
  the current-registration door (historical_principal_verified: a removed or revoked registration's principal
  stays authenticatable for the internal lookups; direct_replay_response_authorized — current credential
  epoch, ACTIVE or INACTIVE — decides whether the source is told the result or receives the generic response;
  REMOVED and REVOKED registry states with credential epochs and signed cutoffs), a content replay never
  receives a new route stamp, nothing NEW is stored from an unregistered
  source or under a""",
"""  stamped with the immutable route identity it arrived under before the identity test, an authenticated
  principal's transport-exact AND verified-content replay lookups and authority-owned group recovery precede
  the current-registration door (THREE PREDICATES over the registry's orthogonal axes —
  historical_principal_verified: internal lookups and recovery only; new_submission_authorized: a credential
  bound to this athlete and source, CURRENT, at current_credential_epoch[source_id], bound to the current
  registration version, registration PRESENT with RECORD declared, active either value — false after both
  lookups miss means REFUSED with nothing created; direct_replay_response_authorized: bound, CURRENT, current
  epoch, PRESENT — decides whether the source is told the exact result or receives the UNAUTHORIZED RESPONSE
  ENVELOPE, one normalized status / header set / padded body / connection close / no retry, released on a
  fixed schedule from arrival independent of the lookups and recovery; the DECLARED LEAKAGE INVENTORY: the
  endpoint's existence and TLS acceptance, the fact of being unauthorized, network jitter below the release
  interval — never hit, miss, disposition or recovery; exact-result disclosure re-checked against the current
  credential epoch immediately before release; LINEARIZATION: registry mutations and ingestion-group commits
  serialize per (athlete, source), the group committing only by compare-and-append on the door's expected
  tuple {presence, registration version, credential_state, current_credential_epoch, declared_phases}, a
  mismatch restarting recovery and both lookups, an ingestion that wins included in the later cutoff, a
  mutation that wins storing nothing — no receipt ever above the cutoff that terminates its epoch; the AXES
  registration_presence, active, credential_state, current_credential_epoch[source_id] and
  global_registry_epoch as distinct fields with the one ruled effect of §D14-C), a content replay never
  receives a new route stamp, sync carrying only existing or recovered stored results (a refused miss adds
  nothing), nothing NEW is stored from an unregistered
  source or under a""")

# ---- SUPERSEDED marks in the v1.32 entry ----
rep("""sync; routine REMOVAL and security REVOCATION are two registry states with one authorization effect, each
advancing the credential epoch and recording a signed cutoff {source_id, credential_epoch, sequence length};
re-registration issues a new epoch, so an old credential stays historical (§D14-C, §D14-G, §E; v1.7.33 sheet""",
"""sync; routine REMOVAL and security REVOCATION are two registry states with one authorization effect, each
advancing the credential epoch and recording a signed cutoff {source_id, credential_epoch, sequence length};
re-registration issues a new epoch, so an old credential stays historical (SUPERSEDED in v1.33: orthogonal
axes — registration_presence and credential_state are separate fields with one ruled effect each; "the same
bytes" is replaced by the normalized unauthorized response envelope on a fixed release schedule; sync carries
existing or recovered results only) (§D14-C, §D14-G, §E; v1.7.33 sheet""")

out = src
for o, n in edits: out = out.replace(o, n, 1)
open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.34.txt', 'w', encoding='utf-8').write(out)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"
print("edits", len(edits), "lines", len(L), "bytes", len(out.encode()))
