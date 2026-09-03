src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.31.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
edits = []
def rep(old, new):
    n = src.count(old); assert n == 1, f"found {n}: {old[:100]!r}"
    edits.append((old, new))

# ---- title ----
rep("EARNED — RUNTIME SHEET v1.7.31 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.30 (Sol pass 29 applied, rig178: ",
    "EARNED — RUNTIME SHEET v1.7.32 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.31 (Sol pass 30 applied, rig179: group recovery is AUTHORITY-OWNED and an authenticated principal's replay lookup precedes the registration door, so a removed source can never strand an incomplete group; EVERY identity-consuming submission of any kind is route-stamped before the identity test; the selector's REQUEST_MISMATCH row names only the other members of its population; four more historical clauses marked SUPERSEDED; earlier in v1.30, pass 29, rig178: ")

# ---- header ----
rep("APPENDIX v1.30 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 29: the six rig177 witnesses CLOSED on their inputs; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four composed findings (3 High, 1 Medium) applied in v1.30 — the replay split, component_scope_current, the normative-summary scrub, count-neutral collision copy; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.31 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 30: rig178 T1, T2 and T4 CLOSED on their witnesses; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; three findings (2 High, 1 Medium) applied in v1.31 — authority-owned group recovery ahead of the registration door, the route stamp on every identity-consuming submission, the selector's REQUEST_MISMATCH row and the last unmarked historical clauses; no frozen row is CHANGED · bounded audit continues on the appendix only")

# ---- CHANGES entry ----
NEW = """CHANGES v1.30 → v1.31 (Sol's appendix pass 30 — rig178 T1 / T2 / T4 CLOSED on their witnesses, the row and
precedence still RATIFIED, no runtime-sheet reopening, no research-policy objection; three findings, every one
executed in rig179; the sheet stays closed): (1) [High] an incomplete group could be STRANDED behind the
registration door — source S registered, submission R admitted, R's group durably incomplete across the crash cut
with its reply lost, the athlete then REMOVES S, S retries the identical transport identity: the door refused the
retry before any replay lookup or group recovery, the incomplete group stayed, and it blocked reduction over S and
every D14 application reading it FOR EVER (a lost-ack retry after removal also answered REFUSED instead of the
original disposition) (rig179 T1) → GROUP RECOVERY IS AUTHORITY-OWNED: before ANY later action involving that
(athlete, source) — a later ingestion, a registry mutation touching the source, a sync snapshot, a reduction —
the authority completes the pending group FIRST (its derived events are a function of the durably admitted
triggering item and the stored state; nothing is needed from the source) and blocks that action until it has; and THE
ORDER AT THE DOOR is: authenticate the submission's SOURCE PRINCIPAL against the source's registration HISTORY
(a removed registration's principal stays authenticatable — the sequence is never dropped) → transport-exact
replay lookup with recovery → only a replay MISS meets the CURRENT-registration door and its declared phases; a
replay hit returns the immutable prior result whatever the registry now says; where the former source can no
longer receive responses, recovery completes internally and the authenticated athlete client obtains the result
through sync (§D14-C, §D14-G, §E; v1.7.32 sheet lines 2367–2378, 2474–2484, 3157 and 3393, 3412, 3441, 3449–3453); (2) [High]
component_scope_current read a ROUTE STAMP the stamping rule never assigned to every legal member kind — "INGESTION
stamps every stored proof and record", yet the shared id space admits ANSWER and WITHDRAWAL members: two
shape-valid ANSWER submissions under one id, different commitments, each claiming its request's scope — one
implementation read the component as non-current and diagnostic-only, another inferred a stamp from "stored like
any item" and bound SOURCE_ITEM_IDENTITY_COLLISION (rig179 T2; withdrawal currentness and an answer's later
registration test needed the same stamp) → EVERY verified, ingestion-shape-valid, IDENTITY-CONSUMING
source-authored submission — RECORD, PROOF, ANSWER and WITHDRAWAL, a submission whose terminal disposition becomes
COLLISION_MEMBER included — receives an IMMUTABLE ROUTE STAMP before the identity test (the ROUTE STAMP is now a
named step of the ingestion order); component_scope_current, a withdrawal's currentness and an answer's
registration test read those per-member stamps; an authority-created REQUEST is outside the rule (§D14-C, §E;
v1.7.32 sheet lines 2487–2494, 2417–2419 and 3412); (3) [Medium] the selector said "every other STORED answer is
REQUEST_MISMATCH" — literally the withdrawn answer, the hidden collision member and the INERT answer the
population rule had just excluded (rig179 T3: three contradicting rows) → "every other MEMBER OF THAT SELECTOR
POPULATION is REQUEST_MISMATCH"; an answer outside the population keeps its own row (WITHDRAWN, the component
blocker, the INERT resolution on the source card); the retained rule, stated once: terminal STORED + shape-valid
ANSWER + APPLIES + no collision membership + not withdrawn → least source_item_id → domain qualification; the
operative component sentence now reads "every later verified, shape-valid, identity-consuming submission" and
"two verified, shape-valid answers"; four historical clauses marked SUPERSEDED in place — "an answer to no request
is a stub" (v1.23 entry), wrong-kind withdrawals and answers resolving as stubs (v1.25 entry), "AT MOST ONE
terminal response … a different answer is a collision stub" (v1.24 entry), "every later verified submission" is
COLLISION_MEMBER (v1.27 entry) — each pointing at the final rule (§D14-C; v1.7.32 sheet lines 2613, 2620–2624,
2422, 998, 1064, 1138, 1208 and 1085). A pre-delivery adversarial read (rig179 X1–X3) shaped the wording: a principal that
authenticates against NO registration, present or past, is refused exactly as before; the §D14-G epoch sentence
says a registry mutation touching a source completes that source's pending group first; a rejection stub carries
its source_id and no route stamp (it is bound by R1 / P1 beside the screen, never by a stamp); §E's own
replay-rule sentence and the v1.25 entry's door sentence no longer state "refused at the door" ahead of replay.

"""
rep("CHANGES v1.29 → v1.30 (Sol's appendix pass 29 — the six rig177 witnesses CLOSED on their inputs, the row and", NEW + "CHANGES v1.29 → v1.30 (Sol's appendix pass 29 — the six rig177 witnesses CLOSED on their inputs, the row and")

# ---- (1) the door + recovery ----
rep("""  ONE REPLAY RULE per source. A submission from an unregistered source, or under a registration whose
  declared_phases lacks RECORD, is REFUSED AT THE DOOR — not ingested, no receipt, no stub, no replay identity
  consumed — and may be submitted again once registered; every ADMITTED submission has a TRANSPORT""",
"""  ONE REPLAY RULE per source. THE ORDER AT THE DOOR (rig179 T1: a door that tested the CURRENT registration
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
  refused the same way; every ADMITTED submission has a TRANSPORT""")
rep("""  visible; a REPLAY of the submission performs idempotent GROUP RECOVERY — an incomplete group is completed,
  never reported done — and an incomplete group in the authority's durable state blocks reduction over that
  source and every D14 application that reads it (a frontier can never point inside a group); a receipt is""",
"""  visible; GROUP RECOVERY IS AUTHORITY-OWNED and never depends on a source retry (rig179 T1): before ANY later
  action involving that (athlete, source) — a later ingestion, a registry mutation touching the source
  (deactivation, removal, reactivation, any edit), a sync snapshot served to a client, a reduction — the
  authority COMPLETES the pending group FIRST (the derived events are a deterministic function of the durably
  admitted triggering item and the stored state, so completion is always possible and never waits on the
  source) and, until it has, that action is BLOCKED behind recovery — never skipped, never served an
  intermediate length; a transport-exact replay performs the same idempotent recovery first; an incomplete
  group is completed, never reported done; an incomplete group in the authority's durable state blocks
  reduction over that source and every D14 application that reads it (a frontier can never point inside a
  group); where the former source can no longer receive responses, recovery still completes internally and the
  authenticated athlete client obtains the result through sync; a receipt is""")
rep("""  or REMOVED, an active flag, declared_phases, input_domain_set or dependency-function edit (a removal flips
  the verdict and stales every stamp naming it, so it must advance the epoch — rig173 B8); both are values a""",
"""  or REMOVED, an active flag, declared_phases, input_domain_set or dependency-function edit (a removal flips
  the verdict and stales every stamp naming it, so it must advance the epoch — rig173 B8; and every registry
  mutation touching a source first completes that source's pending ingestion group, §D14-C); both are values a""")

# ---- (2) the route stamp ----
rep("""  item consumes that id in every arrival order; THEN the IDENTITY / COLLISION test — same source_item_id + a""",
"""  item consumes that id in every arrival order; THEN the ROUTE STAMP — every identity-consuming submission,
  whatever its kind and whatever disposition follows, is stamped with the immutable route identity it arrived
  under (below); THEN the IDENTITY / COLLISION test — same source_item_id + a""")
rep("""  frontier for ever); INGESTION stamps every stored
  proof and record with the ROUTE IDENTITY of the registration it arrived under; a WELL-FORMED REFERENCE to an""",
"""  frontier for ever); INGESTION stamps EVERY verified, ingestion-shape-valid, IDENTITY-CONSUMING
  source-authored submission — RECORD, PROOF, ANSWER and WITHDRAWAL alike, a submission whose terminal
  disposition becomes COLLISION_MEMBER included — with the IMMUTABLE ROUTE IDENTITY (kind, producer_id,
  registration version) of the registration it arrived under, assigned BEFORE the identity test (rig179 T2:
  "every stored proof and record" left two ANSWER members of one component with no defined stamp, so one
  implementation read component_scope_current false and another true); component_scope_current, a
  withdrawal's currentness and an answer's registration test read those per-member stamps; an authority-created
  REQUEST is the app's own item and carries no route stamp; a rejection stub carries its source_id and no
  stamp; a WELL-FORMED REFERENCE to an""")

# ---- (3) the component sentence + the selector ----
rep("""  with every later verified submission under that id — form ONE COLLISION COMPONENT keyed by (source_id,""",
"""  with every later verified, shape-valid, identity-consuming submission under that id — form ONE COLLISION
  COMPONENT keyed by (source_id,""")
rep("""  receipt; two verified answers under ONE source_item_id are an identity collision — a COMPONENT, and the""",
"""  receipt; two verified, shape-valid answers under ONE source_item_id are an identity collision — a COMPONENT, and the""")
rep("""  tests; every other stored answer is ledgered ZERO_PROOF_INAPPLICABLE {key, REQUEST_MISMATCH} and never
  qualifies, and a source that wants a later answer to govern WITHDRAWS the earlier one (the next-least eligible""",
"""  tests; every OTHER MEMBER OF THAT SELECTOR POPULATION is ledgered ZERO_PROOF_INAPPLICABLE {key,
  REQUEST_MISMATCH} and never qualifies (an answer outside the population keeps its own row — WITHDRAWN, the
  component blocker, or the INERT resolution disclosed on the source card; rig179 T3: "every other stored
  answer" gave the withdrawn answer, the hidden member and the INERT answer REQUEST_MISMATCH rows too), and a
  source that wants a later answer to govern WITHDRAWS the earlier one (the next-least eligible""")

# ---- §E ----
rep("""  source_item_id, the per-source receipt counter is arrival metadata only, every stored record and proof is
  stamped with the route identity it arrived under, nothing is stored from an unregistered source or under a
  registration whose declared_phases lacks RECORD (two record-supplying sources for one scope is a configuration""",
"""  source_item_id, the per-source receipt counter is arrival metadata only, every verified, shape-valid,
  identity-consuming submission of any kind (record, proof, answer, withdrawal — collision members included) is
  stamped with the immutable route identity it arrived under before the identity test, an authenticated
  principal's transport-exact replay lookup and authority-owned group recovery precede the current-registration
  door (a removed registration's principal stays authenticatable), nothing NEW is stored from an unregistered
  source or under a
  registration whose declared_phases lacks RECORD (two record-supplying sources for one scope is a configuration""")
rep("""  authority commit with consecutive receipts, no intermediate sequence length ever served, idempotent group
  recovery on replay, an incomplete durable group blocking reduction over that source and D14 application;""",
"""  authority commit with consecutive receipts, no intermediate sequence length ever served, AUTHORITY-OWNED
  group recovery before any later ingestion, registry mutation, sync snapshot or reduction involving that
  (athlete, source) — never dependent on a source retry, a replay recovering first too — an incomplete durable
  group blocking reduction over that source and D14 application;""")
rep("""  staging rule needs; INGESTION ORDER — transport-exact replay where the submission digest is already admitted,
  then verification, then the verified content replay, then ingestion-shape validation
  (which alone decides whether a submission consumes its source_item_id), then the identity test;""",
"""  staging rule needs; INGESTION ORDER — principal authentication against the registration history, then
  transport-exact replay where the submission digest is already admitted (with recovery), then the
  current-registration door for a miss, then verification, then the verified content replay, then
  ingestion-shape validation (which alone decides whether a submission consumes its source_item_id), then the
  route stamp, then the identity test;""")

# ---- SUPERSEDED marks ----
rep("""disposition change); every later verified submission under the id is COLLISION_MEMBER; (7) [Medium] exits — the""",
"""disposition change); every later verified submission under the id is COLLISION_MEMBER (SUPERSEDED in v1.29 /
v1.31: verified, ingestion-shape-valid AND identity-consuming); (7) [Medium] exits — the""")
rep("""RESOLVED the moment the target is stored; only a reference resolving to the wrong kind, scope target or slot is
terminally malformed (a record) or a stub (a withdrawal, an answer); an unresolved reference is DISCLOSED on the""",
"""RESOLVED the moment the target is stored; only a reference resolving to the wrong kind, scope target or slot is
terminally malformed (a record) or a stub (a withdrawal, an answer) (SUPERSEDED in v1.28 / v1.29: a wrong-kind
withdrawal or answer resolves INERT {TARGET_KIND} by the reference-effect matrix, never a stub); an unresolved reference is DISCLOSED on the""")
rep("""class ledger; a re-query has AT MOST ONE terminal response (the first stored answer; a retry returns its receipt;
a different answer is a collision stub); ZERO_PROOF_INAPPLICABLE's enum gains WITHDRAWN (v1.7.25 sheet lines""",
"""class ledger; a re-query has AT MOST ONE terminal response (the first stored answer; a retry returns its receipt;
a different answer is a collision stub) (SUPERSEDED in v1.27 / v1.28 / v1.30: several terminal answers may be
stored and the deterministic selector chooses; a different answer under the same id is a collision MEMBER);
ZERO_PROOF_INAPPLICABLE's enum gains WITHDRAWN (v1.7.25 sheet lines""")
rep("""to no request is a stub) (v1.7.24 sheet lines 1934–1971 and 1990–2015 and 1660–1664); (2) [High] §D14-C let an AUTHORITATIVE_RECORD""",
"""to no request is a stub — SUPERSEDED in v1.25 / v1.28: WAITING_FOR_SOURCE_ITEM, resolving INERT {NO_SUCH_REQUEST}
by the decidable test) (v1.7.24 sheet lines 1934–1971 and 1990–2015 and 1660–1664); (2) [High] §D14-C let an AUTHORITATIVE_RECORD""")

# ---- adversarial read: §E replay-rule sentence, v1.25 entry door sentence, "completes or blocks" tightened ----
rep("""  RULE (v1.25 / v1.27: a submission from an unregistered source or a registration lacking RECORD is refused at
  the door and consumes nothing; every ADMITTED submission has a TRANSPORT identity always and a CONTENT""",
"""  RULE (v1.25 / v1.27 / v1.31: a submission is first authenticated against its source's registration history
  and looked up as a transport-exact replay — a hit returns the prior result whatever the registry now says;
  a NEW submission, a replay miss, from an unregistered source or a registration lacking RECORD is refused at
  the door and consumes nothing; every ADMITTED submission has a TRANSPORT identity always and a CONTENT""")
rep("""basis-bound ledger (rig173 A4) → a submission from an unregistered source or a registration lacking RECORD is
REFUSED AT THE DOOR (nothing consumed, resubmittable once registered); every ADMITTED submission has ONE REPLAY""",
"""basis-bound ledger (rig173 A4) → a submission from an unregistered source or a registration lacking RECORD is
REFUSED AT THE DOOR (nothing consumed, resubmittable once registered) (SUPERSEDED in v1.31: after principal
authentication a transport-exact replay hit precedes the door; only a replay MISS is refused); every ADMITTED submission has ONE REPLAY""")

out = src
for o, n in edits: out = out.replace(o, n, 1)
open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.32.txt', 'w', encoding='utf-8').write(out)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"
print("edits", len(edits), "lines", len(L), "bytes", len(out.encode()))
