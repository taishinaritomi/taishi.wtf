import type { Handler, MiddlewareHandler } from "hono";
import { prettyJSON } from "../middlewares/pretty-json";
import { getIp, getUserAgent } from "../utils/headers";

export const checkHandler: Handler = async (c) => {
  return c.json({
    ip: getIp(c.req.raw.headers),
    user_agent: getUserAgent(c.req.raw.headers),
  });
};

export function checkMiddleWare(): MiddlewareHandler {
  return prettyJSON();
}
