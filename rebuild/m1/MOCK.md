# EARNED — design of record (re-pinned 2026-09-10 by cowork on the owner's instruction "Fix the repo pin now so PM has the right design")

## DESIGN OF RECORD = the owner-approved 2026-09-08 design (supersedes the M1 mock below for every screen it covers)

Folder: `rebuild/m1/approved-2026-09-08/` — copied byte-for-byte from the owner's PC (`Codex/2026-09-06/earned-process-proportionality-audit/design-refinement/`).

1. **Refinement A — Today (plan-first) + workout logging.** Owner approval: "Yes that looks good" (2026-09-08 ET).
   - `Earned-refinement-A.html` · sha256 fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031 (interactive prototype; in-memory only; synthetic numbers)
   - `Refinement-Today.png`, `Refinement-Workout.png`, `Refinement-Rest.png` — the three owner-reviewed screens
   - `REFINEMENT-A-NOTES.md` (rationale + scope) · `REFINEMENT-A-HANDOFF.md` (approved direction, integration boundaries, calorie-target copy clarification)
2. **Additions C — Today · Nutrition · Recovery check-in · Coach.** Owner approval: "Phenomenal, I love it now. Let's do it" (2026-09-08 ET).
   - `Earned-additions-C-approved.html` · sha256 caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45 — THE authoritative implementation reference named in `ADDITIONS-C-APPROVED-HANDOFF.md` (hosted copy: earned-design-preview-joey.joeymat11.chatgpt.site, owner login required; stable public copy: claude.ai artifact 886bc21a-5b9c-4554-91c1-36a22ec0c4e6)
   - `ADDITIONS-C-APPROVED-HANDOFF.md` (what to implement, required interpretation, integration order, proportionate verification) · `RECOVERY-CHECKIN-C-NOTES.md` · `ADDITIONS-B-NOTES.md` (the earlier B proposal the C refinement replaced)
   - `B-today.png`, `B-nutrition.png`, `B-recovery.png`, `B-coach.png` — B-stage renders; the C HTML wins where they differ (the handoff says the PDF/B PNGs must not override the C reference)

Rules for builders (unchanged in spirit from the original pin):
- The VERTICAL SLICE (owner speed ruling 2026-09-10: morning weigh-in → one instruction → gym card, one phone, local save, Dad's first-run setup) binds to THESE screens: Today per Refinement A + Additions C; workout logging per Refinement A; recovery check-in per Additions C.
- Palette/type are fixed: paper #F4F0E8, ink #1C1B18, muted #5A5348, hairline #D8D0C2, green #2E5A3C, ground #E7E1D4; Instrument Serif headings/key values, Instrument Sans controls/explanatory text.
- Every number in the prototypes is fictional — never a production default, rule test or prescription. The engine owns numbers.
- A builder must not "improve" the design; a design change is an owner ruling. Where an approved layout conflicts with an accepted correctness/accessibility requirement, resolve that concrete issue in review and preserve the visual intent.
- Recovery check-in semantics are binding: all answers blank initially; blank = unknown, never normal/zero; cleared issue details are never submitted as facts; the check-in is never mandatory for routine logging.

## HISTORICAL PROVENANCE — the M1 clickable mock (2026-09-04), no longer the design of record
- Ratified artifact (private, owner's claude.ai artifact; 21 screens; five-minute dad-test script inside): id 65168842-178a-40c6-a503-e44d56aa11a8 · original sha256 46e1e69d52884fbf… (kept OFF the repo: its demo numbers were the owner's real reads — verified locally against the private live ledger, 17 distinct values / 69 occurrences)
- Public copy: `rebuild/m1/earned-mock.public.html` · sha256 e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563 — byte-identical screens with a deterministic synthetic number map (0 live-matching numbers remain).
- Screens the 2026-09-08 design does not cover (onboarding, settings, history detail, the weekly note) fall back to this mock until an owner ruling replaces them.
- The dad test now runs on the 2026-09-08 design (stable copy above), not on this mock.
