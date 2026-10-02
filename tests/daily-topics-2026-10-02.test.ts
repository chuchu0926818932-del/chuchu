import assert from "node:assert/strict";
import test from "node:test";
import { topics } from "../app/topics";

test("2026-10-02 batch contains the required 30 distinct daily topics", () => {
  const batch = topics.filter((topic) => topic.id.startsWith("D20261002-"));
  assert.equal(batch.length, 30);
  assert.deepEqual(
    Object.fromEntries(["女性成長", "金錢價值觀", "親子關係"].map((category) => [category, batch.filter((topic) => topic.category === category).length])),
    { 女性成長: 10, 金錢價值觀: 10, 親子關係: 10 },
  );
  assert.equal(new Set(batch.map((topic) => topic.title)).size, 30);
  assert.equal(new Set(batch.map((topic) => topic.hook)).size, 30);
  assert.equal(new Set(batch.map((topic) => topic.scene)).size, 30);
  assert.equal(new Set(batch.map((topic) => topic.explain)).size, 30);
  assert.equal(new Set(batch.map((topic) => topic.singleCta)).size, 30);
  assert.equal(new Set(batch.map((topic) => topic.formula)).size, 8);
  assert.equal(batch.every((topic) => ["title", "hook", "scene", "empathy", "explain", "action", "reframe", "singleCta", "risk", "check", "storyline", "storyElements", "threeLayer"].every((field) => topic[field as keyof typeof topic])), true);
});
