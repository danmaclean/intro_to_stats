# Roadmap — Understanding Statistics Through Linear Models

Planning document (not a commitment to dates). Captures direction agreed in planning, June 2026.

> **Live status lives in `.claude/NEXT-SESSION.md`.** This file is the plan; that file is where we are in it.

## Status (2026-06-26)

**Phase 0 safe work complete** + **Phase 1 essentially complete.** Done on integration branch `stabilise/ci-render` (+ the external `itssl` repo).

Phase 0:
- Group A (reproducibility) ✅ — full `renv.lock`, `itssl` pinned, clean-room restore verified.
- Group B (CI gate) ✅ — render-on-PR, verified green/red.
- Group D (bug fixes) ✅ — all of #12–#18 (RNG audit concluded: book is deterministic, no `set.seed` needed).
- Group C1 (publish workflow) ✅ — builds to `gh-pages`; live source untouched. **C2/C3 deferred to go-live.**

Phase 1 (all four goals ✅ — detail in the Phase 1 section below): webR feasibility confirmed; `itssl` dependency audit (0.1.0, tagged `v0.1.0`); real **potato plant-pathology data** bundled (0.2.0); book `renv.lock` repointed to `v0.1.0`. Pending only the PR merges + a `v0.2.0` tag (see `NEXT-SESSION.md`).

Remaining Phase 0 = the go-live steps only (see checklist below), deliberately deferred while `master` serves the live site. **Next: Phase 2 (webR delivery) / Phase 3 (content onto the potato data) / go-live — author's call.**

## Fixed constraints / principles

- **Audience is always the absolute-beginner biologist.** Gentle on-ramp is the product. New material must not raise the floor.
- **Course time is tight** — arguably the current book is already too much for the time available. New content must be *rationed*: a lean "core" path the course can actually cover, with deeper material clearly optional.
- **Hosted on GitHub Pages** (static). Any interactivity must be client-side.
- The straight-line / "every test is a slope in a linear model" thesis is the book's identity — protect it.

## Key technical facts that shape the plan

- **webR runs entirely client-side (WASM)** → compatible with static GitHub Pages, and can *replace* the shinyapps.io exercises (removing a server dependency we don't fully control). Quarto integration via the `quarto-live` extension.
- **Gating unknown:** whether `itssl` + its dependencies install inside webR. Pure-R packages install from source; compiled deps need prebuilt WASM binaries (repo.r-wasm.org). A feasibility spike must happen before committing to in-page code.
- **`renv.lock` currently pins only `renv` itself** — the book is not actually reproducible, and depends on an unpinned GitHub `itssl`. This is the biggest threat to longevity.

---

## Phase 0 — Stabilise (do first; foundation for everything)

Goal: make the *existing* book reproducible and correct before changing scope.

Each task is a feature branch → PR (per CLAUDE.md dev process). Suggested branch names in `code`.
Groups A–D; order is A → B → (C and D can follow once B is green). D tasks are independent of each other.

### Group A — Reproducibility (must come first; enables CI)

- [ ] **A1. Establish a known-good baseline render.** `git`-clean working tree, run a full `quarto render` with currently-installed packages; record any existing breakage. *AC: full render completes with no R errors, OR breakages are listed as blockers to fix first.* Branch: none (investigation; findings noted here).
- [ ] **A2. Full `renv` snapshot.** Ensure the renv library has every dep actually used — dplyr, ggplot2, multcomp, readr, tidyr, tibble, magrittr, itssl (+ transitive); consider upgrading `renv` itself (currently 0.12.0, very old). `renv::snapshot()`, commit `renv.lock`. *AC: `renv::status()` clean; lock lists all the above.* Branch: `stabilise/renv-snapshot`.
- [ ] **A3. Pin `itssl` explicitly.** Install from a fixed ref (cut a tag in the `itssl` repo, or pin current commit) so `renv.lock` records a fixed `RemoteSha`. *AC: lock shows itssl with a pinned SHA/ref, not floating `main`.* Branch: `stabilise/pin-itssl`. (Note: deeper itssl work is Phase 1; this is just the pin.)
- [ ] **A4. Verify clean-room restore.** From a fresh checkout / empty renv library, `renv::restore()` then `quarto render` reproduces a clean build. *AC: clean-environment render succeeds.* This is the real proof the lock works.

### Group B — Continuous integration

- [ ] **B1. Render-on-PR workflow.** GitHub Action (`.github/workflows/render.yml`): triggers on PRs to `master` and pushes to feature branches; steps = checkout → setup-quarto → setup-R → restore renv from lock (with `GITHUB_PAT` from `secrets.GITHUB_TOKEN` for the GitHub-sourced itssl) → `quarto render` → **fail on any R error**; cache the renv library. Render **HTML only** for the gate (keep it fast; avoids LaTeX). *AC: green on a no-op PR; verified red by intentionally breaking a chunk on a scratch branch.* Branch: `stabilise/ci-render`.
- [ ] **B2. PDF-in-CI decision.** Recommend: HTML-only gate; PDF left out of the blocking job (it's second-class — see rationing decision). *AC: choice recorded.*

### Group C — Publishing flow (highest risk: touches the live site; do after B is green, stage to avoid downtime)

Assumption to confirm: GitHub Pages currently serves `master:/docs`.

- [ ] **C1. Add a `gh-pages` publish job** (quarto publish action) on push to `master`; verify it builds and pushes to a `gh-pages` branch **without yet** changing the Pages source. *AC: `gh-pages` branch contains a correct build.* Branch: `stabilise/ci-publish`.
- [ ] **C2. Flip Pages source** from `/docs` to the `gh-pages` branch (repo settings); verify the live site is intact. *AC: live site unchanged, now served from CI build.*
- [ ] **C3. Stop committing build output.** Remove `docs/` from the repo, `.gitignore` it (and/or move `output-dir` to `_site`). *AC: site still live; repo no longer tracks generated HTML/PDF.* Branch: `stabilise/drop-docs`.
- Rollback safety: keep `docs/` in place until C2 is verified.

### Group D — Known content bugs (independent; each a small branch; land after B1 so CI checks them)

- [ ] **D1.** `07-testing_model.qmd` — close the unclosed Roundup callout / repair the truncated ending. Decide whether ch.7 should have a "For you to do" (it's the only chapter without one — confirm intentional rather than inventing a link). Branch: `fix/ch07-ending`.
- [ ] **D2.** `08-predictions.qmd` — "turns it into something **useless**" → "useful"; give the final one-bullet roundup a title and align to the Roundup pattern. Branch: `fix/ch08-typos`.
- [ ] **D3.** `09-glms.qmd` — remove the "in this chapter we went to a lot of trouble…" copy leaked from ch.7. Branch: `fix/ch09-copy`.
- [ ] **D4.** `data.frame(x <- runif(...), y <- runif(...))` → `data.frame(x = ..., y = ...)` in ch.2 (`more_df`) and ch.7 (`far_fit`). **Render-check** that `its_plot_xy_time()`, `lm(y ~ x)`, and `aes(sample = y)` still resolve `x`/`y` columns afterwards (current code only works via leaked globals). Branch: `fix/dataframe-naming`.
- [ ] **D5.** Update stale "May 2022" date in `_quarto.yml`. Branch: `fix/date`.
- [ ] **D6. RNG reproducibility audit (investigation, possibly larger).** No `set.seed` exists anywhere, yet prose hard-codes computed values from random data (e.g. ch.2 `y = 1.955x + 0.778` from `its_random_xy_time(20)`; the `runif` chunks in ch.2/ch.7). On re-render these can desync from the rendered output. Determine whether `itssl` helpers seed internally; if not, decide the fix (seed in chunks/helpers, or reference values dynamically via inline `` `r ` `` as ch.8 already does). NB: ch.3's `5.03` / `-0.371` come from the deterministic `PlantGrowth` dataset and are safe. May split into its own task if it grows. Branch: `fix/rng-repro`.
- [ ] **D7 (optional cleanup).** Remove the stray `09-glms.ipynb` (not wired into `_quarto.yml`; the `.qmd` is canonical). Branch: `fix/remove-ipynb`.

**Phase 0 done when:** clean checkout → `renv::restore()` → `quarto render` succeeds with no R errors; CI gates PRs into `master`; the live site is served from the CI build (not committed `docs/`); D1–D6 resolved.

### Go-live checklist (deferred — the only remaining Phase 0 work; touches the LIVE site)

Do deliberately, in order. The stabilisation work sits in a PR stack on `stabilise/ci-render`; `master` is frozen until this.

1. **Merge the stack bottom-up to `master`**, un-drafting first: #19 (renv) → #20 (CI) → #21 (trivial fixes) → #22 (ch.7/ch.2 fixes) → #23 (publish workflow). Or merge the integration branch in one go once it contains them all. Manually close #9–#18 references (non-default base means no auto-close).
2. **Reconcile docs:** this branch keeps the canonical docs in `.claude/`; delete the root `ROADMAP.md` that came from PR #2 (superseded by `.claude/ROADMAP.md`). Take the branch's `CLAUDE.md` if an add/add conflict surfaces.
3. **C2 — flip Pages source** from `master:/docs` to the `gh-pages` branch (repo Settings → Pages), *after* a fresh `gh-pages` build exists. Verify the live site is intact.
4. **C3 — stop committing `docs/`:** `git rm -r docs/`, add to `.gitignore`.
5. **Switch the publish trigger** in `.github/workflows/publish.yml` from `[stabilise/ci-publish]` to `[master]`; decide whether to also render the PDF download (currently HTML-only).
6. **Update `CLAUDE.md`** lines that were true only for frozen `master` (it now reflects the post-stabilisation state already on the integration branch).

## Phase 1 — Modernise `itssl` (enabler for webR + real data)

Goal: turn `itssl` from an unpinned helper into a durable, webR-ready, data-bearing package.

- [x] Versioned, tagged releases. — `itssl` bumped `0.0.0.9000`→`0.1.0`; PR `danmaclean/itssl#1`; **tag `v0.1.0` pushed**; book `renv.lock` repointed from raw SHA → tag `v0.1.0` (minimal hand-edit, full render verified) on book branch `phase1/pin-itssl-v0.1.0`.
- [x] **webR/WASM compatibility — SPIKE DONE, RESULT POSITIVE.** itssl is pure-R (installs from source); its full 47-package transitive dependency closure is 100% present as WASM binaries on repo.r-wasm.org (incl. the compiled `fGarch`, `scatterplot3d`, `cowplot`). A headless webR (Node) run installed the deps in ~20s and ran representative helpers (incl. the `fGarch::rsnorm` path, ggplot build, knitr table) — all PASS; seeded helpers reproduce the native values. **Conclusion: no blocker to webR delivery (Phase 2).**
- [x] Bundle the **real biology dataset(s)** in the package so chapters can `data()` them. — Author chose a **small themed potato plant-pathology family** (real/published, via `agridat`, copied in so no runtime dep). Shipped in itssl `0.2.0` (`danmaclean/itssl#2`, stacked on #1): `potato_scab` (regression/t-test/ANOVA), `potato_nematode` (two-way + interaction), `potato_blight` (logistic GLM). Documented with primary-source citations; built & verified. *(Chapters adopting the data = Phase 3. Chi-square/log-linear still on toy data — possible follow-up.)*
- [x] Audit helpers (dependency audit): `DESCRIPTION` `Imports` realigned to actual usage — dropped 5 unused (`ggthemes`, `gridGraphics`, `multcomp`, `rcompanion`, `readr`), added 3 missing (`tibble`, `knitr`, `tidyselect`); build-ignored `.Rprofile` (was breaking clean `R CMD INSTALL`). Verified: clean build+install, all 30 helpers load/run. *(Deeper "does a helper hide something a beginner should see" editorial audit still open — overlaps Phase 3.)*

## Phase 2 — Modernise delivery (webR in-page)

Goal: remove install friction and self-host interactivity.

**Status (2026-06-29): pilot underway, core feasibility PROVEN end-to-end** (branch `phase2/quarto-live-pilot`). `quarto-live` adopted; `itssl` delivered to the browser via the **`danmaclean.r-universe.dev`** r-universe (auto-built WASM binary; r-universe GitHub App installed). Headless webR (`tools/webr-verify/`) installs itssl from the universe and runs the potato analyses green; standalone `pilot-webr.qmd` renders with live cells. Remaining = rollout. (Details + exact config in `MEMORY.md` / `NEXT-SESSION.md`.)

- [x] Adopt `quarto-live`; pilot on ONE chapter end-to-end before rolling out. — done: book switched to `format: live-html`; **chapter 2 (`02-linear-models.qmd`) integrated** with 4 live `{webr}` cells; full book renders clean; non-live chapters carry 0 webR overhead; CI gate updated to `--to live-html`. (PR #25.)
- [~] Convert code chunks to live/editable incrementally. — pattern established + PROVEN on ch.2 (4 live cells). **Rollout PAUSED by author (2026-06-29):** bare interactivity doesn't add to the message without narrative built around it. Resume only as part of the rewrite point below. (The mechanism is done; this is now a writing task, not a tooling one.)
- [ ] **(Rewrite point — later) Rewrite the narrative to make genuine use of webR interactivity.** Don't just convert chunks; write prose that pushes the reader *into* editing/running them (predict-then-run, "change `a` and see…", mini-challenges). This is the thing that makes live cells worth it. A content/editorial pass, likely alongside Phase 3.
- [~] **Migrate the shinyapps "For you to do" exercises into the page — 6 of 7 DONE.** Source = **`TeamMacLean/shinyapps`** (private; cloned to `~/Desktop/shinyapps`); learnr `.Rmd` tutorials. Mechanism: **code exercises → quarto-live `{webr}` exercises** (gradethis warm `grade_this_code()` template, soft lead-in + `{code_feedback()}`); **MCQs → `naquiz` + a "Why?" collapse callout**. Migrated: `ttests`/ch3, `linear_models_background`/ch1, `anova`/ch4, `type`/ch5, `chisq`/ch6, `r-start`/r-fundamentals. **Remaining: `linear_models`/ch2** — 10 MCQs *coupled to 4 reactive sliders*, so it needs the slider solution (OJS-reactive) done with it. Notable deviations (author-approved): ch4 multi-selects→single-best + typo fix; ch6 rcompanion→base `pairwise.prop.test` (rcompanion won't load in webR) + chi-2 orientation + "survivors"→"passengers". Keep shinyapps live until parity.
- [ ] Reconsider whether the install-heavy `prerequisites.qmd` can shrink dramatically once readers run code in the browser.

## Phase 3 — Content (built on the new itssl + real data)

Goal: extend coverage without overloading the core path. Apply the rationing strategy below (Core/Extension by statistical load; within-chapter progressive disclosure; "Going Further" part for separate advanced topics).

- [ ] Thread one genuine, messy biology dataset across chapters (replaces PlantGrowth / chickwts / txhousing).
- [ ] Write GLMs as a *real but fenced* chapter in the "Going Further" part: a worked `glm()` example (logistic or Poisson) with residual check & interpretation. Replaces the current stub; lives outside the core course path.
- [ ] Candidate additions, all as clearly-marked *extension* tier given the beginner+time constraint:
  - Effect sizes & confidence intervals (important — the book leans hard on p-values, the very thing it critiques).
  - Random effects / blocking (biology is full of batch/plate/replicate; natural extension of the thesis).
  - Multiple-testing correction (FDR/BH) — small add to the ANOVA chapter.
- [ ] Audit the ch.5 "rank-then-`lm()`" framing — it's an *approximation* of Wilcoxon/Kruskal-Wallis, not an identity; make sure claims are hedged.

---

## Decided — time-rationing strategy

- **One online reference text.** No Quarto profiles, no separate course/reference builds — a single site is the product.
- **The rationing axis is statistical depth/load, not "optional" in general.** Content is *Core* or *Extension* by how much statistical weight it adds to a beginner, not by whether it's strictly necessary.
- **English-context asides stay inline.** Asides that deepen *understanding in plain language* (rather than pile on more stats) are part of the core voice and are NOT rationed.
- **Granularity is within-chapter**, via progressive disclosure — collapsible callouts / `panel-tabset` ("quick vs deep"). Heavy statistical content stays *present* but folded so the beginner's visible page stays light.
- **Genuinely separate advanced topics** (GLMs, random effects, effect sizes, FDR) go in a fenced **"Going Further"** Part the course doesn't assign.
- **Existing overload → editorial scissors first.** Tighten/trim core chapters and lift heavy asides into folded Extension before reaching for more tooling.
- **No reading-time estimates** — rejected as a false target that demoralises rather than helps.
- **PDF is not a constraint.** It's a second-class, little-used product; collapsibles flattening (expanding) in PDF is acceptable.

## Decided — content & sequencing

- **GLMs**: a *real but fenced* chapter in the "Going Further" part (worked `glm()`, residual check, interpretation). Replaces the stub; stays off the core course path.
- **Sequencing**: confirmed **Phase 0 → 1 → 2 → 3** (Stabilise → Modernise itssl → webR delivery → Content). No content win pulled forward — reproducibility and the itssl/webR enablers come first.