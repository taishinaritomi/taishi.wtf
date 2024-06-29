import React from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

hydrateRoot(
  document.body,
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
