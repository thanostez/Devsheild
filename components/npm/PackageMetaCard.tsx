import { Clock, ExternalLink, FileText, GitBranch, Star, Users } from "lucide-react";
import type { GithubData, PackageMetadata } from "@/lib/npmAuditClient";

interface PackageMetaCardProps {
  metadata: PackageMetadata;
  github: GithubData | null;
  packageName: string;
}

function getLicenseClass(license: string | null): string {
  if (!license) return "bg-danger/20 text-danger";
  const upper = license.toUpperCase();
  if (upper.includes("MIT") || upper.includes("APACHE")) return "bg-success/20 text-success";
  return "bg-warning/20 text-warning";
}

function fromNow(dateInput: string | null): string {
  if (!dateInput) return "Unknown";

  const now = Date.now();
  const then = new Date(dateInput).getTime();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));

  if (days <= 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

export default function PackageMetaCard({ metadata, github, packageName }: PackageMetaCardProps) {
  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-textPrimary">
            {metadata.name}
            {metadata.version ? <span className="ml-2 text-textSecondary">v{metadata.version}</span> : null}
          </h2>
          <p className="mt-1 text-sm text-textSecondary">{metadata.description || "No description provided."}</p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-semibold ${getLicenseClass(metadata.license)}`}>
          {metadata.license || "Unknown License"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-textSecondary">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Last published: {fromNow(metadata.lastPublishDate)}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Maintainers: {metadata.maintainers.length}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {metadata.maintainers.slice(0, 6).map((maintainer) => (
          <div
            key={`${maintainer.name}-${maintainer.email}`}
            className="flex items-center gap-2 rounded-md border border-border bg-primaryBg px-3 py-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(maintainer.name || "Maintainer")}&background=1A2035&color=F1F5F9&size=32`}
              alt={maintainer.name || "Maintainer"}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-xs text-textPrimary">{maintainer.name || "Unknown"}</span>
            {maintainer.email ? <span className="text-xs text-textDim">{maintainer.email}</span> : null}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2 text-sm">
        <a
          href={`https://www.npmjs.com/package/${packageName}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-accentBlue hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Open npm package page
        </a>

        {metadata.repository ? (
          <a
            href={metadata.repository}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-accentBlue hover:underline"
          >
            <GitBranch className="h-4 w-4" />
            Open GitHub repository
          </a>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2 rounded-lg border border-border bg-primaryBg p-4 text-xs text-textSecondary sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-warning" />
          Stars: <span className="text-textPrimary">{github?.stars?.toLocaleString() || "n/a"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-danger" />
          Open issues: <span className="text-textPrimary">{github?.open_issues?.toLocaleString() || "n/a"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-accentCyan" />
          Last push: <span className="text-textPrimary">{fromNow(github?.last_push || null)}</span>
        </div>
      </div>
    </section>
  );
}
