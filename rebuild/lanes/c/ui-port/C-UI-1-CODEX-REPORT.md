# C-UI-1 Codex author report

Role: commissioned Sol builder, not reviewer, PM or integrator.
Base: d5d67e9 source-boundary RED checkpoint.
Status: candidate frozen at first browser failure; not accepted.

Implemented in this candidate:
- headlineVocabulary checks the exact 18 public .cjs filename census before
  source reads, then reads only the 13 authorized title producers.
- seed, migrate, merge, index and oracle-shim remain outside the read closure.
- all five literal/propose parsers and the measured long template remain.
- only the 33 px headline floor compacts 23 + 12 + 8 = 43 px of existing
  spacing: measured 35 px overflow plus the existing 8 px breathing guard.
- browser captures use a fresh retained OS-temp directory and print its path.

Retained red evidence:
- original design: 4 intended failures, SHA256
  f9ac1344d3a9a315c11617939216a73ede655de05fd45c31a08f5b0e55f35fda.
- original scene: 3 intended failures, SHA256
  747e39c4be82d94d38ac22da4594b22d630af6e1f9eac96195d37e35ef9c71fb.
- fidelity: 3 intended failures, SHA256
  0b5a3c50e65d04ff514380cd7530c42fd86543dd70f7150d01117de51ada4aa6.
- observer: 1 intended failure, SHA256
  86b90b96d156948272d40157da9a3b1ebaad43d406a44cb3381363a5a6acc131.
- source boundary: 3/3 fail, SHA256
  146dd23aae51e3613b2549af933c048bf87c4d88d3165f32aabc50535ab4d95e.

Measured candidate evidence, pinned Node and fixed date/timezone:
- boundary selection: 3/3 pass; log SHA256
  803516e80d02020e4f281b1dd01a51bf9add879dda2485caa717f5dd9241c1cb.
- first design attempt: 14/15 pass; exact filename census also saw the test
  directory. Log SHA256 c4d330c3e531b794b6419b0781d6ee11791218437c1fba07151dcf8079c9f782.
- bounded correction counts only regular .cjs filenames; second design attempt
  15/15 pass. Log SHA256 31e039786257471e8f9fea267ecf6f45e5af19e6b8312eeaecbd86810ea28e0f.
- scene: 6/6 pass; log SHA256
  e9a951b4f7d0ebfc6418760b7ae509f91d4a65f1ecbfb21b76789479bfcb8203.
- default build: PASS, 3 assets and 146 pins; log SHA256
  a761684d168811162cfca0c5d26789fb99cd6dcd1059ff1423c9b847c35f8638.

Browser result:
- exit 1 after 40.4 s: page.waitForFunction timed out; log SHA256
  8a4b7826f4f234c6dbcc36c44814ae80e87cbd4097f147f53db4302ab2219f5f.
- catch output discarded the stack and wait name. Two Today captures prove the
  timeout occurred after both scene-ready waits, but do not identify which later
  wait failed. No stage is guessed and no automatic retry was made.
- retained directory: %TEMP%/cui1-browser-proof-iuP5E2.
- Ink PNG SHA256 fd811a96db86553db51fa1168012a32b0fee5ad2eafce1ddf6a8d1889840d2da.
- Dawn PNG SHA256 2c86da624f8d5694a0ced018ea2931a02147d9db561a42c216f0932d7a4c4a6e.
- reduced-motion PNG and visual-summary.json are absent.

Runtime is released; no Node/browser/server process remains.
No approved pack, baseline, engine, storage, workflow, ledger or STATUS changed.
B1-B4, named-wait diagnostics, reduced motion, independent review, Linux, CI,
seal and integration remain owed. No acceptance or ticket-completion claim.