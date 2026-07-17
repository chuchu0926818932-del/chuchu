import { firstBatchTopics, newTopicCategories, sharedTopicIds, topics } from "../app/topics";

function normalize(value: string) {
  return value.toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const legacyTopics = firstBatchTopics;
const priorDailyTopics = topics.filter((topic) => topic.id.startsWith("D20260716-"));
const dailyTopics = topics.filter((topic) => topic.id.startsWith("D20260717-"));
const foundationalTopics = topics.filter((topic) => topic.id.startsWith("F20260716-"));

assert(legacyTopics.length === 80, `Expected 80 first-batch topics, received ${legacyTopics.length}.`);
assert(priorDailyTopics.length === 10, `Expected the prior 10-topic daily batch, received ${priorDailyTopics.length}.`);
assert(dailyTopics.length === 30, `Expected 30 new daily topics, received ${dailyTopics.length}.`);
assert(foundationalTopics.length === 80, `Expected 80 foundational topics, received ${foundationalTopics.length}.`);
assert(topics.length === 200, `Expected 200 topics total, received ${topics.length}.`);
assert(sharedTopicIds.size === topics.length, "Shared topic IDs must be unique.");
assert(!topics.some((topic) => topic.series.includes("女性職涯")), "Legacy category wording must not remain in topic metadata.");

for (const field of ["title", "hook", "scene"] as const) {
  const values = topics.map((topic) => normalize(topic[field]));
  assert(new Set(values).size === values.length, `Duplicate ${field} detected.`);
}

const categoryCounts = new Map<string, number>();
const formulaCounts = new Map<string, number>();
for (const topic of dailyTopics) {
  categoryCounts.set(topic.category, (categoryCounts.get(topic.category) ?? 0) + 1);
  formulaCounts.set(topic.formula, (formulaCounts.get(topic.formula) ?? 0) + 1);
  for (const field of ["title", "hook", "scene", "empathy", "explain", "action", "reframe", "cta", "singleCta", "category", "formula", "contentType", "risk", "check", "storyline", "storyElements", "threeLayer"] as const) {
    assert(topic[field].trim().length > 0, `${topic.id} is missing ${field}.`);
  }
  assert(topic.cta === topic.singleCta, `${topic.id} must have one CTA value.`);
  assert(!/(目標：|阻礙：|努力：|結果：|意外：|轉彎：|結局：)/u.test(topic.hook + topic.empathy + topic.explain + topic.action + topic.reframe), `${topic.id} exposes an internal story label.`);
}

const expectedCategories = ["女性成長", "金錢價值觀", "親子關係"];
for (const category of expectedCategories) {
  assert(categoryCounts.get(category) === 10, `${category} must have exactly 10 daily topics.`);
}

assert(formulaCounts.size === 8, "New daily batch must rotate all eight formulas.");
for (const count of formulaCounts.values()) {
  assert(count === 3 || count === 4, "Each formula must appear three or four times in the 30-topic batch.");
}

const dailyCtas = dailyTopics.map((topic) => normalize(topic.singleCta));
assert(new Set(dailyCtas).size === dailyCtas.length, "Daily CTA keywords must be unique.");
const dailyExplains = dailyTopics.map((topic) => normalize(topic.explain));
assert(new Set(dailyExplains).size === dailyExplains.length, "Daily core viewpoints must be unique.");

const foundationalCategoryCounts = new Map<string, number>();
for (const topic of foundationalTopics) {
  foundationalCategoryCounts.set(topic.category, (foundationalCategoryCounts.get(topic.category) ?? 0) + 1);
  assert(topic.cta === topic.singleCta, `${topic.id} must have one CTA value.`);
}
assert(foundationalCategoryCounts.get("女性成長") === 27, "女性成長 must have 27 foundational topics.");
assert(foundationalCategoryCounts.get("金錢價值觀") === 27, "金錢價值觀 must have 27 foundational topics.");
assert(foundationalCategoryCounts.get("親子關係") === 26, "親子關係 must have 26 foundational topics.");
for (const formula of ["具體數字＋立即好處", "前後對比", "反常識迷思", "懶人低門檻", "真實不專業", "情緒故事", "案例＋解釋", "留言關鍵字 CTA"]) {
  assert(foundationalTopics.filter((topic) => topic.formula === formula).length === 10, `${formula} must have 10 foundational topics.`);
}
const foundationalCtas = foundationalTopics.map((topic) => normalize(topic.singleCta));
assert(new Set(foundationalCtas).size === foundationalCtas.length, "Foundational CTA keywords must be unique.");

const categorizedTopicCounts = new Map<string, number>();
for (const topic of [...dailyTopics, ...foundationalTopics]) {
  categorizedTopicCounts.set(topic.category, (categorizedTopicCounts.get(topic.category) ?? 0) + 1);
  assert(!/(遇到「|如果你一直卡在|你會在「|不是只有你覺得)/u.test(`${topic.empathy}${topic.explain}${topic.reframe}`), `${topic.id} still uses a generic empathy template.`);
}
assert(categorizedTopicCounts.get("女性成長") === 37, "女性成長 must have 37 categorized topics.");
assert(categorizedTopicCounts.get("金錢價值觀") === 37, "金錢價值觀 must have 37 categorized topics.");
assert(categorizedTopicCounts.get("親子關係") === 36, "親子關係 must have 36 categorized topics.");
assert(newTopicCategories.every((category) => categorizedTopicCounts.has(category)), "Every new category must be represented in the topic bank.");

console.log(JSON.stringify({ firstBatchTopics: legacyTopics.length, dailyTopics: dailyTopics.length, foundationalTopics: foundationalTopics.length, totalTopics: topics.length, deduped: true }));
