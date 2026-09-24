# CUI1 acceptance-interface preflight L1
Reviewer: Astra, independent of author and integrator.
VERDICT: BLOCKED STATIC PREFLIGHT; no ACCEPT, runtime, or visual-fidelity claim.
Candidate: 45d12d73b0b60f9f23c100b6378d51afd3d7304d.
Gate/common contract: 80fad72b62577900ce07a2910a9b6a1db47d7cca.
Blind order: C-UI-1, pack README locks and STANDARD, then actual build/scene/template and gate/common.
No author report or PM finding was supplied or read before these observations.
Paths: P=rebuild/m3/w7-preview/today; Q=rebuild/m1/approved-2026-09-18/quality.
Contract: rebuild/lanes/c/ui-port/C-UI-1.md:7-17 permits pins/scene/build/hooks, defers layout.
Pack README:104-113 requires real preview hooks; :384-435 locks copy, fonts and one real/drawn layout.
B1 BLOCKER: the only active screen contains decoration, not the application's controls.
P/scene.mjs:338-344 creates aria-hidden .scene-frame.screen.is-active beside #phone.
P/index.shell.html:22-27 contains the real .view#phone; P/screens.template.html:14-74 renders article.page.
Q/gate.py:145,301-304 refuses without .screen.is-active .ui, before any scene/font/copy result.
Q/common.py:544-587 sweeps that .ui; Q/gate.py:169 sweeps animation only inside the active screen.
An empty probe .ui would evade actual-copy/animation checks. Do not add one.
Minimal owned remedy: build/scene adapter makes the real live host .ui inside its real active-screen ancestor;
keep only decoration aria-hidden, retain controls/listeners, and keep the scene outside the UI-hide region.
B2 BLOCKER: correct font bytes alone cannot satisfy the named real-element font checks.
Q/gate.py:83-93,201-228,351-367 requires Today #greeting/#status-line/#proposal-lift,
Workout .screen-title/#set-count/#w-value/#r-value/.numerals .times/#machine .setting/#log-label,
and Coach .coach-title/.coach-line. Those identities are absent from P/screens.template.html.
P/screens.template.html:334-354 contains coach/workout stubs; :363-443 has the older gym markup.
P/today-app.cjs:1779-1795 routes to that stub or the existing gym, not a new-pack screen.
Aliasing an equivalent real element may be legitimate; invented/dummy proposal or workout fields are not.
Full replacement is CUI2/4/6 work (pack README:467-537), outside this ticket's ownership.
Keep named failures visible; PM must resolve this sequencing/interface scope before claiming CUI1 acceptance.
B3 BLOCKER: chrome=1 toggles a class but has no chrome to draw (P/scene.mjs:334).
Neither actual shell/template nor scene-created nodes supplies .chrome.status/.chrome.home;
pinned app/app.css:337-346 only styles them. Add presentation chrome through the owned build/scene path.
B4 STATIC TRANSPORT RISK: P/design.cjs:732-735 emits data:font URLs; Q/gate.py:313-320
handles file: directly and sends other schemes to pg.request.get, with no data-URL decoding.
Use pinned relative offline fonts via owned design/build packaging, or separately commission a gate transport fix.
This concern is not an executed failure here; hash equality must remain enforced.
Real hook positives: P/scene.mjs:329,347-350 sets the theme root and board date on the live date slot;
P/today-app.cjs:1832-1835 reads screen from the real route. These do not repair B1-B3.
No build, browser, gate, test, install, protected input, product edit or baseline write occurred.
