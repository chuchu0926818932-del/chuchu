import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20261028 } from "../app/daily-topics-2026-10-28";
import { assertMarkdownMatchesTopics, assertWorksheetMatchesTopics, worksheetRow } from "../scripts/daily-batch-2026-10-28-validation";

test("2026-10-28 export validation rejects stale Markdown and a reordered workbook row", () => {
  const [first, second] = dailyTopics20261028;
  assert.throws(() => assertMarkdownMatchesTopics("# stale export", [first]));
  const rows = [["2026-10-28 短影音企劃 30 條"], [], [], worksheetRow(second)];
  assert.throws(() => assertWorksheetMatchesTopics(rows, [first]));
});
