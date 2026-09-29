import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20260929 } from "../app/daily-topics-2026-09-29";

test("2026-09-29 batch has 30 uniquely framed, readable daily topics", () => {
  assert.equal(dailyTopics20260929.length, 30);
  assert.equal(new Set(dailyTopics20260929.map((topic) => topic.title)).size, 30);
  assert.equal(new Set(dailyTopics20260929.map((topic) => topic.singleCta)).size, 30);
  assert.equal(dailyTopics20260929.some((topic) => /[。！？]，/u.test(topic.visual)), false);
});
