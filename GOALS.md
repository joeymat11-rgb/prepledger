# Prep Ledger — GOALS

Read this file first. It defines what the app is for and how decisions about it get made.

---

## What this is

A single-file React PWA for training and body-composition tracking. Live at
fitnessledger2.netlify.app. Repo: `joeymat11-rgb/prepledger` (**public** since
2026-08-05 — Joe's decision, for free Actions minutes; see HANDOFF 0.23.1).
Self-described as a contest-prep rules engine built on earned states and honest data.

It is used by **one athlete**, coached by the owner. It is not a general-purpose
fitness app and should not be generalized toward one. Every design decision optimizes
for this single user's real training block.

It is distinct from MOST DAYS and Bella's Gym. Do not import patterns from those apps
without a reason grounded in this one.

---

## What success looks like

The app should:

1. Represent the athlete's true state accurately — training load, body composition,
   nutrition — without flattering it or hiding uncertainty.
2. Tell the athlete what it means and what to do next, in plain language.
3. Never lose data, never break, and never fail silently.

A feature that looks good but produces a misleading read of the athlete's state is a
regression, not a feature.

---

## How the in-app Analyst is meant to think

**Law 1 — Total data analysis.** Consider every input and instrument available, and
how they move each other. No metric is read in isolation.

**Law 2 — Two lenses, one goal.** Established research *and* this individual's own
data. Both, always. Where they disagree, say so rather than picking silently.

**Soft design — no hard seals.** When a reading is noisy, down-weight it and widen the
confidence interval. Do not go dark, do not refuse to answer, do not throw the data out.

**Plain voice.** Talk like a sharp coach to a smart friend. Lead with what it means and
what to do. No jargon, no hedging theater.

---

## Where design authority comes from

Design decisions must be founded on **published research and the athlete's own data.**

The app's own stated principles — this file included — are downstream of that evidence,
not a substitute for it. Do not justify a design choice by citing the app's constitution
or its existing behavior. If a rule in here isn't supported by research or the data,
the rule is what's wrong.

When proposing a change, cite the evidence. "The current implementation does X" is not
evidence.

---

## Prior research

Substantial research has already been done on this app. **Read it before researching
anything new.** Look for `research-brief.md`, a `/research` or `/docs` folder, and any
prior session notes in the repo.

Your job is to *extend* that work, not restart it. If a question is already answered
there, use the answer. Only run new research on genuine gaps — and say explicitly in
your output which findings are new versus carried forward.

If you cannot find prior research files in the repo, say so plainly at the start rather
than quietly starting from zero.

---

## Hard guardrails

These are non-negotiable, in every session, whether or not anyone is watching:

- **Never print, log, echo, or expose `GH_TOKEN`** or any credential.
- **Never delete athlete data.** Migrations must preserve history.
- **Keep the `/ledger` lockdown intact.** Its *purpose* changed on 2026-08-05:
  the repo is public, so this no longer keeps his data secret — it keeps the CDN
  from serving a stale second copy of his history, and keeps the deploy small.
  Still enforced by the gate; do not remove it because the secrecy reason lapsed.
- **Don't break the app.** A broken deploy is worse than an unshipped feature.
- **Don't push straight to `main`.** Pushing to main triggers GitHub Actions → Netlify,
  which is a live deploy to the athlete's phone. Work on a branch.

---

## The failure mode that matters

An unhandled error on the athlete's iPhone that nobody ever hears about.

The test suite runs headless only, so **iOS Safari is otherwise unexercised.** Anything
touching the UI, storage, or lifecycle must be reasoned about explicitly against iOS
Safari before it ships. Assume the athlete will not report the bug — they will just stop
trusting the app.

---

## Current training-block context

- No competition or show date set as of late July 2026 — the block has no fixed deadline.
  Do not build countdowns or urgency mechanics that assume one.
- The post-diet calorie figure is the **diet-exit target**. The surplus is added on top of
  it. It is not the final build number.
- Load progression varies by machine. Some have uneven jumps — e.g. a cable stack with
  hang-on attachments producing mini-jumps. The app must accept the *actual available
  weights per exercise* rather than assuming a uniform increment.

---

## Working expectations

- Take work end-to-end. Solve blockers rather than handing them back.
- Audit thoroughly before green-lighting a build. Build it once, close to right.
- Post short progress notes while running.
- Lead with the short version in any summary. No long status write-ups.
