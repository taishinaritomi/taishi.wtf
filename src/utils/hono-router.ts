import { RegExpRouter } from "hono/router/reg-exp-router";
import { SmartRouter } from "hono/router/smart-router";
import { TrieRouter } from "hono/router/trie-router";

export function createHonoRouter<T>() {
  const routers = [new RegExpRouter<T>(), new TrieRouter<T>()];
  return new SmartRouter<T>({ routers });
}
