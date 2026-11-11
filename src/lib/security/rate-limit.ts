interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    rateLimitMap.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetTime: now + WINDOW_MS };
  }

  // Fenêtre expirée, reset
  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetTime: now + WINDOW_MS };
  }

  // Vérifier le dépassement
  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.firstAttempt + WINDOW_MS,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
    resetTime: entry.firstAttempt + WINDOW_MS,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
