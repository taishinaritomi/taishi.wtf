import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";
import { DEV_SCRIPT_FILE, SCRIPT_FILE } from "./src/files.ts";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: SCRIPT_FILE,
          output: {
            entryFileNames: DEV_SCRIPT_FILE,
          },
        },
      },
    };
  }

  return {
    ssr: {
      external: ["react", "react-dom"],
    },
    plugins: [pages(), devServer({ adapter, entry: "src/index.tsx" })],
  };
});
