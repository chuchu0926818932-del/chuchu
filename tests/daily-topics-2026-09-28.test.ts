import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20260928 } from "../app/daily-topics-2026-09-28";

test("2026-09-28 batch has 30 uniquely framed, readable daily topics", () => {
  assert.equal(dailyTopics20260928.length, 30);
  assert.equal(new Set(dailyTopics20260928.map((topic) => topic.title)).size, 30);
  assert.equal(new Set(dailyTopics20260928.map((topic) => topic.singleCta)).size, 30);
  assert.equal(dailyTopics20260928.some((topic) => /[。！？]，/u.test(topic.visual)), false);
});
