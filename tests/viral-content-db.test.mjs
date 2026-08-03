import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const databaseUrl = new URL("../data/viral-content-signals-2026-07-18.json", import.meta.url);

test("keeps viral-content research categorized, source-backed, and deduplicated", async () => {
  const records = JSON.parse(await readFile(databaseUrl, "utf8"));

  assert.ok(records.length >= 12);
  assert.equal(new Set(records.map((record) => record.source.url)).size, records.length);
  assert.equal(new Set(records.map((record) => record.dedupeKey)).size, records.length);

  for (const record of records) {
    assert.match(record.id, /^V20260718-\d{3}$/);
    assert.ok(["平台信號", "女性成長", "金錢價值觀", "親子關係"].includes(record.category));
    assert.ok(record.source.publisher.trim());
    assert.match(record.source.url, /^https:\/\//);
    assert.ok(record.formatSignal.trim());
    assert.ok(record.safeAdaptation.trim());
    assert.ok(record.riskGuard.trim());
  }

  for (const category of ["女性成長", "金錢價值觀", "親子關係"]) {
    assert.ok(records.some((record) => record.targetCategories.includes(category)), `${category} is missing from the research database.`);
  }
});
