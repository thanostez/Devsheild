"use client";

import { useMemo, useState } from "react";
import { Calendar, Filter } from "lucide-react";
import BreachDetailPanel from "@/components/timeline/BreachDetailPanel";
import BreachFilters from "@/components/timeline/BreachFilters";
import BreachTimeline from "@/components/timeline/BreachTimeline";
import { breachData, type BreachRecord } from "@/lib/breachData";
import {
  extractDataClasses,
  filterBreaches,
  groupBreachesByYear,
  sortBreaches,
  type BreachSort,
} from "@/lib/breachUtils";

export default function BreachTimelinePage() {
  const years = useMemo(
    () => breachData.map((item) => new Date(item.date).getFullYear()),
    [],
  );
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const [startYear, setStartYear] = useState(minYear);
  const [endYear, setEndYear] = useState(maxYear);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<BreachSort>("date");
  const [search, setSearch] = useState("");
  const [selectedBreach, setSelectedBreach] = useState<BreachRecord | null>(null);

  const dataClasses = useMemo(() => extractDataClasses(breachData), []);

  const filtered = useMemo(() => {
    const clampedStart = Math.min(startYear, endYear);
    const clampedEnd = Math.max(startYear, endYear);
    const base = filterBreaches(breachData, [clampedStart, clampedEnd], selectedClasses, search);
    return sortBreaches(base, sortBy);
  }, [endYear, search, selectedClasses, sortBy, startYear]);

  const byYear = useMemo(() => groupBreachesByYear(filtered), [filtered]);
  const yearCount = Object.keys(byYear).length;

  return (
    <div className="space-y-5 animate-fade-up">
      <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card sm:p-8">
        <div className="inline-flex rounded-md bg-accentCyan/20 p-2 text-accentCyan">
          <Calendar className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-textPrimary">Breach Timeline Explorer</h1>
        <p className="mt-2 max-w-3xl text-sm text-textSecondary">
          Explore a static timeline dataset of major and publicly documented breach events from 2007 onward. Filter
          by year, data class, and size to focus on relevant exposures.
        </p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-primaryBg p-3">
            <p className="text-textSecondary">Visible breaches</p>
            <p className="text-xl font-semibold text-textPrimary">{filtered.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-primaryBg p-3">
            <p className="text-textSecondary">Year span</p>
            <p className="text-xl font-semibold text-textPrimary">
              {Math.min(startYear, endYear)} - {Math.max(startYear, endYear)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-primaryBg p-3">
            <p className="text-textSecondary">Active years</p>
            <p className="text-xl font-semibold text-textPrimary">{yearCount}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondaryBg px-3 py-2 text-xs text-textSecondary">
            <Filter className="h-4 w-4" />
            Filter panel
          </div>
          <BreachFilters
            minYear={minYear}
            maxYear={maxYear}
            startYear={startYear}
            endYear={endYear}
            dataClasses={dataClasses}
            selectedClasses={selectedClasses}
            sortBy={sortBy}
            search={search}
            onStartYearChange={setStartYear}
            onEndYearChange={setEndYear}
            onToggleClass={(value) => {
              setSelectedClasses((prev) =>
                prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
              );
            }}
            onSortChange={setSortBy}
            onSearchChange={setSearch}
            onReset={() => {
              setStartYear(minYear);
              setEndYear(maxYear);
              setSelectedClasses([]);
              setSortBy("date");
              setSearch("");
            }}
          />
        </div>

        <BreachTimeline breaches={filtered} onSelect={setSelectedBreach} />
      </div>

      <section className="rounded-xl border border-border bg-secondaryBg p-5 shadow-card">
        <h2 className="text-lg font-semibold text-textPrimary">Selected Results</h2>
        <div className="mt-3 grid gap-2">
          {filtered.slice(0, 12).map((breach) => (
            <button
              key={breach.id}
              type="button"
              onClick={() => setSelectedBreach(breach)}
              className="flex items-center justify-between rounded-lg border border-border bg-primaryBg px-3 py-2 text-left text-sm transition hover:border-accentBlue"
            >
              <span className="text-textPrimary">{breach.name}</span>
              <span className="text-xs text-textSecondary">
                {breach.date} - {breach.pwnCount.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </section>

      <BreachDetailPanel breach={selectedBreach} onClose={() => setSelectedBreach(null)} />
    </div>
  );
}
