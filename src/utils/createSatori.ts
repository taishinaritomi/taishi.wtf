import satori, { init as initSatori } from "satori/wasm";
import initYoga from "yoga-wasm-web";

import YOGA_WASM from "yoga-wasm-web/dist/yoga.wasm?url";

async function init() {
  const { default: yogawasm } = await import(
    /* @vite-ignore */ `${YOGA_WASM}?module`
  );

  const yoga = await initYoga(yogawasm);
  return initSatori(yoga);
}

const wait = init();

export function createSatori() {
  return wait.then(() => satori);
}
