import { z } from 'zod';

const rateLimitSchema = z.object({
  attempts: z.number(),
  lastAttempt: z.number(),
  blockedUntil: z.number().nullable(),
});

type RateLimit = z.infer<typeof rateLimitSchema>;

const RATE_LIMIT = {
  MAX_ATTEMPTS: 3,
  WINDOW: 10 * 60 * 1000, // 10 minutes in milliseconds
  BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
};

export class RateLimiter {
  private static KEY = 'auth_rate_limit';

  private static getData(): RateLimit | null {
    const data = localStorage.getItem(this.KEY);
    if (!data) return null;

    try {
      return rateLimitSchema.parse(JSON.parse(data));
    } catch {
      localStorage.removeItem(this.KEY);
      return null;
    }
  }

  private static setData(data: RateLimit): void {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  static recordAttempt(): void {
    const now = Date.now();
    const data = this.getData();

    if (!data) {
      this.setData({
        attempts: 1,
        lastAttempt: now,
        blockedUntil: null,
      });
      return;
    }

    // Reset if window has expired
    if (now - data.lastAttempt > RATE_LIMIT.WINDOW) {
      this.setData({
        attempts: 1,
        lastAttempt: now,
        blockedUntil: null,
      });
      return;
    }

    // Block if max attempts reached
    if (data.attempts >= RATE_LIMIT.MAX_ATTEMPTS) {
      this.setData({
        ...data,
        blockedUntil: now + RATE_LIMIT.BLOCK_DURATION,
      });
      return;
    }

    // Increment attempts
    this.setData({
      ...data,
      attempts: data.attempts + 1,
      lastAttempt: now,
    });
  }

  static getStatus(): {
    isBlocked: boolean;
    remainingAttempts: number;
    blockTimeRemaining: number | null;
  } {
    const now = Date.now();
    const data = this.getData();

    if (!data) {
      return {
        isBlocked: false,
        remainingAttempts: RATE_LIMIT.MAX_ATTEMPTS,
        blockTimeRemaining: null,
      };
    }

    // Check if blocked
    if (data.blockedUntil && data.blockedUntil > now) {
      return {
        isBlocked: true,
        remainingAttempts: 0,
        blockTimeRemaining: data.blockedUntil - now,
      };
    }

    // Reset if window has expired
    if (now - data.lastAttempt > RATE_LIMIT.WINDOW) {
      return {
        isBlocked: false,
        remainingAttempts: RATE_LIMIT.MAX_ATTEMPTS,
        blockTimeRemaining: null,
      };
    }

    return {
      isBlocked: false,
      remainingAttempts: Math.max(0, RATE_LIMIT.MAX_ATTEMPTS - data.attempts),
      blockTimeRemaining: null,
    };
  }

  static reset(): void {
    localStorage.removeItem(this.KEY);
  }
}