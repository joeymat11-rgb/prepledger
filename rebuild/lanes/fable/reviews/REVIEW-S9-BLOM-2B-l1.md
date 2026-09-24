# REVIEW-S9-BLOM-2B-l1: S9 round 5 (b-lom option 2(b)) - independent review (claude-fable-5-1, 2026-09-24)

Reviewed: the UNCOMMITTED change in %TEMP%\earned-s9int (rebuild/b-s9-integration, HEAD 6dc2596 = origin), the two paths
`git status` shows modified: rebuild/lanes/b/tooling/packages/S9.json and rebuild/lanes/b/S9-FINAL-ASSEMBLY-PREP.md
(section "Round 5"). Read-only for both. Nothing committed, fetched, switched or run under a test harness by me.
Authorities read verbatim from the PM tree (t2-client-core-pm, DECISIONS.md 799 lines): :798 (soak-stub protected; b-lom takes
BLOM-OPTIONS 2(b): S9.json drops the b-lom child, S8 "# pass 30" stays the last sealed evidence, debt D-BLOM re-measured after
2026-10-05) and :799 (brief 3.3 read as the 24 S8 children other than b-lom; corrected premise: today-model.cjs at
legacy-order.test.mjs:38 moved after 0cd07be plus eight m3/m4 code files changed since; CI at rebuild.yml:331). BLOM-OPTIONS.md
read whole at earned-h20 (only that file there). No *soak* name opened; every git query carried explicit paths after `--` and
`:(exclude,glob)**/*soak*` plus `**/*soak*/**`. Every sha256 below is node crypto over raw bytes (git show via child_process
Buffer, or fs.readFileSync); no PowerShell redirect was hashed.

## VERDICT: ACCEPT WITH NAMED DEBTS
The diff is exactly what round 5 claims: one child object removed, one note tail rewritten, one note appended, nothing else.
The removal is permitted by every b-package.cjs rule I traced and by brief 3.3 as :799 reads it. Both b-lom cell files stay
carried at pre === post === disk. D-BLOM reproduces measurement for measurement. Debts D1-D5 below; D1 is pre-existing in
6dc2596 (not in this diff) and blocks the seal chain of 5.7 until paid.

## 1. Scope of the diff (measured, parse-compared HEAD blob vs working file)
- HEAD S9.json sha256 a1f9fa38e6cb43513b82fc31f9d08852821a67f3a8cccf5a2704c831dfd83ce9, 89998 B, 1790 lines.
- WORK S9.json sha256 c05a8e34639d8545eba36d7902f442637c7037e1a1a58e077ded0e6186038c8f, 91266 B, 1781 lines. = 5.1's claim.
- Both: CR count 0 (LF only), `JSON.stringify(parsed, null, 2) + "\n"` byte-equal (canonical 2-space form kept),
  U+2013 16 / U+2014 17 in both (none added), 22 top-level keys in the same order.
- 20 of 22 top-level keys byte-identical by JSON.stringify: version, lanePackage, packageId, status, brief, sourceBase, dIds,
  laws, carriedAcceptedIds, privateLiveTriggered, parent, tooling, product, coverage, release, carrierSuccessor, witnessFlips,
  protectedSurfaces, authorizations, artifact. Changed: children, notes.
- children 33 -> 32; removed = ["b-lom"] (HEAD :1669-1678, argv legacy-order.test.mjs + legacy-order-mapping.test.cjs, needle
  null); added = []; the other 32 objects are identical and in the same order (JSON.stringify of HEAD minus b-lom === WORK).
- notes: [0],[2],[3] identical; [1] shares its prefix through "...must confirm;" and its tail is now "b-lom is not a child of
  this package (D-BLOM, below)."; [4] appended, 1627 chars, ASCII only, at WORK :1779. Diff numstat +3 -12. Verified.
- The only numbers in the spec are version and five ledger-line numbers (789, 528, 60, 49, 788); nothing counts children.
- "b-lom" occurs in WORK only as the product key at :188 and in notes[1]/[4]; "legacy-order" only at :188, :848, :903.

## 2. The removal under b-package.cjs 5321181a (= tooling.runnerSha256 = disk; read, never loaded)
Each cited line re-read at the number cited: :1947-1953 iterate s.children only, :1951 CHILD-NEEDLE-EMPTY; :1929 carried needs
only pre === post; :1963-1966 only pinned-unchanged needs a declared child; :2783 children(), :2794-2797 spawns s.children only,
:2808 CHILD-REQUIRED-EXIT-ZERO, :2824 needle at line start; :1119-1126 acceptedVerdicts, called only at :2973 inside
successorProof, which returns at :2881 because S9.json:1327 `"successors": null`; :2292-2297 pins() re-asserts the parent's
product and executionPins (never its children); :799-800 ownChildren counts children that run a role-new file (b-lom ran two
carried files, so MIN_OWN_CHILDREN :341 is untouched); :427-431 CHILD_ROOTS lists rebuild/lanes/d/b-lom/ as an allowed root and
requires nothing. No rule reads bound.acceptance.children except acceptedVerdicts (:1120).
Counterexample I tried and that does NOT bite: coverage() :3256 COVERAGE-CHILD-NOT-EXECUTED and :3276
INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET would refuse a dropped child that the parent's coverage.byChild names as a
carrier. Measured: S8's byChild is {} (0 gates), S9 coverage.inherited is {} and equals byChild minus the five superseded
gates, coverage.moves is {}, and every child the five superseded gates' evidence names (s9-sup-*, a0-journeys, today-17,
s9-engine-files-differential) is declared. No dangling carrier.

## 3. Brief 3.3 under :799
S9-UI-PINS-BRIEF.md on disk = abf3f670835803b94ac768bf0c0b0a0de5d2570302abd7651179e9005efb3f58 (122946 B) = S9.brief.sha256 =
:789. Lines 458-459 read literally "All 25 children `packages/S8.json` declares are re-declared by S9 and must be OBSERVED
exit 0 at their needles under `--ci`". Measured against acceptance-s8-real-shape.json (disk = 3cf58e0e = blob at 0cd07be =
parent.options[0].sha256): S8 declares 25 children; 18 stand in S9 by name; 6 are re-pointed mirrors (s8-sup-* x5 and
engine-files-differential -> s9-*); b-lom is the ONLY S8 child with no S9 counterpart; the remaining 8 S9 children are S9's
own. 18 + 6 + 8 = 32. So the spec is the brief as :799 reads it (24 re-declared), and the ruling, not the brief text,
carries that reading (see D5).

## 4. The two b-lom cell files stay carried
- rebuild/lanes/d/b-lom/legacy-order.test.mjs: S9 product :188 role carried, pre = post = f091a560...; S8 product and
  executionPins the same; disk = HEAD blob = 0cd07be blob = f091a560. pre === post holds (:1929).
- rebuild/m4/workout/test/legacy-order-mapping.test.cjs: S9 product :903 role carried, pre = post = f7a3e4a4...; S8 the same;
  disk = HEAD = 0cd07be = f7a3e4a4.

## 5. D-BLOM disclosure against :799 (every fact re-measured)
- legacy-order.test.mjs:38 is `import TodayModel from '../../../m3/w7-preview/today/today-model.cjs';`. Verified.
- today-model.cjs: blob bddeeacf at 0cd07be -> 645c1bec at HEAD; `git log 0cd07be..HEAD -- <path>` = 3435fa9, 9742490,
  5111716. No key of S8's artifact or of S9.json names today-model.cjs. Verified.
- today-bindings.mjs: 23c11797 at 0cd07be = HEAD = disk = S9 carried pre/post = S8 post (S8 edited 8694a5d6 -> 23c11797);
  `git log 0cd07be..HEAD` on it is empty. :799's correction of :798 stands.
- The walk (legacy-order.test.mjs:176-192; callers(), roots rebuild/m3 and rebuild/m4; skip :178 = test|node_modules|.tmp
  dirs, *.test.(c|m)?js, *-mutants.(c|m)?js; only .cjs/.mjs/.js; provider file excluded): `git diff --name-status 0cd07be
  6dc2596 -- rebuild/m3 rebuild/m4` with soak names excluded from the query and again in memory = 25 rows; 23 code; the walk's
  filter keeps EXACTLY the eight the note lists (A passphrase.cjs, M unseal.cjs, M import-bundle.mjs, M import-screen.mjs,
  M design.cjs, M today-app.cjs, M today-model.cjs, A setup-tags.cjs). The 15 it skips are 14 *.test.* files plus
  rebuild/m4/workout/test/s9-engine-files-differential.cjs (skipped by the test/ dir rule); keeping test/ dirs gives 9 = the
  "today-model.cjs plus eight" of :799. The note states the walk's own count and says which paths were not measured. Verified,
  with the wording nuance recorded as D2.
- "# pass 30" is S8's sealed b-lom needle (acceptance-s8 children). 0cd07be carries the accepted artifact bytes 3cf58e0e, so
  "S8's seal commit 0cd07be (this spec's sourceBase)" is defensible; its subject is "S8-REAL-SHAPE: proposed artifact".
- rebuild.yml:331 (unmodified in the tree, committed in 6dc2596) is `run: node --test rebuild/lanes/d/b-lom/legacy-order.test.mjs
  rebuild/m4/workout/test/legacy-order-mapping.test.cjs`, inside the single job public-gates (:18-462) with no `if:` and no
  continue-on-error, so it runs wherever the standing step at :162 passes (the chain, and after the seal), not on the unsealed
  integration branch. The note's "CI keeps running the test at rebuild.yml:331" is true in that sense.
- The note discloses: walk reads every code file under m3/m4 incl. the protected soak app; both files carried; last sealed
  evidence does not prove this tree; the eight files; re-measurement route (hosted-blom NO-path packet needs a re-point
  because its runner/re-pin require exactly one b-lom child, per BLOM-OPTIONS). That is :799's D-BLOM in full.

## 6. The static-check claim (5.5)
- %TEMP%\opus55-s9prep\staticcheck.cjs (10918 B, 2026-09-23) read whole: requires rebuild/conform/v4/postfix/legacy-gates.cjs
  (-> ./target.cjs -> ./trace-v2.cjs) and strict-json.cjs; those four require only node builtins (legacy-gates.cjs:102 has a
  dynamic require inside build(), which staticcheck never calls); its first ck() throws if require.cache holds rebuild/engine/*,
  a protected-five path or b-package.cjs. It spawns nothing. 28 ck() calls; the children check returns `<n> children` and the
  last returns sha256(raw). staticcheck-attip.cjs (740 B) only swaps the CHAIN constant in memory.
- Re-derived without running it: SPEC_KEYS closure with release optional holds (22 keys); every child has a needle of >= 8 chars
  after the drop (the only null was b-lom), so "28 PASS, 0 REFUSED, 32 children, sha c05a8e34" is what the script must print;
  "27 PASS, 1 REFUSED CHILD-NEEDLE-EMPTY b-lom" is what it must print on the HEAD blob. rebuild.yml F2 facts re-checked (:162
  standing step `--ci --package S9`; no S8 step).
- NOT re-run by me: %TEMP%\earned-runtime.lock was held by "opus55 NATIVE-LOAD builder ... (earned-nlr)" continuously from my
  first look (07:39) through four retries to 07:58, so I never held the slot. The claim is reproducible in structure; the
  verifyReceipt rows against 94eebbc/65cf85a are the only part I did not independently evaluate.

## 7. Where a1f9fa38 (the old S9.json sha256) is cited (5.6)
git grep over ALL 562 remote-tracking refs (explicit pathspecs rebuild, .github, package.json, README.md, tools; soak, private,
ledger, src, history.js excluded), 84.8 s: hits only on
- origin/rebuild/b-s10-integration 62788b1: S10.json:209 (pre of the superseded-by-child S9.json pin), S10-REGEN.cjs:17 and
  :263, REVIEW-S10-INTEGRATION-l3.md:76, S9-FINAL-ASSEMBLY-PREP.md:4, and S10-INTEGRATION-REPORT.md at :38, :45 AND :63 (5.6
  lists only :63 - see D4). S10.json:1819 there is `"name": "b-lom"` as :799 says.
- origin/rebuild/b-s9-integration 6dc2596: S9-FINAL-ASSEMBLY-PREP.md:4 only.
- origin/rebuild/t2-client-core 65cf85a: DECISIONS.md:790 and HANDOFF-PM-2026-09-24-CLAUDE-OPUS-5-5.md:37.
- p-s9-exporter-v3 9a29c3a and p-s9-hosted20-proof / -run 7fe1c5d: no hit. No other ref cites it.
- This worktree: S9-FINAL-ASSEMBLY-PREP.md :4 (superseded header) plus the round-5 lines that discuss it (:94, :122, :125,
  :127-128); no test, workflow or tool. earned-h20 hosted-blom/ not searched (only BLOM-OPTIONS.md may be opened; it does not
  cite the sha). 5.6 is complete at file level.

## 8. Hygiene
- The diff and the report contain no content of any soak-named file; the word appears only as a name in prose. The builder's
  "no *soak* opened" is consistent with every artifact I can see; the process itself is not auditable from here.
- S9-FINAL-ASSEMBLY-PREP.md: working sha256 ed2386e544f1958b15ec0c973f473aa59580875e5ebe9e7ed1a7f420cb143288 (14899 B), CR 0,
  U+2013/U+2014 0 (HEAD also 0); the 61 added lines are ASCII. Round 5 is appended after the round-4 text, which keeps the stale
  :4 header (superseded in 5.1, as the report says).
- No stale lock from the S9 builder: the lock present today belongs to a different, live job.

## 9. Named debts (numbered; none is a defect of the round-5 diff itself)
D1 (PRE-EXISTING IN 6dc2596; BLOCKS THE SEAL CHAIN OF 5.7 UNTIL PAID). rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
  :77-80 copies b-package's SPEC_KEYS "by value" as 21 keys, without `release`; b-package.cjs:1172-1183 (H5) has 22 with
  `release` optional. The fence's reseal-child condition (1) at :280 is strict equality on the key set of HEAD:<spec>. S9.json
  gained the top-level `release` block only at 6dc2596 (round 4 Hunk D; 7fe1c5d5 and HEAD~1 have 21 keys). Evaluated exactly as
  written: condition (1) refuses at HEAD and in the working file (extra key = release) and does not refuse at 7fe1c5d5, where
  the hosted needle "# pass 53" was observed. On this branch the claim path IS entered: the chain ref 65cf85a has no
  packages/S9.json, `git diff --name-status <merge-base 4f89fb9> HEAD` lists it at status A and the S8 artifact is untouched
  (tampered = false). bad(1) -> no() -> status "fail" with FENCE-RESEAL-CHILD-UNVERIFIED (1), and THE REAL ROW (:1935-1941)
  then asserts refusals == [] and goes red. Consequences: rebuild.yml:271 (the fence lane-cell step) is red on this branch, and
  the S9 child sealed-inventory-fence cannot exit 0 under `--ci --package S9`, so the standing step and the seal refuse at
  CHILD-REQUIRED-EXIT-ZERO regardless of b-lom. Pay it as a reviewed, red-first edit to the fence cell (mirror the freeze
  pattern, `{...spec, release: null}` against 22 keys, or add `release` to its list) with a fresh observed needle for that
  child; the cell is a role-declared S9 product file, so its pin moves with it. Not in scope of this diff; must precede the
  exporter/standing-step steps in 5.7.
D2 (WORDING). The note says "eight m3/m4 code files ... today-model.cjs among them" (walk-accurate: 8 including it); :799 says
  "today-model.cjs ... plus eight" (9, counting s9-engine-files-differential.cjs, which the walk skips under test/ at :178).
  5.3 discloses the difference. The PM should either amend :799's arithmetic or accept the note's count in the seal line, so the
  ledger and the sealed note do not disagree by one file.
D3 (5.2 ENUMERATION). "The cells that read S9.json (six s9-* mirrors, release-object, reference-closure)" omits
  sealed-inventory-fence.test.mjs, which reads packages/S9.json's key closure (:280, and it is where D1 lives), and
  today/test/package.test.cjs, which names it in a comment (:108). The conclusion "no other needle moves with the drop" still
  holds: neither counts children nor names b-lom or legacy-order, and dropping a child leaves the key set unchanged.
D4 (5.6 LINE LEVEL). S10-INTEGRATION-REPORT.md at 62788b1 cites a1f9fa38 at :38 and :45 as well as :63.
D5 (INFORMATIONAL). The brief of record still says "All 25 children ... re-declared" (:458-459) under the binding sha abf3f670;
  only :799 reconciles it to 24. No spec or runner check reads that sentence, so nothing refuses, but a later reader of the
  brief alone will see 25.

## 10. What I could not do
- Run staticcheck.cjs (lock held by another live job the whole session; see 6). Run any child (not granted; not needed).
- Audit the builder's process for *soak* names beyond the artifacts. Search earned-h20 hosted-blom/ beyond BLOM-OPTIONS.md.

Files: this review is the only file I wrote (rebuild/lanes/fable/reviews/REVIEW-S9-BLOM-2B-l1.md, LF, ASCII). Scratch scripts
verify1-8.cjs/grep6.cjs live in %TEMP%\fable-s9r5 (outside the worktree).
