import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { dailyTopics20261002 } from "../app/daily-topics-2026-10-02";

const outputDir = "C:\\Users\\USER\\Desktop\\短影音企劃網站\\每日新增企劃";
const outputPath = path.join(outputDir, "2026-10-02_30-topics.md");
const markdown = [
  "# 2026-10-02 短影音企劃（30 條）", "",
  "Google Keep〈28天影片〉風格：日常痛點、承接限制、白話拆解、低門檻選擇、轉念收尾與單一關鍵字 CTA。", "",
  ...dailyTopics20261002.flatMap((topic, index) => [
    `## ${index + 1}. ${topic.title}`, "", `- 類別：${topic.category}`, `- 外層版型：${topic.formula}`,
    `- Hook：${topic.hook}`, `- 場景：${topic.scene}`, `- 共感：${topic.empathy}`, `- 白話拆解：${topic.explain}`,
    `- 低門檻行動：${topic.action}`, `- 轉念：${topic.reframe}`, `- CTA：留言「${topic.singleCta}」`, `- 內容類型：${topic.contentType}`,
    `- 風險提醒：${topic.risk}`, `- 檢核：${topic.check}`, `- 故事線：${topic.storyline}`, `- 故事元素：${topic.storyElements}`, `- 三層結構：${topic.threeLayer}`, "",
  ]),
].join("\n");
await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, markdown, "utf8");
console.log(outputPath);
