import { formulas, topics } from "../app/topics";

function normalize(value: string) {
  return value.toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(topics.length === 80, `Expected 80 topics, received ${topics.length}.`);
assert(formulas.length === 8, `Expected 8 formulas, received ${formulas.length}.`);

for (const formula of formulas) {
  const count = topics.filter((topic) => topic.formula === formula).length;
  assert(count === 10, `${formula} must contain 10 topics, received ${count}.`);
}

for (const field of ["title", "hook", "scene"] as const) {
  const values = topics.map((topic) => normalize(topic[field]));
  assert(new Set(values).size === values.length, `Duplicate ${field} detected.`);
}

for (const topic of topics) {
  assert(topic.empathy.length >= 18, `${topic.id} needs a specific empathy line.`);
  assert(topic.explain.length >= 18, `${topic.id} needs a plain-language explanation.`);
  assert(topic.action.length >= 14, `${topic.id} needs an actionable next step.`);
  assert(topic.reframe.length >= 14, `${topic.id} needs a reframe.`);
  assert(!/故事目標：|故事裡真正的阻礙是：|故事的意外是：/.test(topic.hook), `${topic.id} exposes an internal formula label.`);
}

console.log(JSON.stringify({ topics: topics.length, formulas: formulas.length, deduped: true }));
