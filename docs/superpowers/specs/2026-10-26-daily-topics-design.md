# 2026-10-26 Daily Topics Design

## Intent

Add one independently registered 30-plan daily batch for SNL short-video production: ten work-and-business-only women's-growth plans, ten non-advisory money-values plans, and ten non-labeling parenting-relationship plans.

## Goals

- Use the established Keep-style sequence: everyday friction, acknowledged constraint or emotion, plain-language explanation, one to three low-barrier choices, reframe, and one keyword CTA.
- Keep every new title, hook, scene, core viewpoint, and CTA distinct from the complete app library and all Desktop Markdown/XLSX sources.
- Export matching date-named Markdown and XLSX deliverables without changing retired content.

## Non-goals

- No relationship, appearance, or generic self-growth framing in the women's-growth category.
- No investment, lending, financial-product, medical, treatment, or guaranteed-behavior guidance.

## Approach

The batch will follow the existing dated-module/exporter/verifier pattern. This is the only suitable approach because the library and Desktop de-duplication tools, app registry, and recipient-facing Excel format already consume that structure.

## Implementation choices

- Register `dailyTopics20261026` in `app/topics.ts`, using the existing eight-formula rotation and the existing metadata generator shape.
- Add a focused real-library test and extend the project test command with it.
- Build one Markdown export and one one-sheet XLSX export for the Desktop daily-output folder, preserving the established 24-column layout, filters, and frozen ID/header panes.
