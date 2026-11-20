# 2026-11-19 Daily Short-video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add thirty strictly novel, Google Keep-style short-video plans and publish matching Markdown and Excel artifacts.

**Architecture:** A date-specific TypeScript module supplies the thirty `Topic` records, then `app/topics.ts` registers it in the live library. A date-specific exporter serializes the same source to Markdown and a single formatted worksheet, while tests validate registration, field completeness, protected-field uniqueness, source/export parity, and Desktop-wide de-duplication.

**Tech Stack:** TypeScript, Node test runner, `tsx`, `@oai/artifact-tool`, pnpm.

**Spec:** Automation 10 task saved in `C:\Users\USER\.codex\automations\10\memory.md`.

## Global Constraints

- Produce exactly ten 女性成長 plans restricted to work boundaries, advancement, salary, career changes, positioning, business confidence, collaboration, or leadership.
- Produce exactly ten non-advisory 金錢價值觀 plans and ten non-labeling 親子關係 plans.
- Do not reuse or adapt protected title, hook, scene, core-viewpoint, or CTA text from any library or Desktop Markdown/XLSX source.
- Use each of the eight formulas three or four times; every topic must contain the complete current `Topic` schema.
- Export only the date-named Markdown and XLSX artifacts; do not alter retired batches.

## Review Focus

- A near-duplicate protected field hidden in a Desktop export must be rejected by the full Desktop scan.
- The women’s category must not drift into relationship, appearance, or generic self-growth content.
- Money language must not become investment, lending, or financial-product advice.
- Parent content must not assign a negative label or promise changed behavior.
- Workbook rows must preserve source order and every one of the 24 exported values.

### Task 1: Register the dated content source

**Files:**
- Create: `app/daily-topics-2026-11-19.ts`
- Modify: `app/topics.ts`
- Test: `tests/daily-topics-2026-11-19.test.ts`

**Interfaces:**
- Produces: `dailyTopics20261119: Topic[]` with IDs `D20261119-01` through `D20261119-30`.

- [ ] Write a test that expects thirty complete, category-safe, formula-balanced, protected-field-unique records and 2,210 total topics.
- [ ] Run the dated test and confirm it fails because the 11/19 module is absent.
- [ ] Implement the dated source module and register it after the previous daily batch.
- [ ] Run the dated test and the topic-library validator; confirm both pass.

### Task 2: Publish and verify artifacts

**Files:**
- Create: `scripts/create-daily-batch-2026-11-19.ts`
- Create: `tests/daily-batch-export-2026-11-19.test.ts`
- Modify: `scripts/check-desktop-topic-dedupe.ts`
- Modify: `tests/desktop-topic-dedupe.test.ts`

**Interfaces:**
- Consumes: `dailyTopics20261119`.
- Produces: `C:\Users\USER\Desktop\短影音企劃網站\每日新增企劃\2026-11-19_30-topics.md` and `.xlsx`.

- [ ] Write an artifact test that requires both missing date-named files and exact source parity.
- [ ] Run the artifact test and confirm it fails because the files are absent.
- [ ] Implement the exporter with a frozen, filtered worksheet and update the Desktop de-duplication command to target 11/19.
- [ ] Run the exporter, inspect its saved workbook and render, then run the artifact and Desktop de-duplication tests.

### Task 3: Verify and publish

**Files:**
- Modify: `package.json` only if the current test runner does not include the dated tests.

- [ ] Run `pnpm lint`, `pnpm test`, and the dated artifact checks.
- [ ] Review the final diff and Desktop collision scan; commit only new 11/19 source, tests, exporter, dedupe targeting, and plan.
- [ ] Push `main` and attempt the authenticated production Vercel deployment.
