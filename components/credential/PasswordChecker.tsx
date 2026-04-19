"use client";

import { AlertTriangle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import PasswordStrengthMeter from "@/components/credential/PasswordStrengthMeter";
import { checkHashInList, getKAnonPrefix, sha1 } from "@/lib/sha1";

function getRiskLabel(count: number): { label: string; color: string } {
  if (count === 0) return { label: "Not found in known breaches", color: "#10B981" };
  if (count < 1000) return { label: "Low breach exposure", color: "#F59E0B" };
  if (count < 100000) return { label: "High breach exposure", color: "#EF4444" };
  return { label: "Critical breach exposure", color: "#DC2626" };
}

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    if (!password) {
      setError("Enter a password to check.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setCount(null);

    try {
      const fullHash = await sha1(password);
      const prefix = getKAnonPrefix(fullHash);
      const response = await fetch(`/api/hibp/password?prefix=${encodeURIComponent(prefix)}`);

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Password check failed." }));
        throw new Error(body.error || "Password check failed.");
      }

      const raw = await response.text();
      const matches = checkHashInList(fullHash, raw);
      setCount(matches);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password check failed.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const risk = count === null ? null : getRiskLabel(count);

  return (
    <section className="space-y-4 rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Password Breach Checker</h2>
      <p className="text-sm text-textSecondary">
        SHA-1 hashing happens in your browser. Only the first 5 hash characters are sent.
      </p>

      <label className="relative block">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
        <input
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter password to check..."
          className="w-full rounded-lg border border-border bg-primaryBg py-3 pl-10 pr-12 text-sm text-textPrimary outline-none transition focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/25"
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
          aria-label="Toggle password visibility"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </label>

      <PasswordStrengthMeter password={password} />

      <button
        type="button"
        onClick={runCheck}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-5 py-3 text-sm font-semibold text-textPrimary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isLoading ? "Checking..." : "Check Password"}
      </button>

      {error ? (
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </p>
      ) : null}

      {count !== null ? (
        <div className="rounded-lg border border-border bg-primaryBg p-4">
          <p className="text-sm text-textSecondary">Times seen in public breach datasets</p>
          <p className="mt-1 text-2xl font-bold text-textPrimary">{count.toLocaleString()}</p>
          <p className="mt-2 text-sm font-semibold" style={{ color: risk?.color }}>
            {risk?.label}
          </p>
        </div>
      ) : null}
    </section>
  );
}

