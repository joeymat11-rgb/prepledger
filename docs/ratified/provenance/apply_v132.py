src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.32.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
edits = []
def rep(old, new):
    n = src.count(old); assert n == 1, f"found {n}: {old[:100]!r}"
    edits.append((old, new))

# ---- title ----
rep("EARNED — RUNTIME SHEET v1.7.32 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.31 (Sol pass 30 applied, rig179: ",
    "EARNED — RUNTIME SHEET v1.7.33 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.32 (Sol pass 31 applied, rig180: BOTH replay lookups — transport-exact and verified content — precede the current-registration door, so one content identity answers the same in every transport and registry state; a content replay never gets a new route stamp; historical_principal_verified (internal lookup + recovery) is separated from direct_replay_response_authorized (disclosure) — a REMOVED or REVOKED principal gets one generic non-oracular response, the athlete's client learns the result by sync; the RESULT CONTRACT keys SOURCE_ITEM_UNREADABLE by the applicable replay identity; earlier in v1.31, pass 30, rig179: ")

# ---- header ----
rep("APPENDIX v1.31 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 30: rig178 T1, T2 and T4 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; three findings (2 High, 1 Medium) applied in v1.31 — authority-owned group recovery ahead of the registration door, the route stamp on every identity-consuming submission, the selector's REQUEST_MISMATCH row and the last unmarked historical clauses; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.32 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 31: rig179 T1–T3 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; three findings (1 High, 2 Medium) applied in v1.32 — the content-replay lookup ahead of the door, replay-result authorization, the RESULT CONTRACT's replay-identity wording and one more historical clause; no frozen row is CHANGED · bounded audit continues on the appendix only")

# ---- CHANGES entry ----
NEW = """CHANGES v1.31 → v1.32 (Sol's appendix pass 31 — rig179 T1 / T2 / T3 CLOSED on their witnesses, the row and
precedence still RATIFIED, no runtime-sheet reopening; three findings, every one executed in rig180; the sheet
stays closed): (1) [High] the CONTENT-identity replay still sat BEHIND the current-registration door — the v1.31
order was transport replay → door on a miss → verification → content replay, which partitions ONE content
identity by its transport representation: R stored under content identity I = {x, c} and transport T1, S removed;
an exact T1 retry → R's original result; the same verified content under another legal transport T2 → a transport
miss, REFUSED at the door before verification could reach the content lookup; the same T2 while S is current →
R's original result (rig180 T1: ORIGINAL / REFUSED / ORIGINAL for one content identity, against the declared
single ingestion state shared by a content identity and every transport identity carrying it) → THE ORDER IS
NOW: principal-history authentication → authority-owned pending-group recovery → transport-exact replay lookup →
VERIFICATION sufficient to derive a content identity → verified content-replay lookup → ONLY IF BOTH LOOKUPS
MISS, the current-registration / phase door for NEW content → ingestion-shape validation → route stamp →
identity test; an unverifiable transport miss is REFUSED WITHOUT A STUB for a source with no current
registration and is a transport-keyed rejection stub for a currently admitted source; a content replay NEVER
receives a new route stamp — a source that wants equivalent content current under a newly registered route
submits it under a NEW source_item_id (§D14-C, §E; v1.7.33 sheet lines 2418–2435, 2471–2484, 3469–3473 and 3531–3536); (2) [Medium]
historical principal authentication defined no REPLAY-RESULT AUTHORIZATION — "a replay hit returns the prior result
whatever the registry now says" let a removed or compromised connector holding its old credential read receipts
and dispositions and probe hit / miss indefinitely, while "where the former source can no longer receive
responses" read as the opposite (rig180 T2) → TWO PREDICATES: historical_principal_verified (the credential
authenticates against the source's registration history — permits the internal replay lookup and recovery,
nothing more) and direct_replay_response_authorized (a CLOSED rule: true iff the presented credential's
CREDENTIAL EPOCH is the registry's current epoch for that source AND the registration is ACTIVE or INACTIVE;
false for REMOVED, for REVOKED and for any credential below the source's SIGNED CUTOFF); when disclosure is
unauthorized recovery still completes, the source receives ONE generic non-oracular response — identical for a
hit, a miss and a refused miss — and only the authenticated athlete client obtains the stored result through
sync; routine REMOVAL and security REVOCATION are two registry states with one authorization effect, each
advancing the credential epoch and recording a signed cutoff {source_id, credential_epoch, sequence length};
re-registration issues a new epoch, so an old credential stays historical (§D14-C, §D14-G, §E; v1.7.33 sheet
lines 2435–2446, 2557–2558, 3229–3230 and 3490–3495); (3) [Medium] two superseded summaries remained — the RESULT CONTRACT
described SOURCE_ITEM_UNREADABLE's keyed_replay_identity_commitment as "a keyed content identity, never the
receipt", impossible for an unverifiable submission, which has no content identity under the split-replay rule,
and re-creating the claimed-{id, commitment} alias rig178 T1 closed (rig180 T3: the stub's ledger identity equalled
the stored record's) → "a per-athlete, per-source, domain-separated keyed commitment to the APPLICABLE replay
identity — the verified content identity for a verified shape stub, otherwise the content-bound transport
identity — never a receipt"; and the v1.25 entry's "an answer's unknown request id turns into a stub by one
decidable test" is marked SUPERSEDED (WAITING_FOR_SOURCE_ITEM, then a receipted INERT {NO_SUCH_REQUEST}
resolution) — the v1.31 entry's "returns the immutable prior result whatever the registry now says" and its
"only a replay MISS meets the door" are marked the same way (§D14-B RESULT CONTRACT; v1.7.33 sheet lines 2089–2092,
1114, 839 and 878). A pre-delivery adversarial read (rig180 X1–X3) shaped the wording: the generic response is the SAME
bytes for every unauthorized outcome (a refused miss included) so the refusal itself is not an oracle; an
INACTIVE registration's connector keeps receiving exact results (a pause is the athlete's, not a revocation);
the §D14-G epoch list now names REVOKED and a credential-epoch change as registry changes.

"""
rep("CHANGES v1.30 → v1.31 (Sol's appendix pass 30 — rig178 T1 / T2 / T4 CLOSED on their witnesses, the row and", NEW + "CHANGES v1.30 → v1.31 (Sol's appendix pass 30 — rig178 T1 / T2 / T4 CLOSED on their witnesses, the row and")

# ---- (1)+(2) the door ----
rep("""  ONE REPLAY RULE per source. THE ORDER AT THE DOOR (rig179 T1: a door that tested the CURRENT registration
  before any replay lookup refused a removed source's retry of a submission whose group was durably incomplete,
  so the group could never be recovered and blocked that source for ever): the authority first AUTHENTICATES
  the submission's SOURCE PRINCIPAL against that source's registration HISTORY (a removed registration's
  principal stays authenticatable — the sequence is never dropped, below); an authenticated submission then
  goes to the TRANSPORT-EXACT replay lookup, with authority-owned GROUP RECOVERY (below), BEFORE the
  current-registration door — a replay HIT returns the immutable prior result whatever the registry now says;
  only a replay MISS is tested as NEW content against the CURRENT registration and its declared phases, and a
  miss from a source with no current registration, or under a registration whose declared_phases lacks RECORD,
  is REFUSED AT THE DOOR — not ingested, no receipt, no stub, no identity consumed — and may be submitted again
  once registered; a submission whose principal authenticates against no registration, present or past, is
  refused the same way; every ADMITTED submission has a TRANSPORT""",
"""  ONE REPLAY RULE per source. THE ORDER AT THE DOOR (rig179 T1: a door that tested the CURRENT registration
  before any replay lookup refused a removed source's retry of a submission whose group was durably incomplete,
  so the group could never be recovered and blocked that source for ever; rig180 T1: a door placed after the
  transport lookup but BEFORE the content lookup answered one content identity ORIGINAL / REFUSED / ORIGINAL by
  transport and registry state): the authority first AUTHENTICATES the submission's SOURCE PRINCIPAL against
  that source's registration HISTORY — historical_principal_verified (a removed or revoked registration's
  principal stays authenticatable — the sequence is never dropped, below — and this predicate permits the
  INTERNAL lookups and recovery, nothing more); then authority-owned GROUP RECOVERY (below); then the
  TRANSPORT-EXACT replay lookup; then VERIFICATION of the submitted content, enough to derive its content
  identity; then the VERIFIED CONTENT replay lookup; ONLY WHEN BOTH LOOKUPS MISS does the submission meet the
  CURRENT-REGISTRATION DOOR as NEW content — tested against the current registration and its declared phases;
  a miss from a source with no current registration, or under a registration whose declared_phases lacks
  RECORD, is REFUSED AT THE DOOR — not ingested, no receipt, no stub, no identity consumed — and may be
  submitted again once registered (an UNVERIFIABLE transport miss is refused the same way, without a stub,
  when no current registration exists, and is a transport-keyed rejection stub only for a currently admitted
  source — one with a current registration whose declared_phases includes RECORD); a submission whose
  principal authenticates against no registration, present or past, is refused
  the same way. WHAT THE SOURCE IS TOLD is a second, closed predicate — direct_replay_response_authorized
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
  every ADMITTED submission has a TRANSPORT""")

# ---- (1) the split-replay passage ----
rep("""  DIFFERENT bytes as a STORED replay in one order and as a stub in the other): REPLAY IS SPLIT — FIRST a
  TRANSPORT-EXACT replay: the same content-bound transport identity (the canonical submission digest, above)
  as an earlier admitted submission returns
  that submission's receipt and disposition, a stub's included (an exact re-send of a rejected submission
  replays its stub); THEN VERIFICATION of the submitted canonical content — an item with no id, no commitment,
  or a commitment that does not equal the recomputed digest → a REJECTION STUB under its transport identity,
  never a collision member and never a content replay (a claimed commitment is never trusted before the bytes
  behind it verify); THEN the VERIFIED CONTENT replay — the same content identity {source_item_id, verified
  commitment} as an earlier verified submission → that submission's original receipt and disposition, whatever
  it is (STORED, COLLISION_MEMBER or a shape stub alike; nothing stored, nothing re-tested); THEN
  INGESTION-SHAPE VALIDATION, which decides whether the""",
"""  DIFFERENT bytes as a STORED replay in one order and as a stub in the other): REPLAY IS SPLIT — FIRST a
  TRANSPORT-EXACT replay: the same content-bound transport identity (the canonical submission digest, above)
  as an earlier admitted submission returns
  that submission's receipt and disposition, a stub's included (an exact re-send of a rejected submission
  replays its stub); THEN VERIFICATION of the submitted canonical content — an item with no id, no commitment,
  or a commitment that does not equal the recomputed digest → for a currently admitted source a REJECTION
  STUB under its transport identity, never a collision member and never a content replay (a claimed
  commitment is never trusted before the bytes behind it verify), and for a source with no current
  registration a REFUSAL without a stub; THEN the VERIFIED CONTENT replay — the same content identity
  {source_item_id, verified commitment} as an earlier verified submission → that submission's original
  receipt and disposition, whatever it is (STORED, COLLISION_MEMBER or a shape stub alike; nothing stored,
  nothing re-tested, and NO new route stamp — the holder keeps the stamp it arrived under; a source that wants
  equivalent content current under a newly registered route submits it under a NEW source_item_id); THEN —
  only when both lookups missed — the CURRENT-REGISTRATION DOOR (above) for NEW content; THEN
  INGESTION-SHAPE VALIDATION, which decides whether the""")

# ---- (2) the recovery passage ----
rep("""  group); where the former source can no longer receive responses, recovery still completes internally and the
  authenticated athlete client obtains the result through sync; a receipt is""",
"""  group); where direct_replay_response_authorized (above) is false, recovery still completes internally, the
  source receives the generic response, and the authenticated athlete client obtains the result through sync;
  a receipt is""")

# ---- (2) §D14-G epoch list ----
rep("""  an authority counter incremented by every change to the registry's canonical encoding: a registration ADDED
  or REMOVED, an active flag, declared_phases, input_domain_set or dependency-function edit (a removal flips""",
"""  an authority counter incremented by every change to the registry's canonical encoding: a registration ADDED,
  REMOVED or REVOKED, a credential-epoch change or signed cutoff, an active flag, declared_phases,
  input_domain_set or dependency-function edit (a removal flips""")

# ---- (3) RESULT CONTRACT ----
rep("""  claimed_scope_target, reason: REJECTED_AT_INGESTION} — a keyed content identity, never the receipt (rig177
  S6);""",
"""  claimed_scope_target, reason: REJECTED_AT_INGESTION} — a per-athlete, per-source, domain-separated keyed
  commitment to the APPLICABLE replay identity: the verified content identity for a verified shape stub,
  otherwise the content-bound transport identity — never a receipt (rig177 S6; rig180 T3: "a keyed content
  identity" for an unverifiable submission aliased the stored record's identity);""")

# ---- §E ----
rep("""  RULE (v1.25 / v1.27 / v1.31: a submission is first authenticated against its source's registration history
  and looked up as a transport-exact replay — a hit returns the prior result whatever the registry now says;
  a NEW submission, a replay miss, from an unregistered source or a registration lacking RECORD is refused at
  the door and consumes nothing; every ADMITTED submission has a TRANSPORT identity always and a CONTENT""",
"""  RULE (v1.25 / v1.27 / v1.31 / v1.32: a submission is first authenticated against its source's registration
  history, recovered, looked up as a transport-exact replay, verified and looked up as a verified content
  replay — a hit on either returns the holder's prior result internally, disclosed to the source only when
  direct_replay_response_authorized; a NEW submission, a miss on both, from an unregistered source or a
  registration lacking RECORD is refused at the door and consumes nothing; every ADMITTED submission has a
  TRANSPORT identity always and a CONTENT""")
rep("""  stamped with the immutable route identity it arrived under before the identity test, an authenticated
  principal's transport-exact replay lookup and authority-owned group recovery precede the current-registration
  door (a removed registration's principal stays authenticatable), nothing NEW is stored from an unregistered
  source or under a""",
"""  stamped with the immutable route identity it arrived under before the identity test, an authenticated
  principal's transport-exact AND verified-content replay lookups and authority-owned group recovery precede
  the current-registration door (historical_principal_verified: a removed or revoked registration's principal
  stays authenticatable for the internal lookups; direct_replay_response_authorized — current credential
  epoch, ACTIVE or INACTIVE — decides whether the source is told the result or receives the generic response;
  REMOVED and REVOKED registry states with credential epochs and signed cutoffs), a content replay never
  receives a new route stamp, nothing NEW is stored from an unregistered
  source or under a""")
rep("""  staging rule needs; INGESTION ORDER — principal authentication against the registration history, then
  transport-exact replay where the submission digest is already admitted (with recovery), then the
  current-registration door for a miss, then verification, then the verified content replay, then
  ingestion-shape validation (which alone decides whether a submission consumes its source_item_id), then the
  route stamp, then the identity test; the closed""",
"""  staging rule needs; INGESTION ORDER — principal authentication against the registration history, then
  authority-owned pending-group recovery, then transport-exact replay where the submission digest is already
  admitted, then verification sufficient to derive a content identity, then the verified content replay, then
  — only when both lookups miss — the current-registration / phase door for NEW content, then ingestion-shape
  validation (which alone decides whether a submission consumes its source_item_id), then the route stamp,
  then the identity test; the closed""")

# ---- SUPERSEDED marks ----
rep("""source card, never silent; an answer's unknown request id turns into a stub by one decidable test (an id at or
below the source's receipt high-water mark naming no stored request); step (1)'s lookup treats an unresolved""",
"""source card, never silent; an answer's unknown request id turns into a stub by one decidable test (an id at or
below the source's receipt high-water mark naming no stored request) (SUPERSEDED in v1.28: the answer is
WAITING_FOR_SOURCE_ITEM and the decidable test yields a receipted INERT {NO_SUCH_REQUEST} resolution, never a
stub); step (1)'s lookup treats an unresolved""")
rep("""replay lookup with recovery → only a replay MISS meets the CURRENT-registration door and its declared phases; a
replay hit returns the immutable prior result whatever the registry now says; where the former source can no
longer receive responses, recovery completes internally and the authenticated athlete client obtains the result
through sync (§D14-C, §D14-G, §E; v1.7.32 sheet lines""",
"""replay lookup with recovery → only a replay MISS meets the CURRENT-registration door and its declared phases; a
replay hit returns the immutable prior result whatever the registry now says; where the former source can no
longer receive responses, recovery completes internally and the authenticated athlete client obtains the result
through sync (SUPERSEDED in v1.32: the verified CONTENT lookup also precedes the door — only a miss on BOTH
meets it — and a hit is DISCLOSED to the source only when direct_replay_response_authorized, else a generic
response) (§D14-C, §D14-G, §E; v1.7.32 sheet lines""")
rep("""verification failure creates or replays the transport-identity rejection stub; then verified content replay →""",
"""verification failure creates or replays the transport-identity rejection stub (v1.32: for a currently admitted
source; an unregistered source's unverifiable miss is refused without a stub); then verified content replay →""")
rep("""  commitment) or REJECTION STUB; a replay first performs idempotent GROUP RECOVERY (below), then returns the
  ORIGINAL receipt and the identity's current disposition and stores nothing new (rig173 A4: dedup""",
"""  commitment) or REJECTION STUB; a replay first performs idempotent GROUP RECOVERY (below), then returns the
  ORIGINAL receipt and the identity's current disposition — to the source only when
  direct_replay_response_authorized, to the athlete's client always through sync — and stores nothing new (rig173 A4: dedup""")

out = src
for o, n in edits: out = out.replace(o, n, 1)
open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.33.txt', 'w', encoding='utf-8').write(out)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"
print("edits", len(edits), "lines", len(L), "bytes", len(out.encode()))
