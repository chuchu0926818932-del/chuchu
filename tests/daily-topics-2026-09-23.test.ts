import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20260923 } from "../app/daily-topics-2026-09-23";

test("daily topic visuals join the scene and shooting direction without doubled punctuation", () => {
  assert.equal(
    dailyTopics20260923.some((topic) => /[。！？]，/u.test(topic.visual)),
    false,
  );
});
