import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError } from "@/lib/apiHelpers";
import { getCacheJson, setCacheJson } from "@/lib/redis";
import { scanTextForSecrets, type SecretFinding } from "@/lib/secretScanner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GitHubRepoData {
  default_branch?: string;
}

interface GitHubTreeEntry {
  path?: string;
  type?: string;
  size?: number;
}

interface GitHubTreeResponse {
  tree?: GitHubTreeEntry[];
  truncated?: boolean;
}

interface GitHubContentFile {
  encoding?: string;
  content?: string;
}

interface SecretScanResult {
  owner: string;
  repo: string;
  ref: string;
  scannedFiles: number;
  totalCandidateFiles: number;
  truncated: boolean;
  findings: SecretFinding[];
}

const TEXT_FILE_EXTENSIONS = new Set([
  ".env",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".conf",
  ".config",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".rb",
  ".go",
  ".java",
  ".cs",
  ".php",
  ".sh",
  ".zsh",
  ".bash",
  ".txt",
  ".md",
  ".graphql",
  ".sql",
  ".tf",
  ".properties",
  ".xml",
]);

const IGNORE_PATH_PARTS = [
  "/.git/",
  "/.next/",
  "/dist/",
  "/build/",
  "/coverage/",
  "/node_modules/",
  "/vendor/",
  "/.turbo/",
  "/.cache/",
];

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function getJson<T>(url: string, timeoutMs = 12_000): Promise<T> {
  const response = await fetchWithTimeout(url, { headers: getHeaders() }, timeoutMs);
  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

function hasTextLikeExtension(path: string): boolean {
  const lower = path.toLowerCase();
  if (lower.endsWith(".pem") || lower.endsWith(".key")) return true;
  return Array.from(TEXT_FILE_EXTENSIONS).some((extension) => lower.endsWith(extension));
}

function isIgnoredPath(path: string): boolean {
  const normalized = `/${path.toLowerCase()}`;
  if (normalized.includes("/.git")) return true;
  return IGNORE_PATH_PARTS.some((part) => normalized.includes(part));
}

function isLikelyBinary(content: string): boolean {
  return content.includes("\u0000");
}

async function mapWithConcurrency<T, R>(
  values: T[],
  limit: number,
  iteratee: (value: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(values.length);
  let index = 0;

  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (index < values.length) {
      const current = index;
      index += 1;
      results[current] = await iteratee(values[current]);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner")?.trim();
  const repo = searchParams.get("repo")?.trim();
  const requestedRef = searchParams.get("ref")?.trim();

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo are required." }, { status: 400 });
  }

  const baseRepo = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
  const cachePrefix = `gh:secret-scan:${baseRepo}`;

  try {
    const defaultBranch = requestedRef
      ? requestedRef
      : (await getJson<GitHubRepoData>(`https://api.github.com/repos/${owner}/${repo}`)).default_branch || "main";

    const cacheKey = `${cachePrefix}:${defaultBranch}`;
    const cached = await getCacheJson<SecretScanResult>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const tree = await getJson<GitHubTreeResponse>(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`,
      15_000,
    );

    const blobEntries = (tree.tree || []).filter((entry) => entry.type === "blob" && entry.path);
    const candidates = blobEntries
      .filter((entry) => {
        const path = entry.path!;
        if (isIgnoredPath(path)) return false;
        if (!hasTextLikeExtension(path)) return false;
        if ((entry.size || 0) > 300_000) return false;
        return true;
      })
      .slice(0, 300);

    const fileResults = await mapWithConcurrency(candidates, 6, async (entry) => {
      const path = entry.path!;
      try {
        const contentFile = await getJson<GitHubContentFile>(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path
            .split("/")
            .map((segment) => encodeURIComponent(segment))
            .join("/")}?ref=${encodeURIComponent(defaultBranch)}`,
        );

        if (contentFile.encoding !== "base64" || !contentFile.content) {
          return [] as SecretFinding[];
        }

        const decoded = Buffer.from(contentFile.content, "base64").toString("utf8");
        if (isLikelyBinary(decoded)) return [] as SecretFinding[];
        return scanTextForSecrets(decoded, path);
      } catch {
        return [] as SecretFinding[];
      }
    });

    const findings = fileResults.flat().slice(0, 500);
    const result: SecretScanResult = {
      owner,
      repo,
      ref: defaultBranch,
      scannedFiles: candidates.length,
      totalCandidateFiles: blobEntries.length,
      truncated: Boolean(tree.truncated) || blobEntries.length > candidates.length,
      findings,
    };

    await setCacheJson(cacheKey, result, 60 * 60);
    return NextResponse.json(result);
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Repository secret scan timed out." }, { status: 504 });
    }
    const message = error instanceof Error ? error.message : "Repository secret scan failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
