import { mkdir, writeFile } from "node:fs/promises";
import { dailyTopics20260808 } from "../app/daily-topics-2026-08-08";

const date = "2026-08-08";
const outputDir = "C:/Users/USER/Desktop/短影音企劃網站/每日新增企劃";
const outputPath = `${outputDir}/${date}_30條.md`;
const dataPath = `C:/Users/USER/AppData/Local/Temp/daily-topics-${date}.json`;

const topicMarkdown = (topic: (typeof dailyTopics20260808)[number], index: number) => `## ${index + 1}. ${topic.title}

- 分類：${topic.category}
- Hook：${topic.hook}
- 場景：${topic.scene}
- 共感：${topic.empathy}
- 拆解：${topic.explain}
- 行動：${topic.action}
- 轉念：${topic.reframe}
- CTA：${topic.singleCta}
- 版型：${topic.formula}
- 類型：${topic.contentType}`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `# ${date} 短影音企劃（30 條）\n\n${dailyTopics20260808.map(topicMarkdown).join("\n\n---\n\n")}\n`, "utf8");
await writeFile(dataPath, JSON.stringify(dailyTopics20260808, null, 2), "utf8");
console.log(JSON.stringify({ outputPath, dataPath, count: dailyTopics20260808.length }));
