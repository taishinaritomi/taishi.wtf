import { Hono } from "hono";
import { prettyJSON } from "./middlewares/pretty-json";
import { getAge } from "./utils/get-age";
import { getIp, getUserAgent } from "./utils/headers";

const name = "Taishi Naritomi";
const birthday = new Date("2001-09-10");

const app = new Hono();

app.get("/", prettyJSON(), (c) => {
  return c.json({
    name,
    age: getAge(birthday),
    location: "Tokyo, Japan",
    github: "https://github.com/taishinaritomi",
    x: "https://x.com/taishinaritomi",
  });
});

app.get("/check", prettyJSON(), (c) => {
  return c.json({
    client_ip: getIp(c.req.raw.headers),
    user_agent: getUserAgent(c.req.raw.headers),
  });
});

export default app;
