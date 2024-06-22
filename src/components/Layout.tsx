import { DEV_SCRIPT_FILE, SCRIPT_FILE } from "../files";

export function GlobalLayout(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script
          type="module"
          src={import.meta.env.DEV ? DEV_SCRIPT_FILE : SCRIPT_FILE}
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
