import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { dailyTopics20260829 } from "../app/daily-topics-2026-08-29";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音文案\\源源不絕主題庫\\每日新增";
const outputPath = path.join(outputDir, "2026-08-29_30條.md");

const markdown = [
  "# 2026-08-29 短影音企劃 30 條",
  "",
  ...dailyTopics20260829.flatMap((topic, index) => [
    `## ${index + 1}. ${topic.title}`,
    "",
    `- 類別：${topic.category}`,
    `- 外層版型：${topic.formula}`,
    `- Hook：${topic.hook}`,
    `- 場景：${topic.scene}`,
    `- 共感：${topic.empathy}`,
    `- 白話拆解：${topic.explain}`,
    `- 低門檻行動：${topic.action}`,
    `- 轉念：${topic.reframe}`,
    `- CTA：留言「${topic.singleCta}」`,
    `- 風險提醒：${topic.risk}`,
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, markdown, "utf8");
console.log(outputPath);
