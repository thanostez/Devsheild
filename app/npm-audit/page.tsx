"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  Bug,
  Gauge,
  Shield,
  Sparkles,
  Upload,
  Wrench,
  Share2,
  Check,
} from "lucide-react";
import SearchBar from "@/components/npm/SearchBar";
import OverallScoreRing from "@/components/npm/OverallScoreRing";
import SubScoreCard from "@/components/npm/SubScoreCard";
import CVETable from "@/components/npm/CVETable";
import DownloadChart from "@/components/npm/DownloadChart";
import PackageMetaCard from "@/components/npm/PackageMetaCard";
import DependencyTree from "@/components/npm/DependencyTree";
import BulkUpload from "@/components/npm/BulkUpload";
import GithubScanner from "@/components/npm/GithubScanner";
import Skeleton from "@/components/ui/Skeleton";
import { analyzePackage } from "@/lib/npmAuditClient";
import { getRiskColor, getRiskLabel } from "@/lib/riskScore";

type Tab = "single" | "github" | "bulk" | "compare";

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

export default function NpmAuditPage() {
  const [tab, setTab] = useState<Tab>("single");
  const [activePackage, setActivePackage] = useState("");
  const [searchInitial, setSearchInitial] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  const [compareLeftInput, setCompareLeftInput] = useState("");
  const [compareRightInput, setCompareRightInput] = useState("");
  const [compareLeft, setCompareLeft] = useState("");
  const [compareRight, setCompareRight] = useState("");

  const singleQuery = useQuery({
    queryKey: ["npm-audit", activePackage],
    queryFn: () => analyzePackage(activePackage),
    enabled: activePackage.trim().length > 0,
  });

  const compareResults = useQueries({
    queries: [
      {
        queryKey: ["npm-compare", "left", compareLeft],
        queryFn: () => analyzePackage(compareLeft),
        enabled: compareLeft.trim().length > 0,
      },
      {
        queryKey: ["npm-compare", "right", compareRight],
        queryFn: () => analyzePackage(compareRight),
        enabled: compareRight.trim().length > 0,
      },
    ],
  });

  const [leftQuery, rightQuery] = compareResults;

  const compareReady = useMemo(
    () => compareLeft.length > 0 && compareRight.length > 0,
    [compareLeft, compareRight],
  );

  const isSingleLoading = singleQuery.isFetching;
  const singleError = singleQuery.error instanceof Error ? singleQuery.error.message : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pkg = params.get("package")?.trim();
    if (pkg) {
      setActivePackage(pkg);
      setSearchInitial(pkg);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-row flex-wrap gap-2 w-full rounded-lg border border-border bg-secondaryBg p-1 sm:w-max">
        {[
          { key: "single", label: "Single Package", icon: Shield },
          { key: "github", label: "GitHub Repo", icon: Sparkles },
          { key: "bulk", label: "Bulk Upload", icon: Upload },
          { key: "compare", label: "Compare", icon: Sparkles },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key as Tab)}
            className={`flex-1 sm:flex-none justify-center inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs sm:text-sm transition-colors ${
              tab === item.key
                ? "bg-primaryBg text-textPrimary shadow-sm"
                : "text-textSecondary hover:text-textPrimary hover:bg-primaryBg/50"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {tab === "single" ? (
        <>
          <SearchBar
            initialValue={searchInitial}
            isLoading={isSingleLoading}
            onSearch={(name) => {
              setActivePackage(name);
              const next = new URL(window.location.href);
              next.searchParams.set("package", name);
              window.history.replaceState({}, "", next.toString());
            }}
          />

          {isSingleLoading ? <LoadingSkeleton /> : null}

          {!isSingleLoading && singleError ? (
            <section className="rounded-xl border border-danger/40 bg-danger/10 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-danger">
                <AlertTriangle className="h-5 w-5" />
                Unable to complete package audit
              </h2>
              <p className="mt-2 text-sm text-textSecondary">
                {singleError.includes("not found")
                  ? "Package not found. Please verify the package name and try again."
                  : singleError}
              </p>
            </section>
          ) : null}

          {!isSingleLoading && singleQuery.data ? (
            <div className="space-y-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    const shareUrl = `${window.location.origin}/npm-audit?package=${encodeURIComponent(
                      singleQuery.data.packageName,
                    )}`;
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      setShareCopied(true);
                      setTimeout(() => setShareCopied(false), 1200);
                    } catch {
                      setShareCopied(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-primaryBg px-3 py-2 text-xs text-textSecondary hover:text-textPrimary"
                >
                  {shareCopied ? <Check className="h-3.5 w-3.5 text-success" /> : <Share2 className="h-3.5 w-3.5" />}
                  {shareCopied ? "Copied URL" : "Share Result"}
                </button>
              </div>
              <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
                <OverallScoreRing score={singleQuery.data.overallRisk} />
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SubScoreCard label="Security" score={singleQuery.data.subScores.security} icon={Shield} />
                  <SubScoreCard label="Maintenance" score={singleQuery.data.subScores.maintenance} icon={Wrench} />
                  <SubScoreCard label="Popularity" score={singleQuery.data.subScores.popularity} icon={BarChart3} />
                  <SubScoreCard label="Quality" score={singleQuery.data.subScores.quality} icon={Gauge} />
                </section>
              </div>

              <CVETable cves={singleQuery.data.cves} />

              <div className="grid gap-4 xl:grid-cols-2">
                <DownloadChart data={singleQuery.data.downloads} />
                <PackageMetaCard
                  packageName={singleQuery.data.packageName}
                  metadata={singleQuery.data.metadata}
                  github={singleQuery.data.github}
                />
              </div>

              <DependencyTree packageName={singleQuery.data.packageName} />
            </div>
          ) : null}
        </>
      ) : null}

      {tab === "bulk" ? <BulkUpload /> : null}

      {tab === "github" ? <GithubScanner /> : null}

      {tab === "compare" ? (
        <section className="space-y-4 rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
          <h2 className="text-xl font-semibold text-textPrimary">Compare Packages</h2>
          <p className="text-sm text-textSecondary">
            Compare risk scores side-by-side to choose the safer dependency.
          </p>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={compareLeftInput}
              onChange={(event) => setCompareLeftInput(event.target.value)}
              placeholder="First package (e.g. lodash)"
              className="rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textPrimary outline-none focus:border-accentBlue"
            />
            <input
              value={compareRightInput}
              onChange={(event) => setCompareRightInput(event.target.value)}
              placeholder="Second package (e.g. dayjs)"
              className="rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textPrimary outline-none focus:border-accentBlue"
            />
            <button
              type="button"
              onClick={() => {
                setCompareLeft(compareLeftInput.trim());
                setCompareRight(compareRightInput.trim());
              }}
              className="rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary"
            >
              Compare
            </button>
          </div>

          {compareReady && (leftQuery.isFetching || rightQuery.isFetching) ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-40 animate-pulse rounded-xl bg-primaryBg" />
              <div className="h-40 animate-pulse rounded-xl bg-primaryBg" />
            </div>
          ) : null}

          {compareReady && leftQuery.data && rightQuery.data ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[leftQuery.data, rightQuery.data].map((result) => (
                <article key={result.packageName} className="rounded-xl border border-border bg-primaryBg p-5">
                  <h3 className="text-lg font-semibold text-textPrimary">{result.packageName}</h3>
                  <p className="mt-1 text-sm text-textSecondary">{result.metadata.description || "No description."}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-textSecondary">Risk Score</p>
                      <p className="font-semibold" style={{ color: getRiskColor(result.overallRisk) }}>
                        {result.overallRisk} ({getRiskLabel(result.overallRisk)})
                      </p>
                    </div>
                    <div>
                      <p className="text-textSecondary">CVEs</p>
                      <p className="font-semibold text-textPrimary">{result.cves.length}</p>
                    </div>
                    <div>
                      <p className="text-textSecondary">Security</p>
                      <p className="font-semibold text-textPrimary">{result.subScores.security}</p>
                    </div>
                    <div>
                      <p className="text-textSecondary">Maintenance</p>
                      <p className="font-semibold text-textPrimary">{result.subScores.maintenance}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {compareReady && (leftQuery.isError || rightQuery.isError) ? (
            <p className="text-sm text-danger">Could not compare one or both packages. Verify package names and retry.</p>
          ) : null}

          {!compareReady ? (
            <p className="text-sm text-textSecondary">Enter two package names to begin comparison.</p>
          ) : null}

          <div className="rounded-lg border border-border bg-primaryBg p-3 text-xs text-textSecondary">
            <p className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-danger" />
              Higher risk score means greater risk (0 = safer, 100 = critical risk).
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
