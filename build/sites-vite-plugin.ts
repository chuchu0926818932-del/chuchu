import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

// Vite creates one plugin instance per environment. Packaging writes to the
// shared dist/.openai directory, so its queue must outlive each instance.
let packaging = Promise.resolve();

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

// Packages Sites metadata and migrations after Vite finishes compiling.
export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");

      packaging = packaging.catch(() => undefined).then(async () => {
        await rm(outputDirectory, { recursive: true, force: true });
        await mkdir(outputDirectory, { recursive: true });

        if (await exists(hostingConfig)) {
          await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
        }
        if (await exists(drizzleSource)) {
          await cp(drizzleSource, resolve(outputDirectory, "drizzle"), {
            recursive: true,
          });
        }
      });
      return packaging;
    },
  };
}
