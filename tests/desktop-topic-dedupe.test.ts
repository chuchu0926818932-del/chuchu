import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import { findDesktopTopicCollisions } from "../scripts/check-desktop-topic-dedupe";

test("findDesktopTopicCollisions reports an exact title duplicate in a Desktop Markdown source", async () => {
  const sourceRoot = await mkdtemp(path.join(tmpdir(), "desktop-topic-dedupe-"));
  try {
    await writeFile(path.join(sourceRoot, "prior-topics.md"), "## 1. 先寫下你要替決策補上的兩個資訊\n", "utf8");

    const collisions = await findDesktopTopicCollisions(
      [{ id: "test-01", title: "先寫下你要替決策補上的兩個資訊", hook: "不重複 hook", scene: "不重複場景", explain: "不重複觀點", singleCta: "不重複 CTA" }],
      sourceRoot,
    );

    assert.deepEqual(collisions, [{ id: "test-01", field: "title", file: path.join(sourceRoot, "prior-topics.md") }]);
  } finally {
    await rm(sourceRoot, { recursive: true, force: true });
  }
});

test("findDesktopTopicCollisions treats punctuation and whitespace variants as duplicates", async () => {
  const sourceRoot = await mkdtemp(path.join(tmpdir(), "desktop-topic-dedupe-"));
  try {
    await writeFile(path.join(sourceRoot, "prior-topics.md"), "## 1. 先寫下， 你要替決策補上的兩個資訊\n", "utf8");

    const collisions = await findDesktopTopicCollisions(
      [{ id: "test-01b", title: "先寫下你要替決策補上的兩個資訊", hook: "不重複 hook", scene: "不重複場景", explain: "不重複觀點", singleCta: "不重複 CTA" }],
      sourceRoot,
    );

    assert.deepEqual(collisions, [{ id: "test-01b", field: "title", file: path.join(sourceRoot, "prior-topics.md") }]);
  } finally {
    await rm(sourceRoot, { recursive: true, force: true });
  }
});

test("findDesktopTopicCollisions does not treat body prose as a CTA field", async () => {
  const sourceRoot = await mkdtemp(path.join(tmpdir(), "desktop-topic-dedupe-"));
  try {
    await writeFile(path.join(sourceRoot, "prior-topics.md"), "- 白話拆解：做選擇前先談取捨；說出理由會更容易理解。\n", "utf8");

    const collisions = await findDesktopTopicCollisions(
      [{ id: "test-01c", title: "不重複標題", hook: "不重複 hook", scene: "不重複場景", explain: "不重複觀點", singleCta: "取捨說" }],
      sourceRoot,
    );

    assert.deepEqual(collisions, []);
  } finally {
    await rm(sourceRoot, { recursive: true, force: true });
  }
});

test("findDesktopTopicCollisions reports an exact CTA duplicate in a Desktop Excel source", async () => {
  const sourceRoot = await mkdtemp(path.join(tmpdir(), "desktop-topic-dedupe-"));
  try {
    const workbook = Workbook.create();
    const sheet = workbook.worksheets.add("題庫");
    sheet.getRange("A1:A2").values = [["單一 CTA"], ["晨衣選"]];
    const output = await SpreadsheetFile.exportXlsx(workbook);
    await output.save(path.join(sourceRoot, "prior-topics.xlsx"));

    const collisions = await findDesktopTopicCollisions(
      [{ id: "test-02", title: "不重複標題", hook: "不重複 hook", scene: "不重複場景", explain: "不重複觀點", singleCta: "晨衣選" }],
      sourceRoot,
    );

    assert.deepEqual(collisions, [{ id: "test-02", field: "singleCta", file: path.join(sourceRoot, "prior-topics.xlsx") }]);
  } finally {
    await rm(sourceRoot, { recursive: true, force: true });
  }
});
