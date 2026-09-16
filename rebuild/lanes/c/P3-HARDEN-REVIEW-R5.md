# P3-HARDEN independent review r5 (Fable, FINAL re-check per DECISIONS:439) - VERDICT: ACCEPT

Subject 466024fc6afd13a1c890249512e41434919b5c46 (round 2), detached worktree at that sha; tip
397cf96 an ancestor; `git diff --stat 397cf96 HEAD` = the five custody files only (+630/-6), no
pinned path. Every bundle below was INVENTED from the public fixture shape (preimage-2026-08-15
cloned in memory); no real bundle, ledger, soak or private path read; --out under %TEMP%\p3h-out.

## The six PM-ordered items, re-proven with my own cells

- A / Opus 1 / Fable 3 (nights pre-guard): CLOSED. nights[5].d numeric, object, null, array,
  boolean and "2026-02-30" each refuse with the exact DATE_INVALID line (type name only for
  non-strings; no key or value of an object d anywhere in the full CLI output); a night with no d,
  {} or [] refuses SHAPE_INVALID "missing d"; object-shaped nights name "key N".
- Fable 1 (--local unshaped): CLOSED end to end. My r3 repro (reads[9].d 2026-13-40 plus no
  exercises) refuses `local:PORT_SOURCE_DATE_INVALID` and `local:PORT_SOURCE_CLASS_MISSING`, the
  SHAPE line says "in --local", the source is not blamed, the refusal lands after COUNTS and
  before ORACLE, no --out folder is created; nights object d, corrLog op day, null events and a
  dailyLogs key 2026-02-30 in a --local refuse likewise; a clean --local still seals PASS.
- Fable 2 (corrections): CLOSED. Day inside op: 2026-02-28, 2026-12-31, 2024-02-29 accepted;
  02-29, 04-31, 13-01, 00-15, 01-00, 1-05, 20260105, 2026-08-15T00 refused; the engine's own
  4-field op kind:day:id:ISO and nested colons after a valid day accepted; "" and ":" refuse as
  malformed op, "::" as DATE_INVALID ""; Arabic-Indic and fullwidth digits refuse; a 2 MB op
  field refuses with a 10-char echo on a short line; newline and ESC inside the day come out
  JSON-escaped, never raw. `at`: unparsable, "", number, null, missing, object all refuse.
- Fable 4 (privacy): CLOSED. reads[2].d object/array/number/null/boolean print only <type>; the
  whole CLI output carries none of the object's keys or values; strings truncate to exactly 10
  (11 -> 10, 10 -> whole); dailyLogs and sessionLog keys truncate the same way.
- Fable 5 (dashes, cell (f)): CLOSED. 630 added lines: zero U+2013/U+2014 in README.md,
  P3-RUNBOOK.md, AUTHOR-REPORT.md and port.cjs; zero CRLF in any changed file; cell (f) asserts
  the three tip refusal strings byte-for-byte; the same literals sit in `git show 397cf96` and HEAD.
- Opus MINOR 3: CLOSED ("(got null)" for every nulled class; object nights say "key").
- Mutants (file restored, porcelain empty): hasOwn -> string pre-guard, `if (false) badDate` on
  the op day, echoing the value whole, `if (false && localBytes)`: each reddens exactly its cells.

## Findings (none blocking; 1 and 2 are follow-ups for the next port touch)

1. MAJOR (Opus r4 finding 1, confirmed and widened): `if (!entry || typeof entry !== 'object')
   continue;` skips a non-object night. Measured end to end: sleep.nights[0] = null and
   sleep.nights[0] = "a-string-night" both exit 0 and write bundle + passphrase; the same night in
   a --local seals too; object-shaped nights {a: 1} (my r3 "wrongtype nights" cell) now seals PASS
   because the object shape is admitted and its scalar entry skipped. Refuse a non-object night as
   PORT_SOURCE_SHAPE_INVALID. Not blocking: the tip sealed these unchecked; no copy claims them.
2. MAJOR (new): the --local shape check sits at step b3, after LOCAL relatedness, PREPARE (which
   merges) and COUNTS. A --local whose ARRAY class is wrong-typed never reaches it: queue = {} dies
   in census with `PORT FAILED (s.queue || []).filter is not a function` (exit 1) and reads = "x"
   dies in relatedness with `(local.reads || []).map is not a function` (exit 1), before any
   `local:PORT_SOURCE_*` line; null classes and wrong-typed object classes do reach the named code.
   Nothing is written either way (same as the tip) and the crash text is code, not data. README's
   "run again on a --local file's own shape before it can be merged in" overclaims: prepare()
   merges first. Fix: run shapeIssues() on the raw parsed --local right after LOCAL is read
   (mirroring the source check) and reword that README line.
3. MINOR (new, privacy): object-shaped nights echo the entry KEY whole, untruncated, in both lines
   ("entry at key PERSONAL-LOOKING-KEY-THAT-IS-LONG is missing d"). dailyLogs/sessionLog keys go
   through badDate and truncate to 10. Real nights are an array (keys only on the synthetic
   fixture), so exposure is low; truncate the key label to 10 the same way.
4. MINOR (Opus r4 finding 2, confirmed): earned CLASS_MISSING prints "(no earned key)"; the
   backing key is feed.
5. MINOR (Opus r4 finding 3, confirmed): an object-typed corrLog raises no issue (treated as []);
   PREPARE refuses it downstream, nothing written.
6. MINOR (Opus r4 finding 4, confirmed): S4 --ci at 466024f exits 1 SEAL-BASE-IS-NOT-THE-CHAIN-TIP
   (tip is 8b484c09); deee76d + 466024f replay cleanly onto it (only DECISIONS.md differs), S4 exit 0.
7. NOTE: truncation can make a refused string LOOK valid ("2024-06-01T00:00" echoes as
   "2024-06-01"); a "..." marker when cut would help without echoing more. NOTE: the only dashes
   on added lines are 3 inside port-harden.test.cjs (a comment and the dash-scan cell's own
   literals), not copy Joe reads. NOTE (carried from r3, not routed then): folders literally named
   "OneDrive." / "OneDrive " (trailing dot/space, \\?\-only names) are still not refused.

## Cells and tails

- r5 unit 114 cells (11 non-ok: 4 = finding 1, 2 = finding 3, 1 = 4, 1 = 5, 3 my own wrong
  expectations); r5 CLI 69 (7 non-ok: 3 = finding 1 incl. --local, 3 = finding 2, 1 my regex);
  lint 6/6; mutants 4/4; r3 replay: shape 245 (11 non-ok: 4 = finding 1 via {a:1} nights, 7 are
  intentional message changes), local 1/1, 8.3 short names 0 bad, sync 50 (2 = carried NOTE).
- At 466024f: port + local-source-consumer together tests 60 / pass 60 / fail 0; rig187 => PASS
  exit 0; S4 --ci EXIT 1 (finding 6). Commit author/email as expected; porcelain empty.
- Replay 9b73f77 (466024f onto 8b484c09), MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York:
  port test/*.test.cjs tests 54 / pass 54 / fail 0; local-source-consumer tests 6 / pass 6 /
  fail 0; rig187 => PASS exit 0; b-package --ci --package S4 PUBLIC CI EVIDENCE PASS exit 0;
  today 13 by name tests 645 / pass 645 / fail 0.
