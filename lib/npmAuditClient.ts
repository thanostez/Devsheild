import {
  calculateMaintenanceScore,
  calculateOverallRiskScore,
  calculatePopularityScore,
  calculateQualityScore,
  calculateSecurityScore,
} from "@/lib/riskScore";

export interface PackageMetadata {
  name: string;
  version: string | null;
  description: string | null;
  license: string | null;
  maintainers: Array<{ name?: string; email?: string }>;
  repository: string | null;
  dependenciesCount: number;
  lastPublishDate: string | null;
}

export interface DownloadPoint {
  week: string;
  downloads: number;
}

export interface ScoreData {
  quality: number;
  popularity: number;
  maintenance: number;
}

export interface CveItem {
  id: string;
  severity: string;
  cvss: number;
  description: string;
  published: string | null;
  affectedVersions: string[];
}

export interface GithubData {
  stars: number;
  open_issues: number;
  last_push: string | null;
  contributors_url: string | null;
}

export interface PackageAnalysis {
  packageName: string;
  metadata: PackageMetadata;
  downloads: DownloadPoint[];
  cves: CveItem[];
  github: GithubData | null;
  subScores: {
    security: number;
    maintenance: number;
    popularity: number;
    quality: number;
  };
  overallRisk: number;
}

function parseRepository(repo: string | null): { owner: string; repo: string } | null {
  if (!repo) return null;

  const cleaned = repo
    .replace("git+", "")
    .replace("git://", "https://")
    .replace(".git", "")
    .replace("git@github.com:", "https://github.com/");

  const match = cleaned.match(/github\.com\/(.+?)\/(.+?)(?:$|\/)/i);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2],
  };
}

function normalizeSeverity(value: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const upper = value.toUpperCase();
  if (upper.includes("CRITICAL")) return "CRITICAL";
  if (upper.includes("HIGH")) return "HIGH";
  if (upper.includes("MEDIUM")) return "MEDIUM";
  return "LOW";
}

function calculateTrend(downloads: DownloadPoint[]): "up" | "down" | "stable" {
  const recent = downloads.slice(-4).reduce((sum, item) => sum + item.downloads, 0);
  const previous = downloads.slice(-8, -4).reduce((sum, item) => sum + item.downloads, 0);

  if (recent > previous * 1.05) return "up";
  if (recent < previous * 0.95) return "down";
  return "stable";
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // no-op
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function analyzePackage(packageName: string): Promise<PackageAnalysis> {
  const encoded = encodeURIComponent(packageName);

  const [metadata, downloads, scores, cves] = await Promise.all([
    getJson<PackageMetadata>(`/api/npm/package?name=${encoded}`),
    getJson<DownloadPoint[]>(`/api/npm/downloads?name=${encoded}`),
    getJson<ScoreData>(`/api/npm/scores?name=${encoded}`),
    getJson<CveItem[]>(`/api/cve?package=${encoded}`),
  ]);

  const repo = parseRepository(metadata.repository);
  const github = repo
    ? await getJson<GithubData>(
        `/api/github/repo?owner=${encodeURIComponent(repo.owner)}&repo=${encodeURIComponent(repo.repo)}`,
      ).catch(() => null)
    : null;

  const security = calculateSecurityScore(
    cves.map((item) => ({
      severity: normalizeSeverity(item.severity),
      cvss: item.cvss,
    })),
  );

  const maintenance = calculateMaintenanceScore({
    lastPublished: metadata.lastPublishDate || new Date().toISOString(),
    maintainersCount: metadata.maintainers.length,
    lastCommitDate: github?.last_push,
  });

  const monthlyDownloads = downloads.slice(-4).reduce((sum, item) => sum + item.downloads, 0);
  const popularity = calculatePopularityScore({
    monthly: monthlyDownloads,
    trend: calculateTrend(downloads),
  });

  const quality = calculateQualityScore(scores);

  const overallRisk = calculateOverallRiskScore({
    security,
    maintenance,
    popularity,
    quality,
  });

  return {
    packageName,
    metadata,
    downloads,
    cves,
    github,
    subScores: {
      security,
      maintenance,
      popularity,
      quality,
    },
    overallRisk,
  };
}

export interface BulkScanRow {
  name: string;
  version: string;
  riskScore: number;
  cveCount: number;
}

export async function scanDependencies(
  packageNames: string[],
  onProgress: (done: number, total: number) => void,
): Promise<BulkScanRow[]> {
  const rows: BulkScanRow[] = [];

  for (let index = 0; index < packageNames.length; index += 1) {
    const current = packageNames[index];
    try {
      const analysis = await analyzePackage(current);
      rows.push({
        name: analysis.packageName,
        version: analysis.metadata.version || "unknown",
        riskScore: analysis.overallRisk,
        cveCount: analysis.cves.length,
      });
    } catch {
      rows.push({
        name: current,
        version: "unresolved",
        riskScore: 100,
        cveCount: 0,
      });
    }

    onProgress(index + 1, packageNames.length);
  }

  return rows.sort((a, b) => b.riskScore - a.riskScore);
}
