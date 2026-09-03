src = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.30.txt', encoding='utf-8').read()
base26 = open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.26.txt', encoding='utf-8').read().split('\n')
edits = []
def rep(old, new):
    n = src.count(old); assert n == 1, f"found {n}: {old[:100]!r}"
    edits.append((old, new))

# ---- title: scrub the stale summary, bump ----
rep("EARNED — RUNTIME SHEET v1.7.30 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.29 (Sol pass 28 applied, rig177: ",
    "EARNED — RUNTIME SHEET v1.7.31 · RATIFIED 2026-09-01 · sheet text unchanged from v1.7 (Grok + Sol: CLOSED) · appendix v1.30 (Sol pass 29 applied, rig178: replay split — a content-identity replay only AFTER verification, transport-exact replay first; component_scope_current gates the collision finding so a removed source can never block for ever; every normative summary scrubbed to the final rule — ingestion order, COLLISION_MEMBER as verified + shape-valid + identity-consuming, withdrawals only by the reference-effect matrix, the full selector population; collision copy count- and kind-neutral; earlier in v1.29, pass 28, rig177: ")
rep("verification before the collision test; receipts per (athlete, source), consecutive, to every ingestion event; WAITING non-terminal)",
    "verification then shape validation before the identity test (v1.27 wording superseded, see v1.29 / v1.30); receipts per (athlete, source), consecutive, to every ingestion event; WAITING non-terminal)")

# ---- header ----
rep("APPENDIX v1.29 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 28: pass-27's three witnesses CLOSED (W1 arrival order, W2 authority crash cut, W3 collided-answer selector); E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; six findings (3 High, 3 Medium) applied in v1.29 — shape validation before identity, one closed reference-effect matrix, retirement_effective, client-atomic groups, the AUTHORITATIVE_RECORD domain union, keyed stub identity; no frozen row is CHANGED · bounded audit continues on the appendix only",
    "APPENDIX v1.30 · D13 / D14 — RESEARCH NOTE + OWNER RULINGS (2026-09-03) · Grok CONFIRMED v1.7.9 (sheet + appendix) · Sol pass 29: the six rig177 witnesses CLOSED on their inputs; E1–E3, D13, the D14 mathematics, quantization and the uncertainty direction CONFIRMED; the required state-8 row D14_INPUT_STATE_CHANGED and its precedence remain RATIFIED; four composed findings (3 High, 1 Medium) applied in v1.30 — the replay split, component_scope_current, the normative-summary scrub, count-neutral collision copy; no frozen row is CHANGED · bounded audit continues on the appendix only")

# ---- CHANGES entry ----
NEW = """CHANGES v1.29 → v1.30 (Sol's appendix pass 29 — the six rig177 witnesses CLOSED on their inputs, the row and
precedence still RATIFIED, no runtime-sheet reopening, no research-policy objection; four composed findings, the
executable ones in rig178; the sheet stays closed): (1) [High] "an exact replay is recognised by its REPLAY
IDENTITY" ran before verification, so a submission that merely CLAIMED a stored item's commitment over different
bytes (G = {x, P′, c} with H(P′) ≠ c) was answered as a STORED replay after R and as a rejection stub before it —
two ledgers by order, and an authenticated STORED result for bytes that never verified (rig178 T1) → REPLAY IS
SPLIT: a TRANSPORT-EXACT replay (the same raw / canonical submission digest as an earlier admitted submission)
is recognised first and returns that submission's receipt and disposition, stub included; a CONTENT-identity
replay ({source_item_id, commitment}) is recognised only AFTER the submitted canonical content VERIFIES;
verification failure creates or replays the transport-identity rejection stub; then verified content replay →
ingestion-shape validation → the identity / collision test; accordingly an admitted submission no longer has "ONE
replay identity — {id, commitment} when both parse": it has a TRANSPORT identity always and a CONTENT identity only
once its content verifies, and the SOURCE_ITEM_UNREADABLE key follows the same rule (§D14-C, v1.7.31 sheet lines
2342–2358, 2319–2329 and 2445–2447); (2) [High] a
component could block FOR EVER: route r stores A(x,c1) and B(x,c2), component C claims cell d, r is then
deactivated or removed — A and B would be REGISTRATION_NOT_CURRENT if screened, yet R1 / P1 bound every
component claiming d with no currentness test, retirement_effective was false with no current withdrawal, and an
unregistered source cannot send the withdrawal the copy demands (rig178 T2) → component_scope_current(C, scope,
basis), DERIVED at every basis: true only when at least one member claiming that scope carries a
registration-current stamp and a currently applicable scope claim, evaluated with component hiding IGNORED; the
hard finding is bound iff component_scope_current AND NOT retirement_effective, otherwise the component stays in
source / History diagnostics only; registry transitions cover both directions, so reactivation brings the blocker
back (§D14-C, §D14-E R1, §D14-F P1; v1.7.31 sheet lines 2369, 2376–2386, 2847 and 3007–3008); (3) [High] current normative summaries still
stated pre-v1.29 rules — the terminal-disposition gloss called COLLISION_MEMBER merely "a verified item" with a
different commitment, §E said "VERIFICATION FIRST … THEN identity" with no shape validation (each re-creates
rig177 S1), §E still described a withdrawal as naming "the source's own record or proof", and the selector
population was under-specified → every current summary scrubbed to the FINAL rule: COLLISION_MEMBER requires a
verified, ingestion-shape-valid, IDENTITY-CONSUMING submission; the order is transport-exact replay where
content-bound → verification → verified content replay → ingestion-shape validation → identity test; withdrawal
behaviour is defined EXCLUSIVELY by the closed reference-effect matrix; the re-query selector population is
"terminal STORED, ingestion-shape-valid ANSWER items naming the request whose resolution outcome is APPLIES, in no
collision component and not currently withdrawn", selection still preceding the answer's domain-qualification
tests; historical change-log sentences that state a superseded rule are now marked SUPERSEDED in place (the
v1.29 entry's item (1), the v1.28 entry's items (1) and (2), the v1.27 entry's items (5), (7), (13) and (15), the
v1.25 entry's item (4), the v1.24 entry's withdrawal sentence) (§D14-C, §E; v1.7.31 sheet lines 2331–2333, 2537–2543,
3313–3322, 3332–3340, 3348–3349, 3343 and 3360–3367); (4) [Medium] the collision copy was false for a legal component — the id space is
shared across RECORD, PROOF, ANSWER and WITHDRAWAL and a component may hold more than two commitments, so "sent
two different versions of one report … isn't using either" misdescribed N > 2 and cross-kind components (rig178
T4) → face: "{source} sent conflicting submissions under one item ID. Earned isn't using any of them until
{source} corrects it."; Why names the member count, the item kinds, the sorted commitments, the claimed scopes
and the exit, never content (§D14-C, v1.7.31 sheet lines 2393–2397). A pre-delivery adversarial read (rig178 X1–X4 read, X5–X6
executed) shaped the wording: the R2 carve-out and the P1 placement now read "every component whose finding is BOUND"
(component_scope_current ∧ ¬retirement_effective), never "every component claiming the scope"; a transport
replay of a submission whose group is incomplete still performs group recovery first; the title line's own
v1.27 / v1.28 summaries are annotated rather than left stating old rules; "bound beside the screen … exactly as a
stub is" now carries the binding condition inline so no sentence reads as an unconditional bind; a content replay
returns the HOLDER's receipt and disposition whatever it is — STORED, COLLISION_MEMBER or a shape stub — and
re-tests nothing (X5); and the transport identity is CONTENT-BOUND — the canonical submission digest with the
transport's declared volatile wrapper fields excluded, an idempotency key only bound to that digest, never alone
(X6: a key reused over corrected bytes would replay the stub and lose a valid record).

"""
rep("CHANGES v1.28 → v1.29 (Sol's appendix pass 28 — the three pass-27 witnesses CLOSED", NEW + "CHANGES v1.28 → v1.29 (Sol's appendix pass 28 — the three pass-27 witnesses CLOSED")

# ---- SUPERSEDED marks in the historical entries ----
rep("collision with it and turned the valid record into a hard blocker (rig175 C1: 2,001 became BLOCKED) → VERIFY\nFIRST: an unverifiable submission is a REJECTION STUB under its transport identity and never a collision member;\nonly VERIFIED same-id submissions with different commitments collide; (6) [High]",
    "collision with it and turned the valid record into a hard blocker (rig175 C1: 2,001 became BLOCKED) → VERIFY\nFIRST: an unverifiable submission is a REJECTION STUB under its transport identity and never a collision member;\nonly VERIFIED same-id submissions with different commitments collide (SUPERSEDED: v1.29 put ingestion-shape\nvalidation between verification and identity, v1.30 split replay so no content replay precedes verification — only\nverified, shape-valid, identity-consuming submissions collide); (6) [High]")
rep("its own collision → a WITHDRAWAL may target a COMPONENT by its source_item_id and RETIRES it (a receipted event; the\nid stays consumed, every member stays hidden, the finding leaves; the corrected report comes under a NEW id); a",
    "its own collision → a WITHDRAWAL may target a COMPONENT by its source_item_id and RETIRES it (a receipted event; the\nid stays consumed, every member stays hidden, the finding leaves; the corrected report comes under a NEW id)\n(SUPERSEDED: v1.28 made the target an identity, v1.29 the reference-effect matrix and the derived\nretirement_effective, v1.30 component_scope_current); a")
rep("(13) [Medium] mandatory copy for the collision — face: \"{source} sent two different versions of one report. Earned\nisn't using either until {source} corrects it.\"; Why names",
    "(13) [Medium] mandatory copy for the collision — face: \"{source} sent two different versions of one report. Earned\nisn't using either until {source} corrects it.\" (SUPERSEDED in v1.30: count- and kind-neutral copy); Why names")
rep("the other) → the answer with the LEAST source_item_id (canonical_encode order) is THE answer, whether or not it\nqualifies; every other answer to that request is stored and ledgered",
    "the other) → the answer with the LEAST source_item_id (canonical_encode order) is THE answer, whether or not it\nqualifies (SUPERSEDED: the population is narrowed in v1.28 and stated in full in v1.30); every other answer to that request is stored and ledgered")
rep("a WITHDRAWAL targets an IDENTITY, never one member: while a current withdrawal for x exists nothing under x is in\nforce — every stored item under x, present or future, is withdrawn and any collision component for x is RETIRED,",
    "a WITHDRAWAL targets an IDENTITY, never one member: while a current withdrawal for x exists nothing under x is in\nforce (SUPERSEDED in v1.29: no withdrawable RECORD, PROOF or ANSWER under x — the reference-effect matrix) — every stored item under x, present or future, is withdrawn and any collision component for x is RETIRED,")

# ---- (3) the disposition gloss + (1) the order ----
rep("""  sheet's own disposition lifecycle) resolving into exactly ONE IMMUTABLE TERMINAL disposition — STORED (a
  verified, valid item), COLLISION_MEMBER (a verified item whose source_item_id an earlier verified item of the
  same source already carries with a DIFFERENT commitment) or REJECTION STUB; a replay of the same identity
  first performs idempotent GROUP RECOVERY (below), then returns the ORIGINAL receipt and the identity's
  current disposition and stores nothing new (rig173 A4: dedup""",
"""  sheet's own disposition lifecycle) resolving into exactly ONE IMMUTABLE TERMINAL disposition — STORED (a
  verified, ingestion-shape-valid item), COLLISION_MEMBER (a verified, ingestion-shape-valid, IDENTITY-CONSUMING
  submission whose source_item_id an earlier such item of the same source already carries with a DIFFERENT
  commitment) or REJECTION STUB; a replay first performs idempotent GROUP RECOVERY (below), then returns the
  ORIGINAL receipt and the identity's current disposition and stores nothing new (rig173 A4: dedup""")
rep("""  and become a harmless stub in the other): FIRST an exact replay is recognised by its REPLAY IDENTITY and
  returns the original receipt; THEN VERIFICATION — an item with no id, no commitment, or a commitment that
  does not equal the recomputed digest → a REJECTION STUB under its transport identity, never a collision
  member; THEN INGESTION-SHAPE VALIDATION, which decides whether the submission is IDENTITY-CONSUMING: only a""",
"""  and become a harmless stub in the other; rig178 T1: an exact-replay test by CLAIMED {source_item_id,
  commitment} that ran before verification answered a submission carrying a stored item's commitment over
  DIFFERENT bytes as a STORED replay in one order and as a stub in the other): REPLAY IS SPLIT — FIRST a
  TRANSPORT-EXACT replay: the same content-bound transport identity (the canonical submission digest, above)
  as an earlier admitted submission returns
  that submission's receipt and disposition, a stub's included (an exact re-send of a rejected submission
  replays its stub); THEN VERIFICATION of the submitted canonical content — an item with no id, no commitment,
  or a commitment that does not equal the recomputed digest → a REJECTION STUB under its transport identity,
  never a collision member and never a content replay (a claimed commitment is never trusted before the bytes
  behind it verify); THEN the VERIFIED CONTENT replay — the same content identity {source_item_id, verified
  commitment} as an earlier verified submission → that submission's original receipt and disposition, whatever
  it is (STORED, COLLISION_MEMBER or a shape stub alike; nothing stored, nothing re-tested); THEN
  INGESTION-SHAPE VALIDATION, which decides whether the
  submission is IDENTITY-CONSUMING: only a""")
rep("""  item consumes that id in every arrival order; THEN IDENTITY — same source_item_id + same commitment → the
  ORIGINAL receipt; same source_item_id + a different verified, identity-consuming commitment → an IDENTITY COLLISION: the new""",
"""  item consumes that id in every arrival order; THEN the IDENTITY / COLLISION test — same source_item_id + a
  different verified, shape-valid, identity-consuming commitment → an IDENTITY COLLISION: the new""")

# ---- (2) component_scope_current ----
rep("""  is retirement_effective(C), DERIVED at every basis: true iff at least one CURRENT (stamped registration
  active), NON-HIDDEN withdrawal targets C.source_item_id; a registry transition recomputes it — the blocker
  RETURNS when it turns false and is suppressed while it is true — and the registry epoch covers either""",
"""  is retirement_effective(C), DERIVED at every basis: true iff at least one CURRENT (stamped registration
  active), NON-HIDDEN withdrawal targets C.source_item_id; and whether the finding is BOUND at all is
  component_scope_current(C, scope, basis), DERIVED at every basis too (rig178 T2: a component of a source whose
  registration was removed blocked its cell for ever — its members would have been REGISTRATION_NOT_CURRENT
  if screened, no current withdrawal existed, and an unregistered source cannot send one): true only when at
  least one member claiming that scope carries a registration-current stamp AND a currently applicable scope
  claim (a cell still queried, a class still governed under the current plan basis), evaluated with component
  hiding IGNORED; the hard finding SOURCE_ITEM_IDENTITY_COLLISION is bound for a scope iff
  component_scope_current(C, scope, basis) AND NOT retirement_effective(C); otherwise the component is retained
  in the source card and History DIAGNOSTICS only, never a finding; a registry transition recomputes BOTH
  predicates in both directions — deactivation or removal lifts the blocker, reactivation brings it back — and
  the registry epoch covers either""")

# ---- (4) copy ----
rep("""  MANDATORY COPY — face: "{source} sent two different versions of one report. Earned isn't using either until
  {source} corrects it."; Why names the item, its versions as commitments (never content), the scope claimed
  and the exit. A corrected resend""",
"""  MANDATORY COPY (rig178 T4: the id space is shared across RECORD, PROOF, ANSWER and WITHDRAWAL and a component
  may hold more than two commitments, so "two versions … either" was false for a legal component) — face:
  "{source} sent conflicting submissions under one item ID. Earned isn't using any of them until {source}
  corrects it."; Why names the member count, the item kinds, the sorted commitments, the claimed scopes and the
  exit — never content. A corrected resend""")

# ---- R1 and P1 bind only BOUND findings ----
rep("""  never leaves the WITNESS SET (below) — and binding BESIDE the screen every COLLISION COMPONENT whose members
  claim the cell as the blocking finding SOURCE_ITEM_IDENTITY_COLLISION and every rejection stub claiming it as
  the ledger record SOURCE_ITEM_UNREADABLE (§D14-C); R2 the EMPTY-O BRANCH (day domain, precedence over everything after it, with ONE
  CARVE-OUT: a component claiming the cell keeps its blocking finding, so ZERO_ATTESTED and
  NO_OCCURRENCE_EVIDENCE are reachable only while no component claims the cell — with one, the blocking set is""",
"""  never leaves the WITNESS SET (below) — and binding BESIDE the screen every COLLISION COMPONENT whose finding
  for the cell is BOUND (component_scope_current(C, cell, basis) ∧ ¬retirement_effective(C), §D14-C) as
  SOURCE_ITEM_IDENTITY_COLLISION and every rejection stub claiming it as the ledger record
  SOURCE_ITEM_UNREADABLE (§D14-C); R2 the EMPTY-O BRANCH (day domain, precedence over everything after it, with ONE
  CARVE-OUT: a component whose finding for the cell is bound keeps it, so ZERO_ATTESTED and
  NO_OCCURRENCE_EVIDENCE are reachable only while no such component exists — with one, the blocking set is""")
rep("""  class-keyed, carried as a blocker) and every COLLISION COMPONENT whose members claim a governed class, placed
  in that class's carried_blockers as SOURCE_ITEM_IDENTITY_COLLISION (§D14-C; P1 stays blocking [] — it is""",
"""  class-keyed, carried as a blocker) and every COLLISION COMPONENT whose finding for a governed class is BOUND
  (component_scope_current(C, class, basis) ∧ ¬retirement_effective(C), §D14-C), placed in that class's
  carried_blockers as SOURCE_ITEM_IDENTITY_COLLISION (§D14-C; P1 stays blocking [] — it is""")

# ---- selector population ----
rep("""  request stays UNANSWERED until an answer under a new id arrives); among the VERIFIED answers naming the
  request that are members of NO identity-collision component and are NOT currently withdrawn — collision
  members never participate (rig176 W3:""",
"""  request stays UNANSWERED until an answer under a new id arrives); the SELECTOR POPULATION, stated once: the
  terminal STORED, ingestion-shape-valid ANSWER items naming the request whose resolution outcome is APPLIES,
  that are members of NO identity-collision component and are NOT currently withdrawn — collision
  members never participate (rig176 W3:""")

# ---- §E scrub ----
rep("""  terminal disposition, STORED | COLLISION_MEMBER | REJECTION STUB, a replay returning the original receipt and
  disposition; VERIFICATION FIRST — no id / no commitment / a commitment that does not verify → a rejection
  stub; THEN identity — same id + same content → the original receipt; same id + a different verified content
  → an IDENTITY COLLISION: a receipted COMPONENT that hides every member, blocks every scope the members claim
  (SOURCE_ITEM_IDENTITY_COLLISION, hard) and exits only by the source's withdrawal of the component), the
  commitment being the named digest over the source-authored content,""",
"""  terminal disposition, STORED | COLLISION_MEMBER | REJECTION STUB; the ORDER: a transport-exact replay where
  the raw / canonical submission digest is already admitted → verification of the submitted content → the
  verified content replay → ingestion-shape validation (which alone decides whether a submission consumes its
  source_item_id) → the identity / collision test; COLLISION_MEMBER requires a verified, ingestion-shape-valid,
  identity-consuming submission whose id another such item of the source holds with a different commitment — a
  receipted COMPONENT that hides every member and, while component_scope_current and not
  retirement_effective, blocks every scope the members claim (SOURCE_ITEM_IDENTITY_COLLISION, hard); a
  rejection stub never consumes an id and never becomes a member), the
  commitment being the named digest over the source-authored content,""")
rep("""  explicit, slot-matched, fully well-formed replacement (the LINEAGE RULE), a WITHDRAWAL is a typed source item
  naming the source's own record or proof, every emitting registration declares a DEPENDENCY FUNCTION""",
"""  explicit, slot-matched, fully well-formed replacement (the LINEAGE RULE), a WITHDRAWAL is a typed source item
  naming one of the source's own item identities and its effect is defined EXCLUSIVELY by §D14-C's closed
  reference-effect matrix by referrer kind, every emitting registration declares a DEPENDENCY FUNCTION""")
rep("""  QUALIFYING response per request — several terminally stored answers may exist and are reduced by the
  deterministic selector (verified, no collision member, not withdrawn, least source_item_id) — and the source""",
"""  QUALIFYING response per request — several terminally stored answers may exist and are reduced by the
  deterministic selector over the terminal STORED, ingestion-shape-valid ANSWER items naming the request whose
  resolution outcome is APPLIES, in no collision component and not currently withdrawn, least source_item_id
  first, selection preceding the answer's domain-qualification tests — and the source""")
rep("""  (which alone decides whether a submission consumes its source_item_id), then the identity test; the closed
  REFERENCE-EFFECT MATRIX by referrer kind; retirement_effective derived at every basis from current, non-hidden
  withdrawals (the formation and retirement events are audit only); SOURCE_ITEM_UNREADABLE keyed by the""",
"""  (which alone decides whether a submission consumes its source_item_id), then the identity test; the closed
  REFERENCE-EFFECT MATRIX by referrer kind; retirement_effective and component_scope_current derived at every
  basis (the formation and retirement events are audit only; a component of a source with no current member
  stamp is diagnostics, never a finding, and reactivation brings the finding back); SOURCE_ITEM_UNREADABLE keyed by the""")
rep("""  only; and a withdrawal that targets an identity (every withdrawable record, proof or answer under it, any
  component for it — never a standalone withdrawal), never one member; and""",
"""  only; and a withdrawal that targets an identity, its effect given by the reference-effect matrix alone,
  never one member; and""")

# ---- (1)/(3) the replay-identity definition, the stub key, the inline bind condition ----
rep("""every ADMITTED submission has exactly ONE REPLAY
  IDENTITY — {source_item_id, canonical_content_commitment} when both parse, else the TRANSPORT IDENTITY (the
  digest of the submission's raw bytes, or a transport-supplied idempotency key ONLY where the transport
  guarantees it stable across retries of one submission — a §E obligation; a per-attempt transport id would
  mint a stub per retry, rig173 B7) — and under that identity ONE INGESTION STATE: WAITING (non-terminal, the""",
"""every ADMITTED submission has a TRANSPORT
  IDENTITY always and a CONTENT IDENTITY only once its content VERIFIES (rig178 T1: "{source_item_id,
  commitment} when both parse" made a claimed pair an identity before the bytes behind it were checked) — the
  CONTENT IDENTITY is {source_item_id, canonical_content_commitment} of a verified submission; the TRANSPORT
  IDENTITY is CONTENT-BOUND — the digest of the CANONICAL SUBMISSION (the received bytes with the transport's
  DECLARED volatile wrapper fields — attempt ids, send timestamps — excluded, a §E obligation) or, where the transport guarantees an
  idempotency key stable across retries of one submission (a §E obligation), that key BOUND to that same digest
  (a key alone is never an identity: reused over different bytes it would replay a stub for bytes never seen;
  a per-attempt transport id would mint a stub per retry, rig173 B7) — and under those identities ONE INGESTION
  STATE (a content identity and every transport identity of a submission carrying it resolve to the SAME
  state): WAITING (non-terminal, the""")
rep("""commitment over the submission's replay identity — its {source_item_id, commitment} when both parse, else its
  transport identity; never an unkeyed hash, A7)""",
"""commitment over the submission's replay identity — its content identity {source_item_id, commitment} when the
  content VERIFIED (a verified but shape-malformed submission), else its transport identity (an unverifiable
  submission never carries a content identity, rig178 T1); never an unkeyed hash, A7)""")
rep("""scope; CONTENT, never receipts — rig175 C2: receipts made one member set two bases), bound beside the screen
  by R1 for the cell and by P1 per claimed class exactly as a stub is""",
"""scope; CONTENT, never receipts — rig175 C2: receipts made one member set two bases), bound — iff
  component_scope_current AND NOT retirement_effective, below — beside the screen
  by R1 for the cell and by P1 per claimed class exactly as a stub is""")

# ---- §E: the identity definition, the component sentence, the order list ----
rep("""the door and consumes nothing; every ADMITTED submission has ONE replay identity — {source_item_id,
  commitment}, else its transport identity — and, from the NON-terminal state WAITING""",
"""the door and consumes nothing; every ADMITTED submission has a TRANSPORT identity always and a CONTENT
  identity {source_item_id, commitment} only once its content verifies — and, from the NON-terminal state WAITING""")
rep("""disclose, while a verified colliding duplicate forms a COMPONENT the same three disclose as a BLOCKER;""",
"""disclose, while a verified, ingestion-shape-valid, identity-consuming submission colliding under a held id
  forms a COMPONENT the same three disclose as a BLOCKER while its finding is bound;""")
rep("""staging rule needs; INGESTION ORDER — replay identity, then verification, then ingestion-shape validation
  (which alone decides whether a submission consumes its source_item_id), then the identity test;""",
"""staging rule needs; INGESTION ORDER — transport-exact replay where the submission digest is already admitted,
  then verification, then the verified content replay, then ingestion-shape validation
  (which alone decides whether a submission consumes its source_item_id), then the identity test;""")

# ---- more SUPERSEDED marks: v1.29 (1), v1.28 (2), v1.25 (4), v1.24 ----
rep("""a hard component in the other) → THE ORDER IS: exact replay by replay identity → commitment verification →
INGESTION-SHAPE VALIDATION, which decides whether the submission is IDENTITY-CONSUMING → the identity test;""",
"""a hard component in the other) → THE ORDER IS: exact replay by replay identity → commitment verification →
INGESTION-SHAPE VALIDATION, which decides whether the submission is IDENTITY-CONSUMING → the identity test
(SUPERSEDED in v1.30: replay is SPLIT — a transport-exact replay first, a content-identity replay only after
verification);""")
rep("""orders → the same blocker) until the source RETIRES the component by withdrawal; the disposition COLLISION STUB is""",
"""orders → the same blocker) until the source RETIRES the component by withdrawal (SUPERSEDED in v1.30: the
finding is bound only while component_scope_current AND NOT retirement_effective); the disposition COLLISION STUB is""")
rep("""IDENTITY ({source_item_id, commitment} when both parse, else the TRANSPORT IDENTITY — the digest of the raw
bytes, or a transport idempotency key only where it is stable across retries) and under it ONE ingestion state,""",
"""IDENTITY ({source_item_id, commitment} when both parse, else the TRANSPORT IDENTITY — the digest of the raw
bytes, or a transport idempotency key only where it is stable across retries) (SUPERSEDED in v1.30: a transport
identity always, a content identity only once the content verifies) and under it ONE ingestion state,""")
rep("""least replacement, the replacements conflicting as unpointed same-slot records); a withdrawal targets only a
stored record or proof, is never a candidate and enters no phase batch;""",
"""least replacement, the replacements conflicting as unpointed same-slot records); a withdrawal targets only a
stored record or proof (SUPERSEDED in v1.29: the reference-effect matrix — an ANSWER identity or a collision
component may also be targeted), is never a candidate and enters no phase batch;""")


rep("""has a different content and therefore a different replay identity, so it is
  a new submission;""", """has a different content and therefore different identities, so it is
  a new submission;""")
rep("""a transport idempotency key is used as a replay identity only
  where the transport guarantees it stable across retries; and the REQUERY GUARANTEE""",
"""a transport idempotency key is used as a replay identity only
  where the transport guarantees it stable across retries and only bound to the canonical submission digest,
  never alone, and every transport declares the volatile wrapper fields that digest excludes; and the REQUERY GUARANTEE""")
rep("the re-query selector over verified, non-member, non-withdrawn answers; Sol RATIFIED",
    "the re-query selector over verified, non-member, non-withdrawn answers (population stated in full in v1.30); Sol RATIFIED")
rep("blocks the scopes they claim (SOURCE_ITEM_IDENTITY_COLLISION, hard), never 'the original stands';",
    "blocks the scopes they claim (SOURCE_ITEM_IDENTITY_COLLISION, hard; since v1.30 only while component_scope_current and not retirement_effective), never 'the original stands';")

out = src
for o, n in edits: out = out.replace(o, n, 1)
open('/home/claude/sheet/EARNED-RUNTIME-SHEET-v1.7.31.txt', 'w', encoding='utf-8').write(out)
L = out.split('\n'); assert L[1:771] == base26[1:771], "FROZEN BODY CHANGED"
print("edits", len(edits), "lines", len(L), "bytes", len(out.encode()))
