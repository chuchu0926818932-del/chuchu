import { mkdir, writeFile } from "node:fs/promises";
import { dailyTopics20260828 } from "../app/daily-topics-2026-08-28";

const date = "2026-08-28";
const outputDir = "C:/Users/USER/Desktop/短影音企劃網站/每日新增企劃";
const outputPath = `${outputDir}/${date}_30-topics.md`;
const categories = ["女性成長", "金錢價值觀", "親子關係"] as const;

const content = categories.map((category) => {
  const records = dailyTopics20260828.filter((topic) => topic.category === category);
  return `## ${category}\n\n${records.map((topic) => `### ${topic.id}｜${topic.title}\n\n- Hook：${topic.hook}\n- Scene：${topic.scene}\n- Empathy：${topic.empathy}\n- Explain：${topic.explain}\n- Action：${topic.action}\n- Reframe：${topic.reframe}\n- CTA：${topic.singleCta}\n- Formula：${topic.formula}\n- Content type：${topic.contentType}\n- Risk：${topic.risk}\n- Check：${topic.check}`).join("\n\n")}`;
}).join("\n\n");

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `# ${date} 每日新增短影音企劃（30 條）\n\n${content}\n`, "utf8");
console.log(JSON.stringify({ outputPath, count: dailyTopics20260828.length }));
