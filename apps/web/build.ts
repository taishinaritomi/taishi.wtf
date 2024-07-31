import type { RollupOutput } from "rollup";
import { build } from "vite";

const result = (await build({ mode: "client" })) as RollupOutput;

const first = result.output[0];

const define = {
  "import.meta.env.CLIENT_ENTRY": JSON.stringify(`/${first.fileName}`),
};

await build({ define });
