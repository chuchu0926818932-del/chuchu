import { mkdir, writeFile } from "node:fs/promises";
import { dailyTopics20260826 } from "../app/daily-topics-2026-08-26";

const date = "2026-08-26";
const outputDir = "C:/Users/USER/Desktop/短影音企劃網站/每日新增企劃";
const outputPath = `${outputDir}/${date}_30-topics.md`;

const grouped = ["女性成長", "金錢價值觀", "親子關係"].map((category) => {
  const records = dailyTopics20260826.filter((topic) => topic.category === category);
  return `## ${category}${category === "女性成長" ? "：職涯／事業發展" : ""}\n\n${records.map((topic) => `### ${topic.id}｜${topic.title}\n\nCTA：${topic.singleCta}`).join("\n\n")}`;
}).join("\n\n");

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `# ${date} 短影音企劃（30 條）\n\n${grouped}\n`, "utf8");
console.log(JSON.stringify({ outputPath, count: dailyTopics20260826.length }));
