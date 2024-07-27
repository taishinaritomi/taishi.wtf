import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode, command }) => {
  if (mode === "client") {
    return {
      build: {
        target: "esnext",
        rollupOptions: {
          input: "./src/client.tsx",
        },
      },
    };
  }

  return {
    define: {
      ...(command === "serve" && {
        "import.meta.env.CLIENT_ENTRY": JSON.stringify("/src/client.tsx"),
      }),
    },
    plugins: [
      pages({ entry: "src/index.tsx" }),
      devServer({ adapter, entry: "src/index.tsx" }),
    ],
  };
});
