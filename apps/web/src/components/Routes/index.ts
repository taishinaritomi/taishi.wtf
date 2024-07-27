import type { Handler } from "hono";
import { getAge } from "../../utils/get-age";

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
