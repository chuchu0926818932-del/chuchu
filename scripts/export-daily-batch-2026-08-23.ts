import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { dailyTopics20260823 } from "../app/daily-topics-2026-08-23";

const date = "2026-08-23";
const desktopDir = "C:/Users/USER/Desktop";
const desktopEntries = await readdir(desktopDir, { recursive: true });
const referenceMarkdown = desktopEntries.find((entry) => entry.includes("2026-08-22") && entry.endsWith(".md"));
if (!referenceMarkdown) throw new Error("Could not locate the existing 2026-08-22 Desktop Markdown export directory.");
const outputDir = dirname(join(desktopDir, referenceMarkdown));
const outputPath = `${outputDir}/${date}_30-topics.md`;

const topicMarkdown = (topic: (typeof dailyTopics20260823)[number], index: number) => `## ${index + 1}. ${topic.title}

- 類別：${topic.category}
- 外層版型：${topic.formula}
- 內容型態：${topic.contentType}
- Hook：${topic.hook}
- 場景：${topic.scene}
- 承接：${topic.empathy}
- 核心觀點：${topic.explain}
- 低門檻選擇：${topic.action}
- 轉念：${topic.reframe}
- 單一 CTA：${topic.singleCta}
- 風險：${topic.risk}
- 檢核：${topic.check}
- 故事線：${topic.storyline}
- 故事元素：${topic.storyElements}
- 三層結構：${topic.threeLayer}`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `# ${date} 短影音企劃 30 條\n\n女性成長（職涯／事業）、金錢價值觀、親子關係各 10 條。每條依 Keep 28 天影片語氣，採日常痛點開場、承接限制與情緒、白話拆解、低門檻選擇、轉念與單一關鍵字 CTA。\n\n${dailyTopics20260823.map(topicMarkdown).join("\n\n---\n\n")}\n`, "utf8");
console.log(JSON.stringify({ outputPath, count: dailyTopics20260823.length }));
