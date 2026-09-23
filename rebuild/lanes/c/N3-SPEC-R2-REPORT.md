# N3-MACROS-DATA spec, revision R2 report

Builder: Claude (claude-opus-5-5), 2026-09-23. Paper only. Rules file read whole first.
Worktree earned-astra-25, branch rebuild/c-n3-macros-spec, HEAD d3b9cbf2 (clean before work).
Review answered: REVIEW-N3-SPEC-l1.md, sha256 0956e02bbae25d986cd0c2850a990b779022787e3a2aa31e55d4cf6ea4e11696 (read whole).
Ledger lines read at 0526ed7f (origin/rebuild/t2-client-core, youngest DECISIONS): :471 :561 :593 :595 :605 :609 :612.

## Status: every debt D1 to D5 and every F6 item addressed; nothing decided that belongs to Joe

- D1/F1: the cal+pro-required rule is NOT decided. Section 2 mismatch bullet rewritten as OPEN;
  new owner question Q4 in section 11: "May a calories-only or protein-only day still be
  recorded, as the app promises today?" (YES / NO, no recommendation). DEFAULT until he answers:
  today's either-alone rule. Made conditional ("IF Q4 = NO"): section 3 new-save rule, section 6
  bullet, section 7 entry-lead and required-refusal rows, section 8 food-commands and food.test
  rows, section 9 preamble and "required entry" row (default arm is a green control), section 2
  adherence note. Historical partial days stay readable/importable with credit under either answer.
- D2/F2: backup round-trip row DROPPED (rows 16 -> 15). No carrier exists (review grep, restated
  in section 2). Requirement kept as a constraint on any future exporter (section 3), owned by
  that exporter's ticket; section 8 lists no exporter hunk; section 12 updated.
- D3/F3: interim home T/test/food-macros.test.mjs (FREE, present at 7f81f209 with 9 top-level
  test( declarations, no workflow names it, uncounted by CI); final home T/test/food.test.mjs,
  moved or imported in the reseal child (sections 8, 9, 10). Measured: git grep food-macros /
  device-preferences over S8 json and rebuild.yml at d3b9cbf: no hit (exit 1).
- D4/F4: VERSION SKEW recorded in section 2 as a fact (old import refuses WHOLE at
  source-admission :508/:526; old correction drops fat/carbs from the winning record, earlier op
  keeps them) plus a plain owner-visible limit sentence for the PM; cited from section 3 and 12.
- D5/F5: retiring strings named in section 7: T/design.cjs:205 (also today-app.cjs:110) and :210
  retire only IF Q4 = NO; :209 retires only IF Q1 = A. Census table: always +10; On/Off +2 only
  if shown as text; Q4 = NO +2/-2; Q1 = A +1/-1. Default build (Q4 default, Q1 A, native
  checkbox) +11/-1 = net +10; largest (all 15) +15/-3 = net +12. Copy-inventory row asserts it.
- F6: S324 import mechanism stated (trackMacros key ignored, preference store untouched, never
  opened for write); S184 control fixed (native checkbox, visible label = accessible name,
  role checkbox); S178 stated plainly (correction op carries prior macros, not only what he
  typed) and added to the correction row; S232-233 numstat base replaced by the actual
  merge-base at run time, hash reported.
- Every changed clause carries an [R2 Dn/Fn] tag; untagged clauses are unchanged from d3b9cbf2.

## Verification (static only; no test, browser or protected file run; no runtime lock needed)
- ASCII scan: 37811 bytes, 0 non-ASCII, 0 CR (LF only), no U+2013/U+2014.
- All three quotations still match DECISIONS:471 and :561 verbatim (Contains = True x3).
- git diff --numstat d19d38fb HEAD -- rebuild/engine/ and HEAD -- rebuild/engine/: no rows.
- git diff --numstat on the spec: 158 added, 69 deleted; 464 lines.

## Not done, and why
- Q1 to Q4 are Joe's; no answer assumed beyond keeping today's behaviour as the Q4 default.
- Review's optional one-line U7 citation in section 12 not added (not in the D/F list).
- :609's order that a malformed macro without cal/pro answers NOTHING before its range word is
  left to the N3-B brief (not in this review's findings).
- No commit, push, product or sealed edit. Deliverables uncommitted.

## Files (uncommitted)
- rebuild/lanes/c/N3-MACROS-DATA-SPEC.md (modified; base blob 6b987123)
  sha256 5cb98346e2a997f5dc8db09fb252e54b4e33fa516e70bb5660b42daeee935541
- rebuild/lanes/c/N3-SPEC-R2-REPORT.md (this file, untracked); sha256 in the hand-back message.
