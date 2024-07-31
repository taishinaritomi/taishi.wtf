import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>404 Not Found.</div>;
    }

    return <div>Error: {error.status}</div>;
  }

  return <div>Error</div>;
}
