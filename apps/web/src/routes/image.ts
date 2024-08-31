import type { App } from "..";

export function registerImageRoute(app: App): void {
  app.get("/image", (c) => {
    const params = new URLSearchParams(c.req.query());

    return fetch(`${c.env.API_URL}?${params.toString()}`);
  });
}
