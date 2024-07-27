import type { RollupOutput } from "rollup";
import { build } from "vite";


const result = (await build({
  mode: "client",
})) as RollupOutput;

const first = result.output[0];

await build({
  define: {
    "import.meta.env.CLIENT_ENTRY": JSON.stringify(`/${first.fileName}`),
  },
});
