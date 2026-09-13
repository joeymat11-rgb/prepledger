# D2 PM334 frozen-build setup replay

First phase is independent of E report/rationale/outcomes. Candidate2fdf33e5, sourcea0109d93, baseA3bfed63; admission and PM bar/manifest are included. Never run the builder against real project history.

1. Recreate an explicitly assigned own no-checkout/full-index worktree and hydrate only the four pinned inputs. Use verified Node22.23.2. Extract only esbuild0.28.1 and @esbuild/win32-x640.28.1 from pinned official archives with scripts disabled. d2-install-frozen-deps.mjs preserves the exact setup; run in the owned root with Node22. It installs into an empty owned node_modules, never borrowing a package tree.
2. Copy the archived d2-frozen-controls.test.mjs, d2-frozen-run.mjs and d2-frozen-reverse.mjs into the own .tmp directory. The controls adapt only public test helper lines8-43 to explicit process.cwd(); they do not import the author test module or consume author outcomes. Each fixture copies the byte-identical actual builder and owned packages, then commits entirely invented clock/source.
3. Run the committed public test entry once. Run the controls with node .tmp/d2-frozen-run.mjs controls-replay .tmp/d2-frozen-controls.test.mjs. Expected candidate result:4/5, F2 FAIL because the builder accepts a hard-linked module. All generated repositories, worktrees and bundles remain inside own scratch.
4. Run node .tmp/d2-frozen-reverse.mjs only in the assigned reviewer tree. It requires exact source hashes, restores bytes in finally, runs three focused behavioral reversals, and repeats public11/11 and independent4/5 after restoration. R1 remains unresolved; never describe the final candidate as all-green.
5. d2-audit-frozen-loader.mjs verifies actual installed loader/service file identities and intercepts the real child spawn solely to assert its owned executable path; a tiny invented transform exercises the real service. No simulated successful builder/process is used.

The first control attempt's recorder string caused SyntaxError before cases/product execution. Its failed source and TAP/metadata remain distinct from corrected and restored outcomes; use only the corrected control file for replay. No assertions were weakened. A preceding PowerShell quoting failure also ran no code.

R1 evidence is in d2-frozen-first-evidence.json and corrected/restored observations. The alias is outside the supplied fixture root but inside D2-owned scratch. nlink2, exit0, one new invocation and three total worktrees prove the missing module hardlink refusal. The same setup applied to esbuild's loader is refused correctly.

F4 shows actual partial standard-slot publication on a later rename failure, with no false success and both invocation bundles retained. F5 records different-ref overlap: retained invocation identity is preserved; no lasting standard-slot lease or pair transaction is asserted.

FILES.json hashes all other annex files and the first report. Local .gitattributes preserves exact raw source/output bytes. No package binary, generated bundle, fixture repository/worktree, real historical source, key or protected data is archived. Paths in observations identify own retained synthetic evidence, not authority to operate another tree. Author evidence is report-last and will be reconciled separately.
