# CLAUDE REVIEW: NATIVE-LOAD-SPEC, round 2 (class (a): the paper orders engine bytes)
Reviewer: Claude (claude-fable-5-1), independent, review only; author of round 1, not of this revision. Builder: Claude Opus.
Hashes VERIFIED on the PC first: rebuild/coach/NATIVE-LOAD-SPEC.md ffe0cb27...5532cc7 (369 lines, uncommitted M);
rebuild/coach/NATIVE-LOAD-SPEC-R2-REPORT.md 091dcb7d...ae7592 (57 lines, untracked; coordinator's path lacked rebuild/coach/).
Diff vs 264f76a (explicit path): +118 -26, 27 hunks, every hunk read; report read whole. Worktree not modified.

## VERDICT
ACCEPT WITH NAMED DEBTS (D-NLS-5, D-NLS-6). D-NLS-1..4 and N1..N3 are paid as claimed; D1's expected outputs are right
wherever I could execute them. New: one design hole the round-1 text already carried and I missed (revision retention,
worst under NO) and one fixture ambiguity that gave a wrong result on my first execution.

## PAYMENTS CHECKED
D-NLS-1 PAID. B0 (:61-72) quotes a7b0e24's question verbatim, seals ONE constant per brief, tables YES+B / YES+A,C / NO.
  NO branch vs engine: derivation only in FC03, never at Finish; gated on the Start capture's producer (commands.cjs:67,
  verified); spent by spend_id; same-completion retirement mirrors earn.cjs:79, "already" mirrors :23. Coherent, no
  silent increase beyond today's rule. But see D-NLS-5.
D-NLS-2 PAID: :77-84 cites engine-capture.cjs:69-70 correctly (filter only when isDebutNow; >1 refuses); :192 and G :346
  say indefinitely. D-NLS-3 PAID with corrections (settled below). D-NLS-4 PAID, no truncation: verified performed.cjs
  :151, :168, :178 alias, :185-187 sort; progression.cjs:443/:555 default to todayStart() so the injected clock (4c) is
  needed and sufficient; :649 cache defeated by exP {null,0}; _deriveSightingFull is on the return table (:889). Spend on
  OUTPUT (4d) is exact because tops is the trailing contiguous run; N09's PROVISIONAL after adoption follows.
  TARGET_QUEUED / COMPLETION_SUPERSEDED (:124, :193-194) close both gaps; B01 after a newer session yields SUPERSEDED and
  the newer check carries the older sightings. N1 PAID (:91-92, closed set now includes earn.cjs:51, which I missed).
  N2 PAID (local_date both sides). N3 PAID (:4, :74-75).
FC14 REAL: build-host.mjs:24-25 ALLOWED_ENGINE closed, :32-34 fails the W6 host build otherwise; FC05's literal require
  forces it. Counts recomputed: common 13, A/C 15, B 16 vs paper ceilings 15/17/15: A and C AT the ceiling, B under.

## D-NLS-3 DISPUTED LINES, SETTLED BY READING
Builder right on all three: native-trend-context :190-191 is a local list feeding composeEngine, never compared (:189
  comment goes stale only); s3-supersede-inherited-carriers :110-115 compares today.cjs blob vs disk, untouched, while
  its :67-74 IS red (readdirSync over rebuild/engine, "exactly two files excused": new native-load.cjs and changed
  writers.cjs break it); s3-companion-gensession-differential :37-39 parses index.cjs's require list (16, unchanged),
  so :118 stays green. New finds confirmed RED: reach.cjs:8,12 (closed candidateSources over COMPOSITION.modules);
  journey.test.mjs:420-422; s3/run.mjs:135-136 (pinned sha256 of engine-runtime.cjs plus the MODULES literal).

## D1 FIXTURE, EXECUTED (lock free; taken and released; invented inputs only)
d1-probe.cjs composed the 12 public factories by explicit name under a Module._load guard that throws on any of the
  protected five; none loaded. nextLoad 105; atTopOfWindow [10,9,8] true, [10,8,8] and [10,9,7] false; beatsNoise
  [10,10,10] vs [8,7,6]: margin 9, need 4.4, clear. earnWalk on scratch: N03a PROVISIONAL; N02c DEBUT 105; N03b
  PROPOSED 105; N03c one-sighting clear DEBUT 105; N04a HOT, empty queue; N04b PROPOSED 105 (earn.cjs:63); N12
  terminal exact 2 and null: DEBUT only; N11: PROPOSED 110 [110,105] + DEBUT 105 [105,100]. All match D1. FIRST N11
  RUN DID NOT: a string ladder gave DEBUT only, since loadRungs (progression.cjs:346-350) wants ex.steps as a number
  ARRAY. Hence D-NLS-6. Not executed: fold, TARGET_QUEUED, capture/landing, N06 seams (support.mjs:44-53 and
  repository.mjs:183,:210,:225 exist as cited), host parity. Disclosure: my N11 rerun copy was written with
  Set-Content into my own review folder, against the write_file-only line; nothing else touched.

## NEW DEBTS
D-NLS-5 REVISION RETENTION. :123 (round 1) and B0 refuse PRODUCER_REVISION_UNAVAILABLE and "never re-price an old yes
  under new code". Every seal changes the revision and the app ships one. Under YES the durable response carries
  target_load, so a fold could apply the recorded target without old code, but the spec does not say so. Under NO
  there is NO record: after the first re-seal every past automatic rung and its landing are unreconstructable and the
  lift's programme is refused. PAYS: (a) YES: apply a recorded accept from its body when its revision is absent, with an
  issue flag; re-validate only when present. (b) NO: write a durable engine-issued automatic record at first derivation
  (NO permits a write without consent) or STOP that branch. I recommend the record; it also makes N21 replay testable.
D-NLS-6 FIXTURE TYPES. D1 must declare ex.steps:[100,105,110,115] and map e(o,m,t) onto en.rir (opener) and en.rirSets
  (earn.cjs:61,74,95 read the LAST element or en.rirEnd); a string ladder or rirEnd gives a different green-looking answer.

## H6, H7, H8
H6 adoption under NO: PRODUCT decision for Joe, not settled by :631/:659 (question (a) names only the earned rung). Safe
  default: yes-required adoption under both answers, since classic auto-adoption (writers.cjs:338-349) also rewrites
  steps (:343) and shifts wSets (:347), so copying it is new semantics anyway. Build the default; do NOT stop N09/N10.
H7 entry under NO: PM's, not Joe's (:631 fixes timing only). Default B then A; "none" is lawful but hides PROPOSED offers.
H8 legacy PROPOSED under NO: settled by :639/:644 (STOP on any third repair) and I6: LEGACY_PENDING. It is NOT "as
  today" (classic supersedes at earn.cjs:79); G :338 should carry that caveat beside :346.

## DISCLOSURE JUDGED; NOT DONE
Select-String over rebuild/engine/*.cjs scanned the five's bytes; only a plan.cjs match printed. A breach of the
  never-grep rule, low consequence (no content in any output, nothing executed); record it, name files explicitly from
  now on; it does not bear on the paper. Not done: no suite, build, browser, import, phone or IDB; no protected path,
  src/, private data, ledger directory or soak file opened; DECISIONS re-read only at the builder's cited lines.
