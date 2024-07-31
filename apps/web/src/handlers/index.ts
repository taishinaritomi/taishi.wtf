import type { Handler, MiddlewareHandler } from "hono";
import { cache } from "hono/cache";
import { applyMiddlewares } from "../middlewares/apply";
import { prettyJSON } from "../middlewares/pretty-json";
import { getAge } from "../utils/get-age";

const name = "Taishi Naritomi";
const birthday = new Date("2001-09-10");

export const indexHandler: Handler = async (c) => {
  return c.json({
    name,
    age: getAge(birthday),
    location: "Tokyo, Japan",
    github: "https://github.com/taishinaritomi",
    x: "https://x.com/taishinaritomi",
  });
};

export function indexMiddleWare(): MiddlewareHandler {
  return applyMiddlewares([
    prettyJSON(),
    cache({
      cacheName: "top",
      // 12 hours
      cacheControl: `public, max-age=${86400 / 2}`,
    }),
  ]);
}
