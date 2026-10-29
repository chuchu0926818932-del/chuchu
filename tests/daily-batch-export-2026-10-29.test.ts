import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20261029 } from "../app/daily-topics-2026-10-29";
import { assertMarkdownMatchesTopics, assertWorksheetMatchesTopics, worksheetRow } from "../scripts/daily-batch-2026-10-29-validation";

test("2026-10-29 export validation rejects stale Markdown and a reordered workbook row", () => {
  const [first, second] = dailyTopics20261029;
  assert.throws(() => assertMarkdownMatchesTopics("# stale export", [first]));
  const rows = [["2026-10-29 短影音企劃 30 條"], [], [], worksheetRow(second)];
  assert.throws(() => assertWorksheetMatchesTopics(rows, [first]));
});
