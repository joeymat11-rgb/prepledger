# C-UI-1 Codex author report

Role: commissioned Sol builder, not reviewer, PM or integrator.
Published candidate: c27b03fa9b53762e15f2e096b53a728bb28eae2e.
Status: browser RED READY; reduced-motion and independent proof remain owed.

The build keeps accepted b35 Today behavior and binds the pinned 2026-09-18
styles, copy sources, local fonts and four scene images. Existing screen
structure remains pinned beneath the newer CSS so the newer rules win overlap.
All scene and font assets are offline data URLs.

The scene carries the approved 40 ms cadence, persistent near/far/bokeh ember
lives, three far plus two near mist sheets, luminance occlusion with the tall
sky join, the eased header fade and asset-ready reduced-motion drawing.
The board-date observer writes only when its value differs.

Retained red evidence:
- unchanged-product design red: 4 intended failures, exit 1, SHA256
  f9ac1344d3a9a315c11617939216a73ede655de05fd45c31a08f5b0e55f35fda.
- initial scene red: 3 intended failures, exit 1, SHA256
  747e39c4be82d94d38ac22da4594b22d630af6e1f9eac96195d37e35ef9c71fb.
- fidelity red: 3 intended failures, exit 1, SHA256
  0b5a3c50e65d04ff514380cd7530c42fd86543dd70f7150d01117de51ada4aa6.
- observer red: 1 intended failure, exit 1, SHA256
  86b90b96d156948272d40157da9a3b1ebaad43d406a44cb3381363a5a6acc131.

Focused repaired candidate, pinned Node and fixed date/timezone:
- design.test.cjs: 12/12 pass, exit 0; log SHA256
  74cb8621ac8385393074da2d77cd89e082c597ccf0506fbf5fad13474f679ede.
- scene.test.mjs: 6/6 pass, exit 0; log SHA256
  74963f07d6c946701601d13af7025484e74670526c4784c384145e6d779822b9.
These focused results predate the capture-only browser-check delta.

Browser attempt on the exact candidate plus capture delta:
- default build: PASS, 3 assets and 146 pinned inputs; log SHA256
  5ea865845a49b1305c6a8a642b76de18961bfcef9acd3dfa1c5ce80bbf0f9611.
- browser: STOP at first assertion, exit 1; one mandatory headline leaves the
  primary bottom at 879 in an 844 px viewport at the unchanged 33 px floor.
  Log SHA256 3a34ee335329d6b9ba30570111843b6aab1db85ba2e16899437e567d18d7cf19.
- Ink Today PNG SHA256 7526e1d7730e1edf38e5f58afac0bd4d0c208edfab26800c975d45d45fafbc0c.
- Dawn Today PNG SHA256 5c9aeab4d8258f0be4804654939e6e1e6bce8afe4d814cf6ff1b5c4c5a8a98fa.
Both actual 390x844 captures render the scene, fonts, content and primary.
Reduced Dawn Workout and visual-summary.json are absent because the run stopped.
No broad browser PASS, reduced-motion proof or automatic rerun is claimed.

Containment correction owed before another run: headlineVocabulary currently
reads every engine .cjs file. That broad traversal receives no containment
credit. Replace it with an explicit pinned title-producer list while retaining
all five literal/propose patterns and the failing long template headline.
Known justified producers are rebuild/engine/today.cjs and policy.cjs; any
additional proposal-title producer needs an explicit safe path from PM review.

The layout diagnosis is separate: the later approved .primary rule adds its
own margin to Additions C's bottom spacing, while the fitter can only lower
headline type. A minimal repair should retain the 33 px floor and, only when the floor still
overflows, remove the colliding 12 px primary margin and C's 23 px intro bottom
margin. That reclaims the measured 35 px. No repair is applied.

No approved pack, baseline, engine, storage, workflow, ledger or STATUS changed.
No acceptance, Linux, seal or ticket-completion claim is made.