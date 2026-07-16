import { topics } from "../app/topics";

function normalize(value: string) {
  return value.toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const legacyTopics = topics.filter((topic) => !topic.id.startsWith("D20260716-") && !topic.id.startsWith("F20260716-"));
const dailyTopics = topics.filter((topic) => topic.id.startsWith("D20260716-"));
const foundationalTopics = topics.filter((topic) => topic.id.startsWith("F20260716-"));

assert(legacyTopics.length === 80, `Expected 80 retired topics, received ${legacyTopics.length}.`);
assert(dailyTopics.length === 10, `Expected 10 daily topics, received ${dailyTopics.length}.`);
assert(foundationalTopics.length === 80, `Expected 80 foundational topics, received ${foundationalTopics.length}.`);
assert(topics.length === 170, `Expected 170 topics total, received ${topics.length}.`);

for (const field of ["title", "hook", "scene"] as const) {
  const values = topics.map((topic) => normalize(topic[field]));
  assert(new Set(values).size === values.length, `Duplicate ${field} detected.`);
}

const categoryCounts = new Map<string, number>();
for (const topic of dailyTopics) {
  categoryCounts.set(topic.category, (categoryCounts.get(topic.category) ?? 0) + 1);
  for (const field of ["title", "hook", "scene", "empathy", "explain", "action", "reframe", "cta", "singleCta", "category", "formula", "contentType", "risk", "check", "storyline", "storyElements", "threeLayer"] as const) {
    assert(topic[field].trim().length > 0, `${topic.id} is missing ${field}.`);
  }
  assert(topic.cta === topic.singleCta, `${topic.id} must have one CTA value.`);
  assert(!/(目標|阻礙|努力|結果|意外|轉彎|結局)/u.test(topic.hook + topic.empathy + topic.explain + topic.action + topic.reframe), `${topic.id} exposes an internal story label.`);
}

const expectedCategories = ["減肥瘦身知識", "身心靈相關", "愛美相關", "健康相關", "飲食知識相關"];
for (const category of expectedCategories) {
  assert(categoryCounts.get(category) === 2, `${category} must have exactly 2 daily topics.`);
}

const dailyCtas = dailyTopics.map((topic) => normalize(topic.singleCta));
assert(new Set(dailyCtas).size === dailyCtas.length, "Daily CTA keywords must be unique.");

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

console.log(JSON.stringify({ legacyTopics: legacyTopics.length, dailyTopics: dailyTopics.length, foundationalTopics: foundationalTopics.length, totalTopics: topics.length, deduped: true }));
