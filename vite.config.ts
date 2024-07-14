import fs from "node:fs";
import path from "node:path";
import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { type Plugin, defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        target: "esnext",
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
        },
      },
    };
  }

  return {
    ssr: {
      external: ["react", "react-dom"],
    },
    plugins: [
      wasmCloudflareModule(),
      pages(),
      devServer({ adapter, entry: "src/index.tsx" }),
    ],
  };
});

export function wasmCloudflareModule(): Plugin {
  const postfix = ".wasm?module";
  let isDev = false;

  return {
    name: "vite:wasm-helper",
    enforce: "pre",
    configResolved(config) {
      isDev = config.command === "serve";
    },
    config() {
      return { build: { rollupOptions: { external: /.+\.wasm$/i } } };
    },
    renderChunk(code, chunk) {
      if (isDev) return;
      if (!/__WASM_ASSET__([a-z\d]+)\.wasm/g.test(code)) return;

      const final = code.replaceAll(
        /__WASM_ASSET__([a-z\d]+)\.wasm/g,
        (_, assetId) => {
          const fileName = this.getFileName(assetId);
          const relativePath = path.relative(
            path.dirname(chunk.fileName),
            fileName,
          );
          return `./${relativePath}`;
        },
      );

      return { code: final };
    },
    load(id) {
      if (!id.endsWith(postfix)) {
        return;
      }

      const filePath = id.slice(0, -1 * "?module".length);

      if (isDev) {
        return `
        import fs from "fs"

        const wasmModule= new WebAssembly.Module(fs.readFileSync("${filePath}"));
        export default wasmModule;
        `;
      }

      const assetId = this.emitFile({
        type: "asset",
        name: path.basename(filePath),
        source: fs.readFileSync(filePath),
      });

      return `
      import init from "__WASM_ASSET__${assetId}.wasm"
      export default init
      `;
    },
  };
}
