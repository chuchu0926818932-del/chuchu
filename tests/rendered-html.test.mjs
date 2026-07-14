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
  assert.match(html, /靈感題庫/);
  assert.match(html, /主題生成器/);
  assert.match(html, /製作看板/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships all 80 imported topics and local workspace features", async () => {
  const [topicsSource, pageSource, packageJson] = await Promise.all([
    readFile(new URL("../app/topics.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.equal((topicsSource.match(/"id": "T\d{3}"/g) ?? []).length, 80);
  assert.match(pageSource, /localStorage/);
  assert.match(pageSource, /buildCodexPrompt/);
  assert.match(pageSource, /exportWorkspace/);
  assert.match(pageSource, /importWorkspace/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
