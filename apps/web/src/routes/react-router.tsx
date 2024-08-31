import { renderToReadableStream } from "react-dom/server.edge";
import type { RouteObject } from "react-router-dom";
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from "react-router-dom/server";
import type { App } from "..";
import { routes } from "../routes";

export function registerReactRouterRoute(app: App): void {
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
}
