import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export function GlobalLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>
      <body>
        <Suspense>
          <Outlet />
        </Suspense>
      </body>
    </html>
  );
}
