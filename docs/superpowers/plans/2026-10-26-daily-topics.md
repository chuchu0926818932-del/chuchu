# 2026-10-26 Daily Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the dated 30-topic daily batch and its Markdown/XLSX production artifacts.

**Architecture:** A dated TypeScript topic module provides complete topic metadata. The existing central registry exposes it to the app and validators; dated export and verification scripts create and inspect the desktop artifacts.

**Tech Stack:** TypeScript, Node test runner, `@oai/artifact-tool`, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-26-daily-topics-design.md`

## Global Constraints

- Exactly 10 topics each in 女性成長, 金錢價值觀, and 親子關係.
- Women’s topics cover work or business only; money topics never give investment, lending, or financial-product advice; parenting content never labels children or promises change.
- All five protected content fields and 30 CTAs are unique across current sources.

## Review Focus

- A category count must not drift from 10/10/10 when the module is registered.
- A field collision in a Desktop Markdown/XLSX source must fail the existing dedupe check.
- A money plan must not introduce forbidden financial guidance.
- A parenting plan must not label a child or promise behavior change.
- Every exported row must retain all story and three-layer fields.

### Task 1: Register and validate the 2026-10-26 batch

**Files:**
- Create: `app/daily-topics-2026-10-26.ts`
- Modify: `app/topics.ts`, `tests/daily-topics-2026-10-26.test.ts`, `package.json`

- [x] Write a failing library test asserting thirty registered records, 10/10/10 category counts, eight formula variants, unique protected fields, and category safety restrictions.
- [x] Run the focused test and confirm it fails because the batch has not been registered.
- [x] Add the complete dated module and register it in the central library.
- [x] Run the focused test and topic-library checker to confirm they pass.

### Task 2: Export and inspect dated production artifacts

**Files:**
- Create: `scripts/export-daily-batch-2026-10-26.ts`, `scripts/create-daily-workbook-2026-10-26.ts`, `scripts/verify-daily-batch-2026-10-26.ts`
- Create: `C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃\\2026-10-26_30-topics.md`, `C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃\\2026-10-26_30-topics.xlsx`

- [x] Create Markdown and one-sheet XLSX artifacts with all 24 topic/content/story fields.
- [x] Reimport the workbook, verify title/header plus 30 records, and scan for formula errors.
- [x] Run strict full-Desktop Markdown/XLSX deduplication.

### Task 3: Release verification

**Files:**
- Modify: tracked files from Tasks 1–2 only

- [x] Run `pnpm lint` and `pnpm test`.
- [ ] Review the staged diff and commit only this batch.
- [ ] Push `main` to `origin`, then issue the requested Vercel production deployment.
