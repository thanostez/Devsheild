import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError, isSafePackageName } from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";

interface NpmSearchResult {
  package?: { name?: string };
  score?: {
    detail?: {
      quality?: number;
      popularity?: number;
      maintenance?: number;
    };
  };
}

interface NpmSearchResponse {
  objects?: NpmSearchResult[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name || !isSafePackageName(name)) {
    return NextResponse.json({ error: "Invalid package name." }, { status: 400 });
  }

  try {
    const cacheKey = `npm:scores:${name.toLowerCase()}`;
    const cached = await getCacheJson<{
      quality: number;
      popularity: number;
      maintenance: number;
    }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetchWithTimeout(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(name)}&size=5`,
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch npm scores." }, { status: 500 });
    }

    const data = (await response.json()) as NpmSearchResponse;
    const best =
      (data.objects || []).find((item) => item.package?.name === name) ||
      data.objects?.[0];

    const detail = best?.score?.detail;
    const payload = {
      quality: Math.round((detail?.quality || 0) * 100),
      popularity: Math.round((detail?.popularity || 0) * 100),
      maintenance: Math.round((detail?.maintenance || 0) * 100),
    };

    await setCacheJson(cacheKey, payload, 60 * 60);
    return NextResponse.json(payload);
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Upstream request timed out." }, { status: 504 });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
