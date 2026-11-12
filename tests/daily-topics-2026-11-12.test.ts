import assert from "node:assert/strict";
import test from "node:test";
import { topics } from "../app/topics";

const normalize = (value: string) => value.toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");

test("2026-11-12 daily batch registers 30 complete, safe, and unique topics", () => {
  const dailyTopics = topics.filter((topic) => topic.id.startsWith("D20261112-"));
  assert.equal(dailyTopics.length, 30);
  assert.equal(topics.length, 2060);

  const categoryCounts = new Map<string, number>();
  const formulaCounts = new Map<string, number>();
  for (const topic of dailyTopics) {
    categoryCounts.set(topic.category, (categoryCounts.get(topic.category) ?? 0) + 1);
    formulaCounts.set(topic.formula, (formulaCounts.get(topic.formula) ?? 0) + 1);
    for (const field of ["id", "title", "hook", "angle", "structure", "visual", "series", "scene", "empathy", "explain", "action", "reframe", "cta", "singleCta", "category", "formula", "contentType", "risk", "check", "storyline", "storyElements", "threeLayer"] as const) {
      assert.ok(topic[field].trim().length > 0, `${topic.id} is missing ${field}`);
    }
    assert.equal(topic.cta, topic.singleCta);
    assert.match(topic.storyline + topic.storyElements + topic.threeLayer, /.+/u);
  }

  for (const category of ["女性成長", "金錢價值觀", "親子關係"]) assert.equal(categoryCounts.get(category), 10);
  assert.equal(formulaCounts.size, 8);
  for (const count of formulaCounts.values()) assert.ok(count === 3 || count === 4);

  for (const field of ["title", "hook", "scene", "explain", "singleCta"] as const) {
    const values = dailyTopics.map((topic) => normalize(topic[field]));
    assert.equal(new Set(values).size, values.length, `daily ${field} must be unique`);
    const priorValues = new Set(topics.filter((topic) => !topic.id.startsWith("D20261112-")).map((topic) => normalize(topic[field])));
    assert.ok(dailyTopics.every((topic) => !priorValues.has(normalize(topic[field]))), `${field} must not repeat the prior library`);
  }

  const women = dailyTopics.filter((topic) => topic.category === "女性成長").map((topic) => `${topic.title}${topic.hook}${topic.scene}${topic.explain}${topic.action}`);
  assert.ok(women.every((value) => /(職場|工作|職涯|專業|升遷|談薪|團隊|協作|領導|客戶|創業|提案|會議|轉職|接案|新人)/u.test(value)));
  assert.ok(women.every((value) => !/(感情|外貌|瘦|交往|戀愛)/u.test(value)));
  const money = dailyTopics.filter((topic) => topic.category === "金錢價值觀").map((topic) => `${topic.title}${topic.hook}${topic.explain}${topic.action}`);
  assert.ok(money.every((value) => !/(投資|股票|基金|借貸|信貸|金融商品|保證獲利)/u.test(value)));
  const parent = dailyTopics.filter((topic) => topic.category === "親子關係").map((topic) => `${topic.title}${topic.hook}${topic.empathy}${topic.explain}${topic.action}${topic.reframe}`);
  assert.ok(parent.every((value) => !/(問題孩子|難搞|不聽話|保證.*改變|一定會.*改)/u.test(value)));
});
