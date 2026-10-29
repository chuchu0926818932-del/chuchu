# 2026-10-29 Daily Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a validated 30-topic 2026-10-29 daily short-video batch and its Markdown/XLSX deliverables.

**Architecture:** Add one typed daily module and register it with the library. Reuse the established date-specific export, workbook, and verification pattern so generated desktop assets exactly mirror the source records.

**Tech Stack:** TypeScript, Node test runner, XLSX tooling, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-29-daily-topics-design.md`

## Global Constraints

- Exactly 10 records each for 女性成長、金錢價值觀、親子關係.
- 女性成長限職涯／事業；金錢不給投資、借貸或商品建議；親子不標籤或承諾改變。
- Five protected content fields must be globally unique, including Desktop Markdown/XLSX sources.
- Use all eight formulas 3–4 times and export complete required fields.

## Review Focus

- Date registration: records must be included in the rendered application library.
- Export parity: Markdown/XLSX must preserve all 24 source values in source order.
- Safety copy: restricted categories must not introduce prohibited advice or labels.
- Dedupe: protected-field collisions must be rejected across all checked sources.
- Formula distribution: exactly eight formula variants, each used 3–4 times.

### Task 1: Batch module and registration

**Files:**
- Create: `app/daily-topics-2026-10-29.ts`
- Modify: `app/topics.ts`
- Test: `tests/daily-topics-2026-10-29.test.ts`

- [ ] Write the failing date-batch test for 30 safe, distinct records.
- [ ] Run it and verify the zero-record failure.
- [ ] Add the typed 30-record batch and register it.
- [ ] Run the focused test and verify it passes.

### Task 2: Exports and verification

**Files:**
- Create: `scripts/export-daily-batch-2026-10-29.ts`, `scripts/create-daily-workbook-2026-10-29.ts`, `scripts/verify-daily-batch-2026-10-29.ts`
- Test: `tests/daily-batch-export-2026-10-29.test.ts`

- [ ] Write the failing export test for the date-named source batch.
- [ ] Run it and verify the missing-export failure.
- [ ] Implement date-specific exporters and verifier using existing helpers.
- [ ] Generate both deliverables, run the focused export test, then lint and full test suite.
