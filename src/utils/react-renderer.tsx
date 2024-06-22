import { createMiddleware } from "hono/factory";
import type { JSX } from "react";
// @ts-expect-error react-dom/server.edge
import { renderToReadableStream } from "react-dom/server.edge";
import { GlobalLayout } from "../components/Layout";

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: <explanation>
    (content: JSX.Element): Response | Promise<Response>;
  }
}

export const reactRenderer = createMiddleware(async (c, next) => {
  c.setRenderer(async (content) => {
    return c.body(
      await renderToReadableStream(<GlobalLayout>{content}</GlobalLayout>),
      {
        headers: {
          "Transfer-Encoding": "chunked",
          "Content-Type": "text/html; charset=UTF-8",
        },
      },
    );
  });

  await next();
});
