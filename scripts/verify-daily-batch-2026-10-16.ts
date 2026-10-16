import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";
const markdownPath = `${outputDir}\\2026-10-16_30-topics.md`;
const workbookPath = `${outputDir}\\2026-10-16_30-topics.xlsx`;
const markdown = await readFile(markdownPath, "utf8");
assert.equal((markdown.match(/^## \d+\. /gmu) ?? []).length, 30, "Markdown must contain 30 plans.");

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
assert.equal(workbook.worksheets.items.length, 1, "Workbook must have one worksheet.");
const sheet = workbook.worksheets.items[0];
const used = sheet.getUsedRange(true);
assert.deepEqual(used?.values?.[0]?.slice(0, 1), ["2026-10-16 短影音企劃 30 條"]);
assert.equal(used?.values?.length, 33, "Workbook must contain title, subtitle, header, and 30 plans.");
assert.equal(used?.values?.[3]?.[0], "D20261016-01");
assert.equal(used?.values?.[32]?.[0], "D20261016-30");
console.log(JSON.stringify({ markdownPlans: 30, worksheet: sheet.name, usedRange: "A1:X33", firstId: used?.values?.[3]?.[0], lastId: used?.values?.[32]?.[0] }));
