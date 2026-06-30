# NEXT SESSION — current status & what to do next

Live handoff. Update this as work progresses. (Plan = `ROADMAP.md`; durable facts = `MEMORY.md`.)
Last updated: 2026-06-30.

## Where we are
**Phase 2 (webR delivery) pilot — IN PROGRESS; core feasibility PROVEN end-to-end.** Working on book branch `phase2/quarto-live-pilot`. Phase 1 COMPLETE & shipped (itssl `0.1.0`+`0.2.0` merged & tagged; **book PR #24 — renv pin → `v0.1.0` — now MERGED into the trunk**). Phase 0 done (go-live deferred — see ROADMAP "Go-live checklist"). Book lock still pins itssl `v0.1.0` (bump to `v0.2.0` when chapters use the data). **Shinyapps "For you to do" migration COMPLETE (2026-06-30): all 7 tutorials in-page** (ch1, ch3, ch4, ch5, ch6, r-fundamentals + ch2 with bespoke OJS sliders). Remaining Phase-2 tail = in-browser verification + the live-cell narrative rewrite; then go-live / merge PR #25. See next options.

> **Fixed 2026-06-29 — stacked-PR merge gotcha:** itssl #2 was stacked on `phase1/description-audit`; merging it landed its content on that branch, NOT `master` (no auto-retarget after #1 merged via merge-commit), and `v0.2.0` got tagged on the 0.1.0 master commit. Corrected by merging the audit branch into `master` (commit `4590087`) and moving `v0.2.0` there. Lesson in `MEMORY.md`.

## ▶ NEXT SESSION — Phase 2 tail + then go-live / Phase 3

**All 7 shinyapps tutorials migrated (branch `phase2/quarto-live-pilot` → PR #25; CI green).** Pick from:
1. **In-browser verification pass** — render proves structure, but the live behaviour (grading, MCQ feedback, and especially ch2's **OJS↔webR reactive sliders**) only runs in a real browser. Open the rendered book (or `quarto preview`) and click through, ch2 first. A Playwright harness could automate this if wanted.
2. **Live-cell narrative rewrite** (the paused rollout) — write prose that drives readers into the cells. Phase-3-adjacent; a writing pass.
3. **Per-chapter webR package trim** (optimisation) — base-R chapters (r-fundamentals) install the full book-wide list on first webR load; per-chapter `webr.packages` overrides would speed startup (verify Quarto array merge-vs-replace first).
4. **Go-live / merge PR #25** into `stabilise/ci-render` once the author's happy with the in-browser experience.
2. **Live-cell narrative rewrite** (the paused rollout) — write prose that drives readers into the cells. Phase-3-adjacent; a writing pass.
3. **Per-chapter webR package trim** (optimisation) — base-R chapters (r-fundamentals) currently install the full book-wide list (itssl/multcomp/palmerpenguins) on first webR load. Per-chapter `webr.packages` overrides would speed startup. Verify Quarto array merge-vs-replace first.
4. **Go-live** / **merge PR #25** into `stabilise/ci-render` when the author's happy with the in-browser experience across chapters.

---
*Migration reference (how it was done — for the slider work or any future tutorials):* branch `phase2/quarto-live-pilot`; `03-ttest.qmd`/`04-anova.qmd` are the reference chapters. Sources in `/Users/macleand/Desktop/shinyapps/<dir>/*.Rmd`.

**Source** (author cloned the private `TeamMacLean/shinyapps` to `/Users/macleand/Desktop/shinyapps`; my PAT can't reach that org): `/.../shinyapps/<dir>/<file>.Rmd`. **Status — all migrated:**
1. ✅ `anova/anova.Rmd` → `04-anova.qmd` — 3 multi-selects reworded to single-best; main-effects-model typo fixed; needs `multcomp` (added).
2. ✅ `type/type.Rmd` → `05-discrete.qmd` — two setup cells (numeric vs factor `plant_greenness`).
3. ✅ `chisq/chisquared.Rmd` → `06-loglinear.qmd` — **rcompanion → base `pairwise.prop.test`** (rcompanion can't load in webR: dep `rootSolve` = compiled Fortran, no WASM binary); chi-2 orientation fixed; "survivors"→"passengers" (data was passenger counts).
4. ✅ `r_basics/r-start.Rmd` → `r-fundamentals.qmd` — base-R exercises; "2+2" is result-graded (`grade_this` + shown solution).
5. ✅ `linear_models_background/linear-models-background.Rmd` → `01-background.qmd` — pure MCQ quiz, no code.
6. ✅ `linear_models/linear-models.Rmd` → `02-linear-models.qmd` — 10 single-select MCQs + 4 "Why?" reveals + the 4 reactive sliders rebuilt as **OJS `Inputs.range` → reactive `{webr}` display cells** (`#| input:` + edit/echo/runbutton false, autorun true; `//| echo: false` on the OJS blocks; `#| warning: false` to hide the benign axis-clip warning). Plus the earlier-rollout slope-demo live cells. **Needs in-browser reactivity check.**

**Per-chapter recipe (mirror ch3):**
- Top of chapter (after the opening Q/O/K block): add `{{< include ./_extensions/r-wasm/live/_knitr.qmd >}}`, and — if it has graded code exercises — also `{{< include ./_extensions/r-wasm/live/_gradethis.qmd >}}`.
- Replace the end `:::{.callout-tip}` shinyapps-link block with a "## For you to do" intro callout (keep the shinyapps URL as a fallback note) + the migrated tutorial.
- **Code exercise** → `{webr}` cells sharing an `#| exercise: <id>`: a starter editor cell, a `#| solution: true` cell, a `#| check: true` cell using the **agreed warm template**:
  `gradethis::grade_this_code(correct = "Nicely done — that's exactly it.", incorrect = "Not quite yet — and that's completely fine, this takes practice. Here's the specific thing the checker suggests you look at: {code_feedback()}")`
  Shared setup: ONE `#| setup: true` + `#| exercise: [id1, id2, …]` cell that attaches packages + builds any data (hidden). Use result-based `grade_this()` only where several valid approaches should pass.
- **MCQ** → naquiz `:::::{.question}` / `::::{.choices}` / `:::{.choice}` (+`.correct-choice`) **+** a `:::{.callout-note collapse="true"}` titled `## Why?` carrying the learnr per-answer feedback (naquiz itself shows none).
- Add any chapter-specific webR packages to `_quarto.yml` `webr.packages` (ch3 needed `palmerpenguins`; scan each tutorial's `library()` calls — itssl deps like dplyr/ggplot2/tidyr come free). Confirm each new pkg + `gradethis` is on repo.r-wasm.org for **R 4.6** (quick PACKAGES probe, or `tools/webr-verify/`).
- **FIDELITY: migrate verbatim; PING THE AUTHOR on every quirk as you hit it** (odd value, gotcha/confusing question, a detail like `na.rm` the book would rather not police) — never silently "fix". Author preference: **ping as you go, not batched.**
- Verify: `quarto render <chapter>.qmd --to live-html` clean → full `quarto render --to live-html` clean → discard regenerated `docs/` (`git checkout -- docs/ && git clean -fdq docs/`) → commit → push (CI gate runs `--to live-html`).

**Deferred (NOT part of this task):** ch2 reactive sliders; the live-cell **narrative rewrite** (Phase-3-adjacent — see ROADMAP); bumping book `renv.lock` → itssl `v0.2.0` (only once a chapter uses the potato data).

### Phase 2 status (started 2026-06-29) — on branch `phase2/quarto-live-pilot`
- **quarto-live added** to the book (`quarto add r-wasm/quarto-live` → `_extensions/r-wasm/live`, committed). Live `{webr}` cells need `format: live-html` + `engine: knitr` + the `_knitr.qmd` include.
- **itssl delivery SOLVED via r-universe.** Created `danmaclean/danmaclean.r-universe.dev` (registry repo, `packages.json` → itssl) + installed the **r-universe GitHub App** (required — without it the universe never builds). r-universe now auto-builds the **WASM binary** on every itssl release, served at `https://danmaclean.r-universe.dev`. quarto-live config: `webr: {packages: [itssl, ...], repos: [https://danmaclean.r-universe.dev, https://repo.r-wasm.org]}`. itssl `0.2.0` WASM is live for **R 4.6** (webR's current R).
- **END-TO-END PROVEN.** Headless webR (`tools/webr-verify/`) installs itssl *from the universe* (deps from r-wasm) and runs the potato analyses — p-values match native (`infection~sulfur` p=0.0061, blight logistic p=0.0163), helper builds a ggplot. Standalone `pilot-webr.qmd` renders with live cells + the universe config baked into the page.
- **Chapter 2 (`02-linear-models.qmd`) is now LIVE ✅ (first real integration).** Book switched to `format: live-html` + `engine: knitr` + book-wide `webr:` config in `_quarto.yml`. Converted the 4 self-contained illustrative chunks (slope demo, 2 add-line demos, bendy line) to `{webr}` cells; kept the data-modelling narrative chunks static `{r}`. **Key constraint:** `{webr}` cells run in the *browser* session, `{r}` chunks at *render* time — separate state, so only self-contained chunks can be converted; a hidden render-time `library(itssl)` keeps the static chunks working. Full book renders to live-html clean; ch.2 has 4 live cells, narrative intact; **non-live chapters carry 0 webR overhead** (quarto-live injects only where live cells exist). **CI gate updated** `--to html` → `--to live-html`.
- **Live-cell rollout PAUSED (author, 2026-06-29):** ch.2 proves it works, but bare interactivity doesn't add to the message without narrative built around it → logged as a Phase-3-adjacent **rewrite point** in ROADMAP ("rewrite narrative to make genuine use of webR"). Don't convert more chunks until that rewrite.
- **Shinyapps "For you to do" migration — IN PROGRESS (current focus).** Source = **`TeamMacLean/shinyapps`** (private org; my PAT can't reach it — author cloned it to `/Users/macleand/Desktop/shinyapps`). learnr `.Rmd` tutorials, content mix per tutorial: MCQs (`question()`) + code exercises (`exercise=TRUE`/`-solution`/`-check` gradethis) + ch2-only reactive sliders. **Mechanism DECIDED (author):** code exercises → quarto-live `{webr}` exercises (graded via `gradethis::grade_this_code()`); **MCQs → `naquiz`** (added at `_extensions/nareal`, `filters: [naquiz]`; `:::{.question}/.choices/.choice/.correct-choice}`) **+ a collapsible "Why?" `callout-note` for the explanation** (naquiz has no per-answer feedback). Sliders deferred (hardest; ch2 only).
  - **CH3 PILOT DONE & is the REFERENCE ✅** (`03-ttest.qmd`): 3 graded penguins exercises + 6 MCQs + 5 "Why?" reveals; needs BOTH includes (`_knitr.qmd` + `_gradethis.qmd`); added `palmerpenguins` to book webr packages. **In-browser grading + MCQs confirmed working by the author.** Grading style FINALISED: warm `grade_this_code(correct=…, incorrect="… {code_feedback()}")` — soft human lead-in then the package's auto-pointer (one exercise keeps the original `na.rm` wording then the pointer). Units-gotcha MCQ kept (author's call); p-value option set to `< 2.2e-16` with a "Why?" explaining it's R's precision floor.
  - **TODO:** migrate the other 6 tutorials the same way — `linear_models_background` (ch1, 6 MCQ), `linear_models` (ch2, 10 MCQ + **4 sliders** ← needs OJS reactive or fold into existing ch2 live cells), `anova` (ch4, 7 MCQ + 9 codeEx), `type` (ch5, 5+5), `chisq` (ch6, 1+3), `r-start` (r-fundamentals, 7+4). Keep shinyapps live until parity.
- **Committed on the branch (PR #25):** quarto-live + naquiz extensions, `pilot-webr.qmd` (throwaway, not in book nav), `tools/webr-verify/`, ch.2 + ch.3 + `_quarto.yml` + `render.yml`, `.gitignore`.
- **Also pending:** bump book `renv.lock` itssl pin to `v0.2.0` once a chapter uses the potato data (none do yet → still `v0.1.0`).

### Phase 1 status (started 2026-06-26)
- **`itssl` cloned to `/Users/macleand/Desktop/itssl`** (separate repo; same branch/PR discipline as the book). Branch `phase1/description-audit` pushed; **PR `danmaclean/itssl#1` open**; **tag `v0.1.0` pushed** (commit `b455516`). NB: when merging #1, use a merge-commit/FF (not squash) so `v0.1.0` stays reachable from `master`, else re-point the tag.
- **Dependency audit ✅ (committed):** `DESCRIPTION` `Imports` realigned to real usage — dropped 5 unused (`ggthemes`, `gridGraphics`, `multcomp`, `rcompanion`, `readr`), added 3 missing (`tibble`, `knitr`, `tidyselect`); `.Rprofile` build-ignored (it sourced the absent `renv/activate.R` and broke clean install); version `0.0.0.9000`→`0.1.0`. Clean build+install verified; all 30 helpers run.
- **webR feasibility spike ✅ POSITIVE:** full 47-pkg dep closure all present as WASM binaries; headless webR run installed them (~20s) and ran helpers (incl. `fGarch`, ggplot, knitr) — all pass. webR delivery (Phase 2) is unblocked.
- **Book `renv.lock` repointed ✅:** itssl pin moved from raw SHA (`RemoteRef master`) → tag `v0.1.0` (Version `0.1.0`, SHA `b455516`, Imports updated). **Minimal hand-edit** (only the itssl block) — deliberately did NOT run `renv::snapshot()`, which would also prune the pinned recommended pkgs (mgcv/nlme/cluster/…) and churn the lock, broadening the change. Full `quarto render --to html` succeeds against 0.1.0 (regenerated `docs/` discarded). On its own book branch `phase1/pin-itssl-v0.1.0` → **PR `intro_to_stats#24`** into `stabilise/ci-render`.
- **Real data chosen & bundled ✅:** author picked a **small themed "potato plant-pathology family"** (sourced via `agridat`, all real/published; copied into itssl so no runtime agridat dep). Added as documented `data()` objects in **itssl `0.2.0`** (`danmaclean/itssl#2`, stacked on #1):
  - `potato_scab` (Cochran & Cox 1957) → regression (scab~sulfur dose) / t-test / one-way ANOVA — one 32-row table carries the "every test is a slope" spine.
  - `potato_nematode` (van Eeuwijk 1995) → two-way ANOVA + interaction (genotype × nematode population).
  - `potato_blight` (Johnson et al. 1996) → logistic GLM (blight ~ spring weather).
  - Built clean; data + worked models verified. **Gap:** chi-square / log-linear chapters still on toy data (Mendel/voting) — potato-themed contingency set is a possible follow-up.
- **Merges/tags DONE (2026-06-29):** itssl #1 + #2 both merged to itssl `master` (now `0.2.0` with potato data, commit `4590087`); `v0.1.0` and `v0.2.0` tagged correctly and verified to `renv::install` from GitHub with data. (#2's stacked-merge mis-landing was corrected — see gotcha note above.)
- **TODO next (Phase-1 wrap):** repoint book `renv.lock` → `v0.2.0` only when chapters start using the data (Phase 3); for now it stays at `v0.1.0` and book **PR #24** can merge into the integration trunk whenever. Then **Phase 2** (quarto-live/webR pilot — now de-risked) or **Phase 3** (chapters onto potato data) or **go-live**, per author.

---
*(Phase 0 recap below — all safe work complete; only go-live remains.)*

- Group A (reproducibility) ✅ — renv.lock pins R 4.5.3 + renv 1.2.3 + itssl@commit + ~127 pkgs; clean-room restore verified.
- Group B (CI gate) ✅ — `.github/workflows/render.yml`, verified green-on-clean / red-on-error.
- Group C1 (publish) ✅ — `.github/workflows/publish.yml` builds to `gh-pages`; **live Pages source still `master:/docs` (untouched)**. C2/C3 deferred.
- Group D (bug fixes) ✅ — #12–#18 all done. RNG audit (#17): book is deterministic, **no `set.seed` needed**; fixed a stale ch.2 intercept (10.6495→10.4695).

## Branch model & policy (IMPORTANT)
- **`master` = the live site** (GitHub Pages `master:/docs`) and is **FROZEN** — do not merge to it until the deliberate go-live.
- **`stabilise/ci-render` = the integration branch / trunk** we work from. It now carries the canonical `.claude/` docs + `CLAUDE.md`. Branch new work off it; PR back into it (not master).
- The CI render gate runs on every non-master push, so feature branches are still checked.
- Note: `master` still has the OLD state (stub renv.lock, committed docs/, no CI) — that's expected; the improvements live on the integration branch until go-live.

## Open PRs
**Book** (`danmaclean/intro_to_stats`, base `stabilise/ci-render`): #19 renv (draft) · #20 CI (draft) · #21 trivial fixes · #22 ch.7/ch.2 · #23 publish (C1) — the Phase-0 stack, merge bottom-up at go-live (non-default base ⇒ close referenced issues manually). **#24 renv pin → itssl v0.1.0 — MERGED** into the trunk. Phase-2 PR (`phase2/quarto-live-pilot`) pending.
**itssl** (`danmaclean/itssl`): **#1** (0.1.0 audit) + **#2** (0.2.0 potato data) — both **MERGED**; `master` at `0.2.0` (`4590087`); tags **`v0.1.0`** and **`v0.2.0`** pushed & verified. ✅ done.

## After the migration (later options)
The immediate task is the 6-chapter shinyapps migration (▶ NEXT SESSION, above). Once that's done:
1. **Finish Phase 2 tail:** ch2 reactive sliders (OJS-reactive or fold into ch2's live cells); then the **narrative rewrite** to make the live cells earn their place (this is also when the paused live-cell rollout resumes).
2. **Phase 3 — content**: rewrite chapters onto the bundled potato data (replaces PlantGrowth/chickwts/txhousing). Open sub-question: a **potato-themed contingency dataset** so chi-square/log-linear leave toy data too. See ROADMAP Phase 3.
3. **Go-live** (whenever ready): ROADMAP "Go-live checklist" (merge the Phase-0 stack + the webR work, flip Pages to gh-pages, drop docs/, switch publish trigger). Decide whether to repoint the book lock to `v0.2.0` first.

## Environment / gotchas
See `MEMORY.md` (shell/permission conventions, gh PAT can't rerun workflows, zsh quirks). Reminder: the user once pasted a GitHub PAT in chat — suggest rotating it if not already done.
