import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { dailyTopics20261105 } from "../app/daily-topics-2026-11-05";
import { assertMarkdownMatchesTopics, assertWorksheetMatchesTopics } from "../scripts/daily-batch-2026-11-05-validation";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";

test("2026-11-05 publishes exact dated export artifacts", async () => {
  const markdown = await stat(`${outputDir}\\2026-11-05_30-topics.md`).catch(() => undefined);
  const workbook = await stat(`${outputDir}\\2026-11-05_30-topics.xlsx`).catch(() => undefined);

  assert.equal(markdown?.isFile(), true, "dated Markdown export must exist");
  assert.equal(workbook?.isFile(), true, "dated workbook export must exist");

  const markdownText = await readFile(`${outputDir}\\2026-11-05_30-topics.md`, "utf8");
  assertMarkdownMatchesTopics(markdownText, dailyTopics20261105);
  const driftedMarkdown = markdownText.replace(`- CTA：留言「${dailyTopics20261105[0].singleCta}」`, "- CTA：留言「錯誤關鍵字」");
  assert.throws(() => assertMarkdownMatchesTopics(driftedMarkdown, dailyTopics20261105), "CTA label drift must not be hidden by generated story text");

  const importedWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(`${outputDir}\\2026-11-05_30-topics.xlsx`));
  assertWorksheetMatchesTopics(importedWorkbook.worksheets.items[0].getUsedRange(true)?.values ?? [], dailyTopics20261105);
});
