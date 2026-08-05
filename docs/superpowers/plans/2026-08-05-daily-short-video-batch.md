# 2026-08-05 Daily Short Video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish 30 strictly deduplicated Google Keep-style short-video plans for 2026-08-05.

**Architecture:** Add one date-scoped topic module and aggregate it in the existing topic library. Retarget the library checker and date-scoped Markdown/Excel exporters to this module, so the same source drives the website and both deliverables.

**Tech Stack:** Next.js, TypeScript, tsx, PowerShell Excel COM automation, pnpm, Git, Vercel CLI.

## Global Constraints

- Add exactly 10 topics each for 女性成長（職涯／事業）、金錢價值觀、親子關係.
- 女性成長 may cover only workplace boundaries, promotion/salary discussion, career transition, professional positioning, entrepreneurship, work confidence, collaboration, or leadership.
- Treat every retired, foundational, and previous daily topic and desktop output as a deduplication reference only; do not rewrite, combine, extend, or overwrite them.
- Each topic must populate title, hook, scene, empathy, explain, action, reframe, singleCta, category, formula, contentType, risk, check, storyline, storyElements, and threeLayer.
- Keep title, hook, scene, core viewpoint (`explain`), and single CTA unique across the new batch; title/hook/scene must also be unique globally.
- Rotate all eight formulas 3 or 4 times each. No financial product, investing, or lending guidance; no labels for children or promised parenting outcomes.

---

### Task 1: Add the Date-Scoped Topic Source

**Files:**
- Create: `app/daily-topics-2026-08-05.ts`
- Modify: `app/topics.ts`

**Interfaces:**
- Consumes: `Topic` from `app/topics.ts` and the existing formula order convention.
- Produces: `dailyTopics20260805: Topic[]` containing 30 records with IDs `D20260805-01` through `D20260805-30`.

- [ ] **Step 1: Define the required batch contract in the library checker**

In `scripts/check-topic-library.ts`, change the daily ID filter from `D20260804-` to `D20260805-` and the expected library size from 290 to 320, while retaining the 30-record, 10/10/10 category, required-field, uniqueness, and formula checks.

- [ ] **Step 2: Run the checker to verify the missing batch fails**

Run: `pnpm exec tsx scripts/check-topic-library.ts`

Expected: failure because no records begin with `D20260805-`.

- [ ] **Step 3: Create the smallest complete dated module**

Export `dailyTopics20260805` with the 30 fully populated Keep-style records and map it to `Topic` with `formulaOrder`, per-formula `formulaIndex`, and the established metadata fields. Import it in `app/topics.ts` and append it immediately after `dailyTopics20260804`.

- [ ] **Step 4: Run the checker to verify the source contract passes**

Run: `pnpm exec tsx scripts/check-topic-library.ts`

Expected: JSON reporting 30 daily records, 320 total topics, and `deduped: true`.

### Task 2: Generate Date-Scoped Markdown and Excel Deliverables

**Files:**
- Create: `scripts/export-daily-batch-2026-08-05.ts`
- Create: `scripts/export-daily-batch-2026-08-05.ps1`
- Create: `C:\\Users\\USER\\Desktop\\短影音文案\\源源不絕主題庫\\每日新增\\2026-08-05_30條.md`
- Create: `C:\\Users\\USER\\Desktop\\短影音文案\\源源不絕主題庫\\SNL_每日新增短影音主題庫_2026-08-05.xlsx`

**Interfaces:**
- Consumes: `dailyTopics20260805`.
- Produces: a 30-entry Markdown file and a 17-column, 30-row Excel worksheet named `每日新增_2026-08-05`.

- [ ] **Step 1: Copy the existing date-export contracts**

Adapt the 2026-08-04 TypeScript and PowerShell exporter paths, module import, JSON staging path, workbook path, and worksheet name to `2026-08-05`; keep the 17 required output columns and the non-overwriting output paths.

- [ ] **Step 2: Generate Markdown and inspect its record count**

Run: `pnpm exec tsx scripts/export-daily-batch-2026-08-05.ts`

Expected: JSON reporting the 2026-08-05 Markdown path and `count: 30`.

- [ ] **Step 3: Generate the workbook and inspect Excel's saved file**

Run: `powershell -ExecutionPolicy Bypass -File scripts/export-daily-batch-2026-08-05.ps1`

Expected: one new date-named workbook containing a header plus 30 populated topic rows.

### Task 3: Verify and Publish the Batch

**Files:**
- Modify: `scripts/check-topic-library.ts`
- Modify: `app/topics.ts`
- Create: `app/daily-topics-2026-08-05.ts`
- Create: `scripts/export-daily-batch-2026-08-05.ts`
- Create: `scripts/export-daily-batch-2026-08-05.ps1`

**Interfaces:**
- Consumes: the new batch and date exporters.
- Produces: a checked, committed, pushed, production deployment.

- [ ] **Step 1: Run static and complete test checks**

Run: `pnpm lint && pnpm test`

Expected: lint exits with no diagnostics; test output reports a successful production build, 320-topic library validation, viral DB validation, and passing rendered tests.

- [ ] **Step 2: Confirm the scoped diff and commit it**

Run: `git status --short && git diff --check && git add app/topics.ts app/daily-topics-2026-08-05.ts scripts/check-topic-library.ts scripts/export-daily-batch-2026-08-05.ts scripts/export-daily-batch-2026-08-05.ps1 docs/superpowers/plans/2026-08-05-daily-short-video-batch.md && git commit -m "feat: add 2026-08-05 daily video topics"`

Expected: only the new date-scoped batch, validation/export updates, and this plan are committed.

- [ ] **Step 3: Push and deploy production**

Run: `git push origin main && vercel --prod --yes`

Expected: `origin/main` accepts the commit and Vercel reports a Ready production deployment.
