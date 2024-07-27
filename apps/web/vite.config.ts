import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

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
      pages({ entry: "src/index.tsx" }),
      devServer({ adapter, entry: "src/index.tsx" }),
    ],
  };
});