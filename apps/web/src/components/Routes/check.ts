import type { Handler } from "hono";
import { getIp, getUserAgent } from "../../utils/headers";

export const checkHandler: Handler = async (c) => {
  return c.json({
    ip: getIp(c.req.raw.headers),
    user_agent: getUserAgent(c.req.raw.headers),
  });
};
