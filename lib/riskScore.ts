export type CveSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface NpmPackageData {
  lastPublished: Date | string;
  maintainersCount: number;
  lastCommitDate?: Date | string | null;
}

export interface CVEData {
  severity: CveSeverity;
  cvss?: number;
}

export interface DownloadData {
  monthly: number;
  trend: "up" | "down" | "stable";
}

export interface NpmScores {
  quality: number;
  popularity: number;
  maintenance: number;
}

export interface AllScores {
  security: number;
  maintenance: number;
  popularity: number;
  quality: number;
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function differenceInDays(from: Date, to: Date): number {
  const millisInDay = 24 * 60 * 60 * 1000;
  return Math.floor((from.getTime() - to.getTime()) / millisInDay);
}

export function calculateSecurityScore(cves: CVEData[]): number {
  const penalties: Record<CveSeverity, number> = {
    CRITICAL: 25,
    HIGH: 15,
    MEDIUM: 8,
    LOW: 3,
  };

  const totalPenalty = cves.reduce((total, cve) => total + penalties[cve.severity], 0);
  return clampScore(100 - totalPenalty);
}

export function calculateMaintenanceScore(pkg: NpmPackageData): number {
  const now = new Date();
  const lastPublishedDate = new Date(pkg.lastPublished);
  const daysSincePublish = differenceInDays(now, lastPublishedDate);

  let score = 100;
  if (daysSincePublish > 730) score = 10;
  else if (daysSincePublish > 365) score = 25;
  else if (daysSincePublish > 180) score = 50;
  else if (daysSincePublish > 90) score = 75;
  else if (daysSincePublish > 30) score = 90;

  if (pkg.maintainersCount <= 1) {
    score -= 10;
  }

  const lastCommitValue = pkg.lastCommitDate ?? pkg.lastPublished;
  const daysSinceCommit = differenceInDays(now, new Date(lastCommitValue));
  if (daysSinceCommit > 730) {
    score -= 20;
  }

  return clampScore(score);
}

export function calculatePopularityScore(downloads: DownloadData): number {
  const monthly = downloads.monthly;

  if (monthly > 10_000_000) return 100;
  if (monthly > 1_000_000) return 85;
  if (monthly > 100_000) return 70;
  if (monthly > 10_000) return 50;
  if (monthly > 1_000) return 30;
  if (monthly > 100) return 15;
  return 5;
}

export function calculateQualityScore(scores: NpmScores): number {
  const qualityValue = scores.quality <= 1 ? scores.quality * 100 : scores.quality;
  return clampScore(qualityValue);
}

export function calculateOverallRiskScore(all: AllScores): number {
  const safety =
    all.security * 0.4 +
    all.maintenance * 0.3 +
    all.popularity * 0.2 +
    all.quality * 0.1;

  return clampScore(100 - safety);
}

export function getRiskLabel(score: number): "LOW" | "MODERATE" | "HIGH" | "CRITICAL" {
  if (score <= 30) return "LOW";
  if (score <= 60) return "MODERATE";
  if (score <= 80) return "HIGH";
  return "CRITICAL";
}

export function getRiskColor(score: number): string {
  const label = getRiskLabel(score);

  if (label === "LOW") return "#10B981";
  if (label === "MODERATE") return "#F59E0B";
  if (label === "HIGH") return "#EF4444";
  return "#DC2626";
}
