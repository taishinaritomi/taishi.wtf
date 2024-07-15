import fs from "node:fs";
import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { type Plugin, defineConfig } from "vite";
import wasmModuleWorkers from "vite-plugin-wasm-module-workers";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        target: "esnext",
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            entryFileNames: "client.js",
          },
        },
      },
    };
  }

  return {
    plugins: [
      wasmModuleWorkers(),
      pages({ entry: "src/index.tsx" }),
      devServer({ adapter, entry: "src/index.tsx" }),
      {
        name: "wtf:config",
        config(config) {
          if (!config.build) config.build = {};

          config.build.ssrEmitAssets = true;

          return config;
        },
      } satisfies Plugin,
      {
        name: "hex-loader",
        transform(_, id) {
          const [path, query] = id.split("?");
          if (!path || query !== "raw-hex") return null;

          const data = fs.readFileSync(path);
          const hex = data.toString("hex");

          return `export default '${hex}';`;
        },
      } satisfies Plugin,
    ],
  };
});
