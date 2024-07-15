import { Hono } from "hono";
import { cache } from "hono/cache";
// @ts-expect-error react-dom/server.edge
import { renderToReadableStream } from "react-dom/server.edge";
import type { RouteObject } from "react-router-dom";
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from "react-router-dom/server";
import { indexHandler } from "./components/Routes";
import { checkHandler } from "./components/Routes/check";
import { prettyJSON } from "./middlewares/pretty-json";
import { routes } from "./routes";
import "./utils/satori";
import { getResvg, getSatori, getSatoriFonts } from "./utils/satori";

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: <explanation>
    (content: JSX.Element): Response | Promise<Response>;
  }
}

const app = new Hono();

app.get(
  "/",
  prettyJSON(),
  cache({
    cacheName: "top",
    // 12 hours
    cacheControl: `public, max-age=${86400 / 2}`,
  }),
  indexHandler
);

app.get("/check", prettyJSON(), checkHandler);
app.get("/image.svg", async (c) => {
  const w = safeParseInt(c.req.query("w"), 1500);
  const h = safeParseInt(c.req.query("h"), 1500);

  return c.body(await getSizeSVG({ width: w, height: h }), 200, {
    "Content-Type": "image/svg+xml",
  });
});

app.get(
  "/image.png",

  async (c) => {
    const Resvg = await getResvg();
    const w = safeParseInt(c.req.query("w"), 1500);
    const h = safeParseInt(c.req.query("h"), 1500);

    const resvg = new Resvg(await getSizeSVG({ width: w, height: h }));

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return c.body(pngBuffer, 200, { "Content-Type": "image/png" });
  }
);

async function getSizeSVG(size: { width: number; height: number }) {
  const satori = await getSatori();

  const svg = await satori(
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#00ffff",
        fontSize: 36,
      }}
    >
      {size.width} x {size.height}
    </div>,
    {
      width: size.width,
      height: size.height,
      fonts: getSatoriFonts(),
    }
  );

  return svg;
}

function safeParseInt(value: string | undefined, defaultValue: number) {
  try {
    if (value) return Number.parseInt(value, 10);
  } catch (error) {}
  return defaultValue;
}

app.get("*", async (c) => {
  const { query, dataRoutes } = createStaticHandler(routes);

  const context = await query(c.req.raw);

  if (context instanceof Response) throw context;

  const router = createStaticRouter(dataRoutes as RouteObject[], context);

  return c.body(
    await renderToReadableStream(
      <StaticRouterProvider router={router} context={context} />,
      {
        bootstrapModules: [
          import.meta.env.DEV ? "/src/client.tsx" : "/static/client.js",
        ],
      }
    ),
    {
      headers: {
        "Transfer-Encoding": "chunked",
        "Content-Type": "text/html; charset=UTF-8",
      },
    }
  );
});

export default app;
