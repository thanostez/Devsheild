"use client";

import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { scanDependencies, type BulkScanRow } from "@/lib/npmAuditClient";
import { getRiskColor, getRiskLabel } from "@/lib/riskScore";

interface ParsedPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export default function BulkUpload() {
  const [error, setError] = useState<string | null>(null);
  const [packageNames, setPackageNames] = useState<string[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [rows, setRows] = useState<BulkScanRow[]>([]);

  const progressPercent = useMemo(() => {
    if (progress.total === 0) return 0;
    return Math.round((progress.done / progress.total) * 100);
  }, [progress]);

  const parseContent = (content: string) => {
    try {
      const data = JSON.parse(content) as ParsedPackageJson;
      const names = Array.from(
        new Set([
          ...Object.keys(data.dependencies || {}),
          ...Object.keys(data.devDependencies || {}),
        ]),
      );

      if (names.length === 0) {
        setError("No dependencies/devDependencies found in package.json.");
        setPackageNames([]);
        setRows([]);
        return;
      }

      setError(null);
      setPackageNames(names);
      setRows([]);
      setProgress({ done: 0, total: names.length });
    } catch {
      setError("Invalid JSON file. Please upload a valid package.json.");
      setPackageNames([]);
      setRows([]);
    }
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    const content = await file.text();
    parseContent(content);
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
      <h2 className="text-lg font-semibold text-textPrimary">Bulk Upload package.json</h2>

      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-primaryBg p-8 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={async (event) => {
          event.preventDefault();
          await onFile(event.dataTransfer.files?.[0] || null);
        }}
      >
        <Upload className="h-8 w-8 text-accentBlue" />
        <p className="text-sm text-textPrimary">Drag & drop package.json or click to upload</p>
        <p className="text-xs text-textSecondary">We parse dependencies and scan each package risk.</p>
        <input
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (event) => {
            await onFile(event.target.files?.[0] || null);
          }}
        />
      </label>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {packageNames.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-textSecondary">Detected packages: {packageNames.length}</p>
          <button
            type="button"
            onClick={startScan}
            disabled={isScanning}
            className="rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary transition hover:opacity-90 disabled:opacity-70"
          >
            {isScanning ? "Scanning..." : "Start Scan"}
          </button>

          {(isScanning || progress.done > 0) && progress.total > 0 ? (
            <div>
              <p className="mb-1 text-xs text-textSecondary">
                Progress: {progress.done}/{progress.total}
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
        <div className="overflow-x-auto">
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
                  <td className="px-3 py-3 text-textSecondary">{row.cveCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
