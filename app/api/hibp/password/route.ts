import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError } from "@/lib/apiHelpers";
import { getCacheText, setCacheText } from "@/lib/redis";

function isValidPrefix(prefix: string): boolean {
  return /^[A-F0-9]{5}$/.test(prefix);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get("prefix")?.trim().toUpperCase();

  if (!prefix || !isValidPrefix(prefix)) {
    return NextResponse.json({ error: "prefix must be 5 hex characters." }, { status: 400 });
  }

  try {
    const cacheKey = `hibp:pw:${prefix}`;
    const cached = await getCacheText(cacheKey);
    if (cached) {
      return new NextResponse(cached, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    const response = await fetchWithTimeout(`https://api.pwnedpasswords.com/range/${prefix}`);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch HIBP data." }, { status: 500 });
    }

    const rawText = await response.text();
    await setCacheText(cacheKey, rawText, 10 * 60);
    return new NextResponse(rawText, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Upstream request timed out." }, { status: 504 });
    }

    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
