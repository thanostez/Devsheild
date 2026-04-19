"use client";

import { AlertTriangle, ChevronDown, ChevronUp, ShieldOff } from "lucide-react";
import { useMemo, useState } from "react";

export interface BreachSource {
  name: string;
  date: string;
  fields?: string[];
  unverified?: number;
}

type FieldSeverity = "critical" | "moderate" | "low";

function getFieldSeverity(field: string): FieldSeverity {
  const value = field.toLowerCase();
  if (
    value.includes("password") ||
    value.includes("credit") ||
    value.includes("card") ||
    value.includes("ssn") ||
    value.includes("social security") ||
    value.includes("financial") ||
    value.includes("bank")
  ) {
    return "critical";
  }

  if (value.includes("phone") || value.includes("address") || value.includes("location")) {
    return "moderate";
  }

  return "low";
}

function getSeverityClass(severity: FieldSeverity): string {
  if (severity === "critical") return "bg-critical/20 text-critical";
  if (severity === "moderate") return "bg-warning/20 text-warning";
  return "bg-success/20 text-success";
}

function guessDomain(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (normalized.includes(".")) {
    return normalized.replace(/\s+/g, "");
  }

  return `${normalized.replace(/\s+/g, "")}.com`;
}

export default function BreachCard({ source }: { source: BreachSource }) {
  const [expanded, setExpanded] = useState(false);

  const tags = useMemo(() => {
    const fields = source.fields || [];
    if (fields.length === 0) return [];

    return fields.map((field) => ({
      field,
      severity: getFieldSeverity(field),
    }));
  }, [source.fields]);

  return (
    <article className="rounded-xl border border-border bg-secondaryBg p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(guessDomain(source.name))}&sz=64`}
            alt={source.name}
            className="h-8 w-8 rounded-md border border-border bg-primaryBg"
          />
          <div>
            <h3 className="text-base font-semibold text-textPrimary">{source.name}</h3>
            <p className="text-xs text-textSecondary">Breach date: {source.date}</p>
          </div>
        </div>

        {source.unverified === 1 ? (
          <span className="inline-flex items-center gap-1 rounded bg-warning/20 px-2 py-1 text-xs font-medium text-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            Unverified
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={`${source.name}-${tag.field}`}
              className={`rounded px-2 py-1 text-xs font-medium ${getSeverityClass(tag.severity)}`}
            >
              {tag.field}
            </span>
          ))
        ) : (
          <span className="rounded bg-border/40 px-2 py-1 text-xs text-textSecondary">No field detail provided</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 inline-flex items-center gap-1 text-xs text-accentBlue hover:underline"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {expanded ? "Hide breach context" : "Show breach context"}
      </button>

      {expanded ? (
        <div className="mt-3 rounded-lg border border-border bg-primaryBg p-3 text-xs text-textSecondary">
          <p className="flex items-center gap-2">
            <ShieldOff className="h-4 w-4 text-danger" />
            This source indicates leaked credential data associated with the searched email.
          </p>
        </div>
      ) : null}
    </article>
  );
}

