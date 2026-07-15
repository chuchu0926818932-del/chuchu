import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the SNL planning workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SNL 短影音企劃工作台<\/title>/i);
  assert.match(html, /短影音企劃工作台/);
  assert.match(html, /待選題庫/);
  assert.match(html, /去重續題/);
  assert.match(html, /完成紀錄/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships 80 topics, direct scripts, completion filtering and deduplicated continuation", async () => {
  const [topicsSource, pageSource, scriptSource, cssSource, supabaseSource, migrationSource, packageJson] = await Promise.all([
    readFile(new URL("../app/topics.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/script-engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/supabase.ts", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/202607140001_create_snl_workspaces.sql", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.equal((topicsSource.match(/"id": "T\d{3}"/g) ?? []).length, 80);
  assert.match(pageSource, /localStorage/);
  assert.match(pageSource, /buildScriptSegments/);
  assert.match(pageSource, /completeActivePlan/);
  assert.match(pageSource, /generatorUnlocked/);
  assert.match(pageSource, /customTopics/);
  assert.match(pageSource, /拍攝完成並歸檔/);
  assert.match(scriptSource, /generateUniqueTopics/);
  assert.match(scriptSource, /usedTitles/);
  assert.match(scriptSource, /usedHooks/);
  assert.match(scriptSource, /口播：/);
  assert.match(pageSource, /exportWorkspace/);
  assert.match(pageSource, /importWorkspace/);
  assert.match(pageSource, /TOPIC_PAGE_SIZE/);
  assert.match(pageSource, /removeActivePlan/);
  assert.match(pageSource, /setPublishDateAfter/);
  assert.match(pageSource, /document\.body\.appendChild\(anchor\)/);
  assert.match(pageSource, /<textarea value=\{activePlan\.notes\}/);
  assert.match(pageSource, /已有本機版資料/);
  assert.match(cssSource, /@media \(max-width: 720px\)[\s\S]*\.topbar \{[^}]*flex-direction: column/);
  assert.match(cssSource, /@media \(max-width: 720px\)[\s\S]*\.view-tabs \{[^}]*grid-template-columns: repeat\(4/);
  assert.match(cssSource, /@media \(max-width: 720px\)[\s\S]*\.script-segment \{[^}]*grid-template-columns: 1fr/);
  assert.match(cssSource, /\.topbar-actions \.button[^}]*min-height: 44px/);
  assert.match(pageSource, /signInWithOtp/);
  assert.match(pageSource, /snl_workspaces/);
  assert.match(supabaseSource, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(migrationSource, /enable row level security/i);
  assert.match(migrationSource, /auth\.uid\(\)/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
