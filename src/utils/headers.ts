export function getUserAgent(headers: Headers) {
  return headers.get("user-agent");
}

export function getIp(headers: Headers) {
  // https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
  return headers.get("cf-connecting-ip");
}
