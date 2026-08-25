interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check and enforce rate limiting using an in-memory sliding window.
 *
 * @param key Unique key to rate limit (e.g., `login:${ip}:${email}`)
 * @param maxAttempts Maximum allowed attempts within the time window
 * @param windowSeconds Time window duration in seconds
 * @returns Object with allowed status, remaining attempts, and reset time in seconds
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
} {
  cleanupStaleEntries();

  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // New window or expired window
    const resetAt = now + windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (record.count >= maxAttempts) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  record.count += 1;
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetInSeconds: Math.max(1, resetInSeconds),
  };
}

/**
 * Reset a rate limit key (e.g. after a successful login).
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
