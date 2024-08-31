import { Hono } from "hono";
import { registerCheckRoute } from "./routes/check";
import { registerImageRoute } from "./routes/image";
import { registerIndexRoute } from "./routes/index";
import { registerReactRouterRoute } from "./routes/react-router";

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: <explanation>
    (content: JSX.Element): Response | Promise<Response>;
  }
}

type Bindings = {
  API_URL: string;
};

export type App = Hono<{ Bindings: Bindings }>;

const app: App = new Hono();

registerIndexRoute(app);
registerCheckRoute(app);
registerImageRoute(app);
registerReactRouterRoute(app);

export default app;
