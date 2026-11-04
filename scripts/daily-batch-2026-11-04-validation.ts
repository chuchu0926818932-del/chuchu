import assert from "node:assert/strict";
import type { Topic } from "../app/topics";

type ExportTopic = Pick<Topic, "id" | "formula" | "formulaOrder" | "formulaIndex" | "category" | "title" | "hook" | "angle" | "structure" | "visual" | "cta" | "singleCta" | "risk" | "check" | "series" | "contentType" | "storyline" | "storyElements" | "threeLayer" | "scene" | "empathy" | "explain" | "action" | "reframe">;

export function worksheetRow(topic: ExportTopic): unknown[] {
  return [topic.id, topic.formula, topic.formulaOrder, topic.formulaIndex, topic.category, topic.title, topic.hook, topic.angle, topic.structure, topic.visual, topic.cta, topic.singleCta, topic.risk, topic.check, topic.series, topic.contentType, topic.storyline, topic.storyElements, topic.threeLayer, topic.scene, topic.empathy, topic.explain, topic.action, topic.reframe];
}

export function assertMarkdownMatchesTopics(markdown: string, topics: ExportTopic[]) {
  const sections = markdown.split(/^## /gmu).slice(1);
  assert.equal(sections.length, topics.length, "Markdown must have one ordered section for every topic.");
  topics.forEach((topic, index) => {
    const expected = [
      `${index + 1}. ${topic.title}`, "", `- 類別：${topic.category}`, `- 外層版型：${topic.formula}`, `- Hook：${topic.hook}`, `- 場景：${topic.scene}`, `- 共感：${topic.empathy}`, `- 白話拆解：${topic.explain}`, `- 低門檻行動：${topic.action}`, `- 轉念：${topic.reframe}`, `- CTA：留言「${topic.singleCta}」`, `- 內容類型：${topic.contentType}`, `- 風險提醒：${topic.risk}`, `- 檢核：${topic.check}`, `- 故事線：${topic.storyline}`, `- 故事元素：${topic.storyElements}`, `- 三層結構：${topic.threeLayer}`,
    ].join("\n");
    assert.equal(sections[index].trimEnd(), expected, `Markdown ${topic.id} must exactly match its source fields and labels.`);
  });
}

export function assertWorksheetMatchesTopics(rows: unknown[][], topics: ExportTopic[]) {
  assert.equal(rows.length, topics.length + 3, "Workbook must contain title, subtitle, header, and every source topic.");
  assert.deepEqual(rows.slice(3), topics.map(worksheetRow), "Workbook rows must exactly match source topics in order.");
}
