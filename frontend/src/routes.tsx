import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { GlobalLayout } from "./components/Layout";

const Color = lazy(() =>
  import("./components/Routes/Color").then((m) => ({ default: m.Color })),
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <GlobalLayout />,
    children: [{ path: "/color", element: <Color /> }],
  },
];
