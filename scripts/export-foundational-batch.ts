import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { foundationalTopics } from "../app/foundational-topics";

const date = "2026-07-16";
const outputDir = "C:/Users/USER/Desktop/短影音文案/源源不絕主題庫/基礎80";
const markdownPath = join(outputDir, `${date}_女性成長_金錢價值觀_親子關係_80條.md`);
const jsonPath = join(outputDir, `${date}_女性成長_金錢價值觀_親子關係_80條.json`);

const markdown = `# ${date}｜女性成長・金錢價值觀・親子關係｜基礎 80 條

分類：女性成長 27 條、金錢價值觀 27 條、親子關係 26 條。每種外層版型 10 條，CTA 關鍵字均不重複。

${foundationalTopics.map((topic, index) => `## ${index + 1}. ${topic.title}

- 分類：${topic.category}
- 外層版型：${topic.formula}
- Hook：${topic.hook}
- 場景：${topic.scene}
- 共感：${topic.empathy}
- 白話拆解：${topic.explain}
- 立即行動：${topic.action}
- 轉念收尾：${topic.reframe}
- 單一 CTA：${topic.singleCta}
- 風險提醒：${topic.risk}
- 檢核：${topic.check}`).join("\n\n---\n\n")}
`;

await mkdir(outputDir, { recursive: true });
await writeFile(markdownPath, markdown, "utf8");
await writeFile(jsonPath, JSON.stringify(foundationalTopics, null, 2), "utf8");
console.log(JSON.stringify({ markdownPath, jsonPath, count: foundationalTopics.length }));
