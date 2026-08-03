import { readFile } from "node:fs/promises";

type ViralSignal = {
  id: string;
  category: string;
  targetCategories: string[];
  formatSignal: string;
  safeAdaptation: string;
  riskGuard: string;
  dedupeKey: string;
  source: { publisher: string; title: string; url: string };
};

const sourcePath = new URL("../data/viral-content-signals-2026-07-18.json", import.meta.url);
const records = JSON.parse(await readFile(sourcePath, "utf8")) as ViralSignal[];
const allowedCategories = new Set(["平台信號", "女性成長", "金錢價值觀", "親子關係"]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(records.length >= 12, "Research database must contain at least 12 source-backed records.");
assert(new Set(records.map((record) => record.source.url)).size === records.length, "Duplicate source URL detected.");
assert(new Set(records.map((record) => record.dedupeKey)).size === records.length, "Duplicate adaptation angle detected.");

for (const record of records) {
  assert(allowedCategories.has(record.category), `${record.id} has an invalid category.`);
  assert(record.targetCategories.length > 0, `${record.id} is missing target categories.`);
  assert(record.formatSignal.trim() && record.safeAdaptation.trim() && record.riskGuard.trim(), `${record.id} is missing a classified signal.`);
  assert(record.source.publisher.trim() && record.source.title.trim(), `${record.id} is missing source attribution.`);
  assert(/^https:\/\//.test(record.source.url), `${record.id} has an invalid source URL.`);
}

for (const category of ["女性成長", "金錢價值觀", "親子關係"]) {
  assert(records.some((record) => record.targetCategories.includes(category)), `${category} has no research coverage.`);
}

console.log(JSON.stringify({ records: records.length, deduped: true, classified: true }));
