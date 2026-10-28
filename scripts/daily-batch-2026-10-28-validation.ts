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
    const section = sections[index];
    assert.equal(section.startsWith(`${index + 1}. ${topic.title}\n`), true, `Markdown title ${index + 1} must match the source topic.`);
    for (const expected of [topic.category, topic.formula, topic.hook, topic.scene, topic.empathy, topic.explain, topic.action, topic.reframe, topic.singleCta, topic.contentType, topic.risk, topic.check, topic.storyline, topic.storyElements, topic.threeLayer]) {
      assert.equal(section.includes(expected), true, `Markdown topic ${topic.id} must include its complete source content.`);
    }
  });
}

export function assertWorksheetMatchesTopics(rows: unknown[][], topics: ExportTopic[]) {
  assert.equal(rows.length, topics.length + 3, "Workbook must contain title, subtitle, header, and every source topic.");
  assert.deepEqual(rows.slice(3), topics.map(worksheetRow), "Workbook rows must exactly match source topics in order.");
}
