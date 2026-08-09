# 2026-08-09 Daily Short Video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish 30 fully deduplicated Keep-style short-video plans for 2026-08-09, with 10 topics in each required category.

**Architecture:** Add one immutable date-scoped topic module and register it in the existing topic aggregator. The existing checker becomes the release gate for the new date; date-specific Markdown and XLSX exports are generated without modifying older outputs.

**Tech Stack:** TypeScript, tsx, pnpm, @oai/artifact-tool, Git, Vercel.

## Global Constraints

- 女性成長 only covers career boundaries, promotion/salary, transition, positioning, entrepreneurship, work confidence, collaboration, or leadership.
- 金錢價值觀 excludes investment, lending, financial-product, and return advice.
- 親子關係 avoids child labels and promises of behavioral outcomes.
- All 30 title, hook, scene, core viewpoint, and single CTA values are unique; formula counts are 3 or 4 across all eight formulas.
- Retired, foundational, older daily, Markdown, and Excel material is deduplication-only and remains unchanged.

---

### Task 1: Establish the 2026-08-09 release gate

**Files:**
- Modify: `scripts/check-topic-library.ts`

- [ ] **Step 1: Change the target ID prefix to `D20260809-` and expected total to `410`.**
- [ ] **Step 2: Run `pnpm exec tsx scripts/check-topic-library.ts` and verify it fails because the new 30-topic module is absent.**
- [ ] **Step 3: Keep the existing checks for complete fields, 10/10/10 categories, global title/hook/scene uniqueness, batch explain/CTA uniqueness, and 3/4 formula rotation.**

### Task 2: Add the independent daily topic module

**Files:**
- Create: `app/daily-topics-2026-08-09.ts`
- Modify: `app/topics.ts`

- [ ] **Step 1: Add 30 original `DailyDraft` records using all required fields and date IDs `D20260809-01` through `D20260809-30`.**
- [ ] **Step 2: Register `dailyTopics20260809` in the aggregator without altering prior modules.**
- [ ] **Step 3: Run `pnpm exec tsx scripts/check-topic-library.ts` and verify the new batch passes the release gate.**

### Task 3: Export and verify dated deliverables

**Files:**
- Create: `scripts/export-daily-batch-2026-08-09.ts`
- Create: `C:/Users/USER/Desktop/短影音企劃網站/每日新增企劃/2026-08-09_30條.md`
- Create: `C:/Users/USER/Desktop/短影音企劃網站/每日新增企劃/2026-08-09_30條.xlsx`

- [ ] **Step 1: Build Markdown from the new module with every audience-facing field.**
- [ ] **Step 2: Build a styled one-sheet XLSX with all 30 rows and the same required fields.**
- [ ] **Step 3: Inspect the table and render it to confirm no clipping or formula errors.**

### Task 4: Validate and publish

**Files:**
- Modify: release files from Tasks 1-3 only

- [ ] **Step 1: Run `pnpm lint` and `pnpm test`; both must exit zero.**
- [ ] **Step 2: Review the staged diff, commit the scoped batch, and push `origin main`.**
- [ ] **Step 3: Deploy the pushed revision to Vercel production and confirm the production URL returns HTTP 200.**
