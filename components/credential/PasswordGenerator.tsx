"use client";

import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { evaluatePasswordStrength } from "@/components/credential/PasswordStrengthMeter";

function strengthColor(label: string): string {
  if (label === "Very Strong") return "bg-success/20 text-success";
  if (label === "Strong") return "bg-accentCyan/20 text-accentCyan";
  if (label === "Good") return "bg-warning/20 text-warning";
  return "bg-danger/20 text-danger";
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async () => {
    setIsLoading(true);
    setError(null);
    setCopied(null);
    try {
      const query = new URLSearchParams({
        len: String(length),
        sym: String(includeSymbols),
        num: "5",
      });
      const response = await fetch(`/api/password/generate?${query.toString()}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Generation failed." }));
        throw new Error(body.error || "Generation failed.");
      }
      const data = (await response.json()) as string[];
      setPasswords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setPasswords([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Password Generator</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs text-textSecondary">
          Length
          <select
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textPrimary outline-none focus:border-accentBlue"
          >
            {[12, 16, 20, 24].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-textPrimary sm:pt-6">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(event) => setIncludeSymbols(event.target.checked)}
            className="h-4 w-4 rounded border-border bg-primaryBg"
          />
          Include symbols
        </label>

        <button
          type="button"
          onClick={generate}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-4 py-2 text-sm font-semibold text-textPrimary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isLoading ? "Generating..." : "Generate Secure Alternatives"}
        </button>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {passwords.length > 0 ? (
        <div className="space-y-2">
          {passwords.map((password) => {
            const strength = evaluatePasswordStrength(password);
            return (
              <div
                key={password}
                className="flex flex-col gap-2 rounded-lg border border-border bg-primaryBg p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <code className="overflow-x-auto text-sm text-textPrimary">{password}</code>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${strengthColor(strength.label)}`}>
                    {strength.label}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(password);
                        setCopied(password);
                        setTimeout(() => setCopied(null), 1200);
                      } catch {
                        setCopied(null);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-textSecondary hover:text-textPrimary"
                  >
                    {copied === password ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === password ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

