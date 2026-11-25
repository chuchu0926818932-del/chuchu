# 2026-11-25 Daily Short-video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register and export 30 original, policy-safe 2026-11-25 short-video plans.

**Architecture:** Add one immutable date-stamped Topic module and register it with the existing library. Date-specific tests protect content and export parity; date-specific scripts render Markdown and XLSX from the same module.

**Tech Stack:** TypeScript, tsx/node:test, existing XLSX artifact API, pnpm/Vinext.

**Spec:** `docs/superpowers/specs/2026-11-25-daily-short-video-batch-design.md`

## Global Constraints

- Exactly 30 records: 10 women-career/business, 10 money-values, 10 parenting.
- Keep-style six-part storytelling; all Topic, story, and three-layer fields populated.
- Strict source and desktop title/hook/scene/core-viewpoint/CTA dedupe; no predecessor content as creative source.
- Eight formulas appear 3–4 times; no financial advice, child labels, or outcome promises.
- Export a date-named Markdown and Excel workbook without modifying retired versions.

## Review Focus

- Category drift: women topics must remain workplace/business-only; topic test pins 10 approved-category records.
- Protected-field collision: library and desktop scan must find none after registration and export.
- Export drift: source records and each Markdown/XLSX field must be equal in the export test.
- Safety drift: tests assert no investment/loan/product advice, child labels, or behavior guarantees.
- Formula imbalance: test asserts every allowed formula occurs 3–4 times.

### Task 1: Register and validate the dated content batch

**Files:**
- Create: `tests/daily-topics-2026-11-25.test.ts`
- Create: `app/daily-topics-2026-11-25.ts`
- Modify: `app/topics.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `dailyTopics20261125: Topic[]` of 30 records.
- Consumes: `Topic` and the topic library’s dated-module import pattern.

- [ ] **Step 1: Write the failing dated-batch test**

Assert the 11/25 module exists with 30 complete, protected-field-unique records, 10/10/10 categories, policy-safe copy, and 3–4 use formula distribution.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec tsx --test tests/daily-topics-2026-11-25.test.ts`
Expected: FAIL because the dated module is absent.

- [ ] **Step 3: Implement and register `dailyTopics20261125`**

Create 30 original records using IDs `D20261125-01` through `D20261125-30`, then import and spread the module in `app/topics.ts`; add the focused test to `posttest`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm exec tsx --test tests/daily-topics-2026-11-25.test.ts`
Expected: PASS.

### Task 2: Generate and verify the dated delivery files

**Files:**
- Create: `tests/daily-batch-export-2026-11-25.test.ts`
- Create: `scripts/export-daily-batch-2026-11-25.ts`
- Create: `scripts/create-daily-workbook-2026-11-25.ts`

**Interfaces:**
- Consumes: `dailyTopics20261125: Topic[]`.
- Produces: `C:\Users\USER\Desktop\短影音企劃網站\每日新增企劃\2026-11-25_30-topics.md` and `.xlsx`.

- [ ] **Step 1: Write the failing export test**

Assert both dated files exist and contain all 30 source records in the expected 24-column structure.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec tsx --test tests/daily-batch-export-2026-11-25.test.ts`
Expected: FAIL because dated delivery files are absent.

- [ ] **Step 3: Implement date-specific Markdown/XLSX generators and run them**

Render the existing labels, all fields, frozen/filterable 24-column worksheet, and `D20261125-01..30` rows directly from the module.

- [ ] **Step 4: Run the export test to verify it passes**

Run: `pnpm exec tsx --test tests/daily-batch-export-2026-11-25.test.ts`
Expected: PASS.

### Task 3: Run release verification and publish

**Files:**
- Modify: only files created/modified by Tasks 1–2, if verification exposes a defect.

- [ ] **Step 1: Run the required quality gates**

Run: `pnpm lint` and `pnpm test`.
Expected: exit 0; record any pre-existing warnings.

- [ ] **Step 2: Review changes and commit**

Run strict dedupe and `git diff --check`, then commit only the 11/25 source, tests, scripts, metadata, and generated Markdown/XLSX files.

- [ ] **Step 3: Push and deploy production**

Run: `git push origin main` and `pnpm dlx --allow-build=esbuild vercel@latest --prod --yes`; report any credential blocker exactly.
