# P5 STANDALONE FULL-BLEED v1.0, proposed by Lane D2

Proposal for PM judgment under DECISIONS:101, :116(5), :129(1), :159 and REQUESTS 2026-09-12 17:49. Source base f40d27b. This is a standalone chrome exception for Earned, not a redesign of the approved screens or the frozen app.

## Outcome
Launched from the Home Screen, Earned fills the available screen without drawing another rounded phone inside it. Content remains readable and scrollable as the keyboard, orientation and viewport change. Ordinary browser previews keep their existing frame. Storage/readiness warnings and the synthetic-athlete disclosure remain available and truthful; a full-width surface must not masquerade as a qualified real-athlete release.

## READ-LIST
- rebuild/m3/w7-preview/today/index.shell.html:5, :16, :17, :22, :28: viewport meta, stage, diagnostic aside, phone/view and trailing explanatory aside.
- rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html:5: frozen approved CSS has stage padding, 390px phone width, 844px height, 30px radius, border, hidden phone overflow and an inner scrolling view. Those are source measurements, not proposed new design numbers.
- rebuild/m3/w7-preview/today/design.cjs:43, :257, :492, :538: immutable approved hashes and approved-first/chrome-last stylesheet composition.
- rebuild/m3/w7-preview/today/preview.css:5, :20, :38, :57: 16px input correction, positioned weigh-in sheet, outer stage and fluid headline. Do not lose these behaviors when removing the standalone frame.
- rebuild/slice/pwa/preflight.js:18; preflight.css:14: display-mode and iOS navigator.standalone detection already exist for install guidance.
- rebuild/slice/pwa/shell.cjs:1; build-pwa.mjs:59, :76: A5 composes installable HTML and hashes the emitted assets/cache. Source edits must flow through that build, not through a hand-edited deploy folder.
- rebuild/DECISIONS.md:101, :114, :116(5), :121: PWA scope, owner design/copy rules, serialization and no-dash boundary. Read the latest N2/settings source before build.

## Layout contract and exact copy
Proposed policy, INVENTED for judgment: activate only for `(display-mode: standalone)` or the already-used iOS standalone signal. Do not infer installation from screen width, user agent, referrer or a query parameter. A browser tab at phone width remains the preview.
In standalone only, remove the outer stage gutters and the phone border/radius/width cap/fixed height. Use the approved paper background and existing typography/spacing tokens. The application follows normal document flow with a minimum viewport height and no fixed-height inner scroll trap; longer screens scroll to every field and action. Keep a stable fallback when dynamic viewport units are unavailable. Do not scale the page with transform or shrink input text to fit.
Retain the informational asides and their actual runtime content in flow, styled within the available width. They may wrap; they may not be hidden wholesale by `.review { display:none }`. In particular, today-storage, today-status and pwa-preflight must remain perceivable on failure, and the current synthetic-athlete notice must not disappear. Rewording stale shell claims is a separate named copy decision, not part of P5.
Account for top/bottom safe areas exactly once at the content/control boundary. The page and an overlay must not charge the same bottom inset twice. If a fixed tab rail is present on the implementation base, its buttons own their inset as the project rule requires; do not add a second inset to its container. Preserve the weigh-in sheet's attachment and make its inputs/actions reachable with the software keyboard open. Add viewport-fit only through the owned shell and test its resulting insets, rather than assuming the meta alone fixes layout.
Exact new copy: NONE. Preserve visible copy, labels and accessibility names. The only proposed literal layout limits are removal of the frame limits above; browser-test dimensions and thresholds below come from the existing screen bars. Safe-area and keyboard values must be measured or injected in tests, never guessed athlete values.

## States to demonstrate
Browser framed preview and standalone Today; first-run setup including a long exercise list; active gym with settings editor; check-in with typed draft; nutrition with refusal and read retry; weigh-in sheet with keyboard; coach composer; status/storage/offline failure; landscape; increased text size. Use synthetic data, with no live phone data or protected store.

## Executable acceptance bar
IDs are INVENTED test cases. 390x844/320px, 16px fields and 44px actions are the existing Today/gym screen requirements; other viewport/keyboard samples must be recorded as test fixtures, not device measurements.
| Cell | Required execution |
| --- | --- |
| P5-01 | In standalone emulation, measure outer phone/view geometry: full available width, no frame border/radius, no fixed 844px clipping; all page content remains reachable. |
| P5-02 | At the same dimensions in a normal browser, approved frame behavior remains unchanged. Toggling a narrow viewport alone never enables standalone chrome. |
| P5-03 | Exercise both display-mode detection and the iOS standalone signal separately, plus neither. No user-agent/query-string inference. |
| P5-04 | At 390x844 and 320px and a recorded landscape sample, test every state above for scrollWidth <= clientWidth, fields >=16px and actions >=44px. Compare actual CSS boxes, not screenshots alone. |
| P5-05 | Inject nonzero top/bottom safe-area fixtures; assert content/control clearance equals one inset and never two. Test no-inset mode as a control. A real iPhone hand test remains a separate unclaimed measurement. |
| P5-06 | Shrink the visual viewport to a declared keyboard fixture while editing a set/check-in/coach/weigh-in; focused field, error and action can be brought into view, with draft intact and no sideways page pan. Restore viewport and rotate without reload. |
| P5-07 | Long content and increased text size stay scrollable; no overflow:hidden, transform scaling or fixed height hides an action. Overlay attachment still belongs to the current screen. |
| P5-08 | Force storage/open/offline failures; all diagnostic state nodes and synthetic notice remain visible or directly reachable. No readiness claim changes merely because standalone is active. |
| P5-09 | Approved HTML/CSS source hashes and engine/client/host bindings unchanged. New rules live in owned chrome; normal-browser regression screenshots and build/copy bindings pass. |
| P5-10 | Mutants: standalone enabled by width; phone fixed height restored; inset doubled; diagnostics hidden; input reduced below 16px; keyboard content clipped. Each is detected by measured assertions. |
| P5-11 | Proposed `node --test rebuild/m3/w7-preview/today/test/standalone-layout.test.mjs` for state/detection contract, plus proposed `node rebuild/m3/w7-preview/today/standalone-check.mjs` for real browser geometry. Build Today and A5; run existing screen browser checks and A5 offline check. |
| P5-12 | Enumerate the new test in exact-head Windows/Ubuntu CI through the named owner. Report counts, screenshots/measurements and CI IDs; do not represent desktop emulation as an actual iOS hand-proof. |

## Custody and size
| Surface | Owner / rule |
| --- | --- |
| today/preview.css, index.shell.html, proposed standalone tests/check; minimal design.cjs binding changes | Lane C, only after its current Today package; approved style bytes stay pinned |
| pwa/preflight.js or preflight.css for the existing iOS signal, A5 tests | Explicit A5 chrome companion under the same P5 build; coordinate P7 so these files have one writer |
| today-entry/bindings/host wrappers/pinned tests, workflows | No implicit edit authority; use the current owner/pin process if a concrete dependency requires it |
| Athlete stores, engine/client rules, frozen app, private data | No changes |

Size: MEDIUM, INVENTED planning estimate; overlay and keyboard behavior make this more than deleting a border. PM judges the standalone chrome policy before C builds; owner look is on the real built screen, not another mock. D2 reviews Claude implementation with measurements, and leaves physical-phone proof explicitly pending until observed.
