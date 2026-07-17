import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dailyTopics20260717 } from "../app/daily-topics-2026-07-17";

const date = "2026-07-17";
const outputDir = "C:/Users/USER/Desktop/短影音文案/源源不絕主題庫/每日新增";
const outputPath = join(outputDir, `${date}_30條.md`);

function topicMarkdown(topic: (typeof dailyTopics20260717)[number], index: number) {
  return `## ${index + 1}. ${topic.title}

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
}

const markdown = `# ${date}｜每日短影音企劃 30 條

女性成長、金錢價值觀、親子關係各 10 條。所有題目已對照原始首批 80 條、2026-07-16 每日 10 條與基礎 80 條，僅作去重，不改寫既有題目。

${dailyTopics20260717.map(topicMarkdown).join("\n\n---\n\n")}
`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, markdown, "utf8");
console.log(JSON.stringify({ outputPath, count: dailyTopics20260717.length }));
