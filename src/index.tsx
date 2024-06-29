import { Hono } from "hono";
import { Color } from "./components/Routes/Color";
import { prettyJSON } from "./middlewares/pretty-json";
import { getAge } from "./utils/get-age";
import { getIp, getUserAgent } from "./utils/headers";
import { createHonoRouter } from "./utils/hono-router";
import { reactRenderer } from "./utils/react-renderer";

const name = "Taishi Naritomi";
const birthday = new Date("2001-09-10");

const app = new Hono({ router: createHonoRouter() });

app.use(reactRenderer);

import { cache } from "hono/cache";

app.get(
  "/",
  prettyJSON(),
  cache({
    cacheName: "top",
    // 12 hours
    cacheControl: `public, max-age=${86400 / 2}`,
  }),
  (c) => {
    return c.json({
      name,
      age: getAge(birthday),
      location: "Tokyo, Japan",
      github: "https://github.com/taishinaritomi",
      x: "https://x.com/taishinaritomi",
    });
  }
);

app.get(
  "/cache",
  prettyJSON(),
  cache({
    cacheName: "top",
    // 12 hours
    cacheControl: `public, max-age=${86400 / 2}`,
  }),
  async (c) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return c.json({ ok: true });
  }
);

app.get("/check", prettyJSON(), (c) => {
  return c.json({
    ip: getIp(c.req.raw.headers),
    user_agent: getUserAgent(c.req.raw.headers),
  });
});

app.get("/color", async (c) => {
  return c.render(<Color />);
});

export default app;
