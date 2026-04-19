"use client";

import Link from "next/link";
import { Calendar, ExternalLink, ShieldAlert, Users, X } from "lucide-react";
import type { BreachRecord } from "@/lib/breachData";

interface BreachDetailPanelProps {
  breach: BreachRecord | null;
  onClose: () => void;
}

export default function BreachDetailPanel({ breach, onClose }: BreachDetailPanelProps) {
  if (!breach) return null;

  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full border-l border-border bg-secondaryBg p-6 shadow-card sm:max-w-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary">{breach.name}</h2>
          <p className="mt-1 text-sm text-textSecondary">{new Date(breach.date).toDateString()}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border p-2 text-textSecondary hover:text-textPrimary"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-3 rounded-lg border border-border bg-primaryBg p-4 text-sm">
        <p className="flex items-center gap-2 text-textSecondary">
          <Users className="h-4 w-4 text-warning" />
          Affected records: <span className="font-semibold text-textPrimary">{breach.pwnCount.toLocaleString()}</span>
        </p>
        <p className="flex items-center gap-2 text-textSecondary">
          <Calendar className="h-4 w-4 text-accentCyan" />
          Date: <span className="font-semibold text-textPrimary">{breach.date}</span>
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 text-textSecondary">{breach.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {breach.dataClasses.map((item) => (
          <span key={item} className="rounded bg-danger/10 px-2 py-1 text-xs text-danger">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Link
          href={`/credential-check?breach=${encodeURIComponent(breach.name)}`}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary"
        >
          <ShieldAlert className="h-4 w-4" />
          Check If You Were Affected
        </Link>
        <a
          href={`https://${breach.domain}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-sm text-accentBlue hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Open Related Domain
        </a>
      </div>
    </aside>
  );
}

