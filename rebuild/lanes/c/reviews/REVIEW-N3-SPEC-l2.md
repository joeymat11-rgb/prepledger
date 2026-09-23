# REVIEW N3-MACROS-DATA-SPEC, round 2 (independent reviewer, Fable 5.1, 2026-09-23)

Object: uncommitted R2 in worktree earned-astra-25 (HEAD d3b9cbf2). Hashes verified before reading:
rebuild/lanes/c/N3-MACROS-DATA-SPEC.md 5CB98346E2A997F5DC8DB09FB252E54B4E33FA516E70BB5660B42DAEEE935541 (match);
rebuild/lanes/c/N3-SPEC-R2-REPORT.md 85DFC8B11BB6354BDCA114E8748DCD52F26C9E51BF0CFF7624B8D9C81F378B29 (match).
Diff read whole (git diff d3b9cbf -- the spec path: +158/-69, 464 lines, ASCII, LF). Static only, no lock. R = R2 line.

## Verdict: ACCEPT (two non-blocking nits for the N3-B brief, no new debt)

## Debt by debt, with the attempt to break it
D1 (Q4 OPEN, default today's rule, dependents conditional): PAID. R49-60 rewrites the mismatch bullet as OPEN with the
  round-1 witness and citations; R443 adds Q4 with YES/NO and "No recommendation is made"; default is today's
  either-alone rule. Every dependent clause found by grep (BOTH, cal and pro, new-save, either) is conditional:
  R194-199 (section 3), R271-272 (section 6), R295 and R300 (section 7 rows), R348 and R358 (section 8 rows),
  R396-398 (section 9 preamble), R405 (required-entry row, default arm labelled control), R150 (adherence).
  No unconditional "require both" survives. Break attempt: the sealed cell food.test.mjs:204-209 stays untouched under
  the default (R397-398), so the default path implies no sealed edit. Holds.
D2 (backup row dropped, constraint kept): PAID. Row gone (R422-424, 16 -> 15); constraint on a future exporter at
  R201-208 keeps every accepted clause of the old paragraph (raw ops, no zero fill, absent/present status, preference
  excluded, no backup UI, no summary-export relabel); R380 lists no exporter hunk; R449-450 in section 12; the
  "no carrier" fact is restated with the grep at R120-127. Holds.
D3 (interim and final homes): PAID and independently re-measured. git grep food-macros|device-preferences over
  acceptance-s8-real-shape.json and .github/workflows/rebuild.yml at d3b9cbf: no hit (exit 1), so the file is FREE and
  uncounted; rebuild.yml:232 names food.test.mjs by exact path, so the final home does have CI. R356-359, R372-379,
  R393-397, R422 and R434-435 agree. food-macros.test.mjs at 7f81f209 has 9 lines matching ^test\( (12 with
  indentation), so "9 top-level" at R356 is exact. Holds.
D4 (version skew): PAID. R104-118 records both consequences from :609 (whole-import refusal via source-admission
  :508/:526; old-correction drop with the earlier op intact) and an owner-visible limit sentence marked "not proposed
  athlete copy"; R174-176 and R454-456 cross-cite. Holds.
D5 (census arithmetic): PAID and recomputed. Section 7 table has 15 rows. Always: setting, help, 2 labels, 2 format
  refusals, 2 recorded lines, 2 preference failures = 10. On/Off text = 2. Q4 = NO: +2 (lead, required refusal),
  -2 (:205, :210). Q1 = A: +1 (correction help), -1 (:209). Default (Q4 default, Q1 = A, native checkbox) = 11 added,
  1 retired, net +10. Largest (all 15) = 15 added, 3 retired, net +12. R307-327 states exactly this; the copy-inventory
  row R417 asserts the line actually built. Correct.
F6 (wording): PAID. R225-229 native checkbox, visible label is the accessible name, role checkbox, no divergent
  aria-label; R214-218 the correction op carries prior macros as its own values, echoed in the row at R409;
  R410 import mechanism (trackMacros key at any depth ignored, preference store never opened for write, before and
  after keys equal); R278-283 numstat base is the live merge-base with its hash reported. Right.
Accepted clauses dropped: none found; the old section 12 workspace block is replaced by a pointer to the R2 report,
which carries the same facts. Decisions that were Joe's: none taken. "Macros alone never form a day" (R58, R194) is
the spec's, supported by :471 ("fat and carbs are optional") and already built in N3-A; the checkbox is technical.
Every changed clause carries an [R2 Dn/Fn] tag as claimed (spot-checked 14). The optional U7 line was not added; fine.

## Nits, not debts
N1 R405 default arm: "macros-only saves refuse" is green TODAY for a different reason (fat is not in MEMBERS, so
  refusalFor({fat:'40'}) = NOTHING and dayOf throws); it becomes a real guard only after MEMBERS grows. The N3-B
  brief should call that arm a guard captured after the MEMBERS change, not red-first evidence.
N2 Q4 at R443 reads "as the app promises today" and lists YES first with "nothing changes"; neutral enough, but a PM
  who holds :595 ("stay required is therefore N3-B") may rule Q4 from :471 without asking Joe. Either route is fine;
  the spec now leaves that choice to the PM, which is where it belongs.
