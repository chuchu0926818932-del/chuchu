import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";

test("2026-11-03 publishes both dated export artifacts", async () => {
  const markdown = await stat(`${outputDir}\\2026-11-03_30-topics.md`).catch(() => undefined);
  const workbook = await stat(`${outputDir}\\2026-11-03_30-topics.xlsx`).catch(() => undefined);

  assert.equal(markdown?.isFile(), true, "dated Markdown export must exist");
  assert.equal(workbook?.isFile(), true, "dated workbook export must exist");
});
