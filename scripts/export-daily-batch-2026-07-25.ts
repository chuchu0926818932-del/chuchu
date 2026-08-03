import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dailyTopics20260725 } from "../app/daily-topics-2026-07-25";

const date = "2026-07-25";
const outputDir = "C:/Users/USER/Desktop/短影音文案/源源不絕主題庫/每日新增";
const outputPath = join(outputDir, `${date}_30條.md`);

function topicMarkdown(topic: (typeof dailyTopics20260725)[number], index: number) {
  return `## ${index + 1}. ${topic.title}\n\n- 分類：${topic.category}\n- 外層版型：${topic.formula}\n- 內容型態：${topic.contentType}\n- Hook：${topic.hook}\n- 場景：${topic.scene}\n- 共感：${topic.empathy}\n- 白話拆解：${topic.explain}\n- 低門檻選擇：${topic.action}\n- 轉念：${topic.reframe}\n- 單一 CTA：${topic.singleCta}\n- 風險：${topic.risk}\n- 檢核：${topic.check}\n- 故事線：${topic.storyline}\n- 故事元素：${topic.storyElements}\n- 三層設計：${topic.threeLayer}`;
}

const markdown = `# ${date}｜每日短影音企劃 30 條\n\n女性成長、金錢價值觀、親子關係各 10 條。所有題目僅對照退役 80 條、既有每日批次與基礎 80 條進行嚴格去重，未改寫、拼貼或延伸既有題目。\n\n${dailyTopics20260725.map(topicMarkdown).join("\n\n---\n\n")}\n`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, markdown, "utf8");
console.log(JSON.stringify({ outputPath, count: dailyTopics20260725.length }));
