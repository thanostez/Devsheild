"use client";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";

interface EmailInputProps {
  isLoading: boolean;
  onSubmit: (email: string) => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function EmailInput({ isLoading, onSubmit }: EmailInputProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Email Breach Scanner</h2>
      <p className="mt-2 text-sm text-textSecondary">
        Check whether an email appears in known public breach datasets.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative block flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const normalized = email.trim().toLowerCase();
                if (!isValidEmail(normalized)) {
                  setError("Enter a valid email address.");
                  return;
                }
                onSubmit(normalized);
              }
            }}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-border bg-primaryBg py-3 pl-10 pr-4 text-sm text-textPrimary outline-none transition focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/25"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            const normalized = email.trim().toLowerCase();
            if (!isValidEmail(normalized)) {
              setError("Enter a valid email address.");
              return;
            }
            onSubmit(normalized);
          }}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-5 py-3 text-sm font-semibold text-textPrimary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Checking..." : "Check Breaches"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <p className="mt-4 text-xs text-textSecondary">
        We proxy all requests. Your email is never stored.
      </p>
    </section>
  );
}

