import fs from "node:fs/promises";
import path from "node:path";

const sourceRoot = "C:/Users/USER/Desktop/短影音文案/源源不絕主題庫";
const outputFile = "C:/Users/USER/Documents/自動化/短影音企劃網站/app/topics.ts";

const folders = (await fs.readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}_/.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));

const topics = [];

function field(block, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return block.match(new RegExp(`^- ${escaped}：(.+)$`, "m"))?.[1]?.trim() ?? "";
}

for (const folder of folders) {
  const markdownPath = path.join(sourceRoot, folder.name, "10條主題.md");
  const markdown = await fs.readFile(markdownPath, "utf8");
  const formula = markdown.match(/^# (.+?)｜10 條短影音主題/m)?.[1]?.trim();
  const series = markdown.match(/^系列建議：(.+)$/m)?.[1]?.trim() ?? "";
  if (!formula) throw new Error(`Cannot find formula in ${markdownPath}`);

  const matches = [...markdown.matchAll(/^## (\d+)\. (.+)$/gm)];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index ?? 0;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const block = markdown.slice(start, end);
    const riskText = field(block, "風險");
    const [risk = "低", ...checkParts] = riskText.split("｜");
    topics.push({
      id: `T${String(topics.length + 1).padStart(3, "0")}`,
      formula,
      formulaOrder: Number(folder.name.slice(0, 2)),
      formulaIndex: Number(matches[i][1]),
      category: field(block, "類別"),
      title: matches[i][2].trim(),
      hook: field(block, "前 3 秒"),
      angle: field(block, "核心觀點"),
      structure: field(block, "45–60 秒結構"),
      visual: field(block, "畫面"),
      cta: field(block, "CTA"),
      risk: risk.trim(),
      check: checkParts.join("｜").trim(),
      series,
    });
  }
}

if (topics.length !== 80) throw new Error(`Expected 80 topics, got ${topics.length}`);
if (new Set(topics.map((topic) => topic.title)).size !== topics.length) throw new Error("Duplicate titles found");

const source = `export type Topic = {\n  id: string;\n  formula: string;\n  formulaOrder: number;\n  formulaIndex: number;\n  category: string;\n  title: string;\n  hook: string;\n  angle: string;\n  structure: string;\n  visual: string;\n  cta: string;\n  risk: string;\n  check: string;\n  series: string;\n};\n\nexport const topics: Topic[] = ${JSON.stringify(topics, null, 2)};\n\nexport const formulas = [...new Set(topics.map((topic) => topic.formula))];\nexport const categories = [...new Set(topics.map((topic) => topic.category))];\n`;

await fs.writeFile(outputFile, source, "utf8");
console.log(JSON.stringify({ outputFile, count: topics.length, formulas: new Set(topics.map((topic) => topic.formula)).size }, null, 2));
