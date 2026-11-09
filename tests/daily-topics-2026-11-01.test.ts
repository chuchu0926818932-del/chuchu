import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { topics } from "../app/topics";

test("2026-11-01 batch supplies 30 safe and distinct production plans", () => {
  const batch = topics.filter((topic) => topic.id.startsWith("D20261101-"));
  assert.equal(batch.length, 30);
  assert.deepEqual(
    Object.fromEntries(["女性成長", "金錢價值觀", "親子關係"].map((category) => [category, batch.filter((topic) => topic.category === category).length])),
    { 女性成長: 10, 金錢價值觀: 10, 親子關係: 10 },
  );
  for (const field of ["title", "hook", "scene", "explain", "singleCta"] as const) assert.equal(new Set(batch.map((topic) => topic[field])).size, 30, `${field} must be unique`);
  for (const topic of batch) for (const field of ["title", "hook", "scene", "empathy", "explain", "action", "reframe", "singleCta", "category", "formula", "contentType", "risk", "check", "storyline", "storyElements", "threeLayer"] as const) assert.notEqual(topic[field].trim(), "", `${topic.id} ${field} is required`);
  assert.equal(new Set(batch.map((topic) => topic.formula)).size, 8);
  for (const topic of batch.filter((topic) => topic.category === "女性成長")) assert.match([topic.title, topic.hook, topic.explain].join(" "), /職場|工作|職涯|事業|專業|升遷|談薪|創業|協作|領導/);
  assert.equal(batch.filter((topic) => topic.category === "金錢價值觀").every((topic) => !/投資|借貸|金融商品|貸款|分期|信用卡/.test([topic.title, topic.hook, topic.explain, topic.action].join(" "))), true);
  assert.equal(batch.filter((topic) => topic.category === "親子關係").every((topic) => !/問題兒童|難搞|不聽話|保證.*改變|一定.*改變/.test([topic.title, topic.hook, topic.explain, topic.action, topic.reframe].join(" "))), true);
});

test("topic-library validation protects the newest batch explain and CTA uniqueness", async () => {
  const checker = await readFile(new URL("../scripts/check-topic-library.ts", import.meta.url), "utf8");
  assert.match(checker, /D20261109-/);
  assert.match(checker, /topics\.length === 1970/);
});
