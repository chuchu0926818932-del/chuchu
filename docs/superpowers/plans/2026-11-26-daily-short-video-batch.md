# 2026-11-26 Daily Short-video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register and export 30 original, policy-safe 2026-11-26 short-video plans.

**Architecture:** A date-stamped Topic module is the sole data source. The established validation helper verifies date-specific Markdown and XLSX outputs against that module, while library and Desktop scanners protect all required unique fields.

**Tech Stack:** TypeScript, tsx/node:test, existing XLSX artifact API, pnpm/Vinext.

**Spec:** `docs/superpowers/specs/2026-11-26-daily-short-video-batch-design.md`

## Global Constraints

- Exactly 30 records: 10 women-career/business, 10 money-values, 10 parenting.
- Keep-style six-part storytelling; all Topic, story, and three-layer fields populated.
- Strict source and Desktop title/hook/scene/core-viewpoint/CTA dedupe; no predecessor content as a creative source.
- Eight formulas appear 3–4 times; no financial advice, child labels, or behavior guarantees.
- Export date-named Markdown and Excel artifacts without changing retired versions.

## Review Focus

- Women content remains workplace/business-only.
- Protected fields do not collide with library or Desktop sources.
- Markdown and workbook rows remain exactly equal to source records.
- Copy avoids financial advice, child labels, and outcome guarantees.
- Formula distribution remains within 3–4 uses each.

### Task 1: Define and register the dated batch

**Files:**
- Create: `tests/daily-topics-2026-11-26.test.ts`
- Create: `app/daily-topics-2026-11-26.ts`
- Modify: `app/topics.ts`, `package.json`, `scripts/check-desktop-topic-dedupe.ts`, `tests/desktop-topic-dedupe.test.ts`

- [ ] Write a failing test for 30 complete, safe records; run it and confirm the module is missing.
- [ ] Add original `dailyTopics20261126` records with IDs `D20261126-01` to `D20261126-30`, register the module and newest-batch dedupe guard.
- [ ] Re-run the focused test and confirm the complete batch passes.

### Task 2: Produce exact date-specific artifacts

**Files:**
- Create: `tests/daily-batch-export-2026-11-26.test.ts`
- Create: `scripts/export-daily-batch-2026-11-26.ts`
- Create: `scripts/create-daily-workbook-2026-11-26.ts`

- [ ] Write and run a failing test for the absent Markdown and XLSX files.
- [ ] Generate both artifacts from the date module using the existing 24-column, frozen and filtered layout.
- [ ] Re-run export verification for exact source parity.

### Task 3: Release verification and publishing

**Files:**
- Modify only Task 1–2 files if validation identifies a defect.

- [ ] Run `pnpm lint`, `pnpm test`, strict Desktop dedupe, artifact visual QA, and `git diff --check`.
- [ ] Commit only the 11/26 work while preserving user-owned untracked files, then push `origin main`.
- [ ] Attempt `vercel --prod` and report the actual deployment result or credential blocker.
