import { AuthenticationError } from "./types";

function parseOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.origin === "null" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function assertSameOrigin(request: Request): void {
  const configuredOrigin = process.env.APP_ORIGIN;
  if (process.env.NODE_ENV === "production" && !configuredOrigin) {
    throw new Error("APP_ORIGIN must be configured in production.");
  }

  const expectedOrigin = configuredOrigin
    ? parseOrigin(configuredOrigin)
    : new URL(request.url).origin;
  if (!expectedOrigin) {
    throw new Error("A valid application origin is required.");
  }

  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    const requestUrl = new URL(request.url);
    if (
      process.env.NODE_ENV !== "production" &&
      (requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1")
    ) {
      return;
    }
    throw new AuthenticationError(403, "Origin is required.");
  }

  const requestOrigin = parseOrigin(originHeader);
  if (requestOrigin !== expectedOrigin) {
    throw new AuthenticationError(403, "Cross-origin request rejected.");
  }
}
