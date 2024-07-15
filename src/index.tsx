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
import { getSatori, getSatoriFonts } from "./utils/satori";

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
  indexHandler,
);

app.get("/check", prettyJSON(), checkHandler);
app.get("/image/*", async (c) => {
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
      1200 x 630
    </div>,
    {
      // embedFont: false,
      width: 1200,
      height: 630,
      fonts: getSatoriFonts(),
    },
  );

  return c.body(svg, 200, {
    "Content-Type": "image/svg+xml",
  });
});

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
      },
    ),
    {
      headers: {
        "Transfer-Encoding": "chunked",
        "Content-Type": "text/html; charset=UTF-8",
      },
    },
  );
});

export default app;
