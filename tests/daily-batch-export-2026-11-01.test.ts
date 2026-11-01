import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20261101 } from "../app/daily-topics-2026-11-01";
import { assertMarkdownMatchesTopics, assertWorksheetMatchesTopics, worksheetRow } from "../scripts/daily-batch-2026-11-01-validation";

test("2026-11-01 export validation rejects stale Markdown and a reordered workbook row", () => {
  const [first, second] = dailyTopics20261101;
  assert.throws(() => assertMarkdownMatchesTopics("# stale export", [first]));
  assert.throws(() => assertWorksheetMatchesTopics([["2026-11-01 短影音企劃 30 條"], [], [], worksheetRow(second)], [first]));
});
