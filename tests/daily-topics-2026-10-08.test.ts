import assert from "node:assert/strict";
import test from "node:test";
import { topics } from "../app/topics";

test("2026-10-08 batch contains 30 complete and distinct daily topics", () => {
  const batch = topics.filter((topic) => topic.id.startsWith("D20261008-"));
  assert.equal(batch.length, 30);
  assert.deepEqual(
    Object.fromEntries(["女性成長", "金錢價值觀", "親子關係"].map((category) => [category, batch.filter((topic) => topic.category === category).length])),
    { 女性成長: 10, 金錢價值觀: 10, 親子關係: 10 },
  );
  for (const field of ["title", "hook", "scene", "explain", "singleCta"] as const) {
    assert.equal(new Set(batch.map((topic) => topic[field])).size, 30, `${field} must be unique`);
  }
  assert.equal(new Set(batch.map((topic) => topic.formula)).size, 8);
  assert.equal(batch.every((topic) => ["title", "hook", "scene", "empathy", "explain", "action", "reframe", "singleCta", "risk", "check", "storyline", "storyElements", "threeLayer"].every((field) => topic[field as keyof typeof topic])), true);
  const moneyText = batch
    .filter((topic) => topic.category === "金錢價值觀")
    .flatMap((topic) => [topic.title, topic.hook, topic.scene, topic.empathy, topic.explain, topic.action, topic.reframe])
    .join(" ");
  assert.equal(/投資|借貸|金融商品|貸款|分期|信用/u.test(moneyText), false, "money topics must not provide financial-product or lending guidance");
});
