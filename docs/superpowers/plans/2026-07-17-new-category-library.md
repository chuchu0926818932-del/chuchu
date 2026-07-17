# New Category Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the women’s growth, money values, and parenting topic libraries with natural SNL-style scripts and clear category controls while preserving the original 80-topic unlock rule.

**Architecture:** Keep the versioned shared topic library in `app/topics.ts`, `app/daily-topics.ts`, and `app/foundational-topics.ts`; retain Supabase for user-owned workspace state only. Export the original 80-topic collection explicitly so `app/page.tsx` can calculate the unlock state independently from daily and foundational additions. The library UI filters source groups before rendering its existing category filters.

**Tech Stack:** React, TypeScript, Vinext/Next compatibility build, Supabase workspace sync, Node test runner, ESLint.

## Global Constraints

- Preserve the original 80-topic collection as the only continuation unlock denominator.
- Keep new categories immediately searchable and shootable without adding them to the 80-topic denominator.
- Use natural Traditional Chinese: concrete scene, emotional recognition, plain-language explanation, low-friction action, reframe, and one CTA.
- Keep finance and parenting content within the existing safety checks.
- Do not create a second Supabase table for the shared versioned library.

---

### Task 1: Lock the category-library contract in tests

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `app/topics.ts`, `app/foundational-topics.ts`, `app/page.tsx`, and `app/globals.css` as the build inputs.
- Produces: Regression coverage for 80-topic unlock copy, foundational content copy, source-range controls, and category badge classes.

- [ ] **Step 1: Write the failing test**

Add the foundational source file to the existing `Promise.all` read and append these assertions:

```js
assert.match(topicsSource, /export const firstBatchTopics/);
assert.match(foundationalSource, /const narratives: Record<string, Narrative>/);
assert.doesNotMatch(foundationalSource, /empathyFrames|explainFrames|reframeFrames/);
assert.match(foundationalSource, /女性成長/);
assert.match(foundationalSource, /金錢價值觀/);
assert.match(foundationalSource, /親子關係/);
assert.match(pageSource, /題庫範圍/);
assert.match(pageSource, /firstBatchTopics/);
assert.match(pageSource, /新分類/);
assert.match(cssSource, /category-badge\.peach/);
assert.match(cssSource, /category-badge\.gold/);
assert.match(cssSource, /category-badge\.indigo/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm run build && node --test tests/rendered-html.test.mjs`

Expected: the new assertions fail because `firstBatchTopics`, the range control, and new badge classes do not yet exist.

- [ ] **Step 3: Leave the failing test in place**

Do not weaken the assertions. The next tasks must make this contract true.

### Task 2: Make the original 80-topic batch explicit

**Files:**
- Modify: `app/topics.ts`
- Test: `scripts/check-topic-library.ts`

**Interfaces:**
- Consumes: existing local `legacyTopics`, imported `dailyTopics`, and imported `foundationalTopics`.
- Produces: `firstBatchTopics: Topic[]` for UI progress calculations; `topics: Topic[]` remains the full 170-topic shared library.

- [ ] **Step 1: Implement the export**

Replace the final topic declarations with:

```ts
export const firstBatchTopics: Topic[] = legacyTopics;
export const topics: Topic[] = [...firstBatchTopics, ...dailyTopics, ...foundationalTopics];
```

- [ ] **Step 2: Run the library checker**

Run: `pnpm exec tsx scripts/check-topic-library.ts`

Expected: `legacyTopics:80`, `dailyTopics:10`, `foundationalTopics:80`, `totalTopics:170`, and `deduped:true`.

### Task 3: Add natural foundational narration

**Files:**
- Modify: `app/foundational-topics.ts`
- Test: `scripts/check-topic-library.ts`

**Interfaces:**
- Consumes: each seed’s `key`, scene, action, category safety notes, and the `Narrative` type.
- Produces: one `Narrative` entry per seed key, used for `empathy`, `explain`, `reframe`, `angle`, and internal story metadata.

- [ ] **Step 1: Replace generic narrative frames**

Define `const narratives: Record<string, Narrative>` with all 80 keys. Each entry contains complete topic-specific `empathy`, `explain`, and `reframe` strings; no entry may interpolate the title as a template placeholder.

- [ ] **Step 2: Bind each seed to its narrative**

Use this guard inside the foundational topic map:

```ts
const narrative = narratives[seed.key];
if (!narrative) throw new Error(`Missing narrative for ${seed.key}`);
```

Spread `narrative` into the topic and use `narrative.explain` for `angle`.

- [ ] **Step 3: Run the focused checker**

Run: `pnpm exec tsx scripts/check-topic-library.ts`

Expected: all 170 entries validate, all three foundational category counts match, and duplicate checks remain true.

### Task 4: Add source grouping, category styling, and resilient copy feedback

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `firstBatchTopics`, `topics`, current filter state, and `navigator.clipboard`.
- Produces: a `libraryScope` UI filter, 80-topic progress calculations, visible new-category labels, three category colors, and clipboard fallback feedback.

- [ ] **Step 1: Add scope state and matcher**

Add a `LibraryScope` union with `"全部題庫"`, `"原始首批 80 條"`, `"每日新增"`, `"女性・金錢・親子"`, and `"去重續題"`. Store it in `libraryScope`; filter by `T`, `D`, `F`, and custom IDs before applying category and risk filters.

- [ ] **Step 2: Use `firstBatchTopics` for all unlock calculations**

Import `firstBatchTopics` and replace the current `topics.filter(...)` completion count with `firstBatchTopics.filter(...)`. Keep `allTopics` for card totals and de-duplication.

- [ ] **Step 3: Add the visible range control and new-category badge**

Add a select labelled `題庫範圍` to the existing filter panel. On foundational topic cards, render `<span className="library-badge">新分類</span>` beside the category badge. Update the progress sentence to state that the three added categories are searchable but do not change the 80-topic unlock rule.

- [ ] **Step 4: Style all three categories**

Add `peach`, `gold`, and `indigo` entries to `categoryColors` and matching CSS classes for `女性成長`, `金錢價值觀`, and `親子關係`. Extend the desktop filter grid by one column; leave the existing single-column mobile collapse untouched.

- [ ] **Step 5: Make manual copy failure-safe**

Replace `async function copyText` with a non-blocking clipboard promise that flashes the success text on resolve and a clear manual-copy message on rejection. This mirrors the safe completion flow.

- [ ] **Step 6: Run regression test and full checks**

Run: `pnpm run lint && pnpm test`

Expected: lint exits 0; build succeeds; library checker prints the 80/10/80/170 counts; all Node tests pass.

### Task 5: Publish and validate the synchronized website

**Files:**
- Modify: deployment output only

**Interfaces:**
- Consumes: validated production source and existing Vercel project configuration.
- Produces: live site containing 170 shared topics, grouped filters, natural foundational content, and preserved 80-topic unlock logic.

- [ ] **Step 1: Deploy the validated source to the established production site**

Run the project’s existing Vercel production deployment command after successful checks.

- [ ] **Step 2: Verify the published response**

Confirm the production URL responds successfully, then inspect the live first screen to confirm that the new range control lists `女性・金錢・親子` and the progress denominator remains 80.

- [ ] **Step 3: Commit and push the exact deployed source when Git is available**

Use a focused commit message: `feat: organize growth money and parenting libraries`.
