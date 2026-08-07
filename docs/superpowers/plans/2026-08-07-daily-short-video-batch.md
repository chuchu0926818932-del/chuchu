# 2026-08-07 Daily Short Video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish 30 strictly deduplicated Google Keep-style short-video plans for 2026-08-07.

**Architecture:** Add one date-scoped topic module and aggregate it in the existing topic library. Retarget the library checker and date-scoped Markdown/Excel exporters to this module so the website and both deliverables share one data source.

**Tech Stack:** Next.js, TypeScript, tsx, PowerShell Excel COM automation, pnpm, Git, Vercel CLI.

## Global Constraints

- Add exactly 10 topics each for 女性成長（職涯／事業）、金錢價值觀、親子關係。
- 女性成長 is limited to workplace boundaries, promotion or salary discussion, career transition, professional positioning, entrepreneurship, work confidence, collaboration, and leadership.
- Treat retired, foundational, all prior daily topics, and desktop Markdown/Excel outputs only as strict deduplication references; do not rewrite, combine, extend, or overwrite them.
- Each topic must populate title, hook, scene, empathy, explain, action, reframe, singleCta, category, formula, contentType, risk, check, storyline, storyElements, and threeLayer.
- Keep title, hook, scene, core viewpoint (`explain`), and single CTA unique across the batch; title/hook/scene must also be globally unique.
- Rotate all eight formulas 3 or 4 times each. Give no investing, lending, or financial-product guidance; do not label children or promise parenting outcomes.

---

### Task 1: Establish the 2026-08-07 validation contract

**Files:**
- Modify: `scripts/check-topic-library.ts`

**Interfaces:**
- Consumes: `topics` from `app/topics.ts`.
- Produces: a failure until a 30-record `D20260807-` batch raises the library to 350 topics.

- [ ] Change the daily ID filter to `D20260807-` and expected library size to `350`, retaining the existing cross-section category totals for the batch slice.
- [ ] Run `pnpm exec tsx scripts/check-topic-library.ts` and confirm it fails because the 2026-08-07 batch does not yet exist.

### Task 2: Add the isolated daily batch

**Files:**
- Create: `app/daily-topics-2026-08-07.ts`
- Modify: `app/topics.ts`

**Interfaces:**
- Consumes: `Topic` and the established formula metadata convention.
- Produces: `dailyTopics20260807: Topic[]` with IDs `D20260807-01` through `D20260807-30`.

- [ ] Define 30 complete Keep-style topic drafts, exactly 10 per category, then map formula order/index and presentation metadata.
- [ ] Import and append the batch in `app/topics.ts` immediately after the 2026-08-05 batch.
- [ ] Run the library checker and confirm 30 daily records, 350 total records, and strict deduplication.

### Task 3: Create delivery files

**Files:**
- Create: `scripts/export-daily-batch-2026-08-07.ts`
- Create: `scripts/export-daily-batch-2026-08-07.ps1`
- Create: `C:\\Users\\USER\\Desktop\\短影音文案\\源源不絕主題庫\\每日新增\\2026-08-07_30條.md`
- Create: `C:\\Users\\USER\\Desktop\\短影音文案\\源源不絕主題庫\\SNL_每日新增短影音主題庫_2026-08-07.xlsx`

**Interfaces:**
- Consumes: `dailyTopics20260807`.
- Produces: a 30-entry Markdown file and a 17-column workbook worksheet named `每日新增_2026-08-07`.

- [ ] Generate Markdown and JSON staging data from the date module and verify its count is 30.
- [ ] Generate a non-overwriting workbook, inspect its header and data range, scan formula errors, and render the worksheet for visual QA.

### Task 4: Verify and publish

**Files:**
- Modify/create only the files above.

- [ ] Run `pnpm lint` and `pnpm test`.
- [ ] Review `git status --short` and `git diff --check`; commit only the scoped source, checker, exporters, and this plan.
- [ ] Push `main`, deploy with `pnpm dlx vercel@latest --prod --yes`, and verify the production URL returns HTTP 200.
