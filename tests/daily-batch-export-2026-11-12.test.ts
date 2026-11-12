import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { dailyTopics20261112 } from "../app/daily-topics-2026-11-12";
import { assertMarkdownMatchesTopics, assertWorksheetMatchesTopics } from "../scripts/daily-batch-2026-11-08-validation";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";
const markdownPath = `${outputDir}\\2026-11-12_30-topics.md`;
const workbookPath = `${outputDir}\\2026-11-12_30-topics.xlsx`;

test("2026-11-12 publishes exact dated export artifacts", async () => {
  assert.equal((await stat(markdownPath).catch(() => undefined))?.isFile(), true, "dated Markdown export must exist");
  assert.equal((await stat(workbookPath).catch(() => undefined))?.isFile(), true, "dated workbook export must exist");
  const markdown = await readFile(markdownPath, "utf8");
  assert.equal((markdown.match(/^## \d+\. /gmu) ?? []).length, 30);
  assertMarkdownMatchesTopics(markdown, dailyTopics20261112);
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
  assertWorksheetMatchesTopics(workbook.worksheets.items[0].getUsedRange(true)?.values ?? [], dailyTopics20261112);
});
