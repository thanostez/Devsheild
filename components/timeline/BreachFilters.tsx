"use client";

import type { BreachSort } from "@/lib/breachUtils";

interface BreachFiltersProps {
  minYear: number;
  maxYear: number;
  startYear: number;
  endYear: number;
  dataClasses: string[];
  selectedClasses: string[];
  sortBy: BreachSort;
  search: string;
  onStartYearChange: (value: number) => void;
  onEndYearChange: (value: number) => void;
  onToggleClass: (value: string) => void;
  onSortChange: (value: BreachSort) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function BreachFilters({
  minYear,
  maxYear,
  startYear,
  endYear,
  dataClasses,
  selectedClasses,
  sortBy,
  search,
  onStartYearChange,
  onEndYearChange,
  onToggleClass,
  onSortChange,
  onSearchChange,
  onReset,
}: BreachFiltersProps) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-secondaryBg p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-textPrimary">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-accentBlue hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-textSecondary">
          Start Year
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={startYear}
            onChange={(event) => onStartYearChange(Number(event.target.value))}
            className="mt-2 w-full"
          />
          <span className="mt-1 block text-sm text-textPrimary">{startYear}</span>
        </label>

        <label className="text-xs text-textSecondary">
          End Year
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={endYear}
            onChange={(event) => onEndYearChange(Number(event.target.value))}
            className="mt-2 w-full"
          />
          <span className="mt-1 block text-sm text-textPrimary">{endYear}</span>
        </label>
      </div>

      <label className="block text-xs text-textSecondary">
        Search Breach Name
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by breach name..."
          className="mt-2 w-full rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textPrimary outline-none focus:border-accentBlue"
        />
      </label>

      <label className="block text-xs text-textSecondary">
        Sort By
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as BreachSort)}
          className="mt-2 w-full rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textPrimary outline-none focus:border-accentBlue"
        >
          <option value="date">Date</option>
          <option value="size">Size</option>
          <option value="severity">Severity</option>
        </select>
      </label>

      <div>
        <p className="text-xs text-textSecondary">Data Classes</p>
        <div className="mt-2 max-h-40 space-y-1 overflow-auto rounded-lg border border-border bg-primaryBg p-3">
          {dataClasses.map((item) => {
            const checked = selectedClasses.includes(item);
            return (
              <label key={item} className="flex items-center gap-2 text-xs text-textSecondary">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleClass(item)}
                  className="h-3.5 w-3.5 rounded border-border bg-primaryBg"
                />
                <span className={checked ? "text-textPrimary" : ""}>{item}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}

