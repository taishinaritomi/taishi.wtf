import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

hydrateRoot(
  document.body,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
