export function GlobalLayout(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script
          type="module"
          src={import.meta.env.DEV ? "/src/client.tsx" : "/static/client.js"}
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
