# 2026-11-12 Daily Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a validated 30-topic 2026-11-12 daily batch with matching Markdown and XLSX files.

**Architecture:** Register one typed daily module, then reuse the established date-specific Markdown exporter, workbook builder, and source-parity verifier.

**Tech Stack:** TypeScript, Node test runner, artifact-tool, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-12-daily-topics-design.md`

## Global Constraints

- Exactly 10 records per requested category; every required content, story, and three-layer field is populated.
- Protected title, hook, scene, explain, and CTA values are unique across the library and existing Desktop Markdown/XLSX.
- All eight formulas occur 3–4 times; restricted category copy stays within the spec.

## Review Focus

- Registration must expose all 30 new records to the live topic library.
- Generated Markdown and XLSX must mirror every source field and source order exactly.
- Protected fields must not collide with historic Desktop artifacts; categories must not include prohibited advice, labels, or guarantees.

### Task 1: Batch module and registration

**Files:** Create `app/daily-topics-2026-11-12.ts`; modify `app/topics.ts`, `scripts/check-topic-library.ts`, and `scripts/check-desktop-topic-dedupe.ts`; test `tests/daily-topics-2026-11-12.test.ts`.

- [x] Write a failing test for a registered `D20261112-` batch with 30 records, category balance, complete fields, formula rotation, safe category constraints, and protected-field uniqueness.
- [x] Add and register the typed source records, then retarget library and Desktop dedupe checks to the new batch.
- [x] Run focused source and dedupe tests; confirm they pass.

### Task 2: Dated exports and delivery verification

**Files:** Create date-specific Markdown exporter, workbook builder, validation module, verifier, and export regression test; modify `package.json`.

- [x] Write a failing dated-artifact parity test.
- [x] Generate the dated Markdown/XLSX pair with frozen headers, filter, field parity, and formula-error scan.
- [x] Verify saved artifacts, run lint and the full suite, then commit, push `main`, and attempt production deployment.
