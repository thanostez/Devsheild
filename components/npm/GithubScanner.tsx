"use client";

import { Globe, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { scanDependencies, type BulkScanRow } from "@/lib/npmAuditClient";
import { getRiskColor, getRiskLabel } from "@/lib/riskScore";

interface ParsedPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export default function GithubScanner() {
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [rows, setRows] = useState<BulkScanRow[]>([]);

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
    let owner = "";
    let repo = "";
    
    try {
      if (urlInput.includes("github.com/")) {
        const parts = urlInput.split("github.com/")[1].split("/");
        owner = parts[0];
        repo = parts[1];
      } else {
        const parts = urlInput.split("/");
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
        } else {
          throw new Error("Invalid GitHub URL or format.");
        }
      }
      
      if (!owner || !repo) throw new Error("Invalid GitHub URL format.");
    } catch {
      setError("Please provide a valid GitHub format (e.g., facebook/react or https://github.com/facebook/react)");
      return;
    }

    setIsFetchingRepo(true);
    setError(null);
    setPackageNames([]);
    setRows([]);

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
    </section>
  );
}
