"use client";

import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Fragment } from "react";
import { useMemo, useState } from "react";
import type { CveItem } from "@/lib/npmAuditClient";

type SortKey = "id" | "severity" | "cvss" | "published";

interface CVETableProps {
  cves: CveItem[];
}

const severityOrder = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  UNKNOWN: 0,
};

function normalizeSeverity(severity: string): keyof typeof severityOrder {
  const upper = severity.toUpperCase();
  if (upper.includes("CRITICAL")) return "CRITICAL";
  if (upper.includes("HIGH")) return "HIGH";
  if (upper.includes("MEDIUM")) return "MEDIUM";
  if (upper.includes("LOW")) return "LOW";
  return "UNKNOWN";
}

function severityBadgeColor(severity: string) {
  const normalized = normalizeSeverity(severity);
  if (normalized === "CRITICAL") return "bg-critical/20 text-critical";
  if (normalized === "HIGH") return "bg-danger/20 text-danger";
  if (normalized === "MEDIUM") return "bg-warning/20 text-warning";
  return "bg-success/20 text-success";
}

export default function CVETable({ cves }: CVETableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const clone = [...cves];
    clone.sort((a, b) => {
      let result = 0;

      if (sortKey === "id") {
        result = a.id.localeCompare(b.id);
      } else if (sortKey === "severity") {
        result =
          severityOrder[normalizeSeverity(a.severity)] -
          severityOrder[normalizeSeverity(b.severity)];
      } else if (sortKey === "cvss") {
        result = (a.cvss || 0) - (b.cvss || 0);
      } else if (sortKey === "published") {
        result = new Date(a.published || 0).getTime() - new Date(b.published || 0).getTime();
      }

      return direction === "asc" ? result : -result;
    });

    return clone;
  }, [cves, direction, sortKey]);

  const sortBy = (key: SortKey) => {
    if (sortKey === key) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setDirection("desc");
  };

  if (cves.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
        <h2 className="text-lg font-semibold text-textPrimary">Known CVEs</h2>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-success">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm">No CVEs found for this package.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Known CVEs ({cves.length})</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-textSecondary">
            <tr>
              <th className="px-3 py-2">
                <button type="button" onClick={() => sortBy("id")} className="inline-flex items-center gap-1">
                  CVE ID
                </button>
              </th>
              <th className="px-3 py-2">
                <button type="button" onClick={() => sortBy("severity")} className="inline-flex items-center gap-1">
                  Severity
                </button>
              </th>
              <th className="px-3 py-2">
                <button type="button" onClick={() => sortBy("cvss")} className="inline-flex items-center gap-1">
                  CVSS
                </button>
              </th>
              <th className="px-3 py-2">
                <button type="button" onClick={() => sortBy("published")} className="inline-flex items-center gap-1">
                  Published
                </button>
              </th>
              <th className="px-3 py-2">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((item) => {
              const isOpen = expanded === item.id;
              return (
                <Fragment key={item.id}>
                  <tr className="align-top">
                    <td className="px-3 py-3 font-mono text-xs text-textPrimary">{item.id}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${severityBadgeColor(item.severity)}`}>
                        {normalizeSeverity(item.severity)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-textPrimary">{item.cvss?.toFixed(1) || "0.0"}</td>
                    <td className="px-3 py-3 text-textSecondary">
                      {item.published ? new Date(item.published).toLocaleDateString() : "Unknown"}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.id)}
                        className="inline-flex items-center gap-1 text-xs text-accentBlue"
                      >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {isOpen ? "Hide" : "Expand"}
                      </button>
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr>
                      <td colSpan={5} className="bg-primaryBg/40 px-3 py-3 text-xs text-textSecondary">
                        {item.description || "No description available."}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
