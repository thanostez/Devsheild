"use client";

import { Globe, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { scanDependencies, type BulkScanRow } from "@/lib/npmAuditClient";
import { getRiskColor, getRiskLabel } from "@/lib/riskScore";

interface ParsedPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

type SecretSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface SecretFinding {
  type: string;
  severity: SecretSeverity;
  filePath: string;
  line: number;
  confidence: number;
}

interface RepositorySecretScanResponse {
  owner: string;
  repo: string;
  ref: string;
  scannedFiles: number;
  totalCandidateFiles: number;
  truncated: boolean;
  findings: SecretFinding[];
}

function parseGitHubInput(value: string): { owner: string; repo: string } | null {
  const input = value.trim();
  if (!input) return null;

  if (input.includes("github.com/")) {
    const parts = input.split("github.com/")[1]?.split("/") || [];
    const owner = parts[0];
    const repo = parts[1];
    if (!owner || !repo) return null;
    return { owner, repo };
  }

  const parts = input.split("/");
  if (parts.length < 2) return null;
  const owner = parts[0]?.trim();
  const repo = parts[1]?.trim();
  if (!owner || !repo) return null;
  return { owner, repo };
}

export default function GithubScanner() {
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [isSecretScanning, setIsSecretScanning] = useState(false);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [rows, setRows] = useState<BulkScanRow[]>([]);
  const [secretScan, setSecretScan] = useState<RepositorySecretScanResponse | null>(null);

  const progressPercent = useMemo(() => {
    if (progress.total === 0) return 0;
    return Math.round((progress.done / progress.total) * 100);
  }, [progress]);

  const parseContent = (data: ParsedPackageJson) => {
    const names = Array.from(
      new Set([
        ...Object.keys(data.dependencies || {}),
        ...Object.keys(data.devDependencies || {}),
      ]),
    );

    if (names.length === 0) {
      setError("No dependencies/devDependencies found in this repository's package.json.");
      setPackageNames([]);
      setRows([]);
      return;
    }

    setError(null);
    setPackageNames(names);
    setRows([]);
    setProgress({ done: 0, total: names.length });
  };

  const fetchGithubPackage = async () => {
    const parsed = parseGitHubInput(urlInput);
    if (!parsed) {
      setError("Please provide a valid GitHub format (e.g., facebook/react or https://github.com/facebook/react)");
      return;
    }
    const { owner, repo } = parsed;

    setIsFetchingRepo(true);
    setError(null);
    setPackageNames([]);
    setRows([]);
    setSecretScan(null);

    try {
      const response = await fetch(`/api/github/package-json?owner=${owner}&repo=${repo}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch repository.");
      }
      const data = await response.json();
      parseContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repository.");
    } finally {
      setIsFetchingRepo(false);
    }
  };

  const startSecretScan = async () => {
    const parsed = parseGitHubInput(urlInput);
    if (!parsed) {
      setError("Please provide a valid GitHub format before running repository secret scan.");
      return;
    }

    setIsSecretScanning(true);
    setError(null);
    setSecretScan(null);

    try {
      const response = await fetch(
        `/api/github/secret-scan?owner=${encodeURIComponent(parsed.owner)}&repo=${encodeURIComponent(parsed.repo)}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Repository secret scan failed.");
      }
      setSecretScan(data as RepositorySecretScanResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repository secret scan failed.");
    } finally {
      setIsSecretScanning(false);
    }
  };

  const startScan = async () => {
    if (packageNames.length === 0) return;
    setIsScanning(true);
    setRows([]);
    try {
      const result = await scanDependencies(packageNames, (done, total) => {
        setProgress({ done, total });
      });
      setRows(result);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section className="space-y-5 rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-textPrimary" />
        <h2 className="text-lg font-semibold text-textPrimary">GitHub Repository Scanner</h2>
      </div>
      <p className="text-sm text-textSecondary">
        Paste a GitHub repository URL to automatically extract and audit its <code>package.json</code> dependencies.
      </p>

      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          placeholder="e.g. facebook/react or https://github.com/..."
          className="flex-1 rounded-lg border border-border bg-primaryBg px-4 py-2 text-sm text-textPrimary outline-none focus:border-accentBlue"
          onKeyDown={(e) => { if (e.key === 'Enter') fetchGithubPackage(); }}
        />
        <button
          onClick={fetchGithubPackage}
          disabled={isFetchingRepo || !urlInput.trim()}
          className="flex items-center justify-center gap-2 rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-textPrimary border border-border transition hover:bg-white hover:text-primaryBg disabled:opacity-50"
        >
          {isFetchingRepo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch Repo"}
        </button>
        <button
          onClick={startSecretScan}
          disabled={isSecretScanning || !urlInput.trim()}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-primaryBg px-4 py-2 text-sm font-semibold text-textPrimary transition hover:bg-surface disabled:opacity-50"
        >
          {isSecretScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Secret Scan Repo"}
        </button>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {packageNames.length > 0 ? (
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-sm text-textSecondary">Successfully extracted <span className="text-accentBlue font-bold">{packageNames.length}</span> dependencies.</p>
          <button
            type="button"
            onClick={startScan}
            disabled={isScanning}
            className="rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary transition hover:opacity-90 disabled:opacity-70"
          >
            {isScanning ? "Scanning..." : "Start Security Audit"}
          </button>

          {(isScanning || progress.done > 0) && progress.total > 0 ? (
            <div>
              <p className="mb-1 text-xs text-textSecondary">
                Progress: {progress.done} of {progress.total} packages
              </p>
              <div className="h-2 w-full overflow-hidden rounded bg-primaryBg">
                <div
                  className="h-full rounded bg-accentBlue transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto pt-4">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-textSecondary">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Version</th>
                <th className="px-3 py-2">Risk Score</th>
                <th className="px-3 py-2">CVEs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.name}>
                  <td className="px-3 py-3 font-mono text-xs text-textPrimary">{row.name}</td>
                  <td className="px-3 py-3 text-textSecondary">{row.version}</td>
                  <td className="px-3 py-3">
                    <span
                      className="rounded px-2 py-1 text-xs font-semibold"
                      style={{ color: getRiskColor(row.riskScore), backgroundColor: `${getRiskColor(row.riskScore)}33` }}
                    >
                      {row.riskScore} ({getRiskLabel(row.riskScore)})
                    </span>
                  </td>
                  <td className="px-3 py-3 text-textSecondary flex items-center h-full pt-4">
                    <span className={`font-semibold ${row.cveCount > 0 ? 'text-danger' : 'text-success'}`}>{row.cveCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {secretScan ? (
        <div className="space-y-3 rounded-lg border border-border bg-primaryBg p-4">
          <h3 className="text-sm font-semibold text-textPrimary">Repository Secret Scan</h3>
          <p className="text-xs text-textSecondary">
            Scanned <span className="font-semibold text-textPrimary">{secretScan.scannedFiles}</span> files on{" "}
            <code>{secretScan.ref}</code>. Findings:{" "}
            <span className={`font-semibold ${secretScan.findings.length > 0 ? "text-danger" : "text-success"}`}>
              {secretScan.findings.length}
            </span>
            {secretScan.truncated ? " (limited scan scope)" : ""}
          </p>

          {secretScan.findings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="text-[11px] uppercase text-textSecondary">
                  <tr>
                    <th className="px-2 py-2">Severity</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">File</th>
                    <th className="px-2 py-2">Line</th>
                    <th className="px-2 py-2">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {secretScan.findings.slice(0, 40).map((finding, index) => (
                    <tr key={`${finding.filePath}-${finding.line}-${finding.type}-${index}`}>
                      <td className="px-2 py-2">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold ${
                            finding.severity === "CRITICAL"
                              ? "bg-danger/20 text-danger"
                              : finding.severity === "HIGH"
                                ? "bg-warning/20 text-warning"
                                : "bg-accentBlue/20 text-accentBlue"
                          }`}
                        >
                          {finding.severity}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-textPrimary">{finding.type}</td>
                      <td className="px-2 py-2 font-mono text-[11px] text-textSecondary">{finding.filePath}</td>
                      <td className="px-2 py-2 text-textSecondary">{finding.line}</td>
                      <td className="px-2 py-2 text-textSecondary">{Math.round(finding.confidence * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-success">No secrets detected in scanned files.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
