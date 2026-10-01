import assert from "node:assert/strict";
import test from "node:test";
import { dailyTopics20261001 } from "../app/daily-topics-2026-10-01";

test("2026-10-01 batch has 30 uniquely framed, readable daily topics", () => {
  assert.equal(dailyTopics20261001.length, 30);
  assert.equal(new Set(dailyTopics20261001.map((topic) => topic.title)).size, 30);
  assert.equal(new Set(dailyTopics20261001.map((topic) => topic.singleCta)).size, 30);
  assert.equal(dailyTopics20261001.some((topic) => /[。！？]，/u.test(topic.visual)), false);
});
