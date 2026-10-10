import assert from "node:assert/strict";
import test from "node:test";
import { topics } from "../app/topics";

test("2026-10-10 batch contains 30 distinct Keep-style daily topics", () => {
  const batch = topics.filter((topic) => topic.id.startsWith("D20261010-"));
  assert.equal(batch.length, 30);
  assert.deepEqual(
    Object.fromEntries(["女性成長", "金錢價值觀", "親子關係"].map((category) => [category, batch.filter((topic) => topic.category === category).length])),
    { 女性成長: 10, 金錢價值觀: 10, 親子關係: 10 },
  );
  for (const field of ["title", "hook", "scene", "explain", "singleCta"] as const) {
    assert.equal(new Set(batch.map((topic) => topic[field])).size, 30, `${field} must be unique within the batch`);
  }
  assert.equal(new Set(batch.map((topic) => topic.formula)).size, 8);
  assert.equal(batch.every((topic) => ["empathy", "action", "reframe", "risk", "check", "storyline", "storyElements", "threeLayer"].every((field) => Boolean(topic[field as keyof typeof topic]))), true);
});
