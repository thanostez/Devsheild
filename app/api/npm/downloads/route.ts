import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError, isSafePackageName } from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";

interface NpmDownloadsResponse {
  downloads?: Array<{ day?: string; week?: string; downloads: number }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name || !isSafePackageName(name)) {
    return NextResponse.json({ error: "Invalid package name." }, { status: 400 });
  }

  try {
    const cacheKey = `npm:dl:${name.toLowerCase()}`;
    const cached = await getCacheJson<Array<{ week: string; downloads: number }>>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetchWithTimeout(
      `https://api.npmjs.org/downloads/range/last-year/${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch npm download stats." }, { status: 500 });
    }

    const data = (await response.json()) as NpmDownloadsResponse;
    const entries = data.downloads || [];
    const weekly: Array<{ week: string; downloads: number }> = [];

    for (let i = 0; i < entries.length; i += 7) {
      const bucket = entries.slice(i, i + 7);
      const downloads = bucket.reduce((sum, item) => sum + (item.downloads || 0), 0);
      const label = bucket[0]?.day || bucket[0]?.week || "";

      weekly.push({
        week: label,
        downloads,
      });
    }

    const payload = weekly.slice(0, 52);
    await setCacheJson(cacheKey, payload, 60 * 60);
    return NextResponse.json(payload);
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Upstream request timed out." }, { status: 504 });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
