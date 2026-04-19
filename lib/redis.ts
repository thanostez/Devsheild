import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

export function isRedisConfigured(): boolean {
  return redis !== null;
}

export async function getCacheJson<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const value = await redis.get<T>(key);
    return value ?? null;
  } catch {
    return null;
  }
}

export async function setCacheJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // best-effort cache write
  }
}

export async function getCacheText(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    const value = await redis.get<string>(key);
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

export async function setCacheText(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // best-effort cache write
  }
}

