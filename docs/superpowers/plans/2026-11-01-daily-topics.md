# 2026-11-01 Daily Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a validated 30-topic 2026-11-01 daily batch with matching Markdown and XLSX files.

**Architecture:** Register one typed daily module and reuse the established date-specific export, workbook, and verification pattern.

**Tech Stack:** TypeScript, Node test runner, artifact-tool, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-01-daily-topics-design.md`

## Global Constraints

- Exactly 10 records per requested category and complete required fields.
- Five protected fields are unique globally and across existing Desktop Markdown/XLSX.
- All eight formulas are used 3–4 times; restricted category copy stays within the specification.

## Review Focus

- Library registration includes all 30 records.
- Markdown/XLSX mirrors every source value and order.
- Protected fields have no collisions; restricted content has no prohibited advice or labels.

### Task 1: Batch module and registration

**Files:** Create `app/daily-topics-2026-11-01.ts`; modify `app/topics.ts`; test `tests/daily-topics-2026-11-01.test.ts`.

- [ ] Write and run a failing batch test.
- [ ] Add and register the 30 typed records.
- [ ] Run the focused batch test.

### Task 2: Exports and verification

**Files:** Create date-specific export, workbook, verification, and export test files.

- [ ] Generate and verify the Markdown/XLSX pair.
- [ ] Run lint, full test suite, production deploy, and scoped Git delivery.
