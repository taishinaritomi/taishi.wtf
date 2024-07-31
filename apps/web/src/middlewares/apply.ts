import type { MiddlewareHandler } from "hono";

export function applyMiddlewares(
  middlewares: MiddlewareHandler[],
): MiddlewareHandler {
  return (c, next) => {
    const [middleware, ...rest] = middlewares;

    if (!middleware) return next();

    return middleware(c, async () => {
      await applyMiddlewares(rest)(c, next);
    });
  };
}
