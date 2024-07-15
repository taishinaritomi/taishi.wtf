import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { type Plugin, defineConfig } from "vite";
import wasmModuleWorkers from "vite-plugin-wasm-module-workers";
import { cloudflarePagesPlugin } from "./vite";

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
      cloudflarePagesPlugin({ entry: "src/index.tsx" }),
      devServer({ adapter, entry: "src/index.tsx" }),
      {
        name: "wtf:config",
        config(config) {
          if (config.build) config.build.ssrEmitAssets = true;

          return config;
        },
      } satisfies Plugin,
    ],
  };
});
