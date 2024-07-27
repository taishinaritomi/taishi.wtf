import type { MiddlewareHandler } from "hono";

/**
 * https://github.com/honojs/hono/blob/main/src/middleware/pretty-json/index.ts
 *
 * `minify` query parameter is added to disable pretty JSON
 */
export function prettyJSON(): MiddlewareHandler {
  return async (c, next) => {
    await next();

    if (
      !(c.req.query("minify") || c.req.query("minify") === "") &&
      c.res.headers.get("Content-Type")?.startsWith("application/json")
    ) {
      const obj = await c.res.json();
      c.res = new Response(JSON.stringify(obj, null, 2), c.res);
    }
  };
}
