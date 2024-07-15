// @ts-expect-error - required for vite to work
import interLatin400Row from "@fontsource/inter/files/inter-latin-400-normal.woff?raw-hex";

import { Resvg, initWasm as initResvgWasm } from "@resvg/resvg-wasm";
import resvgWasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";
import satori, { type Font, init as initSatoriWasm } from "satori/wasm";
import initYoga from "yoga-wasm-web";
import yogaWasmUrl from "yoga-wasm-web/dist/yoga.wasm?url";

async function initSatori() {
  try {
    const { default: yogaWasm } = await import(
      /* @vite-ignore */ `${yogaWasmUrl}?module`
    );

    initSatoriWasm(await initYoga(yogaWasm));

    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
}

async function initResvg() {
  try {
    await import(/* @vite-ignore */ `${resvgWasmUrl}?module`);

    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
}

const waitSatori = initSatori();
const waitResvg = initResvg();

export function getSatori() {
  return waitSatori.then((bool) => {
    if (!bool) throw new Error("Failed to initialize Satori");

    return satori;
  });
}

export function getResvg() {
  return waitResvg.then((bool) => {
    if (!bool) throw new Error("Failed to initialize Resvg");

    return Resvg;
  });
}

const interLatin400 = new Uint8Array(
  interLatin400Row.match(/../g).map((h: string) => Number.parseInt(h, 16)),
).buffer;

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
