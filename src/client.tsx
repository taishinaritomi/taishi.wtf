import { hydrateRoot } from "react-dom/client";
import { Color } from "./components/Routes/Color";
import { createHonoRouter } from "./utils/hono-router";

const router = createHonoRouter<() => void>();

router.add("get", "/color", () => {
  hydrateRoot(document.body, <Color />);
});

for (const [handler] of router.match("get", location.pathname)[0]) handler();
