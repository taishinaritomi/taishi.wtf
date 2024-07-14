import satori, { init as initSatori } from "satori/wasm";
import initYoga from "yoga-wasm-web";

import wasmUrl from "yoga-wasm-web/dist/yoga.wasm?url";

async function init() {
  const wasm = (await import(/* @vite-ignore */ `${wasmUrl}?module`)).default;
  const yoga = await initYoga(wasm);
  return initSatori(yoga);
}

const wait = init();

export function createSatori() {
  return wait.then(() => satori);
}
