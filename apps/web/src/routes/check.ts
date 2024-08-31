import type { App } from "..";
import { prettyJSON } from "../middlewares/pretty-json";
import { getIp, getUserAgent } from "../utils/headers";

export function registerCheckRoute(app: App): void {
  app.get("/check", prettyJSON(), (c) => {
    return c.json({
      ip: getIp(c.req.raw.headers),
      user_agent: getUserAgent(c.req.raw.headers),
    });
  });
}
