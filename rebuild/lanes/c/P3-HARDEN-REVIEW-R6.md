# P3-HARDEN independent review r6 (Fable, FINAL, targeted re-check of round 3)

VERDICT: ACCEPT

Reviewed 5911b6373c2bc59cfaefe1c49ef534a9a918cc4d (rebuild/c-p3-harden, rebased; merge-base with
origin/rebuild/t2-client-core = 8b484c09, confirmed). Round 3 touches only port.cjs, README.md,
port-harden.test.cjs and the author report; no pinned path; author cowork (Earned PM)
<joeymat11@gmail.com>; Co-Authored-By present; porcelain empty. DECISIONS:439 method, no product
edits; invented bundles from the PUBLIC preimage fixture only; --out under %TEMP%\p3h-out\r6.

## The six PM items, re-proved (r6 probe: 189 checks, 0 bad; unit + CLI, source AND --local)

1. nights[3] = null / string / number / boolean / false / 0 / ""; nights = [null]; keyed nights
   {a:1, b:"x", c:null}: each refuses PORT_SOURCE_SHAPE_INVALID "class nights entry at position N
   (or key K) is not an object (got <type>)", exit 2, nothing written, via source and via --local
   (local: prefix). An array entry refuses as "missing d". CLOSED (see finding 1).
2. --local queue={}, reads="x", corrLog={}, reads=null, events=3, feed missing: local:PORT_SOURCE_*
   at step 2, no LOCAL/PREPARE/COUNTS line, no TypeError, exit 2 not 1, nothing written; same under
   --local-inspect and with an unrelated schema. Source AND --local both malformed: the unprefixed
   source line fires first. A clean --local still reaches LOCAL PASS and merges. Code order: source
   parse -> source shape -> local parse+version -> local shape -> relatedness -> confirm -> prepare
   -> guard -> counts -> b3 -> oracle. CLOSED.
3. A 40-char keyed-nights key (missing d, bad d, scalar entry, key AND value 40 chars) never appears
   whole, nor as an 11+ char prefix, in any unit or CLI line on either side; echo is "PERSONAL-L"...;
   10 chars echo whole, 11 truncate; a newline in a key is JSON-escaped; dailyLogs/sessionLog keys
   carry the same marker. CLOSED.
4. earned CLASS_MISSING reads "(no feed key)" (unit and CLI); other classes name themselves. CLOSED.
5. corrLog as object/string/number/null/boolean refuses "class corrections is not a(n) array (got
   <type>)" at SHAPE, not PREPARE; an absent corrLog raises nothing. CLOSED.
6. "2024-06-01T00:00" echoes "2024-06-01"... (ASCII dots, never U+2026); a 10-char malformed value
   echoes whole without a marker; the marker appears on reads, nights, dailyLogs, sessionLog,
   corrections op day and corrections-at. README's raw parse -> shape -> relatedness -> prepare ->
   counts statement matches the code for both sides. CLOSED.

## Findings (none blocking)

1. MINOR (deviation, not disclosed): PM order 1 also said "nights must be an array". SHAPE_CLASSES
   keeps array-or-object, so keyed nights with well-formed object entries (and nights = {}) are still
   admitted; only entries are checked. The reason is in custody but not in the report: the synthetic
   fixture builds nights as an object keyed "0".."34" and port.test.cjs's measured cell "the counts
   check refuses a merge that drops a class dataLossGuard reads as empty" needs that shape to reach
   COUNTS. Every entry is validated either way, so no hole remains; PM to rule.
2. NOTE: the b3 post-prepare --local check is unreachable by any cell (r5's "b3 disabled" mutant
   turns nothing red); kept as disclosed defense in depth.
3. NOTE: README "raw parse (valid JSON, a schema version)" holds for --local; a version-less
   --source is shape-checked first and only PREPARE refuses it. NOTE (privacy nit): a keyed-nights
   key of 10 chars or fewer is echoed bare and unescaped; the truncated path JSON-escapes.
4. NOTE: S4 --ci at 5911b63 exits 1 SEAL-BASE-IS-NOT-THE-CHAIN-TIP (origin is 9b382e9 = 8b484c09
   + DECISIONS:463). Replay e03aec8 (the three commits cherry-picked clean onto 9b382e9, only
   DECISIONS.md differs): S4 --ci EXIT 0 PUBLIC CI EVIDENCE PASS. Same class as r5 finding 6.
   REVIEW-R5.md (90f5cd1) is not in this lineage; it is re-added here alongside R6.

## Regression replay and tails (5911b63)

- r6 mutants 6/6 red by name; r5 mutants 2/4 (1 anchor moved by item 6, 1 = finding 2). r5 unit
  114: 8 non-ok (5 the "..." marker, 3 my stale expectations; all 8 r5 finding cells green). r5 CLI
  69: 2 non-ok (1 marker, 1 inverted by item 2). r3 shape 245: 8 non-ok ({a:1} now refuses per
  entry, 2 marker, 5 stale). Lint: round 3 adds 241 lines, 0 U+2013/U+2014, 0 CRLF, LF only.
- port test/*.test.cjs tests 65 / pass 65 / fail 0; + local-source-consumer tests 71 / pass 71 /
  fail 0; rig187 => PASS exit 0; today 13 by name tests 645 / pass 645 / fail 0; S4: finding 4.
