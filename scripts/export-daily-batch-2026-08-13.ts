import { mkdir, writeFile } from "node:fs/promises";
import { dailyTopics20260813 } from "../app/daily-topics-2026-08-13";

const date = "2026-08-13";
const outputDir = "C:/Users/USER/Desktop/短影音企劃網站/每日新增企劃";
const outputPath = `${outputDir}/${date}_30條.md`;
const dataPath = `C:/Users/USER/AppData/Local/Temp/daily-topics-${date}.json`;

const topicMarkdown = (topic: (typeof dailyTopics20260813)[number], index: number) => `## ${index + 1}. ${topic.title}

- 分類：${topic.category}
- 外層版型：${topic.formula}
- 內容型態：${topic.contentType}
- Hook：${topic.hook}
- 場景：${topic.scene}
- 共感：${topic.empathy}
- 白話拆解：${topic.explain}
- 低門檻選擇：${topic.action}
- 轉念：${topic.reframe}
- 單一 CTA：${topic.singleCta}
- 風險：${topic.risk}
- 檢核：${topic.check}
- 故事線：${topic.storyline}
- 故事元素：${topic.storyElements}
- 三層設計：${topic.threeLayer}`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `# ${date} 短影音企劃 30 條\n\n女性成長（職涯／事業）、金錢價值觀、親子關係各 10 條。既有退役、每日與基礎題庫只作嚴格去重參考，沒有改寫、拼貼或延伸。\n\n${dailyTopics20260813.map(topicMarkdown).join("\n\n---\n\n")}\n`, "utf8");
await writeFile(dataPath, JSON.stringify(dailyTopics20260813, null, 2), "utf8");
console.log(JSON.stringify({ outputPath, dataPath, count: dailyTopics20260813.length }));
