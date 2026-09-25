# REVIEW-S10-COPYLOCK-l1 (Fable 5.1, independent, 2026-09-25)

Object: the uncommitted copy lock in worktree earned-s10-copylock (detached f97924a; git status: six untracked files,
no product byte changed). Judged against S10-WORKING-BRIEF c58b892 section 8, runbook T3c, DECISIONS :707 (5f801238),
:723 (f11032b4), :740 (faa8b10c), :780 (d806218b), :798 (a8cd4178), :804 (7cf23cc6); chain read at 85653f4 (818 lines).
Files read whole, shas re-measured and equal to the builder's: copy-lock.cjs 21114cab, copy-lock-states.mjs 1baede97,
copy-lock.test.mjs b92c0f0c, copy-lock.corpus.json a5d9dcbf, copy-lock-measure.mjs 68776f29, COPY-LOCK.md c3ff0dd7.
All LF; the five authored files ASCII; the corpus holds no U+2013/U+2014 (its non-ASCII is measured product copy).

## VERDICT: REJECT (one narrow fix round; everything else holds)

## Measured by me (pm-run shared, guard.cjs preloaded, guard log empty, Windows, Node 24.19)
- Green: 6/6, exit 0 (fable-green.tap). Red B (COPY_LOCK_UNDER_TEST=design-binding): CL-TWO-SIDED fails with
  "the coordinated deletion of "Your food plan." passed design-binding", 2 pass, 3 skipped, exit 1 (fable-redb.tap).
  So the pre-lock guard does let the two-sided deletion through and the lock refuses it by name: brief 519-525 met.
- Composed product: five mounted gym states harvested from the real shell + template over fake-indexeddb, exact string
  set per state pinned, N2 measured (opsAdded 1, Seat four recorded, refusal sentence still on the card): :780 Q5 met.
- Source closure (my scan of every scanned file's relative imports): everything outside the four roots is sealed
  (m3/w6/local, m3/w6/public-client, m4/workout, m4/import, coach/machine-settings-commands, engine/writers,
  w7-preview/browser-engine.cjs and fixtures.cjs). Held by the seal at its owner, as COPY-LOCK.md:69-71 says.
- No athlete-visible string changed: the work is tests and a corpus only. The five Undo strings (:798) and the
  missed-Close sentence (:804) are untouched; the N2 repair is correctly NOT made and goes to Joe as J3.
- CUI0 citation: :707/:723/:733/:740 line shas verified; the caveat (no standalone package-ACCEPTED line) is right.
- My own plants on private copies (fable-plants.log): P6 and P7 refused by name (control); P1-P5 below PASSED.

## Findings
F1 BLOCKING. copy-lock.cjs:154 proseLike drops any piece starting with . # [ or @ as a selector. The athlete-visible
   chunk ". Nothing was recorded." at today-app.cjs:93 (athleteStateFailureCopy, a boot refusal) is therefore NOT in
   the corpus: rewording it to ". Nothing recorded." passes the lock (plant P1, PASSED). This falsifies COPY-LOCK.md:33
   ("every string any state can put on screen from the scanned files") and is a copy-lock gap (brief 13). It is the
   only such piece today (my scan of dropped spaced strings: 22, the other 21 are markup/meta). Fix: treat a leading
   sigil as a selector only when no whitespace follows it, add the P1 shape as a red-first CL-PLANTS row, re-measure,
   new CORPUS_SHA256. Do it now: after S10 seals the same fix costs a reseal child (answer 5).
F2 (fix in the same round, or name as a limit). Inline <style> and <script> bodies in .html are stripped
   (copy-lock.cjs:137) so a sentence in a content: rule inside the template is unseen (P2 PASSED); the runtime
   harvest cannot see CSS-generated text either. Today no scanned .html carries a <style> (index.shell.html has one
   src-only <script>), so nothing is unlocked now.
F3 (same). ATTRS (copy-lock.cjs:139) and harvest (copy-lock-states.mjs:61) read placeholder/aria-label/title/alt only;
   an <input value="..."> is visible text and unseen (P4 PASSED). No scanned .html uses value= today.
F4 (limit, name it). Text assembled from lowercase single words (P3) or carrying = < > (P5) is invisible to the static
   side; only the five mounted states see composed output. COPY-LOCK.md:77 names the lowercase-token case; add
   the assembly and code-punctuation cases so the limit is stated whole.

## Debts to carry (named, not claimed)
- D-COPYLOCK-LINUX: Windows only; Linux at the first CI run reaching the step (COPY-LOCK.md answer 7).
- D-COPYLOCK-TODAY-MOUNT (builder's): no mounted Today-card state; Today words held statically only.
- D-COPYLOCK-REDFIRST-SCOPE: CL-PLANTS, CL-COMPOSED and CL-CLOSURE have no pre-lock red (skipped under
  design-binding); the brief's mandatory red is the two-sided fixture, which is red. Disclosed, not a defect.
- PM-DECISION-1 (not a defect): a sealed corpus makes every wording edit to the released today-app.cjs / gym-app.mjs a
  reseal child again (COPY-LOCK.md:44-48), narrowing :536 (4) for copy. The released-corpus alternative (each change
  cited by a PM ledger line) is not built. The PM should rule this before the corpus sha is pinned by a token line.

Scratch: %TEMP%\fable-cl-review (taps, plants, extracts). No commit, no push, no product byte, nothing under
rebuild/engine read; the protected five were not loaded (guard log absent).
