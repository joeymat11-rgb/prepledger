# PM handoff, 2026-09-24 (Claude Opus 5.5 PM to the next Claude PM)

Written by the Claude Opus 5.5 PM (seat DECISIONS:777) at Joe's request. It supersedes HANDOFF-PM-2026-09-22-CLAUDE-OPUS-5-5.md for state; that file's rules and tooling notes still hold. Ledger tip at writing: :796 (see section 2). Read DECISIONS :777-:796 before acting. Every sha below is on origin unless marked LOCAL.

## 0. First ten minutes
1. Read C:\Users\joeym\AppData\Local\Temp\opus55-RULES.txt (forbidden paths, runtime lock, OWNER GRANTS). It binds you and every agent you start. Paste its path into every agent brief.
2. `git ls-remote origin` for each branch in section 3 before trusting any sha here (this PM once commissioned a review at a stale sha; jobs 114/115 were wasted).
3. Read the two in-flight Astra results (section 4) and route them.
4. Ask Joe the open questions in section 2 in ONE message.
5. Start the S9 seal chain (section 5.1): it is now unblocked and is the critical path to the trial.

## 1. Seat, identity, tools
- Ledger: rebuild/DECISIONS.md on rebuild/t2-client-core, append-only, one LF line per event, written ONLY by `node %TEMP%\pm-ledger.cjs <N> <bodyfile> "<VERBS>" <msgfile> [--dry]` with env PM_TAG="Claude Opus 5.5 PM" (use your own model name) and PM_AUTHOR. Always --dry first. No U+2013/U+2014 anywhere. Owner words are recorded verbatim with provenance.
- PM tree: C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\t2-client-core-pm (detached; pushes go to HEAD:rebuild/t2-client-core).
- Node: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe (not on PATH). Tests: MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York.
- PC access from a cloud Claude session: Desktop Commander start_process (PowerShell). Beware: a Get-CimInstance kill filter on a command line also matches your own PowerShell; exclude $PID and powershell.exe.
- PowerShell 5 `>` redirect writes UTF-16LE with a BOM and CRLF. Never hash or diff a file extracted that way (it produced a wrong spec sha 811a322d in round 17). Use `cmd /c "git show X:path -- > f"` or node.
- Roles: builder != reviewer != integrator, always different sessions. Builders and reviewers NEVER commit or push (rules file); the PM publishes with a hash guard: check each file's sha256 against the builder's handback, `git add --` explicit paths only, commit, normal push, then compare `git ls-tree` blob to `git hash-object`.
- Models (Joe, :778): Opus 5.5 builds, Fable 5.1 reviews; Astra (Codex, headless on the PC) gives the blind engine/package-tier second review. Astra's executed counterexamples govern over argument.
- Astra jobs: `node %TEMP%\pm4-mkjob.cjs <N> <template> KEY=VAL` (banned words: hole, bypass, forge*, traversal, attack, exploit, payload, malicious; values from a closed charset), then `cmd /c call %TEMP%\pm4-astra-wt.cmd <N> <origin-branch> <new-local-branch>`, then `Start-Process cmd -ArgumentList '/c','call',"$env:TEMP\astra-run.cmd",'<N>','earned-astra-<N>','xhigh','appserver' -WindowStyle Hidden` (a plain start dies). Done when %TEMP%\astra-job-<N>.done exists; the review file is in earned-astra-<N>\rebuild\lanes\astra\reviews\. Next free job number: 119. Templates written this seat: astra-tpl-nlb-r10.txt, astra-tpl-s10-l4.txt (both take ROUND/BASE/HEAD; nlb also SPECSHA).
- Astra usage: `node %TEMP%\astra-usage.cjs`. 49% of the week at 2026-09-24 04:05Z; week resets 2026-09-29 23:09Z. Owner rule :571: at most half the week in one day. One Astra review costs about 3%.
- Protected five (rebuild/engine seed/migrate/merge/index/oracle-shim.cjs): never executed locally, never output, EXCEPT under the S9-seal grant in :796 (pass/fail lines only). :766 allows read/hash/static traversal only.
- No main merge, deploy, import, purchase, model fallback or private work without Joe's own words each time.

## 2. Owner state (Joe)
Joe's answers of 2026-09-24, verbatim, to the five open questions (recorded at :796): "Yes for the s9 seal only, yes" and "A".
PM reading, conservative where ambiguous:
- Q1 local S9 seal permission: GRANTED for the S9 seal only (the proposed sentence: connect the private test file and run the protected engine checks on the PC, as for S8, as often as the seal needs, pass/fail lines only, no data leaves the PC).
- Q2 "is rebuild/m3/soak-stub part of the protected soak": read as YES (protected). This is also the safe reading. CONFIRM with Joe that his second "yes" answered Q2, not Q3.
- Q4 H11 missed debut: "A" = spec :399 OPTION 1 (classic): a debut counts as done on its first completed session whatever was lifted, and a lower weight lifted next time is then offered to be set, with a yes. The build currently implements option 2 (the hold); it must change (section 5.2).
- STILL OPEN: Q3 approval of the 5 Undo strings (NATIVE_LOAD_PROPOSED_COPY in today-entry.mjs: undoHeading ": undo the agreed weight", noWeight, undone, disputed, conflict); Q5 adoption asks first (default yes, built as yes).
- NEW question from the Q2 answer (b-lom, section 5.1): option 1 (declared exclusion of soak-stub from the LOM-S6 walk, needs Joe's sign-off because it names his soak) or option 2(b) (S9 carries without the b-lom child; S8's "# pass 30" stays the last sealed evidence; disclosed debt re-measured after 2026-10-05). Recommend 2(b): it does not delay the seal.
Joe is on his phone, does not code, wants maximum speed with quality, and asked the PM to add agents liberally where quality holds. ETA given to Joe: Oct 2 to 5.

## 3. Branch state at handoff
- Ledger: rebuild/t2-client-core, tip after :796 plus this file.
- S9: rebuild/b-s9-integration 6dc2596 (worktree %TEMP%\earned-s9int). S9.json a1f9fa38: 18 observed needles; source-carriers "# pass 4" is a prediction; b-lom needle null (refuses CHILD-NEEDLE-EMPTY). Hosted run 35815674720 at 7fe1c5d: 18 PASS, b-lom HELD, source-carriers red from a spec placeholder (fixed). Exporter v3 packet rebuild/p-s9-exporter-v3 9a29c3a needs a pre-run clean step (move 3 ignored files, rmdir the w5/w6 node_modules junctions). Hosted packet rebuild/p-s9-hosted20-proof 7fe1c5d. b-lom packets UNCOMMITTED in %TEMP%\earned-h20\rebuild\lanes\astra\handoffs\hosted-blom\ (BLOM-OPTIONS.md explains both paths).
- S10: rebuild/b-s10-integration 62788b1 (worktree %TEMP%\earned-s10int; rounds 6-8 published this seat). Reviews: Fable l3 ACCEPT WITH NAMED DEBTS (paid in round 7); Astra L3 REJECT (B5 case/auth residual, B6 registration), answered in rounds 7-8. All S9-seal STOPs (section 2.1 values) remain placeholders until S9 seals. Carried: D-S10I-8 (EPP-R9 real red/green from CI), D-REGEN-NOTES (S10.json note [8] stale; fix at final input binding), the builder's open question on today-split/ in PUBLIC_TAIL_ROOTS.
- NATIVE-LOAD spec: rebuild/c-native-load-spec 105cc28 = R9.8 (sha256 28c73fa4). R9.7 912c36c paid Fable l10; R9.8 carries PM ruling D-L8F-1 (undo of an APPLIED adoption restores the prior image whatever the record shape, never above it), the structural missed-debut anchor from ACCEPTED records, and dead-yes. :795 corrects :792.
- NATIVE-LOAD build: rebuild/e-native-load-build c0695e0 (worktree %TEMP%\earned-nlr). FC12 145/145, FA03 43/43, 3x17000 walks 0 counterexamples, 187/189 mutants killed (2 host-only LIVE accepted by Astra D-L9-7), PRODUCER_REVISION 1d87743d. Fable l8 ACCEPT WITH NAMED DEBTS (paid); Astra L9 REJECT (B31 governed by D-L8F-1; B32-B34 answered by rows in 17b). Evidence under %TEMP%\nlr-build\r16, r17, r17b.
- Other published: CUI1 blocker repair 3d01e5a; S10 working brief c58b892; N3 spec 1e6326c; TMH spec 27c18a2; D-EPP-2 rebuild/e-capture-repair-epp 5a953d5.
- Review archives: %TEMP%\earned-nls-review (+astra\), %TEMP%\earned-s10i-review (+astra\), %TEMP%\earned-nlb-fresh.

## 4. In flight at handoff (headless, survive this session)
- Astra job 117: NATIVE-LOAD build L10 at c0695e0, worktree earned-astra-117. Note its template says "rounds 16 and 16b"; the range e04b8e6..c0695e0 is rounds 17-17b.
- Astra job 118: S10 L4 at 62788b1, worktree earned-astra-118.
Route blockers to fresh builders; commit the review files next to the work when you publish (Fable in rebuild/lanes/fable/reviews/, Astra in rebuild/lanes/astra/reviews/).
The previous PM's subagents do not carry over. Start fresh Opus 5.5 builders; give each the rules path, its worktree, its owned files, and its last report section (NATIVE-LOAD-BUILD-REPORT.md, S10-INTEGRATION-REPORT.md) as context. Their reports are complete enough to resume from.

## 5. Plan, in priority order
### 5.1 S9 seal (critical path; now unblocked by :796)
b-lom resolution per Joe (2(b) recommended; option 1 needs his sign-off; the NO-path packet only if he says soak-stub is NOT protected), then exporter v3 run after the clean step, artifact review (Fable), merge-forward, exact-head both-OS CI, Fable seal read, s9 seal scripts under the :796 grant (pass/fail lines only; never output protected content), receipt, ledger line. Then S10's section 2.1 STOP values can be filled by S10-REGEN --write --receipt-line.
### 5.2 H11 option 1 (Joe's "A")
Spec R9.9 then build round 18. Replace the MISSED DEBUT hold (spec :152, :155 missed-debut anchor branch, :399) with option 1: the debut counts as done on its first completed session whatever was lifted; no weight is recorded that was not lifted and nothing is raised without a yes; a lower weight lifted is then offered to be set, with a yes; the debut is never prescribed twice. Keep the other-hold anchor rule, NO TRAP, dead-yes and D-L8F-1. Expect rows N29-N31, R17-ANCHOR-*, R17-EDITED-DEBUT, R17b-L9-M03 and the walk oracle's missed-debut coverage (737 cases) to change; the author must say which rows are retired and why, red-first for the new behaviour, then rebind PRODUCER_REVISION, then Fable plus Astra. Have the spec author state exactly what w/wSets/last hold after a below-target debut under option 1 before any code moves.
### 5.3 S10
On Astra L4 ACCEPT: Claude final read, then seal after S9 (REGEN --write, exact-head CI).
### 5.4 NATIVE-LOAD reseal child (M2-S11-NATIVE-LOAD, :791)
After S10: rebase onto S10, rebind PRODUCER_REVISION, carriers and pins. D-L9-5: FC16 and native-load ship in one seal. Import stays refused (D-L9-1 attestation before import ships).
### 5.5 Then
CUI1 promotion child, phone proof (the phone earns weights before the trial), deploy only on Joe's word, Joe's two-day trial.

## 6. Where development can go faster
1. Run the S9 seal chain NOW in parallel with the NATIVE-LOAD and S10 review loops. They touch different branches; this PM ran them serially while waiting on Joe, and that is gone.
2. Commission Fable and Astra together, the moment the PM publishes a head. Do not wait for one reviewer before starting the other; route both results to the builder in one message.
3. Script the publish step. Write %TEMP%\pm-publish.cjs <worktree> <branch> <msgfile> <path=sha256>...: hash guard, explicit add, commit with trailer, normal push, ls-remote check, ls-tree vs hash-object. Every round this seat spent two to three tool calls doing this by hand.
4. Always `git ls-remote` the branch head immediately before mkjob. A stale sha cost two Astra jobs and 20 minutes.
5. Parameterize templates: astra-tpl-nlb-r10 hardcodes the spec revision and round text. Add {{SPECREV}} and {{FOCUS}} so no new template is needed per round.
6. Tell builders up front to verify every cited hash with a byte-exact extraction (see the PowerShell note in section 1), so headers need no follow-up round (round 17a existed only for that).
7. Split builders by track: one Opus builder per branch (S9 seal, S10, NATIVE-LOAD spec, NATIVE-LOAD build), plus a separate Opus builder for H11 option 1 once the spec lands. Builders with no shared files can run at once; only the runtime lock serializes node.
8. Batch owner questions: ask Joe the section 2 items in one message with one-word answers (A/B, yes/no), numbered, so replies map unambiguously. This seat's last batch came back ambiguous.
9. Keep Astra for engine and package tier only and let Fable carry paper and report reviews; Astra's week has about 50% left until 2026-09-29.
10. Use background agents for builders and reviewers so the PM keeps publishing while they work.

## 7. Debts carried (verbatim ids; details in the review files)
NATIVE-LOAD: D-L8F-6, D-L8F-7, D-L9-1 to D-L9-7, R12-decode-absent is pin-only. S10: D-S10I-8, D-REGEN-NOTES, section 2.1 STOPs, D-SPLIT/D-GSS/D-EPP-3 gates, machine-settings-ui both-OS, api.lane census, S-R30 final assertion, Astra D-PARENT/LOCK, D-ACCEPTANCE. Earlier: TMH L2 debt and N3 (:782). Rule slips disclosed so far: a soak.yml grep, a Select-String over the engine, Set-Content in scratch, fetches (all logged); D-S10I-13 (pre-a8eff43 REGEN hashed the protected five's bytes, sha only, never loaded).
