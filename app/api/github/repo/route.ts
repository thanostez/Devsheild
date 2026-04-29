import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError } from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";

interface GithubRepoResponse {
  stargazers_count?: number;
  open_issues_count?: number;
  pushed_at?: string;
  contributors_url?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner")?.trim();
  const repo = searchParams.get("repo")?.trim();

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo are required." }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const cacheKey = `gh:repo:${owner.toLowerCase()}/${repo.toLowerCase()}`;
    const cached = await getCacheJson<{
      stars: number;
      open_issues: number;
      last_push: string | null;
      contributors_url: string | null;
    }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch GitHub repository data." }, { status: 500 });
    }

    const data = (await response.json()) as GithubRepoResponse;
    const payload = {
      stars: data.stargazers_count || 0,
      open_issues: data.open_issues_count || 0,
      last_push: data.pushed_at || null,
      contributors_url: data.contributors_url || null,
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
