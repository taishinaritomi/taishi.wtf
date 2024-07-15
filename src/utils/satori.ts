// @ts-expect-error - required for vite to work
import interLatin400Row from "@fontsource/inter/files/inter-latin-400-normal.woff?raw-hex";

import satori, { type Font, init as initSatori } from "satori/wasm";
import initYoga from "yoga-wasm-web";
import yogaWasmUrl from "yoga-wasm-web/dist/yoga.wasm?url";

async function init() {
  try {
    const { default: yogaWasm } = await import(
      /* @vite-ignore */ `${yogaWasmUrl}?module`
    );

    initSatori(await initYoga(yogaWasm));

    return true;
  } catch {
    return false;
  }
}

const wait = init();

export function getSatori() {
  return wait.then((bool) => {
    if (!bool) throw new Error("Failed to initialize Satori");

    return satori;
  });
}

const interLatin400 = Buffer.from(interLatin400Row, "hex");

export function getSatoriFonts(): Font[] {
  return [
    {
      name: "Inter",
      data: interLatin400,
      weight: 400,
      style: "normal",
    },
  ];
}
