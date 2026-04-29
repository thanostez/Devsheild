import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError } from "@/lib/apiHelpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner")?.trim();
  const repo = searchParams.get("repo")?.trim();

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo are required." }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3.raw",
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;
    const response = await fetchWithTimeout(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "No package.json found in repository root." }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch from GitHub API." }, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "GitHub request timed out." }, { status: 504 });
    }
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
