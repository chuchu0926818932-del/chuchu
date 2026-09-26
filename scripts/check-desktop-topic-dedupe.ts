import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { dailyTopics20260926 } from "../app/daily-topics-2026-09-26";

type DedupeTopic = Pick<(typeof dailyTopics20260926)[number], "id" | "title" | "hook" | "scene" | "explain" | "singleCta">;
type DedupeField = Exclude<keyof DedupeTopic, "id">;
export type DesktopTopicCollision = { id: string; field: DedupeField; file: string };

const fields: DedupeField[] = ["title", "hook", "scene", "explain", "singleCta"];
const normalize = (value: string) => value.toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
type FieldValues = Record<DedupeField, string[]>;

function emptyFieldValues(): FieldValues {
  return Object.fromEntries(fields.map((field) => [field, []])) as FieldValues;
}

async function collectSourceFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(entryPath);
    return [entryPath];
  }));
  return files.flat().filter((file) => [".md", ".xlsx"].includes(path.extname(file).toLowerCase()));
}

function addMarkdownMatches(values: FieldValues, field: DedupeField, text: string, expression: RegExp) {
  for (const match of text.matchAll(expression)) values[field].push(match[1]);
}

function fieldForHeader(value: unknown): DedupeField | undefined {
  const header = normalize(String(value ?? ""));
  if (header === "標題" || header === "title") return "title";
  if (header === "hook") return "hook";
  if (header === "場景") return "scene";
  if (["核心觀點", "白話拆解", "拆解"].includes(header)) return "explain";
  if (["單一cta", "cta"].includes(header)) return "singleCta";
  return undefined;
}

async function readSourceFields(file: string): Promise<FieldValues> {
  const values = emptyFieldValues();
  if (path.extname(file).toLowerCase() === ".md") {
    const text = await readFile(file, "utf8");
    addMarkdownMatches(values, "title", text, /^#{1,6}\s+(?:\d+[.、]\s*)?(.+)$/gmu);
    addMarkdownMatches(values, "hook", text, /^-\s*Hook[：:]\s*(.+)$/gmu);
    addMarkdownMatches(values, "scene", text, /^-\s*場景[：:]\s*(.+)$/gmu);
    addMarkdownMatches(values, "explain", text, /^-\s*(?:白話拆解|拆解|核心觀點)[：:]\s*(.+)$/gmu);
    addMarkdownMatches(values, "singleCta", text, /^-\s*(?:單一\s*CTA|CTA)[：:]\s*(?:留言[「"]?)?(.+?)(?:[」"])?\s*$/gmu);
    return values;
  }

  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(file));
  for (const sheet of workbook.worksheets.items) {
    const rows = sheet.getUsedRange(true)?.values ?? [];
    rows.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
      const field = fieldForHeader(value);
      if (!field) return;
      for (const sourceRow of rows.slice(rowIndex + 1)) {
        const sourceValue = String(sourceRow[columnIndex] ?? "").trim();
        if (sourceValue) values[field].push(sourceValue);
      }
    }));
  }
  return values;
}

export async function findDesktopTopicCollisions(topics: DedupeTopic[], sourceRoot: string, excludedFiles: string[] = []): Promise<DesktopTopicCollision[]> {
  const sourceInfo = await stat(sourceRoot).catch(() => null);
  assert(sourceInfo?.isDirectory(), `Desktop topic source directory is unavailable: ${sourceRoot}`);
  const excluded = new Set(excludedFiles.map((file) => path.resolve(file).toLowerCase()));
  const files = (await collectSourceFiles(sourceRoot)).filter((file) => !excluded.has(path.resolve(file).toLowerCase()));
  const sourceFields = await Promise.all(files.map(async (file) => ({ file, values: await readSourceFields(file) })));

  return topics.flatMap((topic) => fields.flatMap((field) => sourceFields
    .filter(({ values }) => values[field].some((value) => normalize(value) === normalize(topic[field])))
    .map(({ file }) => ({ id: topic.id, field, file }))));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const desktopRoot = process.env.SNL_DESKTOP_TOPIC_ROOT ?? "C:\\Users\\USER\\Desktop";
  const dailyOutputDir = path.join(desktopRoot, "短影音企劃網站", "每日新增企劃");
  const excludedFiles = [
    path.join(dailyOutputDir, "2026-09-26_30-topics.md"),
    path.join(dailyOutputDir, "2026-09-26_30-topics.xlsx"),
  ];
  const sourceRoots = [path.join(desktopRoot, "短影音企劃網站"), path.join(desktopRoot, "短影音文案")];
  const collisions = (await Promise.all(sourceRoots.map((sourceRoot) => findDesktopTopicCollisions(dailyTopics20260926, sourceRoot, excludedFiles)))).flat();
  assert.equal(collisions.length, 0, `Desktop source duplicates found: ${JSON.stringify(collisions)}`);
  console.log(JSON.stringify({ sourceRoots, sourcesChecked: "Markdown and Excel", collisions: 0 }));
}
