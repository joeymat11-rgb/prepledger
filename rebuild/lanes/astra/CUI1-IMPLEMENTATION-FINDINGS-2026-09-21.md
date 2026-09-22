# CUI1 PM implementation findings
Status: author corrections required, not an independent acceptance review.
Observed WIP on rebuild/c-ui1-design, parent fa593d629d858bdd7d3d72ad8885598b1be8475e.
Source: today/design.cjs and scene.mjs under rebuild/m3/w7-preview/.
Reference: rebuild/m1/approved-2026-09-18/app/app.js, especially lines290-485.
Method: whole current scene and scoped design/test hunks read; reference drawing span read.
No runtime was executed by PM for these findings; existing focused green is insufficient.

F1 COPY OWNERSHIP GUARD
The WIP removes the PREVIEW_RUNTIME_COPY absence-from-approved assertion globally.
The new pack adopting some prior wording does not justify retiring that guard.
Move exactly adopted sentences into explicit approved/runtime declarations with source identity.
Retain absence checks for the remaining preview-owned list and actual-view presence for both.
A deliberate wrongly classified approved sentence must still fail the named copy guard.

F2 COPY SOURCE CUSTODY
readCopyReferences reads new HTML/state JS without their source sha checks.
Previously the approved HTML carrying copy was sha-verified before binding.
Pin every authoritative copy source and verify it on every path consuming it.
Include recoverySection's independent call path; avoid an unchecked union of arbitrary words.

F3 MIST AND OCCLUSION FIDELITY
Approved drawing has three far and two near sheets, separate tint, drift/bob/swell,
a pixel-luminance rock/sky mask, tall-plate join smoothing and eased header clearance.
WIP draws one untinted strip and destination-in with the opaque JPEG directly.
JPEG alpha cannot substitute for the approved luminance-derived occlusion mask.
Lift the approved algorithm with necessary DOM/module/offline adaptation only.
Keep all geometry including Dawn crop and the current visible screen's dimensions.

F4 EMBER FIDELITY
Approved spawn distinguishes near, far and bokeh, with lifetime/envelope and staged tint.
WIP substitutes uniform particles, radius/pulse and per-frame movement.
Approved animation is throttled at40ms; cadence and lifetime must not drift with monitor rate.
Keep the actual approved behavior, not merely the same particle count.

F5 REDUCED MOTION ASSET READINESS
WIP starts its one still draw immediately after assigning Image.src.
drawMist skips unloaded images; no animation callback then returns to paint loaded mist.
Wait for the needed pinned images before the one complete still frame.
Count actual completed drawing, not just scheduler callbacks; no animation in reduced mode.

Proof required: retain a failing targeted fidelity/readiness regression before repair,
then real offline preview at phone dimensions in both themes and reduced motion.
Existing three scene tests only cover hook values, scheduling and bundle asset markers.
No template/product look decision, engine change, gate weakening, baseline edit or seal granted.
Author received these findings through the outgoing proof coordinator; same worker retained.
