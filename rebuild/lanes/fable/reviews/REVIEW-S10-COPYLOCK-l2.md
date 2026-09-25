# REVIEW-S10-COPYLOCK-l2 (Fable 5.1, independent, 2026-09-25)

Object: copy lock round 2 in worktree earned-s10-copylock (detached f97924a), judged against REVIEW-S10-COPYLOCK-l1
(REJECT, F1-F4) and DECISIONS:818 at 9d4816d. I wrote neither round 1 nor its review. Files read whole; shas
re-measured by me and equal to the builder's: copy-lock.cjs 7bc18462, copy-lock-states.mjs f49eb98d,
copy-lock.test.mjs 55ceef75, copy-lock.corpus.json e3b1be10, copy-lock-measure.mjs 68776f29 (unchanged from round 1),
COPY-LOCK.md 7dd1b122. Round-1 originals in %TEMP%\s10-copylock-r2 re-hashed: 21114cab / 1baede97 / b92c0f0c /
a5d9dcbf / 68776f29 / c3ff0dd7, as l1 recorded. All six LF; the five authored files and COPY-LOCK.md ASCII, no
U+2013/U+2014; the corpus's non-ASCII is measured copy.

## VERDICT: ACCEPT WITH NAMED DEBTS (all four l1 findings fixed and measured; three limits to name, none open today)

## Measured by me (pm-run shared, guard.cjs preloaded, guard log never created, Windows, Node 24.19)
- Green cell: 6/6 pass, exit 0 (l2-green.tap). Red B (COPY_LOCK_UNDER_TEST=design-binding): CL-TWO-SIDED fails
  "the coordinated deletion of "Your food plan." passed design-binding", 2 pass, 1 fail, 3 skipped, exit 1 (l2-redb.tap).
- Re-measure (no --write): 52 files, 958 pieces, 200 declared, N2 error "Add a setting or a cue before saving.
  Nothing was recorded." with ops added 1, corpus sha256 e3b1be10... equal to the pinned bytes (l2-measure.log).
- Corpus diff a5d9dcbf -> e3b1be10 (l2-diff.log): 955 -> 958 entries, added only: ". Nothing was recorded."
  (today-app.cjs 1, today-entry.mjs 1), two "# ..." _headers comment lines from slice/pwa/shell.cjs (never on a
  screen; over-locked by design). Nothing removed, no owner or list membership changed, scanned and tools lists
  identical; one state change, GYM-SETTINGS-N2 gains "six" (the typed value, F3 mounted side). As the builder reported.
- Red-first evidence checked (r2 red0.tap): the new CL-PLANTS rows and the harvest probe fail against the round-1
  lock exactly as the report says (P1 MISSING/UNLOCKED, P2 style, P2 script, P4 template, P4 JS-markup;
  CL-COMPOSED-HARVEST-BLIND-VALUE), 4 pass, 2 fail, exit 1. No row or assertion weakened.
- Round-1 plants P1-P7 re-run by me on private copies: P1, P2, P4, P6, P7 REFUSED by name; P3 and P5 PASSED, which
  is the F4 limit COPY-LOCK.md now names (l2-plants.log).
- No athlete-visible string changed: git diff --stat empty; git status shows only the six untracked lock files and
  the l1 review. today-app.cjs, gym-app.mjs, design.cjs and the template are untouched.
- Answer 5: COPY-LOCK.md answer 5 says "RULED by the PM at DECISIONS:818: the corpus stays sealed; a wording change
  re-measures it in a reseal child with an independent diff review". DECISIONS:818 at 9d4816d (819 lines; extracted
  byte-exact with git show) carries exactly that ruling. Written correctly.

## My own new plants (twelve, private copies, l2-plants.log; controls N8, N9, N11 REFUSED by name)
PASSED, i.e. text the athlete could read that the lock does not see. None of these shapes exists in the tree today
(my static scan l2-scan.log, below), so nothing is unlocked now; each is a limit to name, not a fix to demand.
- N1 a sentence split into lowercase single-word text nodes in the template (<span>nothing</span> ...).
- N6 a locked literal transformed at run time ('Settings could not be read.'.replace(/read/, 'loaded')): the
  literal's count is intact, so MISSING never fires, and what the athlete reads is a sentence nobody locked.
- N7 a sentence decoded at run time (atob of base64).
- N2 / N12 visible text in a data-* attribute (template and JS-carried markup), rendered through dataset.
- N3 visible text in <option label=...>; N10 spoken text in aria-description=.
- N4 a sentence in a .json file under a scan root imported by gym-app.mjs; N5 a sentence in a .mjs under
  today/dist (SKIP_DIRS) imported by gym-app.mjs: the walk sees only the five extensions outside test/dist/.tmp.

Static hunt over the 52 scanned files (l2-scan.log): every attribute value other than the four read ones and
value= that is prose-like and unlocked: 9, all class="..." or svg d="..." (not words). Files under the scan roots
that are not scanned: 41 under test/ dirs, measure-fixture.json (read by measure tests only) and DEPLOYS.md; no
dist/. Run-time transforms on literals: none (.replace/atob on a literal: 0); every join() assembles locked pieces
or the athlete's values, which is answer 2's runtime half and the F4 limit.

## Findings (none blocking)
L1 LIMIT WORDING. COPY-LOCK.md's F4 limit names assembly from lowercase words and code punctuation. The true
   static-side limit is wider: any run-time transformation or decoding of a literal (N6, N7) and markup that splits
   words into lowercase text nodes (N1) are equally unseen, and only the five mounted gym states see composed
   output. One sentence in "Named limits"; no code, no corpus change. Name at landing or carry as D-COPYLOCK-XFORM.
L2 LIMIT. Attributes other than placeholder/aria-label/title/alt/value can carry read or spoken text (option
   label, data-* via dataset, aria-description); neither side reads them. Zero such values today. Carry as
   D-COPYLOCK-ATTRS; extending ATTRS and harvest to label / aria-description is a small later round.
L3 PRECISION. Answer 2's "a NEW file under them is scanned unlisted" holds for .cjs/.mjs/.js/.html/.css outside
   test, node_modules, dist and .tmp only; a .json/.svg/.txt copy file or a product import from those dirs is
   unseen (N4, N5). Say so in answer 2; carry as D-COPYLOCK-EXT.

## Debts carried from l1 (unchanged): D-COPYLOCK-LINUX, D-COPYLOCK-TODAY-MOUNT, D-COPYLOCK-REDFIRST-SCOPE;
PM-DECISION-1 is now closed by DECISIONS:818 and written as answer 5.

Scratch: %TEMP%\s10-copylock-l2 (t.cmd, s.cmd, attack-l2.mjs, scan-l2.cjs, diff-l2.cjs, taps and logs, two
byte-exact DECISIONS.md extracts). No commit, no push, no product byte, no *soak* file, nothing under rebuild/engine
read; the protected five were not loaded (guard log absent); the worktree was never edited except this file.
