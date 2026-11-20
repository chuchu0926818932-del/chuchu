# 2026-11-20 Daily Short-Video Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Register and publish 30 wholly new 2026-11-20 short-video plans, with ten plans in each required category.

**Architecture:** A dated topic module supplies the 30 complete `Topic` records and is appended to the shared library. One dated generator writes the Markdown and filtered/frozen XLSX artifacts; existing validators enforce source, library, and Desktop-wide uniqueness.

**Tech Stack:** TypeScript, Node test runner, `@oai/artifact-tool`, pnpm, Git, Vercel CLI.

**Spec:** Scheduler automation record for Automation ID 10.

## Global Constraints

- Treat all existing topic sources, retired records, and Desktop Markdown/XLSX as deduplication data only.
- Provide exactly 10 女性成長（職涯／事業限定）, 10 non-advisory 金錢價值觀, and 10 non-labeling 親子關係 topics.
- Keep title, hook, scene, core viewpoint, and single CTA unique across the library and Desktop sources.
- Rotate all eight outer formulas three or four times; use one CTA keyword per item.
- Export dated Markdown and XLSX without altering retired versions; lint, test, commit, push `main`, then attempt production deployment.

## Review Focus

- The newest module must be registered in `topics`, not merely exist on disk.
- Every item must contain each public text field and map `cta` to `singleCta`.
- The export must exactly reproduce the module data in both formats.
- Desktop-wide Markdown/XLSX scanning must exclude only today’s just-created exports.
- Women’s topics must remain workplace/career/business focused; money and parenting copy must avoid prohibited claims.

### Task 1: Prove and register the dated batch

**Files:**
- Create: `tests/daily-topics-2026-11-20.test.ts`
- Create: `app/daily-topics-2026-11-20.ts`
- Modify: `app/topics.ts`
- Modify: `scripts/check-topic-library.ts`

- [ ] Write the failing dated-batch test for 30 records, 10/10/10 categories, complete fields, protected-field uniqueness, safe category wording, and an expected 2,240-record library.
- [ ] Run the test and confirm it fails because the dated module is missing.
- [ ] Add the original dated records and register them in the shared topic library.
- [ ] Update the newest-batch library guard to 2026-11-20 and 2,240 records.
- [ ] Run the dated test and library guard to confirm they pass.

### Task 2: Publish and prove exact exports

**Files:**
- Create: `scripts/create-daily-batch-2026-11-20.ts`
- Create: `tests/daily-batch-export-2026-11-20.test.ts`
- Modify: `scripts/check-desktop-topic-dedupe.ts`
- Modify: `tests/desktop-topic-dedupe.test.ts`
- Modify: `package.json`
- Create: `C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃\\2026-11-20_30-topics.md`
- Create: `C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃\\2026-11-20_30-topics.xlsx`

- [ ] Write the failing dated-export test before creating the two artifacts.
- [ ] Run it and confirm it fails because the dated artifacts are absent.
- [ ] Add the export generator, run it, and update the newest-batch Desktop dedupe command/test and posttest selection.
- [ ] Run export parity and Desktop dedupe tests to confirm each saved artifact exactly matches the source and has no collisions.

### Task 3: Verify and deliver

**Files:**
- Modify: `C:\\Users\\USER\\.codex\\automations\\10\\memory.md`

- [ ] Run `pnpm lint`, `pnpm test`, Desktop dedupe, and Git whitespace checks.
- [ ] Review staged diff, commit only automation-related changes, push `origin main`, and attempt Vercel production deployment.
- [ ] Record the results and current timestamp in automation memory.
