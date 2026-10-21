import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { sites } from "../build/sites-vite-plugin";

test("sites packaging tolerates concurrent closeBundle hooks", async () => {
  const plugin = sites();
  assert.equal(typeof plugin.configResolved, "function");
  assert.equal(typeof plugin.closeBundle, "function");
  await plugin.configResolved?.({ root: process.cwd() } as never);
  await rm(resolve(process.cwd(), "dist", ".openai"), { recursive: true, force: true });
  await assert.doesNotReject(async () => Promise.all([
    plugin.closeBundle?.call(plugin),
    plugin.closeBundle?.call(plugin),
  ]));
});
