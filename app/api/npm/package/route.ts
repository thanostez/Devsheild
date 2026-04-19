import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError, isSafePackageName } from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";

interface NpmMetadata {
  "dist-tags"?: { latest?: string };
  description?: string;
  license?: string;
  maintainers?: Array<{ name?: string; email?: string }>;
  repository?: string | { url?: string };
  versions?: Record<string, { dependencies?: Record<string, string> }>;
  time?: { [version: string]: string };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name || !isSafePackageName(name)) {
    return NextResponse.json({ error: "Invalid package name." }, { status: 400 });
  }

  try {
    const cacheKey = `npm:pkg:${name.toLowerCase()}`;
    const cached = await getCacheJson<{
      name: string;
      version: string | null;
      description: string | null;
      license: string | null;
      maintainers: Array<{ name?: string; email?: string }>;
      repository: string | null;
      dependenciesCount: number;
      lastPublishDate: string | null;
    }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetchWithTimeout(`https://registry.npmjs.org/${encodeURIComponent(name)}`);

    if (response.status === 404) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch npm package metadata." }, { status: 500 });
    }

    const data = (await response.json()) as NpmMetadata;
    const latest = data["dist-tags"]?.latest || "";
    const latestVersion = latest ? data.versions?.[latest] : undefined;

    const payload = {
      name,
      version: latest || null,
      description: data.description || null,
      license: data.license || null,
      maintainers: data.maintainers || [],
      repository:
        typeof data.repository === "string" ? data.repository : data.repository?.url || null,
      dependenciesCount: Object.keys(latestVersion?.dependencies || {}).length,
      lastPublishDate: latest && data.time?.[latest] ? data.time[latest] : null,
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
