import { NextResponse } from "next/server";
import {
  fetchWithTimeout,
  getClientIp,
  isAbortError,
} from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";

interface LeakcheckSource {
  name?: string;
  date?: string;
  fields?: string[];
  unverified?: number;
}

interface LeakcheckResponse {
  success?: boolean;
  found?: number;
  sources?: LeakcheckSource[];
}

const requestsByIp = new Map<string, { count: number; startedAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

function enforceRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = requestsByIp.get(ip);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestsByIp.set(ip, { count: 1, startedAt: now });
    return true;
  }

  if (current.count >= MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  requestsByIp.set(ip, current);
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (!enforceRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in one minute." },
      { status: 429 },
    );
  }

  try {
    const cacheKey = `lc:breaches:${email.toLowerCase()}`;
    const cached = await getCacheJson<{
      found: number;
      sources: Array<{ name: string; date: string; fields: string[]; unverified: number }>;
    }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetchWithTimeout(
      `https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`,
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch LeakCheck data." }, { status: 500 });
    }

    const data = (await response.json()) as LeakcheckResponse;
    const payload = {
      found: data.found || 0,
      sources: (data.sources || []).map((item) => ({
        name: item.name || "Unknown",
        date: item.date || "Unknown",
        fields: Array.isArray(item.fields) ? item.fields : [],
        unverified: item.unverified === 1 ? 1 : 0,
      })),
    };

    await setCacheJson(cacheKey, payload, 30 * 60);
    return NextResponse.json(payload);
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Upstream request timed out." }, { status: 504 });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
