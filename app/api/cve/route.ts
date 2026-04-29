import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError, isSafePackageName } from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";

interface NvdMetric {
  cvssData?: {
    baseScore?: number;
    baseSeverity?: string;
  };
}

interface NvdCve {
  id?: string;
  published?: string;
  descriptions?: Array<{ lang?: string; value?: string }>;
  metrics?: {
    cvssMetricV31?: NvdMetric[];
    cvssMetricV30?: NvdMetric[];
    cvssMetricV2?: NvdMetric[];
  };
  configurations?: Array<{
    nodes?: Array<{
      cpeMatch?: Array<{ criteria?: string }>;
    }>;
  }>;
}

interface NvdResponse {
  vulnerabilities?: Array<{ cve?: NvdCve }>;
}

let lastNvdCallAt = 0;

async function waitForRateLimitWindow() {
  const now = Date.now();
  const elapsed = now - lastNvdCallAt;
  const waitMs = Math.max(0, 500 - elapsed);

  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  lastNvdCallAt = Date.now();
}

function pickMetric(cve: NvdCve): NvdMetric | undefined {
  return (
    cve.metrics?.cvssMetricV31?.[0] ||
    cve.metrics?.cvssMetricV30?.[0] ||
    cve.metrics?.cvssMetricV2?.[0]
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageName = searchParams.get("package")?.trim();

  if (!packageName || !isSafePackageName(packageName)) {
    return NextResponse.json({ error: "Invalid package name." }, { status: 400 });
  }

  try {
    const cacheKey = `cve:${packageName.toLowerCase()}`;
    const cached = await getCacheJson<
      Array<{
        id: string;
        severity: string;
        cvss: number;
        description: string;
        published: string | null;
        affectedVersions: string[];
      }>
    >(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    await waitForRateLimitWindow();

    const headers: HeadersInit = {};
    if (process.env.NVD_API_KEY) {
      headers.apiKey = process.env.NVD_API_KEY;
    }

    const response = await fetchWithTimeout(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(
        packageName,
      )}&resultsPerPage=10`,
      { headers },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch CVE data." }, { status: 500 });
    }

    const data = (await response.json()) as NvdResponse;
    const cves = (data.vulnerabilities || []).map((item) => {
      const cve = item.cve || {};
      const metric = pickMetric(cve);
      const description =
        cve.descriptions?.find((entry) => entry.lang === "en")?.value ||
        cve.descriptions?.[0]?.value ||
        "";

      const affectedVersions =
        cve.configurations
          ?.flatMap((config) => config.nodes || [])
          .flatMap((node) => node.cpeMatch || [])
          .map((match) => match.criteria)
          .filter(Boolean) || [];

      return {
        id: cve.id || "UNKNOWN",
        severity: metric?.cvssData?.baseSeverity || "UNKNOWN",
        cvss: metric?.cvssData?.baseScore || 0,
        description,
        published: cve.published || null,
        affectedVersions,
      };
    });

    await setCacheJson(cacheKey, cves, 6 * 60 * 60);
    return NextResponse.json(cves);
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Upstream request timed out." }, { status: 504 });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
