# 2026-10-27 Daily Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add, export, validate, and publish a safe 30-plan dated batch.

**Architecture:** A dated TypeScript module supplies complete topics; `app/topics.ts` exposes them; date-scoped scripts export and validate the Desktop deliverables.

**Spec:** `docs/superpowers/specs/2026-10-27-daily-topics-design.md`

## Task 1: Register the safe dated batch

**Files:** `tests/daily-topics-2026-10-27.test.ts`, `app/daily-topics-2026-10-27.ts`, `app/topics.ts`, `package.json`

- [ ] Write and run a failing focused test for 30 records, 10/10/10 category distribution, safe category language, eight formulas, and protected-field uniqueness.
- [ ] Add the dated topic module and registry entry, then run the focused test and library validator.

## Task 2: Create and inspect production artifacts

**Files:** date-scoped Markdown/XLSX exporter, workbook builder, verifier, and Desktop outputs

- [ ] Export all metadata to Markdown and a frozen, filtered 24-column XLSX sheet.
- [ ] Reimport the saved sheet; confirm dimensions, IDs, and formula-error scan.
- [ ] Run the strict full-Desktop Markdown/XLSX dedupe check.

## Task 3: Release

- [ ] Run `pnpm lint`, `pnpm test`, and `git diff --check`.
- [ ] Commit only the dated batch, push `origin main`, and deploy with Vercel production CLI.
