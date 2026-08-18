# 2026-08-18 Daily Short-Video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one isolated 30-topic daily batch and publish it with date-named exports.

**Architecture:** Keep all prior and retired topics immutable. A new date-scoped module supplies the 30 records, `app/topics.ts` aggregates it, and the existing checker verifies library-wide deduplication and the new-batch rules. A date-specific exporter creates Markdown and serializes the data needed by the workbook pipeline.

**Tech Stack:** Next.js, TypeScript, pnpm, Node.js, Git, Vercel.

## Global Constraints

- Create exactly ten original topics per category: 女性成長（僅職涯／事業）、金錢價值觀、親子關係。
- Do not modify retired, foundational, or earlier daily topic content.
- All title, hook, scene, core viewpoint, and CTA values must be unique; use the eight formulas three or four times each.
- Money copy provides no investment, lending, or financial-product advice; parenting copy uses no child labels or promised outcomes.

---

### Task 1: Validate the new batch contract

**Files:**
- Modify: `scripts/check-topic-library.ts`

**Interfaces:**
- Consumes: `topics` from `app/topics.ts`.
- Produces: a failing then passing verification for `D20260818-01` through `D20260818-30` and 560 total topics.

- [ ] **Step 1: Change the checker expectation to `D20260818-` and 560 total topics.**
- [ ] **Step 2: Run `pnpm exec tsx scripts/check-topic-library.ts`; expect failure because the new batch is not yet registered.**
- [ ] **Step 3: Confirm the failure is the expected absent-batch count, not a tooling error.**

### Task 2: Add and register the dated content module

**Files:**
- Create: `app/daily-topics-2026-08-18.ts`
- Modify: `app/topics.ts`

**Interfaces:**
- Consumes: `Topic` from `app/topics.ts`.
- Produces: `dailyTopics20260818: Topic[]` with IDs `D20260818-01`–`D20260818-30`.

- [ ] **Step 1: Author the 30 independent records with all required topic fields through the established mapper.**
- [ ] **Step 2: Import and append `dailyTopics20260818` in the shared `topics` array.**
- [ ] **Step 3: Run `pnpm exec tsx scripts/check-topic-library.ts`; expect the full validation to pass.**

### Task 3: Export and release

**Files:**
- Create: `scripts/export-daily-batch-2026-08-18.ts`

**Interfaces:**
- Consumes: `dailyTopics20260818`.
- Produces: one date-named Markdown file and serialized batch data for approved Excel authoring.

- [ ] **Step 1: Add the date-specific Markdown/JSON exporter and run it.**
- [ ] **Step 2: Create and visually verify the Excel workbook using the controlled artifact runtime; if that runtime is unavailable, record the blocker without using another authoring path.**
- [ ] **Step 3: Run `pnpm lint` and `pnpm test`, then stage only scoped files, commit, push `origin/main`, and deploy production with Vercel.**
