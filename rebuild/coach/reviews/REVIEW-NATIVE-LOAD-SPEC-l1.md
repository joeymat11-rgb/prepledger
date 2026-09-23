# CLAUDE REVIEW: NATIVE-LOAD-SPEC, round 1 (class (a): the paper orders engine bytes)
Reviewer: Claude (claude-fable-5-1), independent, review only. Author: Astra job 96. Paper: rebuild/coach/NATIVE-LOAD-SPEC.md
at origin/rebuild/c-native-load-spec 264f76a (277 lines, read whole, twice). Worktree read only; nothing modified there.
Blind first: EARN-ON-PHONE-OPTIONS.md at 686010d5 (whole), the a7b0e24 correction (full diff vs 686010d5), Claude L2 36afe7c
(whole), DECISIONS.md lines 631, 636, 637, 639, 644, 659, 704 (origin/rebuild/t2-client-core, explicit path). PC date 2026-09-23.

## VERDICT
ACCEPT WITH NAMED DEBTS (D-NLS-1 to D-NLS-4). The common part for A, B and C is defined coherently: seven invariants, one
closed decision shape, one source fold, two engine items only (new E/native-load.cjs; a six-line pure move of writers.cjs
:234-239), red-first rows with planted defects, entries thin and separable. Nothing in it raises a weight silently: every
path is yes-only, decline writes nothing, history is never deleted. The debts are omissions the builder cannot supply alone.

## FINDINGS (each with evidence)
D-NLS-1 (must pay before the brief) THE CONSENT RULE IS ASSUMED, NOT RULED. Spec :8 (I1) and :105 ("ordinary DEBUT as an
  OFFER requiring yes") convert today's automatic one-rung debut (earn.cjs:88, rule text "Auto-queued") into yes-only, and
  :17 says only "Joe has chosen timing, not A/B/C or engine scope". The corrected options paper (a7b0e24, For Joe lines 6-8
  and its first question) and DECISIONS:659 make this an OPEN owner question; Claude L2 36afe7c N1 says a NO has no route.
  The spec has no NO branch and section H does not list the question. PAYS: add it to H and to G; state what the spec
  becomes if he keeps the automatic rung (which candidates then still need a tap: the PROPOSED two-rung/early ones only).
D-NLS-2 THE THIRD ENGINE REPAIR IS NOT NAMED. rebuild/m4/workout/engine-capture.cjs:69-70 refuses capture
  (ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED) for any lift with more than one unfinished debut/unlock entry, PROPOSED included.
  a7b0e24 and DECISIONS:644 D2 call its repair a separate owner-held engine change. The spec avoids adding to a pair
  (:119 "Reject an existing unresolved same-lift structural entry"; :100 LEGACY_PENDING) but never cites :69, and the
  consequence is unstated: a lift carrying an imported or merge-minted PROPOSED entry (the check measured merge mints one)
  can never earn natively, because no decline exists (L2 D-EOP-DECLINE) and native Finish no longer runs the classic
  earn that supersedes it (earn.cjs:23,:79). PAYS: name engine-capture.cjs:69 as a dependency and say the lift waits
  until the third repair or a tap; G :261 should say "may wait indefinitely", not "can also stay waiting".
D-NLS-3 CHANGED-ASSERTION INVENTORY INCOMPLETE. :229-230 name two files. FC04 changes MODULES (13) and EXPOSED (7), and
  these also pin the five names or the module list: rebuild/m4/workout/test/native-trend-context.test.cjs:191,453;
  test/s3-companion-membership.test.cjs:186; test/s3-supersede-defect-witnesses.test.cjs:152;
  test/s3-supersede-inherited-carriers.test.cjs:115 ("exactly one member is added"); test/s3-companion-gensession-
  differential.test.cjs:118; rebuild/m4/spec/native-carriers-source.cjs:13 RETAINED list; native-next-target-candidate/
  fixture.cjs:70 ENGINE_FILES. Each turns red under FC04 and each needs a named child carrier, not a silent edit.
D-NLS-4 NATIVE PENDING TARGET PLUS NEW TOPS IS UNSPECIFIED. deriveSighting spends only through feed " EARNED" lines
  (progression.cjs:616-623,636); the spec forbids forging them (:102) and forbids touching progression.cjs (:200). :102
  "contiguous native suffix AFTER the last semantic spend" therefore means the evaluator hands deriveSighting a TRUNCATED
  state view while earnWalk's beatsNoise needs the FULL one (:105 "keep full typed facts"); how both views are built
  from one `s` is not written. And the outcome table (:146-170) has no code for "a native target is already queued for
  this lift and the athlete topped again": check would offer, accept would reject (:119). Name it (e.g. TARGET_QUEUED).
N1 (executed, minor) updateOpenerHold on an isolated ex. I copied writers.cjs:234-239 verbatim and ran invented inputs in
  my sandbox (probe gov.cjs): ex without `n` THROWS TypeError at the push line; en.rir null leaves hold unchanged (good);
  an at_least token with valueOf 3 releases a hold and is STORED as an object in scratch rirHist (:235). Strict sites
  `x === 0` (:238) and `openRir9 === 0` (earn.cjs:45) never match a token; that is safe only because performed.cjs makes
  at_least exclusively 3 (spec :29). Spec :67/:104 should say the isolated ex carries `n` and a no-op push, and :68
  should name those two strict sites as the comparison set to prove.
N2 (minor) wAt inconsistency: adoption stamps wAt from the issuance moment (:118), landing from the Close tuple (:121),
  while :75 says moment is audit only. No reader in progression/today/earn/plan/performed reads wAt (grep), so no rule
  moves, but a device clock enters durable state. Use the Close tuple for both.
N3 (minor) The spec is measured at 686010d5 and predates a7b0e24; it answers that paper's new queue-coexistence question
  (no coexistence, :119) without saying it does. Say so, and cite the corrected head.
Verified true (static): counts :194 (common 12, A/C 14, B 15; product touches 8/9/9) recomputed from the table; FC11
  no-edit claim holds (build.mjs FORBIDDEN :79-94 and REQUIRED_INPUTS :98 pin no module count); FB02 :76-86 forwards
  the handle; today-entry.mjs:217-219 and gym-app.mjs:202 are as cited; engine-equivalence.test.cjs:27 asserts 12;
  the :119 queue shape passes today.cjs:55 and :97-98 and engine-capture.cjs:79 (newW equals card.w by construction);
  candidate vectors [110,105]/[105,100] follow earn.cjs:80,88; the governor block is self-contained (ex, en, push only).
Ambiguous for a builder: no row gives a fixture or exact expected output (all left INVENTED); N06 needs abort/ack seams
  on the repository that the spec does not locate; "exported only to private E" (:67) has no mechanism beyond the
  return table, so N20's forbidden-name check must cover updateOpenerHold by name.

## FILES READ (static, explicit paths, none of the protected five, no src/, no private/ledger)
NATIVE-LOAD-SPEC.md whole; EARN-ON-PHONE-OPTIONS.md (686010d5 whole, a7b0e24 diff); REVIEW-EOP-OPTIONS-l2.md; DECISIONS
lines above; rebuild/engine/writers.cjs:222-270,2928; today.cjs:53-57,92-99; earn.cjs:11-48,63,80,88,97; progression.cjs
:186-202,606-653; rebuild/m4/workout/engine-runtime.cjs:30-80; engine-capture.cjs:55-80; rebuild/m3/w6/host/engine-
runtime-host.cjs:55-68; host/test/engine-equivalence.test.cjs:22-32; today/build.mjs:71-98,418-448; gym-host.mjs:74-88;
today-entry.mjs:212-221; gym-app.mjs:200-204; grep of test pins listed in D-NLS-3; grep wAt/eraFresh.
## WHAT I RAN / COULD NOT RUN
Ran: gov.cjs (six copied lines, invented inputs) in the reviewer sandbox, output quoted in N1. Could not run anything on
the PC: %TEMP%\earned-runtime.lock is held by "opus55 CUI1 blocker repair" (written 2026-09-22 20:05); I waited and did
not remove it. Not run: any test suite, the P/ probes, browser, import, or anything touching the protected five.
