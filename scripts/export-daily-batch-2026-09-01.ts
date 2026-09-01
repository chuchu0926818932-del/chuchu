import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { dailyTopics20260901 } from "../app/daily-topics-2026-09-01";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";
const outputPath = path.join(outputDir, "2026-09-01_30-topics.md");

const markdown = [
  "# 2026-09-01 短影音企劃 30 條",
  "",
  ...dailyTopics20260901.flatMap((topic, index) => [
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
