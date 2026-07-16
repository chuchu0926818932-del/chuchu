import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dailyTopics } from "../app/daily-topics";

const date = "2026-07-16";
const outputDir = "C:/Users/USER/Desktop/短影音文案/源源不絕主題庫/每日新增";
const outputPath = join(outputDir, `${date}_10條.md`);

function topicMarkdown(topic: (typeof dailyTopics)[number], index: number) {
  return `## ${index + 1}. ${topic.title}

- 分類：${topic.category}
- 外層版型：${topic.formula}
- 內容類型：${topic.contentType}
- Hook：${topic.hook}
- 場景：${topic.scene}
- 共感：${topic.empathy}
- 白話拆解：${topic.explain}
- 立即行動：${topic.action}
- 轉念收尾：${topic.reframe}
- 單一 CTA：${topic.singleCta}
- 風險提醒：${topic.risk}
- 檢核：${topic.check}
- 故事線：${topic.storyline}
- 故事元素：${topic.storyElements}
- 三層檢查：${topic.threeLayer}`;
}

const markdown = `# ${date}｜每日新增 10 條短影音企劃

本批為全新題材；已與既有 80 條的標題、Hook、場景與 CTA 做去重。五大分類各 2 條，CTA 關鍵字均不重複。

${dailyTopics.map(topicMarkdown).join("\n\n---\n\n")}
`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, markdown, "utf8");
console.log(JSON.stringify({ outputPath, count: dailyTopics.length }));
