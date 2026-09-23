# REVIEW S9 FINAL ASSEMBLY PREP, l2 (reviewer claude-fable-5-1, 2026-09-23). Review only; nothing under review modified.
Hashes verified: report 430b7ef6, S9.json a14f9669 (unchanged A+B), drafts R2 76195905, hunk C 1fd72aa2, hunk D 93098277,
tokens2.cjs f8945a09, pm-ledger.cjs 377c76ec. git status: only S9.json modified plus the untracked report. Static only.
## VERDICT: ACCEPT WITH NAMED DEBTS (D1 paid; E1 is a wording defect the PM must not act on; E2 operational)
## 1. D1 paid. Tags and shas re-derived; the tool form holds.
Tag each checker requires, re-read: THEME/BRIEF go claim() (b-package.cjs:1363, spec role === 'cowork') then ledger() ->
L.verifyReceipt (:2631-2633, :2666-2667), which tests / · cowork · / on the found line (legacy-gates.cjs:24): the tag must be
exactly "cowork"; "cowork (PM)" would NOT match. RFS (releaseRuling :1543-1575) and GS (supersessionRuling :1474-1505) do sha
lookup, ruledTerminal, token clause, package id only; no role read, so "cowork (PM)" (S8 :527 precedent) is free. R2 tags
are exactly that: correct. pm-ledger.cjs:73 writes '- ' + date + ' · ' + TAG + ' · ' + body + ' · ' + verbs: the verbs are the
terminal clause, not body text, so ruledTerminal sees the bare "RULED" and THEME/BRIEF end " · ACCEPTED". The body passes only
oneLine() (:35-40: no CR/LF/U+2013/U+2014) and clean() (BOM, trailing newline), so the inner " · " of RFS/GS bodies reaches the
line unchanged and the token is its own clause. Executed tokens2.cjs 2026-09-23 x: RFS 46a64dc0 (339 B), GS b8d088af (657 B),
THEME ff25c85a (810 B), BRIEF 04b0f897 (315 B); each JSON line re-hashes to its sha, bytes equal, each line == the tool form
with its tag, only non-ASCII U+00B7, none on the chain; my own regex copies (l1 chk4/chk5) pass all four; hunk D == RFS sha.
Couplings the report states only half of: date and TAG come from the tool at run time (:16, :51-53), so the shas hold only for
an append dated 2026-09-23 with PM_TAG set per line (default "Astra PM"); THEME body 772 chars trips the 600 note (:82), a
printed note, not a refusal.
## 2. Brief claim holds; the fact-4 gap is empty. Measured: worktree brief blob 8b3d0e12 == caa0abf:rebuild/lanes/b/
S9-UI-PINS-BRIEF.md, sha256 abf3f670, 122946 B; caa0abf not an ancestor of HEAD, 0ba35a9 (carry) is. 30bdbe4 adds the fold
review L1 (on t2-client-core); f41121f REVIEW-S9-l4.md re-measures abf3f670, ACCEPT WITH ONE NAMED DEBT, "weakens no check",
debt = where the fold lives; :740 records D-FOLD-TWO-COPIES paid by 5fec649 (five C-UI tickets) and caa0abf paper of record;
:732 rules the fold. a12be09 A3 lists facts 3/4/17/18; fact 4 (brief :595) is the PUBLIC_TAIL_ROOTS fact with no CUI1 wait
text: nothing to fold, no edit, agreed. Note: facts 3/4 are stale against c4224ee (measured CHILD_ROOTS 26, PUBLIC_TAIL_ROOTS 7);
the accepted paper is history and an edit would void abf3f670 and the BRIEF sha. Leave it.
## 3. D2: sound as mechanism, wrong on who proves it (E1).
children() :2794-2846 spawns every child at the seal, exit 0 (:2808) and ^needle multiline (:2824); with hunk B SUP-4 (test
:180-183) admits null or 64-hex and SUP-1..3 never read the spec, so "# pass 4" is a prediction a green child confirms and a
red one refuses by name; no receipt can match the sealed spec anyway. Dropping the hosted rerun: acceptable. BUT SUP-3 spawns
rebuild/engine/test/migrate-source.cjs, which loads rebuild/engine/migrate.cjs, one of the protected five; RULES and :785 grant
no local execution of those, and section 5's "Joe's local seal-run grant covers this" cites no line - none exists at :785.
The proving run is the hosted standing step (step 10, both-OS CI) or an owner-granted local --ci; section 5 must say so. It
contradicts section 8, which rightly lists the local seal run as an owner ask still open.
## 4. D3 closures: every cited hash found on its chain line. 11.1: :697 (independent 082a1997 ACCEPT, inside a REVIEW ASKED
line), :707 (0ca3c8f), :717/:718, :723 (ac1b092), :733 (a3fca86), :740 (c1e1884/30bf3de ACCEPT "for S9 composition"), :770.
Closed for S9 composition; no line accepts C-UI-0 whole and :740 says "not CUI1 real-preview acceptance", as reported.
11.3: bc308d9 is an ancestor of HEAD and passphrase.cjs's last commit; disk sha 69c23e45 == S9.json post (role new); :619,
:775 (29/29). Closed.
## 5. Hunks C and D: correct; coupling stated right. Both git apply --check exit 0 on the A+B tree, disjoint lines (2-8,
1769 vs 1391). C: BRIEF-ACCEPTED admitted at :1867, refused at :1880 while acceptedLedgerLine is null, forced at :1873 once it
stands; PASS also needs the theme (:3751). So C lands only with both claims. notes' <LN_*> placeholders and notes[1] ("remain
day-of work") are unchecked by the runner (no assert reads s.notes) and must be rewritten by hand or the note is false.
D: valid iff RFS lands byte for byte as drafted (date, tag); likewise the GS sha of section 2.
## 6. Remaining steps: complete and ordered; owner asks named (b-lom split/review/grant, local seal run, --full runs).
E2 (add to step 2): PM_TAG per append; <LN_*> = the four numbers the tool reports; all shas void on any other date.
Could not do: no runner or child executed; no CI log beyond the public tail read in l1.
