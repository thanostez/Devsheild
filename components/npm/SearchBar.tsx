"use client";

import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const RECENT_KEY = "devshield:npm:recent";

interface SearchBarProps {
  onSearch: (packageName: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export default function SearchBar({ onSearch, isLoading, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as string[];
      setRecent(parsed.slice(0, 6));
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea" || target.isContentEditable) return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const canSearch = useMemo(() => value.trim().length > 0, [value]);

  const submit = (name: string) => {
    const normalized = name.trim();
    if (!normalized) return;

    const nextRecent = [normalized, ...recent.filter((item) => item !== normalized)].slice(0, 6);
    setRecent(nextRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
    onSearch(normalized);
  };

  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card sm:p-8">
      <h1 className="text-2xl font-semibold text-textPrimary sm:text-3xl">npm Package Risk Analyzer</h1>
      <p className="mt-2 text-sm text-textSecondary sm:text-base">
        Search any npm package to inspect risk, vulnerabilities, maintenance health, and ecosystem signals.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative block flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
          <input
            ref={inputRef}
            id="npm-search-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submit(value);
              }
            }}
            placeholder="Search any npm package..."
            className="w-full rounded-lg border border-border bg-primaryBg py-3 pl-10 pr-4 text-textPrimary outline-none transition focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/25"
          />
        </label>

        <button
          type="button"
          onClick={() => submit(value)}
          disabled={!canSearch || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-6 py-3 text-sm font-semibold text-textPrimary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? "Scanning..." : "Audit Package"}
        </button>
      </div>

      {recent.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-textSecondary">Recent:</span>
          {recent.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setValue(item);
                submit(item);
              }}
              className="rounded-md border border-border bg-primaryBg px-2 py-1 text-xs text-textSecondary transition hover:text-textPrimary"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-3 text-xs text-textDim">Tip: press `/` to focus package search.</p>
    </section>
  );
}
