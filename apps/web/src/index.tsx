import { Hono } from "hono";
import { renderToReadableStream } from "react-dom/server.edge";
import type { RouteObject } from "react-router-dom";
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from "react-router-dom/server";
import { indexHandler, indexMiddleWare } from "./handlers";
import { checkHandler, checkMiddleWare } from "./handlers/check";
import { routes } from "./routes";

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: <explanation>
    (content: JSX.Element): Response | Promise<Response>;
  }
}

type Bindings = {
  API_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", indexMiddleWare(), indexHandler);
app.get("/check", checkMiddleWare(), checkHandler);

app.get("/image", (c) => {
  const params = new URLSearchParams(c.req.query());

  return fetch(`${c.env.API_URL}?${params.toString()}`);
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
        bootstrapModules: import.meta.env.CLIENT_ENTRY
          ? [import.meta.env.CLIENT_ENTRY]
          : [],
      },
    ),
    {
      headers: {
        "Transfer-Encoding": "chunked",
        "Content-Type": "text/html; charset=UTF-8",
      },
      status: context.statusCode,
    },
  );
});

export default app;
