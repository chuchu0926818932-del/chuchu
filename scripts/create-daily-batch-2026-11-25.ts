import { mkdir, writeFile } from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import { dailyTopics20261125 } from "../app/daily-topics-2026-11-25";
import { worksheetRow } from "./daily-batch-2026-11-08-validation";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";
const outputPath = `${outputDir}\\2026-11-25_30-topics.xlsx`;
const markdownPath = `${outputDir}\\2026-11-25_30-topics.md`;
const sheetName = "每日新增_2026-11-25";
const headers = ["ID", "外層版型", "版型序", "版型次數", "類別", "標題", "Hook", "核心觀點", "結構", "視覺", "CTA", "單一 CTA", "風險", "檢核", "系列", "內容類型", "故事線", "故事元素", "三層", "場景", "共感", "白話拆解", "低門檻行動", "轉念"];
const markdown = [
  "# 2026-11-25 短影音企劃 30 條", "", "女性成長（職涯／事業）10 條・金錢價值觀 10 條・親子關係 10 條｜Google Keep 28 天影片聲音對齊", "",
  ...dailyTopics20261125.flatMap((topic, index) => [
    `## ${index + 1}. ${topic.title}`, "", `- 類別：${topic.category}`, `- 外層版型：${topic.formula}`, `- Hook：${topic.hook}`, `- 場景：${topic.scene}`, `- 共感：${topic.empathy}`, `- 白話拆解：${topic.explain}`, `- 低門檻行動：${topic.action}`, `- 轉念：${topic.reframe}`, `- CTA：留言「${topic.singleCta}」`, `- 內容類型：${topic.contentType}`, `- 風險提醒：${topic.risk}`, `- 檢核：${topic.check}`, `- 故事線：${topic.storyline}`, `- 故事元素：${topic.storyElements}`, `- 三層結構：${topic.threeLayer}`, "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(markdownPath, markdown, "utf8");
const workbook = Workbook.create();
const sheet = workbook.worksheets.add(sheetName);
sheet.showGridLines = false;
sheet.getRange("A1:X1").merge();
sheet.getRange("A1").values = [["2026-11-25 短影音企劃 30 條"]];
sheet.getRange("A2").values = [["女性成長（職涯／事業）10 條・金錢價值觀 10 條・親子關係 10 條｜Google Keep 28 天影片聲音對齊"]];
sheet.getRange("A3:X3").values = [headers];
sheet.getRange("A4:X33").values = dailyTopics20261125.map(worksheetRow);
sheet.getRange("A1:X33").format.font = { name: "Arial", size: 10, color: "#1F2937" };
sheet.getRange("A1").format = { font: { name: "Arial", size: 14, bold: true, color: "#111827" }, verticalAlignment: "center" };
sheet.getRange("A2").format = { font: { name: "Arial", size: 10, italic: true, color: "#4B5563" }, verticalAlignment: "center" };
sheet.getRange("A3:X3").format = { fill: "#1F4E78", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#FFFFFF" } };
sheet.getRange("A4:X33").format = { verticalAlignment: "top", wrapText: true };
sheet.getRange("A3:X33").format.borders = { preset: "outside", style: "thin", color: "#D1D5DB" };
sheet.getRange("A3:X33").format.rowHeight = 170;
sheet.getRange("A1").format.rowHeight = 28; sheet.getRange("A2").format.rowHeight = 21; sheet.getRange("A3").format.rowHeight = 34;
[14, 16, 9, 10, 13, 28, 36, 38, 28, 30, 13, 13, 9, 28, 24, 16, 42, 38, 38, 34, 38, 38, 42, 38].forEach((width, index) => sheet.getRangeByIndexes(0, index, 33, 1).format.columnWidth = width);
sheet.getRange("C4:D33").format.horizontalAlignment = "center"; sheet.getRange("K4:N33").format.horizontalAlignment = "center";
const table = sheet.tables.add("A3:X33", true, "DailyTopics20261125"); table.style = "TableStyleMedium2"; table.showBandedColumns = false; table.showFilterButton = true;
sheet.freezePanes.freezeRows(3); sheet.freezePanes.freezeColumns(1);
workbook.recalculate();
const inspect = await workbook.inspect({ kind: "table", range: `${sheetName}!A1:X8`, include: "values,formulas", tableMaxRows: 8, tableMaxCols: 24 });
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 50 }, summary: "formula error scan" });
const preview = await workbook.render({ sheetName, range: "A1:X8", scale: 1.2, format: "png" });
const previewDir = "C:\\Users\\USER\\Documents\\自動化\\.codex_tmp";
const previewPath = `${previewDir}\\automation10-2026-11-25-preview.png`;
await mkdir(previewDir, { recursive: true });
await writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook); await output.save(outputPath);
console.log(JSON.stringify({ outputPath, markdownPath, previewPath, inspect: inspect.ndjson, errors: errors.ndjson }));
