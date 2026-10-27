import assert from "node:assert/strict";
import test from "node:test";
import { assertMarkdownMatchesTopics, assertWorksheetMatchesTopics, worksheetRow } from "../scripts/daily-batch-2026-10-27-validation";
import { dailyTopics20261027 } from "../app/daily-topics-2026-10-27";

test("2026-10-27 export validation rejects stale Markdown and a reordered workbook row", () => {
  const [first, second] = dailyTopics20261027;
  assert.throws(() => assertMarkdownMatchesTopics("# stale export", [first]));
  const rows = [["2026-10-27 短影音企劃 30 條"], [], [], worksheetRow(second)];
  assert.throws(() => assertWorksheetMatchesTopics(rows, [first]));
});
