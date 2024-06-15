import { Hono } from "hono";
import { prettyJSON } from "./middlewares/pretty-json";
import { getAge } from "./utils/get-age";
import { getIp, getIpV6 } from "./utils/get-ip";

const name = "Taishi Naritomi";
const birthday = new Date("2001-09-10");

const app = new Hono();

app.get("/", prettyJSON(), (c) => {
  return c.json({ name, age: getAge(birthday) });
});

app.get("/check", prettyJSON(), (c) => {
  return c.json({
    client_ip: getIp(c.req.raw.headers),
    client_ip_v6: getIpV6(c.req.raw.headers),
    json: Object.fromEntries(c.req.raw.headers.entries()),
  });
});

export default app;
